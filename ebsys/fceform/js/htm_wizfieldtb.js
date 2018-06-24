var WizardConfig = {
    tbname: null,
    fdchnname: "字段1",

    type: null,  //表的类型(文本，日期时间。。。。)
    helpText: null,
    isNull: null,
    isRepeat: null,
    width: null,
    height: null,
    defaultExp: null, //公式默认值
    queryExp: null, // 作查询条件时的公式默认值
    oldtype: null,
    fdname: "field1",
    oldFdname: null,
    oldDataType: null,
    dataType: null, //数据库中的字段数据类型
    oldLen: null,
    oldDotLen: null,
    oldMainTableName: null,
    oldMainTableFieldName: null,
    len: null,
    dotLen: null,
    // tableName :null ,//表名查找关系的表名
    initialCode: null, //wiz_field_autonumber表单中的初始编号
    showFormat: null, //显示格式
    isGenerateCode: null, //是否为现有记录生成编号
    isAutoSize: null, //wiz_field_bmp表单中的是否自动大小
    trueValue: null, //wiz_field_checkbox选中
    falseValue: null, //未选中
    defaultValue: null, //默认值
    listText: null, //wiz_field_combobox  txtarea显示文本
    listValue: null, //取值
    //isLstFirstDefault :null,//第一个值是默认值 no use
    //isLstInput : null,//直接输入 no use
    //isLstMultiSel : null,//多选 no use

    idType: null, //主键字段类别
    //fieldValue : null,//主键字段值 no use
    idParam: null, //三个字母的id标识
    returnType: null, //radio控件的返回类型
    //queryName : null,//查找关系表单的查询名称 no use
    mainTableName: "", //主表名称
    mainTableFieldName: "", //主表字段名
    editTag: 2, // =1 表示增加第一个字段, =2 表示增加其它字段 =3 表示修改 =4删除
    sqlType: 2, //1 修改真正库结构及实体表的信息 2 只修改实体表的信息
    allFieldsStr: null, //本表的所有字段的option串

    readTrans: null, //字段读出时转换 fhj2012-04-27
    saveTrans: null, //字段保存时转换
    contComputer: null, //字段在电脑上使用的控件类型fhj2012-04-28
    contPhone: null, //字段在手机上使用的控件类型
    isSamePhone: null, //说明：0/1 表示手机上的配制是否和电脑上一样fhj2013-03-09
    colsNum: null, //控件是radiolist或checkboxlist时的分栏数
    isMultiOne: null, //多选值返回表格不用逗号分隔,产生多条记录
    isOther: null, //多选列表中如果是checkboxlist控件或是选项列表中radiolist要有其他输入\

    isInput: null, //选项列表字段类型时,下拉控件是否能选择输入
    isTree: null, // 选项列表是下拉控件时是否用下拉树sql语句来自数据词典
    isLstDataDict: null, //选项列表字段类型用数据词典做选择项
    isConst: null, //选项列表类型是数据选择项类型
    dictType: null, //选项列表使用数据词典选择项时它的数据分类名
    charOrVarchar: null, //文本类型字段是char还是varchar
    textOrTextarea: null, //文本类型字段控件是text，还是textarea
    permitSet: null, //字段权限设置的xml串
    isMuchField: null, //是否id 转多字段
    linkFdChnName: null, //查找关系字段类型时，如果是id转名称，linkFdChnName是名称字段名
    transMuchField: new Array(), //id 转多字段后生成的sql语句和字段名
    selectFunction: null, // 选择函数
    subType: null, //日期字段类型的（子类型如年份，年月，日期，日期时间）和特别格式字段子类型
    isNotExist: 0, //是否在物理中存在 0/1
    classCont: null, //字段显示控件的class
    styleCont: null, //字段显示控件的style
    classTd: null, //字段所在单元个的class
    styleTd: null, //字段所在单元格的style
    fdHide: null, //字段隐藏
    fdReadonly: null, //字段只读
    isFirstEnter: true //第一次进入

};
var sb = new Sys.StringBuilder(); //微软定的函数把几段数据连起来
function cmdOk_onclick() {
    parent.mainform.topic.objNav.saveConfig();
    if (parent.mainform.topic.objNav.isOk == false) return; //fhj 2012-11-05
    if (WizardConfig.sqlType == 2) cmdOkBefore(); //如果选择只修改实体表信息，获取detailxml字段就要通过调用cmdOkBefore() fhj 2013-07-23
    var sXml = RepXml(sb.toString());
    //sXml = escape(sXml);//unescape还原2012-05-21取消espace 
    var dsDataType = getDsType(WizardConfig["dataType"]); // dataType的类型;dsDataType()是根据字段类型分类函数；
    //if (WizardConfig.type == "日期时间") dsDataType = "时间";
    //var orgid1=parent.Request.QueryString('orgid').toString();
    //var sb1 = new Sys.StringBuilder();
    var xmlSql = ""; //生成sql的xml串；
    if (WizardConfig.editTag == "3") {
        xmlSql = "<update tableName='FC_ENTITYSUB'>" + "<set>fdname='" + WizardConfig["fdname"] + "',chnname='" + WizardConfig["fdchnname"] + "', fdtype='" + dsDataType + "',fdsize=" + WizardConfig["len"] + ",fddec='" + WizardConfig["dotLen"] + "',type='" + WizardConfig["type"] + "',detailxml='" + TransSql(sXml) + "',linktbname='" + WizardConfig["mainTableName"] + "',linkfdname='" + WizardConfig["mainTableFieldName"] + "'</set>" + " <where>  tbname = '" + WizardConfig["tbname"] + "' and   fdname='" + WizardConfig["oldFdname"] + "'</where>" + "</update>";
    }
    else {
        //xmlSql = "<insert tableName='FC_ENTITYSUB'>" + "<names> tbname,fdname,chnname,fdtype,fdsize,fddec,type,detailxml</names>" + "<values>" + "'" + WizardConfig["tbname"] + "','" + WizardConfig["fdname"] + "','" + WizardConfig["fdchnname"] + "','" + dsDataType + "'," + WizardConfig["len"] + "," + WizardConfig["dotLen"] + ",'" + WizardConfig["type"] + "','" + sXml + "'</values>" + "</insert>";
        xmlSql = "<insert tableName='FC_ENTITYSUB'>" + "<names> tbname,fdname,chnname,fdtype,fdsize,fddec,type,detailxml,sortNo,linktbname,linkfdname</names>" + "<values>" + "'" + WizardConfig["tbname"] + "','" + WizardConfig["fdname"] + "','" + WizardConfig["fdchnname"] + "','" + dsDataType + "'," + WizardConfig["len"] + "," + WizardConfig["dotLen"] + ",'" + WizardConfig["type"] + "','" + TransSql(sXml) + "','" + getMaxIntNo('ENS') + "','" + WizardConfig["mainTableName"] + "','" + WizardConfig["mainTableFieldName"] + "'</values> </insert>";
    }
    //if (WizardConfig.sqlType == 1 && WizardConfig.type != "累计汇总") xmlSql = MakeSaveSql(WizardConfig) + xmlSql;//fhj累计汇总字段不保存到物理表
    if (WizardConfig.sqlType == 1 && WizardConfig.type != "累计汇总") xmlSql = parent.mainform.topic.$id('alterSql').value + xmlSql; //fhj累计汇总字段不保存到物理表parent.mainform.topic.txtAlert 2013-07-18
    if (WizardConfig.transMuchField[0] != null) xmlSql += WizardConfig.transMuchField[0]; //fhj2012-05-06
    if (WizardConfig.isMuchField == '0') xmlSql += "<delete tableName='FC_RELATION' ><where>  tbname1= '" + WizardConfig["tbname"] + "' and  tbname2='" + WizardConfig["mainTableName"] + "' and  fdname1='" + WizardConfig["fdname"] + "' </where></delete>"; //fhj2012-07-20 如果是否多个字段复选框没选中就删除FC_RELATION表中查找关系表的记录
    xmlSql += "<delete tableName='fc_fieldpermit'><where>  tbname= '" + WizardConfig.tbname + "' and fdname='" + WizardConfig.fdname + "'</where></delete>"; //删除字段权限
    if (IsSpace(WizardConfig.fdReadonly) == false || IsSpace(WizardConfig.fdHide) == false) {//fhj添加字段权限 
        xmlSql += "<insert tableName='fc_fieldpermit'><names> tbname,fdname,hide,readonly  </names><values>'" + WizardConfig.tbname + "','" + WizardConfig.fdname + "','" + WizardConfig.fdHide + "','" + WizardConfig.fdReadonly + "' </values> </insert>";
    }
    //CopyToPub(xmlSql)
    var retObj = checkAndEditFindField(); // 在保存之前检查，如果修改的字段是id转多字段中的字段，生成修改(id转多字段记录表)的sql语句和表名返回。fhj 2012-05-06
    var alertInfo = "OK"; //fhj2012-05-06
    if (retObj == undefined) {
        retObj = new Object();
        retObj.alertTbName = "";
    }
    if (retObj.alertTbName != "") {
        xmlSql += retObj.sql;
        alertInfo = "成功保存，\r\n 你要到含有" + retObj.alertTbName + "表的模版中刷新同步";
    }
    doSaveData(xmlSql, function() {
        if (alertInfo == "OK") {
            alert(alertInfo);
            parent.returnValue = "ok";
            parent.close();
        } else {
            parent.mainform.topic.txtAlert.style.display = "block";
            parent.mainform.topic.cmdCloseWin.style.display = "block";
            parent.mainform.topic.txtAlert.value = alertInfo;
        }
    });



}

