///<reference name="MicrosoftAjax.js" />
///<reference path="fcpub.js" />

function dataset(dsId) {
    this.id = dsId;

    this.dataset_mformat_isnull = false;

    /* �ؼ�λ�� */
    //this.left = 100, this.top = 50, this.width = 150, this.height = 20;
    /* ��ť��� */
    //this.mwidthButton = 17;
    /* ҳ�� */
    this.PageNo = 1;

    //this.mMainSql = ""; //
    this.opensql = "";

    /*  added by liuxr at 2010-11-1 13:46 �����ݼ���format���Ը�ֵ*/
    this.format = $id(this.id).getAttribute("format");

    /* Empty=yes ���ݼ����޼�¼,=one ��һ����¼ =null ��ʾ���ݼ�����û�д�,��OPENSQLΪ���޷��������ݼ�����, =no ���� */
    this.Empty = "null";

    /* true��ʾ��������һ������� */
    this.mbTagCol = true;
    /* ����װ���XML���� */
    this.XmlData = "";
    /* ����Ķ����XML����,filterʱ�� */
    //this.XmlDataNew = "";
    /* ������DOM����,�˶����Ӧ������ʾ */
    this.oData;

    /* added by liuxr at 2010-10-27 11:26 ����oDom����  */
    this.oDom;

    /* added by liuxr at 2010-10-29 10:26 ����xml����  */
    this.xml;

    /* ɾ��Dom���� 
    var oDel;	
    var oDel=new ActiveXObject("Microsoft.XMLDOM");
    oDel.async=false;
    oDel.loadXML ("<root></root>");*/
    /* ����Dom���� */
    //modify by liuxr at 2010-10-26 11:50 �޸�
    /*var oFilter=new ActiveXObject("Microsoft.XMLDOM");
    oFilter.async=false;
    oFilter.loadXML ("<root></root>");*/
    //this.oFilter = SetDom("<root></root>");
    /* =true��ʾ���ݼ����ڹ���״̬ */
    //this.mbFilter = false;
    /* �����ֶ�DOM���� */
    this.oDataField;
    /* �ֶ��� */
    this.FieldCount;
    /* ��¼�� */
    this.RecordCount = 0;
    /* all��¼�� */
    this.RecordCountAll;
    /* ҳ�ߴ�,ȱʡΪ5 */
    this.PageSize = -1;
    this.PageCount = 1;
    /* ����ʱ��λ�� */
    //this.iFind = 0;
    /* ��������Fields���� */
    //this.oFields;

    /* added by liuxr at 2010-10-27 14:47 ����Fields���� */
    this.Fields;

    /* ����linkobj,�������ݼ��󶨵ķǱ��ؼ� */
    this.LinkObjs = new Array();

    /* ��ͷ */
    this.Bof = false;
    this.Eof = false;
    /* ��¼��,��0��ʼ */
    this.RecNo = 0;

    /* �༭״̬ */
    this.bEdit = false;
    /* ����״̬ */
    this.bAdd = false;

    this.HideField = "";
    /* added by liuxr at 2010-11-5 11:00 ���ݼ��ļ�¼���ݵ�����*/
    this.RecordData = "";
    this.DeletedData = "";
    //this.visible = false;


    //my add
    this.isNeedValid;
    this.isSqlActionPage = $id(this.id).getAttribute("isSqlActionPage");
    this.firstKeyFieldName = "";
    this.datasourceName = $id(this.id).getAttribute("datasourceName");
    
    this.oXmlTrans = SetDom($id(this.id).getAttribute("fieldtrans")); //����ת��������xml,
    fcpubdata.transRecNo = 0; //��ʱ�Եĵ�ǰ��¼��,����$fbak_value������
}
dataset.prototype.getAttribute = function(attrName) {
    var retValue = eval(this.id + "." + attrName);
    if (typeof retValue == "undefined") retValue = $id(this.id).getAttribute(attrName);
    return retValue;
}
dataset.prototype.setAttribute = function(attrName, attrValue) {
    $id(this.id).setAttribute(attrName, attrValue);
}

/**
* ȡ�����ݼ��ĵ�һ�������ֶ���,�����������ݼ���û��Openʱȡ.
**/
dataset.prototype.getFirstKeyFieldName = function() {
    if (isSpace(this.format) == false) {
        var oXml = SetDom(this.format);
        var oNode = oXml.documentElement.selectSingleNode("//field[primarykey='��']");
        if (oNode != null) {
            this.firstKeyFieldName = NavJs.textContent(oNode.childNodes[0]);
            return this.firstKeyFieldName;
        }
    }
}
/**
*��һ��׼��ʽ��XML��װ��Ϊ���ݼ�����
*���ڽ������
*@date 2004-02-11
**/
dataset.prototype.OpenXml = function(sXml) {
//BeforeOpenID.fire();
    eval($id(this.id).getAttribute("BeforeOpen"));
    this.DeletedData = "";
    this.XmlData = sXml;
    this.base_dset(2);

    //AfterOpenID.fire();
    eval($id(this.id).getAttribute("AfterOpen"));
    return "";

}
/**
���ڽ�һ����õģ�����ͨ��SQL���������ģ�XML����װ�뵽���ݼ���,��Ҫ�������װ��xml
*@date 2004-07-14
**/
dataset.prototype.OpenXmlData = function(sXml) {
    eval($id(this.id).getAttribute("BeforeOpen"));
    this.DeletedData = "";
    this.XmlData = sXml;

    this.base_dset(4);

    eval($id(this.id).getAttribute("AfterOpen"));
    return "";

}
/**
//������ݼ��еļ�¼,�����ֶνṹ
*@date 2004-04-08
**/
dataset.prototype.ClearData = function() {
    //this.XmlData = "<root>"+this.oData.documentElement.childNodes[this.oData.documentElement.childNodes.length-1].xml+"</root>";
    this.XmlData = "<root>" + NavJs.xml(this.oData.documentElement.childNodes[this.oData.documentElement.childNodes.length - 1]) + "</root>";
    this.base_dset(3);

}
/**
*���ݼ����޼�¼�������ݼ�.�ֶ��б��format��ȡ��
**/
dataset.prototype.OpenEmpty = function() {
    eval($id(this.id).getAttribute("BeforeOpen"));
    this.DeletedData = "";
    this.XmlData = "<root><set><pages>0</pages>" + this.format + "</set></root>";

    this.base_dset(1);
    this.Empty = "yes";
    eval($id(this.id).getAttribute("AfterOpen"));
    this.bAdd = false;
    this.bEdit = false;
    return "";

}

/**
*�����ݼ�,
*ͨ��һ��KEY��SQL�����������ݼ���װ�빤��
*����""��ʾ������,���򷵻ش�����ʾ.
*@param sSql ִ�е�SQL���
*@param ismovepage = �� ��ʾ���ܳ�ʼ��pageno
*curID=�������ӱ�����ʱ������ID
**/
dataset.prototype.Open = function(sSql, ismovepage, callback, context) {

    eval($id(this.id).getAttribute("BeforeOpen"));
    this.DeletedData = "";
    var sql = this.opensql;
    if (this.opensql == "") {
        var tmpValue1 = $id(this.id).getAttribute("sqltrans");
        if (IsSpace(tmpValue1) == false) {
            sql = UnSqlPropTrans(tmpValue1);
        }
    }
    if (typeof sSql != "undefined") {
        sql = sSql;
        this.opensql = sSql;
        $id(this.id).setAttribute("opensql", this.opensql);
    }
    if (isSpace(sql)) {
        this.Empty = "null";
        return;
    } else {
        this.Empty = "no";
    }

    //var oSelf = eval(uniqueID + ".id");  //��ǰ���ݼ�����

    var sSour = this.format;

    var sFieldNameList = "";
    if ((isSpace(sSour) == false && this.format != '<fields></fields>') && this.dataset_mformat_isnull == false) {
        var oSour = SetDom(sSour);
        var l = 0;
        if (this.oXmlTrans.documentElement != null) l = this.oXmlTrans.documentElement.childNodes.length;
        for (var i = 0; i < oSour.documentElement.childNodes.length; i++) {
            sFieldNameList += "<field><name>" + NavJs.getNodeValue11(oSour, i, 0) + "</name><tbname>" + NavJs.getNodeValue11(oSour, i, 9) + "</tbname>";
            for (var k = 0; k < l; k++) {
                if (NavJs.getNodeValue11(this.oXmlTrans, k, 0) != NavJs.getNodeValue11(oSour, i, 0)) continue;
                if (this.oXmlTrans.documentElement.childNodes[k].childNodes.length > 3 && IsSpace(NavJs.getNodeValue11(this.oXmlTrans, k, 3)) == false)
                    sFieldNameList += "<sql>" + NavJs.getNodeValue11(this.oXmlTrans, k, 3) + "</sql>";

            }

            sFieldNameList += "</field>";
        }

        //���һ��������ģʽ�򿪺������޸�ģʽ��ʱmPageSize=0
        if (this.PageSize == 0) this.PageSize = -1;
        //���²�ѯʱ��ʼ����ǰҳ�źͼ�¼��
        if (ismovepage != "��") {
            this.PageNo = 1;
            this.RecordCount = 0;
        }
        if (typeof callback == "function") {
            //�Ƚϳɹ�,����ִ��SQL
            this.dataset_fields1(RepOpenSql(sql), this.PageNo, this.PageSize, sFieldNameList, Function.createDelegate(this, function(result) {
                var sRet = result.value;
                //�����ֶδ�
                this.XmlData = repStr(sRet, "<fields></fields>", this.format);
                if (isRunSqlErr(sql, this.XmlData, this)) return;
                this._OpenAfter(sql);
                callback(result);
            }), context);
        } else {
            //�Ƚϳɹ�,����ִ��SQL
            var sRet = this.dataset_fields1(RepOpenSql(sql), this.PageNo, this.PageSize, sFieldNameList);
            //alert(sRet)
            //�����ֶδ�

            this.XmlData = repStr(sRet, "<fields></fields>", this.format);
            if (isRunSqlErr(sql, this.XmlData, this)) return;

            //alert(mXmlData)
            this._OpenAfter(sql);
        }

    } else {  //mformat==empty
        var newsql = RepOpenSql(sql);
        var oSql = new Object();
        oSql.sql = newsql;
        oSql.datasourceName = this.datasourceName;

        if (typeof callback == "function") {
            //mHideField Ҫ���ص��ֶ��б�

            dataset_select(oSql, this.PageNo, this.PageSize, this.HideField, Function.createDelegate(this, function(result) {

                this.XmlData = result.value;

                if (isRunSqlErr(sql, this.XmlData, this)) return;

                this.dataset_mformat_isnull = true;
                this._OpenAfter(sql);

                callback(result);

            }), context);

        } else {

            this.XmlData = dataset_select(oSql, this.PageNo, this.PageSize, this.HideField);
            if (isRunSqlErr(newsql, this.XmlData, this)) return;
            this.dataset_mformat_isnull = true;

            this._OpenAfter(sql);
        }
    }

    return "";

    function isRunSqlErr(sql, mXmlData, objThis) {
        var oF = SetDom(mXmlData);
        if (oF.documentElement == null) {
            alert("SQL���: " + sql + " ִ�д���! ������Ϣ:" + mXmlData);
            CopyToPub(sql);
            objThis.OpenEmpty(); //�ÿմ�,������ִ����..
            return true;
        }
        objThis.format = NavJs.xml(oF.documentElement.childNodes[oF.documentElement.childNodes.length - 1].childNodes[1]);
        return false;
    }
}

