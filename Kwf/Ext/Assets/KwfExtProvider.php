<?php
class Kwf_Ext_Assets_KwfExtProvider extends Kwf_Assets_Provider_JsClass
{
    public function __construct()
    {
        parent::__construct(dirname(dirname(dirname(dirname(__FILE__)))).'/Kwf_js/Ext', 'kwfext/Kwf_js/Ext', 'Kwf.Ext');
    }
}
