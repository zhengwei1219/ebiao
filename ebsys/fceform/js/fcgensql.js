var oLines = new Array() ; //保存所有的表间关系对象

function div_resizeend() {
	//alert();
	
	var	divsub = event.srcElement;
	//alert(divsub.outerHTML);
	//var divtop = divsub.parentNode;
    div_adjustPos(divsub);
	var tabName = divsub.parentNode.id;
	tabName = tabName.substring(4,tabName.length);
	_FindLine(tabName);
}
function div_adjustPos(divsub){
	var tempdiv = divsub.children[0];
	var iwid = divsub.offsetWidth-6;
	if(iwid<20) iwid=20;
	tempdiv.style.width=iwid;
	divsub.style.width = iwid+6;
	//divtop.style.width = divsub.style.width;
	var ihei = divsub.offsetHeight-20;  //20是标题占的高度
	if(ihei<30) ihei =30;
	tempdiv.style.height = ihei;
	divsub.style.height = ihei+20;
	//divtop.style.height = divsub.style.height;
	//var tab = tempdiv.children[0];
	//tab.style.width = tempdiv.style.width;

}
function div_move() {
	var	divsub = event.srcElement;
	var tabName = divsub.parentNode.id;
	tabName = tabName.substring(4,tabName.length);
	_FindLine(tabName);
}
function div_scroll() {
	var	divsub = event.srcElement;
	divsub = divsub.parentNode;
	var tabName = divsub.parentNode.id;
	tabName = tabName.substring(4,tabName.length);
	_FindLine(tabName);

}

function rowSelect() {
	var obj = event.srcElement;
	if(obj.tagName == "TD") obj = obj.parentNode;
	if(obj.tagName == "TR"){
		var tab = obj.parentNode.parentNode;
		for(var i=0;i<tab.rows.length;i++){
			tab.rows(i).className = "";
		}
		obj.className = "table_selected_row";
	}
}

/*
function tab_drag_start(){
	var obj = event.srcElement;
	//alert(obj.tagName);
	dragObj = obj;
	
}*/

var dragObj=null;
function tab_mouse_down() {
	var obj = event.srcElement;
	//alert(obj.tagName);
	
	if(obj.tagName != "TD") return;
	if (obj.parentNode.className != "table_selected_row") return;
	dragObj = obj;
	divMain.setCapture();
}
function tab_mouse_move() {
	if(dragObj == null) return;
	var obj = event.srcElement;
	if(obj.tagName != "TD") return;	
	obj.style.cursor = "default";
	var oTab = obj.parentNode.parentNode.parentNode;
	if(oTab == dragObj.parentNode.parentNode.parentNode ) return;
	//alert(obj.tagName);
	//obj.style.cursor="hand";

}
function tab_mouse_up() {
	if(dragObj == null) return;
	
	
	
	//alert(obj.tagName);
	divMain.releaseCapture();
	var oBak = dragObj;
	dragObj = null;
	var obj = event.srcElement;
	if(obj.tagName != "TD") return;
	//判断不是当前表
	//alert(obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id );
	if(obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id == oBak.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id ) return;
	if(oBak.parentNode.rowIndex <= 0 || obj.parentNode.rowIndex <= 0 ) return;
	LineToTable(oBak,obj);
	
	//alert(obj.outerHTML);
}
function tab_dblclick() {
	var obj = event.srcElement;
	//alert(obj.outerHTML);
	if(obj.tagName == "line"){
		
//		alert("a");
		//先删除线
		for(var i=0;i<oLines.length;i++){
			//alert(oLines[i].lineid+"||" +obj.id);
			if(oLines[i].lineid+"3" == obj.id){
				//alert("b");
				var sRet = DjOpen("eb_gensql2" ,oLines[i] , "展现","有模式窗口","直接","设置联接线");
				if(typeof sRet != "undefined"){
					if(sRet == "del"){
						_DelOneLine(oLines[i],i);
					}
				}
				break;
			}
		}	
	}

}
function title_dblclick(){
	var obj = event.srcElement;
	obj = obj.parentNode;
	if(obj.tagName == "DIV" && obj.id != "undefined"){
		var s = obj.id;
		if(s.substring(0,4) == "tab_"){
			var curTableName = s.substring(4,s.length);
			for(var i=0;i<oPubTables.length;i++){
				if(curTableName == oPubTables[i].name){
					var arr = DjOpen("eb_gensql1" ,oPubTables[i] , "展现","有模式窗口","直接","修改表的别名");
					if(typeof arr != "undefined"){
						if(arr[0] == "del"){
							_DelOneTable(curTableName);
						}else if(arr[0] == "othername"){
							//改表的别名
							var sOther = arr[1];
							_ChangeTableName(oPubTables[i],sOther);
							_RefreshDropDownList();
						}
					}
				}
			}
		}
	}
}
//设置表的别名
function _ChangeTableName(oTable,otherName) {
	var tableName = oTable.name;
	var oldOtherName = oTable.otherName
	
	//处理grid上的内容
	var s = tableName;
	if(oldOtherName != "") s = oldOtherName;
	var l = grid1.Rows;
	for(var i=1;i<l;i++){
		var sValue = grid1.tab.rows(i).cells(1).innerText;
		if(sValue.indexOf(s+".") == 0 ){
			grid1.tab.rows(i).cells(1).innerText = otherName+sValue.substring(s.length,sValue.length); 
		}
	}
	var l = grid2.Rows;
	for(var i=1;i<l;i++){
		var sValue = grid2.tab.rows(i).cells(2).innerText;
		if(sValue.indexOf(s+".") == 0 ){
			grid2.tab.rows(i).cells(2).innerText = otherName+sValue.substring(s.length,sValue.length); 
		}
	}
	//处理全局表对象
	oTable.otherName = otherName;
}

