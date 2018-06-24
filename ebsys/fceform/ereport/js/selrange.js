var blnMouseDown=false	//在表格上mousedown时此变量为真
//用于当移到边界外时捕获鼠标,自动滚动.
var blnCapture=false
var iTimeID=0
var iTimeID1=0
var iTimeID2=0
var iTimeID3=0
var tdEndSel //
//---------------------
//选择时,记录起止单元的坐标
var	sTop,sLeft,sWidth,sHeight,eTop,eLeft,eWidth,eHeight
//记录选择时的起止单元格的物理位置
var sRow,sCol,eRow,eCol	
//排好序后的位置
var sRowSort,sColSort,eRowSort,eColSort
//当前td
var pubCurTd=null;
var iTimeID=0;
//当前选中的TD集合
var selCells=[] ;
//偏移量
var pubOffsetX = 2,pubOffsetY = 2,pubOffset=3 ;
//当前选择的对象
var SelObj = {
	sRow : 0 ,
	sCol : 0 ,
	eRow : 0 ,
	eCol : 0 ,
	sRowSort : 0 ,
	sColSort : 0 ,
	eRowSort : 0 ,
	eColSort : 0 ,
	sTop	: 0 ,
	sLeft	: 0,
	sWidth	: 0,
	sHeight	: 0,
	eTop	:0,
	eLeft	:0,
	eWidth	:0,
	eHeight	: 0,
	curTop	:0,
	curLeft	: 0,
	curWidth: 0,
	curHeight: 0,
	cellpos : [],
	cells : [] , //每个元素的值为一个oCell对象{row,col,tdrow,tdcol,oTD}
	curTD	: new oCell(), //也是一个oCell对象
	oldTD	: null , //上一个TD对象
	/*
 * 选中状态：
	0 未选中,或不定
 	1 选中单个单元格
 	2 选中单个合并单元格
 	3 拖动选中一组小单元格
 	4 拖动选中一组混合单元格（不能合并）
 * 选中方式：
	0 未选中
 	1 点击选中单个单元格
 	2 拖动选中一组单元格
 	3 用shift键选中一组单元格。
 	4 选中行
 	5 选中列
 	6 全选
 	7 按键选中单元格。	
	*/
	status		: 0, //选中状态
	howselect	: 0,  //选中方式
	selrowcol	: 0,  //=1表示选中整行或整列,=0表示选中一个或多个单元格
	moveTD	: [0,0], //鼠标移动过程中的上一个TD
	cellsed	: false, //为真表示已计算过当前选中的cells
	sPasteFormat : "", //格式刷时保存的cssText串
	
	nouse : ""
}

function oCell(row,col,tdrow,tdcol,oTD) {
	this.row = row ;
	this.col = col ;
	this.tdrow = tdrow ;
	this.tdcol = tdcol ;
	this.oTD = oTD ;
}
/**
*表格MOUSEDOWN事件处理,处理选择区域
**/
function t_onmousedown() {

	var obj=event.srcElement 
	if (event.button ==2)
		return;

	if (obj.tagName!="TD" ) //|| obj.parentNode.rowIndex==0 || obj.cellIndex==0
		return;
	
	SelObj.selrowcol = 0 ; //恢复

	//shift+点击,表示选中
	if(event.shiftKey){
		_EndSelectRange(obj) 
		return ;
	}	
	
		showFontProperty(obj)
		blnMouseDown=true
		if (blnCapture==false) {
			blnCapture=true
			$id("t").setCapture();
		}

		ShowTitleColor(false);
		scrollForVisibleCell(obj);
		
		SelObj.sLeft=obj.offsetLeft //初始位置
		SelObj.sTop=obj.offsetTop 
		SelObj.sWidth=obj.offsetWidth 
		SelObj.sHeight=obj.offsetHeight 				
			
		SelObj.eLeft=SelObj.sLeft 
		SelObj.eTop=SelObj.sTop 
		SelObj.eWidth=SelObj.sWidth 
		SelObj.eHeight=SelObj.sHeight 
				
		var i

		SelObj.sRow = obj.parentNode.rowIndex;
		
//		var objHeadTd = document.elementFromPoint(SelObj.sLeft+divTopHead.style.pixelLeft+pubOffset-divMain.scrollLeft,divTopHead.style.pixelTop+pubOffset);
		var objHeadTd = document.elementFromPoint(SelObj.sLeft+divTopHead.style.pixelLeft+pubOffset-divMain.scrollLeft,(divTopHead.style.pixelTop+divAll.style.pixelTop)+pubOffset);
		SelObj.sCol = objHeadTd.cellIndex;

	//当选中一个合并单元时
	var iRowSpan=obj.rowSpan
	var iColSpan=obj.colSpan
	SelObj.eRow=SelObj.sRow+iRowSpan-1
	SelObj.eCol=SelObj.sCol+iColSpan-1
	SelObj.sRowSort=SelObj.sRow
	SelObj.sColSort=SelObj.sCol
	SelObj.eRowSort=SelObj.eRow
	SelObj.eColSort=SelObj.eCol
	SelObj.curTD.row = SelObj.sRow;
	SelObj.curTD.col = SelObj.sCol;
	SelObj.curTD.tdrow = SelObj.sRow;
	SelObj.curTD.tdcol = obj.cellIndex;
	SelObj.oldTD = SelObj.curTD.oTD;
	SelObj.curTD.oTD = obj;
	
	SelObj.moveTD[0] = SelObj.curTD.tdrow;
	SelObj.moveTD[1] = SelObj.curTD.tdcol;
	SelObj.howselect=1;
	if(iRowSpan>1 || iColSpan>1)
		SelObj.status=2;
	else
		SelObj.status=1;
		
		
	showBlueScale();
	moveInputFocus(1);


}
/**
*表格MOUSEMOVE事件处理,处理选择区域
**/

