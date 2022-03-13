(function () {
    var listenerID = stringIDToTypeID('AdobeScriptListener ScriptListener');
    var keyLogID = charIDToTypeID('Log ');
    var desc = new ActionDescriptor();
    desc.putBoolean(keyLogID, false);
    executeAction(listenerID, desc, DialogModes.NO);
})();
