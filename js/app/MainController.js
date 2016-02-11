Ext.define('KwfExt.app.MainController', {
    extend: 'Ext.app.Application',
    /*$namespace: 'App',*/
    name: 'App',
    requires: [
        'Ext.state.LocalStorageProvider',
        'Ext.state.Manager',
        'KwfExt.Viewport'
    ],
    mainPanel: null,
    viewport: null,
    statePrefix: 'ext-',
    _runningRequests: 0,

    init: function()
    {
        if (Ext.util.LocalStorage.supported) {
            Ext.state.Manager.setProvider(Ext.state.LocalStorageProvider.create({
                prefix: this.statePrefix
            }));
        }
        this.callParent(arguments);
    },

    launch: function()
    {
        this.callParent(arguments);

        if (!this.mainPanel || !(this.mainPanel instanceof Ext.panel.Panel)) {
            throw new Error("mainPanel is required and must be an Ext.panel.Panel");
        }

        Ext.get('loading').fadeOut({remove: true});

        if (!this.viewport) {
            this.viewport = Ext.create('KwfExt.Viewport', {
                items: [this.mainPanel]
            });
        }
    },

    onBeforeLaunch: function()
    {
        Ext.Ajax.setDisableCaching(false);
        var extraParams = Ext.Ajax.getExtraParams() || {};
        if (Kwf.sessionToken) extraParams.kwfSessionToken = Kwf.sessionToken;
        extraParams.applicationAssetsVersion = Kwf.application.assetsVersion;
        Ext.Ajax.setExtraParams(extraParams);
        Ext.Ajax.on('beforerequest', this.beforeAjaxRequest, this);
        Ext.Ajax.on('requestcomplete', this.onAjaxRequestComplete, this);
        Ext.Ajax.on('requestexception', this.onAjaxRequestException, this);

        this.callParent(arguments);
    },

    beforeAjaxRequest: function(conn, options)
    {
        if (options.method != 'GET') {
            this._runningRequests++;
            if (this.viewport && this.viewport.menu && this.viewport.menu.loadingAnim) {
                this.viewport.menu.loadingAnim.el.fadeIn();
                this.viewport.menu.loadingAnim.el.child('.icon')
                this.viewport.menu.loadingAnim.el.child('.icon').setStyle('top', '');
            }
        }
    },

    afterAjaxRequest: function(conn, response, options)
    {
        if (options.method != 'GET') {
            this._runningRequests--;
            Ext.defer(function() {
                if (this._runningRequests == 0) {
                    if (this.viewport && this.viewport.menu && this.viewport.menu.loadingAnim) {
                        this.viewport.menu.loadingAnim.el.child('.icon').animate({
                            from: {
                                opacity: 0
                            },
                            to: {
                                top: 0,
                                opacity: 1
                            },
                            listeners: {
                                afteranimate: function() {
                                    this.viewport.menu.loadingAnim.el.fadeOut();
                                },
                                delay: 2000,
                                scope: this
                            }
                        });
                    }
                }
            }, 500, this);
        }
    },

    onAjaxRequestComplete: function(conn, response, options)
    {
        this.afterAjaxRequest(conn, response, options);
    },

    onAjaxRequestException: function(conn, response, options)
    {
        this.afterAjaxRequest(conn, response, options);

        var r = Ext.decode(response.responseText, true);
        if (response.status == 401) {
            var msg = trlKwf('Session expired, please re-login.');
            if (r && r.role && r.role != 'guest') {
                msg = trlKwf("You don't have enough permissions for this Action");
            }
            Ext.Msg.alert(trlKwf('Login'), msg, function() {
                location.reload();
            })
        } else if (response.status == 428) {
            var dlg = new Ext.window.Window({
                autoCreate : true,
                title: trlKwf('Error - wrong version'),
                resizable: false,
                modal: true,
                buttonAlign: 'center',
                bodyPadding: 20,
                plain: true,
                closable: false,
                html: trlKwf('Because of an application update the application has to be reloaded.'),
                buttons: [{
                    text: trlKwf('OK'),
                    handler: function() {
                        location.reload();
                    },
                    scope: this
                }]
            });
            dlg.show();
        } else {
            Ext.Msg.alert(trlKwf('Error'), trlKwf('A Server failure occured.'));
            if (response.status != 500) {
                throw new Error('Request failed: '+response.status + ' '+response.statusText);
            }
        }
    }
});
