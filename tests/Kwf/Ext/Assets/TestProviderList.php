<?php
class Kwf_Ext_Assets_TestProviderList extends Kwf_Assets_ProviderList_Abstract
{
    public function __construct()
    {
        $providers = self::getVendorProviders();
        $providers[] = new Kwf_Ext_Assets_Provider();
        $providers[] = new Kwf_Ext_Assets_OverridesProvider();
        $providers[] = new Kwf_Assets_Provider_JsClassKwf();
        $providers[] = new Kwf_Assets_Provider_JsClass(getcwd(), 'kwfext', 'kwfext'); //for @require (sub optimal)
        $providers[] = new Kwf_Assets_Provider_JsClass(getcwd().'/tests/Kwf/Ext', 'kwfext/tests/Kwf/Ext', 'KwfExt');
        $providers[] = new Kwf_Assets_Provider_Ini(dirname(__FILE__).'/ProviderTestDependencies.ini');
        $providers[] = new Kwf_Assets_Provider_AtRequires();
        parent::__construct($providers);
    }
}
