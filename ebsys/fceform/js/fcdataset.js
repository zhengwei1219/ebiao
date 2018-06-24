///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

Eapi.DataSet = function(){}
Eapi.DataSet.prototype =
{
	getEditedData : function(oDs){
		var oList = oDs.oDom.documentElement.selectNodes("//tr[@rowstate='edit' ]")	; // or @rowstate='add'
		if(oList == null) return;
		var s =new Sys.StringBuilder() ;
		for(var i=0;i<oList.length;i++){
			s.append(NavJs.xml(oList[i]));
		}
		//加上删除的数据
		//s.append(dataset1.DeletedData);
		return s.toString();
	
	},
	actionEditedData : function(oDs,callback){
		var oList = oDs.oDom.documentElement.selectNodes("//tr[@rowstate='edit' ]")	; // or @rowstate='add'
		if(oList == null) return;
		for(var i=0;i<oList.length;i++){
			callback(oList[i]);
		}
	
	},
	getChangeData : function (dataset1){
        ///取数据集中变动了的数据
	    var oList = dataset1.oDom.documentElement.selectNodes("//tr[@rowstate='edit' or @rowstate='add']")	;
	    if(oList == null) return;
	    var s =new Sys.StringBuilder() ;
	    for(var i=0;i<oList.length;i++){
		    s.append(NavJs.xml(oList[i]));
	    }
	    return s.toString();
    },
	actionChangeData : function(oDs,callback){
		var oList = oDs.oDom.documentElement.selectNodes("//tr[@rowstate='edit' or @rowstate='add' ]")	; // or @rowstate='add'
		if(oList == null) return;
		for(var i=0;i<oList.length;i++){
			callback(oList[i]);
		}
	
	},
    copyDataset : copydataset ,
    copyDatasetSel : copydatasetsel ,
    dsBeforeSave : DsBeforeSave 


}
Eapi.DataSet.registerClass("Eapi.DataSet");