dataset.prototype._OpenAfter = function(sql) {
    
    this.base_dset();
    
    this.bAdd = false;
    this.bEdit = false;
    eval($id(this.id).getAttribute("AfterOpen"));
    
}
/**
*�����ݿ���ȡ��һҳ������
**/
dataset.prototype.NextPage = function() {
    if (this.Empty == "yes") return;

    //  alert(mPageCount)
    if (this.PageNo < this.PageCount) {

        this.PageNo++;
        //base_dset(mopensql,mPageNo,mPageSize)
        //alert(mPageSize+" "+mPageNo+" "+mopensql)
        this.Open(this.opensql, "��");

    }
}
/**
*�����ݿ���ȡ��һҳ������
**/
dataset.prototype.PrevPage = function() {
    if (this.Empty == "yes") return;

    if (this.PageNo > 1) {
        this.PageNo--;
        this.Open(this.opensql, "��");
        //base_dset(mopensql,mPageNo,mPageSize)
    }
}
/**
*�����ݿ���ȡ��һҳ������
**/
dataset.prototype.FirstPage = function() {
    if (this.Empty == "yes") return;
    //   if(mPageNo<mPageCount){

    this.PageNo = 1;
    this.Open(this.opensql, "��");
    //   }
}
/**
*�����ݿ���ȡ���һҳ������
**/
dataset.prototype.LastPage = function() {
    if (this.Empty == "yes") return;

    //  if(mPageNo>1){
    this.PageNo = this.PageCount;
    this.Open(this.opensql, "��");
    //  }
}
/**
*�����ֶ����ͼ�������������.iTag=1ʱ����grid.ondatachange��cont1_onblur��,iTag=2ʱ����checkbeforeupdate��
*iTag=1ʱ���ɿؼ���fset����ʱֻ����У���¼�,iTag=2����fset��dset����ʱ���.
*@param curOF Ϊ�ֶζ���,������������,���ȵ�����
*@param value ΪҪ���������ֶ��е�ֵ,
*@param iTag ���ñ�־,����,��Ϊ1,2  =1ֻ�����¼������,=2ֻ��鲻������  
=3 �����Ҳ�����¼� ͬʱ�ں�����ֱ����ʾ����.
=4 �������Ҳ�������¼�
=5 ֻ���м��,���ڱ��浥��ǰ,������Ϣͨ����㴫�ݸ�savebill�����в�alert����,��ʱ����ֵ��fset
=6 �����еĹ���,���˲���ʾ������Ϣ��.ֻ���ش�����Ϣ 2009-07-15 add
*@return �ǿձ�ʾ���Ƿ�,""��ʾͨ��
**/
dataset.prototype.dataValid = function(curOF, value, iTag) { //iTag = 3,5,6

    if (typeof curOF == "undefined") return "";
    if (typeof value == "undefined") return "";
    if (curOF.Value == fcpubdata.noPermitTag) return "";
    
    if (curOF.DataType == "ʵ��" || curOF.DataType == "����") {
        value = RemoveComma(value);
    }

    if ((iTag == 2 || iTag == 3 || iTag == 5 || iTag == 6) && curOF.valid == "��") {
        //����Ƿ�Ϊ��
        if (curOF.Empty == "��") {
            if (isSpace(new Eapi.Str().trim(value))) {
                return this.RunValidError(curOF.DisplayLabel + "����Ϊ��! ", iTag);

            }
        }
        //��������ݼ��д��ֶ��Ƿ�Ψһ
        //        if (curOF.isKey == "��") {
        //            for (var ii = 0; ii < this.oData.documentElement.childNodes.length - 1; ii++) {
        //                if (ii != this.RecNo) {	//��ȥ��ǰ��¼���бȽ�
        //                    if (value == NavJs.getNodeValue11(this.oData, ii, curOF.index)) {
        //                        return this.RunValidError(curOF.DisplayLabel + "��ֵ�ظ�! ", iTag);

        //                    }
        //                }
        //            }

        //        }


        if (isSpace(value) == false) {
            switch (curOF.DataType) {
                case "����":
                    if (IsInt(value) == false) {
                        return this.RunValidError(curOF.DisplayLabel + "���Ǹ����� ", iTag);
                    }
                    break;
                case "ʵ��":
                    if (IsNum(value) == false) {
                        return this.RunValidError(curOF.DisplayLabel + "���Ǹ����� ", iTag);
                    }
                    break;
                case "�ַ�":
                    var iLen = curOF.Length;

                    if (isSpace(iLen) == false && iLen > 0) {
                        if (GetLength(value) > iLen) {
                            return this.RunValidError(curOF.DisplayLabel + "���Ȳ��ܴ��� " + iLen, iTag);
                        }
                    }
                    break;
                case "����":
                    var oDate = new Eapi.DateParse().parse(value);
                    if (oDate == null) {
                        return this.RunValidError(curOF.DisplayLabel + "���Ǹ��Ϸ�����! ", iTag);
                    }
                    break;

            }
        }


    }
    var oEvent = new Object(); //createEventObject();
    oEvent.type = "Valid";
    oEvent.FieldName = curOF.FieldName;
    oEvent.DisplayLabel = curOF.DisplayLabel;
    oEvent.FieldValue = value;  //������У���ֵ���¼��м����.
    oEvent.DataSet = $obj(this.id); //�������ݼ�����,����$Valid�������ֶ�ֵ���ظ�
    if (iTag == 1 || iTag == 3 || iTag == 5 || iTag == 6) {
        //�������ݼ���¼�
        oEvent.returnValue = "";

        //��fset��ֵǰ����onvalid�¼�
        //onValidID.fire(oEvent);
        fcpubdata.validEventObj = oEvent;
        var strlink = $id(this.id).getAttribute("onValid");
        if (IsSpace(strlink) == false)
            NavJs.insertEventParam(strlink, oEvent);
        //alert("3:" + oEvent.returnValue);
        fcpubdata.validEventObj = null;
        if (oEvent.returnValue != "") return this.RunValidError(oEvent.returnValue, iTag);
        //--------------------------      
        //alert(curOF.FieldName+" "+curOF.Value)
    }
    if (iTag != 5) {
        curOF.Value = value;

    }
    if (isSpace(curOF.fieldvalid) == false) {
        //alert(curOF.fieldvalid)
        var stmp = unescape(curOF.fieldvalid);
        var sRet = eval(stmp);
        if (isSpace(sRet) == false) return this.RunValidError(sRet, iTag);
    }
    return "";
    /*
    ȡ���ַ���ʵ�ʳ���,һ��������2
    *@date 2004-06-24
    */
    function GetLength(str) {
        var i, rt = 0;
        for (i = 0; i < str.length; i++) {
            rt++;
            if (str.charCodeAt(i) > 256) rt++;
        }
        return rt;
    }

    function RemoveComma(sSour) {
        var s1 = sSour + "";
        s1 = repStr(s1, ",", "");
        return s1;
    }

}
/**
*grid�ؼ������ݱ仯�¼�,������fset����
* fieldObj �ֶζ���, newValueҪ���µ�ֵ ��������������E��ؼ���
**/
dataset.prototype.cont_onDataChange = function() {
    //
    //curObj1���ڲ�ͨ���¼�����ʱ���˲���
    if (typeof (fieldObj) == "undefined" || typeof (newValue) == "undefined") {
        var curObj;
        try {
            curObj = NavJs.getEventObj();   //��ǰ�ؼ�
            if (curObj.tagName != "webgrid" && curObj.tagName != "fc:webgrid") {
                curObj = GetDsGrid($obj(this.id));
            }
        } catch (e) {
            //�Ҵ�DS���󶨵ĵ�һ�����
            curObj = GetDsGrid($obj(this.id));
        }
        var value = curObj.curTD.innerText;  //Ҫ����fset�е�ֵ

        //ͨ��grid.format�õ���ǰ������Ӧ�����ݼ��е��ֶ���
        var oXml = SetDom(curObj.format);
        var colNo = curObj.curTD.cellIndex;  //�к�
        if (this.mbTagCol && colNo > 0) colNo--;
        if (colNo < 0) colNo = 0;
        var curFieldName = NavJs.getNodeValue11(oXml, colNo, 0); //0���ڵ�Ϊ�ֶ���
        var oEventDs = $obj(curObj.getAttribute("dataset"));
        var curOF = this.Field(curFieldName);   //��ǰ�ֶζ���
    } else {
        var curOF = fieldObj;
        var value = newValue;
    }
    var oEventDs = $obj(curObj.getAttribute("dataset"));
    
    //���˴���ֵ,����֤
    var sRet = oEventDs.dataValid(curOF, value, 3);
    if (sRet != "") {
        return;
    }

    oEventDs.bEdit = true;

    oEventDs.CalcCurLine(curOF); //���㵱ǰ�е�ʵ�ʼ�����ͻ�����



    //��fset��д�ؼ�,��Ҫ��Ҫ������ʾ��ʽ

    oEventDs.fset_cont(oEventDs.RecNo);
    //fset_cont1();

}
dataset.prototype.CalcCurLine = function(curOF) {
    ///���㵱ǰ�е�ʵ�ʼ�����ͻ�����
    //������ʽ----------
    //ͨ��dataset format�����ҵ����ʽ���ֶ���
    var s11 = this.format;
    if (isSpace(s11) == false) {
        var oXml = SetDom(s11);
        fcpubdata.thisDataset = this;
        var oList = oXml.documentElement.selectNodes("//field[fieldkind='ʵ�ʼ�����']");
        for (var iList = 0; iList < oList.length; iList++) {

            //var sExp="ff('shl')*ff('dj')"
            var sExp = NavJs.textContent(oList[iList].childNodes[6]);
            var sFieldName = NavJs.textContent(oList[iList].childNodes[0]);
            var vValue = "";
            try {
                vValue = eval(sExp);
            } catch (E) {
                alert("�ֶ�: " + sFieldName + " ��Ĭ��ֵ����ʽ����ȷ!");
            }
            this.Field(sFieldName).Value = vValue;
            //ˢ�¼����ֶε�ֵ����ɢ�ؼ���
            this.fset_cont1(2, sFieldName);

            //�ŵ������
            //var curRowNo=curObj.curTD.parentNode.rowIndex
            //ͨ������format����,�ҵ�je�ֶ�����Ӧ���к�

            //var sumColNo=FieldNameToColNo(curObj,sFieldName)
            //curObj.tab.rows(curRowNo).cells(sumColNo).innerText=fset_contall(Field(sFieldName))
        }
        oList = oXml.documentElement.selectNodes("//field[fieldkind='������']");
        if (oList.length > 0)
            this.ReSum("ֻ��fset"); //����ǿ�м��������,2006-09-14 add

        fcpubdata.thisDataset = null;
    }
    //---------------------
    //��fset��ֵ����onsettext�¼�
    //    var oEvent = createEventObject();
    //    oEvent.FieldName = curOF.FieldName;

    //    oEvent.ods = eval(uniqueID);
    //    onSetTextID.fire(oEvent); //���ڵ��Ķ�ĳ���ֶκ�Ҫ������Щ�ֶ�ֵ gridsumcol

    var oEvent = new Object();
    oEvent.FieldName = curOF.FieldName;
    oEvent.oDs = this;
    fcpubdata.validEventObj = oEvent;
    var strlink = $id(this.id).getAttribute("onSetText");
    if (IsSpace(strlink) == false)
        NavJs.insertEventParam(strlink, oEvent);
    fcpubdata.validEventObj = null;


}
/**
*���� ʵ�ʼ����� ,���� cont_onDataChange �� zlselect
*@param ogrid ������
*@param curRow oData�����е��к�
*@date 2003-12-30
**/
dataset.prototype.LineSum = function(ogrid, curRow) {
    //alert(curRow)
    //	LineSumSub(curRow);  //������ȱʡֵȻ����Ҫ�����Զ��幫ʽ
    //if (typeof (curRow) != "undefined") {
    this.SetPos(curRow);
    //    var oEvent = createEventObject();
    //    oEvent.FieldName = "";
    //    oEvent.ods = eval(uniqueID);
    //    onSetTextID.fire(oEvent);

    var oEvent = new Object();
    oEvent.FieldName = "";
    oEvent.oDs = this;
    fcpubdata.validEventObj = oEvent;
    var strlink = $id(this.id).getAttribute("onSetText");
    if (IsSpace(strlink) == false)
        NavJs.insertEventParam(strlink, oEvent);
    fcpubdata.validEventObj = null;
    
    this.bEdit = true;
    this.Update("�����");
    //}
    var s11 = this.format;
    if (isSpace(s11) == false) {
        var oXml = SetDom(s11);
        fcpubdata.thisDataset = this;
        var oList = oXml.documentElement.selectNodes("//field[fieldkind='ʵ�ʼ�����']");
        for (var iList = 0; iList < oList.length; iList++) {

            //var sExp="ff('shl')*ff('dj')"
            var sExp = NavJs.textContent(oList[iList].childNodes[6]);
            var sFieldName = NavJs.textContent(oList[iList].childNodes[0]);
            if (ogrid == null) { //����copydataset
                this.dset_fset(curRow);

                var vValue = "";
                try {
                    vValue = eval(sExp);
                } catch (E) {
                    alert("�ֶ�: " + sFieldName + " ��Ĭ��ֵ����ʽ����ȷ!");
                }

                //alert(sFieldName+" "+sExp+" "+vValue)
                NavJs.textContent(this.oData.documentElement.childNodes[curRow].childNodes[this.FieldNameToNo(sFieldName)], vValue);
            } else {	//ֻ���㵱ǰ�� ���� cont_ondatachange
                var vValue = "";
                try {
                    vValue = eval(sExp);
                } catch (E) {
                    alert("�ֶ�: " + sFieldName + " ��Ĭ��ֵ����ʽ����ȷ!");
                }
                this.Field(sFieldName).Value = vValue;
                //�ŵ������
                var curRowNo = ogrid.curTD.parentNode.rowIndex;
                //ͨ������format����,�ҵ�je�ֶ�����Ӧ���к�

                var sumColNo = this.FieldNameToColNo(ogrid, sFieldName);
                ogrid.tab.rows[curRowNo].cells[sumColNo].innerText = this.fset_contall(this.Field(sFieldName));
            }
        }
        fcpubdata.thisDataset = null;
    }
}