function cmdOkBefore() {//fhj2013-07-18
    calcDbType(); //此函数判断字段类型如（char,decimal等数据类型）
    //MakeSaveSql(WizardConfig);//make(WizardConfig)生成sql语句的函数
    addProp("helpText");
    addProp("isNull");
    addProp("isRepeat");
    addProp("width");
    addProp("height");
    addProp("defaultExp");
    addProp("queryExp");
    addProp("initialCode");
    addProp("showFormat");
    addProp("isGenerateCode");
    addProp("isAutoSize");
    addProp("trueValue");
    addProp("falseValue");
    addProp("defaultValue");
    addProp("listText");
    addProp("listValue");
    addProp("isLstInput");
    addProp("isLstMultiSel");
    addProp("idType");
    addProp("idParam");
    addProp("returnType");

    //fhj2012-04-27
    addProp("readTrans");
    addProp("saveTrans");
    addProp("isMultiOne");

    addProp("isConst");
    addProp("contComputer");
    addProp("contPhone");
    addProp("isOther");
    addProp("isLstDataDict");
    addProp("isInput");
    addProp("isTree");

    addProp("dictType");
    addProp("charOrVarchar");
    addProp("textOrTextarea");
    addProp("permitSet");
    addProp("subType");
    addProp("isMuchField");
    addProp("selectFunction");
    addProp("isNotExist");
    addProp("classCont");
    addProp("styleCont");
    addProp("classTd");
    addProp("styleTd");
    addProp("colsNum");
    addProp("isSamePhone");
    addProp("linkFdChnName");

    function addProp(name) {
        var value = WizardConfig[name];
        if (IsSpace(value) == false) {
            if (name == "defaultExp" || name == "queryExp" || name == "readTrans" || name == "saveTrans" || name == "selectFunction") {
                value = escape(value);
            }
            if (name == "listText" || name == "listValue") {
                value = RepStr(value, "\r\n", "&amp;#13;&amp;#10;");
            }
            if ((name == "contComputer" || name == "contPhone") && WizardConfig["type"] == "选项列表" && WizardConfig[name] == "radiolist或radio") {
                if (WizardConfig["isConst"] == "0") {
                    value = "radiolist";
                } else {
                    value = "radio";
                }
            }
            if (name == "contPhone") {
                sb.append(value); //fhj如果是手机与电动不用同一个配置时，手机的配置信息，在手机信息配置表单页面保存时，就添加了contPhone节点，为了方便随时打开手机配置表单，都能生成dom对象
            } else {
                sb.append("<" + name + ">" + value + "</" + name + ">");
            }
        }
    }
}


