Ext.define('KwfExt.editWindow.WindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.KwfExt.editWindow.window',
    requires: [
        'KwfExt.session.Save'
    ],
    focusOnEditSelector: 'field',
    autoSync: true,

    deleteConfirmText: trlKwf('Do you really wish to remove this entry?'),
    deleteConfirmTitle: trlKwf('Delete'),
    saveChangesTitle: trlKwf('Save'),
    saveChangesMsg: trlKwf('Do you want to save the changes?'),

    init: function()
    {
        this.view.on('beforeclose', function() {
            this.onCancel();
            return false;
        }, this);

        this.view.on('show', function() {
            if (this.focusOnEditSelector) {
                this.view.down(this.focusOnEditSelector).focus();
            }
        }, this);
/*
        this.bindable.view.on('savesuccess', function() {
            this.fireViewEvent('savesuccess');
        }, this);
*/
    },

    doSave: function()
    {
        return KwfExt.session.Save.saveSession(this.view);
    },

    onSave: function()
    {
        this.doSave().then((function() {
            this.closeWindow();
        }).bind(this));
    },

    onCancel: function()
    {
        var session = this.getSession();
        var record = this.view.getRecord();

        var isPhantom = record.phantom;
        record.phantom = false;
        var hasChanges = session.getChangesForParent() != null;
        record.phantom = isPhantom;

        if (hasChanges) {
            Ext.Msg.show({
                title: this.saveChangesTitle,
                msg: this.saveChangesMsg,
                icon: Ext.MessageBox.QUESTION,
                buttons: Ext.Msg.YESNOCANCEL,
                fn: function(btn) {
                    if (btn == 'no') {
                        var session = this.getSession();
                        var c = session.getChangesForParent();
                        var stores = [];
                        for (var key in c) {
                            Ext.each(c[key].U, function (i) {
                                var r = session.getRecord(key, i.id);
                                if (r.store) {
                                    if (stores.indexOf(r.store) == -1) {
                                        stores.push(r.store);
                                    }
                                } else {
                                    r.reject();
                                }
                            });
                            Ext.each(c[key].C, function (i) {
                                var r = session.getRecord(key, i.id);
                                if (r.store) {
                                    if (stores.indexOf(r.store) == -1) {
                                        stores.push(r.store);
                                    }
                                }
                            });
                            Ext.each(c[key].D, function (i) {
                                var r = session.getRecord(key, i.id);
                                if (r.store) {
                                    if (stores.indexOf(r.store) == -1) {
                                        stores.push(r.store);
                                    }
                                }
                            });
                        }

                        Ext.each(stores, function(i) {
                            i.rejectChanges();
                        });

                        this.closeWindow();
                    } else if (btn == 'yes') {
                        this.doSave().then((function() {
                            this.closeWindow();
                        }).bind(this));
                    }
                },
                scope: this
            });
        } else {
            var record = this.view.getRecord();
            if (record.phantom) {
                record.drop();
            }
            this.closeWindow();
        }
    },

    closeWindow: function()
    {
        this.view.hide();
    },

    onDelete: function()
    {
        Ext.Msg.show({
            title: this.deleteConfirmTitle,
            msg: this.deleteConfirmText,
            icon: Ext.MessageBox.QUESTION,
            buttons: Ext.Msg.YESNO,
            scope: this,
            fn: function(button) {
                if (button == 'yes') {
                    this.getView().getRecord().drop();

                    var session = this.getSession();
                    var batch;
                    if (session.getParent()) {
                        session.save();
                        batch = session.getParent().getSaveBatch();
                    } else {
                        batch = session.getSaveBatch();
                    }
                    batch.on('complete', function() {
                        this.view.unmask();
                        if (!batch.hasException()) {
                            this.closeWindow();
                            this.view.fireEvent('sessionsave');
                        }
                    }, this);
                    this.view.mask(trlKwf('Deleting...'));
                    batch.start();

                    session.commit(); //mark session clean
                }
            }
        });
    }

});
