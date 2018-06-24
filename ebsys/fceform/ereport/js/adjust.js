//处理表格编辑的JS，
//作者：梅勇，
//日期：2006-04-11


//保存表格的上层的偏移值,在onresize函数中计算
var mbCell=false;
/*! IE6的光标形状为col-resize,row-resize.IE5下为move  */
var cursorcolresize="col-resize";
var cursorrowresize="row-resize";


var iUpLeft=0;
var iUpTop=0;
var blnAdjust=false;
var blnAdjustH=false;
var AdjustRow=0,AdjustCol=0;
var lngFixRows=1; //固定行数
var lngFixCols=1; //固定行数
var blnFixRowDrap=true; //为真表示固定行上能拖动但不能选择
//输入报表模版模式:只能在第一行拖动,运行查询报表模式:在固定行上可以拖动
/*
function LeftToCol(lngLeft,tgrid) {
	//由offsetLeft计算列

	var lngWidth=0;
	for(var i=0;i<tgrid.childNodes(0).childNodes.length;i++) {
		lngWidth=lngWidth+tgrid.childNodes(0).childNodes(i).style.pixelWidth;

		if(lngWidth>=lngLeft){
			break;
		}
	}
	return i;
}
*/
//isCol=="是"表示调整列宽
function div1_onmousedown(isCol){
	if (event.button !=1) return;
	var eventx = event.clientX;
	var eventy = event.clientY;
	var eventx100 = eventx;
	var eventy100 = eventy;
	
	var rate = ToInt(cboZoom.options(cboZoom.selectedIndex).text);		
	if(rate != 100 && rate != 0 ){
		eventx = eventx * 100 / rate ;
		eventy = eventy * 100 / rate ;
	}

	var tgrid = $id("tabLeftHead");
	var div1 = $id("divLeftHead");
	if(isCol == "是") {
		tgrid = $id("tabTopHead");
		div1 = $id("divTopHead");
	}

	//var curObj=document.elementFromPoint(event.clientX,event.clientY);
	var curObj=document.elementFromPoint(eventx,eventy);
	if(curObj==null )return;
	if(curObj.tagName=="TD" ){
		var curCol=curObj.cellIndex;
		curObj=curObj.parentNode;
		var curRow=curObj.rowIndex;
	}
	else {
		return;
	}
	//下面是为了防止表中套表中，求到子表的当前列。
	//if(curCol>=tgrid.childNodes(0).childNodes.length)	curCol=tgrid.childNodes(0).childNodes.length-1;
		
	if(isCol == "是"){
		//调节列宽
		if (tgrid.rows(curRow).style.cursor ==cursorcolresize){

			line.style.display ="block";
			div1.setCapture();
			
			sWidth1=eventx ;
			line.style.left = eventx100;
			line.style.top= getdiv1top(div1) ;				
			line.style.height =div1.offsetHeight+divMain.offsetHeight;
			blnAdjust=true;
			
			SaveoUndoOneRecord();
			return;
		}
		else {
			line.style .display ="none";
			blnAdjust=false;
		}
	}else{
		//调节行高
		if (tgrid.childNodes(0).childNodes(curCol).style.cursor ==cursorrowresize){
			lineH.style.display ="block";
			div1.setCapture();
			sWidth1=eventy ; 
			lineH.style.top =sWidth1;
			lineH.style.left=getdiv1left(div1);								
			lineH.style.width =div1.offsetWidth+divMain.offsetWidth;
			blnAdjustH=true;
				SaveoUndoOneRecord();
			return;
		}
		else {
			lineH.style.display ="none";
			blnAdjustH=false;
		}
	}


}
function div1_onmousemove(isCol){
	var tgrid = $id("tabLeftHead");
	var div1 = $id("divLeftHead");
	if(isCol == "是") {
		tgrid = $id("tabTopHead");
		div1 = $id("divTopHead");
    }
	if(tgrid==null) return ;

	var eventx = event.clientX; //event.x
	var eventy = event.clientY;
	var eventx100 = eventx;
	var eventy100 = eventy;
	
	var rate = ToInt(cboZoom.options(cboZoom.selectedIndex).text);		
	if(rate != 100 && rate != 0 ){
		eventx = eventx * 100 / rate ;
		eventy = eventy * 100 / rate ;
	}

	if (blnAdjust==true && isCol == "是"){
		line.style.left =eventx100 ;
	} else if(blnAdjustH==true){
		lineH.style.top =eventy100 ; 
	}
	else {//变列鼠标形状
		//此段是为了防止在表格中间也能出现修改表格列宽和行高的线
//		var curObj=document.elementFromPoint(event.clientX,event.clientY);
	    
        
		var curObj=document.elementFromPoint(eventx,eventy);
		if(curObj==null)return;
		
		if(curObj.tagName=="TD"  ){
			var curCol=curObj.cellIndex;
			//curObj=curObj.parentNode;
			//var curRow=curObj.parentNode.rowIndex;
		}
		else {
			return;
		}
		
		//------------
		//改变列宽  

		if(isCol == "是"){
			//可以改变列宽
			tgrid.rows(0).style.cursor="default";
			var left1=left2=left3=0;
			left1=eventx+div1.scrollLeft;
			left2=div1.offsetLeft+curObj.offsetLeft;
			left3=left2+curObj.offsetWidth;
			if(left1 > left2  && left1 < left2 + 6 ){
			    if (curObj.cellIndex <= 0) return; //
				AdjustCol= curObj.cellIndex-1;
				//alert(AdjustCol);
				tgrid.rows(0).style.cursor = cursorcolresize;
				//alert(event.x);
			}else if(left1 < left3  && left1 > left3 - 2 ){
				AdjustCol= curObj.cellIndex;
				//alert(AdjustCol);
				tgrid.rows(0).style.cursor =cursorcolresize;
			}
		
		
		}else{
			//改变行高
			tgrid.childNodes(0).childNodes(0).style.cursor ="default";
			var top1=top2=top3=0;
			top1=eventy+div1.scrollTop;
			top2=divAll.offsetTop+div1.offsetTop+curObj.offsetTop;
			top3=top2+curObj.offsetHeight;
			if(top1 > top2  && top1 < top2 + 6 ){
				if(curObj.parentNode.rowIndex<=0) return; //
				AdjustRow = curObj.parentNode.rowIndex-1;
				tgrid.childNodes(0).childNodes(0).style.cursor =cursorrowresize;
			}else if(top1 < top3  && top1 > top3 - 2 ){
				AdjustRow = curObj.parentNode.rowIndex;
				tgrid.childNodes(0).childNodes(0).style.cursor =cursorrowresize;
			}
		
		} // end if

	} // end if

}

