const CC=Components.classes;
const CI=Components.interfaces;
const CR=Components.results;

const NS_OBSSRV_CTID="@mozilla.org/observer-service;1";
const NS_PREFSRV_CTID="@mozilla.org/preferences-service;1";
const NS_PROMSRV_CTID="@mozilla.org/embedcomp/prompt-service;1";
const NS_RDFSRV_CTID="@mozilla.org/rdf/rdf-service;1";
const NS_PREFSRV=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch2);
const NS_RDFSRV=CC[NS_RDFSRV_CTID].getService(CI.nsIRDFService);
const NS_PREFCHANGE_TOPIC="nsPref:changed";

const MIME_HTML="text/html";
const AV_INTERFACE_PREFIX="@archview.ffe/archview-interface;1?type=";
const AV_HTML_CTID=AV_INTERFACE_PREFIX+MIME_HTML;

const AV_OK=0;
const AV_ERROR_UNKNOWN_FORMAT=1;
const AV_ERROR_READ_FAILED=2;
const AV_ERROR_EXTRA_DATA=3;
const AV_ERROR_FILE_CORRUPTED=4;
const AV_ERROR_NOT_RESUMABLE=5;

const AV_PREF="extensions.archview.";
const AV_PREF_TOOLBAR=AV_PREF+"toolbar";
const AV_PREF_VIEW=AV_PREF+"view";
const AV_PREF_COLUMN=AV_PREF+"column.";

const AV_TOPIC="archview-notify";
const AV_RDFDS=NS_RDFSRV.GetDataSource("rdf:archview");
//const AV_RDFDS=NS_RDFSRV.GetDataSource("http://archview.ffe/rdf/datasource");

var avDebug=false;
var avViewMode="";
var avTree;
var avStrings;

var observer=
{
    filecount: -1,
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIObserver))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    observe: function(subject, topic, data)
    {
        if (topic!=AV_TOPIC) return;

        var progbar=document.getElementById("avProgress");
        var statbar=document.getElementById("avTotalStatus");
        var t;

        if (data=="start:")
        {
            this.filecount=data.slice(6)-0;
            if (this.filecount)
                progbar.setAttribute("mode", "determined");
        }
        else if (!data.indexOf("end:"))
        {
            progbar.setAttribute("mode", "determined");
            progbar.setAttribute("value", 0);
            t=subject.QueryInterface(CI.avIArchviewInfo);
            avShow(t);
        }
        else if (!data.indexOf("entry:"))
        {
            t=data.indexOf("/");
            if (this.filecount==-1)
            {
                this.filecount=data.slice(t+1)-0;
                if (this.filecount)
                    progbar.setAttribute("mode", "determined");
            }
            t=data.slice(6, t)-0;
            if (this.filecount)
                progbar.setAttribute("value", Math.round(t*100/this.filecount));
            else
                statbar.label=avGetStatusString("total", t);
        }
    }
};

/////////////////////////////////////////////////////
//
// These functions are interface callback.
//
/////////////////////////////////////////////////////

function onLoad()
{
    // determine debug flag
    if (document.location.protocol=="chrome:")
    {
        var t=document.getElementById("avDebugBtn");
        t.hidden=false;
        avDebug=true;
        return;
    }

    // listening for entries
    var obssrv=CC[NS_OBSSRV_CTID].getService(CI.nsIObserverService);
    obssrv.addObserver(observer, AV_TOPIC, false);

    // listening for preference change
    NS_PREFSRV.addObserver(AV_PREF, avPrefsObserver, false);

    avTree=document.getElementById("avContentTree");
    avStrings=document.getElementById("avString");
    avSetToolbar();
    avSetColumn();

    // if all entries had been loaded, refresh the UI
    var ds=AV_RDFDS.QueryInterface(CI.avIArchviewSource);
    if (ds.hasArchive(document.location))
    {
        var info=ds.getArchive(document.location);
        observer.observe(info, AV_TOPIC, "end:");
    }

    var file = /[^\/]*$/.test(document.location) && RegExp.lastMatch || document.location;
    document.title = file + " - " + document.title;
}

