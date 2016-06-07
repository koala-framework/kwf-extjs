Ext.define('KwfExt.defaultMenu.ViewportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.kwfExt.defaultMenu.viewport',

    listen : {
        controller : {
            '#' : {
                unmatchedroute : 'onRouteChange'
            }
        }
    },

    routes: {
        ':node': 'onRouteChange'
    },

    initViewModel: function()
    {
        var store = this.getViewModel().getStore('menu');

        //set leaf for nodes with view
        store.getRoot().cascadeBy(function(record) {
            if (!record.get('leaf') && record.get('view')) {
                record.set('leaf', true);
            }
        }, this);

        //remove nodes that should not be visible
        var toRemove = [];
        store.getRoot().cascadeBy(function(record) {
            if (!record.get('leaf') && record.get('view')) {
                record.set('leaf', true);
            }
            var visibleFor = record.get('visibleFor');
            if (visibleFor) {
                if (Ext.isArray(visibleFor)) {
                    if (visibleFor.indexOf(Kwf.userRole) == -1) {
                        toRemove.push(record);
                    }
                } else {
                    if (!visibleFor(Kwf.userRole)) {
                        toRemove.push(record);
                    }
                }
            }
        }, this);
        toRemove.forEach(function(record) {
            record.remove();
        }, this);

        //remove no-view nodes without children
        toRemove = [];
        store.getRoot().cascadeBy(function(record) {
            if (!record.get('view') && !record.hasChildNodes()) {
                toRemove.push(record);
            }
        }, this);
        toRemove.forEach(function(record) {
            record.remove();
        }, this);
    },

    setCurrentView: function(hashTag) {
        this.lookupReference('navigationTreeList');
        hashTag = (hashTag || '').toLowerCase();

        var me = this,
            refs = me.getReferences(),
            mainCard = refs.mainCardPanel,
            mainLayout = mainCard.getLayout(),
            navigationList = refs.navigationTreeList,
            viewModel = me.getViewModel(),
            vmData = viewModel.getData(),
            store = this.getViewModel().getStore('menu'),
            node = store.findNode('routeId', hashTag),
            view = node ? node.get('view') : null,
            lastView = vmData.currentView,
            existingItem = mainCard.child('component[routeId=' + hashTag + ']'),
            newView;

        // Kill any previously routed window
        if (lastView && lastView.isWindow) {
            lastView.destroy();
        }

        lastView = mainLayout.getActiveItem();

        if (!existingItem) {
            newView = Ext.create({
                xtype: view,
                hideMode: 'offsets',
                routeId: hashTag
            });
        }

        if (!newView || !newView.isWindow) {
            // !newView means we have an existing view, but if the newView isWindow
            // we don't add it to the card layout.
            if (existingItem) {
                // We don't have a newView, so activate the existing view.
                if (existingItem !== lastView) {
                    mainLayout.setActiveItem(existingItem);
                }
                newView = existingItem;
            }
            else {
                // newView is set (did not exist already), so add it and make it the
                // activeItem.
                Ext.suspendLayouts();
                mainLayout.setActiveItem(mainCard.add(newView));
                Ext.resumeLayouts(true);
            }
        }

        navigationList.setSelection(node);

        if (newView.isFocusable(true)) {
            newView.focus();
        }

        vmData.currentView = newView;

    },

    onNavigationTreeSelectionChange: function (tree, node) {
        if (node && node.get('view')) {
            this.redirectTo( node.get("routeId"));
        }
    },

    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navigationList = refs.navigationTreeList,
            navigationListContainer = refs.navigationTreeListContainer,
            wrapContainer = refs.mainContainerWrap,
            collapsing = !navigationList.getMicro(),
            new_width = collapsing ? 64 : 250;

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();

            refs.senchaLogo.setWidth(new_width);

            navigationListContainer.setWidth(new_width);
            navigationList.setMicro(collapsing);

            Ext.resumeLayouts(); // do not flush the layout here...

            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();  // ... since this will flush them
        }
        else {
            if (!collapsing) {
                // If we are leaving micro mode (expanding), we do that first so that the
                // text of the items in the navlist will be revealed by the animation.
                navigationList.setMicro(false);
            }

            // Start this layout first since it does not require a layout
            refs.senchaLogo.animate({dynamic: true, to: {width: new_width}});

            // Directly adjust the width config and then run the main wrap container layout
            // as the root layout (it and its chidren). This will cause the adjusted size to
            // be flushed to the element and animate to that new size.
            navigationListContainer.width = new_width;
            wrapContainer.updateLayout({isRoot: true});

            // We need to switch to micro mode on the navlist *after* the animation (this
            // allows the "sweep" to leave the item text in place until it is no longer
            // visible.
            if (collapsing) {
                navigationListContainer.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                    },
                    single: true
                });
            }
        }
    },

    onMainViewRender:function() {
        if (!window.location.hash) {
            var store = this.getViewModel().getStore('menu');
            this.redirectTo(store.getRoot().getChildAt(0).get('routeId'));
        }
    },

    onRouteChange:function(id){
        this.setCurrentView(id);
    },

    onSearchRouteChange: function () {
        this.setCurrentView('search');
    },

    onEmailRouteChange: function () {
        this.setCurrentView('email');
    }
});
