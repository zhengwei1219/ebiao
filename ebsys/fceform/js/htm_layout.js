var allWidget = new Eform.AllWidget();
allWidget.designReadyBefore();

var editor = null;
var editortab = null;


var lngUndo = -1
var lngRedo = -1
var oUndo = SetDom("<root></root>")
var oRedo = SetDom("<root></root>")

//---------------------
var pdjFilePath = ""; //�ļ���ʱ,���ļ����ڵ�·�������djfileĿ¼�����·�����ļ���
var curdjid = 0 //��ǰ�򿪵ı���ID��=0��ʾΪ�½��ı�
var pstrUserFunction = "" //���浱ǰ�����Զ��庯��������
var pstrAddHtml = "" //���浱ǰ���ĸ���ҳ��Ԫ�ص�����
var pstrSplitAddHtml = "<p id=splitaddhtml />";
var blnChange = false //�Ķ���־,Ϊ���ʾ�Ķ���Ҫ��ʾ����
var curSelElement = null //
var strXml;
var strID;
var arrtmp1 = new Array();

//�ؼ���������
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
ArrName[18] = "DsMain_field";  // SKDBTreeView��ΪDsMain_field,������¼����
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
ArrName[31] = "ebshow"; //��ʾe��ؼ�
ArrName[32] = "ebiao"; //E��ؼ�
ArrName[33] = "layout"; //���ֿؼ�
ArrName[34] = "page"; //page�ؼ�
ArrName[35] = "eblayout"; //����ģ��ؼ�

//ArrName[28]="ep_borderstyle"

var oContXml = SetDom("<root></root>"); //����ÿ���ؼ�ID

