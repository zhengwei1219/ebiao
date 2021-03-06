///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

Eapi.Grid = function(){}
Eapi.Grid.prototype =
{
    crossTab : CrossTab ,
    saveAsExcel : SaveAsExcel ,
    gridMultiSel : GridMultiSel ,
    dsToGrid : DsToGrid ,
    gridMultiDel : GridMultiDel ,
    getDsGrid : GetDsGrid ,
    gridColNoToFieldName : GridColNoToFieldName ,
    isRepeat: function(oGrid, col) {
        
	    var slen = oGrid.tab.rows.length; 
	    for(var i=1; i<slen; i++){
		    var sVal=oGrid.tab.rows[i].cells[col].innerText;
		    var iCount=0;
		    for(var j=i+1;j<slen;j++){
			    if(sVal==oGrid.tab.rows[j].cells[col].innerText){
				    iCount++;
			    }
			    if(iCount>=1){
				    alert(oGrid.tab.rows[j].cells[col].innerText+"重复！");
				    return true;
			    }
		    }
	    }
        return false;
    }

}
Eapi.Grid.registerClass("Eapi.Grid");

/**
*执行交叉表java
crossvalue="<sql>select fstrItemDesc,fstrName,fcuramount from receipt order by fdtmdate 
</sql><no>2</no><no>2</no><no>63</no><no>63</no><format>###,##0.00</format><rowstr>健与美,无数据,新体育</rowstr><colstr>HLJ13,HLJ14,HLJ15</colstr>"
*@date 2004-02-11
**/
function CrossTab(sXml){
	var posStart=sXml.indexOf("<sql>");
	var posEnd=sXml.indexOf("</sql>");
	var sql=sXml.substring(posStart+5,posEnd);
	sql = UnSqlPropTrans(sql);
	sql=RepOpenSql(sql);
	sXml=sXml.substring(0,posStart)+"<sql>"+sql+sXml.substr(posEnd);
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=crosstab",sXml);

}
/**
*表格单击事件处理
**/
function bill_ongridclick(sXml){
    sXml = RepStr(sXml, ":::", "'");
    
	LoadMod("noempty","gridclick",sXml);
}
/**
*表格的按键事件处理
**/
function bill_ongridkeydown(sXml){
	sXml=RepStr(sXml,":::","'");
	LoadMod("noempty","gridclick",sXml);
}
/**
*表格的双击事件处理
**/
function bill_ongriddblclick(sXml){
	sXml=RepStr(sXml,":::","'");
	//判断在表头和表格的滚动条上双击时应不起作用
	var o=NavJs.getEventObj();
	//alert(o.tagName)
	var stag=o.tagName.toUpperCase();
	
	if((stag=="INPUT" && o.id != "txtMyGrid") || stag=="DIV") return;
	if(stag=="TD"){
		if(o.parentNode.rowIndex<1 || o.cellIndex<1)return;
	}
	
	LoadMod("noempty","gridclick",sXml);
}
function getGridUseEvent(){
    ///通过事件取当前grid对象
    if(NavJs.getEvent() == null) return null;
    var e = NavJs.getEventObj();
    while(e=e.parentNode){
        if (e.tagName == "webgrid" || e.tagName == "fc:webgrid") {
            return e;
        }
    }
    return null;
}
/**
*另存Excel文件
*@date 2003-11-30
**/
function SaveAsExcel(){
	var odssub1=Getdssub1();
	if(odssub1 == null){
		alert("界面上没有绑定到数据集的grid控件!");
		return;
	}
	var oSKBILLgrid1=GetDsGrid(odssub1);
	if(oSKBILLgrid1 == null){
		alert("界面上没有绑定到数据集的grid控件!");
		return;
	}
	
	var sRet=window.showModalDialog(fcpubdata.path+"/fceform/common/saveasexcel.htm",s1,"status:no;dialogHeight:120px;dialogWidth:400px;dialogTop:180;dialogLeft:250px"); 
	if(typeof sRet=="undefined") return;
	var s1=sRet+".csv";
	
	oSKBILLgrid1.SaveExcel(s1,oSKBILLgrid1.tab.outerHTML);
	//alert("报表成功的另存到"+s1)
}
/**
表格多选,一般来说挂在表格的dblclick事件上使用
*@date 2004-04-15
**/
function GridMultiSel(ogrid){
	var grid,dsSel;
	if(typeof ogrid =="undefined"){
		var odssub1=Getdssub1();
		if(odssub1 == null){
			alert("界面上没有绑定到数据集的grid控件!");
			return;
		}
		var oSKBILLgrid1=GetDsGrid(odssub1);
		if(oSKBILLgrid1 == null){
			alert("界面上没有绑定到数据集的grid控件!");
			return;
		}
	
		//指定第一个表格
		grid=oSKBILLgrid1;
	}else {
		grid = ogrid;
	}
	dsSel = $obj(grid.dataset); //eval("window."+grid.dataset);
	//
	
    var sok="url("+fcpubdata.path+"/fceform/images/ef_run_grid_gou.gif)";
 	var r=grid.curTD.parentNode.rowIndex;
 	if(r>0){
 		if(grid.tab.rows[r].cells[0].style.backgroundImage==sok){
 			grid.tab.rows[r].cells[0].style.backgroundImage="";
 			grid.tab.rows[r].cells[0].style.backgroundRepeat = "no-repeat";
 			NavJs.setClassName(grid.tab.rows[r],"");
 		}else{
 			grid.tab.rows[r].cells[0].style.backgroundImage=sok;
 			grid.tab.rows[r].cells[0].style.backgroundRepeat = "no-repeat";
 			NavJs.setClassName(grid.tab.rows[r],"invert");
		}
 	}
    
    //在数据集上做标记
    if(dsSel.oDom.documentElement.childNodes[dsSel.RecNo].getAttribute("multisel")!="是"){
    	dsSel.oDom.documentElement.childNodes[dsSel.RecNo].setAttribute("multisel","是");
    }else{
    	dsSel.oDom.documentElement.childNodes[dsSel.RecNo].setAttribute("multisel","");
 	}
}
/*
将数据集中的数据刷新到表格
*@param ogrid 表格对象
*@param multirow ="否" 表示刷新单行,否则为刷新多行
*@date 2004-06-10
*/
function DsToGrid(ogrid,multirow){
   	var ds=$obj(ogrid.dataset);
   	if( multirow == "否") {
   		ds.fset_cont();
   		ogrid.moveedit(); 
   		return	;
   	}
   	
   	//alert(ds.RecordCount)
   	ogrid.Rows=ds.RecordCount+1;
   	
   	ds.dset_cont();
   	ogrid.moveedit();
   	ds.dset_fset();
   	ds.ReSum("只算fset");
    ds.fset_cont1();
    ds.bAdd=false;
    ds.bEdit=false;
    ogrid.EndRowState="edit";
    //ogrid.lostfocustd=null
    ogrid.SetFocus(ogrid.curTD,"程序给焦点");
    ogrid.MoveDataSet();
    //ogrid.curTD.focus();
   	//alert(ds.xml);
}

