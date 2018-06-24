var allWidget = new Eform.AllWidget();
allWidget.designReadyBefore();

var editor = null;
var editortab = null;


var lngUndo = -1
var lngRedo = -1
var oUndo = SetDom("<root></root>")
var oRedo = SetDom("<root></root>")

//---------------------
var pdjFilePath = ""; //文件表单时,表单文件所在的路径相对于djfile目录的相对路径及文件名
var curdjid = 0 //当前打开的表单的ID，=0表示为新建的表单
var pstrUserFunction = "" //保存当前表单的自定义函数的内容
var pstrAddHtml = "" //保存当前表单的附加页面元素的内容
var pstrSplitAddHtml = "<p id=splitaddhtml />";
var blnChange = false //改动标志,为真表示改动了要提示保存
var curSelElement = null //
var strXml;
var strID;
var arrtmp1 = new Array();

//控件名称数组
//var ArrName=getControlNameArr()
var ArrName = new Array();
ArrName[0] = "SKButton";
ArrName[1] = "SKDBedit";
ArrName[2] = "checkbox";
ArrName[3] = "label";
ArrName[4] = "radio";
ArrName[5] = "listbox"
ArrName[6] = "textarea"
ArrName[7] = "combobox"
ArrName[8] = "password";
ArrName[9] = "upload";
ArrName[10] = "SKDBtext";
ArrName[11] = "chart";
ArrName[12] = "dbimg";
ArrName[13] = "img";
ArrName[14] = "SKBILLgrid";
ArrName[15] = "shape";
ArrName[16] = "tab";
ArrName[17] = "div";
ArrName[18] = "DsMain_field";  // SKDBTreeView改为DsMain_field,用来记录最大号
ArrName[19] = "a";
ArrName[20] = "button";
ArrName[21] = "text"
ArrName[22] = "hr";
ArrName[23] = "checkboxlist"
ArrName[24] = "radiolist"
ArrName[25] = "dropdownlist"
ArrName[26] = "grid"
ArrName[27] = "dataset"
ArrName[28] = "spin"
ArrName[29] = "excel"
ArrName[30] = "tree"
ArrName[31] = "ebshow"; //显示e表控件
ArrName[32] = "ebiao"; //E表控件
ArrName[33] = "layout"; //布局控件
ArrName[34] = "page"; //page控件
ArrName[35] = "eblayout"; //布局模版控件

//ArrName[28]="ep_borderstyle"

var oContXml = SetDom("<root></root>"); //保存每个控件ID

var ArrNum = new Array(); //保存每种控件的最大号
//var ArrCom = new Array(new Array()) ; //保存每个控件ID
InitControlNo()
allWidget.designReadyAfter();
/**
初始化控件数组
**/
function InitControlNo() {
    for (var Num = 0; Num < ArrName.length; Num++) {
        ArrNum[ArrName[Num]] = 0;
        //ArrCom[ArrName[Num]] = new Array() ;
    }

}
/**
*窗体装入事件代码
**/
function window_onload() {
    allWidget.designLoadBefore();
    fcpubdata.area = $id("SKbillsheet");

    editor = new HTMLArea();
    editor._doc = document;
    editortab = new TableOperations();



    //setLinkSrc( "luna" )
    //  fcpubdata.area.unselectable = "on";
    fcpubdata.area.contentEditable = true
    //    fcpubdata.area.designMode="On"
    //fcpubdata.area.ATOMICSELECTION=true
    document.execCommand("2D-Position", true, true);
    document.execCommand("MultipleSelection", true, true);
    try {
        fcpubdata.area.focus();
    } catch (e) { }
    //为了支持一进入设计界面时就以设计模式打开某张表单
    if (isSpace(parent.topdjsn) == false) {
        if (parent.Request.QueryString("isfile").toString() == "yes") { //设计打开文件表单
            var spathback = ''; // ../../fceform/djfile
            var spathtype = 'fceform/dj/';
            var tmp = parent.Request.QueryString("djtype").toString();
            if (IsSpace(tmp) == false) spathtype = BillTypeNameToPath(tmp).path;
            var sRet = "/" + spathtype + parent.topdjsn + ".dj";
            pdjFilePath = sRet;
            var shtm = readdesignhtml("<file>" + spathback + sRet + "</file>");
            DesignDjOpenSub(shtm, 0);
        } else {
            var sql = "select djid from FC_BILLZL where djsn='" + parent.topdjsn + "'";
            var sdjid = SqlToField(sql);
            //CopyToPub(sdjid)
            DesignDjOpen(sdjid);
        }
        //为了快速重新保存一下多个表单
        if (parent.Request.QueryString("resave").toString() == "yes") {
            fcpubdata.area.contxml = "";
            oContXml = null;
            DesignDjSave("不提示", "是");
        }
    } else if (parent.Request.QueryString("ebuse").toString() == "yes") { //e表用

        e_opendj();

    } else {
        //yes/no 用来决定是否是加控件时自动加字段
        fcpubdata.autoAddField = parent.Request.QueryString("autoaddfield").toString();
        AutoAddDsMain();
        //var startpage = "" ;
        //startpage = parent.Request.QueryString("startpage").toString();
        //if(startpage != "no" ){
        //起始页
        //	DjOpen("fcs_origPage",parent,"展现","有模式窗口","直接","起始页");
        //}		
        fcpubdata.recentFile = LoadPubData("recentFile");
        ef_RefreshRecentFile();

    }


    window_onresize();
    if (parent.menu.pubPositionChange == "是") {
        fcpubdata.position = "static";
    } else {
        fcpubdata.position = "absolute";
    }
    allWidget.designLoadAfter();
}
function window_onclick() {
    var obj = event.srcElement;
    var sid = event.srcElement.id;
    if (sid == "mainbody" || sid == "bigmain" || sid == "middlediv" || sid == "SKbillsheet") {
        curSelElement = null;
    } else if (obj.tagName == "TD") {
        try {
            var oP = obj.parentNode.parentNode.parentNode.parentNode;
            if (oP.controltype == "tab") {
                curSelElement = null;
                return;
            }
        } catch (e) { };
        curSelElement = event.srcElement;
    }


}
function resize() {
    ActMoveResize()
}

