/**
 * Fix for emptying ComboBox value when editable and forceSelection is activated
 *
 * https://www.sencha.com/forum/showthread.php?301017-5-1-1-combobox-forceSelection-is-too-aggressive-in-clearing-out-the-field-input
 */

Ext.define('Densa.overrides.ComboBox', {
    override: 'Ext.form.field.ComboBox',
    onLoad: function(store, records, success) {
        if (this.editable && this.forceSelection) {
            var me = this,
                needsValueUpdating = !me.valueCollection.byValue.get(me.value);
            if (success && needsValueUpdating && !(store.lastOptions && 'rawQuery' in store.lastOptions)) {
                me.setValueOnData();
            }
        } else {
            this.callParent(arguments);
        }
    },
    onStoreUpdate: function(store, record) {
        if (this.editable && this.forceSelection) {
            // Do nothing
        } else {
            this.callParent(arguments);
        }
    }
});
