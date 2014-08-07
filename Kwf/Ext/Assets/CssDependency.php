<?php
class Kwf_Ext_Assets_CssDependency extends Kwf_Assets_Dependency_File
{
    public function getMimeType()
    {
        return 'text/css';
    }

    public function getContents($language)
    {
        $ret = parent::getContents($language);
        $ret = str_replace('.x-', '.x4-', $ret);
        $ret = str_replace('url(images/', 'url(/assets/ext/packages/ext-theme-neptune/build/resources/images/', $ret);
        return $ret;
    }
}