function move() {
    ActMoveResize();
    //下面判断当控件移动E表控件中时应变为static
    /*var o=event.srcElement;
    if(o == null)return;
    if(o.style.position != "absolute") return;

    var oTd = document.elementFromPoint(event.x, event.y);
    if(oTd == null) return;
    if(oTd.tagName == "TD"){
    var oCont = oTd.parentNode.parentNode.parentNode.parentNode;
    if(oCont.controltype == "ebiao"){
    o.style.position = "static";
    o.style.width = "100%";
    o.style.height = "100%";
    }
    }*/
}
/**
处理在页签控件上移动和调整控件时不能移到页签控件的外面
**/
function ActMoveResize() {

    var o = event.srcElement;
    if (o == null) return;
    var oP = o.parentNode
    if (oP.tagName == "DIV" && oP.id == "fcpagesub") {

        var opwidth = oP.parentNode.style.posWidth
        if (typeof opwidth == "undefined") opwidth = oP.offsetWidth
        var opheight = oP.style.posHeight
        if (typeof opheight == "undefined") opheight = oP.offsetHeight

        if (o.offsetWidth > opwidth) {
            o.style.width = opwidth
        }
        if (o.offsetHeight > opheight) {
            o.style.height = opheight
        }
        if (o.offsetTop > opheight - o.offsetHeight) {
            //window.status="up:"+o.offsetTop
            // event.returnValue=false
            o.style.top = opheight - o.offsetHeight  //oP.offsetHeight-5

        }
        if (o.offsetLeft > opwidth - o.offsetWidth) {
            o.style.left = opwidth - o.offsetWidth //oP.offsetWidth-5

        }
        if (o.offsetTop < 0) {
            o.style.top = 0
        }
        if (o.offsetLeft < 0) {
            o.style.left = 0
        }
    }
    //blnChange=true

}
/**
*当控件选择时给当前控件的全局变量
**/

function controlselect() {
    if (event.srcElement.id == "fcpagesubtable") {
        event.returnValue = false;
        return;
    }
    curSelElement = event.srcElement;
}
function controlselectcancel() {
    event.returnValue = false
}
/**
打开表单时调用
**/
function pageonload() {
    var oNode = oContXml.documentElement.selectSingleNode("tab");
    if (oNode != null) {
        var l = oNode.childNodes.length;
        for (var i = 0; i < l; i++) {
            var obj = eval(oNode.childNodes(i).text)

            //隐藏其它页的select控件
            var oPP = obj;
            var ll = oPP.childNodes.length;
            for (var ii = 2; ii < ll; ii++) {
                HideListBox(oPP.childNodes(ii), "是")
            }
            //try{
            HideListBox(oPP.childNodes(1), "否")
            //}catch(E){}
        }
    }
}
function CancelEvent() {
    if (event.srcElement.id == "fcpagesub" || event.srcElement.id == "fcpagesubtable")
        event.returnValue = false;
}
function page_onresize() {

    //调整子页的大小和页面控件同步
    var obj = event.srcElement
    var l = obj.childNodes.length
    var iWidth = obj.style.posWidth - 2
    var iHeight = obj.style.posHeight - 20
    if (iHeight < 0) {
        iHeight = 0;
        obj.style.height = 20;
    }
    for (var i = 1; i < l; i++) {
        obj.childNodes(i).style.posWidth = iWidth
        obj.childNodes(i).style.posHeight = iHeight
    }
}
function pageonclick() {
    //alert("dddd")
    var obj = event.srcElement
    //alert(obj.tagName)
    if (obj.tagName == "FONT") obj = obj.parentNode
    if (obj.tagName == "TD") {
        var index = obj.cellIndex
        var oTr = obj.parentNode
        var oP = oTr.parentNode.parentNode //table
        var oPP = oP.parentNode  //整个页签控件
        var l = oPP.childNodes.length;
        for (var i = 1; i < l; i++) {
            oPP.childNodes(i).style.zIndex = 0
            //oPP.childNodes(i).style.display="none"

            oTr.cells(i - 1).style.color = "black"
            HideListBox(oPP.childNodes(i), "是")
        }
        oPP.childNodes(index + 1).style.zIndex = 1
        //oPP.childNodes(index+1).style.display="block"
        oTr.cells(index).style.color = "red"
        HideListBox(oPP.childNodes(index + 1), "否")
    }
    /*
    if(obj.tagName=="A"){
    var oP=obj.parentNode.parentNode
    }else{
    var oP=obj.parentNode
    }
    var oPP=oP.parentNode  //整个页签控件
    var l=oPP.childNodes.length;
    for(var i=1;i<l;i++){
    oPP.childNodes(i).style.zIndex=0
    }
    oPP.childNodes(index).style.zIndex=1

	var oControlRange = document.body.createControlRange()  ;
    oControlRange.add(oPP.childNodes(index)) ;
    oControlRange.select() ;
    */

}
/**
* 换页时隐藏select控件
**/
function HideListBox(oPage, sTag) {
    var sTag1
    var oList = oPage.all.tags("select")

    var l = oList.length
    if (sTag == "是") {
        for (var i = 0; i < l; i++) {
            if (oList(i).style.posWidth > 0) {
                oList(i).backwidth = oList(i).style.posWidth
                oList(i).backheight = oList(i).style.posHeight
                oList(i).style.posWidth = 0
                oList(i).style.posHeight = 0
            }
        }
    } else {
        for (var i = 0; i < l; i++) {
            if (isSpace(oList(i).backwidth) == false) {
                oList(i).style.width = oList(i).backwidth
                oList(i).style.height = oList(i).backheight
            }
        }

    }

}



