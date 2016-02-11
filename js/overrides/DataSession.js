Ext.define('KwfExt.overrides.DataSession', {
    override: 'Ext.data.Session',

    privates: {
        recordCreator: function(data, Model) {
            var me = this,
                id = Model.getIdFromData(data),
                record = me.peekRecord(Model, id, true),
                changes;

            // It doesn't exist anywhere, create it
            if (!record) {
                // We may have a stub that is loading the record (in fact this may be the
                // call coming from that Reader), but the resolution is simple. By creating
                // the record it is registered in the data[entityName][id] entry anyway
                // and the stub will deal with it onLoad.
                record = new Model(data, me);
            } else {
                //TODO no easy answer here... we are trying to create a record and have
                //TODO some (potentially new) data. We probably should check for mid-air
                //TODO collisions using versionProperty but for now we just ignore the
                //TODO new data in favor of our potentially edited data.
                // Peek checks if it exists at any level, by getting it we ensure that the record is copied down
                record = me.getRecord(Model, id);
                changes = record.getChanges();
                record.set(data);
                record.commit(false);
                record.set(changes);
            }

            return record;
        }
    }
});
