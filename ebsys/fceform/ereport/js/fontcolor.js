
/**
*设置单元格的颜色,iTag=1则表示设置前景色,iDefault=0表示缺省
*@date 2001-05-09 
**/
function SetColor(colorValue,iTag,iDefault){
	if(beforeActRange()==false)return;
	SaveoUndoOneRecord();
	var len = SelObj.cells.length;
	for (var i=0;i<len;i++){
		var curTD=SelObj.cells[i].oTD;
		if(iTag==1){
			if(iDefault==0){
				curTD.style.color="" ; //"#000000"
			}
			else{
				curTD.style.color=colorValue;
			}
		}else {
			if(iDefault==0)
				curTD.style.backgroundColor="";
			else
				curTD.style.backgroundColor=colorValue;
		}
	}
	blnChange=true;
	//hideTxt();
	SaveoRedoOneRecord();
	afterActCell();
}
/**
*画线方法, iTag=0-11 sLineStyle="1px solid"
**/
function DrawLine(iTag,sWidth,sStyle,sColor){
	
	if (iTag<0) return;
	if(iTag == "1") iTag=1;
	if(beforeActRange()==false)return;
	//if (tc.style.display =="none")
	//	return
	var len = SelObj.cells.length;
	//var sLineStyleBak = sLineStyle+" black";
	var sLineStyle = sWidth + " " + sStyle + " " + sColor ;
	SaveoUndoOneRecord();
		switch (iTag){
		case 1:	//删网格线
			for (var i=0;i<len;i++){
				var curTD=SelObj.cells[i].oTD;
				if(curTD == null) continue;
				curTD.style.cssText=RemovePartStyle(curTD.style.cssText,"border-Bottom");
				curTD.style.cssText=RemovePartStyle(curTD.style.cssText,"border-Right");
				curTD.style.cssText=RemovePartStyle(curTD.style.cssText,"border-Top");
				curTD.style.cssText=RemovePartStyle(curTD.style.cssText,"border-Left");
			}
			funDrawHLine(SelObj.sRowSort,sLineStyle,"top",1);
			funDrawVLine(SelObj.sColSort,sLineStyle,"left",1);
			funDrawHLine(SelObj.eRowSort,sLineStyle,"bottom",1);
			funDrawVLine(SelObj.eColSort,sLineStyle,"right",1);
			break;
		case 2:	//网格线
			for (var i=0;i<len;i++){
				var curTD=SelObj.cells[i].oTD;
				if(curTD == null) continue;
				curTD.style.borderBottom = sLineStyle ;
				curTD.style.borderRight = sLineStyle ;
				curTD.style.borderTop = sLineStyle ;
				curTD.style.borderLeft = sLineStyle ;
			}
			funDrawHLine(SelObj.sRowSort,sLineStyle,"top");
			funDrawVLine(SelObj.sColSort,sLineStyle,"left");
			funDrawHLine(SelObj.eRowSort,sLineStyle,"bottom");
			funDrawVLine(SelObj.eColSort,sLineStyle,"right");
							
			break;
		case 3: //框线
			funDrawHLine(SelObj.sRowSort,sLineStyle,"top");
			funDrawHLine(SelObj.eRowSort,sLineStyle,"bottom");
			funDrawVLine(SelObj.sColSort,sLineStyle,"left");
			funDrawVLine(SelObj.eColSort,sLineStyle,"right");
			break;
		
		case 4:	//上
			funDrawHLine(SelObj.sRowSort,sLineStyle,"top");
			break;
		case 5:	//下线
			funDrawHLine(SelObj.eRowSort,sLineStyle,"bottom");
			break;
		case 6:	//左
			funDrawVLine(SelObj.sColSort,sLineStyle,"left");
			break;
		case 7:	//右
			funDrawVLine(SelObj.eColSort,sLineStyle,"right");
			break;

		}
	blnChange=true;
	SaveoRedoOneRecord();
	afterActCell();
}
/**
*画一条横线的函数，rowno是物理行号，linePx是线粗+实虚，strKey是指画那边线
*iDelLine=1表示删线
**/
function funDrawHLine(rowno,linePx,strKey,iDelLine){
	if(rowno<0) rowno=0; //暂时强加上。
	
	var sLinePos = "border-Top" ;
	var sLinePos1 = "border-Bottom" ;
	if(strKey == "bottom")	{
		sLinePos = "border-Bottom" ;
		sLinePos1 = "border-Top" ;
	}
	
	_getArrTds(rowno,linePx,sLinePos,iDelLine);

		
	if (strKey=="bottom" && rowno < tabLeftHead.rows.length-1){
		_getArrTds(rowno+1,linePx,sLinePos1,iDelLine);
	}
	if (strKey=="top" && rowno >0){
		_getArrTds(rowno-1,linePx,sLinePos1,iDelLine);
	}
	/*
	return;
	
	var i;
	for (i=SelObj.sColSort;i<=SelObj.eColSort;i++){
		var curTD=findLogTd(rowno,i);
		if (strKey=="bottom"){
			//画当前单元格
			if (iDelLine==1)
				curTD.style.cssText=RemovePartStyle(curTD.style.cssText,"border-Bottom");
			else
				curTD.style.borderBottom=linePx;		
			//画另一个单元格
			if(rowno < tabLeftHead.rows.length-1){
				var curTD1=findLogTd(rowno+1,i);
				if (iDelLine==1)
					curTD1.style.cssText=RemovePartStyle(curTD1.style.cssText,"border-Top");
				else
					curTD1.style.borderTop=linePx;
			}		
				
		}else{ //top
			if (iDelLine==1)
				curTD.style.cssText=RemovePartStyle(curTD.style.cssText,"border-Top");
			else
				curTD.style.borderTop=linePx;			
			//画另一个单元格
			if(rowno > 0){
				var curTD1=findLogTd(rowno-1,i);
				if (iDelLine==1)
					curTD1.style.cssText=RemovePartStyle(curTD1.style.cssText,"border-Bottom");
				else
					curTD1.style.borderBottom=linePx;
			}		
		}	
	}*/
	
	//取某行选中的cells
	function _getArrTds(rowno,linePx,sLinePos,iDelLine) {
		var arrS = PhyToLogCol(rowno,SelObj.sColSort);
		var iStartCol;
		if(arrS[0] == 1){
			iStartCol= arrS[1];
		}else if (arrS[0] == 2){
			iStartCol = arrS[1]+1 ;
			if(iStartCol >= $id("t").rows(rowno).cells.length) return null;
		}else{ 
			iStartCol = 0 ;
		}
		var arrE = PhyToLogCol(rowno,SelObj.eColSort);
		var iEndCol;
		if(arrE[0] == 1){
			iEndCol= arrE[1];
		}else if (arrE[0] == 2){
			iEndCol = arrE[1] ;
		}else {
			return null;
		}
		var cols=0;
		for(var i=iStartCol;i<=iEndCol;i++){
			var curTD= $id("t").rows(rowno).cells(i);
			cols += curTD.colSpan;
			//画当前单元格
			_DrawHLine(curTD,iDelLine,sLinePos,linePx);
		}
		//有跨行合并单元格时
		var actedCell=0; //已处理的单元格的列数
		var i=SelObj.sColSort;
		while(SelObj.eColSort-SelObj.sColSort+1 > cols+actedCell && i<=SelObj.eColSort){
			var curTD=findLogTd(rowno,i);
			if(curTD.parentNode.rowIndex+curTD.rowSpan -1 == rowno ){
				//画线
				_DrawHLine(curTD,iDelLine,sLinePos,linePx);
			}
			i++;
			actedCell += curTD.rowSpan ;
		}
		
		//画线子函数
		function _DrawHLine(curTD,iDelLine,sLinePos,linePx){
			if (iDelLine==1){
				curTD.style.cssText=RemovePartStyle(curTD.style.cssText,sLinePos);
			}else{
				if(sLinePos == "border-Bottom")
					curTD.style.borderBottom = linePx;		
				else
					curTD.style.borderTop = linePx;
			}
		}
		
	}

}
/**
*画一条竖线的函数，colno是物理列号，linePx是线粗+实虚，strKey是指画那边线
*iDelLine=1表示删线
**/
function funDrawVLine(colno,linePx,strKey,iDelLine){
	if(colno<0) colno=0; //暂时强加上。
	
	var sLinePos = "border-Left" ;
	var sLinePos1 = "border-Right" ;
	if(strKey == "right")	{
		sLinePos = "border-Right" ;
		sLinePos1 = "border-Left" ;
	}
	
	_getColCells(colno,linePx,sLinePos,iDelLine);

		
	if (strKey=="right" && colno < tabTopHead.rows(0).cells.length-1){
		_getColCells(colno+1,linePx,sLinePos1,iDelLine);
	}
	if (strKey=="left" && colno >0){
		_getColCells(colno-1,linePx,sLinePos1,iDelLine);
	}
	//恢复
	$id("t").style.left=0;
	$id("t").style.top=0;
	txtEdit.style.display="";
	
	/*
	return;	
	for (var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++){
		var curTD=findLogTd(i,colno);
		if (strKey=="right"){
			//画当前单元格
			if (iDelLine==1)
				curTD.style.cssText=RemovePartStyle(curTD.style.cssText,"border-Right");
			else
				curTD.style.borderRight=linePx;		
			//画另一个单元格
			
			if(colno < tabTopHead.rows(0).cells.length-1){
				var curTD1=findLogTd(i,colno+1);
				if (iDelLine==1)
					curTD1.style.cssText=RemovePartStyle(curTD1.style.cssText,"border-Left");
				else
					curTD1.style.borderLeft=linePx;
			}		
				
		}else{ //left
			if (iDelLine==1)
				curTD.style.cssText=RemovePartStyle(curTD.style.cssText,"border-Left");
			else
				curTD.style.borderLeft=linePx;			
			//画另一个单元格
			if(colno > 0){
				var curTD1=findLogTd(i,colno-1);
				if (iDelLine==1)
					curTD1.style.cssText=RemovePartStyle(curTD1.style.cssText,"border-Right");
				else
					curTD1.style.borderRight=linePx;
			}		
		}	
		
		
	}*/
	
		//取某列选中的cells
	function _getColCells(colno,linePx,sLinePos,iDelLine) {
		var iNextRowHeight = -2 ; 
		
		for (var i=SelObj.sRowSort;i<=SelObj.eRowSort;i++)
		{
			var curTD = findLogTd(i,colno,iNextRowHeight);
			if(curTD == null ) continue;
			//画当前单元格
			if (iDelLine==1){
				curTD.style.cssText=RemovePartStyle(curTD.style.cssText,sLinePos);
			}else{
				if(sLinePos == "border-Right")
					curTD.style.borderRight = linePx;		
				else
					curTD.style.borderLeft = linePx;
			}
			
			if(i<SelObj.eRowSort)
				iNextRowHeight=$id("t").rows(i+1).style.pixelHeight;
		}	
	
	}
}