/**
2011-05-26
���㱾���ݼ������м�¼,����ʵ�ʼ����ʽ.
**/
dataset.prototype.SumAllRecord = function() {
    var s11 = this.format;
    if (IsSpace(s11)) return;
    var oXml = SetDom(s11);
    if (oXml.documentElement == null) return;
    fcpubdata.thisDataset = this;
    var oList = oXml.documentElement.selectNodes("//field[fieldkind='ʵ�ʼ�����']");
    for (var iList = 0; iList < oList.length; iList++) {
        var sExp = NavJs.textContent(oList[iList].childNodes[6]);
        var sFieldName = NavJs.textContent(oList[iList].childNodes[0]);
        sExp = RepStr(sExp, "$f_value", "$fbak_value");
        var iFieldNo = this.FieldNameToNo(sFieldName);

        for (var j = 0; j < this.oData.documentElement.childNodes.length - 1; j++) {
            fcpubdata.transRecNo = j;
            var vValue = "";
            try {
                vValue = eval(sExp);
            } catch (E) {
                alert("�ֶ�: " + sFieldName + " ��Ĭ��ֵ����ʽ:" + NavJs.textContent(oList[iList].childNodes[6]) + "����ȷ!������Ϣ:" + E.description);
                return;
            }

            NavJs.textContent(this.oData.documentElement.childNodes[j].childNodes[iFieldNo], vValue);
        }
    }

    fcpubdata.thisDataset = null;
}
/**
*���ڰ󶨿ؼ���onblur�¼�
**/
dataset.prototype.cont1_onblur = function(ooEvent, oDropdownlist) {

    var curObj = NavJs.getEventObj();   //��ǰ�ؼ�

    if (!IsSpace(curObj) && curObj.getAttribute("stopValid") == 1) return; //my add 2013-01-28,������text �� onchangeʱvalid����󣬲����������ݼ�����֤��

    //    var isJsErr = false;
    //    try { //�˴���dropdownlist�ؼ���,��ƻ���е���ʱ�ᱨ û��Ȩ�� �Ĵ���,�ڹȸ��л��� curObj = td����,��ȡ�ϴε��¼�����.
    //        var tmp12 = curObj.parentNode;
    //    } catch (e) { isJsErr = true; }
    //    if (isJsErr || (curObj == null && IsSpace(ooEvent) == false)) {
    if (IsSpace(oDropdownlist) == false) {
        curObj = oDropdownlist;
    } else {
        //alert(curObj.outerHTML)
        //fieldset �� checkbox

        //���� combobox listbox checkboxlist radiolist �ؼ��������ֶ�ֵ���ݵ����ݼ���2013-08-08
        var textFieldName = ""; //�����ֶ���
        var textFieldValue = ""; //�����ֶ�ֵ 
        if (curObj.parentNode.getAttribute("controltype") == "radio" || curObj.parentNode.getAttribute("controltype") == "checkbox") {
            curObj = curObj.parentNode;
        }
        if (curObj.tagName.toUpperCase() == "INPUT") {
            var curObjTmp = null;
            try {
                curObjTmp = curObj.parentNode.parentNode.parentNode.parentNode.parentNode; //��TD�ﵽtable��.
            } catch (ee) { }
            if (curObjTmp != null) {
                var tmpType = "";
                try {
                    tmpType = curObjTmp.getAttribute("controltype"); //��curObjTmp����document������
                } catch (ee1) { }
                if (tmpType == "checkboxlist") {
                    curObj = curObjTmp;
                    curObj.value = GetDivCheckBoxValue(curObj, "");
                    textFieldName = curObj.getAttribute("textFieldName");
                    if (!IsSpace(textFieldName)) {
                        textFieldValue = GetDivCheckBoxValue(curObj, "��");
                    }
                }
                if (tmpType == "radiolist") {
                    curObj = curObjTmp;
                    curObj.value = GetDivRadioValue(curObj, "");
                    textFieldName = curObj.getAttribute("textFieldName");
                    if (!IsSpace(textFieldName)) {
                        textFieldValue = GetDivRadioValue(curObj, "��");
                    }
                }
            }
        }

        if (curObj.tagName.toUpperCase() == "SELECT") {
            textFieldName = curObj.getAttribute("textFieldName");
            if (!IsSpace(textFieldName) && curObj.selectedIndex >= 0) {
                textFieldValue = curObj.options[curObj.selectedIndex].text;
            }

        }
    }

    if (IsSpace(curObj.getAttribute("field"))) return;
    var oEventDs = $obj(curObj.getAttribute("dataset"));
    var curOF = oEventDs.Field(curObj.getAttribute("field"));   //��ǰ�ֶζ���

    //alert(curObj.value)
    var svalue = curObj.value;

    //�Զ���ؼ�ʱ�Ĵ��� my add 2013-03-20
    if (IsSpace(oDropdownlist) == false) {
        var controlType = oDropdownlist.getAttribute("controltype");
        if (!IsSpace(controlType) && isWidget(controlType)) {
            var oo = new Eform.AllWidget().getRunObj(controlType);
            var retMsg = oo.contFset(curOF, svalue);
            if (!IsSpace(retMsg)) return retMsg;

        }
    } else {
        //���滻�з�
        if (curObj.tagName.toUpperCase() == "TEXTAREA") {
            svalue = RepStr(svalue, "\r\n", "&#13;&#10;");
            svalue = RepStr(svalue, "\t", "&#9;");
        }
    }

    //�����ֶ����ͼ�������������.
    var iRet = oEventDs.dataValid(curOF, svalue, 3);
    //alert(iRet)
    if (iRet != "") {
        //��¼û��ͨ������֤���ڱ���ǰ����֤�� 2013-07-25
        var oErr = new Object();
        oErr.oDs = $obj(this.id);
        oErr.oField = curOF;
        oErr.oCont = curObj;
        oErr.name = oErr.oDs.id + "_" + oErr.oField.FieldName;

        if (IsSpace(fcpubdata.arrValidDs)) fcpubdata.arrValidDs = new Array();
        var len = fcpubdata.arrValidDs.length;
        var isFind = false;
        for (var k = 0; k < len; k++) {
            if (fcpubdata.arrValidDs[k].name == oErr.oDs.id + "_" + oErr.oField.FieldName) {
                isFind = true;
                break;
            }
        }
        if (!isFind) {
            fcpubdata.arrValidDs[len] = oErr;
        }
        //--------------------------------

        //����ѭ��
        //curObj.focus();
        return;
    }
    
    //���������ֶ�ֵ�����ݼ��У�2013-08-08
    if (!IsSpace(textFieldName) && !IsSpace(textFieldValue)) {
        // alert(textFieldName+":"+textFieldValue)
        //alert(svalue)
        oEventDs.Field(textFieldName).Value = textFieldValue;
    }

    oEventDs.CalcCurLine(curOF); //���㵱ǰ�е�ʵ�ʼ�����ͻ�����

    if (curOF.DataType == "ʵ��" || curOF.DataType == "����") {
        //��fset��д�ؼ�,��Ҫ��Ҫ������ʾ��ʽ
        oEventDs.fset_cont1(2, curOF.FieldName);
    }
    //fset_cont1(mRecNo);
    oEventDs.fset_cont(oEventDs.RecNo); //ˢ�±��

    var oDs = oEventDs; //eval(uniqueID);
    //alert("my3:" + oDs.e_startRow);
    if (typeof (oDs.e_startRow) != "undefined") { //�˴�������IsSpace���Է�oDs.e_startRow=0
        new Eapi.EformEbiao().fset_cont2(oDs, curObj.parentNode); //ˢ��E��ؼ�
    }

    oEventDs.bEdit = true;

}
/**
*����radio�ؼ���fset����
**/
function radioclick() {
    //alert("radioclick")
    //radioclick1();
    radio_checkbox_click();
    
    //modify by liuxr at 2011-8-30 16:43 ���radio�����ݼ���ѡ����������
    var dsobj = this;
//    if (typeof this.objID != "undefined" && this.objID != null && this.objID != "") {
//        dsobj = eval(this.objID);
//    }
//    else {
//        dsobj = this;
//    }    
    dsobj.cont1_onblur();
}
/**
*�ѽ����ϵĿؼ�װ��LinkObjs����
**/
dataset.prototype.InitLinkObj = function() {

    var l;
    var iLinkObjs = 0;
    var o = window.document.getElementsByTagName("INPUT");
    l = o.length;
    for (var i = 0; i < l; i++) {
        var curObj = o[i];
        var ds1 = o[i].getAttribute("dataset");
        if (isSpace(ds1)) {
            //�ж�spin�ؼ�,�³������Լ�try
            try {
                curObj = o[i].parentNode;
                if (curObj.getAttribute("controltype") == "spin") {
                    ds1 = curObj.getAttribute("dataset");
                }
            } catch (e) { }
        }
        if (isSpace(ds1) == false) {
            if (ds1 == this.id) {
                //curObj.attachEvent("onchange", cont1_onblur);
                NavJs.addEvent(o[i], "onchange", this.cont1_onblur);
                this.LinkObjs[iLinkObjs] = curObj;
                iLinkObjs++;
            }
        }
    }

    var o = window.document.getElementsByTagName("TEXTAREA");
    l = o.length;
    for (var i = 0; i < l; i++) {
        var ds1 = o[i].getAttribute("dataset");
        if (isSpace(ds1) == false) {
            if (ds1 == this.id) {
                //o[i].attachEvent("onchange", cont1_onblur);
                NavJs.addEvent(o[i], "onchange", this.cont1_onblur);
                this.LinkObjs[iLinkObjs] = o[i];
                iLinkObjs++;
            }
        }
    }


    var o = window.document.getElementsByTagName("LABEL"); //2010-08-13 span ==>LABEL
    l = o.length;
    for (var i = 0; i < l; i++) {
        var ds1 = o[i].getAttribute("dataset");
        if (isSpace(ds1) == false) {
            if (ds1 == this.id) {
                this.LinkObjs[iLinkObjs] = o[i];
                iLinkObjs++;
            }
        }
    }
    var o = window.document.getElementsByTagName("SELECT");
    l = o.length;
    for (var i = 0; i < l; i++) {
        var ds1 = o[i].getAttribute("dataset");
        if (isSpace(ds1) == false) {
            if (ds1 == this.id) {
                //o[i].attachEvent("onchange", cont1_onblur);
                NavJs.addEvent(o[i], "onchange", this.cont1_onblur);
                this.LinkObjs[iLinkObjs] = o[i];
                iLinkObjs++;
            }
        }
    }
    var o = window.document.getElementsByTagName("fieldset");
    l = o.length;
    for (var i = 0; i < l; i++) {
        var ds1 = o[i].getAttribute("dataset");
        if (isSpace(ds1) == false) {
            if (ds1 == this.id) {
                this.LinkObjs[iLinkObjs] = o[i];
                iLinkObjs++;
            }
        }
    }


    var o = window.document.getElementsByTagName("div"); //�µ�checkbox
    l = o.length;
    for (var i = 0; i < l; i++) {
        if (o[i].getAttribute("controltype") == "checkbox" || o[i].getAttribute("controltype") == "checkboxlist" || o[i].getAttribute("controltype") == "radiolist") {
            var ds1 = o[i].getAttribute("dataset");
            if (isSpace(ds1) == false) {
                if (ds1 == this.id) {
                    if (o[i].getAttribute("controltype") == "checkboxlist" || o[i].getAttribute("controltype") == "radiolist") {
                        //alert("11");
                        //o[i].attachEvent("onclick", cont1_onblur);
                        NavJs.addEvent(o[i], "onclick", this.cont1_onblur);
                        //added by liuxr at 2011-6-23 ��������ѡ�������������ύ�����ݼ�
                        try {
                            var chktxt = $id(o[i].id + "_txt");
                            if (chktxt != null)
                                NavJs.addEvent(chktxt, "onchange", this.cont1_onblur);
                            //chktxt.attachEvent("onchange", cont1_onblur);
                        } catch (e) { }
                    }
                    this.LinkObjs[iLinkObjs] = o[i];
                    iLinkObjs++;
                }
            }
        }
    }

    var o = window.document.getElementsByTagName("img");
    l = o.length;
    for (var i = 0; i < l; i++) {
        var ds1 = o[i].getAttribute("dataset");
        if (isSpace(ds1) == false) {
            if (ds1 == this.id) {
                this.LinkObjs[iLinkObjs] = o[i];
                iLinkObjs++;
            }
        }
    }

    var o = NavJs.getDropdownlistArr(); //window.document.all.tags("fc_code");
    l = o.length;
    for (var i = 0; i < l; i++) {
        var ds1 = o[i].getAttribute("dataset");
        if (isSpace(ds1) == false) {
            if (ds1 == this.id) {
                //o[i].attachEvent("onchange", cont1_onblur);
                var sEvent = o[i].getAttribute("onchange");
                if (IsSpace(sEvent)) sEvent = "";
                sEvent = ds1 + ".cont1_onblur(event,$id('" + o[i].id + "'));" + sEvent;
                o[i].setAttribute("onchange", sEvent);
                //NavJs.addEvent(o[i], "onchange", this.cont1_onblur);
                this.LinkObjs[iLinkObjs] = o[i];
                iLinkObjs++;
            }
        }
    }
    /////////2005-08-22  2010-06-02 my ȥ���±����
    //  var o=window.document.all.tags("div")
    //  l=o.length;
    //  for(var i=0;i<l;i++){
    //    if(o[i].controltype == "upload") continue ; //upload����
    //    var ds1=o[i].getAttribute("dataset");
    //    if(isSpace(ds1)==false){
    //      if (ds1==eval(uniqueID+".id")){
    //         o[i].attachEvent("onchange", cont1_onblur);
    //         LinkObjs[iLinkObjs]=o[i];
    //         iLinkObjs++;
    //      }   
    //    }
    //  }  

    //    var o = NavJs.getGridArr(); //window.document.all.tags("webgrid");
    //    l = o.length;
    //    for (var i = 0; i < l; i++) {
    //        if (o[i].getAttribute("dataset") == this.id) {
    //            //o[i].attachEvent("onDataChange", cont_onDataChange);
    //            NavJs.addEvent(o[i], "onDataChange", this.cont_onDataChange);
    //        }
    //    }


    runWidget("initBind()");

}

/**
*��ʹ�õĺ���  �����������
*@param sFieldName �ֶ���
*@return ���ֶε����м�¼�ϼ�
**/
function sum(sFieldName) { return summaryFunc(sFieldName, "sum", fcpubdata.thisDataset); } //fcpubdata.thisDataset���浱ǰDS����
function avg(sFieldName) { return summaryFunc(sFieldName, "avg", fcpubdata.thisDataset); }
function max(sFieldName) { return summaryFunc(sFieldName, "max", fcpubdata.thisDataset); }
function min(sFieldName) { return summaryFunc(sFieldName, "min", fcpubdata.thisDataset); }

function summaryFunc(sFieldName, sFuncName,oThis) {

    var FieldNo = oThis.FieldNameToNo(sFieldName);
    var sum1 = 0, max1 = 0, min1 = 0;
    var bool = true;
    if (typeof oThis.Field(sFieldName).Value == "undefined") bool = false;
    for (var i = 0; i < oThis.RecordCount; i++) {
        if (i == oThis.RecNo && bool) continue;
        var f1 = parseFloat(NavJs.getNodeValue11(oThis.oData, i, FieldNo));
        if (isNaN(f1) == false) {
            sum1 += f1;
            if (f1 != 0) {
                if (max1 < f1) max1 = f1;
                if (min1 > f1) min1 = f1;
            }
        }
    }
    //���ϵ�ǰ��
    if (bool) {
        var f1 = parseFloat(oThis.Field(sFieldName).Value);
        if (isNaN(f1) == false) {
            sum1 += f1;
            if (f1 != 0) {
                if (max1 < f1) max1 = f1;
                if (min1 > f1) min1 = f1;
            }
        }
    }
    if (sFuncName == "sum") {
        return sum1;
    } else if (sFuncName == "min") {
        return min1;
    } else if (sFuncName == "max") {
        return max1;
    } else { //avg
        if (oThis.RecordCount > 0) {
            return sum1 / oThis.RecordCount;
        }
        return 0;
    }

}
/**
*��ʹ�õĺ���  �м������
*@param sFieldName �ֶ���
*@return ���ֶε�ֵ
**/
function $f_value(sFieldName) { //ϣ��������ʱͳһ��$f_value�������,����ʵ�ʼ���ʱ�����: ff  $fbak_value �����ֿ���.
    var oThis = fcpubdata.thisDataset;
    var sexp = oThis.Field(sFieldName).DefaultValue;
    if (isSpace(sexp) == false && oThis.Field(sFieldName).Type == "ʵ�ʼ�����") {
        return eval(sexp);
    } else {
        var dsObj = oThis;
        var ReturnValue = dsObj.Field(sFieldName).Value;

        if (dsObj.Field(sFieldName).DataType == "ʵ��")
            ReturnValue = (isNaN(parseFloat(ReturnValue, 10))) ? 0 : parseFloat(ReturnValue, 10);

        if (dsObj.Field(sFieldName).DataType == "����")
            ReturnValue = (isNaN(parseInt(ReturnValue, 10))) ? 0 : parseInt(ReturnValue, 10);

        return ReturnValue;

    }

}
function $fbak_value(sFieldName) {
    var oThis = fcpubdata.thisDataset;
    var i = oThis.FieldNameToNo(sFieldName);
    return NavJs.getNodeValue11(oThis.oData, fcpubdata.transRecNo, i);

}
/**
*�����ݼ���������
*@param sortcol Ҫ������к�,����
*@param asc = "����/����" 
*@date 2003-12-08
**/
dataset.prototype.Sort = function(sortcol, asc) {
    if (this.oData.documentElement.childNodes.length <= 1) return;

    /*var oSort=new ActiveXObject("Microsoft.XMLDOM");
    oSort.async=false;
    oSort.loadXML ("<root></root>");
    */
    var oSort = SetDom("<root></root>");


    while (this.oData.documentElement.childNodes.length - 1 > 0) {
        var sendrow = this.MaxMinSort(sortcol, asc);
        //�Ƶ�oSort��
        var oClone = this.oData.documentElement.childNodes[sendrow].cloneNode(true);
        oSort.documentElement.appendChild(oClone);
        this.oData.documentElement.removeChild(this.oData.documentElement.childNodes[sendrow]);
        //alert(oSort.xml)
        //alert(oData.xml)
        //i++;
    }

    var fields = this.oData.documentElement.childNodes[this.oData.documentElement.childNodes.length - 1].cloneNode(true);
    oSort.documentElement.appendChild(fields);

    this.oData = oSort;

    //added by liuxr at 2010-10-27 11:40 ��oDom���Ը�ֵ
    this.oDom = this.oData;

    //added by liuxr at 2010-10-29 10:40 ��xml���Ը�ֵ
    if (this.oData.documentElement != null) {
        //this.xml = this.oData.documentElement.xml;
        this.xml = NavJs.xml(this.oData.documentElement);
    }
    //added by liuxr at 2010-11-5 11:00 ��RecordData���Ը�ֵ
    if (this.oData.documentElement != null) {
        //this.RecordData = fnGetRecordData(this.oData.documentElement.xml);
        this.RecordData = this.fnGetRecordData(NavJs.xml(this.oData.documentElement));
    }

    //alert(oData.xml)
    //����������仯
    //var o=window.document.getElementsByTagName("webgrid");
    //modify by liuxr at 2010-11-15 11:48 ��ʼ�����е�grid�ؼ���onload�¼��жϵ�ǰ���������ȡwebgrid�ı�ǩ������IE����<html xmlns:fc xmlns:v="urn:schemas-microsoft-com:vml">ָ�������в���ǰ׺
    var ogrid = NavJs.getGridArr();
    for (var ii = 0; ii < ogrid.length; ii++) {
        if (ogrid[ii].getAttribute("dataset") == this.id) {
            var gridobj = $obj(ogrid[ii].id);
            gridobj.hide();
            gridobj.EndRowState = "edit";
        }
    }
    //alert(0);
    this.dset_cont();
    this.dset_fset();
    this.fset_cont1();
    for (var ii = 0; ii < ogrid.length; ii++) {
        if (ogrid[ii].getAttribute("dataset") == this.id) {
            this.GridAddHref($obj(ogrid[ii].id));
        }
    }

}
dataset.prototype.MaxMinSort = function(sortcol, asc) {
    var sMax;
    var SendRow = 0;  //�ͳ�����
    var datatype = this.Field(sortcol).DataType;
    /*
    if(datatype=="ʵ��" || datatype=="����"){
    sMax=0
    }else{
    sMax=""
    }*/
    //alert(oData.documentElement.childNodes.length-1)
    for (var i = 0; i < this.oData.documentElement.childNodes.length - 1; i++) {
        var s1 = NavJs.textContent(this.oData.documentElement.childNodes[i].childNodes[sortcol]);
        if (datatype == "ʵ��" || datatype == "����") {
            s1 = parseFloat(s1);
            if (isNaN(s1)) s1 = 0;
        }
        //		alert("sMax:"+sMax+" "+"s1:"+s1)
        if (i == 0) sMax = s1;
        if (asc == "����") {
            if (sMax > s1) {
                sMax = s1;  //ȡ��Сֵ�ͳ�
                SendRow = i;
            }
        } else {
            if (sMax < s1) {
                sMax = s1;  //ȡ���ֵ�ͳ�
                SendRow = i;
            }
        }
    }

    return SendRow;
}