function t_onmousemove() {
	if (event.button ==2)
		return;

//	t.style.cursor="default"
	
	var obj=event.srcElement 
	if(obj.tagName != "TD") return;
	//if (obj.tagName!="TH" && obj.tagName!="TD" && obj.id != "txtEdit" && obj.id !="divMain" ) {
		 
	//	blnMouseDown = false;
		//t_onmouseup();
	//	return;
	//}
	/*
	if(obj.tagName == "TD"){
		if(obj.parentNode.parentNode.parentNode.id != "t"){
			blnMouseDown = false;
			//t_onmouseup();
			return;
		}
	}*/
//	var oActive = document.activeElement;
//	if(oActive.id == "txtEdit") return;

	var eventx = event.clientX;
	var eventy = event.clientY;
	//如鼠标移出编辑区
	if(eventx < divMain.style.pixelLeft - fcpub.divMainOffset || eventx > divMain.style.pixelLeft + divMain.clientWidth + fcpub.divMainOffset
		|| eventy < divAll.style.pixelTop + divMain.style.pixelTop - fcpub.divMainOffset || eventy > divAll.style.pixelTop + divMain.style.pixelTop + divMain.clientHeight + fcpub.divMainOffset ){
		t_onmouseup();
		return;
	}
	
	
	if ( blnMouseDown==true){
		//如果在边界则滚动
		if(eventy > divAll.style.pixelTop + divMain.style.pixelTop+divMain.clientHeight - fcpub.divMainOffset){
			window.setTimeout("scrollTimer('bottom')",200);		
		}else if(eventy < divAll.style.pixelTop + divMain.style.pixelTop +fcpub.divMainOffset){
			window.setTimeout("scrollTimer('top')",200);	
		}else if(eventx < divMain.style.pixelLeft + fcpub.divMainOffset){
			window.setTimeout("scrollTimer('left')",200);	
		}else if(eventx > divMain.style.pixelLeft +divMain.clientWidth - fcpub.divMainOffset){
			window.setTimeout("scrollTimer('right')",200);	
		}else{
			if(SelObj.moveTD[0] != obj.parentNode.rowIndex || SelObj.moveTD[1] != obj.cellIndex){
				_EndSelectRange(obj) ;
				SelObj.howselect=2;
				SelObj.status = 0 ;
			}
		}
	}
		
}
/**
*表格MOUSEUP事件处理,处理选择区域
**/
function t_onmouseup() {	
	//if(NoRunMouseUp) {
	//	NoRunMouseUp=false
	//	return
	//}

	blnMouseDown=false;
	blnCapture=false;
	$id("t").releaseCapture();
	//txtEdit.focus();
	//getSelCells();


	if (cmdBrush.getAttribute("fcDown")=="1") {
		cmdPasteFormat();
		//cmdBrush.setAttribute("fcDown","0");
		//cmdBrush.className="tblclassup";
		//clearBlueScale()
	}		
	//考虑到滚动后
	//	showBlueScale();
	//	moveInputFocus();
	
}
//obj=td
function _EndSelectRange(obj) {
	ShowTitleColor(false);
	scrollForVisibleCell(obj);
	SelObj.moveTD[0] = obj.parentNode.rowIndex ;
	SelObj.moveTD[1] = obj.cellIndex;
	
	SelObj.eLeft=obj.offsetLeft 
	SelObj.eTop=obj.offsetTop 
	SelObj.eWidth=obj.offsetWidth 
	SelObj.eHeight=obj.offsetHeight 

	SelObj.eRow = obj.parentNode.rowIndex ;
//	var objHeadTd = document.elementFromPoint(SelObj.eLeft+divTopHead.style.pixelLeft+pubOffset-divMain.scrollLeft,divTopHead.style.pixelTop+pubOffset);
	var objHeadTd = document.elementFromPoint(SelObj.eLeft+divTopHead.style.pixelLeft+pubOffset-divMain.scrollLeft,(divTopHead.style.pixelTop+divAll.style.pixelTop)+pubOffset);
	SelObj.eCol = objHeadTd.cellIndex;
		
	if(SelObj.sRow>SelObj.eRow){
		SelObj.sRowSort=SelObj.eRow
		SelObj.eRowSort=SelObj.sRow
	}
	else {
		SelObj.eRow += obj.rowSpan-1;
		SelObj.sRowSort=SelObj.sRow
		SelObj.eRowSort=SelObj.eRow
	}
	if(SelObj.sCol>SelObj.eCol){
		SelObj.sColSort=SelObj.eCol
		SelObj.eColSort=SelObj.sCol
	}
	else {
		SelObj.eCol += obj.colSpan -1 ;
		SelObj.sColSort=SelObj.sCol
		SelObj.eColSort=SelObj.eCol
	}
//-----------------------------------------------------------

	showBlueScale()
	
	//if (iTimeID==0) {
	//	iTimeID=window.setInterval("autoScroll(SelObj.eRow+1,SelObj.eCol+1);",200)
	//}
		
}

