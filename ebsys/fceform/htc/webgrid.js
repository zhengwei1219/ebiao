///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

/**
* ��дwebgrid.htc
* 2010-11-5
* liuxr
**/
function webgrid(obj) {
    this.id = obj;
    this.bInited = false;
    /* IE6�Ĺ����״Ϊcol-resize,row-resize.IE5��Ϊmove  */
    this.cursorcolresize = "col-resize";
    this.cursorrowresize = "row-resize";
    if (getIEVersion() < 6) {
        this.cursorcolresize = "move";
        this.cursorrowresize = "move";
    }
    /* �ؼ�����ȫ�ֵ�fccode�ؼ���onclickopen����ֵ */
    this.ponclickopen = "";
    /* ����е�״̬ */
    this.EndRowState = "edit";
    //������ȡ�ý���
    //var pubFirstClickTab=""

    //this.pubeval = 0;
    this.dataset = $id(this.id).getAttribute("dataset");
    //�жϽ����ı�����Ƿ��˼�
    //var bHitKey=false
    //oldTD�ڰ����ı�ǰ��ֵ
    this.BeforeChangeText = "";
    //this.mbIngrid = false;
    this.div1;
    this.tgrid;
    this.line;
    this.lineH;
    this.divconer;
    this.fchtcDiv1;
    this.fcButton1;
    this.fcButton2;
    this.fcButton3;
    this.fchtcDiv2;
    this.fcButton4;
    this.fcButton5;
    this.fcButton6;
    this.txtMyGrid;

    this.cz; //= new dropdownlist("czFc"); 
    //this.cz.fnInit();

    //this.cz;
    //ȱʡ��ֻ��,
    //TXT����������(�ַ�<��󳤶�>,����<С��λ��>,����)
    //CODE��.....
//    this.arr = new Array(100);
    this.bDrag = false;
    this.curY = 0;
//    this.lngTop = 0;

    //this.Vscrollmax = 0;//=5 //��Χ
    this.Vmax = 0;                  //modify by liuxr at 2010-12-7 14:16 ��Vmax����Vscrollmax
    this.TopRow = 0;                //modify by liuxr at 2010-12-7 14:16 ��TopRow����Vscrollvalue
    //this.Vscrollvalue = 0; //��ǰֵ

    ////////////////////////Hscroll
    this.bHDrag = false;
    this.curX = 0;
//    this.lngLeft = 0;
//    
    
    this.Hscrollmax = 0; //=5 //��Χ
    this.Hscrollvalue = 0; //��ǰֵ

    this.curObj; //��ǰTD
    this.preTD = null; //��һ������TD
    this.lostfocusTD = null; //���ʧȥ����󽫵�ǰTD���浽�˱�����
    //this.mcurRow, this.mcurCol;

    //��������ϲ��ƫ��ֵ,��onresize�����м���
//    this.iUpLeft = 0;
//    this.iUpTop = 0;
//    
    this.blnAdjust = false;
    this.blnAdjustH = false;
    this.AdjustRow = 0, this.AdjustCol = 0;
    this.FixRows = 1; //�̶�����
    this.FixCols = 1; //�̶�����
    //this.blnFixRowDrap = true; //Ϊ���ʾ�̶��������϶�������ѡ��

    this.ReadOnly = false;

    

    this.mScrollBar = "yes";
    this.autosize = ($id(this.id).getAttribute("autosize") == "��") ? true : false;

    this.left = $id(this.id).getAttribute("left");
    this.top = $id(this.id).getAttribute("top");
    this.height = $id(this.id).getAttribute("height");
    this.width = $id(this.id).getAttribute("width");

    this.coledit;
    this.moverflow = $id(this.id).getAttribute("overflow"); //scroll/hidden
    if (IsSpace(this.moverflow)) this.moverflow = "auto"; // "hidden";
    //this.bCell = false;
    //this.ColShow = false;
    this.visible = "��";
    this.canselect = ($id(this.id).getAttribute("canselect") == "��") ? "��" : "��";
    this.SetRowHeight = $id(this.id).getAttribute("SetRowHeight");
    this.bodyrowheight = $id(this.id).getAttribute("bodyrowheight");

    /* �ܷ�����иߺ��п�*/
    this.AdjustColWidth = false;
    this.AdjustRowHeight = false;

    this.IsOrder = "��";

    this.hideVscroll = $id(this.id).getAttribute("hideVscroll") ; //IsTrue(
    this.hideHscroll = $id(this.id).getAttribute("hideHscroll");

    //this.lngHideRows = 0;
    this.ParentPos = $id(this.id).getAttribute("ParentPos");

    //modify by liuxr at 2010-11-10 10:38 ����tab����ֵ
    this.tab = this.tgrid;

    /* ! added by liuxr at 2010-11-10 10:53 ��format���Ը�ֵ*/
    this.format = $id(this.id).getAttribute("format");

    /* ! added by liuxr at 2010-11-10 11:27 ��blRowNo���Ը�ֵ*/
    this.blRowNo = $id(this.id).getAttribute("blRowNo");

    /* ! added by liuxr at 2010-11-10 11:27 ��Rows���Ը�ֵ*/
    this.Rows = 0;

    /* ! added by liuxr at 2010-11-10 11:27 ��Cols���Ը�ֵ*/
    this.Cols = 0;

    /* ! added by liuxr at 2010-11-11 10:27 ��curTD���Ը�ֵ*/
    this.curTD = this.curObj;

    /* ! added by liuxr at 2010-12-7 14:37 ��Row���Ը�ֵ this.curObj.parentNode.rowIndex*/
    this.Row = 0;
    /* ! added by liuxr at 2010-12-7 14:37 ��Col���Ը�ֵ this.curObj.cellIndex*/
    this.Col = 0;

    //------------------- my add
    this.offsetValue; //�����и��п�ʱ�ĵ���ֵ.


}
webgrid.prototype.getAttribute = function(attrName) {
    var retValue = eval(this.id + "." + attrName);
    if (typeof retValue == "undefined") retValue = $id(this.id).getAttribute(attrName);
    return retValue;
}
webgrid.prototype.setAttribute = function(attrName, attrValue) {
    $id(this.id).setAttribute(attrName, attrValue);
}


/**
*���㴹ֱ�������Ĺ�����Χ
**/
webgrid.prototype.VScroll = function() {
    this.ActionAutoScroll("V"); //���������=autoʱ�����
    this.Vmax = this.getVScrollMax();
    this.fnPutVscrollmax(this.Vmax);
}