/**
*将当前查询的条件保存起来.
先出一对话框供输入查询名称,收集DsMain中的条件值成一个字串.将它保存到billquery表中
*@date 2004-02-10
**/
/*function SaveUserQuery(){
	var	sRet=window.showModalDialog(fcpubdata.path+"/fceform/common/inputmsg.htm","请输入查询名称:","status:no;dialogHeight:105px;dialogWidth:470px;dialogTop:180;dialogLeft:250px"); 
	if(isSpace(sRet)) return;
	var sFilter="";
	for(var i=0;i<DsMain.FieldCount;i++){
		sFilter+="DsMain.Field("+i+").Value='"+DsMain.Field(i).Value+"';";
	}
	var sInsert="Insert billquery (squeryname,djsn,sfilter) values ('"+sRet+"','"+fcpubdata.area.getAttribute("dj_sn")+"','"+escape(sFilter)+"')";
	var sR=fc_insert(sInsert);
	if(isSpace(sR)){
		alert("保存成功!");
	}else{
		alert(sR);
	}
}*/
/**
*用于在表格删除多行。
*@param ogrid当前表格控件
*@date 2005-02-02
**/
function GridMultiDel(ogrid){
	var grid,dsSel;
	if(typeof ogrid =="undefined"){
		//指定第一个表格
		grid=$obj("grid1");
	}else {
		grid = ogrid;
	}
	dsSel=$obj(grid.dataset);
	for (var i=dsSel.RecordCount-1;i>=0;i--){
		if(dsSel.oDom.documentElement.childNodes[i].getAttribute("multisel")=="是")	{
			dsSel.RecNo=i;
			dsSel.Delete();	
		}
	}	
}
/**
*由数据集找到当前界面上它绑定的第一个表格控件
*@param ods 数据集对象
*@return 所绑定的表格对象.如无则返回null
*@date 2005-06-15
**/
function GetDsGrid(ods) {
   var o=NavJs.getGridArr();
   for(var ii=0;ii<o.length;ii++){
        if (o[ii].getAttribute("dataset") == ods.id){
            return $obj(o[ii].id);
        }
   }
   return null;

}
/**
*grid控件由表格的列号得到字段名
*@para oGrid 表格对象
*@para colno 表格列号
*@return 所对应的字段名
*@date 2006-03-07
**/
function GridColNoToFieldName(oGrid,colno) {
	//var colno = grid1.Col ;
	colno = ToInt(colno);
	var dscolno = oGrid.tab.childNodes[0].childNodes[colno].getAttribute("dsfield") ;
	dscolno = ToInt(dscolno);
	var oDs = $obj(oGrid.dataset);
	return oDs.FieldNoToName(dscolno) ;
}
/**
* 动态设置grid的col 的隐藏,先假定列是显示的,只能做col隐藏,而无法做col显示
*@para dsGrid grid所绑定的数据集对象
*@para sFieldList 要隐藏的字段名列表 用,分隔 
*@date 2009-10-19
**/
function SetGridColHide(dsGrid,sFieldList){
    var isChange = false;
    sFieldList = sFieldList.toLowerCase();
    var arr = sFieldList.split(",");
    
    var o=NavJs.getGridArr();
	for(var ii=0;ii<o.length;ii++){
	    if (o[ii].getAttribute("dataset") == dsGrid.id){
	        var sFormatXml = o[ii].getAttribute("format") ;//o[ii].formatDataBak;
	        
            var oXml=SetDom(sFormatXml);
            for(var i =0;i<arr.length;i++){
                for (var j = oXml.documentElement.childNodes.length - 1; j >= 0; j--) {
                    var fdname = NavJs.getNodeValue11(oXml,j,0);
                    fdname = fdname.toLowerCase();
                    if(fdname == Trim(arr[i]) ){
                            removePropNode(o[ii],oXml,j);
                            SetDsFieldHide(dsGrid,fdname);
                            isChange = true;

                    }                    
                }
                
            }
            o[ii].setAttribute("format" , NavJs.xml(oXml.documentElement));	        
        }
    }
    if(isChange) dsGrid.xml = NavJs.xml(dsGrid.oDom.documentElement);
    dsGrid.base_dset();
 
    function SetDsFieldHide(oDs,fieldName){
        var oXml = oDs.oDom.documentElement.childNodes[oDs.oDom.documentElement.childNodes.length-1].childNodes[1];
        for (var i = 0; i < oXml.childNodes.length; i++) {
            if(NavJs.getNodeValue11(oXml,i,0).toLowerCase() == fieldName ){
                NavJs.textContent(oXml.childNodes[i].childNodes[15], "否");
            }
        }
    }
    function removePropNode(oGrid,oXmlFormat,nodeNo){
        oXmlFormat.documentElement.removeChild(oXmlFormat.documentElement.childNodes[nodeNo]);
        var s_onclick = oGrid.onclick.toString();
        s_onclick = removeEventNode(s_onclick);
        s_onclick = 'bill_ongridclick(\"'+s_onclick+'\")';
        oGrid.onclick = s_onclick;
        
        var s_ondblclick = oGrid.ondblclick.toString();
        s_ondblclick = removeEventNode(s_ondblclick);
        s_ondblclick = 'bill_ongriddblclick(\"'+s_ondblclick+'\")';
        oGrid.ondblclick = s_ondblclick;
        var s_onkeydown = oGrid.onkeydown.toString();
        s_onkeydown = removeEventNode(s_onkeydown);
        s_onkeydown = 'bill_ongridkeydown(\"'+s_onkeydown+'\")';
        oGrid.onkeydown = s_onkeydown;

        function removeEventNode(s_onclick){
            var iStart = s_onclick.indexOf("<");
            var iEnd = s_onclick.lastIndexOf(">");
            s_onclick = s_onclick.substring(iStart,iEnd);
            var oXml = SetDom(s_onclick);
            if(oXml.documentElement != null && oXml.documentElement.childNodes.length > nodeNo){
                oXml.documentElement.removeChild(oXml.documentElement.childNodes[nodeNo]);
                return oXml.documentElement.xml;
            }
            return s_onclick;
        
        }
    }
}