function onUnload()
{
    if (avDebug) return true;

    var obssrv=CC[NS_OBSSRV_CTID].getService(CI.nsIObserverService);
    obssrv.removeObserver(observer, AV_TOPIC);

    NS_PREFSRV.removeObserver(AV_PREF, avPrefsObserver);

    var ds=AV_RDFDS.QueryInterface(CI.avIArchviewSource);
    ds.removeArchive(document.location);
}

// Download the whole archive file.
function onDown()
{
    var ds=AV_RDFDS.QueryInterface(CI.avIArchviewSource);
    var info=ds.getArchive(document.location);
    var refer=null;
    if (info.referer)
    {
        refer=CC["@mozilla.org/network/simple-uri;1"].
            createInstance(CI.nsIURI);
        refer.spec=info.referer;
    }
    saveURL(info.location, null, null, true, false, refer, document);
}

// Export list
function onList(selected)
{
    var sel=avTree.view.selection;
    if (!avTree.view.rowCount || selected && !sel.count)
        return;

    var uri=document.location.toString();
    var t=uri.lastIndexOf("/")+1;
    var fp = CC["@mozilla.org/filepicker;1"].createInstance(CI.nsIFilePicker);
    fp.init(window, "Export to file", fp.modeSave);
    fp.appendFilters(fp.filterHTML|fp.filterAll);
    fp.filterIndex=1;
    fp.defaultString=uri.slice(t)+".html";
    fp.defaultExtension="html";
    if (fp.show()==fp.returnCancel) return;

    var gen=CC[AV_HTML_CTID].createInstance(CI.avIArchviewInterface);
    var out=CC["@mozilla.org/network/file-output-stream;1"].
            createInstance(CI.nsIFileOutputStream);
    out.init(fp.file, -1, -1, 0);
    gen.init(out);

    var ds=AV_RDFDS.QueryInterface(CI.avIArchviewSource);
    var info=ds.getArchive(document.location);
    gen=gen.QueryInterface(CI.nsIStreamListener);
    gen.onStartRequest(null, info);
    if (selected)
    {
        var action=function(row, context)
        {
            var fn="/"+avTree.view.getCellText(row, context.dncol)+
                    avTree.view.getCellText(row, context.bncol);
            var entry=ds.getEntry(document.location, fn);
            context.gen.onDataAvailable(null, entry, null, row, 0);
            context.filecount++;
            context.sizecount+=avTree.view.getCellText(row, context.szcol)-0;
        };
        var context=new Object();
        context.gen=gen;
        context.bncol=avTree.columns.getNamedColumn("avBasenameCol");
        context.dncol=avTree.columns.getNamedColumn("avDirnameCol");
        context.szcol=avTree.columns.getNamedColumn("avFilesizeCol");
        context.filecount=0;
        context.sizecount=0;
        avForeach(action, context);
        info.filecount=context.filecount;
        info.sizecount=context.sizecount;
    }
    else
    {
        var all=ds.getEnumerator(document.location);
        var count=0;
        while(all.hasMore())
        {
            var entry=ds.getEntry(document.location, all.getNext());
            gen.onDataAvailable(null, entry, null, count++, 0);
        }
    }
    gen.onStopRequest(null, info, CR.NS_OK);
}

