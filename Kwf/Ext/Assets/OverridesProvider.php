<?php
class Kwf_Ext_Assets_OverridesProvider extends Kwf_Assets_Provider_Abstract
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
        //if ($dependency->getFilenameWithType() == 'ext/packages/sencha-core/src/Ext.js') {
        if ($dependency->getFilenameWithType() == 'ext/overrides/dom/Element.js') {
            $deps[Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_USES][] = $this->_providerList->findDependency('Ext.overrides.Ext-more');
        }

        return $deps;
    }

    private static function _getOverrides()
    {
        static $ret;
        if (isset($ret)) return $ret;
        $ret = array();
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(VENDOR_PATH.'/bower_components/extjs/overrides'), RecursiveIteratorIterator::LEAVES_ONLY);
        foreach ($it as $i) {
            if (substr($i->getPathname(), -3) != '.js') continue;
            $depName = 'Ext.overrides'.str_replace('/', '.', substr($i->getPathname(), strlen(VENDOR_PATH.'/bower_components/extjs/overrides'), -3));
            $fileContents = file_get_contents($i->getPathname());

            // remove comments to avoid dependencies from docs/examples
            $fileContents = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*'.'/!', '', $fileContents);

            if (preg_match('#Ext\.define\(\s*[\'"]#', $fileContents, $m)) {
                if (preg_match('#^\s*(override)\s*:\s*\'([a-zA-Z0-9\.]+)\'\s*,?\s*$#m', $fileContents, $m)) {
                    if (!isset($ret[$m[2]])) $ret[$m[2]] = array();
                    $ret[$m[2]][] = $depName;
                }
            }
        }
        return $ret;
    }
}
