//������༭��JS��
//���ߣ�÷�£�
//���ڣ�2006-04-11


//��������ϲ��ƫ��ֵ,��onresize�����м���
var mbCell=false;
/*! IE6�Ĺ����״Ϊcol-resize,row-resize.IE5��Ϊmove  */
var cursorcolresize="col-resize";
var cursorrowresize="row-resize";


var iUpLeft=0;
var iUpTop=0;
var blnAdjust=false;
var blnAdjustH=false;
var AdjustRow=0,AdjustCol=0;
var lngFixRows=1; //�̶�����
var lngFixCols=1; //�̶�����
var blnFixRowDrap=true; //Ϊ���ʾ�̶��������϶�������ѡ��
//���뱨��ģ��ģʽ:ֻ���ڵ�һ���϶�,���в�ѯ����ģʽ:�ڹ̶����Ͽ����϶�
/*
function LeftToCol(lngLeft,tgrid) {
	//��offsetLeft������

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
//isCol=="��"��ʾ�����п�
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
	if(isCol == "��") {
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
	//������Ϊ�˷�ֹ�����ױ��У����ӱ�ĵ�ǰ�С�
	//if(curCol>=tgrid.childNodes(0).childNodes.length)	curCol=tgrid.childNodes(0).childNodes.length-1;
		
	if(isCol == "��"){
		//�����п�
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
		//�����и�
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
	if(isCol == "��") {
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

	if (blnAdjust==true && isCol == "��"){
		line.style.left =eventx100 ;
	} else if(blnAdjustH==true){
		lineH.style.top =eventy100 ; 
	}
	else {//���������״
		//�˶���Ϊ�˷�ֹ�ڱ���м�Ҳ�ܳ����޸ı���п���иߵ���
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
		//�ı��п�  

		if(isCol == "��"){
			//���Ըı��п�
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
			//�ı��и�
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
	if(isCol == "��") {
		tgrid = $id("tabTopHead");
		div1 = $id("divTopHead");
	}
	var bHideCol = false;
	if(isCol == "��"){
	//�����п�
	if (line.style.display!="none" ){

		var lngRange = line.style.pixelLeft - parseInt(sWidth1);
		var oldWidth = tgrid.children[0].children[AdjustCol].style.pixelWidth ; 
		var afterWidth = oldWidth + lngRange;
		if(afterWidth<=0){
			tgrid.children[0].children[AdjustCol].style.width=0; //�����е��п�Ϊ1
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
		//ͬ���и�
		if(bHideCol || lngRange < 0) {
		    var arrHeight=new Array();
			var ret = false,i,arrI=0;
			var rows = $id("t").rows.length;
			for(i=0;i<rows;i++){
			    //if(bHideCol || lngRange < 0){
				    if($id("t").rows(i).style.pixelHeight < $id("t").rows(i).offsetHeight){
					    if(ret == false){
						    ret = window.confirm("�˴ε�С�п��ʹ�и߱�󣬰� [ȷ��] ���С�п�!");
						    if (ret == false) {
							    //����С�п�,�ָ�ԭ�����п�
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
	//�и�
	if (lineH.style.display!="none" && sWidth1!=0 ){
		var lngRange=parseInt(lineH.style.top) - parseInt(sWidth1);
		var afterWidth=tgrid.rows(AdjustRow).style.pixelHeight+ lngRange;
		if(afterWidth<0){
			//�϶�����ʱ
			afterWidth=0; //�����е��п�Ϊ1
		}
		$id("t").rows(AdjustRow).style.height=afterWidth;
		//var tmpRow = AdjustRow ;
		//if(div1.scrollTop>0) tmpRow ++;  //��֪��Ϊʲô������Ҫ=1�Ŷԡ�
		//
		//tgrid.rows(tmpRow).style.height=afterWidth; //��ֹ���кϲ������ݹ���ʱ�޷���С�и�
		sWidth1=0;
		tgrid.style.cursor="default";
		lineH.style.display ="none";
		div1.releaseCapture ();
		blnAdjustH=false;
		//����С�и�ʱ,Ҫ����������ڵ��и��Ƿ�ͬ��,��ֹ���кϲ������ݹ���ʱ�޷���С�и�
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
	//��ֱ��
	line.style.left = line.style.pixelLeft + 2;
}
function lineH_onmousemove() {//ˮƽ��
	lineH.style.top = lineH.style.pixelTop + 2;

}
/**
*ȡ������ڿؼ���λ��
**/
function getdiv1top(div1){
	var div1top=getAbsTop(div1) ;
	
	//if(ParentPos == "���"){
	//	div1top= div1.style.pixelTop ; 
	//}
	return div1top ;

}
function getdiv1left(div1) {
	var div1left=getAbsLeft(div1) ;		
	
	//if(ParentPos == "���"){
	//	div1left = div1.style.pixelLeft ; 
	//}
	return div1left ;
}

