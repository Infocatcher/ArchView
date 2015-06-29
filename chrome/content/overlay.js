var AV_CC=Components.classes;
var AV_CI=Components.interfaces;
var AV_CR=Components.results;

var AV_NS_PREFSRV;
const AV_NS_PREFCHANGE_TOPIC="nsPref:changed";
const AV_NS_PREFSRV_CTID="@mozilla.org/preferences-service;1";
const AV_DLF_CTID="@archview.ffe/archview-factory;1";

const AV_PREF="extensions.archview.";
const AV_PREF_ENABLED=AV_PREF+"enabled";
const AV_PREF_STATUSBAR=AV_PREF+"statusbar";
const AV_PREF_INTERFACE=AV_PREF+"interface";
const AV_PREF_PROTOCOL=AV_PREF+"protocol.";
const AV_PREF_FORMAT=AV_PREF+"format.";

function avOnLoad()
{
    AV_NS_PREFSRV=AV_CC[AV_NS_PREFSRV_CTID]
        .getService(AV_CI.nsIPrefService)
        .QueryInterface(AV_CI.nsIPrefBranch2 || AV_CI.nsIPrefBranch);
    AV_NS_PREFSRV.addObserver(AV_PREF, avStatusObserver, false);
    avSetStatusImage(AV_NS_PREFSRV.getBoolPref(AV_PREF_ENABLED));
    avSetStatusbar(AV_NS_PREFSRV.getBoolPref(AV_PREF_STATUSBAR));
    if (document.getElementById("addon-bar"))
    {
        var defaultPrefs=AV_NS_PREFSRV.getDefaultBranch("");
        defaultPrefs.setBoolPref(AV_PREF_STATUSBAR, false);
    }
}

function avOnUnload()
{
    AV_NS_PREFSRV.removeObserver(AV_PREF, avStatusObserver);
}

function avOnChangeStatus(event)
{
    if (event.button==1)
    {
        avOnSettings();
        return;
    }
    if (event.button) return;

    var img=document.getElementById("avStatusImage");
    var enabled=img.src[img.src.length-5]==0;

    AV_NS_PREFSRV.setBoolPref(AV_PREF_ENABLED, enabled);
}

function avOnSettings()
{
    window.openDialog("chrome://archview/content/settings.xul",
            "settings", "chrome,dialog,modal,resizable=no,centerscreen");
}

function avOnAbout()
{
    window.openDialog("chrome://archview/content/about.xul",
            "about", "chrome,dialog,modal,resizable=no,centerscreen");
}

function avOnShowPopup(menu)
{
    var items=menu.childNodes;
    for (var i=0; i<items.length; i++)
    {
        var t=items.item(i).getAttribute("name");
        var v=items.item(i).value;
        if (t=="interface")
            t=(AV_NS_PREFSRV.getCharPref(AV_PREF_INTERFACE)==v);
        else if (AV_NS_PREFSRV.getPrefType(AV_PREF_FORMAT+v)==AV_NS_PREFSRV.PREF_BOOL)
            t=AV_NS_PREFSRV.getBoolPref(AV_PREF_FORMAT+v);
/*      else if (AV_NS_PREFSRV.getPrefType(AV_PREF_PROTOCOL+v)==AV_NS_PREFSRV.PREF_BOOL)
            t=AV_NS_PREFSRV.getBoolPref(AV_PREF_FORMAT+v); */
        else
            continue;
        items.item(i).setAttribute("checked", t?"true":"false");
    }
}

function avOnSetFormat(item)
{
    var key=AV_PREF_FORMAT+item.value;
    if (AV_NS_PREFSRV.getPrefType(key)!=AV_NS_PREFSRV.PREF_BOOL)
        return;
    var val=item.getAttribute("checked");
    AV_NS_PREFSRV.setBoolPref(key, (val=="true")?true:false);
}

function avOnSetInterface(item)
{
    AV_NS_PREFSRV.setCharPref(AV_PREF_INTERFACE, item.value);
}

function avSetStatusImage(enabled)
{
    var imgsrc="chrome://archview/skin/icons/archview"+(enabled-0)+".ico";
    var img=document.getElementById("avStatusImage");
    if (img) img.src=imgsrc;
    var tb=document.getElementById("avToolbar");
    if (!tb)
    {
        var toolbox = "gNavToolbox" in window && gNavToolbox
            || "getNavToolbox" in window && getNavToolbox() // Firefox 3.0
            || document.getElementById("navigator-toolbox"); // Firefox <= 2.0
        tb = "palette" in toolbox && toolbox.palette.getElementsByAttribute("id", "avToolbar")[0];
    }
    if (tb) tb.setAttribute("image", imgsrc); // Note: tb.image=... doesn't work for just added button
}

function avSetStatusbar(show)
{
    var statusbar=document.getElementById("avStatus");
    if (statusbar) statusbar.hidden=!show;
}

/* We use the observer the change the image. So not need to change other windows' image.
function avSetStatusImage(enabled)
{
    if (typeof(enabled)=="undefined")
    {
        enabled=AV_NS_PREFSRV.getBoolPref(AV_PREF_ENABLED);
    }
    var imgsrc="chrome://archview/skin/icons/archview"+(enabled-0)+".ico";

    var winmed=AV_CC["@mozilla.org/appshell/window-mediator;1"].getService(AV_CI.nsIWindowMediator);
    var winenum=winmed.getEnumerator(null);
    while (winenum.hasMoreElements())
    {
        var win=winenum.getNext().QueryInterface(AV_CI.nsIDOMWindow);
        var img=win.document.getElementById("avStatusImage");
        if (img) img.src=imgsrc;
    }
}
*/
var avStatusObserver=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(AV_CI.nsISupports) &&
            !iid.equals(AV_CI.nsIObserver))
            throw AV_CR.NS_ERROR_NO_INTERFACE;        
        return this;
    },
    observe: function(branch, topic, suffix)
    {
        if (topic!=AV_NS_PREFCHANGE_TOPIC) return;
        branch=branch.QueryInterface(AV_CI.nsIPrefBranch);
        var pref=branch.root+suffix;
        if (pref==AV_PREF_ENABLED)
            avSetStatusImage(branch.getBoolPref(suffix));
        else if (pref==AV_PREF_STATUSBAR)
            avSetStatusbar(branch.getBoolPref(suffix));
    }
}

window.addEventListener("load", avOnLoad, false);
window.addEventListener("unload", avOnUnload, false);

AV_CC[AV_DLF_CTID].getService(AV_CI.nsISupports);