/**
*ͨ������format����,�ҵ�je�ֶ�����Ӧ���к�
*@param grid Ϊ������
*@param sFieldName Ϊ�ֶ���,
*@return �����к�
**/
dataset.prototype.FieldNameToColNo = function(grid, sFieldName) {
    /*var oXml=new ActiveXObject("Microsoft.XMLDOM");
    oXml.async=false;
    oXml.loadXML (grid.format);*/
    var oXml = SetDom(grid.format);

    for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
        if (sFieldName == NavJs.textContent(oXml.documentElement.childNodes[i].childNodes[0])) {
            if (this.mbTagCol) {
                return i + 1;
            } else {
                return i;
            }
        }
    }


}
/**
*��¼������һ����¼
*��fset���
*1 ����oData�����м�һ����¼�ڵ�
*2 �ƶ���¼��β
*@param sTag=ǿ�м�һ�� ���ڶ�ѡʱ�������ݼ�
=���ñ��Ľ��� ���ڱ�������״̬����ʱ
*@param pos ����,Ϊ�����λ��.��Insert������.��һ����¼��ֵӦΪ0	
**/
dataset.prototype.Append = function(sTag, pos) {
    var sRowState = "rowstate='new'"; //��ʾǿ�м��ϵ��е��б�ʶ
    if (sTag != "ǿ�м�һ��") {
        if (this.bAdd || this.bEdit) {
            var sErr = this.Update("��ʾ������Ϣ");
            if (sErr != "") return sErr; //=1 ����Ƿ����޷�update
        }
        //BeforeInsertID.fire();
        eval($id(this.id).getAttribute("BeforeInsert"));
        sRowState = "rowstate='add'";
    }
    //alert("new:"+mFieldCount)

    var sNode = "<root><tr " + sRowState + ">";
    for (var i = 0; i < this.FieldCount; i++) {
        //�����ֶε�Ĭ��ֵ
        //alert(Field(i).Type+":"+Field(i).DefaultValue)
        if (this.Field(i).Type == "������" && isSpace(this.Field(i).DefaultValue) == false) {
            sNode += "<td>" + this.Field(i).DefaultValue + "</td>";
        } else if (this.Field(i).Type == "����Ĭ��ֵ" && isSpace(this.Field(i).DefaultValue) == false) {

            var sss = eval(this.Field(i).DefaultValue);
            sNode += "<td>" + sss + "</td>";
        } else {
            sNode += "<td></td>";
        }
    }
    sNode += "</tr></root>";

    var newNode = SetDom(sNode);
    var oClone = newNode.documentElement.childNodes[0].cloneNode(true);
    //alert("aaa:"+mRecordCount+oData.documentElement.xml)
    if (typeof pos == "undefined") {
        this.oData.documentElement.insertBefore(oClone, this.oData.documentElement.childNodes[this.oData.documentElement.childNodes.length - 1]);
    } else {
        this.oData.documentElement.insertBefore(oClone, this.oData.documentElement.childNodes[pos]);
    }
    //this.RecordCount++;
    this.RecordCount = this.oData.documentElement.childNodes.length - 1; //��Ϊ��XML����ͬ���Ϻã�2012-11-21

    if (sTag != "ǿ�м�һ��") {

        //�ȷŴ��¼����ڴ�	
        //OnNewRecordID.fire();
        eval($id(this.id).getAttribute("OnNewRecord"));

        //grid add line
        var o = NavJs.getGridArr();
        for (var ii = 0; ii < o.length; ii++) {
            if (o[ii].getAttribute("dataset") == this.id) {
                var gridobj = $obj(o[ii].id);
                gridobj.RemoveBackColor();
                if (typeof pos == "undefined") {
                    gridobj.InsertRow();
                    if (sTag != "���ñ��Ľ���") {
                        var tmprow = gridobj.tab.rows.length - 1;
                        gridobj.SetFocus(gridobj.FindFirstTD(tmprow), "���������");
                    }

                } else {
                    var tmprow = pos + gridobj.FixRows;
                    gridobj.InsertRow(tmprow);
                    gridobj.SetFocus(gridobj.FindFirstTD(tmprow), "���������");
                }
                //���������һ��
                gridobj.VscrollTo(gridobj.Vmax);
                //added by liuxr at 2009-5-22 �����к�
                gridobj.ReCalRowNo();
                gridobj.hide();
            }

        }

        this.bAdd = true;


        //�ƶ���ǰ��¼ָ��ָ�����һ��
        if (typeof pos == "undefined") {
            this.RecNo = this.RecordCount - 1;
        } else {
            this.RecNo = pos;
        }
        this.SetPos(this.RecNo);
        //AfterInsertID.fire();
        eval($id(this.id).getAttribute("AfterInsert"));
    }
}

/**
�ڵ�ǰλ�ò���һ�м�¼
*@date 2004-03-03
**/
dataset.prototype.Insert = function() {
    this.Append("", this.RecNo);
}
/**
*��������
*@date 2008-06-04
**/
dataset.prototype.AppendCopy = function () {
    var arrBack = new Array();
    for (var i = 0; i < this.FieldCount; i++) {
        arrBack[i] = this.Field(i).Value;
    }
    this.Append();
    for (var i = 0; i < this.FieldCount; i++) {
        this.Field(i).Value = arrBack[i];
    }
}
/**
*�ύ�����ݼ�֮ǰִ�еļ��.��Ҫ���Field(i).Value�е������Ƿ�����������ͺ��Ƿ�Ϊ�յȷ���
*���fset�е�����dset�е���һ���򲻼��,����true
*����Field(i)����Ľṹ�����Field(i).Valueֵ�Ƿ�Ϸ�
*@return ��鲻�Ϸ�����false,���򷵻�true
*@date 2003-05-14
**/
dataset.prototype.checkbeforeupdate = function(iTag) {
    for (var i = 0; i < this.FieldCount; i++) {
        var sRet = this.dataValid(this.Field(i), this.Field(i).Value, iTag); //2 
        if (IsSpace(sRet) == false) {
            return sRet;
        }
    }
    return "";
}
/**
*��fset�е����ݱ��浽���ݼ���
*@param novalid ="�����" ��ʾ��ִ�� checkbeforeupdate ,���ڱ����
novalid ="��ʾ������Ϣ" ��ʾ�ڴ�Ҫ��������ʾ������Ϣ
*@return 1 ��ʾ����Ƿ����޷�update
return "" ��ʾ�ɹ�,�����Ǵ�����Ϣ
**/
dataset.prototype.Update = function(novalid) {
    //alert(mbEdit)
    if (this.bEdit == false && this.bAdd == false) return "";
    if (novalid == "�����") {
        var sRetErr = this.checkbeforeupdate(5);
        if (sRetErr != "") {
            //��ʱ���ύ�Ƿ������ݽ����ݼ���.��grid��LostFocusʱ��
            //֪ͨ�ڱ���ǰ�ټ������ݼ������б䶯������
            this.isNeedValid = "yes";
            alert(sRetErr);
            return sRetErr;
        }
    } else {
        var sRetErr = this.checkbeforeupdate(6);
        if (sRetErr != "") {
            if (novalid == "��ʾ������Ϣ") alert(sRetErr);
            return sRetErr;
        }
    }

    var sMsg = this.RunBeforeUpdate();
    if (sMsg != "") {
        if (novalid == "�����") this.isNeedValid = "yes";
        if (novalid == "��ʾ������Ϣ" || novalid == "�����") alert(sMsg);
        return sMsg;
    }

    if (this.oData.documentElement.childNodes.length > 1) {
        //��ʾoData���м�¼�ڵ�
        for (var i = 0; i < this.FieldCount; i++) {
            NavJs.textContent(this.oData.documentElement.childNodes[this.RecNo].childNodes[i],this.Field(i).Value);
        }
        if (this.oData.documentElement.childNodes[this.RecNo].getAttribute("rowstate") == "new")
            this.oData.documentElement.childNodes[this.RecNo].setAttribute("rowstate", "add");
        if (this.oData.documentElement.childNodes[this.RecNo].getAttribute("rowstate") != "add")
            this.oData.documentElement.childNodes[this.RecNo].setAttribute("rowstate", "edit");
    }
    //���¼��������еĻ�����
    this.ReSum("ֻ��fset");

    this.bEdit = false;
    this.bAdd = false;
    
    eval($id(this.id).getAttribute("AfterPost"));
    //AfterPostID.fire();

    return "";
}
//���ύ֮ǰ�¼�����һ������������
dataset.prototype.RunBeforeUpdate = function() {
    var oEvent = new Object();
    oEvent.returnValue = "";
    //BeforePostID.fire(oEvent);
    var oFunction = $id(this.id).getAttribute("BeforePost");
    if (IsSpace(oFunction) == false) {
        oFunction(oEvent);
    }
    return oEvent.returnValue;
}
/**
*ɾ�����ݼ��еļ�¼,������Cancelȡ��
*@param type type=1��ʾ����Ҫ��oDel�����ӽڵ�,����Cancel����
**/
dataset.prototype.Delete = function(type) {
    if (this.oData.documentElement.childNodes.length <= 1) return;
    if (type != 1) {
        //BeforeDeleteID.fire();
        eval($id(this.id).getAttribute("BeforeDelete"));
        //add oDel����
        var oTr = this.oData.documentElement.childNodes[this.RecNo];
        if (oTr.getAttribute("rowstate") != "add" && oTr.getAttribute("rowstate") != "del") {
            oTr.setAttribute("rowstate", "del");
            this.DeletedData += NavJs.xml(oTr);
        }
    }

    var curcol = 1; 	//��һ�����ݼ�ֻ���ܰ󶨵�һ�������.�����ô˱�������ɾ��ǰ�ĵ�ǰ�й�������ý�����.
    var o = NavJs.getGridArr();
    for (var ii = 0; ii < o.length; ii++) {
        if (o[ii].getAttribute("dataset") == this.id) {
            var gridobj = $obj(o[ii].id);
            curcol = gridobj.curTD.cellIndex;
            gridobj.DeleteRow(this.RecNo + gridobj.FixRows);
        }
    }


    this.oData.documentElement.removeChild(this.oData.documentElement.childNodes[this.RecNo]);
    //this.RecordCount--;
    this.RecordCount = this.oData.documentElement.childNodes.length - 1; //��Ϊ��XML����ͬ���Ϻã�2012-11-21
    
    if (this.RecordCount > 0) {
        if (this.RecNo > 0) {
            this.RecNo--;
        }
        this.SetPos(this.RecNo);
        this.ReSum("ֻ��fset");
        this.fset_cont1();
    }
    else {
        this.fset_setnull();
        //����¼��Ϊ0ʱ��հ󶨿ؼ��ϵ�ֵ
        this.fset_cont1(1);
    }
    this.bAdd = false;
    this.bEdit = false;
    if (this.RecordCount > 0) {
        var o = NavJs.getGridArr();
        for (var ii = 0; ii < o.length; ii++) {
            if (o[ii].getAttribute("dataset") == this.id) {
                var gridobj = $obj(o[ii].id);
                //�ý���
                gridobj.SetFocus(gridobj.tab.rows[this.RecNo + gridobj.FixRows].cells[curcol], "���������");
                //added by liuxr at 2009-5-22 �����к�
                gridobj.ReCalRowNo();
            }
        }
    }

    //AfterDeleteID.fire();
    eval($id(this.id).getAttribute("AfterDelete"));
}
/**
*����һ����¼
**/
dataset.prototype.MoveFirst = function() { return this.SetPos(-1); }
/**
*��һ����¼
**/
dataset.prototype.MoveNext = function() { return this.SetPos(this.RecNo + 1); }
/**
*��һ����¼
**/
dataset.prototype.MovePrev = function() { return this.SetPos(this.RecNo - 1); }
/**
*���һ����¼
**/
dataset.prototype.MoveLast = function() { return this.SetPos(this.RecordCount); }

