///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />
///<reference path="/ebsys/fceform/js/fcebiao.js" />

Eform.ToRun = function(){}
Eform.ToRun.prototype =
{
    designStrRunStr : DesignStr_RunStr ,
    designStrRunStrBefore : DesignStr_RunStr_Before ,
    transAttr : TransAttr ,
    openControlNo : OpenControlNo ,
    quotXml : quot_xml ,
    quot42 : quot_42 ,
    transSql : TransSql ,
    hideListBoxSave : HideListBoxSave ,
    designStrRunStrAfter : DesignStr_RunStr_After 
}
if(Type.parse("Eform.ToRun") == null) Eform.ToRun.registerClass("Eform.ToRun");

/**
*测试运行表单时要计算运行串,此函数只在djempty.htm一个地方调用了.
*@param sDesign 从文件中读出的整个设计串
*@date 2004-12-25
**/
function DesignStr_RunStr(sDesign){
    
	var pstrUserFunction="";
	var pstrAddHtml=""; //保存当前表单的附加页面元素的内容
	var pstrSplitAddHtml= "<p id=splitaddhtml />" ;
	var sHtm="";
	var sRet=sDesign ; //整个设计串
	var bRunDjFile = false ; //为true表示从djempty.htm中运行此函数
	var iEnd=sRet.indexOf("</scr"+"ipt>") ;
	if(iEnd==-1){
		pstrUserFunction="";
		sHtm=sRet;
	}else{
		var sHtm=sRet.substring(iEnd+9,sRet.length) ;
		if(isSpace(sHtm)){
			return "";
		} 
		pstrUserFunction=sRet.substring(8,iEnd) ;
		pstrUserFunction=unRepNewLine(unRepXml(pstrUserFunction));
	}
	//求 附加页面串
	var ipos=sHtm.indexOf(pstrSplitAddHtml);
	if(ipos==-1){
		pstrAddHtml="";
		
	}else{
		pstrAddHtml=sHtm.substring(ipos+pstrSplitAddHtml.length,sHtm.length);	
		sHtm=sHtm.substring(0,ipos);
	}
	if(sHtm == "") return "";
	document.write("<div id=bigmain>" + sHtm + "</div>");
	fcpubdata.area = $id("SKbillsheet");
	if(oContXml == null){ //从djempty.htm中运行时
		//bRunDjFile = true;
		//fcpubdata.area.contxml="";
		//if(IsSpace(fcpubdata.area.contxml)){
		//	TooContXml();
		//}else{
			oContXml = SetDom(fcpubdata.area.contxml);
		//}
	}

	DesignStr_RunStr_Before(fcpubdata.area);
	
	fcpubdata.area.removeAttribute("contentEditable");
	fcpubdata.area.removeAttribute("unselectable");
	
	//由设计转为运行串
	var sRun=fcpubdata.area.outerHTML;

	sRun=DesignStr_RunStr_After(sRun);

	
	
	//运行串=函数串+处理后的设计串+附加页面串	
	sRun="<scr"+"ipt>"+pstrUserFunction+"</scr"+"ipt>"+sRun+pstrAddHtml;
	
	//清空
	$id("bigmain").outerHTML="";
	document.write(sRun);
	return sRun;


}

/**
*由设计串生成运行串时,在取 SKbillsheet.outerHTML 之前调用
**/
function DesignStr_RunStr_Before(SKbillsheet) {
	//处理href
    var o = window.document.getElementsByTagName("a");
	var l=o.length;
	for (var i = 0; i < l; i++) {
	    if (IsSpace(o[i])) continue;
		if(isSpace(o[i].getAttribute("href1")) == false){
		    o[i].href = o[i].getAttribute("href1");
		}else{
			var s = o[i].href.toLowerCase() ;
			var s1 = location.protocol+"//"+location.host+ fcpubdata.path ;
			s1 = s1.toLowerCase();
			if(s.indexOf(s1)==0){
				o[i].href ="../.."+ s.substring(s1.length,s.length);
			}
		}
	}			
	
	//处理img
		changesrc("dataset","../images/ef_designer_dataset.gif");
		changesrc("grid","../images/ef_designer_webgrid.gif");
		changesrc("page", "../images/ef_run_page.gif");
		changesrc("spin","../images/ef_designer_numedit.gif");		
		changesrc("dropdownlist","../images/ef_designer_fccode.gif");	
		changesrc("tree","../images/ef_designer_tree.gif");	

	//处理img
	var o = window.document.getElementsByTagName("img");
	var l=o.length;
	for (var i = 0; i < l; i++) {
	    if (IsSpace(o[i])) continue;
		var s = o[i].src.toLowerCase() ;
		var s1 = location.protocol+"//"+location.host+ fcpubdata.path ;
		s1 = s1.toLowerCase();
		if(s.indexOf(s1)==0){
			o[i].src = "../.."+s.substring(s1.length,s.length);
		}
	}			
		
	//处理Shape
	var o = window.document.getElementsByTagName("line");
	var l=o.length;
	for (var i = 0; i < l; i++) {
	    if (IsSpace(o[i])) continue;
		o[i].onresize = ""	;	
	}

	//自定义控件从36开始
	for (var k = 36; k < ArrName.length; k++) {
	    var oNode = oContXml.documentElement.selectSingleNode("/root/" + ArrName[k]);
	    if (oNode != null) {
	        var oo = new Eform.AllWidget().getDesignObj(ArrName[k]);
	        oo.toRunBefore();


	    }
	}
	
	function changesrc(comType,srcPath) {
		var oNode = oContXml.documentElement.selectSingleNode(comType) ;
		if(oNode != null ){
			var l=oNode.childNodes.length;
			for (var i = 0; i < l; i++) {
				var obj = $id(NavJs.textContent(oNode.childNodes[i]));
				obj.src=srcPath;
			}
		}
	}
	

}

/**
 * 功能：转换控件的自定义属性
 * 日期：2008-01-04
**/
function TransAttr(obj)
{
	if (IsSpace(obj.getAttribute("CustomAttr")) == false)
	{


	    var sAttr = obj.getAttribute("CustomAttr");
		var re = /\r\n/g;
		sAttr = sAttr.replace(re," ");
		
		/*var rep = 'CustomAttr="'+sAttr+'"';
		obj.outerHTML = obj.outerHTML.replace(rep,sAttr);
		*/
		
		var sindex = obj.outerHTML.indexOf("CustomAttr=");
		
		var sBebore = obj.outerHTML.substring(0,sindex);
		var sEnd = obj.outerHTML.substring(sindex,obj.outerHTML.length);
		obj.outerHTML = sBebore + " " + sAttr + " " + sEnd;
		obj = $id(obj.id);
		obj.removeAttribute("CustomAttr");
		
	}
	return obj;
}
//在转运行串时:在SKbillsheet中保存一个xml串的自动布局,
//有控件id和设置值两列, 且按计算顺序排好了的.
//liuxr 2008-9-24
function ResizeXml()
{
	var iLen = oContXml.documentElement.childNodes.length
	var arrResize = new Array();				//没有排序的控件
	var arrResizeOrder = new Array();			//排序好的控件及布局属性
	
	var ii = 0;
	for(var i=0; i<iLen; i++)
	{
		var oSub = oContXml.documentElement.childNodes[i];
		for(var j=0;j<oSub.childNodes.length;j++) {
			var sId = NavJs.textContent(oSub.childNodes[j]);
			var oId = $id(sId);
			if(oId == null) continue;
			
			if (isSpace(oId.getAttribute("AutoSizeXml")) == false) 
			{
				
				//arrResize[sId] = oId.AutoSizeXml;
				arrResize[ii] = sId;
				ii++;
							
			}
		}
	}
	if(ii == 0) return "";
	//arrResizeOrder = ResizeArrOrder(arrResize);	
	return ResizeArrOrder(arrResize);
	 	
}

//重新排序数组
//added by liuxr at 2008-9-26
function ResizeArrOrder(arr)
{
	var arrNew = new Array();
	var strXml = "";
	var ii =0;
	//for (var skey in arr)
	for (var kk=0;kk<arr.length;kk++)
	{
		if(IsSpace(arr[kk])) continue;
		var parentObj = $id(arr[kk]).parentNode; 	//父对象,将parentElement 改为 parentNode,多处
		
		//循环找上级节点
		var tmpArr = new Array();
		
		tmpArr[0] = arr[kk];
		tmpArr[1] = parentObj.id;
		var i = 1;
		while(parentObj.id != "SKbillsheet")
		{
			i++;
			parentObj = parentObj.parentNode;
			if (IsSpace(parentObj.id)) parentObj = parentObj.parentNode; //考虑tab控件有一层是没有ID的,所以MY加了此行.
			if (!IsSpace(parentObj.id) && parentObj.id != "SKbillsheet") //!IsSpace(parentObj.id) && 2013-05-15 my add
				tmpArr[i] = parentObj.id;
		}
		
		var ilen = tmpArr.length;
		for(var j=ilen-1;j>=0;j--)
		{
			if (arr.toString().indexOf(tmpArr[j])>=0)
			{
				//arrNew[ii] = tmpArr[j];
				//ii++;
				//arrNew[tmpArr[j]] = $id(tmpArr[j]).AutoSizeXml;
			    strXml += $id(tmpArr[j]).getAttribute("AutoSizeXml");
				arr = arrRemove(arr,tmpArr[j]);
			}
		}
		
	}
	//return arrNew;
	return strXml;
}

//去掉数据组中指定的项
function arrRemove(arr,str)
{
	for(var i=0;i<arr.length;i++)
	{
		if (arr[i] == str)
			arr[i] = "";
	}
	return arr;
}