/**
*执行查询,直接由一个SQL语句来得到查询结果和字段信息
*@param sSql sql语句
*@param PageNo 页码
*@param PageSize 页尺寸,即一页含多少行
*@param sfieldset 以,分隔的字段集
*@return 查询结果
**/
function dataset_select(oSql, PageNo, PageSize, sfieldset, callback, context) {
    
    var oDsn = new Eapi.Str().getDsnSql(oSql);
    
    var fsql="";
    if(fcpubdata.dbStruDict == "FC_FLDLIST" ){
	  	  var  tmpsql1 = "select chnname,fdsize,fddec from FC_FLDLIST where ";
	  	  if(fcpubdata.databaseTypeName == "oracle"){
	  	  	tmpsql1 += "UPPER(fdname)='GET_FIELD_NAME_FLAG' " ;
	  	  }else{
	  	  	tmpsql1 += "fdname='GET_FIELD_NAME_FLAG' " ;  //GET_FIELD_NAME_FLAG 为后台程序的替换标志,
	  	  }        
        fsql = tmpsql1 ;
    }else if(fcpubdata.dbStruDict == "FC_DBSTRU"){
        fsql = "select chnname,fdsize,fddec from FC_DBSTRU where fdname='GET_FIELD_NAME_FLAG'";
    }else if(fcpubdata.dbStruDict == "FC_ENTITY"){
        fsql = "select chnname,fdsize,fddec from FC_ENTITYSUB where fdname='GET_FIELD_NAME_FLAG'";
    }
    
	//替代非法XML字符
	var sXml="<sql>"+RepXml(oDsn.sql)+"</sql>"+"<pageno>"+PageNo+"</pageno>"+"<pagesize>"+PageSize+"</pagesize>"+"<fset>"+sfieldset+"</fset>"+"<fieldsql>"+fsql+"</fieldsql>";
	
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=dataset_select"+oDsn.dsn,sXml,callback,context);
	return retX;
}
/**
*复制数据集,将源数据集的当前记录值按同名字段复制的方式给目的数据集
*@param dsSour 源数据集
*@param dsDest 目的数据集
*@param notCopyFieldName 不需要copy的字段名,一般为ID字段
*@date 2003-08-05
**/
function copydataset(dsSour, dsDest, notCopyFieldName) {
    //dsSour = eval(dsSour.id);
    //dsDest = eval(dsDest.id);
	var fName ;
	if(typeof(notCopyFieldName) == "undefined") 
	    fName="";
	else
	    fName = notCopyFieldName.toUpperCase();
	    
	for(var i=0;i<dsSour.FieldCount;i++){
		var s1=dsSour.Field(i).FieldName ;
		if(s1.toUpperCase() != fName ){
			//try{
			if(dsDest.isFieldName(s1))
				dsDest.Field(s1).Value=dsSour.Field(i).Value;
			//}catch(e){}
		}
	}
}
/**
*复制数据集,将源数据集的所有选择了的记录值按同名字段复制的方式给目的数据集
*@param dsSour 源数据集
*@param dsDest 目的数据集
*@param isNewSel 新旧两种表格行的选中方式
*@param sNoRepeat = "不重复" 表示返回不要重复的行。
*@date 2003-12-12
**/
function copydatasetsel(dsSour,dsDest,isNewSel,sNoRepeat){
    var arrSour = new Array();
	var arrDest=new Array();
	var k = 0, i, j;
	if (sNoRepeat == "不重复") {
	    var sourkeyfieldNo = -1; //源数据集主键字段所在顺序号，
	    var keyfieldNo = dsDest.FieldNameToNo(dsDest.firstKeyFieldName); //主键字段所在顺序号，
	    var sb = new Sys.StringBuilder();
	    for (var i = 0; i < dsDest.RecordCount; i++) {
	        sb.append(NavJs.getNodeValue11(dsDest.oDom, i, keyfieldNo));
	        sb.append(",");
	    }
	    var sKeyFieldValue = sb.toString();
	    
	}

	for (i = 0; i < dsSour.FieldCount; i++) {
	    if (!IsSpace(dsDest.firstKeyFieldName) && dsSour.Field(i).FieldName.toUpperCase() == dsDest.firstKeyFieldName.toUpperCase()) sourkeyfieldNo = i;
		for( j=0;j<dsDest.FieldCount;j++){
			if(dsDest.Field(j).FieldName.toUpperCase()==dsSour.Field(i).FieldName.toUpperCase()){
				arrSour[k]=i;
				arrDest[k]=j;
				k++;
				break;	
			}
		}
	}
	var tmpB=false;
	if(k>0){
	    for (i = 0; i < dsSour.RecordCount; i++) {
	        if (sNoRepeat == "不重复" && sourkeyfieldNo != -1 && sKeyFieldValue.indexOf(dsSour.oDom.documentElement.childNodes[i].childNodes[sourkeyfieldNo].text) >= 0) continue; 
	        
			if((isNewSel && NavJs.getNodeValue11(dsSour.oDom,i,0) == "是") || ( IsSpace(isNewSel) && dsSour.oDom.documentElement.childNodes[i].getAttribute("multisel")=="是")){
				//控制第一次不加行.
				//alert("recno:"+dsDest.RecNo)
				var iTmp=dsDest.RecNo;
				if(tmpB){
					dsDest.Append("强行加一行");
					iTmp=dsDest.oDom.documentElement.childNodes.length-2;
				}
				for (j = 0; j < k; j++) {
					NavJs.textContent(dsDest.oDom.documentElement.childNodes[iTmp].childNodes[arrDest[j]],NavJs.textContent(dsSour.oDom.documentElement.childNodes[i].childNodes[arrSour[j]]));
				}
				tmpB=true;
				//计算 实际计算项的公式
				dsDest.LineSum(null,iTmp);
			}
		}
		//CopyToPub(dsDest.xml)
		return tmpB;	
	}else {return false;}
}
/**
* 取数据集选中行的某列的值,用逗号分隔.2011-06-13
**/
function getDsMultiSelValue(dsSour, colNo, isNewSel) {
    var sb = new Sys.StringBuilder();
    for (var i = 0; i < dsSour.RecordCount; i++) {
        if ((isNewSel && NavJs.getNodeValue11(dsSour.oDom, i, 0) == "是") || (IsSpace(isNewSel) && dsSour.oDom.documentElement.childNodes[i].getAttribute("multisel") == "是")) {
            sb.append(NavJs.getNodeValue11(dsSour.oDom,i,colNo));
            sb.append(",");
            
        }
    }
    var sRet = sb.toString();
    if (IsSpace(sRet) == false) sRet = sRet.substring(0, sRet.length - 1);
    return sRet;
}
/**
* 设置多选时,表格的选中状态 2011-06-14
**/
function setDsMultiSelValue(dsSour, colNo, sValue) {
    
    if(IsSpace(sValue)) return;
    var arr = sValue.split(",");
    for (var i = 0; i < dsSour.RecordCount; i++) {
        for (var j = 0; j < arr.length; j++) {
            if(NavJs.getNodeValue11(dsSour.oDom,i,colNo) == arr[j]) NavJs.textContent(dsSour.oDom.documentElement.childNodes[i].childNodes[0], "是");
            
        }
    }
}

