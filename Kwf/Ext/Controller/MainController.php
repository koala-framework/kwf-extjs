<?php
class Kwf_Ext_Controller_MainController extends Kwf_Controller_Action
{
    public function indexAction()
    {
        $view = new Kwf_Ext_View();
        $view->extController = 'Main';
        $this->getHelper('viewRenderer')->setView($view);
    }
}