/**
*����ˮƽ�������Ĺ�����Χ
**/
webgrid.prototype.HScroll = function() {
    this.ActionAutoScroll("H"); //���������=autoʱ�����
    this.Hscrollmax = this.getHScrollMax();
    this.fnPutHscrollmax(this.Hscrollmax);
}
/**
*�����ʧȥ�����¼�,
**/
webgrid.prototype.txtMyGrid_onfocusout = function() {

    var gridobj = this;

    gridobj.BeforeChangeText = gridobj.curObj.innerText;
    gridobj.txtTotd();
    if (gridobj.Act_onDataChange() == false) {
    }

}
/**
*���ʧȥ�����¼�,
**/
webgrid.prototype.tgrid_onfocusout = function() {
    //var oNext=event.toElement
    var gridobj = this;

    var bln = false;
    //added by liuxr at 2010-11-5 16:11 ��ȡ�����������event����
    var event = NavJs.getEvent();
    var o = event.toElement || event.relatedTarget;

    if (o == null) return; //�㵽��ַ����,��Ϊnull
    var tagname = o.tagName.toUpperCase();
    var curGridid = gridobj.id; //eval(uniqueID+".id");
    if (tagname == "TD") {

        if (o.parentNode.parentNode.parentNode.parentNode.parentNode.id == curGridid) {
            bln = true;
        }
    }
    if (tagname == "DIV" || tagname == "INPUT") {
        if (o.parentNode.id == curGridid) {
            bln = true;
        }
    }
    if (o.id == "txtMyGrid") {
        if (o.parentNode.parentNode.id == curGridid) {
            bln = true;
        }

    }
    if (tagname == "INPUT") { //dropdownlist
        if (o.parentNode.parentNode.id == curGridid) {
            bln = true;
        }
    }
    if (tagname == "IFRAME") { //dropdownlist

        if (o.id == "fc_ifra") {
            bln = true;
        }
    }
    
    if (bln == false) {
        gridobj.LostFocus();
        //window.status=window.status+" ���ʧȥ����:"+event.srcElement.id
    }
}
/**
*����ý����¼�
**/
webgrid.prototype.tgrid_onfocusin = function() {

    var gridobj = this;

    var bln = false;
    //added by liuxr at 2010-11-5 16:11 ��ȡ�����������event����
    var event = NavJs.getEvent();
    var o = event.fromElement || event.target;

    if (o == null) return; //�л�IEʱΪnull
    if (IsSpace(o.tagName)) return;
    var tagname = o.tagName.toUpperCase();
    var focusTD = null;
    var ocur = null;  //��ǰTD
    var curGridid = gridobj.id; //eval(uniqueID+".id");
    if (tagname == "TD") {
        //alert(o.parentNode.parentNode.parentNode.parentNode.parentNode.tagName)
        if (o.parentNode.parentNode.parentNode.parentNode.parentNode.id == curGridid) {
            bln = true;
            //focusTD=event.srcElement
        }
    }
    if (tagname == "DIV" || tagname == "INPUT") {
        if (o.parentNode.id == curGridid) {
            bln = true;
        }
    }
    if (o.id == "txtMyGrid") {
        if (o.parentNode.parentNode.id == curGridid) {
            bln = true;
        }
    }
    if (tagname == "INPUT") { //dropdownlist
        if (o.parentNode.parentNode.id == curGridid) {
            bln = true;
        }
    }
    if (tagname == "IFRAME") { //dropdownlist

        if (o.id == "fc_ifra") {
            bln = true;
        }
    }

    if (bln == false) {
        ocur = event.srcElement || event.target;
        if (ocur.tagName.toUpperCase() == "A") {
            if (ocur.parentNode.tagName.toUpperCase() == "TD") {
                ocur = ocur.parentNode;
            }
        }
        if (ocur.tagName.toUpperCase() == "TD") {
            if (ocur.parentNode.rowIndex > 0) {
                //alert("first focus")
                //lostfocusTD = null
                //2004-04-30 ��ֹ�ӱ�񵽱�Ŀؼ��ٵ�����ʱ����
                gridobj.SetFocus(ocur, ""); //�ƶ����ݼ�
            } else if (gridobj.lostfocusTD != null && gridobj.lostfocusTD.cellIndex >= 0) {
                gridobj.SetFocus(gridobj.lostfocusTD, "");
            } else {
                gridobj.SetFocus(null, "");
            }
        } else if (gridobj.lostfocusTD != null && gridobj.lostfocusTD.cellIndex >= 0) {
            gridobj.SetFocus(gridobj.lostfocusTD, "");
        } else {
            gridobj.SetFocus(null, "");
        }
        //window.status=window.status+" ���ȡ�ý���:"
    }
}
/**
*�ҵ���һ�����н����TD
*@param irowfocus ����,��ʾ�Ҵ��еĵ�һ�����н����TD
*@date 2003-09-16
**/
webgrid.prototype.FindFirstTD = function(irowfocus) {
    //	var td1=tgrid.rows(tgrid.rows.length-1).cells(1)
    if (this.tgrid.rows.length > 1) {
        if (isSpace(irowfocus)) {
            var td1 = this.tgrid.rows[this.FixRows].cells[1];
        } else {
            var td1 = this.tgrid.rows[irowfocus].cells[1];
        }
    } else {
        var td1 = this.tgrid.rows[0].cells[1];
    }
    if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
        for (var i = 1; i < this.tgrid.rows[0].cells.length; i++) {
            //�ж��Ƿ�����������ض��п�Ϊ0
            var colwidth1 = this.tgrid.childNodes[0].childNodes[i].getAttribute("oldwidth");
            if (isSpace(colwidth1))
                colwidth1 = this.tgrid.rows[0].cells[i].offsetWidth;
            else
                colwidth1 = parseInt(colwidth1);
            if (colwidth1 > 1) {
                if (this.tgrid.children[0].children[i].getAttribute("cz") != null) {
                    var temprow = this.tgrid.rows.length - 1;
                    if (isSpace(irowfocus) == false && irowfocus < this.tgrid.rows.length) temprow = irowfocus;

                    //����һ���������Ƽ�����ʱ�����,���Ե����һ��.
                    //if(tgrid.rows.length>1){
                    td1 = this.tgrid.rows[temprow].cells[i];
                    //}else {
                    //	td1=tgrid.rows(FixRows).cells(i)
                    //}

                    //mcurCol=i
                    break;
                }
            }
        }
    }
    return td1;
}
/**
*���ý��㵽���
����ʱ��:�ڱ��ؼ��ϵ����isfocusΪ��,����TAB������ʱֱ���ô������.�Զ�����ʱҲ���������ý���
����:	 ��������ĵ�һ����ЧTD(�п�Ϊ0),������������ʾ,��curObj ��preTD mcurRow mcurCol��ֵ

*@param td Ϊ����ĳ����Ԫ,��Ϊnull
*@param sTag =��������� ��ʾ������õ�����
**/
webgrid.prototype.SetFocus = function(td, sTag) {

    //alert(td)
    if (this.ReadOnly == true || this.canselect == "��") return;
    try {
        NavJs.setClassName(this.curObj,""); //�Զ�����ʱȥԭ���Ľ���  
        this.RemoveBackColor();
    } catch (e) { }
    if (sTag != "���������") { //������ý���
        this.preTD = this.curObj;

        this.SetTDFilter();
        return;
    }

    if (td == null) {
        //������һ������
        if (this.tgrid.rows.length > 1) {
            if (this.txtMyGrid.style.display == "none") {

                //if( preTD == null ){
                this.curObj = this.FindFirstTD();
                this.preTD = this.curObj;

                //}
            }
        } else {
            this.preTD = this.tgrid.rows[0].cells[0];
            this.curObj = this.preTD;

        }

    } else {
        //moveedit(td)
        //preTD=td
        //curObj=preTD
        //	if( preTD == null ){

        //		}
        if (true || this.lostfocusTD == null || this.lostfocusTD.cellIndex == -1) {
            this.curObj = td;

        } else {
            this.curObj = this.lostfocusTD;
        }
        this.preTD = this.curObj;


    }

    //added by liuxr at 2010-11-11 10:22 ��curTD���Ը�ֵ
    this.curTD = this.curObj;
    if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
        /* ! added by liuxr at 2010-12-7 14:37 ��Row���Ը�ֵ this.curObj.parentNode.rowIndex*/
        this.Row = this.curObj.parentNode.rowIndex;
        /* ! added by liuxr at 2010-12-7 14:37 ��Col���Ը�ֵ this.curObj.cellIndex*/
        this.Col = this.curObj.cellIndex;
    }

    //mcurRow=curObj.parentNode.rowIndex
    //mcurCol=curObj.cellIndex
    //preTD.className="";
    //curObj.className="tdfilter" 

    //if(sTag=="�ƶ����ݼ�" && lostfocusTD==null ){  
    //	MoveDataSet()
    //}
    //alert("eeee")
    this.SetTDFilter();


    //��ֹ�������ĵ�Ԫ���ý�������Զ�����.
    if (this.curObj.offsetTop < parseInt(this.div1.style.height)) {
        try {
            this.curObj.focus();
        } catch (E) { }
    } else {
        //��ʱ��tgrid
        this.tgrid.focus();
    }
}
/**
*����ʧȥ���㷽��
����ʱ��:�������ؼ��ϵ����isblurΪ��,����TAB������ʱֱ���ô������.
����:    ������ĸ�����ʾ.
*@date 2003-09-15
**/
webgrid.prototype.LostFocus = function() {
    this.lostfocusTD = this.curObj;

    //����fset�е����ݵ�dataset��
    if (isSpace(this.dataset) == false) {
        var oDs = $obj(this.dataset);
        if (oDs != null && oDs.RecordCount > 0 && (oDs.bAdd || oDs.bEdit)) {
            oDs.Update('�����');
            NavJs.setClassName(this.curObj,"");
            this.txtMyGrid.style.display = "none";
        }
    }

}
/**
*���½���ǰTD��ֵ�͸��༭��,�������ó���ֱ�Ӹ��˺�˱���ֵ,��ʱҪˢ�±༭��
**/
webgrid.prototype.RefreshEdit = function() {
    this.tdTotxt();
}
/**
�ƶ����ݼ���ָ��
*@date 2004-03-19
**/
webgrid.prototype.MoveDataSet = function() {
    if (isSpace(this.dataset) == false) {
        var oDs = $obj(this.dataset);
        if (oDs.bEdit == false && oDs.bAdd == false) {
            oDs.SetPos(this.curObj.parentNode.rowIndex - 1);
        } 
    }
}
/**
*װ��һ��XML�������������
*@param sXml Ҫװ���XML����
**/
webgrid.prototype.LoadXmlData = function(sXml) {
    this.fnInit(sXml);
}
/**
*����һ��
*@param Direct =1 2 3 4 �ֱ��ʾ���ĸ�����
**/
webgrid.prototype.Scroll = function(Direct) {
    //Direct=1 2 3 4
    switch (Direct) {
        case 1:
            this.fcButton1_onclick();
            break;
        case 2:
            this.fcButton3_onclick();
            break;
        case 3:
            this.fcButton4_onclick();
            break;
        case 4:
            this.fcButton6_onclick();
            break;
    }

}
/**
//����col�еĲ�������
//���Ե�XML��
//CODE��XML����ʽ:
<code>
<sql1></sql1> //escape
<sql2></sql2> //escape
<xml></xml>
<blninput></blninput>
<blnempty></blnempty>

</code>
<str>
<maxlength></maxlength>
</str>
<int>
<max></max>
<min></min>
</int>
<double>
<max></max>
<min></min>
<pointnum></pointnum>
</double>
<date>

</date>
**/
webgrid.prototype.SetCol = function(col, sXml) {
    this.tgrid.children[0].children[col].setAttribute("cz", sXml);
}
/**
*������
*@param index �����λ��
**/
webgrid.prototype.InsertCol = function(index) {
    var o = document.createElement("COL"); //$id(this.id).
    //alert("aaa")
    o.style.width = "70px";
    var iPos = this.tgrid.childNodes[0].childNodes.length - 1;
    if (arguments.length == 1 && iPos > index)
        iPos = index;
    this.tgrid.children[0].insertBefore(o, this.tgrid.children[0].children[iPos]);
    //add TD
    for (var i = 0; i < this.tgrid.rows.length; i++) {
        this.tgrid.rows[i].insertCell[iPos];
    }

    //added by liuxr at 2011-11-30 10:58 ��������к�Colsȡֵ��׼ȷ������
    this.Cols = this.tgrid.childNodes[0].childNodes.length;
    
    this.ActionAutoScroll("H"); //���������=autoʱ�����
    this.Hscrollmax = this.getHScrollMax();
    this.fnPutHscrollmax(this.Hscrollmax);

}
/**
*������
*index�����λ��
**/
webgrid.prototype.InsertRow = function(index) {

    var iPos = this.tgrid.rows.length;
    if (arguments.length == 1 && iPos > index)
        iPos = index;

    //��EndRowStateΪ"add"
    if (this.EndRowState == "edit" && iPos == this.tgrid.rows.length) {
        this.EndRowState = "add";
    }

    //alert(iPos+"=="+tgrid.rows.length)

    var oTr = this.tgrid.insertRow(iPos);

    //added by liuxr at 2011-11-30 10:58 �����к�ı�Rows����ֵ
    this.Rows = this.tgrid.rows.length;

    //ȡ��������Ĭ���и�
    //oTr.style.height=tgrid.rows(0).offsetHeight
    var oTd;
    for (j = 0; j < this.tgrid.childNodes[0].childNodes.length; j++) {
        oTd = oTr.insertCell(j);
        var sxml = this.tgrid.children[0].children[j].getAttribute("cz");
        if (sxml != null) {
            var oXml = SetDom(sxml);
            var sType = oXml.documentElement.nodeName;
            if (sType == "checkbox") {
                oTd.style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheck.gif)";
                oTd.style.backgroundRepeat = "no-repeat";
            }
            if (sType == "checkbox_readonly") {
                oTd.style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheckdisabled.gif)";
                oTd.style.backgroundPosition = "center center";
                oTd.style.backgroundRepeat = "no-repeat";
            }
            
        }
    }
    var iFontSize = parseInt(this.tgrid.style.fontSize);
    if (isNaN(iFontSize)) iFontSize = 13;

    //-------added by liuxt at 2008-8-5 ������ʱ�����и�
    var rowHeight = -1;
    if (!IsSpace(this.bodyrowheight))
        rowHeight = this.bodyrowheight;
    if (parseInt(rowHeight, 10) > 0)
        oTr.style.height = rowHeight + "px";
    else
        oTr.style.height = (iFontSize + 8 )+ "px"; //15  //4 //tgrid.style.fontSize*4/3
    //mcurRow=iPos
    //------------------------------//
    this.ActionAutoScroll("V"); //���������=autoʱ�����
    this.Vmax = this.getVScrollMax();
    this.fnPutVscrollmax(this.Vmax);
    return oTr;
}
/**
*ɾ����
*@param index ɾ���е�λ��
*@return ��
**/
webgrid.prototype.DeleteRow = function(index) {

    var iPos = this.tgrid.rows.length - 1;

    if (arguments.length == 1 && iPos > index)
        iPos = index;

    //��EndRowStateΪ"add"
    if (this.EndRowState == "add" && iPos == this.tgrid.rows.length - 1) {
        this.EndRowState = "edit";
    }


    //�̶��в���ɾ��
    if (this.tgrid.rows.length <= this.FixRows || index < this.FixRows) return;

    this.tgrid.deleteRow(iPos);

    //added by liuxr at 2011-11-30 10:58 ɾ���к�ı�Rows����ֵ
    this.Rows = this.tgrid.rows.length;

    this.ActionAutoScroll("V"); //���������=autoʱ�����
    this.Vmax = this.getVScrollMax();
    this.fnPutVscrollmax(this.Vmax);

}
/**
* @func ����grid�к�
* @date 2009-5-15
* @author liuxr
**/
webgrid.prototype.ReCalRowNo = function(){
    if (IsSpace(this.blRowNo)) this.blRowNo = "��";
    if (this.blRowNo == "��") return;

    var baseNo = 0;
    if (isSpace(this.dataset) == false) {
        var oDs = $obj(this.dataset);
        if (oDs.PageNo > 1 && oDs.PageSize > 0) {
            baseNo = (oDs.PageNo - 1) * oDs.PageSize;
        }
    }

    var len = this.tgrid.rows.length;
    var rowNo = baseNo + 1;
    for (var i = this.FixRows; i < len; i++) {
        this.tgrid.rows[i].cells[0].innerText = rowNo;
        rowNo++;
    }

}
/**
*ɾ����
*index�����λ��
**/
webgrid.prototype.DeleteCol = function(index) {
    var iPos = this.tgrid.childNodes[0].childNodes.length - 1;
    if (arguments.length == 1 && iPos > index)
        iPos = index;
    this.tgrid.children[0].removeChild(this.tgrid.children[0].children[iPos]);
    //�̶��в���ɾ��
    if (this.tgrid.childNodes[0].childNodes.length <= this.FixCols || index <= this.FixCols) return;

    for (i = 0; i <= this.tgrid.rows.length - 1; i++) {
        this.tgrid.rows[i].deleteCell(iPos);
    }

    //added by liuxr at 2011-11-30 10:58 ���ɾ���к�Colsȡֵ��׼ȷ������
    this.Cols = this.tgrid.childNodes[0].childNodes.length;

    this.ActionAutoScroll("H"); //���������=autoʱ�����
    this.Hscrollmax = this.getHScrollMax();
    this.fnPutHscrollmax(this.Hscrollmax);
}
webgrid.prototype.fnPutvisible = function(vValue) {
    this.visible = vValue;
    if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
        try {
            //ȫ����ʾ
            var s1 = "none";
            if (IsTrue(this.visible)) s1 = "";
            for (var i = 0; i < 13; i++) {
                if (i != 1 || i != 2)
                    $id(this.id).children[i].style.display = s1;
            }
        } catch (e) { }
        if (s1 == "") {
            try {
                this.onResize();
            } catch (E) { }
        }
    }
    //visibleID.fireChange();
}
webgrid.prototype.fnPutScrollBar = function(vValue) {
    this.mScrollBar = vValue;
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer) return;
    //ScrollBarID.fireChange();
    if (IsTrue(this.visible) == false) return;
    try {
        if (vValue == "yes" || vValue == "no") {
            var s1 = "block";
            if (vValue == "no") s1 = "none";
            this.fchtcDiv1.style.display = s1;
            this.fcButton1.style.display = s1;
            this.fcButton2.style.display = s1;
            this.fcButton3.style.display = s1;

            this.fchtcDiv2.style.display = s1;
            this.fcButton4.style.display = s1;
            this.fcButton5.style.display = s1;
            this.fcButton6.style.display = s1;
            this.divconer.style.display = s1; //

        } else {	//autoģʽ
            var s1 = "block";
            if (this.Vmax <= 0) s1 = "none";
            this.fchtcDiv1.style.display = s1;
            this.fcButton1.style.display = s1;
            this.fcButton2.style.display = s1;
            this.fcButton3.style.display = s1;
            if (this.Vmax <= 0 && this.Hscrollmax <= 0) {
                this.divconer.style.display = "none";
            } else {
                this.divconer.style.display = "";
            }
            var s1 = "";
            if (this.Hscrollmax <= 0) s1 = "none";
            this.fchtcDiv2.style.display = s1;
            this.fcButton4.style.display = s1;
            this.fcButton5.style.display = s1;
            this.fcButton6.style.display = s1;


        }
    } catch (e) { }
}
webgrid.prototype.VscrollTo = function(ipos) {
    this.fnPutVscrollvalue(this.TopRow, ipos);
}
webgrid.prototype.fnPutVscrollmax = function(vVscrollvalue) {
    //if(fchtcDiv1.style.display=="none") return
    //alert(vVscrollvalue);
    var oldValue = this.TopRow;
    var l = parseInt(vVscrollvalue);

    if (isNaN(l) || l < 0)
        this.Vmax = 0;
    else
        this.Vmax = l;
    //alert(this.Vmax);
    if (this.Vmax == 0) {
        this.TopRow = 0;
        //var sHeight = this.fchtcDiv1.style.pixelHeight-this.fcButton1.style.pixelHeight-this.fcButton3.style.pixelHeight;
        var sHeight = parseInt(this.fchtcDiv1.style.height) - parseInt(this.fcButton1.style.height) - parseInt(this.fcButton3.style.height);
        //alert("0---" + sHeight);
        if (sHeight > 0)
            this.fcButton2.style.height = sHeight;
    }
    else {
        //var sHeight = this.fchtcDiv1.style.pixelHeight-this.fcButton1.style.pixelHeight-this.fcButton3.style.pixelHeight -this.Vmax*17;
        var sHeight = parseInt(this.fchtcDiv1.style.height) - parseInt(this.fcButton1.style.height) - parseInt(this.fcButton3.style.height) - this.Vmax * 17;
        //alert("1---" + sHeight);
        if (sHeight < 10) //10Ϊ��Сĸָ���
            this.fcButton2.style.height = 10;
        else
            this.fcButton2.style.height = sHeight;
        if (this.TopRow > this.Vmax)
            this.TopRow = this.Vmax;
    }
    //���Զ���������ʱ
    if (this.mScrollBar == "auto") {
        var s1 = "";
        if (this.Vmax <= 0) s1 = "none";
        this.fchtcDiv1.style.display = s1;
        this.fcButton1.style.display = s1;
        this.fcButton2.style.display = s1;
        this.fcButton3.style.display = s1;
        if (this.Vmax <= 0 && this.Hscrollmax <= 0) {
            this.divconer.style.display = "none";
        } else {
            this.divconer.style.display = "";
        }

    }
    this.fnPutVscrollvalue(oldValue, this.TopRow);
}
webgrid.prototype.fnPutVscrollvalue = function(oldValue, newValue) {
    //alert("oldValue:" + oldValue + "  newValue:" + newValue);
    if (this.fchtcDiv1.style.display == "none") return;

    this.TopRow = newValue;

    if (this.Vmax == 0) return;
    //var avar=( this.fchtcDiv1.style.pixelHeight-this.fcButton1.style.pixelHeight-this.fcButton2.style.pixelHeight - this.fcButton3.style.pixelHeight )/this.Vmax;
    var avar = (parseInt(this.fchtcDiv1.style.height) - parseInt(this.fcButton1.style.height) - parseInt(this.fcButton2.style.height) - parseInt(this.fcButton3.style.height)) / this.Vmax;
    if (newValue > 0 && parseInt(newValue) < parseInt(this.Vmax)) {
        this.fcButton2.style.top = parseInt(this.fcButton1.style.top) + parseInt(this.fcButton1.style.height) + avar * newValue;

    }
    this.Vscroll_check(oldValue, newValue);
    //Vscroll_onchange(oldValue,newValue);
}
webgrid.prototype.fcButton2_onmousedown = function() {
    var gridobj = this;
    var event = NavJs.getEvent();

    gridobj.bDrag = true;
    //alert(event.screenY);
    gridobj.curY = event.screenY;
    gridobj.fcButton2.style.cursor = "hand";
    gridobj.fcButton2.setCapture();
    //alert(event.MOUSEDOWN);
    /*if(!window.captureEvents) { 
    ?      gridobj.fcButton2.setCapture(); 
    }else { ????? 
    window.captureEvents(event.MOUSEDOWN|event.MOUSEUP); 
    } */

}
webgrid.prototype.fcButton2_onmousemoveold = function(changeHeight) {

    var gridobj = this;
    var event = NavJs.getEvent();

    //modify by liuxr at 2009-9-22 ����ڱ�����������ݺ�ֱ�������������󣬸���������ݶ�ʧ������
    if (gridobj.txtMyGrid.style.display != "none") {
        gridobj.txtMyGrid_onfocusout();
    }
    if (gridobj.Vmax == 0) return;
    //var avar=( this.fchtcDiv1.style.pixelHeight-this.fcButton1.style.pixelHeight-this.fcButton2.style.pixelHeight - this.fcButton3.style.pixelHeight )/this.Vmax;
    var avar = (parseInt(gridobj.fchtcDiv1.style.height) - parseInt(gridobj.fcButton1.style.height) - parseInt(gridobj.fcButton2.style.height) - parseInt(gridobj.fcButton3.style.height)) / gridobj.Vmax;
    if (avar == 0) return;

    if (typeof changeHeight == "undefined") changeHeight = event.screenY - gridobj.curY;
    var changeValue = Math.round(changeHeight / avar);

    //changeValue�仯ֵ
    if (changeValue != 0) {
        //2011-05-27 ���� �����ʱ�������������
        if (IsSpace(gridobj.TopRow)) gridobj.TopRow = 0;

        var oldvalue = gridobj.TopRow;
        gridobj.TopRow = gridobj.TopRow + changeValue;
        gridobj.fcButton2.style.top = (parseInt(gridobj.TopRow) * avar + parseInt(gridobj.fcButton1.style.top) + parseInt(gridobj.fcButton1.style.height))+"px";
        gridobj.Vscroll_check(oldvalue, gridobj.TopRow);
        //Vscroll_onchange(oldvalue,TopRow);

        //���µ�Yֵ
        gridobj.curY = event.screenY;
    }

}
webgrid.prototype.fcButton2_onmouseup = function() {
    //alert(1);
    var gridobj = this;
    var event = NavJs.getEvent();
    //alert(gridobj.bDrag);
    if (gridobj.bDrag)//��ʾ������mousedown
    {
        gridobj.fcButton2_onmousemoveold();
    }
    gridobj.bDrag = false;
    gridobj.fcButton2.releaseCapture();
    /*if(!window.captureEvents) { 
    ?      gridobj.fcButton2.releaseCapture(); 
    }else {????? 
    window.releaseEvents(Event.MOUSEDOWN|Event.MOUSEUP); 
    }*/

    gridobj.fcButton2.style.cursor = "default";
}
webgrid.prototype.fcButton1_onclick = function() {
    
    var gridobj = this;

    if (gridobj.Vmax == 0) return;
    //var avar=( gridobj.fchtcDiv1.style.pixelHeight-gridobj.fcButton1.style.pixelHeight-gridobj.fcButton2.style.pixelHeight - gridobj.fcButton3.style.pixelHeight )/gridobj.Vmax;
    var avar = (parseInt(gridobj.fchtcDiv1.style.height) - parseInt(gridobj.fcButton1.style.height) - parseInt(gridobj.fcButton2.style.height) - parseInt(gridobj.fcButton3.style.height)) / gridobj.Vmax;
    //avarΪ�����а�ť��Ŀհ�������Թ�����Χ
    if (gridobj.TopRow > 0) {
        gridobj.TopRow = gridobj.TopRow - 1;
        gridobj.fcButton2.style.top = (parseInt(gridobj.fcButton1.style.top) + parseInt(gridobj.fcButton1.style.height) + avar * gridobj.TopRow)+"px";
        gridobj.Vscroll_check(gridobj.TopRow + 1, gridobj.TopRow);
        //Vscroll_onchange(TopRow+1,TopRow);

    }
}
webgrid.prototype.fcButton3_onclick = function() {
    var gridobj = this;

    if (gridobj.Vmax == 0) return;
    //var avar=( gridobj.fchtcDiv1.style.pixelHeight-gridobj.fcButton1.style.pixelHeight-gridobj.fcButton2.style.pixelHeight - gridobj.fcButton3.style.pixelHeight )/gridobj.Vmax;
    var avar = (parseInt(gridobj.fchtcDiv1.style.height) - parseInt(gridobj.fcButton1.style.height) - parseInt(gridobj.fcButton2.style.height) - parseInt(gridobj.fcButton3.style.height)) / gridobj.Vmax;
    if (gridobj.TopRow < gridobj.Vmax) {
        gridobj.TopRow = gridobj.TopRow + 1;
        gridobj.fcButton2.style.top = (parseInt(gridobj.fcButton1.style.top) + parseInt(gridobj.fcButton1.style.height) + avar * gridobj.TopRow)+"px";
        gridobj.Vscroll_check(gridobj.TopRow - 1, gridobj.TopRow);
        //Vscroll_onchange(TopRow-1,TopRow);	
    }
}
webgrid.prototype.fchtcDiv1_onclick = function() {
    var gridobj = this;
    var event = NavJs.getEvent();

    //alert(event.y || event.pageY);
    gridobj.fcButton2_onmousemoveold((event.y || event.pageY) - parseInt(gridobj.fcButton2.style.top));
    /*	if (event.y -fcButton2.style.pixelTop<0){
    fcButton1_onclick();
    }else{
    fcButton3_onclick();
    }*/

}
//Խ����
webgrid.prototype.Vscroll_check = function(oldVscrollvalue, newVscrollvalue) {
    var curVscrollvalue = newVscrollvalue;
    var lngTop = parseInt(this.fcButton2.style.top);
    if (lngTop < parseInt(this.fcButton1.style.height) + parseInt(this.fcButton1.style.top) || this.TopRow <= 0) {
        lngTop = parseInt(this.fcButton1.style.height) + parseInt(this.fcButton1.style.top);
        this.TopRow = 0;
        curVscrollvalue = this.TopRow;
    }
    if (lngTop > parseInt(this.fcButton3.style.top) - parseInt(this.fcButton2.style.height) || this.TopRow >= this.Vmax) {
        lngTop = parseInt(this.fcButton3.style.top) - parseInt(this.fcButton2.style.height);
        this.TopRow = this.Vmax;
        curVscrollvalue = this.TopRow;
    }
    this.fcButton2.style.top = lngTop+"px";
    this.Vscroll_onchange(oldVscrollvalue, curVscrollvalue);
}
webgrid.prototype.fnPutHscrollmax = function(vHscrollvalue) {
    //if(fchtcDiv2.style.display=="none") return	
    var oldValue = this.Hscrollvalue;
    var l = parseInt(vHscrollvalue);
    if (isNaN(l) || l < 0)
        this.Hscrollmax = 0;
    else
        this.Hscrollmax = l;

    if (this.Hscrollmax == 0) {
        this.Hscrollvalue = 0;
        //var sWidth1 = this.fchtcDiv2.style.pixelWidth-this.fcButton4.style.pixelWidth-this.fcButton6.style.pixelWidth;
        //alert(this.fchtcDiv2.style.pixelWidth);
        var sWidth1 = parseInt(this.fchtcDiv2.style.width) - parseInt(this.fcButton4.style.width) - parseInt(this.fcButton6.style.width);
        //alert("0---" + sWidth1);
        if (sWidth1 > 0)

            this.fcButton5.style.width = (sWidth1 + 1)+"px";
    }
    else {
        //var sWidth1 = this.fchtcDiv2.style.pixelWidth-this.fcButton4.style.pixelWidth-this.fcButton6.style.pixelWidth - this.Hscrollmax*17;
        var sWidth1 = parseInt(this.fchtcDiv2.style.width) - parseInt(this.fcButton4.style.width) - parseInt(this.fcButton6.style.width) - this.Hscrollmax * 17;
        //alert("1---" + sWidth1);
        if (sWidth1 < 10) //10Ϊ��Сĸָ���
            this.fcButton5.style.width = 10;
        else
            this.fcButton5.style.width = (sWidth1 + 1)+"px";
        if (this.Hscrollvalue > this.Hscrollmax)
            this.Hscrollvalue = this.Hscrollmax;
    }
    //���Զ���������ʱ
    if (this.mScrollBar == "auto") {
        var s1 = "";
        if (this.Hscrollmax <= 0) s1 = "none";
        this.fchtcDiv2.style.display = s1;
        this.fcButton4.style.display = s1;
        this.fcButton5.style.display = s1;
        this.fcButton6.style.display = s1;
        if (this.Vmax <= 0 && this.Hscrollmax <= 0) {
            this.divconer.style.display = "none";
        } else {
            this.divconer.style.display = "";
        }

    }

    this.fnPutHscrollvalue(oldValue, this.Hscrollvalue);
}
webgrid.prototype.fnPutHscrollvalue = function(oldValue, newValue) {
    if (this.fchtcDiv2.style.display == "none") return;

    this.Hscrollvalue = newValue;
    if (this.Hscrollmax == 0) return;
    //var avar=(this.fchtcDiv2.style.pixelWidth-this.fcButton4.style.pixelWidth-this.fcButton5.style.pixelWidth -this.fcButton6.style.pixelWidth )/this.Hscrollmax;
    var avar = (parseInt(this.fchtcDiv2.style.width) - parseInt(this.fcButton4.style.width) - parseInt(this.fcButton5.style.width) - parseInt(this.fcButton6.style.width)) / this.Hscrollmax;
    if (newValue > 0 && parseInt(newValue) < parseInt(this.Hscrollmax)) {
        this.fcButton5.style.left = parseInt(this.fcButton4.style.left) + parseInt(this.fcButton4.style.width) + avar * newValue;

    }
    this.Hscroll_check(oldValue, newValue);
    //Hscroll_onchange(oldValue,newValue);
}
webgrid.prototype.fcButton5_onmousedown = function() {
    var gridobj = this;
    var event = NavJs.getEvent();

    gridobj.fcButton5.style.cursor = "hand";
    gridobj.bHDrag = true;
    gridobj.curX = event.screenX;
    gridobj.fcButton5.setCapture();
}
webgrid.prototype.fcButton5_onmousemoveold = function(changeWidth) {


    //modify by liuxr at 2009-9-22 ����ڱ�����������ݺ�ֱ�������������󣬸���������ݶ�ʧ������
    if (this.txtMyGrid.style.display != "none") {
        this.txtMyGrid_onfocusout()
    }

    if (this.Hscrollmax == 0) return;
    //var avar=(this.fchtcDiv2.style.pixelWidth-this.fcButton4.style.pixelWidth-this.fcButton5.style.pixelWidth -this.fcButton6.style.pixelWidth )/this.Hscrollmax;
    var avar = (parseInt(this.fchtcDiv2.style.width) - parseInt(this.fcButton4.style.width) - parseInt(this.fcButton5.style.width) - parseInt(this.fcButton6.style.width)) / this.Hscrollmax;
    if (avar == 0) return;
    if (typeof changeWidth == "undefined") changeWidth = event.screenX-this.curX;
    var changeValue = Math.round(changeWidth / avar);
    if (changeValue != 0) {
        var oldValue = this.Hscrollvalue;
        this.Hscrollvalue = this.Hscrollvalue + changeValue;
        this.fcButton5.style.left = this.Hscrollvalue * avar + parseInt(this.fcButton4.style.left) + parseInt(this.fcButton4.style.width);
        this.Hscroll_check(oldValue, this.Hscrollvalue);
        //Hscroll_onchange(oldValue,Hscrollvalue);

    }
}
webgrid.prototype.fcButton5_onmouseup = function() {
    var gridobj = this;

    if (gridobj.bHDrag) {
        gridobj.fcButton5_onmousemoveold();
    }
    gridobj.bHDrag = false;
    gridobj.fcButton5.releaseCapture();
    gridobj.fcButton5.style.cursor = "default";
}

