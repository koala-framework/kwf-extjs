<?php
class Kwf_Ext_Assets_ProviderTest extends PHPUnit_Framework_TestCase
{
    public function testObservable()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.util.Observable');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertContains('ext/packages/sencha-core/src/util/Observable.js', $array);
        $this->assertEquals(78, count($array));
    }

    public function testDepOnObservable()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.util.ClickRepeater');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertContains('ext/packages/sencha-core/src/util/Observable.js', $array);
        $this->assertEquals(79, count($array));
    }

    public function testOwnClsByIni()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Test');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(1, count($array));
    }

    public function testOwnClsByClassName()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Kwf.Ext.Assets.TestCls');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(1, count($array));
    }

    public function testAtRequire()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Kwf.Ext.Assets.TestClsAtRequire');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(2, count($array));
    }

    public function testClsExtend()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('TestClsExtend');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(2, count($array));
    }

    public function testClsRecursion()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Kwf.Ext.Assets.TestClsRecursion1');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(2, count($array));
    }

    public function testExtEventManager()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.EventManager');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertContains('ext/src/EventManager.js', $array);
    }

    public function testExtElement()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.dom.Element');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertContains('ext/packages/sencha-core/src/dom/Element.js', $array);
        $this->assertContains('ext/overrides/dom/Element.js', $array);
        $this->assertContains('ext/packages/sencha-core/src/dom/Fly.js', $array);
    }

    public function testExtFormat()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.util.Format');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertContains('ext/packages/sencha-core/src/util/Format.js', $array);
    }

    public function testExtUtilHashMap()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.util.HashMap');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertContains('ext/packages/sencha-core/src/util/HashMap.js', $array);
    }

    public function testExtUtilDelayedTask()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.util.DelayedTask');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertContains('ext/packages/sencha-core/src/util/DelayedTask.js', $array);
    }

    public function testExtXTemplate()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.XTemplate');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertContains('ext/packages/sencha-core/src/Template.js', $array);
        $this->assertContains('ext/packages/sencha-core/src/XTemplate.js', $array);
    }

    public function testExtWindow()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.window.Window');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertContains('ext/src/window/Window.js', $array);
        $this->assertContains('ext/src/panel/Panel.js', $array);
    }

    public function testRequire()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Kwf.Ext.Assets.TestRequire');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(2, count($array));
    }

    public function testModel()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.data.Model');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertContains('ext/packages/sencha-core/src/data/Model.js', $array);
    }

    public function testProxyDep()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.data.proxy.Proxy');
        $this->assertNotNull($d);
        $array = $d->getFilteredUniqueDependencies('text/javascript');
        $idxServer = array_search('ext/packages/sencha-core/src/data/proxy/Server.js', $array);
        $this->assertTrue($idxServer !== false);
        $idxProxy = array_search('ext/packages/sencha-core/src/data/proxy/Proxy.js', $array);
        $this->assertTrue($idxProxy !== false);
        $this->assertTrue($idxProxy < $idxServer, 'proxy must be loaded before server');
    }

    public function testModelProxy2()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Kwf.Ext.Assets.TestModel2');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(84, count($array));
    }

    /*
    TODO: move test to kwf-densajs as this override is now part of densajs
    public function testOverride()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext.form.field.ComboBox');
        $this->assertNotNull($d);
        $array = array();
        foreach ($d->getRecursiveFiles() as $i) {
            $array[] = $i->getAbsoluteFileName();
        }
        $this->assertContains(KWF_PATH.'/Kwf_js/Ext/Overrides/ComboBox.js', $array);
    }
    */
}
