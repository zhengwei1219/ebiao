//界面元素事件的JS
function window_onload() {
		var d=new Date()
	var t2=d.getTime()
	_initDivPos();
	window_onresize();
    var arr = window.dialogArguments ;
    if(IsSpace(arr)==false){
        var oTable = arr[7]; 
    }
    if(IsSpace(oTable)){ 
	    var sfile = Request.QueryString("name").toString();
	    if(IsSpace(sfile)){
		    NewReport();
	    }else{
    		//下面加 unescape ,以免汉字文件名。 2013-03-23
		    var sRet = unescape(sfile) ;
		    if(fcpub.fromdb != "yes") 	sRet +=	".htm";
		    OpenReport(sRet);
	    }
	    fcpub.recentFile = LoadRepData("recentFile");
	    RefreshRecentFile();
        
    }else{    //从eform 中调用时
        if(oTable.html==""){
		    NewReport();
        }else{ //装入 
            new Eapi.EformEbiao().load(oTable);
        }
        var sCommand = "DjOpen('ebiao',window.dialogArguments,'展现','有模式窗口','直接','e表控件属性');"

		var sHtml =  '<img src="../images/ef_run_button_prop.gif" style="position:absolute;top:1;left:220;" onclick="'+sCommand+'" > <img src="../images/ef_run_button_ok1.gif" style="position:absolute;top:1;left:300;" onclick="new Eapi.EformEbiao().save();" ><img src="../images/ef_run_button_close1.gif" style="position:absolute;top:1;left:360;" onclick="blnChange=false;window.close();">';		
    
        $id("divBottom").insertAdjacentHTML("beforeEnd",sHtml);
	}	
	
	fcpub.divMainWidth = divMain.clientWidth;
	fcpub.divMainHeight = divMain.clientHeight;
	
	
	var d=new Date()
	var t1=d.getTime()
	//alert(t1-t2)	
	function _initDivPos(){
		divAll.style.top = fcpub.baseTop;
		divAll.style.left = 0;
		divTopLeft.style.top = 0;
		divTopLeft.style.left = 0;
		divTopLeft.style.width = fcpub.firstColWidth;
		divTopLeft.style.height = fcpub.titleRowHeight;
		divTopHead.style.top = 0;
		divTopHead.style.left = fcpub.firstColWidth   ; //2估计是线宽
		divLeftHead.style.top = fcpub.titleRowHeight  ; //1估计是线宽
		divLeftHead.style.left = 0;
		divMain.style.top = fcpub.titleRowHeight ;
		divMain.style.left = fcpub.firstColWidth  ;
    }
    var layoutModule = Request.QueryString("layoutModule").toString();  //添加设计布局模板的e表单工具栏
    if (layoutModule == "yes") {     
        var type = parent.Request.QueryString('type').toString(); //打开文件类型的参数（file从文件打开，db从数据库打开）
        if (!IsSpace(type)) { //有打开文件类型的参数
            if (type == "db") {
                var layoutName = parent.Request.QueryString('layoutName').toString();
                if (!IsSpace(layoutName)) {//有布局模板名
                    parent.loadLayoutDb(layoutName);
                }
            } else {
            var fileName = parent.Request.QueryString('fileName').toString();
                if(!IsSpace(fileName)){
                    var sPath = '/zk/layoutfile/' + fileName;
                    parent.loadLayoutFile(sPath);
                }
            }
        }
    }
}

