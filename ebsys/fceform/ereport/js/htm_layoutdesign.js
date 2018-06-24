var oDom = SetDom("<record><name></name><chnname></chnname><isprintfile></isprintfile><querytype></querytype><classtable></classtable><styletable></styletable><isrunebiao></isrunebiao><isfixrowcol></isfixrowcol><showheight></showheight><tablestr></tablestr><viewtype></viewtype></record>"); //fhj2013-08-09添加了视图类型
var layoutObj = {
    oXml: oDom,
    //oTableXml: null,
    layoutId: "", // layoutId
    name: parent.Request.QueryString('layoutName').toString(), //layout英文名
    // chnname: "", //layout中文名

    dsXml: "", //数据集的xml串
    oDsXml: null,
    sqlType: "电脑", //sql语句的类型
    options: new Sys.StringBuilder(), //字段的options串
    saveXmlSql: "",
    saveXml: new Sys.StringBuilder(), //fhj2013-03-27布局模板的xml串
    arrTable: new Array(),
    isSaveFile: "",
    genDs: true  //选中的业务表，生成数据集
}


/**
*新建布局模版
**/

function newLayout() {
    if (isNotDesign() == "no") return;
    layoutObj.oXml = oDom;
    layoutObj.dsXml = "";
    layoutObj.name = "";
    layoutObj.oDsXml = null;
    layoutObj.sqlType = "电脑";
    layoutObj.options = new Sys.StringBuilder();
    layoutObj.saveXmlSql = "";
    layoutObj.layoutId = "";
    layoutObj.arrTable = new Array();
    leftWin.cboField.innerHTML = "";
    leftWin.cboField.outerHTML = SelectAddOption(leftWin.cboField, layoutObj.options.toString());
    ebiaoWin.$id('t').outerHTML = '<TABLE style=" POSITION: absolute;  BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed;  FONT-SIZE: 13px;  TOP: 0px; LEFT: 0px" id=t border=1 cellSpacing=0 cellPadding=0 frame=box e_page_style="1" e_page_orientation="1" e_page_size="4" e_paper_margin_bottom="8" e_paper_margin_right="8" e_paper_margin_top="8" e_paper_margin_left="8"><COLGROUP><COL style="WIDTH: 70px"><COL style="WIDTH: 70px"><COL style="WIDTH: 70px"><COL style="WIDTH: 70px"><TBODY><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR><TR style="HEIGHT: 18px"><TD></TD><TD></TD><TD></TD><TD></TD></TR></TBODY></TABLE>';
    ebiaoWin.eval("LoadReportInit()");
    //parent.lblTitle.innerText = "布局设计器";
    //在主页页签上加上标题。2012-12-24
    if (!setTabTitle("布局设计器")) {
        ChangeWinTitle("布局设计器");
    }

}


/**
* 从数据库或文件中打开布局模板
**/
//数据库/文件，给定布局模版名/选择布局模版名
function loadLayoutDbSel() {
    var layoutName = DjOpen('../../fceform/common/djframe.htm?djsn=zk_ds_open_layout&djtype=ZK', '', "展现");
    if (IsSpace(layoutName) == false) {
        loadLayoutDb(layoutName);
    }

}