/**
*由设计串生成运行串时,在取 SKbillsheet.outerHTML 之后调用
* 保存到数据库时 arr 非空
**/
function DesignStr_RunStr_After(sRun,arr) {


    //added by liuxr at 2008-10-14 增加排序好的布局串
	fcpubdata.area.setAttribute("AutoResizeXml",ResizeXml());
	var sAttach=new Sys.StringBuilder(); 

    var isUseMask = false ; //是否需要用 fcmask.htc
    var sAttachEnd = ''; //拼在结尾处的串,用于tree控件应将一些脚本串拼在结尾 <script language="JavaScript">
    var sAttachInit = "";
    
	//计算基路径
	var basePath = ""; //fcpubdata.path+"/fceform";
	if(IsSpace(fcpubdata.area.getAttribute("type"))){
		basePath = ".." ; //系统表单
	}else{
		var typePath = BillTypeNameToPath(fcpubdata.area.getAttribute("type")).path;
		typePath = new Eapi.Str().trim(typePath);
		typePath = typePath.toLowerCase();
		if(typePath.substring(0,1) == "/"){
			typePath = typePath.substring(1,typePath.length);
		}
		if(typePath.substring(typePath.length-1,typePath.length) != "/"){
			typePath = typePath + "/" ;
		}
		//系统表单
		if(typePath == "fceform/dj/"  ){
			basePath = ".." ;
		}else{
			var tag = 0;
			var tagbase = false;
			var arr = typePath.split("/");
			for(var i=0;i<arr.length-1;i++){
				if(arr[i] == "." || IsSpace(arr[i])){
					//当前路径,不用做事
				}else if(arr[i] == ".."){
					if(i == 0) {
						tagbase =true ;
					}else {
						tag++;
					}
				}else {
					basePath += "../"
				}
			}
			for(var i=0;i<tag;i++){
				if(basePath.length>3){
					basePath=basePath.substring(3,basePath.length);
				}
			}
			if(tagbase) basePath += fcpubdata.path.substring(1,fcpubdata.path.length)+"/" ;
			basePath += "fceform" ;
		}
	}
	//模拟设计打开表单时做的数组赋值
	
	if(typeof arr == "undefined") {
		var ArrNum = new Array();
		ArrNum = OpenControlNo(fcpubdata.area.getAttribute("controlno"),ArrNum);
	} else {
		var ArrNum = arr;
	}
    //在IE中运行
	var allBrowser = IsTrue(fcpubdata.area.getAttribute("allBrowser"));
	
	
	var arrtmp = new Array() ;
	
	//新的数据集计算
	var oNode = oContXml.documentElement.selectSingleNode("dataset") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for (var i = 0; i < l; i++) {
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
			var s1 = imgdataset_dataset(obj);
			arrtmp[i] = s1 ;
		}
	}
	//新的webgrid转换
	var oNode = oContXml.documentElement.selectSingleNode("grid") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    var s1 = imgwebgrid_webgrid(obj);
			obj.outerHTML = s1;
			if(allBrowser) sAttachEnd += 'var ' + obj.id + '=new webgrid("' + obj.id + '"); $obj("'+obj.id+'").fnInit(); ';   //定义一个全局变量
			
			//sRun = RepStr(sRun,obj.outerHTML,s1);
		}
	}
	//真正的数据集转换
	var oNode = oContXml.documentElement.selectSingleNode("dataset") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    obj.outerHTML = arrtmp[i];
			if (allBrowser) sAttachEnd += 'var ' + obj.id + '=new dataset("' + obj.id + '"); ';   //定义一个全局变量
		}
	}
	
	//Numedit 控件转换
	var oNode = oContXml.documentElement.selectSingleNode("spin");
	if(oNode != null) {
		var l=oNode.childNodes.length ;
		for(var i=0; i<l; i++) {
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;

		    var sHtml = new Sys.StringBuilder();
			var tmpvalue="";
			if(IsSpace(obj.value ) == false) tmpvalue = obj.value;
			sHtml.append( "<div Class='xpSpin'  id=\""+obj.id+"\" controltype=\"spin\" field=\""+obj.getAttribute("field")+"\" dataset=\""+obj.getAttribute("dataset")+"\"  Min=\""+obj.getAttribute("Min")+"\" value=\""+tmpvalue+"\" align=\""+obj.style.textalign);
			if(obj.parentNode.id == "fcpagesub" || obj.parentNode.getAttribute("controltype") == "div" ){ 
			sHtml.append( " ParentPos='相对' " );
			}

			sHtml.append(  "\" style='align:"+obj.style.textalign+"; position:"+obj.style.position+"; left:"+obj.style.left+"; top:"+obj.style.top+"; width:"+obj.style.width+"; height:"+obj.style.height+";' NextNum=\""+obj.getAttribute("NextNum")+"\" Max=\""+obj.getAttribute("Max")+"\" fontsize=\""+obj.style.fontSize+"\" fontstyle=\""+obj.style.fontStyle+"\" fontfamily=\""+obj.style.fontFamily+"\" backgroundcolor=\""+obj.style.backgroundColor+"\" color=\""+obj.style.color+"\" fontweight=\""+obj.style.fontWeight+"\" enabled=\""+obj.getAttribute("enabled")+"\" display=\""+obj.style.display+"\" left=\""+ToInt(obj.style.left)+"\"  top=\""+ToInt(obj.style.top)+"\" width=\""+obj.style.width+"\" height=\""+obj.style.height+"\" ");
			//-----------------------added by liuxr at 2008-01-04------------------------//
            TransAttr1(obj,sHtml);
			//---------------------------------------------------------------------------//
			sHtml.append( " ></div>");

			obj.outerHTML = sHtml.toString();
			if (allBrowser) sAttachEnd += 'var ' + obj.id + '=new NumEdit("' + obj.id + '"); ';   //定义一个全局变量
			//sRun = RepStr(sRun,obj.outerHTML,sHtml);
		}
	}
	//combobox 转换
	var oNode = oContXml.documentElement.selectSingleNode("combobox") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
			//var s1 = obj.outerHTML ;
			var s2 = obj.getAttribute("sql") ;
			var s3 = SqlPropTrans(s2) ;
			obj.setAttribute("sql", "") ;
			obj.setAttribute("sqltrans", s3) ;
			
			//var s4 = RepStr(s1,' sql="'+s2+'"',' sqltrans="'+s3+'"');
			
			//sRun = RepStr(sRun,s1,s4);
		}
	}
	//------------------added by liuxr at 2008-01-04-------------------------//
	//button 自定义属性转换
	var oNode = oContXml.documentElement.selectSingleNode("button") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
			if(obj == null) continue;
			
			//-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
		}
	}
	
	//-----------------------------------------------------------------------//
	//text 自定义属性转换
	var oNode = oContXml.documentElement.selectSingleNode("text") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    
		    //清空控件上的值,以免装入表单时闪烁, 2011-05-13
			if (IsSpace(obj.getAttribute("dataset")) == false && IsSpace(obj.getAttribute("field")) == false) {
			    obj.value = "";
			} 
			//-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
		}
	}
	
	//-----------------------------------------------------------------------//
	//listbox 转换
	var oNode = oContXml.documentElement.selectSingleNode("listbox") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
			//var s1 = obj.outerHTML ;
			var s2 = obj.getAttribute("sql") ;
			var s3 = SqlPropTrans(s2) ;
			obj.setAttribute("sql", "") ;
			obj.setAttribute("sqltrans" , s3 );
			
			//var s4 = RepStr(s1,' sql="'+s2+'"',' sqltrans="'+s3+'"');
			
			//sRun = RepStr(sRun,s1,s4);
		}
	}	
	//checkboxlist 转换
	var oNode = oContXml.documentElement.selectSingleNode("checkboxlist") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
			
			//var s1 = obj.outerHTML ;
			var s2 = obj.getAttribute("sql") ;
			var s3 = SqlPropTrans(s2) ;
			obj.setAttribute("sql" , "") ;
			obj.setAttribute("sqltrans" , s3) ;
			//var s4 = RepStr(s1,' sql="'+s2+'"',' sqltrans="'+s3+'"');
			
			//sRun = RepStr(sRun,s1,s4);
		}
	}	
	//--------------------------added by liuxr at 2008-01-04----------//
	//checkbox 控件自定义属性转换
	var oNode = oContXml.documentElement.selectSingleNode("checkbox") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
		}
	}
	//a 控件自定义属性转换
	var oNode = oContXml.documentElement.selectSingleNode("a") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
		}
	}	
	//textarea 控件自定义属性转换
	var oNode = oContXml.documentElement.selectSingleNode("textarea") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    if (obj.getAttribute("induce") == "是") isUseMask = true;

			//清空控件上的值,以免装入表单时闪烁, 2011-05-13
			if (IsSpace(obj.getAttribute("dataset")) == false && IsSpace(obj.getAttribute("field")) == false) {
			    obj.value = "";
			} 

			
			//-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
		}
	}
	//radio 控件自定义属性转换
	var oNode = oContXml.documentElement.selectSingleNode("radio") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
		}
	}
	//img 控件自定义属性转换
	var oNode = oContXml.documentElement.selectSingleNode("img") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-07--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
		}
	}
	//dbimg 控件自定义属性转换
	var oNode = oContXml.documentElement.selectSingleNode("dbimg") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-07--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
		}
	}	
			
	//div 控件自定义属性转换
	var oNode = oContXml.documentElement.selectSingleNode("div") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-07--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
		}
	}	
	//label 控件转换 2008-12-11 add
	var oNode = oContXml.documentElement.selectSingleNode("label") ;
	if(oNode != null ){
	    var sbCommand=new Sys.StringBuilder();
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    if (obj.getAttribute("inputTag") == "是") {
                sbCommand.append(obj.id+".innerHTML+='"+fcpubdata.labelInputTag+"';");
            }
		}
		var sCommand = sbCommand.toString();
		if(IsSpace(sCommand) == false){
		    fcpubdata.area.setAttribute("labelInputTag" , sCommand);
		}
	}	
		
	//----------------------------------------------------------------//	
	//radiolist 转换
	var oNode = oContXml.documentElement.selectSingleNode("radiolist") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
			//var s1 = obj.outerHTML ;
			var s2 = obj.getAttribute("sql") ;
			var s3 = SqlPropTrans(s2) ;
			obj.setAttribute("sql" , "") ;
			obj.setAttribute("sqltrans" , s3) ;
			
			//var s4 = RepStr(s1,' sql="'+s2+'"',' sqltrans="'+s3+'"');
			//sRun = _RepStrEnter(sRun,s1,"<DIV id="+obj.id +" ",s4);
			//sRun = RepStr(sRun,s1,s4);
		}
	}			
	
	//tree控件的转换
	var oNode = oContXml.documentElement.selectSingleNode("tree") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    var sStr = new Sys.StringBuilder();
			//<div id="root1"></div>    <div id="test2"></div>
			//var tmproot=new xtreeItem(0,"Root1","","","","","http://localhost/tree/1.xml");tmproot.setup(document.getElementById("root1"));var root=new treeItem("Root","","","",icon.root.src,true,"");root.setup(document.getElementById("root"));
			sStr.append( '<div id="'+obj.id+'" controltype="tree" ');
			sStr.append( 'sourcetype='+obj.getAttribute("sourcetype")+' opentb="'+obj.getAttribute("opentb") + '" clicknode="' +escape(obj.getAttribute("clicknode"))+'" ');
			sStr.append( 'roottext="' + obj.getAttribute("roottext") + '" ');
			sStr.append( 'xml="' + escape(obj.getAttribute("xml")) + '" ');
			sStr.append( 'ischecked="' + obj.getAttribute("ischecked") + '" ');
			sStr.append( 'xmlpath="' + escape(obj.getAttribute("xmlpath")) + '" ');
			sStr.append('isAll="' + obj.getAttribute("isAll") + '" ');
			sStr.append('datasourceName="' + obj.getAttribute("datasourceName") + '" ');
			
			if(IsSpace(obj.getAttribute("sql")) == false){
				sStr.append( 'sql="' + SqlPropTrans(obj.getAttribute("sql")) + '" ');
			}
			if(IsSpace(obj.getAttribute("sql2")) == false){
				sStr.append( 'sql2="' + SqlPropTrans(obj.getAttribute("sql2")) + '" ');
			}
			
			if(obj.disabled == true) {
				sStr.append( 'disabled  ');
			}
			//-----------------------added by liuxr at 2008-01-07------------------------//
            TransAttr1(obj,sStr);
			//---------------------------------------------------------------------------//
            if (IsSpace(obj.className) == false) {
                sStr.append('class="' + obj.className + '" ');
            }
            sStr.append('style="OVERFLOW: auto;BORDER-STYLE:' + obj.style.borderStyle + ';position:' + obj.style.position + ';');
			sStr.append( 'border-width:'+obj.style.borderWidth+';');
			sStr.append( ' background-color:#ffffff; width:'+obj.style.width+'; height:'+obj.style.height+'; left:'+obj.style.left+'; top:'+obj.style.top+'; display:'+obj.style.display+'" ></div>');
			//sAttachEnd += '<script language="JavaScript">'
			sAttachEnd += 'var ' + obj.id + ';'  //定义一个全局变量
			
			sAttachEnd += 'NavJs.addEvent(window, "onunload", function(){' + obj.id + '=null;});'; //清除内存	
			//sAttachEnd += '</'+'script>';
			//sRun=RepStr(sRun,obj.outerHTML,sStr);
			obj.outerHTML = sStr.toString() ;
		}
	}
	//fccode 转换
	//for(var i=1; i<ArrNum["fccode"]+1; i++){
	var oNode = oContXml.documentElement.selectSingleNode("dropdownlist");
	if (oNode != null) {
	    var l = oNode.childNodes.length;
	    for (var i = 0; i < l; i++) {
	        var obj = $id(NavJs.textContent(oNode.childNodes[i]));
	        if (obj == null) continue;
	        var newsql = obj.getAttribute("sql1");
	        if (IsSpace(newsql)) newsql = obj.getAttribute("sql");
	        var str = new Sys.StringBuilder();

	        str.append("<fc:fc_code id=\"" + obj.id + "\" controltype=\"dropdownlist\" addrow=\"" + obj.getAttribute("addrow") + "\"  FieldNameList=\"" + obj.getAttribute("FieldNameList") + "\"  isTreeNewSql=\"" + obj.getAttribute("isTreeNewSql") + "\"  isShowTree=\"" + obj.getAttribute("isShowTree") + "\"  multiselect=\"" + obj.getAttribute("multiselect") + "\"  blninput=\"" + obj.getAttribute("blninput") + "\" ");
	        if (IsTrue(obj.disabled)) str.append(" disabled ");
	        str.append(" blnempty=\"" + obj.getAttribute("blnempty") + "\"  sqltrans=\"" + SqlPropTrans(newsql) + "\" sql2=\"" + obj.getAttribute("sql2") + "\"   format=\"" + obj.getAttribute("format") + "\" visible=\"" + obj.getAttribute("visible") + "\" datasourceName=\"" + obj.getAttribute("datasourceName") + "\" xml=\"" + obj.getAttribute("xml"));
	        str.append("\" class=\"" + obj.className + "\" dataset=\"" + obj.getAttribute("dataset") + "\" align=\"" + obj.style.textalign + "\" position=\"" + obj.style.position + "\"   field=\"" + obj.getAttribute("field"));
	        
	        var width_px = ToInt(obj.style.width);
	        if (obj.style.width.indexOf("%") >= 0) {
	            width_px = obj.parentNode.offsetWidth;
	        }
	        var height_px = ToInt(obj.style.height);
	        if (obj.style.height.indexOf("%") >= 0) {
	            height_px = obj.parentNode.offsetHeight;
	        }
	        str.append("\" left=\"" + ToInt(obj.style.left) + "\"  top=\"" + ToInt(obj.style.top) + "\" width=\"" + width_px + "\" height=\"" + height_px + "\" style=\"" + new Eapi.Css().getPart(obj.style.cssText) + "\" ");

	        if (obj.parentNode.id == "fcpagesub") //|| obj.parentNode.controltype == "div" || obj.parentNode.tagName == "TD"){ 
	        {
	            str.append(" ParentPos='相对' "); //此属性在fccode控件中没有用到
	        }
	        var s1 = "";
	        if (IsSpace(obj.getAttribute("fc_onclick")) == false) {
	            s1 = " onclickadd='" + quot_42(obj.getAttribute("fc_onclick")) + "'";
	        }
	        str.append(s1);
	        var s2 = "";
	        if (IsSpace(obj.getAttribute("onkeydown")) == false) {
	            s2 = " onkeydown='" + quot_42(obj.getAttribute("onkeydown")) + "'";
	        }
	        str.append(s2);
	        var s3 = "";
	        if (IsSpace(obj.getAttribute("onclickopen")) == false) {
	            s3 = " onclickopen='" + quot_42(obj.getAttribute("onclickopen")) + "'";
	        }
	        str.append(s3);
	        var s4 = "";
	        if (IsSpace(obj.getAttribute("oninterchange")) == false) {
	            s4 = " oninterchange='" + quot_42(obj.getAttribute("oninterchange")) + "'";
	        }
	        str.append(s4);
	        var s5 = "";
	        if (IsSpace(obj.getAttribute("onchange")) == false) {
	            s5 = " onchange='" + quot_42(obj.getAttribute("onchange")) + "'";
	        }
	        str.append(s5);
	        var s6 = "";
	        if (IsSpace(obj.getAttribute("onselchange")) == false) {
	            s6 = " onselchange='" + quot_42(obj.getAttribute("onselchange")) + "'";
	        }
	        str.append(s6);
	        //-----------------------added by liuxr at 2008-01-04------------------------//
	        TransAttr1(obj, str);
	        //---------------------------------------------------------------------------//
	        str.append(">");
	        str.append("</fc:fc_code>");
	        obj.outerHTML = str.toString();
	        if (allBrowser) sAttachEnd += 'var ' + obj.id + '=new dropdownlist("' + obj.id + '"); $obj("' + obj.id + '").fnInit(); ';   //定义一个全局变量
	    }
	}	

    //E表控件的转换 2008-07-10
	var oNode = oContXml.documentElement.selectSingleNode("ebiao") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
			ebiaoToRun(obj, oContXml);
        }
    }    
    //布局控件的转换 2009-03-02
	var oNode = oContXml.documentElement.selectSingleNode("layout") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		    //-------------added by liuxr at 2008-01-04--------------// 
			obj = TransAttr(obj);
			//--------------------------------------------------------//
			var oRecRows = getRecRowsObj(obj.getAttribute("recRows"));
			var oStartRow = [];
			var oContsId = [];
			
            var sbHide=new Sys.StringBuilder();
            var sbDs=new Sys.StringBuilder();
            var sbAll=new Sys.StringBuilder();
			var oXml = SetDom(unescape(obj.getAttribute("dsXml")));
			if (oXml.documentElement == null) continue;
			var boolTip = false;
			for (var j = 0; j < oXml.documentElement.childNodes.length - 1; j++) {
			    var contName = NavJs.getNodeValue11(oXml,j,0);
			    var contId = NavJs.getNodeValue11(oXml, j, 1);
			    var oName = document.getElementsByName(contName);
			    var oId = $id(contId);
			    if(oName==null || oName.length ==0 || oId == null ) continue;
			    
			    
			    var sDs = oId.getAttribute("dataset");
			    var isGridDs = _isGridDs(oRecRows,sDs);
			  
			    if(isGridDs ){
			        //找到原控件所在的TD
			        var oTD = oName[0].parentNode;
			        while (oTD != null && oTD.tagName != "TD") {
			            oTD = oTD.parentNode;
			        }
			        if (oTD == null) continue;
			        //oTD.innerHTML = ""; //在此删除原来的设置name属性的控件
			        //下面找到TD所在的table的ID
			        var tableId = oTD.parentNode.parentNode.parentNode.id;
			        if (IsSpace(tableId)) {
			            if(boolTip == false)alert("需要设置layout控件中明细表所在的html table元素的ID");
			            boolTip = true;
			            continue;
			        }

			        oTD.setAttribute("controlId" , contId);
			        
			        var sTmp = oContsId[sDs];
			        if(IsSpace(sTmp)) sTmp="";
			        oContsId[sDs] = sTmp+contId+",";
			        //找一个最小的行作为明细数据集的起始行
			        var r = oTD.parentNode.rowIndex;
			        var oldr ;
			        if(IsSpace(oStartRow[sDs])) {
			            oldr=r;
			        }else{
			            oldr=oStartRow[sDs][0];
			        }


			        oStartRow[sDs] = [Math.min(r,oldr),sDs,tableId];
			        //隐藏所有的动态显示控件
			        if(oId.getAttribute("controltype") == "dropdownlist")
			            oId.setAttribute("visible","否");
			        else
			            oId.style.display="none";
			    }else{
                    //oTD.id = "eb_cell_"+contId;
			        oName[0].id = "eb_cell_" + contId ; //将原来有name属性的控件的ID设置为对应eform控件的ID前+"eb_cell_" , 运行时按此找到控件的位置.
			        oName[0].style.visibility = "hidden";
			        sbHide.append("<"+contId+">1</"+contId+">");
			    }

			    //移动eform中的控件到布局控件上
			    //oId.style.position = "static";
			    //oId.style.width="100%";
			    //oId.style.height="100%";
			    oId.style.left=0;
			    oId.style.top=0;
			    var sOuterHtml = oId.outerHTML;
			    oId.outerHTML = "";
			    //obj.insertAdjacentHTML("beforeEnd",sOuterHtml);
			    NavJs.insertHtml("beforeEnd", obj, sOuterHtml);
			}
			var oDsSort = oStartRow.sort(function (a,b){ return a[0]-b[0]; } );
			
			var j;
			for(j in oDsSort){
			//for(var j=0;j<oDsSort.length;j++){
			    var sDs=oDsSort[j][1];
			    var sConts=oContsId[sDs];
			    if(IsSpace( sConts) == false){
			        sConts = sConts.substring(0,sConts.length-1);
			    }
			    sbDs.append("<"+sDs +"><startRow>"+ oDsSort[j][0]+"</startRow><contsId>"+sConts+"</contsId><tableId>"+oDsSort[j][2]+"</tableId></"+sDs+">"); //加一个html table的ID
			}
			sbAll.append("<root><hide>");
			sbAll.append(sbHide.toString());
			sbAll.append("</hide><dss></dss><conts>");
			sbAll.append(sbDs.toString());
			sbAll.append("</conts></root>");
			
			NavJs.child(obj, "div", 0).setAttribute("dsXml", escape(sbAll.toString()));
			//obj.childNodes[0].setAttribute("dsXml",escape(sbAll.toString()));
			
			obj.removeAttribute("dsXml"); //清空原属性,以省空间.
            //加上文件中的样式串
			if(IsSpace(obj.getAttribute("styleStr")) == false){
			    sAttach.append(obj.getAttribute("styleStr"));
			    obj.removeAttribute("styleStr");
			}
		}
	}
	//eblayout 控件自定义属性转换
	var oNode = oContXml.documentElement.selectSingleNode("eblayout");
	if (oNode != null) {
	    var l = oNode.childNodes.length;
	    for (var i = 0; i < l; i++) {
	        var obj = $id(NavJs.textContent(oNode.childNodes[i]));
	        if (obj == null) continue;
	        //-------------added by liuxr at 2008-01-07--------------// 
	        obj = TransAttr(obj);
	        //--------------------------------------------------------//
	    }
	} 	
	
	//页签控件的转换
	var obj ;
	var l ;
	
	var oNode = oContXml.documentElement.selectSingleNode("tab") ;
	if(oNode != null ){
		var l=oNode.childNodes.length;
		for(var i=0;i<l;i++){
		    var obj = $id(NavJs.textContent(oNode.childNodes[i]));
		    if (obj == null) continue;
		
			var sHtm =new Sys.StringBuilder(); // 

			sHtm.append( "<div class=\"tab-pane\" showtype=\"luna\" IsHideTitle="+obj.getAttribute("IsHideTitle")+" id=\""+obj.id+"\" controltype=\"tab\" style=\"position:absolute;left:"+obj.style.left+";top:"+obj.style.top+";width:"+obj.style.width+";Height:"+obj.style.height+"\"  " );
			//-----------------------added by liuxr at 2008-01-07------------------------//
            TransAttr1(obj,sHtm);
			//---------------------------------------------------------------------------//
			sHtm.append( " > ");
			var sHeight=ToInt(obj.style.height)-18 ;
			var l1=obj.childNodes[0].rows[0].cells.length ;
			for(var j=0;j<l1;j++){
				sHtm.append("<div class=\"tab-page\" style=\"width:"+obj.style.width+";height:"+sHeight+"\" >");
				sHtm.append("<h2 class=\"tab\">"+obj.childNodes[0].rows[0].cells[j].innerText+"</h2>");
				sHtm.append(HideListBoxSave(obj.childNodes[j+1]));
				sHtm.append("</div>");
			}
						
			sHtm.append("</div>");
			sHtm.append( "<script>");
			sHtm.append( "var " + obj.id  + " = new WebFXTabPane( document.getElementById( \"" + obj.id + "\" ) );" );
			sHtm.append( "</scr" + "ipt>");
			
			obj.outerHTML = sHtm.toString() ;
		}
    }
	
    //page页控件转换
	var oNode = oContXml.documentElement.selectSingleNode("page");
	if (oNode != null) {
	    var l = oNode.childNodes.length;
	    for (var i = 0; i < l; i++) {
	        var obj = $id(NavJs.textContent(oNode.childNodes[i]));
	        if (obj == null) continue;

	        var sHtm = new Sys.StringBuilder();  

	        sHtm.append("<div class=\"tab-pane\" id=\"" + obj.id + "\" controltype=\"page\" style=\"position:absolute;left:" + obj.style.left + ";top:" + obj.style.top + ";width:" + obj.style.width + ";Height:" + obj.style.height + "\"  iframeProps=\""+escape(obj.getAttribute("iframeProps"))+"\" ");
	        //-----------------------added by liuxr at 2008-01-07------------------------//
	        TransAttr1(obj, sHtm);
	        //---------------------------------------------------------------------------//
	        sHtm.append(" > ");
	        var sHeight = ToInt(obj.style.height) - 18;
	        var oXml = SetDom("<root>" + obj.getAttribute("pageXml") + "</root>");
	        var l1 = oXml.documentElement.childNodes.length;
	        for (var j = 0; j < l1; j++) {
	            sHtm.append("<div class=\"tab-page\" style=\"width:" + obj.style.width + ";height:" + sHeight + "\" >");
	            sHtm.append("<h2 class=\"tab\">" + NavJs.getNodeValue1(oXml,j) + "</h2>");
	            var sTmp = "";
	            if (obj.getAttribute("isLoadAll") == "是" || j == 0) sTmp = "src=\"" + unescape(oXml.documentElement.childNodes[j].getAttribute("linkUrl")) + "\" isLoaded=1 ";
	            if (IsSpace(oXml.documentElement.childNodes[j].getAttribute("pageClick")) == false)
	                sTmp += "pageClick=\"" + unescape(oXml.documentElement.childNodes[j].getAttribute("pageClick")) + "\" "; 
	            sHtm.append("<iframe srcbak=\"" + unescape(oXml.documentElement.childNodes[j].getAttribute("linkUrl")) + "\" " + sTmp + " " + obj.getAttribute("iframeProps") + " ></iframe>");
	            sHtm.append("</div>");
	        }

	        sHtm.append("</div>");
	        sHtm.append("<script>");
	        sHtm.append("var " + obj.id + " = new WebFXTabPane( document.getElementById( \"" + obj.id + "\" ) );");
	        sHtm.append("</scr" + "ipt>");
	        
	        obj.outerHTML = sHtm.toString();
	    }
	}
	//自定义控件从36开始
	for (var k = 36; k < ArrName.length; k++) {
	    var oNode = oContXml.documentElement.selectSingleNode("/root/" + ArrName[k]);
	    if (oNode != null) {
	        var oo = new Eform.AllWidget().getDesignObj(ArrName[k]);
	        if (!IsSpace(oo)) oo.toRunAfter();
	    }
	}
	    
	    
	    
	//加上表单所引用的JS库

	var sjslib = fcpubdata.area.getAttribute("jslib");
	if(isSpace(sjslib)==false){
		var arr = sjslib.split("\r\n");
		var l = arr.length;
		for(var i=0;i<l;i++){
			if(isSpace(arr[i])) continue;
			if(arr[i] == "fcsavedj.js" || arr[i] == "selectdate.js"  || arr[i] == "fcother.js" ){
				sAttach.append( "<script defer src='"+basePath+"/js/" + arr[i] + "'></"+"script>");
			}else if(arr[i].substring(0,1) == "~"){   //用户自己的JS的引入
				sAttach.append( "<script src='"+basePath+"/../fceformext/js/" + arr[i].substring(1,arr[i].length) + "'></"+"script>");
			}else{
				sAttach.append( "<script src='"+basePath+"/js/" + arr[i] + "'></"+"script>");
			}
		}
	}
	//自定义控件从36开始
	for (var k = 36; k < ArrName.length; k++) {
	    var oNode = oContXml.documentElement.selectSingleNode("/root/" + ArrName[k]);
	    if (oNode != null) {
	        var oo = new Eform.AllWidget().getDesignObj(ArrName[k]);
	        if (!IsSpace(oo)) sAttach.append(oo.getJsFile());

	    }
	}
	
	//sAttach.append( "<link href="+basePath+"/css/tabstyle.css type=text/css rel=stylesheet>"); //布局表格的样式
	
	if(IsSpace(fcpubdata.area.getAttribute("cssFile")) == false){
	    sAttach.append( "<link href='"+basePath+fcpubdata.area.getAttribute("cssFile")+"' type='text/css' rel='stylesheet'>"); // /css/tabstyle.css
	}
	var sJqueryJs = "";
	if (allBrowser) { 
	    //added by shenfr 2010-11-15 14:18 更改引用HTC文件为引用JS文件
	    var sCode = "<script src='" + basePath + "/htc/fc_code.js'></" + "script>";
	} else {
	    //附加上相应的引用
	    var sCode = "<script >document.styleSheets[0].addRule(\"fc\\\\:fc_code\",\"behavior: url(" + basePath + "/htc/fc_code.htc)\",0);</" + "script>";
	}
	sAttach.append(sJqueryJs);
	
	var boolDs = false;
	var boolAdded=false;
	var l=oContXml.documentElement.childNodes.length;
	for(var i=0;i<l;i++){
		if(oContXml.documentElement.childNodes[i].childNodes.length > 0 ){
		    var comtype = oContXml.documentElement.childNodes[i].nodeName;
		    //加上style元素，以便装入后台传来的样式串。
//		    if (comtype == "eblayout") {
//		        for (var j = 0; j < oContXml.documentElement.childNodes[i].childNodes.length; j++) {
//		            var contId = oContXml.documentElement.childNodes[i].childNodes[j].text;
//		            sAttach.append("<STYLE id=style_id_" + contId + " ></STYLE>");
//		        }

//		    }
		    
			switch (comtype) {
				case "dropdownlist" :
					if( boolAdded == false ) {
					    sAttach.append( sCode);
					    boolAdded =true;
					}
					break;
	            case "spin":
            	    
	                if (allBrowser) {
	                    sAttach.append("<script src='" + basePath + "/htc/NumEdit.js'></" + "script>");
	                } else {
    	                sAttach.append("<script >document.styleSheets[0].addRule(\".xpSpin\",\"behavior: url(" + basePath + "/htc/NumEdit.htc)\",0);</" + "script>");
	                }

	                break;
				case "tab" :
//					sAttach.append( "<script src='"+basePath+"/js/webfxlayout.js'></"+"script><link id='luna-tab-style-sheet' type='text/css' rel='stylesheet' href='"+basePath+"/css/luna/tab.css'  />");
				  //  sAttach.append("<script src='" + basePath + "/js/webfxlayout.js'></" + "script><link id='luna-tab-style-sheet' type='text/css' rel='stylesheet' href='" + basePath + "/css/tab.webfx.css'  />");
					break;
	            case "grid":
	                //sAttach += "<link type='text/css' rel='stylesheet' href='"+basePath+"/css/webgrid.css'  />";
            	    
	                if (allBrowser) {
	                    sAttach.append("<script src='" + basePath + "/htc/webgrid.js'></" + "script>");
	                } else {
	                    sAttach.append("<script >document.styleSheets[0].addRule(\"fc\\\\:webgrid\",\"behavior: url("+basePath+"/htc/webgrid.htc)\",0);</"+"script>");
	                }
	                sAttach.append("<script src='" + basePath + "/js/fcwebgrid.js'></" + "script>");
	                if (boolAdded == false) {
	                    sAttach.append(sCode);
	                    boolAdded = true;
	                }

	                break;
	            case "dataset":
	                //sAttach += "<link type='text/css' rel='stylesheet' href='"+basePath+"/css/dataset.css'  />";
	                boolDs = true;
	                if (allBrowser) {
	                    sAttach.append("<script src='" + basePath + "/htc/dataset.js'></" + "script>");
	                } else {
	                    sAttach.append("<script >document.styleSheets[0].addRule(\"fc\\\\:dataset\",\"behavior: url(" + basePath + "/htc/dataset.htc)\",0);</" + "script>");
	                }
	                sAttach.append("<script src='" + basePath + "/js/fcdataset.js'></" + "script>");
	                break;
				case "shape" :
					sAttach.append( "<link type='text/css' rel='stylesheet' href='"+basePath+"/css/shape.css'  />");
					break;
				case "tree":
					sAttach.append( "<link type='text/css' rel='stylesheet' href='"+basePath+"/css/xtree.css'  />");
					sAttach.append("<script src='"+basePath+"/js/xtree.js'></"+"script>");
					break;
				case "ebiao" :
					sAttach.append("<script src='"+basePath+"/js/fcebiao.js'></"+"script>");
					sAttach.append("<script src='"+basePath+"/ereport/js/loadreport.js'></"+"script>"); //因getDataSourceInfo()函数在此JS中,用了fcpub中的全局变量
					break;
				case "layout" :
					sAttach.append("<script src='"+basePath+"/js/fcebiao.js'></"+"script>");
					break;
	            case "eblayout":
	                sAttach.append("<script src='" + basePath + "/js/fcebiao.js'></" + "script>");
	                sAttach.append("<script src='" + basePath + "/ereport/js/loadreport.js'></" + "script>");
	                sAttach.append("<script src='" + basePath + "/js/fczk.js'></" + "script>");

	                if (boolDs == false) {
	                    if (allBrowser) {
	                        sAttach.append("<script src='" + basePath + "/htc/dataset.js'></" + "script>");
	                    } else {
	                        sAttach.append("<script >document.styleSheets[0].addRule(\"fc\\\\:dataset\",\"behavior: url(" + basePath + "/htc/dataset.htc)\",0);</" + "script>");
	                    }
	                    sAttach.append("<script src='" + basePath + "/js/fcdataset.js'></" + "script>");
	                    boolDs = true;
	                }
	                if (boolAdded == false) {
	                    sAttach.append(sCode);
	                    boolAdded = true;
	                }

	                break;
	            case "upload":
					sAttach.append("<script src='"+basePath+"/js/fcupload.js'></"+"script>");
					break;
//				case "chart" :
//					sAttach.append("<script src='"+basePath+"/js/fcgraph.js'></"+"script>");
//					break;
//				case "SKDBTreeView" :
//					sAttach.append("<script src='"+basePath+"/tree/tree.js'></"+"script>");
//					break;
//				case "button":
//					//if()
//					sAttach.append( "<link type='text/css' rel='stylesheet' href='"+basePath+"/css/Button.css'/>"); 
//					break;
//				case "text":
//					sAttach.append( "<link type='text/css' rel='stylesheet' href='"+basePath+"/css/TextStyle.css'/>"); 
//					break;
				case "textarea" :
				    if(isUseMask){
					    sAttach.append( "<script >document.styleSheets[0].addRule(\".fcmask\",\"behavior: url("+basePath+"/htc/fcmask.htc)\",0);</"+"script>");
					    sAttach.append("<script language='vbscript' src='"+basePath+"/js/fcmask.vbs'></"+"script>");
					}
					break;
				case "ebshow" :
					sAttach.append("<script src='"+basePath+"/ereport/js/ebshow.js'></"+"script>");
					break;



			}
		}
	}
	if (fcpubdata.area.getAttribute("type") == "MB") {
	    var sJs1 = escape(sAttach.toString());
	    var sJs2 = escape(sAttachEnd);
	    fcpubdata.area.setAttribute("refJs1", sJs1);
	    fcpubdata.area.setAttribute("refJs2", sJs2);
	}
	sRun = fcpubdata.area.outerHTML;
	//CopyToPub(sRun);

	//var sTab = window.document.all.tags("table");
	//alert(sTab.className)
	//处理事件

	sRun = RepStr(sRun, " fc_onclick=", " onclick=");
	sRun = RepStr(sRun, " fc_ondblclick=", " ondblclick=");
	sRun = RepStr(sRun, " fc_onfocus=", " onfocus=");
	sRun = RepStr(sRun, " fc_onblur=", " onblur=");
	sRun = RepStr(sRun, " fc_onkeydown=", " onkeydown=");
	//CopyToPub(sRun);
	var stmp11 = "()";
	sRun = RepStr(sRun, " onmove=move" + stmp11, "");
	sRun = RepStr(sRun, " onresize=resize" + stmp11, "");
	sRun = RepStr(sRun, " oncontrolselect=controlselect" + stmp11, "");
	sRun = RepStr(sRun, " onresizeend=resizeEnd" + stmp11, "");
	sRun = RepStr(sRun, " onresizestart=resizeStart" + stmp11, "");
	sRun = RepStr(sRun, " onmoveend=moveEnd" + stmp11, "");
	//	sRun = RepStr(sRun, " onresizeend=resizeEnd" + stmp11 + " onresizestart=resizeStart" + stmp11 + " onmoveend=moveEnd" + stmp11, "");
	
	sRun = sAttach.toString() + sRun +'<script>'+ sAttachEnd + '</' + 'script>'; //+'documentReadyAfter(function(){'+sAttachInit+'});'
	
	return sRun;
    
    function _isGridDs(oRecRows,sDs){
    ///判断是否是明细数据集,用于layout控件
        if(oRecRows == null) return false;
        if(typeof( oRecRows[sDs]) == "undefined") {return false; }
        return true;
    }

	/**
	* 因超长字符串替换时会出现自动转行现象,
	s = obj.outerHTML
	sFind ="<DIV id="+obj.id
	**/
	function _RepStrEnter(sRun,s,sFind,sRep){
		//var s = obj.outerHTML ;	
		var ilen=s.length;
		var ipos = sRun.indexOf(s) ;
		if(ipos > -1){
			sRun=sRun.substring(0,ipos)+sRep+sRun.substring(ipos+ilen,sRun.length);
		}else{
			ipos=sRun.indexOf(sFind);  //"<DIV id="+obj.id
			if(ipos > -1){
				sRun=sRun.substring(0,ipos)+sRep+sRun.substring(ipos+ilen,sRun.length);
			}
		} 
		return sRun ;
    }
    function ebiaoToRun(obj, oContXml) {
        ///ebiao控件设计串转运行串, 2012-06-18
        ///obj 为ebiao控件对象, oContXml 为表单中控件的XML对象

        var arrDs = new Array();
        var sbConts = new Sys.StringBuilder();
        //扫描表单中的控件
        for (var j = 0; j < oContXml.documentElement.childNodes.length; j++) {
            var sNodeName = oContXml.documentElement.childNodes[j].nodeName;
            if (sNodeName == "ebiao" || sNodeName == "tab" || sNodeName == "eblayout") continue;
            for (var k = 0; k < oContXml.documentElement.childNodes[j].childNodes.length; k++) {
                var oSubCont = $get(oContXml.documentElement.childNodes[j].childNodes[k].text, obj);
                if (oSubCont == null) continue;
                var oTd = oSubCont.parentNode;
                oTd.setAttribute("e_in_id", oSubCont.id); //"eb_cell_"+
                if (IsSpace(oSubCont.getAttribute("dataset")) == false) {
                    //判断arrDs中是否存在
                    if (Array.indexOf(arrDs, oSubCont.getAttribute("dataset")) == -1) arrDs[arrDs.length] = oSubCont.getAttribute("dataset");
                    oTd.setAttribute("e_in_dataset_id", oSubCont.getAttribute("dataset"));

                    var oCurDs = $id(oSubCont.getAttribute("dataset"));
                    if (oCurDs.getAttribute("isSubGrid") != "是") {
                        oTd.setAttribute("e_in_ext_type", "1"); //固定列
                    }
                    if (oSubCont.style.display == "none") oTd.setAttribute("e_in_is_hide", "1");

                    var oXml = SetDom(oCurDs.getAttribute("format"));
                    for (var ii = 0; ii < oXml.documentElement.childNodes.length; ii++) {
                        if (oXml.documentElement.childNodes[ii].childNodes[0].text.toUpperCase() == oSubCont.field.toUpperCase()) {
                            oTd.setAttribute("e_in_dataset_colno", ii);
                            if (oCurDs.getAttribute("isSubGrid") == "是") {
                                if (oXml.documentElement.childNodes[ii].childNodes[16].text == "是") { //primarykey列
                                    oTd.setAttribute("e_in_ext_type", "2"); //主动扩展列
                                } else {
                                    oTd.setAttribute("e_in_ext_type", "3"); //附属列
                                }
                            }
                        }
                    }
                }
                oSubCont.style.display = "none"; //控件先都隐藏起来
                //移出控件
                sbConts.append(oSubCont.outerHTML);
                oTd.innerHTML = "";
                var tmp = oTd.getAttribute("backupValue");
                if (IsSpace(tmp) == false) {
                    oTd.innerText = tmp;
                    oTd.removeAttribute("backupValue");
                }

            }
        }
        var oTable = NavJs.child(obj, "table", 0); //obj.childNodes[0];
        oTable.setAttribute("e_report_type", "4"); //表示填报
        var sb = new Sys.StringBuilder("<root>");
        for (var jj = 0; jj < arrDs.length; jj++) {
            var oo = _getPrimaryKeys($id(arrDs[jj]));
            sb.append("<ds>");
            sb.append("<id>" + arrDs[jj] + "</id>");
            sb.append("<cols>" + oo.cols + "</cols>");
            sb.append("<keys>" + oo.keys + "</keys>");
            sb.append("</ds>");
        }
        sb.append("</root>");
        if (arrDs.length > 0) oTable.setAttribute("e_in_xml", escape(sb.toString()));
        //obj.innerHTML ="<xml>"+ e_TransReportStr(oTable,false)+"</xml>";
        //将控件串放在e表控件的后部.
        //obj.insertAdjacentHTML("beforeEnd",sbConts.toString());	
        var s1 = e_TransReportStr(oTable, false);
        s1 = attachMergeTag(s1);
        s1 = RepStr(s1, "'", "&apos;"); //替换单引号
        s1 = RepStr(s1, ">\r\n", ">"); //替换换行符
        obj.setAttribute("sourTableStr", s1);
        obj.setAttribute("e_datasource", oTable.getAttribute("e_datasource")); //备份当前报表所要用到的数据源
        obj.innerHTML = sbConts.toString();
        //删除在设计状态下要用到的事件
        obj.removeAttribute("ondragstart");
        obj.removeAttribute("ondrop");
        obj.removeAttribute("ondragend");
        obj.removeAttribute("onmovestart");
        //加上onkeydown事件
        obj.setAttribute("fc_onkeydown", "new Eapi.EformEbiao().keypressMove();");


        function _getPrimaryKeys(oDs) {
            ///取数据集的主键字段串
            var sRet = "";
            var oXml = SetDom(oDs.getAttribute("format"));
            for (var ii = 0; ii < oXml.documentElement.childNodes.length; ii++) {
                if (NavJs.getNodeValue11(oXml, ii, 16) == "是") { //primarykey列
                    sRet += ii + ",";
                }
            }
            if (sRet != "") sRet = sRet.substring(0, sRet.length - 1);
            return { cols: oXml.documentElement.childNodes.length, keys: sRet };
        }
    }

	/**
	*纯表格对象从设计串转换成运行串
	*@param oimgGrid 设计时的表格对象ID
	*@date 2005-01-10
	**/

	function imgwebgrid_webgrid(oimgGrid){
		var sRetDs="";
		var sRetGrid=new Sys.StringBuilder();
		var sFormat="";
		var sonSetText="";
		var sonGetText="";
		var sonValid="";
		var sGridFormat=new Sys.StringBuilder();
		var sonclick=new Sys.StringBuilder();
		var sondblclick=new Sys.StringBuilder();
		var sonkeydown=new Sys.StringBuilder();
		
		//记录中字段名的次序：西文字段名0 中文名称1 字段类型2 字段宽度3 字段精度4 类型5 默认值6
		//数据格式7 只读8 显示9 唯一10 不能为空11 常规校验12 过程校验13 主键14 超链接15 窗口16 地址17 对齐18 列宽19
		//表现数据20 回写数据21 数据验证22 按键事件23 鼠标单击24 鼠标双击25
			sGridFormat.append(" format=\"<cols>");
			sonclick.append(" onclick='bill_ongridclick(\"<"+oimgGrid.id+">");
			sondblclick.append(" ondblclick='bill_ongriddblclick(\"<"+oimgGrid.id+">");
			sonkeydown.append(" onkeydown='bill_ongridkeydown(\"<"+oimgGrid.id+">");
		if(isSpace(oimgGrid.dataset)==false){
			var ods_formatxml=eval(oimgGrid.dataset); //找到表格对应的ds对象
			if(isSpace(ods_formatxml.formatxml)==false){
				var oXml=SetDom(ods_formatxml.formatxml); //此DOM串的最后一个节点不是字段列表。
				var l=oXml.documentElement.childNodes.length;
				for(var i=0;i<l;i++){
					var fdname=oXml.documentElement.childNodes(i).childNodes(0).text;
					var datatype=oXml.documentElement.childNodes(i).childNodes(2).text;
					var displaylabel=oXml.documentElement.childNodes(i).childNodes(1).text;
					var size=oXml.documentElement.childNodes(i).childNodes(3).text;
					var precision=oXml.documentElement.childNodes(i).childNodes(4).text;
							
						if(oXml.documentElement.childNodes(i).childNodes(9).text=="是"){ //显示
						    //表格
						    sGridFormat.append("<col>");
						    sGridFormat.append("<fname>"+fdname+"</fname>");
						    sGridFormat.append("<cname>"+displaylabel+"</cname>");
						    sGridFormat.append("<width>"+size+"</width>");
						    sGridFormat.append("<dtype>"+datatype+"</dtype>");
						    sGridFormat.append("<readonly>"+oXml.documentElement.childNodes(i).childNodes(8).text+"</readonly>");
						    sGridFormat.append("<visible>"+oXml.documentElement.childNodes(i).childNodes(9).text+"</visible>");
						    sGridFormat.append("<u></u><v></v><s></s><r></r>") ; //加上一些无用的节点用来占位，到时去掉

						    sGridFormat.append("<columnwidth>"+oXml.documentElement.childNodes(i).childNodes(19).text+"</columnwidth>");
						    sGridFormat.append("<align>"+oXml.documentElement.childNodes(i).childNodes(18).text+"</align>");
						    sGridFormat.append("</col>");
    											
						    sonclick.append("<col>"+quot_xml(oXml.documentElement.childNodes(i).childNodes(24).text)+"</col>");		
						    sondblclick.append("<col>"+quot_xml(oXml.documentElement.childNodes(i).childNodes(25).text)+"</col>");		
						    sonkeydown.append("<col>"+quot_xml(oXml.documentElement.childNodes(i).childNodes(23).text)+"</col>");		
						}


				}	// end for
			} // end if	
		}
			
				sGridFormat.append("</cols>\" ");
				sonclick.append("</"+oimgGrid.id+">\")' ");
				sondblclick.append("</"+oimgGrid.id+">\")' ");
				sonkeydown.append("</"+oimgGrid.id+">\")' ");

				if (Sys.Browser.agent != Sys.Browser.InternetExplorer) {
				    oimgGrid.hideHscroll == "是";
				    oimgGrid.hideVscroll == "是";
				}
			//表格
			sRetGrid.append("<fc:webgrid visible='"+oimgGrid.visible+"' readonly='"+oimgGrid.readonly+"' autoappend='"+oimgGrid.autoappend+"' autowidth='"+oimgGrid.autowidth+"' autoheight='"+oimgGrid.autoheight+"' canselect='"+oimgGrid.canselect+"' "+	_GetGridProp("SetRowHeight",oimgGrid.SetRowHeight)+	_GetGridProp("hideVscroll",oimgGrid.hideVscroll)+	_GetGridProp("hideHscroll",oimgGrid.hideHscroll)+	_GetGridProp("blRowNo",oimgGrid.blRowNo)+	_GetGridProp("autosize",oimgGrid.autosize)+	_GetGridProp("bodyrowheight",oimgGrid.bodyrowheight)+	_GetGridProp("bodyrows",oimgGrid.bodyrows));
			if (IsTrue(fcpubdata.area.getAttribute("allBrowser")) && Sys.Browser.agent != Sys.Browser.InternetExplorer) {
			    sRetGrid.append(" autosize=\"是\"");
			}
			sRetGrid.append(" id=\""+oimgGrid.id+"\" controltype=\"grid\" dataset="+oimgGrid.dataset+" ");
			try{
			if(oimgGrid.parentNode.id == "fcpagesub" || oimgGrid.parentNode.controltype == "div"){ //  || oimgGrid.parentNode.tagName =="TD"
				sRetGrid.append( " ParentPos='相对' " );
			}
			}catch(e){}
			//需要-17  2010-08-26 remove
			sRetGrid.append(" left="+oimgGrid.style.posLeft+" top="+oimgGrid.style.posTop+" height="+(oimgGrid.style.posHeight)+" width="+(oimgGrid.style.posWidth));
			if(oimgGrid.usertitle == "是"){
				sRetGrid.append(" multihead=\""+oimgGrid.usertitlehtml+"\" ");
				sRetGrid.append(" headrows=\""+oimgGrid.titlerows+"\" ");
				
			}		
			sRetGrid.append(sGridFormat);
			sRetGrid.append(sonclick);
			sRetGrid.append(sondblclick);
			sRetGrid.append(sonkeydown);
			sRetGrid.append(" >");

			var tabcss = "BORDER-COLLAPSE:collapse;TABLE-LAYOUT:fixed;left:0px;top:0px;"; //POSITION:absolute; width=100% 
			var trcss="";
			var tmps=CssPart(oimgGrid.csstext1);
			if(isSpace(tmps)==false){
				tabcss += tmps;
			}
			var tmps=CssPart(oimgGrid.csstext2);
			trcss=tmps ;
			var tmprowheight=oimgGrid.titlerowheight;
			if(isSpace(tmprowheight)==false){
				trcss += ";height:"+tmprowheight+"px";
			}


			sRetGrid.append("<table id=t cellPadding=1 cellSpacing=0 frame=box "
	  			+" style=\""+tabcss+"\" >" 
	  			+"<tr style=\""+trcss+" \" class=\"fcGridFirstRow\" ><td></td></tr>"
	  			+"</table></fc:webgrid>");
		return sRetGrid.toString() ;
		
		function _GetGridProp(propName,propValue){
			var s_SetRowHeight =propValue;
			if(IsSpace(s_SetRowHeight)) {
				s_SetRowHeight = "";
			}else{
				s_SetRowHeight = " "+propName+"='"+s_SetRowHeight+"' ";
			}
			return s_SetRowHeight
		}
	}
	/**
	*纯数据集对象从设计串转换成运行串
	*@param oimgGrid 设计时的数据集对象ID
	*@date 2005-01-10
	**/
	function imgdataset_dataset(oimgGrid){
		var sRetDs=new Sys.StringBuilder();
		var sRetGrid="";
		var sFormat=new Sys.StringBuilder();
		var sonSetText=new Sys.StringBuilder();
		var sonGetText=new Sys.StringBuilder();
		var sonValid=new Sys.StringBuilder();
		var sGridFormat="";
		var sonclick="";
		var sondblclick="";
		var sonkeydown="";
		
		
		sRetDs.append("<fc:dataset");
		sRetDs.append(" id=\"" + oimgGrid.id + "\" controltype=\"dataset\"");

		sRetDs.append(" async='" + oimgGrid.async + "'");
		
		sRetDs.append(" opensortno='"+oimgGrid.opensortno+"'");
		sRetDs.append(" isSubGrid='"+oimgGrid.isSubGrid+"'");
		//转换不保存
		if(isSpace(oimgGrid.pubpara)==false){
			sRetDs.append(" pubpara='"+oimgGrid.pubpara+"'");
		}
		if(isSpace(oimgGrid.chnname)==false){
			sRetDs.append(" chnname='"+oimgGrid.chnname+"'");
		}
		if(isSpace(oimgGrid.fieldtrans)==false){
			sRetDs.append(" fieldtrans='"+oimgGrid.fieldtrans+"'");
		}
		//"submittype","submitno","savetable","idtype","idparam","issubds","subdsfield","masterds","masterdsfield",
		if(isSpace(oimgGrid.submittype)==false){
			sRetDs.append(" submittype='"+oimgGrid.submittype+"'");
		}
		if(isSpace(oimgGrid.submitno)==false){
			sRetDs.append(" submitno='"+oimgGrid.submitno+"'");
		}
		if(isSpace(oimgGrid.savetable)==false){
			sRetDs.append(" savetable='"+oimgGrid.savetable+"'");
		}
		if(isSpace(oimgGrid.idtype)==false){
			sRetDs.append(" idtype='"+oimgGrid.idtype+"'");
		}
		if(isSpace(oimgGrid.idparam)==false){
			sRetDs.append(" idparam='"+oimgGrid.idparam+"'");
		}
		if(isSpace(oimgGrid.issubds)==false){
			sRetDs.append(" issubds='"+oimgGrid.issubds+"'");
		}
		if(isSpace(oimgGrid.subdsfield)==false){
			sRetDs.append(" subdsfield='"+oimgGrid.subdsfield+"'");
		}
		if(isSpace(oimgGrid.masterds)==false){
			sRetDs.append(" masterds='"+oimgGrid.masterds+"'");
		}
		if(isSpace(oimgGrid.masterdsfield)==false){
			sRetDs.append(" masterdsfield='"+oimgGrid.masterdsfield+"'");
		}
		if(isSpace(oimgGrid.datasourceName)==false){
			sRetDs.append(" datasourceName='"+oimgGrid.datasourceName+"'");
		}
		
		
		if(isSpace(oimgGrid.isaddemptyrec)==false){
			sRetDs.append(" isaddemptyrec="+oimgGrid.isaddemptyrec);
		}
		if(isSpace(oimgGrid.saveastable)==false){
			sRetDs.append(" saveastable="+oimgGrid.saveastable);
		}
		if (isSpace(oimgGrid.importType) == false) {
		    sRetDs.append(" importType=" + oimgGrid.importType);
		}
		if (isSpace(oimgGrid.importTrans) == false) {
		    //alert(oimgGrid.importTrans)
		    sRetDs.append(" importTrans=" + oimgGrid.importTrans);
		}


		if(isSpace(oimgGrid.BeforeOpen)==false){
			sRetDs.append(" BeforeOpen='bill_dsevent(\"BeforeOpen\",\""+quot_42(oimgGrid.BeforeOpen)+"\")'");
		}
		if(isSpace(oimgGrid.AfterOpen)==false){
			sRetDs.append(" AfterOpen='bill_dsevent(\"AfterOpen\",\""+quot_42(oimgGrid.AfterOpen)+"\")'");
		}
		if(isSpace(oimgGrid.BeforePost)==false){
			sRetDs.append(" BeforePost='bill_dsevent(\"BeforePost\",\""+quot_42(oimgGrid.BeforePost)+"\")'");
		}
		if(isSpace(oimgGrid.AfterPost)==false){
			sRetDs.append(" AfterPost='bill_dsevent(\"AfterPost\",\""+quot_42(oimgGrid.AfterPost)+"\")'");
		}
		if(isSpace(oimgGrid.BeforeScroll)==false){
			sRetDs.append(" BeforeScroll='bill_dsevent(\"BeforeScroll\",\""+quot_42(oimgGrid.BeforeScroll)+"\")'");
		}
		if(isSpace(oimgGrid.AfterScroll)==false){
			sRetDs.append(" AfterScroll='bill_dsevent(\"AfterScroll\",\""+quot_42(oimgGrid.AfterScroll)+"\")'");
		}

		//记录中字段名的次序：西文字段名0 中文名称1 字段类型2 字段宽度3 字段精度4 类型5 默认值6
		//数据格式7 只读8 显示9 唯一10 不能为空11 常规校验12 过程校验13 主键14 超链接15 窗口16 地址17 对齐18 列宽19
		//表现数据20 回写数据21 数据验证22 按键事件23 鼠标单击24 鼠标双击25
		sFormat.append(" format=\"<fields>");
		sonSetText.append(" onSetText='bill_ondatasetsettext(\"<dsid>");
		sonGetText.append(" onGetText='bill_ondatasetgettext(\"<dsid>");
		sonValid.append(" onValid='bill_ondatasetvalid(\"<dsid>");

		if(isSpace(oimgGrid.formatxml)==false){
		var oXml=SetDom(oimgGrid.formatxml); //此DOM串的最后一个节点不是字段列表。
		var l=oXml.documentElement.childNodes.length;
		var bln = false;
		if(l>0){
			if(oXml.documentElement.childNodes(0).childNodes.length <= 26) bln = true;
			 
		}
		for(var i=0;i<l;i++){
			var fdname=oXml.documentElement.childNodes(i).childNodes(0).text;
			var datatype=oXml.documentElement.childNodes(i).childNodes(2).text;
			var displaylabel=oXml.documentElement.childNodes(i).childNodes(1).text;
			var size=oXml.documentElement.childNodes(i).childNodes(3).text;
			var precision=oXml.documentElement.childNodes(i).childNodes(4).text;
			sFormat.append("<field>");
			sFormat.append("<fieldname>"+fdname+"</fieldname>");
			sFormat.append("<datatype>"+datatype+"</datatype>");
			sFormat.append("<displaylabel>"+displaylabel+"</displaylabel>");
			sFormat.append("<size>"+size+"</size>");
			sFormat.append("<precision>"+precision+"</precision>");
			sFormat.append("<fieldkind>"+oXml.documentElement.childNodes(i).childNodes(5).text+"</fieldkind>");
			sFormat.append("<defaultvalue>"+oXml.documentElement.childNodes(i).childNodes(6).text+"</defaultvalue>");
			sFormat.append("<displayformat>"+oXml.documentElement.childNodes(i).childNodes(7).text+"</displayformat>");
			sFormat.append("<isnull>"+oXml.documentElement.childNodes(i).childNodes(11).text+"</isnull>");
			sFormat.append("<iskey>"+oXml.documentElement.childNodes(i).childNodes(10).text+"</iskey>");
			sFormat.append("<valid>"+oXml.documentElement.childNodes(i).childNodes(12).text+"</valid>");
			sFormat.append("<procvalid>"+oXml.documentElement.childNodes(i).childNodes(13).text+"</procvalid>");
			sFormat.append("<link>"+oXml.documentElement.childNodes(i).childNodes(15).text+"</link>");
			sFormat.append("<target>"+oXml.documentElement.childNodes(i).childNodes(16).text+"</target>");
			sFormat.append("<href>"+oXml.documentElement.childNodes(i).childNodes(17).text+"</href>");
			sFormat.append("<visible>"+oXml.documentElement.childNodes(i).childNodes(9).text+"</visible>");
			sFormat.append("<primarykey>"+oXml.documentElement.childNodes(i).childNodes(14).text+"</primarykey>");
			if(bln){
				sFormat.append("<fieldvalid></fieldvalid>");
				sFormat.append("<tag></tag>");
			}else{
				sFormat.append("<fieldvalid>"+oXml.documentElement.childNodes(i).childNodes(26).text+"</fieldvalid>");
				sFormat.append("<tag>"+oXml.documentElement.childNodes(i).childNodes(27).text+"</tag>");
			
			}
			sFormat.append("</field>");
			sonSetText.append("<"+fdname+">"
					+quot_xml(oXml.documentElement.childNodes(i).childNodes(21).text)+"</"+fdname+">");
			sonGetText.append("<"+fdname+">"
					+quot_xml(oXml.documentElement.childNodes(i).childNodes(20).text)+"</"+fdname+">");		
			sonValid.append("<"+fdname+">"
					+quot_xml(oXml.documentElement.childNodes(i).childNodes(22).text)+"</"+fdname+">");	
					


		} // end for
		} // end if	
			sFormat.append("</fields>\"");
			sonSetText.append("</dsid>\")' ");
			sonGetText.append("</dsid>\")' ");
			sonValid.append("</dsid>\")' ");
		sRetDs.append(sFormat);
		if(isSpace(oimgGrid.opensql)==false){
			sRetDs.append(" sqltrans=\""+SqlPropTrans(oimgGrid.opensql)+"\"");
		}
		//找到此数据集控件有没有对应的表格控件
		var oNode = oContXml.documentElement.selectSingleNode("grid") ;
		if(oNode != null ){
			var l=oNode.childNodes.length;
			for(var i=0;i<l;i++){
				var oimgGrid1 = eval(oNode.childNodes(i).text);
		
				//转换交叉表
				if(oimgGrid1.iscrosstab=="是"){
					var s1=new Sys.StringBuilder();
					s1.append("<sql>"+SqlPropTrans(oimgGrid1.crosstabsql)+"</sql>");
					s1.append("<no>"+oimgGrid1.crosstabdatatype+"</no>");
					s1.append("<no>"+oimgGrid1.crosstabsumtype+"</no>");
					var i1=0;
					if(oimgGrid1.rcount=="是") i1+=1;
					if(oimgGrid1.rsum=="是") i1+=2;
					if(oimgGrid1.rmin=="是") i1+=4;
					if(oimgGrid1.rmax=="是") i1+=8;
					if(oimgGrid1.ravg=="是") i1+=10;
					var i2=0;
					if(oimgGrid1.ccount=="是") i2+=1;
					if(oimgGrid1.csum=="是") i2+=2;
					if(oimgGrid1.cmin=="是") i2+=4;
					if(oimgGrid1.cmax=="是") i2+=8;
					if(oimgGrid1.cavg=="是") i2+=10;
					s1.append("<no>"+i1+"</no>");
					s1.append("<no>"+i2+"</no>");
					s1.append("<format>"+oimgGrid1.crosstabformat+"</format>");
					s1.append("<rowstr>"+oimgGrid1.rowtitle+"</rowstr>") ;//可能coltitle和rowtitle相反
					s1.append("<colstr>"+oimgGrid1.coltitle+"</colstr>");
					//alert(oimgGrid.crosstabsql)
					sRetDs.append(" crossvalue=\""+s1.toString()+"\" ");
					//CopyToPub(s1)
				}
			}
		}
	//	 onSetText='bill_ondatasetsettext("<dsid><sitemcode></sitemcode><sitemname></sitemname><iunits></iunits><sunit></sunit><dpacknum>uf_setpacknum()</dpacknum><dzeronum>uf_setzeronum()</dzeronum><dnum>uf_setnum()</dnum><dtaxprice>uf_setintaxprice()</dtaxprice><dprice>uf_setprice()</dprice><dmoney>uf_setmoney()</dmoney><ddiscount>uf_setdiscount()</ddiscount><dtax>uf_settax()</dtax><dtaxmoney></dtaxmoney><dintaxmoney>uf_setintaxmoney()</dintaxmoney><dretailprice></dretailprice><sitemid></sitemid><dretailmoney></dretailmoney><bz></bz><sdnumJe></sdnumJe><sumInTaxMoney></sumInTaxMoney><sumbhsje></sumbhsje><djbh></djbh><dj_sn></dj_sn><sumjetobig></sumjetobig><sumje></sumje><sdwid></sdwid></dsid>")' 
		sRetDs.append(sonSetText);
		sRetDs.append(sonGetText);
		sRetDs.append(sonValid);
		
		sRetDs.append(" ></fc:dataset>");

		return sRetDs.toString();
		
		
	}
	
    function TransAttr1(obj,sHtml)
    {
	    //-----------------------added by liuxr at 2008-01-04------------------------//
        var sAttr = "";
	    if (IsSpace(obj.getAttribute("CustomAttr")) == false)
	    {
	        sAttr = obj.getAttribute("CustomAttr");
		    var re = /\r\n/g;
		    sAttr = sAttr.replace(re," ");
    		
	    }
    	
	    sHtml.append( sAttr);
	    //---------------------------------------------------------------------------//

    }

}