function hiddenBlue(){
	for(var i=0;i<4;i++){
		tLine[i].style.visibility = "hidden";
	}
}
function visibleBlue(){
	for(var i=0;i<4;i++){
		tLine[i].style.visibility = "visible";
	}
}

/**
*清除兰色的选中框	
**/
function clearBlueScale(){
	for(var i=0;i<4;i++){
		tLine[i].style.visibility = "hidden";
	}

	//tc.style.display ="none"
	var l = tabLeftHead.rows.length;
	var ll = tabTopHead.rows(0).cells.length;
	for(var i=0;i<l;i++)
		$id("t").rows(i).cells(0).style.color="black"
	for(var j=0;j<ll;j++)	
		$id("t").rows(0).cells(j).style.color="black"	
		//hideTxt()
}

function ShowTitleColor(bTrue) {
//	var sClassName = "" ;
//	if(bTrue) sClassName = "active_";
	
//变标题行列的颜色		
	if(bTrue){
		for (var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++){
			if(i>tabLeftHead.rows.length-1) break;
			//tabLeftHead.rows(i).cells(0).className = sClassName + "left_td";
			var obj = tabLeftHead.rows(i).cells(0);
			obj.style.fontWeight = "bold";
			obj.style.borderRight = "black 1px solid";
			obj.style.borderBottom = "#000000 2px solid";
			
			
		}
		for (var i=SelObj.sColSort;i<=SelObj.eColSort;i++){
			if(i>tabTopHead.rows(0).cells.length-1) break;
			//tabTopHead.rows(0).cells(i).className = sClassName + "top_td";
			var obj = tabTopHead.rows(0).cells(i);
			obj.style.borderTop = "#FFFFFF 1px solid";
			obj.style.borderRight = "black 1px solid";
			obj.style.borderBottom = "#000000 2px solid";
			obj.style.fontWeight = "bold";
		}
	}else{
		for (var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++){
			if(i>tabLeftHead.rows.length-1) break;
			tabLeftHead.rows(i).cells(0).style.cssText = "";
		}
		for (var i=SelObj.sColSort;i<=SelObj.eColSort;i++){
			if(i>tabTopHead.rows(0).cells.length-1) break;
			tabTopHead.rows(0).cells(i).style.cssText = "";
		}

	
	}
}
/**
*显示兰色的选中框
*@param sTag = "selrowcol"
**/
function showBlueScale(sTag){
	visibleBlue();
	SelObj.cellsed = false ;
	
	ShowTitleColor(true);
	
	showBlueRect(sTag);

	//

	/**
	*根据sLeft sTop sWidth sHeight eLeft eTop eWidth eHeight这八个全局变量的值计算兰框的位置
	**/
	function showBlueRect(sTag){

		if(SelObj.selrowcol == 0) { //(sTag != "selrowcol"){
			if (SelObj.sLeft==SelObj.eLeft && SelObj.sTop==SelObj.eTop)	{
				SelObj.curLeft=SelObj.sLeft
				SelObj.curTop=SelObj.sTop
				SelObj.curWidth=SelObj.sWidth
				SelObj.curHeight=SelObj.sHeight
			}
			if (SelObj.sLeft<=SelObj.eLeft && SelObj.sTop<=SelObj.eTop)			
			{
				SelObj.curLeft=SelObj.sLeft
				SelObj.curTop=SelObj.sTop
				SelObj.curWidth=SelObj.eWidth+SelObj.eLeft-SelObj.sLeft
				SelObj.curHeight=SelObj.eHeight+SelObj.eTop-SelObj.sTop
			}
			if (SelObj.sLeft<=SelObj.eLeft && SelObj.sTop>SelObj.eTop)			
			{
				SelObj.curLeft=SelObj.sLeft
				SelObj.curTop=SelObj.eTop
				SelObj.curWidth=SelObj.eWidth+SelObj.eLeft-SelObj.sLeft
				SelObj.curHeight=SelObj.sHeight+SelObj.sTop-SelObj.eTop

			}
			if (SelObj.sLeft>=SelObj.eLeft && SelObj.sTop>=SelObj.eTop)			
			{
				SelObj.curLeft=SelObj.eLeft
				SelObj.curTop=SelObj.eTop
				SelObj.curWidth=SelObj.sWidth+SelObj.sLeft-SelObj.eLeft
				SelObj.curHeight=SelObj.sHeight+SelObj.sTop-SelObj.eTop
			}
			if (SelObj.sLeft>SelObj.eLeft && SelObj.sTop<=SelObj.eTop)			
			{
				SelObj.curLeft=SelObj.eLeft
				SelObj.curTop=SelObj.sTop
				SelObj.curWidth=SelObj.sWidth+SelObj.sLeft-SelObj.eLeft
				SelObj.curHeight=SelObj.eHeight+SelObj.eTop-SelObj.sTop
			}
		}
		DrawScale(SelObj.curLeft,SelObj.curTop ,SelObj.curWidth,SelObj.curHeight) ;
	//	DrawScale(SelObj.curLeft+divMain.style.pixelLeft-divMain.scrollLeft,SelObj.curTop+divMain.style.pixelTop -divMain.scrollTop,SelObj.curWidth,SelObj.curHeight) ;
	}
	/**
	* 画选中框
	*@date 2006-04-20
	**/
	function DrawScale(iLeft,iTop,iWidth,iHeight) {
		var lineWidth = 2 ;
		var left1 = iLeft - lineWidth;
		var top1 = iTop - lineWidth;
		var width1 = iWidth + 2 * lineWidth ;
		var height1 = iHeight + 2 * lineWidth ;
		
		if(isNaN(left1) || isNaN(top1) || isNaN(width1) || isNaN(height1)) return ;
		//左边线  
		tLine[0].style.left = left1 ;
		tLine[0].style.top = top1 ;
		tLine[0].style.width = lineWidth ;
		tLine[0].style.height = height1 ;
		//上边线
		tLine[1].style.left = left1 ;
		tLine[1].style.top = top1 ;
		tLine[1].style.width = width1 ;
		tLine[1].style.height = lineWidth ;
		var left2 = iLeft + iWidth;
		var top2 = iTop + iHeight;
		//右边线
		tLine[2].style.left = left2 ;
		tLine[2].style.top = top1 ;
		tLine[2].style.width = lineWidth ;
		tLine[2].style.height = height1 ;
		//下边线
		tLine[3].style.left = left1 ;
		tLine[3].style.top = top2 ;
		tLine[3].style.width = width1 ;
		tLine[3].style.height = lineWidth ;
	//	for(var i=0;i<4;i++){
	//		tLine[i].style.visibility = "visible";
	//	}

	}
	
}
/**
*选择某个区域的常用函数
*@para sTag="adjust",sTag="selrow/selcol"
**/
function selectRange(sTag,sRow1,sCol1,eRow1,eCol1){
	

	
	if(sTag == "adjust"){
		SelObj.selrowcol=0; //调整后恢复默认值
	}
	if(arguments.length == 5){
		
		if(sTag != "init" ) ShowTitleColor(false);
		SelObj.sRow=sRow1
		SelObj.sCol=sCol1
		SelObj.eRow=eRow1
		SelObj.eCol=eCol1
		if(SelObj.sRow>SelObj.eRow){
			SelObj.sRowSort=SelObj.eRow
			SelObj.eRowSort=SelObj.sRow
		}
		else {
			SelObj.sRowSort=SelObj.sRow
			SelObj.eRowSort=SelObj.eRow
		}
		if(SelObj.sCol>SelObj.eCol){
			SelObj.sColSort=SelObj.eCol
			SelObj.eColSort=SelObj.sCol
		}
		else {
			SelObj.sColSort=SelObj.sCol
			SelObj.eColSort=SelObj.eCol
		}
	}
	
	var td1=findLogTd(SelObj.sRow,SelObj.sCol);
	if(td1 == null ) return;
	if(sTag != "adjust") scrollForVisibleCell(td1);
	SelObj.sLeft=td1.offsetLeft ;
	SelObj.sTop=td1.offsetTop ;
	SelObj.sWidth=td1.offsetWidth ;
	SelObj.sHeight=td1.offsetHeight ;
	var td2=findLogTd(SelObj.eRow,SelObj.eCol);
	if(td2 == null ) return;
	SelObj.eLeft=td2.offsetLeft;
	SelObj.eTop=td2.offsetTop;
	SelObj.eWidth=td2.offsetWidth;
	SelObj.eHeight=td2.offsetHeight;

	
	if(sTag == "selrow"){ //因选择行列时不用考虑合并单元格
		SelObj.curLeft=0;
		SelObj.curTop = tabLeftHead.rows(SelObj.sRowSort).cells(0).offsetTop;
		SelObj.curWidth = $id("t").offsetWidth;
		SelObj.curHeight = tabLeftHead.rows(SelObj.sRowSort).cells(0).offsetHeight;
		showBlueScale("selrowcol");
	}else if(sTag == "selcol"){ //因选择行列时不用考虑合并单元格
		SelObj.curLeft=tabTopHead.rows(0).cells(SelObj.sColSort).offsetLeft;
		SelObj.curTop = 0 ;
		SelObj.curWidth =tabTopHead.rows(0).cells(SelObj.sColSort).offsetWidth;
		SelObj.curHeight =  $id("t").offsetHeight;
		showBlueScale("selrowcol");

//	}else if(SelObj.selrowcol == 1 && sTag == "adjust"){ //表示选中行列后再调整.
//		showBlueScale("selrowcol");
		
	}else{
		showBlueScale();
	}

		
	if(sTag != "adjust"){
		SelObj.curTD.row = SelObj.sRow;
		SelObj.curTD.col = SelObj.sCol;
		SelObj.curTD.tdrow = td1.parentNode.rowIndex;
		SelObj.curTD.tdcol = td1.cellIndex;
		SelObj.oldTD = SelObj.curTD.oTD;
		SelObj.curTD.oTD = td1;
		SelObj.status=0;
		SelObj.cellsed = false;
		moveInputFocus(1);
	}else {
		moveInputFocus();
	}

	
	//if(bAdjustChange){
	//	SelObj.selrowcol = 1;
	//}	
	
}
/**
*选择区域到某个点
**/
function selectRangeTo(eRow1,eCol1){
//
	ShowTitleColor(false);
	SelObj.eRow=eRow1
	SelObj.eCol=eCol1
	if(SelObj.sRow>SelObj.eRow){
		SelObj.sRowSort=SelObj.eRow
		SelObj.eRowSort=SelObj.sRow
	}
	else {
		SelObj.sRowSort=SelObj.sRow
		SelObj.eRowSort=SelObj.eRow
	}
	if(SelObj.sCol>SelObj.eCol){
		SelObj.sColSort=SelObj.eCol
		SelObj.eColSort=SelObj.sCol
	}
	else {
		SelObj.sColSort=SelObj.sCol
		SelObj.eColSort=SelObj.eCol
	}
	var arr1=PhyToLog(SelObj.eRow,SelObj.eCol);
	var td2=$id("t").rows(arr1[0]).cells(arr1[1]);
	SelObj.eLeft=td2.offsetLeft;
	SelObj.eTop=td2.offsetTop;
	SelObj.eWidth=td2.offsetWidth;
	SelObj.eHeight=td2.offsetHeight;
	showBlueScale();
	
	SelObj.status=0;
	SelObj.cellsed = false;
	//txtEdit.focus();
	setInputFocus();
	
}
/**
* 如选择到合并单元格时要重算sRow等,按方向键时用
*@date 2006-05-15
**/
function selectRangeBig() {
	var td1=findLogTd(SelObj.sRowSort,SelObj.sColSort);
	if(td1 == null ) return;
	if(td1.colSpan >1 || td1.rowSpan >1 ){
		
		//重算
		SelObj.sCol = TDToCol(td1);
		SelObj.sRow = td1.parentNode.rowIndex;
		SelObj.eCol = SelObj.sCol + td1.colSpan -1 ;
		SelObj.eRow = SelObj.sRow + td1.rowSpan -1 ;
		SelObj.sColSort = SelObj.sCol;
		SelObj.sRowSort = SelObj.sRow;
		SelObj.eColSort = SelObj.eCol;
		SelObj.eRowSort = SelObj.eRow;
		
	}

	selectRange();

}
/**
*单元格拆分
**/
function Split() {
	if(SelObj.status != 2) {
		alert("只有选中了单个合并单元格时才能执行单元格拆分操作!");
		return;
	}

	var arrCol = new Array();
	for(var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++){
		arrCol[i-SelObj.sRowSort]=PhyToLogCol(i,SelObj.sColSort);
	}

	var rCount=SelObj.eRowSort-SelObj.sRowSort+1 //合并的行数
	var cCount=SelObj.eColSort-SelObj.sColSort+1 //合并的列数
	//增加第一行之后的所有单元格	
	for (var i=SelObj.eRowSort;i>=SelObj.sRowSort+1;i--){
		var tdsCol=arrCol[i-SelObj.sRowSort][1];//PhyToLogCol(i,sColSort)
		var tdsColbak = tdsCol;
		if(arrCol[i-SelObj.sRowSort][0]==2) tdsColbak++;
		var tdeCol=SelObj.eColSort-SelObj.sColSort+tdsCol;
		for (var j=tdsCol;j<=tdeCol;j++){
			if (tdsColbak<$id("t").rows(i).cells.length)
				$id("t").rows(i).insertCell(tdsColbak);
			else
				$id("t").rows(i).insertCell();
		}
	}
	//增加第一行的第一个单元格之后的单元格
	var tdsCol=arrCol[0][1]; //PhyToLogCol(sRowSort,sColSort)
	var tdeCol=SelObj.eColSort-SelObj.sColSort+tdsCol;
	for (var j=tdsCol+1;j<=tdeCol;j++){
		if(tdsCol+1<$id("t").rows(SelObj.sRowSort).cells.length)
			$id("t").rows(SelObj.sRowSort).insertCell(tdsCol+1);
		else
			$id("t").rows(SelObj.sRowSort).insertCell();
	}
	//给第一单元格的rowSpan colSpan
	$id("t").rows(SelObj.sRowSort).cells(tdsCol).rowSpan=1;
	$id("t").rows(SelObj.sRowSort).cells(tdsCol).colSpan=1;

	$id("t").rows(SelObj.sRowSort).cells(tdsCol).removeAttribute("e_merge");
	
	//CopytHtml()
	//grid.moveedit()
	selectRange();
	blnChange=true
}
/**
*sRow sCol eRow eCol 单元格合并	
**/
function Merge() {
	//divShowMsg.style.display="";
	//alert();
	
	
	if(IsSmallRCValue()) return;
	getSelCells();
	var l=SelObj.cells.length;
	if(l<=0) return
	if(SelObj.status != 3 ) {
		alert("只有选中了一组未合并的单元格时才能执行单元格合并操作!");
		return;
	}
	
	
	//如行方向上伸出了界
	var bMultiRow = SelObj.eRowSort > SelObj.sRowSort ;
	for(var i=SelObj.sColSort;i<=SelObj.eColSort;i++){
		var oTd = findLogTd(SelObj.sRowSort,i) ;
		if(oTd.parentNode.rowIndex < SelObj.sRowSort) {
			alert("只有选中了一组未合并的单元格时才能执行单元格合并操作!");
			return;
		}
		if(bMultiRow){
			oTd = findLogTd(SelObj.eRowSort,i) ;
		}
		if(oTd.parentNode.rowIndex + oTd.rowSpan - 1 > SelObj.eRowSort) {
			alert("只有选中了一组未合并的单元格时才能执行单元格合并操作!");
			return;
		}

	}
/*
		for(var i=SelObj.sColSort;i<=SelObj.eColSort;i++){
			var oTd = findLogTd(SelObj.eRowSort,i) ;
			if(oTd.parentNode.rowIndex + oTd.rowSpan - 1 > SelObj.eRowSort) {
				alert("只有选中了一组未合并的单元格时才能执行单元格合并操作!");
				return;
			}
		}
*/
	for(var i=l-1;i>0;i--){
	    
		$id("t").rows(SelObj.cells[i].tdrow).deleteCell(SelObj.cells[i].tdcol);
	}
	$id("t").rows(SelObj.cells[0].tdrow).cells(SelObj.cells[0].tdcol).colSpan = SelObj.eColSort-SelObj.sColSort+1;
	$id("t").rows(SelObj.cells[0].tdrow).cells(SelObj.cells[0].tdcol).rowSpan = SelObj.eRowSort-SelObj.sRowSort+1;
	
	//加上计算e_merge属性
//	$id("t").rows(SelObj.cells[0].tdrow).cells(SelObj.cells[0].tdcol).e_merge =(SelObj.sRowSort+1)+ ","+(SelObj.sColSort+1)+"-"+(SelObj.eRowSort+1)+","+(SelObj.eColSort+1) ; //e_merge="1,3-1,4"
	selectRange();
	SelObj.status=2;
	//CopytHtml()
	blnChange=true
	//divShowMsg.style.display="none";
}
function PhyToLog(row,col) {
	return getLogTd(row,col);
	//return PhyToLogTmp(row,col,1)
}
/**
求同一行物理列col的前面有多少个TD被合并了.然后返回col减去这个个数.
用于合并和拆分时找到删除TD和插入TD的位置
return: 
1：正常TD，返回当前td列号
2：单元格已被上行合并，但当前TD不在开始处，返回前一个TD列号
3：单元格已被上行合并，但当前TD在开始处，返回0,表示当前位置及此行的前面没有一个td
**/
function PhyToLogCol(row,col,iNextRowHeight) {
	
	var arr = getLogTd(row,col,iNextRowHeight);
	if(arr[0] == row ){
		return [1,arr[1]] ;
	}else {
		if(col>0){
			var arrLeft = PhyToLogCol(row,col-1,-1); //-1表示不要在全局变量处记录此次查找
			if(arrLeft[0]==1)
				return [2,arrLeft[1]]; //返回前一个TD列号
			else
				return arrLeft ;
		}else{
			return [3,0] ; //表示当前位置及此行的前面没有一个td
		}
	}
	//return PhyToLogTmp(row,col,3)

}
function CopytHtml(sTag) {
	return;

}
/**
* 由物理的行列得到TD的行列。
**/
function getLogTd(row,col,iNextRowHeight) {
	var oTd = findLogTd(row,col,iNextRowHeight);
	if(oTd == null) return [0,0];
	return [oTd.parentNode.rowIndex,oTd.cellIndex];
}
	//由行列找到x,y