function div1_onmouseup(isCol){
	if(typeof sWidth1 =="undefined") return;
	var tgrid = $id("tabLeftHead");
	var div1 = $id("divLeftHead");
	if(isCol == "是") {
		tgrid = $id("tabTopHead");
		div1 = $id("divTopHead");
	}
	var bHideCol = false;
	if(isCol == "是"){
	//调节列宽
	if (line.style.display!="none" ){

		var lngRange = line.style.pixelLeft - parseInt(sWidth1);
		var oldWidth = tgrid.children[0].children[AdjustCol].style.pixelWidth ; 
		var afterWidth = oldWidth + lngRange;
		if(afterWidth<=0){
			tgrid.children[0].children[AdjustCol].style.width=0; //隐藏列的列宽为1
			bHideCol = true;
		}else {
			if(tgrid.children[0].children[AdjustCol].style.pixelWidth <=1 && afterWidth >1) bHideCol = true;
			tgrid.children[0].children[AdjustCol].style.width=afterWidth;

		}
		$id("t").children[0].children[AdjustCol].style.width=tgrid.children[0].children[AdjustCol].style.width;
		sWidth1=0;
		tgrid.style.cursor="default";
		line.style.display ="none";
		div1.releaseCapture();
		blnAdjust=false;
		//同步行高
		if(bHideCol || lngRange < 0) {
		    var arrHeight=new Array();
			var ret = false,i,arrI=0;
			var rows = $id("t").rows.length;
			for(i=0;i<rows;i++){
			    //if(bHideCol || lngRange < 0){
				    if($id("t").rows(i).style.pixelHeight < $id("t").rows(i).offsetHeight){
					    if(ret == false){
						    ret = window.confirm("此次调小列宽会使行高变大，按 [确定] 则调小列宽!");
						    if (ret == false) {
							    //不调小列宽,恢复原来的列宽
							    tgrid.children[0].children[AdjustCol].style.width = oldWidth ;
							    $id("t").children[0].children[AdjustCol].style.width = oldWidth ;
							    break;
						    }
					    }
					    arrHeight[arrI] = {pos:i,height:$id("t").rows(i).offsetHeight} ;
					    arrI++;
				        //$id("t").rows(i).style.height = $id("t").rows(i).offsetHeight; //
				    }
				//}
			}		
            if(ret){
			    for(i=0;i<arrI;i++){
			        $id("t").rows(arrHeight[i].pos).style.height = arrHeight[i].height; 
		            tabLeftHead.rows(arrHeight[i].pos).style.height =  arrHeight[i].height;
                }		
            }	
		}
		
		if(AdjustCol<=SelObj.eColSort && oldWidth != tgrid.children[0].children[AdjustCol].style.pixelWidth) {
			//var scrollbak = divMain.scrollLeft;
			selectRange("adjust");
			//divMain.scrollLeft = scrollbak;
		}
				//AdjustCol=0;
			SaveoRedoOneRecord();
			blnChange=true;

	}
	}else{
	//行高
	if (lineH.style.display!="none" && sWidth1!=0 ){
		var lngRange=parseInt(lineH.style.top) - parseInt(sWidth1);
		var afterWidth=tgrid.rows(AdjustRow).style.pixelHeight+ lngRange;
		if(afterWidth<0){
			//拖动隐藏时
			afterWidth=0; //隐藏列的列宽为1
		}
		$id("t").rows(AdjustRow).style.height=afterWidth;
		//var tmpRow = AdjustRow ;
		//if(div1.scrollTop>0) tmpRow ++;  //不知道为什么滚动后要=1才对。
		//
		//tgrid.rows(tmpRow).style.height=afterWidth; //防止因行合并格内容过多时无法调小行高
		sWidth1=0;
		tgrid.style.cursor="default";
		lineH.style.display ="none";
		div1.releaseCapture ();
		blnAdjustH=false;
		//当调小行高时,要检查上下相邻的行高是否同步,防止因行合并格内容过多时无法调小行高
		if(lngRange < 0){
			$id("t").rows(AdjustRow).style.height = $id("t").rows(AdjustRow).offsetHeight;
			var tmpRow = AdjustRow-1 ;
			while (tmpRow>=0) {
				if($id("t").rows(tmpRow).offsetHeight == $id("t").rows(tmpRow).style.pixelHeight){
					break;
				}else{
					tgrid.rows(tmpRow).style.height = $id("t").rows(tmpRow).style.height = $id("t").rows(tmpRow).offsetHeight;
				}
			}
			tmpRow = AdjustRow+1 ;
			while (tmpRow < $id("t").rows.length) {
				if($id("t").rows(tmpRow).offsetHeight == $id("t").rows(tmpRow).style.pixelHeight){
					break;
				}else{
					tgrid.rows(tmpRow).style.height = $id("t").rows(tmpRow).style.height = $id("t").rows(tmpRow).offsetHeight;
				}
			}
		}
		tgrid.rows(AdjustRow).style.height = $id("t").rows(AdjustRow).style.height;
		
		if(AdjustRow<=SelObj.eRowSort) {
			//var scrollbak = divMain.scrollTop;
			selectRange("adjust");
			//divMain.scrollTop = scrollbak;
		}
				//AdjustRow=0;
			SaveoRedoOneRecord();
			blnChange=true;
	}
	}
	
}
//----------------------------------------------------------------
function line_onmousemove() {
	//竖直线
	line.style.left = line.style.pixelLeft + 2;
}
function lineH_onmousemove() {//水平线
	lineH.style.top = lineH.style.pixelTop + 2;

}
/**
*取表格外在控件的位置
**/
function getdiv1top(div1){
	var div1top=getAbsTop(div1) ;
	
	//if(ParentPos == "相对"){
	//	div1top= div1.style.pixelTop ; 
	//}
	return div1top ;

}
function getdiv1left(div1) {
	var div1left=getAbsLeft(div1) ;		
	
	//if(ParentPos == "相对"){
	//	div1left = div1.style.pixelLeft ; 
	//}
	return div1left ;
}

