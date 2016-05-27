<?php
class Kwf_Ext_Assets_ScssPreProcessor_PreProcessor
{
    public function preProcess($rootFile)
    {
        $rootFile = realpath($rootFile);

        $prependSass = '
        @function is-null($value) {
            @return type-of($value) == \'null\' or type-of($value) == \'string\';
        }

        @import \'vendor/bower_components/extjs/classic/theme-base/sass/etc/functions.scss\';


        @function file_join($path1, $path2) {
            @return $path1 + \'/\' + $path2;
        }

        @function dynamic($args...) {
            @if length($args) == 1 {
                @return nth($args, 1);
            }
            @return $args;
        }

        @function map_create() {
            @return ();
        }
        /*
        @function map_get($map, $key) {
        @return map-get($map, $key)
        }
        */
        @function map_put($map, $key, $value) {
            $new: ($key: $value);
            @return map-merge($map, $new);
        }

        @function parsebox($list, $n) {
            @if get-type($list) != \'list\' {
                $list: ($list);
            }
            @if length($list) == 1 {
                $list: (nth($list, 1), nth($list, 1), nth($list, 1), nth($list, 1));
            } @elseif length($list) == 2 {
                $list: (nth($list, 1), nth($list, 2), nth($list, 1), nth($list, 2));
            } @elseif length($list) == 3 {
                $list: (nth($list, 1), nth($list, 2), nth($list, 3), nth($list, 1));
            }

            @return nth($list, $n);
        }


        // Ported JS implementation to sass
        // Whyever they did that in JS?!
        //
        // This function parses arguments from all formats accepted by the font-icon()
        // sass mixin and returns an array that always contains 4 elements in the following
        // order: character, font-size, font-family, rotation
        @function parseFontIconArgs($glyph) {

            $newItems: (null, null, null, null);

            @if (type-of($glyph) == list) {
                $items: $glyph;
                $len: length($items);
                $newItems: set-nth($newItems, 1, nth($items, 1));

                @if ($len == 2) {
                    $item: nth($items, 2);

                    @if (type-of($item) == number) {
                        @if not(unitless($item)) {
                            $newItems: set-nth($newItems, 2, $item);
                        } @else {
                            $newItems: set-nth($newItems, 4, $item);
                        }
                    } @else {
                        $newItems: set-nth($newItems, 3, $item);
                    }
                } @else if ($len == 3) {
                    @if (type-of(nth($items, 2)) == number) {
                        $newItems: set-nth($newItems, 2, nth($items, 2));
                        @if (type-of(nth($items, 3)) == number) {
                            $newItems: set-nth($newItems, 4, nth($items, 3));
                        } @else {
                            $newItems: set-nth($newItems, 3, nth($items, 3));
                        }
                    } @else {
                        $newItems: set-nth($newItems, 3, nth($items, 2));
                        $newItems: set-nth($newItems, 4, nth($items, 3));
                    }
                } @else {
                    $newItems: set-nth($newItems, 2, nth($items, 2));
                    $newItems: set-nth($newItems, 3, nth($items, 3));
                    $newItems: set-nth($newItems, 4, nth($items, 4));
                }
            } @else {
                $newItems: set-nth($newItems, 1, $glyph);
            }
            @return $newItems;
        }
        ';

        $this->_dynamicValues = array();

        $this->_files = array();
        $this->_walkIncludes($rootFile);

        foreach (array_reverse($this->_dynamicValues) as $name=>$value) {
            $this->_dynamicValues[$name] = $this->_findIndirectDynamicValues($value);
        }

