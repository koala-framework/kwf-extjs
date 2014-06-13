<?php
class Kwf_Ext_Assets_TestLazyLoad_Test extends PHPUnit_Framework_TestCase
{
    public function testIt()
    {
        $mimeTypes = array('text/javascript', 'text/css');
        $p = new Kwf_Assets_Package(new Kwf_Ext_Assets_TestProviderList(), 'Kwf.Ext.Assets.TestWindow.Test');
        foreach ($mimeTypes as $mimeType) {
            foreach ($p->getFilteredUniqueDependencies($mimeType) as $dep) {
                $dep->warmupCaches();
            }
        }

        $cmd = "phantomjs vendor/koala-framework/library-qunit-phantomjs-runner/runner.js ";
        $cmd .= "http://".Kwf_Config::getValue('server.domain').Kwf_Setup::getBaseUrl()."/kwf_ext_assets_test-lazy-load_test 40";
        $cmd .= " 2>&1";
        $out = array();
        exec($cmd, $out, $retVar);
        $out = implode("\n", $out);
        if ($retVar) {
            $this->fail("qunit test failed: ".$out);
        }
    }
}
