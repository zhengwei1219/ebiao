var WizardConfig = {
    tbname: null,
    fdchnname: "�ֶ�1",

    type: null,  //�������(�ı�������ʱ�䡣������)
    helpText: null,
    isNull: null,
    isRepeat: null,
    width: null,
    height: null,
    defaultExp: null, //��ʽĬ��ֵ
    queryExp: null, // ����ѯ����ʱ�Ĺ�ʽĬ��ֵ
    oldtype: null,
    fdname: "field1",
    oldFdname: null,
    oldDataType: null,
    dataType: null, //���ݿ��е��ֶ���������
    oldLen: null,
    oldDotLen: null,
    oldMainTableName: null,
    oldMainTableFieldName: null,
    len: null,
    dotLen: null,
    // tableName :null ,//�������ҹ�ϵ�ı���
    initialCode: null, //wiz_field_autonumber���еĳ�ʼ���
    showFormat: null, //��ʾ��ʽ
    isGenerateCode: null, //�Ƿ�Ϊ���м�¼���ɱ��
    isAutoSize: null, //wiz_field_bmp���е��Ƿ��Զ���С
    trueValue: null, //wiz_field_checkboxѡ��
    falseValue: null, //δѡ��
    defaultValue: null, //Ĭ��ֵ
    listText: null, //wiz_field_combobox  txtarea��ʾ�ı�
    listValue: null, //ȡֵ
    //isLstFirstDefault :null,//��һ��ֵ��Ĭ��ֵ no use
    //isLstInput : null,//ֱ������ no use
    //isLstMultiSel : null,//��ѡ no use

    idType: null, //�����ֶ����
    //fieldValue : null,//�����ֶ�ֵ no use
    idParam: null, //������ĸ��id��ʶ
    returnType: null, //radio�ؼ��ķ�������
    //queryName : null,//���ҹ�ϵ���Ĳ�ѯ���� no use
    mainTableName: "", //��������
    mainTableFieldName: "", //�����ֶ���
    editTag: 2, // =1 ��ʾ���ӵ�һ���ֶ�, =2 ��ʾ���������ֶ� =3 ��ʾ�޸� =4ɾ��
    sqlType: 2, //1 �޸�������ṹ��ʵ������Ϣ 2 ֻ�޸�ʵ������Ϣ
    allFieldsStr: null, //����������ֶε�option��

    readTrans: null, //�ֶζ���ʱת�� fhj2012-04-27
    saveTrans: null, //�ֶα���ʱת��
    contComputer: null, //�ֶ��ڵ�����ʹ�õĿؼ�����fhj2012-04-28
    contPhone: null, //�ֶ����ֻ���ʹ�õĿؼ�����
    isSamePhone: null, //˵����0/1 ��ʾ�ֻ��ϵ������Ƿ�͵�����һ��fhj2013-03-09
    colsNum: null, //�ؼ���radiolist��checkboxlistʱ�ķ�����
    isMultiOne: null, //��ѡֵ���ر���ö��ŷָ�,����������¼
    isOther: null, //��ѡ�б��������checkboxlist�ؼ�����ѡ���б���radiolistҪ����������\

    isInput: null, //ѡ���б��ֶ�����ʱ,�����ؼ��Ƿ���ѡ������
    isTree: null, // ѡ���б��������ؼ�ʱ�Ƿ���������sql����������ݴʵ�
    isLstDataDict: null, //ѡ���б��ֶ����������ݴʵ���ѡ����
    isConst: null, //ѡ���б�����������ѡ��������
    dictType: null, //ѡ���б�ʹ�����ݴʵ�ѡ����ʱ�������ݷ�����
    charOrVarchar: null, //�ı������ֶ���char����varchar
    textOrTextarea: null, //�ı������ֶοؼ���text������textarea
    permitSet: null, //�ֶ�Ȩ�����õ�xml��
    isMuchField: null, //�Ƿ�id ת���ֶ�
    linkFdChnName: null, //���ҹ�ϵ�ֶ�����ʱ�������idת���ƣ�linkFdChnName�������ֶ���
    transMuchField: new Array(), //id ת���ֶκ����ɵ�sql�����ֶ���
    selectFunction: null, // ѡ����
    subType: null, //�����ֶ����͵ģ�����������ݣ����£����ڣ�����ʱ�䣩���ر��ʽ�ֶ�������
    isNotExist: 0, //�Ƿ��������д��� 0/1
    classCont: null, //�ֶ���ʾ�ؼ���class
    styleCont: null, //�ֶ���ʾ�ؼ���style
    classTd: null, //�ֶ����ڵ�Ԫ����class
    styleTd: null, //�ֶ����ڵ�Ԫ���style
    fdHide: null, //�ֶ�����
    fdReadonly: null, //�ֶ�ֻ��
    isFirstEnter: true //��һ�ν���

};
var sb = new Sys.StringBuilder(); //΢���ĺ����Ѽ�������������
function cmdOk_onclick() {
    parent.mainform.topic.objNav.saveConfig();
    if (parent.mainform.topic.objNav.isOk == false) return; //fhj 2012-11-05
    if (WizardConfig.sqlType == 2) cmdOkBefore(); //���ѡ��ֻ�޸�ʵ�����Ϣ����ȡdetailxml�ֶξ�Ҫͨ������cmdOkBefore() fhj 2013-07-23
    var sXml = RepXml(sb.toString());
    //sXml = escape(sXml);//unescape��ԭ2012-05-21ȡ��espace 
    var dsDataType = getDsType(WizardConfig["dataType"]); // dataType������;dsDataType()�Ǹ����ֶ����ͷ��ຯ����
    //if (WizardConfig.type == "����ʱ��") dsDataType = "ʱ��";
    //var orgid1=parent.Request.QueryString('orgid').toString();
    //var sb1 = new Sys.StringBuilder();
    var xmlSql = ""; //����sql��xml����
    if (WizardConfig.editTag == "3") {
        xmlSql = "<update tableName='FC_ENTITYSUB'>" + "<set>fdname='" + WizardConfig["fdname"] + "',chnname='" + WizardConfig["fdchnname"] + "', fdtype='" + dsDataType + "',fdsize=" + WizardConfig["len"] + ",fddec='" + WizardConfig["dotLen"] + "',type='" + WizardConfig["type"] + "',detailxml='" + TransSql(sXml) + "',linktbname='" + WizardConfig["mainTableName"] + "',linkfdname='" + WizardConfig["mainTableFieldName"] + "'</set>" + " <where>  tbname = '" + WizardConfig["tbname"] + "' and   fdname='" + WizardConfig["oldFdname"] + "'</where>" + "</update>";
    }
    else {
        //xmlSql = "<insert tableName='FC_ENTITYSUB'>" + "<names> tbname,fdname,chnname,fdtype,fdsize,fddec,type,detailxml</names>" + "<values>" + "'" + WizardConfig["tbname"] + "','" + WizardConfig["fdname"] + "','" + WizardConfig["fdchnname"] + "','" + dsDataType + "'," + WizardConfig["len"] + "," + WizardConfig["dotLen"] + ",'" + WizardConfig["type"] + "','" + sXml + "'</values>" + "</insert>";
        xmlSql = "<insert tableName='FC_ENTITYSUB'>" + "<names> tbname,fdname,chnname,fdtype,fdsize,fddec,type,detailxml,sortNo,linktbname,linkfdname</names>" + "<values>" + "'" + WizardConfig["tbname"] + "','" + WizardConfig["fdname"] + "','" + WizardConfig["fdchnname"] + "','" + dsDataType + "'," + WizardConfig["len"] + "," + WizardConfig["dotLen"] + ",'" + WizardConfig["type"] + "','" + TransSql(sXml) + "','" + getMaxIntNo('ENS') + "','" + WizardConfig["mainTableName"] + "','" + WizardConfig["mainTableFieldName"] + "'</values> </insert>";
    }
    //if (WizardConfig.sqlType == 1 && WizardConfig.type != "�ۼƻ���") xmlSql = MakeSaveSql(WizardConfig) + xmlSql;//fhj�ۼƻ����ֶβ����浽�����
    if (WizardConfig.sqlType == 1 && WizardConfig.type != "�ۼƻ���") xmlSql = parent.mainform.topic.$id('alterSql').value + xmlSql; //fhj�ۼƻ����ֶβ����浽�����parent.mainform.topic.txtAlert 2013-07-18
    if (WizardConfig.transMuchField[0] != null) xmlSql += WizardConfig.transMuchField[0]; //fhj2012-05-06
    if (WizardConfig.isMuchField == '0') xmlSql += "<delete tableName='FC_RELATION' ><where>  tbname1= '" + WizardConfig["tbname"] + "' and  tbname2='" + WizardConfig["mainTableName"] + "' and  fdname1='" + WizardConfig["fdname"] + "' </where></delete>"; //fhj2012-07-20 ����Ƿ����ֶθ�ѡ��ûѡ�о�ɾ��FC_RELATION���в��ҹ�ϵ��ļ�¼
    xmlSql += "<delete tableName='fc_fieldpermit'><where>  tbname= '" + WizardConfig.tbname + "' and fdname='" + WizardConfig.fdname + "'</where></delete>"; //ɾ���ֶ�Ȩ��
    if (IsSpace(WizardConfig.fdReadonly) == false || IsSpace(WizardConfig.fdHide) == false) {//fhj����ֶ�Ȩ�� 
        xmlSql += "<insert tableName='fc_fieldpermit'><names> tbname,fdname,hide,readonly  </names><values>'" + WizardConfig.tbname + "','" + WizardConfig.fdname + "','" + WizardConfig.fdHide + "','" + WizardConfig.fdReadonly + "' </values> </insert>";
    }
    //CopyToPub(xmlSql)
    var retObj = checkAndEditFindField(); // �ڱ���֮ǰ��飬����޸ĵ��ֶ���idת���ֶ��е��ֶΣ������޸�(idת���ֶμ�¼��)��sql���ͱ������ء�fhj 2012-05-06
    var alertInfo = "OK"; //fhj2012-05-06
    if (retObj == undefined) {
        retObj = new Object();
        retObj.alertTbName = "";
    }
    if (retObj.alertTbName != "") {
        xmlSql += retObj.sql;
        alertInfo = "�ɹ����棬\r\n ��Ҫ������" + retObj.alertTbName + "���ģ����ˢ��ͬ��";
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
    calcDbType(); //�˺����ж��ֶ������磨char,decimal���������ͣ�
    //MakeSaveSql(WizardConfig);//make(WizardConfig)����sql���ĺ���
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
            if ((name == "contComputer" || name == "contPhone") && WizardConfig["type"] == "ѡ���б�" && WizardConfig[name] == "radiolist��radio") {
                if (WizardConfig["isConst"] == "0") {
                    value = "radiolist";
                } else {
                    value = "radio";
                }
            }
            if (name == "contPhone") {
                sb.append(value); //fhj������ֻ���綯����ͬһ������ʱ���ֻ���������Ϣ�����ֻ���Ϣ���ñ�ҳ�汣��ʱ���������contPhone�ڵ㣬Ϊ�˷�����ʱ���ֻ����ñ�����������dom����
            } else {
                sb.append("<" + name + ">" + value + "</" + name + ">");
            }
        }
    }
}


