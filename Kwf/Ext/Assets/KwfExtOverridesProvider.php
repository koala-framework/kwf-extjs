<?php
class Kwf_Ext_Assets_KwfExtOverridesProvider extends Kwf_Assets_Provider_Abstract
{
    public function getDependency($dependencyName)
    {
        return null;
    }

    public function getDependenciesForDependency(Kwf_Assets_Dependency_Abstract $dependency)
    {
        if (!$dependency instanceof Kwf_Ext_Assets_JsDependency) {
            return array();
        }
        $deps = array(
            Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES => array(),
            Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES => array(),
        );

        $fileContents = file_get_contents($dependency->getAbsoluteFileName());

        // remove comments to avoid dependencies from docs/examples
        $fileContents = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*'.'/!', '', $fileContents);

        if (preg_match('#Ext\.define\(\s*[\'"]([a-zA-Z0-9\._]+)[\'"]#', $fileContents, $m)) {
            $define = $m[1];
            $overrides = self::_getOverrides();
            if (isset($overrides[$define])) {
                foreach ($overrides[$define] as $i) {
                    $j = $this->_providerList->findDependency($i);
                    if (!$j) {
                        throw new Kwf_Exception("Didn't find dependency '$i'");
                    }
                    $deps[Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES][] = $j;
                }
            }
        }

        return $deps;
    }

    private static function _getOverrides()
    {
        static $ret;
        if (isset($ret)) return $ret;
        $ret = self::_getOverridesFromPath(VENDOR_PATH.'/koala-framework/kwf-extjs/js/overrides');
        return $ret;
    }

    private static function _getOverridesFromPath($path)
    {
        $ret = array();
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), RecursiveIteratorIterator::LEAVES_ONLY);
        foreach ($it as $i) {
            if (substr($i->getPathname(), -3) != '.js') continue;
            $depName = 'KwfExt.overrides'.str_replace('/', '.', substr($i->getPathname(), strlen($path), -3));
            $fileContents = file_get_contents($i->getPathname());

            // remove comments to avoid dependencies from docs/examples
            $fileContents = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*'.'/!', '', $fileContents);

            if (preg_match('#Ext\.define\(\s*[\'"]#', $fileContents, $m)) {
                if (preg_match('#^\s*(override)\s*:\s*\'([a-zA-Z0-9\.]+)\'\s*,?\s*$#m', $fileContents, $m)) {
                    if (!isset($ret[$m[2]])) $ret[$m[2]] = array();
                    $ret[$m[2]][] = $depName;
                }
            }
            if (preg_match_all('#^\s*'.'// @(override)\s+([a-zA-Z0-9\./\-_]+\*?)\s*$#m', $fileContents, $m)) {
                foreach ($m[2] as $f) {
                    $ret[$f][] = $depName;
                }
            }
        }
        return $ret;
    }
}
