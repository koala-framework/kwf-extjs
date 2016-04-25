Ext.define('KwfExt.form.Panel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.KwfExt.form.panel',
    requires: [
        'KwfExt.form.PanelController',
        'KwfExt.form.PanelModel'
    ],
    controller: 'KwfExt.form.Panel',
    modelValidation: true,
    autoScroll: true,
    viewModel: {
        type: 'KwfExt.form.Panel'
    },

    defaultBindProperty: 'record',
    setRecord: function(record)
    {
        //console.log('setRecord', record);
        if (Ext.isArray(record)) {
            if (record.length == 0) {
                record = null;
            } else {
                record = record[0];
            }
        }

        this.getForm().reset(); //to reset all validation errors; clearInvalid doesn't work

        if (record) {
            if (record.session !== this.lookupSession()) {
                if (!record.isModel) {
                    throw new Error("record is not a model");
                }
                //console.log('linkTo', record);
                this.getViewModel().linkTo('record', record);
            } else {
                //console.log('set', record);
                this.getViewModel().set('record', record);
            }
        } else {
            //console.log('set', record);
            this.getViewModel().set('record', null);
        }

    },
    getRecord: function()
    {
        return this.getViewModel().get('record');
    }
});

