<?php
class Kwf_Ext_AclResource_Resource extends Zend_Acl_Resource implements Kwf_Ext_AclResource_Interface
{
    private $_extController;

    public function __construct($resourceId, $extController)
    {
        $this->_extController = $extController;
        parent::__construct($resourceId);
    }

    public function getExtController()
    {
        return $this->_extController;
    }
}