/**
* 移动输入焦点
*@para iTag = 1 表示值要变动
*@date 2006-05-12
**/
function moveInputFocus(iTag) {
	if(iTag == 1){
		if(SelObj.oldTD != null ){
			var bChangeTmp = SelObj.oldTD.innerText != txtEdit.value ;
			if(bChangeTmp) SaveoUndoOneRecord();
			var oldMergeTdHeight = SelObj.oldTD.offsetHeight;
			SelObj.oldTD.innerText = txtEdit.value;
			//如旧TD为跨行的合并单元格,
			AlignRowHeight(SelObj.oldTD,oldMergeTdHeight);
			
			if(bChangeTmp) SaveoRedoOneRecord();
		}
	}
	
//	txtEdit.style.left=SelObj.sLeft+divMain.style.pixelLeft-divMain.scrollLeft+fcpub.editboxLeftOffset;
//	txtEdit.style.top=SelObj.sTop+divMain.style.pixelTop -divMain.scrollTop+fcpub.editboxOffset;
	txtEdit.style.left=SelObj.sLeft+fcpub.editboxLeftOffset;
	txtEdit.style.top=SelObj.sTop +fcpub.editboxOffset;
	
//	var maxWidth = divMain.clientWidth - txtEdit.style.pixelLeft  ;
//	if(maxWidth > SelObj.sWidth ) maxWidth = SelObj.sWidth  ;
//	var maxHeight = divMain.clientHeight - txtEdit.style.pixelTop  ;
//	if(maxHeight > SelObj.sHeight ) maxHeight = SelObj.sHeight ;

	var maxWidth = SelObj.sWidth ;
	var maxHeight = SelObj.sHeight ;
	if(maxWidth-fcpub.editboxLeftOffset>0) txtEdit.style.width=maxWidth-fcpub.editboxLeftOffset;
	if(maxHeight-fcpub.editboxOffset>0) txtEdit.style.height=maxHeight-fcpub.editboxOffset;

	
		styleCopy();
	
	if(iTag == 1) {
		if(SelObj.curTD.oTD != null )
			txtEdit.value = SelObj.curTD.oTD.innerText;
		
		txtFx.value = txtEdit.value;
		tdFx.innerText = IntToLbl(SelObj.curTD.col+1)+(SelObj.curTD.row+1) ;
		
	}
	setInputFocus();
	
}
/**
* copy焦点TD的属性
**/
function styleCopy() {
	if(SelObj.curTD.oTD != null ){
		txtEdit.style.fontFamily =SelObj.curTD.oTD.style.fontFamily;
		txtEdit.style.fontSize =SelObj.curTD.oTD.style.fontSize;
		txtEdit.style.fontWeight =SelObj.curTD.oTD.style.fontWeight;
		txtEdit.style.fontStyle =SelObj.curTD.oTD.style.fontStyle;
		txtEdit.style.textDecorationUnderline =SelObj.curTD.oTD.style.textDecorationUnderline;
		txtEdit.style.textAlign=SelObj.curTD.oTD.style.textAlign;
		txtEdit.style.backgroundColor = SelObj.curTD.oTD.style.backgroundColor;
		txtEdit.style.color  = SelObj.curTD.oTD.style.color;
	}
}
/**
* 用于在执行对选择区域进行操作前调用。准备selCells[]值和控制不能操作的情况
*@date 2006-04-21
**/
function beforeActRange() {
	if(tLine[0].style.visibility == "hidden") return false;
	//if(posX-divTopHead.scrollLeft>0 && posY-divLeftHead.scrollTop>0 && posX1<divMain.offsetWidth && posY1<divMain.offsetHeight){
		getSelCells();
	//}
	if(SelObj.cells.length == 0) return false;
	return true;
}
/**
* 处理了单元格的属性之后,如设置了字体之后,
*@date 2006-05-15
**/
function afterActCell() {
	styleCopy();
	//txtEdit.focus();


}
/**
* 由当前td的值刷新编辑框
*@date 2006-12-22
**/
function TdToEdit() {
	if(SelObj.curTD.oTD != null ){
		txtEdit.value =SelObj.curTD.oTD.innerText;
		txtFx.value = txtEdit.value;
	}	
}
/**
* 边界时滚动
*@param direction="left/right/top/bottom"
*@date 2006-05-16
**/
function scrollTimer(direction){
	if(blnMouseDown == false) return ;
	if(direction == "bottom") {
		divMain.scrollTop += 10 ;
		if(divMain.scrollTop<divMain.scrollHeight ){
			window.setTimeout("scrollTimer('bottom')",100);
		}
	}
	if(direction == "top") {
		divMain.scrollTop -= 10 ;
		if(divMain.scrollTop > 0 ){
			window.setTimeout("scrollTimer('top')",100);
		}
	}
	if(direction == "right") {
		divMain.scrollLeft += 10 ;
		if(divMain.scrollLeft<divMain.scrollWidth ){
			window.setTimeout("scrollTimer('right')",100);
		}
	}
	if(direction == "left") {
		divMain.scrollLeft -= 10 ;
		if(divMain.scrollLeft>0 ){
			window.setTimeout("scrollTimer('left')",100);
		}
	}

}
/**
* 滚动移出输入焦点
*@date 2006-05-16
**/
function visibleInputFocus() {
	var bool =false;
	var ivalue = txtEdit.style.pixelLeft+fcpub.editboxLeftOffset  ; //- divMain.style.pixelLeft- 2
	if( ivalue < 0 ) {
		divMain.scrollLeft += ivalue ;
		bool = true;
	}
	ivalue = txtEdit.style.pixelTop+fcpub.editboxOffset  ; //- divMain.style.pixelTop -2
	if( ivalue < 0 ) {
		divMain.scrollTop += ivalue ;
		bool = true;
	}
	ivalue = txtEdit.style.pixelTop + txtEdit.style.pixelHeight - divMain.clientHeight ; //(divMain.style.pixelTop+divMain.clientHeight);
	if( ivalue > 0 ) {
		divMain.scrollTop += ivalue ;
		bool = true;
	}
	ivalue = txtEdit.style.pixelLeft + txtEdit.style.pixelWidth - divMain.clientWidth ; //(divMain.style.pixelLeft+divMain.clientWidth);
	if( ivalue > 0 ) {
		divMain.scrollLeft += ivalue ;
		bool = true;
	}
	if(bool){
		showBlueScale();
		moveInputFocus();
	}
	
}
/**
* 设置输入焦点
*@date 2006-05-17
**/
function setInputFocus() {
	var bool = false;
	//在编辑区域
//	if(txtEdit.style.pixelLeft+fcpub.editboxLeftOffset>divMain.style.pixelLeft && txtEdit.style.pixelTop+fcpub.editboxOffset>divMain.style.pixelTop && txtEdit.style.pixelLeft+txtEdit.style.pixelWidth < divMain.style.pixelLeft+divMain.clientWidth && txtEdit.style.pixelTop +txtEdit.style.pixelHeight <divMain.style.pixelTop +  divMain.clientHeight ) {
			   			var   d = new Date();
						var   t = d.getTime();
	
	var tmpBool = txtEdit.style.pixelLeft+fcpub.editboxLeftOffset - divMain.scrollLeft>0 && txtEdit.style.pixelTop+fcpub.editboxOffset-divMain.scrollTop>0 && txtEdit.style.pixelLeft+txtEdit.style.pixelWidth < divMain.clientWidth +divMain.scrollLeft && txtEdit.style.pixelTop +txtEdit.style.pixelHeight <  divMain.clientHeight  +divMain.scrollTop ;
//	var tmpBool = txtEdit.style.pixelWidth < fcpub.divMainWidth  && txtEdit.style.pixelHeight <  fcpub.divMainHeight   ;
						var   d = new Date();
						var   t1 = d.getTime()  ;
							//alert(t1-t)  
	
	if( tmpBool ) {
		try{
			txtEdit.focus();
		}catch(e){
			//alert(e.description);
			bool = true;
		} //有时会不可见,而出错
	}else{
		bool = true;
	}
	if(bool) divMain.focus();

}
/**
* 滚动以使单元格可见
*@param obj 为当前TD对象
*@date 2006-05-17
**/
function scrollForVisibleCell(obj) {
	var offsetValue = 5 ; //多出几个象素,以免和findLogTd冲突.
	//TD在右边界
	var ivalue = obj.offsetLeft + obj.offsetWidth -  divMain.clientWidth ;
	if( ivalue  > divMain.scrollLeft && obj.offsetWidth <  divMain.clientWidth){
		divMain.scrollLeft = ivalue+offsetValue ;
	}
	//TD在左边界
	if(obj.offsetLeft < divMain.scrollLeft){
		divMain.scrollLeft = obj.offsetLeft-offsetValue ;
	}
	//TD在下边界
	var ivalue = obj.offsetTop + obj.offsetHeight -  divMain.clientHeight ;
	if( ivalue  > divMain.scrollTop && obj.offsetHeight <  divMain.clientHeight){
		divMain.scrollTop = ivalue+offsetValue ;
	}
	//TD在上边界
	if(obj.offsetTop < divMain.scrollTop){
		divMain.scrollTop = obj.offsetTop-offsetValue ;
	}

}
/**
* 按键前要做的事
*@date 2006-05-19
**/
function beforeKeyPress() {
	ShowTitleColor(false);
}
function txtEdit_keyPress() {
	blnChange = true;
}
/**
*输入公式按扭的点击事件
**/
function cmdFormula(){
	var arr = [ $id("t"),txtFx.value];
	var sRet = DjOpen("eb_fx",arr,"展现","有模式窗口","直接","设置单元格的公式");
	if(IsSpace(sRet) == false){
		sRet=new Eapi.Str().trim(sRet);
		if(sRet.substring(0,1) != "=") sRet = "="+sRet; //加上=
		txtFx.value = sRet ;
		txtEdit.value = sRet ;
	}
}
/**
* 设置行属性
*@date 2006-05-23
**/
function setRowProp() {
	if(SelObj.sColSort == 0 && SelObj.eColSort == tabTopHead.rows(0).cells.length-1 ){
		var arr = [ $id("t"),SelObj.sRowSort];
		var arrRet = DjOpen("eb_row",arr,"展现","有模式窗口","直接","设置行属性");
		if(IsSpace(arrRet)==false){
			tabLeftHead.rows(SelObj.sRowSort).cells(0).innerText = (SelObj.sRowSort+1) + GetRowLabel(SelObj.sRowSort) ;
			if(IsSpace(arrRet[1]) == false){
				tabLeftHead.rows(SelObj.sRowSort).style.height = arrRet[1];
				selOneRow(SelObj.sRowSort);
			}
		}
	}else{
		alert("请选中一行后再试.");
	}
	
}
/**
* 设置列属性
*@date 2006-05-23
**/
function setColProp() {
	if(SelObj.sRowSort == 0 && SelObj.eRowSort == tabLeftHead.rows.length-1 ){
		var arr = [ $id("t"),SelObj.sColSort];
		var arrRet = DjOpen("eb_col",arr,"展现","有模式窗口","直接","设置列属性");
		if(IsSpace(arrRet)==false){
			tabTopHead.rows(0).cells(SelObj.sColSort).innerText =  IntToLbl(SelObj.sColSort+1)+GetColLabel(SelObj.sColSort);
			if(IsSpace(arrRet[1]) == false){
				tabTopHead.childNodes(0).childNodes(SelObj.sColSort).style.width = arrRet[1];
				selOneCol(SelObj.sColSort);
			}
		}
	}else{
		alert("请选中一列后再试.");
	}
	
}
/**
* 设置报表属性
*@date 2006-05-24
**/
function setReportProp() {
	var sRet = DjOpen("eb_report",$id("t"),"展现","有模式窗口","直接","设置报表属性");
	
}
/**
* 打开设置窗口
*@param djsn 要打开的表单的djsn
*@param sTag ="cellstyle" 表示设置单元格属性
*@param sTitle 窗口标题
*@date 2006-04-17
**/
function OpenSetWin(djsn,sTag,sTitle){
	if(sTag == "cellstyle" ) getSelCells();
	if(IsSpace(sTitle)){
		var s = "";
		try{
			var o =  event.srcElement ;
			if(o.tagName == "IMG") o = o.parentNode;
			s =o.title;
		}catch(e){};
		if(IsSpace(s)==false){
			sTitle = s ;
		}
	}
	var arr = new Array();
	arr[0] = $id("t") ;
	if(sTag == "option") arr[1] = fcpub ;
	if(sTag == "cellstyle") arr[1] = SelObj.cells;
	if(djsn == "eb_subrptset") arr[1] = SelObj.curTD.oTD ;
	
	var sRet = DjOpen(djsn,arr,"展现","有模式窗口","直接",sTitle);
	if(sTag == "cellstyle" && sRet == "ok"){
		//同步选择行的行高
		AlignCurRowHeight();
		afterActCell();
		TdToEdit();
	}
	if(djsn == "eb_subrptset" && IsSpace(sRet) == false){
		TdToEdit();
	} 
	return sRet;
}
/**
* 显示配置信息
*@date 2010-11-01
**/
function OpenWinShowInfo() {
    var arr = new Array();
    arr[0] = $id("t");
    DjOpen("eb_showinfo", arr, "展现", "有模式窗口", "直接", "显示配置信息");
}