/**
*��¼��λ,����mBof,mEof,mRecNo��Щ������ֵ
*@param pos posΪ��¼��,��0��ʼ
**/
dataset.prototype.SetPos = function(pos) {
    //modify by liuxr at 2010-10-26 16:33
    //BeforeScrollID.fire();
    eval($id(this.id).getAttribute("BeforeScroll"));
    this.Bof = false;
    this.Eof = false;
    var tmpCount = this.oData.documentElement.childNodes.length - 1;
    if (pos >= tmpCount) pos = tmpCount - 1;
    if (pos < 0 || isNaN(pos)) pos = 0;
    if (pos == 0) this.Bof = true;
    if (pos >= tmpCount - 1) this.Eof = true;

    this.fnPutRecNo(pos); //10
    this.dset_fset();  //30
    this.fset_cont1(); //10

    //modify by liuxr at 2010-10-26 16:35
    //AfterScrollID.fire();
    eval($id(this.id).getAttribute("AfterScroll"));
    return 0;
}
/**
*���ֶμ��е�����==>�ı��ؼ���
*@param type type=1��ʾ��ս��� 
        type=2 ��ʾֻ��д��ǰ�ֶ�(fieldname)�Ŀؼ� ����cont1_onblur�����л�д��ֵ�ĸ�ʽ
**/
dataset.prototype.fset_cont1 = function(type, fieldname) {
    if (type == 1) {
        for (var i = 0; i < this.LinkObjs.length; i++) {
            if (this.LinkObjs[i].tagName.toUpperCase() == "LABEL") { //2010-08-13 �� SPAN ==> LABEL
                this.LinkObjs[i].innerText = "";
            } else {
                this.LinkObjs[i].value = "";
            }
        }

    } else {
        var stable = $id(this.id).getAttribute("savetable");
        // alert(stable);
        for (var i = 0; i < this.LinkObjs.length; i++) {
            if ((type == 2 && fieldname == this.LinkObjs[i].getAttribute("field") && isSpace(fieldname) == false) || type != 2) {
                var controlType = this.LinkObjs[i].getAttribute("controltype");
                if (!IsSpace(controlType) && isWidget(controlType)) {
                    var oo = new Eform.AllWidget().getRunObj(controlType);
                    oo.fsetCont(this.LinkObjs[i], this.Field(this.LinkObjs[i].getAttribute("field")));
                    continue;

                }

                if (this.LinkObjs[i].tagName.toUpperCase() == "LABEL") { //2010-08-13 �� SPAN ==> LABEL
                    this.LinkObjs[i].innerText = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                } else if (this.LinkObjs[i].tagName.toUpperCase() == "IMG") {
                    if (!IsSpace(this.LinkObjs[i].getAttribute("field"))) {
                        if (IsSpace(stable)) {
                            alert("�����ݼ�û�����ñ������!");
                            continue;
                        }
                        if (IsSpace(this.firstKeyFieldName)) {
                            alert("�����ݼ�û�����������ֶ�!");
                            continue;
                        }

                        var s1 = "";
                        if (this.Field(this.LinkObjs[i].getAttribute("field")).DataType != "ͼ��") {//�жϱ���ͼƬ���Ǳ���ͼƬ·�� @fhj 2011-05-30
                            try {
                                s1 = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                                s1 = "../.." + s1;
                            } catch (e) {
                                alert(this.LinkObjs[i].getAttribute("field") + "�ֶ������ݼ���û��")
                                continue;
                            }
                        } else {

                            s1 = location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=readImage&sTablename=" + stable + "&sImgname=" + this.LinkObjs[i].getAttribute("field") + "&sKeyname=" + this.firstKeyFieldName + "&sKeyvalue=";

                            s1 += this.Field(this.firstKeyFieldName).Value;
                            s1 += "&random=" + Math.random();
                        }
                        this.LinkObjs[i].src = s1;
                    }
                } else if (this.LinkObjs[i].tagName.toUpperCase() == "TEXTAREA" && !IsSpace(this.LinkObjs[i].getAttribute("field")) && fcpubdata.databaseTypeName == "oracle" && this.Field(this.LinkObjs[i].getAttribute("field")).DataType == "�ı�") { //����clob�ֶ�
                    if (IsSpace(this.firstKeyFieldName)) {
                        alert("�����ݼ�û�����������ֶ�!");
                        continue;
                    }

                    var primarykeyFieldValue = this.Field(this.firstKeyFieldName).Value;
                    if (IsSpace(primarykeyFieldValue) == false) {

                        var s1 = location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=readClob&sTablename=" + stable + "&sImgname=" + this.LinkObjs[i].getAttribute("field") + "&sKeyname=" + this.firstKeyFieldName + "&sKeyvalue=";

                        s1 += primarykeyFieldValue;
                        s1 += "&random=" + Math.random();
                        new Eapi.RunAjax().sendHttp(s1, "", function(result) {
                            //���滻�з�, 2011-05-13
                            var oTextArea = result.context;
                            var v1 = result.value;
                            if (oTextArea.tagName.toUpperCase() == "TEXTAREA") {
                                v1 = RepStr(v1, "&#13;&#10;", "\r\n");
                                v1 = RepStr(v1, "&#9;", "\t");
                            }
                            oTextArea.value = v1;
                            //oTextArea.fireEvent("onchange");
                            NavJs.fireEvent(oTextArea, "onchange");


                        }, this.LinkObjs[i]);
                    }
                } else if (this.LinkObjs[i].tagName.toUpperCase() == "FIELDSET") {
                    SetRadioValue(this.LinkObjs[i], this.Field(this.LinkObjs[i].getAttribute("field")).Value);

                } else if (this.LinkObjs[i].tagName.toUpperCase() == "DIV" && this.LinkObjs[i].getAttribute("controltype") == "checkbox") {
                    var v1 = "";
                    try {
                        v1 = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                    } catch (e) {
                        alert(this.LinkObjs[i].getAttribute("field") + "�ֶ������ݼ���û��"); continue;
                    }
                    SetCheckBoxValue(this.LinkObjs[i], v1);

                }
                //modify by liuxr at 2010-4-27 15:17 ��checkboxlist�ؼ���ֵ
                else if (this.LinkObjs[i].tagName.toUpperCase() == "DIV" && this.LinkObjs[i].getAttribute("controltype") == "checkboxlist") {
                    var v1 = "";
                    try {
                        v1 = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                    } catch (e) {
                        alert(this.LinkObjs[i].getAttribute("field") + "�ֶ������ݼ���û��"); continue;
                    }
                    SetDivCheckBoxValue(this.LinkObjs[i], v1, "", true);
                }
                //modify by liuxr at 2010-4-27 16:17 ��radiolist�ؼ���ֵ divradio
                else if (this.LinkObjs[i].tagName.toUpperCase() == "DIV" && this.LinkObjs[i].getAttribute("controltype") == "radiolist") {
                    var v1 = "";
                    try {
                        v1 = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                    } catch (e) {
                        alert(this.LinkObjs[i].getAttribute("field") + "�ֶ������ݼ���û��"); continue;
                    }
                    SetDivRadioValue(this.LinkObjs[i], v1);
                }

                else {
                    var v1 = "";
                    try {
                        v1 = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                    } catch (e) {
                        alert(this.LinkObjs[i].getAttribute("field") + "�ֶ������ݼ���û��")
                        continue;
                    }
                    v1 = this.fset_contall(this.Field(this.LinkObjs[i].getAttribute("field")));

                    //���滻�з�
                    if (this.LinkObjs[i].tagName.toUpperCase() == "TEXTAREA") {
                        v1 = RepStr(v1, "&#13;&#10;", "\r\n");
                        v1 = RepStr(v1, "&#9;", "\t");
                    }
                    this.LinkObjs[i].value = v1;
                    //2012-02-10 my add
                    if (this.LinkObjs[i].getAttribute("controltype") == "dropdownlist") $obj(this.LinkObjs[i].id).fnPutvalue(v1);
                    //alert(this.LinkObjs[i].getAttribute("controltype") + "=" + v1);

                }
            }
        }
    }
}
/**
*��fset������ϵĿؼ�����ʱҪ���ô˺���,������ongettext�¼��ʹ���ʵ����ǧ��λ��С��λ����
*@param oF �ֶζ���
*@param v1 ���ֶε�ֵ
*@date 2003-11-27
**/
dataset.prototype.fset_contall = function(oF, v1) {
    if (typeof oF == "undefined") return "";
    if (oF.Value == fcpubdata.noPermitTag) return "";
    if (typeof v1 == "undefined") {
        var v1 = oF.Value;
    }

    //�Ӵ������ڵ���ʾ��ʽ.
    if (oF.DataType == "����") {
        var sFormat = oF.DisplayFormat;
        if (IsSpace(sFormat) == false && IsSpace(v1) == false) {
            var oDate = new Eapi.DateParse().parse(v1); 
            if (oDate != null) {
                v1 = oDate.format(sFormat);
            }
        }
    }

    if (oF.DataType == "ʵ��") {
        v1 = ContDec(v1, oF.DotLength);
    }
    //����ǧ��λ
    if (oF.DataType == "ʵ��" || oF.DataType == "����") {
        var s1 = oF.DisplayFormat;
        if (s1.indexOf(",") >= 0) {
            v1 = AddComma(v1);
        }
    }
    return v1;
    /**
    *�����ݼ����ؼ�: ��ǧ��λ����,��. ��dataset.htc �� fset_contall �����е���
    *@param sSour ����ԭ��
    *@date 2003-11-27
    **/
    function AddComma(sSour) {
        var s1 = new Eapi.Str().trim(sSour);
        var ret = "";
        var s2 = "";
        var start1 = s1.indexOf(".");
        if (start1 < 0) {
            start1 = s1.length;
        } else {
            s2 = s1.substring(start1, s1.length);
        }
        for (var i = start1 - 3; i > 0; i = i - 3) {
            ret = "," + s1.substring(i, i + 3) + ret;
        }
        if (ret == "") {
            ret = s1;
        } else {
            ret = s1.substring(0, i + 3) + ret + s2;
        }
        return ret;
    }

}
/**
*���ֶμ���===>grid�ؼ��е�����
*@param r r=0��ʾ��һ����¼
**/
dataset.prototype.fset_cont = function(r) {
    if (typeof (r) == "undefined") {
        r = this.RecNo;
    }

    r = parseInt(r);


    var o = NavJs.getGridArr();
    for (var ii = 0; ii < o.length; ii++) {
        if (o[ii].getAttribute("dataset") == this.id) {
            var gridobj = $obj(o[ii].id);
            r = r + gridobj.FixRows;
            if (isNaN(r)) {
                r = gridobj.curTD.parentNode.rowIndex;
                if (r < gridobj.FixRows) r = r + gridobj.FixRows; //2008-06-26 add ,�Է�д����������.
                //alert(r)
            } else if (r >= gridobj.tab.rows.length) {
                break;
            }

            for (var i = 1; i < gridobj.tab.childNodes[0].childNodes.length; i++) {
                //�ֶκͱ����п��ܲ���Ӧ
                var v1;

                var ifieldno = gridobj.tab.children[0].children[i].getAttribute("dsfield");

                ifieldno = parseInt(ifieldno);
                if (isNaN(ifieldno)) ifieldno = 0;
                var sReadOnly = gridobj.tab.children[0].children[i].getAttribute("cz");
                if (sReadOnly == "<checkbox></checkbox>" || sReadOnly == "<checkbox_readonly></checkbox_readonly>") {
                    v1 = this.Field(ifieldno).Value;
                    gridobj.tab.rows[r].cells[i].innerText = "";
                    if (IsTrue(v1)) {
                        if (sReadOnly == "<checkbox></checkbox>")
                            gridobj.tab.rows[r].cells[i].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checked.gif)";
                        else
                            gridobj.tab.rows[r].cells[i].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checkdisabled.gif)";
                    } else {
                        if (sReadOnly == "<checkbox></checkbox>")
                            gridobj.tab.rows[r].cells[i].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheck.gif)";
                        else
                            gridobj.tab.rows[r].cells[i].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheckdisabled.gif)";
                    }
                    gridobj.tab.rows[r].cells[i].style.backgroundPosition = "center center";
                } else {
                    if (sReadOnly == null && this.Field(ifieldno).Type == "������") { //ֻ��
                        v1 = this.Field(ifieldno).Value;

                    } else {
                        v1 = this.fset_contall(this.Field(ifieldno));
                    }
                    if (gridobj.tab.rows[r].cells[i].innerText == gridobj.tab.rows[r].cells[i].innerHTML) { //��ʾ���ǳ�����
                        gridobj.tab.rows[r].cells[i].innerText = v1;

                        //modify by liuxr at 2010-12-6 17:49 TD���������ݺ����¼����и�
                        if (!IsTrue(gridobj.getAttribute("SetRowHeight"))) {
                            if (gridobj.tab.rows[r].style.removeAttribute) {
                                gridobj.tab.rows[r].style.removeAttribute("height");
                            }
                            else {
                                gridobj.tab.rows[r].style.removeProperty("height");
                            }

                            //alert("curObj" + gridobj.curObj.offsetHeight + " grid:" +gridobj.tgrid.rows [r].offsetHeight);
                            gridobj.tab.rows[r].style.height = gridobj.tab.rows[r].offsetHeight;
                        }

                    }
                }
            }
        }
    }

}
/**
*���ֶ��������ֶκ�.
*@param name �ֶ�����
*@return �ֶ�˳���
**/
dataset.prototype.FieldNameToNo = function(name) {
    var index = 0;
    try {
        index = this.Field(name).index;
    } catch (e) { };
    return index;
}
/**
*���ֶκ����ֶ�����.
*@param name �ֶ�����
*@return �ֶ�˳���
**/
dataset.prototype.FieldNoToName = function(no) {
    return (this.oDataField.childNodes[no].childNodes[0]);
}
/**
*��mXmlData��װ������==>���ݼ���
*@param iTag δ�����ʾ����ʹ�ã�=1��ʾ�ս���ʱװ��� =2���ڽ����ʱװ������ =3 ��������ݼ�ʱ��=4 ��ʾװ�����Լ��ĳ������ɵ����ݼ�XML������
**/
dataset.prototype.base_dset = function(iTag) {
    //
    //alert(mXmlData)
    this.oData = SetDom(this.XmlData);
    if (this.oData.documentElement == null) {
        alert(this.XmlData);
        return;
    }
    //added by liuxr at 2010-10-27 11:40 ��oDom���Ը�ֵ
    this.oDom = this.oData;
    //added by liuxr at 2010-10-29 10:40 ��xml���Ը�ֵ
    if (this.oData.documentElement != null) {
        //modify by liuxr at 2010-11-15 10:55 .xml�����ڷ�IE��������²���ʹ�ã���NavJs.xml(node) �����������������
        this.xml = NavJs.xml(this.oData.documentElement);
    }
    //added by liuxr at 2010-11-5 11:00 ��RecordData���Ը�ֵ
    if (this.oData.documentElement != null) {
        this.RecordData = this.fnGetRecordData(NavJs.xml(this.oData.documentElement));
    }


    //added by liuxr at 2010-11-1 14:05 �����ݼ���RecordCount���Ը�ֵ
    this.RecordCount = this.oData.documentElement.childNodes.length - 1;

    this.RecordCountAll = parseInt(NavJs.textContent(this.oData.documentElement.childNodes[this.oData.documentElement.childNodes.length - 1].childNodes[0]));
    this.oDataField = this.oData.documentElement.childNodes[this.oData.documentElement.childNodes.length - 1].childNodes[1];

    if (this.oDataField != null) {
        this.FieldCount = this.oDataField.childNodes.length;
    }

    if (this.PageSize == -1) {
        this.PageCount = 1;
    } else {
        this.PageCount = Math.ceil(this.RecordCountAll / this.PageSize);
    }

    this.initRowSet(); //��ʼ���ֶζ���

    //alert(this.oXmlTrans.documentElement);
    //-------------------
    //�������ʱת�� 2008-03-06
    if (this.oXmlTrans.documentElement != null) {
        fcpubdata.thisDataset = this;
        var l = this.oXmlTrans.documentElement.childNodes.length;

        for (var k = 0; k < l; k++) {
            var ss = unescape(NavJs.getNodeValue11(this.oXmlTrans, k, 2));
            if (ss != "") {
                ss = RepStr(ss, "$f_value", "$fbak_value");
                var colRep = this.FieldNameToNo(NavJs.getNodeValue11(this.oXmlTrans, k, 0).toLowerCase());
                for (var i = 0; i < this.RecordCount; i++) {
                    fcpubdata.transRecNo = i;
                    if (this.oData.documentElement.childNodes[i].childNodes[colRep].text != fcpubdata.noPermitTag)
                        NavJs.textContent(this.oData.documentElement.childNodes[i].childNodes[colRep], eval(ss));
                }
            }
        }
        fcpubdata.thisDataset = null;
    }

    //---------------------
    //����


    this.initGrid(iTag);    //��ʼ���󶨱��ؼ�

    this.ReSum("ֻ��fset");  //��ʼ���������ֶε�fset


    if (this.RecordCount > 0) {
        this.MoveFirst();
    } else {
        //��հ󶨵ķǱ��ؼ�
        this.dset_fset();
        this.fset_cont1();
    }

}
/**
* ���fset�е�ֵ
*@date 2008-01-06
**/
dataset.prototype.fset_setnull = function() {
    for (var i = 0; i < this.FieldCount; i++) {
        if (this.RecordCount == 0) this.Field(i).Value = "";
    }
}
/**
*��dset==>fset ����setpos������ ,��curRow ���� LineSum ��
**/
dataset.prototype.dset_fset = function(curRow) {
    if (typeof curRow == "undefined") curRow = this.RecNo;
    for (var i = 0; i < this.FieldCount; i++) {
        if (this.Field(i).Type != "������") {
            if (this.RecordCount == 0) {
                this.Field(i).Value = "";
            } else {
                this.Field(i).Value = NavJs.textContent(this.oData.documentElement.childNodes[curRow].childNodes[i]);
                
            }
        }
    }

}

