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
//             console.log('all valid. save now');
            var session = this.getSession();
            /*
            if (session.getParent()) {
                this.getView().lookupSession().save();
                parentSessionView.discardSession();
            }
            */

            if (session.getChanges()) {
                var batch;
                if (session.getParent()) {
                    session.save();
                    batch = session.getParent().getSaveBatch();

                    //create new session, destroy current one
                    var newSession = session.getParent().spawn();
//                     console.log('set new session', newSession);
                    parentSessionView.setSession(newSession);
                    parentSessionView.getViewModel().setSession(newSession); //TODO might not have viewmodel? children might have viewmodel?
                    session.destroy();

                } else {
                    batch = session.getSaveBatch();
                }
                batch.start();
            } else {
//                 console.log('no changes');
            }
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
