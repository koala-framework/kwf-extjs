<?php
class Kwf_Ext_Assets_Dependency_Manifest extends Kwf_Assets_Dependency_Abstract
{
    public function getMimeType()
    {
        return 'text/javascript';
    }

    public function getContents($language)
    {
        $manifest = array(
            "name"=> "App",
            "theme"=> "ext-theme-neptune"
        );
        return "var Ext = Ext || {}; Ext.Boot.baseUrl = ''; Ext.manifest=".json_encode($manifest).";\n";
    }
}