/**
*将SKbillsheet.controlno中的值放入数组中
**/
function OpenControlNo(s,ArrNum) {
	var arr=s.split(";") ;
	var l=arr.length ;
	for(var i=0;i<l;i++){
		var arr1=arr[i].split(":");
		ArrNum[arr1[0]]=arr1[1];
	}
	return ArrNum;
}




/**
no use
**/
function TransXml(sRun){
	sRun=RepStr(sRun,"&","&amp;");
	sRun=RepStr(sRun,">","&gt;");
	sRun=RepStr(sRun,"<","&lt;");
	sRun=RepStr(sRun,"\r\n","&#13;&#10;");
	
	//SQL Server库用两个'表示一个'
	//sRun=RepStr(sRun,"'","&apos;&apos;");
	if(fcpubdata.databaseTypeName == "sqlserver" || fcpubdata.databaseTypeName == "mysql") sRun=RepStr(sRun,"'","&apos;&apos;");
	
	return sRun ;

}
/**
no use
**/

function UnTransXml(sRun){
	sRun=RepStr(sRun,"&amp;","&");
	sRun=RepStr(sRun,"&gt;",">");
	sRun=RepStr(sRun,"&lt;","<");
	sRun=RepStr(sRun,"&#13;&#10;","\r\n");
	sRun=RepStr(sRun,"&apos;","'");

	return sRun ;

}
/**
*@date 2005-12-05
**/
function TransSql(sRun){
	//SQL Server库用两个'表示一个' mysql也一样
	if(fcpubdata.databaseTypeName == "oracle" || fcpubdata.databaseTypeName == "db2") return sRun ;
	sRun=RepStr(sRun,"'","''");
	//sRun=RepStr(sRun,"\r\n","&#13;&#10;");	
	return sRun ;

}

