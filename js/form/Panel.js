Ext.define('KwfExt.form.Panel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.KwfExt.form',
    requires: [
        'KwfExt.form.ViewController'
    ],
    controllers: 'KwfExt.form',
    modelValidation: true,
    autoScroll: true
});

