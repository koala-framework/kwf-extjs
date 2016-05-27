<?php
class Kwf_Ext_Assets_Dependency_Manifest extends Kwf_Assets_Dependency_Abstract
{
    public function getMimeType()
    {
        return 'text/javascript';
    }

    public function getIdentifier()
    {
        return 'ExtManifest';
    }

    public function getContentsPacked()
    {
        $manifest = array(
            "name"=> "App",
            "theme"=> "ext-theme-neptune"
        );
        $ret = "var Ext = Ext || {}; Ext.Boot.baseUrl = ''; Ext.manifest=".json_encode($manifest).";\n";
        return Kwf_SourceMaps_SourceMap::createEmptyMap($ret);
    }
}