/**
*���¼���������ֵ,����ֵ��oData����,���ڴ�ӡǰ
*@param sTag = "ֻ��fset" ��ʾ����������ֶε�fsetֵ, Ϊ�ձ�ʾ���������ֶε�fset�е�ֵ�����ݼ���
*@date 2003-12-15
**/
dataset.prototype.ReSum = function(sTag) {
    fcpubdata.thisDataset = this;
    if (sTag == "ֻ��fset") {
        if (isSpace(this.format) == false) {
            var oXml = SetDom(this.format);

            var oList = oXml.documentElement.selectNodes("//field[fieldkind='������']");
            for (var iList = 0; iList < oList.length; iList++) {
                var sExp = NavJs.textContent(oList[iList].selectSingleNode("defaultvalue"));
                //modify by liuxr at 2010-11-22 ���㹫ʽ���ϵ�ǰ���ݼ�����
                //                if (sExp.indexOf("sum") >= 0) {
                //                    var re = /sum/g;
                //                    sExp = sExp.replace(re, this.id + ".sum");
                //                }
                //���滹û�д��� avg min max ������ʽ    
                var v1 = "";
                try {
                    v1 = eval(sExp);
                } catch (E) {
                    alert("������: " + sExp + " ��ʽ����ȷ!");
                }
                this.Field(NavJs.textContent(oList[iList].childNodes[0])).Value = v1;
                //2011-03-16 ���Ͻ�����ֵ��text��ؼ�����
                this.fset_cont1(2, NavJs.textContent(oList[iList].childNodes[0]) );

            }
        }
    } else {	//�������ֶ� fset ==> dset
        for (var i = 0; i < this.FieldCount; i++) {
            if (this.Field(i).Type == "������") {
                for (var j = 0; j < this.oData.documentElement.childNodes.length - 1; j++) {
                    NavJs.textContent(this.oData.documentElement.childNodes[j].childNodes[i], this.Fields.Field[i].Value);
                }
            }
        }
    }
    fcpubdata.thisDataset = null;
}
/**
*��ʼ��grid�ؼ�
*@param iTag =1��ʾ�ս���ʱװ���,=2��ʾopenxml
**/
dataset.prototype.initGrid = function(iTag) {
    var format_empty = '��';
    var o = NavJs.getGridArr();
    for (var ii = 0; ii < o.length; ii++) {
        if (o[ii].getAttribute("dataset") == this.id) {
            var gridobj = $obj(o[ii].id);
            if (isSpace(gridobj.format) || new Eapi.Str().trim(gridobj.format) == "<cols></cols>") format_empty = "��";
            if (iTag == 2 || iTag == 4) format_empty = "��";
            /*����grid.format��
            <cols>
            <col>
            <fname>fstrcustomername</fname>
            <cname>�ͻ�����</cname>
            <width>16</width>
            <dtype>�ַ�</dtype>�ַ�/����/ʵ��
            </col>
            ...
            </cols>
            */

            var HeadRows = 1; //��������
            var SumCols = this.FieldCount; //������
            //���format��Ϊ���������ݼ��е��ֶζ������format��
            //alert(iTag)

            if (format_empty == "��") {
                var oXmlFormat = SetDom(gridobj.format);
                var sX = "<cols>";
                var jj = 0;
                for (var kk = 0; kk < this.oDataField.childNodes.length; kk++) {

                    var bool = false;
                    if (iTag == 2) { //�����
                        bool = true;
                    } else if (NavJs.textContent(this.oDataField.childNodes[kk].childNodes[15]) == "��") {  //visible
                        bool = true;
                    }

                    if (bool) {
                        sX += "<col><fname>" + this.Field(kk).FieldName + "</fname><cname>"
						+ this.Field(kk).DisplayLabel + "</cname><width>" + parseInt(this.Field(kk).Length)
						+ "</width><dtype>" + this.Field(kk).DataType + "</dtype>";
                        //jjΪ��������Ϣ�е��к�
                        sX += initFormatCol(oXmlFormat, jj);
                        jj++;
                        sX += "</col>";
                    }
                }
                sX += "</cols>";
                // alert(sX)
                gridobj.format = sX;
            }

            var oXml = SetDom(gridobj.format);


            //�ҵ���������
            HeadRows = 1;
            //alert(oXml.documentElement.childNodes.length)
            SumCols = oXml.documentElement.childNodes.length;

            //2006-01-27 ���������Ƶ���.���Ƕ���ͷ����ʱ,��OpenEmpty
            this.XmlRepGrid(gridobj);

            HeadRows = gridobj.FixRows;

            if (iTag == 1) {
                var tmprows = parseInt(gridobj.getAttribute("headrows"));
                if (isNaN(tmprows) == false) gridobj.FixRows = tmprows;

                //modify by liuxr at 2010-11-10 13:40 ��grid��Rows���Ը�ֵֵ��Ҫʹ��fnPutRows(n)����
                //gridobj.Rows = 1;  //��ֹwebgrid.htc��ִ��ɾ���ж�ʹ���治��ʾֵ.
                //gridobj.Rows = this.RecordCount+HeadRows;	//������
                gridobj.fnPutRows(1);  //��ֹwebgrid.htc��ִ��ɾ���ж�ʹ���治��ʾֵ.
                gridobj.fnPutRows(this.RecordCount + HeadRows); //������


                if (this.mbTagCol) {	//�ӱ����
                    SumCols++; //��û����������
                }
                //gridobj.Cols = SumCols;
                gridobj.fnPutCols(SumCols);

            }


            if (iTag == 4) {  //��ʼ��table�ڵ�colԪ��


            }
            //�ڱ���colԪ���ϼ���һ���Զ�������dsfield=�����ݼ��ֶ��б��е�˳���
            this.InitColField(gridobj);

            //���ϳ���������
            this.GridAddHref(gridobj);


            //�������еı���ÿһ�е��и�,�Է��и߱��
            if (IsTrue(gridobj.SetRowHeight)) {
                var tmpHeight = 21;

                if (gridobj.bodyrowheight == -1 || IsSpace(gridobj.bodyrowheight)) {
                    if (isNaN(parseInt(gridobj.tab.style.fontSize)) == false) tmpHeight = parseInt(gridobj.tab.style.fontSize) + 8;
                } else {
                    tmpHeight = gridobj.bodyrowheight;
                }

                for (var iirow = HeadRows; iirow < gridobj.Rows; iirow++) {
                    gridobj.tab.rows[iirow].style.height = tmpHeight + "px";
                }
            }
            //added by liuxr at 2009-5-14 ���û�����ù̶������ʼΪ�̶��и�ģʽ
            else {
                window.fc_tmp_grid_obj = $obj(o[ii].id);
                window.setTimeout("fc_tmp_grid_obj.ReCalRowHeight()", 200);
            }

            //           var isSetFirstRow = IsTrue(fcpubdata.area.getAttribute("allBrowser")) && Sys.Browser.agent != Sys.Browser.InternetExplorer;
            var isSetFirstRow = true; //Sys.Browser.agent != Sys.Browser.InternetExplorer;

            //��ÿ���п�
            var oXml = SetDom(gridobj.format);
            for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
                var curCol;
                if (this.mbTagCol)
                    curCol = i + 1;
                else
                    curCol = i;

                //����������col���������е�td����2013-04-02
                var objCol = null;
                if (isSetFirstRow) {
                    objCol = gridobj.tab.rows[0].cells[curCol];
                } else {
                    objCol = gridobj.tab.childNodes[0].childNodes[curCol];
                }

                //���Ǵ����Ƿ���ʾ
                var svisible = "";
                try {
                    svisible = NavJs.textContent(oXml.documentElement.childNodes[i].selectSingleNode("visible"));
                } catch (e) { }
                if (svisible == "��") {
                    //o[ii].tab.childNodes(0).childNodes(curCol).style.width=0
                } else {
                    var blnErr = false;
                    var sWidth = "60";
                    try {
                        sWidth = NavJs.textContent(oXml.documentElement.childNodes[i].childNodes[10]);
                    } catch (e) { blnErr = true; }
                    if (blnErr == false) {
                        objCol.style.width = ToInt(sWidth) + "px";

                    } else {
                        var sWidth = NavJs.getNodeValue11(oXml, i, 2);
                        //ȱʡ�п�Ϊ60,ÿ���ַ���Ϊ6px
                        var iWidth = isNaN(parseInt(sWidth)) ? 60 : parseInt(sWidth) * 6;
                        //������
                        // var titleinfo=oXml.documentElement.childNodes(i).childNodes(1).text;
                        //var titlelen=titleinfo.length*14;   //14Ϊһ���ֵ��ֿ�
                        //�������еĿ�ȴ����п�ʱ,ȡ�����еĿ�����п�
                        //if(iWidth<titlelen)iWidth=titlelen;
                        if (iWidth > 300) iWidth = 300;  //����п�Ϊ300
                        if (iWidth < 30) iWidth = 30;    //��С�п�Ϊ30
                        objCol.style.width = iWidth + "px";
                    }
                }

                //objCol = NavJs.child(NavJs.child(gridobj.tab, "colgroup", 0), "col", curCol); //gridobj.tab.childNodes[0].childNodes[curCol];
                //���ж��뷽ʽ:
                var blnErr = false;
                var sAlign = "left";
                try {
                    sAlign = NavJs.getNodeValue11(oXml, i, 11);
                } catch (e) { blnErr = true; }
                if (blnErr == false) {
                    objCol.align = sAlign;
                    //objCol.style.textAlign = sAlign;
                } else {
                    var sDtype = NavJs.getNodeValue11(oXml, i, 3);
                    if (sDtype == "����" || sDtype == "ʵ��") {
                        objCol.align = "right";
                    }
                }

                if (HeadRows == 1) {   //���б���
                    gridobj.tab.rows[0].cells[i + 1].align = "center";

                    //����������:���������ڱ�������֮��,�����־�ڱ�������֮ǰ��ֻ��һ���ַ�
                    //�����ʽ: ����%%http://www.sina.com.cn;sina
                    var sTitle = NavJs.getNodeValue11(oXml, i, 1);

                    sTitle = new Eapi.Str().repMark(sTitle);

                    var ii1 = sTitle.indexOf("%%");
                    var sTitle1 = "";
                    if (ii1 >= 0) {
                        sTitle1 = sTitle.substring(ii1 + 2, sTitle.length);
                        var arrtmp = sTitle1.split(";");
                        sTitle = sTitle.substring(0, ii1) + ' <a href="' + arrtmp[0] + '" target=_blank >' + arrtmp[1] + '</a>';
                        //alert(sTitle)
                    }

                    gridobj.tab.rows[0].cells[curCol].innerHTML = sTitle;
                }
            }

            SumCols = oXml.documentElement.childNodes.length;
            if (this.mbTagCol) {
                //����������col���������е�td����2013-04-02
                var objCol = null;
                if (isSetFirstRow) {
                    objCol = gridobj.tab.rows[0].cells[0];
                } else {
                    objCol = gridobj.tab.childNodes[0].childNodes[0];
                }

                //added by liuxr at 2009-5-22 �����ʾ�к���ѿ�ȶ���Ϊ"20"
                if (IsTrue(gridobj.blRowNo))
                    objCol.style.width = 20 + "px";
                else
                    objCol.style.width = 8 + "px";  //����и�8px��

            }

            if (HeadRows == 1) {   //���б���
                //����и�Ϊ1��ʾ�ڱ�������û�����и�
                var sHeight = gridobj.tab.rows[0].style.height;
                if (IsSpace(sHeight)) sHeight = "0";
                if (parseInt(sHeight) <= 5) { //��CommonSelect.htm��ʱ�����и�Ϊ3�����Դ˴��� 1 ==>5  2013-08-21
                    var iFontSize = parseInt(gridobj.tab.rows[0].style.fontSize);
                    if (isNaN(iFontSize)) iFontSize = 12; //Ĭ������Ϊ12px
                    gridobj.tab.rows[0].style.height = (iFontSize + 8) + "px"; //6
                }
                gridobj.tab.rows[0].align = "center";
            }


            gridobj.HScroll();  //���������
            gridobj.VScroll();



            gridobj.ReadOnly = false;
            /*    ���ÿ�е�����
            <col>
            <fname>spid</fname>
            <cname>ҩƷ����</cname>
            <width>11</width>
            <dtype>�ַ�</dtype>
            <readonly>��</readonly>
            <visible>��</visible>
            <unique>��</unique>
            <validate>��</validate>
            <sorted>��</sorted>
            <required>��</required><
            /col>
				
				*/
            //�����б༭��ʽ
            var oXml = SetDom(gridobj.format);
            var scoledit = "<root><readonly></readonly>";

            for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
                var s1 = NavJs.getNodeValue11(oXml, i, 4);
                if (s1 == "��") {
                    scoledit += "<readonly></readonly>";
                } else if (s1.substring(0, 1) == "ѡ") {
                    //modify by liuxr at 2009-7-16 �޸����û�����������������ʱ����"<code></code>"�������������һ�в��ܱ༭����
                    var stmp = s1.substring(1, s1.length);
                    if (stmp != "")
                        scoledit += unescape(stmp);    //"<code><xml>"+RepXml("<tr><td>��</td></tr><tr><td>��</td></tr>")+"</xml><format>"+RepXml("�Ƿ�!")+"</format></code>"
                    else
                        scoledit += "<code></code>";
                } else if (s1.substring(0, 1) == "��") {
                    scoledit += "<checkbox></checkbox>";
                    gridobj.SetCheckBoxCol(i + 1);
                } else if (s1.substring(0, 1) == "��") { //ֻ����ѡ��
                    scoledit += "<checkbox_readonly></checkbox_readonly>";
                    gridobj.SetCheckBoxCol(i + 1, true);
                } else if (NavJs.getNodeValue11(oXml, i, 3) == "�ַ�" || NavJs.getNodeValue11(oXml, i, 3) == "�Զ�" || NavJs.getNodeValue11(oXml, i, 3) == "����") {
                    scoledit += "<str><maxlength>" + NavJs.getNodeValue11(oXml, i, 2) + "</maxlength></str>";
                } else if (NavJs.getNodeValue11(oXml, i, 3) == "ʵ��") {
                    scoledit += "<double><pointnum>2</pointnum></double>";
                } else if (NavJs.getNodeValue11(oXml, i, 3) == "����") {
                    scoledit += "<int></int>";
                } else if (NavJs.getNodeValue11(oXml, i, 3) == "�ı�") {
                    scoledit += "<text></text>";
                }
                else if (NavJs.getNodeValue11(oXml, i, 3) == "ͼ��") {
                    scoledit += "<image></image>";
                }
            }
            scoledit += "</root>";
            //modify by liuxr at 2010-11-10 11:35 ��grid��Pu tcoledit���Ը�Ϊ������ֵ
            //o[ii].coledit = scoledit;
            gridobj.fnPutcoledit(scoledit);


            //����GRID���DIV�Ĵ�С
            gridobj.ResizeDiv();
            //added by liuxr at 2009-5-22 �����к�
            gridobj.ReCalRowNo();

            //Ϊ�˷�ֹ�������������ʾ�����и�,�������������������ʾ��.2004-09-23 add
            try { gridobj.tab.rows[0].cells[0].focus(); } catch (E) { }

        } //��ǰ������
    } //���end for

    //����OpenXmlData�����ݼ�ʱ,���ݼ�������Ϣ��ԭ����һ��ʱҪ��ȡԭ���е��п���Ϣ.
    function initFormatCol(oXmlFormat, iRow) {
        var s = "";
        try {  //�п��ܺ��������û����Щ���ݣ���Ϊ��
            s += "<readonly>" + NavJs.getNodeValue11(oXmlFormat, iRow, 4) + "</readonly>";
            s += "<visible></visible>" + "<u></u><v></v><s></s><r></r>" + "<columnwidth>" + NavJs.getNodeValue11(oXmlFormat, iRow, 10) + "</columnwidth>" + "<align>" + NavJs.getNodeValue11(oXmlFormat, iRow, 11) + "</align>";
        } catch (e) { };
        if (s == "") s = "<readonly>��</readonly>";
        return s;
    }
}
/**
*�ڱ���ϼ��ϳ�������
*@date 2004-01-02
**/
dataset.prototype.GridAddHref = function(ogrid) {

    //���ϳ���������
    var oList = this.oDataField.selectNodes("//field[link='��']");
    for (var iList = 0; iList < oList.length; iList++) {
        //var sFieldName=NavJs.textContent(oList.item(iList).childNodes[0]);
        var sFieldName = NavJs.textContent(oList[iList].childNodes[0]);
        var colno = this.FieldNameToColNo(ogrid, sFieldName);
        var totalrows = ogrid.Rows;
        for (var iirow = ogrid.FixRows; iirow < totalrows; iirow++) {
            //var s1=trim(NavJs.textContent(oList.item(iList).childNodes[14]));
            var s1 = new Eapi.Str().trim(NavJs.textContent(oList[iList].childNodes[14]));
            var s2 = s1;
            s1 = s1.toUpperCase();
            //������Ϊhttp��mailtoʱ��ʾֱ���Ե�ǰ��ʾ�����ݵ����ӵ�ַ
            if (s1 == "HTTP") {
                s2 = "http://" + new Eapi.Str().trim(ogrid.tab.rows[iirow].cells[colno].innerText);
            } else if (s1 == "MAILTO") {
                s2 = "mailto:" + new Eapi.Str().trim(ogrid.tab.rows[iirow].cells[colno].innerText);
            }
            //ogrid.tab.rows[iirow].cells[colno].innerHTML="<a target='" +NavJs.textContent(oList.item(iList).childNodes[13])
            ogrid.tab.rows[iirow].cells[colno].innerHTML = "<a target='" + NavJs.textContent(oList[iList].childNodes[13])
			 + "' href=" + s2 + " >" + ogrid.tab.rows[iirow].cells[colno].innerText
			 + "</a>";
        }
    }

}
/**
*��ʼ�������������ݼ��ֶ�֮��Ķ�Ӧ��ϵ.
*�ڱ���colԪ���ϼ���һ���Զ�������dsfield=�����ݼ��ֶ��б��е�˳���
**/
dataset.prototype.InitColField = function(ogrid) {
    if (ogrid.getAttribute("dataset") == this.id) {

        ogrid.hide();
        //�����ж�Ӧ��ϵ,�ڱ���<col>�м�������col no
        if (this.mbTagCol)
            var tmpj = 1;
        else
            var tmpj = 0;

        if (isSpace(ogrid.format) == false) {
            var oXml = SetDom(ogrid.format);

            var ll = oXml.documentElement.childNodes.length;
            for (var i = 0; i < ll; i++) {
                //����ϵ��ֶ���
                var sFname = NavJs.textContent(oXml.documentElement.childNodes[i].childNodes[0]).toUpperCase();
                for (var j = 0; j < this.oDataField.childNodes.length; j++) {
                    var sFname1 = NavJs.textContent(this.oDataField.childNodes[j].childNodes[0]);
                    if (sFname1.toUpperCase() == sFname) {
                        ogrid.tab.children[0].children[tmpj + i].setAttribute("dsfield", j);
                        break;
                    }
                }
            }
        }
    } // end if
}
/**
*�����ݼ��е�����==>DBgrid�ؼ���
**/
dataset.prototype.dset_cont = function() {

    var o = NavJs.getGridArr();
    for (var ii = 0; ii < o.length; ii++) {
        if (o[ii].getAttribute("dataset") == this.id) {
            var gridobj = $obj(o[ii].id);
            //alert(o[ii].tab.outerHTML)
            gridobj.hide();
            //�����ж�Ӧ��ϵ,�ڱ���<col>�м�������col no
            if (this.mbTagCol)
                var tmpj = 1;
            else
                var tmpj = 0;

            if (isSpace(gridobj.format) == false) {
                var oXml = SetDom(gridobj.format);
                for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
                    //����ϵ��ֶ���
                    var sFname = NavJs.getNodeValue11(oXml,i,0).toUpperCase();
                    for (var j = 0; j < this.oDataField.childNodes.length; j++) {
                        var sFname1 = NavJs.textContent(this.oDataField.childNodes[j].childNodes[0]);
                        if (sFname1.toUpperCase() == sFname) {
                            gridobj.tab.childNodes[0].childNodes[tmpj + i].setAttribute("dsfield", j);
                            break;
                        }
                    }
                }
                //--------��ֵ
                var tmpii = 0;
                for (var i = 0; i < gridobj.tab.rows.length - gridobj.FixRows; i++) {
                    tmpii = i + gridobj.FixRows;
                    for (var j = 0; j < gridobj.tab.childNodes[0].childNodes.length; j++) {
                        var sT = gridobj.tab.childNodes[0].childNodes[j].getAttribute("dsfield");
                        if (sT != null) {
                            sT = parseInt(sT);
                            if (i < this.oData.documentElement.childNodes.length - 1) {
                                if (gridobj.tab.rows[tmpii].cells[j].style.backgroundImage == "") {
                                    this.dset_cont_td(gridobj.tab.rows[tmpii].cells[j], this.fset_contall(this.Field(sT), NavJs.getNodeValue11(this.oData,i,sT)));
                                } else {
                                    this.dset_cont_td(gridobj.tab.rows[tmpii].cells[j], "");
                                    var v1 = NavJs.getNodeValue11(this.oData,i,sT);
                                    if (gridobj.tab.rows[tmpii].cells[j].style.backgroundImage.indexOf("checkdisabled.gif") >= 0) {
                                        if (IsTrue(v1))
                                            gridobj.tab.rows[tmpii].cells[j].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checkdisabled.gif)"
                                        else
                                            gridobj.tab.rows[tmpii].cells[j].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheckdisabled.gif)"

                                    } else {
                                        if (IsTrue(v1))
                                            gridobj.tab.rows[tmpii].cells[j].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checked.gif)"
                                        else
                                            gridobj.tab.rows[tmpii].cells[j].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheck.gif)"
                                    }
                                    gridobj.tab.rows[tmpii].cells[j].style.backgroundPosition = "center center";
                                }
                            } else {
                                this.dset_cont_td(gridobj.tab.rows[tmpii].cells[j], "");
                            }
                        }
                    }
                }
            } else {
                //�Զ���Ӧ

                for (var i = 0; i < gridobj.Rows - gridobj.FixRows; i++) {
                    tmpii = i + gridobj.FixRows;
                    for (j = 0; j < gridobj.Cols - 1; j++) {
                        if (i < this.oData.documentElement.childNodes.length - 1) {
                            if (gridobj.tab.rows[tmpii].cells[j + tmpj].style.backgroundImage == "") {
                                this.dset_cont_td(gridobj.tab.rows[tmpii].cells[j + tmpj], this.fset_contall(this.Field(j), NavJs.getNodeValue11(this.oData,i,j)));
                            } else {
                                this.dset_cont_td(gridobj.tab.rows[tmpii].cells[j + tmpj], "");
                                var v1 = NavJs.getNodeValue11(this.oData, tmpii, j);
                                if (gridobj.tab.rows[tmpii].cells[j + tmpj].style.backgroundImage.indexOf("checkdisabled.gif") >= 0) {
                                    if (IsTrue(v1))
                                        gridobj.tab.rows[tmpii].cells[j + tmpj].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checkdisabled.gif)"
                                    else
                                        gridobj.tab.rows[tmpii].cells[j + tmpj].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheckdisabled.gif)"

                                } else {

                                    if (IsTrue(v1))
                                        gridobj.tab.rows[tmpii].cells[j + tmpj].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checked.gif)"
                                    else
                                        gridobj.tab.rows[tmpii].cells[j + tmpj].style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheck.gif)"
                                }
                                gridobj.tab.rows[tmpii].cells[j + tmpj].style.backgroundPosition = "center center";
                            }

                        } else {
                            this.dset_cont_td(gridobj.tab.rows[tmpii].cells[j + tmpj], "");
                        }
                    }
                }  //end for

			} //end if
		} // end if
	} //end for
}
dataset.prototype.dset_cont_td = function(oTd, sValue) {
    ///��ֹ��������� 2012-04-13 my add

    var sInnerHtml = oTd.innerHTML;
    sInnerHtml = new Eapi.Str().trim(sInnerHtml);

    if (IsSpace(sInnerHtml) == false && sInnerHtml.substring(0, 3) == "<a ") {
        return;
    } else {
        oTd.innerText = sValue;
    }
}

