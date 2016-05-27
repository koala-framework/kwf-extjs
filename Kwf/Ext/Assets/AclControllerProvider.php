<?php
class Kwf_Ext_Assets_AclControllerProvider extends Kwf_Assets_Provider_Abstract
{
    public function getDependency($dependencyName)
    {
        if ($dependencyName == 'ExtAclController') {
            $deps = array();
            foreach (Kwf_Acl::getInstance()->getAllResources() as $r) {
                if ($r instanceof Kwf_Ext_AclResource_Interface) {
                    $cls = 'App.controller.'.$r->getExtController();
                    $d = $this->_providerList->findDependency($cls);
                    if (!$d) {
                        throw new Kwf_Exception("Didn't find dependency '$cls'.");
                    }
                    $deps[] = $d;
                }
            }
            if ($deps) {
                array_unshift($deps, $this->_providerList->findDependency('Ext.app.Application'));
            }
            return new Kwf_Assets_Dependency_Dependencies($this->_providerList, $deps, $dependencyName);
        }
        return null;
    }
}
