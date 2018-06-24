///<reference name="MicrosoftAjax.js" />
///<reference path="fcpub.js" />
///<reference path="fcother.js" />
///<reference path="fcrundj.js" />
///<reference path="fcebiao.js" />
/**
*获取正康在线系统设置dom对象
*
**/
function initSysSetDom(editSystemSet) {//初始化正康在线系统设置信息
    var sXml = "<no>否</no>"
    if (editSystemSet == true) sXml = "<no>是</no>";
    sXml += "<no>\\fceformext\\xml\\sysSet.xml</no>";
    var ret = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=zkSystemSetRead", sXml);
    if (fcpubdata.dotnetVersion == ".aspx") ret = "<root>" + ret + "</root>";
    var domX = SetDom(ret);
    if (domX.documentElement == null) {
        alert("读sysSet.xml出错，可能是调用不到后台程序！");
    }
    return domX;
}


/**
eform在用向导生成数据库中字段中的权限设置按钮调用此方法
**/
function eformWizFieldPowerSet() {
    var oldFcpubdataObj = fcpubdata.obj;
    var arr = [$id('lblTitle'),'', $id('SKbillsheet')];
    fcpubdata.obj = arr;
    EformActionButtonClick();
    var ret = fcpubdata.obj[2].roleXml;
    lblTitle.fieldPowerXmlSet = ret;
    fcpubdata.obj = oldFcpubdataObj;
}