function LineToTable(oTd1,oTd2) {
	var obj1 = _getTdPos(oTd1);
	var obj2 = _getTdPos(oTd2);
	var stable1 = oTd1.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
	stable1 = stable1.substring(4,stable1.length);
	var stable2 = oTd2.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
	stable2 = stable2.substring(4,stable2.length);
	//alert(obj1.height)
	//线的id =表名_行号_对方表名_相应行号_1,2,3
	var sId =stable1 + "_" +oTd1.parentNode.rowIndex+"_" + stable2 + "_" +oTd2.parentNode.rowIndex+"_" ;
	//var sLine = '<v:line id="' + sId+ '1" from="0,0" to="20,0" style="position:absolute;left:' + (obj1.right) + ';top:' + obj1.height+ '" />' ;
	//sLine += '<v:line id="' + sId+ '2" from="0,0" to="20,0" style="position:absolute;left:' + (obj2.left-20) + ';top:' + obj2.height+ '" />' ;
	//sLine += '<v:line id="' + sId+ '3" from="0,0" to="' + (obj2.left-20-(obj1.right+20))+ ',' + (obj2.height-obj1.height)+ '" style="position:absolute;left:'+(obj1.right+20)+';top:'+obj1.height+'" />' ;
	var sLine = '<v:line id="' + sId+ '1" from="0,0" to="0,0" strokeweight="3pt" />' ;
	sLine += '<v:line id="' + sId+ '2" from="0,0" to="0,0" strokeweight="3pt" />' ;
	sLine += '<v:line id="' + sId+ '3" from="0,0" to="0,0" strokeweight="3pt" style="cursor:hand;" />' ;
	divMain.insertAdjacentHTML('beforeEnd',sLine);
	//加上线对象
	var pos=oLines.length;
	oLines[pos] = new Object();
	oLines[pos].table1 = stable1;
	oLines[pos].rowno1 = oTd1.parentNode.rowIndex;
	oLines[pos].td1 = oTd1;
	oLines[pos].table2 = stable2;
	oLines[pos].rowno2 = oTd2.parentNode.rowIndex;
	oLines[pos].td2 = oTd2;
	oLines[pos].lineid = sId;
	oLines[pos].op = "=";
	oLines[pos].join = "inner";
	_RedrawLine(oLines[pos]);
	//变粗体
	oTd1.style.fontWeight= "bold";
	oTd2.style.fontWeight= "bold";
	
//	alert(divMain.innerHTML)
}
function _FindLine(tablename){
	for(var i=0;i<oLines.length;i++){
		if(oLines[i].table1 == tablename || oLines[i].table2 == tablename){
			_RedrawLine(oLines[i]);
		}
	}
}
function _DelOneLine(oLine,iPos){
	//清除界面上的线
	$id(oLine.lineid+"1").outerHTML = "";
	$id(oLine.lineid+"2").outerHTML = "";
	$id(oLine.lineid+"3").outerHTML = "";
	//去掉粗体标记.
	var bTd1 = false;
	var bTd2 = false;
	for(var i=0;i<oLines.length;i++){
		if(i == iPos ) continue;
		if(bTd1 && bTd2 ) break;
		if(oLines[i].table1 == oLine.table1 && oLines[i].rowno1 == oLine.rowno1) bTd1 = true ;
		if(oLines[i].table2 == oLine.table2 && oLines[i].rowno2 == oLine.rowno2) bTd2 = true ;		
	}		
	if(bTd1 == false) oLine.td1.style.fontWeight="normal";
	if(bTd2 == false) oLine.td2.style.fontWeight="normal";
	//删除全局对象
	oLines.splice(iPos, 1);

}
function _DelOneTable(tableName){
	//处理grid上的内容
	var s = oPubTables[tableName].otherName;
	if(s == "") s = tableName;
	var l = grid1.Rows;
	for(var i=l-1;i>0;i--){
		var sValue = grid1.tab.rows(i).cells(1).innerText;
		if(sValue.indexOf(s+".") == 0 ){
			grid1.DeleteRow(i); 
		}
	}
	var l = grid2.Rows;
	for(var i=l-1;i>0;i--){
		var sValue = grid2.tab.rows(i).cells(2).innerText;
		if(sValue.indexOf(s+".") == 0 ){
			grid2.DeleteRow(i); 
		}
	}

	//删除和此表关联的线
	for(var i=oLines.length-1;i>=0;i--){
		if(oLines[i].table1 == tableName || oLines[i].table2 == tableName ){
			_DelOneLine(oLines[i],i);
		}
	}
	$id("tab_"+tableName).outerHTML ="";
	
	//清除已选表的数组
	for(var i=0;i<oPubTables.length;i++){
		if(oPubTables[i].name == tableName){
			//oPubTables.removeAt(i);
			Array.removeAt(oPubTables,i);
			break ;
		}
	}
	_RefreshDropDownList();	
}
function _RedrawLine(oLine){
	var sId = oLine.lineid ;
	var obj1 = _getTdPos(oLine.td1);
	var obj2 = _getTdPos(oLine.td2);
	//换位
	if(obj1.left>obj2.left){
		var obak = obj1;
		obj1=obj2;
		obj2=obak;
	}
	//定线的位置
	var o1 = $id(sId+"1");
	var o2 = $id(sId+"2");
	var o3 = $id(sId+"3");	

	//o1.style.cssText = 'position:absolute;left:' + (obj1.right) + ';top:' + obj1.height;
	o1.style.position = "absolute";
	o1.style.left = obj1.right ;
	o1.style.top = obj1.height;
	o1.to = "20,0";
	//o2.style.cssText = 'position:absolute;left:' + (obj2.left-20) + ';top:' + obj2.height;
	o2.style.position = "absolute";
	o2.style.left = obj2.left-20 ;
	o2.style.top = obj2.height;
	o2.to = "20,0";
	//o3.style.cssText = 'position:absolute;left:'+(obj1.right+20)+';top:'+obj1.height;
	o3.style.position = "absolute";
	o3.style.left = obj1.right+20 ;
	o3.style.top = obj1.height;
	o3.to =  (obj2.left-20-(obj1.right+20))+ ',' + (obj2.height-obj1.height) ;
}
function _getTdPos(oTd){
	var oDiv = oTd.parentNode.parentNode.parentNode.parentNode ;
	var iHeight = oDiv.parentNode.style.pixelTop + oDiv.offsetTop + oTd.offsetTop  - oDiv.scrollTop + oTd.offsetHeight/2;
	var iStart = oDiv.parentNode.style.pixelTop + oDiv.offsetTop ;
	var iEnd =  oDiv.parentNode.style.pixelTop + oDiv.offsetTop + oDiv.offsetHeight ;
	if(iHeight > iEnd ) iHeight = iEnd;
	if(iHeight < iStart ) iHeight = iStart ;
	return { 
		height : iHeight,
		left : oDiv.parentNode.style.pixelLeft ,
		right : oDiv.parentNode.style.pixelLeft + oDiv.parentNode.style.pixelWidth
	} ;
}
function _addOneTable(tableName,tbchnname,connStr) {
	//检查此表是否已加上
	for(var i=0;i<oPubTables.length;i++){
		if(oPubTables[i].name == tableName){
			return ;
		}
	}
	
	if(fcpubdata.dbStruDict == "FC_ENTITY"){
	 //   fillcombox("select fdname,chnname from fc_entitysub where tbname='"+tableName+"'",gensql_callback ); //orgid='"+orgid+"' and 
		new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=fillcombox"+connStr,"<no>select fdname,chnname from fc_entitysub where tbname='"+tableName+"' order by fdname</no>",
			gensql_callback);
	    
	}else{
	    new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=GetFieldName"+connStr,"<no>select * from "+tableName+" where 1=2 </no>",gensql_callback );
    }
    function gensql_callback(result){
        var ret = result.value;
        //增加到全局对象
        var l = oPubTables.length;
        oPubTables[l] = new Object();
        oPubTables[l].name = tableName ;
        oPubTables[l].tbchnname = tbchnname ; //表中文名
        oPubTables[l].otherName = "";
        //oPubTables[l].selected = new Array(); //已选中的字段数组. 
        //
        var oXmlField = SetDom("<root>"+ret+"</root>");
        var sb1 = new Sys.StringBuilder();
        var sb2 = new Sys.StringBuilder();
        var sb3 = new Sys.StringBuilder();
        for(var ii=0;ii<oXmlField.documentElement.childNodes.length;ii++){
            var fName = oXmlField.documentElement.childNodes(ii).getAttribute("value");
            var fChnName=oXmlField.documentElement.childNodes(ii).text;
            if(IsSpace(fName) && IsSpace(fChnName)==false) fName = fChnName;
            sb1.append("<tr><td><input type=checkbox onclick=_RefreshFieldList() fieldname='"+fName+"'></td><td>"+fChnName+"</td></tr>");
            sb2.append("<option>"+fName+"</td><td>"+fChnName+"</td></tr>"); //原用的
            sb3.append("<tr height=\"21px\" ><td>"+tbchnname+"."+fChnName+"</td><td>"+tableName+"."+fName+"</td></tr>");
        }
        //ret= RepStr(ret,"</option>","</td></tr>");
        oPubTables[l].fieldstr = sb2.toString();   //所有的字段串
        oPubTables[l].fieldstr1 = sb3.toString();   //所有的字段串
        oPubTables[tableName] = oPubTables[l]; //备份一个引用
        //ret= RepStr(ret,"<option>","<tr><td><input type=checkbox onclick=_RefreshFieldList() ></td><td>");
        var sb = new Sys.StringBuilder();
        sb.append('<div  id=tab_'+tableName+' contentEditable=true onselectstart="event.returnValue=false;" >');
        sb.append('<div  contentEditable=false onresizeend="div_resizeend()" onmove="div_move()" ondblclick="title_dblclick()" style="padding:0px;z-index:3;overflow:hidden;background-color:midnightblue;color:#FFFFFF;position:absolute;left:20px;top:20px;border-bottom:gray 3px solid;border-top:gray 3px solid;border-left:gray 3px solid;border-right:gray 3px solid" >');
        sb.append(tbchnname);
        sb.append('<div  style="overflow-x:hide;overflow-y:auto;background-color:white;color:black;" onscroll="div_scroll()">');
        sb.append('<table onclick="rowSelect()" style="font-size:12px;" >');
        sb.append('<tr><td><input type=checkbox onclick=_RefreshFieldList() fieldname="*" ></td><td>*</td></tr>');
        sb.append(sb1.toString());
        sb.append('</table>');
        sb.append('</div>');
        sb.append('</div>');
        sb.append('</div>');
        divMain.insertAdjacentHTML('beforeEnd',sb.toString());
        //如太高了则调整到250,太宽了则调整到200
        var obj = $id("tab_"+tableName).children(0);
        if(obj.offsetHeight > 250) 
	        obj.style.height = 250 ;
        else
	        obj.style.height = obj.offsetHeight;
    	
        if(obj.offsetWidth > 500) 
	        obj.style.width = 500 ;
        else
	        obj.style.width = obj.offsetWidth+18;
    		
        div_adjustPos(obj);
        
        //刷新下拉列表的内容	
        _RefreshDropDownList();
    }

}
function _RefreshDropDownList() {
	
	//设置表格中的下拉列表
	var sHtml1 = "<code><format>";
    var sHtml11="字段名|";
    var sHtml12="  字 段 名  |字段中文名";
	var sHtml13="</format><sql1></sql1><xml>";
	var sHtml2 = "</xml><blninput>";
	var sHtml4 = "</blninput><blnempty>否</blnempty><check>2</check><onclickopen>event.showlist=true</onclickopen><fieldnamelist>";
    var sHtml5 = "chnname,fdname";
	var sHtml6 ="</fieldnamelist></code>";
	var sb1 = new Sys.StringBuilder();
	var sb2 = new Sys.StringBuilder();
	for(var i=0;i<oPubTables.length;i++){
		var ret =oPubTables[i].fieldstr;
		var sOther = oPubTables[i].otherName;
		if(sOther == "") sOther = oPubTables[i].name
		ret = RepStr(ret,"<option>","<tr height=\"21px\" ><td>"+sOther+".");
		sb1.append(ret);
		sb2.append(oPubTables[i].fieldstr1);
	}
	grid2.tab.children[0].children[2].cz  = sHtml1+sHtml11+sHtml13+sb2.toString()+sHtml2+"否"+sHtml4 +sHtml5+sHtml6 ;				
	grid2.tab.children[0].children[4].cz  = sHtml1+sHtml12+sHtml13+sb1.toString()+sHtml2+"是"+sHtml4 +sHtml6 ;	
	grid2.hide();
}
function _RefreshFieldList() {
	var obj = event.srcElement;
	var tableName = obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
	tableName = tableName.substring(4,tableName.length);
	var fieldName = obj.fieldname ;
	var fieldChnName = obj.parentNode.parentNode.cells(1).innerText ;
	var sOther = tableName;
	if(oPubTables[tableName].otherName != "") sOther = oPubTables[tableName].otherName;
	var sAll =sOther +"."+fieldName;
	if(obj.checked){
		//加上一个字段
		grid1.InsertRow();
		var row = grid1.Rows-1;
		grid1.tab.rows(row).cells(1).innerText = oPubTables[tableName].tbchnname+"."+fieldChnName ;
		grid1.tab.rows(row).cells(6).innerText = sAll ;
		
	}else{
		var rows = grid1.Rows;
		for(var i=1;i<rows;i++){
			if(grid1.tab.rows(i).cells(6).innerText == sAll){
				grid1.DeleteRow(i);
				break;
			}
		
		}
	}
	
	
}
/**
* 检查sql合法性
**/
function _PreCheck() {
	var l = grid1.Rows;
	if(oPubTables.length<=0){
		return "至少要增加一个表!";	
	}
	if(l<=1){
		return "至少要选择一个字段!";
	}
	l=grid2.Rows;
	var sLeft = "",sRight = ""; //左右括号汇总
	for(var i=1;i<l;i++){
		var fdName = grid2.tab.rows(i).cells(2).innerText;
		var sOp = grid2.tab.rows(i).cells(3).innerText;
		var fdValue = grid2.tab.rows(i).cells(4).innerText;
		if((fdName == "" && sOp =="" && fdValue =="") || (fdName != "" && sOp !="" && fdValue !="")){
		
		} else {
			return "条件中的第" + (i-1) + "行不完整";
		}
		sLeft += new Eapi.Str().trim(grid2.tab.rows(i).cells(1).innerText);
		sRight += new Eapi.Str().trim(grid2.tab.rows(i).cells(5).innerText);
		
	}
	if(sLeft.length != sRight.length){
		//alert("a"+sLeft+"b"+sRight+"c");
		return "左括号和右括号的个数不一致!";
	}
	return "";
}