function loadLayoutDb(name) {
    //根据name执行SQL，得到 oXml oTableXml
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
    oXml = SetDom(oXml.documentElement.childNodes[0].xml); //节点中没有documentElement元素
    layoutObj.oXml = oXml;
    layoutObj.name = name;
    loadLayout(tableXml);
    layoutObj.isSaveFile = 0;
}
function loadLayoutFileSel() {
    var sPath = '/zk/layoutfile';
    var sRet = DjOpen('../../fceform/common/djframe.htm?djsn=getUrl&djtype=ZK', [sPath, 'file', 'yes', 'xml'], '展现', '有模式窗口', '直接', '选择文件');
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


function loadLayout(tableXml) {//fhj201-04-27装载布局文件信息
    if (layoutObj.oXml.documentElement.selectSingleNode("/record/layoutid") != null) {
        layoutObj.layoutId = layoutObj.oXml.documentElement.selectSingleNode("/record/layoutid").text; //id字段
    }
    ebiaoWin.$id('t').outerHTML = tableXml;
    layoutObj.oDsXml = SetDom(unescape(ebiaoWin.$id('t').dsXml));
    layoutObj.sqlType = layoutObj.oXml.documentElement.selectSingleNode("/record/querytype").text; //查询类型
    genOptions();
    leftWin.cboField.innerHTML = "";
    leftWin.cboField.outerHTML = SelectAddOption(leftWin.cboField, layoutObj.options.toString());
    ebiaoWin.eval("LoadReportInit()");
    //parent.lblTitle.innerText = "布局设计器 -- " + layoutObj.layoutPreObj[0];
    if (IsSpace(layoutObj.name) == false) {
        //在主页页签上加上标题。2012-12-24
        if (!setTabTitle(layoutObj.name)) {
            ChangeWinTitle(layoutObj.name);
        }
    }
}






/**
*设置布局模板属性
**/

function setLayoutProperty() {
    if (isNotDesign() == "no") return;
    var ret = DjOpen("../../fceform/common/djframe.htm?djsn=zk_layout_perproty&djtype=ZK", [layoutObj, ebiaoWin.$id('t')], "展现");
    if (isSpace(ret) == false) {
        layoutObj.oXml = ret;
        if (layoutObj.oXml.documentElement.childNodes.length > 1) {
            ebiaoWin.$id('t').chnName = layoutObj.oXml.documentElement.selectSingleNode("/record/chnname").text;
            //ebiaoWin.$id('t').toolbarPermit = layoutObj.layoutPreObj[8];
        }
    }
}




/**
*选择设计布局模板时用到的表名
**/

function selectLayoutTable() {
    if (isNotDesign() == "no") return;
    var ret = DjOpen("../../fceform/common/djframe.htm?djsn=zk_layout_table&djtype=ZK", [layoutObj.oDsXml, layoutObj.sqlType], "展现");
    if (ret == undefined) return;
    layoutObj.oDsXml = SetDom(ret[0]);
    checkGenDS(layoutObj.oDsXml); //检查不生成数据集和不运行e表是否设置正确
    ebiaoWin.$id('t').dsXml = escape(layoutObj.oDsXml.documentElement.xml);
    layoutObj.sqlType = ret[1];
    layoutObj.options = new Sys.StringBuilder();
    genOptions();
    leftWin.cboField.innerHTML = "";
    leftWin.cboField.outerHTML = SelectAddOption(leftWin.cboField, layoutObj.options.toString());
}

//检查是不是有不生成数据集的表

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
*通过从数据集的xml串中获取的字段名来生成fc_layoutsub表的insert语句
**/

function genSaveSql() {
    if (IsSpace(layoutObj.oDsXml) == true || IsSpace(layoutObj.oDsXml.documentElement)) return;
    for (var i = 0; i < layoutObj.oDsXml.documentElement.childNodes.length - 1; i++) {
        var tbName = layoutObj.oDsXml.documentElement.childNodes[i].childNodes[0].text;
        if (tbName != "") {
            if (layoutObj.isSaveFile != 1) {//没选择保存到文件就保存到数据库
                layoutObj.saveXmlSql += "<insert tableName='fc_layoutsub'><names> layoutid,tbname,type,recrows,dsProps,xmlProps </names><values>'" + layoutObj.layoutId + "','" + tbName + "','" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[2].text + "','" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[3].text + "','" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[4].text + "','" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[5].xml + "'</values></insert>";
            } else { //生成xml文件格式
                var head = "";
                if (i == 0) head = "<tables>";
                layoutObj.saveXml.append(head + "<table>");
                layoutObj.saveXml.append("<tbname>" + tbName + "</tbname> <type>" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[2].text + "</type><recRows>" + layoutObj.oDsXml.documentElement.childNodes[i].childNodes[3].text + "</recRows><dsProps>" + RepXml(layoutObj.oDsXml.documentElement.childNodes[i].childNodes[4].text) + "</dsProps><xmlProps>" + RepXml(layoutObj.oDsXml.documentElement.childNodes[i].childNodes[5].xml) + "</xmlProps></table>");
                if (i + 1 == layoutObj.oDsXml.documentElement.childNodes.length - 1) layoutObj.saveXml.append("</tables>"); //结束添加</tables>
            }
        }
    }

}

/**
*通过从数据集的xml串中获取的表名和字段名来生成布局模板左侧的commonbox 的options串
**/

function genOptions() {
    layoutObj.options = new Sys.StringBuilder(); //清空options串
    if (IsSpace(layoutObj.oDsXml.documentElement) == true) return;
    for (var i = 0; i < layoutObj.oDsXml.documentElement.childNodes.length - 1; i++) {
        var tbName = layoutObj.oDsXml.documentElement.childNodes[i].childNodes[0].text;
        var tbChnName = layoutObj.oDsXml.documentElement.childNodes[i].childNodes[1].text;
        if (tbName != "") {
            var tableObj = new Eapi.Layout().getQueryInfoFields(tbName, layoutObj.sqlType); //fhj 2012-16 避免多次调用getQueryInfoFields方法
            if (IsSpace(tableObj) == true) return;
            layoutObj.arrTable[tbName] = tableObj;
            fieldOptions(tbName, tbChnName, tableObj);
        }
    }
}

/**
*获取字段的options串
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
*保存布局模板	
* isAlert != "否" 时，保存e表文件时提示
**/

function saveLayoutModule(isAlert) {
    if (isNotDesign() == "no") return;
    ebiaoWin.eval("saveBeforeAction()");
    if (layoutObj.oDsXml != null) checkGenDS(layoutObj.oDsXml);
    if (IsSpace(layoutObj.name)) {
        alert("模版名不能为空，请到模版属性窗口输入模版名");
        setLayoutProperty();
        return;
    }

    if (layoutObj.genDs == false && layoutObj.oXml.documentElement.selectSingleNode("/record/isrunebiao").text != "3") { //检查选择表不生成数据集和运行方式是不是，不运行e表
        alert("在选择表的界面中，选择了不生成数据集，则在布局模版属性窗口中只能设置不运行e表");
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
    if (IsSpace(className) == false) ebiaoWin.document.getElementById('t').className = className; //给布局模版中id为t的table添加class
    if (IsSpace(styletable) == false) ebiaoWin.$id('t').style.cssText = " BORDER-BOTTOM: 1px solid; POSITION: absolute; BORDER-LEFT: 1px solid; MARGIN-TOP: 0px; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; MARGIN-LEFT: 0px;  BORDER-TOP: 1px solid; TOP: 0px; BORDER-RIGHT: 0px solid; LEFT: 0px" + styletable; //给布局模版id为t的table添加style

    if (layoutObj.isSaveFile != 1) {//没选择保存到文件就保存到数据库
        var paramNameOrXml = "'<![CDATA[" + TransSql(ebiaoWin.$id('t').outerHTML) + "]]> '";
        var paramValue = "<params><param name='clob1' dataType='字符串'> <![CDATA[" + ebiaoWin.$id('t').outerHTML + "]]> </param></params>"

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
                alert("模板名重名，请修改");
                setLayoutProperty();
                return;
            }
            layoutObj.layoutId = getMaxNo('LAY');
            layoutObj.saveXmlSql = "<insert tableName='fc_layout'><names> layoutid,name,chnname,isPrintFile,isRunEbiao,tableStr,querytype,classTable,styleTable ,showHeight,isFixRowCol,deleteMark,viewType </names><values>'" + layoutObj.layoutId + "','" + layoutObj.name + "','" + chnname + "','" + isPrintFile + "','" + isRunEbiao + "'," + paramNameOrXml + ",'" + layoutObj.sqlType + "','" + className + "','" + styletable + "'," + showHeight + ",'" + isFixRowCol + "',0,'" + viewType + "'</values> " + paramValue + "</insert>";
        } else {
            layoutObj.saveXmlSql = "<update tableName='fc_layout'><set>name='" + layoutObj.name + "',chnname='" + chnname + "',isPrintFile='" + isPrintFile + "',isRunEbiao='" + isRunEbiao + "',tableStr=" + paramNameOrXml + ",querytype='" + layoutObj.sqlType + "',classTable='" + className + "',styleTable='" + styletable + "',showHeight='" + showHeight + "',isFixRowCol='" + isFixRowCol + "',viewType ='" + viewType + "' </set><where> layoutid = '" + layoutObj.layoutId + "'</where> " + paramValue + " </update>";
            layoutObj.saveXmlSql += "<delete tableName='fc_layoutsub' ><where>  layoutid= '" + layoutObj.layoutId + "'</where></delete>";
        }
    } else { //保存到zk\layoutfile目录下
        layoutObj.saveXml = new Sys.StringBuilder();
        layoutObj.saveXml.append('<?xml version="1.0" encoding="gb2312"?>');
        layoutObj.saveXml.append("<record><name>" + layoutObj.name + "</name><chnname>" + chnname + "</chnname><isprintfile>" + isPrintFile + "</isprintfile><querytype>" + layoutObj.sqlType + "</querytype><classtable>" + className + "</classtable><styletable>" + RepXml(styletable) + "</styletable><isrunebiao>" + isRunEbiao + "</isrunebiao><isfixrowcol>" + isFixRowCol + "</isfixrowcol><showheight>" + showHeight + "</showheight> <viewtype>" + viewType + "</viewtype>");

    }
    genSaveSql(); //添加业务表的生成数据集等信息	                  

    var layoutGrid = ebiaoWin.$id('t');
    if (isRunEbiao == "3") { //不运行e表时要计算表格的宽度
        layoutGrid.style.width = layoutGrid.clientWidth + "px";
    }
    if (layoutObj.isSaveFile != 1) {
        doSaveData(layoutObj.saveXmlSql, function() { //保存成功后，有要生成打印的文件就保存
            if (isPrintFile == '1') {
                /*var bak = ebiaoWin.$id('t').outerHTML;
                delTitle();
                ebiaoWin.eval("SaveReportFile(parent.layoutObj.layoutPreObj[0], 'yes', 'yes', 'layout','" + isAlert + "')");
                ebiaoWin.$id('t').outerHTML = bak;
                ebiaoWin.eval("LoadReportInit()");*/
                saveLayoutAfter(isAlert)
            } else {
                alert("保存成功");
            }
        });
    } else {
        layoutObj.saveXml.append("<tablestr><![CDATA[" + ebiaoWin.$id('t').outerHTML + "]]></tablestr></record>"); //给xml文件中添加e表的table
        var filePath = "<file>" + "/zk/layoutfile/" + layoutObj.name + ".xml</file>";
        var sxml = filePath + "<text>" + RepXml(layoutObj.saveXml.toString()) + "</text>"
        var ret = savedesignhtml(sxml)
        if (ret == "") {
            if (isPrintFile == '1') {
                saveLayoutAfter(isAlert)
            } else {
                alert("文件保存成功");
            }
        } else { alert(ret) }

    }
    //parent.lblTitle.innerText = "布局设计器 -- " + layoutObj.layoutPreObj[0];
    if (IsSpace(layoutObj.name) == false) {
        //在主页页签上加上标题。2012-12-24
        if (!setTabTitle(layoutObj.name)) {
            ChangeWinTitle(layoutObj.name);
        }
    }
    if (isPrintFile != '1') ebiaoWin.eval("LoadReportInit()");
}

