Ext.define('KwfExt.defaultMenu.MenuTreeList', {
    extend: 'Ext.list.Tree',
    xtype: 'kwfExt.defaultMenu.menuTreeList',
    ui: 'navigation',
    expanderFirst: false,
    expanderOnly: false,
    constructor: function() {
        this.callParent(arguments);
        this.setIndent(44);
        this.setIconSize(44);
    }
});
