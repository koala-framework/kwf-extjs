<?php
class Kwf_Ext_AclResource_Menu extends Kwf_Acl_Resource_Abstract
    implements Kwf_Acl_Resource_Interface_Url, Kwf_Ext_AclResource_Interface
{
    private $_extController;

    public function __construct($resourceId, $menuConfig, $extController)
    {
        $this->_extController = $extController;
        parent::__construct($resourceId, $menuConfig);
    }

    public function getExtController()
    {
        return $this->_extController;
    }

    public function getMenuUrl()
    {
        return '/kwf/ext/'.$this->getResourceId();
    }
}