//fhj2011-09-15装载完数据后应把汉字的类型转换成数据库中的类型
function calcDbType() {
    if (WizardConfig.type == "日期") {//fhj2012-05-05
        if (WizardConfig.subType == "年份")
            WizardConfig.dataType = "int";
        WizardConfig.len = 4;
        if (WizardConfig.subType == "年月") {
            WizardConfig.dataType = "char";
            WizardConfig.len = 7;
        }
        if (WizardConfig.subType == "日期(date)" || WizardConfig.subType == "日期时间(datetime)") {
            if (fcpubdata.databaseTypeName == "sqlserver") {
                WizardConfig.dataType = "datetime";
            } else if (fcpubdata.databaseTypeName == "db2" || fcpubdata.databaseTypeName == "mysql") {
                WizardConfig.dataType = "date";
                if (WizardConfig.subType == "日期时间(datetime)") WizardConfig.dataType = "timestamp";
            } else { //oracle为date
                WizardConfig.dataType = "date";
                WizardConfig.len = null;
            }
            WizardConfig.len = 8;
        }
        if (WizardConfig.subType == "日期(char)" || WizardConfig.subType == "日期时间(char)") {
            if (WizardConfig.subType == "日期(char)") {
                WizardConfig.len = 10;
            } else {
                WizardConfig.len = 19;
            }
            WizardConfig.dataType = "char";
        }
    }
    if (WizardConfig.type == "文本") {
        if (WizardConfig.charOrVarchar == "char") {
            WizardConfig.dataType = "char";
        } else {
            WizardConfig.dataType = "varchar";
        }
    }
    if (WizardConfig.type == "取累计汇总") {
        // var retFieldType = SqlToField("select fdtype  from fc_entitysub where tbname='" + WizardConfig.mainTableName + "' and type='累计汇总'");
        var findTypeSql = "select fdsize,fddec ,detailxml from fc_entitysub where tbname='" + WizardConfig.mainTableName + "' and type='累计汇总' and fdname='" + WizardConfig.mainTableFieldName + "'";
        var xmlRet1 = SelectSql(findTypeSql, 1, 1);
        var oXml1 = SetDom(xmlRet1);
        if (oXml1.documentElement == null) {
            alert(xmlRet1);
            return;
        }
        if (oXml1.documentElement.childNodes.length < 1) return;
        WizardConfig.len = oXml1.documentElement.childNodes[0].childNodes[0].text;
        var sxml2 = oXml1.documentElement.childNodes[0].childNodes(2).text;
        var oXml2 = SetDom("<root>" + sxml2 + "</root>");
        var oNode = oXml2.documentElement.selectSingleNode("/root/returnType");
        if (oNode != null) {
            WizardConfig["returnType"] = oNode.text;
        }
        if (WizardConfig.returnType == "整数") {
            WizardConfig.dataType = "int";
        }
        if (WizardConfig.returnType == "实数") {
            WizardConfig.dataType = "decimal";
            WizardConfig.dotLen = oXml1.documentElement.childNodes[0].childNodes[1].text;
        }
        if (WizardConfig.returnType == "字符") {
            WizardConfig.dataType = "varchar";
        }
    }
    if (WizardConfig.type == "复选框") {//fhj2012-05-15
        WizardConfig.dataType = "varchar";
    }
    if (WizardConfig.type == "特别格式") {
        if (WizardConfig.subType == "邮编" || WizardConfig.subType == "身份证号" || WizardConfig.subType == "手机号")
            WizardConfig.dataType = "char";
        if (WizardConfig.subType == "电话" || WizardConfig.subType == "QQ号" || WizardConfig.subType == "自定义格式") {
            WizardConfig.dataType = "varchar";
        }
    }
    if (WizardConfig.type == "自动编号")
        WizardConfig.dataType = "char";
    if (WizardConfig.type == "大文本" || WizardConfig.type == "选项列表" || WizardConfig.type == "多选列表" || WizardConfig.type == "电子邮件" || WizardConfig.type == "URL" || WizardConfig.type == "名称") {
        WizardConfig.dataType = "varchar";
    }
    if (WizardConfig.type == "大文本") {
        if (fcpubdata.databaseTypeName == "sqlserver") {
            WizardConfig.dataType = "text";
        } else {
            WizardConfig.dataType = "clob";
        }
    }
    if (WizardConfig.type == "实数" || WizardConfig.type == "百分比" || WizardConfig.type == "币种")
        WizardConfig.dataType = "decimal"
    if (WizardConfig.type == "图片字段") {
        if (fcpubdata.databaseTypeName == "sqlserver") {
            WizardConfig.dataType = "image";
        } else {
            WizardConfig.dataType = "blob";
        }
    }
    if (WizardConfig.type == "整数" || WizardConfig.type == "删除标记" || WizardConfig.type == "顺序号")
        WizardConfig.dataType = "int";
    if (WizardConfig.type == "查找关系" || WizardConfig.type == "主从信息表") {
        var sql = "select fdtype,fdsize from  FC_ENTITYSUB where tbname = '" + WizardConfig["mainTableName"] + "' and fdname= '" + WizardConfig["mainTableFieldName"] + "'";
        var xmlRet = SelectSql(sql, 1, 1);
        var oXml = SetDom(xmlRet);
        if (oXml.documentElement == null) {
            alert(xmlRet);
            return;
        }
        if (oXml.documentElement.childNodes.length < 1) return;
        if (oXml.documentElement.childNodes[0].childNodes[0].text == "整数") {
            WizardConfig.dataType = "int";
        }
        else {
            WizardConfig.dataType = "char";
            WizardConfig.len = oXml.documentElement.childNodes[0].childNodes[1].text;

        }
    }

    if (WizardConfig.type == "ID字段") {
        if (((WizardConfig.idType == '1' || WizardConfig.idType == '4' || WizardConfig.idType == '6') && WizardConfig.returnType == '整数') || WizardConfig.idType == '3') {
            WizardConfig.dataType = "int";
            //if (fcpubdata.databaseTypeName == "oracle") WizardConfig.len = 10;
        }
        else
            WizardConfig.dataType = "char";
    }
    if (WizardConfig.type == "公式" || WizardConfig.type == "累计汇总") {
        if (WizardConfig.returnType == "整数") {
            WizardConfig.dataType = "int";
        }
        if (WizardConfig.returnType == "实数") {
            WizardConfig.dataType = "decimal";
        }
        if (WizardConfig.returnType == "字符") {
            WizardConfig.dataType = "varchar";
        }
    }
    if (WizardConfig.type == "所有者ID") {
        WizardConfig.dataType = "varchar";
        WizardConfig.len = 50;
    }
    if (WizardConfig.type == "组织全路径") {
        WizardConfig.dataType = "nvarchar";
        if (fcpubdata.databaseTypeName == "oracle") WizardConfig.dataType = "nvarchar2";
        if (fcpubdata.databaseTypeName == "db2") WizardConfig.dataType = "varchar";
        WizardConfig.len = 2048;
    }
    if (fcpubdata.databaseTypeName == "db2" && WizardConfig.dataType == "char") WizardConfig.dataType = "character";
    if (WizardConfig.dataType == "int") {
        if (fcpubdata.databaseTypeName == "db2") {
            WizardConfig.dataType = "integer";
        } else if (fcpubdata.databaseTypeName == "oracle") {
            WizardConfig.dataType = "number";
            WizardConfig.len = 10;
        } else {
            WizardConfig.len = 4;
        }
    }
    if (fcpubdata.databaseTypeName == "oracle" && WizardConfig.dataType == "varchar") {
        WizardConfig.dataType = "varchar2";
    }
}