/**
点击焦点次序时把界面上的所有的控件ID拼成XML串
@date 2004-07-13
@return 返回XML串"<root><taborder>SKButton1</taborder><taborder>SKButton2</taborder><root>"
**/
function TaborderXml() {
    var l
    var l1
    var arrC = new Array()
    //下列控件有焦点
    arrC[0] = ArrName[0]
    arrC[1] = ArrName[1]
    arrC[2] = ArrName[2]
    arrC[3] = ArrName[4]
    arrC[4] = ArrName[5]
    arrC[5] = ArrName[6]
    arrC[6] = ArrName[7]
    arrC[7] = ArrName[14]
    arrC[8] = ArrName[20]
    arrC[9] = ArrName[21]
    arrC[10] = ArrName[25]
    arrC[11] = ArrName[26]
    arrC[12] = ArrName[28]
    if (isSpace(fcpubdata.area.billtaborder)) {
        strID = "<root>";
        l = arrC.length
        for (var ilen = 0; ilen < l; ilen++) {
            var oNode = oContXml.documentElement.selectSingleNode(arrC[ilen])
            if (oNode == null) continue;
            l1 = oNode.childNodes.length
            for (var k = 0; k < l1; k++) {
                strID = strID + "<taborder>" + oNode.childNodes(k).text + "</taborder>";
            }
            /*
            l1=ArrNum[arrC[ilen]]
            for(var k=1;k<=l1;k++){
            try{
            obj=eval(arrC[ilen]+k);
            strID=strID+"<taborder>"+arrC[ilen]+k+"</taborder>";
            }catch(e){
            sfind="<taborder>"+arrC[ilen]+k+"</taborder>";
            if(strID.indexOf(sfind)>0){
            strID=RepStr(strID,sfind,"");
            }
            }
            }*/
        }
        strID = strID + "</root>";
    } else {
        //先去掉在taborder中存在而在oContXml中不存在的控件
        var sxml = fcpubdata.area.billtaborder;
        var oX = SetDom(sxml);
        var l = oX.documentElement.childNodes.length;
        for (var i = l - 1; i >= 0; i--) {
            var oNode = oContXml.documentElement.selectSingleNode("//id[. ='" + oX.documentElement.childNodes(i).text + "']");
            if (oNode == null) {
                oX.documentElement.removeChild(oX.documentElement.childNodes(i));
            }
        }
        sxml = oX.documentElement.xml;
        //加上新的控件
        strID = RemoveRoot(sxml);
        l = arrC.length
        for (var ilen = 0; ilen < l; ilen++) {
            var oNode = oContXml.documentElement.selectSingleNode(arrC[ilen])
            if (oNode == null) continue;
            l1 = oNode.childNodes.length
            for (var k = 0; k < l1; k++) {
                var sfind = "<taborder>" + oNode.childNodes(k).text + "</taborder>";
                //如不存在,则加上
                if (strID.indexOf(sfind) < 0) {
                    strID = strID + sfind
                }
            }

            /*
            l1=ArrNum[arrC[ilen]]
            for(var k=1;k<=l1;k++){
            try{
            obj=eval(arrC[ilen]+k);
            sfind="<taborder>"+arrC[ilen]+k+"</taborder>";
            if(strID.indexOf(sfind)<0){
            strID=strID+sfind;
            }
            }catch(e){
            sfind="<taborder>"+arrC[ilen]+k+"</taborder>";
            if(strID.indexOf(sfind)>=0){
            strID=RepStr(strID,sfind,"");
            }
            }
            }
            */
        }
        strID = "<root>" + strID + "</root>";
    }
    return strID;
}
/**
表单保存
保存表单：
0 合法性检查，单据SN重名检查，
1 预处理控件，如将表单控件进行转换后得到新的大HTML串
2 创建临时表
3 根据djid决定是INSERT还是UPDATE，只保存FC_BILLZL表中的几个字段：djid djsn djposition xmlstr
   	
用一个存储过程来保存表单，
此过程做如下工作：
1 检查单据SN是否重名，如重名则保存完后给出提示。
2 创建临时表。根据前台传来的命令创建。
3 根据djid决定是INSERT还是UPDATE,如为INSERT,则从FC_MAXBH表中查找biaoshi字段为BIL的记录的recnum字段+1后
当作djid,同时将+1后的值给recnum字段.
   	    
更新FC_BILLZL表中的djid,djsn,dj_name,djlx,djposition,xmltext,designtext,stmptable
此过程的输入参数：
djid,djsn,dj_name,djlx,djposition,xmltext,designtext,stmptable   	    

* 保存表单时，生成运行串要处理：1 数据集控件 2 页签控件 3 各控件的事件（点击） 4 生成建临时表的串
 
 
* 分保存到数据库和保存到文件
notalert = "不提示" 表示保存成功后不提示
nothtml="是" 表示不生成正式表单文件
iseb = "是" 表示用于e表中的保存参数报表,此时返回一个所需要的结果数组.

*@date 2004-07-21
**/
function DesignDjSave(notalert, nothtml, iseb) {
    if (iseb != "是") {
        //存盘前检查
        if (isSpace(fcpubdata.area.dj_sn)) {
            var s1 = '表单sn不能为空!请进入表单属性窗口输入表单SN.'
            alert(s1);
            var arrForm = new Array();
            arrForm[0] = fcpubdata.area;
            arrForm[5] = pstrUserFunction;
            s1 = DjOpen('form', arrForm, '展现', "有模式窗口", "直接", "表单属性");
            return s1
        }
        //检查grid控件 2011-05-17
        var oNode = oContXml.documentElement.selectSingleNode("/root/grid");
        if (oNode != null) {
            for (var i = 0; i < oNode.childNodes.length; i++) {
                var gridId = oNode.childNodes(i).text;
                var oGrid = $id(gridId);
                if (oGrid != null) {
                    if (IsSpace(oGrid.dataset)) {
                        var s1 = "grid控件 " + gridId + " 未绑定到数据集!";
                        alert(s1);
                        return s1;
                    }
                }
            }
        }
        //检查ebiao控件的内容不能为空 2011-06-30
        var oNode = oContXml.documentElement.selectSingleNode("/root/ebiao");
        if (oNode != null) {
            for (var i = 0; i < oNode.childNodes.length; i++) {
                var gridId = oNode.childNodes(i).text;
                var oo = $id(gridId);
                if (oo != null) {
                    if (oo.childNodes.length == 0) {
                        var s1 = "ebiao控件 " + gridId + " 的内容不能为空!";
                        alert(s1);
                        return s1;
                    }
                }
            }
        }
        var oUpload = $id("upload1");
        if (oUpload != null && IsSpace(oUpload.dataset)) {
            var s1 = "upload控件 upload1 未绑定到数据集!";
            alert(s1);
            return s1;

        }
        //自定义控件从36开始
        for (var k = 36; k < ArrName.length; k++) {
            var oNode = oContXml.documentElement.selectSingleNode("/root/" + ArrName[k]);
            if (oNode != null) {
                var oo = new Eform.AllWidget().getDesignObj(ArrName[k]);
                var sErr = oo.saveBefore();
                if (!IsSpace(sErr)) return sErr;


            }
        }

    }
    //维护控件ID
    if (TooContXml()) {
        openobjlist();
    } else {
        return "no empty";
    }
    //

    var d = new Date()
    var t = d.getTime();
    if (iseb != "是") {
        var objBillType = BillTypeNameToPath(fcpubdata.area.type);

        //保存 44,84,709,453,居中,不带工具栏,修改,当前窗口,有文件
        var sb = new Sys.StringBuilder();
        var sb1 = new Sys.StringBuilder();
        var tmpValue = fcpubdata.area.posleft;
        if (IsSpace(tmpValue)) {
            tmpValue = window.screenLeft;
        }
        sb.append(tmpValue + ",");

        tmpValue = fcpubdata.area.postop;
        if (IsSpace(tmpValue)) {
            tmpValue = window.screenTop;
        }
        sb.append(tmpValue + ",");

        tmpValue = fcpubdata.area.poswidth;
        if (IsSpace(tmpValue)) {
            tmpValue = window.document.body.clientWidth;
        }
        sb.append(tmpValue + ",");

        tmpValue = fcpubdata.area.posheight;
        if (IsSpace(tmpValue)) {
            tmpValue = window.document.body.clientHeight;
        }
        var tmpHeight = ToInt(tmpValue) - 30; //30是偏移值. 2011-03-16 

        sb1.append(fcpubdata.area.center + ",");
        sb1.append(fcpubdata.area.toolbar + ",");
        sb1.append(fcpubdata.area.entertype + ",");
        sb1.append(fcpubdata.area.window + ",");
        sb1.append(fcpubdata.area.caption);
        var sdjposition = sb.toString() + tmpValue + "," + sb1.toString();
        //更新 billpos.xml 文件
        if (fcpubdata.area.window != "当前窗口") {
            var sPosInfo = sb.toString() + tmpHeight + "," + sb1.toString();
            var newStr = "<tr><td>" + fcpubdata.area.dj_sn + "</td><td>" + sPosInfo + "</td></tr>";
            var newXml = "";
            //var sPathBase=location.protocol + "//"+location.host+fcpubdata.path;
            //			var oXmlFile = SetDomFile(location.protocol + "//"+location.host+fcpubdata.path+fcpubdata.userDir+"/xml/billpos.xml") ;
            var oXmlFile = SetDomFile(location.protocol + "//" + location.host + fcpubdata.path + "/" + objBillType.path + "billpos.xml");
            if (oXmlFile.documentElement != null) {
                var oNode = oXmlFile.documentElement.selectSingleNode("//tr[td='" + fcpubdata.area.dj_sn + "']");
                if (oNode == null) {
                    var oNewXml = SetDom(newStr);
                    oXmlFile.documentElement.insertBefore(oNewXml.documentElement, oXmlFile.documentElement.childNodes(0));
                } else {
                    oNode.childNodes(1).text = sPosInfo;
                }
                newXml = oXmlFile.documentElement.xml;
            } else {
                newXml = "<root>" + newStr + "</root>";
            }
            var shead = '<?xml version="1.0" encoding="' + fcpubdata.encoding + '" ?>';
            var sxml = "<file>" + "/" + objBillType.path + "billpos.xml</file><text><![" + "CDATA[" + shead + newXml + "]]" + "></text>";
            var ret = savedesignhtml(sxml)
            //if(ret==""){
            //    alert("保存成功!")
            //}else{
            //    alert(ret)
            //}
        }

        //保存表单模版fhj 2012-08-07
        if (fcpubdata.area.type == "MB") {
            var sContXml1 = fcpubdata.area.getAttribute("contxml");
            if (sContXml1 == null) return;
            var oContXml1 = SetDom(sContXml1);
            if (oContXml1.documentElement == null) return;
            var oNode = oContXml1.documentElement.selectSingleNode("eblayout");
            var layoutContInfo = "";
            var useHelp = "";
            if (oNode == null) return;
            for (var i = 0; i < oNode.childNodes.length; i++) {
                var id = oNode.childNodes[i].text;
                layoutContInfo += id;
                if (i < oNode.childNodes.length - 1) layoutContInfo += ",";
            }
            if (!IsSpace(fcpubdata.area.useHelp)) {
                useHelp = RepStr(fcpubdata.area.useHelp, "\r\n", "&#13;&#10;");
            }
            var tmp_runParams = fcpubdata.area.getAttribute("runParams");
            if (IsSpace(tmp_runParams)) {
                tmp_runParams = "";
            } else {
                tmp_runParams = RepStr(tmp_runParams, "\r\n", "&#13;&#10;");
            }
            var str = "<tr><dj_sn>" + fcpubdata.area.dj_sn + "</dj_sn><caption>" + fcpubdata.area.caption + "</caption><id>" + layoutContInfo + "</id><useHelp>" + RepXml(useHelp) + "</useHelp><envType>" + fcpubdata.area.envType + "</envType><runParams>" + tmp_runParams + "</runParams><viewType>" + fcpubdata.area.viewType + "</viewType></tr>";
            var newXml1 = "";
            var oXmlFile1 = SetDomFile(location.protocol + "//" + location.host + fcpubdata.path + "/" + "zk/formtemp/formlist.xml");
            if (oXmlFile1.documentElement != null) {
                var oNode = oXmlFile1.documentElement.selectSingleNode("//tr[dj_sn='" + fcpubdata.area.dj_sn + "']");
                if (oNode == null) {
                    var oNewXml1 = SetDom(str);
                    oXmlFile1.documentElement.insertBefore(oNewXml1.documentElement, oXmlFile1.documentElement.childNodes(0));
                } else {
                    oNode.childNodes[1].text = fcpubdata.area.caption;
                    oNode.childNodes[2].text = layoutContInfo;
                    oNode.childNodes[3].text = useHelp;
                    oNode.childNodes[4].text = fcpubdata.area.envType;
                    oNode.childNodes[5].text = tmp_runParams;
                    oNode.childNodes[6].text = fcpubdata.area.viewType;
                }
                newXml1 = oXmlFile1.documentElement.xml;
            } else {
                newXml1 = "<root>" + str + "</root>";
            }
            var shead = '<?xml version="1.0" encoding="' + fcpubdata.encoding + '" ?>';
            var sxml1 = "<file>" + "/" + "zk/formtemp/formlist.xml</file><text><![" + "CDATA[" + shead + newXml1 + "]]" + "></text>";
            var ret1 = savedesignhtml(sxml1)
        }

        //保存工作流用的字段信息到 billworkflow.xml 2011-04-14
        var wfField = get_wf_fields();
        if (IsSpace(wfField) == false) {
            var sTmpAll = "<bill><djsn>" + fcpubdata.area.dj_sn + "</djsn><djname>" + fcpubdata.area.caption + "</djname><fields>" + wfField + "</fields></bill>";

            var newXml = "";
            var oXmlFile = SetDomFile(location.protocol + "//" + location.host + fcpubdata.path + "/" + objBillType.path + "billworkflow.xml");
            if (oXmlFile.documentElement != null) {
                var oNode = oXmlFile.documentElement.selectSingleNode("//bill[djsn='" + fcpubdata.area.dj_sn + "']");
                if (oNode != null) {
                    oXmlFile.documentElement.removeChild(oNode);
                }
                var oNewXml = SetDom(sTmpAll);
                oXmlFile.documentElement.appendChild(oNewXml.documentElement);
                newXml = oXmlFile.documentElement.xml;
            } else {
                newXml = "<root>" + sTmpAll + "</root>";
            }
            var shead = '<?xml version="1.0" encoding="' + fcpubdata.encoding + '" ?>';
            var sxml = "<file>" + "/" + objBillType.path + "billworkflow.xml</file><text><![" + "CDATA[" + shead + newXml + "]]" + "></text>";
            var ret = savedesignhtml(sxml)
        }

    }
    var scontrolno = SaveControlNo()
    fcpubdata.area.controlno = scontrolno
    //如和下一个ID

    //保存控件名称的DOM串
    fcpubdata.area.contxml = oContXml.documentElement.xml

    //清除已删除控件的设计权限串 2010-08-23 add

    if (IsSpace(fcpubdata.area.roleXml) == false) {
        var oRoleXml = SetDom("<root>" + fcpubdata.area.roleXml + "</root>");
        for (var k = oRoleXml.documentElement.childNodes.length - 1; k >= 0; k--) {
            var tmpId = oRoleXml.documentElement.childNodes(k).getAttribute("id");
            if ($id(tmpId) == null) {
                oRoleXml.documentElement.removeChild(oRoleXml.documentElement.childNodes(k));
            }
        }
        fcpubdata.area.roleXml = new Eapi.Str().removeRoot(oRoleXml.documentElement.xml)

    }
    DesignStr_RunStr_Before(fcpubdata.area)

    if (fcpubdata.area.getAttribute("type") == "MB") {
        var sJs1 = escape(pstrUserFunction);
        var sJs2 = escape(pstrAddHtml);
        fcpubdata.area.setAttribute("jsUser", sJs1);
        fcpubdata.area.setAttribute("addHtml", sJs2);
    }

    var sDesignText = fcpubdata.area.outerHTML; //保存好设计串

    var sDesignTextBak = sDesignText;



    //附加页面
    var tmpaddhtml = ""
    if (pstrAddHtml != "") {
        tmpaddhtml = pstrSplitAddHtml + pstrAddHtml
    }
    if (iseb != "是") {


        //如果是保存到文件
        if (fcpubdata.area.isfile == "是") {
            sDesignText = "<![CDATA[<script>" + RepStr(pstrUserFunction, "\r\n", "&#13;&#10;") + "</scr" + "ipt> " + sDesignText + tmpaddhtml + "]]>"
            //		var sFile = new Eapi.Str().trim(fcpubdata.area.type)+"_"+new Eapi.Str().trim(fcpubdata.area.dj_sn)
            var sFile = "/" + objBillType.path + new Eapi.Str().trim(fcpubdata.area.dj_sn) + ".dj";
            if (pdjFilePath != sFile) {
                //判断文件名是否重复
                var retX = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=fileExist&spath=" + fcpubdata.path + sFile, ""); // fceform/djfile/
                if (retX == "yes") {
                    var yesno = window.confirm("文件: " + sFile + ".dj 已存在! 按 [确定] 则覆盖保存!");
                    if (yesno == false) return;
                } else if (retX != "no" && IsSpace(retX) == false) {
                    alert(retX); //显示错误信息
                    return;
                }

            }
            //			var sXml = "<no>"+sFile+"</no><no>"+sDesignText+"</no><no></no>"+"<No>"+fcpubdata.path+"</No>"
            var sXml = "<file>" + sFile + "</file><text>" + sDesignText + "</text>";
            var ret = savedesignhtml(sXml);
            if (ret == "") {
                pdjFilePath = sFile;
                if (notalert != "不提示") alert(sFile + "文件保存成功!");
                //return "" ;
            } else {
                alert(ret)
                return ret
            }

        } else {
            sDesignText = "<![CDATA[" + TransSql(sDesignText) + "]]>"

        }
    }

    fcpubdata.area.removeAttribute("contentEditable")
    fcpubdata.area.removeAttribute("unselectable")

    //DesignStr_RunStr_Before0() ;
    //由设计转为运行串
    var sRun = fcpubdata.area.outerHTML

    sRun = DesignStr_RunStr_After(sRun, ArrNum)
    if (iseb == "是") { //e表保存 由此返回 
        return [sDesignTextBak, sRun, pstrUserFunction, pstrAddHtml];
    }
    var sAllHtml = "";
    //if(fcpubdata.area.isfile == "是") {
    sAllHtml = "<![CDATA[" + "<script>" + pstrUserFunction + "</script>" + sRun + pstrAddHtml + "]]>";
    //}
    fcpubdata.area.outerHTML = sDesignTextBak;
    fcpubdata.area = $id("SKbillsheet");
    fcpubdata.area.unselectable = "on";
    fcpubdata.area.contentEditable = true

    //临时表	
    var stmptable = ""
    if (isSpace(fcpubdata.area.runsave) == false) {
        stmptable = GetTmpTableStr();
        stmptable = "<![CDATA[" + TransSql(stmptable) + "]]>"
    }
    //自定义函数
    var tmpfunc = pstrUserFunction
    //tmpfunc=TransXml(tmpfunc) ;
    tmpfunc = TransSql(repNewLine(repXml(tmpfunc)));
    tmpaddhtml = "<![CDATA[" + TransSql(tmpaddhtml) + "]]>"

    sRun = "<![CDATA[" + TransSql(sRun) + "]]>"




    if (fcpubdata.area.isfile != "是") {
        var sXml = "<no>" + curdjid + "</no>" + "<no>" + fcpubdata.area.dj_sn + "</no>" + "<no>" + fcpubdata.area.caption + "</no>" + "<no>" + fcpubdata.area.type + "</no>"
				+ "<no>" + sdjposition + "</no>" + "<no>" + sRun + "</no>" + "<no>" + sDesignText + "</no>"
				+ "<no>" + tmpfunc + "</no>"
				+ "<no>" + stmptable + "</no>"
				+ "<no>" + tmpaddhtml + "</no>"
				+ "<no>" + fcpubdata.databaseTypeName + "</no>"
				+ "<userType>" + fcpubdata.area.userType + "</userType>";
        //CopyToPub(sXml)
        var sRet = designdjsave(sXml);
        var iPos = sRet.indexOf(",")
        var sMsg = sRet.substring(iPos + 1, sRet.length)


        if (isSpace(sMsg) == false) {
            alert(sMsg);
            return sMsg;
        } else { // save ok
            if (curdjid == 0) {
                var s = sRet.substring(0, iPos)

                curdjid = parseInt(s);
            }
        }
    }
    ChangeWinTitle(fcpubdata.area.dj_sn);
    //起始页
    /*		try{
    var arr=new Array(4);
    var str="";
    str=LoadPubData("origPage");
    arr=str.split(";");
    //var oXml=new ActiveXObject("Microsoft.XMLDOM");
    //oXml.async=false;
    // oXml.loadXML (str) ;
    var s1=curdjid+","+fcpubdata.area.dj_sn+","+fcpubdata.area.caption;
    arr=moveArr(arr,s1);
    var str1="";
    for(var i=0;i<arr.length;i++){
    str1+=arr[i]+";"
    }
    str1=str1.substring(0,str1.length-1);
    SavePubData("origPage",str1);
    }catch(e){} */

    //加上最近打开的文件
    if (fcpubdata.area.isfile == "是") {
        ef_AddRecentFile("-1," + pdjFilePath + ",");
    } else {
        ef_AddRecentFile(curdjid + "," + fcpubdata.area.dj_sn + "," + fcpubdata.area.caption);
    }
    ef_RefreshRecentFile();

    //生成iframe
    var preUrl = $urlParam("srcUser");
    if (IsSpace(preUrl) == false) {
        var isAlert = notalert == "不提示" ? "no" : "yes";
        new Eapi.Session().iframeRun("saveDjHtmId", preUrl + "?key=saveFromFc&djid=" + curdjid + "&djsn=" + fcpubdata.area.dj_sn + "&djtype=" + fcpubdata.area.type + "&isalert=" + isAlert, function() { });
    } else {
        //生成正式表单文件
        if (nothtml != "是") {
            var tmpNo = fcpubdata.area.dj_sn;

            //if(fcpubdata.area.isfile != "是") sAllHtml = "no empty" ;
            var sPos = genDjHtmlFile(sAllHtml, tmpNo, objBillType.path, objBillType.extname, fcpubdata.area.getAttribute("allBrowser"), function callback() { });
        }
        if (notalert != "不提示" && fcpubdata.area.isfile != "是") alert("保存成功！");
    }
    blnChange = false;

    //自定义控件从36开始
    for (var k = 36; k < ArrName.length; k++) {
        var oNode = oContXml.documentElement.selectSingleNode("/root/" + ArrName[k]);
        if (oNode != null) {
            var oo = new Eform.AllWidget().getDesignObj(ArrName[k]);
            oo.saveAfter();


        }
    }

    return "";
    function moveArr(arr, sValue) {
        if (sValue != "") {
            if (arr[0] != sValue && arr[1] != sValue && arr[2] != sValue && arr[3] != sValue) {
                arr[3] = arr[2];
                arr[2] = arr[1];
                arr[1] = arr[0];
                arr[0] = sValue;
            } else {
                if (arr[0] == sValue || arr[1] == sValue || arr[2] == sValue || arr[3] == sValue) {
                    var str = "";
                    for (var i = 3; i >= 0; i--) {
                        if (arr[i] == sValue) {
                            str = arr[i];
                            for (var j = i; j > 0; j--) {
                                arr[j] = arr[j - 1];
                            }
                            arr[0] = str;
                            break;
                        }
                    }
                }
            }
        }
        return arr;
    }
    /**
    得到要建的临时表的建表串
    *@date 2004-07-30
    **/
    function GetTmpTableStr() {
        //return ""
        var sRet = "";
        var oNode = oContXml.documentElement.selectSingleNode("dataset");
        if (oNode != null) {
            var l = oNode.childNodes.length;
            for (var i = 0; i < l; i++) {
                var id = oNode.childNodes(i).text;
                var ods = eval(id);
                if (ods.iscreatetable == "是") {
                    var sXml = ods.formatxml;
                    //西文字段名0 中文名称1 字段类型2 字段宽度3 字段精度4 
                    var stablename = ods.temptable;
                    sRet += GetCreateTable(stablename, sXml, true) + ";";

                }
            }
        }
        if (sRet != "") {
            sRet = sRet.substring(0, sRet.length - 1);
        }
        return sRet;


    }
    /**
    * 取工作流用的字段信息, 2011-04-14
    **/
    function get_wf_fields() {
        var sb = new Sys.StringBuilder();
        var oNode = oContXml.documentElement.selectSingleNode("dataset");
        if (oNode != null) {
            var l = oNode.childNodes.length;
            for (var i = 0; i < l; i++) {
                var id = oNode.childNodes(i).text;
                var ods = eval(id);
                var sXml = ods.formatxml;
                var oXml = SetDom(sXml);
                if (oXml.documentElement != null) {
                    var ll = oXml.documentElement.childNodes.length;
                    for (var j = 0; j < ll; j++) {

                        if (oXml.documentElement.childNodes(j).childNodes(13).text != "是") continue; //procvalid 节点,此值=是 表示此字段为工作流用

                        sb.append("<field><fieldname>");
                        sb.append(oXml.documentElement.childNodes(j).childNodes(0).text);
                        sb.append("</fieldname><displaylabel>");
                        sb.append(oXml.documentElement.childNodes(j).childNodes(1).text);
                        sb.append("</displaylabel><datatype>");
                        sb.append(oXml.documentElement.childNodes(j).childNodes(2).text);
                        sb.append("</datatype><size>");
                        sb.append(oXml.documentElement.childNodes(j).childNodes(3).text);
                        sb.append("</size><precision>");
                        sb.append(oXml.documentElement.childNodes(j).childNodes(4).text);
                        sb.append("</precision></field>");
                    }
                }
            }
        }
        return sb.toString();

    }
}
/**
打开表单
designtext字段中包含自定义函数的内容，但不含附加页面的内容。
自定义函数的内容在最前面。
*@date 2004-08-02
**/