/**
*��ʼ���ֶζ���
**/
dataset.prototype.initRowSet = function() {
    var hidecols = 0;
    this.Fields = new fnFields();
    //�������ֶε�ֵ
    for (var i = 0; i < this.FieldCount; i++) {
        if (this.oDataField.childNodes[i].childNodes.length > 15) {
            if (NavJs.textContent(this.oDataField.childNodes[i].childNodes[15]) == "��") hidecols++;
        }
        var f = this.fnField(this.oDataField.childNodes[i]); //fΪ�ɴ�.FieldName�ȵ��ֶζ���
        f.index = i; //���ֶ����ֶ��б��е�˳���
        f.colno = i - hidecols + 1; //���ֶ��ڱ��ؼ��е��к�;

        

        this.Fields.Add(f);
    }
    //added by liuxr at 2010-10-27 14:48 ��Fields���Ը�ֵ
    //this.Fields = this.oFields;
}
//�ֶζ���
function fnFields() {
    this.Field = new Array();
    this.Add = function(field) {
    /**
    *���ֶμ��뵽�ֶ�������
    *@param field ��һ���ֶζ���
    **/
        var n = field.FieldName;
        if (n != "") {
            this.Field[n] = field;
            //֧��ȫСд���ֶ���
            this.Field[n.toLowerCase()] = field;
            this.Field[this.Count] = field;
            field.Index = this.Count;
            this.Count++;
        }
    }

    //this.Clear = function() { this.Count = 0; this.Field = new Array(); };
    this.Count = 0;
    //this.Auto = true;
    //this.State;
}
/**
*���ڵ��е��ֶ���Ϣ�ӵ��ֶζ�����.
<field>
0	<fieldname> shl</fieldname>
1	<datatype>ʵ��</datatype>
2	<displaylabel>����</displaylabel>
3	<size>10</size>
4	<precision>0</precision>
5	<fieldkind>������</fieldkind>
6	<defaultvalue></defaultvalue>
7	<displayformat></displayformat>
8	<isnull>��</isnull>
9	<iskey>��</iskey> 
10	<valid>��</valid>
11	<procvalid>��</procvalid>
12	<link>��</link>
13	<target>_blank</target>
14	<href></href>
15	<visible>��</visible>
16	<primarykey>��</primarykey>

17	<fieldvalid>��</fieldvalid>	//�ֶ�������֤
18	<tag>��</tag>				//���û��Զ���

</field>

imgdataset �����ֶ���Ϊ28 

*@param hidecols Ϊ�����ص�����
**/
dataset.prototype.fnField = function(oNode){
    //���ֶν��и�ֵ
    var obj = new Object(); //new Field();
    obj.FieldName = NavJs.textContent(oNode.childNodes[0]);
    var s1 = NavJs.textContent(oNode.childNodes[1]);

    obj.DataType = s1;

    if (isSpace(this.format) && fcpubdata.dbStruDict != "" && fcpubdata.dbStruDict != "FC_ENTITY") {
        var ss1 = "";
        ss1 = SqlToField("select chnname from " + fcpubdata.dbStruDict + " where fdname='" + obj.FieldName + "'");

        if (isSpace(ss1) == false) {
            obj.DisplayLabel = ss1;
        } else {
            obj.DisplayLabel = NavJs.textContent(oNode.childNodes[2]);
        }

        obj.Length = SqlToField("select fdsize from " + fcpubdata.dbStruDict + " where fdname='" + obj.FieldName + "'");
        obj.DotLength = SqlToField("select fddec from " + fcpubdata.dbStruDict + " where fdname='" + obj.FieldName + "'");
    } else {
        obj.DisplayLabel = NavJs.textContent(oNode.childNodes[2]);
        obj.Length = NavJs.textContent(oNode.childNodes[3]);
        obj.DotLength = NavJs.textContent(oNode.childNodes[4]);
    }
    if (obj.DisplayLabel == "undefined")
        obj.DisplayLabel = "";
    //
    //alert(obj.DisplayLabel)
    //
    obj.DisplayLabel = new Eapi.Str().repMark(obj.DisplayLabel);

    //alert(oNode.xml)
    obj.Empty = NavJs.textContent(oNode.childNodes[8]);  //="��"��ʾ����Ϊ��
    obj.isKey = NavJs.textContent(oNode.childNodes[9]);  //="��"��ʾΨһ
    if (oNode.childNodes.length > 10) obj.valid = NavJs.textContent(oNode.childNodes[10]);  //="��"��ʾҪִ�г���У��
    obj.Type = NavJs.textContent(oNode.childNodes[5]);  //="������"��ʾһ���ֶ�
    obj.DefaultValue = NavJs.textContent(oNode.childNodes[6]); //Ĭ��ֵ
    obj.DisplayFormat = NavJs.textContent(oNode.childNodes[7]);  //��ʾ��ʽ��,��ʾҪǧ��λ

    if (oNode.childNodes.length > 17) {
        obj.primaryKey = NavJs.textContent(oNode.childNodes[16]); //�Ƿ��������ֶ�
        if (obj.primaryKey == "��" && IsSpace(this.firstKeyFieldName)) this.firstKeyFieldName = obj.FieldName;

        obj.fieldvalid = NavJs.textContent(oNode.childNodes[17]); //�ֶ�������֤
        obj.tag = NavJs.textContent(oNode.childNodes[18]); 	//�û��Զ���
    }
    return obj;


}
/**
* ��鲢�����ֶζ���
*@date 2008-01-07
**/
dataset.prototype.Field = function(NameOrIndex) {
    //���϶Ա�־��ֵ,�����Ͳ����ټӸı��־�Ĵ�����.
    if (this.bAdd == false) this.bEdit = true; // my add 2009-09-19

    var isName = isNaN(parseInt(NameOrIndex));

    var objF = this.Fields.Field[isName ? NameOrIndex.toLowerCase() : NameOrIndex];
    if (typeof objF == "undefined" && NameOrIndex != "") {
        var sQuot = "";
        if (isName) sQuot = "'"
        alert("����:" + this.id + ".Field(" + sQuot + NameOrIndex + sQuot + ") δ����!");
    }
    return objF;
}
/**
* �Ƿ��Ǳ����ݼ����ֶ���
*@param fieldName Ҫ�����ֶ���
*@return true/false
*@date 2008-01-09
**/
dataset.prototype.isFieldName = function(fieldName) {
    return typeof this.Fields.Field[fieldName.toLowerCase()] != "undefined";
}
/**
* ȡ�������ֶε��ֶ�˳���,��������
**/
dataset.prototype.getKeyFieldNo = function() {
    for (var i = 0; i < this.oDataField.childNodes.length; i++) {
        if (NavJs.textContent(this.oDataField.childNodes[i].childNodes[16]) == "��") {
            return i;
        }
    }
    return -1;
}
/**
*�����������ʾ.
*@param sMsg ��ʾ��Ϣ
*@param iTag ��dataValid�����д����ı�־��,=3 ʱ��ʾҪalert��ʾ
**/
dataset.prototype.RunValidError = function(sMsg, iTag) {


    if (IsSpace(sMsg)) return "";

    if (this.RecNo > 0) sMsg = "��" + (this.RecNo + 1) + "��" + sMsg;
    
    //��ѡ���˲�alert������Ϣʱ��ֱ�ӷ��ء�2012-11-17
    var isNotShow = (fcpubdata.area.getAttribute("alertType") == 2 || fcpubdata.area.getAttribute("alertType") == 3) && IsSpace(this.e_startRow); //
    if (isNotShow) return sMsg;

    //�ڱ���в�alert,�Զ��ָ���ֵ.��������ɢ�ؼ�����ʾ,ע����text�󶨵�onchange�¼�,
    //objfocusȡ������һ���ؼ�
    if (iTag == 3 && this.RecordCount > 0) alert(sMsg);
    return sMsg;
}

