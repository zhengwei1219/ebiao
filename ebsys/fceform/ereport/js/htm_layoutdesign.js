var oDom = SetDom("<record><name></name><chnname></chnname><isprintfile></isprintfile><querytype></querytype><classtable></classtable><styletable></styletable><isrunebiao></isrunebiao><isfixrowcol></isfixrowcol><showheight></showheight><tablestr></tablestr><viewtype></viewtype></record>"); //fhj2013-08-09�������ͼ����
var layoutObj = {
    oXml: oDom,
    //oTableXml: null,
    layoutId: "", // layoutId
    name: parent.Request.QueryString('layoutName').toString(), //layoutӢ����
    // chnname: "", //layout������

    dsXml: "", //���ݼ���xml��
    oDsXml: null,
    sqlType: "����", //sql��������
    options: new Sys.StringBuilder(), //�ֶε�options��
    saveXmlSql: "",
    saveXml: new Sys.StringBuilder(), //fhj2013-03-27����ģ���xml��
    arrTable: new Array(),
    isSaveFile: "",
    genDs: true  //ѡ�е�ҵ����������ݼ�
}


/**
*�½�����ģ��
**/

function newLayout() {
    if (isNotDesign() == "no") return;
    layoutObj.oXml = oDom;
    layoutObj.dsXml = "";
    layoutObj.name = "";
    layoutObj.oDsXml = null;
    layoutObj.sqlType = "����";
    layoutObj.options = new Sys.StringBuilder();
    layoutObj.saveXmlSql = "";
    layoutObj.layoutId = "";
    layoutObj.arrTable = new Array();
    leftWin.cboField.innerHTML = "";
    leftWin.cboField.outerHTML = SelectAddOption(leftWin.cboField, layoutObj.options.toString());
    ebiaoWin.$id('t').outerHTML = '<TABLE style=" POSITION: absolute;  BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed;  FONT-SIZE: 13px;  TOP: 0px; LEFT: 0px" id=t border=1 cellSpacing=0 cellPadding=0 frame=box e_page_style="1" e_page_orientation="1" e_page_size="4" e_paper_margin_bottom="8" e_paper_margin_right="8" e_paper_margin_top="8" e_paper_margin_left="8"><COLGROUP><COL style="WIDTH: 70px"><COL style="WIDTH: 70px"><COL style="WIDTH: 70px"><COL style="WIDTH: 70px"><TBODY><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR></TBODY></TABLE>';
    ebiaoWin.eval("LoadReportInit()");
    //parent.lblTitle.innerText = "���������";
    //����ҳҳǩ�ϼ��ϱ��⡣2012-12-24
    if (!setTabTitle("���������")) {
        ChangeWinTitle("���������");
    }

}


/**
* �����ݿ���ļ��д򿪲���ģ��
**/
//���ݿ�/�ļ�����������ģ����/ѡ�񲼾�ģ����
function loadLayoutDbSel() {
    var layoutName = DjOpen('../../fceform/common/djframe.htm?djsn=zk_ds_open_layout&djtype=ZK', '', "չ��");
    if (IsSpace(layoutName) == false) {
        loadLayoutDb(layoutName);
    }

}




function loadLayoutDb(name) {
    //����nameִ��SQL���õ� oXml oTableXml
    // var oXml = "";
    var tableXml = "";
    if (fcpubdata.databaseTypeName == "oracle") {
        //var sRet = loadClob("<no>tableStr</no><no>" + layoutName + "</no>")
    } else {
        tableXml = SqlToField("select tableStr from fc_layout where name='" + name + "'");

    }
    var sql = "select fc_layout.layoutid,name,chnname,isPrintFile,isRunEbiao,classTable,styleTable,querytype,isFixRowCol,showHeight,viewType  from fc_layout where deleteMark=0 and name='" + name + "'";
    var xmlRet = SelectSql(sql, 1, 1);
    var oXml = SetDom(xmlRet);
    if (oXml.documentElement == null) {
        alert(xmlRet);
        return;
    }
    oXml = SetDom(oXml.documentElement.childNodes[0].xml); //�ڵ���û��documentElementԪ��
    layoutObj.oXml = oXml;
    layoutObj.name = name;
    loadLayout(tableXml);
    layoutObj.isSaveFile = 0;
}
function loadLayoutFileSel() {
    var sPath = '/zk/layoutfile';
    var sRet = DjOpen('../../fceform/common/djframe.htm?djsn=getUrl&djtype=ZK', [sPath, 'file', 'yes', 'xml'], 'չ��', '��ģʽ����', 'ֱ��', 'ѡ���ļ�');
    if (IsSpace(sRet) == false) {
        sPath += sRet;
    }
    loadLayoutFile(sPath);
}