/**
*设置当前单元的字体
*@param strKey :B,I,U,F,S
**/
function cmdFont(strKey)
{	
	if(beforeActRange()==false)return;
//	if (SetReadOnly()) return
	
	//if (tc.style.display =="none")
	//	return
//	var i,j
//	var sColno,eColno
	SaveoUndoOneRecord()
	
//	MatchRowCol()
//	getColnoPerRow()
//选中单个的单元格的情况
	var sB,sI,sU;
	switch (strKey){
	case "B":
		sB=cmdFontBold.getAttribute("fcDown")
		if (sB=="1") {
			cmdFontBold.setAttribute("fcDown","0")
		}
		else {
			cmdFontBold.setAttribute("fcDown","1")
		}
		break;
	case "I":
		sI=cmdFontItalic.getAttribute("fcDown")
		if (sI=="1") {
			cmdFontItalic.setAttribute("fcDown","0")
		}
		else {
			cmdFontItalic.setAttribute("fcDown","1")
		}
		break;
	case "U":				
		sU=cmdFontU.getAttribute("fcDown")
		if (sU=="1") {
			cmdFontU.setAttribute("fcDown","0")
		}
		else {
			cmdFontU.setAttribute("fcDown","1")
		}
		break;
	}			

	var i,j

	var len = SelObj.cells.length;
	for (var i=0;i<len;i++){
		var curTD=SelObj.cells[i].oTD;
			switch (strKey){
			case "B":
				if (sB=="1") {
					curTD.style.fontWeight="normal"
				}
				else {
					curTD.style.fontWeight="bold"
				}
				break;
			case "I":
				if (sI=="1") {
					curTD.style.fontStyle="normal"
				}
				else {
					curTD.style.fontStyle="italic"
				}
				break;
			case "U":				
				if (sU=="1") {
					curTD.style.textDecorationUnderline=false
				}
				else {
					curTD.style.textDecorationUnderline=true
				}
				break;
			case "F":
				curTD.style.fontFamily=cboFont.options[cboFont.selectedIndex].text
				break;
			case "S":
				var oldMergeTdHeight = curTD.offsetHeight;
				curTD.style.fontSize=cboFontSize.options[cboFontSize.selectedIndex].text
				//如旧TD为跨行的合并单元格,
				AlignRowHeight(curTD,oldMergeTdHeight);
				
				break;
			}			
	}
	blnChange=true
	//hideTxt()
	SaveoRedoOneRecord();
	afterActCell();
}
/**
*处理当前单元格的对齐
*@param strAlign:left,center,right,top,middle,bottom
*@param strOrient:h v
**/
function cmdAlign(strAlign,strOrient) 
{
	if(beforeActRange()==false)return;
	//if (tc.style.display =="none")
	//	return
	//判断按钮是按下还是恢复。
	var blnPressDown=true	
	if((strAlign=="left" && cmdLeft.getAttribute("fcDown")=="1") 
	 || (strAlign=="center" && cmdCenter.getAttribute("fcDown")=="1")
	 || (strAlign=="right" && cmdRight.getAttribute("fcDown")=="1")
	 || (strAlign=="top" && cmdTopv.getAttribute("fcDown")=="1")
	 || (strAlign=="middle" && cmdMiddle.getAttribute("fcDown")=="1")
	 || (strAlign=="bottom" && cmdBottomv.getAttribute("fcDown")=="1")
	)
		blnPressDown=false
//选中单个的单元格的情况
	SaveoUndoOneRecord()//在改变之前保存住位置，备undo时装入
	var i,j
	var len = SelObj.cells.length;
	for (var i=0;i<len;i++){
		var curTD=SelObj.cells[i].oTD;
			if (strOrient=="h") {
				if (strAlign=="left") {
					if (blnPressDown==false) {
						cmdLeft.setAttribute("fcDown","0")
						curTD.style.textAlign=""
					}
					else {
						cmdLeft.setAttribute("fcDown","1")
						cmdCenter.setAttribute("fcDown","0")
						cmdRight.setAttribute("fcDown","0")
						//cmdCenter.className="tbnormal"
						//cmdRight.className = "tbnormal"
						_set_button_class_name(cmdCenter);
						_set_button_class_name(cmdRight);
						curTD.style.textAlign="left"
					}
				}

				if (strAlign=="center") {
					if (blnPressDown==false) {
						cmdCenter.setAttribute("fcDown","0")
						curTD.style.textAlign=""
					}
					else {
						cmdLeft.setAttribute("fcDown","0")
						cmdCenter.setAttribute("fcDown","1")
						cmdRight.setAttribute("fcDown","0")
						//cmdLeft.className="tbnormal"
						//cmdRight.className="tbnormal"
						_set_button_class_name(cmdLeft);
						_set_button_class_name(cmdRight);
						curTD.style.textAlign="center"
					}
				}
				if (strAlign=="right") {
					if (blnPressDown==false) {
						cmdRight.setAttribute("fcDown","0")
						curTD.style.textAlign=""
					}
					else {
						cmdLeft.setAttribute("fcDown","0")
						cmdCenter.setAttribute("fcDown","0")
						cmdRight.setAttribute("fcDown","1")
						//cmdLeft.className="tbnormal"
						//cmdCenter.className = "tbnormal"
						_set_button_class_name(cmdLeft);
						_set_button_class_name(cmdCenter);
						curTD.style.textAlign="right"
						
					}

				}						
			}
			if (strOrient=="v") {
				if (strAlign=="top") {
					if (blnPressDown==false) {
						cmdTopv.setAttribute("fcDown","0")
						curTD.style.verticalAlign=""
					}
					else {
						cmdTopv.setAttribute("fcDown","1")
						cmdMiddle.setAttribute("fcDown","0")
						cmdBottomv.setAttribute("fcDown","0")
						//cmdMiddle.className="tbnormal"
						//cmdBottomv.className = "tbnormal"
						_set_button_class_name(cmdMiddle);
						_set_button_class_name(cmdBottomv);
						curTD.style.verticalAlign="top"
					}
				}
				if (strAlign=="middle") {
					if (blnPressDown==false) {
						cmdMiddle.setAttribute("fcDown","0")
						curTD.style.verticalAlign=""
					}
					else {
						cmdTopv.setAttribute("fcDown","0")
						cmdMiddle.setAttribute("fcDown","1")
						cmdBottomv.setAttribute("fcDown","0")
						//cmdTopv.className="tbnormal"
						//cmdBottomv.className = "tbnormal"
						_set_button_class_name(cmdTopv);
						_set_button_class_name(cmdBottomv);
						curTD.style.verticalAlign="middle"
					}
				}
				if (strAlign=="bottom") {
					if (blnPressDown==false) {
						cmdMiddle.setAttribute("fcDown","0")
						curTD.style.verticalAlign=""
					}
					else {
						cmdTopv.setAttribute("fcDown","0")
						cmdMiddle.setAttribute("fcDown","0")
						cmdBottomv.setAttribute("fcDown","1")
						//cmdTopv.className="tbnormal"
						//cmdMiddle.className = "tbnormal"
						_set_button_class_name(cmdTopv);
						_set_button_class_name(cmdMiddle);
						curTD.style.verticalAlign="bottom"
					}
				}
			}
	}
	blnChange=true
	//hideTxt()
	SaveoRedoOneRecord();	//在改变之后保存住位置，备redo时装入
	afterActCell();
	function _set_button_class_name(oButton, sClassName) {
	    if(typeof(sClassName) == "undefined") sClassName = "tbnormal";
	    oButton.className = sClassName + " " + oButton.classbak;
	}
}
/**
*当在某单元格时,处理工具栏的显示状态
**/
function showFontProperty(tdobj){

	_setTbButton(tdobj.style.textAlign=="left",cmdLeft);
	_setTbButton(tdobj.style.textAlign=="center",cmdCenter);
	_setTbButton(tdobj.style.textAlign=="right",cmdRight);
	_setTbButton(tdobj.style.verticalAlign=="top",cmdTopv);
	_setTbButton(tdobj.style.verticalAlign=="middle",cmdMiddle);
	_setTbButton(tdobj.style.verticalAlign=="bottom",cmdBottomv);


	_setTbButton(tdobj.style.fontWeight=="bold",cmdFontBold);
	_setTbButton(tdobj.style.fontStyle=="italic",cmdFontItalic);
	_setTbButton(tdobj.style.textDecorationUnderline==true,cmdFontU);
	

	//cboFont.value=tdobj.style.fontFamily ;
	if(IsSpace(tdobj.style.fontFamily)){
		cboFont.selectedIndex = 0 ;	
	}else{
		for(var i=cboFont.options.length-1;i>=0;i--){
			if(cboFont.options(i).text == tdobj.style.fontFamily){
				cboFont.selectedIndex = i;
				break;
			}
		}
	}
	var lngFontSize=parseInt(tdobj.style.fontSize)

	switch(lngFontSize)	{
	case 4:
		cboFontSize.selectedIndex =0
		break;	
	case 6:
		cboFontSize.selectedIndex =1
		break;	
	case 8:
		cboFontSize.selectedIndex =2
		break;
	case 9:	
	case 10:
	case 11:
	case 12:
	case 13:
	case 14:
	case 15:
	case 16:
	case 17:
		cboFontSize.selectedIndex =lngFontSize - 6
		break;	
	case 18:
		cboFontSize.selectedIndex =12
		break;	
	case 20:
		cboFontSize.selectedIndex =13
		break;	
	case 22:
		cboFontSize.selectedIndex =14
		break;	
	case 24:
		cboFontSize.selectedIndex =15
		break;
	case 26:
		cboFontSize.selectedIndex =16
		break;	
	case 28:
		cboFontSize.selectedIndex =17
		break;	
	case 36:
		cboFontSize.selectedIndex =18
		break;	
	case 48:
		cboFontSize.selectedIndex =19
		break;		
	case 72:
		cboFontSize.selectedIndex =20
		break;		
	default:
		cboFontSize.selectedIndex =7; //默认是13px
		break;			
	}

	
	//show(tdobj.bgColor)
	/*
	if(isSpace(tdobj.style.backgroundColor)){
		sel1.selectedIndex=0
	}
	else {
		for(var i=1;i<sel1.options.length;i++){
			if(sel1.options(i).style.backgroundColor==tdobj.style.backgroundColor){
				sel1.selectedIndex=i
				break
			}
		}
	}
	if(isSpace(tdobj.style.color)){
		sel2.selectedIndex=0
	}
	else {
		for(var i=1;i<sel2.options.length;i++){
			if(sel2.options(i).style.backgroundColor==tdobj.style.color){
				sel2.selectedIndex=i
				break
			}
		}
	}*/
	
	
	function _setTbButton(bCond,oButton){
		if (bCond) {
		    /*
			var s2 = "white 1px solid";
			var s3 = "#808080 1px solid";
			oButton.setAttribute("fcDown","1");
			oButton.style.borderTop = s3;
			oButton.style.borderLeft = s3;
			oButton.style.borderBottom = s2;
			oButton.style.borderRight = s2;
			oButton.style.backgroundColor = "gainsboro";*/
			oButton.className="tbdownout "+oButton.classbak;
		}else {
/*			var s1 = ""; //"#c0c0c0 1px solid";
		
			oButton.setAttribute("fcDown","0");
			oButton.style.border = s1;
			oButton.style.backgroundColor = "transparent";*/
		oButton.className = "tbnormal " + oButton.classbak;
			
			
		}
	}
}

/**
*除去一节Style属性
*strSource 为源Style属性串
*strFind 为要除去的Style属性名
*返回除去后的Style属性串
**/
function RemovePartStyle(strSource,strFind) {
	var strResult=""
	var arrS
	arrS=strSource.split(";")
	for (var i=0;i<arrS.length;i++) {
		var sUpper=arrS[i].toUpperCase()
		if (sUpper.indexOf(strFind.toUpperCase())==-1)
			strResult=strResult+arrS[i]+";"
	}
	return strResult
}