///<reference name="MicrosoftAjax.js" />
///<reference path="fcpub.js" />

function dataset(dsId) {
    this.id = dsId;

    this.dataset_mformat_isnull = false;

    /* 控件位置 */
    //this.left = 100, this.top = 50, this.width = 150, this.height = 20;
    /* 按钮宽度 */
    //this.mwidthButton = 17;
    /* 页号 */
    this.PageNo = 1;

    //this.mMainSql = ""; //
    this.opensql = "";

    /*  added by liuxr at 2010-11-1 13:46 给数据集的format属性赋值*/
    this.format = $id(this.id).getAttribute("format");

    /* Empty=yes 数据集中无记录,=one 有一条记录 =null 表示数据集对象没有打开,即OPENSQL为空无法建立数据集对象, =no 正常 */
    this.Empty = "null";

    /* true表示表格左边有一个标记列 */
    this.mbTagCol = true;
    /* 保存装入的XML数据 */
    this.XmlData = "";
    /* 保存改动后的XML数据,filter时用 */
    //this.XmlDataNew = "";
    /* 保存主DOM对象,此对象对应表格的显示 */
    this.oData;

    /* added by liuxr at 2010-10-27 11:26 增加oDom属性  */
    this.oDom;

    /* added by liuxr at 2010-10-29 10:26 增加xml属性  */
    this.xml;

    /* 删除Dom对象 
    var oDel;	
    var oDel=new ActiveXObject("Microsoft.XMLDOM");
    oDel.async=false;
    oDel.loadXML ("<root></root>");*/
    /* 过滤Dom对象 */
    //modify by liuxr at 2010-10-26 11:50 修改
    /*var oFilter=new ActiveXObject("Microsoft.XMLDOM");
    oFilter.async=false;
    oFilter.loadXML ("<root></root>");*/
    //this.oFilter = SetDom("<root></root>");
    /* =true表示数据集处于过滤状态 */
    //this.mbFilter = false;
    /* 保存字段DOM对象 */
    this.oDataField;
    /* 字段数 */
    this.FieldCount;
    /* 记录数 */
    this.RecordCount = 0;
    /* all记录数 */
    this.RecordCountAll;
    /* 页尺寸,缺省为5 */
    this.PageSize = -1;
    this.PageCount = 1;
    /* 查找时定位用 */
    //this.iFind = 0;
    /* 用作返回Fields属性 */
    //this.oFields;

    /* added by liuxr at 2010-10-27 14:47 增加Fields属性 */
    this.Fields;

    /* 保存linkobj,即和数据集绑定的非表格控件 */
    this.LinkObjs = new Array();

    /* 到头 */
    this.Bof = false;
    this.Eof = false;
    /* 记录号,从0开始 */
    this.RecNo = 0;

    /* 编辑状态 */
    this.bEdit = false;
    /* 增加状态 */
    this.bAdd = false;

    this.HideField = "";
    /* added by liuxr at 2010-11-5 11:00 数据集的记录数据的属性*/
    this.RecordData = "";
    this.DeletedData = "";
    //this.visible = false;


    //my add
    this.isNeedValid;
    this.isSqlActionPage = $id(this.id).getAttribute("isSqlActionPage");
    this.firstKeyFieldName = "";
    this.datasourceName = $id(this.id).getAttribute("datasourceName");
    
    this.oXmlTrans = SetDom($id(this.id).getAttribute("fieldtrans")); //数据转换的配置xml,
    fcpubdata.transRecNo = 0; //临时性的当前记录号,用在$fbak_value函数中
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
* 取本数据集的第一个主键字段名,可用于在数据集还没有Open时取.
**/
dataset.prototype.getFirstKeyFieldName = function() {
    if (isSpace(this.format) == false) {
        var oXml = SetDom(this.format);
        var oNode = oXml.documentElement.selectSingleNode("//field[primarykey='是']");
        if (oNode != null) {
            this.firstKeyFieldName = NavJs.textContent(oNode.childNodes[0]);
            return this.firstKeyFieldName;
        }
    }
}
/**
*将一标准格式的XML串装入为数据集对象
*用于交叉表中
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
用于将一计算好的（不是通过SQL语句计算来的）XML数据装入到数据集中,主要用这个来装入xml
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
//清空数据集中的记录,保存字段结构
*@date 2004-04-08
**/
dataset.prototype.ClearData = function() {
    //this.XmlData = "<root>"+this.oData.documentElement.childNodes[this.oData.documentElement.childNodes.length-1].xml+"</root>";
    this.XmlData = "<root>" + NavJs.xml(this.oData.documentElement.childNodes[this.oData.documentElement.childNodes.length - 1]) + "</root>";
    this.base_dset(3);

}
/**
*数据集中无记录来打开数据集.字段列表从format中取得
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
*打开数据集,
*通过一个KEY得SQL语句再完成数据集的装入工作
*返回""表示正常打开,否则返回错误提示.
*@param sSql 执行的SQL语句
*@param ismovepage = 是 表示不能初始化pageno
*curID=用于主子表联接时的联接ID
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

    //var oSelf = eval(uniqueID + ".id");  //当前数据集对象

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

        //因第一次以增加模式打开后又以修改模式打开时mPageSize=0
        if (this.PageSize == 0) this.PageSize = -1;
        //重新查询时初始化当前页号和记录号
        if (ismovepage != "是") {
            this.PageNo = 1;
            this.RecordCount = 0;
        }
        if (typeof callback == "function") {
            //比较成功,下面执行SQL
            this.dataset_fields1(RepOpenSql(sql), this.PageNo, this.PageSize, sFieldNameList, Function.createDelegate(this, function(result) {
                var sRet = result.value;
                //补上字段串
                this.XmlData = repStr(sRet, "<fields></fields>", this.format);
                if (isRunSqlErr(sql, this.XmlData, this)) return;
                this._OpenAfter(sql);
                callback(result);
            }), context);
        } else {
            //比较成功,下面执行SQL
            var sRet = this.dataset_fields1(RepOpenSql(sql), this.PageNo, this.PageSize, sFieldNameList);
            //alert(sRet)
            //补上字段串

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
            //mHideField 要隐藏的字段列表

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
            alert("SQL语句: " + sql + " 执行错误! 错误信息:" + mXmlData);
            CopyToPub(sql);
            objThis.OpenEmpty(); //让空打开,以免出现代码错..
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
*从数据库中取下一页的数据
**/
dataset.prototype.NextPage = function() {
    if (this.Empty == "yes") return;

    //  alert(mPageCount)
    if (this.PageNo < this.PageCount) {

        this.PageNo++;
        //base_dset(mopensql,mPageNo,mPageSize)
        //alert(mPageSize+" "+mPageNo+" "+mopensql)
        this.Open(this.opensql, "是");

    }
}
/**
*从数据库中取上一页的数据
**/
dataset.prototype.PrevPage = function() {
    if (this.Empty == "yes") return;

    if (this.PageNo > 1) {
        this.PageNo--;
        this.Open(this.opensql, "是");
        //base_dset(mopensql,mPageNo,mPageSize)
    }
}
/**
*从数据库中取第一页的数据
**/
dataset.prototype.FirstPage = function() {
    if (this.Empty == "yes") return;
    //   if(mPageNo<mPageCount){

    this.PageNo = 1;
    this.Open(this.opensql, "是");
    //   }
}
/**
*从数据库中取最后一页的数据
**/
dataset.prototype.LastPage = function() {
    if (this.Empty == "yes") return;

    //  if(mPageNo>1){
    this.PageNo = this.PageCount;
    this.Open(this.opensql, "是");
    //  }
}
/**
*根据字段类型及长度作常规检查.iTag=1时用于grid.ondatachange和cont1_onblur中,iTag=2时用于checkbeforeupdate中
*iTag=1时是由控件向fset送数时只发生校验事件,iTag=2是由fset向dset送数时检查.
*@param curOF 为字段对象,下有数据类型,长度等属性
*@param value 为要存入上面字段中的值,
*@param iTag 调用标志,整型,可为1,2  =1只发生事件不检查,=2只检查不发生事  
=3 即检查也发生事件 同时在函数中直接提示出来.
=4 即不检查也不发生事件
=5 只运行检查,用于保存单据前,错误信息通过多层传递给savebill函数中才alert出来,此时不赋值给fset
=6 做所有的工作,除了不提示错误信息外.只返回错误信息 2009-07-15 add
*@return 非空表示检查非法,""表示通过
**/
dataset.prototype.dataValid = function(curOF, value, iTag) { //iTag = 3,5,6

    if (typeof curOF == "undefined") return "";
    if (typeof value == "undefined") return "";
    if (curOF.Value == fcpubdata.noPermitTag) return "";
    
    if (curOF.DataType == "实数" || curOF.DataType == "整数") {
        value = RemoveComma(value);
    }

    if ((iTag == 2 || iTag == 3 || iTag == 5 || iTag == 6) && curOF.valid == "是") {
        //检查是否为空
        if (curOF.Empty == "是") {
            if (isSpace(new Eapi.Str().trim(value))) {
                return this.RunValidError(curOF.DisplayLabel + "不能为空! ", iTag);

            }
        }
        //检查在数据集中此字段是否唯一
        //        if (curOF.isKey == "是") {
        //            for (var ii = 0; ii < this.oData.documentElement.childNodes.length - 1; ii++) {
        //                if (ii != this.RecNo) {	//除去当前记录进行比较
        //                    if (value == NavJs.getNodeValue11(this.oData, ii, curOF.index)) {
        //                        return this.RunValidError(curOF.DisplayLabel + "的值重复! ", iTag);

        //                    }
        //                }
        //            }

        //        }


        if (isSpace(value) == false) {
            switch (curOF.DataType) {
                case "整数":
                    if (IsInt(value) == false) {
                        return this.RunValidError(curOF.DisplayLabel + "不是个整数 ", iTag);
                    }
                    break;
                case "实数":
                    if (IsNum(value) == false) {
                        return this.RunValidError(curOF.DisplayLabel + "不是个数字 ", iTag);
                    }
                    break;
                case "字符":
                    var iLen = curOF.Length;

                    if (isSpace(iLen) == false && iLen > 0) {
                        if (GetLength(value) > iLen) {
                            return this.RunValidError(curOF.DisplayLabel + "长度不能大于 " + iLen, iTag);
                        }
                    }
                    break;
                case "日期":
                    var oDate = new Eapi.DateParse().parse(value);
                    if (oDate == null) {
                        return this.RunValidError(curOF.DisplayLabel + "不是个合法日期! ", iTag);
                    }
                    break;

            }
        }


    }
    var oEvent = new Object(); //createEventObject();
    oEvent.type = "Valid";
    oEvent.FieldName = curOF.FieldName;
    oEvent.DisplayLabel = curOF.DisplayLabel;
    oEvent.FieldValue = value;  //保存在校验的值供事件中检查用.
    oEvent.DataSet = $obj(this.id); //保存数据集对象,用于$Valid函数的字段值不重复
    if (iTag == 1 || iTag == 3 || iTag == 5 || iTag == 6) {
        //发生数据检查事件
        oEvent.returnValue = "";

        //向fset给值前发生onvalid事件
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
    取得字符的实际长度,一个汉字算2
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
*grid控件的数据变化事件,用于向fset送数
* fieldObj 字段对象, newValue要更新的值 此两个参数用于E表控件中
**/
dataset.prototype.cont_onDataChange = function() {
    //
    //curObj1用于不通过事件调用时给此参数
    if (typeof (fieldObj) == "undefined" || typeof (newValue) == "undefined") {
        var curObj;
        try {
            curObj = NavJs.getEventObj();   //当前控件
            if (curObj.tagName != "webgrid" && curObj.tagName != "fc:webgrid") {
                curObj = GetDsGrid($obj(this.id));
            }
        } catch (e) {
            //找此DS所绑定的第一个表格。
            curObj = GetDsGrid($obj(this.id));
        }
        var value = curObj.curTD.innerText;  //要存入fset中的值

        //通过grid.format得到当前列所对应的数据集中的字段名
        var oXml = SetDom(curObj.format);
        var colNo = curObj.curTD.cellIndex;  //列号
        if (this.mbTagCol && colNo > 0) colNo--;
        if (colNo < 0) colNo = 0;
        var curFieldName = NavJs.getNodeValue11(oXml, colNo, 0); //0个节点为字段名
        var oEventDs = $obj(curObj.getAttribute("dataset"));
        var curOF = this.Field(curFieldName);   //当前字段对象
    } else {
        var curOF = fieldObj;
        var value = newValue;
    }
    var oEventDs = $obj(curObj.getAttribute("dataset"));
    
    //表格此处给值,做验证
    var sRet = oEventDs.dataValid(curOF, value, 3);
    if (sRet != "") {
        return;
    }

    oEventDs.bEdit = true;

    oEventDs.CalcCurLine(curOF); //计算当前行的实际计算项和汇总项



    //从fset回写控件,主要是要调用显示格式

    oEventDs.fset_cont(oEventDs.RecNo);
    //fset_cont1();

}
dataset.prototype.CalcCurLine = function(curOF) {
    ///计算当前行的实际计算项和汇总项
    //计算表达式----------
    //通过dataset format属性找到表达式及字段名
    var s11 = this.format;
    if (isSpace(s11) == false) {
        var oXml = SetDom(s11);
        fcpubdata.thisDataset = this;
        var oList = oXml.documentElement.selectNodes("//field[fieldkind='实际计算项']");
        for (var iList = 0; iList < oList.length; iList++) {

            //var sExp="ff('shl')*ff('dj')"
            var sExp = NavJs.textContent(oList[iList].childNodes[6]);
            var sFieldName = NavJs.textContent(oList[iList].childNodes[0]);
            var vValue = "";
            try {
                vValue = eval(sExp);
            } catch (E) {
                alert("字段: " + sFieldName + " 的默认值处公式不正确!");
            }
            this.Field(sFieldName).Value = vValue;
            //刷新计算字段的值到零散控件上
            this.fset_cont1(2, sFieldName);

            //放到表格上
            //var curRowNo=curObj.curTD.parentNode.rowIndex
            //通过表格的format属性,找到je字段所对应的列号

            //var sumColNo=FieldNameToColNo(curObj,sFieldName)
            //curObj.tab.rows(curRowNo).cells(sumColNo).innerText=fset_contall(Field(sFieldName))
        }
        oList = oXml.documentElement.selectNodes("//field[fieldkind='汇总项']");
        if (oList.length > 0)
            this.ReSum("只算fset"); //加上强行计算汇总项,2006-09-14 add

        fcpubdata.thisDataset = null;
    }
    //---------------------
    //向fset给值后发生onsettext事件
    //    var oEvent = createEventObject();
    //    oEvent.FieldName = curOF.FieldName;

    //    oEvent.ods = eval(uniqueID);
    //    onSetTextID.fire(oEvent); //用于当改动某个字段后要反算哪些字段值 gridsumcol

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
*计算 实际计算项 ,用于 cont_onDataChange 和 zlselect
*@param ogrid 表格对象
*@param curRow oData对象中的行号
*@date 2003-12-30
**/
dataset.prototype.LineSum = function(ogrid, curRow) {
    //alert(curRow)
    //	LineSumSub(curRow);  //当给了缺省值然后又要运行自定义公式
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
    this.Update("不检查");
    //}
    var s11 = this.format;
    if (isSpace(s11) == false) {
        var oXml = SetDom(s11);
        fcpubdata.thisDataset = this;
        var oList = oXml.documentElement.selectNodes("//field[fieldkind='实际计算项']");
        for (var iList = 0; iList < oList.length; iList++) {

            //var sExp="ff('shl')*ff('dj')"
            var sExp = NavJs.textContent(oList[iList].childNodes[6]);
            var sFieldName = NavJs.textContent(oList[iList].childNodes[0]);
            if (ogrid == null) { //用于copydataset
                this.dset_fset(curRow);

                var vValue = "";
                try {
                    vValue = eval(sExp);
                } catch (E) {
                    alert("字段: " + sFieldName + " 的默认值处公式不正确!");
                }

                //alert(sFieldName+" "+sExp+" "+vValue)
                NavJs.textContent(this.oData.documentElement.childNodes[curRow].childNodes[this.FieldNameToNo(sFieldName)], vValue);
            } else {	//只计算当前行 用于 cont_ondatachange
                var vValue = "";
                try {
                    vValue = eval(sExp);
                } catch (E) {
                    alert("字段: " + sFieldName + " 的默认值处公式不正确!");
                }
                this.Field(sFieldName).Value = vValue;
                //放到表格上
                var curRowNo = ogrid.curTD.parentNode.rowIndex;
                //通过表格的format属性,找到je字段所对应的列号

                var sumColNo = this.FieldNameToColNo(ogrid, sFieldName);
                ogrid.tab.rows[curRowNo].cells[sumColNo].innerText = this.fset_contall(this.Field(sFieldName));
            }
        }
        fcpubdata.thisDataset = null;
    }
}

/**
2011-05-26
计算本数据集的所有记录,计算实际计算项公式.
**/
dataset.prototype.SumAllRecord = function() {
    var s11 = this.format;
    if (IsSpace(s11)) return;
    var oXml = SetDom(s11);
    if (oXml.documentElement == null) return;
    fcpubdata.thisDataset = this;
    var oList = oXml.documentElement.selectNodes("//field[fieldkind='实际计算项']");
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
                alert("字段: " + sFieldName + " 的默认值处公式:" + NavJs.textContent(oList[iList].childNodes[6]) + "不正确!错误信息:" + E.description);
                return;
            }

            NavJs.textContent(this.oData.documentElement.childNodes[j].childNodes[iFieldNo], vValue);
        }
    }

    fcpubdata.thisDataset = null;
}
/**
*用于绑定控件的onblur事件
**/
dataset.prototype.cont1_onblur = function(ooEvent, oDropdownlist) {

    var curObj = NavJs.getEventObj();   //当前控件

    if (!IsSpace(curObj) && curObj.getAttribute("stopValid") == 1) return; //my add 2013-01-28,用于在text 的 onchange时valid出错后，不再运行数据集的验证。

    //    var isJsErr = false;
    //    try { //此处在dropdownlist控件上,在苹果中调用时会报 没有权限 的错误,在谷歌中会让 curObj = td对象,即取上次的事件对象.
    //        var tmp12 = curObj.parentNode;
    //    } catch (e) { isJsErr = true; }
    //    if (isJsErr || (curObj == null && IsSpace(ooEvent) == false)) {
    if (IsSpace(oDropdownlist) == false) {
        curObj = oDropdownlist;
    } else {
        //alert(curObj.outerHTML)
        //fieldset 或 checkbox

        //加上 combobox listbox checkboxlist radiolist 控件的名称字段值传递到数据集，2013-08-08
        var textFieldName = ""; //名称字段名
        var textFieldValue = ""; //名称字段值 
        if (curObj.parentNode.getAttribute("controltype") == "radio" || curObj.parentNode.getAttribute("controltype") == "checkbox") {
            curObj = curObj.parentNode;
        }
        if (curObj.tagName.toUpperCase() == "INPUT") {
            var curObjTmp = null;
            try {
                curObjTmp = curObj.parentNode.parentNode.parentNode.parentNode.parentNode; //由TD里到table外.
            } catch (ee) { }
            if (curObjTmp != null) {
                var tmpType = "";
                try {
                    tmpType = curObjTmp.getAttribute("controltype"); //因curObjTmp会是document而报错
                } catch (ee1) { }
                if (tmpType == "checkboxlist") {
                    curObj = curObjTmp;
                    curObj.value = GetDivCheckBoxValue(curObj, "");
                    textFieldName = curObj.getAttribute("textFieldName");
                    if (!IsSpace(textFieldName)) {
                        textFieldValue = GetDivCheckBoxValue(curObj, "是");
                    }
                }
                if (tmpType == "radiolist") {
                    curObj = curObjTmp;
                    curObj.value = GetDivRadioValue(curObj, "");
                    textFieldName = curObj.getAttribute("textFieldName");
                    if (!IsSpace(textFieldName)) {
                        textFieldValue = GetDivRadioValue(curObj, "是");
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
    var curOF = oEventDs.Field(curObj.getAttribute("field"));   //当前字段对象

    //alert(curObj.value)
    var svalue = curObj.value;

    //自定义控件时的处理 my add 2013-03-20
    if (IsSpace(oDropdownlist) == false) {
        var controlType = oDropdownlist.getAttribute("controltype");
        if (!IsSpace(controlType) && isWidget(controlType)) {
            var oo = new Eform.AllWidget().getRunObj(controlType);
            var retMsg = oo.contFset(curOF, svalue);
            if (!IsSpace(retMsg)) return retMsg;

        }
    } else {
        //保存换行符
        if (curObj.tagName.toUpperCase() == "TEXTAREA") {
            svalue = RepStr(svalue, "\r\n", "&#13;&#10;");
            svalue = RepStr(svalue, "\t", "&#9;");
        }
    }

    //根据字段类型及长度作常规检查.
    var iRet = oEventDs.dataValid(curOF, svalue, 3);
    //alert(iRet)
    if (iRet != "") {
        //记录没有通过的验证，在保存前再验证。 2013-07-25
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

        //会死循环
        //curObj.focus();
        return;
    }
    
    //赋上名称字段值到数据集中，2013-08-08
    if (!IsSpace(textFieldName) && !IsSpace(textFieldValue)) {
        // alert(textFieldName+":"+textFieldValue)
        //alert(svalue)
        oEventDs.Field(textFieldName).Value = textFieldValue;
    }

    oEventDs.CalcCurLine(curOF); //计算当前行的实际计算项和汇总项

    if (curOF.DataType == "实数" || curOF.DataType == "整数") {
        //从fset回写控件,主要是要调用显示格式
        oEventDs.fset_cont1(2, curOF.FieldName);
    }
    //fset_cont1(mRecNo);
    oEventDs.fset_cont(oEventDs.RecNo); //刷新表格

    var oDs = oEventDs; //eval(uniqueID);
    //alert("my3:" + oDs.e_startRow);
    if (typeof (oDs.e_startRow) != "undefined") { //此处不能用IsSpace，以防oDs.e_startRow=0
        new Eapi.EformEbiao().fset_cont2(oDs, curObj.parentNode); //刷新E表控件
    }

    oEventDs.bEdit = true;

}
/**
*处理radio控件向fset传数
**/
function radioclick() {
    //alert("radioclick")
    //radioclick1();
    radio_checkbox_click();
    
    //modify by liuxr at 2011-8-30 16:43 解决radio绑定数据集后选择出错的问题
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
*把界面上的控件装入LinkObjs数组
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
            //判断spin控件,怕出错所以加try
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


    var o = window.document.getElementsByTagName("div"); //新的checkbox
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
                        //added by liuxr at 2011-6-23 增加其他选项输入后的数据提交到数据集
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
    /////////2005-08-22  2010-06-02 my 去掉下边这段
    //  var o=window.document.all.tags("div")
    //  l=o.length;
    //  for(var i=0;i<l;i++){
    //    if(o[i].controltype == "upload") continue ; //upload不绑定
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
*宏使用的函数  计算汇总项用
*@param sFieldName 字段名
*@return 此字段的所有记录合计
**/
function sum(sFieldName) { return summaryFunc(sFieldName, "sum", fcpubdata.thisDataset); } //fcpubdata.thisDataset保存当前DS对象
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
    //加上当前的
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
*宏使用的函数  行间计算用
*@param sFieldName 字段名
*@return 此字段的值
**/
function $f_value(sFieldName) { //希望在设置时统一用$f_value这个函数,而在实际计算时会调用: ff  $fbak_value 这两种可能.
    var oThis = fcpubdata.thisDataset;
    var sexp = oThis.Field(sFieldName).DefaultValue;
    if (isSpace(sexp) == false && oThis.Field(sFieldName).Type == "实际计算项") {
        return eval(sexp);
    } else {
        var dsObj = oThis;
        var ReturnValue = dsObj.Field(sFieldName).Value;

        if (dsObj.Field(sFieldName).DataType == "实数")
            ReturnValue = (isNaN(parseFloat(ReturnValue, 10))) ? 0 : parseFloat(ReturnValue, 10);

        if (dsObj.Field(sFieldName).DataType == "整数")
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
*对数据集进行排序
*@param sortcol 要排序的列号,整形
*@param asc = "升序/降序" 
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
        //移到oSort中
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

    //added by liuxr at 2010-10-27 11:40 给oDom属性赋值
    this.oDom = this.oData;

    //added by liuxr at 2010-10-29 10:40 给xml属性赋值
    if (this.oData.documentElement != null) {
        //this.xml = this.oData.documentElement.xml;
        this.xml = NavJs.xml(this.oData.documentElement);
    }
    //added by liuxr at 2010-11-5 11:00 给RecordData属性赋值
    if (this.oData.documentElement != null) {
        //this.RecordData = fnGetRecordData(this.oData.documentElement.xml);
        this.RecordData = this.fnGetRecordData(NavJs.xml(this.oData.documentElement));
    }

    //alert(oData.xml)
    //表格总行数变化
    //var o=window.document.getElementsByTagName("webgrid");
    //modify by liuxr at 2010-11-15 11:48 初始化所有的grid控件的onload事件判断当前的浏览器获取webgrid的标签，因在IE下有<html xmlns:fc xmlns:v="urn:schemas-microsoft-com:vml">指定，所有不用前缀
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
    var SendRow = 0;  //送出的行
    var datatype = this.Field(sortcol).DataType;
    /*
    if(datatype=="实数" || datatype=="整数"){
    sMax=0
    }else{
    sMax=""
    }*/
    //alert(oData.documentElement.childNodes.length-1)
    for (var i = 0; i < this.oData.documentElement.childNodes.length - 1; i++) {
        var s1 = NavJs.textContent(this.oData.documentElement.childNodes[i].childNodes[sortcol]);
        if (datatype == "实数" || datatype == "整数") {
            s1 = parseFloat(s1);
            if (isNaN(s1)) s1 = 0;
        }
        //		alert("sMax:"+sMax+" "+"s1:"+s1)
        if (i == 0) sMax = s1;
        if (asc == "升序") {
            if (sMax > s1) {
                sMax = s1;  //取最小值送出
                SendRow = i;
            }
        } else {
            if (sMax < s1) {
                sMax = s1;  //取最大值送出
                SendRow = i;
            }
        }
    }

    return SendRow;
}

/**
*通过表格的format属性,找到je字段所对应的列号
*@param grid 为表格对象
*@param sFieldName 为字段名,
*@return 返回列号
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
*记录集增加一条记录
*将fset清空
*1 先在oData对象中加一个记录节点
*2 移动记录到尾
*@param sTag=强行加一行 用于多选时复制数据集
=不置表格的焦点 用于表单以新增状态进入时
*@param pos 整数,为插入的位置.给Insert方法用.第一条记录此值应为0	
**/
dataset.prototype.Append = function(sTag, pos) {
    var sRowState = "rowstate='new'"; //表示强行加上的行的行标识
    if (sTag != "强行加一行") {
        if (this.bAdd || this.bEdit) {
            var sErr = this.Update("提示错误信息");
            if (sErr != "") return sErr; //=1 因检查非法而无法update
        }
        //BeforeInsertID.fire();
        eval($id(this.id).getAttribute("BeforeInsert"));
        sRowState = "rowstate='add'";
    }
    //alert("new:"+mFieldCount)

    var sNode = "<root><tr " + sRowState + ">";
    for (var i = 0; i < this.FieldCount; i++) {
        //加上字段的默认值
        //alert(Field(i).Type+":"+Field(i).DefaultValue)
        if (this.Field(i).Type == "数据项" && isSpace(this.Field(i).DefaultValue) == false) {
            sNode += "<td>" + this.Field(i).DefaultValue + "</td>";
        } else if (this.Field(i).Type == "变量默认值" && isSpace(this.Field(i).DefaultValue) == false) {

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
    this.RecordCount = this.oData.documentElement.childNodes.length - 1; //改为和XML数据同步较好，2012-11-21

    if (sTag != "强行加一行") {

        //先放此事件暂于此	
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
                    if (sTag != "不置表格的焦点") {
                        var tmprow = gridobj.tab.rows.length - 1;
                        gridobj.SetFocus(gridobj.FindFirstTD(tmprow), "程序给焦点");
                    }

                } else {
                    var tmprow = pos + gridobj.FixRows;
                    gridobj.InsertRow(tmprow);
                    gridobj.SetFocus(gridobj.FindFirstTD(tmprow), "程序给焦点");
                }
                //滚动到最后一行
                gridobj.VscrollTo(gridobj.Vmax);
                //added by liuxr at 2009-5-22 重算行号
                gridobj.ReCalRowNo();
                gridobj.hide();
            }

        }

        this.bAdd = true;


        //移动当前记录指针指向最后一行
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
在当前位置插入一行记录
*@date 2004-03-03
**/
dataset.prototype.Insert = function() {
    this.Append("", this.RecNo);
}
/**
*复制增加
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
*提交到数据集之前执行的检查.主要检查Field(i).Value中的数据是否符合数据类型和是否为空等法则
*如果fset中的数和dset中的数一样则不检查,返回true
*根据Field(i)对象的结构来检查Field(i).Value值是否合法
*@return 检查不合法返回false,否则返回true
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
*将fset中的数据保存到数据集中
*@param novalid ="不检查" 表示不执行 checkbeforeupdate ,用于表格中
novalid ="提示错误信息" 表示在此要函数中提示错误信息
*@return 1 表示因检查非法而无法update
return "" 表示成功,否则是错误信息
**/
dataset.prototype.Update = function(novalid) {
    //alert(mbEdit)
    if (this.bEdit == false && this.bAdd == false) return "";
    if (novalid == "不检查") {
        var sRetErr = this.checkbeforeupdate(5);
        if (sRetErr != "") {
            //此时会提交非法的数据进数据集中.在grid的LostFocus时会
            //通知在保存前再检查此数据集的所有变动的数据
            this.isNeedValid = "yes";
            alert(sRetErr);
            return sRetErr;
        }
    } else {
        var sRetErr = this.checkbeforeupdate(6);
        if (sRetErr != "") {
            if (novalid == "提示错误信息") alert(sRetErr);
            return sRetErr;
        }
    }

    var sMsg = this.RunBeforeUpdate();
    if (sMsg != "") {
        if (novalid == "不检查") this.isNeedValid = "yes";
        if (novalid == "提示错误信息" || novalid == "不检查") alert(sMsg);
        return sMsg;
    }

    if (this.oData.documentElement.childNodes.length > 1) {
        //表示oData中有记录节点
        for (var i = 0; i < this.FieldCount; i++) {
            NavJs.textContent(this.oData.documentElement.childNodes[this.RecNo].childNodes[i],this.Field(i).Value);
        }
        if (this.oData.documentElement.childNodes[this.RecNo].getAttribute("rowstate") == "new")
            this.oData.documentElement.childNodes[this.RecNo].setAttribute("rowstate", "add");
        if (this.oData.documentElement.childNodes[this.RecNo].getAttribute("rowstate") != "add")
            this.oData.documentElement.childNodes[this.RecNo].setAttribute("rowstate", "edit");
    }
    //重新计算所有行的汇总项
    this.ReSum("只算fset");

    this.bEdit = false;
    this.bAdd = false;
    
    eval($id(this.id).getAttribute("AfterPost"));
    //AfterPostID.fire();

    return "";
}
//将提交之前事件做成一个方法来调用
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
*删除数据集中的记录,不能用Cancel取消
*@param type type=1表示不需要在oDel中增加节点,用于Cancel方法
**/
dataset.prototype.Delete = function(type) {
    if (this.oData.documentElement.childNodes.length <= 1) return;
    if (type != 1) {
        //BeforeDeleteID.fire();
        eval($id(this.id).getAttribute("BeforeDelete"));
        //add oDel对象
        var oTr = this.oData.documentElement.childNodes[this.RecNo];
        if (oTr.getAttribute("rowstate") != "add" && oTr.getAttribute("rowstate") != "del") {
            oTr.setAttribute("rowstate", "del");
            this.DeletedData += NavJs.xml(oTr);
        }
    }

    var curcol = 1; 	//因一个数据集只可能绑定到一个表格上.所以用此变量保留删除前的当前列供后面的置焦点用.
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
    this.RecordCount = this.oData.documentElement.childNodes.length - 1; //改为和XML数据同步较好，2012-11-21
    
    if (this.RecordCount > 0) {
        if (this.RecNo > 0) {
            this.RecNo--;
        }
        this.SetPos(this.RecNo);
        this.ReSum("只算fset");
        this.fset_cont1();
    }
    else {
        this.fset_setnull();
        //当记录数为0时清空绑定控件上的值
        this.fset_cont1(1);
    }
    this.bAdd = false;
    this.bEdit = false;
    if (this.RecordCount > 0) {
        var o = NavJs.getGridArr();
        for (var ii = 0; ii < o.length; ii++) {
            if (o[ii].getAttribute("dataset") == this.id) {
                var gridobj = $obj(o[ii].id);
                //置焦点
                gridobj.SetFocus(gridobj.tab.rows[this.RecNo + gridobj.FixRows].cells[curcol], "程序给焦点");
                //added by liuxr at 2009-5-22 重算行号
                gridobj.ReCalRowNo();
            }
        }
    }

    //AfterDeleteID.fire();
    eval($id(this.id).getAttribute("AfterDelete"));
}
/**
*到第一条记录
**/
dataset.prototype.MoveFirst = function() { return this.SetPos(-1); }
/**
*下一条记录
**/
dataset.prototype.MoveNext = function() { return this.SetPos(this.RecNo + 1); }
/**
*上一条记录
**/
dataset.prototype.MovePrev = function() { return this.SetPos(this.RecNo - 1); }
/**
*最后一条记录
**/
dataset.prototype.MoveLast = function() { return this.SetPos(this.RecordCount); }

/**
*记录定位,给好mBof,mEof,mRecNo这些变量的值
*@param pos pos为记录号,从0开始
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
*将字段集中的数据==>文本控件中
*@param type type=1表示清空界面 
        type=2 表示只回写当前字段(fieldname)的控件 用于cont1_onblur函数中回写数值的格式
**/
dataset.prototype.fset_cont1 = function(type, fieldname) {
    if (type == 1) {
        for (var i = 0; i < this.LinkObjs.length; i++) {
            if (this.LinkObjs[i].tagName.toUpperCase() == "LABEL") { //2010-08-13 将 SPAN ==> LABEL
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

                if (this.LinkObjs[i].tagName.toUpperCase() == "LABEL") { //2010-08-13 将 SPAN ==> LABEL
                    this.LinkObjs[i].innerText = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                } else if (this.LinkObjs[i].tagName.toUpperCase() == "IMG") {
                    if (!IsSpace(this.LinkObjs[i].getAttribute("field"))) {
                        if (IsSpace(stable)) {
                            alert("本数据集没有设置保存表名!");
                            continue;
                        }
                        if (IsSpace(this.firstKeyFieldName)) {
                            alert("本数据集没有设置主键字段!");
                            continue;
                        }

                        var s1 = "";
                        if (this.Field(this.LinkObjs[i].getAttribute("field")).DataType != "图象") {//判断保存图片还是保存图片路径 @fhj 2011-05-30
                            try {
                                s1 = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                                s1 = "../.." + s1;
                            } catch (e) {
                                alert(this.LinkObjs[i].getAttribute("field") + "字段在数据集中没有")
                                continue;
                            }
                        } else {

                            s1 = location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=readImage&sTablename=" + stable + "&sImgname=" + this.LinkObjs[i].getAttribute("field") + "&sKeyname=" + this.firstKeyFieldName + "&sKeyvalue=";

                            s1 += this.Field(this.firstKeyFieldName).Value;
                            s1 += "&random=" + Math.random();
                        }
                        this.LinkObjs[i].src = s1;
                    }
                } else if (this.LinkObjs[i].tagName.toUpperCase() == "TEXTAREA" && !IsSpace(this.LinkObjs[i].getAttribute("field")) && fcpubdata.databaseTypeName == "oracle" && this.Field(this.LinkObjs[i].getAttribute("field")).DataType == "文本") { //处理clob字段
                    if (IsSpace(this.firstKeyFieldName)) {
                        alert("本数据集没有设置主键字段!");
                        continue;
                    }

                    var primarykeyFieldValue = this.Field(this.firstKeyFieldName).Value;
                    if (IsSpace(primarykeyFieldValue) == false) {

                        var s1 = location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=readClob&sTablename=" + stable + "&sImgname=" + this.LinkObjs[i].getAttribute("field") + "&sKeyname=" + this.firstKeyFieldName + "&sKeyvalue=";

                        s1 += primarykeyFieldValue;
                        s1 += "&random=" + Math.random();
                        new Eapi.RunAjax().sendHttp(s1, "", function(result) {
                            //保存换行符, 2011-05-13
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
                        alert(this.LinkObjs[i].getAttribute("field") + "字段在数据集中没有"); continue;
                    }
                    SetCheckBoxValue(this.LinkObjs[i], v1);

                }
                //modify by liuxr at 2010-4-27 15:17 给checkboxlist控件赋值
                else if (this.LinkObjs[i].tagName.toUpperCase() == "DIV" && this.LinkObjs[i].getAttribute("controltype") == "checkboxlist") {
                    var v1 = "";
                    try {
                        v1 = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                    } catch (e) {
                        alert(this.LinkObjs[i].getAttribute("field") + "字段在数据集中没有"); continue;
                    }
                    SetDivCheckBoxValue(this.LinkObjs[i], v1, "", true);
                }
                //modify by liuxr at 2010-4-27 16:17 给radiolist控件赋值 divradio
                else if (this.LinkObjs[i].tagName.toUpperCase() == "DIV" && this.LinkObjs[i].getAttribute("controltype") == "radiolist") {
                    var v1 = "";
                    try {
                        v1 = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                    } catch (e) {
                        alert(this.LinkObjs[i].getAttribute("field") + "字段在数据集中没有"); continue;
                    }
                    SetDivRadioValue(this.LinkObjs[i], v1);
                }

                else {
                    var v1 = "";
                    try {
                        v1 = this.Field(this.LinkObjs[i].getAttribute("field")).Value;
                    } catch (e) {
                        alert(this.LinkObjs[i].getAttribute("field") + "字段在数据集中没有")
                        continue;
                    }
                    v1 = this.fset_contall(this.Field(this.LinkObjs[i].getAttribute("field")));

                    //保存换行符
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
*从fset向界面上的控件传数时要调用此函数,用于做ongettext事件和处理实数的千分位和小数位数等
*@param oF 字段对象
*@param v1 此字段的值
*@date 2003-11-27
**/
dataset.prototype.fset_contall = function(oF, v1) {
    if (typeof oF == "undefined") return "";
    if (oF.Value == fcpubdata.noPermitTag) return "";
    if (typeof v1 == "undefined") {
        var v1 = oF.Value;
    }

    //加处理日期的显示格式.
    if (oF.DataType == "日期") {
        var sFormat = oF.DisplayFormat;
        if (IsSpace(sFormat) == false && IsSpace(v1) == false) {
            var oDate = new Eapi.DateParse().parse(v1); 
            if (oDate != null) {
                v1 = oDate.format(sFormat);
            }
        }
    }

    if (oF.DataType == "实数") {
        v1 = ContDec(v1, oF.DotLength);
    }
    //处理千分位
    if (oF.DataType == "实数" || oF.DataType == "整数") {
        var s1 = oF.DisplayFormat;
        if (s1.indexOf(",") >= 0) {
            v1 = AddComma(v1);
        }
    }
    return v1;
    /**
    *从数据集到控件: 按千分位加上,号. 在dataset.htc 的 fset_contall 函数中调用
    *@param sSour 处理原串
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
*将字段集中===>grid控件中的数据
*@param r r=0表示第一条记录
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
                if (r < gridobj.FixRows) r = r + gridobj.FixRows; //2008-06-26 add ,以防写到标题行上.
                //alert(r)
            } else if (r >= gridobj.tab.rows.length) {
                break;
            }

            for (var i = 1; i < gridobj.tab.childNodes[0].childNodes.length; i++) {
                //字段和表格的列可能不对应
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
                    if (sReadOnly == null && this.Field(ifieldno).Type == "数据项") { //只读
                        v1 = this.Field(ifieldno).Value;

                    } else {
                        v1 = this.fset_contall(this.Field(ifieldno));
                    }
                    if (gridobj.tab.rows[r].cells[i].innerText == gridobj.tab.rows[r].cells[i].innerHTML) { //表示不是超链接
                        gridobj.tab.rows[r].cells[i].innerText = v1;

                        //modify by liuxr at 2010-12-6 17:49 TD上输入内容后重新计算行高
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
*由字段名称求字段号.
*@param name 字段名称
*@return 字段顺序号
**/
dataset.prototype.FieldNameToNo = function(name) {
    var index = 0;
    try {
        index = this.Field(name).index;
    } catch (e) { };
    return index;
}
/**
*由字段号求字段名称.
*@param name 字段名称
*@return 字段顺序号
**/
dataset.prototype.FieldNoToName = function(no) {
    return (this.oDataField.childNodes[no].childNodes[0]);
}
/**
*从mXmlData中装入数据==>数据集中
*@param iTag 未定义表示正常使用，=1表示刚进入时装入空 =2用于交叉表时装入数据 =3 用清空数据集时，=4 表示装入用自己的程序生成的数据集XML数据用
**/
dataset.prototype.base_dset = function(iTag) {
    //
    //alert(mXmlData)
    this.oData = SetDom(this.XmlData);
    if (this.oData.documentElement == null) {
        alert(this.XmlData);
        return;
    }
    //added by liuxr at 2010-10-27 11:40 给oDom属性赋值
    this.oDom = this.oData;
    //added by liuxr at 2010-10-29 10:40 给xml属性赋值
    if (this.oData.documentElement != null) {
        //modify by liuxr at 2010-11-15 10:55 .xml属性在非IE的浏览器下不能使用，用NavJs.xml(node) 方法兼容其他浏览器
        this.xml = NavJs.xml(this.oData.documentElement);
    }
    //added by liuxr at 2010-11-5 11:00 给RecordData属性赋值
    if (this.oData.documentElement != null) {
        this.RecordData = this.fnGetRecordData(NavJs.xml(this.oData.documentElement));
    }


    //added by liuxr at 2010-11-1 14:05 给数据集的RecordCount属性赋值
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

    this.initRowSet(); //初始化字段对象

    //alert(this.oXmlTrans.documentElement);
    //-------------------
    //处理读出时转换 2008-03-06
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
    //后处理


    this.initGrid(iTag);    //初始化绑定表格控件

    this.ReSum("只算fset");  //初始化汇总项字段的fset


    if (this.RecordCount > 0) {
        this.MoveFirst();
    } else {
        //清空绑定的非表格控件
        this.dset_fset();
        this.fset_cont1();
    }

}
/**
* 清空fset中的值
*@date 2008-01-06
**/
dataset.prototype.fset_setnull = function() {
    for (var i = 0; i < this.FieldCount; i++) {
        if (this.RecordCount == 0) this.Field(i).Value = "";
    }
}
/**
*将dset==>fset 用于setpos方法中 ,给curRow 用于 LineSum 中
**/
dataset.prototype.dset_fset = function(curRow) {
    if (typeof curRow == "undefined") curRow = this.RecNo;
    for (var i = 0; i < this.FieldCount; i++) {
        if (this.Field(i).Type != "汇总项") {
            if (this.RecordCount == 0) {
                this.Field(i).Value = "";
            } else {
                this.Field(i).Value = NavJs.textContent(this.oData.documentElement.childNodes[curRow].childNodes[i]);
                
            }
        }
    }

}

/**
*重新计算汇总项的值,并给值给oData对象,用于打印前
*@param sTag = "只算fset" 表示计算汇总项字段的fset值, 为空表示将汇总项字段的fset中的值给数据集中
*@date 2003-12-15
**/
dataset.prototype.ReSum = function(sTag) {
    fcpubdata.thisDataset = this;
    if (sTag == "只算fset") {
        if (isSpace(this.format) == false) {
            var oXml = SetDom(this.format);

            var oList = oXml.documentElement.selectNodes("//field[fieldkind='汇总项']");
            for (var iList = 0; iList < oList.length; iList++) {
                var sExp = NavJs.textContent(oList[iList].selectSingleNode("defaultvalue"));
                //modify by liuxr at 2010-11-22 计算公式加上当前数据集对象
                //                if (sExp.indexOf("sum") >= 0) {
                //                    var re = /sum/g;
                //                    sExp = sExp.replace(re, this.id + ".sum");
                //                }
                //上面还没有处理 avg min max 三个公式    
                var v1 = "";
                try {
                    v1 = eval(sExp);
                } catch (E) {
                    alert("汇总项: " + sExp + " 公式不正确!");
                }
                this.Field(NavJs.textContent(oList[iList].childNodes[0])).Value = v1;
                //2011-03-16 加上将汇总值向text类控件传递
                this.fset_cont1(2, NavJs.textContent(oList[iList].childNodes[0]) );

            }
        }
    } else {	//汇总项字段 fset ==> dset
        for (var i = 0; i < this.FieldCount; i++) {
            if (this.Field(i).Type == "汇总项") {
                for (var j = 0; j < this.oData.documentElement.childNodes.length - 1; j++) {
                    NavJs.textContent(this.oData.documentElement.childNodes[j].childNodes[i], this.Fields.Field[i].Value);
                }
            }
        }
    }
    fcpubdata.thisDataset = null;
}
/**
*初始化grid控件
*@param iTag =1表示刚进入时装入空,=2表示openxml
**/
dataset.prototype.initGrid = function(iTag) {
    var format_empty = '否';
    var o = NavJs.getGridArr();
    for (var ii = 0; ii < o.length; ii++) {
        if (o[ii].getAttribute("dataset") == this.id) {
            var gridobj = $obj(o[ii].id);
            if (isSpace(gridobj.format) || new Eapi.Str().trim(gridobj.format) == "<cols></cols>") format_empty = "是";
            if (iTag == 2 || iTag == 4) format_empty = "是";
            /*分析grid.format串
            <cols>
            <col>
            <fname>fstrcustomername</fname>
            <cname>客户编码</cname>
            <width>16</width>
            <dtype>字符</dtype>字符/整数/实数
            </col>
            ...
            </cols>
            */

            var HeadRows = 1; //标题行数
            var SumCols = this.FieldCount; //总列数
            //如果format串为空则由数据集中的字段对象产生format串
            //alert(iTag)

            if (format_empty == "是") {
                var oXmlFormat = SetDom(gridobj.format);
                var sX = "<cols>";
                var jj = 0;
                for (var kk = 0; kk < this.oDataField.childNodes.length; kk++) {

                    var bool = false;
                    if (iTag == 2) { //交叉表
                        bool = true;
                    } else if (NavJs.textContent(this.oDataField.childNodes[kk].childNodes[15]) == "是") {  //visible
                        bool = true;
                    }

                    if (bool) {
                        sX += "<col><fname>" + this.Field(kk).FieldName + "</fname><cname>"
						+ this.Field(kk).DisplayLabel + "</cname><width>" + parseInt(this.Field(kk).Length)
						+ "</width><dtype>" + this.Field(kk).DataType + "</dtype>";
                        //jj为表格的列信息中的列号
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


            //找到标题行数
            HeadRows = 1;
            //alert(oXml.documentElement.childNodes.length)
            SumCols = oXml.documentElement.childNodes.length;

            //2006-01-27 将此两行移到此.考虑多层表头输入时,用OpenEmpty
            this.XmlRepGrid(gridobj);

            HeadRows = gridobj.FixRows;

            if (iTag == 1) {
                var tmprows = parseInt(gridobj.getAttribute("headrows"));
                if (isNaN(tmprows) == false) gridobj.FixRows = tmprows;

                //modify by liuxr at 2010-11-10 13:40 给grid的Rows属性赋值值需要使用fnPutRows(n)方法
                //gridobj.Rows = 1;  //防止webgrid.htc中执行删除行而使界面不显示值.
                //gridobj.Rows = this.RecordCount+HeadRows;	//标题行
                gridobj.fnPutRows(1);  //防止webgrid.htc中执行删除行而使界面不显示值.
                gridobj.fnPutRows(this.RecordCount + HeadRows); //标题行


                if (this.mbTagCol) {	//加标记列
                    SumCols++; //暂没考虑隐藏列
                }
                //gridobj.Cols = SumCols;
                gridobj.fnPutCols(SumCols);

            }


            if (iTag == 4) {  //初始化table内的col元素


            }
            //在表格的col元素上加了一个自定义属性dsfield=在数据集字段列表中的顺序号
            this.InitColField(gridobj);

            //加上超级链接列
            this.GridAddHref(gridobj);


            //给单据中的表格的每一行的行高,以防行高变大
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
            //added by liuxr at 2009-5-14 如果没有设置固定行则初始为固定行高模式
            else {
                window.fc_tmp_grid_obj = $obj(o[ii].id);
                window.setTimeout("fc_tmp_grid_obj.ReCalRowHeight()", 200);
            }

            //           var isSetFirstRow = IsTrue(fcpubdata.area.getAttribute("allBrowser")) && Sys.Browser.agent != Sys.Browser.InternetExplorer;
            var isSetFirstRow = true; //Sys.Browser.agent != Sys.Browser.InternetExplorer;

            //给每列列宽
            var oXml = SetDom(gridobj.format);
            for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
                var curCol;
                if (this.mbTagCol)
                    curCol = i + 1;
                else
                    curCol = i;

                //区别是设置col对象还是首行的td对象，2013-04-02
                var objCol = null;
                if (isSetFirstRow) {
                    objCol = gridobj.tab.rows[0].cells[curCol];
                } else {
                    objCol = gridobj.tab.childNodes[0].childNodes[curCol];
                }

                //考虑此列是否显示
                var svisible = "";
                try {
                    svisible = NavJs.textContent(oXml.documentElement.childNodes[i].selectSingleNode("visible"));
                } catch (e) { }
                if (svisible == "否") {
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
                        //缺省列宽为60,每个字符宽为6px
                        var iWidth = isNaN(parseInt(sWidth)) ? 60 : parseInt(sWidth) * 6;
                        //标题行
                        // var titleinfo=oXml.documentElement.childNodes(i).childNodes(1).text;
                        //var titlelen=titleinfo.length*14;   //14为一个字的字宽
                        //当标题行的宽度大于列宽时,取标题行的宽度作列宽
                        //if(iWidth<titlelen)iWidth=titlelen;
                        if (iWidth > 300) iWidth = 300;  //最大列宽为300
                        if (iWidth < 30) iWidth = 30;    //最小列宽为30
                        objCol.style.width = iWidth + "px";
                    }
                }

                //objCol = NavJs.child(NavJs.child(gridobj.tab, "colgroup", 0), "col", curCol); //gridobj.tab.childNodes[0].childNodes[curCol];
                //给列对齐方式:
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
                    if (sDtype == "整数" || sDtype == "实数") {
                        objCol.align = "right";
                    }
                }

                if (HeadRows == 1) {   //单行标题
                    gridobj.tab.rows[0].cells[i + 1].align = "center";

                    //给标题名称:超级链接在标题正文之后,排序标志在标题正文之前且只有一个字符
                    //标题格式: 标题%%http://www.sina.com.cn;sina
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
                //区别是设置col对象还是首行的td对象，2013-04-02
                var objCol = null;
                if (isSetFirstRow) {
                    objCol = gridobj.tab.rows[0].cells[0];
                } else {
                    objCol = gridobj.tab.childNodes[0].childNodes[0];
                }

                //added by liuxr at 2009-5-22 如果显示行号则把宽度定义为"20"
                if (IsTrue(gridobj.blRowNo))
                    objCol.style.width = 20 + "px";
                else
                    objCol.style.width = 8 + "px";  //标记列给8px宽

            }

            if (HeadRows == 1) {   //单行标题
                //如果行高为1表示在表单工具中没设置行高
                var sHeight = gridobj.tab.rows[0].style.height;
                if (IsSpace(sHeight)) sHeight = "0";
                if (parseInt(sHeight) <= 5) { //在CommonSelect.htm中时标题行高为3，所以此处由 1 ==>5  2013-08-21
                    var iFontSize = parseInt(gridobj.tab.rows[0].style.fontSize);
                    if (isNaN(iFontSize)) iFontSize = 12; //默认字体为12px
                    gridobj.tab.rows[0].style.height = (iFontSize + 8) + "px"; //6
                }
                gridobj.tab.rows[0].align = "center";
            }


            gridobj.HScroll();  //重算滚动条
            gridobj.VScroll();



            gridobj.ReadOnly = false;
            /*    表格每列的属性
            <col>
            <fname>spid</fname>
            <cname>药品内码</cname>
            <width>11</width>
            <dtype>字符</dtype>
            <readonly>否</readonly>
            <visible>是</visible>
            <unique>否</unique>
            <validate>否</validate>
            <sorted>否</sorted>
            <required>否</required><
            /col>
				
				*/
            //计算列编辑方式
            var oXml = SetDom(gridobj.format);
            var scoledit = "<root><readonly></readonly>";

            for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
                var s1 = NavJs.getNodeValue11(oXml, i, 4);
                if (s1 == "是") {
                    scoledit += "<readonly></readonly>";
                } else if (s1.substring(0, 1) == "选") {
                    //modify by liuxr at 2009-7-16 修改如果没有设置下拉框的内容时加上"<code></code>"，否则会出现最后一列不能编辑问题
                    var stmp = s1.substring(1, s1.length);
                    if (stmp != "")
                        scoledit += unescape(stmp);    //"<code><xml>"+RepXml("<tr><td>是</td></tr><tr><td>否</td></tr>")+"</xml><format>"+RepXml("是否活动!")+"</format></code>"
                    else
                        scoledit += "<code></code>";
                } else if (s1.substring(0, 1) == "勾") {
                    scoledit += "<checkbox></checkbox>";
                    gridobj.SetCheckBoxCol(i + 1);
                } else if (s1.substring(0, 1) == "灰") { //只读复选框
                    scoledit += "<checkbox_readonly></checkbox_readonly>";
                    gridobj.SetCheckBoxCol(i + 1, true);
                } else if (NavJs.getNodeValue11(oXml, i, 3) == "字符" || NavJs.getNodeValue11(oXml, i, 3) == "自定" || NavJs.getNodeValue11(oXml, i, 3) == "日期") {
                    scoledit += "<str><maxlength>" + NavJs.getNodeValue11(oXml, i, 2) + "</maxlength></str>";
                } else if (NavJs.getNodeValue11(oXml, i, 3) == "实数") {
                    scoledit += "<double><pointnum>2</pointnum></double>";
                } else if (NavJs.getNodeValue11(oXml, i, 3) == "整数") {
                    scoledit += "<int></int>";
                } else if (NavJs.getNodeValue11(oXml, i, 3) == "文本") {
                    scoledit += "<text></text>";
                }
                else if (NavJs.getNodeValue11(oXml, i, 3) == "图象") {
                    scoledit += "<image></image>";
                }
            }
            scoledit += "</root>";
            //modify by liuxr at 2010-11-10 11:35 把grid的Pu tcoledit属性改为方法赋值
            //o[ii].coledit = scoledit;
            gridobj.fnPutcoledit(scoledit);


            //调整GRID外的DIV的大小
            gridobj.ResizeDiv();
            //added by liuxr at 2009-5-22 重算行号
            gridobj.ReCalRowNo();

            //为了防止点击表格后重新显示表格的行高,加上下面此行让它先显示好.2004-09-23 add
            try { gridobj.tab.rows[0].cells[0].focus(); } catch (E) { }

        } //当前表格结束
    } //表格end for

    //当有OpenXmlData打开数据集时,数据集的列信息和原来不一样时要先取原有列的列宽信息.
    function initFormatCol(oXmlFormat, iRow) {
        var s = "";
        try {  //有可能后面的列中没有这些数据，则为空
            s += "<readonly>" + NavJs.getNodeValue11(oXmlFormat, iRow, 4) + "</readonly>";
            s += "<visible></visible>" + "<u></u><v></v><s></s><r></r>" + "<columnwidth>" + NavJs.getNodeValue11(oXmlFormat, iRow, 10) + "</columnwidth>" + "<align>" + NavJs.getNodeValue11(oXmlFormat, iRow, 11) + "</align>";
        } catch (e) { };
        if (s == "") s = "<readonly>是</readonly>";
        return s;
    }
}
/**
*在表格上加上超级链接
*@date 2004-01-02
**/
dataset.prototype.GridAddHref = function(ogrid) {

    //加上超级链接列
    var oList = this.oDataField.selectNodes("//field[link='是']");
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
            //当设置为http或mailto时表示直接以当前显示的内容当链接地址
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
*初始化表格的列与数据集字段之间的对应关系.
*在表格的col元素上加了一个自定义属性dsfield=在数据集字段列表中的顺序号
**/
dataset.prototype.InitColField = function(ogrid) {
    if (ogrid.getAttribute("dataset") == this.id) {

        ogrid.hide();
        //计算列对应关系,在表格的<col>中加上属性col no
        if (this.mbTagCol)
            var tmpj = 1;
        else
            var tmpj = 0;

        if (isSpace(ogrid.format) == false) {
            var oXml = SetDom(ogrid.format);

            var ll = oXml.documentElement.childNodes.length;
            for (var i = 0; i < ll; i++) {
                //表格上的字段名
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
*将数据集中的数据==>DBgrid控件上
**/
dataset.prototype.dset_cont = function() {

    var o = NavJs.getGridArr();
    for (var ii = 0; ii < o.length; ii++) {
        if (o[ii].getAttribute("dataset") == this.id) {
            var gridobj = $obj(o[ii].id);
            //alert(o[ii].tab.outerHTML)
            gridobj.hide();
            //计算列对应关系,在表格的<col>中加上属性col no
            if (this.mbTagCol)
                var tmpj = 1;
            else
                var tmpj = 0;

            if (isSpace(gridobj.format) == false) {
                var oXml = SetDom(gridobj.format);
                for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
                    //表格上的字段名
                    var sFname = NavJs.getNodeValue11(oXml,i,0).toUpperCase();
                    for (var j = 0; j < this.oDataField.childNodes.length; j++) {
                        var sFname1 = NavJs.textContent(this.oDataField.childNodes[j].childNodes[0]);
                        if (sFname1.toUpperCase() == sFname) {
                            gridobj.tab.childNodes[0].childNodes[tmpj + i].setAttribute("dsfield", j);
                            break;
                        }
                    }
                }
                //--------给值
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
                //自动感应

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
    ///防止冲掉超链接 2012-04-13 my add

    var sInnerHtml = oTd.innerHTML;
    sInnerHtml = new Eapi.Str().trim(sInnerHtml);

    if (IsSpace(sInnerHtml) == false && sInnerHtml.substring(0, 3) == "<a ") {
        return;
    } else {
        oTd.innerText = sValue;
    }
}

/**
*初始化字段对象
**/
dataset.prototype.initRowSet = function() {
    var hidecols = 0;
    this.Fields = new fnFields();
    //给所有字段的值
    for (var i = 0; i < this.FieldCount; i++) {
        if (this.oDataField.childNodes[i].childNodes.length > 15) {
            if (NavJs.textContent(this.oDataField.childNodes[i].childNodes[15]) == "否") hidecols++;
        }
        var f = this.fnField(this.oDataField.childNodes[i]); //f为可带.FieldName等的字段对象
        f.index = i; //此字段在字段列表中的顺序号
        f.colno = i - hidecols + 1; //此字段在表格控件中的列号;

        

        this.Fields.Add(f);
    }
    //added by liuxr at 2010-10-27 14:48 给Fields属性赋值
    //this.Fields = this.oFields;
}
//字段对象集
function fnFields() {
    this.Field = new Array();
    this.Add = function(field) {
    /**
    *将字段加入到字段数组中
    *@param field 是一个字段对象
    **/
        var n = field.FieldName;
        if (n != "") {
            this.Field[n] = field;
            //支持全小写的字段名
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
*将节点中的字段信息加到字段对象中.
<field>
0	<fieldname> shl</fieldname>
1	<datatype>实数</datatype>
2	<displaylabel>数量</displaylabel>
3	<size>10</size>
4	<precision>0</precision>
5	<fieldkind>数据项</fieldkind>
6	<defaultvalue></defaultvalue>
7	<displayformat></displayformat>
8	<isnull>是</isnull>
9	<iskey>否</iskey> 
10	<valid>否</valid>
11	<procvalid>否</procvalid>
12	<link>否</link>
13	<target>_blank</target>
14	<href></href>
15	<visible>是</visible>
16	<primarykey>是</primarykey>

17	<fieldvalid>是</fieldvalid>	//字段数据验证
18	<tag>是</tag>				//供用户自定义

</field>

imgdataset 中总字段数为28 

*@param hidecols 为已隐藏的列数
**/
dataset.prototype.fnField = function(oNode){
    //对字段进行给值
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
    obj.Empty = NavJs.textContent(oNode.childNodes[8]);  //="是"表示不能为空
    obj.isKey = NavJs.textContent(oNode.childNodes[9]);  //="是"表示唯一
    if (oNode.childNodes.length > 10) obj.valid = NavJs.textContent(oNode.childNodes[10]);  //="是"表示要执行常规校验
    obj.Type = NavJs.textContent(oNode.childNodes[5]);  //="数据项"表示一般字段
    obj.DefaultValue = NavJs.textContent(oNode.childNodes[6]); //默认值
    obj.DisplayFormat = NavJs.textContent(oNode.childNodes[7]);  //显示格式带,表示要千分位

    if (oNode.childNodes.length > 17) {
        obj.primaryKey = NavJs.textContent(oNode.childNodes[16]); //是否是主键字段
        if (obj.primaryKey == "是" && IsSpace(this.firstKeyFieldName)) this.firstKeyFieldName = obj.FieldName;

        obj.fieldvalid = NavJs.textContent(oNode.childNodes[17]); //字段数据验证
        obj.tag = NavJs.textContent(oNode.childNodes[18]); 	//用户自定义
    }
    return obj;


}
/**
* 检查并返回字段对象
*@date 2008-01-07
**/
dataset.prototype.Field = function(NameOrIndex) {
    //加上对标志赋值,这样就不用再加改变标志的代码了.
    if (this.bAdd == false) this.bEdit = true; // my add 2009-09-19

    var isName = isNaN(parseInt(NameOrIndex));

    var objF = this.Fields.Field[isName ? NameOrIndex.toLowerCase() : NameOrIndex];
    if (typeof objF == "undefined" && NameOrIndex != "") {
        var sQuot = "";
        if (isName) sQuot = "'"
        alert("对象:" + this.id + ".Field(" + sQuot + NameOrIndex + sQuot + ") 未定义!");
    }
    return objF;
}
/**
* 是否是本数据集的字段名
*@param fieldName 要检查的字段名
*@return true/false
*@date 2008-01-09
**/
dataset.prototype.isFieldName = function(fieldName) {
    return typeof this.Fields.Field[fieldName.toLowerCase()] != "undefined";
}
/**
* 取得主键字段的字段顺序号,返回整数
**/
dataset.prototype.getKeyFieldNo = function() {
    for (var i = 0; i < this.oDataField.childNodes.length; i++) {
        if (NavJs.textContent(this.oDataField.childNodes[i].childNodes[16]) == "是") {
            return i;
        }
    }
    return -1;
}
/**
*出错则给出提示.
*@param sMsg 提示信息
*@param iTag 从dataValid函数中传来的标志号,=3 时表示要alert提示
**/
dataset.prototype.RunValidError = function(sMsg, iTag) {


    if (IsSpace(sMsg)) return "";

    if (this.RecNo > 0) sMsg = "第" + (this.RecNo + 1) + "行" + sMsg;
    
    //当选择了不alert错误信息时，直接返回。2012-11-17
    var isNotShow = (fcpubdata.area.getAttribute("alertType") == 2 || fcpubdata.area.getAttribute("alertType") == 3) && IsSpace(this.e_startRow); //
    if (isNotShow) return sMsg;

    //在表格中不alert,自动恢复旧值.在其它零散控件中提示,注意因text绑定到onchange事件,
    //objfocus取不到上一个控件
    if (iTag == 3 && this.RecordCount > 0) alert(sMsg);
    return sMsg;
}

dataset.prototype.fnPutRecNo = function(vValue) {
    this.RecNo = vValue;
    //RecNoID.fireChange();
}
dataset.prototype.fnGetRecordData = function (ss) {
    //var ss = this.oData.documentElement.xml;
    //加一个数据集的记录数据的属性
    var mRecordData = "";
    var istart = ss.indexOf("<root>");
    var iend = ss.lastIndexOf("<set><pages>");
    if (istart >= 0 && iend > istart) {
        mRecordData = ss.substring(istart + 6, iend);
    }
    return mRecordData;


}
dataset.prototype.dataset_fields1 = function(sSql, PageNo, PageSize, xmlField, callback, context) {
    //执行比较后再执行此来进行查询记录,但注意结果没有加上字段串
    //sField=带;分隔的字段名
    //xmlField=<field><name>field1</name><sql>读出时转换SQL,此节点可为空</sql></field>...
    //替代非法XML字符

    var sDsn = "";
    if (IsSpace(this.datasourceName) == false)
        sDsn = "&datasourceName=" + this.datasourceName;



    //--------------------------------------------
    var sXml = "<sql>" + RepXml(sSql) + "</sql>" + "<pageNo>" + PageNo + "</pageNo>" + "<pageSize>" + PageSize + "</pageSize>" + "<fields>" + xmlField + "</fields>";

    if (IsTrue(this.isSqlActionPage)) sXml += "<isSqlActionPage>1</isSqlActionPage>";

    //加上当前流程等参数，2013-05-21
    var wfName = $urlParam("wfName");
    var wfVersion = $urlParam("wfVersion");
    var actionId = $urlParam("actionId");
    var djsn = $urlParam("djsn");
    if (!(IsSpace(wfName) || IsSpace(wfVersion) || IsSpace(actionId) || IsSpace(djsn))) {
        sXml += "<wfField><wfName>" + wfName + "</wfName><wfVersion>" + wfVersion + "</wfVersion><actionId>" + actionId + "</actionId><djsn>" + djsn + "</djsn><tableName>"+this.id+"</tableName></wfField>";

    }

    //加上支持sql参数，2012-09-06
    var sqlParams = $id(this.id).getAttribute("sqlParams");
    if (!IsSpace(sqlParams)) sXml += sqlParams;

    var retX = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=dataset_fields1" + sDsn, sXml, callback, context);

    return retX;
}
/**
用XML数据替代表格
*@param sBigXml 为交叉表时生成的大的XML,为空为正常情况
*@date 2003-12-23
**/
dataset.prototype.XmlRepGrid = function(ogrid, sBigXml) {
    if (IsSpace(ogrid.tab)) {
        ogrid.fnInit();
    }
    var sTab = ogrid.tab.outerHTML;
    var sTab1 = "";
    var sTab2 = "";
    var sColgroup = "<colgroup>"; //列信息串
    var sTD = "";

    if (isSpace(sBigXml)) {
        var oXml = SetDom("<root><td></td></root>");
        var oData1 = this.oData.documentElement.cloneNode(true);
        oData1.removeChild(oData1.childNodes[oData1.childNodes.length - 1]);

        var arrList = new Array();
        var oList = null;
        if (this.oDataField != null) {

            oList = this.oDataField.selectNodes("field[visible='否']");

            //计算不显示列的对应关系
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

        //插入第一列
        for (var i = 0; i < oData1.childNodes.length; i++) {
            var oClone = oData1.childNodes[i].childNodes[0].cloneNode(false);

            //oClone.text = "";
            NavJs.textContent(oClone, "");
            oData1.childNodes[i].insertBefore(oClone, oData1.childNodes[i].childNodes[0]);

            //删除不显示的列-----------------------
            var l1 = arrList.length - 1;
            for (var j = l1; j >= 0; j--) {
                //如没有哪么多列则不删
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
    } else {  //大数据量的交叉表
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

    //加<col>
    var iPos = sTab.indexOf(">");
    if (iPos > 0) {
        sTab1 = sTab.substring(0, iPos + 1);   //保存table这一节
    }

    if (isSpace($id(ogrid.id).getAttribute("multihead"))) {
        //加TD
        var iPos1 = sTab.toLowerCase().indexOf("<tr");
        var iPos = sTab.indexOf(">", iPos1);
        if (iPos > 0) {
            sTab2 = sTab.substring(iPos1, iPos + 1); //保存TR这一节
        }
       // if (IsTrue(fcpubdata.area.getAttribute("allBrowser")) && Sys.Browser.agent != Sys.Browser.InternetExplorer) {
       //     sColgroup = ""; //直接在标题行上设置列宽。2013-04-02
       // }
        sTab = sTab1 + sColgroup + sTab2 + sTD + "</tr> ";
    } else {
        ogrid.FixRows = parseInt($id(ogrid.id).getAttribute("headrows"));
        sTab = sTab1 + sColgroup + $id(ogrid.id).getAttribute("multihead");
    }
    //alert(ogrid.headrows+" "+sTab)
    if (isSpace(sBigXml)) {
        //modify by liuxr at 2010-11-15 10:55 .xml属性在非IE的浏览器下不能使用，用NavJs.xml(node) 方法兼容其他浏览器
        var s1 = RemoveRoot(NavJs.xml(oData1));
    } else {
        var s1 = RemoveRoot(NavJs.xml(oXml.documentElement));
    }

    ogrid.LoadXml(sTab + s1 + "</table>");

}
///保存前转换 
///fieldNo为字段顺序号,recNo为记录号,如为-1 则表示为当前记录,用于主表时,bRead=true 表示读取时转换,否则是保存前转换
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