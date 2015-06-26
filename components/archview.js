const CC=Components.classes;
const CI=Components.interfaces;
const CR=Components.results;
const CU=Components.utils;

const MIME_XUL="application/vnd.mozilla.xul+xml";
const MIME_HTML="text/html";
const MIME_TEXT="text/plain";
const MIME_ZIP="application/zip";
const MIME_ZIP_AV=MIME_ZIP+"-archview";
const MIME_RAR="application/rar";
const MIME_RAR_AV=MIME_RAR+"-archview";
const MIME_ISO="application/iso";
const MIME_ISO_AV=MIME_ISO+"-archview";
const MIME_UNKNOWN="application/x-unknown-content-type";
const MIME_OCTET="application/octet-stream";
const MIME_SAVE_AV="application/always-save-archview";

const MTUSIZE=1400;
const INT32_MAX=2147483647;
const NS_BINDING_ABORTED=0x804B0002;
const NS_BINDING_REDIRECTED=0x804B0003;
const NS_BINDING_RETARGETED=0x804B0004;
const NS_ERROR_NOT_RESUMABLE=0x804B0019;
const NS_PREFCHANGE_TOPIC="nsPref:changed";
const NS_CONTENT_SNIFFER_CATEGORY="net-content-sniffers";
const NS_CONTENT_VIEWER_CATEGORY="Gecko-Content-Viewers";
const NS_DATASOURCE_PREFIX="@mozilla.org/rdf/datasource;1?name=";
const NS_STREAM_CONVERTER_PREFIX="@mozilla.org/streamconv;1?from=";

const NS_CATEMAN_CTID="@mozilla.org/categorymanager;1";
const NS_CONSRV_CTID="@mozilla.org/consoleservice;1";
const NS_DIRSRV_CTID="@mozilla.org/file/directory_service;1";
const NS_IOSRV_CTID="@mozilla.org/network/io-service;1";
const NS_MEMDS_CTID="@mozilla.org/rdf/datasource;1?name=in-memory-datasource";
const NS_OBSSRV_CTID="@mozilla.org/observer-service;1";
const NS_PREFSRV_CTID="@mozilla.org/preferences-service;1";
const NS_RDFSRV_CTID="@mozilla.org/rdf/rdf-service;1";
const NS_RDFUTIL_CTID="@mozilla.org/rdf/container-utils;1";
const NS_STRBSRV_CTID="@mozilla.org/intl/stringbundle;1";

const NS_CONSRV=CC[NS_CONSRV_CTID].getService(CI.nsIConsoleService);
const DEBUG=function(msg) {NS_CONSRV.logStringMessage(msg);};

const NS_RDFSRV=CC[NS_RDFSRV_CTID].getService(CI.nsIRDFService);
const NS_RDFUTIL=CC[NS_RDFUTIL_CTID].getService(CI.nsIRDFContainerUtils);
const RDF_KEY_INSTANCEOF=NS_RDFSRV.GetResource("http://www.w3.org/1999/02/22-rdf-syntax-ns#instanceOf");
const RDF_KEY_NEXTVAL=NS_RDFSRV.GetResource("http://www.w3.org/1999/02/22-rdf-syntax-ns#nextVal");
//const RDF_KEY_SEQ=NS_RDFSRV.GetResource("http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq");
//const RDF_KEY_BAG=NS_RDFSRV.GetResource("http://www.w3.org/1999/02/22-rdf-syntax-ns#Bag");
//const RDF_KEY_ALT=NS_RDFSRV.GetResource("http://www.w3.org/1999/02/22-rdf-syntax-ns#Alt");

const AV_OK=0;
const AV_ERROR_UNKNOWN_FORMAT=1;
const AV_ERROR_READ_FAILED=2;
const AV_ERROR_EXTRA_DATA=3;
const AV_ERROR_FILE_CORRUPTED=4;
const AV_ERROR_NOT_RESUMABLE=5;
const AV_TRANSFER_COMPLETE=0x804B0009;
const AV_LOADFLAG_ARCHVIEW=0x4000;
const AV_LOADFLAG_FRAGMENT=0x8000;

const AV_PREF="extensions.archview.";
const AV_PREF_ENABLED=AV_PREF+"enabled";
const AV_PREF_INTERFACE=AV_PREF+"interface";
const AV_PREF_CHARSET=AV_PREF+"charset";
const AV_PREF_EXCLUDE=AV_PREF+"exclude";
const AV_PREF_FRAGSIZE=AV_PREF+"fragsize";
const AV_PREF_PROTOCOL=AV_PREF+"protocol.";
const AV_PREF_FORMAT=AV_PREF+"format.";

const AV_TOPIC="archview-notify";
const AV_CHROME="chrome://archview/content/";
const AV_CHANNEL_PREFIX="@archview.ffe/archview-channel;1?scheme=";
const AV_SNIFFER_PREFIX="@archview.ffe/archview-sniffer;1?type=";
const AV_LISTER_PREFIX="@archview.ffe/archview-lister;1?type=";
const AV_INTERFACE_PREFIX="@archview.ffe/archview-interface;1?type=";

const AV_INFO_NAME="Archive Info";
const AV_INFO_CTID="@archview.ffe/archview-info;1";
const AV_INFO_CID=Components.ID("AE73B6C2-4D58-4007-AB64-7FCF8E13AEE8");

const AV_ENTRY_NAME="Archive Entry";
const AV_ENTRY_CTID="@archview.ffe/archview-entry;1";
const AV_ENTRY_CID=Components.ID("BB0BC810-1508-4981-8AB2-2CD42F163E9F");

const AV_HTML_NAME="Archive Viewer HTML Interface";
const AV_HTML_CTID=AV_INTERFACE_PREFIX+MIME_HTML;
const AV_HTML_CID=Components.ID("B19B81B9-62CE-450F-B10E-1533C64700CD");

const AV_XUL_NAME="Archive Viewer XUL Interface";
const AV_XUL_CTID=AV_INTERFACE_PREFIX+MIME_XUL;
const AV_XUL_CID=Components.ID("929A330B-ACC5-4C12-9BB0-1C035A2CE247");

const AV_DATASRC_NAME="Archive Viewer RDF Data Source";
//const AV_DATASRC_CTID="@archview.ffe/archview-datasource;1";
const AV_DATASRC_CTID=NS_DATASOURCE_PREFIX+"archview";
const AV_DATASRC_CID=Components.ID("E848F7FD-7A85-4743-82DF-96360D0541A8");

const AV_DLF_NAME="Archive Viewer Document Loader Factory";
const AV_DLF_CTID="@archview.ffe/archview-factory;1";
const AV_DLF_CID=Components.ID("5AD2325B-4FD4-4C8A-BB56-CDE13DEF2C11");

const AV_ISOSNIFF_NAME="Archive Viewer ISO Content Sniffer";
const AV_ISOSNIFF_CTID=AV_SNIFFER_PREFIX+MIME_ISO;
const AV_ISOSNIFF_CID=Components.ID("4DA4DB41-189A-457D-935A-497D537F4528");

const AV_ISO_NAME="Archive Viewer ISO Lister";
const AV_ISO_CTID=AV_LISTER_PREFIX+MIME_ISO;
const AV_ISO_CID=Components.ID("EB8CB478-E431-4F36-BA50-FEFEEFFF6EBC");

const AV_ISOCONV_NAME="Archive Viewer ISO Converter";
const AV_ISOCONV_CTID=NS_STREAM_CONVERTER_PREFIX+MIME_ISO_AV+"&to=*/*";
const AV_ISOCONV_CID=Components.ID("FF6705AA-6593-4B58-8A6C-BFFE51A133B9");

const AV_RARSNIFF_NAME="Archive Viewer RAR Content Sniffer";
const AV_RARSNIFF_CTID=AV_SNIFFER_PREFIX+MIME_RAR;
const AV_RARSNIFF_CID=Components.ID("CF7E3858-D5A1-4013-B1ED-07A27D1C2B14");

const AV_RAR_NAME="Archive Viewer RAR Lister";
const AV_RAR_CTID=AV_LISTER_PREFIX+MIME_RAR;
const AV_RAR_CID=Components.ID("9D8DD01D-827B-46B3-9DDC-039BEE23FF65");

const AV_RARCONV_NAME="Archive Viewer RAR Converter";
const AV_RARCONV_CTID=NS_STREAM_CONVERTER_PREFIX+MIME_RAR_AV+"&to=*/*";
const AV_RARCONV_CID=Components.ID("EC17E4EC-C142-45E1-A460-7FDDC9586F40");

const AV_ZIPSNIFF_NAME="Archive Viewer ZIP Content Sniffer";
const AV_ZIPSNIFF_CTID=AV_SNIFFER_PREFIX+MIME_ZIP;
const AV_ZIPSNIFF_CID=Components.ID("1B5289EE-719E-4099-A9F4-3852AFBBC926");

const AV_ZIP_NAME="Archive Viewer ZIP Lister";
const AV_ZIP_CTID=AV_LISTER_PREFIX+MIME_ZIP;
const AV_ZIP_CID=Components.ID("2E8B3A32-1A53-4F2F-A865-9A1F0E132A8E");

const AV_ZIPCONV_NAME="Archive Viewer ZIP Converter";
const AV_ZIPCONV_CTID=NS_STREAM_CONVERTER_PREFIX+MIME_ZIP_AV+"&to=*/*";
const AV_ZIPCONV_CID=Components.ID("CA3CADA4-BCCD-48C3-A44E-93EDCA2C6723");

const AV_CHANNEL_CID=Components.ID("A884F50D-5256-4A57-B535-A27F71D4F153");
const AV_HTTP_NAME="Archview HTTP Channel";
const AV_HTTP_CTID=AV_CHANNEL_PREFIX+"http";
const AV_HTTPS_NAME="Archview HTTPS Channel";
const AV_HTTPS_CTID=AV_CHANNEL_PREFIX+"https";
const AV_FTP_NAME="Archview FTP Channel";
const AV_FTP_CTID=AV_CHANNEL_PREFIX+"ftp";
const AV_FILE_NAME="Archview File Channel";
const AV_FILE_CTID=AV_CHANNEL_PREFIX+"file";

const AV_KEY_ARCHVIEW=NS_RDFSRV.GetResource("@archview.ffe/rdf#archview");
const AV_KEY_FILENAME=NS_RDFSRV.GetResource("@archview.ffe/rdf#filename");
const AV_KEY_FILETYPE=NS_RDFSRV.GetResource("@archview.ffe/rdf#filetype");
const AV_KEY_BASENAME=NS_RDFSRV.GetResource("@archview.ffe/rdf#basename");
const AV_KEY_DIRNAME=NS_RDFSRV.GetResource("@archview.ffe/rdf#dirname");
const AV_KEY_FILESIZE=NS_RDFSRV.GetResource("@archview.ffe/rdf#filesize");
//const AV_KEY_FILESIZE_=NS_RDFSRV.GetResource("@archview.ffe/rdf#filesize_");
const AV_KEY_MODIFIED=NS_RDFSRV.GetResource("@archview.ffe/rdf#modified");
const AV_KEY_ATTRIB=NS_RDFSRV.GetResource("@archview.ffe/rdf#attribute");
const AV_KEY_CHECKSUM=NS_RDFSRV.GetResource("@archview.ffe/rdf#checksum");
const AV_KEY_POSITION=NS_RDFSRV.GetResource("@archview.ffe/rdf#position");
const AV_KEY_PACKSIZE=NS_RDFSRV.GetResource("@archview.ffe/rdf#packsize");
//const AV_KEY_PACKSIZE_=NS_RDFSRV.GetResource("@archview.ffe/rdf#packsize_");
const AV_KEY_HEADSIZE=NS_RDFSRV.GetResource("@archview.ffe/rdf#headsize");
const AV_KEY_METHOD=NS_RDFSRV.GetResource("@archview.ffe/rdf#method");
const AV_KEY_COMMENT=NS_RDFSRV.GetResource("@archview.ffe/rdf#comment");
//const AV_KEY_OSTYPE=NS_RDFSRV.GetResource("@archview.ffe/rdf#ostype");

const AV_KEY_LOCATION=NS_RDFSRV.GetResource("@archview.ffe/rdf#location");
const AV_KEY_REFERER=NS_RDFSRV.GetResource("@archview.ffe/rdf#referer");
const AV_KEY_SOLIDARCH=NS_RDFSRV.GetResource("@archview.ffe/rdf#solidarch");
const AV_KEY_FILECOUNT=NS_RDFSRV.GetResource("@archview.ffe/rdf#filecount");
const AV_KEY_SIZECOUNT=NS_RDFSRV.GetResource("@archview.ffe/rdf#sizecount");
const AV_KEY_ERRORCODE=NS_RDFSRV.GetResource("@archview.ffe/rdf#errorcode");

var appInfo = CC["@mozilla.org/xre/app-info;1"].getService(CI.nsIXULAppInfo);
var fixCharset = parseFloat(appInfo.platformVersion) >= 2;


