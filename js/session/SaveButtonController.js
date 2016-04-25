Ext.define('KwfExt.session.SaveButtonController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.KwfExt.session.saveButton',
    require: [
        'Ext.Promise'
    ],
    control: {
        '#': {
            click: 'onClick'
        }
    },

    onClick: function() {
/*
        var session = this.getSession();
        var batch = session.getSaveBatch();
        if (batch) {
            batch.start();
        }
        if (session.getParent()) {
            session.save();
            session.getParent().commit();
        }
*/
        var parentSessionView = this.getView().findParentBy(function(i) { return i.getSession(); });
        var promise;
        if (parentSessionView.getController().isSaveable) {
            promise = parentSessionView.getController().allowSave();
        } else {
            promise = Ext.Promise.resolve();
        }
        Ext.each(parentSessionView.query('[controller]'), function(i) {
            if (i.getController().isSaveable) {
                promise = promise.then(function() {
                    return i.getController().allowSave();
                });
            }
        }, this);

        promise = promise.then((function() {
            //console.log('all valid. save now');
            var session = this.getSession();

            if (session.getChangesForParent()) {
                //console.log('changes', session.getChangesForParent());
                var batch;
                if (session.getParent()) {
                    //console.log('save to parent');
                    session.save();
                    batch = session.getParent().getSaveBatch();
                } else {
                    batch = session.getSaveBatch();
                }
                batch.on('complete', function() {
                    parentSessionView.unmask();
                    if (!batch.hasException()) {
                        parentSessionView.fireEvent('sessionsave');
                    }
                }, this);
                parentSessionView.mask(trlKwf('Saving...'));
                batch.start();

                session.commit(); //mark session clean
            } else {
                //console.log('no changes');
            }
        }).bind(this), (function(error) {
            //console.log('Error', error);
            Ext.Msg.alert(trlKwf('Save'), error.validationMessage);
        }).bind(this));




        /*
        this.getView().el.mask(this.savingMaskText);
        this.allowSave().then({
            success: function() {
                var session = this.getSession();
                var batch = session.getSaveBatch();
                while (session && !batch) {
                    session = session.getParent();
                    if (session) batch = session.getSaveBatch();
                }
                if (batch) {
                    batch.on('complete', function(batch, operation) {
                        this.getView().el.unmask();
                        this.fireViewEvent('savesuccess');
                        this.fireEvent('savesuccess');
                    }, this);
                    batch.start();
                } else {
                    var record = this.getView().getRecord();
                    if (record) {
                        record.save({
                            success: function() {
                                this.getView().el.unmask();
                                this.fireViewEvent('savesuccess');
                                this.fireEvent('savesuccess');
                            },
                            scope: this
                        })
                    }
                }
            },
            failure: function () {
                this.getView().el.unmask();
            },
            scope: this
        });
        */

    }
});