function onSelect(mode)
{
    var select=avTree.view.selection;
    var rows=avTree.view.rowCount-1;
    if (rows<0) return;

    select.selectEventsSuppressed=true;
    switch(mode)
    {
        case "all":
            select.selectAll();
            break;
        case "none":
            select.clearSelection();
            break;
        case "invert":
            //select.invertSelection();
            var min=new Object();
            var max=new Object();
            for (var i=0, t=0; i<select.getRangeCount(); i++)
            {
                select.getRangeAt(i, min, max);
                select.clearRange(min.value, max.value);
                if (min.value>t)
                    select.rangedSelect(t, min.value-1, true);
                else
                    i--;
                t=max.value+1;
            }
            if (rows>=t) select.rangedSelect(t, rows, true);
            break;
        case "bytype":
            var col=document.getElementById("avBasenameCol");
            col=avTree.columns.getColumnFor(col);
            if (select.currentIndex<0)
                return true;
            var name=avTree.view.getCellText(select.currentIndex, col);
            var t=name.lastIndexOf(".");
            type=(t>=0)?name.slice(t):"";
            select.clearSelection();
            for (; rows>=0; rows--)
            {
                name=avTree.view.getCellText(rows, col);
                if (type)
                {
                    t=name.lastIndexOf(type);
                    t=(t+type.length==name.length);
                }
                else
                {
                    t=name.lastIndexOf(".");
                    t=(t==-1||t==name.length-1);
                }
                if (t && !select.isSelected(rows))
                    select.toggleSelect(rows);
            }
            break;
    }
    select.selectEventsSuppressed=false;
    onTreeSelect();
}

function onView(mode)
{
    avSetView(mode);
}

function onSort(event)
{
    var id=event.target.id;
    var col;
    if (id=="avUnsortItem")
    {
        col=avTree.columns.getSortedColumn().element;
        var dir=col.getAttribute("sortDirection");
        if (dir=="natural") return;
        if (dir=="ascending")
            col.setAttribute("sortDirection", "descending");
    }
    else
    {
        id="av"+id.slice(4, id.length-4)+"Col";
        col=document.getElementById(id);
        if (!col)  return true;
    }
    avTree.builderView.sort(col);
}

function onComment()
{
    var ds=AV_RDFDS.QueryInterface(CI.avIArchviewSource);
    var info=ds.getArchive(document.location);
    window.openDialog("chrome://archview/content/comment.xul", "comment",
        "chrome,dialog,modal,resizable=yes,centerscreen,width=600,height=400",
        info.comment);
}

function onSettings()
{
    var features="chrome,titlebar,toolbar,centerscreen,modal";
    try {
        if (NS_PREFSRV.getBoolPref("browser.preferences.instantApply"))
            features=features.replace("modal", "dialog=no");
    } catch (ex) { }
    window.openDialog("chrome://archview/content/settings.xul", "settings", features);
}

function onAbout()
{
    window.openDialog("chrome://archview/content/about.xul", "about",
        "chrome,dialog,modal,resizable=no,centerscreen");
}

function onHome()
{
    window.open('http://archview.sourceforge.net/', '_blank');
}

function onHelp()
{
    window.open('chrome://archview/locale/manual.html', '_blank');
}

function onTreeSelect()
{
    var size=new Object();
    var action=function(row, size)
    {
        size.value+=avTree.view.getCellText(row, size.col)-0;
        return 0;
    }

    size.col=avTree.columns.getNamedColumn("avFilesizeCol");
    size.value=0;
    avForeach(action, size);

    var node=document.getElementById("avSelectStatus");
    node.label=avGetStatusString("selected",
            avTree.view.selection.count, size.value);
    return true ;
}

function onTreeColClick(event)
{
    var id=event.target.id;
    var dir=event.target.getAttribute("sortDirection");
    if (dir=="natural")
        id="avUnsortItem";
    else
        id="avBy"+id.slice(2, id.length-3)+"Item";
    var node=document.getElementById(id);
    if (node) node.setAttribute("checked", "true");
}

function onTreeKeyPress(event)
{
    var sel=avTree.view.selection;
    if (sel.currentIndex>=0 && event.keyCode==13)
    {
        onOpen(false);
        if (avViewMode=="tree" &&
            avTree.view.isContainer(sel.currentIndex))
            avTree.view.toggleOpenState(sel.currentIndex);
    }
}

function onTreeDblClick(event)
{
    var row=avTree.treeBoxObject.getRowAt(event.clientX, event.clientY);
    if (row>=0)
    {
        if (avViewMode!="tree" || !avTree.view.isContainer(row))
            avOpen(row, false);
    }
}