/**
*数据集上的各个事件的处理函数
*@param eventname 为数据集的事件名称,例如AfterOpen,字符型
*@param eventfunction 为此事件所对应的处理函数标志,字符型
*@return 无 
**/
function bill_dsevent(eventname,eventfunction){
    LoadMod(eventfunction,"clickmenu");
}
//数据集的Valid事件
function bill_ondatasetvalid(event, sXml) {
//ogrid为表格对象
/*  sXml格式:
  <dsid>
    <col>zl_select_100</col>
    <col></col>
  </dsid>
*/
    //sXml="<DsMain><shl>alert('shlvalid')</shl><col></col></DsMain>"
    if (arguments.length == 1) { //兼容旧的表单调用htc文件而加
        sXml = event;
        event = window.event;
    }
   var oXml=SetDom(sXml);
   var iLen=oXml.documentElement.childNodes.length;
   if(iLen>0){ 
			//根据列号得到相同的命令      
			   //var oDs=eval(oXml.documentElement.tagName)
			   //当前字段名

               if (event == null) var curFieldName = "null";
               else
                   var curFieldName = event.FieldName;
               if (curFieldName == null || typeof curFieldName == "undefined") curFieldName = "null";
			   var oNode = oXml.documentElement.selectSingleNode(curFieldName) ;
			   if(IsSpace(oNode) == false){
			       var sKey = NavJs.textContent(oNode);
			       //此处应统一调用有效性检查之类的大函数,
			       
					sKey = "try {"+sKey+"}catch (e) {event.returnValue=e.description;}";
					eval(sKey);
					//NavJs.insertEventParam(sKey);
			   }
	}
   
}
/**
*数据集的回写数据事件
*@date 2003-11-25
**/
function bill_ondatasetsettext(event, sXml) {
//ogrid为表格对象
/*  sXml格式:
  <dsid>
    <col>zl_select_100</col>
    <col></col>
  </dsid>
*/
   //sXml="<DsMain><shl>alert('shlvalid')</shl><col></col></DsMain>"
    if (arguments.length == 1) { //兼容旧的表单调用htc文件而加
        sXml = event;
        event = window.event;
    }

   var oXml=SetDom(sXml);
   var iLen=oXml.documentElement.childNodes.length;
   if(iLen>0){ 
		if(event.FieldName==""){ //运行所有字段
			for(var i=0;i<iLen;i++){
			    eval(NavJs.getNodeValue1(oXml, i));
			    
				
			}
		
		}else{
   	
			//根据列号得到相同的命令      
			   //当前字段名 
			   
			   var curFieldName=event.FieldName;
			   var oo = oXml.documentElement.selectSingleNode(curFieldName);
			   if(oo != null){
					var sCommand=oo.text;
					//此处应统一调用有效性检查之类的大函数,
					eval(sCommand);
					
			   }
		}
	}
   
}
/**
直接修改数据集中的数据
@date 2004-06-17
**/
function EditDs(dssub1, fieldname, fieldvalue) {
    
	var colno=dssub1.FieldNameToNo(fieldname);
	var ii = dssub1.RecNo;
	NavJs.textContent(dssub1.oDom.documentElement.childNodes[ii].childNodes[colno],fieldvalue) ;
	dssub1.oDom.documentElement.childNodes[ii].setAttribute("rowstate","edit") ;
}	
/**
*复制fset中的字段值到数组中
*@para oDs 数据集对象
*@return 返回一个数组
*@date 2006-03-11
**/
function CopyFieldsToArr(oDs) {
    
	var arr = new Array() ;
	var ll = oDs.FieldCount;
	for(var i=0;i<ll;i++){
		arr[i]=oDs.Field(i).Value ;
	}
	return arr ;
}
/**
*复制数组到fset中的字段值中
*@para oDs 数据集对象
*@para arr 数组
*@date 2006-03-11
**/
function CopyArrToFields(oDs, arr) {

    var ll = oDs.FieldCount;
	for(var i=0;i<ll;i++){
		oDs.Field(i).Value = arr[i] ;
	}
	
}
/**
* 表格控件保存前的处理
*@param oDs 数据集对象
*@param oGrid1 对应的表格对象
*@return true 表示检查没通过,应退出保存
*@date 2006-12-08
**/
function DsBeforeSave(oDs,oGrid1,isNotAlert) {
	var oGrid = oGrid1;
	if(typeof oGrid1 == "undefined"){
		oGrid = GetDsGrid(oDs);
    }
    
	if (oGrid.txt.style.display != "none") {
		oDs.cont_onDataChange();
	}
	if(oDs.Update("提示错误信息")!="") 
	    return true;
	else
        return false;
}

