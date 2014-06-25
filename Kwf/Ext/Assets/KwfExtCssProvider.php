<?php
class Kwf_Ext_Assets_KwfExtCssProvider extends Kwf_Assets_Provider_CssByJs
{
    public function __construct()
    {
        parent::__construct(array(
            'kwfext/Kwf_js/Ext4'
        ));
    }
}