webgrid.prototype.fcButton4_onclick = function() {
    var gridobj = this;

    if (gridobj.Hscrollmax == 0) return;
    //var avar =(gridobj.fchtcDiv2.style.pixelWidth-gridobj.fcButton4.style.pixelWidth-gridobj.fcButton5.style.pixelWidth -gridobj.fcButton6.style.pixelWidth )/gridobj.Hscrollmax;
    var avar = (parseInt(gridobj.fchtcDiv2.style.width) - parseInt(gridobj.fcButton4.style.width) - parseInt(gridobj.fcButton5.style.width) - parseInt(gridobj.fcButton6.style.width)) / gridobj.Hscrollmax;
    if (gridobj.Hscrollvalue > 0) {
        gridobj.Hscrollvalue = gridobj.Hscrollvalue - 1;
        gridobj.fcButton5.style.left = parseInt(gridobj.fcButton4.style.left) + parseInt(gridobj.fcButton4.style.width) + avar * gridobj.Hscrollvalue;
        gridobj.Hscroll_check(gridobj.Hscrollvalue + 1, gridobj.Hscrollvalue);
        //Hscroll_onchange(Hscrollvalue+1,Hscrollvalue);
    }
}
webgrid.prototype.fcButton6_onclick = function() {
    var gridobj = this;

    if (gridobj.Hscrollmax == 0) return;
    //var avar=(gridobj.fchtcDiv2.style.pixelWidth-gridobj.fcButton4.style.pixelWidth-gridobj.fcButton5.style.pixelWidth -gridobj.fcButton6.style.pixelWidth )/gridobj.Hscrollmax;
    var avar = (parseInt(gridobj.fchtcDiv2.style.width) - parseInt(gridobj.fcButton4.style.width) - parseInt(gridobj.fcButton5.style.width) - parseInt(gridobj.fcButton6.style.width)) / gridobj.Hscrollmax;
    if (gridobj.Hscrollvalue < gridobj.Hscrollmax) {
        gridobj.Hscrollvalue = gridobj.Hscrollvalue + 1;
        gridobj.fcButton5.style.left = parseInt(gridobj.fcButton4.style.left) + parseInt(gridobj.fcButton4.style.width) + avar * gridobj.Hscrollvalue;
        gridobj.Hscroll_check(gridobj.Hscrollvalue - 1, gridobj.Hscrollvalue);
        //Hscroll_onchange(Hscrollvalue-1,Hscrollvalue);
    }
}
webgrid.prototype.fchtcDiv2_onclick = function() {
    var gridobj = this;
    var event = NavJs.getEvent();

    gridobj.fcButton5_onmousemoveold((event.x || event.pageX) - parseInt(gridobj.fcButton5.style.left));

}
webgrid.prototype.Hscroll_check = function(oldHscrollvalue, newHscrollvalue) {
    var curHscrollvalue = newHscrollvalue;
    var lngLeft = parseInt(this.fcButton5.style.left);
    if (lngLeft < parseInt(this.fcButton4.style.width) + parseInt(this.fcButton4.style.left) || this.Hscrollvalue <= 0) {
        lngLeft = parseInt(this.fcButton4.style.width) + parseInt(this.fcButton4.style.left);
        this.Hscrollvalue = 0;
        curHscrollvalue = this.Hscrollvalue;
    }
    if (lngLeft > parseInt(this.fcButton6.style.left) - parseInt(this.fcButton5.style.width) || this.Hscrollvalue >= this.Hscrollmax) {
        lngLeft = parseInt(this.fcButton6.style.left) - parseInt(this.fcButton5.style.width);
        this.Hscrollvalue = this.Hscrollmax;
        curHscrollvalue = this.Hscrollvalue;
    }
    this.fcButton5.style.left = lngLeft;
    this.Hscroll_onchange(oldHscrollvalue, curHscrollvalue);
}
webgrid.prototype.getVScrollMax = function() {
    if (this.moverflow != "hidden") return 0; //��ֹ�����иߣ�2013-08-21
    
    var lngMax = 0; //ʹ����µ����ܿ���
    var lngRowH = 0;
    //�̶��еĿ��
    var height0 = 0;
    //����̶��и�
    for (var i = 0; i < this.FixRows; i++) {//lngFixRowsΪ�̶�����
        height0 = height0 + parseInt(this.tgrid.rows[i].style.height);
    }

    for (var i = this.tgrid.rows.length - 1; i > 0; i--) {
        lngRowH = lngRowH + this.tgrid.rows[i].offsetHeight;
        //		lngRowH=lngRowH+tgrid.rows(i).style.pixelHeight
        if (lngRowH > parseInt(this.div1.style.height) - height0 - 17 || (this.tgrid.rows[i].offsetHeight == 0 && i > 1)) { //,add || tgrid.rows(i).offsetHeight == 0 ��ֹ���ݼ����Կ���,ֻ��һ��ʱ���й���.
            lngMax = i - this.FixRows + 1;
            break;
        }
    }

    return lngMax;
}
webgrid.prototype.getHScrollMax = function() {
    if (this.moverflow != "hidden") return 0;
    //ȡ�ù�����Χ
    var lngMax = 0;
    var lngRowH = 0;
    //�̶��еĿ��
    var width0 = 0;
    //����̶��и�
    for (var i = 0; i < this.FixCols; i++) {//lngFixRowsΪ�̶�����
        width0 = width0 + parseInt(this.tgrid.children[0].children[0].style.width);
    }
    for (var i = this.tgrid.children[0].children.length - 1; i > 0; i--) {
        //��ĳ�й�������,������Ϊ0
        if (parseInt(this.tgrid.children[0].children[i].style.width) == 0) {
            var s1 = this.tgrid.childNodes[0].childNodes[i].getAttribute("oldwidth");
            if (isSpace(s1) == false) {
                lngRowH = lngRowH + parseInt(s1);
            }
        }
        else {
            lngRowH = lngRowH + parseInt(this.tgrid.children[0].children[i].style.width);
        }
        if (lngRowH - width0 > parseInt(this.div1.style.width) - 17) {//17Ϊ�׸�
            //alert(lngRowH+">"+(div1.style.pixelWidth-width0-17))
            lngMax = i - this.FixCols + 1;
            break;
        }
    }

    return lngMax;
}
webgrid.prototype.Vscroll_onchange = function(oldValue, newValue) {
    //oldValue,newValue����ǰ���ֵ
    //��ֱ��������λ��tgrid.style.top=0����δ�ƶ�ʱ���div1��λ�ã�
    //ʹ��������Vscrollvalue
    //oldValue,newValueΪ����ǰ���ֵ

    if (newValue > oldValue) {
        //���¹�
        for (var i = oldValue + this.FixRows; i < newValue + this.FixRows; i++) {
            this.HideRow(i);
        }
    }
    if (newValue < oldValue) {
        //���Ϲ�
        for (var i = newValue + this.FixRows; i < oldValue + this.FixRows; i++) {
            this.ShowRow(i);
        }
        //added by liuxr at 2009-9-17 ���Ϲ���������grid���㣬������ֿհ��е����⡣
        try { this.SetFocus(1, ""); }
        catch (e) { }
    }
    this.Actmoveedit();
    this.txtMyGrid.style.display = "none";
    //onVscrollID.fire();
}
webgrid.prototype.Hscroll_onchange = function Hscroll_onchange(oldValue, newValue) {
    //	HScrollTo(oldValue,newValue)
    //��ֱ��������λ��tgrid.style.top=0����δ�ƶ�ʱ���div1��λ�ã�
    //oldValue,newValueΪ����ǰ���ֵ


    if (newValue > oldValue) {
        //���¹�
        for (var i = oldValue + this.FixCols; i < newValue + this.FixCols; i++) {
            this.HideCol(i);
        }
    }
    if (newValue < oldValue) {
        //���Ϲ�
        for (var i = newValue + this.FixCols; i < oldValue + this.FixCols; i++) {
            this.ShowCol(i);
        }
    }
    this.Actmoveedit();
    //onHscrollID.fire();

}
webgrid.prototype.LeftToCol = function(lngLeft) {
    //��offsetLeft������
    //alert("lngLeft" + lngLeft);
    var lngWidth = 0;
    for (var i = 0; i < this.tgrid.childNodes[0].childNodes.length; i++) {
        try {
            lngWidth = lngWidth + parseInt(this.tgrid.childNodes[0].childNodes[i].style.pixelWidth);
        }
        catch (e) {
            lngWidth = lngWidth + parseInt(this.tgrid.childNodes[0].childNodes[i].style.width);
        }
        // alert("lngWidth" + lngWidth);
        if (lngWidth >= lngLeft) {
            break;
        }
    }
    return i;
}
//���뱨��ģ��ģʽ:ֻ���ڵ�һ���϶�,���в�ѯ����ģʽ:�ڹ̶����Ͽ����϶�
webgrid.prototype.div1_onmousedown = function() {
    //������t_onmousedown
    //show("div1_onmousedown")
    var gridobj = this;
    var event = NavJs.getEvent();

    if (event.button != 1) return;

    var curObj = window.document.elementFromPoint(event.clientX, event.clientY);
    if (curObj == null || curObj.tagName.toUpperCase() == "A") return;
    try {
        var curObjParent = curObj.parentNode.tagName;
    }
    catch (e) { }
    if (curObj.tagName == "TD" || curObjParent == "TD") {
        var curCol = curObj.cellIndex;
        curObj = curObj.parentNode;
        var curRow = curObj.rowIndex;
        //if(curRow>0 && curCol>0 )return
    }
    else {
        return;
    }
    //������Ϊ�˷�ֹ�����ױ��У����ӱ�ĵ�ǰ�С�
    if (gridobj.curCol >= gridobj.tgrid.rows[0].cells.length)
        gridobj.curCol = gridobj.tgrid.rows[0].cells.length - 1;
    //�����п�
    if (gridobj.tgrid.rows[curRow].style.cursor == gridobj.cursorcolresize) {
        gridobj.line.style.display = "block";
        gridobj.div1.setCapture();
        gridobj.offsetValue = (event.x || event.pageX) + window.document.body.scrollLeft; //+parseInt(div1.offsetLeft)

        //added by liuxr at 2009-9-23 9:55 grid�ؼ��϶��п�ʱ����λ
        if (gridobj.ParentPos == "���") gridobj.offsetValue = gridobj.offsetValue - getAbsLeft(gridobj.div1);
        gridobj.line.style.left = gridobj.offsetValue;
        gridobj.line.style.top = gridobj.getdiv1top(); 			//parseInt(div1.offsetTop)+parseInt(tgrid.offsetTop)
        gridobj.line.style.height = gridobj.div1.offsetHeight;
        gridobj.blnAdjust = true;
        return;
    }
    else {
        gridobj.line.style.display = "none";
        gridobj.blnAdjust = false;
    }
    //�����и�
    if (gridobj.tgrid.rows[0].cells[curCol].style.cursor == gridobj.cursorrowresize) {
        gridobj.lineH.style.display = "block";
        gridobj.div1.setCapture();
        gridobj.offsetValue = (event.y || event.pageY) + window.document.body.scrollTop;

        //added by liuxr at 2009-9-23 9:55 grid�ؼ��϶��п�ʱ�����λ
        if (gridobj.ParentPos == "���") gridobj.offsetValue = gridobj.offsetValue - getAbsTop(div1) + parseInt(this.left, 10); ;

        gridobj.lineH.style.top = gridobj.offsetValue;
        gridobj.lineH.style.left = gridobj.getdiv1left(); 							//parseInt(div1.offsetLeft)+parseInt(tgrid.offsetLeft)
        gridobj.lineH.style.width = gridobj.div1.offsetWidth;
        gridobj.blnAdjustH = true;
        return;
    }
    else {
        gridobj.lineH.style.display = "none";
        gridobj.blnAdjustH = false;
    }

}
webgrid.prototype.div1_onmousemove = function() {
    
    var tmpB = false;
    var gridobj = this;
    var event = NavJs.getEvent();

    //added by liuxr at 2009-9-23 9:55 grid�ؼ��϶��п�ʱ����λ	
    var iLinePosWidth = (event.x ) + window.document.body.scrollLeft - getAbsLeft(gridobj.div1);
    var iLinePosHeight = (event.y) + window.document.body.scrollTop - getAbsTop(gridobj.div1);

    gridobj.tgrid.childNodes[0].childNodes[0].style.cursor = "default";

    if (gridobj.blnAdjust == true) {
        //modify by liuxr at 2009-9-23 10:00 ���grid�ؼ��϶��п����λ
        var iPosTmp = (event.x) + window.document.body.scrollLeft;
        if (gridobj.ParentPos == "���") iPosTmp = iLinePosWidth + parseInt(this.left, 10); // 2010-09-07 add + parseInt(mleft, 10)
        gridobj.line.style.left = iPosTmp;
    }
    else if (gridobj.blnAdjustH == true) {
        //modify by liuxr at 2009-9-23 10:00 ���grid�ؼ��϶��п����λ
        var iPosTmp = (event.y) + window.document.body.scrollTop;
        if (gridobj.ParentPos == "���") iPosTmp = iLinePosHeight;
        gridobj.lineH.style.top = iPosTmp;
    }
    else {//���������״
        //�˶���Ϊ�˷�ֹ�ڱ���м�Ҳ�ܳ����޸ı���п���иߵ���
        var curObjTmp = window.document.elementFromPoint(event.clientX, event.clientY);

        if (curObjTmp == null) return;
        try {
            var curObjParent = curObjTmp.parentNode.tagName;
        }
        catch (e) { }

        if (curObjTmp.tagName == "TD" || curObjParent == "TD") {
            var curCol = curObjTmp.cellIndex;
            curObjTmp = curObjTmp.parentNode;
            var curRow = curObjTmp.rowIndex;
        }
        else {
            return;
        }

        //------------
        if (curRow < gridobj.FixRows) {
            //���Ըı��п�
            gridobj.tgrid.rows[curRow].style.cursor = "default";
            //���ܵ����п��򷵻�
            if (gridobj.AdjustColWidth == false) return;
            //alert("test")
            for (var i = 0; i < gridobj.tgrid.rows[curRow].cells.length; i++) {
                //��ĳ����������offsetLeft offsetWidth������0
                if (gridobj.tgrid.childNodes[0].childNodes[i].style.display != "none") {
                    if (iLinePosWidth >= gridobj.tgrid.rows[curRow].cells[i].offsetLeft + gridobj.tgrid.rows[curRow].cells[i].offsetWidth - 4 && iLinePosWidth <= gridobj.tgrid.rows[curRow].cells[i].offsetLeft + gridobj.tgrid.rows[curRow].cells[i].offsetWidth + 4) {
                        //����߿�Ϊ��ʱ��ʹ��Ԫ���offsetLeftΪ1
                        if (gridobj.tgrid.style.borderLeftStyle == "none") {
                            var iTmpLeft = parseInt(gridobj.tgrid.rows[curRow].cells[i].offsetLeft) + 1;
                        }
                        else {
                            var iTmpLeft = parseInt(gridobj.tgrid.rows[curRow].cells[i].offsetLeft);
                        }

                        var offsetCol = gridobj.LeftToCol(iTmpLeft);
                        //������м������������п�
                        //alert(gridobj.tgrid.rows[curRow].cells[i].offsetWidth);

                        if (iLinePosWidth >= iTmpLeft + parseInt(gridobj.tgrid.rows[curRow].cells[i].offsetWidth)) {
                            //�������е��п�
                            var bFind = false;
                            for (var j = offsetCol + 1; j < gridobj.tgrid.rows[curRow].cells.length; j++) {
                                //if(tgrid.childNodes(0).childNodes(j).style.display!="none"){
                                var iwidth = 0;
                                try {
                                        iwidth = gridobj.tgrid.childNodes[0].childNodes[j].style.pixelWidth; 
                                }
                                catch (e) {
                                    iwidth = gridobj.tgrid.childNodes[0].childNodes[j].style.width; 
                                }

                                if (iwidth > 1) {
                                    break;
                                }
                                bFind = true;
                            }
                            if (bFind) {
                                gridobj.AdjustCol = j - 1;
                            }
                            else {	//������һ��������
                                gridobj.AdjustCol = offsetCol;
                            }
                        }
                        else
                            gridobj.AdjustCol = offsetCol;

                        gridobj.tgrid.rows[curRow].style.cursor = gridobj.cursorcolresize;
                        break;
                    }
                }
            }
            return;
        }
        //�ı��и�

        if (curCol < gridobj.FixCols) {

            gridobj.tgrid.childNodes[0].childNodes[curCol].style.cursor = "default";
            //���ܵ����и��򷵻�
            if (gridobj.AdjustRowHeight == false) return;
            //���Ըı��и�
            for (var i = 0; i < gridobj.tgrid.rows.length; i++) {
                //��ĳ����������offsetLeft offsetWidth������0
                if (gridobj.tgrid.rows[i].style.display != "none") {

                    if (iLinePosHeight >= gridobj.tgrid.rows[i].cells[0].offsetTop + gridobj.tgrid.rows[i].cells[0].offsetHeight - 2 && iLinePosHeight <= gridobj.tgrid.rows[i].cells[0].offsetTop + gridobj.tgrid.rows[i].cells[0].offsetHeight + 2) {
                        //������м������������п�
                        if (iLinePosHeight >= gridobj.tgrid.rows[i].cells[0].offsetTop + gridobj.tgrid.rows[i].cells[0].offsetHeight) {
                            //�������е��п�
                            var bFind = false;
                            for (var j = i + 1; j < gridobj.tgrid.rows.length; j++) {
                                //if(tgrid.rows(j).style.pixelHeight>1){
                                if (gridobj.tgrid.rows[j].style.display != "none") {
                                    break;
                                }
                                bFind = true;
                            }
                            if (bFind)
                                gridobj.AdjustRow = j - 1;
                            else//������һ��������
                                gridobj.AdjustRow = i;
                        }
                        else
                            gridobj.AdjustRow = i;

                        gridobj.tgrid.childNodes[0].childNodes[curCol].style.cursor = gridobj.cursorrowresize;
                        break;
                    }
                }
            }
        }
        //--------------

    }

}
webgrid.prototype.div1_onmouseup = function() {
    var gridobj = this;
    var event = NavJs.getEvent();
    if (typeof gridobj.offsetValue == "undefined") return;
    //�����п�
    if (gridobj.line.style.display == "block") {

        var lngRange = parseInt(gridobj.line.style.left) - parseInt(gridobj.offsetValue);
        var oCol = gridobj.tgrid.rows[0].cells[gridobj.AdjustCol]; // gridobj.tgrid.children[0].children[gridobj.AdjustCol];
        if (!IsSpace(oCol)) {
            try {
                var afterWidth = parseInt(oCol.style.pixelWidth) + lngRange;
            }
            catch (e) {
                var afterWidth = parseInt(oCol.style.width) + lngRange;
            }
            //alert(AdjustCol)
            if (afterWidth <= 0) {
                oCol.style.width = 0; //�����е��п�Ϊ1
            }
            else {
                oCol.style.width = afterWidth;

            }
        }
        //�޸ı��Ŀ��
        this.ResizeDiv();
        //if (this.autosize) {
        //    gridobj.div1.style.width = gridobj.tgrid.offsetWidth;
        //    gridobj.div1.style.height = gridobj.tgrid.offsetHeight;
        //}
        gridobj.blnChange = true;
        //gridobj.AdjustCol = 0;
        gridobj.offsetValue = 0;
        gridobj.tgrid.style.cursor = "default";
        gridobj.line.style.display = "none";
        gridobj.div1.releaseCapture();
        gridobj.blnAdjust = false;

        gridobj.ActionAutoScroll("H"); //���������=autoʱ�����
        gridobj.Hscrollmax = gridobj.getHScrollMax();
        gridobj.fnPutHscrollmax(gridobj.Hscrollmax);

        gridobj.hide();
        return;
    }
    //�и�
    if (gridobj.lineH.style.display == "block" && gridobj.offsetValue != 0) {
        if (gridobj.bCell)
            DelAllGraphTag();

        var lngRange = parseInt(gridobj.lineH.style.top) - parseInt(gridobj.offsetValue);
        try {
            var afterWidth = parseInt(gridobj.tgrid.rows[gridobj.AdjustRow].style.pixelHeight) + lngRange;
        }
        catch (e) {
            var afterWidth = parseInt(gridobj.tgrid.rows[gridobj.AdjustRow].style.height) + lngRange;
        }
        if (afterWidth <= 0) {
            //�϶�����ʱ
            gridobj.tgrid.rows[gridobj.AdjustRow].style.height = 0; //�����е��п�Ϊ1

        }
        else {
            if (gridobj.tgrid.rows[gridobj.AdjustRow].style.display == "none") {
                gridobj.tgrid.rows[gridobj.AdjustRow].style.display = "block";
            }
            gridobj.tgrid.rows[gridobj.AdjustRow].style.height = afterWidth;
        }
        //�޸�div���ĸ߶�
        if (gridobj.autosize)
            gridobj.div1.style.height = gridobj.tgrid.offsetHeight;

        //-------------
        gridobj.blnChange = true;
        //gridobj.AdjustRow = 0;
        gridobj.offsetValue = 0;
        gridobj.tgrid.style.cursor = "default";
        gridobj.lineH.style.display = "none";
        gridobj.div1.releaseCapture();
        gridobj.blnAdjustH = false;

        gridobj.ActionAutoScroll("V"); //���������=autoʱ�����
        gridobj.Vmax = gridobj.getVScrollMax();
        gridobj.fnPutVscrollmax(gridobj.Vmax);

        gridobj.hide();
        //onAdjustRowID.fire();
        return;
    }

}
webgrid.prototype.line_onmousemove = function() {
    //��ֱ��
    this.line.style.left = parseInt(this.line.style.left) + 2;
}
webgrid.prototype.lineH_onmousemove = function() {//ˮƽ��
    this.lineH.style.top = parseInt(this.lineH.style.top) + 2;

}
/**
*ȡ������ڿؼ���λ��
**/
webgrid.prototype.getdiv1top = function() {
    var div1top = getAbsTop(this.div1);

    if (this.ParentPos == "���") {
        div1top = parseInt(this.div1.style.top);
    }
    return div1top;

}
webgrid.prototype.getdiv1left = function() {
    var div1left = getAbsLeft(this.div1);

    if (this.ParentPos == "���") {
        div1left = parseInt(this.div1.style.left);
    }
    return div1left;
}
/**
*���������ŵ�div������
**/
webgrid.prototype.setBottomPosition = function() {
    //����Ķ�λ�������ҳǩ�ؼ���Ҫ��div1.style.pixelLeft ,�������Զ�λģʽ�������getAbsLeft(div1)
    var div1left = this.getdiv1left();
    var div1top = this.getdiv1top();
    
    
    //alert(div1top+ ":" + div1.style.pixelTop)
    var div1width = parseInt(this.div1.style.width); //this.div1.style.pixelWidth ;this.div1.offsetWidth;
    var div1height = parseInt(this.div1.style.height); //this.div1.style.pixelHeight ;this.div1.offsetHeight;
    // alert("width:"+div1width)
    //��ֱ��������λ��

    this.fchtcDiv1.style.left = div1left + div1width - 1; //-17//17�������Ŀ��
    this.fcButton1.style.left = parseInt(this.fchtcDiv1.style.left);
    this.fcButton2.style.left = parseInt(this.fchtcDiv1.style.left);
    this.fcButton3.style.left = parseInt(this.fchtcDiv1.style.left);

    this.fchtcDiv1.style.top = div1top;
    this.fcButton1.style.top = parseInt(this.fchtcDiv1.style.top);
    this.fcButton2.style.top = parseInt(this.fchtcDiv1.style.top) + 17;
    if (this.divconer.style.display == "none")
        this.fchtcDiv1.style.height = div1height; //+16;
    else
        this.fchtcDiv1.style.height = Math.abs(div1height - 1);
    this.fcButton3.style.top = parseInt(this.fchtcDiv1.style.top) + parseInt(this.fchtcDiv1.style.height) - 14;


    //ˮƽ��������λ��
    var lngSW = (div1width - 4 * 17) / 2;
    this.fchtcDiv2.style.top = div1top + div1height - 1; //-17
    this.fcButton4.style.top = parseInt(this.fchtcDiv2.style.top);
    this.fcButton5.style.top = parseInt(this.fchtcDiv2.style.top);
    this.fcButton6.style.top = parseInt(this.fchtcDiv2.style.top);

    this.fchtcDiv2.style.left = div1left;
    this.fcButton4.style.left = parseInt(this.fchtcDiv2.style.left);
    this.fcButton5.style.left = parseInt(this.fchtcDiv2.style.left) + 17;
    if (this.divconer.style.display == "none")
        this.fchtcDiv2.style.width = parseInt(this.div1.style.width);  //+16
    else
        this.fchtcDiv2.style.width = Math.abs(parseInt(this.div1.style.width) - 1);  //-17
    this.fcButton6.style.left = parseInt(this.fchtcDiv2.style.left) + parseInt(this.fchtcDiv2.style.width) - 14;


    //�Ͷ��ұߵ��ڸǿ�
    this.divconer.style.left = parseInt(this.fchtcDiv1.style.left);
    this.divconer.style.top = parseInt(this.fchtcDiv2.style.top);
    this.divconer.style.width = "14px";
    this.divconer.style.height = "14px";

}
/**
* added by liuxr at 2009-5-14 �����и�
* @func �����ʼ��Ϊ�̶��и�
**/
webgrid.prototype.ReCalRowHeight = function() {
    var intFixRows = this.tgrid.getAttribute("fixrows");
    if (intFixRows != null)
        intFixRows = parseInt(intFixRows, 10);
    else
        intFixRows = this.FixRows;        //modify by liuxr at 2010-4-13 	��������

    var len = this.tgrid.rows.length;
    //alert("fixrows:" + intFixRows + " rows:" + len);
    for (var i = intFixRows; i < len; i++) {
        //alert(tgrid.rows(i).style.height + "---" + tgrid.rows(i).offsetHeight);
        this.tgrid.rows[i].style.height = this.tgrid.rows[i].offsetHeight;
    }
}
/**
* @func:�϶����������ʱ��TD��Ҳ�������أ���Ϊֻ����Col��ʱ�����Ļ���п�ı�
* @Date��2011-12-05 10:06  liuxr
**/
webgrid.prototype.SetTDAtt = function(lngCol, val) {
    var intFixRows = this.tgrid.getAttribute("fixrows");
    if (intFixRows != null)
        intFixRows = parseInt(intFixRows, 10);
    else
        intFixRows = this.FixRows;        //modify by liuxr at 2010-4-13 	��������

    for (var i = intFixRows; i < this.tgrid.rows.length; i++) {
        this.tgrid.rows[i].cells[lngCol].style.visibility = val;
        this.tgrid.rows[i].cells[lngCol].style.width = this.tgrid.childNodes.item(0).childNodes.item(lngCol).style.width;
        if (val == "hidden") {
            this.tgrid.rows[i].cells[lngCol].style.whiteSpace = "nowrap";
            this.tgrid.rows[i].cells[lngCol].style.wordBreak = "keep-all";
        }
        else {
            this.tgrid.rows[i].cells[lngCol].style.whiteSpace = "normal";
            this.tgrid.rows[i].cells[lngCol].style.wordBreak = "normal";
        }
    }
}
/**
//������
**/
webgrid.prototype.HideCol = function(lngCol) {
    this.tgrid.childNodes[0].childNodes[lngCol].setAttribute("oldwidth", parseInt(this.tgrid.childNodes[0].childNodes[lngCol].style.width));

    //if (navigator.userAgent.indexOf("MSIE")<0)
    NavJs.setClassName(this.tgrid.childNodes[0].childNodes[lngCol], "fc_hidden_col_ie");
    //else //if (navigator.userAgent.indexOf("MSIE")>=0)
    //this.tgrid.childNodes.item(0).childNodes.item(lngCol).className = "fc_hidden_col_ie";


    this.tgrid.childNodes[0].childNodes[lngCol].style.width = "0px";
    //this.tgrid.childNodes.item(0).childNodes.item(lngCol).style.visibility = "collapse";
    //alert(this.tgrid.childNodes.item(0).childNodes.item(lngCol).className);
    this.SetTDAtt(lngCol, "hidden");
}
/**
//��ʾ��
**/
webgrid.prototype.ShowCol = function(lngCol) {
    NavJs.setClassName(this.tgrid.childNodes[0].childNodes[lngCol], "");

    this.tgrid.childNodes[0].childNodes[lngCol].style.width = this.tgrid.childNodes[0].childNodes[lngCol].getAttribute("oldwidth");
    this.SetTDAtt(lngCol, "visible");
}
/**
//������
**/
webgrid.prototype.HideRow = function(lngRow) {
    //alert(this.tgrid.rows[lngRow].className);
    NavJs.setClassName(this.tgrid.rows[lngRow], "fc_hidden_tr");
}
/**
//��ʾ��
**/
webgrid.prototype.ShowRow = function(lngRow) {
    NavJs.setClassName(this.tgrid.rows[lngRow], "fc_show_tr");
}
/**
*����TD��Filter
**/
webgrid.prototype.SetTDFilter = function() {
    this.preTD.style.backgroundColor = ""; //preTD.bakBgColor;
    this.preTD.style.color = ""; //preTD.bakColor;

    this.RemoveBackColor(this.preTD);
    if (this.curObj.cellIndex == -1) {
        return;
    }
    this.AddBackColor();
    //alert(curObj.offsetHeight);

    //added by liuxr at 2010-12-7 9:37 ���Ӷ����Ƿ�Ϊnull���ж�,����IE8�³��ֽű�����
    if (this.curObj.parentNode == null || typeof this.curObj.parentNode == "undefined") return;
    if (this.curObj.parentNode.rowIndex > 0) {
        this.curObj.style.backgroundColor = "#0000cd";
        this.curObj.style.color = "#ffffff";
    } 
}
/**
*���༭���ƶ�����ǰtd��Ԫ��(��setTD)�Ĺ��̣�
*��ֵ���̣���td��Ԫ���е�ֵ�����༭���ϣ���������ֵ�����༭����
**/
webgrid.prototype.moveedit = function(setTD) {
    //if(typeof curObj=="undefined") return
    if (arguments.length > 0) {
        this.curObj = setTD;
        //added by liuxr at 2010-11-11 10:22 ��curTD���Ը�ֵ
        this.curTD = this.curObj;
        if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
            /* ! added by liuxr at 2010-12-7 14:37 ��Row���Ը�ֵ this.curObj.parentNode.rowIndex*/
            this.Row = this.curObj.parentNode.rowIndex;
            /* ! added by liuxr at 2010-12-7 14:37 ��Col���Ը�ֵ this.curObj.cellIndex*/
            this.Col = this.curObj.cellIndex;
        }
    }
    //���������е�&&��Ϊ|| 2003-06-27 modify
    if (this.curObj.parentNode.rowIndex == 0 || this.curObj.cellIndex <= 0) return;
    //�жϵ�ǰ��,���ֻ��
    var sReadOnly = this.tgrid.children[0].children[this.curObj.cellIndex].getAttribute("cz");
    if (sReadOnly == null || sReadOnly == "") {
        return;
    }

    var oXml = SetDom(sReadOnly);
    var sType = oXml.documentElement.nodeName;
    //debugger;
    if (sType == "code") {

        //var czFcobj = new dropdownlist('czFc_' + this.id);
        //czFcobj.fnInit();
        var czFcobj = this.cz;
        czFcobj.ParentPos = this.ParentPos;

        if (this.ParentPos == "���") {
            czFcobj.left = this.curObj.offsetLeft + this.tgrid.offsetLeft + this.div1.offsetLeft + 1;
            czFcobj.top = this.curObj.offsetTop + this.tgrid.offsetTop + this.div1.offsetTop + 1;

        } else {
            czFcobj.left = getAbsLeft(this.curObj); //+3; //curObj.offsetLeft+tgrid.offsetLeft+div1.offsetLeft+1;
            czFcobj.top = getAbsTop(this.curObj); //+3; //curObj.offsetTop+tgrid.offsetTop+div1.offsetTop+1;
            //alert(this.cz.left);

        }

        czFcobj.height = this.curObj.offsetHeight + 1; //-2
        czFcobj.width = this.curObj.offsetWidth + 1; //-2
        czFcobj.fnInitstyle();

        //-��ֹ��һ��������ֲ�ͬ������Դ����ʱ����
        czFcobj.sql1 = "";
        czFcobj.sql2 = "";
        czFcobj.xml = "";
        this.ponclickopen = "";
        this.ponselchange = "";
        this.poninterchange = "";
        this.ponchange = "";
        this.ponkeydown = "";
        this.ponclick = "";
        for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
            switch (oXml.documentElement.childNodes[i].tagName) {
                case "sql1": czFcobj.sql1 = UnRepXml(NavJs.textContent(oXml.documentElement.childNodes[i])); break;
                case "sql2": czFcobj.sql2 = UnRepXml(NavJs.textContent(oXml.documentElement.childNodes[i])); break;
                case "xml":
                    //modify by liuxr at 2010-11-15 11:10 .xml�����ڷ�IE��������²���ʹ�ã���NavJs.xml(node) �����������������
                    //var s = oXml.documentElement.childNodes[i].xml;
                    var s = NavJs.xml(oXml.documentElement.childNodes[i]);
                    s = s.substring(5, s.length - 6);
                    czFcobj.xml = s;
                    break;
                case "format":
                    czFcobj.format = UnRepXml(RepStr(NavJs.textContent(oXml.documentElement.childNodes[i]), "&nbsp;", " "));
                    break;
                case "blninput":
                    czFcobj.blninput = NavJs.textContent(oXml.documentElement.childNodes[i]);
                    break;
                case "blnempty":
                    czFcobj.blnempty = NavJs.textContent(oXml.documentElement.childNodes[i]);
                    break;
                case "keycol":
                    czFcobj.keycol = parseInt(NavJs.textContent(oXml.documentElement.childNodes[i]));
                    break;
                case "onclickopen":
//                    if (typeof this.cz.detachEvent == "object") {
//                        this.cz.detachEvent("onclickopen", this.onclickopenEvent);
//                    }
//                    else {
//                        this.cz.removeEventListener("clickopen", this.onclickopenEvent, false);
//                    }
//                    this.ponclickopen = NavJs.textContent(oXml.documentElement.childNodes[i]);
                    this.cz.setAttribute("onclickopen", NavJs.textContent(oXml.documentElement.childNodes[i]));
                    break;  //NavJs.addEvent(this.cz,"onclickopen",this.onclickopenEvent); break;
                case "onselchange":
//                    if (typeof this.cz.detachEvent == "object") {
//                        this.cz.detachEvent("onselchange", this.onselchangeEvent);
//                    }
//                    else {
//                        this.cz.removeEventListener("selchange", this.onselchangeEvent, false);
//                    }
//                    this.ponselchange = NavJs.textContent(oXml.documentElement.childNodes[i]);
                    this.cz.setAttribute("onselchange", NavJs.textContent(oXml.documentElement.childNodes[i]));
                    break; //NavJs.addEvent(this.cz,"onselchange",this.onselchangeEvent); break;
                case "oninterchange":
//                    if (typeof this.cz.detachEvent == "object") {
//                        this.cz.detachEvent("oninterchange", this.oninterchangeEvent);
//                    }
//                    else {
//                        this.cz.removeEventListener("interchange", this.oninterchangeEvent, false);
//                    }
//                    this.poninterchange = NavJs.textContent(oXml.documentElement.childNodes[i]);
                    this.cz.setAttribute("oninterchange", NavJs.textContent(oXml.documentElement.childNodes[i]));
                    break;             
                case "onchange":
                    //this.ponchange = NavJs.textContent(oXml.documentElement.childNodes[i]);
                    this.cz.setAttribute("onchangeCz", NavJs.textContent(oXml.documentElement.childNodes[i]));
                    break; //NavJs.addEvent(this.cz,"onchange",this.onchangeEvent); break;
                case "onkeydown":
//                    if (typeof this.cz.detachEvent == "object") {
//                        this.cz.detachEvent("onkeydown", this.onkeydownEvent);
//                    }
//                    else {
//                        this.cz.removeEventListener("keydown", this.onkeydownEvent, false);
//                    }
//                    this.ponkeydown = NavJs.textContent(oXml.documentElement.childNodes[i]);
//                    this.cz.setAttribute("onkeydown", this.ponkeydown);
                    this.cz.setAttribute("onkeydownCz", NavJs.textContent(oXml.documentElement.childNodes[i]));
                    break; //NavJs.addEvent(this.cz,"onkeydown",this.onkeydownEvent); break;
                case "onclick":
//                    if (typeof this.cz.detachEvent == "object") {
//                        this.cz.detachEvent("onclick", this.onclickEvent);
//                    }
//                    else {
//                        this.cz.removeEventListener("click", this.onclickEvent, false);
//                    }
//                    this.ponclick = NavJs.textContent(oXml.documentElement.childNodes[i]);
                    this.cz.setAttribute("onclickCz", NavJs.textContent(oXml.documentElement.childNodes[i]));
                    break; //NavJs.addEvent(this.cz,"onclick",this.onclickEvent); break;
                case "fieldnamelist":
                    this.cz.FieldNameList = UnRepXml(NavJs.textContent(oXml.documentElement.childNodes[i]));
                    break;
                case "isShowTree": this.cz.isShowTree = UnRepXml(NavJs.getNodeValue1(oXml, i)); break;
                case "isTreeNewSql": this.cz.isTreeNewSql = UnRepXml(NavJs.getNodeValue1(oXml, i)); break;

            }
        }

        //var ssss = getAbsTop(div1);
        $id(this.cz.id).style.display = "block";
        //var ssss = getAbsTop(div1);
        //alert(getAbsTop(div1))
        //czFc.onfocus();
        //modify by liuxr at 2010-11-23 9:40 ��czFc��ֵ����fnPutvalue����
        //this.cz.value = this.curObj.innerText;
        czFcobj.fnPutvalue(this.curObj.innerText);

        return;

    } else if (sType == "checkbox") {
        return;
    }

    //-------------------
    //this.mbIngrid = true;


    this.txtMyGrid.style.zIndex = 10;
    this.txtMyGrid.style.display = "block";

    try {
        this.txtMyGrid.style.left = this.curObj.offsetLeft + this.tgrid.offsetLeft; //+1
        this.txtMyGrid.style.top = this.curObj.offsetTop + this.tgrid.offsetTop; //+1
        this.txtMyGrid.style.height = this.tgrid.rows[this.curObj.parentNode.rowIndex].offsetHeight; //tgrid.rows(curObj.parentNode.rowIndex).style.pixelHeight ; //curObj.offsetHeight //-2

        this.txtMyGrid.style.width = this.curObj.offsetWidth; //parseInt(this.tgrid.childNodes[0].childNodes[this.curObj.cellIndex].offsetWidth) ;//curObj.offsetWidth //-2
    }
    catch (e) { }
    //alert(this.txtMyGrid.style.width);
    //��õ�ǰ���������
    //��ǰTD����ȡ����

    if (isSpace(this.curObj.style.fontSize)) {
        var iFontSize = parseInt(this.tgrid.style.fontSize);
        if (isNaN(iFontSize) == false) this.txtMyGrid.style.fontSize = iFontSize + 1;  //+1��Ϊ��ʹ��ʾЧ������
        this.txtMyGrid.style.fontWeight = this.tgrid.style.fontWeight;
        this.txtMyGrid.style.fontStyle = this.tgrid.style.fontStyle;
        this.txtMyGrid.style.textDecorationUnderline = this.tgrid.style.textDecorationUnderline;
        this.txtMyGrid.style.fontFamily = this.tgrid.style.fontFamily;
    } else {
        this.txtMyGrid.style.fontFamily = this.curObj.style.fontFamily;
        this.txtMyGrid.style.fontSize = this.curObj.style.fontSize;
        this.txtMyGrid.style.fontWeight = this.curObj.style.fontWeight;
        this.txtMyGrid.style.fontStyle = this.curObj.style.fontStyle;
        this.txtMyGrid.style.textDecorationUnderline = this.curObj.style.textDecorationUnderline;
    }
    //��ǰTD�Ķ��뷽ʽΪ������COLԪ�صĶ��뷽ʽ
    if (isSpace(this.curObj.align)) {
        //alert(tgrid.childNodes(0).outerHTML)
        this.txtMyGrid.style.textAlign = this.tgrid.childNodes[0].childNodes[this.curObj.cellIndex].align;
    }
    else {
        this.txtMyGrid.style.textAlign = this.curObj.align;
    }


    this.tdTotxt();
    window.setTimeout("try {txtMyGrid.focus()} catch (e){};", 10);

    //window.setTimeout("try {"+uniqueID+".children[0].children[2].focus()} catch (e){};", 10);
}
//webgrid.prototype.onclickopenEvent = function() {
//    if (isSpace(this.ponclickopen) == false)
//        eval(this.ponclickopen);
//}
//webgrid.prototype.onselchangeEvent = function() {
//    //alert("onselchangeEvent");
//    if (isSpace(this.ponselchange) == false)
//        eval(this.ponselchange);
//}
//webgrid.prototype.oninterchangeEvent = function() {
//    if (isSpace(this.poninterchange) == false)
//        eval(this.poninterchange);
//}
//webgrid.prototype.onchangeEvent = function() {
//    if (isSpace(this.ponchange) == false)
//        eval(this.ponchange);
//}
//webgrid.prototype.onkeydownEvent = function() {
//    if (isSpace(this.ponkeydown) == false)
//        eval(this.ponkeydown);
//}
//webgrid.prototype.onclickEvent = function() {
//    if (isSpace(this.ponclick) == false)
//        eval(this.ponclick);
//}
/**
*�˺����ڱ���������������һس���ʱ����
*@param sUp ="�����ƶ�" ��ʾ�������·�����������ƶ���,��ʱ��������������
**/
webgrid.prototype.tgrid_onclick = function(curObj1, sUp) {

    try { //�³�����ӵ�try, 2010-06-03 16:47 ������ add ������grid�ϵ����¼�ѡ����ʱ�Ὣ���ڸ��Ƶ���ĵ�Ԫ����.
        var ctn = "txtname";
        var oDate = document.getElementById("div_dtTable_" + ctn);
        if (oDate != null) {
            if (oDate.style.visibility != "hidden") {
                oDate.innerHTML = "";
                oDate.style.visibility = "hidden";
                _g_dt2_ShowingDTPicker = null;

            }
        }
    }
    catch (ee) { }

    var d = new Date();
    var t = d.getTime();
    //alert(curObj.cellIndex)

    var event = NavJs.getEvent();
    var ooEvent = event.srcElement || event.target;
    var tmpB = false;
    var gridobj = this;

    if (gridobj.ReadOnly || gridobj.canselect == "��")
        return;
    //if(pubFirstClickTab=="������ȡ�ý���") return
    if (ooEvent.tagName.toUpperCase() == "A") {
        if (ooEvent.parentNode.tagName == "TD") {
            ooEvent = ooEvent.parentNode;
        }
    }


    if (arguments.length == 0 || typeof curObj1.tagName == "undefined") {//���

        if (ooEvent.tagName != 'TD') return;

        if (ooEvent.parentNode.rowIndex < gridobj.FixRows && gridobj.tgrid.rows[ooEvent.parentNode.rowIndex].style.cursor == "default") gridobj.ClickHeader(ooEvent.cellIndex);

        //�ڹ̶�������
        if (ooEvent.parentNode.rowIndex < gridobj.FixRows || ooEvent.cellIndex < gridobj.FixCols) return;
        var strCZ = gridobj.tgrid.childNodes[0].childNodes[ooEvent.cellIndex].getAttribute("cz");

        if (gridobj.tgrid.childNodes[0].childNodes[ooEvent.cellIndex].getAttribute("cz") == "<checkbox_readonly></checkbox_readonly>" || gridobj.tgrid.childNodes[0].childNodes[ooEvent.cellIndex].getAttribute("cz") == "<checkbox_readonly/>") return;
        if (strCZ == "<checkbox></checkbox>" || strCZ == "<checkbox/>") {
            //checkboxֱ���ύ�����ݼ�
            //alert(ooEvent.style.backgroundImage)
            //if(ooEvent.style.backgroundImage == "url("+fcpubdata.path+"/fceform/images/ef_run_grid_checked.gif)" ) {
            if (ooEvent.style.backgroundImage.indexOf("/fceform/images/ef_run_grid_checked.gif") > 0) {
                ooEvent.style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheck.gif)";
                ooEvent.style.backgroundPosition = "center center";
                //if(Act_onDataChange("ǿ�з������ݸı��¼�","��","��") == false) return
                checkbox_update_ds(gridobj, ooEvent.cellIndex, ooEvent.parentNode.rowIndex - gridobj.FixRows, "��");
                return;
            } else if (ooEvent.style.backgroundImage.indexOf("/fceform/images/ef_run_grid_uncheck.gif") > 0) {
                ooEvent.style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checked.gif)";
                ooEvent.style.backgroundPosition = "center center";
                //if(Act_onDataChange("ǿ�з������ݸı��¼�","��","��") == false) return
                checkbox_update_ds(gridobj, ooEvent.cellIndex, ooEvent.parentNode.rowIndex - gridobj.FixRows, "��");
                return;
            }
        }

        //�����Ƿ���Ӧȡ��
        //if (actcellchange(event.srcElement)==false) return
        //alert(curObj.parentNode.rowIndex+"=="+event.srcElement.parentNode.rowIndex+" &&"+ event.srcElement.cellIndex+"=="+curObj.cellIndex)
        //if(curObj.parentNode.rowIndex==event.srcElement.parentNode.rowIndex && event.srcElement.cellIndex==curObj.cellIndex ){

        if (gridobj.curObj == ooEvent) {
            //��ֱ�ӵ��Ĭ�ϵĵ�һ��ʱ,��Ҫǿ�з���һ��onCellChange�¼�, 2012-04-19 my add 
            if (gridobj.curObj.cellIndex == 1) {
                if (gridobj.actcellchange(ooEvent) == false) return;
            }
            gridobj.moveedit();
            return;
        } else {
            //�����Ƿ���Ӧȡ��
            if (gridobj.actcellchange(ooEvent) == false) {
                return;
            }

            gridobj.preTD = gridobj.curObj;
            gridobj.curObj = ooEvent;
            //added by liuxr at 2010-11-11 10:22 ��curTD���Ը�ֵ
            gridobj.curTD = gridobj.curObj;

        }
    } else {//����

        if (curObj1.tagName != 'TD') return;
        //�ڹ̶�������
        if (curObj1.parentNode.rowIndex < gridobj.FixRows || curObj1.cellIndex < gridobj.FixCols) return;
        gridobj.preTD = gridobj.curObj;
        gridobj.curObj = curObj1;
        //added by liuxr at 2010-11-11 10:22 ��curTD���Ը�ֵ
        gridobj.curTD = gridobj.curObj;
        tmpB = true;

    }


    if (gridobj.autosize == false) {
        if (gridobj.fchtcDiv1.style.display != "none") {
            //�����³��������
            if (gridobj.Vmax > 0) {
                var d = new Date();
                var t = d.getTime();

                var num1 = gridobj.tgrid.rows[gridobj.curObj.parentNode.rowIndex].offsetHeight; // tgrid.rows(curObj.parentNode.rowIndex).style.pixelHeight;		//curObj.offsetHeight


                /*	//var n=tgrid.childNodes(0).childNodes(curObj.cellIndex).style.pixelWidth		//curObj.offsetWidth

				var num2=div1.offsetHeight
                var num3=curObj.offsetTop
                */
                //var oRect=curObj.getBoundingClientRect();
                //var oRect1=div1.getClientRects();

                //var n1=oRect.bottom
                //var n2=500 //oRect1[0].bottom
                var n3 = gridobj.tgrid.rows.length - gridobj.Vmax + gridobj.TopRow;
                var n4 = gridobj.curObj.parentNode.rowIndex;


                if (n4 > n3) {  //-17
                    //alert("aa")
                    gridobj.fnPutVscrollvalue(gridobj.TopRow, gridobj.TopRow + 1);
                } else {

                    if (num1 == 0) {
                        gridobj.div1.scrollTop = 0;
                        //alert("aab")
                        gridobj.fnPutVscrollvalue(gridobj.TopRow, 0);
                    }
                }

                if (tmpB) {
                    var d = new Date();
                    var t1 = d.getTime();
                    //alert(t1-t)
                }

            }

        }

        if (gridobj.fchtcDiv2.style.display != "none" && sUp != "�����ƶ�") {
            if (gridobj.Hscrollmax > 0) {
                var num1 = parseInt(gridobj.tgrid.childNodes[0].childNodes[gridobj.curObj.cellIndex].style.width);
                var oRect = gridobj.curObj.getClientRects();
                var oRect1 = gridobj.div1.getClientRects();

                var n1 = oRect[0].right;
                var n2 = oRect1[0].right;

                //�����ҳ��������
                if (n1 > n2) {  //-17
                    //����һ�ι���������
                    //���ܲ�һ��ֻ����һ��,���м���ֻ���еĻ�
                    var scrollcols = 0;
                    var sumWidth = gridobj.curObj.offsetLeft + num1 - (gridobj.div1.offsetWidth);  //-17
                    var tmpWidth = 0;
                    var i = gridobj.Hscrollvalue + 1;
                    while (tmpWidth < sumWidth && i < gridobj.tgrid.childNodes[0].childNodes.length) {
                        tmpWidth += gridobj.tgrid.childNodes[0].childNodes[i].offsetWidth;
                        i++;
                    }
                    if (i > gridobj.Hscrollmax) i = gridobj.Hscrollmax;
                    //---------------------------------------
                    gridobj.fnPutHscrollvalue(gridobj.Hscrollvalue, i);
                } else {
                    gridobj.div1.scrollLeft = 0;
                    if (num1 == 0) {
                        gridobj.fnPutHscrollvalue(gridobj.Hscrollvalue, 0);
                    }
                }
            }
        }
    }
    //mcurRow=curObj.parentNode.rowIndex
    //mcurCol=curObj.cellIndex

    gridobj.txtMyGrid.style.display = "none";
    $id(gridobj.cz.id).style.display = "none";

    //MoveDataSet() //��actcellchange�д�����

    gridobj.SetTDFilter();
    //preTD.className="";
    //curObj.className="tdfilter"    
    var d = new Date();
    var t1 = d.getTime();
    //alert("tgrid_onclickʱ��:"+(t1-t))	

    return;
    /**
    *ǿ�и��´���,��tgrid_onclick()��ʹ��
    *@param colNo �к�
    *@param rowNo �к�
    *@param svalue Ҫ���µ�ֵ
    *@return ��
    *@date 2005-01-25
    **/
    function checkbox_update_ds(gridobj, colNo, rowNo, svalue) {
        //alert(gridobj.dataset);
        if (isSpace(gridobj.dataset) == false) {
            var oDs = $obj(gridobj.dataset);
            //if(oDs.bAdd == false) oDs.bEdit = true 
            var cur = gridobj.tgrid.childNodes[0].childNodes[colNo].getAttribute("dsfield");
            cur = parseInt(cur);
            if (isNaN(cur)) cur = 0;
            //oDs.Fields.Field[curF].Value = svalue
            //if(oDs.Update() == 1) return false
            //oDs.oDom.documentElement.childNodes[rowNo].childNodes[cur].text = svalue;
            NavJs.textContent(oDs.oDom.documentElement.childNodes[rowNo].childNodes[cur], svalue);

            if (oDs.RecNo == rowNo)		//added by liuxr at 2009-5-19 ���grid��ҳǩ�ĵڶ�ҳʱ��ѡ��Ĭ��ѡ�е�����
                oDs.Fields.Field[cur].Value = svalue

            //�޸��б�־
            if (oDs.oDom.documentElement.childNodes[rowNo].getAttribute("rowstate") == "new")
                oDs.oDom.documentElement.childNodes[rowNo].setAttribute("rowstate", "add"); ;
            if (oDs.oDom.documentElement.childNodes[rowNo].getAttribute("rowstate") != "add")
                oDs.oDom.documentElement.childNodes[rowNo].setAttribute("rowstate", "edit"); ;

        }
        return true;
    }
    /**
    *�ɱ���кŵõ����ݼ����ֶ���
    *��δ�еط�ʹ��
    *@date 2005-01-25
    **/
    //	function gridcol_dsfieldname(colNo) {
    //		var oXml = SetDom(gridobj.format);
    //		if(colNo>0) colNo--;
    //		var curFieldName = NavJs.textContent(oXml.documentElement.childNodes[colNo].childNodes[0]) ; //0���ڵ�Ϊ�ֶ���
    //		return curFieldName;
    //	}


}
/**
*�����ı����ϵ�ֵ����Ԫ���ϴ��ݵ����
**/
webgrid.prototype.txtTotd = function() {
        this.curObj.innerText = this.txtMyGrid.value;
}
/**
*������Ԫ���ϵ�ֵ���ı����ϴ��ݵ����
**/
webgrid.prototype.tdTotxt = function() {
    //
    var TransValue = this.curObj.innerText;
    //�����ǰ��ֵ�Ա�undo
    this.BeforeChangeText = TransValue;

    var s1 = this.curObj.getAttribute("formula");
    if (s1 != null) {
        TransValue = "=" + s1;
        //ʹTD��ֵ���ı����ֵһ��,�����й�ʽʱ����
        this.txtMyGrid.value = TransValue;

        //Ϊ�˸�curObj.innerTextֵ������
        this.txtTotd();
    }
    else
        this.txtMyGrid.value = TransValue;


}
/**
*�����������,�������� ����
*@param curcol ��ǰ��
*@date 2003-12-05
**/
webgrid.prototype.ClickHeader = function(curcol) {

    if (this.IsOrder != "��") return;
    if (curcol <= 0) return;
    if (parseInt(this.tgrid.childNodes[0].childNodes[curcol].style.width) == 0) return;
    if (this.FixRows > 1) return; //����ͷʱ��������
    var orderstr = "��";
    var orderstr1 = "��";
    var asc = "����";

    //ȥ��ԭ����
    for (var i = 1; i < this.tgrid.childNodes[0].childNodes.length; i++) {
        if (i != curcol) {
            var s4 = this.tgrid.rows[0].cells[i].innerHTML;
            var s5 = s4.substring(0, 1);
            if (s5 == orderstr || s5 == orderstr1) {
                this.tgrid.rows[0].cells[i].innerHTML = s4.substring(1, s4.length);
            }
        }
    }

    //�����µ�
    var s2 = this.tgrid.rows[0].cells[curcol].innerHTML;
    var s3 = s2.substring(0, 1);
    if (s3 != orderstr && s3 != orderstr1) {
        this.tgrid.rows[0].cells[curcol].innerHTML = orderstr + s2;
    } else if (s3 == orderstr) {
        this.tgrid.rows[0].cells[curcol].innerHTML = orderstr1 + s2.substring(1, s2.length);
        asc = "����";
    } else {
        this.tgrid.rows[0].cells[curcol].innerHTML = orderstr + s2.substring(1, s2.length);
    }
    if (isSpace(this.dataset) == false) {
        //modify by liuxr at 2011-11-14 9:42 �޸Ĵ�grid�����ȡformat����,�������dataset������������ʱgrid����������
        //var sformat=eval("document.getElementById('"+this.id+"').getAttribute('format')");
        var sformat = this.format;

        /*var oXml=new ActiveXObject("Microsoft.XMLDOM");
        oXml.async=false;
        oXml.loadXML (sformat);*/
        var oXml = SetDom(sformat);

        var s1 = "";
        //ȡ�ֶ���,�������һ�������
        s1 = NavJs.textContent(oXml.documentElement.childNodes[curcol - 1].childNodes[0]);
        s1 = Trim(s1);

        var ods = $obj(this.dataset);
        if (ods.Update() == 1) return;
        var sortcol = ods.FieldNameToNo(s1);
        ods.Sort(sortcol, asc);
    }

}

