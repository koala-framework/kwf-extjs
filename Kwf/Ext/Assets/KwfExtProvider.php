<?php
class Kwf_Ext_Assets_KwfExtProvider extends Kwf_Assets_Provider_JsClass
{
    public function __construct()
    {
        parent::__construct(dirname(dirname(dirname(dirname(__FILE__)))).'/Kwf_js/Ext4', 'kwfext/Kwf_js/Ext4', 'Kwf.Ext4');
    }
}