Eapi.Layout = function() { }
Eapi.Layout.prototype =
{
    getQueryInfoFields: function(tbname, sqlType, isAll) {
        /** fhj 2012-05-10
        * 通过表名，sql语句类型获取查询信息表中的生成sql和字段列表的字段名
        * isAll == "是" 则表示在表单生成时用,需要记录更多的信息.
        **/
        var createDsSqlFieldObj = {
            isAll: false, //是否计算全部完整的信息
            fieldsName: null, //数据集字段英文名
            fieldsArr: null,
            fields: new Array(),
            fieldsBak: new Array(), //用字段名作KEY的数组备份
            innerJoinSql: "",
            sql: null, //数据集sql
            idField: null, //主键字段名
            nameField: null, //名称类型字段名
            numField: null, //自动编号类型字段名 
            deleteMarkField: null, //删除标记字段名
            sortNoField: null //顺序号字段名
        }

        createDsSqlFieldObj.isAll = isAll;
        var fieldXml = SelectSql("select fdlist, fdchnlist from fc_query where tbname='" + tbname + "' and type ='" + sqlType + "'", 1, 1);
        var oDom = SetDom(fieldXml);
        if (oDom.documentElement == null) {
            alert(fieldXml);
            return;
        }
        if (oDom.documentElement.childNodes.length < 1) {
            return alertMsgInfo("表 " + tbname + " 中查询信息不存在!");

        }
        var fields = oDom.documentElement.childNodes[0].childNodes[0].text;
        // createDsSqlFieldObj .sql = fields;
        createDsSqlFieldObj.fieldsName = fields;
        var chnName = oDom.documentElement.childNodes[0].childNodes[1].text;
        var arr = chnName.split(",");
        //alert(createDsSqlFieldObj.fieldsName)
        createDsSqlFieldObj.fieldsArr = createDsSqlFieldObj.fieldsName.split(','); //用逗号分隔后的销售主表的字段列表数组（djbh,sdwid,sdeptid,bz,date）

        //if (typeof (createDsSqlFieldObj.isAll) != "undefined") {
        var sql = "select fdname,type ,fdtype,fdsize,fddec,detailxml from  FC_ENTITYSUB where tbname='" + tbname + "'";
        var xmlRet = SelectSql(sql, 1, -1);
        var oXml = SetDom(xmlRet);
        if (oXml.documentElement == null) {
            alert(xmlRet);
            return;
        }

        //}

        //加上字段只读权限, 2012-09-10
        if (typeof (createDsSqlFieldObj.isAll) != "undefined") {
            var sql = "select fdname,readonly from  FC_FIELDPERMIT where tbname='" + tbname + "'";
            var xmlRet = SelectSql(sql, 1, -1);
            var oXmlPermit = SetDom(xmlRet);
            if (oXmlPermit.documentElement == null) {
                alert(xmlRet);
                return;
            }

        }
        //    

        var lenbak = createDsSqlFieldObj.fieldsArr.length;
        for (var i = 0; i < lenbak; i++) {
            var len = createDsSqlFieldObj.fields.length;

            var obj = new Object();
            obj.tableName = tbname;
            obj.fieldName = createDsSqlFieldObj.fieldsArr[i];
            obj.fieldNameNew = createDsSqlFieldObj.fieldsArr[i];
            obj.fieldChnName = arr[i];
            createDsSqlFieldObj.fields[len] = obj;
            createDsSqlFieldObj.fieldsBak[obj.fieldName] = obj;
            //加上字段只读权限, 2012-09-10
            if (typeof (createDsSqlFieldObj.isAll) != "undefined") {
                if (oXmlPermit.documentElement.childNodes.length > 1) {
                    var oNode = oXmlPermit.documentElement.selectSingleNode("/root/record[fdname ='" + obj.fieldName + "']");
                    if (oNode != null) obj.readOnlyXml = unescape(oNode.childNodes[1].text);
                }
            }
            //检查查询信息中的字段在实体子表中是否存在，2013-08-20
            var bFind = false;
            for (var j = 0; j < oXml.documentElement.childNodes.length - 1; j++) {
                var fieldName = oXml.documentElement.childNodes[j].childNodes[0].text;
                if (obj.fieldName == fieldName) {
                    bFind = true;
                    break;
                }
            }
            if (!bFind) {
                alertMsgInfo("表=" + tbname + "字段=" + obj.fieldName + "在查询信息中有，而实体子表中不存在！");
            }
        }
        //if (typeof (createDsSqlFieldObj.isAll) != "undefined") {
        for (var j = 0; j < oXml.documentElement.childNodes.length - 1; j++) {
            var fieldName = oXml.documentElement.childNodes[j].childNodes[0].text;
            var fieldType = oXml.documentElement.childNodes[j].childNodes[1].text;
            if (fieldType == "名称") createDsSqlFieldObj.nameField = fieldName;
            if (fieldType == "自动编号") createDsSqlFieldObj.numField = fieldName;
            if (fieldType == "删除标记") {
                createDsSqlFieldObj.deleteMarkField = fieldName;
            }
            if (fieldType == "顺序号") createDsSqlFieldObj.sortNoField = fieldName;
            if (fieldType == "所有者ID") createDsSqlFieldObj.owneridField = fieldName;
            if (fieldType == "组织全路径") createDsSqlFieldObj.orgAllField = fieldName;

            if (typeof (createDsSqlFieldObj.fieldsBak[fieldName]) != "object") continue;
            var objTmp = createDsSqlFieldObj.fieldsBak[fieldName];
            objTmp.type = oXml.documentElement.childNodes[j].childNodes[1].text;
            objTmp.fdtype = oXml.documentElement.childNodes[j].childNodes[2].text;
            objTmp.fdsize = oXml.documentElement.childNodes[j].childNodes[3].text;
            objTmp.fddec = oXml.documentElement.childNodes[j].childNodes[4].text;
            //alert(oXml.documentElement.childNodes[j].childNodes[5].text);
            objTmp.oDetailXml = SetDom("<root>" + oXml.documentElement.childNodes[j].childNodes[5].text + "</root>");

            if (objTmp.type == "ID字段") {
                createDsSqlFieldObj.idField = fieldName;
                createDsSqlFieldObj.idType = this.getDetailProp(objTmp.oDetailXml, "idType");
                createDsSqlFieldObj.idParam = this.getDetailProp(objTmp.oDetailXml, "idParam");
            }

            var tmpV = this.getDetailProp(objTmp.oDetailXml, "isNull");
            if (IsSpace(tmpV))
                objTmp.isNull = 0;
            else
                objTmp.isNull = tmpV;

            var sWidth = this.getDetailProp(objTmp.oDetailXml, "width");
            if (!IsSpace(sWidth)) objTmp.width = sWidth;
            var sHeight = this.getDetailProp(objTmp.oDetailXml, "height");
            if (!IsSpace(sHeight)) objTmp.height = sHeight;

            var sClassTD = this.getDetailProp(objTmp.oDetailXml, "classTd");
            if (!IsSpace(sClassTD)) objTmp.classTd = sClassTD;
            var sStyleTd = this.getDetailProp(objTmp.oDetailXml, "styleTd");
            if (!IsSpace(sStyleTd)) objTmp.styleTd = sStyleTd;
            var sClassCont = this.getDetailProp(objTmp.oDetailXml, "classCont");
            if (!IsSpace(sClassCont)) objTmp.classCont = sClassCont;
            var sStyleCont = this.getDetailProp(objTmp.oDetailXml, "styleCont");
            if (!IsSpace(sStyleCont)) objTmp.styleCont = sStyleCont;

        }
        //如果最后一个字段为所有者ID, no use
        //var isOwnerId = createDsSqlFieldObj.fields[createDsSqlFieldObj.fields.length - 1].fieldName == createDsSqlFieldObj.owneridField;
        //var isOrgAllId = createDsSqlFieldObj.fields[createDsSqlFieldObj.fields.length - 1].fieldName == createDsSqlFieldObj.orgAllField;

        actionFindField(createDsSqlFieldObj, tbname);

        //if (typeof (createDsSqlFieldObj.isAll) != "undefined") {
        var isHaveOwner = false;
        var isHaveOrgAll = false;
        var tmp = "";
        for (var i = 0; i < createDsSqlFieldObj.fields.length; i++) {
            var objF = createDsSqlFieldObj.fieldsBak[createDsSqlFieldObj.fields[i].fieldNameNew];
            if (objF.type == "累计汇总" || (objF.type == "取累计汇总" && IsTrue(this.getDetailProp(objF.oDetailXml, "isNotExist")))) continue;
            if (IsSpace(objF.readSql)) {
                var fieldPart = "";
                if (!IsSpace(objF.tableName)) {
                    fieldPart += objF.tableName;
                    fieldPart += ".";
                }
                fieldPart += createDsSqlFieldObj.fields[i].fieldName;
                var lenDate = 0;
                if (objF.type == "日期") {
                    var subType = this.getDetailProp(objF.oDetailXml, "subType");

                    if (subType == "日期(date)") {
                        lenDate = 10;
                    } else if (subType == "日期时间(datetime)") {
                        lenDate = 19;
                    }
                    if (lenDate != 0) {
                        fieldPart = "CONVERT(varchar(" + lenDate + "), " + fieldPart + ", 25) as " + createDsSqlFieldObj.fields[i].fieldNameNew;
                        tmp += fieldPart;
                    }
                }
                if (lenDate == 0) {

                    if (createDsSqlFieldObj.fields[i].fieldName == createDsSqlFieldObj.orgAllField) {
                        isHaveOrgAll = true;
                    }
                    if (createDsSqlFieldObj.fields[i].fieldName == createDsSqlFieldObj.owneridField) {
                        isHaveOwner = true;
                        //continue;
                        //tmp += " as " + fcpubdata.owneridHead + tbname;
                    } //else { //if (createDsSqlFieldObj.fields[i].fieldName != createDsSqlFieldObj.fields[i].fieldNameNew) 
                    tmp += fieldPart;
                    tmp += " as " + createDsSqlFieldObj.fields[i].fieldNameNew;

                }
            } else { //ID转名称时的名称字段
                tmp += tbname + "." + objF.linkFdName + " as " + objF.fieldNameNew;
            }

            if (i < createDsSqlFieldObj.fields.length - 1) tmp += ",";

        }
        if (isHaveOwner) {
            if (!tmp.endsWith(",")) {
                tmp += ",";
            }
            //数据集的sql语句的结尾多一个字段，此字段在数据集的字段列表中并不存在。
            tmp += tbname + "." + createDsSqlFieldObj.owneridField + " as " + fcpubdata.owneridHead + tbname;
        }
        if (isHaveOrgAll) {
            if (!tmp.endsWith(",")) {
                tmp += ",";
            }
            //数据集的sql语句的结尾多一个字段，此字段在数据集的字段列表中并不存在。
            tmp += tbname + "." + createDsSqlFieldObj.orgAllField + " as " + fcpubdata.fc_org_all_id + tbname;
        }
        createDsSqlFieldObj.sql = "select " + tmp + " from " + tbname + createDsSqlFieldObj.innerJoinSql;
        //}

        return createDsSqlFieldObj;


        /**
        查找一下是否有查找关系字段，如有查找关系并且选择多字段（idSwitchMuchField）等于是，就找出多字段
        **/
        function actionFindField(createDsSqlFieldObj, tbname) {
            var sql = "select fdname,chnname ,detailxml,linktbname,linkfdname from  FC_ENTITYSUB where tbname='" + tbname + "' and  (type= '查找关系' or type= '组织全路径' or type= '所有者ID') ";
            var xmlRet = SelectSql(sql, 1, -1);
            var oXml = SetDom(xmlRet);
            if (oXml.documentElement == null) {
                alert(xmlRet);
                return;
            }
            var len = oXml.documentElement.childNodes.length - 1;
            for (var i = 0; i < len; i++) {
                var fdname = oXml.documentElement.childNodes[i].childNodes[0].text;
                var sxml = oXml.documentElement.childNodes[i].childNodes[2].text;
                var oXmlDetail = SetDom("<root>" + sxml + "</root>");
                var linktbname = oXml.documentElement.childNodes[i].childNodes[3].text; // 销售主表关联的单位表
                var linkfdname = oXml.documentElement.childNodes[i].childNodes[4].text; //销售主表的查找关系字段

                if (IsSpace(createDsSqlFieldObj.fieldsBak[fdname])) continue; //如果在查询信息中没有选此字段则返回，2013-07-24

                //createDsSqlFieldObj.fieldsBak[fdname].isFindRelation = true; //查找关系字段做上标志, 以便在生成数据集的SQL语句时加上表名. 
                createDsSqlFieldObj.fieldsBak[fdname].linkTbName = linktbname;
                createDsSqlFieldObj.fieldsBak[fdname].linkFdName = linkfdname;

                var dropdownlistSql = linkfdname + " as " + fdname;

                var oNode = oXmlDetail.documentElement.selectSingleNode("/root/isMuchField");
                if (oNode == null) continue;
                if (ToInt(oNode.text) == 1) { //id转多字段
                    var idSwitchMuchFieldSql = "select  fdname2,chnname,fdtype,fdsize,fddec,type,title,xmlSet from fc_relation inner join fc_entitysub on fc_relation.fdname2 = fc_entitysub.fdname where tbname1='" + tbname + "' and tbname2='" + linktbname + "' and fdname1='" + linkfdname + "' and tbname='" + linktbname + "' order by fc_relation.rowNo";
                    var xmlRet = SelectSql(idSwitchMuchFieldSql, 1, -1);
                    var idSwitchXml = SetDom(xmlRet); //id转多字段（sdwid,sdwcode,sdwname,phone,saddress）
                    if (idSwitchXml.documentElement == null) {
                        alert(xmlRet);
                        return;
                    }
                    mainFieldsAndSwitchFieldsEqual(createDsSqlFieldObj, createDsSqlFieldObj.fieldsArr, idSwitchXml, dropdownlistSql, linktbname, fdname)//检查字段名是否相同，并且重新生成新的转换的多字段

                    if (typeof (createDsSqlFieldObj.isAll) != "undefined") { //inner join 改为 left join
                        createDsSqlFieldObj.innerJoinSql = " left join " + linktbname + " on " + tbname + "." + fdname + "=" + linktbname + "." + linkfdname;

                    }
                    //fieldAddtableName(tbname ,linkfdname,fieldsArr);

                } else {//id转名称
                    oNode = oXmlDetail.documentElement.selectSingleNode("/root/contComputer");
                    if (oNode == null) continue;
                    if (oNode.text != "dropdownlist" && oNode.text != "选择函数") {
                        dropdownlistSql = "";
                    } //continue;
                    //支持外部设置 关联显示字段名 ， 2013-06-17
                    var sTmpWhere = " and type='名称' ";
                    var oNodeTmp = oXmlDetail.documentElement.selectSingleNode("/root/linkFdChnName");
                    if (oNodeTmp != null && !IsSpace(oNodeTmp.text)) {
                        var linkFdChnName = oNodeTmp.text;
                        sTmpWhere = " and fdname='" + linkFdChnName + "' ";
                    }
                    var allSql = "select fdname,chnname,fdtype,fdsize,fddec,type,'','' from fc_entitysub where tbname='" + linktbname + "' " + sTmpWhere;
                    var nameFieldXml = SelectSql(allSql, 1, 1); //如sdwname字段
                    oNameFieldXml = SetDom(nameFieldXml);
                    if (oNameFieldXml.documentElement == null) {
                        alert(nameFieldXml);
                        return;
                    }
                    mainFieldsAndSwitchFieldsEqual(createDsSqlFieldObj, createDsSqlFieldObj.fieldsArr, oNameFieldXml, dropdownlistSql, linktbname, fdname, linkFdChnName);  //检查字段名是否相同，并且重新生成新的转换的多字段

                    if (typeof (createDsSqlFieldObj.isAll) != "undefined") {
                        if (oNameFieldXml.documentElement.childNodes.length == 0) {
                            return alertMsgInfo("查找关系中id转名称时，没有找到名称字段！执行 " + allSql + " 记录数为0");
                        }
                        nameField = oNameFieldXml.documentElement.childNodes[0].childNodes[0].text;  //当一个表有多个此类型的字段时，i ==> 0 ,2013-07-20
                        var obj = createDsSqlFieldObj.fieldsBak[createDsSqlFieldObj.fields[createDsSqlFieldObj.fields.length - 1].fieldNameNew];
                        obj.readSql = "select " + linkfdname + "," + nameField + " from " + linktbname;
                        //obj.idAsName = linkfdname;
                        obj.isNull = 1;

                    }
                }

            }



            /**销售主表sql的字段是否和sdwid转换的字段相同
            fieldsArr 用逗号分隔的字段列表数组（djbh,sdwid,sdeptid,bz,date）
            idSwitchXml 关联表的名称类型字段的详细XML
            dropdownlistSql dropdownlist控件上的sql,为空表示不用dropdownlist控件
            linktbname 关联表名
            fdname 当前字段名，即类型为查找关系的字段名，如职员表中的sdeptId字段
            linkFdChnName 当关联表不能用名称类型的字段时，用此来指定一个字段名。
            **/
            function mainFieldsAndSwitchFieldsEqual(createDsSqlFieldObj, fieldsArr, idSwitchXml, dropdownlistSql, linktbname, fdname, linkFdChnName) {
                var arrBak = new Array();
                var sSelect = dropdownlistSql;
                var dropdownlistTitle = "";
                //var readUrl = SqlToField("select readurl from fc_entity where tbname='" + linktbname + "' ");


                var switchFieldLen = idSwitchXml.documentElement.childNodes.length - 1;
                for (var ii = 0; ii < switchFieldLen; ii++) {
                    for (var j = 0; j < 99; j++) {//99为最大查找次数
                        var end = "";
                        if (j > 0) end = j;
                        var fieldName = idSwitchXml.documentElement.childNodes[ii].childNodes[0].text;
                        //alert(fieldsArr.length+":"+linktbname + ":" + fieldName + ":" + fieldsArr)
                        var ret = fieldIsRepeat(fieldsArr, fieldName + end);
                        //if (end == "" && ret == "") {
                        //    createDsSqlFieldObj.fieldsBak[fieldName].isRepeatName = true;
                        //}
                        if (ret != "") {
                            var len = createDsSqlFieldObj.fields.length;

                            var obj = new Object();
                            obj.tableName = linktbname;
                            obj.fieldName = fieldName;
                            obj.fieldNameNew = ret;

                            obj.fieldChnName = idSwitchXml.documentElement.childNodes[ii].childNodes[1].text;
                            obj.fdtype = idSwitchXml.documentElement.childNodes[ii].childNodes[2].text;
                            obj.fdsize = idSwitchXml.documentElement.childNodes[ii].childNodes[3].text;
                            obj.fddec = idSwitchXml.documentElement.childNodes[ii].childNodes[4].text;
                            var sType = idSwitchXml.documentElement.childNodes[ii].childNodes[5].text;
                            sType = Trim(sType);

                            //fc_relation表的详细设置信息
                            var xmlSet = idSwitchXml.documentElement.childNodes[ii].childNodes[7].text;
                            if (!IsSpace(xmlSet)) {
                                var oXmlSet = SetDom("<root>" + xmlSet + "</root>");
                                if (oXmlSet.documentElement != null) {
                                    var isNotGenField = new Eapi.Layout().getDetailProp(oXmlSet, "isNotGenField");
                                    if (IsTrue(isNotGenField)) obj.fieldNameNew = obj.fieldName;

                                }
                            }

                            if (sType == "名称" || sType == "自动编号" || !IsSpace(linkFdChnName)) { //直接指定了 名称 类型的字段时也要进入此。
                                //生成dropdownlist控件
                                obj.type = "查找关系_dropdownlist";
                                if (IsSpace(dropdownlistSql)) {
                                    //alert(fdname + ":" + obj.fieldNameNew);
                                    obj.idFieldName = fdname;
                                    obj.textFieldName = obj.fieldNameNew; //给名称字段名

                                    obj.isNull = 0; //当不是dropdownlist时，可为空。
                                } else {
                                    obj.isNull = 1;
                                }
                                obj.linkTbName = linktbname; //记录关联表名,用于后面计算出查看视图的超链接地址,如:职员表中的sdeptid字段关联的部门表.
                                obj.linkFdName = fdname; //此字段名用于在当前数据集中找查找关系的ID字段的值,如:职员表中的sdeptid字段.
                                arrBak[sType] = obj;

                            } else {
                                //下面还需要根据oXmlSet中的showCont信息来扩展。2012-11-12
                                //生成只读的label控件.
                                obj.type = "查找关系_label";
                                obj.isNull = 0;
                            }
                            if (sSelect != "")
                                sSelect += ","
                            // as obj.fieldNameNew ==> 就可以解决两边都有单价字段的问题，2013-08-16   
                            sSelect += obj.fieldName; //+" as " + obj.fieldNameNew;

                            var sTitle = idSwitchXml.documentElement.childNodes[ii].childNodes[6].text;
                            sTitle = sTitle.substring(1, sTitle.length);
                            //当查找多个字段时，sTitle不为空,
                            if (!IsSpace(sTitle) && dropdownlistTitle == "") dropdownlistTitle = "|"; //表示最左边的一列为隐藏的ID列
                            dropdownlistTitle += sTitle;

                            //例：订单子表数据集中控制不能含有商品表中的单价字段，
                            if (IsTrue(isNotGenField)) break;

                            if (sType != "ID字段") {
                                createDsSqlFieldObj.fields[len] = obj;
                                //if (typeof (createDsSqlFieldObj.isAll) != "undefined") 
                                createDsSqlFieldObj.fieldsBak[obj.fieldNameNew] = obj;
                            }
                            break; //如果字段不相同就不要在修改字段了，检查下一个
                        }
                    }
                }
                var sTag = "名称";
                if (!IsSpace(arrBak[sTag])) {
                    arrBak[sTag].dropdownlistSql = sSelect;
                    arrBak[sTag].dropdownlistTitle = dropdownlistTitle.substring(0, dropdownlistTitle.length - 1);
                }
                var sTag = "自动编号";
                if (!IsSpace(arrBak[sTag])) {
                    arrBak[sTag].dropdownlistSql = sSelect;
                    arrBak[sTag].dropdownlistTitle = dropdownlistTitle.substring(0, dropdownlistTitle.length - 1);
                }
            }
            function fieldIsRepeat(fieldsArr, switchField) {//返回空表示字段名重复，否则为要加的字段名

                var ret = switchField;
                for (var f = 0; f < fieldsArr.length; f++) {
                    if (fieldsArr[f] == switchField) {
                        ret = "";
                        break;
                    }
                }
                //alert(fieldsArr+":"+switchField+":"+ret+":")
                return ret;
            }

        }
    },
    getDetailProp: function(oDXml, nodeName) {
        if (IsSpace(oDXml)) return;
        var oNode = oDXml.documentElement.selectSingleNode("/root/" + nodeName);
        if (oNode != null) {
            return oNode.text;
        }
    },
    loadOneLayout: function(layoutName, oEbiao, oContXml) {

        fcpubdata.genAllStr = "";
        var arrRet = this.genDsRun(layoutName, oContXml, oEbiao);
        var isRunEbiao = arrRet[0];
        if (!IsSpace(arrRet[1])) oEbiao.setAttribute("recRows", arrRet[1]);
        var sTable = SqlToField("select tableStr from fc_layout where fc_layout.name='" + layoutName + "'");
        if (IsSpace(sTable)) {
            return alertMsgInfo("布局模版 " + layoutName + " 不存在!");
        }
        oEbiao.setAttribute("printFile", layoutName);
        var arrDsFormat = arrRet[2];
        return this.loadOneLayoutSub(oEbiao, sTable, isRunEbiao, oContXml, arrDsFormat);
    },
    loadOneLayoutTable: function(tableName, oEbiao, oContXml) {
        var isRunEbiao = 3;
        //var type = 2; //需要生成数据集的 savetable属性
        var queryType = "电脑"; //先固定为电脑中用.
        var dsProps = 'opensortno="1" submittype="2" submitno="1" issubds="0" isSubGrid="0" datasourceName="" isaddemptyrec="0" async="0"'; //默认卡片式编辑表单的数据集属性。
        var column = 2, rowHeight = 23, labelWidth = 80, fieldWidth = 180, isNullRow = "是";
        var bak_column = $urlParam("column");
        if (!IsSpace(bak_column)) column = bak_column;
        var bak_rowHeight = $urlParam("rowHeight");
        if (!IsSpace(bak_rowHeight)) rowHeight = bak_rowHeight;
        var bak_labelWidth = $urlParam("labelWidth");
        if (!IsSpace(bak_labelWidth)) labelWidth = bak_labelWidth;
        var bak_fieldWidth = $urlParam("fieldWidth");
        if (!IsSpace(bak_fieldWidth)) fieldWidth = bak_fieldWidth;
        var bak_isNullRow = $urlParam("isNullRow");
        if (!IsSpace(bak_isNullRow)) isNullRow = bak_isNullRow;
        var bak_queryType = $urlParam("queryType");
        if (!IsSpace(bak_queryType)) queryType = bak_queryType;

        var arr = this.genTableString(tableName, "可空的表中文名", queryType, column, rowHeight, labelWidth, fieldWidth, isNullRow);
        var sTable = arr[0];
        fcpubdata.genArrObj[oEbiao.id][tableName] = arr[1]; //保存好对象,以免后面要重算一次.

        var arrRet = this.genOneDs(oEbiao, tableName, queryType, dsProps, oContXml, isRunEbiao, false);
        return this.loadOneLayoutSub(oEbiao, sTable, isRunEbiao, oContXml, arrRet[2]);
    },
    loadOneLayoutSub: function(oEbiao, sTable, isRunEbiao, oContXml, arrDsFormat) {
        var layoutId = oEbiao.id;

        //var sbCont = new Sys.StringBuilder();
        //var arrTableObj = new Array();
        //    var sContXml = fcpubdata.area.getAttribute("contxml");
        //    var oContXml = SetDom(sContXml);


        var sRoleXml = fcpubdata.area.getAttribute("roleXml");
        var oRoleXml = null;
        if (IsSpace(sRoleXml) == false) oRoleXml = SetDom("<root>" + sRoleXml + "</root>");

        var sReadOnlyXml = oEbiao.getAttribute("readOnlyXml");
        var oReadOnlyXml = null;
        if (IsSpace(sReadOnlyXml) == false) oReadOnlyXml = SetDom(sReadOnlyXml);

        var sDisabledXml = oEbiao.getAttribute("disabledXml");
        var oDisabledXml = null;
        if (IsSpace(sDisabledXml) == false) oDisabledXml = SetDom(sDisabledXml);

        var isShowView = oEbiao.getAttribute("isShowView");


        var arrLabelTds = new Array(); //保存需要加红色*的单元格坐标
        var hrefIds = "";    //查找关系而引入的名称类型字段所对应的控件ID,用逗号分隔,用于生成超链接
        var oRecRows = getRecRowsObj(oEbiao.getAttribute("recRows"));
        if (isRunEbiao == 3) {
            oEbiao.innerHTML = "<div>" + sTable + "</div>";
            var oTable = NavJs.child(NavJs.child(oEbiao, "div", 0), "table", 0);

            oTable.border = 0; //强制去掉边框线。2012-12-12 add
            oTable.style.borderLeft = "0px"; //加上这四行，以防在chrome下不正确。
            oTable.style.borderTop = "0px";
            oTable.style.borderBottom = "0px";
            oTable.style.borderRight = "0px";
            //var tmp1 = oTable.getAttribute("isOnloadRun");
            //if (!IsSpace(tmp1)) oEbiao.setAttribute("isOnloadRun", tmp1);

        } else {
            oEbiao.innerHTML = sTable;
            var oTable = NavJs.child(oEbiao, "table", 0); //运行E表文件之前为: E表控件下直接是table

        }


        //存上布局模版中文名称，2012-11-16
        oEbiao.setAttribute("chnName", oTable.getAttribute("chnName"));

        var sRoleXmlOne = oTable.getAttribute("toolbarPermit"); //2012-09-11,此处要看roleXml的格式而修改。
        //alert(sRoleXmlOne)
        if (IsSpace(sRoleXmlOne) == false) {
            var oRoleXmlOne = SetDom("<root>" + unescape(sRoleXmlOne) + "</root>");
            if (oRoleXmlOne.documentElement != null) {
                for (var k = 0; k < oRoleXmlOne.documentElement.childNodes.length; k++) {
                    if (oRoleXml == null) {
                        //alert(oRoleXmlOne.documentElement.childNodes[k].xml)
                        oRoleXml = SetDom("<root>" + oRoleXmlOne.documentElement.childNodes[k].xml + "</root>");
                    } else {
                        oRoleXml.documentElement.appendChild(oRoleXmlOne.documentElement.childNodes[k]);
                    }
                }
            }
        }


        //var sbContDef = new Sys.StringBuilder(); //dropdownlist控件的JS变量的定义串

        for (var i = 0; i < oTable.rows.length; i++) {
            for (var j = 0; j < oTable.rows[i].cells.length; j++) {
                var posKey = oEbiao.id + "_" + i + "_" + j; //单元格位置为KEY
                var oTd = oTable.rows[i].cells[j];

                if (isRunEbiao == 3) { //加上E表中设置的class 2012-10-26
                    var classbak = oTd.getAttribute("classbak");
                    if (!IsSpace(classbak)) {
                        Sys.UI.DomElement.addCssClass(oTd, classbak);
                    }
                }

                var tbName = oTd.getAttribute("tableName");
                var fdName = oTd.getAttribute("fieldName");
                if (IsSpace(tbName) || IsSpace(fdName)) continue;
                var contType = oTd.getAttribute("contType");
                if (typeof (fcpubdata.genArrObj[layoutId][tbName]) != "object" || typeof (fcpubdata.genArrObj[layoutId][tbName].fieldsBak[fdName]) != "object") {
                    if (contType != "label") alertMsgInfo(oEbiao.id + "控件的" + i + "," + j + "单元格绑定的表=" + tbName + "字段=" + fdName + "在查询信息中不存在！");
                    continue;
                }
                if (contType == "field") {
                    fcpubdata.genEventObj.contId = tbName + "_" + fcpubdata.genArrObj[layoutId][tbName].fieldsBak[fdName].fieldNameNew;
                    if (oEbiao.id == "elFilter" || IsTrue(oEbiao.getAttribute("isAddId"))) fcpubdata.genEventObj.contId = oEbiao.id + "_" + fcpubdata.genEventObj.contId;
                    oTd.title = "";

                    var isSumField = fcpubdata.genArrObj[layoutId][tbName].fieldsBak[fdName].type == "累计汇总";

                    var sbCont1 = new Sys.StringBuilder();
                    if (!IsTrue(isShowView)) {
                        var arrContRet = this.genOneCont(fcpubdata.genArrObj[layoutId][tbName].fieldsBak[fdName], sbCont1, tbName, isShowView, oContXml, oRoleXml, oEbiao, oReadOnlyXml);
                        var sContDef = arrContRet[0];
                        oReadOnlyXml = arrContRet[1];
                        //if (!IsSpace(sContDef)) sbContDef.append(sContDef);
                        //alert(sbCont1.toString());
                        fcpubdata.genAllStr += sbCont1.toString();
                        NavJs.insertHtml("beforeEnd", oEbiao, sbCont1.toString());
                        //oTd.innerHTML = sbCont1.toString();
                        if (IsSpace(sContDef) == false) {
                            if (fcpubdata.genEventObj.isGen == "htm") {
                                fcpubdata.genEventObj.sbJsStr.append("var " + sContDef);
                            } else {
                                eval("window." + sContDef);
                            }
                        }

                        if (isRunEbiao == 3)
                            this.eblayoutToRunOne(oTd, fcpubdata.genEventObj.contId, oRecRows, tbName, isShowView, isSumField);
                        else
                            this.ebiaoToRunOneSub(oTd, fcpubdata.genEventObj.contId, tbName, fdName, $id(fcpubdata.genEventObj.contId).style.display, "", oRecRows, arrDsFormat, isSumField);
                        //this.ebiaoToRunOne(oTd, $id(fcpubdata.genEventObj.contId), oRecRows, arrDsFormat);

                    } else {
                        //如职员表中部门名称字段时：tbName = fcs_employee fdName=sdeptName linktbname = fcs_dept linkfdname=sdeptid

                        //生成名称型字段的超链接
                        var sClick = "";
                        var runUrl = null;
                        var fieldChnName = fcpubdata.genArrObj[layoutId][tbName].fieldsBak[fdName].fieldChnName;
                        var linktbname = fcpubdata.genArrObj[layoutId][tbName].fieldsBak[fdName].linkTbName;
                        var linkfdname = fcpubdata.genArrObj[layoutId][tbName].fieldsBak[fdName].linkFdName;
                        if (IsSpace(linktbname) == false && IsSpace(linkfdname) == false) { //通过查找关系引入的名称字段，如职员表中的部门名称。

                            runUrl = this.getRunUrl(linktbname, "查看");
                            if (!IsSpace(runUrl)) {
                                runUrl = runUrl[0];
                                sClick = escape("new Eapi.EformEbiao().nameFieldHref('" + oEbiao.id + "','" + fieldChnName + "','" + runUrl + "','" + tbName + "','" + linkfdname + "')");
                            }
                        } else if (fcpubdata.genArrObj[layoutId][tbName].nameField == fdName || fcpubdata.genArrObj[layoutId][tbName].numField == fdName) { //要找到当前名称字段对应的ID字段。
                            runUrl = this.getRunUrl(tbName, "查看");
                            if (!IsSpace(runUrl)) {
                                runUrl = runUrl[0];
                                sClick = escape("new Eapi.EformEbiao().nameFieldHref('" + oEbiao.id + "','" + fieldChnName + "','" + runUrl + "','" + tbName + "','" + fcpubdata.genArrObj[layoutId][tbName].idField + "')");
                            }
                        }
                        if (isRunEbiao == 3) {
                            if (sClick != "") oTd.setAttribute("eformHref", sClick);
                            this.eblayoutToRunOne(oTd, fcpubdata.genEventObj.contId, oRecRows, tbName, isShowView, isSumField);
                        } else {
                            this.ebiaoToRunOneSub(oTd, fcpubdata.genEventObj.contId, tbName, fdName, "none", sClick, oRecRows, arrDsFormat, isSumField);
                        }
                        //hrefIds += fcpubdata.genEventObj.contId + ",";
                    }

                } else if (contType == "label") {

                    if (oEbiao.id != "elFilter" && IsTrue(isShowView) == false && fcpubdata.genArrObj[layoutId][tbName].fieldsBak[fdName].isNull && IsSpace(oTd.innerText) == false) {
                        //加上红色*
                        //oTd.innerHTML += fcpubdata.labelInputTag;
                        var objTdPos = new Object();
                        objTdPos.row = i;
                        objTdPos.col = j;
                        arrLabelTds[arrLabelTds.length] = objTdPos;
                    }
                } else if (!IsSpace(contType)) {
                    var sHtml = "";
                    if (contType == "eform") {
                        var contId = oTd.getAttribute("controlId");
                        if (contId == "upload1") $id("upload1").setAttribute("dataset", tbName); //附件上传控件需要绑定到数据集.
                        sHtml = $id(contId).outerHTML;
                        $id(contId).outerHTML = "";
                        oTd.removeAttribute("controlId");
                    } else if (contType == "href" || contType == "button") {
                        var sClick = "";
                        var tmpType = oTd.getAttribute("funcType");
                        if (tmpType == "show" || tmpType == "edit") {
                            var tmpF = "查看";
                            if (tmpType == "edit") tmpF = "编辑";
                            var runUrl = this.getRunUrl(tbName, tmpF);
                            if (IsTrue(oTd.getAttribute("isModalWin"))) {

                                if (!IsSpace(runUrl)) {
                                    sClick = "new Eapi.EformEbiao().modalOpenCard(\"" + runUrl[0] + "\",\"" + tbName + "\",\"" + oEbiao.id + "\",\"" + oTd.getAttribute("refreshType") + "\",\"" + runUrl[1] + "\",0)";
                                }
                            } else {
                                if (!IsSpace(runUrl)) {
                                    sClick = "new Eapi.EformEbiao().nameFieldHref(\"" + oEbiao.id + "\",\"" + runUrl[0] + "\",\"" + tbName + "\",\"" + fcpubdata.genArrObj[layoutId][tbName].idField + "\")";
                                }
                            }
                        } else if (tmpType == "del") {
                            sClick = "new Eapi.EformEbiao().delDetailDs(\"" + oEbiao.id + "\",\"" + tbName + "\")";
                        }

                        if (contType == "href") {

                            sHtml = "<a isFixLabel=\"1\" href=\"javascript:var ss='" + tmpType + i + "';void(0)\" onclick='" + sClick + "' posKey=" + posKey + " >" + oTd.getAttribute("labelValue") + "</a>";
                        } else {
                            sHtml = "<button onclick='" + sClick + "' posKey=" + posKey + " >" + oTd.getAttribute("labelValue") + "</button>";
                        }
                    } else if (contType == "radio") {
                        sHtml = "<input type=radio name=rdoname_" + oEbiao.id + "_" + tbName + " onclick='new Eapi.EformEbiao().setDsRecNo(" + tbName + ")' posKey=" + posKey + " >";
                    } else if (contType == "checkbox") {
                        sHtml = "<input type=checkbox onclick='new Eapi.EformEbiao().multiSelTag(\"" + tbName + "\")' posKey=" + posKey + " >";
                    }


                    if (isRunEbiao == 3) {
                        oTd.innerHTML = sHtml;
                    } else {
                        oTd.setAttribute("e_data_type", 7); //单元格类型为html
                        oTd.setAttribute("e_html_value", escape(sHtml));
                    }
                    oTd.title = "";

                    //控件的权限
                    var roleXml = oTd.getAttribute("roleXml");
                    if (IsSpace(roleXml) == false) {
                        var oRoleXmlOne = SetDom(unescape(roleXml));
                        if (oRoleXmlOne.documentElement != null) {
                            if (contType == "eform") {
                                if (oRoleXml == null)
                                    oRoleXml = SetDom("<root>" + oRoleXmlOne.documentElement.childNodes[0].xml + "</root>");
                                else
                                    oRoleXml.documentElement.appendChild(oRoleXmlOne.documentElement.childNodes[0]);

                            } else {
                                oRoleXmlOne.documentElement.setAttribute("posKey", posKey);
                                oRoleXmlOne.documentElement.setAttribute("contType", contType);
                                if (oDisabledXml == null)
                                    oDisabledXml = SetDom("<root>" + oRoleXmlOne.documentElement.xml + "</root>");
                                else
                                    oDisabledXml.documentElement.appendChild(oRoleXmlOne.documentElement);

                            }
                        }
                        oTd.removeAttribute("roleXml");
                    }

                }
                if (!IsSpace(contType) && contType != "label") {
                    new Eapi.Css().clearPart(oTd, "backgroundImage", "background-image");
                    new Eapi.Css().clearPart(oTd, "backgroundPosition", "background-position");
                    new Eapi.Css().clearPart(oTd, "backgroundRepeat", "background-repeat");
                }
            }
        }

        //    if (hrefIds.length > 0) {
        //        hrefIds = hrefIds.substring(0, hrefIds.length - 1);
        //        oEbiao.setAttribute("hrefIds", hrefIds);
        //    }

        fcpubdata.area.setAttribute("contxml", oContXml.documentElement.xml);

        //var oTable = NavJs.child(NavJs.child(oEbiao, "div", 0), "table", 0);
        for (var i = 0; i < arrLabelTds.length; i++) {
            var oTd = oTable.rows[arrLabelTds[i].row].cells[arrLabelTds[i].col];
            //加上红色*
            if (isRunEbiao == 3) {
                oTd.innerHTML += fcpubdata.labelInputTag;
            } else {
                oTd.setAttribute("e_data_type", "7");
                oTd.setAttribute("e_html_value", escape(oTd.innerText + fcpubdata.labelInputTag));
            }
        }

        if (isRunEbiao == 3) {
            this.eblayoutToRunAll(oEbiao);
        } else {
            this.ebiaoToRunAll(oEbiao, arrDsFormat);
        }

        //    if (!sbContDef.isEmpty()) {
        //        eval(sbContDef.toString());
        //    }
        //    
        //记住isRunEbiao,供后面用
        oEbiao.setAttribute("isRunEbiao", isRunEbiao);


        if (oRoleXml != null && oRoleXml.documentElement != null) fcpubdata.area.setAttribute("roleXml", new Eapi.Str().removeRoot(oRoleXml.documentElement.xml));
        if (oReadOnlyXml != null && oReadOnlyXml.documentElement != null) oEbiao.setAttribute("readOnlyXml", oReadOnlyXml.documentElement.xml);
        if (oDisabledXml != null && oDisabledXml.documentElement != null) oEbiao.setAttribute("disabledXml", oDisabledXml.documentElement.xml);

        //CopyToPub(fcpubdata.genAllStr);

        // CopyToPub(document.body.innerHTML);
    },
    genOneCont: function(objField, sbCont, tbName, isShowView, oContXml, oRoleXml, oEbiao, oReadOnlyXml) {
        var sid = tbName + "_" + objField.fieldNameNew;
        if (oEbiao.id == "elFilter" || IsTrue(oEbiao.getAttribute("isAddId"))) sid = oEbiao.id + "_" + sid;
        var sRet = "";

        var oDXml = objField.oDetailXml;
        if (objField.type == "查找关系_dropdownlist") {
            oDXml = fcpubdata.genArrObj[oEbiao.id][tbName].fieldsBak[objField.linkFdName].oDetailXml;
        }
        var contType = "text";
        var sStyle = ""; //"width:100%;height:100%;";
        var sReadOnly = "";

        var objTable = fcpubdata.genArrObj[oEbiao.id][tbName];
        //加上交叉表时，主键字段只读的功能，2012-10-31
        var keyFields = objTable.keyFields;
        if (!IsSpace(keyFields)) {
            keyFields += ",";
            if (keyFields.indexOf(objField.fieldNameNew + ",") >= 0) {
                if (!IsTrue(objTable.isKeyInput)) sStyle += "display:none;";
            }
        }


        switch (objField.type) {
            case "ID字段":
                contType = "text";
                if (objTable.idType != 4) //4为单个字段作主键
                    sStyle += "display:none;";
                break;
            case "主从信息表":
            case "顺序号":
            case "所有者ID":
                contType = "text";
                sStyle += "display:none;";
                break;
            case "自动编号":
            case "累计汇总":
            case "取累计汇总":
                contType = "text";
                sReadOnly = "readOnly";
                break;
            case "名称":
                contType = "text";
                break;

            case "整数":
                contType = "text";
                break;
            case "实数":
                contType = "text";
                break;
            case "电子邮件":
                contType = "text";
                break;
            case "特别格式":
                {
                    contType = "text";
                    break;
                }
            case "公式":
            case "URL":
                contType = "text";
                break;
            case "文本":
                contType = this.getDetailProp(oDXml, "textOrTextarea");
                break;
            case "大文本":
                contType = "textarea";
                break;
            case "复选框":
                contType = "checkbox";
                break;
            case "图片字段":
                contType = "dbimg";
                break;
        }

        var evtChange = "";
        var evtClickOpen = "";
        var spubOption = "";
        var sListSql = "";
        var sFormatTitle = ""; //dropdownlist时的标题
        var isSelFunc = false; //是否是 选择函数
        if (contType == "text") {
            if (!objField.sbValid.isEmpty()) {
                evtChange += " onchange=\"";
                //evtChange += objField.sbValid.toString() + "\" ";
                //bill_onclick(&quot;$valid('整数');&quot;)
                evtChange += "bill_onclick(&quot;" + objField.sbValid.toString() + "&quot;)\" ";

            }
        }
        if (objField.type == "日期") {
            contType = "dropdownlist";
            evtClickOpen = " onclickopen=\"";
            var subType = this.getDetailProp(oDXml, "subType");
            if (subType.length > 4 && subType.substring(0, 4) == "日期时间") {
                evtClickOpen += "$eform('选择日期时间')\"";
            } else {
                subType = subType.substring(0, 2);
                if (subType == "日期") evtClickOpen += "$eform('选择日期')\"";
                if (subType == "年份") evtClickOpen += "$eform('选择日期年')\"";
                if (subType == "年月") evtClickOpen += "$eform('选择日期年月')\"";
            }
            //        } else if (objField.type == "组织全路径") {
            //            contType = "dropdownlist";
            //            evtClickOpen = " onclickopen=\"selectOrgAll()\"";
            //        

        } else if (objField.type == "选项列表" || objField.type == "多选列表" || objField.type == "查找关系" || objField.type == "查找关系_dropdownlist") {
            var isSet = false;
            var envType = fcpubdata.area.getAttribute("envType");
            if (!IsSpace(envType) && envType != "电脑") {
                var bTmp = this.getDetailProp(oDXml, "isSamePhone");
                if (IsTrue(bTmp)) {
                    contType = this.getDetailProp(oDXml, "contPhone/phoneControl"); //手机
                    isSet = true;
                }
            }
            if (!isSet) {
                contType = this.getDetailProp(oDXml, "contComputer");
            }
            if (objField.type == "查找关系_dropdownlist" && IsSpace(contType)) {

                contType = "dropdownlist";
            }

            if (contType == "选择函数") {
                isSelFunc = true;
                var sFunc = this.getDetailProp(oDXml, "selectFunction");
                if (!IsSpace(sFunc)) {
                    sFunc = Trim(unescape(sFunc));
                    if (sFunc.substring(sFunc.length - 2, sFunc.length) == "()") {
                        sFunc = sFunc.substring(0, sFunc.length - 2);
                        sFunc += "('" + sid + "')";
                    } else {
                        sFunc = RepStr(sFunc, "##cont_id##", sid); //替换控件id , 2013-06-17
                    }
                    evtClickOpen = " onclickopen=\"";
                    evtClickOpen += sFunc + "\"";
                }
                contType = "dropdownlist";
            }

            var isConst = this.getDetailProp(oDXml, "isConst");
            if (IsTrue(isConst)) {
                var sListText = this.getDetailProp(oDXml, "listText");
                if (IsSpace(sListText) == false) sListText = RepStr(sListText, "&#13;&#10;", "\r\n");
                var sListValue = this.getDetailProp(oDXml, "listValue");
                if (IsSpace(sListValue) == false) sListValue = RepStr(sListValue, "&#13;&#10;", "\r\n");

                var defaultValue = this.getDetailProp(oDXml, "defaultValue");
                if (oEbiao.id == "elFilter" && contType == "combobox") {
                    sListText = fcpubdata.querySelectTag + "\r\n" + sListText;
                    sListValue = " \r\n" + sListValue;
                    if (IsSpace(defaultValue)) defaultValue = " ";
                }
                //option串
                if (!IsSpace(sListText)) {
                    spubOption = PropWinListValueToOption(sListText, sListValue, defaultValue, contType == "dropdownlist");
                }
                //常数,多选,dropdownlist时,需要强行设置标题
                if (contType == "dropdownlist" && objField.type == "多选列表") {
                    sFormatTitle = ' format="| ' + objField.fieldChnName + ' "';
                }

            } else {
                var tmpWhere = "";
                if (this.isHaveDeleteMark(objField.linkTbName)) tmpWhere = " where " + objField.linkTbName + ".deleteMark=0";

                //sql
                if ((objField.type == "查找关系" || objField.type == "查找关系_dropdownlist") && (contType == "combobox" || contType == "listbox" || contType == "checkboxlist" || contType == "radiolist")) {
                    var sQueryType = "FIX20"; //combobox
                    if (contType == "checkboxlist") sQueryType = "FIX50";
                    if (contType == "radiolist") sQueryType = "FIX60";

                    var ret1 = SqlToField("select fdlist from fc_query where fc_query.type='" + sQueryType + "' and tbname='" + objField.linkTbName + "'");
                    if (IsSpace(ret1) == false) {
                        sListSql = "select " + ret1 + " from " + objField.linkTbName + tmpWhere; //此处可能要考虑加上 where deleteMark=0

                    } else if (!IsSpace(objField.idFieldName) && !IsSpace(objField.textFieldName)) { //没有设置的话需要给默认值，2013-08-08
                        sListSql = "select " + objField.idFieldName + "," + objField.textFieldName + " from " + objField.linkTbName + tmpWhere;

                    }

                }

                if (objField.type == "选项列表" || objField.type == "多选列表") {
                    var dictType = this.getDetailProp(oDXml, "dictType");
                    sListSql = "select name as " + objField.fieldNameNew + " from fc_datadict where typename='" + dictType + "'";

                }
                if (objField.type == "查找关系_dropdownlist" && contType == "dropdownlist") {
                    sListSql = "select " + objField.dropdownlistSql + " from " + objField.linkTbName + tmpWhere;
                    sFormatTitle = ' format="' + objField.dropdownlistTitle + '" ';
                }
            }
        }

        fcpubdata.genEventObj.curCont = new Object();
        var curCont = fcpubdata.genEventObj.curCont;
        curCont.id = sid;
        curCont.controlType = contType;
        curCont.styleValue = sStyle;
        curCont.classValue = "";
        if (oEbiao.id == "elFilter" || IsTrue(oEbiao.getAttribute("isAddId"))) {
            curCont.dataset = oEbiao.id + "_" + tbName;
        } else {
            curCont.dataset = tbName;
        }
        curCont.field = objField.fieldNameNew;
        curCont.fieldChnName = objField.fieldChnName;

        curCont.idFieldName = objField.idFieldName;
        curCont.textFieldName = objField.textFieldName;

        curCont.readOnlyXml = objField.readOnlyXml;
        curCont.roleXml = this.getDetailProp(oDXml, "permitSet");
        curCont.value = this.getDetailProp(oDXml, "defaultValue");
        curCont.trueValue = this.getDetailProp(oDXml, "trueValue");
        curCont.falseValue = this.getDetailProp(oDXml, "falseValue");
        curCont.title = objField.fieldChnName;
        curCont.eventChange = evtChange;
        curCont.readOnly = sReadOnly;
        curCont.eventClickOpen = evtClickOpen;
        curCont.listSql = sListSql;
        curCont.optionStr = spubOption;
        curCont.formatTitle = sFormatTitle;
        curCont.cols = this.getDetailProp(oDXml, "colsNum");
        curCont.isTree = this.getDetailProp(oDXml, "isTree");
        curCont.isInput = this.getDetailProp(oDXml, "isInput");
        var sMulti = "否";
        if (objField.type == "多选列表") sMulti = "是";
        curCont.isMultiSel = sMulti;
        curCont.isOther = this.getDetailProp(oDXml, "isOther");

        var sEvent = oEbiao.getAttribute("onContGen");
        if (!IsSpace(sEvent)) eval(sEvent);

        var newSqlTrans = SqlPropTrans(curCont.listSql);
        var userTag = "";
        if (IsSpace(curCont.classValue) == false) userTag += " class=\"" + curCont.classValue + "\"";
        if (IsSpace(curCont.tag) == false) userTag += " " + curCont.tag;
        if (IsSpace(userTag) == false) userTag += " ";
        var cont_fieldChnName = ' china="' + curCont.fieldChnName + '" ';

        if (objField.type == "日期") {
            sbCont.append('<fc:fc_code id="' + curCont.id + '" ');
            sbCont.append('style="' + curCont.styleValue + '" ');
            sbCont.append(userTag + cont_fieldChnName);
            sbCont.append(' position="absolute"');
            sbCont.append(' controltype="dropdownlist" dataset="' + curCont.dataset + '" field="' + curCont.field + '"' + curCont.eventClickOpen + '></fc:fc_code>');
            sRet = sid + "=new dropdownlist(\"" + sid + "\");$obj('" + sid + "').fnInit(); ";

        }
        if (objField.type == "选项列表" || objField.type == "多选列表" || objField.type == "查找关系" || objField.type == "查找关系_dropdownlist") {

            switch (contType) {
                case 'combobox':
                case 'listbox':
                    sbCont.append('<SELECT id="' + curCont.id + '" ');
                    if (contType == "listbox") sbCont.append('size=8 ');
                    sbCont.append('style="' + curCont.styleValue + '" ');
                    sbCont.append(userTag + cont_fieldChnName);

                    //生成名称字段名，2013-08-08
                    //alert(curCont.field);
                    if (!IsSpace(curCont.idFieldName) && !IsSpace(curCont.textFieldName)) {
                        curCont.field = curCont.idFieldName;
                        sbCont.append(' textFieldName="' + curCont.textFieldName + '" ');
                        //alert(curCont.idFieldName + ":" + curCont.textFieldName);
                        //alert(curCont.listSql)
                    }

                    sbCont.append(' controltype="' + contType + '" dataset="' + curCont.dataset + '" field="' + curCont.field + '" sqltrans="' + newSqlTrans + '" >');
                    sbCont.append(curCont.optionStr);
                    sbCont.append('</SELECT>');
                    break;
                case 'radio':
                    //sid = "rdo";
                    sbCont.append('<FIELDSET id="' + curCont.id + '" ');
                    sbCont.append('style="' + curCont.styleValue + '" ');
                    sbCont.append(userTag + cont_fieldChnName);
                    sbCont.append('controltype="' + contType + '" dataset="' + curCont.dataset + '" field="' + curCont.field + '" >');
                    sbCont.append('<LEGEND>' + curCont.title + '</LEGEND>');
                    var rdolen = sListText.split('\n');
                    var rdol = sListValue.split('\n');
                    var fieldName = tbName + '_' + objField.fieldNameNew;
                    for (var jj = 0; jj < rdolen.length; jj++) {
                        sbCont.append('<INPUT id=RGrdo' + fieldName + jj + ' onclick=$id("' + fieldName + '").value=RGrdo' + fieldName + '[' + jj + '].value; type=radio value=' + rdol[jj] + ' name=RGrdo' + fieldName + ' text=' + rdolen[jj] + '><SPAN>' + rdolen[jj] + '</SPAN>&nbsp;');
                    }
                    sbCont.append('</FIELDSET>');
                    break;
                case 'radiolist':
                case 'checkboxlist':
                    sbCont.append('<DIV id="' + curCont.id + '" class="control-border" ');
                    sbCont.append('style="OVERFLOW: auto;font-size:12px;' + curCont.styleValue + '" '); //加上字大小设置，以防字很大。2012-11-18
                    sbCont.append(userTag + cont_fieldChnName);

                    //生成名称字段名，2013-08-08
                    if (!IsSpace(curCont.idFieldName) && !IsSpace(curCont.textFieldName)) {
                        curCont.field = curCont.idFieldName;
                        sbCont.append(' textFieldName="' + curCont.textFieldName + '" ')
                    }

                    sbCont.append(' controltype="' + contType + '" dataset="' + curCont.dataset + '" field="' + curCont.field + '" sqltrans="' + newSqlTrans + '" other="' + curCont.isOther + '" rows="' + curCont.cols + '" ></DIV>');
                    break;
                case 'dropdownlist':
                    var isTree = this.getDetailProp(oDXml, "isTree");
                    if (IsSpace(isTree)) isTree = "否";
                    var isInput = this.getDetailProp(oDXml, "isInput");
                    if (IsSpace(isInput)) isInput = "否";


                    sbCont.append('<fc:fc_code id="' + curCont.id + '" ');
                    sbCont.append('style="' + curCont.styleValue + '" ');
                    sbCont.append(userTag + cont_fieldChnName);
                    sbCont.append('controltype="dropdownlist" visible="是" dataset="' + curCont.dataset + '" field="' + curCont.field + '" position="absolute"');
                    if (curCont.eventClickOpen == "") sbCont.append(' xml="' + curCont.optionStr + '"');
                    if (IsSpace(curCont.isInput)) curCont.isInput = 0;
                    if (IsSpace(curCont.isTree)) curCont.isTree = 0;
                    sbCont.append(' isShowTree="' + curCont.isTree + '" blninput="' + curCont.isInput + '" multiselect="' + curCont.isMultiSel + '"');
                    if (isSelFunc == false) {
                        sbCont.append(' sqltrans="' + newSqlTrans + '" ');
                        sbCont.append(curCont.formatTitle);
                    }
                    sbCont.append(curCont.eventClickOpen + '></fc:fc_code>');
                    sRet = sid + "=new dropdownlist(\"" + sid + "\");$obj('" + sid + "').fnInit(); ";
                    break;

            }
        }
        if (objField.type == "查找关系_label") {
            contType = "label";
            sbCont.append('<label id="' + curCont.id + '" ');
            sbCont.append('style="' + curCont.styleValue + '" ');
            sbCont.append(userTag + cont_fieldChnName);
            sbCont.append('controltype="label" dataset="' + curCont.dataset + '" field="' + curCont.field + '"' + '></label>');
        }

        if (contType == "text") {
            sbCont.append('<INPUT type=text id="' + curCont.id + '" ');
            sbCont.append('style="' + curCont.styleValue + '" ');
            sbCont.append(userTag + cont_fieldChnName);
            sbCont.append('controltype="text" dataset="' + curCont.dataset + '" field="' + curCont.field + '" ' + curCont.readOnly + ' ' + curCont.eventChange + '>');
        }
        if (contType == "textarea") {
            sbCont.append('<textarea id="' + curCont.id + '" ');
            sbCont.append('style="' + curCont.styleValue + '" ');
            sbCont.append(userTag + cont_fieldChnName);
            sbCont.append('controltype="textarea" dataset="' + curCont.dataset + '" field="' + curCont.field + '" ' + curCont.readOnly + ' ></textarea>');
        }
        if (contType == "checkbox") {
            sbCont.append('<DIV id="' + curCont.id + '" ');
            sbCont.append('style="' + curCont.styleValue + '" ');
            sbCont.append(userTag + cont_fieldChnName);
            sbCont.append('controltype="checkbox" dataset="' + curCont.dataset + '" field="' + curCont.field + '"' + ' noWrap value="' + curCont.value + '" falsevalue="' + curCont.falseValue + '" truevalue="' + curCont.trueValue + '\"><INPUT type=checkbox><SPAN>' + curCont.title + '</SPAN></DIV>');
        }
        if (contType == "dbimg") {
            sbCont.append('<img id="' + curCont.id + '" ');
            sbCont.append('style="' + curCont.styleValue + '" ');
            sbCont.append(userTag + cont_fieldChnName);
            sbCont.append('controltype="dbimg" dataset="' + curCont.dataset + '" field="' + curCont.field + '"');
            if (IsSpace(curCont.readOnly)) sbCont.append(' alt="用鼠标双击此可选择图形" ondblclick="uploadImg()"');
            sbCont.append(' ></img>');
        }

        this.oContXmlAddOne(oContXml, contType, curCont.id);

        //控件的权限
        var roleXml = curCont.readOnlyXml;

        if (oEbiao.id != "elFilter" && IsSpace(roleXml) == false) {
            var oRoleXmlOne = SetDom(roleXml);
            if (oRoleXmlOne.documentElement != null) {
                oRoleXmlOne.documentElement.setAttribute("controlId", curCont.id);

                if (oReadOnlyXml == null) {
                    oReadOnlyXml = SetDom("<root>" + oRoleXmlOne.documentElement.xml + "</root>");

                } else {
                    oReadOnlyXml.documentElement.appendChild(oRoleXmlOne.documentElement);
                }
            }
        }
        return [sRet, oReadOnlyXml];
    },
    isHaveDeleteMark: function(tbName, fieldType) {
        //判断一个表是否有删除标记字段，2013-08-09
        if (IsSpace(tbName)) return false;
        if (IsSpace(fieldType)) fieldType = "删除标记";
        var sF = SqlToField("select fdname from fc_entitysub where tbname='" + tbName + "' and type='" + fieldType + "'");
        return !IsSpace(sF);

    },
    genDsRun: function(layoutName, oContXml, oEbiao) {
        var sXml = SelectSql("select tbname,queryType,dsProps,type,isRunEbiao,recRows,showHeight,isFixRowCol,xmlProps from fc_layoutsub inner join fc_layout on fc_layoutsub.layoutid=fc_layout.layoutid where fc_layout.name='" + layoutName + "'", 1, -1);
        var oXml = SetDom(sXml);
        if (oXml.documentElement == null) {
            alert(sXml);
            return;
        }
        var allDsId = ""; //用逗号分隔记录当前布局模版产生的所有数据集ID， 2012-08-29
        var isRunEbiao; //
        var arrDsFormat = new Array();
        var sbRecRows = new Sys.StringBuilder();
        for (var i = 0; i < oXml.documentElement.childNodes.length - 1; i++) {
            isRunEbiao = oXml.documentElement.childNodes[i].childNodes[4].text;

            var tbName = oXml.documentElement.childNodes[i].childNodes[0].text;
            // = 3 表示不生成数据集
            var isNotGenDs = oXml.documentElement.childNodes[i].childNodes[3].text == 3;
            var sFormat = this.genOneDs(oEbiao, tbName, oXml.documentElement.childNodes[i].childNodes[1].text, oXml.documentElement.childNodes[i].childNodes[2].text, oContXml, isRunEbiao, oXml.documentElement.childNodes[i].childNodes[8].text, isNotGenDs);
            arrDsFormat[tbName] = sFormat;
            //CopyToPub(sRetDs.toString());
            if (oEbiao.id == "elFilter" || IsTrue(oEbiao.getAttribute("isAddId"))) {
                allDsId += oEbiao.id + "_";
            }
            allDsId += tbName + ",";

            var recRows = oXml.documentElement.childNodes[i].childNodes[5].text;
            if (ToInt(recRows) > 0) sbRecRows.append(tbName + "=" + recRows + "\r\n");

            if (i == 0) {
                oEbiao.setAttribute("showHeight", oXml.documentElement.childNodes[i].childNodes[6].text);
                oEbiao.setAttribute("isFixRowCol", oXml.documentElement.childNodes[i].childNodes[7].text);
            }
        }
        var sRecRows = sbRecRows.toString();
        if (sRecRows.length > 2) sRecRows = sRecRows.substring(0, sRecRows.length - 2);

        if (allDsId.length > 0) allDsId = allDsId.substring(0, allDsId.length - 1);
        oEbiao.setAttribute("allDsId", allDsId);

        return [isRunEbiao, sRecRows, arrDsFormat]; //返回本布局模版是否需要运行E表的设置
    },
    genOneDs: function(oEbiao, tbname, queryType, dsProps, oContXml, isRunEbiao, xmlProps, isNotGenDs) {


        var arrTableObj = fcpubdata.genArrObj[oEbiao.id];
        var sRetDs = new Sys.StringBuilder();
        var sFormat = new Sys.StringBuilder("<fields>");
        var sbValid = new Sys.StringBuilder();
        var sbTrans = new Sys.StringBuilder();

        var sid = tbname;
        if (oEbiao.id == "elFilter" || IsTrue(oEbiao.getAttribute("isAddId"))) sid = oEbiao.id + "_" + tbname; //防止有两个同表的数据集而ID重名。

        fcpubdata.genEventObj.dsId = sid;

        //加上多字段作主键时的处理，2012-10-19
        var keyFields = "";
        var isKeyInput = 0;
        if (!IsSpace(xmlProps)) {
            var oXmlProps = SetDom("<root>" + xmlProps + "</root>");
            if (oXmlProps.documentElement != null) {
                keyFields = this.getDetailProp(oXmlProps, "keyFields");
                isKeyInput = this.getDetailProp(oXmlProps, "isKeyInput");
            }
        }


        if (IsSpace(arrTableObj[tbname])) { //当直接由表名来生成时,便可省略下一行的计算
            arrTableObj[tbname] = this.getQueryInfoFields(tbname, queryType, 1);
        }
        var obj = arrTableObj[tbname];
        var sbLikeFieldNames = new Sys.StringBuilder();
        for (var i = 0; i < obj.fields.length; i++) {
            this.genOneField(obj.fieldsBak[obj.fields[i].fieldNameNew], sFormat, sbValid, sbTrans, oEbiao, keyFields, sbLikeFieldNames);
        }

        if (!isNotGenDs) {
            obj.dsProps = dsProps;
            obj.keyFields = keyFields;
            obj.isKeyInput = isKeyInput; //此处将值存到全局对象上。在genOneCont中再取出来用。

            var sEvent = oEbiao.getAttribute("onDsGen");
            if (!IsSpace(sEvent)) eval(sEvent);

            //var sRetDs = new Sys.StringBuilder();
            sRetDs.append("<fc:dataset");
            sRetDs.append(" id=\"" + sid + "\" controltype=\"dataset\"");
            //if (type == 2) 
            sRetDs.append(" savetable=\"" + tbname + "\" ");

            if (!sbLikeFieldNames.isEmpty()) {
                var likeFieldNames = sbLikeFieldNames.toString();
                sRetDs.append(" likeFieldNames=\"" + likeFieldNames.substring(0, likeFieldNames.length - 1) + "\" ");
            }

            if (isSpace(obj.BeforeOpen) == false) {
                sRetDs.append(" BeforeOpen='bill_dsevent(\"BeforeOpen\",\"" + quot_42(obj.BeforeOpen) + "\")'");
            }
            if (isSpace(obj.AfterOpen) == false) {
                sRetDs.append(" AfterOpen='bill_dsevent(\"AfterOpen\",\"" + quot_42(obj.AfterOpen) + "\")'");
            }
            if (isSpace(obj.BeforePost) == false) {
                sRetDs.append(" BeforePost='bill_dsevent(\"BeforePost\",\"" + quot_42(obj.BeforePost) + "\")'");
            }
            if (isSpace(obj.AfterPost) == false) {
                sRetDs.append(" AfterPost='bill_dsevent(\"AfterPost\",\"" + quot_42(obj.AfterPost) + "\")'");
            }
            if (isSpace(obj.BeforeScroll) == false) {
                sRetDs.append(" BeforeScroll='bill_dsevent(\"BeforeScroll\",\"" + quot_42(obj.BeforeScroll) + "\")'");
            }
            if (isSpace(obj.AfterScroll) == false) {
                sRetDs.append(" AfterScroll='bill_dsevent(\"AfterScroll\",\"" + quot_42(obj.AfterScroll) + "\")'");
            }

            if (IsSpace(obj.dsProps)) obj.dsProps = "";
            sFormat.append("</fields>");

            sRetDs.append(" " + obj.dsProps);

            if (obj.keyFields == "") {
                //需要根据 ID字段 的属性来找到主键字段类别，
                sRetDs.append(" idtype=\"" + obj.idType + "\"");
                sRetDs.append(" idparam=\"" + obj.idParam + "\"");
            } else {
                sRetDs.append(" idtype=\"5\""); //主键字段类别为多字段作主键
            }
            //加上删除标记作查询初始条件，2013-08-14
            //if (oEbiao.id == "elFilter") {

            if (!IsSpace(obj.deleteMarkField)) {

                sRetDs.append(" sqlWhereFix=\"" + tbname + ".deleteMark=0\"");
            }

            //}

            sRetDs.append(" format=\"")
            sRetDs.append(sFormat);
            sRetDs.append("\"");
            sRetDs.append(" onValid='bill_ondatasetvalid(\"<dsid>");
            sRetDs.append(sbValid);
            sRetDs.append("</dsid>\")'");
            if (oEbiao.id != "elFilter") {
                if (!sbTrans.isEmpty()) sRetDs.append(" fieldtrans=\"<root>" + sbTrans.toString() + "</root>\"");
                if (isRunEbiao != 1) {
                    sRetDs.append(" sqltrans=\"" + SqlPropTrans(obj.sql) + "\"");
                    //if (!IsSpace(obj.deleteMarkField)) {
                    //    sRetDs.append(" sqlWhere=\"" + tbname + ".deleteMark=0\"");
                    //}
                    if (!IsSpace(obj.sortNoField)) sRetDs.append(" sqlOrderBy=\"sortNo\"");
                }
            }
            if (oEbiao.id == "elList" && !IsSpace(oEbiao.getAttribute("isOnloadRun"))) {
                sRetDs.append(" isOnloadRun=\"" + oEbiao.getAttribute("isOnloadRun") + "\"");
            }

            sRetDs.append(" fromGen=\"" + oEbiao.id + "\"");
            sRetDs.append(" ></fc:dataset>");

            this.oContXmlAddOne(oContXml, "dataset", sid);

            fcpubdata.genAllStr += sRetDs.toString();
            var tmpS = sid + "=new dataset(\"" + sid + "\");"; //定义一个全局对象变量
            if (fcpubdata.genEventObj.isGen == "htm") {
                fcpubdata.genEventObj.sbJsStr.append("var " + tmpS);
                fcpubdata.genEventObj.sbDsStr.append(sRetDs.toString());
            } else {
                NavJs.insertHtml("beforeEnd", fcpubdata.area, sRetDs.toString());
                eval("window." + tmpS);
            }
        }
        return sFormat.toString();
    },
    genOneField: function(objField, sFormat, sbValidAll, sbTrans, oEbiao, keyFields, sbLikeFieldNames) {
        var isShowView = oEbiao.getAttribute("isShowView");
        var arrProp = new Array();
        arrProp["fieldkind"] = '数据项';
        arrProp["defaultvalue"] = '';
        arrProp["displayformat"] = '';
        arrProp["isnull"] = '否';
        arrProp["primarykey"] = '否';
        arrProp["visible"] = '是';
        var oDXml = objField.oDetailXml;
        sbValidAll.append("<" + objField.fieldNameNew + ">");

        var sbValid = new Sys.StringBuilder();
        //是否必须唯一
        if (this.getDetailProp(oDXml, "isRepeat") == 1) {
            sbValid.append("$valid('字段值不重复');");
            sbValid.append("$valid('值已存在');");
        }
        //公式默认值
        var tmpExp = this.getDetailProp(oDXml, "defaultExp");
        if (IsSpace(tmpExp) == false) {
            arrProp["fieldkind"] = "变量默认值";
            arrProp["defaultvalue"] = RepXml(unescape(tmpExp));
        }
        var subType = this.getDetailProp(oDXml, "subType");

        if (!IsSpace(keyFields)) {
            keyFields += ",";
            if (keyFields.indexOf(objField.fieldNameNew + ",") >= 0) {
                arrProp["primarykey"] = "是";
                arrProp["visible"] = "否";
            }
        }
        //当在查询条件窗口时，记录需要拼模糊查找的字段。2012-11-19
        if (oEbiao.id == "elFilter" && (objField.type == "自动编号" || objField.type == "名称" || objField.type == "文本" || objField.type == "大文本")) {
            //if (IsSpace(likeFieldNames)) likeFieldNames = "";
            sbLikeFieldNames.append(objField.fieldNameNew + ",");
        }


        switch (objField.type) {
            case "ID字段":
                {
                    if (IsSpace(keyFields)) {
                        arrProp["primarykey"] = "是";
                        arrProp["visible"] = "否";
                    } else {
                        //给ID字段的公式默认值
                        var idType = this.getDetailProp(oDXml, "idType");
                        if (idType == "1") {
                            arrProp["fieldkind"] = "变量默认值";
                            var _funcName = "getMaxNo";
                            if (objField.fdtype == "整数") _funcName = "getMaxIntNo";
                            arrProp["defaultvalue"] = _funcName + "('" + this.getDetailProp(oDXml, "idParam") + "')";

                        }
                    }
                    break;
                }
            case "自动编号":
                {
                    //产生默认值
                    var tmpFormat = this.getDetailProp(oDXml, "showFormat");
                    if (IsSpace(tmpFormat) == false) {
                        arrProp["fieldkind"] = "变量默认值";
                        arrProp["defaultvalue"] = "getAutoNum('" + tmpFormat + "')";
                    }
                    //arrProp["readonly"] = "是";
                    break;
                }
            case "名称":
                sbValid.append("$valid('汉字、字母、数字或_');");
                break;
            //case "文本":                                                                                                                                                                                   
            case "整数":
                sbValid.append("$valid('整数');");
                break;
            case "实数":
                sbValid.append("$valid('实数');");
                break;
            case "日期":
                {
                    switch (objField.subType) {
                        case "日期(date)":
                        case "日期(char)":
                            {
                                sbValid.append("$valid('日期');");
                                break;
                            }
                        case "日期时间(datetime)":
                        case "日期时间(char)":
                            {
                                sbValid.append("$valid('日期时间');");
                                break;
                            }
                        case "年份":
                            {
                                sbValid.append("$valid('整数');");
                                break;
                            }
                        case "年月":
                            {
                                break;
                            }
                    }
                    break;
                }
            case "URL":
                break;
            case "电子邮件":
                sbValid.append("$valid('Email');");
                break;
            case "特别格式":
                {
                    switch (subType) {
                        case "电话":
                            {
                                sbValid.append("$valid('电话号码');");
                                break;
                            }
                        case "手机":
                            {
                                sbValid.append("$valid('手机');");
                                break;
                            }
                        case "邮编":
                            {
                                sbValid.append("$valid('邮政编号');");
                                break;
                            }
                        case "身份证号":
                            {
                                sbValid.append("$valid('身份证号');");
                                break;
                            }
                        case "QQ号":
                            {
                                sbValid.append("$valid('QQ');");
                                break;
                            }
                    }
                    break;
                }
            case "大文本":
                {
                    break;
                }
            case "复选框":
            case "选项列表":
            case "多选列表":
                {
                    var tmp = this.getDetailProp(oDXml, "defaultValue");
                    if (IsSpace(tmp) == false) {
                        arrProp["fieldkind"] = "数据项";
                        arrProp["defaultvalue"] = tmp;
                    }

                    break;
                }
            case "公式":
                {
                    //公式默认值
                    var tmp = this.getDetailProp(oDXml, "defaultExp");

                    if (IsSpace(tmp) == false) {
                        arrProp["fieldkind"] = "实际计算项";
                        arrProp["defaultvalue"] = RepXml(unescape(tmp));
                    }
                    arrProp["readonly"] = "是";
                    break;
                }
            case "累计汇总":
                {
                    //公式默认值
                    var tmp = this.getDetailProp(oDXml, "defaultExp");

                    if (IsSpace(tmp) == false) {
                        arrProp["fieldkind"] = "汇总项"; //还要考虑汇总项的情况
                        arrProp["defaultvalue"] = RepXml(unescape(tmp));
                    }
                    arrProp["readonly"] = "是";
                    break;
                }
            case "查找关系":
                {

                    break;
                }
            case "主从信息表":
                {
                    arrProp["visible"] = "否";
                    break;
                }



        }
        objField.sbValid = sbValid; //存上,供生成控件的事件上用.

        objField.fieldKind = arrProp["fieldkind"];
        objField.defaultValue = arrProp["defaultvalue"];
        objField.displayFormat = arrProp["displayformat"];

        objField.visible = arrProp["visible"];
        objField.primaryKey = arrProp["primarykey"];
        objField.isValid = "是";
        objField.tag = "";

        if (IsTrue(isShowView)) { //只读时，清除所有验证
            objField.sbValid = new Sys.StringBuilder();
            objField.isValid = "否";
            objField.fieldKind = "数据项";
            objField.defaultValue = "";
        }

        var sTrans = new Sys.StringBuilder();
        objField.saveTrans = this.getDetailProp(oDXml, "saveTrans");
        objField.readTrans = this.getDetailProp(oDXml, "readTrans");

        var sEvent = oEbiao.getAttribute("onFieldGen");
        if (!IsSpace(sEvent)) eval(sEvent);

        if (objField.isNull) arrProp["isnull"] = "是";
        if (IsSpace(objField.tableName)) objField.tableName = "";

        sbValidAll.append(quot_xml(objField.sbValid.toString()) + "</" + objField.fieldNameNew + ">");

        sFormat.append("<field fieldType='" + objField.type + "' >"); //加上生成的字段类型， 2013-07-25
        sFormat.append("<fieldname>" + objField.fieldNameNew + "</fieldname>");
        sFormat.append("<datatype>" + objField.fdtype + "</datatype>");
        sFormat.append("<displaylabel>" + objField.fieldChnName + "</displaylabel>");
        sFormat.append("<size>" + objField.fdsize + "</size>");
        sFormat.append("<precision>" + objField.fddec + "</precision>");
        sFormat.append("<fieldkind>" + objField.fieldKind + "</fieldkind>");
        sFormat.append("<defaultvalue>" + objField.defaultValue + "</defaultvalue>");
        sFormat.append("<displayformat>" + objField.displayFormat + "</displayformat>");
        sFormat.append("<isnull>" + arrProp["isnull"] + "</isnull>");
        sFormat.append("<iskey>" + objField.tableName + "</iskey>"); //isKey属性的功能由 是否重复 改为 表名，2012-09-06
        sFormat.append("<valid>" + objField.isValid + "</valid>");
        sFormat.append("<procvalid>否</procvalid>");
        sFormat.append("<link>否</link>");
        sFormat.append("<target></target>");
        sFormat.append("<href></href>");
        sFormat.append("<visible>" + objField.visible + "</visible>");
        sFormat.append("<primarykey>" + objField.primaryKey + "</primarykey>");

        sFormat.append("<fieldvalid></fieldvalid>");
        sFormat.append("<tag>" + objField.tag + "</tag>");
        sFormat.append("</field>");

        var bAllEmpty = IsSpace(objField.saveTrans) && IsSpace(objField.readTrans) && IsSpace(objField.readSql);
        if (!bAllEmpty) sTrans.append("<trans>");
        if (IsSpace(objField.saveTrans) == false) sTrans.append(objField.saveTrans);
        if (!bAllEmpty) sTrans.append("</trans>");

        if (!bAllEmpty) sTrans.append("<rtrans>");
        if (IsSpace(objField.readTrans) == false) sTrans.append(objField.readTrans);
        if (!bAllEmpty) sTrans.append("</rtrans>");

        if (!bAllEmpty) sTrans.append("<sql>");
        if (IsSpace(objField.readSql) == false) sTrans.append(escape(objField.readSql));
        if (!bAllEmpty) sTrans.append("</sql>");

        if (!bAllEmpty) {
            sbTrans.append("<field><name>");
            sbTrans.append(objField.fieldNameNew);
            sbTrans.append("</name>");
            sbTrans.append(sTrans);
            sbTrans.append("</field>");
        }

    },
    oContXmlAddOne: function(oContXml, controltype, contID) {
        //如此ID已存在,则不加
        var oNode = oContXml.documentElement.selectSingleNode("//id[. ='" + contID + "']");
        if (oNode != null) return;

        var oNode = oContXml.documentElement.selectSingleNode(controltype);
        if (oNode == null) {
            var sxml = "<" + controltype + "><id>" + contID + "</id></" + controltype + ">";
            var oX = SetDom(sxml);
            oContXml.documentElement.appendChild(oX.documentElement);

        } else {
            var sxml = "<id>" + contID + "</id>";
            var oX = SetDom(sxml);
            oNode.appendChild(oX.documentElement);
        }
    },
    //    ebiaoToRunOne: function(oTd, oSubCont, oRecRows, arrDsFormat) {
    //        ///运行E表文件转运行串时,处理单个控件的情况
    //        this.ebiaoToRunOneSub(oTd, oSubCont.id, oSubCont.getAttribute("dataset"), oSubCont.getAttribute("field"), oSubCont.style.display, "", oRecRows, arrDsFormat);
    //        //oSubCont.style.display = "none"; //控件先都隐藏起来

    //    },
    ebiaoToRunOneSub: function(oTd, oSubCont_id, oSubCont_dataset, oSubCont_field, oSubCont_display, sClick, oRecRows, arrDsFormat, isSumField) {
        ///运行E表文件转运行串时,处理单个控件的情况
        if (IsSpace(fcpubdata.genEventObj.arrDs)) fcpubdata.genEventObj.arrDs = new Array();

        oTd.setAttribute("e_in_id", oSubCont_id); //"eb_cell_"+
        if (IsSpace(oSubCont_dataset) == false) {
            //判断arrDs中是否存在
            if (Array.indexOf(fcpubdata.genEventObj.arrDs, oSubCont_dataset) == -1) fcpubdata.genEventObj.arrDs[fcpubdata.genEventObj.arrDs.length] = oSubCont_dataset;
            oTd.setAttribute("e_in_dataset_id", oSubCont_dataset);



            // var oCurDs = $id(oSubCont_dataset);
            if (!new Eapi.EformEbiao().isGridDs(oRecRows, oSubCont_dataset)) {
                oTd.setAttribute("e_in_ext_type", "1"); //固定列
            }

            if (oSubCont_display == "none") { //此时为 isShowView == 1
                oTd.setAttribute("e_in_is_hide", "1");
                //加上名称型字段的超链接
                if (!IsSpace(sClick)) oTd.setAttribute("e_in_href", sClick);
            }

            var oXml = SetDom(arrDsFormat[oSubCont_dataset]);

            for (var ii = 0; ii < oXml.documentElement.childNodes.length; ii++) {
                if (oXml.documentElement.childNodes[ii].childNodes[0].text.toUpperCase() == oSubCont_field.toUpperCase()) {
                    oTd.setAttribute("e_in_dataset_colno", ii);
                    if (new Eapi.EformEbiao().isGridDs(oRecRows, oSubCont_dataset)) {
                        if (oXml.documentElement.childNodes[ii].childNodes[16].text == "是") { //primarykey列

                            oTd.setAttribute("e_in_ext_type", "2"); //主动扩展列
                        } else if (isSumField) {
                            oTd.setAttribute("e_in_ext_type", "1"); //固定列
                        } else {
                            oTd.setAttribute("e_in_ext_type", "3"); //附属列
                        }
                    }
                }
            }
        }

    },
    ebiaoToRunAll: function(oEbiao, arrDsFormat) {
        var obj = oEbiao;
        var oTable = NavJs.child(obj, "table", 0); //obj.childNodes[0];
        oTable.setAttribute("e_report_type", "4"); //表示填报
        var sb = new Sys.StringBuilder("<root>");
        if (!IsSpace(fcpubdata.genEventObj.arrDs)) {
            for (var jj = 0; jj < fcpubdata.genEventObj.arrDs.length; jj++) {
                var oo = _getPrimaryKeys(arrDsFormat[fcpubdata.genEventObj.arrDs[jj]]);
                sb.append("<ds>");
                sb.append("<id>" + fcpubdata.genEventObj.arrDs[jj] + "</id>");
                sb.append("<cols>" + oo.cols + "</cols>");
                sb.append("<keys>" + oo.keys + "</keys>");
                sb.append("</ds>");
            }
            sb.append("</root>");
            if (fcpubdata.genEventObj.arrDs.length > 0) oTable.setAttribute("e_in_xml", escape(sb.toString()));
        }
        //obj.innerHTML ="<xml>"+ e_TransReportStr(oTable,false)+"</xml>";
        //将控件串放在e表控件的后部.
        //obj.insertAdjacentHTML("beforeEnd",sbConts.toString());
        var s1 = e_TransReportStr(oTable, false);
        //CopyToPub(s1);
        s1 = attachMergeTag(s1);
        s1 = RepStr(s1, "'", "&apos;"); //替换单引号
        s1 = RepStr(s1, ">\r\n", ">"); //替换换行符
        obj.setAttribute("sourTableStr", s1);
        obj.setAttribute("e_datasource", oTable.getAttribute("e_datasource")); //备份当前报表所要用到的数据源
        //obj.innerHTML = sbConts.toString();
        oTable.outerHTML = ""; //删除设计时的table串，即id=t的table串
        //删除在设计状态下要用到的事件
        obj.removeAttribute("ondragstart");
        obj.removeAttribute("ondrop");
        obj.removeAttribute("ondragend");
        obj.removeAttribute("onmovestart");
        //加上onkeydown事件
        obj.setAttribute("fc_onkeydown", "new Eapi.EformEbiao().keypressMove();");


        function _getPrimaryKeys(dsFormat) {
            ///取数据集的主键字段串
            var sRet = "";

            var oXml = SetDom(dsFormat);
            for (var ii = 0; ii < oXml.documentElement.childNodes.length; ii++) {
                if (NavJs.getNodeValue11(oXml, ii, 16) == "是") { //primarykey列
                    sRet += ii + ",";
                }
            }
            if (sRet != "") sRet = sRet.substring(0, sRet.length - 1);
            return { cols: oXml.documentElement.childNodes.length, keys: sRet };
        }

    },
    openBeforeDsKey: function(dsFormat) {
        ///取打开前数据集的第一个主键字段名及数据类型, 2012-09-06
        var oXml = SetDom(dsFormat);
        for (var ii = 0; ii < oXml.documentElement.childNodes.length; ii++) {
            if (NavJs.getNodeValue11(oXml, ii, 16) == "是") { //primarykey列
                return [NavJs.getNodeValue11(oXml, ii, 0), NavJs.getNodeValue11(oXml, ii, 1)];
            }
        }
    },
    openBeforeFieldType: function(dsFormat, fieldName) {
        ///取打开前数据集的某字段的数据类型, 2012-11-08
        fieldName = fieldName.toLowerCase();
        var oXml = SetDom(dsFormat);
        for (var ii = 0; ii < oXml.documentElement.childNodes.length; ii++) {
            if (fieldName == NavJs.getNodeValue11(oXml, ii, 0).toLowerCase()) { //primarykey列
                return NavJs.getNodeValue11(oXml, ii, 1);
            }
        }
    },
    eblayoutToRunOne: function(oTD, contId, oRecRows, sDs, isShowView, isSumField) {
        var oContsId = fcpubdata.genEventObj.oContsId;
        var oStartRow = fcpubdata.genEventObj.oStartRow;

        //var contId = oId.id;
        // var sDs = oId.getAttribute("dataset");
        var isGridDs = new Eapi.EformEbiao().isGridDs(oRecRows, sDs);
        if (isGridDs && !isSumField) {

            var tableId = "t"; //table的id固定为t
            oTD.setAttribute("controlId", contId);

            var sTmp = oContsId[sDs];
            if (IsSpace(sTmp)) sTmp = "";
            oContsId[sDs] = sTmp + contId + ",";
            //找一个最小的行作为明细数据集的起始行
            var r = oTD.parentNode.rowIndex;
            var oldr;
            if (IsSpace(oStartRow[sDs])) {
                oldr = r;
            } else {
                oldr = oStartRow[sDs][0];
            }

            oStartRow[sDs] = [Math.min(r, oldr), sDs, tableId];
            if (!IsTrue(isShowView)) {
                //隐藏所有的动态显示控件
                var oId = $id(contId);
                if (oId.getAttribute("controltype") == "dropdownlist")
                    oId.setAttribute("visible", "否");
                else
                    oId.style.display = "none";
            }

        } else {
            oTD.id = "eb_cell_" + contId;
            //oName[0].id = "eb_cell_" + contId; //将原来有name属性的控件的ID设置为对应eform控件的ID前+"eb_cell_" , 运行时按此找到控件的位置.
            //oName[0].style.visibility = "hidden";
            fcpubdata.genEventObj.sbHide.append("<" + contId + ">1</" + contId + ">");
        }


    },
    eblayoutToRunAll: function(oEbiao) {

        var oDsSort = fcpubdata.genEventObj.oStartRow.sort(function(a, b) { return a[0] - b[0]; });

        var sbAll = new Sys.StringBuilder();
        sbAll.append("<root><hide>");
        sbAll.append(fcpubdata.genEventObj.sbHide.toString());
        sbAll.append("</hide><dss></dss><conts>");

        var j;
        for (j in oDsSort) {
            if (IsSpace(oDsSort[j])) continue;
            var sDs = oDsSort[j][1];
            var sConts = fcpubdata.genEventObj.oContsId[sDs];
            if (IsSpace(sConts) == false) {
                sConts = sConts.substring(0, sConts.length - 1);
            }
            sbAll.append("<" + sDs + "><startRow>" + oDsSort[j][0] + "</startRow><contsId>" + sConts + "</contsId><tableId>" + oDsSort[j][2] + "</tableId></" + sDs + ">"); //加一个html table的ID
        }

        sbAll.append("</conts></root>");

        NavJs.child(oEbiao, "div", 0).setAttribute("dsXml", escape(sbAll.toString()));

        var oTable = NavJs.child(NavJs.child(oEbiao, "div", 0), "table", 0);
        //if (Sys.Browser.agent != Sys.Browser.InternetExplorer || (Sys.Browser.agent == Sys.Browser.InternetExplorer && typeof (window.dialogWidth) == "undefined")) 
        this.colChangeTd(oTable);
    },
    colChangeTd: function(oTable) {
        ///将一个table的col元素改成td, 2012-12-31
        var oColGroup = NavJs.child(oTable, "colgroup", 0);
        if (oColGroup == null) return;
        var oTr = oTable.insertRow(0);
        oTr.style.height = "3px";
        var oTd;
        for (var i = 0; i < oColGroup.getElementsByTagName("col").length; i++) {
            oTd = oTr.insertCell(i);
            oTd.style.width = NavJs.child(oColGroup, "col", i).style.width;
        }
        oTable.removeChild(oColGroup);
    },
    genTableString: function(tableName, tableChnName, sqlType, column, rowHeight, labelWidth, fieldWidth, isNullRow) {
        /**
        *创建布局模板
        *tableName 表名  tableChnName 表中文名, sqlType sql语句类型, colNum 字段分几列, rowHeight行高, labelWidth字段标题的宽度, fieldWidth 字段的宽度, addNullRow 增加空行
        **/
        colNum = ToInt(column);
        var tableInfo = new Sys.StringBuilder();
        tableInfo.append('<TABLE style="BORDER-BOTTOM: 1px solid; POSITION: absolute; BORDER-LEFT: 1px solid; MARGIN-TOP: 0px; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; MARGIN-LEFT: 0px; FONT-SIZE: 13px; BORDER-TOP: 1px solid; TOP: 0px; BORDER-RIGHT: 0px solid; LEFT: 0px" id=t border=1 cellSpacing=0 borderColor=lightgrey borderColorDark=white cellPadding=0 frame=box e_page_style="1" e_page_orientation="1" e_page_size="4" e_paper_margin_bottom="8" e_paper_margin_right="8" e_paper_margin_top="8" e_paper_margin_left="8" ');
        tableInfo.append('><COLGROUP>');
        var tableObj = this.getQueryInfoFields(tableName, sqlType, 1); //选中数据库中的表生成的字段，sql语句的对象//fhj2012-07-16从下面移到了上面
        var colsNum = 1 + column * 3; //table总列数
        var fieldW = 0; //字段列宽度数组的索引
        var fieldWidthArr = getColWidth(column, fieldWidth, tableObj)//获取字段的宽度
        var w;
        for (var j = 1; j <= colsNum; j++) {
            if (j % 3 == 0) {
                w = fieldWidthArr[fieldW];
                fieldW += 1;
                //w = fieldWidth; //字段列的宽度
            } else if (j % 3 == 1) {
                w = 30;
            } else {
                w = labelWidth; //label列的宽度
            }
            tableInfo.append('<COL style="WIDTH: ' + w + 'px">');
        }
        tableInfo.append('<TBODY>');

        if (tableObj == undefined || tableObj.fields.length < 1) return;
        var row = addNullRow(20, colsNum);
        tableInfo.append(row + row);
        tableInfo.append(addContentRow(tableName, tableChnName, tableObj, rowHeight, column, colsNum, isNullRow));
        tableInfo.append(row);
        tableInfo.append('</TBODY></TABLE>');
        return [tableInfo.toString(), tableObj];

        /**
        * 增加空行，height 行高 colsnum 列数
        **/
        function addNullRow(height, colsNum) {
            var nullRow = new Sys.StringBuilder();
            nullRow.append('<TR style="HEIGHT: ' + height + 'px">');
            for (var i = 0; i < colsNum; i++) {
                nullRow.append('<TD></TD>');
            }
            nullRow.append('</TR>');
            return nullRow.toString();
        }
        /**
        *增内容行
        **/
        function addContentRow(tableName, tableChnName, tableObj, rowHeight, column, colsNum, isNullRow) {
            var contentRow = new Sys.StringBuilder();
            var hiedNum = 0;
            for (var f = 0; f < tableObj.fields.length; f++) {
                var ret = tableObj.fieldsBak[tableObj.fields[f].fieldNameNew].type;
                if (Trim(ret) == "ID字段" || Trim(ret) == "查找关系") {
                    hiedNum += 1;
                    continue;
                }
                if (f - hiedNum == 0 || ((f + 1 - hiedNum) % column == 1 && f >= column) || column == 1) {//增加行开始
                    var newHeight = getRowHeight(tableObj, f, column, rowHeight); //fhj 计算行高
                    contentRow.append('<TR style="HEIGHT: ' + newHeight + 'px"><TD></TD>');
                }
                contentRow.append(addTd(tableName, tableChnName, tableObj, f));
                if ((f == tableObj.fields.length - 1) && ((f + 1 - hiedNum) % column != 0)) {//补齐一行中的空栏数
                    var nullTdNum = column - ((f + 1 - hiedNum) % column);
                    for (var n = 0; n < nullTdNum; n++) {
                        contentRow.append('<TD></TD><TD></TD><TD></TD>');
                    }
                }

                if (((f + 1 - hiedNum) % column == 0) || f == tableObj.fields.length - 1) {//增加行结束部分
                    contentRow.append('</TR>');
                    if (isNullRow == "是" && (f < tableObj.fields.length - hiedNum)) contentRow.append(addNullRow(8, colsNum));
                }
            }
            return contentRow.toString();
        }
        /**
        * 增加一组td <td>label</td><td>field</td><td>null</td>
        **/
        function addTd(tableName, tableChnName, tableObj, f) {
            var addTd = new Sys.StringBuilder();
            addTd.append('<TD  tableName="' + tableName + '" fieldName="' + tableObj.fields[f].fieldNameNew + '" contType="label">' + tableObj.fields[f].fieldChnName + '</TD>');
            addTd.append('<TD title=' + tableChnName + '.' + tableObj.fields[f].fieldChnName + ' tableName="' + tableName + '" fieldName="' + tableObj.fields[f].fieldNameNew + '" contType="field";');
            var classTd = tableObj.fieldsBak[tableObj.fields[f].fieldNameNew].classTd;
            if (IsSpace(classTd) == false) addTd.append(' class="' + classTd + '"');
            addTd.append(' style="');
            var styleTd = tableObj.fieldsBak[tableObj.fields[f].fieldNameNew].styleTd;
            if (IsSpace(styleTd) == false) addTd.append(styleTd + ';');
            addTd.append('BACKGROUND-IMAGE: url(../../fceform/ereport/images/ef_ebiao_text.gif); BACKGROUND-REPEAT: no-repeat;BACKGROUND-POSITION: right;" ></TD>');
            addTd.append('<TD></TD>');
            return addTd.toString();
        }


        /**
        *获取字段列的宽度
        **/
        function getColWidth(column, fieldWidth, tableObj) {
            var hiedNum = 0;
            var WidthArr = new Array();
            for (var f = 0; f < tableObj.fields.length; f++) {
                var ret = tableObj.fieldsBak[tableObj.fields[f].fieldNameNew].type;
                if (Trim(ret) == "ID字段" || Trim(ret) == "查找关系") {
                    hiedNum += 1;
                    continue;
                }
                var width = tableObj.fieldsBak[tableObj.fields[f].fieldNameNew].width; //获取字段宽度
                if (IsSpace(width)) width = ToInt(fieldWidth);
                if ((IsSpace(WidthArr[(f - hiedNum) % ToInt(column)]) == false) && (WidthArr[(f - hiedNum) % ToInt(column)] > width))//如果数组记录了宽度并且大于字段的宽度
                    width = WidthArr[(f - hiedNum) % ToInt(column)];
                WidthArr[(f - hiedNum) % ToInt(column)] = width;
            }
            return WidthArr;
        }
        /**
        *获取行高
        tableObj由表名获取的对象,f当前字段的索引，colN分栏数，rowHeight行高
        **/
        function getRowHeight(tableObj, f, colN, rowHeight) {
            var hiedField = 0;
            var fieldHeight;
            var fieldLen = tableObj.fields.length;
            for (var l = f; l < fieldLen; l++) {
                var ret = tableObj.fieldsBak[tableObj.fields[l].fieldNameNew].type;
                if (Trim(ret) == "ID字段" || Trim(ret) == "查找关系") {
                    hiedField += 1;
                    continue;
                }

                var height = tableObj.fieldsBak[tableObj.fields[l].fieldNameNew].height;
                if (IsSpace(height) == true) height = 0;
                if (ToInt(rowHeight) < ToInt(height)) fieldHeight = ToInt(height);
                if ((l == ToInt(f) + ToInt(colN) - 1 + ToInt(hiedField)) || (l == fieldLen - 1)) {//一行结束或者字段结束
                    return fieldHeight;
                }
            }
        }
    },
    layoutToHtm: function(arrUrl, callback) {
        ///由表单模版生成一个或多个HTM文件
        fcpubdata.pubObj.arrUrl = arrUrl;
        fcpubdata.pubObj.callback = callback;
        fcpubdata.pubObj.indexUrl = 0;
        fcpubdata.pubObj.errInfo = "";
        if (fcpubdata.pubObj.arrUrl.length == 0) return;
        var sUrl = arrUrl[0]; // + "&isgen=htm"; 
        new Eapi.Session().iframeRun("iframeLayoutToHtm", sUrl, function() { });
    },
    getRunUrl: function(tbName, type) {
        ///由表名取得功能点ID，再取得运行URL,type=""
        /// 当type为空时，tbName就是功能点ID,即实现指定某个功能点ID来作URL
        ///返回[运行URL, winSize, 表中文名]

        var sql = "";
        var retUrl = "";
        if (typeof (type) == "undefined") {
            sql = "select fromType,fromName,url,paramUrl,winSize,name from fcq_unit where fcq_unit.id='" + tbName + "'"; //tbName就是功能点ID

        } else {
            var envType = fcpubdata.area.getAttribute("envType"); //getTopWin().fcpubdata.envType;
            if (IsSpace(envType)) envType = "电脑";

            sql = "select fromType,fromName,url,paramUrl,winSize,tbchnname from fc_entity,fcq_unit,fcq_entity_unit where fc_entity.tbname=fcq_entity_unit.tbname and fcq_entity_unit.unitId=fcq_unit.id and fc_entity.tbname='" + tbName + "' and fcq_entity_unit.envType='" + envType + "' and fcq_entity_unit.type='" + type + "'";
        }

        var sRet = SelectSql(sql, 1, 1);
        var oXml = SetDom(sRet);
        if (oXml.documentElement == null) {
            alert(sRet);
            return;
        }
        if (oXml.documentElement.childNodes.length <= 1) return;
        var fromType = oXml.documentElement.childNodes[0].childNodes[0].text;
        if (fromType == 1 || fromType == 2 || fromType == 6) {
            retUrl = "../../fceform/common/djframe.htm?djsn="
        } else if (fromType == 3 || fromType == 4) {
            retUrl = "../../fceform/ereport/ebrun.htm?file=";
        }
        retUrl += oXml.documentElement.childNodes[0].childNodes[1].text + oXml.documentElement.childNodes[0].childNodes[2].text + oXml.documentElement.childNodes[0].childNodes[3].text;

        return [retUrl, oXml.documentElement.childNodes[0].childNodes[4].text, oXml.documentElement.childNodes[0].childNodes[5].text];
    },
    getMainDs: function(oEbiao) {
        ///找到E表控件中的主数据集, 2012-09-06
        var allDsId = oEbiao.getAttribute("allDsId");
        if (!IsSpace(allDsId)) {
            var arr = allDsId.split(",");
            for (var i = 0; i < arr.length; i++) {
                var oDs = $id(arr[i]);
                if (IsSpace(oDs)) continue;

                if (!IsTrue(oDs.getAttribute("isSubGrid"))) {
                    return oDs;
                }
            }
            return $id(arr[0]); //返回第一个数据集
        }
        return null;
    },
    getGridDs: function(oEbiao) {
        ///找到E表控件中的表格数据集, 2012-09-24
        var allDsId = oEbiao.getAttribute("allDsId");
        if (!IsSpace(allDsId)) {
            var arr = allDsId.split(",");
            for (var i = 0; i < arr.length; i++) {
                var oDs = $id(arr[i]);
                if (IsSpace(oDs)) continue;

                if (IsTrue(oDs.getAttribute("isSubGrid"))) {
                    return oDs;
                }
            }
            return $id(arr[0]); //返回第一个数据集
        }
        return null;
    },
    getAllDs: function(oEbiao) {
        ///找到E表控件中的所有数据集, 2012-09-24
        var allDsId = oEbiao.getAttribute("allDsId");
        if (!IsSpace(allDsId)) {
            var arrRet = new Array();
            var arr = allDsId.split(",");
            for (var i = 0; i < arr.length; i++) {
                var oDs = $obj(arr[i]);
                if (IsSpace(oDs)) continue;
                arrRet[arrRet.length] = oDs;
            }
            return arrRet;
        }
        return null;
    }
}
if (Type.parse("Eapi.Layout") == null) Eapi.Layout.registerClass("Eapi.Layout");