webgrid.prototype.onResize = function(scrollDirection) {
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer) return;
    var gridobj = this;

    var bak_hideVscroll = gridobj.hideVscroll;
    if (scrollDirection != "H" && gridobj.hideVscroll == "auto") {
        gridobj.Vmax = gridobj.getVScrollMax();
        gridobj.fnPutVscrollmax(gridobj.Vmax);
        if (gridobj.Vmax < 1)
            gridobj.hideVscroll = "��";
        else
            gridobj.hideVscroll = "��";


    }
    var bak_hideHscroll = gridobj.hideHscroll;
    if (scrollDirection != "V" && gridobj.hideHscroll == "auto") {
        gridobj.Hscrollmax = gridobj.getHScrollMax();
        gridobj.fnPutHscrollmax(gridobj.Hscrollmax);
        if (gridobj.Hscrollmax < 1)
            gridobj.hideHscroll = "��";
        else
            gridobj.hideHscroll = "��";
    }

    var bool_hideVscroll = IsTrue(gridobj.hideVscroll);
    var bool_hideHscroll = IsTrue(gridobj.hideHscroll);
    if (scrollDirection != "H") {
        if (bool_hideVscroll || gridobj.visible != "��") {
            gridobj.fchtcDiv1.style.display = "none";
            gridobj.fcButton1.style.display = "none";
            gridobj.fcButton2.style.display = "none";
            gridobj.fcButton3.style.display = "none";
            gridobj.divconer.style.display = "none";
            if (gridobj.autosize == false) {
                gridobj.div1.style.width = ToInt(gridobj.width) + "px";
            }

        }
        else {
            

            gridobj.fchtcDiv1.style.display = "";
            gridobj.fcButton1.style.display = "";
            gridobj.fcButton2.style.display = "";
            gridobj.fcButton3.style.display = "";
            if (gridobj.fchtcDiv2.style.display == "" && gridobj.fchtcDiv1.style.display == "") {
                gridobj.divconer.style.display = "";
            }
            else {
                gridobj.divconer.style.display = "none";
            }

            if (gridobj.autosize == false) {
                var tmpWidth = ToInt(gridobj.width) - 14;
                if (tmpWidth < 10) tmpWidth = 10;
                gridobj.div1.style.width = tmpWidth + "px";
            }
            
        }
    }

    if (scrollDirection != "V") {
        if (bool_hideHscroll || gridobj.visible != "��") {
            gridobj.fchtcDiv2.style.display = "none";
            gridobj.fcButton4.style.display = "none";
            gridobj.fcButton5.style.display = "none";
            gridobj.fcButton6.style.display = "none";
            gridobj.divconer.style.display = "none";
            if (gridobj.autosize == false) {
                gridobj.div1.style.height = ToInt(gridobj.height) + "px";
            }


        }
        else {
            gridobj.fchtcDiv2.style.display = "";
            gridobj.fcButton4.style.display = "";
            gridobj.fcButton5.style.display = "";
            gridobj.fcButton6.style.display = "";
            if (gridobj.fchtcDiv2.style.display == "" && gridobj.fchtcDiv1.style.display == "") {
                gridobj.divconer.style.display = "";
            }
            else {
                gridobj.divconer.style.display = "none";
            }

            if (gridobj.autosize == false) {
                var tmpHeight = ToInt(gridobj.height) - 14;
                if (tmpHeight < 10) tmpHeight = 10;
                gridobj.div1.style.height = tmpHeight + "px";
            }

        }
    }

    if ((bak_hideVscroll == "auto" || bak_hideHscroll == "auto" || bool_hideVscroll == false || bool_hideHscroll == false) && gridobj.visible == "��") {
        gridobj.setBottomPosition();
    }
    if (scrollDirection != "V" && bool_hideVscroll == false) {
        gridobj.Vmax = gridobj.getVScrollMax();
        gridobj.fnPutVscrollmax(gridobj.Vmax);
    }
    if (scrollDirection != "H" && bool_hideHscroll == false) {
        gridobj.Hscrollmax = gridobj.getHScrollMax();
        gridobj.fnPutHscrollmax(gridobj.Hscrollmax);
    }

    if (gridobj.visible == "��" && gridobj.autosize) {
        gridobj.div1.style.height = gridobj.tgrid.offsetHeight + "px";
        gridobj.div1.style.width = gridobj.tgrid.offsetWidth + "px";
    }

    //�ָ�
    gridobj.hideVscroll = bak_hideVscroll;
    gridobj.hideHscroll = bak_hideHscroll;
}
/**
* ����ɾ��,�����п��и�ʱ����.����autoʱ������ʾ������.
**/
webgrid.prototype.ActionAutoScroll = function (scrollDirection) {
    if ((scrollDirection == "V" && this.hideVscroll == "auto") || (scrollDirection == "H" && this.hideHscroll == "auto"))
        this.onResize(scrollDirection);

}
webgrid.prototype.ResizeDiv = function() {
    //if (this.moverflow) {
    var iWidth = 0;
    var iHeight = 0;
    for (var i = 0; i < this.tgrid.rows.length; i++) {
        iHeight += ToInt(this.tgrid.rows[i].style.height);
    }
    for (var i = 0; i < this.tgrid.rows[0].cells.length; i++) {
        iWidth += ToInt(this.tgrid.rows[0].cells[i].style.width);
    }

    this.tgrid.style.height = iHeight + "px"; 
    this.tgrid.style.width = iWidth + "px"; 

    if (this.autosize) {

        this.div1.style.height = (Math.max(iHeight, this.tgrid.offsetHeight)+0) + "px";
        this.div1.style.width = (Math.max(iWidth, this.tgrid.offsetWidth) +1)+ "px";
    } else {
        this.div1.style.height = this.height + "px";
        this.div1.style.width = this.width + "px";
    
    }
    //    this.div1.style.height = this.tgrid.offsetHeight+"px";
    //    this.div1.style.width = this.tgrid.offsetWidth + "px";
    //}

}
webgrid.prototype.initGrid = function() {
    this.onResize();

}
webgrid.prototype.hide = function() {
    //���ر༭�ؼ�
    this.txtMyGrid.style.display = "none";
    $id(this.cz.id).style.display = "none";

}
/**
*ȥ����ǰ�еı���ɫ,�������ݼ��е���
*@date 2003-12-26
**/
webgrid.prototype.RemoveBackColor = function(td) {
    if (this.tgrid.rows.length <= this.FixRows) return; //�Է�ɾ�ձ���,��������ʱ����.

    if (IsSpace(td)) td = this.curObj;
    if (td.cellIndex >= 0) {
        //modify by liuxr at 2010-3-23 13:58 IE8������td.parentNode�Ƿ�Ϊnull�жϣ�������ֽű����� 
        if (td.parentNode != null) {
            var tmpcurRow = td.parentNode.rowIndex;
            if (tmpcurRow > 0) {
                //2009-5-22 �����ж� liuxr
                if (isTrue(this.blRowNo) == false)
                    this.tgrid.rows[tmpcurRow].cells[0].innerText = " ";
                this.tgrid.rows[tmpcurRow].style.backgroundColor = "";
                //2009-04-21 ����
                td.style.color = "";
                td.style.backgroundColor = "";
            }
        }
    } else { //��ȥ���е��б���
        for (var i = 1; i < this.tgrid.rows.length; i++) {
            //2009-5-22 �����ж� liuxr
            if (isTrue(this.blRowNo) == false)
                this.tgrid.rows[i].cells[0].innerText = " ";
            this.tgrid.rows[i].style.backgroundColor = "";
        }
    }

}
/**
*�ӵ�ǰ�еı���ɫ,����tgrid_onclick ��Appendʱ����
*@date 2003-12-26
**/
webgrid.prototype.AddBackColor = function() {
    //���б��
    //added by liuxr at 2010-12-7 9:37 ���Ӷ����Ƿ�Ϊnull���ж�,����IE8�³��ֽű�����
    if (this.curObj.parentNode == null || typeof this.curObj.parentNode == "undefined") return;
    var tmprow = this.curObj.parentNode.rowIndex;
    if (tmprow > 0) {
        //added by liuxr at 2009-5-22 �����жϣ��������ʾ�к�ʱ��innerText=">"
        if (isTrue(this.blRowNo) == false)
            this.tgrid.rows[tmprow].cells[0].innerText = ">";
        this.tgrid.rows[tmprow].style.backgroundColor = "e6e6fa";
    }
}
/**
*��������ô˺���
**/
webgrid.prototype.Actmoveedit = function() {
    this.hide();
}
/**
*onDataChange�¼�
*@date 2003-09-16
*@param sTag=="ǿ�з������ݸı��¼�"
*@return true ��ʾ��������ƶ���Ԫ��, false ��ʾondatachange�м��Ƿ���Ҫȡ���ƶ���Ԫ��.������������.
**/
webgrid.prototype.Act_onDataChange = function(sTag, oldvalue, newvalue) {

    //����ǰ��TDֵ���Ժ�Ĳ�ͬ����onDataChange
    //alert(txtMyGrid.style.display)==none��ʾ��һ�ν�����
    if (((this.curObj.innerText != this.BeforeChangeText && this.txtMyGrid.style.display == "block") || sTag == "ǿ�з������ݸı��¼�") && this.curObj.parentNode.rowIndex > 0) {
        //alert(curObj.innerText+"!="+BeforeChangeText)
        //modify by liuxr at 2010-11-9 11:55 �滻createEventObject()��new Object(),�ڷ�ie���������֧��createEventObject()
        var oEvent = new Object(); //createEventObject();
        oEvent.curTD = this.curObj;
        oEvent.BeforeChangeText = this.BeforeChangeText;
        oEvent.AfterChangeText = this.curObj.innerText;
        //if(typeof oldvalue != "undefined" && typeof newvalue != "undefined"){
        //	oEvent1.BeforeChangeText = oldvalue ;
        //	oEvent1.AfterChangeText = newvalue ;
        //}
        //oEvent1.returnValue=true
        //Ϊ���ݼ������¼ӵ�
        if (isSpace(this.dataset) == false) {
            var sCommand = "if(" + this.dataset + ".bAdd==false) " + this.dataset + ".bEdit=true;" + this.dataset + ".cont_onDataChange();";
            eval(sCommand);
            //   if(dsMain.bAdd==false) dsMain.bEdit=true
        }

        //��EndRowStateΪ"edit"
        if (this.EndRowState == "add" && this.curObj.parentNode.rowIndex == this.tgrid.rows.length - 1) {
            this.EndRowState = "edit";
        }

        //onDataChangeID.fire(oEvent1);
        //eval($id(this.id).getAttribute("onDataChange"));
        //if(oEvent1.returnValue==false) {

        //	return false

        //}
    }
    return true;

}
/**
*�����¼��Ĳ���,n
*�˺����ڰ�������͵�����ʱ����
*param newTD Ϊ�����¼���TD
*return false ��ʾȡ���������������
**/
webgrid.prototype.actcellchange = function(newTD) {
    if (this.curObj != null && this.curObj.cellIndex >= 0) {
    }
    else if (this.lostfocusTD != null && this.lostfocusTD.cellIndex >= 0) {
        this.curObj = this.lostfocusTD;
        //added by liuxr at 2010-11-11 10:22 ��curTD���Ը�ֵ
        this.curTD = this.curObj;
        if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
            /* ! added by liuxr at 2010-12-7 14:37 ��Row���Ը�ֵ this.curObj.parentNode.rowIndex*/
            this.Row = this.curObj.parentNode.rowIndex;
            /* ! added by liuxr at 2010-12-7 14:37 ��Col���Ը�ֵ this.curObj.cellIndex*/
            this.Col = this.curObj.cellIndex;
        }
    } else {
        this.curObj = this.tgrid.rows[0].cells[0];
        //added by liuxr at 2010-11-11 10:22 ��curTD���Ը�ֵ
        this.curTD = this.curObj;
        //alert(newTD.parentNode.rowIndex)
        if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
            /* ! added by liuxr at 2010-12-7 14:37 ��Row���Ը�ֵ this.curObj.parentNode.rowIndex*/
            this.Row = this.curObj.parentNode.rowIndex;
            /* ! added by liuxr at 2010-12-7 14:37 ��Col���Ը�ֵ this.curObj.cellIndex*/
            this.Col = this.curObj.cellIndex;
        }
    }

    //���ݸı��¼�
    if (this.Act_onDataChange() == false) return false;
    //if(curObj.parentNode.rowIndex==newTD.parentNode.rowIndex && curObj.cellIndex==newTD.cellIndex) return false

    var oEvent = new Object(); //createEventObject();
    oEvent.oldTD = this.curObj;
    oEvent.newTD = newTD;
    //oldTD�ڸı�ǰ��ֵ
    oEvent.BeforeChangeText = this.BeforeChangeText;
    //added by liuxr at 2010-12-2 17:11 ����onCellChange�ӿ�
    //var strlink = this.id + ".onCellChange()";
    //NavJs.insertEventParam(strlink, oEvent);
    var oFunction = this.onCellChange; //my add,Ҫ��д��Ϊ grid1.onCellChange = function(event) {...}
    if (IsSpace(oFunction) == false) {
        oFunction(oEvent);
    }
    //onCellChangeID.fire(oEvent);
    //alert(curObj.parentNode.rowIndex+"!="+newTD.parentNode.rowIndex)
    if (this.curObj.parentNode.rowIndex != newTD.parentNode.rowIndex) {
        //onBeforeRowChange�¼�---------------------------------------------------------------
        //��ʱûʹ�ô��¼�

        oEvent = new Object(); //createEventObject() ;
        oEvent.Cancel = false;
        //onBeforeRowChangeID.fire() ;
        if (oEvent.Cancel) return false;


        //------------------------------------------------------------------------------------
        //alert(curObj.parentNode.rowIndex)
        //mdataset.Update(curObj.parentNode.rowIndex)
        oEvent = new Object(); //createEventObject();
        oEvent.oldRow = this.curObj.parentNode.rowIndex;
        oEvent.newRow = newTD.parentNode.rowIndex;
        oEvent.Cancel = false;


        //Ϊ���ݼ������¼ӵ�
        //������2005-04-07 ʱȥ����'�����'�ͼ�����ˢ�±��
        if (isSpace(this.dataset) == false) {
            var oDs = $obj(this.dataset); //eval("window."+this.dataset);
            var blnChangeData = false;
            if (oDs.bEdit || oDs.bAdd) blnChangeData = true;
            if (oDs.Update("��ʾ������Ϣ") != "") {  //'�����'
                return false;
            } else {
                //alert("rowchange!!")

                if (oEvent.oldRow - this.FixRows > 0 && blnChangeData) {
                    oDs.fset_cont(oEvent.oldRow - this.FixRows); //ˢ�±��
                }
                oDs.SetPos(oEvent.newRow - this.FixRows);
            }
        }

        //
        //onRowChangeID.fire(oEvent);
        eval($id(this.id).getAttribute("onRowChange"));
        if (oEvent.Cancel) return false;
    }
    return true;
}
webgrid.prototype.txtMyGrid_onkeydown = function() {
    //alert("b")
    //window.status=window.status+"txt"
    var gridobj = this;

    gridobj.KeyMove(1);  //���Ҽ���������
    //added by liuxr at 2011-6-22 16:11 �������ݺ󰴻س����ص����༭״̬
    gridobj.txtMyGrid_onkeypress();

}
webgrid.prototype.txtMyGrid_onkeypress = function() {

    //window.status=window.status+"txtpress"
    var event = NavJs.getEvent();
    var gridobj = this;

    // alert(gridobj.txtMyGrid.style.display);
    //alert(event.keyCode);
    if (gridobj.txtMyGrid.style.display == "block" && event.keyCode == 13) { //�س���
        //---------------------------------------
        //����˫���¼�

        var s2 = eval(gridobj.id + ".ondblclick");
        //ȥ��{}��ߵĶ���
        var s1 = s2 + "";
        s1 = s1.substring(22, s1.length - 1);

        //alert(s1)
        if (isSpace(s1) == false) {
            //if(txtMyGrid.value==" "){
            //���ò���
            try {
                eval(s1);
            } catch (E) {
                eval(s2);
            }
        }
        gridobj.curObj.focus();
        gridobj.txtMyGrid.style.display = "none";

        //event.returnValue = false;
        NavJs.preventDefault(event);

    }
}
/**
*���İ�ť�¼�
**/
webgrid.prototype.tgrid_onkeydown = function() {
    //window.status=window.status+"tgrid "
    var event = NavJs.getEvent();
    var gridobj=this;

    var iKeyCode = event.keyCode;
    gridobj.KeyMove(2); //2=ȫ����������


    if (iKeyCode == 13) {//enter��
        if (gridobj.txtMyGrid.style.display == "none") {
            gridobj.moveedit();
        }

    }


}
/**
*���İ�ť�¼�
**/
webgrid.prototype.tgrid_onkeypress = function() {
    //window.status=window.status+"tgridpress "
    var event = NavJs.getEvent();
    var gridobj = this;

    var iKeyCode = event.keyCode;
    //if(iKeyCode<33 || iKeyCode>40){
    //��ƽ����
    if (gridobj.txtMyGrid.style.display == "none") {
        gridobj.moveedit();
        //����ֻ�����
        if (gridobj.txtMyGrid.style.display == "block") {
            //if(iKeyCode==32){ //�ո��
            //	txtMyGrid.value=""
            //}else{
            gridobj.txtMyGrid.value = "";
            gridobj.MoveIns(0);  //�ƶ������
            //}
            gridobj.txtTotd();
        }
    }
    //}
}
/**
*����������ƶ�,����pageup pagedown end home 33 34 35 36 
*@para iEdit =1��ʾ���Ҽ��������� =2��ʾȫ���˸�����������.
*@date 2003-09-09
**/
webgrid.prototype.KeyMove = function(iEdit){
	if(this.curObj.cellIndex==-1)return ; //����
	if((this.ReadOnly && this.autosize ) || this.canselect=="��") return;
	var mcurRow = this.curObj.parentNode.rowIndex;
	var mcurCol = this.curObj.cellIndex;
	var event;
	if(window.event)
	{
	    event = window.event;
	}
	else
	{
	    event = NavJs.getEvent();
	}
	//û����ϼ������
	if (event.shiftKey ==true || event.ctrlKey ==true) return;

	var iKeyCode=event.keyCode;

	if(iKeyCode<33 || iKeyCode>40 ) return;
	if(iEdit==1){
		 if ( iKeyCode==37 || iKeyCode==39 || iKeyCode==36 || iKeyCode==35  ) {
		 	return;
		 }else{
		 	this.curObj.focus();
		 }	
	}
	
	
	
	switch (iKeyCode) {
		case 33: //pageup
			//�Զ����к�Ҫɾ��β�� 2003-05-19 add
			if(mcurRow == this.tgrid.rows.length-1 ){
				
				if(isSpace(this.dataset) == false && this.EndRowState == "add"){
					var ods=eval(this.dataset);
					ods.Delete();	//ɾ�����һ��
					return;
				}
				
			}

			if(mcurRow>this.FixRows){
				var nextRow=0;
				if(mcurRow-20<this.FixRows){
					nextRow = 1;
					this.fnPutVscrollvalue(this.TopRow,0);
				}else{
					nextRow=mcurRow-20;
					//����ʱ�Զ��Ϲ�
					if(this.TopRow-20>0){
						this.fnPutVscrollvalue(this.TopRow,this.TopRow-20);
					}else{
						this.fnPutVscrollvalue(this.TopRow,0);
					}
				}
				//�����Ƿ���Ӧȡ��
				if (this.actcellchange(this.tgrid.rows[nextRow].cells[mcurCol])==false) return;
				
				this.tgrid_onclick(tgrid.rows[nextRow].cells[mcurCol]);
			}
			break;
		case 34: //pagedown
			if(mcurRow<this.tgrid.rows.length-1 ){
				var nextRow=0;
				
				if(mcurRow+20>this.tgrid.rows.length-1){
					nextRow = this.tgrid.rows.length-1;
					this.fnPutVscrollvalue(this.TopRow,this.Vmax);
				}else{
					nextRow = mcurRow+20;
					//����ʱ�Զ��Ϲ�
					if(this.TopRow+20 < this.Vmax){
						this.fnPutVscrollvalue(this.TopRow,this.TopRow+20);
					}else{
						this.fnPutVscrollvalue(this.TopRow,this.Vmax);
					}
				}
				
				//�����Ƿ���Ӧȡ��
				if (this.actcellchange(this.tgrid.rows[nextRow].cells[mcurCol])==false) return;

				this.tgrid_onclick(this.tgrid.rows[nextRow].cells[mcurCol]);
			} else {  //���򲿷������Զ����� 2003-05-09 add
				/*
				if(isSpace(mdataset)==false && mEndRowState=="edit"){
					var ods=eval("window."+mdataset)
					ods.Append()
				}
				*/
			}			
			break;
		case 35: //end
			if(mcurCol<this.tgrid.childNodes[0].childNodes.length-1){
				this.fnPutHscrollvalue(this.Hscrollvalue,this.Hscrollmax);
				var nextCol = this.tgrid.childNodes[0].childNodes.length-1;
				//Ϊ������û�����������Ե���(�������������)��������ѭ����
				//���ϵ������ػ��п�Ϊ0ʱҲ����
				
				while (parseInt(this.tgrid.childNodes[0].childNodes[nextCol].style.width)==0 ||  this.tgrid.childNodes[0].childNodes[nextCol].offsetWidth==0 ) {
					if(nextCol>this.FixCols) {
						nextCol--;
					}
					else {		//�ұ߳������򷵻�ԭ��
						nextCol = mcurCol;
					}
				}
				
				this.actcellchange(this.tgrid.rows[mcurRow].cells[nextCol]);
				this.tgrid_onclick(this.tgrid.rows[mcurRow].cells[nextCol]);
			}
			
			break;
		case 36: //home
			if(mcurCol>this.FixCols){
				this.fnPutHscrollvalue(this.Hscrollvalue,0);

				var nextCol = this.FixCols;
				//����������
				while ( parseInt(this.tgrid.childNodes[0].childNodes[nextCol].style.width)==0 ||  this.tgrid.childNodes[0].childNodes[nextCol].offsetWidth==0 ) {
					if(nextCol<this.tgrid.childNodes[0].childNodes.length-1) {
						nextCol++;
					}
					else {//�ұ߳������򷵻�ԭ��
						nextCol=mcurCol;
					}
				}
				this.actcellchange(this.tgrid.rows[mcurRow].cells[nextCol]);
				this.tgrid_onclick(this.tgrid.rows[mcurRow].cells[nextCol]);
			}
			
			break;
		case 37: //��
			if(mcurCol>this.FixCols){
				//����ʱ�Զ��Ϲ�
				if(mcurCol<=this.FixCols+this.Hscrollvalue){
					this.fnPutHscrollvalue(this.Hscrollvalue,this.Hscrollvalue-1);
				}
				var nextCol = mcurCol-1;
				//����������
				while ( parseInt(this.tgrid.childNodes[0].childNodes[nextCol].style.width)==0 ||  this.tgrid.childNodes[0].childNodes[nextCol].offsetWidth==0 ) {
					if(nextCol>this.FixCols) {
						nextCol--;
					}
					else {//�ұ߳������򷵻�ԭ��
						nextCol = mcurCol;
					}
				}
				this.actcellchange(this.tgrid.rows[mcurRow].cells[nextCol]);
				this.tgrid_onclick(this.tgrid.rows[mcurRow].cells[nextCol]);
			}
			break;
		case 39: //��
			if(mcurCol<this.tgrid.childNodes[0].childNodes.length-1){
				//debugger;
				var nextCol=mcurCol+1;
				//Ϊ������û�����������Ե���(�������������)��������ѭ����
				//���ϵ������ػ��п�Ϊ0ʱҲ����
				while ( parseInt(this.tgrid.childNodes[0].childNodes[nextCol].style.width)==0 ||  this.tgrid.childNodes[0].childNodes[nextCol].offsetWidth==0 ) {
					if(nextCol<this.tgrid.childNodes[0].childNodes.length-1) {
						nextCol++;
					}
					else {		//�ұ߳������򷵻�ԭ��
						nextCol = mcurCol;
					}
				}
				this.actcellchange(this.tgrid.rows[mcurRow].cells[nextCol]);
				this.tgrid_onclick(this.tgrid.rows[mcurRow].cells[nextCol]);
			}
			break;

		case 38: //��
		/*
			var d=new Date()
			var t = d.getTime();
			curObj=tgrid.rows(6).cells(2)
			SetTDFilter()
			var d=new Date()
			var t1 = d.getTime();
			alert("up:"+(t1-t))
			break;
			*/
			//�Զ����к�Ҫɾ��β�� 2003-05-19 add
			if(mcurRow == this.tgrid.rows.length-1 ){
				
				if(isSpace(this.dataset)==false && this.EndRowState=="add"){
					var ods=eval(this.dataset);
					ods.Delete();	//ɾ�����һ��
					return;
				}
				
			}

			if(mcurRow>this.FixRows){
				var nextRow = mcurRow-1;
				//����ʱ�Զ��Ϲ�
				if(nextRow<this.FixRows+this.TopRow){
					this.fnPutVscrollvalue(this.TopRow,this.TopRow-1);
				}
				//�����Ƿ���Ӧȡ��
				if (this.actcellchange(this.tgrid.rows[nextRow].cells[mcurCol])==false) return;
				
				this.tgrid_onclick(this.tgrid.rows[nextRow].cells[mcurCol],"�����ƶ�");

			}
			
			break;
		case 40: //��
			if(mcurRow<this.tgrid.rows.length-1 ){
				var nextRow = mcurRow+1;
				//�˴��������Զ�����,���Բ���Ҫ���ù�����
				
				//�����Ƿ���Ӧȡ��
				if (this.actcellchange(this.tgrid.rows[nextRow].cells[mcurCol])==false) return;

				this.tgrid_onclick(this.tgrid.rows[nextRow].cells[mcurCol],"�����ƶ�");
			} else if($id(this.id).getAttribute("autoappend")=="��"){  //���򲿷������Զ����� 2003-05-09 add

				if(isSpace(this.dataset)==false && this.EndRowState=="edit" && this.AllColReadOnly()==false ){
					
					var ods=eval(this.dataset);
					ods.Append();
				}

			}
			break;
	}
	
}
/**
*�ô����ƶ��������λ��
*@date 2003-09-09
**/
webgrid.prototype.MoveIns = function(iPos) {

    var r = this.txtMyGrid.createTextRange();
    r.moveStart('character', iPos);
    r.collapse(true);
    r.select();
}
/**
*�ж��Ƿ�������ʾ�ж�ֻ��,���Զ�������ʱ��
*@date 2003-09-16
**/
webgrid.prototype.AllColReadOnly = function() {
    var bRead = true;
    for (var i = 1; i < this.tgrid.rows[0].cells.length; i++) {
        if (parseInt(this.tgrid.children[0].children[i].style.width) > 0) {
            if (this.tgrid.children[0].children[i].getAttribute("cz") != null) {
                bRead = false;
                break;
            }
        }
    }
    //alert(tgrid.children[0].innerHTML)
    //alert(bRead)
    return bRead;

}
webgrid.prototype.getCurPageRows = function() {
    //ȡ�õ�ǰҳ��ʾ������
    var lngFixRowHeight = 0;
    var lngRowH = 0;
    for (var i = 0; i < this.FixRows; i++) {
        lngFixRowHeight += parseInt(this.tgrid.rows[i].style.height);
    }
    for (var i = this.TopRow + this.FixRows; i < this.tgrid.rows.length; i++) {
        lngRowH = lngRowH + parseInt(this.tgrid.rows[i].style.height);
        if (lngRowH >= parseInt(this.div1.offsetHeight)) {
            break;
        }
    }
    return i - this.TopRow - this.FixRows;

}
/**
*�ڹ�������˫��
*@date 2004-05-21
**/
webgrid.prototype.scrollbar_ondblclick = function() {
    //window.event.cancelBubble = true;
    //window.event.returnValue = false;
    var event = NavJs.getEvent();
    NavJs.cancelBubble(event);
    NavJs.preventDefault(event);

}