/**
* 根据界面生成sql语句
**/
function _GenSql() {
    var sFieldChnList="";
	var sSelect = "";
	var sGroup = "";
	var sOrder = "";
	var l = grid1.Rows;
	for(var i=1;i<l;i++){
		var fdName = grid1.tab.rows(i).cells(6).innerText;
		var sSum = grid1.tab.rows(i).cells(4).innerText;
		sSum = _SumNameTo(sSum);
		if(sSum != "") fdName = sSum +"(" + fdName + ")" ;
		var fdOther = grid1.tab.rows(i).cells(5).innerText;
		if(fdOther != "" ) fdName = fdName + " as " +fdOther;
		var sEnd = "";
		if(i != l-1) sEnd = "," ;
		sSelect += fdName + sEnd ;
		sFieldChnList += grid1.tab.rows(i).cells(1).innerText + sEnd ;
		
		var sTmp = grid1.tab.rows(i).cells(2).innerText;
		if(sTmp == "升序"){
			sOrder += fdName+",";
		}else if(sTmp == "降序"){
			sOrder += fdName+" DESC ,"
		}
		var sTmp = grid1.tab.rows(i).cells(3).innerText;
		if(sTmp == "分组"){
			sGroup += fdName+",";
		}
	}
	if(sOrder != "") sOrder = sOrder.substring(0,sOrder.length-1);
	if(sGroup != "") sGroup = sGroup.substring(0,sGroup.length-1);
	sOrder = new Eapi.Str().trim(sOrder);
	sGroup = new Eapi.Str().trim(sGroup);
	
	var sWhere = "";
	var l = grid2.Rows;
	for(var i=1;i<l;i++){
		var fdName = grid2.tab.rows(i).cells(7).innerText;
		var sOr = "";
		if(i<l-1) {
			if(grid2.tab.rows(i).cells(6).innerText == "或者"){
				sOr =  " or ";
			}else  {
				sOr = " and ";
			}
		}
		sWhere += grid2.tab.rows(i).cells(1).innerText + fdName + _OpNameTo(grid2.tab.rows(i).cells(3).innerText)+grid2.tab.rows(i).cells(4).innerText +grid2.tab.rows(i).cells(5).innerText + sOr;
	}
	sWhere = new Eapi.Str().trim(sWhere);
	/*
	表间关系的sql语句的生成:
 	1 从关系集合中,找到第一个关系,得到两张表,在关系集合中循环查找含这两张表的其它关系.找到后一并写到on的后面.
 	  同时从关系集合中移去这些已用的关系.
 	2 在关系集合中,找到含有这两张表中一张表的关系.找到这个关系后,再做第一步.
 	3 重复第2 步.
 	4 加上一个, 再重做.	
 	
 	--------
	*/
	var oRs =Array.clone( oLines);
	var sRelation = "";	
	var i=0;
	if(oRs.length>0){
		sRelation = oRs[0].table1;
	}
	while(oRs.length>0){
		var arrTables = new Array(); //已处理的表.
		arrTables[0] = oRs[0].table1;
		sRelation += _FindOneRelation(arrTables,oRs)+",";
	
	}
	//单独的表
	for(var i=0;i<oPubTables.length;i++){
		var tabName = oPubTables[i].name;
		var bFind =false;
		for(var j=0;j<oLines.length;j++){
			if(tabName == oLines[j].table1 || tabName == oLines[j].table2){
				bFind = true;
				break;
			}
		}
		if(bFind == false){
			sRelation += tabName+" "+oPubTables[tabName].otherName+",";
		}
	}
	if(sRelation !="") sRelation = sRelation.substring(0,sRelation.length-1);
	
	if(sWhere != "") sWhere = " where "+sWhere;
	if(sGroup != "") sGroup = " group by " + sGroup;
	if(sOrder != "") sOrder = " order by " + sOrder;
	
	if(chkDistinct.value == "是" ) sSelect = "distinct " +sSelect;
	var sAll ="select "+ sSelect + " from "+ sRelation +  sWhere +  sGroup + sOrder;
	
	return [sAll,sFieldChnList];
	
	
	
	//找到一个关系集合
	function _FindOneRelation(arrTables,oRs) {
		var sRet = "";
		while(true){
			var s1="";
			for(var i=oRs.length-1;i>=0;i--){
				//从关系中找到一个表加上.
				if(_HaveTable(arrTables,oRs[i].table1) && _HaveTable(arrTables,oRs[i].table2)==false ){
					s1 = _AddOneTableStr(arrTables,oRs[i].table2);
					break;
				}else if(_HaveTable(arrTables,oRs[i].table2) && _HaveTable(arrTables,oRs[i].table1)==false){
					s1 = _AddOneTableStr(arrTables,oRs[i].table1);
					break;
				}	
							
			}
			if(s1 == ""){
				break;
			}else{
				sRet += s1;
			}
		}
		
		return sRet;
	}
	
	//新加一个表,返回它的关系串
	function _AddOneTableStr(arrTables,tableName) {
		var sRet = "";
		for(var i=0;i<arrTables.length;i++){
			var tmp = _Get2TableRelation(oRs,tableName,arrTables[i]);
			if(tmp != "") tmp = tmp + " and ";
			sRet += tmp  ;
		}
		if(sRet != "")	{	
			arrTables[arrTables.length ] = tableName;
			//找到tableName的其中一个关系
			var sR = "inner";
			for(var k=0;k<oLines.length;k++){
				if(oLines[k].table1 == tableName || oLines[k].table2 == tableName){
					sR = oLines[k].join;
					break;
				}
			}
			sRet = " "+sR+" join " + tableName +" " + oPubTables[tableName].otherName+ " on " + sRet.substring(0,sRet.length-4);
		}
		return sRet;	
	}
	function _HaveTable(arr,tableName) {
		for(var i=0;i<arr.length;i++){
			if(arr[i] == tableName){
				return true
			}
		}
		return false;
	}
	function _Get2TableRelation(oRs,tableName1,tableName2){
		var sR = ""
		for(var i=oRs.length-1;i>=0;i--){
			var table1 = oRs[i].table1 ;
			var table2 = oRs[i].table2 ;
			if((tableName1 == table1 && tableName2 == table2) || ( tableName2 == table1 && tableName1 == table2) ){
				var sOther1 = oPubTables[table1].otherName;
				if(sOther1 == "") sOther1 = table1;
				var sOther2 = oPubTables[table2].otherName;
				if(sOther2 == "") sOther2 = table2;
				
				sR += sOther1+"."+_getLineFieldName(oRs[i].td1) +" = " + sOther2+"."+_getLineFieldName(oRs[i].td2) + " and ";
				//oRs.removeAt(i);
				Array.removeAt(oRs,i);
			}
		}
		if(sR != "") sR = sR.substring(0,sR.length-4);
		
		return sR;
		
		function _getLineFieldName(td){
		    return td.previousSibling.childNodes(0).fieldname;
		}
	}
	function _SumNameTo(sName) {
		var sRet = "";
		switch (sName) {
			case "汇总" : sRet = "sum"; break;
			case "计数" : sRet = "count"; break;
			case "平均" : sRet = "avg"; break;
			case "最小值" : sRet = "min"; break;
			case "最大值" : sRet = "max"; break;
		}
		return sRet;
	}
	function _OpNameTo(sName) {
		var sRet = "";
		switch (sName) {
			case "＝" : sRet = "="; break;
			case "＞" : sRet = ">"; break;
			case "＜" : sRet = "<"; break;
			case "＞＝" : sRet = ">="; break;
			case "！＝" : sRet = "!="; break;
			case "开始于" : sRet = " like "; break;
		}
		return sRet;
	}	
}
