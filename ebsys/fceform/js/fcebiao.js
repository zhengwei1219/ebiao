///<reference name="MicrosoftAjax.js" />
///<reference path="fcpub.js" />
///<reference path="fcrundj.js" />
///<reference path="fczk.js" />

///���ļ����ڽ�e����Ϊ�ؼ��ӵ�eform��
///date 2008-06-20



Eapi.EformEbiao = function() { }

Eapi.EformEbiao.prototype =
{
    appendRow: function(oEbiao, gridDsNo, bInsert) {
        ///��ϸ��������һ��,gridDsNo=0��ʼ,��ʾE��ؼ�����ϸ���˳���. bInsert = undefined/false ��ʾ����,����Ϊ����(ָ���뵽��ǰ�е�ǰ��)
        //this.hideConts($id("dataset3"));
        this.actionAfterDss(oEbiao, gridDsNo, true);
        var oDs = this.getGridDs(oEbiao, gridDsNo);
        var curRow = 0;

        if (typeof (bInsert) == "undefined" || bInsert == false || IsSpace(oDs.e_curTd)) {
            curRow = (oDs.RecordCount - 1) * oDs.e_recRows + ToInt(oDs.e_startRow);
            if (!IsSpace(oDs.Append())) return;
        } else {
            curRow = oDs.e_curTd.parentNode.rowIndex;
            if (!IsSpace(oDs.Append("", curRow - ToInt(oDs.e_startRow)))) return;
        }
        this.hideConts(oDs);

        //����E��ؼ�
        var arrTr = this.getTrObjs(oEbiao, curRow, oDs);
        if (arrTr != null) this.insertRowSub(oEbiao, arrTr[0], oDs.e_recRows, bInsert);
        if (arrTr != null && arrTr.length > 1) this.insertRowSub(oEbiao, arrTr[1], oDs.e_recRows, bInsert);
        //�����ݼ��е�����ˢ��E��ؼ���.
        this.fset_cont2(oDs, oEbiao);

        this.refreshContPos(oEbiao);

    },
    insertRowSub: function(oEbiao, oTr, iRecRows, bInsert) {
        ///cloneһ�к����,iRecRows ��ʾÿ����¼��ռ������,Ĭ��Ϊ1.bInsert ���ڱ�ʶ����/����,��Ϊundefined���ʾ�ӵ���ϸ������
        //alert(iRecRows)
        var oTrInsertPos = oTr;
        if (typeof (bInsert) == "undefined" || bInsert == false) {
            for (var i = 0; i < iRecRows; i++) {
                if (oTrInsertPos == null) break;

                oTrInsertPos = oTrInsertPos.nextSibling;
                if (oTrInsertPos != null && IsSpace(oTrInsertPos.innerHTML)) oTrInsertPos = oTrInsertPos.nextSibling;

            }
        }
        for (var i = 0; i < iRecRows; i++) {

            var oTrClone = oTr.cloneNode(true);
            if (oTrInsertPos == null) {
                //                oTr.parentNode.insertBefore(oTrClone);
                oTr.parentNode.appendChild(oTrClone); //��Ϊ�ˣ�����firefox�±���2013-08-01
            } else {
                oTr.parentNode.insertBefore(oTrClone, oTrInsertPos);
            }

            oTr = oTr.nextSibling;
            if (oTr != null && IsSpace(oTr.innerHTML)) oTr = oTr.nextSibling;
            if (oTr == null) {

                break;
            }
        }
    },
    getGridDs: function(oEbiao, gridDsNo) {
        ///ȡ��E��ؼ��е���ϸ�����ݼ�,gridDsNo Ϊ˳���
        var dsIds = oEbiao.getAttribute("gridDs");
        if (IsSpace(dsIds)) return;
        if (typeof (gridDsNo) == "undefined") gridDsNo = 0;
        var arrDs = dsIds.split(",");
        var oDs = $obj(arrDs[gridDsNo]);
        return oDs;
    },
    getGridDsNo: function(oEbiao, dsId) {
        ///ȡ��E��ؼ��е���ϸ�����ݼ�˳���,dsIdΪ���ݼ�ID
        if (IsSpace(dsId)) return;
        var dsIds = oEbiao.getAttribute("gridDs");
        if (IsSpace(dsIds)) return;
        var arrDs = dsIds.split(",");
        for (var i = 0; i < arrDs.length; i++) {
            if (arrDs[i] == dsId) return i;
        }
    },
    getGridDsCount: function(oEbiao) {
        ///ȡ��E��ؼ��е���ϸ�����ݼ��ĸ���
        var dsIds = oEbiao.getAttribute("gridDs");
        if (IsSpace(dsIds)) return;
        var arrDs = dsIds.split(",");
        return arrDs.length;
    },
    getAfterDss: function(oEbiao, gridDsNo) {
        ///ȡ��gridDsNo�����������ϸ���ݼ�����, 2011-06-21
        var dsIds = oEbiao.getAttribute("gridDs");
        if (IsSpace(dsIds)) return;
        if (typeof (gridDsNo) == "undefined") gridDsNo = 0;
        var arrDs = dsIds.split(",");
        if (gridDsNo + 1 >= arrDs.length) return;
        var arr = new Array(arrDs.length - gridDsNo - 1);
        for (var i = 0; i < arrDs.length - gridDsNo - 1; i++) {
            arr[i] = $obj(arrDs[i + gridDsNo + 1]);

        }
        return arr;
    },
    actionAfterDss: function(oEbiao, gridDsNo, bAppend, actionRows) {
        ///��ɾ��ʱ,�����±���ϸ���ݼ�����ʼ��,�Լ���������ؼ� 2011-06-21
        /// actionRows Ϊһ�δ���ļ�¼������Ĭ��Ϊ1
        if (IsSpace(actionRows)) actionRows = 1;
        var arr = this.getAfterDss(oEbiao, gridDsNo);
        if (typeof (arr) == "undefined") return;
        for (var i = 0; i < arr.length; i++) {
            var oDs = arr[i];
            var offsetRows = oDs.e_recRows;
            if (bAppend) offsetRows = (-1) * oDs.e_recRows;
            oDs.e_startRow = ToInt(oDs.e_startRow) - offsetRows * actionRows;

            this.hideConts(oDs);
        }
    },
    deleteRowAll: function(oEbiao, gridDsNo) {
        ///ɾ�������У�ֻ��һ�����С�
        var oDs = this.getGridDs(oEbiao, gridDsNo);
        this.actionAfterDss(oEbiao, gridDsNo, false, oDs.RecordCount - 1);
        for (var i = oDs.RecordCount - 1; i > 0; i--) {
            this.deleteRowSub(oEbiao, oDs, i);
        }
        this.refreshContPos(oEbiao);
        this.hideConts(oDs);
    },
    deleteRow: function(oEbiao, gridDsNo) {
        ///ɾ��һ��
        this.actionAfterDss(oEbiao, gridDsNo, false);
        var oDs = this.getGridDs(oEbiao, gridDsNo);
        if (IsSpace(oDs.e_curTd)) {
            alert("�Ҳ���Ҫɾ������,����Ҫɾ�������ϵ��һ��!");
            return;
        }
        if (oDs.RecordCount > 1) {

            this.deleteRowSub(oEbiao, oDs, oDs.RecNo);

            oDs.Delete();

            this.refreshContPos(oEbiao);
            this.hideConts(oDs);
        } else {
            oDs.Delete();
            oDs.Append();
            this.fset_cont2(oDs, oEbiao);
        }
    },
    deleteRowSub: function(oEbiao, oDs, dsRecNo) {
        ///ɾ��E��ؼ��ϵ�һ�����ݼ���¼��ռ��TR
        var curRow = dsRecNo * oDs.e_recRows + ToInt(oDs.e_startRow); //oDs.e_curTd.parentNode.rowIndex;
        //����E��ؼ�
        for (var i = oDs.e_recRows - 1; i >= 0; i--) {
            var arrTr = this.getTrObjs(oEbiao, curRow + i, oDs);
            if (arrTr != null) arrTr[0].parentNode.deleteRow(curRow + i);
            if (arrTr != null && arrTr.length > 1) arrTr[1].parentNode.deleteRow(curRow + i);
        }
    },
    keypressMove: function() {
        /// �����ƶ�,��,��,�س�(�ƶ�����һ��,��β�����Ƶ���һ��),���˺�����Ϊ��̬��ʾ�ؼ�keydown�¼�
        var oCont = NavJs.getEventObj();
        var oEbiao = oCont.parentNode;
        if (IsSpace(oCont.getAttribute("dataset"))) return; //����button�ؼ�
        var oDs = $obj(oCont.dataset);
        if (!IsSpace(oDs.e_curTd)) {
            var oTd = oDs.e_curTd;
            var newTd = null;
            var oTable = oTd.parentNode.parentNode.parentNode;
            var colNo = oTd.cellIndex;
            switch (NavJs.getEvent().keyCode) {
                case 38:  //up
                    if (oTd.parentNode.rowIndex - 1 == ToInt(oDs.e_startRow)) colNo++;
                    if (oTd.parentNode.rowIndex - 1 >= ToInt(oDs.e_startRow)) {
                        newTd = oTable.rows[oTd.parentNode.rowIndex - 1].cells[colNo];
                    }
                    break;
                case 40:  //down
                    if (oTd.parentNode.rowIndex == ToInt(oDs.e_startRow)) colNo--;
                    if (oTd.parentNode.rowIndex + 1 <= ToInt(oDs.e_startRow) + oDs.RecordCount) newTd = oTable.rows[oTd.parentNode.rowIndex + 1].cells[colNo];
                    break;
                case 13:  //enter
                    if (oTd.nextSibling == null) {
                        if (oTable.rows.length > oTd.parentNode.rowIndex + 1) newTd = oTable.rows[oTd.parentNode.rowIndex + 1].cells[0];
                    } else {
                        newTd = oTd.nextSibling;
                    }
                    break;
            }
            if (newTd != null) {
                new Eapi.EformEbiao().moveToTd(newTd, oEbiao);
            }
        }
    },
    moveToTd: function(oTd, oEbiao) {
        /// �ӵ�ǰtd�ƶ���oTd,ִ��valueChanged()����,
        ///		�жϵ�ǰTD��oTd�Ƿ���ͬһ��¼��,�粻��,����Ҫ��fset��ֵupdate�����ݼ���
        ///		����ǰTD��ΪoTd.
        ///		ִ��hideConts()
        ///		ִ�пؼ����ƶ�.

        if (IsSpace(oTd.getAttribute("controlId"))) return;
        var oCont = $id(oTd.getAttribute("controlId"));
        if (oCont == null) return;
        if (IsSpace(oCont.getAttribute("dataset"))) return; //����button�ؼ�
        if (oTd.getAttribute("isHideCont") != null) return; //��ǰ�ؼ�Ϊ�̶�����,���������ֶ�

        if (IsTrue(oEbiao.getAttribute("isShowView"))) return; //��ʾͨ������URL�����˱�ֻ������

        var newRecNo = 0;
        var oDs = $obj(oCont.getAttribute("dataset"));
        if (typeof (oDs.e_startRow) == "undefined") { //�����ʱ
            if (!IsSpace(oDs.e_curTd) && oDs.e_curTd.cellIndex != -1) { //=-1��ʾ���TD�Ѳ�����,��ɾ����.
                if (IsSpace(oDs.e_curTd.getAttribute("controlId")) == false) { //����������ж������ʱ.
                    var oldCont = $id(oDs.e_curTd.getAttribute("controlId"));
                    oDs.Field(oldCont.getAttribute("field")).Value = oldCont.value;
                    oDs.e_curTd.innerText = oDs.fset_contall(oDs.Field(oldCont.getAttribute("field"))); //�ɴ˽��Ķ����ֵ����E��ؼ���TD��.
                }
                if (oDs.e_curTd.getAttribute("recNo") != oTd.getAttribute("recNo")) {
                    var sErr = oDs.Update("��ʾ������Ϣ");
                    if (IsSpace(sErr) == false) return;
                }
            }
            newRecNo = ToInt(oTd.getAttribute("recNo"));

        } else { //��ϸ��ʱ
            if (oDs.e_recRows == 0) oDs.e_recRows = 1;
            newRecNo = Math.floor((oTd.parentNode.rowIndex - ToInt(oDs.e_startRow)) / oDs.e_recRows);
            //alert(newRecNo);
            if (oDs.RecNo != newRecNo) {
                var sErr = oDs.Update("��ʾ������Ϣ");
                if (IsSpace(sErr) == false) return;
            }
        }
        if (oDs.RecNo != newRecNo) oDs.SetPos(newRecNo);
        this.hideConts(oDs);
        this.moveCont(oCont, oTd, oEbiao);
        //����TD�ϵ�ֵ
        //if (typeof (oDs.e_curTd) != "undefined" && oDs.e_curTd.cellIndex != -1) oDs.e_curTd.style.visibility = "visible";
        oTd.style.visibility = "hidden";

        oDs.e_curTd = oTd;
    },
    fset_cont2: function(oDs, oEbiao) {
        ///��fset�е�����ˢ�µ�E��ؼ���.
        ///��E��ؼ���ɨ�赱ǰ�е����е�Ԫ��,ȡcontrolId����,�����,���жϵ�ǰ�ؼ��Ƿ�󶨵���oDs,����,��fset��ֵ����TD.
        //CopyToPub(oEbiao.outerHTML)
        if (typeof (oDs.e_startRow) == "undefined") { //�����ʱ, �˴�������IsSpace���Է� oDs.e_startRow=0 ʱ

            //����ϸ������ݼ��еĵ�ǰ�м�¼�͵���Ԫ���У�2012-11-02
            for (var j = 0; j < oDs.FieldCount; j++) {

                var ooTd = $id("eb_cell_" + oDs.id + "_" + oDs.Field(j).FieldName);
                if (ooTd == null) continue;
                var sValue = oDs.Field(j).Value;
                this.setCellValue(ooTd, sValue);

            }
        } else { //��ϸ��ʱ
            var row = ToInt(oDs.e_startRow) + oDs.RecNo * oDs.e_recRows;

            for (var i = 0; i < oDs.e_recRows; i++) {
                var arrCells = this.getTdObjs(oEbiao, row + i, oDs);
                if (arrCells == null) return;
                this.refreshCells(oDs, arrCells[0]);
                if (arrCells.length > 1) this.refreshCells(oDs, arrCells[1]);
            }
        }

    },
    setCellValue: function(oCell, sValue) {
        ///��������Ԫ��ֵ, 2012-09-21
        var eformHref = oCell.getAttribute("eformHref");
        if (IsSpace(eformHref)) {
            var oSub = NavJs.child(oCell, "A", 0);
            if (oSub != null) {
                if (oSub.getAttribute("isFixLabel") != 1) // =1 ��ʾ�ǹ̶�label���ƣ���༭��ɾ����
                    oSub.innerText = sValue;
            } else if (!NavJs.isHaveChild(oCell)) {  //oCell.innerText == oCell.innerHTML

                oCell.innerText = sValue;
            }
        } else {
            oCell.innerHTML = "<a href=\"javascript:var ss='" + oCell.parentNode.rowIndex + "_" + oCell.cellIndex + "';void(0);\" onclick=\"" + unescape(eformHref) + "\">" + sValue + "</a>";
        }
    },
    refreshCells: function(oDs, oCells) {
        var bool = IsTrue(fcpubdata.area.getAttribute("allBrowser"));
        ///�����ݼ��ĵ�ǰ�м�¼ˢ��cells��Ԫ��
        for (var i = 0; i < oCells.length; i++) {
            if (IsSpace(oCells[i].getAttribute("controlId")) == false && !bool) {
                var obj = $id(oCells[i].getAttribute("controlId"));
                if (obj.getAttribute("dataset") == oDs.id) {
                    oCells[i].innerText = oDs.fset_contall(oDs.Field(obj.field));
                }
            } else {
                var contType = oCells[i].getAttribute("contType");
                if (!IsSpace(contType) && contType != "field") continue;
                var tableName = oCells[i].getAttribute("tableName");
                var fieldName = oCells[i].getAttribute("fieldName");
                if (IsSpace(tableName) == false && IsSpace(fieldName) == false && tableName == oDs.id) {
                    var sValue = oDs.fset_contall(oDs.Field(fieldName));
                    if (oDs.Field(fieldName).Value == fcpubdata.noPermitTag) sValue = fcpubdata.noPermitTag;
                    this.setCellValue(oCells[i], sValue);
                }
            }
        }
    },
    /*getTdHref: function(oDs, linkTbName, linkFdName, fdName) {
    ///��ְԱ���еĲ�������ʱ��linkTbName = fcs_dept linkFdName = ְԱ���е� deptId , fdName = sdeptname
    var readUrl = fcpubdata.genEventObj.arrTb[linkTbName];
    if (typeof(readUrl) == "undefined" || readUrl == null) {
    readUrl = SqlToField("select showUnitId from fc_entity where tbname='" + linkTbName + "'");
    if (IsSpace(readUrl)) readUrl = "";
    fcpubdata.genEventObj.arrTb[linkTbName] = readUrl;
    }
    var hrefs = RepStr(readUrl, fcpubdata.keyFieldValueTag, oDs.Field(linkFdName).Value);
    return "<a target='_self' href='" + hrefs + "'>" + oDs.Field(fdName).Value + "</a>";
    },*/
    getTdObjs: function(oEbiao, row, oDs) {
        ///�ҵ�row��TD����
        var arr = this.getTrObjs(oEbiao, row, oDs);
        if (arr == null) return null;
        if (arr.length == 1) return [arr[0].cells];
        if (arr.length == 2) return [arr[0].cells, arr[1].cells];
    },
    getTrObjs: function(oEbiao, row, oDs) {
        if (oEbiao.getAttribute("controltype") == "layout" || (oEbiao.getAttribute("controltype") == "eblayout" && oEbiao.getAttribute("isRunEbiao") == 3)) {
            var tableId = oDs.tableId;
            var oTable = $id(tableId);
            if (oTable == null) return null;
            if (row > oTable.rows.length - 1) return null;
            return [oTable.rows[row]];
        }
        ///�ҵ�row��Tr����
        var oArea = this.get4Area(oEbiao);
        if (oArea == null) return null;
        var oDivMain = NavJs.child(oEbiao, "div", 0); //oEbiao.childNodes[0];
        var objRet = null;
        switch (oArea.mode) {
            case 1: //��ʾû�й̶�������ʾ,ֻ��һ��table
                var oTable = NavJs.child(oDivMain, "table", 0);
                if (row < oTable.rows.length)
                    objRet = [oTable.rows[row]];
                break;
            case 2: //����������
                var oTab = oDivMain.childNodes[0].childNodes[0];
                if (row < oDivMain.childNodes[1].childNodes[0].rows.length)
                    objRet = [oDivMain.childNodes[1].childNodes[0].rows[row]];
                //                if (row >= oTab.rows.length) {
                //                    row = row - oTab.rows.length;
                //                    if (row < oDivMain.childNodes[1].childNodes[0].rows.length)
                //                        objRet = [oDivMain.childNodes[1].childNodes[0].rows[row]];
                //                } else {
                //                    objRet = [oTab.rows[row]];
                //                }
                break;
            case 3: //����������
                var oTab = oDivMain.childNodes[0].childNodes[0];
                if (row < oTab.rows.length) {
                    objRet = [oTab.rows[row], oDivMain.childNodes[1].childNodes[0].rows[row]];
                }

                break;
            case 4: //����
                var oTab = oDivMain.childNodes[0].childNodes[0];
                if (row < oDivMain.childNodes[2].childNodes[0].rows.length && row < oDivMain.childNodes[3].childNodes[0].rows.length)
                    objRet = [oDivMain.childNodes[2].childNodes[0].rows[row], oDivMain.childNodes[3].childNodes[0].rows[row]];
                //                if (row >= oTab.rows.length) {
                //                    row = row - oTab.rows.length;
                //                    if (row < oDivMain.childNodes[2].childNodes[0].rows.length)
                //                        objRet = [oDivMain.childNodes[2].childNodes[0].rows[row], oDivMain.childNodes[3].childNodes[0].rows[row]];
                //                } else {
                //                    objRet = [oTab.rows[row], oDivMain.childNodes[1].childNodes[0].rows[row]];
                //                }
                break;
        }
        return objRet;
    },
    hideConts: function(oDs) {
        /// ���ر����ݼ��µ����ж�̬��ʾ�ؼ�.

        var sConts = oDs.e_contsId;
        if (IsSpace(sConts)) return;

        if (!IsSpace(oDs.e_curTd) && oDs.e_curTd.cellIndex != -1) oDs.e_curTd.style.visibility = "visible";

        var arr = sConts.split(",");
        for (var i = 0; i < arr.length; i++) {
            var o = $id(arr[i]);
            if (o == null) continue;
            if (o.style.display != "none") {
                //o.blur();
                o.style.display = "none";
                if (!IsSpace(o.oSpanMsgErr)) //ͬʱ���غ��ִ�����Ϣ
                    o.oSpanMsgErr.style.display = "none";
            }
        }
    },
    showConts: function(oDs, oEbiao) {
        /// ȫ����ʾ�����ݼ��µ����ж�̬��ʾ�ؼ�.
        if (IsTrue(oEbiao.getAttribute("isShowView")) || typeof (oDs.e_startRow) == "undefined") return;
        var row = ToInt(oDs.e_startRow);
        for (var i = 0; i < oDs.e_recRows; i++) {
            var arrCells = this.getTdObjs(oEbiao, row + i, oDs);
            if (arrCells == null) return;
            this.showContsSub(oDs, arrCells[0], oEbiao);
            if (arrCells.length > 1) this.showContsSub(oDs, arrCells[1], oEbiao);
        }
    },
    showContsSub: function(oDs, oCells, oEbiao) {
        for (var i = 0; i < oCells.length; i++) {
            var tableName = oCells[i].getAttribute("tableName");
            if (IsSpace(tableName) == false && (tableName == oDs.id || "elFilter_" + tableName == oDs.id)) {
                this.moveToTd(oCells[i], oEbiao);
            }
        }

    },

    refreshContPos: function(oEbiao, show) {

        if (IsTrue(oEbiao.getAttribute("isShowView"))) return;

        ///ˢ��ʼ����ʾ�Ŀؼ���λ��
        ///show = true ��ʾ�ڳ�ʼ����Ҫ�ƶ���ʾ�ؼ���λ��
        var bShow = typeof (show) == "undefined";
        var sInXml = NavJs.child(oEbiao, "div", 0).getAttribute("dsXml");
        if (IsSpace(sInXml) == false) {
            sInXml = unescape(sInXml);
            var oXml = SetDom(sInXml);
            //����ʼ����ʾ/���ؿؼ�
            var oHide = oXml.documentElement.childNodes[0];
            for (var i = 0; i < oHide.childNodes.length; i++) {
                var sId = oHide.childNodes[i].nodeName;

                var oId = $id(sId);
                if (NavJs.textContent(oHide.childNodes[i]) != "0") {

                    if (bShow && oId.style.display != "none") {
                        //���ؼ��ƶ���TD��
                        var ooTd = $id("eb_cell_" + sId)
                        new Eapi.EformEbiao().moveCont(oId, ooTd);
                        ooTd.style.visibility = "hidden";
                    }
                }
            }
        }

    },
    click: function() {
        ///E��ؼ���click�¼�
        var oTd = NavJs.getEventObj();
        if (oTd.tagName != "TD") return;
        if (IsSpace(oTd.getAttribute("controlId"))) return;

        var oCont = $id(oTd.getAttribute("controlId"));
        if (oCont == null) return;
        var oEbiao = oCont.parentNode;
        this.moveToTd(oTd, oEbiao);
    },
    resizeContent: function(oEbiao) {
        ///����E��ؼ��ڲ���table����
        /// 	�������: ȡtable��offsetH W ,ȡE��ؼ��ĸߺͿ�.�õ��ߺͿ�ķ�������.
        ///	  �˴�Ҫ����һ�����,����ı�С��6px�򲻶�.	
        ///	  �ô˱���ȥѭ����col �� tr�Ŀ�͸�.�����,Ҫ���ú���,�ƶ�����ʾ�Ŀؼ�.���ض�̬��ʾ�ؼ�. 
        ///   ֻ���ǵ���tableʱ�ſ��Զ�̬��Сtable������.	
        if (oEbiao.style.display == "none" || oEbiao.offsetWidth < 4 || oEbiao.offsetHeight < 4) return;
        var oArea = this.get4Area(oEbiao);

        if (oArea != null && oArea.mode == 1) { //��ʾû�й̶�������ʾ,ֻ��һ��table
            var oDivMain = NavJs.child(oEbiao, "div", 0);
            var oTable = NavJs.child(oDivMain, "table", 0);
            var width1 = ToInt(oEbiao.style.width) - 4; //�˴���4px��Ϊ���±߿��߶�Ԥ�������
            var height1 = ToInt(oEbiao.style.height) - 4;
            var moveWidth = Math.abs(width1 - oTable.offsetWidth);
            var moveHeight = Math.abs(height1 - oTable.offsetHeight);
            if (moveWidth < 6 && moveHeight < 6) return;
            if (oTable.offsetWidth <= 0 || oTable.offsetHeight <= 0) return;
            var rateWidth = width1 / oTable.offsetWidth;
            var rateHeight = height1 / oTable.offsetHeight;
            if (moveWidth >= 6) {
                var oColGroup = NavJs.child(oTable, "colgroup", 0);
                for (var i = 0; i < oColGroup.childNodes.length; i++) {
                    var oCol = NavJs.child(oColGroup, "col", i);
                    if (oCol.style.display != "none" && ToInt(oCol.style.width) > 0) {
                        oCol.style.width = Math.floor(ToInt(oCol.style.width) * rateWidth) + "px";
                    }
                }
            }
            if (moveHeight >= 6) {
                for (var i = 0; i < oTable.rows.length; i++) {
                    var oRow = oTable.rows[i];
                    if (oRow.style.display != "none" && ToInt(oRow.style.height) > 0) {
                        oRow.style.height = Math.floor(ToInt(oRow.style.height) * rateHeight) + "px";
                    }
                }
            }

            this.refreshContPos(oEbiao, true);
            var oDs = this.getGridDs(oEbiao);
            this.hideConts(oDs);

        }
    },
    hideRow: function(oEbiao, sContId, sDiplayValue) {
        ///����E���еĹ̶���ʾ�ؼ�ʱҪ�����л������еĺ���
        ///sDiplayValue = "none"����""
        var oArea = this.get4Area(oEbiao);
        if (oArea == null) return;
        var oTr = $id("eb_cell_" + sContId).parentNode;
        if (oArea.mode == 1) {
            oTr.style.display = sDiplayValue;
        } else if (oArea.mode == 3 || oArea.mode == 4) {
            var rowNo = oTr.rowIndex;
            oArea.Area3.childNodes[0].rows[rowNo].style.display = sDiplayValue;
            oArea.Area4.childNodes[0].rows[rowNo].style.display = sDiplayValue;
        }
    },
    hideCol: function(oEbiao, sContId, sDiplayValue) {
        ///����E���еĹ̶���ʾ�ؼ�ʱҪ�����л������еĺ���
        var oArea = this.get4Area(oEbiao);
        if (oArea == null) return;
        var oTd = $id("eb_cell_" + sContId);
        var colNo = oTd.cellIndex;
        if (oArea.mode == 1) {
            var oTable = oTd.parentNode.parentNode.parentNode;
            var oColGroup = NavJs.child(oTable, "colgroup", 0);

            NavJs.child(oColGroup, "col", colNo).style.display = sDiplayValue;
        } else if (oArea.mode == 2 || oArea.mode == 4) {
            //ǰһ�� childNodes(0) �ǵ�table
            oArea.Area3.childNodes[0].childNodes[0].childNodes[colNo].style.display = sDiplayValue;
            oArea.Area4.childNodes[0].childNodes[0].childNodes[colNo].style.display = sDiplayValue;
        }
    },
    divScroll: function() {
        ///�����������¼��������
        var Area4 = NavJs.getEventObj();
        var Area2 = null;
        var Area3 = null;
        if (Area4.parentNode.childNodes.length == 4) {
            Area2 = Area4.parentNode.childNodes[1];
            Area3 = Area4.parentNode.childNodes[2];
        } else {
            if (ToInt(Area4.style.top) != 0) {
                Area2 = Area4.parentNode.childNodes[0];
            } else {
                Area3 = Area4.parentNode.childNodes[0];
            }
        }
        if (Area3 != null) Area3.scrollTop = Area4.scrollTop;
        if (Area2 != null) Area2.scrollLeft = Area4.scrollLeft;
    },
    get4Area: function(oEbiao) {
        if (oEbiao.getAttribute("controltype") == "layout" || (oEbiao.getAttribute("controltype") == "eblayout" && oEbiao.getAttribute("isRunEbiao") == 3)) return null;
        ///ȡ���ĸ���
        var mode = 0; //1 = û�й̶�������ʾ , 2 = ��������, 3 = ��������, 4= ���� 
        var Area1 = null;
        var Area2 = null;
        var Area3 = null;
        var Area4 = null;
        var oDivMain = NavJs.child(oEbiao, "div", 0);
        if (oDivMain == null) return null;
        if (oDivMain.childNodes.length <= 1) { //��ʾû�й̶�������ʾ,ֻ��һ��table
            Area4 = oDivMain;
            mode = 1;
        } else {
            if (oDivMain.childNodes.length == 4) {
                Area1 = oDivMain.childNodes[0];
                Area2 = oDivMain.childNodes[1];
                Area3 = oDivMain.childNodes[2];
                Area4 = oDivMain.childNodes[3];
                mode = 4;
            } else {
                Area4 = oDivMain.childNodes[1];
                if (ToInt(Area4.style.top) != 0) {
                    Area2 = oDivMain.childNodes[0];
                    mode = 2;
                } else {
                    Area3 = oDivMain.childNodes[0];
                    mode = 3;
                }

            }
        }
        return { mode: mode, Area1: Area1, Area2: Area2, Area3: Area3, Area4: Area4 };
    },
    getEmptyTd: function(oEbiao) {
        ///ȡ��û��װ��ؼ���TD,��û���򷵻�null
        var oDivMain = NavJs.child(oEbiao, "div", 0);
        var oTable = NavJs.child(oDivMain, "table", 0);
        for (var i = 0; i < oTable.rows.length; i++) {
            for (var j = 0; j < oTable.rows[i].cells.length; j++) {
                if (oTable.rows[i].cells[j].children.length == 0) return oTable.rows[i].cells[j];
            }
        }
        return null;
    },
    tdToObj: function(obj, oTd) {

        //Ӧ���Ͽؼ������ж�
        switch (obj.getAttribute("controltype")) {
            case "label":
                obj.innerText = oTd.innerText;
                break;
            case "button":
                break;
            case "radio":
                SetRadioValue(obj, oTd.innerText);
                break;
            case "checkbox":
                SetCheckBoxValue(obj, oTd.innerText);
                break;
            default:
                obj.value = oTd.innerText;
        }
    },
    moveCont: function(obj, oTd, oEbiao) {
        ///��obj�ؼ���oTd����λ����.
        if (oTd.innerText == fcpubdata.noPermitTag || obj.getAttribute("isCellHide") == 1) return; //2012-09-09 add

        obj.style.display = "";
        obj.style.position = "absolute";

        //���������E��ؼ���TD������.
        var e = oTd;
        var inTd = 1; //����1��ʾ����ؼ��ڵ�Ԫ������ʾ��-1����ס��Ԫ��
        var leftLine = ToInt(e.style.borderLeftWidth); //currentStyle �Ļ�
        var topLine = ToInt(e.style.borderTopWidth);
        var rightLine = ToInt(e.style.borderRightWidth);
        var bottomLine = ToInt(e.style.borderBottomWidth);
        //        var cellNoneBorder = true;
        //        if (cellNoneBorder == true) {//���û�����õ�Ԫ����ߣ����߿��Ϊ1
        //            leftLine = 1;
        //            topLine = 1;
        //            rightLine = 1;
        //            bottomLine = 1;
        //        }



        var iNum = 1; //��ie8�¶�����󣬲�1�����أ�ie6�²���Ϊ0 ��fhj���

        //        if (getIEVersion() == 6 && inTd != 1) {//fhj���
        //            leftLine = 0;
        //            topLine = 0;
        //            iNum = 0;
        //        }

        var l = e.offsetLeft; //+leftLine * inTd;
        var t = e.offsetTop; //+topLine * inTd;

        while (e = e.offsetParent) {
            if (e.getAttribute("controltype") == "ebiao" || e.getAttribute("controltype") == "layout" || e.getAttribute("controltype") == "eblayout") break;
            if (e.style.position != "absolute") {
                l += e.offsetLeft;
                t += e.offsetTop;
            } else {
                l += ToInt(e.style.left);
                t += ToInt(e.style.top);
            }
        }


        //        if (getIEVersion() == 6 && inTd == 1) {//fhj���
        //            leftLine = 0;
        //            topLine = 0;
        //            iNum = 0;
        //        }
        var w = oTd.offsetWidth; //+(-1) * inTd * (leftLine + rightLine);
        var h = oTd.offsetHeight; // +(-1) * inTd * (topLine + bottomLine);
        if (w < 0) w = 0;
        if (h < 0) h = 0;
        //alert("my1:" + obj.id + "=" + w);

        //����֧���й������������2013-08-14
        var scrollLeft = 0;
        var scrollTop = 0;
        if (!IsSpace(oEbiao)) {
            var oArea = this.get4Area(oEbiao);
            if (oArea != null && oArea.mode > 1) {
                scrollLeft = oArea.Area4.scrollLeft;
                scrollTop = oArea.Area4.scrollTop;
            }
        }

        if (obj.getAttribute("controltype") == "dropdownlist") {
            if (IsTrue(fcpubdata.area.getAttribute("allBrowser"))) {
                var objJs = $obj(obj.id);
                obj.style.left = (l - 1 - scrollLeft) + "px";
                obj.style.top = (t - scrollTop) + "px"; //����1px
                obj.style.width = w + "px";
                obj.style.height = h + "px";
                objJs.width = w;
                objJs.height = h;
                objJs.fnInitstyle();
            } else {
                //���������У�Ϊ�˼���layout�ؼ�
                obj.left = l - 1;
                obj.top = t;
                obj.width = w;
                obj.height = h;
            }
            //alert(w + ":" + h);


            //
            try { } catch (e) { }
        } else {
            obj.style.left = (l - 1 - scrollLeft) + "px";
            obj.style.top = (t - scrollTop) + "px";
            //obj.style.width = w + "px";
            //obj.style.height = h + "px";
            NavJs.setWidth(obj, w);
            NavJs.setHeight(obj, h);
        }



        try {
            obj.focus(); //����ؼ����ɼ�
        } catch (e) { }

    },
    run: function(oEbiao, urlParam, pageNo, callback) {
        ///�ڱ���ʼ��ʱ����E��,���������н��, urlParam = "&param1=222"

        var contentType = oEbiao.getAttribute("contentType");
        if (IsSpace(contentType)) contentType = "rptStr";
        if (contentType == "rptStr") {
            var sTable = oEbiao.getAttribute("sourTableStr");
            sTable = RepStr(sTable, "&apos;", "'");
        } else {
            var sTable = oEbiao.getAttribute("reportName"); //E�����ƻ��ļ�����
        }
        if (IsSpace(sTable)) return;

        //var sParam = oEbiao.runParam;
        //ȡ���б�URL�ϵĲ�����
        var sParam = "";
        //        if (urlParam == "fromurl") { //��ʾ��URLȡ,���ڱ���onloadʱ
        //            sParam = getAllUrlParam();
        //        } else 
        //        
        if (IsSpace(urlParam) == false) {
            sParam = urlParam;
        } else {
            if ($id("elFilter") != null) {
                //ֻ�������������������ʾ������ͬһ�����ϣ��������� isOnloadRun == �� ʱ���Ż�����,�������������д�����������������ݡ�
                new Eapi.FormTemp().runFilter($id("elFilter"), oEbiao);
            }
            sParam = oEbiao.getAttribute("runParams");
            if (IsSpace(sParam)) sParam = "";
        }


        var sFixUrl = "&tempfilepath=" + escape(fcpub.tempFilePath);
        var isFixRowCol = oEbiao.getAttribute("isFixRowCol");
        if (IsSpace(isFixRowCol)) isFixRowCol = 1;
        sFixUrl += "&e_fixrowcol=" + isFixRowCol;
        if (IsSpace(pageNo)) pageNo = 1;
        sFixUrl += "&e_pageno=" + pageNo;

        //����̨����HTML�и��п�ʱ�Ŀ��أ�2012-11-27
        var isIeNew = 0;
        //alert(document.compatMode);
        if (document.compatMode != "BackCompat") { //&&  getIEVersion() >= 9 
            isIeNew = 1;
            sFixUrl += "&e_ienew=" + isIeNew;
        }


        var sPageSet = "e_page_size:13;e_paper_width:-1;e_paper_height:";
        var showHeight = oEbiao.getAttribute("showHeight");
        if (IsSpace(showHeight)) showHeight = -1;
        sPageSet += showHeight;

        var sXml = "<" + contentType + ">" + sTable + "</" + contentType + ">" + "<params>" + RepXml(sParam) + "</params>" + "<pageSet>" + sPageSet + "</pageSet>";

        if (typeof (callback) != "function") {
            var sRet = SendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=calcStr" + sFixUrl, sXml);
            after_run_action(sRet, oEbiao);
        } else {
            SendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=calcStr" + sFixUrl, sXml,
            function(result) {
                var sRet = result.value;
                var oCont = result.context;
                after_run_action(sRet, oCont);
                callback();
            }, oEbiao);
        }

        function after_run_action(sRet, oCont) {
            //alert(sRet);
            if (!IsSpace(sRet)) {
                var arr = sRet.split(",,,");
                if (arr.length != 2) {
                    alert(sRet);
                    return;
                }
                sRet = arr[1];
                oCont.setAttribute("pageCount", arr[0]);

                //$id("style_id_" + oCont.id).innerHTML = " td { font-size:60px; }";
            }
            //CopyToPub(sRet);
            if (oCont.getAttribute("isHaveRunResult") == "��") {
                var oDivMain = NavJs.child(oCont, "div", 0);
                if (sRet.indexOf("<div ") < 0) {
                    //����E������ˡ�
                    alert(sRet);
                    return;
                }
                if (oDivMain != null)
                    oDivMain.outerHTML = sRet;

            } else {
                if (sRet.indexOf("<div ") < 0) {
                    alert(sRet);
                    return;
                }
                //oCont.insertAdjacentHTML("afterBegin", sRet); //��table�����뵽E��ؼ�����ǰ��
                NavJs.insertHtml("afterBegin", oCont, sRet);
                //
                oCont.setAttribute("isHaveRunResult", "��");
            }
            var oDivMain = NavJs.child(oCont, "div", 0);
            if (oDivMain == null) return;
            //������Ҫȡ��E������Ľ��
            var sInXml = oDivMain.getAttribute("dsXml");
            if (sInXml == null) return;
            new Eapi.EformEbiao().runAction(oCont, sInXml);
        }

    },
    runAction: function(oCont, sInXml) {
        ///�˺���ΪE��ؼ��Ͳ��ֿؼ�����,oCont ΪE��ؼ�,sInXml Ϊ���õ�xml��
        //alert("my7"+sInXml)
        if (typeof (sInXml) != "undefined") {
            //�ж��Ƿ�ͨ������URL�ϴ�����ֻ������
            var isShowView = $urlParam("ebReadOnly"); //=yes
            if (IsTrue(isShowView)) oCont.setAttribute("isShowView", 1);

            sInXml = unescape(sInXml);
            //alert(sInXml)
            //CopyToPub(sInXml);
            var oXml = SetDom(sInXml);
            if (oXml.documentElement == null) {
                alert(sInXml);
                return;
            }
            var isNotRunEb = oCont.getAttribute("isRunEbiao") != 1;
            //����ʼ����ʾ/���ؿؼ�
            var oHide = oXml.documentElement.childNodes[0];
            for (var i = 0; i < oHide.childNodes.length; i++) {
                var sId = oHide.childNodes[i].nodeName;
                var oId = $id(sId);
                if (oId == null) continue;
                if (NavJs.textContent(oHide.childNodes[i]) == "0" || IsTrue(isShowView) || oId.getAttribute("isCellHide") == 1) {
                    oId.style.display = "none";

                }
                //����ϸ������ݼ��еĵ�ǰ�м�¼�͵���Ԫ���У�2012-09-21
                if (isNotRunEb) {
                    var ooTd = $id("eb_cell_" + sId);
                    if (ooTd != null) {
                        var sDs = oId.getAttribute("dataset");
                        var fieldName = oId.getAttribute("field");
                        if (!IsSpace(sDs) && !IsSpace(fieldName)) {
                            var sValue = $obj(sDs).Field(fieldName).Value;
                            if (sValue == fcpubdata.noPermitTag) oId.style.display = "none";
                            //alert(sDs + "|" + fieldName + "|" + sValue)
                            this.setCellValue(ooTd, sValue); //�����ָ���һ�Ρ�
                        }
                    }
                }
            }


            //�������ݼ�
            if (oCont.getAttribute("controltype") == "ebiao" || (oCont.getAttribute("controltype") == "eblayout" && oCont.getAttribute("isRunEbiao") == 1)) {
                var oDss = oXml.documentElement.childNodes[1];
                for (var i = 0; i < oDss.childNodes.length; i++) {
                    var sId = oDss.childNodes[i].nodeName;
                    var sDsTr = NavJs.xml(oDss.childNodes[i]);
                    //��ȥXML�Ӹ��ڵ�
                    if (sDsTr.length <= sId.length + 3) {
                        sDsTr = "";
                    } else {
                        sDsTr = sDsTr.substring(sId.length + 2, sDsTr.length - (sId.length + 3));
                    }
                    var oDs = $obj(sId);
                    var sDsXml = NavJs.xml(oDs.oDom.documentElement.childNodes[oDs.oDom.documentElement.childNodes.length - 1]);
                    sDsXml = "<root>" + sDsTr + sDsXml + "</root>";
                    //alert(sDsXml)
                    oDs.OpenXmlData(sDsXml);

                }
            }

            fcpubdata.genEventObj.arrTb = new Array();

            //ȡ����ϸ���ݼ���ÿ��¼��ռ������
            var oRecRows = getRecRowsObj(oCont.getAttribute("recRows"));
            //alert(oCont.getAttribute("recRows"))
            var oArea = new Eapi.EformEbiao().get4Area(oCont);
            //������ʼ�кͶ�̬��ʾ�ؼ�����EFORM�����ݼ�������
            var oDss = oXml.documentElement.childNodes[2];
            //alert(oDss.xml)
            var gridds = ""; //��E��ؼ��ϱ�����ϸ���ݼ�
            //var posDs=0;

            if (oCont.getAttribute("controltype") == "layout" || (oCont.getAttribute("controltype") == "eblayout" && oCont.getAttribute("isRunEbiao") != 1)) { //��Ҫ������ϸ�����ݼ��е����ݷ�ӳ�������.
                var allDsId = oCont.getAttribute("allDsId");
                if (!IsSpace(allDsId)) {
                    var arr = allDsId.split(",");
                    for (var i = 0; i < arr.length; i++) {
                        var oDs = $id(arr[i]);
                        if (IsSpace(oDs)) continue;
                        if (IsTrue(oDs.getAttribute("isSubGrid"))) continue;
                        oDs = $obj(oDs.id);
                        this.fset_cont2(oDs, oCont);
                    }
                }

            }

            for (var i = 0; i < oDss.childNodes.length; i++) {
                //           if(oDss.childNodes(i).childNodes(0).text == "") continue;
                var sId = oDss.childNodes[i].nodeName;
                var oDs = $obj(sId);
                if ((IsSpace(oRecRows) == false && IsSpace(oRecRows[sId]) == false) || NavJs.textContent(oDss.childNodes[i].childNodes[0]) != "") {
                    //try{
                    //alert(sId + oRecRows[sId]);
                    oDs.e_recRows = ToInt(oRecRows[sId]);
                    //}catch(e){}
                    gridds += sId + ",";
                    var startRow = NavJs.textContent(oDss.childNodes[i].childNodes[0]);
                    if (startRow != "") {
                        startRow = ToInt(startRow);
                        if (oArea != null) {
                            if (oArea.mode == 1)
                                oDs.e_startRow = startRow + 1; //����tableʱ��һ�����С�
                            if (oArea.mode == 2 || oArea.mode == 4)
                                oDs.e_startRow = startRow - oCont.childNodes[0].childNodes[0].childNodes[0].rows.length + 2; //+2����Ϊ��ǰ�������һ�����С�
                        } else {
                            if (oCont.getAttribute("controltype") == "layout") {
                                oDs.e_startRow = startRow;
                            } else {
                                oDs.e_startRow = startRow + 1;
                            }
                            if (oCont.getAttribute("controltype") == "layout" || (oCont.getAttribute("controltype") == "eblayout" && oCont.getAttribute("isRunEbiao") == 3)) {
                                oDs.tableId = NavJs.textContent(oDss.childNodes[i].childNodes[2]); //html table��ID
                            }
                        }
                    }
                    if (IsSpace(oDs.e_recRows)) oDs.e_recRows = 1; //δ����ʱĬ��ֵΪ1

                }
                //alert(oDs.e_startRow)
                //posDs++;
                oDs.e_contsId = NavJs.textContent(oDss.childNodes[i].childNodes[1]); //��̬��ʾ�ؼ���
                //
                this.showConts(oDs, oCont);

                this.hideConts(oDs); //����ʾ��������Ϊ�˷�ֹ�ؼ���λ, 2011-06-30
                if (oDs.RecordCount == 0) oDs.Append("ǿ�м�һ��"); //��Ϊ�������Ͽ϶�����һ������,������Ҫ��һ����¼����Ӧ��.


                if (oCont.getAttribute("controltype") == "layout" || (oCont.getAttribute("controltype") == "eblayout" && oCont.getAttribute("isRunEbiao") != 1)) { //��Ҫ�����ݼ��е����ݷ�ӳ�������.
                    //alert(oDs.RecordCount)
                    this.fset_cont2(oDs, oCont);
                    this.refreshDs(oCont, oDs);
                    //                    for (var k = 1; k < oDs.RecordCount; k++) {
                    //                        //���ӱ���ϵ���
                    //                        var arrTr = this.getTrObjs(oCont, oDs.RecNo + oDs.e_startRow, oDs);
                    //                        if (arrTr != null) this.insertRowSub(oCont, arrTr[0], oDs.e_recRows);

                    //                        oDs.SetPos(k);
                    //                        this.fset_cont2(oDs, oCont);
                    //                    }
                    //                    oDs.SetPos(0);

                }
            }
            if (gridds != "") {
                gridds = gridds.substring(0, gridds.length - 1);
                oCont.setAttribute("gridDs", gridds); //������ΪgridDs.
            }

            //            if (IsTrue(isShowView)) { //�ӵ�Ԫ��ĳ�����
            //                var hrefIds = oCont.getAttribute("hrefIds");
            //                if (IsSpace(hrefIds) == false) {
            //                    var arrT = hrefIds.split(",");
            //                    for (var j = 0; j < arrT.length; j++) {
            //                        var oC = $id(arrT[j]);
            //                        var oTd = $id("eb_cell_" + arrT[j]);
            //                        var oDs = $obj(oC.getAttribute("dataset"));

            //                        var hrefs = new Eapi.EformEbiao().getTdHref(oDs, oTd.getAttribute("linkTbName"), oTd.getAttribute("linkFdName"), oC.getAttribute("field"));
            //                        if (IsSpace(hrefs) == false) {
            //                            oTd.innerHTML = hrefs;
            //                        }

            //                    }
            //                }
            //            }
            fcpubdata.genEventObj.arrTb = null;

            this.refreshContPos(oCont);
            //this.showConts(oDs,oCont);

            this.doDisabledPermit(oCont);

            //new Eapi.EformEbiao().resizeConts();     

            //�������п�����Ҫע��
            //if (Sys.Browser.agent != Sys.Browser.InternetExplorer)
            //    window.setTimeout('NavJs.fireEvent(window, "onresize");', 10);

        }

        this.loadEvent(oCont);

    },
    loadEvent: function(oCont) {
        ///װ��E���¼�,2012-12-04
        if (oCont.getAttribute("isLoadEvent") != 1) {
            //����resize�¼� 2012-08-28
            var eventResize = fcpubdata.area.getAttribute("BLONresizeBefore");
            if (IsSpace(eventResize)) eventResize = "";
            var evtStr = "new Eapi.EformEbiao().winResizeBefore('" + oCont.id + "');"
            if (eventResize.indexOf(evtStr) < 0) eventResize += evtStr;
            fcpubdata.area.setAttribute("BLONresizeBefore", eventResize);

            var eventResize = fcpubdata.area.getAttribute("BLONresizeAfter");
            if (IsSpace(eventResize)) eventResize = "";
            var evtStr = "new Eapi.EformEbiao().winResizeAfter('" + oCont.id + "');"
            if (eventResize.indexOf(evtStr) < 0) eventResize = evtStr + eventResize;
            fcpubdata.area.setAttribute("BLONresizeAfter", eventResize);


            oCont.onclick = function() { //alert("ebiao_onclick"); 
                new Eapi.EformEbiao().click();
            };


            oCont.setAttribute("isLoadEvent", 1);
        }
        //�����Դ����е����ع��ܣ���ʵ������ID��
        if (oCont.getAttribute("isRunEbiao") == 3 && oCont.id == "elList") {
            var oDivMain = NavJs.child(oCont, "div", 0);
            var oTable = NavJs.child(oDivMain, "table", 0);
            var oGroup = NavJs.child(oTable, "colgroup", 0);
            if (oGroup != null) {
                for (var i = 0; i < oGroup.getElementsByTagName("col").length; i++) {
                    if (NavJs.child(oGroup, "col", i).getAttribute("e_hide_col") == 1) {
                        new Eapi.Css().hideCol(oTable, i);
                    }
                }
            }
        }

        //E��ؼ�������֮���¼���
        var sEvent = oCont.getAttribute("runAfter");
        if (!IsSpace(sEvent)) {
            eval(sEvent);
        }


    },
    winResizeBefore: function(oEbiaoId) {
        /// ����resize�¼���Ҫִ�еĴ��롣2012-08-18

        var oCont = $id(oEbiaoId);
        new Eapi.EformEbiao().refreshContPos(oCont, true);
        var len = new Eapi.EformEbiao().getGridDsCount(oCont);
        for (var i = 0; i < len; i++) {
            var oDs = new Eapi.EformEbiao().getGridDs(oCont, i);
            if (typeof (oDs) != "undefined")
                new Eapi.EformEbiao().hideConts(oDs);
        }



    },
    winResizeAfter: function(oEbiaoId) {
        /// ����resizeAfter�¼���Ҫִ�еĴ��롣2012-10-17
        var oEbiao = $id(oEbiaoId);

        //�ж�����table֮��ĵ�������
        this.resizeEbiaoDiv(oEbiaoId, oEbiao.getAttribute("resizeTypeW") == "������", oEbiao.getAttribute("resizeTypeH") == "������")  //�������ú�tableһ����

        if (oEbiao.getAttribute("resizeTypeW") == "������") {
            this.resizeTable(oEbiao);
        }
    },
    resizeEbiaoDiv: function(oEbiaoId, isResizeW, isResizeH) {
        ///�������2013-08-16,
        //isResizeW = true ��������width
        //isResizeH = true ��������height

        var oEbiao = $id(oEbiaoId);
        var oArea = this.get4Area(oEbiao);
        var newWidth = 0, newHeight = 0;
        if ((IsSpace(oArea) == false && oArea.mode == 1) || oEbiao.getAttribute("isRunEbiao") == 3) {
            var oTable = NavJs.child(NavJs.child(oEbiao, "div", 0), "table", 0);
            if (oTable != null) {
                newWidth = oTable.offsetWidth;
                newHeight = oTable.offsetHeight;
            }
        }
        if (IsSpace(oArea) == false && oArea.mode == 2) {
            var oTable = NavJs.child(oArea.Area2, "table", 0);
            if (oTable != null) {
                newHeight += oTable.offsetHeight;
            }
            var oTable = NavJs.child(oArea.Area4, "table", 0);
            if (oTable != null) {
                newWidth = oTable.offsetWidth;
                newHeight += oTable.offsetHeight;
            }

        }
        if (IsSpace(oArea) == false && oArea.mode == 3) {
            var oTable = NavJs.child(oArea.Area3, "table", 0);
            if (oTable != null) {
                newWidth += oTable.offsetWidth;
            }
            var oTable = NavJs.child(oArea.Area4, "table", 0);
            if (oTable != null) {
                newWidth += oTable.offsetWidth;
                newHeight = oTable.offsetHeight;
            }

        }
        if (IsSpace(oArea) == false && oArea.mode == 4) {
            var oTable = NavJs.child(oArea.Area2, "table", 0);
            if (oTable != null) {
                newHeight += oTable.offsetHeight;
            }
            var oTable = NavJs.child(oArea.Area3, "table", 0);
            if (oTable != null) {
                newWidth += oTable.offsetWidth;
            }
            var oTable = NavJs.child(oArea.Area4, "table", 0);
            if (oTable != null) {
                newWidth += oTable.offsetWidth;
                newHeight += oTable.offsetHeight;
            }

        }

        if (isResizeW) {
            oEbiao.style.width = newWidth + "px";
        }
        if (isResizeH) {
            if (NavJs.isIpad() || ToInt(oEbiao.style.height) > newHeight)
                oEbiao.style.height = newHeight + "px";
        }
        //
        this.setDivSize(oEbiao);
    },
    setDivSize: function(oEbiao) {
        ///ͬ�������ڲ��Ķ��DIV
        /// ����resizeAfter�¼���Ҫִ�еĴ��롣2012-10-17
        var oCont = oEbiao;
        if (oCont.style.display == "none" || oCont.offsetWidth == 0 || oCont.offsetHeight == 0) return;
        var oArea = this.get4Area(oCont);
        if (IsSpace(oArea) == false && oArea.mode != 1) { //==1��ʾû�й̶�������ʾ,ֻ��һ��table
            var tmpwidth = oCont.offsetWidth - oArea.Area4.offsetLeft;
            if (tmpwidth < 0) tmpwidth = 0;
            oArea.Area4.style.width = tmpwidth + "px";
            var tmpheight = oCont.offsetHeight - oArea.Area4.offsetTop;
            if (tmpheight < 0) tmpheight = 0;
            oArea.Area4.style.height = tmpheight + "px";

            //alert(tmpwidth +":"+tmpheight )

            if (oArea.Area2 != null) {
                if (oArea.Area4.scrollHeight != oArea.Area4.clientHeight) {
                    //oArea.Area2.style.overflowY = "scroll"; Sys.Browser.agent == Sys.Browser.InternetExplorer && 
                    tmpwidth = tmpwidth - 18;
                    if (tmpwidth < 0) tmpwidth = 0;

                }
                oArea.Area2.style.width = tmpwidth + "px";
                oArea.Area2.style.height = NavJs.child(oArea.Area2, "table", 0).style.height;
            }
            if (oArea.Area3 != null) {
                if (oArea.Area4.scrollWidth != oArea.Area4.clientWidth) {
                    //oArea.Area3.style.overflowX = "scroll"; Sys.Browser.agent == Sys.Browser.InternetExplorer && 
                    tmpheight = tmpheight - 18;
                    if (tmpheight < 0) tmpheight = 0;
                }
                oArea.Area3.style.height = tmpheight + "px";
            }
        }


    },
    resizeTable: function(oEbiao) {
        ///�����������иߺ��п�
        //var oEbiao = $id(oEbiaoId);
        var oArea = this.get4Area(oEbiao);
        var oDiv4 = null;
        if (IsSpace(oArea) == false && oArea.mode != 1) {
            oDiv4 = oArea.Area4;
        }
        if (oArea == null) {
            oDiv4 = NavJs.child(oEbiao, "div", 0);
        }

        var oTable = NavJs.child(oDiv4, "table", 0);

        if (oTable == null) return;
        var allColWidth = oTable.offsetWidth;
        if (allColWidth < 1) return;
        var allRowHeight = oTable.offsetHeight;
        if (allRowHeight < 1) return;
        var oDiv = oTable.parentNode; //�ϲ�DIV
        //var divWidth = oDiv.offsetWidth;
        //����й������Ļ�����-18
        //if (oDiv4.scrollHeight > oDiv4.clientHeight) divWidth -= 18;
        var divWidth = oDiv.clientWidth - 2;

        if (divWidth < 1) return;
        var rateCol = divWidth / allColWidth;
        var rateRow = ToInt(oDiv.style.height) / allRowHeight;
        if (oArea != null && oArea.mode == 2) {
            var oTable1 = NavJs.child(oArea.Area2, "table", 0);
        }
        for (var i = 0; i < oTable.rows[0].cells.length; i++) {
            var oCol = oTable.rows[0].cells[i];
            oCol.style.width = Math.floor(ToInt(oCol.style.width) * rateCol) + "px";
            if (oArea != null && oArea.mode == 2) {
                oTable1.rows[0].cells[i].style.width = oCol.style.width;
            }
        }
        oTable.style.width = divWidth + "px";
        if (oArea != null && oArea.mode == 2) {
            oTable1.style.width = oTable.style.width;
        }
        //        for (var i = 0; i < oTable.rows.length; i++) {
        //            oTable.rows[i].style.height = Math.floor(ToInt(oTable.rows[i].style.height) * rateRow) + "px";
        //        }
        //        oTable.style.height = oEbiao.style.height;
        //

    },
    addRightTitle: function(oEbiao) {
        ///�����ֹ�����ʱ�������������Ͻǲ���һ��div, 2012-12-10

        if (typeof (oEbiao) == "undefined") oEbiao = $id("elList");
        if (IsSpace(oEbiao)) oEbiao = $id("elSub");
        var oDivMain = NavJs.child(oEbiao, "div", 0);
        if (oDivMain == null) return;
        var oArea = new Eapi.EformEbiao().get4Area(oEbiao);
        if (oArea == null) return;
        if (oArea.mode == 2 && oArea.Area4.scrollHeight > oArea.Area4.clientHeight) {
            var sid = oEbiao.id + "_right_title";
            var oDiv = $id(sid);
            if (IsSpace(oDiv)) {
                oDiv = NavJs.insertHtml("beforeEnd", oDivMain, "<div id='" + sid + "' class='eb_cell_title' style='display:none;position:absolute;width:18px;top:0px;border-left:0px;'></div>");
            }

            oDiv.style.height = oArea.Area2.style.height;
            oDiv.style.left = (ToInt(oArea.Area2.style.left) + ToInt(oArea.Area2.style.width)) + "px";

            if (oArea.Area4.scrollHeight > oArea.Area4.clientHeight) //���ֹ�����
                oDiv.style.display = "";
            else
                oDiv.style.display = "none";

        }
    },
    emptySubTable: function(oEbiao, oDs) {
        ///��������� ʱ,��Ҫ����ӱ�. oDsΪ�ӱ����ݼ�����
        for (var i = oDs.RecordCount - 1; i > 1; i--) {
            this.deleteRowSub(oEbiao, oDs, i);
        }
        oDs.OpenEmpty();
        this.fset_cont2(oDs, oEbiao);
    },
    dragEnter: function() {
        ///������E��ؼ���ondrop�¼��д���Ҫ�����TD,�϶�ʱ�����д�
        //textarea1.value += "ondrop\n";

        var event = NavJs.getEvent();
        var obj = NavJs.getEventObj();

        fcpub.dragTag = 2; //��ʾ�����˴��¼�
        fcpub.dragInObj = obj;

        if (obj.tagName != "TD") {  //�˴���ָ�Ƶ�E��ؼ��ڲ��Ŀؼ���ʱ
            //event.returnValue = false;
            NavJs.preventDefault(event);
            fcpub.dragTag = 4;
            return;
        }
        if (obj.children.length > 0) { //Ŀ��TD�����пؼ�
            //event.returnValue = false;
            NavJs.preventDefault(event);
            fcpub.dragTag = 4;
            return;
        }
        //��������TD��.
        obj.setAttribute("backupValue", obj.innerText);
        obj.innerText = "";


    },
    dragExit: function() {
        ///��E��ؼ���ondragend�¼��д���Ҫ�뿪��TD(��event.srcElement.parentNodeȡ��Ҫ�뿪��TD)
        //textarea1.value += "ondragend\n";
        if (fcpub.dragTag == 4) {
            event.returnValue = false;
            return;
        }
        if (fcpub.dragTag == 1) { //��ʾû�з��� dragEnter
            //if(fcpub.dragInObj.tagName !=  "TD"){
            event.returnValue = false;
            return;
            //}
        }

        var oDrag = event.srcElement;
        var obj = oDrag.parentNode;

        if (typeof (obj.backupValue) != "undefined") {
            obj.innerText = obj.backupValue;
            obj.removeAttribute("backupValue");
        }

        //oDrag = $id(oDrag.id);
        //if(oDrag != null){
        //    oDrag.style.position="static";
        //    oDrag.style.width="100%";
        //    oDrag.style.height="100%";
        //}
    },
    dragStart: function() {
        ///��E��ؼ���ondragstart�¼��д���
        //textarea1.value += "ondragstart\n";
        fcpub.dragTag = 1;
        fcpub.dragInObj = event.srcElement;

    },
    divDrop: function() {
        ///��������DIV��ondrop�¼�,���϶�����
        //textarea1.value += "div_ondrop\n";
        if (fcpub.dragTag == 1) { //�˴���ֹ�ؼ����϶�������.
            event.returnValue = false;
            fcpub.dragTag = 4;
            return;
        }

    },
    open: function(obj) {  //��layout.htmҳ��������
        ///�����Դ���֮ǰ
        /// obj Ϊ��ǰ˫����e��ؼ�
        var oTable = new Object();
        oTable.html = obj.innerHTML;

        var k = 0;
        var arrConts = new Array();
        //ɨ��ؼ�,�ж��Ƿ���e����
        for (var i = 0; i < oContXml.documentElement.childNodes.length; i++) {
            for (var j = 0; j < oContXml.documentElement.childNodes(i).childNodes.length; j++) {
                var sId = oContXml.documentElement.childNodes(i).childNodes(j).text;
                var oCont = $id(sId);
                if (oCont != null && oCont.parentNode.tagName == "TD") {
                    var o = oCont.parentNode.parentNode.parentNode.parentNode.parentNode;
                    if (o.controltype == "ebiao" && o.id == obj.id) { //��e����
                        var oArr = new Object();
                        oArr.cont = oCont;
                        //oArr.del = true;
                        oArr.id = oCont.id;
                        oArr.html = oCont.outerHTML;

                        arrConts[k] = oArr;
                        arrConts[oCont.id] = oArr;
                        k++;

                    }
                }
            }
        }
        oTable.conts = arrConts;

        return oTable;
    },
    ret: function(obj, oRet, oTable) { //��layout.htmҳ��������
        ///����eform��Ĵ���
        /// obj ��e��ؼ�����
        /// oRet ��e����ƴ��ڵķ��ض���
        /// oTable �Ǵ�e����ƴ���ʱ���ݵĶ���
        if (typeof (oRet) == "undefined") return;
        obj.innerHTML = oRet.html;
        if (oTable.conts.length == 0) return;

        var oT = obj.childNodes(0); //table����
        for (var i = 0; i < oT.rows.length; i++) {
            for (var j = 0; j < oT.rows(i).cells.length; j++) {
                var oCell = oT.rows(i).cells(j);
                var sId = oCell.eformContId;
                if (typeof (sId) != "undefined") {
                    new Eapi.Css().clearPart(oCell, "backgroundImage", "background-image");
                    new Eapi.Css().clearPart(oCell, "backgroundPosition", "background-position");
                    new Eapi.Css().clearPart(oCell, "backgroundRepeat", "background-repeat");
                    oCell.removeAttribute("eformContId");
                    oCell.backupValue = oCell.innerText;
                    oCell.innerHTML = oTable.conts[sId].html;
                    //oTable.conts[sId].del = false;
                }
            }
        }
        //for(var k=0;k<oTable.conts.length;k++){
        //    if(oTable.conts[k].del){ //��ʾ��Ҫɾ���˿ؼ�

        //    }
        //}
        if (TooContXml()) { openobjlist(); } //ͬ���ؼ�ID
    },
    load: function(oTable) { //װ�봮��e����,��ebdesign.htmҳ��������

        $id("t").outerHTML = oTable.html;
        //$id("tCopy").innerHTML = oTable.html;
        fcpub.haveContTdArr = new Array();
        var count = 0
        var arrConts = oTable.conts;
        for (var i = 0; i < arrConts.length; i++) {
            var oCont = arrConts[i].cont;
            if (IsSpace(oCont.controltype) == false) {
                var oTd = $id("t").rows(oCont.parentNode.parentNode.rowIndex).cells(oCont.parentNode.cellIndex);
                fcpub.haveContTdArr[count] = oTd;
                count++;

                oTd.style.backgroundImage = "url(../ereport/images/ef_ebiao_" + oCont.controltype + ".gif)"; //���ؼ����ĵ�Ԫ�񱳾�ͼƬ
                oTd.style.backgroundPosition = "right";
                oTd.style.backgroundRepeat = "no-repeat";
                oTd.eformContId = oCont.id;
                oTd.innerHTML = ""; //���
                oTd.innerText = oTd.backupValue;
                //��Ҫ��TD�еĿؼ������
                //oCont.outerHTML = "";  //�����������������               
            }
        }
        //alert($id("t").outerHTML);
        //CopyToPub($id("t").outerHTML);
        //$id("t").outerHTML = $id("t").outerHTML ; 
        //var sBig = $id("tCopy").innerHTML;
        //$id("tCopy").innerHTML="";
        //$id("t").outerHTML = sBig;
        LoadReportInit();

    },
    save: function() {   // ���ؿؼ�����eform��,��ebdesign.htmҳ�������� 

        //����ǰ����
        //SelObj.curTD.oTD.innerText = txtEdit.value;
        //shiftMerge();
        saveBeforeAction();
        //ǿ��ȥ���޸ı�־
        blnChange = false;

        var objRet = new Object();
        var oTab = $id("t");
        oTab.style.position = "static";

        objRet.html = oTab.outerHTML;
        window.returnValue = objRet;

        //���汾ebiao�ؼ��Ĵ�ӡģ���ļ�
        try {
            var oEbiao = window.dialogArguments[0];
        } catch (e) { }
        if (IsSpace(oEbiao) == false && IsSpace(oEbiao.printFile) == false) {
            //ȥ������еĿؼ�Сͼ��

            if (typeof (fcpub.haveContTdArr) != "undefined" && fcpub.haveContTdArr.length > 0) {
                //alert(123);
                for (var i = 0; i < fcpub.haveContTdArr.length; i++) {
                    var oTd = fcpub.haveContTdArr[i];
                    oTd.style.backgroundImage = "";
                    oTd.style.backgroundPosition = "";
                }
            }

            SaveReportFile(oEbiao.printFile, "e��ؼ��б���");

        }

        window.close();
    },
    changeRow: function(oEbiao, gridDsNo, isUp) {
        ///�ƶ�����ϵļ�¼�� 2012-08-23

        var oDs = this.getGridDs(oEbiao, gridDsNo);
        if ((isUp && oDs.RecNo == 0) || (isUp == false && oDs.RecNo >= oDs.RecordCount - 1)) return;
        var offset = 1;
        if (isUp) offset = -1;

        var oP = oDs.oDom.documentElement;
        var oNode, oNode1;
        oNode = oP.childNodes[oDs.RecNo].cloneNode(true);
        oNode1 = oP.childNodes[oDs.RecNo + offset].cloneNode(true);
        oP.replaceChild(oNode1, oP.childNodes[oDs.RecNo]);
        oP.replaceChild(oNode, oP.childNodes[oDs.RecNo + offset]);

        //������ϵ���
        var curRow = oDs.RecNo * oDs.e_recRows + ToInt(oDs.e_startRow);
        for (var i = oDs.e_recRows - 1; i >= 0; i--) {
            var arrTr = this.getTrObjs(oEbiao, curRow + i, oDs);
            var arrTrNew = this.getTrObjs(oEbiao, curRow + i + offset * oDs.e_recRows, oDs);
            if (arrTr != null && arrTrNew != null) arrTr[0].swapNode(arrTrNew[0]);
            if (arrTr != null && arrTr.length > 1 && arrTrNew != null && arrTrNew.length > 1) arrTr[1].swapNode(arrTrNew[1]);
        }

        oDs.SetPos(oDs.RecNo + offset);
    },
    multiSelDel: function(oEbiaoId, dsId, markExp) {
        ///��Ƿ�ʽɾ����ǰ��¼��ͬʱ������Ҫɾ��һ�У�ֻ����ϸ��ʱ��Ч 2012-08-24
        //markExp == "ֱ��ɾ��" ��ʾֱ��ɾ����¼����������ɾ����ǣ�==undefined ��ʾ�� deleteMark=1��ɾ����ǣ�2013-08-15
        var oDs = $obj(dsId);
        var oEbiao = $id(oEbiaoId)

        MultiMarkDelRec(oDs, markExp, function() {
            var delRows = 0;
            for (var i = oDs.RecordCount - 1; i >= 0; i--) {
                if (oDs.oDom.documentElement.childNodes[i].getAttribute("isSel") != 1) continue;

                if (oDs.RecordCount > 1) {
                    new Eapi.EformEbiao().deleteRowSub(oEbiao, oDs, i);
                    oDs.Delete();
                    delRows++;
                } else {
                    oDs.Delete();
                    oDs.Append();
                    this.fset_cont2(oDs, oEbiao);
                }
            }
            new Eapi.EformEbiao().actionAfterDss(oEbiao, new Eapi.EformEbiao().getGridDsNo(oEbiao, dsId), false, delRows);
            new Eapi.EformEbiao().refreshContPos(oEbiao);
            new Eapi.EformEbiao().hideConts(oDs);
            alert("ɾ���ɹ���");

        });
    },
    delRec: function(oEbiaoId, dsId, markExp) {
        ///��Ƿ�ʽɾ����ǰ��¼��ͬʱ������Ҫɾ��һ�У�ֻ����ϸ��ʱ��Ч 2012-08-23
        //markExp == "ֱ��ɾ��" ��ʾֱ��ɾ����¼����������ɾ����ǣ�==undefined ��ʾ�� deleteMark=1��ɾ����ǣ�2013-08-15
        var oDs = $obj(dsId);
        var oEbiao = $id(oEbiaoId)

        MarkDelRec(oDs, markExp, function() {
            new Eapi.EformEbiao().deleteRow(oEbiao, new Eapi.EformEbiao().getGridDsNo(oEbiao, dsId));
        })
    },
    refreshUpEbiao: function() {
        ///�����,ˢ����һ���ڵ�e��ؼ�
        if (IsSpace(fcpubdata.obj) || IsSpace(fcpubdata.obj.refreshType) || fcpubdata.obj.refreshType == "noRefresh") {
            CloseBill();
            return;
        }
        var paramObj = fcpubdata.obj;

        if (paramObj.refreshType == "execJs") {
            if (IsTrue(paramObj.isAdd))
                paramObj.oDs.Append();
            else
                paramObj.oDs.bEdit = true;
            // var oDsMain = $id(fcpubdata.dsMain);
            if (fcpubdata.elCard.cardDs != null)
                copydataset(fcpubdata.elCard.cardDs, paramObj.oDs);
            paramObj.oDs.Update();
            //paramObj.oWin.eval("new Eapi.EformEbiao().fset_cont2(fcpubdata.elList.listDs,fcpubdata.elList.oEbiao);");
        }
        //else if (paramObj.refreshType == "execBack") {
        //var isRunEbiao = oEbiao.getAttribute("isRunEbiao");
        //if (isRunEbiao == 3) {
        //    paramObj.oDs.Open();
        //} else { //��������E����ˢ��
        // paramObj.oWin.eval("new Eapi.FormTemp().refreshList();");
        //}
        //}

    },
    clearSelRadio: function(ebiaoId, dsId) {
        ///���ѡ��radio�ؼ���ѡ��״̬�� 2012-12-31
        var radioName = "rdoname_" + ebiaoId + "_" + dsId;
        var arr = document.getElementsByName(radioName);
        if (IsSpace(arr)) return false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].checked) {
                arr[i].checked = false;

                return true;
            }
        }
        return false;


    },
    isSelRadio: function(ebiaoId, dsId) {
        ///�ж���ϸ��ʱ���Ƿ�ѡ����һ��radio, 2012-08-30
        var radioName = "rdoname_" + ebiaoId + "_" + dsId;
        var arr = document.getElementsByName(radioName);
        if (IsSpace(arr)) return false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].checked) return true;
        }
        return false;
    },
    setDsRecNo: function(dsId) {
        ///�ȶ�λ���ݼ��ļ�¼ָ�롣
        var oCont = NavJs.getEventObj();
        if (oCont == null || (oCont.tagName != "A" && oCont.tagName != "BUTTON" && oCont.tagName != "INPUT")) return false;

        var oTd = oCont.parentNode;
        if (oTd == null || oTd.tagName != "TD") return false;

        var oDs = $obj(dsId);
        //alert(oDs.e_startRow + "|" + oTd.parentNode.rowIndex + "|" + oDs.e_recRows)
        if (typeof (oDs.e_startRow) != "undefined") {

            if (oDs.e_recRows > 0) {
                var recNo = (oTd.parentNode.rowIndex - oDs.e_startRow) / oDs.e_recRows;
                oDs.SetPos(recNo);

            }
            oDs.e_curTd = oTd;
        }

        return true;
    },
    nameFieldHref: function(ebiaoId, title, runUrl, dsId, findIdFieldName) {
        ///�����ֶ��������ɵĳ����ӡ�        
        new Eapi.EformEbiao().clearSelRadio(ebiaoId, dsId);
        //�ȶ�λ���ݼ��ļ�¼ָ�롣
        if (!new Eapi.EformEbiao().setDsRecNo(dsId)) return;

        if (title.substring(title.length - 2, title.length) == "����") {
            title = title.substring(0, title.length - 2);
        }
        this.nameFieldHrefSub(title, runUrl, dsId, "�༭", findIdFieldName);
    },
    nameFieldHrefSub: function(title, runUrl, dsId, editTag, findIdFieldName) {
        ///���б���ʱ���������͵��ֶ����ɵĳ����ӵ��ú���

        var idValue = "";
        if (IsSpace(editTag) || editTag == "�༭") {
            if (IsSpace(findIdFieldName)) findIdFieldName = $obj(dsId).firstKeyFieldName;
            idValue = escape($obj(dsId).Field(findIdFieldName).Value);
        }
        var allUrl = runUrl + "&fcKeyValue=" + idValue;

        var envType = fcpubdata.area.getAttribute("envType");

        if (!IsSpace(envType) && envType != "����") {

            NavJs.phoneOpenUrl(allUrl);
        } else {
            //window.open(allUrl, "rightWin");
            top.win_TabMenu.OpenTabWin("01", title, allUrl, "id");
        }
    },
    modalOpenCard: function(runUrl, dsId, ebiaoId, refreshType, winSize, isAdd) {
        //�ȶ�λ���ݼ��ļ�¼ָ�롣
        if (!IsTrue(isAdd) && !new Eapi.EformEbiao().setDsRecNo(dsId)) return;
        this.modalOpenCardSub(runUrl, dsId, ebiaoId, refreshType, winSize, isAdd);
    },
    modalOpenCardSub: function(runUrl, dsId, ebiaoId, refreshType, winSize, isAdd) {
        ///��ģ̬���ڷ�ʽ�򿪿�Ƭʽ��
        var paramObj = new Object();
        paramObj.oWin = window;
        paramObj.area = fcpubdata.area;
        paramObj.oEbiao = $id(ebiaoId);
        paramObj.oDs = $obj(dsId);
        paramObj.refreshType = refreshType;
        paramObj.isAdd = isAdd;

        if (!IsTrue(isAdd)) paramObj.recNo = paramObj.oDs.RecNo; //��ס��ǰҪ�޸ĵļ�¼��
        if (paramObj.oDs.RecordCount == 0) {
            paramObj.isEmptyRecord = true;
        } else {
            paramObj.isEmptyRecord = false;
        }
        paramObj.oldRecordCount = paramObj.oDs.RecordCount; //��ס�ɵļ�¼�����Ա�֪�������˶�������¼��
        //var envType = fcpubdata.area.getAttribute("envType");
        if (fcpubdata.isModalUser) { //|| true 
            NavJs.openModalDialog(runUrl, paramObj, new Eapi.FormTemp().winSizeTrans(winSize), function(oRet) { if (oRet.value == "ok") _modalReturn(); });
        } else {
            var sOk = window.showModalDialog(runUrl, paramObj, "resizable:yes;status:yes;" + winSize);
            if (sOk == "ok") {
                _modalReturn();
            }
        }
        function _modalReturn() {
            if (paramObj.refreshType == "execJs") {
                for (var i = 0; i < fcpubdata.elList.listDs.RecordCount - paramObj.oldRecordCount; i++) {
                    fcpubdata.elList.listDs.SetPos(paramObj.oldRecordCount + i);
                    if (paramObj.isEmptyRecord) {
                        paramObj.isEmptyRecord = false;
                    } else {
                        //���ӿհ���
                        var curRow = (paramObj.oldRecordCount + i - 1) * fcpubdata.elList.listDs.e_recRows + ToInt(fcpubdata.elList.listDs.e_startRow);
                        var arrTr = new Eapi.EformEbiao().getTrObjs(fcpubdata.elList.oEbiao, curRow, fcpubdata.elList.listDs);
                        if (arrTr != null) new Eapi.EformEbiao().insertRowSub(fcpubdata.elList.oEbiao, arrTr[0], fcpubdata.elList.listDs.e_recRows, false);
                        if (arrTr != null && arrTr.length > 1) new Eapi.EformEbiao().insertRowSub(fcpubdata.elList.oEbiao, arrTr[1], fcpubdata.elList.listDs.e_recRows, false);

                    }
                    new Eapi.EformEbiao().fset_cont2(fcpubdata.elList.listDs, fcpubdata.elList.oEbiao);
                }
                //�޸�ʱˢ��
                if (!IsTrue(isAdd)) {
                    fcpubdata.elList.listDs.SetPos(paramObj.recNo);
                    new Eapi.EformEbiao().fset_cont2(fcpubdata.elList.listDs, fcpubdata.elList.oEbiao);
                }

            } else if (paramObj.refreshType == "execBack") {
                new Eapi.FormTemp().refreshList();
            }
        }
    },
    delDetailDs: function(oEbiaoId, dsId) {
        ///��ϸ���ݼ���ɾ��һ����¼���ܣ���������ϸ���еİ�ť�������ϡ�2012-08-30
        new Eapi.EformEbiao().setDsRecNo(dsId);
        new Eapi.EformEbiao().delRec(oEbiaoId, dsId);
    },
    multiSelTag: function(dsId) {
        ///��ѡʱ�������

        var oCont = NavJs.getEventObj();
        if (oCont == null || oCont.tagName != "INPUT") return;
        var oTd = oCont.parentNode;
        if (oTd == null || oTd.tagName != "TD") return;
        var oDs = $obj(dsId);
        var recNo = (oTd.parentNode.rowIndex - oDs.e_startRow) / oDs.e_recRows;
        oDs.oDom.documentElement.childNodes[recNo].setAttribute("isSel", oCont.checked ? 1 : 0);

    },
    print: function(oEbiao, iTag) {
        /// ��ӡ
        var runSrc = "";
        if (IsSpace(oEbiao.getAttribute("printFile"))) {
            alert("δ���ô�ӡ�ļ�,�����޷�ʹ�ô˹���!");
            return;
        }
        var sP = oEbiao.getAttribute("runParams");
        if (IsSpace(sP)) {
            sP = "";
        } else {
            sP = "&" + sP;
        }
        runSrc = "../../fceform/ereport/ebrun.htm?name=" + oEbiao.getAttribute("printFile") + "&urlpara=yes&fromdb=yes" + sP;

        fcpubdata.eformPrintTag = iTag;
        if ($id(fcpubdata.eformPrintIframeName) == null) {
            NavJs.insertHtml("BeforeEnd", document.body, "<IFRAME id=" + fcpubdata.eformPrintIframeName + " name=" + fcpubdata.eformPrintIframeName + " src='' width=0 height=0></IFRAME>");
        }

        $id(fcpubdata.eformPrintIframeName).src = runSrc;
    },
    getTable: function(oEbiao) {
        ///ȡ����table����2012-12-06
        var oArea = this.get4Area(oEbiao);
        var oDivMain = NavJs.child(oEbiao, "div", 0);
        if (oArea != null && (oArea.mode == 2)) {
            oDivMain = NavJs.child(oDivMain, "div", 1);
        }
        if (oArea != null && (oArea.mode == 4)) {
            oDivMain = NavJs.child(oDivMain, "div", 3);
        }
        return NavJs.child(oDivMain, "table", 0);
    },
    refreshDs: function(oEbiao, oDs) {
        var oArea = this.get4Area(oEbiao);
        ///����ϸ���ݼ��е�����ͬ��ˢ�µ�E��ؼ��ϡ� 2012-09-02
        if (oDs.RecordCount > 0) {
            //����ϸ�д򿪱��
            for (var i = 0; i < oDs.e_recRows; i++) {
                var arrTr = this.getTrObjs(oEbiao, i + oDs.e_startRow, oDs);
                if (arrTr != null) arrTr[0].setAttribute("dataset", oDs.id);
            }
            for (var i = 1; i < oDs.RecordCount; i++) {
                var arrTr = this.getTrObjs(oEbiao, i * oDs.e_recRows + oDs.e_startRow, oDs);
                if (arrTr == null || arrTr[0].getAttribute("dataset") != oDs.id) break;
            }
            //�ӿ���
            for (var k = i; k < oDs.RecordCount; k++) {
                var arrTr = this.getTrObjs(oEbiao, (k - 1) * oDs.e_recRows + oDs.e_startRow, oDs);
                if (arrTr != null) {
                    this.insertRowSub(oEbiao, arrTr[0], oDs.e_recRows);
                    for (var j = 0; j < oDs.e_recRows; j++) {
                        var arrTr1 = this.getTrObjs(oEbiao, (k - 1) * oDs.e_recRows + oDs.e_startRow + j, oDs);
                        if (arrTr1 != null) arrTr1[0].setAttribute("dataset", oDs.id);
                    }

                }
            }
        }
        //ɾ���������
        var oDivMain = NavJs.child(oEbiao, "div", 0);
        if (oArea != null && (oArea.mode == 2)) {
            oDivMain = NavJs.child(oDivMain, "div", 1);
        }
        var oTable = NavJs.child(oDivMain, "table", 0);
        var dsRecCount = oDs.RecordCount;
        if (dsRecCount == 0) dsRecCount = 1;
        for (var k = oTable.rows.length - 1; k >= dsRecCount * oDs.e_recRows + oDs.e_startRow; k--) {
            if (oTable.rows[k].getAttribute("dataset") == oDs.id)
                oTable.deleteRow(k);
        }

        //�����ݼ��е�����ˢ�µ�E����
        this.fset_cont2(oDs, oEbiao);
        for (var k = 1; k < oDs.RecordCount; k++) {
            oDs.SetPos(k);
            this.fset_cont2(oDs, oEbiao);
        }
        oDs.SetPos(0);

    },
    isGridDs: function(oRecRows, sDs) {
        ///�ж��Ƿ�����ϸ���ݼ�,����layout�ؼ�
        if (oRecRows == null) return false;
        if (typeof (oRecRows[sDs]) == "undefined") { return false; }
        return true;
    },
    isCurProfile: function(profileIds) {
        ///����Ƿ����Ե�ǰ��id���������١�2013-05-20
        var bRet = false;
        //if (!IsSpace(profileIds)) {
        var profileId = getpubvalue("�û���.ID");
        profileIds += ",";
        bRet = profileIds.indexOf(profileId + ",") >= 0;
        if (bRet) return bRet;

        var profileIdss = getpubvalue("�û���.IDS");
        if (!IsSpace(profileIdss)) {
            var arr = profileIdss.split(";");
            for (var i = 0; i < arr.length; i++) {
                bRet = profileIds.indexOf(arr[i] + ",") >= 0;
                if (bRet) return bRet;
            }
        }

        //}
        return bRet;
    },
    getXmlPermit: function(oNode) {
        ///���XML���ݵ�Ȩ�ޣ��������١�2012-09-11
        var bRet = false;
        var profileIds = oNode.childNodes[1].text;
        if (!IsSpace(profileIds)) {
            return this.isCurProfile(profileIds);
        }

        var userIds = oNode.childNodes[0].text;
        if (!IsSpace(userIds)) {
            var userId = getpubvalue("�û�.ID");

            userIds += ",";
            bRet = userIds.indexOf(userId + ",") >= 0;
            if (bRet) return bRet;
        }
        //����Ȩ����û����
        return bRet;
    },
    doReadOnlyPermitWf: function(oEbiao) {
        ///��������̵��ֶ�ֻ��Ȩ�ޣ� 2013-05-20
        var wfName = $urlParam("wfName");
        var wfVersion = $urlParam("wfVersion");
        var actionId = $urlParam("actionId");
        var djsn = $urlParam("djsn");
        var layoutName = $urlParam(oEbiao.id);
        if (IsSpace(wfName) || IsSpace(wfVersion) || IsSpace(actionId) || IsSpace(djsn) || IsSpace(layoutName)) return;

        var sql = "select fcq_profilesub.profileid,fcq_wf_field.tableName,fcq_wf_field.fieldName from fcq_profilesub,fcq_wf_field "
 	             + " where fcq_profilesub.detail=fcq_wf_field.wfFieldId and fcq_profilesub.permit=1 and fcq_wf_field.wf_name='" + wfName
 	             + "' and fcq_wf_field.wf_version=" + wfVersion + " and fcq_wf_field.action_id=" + actionId
 	             + " and fcq_wf_field.djsn='" + djsn + "' and fcq_wf_field.name='" + layoutName + "'";
        SelectSql(sql, 1, -1, function(oRet) {
            var sRet = oRet.value;
            var oXml = SetDom(sRet);
            if (oXml.documentElement == null) {
                alert(sRet);
                return;
            }
            var len = oXml.documentElement.childNodes.length - 1;
            for (var i = 0; i < len; i++) {
                var profileId = oXml.documentElement.childNodes[i].childNodes[0].text;
                var tbname = oXml.documentElement.childNodes[i].childNodes[1].text;
                var fdname = oXml.documentElement.childNodes[i].childNodes[2].text;
                if (IsSpace(profileId) || IsSpace(tbname) || IsSpace(fdname)) continue;
                if (!this.isCurProfile(profileId)) continue;

                //���ÿؼ�
                var sid = tbname + "_" + fdname; //�ؼ�id
                if (IsSpace(sid)) continue;
                var oCont = $id(sid);
                if (oCont == null) continue;
                oCont.setAttribute("isCellHide", "1");
            }

        });


    },
    doReadOnlyPermit: function(oEbiao) {
        ///�����ֶ�ֻ��Ȩ�ޣ� 2012-09-11
        var sXml = oEbiao.getAttribute("readOnlyXml");
        if (IsSpace(sXml)) return;
        var oXml = SetDom(sXml);
        if (oXml.documentElement == null) return;
        for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
            var oNode = oXml.documentElement.childNodes[i];
            if (!new Eapi.EformEbiao().getXmlPermit(oNode)) continue;
            var sid = oNode.getAttribute("controlId");
            if (IsSpace(sid)) continue;
            var oCont = $id(sid);
            if (oCont == null) continue;

            oCont.setAttribute("isCellHide", "1");
        }

    },
    doDisabledPermit: function(oEbiao) {
        ///����ؼ�����Ȩ�ޣ� 2012-09-11
        var sXml = oEbiao.getAttribute("disabledXml");
        if (IsSpace(sXml)) return;
        var oXml = SetDom(sXml);
        if (oXml.documentElement == null) return;
        for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
            var oNode = oXml.documentElement.childNodes[i];
            if (!new Eapi.EformEbiao().getXmlPermit(oNode)) continue;
            var contType = oNode.getAttribute("contType");
            if (IsSpace(contType)) continue;
            var sTagName = "a";
            if (contType == "button") sTagName = "button";
            if (contType == "radio" || contType == "checkbox") sTagName = "input";
            var posKey = oNode.getAttribute("posKey");
            var arr = document.getElementsByTagName(sTagName);
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].getAttribute("posKey") != posKey) continue;
                arr[j].disabled = true;
            }
        }

    },
    genRunParams: function(oEbiao, pubPara) {
        ///�����µ�E�����в�����2012-10-09
        var sResult = "";
        var pubBasePara = oEbiao.getAttribute("initParams");
        if (!IsSpace(pubBasePara) && !IsSpace(pubPara)) {
            var sb = new Sys.StringBuilder();
            var arr1 = pubPara.split("&");
            var arr2 = pubBasePara.split("&");
            for (var i = arr1.length - 1; i >= 0; i--) {
                var arr1Sub = arr1[i].split("=");
                for (var j = arr2.length - 1; j >= 0; j--) {
                    var arr2Sub = arr2[j].split("=");
                    if (arr1Sub[0].toUpperCase() == arr2Sub[0].toUpperCase()) {
                        //��ʾ��pubParaΪ׼
                        Array.removeAt(arr2, j);
                    }
                }
            }
            pubPara = arr1.join("&");
            if (arr1.length == 1 && pubPara.length > 0) pubPara = "&" + pubPara;
            pubBasePara = arr2.join("&");
            if (arr2.length == 1 && pubBasePara.length > 0) pubBasePara = "&" + pubBasePara;

            sResult = pubBasePara + pubPara;
        } else if (!IsSpace(pubBasePara)) {
            sResult = pubBasePara;
        } else if (!IsSpace(pubPara)) {
            sResult = pubPara;
        }
        oEbiao.setAttribute("runParams", sResult);
    }



}

Eapi.EformEbiao.registerClass("Eapi.EformEbiao");