function DesignDjOpen(djid) {
    if (SaveTip() == true) return;
    if (djid <= 0) return ""
    if (fcpubdata.databaseTypeName == "oracle") {
        var sRet = loadClob("<no>designtext</no><no>" + djid + "</no>")
        //sRet = UnTransSql(sRet)   	
    } else {

        var sql = "select designtext from FC_BILLZL where djid=" + djid;
        var sRet = SqlToField(sql);
        if (isSpace(sRet)) return ""
    }

    var s = DesignDjOpenSub(sRet, djid);

    var preUrl = $urlParam("srcUser");
    if (IsSpace(preUrl) == false)
        new Eapi.Session().iframeRun("saveDjHtmId", preUrl + "?key=readRoleXml&djid=" + curdjid, function() { });
    return s;
}
function DesignDjOpenSub(sRet, djid) {
    allWidget.designOpenBefore();
    //CopyToPub(sRet)
    //自定义函数+"</scr"+"ipt>"+表单画的内容+pstrSplitAddHtml+附加表单的内容
    if (typeof djid == "undefined") djid = 0
    if (typeof sRet == "object") { //e表时用
        if (IsSpace(sRet[0]) == false) {
            fcpubdata.area.outerHTML = sRet[0];
            fcpubdata.area = $id("SKbillsheet");
        }
        //sRet[1] 为表单运行串
        pstrUserFunction = sRet[2];
        pstrAddHtml = sRet[3]

    } else {
        var iEnd = sRet.indexOf("</scr" + "ipt>");
        if (iEnd == -1) {
            pstrUserFunction = "";
            sHtm = sRet
        } else {
            var sHtm = sRet.substring(iEnd + 9, sRet.length);
            if (isSpace(sHtm)) {

                return ""
            }
            pstrUserFunction = sRet.substring(8, iEnd);
            pstrUserFunction = unRepNewLine(unRepXml(pstrUserFunction));
        }
        //求 附加页面串
        var ipos = sHtm.indexOf(pstrSplitAddHtml)
        if (ipos == -1) {
            pstrAddHtml = ""

        } else {
            pstrAddHtml = sHtm.substring(ipos + pstrSplitAddHtml.length, sHtm.length)
            sHtm = sHtm.substring(0, ipos)
        }

        fcpubdata.area.outerHTML = sHtm //+pstrAddHtml ;
        fcpubdata.area = $id("SKbillsheet");
    }
    try {
        if (isSpace(fcpubdata.area.controlno)) return "";
    } catch (e) {
        //当sHtm不是合法的HTM串时出错
        if (isSpace(sHtm) == false) {
            alert(sHtm);
        }
        return "";
    }
    curdjid = djid;

    ArrNum = OpenControlNo(fcpubdata.area.controlno, ArrNum)
    var scontxml = fcpubdata.area.contxml
    if (isSpace(scontxml)) {
        scontxml = "<root></root>"
    }
    oContXml = SetDom(scontxml)

    //处理控件列表
    openobjlist();
    ShowAllField();

    pageonload()

    if (IsSpace(fcpubdata.area.dj_sn) == false) {
        //在主页页签上加上标题。2012-12-24
        if (!setTabTitle(fcpubdata.area.dj_sn)) {
            ChangeWinTitle(fcpubdata.area.dj_sn);
        }
    }

    bigmain.focus();
    //CopyToPub(bigmain.innerHTML)

    blnChange = false

    allWidget.designOpenAfter();
    return "OK"
}