/**
* 打开chart的属性框
*@date 2006-09-06
**/
function OpenChartWin() {
	var oTD = SelObj.curTD.oTD ;
	var djsn = "eb_chart";
	if(fcpubdata.dotnetVersion == "") djsn="eb_chartjava";
	var sRet = DjOpen(djsn,oTD,"展现","有模式窗口","直接","统计图");
	if(IsSpace(sRet)==false){
		txtEdit.value = sRet;
		txtFx.value = sRet;
		oTD.innerText = sRet;
	}
}
/**
* 打开flash统计图的属性框
*@date 2010-05-24
**/
function OpenFlashWin() {
    var oTD = SelObj.curTD.oTD;
    var djsn = "eb_flash";
    //if (fcpubdata.dotnetVersion == "") djsn = "eb_chartjava";
    var sRet = DjOpen(djsn, oTD, "展现", "有模式窗口", "直接", "FLASH统计图");
    if (IsSpace(sRet) == false) {
        txtEdit.value = sRet;
        txtFx.value = sRet;
        oTD.innerText = sRet;
    }
}
/**
* 打开条形码的属性框
*@date 2008-05-16
**/
function OpenBarCodeWin() {
	var oTD = SelObj.curTD.oTD ;
	var fName="=barcode";
	var sP = oTD.innerText;
	sP=sP.trim();
	if(sP.length > 10){
		sP = sP.substring(9,sP.length-1);
	}else{
		sP="";
	}
	var djsn = "eb_BarCode";
	if(fcpubdata.dotnetVersion == "") djsn="eb_BarCodeJava";
	var sRet = DjOpen(djsn,[sP,oTD],"展现","有模式窗口","直接","条形码属性窗口");
	if(IsSpace(sRet)==false){
		sRet = fName+"("+sRet+")";
		txtEdit.value = sRet;
		txtFx.value = sRet;
		oTD.innerText = sRet;
	}
}
/**
* 新建报表向导
*@date 2006-09-19
**/
function OpenWizard() {
	if(OpenSetWin('eb_dataset') != 'ok') return;
	var arrRet = OpenSetWin('eb_wizard');
	if(typeof arrRet == "undefined") return;
	
	var maxRows=0,maxCols=0;
	var curRows=tabLeftHead.rows.length;
	var curCols=tabTopHead.rows(0).cells.length;
	switch (arrRet[0]){
		case "网格式": {
			//找到第一个数据集展开
			if(arrRet.length>6){
				var sdsname = arrRet[6];
				var oField = SetDom("<root>"+arrRet[7]+"</root>");
				if(oField.documentElement != null){
					maxRows=2;
					maxCols=oField.documentElement.childNodes.length;
					actRowCol(maxRows,maxCols,curRows,curCols);
					for(var i=0;i<maxCols;i++){
						$id("t").rows(0).cells(i).innerText = oField.documentElement.childNodes(i).text;
						if(i==0){
							$id("t").rows(1).cells(i).innerText = "="+sdsname+".get("+oField.documentElement.childNodes(i).text+")";
							$id("t").rows(1).cells(i).e_extensible="1";
							
							RefreshCurTdValue();
						}else{
							$id("t").rows(1).cells(i).innerText = "="+sdsname+"."+oField.documentElement.childNodes(i).text;
						}
					}
					
				}
			}			
			break;	
		}	
		case "分组式": {
			maxRows=2;
			var arr = arrRet[1].split("\r\n");
			arr = arr.slice(0, -1);
			var arrValue = arrRet[2].split("\r\n");
			arrValue = arrValue.slice(0,-1);
			maxCols = arr.length+arrValue.length;
			actRowCol(maxRows,maxCols,curRows,curCols);
			for(var i=0;i<arrValue.length;i++){
				$id("t").rows(0).cells(arr.length+i).innerText = arrValue[i];
			}
			for(var i=0;i<arr.length;i++){
				$id("t").rows(1).cells(i).innerText = "="+ arr[i];
				$id("t").rows(1).cells(i).e_extensible="1";
			}
			for(var i=0;i<arrValue.length;i++){
				$id("t").rows(1).cells(arr.length+i).innerText = "="+arrValue[i];
			}
			break;	
		}	
		case "交叉式": {
			var arrRow = arrRet[3].split("\r\n");
			arrRow = arrRow.slice(0, -1);
			var arrCol = arrRet[4].split("\r\n");
			arrCol = arrCol.slice(0,-1);
			var arrValue = arrRet[5].split("\r\n");
			arrValue = arrValue.slice(0,-1);
			maxRows = arrCol.length+1;
			maxCols = arrRow.length+arrValue.length;
			actRowCol(maxRows,maxCols,curRows,curCols);
			for(var i=0;i<arrCol.length;i++){
				$id("t").rows(i).cells(arrRow.length).innerText = "="+arrCol[i];
				$id("t").rows(i).cells(arrRow.length).e_extensible="2";
				//合并
				$id("t").rows(i).cells(arrRow.length).colSpan=arrValue.length;
				for(var j=1;j<arrValue.length;j++){
					$id("t").rows(i).deleteCell(arrRow.length+j);
				}
			}
			for(var i=0;i<arrRow.length;i++){
				$id("t").rows(arrCol.length).cells(i).innerText = "="+arrRow[i];
				$id("t").rows(arrCol.length).cells(i).e_extensible="1";
			}
			for(var i=0;i<arrValue.length;i++){
				$id("t").rows(arrCol.length).cells(arrRow.length+i).innerText = "="+arrValue[i];

			}
			break;	
		}	
	}	
	function actRowCol(maxRows,maxCols,curRows,curCols){
		if(maxRows>curRows || maxCols>curCols){
			var s_dataset=$id("t").e_dataset;
			var s_datasetbak=$id("t").e_datasetbak;
			CreateReport(maxRows,maxCols);
			$id("t").e_dataset=s_dataset;
			$id("t").e_datasetbak=s_datasetbak;
		}
	}
}
/**
* 运行报表
*@date 2006-04-18
**/
function PreviewReport(){
	if(fcpub.fromdb=="yes"){
		var spath = fcpub.fileName;
	}else{
		var spath = fcpub.rootPath+fcpub.fileName;
	}
	window.open("ebrun.htm?file="+spath);
	//window.open("loadeb.htm?file=" + spath);
}
/**
* 进入报表参数表单设计器
*@date 2007-01-25
**/
function EbiaoFormDesign() {
	if(IsSpace($id("t").e_argsbak)) {
		alert("还没有定义报表参数,请先定义好后再试!");
		return;
    }
    var arr = new Array();
    arr[0] = $id('t');
    arr[1] = null;
    arr[2] = null;
    arr[3] = null;
    arr[4] = getTopWin();
	window.showModalDialog('../design/design.htm?startpage=no&ebuse=yes',arr,'status:no;dialogHeight:400px;dialogWidth:600px;center:yes;resizable:yes;');
}
/**
* 显示模态参数表单窗口
*@date 2007-01-25
**/
function EbiaoShowModalParaWin(owin) {
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer) {
        alert("只有在IE中才有此功能！");
        return;
    }

	var sFrame32 = '../common/djempty.htm?djcontent=yes';
	window.showModalDialog(sFrame32,owin,'status:no;resizable:yes;'+owin.sPubModalWin);
}
/**
* 增删行列时移动公式.
*@param row,col 为-1时表示不变动,rowDelta, colDelta为0时也不变动.它为要变动的数目.
*@date 2006-05-26
**/
function shiftFormulas(tableBody, row, col, rowDelta, colDelta) {
	if(fcpub.shiftf == "no") return;
    // Rewrite any formulas that refer to cells >= {row, col} location by {rowDelta, colDelta} amount.
    for (var i = 0; i < tableBody.rows.length; i++) {
        for (var tr = tableBody.rows[i], j = 0; j < tr.cells.length; j++) {
            var formula = tr.cells[j].innerText;
            if (formula != null && formula.length > 0) {
                if(formula.substring(0,1) == "="){
					formula = formula.substring(1,formula.length);
					var result = shiftFormula(formula, row, col, rowDelta, colDelta);
					if (result != formula)
						tr.cells[j].innerText = "=" + result ;
					
				}
            }
            //处理上主格及左主格
            var shead = tr.cells[j].e_left_head;
            if(shead != null && shead.length > 0){
				var result = shiftFormula(shead, row, col, rowDelta, colDelta);
				if (result != shead)
					tr.cells[j].e_left_head = result ;
            }
            
            var shead = tr.cells[j].e_top_head;
            if(shead != null && shead.length > 0){
				var result = shiftFormula(shead, row, col, rowDelta, colDelta);
				if (result != shead)
					tr.cells[j].e_top_head = result ;
            }
        }
    }

    
/**
* 判断是否为单元格的取数规则
	1 如字母的列数或数字的行数在表格的外面,则不是
	2 如前一个字符或后一个字符为.号则不是 
	
**/
    function shiftFormula(formula, row, col, rowDelta, colDelta) { //row,col为从0开始的
    // Rewrite a formula string that refer to cells >= {row, col} location by {rowDelta, colDelta} amount. \$?
		return formula.replace(/([a-zA-Z]+)([0-9]+)/g, 
        function(sRW, colStr, rowStr,startPos,source) {
			//alert(sRW); //匹配的整个串,如f1
			//alert(startPos);		//匹配串的开始位置
			//alert(source);		//整个字符串
			if(DeepCheck(sRW, colStr, rowStr,startPos,source) == false) return sRW;
            if (col >= 0 && colDelta != 0 ) {
                var x = LblToInt(colStr.toUpperCase());
                if (x > col && x <= tabTopHead.rows(0).cells.length )
                    colStr = IntToLbl(x + colDelta);
            }
            if (row >= 0 && rowDelta != 0 ) {
                var y = parseInt(rowStr); //因公式中的写法是从1开始的,不是从0开始的
                if (y > row && y <= tabLeftHead.rows.length )
                    rowStr = String(y + rowDelta);
            }
            return colStr + rowStr;
        });
        /**
        * 返回 true 表示是合法的A1等单元格表示法.
        **/
        function DeepCheck(sRW, colStr, rowStr,startPos,source) {
            if(startPos>0){
				var sBeforeOne = source.substring(startPos-1,startPos);
				//前一个字符只能为:(+- */=[{|&!:><,%$
				var sTag = "(+- */=[{|&!:><,%$";
				if(sTag.indexOf(sBeforeOne) < 0 ) return false; 
			}
			
			var endPos = startPos + sRW.length;
			if(endPos<source.length-1){ 
				var sAfterOne = source.substring(endPos,endPos+1);
				//后一个字符只能为:)+- */=]}|&:><,%{[
				var sTag = ")+- */=]}|&:><,%{[";
				if(sTag.indexOf(sAfterOne) < 0 ) return false; 

            }
            // .sum(fname 格式的判断.
            var sub1 = source.substring(0,startPos);
            sub1 = new Eapi.Str().trim(sub1);
            var l = sub1.length;
            var s1=sub1.substring(l-5,l);
            s1 = s1.toLowerCase();
            if(s1 == ".avg(" || s1 == ".sum(" ||  s1 == ".max(" || s1 == ".min(" || s1 == ".get(") return false; 
            var s1=sub1.substring(l-6,l);
            s1 = s1.toLowerCase();
            if(s1 == ".get1(") return false;
            var s1=sub1.substring(l-7,l);
            s1 = s1.toLowerCase();
            if(s1 == ".group(") return false;
            
            return true;
        }
	}
}
/**
* 由跨行的合并单元格反调行高
*@date 2006-06-28
**/
function AlignRowHeight(mergeTd,oldMergeTdHeight) {
	//如旧TD为跨行的合并单元格,
	if(mergeTd.rowSpan>1){
		if(mergeTd.offsetHeight>oldMergeTdHeight){
			var startRow = mergeTd.parentNode.rowIndex ;
			var endRow = startRow +mergeTd.rowSpan;
			var svalue = $id("t").rows(startRow).offsetHeight;
			for(var i=startRow;i<endRow;i++){
				tabLeftHead.rows(i).style.height = $id("t").rows(i).style.height = svalue;
			}
		}
	}

}
/**
* 同步选择行的行高
*@date 2006-06-29
**/
function AlignCurRowHeight(){
	var startRow = SelObj.sRowSort;
	var endRow = SelObj.eRowSort;
	var arr = new Array();
	for(var i=startRow;i<endRow;i++){
		arr[i-startRow] = $id("t").rows(i).offsetHeight;
	}
	for(var i=startRow;i<endRow;i++){
		tabLeftHead.rows(i).style.height = $id("t").rows(i).style.height = arr[i-startRow] ;
	}
	
}