function convertDosDateTime(time)
{
    var t=new Date();
    t.setFullYear(((time&0xFE000000)>>25)+1980);
    t.setMonth(((time&0x01E00000)>>21)-1);
    t.setDate((time&0x001F0000)>>16);
    t.setHours((time&0x0000F800)>>11);
    t.setMinutes((time&0x000007E0)>>5, time&0x0000001F);
    return t.getTime();
};
function convertPattern(str)
{
    // canonicalize glob
    var re=";"+str+";";
    re=re.replace(/;\./g, ";*.");
    re=re.replace(/\.;/g, ".*;");
    // convert to regular expression
    re=re.replace(/\\|\.|\$|\+|\(|\)|\{|\}/g, "\\$&");
    re=re.replace(/([^[])\^/g, "$1\\^");
    re=re.replace(/\?/g, ".");
    re=re.replace(/\*/g, ".*");
    re=re.replace(/;/g, "$|^");
    re=re.replace(/^\$\|(.*)\|\^$/, "$1");
    return new RegExp(re, "i");
};

function CRC32(poly)
{
    this.table=this.buildTable(poly);
};
CRC32.prototype=
{
    crctable: null,
    polynomial: 0xedb88320,

    getPolynomial: function(bits)
    {
        var poly=0;
        if (!bits)
            bits=[0,1,2,4,5,7,8,10,11,12,16,22,23,26];
        for (var i=0; i<bits.length; i++)
            poly|=1<<(31-bits[i]);
        return poly;
    },
    buildTable: function(poly)
    {
        if (poly) this.polynomial=poly;
 
        this.crctable=[];
        for (var i=0; i<256; i++)
        {
            var c=i;
            for (var k=8; k; k--)
                c=c&1?this.polynomial^(c>>>1):c>>>1;
            this.crctable[i]=c>=0?c:0xffffffff-~c;
        }
    },
    crc32: function(crc, buf)
    {
        crc=~crc;
        for (var i=0; i<buf.length; i++)
            crc=this.crctable[(crc^buf.charCodeAt(i))&0xFF]^(crc>>>8);
        return ~crc;
    }
};



const ISO_SECTOR_SIZE=2048;
const ISO_VD_HEAD="\x43\x44\x30\x30\x31\x01";
const ISO_VD_HEAD_SIZE=ISO_VD_HEAD.length+1;
const ISO_VD_SIZE=883;

function ArchviewISO()
{
    this.conv=CC["@mozilla.org/intl/scriptableunicodeconverter"].
        createInstance(CI.nsIScriptableUnicodeConverter);
};
ArchviewISO.prototype=
{
    sect: 0,
    last: 0,
    pathtbl: null,

    stat: 0,
    buffer: "",
    offset: 0,
    skip: 0,
    output: null,
    info: null,
    entry: null,

    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIRequestObserver) &&
            !iid.equals(CI.nsIStreamListener) &&
            !iid.equals(CI.avIArchviewLister))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    onStartRequest: function(request, context)
    {
        this.buffer="";
        switch (this.stat)
        {
            case 0:
                break;
            case 1:
                this.sect=0;
                this.skip=0;
                this.output.onStartRequest(request, this.info);
                break;
            case 2:
                this.pathtbl=[];
                this.last=this.sect+1;
                this.offset=0;
                this.info.filecount=0;
                break;
        }
    },
    onStopRequest: function(request, context, status)
    {
        switch(this.stat)
        {
            case 0:    // first 16 sectors skiped
                this.sect=16;
                this.stat=1;
                break;
            case 1:    // Volum Descriptor readed
                if (status==NS_ERROR_NOT_RESUMABLE)
                {
                    this.info.errorcode=AV_ERROR_NOT_RESUMABLE;
                    break;
                }
                if (!this.sect)
                    this.info.errorcode=AV_ERROR_FILE_CORRUPTED;
                this.stat=2;
                break;
            case 2:    // Directories readed
                this.stat=3;
                break;
            case 4:    // unknown format
                this.info.errorcode=AV_ERROR_UNKNOWN_FORMAT;
                break;
            case 5:    // file corrupt
                this.info.errorcode=AV_ERROR_FILE_CORRUPTED;
                break;
        }

        if (this.stat<3 && this.info.errorcode==AV_OK)
        {
            var ch=request.QueryInterface(CI.nsIChannel);
            var fch=CC[AV_CHANNEL_PREFIX+ch.URI.scheme].createInstance(CI.avIArchviewChannel);
            fch.init(ch, this.sect*ISO_SECTOR_SIZE, INT32_MAX);
            fch=fch.QueryInterface(CI.nsIChannel);
            fch.loadGroup=null;
            fch.asyncOpen(this, context);
            return;
        }
        this.output.onStopRequest(request, this.info, this.info.errorcode);
    },
    onDataAvailable: function(request, context, input, offset, count)
    {
        var bin=CC["@mozilla.org/binaryinputstream;1"].createInstance(CI.nsIBinaryInputStream);
        bin.setInputStream(input);
        this.buffer+=bin.readBytes(count);
        switch(this.stat)
        {
            case 0:    // the first 16 sectors are empty
                request.cancel(NS_BINDING_REDIRECTED);
                break;
            case 1:    // collect Volume Descriptor data
                while (this.buffer.length>=ISO_VD_SIZE)
                {
                    if (this.skip)
                    {
                        if (this.skip>this.buffer.length)
                        {
                            this.skip-=this.buffer.length;
                            this.buffer="";
                            break;
                        }
                        this.buffer=this.buffer.slice(this.skip);
                        this.skip=0;
                        continue;
                    }
                    if (this.buffer.indexOf(ISO_VD_HEAD)!=1)
                    {
                        this.stat=4;
                        request.cancel(NS_BINDING_ABORTED);
                        return;
                    }
                    switch (this.buffer.charCodeAt(0))
                    {
                        case 1:    // Primary Volume Descriptor
                        case 2:    // Joliet Volume Descriptor
                            //this.sysid=this.buffer.slice(ISO_VD_HEAD_SIZE+1, ISO_VD_HEAD_SIZE+33);
                            //this.volid=this.buffer.slice(ISO_VD_HEAD_SIZE+33, ISO_VD_HEAD_SIZE+65);
                            this.sect=this.buffer.charCodeAt(158)+(this.buffer.charCodeAt(159)<<8)+
                                (this.buffer.charCodeAt(160)<<16)+(this.buffer.charCodeAt(161)<<24);
                            if (this.buffer.charCodeAt(0)&1)
                                this.conv.charset="ISO-8859-1";
                            else
                                this.conv.charset="UTF-16BE";    // Joliet
                        case 0:    // Boot Volume Descriptor
                            if (this.buffer.length<=ISO_SECTOR_SIZE)
                            {
                                this.skip=ISO_SECTOR_SIZE-this.buffer.length;
                                this.buffer="";
                            }
                            else
                                this.buffer=this.buffer.slice(ISO_SECTOR_SIZE);
                            break;
                        case 255:  // End Volume Descriptor
                            request.cancel(NS_BINDING_ABORTED);
                            return;
                    }
                }
               break;
            case 2:    // collect directories data
                for (var i=0, len=this.buffer.charCodeAt(0);
                     this.buffer.length>=i+len;
                     i+=len, this.offset+=len, len=this.buffer.charCodeAt(i))
                {
                    if (this.offset>=(this.last-this.sect)*ISO_SECTOR_SIZE)
                    {   // the end
                        request.cancel(NS_BINDING_ABORTED);
                        return;
                    }
                    if (!len)
                    {   // found a gap, skip it
                        len=ISO_SECTOR_SIZE-(this.offset%ISO_SECTOR_SIZE);
                        if (len+i>=this.buffer.length)  break;
                        continue;
                    }
                    var flen=this.buffer.charCodeAt(i+32);    // length of filename
                    if (len<33+flen)
                    {
                        this.stat=5;
                        request.cancel(NS_BINDING_ABORTED);
                        return;
                    }
                    if (flen>1)    // skip "." and ".." entry
                    {
                        // ISO 9660 or Joliet
                        var t=this.buffer.slice(i+33, i+33+flen);
                        this.entry.filename=this.conv.ConvertToUnicode(t);
                        this.entry.filename=this.entry.filename.replace(/(\.)?;1$/, "");
                        this.entry.checksum=this.buffer.charCodeAt(i+2)+(this.buffer.charCodeAt(i+3)<<8)+
                                (this.buffer.charCodeAt(i+4)<<16)+(this.buffer.charCodeAt(i+5)<<24);
                        this.entry.position=this.entry.checksum*ISO_SECTOR_SIZE;
                        this.entry.filesize=this.buffer.charCodeAt(i+10)+(this.buffer.charCodeAt(i+11)<<8)+
                                (this.buffer.charCodeAt(i+12)<<16)+(this.buffer.charCodeAt(i+13)<<24);
                        this.entry.packsize=this.entry.filesize;
                        t=new Date(this.buffer.charCodeAt(i+18)+1900, this.buffer.charCodeAt(i+19)-1,
                                   this.buffer.charCodeAt(i+20), this.buffer.charCodeAt(i+21),
                                   this.buffer.charCodeAt(i+22), this.buffer.charCodeAt(i+23));
                        this.entry.modified=t.getTime();
                        this.entry.attrib=this.buffer.charCodeAt(i+25);
                        this.entry.directory=this.buffer.charCodeAt(i+25)&0x02;

                        // Rock Ridge extension
                        for (var j=33+flen+(flen&1?0:1); j<len-1; j+=this.buffer.charCodeAt(i+j+2))
                        {
                            t=this.buffer.charCodeAt(i+j)+(this.buffer.charCodeAt(i+j+1)<<8);
                            switch(t)
                            {
                                case 0x4D4E:    // "NM" - Alternate name
                                    t=this.buffer.charCodeAt(i+j+2);
                                    t=this.buffer.slice(i+j+5, i+j+t)
                                    this.entry.filename=this.conv.ConvertToUnicode(t);
                                    break;
                                case 0x5252:    // "RR" - Rock Ridge
                                case 0x5850:    // "PX" - POSIX file attributes
                                case 0x4E50:    // "PN" - POSIX device number
                                case 0x4C53:    // "SL" - Symbolic link
                                case 0x4C43:    // "CL" - Child link
                                case 0x4C50:    // "PL" - Parent link
                                case 0x4552:    // "RE" - Relocated directory
                                case 0x4654:    // "TF" - Time stamp(s) for a file
                                case 0x4653:    // "SF" - File data in sparse file format
                                case 0x4543:    // "CE" - Continuation Area
                                case 0x4450:    // "PD" - Padding Field
                                case 0x5053:    // "SP" - System Use Sharing Protocol Indicator
                                case 0x5453:    // "ST" - System Use Sharing Protocol Terminator
                                case 0x5245:    // "ER" - Extensions Reference
                                case 0x5345:    // "ES" - Extension Selector
                                    break;
                                default:        // Unknown
                                    this.stat=5;
                                    request.cancel(NS_BINDING_ABORTED);
                                    return;
                            }
                        }

                        // add path name
                        t=Math.floor(this.offset/ISO_SECTOR_SIZE);
                        while (t>=0 && !this.pathtbl[t]) t--;
                        if (t>=0)
                            this.entry.filename=this.pathtbl[t]+"/"+this.entry.filename;
                        if (this.entry.directory)
                        {   // add directory to path table
                            this.pathtbl[this.entry.checksum-this.sect]=this.entry.filename;
                            if (this.entry.checksum>this.last-1)
                                this.last=this.entry.checksum+Math.ceil(this.entry.filesize/ISO_SECTOR_SIZE);
                        }

                        this.info.sizecount+=this.entry.filesize;
                        this.info.filecount++;
                        this.output.onDataAvailable(request, this.entry, null, this.info.filecount, 0);
                    }
                }
                this.buffer=this.buffer.slice(i);
                break;
            case 4:
            case 5:
                this.buffer="";
                request.cancel(NS_BINDING_ABORTED);
                break;
         }
    },
    init: function(output, info)
    {
        this.output=output;
        this.info=info;
        this.entry=CC[AV_ENTRY_CTID].createInstance(CI.avIArchviewEntry);
    }
};

const RAR_MARK_HEAD="\x52\x61\x72\x21\x1A\x07\x00";
const RAR_MARK_HEAD_SIZE=RAR_MARK_HEAD.length;
const RAR_MAIN_HEAD="\xCF\x90\x73\x00\x00\x0D\x00\x00\x00\x00\x00\x00\x00";
const RAR_MAIN_HEAD_SIZE=RAR_MAIN_HEAD.length;
const RAR_FILE_HEAD_SIZE=32;
const RAR_END_HEAD="\xC4\x3D\x7B\x00\x40\x07\x00";
const RAR_END_HEAD_SIZE=RAR_END_HEAD.length;
const RAR_MIN_HEAD_SIZE=7;

function ArchviewRAR()
{
    var pref=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
    this.conv=CC["@mozilla.org/intl/scriptableunicodeconverter"].
        createInstance(CI.nsIScriptableUnicodeConverter);
    try {
        this.conv.charset=pref.getCharPref(AV_PREF_CHARSET);
    } catch (ex) {
        this.conv.charset="GB2312";
    }
    this.fragsize=pref.getIntPref(AV_PREF_FRAGSIZE);
    if (this.fragsize<512) this.fragsize=MTUSIZE;
};
ArchviewRAR.prototype=
{
    headsize: 0,
    namesize: 0,
    fragsize: MTUSIZE,

    stat: 0,
    buffer: "",
    offset: 0,
    skip: 0,
    output: null,
    info: null,
    entry: null,
    conv: null,
    regex: new RegExp("\\\\", "g"),

    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIRequestObserver) &&
            !iid.equals(CI.nsIStreamListener) &&
            !iid.equals(CI.avIArchviewLister))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    onStartRequest: function(request, context)
    {
        this.buffer="";
        this.skip=0;  // start point must begin at a header
        if (this.stat==0)
            this.output.onStartRequest(request, this.info);
    },
    onStopRequest: function(request, context, status)
    {
        switch (this.stat)
        {
            case 0:    // expect the mark header
                this.info.errorcode=AV_ERROR_UNKNOWN_FORMAT;
                if (this.buffer.length<RAR_MARK_HEAD_SIZE ||
                    this.buffer.indexOf(RAR_MARK_HEAD))
                    break;
                this.buffer=this.buffer.slice(RAR_MARK_HEAD_SIZE);
                this.offset+=RAR_MARK_HEAD_SIZE;
                this.stat=1;
            case 1:    // expect the main header
                if (this.buffer.length<RAR_MAIN_HEAD_SIZE ||
                   !this.fetchMainHead(this.buffer))
                    break;
                //if (this.buffer.length<this.headsize) // fixme: rar comment is unsupported
                //    return;
                //this.info.comment=this.buffer.slice(RAR_MAIN_HEAD_SIZE, this.headsize);
                //this.info.comment=this.conv.ConvertToUnicode(this.info.comment);
                this.buffer=this.buffer.slice(this.headsize);
                this.offset+=this.headsize;
                this.stat=2;
                this.info.errorcode=AV_OK;
                if (this.buffer.length>=RAR_MIN_HEAD_SIZE)
                {
                    // consume the rest data
                    this.onDataAvailable(request, context, null, this.offset, this.buffer.length);
                    if (this.info.errorcode!=AV_OK || this.stat!=2) break;
                }
            case 2:    // read next fragment
                this.info.errorcode=AV_ERROR_NOT_RESUMABLE;
                if (status==NS_ERROR_NOT_RESUMABLE)
                    break;

                var ch=request.QueryInterface(CI.nsIChannel);
                var fch=CC[AV_CHANNEL_PREFIX+ch.URI.scheme].createInstance(CI.avIArchviewChannel);
                try { // fixme:
                    fch.init(ch, this.offset, this.fragsize);
                } catch (ex) {
                    break;
                }
                this.info.errorcode=AV_ERROR_READ_FAILED;
                fch=fch.QueryInterface(CI.nsIChannel);
                fch.loadGroup=null;
                fch.asyncOpen(this, context);
                return;
            default:
                break;
        }
        this.output.onStopRequest(request, this.info, this.info.errorcode);
    },
    onDataAvailable: function(request, context, input, offset, count)
    {
        if (input)
        {
            var bin=CC["@mozilla.org/binaryinputstream;1"].createInstance(CI.nsIBinaryInputStream);
            bin.setInputStream(input);
            this.buffer+=bin.readBytes(count);
        }
        switch(this.stat)
        {
            case 0:
            case 1:    // collect mark and main header data
                if (this.buffer.length>RAR_MARK_HEAD_SIZE+RAR_MAIN_HEAD_SIZE)
                    request.cancel(NS_BINDING_ABORTED);
                return;
            case 2:    // expect file header
                // skip unused data (compressed file data)
                if (this.skip>this.buffer.length)
                {
                    this.skip-=this.buffer.length;
                    this.buffer="";
                    return;
                }
                if (this.skip>0)
                {
                    this.buffer=this.buffer.slice(this.skip);
                    this.skip=0;
                }

                // a header is located
                var i=0;
                while (this.buffer.length>=i+RAR_MIN_HEAD_SIZE)
                {
                    var buf=this.buffer.slice(i, i+RAR_FILE_HEAD_SIZE);
                    if (this.fetchFileHead(buf))
                    {
                        // find a file header
                        if (this.buffer.length-i<this.headsize)
                            break;
                        this.entry.position=this.offset+i;
                        i+=RAR_FILE_HEAD_SIZE;
                        this.entry.filename=this.buffer.slice(i, i+this.namesize);
                        this.entry.filename=this.entry.filename.replace(this.regex, "/");
                        try {
                            this.entry.filename=this.conv.ConvertToUnicode(this.entry.filename);
                        }
                        catch(e) {
                            CU.reportError(e);
                        }
                        //this.entry.comment=this.buffer.slice(i+this.namesize, i+this.headsize); // fixme:
                        //this.entry.comment=this.conv.ConvertToUnicode(this.entry.comment);
                        this.info.filecount++;
                        this.info.sizecount+=this.entry.filesize;
                        this.output.onDataAvailable(request, this.entry, null, this.info.filecount, 0);
                        i+=this.headsize-RAR_FILE_HEAD_SIZE+this.entry.packsize;
                    }
                    else if (this.fetchSubHead(buf))
                    {
                        // find a subblock, skip it.
                        //if (this.buffer.length-i<this.headsize)
                        //    break;    // we know nothing about this head, so it needn't to get all;
                        i+=this.headsize+this.namesize;
                    }
                    else if (this.fetchEndHead(buf))
                    {
                        // find the end of archive header
                        i+=this.headsize;
                        this.stat=3;
                        this.info.errorcode=(this.buffer.length>i)?AV_ERROR_EXTRA_DATA:AV_OK;
                    }
                    else
                    {
                        // find an unknown header
                        this.stat=4;
                        this.info.errorcode=AV_ERROR_FILE_CORRUPTED;
                        request.cancel(NS_BINDING_ABORTED);
                        return;
                    }
                }
                if (i<RAR_MIN_HEAD_SIZE)
                {
                    // unknown reason, avoid dead loop
                    request.cancel(NS_BINDING_ABORTED);
                    return;
                }
                this.offset+=i;
                if (i>=this.buffer.length)
                    this.skip=i-this.buffer.length;    // need to skip some data
                this.buffer=this.buffer.slice(i);
                return;
            case 3:    // unknown extra data
                request.cancel(NS_BINDING_ABORTED);
                return;
            case 4:
                return;
        }
    },
    init: function(output, info)
    {
        this.output=output;
        this.info=info;
        this.entry=CC[AV_ENTRY_CTID].createInstance(CI.avIArchviewEntry);
    },

    fetchMainHead: function(buf)
    {
        //var crc=buf.charCodeAt(0)+(buf.charCodeAt(1)<<8);
        if (buf[2]!="s")  return false;

        var flags=buf.charCodeAt(3)+(buf.charCodeAt(4)<<8);
        this.info.solidarch=(flags&0x08)==0x08;
        this.headsize=buf.charCodeAt(5)+(buf.charCodeAt(6)<<8);
        //reserved1=buf.charCodeAt(7)+(buf.charCodeAt(8)<<8);
        //reserved2=buf.charCodeAt(9)+(buf.charCodeAt(10)<<8)+
        //    (buf.charCodeAt(11)<<16)+(buf.charCodeAt(12)<<24);
        return true;
    },
    fetchFileHead: function(buf)
    {
        //var crc=buf.charCodeAt(0)+(buf.charCodeAt(1)<<8);
        if (buf[2]!="t")  return false;

        var t;
        t=buf.charCodeAt(3)+(buf.charCodeAt(4)<<8);
        if (t&0x04)  this.entry.encrypted=true;
        this.headsize=buf.charCodeAt(5)+(buf.charCodeAt(6)<<8);
        this.entry.headsize=this.headsize+RAR_MAIN_HEAD_SIZE+
            RAR_FILE_HEAD_SIZE+RAR_END_HEAD_SIZE;
        this.entry.packsize=buf.charCodeAt(7)+(buf.charCodeAt(8)<<8)+
            (buf.charCodeAt(9)<<16)+(buf.charCodeAt(10)<<24);
        this.entry.filesize=buf.charCodeAt(11)+(buf.charCodeAt(12)<<8)+
            (buf.charCodeAt(13)<<16)+(buf.charCodeAt(14)<<24);
        this.entry.ostype=buf.charCodeAt(15);
        this.entry.checksum=buf.charCodeAt(16)+(buf.charCodeAt(17)<<8)+
            (buf.charCodeAt(18)<<16)+(buf.charCodeAt(19)<<24);
        t=buf.charCodeAt(20)+(buf.charCodeAt(21)<<8)+
            (buf.charCodeAt(22)<<16)+(buf.charCodeAt(23)<<24);
        this.entry.modified=convertDosDateTime(t);
        //extractVersion=buf.charCodeAt(24);
        this.entry.method=buf.charCodeAt(25);
        this.namesize=buf.charCodeAt(26)+(buf.charCodeAt(27)<<8);
        this.entry.attrib=buf.charCodeAt(28)+(buf.charCodeAt(29)<<8)+
            (buf.charCodeAt(30)<<16)+(buf.charCodeAt(31)<<24);
        this.entry.directory=((!this.entry.ostype||this.entry.ostype==2) && this.entry.attrib&0x10);
        return true;
    },
    fetchSubHead: function(buf)
    {
        //var crc=buf.charCodeAt(0)+(buf.charCodeAt(1)<<8);
        if (buf[2]!="z")  return false;

        //flags=buf.charCodeAt(3)+(buf.charCodeAt(4)<<8);
        this.headsize=buf.charCodeAt(5)+(buf.charCodeAt(6)<<8);
        this.namesize=buf.charCodeAt(7)+(buf.charCodeAt(8)<<8)+
            (buf.charCodeAt(9)<<16)+(buf.charCodeAt(10)<<24);
        return true;
    },
    fetchEndHead: function(buf)
    {
        //var crc=buf.charCodeAt(0)+(buf.charCodeAt(1)<<8);
        if (buf[2]!="{")  return false;

        //bitFlags=buf.charCodeAt(3)+(buf.charCodeAt(4)<<8);
        this.headsize=buf.charCodeAt(5)+(buf.charCodeAt(6)<<8);
        return true;
    }
};

