function onInterfaceChange()
{
    var node=document.getElementById("avInterfaceGroup");
    var t=(node.value!="application/vnd.mozilla.xul+xml");
    node=document.getElementById("avViewGroup");
    node.disabled=t;
    return undefined;
}

function readDefaultCharset()
{
    var os=Components.classes["@mozilla.org/observer-service;1"]
        .getService(Components.interfaces.nsIObserverService);
    os.notifyObservers(null, "charsetmenu-selected", "other");
    return undefined;
}