//-----------------------------------------------------------------------------------------
/**
*����װ��XML�������ݵ����
*@date 2003-12-24
**/
webgrid.prototype.LoadXml = function(sHTML) {
    this.TopRow = 0;
    this.Hscrollvalue = 0;
    this.Vmax = 0;
    this.Hscrollmax = 0;
    //fnPutVscrollvalue(TopRow,0)
    var d = new Date();
    var t = d.getTime();
    this.tgrid.outerHTML = sHTML;
    var d = new Date();
    var t1 = d.getTime();
    //alert(t1-t)	
    this.tgrid = $id(this.id).children[0].children[0];
    //modify by liuxr at 2010-11-10 10:38 ��tab���Ը�ֵ
    this.tab = this.tgrid;
    //modify by liuxr at 2010-11-10 13:33 ��Rows��Cols���Ը�ֵ
    if (this.tgrid != null) {
        this.Rows = this.tgrid.rows.length;
        this.Cols = this.tgrid.childNodes[0].childNodes.length;
    }
    //this.tgrid.width = this.tgrid.offsetWidth;

    this.curObj = this.tgrid.rows[0].cells[0];
    //added by liuxr at 2010-11-11 10:22 ��curTD���Ը�ֵ
    this.curTD = this.curObj;
    //modify by liuxr at 2010-11-11 9:40 �����¼�ʱ���ݵ�ǰ�ؼ�ID��Ϊ����

    if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
        /* ! added by liuxr at 2010-12-7 14:37 ��Row���Ը�ֵ this.curObj.parentNode.rowIndex*/
        this.Row = this.curObj.parentNode.rowIndex;
        /* ! added by liuxr at 2010-12-7 14:37 ��Col���Ը�ֵ this.curObj.cellIndex*/
        this.Col = this.curObj.cellIndex;
    }

    var myobj = new Object();
    myobj = this;

    //this.tgrid.attachEvent("onclick", this.tgrid_onclick);
    NavJs.addEvent(this.tgrid, "onclick", this.tgrid_onclick, myobj);
    //this.tgrid.attachEvent("onkeydown", this.tgrid_onkeydown);
    NavJs.addEvent(this.tgrid, "onkeydown", this.tgrid_onkeydown, myobj);
    //this.tgrid.attachEvent("onkeypress", this.tgrid_onkeypress);
    NavJs.addEvent(this.tgrid, "onkeypress", this.tgrid_onkeypress, myobj);

    this.onResize();
}