const ZIP_CREC_HEAD="PK\01\02";
const ZIP_CREC_SIZE=46;
const ZIP_LREC_HEAD="PK\03\04";
const ZIP_LREC_SIZE=30;
const ZIP_ECREC_HEAD="PK\05\06";
const ZIP_ECREC_SIZE=22;

function ArchviewZIP()
{
    var pref=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
    this.conv=CC["@mozilla.org/intl/scriptableunicodeconverter"].
        createInstance(CI.nsIScriptableUnicodeConverter);
    try {
        this.conv.charset=pref.getCharPref(AV_PREF_CHARSET);
    } catch (ex) {
        this.conv.charset="GB2312";
    }
    this.fragsize=pref.getIntPref(AV_PREF_FRAGSIZE);
    if (this.fragsize<512) this.fragsize=MTUSIZE;
    this.retries=pref.getIntPref(AV_PREF+"zip.retries");
};
ArchviewZIP.prototype=
{
    offset: 0,
    namesize: 0,
    commentsize: 0,
    extrasize: 0,

    fragsize: MTUSIZE,
    retries: 3,

    stat: 0,
    count: 0,
    buffer: "",
    output: null,
    info: null,
    entry: null,
    conv: null,

    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIRequestObserver) &&
            !iid.equals(CI.nsIStreamListener) &&
            !iid.equals(CI.avIArchviewLister))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    onStartRequest: function(request, context)
    {
        this.buffer="";
        if (this.stat==1)
            this.output.onStartRequest(request, this.info);
    },
    onStopRequest: function(request, context, status)
    {
        var ch=request.QueryInterface(CI.nsIChannel);
        switch(this.stat)
        {
            case 0:
                this.offset=ch.contentLength-ZIP_ECREC_SIZE+1;
                this.buffer=MIME_OCTET;
                this.stat=1;
            case 1:    // read and expect ECREC
                this.info.filecount=0;
                if (status==NS_ERROR_NOT_RESUMABLE)
                    break;
                this.info.errorcode=AV_ERROR_UNKNOWN_FORMAT;
                if (this.buffer.length<ZIP_ECREC_SIZE)
                    break;
                var i=this.buffer.lastIndexOf(ZIP_ECREC_HEAD);
                if (i<0)
                {
                    // ECREC not found in this fragment
                    if (--this.retries<0 || this.offset<0)
                        break;
                    // try again
                    this.offset-=this.fragsize-ZIP_ECREC_SIZE+1;
                    var fch=CC[AV_CHANNEL_PREFIX+ch.URI.scheme].createInstance(CI.avIArchviewChannel);
                    fch.init(ch, this.offset>0?this.offset:0, this.fragsize);
                    fch=fch.QueryInterface(CI.nsIChannel);
                    fch.loadGroup=null;
                    fch.asyncOpen(this, context);
                    return;
                }
                if (i+ZIP_ECREC_SIZE>this.buffer.length)
                    break;

                // get information from ECREC structure
                this.buffer=this.buffer.slice(i);
                this.fetchECREC(this.buffer);
                i=ZIP_ECREC_SIZE;
                // fixme: long comment will be cut
                this.info.comment=this.buffer.slice(i, i+this.commentsize);
                this.info.comment=this.conv.ConvertToUnicode(this.info.comment);
                this.stat=2;
                this.info.errorcode=AV_ERROR_READ_FAILED;

                // read CREC data
                var fch=CC[AV_CHANNEL_PREFIX+ch.URI.scheme].createInstance(CI.avIArchviewChannel);
                fch.init(ch, this.offset, this.namesize);
                fch=fch.QueryInterface(CI.nsIChannel);
                fch.loadGroup=null;
                fch.asyncOpen(this, context);
                return;
        }
        this.output.onStopRequest(request, this.info, this.info.errorcode);
    },
    onDataAvailable: function(request, context, input, offset, count)
    {
        var bin=CC["@mozilla.org/binaryinputstream;1"].createInstance(CI.nsIBinaryInputStream);
        bin.setInputStream(input);
        this.buffer+=bin.readBytes(count);
        switch(this.stat)
        {
            case 0:    // the 1st fragment is unused since the ECREC data should be at the end of file.
                request.cancel(NS_BINDING_REDIRECTED);
                break;
            case 1:    // collect ECREC data
                break;
            case 2:    // expect CREC recorder
                var i=0;
                while (this.buffer.length>i+ZIP_CREC_SIZE)
                {
                    var buf=this.buffer.slice(i, i+ZIP_CREC_SIZE);
                    if (!this.fetchCREC(buf))
                    {
                        this.stat=4;
                        this.info.errorcode=AV_ERROR_FILE_CORRUPTED;
                        request.cancel(NS_BINDING_ABORTED);
                        return;
                    }

                    if (this.buffer.length-i<ZIP_CREC_SIZE+this.namesize+this.extrasize)
                        break; // filename in the next block
                    i+=ZIP_CREC_SIZE;

                    this.entry.filename=this.buffer.slice(i, i+this.namesize);
                    try {
                        this.entry.filename=this.conv.ConvertToUnicode(this.entry.filename);
                    }
                    catch(e) {
                        CU.reportError(e);
                    }
                    i+=this.namesize;
                    this.entry.extra=this.buffer.slice(i, i+this.extrasize);
                    i+=this.extrasize;
                    this.entry.comment=this.buffer.slice(i, i+this.commentsize);
                    this.entry.comment=this.conv.ConvertToUnicode(this.entry.comment);
                    i+=this.commentsize;
                    this.info.sizecount+=this.entry.filesize;

                    this.count++;
                    this.output.onDataAvailable(request, this.entry, null, this.count, this.info.filecount);
                    if (this.count==this.info.filecount)
                    {
                        this.stat=3;
                        if (this.buffer.length>i)
                            this.info.errorcode=AV_ERROR_EXTRA_DATA;
                        else
                            this.info.errorcode=AV_OK;
                        break;
                    }
                }
                this.buffer=this.buffer.slice(i);
                break;
            case 3:    // unknown extra data
                this.info.errorcode=AV_ERROR_EXTRA_DATA;
                request.cancel(NS_BINDING_ABORTED);
                break;
            case 4:    // file corrupted 
                break;
        }
    },
    init: function(output, info)
    {
        this.output=output;
        this.info=info;
        this.info.filecount=-1;
        this.entry=CC[AV_ENTRY_CTID].createInstance(CI.avIArchviewEntry);
    },

    fetchECREC: function(buf)
    {
        //this.diskNumber=buf.charCodeAt(4)+(buf.charCodeAt(5)<<8);
        //this.startDisk=buf.charCodeAt(6)+(buf.charCodeAt(7)<<8);
        //this.entriesDisk=buf.charCodeAt(8)+(buf.charCodeAt(9)<<8);
        this.info.filecount=buf.charCodeAt(10)+(buf.charCodeAt(11)<<8);
        this.namesize=buf.charCodeAt(12)+(buf.charCodeAt(13)<<8)+
            (buf.charCodeAt(14)<<16)+(buf.charCodeAt(15)<<24);
        this.offset=buf.charCodeAt(16)+(buf.charCodeAt(17)<<8)+
            (buf.charCodeAt(18)<<16)+(buf.charCodeAt(19)<<24);
        this.commentsize=buf.charCodeAt(20)+(buf.charCodeAt(21)<<8);
    },
    fetchCREC: function(buf)
    {
        if (buf.indexOf(ZIP_CREC_HEAD)!=0)
            return false;
        var t;
        //madeVersion=buf.charCodeAt(4);
        switch(buf.charCodeAt(5))
        {
            case 0:   t=0; break;
            case 6:   t=1; break;
            case 10:  t=2; break;
            case 3:
            case 19:  t=3; break;
            default:  t=4;
        }
        this.entry.ostype=t;
        //extractVersion0=buf.charCodeAt(6);
        //extractVersion1=buf.charCodeAt(7);
        t=buf.charCodeAt(8)+(buf.charCodeAt(9)<<8);
        if (t&1)  this.entry.encrypted=true;
        this.entry.method=buf.charCodeAt(10)+(buf.charCodeAt(11)<<8);
        t=buf.charCodeAt(12)+(buf.charCodeAt(13)<<8)+
            (buf.charCodeAt(14)<<16)+(buf.charCodeAt(15)<<24);
        this.entry.modified=convertDosDateTime(t);
        this.entry.checksum=buf.charCodeAt(16)+(buf.charCodeAt(17)<<8)+
            (buf.charCodeAt(18)<<16)+(buf.charCodeAt(19)<<24);
        this.entry.packsize=buf.charCodeAt(20)+(buf.charCodeAt(21)<<8)+
            (buf.charCodeAt(22)<<16)+(buf.charCodeAt(23)<<24);
        this.entry.filesize=buf.charCodeAt(24)+(buf.charCodeAt(25)<<8)+
            (buf.charCodeAt(26)<<16)+(buf.charCodeAt(27)<<24);
        this.namesize=buf.charCodeAt(28)+(buf.charCodeAt(29)<<8);
        this.extrasize=buf.charCodeAt(30)+(buf.charCodeAt(31)<<8);
        this.commentsize=buf.charCodeAt(32)+(buf.charCodeAt(33)<<8);
        //diskNumber=buf.charCodeAt(34)+(buf.charCodeAt(35)<<8);
        //internalAttrib=buf.charCodeAt(36)+(buf.charCodeAt(37)<<8);
        this.entry.attrib=buf.charCodeAt(38)+(buf.charCodeAt(39)<<8)+
            (buf.charCodeAt(40)<<16)+(buf.charCodeAt(41)<<24);
        this.entry.directory=(!this.entry.ostype && this.entry.attrib&0x10);
        this.entry.position=buf.charCodeAt(42)+(buf.charCodeAt(43)<<8)+
            (buf.charCodeAt(44)<<16)+(buf.charCodeAt(45)<<24);
        this.entry.headsize=ZIP_LREC_SIZE+this.namesize+this.extrasize+
            this.commentsize+8; /* 8 is for gzip decoding (CRC and size) */
        return true;
    }
};

function ArchviewISOConv()
{
};
ArchviewISOConv.prototype=
{
    listener: null,

    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIRequestObserver) &&
            !iid.equals(CI.nsIStreamListener) &&
            !iid.equals(CI.nsIStreamConverter))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    convert: function(input, fromtype, totype, context)
    {
        throw CR.NS_ERROR_NOT_IMPLEMENTED
    },
    asyncConvertData: function(fromtype, totype, listener, context)
    {
        this.listener=listener;
    },
    onStartRequest: function(request, context)
    {
        var ch=request.QueryInterface(CI.nsIChannel);
        ch.loadFlags&=~ch.LOAD_CALL_CONTENT_SNIFFERS; // not process zip in iso

        // fixup URI (to provide the filename when save to disk)
        var uri=ch.URI.spec;
        var t=uri.indexOf("#");
        if (t>0)
        {
            t=uri.indexOf("/", t);
            uri=uri.replace("#", "/");
            if (t<0) t=uri.length;
            ch.URI.spec=uri.slice(0, t);
        }

        if (t>0 && t<uri.length)
        {
            // get parameters
            t=uri.slice(t+1).split("/");

            // set content-type
            if (t[3]==undefined || !(t[3]-0))
                ch.contentType=MIME_UNKNOWN;  // by content
            else
                ch.contentType=MIME_SAVE_AV;  // always save to disk

            // set content length
            ch.contentLength=t[2]?t[2]:INT32_MAX;
            t=ch.QueryInterface(CI.nsIWritablePropertyBag2);
            t.setPropertyAsInt64("content-length", ch.contentLength);
        }

        this.listener.onStartRequest(request, context);
    },
    onStopRequest: function(request, context, status)
    {
        this.listener.onStopRequest(request, context, status);
    },
    onDataAvailable: function(request, context, input, offset, count)
    {
        this.listener.onDataAvailable(request, context, input, offset, count);
    }
};