/**
表单保存时用它 
*@date 2004-09-23
**/
function HideListBoxSave(oPage){
    var sTag1;
    var oList = oPage.getElementsByTagName("select");
    var sRet;
    var l = oList.length;
	for(var i=0;i<l;i++){
		if(ToInt(oList[i].style.width)>0){
			return oPage.innerHTML;
		}else{
		    oList[i].style.width = oList[i].getAttribute("backwidth");
		    oList[i].style.height = oList[i].getAttribute("backheight");
		}
	}
	sRet=oPage.innerHTML;
	//恢复
	for(var i=0;i<l;i++){
	    oList[i].style.width = 0;
	    oList[i].style.height = 0;
	}
	return sRet;
		
}
/**
* e表中保存参数表单时用
**/
function e_savedj() {
	var obj = parent.dialogArguments[0]; //e报表table对象.
	var arr = DesignDjSave("不提示","是","是");
	obj.eform_design = escape(arr[0]);
	obj.eform_run = escape(arr[1]);
	obj.eform_function = escape(arr[2]);
	obj.eform_addhtml = escape(arr[3]);
	blnChange=false;
	parent.close();
}
/**
* e表中打开参数表单设计时用
*@date 2007-01-22
**/
function e_opendj() {

    var obj = parent.dialogArguments[0]; //e报表table对象.
	var s1 = obj.eform_design;
	if(typeof s1 == "undefined") s1="";
	var s2 = obj.eform_function;
	if(typeof s2 == "undefined") s2="";
	var s3 = obj.eform_addhtml;
	if(typeof s3 == "undefined") s3="";
	DesignDjOpenSub([new Eapi.Str().trim(unescape(s1)),"",unescape(s2),unescape(s3)]);
	//给SKbillsheet的默认值
	fcpubdata.area.entertype = "展现";
	
}