webgrid.prototype.fnInit = function(sHTML) {
    //if(element.isContentEditable)return
    //debugger;

    if (typeof sHTML == "undefined" && this.bInited == true) return;


    var d = new Date();
    var t = d.getTime();

    //sHTMLΪ������ݵ�XML��
    if (this.left == null) this.left = 0;
    if (this.top == null) this.top = 0;
    if (this.width == null) this.width = 550;
    if (this.height == null) this.height = 400;
    //alert(moverflow)

    //�� fcwebgriddiv �̶�Ϊ���Զ�λ��,��Ϊ����ߵĹ�������Ҫ����Զ�λ��. �� fcwebgriddiv���html table�̶�Ϊ��̬��.��Ϊ������Ҫ�ƶ�λ��. 2010-12-09 my edit
    //modify by liuxr at 2010-12-13 14:19 grid�ؼ����Ǿ��Զ�λ
    var sPosition = "";
    // if(this.left!=0 || this.top!=0) {
    sPosition = "position:absolute;";
    //}
    /*else if (IsSpace(sHTML)) {  //�Ǿ���ģʽʱ������λ�ñ仯ʱӦ���¶�λ
    //modify by liuxr at 2010-11-11 9:40 �����¼�ʱ���ݵ�ǰ�ؼ�ID��Ϊ����
    var myobj = new Object();
    myobj.objID = this.id;
    //window.attachEvent("onresize",this.onResize) ;
    NavJs.addEvent(window,"onresize",this.onResize,myobj) ;
    }*/

    var s1 = "";
    s1 = s1 + '<div id=fcwebgriddiv style="width:' + this.width + 'px;height:' + this.height + 'px;left:' + this.left + 'px;top:' + this.top + 'px;'
       + sPosition + 'OVERFLOW: ' + this.moverflow + '; " >';


    var sTab;

    if (arguments.length == 1) {
        sTab = sHTML;
    } else {
        sTab = $id(this.id).innerHTML; //element.innerHTML;
    }
    //CopyToPub(sTab)
    if (sTab.indexOf(" id=fcwebgriddiv ") >= 0) return;
    //��ƽ�����
    var sFlat = "BORDER-LEFT: gray 0px solid;BORDER-RIGHT: gray 0px solid;BORDER-TOP: gray 0px solid;BORDER-BOTTOM: gray 0px solid;";

    s1 = s1 + sTab;
    s1 = s1 + '<TABLE border=2 borderColor=blue cellSpacing=0 id=tc style="DISPLAY: none; LEFT: 4px; POSITION: absolute; TOP: 50px"><TR><TD></TD></TR></TABLE>';
    s1 = s1 + '<INPUT id=txtMyGrid style="DISPLAY: none; LEFT: 50px; POSITION: absolute; TOP: 50px" tabIndex=1 >';
    s1 = s1 + '</div>';
    //if(element.isContentEditable==false){
    s1 = s1 + '<TABLE bgColor=black border=0 cellPadding=0 cellSpacing=0 id=line style="DISPLAY: none; HEIGHT: 28px; LEFT: -270px; POSITION: absolute; TOP: 50px; WIDTH: 1px"><TR><TD></TD></TR></TABLE>';
    s1 = s1 + '<TABLE bgColor=black border=0 cellPadding=0 cellSpacing=0 id=lineH style="DISPLAY: none; HEIGHT: 1px; LEFT: -270px; POSITION: absolute; TOP: 50px; WIDTH: 35px"><TR><TD></TD></TR></TABLE>';

    var sHidden = ";display:none";
    if (Sys.Browser.agent == Sys.Browser.InternetExplorer) sHidden = "";

    s1 = s1 + '<div id=divconer style="POSITION: absolute'+sHidden +';"></div>';
    s1 = s1 + '<div id=fchtcDiv1 style="HEIGHT: 100px; LEFT: 0px; POSITION: absolute; TOP: 0px; WIDTH: 14px;overflow:hidden' + sHidden + ';" ></div>';
    s1 = s1 + '<div id=fcButton1 class=grid_scrollshang onmouseover="this.className=\'grid_scrollshang-over\'" onmouseout="this.className=\'grid_scrollshang\'" style="' + sFlat + ';HEIGHT: 15px; LEFT: 0px; POSITION: absolute; TOP: 0px; WIDTH: 14px;overflow:hidden' + sHidden + ';" ></div>';
    s1 = s1 + '<div id=fcButton2 class=grid_scrolltop  onmouseover="this.className=\'grid_scrolltop-over\'" onmouseout="this.className=\'grid_scrolltop\'"  onclick="this.className=\'grid_scrolltop-click\'"  style="' + sFlat + ';HEIGHT: 14px; LEFT: 0px; POSITION: absolute; TOP: 0px; WIDTH: 14px;overflow:hidden' + sHidden + ';" ></div>';
    s1 = s1 + '<div id=fcButton3 class=grid_scrollxia  onmouseover="this.className=\'grid_scrollxia-over\'" onmouseout="this.className=\'grid_scrollxia\'" style="' + sFlat + 'HEIGHT: 14px; LEFT:0px; POSITION: absolute; TOP: 0px; WIDTH: 14px;overflow:hidden' + sHidden + ';" ></div>';
    s1 = s1 + '<div id=fchtcDiv2 style="WIDTH: 100px; TOP: 0px; POSITION: absolute; LEFT: 0px; HEIGHT: 14px;overflow:hidden' + sHidden + ';"></div>';
    s1 = s1 + '<div  id=fcButton4 class=grid_scrollleft onmouseover="this.className=\'grid_scrollleft-over\'" onmouseout="this.className=\'grid_scrollleft\'" style="' + sFlat + 'HEIGHT: 14px; LEFT:0px; POSITION: absolute; TOP: 0px; WIDTH: 14px;overflow:hidden' + sHidden + ';" ></div>';

    s1 = s1 + '<div id=fcButton5 class=grid_scrolldown  onmouseover="this.className=\'grid_scrolldown-over\'" onmouseout="this.className=\'grid_scrolldown\'" onclick="this.className=\'grid_scrolldown-click\'" style="' + sFlat + ';  HEIGHT: 14px; TOP: 0px; POSITION: absolute; LEFT: 0px; WIDTH: 17px;overflow:hidden' + sHidden + ';"></div>';
    s1 = s1 + '<div id=fcButton6 class=grid_scrollright onmouseover="this.className=\'grid_scrollright-over\'" onmouseout="this.className=\'grid_scrollright\'" style="' + sFlat + 'HEIGHT: 14px; TOP: 0px; POSITION: absolute; LEFT: 0px; WIDTH: 14px;overflow:hidden' + sHidden + ';" ></div>';

    s1 = s1 + '<fc:fc_code id="czFc_' + this.id + '" position="absolute" onchange="var oGrid = $obj($id(this.id).parentNode.id); oGrid.curTD.innerText = this.value;this.gridposition = 88;oGrid.Act_onDataChange(\'ǿ�з������ݸı��¼�\');"  ></fc:fc_code>';
    //onchange="window.event.srcElement.parentNode.curTD.innerText=window.event.afterchangevalue;window.event.position=88;window.event.srcElement.parentNode.Act_onDataChange(\'ǿ�з������ݸı��¼�\')"
    //}
    // element.innerHTML=s1;
    $id(this.id).innerHTML = s1;

    //added by liuxr at 2010-12-20 9:58 ��fc:webgrid �ؼ��ڼ��϶�λ���� 
    if (sPosition == "") {
        //alert(navigator.userAgent);
        if (navigator.userAgent.indexOf("Safari") > 1) {
            $id(this.id).parentNode.style.position = "relative";
        }
        else {
            $id(this.id).style.position = "relative";
        }
    }

    this.div1 = $id(this.id).children[0];
    this.tgrid = $id(this.id).children[0].children[0];

    this.line = $id(this.id).children[1];
    this.lineH = $id(this.id).children[2];
    this.divconer = $id(this.id).children[3];
    this.fchtcDiv1 = $id(this.id).children[4];
    this.fcButton1 = $id(this.id).children[5];
    this.fcButton2 = $id(this.id).children[6];
    this.fcButton3 = $id(this.id).children[7];
    this.fchtcDiv2 = $id(this.id).children[8];
    this.fcButton4 = $id(this.id).children[9];
    this.fcButton5 = $id(this.id).children[10];
    this.fcButton6 = $id(this.id).children[11];
    //txtMyGrid=element.children[12]
    //this.cz=$id(this.id).children[12];
    if (typeof sHTML == "undefined") {

        this.cz = new dropdownlist('czFc_' + this.id);
        this.cz.fnInit();
        //try { } catch (ee) { }
        //��commonSelect.htm��ʱ,����û������fc_code.js�ļ�������,

    }


    //modify by liuxr at 2010-11-10 10:38 ��tab���Ը�ֵ
    this.tab = this.tgrid;
    //modify by liuxr at 2010-11-10 13:33 ��Rows��Cols���Ը�ֵ
    if (this.tgrid != null) {
        this.Rows = this.tgrid.rows.length;
        this.Cols = this.tgrid.childNodes[0].childNodes.length;
    }

    this.txtMyGrid = $id(this.id).children[0].children[2];
    //�Ա����Ԥ����
    //������Ԫ��
    //if(element.isContentEditable==false){

    var tmp1 = sTab.toUpperCase().indexOf("COLGROUP");
    if (tmp1 <= 0) {
        var cols = 0; //������
        for (var i = 0; i < this.tgrid.rows[0].cells.length; i++) {
            cols += this.tgrid.rows[0].cells[i].colSpan;
        }
        var sColgroup = "<colgroup>"; //����Ϣ��
        for (var i = 0; i < cols; i++) {
            sColgroup += "<col>";
        }
        sColgroup += "</colgroup>";
        var sTabNew = "";
        var iPos = sTab.indexOf(">");
        if (iPos > 0) {
            sTabNew += sTab.substring(0, iPos + 1) + sColgroup + sTab.substring(iPos + 1, sTab.length);
        }
        this.tgrid.outerHTML = sTabNew;
        this.tgrid = $id(this.id).children[0].children[0];
        //modify by liuxr at 2010-11-10 10:38 ��tab���Ը�ֵ
        this.tab = this.tgrid;
        //modify by liuxr at 2010-11-10 13:33 ��Rows��Cols���Ը�ֵ
        if (this.tgrid != null) {
            this.Rows = this.tgrid.rows.length;
            this.Cols = this.tgrid.childNodes[0].childNodes.length;
        }

        if (this.tgrid.style.display == "none") this.tgrid.style.display = "block";

        this.tgrid.style.tableLayout = "auto";

        for (var i = 0; i < cols; i++) {
            //try{
            this.tgrid.childNodes[0].childNodes[i].style.width = (this.tgrid.childNodes[0].childNodes[i].offsetWidth + 1) + "px";
            //}catch(e){}
        }
    }

    //��ÿ�м����и�
    if (this.tgrid.style.display == "none") this.tgrid.style.display = "block";
    //����trueTotrue�Է�colshow.htm error
    if (IsTrue(this.SetRowHeight)) {
        for (var i = 0; i < this.tgrid.rows.length; i++) {
            this.tgrid.rows[i].style.height = this.tgrid.rows[i].offsetHeight + "px";
        }
    }

    /*
    var tabAllHeight=0	//��¼�����ܸ߶�
    for(var i=0;i<tgrid.rows.length;i++){
    tabAllHeight+=tgrid.rows(i).offsetHeight
    tgrid.rows(i).style.height=tgrid.rows(i).offsetHeight
    }
    */
    //�Զ����߶ȺͿ��
    if (this.autosize) {
//        this.div1.style.height = this.tgrid.offsetHeight + "px";
//        this.div1.style.width = this.tgrid.offsetWidth + "px";
    }
    else {
        //�ָ���ȱʡֵ
        // 	div1.style.height=400
        //	div1.style.width=550
    }
    //�򱨱�δԤ�������
    this.tgrid.style.tableLayout = "fixed";

    this.tgrid.cellPadding = 4;
    //}  ;
    //--------------


    //if(element.isContentEditable==false){

    //modify by liuxr at 2010-11-11 9:40 �����¼�ʱ���ݵ�ǰ�ؼ�ID��Ϊ����
    var myobj = new Object();
    myobj = this;
    if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
        //this.divconer.attachEvent("ondblclick", this.scrollbar_ondblclick);
        NavJs.addEvent(this.divconer, "ondblclick", this.scrollbar_ondblclick, myobj);
        //this.fchtcDiv1.attachEvent("ondblclick", this.scrollbar_ondblclick);
        NavJs.addEvent(this.fchtcDiv1, "ondblclick", this.scrollbar_ondblclick, myobj);
        //this.fcButton1.attachEvent("ondblclick", this.scrollbar_ondblclick);
        NavJs.addEvent(this.fcButton1, "ondblclick", this.scrollbar_ondblclick, myobj);
        //this.fcButton2.attachEvent("ondblclick", this.scrollbar_ondblclick);
        NavJs.addEvent(this.fcButton2, "ondblclick", this.scrollbar_ondblclick, myobj);
        //this.fcButton3.attachEvent("ondblclick", this.scrollbar_ondblclick);
        NavJs.addEvent(this.fcButton3, "ondblclick", this.scrollbar_ondblclick, myobj);
        //this.fchtcDiv2.attachEvent("ondblclick", this.scrollbar_ondblclick);
        NavJs.addEvent(this.fchtcDiv2, "ondblclick", this.scrollbar_ondblclick, myobj);
        //this.fcButton4.attachEvent("ondblclick", this.scrollbar_ondblclick);
        NavJs.addEvent(this.fcButton4, "ondblclick", this.scrollbar_ondblclick, myobj);
        //this.fcButton5.attachEvent("ondblclick", this.scrollbar_ondblclick);
        NavJs.addEvent(this.fcButton5, "ondblclick", this.scrollbar_ondblclick, myobj);
        //this.fcButton6.attachEvent("ondblclick", this.scrollbar_ondblclick);
        NavJs.addEvent(this.fcButton6, "ondblclick", this.scrollbar_ondblclick, myobj);
        //this.line.attachEvent("onmousemove", this.line_onmousemove);
        NavJs.addEvent(this.line, "onmousemove", this.line_onmousemove, myobj);
        //this.lineH.attachEvent("onmousemove", this.lineH_onmousemove);
        NavJs.addEvent(this.lineH, "onmousemove", this.lineH_onmousemove, myobj);

        //this.fchtcDiv1.attachEvent("onclick", this.fchtcDiv1_onclick);
        NavJs.addEvent(this.fchtcDiv1, "onclick", this.fchtcDiv1_onclick, myobj);
        //this.fchtcDiv2.attachEvent("onclick", this.fchtcDiv2_onclick);
        NavJs.addEvent(this.fchtcDiv2, "onclick", this.fchtcDiv2_onclick, myobj);
        //this.fcButton1.attachEvent("onclick", this.fcButton1_onclick);

        NavJs.addEvent(this.fcButton1, "onclick", this.fcButton1_onclick, myobj);
        //this.fcButton3.attachEvent("onclick", this.fcButton3_onclick);
        NavJs.addEvent(this.fcButton3, "onclick", this.fcButton3_onclick, myobj);
        //this.fcButton4.attachEvent("onclick", this.fcButton4_onclick);
        NavJs.addEvent(this.fcButton4, "onclick", this.fcButton4_onclick, myobj);
        //this.fcButton6.attachEvent("onclick", this.fcButton6_onclick);
        NavJs.addEvent(this.fcButton6, "onclick", this.fcButton6_onclick, myobj);
        //this.fcButton2.attachEvent("onmousedown", this.fcButton2_onmousedown);
        NavJs.addEvent(this.fcButton2, "onmousedown", this.fcButton2_onmousedown, myobj);
        //this.fcButton2.attachEvent("onmousemove", this.fcButton2_onmousemove);
        //NavJs.addEvent(this.fcButton2,"onmousemove", this.fcButton2_onmousemoveold,myobj);
        //this.fcButton2.attachEvent("onmouseup", this.fcButton2_onmouseup);
        NavJs.addEvent(this.fcButton2, "onmouseup", this.fcButton2_onmouseup, myobj);
        //this.fcButton5.attachEvent("onmousedown", this.fcButton5_onmousedown);
        NavJs.addEvent(this.fcButton5, "onmousedown", this.fcButton5_onmousedown, myobj);
        //this.fcButton5.attachEvent("onmousemove", this.fcButton5_onmousemove);
        //NavJs.addEvent(this.fcButton5,"onmousemove", this.fcButton5_onmousemoveold,myobj);
        //this.fcButton5.attachEvent("onmouseup", this.fcButton5_onmouseup);
        NavJs.addEvent(this.fcButton5, "onmouseup", this.fcButton5_onmouseup, myobj);

        //this.div1.attachEvent("onmousedown", this.div1_onmousedown);
        NavJs.addEvent(this.div1, "onmousedown", this.div1_onmousedown, myobj);
        //this.div1.attachEvent("onmousemove", this.div1_onmousemove);
        NavJs.addEvent(this.div1, "onmousemove", this.div1_onmousemove, myobj);
        //this.div1.attachEvent("onmouseup", this.div1_onmouseup);
        NavJs.addEvent(this.div1, "onmouseup", this.div1_onmouseup, myobj);

        //this.div1.attachEvent("oncontextmenu", this.closeright);
        //NavJs.addEvent(this.div1,"oncontextmenu", this.closeright,myobj);
        //this.div1.attachEvent("onmousewheel", this.div1_onmousewheel);
        NavJs.addEvent(this.div1, "onmousewheel", this.div1_onmousewheel, myobj);
    }
    //this.tgrid.attachEvent("onclick", this.tgrid_onclick);
    NavJs.addEvent(this.tgrid, "onclick", this.tgrid_onclick, myobj);
    //this.tgrid.attachEvent("ondblclick", this.tgrid_ondblclick);
    NavJs.addEvent(this.tgrid, "ondblclick", this.tgrid_ondblclick, myobj);



    //txtMyGrid.attachEvent("onblur", txtMyGrid_onblur)
    //this.txtMyGrid.attachEvent("onkeyup", txtMyGrid_onkeyup);
    //NavJs.addEvent(this.txtMyGrid,"onkeyup", txtMyGrid_onkeyup,myobj);
    //this.txtMyGrid.attachEvent("onkeydown", this.txtMyGrid_onkeydown);
    NavJs.addEvent(this.txtMyGrid, "onkeydown", this.txtMyGrid_onkeydown, myobj);
    //this.txtMyGrid.attachEvent("onkeypress", this.txtMyGrid_onkeypress);
    NavJs.addEvent(this.txtMyGrid, "onkeypress", this.txtMyGrid_onkeypress, myobj);
    //this.txtMyGrid.attachEvent("onfocusout", this.txtMyGrid_onfocusout);
    NavJs.addEvent(this.txtMyGrid, "onfocusout", this.txtMyGrid_onfocusout, myobj);
    //txtMyGrid.attachEvent("onclick", txtMyGrid_onclick)
    //txtMyGrid.attachEvent("ondblclick", txtMyGrid_ondblclick)

    //	element.document.attachEvent("onkeydown", onkeydown)
    //this.tgrid.attachEvent("onkeydown", this.tgrid_onkeydown);
    NavJs.addEvent(this.tgrid, "onkeydown", this.tgrid_onkeydown, myobj);
    NavJs.addEvent(this.tgrid, "onkeypress", this.tgrid_onkeypress, myobj);
    var icont = 1;
    icont = 13;

    for (var i = 0; i < icont; i++) {
        //$id(this.id).children[i].attachEvent("onfocusout", this.tgrid_onfocusout);
        NavJs.addEvent($id(this.id).children[i], "onfocusout", this.tgrid_onfocusout, myobj);
        //$id(this.id).children[i].attachEvent("onfocusin", this.tgrid_onfocusin);
        NavJs.addEvent($id(this.id).children[i], "onfocusin", this.tgrid_onfocusin, myobj);
    }


    this.curObj = this.tgrid.rows[0].cells[0];
    //added by liuxr at 2010-11-11 10:22 ��curTD���Ը�ֵ
    this.curTD = this.curObj;

    if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
        /* ! added by liuxr at 2010-12-7 14:37 ��Row���Ը�ֵ this.curObj.parentNode.rowIndex*/
        this.Row = this.curObj.parentNode.rowIndex;
        /* ! added by liuxr at 2010-12-7 14:37 ��Col���Ը�ֵ this.curObj.cellIndex*/
        this.Col = this.curObj.cellIndex;
    }

    this.tgrid.id = "t";
    //alert(mcoledit)
    //fnPutcoledit(mcoledit,1)

    this.fnPutvisible(this.visible);
    this.fnPutScrollBar(this.mScrollBar);
    //onResize()
    var d = new Date();
    var t1 = d.getTime();
    //alert("ʱ��:"+(t1-t))	
    //} //if end
    if (typeof sHTML == "undefined" && this.bInited == false) this.bInited = true;

}
/**
*�������¼�
*date 2005-02-15
**/
webgrid.prototype.div1_onmousewheel = function() {

    var gridobj = this;
    var event = NavJs.getEvent();

    //modify by liuxr at 2009-9-22 ����ڱ�����������ݺ�ֱ�������������󣬸���������ݶ�ʧ������
    if (gridobj.txtMyGrid.style.display != "none") {
        gridobj.txtMyGrid_onfocusout()
    }

    if (IsTrue(gridobj.autosize)) return;
    var wheelDelta = event.wheelDelta;

    var detail = event.detail;
    //alert(detail);
    if (wheelDelta >= 120 || detail <= -3)
        gridobj.fcButton1_onclick();
    else if (wheelDelta <= -120 || detail >= 3)
        gridobj.fcButton3_onclick();

}
/*******************����Put����************************/
webgrid.prototype.fnPutcoledit = function(vValue, itype) {
    try {
        if (isSpace(vValue) == false) {

            var oXml = SetDom(vValue);

            for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
                if (oXml.documentElement.childNodes[i].tagName.toLowerCase() != "readonly") {
                    //alert(oXml.documentElement.childNodes(i).xml)
                    //modify by liuxr at 2010-11-15 11:10 .xml�����ڷ�IE��������²���ʹ�ã���NavJs.xml(node) �����������������
                    //this.SetCol(i,oXml.documentElement.childNodes[i].xml);
                    this.SetCol(i, NavJs.xml(oXml.documentElement.childNodes[i]));
                }
            }
        }
    } catch (e) { }
    this.coledit = vValue;
    //coleditID.fireChange();
}