function ArchviewRARConv()
{
};
ArchviewRARConv.prototype=
{
    stat: 0,
    headflag: 0,
    headsize: 0,
    namesize: 0,
    packsize: 0,
    offset: 0,
    data: null,
    listener: null,
    filehead: "",
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIRequestObserver) &&
            !iid.equals(CI.nsIStreamListener) &&
            !iid.equals(CI.nsIStreamConverter))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    convert: function(input, fromtype, totype, context)
    {
        throw CR.NS_ERROR_NOT_IMPLEMENTED
    },
    asyncConvertData: function(fromtype, totype, listener, context)
    {
        this.listener=listener;

        // create dummy rar header
        /*this.data=CC["@mozilla.org/io/string-input-stream;1"]. // fixme: StringInputStream is buggy?
            createInstance(CI.nsIStringInputStream);*/
        this.data=CC["@mozilla.org/storagestream;1"].
            createInstance(CI.nsIStorageStream);
        this.data.init(128, 1, null);
    },
    onStartRequest: function(request, context)
    {
        var ch=request.QueryInterface(CI.nsIChannel);
        ch.loadFlags&=~ch.LOAD_CALL_CONTENT_SNIFFERS; // not process rar in rar

        // fixup URI (to provide the filename when save to disk)
        var uri=ch.URI.spec;
        var t=uri.indexOf("#");
        if (t>0)
        {
            t=uri.indexOf("/", t);
            uri=uri.replace("#", "/");
            if (t<0) t=uri.length;
            ch.URI.spec=uri.slice(0, t)+".rar";
        }

        if (t>0 && t<uri.length)
        {
            // get parameters
            t=uri.slice(t+1).split("/");

            // set content-type
            if (t[3]==undefined || !(t[3]-0))
                ch.contentType=MIME_OCTET;    // by content
            else
                ch.contentType=MIME_SAVE_AV;  // always save to disk

            // set content length
            ch.contentLength=t[2]?t[2]:INT32_MAX;
            t=ch.QueryInterface(CI.nsIWritablePropertyBag2);
            t.setPropertyAsInt64("content-length", ch.contentLength);
        }

        // generate RAR marker header and main header
        /*var buf=RAR_MARK_HEAD+RAR_MAIN_HEAD;
        this.data.setData(buf, buf.length);
        this.listener.onDataAvailable(request, context, this.data, 0, this.data.available());
        this.offset=buf.length;*/
        var data=this.data.getOutputStream(0);
        data.write(RAR_MARK_HEAD, RAR_MARK_HEAD_SIZE);
        data.write(RAR_MAIN_HEAD, RAR_MAIN_HEAD_SIZE);
        data.close();
        data=this.data.newInputStream(0);
        this.listener.onStartRequest(request, context);
        this.listener.onDataAvailable(request, context, data, 0, data.available());
        this.offset=RAR_MARK_HEAD_SIZE+RAR_MAIN_HEAD_SIZE;
    },
    onStopRequest: function(request, context, status)
    {
        // generate rar end header
        /*this.data.setData(RAR_END_HEAD, RAR_END_HEAD_SIZE);
        this.listener.onDataAvailable(request, context, this.data, this.offset, this.data.available());*/
        var data=this.data.getOutputStream(0);
        data.write(RAR_END_HEAD, RAR_END_HEAD_SIZE);
        data.close();
        data=this.data.newInputStream(0);
        this.listener.onDataAvailable(request, context, data, this.offset, data.available());
        this.listener.onStopRequest(request, context, status);
    },
    onDataAvailable: function(request, context, input, offset, count)
    {
        var c=count;
        var bin=CC["@mozilla.org/binaryinputstream;1"].createInstance(CI.nsIBinaryInputStream);
        bin.setInputStream(input);
        switch (this.stat)
        {
            case 0:    // fetch file header
                if (RAR_FILE_HEAD_SIZE-this.filehead.length>c)
                {
                    this.filehead+=bin.readBytes(c);
                    break;
                }
                this.filehead+=bin.readBytes(RAR_FILE_HEAD_SIZE-this.filehead.length);
                this.headflag=this.filehead.charCodeAt(3)+(this.filehead.charCodeAt(4)<<8);
                this.headsize=this.filehead.charCodeAt(5)+(this.filehead.charCodeAt(6)<<8);
                this.packsize=this.filehead.charCodeAt(7)+(this.filehead.charCodeAt(8)<<8)+
                        (this.filehead.charCodeAt(9)<<16)+(this.filehead.charCodeAt(10)<<24);
                this.namesize=this.filehead.charCodeAt(26)+(this.filehead.charCodeAt(27)<<8);
                this.headsize-=RAR_FILE_HEAD_SIZE;
                c-=RAR_FILE_HEAD_SIZE;
                this.stat=1;
                if (!c) break;
            case 1:    // fetch filename and comment field
                if (this.headsize>c)
                {
                    this.filehead+=bin.readBytes(c);
                    this.headsize-=c;
                    break;
                }
                this.filehead+=bin.readBytes(this.headsize);
                this.headsize=this.filehead.length;
                // check if this file is in subdirectory
                var namesize=this.filehead.indexOf("\00", RAR_FILE_HEAD_SIZE)-RAR_FILE_HEAD_SIZE;
                if (!(this.headflag&0x0200) || namesize<1 || namesize>=this.namesize)
                    namesize=this.namesize;    // no unicode part
                var t=this.filehead.lastIndexOf("\\", RAR_FILE_HEAD_SIZE+namesize);
                if (t<RAR_FILE_HEAD_SIZE)
                    t=this.filehead.lastIndexOf("/", RAR_FILE_HEAD_SIZE+namesize);
                if (t>=RAR_FILE_HEAD_SIZE)
                {
                    // only remain the basename
                    this.filehead=this.filehead.slice(0, RAR_FILE_HEAD_SIZE)+
                                  this.filehead.slice(t+1, namesize+RAR_FILE_HEAD_SIZE)+
                                  this.filehead.slice(this.namesize+RAR_FILE_HEAD_SIZE);
                    // generate file header
                    this.headsize=this.filehead.length;
                    this.headflag&=0xFDFF;    // trim the part of unicode filename
                    this.namesize=namesize+RAR_FILE_HEAD_SIZE-t-1;
                    this.filehead=this.filehead.slice(0, 3)+
                                  String.fromCharCode(this.headflag&0xFF)+String.fromCharCode(this.headflag>>>8)+
                                  String.fromCharCode(this.headsize&0xFF)+String.fromCharCode(this.headsize>>>8)+
                                  this.filehead.slice(7, 26)+
                                  String.fromCharCode(this.namesize&0xFF)+String.fromCharCode(this.namesize>>>8)+
                                  this.filehead.slice(28);
                    // caclulate header crc
                    t=new CRC32();
                    t=t.crc32(0, this.filehead.slice(2));
                    if (t<0) t=0xffffffff-~t;
                    this.filehead=String.fromCharCode(t&0xFF)+String.fromCharCode((t>>>8)&0xFF)+
                                  this.filehead.slice(2);
                }
                // pass all data of file header to listener
                /*this.data.setData(this.filehead, this.filehead.length);
                this.listener.onDataAvailable(request, context, this.data, this.offset, this.data.available());*/
                var data=this.data.getOutputStream(0);
                data.write(this.filehead, this.headsize);
                data.close();
                data=this.data.newInputStream(0);
                this.listener.onDataAvailable(request, context, data, this.offset, data.available());
                this.offset+=this.headsize;
                c-=this.headsize;
                this.stat=2;
                if (!c) break;
            case 2:    // pass compressed data to listener
                if (this.packsize<c)  c=this.packsize;
                this.listener.onDataAvailable(request, context, input, this.offset, c);
                this.offset+=c;
                this.packsize-=c;
                if (!this.packsize) this.stat=3;
                break;
            case 3:
                request.cancel(AV_TRANSFER_COMPLETE);
                break;
        }
    }
};

const GZIP_HEAD="\x1F\x8B\x08\x00\x00\x00\x00\x00\x00\x00";
const GZIP_TAIL="\x00\x00\x00\x00\x00\x00\x00\x00";

function ArchviewZIPConv()
{
};
ArchviewZIPConv.prototype=
{
    stat: 0,
    skipsize: 0,
    packsize: 0,
    offset: 0,
    method: 0,
    data: null,
    decoder: null,
    listener: null,
    lrec: "",

    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIRequestObserver) &&
            !iid.equals(CI.nsIStreamListener) &&
            !iid.equals(CI.nsIStreamConverter))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    convert: function(input, fromtype, totype, context)
    {
        throw CR.NS_ERROR_NOT_IMPLEMENTED
    },
    asyncConvertData: function(fromtype, totype, listener, context)
    {
        this.listener=listener;

        // create stream converter (inflate)
        this.decoder=CC["@mozilla.org/streamconv;1?from=gzip&to=uncompressed"].
            createInstance(CI.nsIStreamConverter);
        this.decoder.asyncConvertData("gzip", "*/*", listener, context);

        // create dummy gzip header
        this.data=CC["@mozilla.org/io/string-input-stream;1"].
            createInstance(CI.nsIStringInputStream);
        this.data.setData(GZIP_HEAD, GZIP_HEAD.length);
        this.offset=this.data.available();
    },
    onStartRequest: function(request, context)
    {
        var ch=request.QueryInterface(CI.nsIChannel);
        ch.loadFlags&=~ch.LOAD_CALL_CONTENT_SNIFFERS; // not process zip in zip

        // fixup URI (to provide the filename when save to disk)
        var uri=ch.URI.spec;
        var t=uri.indexOf("#");
        if (t>0)
        {
            t=uri.indexOf("/", t);
            uri=uri.replace("#", "/");
            if (t<0) t=uri.length;
            ch.URI.spec=uri.slice(0, t);
        }

        if (t>0 && t<uri.length)
        {
            // get parameters
            t=uri.slice(t+1).split("/");

            // set content-type
            if (t[3]==undefined || !(t[3]-0))
                ch.contentType=MIME_UNKNOWN;  // by content
            else
                ch.contentType=MIME_SAVE_AV;  // always save to disk

            // set content length
            ch.contentLength=t[2]?t[2]:INT32_MAX;
            t=ch.QueryInterface(CI.nsIWritablePropertyBag2);
            t.setPropertyAsInt64("content-length", ch.contentLength);
        }

        // generate gzip header
        this.decoder.onStartRequest(request, context);
        this.decoder.onDataAvailable(request, context, this.data, 0, this.offset);
    },
    onStopRequest: function(request, context, status)
    {
        if (this.method==8)
        {
            // generate gzip tail
            var buf=this.lrec.slice(14, 18)+this.lrec.slice(22, 26);
            this.data.setData(buf, buf.length);
            this.decoder.onDataAvailable(request, context, this.data, this.offset, this.data.available());
        }
        this.decoder.onStopRequest(request, context, status);
    },
    onDataAvailable: function(request, context, input, offset, count)
    {
        var c=count;
        var bin=CC["@mozilla.org/binaryinputstream;1"].createInstance(CI.nsIBinaryInputStream);
        bin.setInputStream(input);
        switch (this.stat)
        {
            case 0:    // fetch LREC header
                if (ZIP_LREC_SIZE-this.lrec.length>c)
                {
                    this.lrec+=bin.readBytes(c);
                    break;
                }
                this.lrec+=bin.readBytes(ZIP_LREC_SIZE-this.lrec.length);
                this.packsize=this.lrec.charCodeAt(18)+(this.lrec.charCodeAt(19)<<8)+
                        (this.lrec.charCodeAt(20)<<16)+(this.lrec.charCodeAt(21)<<24);
                this.skipsize=this.lrec.charCodeAt(26)+(this.lrec.charCodeAt(27)<<8)+
                              this.lrec.charCodeAt(28)+(this.lrec.charCodeAt(29)<<8);
                this.method=this.lrec.charCodeAt(8)+(this.lrec.charCodeAt(9)<<8);
                if (this.method!=8)
                {   // not inflate algorithm, assume it's uncompressed
                    this.offset=0;
                    this.decoder=this.listener;
                }
                c-=ZIP_LREC_SIZE;
                this.stat=1;
                if (!c) break;
            case 1:    // skip filename and comment field
                if (this.skipsize>c)
                {
                    bin.readBytes(c);
                    this.skipsize-=c;
                    break;
                }
                bin.readBytes(this.skipsize);
                c-=this.skipsize;
                this.stat=2;
                if (!c) break;
            case 2:    // pass compressed data to stream converter
                if (this.packsize<c)  c=this.packsize;
                this.decoder.onDataAvailable(request, context, input, this.offset, c);
                this.offset+=c;
                this.packsize-=c;
                if (!this.packsize) this.stat=3;
                break;
            case 3:
                request.cancel(AV_TRANSFER_COMPLETE);
                break;
        }
    }
};

function ArchviewInfo()
{
};
ArchviewInfo.prototype=
{
    _location: "",
    _referer: "",
    _filesize: 0,
    _modified: 0,
    _comment: "",
    _solidarch: false,
    _filecount: 0,
    _sizecount: 0,
    _errorcode: 0,

    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.avIArchviewInfo))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    get location() { return this._location; },
    set location(arg) { this._location=arg; },
    get referer() { return this._referer; },
    set referer(arg) { this._referer=arg; },
    get filesize() { return this._filesize; },
    set filesize(arg) { this._filesize=arg; },
    get modified() { return this._modified; },
    set modified(arg) { this._modified=arg; },
    get comment() { return this._comment; },
    set comment(arg) { this._comment=arg; },
    get solidarch() { return this._solidarch; },
    set solidarch(arg) { this._solidarch=arg; },
    get filecount() { return this._filecount; },
    set filecount(arg) { this._filecount=arg; },
    get sizecount() { return this._sizecount; },
    set sizecount(arg) { this._sizecount=arg; },
    get errorcode() { return this._errorcode; },
    set errorcode(arg) { this._errorcode=arg; }
};

function ArchviewEntry()
{
};
ArchviewEntry.prototype=
{
    _filename: "",
    _filesize: 0,
    _modified: 0,
    _attrib: 0,
    _checksum: 0,
    _comment: "",
    _method: 0,
    _position: 0,
    _packsize: 0,
    _headsize: 0,
    _extra: "",
    _directory: false,
    _encrypted: false,
    _ostype: 0,

    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.avIArchviewEntry))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    get filename() { return this._filename; },
    set filename(arg) { this._filename=arg; },
    get filesize() { return this._filesize; },
    set filesize(arg) { this._filesize=arg; },
    get modified() { return this._modified; },
    set modified(arg) { this._modified=arg; },
    get attrib() { return this._attrib; },
    set attrib(arg) { this._attrib=arg>=0?arg:0xffffffff-~arg; },
    get checksum() { return this._checksum; },
    set checksum(arg) { this._checksum=arg>=0?arg:0xffffffff-~arg; },
    get comment() { return this._comment; },
    set comment(arg) { this._comment=arg; },
    get method() { return this._method; },
    set method(arg) { this._method=arg; },
    get position() { return this._position; },
    set position(arg) { this._position=arg; },
    get packsize() { return this._packsize; },
    set packsize(arg) { this._packsize=arg; },
    get headsize() { return this._headsize; },
    set headsize(arg) { this._headsize=arg; },
    get extra() { return this._extra; },
    set extra(arg) { this._extra=arg; },
    get directory() { return this._directory; },
    set directory(arg) { this._directory=arg; },
    get encrypted() { return this._encrypted; },
    set encrypted(arg) { this._encrypted=arg; },
    get ostype() { return this._ostype; },
    set ostype(arg) { this._ostype=arg; },
};

