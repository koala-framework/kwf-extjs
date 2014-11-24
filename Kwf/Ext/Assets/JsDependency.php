<?php
class Kwf_Ext_Assets_JsDependency extends Kwf_Assets_Dependency_File_Js
{
    public function _getRawContents($language)
    {
        $ret = parent::_getRawContents($language);
        if (substr($ret, -1) != "\n") {
            $ret .= "\n";
        }
        if ($this->getFileNameWithType() == 'ext/packages/sencha-core/src/Ext.js') {
//             $ret = "Ext.sandboxName = 'Ext4';\n".$ret;
//             $ret = "Ext.isSandboxed = true;\n".$ret;
//             $ret = "Ext.buildSettings = { baseCSSPrefix: \"x4-\", scopeResetCSS: true };\n".$ret;
        } else if ($this->getFileNameWithType() == 'ext/packages/sencha-core/src/class/Loader.js') {
            $ret .= "\n";
            $ret .= "Ext.Loader.setConfig({\n";
            $ret .= "    enabled: false\n";
            $ret .= "});\n";

            $ret = "Ext.manifest = null;\n".$ret;
        }
        return $ret;
    }
}