        //evaluate dynamicValues value, also set values set without dynamic()
        foreach ($this->_files as $file=>$contents) {

            do {
                $replacedContents = preg_replace('#@(if|else|mixin).*?{.*?}#is', '', $contents);
                if ($contents == $replacedContents) {
                    break;
                }
                $contents = $replacedContents;
            } while (true);

            //remove mixin call with named arguments, those don't change dynamicValue so we can ignore them
            $contents = preg_replace('#@include [a-z0-9-]+\(.*?\)#is', '', $contents);

            //remove comments
            $contents = preg_replace('#/\*.*?\*/#s', '', $contents);

            $dynamicValues = &$this->_dynamicValues;
            $contents = preg_replace_callback('#(\$[a-zA-Z-0-9]+)(\s*:\s*)(.*?);#', function($m) use (&$dynamicValues, $file) {
                if (isset($dynamicValues[$m[1]])) {
                    $m[3] = trim($m[3]);
                    if (substr($m[3], 0, 8) == 'dynamic(') {
                        $m[3] = substr($m[3], 8, -1);
                    }
                    $dynamicValues[$m[1]] = $m[3];
                }
                return $m[0];
            }, $contents);
        }


        //evaluateDynamicValue
        foreach (array_reverse($this->_dynamicValues) as $name=>$value) {
            $this->_dynamicValues[$name] = $this->_evaluateDynamicValue($value);
        }

        //$this->_dynamicValues['$include-ie'] = 'false';