function saveLayoutAfter(isAlert) {//保存布局文件之后是否生成共打印用的报表
    var bak = ebiaoWin.$id('t').outerHTML;
    delTitle();
    ebiaoWin.eval("SaveReportFile(parent.layoutObj.name, 'yes', 'yes', 'layout','" + isAlert + "')");
    ebiaoWin.$id('t').outerHTML = bak;
    ebiaoWin.eval("LoadReportInit()");
}

/**
**清除单元格上的title属性
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
**运行布局模版中的报表文件
**/
function runMoudleReport() {
    if (isNotDesign() == "no") return;
    if (layoutObj.oXml.documentElement.selectSingleNode("/record/isprintfile").text != '1') {
        alert("在布局模版属性窗口中，没有选中是否生成供打印用的报表");
        //setLayoutProperty();
        return;
    }
    var ret = saveLayoutModule("否");
    if (ret == false) return; //如果保存报表文件出错就返回
    window.open(fcpubdata.path + "/fceform/ereport/ebrun.htm?file=" + layoutObj.name + "&fromdb=yes");
}


/**
*检查是否为设计状态
**/
function isNotDesign() {
    if (ebiaoWin.$id("txtEdit") != null && ebiaoWin.$id('txtEdit').style.display == "none") {
        alert("只有在设计状态下才有此功能!请点下面的设计按钮切换到设计状态后再试!");
        return "no";
    }
}