/**
新建表单,isWizard ="是" 表示有向导
*@date 2004-08-02
**/
function DesignDjNew(isWizard) {
    if (SaveTip() == true) return;
    if (isWizard == "是") {
        var sHtm = DjOpen('fcs_NewWizard', fcpubdata.area, '展现', "有模式窗口", "直接", "新建表单向导");
        if (typeof sHtm == "undefined") return;
    } else {
        var sHtm = "空";
    }
    if (sHtm == "空") {
        pdjFilePath = ""
        curdjid = 0;
        pstrUserFunction = ""
        pstrAddHtml = ""
        fcpubdata.area.outerHTML = '<div id="SKbillsheet" oncontrolselect="controlselect()" jslib="fcopendj.js&#13;&#10;fcsavedj.js&#13;&#10;fcselfuse.js&#13;&#10;fcbasecont.js&#13;&#10;fcother.js&#13;&#10;selectdate.js&#13;&#10;~userfunc.js" ></div>';
        fcpubdata.area = $id("SKbillsheet");
        //fcpubdata.area.unselectable = "on";
        fcpubdata.area.contentEditable = true

        //pubDsMain.outerHTML ='<img id="pubDsMain" dsid="DsMain" style="display:none">'
        InitControlNo()
        oContXml = SetDom("<root></root>")
        AutoAddDsMain();
        var sTitle = "表单设计器";

        if (!setTabTitle(sTitle))
            ChangeWinTitle(sTitle);
        try {
            bigmain.focus();
            //	fcpubdata.area.focus();
        } catch (e) { }
    } else {
        //if( sHtm != "空"){
        fcpubdata.area.innerHTML = sHtm;
        //CopyToPub(sHtm)
    }
    if (TooContXml()) { openobjlist(); ShowAllField(); }

    if (IsSpace(sHtm) == false && sHtm != "空")
        blnChange = true;
    else
        blnChange = false;

}
/**
表单另存
*@date 2004-08-04
**/
function DesignDjSaveAs() {
    var sRet = window.showModalDialog("input.htm", "", "status:no;dialogHeight:120px;dialogWidth:400px;dialogTop:180;dialogLeft:250px")
    if (typeof sRet == "undefined") return
    fcpubdata.area.dj_sn = sRet
    curdjid = 0;
    DesignDjSave();
    if (!setTabTitle(fcpubdata.area.dj_sn))
        ChangeWinTitle(fcpubdata.area.dj_sn);
}
/**
存盘前提示
*@date 2004-08-05
**/
function SaveTip() {
    if (blnChange == false) return
    var ret = window.confirm("确定保存当前表单吗？");
    if (ret == true) {
        DesignDjSave();
    }

    return ret;
}

