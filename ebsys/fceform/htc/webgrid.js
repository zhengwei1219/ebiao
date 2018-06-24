///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

/**
* 重写webgrid.htc
* 2010-11-5
* liuxr
**/
function webgrid(obj) {
    this.id = obj;
    this.bInited = false;
    /* IE6的光标形状为col-resize,row-resize.IE5下为move  */
    this.cursorcolresize = "col-resize";
    this.cursorrowresize = "row-resize";
    if (getIEVersion() < 6) {
        this.cursorcolresize = "move";
        this.cursorrowresize = "move";
    }
    /* 控件传递全局的fccode控件的onclickopen对象值 */
    this.ponclickopen = "";
    /* 最后行的状态 */
    this.EndRowState = "edit";
    //点击表格取得焦点
    //var pubFirstClickTab=""

    //this.pubeval = 0;
    this.dataset = $id(this.id).getAttribute("dataset");
    //判断进入文本框后是否按了键
    //var bHitKey=false
    //oldTD在按键改变前的值
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
    //缺省是只读,
    //TXT分数据类型(字符<最大长度>,数字<小数位数>,日期)
    //CODE分.....
//    this.arr = new Array(100);
    this.bDrag = false;
    this.curY = 0;
//    this.lngTop = 0;

    //this.Vscrollmax = 0;//=5 //范围
    this.Vmax = 0;                  //modify by liuxr at 2010-12-7 14:16 用Vmax代替Vscrollmax
    this.TopRow = 0;                //modify by liuxr at 2010-12-7 14:16 用TopRow代替Vscrollvalue
    //this.Vscrollvalue = 0; //当前值

    ////////////////////////Hscroll
    this.bHDrag = false;
    this.curX = 0;
//    this.lngLeft = 0;
//    
    
    this.Hscrollmax = 0; //=5 //范围
    this.Hscrollvalue = 0; //当前值

    this.curObj; //当前TD
    this.preTD = null; //上一个输入TD
    this.lostfocusTD = null; //表格失去焦点后将当前TD保存到此变量中
    //this.mcurRow, this.mcurCol;

    //保存表格的上层的偏移值,在onresize函数中计算
//    this.iUpLeft = 0;
//    this.iUpTop = 0;
//    
    this.blnAdjust = false;
    this.blnAdjustH = false;
    this.AdjustRow = 0, this.AdjustCol = 0;
    this.FixRows = 1; //固定行数
    this.FixCols = 1; //固定行数
    //this.blnFixRowDrap = true; //为真表示固定行上能拖动但不能选择

    this.ReadOnly = false;

    

    this.mScrollBar = "yes";
    this.autosize = ($id(this.id).getAttribute("autosize") == "是") ? true : false;

    this.left = $id(this.id).getAttribute("left");
    this.top = $id(this.id).getAttribute("top");
    this.height = $id(this.id).getAttribute("height");
    this.width = $id(this.id).getAttribute("width");

    this.coledit;
    this.moverflow = $id(this.id).getAttribute("overflow"); //scroll/hidden
    if (IsSpace(this.moverflow)) this.moverflow = "auto"; // "hidden";
    //this.bCell = false;
    //this.ColShow = false;
    this.visible = "是";
    this.canselect = ($id(this.id).getAttribute("canselect") == "否") ? "否" : "是";
    this.SetRowHeight = $id(this.id).getAttribute("SetRowHeight");
    this.bodyrowheight = $id(this.id).getAttribute("bodyrowheight");

    /* 能否调整行高和列宽*/
    this.AdjustColWidth = false;
    this.AdjustRowHeight = false;

    this.IsOrder = "是";

    this.hideVscroll = $id(this.id).getAttribute("hideVscroll") ; //IsTrue(
    this.hideHscroll = $id(this.id).getAttribute("hideHscroll");

    //this.lngHideRows = 0;
    this.ParentPos = $id(this.id).getAttribute("ParentPos");

    //modify by liuxr at 2010-11-10 10:38 设置tab属性值
    this.tab = this.tgrid;

    /* ! added by liuxr at 2010-11-10 10:53 给format属性赋值*/
    this.format = $id(this.id).getAttribute("format");

    /* ! added by liuxr at 2010-11-10 11:27 给blRowNo属性赋值*/
    this.blRowNo = $id(this.id).getAttribute("blRowNo");

    /* ! added by liuxr at 2010-11-10 11:27 给Rows属性赋值*/
    this.Rows = 0;

    /* ! added by liuxr at 2010-11-10 11:27 给Cols属性赋值*/
    this.Cols = 0;

    /* ! added by liuxr at 2010-11-11 10:27 给curTD属性赋值*/
    this.curTD = this.curObj;

    /* ! added by liuxr at 2010-12-7 14:37 给Row属性赋值 this.curObj.parentNode.rowIndex*/
    this.Row = 0;
    /* ! added by liuxr at 2010-12-7 14:37 给Col属性赋值 this.curObj.cellIndex*/
    this.Col = 0;

    //------------------- my add
    this.offsetValue; //调整行高列宽时的调节值.


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
*计算垂直滚动条的滚动范围
**/
webgrid.prototype.VScroll = function() {
    this.ActionAutoScroll("V"); //处理滚动条=auto时的情况
    this.Vmax = this.getVScrollMax();
    this.fnPutVscrollmax(this.Vmax);
}

/**
*计算水平滚动条的滚动范围
**/
webgrid.prototype.HScroll = function() {
    this.ActionAutoScroll("H"); //处理滚动条=auto时的情况
    this.Hscrollmax = this.getHScrollMax();
    this.fnPutHscrollmax(this.Hscrollmax);
}
/**
*输入框失去焦点事件,
**/
webgrid.prototype.txtMyGrid_onfocusout = function() {

    var gridobj = this;

    gridobj.BeforeChangeText = gridobj.curObj.innerText;
    gridobj.txtTotd();
    if (gridobj.Act_onDataChange() == false) {
    }

}
/**
*表格失去焦点事件,
**/
webgrid.prototype.tgrid_onfocusout = function() {
    //var oNext=event.toElement
    var gridobj = this;

    var bln = false;
    //added by liuxr at 2010-11-5 16:11 获取兼容浏览器的event对象
    var event = NavJs.getEvent();
    var o = event.toElement || event.relatedTarget;

    if (o == null) return; //点到地址栏上,此为null
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
        //window.status=window.status+" 表格失去焦点:"+event.srcElement.id
    }
}
/**
*表格获得焦点事件
**/
webgrid.prototype.tgrid_onfocusin = function() {

    var gridobj = this;

    var bln = false;
    //added by liuxr at 2010-11-5 16:11 获取兼容浏览器的event对象
    var event = NavJs.getEvent();
    var o = event.fromElement || event.target;

    if (o == null) return; //切换IE时为null
    if (IsSpace(o.tagName)) return;
    var tagname = o.tagName.toUpperCase();
    var focusTD = null;
    var ocur = null;  //当前TD
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
                //2004-04-30 防止从表格到别的控件再点击表格时不对
                gridobj.SetFocus(ocur, ""); //移动数据集
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
        //window.status=window.status+" 表格取得焦点:"
    }
}
/**
*找到第一个能有焦点的TD
*@param irowfocus 整型,表示找此行的第一个能有焦点的TD
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
            //判断是否是因滚动隐藏而列宽为0
            var colwidth1 = this.tgrid.childNodes[0].childNodes[i].getAttribute("oldwidth");
            if (isSpace(colwidth1))
                colwidth1 = this.tgrid.rows[0].cells[i].offsetWidth;
            else
                colwidth1 = parseInt(colwidth1);
            if (colwidth1 > 1) {
                if (this.tgrid.children[0].children[i].getAttribute("cz") != null) {
                    var temprow = this.tgrid.rows.length - 1;
                    if (isSpace(irowfocus) == false && irowfocus < this.tgrid.rows.length) temprow = irowfocus;

                    //到第一行在用下移键加行时会出错,所以到最后一行.
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
*设置焦点到表格
调用时机:在表格控件上点击且isfocus为真,在用TAB键导航时直接用代码调用.自动加行时也调用它来置焦点
功能:	 计算出表格的第一个有效TD(列宽不为0),并让它高亮显示,给curObj 和preTD mcurRow mcurCol的值

*@param td 为表格的某个单元,可为null
*@param sTag =程序给焦点 表示点击表格得到焦点
**/
webgrid.prototype.SetFocus = function(td, sTag) {

    //alert(td)
    if (this.ReadOnly == true || this.canselect == "否") return;
    try {
        NavJs.setClassName(this.curObj,""); //自动加行时去原来的焦点  
        this.RemoveBackColor();
    } catch (e) { }
    if (sTag != "程序给焦点") { //点击表格得焦点
        this.preTD = this.curObj;

        this.SetTDFilter();
        return;
    }

    if (td == null) {
        //至少有一内容行
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

    //added by liuxr at 2010-11-11 10:22 给curTD属性赋值
    this.curTD = this.curObj;
    if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
        /* ! added by liuxr at 2010-12-7 14:37 给Row属性赋值 this.curObj.parentNode.rowIndex*/
        this.Row = this.curObj.parentNode.rowIndex;
        /* ! added by liuxr at 2010-12-7 14:37 给Col属性赋值 this.curObj.cellIndex*/
        this.Col = this.curObj.cellIndex;
    }

    //mcurRow=curObj.parentNode.rowIndex
    //mcurCol=curObj.cellIndex
    //preTD.className="";
    //curObj.className="tdfilter" 

    //if(sTag=="移动数据集" && lostfocusTD==null ){  
    //	MoveDataSet()
    //}
    //alert("eeee")
    this.SetTDFilter();


    //防止看不见的单元格获得焦点造成自动滚动.
    if (this.curObj.offsetTop < parseInt(this.div1.style.height)) {
        try {
            this.curObj.focus();
        } catch (E) { }
    } else {
        //暂时给tgrid
        this.tgrid.focus();
    }
}
/**
*表格的失去焦点方法
调用时机:在其它控件上点击且isblur为真,在用TAB键导航时直接用代码调用.
功能:    清除表格的高亮显示.
*@date 2003-09-15
**/
webgrid.prototype.LostFocus = function() {
    this.lostfocusTD = this.curObj;

    //保存fset中的数据到dataset中
    if (isSpace(this.dataset) == false) {
        var oDs = $obj(this.dataset);
        if (oDs != null && oDs.RecordCount > 0 && (oDs.bAdd || oDs.bEdit)) {
            oDs.Update('不检查');
            NavJs.setClassName(this.curObj,"");
            this.txtMyGrid.style.display = "none";
        }
    }

}
/**
*重新将当前TD的值送给编辑框,常用于用程序直接给了后端表格的值,此时要刷新编辑框
**/
webgrid.prototype.RefreshEdit = function() {
    this.tdTotxt();
}
/**
移动数据集的指针
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
*装入一个XML数据作表格内容
*@param sXml 要装入的XML数据
**/
webgrid.prototype.LoadXmlData = function(sXml) {
    this.fnInit(sXml);
}
/**
*滚动一步
*@param Direct =1 2 3 4 分别表示向四个方向
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
//设置col列的参照类型
//属性的XML串
//CODE的XML串格式:
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
*插入列
*@param index 插入的位置
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

    //added by liuxr at 2011-11-30 10:58 解决插入列后，Cols取值不准确的问题
    this.Cols = this.tgrid.childNodes[0].childNodes.length;
    
    this.ActionAutoScroll("H"); //处理滚动条=auto时的情况
    this.Hscrollmax = this.getHScrollMax();
    this.fnPutHscrollmax(this.Hscrollmax);

}
/**
*插入行
*index插入的位置
**/
webgrid.prototype.InsertRow = function(index) {

    var iPos = this.tgrid.rows.length;
    if (arguments.length == 1 && iPos > index)
        iPos = index;

    //置EndRowState为"add"
    if (this.EndRowState == "edit" && iPos == this.tgrid.rows.length) {
        this.EndRowState = "add";
    }

    //alert(iPos+"=="+tgrid.rows.length)

    var oTr = this.tgrid.insertRow(iPos);

    //added by liuxr at 2011-11-30 10:58 插入行后改变Rows属性值
    this.Rows = this.tgrid.rows.length;

    //取标题行作默认行高
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

    //-------added by liuxt at 2008-8-5 增加行时设置行高
    var rowHeight = -1;
    if (!IsSpace(this.bodyrowheight))
        rowHeight = this.bodyrowheight;
    if (parseInt(rowHeight, 10) > 0)
        oTr.style.height = rowHeight + "px";
    else
        oTr.style.height = (iFontSize + 8 )+ "px"; //15  //4 //tgrid.style.fontSize*4/3
    //mcurRow=iPos
    //------------------------------//
    this.ActionAutoScroll("V"); //处理滚动条=auto时的情况
    this.Vmax = this.getVScrollMax();
    this.fnPutVscrollmax(this.Vmax);
    return oTr;
}
/**
*删除行
*@param index 删除行的位置
*@return 无
**/
webgrid.prototype.DeleteRow = function(index) {

    var iPos = this.tgrid.rows.length - 1;

    if (arguments.length == 1 && iPos > index)
        iPos = index;

    //置EndRowState为"add"
    if (this.EndRowState == "add" && iPos == this.tgrid.rows.length - 1) {
        this.EndRowState = "edit";
    }


    //固定行不能删除
    if (this.tgrid.rows.length <= this.FixRows || index < this.FixRows) return;

    this.tgrid.deleteRow(iPos);

    //added by liuxr at 2011-11-30 10:58 删除行后改变Rows属性值
    this.Rows = this.tgrid.rows.length;

    this.ActionAutoScroll("V"); //处理滚动条=auto时的情况
    this.Vmax = this.getVScrollMax();
    this.fnPutVscrollmax(this.Vmax);

}
/**
* @func 重算grid行号
* @date 2009-5-15
* @author liuxr
**/
webgrid.prototype.ReCalRowNo = function(){
    if (IsSpace(this.blRowNo)) this.blRowNo = "否";
    if (this.blRowNo == "否") return;

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
*删除列
*index插入的位置
**/
webgrid.prototype.DeleteCol = function(index) {
    var iPos = this.tgrid.childNodes[0].childNodes.length - 1;
    if (arguments.length == 1 && iPos > index)
        iPos = index;
    this.tgrid.children[0].removeChild(this.tgrid.children[0].children[iPos]);
    //固定行不能删除
    if (this.tgrid.childNodes[0].childNodes.length <= this.FixCols || index <= this.FixCols) return;

    for (i = 0; i <= this.tgrid.rows.length - 1; i++) {
        this.tgrid.rows[i].deleteCell(iPos);
    }

    //added by liuxr at 2011-11-30 10:58 解决删除列后，Cols取值不准确的问题
    this.Cols = this.tgrid.childNodes[0].childNodes.length;

    this.ActionAutoScroll("H"); //处理滚动条=auto时的情况
    this.Hscrollmax = this.getHScrollMax();
    this.fnPutHscrollmax(this.Hscrollmax);
}
webgrid.prototype.fnPutvisible = function(vValue) {
    this.visible = vValue;
    if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
        try {
            //全部显示
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

        } else {	//auto模式
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
        if (sHeight < 10) //10为最小母指宽度
            this.fcButton2.style.height = 10;
        else
            this.fcButton2.style.height = sHeight;
        if (this.TopRow > this.Vmax)
            this.TopRow = this.Vmax;
    }
    //当自动出滚动条时
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

    //modify by liuxr at 2009-9-22 解决在表格上输入数据后直接拉动滚动条后，刚输入的数据丢失的问题
    if (gridobj.txtMyGrid.style.display != "none") {
        gridobj.txtMyGrid_onfocusout();
    }
    if (gridobj.Vmax == 0) return;
    //var avar=( this.fchtcDiv1.style.pixelHeight-this.fcButton1.style.pixelHeight-this.fcButton2.style.pixelHeight - this.fcButton3.style.pixelHeight )/this.Vmax;
    var avar = (parseInt(gridobj.fchtcDiv1.style.height) - parseInt(gridobj.fcButton1.style.height) - parseInt(gridobj.fcButton2.style.height) - parseInt(gridobj.fcButton3.style.height)) / gridobj.Vmax;
    if (avar == 0) return;

    if (typeof changeHeight == "undefined") changeHeight = event.screenY - gridobj.curY;
    var changeValue = Math.round(changeHeight / avar);

    //changeValue变化值
    if (changeValue != 0) {
        //2011-05-27 沈繁荣 添加行时滚动条点击出错
        if (IsSpace(gridobj.TopRow)) gridobj.TopRow = 0;

        var oldvalue = gridobj.TopRow;
        gridobj.TopRow = gridobj.TopRow + changeValue;
        gridobj.fcButton2.style.top = (parseInt(gridobj.TopRow) * avar + parseInt(gridobj.fcButton1.style.top) + parseInt(gridobj.fcButton1.style.height))+"px";
        gridobj.Vscroll_check(oldvalue, gridobj.TopRow);
        //Vscroll_onchange(oldvalue,TopRow);

        //给新的Y值
        gridobj.curY = event.screenY;
    }

}
webgrid.prototype.fcButton2_onmouseup = function() {
    //alert(1);
    var gridobj = this;
    var event = NavJs.getEvent();
    //alert(gridobj.bDrag);
    if (gridobj.bDrag)//表示按下了mousedown
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
    //avar为除所有按钮外的空白区域除以滚动范围
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
//越界检查
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
        if (sWidth1 < 10) //10为最小母指宽度
            this.fcButton5.style.width = 10;
        else
            this.fcButton5.style.width = (sWidth1 + 1)+"px";
        if (this.Hscrollvalue > this.Hscrollmax)
            this.Hscrollvalue = this.Hscrollmax;
    }
    //当自动出滚动条时
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


    //modify by liuxr at 2009-9-22 解决在表格上输入数据后直接拉动滚动条后，刚输入的数据丢失的问题
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
    if (this.moverflow != "hidden") return 0; //防止重算行高，2013-08-21
    
    var lngMax = 0; //使最底下的行能看到
    var lngRowH = 0;
    //固定列的宽度
    var height0 = 0;
    //计算固定行高
    for (var i = 0; i < this.FixRows; i++) {//lngFixRows为固定行数
        height0 = height0 + parseInt(this.tgrid.rows[i].style.height);
    }

    for (var i = this.tgrid.rows.length - 1; i > 0; i--) {
        lngRowH = lngRowH + this.tgrid.rows[i].offsetHeight;
        //		lngRowH=lngRowH+tgrid.rows(i).style.pixelHeight
        if (lngRowH > parseInt(this.div1.style.height) - height0 - 17 || (this.tgrid.rows[i].offsetHeight == 0 && i > 1)) { //,add || tgrid.rows(i).offsetHeight == 0 防止数据集属性框中,只有一行时还有滚动.
            lngMax = i - this.FixRows + 1;
            break;
        }
    }

    return lngMax;
}
webgrid.prototype.getHScrollMax = function() {
    if (this.moverflow != "hidden") return 0;
    //取得滚动范围
    var lngMax = 0;
    var lngRowH = 0;
    //固定列的宽度
    var width0 = 0;
    //计算固定行高
    for (var i = 0; i < this.FixCols; i++) {//lngFixRows为固定行数
        width0 = width0 + parseInt(this.tgrid.children[0].children[0].style.width);
    }
    for (var i = this.tgrid.children[0].children.length - 1; i > 0; i--) {
        //如某列滚动隐藏,则其宽度为0
        if (parseInt(this.tgrid.children[0].children[i].style.width) == 0) {
            var s1 = this.tgrid.childNodes[0].childNodes[i].getAttribute("oldwidth");
            if (isSpace(s1) == false) {
                lngRowH = lngRowH + parseInt(s1);
            }
        }
        else {
            lngRowH = lngRowH + parseInt(this.tgrid.children[0].children[i].style.width);
        }
        if (lngRowH - width0 > parseInt(this.div1.style.width) - 17) {//17为底高
            //alert(lngRowH+">"+(div1.style.pixelWidth-width0-17))
            lngMax = i - this.FixCols + 1;
            break;
        }
    }

    return lngMax;
}
webgrid.prototype.Vscroll_onchange = function(oldValue, newValue) {
    //oldValue,newValue滚动前后的值
    //竖直滚动到的位置tgrid.style.top=0（在未移动时相对div1的位置）
    //使表格滚动到Vscrollvalue
    //oldValue,newValue为滚动前后的值

    if (newValue > oldValue) {
        //往下滚
        for (var i = oldValue + this.FixRows; i < newValue + this.FixRows; i++) {
            this.HideRow(i);
        }
    }
    if (newValue < oldValue) {
        //往上滚
        for (var i = newValue + this.FixRows; i < oldValue + this.FixRows; i++) {
            this.ShowRow(i);
        }
        //added by liuxr at 2009-9-17 向上滚动后设置grid焦点，解决出现空白行的问题。
        try { this.SetFocus(1, ""); }
        catch (e) { }
    }
    this.Actmoveedit();
    this.txtMyGrid.style.display = "none";
    //onVscrollID.fire();
}
webgrid.prototype.Hscroll_onchange = function Hscroll_onchange(oldValue, newValue) {
    //	HScrollTo(oldValue,newValue)
    //竖直滚动到的位置tgrid.style.top=0（在未移动时相对div1的位置）
    //oldValue,newValue为滚动前后的值


    if (newValue > oldValue) {
        //往下滚
        for (var i = oldValue + this.FixCols; i < newValue + this.FixCols; i++) {
            this.HideCol(i);
        }
    }
    if (newValue < oldValue) {
        //往上滚
        for (var i = newValue + this.FixCols; i < oldValue + this.FixCols; i++) {
            this.ShowCol(i);
        }
    }
    this.Actmoveedit();
    //onHscrollID.fire();

}
webgrid.prototype.LeftToCol = function(lngLeft) {
    //由offsetLeft计算列
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
//输入报表模版模式:只能在第一行拖动,运行查询报表模式:在固定行上可以拖动
webgrid.prototype.div1_onmousedown = function() {
    //先运行t_onmousedown
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
    //下面是为了防止表中套表中，求到子表的当前列。
    if (gridobj.curCol >= gridobj.tgrid.rows[0].cells.length)
        gridobj.curCol = gridobj.tgrid.rows[0].cells.length - 1;
    //调节列宽
    if (gridobj.tgrid.rows[curRow].style.cursor == gridobj.cursorcolresize) {
        gridobj.line.style.display = "block";
        gridobj.div1.setCapture();
        gridobj.offsetValue = (event.x || event.pageX) + window.document.body.scrollLeft; //+parseInt(div1.offsetLeft)

        //added by liuxr at 2009-9-23 9:55 grid控件拖动列宽时光标错位
        if (gridobj.ParentPos == "相对") gridobj.offsetValue = gridobj.offsetValue - getAbsLeft(gridobj.div1);
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
    //调节行高
    if (gridobj.tgrid.rows[0].cells[curCol].style.cursor == gridobj.cursorrowresize) {
        gridobj.lineH.style.display = "block";
        gridobj.div1.setCapture();
        gridobj.offsetValue = (event.y || event.pageY) + window.document.body.scrollTop;

        //added by liuxr at 2009-9-23 9:55 grid控件拖动列宽时光光标错位
        if (gridobj.ParentPos == "相对") gridobj.offsetValue = gridobj.offsetValue - getAbsTop(div1) + parseInt(this.left, 10); ;

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

    //added by liuxr at 2009-9-23 9:55 grid控件拖动列宽时光标错位	
    var iLinePosWidth = (event.x ) + window.document.body.scrollLeft - getAbsLeft(gridobj.div1);
    var iLinePosHeight = (event.y) + window.document.body.scrollTop - getAbsTop(gridobj.div1);

    gridobj.tgrid.childNodes[0].childNodes[0].style.cursor = "default";

    if (gridobj.blnAdjust == true) {
        //modify by liuxr at 2009-9-23 10:00 解决grid控件拖动列宽光标错位
        var iPosTmp = (event.x) + window.document.body.scrollLeft;
        if (gridobj.ParentPos == "相对") iPosTmp = iLinePosWidth + parseInt(this.left, 10); // 2010-09-07 add + parseInt(mleft, 10)
        gridobj.line.style.left = iPosTmp;
    }
    else if (gridobj.blnAdjustH == true) {
        //modify by liuxr at 2009-9-23 10:00 解决grid控件拖动列宽光标错位
        var iPosTmp = (event.y) + window.document.body.scrollTop;
        if (gridobj.ParentPos == "相对") iPosTmp = iLinePosHeight;
        gridobj.lineH.style.top = iPosTmp;
    }
    else {//变列鼠标形状
        //此段是为了防止在表格中间也能出现修改表格列宽和行高的线
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
            //可以改变列宽
            gridobj.tgrid.rows[curRow].style.cursor = "default";
            //不能调整列宽则返回
            if (gridobj.AdjustColWidth == false) return;
            //alert("test")
            for (var i = 0; i < gridobj.tgrid.rows[curRow].cells.length; i++) {
                //如某列隐藏了则offsetLeft offsetWidth都等于0
                if (gridobj.tgrid.childNodes[0].childNodes[i].style.display != "none") {
                    if (iLinePosWidth >= gridobj.tgrid.rows[curRow].cells[i].offsetLeft + gridobj.tgrid.rows[curRow].cells[i].offsetWidth - 4 && iLinePosWidth <= gridobj.tgrid.rows[curRow].cells[i].offsetLeft + gridobj.tgrid.rows[curRow].cells[i].offsetWidth + 4) {
                        //当左边框不为空时将使单元格的offsetLeft为1
                        if (gridobj.tgrid.style.borderLeftStyle == "none") {
                            var iTmpLeft = parseInt(gridobj.tgrid.rows[curRow].cells[i].offsetLeft) + 1;
                        }
                        else {
                            var iTmpLeft = parseInt(gridobj.tgrid.rows[curRow].cells[i].offsetLeft);
                        }

                        var offsetCol = gridobj.LeftToCol(iTmpLeft);
                        //如大于中间线则调后面的列宽
                        //alert(gridobj.tgrid.rows[curRow].cells[i].offsetWidth);

                        if (iLinePosWidth >= iTmpLeft + parseInt(gridobj.tgrid.rows[curRow].cells[i].offsetWidth)) {
                            //调隐藏列的列宽
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
                            else {	//后面无一个隐藏列
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
        //改变行高

        if (curCol < gridobj.FixCols) {

            gridobj.tgrid.childNodes[0].childNodes[curCol].style.cursor = "default";
            //不能调整行高则返回
            if (gridobj.AdjustRowHeight == false) return;
            //可以改变行高
            for (var i = 0; i < gridobj.tgrid.rows.length; i++) {
                //如某列隐藏了则offsetLeft offsetWidth都等于0
                if (gridobj.tgrid.rows[i].style.display != "none") {

                    if (iLinePosHeight >= gridobj.tgrid.rows[i].cells[0].offsetTop + gridobj.tgrid.rows[i].cells[0].offsetHeight - 2 && iLinePosHeight <= gridobj.tgrid.rows[i].cells[0].offsetTop + gridobj.tgrid.rows[i].cells[0].offsetHeight + 2) {
                        //如大于中间线则调后面的列宽
                        if (iLinePosHeight >= gridobj.tgrid.rows[i].cells[0].offsetTop + gridobj.tgrid.rows[i].cells[0].offsetHeight) {
                            //调隐藏列的列宽
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
                            else//后面无一个隐藏列
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
    //调节列宽
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
                oCol.style.width = 0; //隐藏列的列宽为1
            }
            else {
                oCol.style.width = afterWidth;

            }
        }
        //修改表格的宽度
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

        gridobj.ActionAutoScroll("H"); //处理滚动条=auto时的情况
        gridobj.Hscrollmax = gridobj.getHScrollMax();
        gridobj.fnPutHscrollmax(gridobj.Hscrollmax);

        gridobj.hide();
        return;
    }
    //行高
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
            //拖动隐藏时
            gridobj.tgrid.rows[gridobj.AdjustRow].style.height = 0; //隐藏列的列宽为1

        }
        else {
            if (gridobj.tgrid.rows[gridobj.AdjustRow].style.display == "none") {
                gridobj.tgrid.rows[gridobj.AdjustRow].style.display = "block";
            }
            gridobj.tgrid.rows[gridobj.AdjustRow].style.height = afterWidth;
        }
        //修改div表格的高度
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

        gridobj.ActionAutoScroll("V"); //处理滚动条=auto时的情况
        gridobj.Vmax = gridobj.getVScrollMax();
        gridobj.fnPutVscrollmax(gridobj.Vmax);

        gridobj.hide();
        //onAdjustRowID.fire();
        return;
    }

}
webgrid.prototype.line_onmousemove = function() {
    //竖直线
    this.line.style.left = parseInt(this.line.style.left) + 2;
}
webgrid.prototype.lineH_onmousemove = function() {//水平线
    this.lineH.style.top = parseInt(this.lineH.style.top) + 2;

}
/**
*取表格外在控件的位置
**/
webgrid.prototype.getdiv1top = function() {
    var div1top = getAbsTop(this.div1);

    if (this.ParentPos == "相对") {
        div1top = parseInt(this.div1.style.top);
    }
    return div1top;

}
webgrid.prototype.getdiv1left = function() {
    var div1left = getAbsLeft(this.div1);

    if (this.ParentPos == "相对") {
        div1left = parseInt(this.div1.style.left);
    }
    return div1left;
}
/**
*将滚动条放到div的外面
**/
webgrid.prototype.setBottomPosition = function() {
    //下面的定位是如果在页签控件中要用div1.style.pixelLeft ,如果在相对定位模式情况下用getAbsLeft(div1)
    var div1left = this.getdiv1left();
    var div1top = this.getdiv1top();
    
    
    //alert(div1top+ ":" + div1.style.pixelTop)
    var div1width = parseInt(this.div1.style.width); //this.div1.style.pixelWidth ;this.div1.offsetWidth;
    var div1height = parseInt(this.div1.style.height); //this.div1.style.pixelHeight ;this.div1.offsetHeight;
    // alert("width:"+div1width)
    //竖直滚动条的位置

    this.fchtcDiv1.style.left = div1left + div1width - 1; //-17//17滚动条的宽度
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


    //水平滚动条的位置
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


    //低端右边的遮盖块
    this.divconer.style.left = parseInt(this.fchtcDiv1.style.left);
    this.divconer.style.top = parseInt(this.fchtcDiv2.style.top);
    this.divconer.style.width = "14px";
    this.divconer.style.height = "14px";

}
/**
* added by liuxr at 2009-5-14 重算行高
* @func 重算初始化为固定行高
**/
webgrid.prototype.ReCalRowHeight = function() {
    var intFixRows = this.tgrid.getAttribute("fixrows");
    if (intFixRows != null)
        intFixRows = parseInt(intFixRows, 10);
    else
        intFixRows = this.FixRows;        //modify by liuxr at 2010-4-13 	标题行数

    var len = this.tgrid.rows.length;
    //alert("fixrows:" + intFixRows + " rows:" + len);
    for (var i = intFixRows; i < len; i++) {
        //alert(tgrid.rows(i).style.height + "---" + tgrid.rows(i).offsetHeight);
        this.tgrid.rows[i].style.height = this.tgrid.rows[i].offsetHeight;
    }
}
/**
* @func:拖动横向滚动条时把TD列也进行隐藏，因为只隐藏Col列时有中文会把列宽改变
* @Date：2011-12-05 10:06  liuxr
**/
webgrid.prototype.SetTDAtt = function(lngCol, val) {
    var intFixRows = this.tgrid.getAttribute("fixrows");
    if (intFixRows != null)
        intFixRows = parseInt(intFixRows, 10);
    else
        intFixRows = this.FixRows;        //modify by liuxr at 2010-4-13 	标题行数

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
//隐藏列
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
//显示列
**/
webgrid.prototype.ShowCol = function(lngCol) {
    NavJs.setClassName(this.tgrid.childNodes[0].childNodes[lngCol], "");

    this.tgrid.childNodes[0].childNodes[lngCol].style.width = this.tgrid.childNodes[0].childNodes[lngCol].getAttribute("oldwidth");
    this.SetTDAtt(lngCol, "visible");
}
/**
//隐藏行
**/
webgrid.prototype.HideRow = function(lngRow) {
    //alert(this.tgrid.rows[lngRow].className);
    NavJs.setClassName(this.tgrid.rows[lngRow], "fc_hidden_tr");
}
/**
//显示行
**/
webgrid.prototype.ShowRow = function(lngRow) {
    NavJs.setClassName(this.tgrid.rows[lngRow], "fc_show_tr");
}
/**
*设置TD的Filter
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

    //added by liuxr at 2010-12-7 9:37 增加对象是否为null的判断,否则IE8下出现脚本错误
    if (this.curObj.parentNode == null || typeof this.curObj.parentNode == "undefined") return;
    if (this.curObj.parentNode.rowIndex > 0) {
        this.curObj.style.backgroundColor = "#0000cd";
        this.curObj.style.color = "#ffffff";
    } 
}
/**
*将编辑框移动到当前td单元格(或setTD)的过程，
*赋值过程：将td单元格中的值赋到编辑框上；将按键的值赋到编辑框上
**/
webgrid.prototype.moveedit = function(setTD) {
    //if(typeof curObj=="undefined") return
    if (arguments.length > 0) {
        this.curObj = setTD;
        //added by liuxr at 2010-11-11 10:22 给curTD属性赋值
        this.curTD = this.curObj;
        if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
            /* ! added by liuxr at 2010-12-7 14:37 给Row属性赋值 this.curObj.parentNode.rowIndex*/
            this.Row = this.curObj.parentNode.rowIndex;
            /* ! added by liuxr at 2010-12-7 14:37 给Col属性赋值 this.curObj.cellIndex*/
            this.Col = this.curObj.cellIndex;
        }
    }
    //将下面这行的&&改为|| 2003-06-27 modify
    if (this.curObj.parentNode.rowIndex == 0 || this.curObj.cellIndex <= 0) return;
    //判断当前列,如果只读
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

        if (this.ParentPos == "相对") {
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

        //-防止在一表格有两种不同的数据源参照时出错
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
                    //modify by liuxr at 2010-11-15 11:10 .xml属性在非IE的浏览器下不能使用，用NavJs.xml(node) 方法兼容其他浏览器
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
        //modify by liuxr at 2010-11-23 9:40 给czFc赋值改用fnPutvalue方法
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
    //获得当前对象的属性
    //当前TD无则取表格的

    if (isSpace(this.curObj.style.fontSize)) {
        var iFontSize = parseInt(this.tgrid.style.fontSize);
        if (isNaN(iFontSize) == false) this.txtMyGrid.style.fontSize = iFontSize + 1;  //+1是为了使显示效果更好
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
    //当前TD的对齐方式为空是找COL元素的对齐方式
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
*此函数在表格点击及按上下左右回车键时调用
*@param sUp ="上下移动" 表示按了上下方向键和纵向移动键,此时不计算横向滚动条
**/
webgrid.prototype.tgrid_onclick = function(curObj1, sUp) {

    try { //怕出错而加的try, 2010-06-03 16:47 刘欣茹 add 处理在grid上单击事件选日期时会将日期复制到别的单元格中.
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

    if (gridobj.ReadOnly || gridobj.canselect == "否")
        return;
    //if(pubFirstClickTab=="点击表格取得焦点") return
    if (ooEvent.tagName.toUpperCase() == "A") {
        if (ooEvent.parentNode.tagName == "TD") {
            ooEvent = ooEvent.parentNode;
        }
    }


    if (arguments.length == 0 || typeof curObj1.tagName == "undefined") {//点击

        if (ooEvent.tagName != 'TD') return;

        if (ooEvent.parentNode.rowIndex < gridobj.FixRows && gridobj.tgrid.rows[ooEvent.parentNode.rowIndex].style.cursor == "default") gridobj.ClickHeader(ooEvent.cellIndex);

        //在固定行列上
        if (ooEvent.parentNode.rowIndex < gridobj.FixRows || ooEvent.cellIndex < gridobj.FixCols) return;
        var strCZ = gridobj.tgrid.childNodes[0].childNodes[ooEvent.cellIndex].getAttribute("cz");

        if (gridobj.tgrid.childNodes[0].childNodes[ooEvent.cellIndex].getAttribute("cz") == "<checkbox_readonly></checkbox_readonly>" || gridobj.tgrid.childNodes[0].childNodes[ooEvent.cellIndex].getAttribute("cz") == "<checkbox_readonly/>") return;
        if (strCZ == "<checkbox></checkbox>" || strCZ == "<checkbox/>") {
            //checkbox直接提交到数据集
            //alert(ooEvent.style.backgroundImage)
            //if(ooEvent.style.backgroundImage == "url("+fcpubdata.path+"/fceform/images/ef_run_grid_checked.gif)" ) {
            if (ooEvent.style.backgroundImage.indexOf("/fceform/images/ef_run_grid_checked.gif") > 0) {
                ooEvent.style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheck.gif)";
                ooEvent.style.backgroundPosition = "center center";
                //if(Act_onDataChange("强行发生数据改变事件","是","否") == false) return
                checkbox_update_ds(gridobj, ooEvent.cellIndex, ooEvent.parentNode.rowIndex - gridobj.FixRows, "否");
                return;
            } else if (ooEvent.style.backgroundImage.indexOf("/fceform/images/ef_run_grid_uncheck.gif") > 0) {
                ooEvent.style.backgroundImage = "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checked.gif)";
                ooEvent.style.backgroundPosition = "center center";
                //if(Act_onDataChange("强行发生数据改变事件","否","是") == false) return
                checkbox_update_ds(gridobj, ooEvent.cellIndex, ooEvent.parentNode.rowIndex - gridobj.FixRows, "是");
                return;
            }
        }

        //当检查非法后应取消
        //if (actcellchange(event.srcElement)==false) return
        //alert(curObj.parentNode.rowIndex+"=="+event.srcElement.parentNode.rowIndex+" &&"+ event.srcElement.cellIndex+"=="+curObj.cellIndex)
        //if(curObj.parentNode.rowIndex==event.srcElement.parentNode.rowIndex && event.srcElement.cellIndex==curObj.cellIndex ){

        if (gridobj.curObj == ooEvent) {
            //当直接点击默认的第一列时,需要强行发生一下onCellChange事件, 2012-04-19 my add 
            if (gridobj.curObj.cellIndex == 1) {
                if (gridobj.actcellchange(ooEvent) == false) return;
            }
            gridobj.moveedit();
            return;
        } else {
            //当检查非法后应取消
            if (gridobj.actcellchange(ooEvent) == false) {
                return;
            }

            gridobj.preTD = gridobj.curObj;
            gridobj.curObj = ooEvent;
            //added by liuxr at 2010-11-11 10:22 给curTD属性赋值
            gridobj.curTD = gridobj.curObj;

        }
    } else {//按键

        if (curObj1.tagName != 'TD') return;
        //在固定行列上
        if (curObj1.parentNode.rowIndex < gridobj.FixRows || curObj1.cellIndex < gridobj.FixCols) return;
        gridobj.preTD = gridobj.curObj;
        gridobj.curObj = curObj1;
        //added by liuxr at 2010-11-11 10:22 给curTD属性赋值
        gridobj.curTD = gridobj.curObj;
        tmpB = true;

    }


    if (gridobj.autosize == false) {
        if (gridobj.fchtcDiv1.style.display != "none") {
            //如向下出界则滚动
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

        if (gridobj.fchtcDiv2.style.display != "none" && sUp != "上下移动") {
            if (gridobj.Hscrollmax > 0) {
                var num1 = parseInt(gridobj.tgrid.childNodes[0].childNodes[gridobj.curObj.cellIndex].style.width);
                var oRect = gridobj.curObj.getClientRects();
                var oRect1 = gridobj.div1.getClientRects();

                var n1 = oRect[0].right;
                var n2 = oRect1[0].right;

                //如向右出界则滚动
                if (n1 > n2) {  //-17
                    //计算一次滚动多少列
                    //可能不一定只滚动一列,如中间有只读列的话
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

    //MoveDataSet() //在actcellchange中处理了

    gridobj.SetTDFilter();
    //preTD.className="";
    //curObj.className="tdfilter"    
    var d = new Date();
    var t1 = d.getTime();
    //alert("tgrid_onclick时间:"+(t1-t))	

    return;
    /**
    *强行更新打勾项,在tgrid_onclick()中使用
    *@param colNo 列号
    *@param rowNo 行号
    *@param svalue 要更新的值
    *@return 无
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

            if (oDs.RecNo == rowNo)		//added by liuxr at 2009-5-19 解决grid在页签的第二页时复选框默认选中的问题
                oDs.Fields.Field[cur].Value = svalue

            //修改行标志
            if (oDs.oDom.documentElement.childNodes[rowNo].getAttribute("rowstate") == "new")
                oDs.oDom.documentElement.childNodes[rowNo].setAttribute("rowstate", "add"); ;
            if (oDs.oDom.documentElement.childNodes[rowNo].getAttribute("rowstate") != "add")
                oDs.oDom.documentElement.childNodes[rowNo].setAttribute("rowstate", "edit"); ;

        }
        return true;
    }
    /**
    *由表格列号得到数据集的字段名
    *还未有地方使用
    *@date 2005-01-25
    **/
    //	function gridcol_dsfieldname(colNo) {
    //		var oXml = SetDom(gridobj.format);
    //		if(colNo>0) colNo--;
    //		var curFieldName = NavJs.textContent(oXml.documentElement.childNodes[colNo].childNodes[0]) ; //0个节点为字段名
    //		return curFieldName;
    //	}


}
/**
*处理将文本框上的值往单元格上传递的情况
**/
webgrid.prototype.txtTotd = function() {
        this.curObj.innerText = this.txtMyGrid.value;
}
/**
*处理将单元格上的值往文本框上传递的情况
**/
webgrid.prototype.tdTotxt = function() {
    //
    var TransValue = this.curObj.innerText;
    //保存改前的值以便undo
    this.BeforeChangeText = TransValue;

    var s1 = this.curObj.getAttribute("formula");
    if (s1 != null) {
        TransValue = "=" + s1;
        //使TD的值与文本框的值一致,否则有公式时不对
        this.txtMyGrid.value = TransValue;

        //为了给curObj.innerText值而调用
        this.txtTotd();
    }
    else
        this.txtMyGrid.value = TransValue;


}
/**
*点击表格标题行,用于排序 ↑↓
*@param curcol 当前列
*@date 2003-12-05
**/
webgrid.prototype.ClickHeader = function(curcol) {

    if (this.IsOrder != "是") return;
    if (curcol <= 0) return;
    if (parseInt(this.tgrid.childNodes[0].childNodes[curcol].style.width) == 0) return;
    if (this.FixRows > 1) return; //多层表头时不能排序
    var orderstr = "↑";
    var orderstr1 = "↓";
    var asc = "升序";

    //去掉原来的
    for (var i = 1; i < this.tgrid.childNodes[0].childNodes.length; i++) {
        if (i != curcol) {
            var s4 = this.tgrid.rows[0].cells[i].innerHTML;
            var s5 = s4.substring(0, 1);
            if (s5 == orderstr || s5 == orderstr1) {
                this.tgrid.rows[0].cells[i].innerHTML = s4.substring(1, s4.length);
            }
        }
    }

    //加上新的
    var s2 = this.tgrid.rows[0].cells[curcol].innerHTML;
    var s3 = s2.substring(0, 1);
    if (s3 != orderstr && s3 != orderstr1) {
        this.tgrid.rows[0].cells[curcol].innerHTML = orderstr + s2;
    } else if (s3 == orderstr) {
        this.tgrid.rows[0].cells[curcol].innerHTML = orderstr1 + s2.substring(1, s2.length);
        asc = "降序";
    } else {
        this.tgrid.rows[0].cells[curcol].innerHTML = orderstr + s2.substring(1, s2.length);
    }
    if (isSpace(this.dataset) == false) {
        //modify by liuxr at 2011-11-14 9:42 修改从grid对象获取format属性,解决不在dataset上设置数据项时grid的排序问题
        //var sformat=eval("document.getElementById('"+this.id+"').getAttribute('format')");
        var sformat = this.format;

        /*var oXml=new ActiveXObject("Microsoft.XMLDOM");
        oXml.async=false;
        oXml.loadXML (sformat);*/
        var oXml = SetDom(sformat);

        var s1 = "";
        //取字段名,表格多左边一个标记列
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
            gridobj.hideVscroll = "是";
        else
            gridobj.hideVscroll = "否";


    }
    var bak_hideHscroll = gridobj.hideHscroll;
    if (scrollDirection != "V" && gridobj.hideHscroll == "auto") {
        gridobj.Hscrollmax = gridobj.getHScrollMax();
        gridobj.fnPutHscrollmax(gridobj.Hscrollmax);
        if (gridobj.Hscrollmax < 1)
            gridobj.hideHscroll = "是";
        else
            gridobj.hideHscroll = "否";
    }

    var bool_hideVscroll = IsTrue(gridobj.hideVscroll);
    var bool_hideHscroll = IsTrue(gridobj.hideHscroll);
    if (scrollDirection != "H") {
        if (bool_hideVscroll || gridobj.visible != "是") {
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
        if (bool_hideHscroll || gridobj.visible != "是") {
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

    if ((bak_hideVscroll == "auto" || bak_hideHscroll == "auto" || bool_hideVscroll == false || bool_hideHscroll == false) && gridobj.visible == "是") {
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

    if (gridobj.visible == "是" && gridobj.autosize) {
        gridobj.div1.style.height = gridobj.tgrid.offsetHeight + "px";
        gridobj.div1.style.width = gridobj.tgrid.offsetWidth + "px";
    }

    //恢复
    gridobj.hideVscroll = bak_hideVscroll;
    gridobj.hideHscroll = bak_hideHscroll;
}
/**
* 在增删行,调整列宽行高时调用.用于auto时计算显示滚动条.
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
    //隐藏编辑控件
    this.txtMyGrid.style.display = "none";
    $id(this.cz.id).style.display = "none";

}
/**
*去掉当前行的背景色,用于数据集中调用
*@date 2003-12-26
**/
webgrid.prototype.RemoveBackColor = function(td) {
    if (this.tgrid.rows.length <= this.FixRows) return; //以防删空表格后,再增加行时报错.

    if (IsSpace(td)) td = this.curObj;
    if (td.cellIndex >= 0) {
        //modify by liuxr at 2010-3-23 13:58 IE8下增加td.parentNode是否为null判断，否则出现脚本错误 
        if (td.parentNode != null) {
            var tmpcurRow = td.parentNode.rowIndex;
            if (tmpcurRow > 0) {
                //2009-5-22 增加判断 liuxr
                if (isTrue(this.blRowNo) == false)
                    this.tgrid.rows[tmpcurRow].cells[0].innerText = " ";
                this.tgrid.rows[tmpcurRow].style.backgroundColor = "";
                //2009-04-21 加上
                td.style.color = "";
                td.style.backgroundColor = "";
            }
        }
    } else { //移去所有的行背景
        for (var i = 1; i < this.tgrid.rows.length; i++) {
            //2009-5-22 增加判断 liuxr
            if (isTrue(this.blRowNo) == false)
                this.tgrid.rows[i].cells[0].innerText = " ";
            this.tgrid.rows[i].style.backgroundColor = "";
        }
    }

}
/**
*加当前行的背景色,用于tgrid_onclick 和Append时调用
*@date 2003-12-26
**/
webgrid.prototype.AddBackColor = function() {
    //给行标记
    //added by liuxr at 2010-12-7 9:37 增加对象是否为null的判断,否则IE8下出现脚本错误
    if (this.curObj.parentNode == null || typeof this.curObj.parentNode == "undefined") return;
    var tmprow = this.curObj.parentNode.rowIndex;
    if (tmprow > 0) {
        //added by liuxr at 2009-5-22 加上判断，如果不显示行号时才innerText=">"
        if (isTrue(this.blRowNo) == false)
            this.tgrid.rows[tmprow].cells[0].innerText = ">";
        this.tgrid.rows[tmprow].style.backgroundColor = "e6e6fa";
    }
}
/**
*滚动后调用此函数
**/
webgrid.prototype.Actmoveedit = function() {
    this.hide();
}
/**
*onDataChange事件
*@date 2003-09-16
*@param sTag=="强行发生数据改变事件"
*@return true 表示后面可以移动单元格, false 表示ondatachange中检查非法后要取消移动单元格.用于立即检验.
**/
webgrid.prototype.Act_onDataChange = function(sTag, oldvalue, newvalue) {

    //保存前的TD值和以后的不同则发生onDataChange
    //alert(txtMyGrid.style.display)==none表示第一次进入表格
    if (((this.curObj.innerText != this.BeforeChangeText && this.txtMyGrid.style.display == "block") || sTag == "强行发生数据改变事件") && this.curObj.parentNode.rowIndex > 0) {
        //alert(curObj.innerText+"!="+BeforeChangeText)
        //modify by liuxr at 2010-11-9 11:55 替换createEventObject()用new Object(),在非ie的浏览器不支持createEventObject()
        var oEvent = new Object(); //createEventObject();
        oEvent.curTD = this.curObj;
        oEvent.BeforeChangeText = this.BeforeChangeText;
        oEvent.AfterChangeText = this.curObj.innerText;
        //if(typeof oldvalue != "undefined" && typeof newvalue != "undefined"){
        //	oEvent1.BeforeChangeText = oldvalue ;
        //	oEvent1.AfterChangeText = newvalue ;
        //}
        //oEvent1.returnValue=true
        //为数据集对象新加的
        if (isSpace(this.dataset) == false) {
            var sCommand = "if(" + this.dataset + ".bAdd==false) " + this.dataset + ".bEdit=true;" + this.dataset + ".cont_onDataChange();";
            eval(sCommand);
            //   if(dsMain.bAdd==false) dsMain.bEdit=true
        }

        //置EndRowState为"edit"
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
*处理事件的参数,n
*此函数在按方向键和点击表格时调用
*param newTD 为发生事件的TD
*return false 表示取消后续代码的运行
**/
webgrid.prototype.actcellchange = function(newTD) {
    if (this.curObj != null && this.curObj.cellIndex >= 0) {
    }
    else if (this.lostfocusTD != null && this.lostfocusTD.cellIndex >= 0) {
        this.curObj = this.lostfocusTD;
        //added by liuxr at 2010-11-11 10:22 给curTD属性赋值
        this.curTD = this.curObj;
        if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
            /* ! added by liuxr at 2010-12-7 14:37 给Row属性赋值 this.curObj.parentNode.rowIndex*/
            this.Row = this.curObj.parentNode.rowIndex;
            /* ! added by liuxr at 2010-12-7 14:37 给Col属性赋值 this.curObj.cellIndex*/
            this.Col = this.curObj.cellIndex;
        }
    } else {
        this.curObj = this.tgrid.rows[0].cells[0];
        //added by liuxr at 2010-11-11 10:22 给curTD属性赋值
        this.curTD = this.curObj;
        //alert(newTD.parentNode.rowIndex)
        if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
            /* ! added by liuxr at 2010-12-7 14:37 给Row属性赋值 this.curObj.parentNode.rowIndex*/
            this.Row = this.curObj.parentNode.rowIndex;
            /* ! added by liuxr at 2010-12-7 14:37 给Col属性赋值 this.curObj.cellIndex*/
            this.Col = this.curObj.cellIndex;
        }
    }

    //数据改变事件
    if (this.Act_onDataChange() == false) return false;
    //if(curObj.parentNode.rowIndex==newTD.parentNode.rowIndex && curObj.cellIndex==newTD.cellIndex) return false

    var oEvent = new Object(); //createEventObject();
    oEvent.oldTD = this.curObj;
    oEvent.newTD = newTD;
    //oldTD在改变前的值
    oEvent.BeforeChangeText = this.BeforeChangeText;
    //added by liuxr at 2010-12-2 17:11 增加onCellChange接口
    //var strlink = this.id + ".onCellChange()";
    //NavJs.insertEventParam(strlink, oEvent);
    var oFunction = this.onCellChange; //my add,要求写法为 grid1.onCellChange = function(event) {...}
    if (IsSpace(oFunction) == false) {
        oFunction(oEvent);
    }
    //onCellChangeID.fire(oEvent);
    //alert(curObj.parentNode.rowIndex+"!="+newTD.parentNode.rowIndex)
    if (this.curObj.parentNode.rowIndex != newTD.parentNode.rowIndex) {
        //onBeforeRowChange事件---------------------------------------------------------------
        //暂时没使用此事件

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


        //为数据集对象新加的
        //下面在2005-04-07 时去掉了'不检查'和加上了刷新表格
        if (isSpace(this.dataset) == false) {
            var oDs = $obj(this.dataset); //eval("window."+this.dataset);
            var blnChangeData = false;
            if (oDs.bEdit || oDs.bAdd) blnChangeData = true;
            if (oDs.Update("提示错误信息") != "") {  //'不检查'
                return false;
            } else {
                //alert("rowchange!!")

                if (oEvent.oldRow - this.FixRows > 0 && blnChangeData) {
                    oDs.fset_cont(oEvent.oldRow - this.FixRows); //刷新表格
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

    gridobj.KeyMove(1);  //左右键不起作用
    //added by liuxr at 2011-6-22 16:11 输入内容后按回车键回到待编辑状态
    gridobj.txtMyGrid_onkeypress();

}
webgrid.prototype.txtMyGrid_onkeypress = function() {

    //window.status=window.status+"txtpress"
    var event = NavJs.getEvent();
    var gridobj = this;

    // alert(gridobj.txtMyGrid.style.display);
    //alert(event.keyCode);
    if (gridobj.txtMyGrid.style.display == "block" && event.keyCode == 13) { //回车键
        //---------------------------------------
        //调用双击事件

        var s2 = eval(gridobj.id + ".ondblclick");
        //去掉{}外边的东西
        var s1 = s2 + "";
        s1 = s1.substring(22, s1.length - 1);

        //alert(s1)
        if (isSpace(s1) == false) {
            //if(txtMyGrid.value==" "){
            //调用参照
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
*表格的按钮事件
**/
webgrid.prototype.tgrid_onkeydown = function() {
    //window.status=window.status+"tgrid "
    var event = NavJs.getEvent();
    var gridobj=this;

    var iKeyCode = event.keyCode;
    gridobj.KeyMove(2); //2=全部键起作用


    if (iKeyCode == 13) {//enter键
        if (gridobj.txtMyGrid.style.display == "none") {
            gridobj.moveedit();
        }

    }


}
/**
*表格的按钮事件
**/
webgrid.prototype.tgrid_onkeypress = function() {
    //window.status=window.status+"tgridpress "
    var event = NavJs.getEvent();
    var gridobj = this;

    var iKeyCode = event.keyCode;
    //if(iKeyCode<33 || iKeyCode>40){
    //按平常键
    if (gridobj.txtMyGrid.style.display == "none") {
        gridobj.moveedit();
        //考虑只读情况
        if (gridobj.txtMyGrid.style.display == "block") {
            //if(iKeyCode==32){ //空格键
            //	txtMyGrid.value=""
            //}else{
            gridobj.txtMyGrid.value = "";
            gridobj.MoveIns(0);  //移动插入符
            //}
            gridobj.txtTotd();
        }
    }
    //}
}
/**
*按方向键按移动,包括pageup pagedown end home 33 34 35 36 
*@para iEdit =1表示左右键不起作用 =2表示全部八个键都起作用.
*@date 2003-09-09
**/
webgrid.prototype.KeyMove = function(iEdit){
	if(this.curObj.cellIndex==-1)return ; //意外
	if((this.ReadOnly && this.autosize ) || this.canselect=="否") return;
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
	//没有组合键的情况
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
			//自动加行后要删除尾行 2003-05-19 add
			if(mcurRow == this.tgrid.rows.length-1 ){
				
				if(isSpace(this.dataset) == false && this.EndRowState == "add"){
					var ods=eval(this.dataset);
					ods.Delete();	//删除最后一行
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
					//到顶时自动上滚
					if(this.TopRow-20>0){
						this.fnPutVscrollvalue(this.TopRow,this.TopRow-20);
					}else{
						this.fnPutVscrollvalue(this.TopRow,0);
					}
				}
				//当检查非法后应取消
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
					//到顶时自动上滚
					if(this.TopRow+20 < this.Vmax){
						this.fnPutVscrollvalue(this.TopRow,this.TopRow+20);
					}else{
						this.fnPutVscrollvalue(this.TopRow,this.Vmax);
					}
				}
				
				//当检查非法后应取消
				if (this.actcellchange(this.tgrid.rows[nextRow].cells[mcurCol])==false) return;

				this.tgrid_onclick(this.tgrid.rows[nextRow].cells[mcurCol]);
			} else {  //否则部分用于自动加行 2003-05-09 add
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
				//为了跳过没有设置列属性的列(即不能输入的列)，所以用循环，
				//加上当列隐藏或列宽为0时也跳过
				
				while (parseInt(this.tgrid.childNodes[0].childNodes[nextCol].style.width)==0 ||  this.tgrid.childNodes[0].childNodes[nextCol].offsetWidth==0 ) {
					if(nextCol>this.FixCols) {
						nextCol--;
					}
					else {		//右边出界了则返回原地
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
				//处理隐藏列
				while ( parseInt(this.tgrid.childNodes[0].childNodes[nextCol].style.width)==0 ||  this.tgrid.childNodes[0].childNodes[nextCol].offsetWidth==0 ) {
					if(nextCol<this.tgrid.childNodes[0].childNodes.length-1) {
						nextCol++;
					}
					else {//右边出界了则返回原地
						nextCol=mcurCol;
					}
				}
				this.actcellchange(this.tgrid.rows[mcurRow].cells[nextCol]);
				this.tgrid_onclick(this.tgrid.rows[mcurRow].cells[nextCol]);
			}
			
			break;
		case 37: //左
			if(mcurCol>this.FixCols){
				//到顶时自动上滚
				if(mcurCol<=this.FixCols+this.Hscrollvalue){
					this.fnPutHscrollvalue(this.Hscrollvalue,this.Hscrollvalue-1);
				}
				var nextCol = mcurCol-1;
				//处理隐藏列
				while ( parseInt(this.tgrid.childNodes[0].childNodes[nextCol].style.width)==0 ||  this.tgrid.childNodes[0].childNodes[nextCol].offsetWidth==0 ) {
					if(nextCol>this.FixCols) {
						nextCol--;
					}
					else {//右边出界了则返回原地
						nextCol = mcurCol;
					}
				}
				this.actcellchange(this.tgrid.rows[mcurRow].cells[nextCol]);
				this.tgrid_onclick(this.tgrid.rows[mcurRow].cells[nextCol]);
			}
			break;
		case 39: //右
			if(mcurCol<this.tgrid.childNodes[0].childNodes.length-1){
				//debugger;
				var nextCol=mcurCol+1;
				//为了跳过没有设置列属性的列(即不能输入的列)，所以用循环，
				//加上当列隐藏或列宽为0时也跳过
				while ( parseInt(this.tgrid.childNodes[0].childNodes[nextCol].style.width)==0 ||  this.tgrid.childNodes[0].childNodes[nextCol].offsetWidth==0 ) {
					if(nextCol<this.tgrid.childNodes[0].childNodes.length-1) {
						nextCol++;
					}
					else {		//右边出界了则返回原地
						nextCol = mcurCol;
					}
				}
				this.actcellchange(this.tgrid.rows[mcurRow].cells[nextCol]);
				this.tgrid_onclick(this.tgrid.rows[mcurRow].cells[nextCol]);
			}
			break;

		case 38: //上
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
			//自动加行后要删除尾行 2003-05-19 add
			if(mcurRow == this.tgrid.rows.length-1 ){
				
				if(isSpace(this.dataset)==false && this.EndRowState=="add"){
					var ods=eval(this.dataset);
					ods.Delete();	//删除最后一行
					return;
				}
				
			}

			if(mcurRow>this.FixRows){
				var nextRow = mcurRow-1;
				//到顶时自动上滚
				if(nextRow<this.FixRows+this.TopRow){
					this.fnPutVscrollvalue(this.TopRow,this.TopRow-1);
				}
				//当检查非法后应取消
				if (this.actcellchange(this.tgrid.rows[nextRow].cells[mcurCol])==false) return;
				
				this.tgrid_onclick(this.tgrid.rows[nextRow].cells[mcurCol],"上下移动");

			}
			
			break;
		case 40: //下
			if(mcurRow<this.tgrid.rows.length-1 ){
				var nextRow = mcurRow+1;
				//此处利用了自动滚动,所以不需要设置滚动条
				
				//当检查非法后应取消
				if (this.actcellchange(this.tgrid.rows[nextRow].cells[mcurCol])==false) return;

				this.tgrid_onclick(this.tgrid.rows[nextRow].cells[mcurCol],"上下移动");
			} else if($id(this.id).getAttribute("autoappend")=="是"){  //否则部分用于自动加行 2003-05-09 add

				if(isSpace(this.dataset)==false && this.EndRowState=="edit" && this.AllColReadOnly()==false ){
					
					var ods=eval(this.dataset);
					ods.Append();
				}

			}
			break;
	}
	
}
/**
*用代码移动插入符的位置
*@date 2003-09-09
**/
webgrid.prototype.MoveIns = function(iPos) {

    var r = this.txtMyGrid.createTextRange();
    r.moveStart('character', iPos);
    r.collapse(true);
    r.select();
}
/**
*判断是否所有显示列都只读,在自动增加列时用
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
    //取得当前页显示的行数
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
*在滚动条上双击
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
*快速装入XML报表数据到表格
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
    //modify by liuxr at 2010-11-10 10:38 给tab属性赋值
    this.tab = this.tgrid;
    //modify by liuxr at 2010-11-10 13:33 给Rows、Cols属性赋值
    if (this.tgrid != null) {
        this.Rows = this.tgrid.rows.length;
        this.Cols = this.tgrid.childNodes[0].childNodes.length;
    }
    //this.tgrid.width = this.tgrid.offsetWidth;

    this.curObj = this.tgrid.rows[0].cells[0];
    //added by liuxr at 2010-11-11 10:22 给curTD属性赋值
    this.curTD = this.curObj;
    //modify by liuxr at 2010-11-11 9:40 附加事件时传递当前控件ID作为参数

    if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
        /* ! added by liuxr at 2010-12-7 14:37 给Row属性赋值 this.curObj.parentNode.rowIndex*/
        this.Row = this.curObj.parentNode.rowIndex;
        /* ! added by liuxr at 2010-12-7 14:37 给Col属性赋值 this.curObj.cellIndex*/
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

    //sHTML为表格内容的XML串
    if (this.left == null) this.left = 0;
    if (this.top == null) this.top = 0;
    if (this.width == null) this.width = 550;
    if (this.height == null) this.height = 400;
    //alert(moverflow)

    //将 fcwebgriddiv 固定为绝对定位的,因为它外边的滚动条是要求绝对定位的. 但 fcwebgriddiv里的html table固定为静态的.因为它不需要移动位置. 2010-12-09 my edit
    //modify by liuxr at 2010-12-13 14:19 grid控件都是绝对定位
    var sPosition = "";
    // if(this.left!=0 || this.top!=0) {
    sPosition = "position:absolute;";
    //}
    /*else if (IsSpace(sHTML)) {  //非绝对模式时当窗口位置变化时应重新定位
    //modify by liuxr at 2010-11-11 9:40 附加事件时传递当前控件ID作为参数
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
    //调平表格线
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

    s1 = s1 + '<fc:fc_code id="czFc_' + this.id + '" position="absolute" onchange="var oGrid = $obj($id(this.id).parentNode.id); oGrid.curTD.innerText = this.value;this.gridposition = 88;oGrid.Act_onDataChange(\'强行发生数据改变事件\');"  ></fc:fc_code>';
    //onchange="window.event.srcElement.parentNode.curTD.innerText=window.event.afterchangevalue;window.event.position=88;window.event.srcElement.parentNode.Act_onDataChange(\'强行发生数据改变事件\')"
    //}
    // element.innerHTML=s1;
    $id(this.id).innerHTML = s1;

    //added by liuxr at 2010-12-20 9:58 给fc:webgrid 控件在加上定位类型 
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
        //在commonSelect.htm上时,会因没有引用fc_code.js文件而报错,

    }


    //modify by liuxr at 2010-11-10 10:38 给tab属性赋值
    this.tab = this.tgrid;
    //modify by liuxr at 2010-11-10 13:33 给Rows、Cols属性赋值
    if (this.tgrid != null) {
        this.Rows = this.tgrid.rows.length;
        this.Cols = this.tgrid.childNodes[0].childNodes.length;
    }

    this.txtMyGrid = $id(this.id).children[0].children[2];
    //对表格作预处理
    //加上列元素
    //if(element.isContentEditable==false){

    var tmp1 = sTab.toUpperCase().indexOf("COLGROUP");
    if (tmp1 <= 0) {
        var cols = 0; //总列数
        for (var i = 0; i < this.tgrid.rows[0].cells.length; i++) {
            cols += this.tgrid.rows[0].cells[i].colSpan;
        }
        var sColgroup = "<colgroup>"; //列信息串
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
        //modify by liuxr at 2010-11-10 10:38 给tab属性赋值
        this.tab = this.tgrid;
        //modify by liuxr at 2010-11-10 13:33 给Rows、Cols属性赋值
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

    //给每行加上行高
    if (this.tgrid.style.display == "none") this.tgrid.style.display = "block";
    //加上trueTotrue以防colshow.htm error
    if (IsTrue(this.SetRowHeight)) {
        for (var i = 0; i < this.tgrid.rows.length; i++) {
            this.tgrid.rows[i].style.height = this.tgrid.rows[i].offsetHeight + "px";
        }
    }

    /*
    var tabAllHeight=0	//记录表格的总高度
    for(var i=0;i<tgrid.rows.length;i++){
    tabAllHeight+=tgrid.rows(i).offsetHeight
    tgrid.rows(i).style.height=tgrid.rows(i).offsetHeight
    }
    */
    //自动表格高度和宽度
    if (this.autosize) {
//        this.div1.style.height = this.tgrid.offsetHeight + "px";
//        this.div1.style.width = this.tgrid.offsetWidth + "px";
    }
    else {
        //恢复到缺省值
        // 	div1.style.height=400
        //	div1.style.width=550
    }
    //因报表未预设此属性
    this.tgrid.style.tableLayout = "fixed";

    this.tgrid.cellPadding = 4;
    //}  ;
    //--------------


    //if(element.isContentEditable==false){

    //modify by liuxr at 2010-11-11 9:40 附加事件时传递当前控件ID作为参数
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
    //added by liuxr at 2010-11-11 10:22 给curTD属性赋值
    this.curTD = this.curObj;

    if (this.curObj.parentNode != null && typeof this.curObj.parentNode != "undefined") {
        /* ! added by liuxr at 2010-12-7 14:37 给Row属性赋值 this.curObj.parentNode.rowIndex*/
        this.Row = this.curObj.parentNode.rowIndex;
        /* ! added by liuxr at 2010-12-7 14:37 给Col属性赋值 this.curObj.cellIndex*/
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
    //alert("时间:"+(t1-t))	
    //} //if end
    if (typeof sHTML == "undefined" && this.bInited == false) this.bInited = true;

}
/**
*表格滚轮事件
*date 2005-02-15
**/
webgrid.prototype.div1_onmousewheel = function() {

    var gridobj = this;
    var event = NavJs.getEvent();

    //modify by liuxr at 2009-9-22 解决在表格上输入数据后直接拉动滚动条后，刚输入的数据丢失的问题
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
/*******************属性Put处理************************/
webgrid.prototype.fnPutcoledit = function(vValue, itype) {
    try {
        if (isSpace(vValue) == false) {

            var oXml = SetDom(vValue);

            for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
                if (oXml.documentElement.childNodes[i].tagName.toLowerCase() != "readonly") {
                    //alert(oXml.documentElement.childNodes(i).xml)
                    //modify by liuxr at 2010-11-15 11:10 .xml属性在非IE的浏览器下不能使用，用NavJs.xml(node) 方法兼容其他浏览器
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
    this.ActionAutoScroll("V"); //处理滚动条=auto时的情况
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
    this.ActionAutoScroll("H"); //处理滚动条=auto时的情况
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
     } catch (e) { } //当left属性写在控件上时会出错,需要强行关闭

}

webgrid.prototype.fnPutwidth = function(vValue) {
    if (this.autosize) return;

    vValue = NavJs.setWidth(this.div1, ToInt(vValue));
    this.width = vValue;
    try {
        this.onResize();
    } catch (e) { } //当left属性写在控件上时会出错,需要强行关闭

}
//对这一列的TD打勾
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