Ext.define('KwfExt.session.Save', {
    statics: {
        saveSession: function(sessionView)
        {
            var deferred = new Ext.Deferred()

            var promise;
            if (sessionView.getController().isSaveable) {
                promise = sessionView.getController().allowSave();
            } else {
                promise = Ext.Promise.resolve();
            }

            Ext.each(sessionView.query('[controller]'), function(i) {
                if (i.getController().isSaveable) {
                    promise = promise.then(function() {
                        return i.getController().allowSave();
                    });
                }
            }, this);

            promise = promise.then((function() {
                var session = sessionView.getSession();
                if (session.getChangesForParent()) {
                    var batch;
                    if (session.getParent()) {
                        session.save();
                        batch = session.getParent().getSaveBatch();
                    } else {
                        batch = session.getSaveBatch();
                    }
                    batch.on('complete', function() {
                        sessionView.unmask();
                        if (!batch.hasException()) {
                            sessionView.fireEvent('sessionsave');
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    }, this);
                    sessionView.mask(trlKwf('Saving...'));
                    batch.start();

                    session.commit(); //mark session clean
                } else {
                    deferred.resolve();
                }
            }).bind(this), (function(error) {
                Ext.Msg.alert(trlKwf('Save'), error.validationMessage);
                deferred.reject();
            }).bind(this));

            return deferred.promise;
        }
    }
});
