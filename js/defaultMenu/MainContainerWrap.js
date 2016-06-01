Ext.define('KwfExt.defaultMenu.MainContainerWrap', {
    extend: 'Ext.container.Container',
    xtype: 'kwfExt.defaultMenu.maincontainerwrap',

    requires : [
        'Ext.layout.container.HBox'
    ],

    //scrollable: 'y',
    shrinkWrap: false,

    layout: {
        type: 'hbox',
        align: 'stretch',

        // Tell the layout to animate the x/width of the child items.
        animate: true,
        animatePolicy: {
            x: true,
            width: true
        }
    }
});