function onToolbarChange(mode)
{
    var old=NS_PREFSRV.getCharPref(AV_PREF_TOOLBAR);

    if (mode=="-" || mode=="|")
        mode+=old.slice(1);
    else
        mode=old[0]+mode;

    NS_PREFSRV.setCharPref(AV_PREF_TOOLBAR, mode);
}

function onShowTreePopup(event)
{
    var row=avTree.treeBoxObject.getRowAt(event.clientX, event.clientY);
    if (row<0) return false;

    var bn=avTree.columns.getNamedColumn("avBasenameCol");
    bn=avTree.view.getCellText(row, bn);

    var expand=document.getElementById("avTreeExpandItem");
    var save=document.getElementById("avTreeSaveItem");
    if (bn[bn.length-1]=="/")
    {
        expand.hidden=(avViewMode!="tree");
        save.hidden=true;
    }
    else
    {
        expand.hidden=true;
        save.hidden=false;
    }
}

function onExpand()
{
    if (avViewMode=="tree")
        avForeach(avExpand, undefined);
}

function onOpen(save)
{
    var sel=avTree.view.selection;
    avForeach(avOpen, save);
    if (sel.currentIndex<0)
    {
        var t=new Object();
        sel.getRangeAt(0, t, new Object());
        sel.currentIndex=t.value;
    }
}

function onMouseOver(event)
{
    var btn=event.target;
    if (btn.open || btn.type!="menu")
        return;
    var toolbar=event.currentTarget;
    var btns=toolbar.getElementsByTagName("toolbarbutton");
    for (var i=0, l=btns.length; i<l; ++i)
    {
        var b=btns[i];
        if (b!=btn && b.type=="menu" && b.open)
        {
            b.open=false;
            btn.open=true;
            break;
        }
    }
}

/////////////////////////////////////////////////////
//
// These functions are for internal use.
//
/////////////////////////////////////////////////////


function avShow(info)
{
    var node=document.getElementById("avCommentItem");
    node.disabled=info.comment?false:true;
    avSetStatus(info);

    avTree.ref=document.location;
    avTree.database.AddDataSource(AV_RDFDS);
    avSetView();
}

function avForeach(action, context)
{
    var selection=avTree.view.selection;
    var min=new Object();
    var max=new Object();
    for (var i=0; i<selection.getRangeCount(); i++)
    {
        selection.getRangeAt(i, min, max);
        for (var j=min.value; j<=max.value; j++)
            if (action(j, context))
                selection.getRangeAt(i, min, max);
    }
}

function avOpen(row, save)
{
    var bn=avTree.columns.getNamedColumn("avBasenameCol");
    bn=avTree.view.getCellText(row, bn);
    var fn=avTree.columns.getNamedColumn("avDirnameCol");
    fn=avTree.view.getCellText(row, fn)+bn;

    var ds=AV_RDFDS.QueryInterface(CI.avIArchviewSource);
    if (bn[bn.length-1]=="/")
    {
        if (avViewMode=="folder")
            ds.buildFolderView(document.location, fn);
        else if (avViewMode=="tree")
            avTree.view.toggleOpenState(row);
        else
            return false;
        return true;
    }
    else
    {
        var info=ds.getArchive(document.location);
        if (info.solidarch)
        {
            var title=avStrings.getString("error");
            var str=avStrings.getString("error_solid_archive");
            var promsrv=CC[NS_PROMSRV_CTID].getService(CI.nsIPromptService);
            promsrv.alert(window, title, str);
        }
        else
        {
            var entry=ds.getEntry(document.location, "/"+fn);
            var uri=info.location+"#"+bn+"/"+entry.position+"/"+
                (entry.packsize+entry.headsize)+"/"+entry.filesize;
            if (save) uri+="/1";
            window.open(uri, "_blank");
        }
    }
}

