// This file replaces ext/lang/Error.js
// replacement done is implemented in Kwf_Assets_Ext_Provider

// @tag foundation,core
// @require Ext.Loader
// @define Ext.Error

Ext.Error = Error;

Ext.Error.raise = function(err)
{
    err = err || {};
    if (Ext.isString(err)) {
        err = { msg: err };
    }

    var method = this.raise.caller,
        msg;

    if (method) {
        if (method.$name) {
            err.sourceMethod = method.$name;
        }
        if (method.$owner) {
            err.sourceClass = method.$owner.$className;
        }
    }
    var className = err.sourceClass ? err.sourceClass : '',
        methodName = err.sourceMethod ? '.' + err.sourceMethod + '(): ' : '',
        msg = err.msg || '(No description provided)';

    msg = className + methodName + msg;

    throw new Error(msg);
};

Ext.deprecated = function (suggestion) {
    //<debug>
    if (!suggestion) {
        suggestion = '';
    }

    function fail () {
        Ext.Error.raise('The method "' + fail.$owner.$className + '.' + fail.$name +
                '" has been removed. ' + suggestion);
    }

    return fail;
    //</debug>
    return Ext.emptyFn;
};
