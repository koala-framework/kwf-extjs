Ext.define('KwfExt.session.SaveButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.KwfExt.session.saveButton',
    requires: [
        'KwfExt.session.SaveButtonController'
    ],
    controller: 'KwfExt.session.saveButton',
    text: trlKwf('Save'),
    glyph: 'xf0c7@FontAwesome'
});