function avExpand(row)
{
    if (!avTree.view.isContainer(row))
        return 0;
    if (!avTree.view.isContainerOpen(row))
        avTree.view.toggleOpenState(row);
    var parent=row++;
    while (avTree.view.rowCount>row &&
        avTree.view.getParentIndex(row)==parent)
    {
        if (avTree.view.isContainer(row))
            row=avExpand(row);
        else
            row++;
    }
    return row;
}

function avSetView(mode)
{
    if (!mode)
        mode=NS_PREFSRV.getCharPref(AV_PREF_VIEW);
    if (mode==avViewMode) return;
    avViewMode=mode;

    var node="av"+mode[0].toUpperCase()+mode.slice(1)+"Item";
    node=document.getElementById(node);
    if (node) node.setAttribute("checked", "true");

    var ds=AV_RDFDS.QueryInterface(CI.avIArchviewSource);
    switch (mode)
    {
        case "flat":
            ds.buildFlatView(document.location);
            break;
        case "folder":
            ds.buildFolderView(document.location, "/");
            break;
        case "tree":
            ds.buildTreeView(document.location);
            break;
        case "explorer":
        default:
    }
    avTree.focus();
}

function avSetColumn(name, flag)
{
    var node;

    if (name)
    {
        name="av"+name[0].toUpperCase()+name.slice(1)+"Col";
        node=document.getElementById(name);
        if (flag==undefined)
            flag=NS_PREFSRV.getBoolPref(AV_PREF_COLUMN+name);
        if (node && node.hidden==flag)
            node.hidden=!flag;
        return;
    }

    var columns=NS_PREFSRV.getChildList(AV_PREF_COLUMN, new Object());
    for (var i=0; i<columns.length; i++)
    {
        name=columns[i].slice(AV_PREF_COLUMN.length);
        name="av"+name[0].toUpperCase()+name.slice(1)+"Col";
        node=document.getElementById(name);
        flag=NS_PREFSRV.getBoolPref(columns[i]);
        if (node && node.hidden==flag)
            node.hidden=!flag;
    }
}

function avSetToolbar(mode)
{
    var orient="";
    if (!mode)
        mode=NS_PREFSRV.getCharPref(AV_PREF_TOOLBAR);
    if (mode[0]=="-" || mode[0]=="|")
    {
        orient=mode[0];
        mode=mode.slice(1);
    }

    var item;
    if (orient=="-")
        item=document.getElementById("avToolbarHoriItem");
    else if (orient=="|")
        item=document.getElementById("avToolbarVertItem");
    item.setAttribute("checked", "true");
    item="avToolbar"+mode[0].toUpperCase()+mode.slice(1)+"Item";
    item=document.getElementById(item);
    if (item)  item.setAttribute("checked", "true");

    var nodes=document.getElementById("avToolBar").childNodes;
    for (var i = 0; i < nodes.length; i++)
    {
        var t=nodes[i].id.toLowerCase();
        t=t.slice(2, t.length-3);
        if (mode=="icon")        // icon only
        {
            nodes[i].removeAttribute("label");
            nodes[i].setAttribute("image", "chrome://archview/skin/icons/"+t+".ico");
        }
        else if (mode=="text")   // text only
        {
            nodes[i].removeAttribute("image");
            nodes[i].setAttribute("label", nodes[i].getAttribute("text"));
        }
        else if (mode=="full")
        {
            nodes[i].setAttribute("label", nodes[i].getAttribute("text"));
            nodes[i].setAttribute("image", "chrome://archview/skin/icons/"+t+".ico");
        }

        if (orient=="-")
            nodes[i].setAttribute("orient", "horizonal");
        else if (orient=="|")
            nodes[i].setAttribute("orient", "vertical");
        if (nodes[i].type=="menu")
        {   // toolbarbutton of menu type needs special refreshing
            nodes[i].focus();
            nodes[i].firstChild.hidePopup();
        }
    }
}