function loadLayoutFile(sPath) {
    var oXml = "";
    var tableXml = "";
    oXml = SetDomFile(sPath);
    if (oXml.documentElement == null) return;
    tableXml = oXml.documentElement.selectSingleNode("/record/tablestr").text;
    layoutObj.oXml = oXml;
    layoutObj.name = oXml.documentElement.selectSingleNode("/record/name").text; ;
    loadLayout(tableXml);
    layoutObj.isSaveFile = 1;
}


function loadLayout(tableXml) {//fhj201-04-27װ�ز����ļ���Ϣ
    if (layoutObj.oXml.documentElement.selectSingleNode("/record/layoutid") != null) {
        layoutObj.layoutId = layoutObj.oXml.documentElement.selectSingleNode("/record/layoutid").text; //id�ֶ�
    }
    ebiaoWin.$id('t').outerHTML = tableXml;
    layoutObj.oDsXml = SetDom(unescape(ebiaoWin.$id('t').dsXml));
    layoutObj.sqlType = layoutObj.oXml.documentElement.selectSingleNode("/record/querytype").text; //��ѯ����
    genOptions();
    leftWin.cboField.innerHTML = "";
    leftWin.cboField.outerHTML = SelectAddOption(leftWin.cboField, layoutObj.options.toString());
    ebiaoWin.eval("LoadReportInit()");
    //parent.lblTitle.innerText = "��������� -- " + layoutObj.layoutPreObj[0];
    if (IsSpace(layoutObj.name) == false) {
        //����ҳҳǩ�ϼ��ϱ��⡣2012-12-24
        if (!setTabTitle(layoutObj.name)) {
            ChangeWinTitle(layoutObj.name);
        }
    }
}






/**
*���ò���ģ������
**/

function setLayoutProperty() {
    if (isNotDesign() == "no") return;
    var ret = DjOpen("../../fceform/common/djframe.htm?djsn=zk_layout_perproty&djtype=ZK", [layoutObj, ebiaoWin.$id('t')], "չ��");
    if (isSpace(ret) == false) {
        layoutObj.oXml = ret;
        if (layoutObj.oXml.documentElement.childNodes.length > 1) {
            ebiaoWin.$id('t').chnName = layoutObj.oXml.documentElement.selectSingleNode("/record/chnname").text;
            //ebiaoWin.$id('t').toolbarPermit = layoutObj.layoutPreObj[8];
        }
    }
}




/**
*ѡ����Ʋ���ģ��ʱ�õ��ı���
**/

function selectLayoutTable() {
    if (isNotDesign() == "no") return;
    var ret = DjOpen("../../fceform/common/djframe.htm?djsn=zk_layout_table&djtype=ZK", [layoutObj.oDsXml, layoutObj.sqlType], "չ��");
    if (ret == undefined) return;
    layoutObj.oDsXml = SetDom(ret[0]);
    checkGenDS(layoutObj.oDsXml); //��鲻�������ݼ��Ͳ�����e���Ƿ�������ȷ
    ebiaoWin.$id('t').dsXml = escape(layoutObj.oDsXml.documentElement.xml);
    layoutObj.sqlType = ret[1];
    layoutObj.options = new Sys.StringBuilder();
    genOptions();
    leftWin.cboField.innerHTML = "";
    leftWin.cboField.outerHTML = SelectAddOption(leftWin.cboField, layoutObj.options.toString());
}

//����ǲ����в��������ݼ��ı�

function checkGenDS(oDom) {
    if (oDom.documentElement == null) return;
    var l = oDom.documentElement.childNodes.length - 1;
    for (var i = 0; i < l; i++) {
        if (oDom.documentElement.childNodes[i].childNodes[2].text == 3) {
            layoutObj.genDs = false;
            return;
        }
    }
    return;
}
/**
*ͨ�������ݼ���xml���л�ȡ���ֶ���������fc_layoutsub���insert���
**/