function ArchviewHTML()
{
};
ArchviewHTML.prototype=
{
    output: null,
    conv: null,
    uri: null,
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIRequestObserver) &&
            !iid.equals(CI.nsIStreamListener) &&
            !iid.equals(CI.avIArchviewInterface))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    onStartRequest: function(request, context)
    {
        var info=context.QueryInterface(CI.avIArchviewInfo);
        this.uri=info.location.replace(/:\/\/[^@]*@/, "://"); // trim the user:pass pair

        var charset = "UTF-8";
        if (!this.conv) try {
            var pref = CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
            charset = pref.getCharPref(AV_PREF_CHARSET);
        }
        catch(e) {
            CU.reportError(e);
        }
        var buf="<html>\n<head>\n"+
            "<title>"+this.uri+"</title>\n"+
            "<meta http-equiv='Content-Type' content='text/html; charset="+charset+"'>\n"+
            "</head>\n<body>\n<h1>"+this.uri+"</h1>\n<table cellpadding='2'>\n<tr>"+
            "<td width='400'><b>Name</b></td>"+
            "<td width='80' align='right'><b>Size</b></td>"+
            "<td width='20'>&nbsp;</td>"+
            "<td colspan='2'><b>Last Modified</b></td></tr>\n"+
            "<tr><td colspan='5'><hr></td></tr>\n";
        this.output.write(buf, buf.length);
        this.uri=info.location;
    },
    onStopRequest: function(request, context, status)
    {
        var info=context.QueryInterface(CI.avIArchviewInfo);
        var buf="<tr><td colspan='5'><hr></td></tr>\n</table>\n"+
            "<b>Total:</b> "+info.filecount.toLocaleString()+" files, "+info.sizecount.toLocaleString()+"<br><br>\n";
        if (status)
            buf+="<strong><font color='#ff0000'>"+this.getErrorMessage(status)+"</font></strong><br>\n"
        buf+="<cite>Generated by <a href='http://archview.sourceforge.net/'>ArchView</a></cite>\n</body></html>\n";
        buf=this.fixCharset(buf);
        this.output.write(buf, buf.length);
        this.output.close();
    },
    onDataAvailable: function(request, context, input, offset, count)
    {
        var entry=context.QueryInterface(CI.avIArchviewEntry);
        var t=new Date(entry.modified);

        var buf="<tr><td>"+entry.filename;
        if (!entry.directory && entry.filesize)
        {
            var link=entry.filename.lastIndexOf("/")+1;
            link=entry.filename.slice(link);
            link=this.uri+"#"+link+"/"+entry.position+"/"+(entry.packsize+entry.headsize)+"/"+entry.filesize;
            buf="<tr><td><a href='"+link+"' target='_blank'>"+entry.filename+"</a>";
        }
        buf+="</td><td align='right'>"+entry.filesize.toLocaleString()+
            "</td><td>"+
            "</td><td>"+t.toLocaleDateString()+
            "</td><td>"+t.toLocaleTimeString()+
            "</td></tr>\n";

        if (this.conv)
            buf=this.conv.ConvertFromUnicode(buf)+this.conv.Finish();
        else
            buf=this.fixCharset(buf);
        this.output.write(buf, buf.length);
    },
    fixCharset: function(s)
    {
        if (!fixCharset)
            return s;
        return s.replace(/[\x7f-\uffff]/g, function(s) {
            return "&#" + s.charCodeAt(0) + ";";
        });
    },
    init: function(output)
    {
        if (output)
        {
            this.conv=CC["@mozilla.org/intl/scriptableunicodeconverter"].
                createInstance(CI.nsIScriptableUnicodeConverter);
            this.conv.charset="UTF-8"; 
            this.output=output;
            return null;
        }

        var ios=CC[NS_IOSRV_CTID].getService(CI.nsIIOService);
        var ch=CC["@mozilla.org/network/input-stream-channel;1"].createInstance(CI.nsIInputStreamChannel);
        var pipe=CC["@mozilla.org/pipe;1"].createInstance(CI.nsIPipe);
        pipe.init(false, true, 0, 0, null);
        this.output=pipe.outputStream;
        ch.contentStream=pipe.inputStream;
        ch.setURI(ios.newURI(AV_CHROME, null, null));
        ch=ch.QueryInterface(CI.nsIChannel);
        ch.contentType=MIME_HTML;
        ch.contentLength=INT32_MAX;
        return ch;
    },
    getErrorMessage: function(code)
    {
        var msg;
        switch(code)
        {
            case AV_OK:
                msg="Done.";
                break;
            case AV_ERROR_UNKNOWN_FORMAT:
                msg="Error: Unknown format.";
                break;
            case AV_ERROR_READ_FAILED:
                msg="Error: Read failed.";
                break;
            case AV_ERROR_FILE_CORRUPTED:
                msg="Error: File corrupt.";
                break;
            case AV_ERROR_EXTRA_DATA:
                msg="Warning: Unknown extra data.";
                break;
            default:
                msg="Error: Unknown.";
        }
        return msg;
    }
};

function ArchviewXUL()
{
};
ArchviewXUL.prototype=
{
    uri: "",
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIRequestObserver) &&
            !iid.equals(CI.nsIStreamListener) &&
            !iid.equals(CI.avIArchviewInterface))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    onStartRequest: function(request, context)
    {
        var obssrv=CC[NS_OBSSRV_CTID].getService(CI.nsIObserverService);
        var info=context.QueryInterface(CI.avIArchviewInfo);
        var t="start:"+info.filecount;
        this.uri=info.location.replace(/:\/\/[^@]*@/, "://"); // trim the user:pass pair
        obssrv.notifyObservers(info, AV_TOPIC, t);
    },
    onStopRequest: function(request, context, status)
    {
        var obssrv=CC[NS_OBSSRV_CTID].getService(CI.nsIObserverService);
        var info=context.QueryInterface(CI.avIArchviewInfo);
        if (!this.uri)
            this.uri = info.location;
        var ds=NS_RDFSRV.GetDataSource("rdf:archview");
        var t="end:"+status;
        ds=ds.QueryInterface(CI.avIArchviewSource);
        ds.addArchive(this.uri, info);
        obssrv.notifyObservers(info, AV_TOPIC, t);
    },
    onDataAvailable: function(request, context, input, offset, count)
    {
        var obssrv=CC[NS_OBSSRV_CTID].getService(CI.nsIObserverService);
        var entry=context.QueryInterface(CI.avIArchviewEntry);
        var ds=NS_RDFSRV.GetDataSource("rdf:archview");
        var t="entry:"+offset+"/"+count;
        ds=ds.QueryInterface(CI.avIArchviewSource);
        ds.addEntry(this.uri, entry);
        obssrv.notifyObservers(entry, AV_TOPIC, t);
    },
    init: function(channel)
    {
        CC[AV_DATASRC_CTID].getService(CI.nsIRDFDataSource);
        var ios=CC[NS_IOSRV_CTID].getService(CI.nsIIOService);
        var ch=ios.newChannel(AV_CHROME, null, null);
        return ch;
    }
};

