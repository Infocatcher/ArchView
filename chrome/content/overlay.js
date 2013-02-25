var CC=Components.classes;
var CI=Components.interfaces;
var CR=Components.results;

const NS_PREFCHANGE_TOPIC="nsPref:changed";
const NS_PREFSRV_CTID="@mozilla.org/preferences-service;1";
const AV_DLF_CTID="@archview.ffe/archview-factory;1";

const AV_PREF="extensions.archview.";
const AV_PREF_ENABLED=AV_PREF+"enabled";
const AV_PREF_INTERFACE=AV_PREF+"interface";
const AV_PREF_PROTOCOL=AV_PREF+"protocol.";
const AV_PREF_FORMAT=AV_PREF+"format.";

function avOnLoad()
{
    var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch2);
    prefsrv.addObserver(AV_PREF_ENABLED, avStatusObserver, false);
    avSetStatusImage(prefsrv.getBoolPref(AV_PREF_ENABLED));
}

function avOnUnload()
{
    var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch2);
    prefsrv.removeObserver(AV_PREF_ENABLED, avStatusObserver);
}

function avOnChangeStatus(event)
{
    if (event.button) return;

    var img=document.getElementById("avStatusImage");
    var enabled=img.src[img.src.length-5]==0;

    var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
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
    var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);

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
    var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
    var key=AV_PREF_FORMAT+item.value;
    if (prefsrv.getPrefType(key)!=prefsrv.PREF_BOOL)
        return;
    var val=item.getAttribute("checked");
    prefsrv.setBoolPref(key, (val=="true")?true:false);
}

function avOnSetInterface(item)
{
    var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
    prefsrv.setCharPref(AV_PREF_INTERFACE, item.value);
}

function avSetStatusImage(enabled)
{
    var imgsrc="chrome://archview/skin/icons/archview"+(enabled-0)+".ico";
    var img=document.getElementById("avStatusImage");
    if (img) img.src=imgsrc;
}

/* We use the observer the change the image. So not need to change other windows' image.
function avSetStatusImage(enabled)
{
    if (typeof(enabled)=="undefined")
    {
        var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
        enabled=prefsrv.getBoolPref(AV_PREF_ENABLED);
    }
    var imgsrc="chrome://archview/skin/icons/archview"+(enabled-0)+".ico";

    var winmed=CC["@mozilla.org/appshell/window-mediator;1"].getService(CI.nsIWindowMediator);
    var winenum=winmed.getEnumerator(null);
    while (winenum.hasMoreElements())
    {
        var win=winenum.getNext().QueryInterface(CI.nsIDOMWindow);
        var img=win.document.getElementById("avStatusImage");
        if (img) img.src=imgsrc;
    }
}
*/
var avStatusObserver=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIObserver))
            throw CR.NS_ERROR_NO_INTERFACE;        
        return this;
    },
    observe: function(branch, topic, suffix)
    {
        if (topic!=NS_PREFCHANGE_TOPIC) return;
        branch=branch.QueryInterface(CI.nsIPrefBranch);
        if (branch.root+suffix==AV_PREF_ENABLED)
            avSetStatusImage(branch.getBoolPref(suffix));
    }
}

window.addEventListener("load", avOnLoad, false);
window.addEventListener("unload", avOnUnload, false);

CC[AV_DLF_CTID].getService(CI.nsISupports);