function genSaveSql() {
    if (IsSpace(layoutObj.oDsXml) == true || IsSpace(layoutObj.oDsXml.documentElement)) return;
    for (var i = 0; i < layoutObj.oDsXml.documentElement.childNodes.length - 1; i++) {
        var tbName = layoutObj.oDsXml.documentElement.childNodes[i].childNodes[0].text;
        if (tbName != "") {
            if (layoutObj.isSaveFile != 1) {//ûѡ�񱣴浽�ļ��ͱ��浽���ݿ�
                layoutObj.saveXmlSql += "<insert tableName='fc_layoutsub'><names> layoutid,tbname,type,recrows,dsProps,xmlProps </names><values>'" + layoutObj.layoutId + "','" + tbName + "','" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[2].text + "','" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[3].text + "','" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[4].text + "','" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[5].xml + "'</values></insert>";
            } else { //����xml�ļ���ʽ
                var head = "";
                if (i == 0) head = "<tables>";
                layoutObj.saveXml.append(head + "<table>");
                layoutObj.saveXml.append("<tbname>" + tbName + "</tbname> <type>" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[2].text + "</type><recRows>" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[3].text + "</recRows><dsProps>" + RepXml(layoutObj.oDsXml.documentElement.childNodes[i].childNodes[4].text) + "</dsProps><xmlProps>" + RepXml(layoutObj.oDsXml.documentElement.childNodes[i].childNodes[5].xml) + "</xmlProps></table>");
                if (i + 1 == layoutObj.oDsXml.documentElement.childNodes.length - 1) layoutObj.saveXml.append("</tables>"); //�������</tables>
            }
        }
    }

}

/**
*ͨ�������ݼ���xml���л�ȡ�ı������ֶ��������ɲ���ģ������commonbox ��options��
**/

function genOptions() {
    layoutObj.options = new Sys.StringBuilder(); //���options��
    if (IsSpace(layoutObj.oDsXml.documentElement) == true) return;
    for (var i = 0; i < layoutObj.oDsXml.documentElement.childNodes.length - 1; i++) {
        var tbName = layoutObj.oDsXml.documentElement.childNodes[i].childNodes[0].text;
        var tbChnName = layoutObj.oDsXml.documentElement.childNodes[i].childNodes[1].text;
        if (tbName != "") {
            var tableObj = new Eapi.Layout().getQueryInfoFields(tbName, layoutObj.sqlType); //fhj 2012-16 �����ε���getQueryInfoFields����
            if (IsSpace(tableObj) == true) return;
            layoutObj.arrTable[tbName] = tableObj;
            fieldOptions(tbName, tbChnName, tableObj);
        }
    }
}

/**
*��ȡ�ֶε�options��
**/

function fieldOptions(tbName, tbChnName, tableObj) {
    // var retObj = getQueryInfoFields(tbName, sqlType);
    // if(IsSpace(retObj) == true) return;
    // layoutObj.arrTable[tbName] = retObj;
    layoutObj.options.append("<OPTGROUP  LABEL=" + tbChnName + ">");
    for (var i = 0; i < tableObj.fields.length; i++) {
        layoutObj.options.append("<OPTION style='font-weight: bold; color: #808080;' value=" + tbName + "." + tableObj.fields[i].fieldNameNew + "." + tbChnName + "." + tableObj.fields[i].fieldChnName + ">" + tableObj.fields[i].fieldChnName + "</OPTION>");
        layoutObj.options.append("<OPTION  value=" + tbName + "." + tableObj.fields[i].fieldNameNew + "." + tbChnName + "." + tableObj.fields[i].fieldChnName + ">" + tableObj.fields[i].fieldChnName + "</OPTION>");
    }
}

/**
*���沼��ģ��	
* isAlert != "��" ʱ������e���ļ�ʱ��ʾ
**/

