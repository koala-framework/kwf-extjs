<?php
class Kwf_Ext_Assets_JsDependency extends Kwf_Assets_Dependency_File_Js
{
    public function getContentsPacked()
    {
        $ret = parent::getContentsPacked();
        if ($this->getFileNameWithType() == 'ext/packages/core/src/class/Loader.js') {
            $add  = "\n";
            $add .= "Ext.Loader.setConfig({\n";
            $add .= "    enabled: false\n";
            $add .= "});\n";
            $ret->concat(Kwf_SourceMaps_SourceMap::createEmptyMap($add));
        }
        return $ret;
    }
}