webgrid.prototype.fnPutRows = function(vValue) {
    if (isNaN(parseInt(vValue))) return;
    if (parseInt(vValue) < this.FixRows || parseInt(vValue) < 1) return;

    var oldRows = this.tgrid.rows.length;
    if (oldRows > vValue) {
        for (var i = 0; i < oldRows - vValue; i++) {
            this.DeleteRow();
        }
    }
    else if (oldRows < vValue) {
        for (var i = 0; i < vValue - oldRows; i++) {
            this.InsertRow();
        }
    }
    this.ActionAutoScroll("V"); //���������=autoʱ�����
    this.Vmax = this.getVScrollMax();
    this.fnPutVscrollmax(this.Vmax);

    //RowsID.fireChange();
}

webgrid.prototype.fnPutCols = function(vValue) {
    if (isNaN(parseInt(vValue))) return;
    if (parseInt(vValue) < this.FixCols || parseInt(vValue) < 1) return;
    var oldCols = this.tgrid.childNodes[0].childNodes.length;
    if (oldCols > vValue) {
        for (var i = 0; i < oldCols - vValue; i++) {
            this.DeleteCol();
        }
    }
    else if (oldCols < vValue) {
        for (var i = 0; i < vValue - oldCols; i++) {
            this.InsertCol();
        }
    }
    this.ActionAutoScroll("H"); //���������=autoʱ�����
    this.Hscrollmax = this.getHScrollMax();
    this.fnPutHscrollmax(this.Hscrollmax);
    //ColsID.fireChange();
}