function saveLayoutModule(isAlert) {
    if (isNotDesign() == "no") return;
    ebiaoWin.eval("saveBeforeAction()");
    if (layoutObj.oDsXml != null) checkGenDS(layoutObj.oDsXml);
    if (IsSpace(layoutObj.name)) {
        alert("ģ��������Ϊ�գ��뵽ģ�����Դ�������ģ����");
        setLayoutProperty();
        return;
    }

    if (layoutObj.genDs == false && layoutObj.oXml.documentElement.selectSingleNode("/record/isrunebiao").text != "3") { //���ѡ����������ݼ������з�ʽ�ǲ��ǣ�������e��
        alert("��ѡ���Ľ����У�ѡ���˲��������ݼ������ڲ���ģ�����Դ�����ֻ�����ò�����e��");
        return;
    }
    var chnname = layoutObj.oXml.documentElement.selectSingleNode("/record/chnname").text;
    var className = layoutObj.oXml.documentElement.selectSingleNode("/record/classtable").text;
    var styletable = layoutObj.oXml.documentElement.selectSingleNode("/record/styletable").text;
    var isPrintFile = layoutObj.oXml.documentElement.selectSingleNode("/record/isprintfile").text;
    var isRunEbiao = layoutObj.oXml.documentElement.selectSingleNode("/record/isrunebiao").text;
    var showHeight = layoutObj.oXml.documentElement.selectSingleNode("/record/showheight").text;
    var isFixRowCol = layoutObj.oXml.documentElement.selectSingleNode("/record/isfixrowcol").text;
    var viewType = layoutObj.oXml.documentElement.selectSingleNode("/record/viewtype").text;
    if (IsSpace(className) == false) ebiaoWin.document.getElementById('t').className = className; //������ģ����idΪt��table���class
    if (IsSpace(styletable) == false) ebiaoWin.$id('t').style.cssText = " BORDER-BOTTOM: 1px solid; POSITION: absolute; BORDER-LEFT: 1px solid; MARGIN-TOP: 0px; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; MARGIN-LEFT: 0px;  BORDER-TOP: 1px solid; TOP: 0px; BORDER-RIGHT: 0px solid; LEFT: 0px" + styletable; //������ģ��idΪt��table���style

    if (layoutObj.isSaveFile != 1) {//ûѡ�񱣴浽�ļ��ͱ��浽���ݿ�
        var paramNameOrXml = "'<![CDATA[" + TransSql(ebiaoWin.$id('t').outerHTML) + "]]> '";
        var paramValue = "<params><param name='clob1' dataType='�ַ���'> <![CDATA[" + ebiaoWin.$id('t').outerHTML + "]]> </param></params>"

        if (fcpubdata.databaseTypeName == "oracle") {
            if ((fcpubdata.dotnetVersion == ".aspx" && fcpubdata.isOleDb == "yes") || fcpubdata.dotnetVersion == "") {
                paramNameOrXml = "?";
            } else {
                paramNameOrXml = ":clob1";
            }
        } else {
            paramValue = "";
        }

        layoutObj.saveXmlSql = "";
        if (layoutObj.layoutId == "") {
            var moduleName = SqlToField("select name from fc_layout  where name ='" + layoutObj.name + "'");
            if (IsSpace(moduleName) == false) {
                alert("ģ�������������޸�");
                setLayoutProperty();
                return;
            }
            layoutObj.layoutId = getMaxNo('LAY');
            layoutObj.saveXmlSql = "<insert tableName='fc_layout'><names> layoutid,name,chnname,isPrintFile,isRunEbiao,tableStr,querytype,classTable,styleTable ,showHeight,isFixRowCol,deleteMark,viewType </names><values>'" + layoutObj.layoutId + "','" + layoutObj.name + "','" + chnname + "','" + isPrintFile + "','" + isRunEbiao + "'," + paramNameOrXml + ",'" + layoutObj.sqlType + "','" + className + "','" + styletable + "'," + showHeight + ",'" + isFixRowCol + "',0,'" + viewType + "'</values> " + paramValue + "</insert>";
        } else {
            layoutObj.saveXmlSql = "<update tableName='fc_layout'><set>name='" + layoutObj.name + "',chnname='" + chnname + "',isPrintFile='" + isPrintFile + "',isRunEbiao='" + isRunEbiao + "',tableStr=" + paramNameOrXml + ",querytype='" + layoutObj.sqlType + "',classTable='" + className + "',styleTable='" + styletable + "',showHeight='" + showHeight + "',isFixRowCol='" + isFixRowCol + "',viewType ='" + viewType + "' </set><where> layoutid = '" + layoutObj.layoutId + "'</where> " + paramValue + " </update>";
            layoutObj.saveXmlSql += "<delete tableName='fc_layoutsub' ><where>  layoutid= '" + layoutObj.layoutId + "'</where></delete>";
        }
    } else { //���浽zk\layoutfileĿ¼��
        layoutObj.saveXml = new Sys.StringBuilder();
        layoutObj.saveXml.append('<?xml version="1.0" encoding="gb2312"?>');
        layoutObj.saveXml.append("<record><name>" + layoutObj.name + "</name><chnname>" + chnname + "</chnname><isprintfile>" + isPrintFile + "</isprintfile><querytype>" + layoutObj.sqlType + "</querytype><classtable>" + className + "</classtable><styletable>" + RepXml(styletable) + "</styletable><isrunebiao>" + isRunEbiao + "</isrunebiao><isfixrowcol>" + isFixRowCol + "</isfixrowcol><showheight>" + showHeight + "</showheight> <viewtype>" + viewType + "</viewtype>");

    }
    genSaveSql(); //���ҵ�����������ݼ�����Ϣ	                  

    var layoutGrid = ebiaoWin.$id('t');
    if (isRunEbiao == "3") { //������e��ʱҪ������Ŀ��
        layoutGrid.style.width = layoutGrid.clientWidth + "px";
    }
    if (layoutObj.isSaveFile != 1) {
        doSaveData(layoutObj.saveXmlSql, function() { //����ɹ�����Ҫ���ɴ�ӡ���ļ��ͱ���
            if (isPrintFile == '1') {
                /*var bak = ebiaoWin.$id('t').outerHTML;
                delTitle();
                ebiaoWin.eval("SaveReportFile(parent.layoutObj.layoutPreObj[0], 'yes', 'yes', 'layout','" + isAlert + "')");
                ebiaoWin.$id('t').outerHTML = bak;
                ebiaoWin.eval("LoadReportInit()");*/
                saveLayoutAfter(isAlert)
            } else {
                alert("����ɹ�");
            }
        });
    } else {
        layoutObj.saveXml.append("<tablestr><![CDATA[" + ebiaoWin.$id('t').outerHTML + "]]></tablestr></record>"); //��xml�ļ������e���table
        var filePath = "<file>" + "/zk/layoutfile/" + layoutObj.name + ".xml</file>";
        var sxml = filePath + "<text>" + RepXml(layoutObj.saveXml.toString()) + "</text>"
        var ret = savedesignhtml(sxml)
        if (ret == "") {
            if (isPrintFile == '1') {
                saveLayoutAfter(isAlert)
            } else {
                alert("�ļ�����ɹ�");
            }
        } else { alert(ret) }

    }
    //parent.lblTitle.innerText = "��������� -- " + layoutObj.layoutPreObj[0];
    if (IsSpace(layoutObj.name) == false) {
        //����ҳҳǩ�ϼ��ϱ��⡣2012-12-24
        if (!setTabTitle(layoutObj.name)) {
            ChangeWinTitle(layoutObj.name);
        }
    }
    if (isPrintFile != '1') ebiaoWin.eval("LoadReportInit()");
}

