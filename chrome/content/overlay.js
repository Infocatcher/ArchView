var AV_CC=Components.classes;
var AV_CI=Components.interfaces;
var AV_CR=Components.results;

const AV_NS_PREFCHANGE_TOPIC="nsPref:changed";
const AV_NS_PREFSRV_CTID="@mozilla.org/preferences-service;1";
const AV_DLF_CTID="@archview.ffe/archview-factory;1";

const AV_PREF="extensions.archview.";
const AV_PREF_ENABLED=AV_PREF+"enabled";
const AV_PREF_INTERFACE=AV_PREF+"interface";
const AV_PREF_PROTOCOL=AV_PREF+"protocol.";
const AV_PREF_FORMAT=AV_PREF+"format.";

function avOnLoad()
{
    var prefsrv=AV_CC[AV_NS_PREFSRV_CTID].getService(AV_CI.nsIPrefBranch2);
    prefsrv.addObserver(AV_PREF_ENABLED, avStatusObserver, false);
    avSetStatusImage(prefsrv.getBoolPref(AV_PREF_ENABLED));
    if (document.getElementById("addon-bar"))
        document.getElementById("avStatusImage").hidden=true;
}

function avOnUnload()
{
    var prefsrv=AV_CC[AV_NS_PREFSRV_CTID].getService(AV_CI.nsIPrefBranch2);
    prefsrv.removeObserver(AV_PREF_ENABLED, avStatusObserver);
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

    var prefsrv=AV_CC[AV_NS_PREFSRV_CTID].getService(AV_CI.nsIPrefBranch);
    prefsrv.setBoolPref(AV_PREF_ENABLED, enabled);
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
    var prefsrv=AV_CC[AV_NS_PREFSRV_CTID].getService(AV_CI.nsIPrefBranch);

    var items=menu.childNodes;
    for (var i=0; i<items.length; i++)
    {
        var t=items.item(i).getAttribute("name");
        var v=items.item(i).value;
        if (t=="interface")
            t=(prefsrv.getCharPref(AV_PREF_INTERFACE)==v);
        else if (prefsrv.getPrefType(AV_PREF_FORMAT+v)==prefsrv.PREF_BOOL)
            t=prefsrv.getBoolPref(AV_PREF_FORMAT+v);
/*      else if (prefsrv.getPrefType(AV_PREF_PROTOCOL+v)==prefsrv.PREF_BOOL)
            t=prefsrv.getBoolPref(AV_PREF_FORMAT+v); */
        else
            continue;
        items.item(i).setAttribute("checked", t?"true":"false");
    }
}

function avOnSetFormat(item)
{
    var prefsrv=AV_CC[AV_NS_PREFSRV_CTID].getService(AV_CI.nsIPrefBranch);
    var key=AV_PREF_FORMAT+item.value;
    if (prefsrv.getPrefType(key)!=prefsrv.PREF_BOOL)
        return;
    var val=item.getAttribute("checked");
    prefsrv.setBoolPref(key, (val=="true")?true:false);
}

function avOnSetInterface(item)
{
    var prefsrv=AV_CC[AV_NS_PREFSRV_CTID].getService(AV_CI.nsIPrefBranch);
    prefsrv.setCharPref(AV_PREF_INTERFACE, item.value);
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
    if (tb) tb.image=imgsrc;
}

/* We use the observer the change the image. So not need to change other windows' image.
function avSetStatusImage(enabled)
{
    if (typeof(enabled)=="undefined")
    {
        var prefsrv=AV_CC[AV_NS_PREFSRV_CTID].getService(AV_CI.nsIPrefBranch);
        enabled=prefsrv.getBoolPref(AV_PREF_ENABLED);
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
        if (branch.root+suffix==AV_PREF_ENABLED)
            avSetStatusImage(branch.getBoolPref(suffix));
    }
}

window.addEventListener("load", avOnLoad, false);
window.addEventListener("unload", avOnUnload, false);

AV_CC[AV_DLF_CTID].getService(AV_CI.nsISupports);