//组织机构，用户，简档，角色等通用函数。
Eapi.CommonPermit = function() { }
Eapi.CommonPermit.prototype =
{
    toNameUsers: function(userIds) {
        ///逗号分隔的多个用户ID转成名称
        var usersName = "";
        if (IsSpace(userIds) == true) return usersName; //fhj不加此判断将返回undefined
        var userArr = userIds.split(',');

        for (var i = 0; i < userArr.length; i++) {
            usersName += new Eapi.CommonPermit().toNameUser(userArr[i]);
            if (i < userArr.length - 1) usersName += ",";
        }
        return usersName;
    },
    toNameUser: function(userId) {
        ///用户ID转成名称
        if (fcpubdata.pubObj.userDom == null) {
            var xmlR = SelectSql("select userid,username from fcq_user", 1, -1);
            fcpubdata.pubObj.userDom = SetDom(xmlR);
            if (fcpubdata.pubObj.userDom.documentElement == null) {
                alert(xmlR);
                return;
            }
        }
        for (var j = 0; j < fcpubdata.pubObj.userDom.documentElement.childNodes.length - 1; j++) {
            if (userId == fcpubdata.pubObj.userDom.documentElement.childNodes[j].childNodes[0].text) {
                return fcpubdata.pubObj.userDom.documentElement.childNodes[j].childNodes[1].text;
            }
        }
    },

    toNameProfiles: function(profileIds) {
        ///逗号分隔的多个用户简档ID转成名称
        var profilesName = "";
        var profileArr = profileIds.split(',');
        for (var i = 0; i < profileArr.length; i++) {
            profilesName += new Eapi.CommonPermit().toNameProfile(profileArr[i]);
            if (i < profileArr.length - 1) profilesName += ",";
        }
        return profilesName;
    },
    toNameProfile: function(profileId) {
        ///逗号分隔的用户简档ID转成名称
        if (fcpubdata.pubObj.profileDom == null) {
            var xmlR = SelectSql("select profileid,profilename from fcq_profile", 1, -1);
            fcpubdata.pubObj.profileDom = SetDom(xmlR);
            if (fcpubdata.pubObj.profileDom.documentElement == null) {
                alert(xmlR);
                return;
            }
        }
        for (var j = 0; j < fcpubdata.pubObj.profileDom.documentElement.childNodes.length - 1; j++) {
            if (profileId == fcpubdata.pubObj.profileDom.documentElement.childNodes[j].childNodes[0].text) {
                return fcpubdata.pubObj.profileDom.documentElement.childNodes[j].childNodes[1].text;
            }
        }
    }
}
if (Type.parse("Eapi.CommonPermit") == null) Eapi.CommonPermit.registerClass("Eapi.CommonPermit");