function avSetStatus(info)
{
    var node=document.getElementById("avTotalStatus");
    node.label=avGetStatusString("total", info.filecount, info.sizecount);
    node=document.getElementById("avSelectStatus");
    node.label=avGetStatusString("selected", 0, 0);
    node=document.getElementById("avErrorStatus");
    node.label=avGetErrorString(info.errorcode);
}

function avGetErrorString(code)
{
    var str;
    switch(code)
    {
        case AV_OK:
            str=avStrings.getString("error_ok");
            break;
        case AV_ERROR_UNKNOWN_FORMAT:
            str=avStrings.getString("error_unknown_format");
            break;
        case AV_ERROR_READ_FAILED:
            str=avStrings.getString("error_read_failed");
            break;
        case AV_ERROR_EXTRA_DATA:
            str=avStrings.getString("error_extra_data");
            break;
        case AV_ERROR_FILE_CORRUPTED:
            str=avStrings.getString("error_file_corrupted");
            break;
        case AV_ERROR_NOT_RESUMABLE:
            str=avStrings.getString("error_not_resumable");
            break;
        default:
            str="Internal error.";
    }
    return str;
}

function avGetStatusString(mode, filecount, sizecount)
{
    var str=avStrings.getString(mode);
    var t=filecount>1?"files":"file";
    if (!str) return "";
    str+=": "+filecount.toLocaleString()+" "+avStrings.getString(t);
    if (sizecount) str+=", "+sizecount.toLocaleString();
    return str;
}

var avPrefsObserver=
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
        var key=branch.root+suffix;
        if (key==AV_PREF_TOOLBAR)
            avSetToolbar(branch.getCharPref(suffix));
        else if (key==AV_PREF_VIEW)
            avSetView(branch.getCharPref(suffix));
        else if (!key.indexOf(AV_PREF_COLUMN))
            avSetColumn(key.slice(AV_PREF_COLUMN.length),
                branch.getBoolPref(suffix));
    }
}

/////////////////////////////////////////////////////
//
// These functions are only for debugging.
//
/////////////////////////////////////////////////////

const NS_CONSRV_CTID="@mozilla.org/consoleservice;1";
const NS_CONSRV=CC[NS_CONSRV_CTID].getService(CI.nsIConsoleService);
const DEBUG=function(msg) {NS_CONSRV.logStringMessage(msg);};

var debugOutputStream=
{
    buf: "",
    close: function()
    {
        this.flush();
    },
    flush: function()
    {
        DEBUG(this.buf);
        this.buf="";
    },
    write: function(buf, count)
    {
        //this.output(buf.slice(0, count));
        DEBUG(buf.slice(0,count));
        return count;
    },
    writeFrom: function(inp, count)
    {
        var sin=CC["@mozilla.org/scriptable-input-stream;1"].
            createInstance(CI.nsIScriptableInputStream);
        sin.init(inp);
        this.output(sin.read(count));
        return count;
    },
    output: function(buf)
    {
        this.buf+=buf;
        var t=this.buf.lastIndexOf("\n")+1;
        if (!t) t=this.buf.length;
        DEBUG(this.buf.slice(0, t));
        this.buf=this.buf.slice(t);
    }
};

function dumpDataSource()
{
    var root, tag;
    var ser=CC["@mozilla.org/rdf/serializer;1?format=ntriples"].
        createInstance(CI.rdfISerializer);
    var ds=AV_RDFDS.QueryInterface(CI.rdfIDataSource);
    ser.serialize(ds, debugOutputStream);
}

function dumpCategory()
{
    DEBUG(getCategory("net-content-sniffers"));
    DEBUG(getCategory("Gecko-Content-Viewers"));
}

function getCategory(cate)
{
    var catman=CC["@mozilla.org/categorymanager;1"].
        getService(CI.nsICategoryManager);
    var e=catman.enumerateCategory(cate);
    var str="";
    while(e.hasMoreElements())
    {
        var t=e.getNext();
        t=t.QueryInterface(CI.nsISupportsCString);
        str+=t.toString()+"\n";
    }
    return str;
}