/**
* 加一个最近打开的文件
*@date 2007-05-22
**/
function AddRecentFile(sFile){
	var s = fcpub.recentFile;
	if(s.length>0){
		var pos = s.indexOf(",") ; //用,分隔的报表名
		if(pos < 0){
			s = s + ","+sFile;			
		}else{
			var s1 = s.substring(pos+1,s.length);
			if(sFile != s1){ //以免两个文件一样
				s = s1 + "," +sFile;
			}
		}
	}else{
		s = sFile;
	}
	fcpub.recentFile = s ;
	
}
/**
* 用 fcpub.recentFile 刷新界面
*@date 2007-05-22
**/
function RefreshRecentFile(){
	var s = fcpub.recentFile ;
	if(s.length == 0 ) return;
	var arr = s.split(",");
	recentFile1.href="javascript:OpenReport(\"" + arr[0] + "\")";
	recentFile1.innerText = arr[0];
	if(arr.length > 1){
		recentFile2.href="javascript:OpenReport(\"" + arr[1] + "\")";
		recentFile2.innerText = arr[1];
		
	}
	
}
/**
* 选中范围内是否有行高或列宽太小
*@return true/false
*@date 2007-06-22
**/
function IsSmallRCValue() {
	var minV=2;
	for(var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++){
		if(tabLeftHead.rows(i).style.pixelHeight<minV){
			alert("因选中的区域内第"+(i+1)+"行高小于"+minV+",导致不能进行此操作,你可以将它的行高调高后再进行此操作.");
			return true;
		}
	}
	/*
	for(var i=SelObj.sColSort;i<=SelObj.eColSort;i++){
		if(tabTopHead.childNodes(0).childNodes(i).style.pixelWidth<minV){
			alert("因选中的区域内第"+i+"列宽小于"+minV+",导致不能进行此操作,你可以将它的列宽调宽后再进行此操作.");
			return true;
		}
	}*/
	return false;
}
/**
 * 如何根据table的列数来自动增减td,使table是一个规则的.
   1 先用一个数组prevTds来保存每一行减少的td数, 如 rowSpan=3 colSpan=4 则 当前行减少3个td,下两行减少4个td.
   2 然后根据tr中的实际td数和prevTds中的差值来增减td
*@date 2008-01-24   
**/
function AdjustTDs()
{
    var oTab = $id("t");
    if(oTab.tagName != "TABLE") return;
    var cols = oTab.childNodes(0).childNodes.length;
    var rows = oTab.rows.length;
    var i,j,k;
    var prevTds=new Array(rows);
    for(i=0;i<rows;i++){
        //var c = 0;
        for(j=0;j<oTab.rows(i).cells.length;j++){
            var rowSpans = oTab.rows(i).cells(j).rowSpan;
            var colSpans = oTab.rows(i).cells(j).colSpan;
            //if(rowSpans>1){
                prevTds[i] = _add(prevTds[i] , colSpans-1);
                for(k=1;k<rowSpans;k++){
                   prevTds[i+k] = _add(prevTds[i+k] , colSpans);
                }    
            //}
        }
    }
    for(i=0;i<rows;i++){
        var adds = cols-oTab.rows(i).cells.length-prevTds[i];
        for(j=0;j<Math.abs(adds);j++){
            if(adds>0){  //增加td
                oTab.rows(i).insertCell();
            }else if(adds<0){
                oTab.rows(i).deleteCell();            
            }
        }
    }
    function _add(arrSour,value){
        if(typeof(arrSour) == "undefined") arrSour = 0;
        arrSour += value;
        return arrSour;
    }    
}