/**
*添加单元格中的标识
**/
function addProperty() {//增加功按钮id
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
    t += arr[0] + "(" + arr[2] + ")." + arr[1] + "(" + arr[3] + ")"; //title属性
    } else {
    t = currentTd.title;
    }*/
    if (IsSpace(layoutObj.options) == true) {
        alert("先单击选择表图标，选择表名");
        return;
    }
    //var ret = DjOpen("../../fceform/common/djframe.htm?djsn=zk_add_td_label&djtype=ZK", [currentTd.contType, idOrLabel, currentTd.funcType, currentTd.funcExp, currentTd.roleXml, currentTd.isModalWin, currentTd.refreshType, layoutObj.options, currentTd.title, layoutObj.oDsXml], "展现");
    var ret = DjOpen("../../fceform/common/djframe.htm?djsn=zk_add_td_label&djtype=ZK", [currentTd, idOrLabel, layoutObj.options, layoutObj.oDsXml], "展现");
    if (ret == undefined) return;
    delProperty(); //清除所以属性
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
    if (ret[2] == 'other') currentTd.funcExp = ret[3]; //如果是其它选择自定义函数
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
*清除单元格的属性和单元格txtEdit控件的值
**/
function delAll() {
    //ebiaoWin.$id('txtEdit').value = "";
    delProperty();
}