function ArchviewDSEnum(all)
{
    this.all=all;
};
ArchviewDSEnum.prototype=
{
    all: null,
    file: "",
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIStringEnumerator))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    hasMore: function()
    {
        while(this.all.hasMoreElements())
        {
            var t=this.all.getNext();
            t=t.QueryInterface(CI.nsIRDFResource);
            this.file=t.ValueUTF8;
            if (this.file[0]=="/") return true;
        }
        return false;
    },
    getNext: function()
    {
        if (!this.file)
            if (!this.hasMore())
                throw CR.NS_ERROR_FAILURE;
        var t=this.file;
        this.file="";
        return t;
    }
};
function ArchviewDS()
{
    this.init();
};
ArchviewDS.prototype=
{
    memds: null,

    init: function(uri)
    {
        this.memds=CC[NS_MEMDS_CTID].createInstance(CI.nsIRDFDataSource);
        NS_RDFSRV.RegisterDataSource(this, true);

        var parent=NS_RDFSRV.GetResource("../");
        var tag=NS_RDFSRV.GetLiteral("../");
        this.memds.Assert(parent, AV_KEY_BASENAME, tag, true);
        this.memds.Assert(parent, AV_KEY_FILENAME, tag, true);
        tag=NS_RDFSRV.GetLiteral("folder");
        this.memds.Assert(parent, AV_KEY_FILETYPE, tag, true);
    },
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIRDFDataSource) &&
            !iid.equals(CI.nsIRDFInMemoryDataSource) &&
            !iid.equals(CI.rdfIDataSource) &&
            !iid.equals(CI.avIArchviewSource))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    get URI()
    {
        return "http://archview.ffe/rdf/datasource";
    },
    GetSource: function(property, target, truth)
    {
        return this.memds.GetSource(property, target, truth);    
    },
    GetSources: function(property, target, truth)
    {
        return this.memds.GetSources(property, target, truth);    
    },
    GetTarget: function(source, property, truth)
    {
        return this.memds.GetTarget(source, property, truth);
    },
    GetTargets: function(source, property, truth)
    {
        return this.memds.GetTargets(source, property, truth);
    },
    Assert: function(source, property, target, truth)
    {
        return this.memds.Assert(source, property, target, truth);
    },
    Unassert: function(source, property, target)
    {
        return this.memds.Unassert(source, property, target);
    },
    Change: function(source, property, oldTarget, newTarget)
    {
        return this.memds.Change(source, property, oldTarget, newTarget);
    },
    Move: function(oldSource, newSource, property, target)
    {
        return this.memds.Move(oldSource, newSource, property, target);
    },
    HasAssertion: function(source, property, target, truth)
    {
        return this.memds.HasAssertion(source, property, target, truth);
    },
    AddObserver: function(observer)
    {
        return this.memds.AddObserver(observer);
    },
    RemoveObserver: function(observer)
    {
        return this.memds.RemoveObserver(observer);
    },
    ArcLabelsIn: function(node)
    {
        return this.memds.ArcLabelsIn(node);
    },
    ArcLabelsOut: function(source)
    {
        return this.memds.ArcLabelsOut(source);
    },
    GetAllResources: function()
    {
        return this.memds.GetAllResources();
    },
    IsCommandEnable: function(sources, command, argument)
    {
        return this.memds.IsCommandEnable(sources, command, argument);
    },
    DoCommand: function(sources, command, argument)
    {
        return this.memds.DoCommand(sources, command, argument);
    },
    GetAllCmds: function(source)
    {
        return this.memds.GetAllCmds(source);
    },
    hasArcIn: function(node, arc)
    {
        return this.memds.hasArcIn(node, arc);
    },
    hasArcOut: function(source, arc)
    {
        return this.memds.hasArcOut(source, arc);
    },
    beginUpdateBatch: function()
    {
        return this.memds.beginUpdateBatch();
    },
    endUpdateBatch: function()
    {
        return this.memds.endUpdateBatch();
    },
    EnsureFastContainment: function(source)
    {
        var ds=this.memds.QueryInterface(CI.nsIRDFInMemoryDataSource);
        return ds.EnsureFastContainment(source);
    },
    visitAllSubjects: function(visitor)
    {
        var ds=this.memds.QueryInterface(CI.rdfIDataSource);
        return ds.visitAllSubjects(visitor);
    },
    visitAllTriples: function(visitor)
    {
        var ds=this.memds.QueryInterface(CI.rdfIDataSource);
        return ds.visitAllTriples(visitor);
    },
    addArchive: function(uri, info)
    {
        try
        {
            var root=NS_RDFSRV.GetResource(uri);
        }
        catch(e)
        {
            CU.reportError(
                "[ArchView]: NS_RDFSRV.GetResource() failed, uri: "
                + uri + " (" + typeof uri + ")"
            );
            CU.reportError(e);
            return;
        }

        var tag=info.location.lastIndexOf("/")+1;
        tag=info.location.slice(tag);
        tag=NS_RDFSRV.GetLiteral(tag);
        this.memds.Assert(root, AV_KEY_BASENAME, tag, true);
        tag=NS_RDFSRV.GetLiteral(info.location);
        this.memds.Assert(root, AV_KEY_LOCATION, tag, true);
        tag=NS_RDFSRV.GetIntLiteral(info.filesize);
        this.memds.Assert(root, AV_KEY_FILESIZE, tag, true);
        tag=NS_RDFSRV.GetDateLiteral(info.modified*1000);
        this.memds.Assert(root, AV_KEY_MODIFIED, tag, true);
        tag=NS_RDFSRV.GetIntLiteral(info.solidarch?1:0);
        this.memds.Assert(root, AV_KEY_SOLIDARCH, tag, true);
        tag=NS_RDFSRV.GetIntLiteral(info.filecount);
        this.memds.Assert(root, AV_KEY_FILECOUNT, tag, true);
        tag=NS_RDFSRV.GetIntLiteral(info.sizecount);
        this.memds.Assert(root, AV_KEY_SIZECOUNT, tag, true);
        tag=NS_RDFSRV.GetIntLiteral(info.errorcode);
        this.memds.Assert(root, AV_KEY_ERRORCODE, tag, true);
        if (info.referer)
        {
            tag=NS_RDFSRV.GetLiteral(info.referer);
            this.memds.Assert(root, AV_KEY_REFERER, tag, true);
        }
        if (info.comment)
        {
            tag=NS_RDFSRV.GetLiteral(info.comment);
            this.memds.Assert(root, AV_KEY_COMMENT, tag, true);
        }

        tag=NS_RDFSRV.GetResource("../");
        this.memds.Assert(root, tag, root, true);

        tag=NS_RDFSRV.GetResource(AV_KEY_ARCHVIEW);
        tag=NS_RDFUTIL.MakeSeq(this.memds, tag);
        tag.AppendElement(root);
    },
    getArchive: function(uri)
    {
        var root=NS_RDFSRV.GetResource(uri);
        var info=CC[AV_INFO_CTID].createInstance(CI.avIArchviewInfo);

        var tag=this.memds.GetTarget(root, AV_KEY_LOCATION, true);
        if (!tag) return null;
        tag=tag.QueryInterface(CI.nsIRDFLiteral);
        info.location=tag.Value;
        tag=this.memds.GetTarget(root, AV_KEY_FILESIZE, true);
        tag=tag.QueryInterface(CI.nsIRDFInt);
        info.filesize=tag.Value;
        tag=this.memds.GetTarget(root, AV_KEY_MODIFIED, true);
        tag=tag.QueryInterface(CI.nsIRDFDate);
        info.modified=tag.Value/1000;
        tag=this.memds.GetTarget(root, AV_KEY_SOLIDARCH, true);
        tag=tag.QueryInterface(CI.nsIRDFInt);
        info.solidarch=tag.Value?true:false;
        tag=this.memds.GetTarget(root, AV_KEY_FILECOUNT, true);
        tag=tag.QueryInterface(CI.nsIRDFInt);
        info.filecount=tag.Value;
        tag=this.memds.GetTarget(root, AV_KEY_SIZECOUNT, true);
        tag=tag.QueryInterface(CI.nsIRDFInt);
        info.sizecount=tag.Value;
        tag=this.memds.GetTarget(root, AV_KEY_ERRORCODE, true);
        tag=tag.QueryInterface(CI.nsIRDFInt);
        info.errorcode=tag.Value;
        tag=this.memds.GetTarget(root, AV_KEY_REFERER, true);
        if (tag)
        {
            tag=tag.QueryInterface(CI.nsIRDFLiteral);
            info.referer=tag.Value;
        }
        tag=this.memds.GetTarget(root, AV_KEY_COMMENT, true);
        if (tag)
        {
            tag=tag.QueryInterface(CI.nsIRDFLiteral);
            info.comment=tag.Value;
        }
        return info;
    },
    hasArchive: function(uri)
    {
        var root=NS_RDFSRV.GetResource(uri);
        var tag=NS_RDFSRV.GetResource("../");
        tag=this.memds.GetTarget(root, tag, true);
        return tag?true:false;
    },
    getEnumerator: function(uri)
    {
        var root=NS_RDFSRV.GetResource(uri);
        var files=this.memds.ArcLabelsOut(root);
        return new ArchviewDSEnum(files);
    },
    removeArchive: function(uri)
    {
        var root=NS_RDFSRV.GetResource(uri);
        if (NS_RDFUTIL.IsContainer(this.memds, root))
            this.removeContainer(root);

        var files=this.memds.ArcLabelsOut(root);
        while(files.hasMoreElements())
        {
            var file=files.getNext();
            file=file.QueryInterface(CI.nsIRDFResource);
            var tag=this.memds.GetTarget(root, file, true);
            if (file.ValueUTF8[0]=="/")
                this.removeEntry(uri, file.ValueUTF8);
            else
                this.memds.Unassert(root, file, tag);
        }

        var tag=NS_RDFSRV.GetResource(AV_KEY_ARCHVIEW);
        tag=NS_RDFUTIL.MakeSeq(this.memds, tag);
        tag.RemoveElement(root, true);
    },
    addEntry: function(uri, entry)
    {
        var fp=entry.filename;
        if (fp[fp.length-1]!="/" && entry.directory)
        {
            entry.filename=entry.filename+"/";
            fp=fp+"/";
        }
        entry.filename=fp;
        if (fp[0]!="/") fp="/"+fp;

        var root=NS_RDFSRV.GetResource(uri);
        do {
        var tag=NS_RDFSRV.GetResource(fp);
        var src=this.memds.GetTarget(root, tag, true);
        if (src)
        {
            if (!entry.headsize) break;
            this.removeEntry(uri, fp);
        }
        src=NS_RDFSRV.GetAnonymousResource();
        this.memds.Assert(root, tag, src, true);

        var t=fp.lastIndexOf("/", fp.length-2)+1;
        tag=NS_RDFSRV.GetLiteral(entry.filename);
        this.memds.Assert(src, AV_KEY_FILENAME, tag, true);
        tag=NS_RDFSRV.GetLiteral(fp.slice(t));
        this.memds.Assert(src, AV_KEY_BASENAME, tag, true);
        tag=NS_RDFSRV.GetLiteral(fp.slice(1, t));
        this.memds.Assert(src, AV_KEY_DIRNAME, tag, true);
        tag=NS_RDFSRV.GetIntLiteral(entry.filesize);
        this.memds.Assert(src, AV_KEY_FILESIZE, tag, true);
        //tag=NS_RDFSRV.GetLiteral(entry.filesize.toLocaleString());
        //this.memds.Assert(src, AV_KEY_FILESIZE_, tag, true);
        tag=NS_RDFSRV.GetDateLiteral(entry.modified*1000);
        this.memds.Assert(src, AV_KEY_MODIFIED, tag, true);
        t=entry.attrib.toString(16).toUpperCase(); // fixme: just show hex
        if (t.length<8) t="00000000".slice(t.length)+t;
        tag=NS_RDFSRV.GetLiteral(t);
        this.memds.Assert(src, AV_KEY_ATTRIB, tag, true);
        t=entry.checksum.toString(16).toUpperCase();
        if (t.length<8) t="00000000".slice(t.length)+t;
        tag=NS_RDFSRV.GetLiteral(t);
        this.memds.Assert(src, AV_KEY_CHECKSUM, tag, true);
        tag=NS_RDFSRV.GetIntLiteral(entry.position);
        this.memds.Assert(src, AV_KEY_POSITION, tag, true);
        tag=NS_RDFSRV.GetIntLiteral(entry.packsize);
        this.memds.Assert(src, AV_KEY_PACKSIZE, tag, true);
        //tag=NS_RDFSRV.GetLiteral(entry.packsize.toLocaleString());
        //this.memds.Assert(src, AV_KEY_PACKSIZE_, tag, true);
        tag=NS_RDFSRV.GetIntLiteral(entry.headsize);
        this.memds.Assert(src, AV_KEY_HEADSIZE, tag, true);
        tag=NS_RDFSRV.GetIntLiteral(entry.method);
        this.memds.Assert(src, AV_KEY_METHOD, tag, true);
        t=entry.directory?"folder":"file";
        if (entry.encrypted) t+=" encrypted";
        tag=NS_RDFSRV.GetLiteral(t);
        this.memds.Assert(src, AV_KEY_FILETYPE, tag, true);
        if (entry.comment)
        {
            tag=NS_RDFSRV.GetLiteral(entry.comment);
            this.memds.Assert(src, AV_KEY_COMMENT, tag, true);
        }

        if (entry.headsize)
        {
            entry=CC[AV_ENTRY_CTID].createInstance(CI.avIArchviewEntry);
            entry.directory=true;
        }
        t=fp.lastIndexOf("/", fp.length-2)+1;
        entry.filename=fp.slice(1, t);
        fp=fp.slice(0, t);
        } while(t>1);
    },
    getEntry: function(uri, file)
    {
        var entry=CC[AV_ENTRY_CTID].createInstance(CI.avIArchviewEntry);
        var root=NS_RDFSRV.GetResource(uri);
        file=NS_RDFSRV.GetResource(file);
        file=this.memds.GetTarget(root, file, true);
        if (!file) return null;

        var tag=this.memds.GetTarget(file, AV_KEY_FILENAME, true);
        tag=tag.QueryInterface(CI.nsIRDFLiteral);
        entry.filename=tag.Value;
        tag=this.memds.GetTarget(file, AV_KEY_FILESIZE, true);
        tag=tag.QueryInterface(CI.nsIRDFInt);
        entry.filesize=tag.Value;
        tag=this.memds.GetTarget(file, AV_KEY_MODIFIED, true);
        tag=tag.QueryInterface(CI.nsIRDFDate);
        entry.modified=tag.Value/1000;
        tag=this.memds.GetTarget(file, AV_KEY_ATTRIB, true);
        tag=tag.QueryInterface(CI.nsIRDFLiteral);
        entry.attrib=parseInt(tag.Value, 16);
        tag=this.memds.GetTarget(file, AV_KEY_CHECKSUM, true);
        tag=tag.QueryInterface(CI.nsIRDFLiteral);
        entry.checksum=parseInt(tag.Value, 16);
        tag=this.memds.GetTarget(file, AV_KEY_POSITION, true);
        tag=tag.QueryInterface(CI.nsIRDFInt);
        entry.position=tag.Value;
        tag=this.memds.GetTarget(file, AV_KEY_PACKSIZE, true);
        tag=tag.QueryInterface(CI.nsIRDFInt);
        entry.packsize=tag.Value;
        tag=this.memds.GetTarget(file, AV_KEY_HEADSIZE, true);
        tag=tag.QueryInterface(CI.nsIRDFInt);
        entry.headsize=tag.Value;
        tag=this.memds.GetTarget(file, AV_KEY_METHOD, true);
        tag=tag.QueryInterface(CI.nsIRDFInt);
        entry.method=tag.Value;
        tag=this.memds.GetTarget(file, AV_KEY_FILETYPE, true);
        tag=tag.QueryInterface(CI.nsIRDFLiteral);
        entry.directory=(tag.Value.indexOf("folder")>=0);
        entry.encrypted=(tag.Value.indexOf("encrypted")>=0);
        tag=this.memds.GetTarget(file, AV_KEY_COMMENT, true);
        if (tag)
        {
            tag=tag.QueryInterface(CI.nsIRDFLiteral);
            entry.comment=tag.Value;
        }
        return entry;
    },
    removeEntry: function(uri, file)
    {
        var root=NS_RDFSRV.GetResource(uri);
        file=NS_RDFSRV.GetResource(file);
        var tag=this.memds.GetTarget(root, file, true);
        if (!tag) return;

        this.memds.Unassert(root, file, tag);
        file=tag.QueryInterface(CI.nsIRDFResource);

        var keys=this.memds.ArcLabelsOut(file);
        while(keys.hasMoreElements())
        {
            var key=keys.getNext();
            key=key.QueryInterface(CI.nsIRDFResource);
            tag=this.memds.GetTarget(file, key, true);
            this.memds.Unassert(file, key, tag);
        }
    },
    buildFolderView: function(uri, dir)
    {
        if (dir[dir.length-1]!="/")
            return;  // not a directory
        if (dir[0]!="/") dir="/"+dir;

        var root=NS_RDFSRV.GetResource(uri);
        if (NS_RDFUTIL.IsContainer(this.memds, root))
            this.removeContainer(root);

        var t;
        if (dir=="/../")
        {   // resolve parent directory
            dir="/";
            t=NS_RDFSRV.GetResource("../");
            t=this.memds.GetTarget(root, t, true);
            if (t!=root)
            {
                t=t.QueryInterface(CI.nsIRDFResource);
                t=this.memds.GetTarget(t, AV_KEY_FILENAME, true);
                t=t.QueryInterface(CI.nsIRDFLiteral);
                dir+=t.Value;
            }
        }

        var save=[];
        var files=this.memds.ArcLabelsOut(root);
        while(files.hasMoreElements())
        {
            var file=files.getNext();
            file=file.QueryInterface(CI.nsIRDFResource);
            if (file.ValueUTF8==dir || file.ValueUTF8.indexOf(dir))
                continue;
            t=file.ValueUTF8.indexOf("/", dir.length);
            if (t>=0 && t!=file.ValueUTF8.length-1)
                continue;
            file=this.memds.GetTarget(root, file, true);
            save.push(file);
        }

        if (dir!="/")
        {   // remove old parent directory link
            var parent=NS_RDFSRV.GetResource("../");
            t=this.memds.GetTarget(root, parent, true);
            this.memds.Unassert(root, parent, t);

            // append ".." to point to parent directory
            t=dir.lastIndexOf("/", dir.length-2);
            t=dir.slice(0, t+1);
            if (t!="/")
            {
                dir=NS_RDFSRV.GetResource(t);
                dir=this.memds.GetTarget(root, dir, true);
            }
            else
                dir=root;
            this.memds.Assert(root, parent, dir, true);
            t=NS_RDFUTIL.MakeSeq(this.memds, root);
            t.AppendElement(parent);
        }

        if (save.length)
        {
            root=NS_RDFUTIL.MakeSeq(this.memds, root);
            for (t=0; t<save.length; t++)
                root.AppendElement(save[t]);
        }
    },
    buildFlatView: function(uri)
    {
        var root=NS_RDFSRV.GetResource(uri);
        if (NS_RDFUTIL.IsContainer(this.memds, root))
            this.removeContainer(root);

        var t;
        var save=[];
        var files=this.memds.ArcLabelsOut(root);
        while(files.hasMoreElements())
        {
            var file=files.getNext();
            file=file.QueryInterface(CI.nsIRDFResource);
            t=file.ValueUTF8;
            if (t[0]!="/" || t[t.length-1]=="/")
                continue;
            file=this.memds.GetTarget(root, file, true);
            save.push(file);
        }

        if (save.length)
        {
            root=NS_RDFUTIL.MakeSeq(this.memds, root);
            for (t=0; t<save.length; t++)
                root.AppendElement(save[t]);
        }
    },
    buildTreeView: function(uri)
    {
        var root=NS_RDFSRV.GetResource(uri);
        if (NS_RDFUTIL.IsContainer(this.memds, root))
            this.removeContainer(root);

        var t;
        var save=[];
        var files=this.memds.ArcLabelsOut(root);
        while(files.hasMoreElements())
        {
            var file=files.getNext();
            file=file.QueryInterface(CI.nsIRDFResource);
            t=file.ValueUTF8;
            if (t[0]!="/")  continue;
            t=t.lastIndexOf("/", t.length-2);
            if (!t)
            {
                file=this.memds.GetTarget(root, file, true);
                save.push(file);
            }
            else if (t>0)
            {
                var dir=file.ValueUTF8.slice(0, t+1);
                dir=NS_RDFSRV.GetResource(dir);
                dir=this.memds.GetTarget(root, dir, true);
                dir=NS_RDFUTIL.MakeSeq(this.memds, dir);
                file=this.memds.GetTarget(root, file, true);
                dir.AppendElement(file);
            }
        }

        if (save.length)
        {
            root=NS_RDFUTIL.MakeSeq(this.memds, root);
            for (t=0; t<save.length; t++)
                root.AppendElement(save[t]);
        }
    },
    removeContainer: function(root)
    {
        var cont=CC["@mozilla.org/rdf/container;1"].createInstance(CI.nsIRDFContainer);
        cont.Init(this.memds, root);

        for (var i=cont.GetCount(); i; i--)
        {
            var node=cont.RemoveElementAt(i, false);
            if (NS_RDFUTIL.IsContainer(this.memds, node))
                this.removeContainer(node);
        }

        var tag=NS_RDFSRV.GetLiteral(cont.GetCount()+1+"");
        this.memds.Unassert(root, RDF_KEY_NEXTVAL, tag);
        tag=this.memds.GetTarget(root, RDF_KEY_INSTANCEOF, true);
        this.memds.Unassert(root, RDF_KEY_INSTANCEOF, tag);
    }
};