        foreach ($this->_files as $file=>$contents) {
            //remove unsupported require() statements
            $contents = preg_replace('#require\(\'[^\']+\'\);#', '//\0', $contents);

            //remove comments
            $contents = preg_replace('#/\*.*?\*/#s', '', $contents);
            //don't: removes url('//.... $contents = preg_replace('#//.*#', '', $contents);

            //$contents = "/* ".$file."*/\n".$contents;


            $dynamicValues = &$this->_dynamicValues;
            $contents = preg_replace_callback('#(\$[a-zA-Z-0-9]+)(\s*:\s*)dynamic\((.*?)\);#', function($m) use ($dynamicValues) {
                if (isset($dynamicValues[$m[1]])) {
                    return $m[1].$m[2].$dynamicValues[$m[1]].';';
                } else {
                    return $m[0];
                }
            }, $contents);

            /*
            $contents = preg_replace_callback('#(\$[a-zA-Z-0-9]+)(\s*:\s*)dynamic\((.*?)\);#', function($m) use ($dynamicValues) {
                return '';
            }, $contents);
            */
        /*
            if (strpos($file, 'compass-mixins/lib') === false) {
                $contents = preg_replace_callback('#\$[a-zA-Z0-9-]+(\s*:)?#', function($m) use ($dynamicValues) {
                    if (isset($m[2])) {
                        //: follows, this is an assignment - don't replace it
                        return $m[0];
                    } else if (isset($dynamicValues[$m[0]])) {
                        return $dynamicValues[$m[0]];
                    } else {
                        return $m[0];
                    }
                }, $contents);
            }
        */
            if ($rootFile == $file) {
                foreach ($this->_dynamicValues as $name=>$value) {
                    $contents = "$name: $value;\n".$contents;
                }
                $contents = $prependSass."\n".$contents;
            }

            if (substr($file, 0, strlen(getcwd())) == getcwd()) {
                $file = substr($file, strlen(getcwd())+1);
            } else {
                throw new Exception('file not in cwd: '.$file);
            }

            if (!is_dir('temp/extcss/'.dirname($file))) mkdir('temp/extcss/'.dirname($file), 0777, true);
            file_put_contents('temp/extcss/'.$file, $contents);
        }

    }

    private function _evaluateDynamicValue($value)
    {
        static $stack = array();
        array_push($stack, $value);
        if (count($stack) > 50) return null;
        $dynamicValues = $this->_dynamicValues;
        $value = preg_replace_callback('#(\$[a-zA-Z0-9-]+)(\s*:)?#', function($m) use ($dynamicValues, $value, $stack) {
            if (isset($m[2])) {
                //: follows, this is an assignment - don't replace it
                return $m[0];
            } else if (isset($dynamicValues[$m[1]])) {
                $ret = $this->_evaluateDynamicValue($dynamicValues[$m[1]]); //recursion is possible
                if ($ret === null) {
                    return $m[0]; //recursion
                } else {
                    return $ret;
                }
            } else {
                return $m[0];
            }
        }, $value);
        array_pop($stack);
        return $value;

    }

    //add additional dynamicValues that are propagated indirectly thru dynamic($var) as dynamic
    private function _findIndirectDynamicValues($value)
    {
        $dynamicValues = &$this->_dynamicValues;
                                                        //negative look ahead, don't match named function/mixin arguments
        $value = preg_replace_callback('#\$[a-zA-Z0-9-]+(?!\s*:)#', function($m) use (&$dynamicValues, $value) {
            if (isset($dynamicValues[$m[0]])) {
                $this->_findIndirectDynamicValues($dynamicValues[$m[0]]); //recursion is possible
            } else {
                $dynamicValues[$m[0]] = 'null';
            }
            return $m[0];
        }, $value);
        return $value;

    }

    private function _walkIncludes($file)
    {
        $readFile = $file;
        if ($file == getcwd().'/vendor/bower_components/extjs/classic/theme-base/sass/etc/mixins/css-outline.scss') {
            $readFile = __DIR__.'/overrides/css-outline.scss';
        }
        $contents = file_get_contents($readFile);

        if ($file == getcwd().'/vendor/bower_components/extjs/classic/theme-neutral/sass/var/grid/column/Column.scss') {
            $contents = preg_replace('#(\$grid-header-height: )(\$.*)(;)#', '\1dynamic(\2)\3', $contents);
        }
        $dynamics = $this->_getDynamics($contents);
        if ($dynamics) {
            //echo $file."\n";
            //var_dump($dynamics);
            foreach ($dynamics as $name=>$value) {
                $this->_dynamicValues[$name] = $value;
            }
        }
        $this->_files[$file] = $contents;
        foreach ($this->_getIncludes($contents) as $include) {
            $includeResloved = $this->_resolveIncludePath($include, $file);
            $this->_walkIncludes($includeResloved);
        }
    }



    private function _getIncludes($contents)
    {
        if (preg_match_all('#@import +["\'](.*)["\']#', $contents, $m)) {
            return $m[1];
        } else {
            return array();
        }
    }

    private function _getDynamics($contents)
    {
        //remove comments
        $contents = preg_replace('#/\*.*?\*/#s', '', $contents);
        $contents = preg_replace('#//.*#', '', $contents);

        if (preg_match_all('#(\$[a-zA-Z-0-9]+)\s*:\s*dynamic\((.*?)\);#', $contents, $m)) {
            $ret = array();
            foreach (array_keys($m[0]) as $i) {
                $ret[$m[1][$i]] = $m[2][$i];
            }
            return $ret;
        } else {
            return array();
        }
    }

    private function _findIncludeFile($include, $includePath)
    {
        $ret = $includePath.'/'.$include;
        if (is_file($ret)) {
            $ret = $ret;
        } else if (is_file($ret.'.scss')) {
            $ret = $ret.'.scss';
        } else if (is_file(substr($ret, 0, strrpos($ret, '/')).'/_'.substr($ret, strrpos($ret, '/')+1).'.scss')) {
            $ret = substr($ret, 0, strrpos($ret, '/')).'/_'.substr($ret, strrpos($ret, '/')+1).'.scss';
        } else {
            return null;
        }
        return realpath($ret);
    }

    private function _resolveIncludePath($include, $relativeTo)
    {
        $includePaths = array(
            '.',
            dirname($relativeTo),
            'vendor/bower_components/compass-mixins/lib'
        );
        foreach ($includePaths as $p) {
            $ret = $this->_findIncludeFile($include, $p);
            if ($ret) break;
        }
        if (!$ret) throw new Exception("can't resolve '$include'");
        return $ret;
    }
}