/**
*删除添加到e表设计器单元格的属性和背景图
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
*检查非法字段bad
**/
function checkBadField() {
    if (isNotDesign() == "no") return;
    var tab = true;
    if (leftWin.cboField.length < 1) return;
    var layoutGrid = ebiaoWin.$id('t');

    for (var i = 0; i < layoutGrid.rows.length; i++) {
        for (var ii = 0; ii < layoutGrid.rows(i).cells.length; ii++) {
            tab = true; //检查完一个单元格后，把标记恢复到检查前的状态
            if (layoutGrid.rows(i).cells(ii).title != "") {
                var tableName = layoutGrid.rows(i).cells(ii).tableName;
                if (IsSpace(layoutObj.arrTable[tableName]) == true) {//表名错误
                    tab = false;
                } else {//表名正确，检查字段名
                    if (checkFeild(tableName, layoutGrid.rows(i).cells(ii).fieldName) == false) tab = false; //false表示字段名错误   
                }
            }
            if (tab == false) {//错误处理
                layoutGrid.rows(i).cells(ii).style.backgroundRepeat = "no-repeat";
                layoutGrid.rows(i).cells(ii).style.backgroundPosition = "right";
                layoutGrid.rows(i).cells(ii).style.backgroundImage = "url(../ereport/images/field_valid.gif)";
            }

        }
    }
}


