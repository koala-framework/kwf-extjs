<?php
class Kwf_Ext_Assets_Provider extends Kwf_Assets_Provider_Abstract
{
    public static function _getAliasClasses()
    {
        static $classes;
        if (isset($classes)) return $classes;
        $p = VENDOR_PATH.'/bower_components/extjs';
        $classes = array_merge(
            self::_getAliasClassesForPath($p.'/classic/classic/src', $p.'/classic/classic/src'),
            self::_getAliasClassesForPath($p.'/classic/classic/overrides/dom', $p.'/classic/classic'),
            self::_getAliasClassesForPath($p.'/packages/ux/classic/src', $p.'/packages'),
            self::_getAliasClassesForPath($p.'/packages/core/src', $p.'/packages/core/src')
        );
        return $classes;
    }

    private static function _getAliasClassesForPath($path, $stripPath)
    {
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), RecursiveIteratorIterator::LEAVES_ONLY);
        foreach ($it as $i) {
            if (substr($i->getPathname(), -3) != '.js') continue;
            $depName = 'Ext.'.str_replace('/', '.', substr($i->getPathname(), strlen($stripPath)+1, -3));
            if (substr($depName, 0, 6) == 'Ext.ux') $depName = str_replace('classic.src.', '', $depName);
            $fileContents = file_get_contents($i->getPathname());
            if (preg_match_all('#^\s*(//|\*) @(class|alternateClassName|define) ([a-zA-Z0-9\./]+)\s*$#m', $fileContents, $m)) {
                foreach ($m[3] as $cls) {
                    $classes[$cls] = $depName;
                }
            }

            // remove comments to avoid dependencies from docs/examples
            $fileContents = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*'.'/!', '', $fileContents);

            if (preg_match_all('#Ext\.define\(\s*([\'"])([^\'"]+)\1#', $fileContents, $m)) {
                foreach ($m[2] as $cls) {
                    $classes[$cls] = $depName;
                }
            }
            if (preg_match_all('#^\s*(alternateClassName|alias)\s*:\s*\'([a-zA-Z0-9\.]+)\'\s*,?\s*$#m', $fileContents, $m)) {
                foreach ($m[2] as $i) {
                    $classes[$i] = $depName;
                }
            }
            if (preg_match_all('#^\s*(alternateClassName|alias)\s*:\s*\[([^\]]+)\]\s*,?\s*$#m', $fileContents, $m)) {
                foreach ($m[2] as $j) {
                    if (preg_match_all('#\'([a-zA-Z0-9\._]+)\'#', $j, $m2)) {
                        foreach ($m2[1] as $i) {
                            $classes[$i] = $depName;
                        }
                    }
                }

            }
        }
        return $classes;
    }

    public function getDependency($dependencyName)
    {
        if (substr($dependencyName, 0, 4) == 'Ext.' || $dependencyName == 'Ext') {
            if ($dependencyName == 'Ext') {
                $class = '.Ext';
            } else {
                $class = substr($dependencyName, 3);
            }
            if (substr($class, 0, 4)=='.ux.') {
                $files = array(
                    '/packages/ux/classic/src'.str_replace('/ux', '', str_replace('.', '/', $class)).'.js',
                );
            } else if (substr($class, 0, 11)=='.overrides.') {
                $files = array(
                    '/classic/classic'.str_replace('.', '/', $class).'.js'
                );
            } else {
                if ($class == '.Boot') {
                    $files = array(
                        '/packages/core/.sencha/package/Boot.js',
                    );
                } else {
                    $files = array(
                        '/classic/classic/src'.str_replace('.', '/', $class).'.js',
                        '/packages/core/src'.str_replace('.', '/', $class).'.js',
                    );
                }
            }
            foreach ($files as $file) {
                if ($file == VENDOR_PATH.'/bower_components/extjs/packages/core/src/lang/Error.js') {
                    return new Kwf_Assets_Dependency_File_Js($this->_providerList, 'kwfext/Error.js');
                }
                if (file_exists(VENDOR_PATH.'/bower_components/extjs'.$file)) {
                    return new Kwf_Ext_Assets_JsDependency($this->_providerList, 'ext'.$file);
                }
            }
            return null;

        }
    }

    private function _getRecursiveDeps($f)
    {
        if ($f == 'Ext.overrides.*') return array(); //ignore overrides, we load them using OverridesProvider
        if (substr($f, -2) != '.*') {
            throw new Kwf_Exception("Invalid dependency: '$f', doesn't end with '.*'");
        }
        $f = substr($f, 0, -2); //strip off .*

        if (substr($f, 0, 4) != 'Ext.') {
            throw new Kwf_Exception("Invalid dependency: '$f', doesn't start with 'Ext.'");
        }
        $f = substr($f, 3); //strip off Ext

        $paths = array(
            '/classic/classic/src'.str_replace('.', '/', $f),
            '/packages/core/src'.str_replace('.', '/', $f),
        );
        $libPath = VENDOR_PATH.'/bower_components/extjs';
        $path = false;
        foreach ($paths as $i) {
            if (is_dir($libPath.$i)) {
                $path = $i;
            }
        }
        if (!$path) {
            throw new Kwf_Exception("Path 'Ext$f.*' does not exist.");
        }
        $ret = array();
        $it = new RecursiveDirectoryIterator($libPath.$path);
        $it = new Kwf_Iterator_Filter_HiddenFiles($it);
        $it = new RecursiveIteratorIterator($it);
        foreach ($it as $file) {
            $f = $file->getPathname();
            $f = substr($f, strlen($libPath));
            $f = substr($f, strpos($f, '/src')+4);
            $cls = 'Ext'.str_replace('/', '.', substr($f, 0, -3));
            $d = $this->_providerList->findDependency($cls);
            if (!$d) throw new Kwf_Exception("Can't resolve dependency: $cls");
            $ret[] = $d;
        }
        return $ret;
    }

    public function getDependenciesForDependency(Kwf_Assets_Dependency_Abstract $dependency)
    {
        if (!$dependency instanceof Kwf_Assets_Dependency_File_Js && !$dependency instanceof Kwf_Ext_Assets_JsDependency) {
            return array();
        }

        $deps = array(
            Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES => array(),
            Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES => array(),
        );

        $fileContents = file_get_contents($dependency->getAbsoluteFileName());

        // remove comments to avoid dependencies from docs/examples
        $fileContents = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*'.'/!', '', $fileContents);


        $aliasClasses = self::_getAliasClasses();

        if (preg_match_all('#^\s*'.'// @(require|uses)\s+([a-zA-Z0-9\./\-_]+\*?)\s*$#m', $fileContents, $m)) {
            foreach ($m[2] as $k=>$f) {
                $type = ($m[1][$k] == 'uses' ? Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES : Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES);
                if (substr($f, -3) == '.js') {
                    $f = substr($f, 0, -3);
                    $curFile = $dependency->getFileNameWithType();
                    $curFile = substr($curFile, 0, strrpos($curFile, '/'));
                    while (substr($f, 0, 3) == '../') {
                        $f = substr($f, 3);
                        $curFile = substr($curFile, 0, strrpos($curFile, '/', -2));
                    }
                    $f = str_replace('/', '.', $curFile.'/'.$f);
                    if (substr($f, 0, 8) == 'ext.src.') {
                        $f = 'Ext.'.substr($f, 8);
                    }
                } else if (substr($f, -2) == '.*') {
                    foreach ($this->_getRecursiveDeps($f) as $i) {
                        $deps[$type][] = $i;
                    }
                    continue;
                } else {
                    //ignore, that is handled by Kwf_Assets_Provider_AtRequires
                    continue;
                }

                if ($dependency->getFileNameWithType() == 'ext/classic/classic/src/util/Offset.js') {
                    if ($f == 'Ext.dom.CompositeElement') {
                        $f = null;
                    }
                }

                if ($f) {
                    $d = $this->_providerList->findDependency($f);
                    if (!$d) throw new Kwf_Exception("Can't resolve dependency: require $f");
                    $deps[$type][] = $d;
                }
            }
        }

        //now that // @require are found remove single-line-comments
        $fileContents = preg_replace('/(\/\/[^\n]*)/', '', $fileContents);

        $classes = array(
            Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES => array(),
            Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES => array(),
        );
        if (preg_match('#Ext\.require\(\s*\'([a-zA-Z0-9\.]+\*?)\'#', $fileContents, $m)) {
            $classes['requires'][] = $m[1];
        }
        if (preg_match('#Ext\.require\(\s*\[([^]]+\])#', $fileContents, $m)) {
            if (preg_match_all('#\'([a-zA-Z0-9\._]+\*?)\'#', $m[1], $m2)) {
                $classes['requires'] = array_merge($classes['requires'], $m2[1]);
            }
        }

        if (preg_match('#Ext\.define\(\s*[\'"]#', $fileContents, $m)) {
            if (preg_match_all('#^\s*(extend|overrides|requires|mixins|uses)\s*:\s*[\'"]([a-zA-Z0-9\.]+\*?)[\'"]\s*,?\s*$#m', $fileContents, $m)) {
                foreach ($m[2] as $k=>$cls) {
                    if ($dependency->getFileNameWithType() == 'ext/packages/core/src/data/reader/Reader.js'
                        && $cls == 'Ext.data.Model'
                    ) {
                        continue;
                    }
                    $type = ($m[1][$k] == 'uses' ? Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES : Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES);
                    if ($m[1][$k] == 'requires') {
                        array_unshift($classes[$type], $cls);
                    } else {
                        $classes[$type][] = $cls;
                    }
                }
            }

            if (preg_match_all('#^\s*(requires|mixins|uses)\s*:\s*(\[.+?\]|{.+?})\s*,?\s*$#ms', $fileContents, $m)) {
                foreach ($m[2] as $k=>$i) {
                    $type = ($m[1][$k] == 'uses' ? Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES : Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES);
                    if (preg_match_all('#[\'"]([a-zA-Z0-9\._]+\*?)[\'"]#', $i, $m2)) {
                        if ($m[1][$k] == 'requires') {
                            $classes[$type] = array_merge($m2[1], $classes[$type]);
                        } else {
                            $classes[$type] = array_merge($classes[$type], $m2[1]);
                        }
                    }
                }
            }

            //this should probably only be done for relevant classes, ie. layout for panel, proxy for model etc
            if (preg_match_all('#^\s*(proxy|layout|reader|writer|componentLayout)\s*:\s*[\'"]([a-zA-Z0-9\.]+)[\'"]\s*,?\s*$#m', $fileContents, $m)) {
                foreach ($m[2] as $k=>$cls) {
                    $type = Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES;
                    $t = $m[1][$k];
                    $t = ($t == 'componentLayout') ? 'layout' : $t;
                    if ($t == 'proxy') $type = Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES;
                    if (isset($aliasClasses[$t.'.'.$cls])) {
                        $classes[$type][] = $aliasClasses[$t.'.'.$cls];
                    }
                }
            }
            if (preg_match_all('#^\s*(proxy|layout|reader|writer|componentLayout)\s*:\s*{\s*type\s*:\s*[\'"]([a-zA-Z0-9\.]+)[\'"]#m', $fileContents, $m)) {
                foreach ($m[2] as $k=>$cls) {
                    $type = Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES;
                    $t = $m[1][$k];
                    $t = ($t == 'componentLayout') ? 'layout' : $t;
                    if ($t == 'proxy') $type = Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES;
                    if (isset($aliasClasses[$t.'.'.$cls])) {
                        $classes[$type][] = $aliasClasses[$t.'.'.$cls];
                    }
                }
            }
        }

        foreach ($classes as $type=>$i) {
            foreach ($i as $cls) {
                if (substr($cls, -2) == '.*') {
                    foreach ($this->_getRecursiveDeps($cls) as $d) {
                        $deps[$type][] = $d;
                    }
                } else {
                    if (substr($cls, 0, 4) == 'Ext.') {
                        if (!isset($aliasClasses[$cls])) {
                            throw new Kwf_Exception("Can't resolve dependency: $cls for $dependency");
                        }
                        $cls = $aliasClasses[$cls];
                    }
                    $d = $this->_providerList->findDependency($cls);
                    if (!$d) throw new Kwf_Exception("Can't resolve dependency: extend $cls for $dependency");
                    $deps[$type][] = $d;
                }
            }
        }

        if ($dependency->getFileNameWithType() == 'ext/classic/classic/src/panel/Panel.js') {
            //$deps[Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES][] = new Kwf_Assets_Dependency_File_Css($this->_providerList, 'ext/build/classic/theme-triton/resources/theme-triton-all-debug_1.css');
            //$deps[Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES][] = new Kwf_Assets_Dependency_File_Css($this->_providerList, 'ext/build/classic/theme-triton/resources/theme-triton-all-debug_2.css');
            $deps[Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES][] = new Kwf_Ext_Assets_JsDependency($this->_providerList, 'ext/build/classic/theme-triton/theme-triton-debug.js');
        }


        $additionalDeps = array();
        if ($dependency->getFileNameWithType() == 'ext/classic/classic/src/Component.js') {
            $additionalDeps[] = 'Ext.plugin.Manager';
        } else if ($dependency->getFileNameWithType() == 'ext/packages/core/src/app/Application.js') {
            $additionalDeps[] = 'Ext.app.ViewModel';
            $additionalDeps[] = 'Ext.class.Loader';
            //override with same name also in ext/overrides, so add that manually
            $deps[Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES][] = new Kwf_Ext_Assets_JsDependency($this->_providerList, 'ext/packages/core/overrides/app/Application.js');
        } else if ($dependency->getFileNameWithType() == 'ext/classic/classic/src/ZIndexManager.js') {
            $additionalDeps[] = 'Ext.GlobalEvents';
        } else if ($dependency->getFileNameWithType() == 'ext/packages/core/src/Ext.js') {
            array_unshift($deps[Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES], new Kwf_Ext_Assets_Dependency_Manifest($this->_providerList));
            $additionalDeps[] = 'Ext.Boot';
        } else if ($dependency->getFileNameWithType() == 'ext/packages/core/src/list/Tree.js') {
            $additionalDeps[] = 'Ext.list.TreeItem';
            $additionalDeps[] = 'Ext.tree.View';
        } else if ($dependency->getFileNameWithType() == 'ext/classic/classic/src/container/Container.js') {
            $additionalDeps[] = 'Ext.util.ItemCollection';
        }
        foreach ($additionalDeps as $i) {
            $d = $this->_providerList->findDependency($i);
            if (!$d) throw new Kwf_Exception("Can't resolve dependency: '$i'");
            array_unshift($deps[Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES], $d);
        }
        return $deps;
    }

    public function getDependencyNameByAlias($aliasDependencyName)
    {
        if (substr($aliasDependencyName, 0, 4) == 'Ext.') {
            $aliasClasses = self::_getAliasClasses();
            if (isset($aliasClasses[$aliasDependencyName])) {
                $aliasDependencyName = $aliasClasses[$aliasDependencyName];
                return $aliasDependencyName;
            }
        }
    }
}
