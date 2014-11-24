<?php
class Kwf_Ext_Route extends Zend_Controller_Router_Route
{
    public function __construct()
    {
        parent::__construct('/kwf/ext/:resource',
                    array('module'     => 'kwf_ext_controller',
                          'controller' => 'ext',
                          'action'     =>'index'));
    }
}