function window_onload() {
    loadConfig();
    var tbname = parent.Request.QueryString('tbname').toString();
    WizardConfig.tbname = tbname;
    var sUrl = "../../fceform/common/djframe.htm?djtype=ZK&djsn=";
    if (WizardConfig.editTag == 3) {
        calcDbType(); //fhj2011-09-15装载完数据后应把汉字的类型转换成数据库中的类型
        sUrl += WizardGetFormName(WizardConfig.type);
    } else {
        sUrl += "wiz_field_first";
    }
    oldFieldValue(); //fhj从loadConfig()下面移到了这;
    parent.mainform.location.replace(sUrl);

}
function loadConfig() {
    var paramName = parent.Request.QueryString('fdname').toString(); //指定字段名为地址栏后的参数
    var paramtbName = parent.Request.QueryString('tbname').toString();
    if (paramName == "undefined" || paramtbName == "undefined") {
        return;
    }
    else {
        WizardConfig.editTag = 3;
    }
    var sql = "select tbname,fdname,chnname,fdtype,fdsize,fddec,type,detailxml,linktbname,linkfdname from  FC_ENTITYSUB where fdname = '" + paramName + "'" + " and tbname='" + paramtbName + "'";
    var xmlRet = SelectSql(sql, 1, 1);
    var oXml = SetDom(xmlRet);
    if (oXml.documentElement == null) {
        alert(xmlRet);
        return;
    }
    if (oXml.documentElement.childNodes.length < 1) return;
    WizardConfig.fdname = oXml.documentElement.childNodes[0].childNodes[1].text;
    WizardConfig.fdchnname = oXml.documentElement.childNodes[0].childNodes[2].text;
    WizardConfig.dataType = oXml.documentElement.childNodes[0].childNodes[3].text;
    WizardConfig.len = oXml.documentElement.childNodes[0].childNodes[4].text;
    WizardConfig.dotLen = oXml.documentElement.childNodes[0].childNodes[5].text;
    WizardConfig.type = oXml.documentElement.childNodes[0].childNodes[6].text;
    var sxml = oXml.documentElement.childNodes[0].childNodes[7].text;
    WizardConfig.mainTableName = oXml.documentElement.childNodes[0].childNodes[8].text; //fhj2012-05-15 主表名称直接获取，不像以前在详细字段中获取
    WizardConfig.mainTableFieldName = oXml.documentElement.childNodes[0].childNodes[9].text;
    var oXml = SetDom("<root>" + sxml + "</root>");
    getProp(oXml, "helpText");
    getProp(oXml, "isNull");
    getProp(oXml, "isRepeat");
    getProp(oXml, "width");
    getProp(oXml, "height");
    //getProp(oXml,"mainTableFieldName");  //主表关联字段不放在详细字段中，它房子linkfdname字段中
    getProp(oXml, "tableName");
    getProp(oXml, "dotLen");
    getProp(oXml, "defaultExp");
    getProp(oXml, "queryExp");
    getProp(oXml, "initialCode");
    getProp(oXml, "showFormat");
    getProp(oXml, "isGenerateCode");
    getProp(oXml, "isAutoSize");
    getProp(oXml, "trueValue");
    getProp(oXml, "falseValue");
    getProp(oXml, "defaultValue");
    getProp(oXml, "listText");
    getProp(oXml, "listValue");
    getProp(oXml, "isLstInput");
    getProp(oXml, "isLstMultiSel");
    getProp(oXml, "idType");
    getProp(oXml, "idParam");
    getProp(oXml, "returnType");
    //fhj 2012-04-27
    getProp(oXml, "readTrans");
    getProp(oXml, "saveTrans");
    getProp(oXml, "contComputer");
    getProp(oXml, "contPhone");
    getProp(oXml, "isMultiOne");
    getProp(oXml, "isOther");
    getProp(oXml, "isLstDataDict");
    getProp(oXml, "isInput");
    getProp(oXml, "isTree");
    getProp(oXml, "isConst");
    getProp(oXml, "dictType");
    getProp(oXml, "charOrVarchar");
    getProp(oXml, "textOrTextarea");
    getProp(oXml, "permitSet");
    getProp(oXml, "subType");
    getProp(oXml, "isMuchField");
    getProp(oXml, "selectFunction");
    getProp(oXml, "isNotExist");
    getProp(oXml, "classCont");
    getProp(oXml, "styleCont");
    getProp(oXml, "classTd");
    getProp(oXml, "styleTd");
    getProp(oXml, "colsNum");
    getProp(oXml, "isSamePhone"); //2013-03-09
    getProp(oXml, "linkFdChnName");

    function getProp(oXml, nodeName) {
        var oNode = oXml.documentElement.selectSingleNode("/root/" + nodeName);
        if (oNode != null) {
            if (nodeName == "defaultExp" || nodeName == "queryExp" || nodeName == "readTrans" || nodeName == "saveTrans" || nodeName == "selectFunction") {
                WizardConfig[nodeName] = unescape(oNode.text);
            } else if (nodeName == "permitSet") {
                WizardConfig[nodeName] = oNode.childNodes[0].xml;
            } else if (nodeName == "listText" || nodeName == "listValue") {
                WizardConfig[nodeName] = RepStr(oNode.text, "&#13;&#10;", "\r\n");
            } else if ((nodeName == "contComputer" || nodeName == "contPhone") && WizardConfig["type"] == "选项列表" && (oNode.text == "radiolist" || oNode.text == "radio")) {
                WizardConfig[nodeName] = "radiolist或radio";
            } else if (nodeName == "contPhone") {//2013-03-10
                WizardConfig[nodeName] = oNode.xml;
            } else {
                WizardConfig[nodeName] = oNode.text;
            }
        }
    }

}
function oldFieldValue() {
    WizardConfig.oldFdname = WizardConfig.fdname;
    WizardConfig.oldDataType = WizardConfig.dataType;
    WizardConfig.oldLen = WizardConfig.len;
    WizardConfig.oldDotLen = WizardConfig.dotLen;
    WizardConfig.oldtype = WizardConfig.type;
    WizardConfig.oldMainTableName = WizardConfig.mainTableName;
    WizardConfig.oldMainTableFieldName = WizardConfig.mainTableFieldName;
}

