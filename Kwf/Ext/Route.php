<?php
class Kwf_Ext_Route extends Zend_Controller_Router_Route
{
    public function __construct()
    {
        parent::__construct('/kwf/ext4/:resource',
                    array('module'     => 'kwf_ext_controller',
                          'controller' => 'ext4',
                          'action'     =>'index'));
    }
}