function checkFeild(tbName, fdName) {//返回false表示在字段列表中不存在
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
*快速生成布局模板
**/
function quickLayoutModle() {
    if (isNotDesign() == "no") return;
    if (layoutObj.name != "") newLayout();
    var ret = DjOpen("../../fceform/common/djframe.htm?djsn=zk_quick_layout_property&djtype=ZK", "", "展现");
    if (IsSpace(ret) == true) return;
    layoutObj.options = new Sys.StringBuilder();
    layoutObj.sqlType = ret[2];
    var retObj = new Eapi.Layout().genTableString(ret[0], ret[1], ret[2], ret[3], ret[4], ret[5], ret[6], ret[7]);
    if (IsSpace(retObj) == true) return;

    ebiaoWin.$id('t').outerHTML = retObj[0];
    layoutObj.arrTable[ret[0]] = retObj[1];
    var dsXml1 = '<root><tr rowstate="add"><td>' + ret[0] + '</td><td>' + ret[1] + '</td><td>1</td><td>0</td><td>opensortno="1" submittype="1" submitno="1" issubds="0" isSubGrid="0" datasourceName="" isaddemptyrec="0" async="0" </td><td></td><td>表单上要生成本数据集</td><td></td><td>0</td></tr><set><pages>0</pages><fields><field><fieldname>tbname</fieldname><datatype>字符</datatype><displaylabel>表名</displaylabel><size>50</size><precision></precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target></target><href></href><visible>是</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>tbchnname</fieldname><datatype>字符</datatype><displaylabel>表中文名</displaylabel><size>50</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target></target><href></href><visible>是</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>type</fieldname><datatype>整数</datatype><displaylabel>类型</displaylabel><size>4</size><precision></precision><fieldkind>数据项</fieldkind><defaultvalue>1</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target></target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>rows</fieldname><datatype>整数</datatype><displaylabel>一条记录所占行数</displaylabel><size>4</size><precision></precision><fieldkind>数据项</fieldkind><defaultvalue>0</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target></target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>dsProps</fieldname><datatype>字符</datatype><displaylabel>数据集设置</displaylabel><size>6000</size><precision></precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target></target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>xmlProps</fieldname><datatype>字符</datatype><displaylabel>多字段作主键设置</displaylabel><size>1000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target></target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>type1</fieldname><datatype>字符</datatype><displaylabel>类型</displaylabel><size>50</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>表单上要生成本数据集</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target></target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>fdname</fieldname><datatype>字符</datatype><displaylabel>公共选择函数返回值要绑定数据集</displaylabel><size>30</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target></target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>isMuchKeyFields</fieldname><datatype>字符</datatype><displaylabel>是多字段主键字段</displaylabel><size>10</size><precision>0</precision><fieldkind>变量默认值</fieldkind><defaultvalue>0</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target></target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field></fields></set></root> ';
    layoutObj.oDsXml = SetDom(dsXml1);
    ebiaoWin.$id('t').dsXml = escape(dsXml1);
    leftWin.cboField.innerHTML = "";
    fieldOptions(ret[0], ret[1], retObj[1]);
    leftWin.cboField.outerHTML = SelectAddOption(leftWin.cboField, layoutObj.options.toString());
    ebiaoWin.eval("LoadReportInit()");
    //createLayoutModle(ret[0], ret[1], ret[2], ret[3], ret[4], ret[5], ret[6], ret[7]);
}


/**
*布局模版另存为
**/
function layoutDesignSaveAs() {
    if (isNotDesign() == "no") return;
    var sTitle = "请输入布局模板名称";
    var sRet = window.showModalDialog("input.htm?title=" + escape(sTitle), "", "status:no;dialogHeight:120px;dialogWidth:400px;dialogTop:180;dialogLeft:250px")
    if (typeof sRet == "undefined") return
    layoutObj.name = sRet
    layoutObj.layoutId = "";
    saveLayoutModule()
    //parent.lblTitle.innerText = "布局设计器 -- " + layoutObj.layoutPreObj[0];
    if (IsSpace(layoutObj.name) == false) {
        //在主页页签上加上标题。2012-12-24
        if (!setTabTitle(layoutObj.name)) {
            ChangeWinTitle(layoutObj.name);
        }
    }
}
function infoDivWidth() { //初始化div宽度
    $id("divDesign").style.width = (ToInt(document.body.clientWidth) - 235) + "px";
}