webgrid.prototype.fnPutheight = function(vValue) {
    if (this.autosize) return;
    vValue = NavJs.setHeight(this.div1, ToInt(vValue));
    this.height = vValue;
    try {
        this.onResize();
     } catch (e) { } //��left����д�ڿؼ���ʱ�����,��Ҫǿ�йر�

}

webgrid.prototype.fnPutwidth = function(vValue) {
    if (this.autosize) return;

    vValue = NavJs.setWidth(this.div1, ToInt(vValue));
    this.width = vValue;
    try {
        this.onResize();
    } catch (e) { } //��left����д�ڿؼ���ʱ�����,��Ҫǿ�йر�

}
//����һ�е�TD��
webgrid.prototype.SetCheckBoxCol = function(curcol, isReadOnly) {
    var ogrid = $obj(this.id);
    var l = ogrid.tab.rows.length;
    var istart = ogrid.FixRows;
    for (var i = istart; i < l; i++) {
        var oTd = ogrid.tab.rows[i].cells[curcol];
        oTd.style.backgroundRepeat = "no-repeat";
        if (IsTrue(oTd.innerText)) {
            if (isReadOnly)
                oTd.style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checkdisabled.gif)";
            else
                oTd.style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checked.gif)";
        } else {
            if (isReadOnly)
                oTd.style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheckdisabled.gif)";
            else
                oTd.style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheck.gif)";

        }
        oTd.style.backgroundPosition = "center center";
        oTd.innerText = "";
    }
    if (isReadOnly)
        ogrid.SetCol(curcol, "<checkbox_readonly></checkbox_readonly>");
    else
        ogrid.SetCol(curcol, "<checkbox></checkbox>");
}