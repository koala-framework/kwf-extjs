<?php
class Kwf_Ext_Assets_CssProvider extends Kwf_Assets_Provider_Abstract
{
    public function getDependency($dependencyName)
    {
        if ($dependencyName == 'ExtScss') {
            return new Kwf_Ext_Assets_CssDependency($this->_providerList);
        }
        return null;
    }

    public function getDependenciesForDependency(Kwf_Assets_Dependency_Abstract $dependency)
    {
        if (!$dependency instanceof Kwf_Assets_Dependency_File_Js && !$dependency instanceof Kwf_Ext_Assets_JsDependency) {
            return array();
        }

        $deps = array(
            Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES => array()
        );
        if ($dependency->getFileNameWithType() == 'ext/classic/classic/src/panel/Panel.js') {
            $deps[Kwf_Assets_Dependency_Abstract::DEPENDENCY_TYPE_REQUIRES][] = $this->_providerList->findDependency('ExtScss');
        }
        return $deps;
    }

}
