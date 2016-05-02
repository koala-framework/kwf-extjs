Ext.define('KwfExt.overrides.Stateful', {
    override: 'Ext.state.Stateful',

    constructor: function()
    {
        if (this.stateful && !this.stateId) {
            this._kwfExtStateful = true;
            this.stateful = false;
            this.on('beforerender', function() {
                this.stateful = true;
                if (!this.ownerCt) {
                    throw new Error("Can't generate stateId, ownerCt not set");
                }
                var parentStateId = this.ownerCt.stateId;
                if (!parentStateId) {
                    parentStateId = '';
                    var p = this.ownerCt;
                    while (p) {
                        if (p.stateId) {
                            parentStateId = p.stateId+'-'+parentStateId;
                            break;
                        } else if (p.stateIdPart) {
                            parentStateId = p.stateIdPart+'-'+parentStateId;
                        } else if (p.reference) {
                            parentStateId = p.reference+'-'+parentStateId;
                        } else if (p.getXType()) {
                            parentStateId = p.getXType()+'-'+parentStateId;
                        }
                        p = p.ownerCt;
                    }
                }
                if (!parentStateId) {
                    throw new Error("Can't generate stateId, ownerCt has no stateId");
                }
                var stateIdPart = this.reference || this.stateIdPart || this.getXType();
                this.stateId = parentStateId+stateIdPart;
                this.addStateEvents(this.stateEvents);
                this.initState();
            }, this);
        }
        this.callParent(arguments);
    },

    addStateEvents: function (events)
    {
        var fakedStateId;
        if (this.stateful && !this.stateId) {
            fakedStateId = true;
            this.stateId = true; //temporarily set stateId so stateEvents are actually added
                                 //actual stateId is generated in beforerender (here we don't have our parent)
        }
        this.callParent(arguments);

        if (fakedStateId) {
            delete this.stateId;
        }
    }
});