/*function getAllFields(){
///取得本表所有的字段组成的option串
if(WizardConfig.allFieldsStr == null) {
var sql = "select fdname,chnname from  FC_ENTITYSUB where tbname = '"+parent.Request.QueryString('tbname').toString()+"'";
WizardConfig.allFieldsStr = fillcombox(sql);
}
return WizardConfig.allFieldsStr;
}*/

//fhj2012-05-06 检查并修改，是否是id转名称及多字段中的字段名被修改了

function checkAndEditFindField() {
    var alertTbName = "";
    var obj = new Object();
    obj.alertTbName = "";
    obj.sql = "";

    if (WizardConfig.oldFdname != null && WizardConfig.oldFdname != WizardConfig.fdname) {
        var findFieldSql = "select tbname1 from fc_relation where tbname2='" + WizardConfig.tbname + "' and fdname2 = '" + WizardConfig.oldFdname + "'";
        var xmlRet = SelectSql(findFieldSql, 1, -1);
        var oXml = SetDom(xmlRet);
        if (oXml.documentElement == null) {
            alert(xmlRet);
            return;
        }
        var len = oXml.documentElement.childNodes.length - 1;
        for (var i = 0; i < len; i++) {
            var tbname = oXml.documentElement.childNodes[i].childNodes[0].text;
            obj.alertTbName += tbname;
            if (i < len - 1) obj.alertTbName += ",";
        }
        obj.sql = "<update tableName='fc_relation'><set>fdname2='" + WizardConfig.fdname + "' </set> <where>  tbname2='" + WizardConfig.tbname + "'   and fdname2='" + WizardConfig.oldFdname + "'</where></update>";

    }

    return obj;
}