function saveLayoutAfter(isAlert) {//���沼���ļ�֮���Ƿ����ɹ���ӡ�õı���
    var bak = ebiaoWin.$id('t').outerHTML;
    delTitle();
    ebiaoWin.eval("SaveReportFile(parent.layoutObj.name, 'yes', 'yes', 'layout','" + isAlert + "')");
    ebiaoWin.$id('t').outerHTML = bak;
    ebiaoWin.eval("LoadReportInit()");
}

/**
**�����Ԫ���ϵ�title����
**/
function delTitle() {
    if (isNotDesign() == "no") return;
    var layoutGrid = ebiaoWin.$id('t');
    for (var i = 0; i < layoutGrid.rows.length; i++) {
        for (var ii = 0; ii < layoutGrid.rows(i).cells.length; ii++) {
            if (IsSpace(layoutGrid.rows(i).cells[ii].title) == false) {
                layoutGrid.rows(i).cells[ii].removeAttribute("title");
            }
            if (IsSpace(layoutGrid.rows(i).cells[ii].id) == false) {
                layoutGrid.rows(i).cells[ii].removeAttribute("id");
            }
            if (IsSpace(layoutGrid.rows(i).cells[ii].style.backgroundImage) == false) {
                ClearCssPart(layoutGrid.rows(i).cells[ii], "backgroundImage", "background-image");
                ClearCssPart(layoutGrid.rows(i).cells[ii], "backgroundPosition", "background-position");
                ClearCssPart(layoutGrid.rows(i).cells[ii], "backgroundRepeat", "background-repeat");
            }
        }
    }
}



/**
**���в���ģ���еı����ļ�
**/
function runMoudleReport() {
    if (isNotDesign() == "no") return;
    if (layoutObj.oXml.documentElement.selectSingleNode("/record/isprintfile").text != '1') {
        alert("�ڲ���ģ�����Դ����У�û��ѡ���Ƿ����ɹ���ӡ�õı���");
        //setLayoutProperty();
        return;
    }
    var ret = saveLayoutModule("��");
    if (ret == false) return; //������汨���ļ�����ͷ���
    window.open(fcpubdata.path + "/fceform/ereport/ebrun.htm?file=" + layoutObj.name + "&fromdb=yes");
}