/**
保存找到当前表单中控件的号码
*@date 2004-08-04
**/
function SaveControlNo() {
    //ArrNum['SKButton']++
    var sRet = ""
    for (var Num = 0; Num < ArrName.length; Num++) {
        sRet += ArrName[Num] + ":" + ArrNum[ArrName[Num]] + ";";
        //		sRet+=ArrNum[ArrName[Num]]+";" ;
    }
    sRet = sRet.substring(0, sRet.length - 1);
    return sRet;
}

function window_onbeforeunload() {
    SavePubData("recentFile", fcpubdata.recentFile);

    if (blnChange == false) return
    //event.returnValue="离开当前页面将导致当前输入的数据丢失! 按 [确定] 则不保存数据并关闭窗口。"
}

function main_onbeforeeditfocus() {
    var obj = event.srcElement;
    if (obj.tagName == "TD" || obj.id == "SKbillsheet") return;
    event.returnValue = false
}
function main_exec(scomm) {
    document.execCommand(scomm)

}
function window_onresize() {
    var iwidth = document.body.offsetWidth - 2;
    var iheight = document.body.offsetHeight - 2;
    if (iwidth < 0 || iheight < 0) return;
    srcHtml.style.width = iwidth
    srcHtml.style.height = iheight
    //如设置了窗口宽度,则始终是设置的宽度值,否则为窗口的宽度
    var iwidth1 = parseInt(fcpubdata.area.poswidth)
    if (isSpace(fcpubdata.area.poswidth) == false) {
        //if(bigmain.offsetWidth < iwidth1 ){
        bigmain.style.width = iwidth1
        //}
    } else {
        bigmain.style.width = iwidth
    }
    var iheight1 = parseInt(fcpubdata.area.posheight)
    if (isSpace(fcpubdata.area.posheight) == false) {
        //if(bigmain.offsetHeight < iheight1 ){
        bigmain.style.height = iheight1
        //}
    } else {
        bigmain.style.height = iheight
    }
    //middlediv.style.width = bigmain.style.width
    //middlediv.style.height = bigmain.style.height
}
/**
删除ocontxml中值相同的节点
*@date 2005-03-30
**/
function DelSameNameNode() {
    var curid = ""
    var l = oContXml.documentElement.childNodes.length
    for (var i = 0; i < l; i++) {
        var l1 = oContXml.documentElement.childNodes(i).childNodes.length
        for (var j = l1 - 1; j >= 0; j--) {
            if (curid == oContXml.documentElement.childNodes(i).childNodes(j).text) {
                oContXml.documentElement.childNodes(i).removeChild(oContXml.documentElement.childNodes(i).childNodes(j))
                continue
            }
            curid = oContXml.documentElement.childNodes(i).childNodes(j).text;
        }
    }
}

