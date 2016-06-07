<?php
class Kwf_Ext_Assets_CssDependency extends Kwf_Assets_Dependency_Abstract
{
    public function getMimeType()
    {
        return 'text/css';
    }

    public function getIdentifier()
    {
        return 'ExtScss';
    }

    public function getCacheId()
    {
        return false; //for now, don't cache (as masterFiles are not yet set correctly)
    }

    public function getContentsPacked()
    {
        $app = $this->_providerList->findDependency('Admin'); //TODO this must not be Admin
        $it = $app->getFilteredUniqueDependencies('text/javascript');
        $extClasses = array();
        $webSassFiles = array();
        foreach ($it as $i) {
            if ($i instanceof Kwf_Assets_Dependency_File) {
                if ($i->getType() == 'ext') {
                    $path = $i->getFileNameWithType();
                    if (substr($path, 0, 24) == 'ext/classic/classic/src/') {
                        $extClass = substr($path, 24);
                    } else if (substr($path, 0, 30) == 'ext/classic/classic/overrides/') {
                        $extClass = substr($path, 30);
                    } else if (substr($path, 0, 22) == 'ext/packages/core/src/') {
                        $extClass = substr($path, 22);
                    } else if (substr($path, 0, 28) == 'ext/packages/core/overrides/') {
                        $extClass = substr($path, 28);
                    } else if (substr($path, 0, 34) == 'ext/packages/core/.sencha/package/') {
                        $extClass = substr($path, 34);
                    } else if (substr($path, 0, 28) == 'ext/packages/ux/classic/src/') {
                        $extClass = substr($path, 28);
                    } else if (substr($path, 0, 24) == 'ext/build/classic/theme-') {
                        continue;
                    } else {
                        throw new Kwf_Exception("unknown package: $path");
                    }
                    $extClass = ('Ext.'.str_replace(array('.js', '/'), array('', '.'), $extClass));
                    if ($extClass == 'Ext.tree.View') {
                        //($form-checkbox-size is used by tree/View.scss)
                        $extClasses[] = 'Ext.form.field.Base';
                        $extClasses[] = 'Ext.form.field.Checkbox';
                    }
                    $extClasses[] = $extClass;
                } else if (substr($i->getFileNameWithType(), 0, 8) == 'web/ext/') {
                    if (file_exists(substr($i->getAbsoluteFileName(), 0, -3).'.scss')) {
                        $webSassFiles[] = substr($i->getAbsoluteFileName(), 0, -3).'.scss';
                    }
                } else if (substr($i->getFileNameWithType(), 0, 10) == 'kwfext/js/') {
                    if (file_exists(substr($i->getAbsoluteFileName(), 0, -3).'.scss')) {
                        $webSassFiles[] = substr($i->getAbsoluteFileName(), 0, -3).'.scss';
                    }
                }
            }
        }
        $extClasses = array_unique($extClasses);

        $packages = array(
            'ext'           => array(
                'path' => 'sass',
                'resourceRoot' => 'assets/ext/resources',
                'resourcePath' => 'assets/ext/resources/images'
            ),
            'core'          => array(
                'path' => 'packages/core/sass',
                'resourceRoot' => 'assets/ext/packages/core/resources',
                'resourcePath' => 'assets/ext/packages/core/resources/images'
            ),
            'theme-base'    => array(
                'path' => 'classic/theme-base/sass',
                'resourceRoot' => 'assets/ext/classic/theme-base/resources',
                'resourcePath' => 'assets/ext/classic/theme-base/resources/images'
            ),
            'theme-neutral' => array(
                'path' => 'classic/theme-neutral/sass',
                'resourceRoot' => 'assets/ext/classic/theme-neutral/resources',
                'resourcePath' => 'assets/ext/classic/theme-neutral/resources/images'
            ),
            'theme-neptune' => array(
                'path' => 'classic/theme-neptune/sass',
                'resourceRoot' => 'assets/ext/classic/theme-neptune/resources',
                'resourcePath' => 'assets/ext/classic/theme-neptune/resources/images'
            ),
            'font-awesome'  => array(
                'path' => 'packages/font-awesome/sass',
                'resourceRoot' => 'assets/ext/packages/font-awesome/resources',
                'resourcePath' => 'assets/ext/packages/font-awesome/resources/images'
            ),
            'font-ext'  => array(
                'path' => 'packages/font-ext/sass',
                'resourceRoot' => 'assets/ext/packages/font-ext/resources',
                'resourcePath' => 'assets/ext/packages/font-ext/resources/images'
            ),
            'theme-triton'  => array(
                'path' => 'classic/theme-triton/sass',
                'resourceRoot' => 'assets/ext/classic/theme-triton/resources',
                'resourcePath' => 'assets/ext/classic/theme-triton/resources/images'
            ),
            //'MyApp'         => 'sass',
        );

        $ret  = '';
        $ret .= '$app-name:  dynamic( \'MyApp\' );'."\n";
        $ret .= '$image-search-path: \'/home/niko/exttest/my-app/build/development/MyApp/classic/resources\';'."\n";
        $ret .= '$theme-name:  dynamic( \'theme-triton\' );'."\n";
        foreach (Kwf_Ext_Assets_Provider::_getAliasClasses() as $cls) {
            $value = in_array($cls, $extClasses) ? 'true' : 'false';
            $ret .= '$include-'.str_replace('.', '-', strtolower($cls)).': dynamic('.$value.');;'."\n";
        }
        $ret .= '$output-paths: ("path": "../../classic/resources", "shared": "../../resources");'."\n";
        $ret .= ''."\n";
        $ret .= '/* ======================== ETC ======================== */'."\n";
        $ret .= ''."\n";
        foreach ($packages as $packageName=>$package) {
            $ret .= '/* including package '.$packageName.' */'."\n";
            $ret .= '$'.$packageName.'-resource-root: \''.$package['resourceRoot'].'\' !default;'."\n";
            $ret .= '$'.$packageName.'-resource-path: \''.$package['resourcePath'].'\' !default;'."\n";
            $ret .= '$current-package: \''.$packageName.'\';'."\n";
            $ret .= '$current-resource-root: $'.$packageName.'-resource-root;'."\n";
            $ret .= '$relative-image-path-for-uis: $'.$packageName.'-resource-path;'."\n";
            $ret .= '@import \'vendor/bower_components/extjs/'.$package['path'].'/etc/all\';'."\n";
        }

        $ret .= ''."\n";
        $ret .= '/* ======================== VAR ======================== */'."\n";
        $ret .= ''."\n";
        foreach ($packages as $packageName=>$package) {
            $ret .= '/* including package '.$packageName.' */'."\n";
            $ret .= '$'.$packageName.'-resource-root: \''.$package['resourceRoot'].'\' !default;'."\n";
            $ret .= '$'.$packageName.'-resource-path: \''.$package['resourcePath'].'\' !default;'."\n";
            $ret .= '$current-package: \''.$packageName.'\';'."\n";
            $ret .= '$current-resource-root: $'.$packageName.'-resource-root;'."\n";
            $ret .= '$relative-image-path-for-uis: $'.$packageName.'-resource-path;'."\n";
            $ret .= '@import \'vendor/bower_components/extjs/'.$package['path'].'/etc/all\';'."\n";
            foreach ($extClasses as $cls) {
                $p = 'vendor/bower_components/extjs/'.$package['path'].'/var/'.str_replace('.', '/', preg_replace('#^Ext\.#', '', $cls));
                if (file_exists($p.'.scss')) {
                    $ret .= '@import \''.$p.'\';'."\n";
                }
            }
        }

        $ret .= ''."\n";
        $ret .= '/* ======================== RULE ======================== */'."\n";
        $ret .= ''."\n";
        foreach ($packages as $packageName=>$package) {
            $ret .= '/* including package '.$packageName.' */'."\n";
            $ret .= '$'.$packageName.'-resource-root: \''.$package['resourceRoot'].'\' !default;'."\n";
            $ret .= '$'.$packageName.'-resource-path: \''.$package['resourcePath'].'\' !default;'."\n";
            $ret .= '$current-package: \''.$packageName.'\';'."\n";
            $ret .= '$current-resource-root: $'.$packageName.'-resource-root;'."\n";
            $ret .= '$relative-image-path-for-uis: $'.$packageName.'-resource-path;'."\n";
            $ret .= '@import \'vendor/bower_components/extjs/'.$package['path'].'/etc/all\';'."\n";
            foreach ($extClasses as $cls) {
                $p = 'vendor/bower_components/extjs/'.$package['path'].'/src/'.str_replace('.', '/', preg_replace('#^Ext\.#', '', $cls));
                if (file_exists($p.'.scss')) {
                    $ret .= '@import \''.$p.'\';'."\n";
                }
            }
        }

        $ret .= ''."\n";
        $ret .= '/* ======================== WEB ======================== */'."\n";
        $ret .= ''."\n";
        foreach ($webSassFiles as $f) {
            $ret .= '@import \''.$f.'\';'."\n";
        }

        if (!file_exists('temp/extcss')) mkdir('temp/extcss');
        file_put_contents('temp/extcss/all.scss', $ret);

        $preProcessor = new Kwf_Ext_Assets_ScssPreProcessor_PreProcessor();
        $preProcessor->preProcess('temp/extcss/all.scss');

        $bin = Kwf_Config::getValue('server.nodeSassBinary');
        if (!$bin) {
            $bin = getcwd()."/".VENDOR_PATH."/bin/node ".dirname(dirname(dirname(dirname(dirname(__FILE__))))).'/node_modules/node-sass/bin/node-sass';
        } else {
            $p = json_decode(file_get_contents(KWF_PATH.'/node_modules/node-sass/package.json'), true);
            $bin = str_replace('%version%', $p['version'], $bin);
            unset($p);
        }

        $oldcwd = getcwd();
        $loadPath = '.'.PATH_SEPARATOR.'vendor/bower_components/compass-mixins/lib';
        $cmd = "$bin --include-path $loadPath --output-style compressed ";
        $cmd .= " ".escapeshellarg('temp/extcss/all.scss')." ".escapeshellarg(getcwd().'/temp/extcss/all.css');
        $cmd .= " 2>&1";
        $out = array();
        chdir('temp/extcss');
        exec($cmd, $out, $retVal);
        chdir($oldcwd);
        if ($retVal) {
            throw new Kwf_Exception("compiling sass failed: $cmd\n".implode("\n", $out));
        }

        $ret = file_get_contents('temp/extcss/all.css');

        //sencha cmd copies files into a single resources folder, we don't do that
        //so we must correct the paths based on theme inheriting
        $themesInherit = array(
            'triton', 'neptune', 'neutral', 'base'
        );
        $ret = preg_replace_callback('#(url\(")/assets/ext/classic/theme-[a-z]+/([^)]+)("\))#', function($m) use ($themesInherit) {
            foreach ($themesInherit as $themeInherit) {
                $file = 'classic/theme-'.$themeInherit.'/'.$m[2];
                if (file_exists('vendor/bower_components/extjs/'.$file)) {
                    return $m[1].'/assets/ext/'.$file.$m[3];
                }
            }
            return $m[0]; //leave as it is
        }, $ret);

        return Kwf_SourceMaps_SourceMap::createEmptyMap($ret);
    }
}
