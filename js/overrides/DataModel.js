Ext.define('Densa.overrides.DataModel', {
    override: 'Ext.data.Model',

    reloadData: function()
    {
        if (this.phantom) return false;

        this.self.load(this.getId(), {
            success: function(loadedRow) {
                this.beginEdit();
                this.set(loadedRow.getData());
                this.endEdit();
                this.commit();
            },
            scope: this
        });
    }
});
