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
        $ret = str_replace('url(images/', 'url(/assets/ext/build/classic/theme-triton/resources/images/', $ret);
        $ret = str_replace('url(\'fonts/', 'url(\'/assets/ext/build/classic/theme-triton/resources/fonts/', $ret);
        $ret = str_replace('url(\'font-awesome/', 'url(\'/assets/ext/build/classic/theme-triton/resources/font-awesome/', $ret);
        $ret = str_replace('url(\'font-ext/', 'url(\'/assets/ext/build/classic/theme-triton/resources/font-ext/', $ret);
        return $ret;
    }
}
