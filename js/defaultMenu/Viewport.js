Ext.define('KwfExt.defaultMenu.Viewport', {
    extend: 'Ext.container.Viewport',
    xtype: 'kwfExt.defaultMenu.viewport',

    requires: [
        'KwfExt.defaultMenu.MenuTreeList',
        'KwfExt.defaultMenu.ViewportController',
        'KwfExt.defaultMenu.ViewportModel',
        'KwfExt.defaultMenu.MainContainerWrap'
    ],

    controller: 'kwfExt.defaultMenu.viewport',
    viewModel: {
        type: 'kwfExt.defaultMenu.viewport'
    },

    cls: 'sencha-dash-viewport',
    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        render: 'onMainViewRender'
    },

    items: [
        {
            xtype: 'toolbar',
            cls: 'sencha-dash-dash-headerbar toolbar-btn-shadow',
            height: 64,
            itemId: 'headerBar',
            items: [
                {
                    xtype: 'component',
                    reference: 'senchaLogo',
                    cls: 'sencha-logo',
                    html: '<div class="main-logo"><img src="/assets/images/logo.png">Xxx</div>',
                    width: 250
                },
                {
                    margin: '0 0 0 8',
                    cls: 'delete-focus-bg',
                    iconCls:'x-fa fa-navicon',
                    id: 'main-navigation-btn',
                    handler: 'onToggleNavigationSize'
                },
                {
                    xtype: 'tbspacer',
                    flex: 1
                }
                /*,
                {
                    cls: 'delete-focus-bg',
                    iconCls:'x-fa fa-search',
                    href: '#search',
                    hrefTarget: '_self',
                    tooltip: 'See latest search'
                },
                {
                    cls: 'delete-focus-bg',
                    iconCls:'x-fa fa-envelope',
                    href: '#email',
                    hrefTarget: '_self',
                    tooltip: 'Check your email'
                },
                {
                    text: 'Lorem Ipsum',
                    iconCls:'x-fa fa-user',
                    cls: 'top-user-name',
                    href: '#profile',
                    hrefTarget: '_self',
                    tooltip: 'See your profile'
                }
                 */
                , {
                    text: trlKwf('Logout'),
                    cls: 'delete-focus-bg',
                    iconCls:'x-fa fa-sign-out',
                    href: '/kwf/user/logout',
                    hrefTarget: '_self',
                    tooltip: trlKwf('Logout')
                }

            ]
        },
        {
            xtype: 'kwfExt.defaultMenu.maincontainerwrap',
            id: 'main-view-detail-wrap',
            reference: 'mainContainerWrap',
            flex: 1,
            items: [
                {
                    scrollable: 'vertical',
                    width: 250,
                    bodyCls: 'kwf-defaultMenu-treelistContainer',
                    reference: 'navigationTreeListContainer',
                    items: [{
                        xtype: 'kwfExt.defaultMenu.menuTreeList',
                        reference: 'navigationTreeList',
                        itemId: 'navigationTreeList',
                        bind: {
                            store: '{menu}'
                        },
                        listeners: {
                            selectionchange: 'onNavigationTreeSelectionChange'
                        }
                    }]
                },
                {
                    xtype: 'container',
                    flex: 1,
                    reference: 'mainCardPanel',
                    cls: 'sencha-dash-right-main-container',
                    itemId: 'contentPanel',
                    layout: {
                        type: 'card',
                        anchor: '100%'
                    }
                }
            ]
        }

    ]
});