/**
* 动态设置grid的col 的只读,编辑框等属性
*@para dsGrid grid所绑定的数据集对象
*@para fieldName 要设置的字段名
*@para xmlValue 要设置的xml格式值, ="" 表示只读, ="<str></str>" 表示编辑框 
*@date 2009-10-19
**/
function SetGridColProp(dsGrid,fieldName,xmlValue){
    if (typeof (xmlValue) == "undefined") xmlValue = "";
    var o=NavJs.getGridArr();
	for(var ii=0;ii<o.length;ii++){
	    if (o[ii].getAttribute("dataset") != dsGrid.id) continue;
	    var colNo = dsGrid.FieldNameToColNo(o[ii],fieldName);
	    if(typeof(colNo) != "undefined")
	        o[ii].SetCol(colNo,xmlValue);
    }
 
}
/**
* 给数据集的前面加上多选列. 2010-09-08 add test
**/
function addCheckBoxCol(ogrid,sql,callback) {
    var oDs = $obj(ogrid.dataset);
    var oSql = new Object();
    oSql.sql = sql;
    oSql.datasourceName = oDs.datasourceName;
    dataset_select(oSql, oDs.PageNo, oDs.PageSize, oDs.HideField, function(result) {
        var sXml = result.value;

        var pos = sXml.lastIndexOf("</pages><fields><field>");
        var sField = "<field><fieldname>sel_checkbox</fieldname><datatype>字符</datatype><displaylabel>选</displaylabel><size>10</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target></target><href></href><visible>是</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field>";
        if (pos >= 0) {
            var sHead = sXml.substring(0, pos + 16);
            sHead = RepStr(sHead, "<tr><td>", "<tr><td></td><td>");
            sXml = sHead + sField + sXml.substring(pos + 16, sXml.length);

        }

        var oDs = result.context;
        oDs.OpenXmlData(sXml);
        ogrid.SetCheckBoxCol(1);
        ogrid.tab.childNodes[0].childNodes[1].style.width = "22px";
        if (typeof (callback) == "function") callback();
        ogrid.HScroll();
    }, oDs)		

}