/**
* �ƶ����뽹��
*@para iTag = 1 ��ʾֵҪ�䶯
*@date 2006-05-12
**/
function moveInputFocus(iTag) {
	if(iTag == 1){
		if(SelObj.oldTD != null ){
			var bChangeTmp = SelObj.oldTD.innerText != txtEdit.value ;
			if(bChangeTmp) SaveoUndoOneRecord();
			var oldMergeTdHeight = SelObj.oldTD.offsetHeight;
			SelObj.oldTD.innerText = txtEdit.value;
			//���TDΪ���еĺϲ���Ԫ��,
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
* copy����TD������
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
* ������ִ�ж�ѡ��������в���ǰ���á�׼��selCells[]ֵ�Ϳ��Ʋ��ܲ��������
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
* �����˵�Ԫ�������֮��,������������֮��,
*@date 2006-05-15
**/
function afterActCell() {
	styleCopy();
	//txtEdit.focus();


}
/**
* �ɵ�ǰtd��ֵˢ�±༭��
*@date 2006-12-22
**/
function TdToEdit() {
	if(SelObj.curTD.oTD != null ){
		txtEdit.value =SelObj.curTD.oTD.innerText;
		txtFx.value = txtEdit.value;
	}	
}
/**
* �߽�ʱ����
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
* �����Ƴ����뽹��
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
* �������뽹��
*@date 2006-05-17
**/
function setInputFocus() {
	var bool = false;
	//�ڱ༭����
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
		} //��ʱ�᲻�ɼ�,������
	}else{
		bool = true;
	}
	if(bool) divMain.focus();

}
/**
* ������ʹ��Ԫ��ɼ�
*@param obj Ϊ��ǰTD����
*@date 2006-05-17
**/
function scrollForVisibleCell(obj) {
	var offsetValue = 5 ; //�����������,�����findLogTd��ͻ.
	//TD���ұ߽�
	var ivalue = obj.offsetLeft + obj.offsetWidth -  divMain.clientWidth ;
	if( ivalue  > divMain.scrollLeft && obj.offsetWidth <  divMain.clientWidth){
		divMain.scrollLeft = ivalue+offsetValue ;
	}
	//TD����߽�
	if(obj.offsetLeft < divMain.scrollLeft){
		divMain.scrollLeft = obj.offsetLeft-offsetValue ;
	}
	//TD���±߽�
	var ivalue = obj.offsetTop + obj.offsetHeight -  divMain.clientHeight ;
	if( ivalue  > divMain.scrollTop && obj.offsetHeight <  divMain.clientHeight){
		divMain.scrollTop = ivalue+offsetValue ;
	}
	//TD���ϱ߽�
	if(obj.offsetTop < divMain.scrollTop){
		divMain.scrollTop = obj.offsetTop-offsetValue ;
	}

}
/**
* ����ǰҪ������
*@date 2006-05-19
**/
function beforeKeyPress() {
	ShowTitleColor(false);
}
function txtEdit_keyPress() {
	blnChange = true;
}
/**
*���빫ʽ��Ť�ĵ���¼�
**/
function cmdFormula(){
	var arr = [ $id("t"),txtFx.value];
	var sRet = DjOpen("eb_fx",arr,"չ��","��ģʽ����","ֱ��","���õ�Ԫ��Ĺ�ʽ");
	if(IsSpace(sRet) == false){
		sRet=new Eapi.Str().trim(sRet);
		if(sRet.substring(0,1) != "=") sRet = "="+sRet; //����=
		txtFx.value = sRet ;
		txtEdit.value = sRet ;
	}
}
/**
* ����������
*@date 2006-05-23
**/
function setRowProp() {
	if(SelObj.sColSort == 0 && SelObj.eColSort == tabTopHead.rows(0).cells.length-1 ){
		var arr = [ $id("t"),SelObj.sRowSort];
		var arrRet = DjOpen("eb_row",arr,"չ��","��ģʽ����","ֱ��","����������");
		if(IsSpace(arrRet)==false){
			tabLeftHead.rows(SelObj.sRowSort).cells(0).innerText = (SelObj.sRowSort+1) + GetRowLabel(SelObj.sRowSort) ;
			if(IsSpace(arrRet[1]) == false){
				tabLeftHead.rows(SelObj.sRowSort).style.height = arrRet[1];
				selOneRow(SelObj.sRowSort);
			}
		}
	}else{
		alert("��ѡ��һ�к�����.");
	}
	
}
/**
* ����������
*@date 2006-05-23
**/
function setColProp() {
	if(SelObj.sRowSort == 0 && SelObj.eRowSort == tabLeftHead.rows.length-1 ){
		var arr = [ $id("t"),SelObj.sColSort];
		var arrRet = DjOpen("eb_col",arr,"չ��","��ģʽ����","ֱ��","����������");
		if(IsSpace(arrRet)==false){
			tabTopHead.rows(0).cells(SelObj.sColSort).innerText =  IntToLbl(SelObj.sColSort+1)+GetColLabel(SelObj.sColSort);
			if(IsSpace(arrRet[1]) == false){
				tabTopHead.childNodes(0).childNodes(SelObj.sColSort).style.width = arrRet[1];
				selOneCol(SelObj.sColSort);
			}
		}
	}else{
		alert("��ѡ��һ�к�����.");
	}
	
}
/**
* ���ñ�������
*@date 2006-05-24
**/
function setReportProp() {
	var sRet = DjOpen("eb_report",$id("t"),"չ��","��ģʽ����","ֱ��","���ñ�������");
	
}
/**
* �����ô���
*@param djsn Ҫ�򿪵ı���djsn
*@param sTag ="cellstyle" ��ʾ���õ�Ԫ������
*@param sTitle ���ڱ���
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
	
	var sRet = DjOpen(djsn,arr,"չ��","��ģʽ����","ֱ��",sTitle);
	if(sTag == "cellstyle" && sRet == "ok"){
		//ͬ��ѡ���е��и�
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
* ��ʾ������Ϣ
*@date 2010-11-01
**/
function OpenWinShowInfo() {
    var arr = new Array();
    arr[0] = $id("t");
    DjOpen("eb_showinfo", arr, "չ��", "��ģʽ����", "ֱ��", "��ʾ������Ϣ");
}

/**
* ��chart�����Կ�
*@date 2006-09-06
**/
function OpenChartWin() {
	var oTD = SelObj.curTD.oTD ;
	var djsn = "eb_chart";
	if(fcpubdata.dotnetVersion == "") djsn="eb_chartjava";
	var sRet = DjOpen(djsn,oTD,"չ��","��ģʽ����","ֱ��","ͳ��ͼ");
	if(IsSpace(sRet)==false){
		txtEdit.value = sRet;
		txtFx.value = sRet;
		oTD.innerText = sRet;
	}
}
/**
* ��flashͳ��ͼ�����Կ�
*@date 2010-05-24
**/
function OpenFlashWin() {
    var oTD = SelObj.curTD.oTD;
    var djsn = "eb_flash";
    //if (fcpubdata.dotnetVersion == "") djsn = "eb_chartjava";
    var sRet = DjOpen(djsn, oTD, "չ��", "��ģʽ����", "ֱ��", "FLASHͳ��ͼ");
    if (IsSpace(sRet) == false) {
        txtEdit.value = sRet;
        txtFx.value = sRet;
        oTD.innerText = sRet;
    }
}
/**
* ������������Կ�
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
	var sRet = DjOpen(djsn,[sP,oTD],"չ��","��ģʽ����","ֱ��","���������Դ���");
	if(IsSpace(sRet)==false){
		sRet = fName+"("+sRet+")";
		txtEdit.value = sRet;
		txtFx.value = sRet;
		oTD.innerText = sRet;
	}
}
/**
* �½�������
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
		case "����ʽ": {
			//�ҵ���һ�����ݼ�չ��
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
		case "����ʽ": {
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
		case "����ʽ": {
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
				//�ϲ�
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
* ���б���
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
* ���뱨������������
*@date 2007-01-25
**/
function EbiaoFormDesign() {
	if(IsSpace($id("t").e_argsbak)) {
		alert("��û�ж��屨�����,���ȶ���ú�����!");
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
* ��ʾģ̬����������
*@date 2007-01-25
**/
function EbiaoShowModalParaWin(owin) {
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer) {
        alert("ֻ����IE�в��д˹��ܣ�");
        return;
    }

	var sFrame32 = '../common/djempty.htm?djcontent=yes';
	window.showModalDialog(sFrame32,owin,'status:no;resizable:yes;'+owin.sPubModalWin);
}
/**
* ��ɾ����ʱ�ƶ���ʽ.
*@param row,col Ϊ-1ʱ��ʾ���䶯,rowDelta, colDeltaΪ0ʱҲ���䶯.��ΪҪ�䶯����Ŀ.
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
            //����������������
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
* �ж��Ƿ�Ϊ��Ԫ���ȡ������
	1 ����ĸ�����������ֵ������ڱ�������,����
	2 ��ǰһ���ַ����һ���ַ�Ϊ.������ 
	
**/
    function shiftFormula(formula, row, col, rowDelta, colDelta) { //row,colΪ��0��ʼ��
    // Rewrite a formula string that refer to cells >= {row, col} location by {rowDelta, colDelta} amount. \$?
		return formula.replace(/([a-zA-Z]+)([0-9]+)/g, 
        function(sRW, colStr, rowStr,startPos,source) {
			//alert(sRW); //ƥ���������,��f1
			//alert(startPos);		//ƥ�䴮�Ŀ�ʼλ��
			//alert(source);		//�����ַ���
			if(DeepCheck(sRW, colStr, rowStr,startPos,source) == false) return sRW;
            if (col >= 0 && colDelta != 0 ) {
                var x = LblToInt(colStr.toUpperCase());
                if (x > col && x <= tabTopHead.rows(0).cells.length )
                    colStr = IntToLbl(x + colDelta);
            }
            if (row >= 0 && rowDelta != 0 ) {
                var y = parseInt(rowStr); //��ʽ�е�д���Ǵ�1��ʼ��,���Ǵ�0��ʼ��
                if (y > row && y <= tabLeftHead.rows.length )
                    rowStr = String(y + rowDelta);
            }
            return colStr + rowStr;
        });
        /**
        * ���� true ��ʾ�ǺϷ���A1�ȵ�Ԫ���ʾ��.
        **/
        function DeepCheck(sRW, colStr, rowStr,startPos,source) {
            if(startPos>0){
				var sBeforeOne = source.substring(startPos-1,startPos);
				//ǰһ���ַ�ֻ��Ϊ:(+- */=[{|&!:><,%$
				var sTag = "(+- */=[{|&!:><,%$";
				if(sTag.indexOf(sBeforeOne) < 0 ) return false; 
			}
			
			var endPos = startPos + sRW.length;
			if(endPos<source.length-1){ 
				var sAfterOne = source.substring(endPos,endPos+1);
				//��һ���ַ�ֻ��Ϊ:)+- */=]}|&:><,%{[
				var sTag = ")+- */=]}|&:><,%{[";
				if(sTag.indexOf(sAfterOne) < 0 ) return false; 

            }
            // .sum(fname ��ʽ���ж�.
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
* �ɿ��еĺϲ���Ԫ�񷴵��и�
*@date 2006-06-28
**/
function AlignRowHeight(mergeTd,oldMergeTdHeight) {
	//���TDΪ���еĺϲ���Ԫ��,
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
* ͬ��ѡ���е��и�
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
* ��һ������򿪵��ļ�
*@date 2007-05-22
**/
function AddRecentFile(sFile){
	var s = fcpub.recentFile;
	if(s.length>0){
		var pos = s.indexOf(",") ; //��,�ָ��ı�����
		if(pos < 0){
			s = s + ","+sFile;			
		}else{
			var s1 = s.substring(pos+1,s.length);
			if(sFile != s1){ //���������ļ�һ��
				s = s1 + "," +sFile;
			}
		}
	}else{
		s = sFile;
	}
	fcpub.recentFile = s ;
	
}
/**
* �� fcpub.recentFile ˢ�½���
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
* ѡ�з�Χ���Ƿ����и߻��п�̫С
*@return true/false
*@date 2007-06-22
**/
function IsSmallRCValue() {
	var minV=2;
	for(var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++){
		if(tabLeftHead.rows(i).style.pixelHeight<minV){
			alert("��ѡ�е������ڵ�"+(i+1)+"�и�С��"+minV+",���²��ܽ��д˲���,����Խ������иߵ��ߺ��ٽ��д˲���.");
			return true;
		}
	}
	/*
	for(var i=SelObj.sColSort;i<=SelObj.eColSort;i++){
		if(tabTopHead.childNodes(0).childNodes(i).style.pixelWidth<minV){
			alert("��ѡ�е������ڵ�"+i+"�п�С��"+minV+",���²��ܽ��д˲���,����Խ������п������ٽ��д˲���.");
			return true;
		}
	}*/
	return false;
}
/**
 * ��θ���table���������Զ�����td,ʹtable��һ�������.
   1 ����һ������prevTds������ÿһ�м��ٵ�td��, �� rowSpan=3 colSpan=4 �� ��ǰ�м���3��td,�����м���4��td.
   2 Ȼ�����tr�е�ʵ��td����prevTds�еĲ�ֵ������td
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
            if(adds>0){  //����td
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