dataset.prototype.fnPutRecNo = function(vValue) {
    this.RecNo = vValue;
    //RecNoID.fireChange();
}
dataset.prototype.fnGetRecordData = function (ss) {
    //var ss = this.oData.documentElement.xml;
    //��һ�����ݼ��ļ�¼���ݵ�����
    var mRecordData = "";
    var istart = ss.indexOf("<root>");
    var iend = ss.lastIndexOf("<set><pages>");
    if (istart >= 0 && iend > istart) {
        mRecordData = ss.substring(istart + 6, iend);
    }
    return mRecordData;


}
dataset.prototype.dataset_fields1 = function(sSql, PageNo, PageSize, xmlField, callback, context) {
    //ִ�бȽϺ���ִ�д������в�ѯ��¼,��ע����û�м����ֶδ�
    //sField=��;�ָ����ֶ���
    //xmlField=<field><name>field1</name><sql>����ʱת��SQL,�˽ڵ��Ϊ��</sql></field>...
    //����Ƿ�XML�ַ�

    var sDsn = "";
    if (IsSpace(this.datasourceName) == false)
        sDsn = "&datasourceName=" + this.datasourceName;



    //--------------------------------------------
    var sXml = "<sql>" + RepXml(sSql) + "</sql>" + "<pageNo>" + PageNo + "</pageNo>" + "<pageSize>" + PageSize + "</pageSize>" + "<fields>" + xmlField + "</fields>";

    if (IsTrue(this.isSqlActionPage)) sXml += "<isSqlActionPage>1</isSqlActionPage>";

    //���ϵ�ǰ���̵Ȳ�����2013-05-21
    var wfName = $urlParam("wfName");
    var wfVersion = $urlParam("wfVersion");
    var actionId = $urlParam("actionId");
    var djsn = $urlParam("djsn");
    if (!(IsSpace(wfName) || IsSpace(wfVersion) || IsSpace(actionId) || IsSpace(djsn))) {
        sXml += "<wfField><wfName>" + wfName + "</wfName><wfVersion>" + wfVersion + "</wfVersion><actionId>" + actionId + "</actionId><djsn>" + djsn + "</djsn><tableName>"+this.id+"</tableName></wfField>";

    }

    //����֧��sql������2012-09-06
    var sqlParams = $id(this.id).getAttribute("sqlParams");
    if (!IsSpace(sqlParams)) sXml += sqlParams;

    var retX = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=dataset_fields1" + sDsn, sXml, callback, context);

    return retX;
}
/**
��XML����������
*@param sBigXml Ϊ�����ʱ���ɵĴ��XML,Ϊ��Ϊ�������
*@date 2003-12-23
**/
dataset.prototype.XmlRepGrid = function(ogrid, sBigXml) {
    if (IsSpace(ogrid.tab)) {
        ogrid.fnInit();
    }
    var sTab = ogrid.tab.outerHTML;
    var sTab1 = "";
    var sTab2 = "";
    var sColgroup = "<colgroup>"; //����Ϣ��
    var sTD = "";

    if (isSpace(sBigXml)) {
        var oXml = SetDom("<root><td></td></root>");
        var oData1 = this.oData.documentElement.cloneNode(true);
        oData1.removeChild(oData1.childNodes[oData1.childNodes.length - 1]);

        var arrList = new Array();
        var oList = null;
        if (this.oDataField != null) {

            oList = this.oDataField.selectNodes("field[visible='��']");

            //���㲻��ʾ�еĶ�Ӧ��ϵ
            for (var j = 0; j < oList.length; j++) {
                for (var jj = 0; jj < this.oDataField.childNodes.length; jj++) {
                    if (NavJs.textContent(oList[j].childNodes[0]) == NavJs.textContent(this.oDataField.childNodes[jj].childNodes[0])) {
                        arrList[j] = jj + 1;
                        break;
                    }
                }
            }
        }
        //----------------------------------------------

        //�����һ��
        for (var i = 0; i < oData1.childNodes.length; i++) {
            var oClone = oData1.childNodes[i].childNodes[0].cloneNode(false);

            //oClone.text = "";
            NavJs.textContent(oClone, "");
            oData1.childNodes[i].insertBefore(oClone, oData1.childNodes[i].childNodes[0]);

            //ɾ������ʾ����-----------------------
            var l1 = arrList.length - 1;
            for (var j = l1; j >= 0; j--) {
                //��û����ô������ɾ
                if (oData1.childNodes[i].childNodes.length - 1 >= arrList[j]) {
                    oData1.childNodes[i].removeChild(oData1.childNodes[i].childNodes[arrList[j]]);
                }
            }
            //-------------------------------------
        }

        var ilen = 0;
        if (oList != null) ilen = oList.length;

        var sumcols = this.FieldCount + 1 - ilen;
        for (var i = 0; i < sumcols; i++) {
            sColgroup += "<col>";
            sTD += "<TD></TD>";
        }
    } else {  //���������Ľ����
        var oXml = SetDom(sBigXml);

        var sumcols = oXml.documentElement.childNodes[0].childNodes.length;
        sColgroup += "<col style='width:80;'  >";
        sTD += "<TD></TD>";
        for (var i = 1; i < sumcols; i++) {
            sColgroup += "<col style='width:80;' align=right >";
            sTD += "<TD align=center >" + NavJs.textContent(oXml.documentElement.childNodes[oXml.documentElement.childNodes.length - 1].childNodes[1].childNodes[i].childNodes[2]) + "</TD>";
        }
        oXml.documentElement.removeChild(oXml.documentElement.childNodes[oXml.documentElement.childNodes.length - 1]);
    }


    sColgroup += "</colgroup>";

    //��<col>
    var iPos = sTab.indexOf(">");
    if (iPos > 0) {
        sTab1 = sTab.substring(0, iPos + 1);   //����table��һ��
    }

    if (isSpace($id(ogrid.id).getAttribute("multihead"))) {
        //��TD
        var iPos1 = sTab.toLowerCase().indexOf("<tr");
        var iPos = sTab.indexOf(">", iPos1);
        if (iPos > 0) {
            sTab2 = sTab.substring(iPos1, iPos + 1); //����TR��һ��
        }
       // if (IsTrue(fcpubdata.area.getAttribute("allBrowser")) && Sys.Browser.agent != Sys.Browser.InternetExplorer) {
       //     sColgroup = ""; //ֱ���ڱ������������п�2013-04-02
       // }
        sTab = sTab1 + sColgroup + sTab2 + sTD + "</tr> ";
    } else {
        ogrid.FixRows = parseInt($id(ogrid.id).getAttribute("headrows"));
        sTab = sTab1 + sColgroup + $id(ogrid.id).getAttribute("multihead");
    }
    //alert(ogrid.headrows+" "+sTab)
    if (isSpace(sBigXml)) {
        //modify by liuxr at 2010-11-15 10:55 .xml�����ڷ�IE��������²���ʹ�ã���NavJs.xml(node) �����������������
        var s1 = RemoveRoot(NavJs.xml(oData1));
    } else {
        var s1 = RemoveRoot(NavJs.xml(oXml.documentElement));
    }

    ogrid.LoadXml(sTab + s1 + "</table>");

}
///����ǰת�� 
///fieldNoΪ�ֶ�˳���,recNoΪ��¼��,��Ϊ-1 ���ʾΪ��ǰ��¼,��������ʱ,bRead=true ��ʾ��ȡʱת��,�����Ǳ���ǰת��
dataset.prototype.fieldTrans = function(fieldNo, recNo, bRead) {
    fcpubdata.thisDataset = this;
    var oDs = $obj(this.id);
    var fieldvalue = "";
    if (recNo == -1)
        fieldvalue = oDs.Field(fieldNo).Value;
    else
        fieldvalue = NavJs.getNodeValue11(oDs.oDom, recNo, fieldNo);

    if (fieldvalue == fcpubdata.noPermitTag) return fieldvalue;    
    
    var colno = 1;
    if (bRead) colno = 2;
    if (this.oXmlTrans.documentElement == null) return fieldvalue;
    var l = this.oXmlTrans.documentElement.childNodes.length;
    for (var i = 0; i < l; i++) {
        if (NavJs.getNodeValue11(this.oXmlTrans, i, 0) == oDs.Field(fieldNo).FieldName) {
            var ss = unescape(NavJs.getNodeValue11(this.oXmlTrans,i,colno));
            //ss = ss.trim();
            if (ss == "") return fieldvalue;
            if (recNo != -1) {
                fcpubdata.transRecNo = recNo;
                ss = RepStr(ss, "$f_value", "$fbak_value");
            }
            return eval(ss);
        }
    }
    return fieldvalue;
}