/**
*����Ƿ�Ϊ���״̬
**/
function isNotDesign() {
    if (ebiaoWin.$id("txtEdit") != null && ebiaoWin.$id('txtEdit').style.display == "none") {
        alert("ֻ�������״̬�²��д˹���!����������ư�ť�л������״̬������!");
        return "no";
    }
}



/**
*��ӵ�Ԫ���еı�ʶ
**/
function addProperty() {//���ӹ���ťid
    if (isNotDesign() == "no") return;
    var currentTd = ebiaoWin.SelObj.curTD.oTD;
    var idOrLabel = "";
    getTdProp(currentTd.contType);
    getTdProp(currentTd.controlId);
    getTdProp(currentTd.labelValue);
    if (currentTd.contType == "eform") {
        idOrLabel = currentTd.controlId;
    } else {
        idOrLabel = currentTd.labelValue;
    }
    getTdProp(currentTd.funcType);
    getTdProp(currentTd.funcExp);
    getTdProp(currentTd.title);
    /* var t = "";
    var arr = "";
    var selObj = leftWin.$id('cboField');
    if (selObj.selectedIndex > 0) {
    arr = selObj.options(selObj.selectedIndex).value.split('.');
    //currentTd.tableName = arr[0];
    //currentTd.fieldName = arr[1];
    t += arr[0] + "(" + arr[2] + ")." + arr[1] + "(" + arr[3] + ")"; //title����
    } else {
    t = currentTd.title;
    }*/
    if (IsSpace(layoutObj.options) == true) {
        alert("�ȵ���ѡ���ͼ�꣬ѡ�����");
        return;
    }
    //var ret = DjOpen("../../fceform/common/djframe.htm?djsn=zk_add_td_label&djtype=ZK", [currentTd.contType, idOrLabel, currentTd.funcType, currentTd.funcExp, currentTd.roleXml, currentTd.isModalWin, currentTd.refreshType, layoutObj.options, currentTd.title, layoutObj.oDsXml], "չ��");
    var ret = DjOpen("../../fceform/common/djframe.htm?djsn=zk_add_td_label&djtype=ZK", [currentTd, idOrLabel, layoutObj.options, layoutObj.oDsXml], "չ��");
    if (ret == undefined) return;
    delProperty(); //�����������
    /*if (IsSpace(arr) == false) {
    currentTd.tableName = arr[0];
    currentTd.fieldName = arr[1];
    currentTd.title = t;
    }*/
    currentTd.style.backgroundRepeat = "no-repeat";
    currentTd.style.backgroundImage = "url(../../fceform/ereport/images/ef_ebiao_button.gif)";
    currentTd.contType = ret[0];
    if (ret[0] == 'eform') {
        currentTd.controlId = ret[1];
    } else if (ret[0] == 'button' || ret[0] == 'href') {
        currentTd.labelValue = ret[1];
    }
    currentTd.funcType = ret[2];
    if (ret[2] == 'other') currentTd.funcExp = ret[3]; //���������ѡ���Զ��庯��
    if (IsSpace(ret[4]) != true) currentTd.roleXml = ret[4];
    if (IsSpace(ret[5]) != true) currentTd.isModalWin = ret[5];
    if (IsSpace(ret[6]) != true) currentTd.refreshType = ret[6];

    if (IsSpace(ret[7]) != true) {
        var arr = ret[7].split('.');
        currentTd.tableName = arr[0];
        currentTd.fieldName = arr[1];
        currentTd.title = ret[7];
    }
    ebiaoWin.eval("LoadReportInit()");
    function getTdProp(tdProp) {
        if (IsSpace(tdProp) == true) tdProp = "";
    }
}
/**
*�����Ԫ������Ժ͵�Ԫ��txtEdit�ؼ���ֵ
**/
function delAll() {
    //ebiaoWin.$id('txtEdit').value = "";
    delProperty();
}

