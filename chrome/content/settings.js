function onInterfaceChange()
{
    var node=document.getElementById("avInterfaceGroup");
    var t=(node.value!="application/vnd.mozilla.xul+xml");
    node=document.getElementById("avViewGroup");
    node.disabled=t;
    return undefined;
}

function readDefaultCharset(popup)
{
    var os=Components.classes["@mozilla.org/observer-service;1"]
        .getService(Components.interfaces.nsIObserverService);
    os.notifyObservers(null, "charsetmenu-selected", "other");
    if (popup.hasChildNodes())
        return;
    try { // Firefox 32+
        var CharsetMenu = Components.utils["import"]("resource://gre/modules/CharsetMenu.jsm", {}).CharsetMenu;
        CharsetMenu.build(popup, true, false); // Note: works only with empty nodes
        Array.forEach(
            popup.getElementsByTagName("menuitem"),
            function(mi) {
                if (!mi.hasAttribute("value"))
                    mi.setAttribute("value", mi.getAttribute("charset"));
                mi.removeAttribute("type"); // Remove type="radio"
            }
        );
    }
    catch(e) {
        Components.utils.reportError(e);
    }
}
