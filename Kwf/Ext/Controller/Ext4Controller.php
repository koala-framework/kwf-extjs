<?php
class Kwf_Ext_Controller_Ext4Controller extends Zend_Controller_Action
{
    public function indexAction()
    {
        $resource = $this->_getParam('resource');
        $resource = Kwf_Acl::getInstance()->get($resource);
        if (!$resource) throw new Kwf_Exception_NotFound();
        if (!$resource instanceof Kwf_Ext_AclResource_Interface) throw new Kwf_Exception_NotFound();

        $allowed = Kwf_Acl::getInstance()->isAllowedUser(Kwf_Registry::get('userModel')->getAuthedUser(), $resource, 'view');
        if (!$allowed) {
            $params = array('location' => $this->getRequest()->getBaseUrl().$this->getRequest()->getPathInfo());
            $this->_forward('index', 'login',
                                'kwf_controller_action_user', $params);
        }

        $view = new Kwf_Ext_View();
        $this->getHelper('viewRenderer')->setView($view);
        $view->extController = $resource->getExtController();

    }
}