/**
*ɾ����ӵ�e���������Ԫ������Ժͱ���ͼ
**/
function delProperty() {
    if (isNotDesign() == "no") return;
    var currentTd = ebiaoWin.SelObj.curTD.oTD;
    currentTd.removeAttribute("contType");
    currentTd.removeAttribute("title");
    currentTd.removeAttribute("tableName");
    currentTd.removeAttribute("fieldName");
    currentTd.removeAttribute("controlType");
    currentTd.removeAttribute("controlId");
    currentTd.removeAttribute("labelValue");
    currentTd.removeAttribute("controlFunType");
    currentTd.removeAttribute("controlFunName");
    currentTd.removeAttribute("id");
    currentTd.removeAttribute("isModalWin");
    currentTd.removeAttribute("roleXml");
    currentTd.removeAttribute("refreshType");
    ClearCssPart(currentTd, "backgroundImage", "background-image");
    ClearCssPart(currentTd, "backgroundPosition", "background-position");
    ClearCssPart(currentTd, "backgroundRepeat", "background-repeat");
    //currentTd.style.backgroundRepeat = "";
    //currentTd.style.backgroundImage = "";
    //currentTd.style.backgroundPosition = "";		        	        
}
/**
*���Ƿ��ֶ�bad
**/
function checkBadField() {
    if (isNotDesign() == "no") return;
    var tab = true;
    if (leftWin.cboField.length < 1) return;
    var layoutGrid = ebiaoWin.$id('t');

    for (var i = 0; i < layoutGrid.rows.length; i++) {
        for (var ii = 0; ii < layoutGrid.rows(i).cells.length; ii++) {
            tab = true; //�����һ����Ԫ��󣬰ѱ�ǻָ������ǰ��״̬
            if (layoutGrid.rows(i).cells(ii).title != "") {
                var tableName = layoutGrid.rows(i).cells(ii).tableName;
                if (IsSpace(layoutObj.arrTable[tableName]) == true) {//��������
                    tab = false;
                } else {//������ȷ������ֶ���
                    if (checkFeild(tableName, layoutGrid.rows(i).cells(ii).fieldName) == false) tab = false; //false��ʾ�ֶ�������   
                }
            }
            if (tab == false) {//������
                layoutGrid.rows(i).cells(ii).style.backgroundRepeat = "no-repeat";
                layoutGrid.rows(i).cells(ii).style.backgroundPosition = "right";
                layoutGrid.rows(i).cells(ii).style.backgroundImage = "url(../ereport/images/field_valid.gif)";
            }

        }
    }
}


function checkFeild(tbName, fdName) {//����false��ʾ���ֶ��б��в�����
    var ret = false;
    var fieldLen = layoutObj.arrTable[tbName].fields.length;
    for (var i = 0; i < fieldLen; i++) {
        if (fdName == layoutObj.arrTable[tbName].fields[i].fieldNameNew) {
            ret = true;
            break;
        }
    }
    return ret;
}