function getLocation(row,col){
	//由行列找到x,y
	var posX=posY=0;
	if(typeof(row) == "undefined" || typeof(col) == "undefined") return [1,1]; 	//初值为1
	if(isNaN(col)) return [0,0];
	try{
	    posX = tabTopHead.rows(0).cells(col).offsetLeft;
	    posY = tabLeftHead.rows(row).cells(0).offsetTop;
	}catch(e){ //出错可能是因为元素可能尚未到位,即异步所致
	    if(col == 0 && row == 0 ){
	        posX = 1 ;  //初值为1
	        posY = 1 ;
	    }
        	
	}
	return [posX,posY];
}

//取row,col处的TD,如无或异常则返回null,iNextRowHeight=下一行的行高,用于快速计算
function findLogTd(row,col,iNextRowHeight) {
    //if(row == 0 && col == 0) return $id("t").rows(0).cells(0);
    
	var oRet=null;
    if(typeof iNextRowHeight == "undefined" || iNextRowHeight < 0 )
    {	
	    var arr = getLocation(row,col);
	    var tdposx =arr[0];
	    var tdposy = arr[1];
	    var posX=arr[0]+pubOffsetX;
	    var posY=arr[1]+pubOffsetY;  //上层多一个边框,所以+1
	    /*var nextWidth = nextHeight = prevWidth = prevHeight = 0;
    	
	    if(bFast){ //翻页式滚动.用于要求一次快速滚动时
		    nextHeight = prevHeight = divMain.clientHeight-tabLeftHead.rows(row).style.pixelHeight;
		    nextWidth = prevWidth =divMain.clientWidth-tabTopHead.childNodes(0).childNodes(col).style.pixelWidth;
	    }else{
		    if(col<tabTopHead.childNodes(0).childNodes.length-1) 
			    nextWidth = tabTopHead.childNodes(0).childNodes(col+1).style.pixelWidth ;
		    else
			    nextWidth = tabTopHead.childNodes(0).childNodes(tabTopHead.childNodes(0).childNodes.length-1).style.pixelWidth ;
    				
		    if(row<tabLeftHead.rows.length-1) 
			    nextHeight = tabLeftHead.rows(row+1).style.pixelHeight ;
		    else
			    nextHeight = tabLeftHead.rows(tabLeftHead.rows.length-1).style.pixelHeight ;
		    if(col>0) prevWidth = tabTopHead.childNodes(0).childNodes(col-1).style.pixelWidth ;
		    if(row>0) prevHeight = tabLeftHead.rows(row-1).style.pixelHeight ;
    	
	    }*/
	    var iOffsetLeft = 0; //还需要移动的值,如为0则表示直接能看到
	    var iOffsetTop =0;
	    if(tdposx-divMain.scrollLeft >= divMain.clientWidth )
		    iOffsetLeft = tdposx-divMain.clientWidth-divMain.scrollLeft ;
	    else if (tdposx-divMain.scrollLeft <= 0 ) 
		    iOffsetLeft = tdposx-divMain.scrollLeft; //为负数
    	
	    if(tdposy-divMain.scrollTop >= divMain.clientHeight) 
		    iOffsetTop = tdposy-divMain.clientHeight-divMain.scrollTop;
	    else if(posY-divMain.scrollTop <= 0 )	
		    iOffsetTop = tdposy - divMain.scrollTop;

    	
	    var t_left=0,t_top=0,pointX=0,pointY=0;		
	    //divMain.scrollLeft = iOffsetLeft;	 
	    //divMain.scrollTop = iOffsetTop ;
	    //改为
	    //$id("t").style.position = "absolute";
	    pointX = -iOffsetLeft+tdposx+pubOffsetX ;
	    if(iOffsetLeft > 0) {
		    t_left = (iOffsetLeft+2*pubOffsetX)*(-1) ;
		    pointX = -iOffsetLeft+tdposx-pubOffsetX ; //距右边界2px
	    }
	    if(iOffsetLeft < 0) {
		    t_left = (iOffsetLeft)*(-1) ;
	    }
	    pointX = (divTopHead.style.pixelLeft+divAll.style.pixelLeft-divMain.scrollLeft)+pointX ;
    	
	    pointY = -iOffsetTop+tdposy+pubOffsetY;
	    if(iOffsetTop > 0) {
		    t_top = (iOffsetTop+2*pubOffsetY)*(-1) ;
		    pointY = -iOffsetTop+tdposy-pubOffsetY;
	    }
	    if(iOffsetTop < 0) {
		    t_top = (iOffsetTop)*(-1) ;
	    }
	    pointY = (divLeftHead.style.pixelTop+divAll.style.pixelTop-divMain.scrollTop)+pointY ;
    }else if(iNextRowHeight >= 0){
	    var t_left = pubin.t_left;
	    var t_top = pubin.t_top-iNextRowHeight;
	    var pointX = pubin.pointX;
	    var pointY = pubin.pointY;
    }	
    if(iNextRowHeight != -1){ //-1是用于按col去找.
	    pubin.t_left = t_left;
	    pubin.t_top = t_top;
	    pubin.pointX = pointX;
	    pubin.pointY = pointY;
    }
	    //divMain.style.visibility = "hidden";
	    $id("t").style.top = t_top;
    if(typeof iNextRowHeight == "undefined" || iNextRowHeight < 0){
	    $id("t").style.left = t_left;
	    txtEdit.style.display="none";
    }
	
	
//	var obj = document.elementFromPoint(divTopHead.style.pixelLeft-divTopHead.scrollLeft+posX,divLeftHead.style.pixelTop-divLeftHead.scrollTop+posY) ;
	var obj = document.elementFromPoint(pointX,pointY) ;
	if(obj != null){
		if(obj.tagName == "TD"){
			oRet = obj;
			
		}
		if(obj.tagName == "TH"){ //在框线上时,+2px再找
//			obj = document.elementFromPoint(divTopHead.style.pixelLeft-divTopHead.scrollLeft+posX+2,divLeftHead.style.pixelTop-divLeftHead.scrollTop+posY+2) ;
			var obj = document.elementFromPoint(pointX+2,pointY+2) ;
			if(obj != null){
				if(obj.tagName == "TD"){
					oRet = obj;
				}		
			}
		}
		
	}

	if(iNextRowHeight == -1 || typeof iNextRowHeight == "undefined"){ // -2 表示开始快速找 (在外面结束)
		$id("t").style.left = 0;
		$id("t").style.top = 0;	
		txtEdit.style.display="";
	}

	return oRet;
}
//取得当前选择的cells
function getSelCells(){
	if(SelObj.cellsed) return;
	//备份滚动值
	//var divMainScrollLeftBak = divMain.scrollLeft;
	//var divMainScrollTopBak = divMain.scrollTop;
	
	var blnBool = false;
	var arrCells=[]; //[row,tdsTag,tdscol,tdeTag,tdecol]
	var arrCell =[]; //[tdrow,tdcol,oTD];
			   			var   d = new Date();
						var   t = d.getTime();


	var bMultiCol = SelObj.eColSort>SelObj.sColSort;
	var iNextRowHeight = -2 ; 
	//计算开始列
	for (var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++)
	{
		arrCells[i-SelObj.sRowSort]=new Object();
		arrCells[i-SelObj.sRowSort].row = i ;
		//最后行时没有下一行行高.
		//if(i == tabLeftHead.rows.length-1) iNextRowHeight = -2 ;
		var tmpArr = PhyToLogCol(i,SelObj.sColSort,iNextRowHeight);
		arrCells[i-SelObj.sRowSort].tdsTag =tmpArr[0];
		arrCells[i-SelObj.sRowSort].tdscol =tmpArr[1];
		//if(tmpArr[0] != 1) blnBool=true;
		//if(i<SelObj.eRowSort  )
		iNextRowHeight=$id("t").rows(i).style.pixelHeight; //记住旧的行的行高,供下一行只需要将表格上移这个行高就能可见了.
	}	
	//计算结束列
	var iNextRowHeight = -2;
	for (var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++)
	{
		if(bMultiCol){
			//最后行时没有下一行行高.
			//if(i == tabLeftHead.rows.length-1) iNextRowHeight = -2 ;
			var tmpArr = PhyToLogCol(i,SelObj.eColSort,iNextRowHeight);
			//if(i<SelObj.eRowSort && SelObj.eRowSort < tabLeftHead.rows.length-1)
			iNextRowHeight=$id("t").rows(i).style.pixelHeight;
			
		} else {
			var tmpArr = [arrCells[i-SelObj.sRowSort].tdsTag,arrCells[i-SelObj.sRowSort].tdscol];
		}
		arrCells[i-SelObj.sRowSort].tdeTag =tmpArr[0];
		arrCells[i-SelObj.sRowSort].tdecol =tmpArr[1];
		//if(tmpArr[0] != 1) blnBool=true;
		
	}
	//恢复
	$id("t").style.left=0;
	$id("t").style.top=0;
	txtEdit.style.display="";
	
						var   d = new Date();
						var   t1 = d.getTime()  ;
							//alert(t1-t)  
	
					
	var l = arrCells.length;
	var icells=0;
	for (var i=0;i<l;i++)
	{
		var istart=arrCells[i].tdscol;
		if(arrCells[i].tdsTag==2) istart++;
		var iend=arrCells[i].tdecol;
		if(arrCells[i].tdeTag==3) iend--;
		
		var oStartTd = $id("t").rows(arrCells[i].row).cells(istart) ;
		if(oStartTd == null) continue;
		var istartColNo = TDToCol(oStartTd);	//每行的开始的物理列号	
		
		//如列方向上伸出了界
		if(blnBool == false && iend >= 0 && istart < $id("t").rows(arrCells[i].row).cells.length ){
			var oEndTd = $id("t").rows(arrCells[i].row).cells(iend) ;
			if( istartColNo < SelObj.sColSort || TDToCol(oEndTd) > SelObj.eColSort - oEndTd.colSpan + 1 ) {
				blnBool = true ;
			}
		}
		for(var j=istart;j<=iend;j++){
			arrCell[icells]=new Object();
			arrCell[icells].tdrow = arrCells[i].row;
			arrCell[icells].tdcol = j;
			arrCell[icells].oTD = $id("t").rows(arrCell[icells].tdrow).cells(arrCell[icells].tdcol) ;
			arrCell[icells].col = istartColNo;  //物理列号,从0开始
			istartColNo += arrCell[icells].oTD.colSpan ;
			icells++;
		}
		
	}
	//计算状态
	if(SelObj.status==0){
		if(blnBool){
			SelObj.status = 4; 
		}else{
			SelObj.status = 3; //能合并
		}
	}
	SelObj.cellpos = arrCells ;
	SelObj.cells = arrCell;
	SelObj.cellsed = true ;
	//恢复滚动值,因有时当前滚动会变动
	
	//if( divMainScrollLeftBak != divMain.scrollLeft)
	//	divMain.scrollLeft = divMainScrollLeftBak;
	//if( divMainScrollTopBak != divMain.scrollTop)
	//	divMain.scrollTop = divMainScrollTopBak;

	divMain_onScroll();
}
//由td求左上角的物理列号
function TDToCol(oTD) {
    //alert(tabTopHead.rows(0).cells(0).offsetLeft + "=" + $id("t").rows(0).cells(0).offsetLeft);
    var baseValue = $id("t").rows(0).cells(0).offsetLeft; //此值正常时应为 1 ,但重新装入带合并格的报表后会变成0  2013-04-09
	var iLeft = oTD.offsetLeft ;
	var istart = oTD.cellIndex;
	var l= tabTopHead.rows(0).cells.length;
	for (var i = istart; i < l; i++) {
	    var iLeft2 = tabTopHead.rows(0).cells(i).offsetLeft;
	    //		if(iLeft >= iLeft2 -1 && iLeft <= iLeft2 + 1){
	    if (iLeft == iLeft2+baseValue-1) { //|| iLeft == iLeft2 - 1
	        return i;
		}
	}
	
}
/**
* 由当前TD刷新编辑框上的值
*@date 2006-09-20
**/
function RefreshCurTdValue(){
	if(SelObj.curTD.oTD != null ){
		txtEdit.value = SelObj.curTD.oTD.innerText;
		txtFx.value = txtEdit.value;
	}

}