function ArchviewDLF()
{
    this.init();
};
ArchviewDLF.prototype=
{
    mode: MIME_XUL,
    protocol: ",",
    typeds: null,

    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIObserver) &&
            !iid.equals(CI.nsIDocumentLoaderFactory))
            throw CR.NS_ERROR_NO_INTERFACE;        
        return this;
    },
    createInstance: function(command, channel, loadgroup, type, container, extra, listener)
    {
        /* fixme: nsDSURIContentListener::DoContent will return NS_OK wathever I throw.
           So, I can't implement protocol selection.
        var scheme=","+channel.URI.scheme+",";
        if (this.protocol.indexOf(scheme)<0)
            throw CR.NS_ERROR_FAILURE;*/

        var uri=channel.URI.spec;
        var t=uri.indexOf("#");
        if (t>0 && uri.indexOf("/", t)>0)
            return this.decode(command, channel, loadgroup, container, extra, listener);
        else
            return this.list(command, channel, loadgroup, container, extra, listener);
    },
    list: function(command, channel, loadgroup, container, extra, listener)
    {
        // create interface channel
        var archview=CC[AV_INTERFACE_PREFIX+this.mode].createInstance(CI.avIArchviewInterface);
        var ch=archview.init(null);
        ch.loadFlags=ch.LOAD_DOCUMENT_URI|ch.LOAD_REPLACE|ch.LOAD_TARGETED;
        ch.loadGroup=loadgroup;

        // load interface
        var cateman=CC[NS_CATEMAN_CTID].getService(CI.nsICategoryManager);
        var factory=cateman.getCategoryEntry(NS_CONTENT_VIEWER_CATEGORY, this.mode);
        factory=CC[factory].getService(CI.nsIDocumentLoaderFactory);
        var viewer=factory.createInstance(command, ch, loadgroup, this.mode, container, extra, listener);
        ch.asyncOpen(listener.value, archview);

        // create archive info object
        var info=CC[AV_INFO_CTID].createInstance(CI.avIArchviewInfo);
        info.location=channel.URI.spec;
        info.filesize=channel.contentLength;
        //info.modified=0;
        info.filecount=0;
        info.sizecount=0;
        try {
            ch=channel.QueryInterface(CI.nsIHttpChannel);
            info.referer=ch.referrer.spec;
        }catch (ex) {};

        // read catalog and send to interface
        var lister=CC[AV_LISTER_PREFIX+channel.contentType].
            createInstance(CI.avIArchviewLister);
        archview=archview.QueryInterface(CI.nsIStreamListener);
        lister.init(archview, info);
        listener.value=lister;
        return viewer;
    },
    decode: function(command, channel, loadgroup, container, extra, listener)
    {
        channel.cancel(NS_BINDING_RETARGETED);

        // create about:blank channel
        var ios=CC[NS_IOSRV_CTID].getService(CI.nsIIOService);
        var ch=ios.newChannel("about:blank", null, null);
        ch.loadFlags=ch.LOAD_DOCUMENT_URI|ch.LOAD_REPLACE|ch.LOAD_TARGETED;
        ch.loadGroup=loadgroup;

        // load the blank document
        var cateman=CC[NS_CATEMAN_CTID].getService(CI.nsICategoryManager);
        var factory=cateman.getCategoryEntry(NS_CONTENT_VIEWER_CATEGORY, MIME_HTML);
        factory=CC[factory].getService(CI.nsIDocumentLoaderFactory);
        var viewer=factory.createInstance(command, ch, loadgroup, MIME_HTML, container, extra, listener);
/*      var viewer=factory.createBlankDocument(loadgroup); // fixme: why an error occured at this line?
        viewer=factory.createInstanceForDocument(container, viewer, command); */
        //ch.asyncOpen(listener.value, null);  // need open? this line can crash firefox */

        // get parameters
        var uri=channel.URI.spec;
        var t=uri.indexOf("/", uri.indexOf("#"));
        var args=uri.slice(t+1).split("/");
        if (!args[1]) args[1]=channel.contentLength-args[0];
        if (!args[2]) args[2]=INT32_MAX;

        // create fragment channel
        ch=CC[AV_CHANNEL_PREFIX+channel.URI.scheme].
            createInstance(CI.avIArchviewChannel);
        ch.init(channel, args[0], args[1]);

        // set content-type to use the decoder
        ch=ch.QueryInterface(CI.nsIChannel);
        ch.contentType=channel.contentType+"-archview";
        ch.loadFlags|=ch.LOAD_CALL_CONTENT_SNIFFERS|AV_LOADFLAG_ARCHVIEW;

        // this uri is to show in location bar when open in browser
        ch.originalURI=ios.newURI(uri, null, null);

        // load document
        var uriloader=CC["@mozilla.org/uriloader;1"].getService(CI.nsIURILoader);
        container=container.QueryInterface(CI.nsIInterfaceRequestor);
        uriloader.openURI(ch, true, container);
        return viewer;
    },
    createInstanceForDocument: function(container, document, command)
    {
        throw CR.NS_ERROR_NOT_IMPLEMENTED;
    },
    createBlankDocument: function(loadgroup)
    {
        throw CR.NS_ERROR_NOT_IMPLEMENTED;
    },
    registerFormat: function(format, enabled)
    {
        if (!format.indexOf(AV_PREF_FORMAT))
            format=format.slice(AV_PREF_FORMAT.length);
        var mime="application/"+format;

        if (!enabled.indexOf(AV_PREF))
        {
            var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
            if (prefsrv.getPrefType(enabled)!=prefsrv.PREF_BOOL)
                return false;
            enabled=prefsrv.getBoolPref(enabled);
        }

        var cateman=CC[NS_CATEMAN_CTID].getService(CI.nsICategoryManager);
        if (enabled)
        {
            cateman.addCategoryEntry(NS_CONTENT_SNIFFER_CATEGORY, mime, AV_SNIFFER_PREFIX+mime, false, true, null);
            cateman.addCategoryEntry(NS_CONTENT_VIEWER_CATEGORY, mime, AV_DLF_CTID, false, true, null);
        }
        else
        {
            cateman.deleteCategoryEntry(NS_CONTENT_SNIFFER_CATEGORY, mime, true);
            cateman.deleteCategoryEntry(NS_CONTENT_VIEWER_CATEGORY, mime, true);
        }
    },
    observe: function(branch, topic, suffix)
    {
        if (topic!=NS_PREFCHANGE_TOPIC) return;
        branch=branch.QueryInterface(CI.nsIPrefBranch);
        var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
        var key=branch.root+suffix;
        if (key==AV_PREF_INTERFACE)
        {
            this.mode=prefsrv.getCharPref(key);
        }
        else if (key==AV_PREF_ENABLED)
        {
            var child=prefsrv.getChildList(AV_PREF_FORMAT, {});
            for (var i=0; i<child.length; i++)
                if (prefsrv.getBoolPref(child[i]))
                    this.registerFormat(child[i], key);
        }
        else if (!key.indexOf(AV_PREF_FORMAT))
        {
            if (prefsrv.getBoolPref(AV_PREF_ENABLED))
                this.registerFormat(key, key);
        }
        else if (!key.indexOf(AV_PREF_PROTOCOL))
        {
            if (prefsrv.getPrefType(key)!=prefsrv.PREF_BOOL) return;
            var scheme=suffix.slice(AV_PREF_PROTOCOL.length)+",";
            var t=this.protocol.indexOf(","+scheme)+1;
            if (prefsrv.getBoolPref(key))
            {
                if (!t) this.protocol+=scheme;
            }
            else
            {
                if (t)
                    this.protocol=this.protocol.slice(0, t)+
                        this.protocol.slice(t+scheme.length);
            }
        }
    },
    init: function()
    {
        var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
        if ("nsIPrefBranch2" in CI) prefsrv.QueryInterface(CI.nsIPrefBranch2);

        if (prefsrv.getPrefType(AV_PREF_CHARSET)!=prefsrv.PREF_STRING ||
            !prefsrv.getCharPref(AV_PREF_CHARSET))
        {
            try {
                // set default charset
                var strbsrv=CC[NS_STRBSRV_CTID].getService(CI.nsIStringBundleService);
                //var strb=strbsrv.createBundle("chrome://global/locale/intl.properties");
                var strb=strbsrv.createBundle("chrome://global-platform/locale/intl.properties");
                var charset=strb.GetStringFromName("intl.charset.default");
                prefsrv.setCharPref(AV_PREF_CHARSET, charset);
            }
            catch(e) { // Missing in Firefox 28+
            }
        }

        this.addMimeType("zip", MIME_ZIP, "ZIP Archive", true);
        this.addMimeType("rar", MIME_RAR, "RAR Archive", true);
        this.addMimeType("iso", MIME_ISO, "ISO CD Image", true);
        this.addMimeType("av", MIME_SAVE_AV, "ArchView", false);
        this.typeds=null;  // flush

        this.observe(prefsrv, NS_PREFCHANGE_TOPIC, AV_PREF_INTERFACE);
        this.observe(prefsrv, NS_PREFCHANGE_TOPIC, AV_PREF_ENABLED);

        var child=prefsrv.getChildList(AV_PREF_PROTOCOL, {});
        for (var i=0; i<child.length; i++)
            this.observe(prefsrv, NS_PREFCHANGE_TOPIC, child[i]);

        prefsrv.addObserver(AV_PREF, this, false);
    },
    addMimeType: function(extname, type, desc, ask)
    {
        if (!this.typeds)
        {
            // get file protocol handler
            var fph=CC[NS_IOSRV_CTID].getService(CI.nsIIOService);
            fph=fph.getProtocolHandler("file");
            fph=fph.QueryInterface(CI.nsIFileProtocolHandler);

            // get mimetype datasource (mimeTypes.rdf)
            var dirsrv=CC[NS_DIRSRV_CTID].getService(CI.nsIProperties);
            var uri=dirsrv.get("UMimTyp", CI.nsIFile);
            uri=fph.getURLSpecFromFile(uri);
            this.typeds=NS_RDFSRV.GetDataSourceBlocking(uri);
        }

        // check mimetype
        var res=NS_RDFSRV.GetResource("urn:mimetypes:root");
        var root=CC["@mozilla.org/rdf/container;1"].createInstance(CI.nsIRDFContainer);
        try {
            root.Init(this.typeds, res);
        }
        catch(e) { // Fails sometimes... Only if urn:mimetypes:root not yet created?
            CU.reportError(e);
            return;
        }
        res=NS_RDFSRV.GetResource("urn:mimetype:"+type);
        if (root.IndexOf(res)>=0) return;

        // build type resource
        var prop=NS_RDFSRV.GetResource("NC:value");
        var tag=NS_RDFSRV.GetLiteral(type);
        this.typeds.Assert(res, prop, tag, true);
        prop=NS_RDFSRV.GetResource("NC:editable");
        tag=NS_RDFSRV.GetLiteral("true");
        this.typeds.Assert(res, prop, tag, true);
        prop=NS_RDFSRV.GetResource("NC:fileExtensions");
        tag=NS_RDFSRV.GetLiteral(extname);
        this.typeds.Assert(res, prop, tag, true);
        prop=NS_RDFSRV.GetResource("NC:description");
        tag=NS_RDFSRV.GetLiteral(desc);
        this.typeds.Assert(res, prop, tag, true);
        prop=NS_RDFSRV.GetResource("NC:handlerProp");
        tag=NS_RDFSRV.GetResource("urn:mimetype:handler:"+type);
        this.typeds.Assert(res, prop, tag, true);
        root.AppendElement(res);

        // build handler resource
        res=tag;
        prop=NS_RDFSRV.GetResource("NC:alwaysAsk");
        tag=NS_RDFSRV.GetLiteral(ask?"true":"false");
        this.typeds.Assert(res, prop, tag, true);
        prop=NS_RDFSRV.GetResource("NC:saveToDisk");
        tag=NS_RDFSRV.GetLiteral("true");
        this.typeds.Assert(res, prop, tag, true);
        prop=NS_RDFSRV.GetResource("NC:externalApplication");
        tag=NS_RDFSRV.GetResource("urn:mimetype:externalApplication:"+type);
        this.typeds.Assert(res, prop, tag, true);

        // build externalApplication resource
        res=tag;
        prop=NS_RDFSRV.GetResource("NC:prettyName");
        tag=NS_RDFSRV.GetLiteral("");
        this.typeds.Assert(res, prop, tag, true);
        prop=NS_RDFSRV.GetResource("NC:path");
        this.typeds.Assert(res, prop, tag, true);
    }
};

