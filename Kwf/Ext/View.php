<?php
class Kwf_Ext_View extends Kwf_View
{
    public function init()
    {
        parent::init();
        $this->addScriptPath('vendor/koala-framework/kwf-extjs/views');
    }

    public function render($name)
    {
        $this->assetsPackage = Kwf_Assets_Package_Default::getAdminMainInstance();

        $this->extTemplate = 'ext4.tpl';
        if (Kwf_Util_SessionToken::getSessionToken()) {
            $this->sessionToken = Kwf_Util_SessionToken::getSessionToken();
        }

        $this->applicationName = Zend_Registry::get('config')->application->name;

        if (Kwf_Registry::get('config')->ext->favicon) {
            $this->favicon = Kwf_Registry::get('config')->ext->favicon;
        } else if (file_exists('images/favicon.ico')) {
            $ico = new Kwf_Asset('images/favicon.ico', 'web');
            $fx = Kwf_Registry::get('config')->ext->faviconFx;
            if (!$fx) $fx = array();
            else if (is_string($fx)) $fx = array($fx);
            $this->favicon = $ico->toString($fx);
        } else {
            $this->favicon = null;
        }
        $this->uaCompatibleIeEdge = true;

        $this->userRole = Zend_Registry::get('userModel')->getAuthedUserRole();
        $user = Zend_Registry::get('userModel')->getAuthedUser();
        if ($user) {
            $this->user = $user;
        }

        $this->uniquePrefix = Kwf_Config::getValue('application.uniquePrefix');

        return parent::render($name);
    }
}