//fhj2011-09-15װ�������ݺ�Ӧ�Ѻ��ֵ�����ת�������ݿ��е�����
function calcDbType() {
    if (WizardConfig.type == "����") {//fhj2012-05-05
        if (WizardConfig.subType == "���")
            WizardConfig.dataType = "int";
        WizardConfig.len = 4;
        if (WizardConfig.subType == "����") {
            WizardConfig.dataType = "char";
            WizardConfig.len = 7;
        }
        if (WizardConfig.subType == "����(date)" || WizardConfig.subType == "����ʱ��(datetime)") {
            if (fcpubdata.databaseTypeName == "sqlserver") {
                WizardConfig.dataType = "datetime";
            } else if (fcpubdata.databaseTypeName == "db2" || fcpubdata.databaseTypeName == "mysql") {
                WizardConfig.dataType = "date";
                if (WizardConfig.subType == "����ʱ��(datetime)") WizardConfig.dataType = "timestamp";
            } else { //oracleΪdate
                WizardConfig.dataType = "date";
                WizardConfig.len = null;
            }
            WizardConfig.len = 8;
        }
        if (WizardConfig.subType == "����(char)" || WizardConfig.subType == "����ʱ��(char)") {
            if (WizardConfig.subType == "����(char)") {
                WizardConfig.len = 10;
            } else {
                WizardConfig.len = 19;
            }
            WizardConfig.dataType = "char";
        }
    }
    if (WizardConfig.type == "�ı�") {
        if (WizardConfig.charOrVarchar == "char") {
            WizardConfig.dataType = "char";
        } else {
            WizardConfig.dataType = "varchar";
        }
    }
    if (WizardConfig.type == "ȡ�ۼƻ���") {
        // var retFieldType = SqlToField("select fdtype  from fc_entitysub where tbname='" + WizardConfig.mainTableName + "' and type='�ۼƻ���'");
        var findTypeSql = "select fdsize,fddec ,detailxml from fc_entitysub where tbname='" + WizardConfig.mainTableName + "' and type='�ۼƻ���' and fdname='" + WizardConfig.mainTableFieldName + "'";
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
        if (WizardConfig.returnType == "����") {
            WizardConfig.dataType = "int";
        }
        if (WizardConfig.returnType == "ʵ��") {
            WizardConfig.dataType = "decimal";
            WizardConfig.dotLen = oXml1.documentElement.childNodes[0].childNodes[1].text;
        }
        if (WizardConfig.returnType == "�ַ�") {
            WizardConfig.dataType = "varchar";
        }
    }
    if (WizardConfig.type == "��ѡ��") {//fhj2012-05-15
        WizardConfig.dataType = "varchar";
    }
    if (WizardConfig.type == "�ر��ʽ") {
        if (WizardConfig.subType == "�ʱ�" || WizardConfig.subType == "���֤��" || WizardConfig.subType == "�ֻ���")
            WizardConfig.dataType = "char";
        if (WizardConfig.subType == "�绰" || WizardConfig.subType == "QQ��" || WizardConfig.subType == "�Զ����ʽ") {
            WizardConfig.dataType = "varchar";
        }
    }
    if (WizardConfig.type == "�Զ����")
        WizardConfig.dataType = "char";
    if (WizardConfig.type == "���ı�" || WizardConfig.type == "ѡ���б�" || WizardConfig.type == "��ѡ�б�" || WizardConfig.type == "�����ʼ�" || WizardConfig.type == "URL" || WizardConfig.type == "����") {
        WizardConfig.dataType = "varchar";
    }
    if (WizardConfig.type == "���ı�") {
        if (fcpubdata.databaseTypeName == "sqlserver") {
            WizardConfig.dataType = "text";
        } else {
            WizardConfig.dataType = "clob";
        }
    }
    if (WizardConfig.type == "ʵ��" || WizardConfig.type == "�ٷֱ�" || WizardConfig.type == "����")
        WizardConfig.dataType = "decimal"
    if (WizardConfig.type == "ͼƬ�ֶ�") {
        if (fcpubdata.databaseTypeName == "sqlserver") {
            WizardConfig.dataType = "image";
        } else {
            WizardConfig.dataType = "blob";
        }
    }
    if (WizardConfig.type == "����" || WizardConfig.type == "ɾ�����" || WizardConfig.type == "˳���")
        WizardConfig.dataType = "int";
    if (WizardConfig.type == "���ҹ�ϵ" || WizardConfig.type == "������Ϣ��") {
        var sql = "select fdtype,fdsize from  FC_ENTITYSUB where tbname = '" + WizardConfig["mainTableName"] + "' and fdname= '" + WizardConfig["mainTableFieldName"] + "'";
        var xmlRet = SelectSql(sql, 1, 1);
        var oXml = SetDom(xmlRet);
        if (oXml.documentElement == null) {
            alert(xmlRet);
            return;
        }
        if (oXml.documentElement.childNodes.length < 1) return;
        if (oXml.documentElement.childNodes[0].childNodes[0].text == "����") {
            WizardConfig.dataType = "int";
        }
        else {
            WizardConfig.dataType = "char";
            WizardConfig.len = oXml.documentElement.childNodes[0].childNodes[1].text;

        }
    }

    if (WizardConfig.type == "ID�ֶ�") {
        if (((WizardConfig.idType == '1' || WizardConfig.idType == '4' || WizardConfig.idType == '6') && WizardConfig.returnType == '����') || WizardConfig.idType == '3') {
            WizardConfig.dataType = "int";
            //if (fcpubdata.databaseTypeName == "oracle") WizardConfig.len = 10;
        }
        else
            WizardConfig.dataType = "char";
    }
    if (WizardConfig.type == "��ʽ" || WizardConfig.type == "�ۼƻ���") {
        if (WizardConfig.returnType == "����") {
            WizardConfig.dataType = "int";
        }
        if (WizardConfig.returnType == "ʵ��") {
            WizardConfig.dataType = "decimal";
        }
        if (WizardConfig.returnType == "�ַ�") {
            WizardConfig.dataType = "varchar";
        }
    }
    if (WizardConfig.type == "������ID") {
        WizardConfig.dataType = "varchar";
        WizardConfig.len = 50;
    }
    if (WizardConfig.type == "��֯ȫ·��") {
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
        calcDbType(); //fhj2011-09-15װ�������ݺ�Ӧ�Ѻ��ֵ�����ת�������ݿ��е�����
        sUrl += WizardGetFormName(WizardConfig.type);
    } else {
        sUrl += "wiz_field_first";
    }
    oldFieldValue(); //fhj��loadConfig()�����Ƶ�����;
    parent.mainform.location.replace(sUrl);

}
function loadConfig() {
    var paramName = parent.Request.QueryString('fdname').toString(); //ָ���ֶ���Ϊ��ַ����Ĳ���
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
    WizardConfig.mainTableName = oXml.documentElement.childNodes[0].childNodes[8].text; //fhj2012-05-15 ��������ֱ�ӻ�ȡ��������ǰ����ϸ�ֶ��л�ȡ
    WizardConfig.mainTableFieldName = oXml.documentElement.childNodes[0].childNodes[9].text;
    var oXml = SetDom("<root>" + sxml + "</root>");
    getProp(oXml, "helpText");
    getProp(oXml, "isNull");
    getProp(oXml, "isRepeat");
    getProp(oXml, "width");
    getProp(oXml, "height");
    //getProp(oXml,"mainTableFieldName");  //��������ֶβ�������ϸ�ֶ��У�������linkfdname�ֶ���
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
            } else if ((nodeName == "contComputer" || nodeName == "contPhone") && WizardConfig["type"] == "ѡ���б�" && (oNode.text == "radiolist" || oNode.text == "radio")) {
                WizardConfig[nodeName] = "radiolist��radio";
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
///ȡ�ñ������е��ֶ���ɵ�option��
if(WizardConfig.allFieldsStr == null) {
var sql = "select fdname,chnname from  FC_ENTITYSUB where tbname = '"+parent.Request.QueryString('tbname').toString()+"'";
WizardConfig.allFieldsStr = fillcombox(sql);
}
return WizardConfig.allFieldsStr;
}*/

//fhj2012-05-06 ��鲢�޸ģ��Ƿ���idת���Ƽ����ֶ��е��ֶ������޸���

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
