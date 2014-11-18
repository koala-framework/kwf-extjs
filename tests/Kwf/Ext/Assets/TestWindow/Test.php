<?php
class Kwf_Ext_Assets_TestWindow_Test extends PHPUnit_Framework_TestCase
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

        $cmd = "phantomjs --web-security=false vendor/bower_components/qunit-phantomjs-runner/runner.js ";
        $cmd .= "http://".Kwf_Config::getValue('server.domain').Kwf_Setup::getBaseUrl()."/kwf_ext_assets_test-window_test 20";
        $cmd .= " 2>&1";
        $out = array();
        exec($cmd, $out, $retVar);
        $out = implode("\n", $out);
        if ($retVar) {
            $this->fail("qunit test failed: ".$out);
        }
    }
}