/**
* 2009-11-11取数据集的sql的where语句的id值
*@param oDs 数据集对象
*idField id字段
**/
function getListFormIdValue(oDs, idField) {
    var oXml = SetDom(oDs.format);
    if (oXml.documentElement == null) return "";
    var oNode = oXml.documentElement.selectSingleNode("//field[fieldname='" + idField + "']");
    if (oNode == null) return "";

    var fieldType = NavJs.textContent(oNode.childNodes[1]);


    var sRet = "";
    if (IsSpace(fcpubdata.obj)) {
        if (fieldType == "整数" || fieldType == "实数") sRet = "0";
    } else {
        sRet =fcpubdata.obj.Field(idField).Value;
        if ((fieldType == "整数" || fieldType == "实数") && sRet == "") sRet = "0";
    }
    return sRet;
}
/**
* 从URL上取到ID字段(整数型时)的值,在数据集的SQL语句中用
**/
function getUrlIdValue(idFieldName) {
    var svalue = $urlParam(idFieldName);
    if (IsSpace(svalue)) svalue = "0";
    return svalue;
}
/**
 * 前台需要做一个两个XML串的数据集的记录拼成一个的函数: OpenDsAddSql
 	* 输入参数: oDs,已有的Xml记录串,SQL语句. 要求SQL语句中有:v_get标识,用于替换条件串.
 			oDs中的第一个字段应为ID字段,SQL语句中第一个输出的字段应为以此为关联的ID字段.
 	* 处理过程: 先找到oDs第一个字段的字段名及字段类型,在已有的Xml记录串中循环得到SQL语句中的 in ()部分,
 		    由它替换SQL语句,然后将SQL语句执行SelectSql函数,返回一个XML串.在已有的Xml记录串中循环,
 		    利用XPATH查找新生成的XML串,将它加上.然后用新的合并后的XML串来重新打开oDs.	
* 2011-12-07 
**/
function OpenDsAddSql(oDs,sXml,sql) {
    var sType = oDs.Field(0).DataType;
    var sQuot = "'";
    if (sType == "整数") sQuot = "";
    var oXml = SetDom("<root>" + sXml + "</root>");
    
    if (oXml.documentElement == null) {
        return;
    }
    var sb = new Sys.StringBuilder();
    var len = oXml.documentElement.childNodes.length;
    if (len == 0) return;
    
    for (var i = 0; i < len; i++) {
        sb.append(sQuot);
        sb.append(NavJs.getNodeValue11(oXml,i,0));
        sb.append(sQuot);
        if(i<len-1) sb.append(",")
    }
    var newsql = RepStr(sql, ":v_get", sb.toString());
    var sXmlAdd = SelectSql(newsql, 1, -1);
    var oXmlAdd = SetDom(sXmlAdd);
  
    if (oXmlAdd.documentElement == null) {
        alert(sXmlAdd);
        return;
    }
    
    var sbAll = new Sys.StringBuilder();
    for (var i = 0; i < len; i++) {
        _add_two_xml(sbAll,oXml,oXmlAdd,i);
    }
	var ss = oDs.xml;
	var pos = ss.indexOf("<set><pages>");
	if (pos>=0){
		ss = ss.substring(pos,ss.length);	
	}else{
		ss = ss.substring(6,ss.length); //去掉<root>
	}
	ss= "<root>"+sbAll.toString()+ss;

	oDs.OpenXmlData(ss);    
	
    
    function _add_two_xml(sbAll,oXml,oXmlAdd,i) 
    {
        var s1 = NavJs.xml(oXml.documentElement.childNodes[i]);
        s1 = s1.substring(0, s1.length - 5); //去掉后面的 </tr>
        
        sbAll.append(s1);
        //var sName = oXmlAdd.documentElement.childNodes(0).childNodes(0).nodeName;

        //var oNode = oXmlAdd.documentElement.SelectSingleNode("//record[" + sName + "=" + oXml.documentElement.childNodes(i).childNodes(0).text+"]");
        var sId = NavJs.getNodeValue11(oXml,i,0);
        var k=0;
        for (k = 0; k < oXmlAdd.documentElement.childNodes.length - 1; k++) {
            if (NavJs.getNodeValue11(oXmlAdd,k,0) == sId) break;
        }
        
        if (oXmlAdd.documentElement.childNodes.length > 0) {
            var len1 = oXmlAdd.documentElement.childNodes[0].childNodes.length;
            for (var j = 1; j < len1; j++) {
                sbAll.append("<td>");
                if (k < oXmlAdd.documentElement.childNodes.length - 1) {
                    sbAll.append(NavJs.getNodeValue11(oXmlAdd, k, j));
                }
                sbAll.append("</td>");
            }
        }
        sbAll.append("</tr>");
    }
    
}