/**
* 由界面上的控件 ==> oContXml 
*@return false 表示id重复,没有做同步工作,
*@date 2005-04-19
**/
function TooContXml() {
    var sRet = new Sys.StringBuilder();
    sRet.append("<root>");
    var arrXml = new Array()
    var o = fcpubdata.area.all
    var l = o.length;
    for (var i = 0; i < l; i++) {
        var sid = o[i].id
        var scontroltype = o[i].controltype
        if (typeof (sid) == "undefined" || typeof (scontroltype) == "undefined") continue
        //如没有controltype,表示是旧的控件,则要补上,2006-01-23 remove
        /*
        if(typeof(scontroltype) == "undefined") {
        var ll=ArrName.length;
        for (var ii=0;ii<ll;ii++){
        if (sid.indexOf(ArrName[ii])==0){
        o[i].controltype = ArrName[ii] ;
        scontroltype = o[i].controltype ;
        break ;
        }
        }
			
		}*/

        if (typeof arrXml[scontroltype] == "undefined") arrXml[scontroltype] = ""
        var tmp = "<id>" + sid + "</id>";
        if (arrXml[scontroltype].indexOf(tmp) >= 0 && sid != "" && sid != "fcpagesub" && sid != "fcpagesubtable") {
            alert("注意: " + sid + "重复!请修改.")
            return false;
        } else if (sid == "" || sid == "fcpagesub" || sid == "fcpagesubtable") {

        } else {
            arrXml[scontroltype] += tmp;
        }

    }
    var l = ArrName.length;
    for (var i = 0; i < l; i++) {
        if (isSpace(arrXml[ArrName[i]]) == false) {
            sRet.append("<" + ArrName[i] + ">" + arrXml[ArrName[i]] + "</" + ArrName[i] + ">");

        }
    }

    sRet.append("</root>");


    oContXml = SetDom(sRet.toString());
    //计算新的tab串
    //fcpubdata.area.billtaborder = "" ; //清空以重算
    fcpubdata.area.billtaborder = TaborderXml();
    return true
}
/**
* 在设计窗口点右键菜单的调用
*@date 2005-08-11
**/
function main_onRightClick() {
    var tagName = event.srcElement.tagName;

    if (tagName == "TD") {
        //RightMenu.DataSource="MenuTab.value" ;
        RightMenuTab.showMenu(window, RightMenuTab.dataSource.documentElement.selectSingleNode('//MenuItem'), window.document.body, event.x, event.y);
    } else {
        //RightMenu.DataSource="MenuCode.value" ;
        RightMenu.showMenu(window, RightMenu.dataSource.documentElement.selectSingleNode('//MenuItem'), window.document.body, event.x, event.y);
    }
    //RightMenu.Init() ;


}
/**
*设置TD上选中的文本的属性
*@date 2005-08-22
**/
function SetSelTextProp() {
    var sRet = DjOpen('fcs_selprop', window, '展现', '无模式窗口', '直接', '设置当前选中文本的属性');
}
/*
function bill_ondrop() {
event.returnValue = false
//alert(event.srcElement.outerHTML)
//var s1 = event.dataTransfer.getData("Text") ;
	
}*/

function mytest() {
    var oControlRange = document.body.createControlRange();
    //oControlRange.add(fcpubdata.area);
    oControlRange.select();

    //	event.returnValue =false
    //	test1.value=SaveControlNo()
}
function mytest1() {
    //OpenControlNo(test1.value)
    htmltocont('<button controltype="FCButton" id="FCButton1" >aa</button>', 'FCButton')
}
//