/**
*�������ɲ���ģ��
**/
function quickLayoutModle() {
    if (isNotDesign() == "no") return;
    if (layoutObj.name != "") newLayout();
    var ret = DjOpen("../../fceform/common/djframe.htm?djsn=zk_quick_layout_property&djtype=ZK", "", "չ��");
    if (IsSpace(ret) == true) return;
    layoutObj.options = new Sys.StringBuilder();
    layoutObj.sqlType = ret[2];
    var retObj = new Eapi.Layout().genTableString(ret[0], ret[1], ret[2], ret[3], ret[4], ret[5], ret[6], ret[7]);
    if (IsSpace(retObj) == true) return;

    ebiaoWin.$id('t').outerHTML = retObj[0];
    layoutObj.arrTable[ret[0]] = retObj[1];
    var dsXml1 = '<root><tr rowstate="add"><td>' + ret[0] + '</td><td>' + ret[1] + '</td><td>1</td><td>0</td><td>opensortno="1" submittype="1" submitno="1" issubds="0" isSubGrid="0" datasourceName="" isaddemptyrec="0" async="0" </td><td></td><td>����Ҫ���ɱ����ݼ�</td><td></td><td>0</td></tr><set><pages>0</pages><fields><field><fieldname>tbname</fieldname><datatype>�ַ�</datatype><displaylabel>����</displaylabel><size>50</size><precision></precision><fieldkind>������</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>��</isnull><iskey>��</iskey><valid>��</valid><procvalid>��</procvalid><link>��</link><target></target><href></href><visible>��</visible><primarykey>��</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>tbchnname</fieldname><datatype>�ַ�</datatype><displaylabel>��������</displaylabel><size>50</size><precision>0</precision><fieldkind>������</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>��</isnull><iskey>��</iskey><valid>��</valid><procvalid>��</procvalid><link>��</link><target></target><href></href><visible>��</visible><primarykey>��</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>type</fieldname><datatype>����</datatype><displaylabel>����</displaylabel><size>4</size><precision></precision><fieldkind>������</fieldkind><defaultvalue>1</defaultvalue><displayformat></displayformat><isnull>��</isnull><iskey>��</iskey><valid>��</valid><procvalid>��</procvalid><link>��</link><target></target><href></href><visible>��</visible><primarykey>��</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>rows</fieldname><datatype>����</datatype><displaylabel>һ����¼��ռ����</displaylabel><size>4</size><precision></precision><fieldkind>������</fieldkind><defaultvalue>0</defaultvalue><displayformat></displayformat><isnull>��</isnull><iskey>��</iskey><valid>��</valid><procvalid>��</procvalid><link>��</link><target></target><href></href><visible>��</visible><primarykey>��</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>dsProps</fieldname><datatype>�ַ�</datatype><displaylabel>���ݼ�����</displaylabel><size>6000</size><precision></precision><fieldkind>������</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>��</isnull><iskey>��</iskey><valid>��</valid><procvalid>��</procvalid><link>��</link><target></target><href></href><visible>��</visible><primarykey>��</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>xmlProps</fieldname><datatype>�ַ�</datatype><displaylabel>���ֶ�����������</displaylabel><size>1000</size><precision>0</precision><fieldkind>������</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>��</isnull><iskey>��</iskey><valid>��</valid><procvalid>��</procvalid><link>��</link><target></target><href></href><visible>��</visible><primarykey>��</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>type1</fieldname><datatype>�ַ�</datatype><displaylabel>����</displaylabel><size>50</size><precision>0</precision><fieldkind>������</fieldkind><defaultvalue>����Ҫ���ɱ����ݼ�</defaultvalue><displayformat></displayformat><isnull>��</isnull><iskey>��</iskey><valid>��</valid><procvalid>��</procvalid><link>��</link><target></target><href></href><visible>��</visible><primarykey>��</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>fdname</fieldname><datatype>�ַ�</datatype><displaylabel>����ѡ��������ֵҪ�����ݼ�</displaylabel><size>30</size><precision>0</precision><fieldkind>������</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>��</isnull><iskey>��</iskey><valid>��</valid><procvalid>��</procvalid><link>��</link><target></target><href></href><visible>��</visible><primarykey>��</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>isMuchKeyFields</fieldname><datatype>�ַ�</datatype><displaylabel>�Ƕ��ֶ������ֶ�</displaylabel><size>10</size><precision>0</precision><fieldkind>����Ĭ��ֵ</fieldkind><defaultvalue>0</defaultvalue><displayformat></displayformat><isnull>��</isnull><iskey>��</iskey><valid>��</valid><procvalid>��</procvalid><link>��</link><target></target><href></href><visible>��</visible><primarykey>��</primarykey><fieldvalid></fieldvalid><tag></tag></field></fields></set></root> ';
    layoutObj.oDsXml = SetDom(dsXml1);
    ebiaoWin.$id('t').dsXml = escape(dsXml1);
    leftWin.cboField.innerHTML = "";
    fieldOptions(ret[0], ret[1], retObj[1]);
    leftWin.cboField.outerHTML = SelectAddOption(leftWin.cboField, layoutObj.options.toString());
    ebiaoWin.eval("LoadReportInit()");
    //createLayoutModle(ret[0], ret[1], ret[2], ret[3], ret[4], ret[5], ret[6], ret[7]);
}


/**
*����ģ�����Ϊ
**/
function layoutDesignSaveAs() {
    if (isNotDesign() == "no") return;
    var sTitle = "�����벼��ģ������";
    var sRet = window.showModalDialog("input.htm?title=" + escape(sTitle), "", "status:no;dialogHeight:120px;dialogWidth:400px;dialogTop:180;dialogLeft:250px")
    if (typeof sRet == "undefined") return
    layoutObj.name = sRet
    layoutObj.layoutId = "";
    saveLayoutModule()
    //parent.lblTitle.innerText = "��������� -- " + layoutObj.layoutPreObj[0];
    if (IsSpace(layoutObj.name) == false) {
        //����ҳҳǩ�ϼ��ϱ��⡣2012-12-24
        if (!setTabTitle(layoutObj.name)) {
            ChangeWinTitle(layoutObj.name);
        }
    }
}
function infoDivWidth() { //��ʼ��div���
    $id("divDesign").style.width = (ToInt(document.body.clientWidth) - 235) + "px";
}
