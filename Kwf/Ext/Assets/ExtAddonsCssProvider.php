<?php
class Kwf_Ext_Assets_ExtAddonsCssProvider extends Kwf_Assets_Provider_CssByJs
{
    public function __construct()
    {
        parent::__construct(array(
            'kwfExtjsAddons/Kwf/Ext4'
        ));
    }
}