function window_onresize(){
	// -3 为窗口边框的宽度
    var iHeight = document.body.offsetHeight - divLeftHead.style.pixelTop - divAll.style.pixelTop - 28; // - 3;
	var iWidth = document.body.offsetWidth-divTopHead.style.pixelLeft-3; //-25;
	if(iHeight-18 > 0) divLeftHead.style.height = iHeight-18 ;  //18是滚动条的宽度
	if(iWidth-18 > 0 )divTopHead.style.width = iWidth-18 ;
	if(iHeight<= 0 || iWidth <= 0) return;
	divMain.style.height = iHeight;
	divMain.style.width = iWidth;

	divBottom.style.top = divMain.style.pixelTop + divAll.style.pixelTop + iHeight;
	divBottom.style.width = iWidth;

	srcHtml.style.height = iHeight+divTopHead.style.pixelHeight;
	srcHtml.style.width  = iWidth+divLeftHead.style.pixelWidth;
	//divMiddle.style.height = divLeftHead.style.height;
	//divMiddle.style.width = divTopHead.style.width;

	fcpub.divMainWidth = divMain.clientWidth;
	fcpub.divMainHeight = divMain.clientHeight;
	
}
function main_onbeforeeditfocus() {
	var obj = event.srcElement ;
	
	//if(obj.tagName.toUpperCase() == "TD" ){
	//	alert("ddd");
	//	return ;
	//} 
	alert("main_onbeforeeditfocus");
	//event.returnValue = false
}
function divMain_onmousedown() {

	//alert("divMain_onclick()");
	if( event.srcElement.id == "divMain"){
	//	cboFontSize.focus();
	}
}
function divMain_onkeydown(keycode1,bctrlKey1,bshiftKey1) {
	//37--40
	if(arguments.length == 3){
		var keycode = keycode1;
		var bctrlKey = bctrlKey1;
		var bshiftKey = bshiftKey1;	
	}else {
		var keycode = event.keyCode;
		var bctrlKey =event.ctrlKey;
		var bshiftKey = event.shiftKey;
	}
	//if(bshiftKey == false) visibleInputFocus();
	//alert(keycode);
	//if(event.ctrlKey){
	//switch (keycode){
	//	case 37 : 
		if(keycode == 36){ // left
			beforeKeyPress();
			//divMain.scrollLeft=0;
			SelObj.eColSort=SelObj.sColSort=SelObj.eCol=SelObj.sCol=0;
			SelObj.eRow=SelObj.sRow=SelObj.eRowSort=SelObj.sRowSort;
			selectRange();
			//window.setTimeout("visibleBlue();",10);
			CancelEvent();

		} 
		if(keycode == 33){  // up
			beforeKeyPress();
			//divMain.scrollTop=0;
			SelObj.eRowSort=SelObj.sRowSort=SelObj.eRow=SelObj.sRow=0;
			SelObj.eCol=SelObj.sCol=SelObj.eColSort=SelObj.sColSort;
			selectRange();
			CancelEvent();

		} 
		if(keycode == 35){  // right
			beforeKeyPress();
			//divMain.scrollLeft = tabTopHead.rows(0).cells(tabTopHead.rows(0).cells.length-1).offsetLeft;
			SelObj.eColSort=SelObj.sColSort=SelObj.eCol=SelObj.sCol=tabTopHead.rows(0).cells.length-1;
			SelObj.eRow=SelObj.sRow=SelObj.eRowSort=SelObj.sRowSort;
			selectRange();
			CancelEvent();
			
		} 
		if(keycode == 34){   // down
			beforeKeyPress();
			//divMain.scrollTop = tabLeftHead.rows(tabLeftHead.rows.length-1).offsetTop;
			SelObj.eRowSort=SelObj.sRowSort=SelObj.eRow=SelObj.sRow=tabLeftHead.rows.length-1;
			SelObj.eCol=SelObj.sCol=SelObj.eColSort=SelObj.sColSort;
			selectRange();
			CancelEvent();
			
		} 

	if(bctrlKey){
	switch (keycode){
		case 37 : { // left
			
			if(SelObj.eCol>0)	SelObj.eCol--;
			//divMain.scrollLeft=tabTopHead.rows(0).cells(eCol).offsetLeft;
			selectRangeTo(SelObj.eRow,SelObj.eCol);
			CancelEvent();
			break;
		} 
		case 39 : { // right
			if(SelObj.eCol<tabTopHead.rows(0).cells.length-1)	SelObj.eCol++;
			//divMain.scrollLeft=tabTopHead.rows(0).cells(SelObj.eCol).offsetLeft;
			selectRangeTo(SelObj.eRow,SelObj.eCol);
			CancelEvent();
			break;
		} 
		case 38 : { // up
			if(SelObj.eRow>0)	SelObj.eRow--;
			if(findLogTd(SelObj.eRow,SelObj.eCol) != null){
				selectRangeTo(SelObj.eRow,SelObj.eCol);
				CancelEvent();
			}
			break;
		} 
		case 40 : { // down
			if(SelObj.eRow<tabLeftHead.rows.length-1)	SelObj.eRow++;
			if(findLogTd(SelObj.eRow,SelObj.eCol) != null){
				selectRangeTo(SelObj.eRow,SelObj.eCol);
				CancelEvent();
			}
			break;
		} 
	}
	}
	if( keycode == 9) event.returnValue = false; // tab键
	if(bctrlKey && keycode == 46){ //ctrl+del键,只清除内容
			getSelCells();
		var l = SelObj.cells.length;
		//if(l>1){
			for(var i=0;i<l;i++){
				SelObj.cells[i].oTD.innerText = "";
			}	
			RefreshCurTdValue();
		//}
	
	}
	if(bshiftKey && keycode == 46){ //shift+del键,只清除格式
			getSelCells();
		var l = SelObj.cells.length;
		//if(l>1){
			for(var i=0;i<l;i++){
				var propList =  SelObj.cells[i].oTD.attributes;
				for(var j=propList.length-1;j>=0;j--){
					propList.removeNamedItem(propList(i).nodeName);
				}
				SelObj.cells[i].oTD.style.cssText = "";
			}	
		//}
	
	}
	if(bshiftKey == false && bctrlKey == false ){
	if(keycode==37 || keycode==39 || keycode == 13 ){ //13=回车键, 46=del键,只清除内容
		var bMove = false;
		if(txtEdit.value != "" && keycode != 13  ){
			var oo = document.selection.createRange();
			if(oo != null ){
				if(oo.text == txtEdit.value) bMove = true;
			}
		}else{
			bMove = true;	
		}
		if(bMove){
			//直接按钮	
			switch (keycode){
				case 37 : { // left
					if(SelObj.sColSort  > 0){
						beforeKeyPress();
						//divMain.scrollLeft=0;
						SelObj.eCol=SelObj.eColSort= SelObj.sCol=SelObj.sColSort = SelObj.sColSort - 1;
						SelObj.eRow=SelObj.eRowSort=SelObj.sRow=SelObj.sRowSort;
						selectRangeBig();
					}
					CancelEvent();
					break;
				} 
				case 39 :  { // right
					if(SelObj.eColSort  < tabTopHead.rows(0).cells.length-1){
						beforeKeyPress();
						//divMain.scrollLeft = tabTopHead.rows(0).cells(tabTopHead.rows(0).cells.length-1).offsetLeft;
						SelObj.eCol=SelObj.eColSort= SelObj.sCol=SelObj.sColSort = SelObj.eColSort + 1;
						SelObj.eRow=SelObj.sRowSort=SelObj.sRow=SelObj.eRowSort;
						selectRangeBig();
					}
					CancelEvent();
					break;
				} 
				case 13 : { // 回车键
					beforeKeyPress();
					if(SelObj.eColSort < tabTopHead.rows(0).cells.length-1){
						//divMain.scrollLeft = tabTopHead.rows(0).cells(tabTopHead.rows(0).cells.length-1).offsetLeft;
						SelObj.eColSort++;
						SelObj.sColSort=SelObj.eCol=SelObj.sCol= SelObj.eColSort;
						SelObj.eRow=SelObj.sRowSort=SelObj.sRow=SelObj.eRowSort;
					}else if (SelObj.eRowSort < tabLeftHead.rows.length-1){
						//divMain.scrollTop = tabLeftHead.rows(tabLeftHead.rows.length-1).offsetTop;
						SelObj.eRowSort++;
						SelObj.sRow=SelObj.sRowSort=SelObj.eRow=SelObj.eRowSort;
						SelObj.eCol=SelObj.eColSort=SelObj.sColSort=SelObj.sCol=0;
					}else{
						//divMain.scrollTop = 0;
						//divMain.scrollLeft = 0;
						SelObj.eRowSort=SelObj.sRowSort=SelObj.eRow=SelObj.sRow=0;
						SelObj.eCol=SelObj.eColSort=SelObj.sColSort=SelObj.sCol=0;
					}
					selectRangeBig();
					CancelEvent();
					break;
				} 
			} // end switch
		
		}
		
		
	}
	//直接按钮	
	switch (keycode){
		case 38 : { // up
			if(SelObj.sRowSort>0){
				beforeKeyPress();
				//divMain.scrollTop=0;
				SelObj.sRowSort--;
				SelObj.eRowSort=SelObj.sRow=SelObj.eRow=SelObj.sRowSort;
				SelObj.eCol=SelObj.eColSort=SelObj.sCol=SelObj.sColSort;
				selectRangeBig();
			}
			CancelEvent();
			break;
		} 
		case 40 : { // down
			if(SelObj.eRowSort < tabLeftHead.rows.length-1){
				beforeKeyPress();
				//divMain.scrollTop = tabLeftHead.rows(tabLeftHead.rows.length-1).offsetTop;
				SelObj.eRowSort++;
				SelObj.sRow=SelObj.sRowSort=SelObj.eRow=SelObj.eRowSort;
				SelObj.eCol=SelObj.sCol=SelObj.sColSort=SelObj.eColSort;
				selectRangeBig();
			}
			CancelEvent();
			break;
		} 
	} // end switch
	} // end if
	
}
function divMain_onkeyup() {
	var keycode = event.keyCode;
	switch (keycode){
		case 37 : { // left
//			visibleBlue();
			break;
		} 
	}
}

