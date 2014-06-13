<?php
class Kwf_Ext_Assets_TestWindow_TestController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $view = new Kwf_View();
        $view->dep = new Kwf_Assets_Package(new Kwf_Ext_Assets_TestProviderList(), 'Kwf.Ext.Assets.TestWindow.Test');
        $this->getResponse()->setBody($view->render(dirname(__FILE__).'/Test.tpl'));
        $this->_helper->viewRenderer->setNoRender(true);
    }
}