var ArrNum = new Array(); //����ÿ�ֿؼ�������
//var ArrCom = new Array(new Array()) ; //����ÿ���ؼ�ID
InitControlNo()
allWidget.designReadyAfter();
/**
��ʼ���ؼ�����
**/
function InitControlNo() {
    for (var Num = 0; Num < ArrName.length; Num++) {
        ArrNum[ArrName[Num]] = 0;
        //ArrCom[ArrName[Num]] = new Array() ;
    }

}
/**
*����װ���¼�����
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
    //Ϊ��֧��һ������ƽ���ʱ�������ģʽ��ĳ�ű�
    if (isSpace(parent.topdjsn) == false) {
        if (parent.Request.QueryString("isfile").toString() == "yes") { //��ƴ��ļ���
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
        //Ϊ�˿������±���һ�¶����
        if (parent.Request.QueryString("resave").toString() == "yes") {
            fcpubdata.area.contxml = "";
            oContXml = null;
            DesignDjSave("����ʾ", "��");
        }
    } else if (parent.Request.QueryString("ebuse").toString() == "yes") { //e����

        e_opendj();

    } else {
        //yes/no ���������Ƿ��Ǽӿؼ�ʱ�Զ����ֶ�
        fcpubdata.autoAddField = parent.Request.QueryString("autoaddfield").toString();
        AutoAddDsMain();
        //var startpage = "" ;
        //startpage = parent.Request.QueryString("startpage").toString();
        //if(startpage != "no" ){
        //��ʼҳ
        //	DjOpen("fcs_origPage",parent,"չ��","��ģʽ����","ֱ��","��ʼҳ");
        //}		
        fcpubdata.recentFile = LoadPubData("recentFile");
        ef_RefreshRecentFile();

    }


    window_onresize();
    if (parent.menu.pubPositionChange == "��") {
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
    //�����жϵ��ؼ��ƶ�E��ؼ���ʱӦ��Ϊstatic
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
������ҳǩ�ؼ����ƶ��͵����ؼ�ʱ�����Ƶ�ҳǩ�ؼ�������
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
*���ؼ�ѡ��ʱ����ǰ�ؼ���ȫ�ֱ���
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
�򿪱�ʱ����
**/
function pageonload() {
    var oNode = oContXml.documentElement.selectSingleNode("tab");
    if (oNode != null) {
        var l = oNode.childNodes.length;
        for (var i = 0; i < l; i++) {
            var obj = eval(oNode.childNodes(i).text)

            //��������ҳ��select�ؼ�
            var oPP = obj;
            var ll = oPP.childNodes.length;
            for (var ii = 2; ii < ll; ii++) {
                HideListBox(oPP.childNodes(ii), "��")
            }
            //try{
            HideListBox(oPP.childNodes(1), "��")
            //}catch(E){}
        }
    }
}
function CancelEvent() {
    if (event.srcElement.id == "fcpagesub" || event.srcElement.id == "fcpagesubtable")
        event.returnValue = false;
}
function page_onresize() {

    //������ҳ�Ĵ�С��ҳ��ؼ�ͬ��
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
        var oPP = oP.parentNode  //����ҳǩ�ؼ�
        var l = oPP.childNodes.length;
        for (var i = 1; i < l; i++) {
            oPP.childNodes(i).style.zIndex = 0
            //oPP.childNodes(i).style.display="none"

            oTr.cells(i - 1).style.color = "black"
            HideListBox(oPP.childNodes(i), "��")
        }
        oPP.childNodes(index + 1).style.zIndex = 1
        //oPP.childNodes(index+1).style.display="block"
        oTr.cells(index).style.color = "red"
        HideListBox(oPP.childNodes(index + 1), "��")
    }
    /*
    if(obj.tagName=="A"){
    var oP=obj.parentNode.parentNode
    }else{
    var oP=obj.parentNode
    }
    var oPP=oP.parentNode  //����ҳǩ�ؼ�
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
* ��ҳʱ����select�ؼ�
**/
function HideListBox(oPage, sTag) {
    var sTag1
    var oList = oPage.all.tags("select")

    var l = oList.length
    if (sTag == "��") {
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
����������ʱ�ѽ����ϵ����еĿؼ�IDƴ��XML��
@date 2004-07-13
@return ����XML��"<root><taborder>SKButton1</taborder><taborder>SKButton2</taborder><root>"
**/
function TaborderXml() {
    var l
    var l1
    var arrC = new Array()
    //���пؼ��н���
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
        //��ȥ����taborder�д��ڶ���oContXml�в����ڵĿؼ�
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
        //�����µĿؼ�
        strID = RemoveRoot(sxml);
        l = arrC.length
        for (var ilen = 0; ilen < l; ilen++) {
            var oNode = oContXml.documentElement.selectSingleNode(arrC[ilen])
            if (oNode == null) continue;
            l1 = oNode.childNodes.length
            for (var k = 0; k < l1; k++) {
                var sfind = "<taborder>" + oNode.childNodes(k).text + "</taborder>";
                //�粻����,�����
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
������
�������
0 �Ϸ��Լ�飬����SN������飬
1 Ԥ����ؼ����罫���ؼ�����ת����õ��µĴ�HTML��
2 ������ʱ��
3 ����djid������INSERT����UPDATE��ֻ����FC_BILLZL���еļ����ֶΣ�djid djsn djposition xmlstr
   	
��һ���洢�������������
�˹��������¹�����
1 ��鵥��SN�Ƿ��������������򱣴���������ʾ��
2 ������ʱ������ǰ̨�������������
3 ����djid������INSERT����UPDATE,��ΪINSERT,���FC_MAXBH���в���biaoshi�ֶ�ΪBIL�ļ�¼��recnum�ֶ�+1��
����djid,ͬʱ��+1���ֵ��recnum�ֶ�.
   	    
����FC_BILLZL���е�djid,djsn,dj_name,djlx,djposition,xmltext,designtext,stmptable
�˹��̵����������
djid,djsn,dj_name,djlx,djposition,xmltext,designtext,stmptable   	    

* �����ʱ���������д�Ҫ����1 ���ݼ��ؼ� 2 ҳǩ�ؼ� 3 ���ؼ����¼�������� 4 ���ɽ���ʱ��Ĵ�
 
 
* �ֱ��浽���ݿ�ͱ��浽�ļ�
notalert = "����ʾ" ��ʾ����ɹ�����ʾ
nothtml="��" ��ʾ��������ʽ���ļ�
iseb = "��" ��ʾ����e���еı����������,��ʱ����һ������Ҫ�Ľ������.

*@date 2004-07-21
**/
function DesignDjSave(notalert, nothtml, iseb) {
    if (iseb != "��") {
        //����ǰ���
        if (isSpace(fcpubdata.area.dj_sn)) {
            var s1 = '��sn����Ϊ��!���������Դ��������SN.'
            alert(s1);
            var arrForm = new Array();
            arrForm[0] = fcpubdata.area;
            arrForm[5] = pstrUserFunction;
            s1 = DjOpen('form', arrForm, 'չ��', "��ģʽ����", "ֱ��", "������");
            return s1
        }
        //���grid�ؼ� 2011-05-17
        var oNode = oContXml.documentElement.selectSingleNode("/root/grid");
        if (oNode != null) {
            for (var i = 0; i < oNode.childNodes.length; i++) {
                var gridId = oNode.childNodes(i).text;
                var oGrid = $id(gridId);
                if (oGrid != null) {
                    if (IsSpace(oGrid.dataset)) {
                        var s1 = "grid�ؼ� " + gridId + " δ�󶨵����ݼ�!";
                        alert(s1);
                        return s1;
                    }
                }
            }
        }
        //���ebiao�ؼ������ݲ���Ϊ�� 2011-06-30
        var oNode = oContXml.documentElement.selectSingleNode("/root/ebiao");
        if (oNode != null) {
            for (var i = 0; i < oNode.childNodes.length; i++) {
                var gridId = oNode.childNodes(i).text;
                var oo = $id(gridId);
                if (oo != null) {
                    if (oo.childNodes.length == 0) {
                        var s1 = "ebiao�ؼ� " + gridId + " �����ݲ���Ϊ��!";
                        alert(s1);
                        return s1;
                    }
                }
            }
        }
        var oUpload = $id("upload1");
        if (oUpload != null && IsSpace(oUpload.dataset)) {
            var s1 = "upload�ؼ� upload1 δ�󶨵����ݼ�!";
            alert(s1);
            return s1;

        }
        //�Զ���ؼ���36��ʼ
        for (var k = 36; k < ArrName.length; k++) {
            var oNode = oContXml.documentElement.selectSingleNode("/root/" + ArrName[k]);
            if (oNode != null) {
                var oo = new Eform.AllWidget().getDesignObj(ArrName[k]);
                var sErr = oo.saveBefore();
                if (!IsSpace(sErr)) return sErr;


            }
        }

    }
    //ά���ؼ�ID
    if (TooContXml()) {
        openobjlist();
    } else {
        return "no empty";
    }
    //

    var d = new Date()
    var t = d.getTime();
    if (iseb != "��") {
        var objBillType = BillTypeNameToPath(fcpubdata.area.type);

        //���� 44,84,709,453,����,����������,�޸�,��ǰ����,���ļ�
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
        var tmpHeight = ToInt(tmpValue) - 30; //30��ƫ��ֵ. 2011-03-16 

        sb1.append(fcpubdata.area.center + ",");
        sb1.append(fcpubdata.area.toolbar + ",");
        sb1.append(fcpubdata.area.entertype + ",");
        sb1.append(fcpubdata.area.window + ",");
        sb1.append(fcpubdata.area.caption);
        var sdjposition = sb.toString() + tmpValue + "," + sb1.toString();
        //���� billpos.xml �ļ�
        if (fcpubdata.area.window != "��ǰ����") {
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
            //    alert("����ɹ�!")
            //}else{
            //    alert(ret)
            //}
        }

        //�����ģ��fhj 2012-08-07
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

        //���湤�����õ��ֶ���Ϣ�� billworkflow.xml 2011-04-14
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
    //�����һ��ID

    //����ؼ����Ƶ�DOM��
    fcpubdata.area.contxml = oContXml.documentElement.xml

    //�����ɾ���ؼ������Ȩ�޴� 2010-08-23 add

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

    var sDesignText = fcpubdata.area.outerHTML; //�������ƴ�

    var sDesignTextBak = sDesignText;



    //����ҳ��
    var tmpaddhtml = ""
    if (pstrAddHtml != "") {
        tmpaddhtml = pstrSplitAddHtml + pstrAddHtml
    }
    if (iseb != "��") {


        //����Ǳ��浽�ļ�
        if (fcpubdata.area.isfile == "��") {
            sDesignText = "<![CDATA[<script>" + RepStr(pstrUserFunction, "\r\n", "&#13;&#10;") + "</scr" + "ipt> " + sDesignText + tmpaddhtml + "]]>"
            //		var sFile = new Eapi.Str().trim(fcpubdata.area.type)+"_"+new Eapi.Str().trim(fcpubdata.area.dj_sn)
            var sFile = "/" + objBillType.path + new Eapi.Str().trim(fcpubdata.area.dj_sn) + ".dj";
            if (pdjFilePath != sFile) {
                //�ж��ļ����Ƿ��ظ�
                var retX = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=fileExist&spath=" + fcpubdata.path + sFile, ""); // fceform/djfile/
                if (retX == "yes") {
                    var yesno = window.confirm("�ļ�: " + sFile + ".dj �Ѵ���! �� [ȷ��] �򸲸Ǳ���!");
                    if (yesno == false) return;
                } else if (retX != "no" && IsSpace(retX) == false) {
                    alert(retX); //��ʾ������Ϣ
                    return;
                }

            }
            //			var sXml = "<no>"+sFile+"</no><no>"+sDesignText+"</no><no></no>"+"<No>"+fcpubdata.path+"</No>"
            var sXml = "<file>" + sFile + "</file><text>" + sDesignText + "</text>";
            var ret = savedesignhtml(sXml);
            if (ret == "") {
                pdjFilePath = sFile;
                if (notalert != "����ʾ") alert(sFile + "�ļ�����ɹ�!");
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
    //�����תΪ���д�
    var sRun = fcpubdata.area.outerHTML

    sRun = DesignStr_RunStr_After(sRun, ArrNum)
    if (iseb == "��") { //e���� �ɴ˷��� 
        return [sDesignTextBak, sRun, pstrUserFunction, pstrAddHtml];
    }
    var sAllHtml = "";
    //if(fcpubdata.area.isfile == "��") {
    sAllHtml = "<![CDATA[" + "<script>" + pstrUserFunction + "</script>" + sRun + pstrAddHtml + "]]>";
    //}
    fcpubdata.area.outerHTML = sDesignTextBak;
    fcpubdata.area = $id("SKbillsheet");
    fcpubdata.area.unselectable = "on";
    fcpubdata.area.contentEditable = true

    //��ʱ��	
    var stmptable = ""
    if (isSpace(fcpubdata.area.runsave) == false) {
        stmptable = GetTmpTableStr();
        stmptable = "<![CDATA[" + TransSql(stmptable) + "]]>"
    }
    //�Զ��庯��
    var tmpfunc = pstrUserFunction
    //tmpfunc=TransXml(tmpfunc) ;
    tmpfunc = TransSql(repNewLine(repXml(tmpfunc)));
    tmpaddhtml = "<![CDATA[" + TransSql(tmpaddhtml) + "]]>"

    sRun = "<![CDATA[" + TransSql(sRun) + "]]>"




    if (fcpubdata.area.isfile != "��") {
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
    //��ʼҳ
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

    //��������򿪵��ļ�
    if (fcpubdata.area.isfile == "��") {
        ef_AddRecentFile("-1," + pdjFilePath + ",");
    } else {
        ef_AddRecentFile(curdjid + "," + fcpubdata.area.dj_sn + "," + fcpubdata.area.caption);
    }
    ef_RefreshRecentFile();

    //����iframe
    var preUrl = $urlParam("srcUser");
    if (IsSpace(preUrl) == false) {
        var isAlert = notalert == "����ʾ" ? "no" : "yes";
        new Eapi.Session().iframeRun("saveDjHtmId", preUrl + "?key=saveFromFc&djid=" + curdjid + "&djsn=" + fcpubdata.area.dj_sn + "&djtype=" + fcpubdata.area.type + "&isalert=" + isAlert, function() { });
    } else {
        //������ʽ���ļ�
        if (nothtml != "��") {
            var tmpNo = fcpubdata.area.dj_sn;

            //if(fcpubdata.area.isfile != "��") sAllHtml = "no empty" ;
            var sPos = genDjHtmlFile(sAllHtml, tmpNo, objBillType.path, objBillType.extname, fcpubdata.area.getAttribute("allBrowser"), function callback() { });
        }
        if (notalert != "����ʾ" && fcpubdata.area.isfile != "��") alert("����ɹ���");
    }
    blnChange = false;

    //�Զ���ؼ���36��ʼ
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
    �õ�Ҫ������ʱ��Ľ���
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
                if (ods.iscreatetable == "��") {
                    var sXml = ods.formatxml;
                    //�����ֶ���0 ��������1 �ֶ�����2 �ֶο��3 �ֶξ���4 
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
    * ȡ�������õ��ֶ���Ϣ, 2011-04-14
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

                        if (oXml.documentElement.childNodes(j).childNodes(13).text != "��") continue; //procvalid �ڵ�,��ֵ=�� ��ʾ���ֶ�Ϊ��������

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
�򿪱�
designtext�ֶ��а����Զ��庯�������ݣ�����������ҳ������ݡ�
�Զ��庯������������ǰ�档
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
    //�Զ��庯��+"</scr"+"ipt>"+����������+pstrSplitAddHtml+���ӱ�������
    if (typeof djid == "undefined") djid = 0
    if (typeof sRet == "object") { //e��ʱ��
        if (IsSpace(sRet[0]) == false) {
            fcpubdata.area.outerHTML = sRet[0];
            fcpubdata.area = $id("SKbillsheet");
        }
        //sRet[1] Ϊ�����д�
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
        //�� ����ҳ�洮
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
        //��sHtm���ǺϷ���HTM��ʱ����
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

    //����ؼ��б�
    openobjlist();
    ShowAllField();

    pageonload()

    if (IsSpace(fcpubdata.area.dj_sn) == false) {
        //����ҳҳǩ�ϼ��ϱ��⡣2012-12-24
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
�½���,isWizard ="��" ��ʾ����
*@date 2004-08-02
**/
function DesignDjNew(isWizard) {
    if (SaveTip() == true) return;
    if (isWizard == "��") {
        var sHtm = DjOpen('fcs_NewWizard', fcpubdata.area, 'չ��', "��ģʽ����", "ֱ��", "�½�����");
        if (typeof sHtm == "undefined") return;
    } else {
        var sHtm = "��";
    }
    if (sHtm == "��") {
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
        var sTitle = "�������";

        if (!setTabTitle(sTitle))
            ChangeWinTitle(sTitle);
        try {
            bigmain.focus();
            //	fcpubdata.area.focus();
        } catch (e) { }
    } else {
        //if( sHtm != "��"){
        fcpubdata.area.innerHTML = sHtm;
        //CopyToPub(sHtm)
    }
    if (TooContXml()) { openobjlist(); ShowAllField(); }

    if (IsSpace(sHtm) == false && sHtm != "��")
        blnChange = true;
    else
        blnChange = false;

}
/**
�����
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
����ǰ��ʾ
*@date 2004-08-05
**/
function SaveTip() {
    if (blnChange == false) return
    var ret = window.confirm("ȷ�����浱ǰ����");
    if (ret == true) {
        DesignDjSave();
    }

    return ret;
}

/**
�����ҵ���ǰ���пؼ��ĺ���
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
    //event.returnValue="�뿪��ǰҳ�潫���µ�ǰ��������ݶ�ʧ! �� [ȷ��] �򲻱������ݲ��رմ��ڡ�"
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
    //�������˴��ڿ��,��ʼ�������õĿ��ֵ,����Ϊ���ڵĿ��
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
ɾ��ocontxml��ֵ��ͬ�Ľڵ�
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
* �ɽ����ϵĿؼ� ==> oContXml 
*@return false ��ʾid�ظ�,û����ͬ������,
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
        //��û��controltype,��ʾ�ǾɵĿؼ�,��Ҫ����,2006-01-23 remove
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
            alert("ע��: " + sid + "�ظ�!���޸�.")
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
    //�����µ�tab��
    //fcpubdata.area.billtaborder = "" ; //���������
    fcpubdata.area.billtaborder = TaborderXml();
    return true
}
/**
* ����ƴ��ڵ��Ҽ��˵��ĵ���
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
*����TD��ѡ�е��ı�������
*@date 2005-08-22
**/
function SetSelTextProp() {
    var sRet = DjOpen('fcs_selprop', window, 'չ��', '��ģʽ����', 'ֱ��', '���õ�ǰѡ���ı�������');
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
