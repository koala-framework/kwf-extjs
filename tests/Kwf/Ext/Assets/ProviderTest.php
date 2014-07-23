<?php
class Kwf_Ext_Assets_ProviderTest extends PHPUnit_Framework_TestCase
{
    public function testObservable()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext4.util.Observable');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(25, count($array));
    }

    public function testDepOnObservable()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext4.util.ClickRepeater');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(26, count($array));
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
        $d = $l->findDependency('Ext4.EventManager');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(24, count($array));
    }

    public function testExtElement()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext4.dom.Element');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(45, count($array));
    }

    public function testExtFormat()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext4.util.Format');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(16, count($array));
    }

    public function testExtUtilHashMap()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext4.util.HashMap');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(26, count($array));
    }

    public function testExtUtilDelayedTask()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext4.util.DelayedTask');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(22, count($array));
    }

    public function testExtXTemplate()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext4.XTemplate');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(40, count($array));
    }

    public function testExtWindow()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext4.window.Window');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(197, count($array));
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
        $d = $l->findDependency('Ext4.data.Model');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(71, count($array));
    }

    public function testModelProxy()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Kwf.Ext.Assets.TestModel');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(73, count($array));
    }

    public function testModelProxy2()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Kwf.Ext.Assets.TestModel2');
        $this->assertNotNull($d);
        $array = $d->getRecursiveFiles();
        $this->assertEquals(73, count($array));
    }

    /*
    TODO: move test to kwf-densajs as this override is now part of densajs
    public function testOverride()
    {
        $l = new Kwf_Ext_Assets_TestProviderList();
        $d = $l->findDependency('Ext4.form.field.ComboBox');
        $this->assertNotNull($d);
        $array = array();
        foreach ($d->getRecursiveFiles() as $i) {
            $array[] = $i->getAbsoluteFileName();
        }
        $this->assertContains(KWF_PATH.'/Kwf_js/Ext4/Overrides/ComboBox.js', $array);
    }
    */
}