/**
* 表格滚动事件，需要处理divLeftHead,divTopHead的滚动。
**/
function divMain_onScroll() {
	divLeftHead.scrollTop=divMain.scrollTop;
	divTopHead.scrollLeft=divMain.scrollLeft;

	if(blnMouseDown == false){	
//		showBlueScale();
//		moveInputFocus();
	}
}
/**
* 表格的点击事件
**/
function divMain_onclick(){
	//t_onmousedown();
	//t_onmouseup();
	//alert("t")

	
	//txtEdit.focus();
	
}
/**
*打印报表 test use

**/
function PrintReport(){
	alert(divMain.scrollHeight+"   "+divLeftHead.scrollHeight);
}
/**
//表头点击处理	

**/
function divTopHead_onclick() {
	if (event.srcElement.tagName!="TD") return false
	if(tabTopHead.rows(0).style.cursor ==cursorcolresize) return;
	
	selOneCol(event.srcElement.cellIndex);
}
function selOneCol(curColNo) {
	//var scrollBak = divMain.scrollTop ;
	//var curColNo=event.srcElement.cellIndex;
	SelObj.selrowcol = 1 ;
	selectRange("selcol",0,curColNo,$id("t").rows.length-1,curColNo);
	
	//divMain.scrollTop = scrollBak ;
}
function divLeftHead_onclick() {
	if (event.srcElement.tagName!="TD") return false
	if(tabLeftHead.childNodes(0).childNodes(0).style.cursor ==cursorrowresize) return;
	selOneRow(event.srcElement.parentNode.rowIndex);
}
function selOneRow(curRowNo) {
	//var scrollBak = divMain.scrollLeft ;
	//var curRowNo=event.srcElement.parentNode.rowIndex
	SelObj.selrowcol = 1 ;
	selectRange("selrow",curRowNo,0,curRowNo,tabTopHead.rows(0).cells.length-1);
	//divMain.scrollLeft = scrollBak ;
}
function divTopLeft_onclick() {
	//var scrollBak = divMain.scrollTop ;
	//var scrollBak1 = divMain.scrollLeft ;
	selectRange("",0,0,$id("t").rows.length-1,tabTopHead.rows(0).cells.length-1);
	//divMain.scrollTop = scrollBak ;
	//divMain.scrollLeft = scrollBak1 ;
}
function t_onfocusin() {
	alert(event.srcElement.outerHTML)
}
function txtEdit_onkeyup() {
	txtFx.value=txtEdit.value;
}
function txtFx_onkeyup() {
	txtEdit.value = txtFx.value;
}
function txtEdit_onmousewheel() {
	//var bool = divMain.fireEvent("onmousewheel");
	//alert(bool);
	//event.returnValue = false;
}
function cboZoom_onchange() {
	var obj = event.srcElement;
	var rate = obj.options(obj.selectedIndex).text;
	divAll.style.zoom = rate;
	return;
	/*
	$id("t").style.zoom = rate;
	tabTopHead.style.zoom = rate;
	tabLeftHead.style.zoom = rate;
	
	return;
	txtEdit.style.zoom = rate;
	tLine[0].style.zoom = rate;
	tLine[1].style.zoom = rate;
	tLine[2].style.zoom = rate;
	tLine[3].style.zoom = rate;
*/

	
	divTopLeft.style.zoom = rate;
	divMain.style.zoom = rate;
	divTopHead.style.zoom = rate;
	divLeftHead.style.zoom = rate;
	
	_calcPos(divMain,rate);
	_calcPos(divTopHead,rate)
	_calcPos(divLeftHead,rate)
	
	function _calcPos(divMain,rate){
		divMain.style.left = 1+(divMain.style.pixelLeft-1)*parseInt(rate)/100;
		divMain.style.top = fcpub.baseTop+(divMain.style.pixelTop-fcpub.baseTop)*parseInt(rate)/100;
		//divMain.style.width = divMain.style.pixelWidth*parseInt(rate)/100;
		//divMain.style.height = divMain.style.pixelHeight*parseInt(rate)/100;
		
	}
}
/**
* 取消事件的动作
*@date 2007-04-18
**/
function CancelEvent(){
	event.cancelBubble = true;
	event.returnValue = false;

}




