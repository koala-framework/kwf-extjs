<?php
class Kwf_Ext_Assets_ExtAddonsProvider extends Kwf_Assets_Provider_JsClass
{
    public function __construct()
    {
        parent::__construct(VENDOR_PATH.'/koala-framework/extjs-addons/Kwf/Ext4', 'kwfExtjsAddons/Kwf/Ext4', 'Kwf.Ext4');
    }
}