//表单模版上经常要调用到的方法。
Eapi.FormTemp = function() { }
Eapi.FormTemp.prototype =
{
    openBefore: function() {
        ///一般在表单模版的表单打开之前事件中调用, 2012-09-04

        //卡片式表单
        var elCardObj = $id("elCard");
        var objCard = new Object();
        objCard.oEbiao = elCardObj;
        if (!IsSpace(elCardObj) && elCardObj.getAttribute("controltype") == "eblayout") {
            var oMainDs = null;
            var isAdd = false;
            var initParams = "&fcKeyValue="; //E表文件的运行参数
            var keyValue = $urlParam("fcKeyValue");
            if (!IsSpace(fcpubdata.obj)) {
                //模态窗口打开
                var dsId = fcpubdata.obj.oDs.id;
                oMainDs = $id(dsId);
                keyValue = fcpubdata.obj.oDs.Field(fcpubdata.obj.oDs.firstKeyFieldName).Value;
                isAdd = fcpubdata.obj.isAdd;
            } else {
                isAdd = IsSpace(keyValue);
            }
            if (oMainDs == null) oMainDs = new Eapi.Layout().getMainDs(elCardObj);
            if (oMainDs != null) {
                objCard.cardDs = $obj(oMainDs.id);
                this.actionKeySql(oMainDs, keyValue, isAdd);
                this.actionMainSub();
            }

            if (!IsTrue(isAdd)) initParams += keyValue;
            //alert(initParams)
            objCard.oEbiao.setAttribute("initParams", initParams);
            objCard.oEbiao.setAttribute("runParams", initParams);
        }
        fcpubdata.elCard = objCard;

        //查询条件输入界面
        var elFilterObj = $id("elFilter");
        var elListObj = $id("elList");
        if (elListObj != null) {
            var oPageSize = $id("oPageSize");
            if (oPageSize != null) {
                oPageSize.onkeypress = function() {

                }
            }
        }
        if (elFilterObj != null && elListObj != null) {
            //            if (elListObj == null) {
            //                //模态打开查询条件输入窗口时
            //                if (fcpubdata.obj != null) elListObj = fcpubdata.obj;
            //            }
            //上面是条件，下面是列表结果。

            //需要在filter数据集的打开之后事件中，设置list数据集的打开之前事件的内容，即将SQL参数传入。
            var isRunEbiao = elListObj.getAttribute("isRunEbiao");
            if (isRunEbiao != 1) {
                var dsFilter = new Eapi.Layout().getMainDs(elFilterObj);
                var dsList = new Eapi.Layout().getGridDs(elListObj);
                new Eapi.FormTemp().dsAddEvent(dsFilter.id, "AfterOpen", "new Eapi.FormTemp().runFilter('" + $id('elFilter') + "','" + $id('elList') + "');");
                new Eapi.FormTemp().dsAddEvent(dsList.id, "BeforeOpen", "new Eapi.FormTemp().dsGenSql('" + dsList.id + "')");
            } else {

            }


        }
        //列表界面，或是单一的查询结果界面
        if (elFilterObj == null && elListObj != null) {
            var isTopWinObj = $urlParam("isTopWinObj");
            if (!IsSpace(isTopWinObj) && IsTrue(isTopWinObj)) {
                var oWin = getTopWin();
                var oFilter = oWin.fcpubdata.topWinObj.oFilter
                if (!IsSpace(oFilter)) {
                    var isRunEbiao = elListObj.getAttribute("isRunEbiao");
                    if (isRunEbiao == 1) {
                        new Eapi.EformEbiao().genRunParams(elListObj, oFilter.runParams);
                    } else {
                        for (var i = 0; i < oFilter.arrSqlObj.length; i++) {
                            var oDs = $id(oFilter.arrSqlObj[i].tableName);
                            if (!IsSpace(oDs))
                                oDs.setAttribute("sqlWhere", oFilter.arrSqlObj[i].sqlWhere);
                        }
                    }
                }
            }
            //给列表式界面生成数据集的SQL上的条件，如删除标记及排序，2013-08-14
            var dsList = new Eapi.Layout().getGridDs(elListObj);
            //alert(dsList.id);
            new Eapi.FormTemp().dsAddEvent(dsList.id, "BeforeOpen", "new Eapi.FormTemp().dsGenSql('" + dsList.id + "')");
        }

    },
    openAfter: function() {
        ///一般在表单模版的表单打开之后事件中调用，用于取得一些常用的全局变量到 fcpubdata.pubObj 上。2012-08-29

        var elListObj = $id("elList");
        if (!IsSpace(elListObj) && elListObj.getAttribute("controltype") == "eblayout") {

            var obj = new Object();
            obj.oEbiao = elListObj;

            var oDs = new Eapi.Layout().getGridDs(elListObj);
            if (oDs != null) {
                obj.listDs = $obj(oDs.id);
            }

            var oPageSize = $id("pageSize");
            if (oPageSize != null) {
                if (elListObj.getAttribute("isRunEbiao") == 1) {
                    var showHeight = elListObj.getAttribute("showHeight");
                    if (IsSpace(showHeight)) showHeight = -1;

                    oPageSize.value = showHeight
                } else if (oDs != null) {
                    var pageSize = oDs.getAttribute("PageSize");
                    if (IsSpace(pageSize)) pageSize = 500;  //每页记录数默认取500条。 2012-11-12
                    oPageSize.value = pageSize;
                }
            }
            fcpubdata.elList = obj;

            new Eapi.FormTemp().setPageCount();
            new Eapi.FormTemp().fillPageGo(fcpubdata.elList.oEbiao.getAttribute("pageCount"), true);
        }


    },
    getKeySql: function(oMainDs, keyValue, keyFieldName, sqltrans) {
        ///取得加上主键字段作条件的数据集SQL语句，2012-11-08
        if (IsSpace(keyValue)) return;
        var dsId = oMainDs.id;
        if (IsSpace(sqltrans)) sqltrans = oMainDs.getAttribute("sqltrans");
        var sql = UnSqlPropTrans(sqltrans);
        if (IsSpace(sql)) return;

        var sqlHolder = "?";
        if (!IsTrue(fcpubdata.isOleDb)) {
            if (fcpubdata.databaseTypeName == "sqlserver") sqlHolder = "@";
            if (fcpubdata.databaseTypeName == "oracle") sqlHolder = ":";
            sqlHolder += "fcKeyValue";
        }
        var fieldType;
        if (IsSpace(keyFieldName)) {
            var arr = new Eapi.Layout().openBeforeDsKey(oMainDs.getAttribute("format"));
            keyFieldName = arr[0];
            fieldType = arr[1];
        } else {
            fieldType = new Eapi.Layout().openBeforeFieldType(oMainDs.getAttribute("format"), keyFieldName);
        }
        sql += " where " + dsId + "." + keyFieldName + "=" + sqlHolder; //" + dsId + ".deleteMark=0 and

        if (fieldType != "整数") fieldType = "字符串";
        // if (!IsSpace(fcpubdata.obj)) keyValue = fcpubdata.obj.oDs.Field(arr[0]).Value;
        var sqlParams = '<params><param name="fcKeyValue" dataType="' + fieldType + '" >' + keyValue + '</param></params>';
        return {
            opensql: sql,
            sqlParams: sqlParams
        }
        //oMainDs.setAttribute("opensql", sql);
        //alert(sqlParams)
        //oMainDs.setAttribute("sqlParams", sqlParams);

    },
    actionKeySql: function(oMainDs, keyValue, isAdd) {
        ///处理加上主键字段作条件的数据集SQL语句，2012-11-08
        oMainDs = $id(oMainDs.id);
        if (!IsTrue(isAdd)) {
            var obj = this.getKeySql(oMainDs, keyValue);
            if (!IsSpace(obj)) {
                oMainDs.setAttribute("opensql", obj.opensql);
                oMainDs.setAttribute("sqlParams", obj.sqlParams);
            }
        }
        oMainDs.setAttribute("sqltrans", "");
        oMainDs.removeAttribute("sqltrans");
    },
    actionMainSub: function() {
        ///处理整个表单的有主从关系的数据集，一般用于表单打开之前事件中，2012-11-08
        var arrMaster = new Array();
        var oo = NavJs.getDatasetArr();
        var l = oo.length;
        for (var ii = 0; ii < l; ii++) {
            if (!IsTrue(oo[ii].getAttribute("issubds"))) continue;
            var oDsMaster = $id(oo[ii].getAttribute("masterds"));
            if (oDsMaster == null) continue;

            //主数据集的页尺寸置为1
            $obj(oDsMaster.id).PageSize = 1;

            //生成主数据集的事件代码
            var oMaster = new Object();
            oMaster.oDs = oDsMaster;
            //fcpubdata.keyValue = DsMain.Field('djbh').Value; dssub1.Open('select FCS_BILLSUB1.*,FCS_ITEM.sitemcode,FCS_ITEM.sitemname from FCS_BILLSUB1 inner join FCS_ITEM on FCS_BILLSUB1.sitemid=FCS_ITEM.sitemid where djbh=:key_value');

            var sEvent = "var oTmp = new Eapi.FormTemp().getKeySql($id('" + oo[ii].id + "')," + oDsMaster.id + ".Field('" + oo[ii].getAttribute('masterdsfield') + "').Value,'" + oo[ii].getAttribute('subdsfield') + "','" + oo[ii].getAttribute("sqltrans") + "'); if(!IsSpace(oTmp)) {$id('" + oo[ii].id + "').setAttribute('sqlParams', oTmp.sqlParams); " + oo[ii].id + ".Open(oTmp.opensql);} ";
            oMaster.AfterScroll = sEvent;

            arrMaster[arrMaster.length] = oMaster;

            //清空子数据集的SQL
            oo[ii].setAttribute("sqltrans", "");
            oo[ii].removeAttribute("sqltrans");

        }
        //加上事件代码
        for (var i = 0; i < arrMaster.length; i++) {
            var oDs = arrMaster[i].oDs;
            var sEvent = oDs.getAttribute("AfterScroll");
            if (!IsSpace(sEvent))
                sEvent += ";";
            else
                sEvent = "";

            sEvent += arrMaster[i].AfterScroll;
            oDs.setAttribute("AfterScroll", sEvent);
        }
    },
    getFilter: function(elFilterObj, tableNames) {
        ///取得查询条件串， tableNames为要处理的逗号分隔的表名。2012-11-14

        var oWin = getTopWin();
        oWin.fcpubdata.topWinObj.oFilter = new Object();

        var sbWhere = new Sys.StringBuilder();
        var sbParam = new Sys.StringBuilder();
        var allDsId = tableNames;
        if (!IsSpace(allDsId)) allDsId += ",";
        var allDsIdF = elFilterObj.getAttribute("allDsId");

        if (IsSpace(allDsIdF)) return;
        var allParam = new Sys.StringBuilder(); //所有的E表参数
        var allWhere = new Sys.StringBuilder(); //where_all的参数值

        var arrTable = new Array();

        var arr = allDsIdF.split(",");
        for (var i = 0; i < arr.length; i++) {
            if (IsSpace(arr[i])) continue;
            var oDs = $obj(arr[i]);
            if (IsSpace(oDs)) continue;
            var tableName = $id(arr[i]).getAttribute("savetable");
            if (IsSpace(tableName)) continue;
            if (!IsSpace(allDsId) && allDsId.indexOf(tableName + ",") < 0) continue; //按表名同名来匹配。

            sbWhere = new Sys.StringBuilder();
            sbParam = new Sys.StringBuilder();
            var likeFieldNames = $id(oDs.id).getAttribute("likeFieldNames");
            if (IsSpace(likeFieldNames))
                likeFieldNames = "";
            else
                likeFieldNames += ",";

            for (var j = 0; j < oDs.FieldCount; j++) {
                if (IsSpace(oDs.Field(j).Value) || oDs.Field(j).Value == fcpubdata.querySelectTag) continue;
                var tableNameIn = oDs.Field(j).isKey;
                if (tableNameIn == tableName) {
                    sbWhere.append(new Eapi.Str().genWhere(tableName + "." + oDs.Field(j).FieldName, oDs.Field(j).DataType, oDs.Field(j).Value, likeFieldNames.indexOf(oDs.Field(j).FieldName + ",") >= 0));
                    sbWhere.append(" and ");
                }
                sbParam.append(tableName + "_" + oDs.Field(j).FieldName + "=" + escape(oDs.Field(j).Value) + "&");
            }
            if (!sbWhere.isEmpty()) {
                allWhere.append(sbWhere);
            }
            var s = sbWhere.toString();

            if (s.length > 4) s = s.substring(0, s.length - 4); //去掉 and
            //var ooDs = $id(tableName);
            //ooDs.setAttribute("sqlWhere", s);
            var oTable = new Object();
            oTable.tableName = tableName;
            oTable.sqlWhere = s;
            arrTable[arrTable.length] = oTable;


            allParam.append("where_");
            allParam.append(tableName);
            allParam.append("=");
            if (!IsSpace(s)) {
                allParam.append(escape(" and ")); //条件的开始有 and
            }
            allParam.append(escape(s));
            allParam.append("&");
            allParam.append(sbParam);


        }
        //2013-08-16 去掉下面，免得报表参数太多。
        //        var s = allWhere.toString();
        //        if (s.length > 4) {
        //            s = s.substring(0, s.length - 4); //去掉 and
        //            allParam.append("where_all=");
        //            allParam.append(escape(" where "));
        //        }
        //        allParam.append(escape(s));
        //        
        var s = allParam.toString();
        if (s.length > 1) s = s.substring(0, s.length - 1); //去掉 &
        //new Eapi.EformEbiao().genRunParams(elListObj, s);
        oWin.fcpubdata.topWinObj.oFilter.runParams = s;
        oWin.fcpubdata.topWinObj.oFilter.arrSqlObj = arrTable;
        return oWin.fcpubdata.topWinObj.oFilter;

    },
    runFilter: function(elFilterObj, elListObj, oFilter) {
        ///处理条件串，oFilter参数有值时是用于从单独的查询条件模态窗口中返回它。 2012-09-27

        //var elFilterObj = $id("elFilter");
        //var elListObj = $id("elList");

        if (IsSpace(elListObj) || elListObj.getAttribute("controltype") != "eblayout") return;
        if ((IsSpace(elFilterObj) || elFilterObj.getAttribute("controltype") != "eblayout") && IsSpace(oFilter)) return;
        if (IsSpace(oFilter)) {
            var allDsId = elListObj.getAttribute("allDsId");
            oFilter = this.getFilter(elFilterObj, allDsId);
        }
        if (!IsSpace(oFilter)) {
            new Eapi.EformEbiao().genRunParams(elListObj, oFilter.runParams);
            for (var i = 0; i < oFilter.arrSqlObj.length; i++) {
                var oDs = $id(oFilter.arrSqlObj[i].tableName);
                if (!IsSpace(oDs))
                    oDs.setAttribute("sqlWhere", oFilter.arrSqlObj[i].sqlWhere);
            }
        }

    },
    dsAddEvent: function(dsId, eventName, eventCode) {
        ///用代码给数据集加上事件代码。 2012-10-08
        var oDs = $id(dsId);
        oDs.setAttribute(eventName, 'bill_dsevent(\"' + eventName + '\",\"' + quot_42(eventCode) + '\")');
    },
    dsGenSql: function(dsId) {
        ///合并数据集的SQL的各个组成部分，2012-10-08
        var sqlAll = "";
        var oDs = $id(dsId);

        var sqlSelect = UnSqlPropTrans(oDs.getAttribute("sqltrans"));
        if (IsSpace(sqlSelect)) {
            sqlSelect = oDs.getAttribute("sqlSelect");
            if (IsSpace(sqlSelect)) return;
        } else {
            oDs.setAttribute("sqlSelect", sqlSelect);
            oDs.removeAttribute("sqltrans");
        }
        var sWhere = " where ";
        var sOrderBy = "";
        var sqlWhereFix = oDs.getAttribute("sqlWhereFix");
        if (IsSpace(sqlWhereFix)) sqlWhereFix = "";
        //alert(sqlWhereFix);
        var sqlWhere = oDs.getAttribute("sqlWhere");
        if (IsSpace(sqlWhere)) sqlWhere = "";
        if (sqlWhereFix == "") {
            if (sqlWhere == "") sWhere = "";
        } else {
            if (sqlWhere != "") sqlWhere = " and " + sqlWhere;
        }
        var sqlOrderBy = oDs.getAttribute("sqlOrderBy");
        if (IsSpace(sqlOrderBy)) sqlOrderBy = "";
        if (sqlOrderBy != "") sOrderBy = " order by ";
        sqlAll = sqlSelect + sWhere + sqlWhereFix + sqlWhere + sOrderBy + sqlOrderBy;
        //alert(sqlAll);
        oDs.setAttribute("opensql", sqlAll);
        $obj(oDs.id).opensql = sqlAll;
    },
    runQuery: function(listUnitId) {
        ///查询按钮执行程序，2012-10-09
        var elFilterObj = $id("elFilter");
        var elListObj = $id("elList");
        if (elFilterObj != null && elListObj != null) {
            new Eapi.FormTemp().runFilter($id('elFilter'), $id('elList'));
            var isRunEbiao = elListObj.getAttribute("isRunEbiao");
            if (isRunEbiao != 1) {

                //var dsFilter = new Eapi.Layout().getMainDs(elFilterObj);
                var dsList = new Eapi.Layout().getGridDs(elListObj);
                if (dsList != null)
                    new Eapi.FormTemp().dsGenSql(dsList.id);
                //var oDs = $obj(dsList.id);
                //alert(oDs.opensql)
                //oDs.Open();
                //new Eapi.EformEbiao().refreshDs(elListObj, oDs);
            }
            new Eapi.FormTemp().refreshList();

        }
        //单独的查询界面
        if (elFilterObj != null && elListObj == null) {
            var oDs = new Eapi.Layout().getMainDs(elFilterObj);
            var tbName = oDs.getAttribute("savetable");
            var objRet = this.getFilter(elFilterObj, tbName);
            if (IsSpace(fcpubdata.obj)) { //由fcpubdata.obj是否为空来判断当前是否为模态打开的窗口，以前是用 window.dialogArguments 来判断。
                if (IsSpace(listUnitId)) {
                    var runUrl = new Eapi.Layout().getRunUrl(tbName, "列表");
                } else {
                    var runUrl = new Eapi.Layout().getRunUrl(listUnitId);
                }
                if (!IsSpace(runUrl)) {
                    var allUrl = runUrl[0] + "&isTopWinObj=1"; //需要指明通过顶层窗口来传递查询参数

                    var envType = fcpubdata.area.getAttribute("envType");
                    if (!IsSpace(envType) && envType != "电脑") {
                        NavJs.phoneOpenUrl(allUrl);
                    } else {
                        //window.open(allUrl, "rightWin");
                        var sCommand = "CreateNewTabWin('" + allUrl + "', '查询结果','')";
                        top.eval(sCommand);
                    }
                } else {
                    alert("没有设置表 " + tbName + " 的用于显示查询结果的列表页面，请到 表结构设计/功能点信息 界面上设置！");
                }
            } else {
                //模态窗口
                window.returnValue = objRet;
                CloseBill();
            }
        }

    },
    openQueryWin: function(isModalQuery, queryUnitId) {
        ///在查询结果页面上弹出查询条件窗口时用。2012-11-14
        //queryUrl 指定查询条件窗口url
        var elFilterObj = $id("elFilter");
        var elListObj = $id("elList");
        if (elFilterObj == null && elListObj != null) {
            var dsList = new Eapi.Layout().getGridDs(elListObj);
            if (IsSpace(queryUnitId)) {
                var runUrl = new Eapi.Layout().getRunUrl(dsList.id, "查询");
            } else {
                var runUrl = new Eapi.Layout().getRunUrl(queryUnitId);
            }
            if (!IsSpace(runUrl)) {
                var oContext = {};
                //oContext.oFilter = oFilter;
                oContext.elFilterObj = elFilterObj;
                oContext.elListObj = elListObj;
                oContext.dsListId = dsList.id;

                if (IsSpace(isModalQuery)) isModalQuery = true;
                var queryUrl = runUrl[0];

                var envType = fcpubdata.area.getAttribute("envType");
                if (!IsSpace(envType) && envType != "电脑") {
                    NavJs.phoneOpenUrl(queryUrl);
                } else if (!isModalQuery) {
                    NavJs.mainOpenUrl(queryUrl, "设置查询条件");
                } else {
                    if (fcpubdata.isModalUser) { //

                        NavJs.openModalDialog(queryUrl, elListObj, this.winSizeTrans(runUrl[1]), function(oRet) { var oFilter = oRet.value; var oContext = oRet.context; _modalReturn(oFilter, oContext); }, oContext);
                    } else {
                        var oFilter = window.showModalDialog(queryUrl, elListObj, "resizable:yes;status:yes;" + runUrl[1]);
                        _modalReturn(oFilter, oContext);
                    }
                }
            } else {
                alert("没有设置表 " + dsList.id + " 的查询条件页面，请到 表结构设计/功能点信息 界面上设置！");
            }
        }
        function _modalReturn(oFilter, oContext) {
            if (IsSpace(oFilter)) return;
            if (IsSpace(oContext)) return;

            new Eapi.FormTemp().runFilter(oContext.elFilterObj, oContext.elListObj, oFilter);
            new Eapi.FormTemp().dsGenSql(oContext.dsListId);
            new Eapi.FormTemp().refreshList();
        }
    },
    winSizeTrans: function(winSize) {
        ///由  window.showModalDialog 带的winSize定义串转换成新的对象， 2013-02-19
        var oWinSize = {};

        var arrSize = winSize.split(";");
        if (arrSize.length == 2) {
            var sWidth = arrSize[1];
            var arr1 = sWidth.split(":");
            oWinSize.width = ToInt(arr1[1]);

            var sHeight = arrSize[0];
            var arr1 = sHeight.split(":");
            oWinSize.height = ToInt(arr1[1]);
        }
        return oWinSize;
        //getClientSize(top)
    },
    addBgRow: function(oEbiao, oDs, sColor) {
        ///给表格的行在鼠标进入时加上背景色，2012-12-06
        if (typeof (oEbiao) == "undefined") {
            oEbiao = $id("elList");
            if (IsSpace(oEbiao)) oEbiao = $id("elSub");
            oDs = new Eapi.Layout().getGridDs(oEbiao);
            if (oDs != null)
                oDs = $obj(oDs.id);
            sColor = "#e6e6fa";
        }
        var oTable = new Eapi.EformEbiao().getTable(oEbiao);
        var startRow = 0, endRow = oTable.rows.length;

        if (!IsSpace(oDs)) {
            if (typeof (oDs.e_startRow) == "undefined" || oDs.e_recRows > 1) return;
            startRow = oDs.e_startRow;
            endRow = oDs.RecordCount;
        }
        for (var i = startRow; i < endRow; i++) {
            if (i >= oTable.rows.length) break;
            var oTr = oTable.rows[i];
            oTr.setAttribute("bakBgColor", oTr.style.backgroundColor);
            //NavJs.addEvent(oTr, "onmouseover", function() { this.style.backgroundColor = "e6e6fa"; });
            //NavJs.addEvent(oTr, "onmouseover", function() { this.style.backgroundColor = "e6e6fa"; });
            oTr.onmouseover = function() { this.style.backgroundColor = "#e6e6fa"; }
            oTr.onmouseout = function() { this.style.backgroundColor = this.getAttribute("bakBgColor"); }
        }

    },
    adjustCol: function(oEbiao) {
        ///调整列宽, 2012-12-08
        if (Sys.Browser.agent != Sys.Browser.InternetExplorer) return;

        if (typeof (oEbiao) == "undefined") {
            oEbiao = $id("elList");
            if (IsSpace(oEbiao)) oEbiao = $id("elSub");
        }

        var oArea = new Eapi.EformEbiao().get4Area(oEbiao);
        var oDivMain = NavJs.child(oEbiao, "div", 0);
        var oDiv = null;
        var oDiv2;
        if (oArea != null && (oArea.mode == 2 || oArea.mode == 4)) {
            if (oArea.mode == 2) {
                oDiv = NavJs.child(oDivMain, "div", 0);
                oDiv2 = NavJs.child(oDivMain, "div", 1);
            } else {
                oDiv = NavJs.child(oDivMain, "div", 1);
                oDiv2 = NavJs.child(oDivMain, "div", 3);
            }
        } else {
            return;
        }
        fcpubdata.pubObj.AdjustLine = NavJs.insertHtml("beforeEnd", document.body, '<TABLE onmousemove="this.style.left = this.style.pixelLeft + 2;" bgColor=black border=0 cellPadding=0 cellSpacing=0 id=line style="DISPLAY: none; HEIGHT: 28px; LEFT: -270px; POSITION: absolute; TOP: 50px; WIDTH: 1px;z-index:10;"><TR><TD></TD></TR></TABLE>');
        //alert(oDiv.outerHTML);
        oDiv.onmousedown = function() {

            if (event.button != 1) return;
            var eventx = event.x;
            var eventy = event.y;
            var div1 = this;
            var tgrid = NavJs.child(this, "table", 0); ;
            //var mainTable = new Eapi.EformEbiao().get4Area(this.parentNode.parentNode);

            var curObj = document.elementFromPoint(eventx, eventy);
            if (curObj == null) return;
            if (curObj.tagName != "TD") return;

            var curCol = curObj.cellIndex;
            curObj = curObj.parentNode;
            var curRow = curObj.rowIndex;

            //调节列宽
            if (tgrid.style.cursor == "col-resize") {

                fcpubdata.pubObj.AdjustLine.style.display = "block";


                fcpubdata.pubObj.AdjustWidth = eventx;
                fcpubdata.pubObj.AdjustLine.style.left = eventx;
                fcpubdata.pubObj.AdjustLine.style.top = getAbsTop(div1);
                fcpubdata.pubObj.AdjustLine.style.height = div1.offsetHeight + oDiv2.offsetHeight;
                fcpubdata.pubObj.blnAdjust = true;
                div1.setCapture();
            }
            else {
                fcpubdata.pubObj.AdjustLine.style.display = "none";
                fcpubdata.pubObj.blnAdjust = false;
            }


        }

        oDiv.onmousemove = function() {
            var eventx = event.x;
            var eventy = event.y;
            var div1 = this;
            var tgrid = NavJs.child(this, "table", 0); ;
            //var mainTable = new Eapi.EformEbiao().get4Area(this.parentNode.parentNode);


            if (fcpubdata.pubObj.blnAdjust == true) {
                fcpubdata.pubObj.AdjustLine.style.left = eventx;
            }
            else {//变列鼠标形状

                var curObj = document.elementFromPoint(eventx, eventy);
                if (curObj == null) return;

                if (curObj.tagName != "TD") {
                    return;
                }

                //------------
                //改变列宽  
                var curCol = NavJs.index(curObj, "TD");
                // $id("button1").innerText = curCol; //curObj.innerHTML;

                tgrid.style.cursor = "default";
                var left1 = left2 = left3 = 0;
                left1 = eventx + div1.scrollLeft;
                left2 = div1.offsetLeft + curObj.offsetLeft;
                left3 = left2 + curObj.offsetWidth;
                if (left1 > left2 && left1 < left2 + 6) {
                    if (curObj.cellIndex <= 0) return; //
                    fcpubdata.pubObj.AdjustCol = curCol - 1;
                    tgrid.style.cursor = "col-resize";
                } else if (left1 < left3 && left1 > left3 - 2) {
                    fcpubdata.pubObj.AdjustCol = curCol;
                    tgrid.style.cursor = "col-resize";
                }



            } // end if

        }

        oDiv.onmouseup = function() {
            var div1 = this;
            var tgrid = NavJs.child(this, "table", 0); ;
            if (typeof fcpubdata.pubObj.AdjustWidth != "undefined") {
                var mainTable = new Eapi.EformEbiao().getTable(this.parentNode.parentNode);

                var bHideCol = false;
                //调节列宽
                if (fcpubdata.pubObj.AdjustLine.style.display != "none") {
                    //$id("button1").innerText = fcpubdata.pubObj.AdjustCol;
                    var lngRange = ToInt(fcpubdata.pubObj.AdjustLine.style.left) - ToInt(fcpubdata.pubObj.AdjustWidth);
                    var oldWidth = tgrid.children[0].children[0].children[fcpubdata.pubObj.AdjustCol].style.pixelWidth;
                    var afterWidth = oldWidth + lngRange;
                    if (afterWidth <= 0) {
                        tgrid.children[0].children[0].children[fcpubdata.pubObj.AdjustCol].style.width = 0; //隐藏列的列宽为1
                        bHideCol = true;
                    } else {
                        if (tgrid.children[0].children[0].children[fcpubdata.pubObj.AdjustCol].style.pixelWidth <= 1 && afterWidth > 1) bHideCol = true;
                        //tgrid.children[0].children[0].children[fcpubdata.pubObj.AdjustCol].style.width = afterWidth;
                        tgrid.rows[0].cells[fcpubdata.pubObj.AdjustCol].style.width = afterWidth;
                    }
                    //mainTable.children[0].children[0].children[fcpubdata.pubObj.AdjustCol].style.width = tgrid.children[0].children[0].children[fcpubdata.pubObj.AdjustCol].style.width;
                    mainTable.rows[0].cells[fcpubdata.pubObj.AdjustCol].style.width = tgrid.rows[0].cells[fcpubdata.pubObj.AdjustCol].style.width;
                }
            }
            fcpubdata.pubObj.AdjustWidth = 0;
            tgrid.style.cursor = "default";
            fcpubdata.pubObj.AdjustLine.style.display = "none";
            div1.releaseCapture();
            fcpubdata.pubObj.blnAdjust = false;
            //同步行高
            /*   if (bHideCol || lngRange < 0) {
            var arrHeight = new Array();
            var ret = false, i, arrI = 0;
            var rows = $id("t").rows.length;
            for (i = 0; i < rows; i++) {
            if ($id("t").rows(i).style.pixelHeight < $id("t").rows(i).offsetHeight) {
            if (ret == false) {
            ret = window.confirm("此次调小列宽会使行高变大，按 [确定] 则调小列宽!");
            if (ret == false) {
            //不调小列宽,恢复原来的列宽
            tgrid.children[0].children[AdjustCol].style.width = oldWidth;
            $id("t").children[0].children[AdjustCol].style.width = oldWidth;
            break;
            }
            }
            arrHeight[arrI] = { pos: i, height: $id("t").rows(i).offsetHeight };
            arrI++;
            }
            }
            if (ret) {
            for (i = 0; i < arrI; i++) {
            $id("t").rows(arrHeight[i].pos).style.height = arrHeight[i].height;
            tabLeftHead.rows(arrHeight[i].pos).style.height = arrHeight[i].height;
            }
            }
            }
            */
            fcpubdata.pubObj.AdjustCol = 0;
            //2013-08-14
            new Eapi.EformEbiao().hideConts(new Eapi.EformEbiao().getGridDs(oEbiao))

        }


    },

    buttonsCss: function(arrButtons) {
        ///处理表单模版上工具栏中按钮的样式，加上背景图。2012-09-20
        //var arrButtons = [ { cssName: "firstpage", width: 20, height: 20,title:"显示第一页"}];

        for (var i = 0; i < arrButtons.length; i++) {
            if (IsSpace(arrButtons[i])) continue;
            var cssName = arrButtons[i].cssName;
            if (IsSpace(cssName)) continue;
            var oCont = $id(cssName);
            if (oCont == null) continue;
            oCont.style.width = arrButtons[i].width + "px";
            oCont.style.height = arrButtons[i].height + "px";
            oCont.innerText = "";
            if (!IsSpace(arrButtons[i].title)) oCont.title = arrButtons[i].title;
            if (cssName == "cmdOk" || cssName == "cmdClose") {
                oCont.className = cssName;
                NavJs.addEvent(oCont, "onmouseout", function() { this.className = this.id; });
                NavJs.addEvent(oCont, "onmouseover", function() { this.className = this.id + "-over"; });
            } else {
                oCont.className = "button" + cssName;
                NavJs.addEvent(oCont, "onmouseout", function() { this.className = "button" + this.id; });
                NavJs.addEvent(oCont, "onmouseover", function() { this.className = "button" + this.id + "-over"; });
            }
        }
    },
    toolbarConts: function(sConts) {
        ///自动排好表单上的工具栏中的控件，2013-05-23
        var arrConts = sConts.split(",")

        var baseLeft = ToInt($id("toolbarleft").style.left);
        //var baseTop = ToInt($id("toolbarleft").style.top);
        var sepWidth = 5; //控件间的间隔
        for (var i = 0; i < arrConts.length; i++) {
            var ids = arrConts[i];
            ids = Trim(ids);
            if (ids == "|") {
                baseLeft += 10;
                continue;
            } else if (ids.indexOf("|") == 0) {
                baseLeft -= sepWidth;
                baseLeft += ToInt(ids.substring(1, ids.length));
                continue;
            }
            var curObj = $id(ids);
            if (IsSpace(curObj)) continue;
            curObj.style.left = baseLeft + "px";
            curObj.style.display = "";

            baseLeft += ToInt(curObj.style.width) + sepWidth;

        }
        baseLeft += 5;
        //alert(baseLeft);
        $id("toolbarmiddle").style.width = baseLeft + "px";
        $id("toolbarright").style.left = baseLeft + "px";
    },
    controlsPosition: function(arrControls) {
        //处理表单模版上工具栏控件的位置
        //arrControls = ["firstpage", "uppage", "downpage", "lastpage", "add", "edit", "printpreview", "printall", "expexcelall"]
        var rightLine = 0; //控件右边线条的坐标
        var space; //和下一个控件的间距
        var upSpace; //获取下一个控件的间隙时，记录上一个控件的间隙
        for (var j = 0; j < arrControls.length; j++) {
            if ($id(arrControls[j]) == null) { alert(arrControls[j] + "不是工具栏上控件的id"); return; } ///id列表中有无效id
            var currentControl = $id(arrControls[j]);
            upSpace = space;
            if (j < arrControls.length - 1) {
                if ($id(arrControls[j + 1]) == null) continue;  //防止获取后面控件的左边距出错
                space = ToInt($id(arrControls[j + 1]).style.left) - (ToInt(currentControl.style.left) + ToInt(currentControl.style.width))//先获取与下一个button的间距
            }
            if ($id(arrControls[j]).style.display != "none") {

                if (rightLine == 0) { //这是第一个要显示的控件
                    rightLine = ToInt($id(arrControls[0]).style.left) + ToInt($id(arrControls[j]).style.width); //获取第一个按钮的左边距加当前按钮的宽度 为当前控件的右边线
                    currentControl.style.left = $id(arrControls[0]).style.left;
                } else {
                    currentControl.style.left = rightLine + upSpace;
                    rightLine = rightLine + upSpace + ToInt($id(arrControls[j]).style.width);
                }
            }
        }
    },
    divResize: function(arrDiv) {
        ///处理一组div控件的位置，一般在window.resize事件中用，2012-10-15
        var oDiv1 = $id(arrDiv[0]);
        var top1 = ToInt(oDiv1.style.top);
        if (oDiv1.style.display != "none") {
            top1 += ToInt(oDiv1.style.height);
        }

        for (var i = 1; i < arrDiv.length; i++) {
            var oDiv = $id(arrDiv[i]);
            if (oDiv == null) return;
            oDiv.style.top = top1 + "px";
            if (oDiv.style.display != "none") {
                top1 += ToInt(oDiv.style.height);
            }
        }
    },
    setPageSize: function() {
        ///用于pageSize编辑框的onchange事件中，修改页尺寸。2012-08-30
        if (!new Eapi.FormTemp().checkDetailDs()) return;
        var oPageSize = $id("pageSize");
        if (oPageSize == null) return;
        oPageSize.value = ToInt(oPageSize.value);
        fcpubdata.elList.pageNo = 1;
        if (fcpubdata.elList.oEbiao.getAttribute("isRunEbiao") == 1) {
            fcpubdata.elList.oEbiao.setAttribute("showHeight", oPageSize.value);
        } else {
            fcpubdata.elList.listDs.PageSize = oPageSize.value;
        }
        this.refreshList(function() {
            new Eapi.FormTemp().setPageCount();
            new Eapi.FormTemp().fillPageGo(fcpubdata.elList.oEbiao.getAttribute("pageCount"));
        });

    },
    setPageCount: function() {
        ///设置页总数及当前页号到界面上。 2012-09-02
        if (!new Eapi.FormTemp().checkDetailDs()) return;
        var oPageCount = $id("pageCount");
        if (oPageCount == null) return;
        var pageCount = fcpubdata.elList.oEbiao.getAttribute("pageCount");
        if (IsSpace(pageCount))
            pageCount = 1;
        else
            pageCount = ToInt(pageCount);

        if (IsSpace(fcpubdata.elList.pageNo)) fcpubdata.elList.pageNo = 1;
        if (fcpubdata.elList.pageNo > pageCount) fcpubdata.elList.pageNo = pageCount;
        oPageCount.value = fcpubdata.elList.pageNo + "/" + pageCount;

    },
    fillPageGo: function(pageCount, isFirst) {
        var pageCount = ToInt(pageCount);

        if (IsTrue(isFirst)) {
            if (pageCount < 1) pageCount = 1;
        } else {
            if (pageCount <= 1) return;
        }
        var pageGo = $id("pageGo");
        if (pageGo == null) return;
        pageGo.options.length = 0;

        var sbOption = new Sys.StringBuilder("<option selected>1</option>");
        for (var i = 1; i < pageCount; i++) {
            sbOption.append("<option>" + (i + 1) + "</option>");
        }
        var ss = pageGo.outerHTML;
        pageGo.outerHTML = ss.substring(0, ss.length - 9) + sbOption.toString() + "</select>";

        //        for (var i = 0; i < pageCount; i++) {
        //            var oOption = document.createElement("option");
        //            oOption.text = i + 1;
        //            if (i == 0) oOption.selected = true;
        //            pageGo.add(oOption);
        //        }
    },
    checkDetailDs: function() {
        ///检查明细数据集。 2012-08-30
        if (IsSpace(fcpubdata.elList) || IsSpace(fcpubdata.elList.oEbiao)) {
            alert("找不到布局模版控件elList！");
            return false;
        }
        //        if (IsSpace(fcpubdata.elList.listDs)) {
        //            alert("布局模版控件中没有生成明细数据集！");
        //            return false;
        //        }

        return true;
    },
    checkCardDs: function() {
        ///检查卡片式表单的主数据集。 2012-11-09
        if (IsSpace(fcpubdata.elCard) || IsSpace(fcpubdata.elCard.oEbiao)) {
            alert("找不到布局模版控件elCard！");
            return false;
        }
        if (IsSpace(fcpubdata.elCard.cardDs)) {
            alert("布局模版控件elCard中没有生成主数据集！");
            return false;
        }

        return true;
    },
    editCardDs: function() {
        ///由查看视图进入编辑界面时。2012-10-16
        try {
            var dsId = fcpubdata.elCard.cardDs.id;
            if (IsSpace(dsId)) return;
        } catch (e) {
            return;
        }
        var arr = new Eapi.Layout().getRunUrl(dsId, "编辑");
        if (IsSpace(arr)) return;
        new Eapi.EformEbiao().nameFieldHrefSub(arr[2], arr[0], dsId);
    },
    editDetailDs: function(isAdd, isModalWin, refreshType, editUnitId) {
        ///明细数据集的修改或增加功能，用于radio选中要处理的行时。2012-08-30
        //refreshType = execJs/execBack
        if (!new Eapi.FormTemp().checkDetailDs()) return;


        if (IsSpace(isModalWin)) isModalWin = true;
        if (IsSpace(refreshType)) refreshType = "execJs";
        if (!IsTrue(isAdd) && !new Eapi.EformEbiao().isSelRadio(fcpubdata.elList.oEbiao.id, fcpubdata.elList.listDs.id)) {
            alert("请先选中要操作的行后再试！");
            return false;
        }

        var editTag = "编辑";
        if (IsTrue(isAdd)) editTag = "增加";
        if (IsSpace(editUnitId)) {
            var arr = new Eapi.Layout().getRunUrl(fcpubdata.elList.listDs.id, editTag);
        } else {
            var arr = new Eapi.Layout().getRunUrl(editUnitId);
        }
        if (IsSpace(arr)) {
            alert("没有设置表" + fcpubdata.elList.listDs.id + "的" + editTag + "页面，请到 表结构设计/功能点信息 界面上设置！");
            return;
        }
        var envType = fcpubdata.area.getAttribute("envType");

        if (IsTrue(isModalWin) && (IsSpace(envType) || envType == "电脑"))
            new Eapi.EformEbiao().modalOpenCardSub(arr[0], fcpubdata.elList.listDs.id, fcpubdata.elList.id, refreshType, arr[1], isAdd);
        else
            new Eapi.EformEbiao().nameFieldHrefSub(arr[2], arr[0], fcpubdata.elList.listDs.id, editTag);
    },
    showDetailDs: function(showUnitId) {
        ///明细数据集的查看功能，用于radio选中要处理的行时。2012-08-30
        if (!new Eapi.FormTemp().checkDetailDs()) return;
        if (!new Eapi.EformEbiao().isSelRadio(fcpubdata.elList.oEbiao.id, fcpubdata.elList.listDs.id)) {
            alert("请先选中要操作的行后再试！");
            return false;
        }
        if (IsSpace(showUnitId)) {
            var arr = new Eapi.Layout().getRunUrl(fcpubdata.elList.listDs.id, "查看");
        } else {
            var arr = new Eapi.Layout().getRunUrl(showUnitId);
        }
        if (IsSpace(arr)) {
            alert("没有设置表" + fcpubdata.elList.listDs.id + "的查看页面，请到 表结构设计/功能点信息 界面上设置！");
            return;
        }
        new Eapi.EformEbiao().nameFieldHrefSub(arr[2], arr[0], fcpubdata.elList.listDs.id);
    },
    delDetailDs: function(markExp) {
        ///明细数据集的删除一条记录功能，用于radio选择时删除。2012-08-30
        //markExp == "直接删除" 表示直接删除记录，而不是做删除标记，==undefined 表示用 deleteMark=1做删除标记，2013-08-15
        if (!new Eapi.FormTemp().checkDetailDs()) return;
        if (!new Eapi.EformEbiao().isSelRadio(fcpubdata.elList.oEbiao.id, fcpubdata.elList.listDs.id)) {
            alert("请先选中要操作的行后再试！");
            return false;
        }
        //检查是否有删除标记字段，2013-08-15
        if (IsSpace(markExp)) {
            if (!new Eapi.Layout().isHaveDeleteMark(fcpubdata.elList.listDs.id)) markExp = "直接删除";
        }
        new Eapi.EformEbiao().delRec(fcpubdata.elList.oEbiao.id, fcpubdata.elList.listDs.id, markExp);
    },
    saveData: function() {
        ///卡片式表单模版上的保存按钮的调用函数，2012-11-09
        var sErr = doSubmitData(function() {
            new Eapi.EformEbiao().refreshUpEbiao();
            window.returnValue = "ok";
            CloseBill();
        });
        if (IsSpace(sErr) == false) alert(sErr);
    },
    saveAdd: function() {
        ///卡片式表单模版上的 保存后新增 按钮的调用函数，2012-11-09
        var sErr = doSubmitData(function() {
            new Eapi.EformEbiao().refreshUpEbiao();
            fcpubdata.obj.isAdd = true; //需要通知下一次refreshUpEbiao时是新增。
            new Eapi.FormTemp().addEmpty();
        });
        if (IsSpace(sErr) == false) alert(sErr);
    },
    moveOneRow: function(isUp) {
        ///明细数据集的上下移动一行，用于radio选择时。2012-08-30
        if (!new Eapi.FormTemp().checkDetailDs()) return;
        if (!new Eapi.EformEbiao().isSelRadio(fcpubdata.elList.oEbiao.id, fcpubdata.elList.listDs.id)) {
            alert("请先选中要操作的行后再试！");
            return false;
        }
        if (!new Eapi.Layout().isHaveDeleteMark(fcpubdata.elList.listDs.id, "顺序号")) {
            alert("表" + fcpubdata.elList.listDs.id + "没有顺序号类型的字段，所以不能进行上移下移操作！");
            return;
        }
        changeRowSave(fcpubdata.elList.listDs, isUp);
        var gridDsNo = new Eapi.EformEbiao().getGridDsNo(fcpubdata.elList.oEbiao, fcpubdata.elList.listDs.id);
        new Eapi.EformEbiao().changeRow(fcpubdata.elList.oEbiao, gridDsNo, isUp);
    },
    pageListGoto: function(pageNo, callback) {
        ///明细数据集 显示指定页号的数据。 2012-08-30
        //        if (!new Eapi.FormTemp().checkDetailDs()) return;
        //        new Eapi.EformEbiao().run(fcpubdata.elList.oEbiao, fcpubdata.elList.oEbiao.getAttribute("runParams"), pageNo, function() {
        //            new Eapi.FormTemp().setPageCount();
        //            new Eapi.EformEbiao().winResize(fcpubdata.elList.oEbiao.id);
        //            if (typeof (callback) == "function") callback();
        //        });
        //

        fcpubdata.elList.pageNo = pageNo;
        this.refreshList(function() {
            new Eapi.FormTemp().setPageCount();
            if (typeof (callback) == "function") callback();
        });
    },
    pageListFirst: function() {
        if (!new Eapi.FormTemp().checkDetailDs()) return;
        fcpubdata.elList.pageNo = 1;
        this.pageListGoto(fcpubdata.elList.pageNo);
    },
    pageListPrev: function() {
        if (!new Eapi.FormTemp().checkDetailDs()) return;
        if (IsSpace(fcpubdata.elList.pageNo)) return;
        if (fcpubdata.elList.pageNo <= 1) return;
        var isFinish = false;
        if (!isFinish) {
            fcpubdata.elList.pageNo--;
            this.pageListGoto(fcpubdata.elList.pageNo, function() { isFinish = true; });
        }
    },
    pageListNext: function() {
        if (!new Eapi.FormTemp().checkDetailDs()) return;
        if (IsSpace(fcpubdata.elList.pageNo)) fcpubdata.elList.pageNo = 1;

        var pageCount = fcpubdata.elList.oEbiao.getAttribute("pageCount");
        if (IsSpace(pageCount))
            pageCount = 1;
        else
            pageCount = ToInt(pageCount);

        if (fcpubdata.elList.pageNo >= pageCount) return;
        var isFinish = false;
        if (!isFinish) {
            fcpubdata.elList.pageNo++;
            this.pageListGoto(fcpubdata.elList.pageNo, function() { isFinish = true; });
        }
    },
    pageListLast: function() {
        if (!new Eapi.FormTemp().checkDetailDs()) return;
        var pageCount = fcpubdata.elList.oEbiao.getAttribute("pageCount");
        if (IsSpace(pageCount))
            pageCount = 1;
        else
            pageCount = ToInt(pageCount);
        fcpubdata.elList.pageNo = pageCount;
        this.pageListGoto(fcpubdata.elList.pageNo);
    },
    printExport: function(sType, oEbiaoPrint) {
        ///打印及导出，2012-08-30
        if (IsSpace(oEbiaoPrint)) {
            var oEbiao = null;
            if (!IsSpace(fcpubdata.elList) && !IsSpace(fcpubdata.elList.oEbiao)) {
                oEbiao = fcpubdata.elList.oEbiao;
            } else if (!IsSpace(fcpubdata.elCard) && !IsSpace(fcpubdata.elCard.oEbiao)) {
                oEbiao = fcpubdata.elCard.oEbiao;
            }
            if (oEbiao == null) {
                alert("没有elList elCard控件！");
                return;
            }
        } else {
            var oEbiao = oEbiaoPrint;
        }

        switch (sType) {
            case "e表控件打印预览": new Eapi.EformEbiao().print(oEbiao, 1); break;
            case "e表控件打印": new Eapi.EformEbiao().print(oEbiao, 2); break;
            case "e表控件直接打印": new Eapi.EformEbiao().print(oEbiao, 3); break;
            case "e表控件直接打印所有页": new Eapi.EformEbiao().print(oEbiao, 4); break;
            case "e表控件打印所有页": new Eapi.EformEbiao().print(oEbiao, 5); break;
            case "分页导出到excel文件中": new Eapi.EformEbiao().print(oEbiao, "expexcel"); break;
            case "不分页导出到excel文件中": new Eapi.EformEbiao().print(oEbiao, "expexcelall"); break;
            case "导出所有页到pdf文件中": new Eapi.EformEbiao().print(oEbiao, "exppdf"); break;
        }
    },
    addEmpty: function() {
        ///清空输入界面，变成新增记录状态，用于卡片式输入表单中。 2012-11-09
        if (!this.checkCardDs()) return;
        var oDs = fcpubdata.elCard.cardDs;
        oDs.Append();

        new Eapi.EformEbiao().fset_cont2(oDs, fcpubdata.elCard.oEbiao);
    },
    hideCol: function(oEbiao, colNo) {
        ///隐藏某一列，2012-12-07

        var oArea = new Eapi.EformEbiao().get4Area(oEbiao);
        var oDivMain = NavJs.child(oEbiao, "div", 0);
        if (oArea != null && (oArea.mode == 2 || oArea.mode == 4)) {
            var oTable1, oTable2;
            if (oArea.mode == 2) {
                var oDiv = NavJs.child(oDivMain, "div", 0);
                oTable1 = NavJs.child(oDiv, "table", 0);
                oDiv = NavJs.child(oDivMain, "div", 1);
                oTable2 = NavJs.child(oDiv, "table", 0);
            } else {
                var oDiv = NavJs.child(oDivMain, "div", 1);
                oTable1 = NavJs.child(oDiv, "table", 0);
                oDiv = NavJs.child(oDivMain, "div", 3);
                oTable2 = NavJs.child(oDiv, "table", 0);
            }
            var oDs = new Eapi.EformEbiao().getGridDs(oEbiao, 0);
            new Eapi.EformEbiao().hideConts(oDs);

            new Eapi.Css().hideCol(oTable1, colNo);
            new Eapi.Css().hideCol(oTable2, colNo);
        }

    },
    showCol: function(oEbiao, colNo) {
        ///显示某一列，2012-12-07

        var oArea = new Eapi.EformEbiao().get4Area(oEbiao);
        var oDivMain = NavJs.child(oEbiao, "div", 0);
        if (oArea != null && (oArea.mode == 2 || oArea.mode == 4)) {
            var oTable1, oTable2;
            if (oArea.mode == 2) {
                var oDiv = NavJs.child(oDivMain, "div", 0);
                oTable1 = NavJs.child(oDiv, "table", 0);
                oDiv = NavJs.child(oDivMain, "div", 1);
                oTable2 = NavJs.child(oDiv, "table", 0);
            } else {
                var oDiv = NavJs.child(oDivMain, "div", 1);
                oTable1 = NavJs.child(oDiv, "table", 0);
                oDiv = NavJs.child(oDivMain, "div", 3);
                oTable2 = NavJs.child(oDiv, "table", 0);
            }
            var oDs = new Eapi.EformEbiao().getGridDs(oEbiao, 0);
            new Eapi.EformEbiao().hideConts(oDs);
            new Eapi.Css().showCol(oTable1, colNo);
            new Eapi.Css().showCol(oTable2, colNo);
        }

    },
    refreshList: function(callback) {
        ///刷新elList控件中的数据，2012-08-31
        if (!new Eapi.FormTemp().checkDetailDs()) return;
        if (IsSpace(fcpubdata.elList.pageNo)) fcpubdata.elList.pageNo = 1;
        var isRunEbiao = fcpubdata.elList.oEbiao.getAttribute("isRunEbiao");
        var isRefreshDs = isRunEbiao != 1 && !IsSpace(fcpubdata.elList.listDs);

        var contentType = fcpubdata.elList.oEbiao.getAttribute("contentType");
        if (IsSpace(contentType)) contentType = "rptStr";
        if (contentType != "rptStr") isRefreshDs = false;

        if (isRefreshDs) {
            fcpubdata.elList.listDs.PageNo = fcpubdata.elList.pageNo;

            fcpubdata.elList.listDs.Open(fcpubdata.elList.listDs.opensql, "是"); ;
            new Eapi.EformEbiao().refreshDs(fcpubdata.elList.oEbiao, fcpubdata.elList.listDs);
            fcpubdata.elList.oEbiao.setAttribute("pageCount", fcpubdata.elList.listDs.PageCount);
            //NavJs.fireEvent(window, "onresize");
            //new Eapi.EformEbiao().winResize(fcpubdata.elList.oEbiao.id);
            new Eapi.EformEbiao().clearSelRadio(fcpubdata.elList.oEbiao.id, fcpubdata.elList.listDs.id);
            pub_window_onresize_bak();
            if (typeof (callback) == "function") callback();
        } else {
            //alert(fcpubdata.elList.oEbiao.getAttribute("runParams"));
            new Eapi.EformEbiao().run(fcpubdata.elList.oEbiao, fcpubdata.elList.oEbiao.getAttribute("runParams"), fcpubdata.elList.pageNo, function() {
                if (!IsSpace(fcpubdata.elList.listDs)) new Eapi.EformEbiao().clearSelRadio(fcpubdata.elList.oEbiao.id, fcpubdata.elList.listDs.id);
                pub_window_onresize_bak();
                //NavJs.fireEvent(window, "onresize");
                //new Eapi.EformEbiao().winResize(fcpubdata.elList.oEbiao.id);
                //new Eapi.FormTemp().fillPageGo(fcpubdata.elList.oEbiao.getAttribute("pageCount"));
                if (typeof (callback) == "function") callback();
            });
        }
    }

}
if (Type.parse("Eapi.FormTemp") == null) Eapi.FormTemp.registerClass("Eapi.FormTemp");