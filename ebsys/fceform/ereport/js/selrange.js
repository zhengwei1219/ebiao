var blnMouseDown=false	//�ڱ����mousedownʱ�˱���Ϊ��
//���ڵ��Ƶ��߽���ʱ�������,�Զ�����.
var blnCapture=false
var iTimeID=0
var iTimeID1=0
var iTimeID2=0
var iTimeID3=0
var tdEndSel //
//---------------------
//ѡ��ʱ,��¼��ֹ��Ԫ������
var	sTop,sLeft,sWidth,sHeight,eTop,eLeft,eWidth,eHeight
//��¼ѡ��ʱ����ֹ��Ԫ�������λ��
var sRow,sCol,eRow,eCol	
//�ź�����λ��
var sRowSort,sColSort,eRowSort,eColSort
//��ǰtd
var pubCurTd=null;
var iTimeID=0;
//��ǰѡ�е�TD����
var selCells=[] ;
//ƫ����
var pubOffsetX = 2,pubOffsetY = 2,pubOffset=3 ;
//��ǰѡ��Ķ���
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
	cells : [] , //ÿ��Ԫ�ص�ֵΪһ��oCell����{row,col,tdrow,tdcol,oTD}
	curTD	: new oCell(), //Ҳ��һ��oCell����
	oldTD	: null , //��һ��TD����
	/*
 * ѡ��״̬��
	0 δѡ��,�򲻶�
 	1 ѡ�е�����Ԫ��
 	2 ѡ�е����ϲ���Ԫ��
 	3 �϶�ѡ��һ��С��Ԫ��
 	4 �϶�ѡ��һ���ϵ�Ԫ�񣨲��ܺϲ���
 * ѡ�з�ʽ��
	0 δѡ��
 	1 ���ѡ�е�����Ԫ��
 	2 �϶�ѡ��һ�鵥Ԫ��
 	3 ��shift��ѡ��һ�鵥Ԫ��
 	4 ѡ����
 	5 ѡ����
 	6 ȫѡ
 	7 ����ѡ�е�Ԫ��	
	*/
	status		: 0, //ѡ��״̬
	howselect	: 0,  //ѡ�з�ʽ
	selrowcol	: 0,  //=1��ʾѡ�����л�����,=0��ʾѡ��һ��������Ԫ��
	moveTD	: [0,0], //����ƶ������е���һ��TD
	cellsed	: false, //Ϊ���ʾ�Ѽ������ǰѡ�е�cells
	sPasteFormat : "", //��ʽˢʱ�����cssText��
	
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
*���MOUSEDOWN�¼�����,����ѡ������
**/
function t_onmousedown() {

	var obj=event.srcElement 
	if (event.button ==2)
		return;

	if (obj.tagName!="TD" ) //|| obj.parentNode.rowIndex==0 || obj.cellIndex==0
		return;
	
	SelObj.selrowcol = 0 ; //�ָ�

	//shift+���,��ʾѡ��
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
		
		SelObj.sLeft=obj.offsetLeft //��ʼλ��
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

	//��ѡ��һ���ϲ���Ԫʱ
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
*���MOUSEMOVE�¼�����,����ѡ������
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
	//������Ƴ��༭��
	if(eventx < divMain.style.pixelLeft - fcpub.divMainOffset || eventx > divMain.style.pixelLeft + divMain.clientWidth + fcpub.divMainOffset
		|| eventy < divAll.style.pixelTop + divMain.style.pixelTop - fcpub.divMainOffset || eventy > divAll.style.pixelTop + divMain.style.pixelTop + divMain.clientHeight + fcpub.divMainOffset ){
		t_onmouseup();
		return;
	}
	
	
	if ( blnMouseDown==true){
		//����ڱ߽������
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
*���MOUSEUP�¼�����,����ѡ������
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
	//���ǵ�������
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
*�����ɫ��ѡ�п�	
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
	
//��������е���ɫ		
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
*��ʾ��ɫ��ѡ�п�
*@param sTag = "selrowcol"
**/
function showBlueScale(sTag){
	visibleBlue();
	SelObj.cellsed = false ;
	
	ShowTitleColor(true);
	
	showBlueRect(sTag);

	//

	/**
	*����sLeft sTop sWidth sHeight eLeft eTop eWidth eHeight��˸�ȫ�ֱ�����ֵ���������λ��
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
	* ��ѡ�п�
	*@date 2006-04-20
	**/
	function DrawScale(iLeft,iTop,iWidth,iHeight) {
		var lineWidth = 2 ;
		var left1 = iLeft - lineWidth;
		var top1 = iTop - lineWidth;
		var width1 = iWidth + 2 * lineWidth ;
		var height1 = iHeight + 2 * lineWidth ;
		
		if(isNaN(left1) || isNaN(top1) || isNaN(width1) || isNaN(height1)) return ;
		//�����  
		tLine[0].style.left = left1 ;
		tLine[0].style.top = top1 ;
		tLine[0].style.width = lineWidth ;
		tLine[0].style.height = height1 ;
		//�ϱ���
		tLine[1].style.left = left1 ;
		tLine[1].style.top = top1 ;
		tLine[1].style.width = width1 ;
		tLine[1].style.height = lineWidth ;
		var left2 = iLeft + iWidth;
		var top2 = iTop + iHeight;
		//�ұ���
		tLine[2].style.left = left2 ;
		tLine[2].style.top = top1 ;
		tLine[2].style.width = lineWidth ;
		tLine[2].style.height = height1 ;
		//�±���
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
*ѡ��ĳ������ĳ��ú���
*@para sTag="adjust",sTag="selrow/selcol"
**/
function selectRange(sTag,sRow1,sCol1,eRow1,eCol1){
	

	
	if(sTag == "adjust"){
		SelObj.selrowcol=0; //������ָ�Ĭ��ֵ
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

	
	if(sTag == "selrow"){ //��ѡ������ʱ���ÿ��Ǻϲ���Ԫ��
		SelObj.curLeft=0;
		SelObj.curTop = tabLeftHead.rows(SelObj.sRowSort).cells(0).offsetTop;
		SelObj.curWidth = $id("t").offsetWidth;
		SelObj.curHeight = tabLeftHead.rows(SelObj.sRowSort).cells(0).offsetHeight;
		showBlueScale("selrowcol");
	}else if(sTag == "selcol"){ //��ѡ������ʱ���ÿ��Ǻϲ���Ԫ��
		SelObj.curLeft=tabTopHead.rows(0).cells(SelObj.sColSort).offsetLeft;
		SelObj.curTop = 0 ;
		SelObj.curWidth =tabTopHead.rows(0).cells(SelObj.sColSort).offsetWidth;
		SelObj.curHeight =  $id("t").offsetHeight;
		showBlueScale("selrowcol");

//	}else if(SelObj.selrowcol == 1 && sTag == "adjust"){ //��ʾѡ�����к��ٵ���.
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
*ѡ������ĳ����
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
* ��ѡ�񵽺ϲ���Ԫ��ʱҪ����sRow��,�������ʱ��
*@date 2006-05-15
**/
function selectRangeBig() {
	var td1=findLogTd(SelObj.sRowSort,SelObj.sColSort);
	if(td1 == null ) return;
	if(td1.colSpan >1 || td1.rowSpan >1 ){
		
		//����
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
*��Ԫ����
**/
function Split() {
	if(SelObj.status != 2) {
		alert("ֻ��ѡ���˵����ϲ���Ԫ��ʱ����ִ�е�Ԫ���ֲ���!");
		return;
	}

	var arrCol = new Array();
	for(var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++){
		arrCol[i-SelObj.sRowSort]=PhyToLogCol(i,SelObj.sColSort);
	}

	var rCount=SelObj.eRowSort-SelObj.sRowSort+1 //�ϲ�������
	var cCount=SelObj.eColSort-SelObj.sColSort+1 //�ϲ�������
	//���ӵ�һ��֮������е�Ԫ��	
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
	//���ӵ�һ�еĵ�һ����Ԫ��֮��ĵ�Ԫ��
	var tdsCol=arrCol[0][1]; //PhyToLogCol(sRowSort,sColSort)
	var tdeCol=SelObj.eColSort-SelObj.sColSort+tdsCol;
	for (var j=tdsCol+1;j<=tdeCol;j++){
		if(tdsCol+1<$id("t").rows(SelObj.sRowSort).cells.length)
			$id("t").rows(SelObj.sRowSort).insertCell(tdsCol+1);
		else
			$id("t").rows(SelObj.sRowSort).insertCell();
	}
	//����һ��Ԫ���rowSpan colSpan
	$id("t").rows(SelObj.sRowSort).cells(tdsCol).rowSpan=1;
	$id("t").rows(SelObj.sRowSort).cells(tdsCol).colSpan=1;

	$id("t").rows(SelObj.sRowSort).cells(tdsCol).removeAttribute("e_merge");
	
	//CopytHtml()
	//grid.moveedit()
	selectRange();
	blnChange=true
}
/**
*sRow sCol eRow eCol ��Ԫ��ϲ�	
**/
function Merge() {
	//divShowMsg.style.display="";
	//alert();
	
	
	if(IsSmallRCValue()) return;
	getSelCells();
	var l=SelObj.cells.length;
	if(l<=0) return
	if(SelObj.status != 3 ) {
		alert("ֻ��ѡ����һ��δ�ϲ��ĵ�Ԫ��ʱ����ִ�е�Ԫ��ϲ�����!");
		return;
	}
	
	
	//���з���������˽�
	var bMultiRow = SelObj.eRowSort > SelObj.sRowSort ;
	for(var i=SelObj.sColSort;i<=SelObj.eColSort;i++){
		var oTd = findLogTd(SelObj.sRowSort,i) ;
		if(oTd.parentNode.rowIndex < SelObj.sRowSort) {
			alert("ֻ��ѡ����һ��δ�ϲ��ĵ�Ԫ��ʱ����ִ�е�Ԫ��ϲ�����!");
			return;
		}
		if(bMultiRow){
			oTd = findLogTd(SelObj.eRowSort,i) ;
		}
		if(oTd.parentNode.rowIndex + oTd.rowSpan - 1 > SelObj.eRowSort) {
			alert("ֻ��ѡ����һ��δ�ϲ��ĵ�Ԫ��ʱ����ִ�е�Ԫ��ϲ�����!");
			return;
		}

	}
/*
		for(var i=SelObj.sColSort;i<=SelObj.eColSort;i++){
			var oTd = findLogTd(SelObj.eRowSort,i) ;
			if(oTd.parentNode.rowIndex + oTd.rowSpan - 1 > SelObj.eRowSort) {
				alert("ֻ��ѡ����һ��δ�ϲ��ĵ�Ԫ��ʱ����ִ�е�Ԫ��ϲ�����!");
				return;
			}
		}
*/
	for(var i=l-1;i>0;i--){
	    
		$id("t").rows(SelObj.cells[i].tdrow).deleteCell(SelObj.cells[i].tdcol);
	}
	$id("t").rows(SelObj.cells[0].tdrow).cells(SelObj.cells[0].tdcol).colSpan = SelObj.eColSort-SelObj.sColSort+1;
	$id("t").rows(SelObj.cells[0].tdrow).cells(SelObj.cells[0].tdcol).rowSpan = SelObj.eRowSort-SelObj.sRowSort+1;
	
	//���ϼ���e_merge����
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
��ͬһ��������col��ǰ���ж��ٸ�TD���ϲ���.Ȼ�󷵻�col��ȥ�������.
���ںϲ��Ͳ��ʱ�ҵ�ɾ��TD�Ͳ���TD��λ��
return: 
1������TD�����ص�ǰtd�к�
2����Ԫ���ѱ����кϲ�������ǰTD���ڿ�ʼ��������ǰһ��TD�к�
3����Ԫ���ѱ����кϲ�������ǰTD�ڿ�ʼ��������0,��ʾ��ǰλ�ü����е�ǰ��û��һ��td
**/
function PhyToLogCol(row,col,iNextRowHeight) {
	
	var arr = getLogTd(row,col,iNextRowHeight);
	if(arr[0] == row ){
		return [1,arr[1]] ;
	}else {
		if(col>0){
			var arrLeft = PhyToLogCol(row,col-1,-1); //-1��ʾ��Ҫ��ȫ�ֱ�������¼�˴β���
			if(arrLeft[0]==1)
				return [2,arrLeft[1]]; //����ǰһ��TD�к�
			else
				return arrLeft ;
		}else{
			return [3,0] ; //��ʾ��ǰλ�ü����е�ǰ��û��һ��td
		}
	}
	//return PhyToLogTmp(row,col,3)

}
function CopytHtml(sTag) {
	return;

}
/**
* ����������еõ�TD�����С�
**/
function getLogTd(row,col,iNextRowHeight) {
	var oTd = findLogTd(row,col,iNextRowHeight);
	if(oTd == null) return [0,0];
	return [oTd.parentNode.rowIndex,oTd.cellIndex];
}
	//�������ҵ�x,y
function getLocation(row,col){
	//�������ҵ�x,y
	var posX=posY=0;
	if(typeof(row) == "undefined" || typeof(col) == "undefined") return [1,1]; 	//��ֵΪ1
	if(isNaN(col)) return [0,0];
	try{
	    posX = tabTopHead.rows(0).cells(col).offsetLeft;
	    posY = tabLeftHead.rows(row).cells(0).offsetTop;
	}catch(e){ //�����������ΪԪ�ؿ�����δ��λ,���첽����
	    if(col == 0 && row == 0 ){
	        posX = 1 ;  //��ֵΪ1
	        posY = 1 ;
	    }
        	
	}
	return [posX,posY];
}

//ȡrow,col����TD,���޻��쳣�򷵻�null,iNextRowHeight=��һ�е��и�,���ڿ��ټ���
function findLogTd(row,col,iNextRowHeight) {
    //if(row == 0 && col == 0) return $id("t").rows(0).cells(0);
    
	var oRet=null;
    if(typeof iNextRowHeight == "undefined" || iNextRowHeight < 0 )
    {	
	    var arr = getLocation(row,col);
	    var tdposx =arr[0];
	    var tdposy = arr[1];
	    var posX=arr[0]+pubOffsetX;
	    var posY=arr[1]+pubOffsetY;  //�ϲ��һ���߿�,����+1
	    /*var nextWidth = nextHeight = prevWidth = prevHeight = 0;
    	
	    if(bFast){ //��ҳʽ����.����Ҫ��һ�ο��ٹ���ʱ
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
	    var iOffsetLeft = 0; //����Ҫ�ƶ���ֵ,��Ϊ0���ʾֱ���ܿ���
	    var iOffsetTop =0;
	    if(tdposx-divMain.scrollLeft >= divMain.clientWidth )
		    iOffsetLeft = tdposx-divMain.clientWidth-divMain.scrollLeft ;
	    else if (tdposx-divMain.scrollLeft <= 0 ) 
		    iOffsetLeft = tdposx-divMain.scrollLeft; //Ϊ����
    	
	    if(tdposy-divMain.scrollTop >= divMain.clientHeight) 
		    iOffsetTop = tdposy-divMain.clientHeight-divMain.scrollTop;
	    else if(posY-divMain.scrollTop <= 0 )	
		    iOffsetTop = tdposy - divMain.scrollTop;

    	
	    var t_left=0,t_top=0,pointX=0,pointY=0;		
	    //divMain.scrollLeft = iOffsetLeft;	 
	    //divMain.scrollTop = iOffsetTop ;
	    //��Ϊ
	    //$id("t").style.position = "absolute";
	    pointX = -iOffsetLeft+tdposx+pubOffsetX ;
	    if(iOffsetLeft > 0) {
		    t_left = (iOffsetLeft+2*pubOffsetX)*(-1) ;
		    pointX = -iOffsetLeft+tdposx-pubOffsetX ; //���ұ߽�2px
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
    if(iNextRowHeight != -1){ //-1�����ڰ�colȥ��.
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
		if(obj.tagName == "TH"){ //�ڿ�����ʱ,+2px����
//			obj = document.elementFromPoint(divTopHead.style.pixelLeft-divTopHead.scrollLeft+posX+2,divLeftHead.style.pixelTop-divLeftHead.scrollTop+posY+2) ;
			var obj = document.elementFromPoint(pointX+2,pointY+2) ;
			if(obj != null){
				if(obj.tagName == "TD"){
					oRet = obj;
				}		
			}
		}
		
	}

	if(iNextRowHeight == -1 || typeof iNextRowHeight == "undefined"){ // -2 ��ʾ��ʼ������ (���������)
		$id("t").style.left = 0;
		$id("t").style.top = 0;	
		txtEdit.style.display="";
	}

	return oRet;
}
//ȡ�õ�ǰѡ���cells
function getSelCells(){
	if(SelObj.cellsed) return;
	//���ݹ���ֵ
	//var divMainScrollLeftBak = divMain.scrollLeft;
	//var divMainScrollTopBak = divMain.scrollTop;
	
	var blnBool = false;
	var arrCells=[]; //[row,tdsTag,tdscol,tdeTag,tdecol]
	var arrCell =[]; //[tdrow,tdcol,oTD];
			   			var   d = new Date();
						var   t = d.getTime();


	var bMultiCol = SelObj.eColSort>SelObj.sColSort;
	var iNextRowHeight = -2 ; 
	//���㿪ʼ��
	for (var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++)
	{
		arrCells[i-SelObj.sRowSort]=new Object();
		arrCells[i-SelObj.sRowSort].row = i ;
		//�����ʱû����һ���и�.
		//if(i == tabLeftHead.rows.length-1) iNextRowHeight = -2 ;
		var tmpArr = PhyToLogCol(i,SelObj.sColSort,iNextRowHeight);
		arrCells[i-SelObj.sRowSort].tdsTag =tmpArr[0];
		arrCells[i-SelObj.sRowSort].tdscol =tmpArr[1];
		//if(tmpArr[0] != 1) blnBool=true;
		//if(i<SelObj.eRowSort  )
		iNextRowHeight=$id("t").rows(i).style.pixelHeight; //��ס�ɵ��е��и�,����һ��ֻ��Ҫ�������������и߾��ܿɼ���.
	}	
	//���������
	var iNextRowHeight = -2;
	for (var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++)
	{
		if(bMultiCol){
			//�����ʱû����һ���и�.
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
	//�ָ�
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
		var istartColNo = TDToCol(oStartTd);	//ÿ�еĿ�ʼ�������к�	
		
		//���з���������˽�
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
			arrCell[icells].col = istartColNo;  //�����к�,��0��ʼ
			istartColNo += arrCell[icells].oTD.colSpan ;
			icells++;
		}
		
	}
	//����״̬
	if(SelObj.status==0){
		if(blnBool){
			SelObj.status = 4; 
		}else{
			SelObj.status = 3; //�ܺϲ�
		}
	}
	SelObj.cellpos = arrCells ;
	SelObj.cells = arrCell;
	SelObj.cellsed = true ;
	//�ָ�����ֵ,����ʱ��ǰ������䶯
	
	//if( divMainScrollLeftBak != divMain.scrollLeft)
	//	divMain.scrollLeft = divMainScrollLeftBak;
	//if( divMainScrollTopBak != divMain.scrollTop)
	//	divMain.scrollTop = divMainScrollTopBak;

	divMain_onScroll();
}
//��td�����Ͻǵ������к�
function TDToCol(oTD) {
    //alert(tabTopHead.rows(0).cells(0).offsetLeft + "=" + $id("t").rows(0).cells(0).offsetLeft);
    var baseValue = $id("t").rows(0).cells(0).offsetLeft; //��ֵ����ʱӦΪ 1 ,������װ����ϲ���ı�������0  2013-04-09
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
* �ɵ�ǰTDˢ�±༭���ϵ�ֵ
*@date 2006-09-20
**/
function RefreshCurTdValue(){
	if(SelObj.curTD.oTD != null ){
		txtEdit.value = SelObj.curTD.oTD.innerText;
		txtFx.value = txtEdit.value;
	}

}