function ArchviewChannel()
{
};
ArchviewChannel.prototype=
{
    channel: null,
    propbag: null,
    listener: null,
    contentlength: 0,
    length: 0,

    // nsIPropertyBag
    get enumerator() { return this.propbag.enumerator; },
    getProperty: function(name) { return this.propbag.getProperty(name); },
    // nsIPropertyBag2
    getPropertyAsInt32: function(name) { return this.propbag.getPropertyAsInt32(name); },
    getPropertyAsUint32: function(name) { return this.propbag.getPropertyAsUint32(name); },
    getPropertyAsInt64: function(name) { return this.propbag.getPropertyAsInt64(name); },
    getPropertyAsUint64: function(name) { return this.propbag.getPropertyAsUint64(name); },
    getPropertyAsDouble: function(name) { return this.propbag.getPropertyAsDouble(name); },
    getPropertyAsAString: function(name) { return this.propbag.getPropertyAsAString(name); },
    getPropertyAsACString: function(name) { return this.propbag.getPropertyAsACString(name); },
    getPropertyAsAUTF8String: function(name) { return this.propbag.getPropertyAsAUTF8String(name); },
    getPropertyAsBool: function(name) { return this.propbag.getPropertyAsBool(name); },
    getPropertyAsInterface: function(name, iid) { return this.propbag.getPropertyAsInterface(name, iid); },
    // nsIWritablePropertyBag
    setProperty: function(name, value) { return this.propbag.setProperty(name, value); },
    deleteProperty: function(name) { return this.propbag.deleteProperty(name); },
    // nsIWritablePropertyBag2
    setPropertyAsInt32: function(name, value) { return this.propbag.setPropertyAsInt32(name, value); },
    setPropertyAsUint32: function(name, value) { return this.propbag.setPropertyAsUint32(name, value); },
    setPropertyAsInt64: function(name, value) { return this.propbag.setPropertyAsInt64(name, value); },
    setPropertyAsUint64: function(name, value) { return this.propbag.setPropertyAsUint64(name, value); },
    setPropertyAsDouble: function(name, value) { return this.propbag.setPropertyAsDouble(name, value); },
    setPropertyAsAString: function(name, value) { return this.propbag.setPropertyAsAString(name, value); },
    setPropertyAsACString: function(name, value) { return this.propbag.setPropertyAsACString(name, value); },
    setPropertyAsAUTF8String: function(name, value) { return this.propbag.setPropertyAsAUTF8String(name, value); },
    setPropertyAsBool: function(name, value) { return this.propbag.setPropertyAsBool(name, value); },
    setPropertyAsInterface: function(name, value) { return this.propbag.setPropertyAsInterface(name, value); },

    // nsIRequest
    get name()
    {
        return this.channel.name;
    },
    isPending: function()
    {
        return this.channel.isPending();
    },
    get status()
    {
        return this.channel.status==AV_TRANSFER_COMPLETE?CR.NS_OK:this.channel.status;
    },
    cancel: function(status)
    {
        this.channel.cancel(status);
    },
    suspend: function()
    {
        this.channel.suspend();
    },
    resume: function()
    {
        this.channel.resume();
    },
    get loadGroup()
    {
        return this.channel.loadGroup;
    },
    set loadGroup(group)
    {
        try { 
            if (this.channel.isPending())
                this.channel.loadGroup.removeRequest(this.channel, null, NS_BINDING_RETARGETED);
        } catch (ex) {;}
        this.channel.loadGroup=group;
    },
    get loadFlags()
    {
        return this.channel.loadFlags|AV_LOADFLAG_FRAGMENT;
    },
    set loadFlags(flags)
    {
        this.channel.loadFlags=flags&(~AV_LOADFLAG_FRAGMENT);
    },

    // nsIChannel
    get originalURI()
    {
        return this.channel.originalURI;
    },
    set originalURI(uri)
    {
        this.channel.originalURI=uri;
    },
    get URI()
    {
        return this.channel.URI;
    },
    get owner()
    {
        return this.channel.owner;
    },
    set owner(owner)
    {
        this.channel.owner=owner;
    },
    get notificationCallbacks()
    {
        return this.channel.notificationCallbacks;
    },
    set notificationCallbacks(callback)
    {
        this.channel.notificationCallbacks=callback;
    },
    get securityInfo()
    {
        return this.channel.securityInfo;
    },
    get contentType()
    {
        return this.channel.contentType;
    },
    set contentType(type)
    {
        this.channel.contentType=type;
    },
    get contentCharset()
    {
        return this.channel.contentCharset;
    },
    set contentCharset(charset)
    {
        this.channel.contentCharset=charset;
    },
    get contentLength()
    {
        return this.contentlength?this.contentlength:this.channel.contentLength;
    },
    set contentLength(length)
    {
        try {
            this.channel.contentLength=length;
        } catch (ex) {
            this.contentlength=length;
        }
    },
    open: function()
    {
        return this.channel.open();
    },
    asyncOpen: function(listener, context)
    {
        this.listener=listener;
        this.channel.asyncOpen(this, context);
    },

    // nsIStreamListener
    onStartRequest: function(request, context)
    {
        this.listener.onStartRequest(this, context);
    },
    onStopRequest: function(request, context, status)
    {
        if (status==AV_TRANSFER_COMPLETE)
            status=CR.NS_OK;
        this.listener.onStopRequest(this, context, status);
    },
    onDataAvailable: function(request, context, input, offset, count)
    {
        var t=this.length<count?this.length:count;
        this.listener.onDataAvailable(this, context, input, offset, t);
        this.length-=t;
        if (!this.length)
        {
            var bin=CC["@mozilla.org/binaryinputstream;1"].createInstance(CI.nsIBinaryInputStream);
            bin.setInputStream(input);
            bin.readBytes(count-t);
            request.cancel(AV_TRANSFER_COMPLETE);
        }
    },

    // nsISupports
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIPropertyBag) &&
            !iid.equals(CI.nsIPropertyBag2) &&
            !iid.equals(CI.nsIWritablePropertyBag) &&
            !iid.equals(CI.nsIWritablePropertyBag2) &&
            !iid.equals(CI.nsIChannel) &&
            !iid.equals(CI.nsIInterfaceRequestor) &&
            !iid.equals(CI.avIArchviewChannel))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },

    // nsIInterfaceRequestor
    getInterface: function(iid)
    {
        try {
            return this.channel.QueryInterface(iid);
        }
        catch (ex) {
            var ch=this.channel.QueryInterface(CI.nsIInterfaceRequestor);
            return ch.getInterface(iid);
        }
    },

    // avIArchviewChannel
    init: function(channel, offset, length)
    {
        var ios=CC[NS_IOSRV_CTID].getService(CI.nsIIOService);
        this.channel=ios.newChannel(channel.URI.spec, null, null);
        this.length=length;
        try {
            this.propbag=this.channel.QueryInterface(CI.nsIWritablePropertyBag);
        } catch (ex) {
            this.propbag=CC["@mozilla.org/hash-property-bag;1"].
                createInstance(CI.nsIWritablePropertyBag);
        }

        // duplicate all properties in property bag
        var allprops=channel.QueryInterface(CI.nsIPropertyBag);
        allprops=allprops.enumerator;
        while (allprops.hasMoreElements())
        {
            var prop=allprops.getNext();
            prop=prop.QueryInterface(CI.nsIProperty);
            this.propbag.setProperty(prop.name, prop.value);
        }
        this.propbag=this.propbag.QueryInterface(CI.nsIWritablePropertyBag2);

        // duplicate channel properties
        this.channel.originalURI=channel.originalURI;
        this.channel.owner=channel.owner;
        this.channel.loadGroup=channel.loadGroup;
        this.channel.loadFlags=channel.loadFlags|channel.LOAD_BYPASS_CACHE|channel.INHIBIT_CACHING;
        this.channel.notificationCallbacks=channel.notificationCallbacks;
        //this.channel.securityInfo=channel.securityInfo;
        this.channel.contentType=channel.contentType;
        this.channel.contentCharset=channel.contentCharset;

        // duplicate http channel properties
        var ch;
        try {
            this.channel=this.channel.QueryInterface(CI.nsIHttpChannel);
            if (channel.loadFlags&AV_LOADFLAG_FRAGMENT)
            {
                ch=channel.QueryInterface(CI.nsIInterfaceRequestor);
                ch=channel.getInterface(CI.nsIHttpChannel);
            }
            else
                ch=channel.QueryInterface(CI.nsIHttpChannel);
            this.channel.referrer=ch.referrer;
            this.channel.redirectionLimit=ch.redirectionLimit;
            this.channel.allowPipelining=ch.allowPipelining;
            //this.channel.requestMethod=ch.requestMethod; // POST method need to setup inputStream
            //this.contentlength=ch.contentLength;
        } catch (ex) {
            //this.channel.contentLength=channel.contentLength;
        }

        // deal with file channel
        try {
            this.channel=this.channel.QueryInterface(CI.nsIFileChannel);

            // create file input stream
            var fins=CC["@mozilla.org/network/file-input-stream;1"].
                createInstance(CI.nsIFileInputStream);
            fins.init(this.channel.file, 1, 0, 0);
            fins=fins.QueryInterface(CI.nsISeekableStream);
            fins.seek(fins.NS_SEEK_SET, offset);

            // create URI (this will allow "launch with" function)
            var uri=CC["@mozilla.org/network/standard-url;1"].createInstance(CI.nsIURI);
            uri.spec=channel.URI.spec;

            // create input stream channel
            this.channel=CC["@mozilla.org/network/input-stream-channel;1"].
                createInstance(CI.nsIInputStreamChannel);
            this.channel.setURI(uri);
            this.channel.contentStream=fins;
            this.channel=this.channel.QueryInterface(CI.nsIChannel);
            this.channel.contentLength=length;
            this.propbag.setPropertyAsInt64("content-length", length);
        } catch (ex) {
            // set start position for resume (http and ftp)
            this.channel=this.channel.QueryInterface(CI.nsIResumableChannel);
            if (channel.loadFlags&AV_LOADFLAG_FRAGMENT)
            {
                ch=channel.QueryInterface(CI.nsIInterfaceRequestor);
                ch=channel.getInterface(CI.nsIResumableChannel);
            }
            else
                ch=channel.QueryInterface(CI.nsIResumableChannel);
            this.channel.resumeAt(offset, ch.entityID);
        }
    }
};



/***********************************
*
* Factory
*
***********************************/
var archviewISOFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory) &&
            !iid.equals(CI.nsIContentSniffer) &&
            !iid.equals(CI.nsIContentSniffer_MOZILLA_1_8_BRANCH))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        if (iid.equals(CI.nsIContentSniffer) ||
            iid.equals(CI.nsIContentSniffer_MOZILLA_1_8_BRANCH))
            return this;
        var comp = new ArchviewISO();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    },
    getMIMETypeFromContent: function(request, data, length)
    {
        var ch=request.QueryInterface(CI.nsIChannel);
        if (!(ch.loadFlags&ch.LOAD_CALL_CONTENT_SNIFFERS))
            return null;

        // determined by extension name
        var path=ch.URI.path.toLowerCase();
        var t=path.lastIndexOf("#");
        if (t>0)  path=path.slice(0, t);
        t=path.lastIndexOf(".iso");
        if (t<0 || t+4<path.length)
            return null;

        try {
            ch=request.QueryInterface(CI.nsIHttpChannel);
            ch.setResponseHeader("content-disposition", "", false);
        } catch (ex) {};

        return (ch.loadFlags&AV_LOADFLAG_ARCHVIEW)?MIME_ISO_AV:MIME_ISO;
    }
};

var archviewRARFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory) &&
            !iid.equals(CI.nsIContentSniffer) &&
            !iid.equals(CI.nsIContentSniffer_MOZILLA_1_8_BRANCH))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        if (iid.equals(CI.nsIContentSniffer) ||
            iid.equals(CI.nsIContentSniffer_MOZILLA_1_8_BRANCH))
            return this;
        var comp = new ArchviewRAR();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    },
    getMIMETypeFromContent: function(request, data, length)
    {
        var ch=request.QueryInterface(CI.nsIChannel);
        if (length<RAR_MARK_HEAD_SIZE ||
            !(ch.loadFlags&ch.LOAD_CALL_CONTENT_SNIFFERS))
            return null;

        if (ch.loadFlags&AV_LOADFLAG_ARCHVIEW)
        {
            if (data[2]!=0x74)
                return null;
        }
        else
        {
            for (var i=0; i<RAR_MARK_HEAD_SIZE; i++)
                if (data[i]!=RAR_MARK_HEAD.charCodeAt(i))
                    return null;
        }

        try {
            ch=request.QueryInterface(CI.nsIHttpChannel);
            ch.setResponseHeader("content-disposition", "", false);
        } catch (ex) {};

        return (ch.loadFlags&AV_LOADFLAG_ARCHVIEW)?MIME_RAR_AV:MIME_RAR;
    }
};

var archviewZIPFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory) &&
            !iid.equals(CI.nsIContentSniffer) &&
            !iid.equals(CI.nsIContentSniffer_MOZILLA_1_8_BRANCH))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        if (iid.equals(CI.nsIContentSniffer) ||
            iid.equals(CI.nsIContentSniffer_MOZILLA_1_8_BRANCH))
            return this;
        var comp = new ArchviewZIP();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    },
    getMIMETypeFromContent: function(request, data, length)
    {
        var ch=request.QueryInterface(CI.nsIChannel);
        if (length<ZIP_LREC_HEAD.length ||
            !(ch.loadFlags&ch.LOAD_CALL_CONTENT_SNIFFERS))
            return null;

        var prefsrv=CC[NS_PREFSRV_CTID].getService(CI.nsIPrefBranch);
        if (prefsrv.getPrefType(AV_PREF_EXCLUDE)==prefsrv.PREF_STRING)
        {
            var path=ch.URI.path.toLowerCase();
            var ex=prefsrv.getCharPref(AV_PREF_EXCLUDE);
            ex=ex.toLowerCase().split(";");
            for (var i=0; i<ex.length; i++)
            {
                if (ex[i].length>0 &&
                    path.lastIndexOf(ex[i])+ex[i].length==path.length)
                    return null;
            }
        }

        for (var i=0; i<ZIP_LREC_HEAD.length; i++)
            if (data[i]!=ZIP_LREC_HEAD.charCodeAt(i))
                return null;

        try {
            ch=request.QueryInterface(CI.nsIHttpChannel);
            ch.setResponseHeader("content-disposition", "", false);
        } catch (ex) {};

        return (ch.loadFlags&AV_LOADFLAG_ARCHVIEW)?MIME_ZIP_AV:MIME_ZIP;
    }
};

var archviewISOConvFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        var comp = new ArchviewISOConv();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    }
};

var archviewRARConvFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        var comp = new ArchviewRARConv();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    }
};

var archviewZIPConvFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        var comp = new ArchviewZIPConv();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    }
};

var archviewInfoFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        var comp = new ArchviewInfo();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    }
};

var archviewEntryFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        var comp = new ArchviewEntry();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    }
};

var archviewHTMLFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        var comp = new ArchviewHTML();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    }
};

var archviewXULFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        var comp = new ArchviewXUL();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    }
};

var archviewDSFactory=
{
    singleton: null,
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        if (this.singleton == null)
            this.singleton = new ArchviewDS();
        return this.singleton.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    }
};

var archviewDLFFactory=
{
    singleton: null,
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        if (this.singleton == null)
            this.singleton = new ArchviewDLF();
        return this.singleton.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    }
};

var archviewChannelFactory=
{
    QueryInterface: function(iid)
    {
        if (!iid.equals(CI.nsISupports) &&
            !iid.equals(CI.nsIFactory))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    createInstance: function(outer, iid)
    {
        if (outer != null)
            throw CR.NS_ERROR_NO_AGGREGATION;
        var comp = new ArchviewChannel();
        return comp.QueryInterface(iid);
    },
    lockFactory: function(lock)
    {
        return;
    }
};

/***********************************
*
* Module
*
***********************************/
var archviewModule=
{
    QueryInterface: function(aIID)
    {
        if (!aIID.equals(CI.nsISupports) &&
            !aIID.equals(CI.nsIModule))
            throw CR.NS_ERROR_NO_INTERFACE;
        return this;
    },
    getClassObject: function(aCompMgr, aCID, aIID)
    {
        var factory;
        if (aCID.equals(AV_ISOSNIFF_CID))
            factory=archviewISOFactory;
        else if (aCID.equals(AV_ISO_CID))
            factory=archviewISOFactory;
        else if (aCID.equals(AV_ISOCONV_CID))
            factory=archviewISOConvFactory;
        else if (aCID.equals(AV_RARSNIFF_CID))
            factory=archviewRARFactory;
        else if (aCID.equals(AV_RAR_CID))
            factory=archviewRARFactory;
        else if (aCID.equals(AV_RARCONV_CID))
            factory=archviewRARConvFactory;
        else if (aCID.equals(AV_ZIPCONV_CID))
            factory=archviewZIPConvFactory;
        else if (aCID.equals(AV_ZIPSNIFF_CID))
            factory=archviewZIPFactory;
        else if (aCID.equals(AV_ZIP_CID))
            factory=archviewZIPFactory;
        else if (aCID.equals(AV_INFO_CID))
            factory=archviewInfoFactory;
        else if (aCID.equals(AV_ENTRY_CID))
            factory=archviewEntryFactory;
        else if (aCID.equals(AV_HTML_CID))
            factory=archviewHTMLFactory;
        else if (aCID.equals(AV_XUL_CID))
            factory=archviewXULFactory;
        else if (aCID.equals(AV_DATASRC_CID))
            factory=archviewDSFactory;
        else if (aCID.equals(AV_DLF_CID))
            factory=archviewDLFFactory;
        else if (aCID.equals(AV_CHANNEL_CID))
            factory=archviewChannelFactory;
        else
            throw CR.NS_ERROR_FACTORY_NOT_REGISTERED;
        if (aIID)
            return factory.QueryInterface(aIID);
        return factory;
    },
    registerSelf: function(aCompMgr, aFileSpec, aLocation, aType)
    {
        aCompMgr = aCompMgr.QueryInterface(CI.nsIComponentRegistrar);
        aCompMgr.registerFactoryLocation(AV_ISOCONV_CID, AV_ISOCONV_NAME, AV_ISOCONV_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_ISOSNIFF_CID, AV_ISOSNIFF_NAME, AV_ISOSNIFF_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_ISO_CID, AV_ISO_NAME, AV_ISO_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_RARCONV_CID, AV_RARCONV_NAME, AV_RARCONV_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_RARSNIFF_CID, AV_RARSNIFF_NAME, AV_RARSNIFF_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_RAR_CID, AV_RAR_NAME, AV_RAR_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_ZIPCONV_CID, AV_ZIPCONV_NAME, AV_ZIPCONV_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_ZIPSNIFF_CID, AV_ZIPSNIFF_NAME, AV_ZIPSNIFF_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_ZIP_CID, AV_ZIP_NAME, AV_ZIP_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_INFO_CID, AV_INFO_NAME, AV_INFO_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_ENTRY_CID, AV_ENTRY_NAME, AV_ENTRY_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_HTML_CID, AV_HTML_NAME, AV_HTML_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_XUL_CID, AV_XUL_NAME, AV_XUL_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_DATASRC_CID, AV_DATASRC_NAME, AV_DATASRC_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_DLF_CID, AV_DLF_NAME, AV_DLF_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_CHANNEL_CID, AV_HTTP_NAME, AV_HTTP_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_CHANNEL_CID, AV_HTTPS_NAME, AV_HTTPS_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_CHANNEL_CID, AV_FTP_NAME, AV_FTP_CTID, aFileSpec, aLocation, aType);
        aCompMgr.registerFactoryLocation(AV_CHANNEL_CID, AV_FILE_NAME, AV_FILE_CTID, aFileSpec, aLocation, aType);
    },
    unregisterSelf: function(aCompMgr, aLocation, aType)
    {
        aCompMgr = aCompMgr.QueryInterface(CI.nsIComponentRegistrar);
        aCompMgr.unregisterFactoryLocation(AV_ISOCONV_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_ISOSNIFF_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_ISO_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_RARCONV_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_RARSNIFF_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_RAR_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_ZIPCONV_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_ZIPSNIFF_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_ZIP_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_INFO_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_ENTRY_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_HTML_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_XUL_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_DATASRC_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_DLF_CID, aLocation);
        aCompMgr.unregisterFactoryLocation(AV_CHANNEL_CID, aLocation);
    },
    canUnload: function(aCompMgr)
    {
        return true;
    }
};

//module initialization
function NSGetModule(aCompMgr, aFileSpec)
{
    return archviewModule;
}

// Gecko 2.0+
function NSGetFactory(aCID)
{
    return archviewModule.getClassObject(null, aCID, null);
}