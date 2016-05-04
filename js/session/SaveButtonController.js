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

    onClick: function()
    {
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
            var session = this.getSession();

            if (session.getChangesForParent()) {
                var batch;
                if (session.getParent()) {
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
            }
        }).bind(this), (function(error) {
            Ext.Msg.alert(trlKwf('Save'), error.validationMessage);
        }).bind(this));
    }
});
