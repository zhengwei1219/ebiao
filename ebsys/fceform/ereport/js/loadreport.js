///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />


//webreport的全局变量值.
var fcpub =
{
    //printHeightAdjust : 10, //打印高度上的微调值,单位px
	rootPath		: "/ebfile/" , //打开报表的默认路径,/ebsys 
	tempFilePath	: "/ebtmpfile/file/" , //e表临时文件的路径,/ebsys
	expFilePath		: "/ebexpfile/file/" , //e表报表结果文件的路径,这个作用不大,只用于e_directrun=yes时
	toolbar             : "firstpage,prevpage,curpage,pages,nextpage,lastpage,|,preview,print,printdirect,printall,|,query,pageset,refresh,save,|,expexcel,expexcelall,exppdf",
	toolbarstyle		: "blue",
	designToolbar: "eb_newempty,eb_newwizard,eb_open,eb_save,eb_saveas,eb_run,|,eb_cut,eb_copy,eb_paste,eb_formatcopy,eb_undo,eb_redo,|,eb_insertrow,eb_addrow,eb_delrow,eb_insertcol,eb_addcol,eb_delcol,|,eb_fx,eb_prop,eb_rowprop,eb_colprop,eb_cellprop,|,eb_dataset,|,eb_param,eb_designform,eb_macro,eb_subreport,eb_chart,eb_barcode,eb_flash,|,eb_importexcel,eb_option,eb_showinfo,eb_runcommand,br,eb_font,eb_b,eb_i,eb_u,eb_alignleft,eb_aligncenter,eb_alignright,eb_aligntop,eb_alignmiddle,eb_alignbottom,eb_bgcolor,eb_fgcolor,eb_merge,eb_split,eb_line,eb_editfx", //设计器的工具栏按钮 
	rows				: 20 , //新建报表时的默认行数
	cols				: 10 , //新建报表时的默认列数
	titleRowHeight		: 21 , //标题行行高
	rowHeight			: 20 ,    //默认行高值
	colWidth			: 70 ,   //默认列宽值
	firstColWidth		: 35 , //标签列列宽
	editboxOffset	: 2 ,
	editboxLeftOffset	: 1 , 
	baseTop			: 74, //网格区的起始top值
	divMainOffset   : 5 , //移动到边界时,边界的调整量 
	fontsize		: 13, //默认的字大小
	fileName		: "",  //主文件名
	fromdb			: "yes",  //yes表示报表文件保存在数据库中,否则表示保存在文件中
	shiftf			: "no",   //增删行列时不调整公式中的单元格引用.
	sepTag			: "#fc#eb#", //用于后台传来的数据的分隔标记 no use
	recentFile		: "",		//最近打开的文件
	dragTag       : 1,     //拖动标志,用于e表控件中,1 正常,在单元格之间拖动,2 拖动到外面,3 从外面拖动到E表控件内,4 非法拖动(如在同一单元格内拖动)

	batchPrintTime : 0,   //批量打印时,window.clearInterval(fcpub.batchPrintTime)
	batchPrintUrlArr : null,
	batchPrintIframeName : "fcPrnIframe",

	
	divMainWidth	: 0 ,	//跟踪divMain的clientWidth
	divMainHeight	: 0
}
//供内部用的全局变量值
var pubin =
{
	t_left	: 0 ,
	t_top	: 0 ,
	pointX	: 0 ,
	pointY	: 0
}

//计算路径	
//var tmp12345 =  GetUrlFirstPart();
//fcpub.rootPath = tmp12345+fcpub.rootPath;
//fcpub.tempFilePath = tmp12345+fcpub.tempFilePath;
//fcpub.expFilePath = tmp12345+fcpub.expFilePath;

//决定报表是否变化了
var blnChange=false
//不要运行表格的mouseup,thead_onclick时只运行在mousedown
var NoRunMouseUp=false


//读取默认值
function ReadConfig() {
    
    var oXmlConfig = SetDomFile("../.." + fcpubdata.userDir + "/xml/econfig.xml");
	fcpub.fromdb = NavJs.getNodeValue11(oXmlConfig,1,0);
	fcpub.rows = NavJs.getNodeValue11(oXmlConfig,1,1);
	fcpub.rows = ToInt(fcpub.rows);
	fcpub.cols = NavJs.getNodeValue11(oXmlConfig,1,2);
	fcpub.cols = ToInt(fcpub.cols);
	fcpub.rowHeight = NavJs.getNodeValue11(oXmlConfig,1,3);
	
	fcpub.rowHeight = ToInt(fcpub.rowHeight);
	fcpub.colWidth = NavJs.getNodeValue11(oXmlConfig,1,4);
	fcpub.colWidth = ToInt(fcpub.colWidth);
	
	fcpub.firstColWidth = NavJs.getNodeValue11(oXmlConfig,1,5);
	fcpub.firstColWidth = ToInt(fcpub.firstColWidth);
	if(oXmlConfig.documentElement.childNodes[1].childNodes.length > 6) fcpub.shiftf = NavJs.getNodeValue11(oXmlConfig,1,6);
	oXmlConfig = null;
	
}
//装入报表文件
function NewReport(){
	divMain.scrollLeft = 0;
	divMain.scrollTop = 0;

	CreateReport(fcpub.rows,fcpub.cols);
	fcpub.fileName = "";
	var sTitle = "报表设计器";
	if (!setTabTitle(sTitle ))
	    ChangeWinTitle(sTitle);
	SelObj.selrowcol = 0;
	selectRange("init",0,0,0,0);
	initoUndooRedo();
	
	divMain.style.backgroundImage="";
	//clearBlueScale();
	$id("t").style.position="absolute";
	$id("t").style.left = 0;
	$id("t").style.top = 0;	
	
}
function LoadReport() {
	if(fcpub.fromdb == "yes"){
		//从数据库中打开报表文件
		var sRet=DjOpen('eb_fromdbopen','','修改',"有模式窗口","直接","从数据库中打开报表");
		if(isSpace(sRet)==false){
			OpenReport(sRet);
			//var spath =  sRet; //直接的报表名称
			
			//var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/ebfile"+fcpubdata.dotnetVersion+"?key=loadFile&fromdb=yes&spath="+escape(spath),"");
			//LoadReportFile(retX,sRet);

		}	
	}else{
		//打开报表文件.
	    var spath = fcpub.rootPath; //'/ebfile';
		//if(fcpubdata.dotnetVersion == "") spath="ebsys/ebfile"; 
		var sRet = DjOpen('getUrl',[spath,'file','yes','htm'],'展现','有模式窗口','直接','选择e表文件');

		//var sRet=DjOpen('eb_openfile','','修改',"有模式窗口","直接","打开报表文件");
		//var sRet = "a1.dj"
		if(isSpace(sRet)==false){
			OpenReport(sRet);
			//sRet = sRet.substring(1,sRet.length) ; //去掉前面的/
			//var spath =  fcpub.rootPath+sRet;
			//var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/ebfile"+fcpubdata.dotnetVersion+"?key=loadFile&spath="+escape(spath),"");
			//LoadReportFile(retX,sRet);

		} 
	}

}
/**
*装入报表
*@param retX 为xml的报表内容
*@param sFile 为报表名
**/
function LoadReportFile(retX,sFile) {

    var ipos = retX.indexOf("<?xml version=\"1.0\" encoding=\""); //gb2312"?><TABLE 
	if(ipos>0) {
		var sName = retX.substring(0,ipos); //项目名称
		var stmp1 =  sName + "\n\n授权使用!";
		itemInfo.innerText = "关于..";
		itemInfo.title=stmp1;
		itemInfo.onclick = function (){alert(stmp1)} ;
		retX = retX.substring(ipos,retX.length); 
	}
	
	var oXml = SetDom(retX);
	if(oXml.documentElement == null){
		alert(retX);
		return ;
	}
	$id("t").outerHTML =RepStr(retX,"&amp;nbsp;","&nbsp;");
	
    LoadReportInit();

    fcpub.fileName = sFile;
    if (!setTabTitle(fcpub.fileName)) 
	    ChangeWinTitle(fcpub.fileName);
	//加上最近打开的文件
	AddRecentFile(sFile);
	RefreshRecentFile();

}
///装入报表串后进行的初始化工作
function LoadReportInit(){
	$id("t").style.position="absolute";
	$id("t").style.left = 0;
	$id("t").style.top = 0;
	//装入背景图
	var sBgImgUrl = $id("t").e_background_image;
	if (IsSpace(sBgImgUrl) == false) {
	    if (sBgImgUrl.substring(0, 4) != "url(") sBgImgUrl = "url("+sBgImgUrl+")";
	    divMain.style.backgroundImage = sBgImgUrl;
		divMain.style.backgroundRepeat='no-repeat';
	}else{
		divMain.style.backgroundImage = "";
	}
	
	//CopytHtml();
	//同步行高列宽
	var cols = $id("t").childNodes(0).childNodes.length;
	var rows = $id("t").rows.length;
	divTopHead.innerHTML = getTopHeadStr(cols,false);
	divLeftHead.innerHTML = getLeftHeadStr(rows,false);
	for(var i=0;i<cols;i++){
		tabTopHead.childNodes(0).childNodes(i).style.width = $id("t").childNodes(0).childNodes(i).style.width ;
	}
	AdjustLeftHead();	
	
	SelObj.selrowcol = 0;
	//window.setTimeout('selectRange("init",0,0,0,0);',100);
	selectRange("init",0,0,0,0);
	initoUndooRedo();
	/**
	* 同步调整行高
	**/
	function AdjustLeftHead() {
		var rows = $id("t").rows.length;
		for(var i=0;i<rows;i++){
			tabLeftHead.rows(i).style.height = $id("t").rows(i).style.height ;
		}

	}

}
/**
* 打开报表
*@param sRet = 输入的报表名
*@date 2007-05-22
**/
function OpenReport(sRet){
	CheckReportChange();
	
	var sFromDb="";
	if(fcpub.fromdb == "yes") {
		sFromDb="&fromdb=yes&dbtype="+fcpubdata.databaseTypeName;
		var spath =  sRet; //直接的报表名称
	}else{
		if(sRet.substring(0,1) == "/")sRet = sRet.substring(1,sRet.length) ; //去掉前面的/
		var spath =  fcpub.rootPath+sRet;
	}
	//alert("1:"+spath);
	if(fcpubdata.dotnetVersion == "" ) spath = escape(spath);

	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=loadFile"+sFromDb+"&spath="+escape(spath),"");
	LoadReportFile(retX,sRet);

}
function SaveReport() {
	var oldName = fcpub.fileName;
	if(fcpub.fileName==""){
		if(fcpub.fromdb == "yes"){
			var sRet=window.showModalDialog("input.htm","","status:no;dialogHeight:120px;dialogWidth:400px;dialogTop:180;dialogLeft:250px") ;
		}else{
		    var spath = fcpub.rootPath; //'/ebfile';
			//if(fcpubdata.dotnetVersion == "") spath="ebsys/ebfile"; 
			var sRet = DjOpen('getUrl',[spath,'file','yes','','yes'],'展现','有模式窗口','直接','输入要保存的文件名');
			if(typeof sRet != "undefined") {
				if(sRet.substring(0,1) == "/") sRet = sRet.substring(1,sRet.length); 
			}
		
		}
		if(typeof sRet=="undefined") return;
		fcpub.fileName = sRet;
		if(fcpub.fromdb != "yes"){
			fcpub.fileName += ".htm";
		}
	}
	
	var spath = fcpub.fileName;
	var ipos = spath.indexOf(".htm");
	if(fcpub.fromdb == "yes"){
		//去掉.htm
		if(ipos>=0){
			spath = spath.substring(0,ipos);
			fcpub.fileName = spath;
		}
	}else{
		//如无.htm则加上,用于从数据库到文件时
		if(ipos<0){
			spath = spath + ".htm";
			fcpub.fileName = spath;
		}
		spath = fcpub.rootPath+spath;
	}
	var edit="";
	if(oldName != "") edit="yes";
	if (SaveReportFile(spath, edit)) {
	    if (!setTabTitle(fcpub.fileName))
		    ChangeWinTitle(fcpub.fileName);
	}else{
		fcpub.fileName = oldName;
	}

}
/**
*报表另存
**/
function SaveAsReport() {
	var oldName = fcpub.fileName;

	if(fcpub.fromdb == "yes"){
		var sRet=window.showModalDialog("input.htm","","status:no;dialogHeight:120px;dialogWidth:400px;dialogTop:180;dialogLeft:250px") ;
	}else{
	    var spath = fcpub.rootPath; // '/ebfile';
		//if(fcpubdata.dotnetVersion == "") spath="/ebfile"; 
		var sRet = DjOpen('getUrl',[spath,'file','yes','','yes'],'展现','有模式窗口','直接','输入要保存的文件名');
		if(typeof sRet != "undefined") {
			if(sRet.substring(0,1) == "/") sRet = sRet.substring(1,sRet.length); 
		}
	}

	if(typeof sRet=="undefined") return ;

		fcpub.fileName = sRet;
		var spath = sRet;
		if(fcpub.fromdb != "yes"){
			fcpub.fileName = sRet+".htm";
			spath = fcpub.rootPath+fcpub.fileName
		}
		if (SaveReportFile(spath)) {
		    if (!setTabTitle(fcpub.fileName))
			    ChangeWinTitle(fcpub.fileName);
			blnChange=false;
		}else{
			fcpub.fileName = oldName;
		}
//	}else{
//		alert(retX);
//	}
	
}
/**
*@param edit=yes 表示修改保存,不要检查已存在
 edit=e表控件中保存 
  isAlert != "否"提示，否则不提示
**/
function SaveReportFile(spath, edit, fromDb, userType, isAlert) {
	//CopyToPub(t.innerHTML);
	//return;
	var isEbiao = edit == "e表控件中保存";					
	var sedit="";
	if(edit=="yes" || isEbiao ) sedit="&edit=yes";			
	if(!isEbiao){
	    //SelObj.curTD.oTD.innerText = txtEdit.value;
	    //shiftMerge();
	    saveBeforeAction();
	}						
	var s = e_TransReportStr($id("t"),true);
	s = RepStr(s, " backupValue ", " ");
	//CopyToPub(s);
	var sFromDb = "";
	if(IsSpace(fromDb)) fromDb = fcpub.fromdb;
	if(fromDb == "yes") sFromDb = "&fromdb=yes&dbtype="+fcpubdata.databaseTypeName ;
	if(fcpubdata.dotnetVersion == "" ) spath = escape(spath);
	//加上报表类型
	var sUserType = userType; 
	if (IsSpace(sUserType)) sUserType = Request.QueryString("usertype").toString();
	if (IsSpace(sUserType) == false && sUserType != "undefined")
	    sUserType = "&usertype=" + sUserType;
	else
	    sUserType = "";	    

	var retX = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=saveFile&spath=" + escape(spath) + sedit + sFromDb + sUserType, s, null, null, "noRoot");
	
	if(IsSpace(retX)){
		blnChange=false;

		if (!isEbiao && isAlert != "否") alert("OK!");
		
		if(edit != "yes" && !isEbiao){
			AddRecentFile(fcpub.fileName);
			RefreshRecentFile();
		}
		
		return true;
	}else{
		alert(retX);
		return false;
	}
//							alert(t1-t2)  

	//alert('ok')
	//var sRet=window.showModalDialog("input.htm",s1,"status:no;dialogHeight:120px;dialogWidth:400px;dialogTop:180;dialogLeft:250px") ;
	//if(typeof sRet=="undefined") return;
	
}
function getTableCols(oTable){
///取一个表格的总列数

    var ll = 0;
    if(oTable.rows.length > 0){
        for(var i=0;i<oTable.rows[0].cells.length;i++){
            ll += oTable.rows[0].cells[i].colSpan;
        }
    }
    return ll;
}
//保存模板
function e_TransReportStr(oTable,isAddHead) {

	var sb = new Sys.StringBuilder();
	if (isAddHead) sb.append('<?xml version="1.0" encoding="' + fcpubdata.encoding + '" ?> ');
	sb.append('<TABLE id="t" style="');
	var sCss = oTable.style.cssText;
	//用此来判断新旧的方式
	var isIe = sCss.indexOf("border-collapse: collapse;") < 0;
	
	sCss = sCss.toLowerCase();
	sCss = RepStr(sCss,"position: absolute","") ;
	sCss = RepStr(sCss,"top: 0px","") ;
	sCss = RepStr(sCss,"left: 0px","") ;
	sb.append(sCss);
	sb.append('" cellPadding="0" cellSpacing="0" border="0" '); //borderColor="lightgrey" borderColorDark="white" 
	sb.append(' '); //onmousedown="t_onmousedown()" onmousemove="t_onmousemove()" onmouseup="t_onmouseup()" 
	var ll = getTableCols(oTable); //tabTopHead.rows(0).cells.length ;
	
	sb.append('e_rows="'+oTable.rows.length+'" e_cols="'+ ll +'" ');
	
	//sb.append('e_print_height_adjust="'+fcpub.printHeightAdjust+'" '); //打印高度上的微调值
	_addTabProp(sb, "e_print_height_adjust");
	
	_addTabProp(sb,"e_sub_report");
	_addTabProp(sb,"e_sub_reportbak");
	_addTabProp(sb,"e_args");
	_addTabProp(sb,"e_argsbak");
	_addTabProp(sb,"e_macros");
	_addTabProp(sb,"e_macrosbak");

	_addTabProp(sb,"e_dataset");
	_addTabProp(sb,"e_datasetbak");
	_addTabProp(sb,"e_printer_name");
	_addTabProp(sb,"e_page_size");
	_addTabProp(sb,"e_page_orientation");
	_addTabProp(sb,"e_paper_width");
	_addTabProp(sb,"e_paper_height");
	_addTabProp(sb,"e_paper_margin_left");
	_addTabProp(sb,"e_paper_margin_right");
	_addTabProp(sb,"e_paper_margin_top");
	_addTabProp(sb,"e_paper_margin_bottom");
	_addTabProp(sb,"e_size_unit");
	_addTabProp(sb,"e_page_style");
	_addTabProp(sb,"e_rows_per_page");
	_addTabProp(sb,"e_print_layout_row");
	_addTabProp(sb,"e_print_layout_col");
	_addTabProp(sb,"e_print_layout_index");
	_addTabProp(sb,"e_header_footer_setup");
	_addTabProp(sb,"e_columns");
	_addTabProp(sb,"e_datasource");

	_addTabProp(sb, "e_background_image"); //此属性不进行后台计算
	_addTabProp(sb, "e_print_bg");

	_addTabProp(sb, "e_check_permit");
	
	//参数表单的信息
	_addTabProp(sb,"eform_design");	
	_addTabProp(sb,"eform_run");	
	_addTabProp(sb,"eform_function");	
	_addTabProp(sb,"eform_addhtml");	
	_addTabProp(sb,"eform_winprop");

	_addTabProp(sb,"e_pdf_user");
	_addTabProp(sb,"e_pdf_owner");
	_addTabProp(sb,"e_pdf_allow");
	_addTabProp(sb, "e_excel_password");


	
	_addTabProp(sb,"e_report_type");
	_addTabProp(sb,"e_in_xml");

	sb.append('>');
	//装入列信息;
	sb.append('<COLGROUP>');
	for(var i=0;i<ll;i++){
	    var objTmp = NavJs.indexCol(oTable, i); //oTable.childNodes[0].childNodes[i];
	    sb.append('<COL style="WIDTH: ' + ToInt(objTmp.style.width) + 'px"');
		if(objTmp.getAttribute("e_col_type") == "0") //0表示标题列
			sb.append( ' e_col_type="0"'); 
			
		if(objTmp.getAttribute("e_page_break_col") == "1") //1表示列后分页
			sb.append( ' e_page_break_col="1"'); 
		if(IsSpace(objTmp.getAttribute("e_hide_col")) ==false) sb.append( ' e_hide_col="'+objTmp.getAttribute("e_hide_col")+'"');
		if(IsSpace(objTmp.getAttribute("x_hide_col")) ==false) sb.append( ' x_hide_col="'+objTmp.getAttribute("x_hide_col")+'"');
		if(IsSpace(objTmp.getAttribute("x_col_width")) ==false) sb.append( ' x_col_width="'+objTmp.getAttribute("x_col_width")+'"');
		sb.append( ' />');
	}
	sb.append('</COLGROUP>');
	/*
	//装入行及TD信息
	
	var l = tabLeftHead.rows.length;
	for (var i=0;i<l;i++){
		sb.append('<tr height="' + tabLeftHead.rows(i).style.pixelHeight + '" >');
		ll = $id("t").rows(i).cells.length;
		for(var j=0;j<ll;j++){
			sb.append('<td e_pos="' + i + ',' +LogToPhy(i,j) + '" '); //LogToPhy(i,j)
			sb.append('style="' + $id("t").rows(i).cells(j).style.cssText + '" ');
			if($id("t").rows(i).cells(j).colSpan>1)
				sb.append('colspan="' + $id("t").rows(i).cells(j).colSpan + '" ');
			if($id("t").rows(i).cells(j).rowSpan>1)
				sb.append('rowspan="' + $id("t").rows(i).cells(j).rowSpan + '" ');
			sb.append('>'+$id("t").rows(i).cells(j).innerText+'</td>');   //td的值应转码
				
		}
		sb.append('</tr>');
	} 
	*/
	
//	var sAll = oTable.innerHTML;
//	var ipos= sAll.indexOf("<tbody>");
//	if( ipos>=0 ) sAll = sAll.substring(ipos,sAll.length);
	//

	var oTbody = NavJs.child(oTable, "tbody", 0);
	var innStr;
	//var isIe = false; //Sys.Browser.agent == Sys.Browser.InternetExplorer;
	if (isIe) {
	    innStr = oTbody.innerHTML;
	} else {
	    var arrTr = oTbody.getElementsByTagName("tr");
	    var sb1 = new Sys.StringBuilder();
	    for (var k = 0; k < arrTr.length; k++) {
	        var tmpS = arrTr[k].outerHTML;
	        if (tmpS.substring(0, 3) == "<tr") {
	            tmpS = "<TR" + tmpS.substring(3, tmpS.length - 3) + "TR>";
	        }
	        sb1.append(tmpS);
	    }
	    innStr = sb1.toString();
	}
	var sAll = "<TBODY>" + innStr + "</TBODY>";  //注意要保持 TBODY 为大写，否则后台用时会出错。oTbody.innerHTML sb1.toString()
	sAll = RepHtmToXml(sAll);

	if (isIe) {
	    //colSpan=3 rowSpan=3 用正则表达式加上引号 
	    var posStart = 0;
	    var posEnd = 0;
	    var re = new RegExp();
	    re.compile("(colSpan=|rowSpan=)([0-9]+) ", "g");
	    var sInput = sAll;
	    var arr;
	    //var sb = new Sys.StringBuilder();
	    while ((arr = re.exec(sInput)) != null) {
	        //alert(arr.index + "-" + arr.lastIndex + " |" + arr[0]+"|"+ " |" + RegExp.$1+"|");
	        posEnd = arr.index;
	        var s1 = RegExp.$2;
	        sb.append(sAll.substring(posStart, posEnd + 8)); // 8为colspan=的长度
	        sb.append('"' + s1 + '" ');
	        posStart = arr.lastIndex;
	    }
	    if (posStart > 0 && posStart < sAll.length) {
	        sb.append(sAll.substring(posStart, sAll.length));
	    } else if (posStart == 0) {
	        //没有合并单元格
	        sb.append(sAll);
	    }
	} else {
    	sb.append(sAll);
	
	}
	sb.append('</TABLE>');
	
	//CopyToPub(sb.toString());
	//alert(sb.toString());
	
	return sb.toString();
	
	function _addTabProp(sb,propName) {
		var s = oTable.getAttribute(propName);
		if(IsSpace(s) == false)	sb.append(propName+'="'+s+'" ');
	}
	
}
function getSaveReportStr() {
    ///取得要保存的E表内容串。
    
    var oTable = $id("t");
    var s1 = e_TransReportStr(oTable, false);
    s1 = attachMergeTag(s1);
    s1 = RepStr(s1, "'", "&apos;"); //替换单引号
    s1 = RepStr(s1, ">\r\n", ">"); //替换换行符
    //CopyToPub(s1);
    //alert(s1);
    return s1;
}

function CreateReport(rows,cols) {
	divTopHead.innerHTML = getTopHeadStr(cols,true);
	divLeftHead.innerHTML = getLeftHeadStr(rows,true);
	$id("t").outerHTML = getMainStr(rows,cols);
	
}
/**
* 根据列数得到顶行表格的串
**/
function getTopHeadStr(cols,bNewReport){
	var sb = new Sys.StringBuilder();
	var s ='<table id=tabTopHead  cellPadding="2" cellSpacing="0"	frame="box" style="font-size:'+fcpub.fontsize+'px;margin-top:0;margin-left:0;BORDER-RIGHT: 0px; TABLE-LAYOUT: fixed; BORDER-TOP: black 1px solid;  BORDER-LEFT: black 1px solid;  BORDER-BOTTOM: 0px; " >' ;
	sb.append(s);
	
	for(var i=0;i<cols;i++){
		s='<COL style="WIDTH:' + fcpub.colWidth + '">';
		sb.append(s);
	}		
	s='<TR align="center" >';
	sb.append(s);
	for(var i=0;i<cols;i++){
		s='<TD class="top_td">'+IntToLbl(i+1)+(bNewReport?"":GetColLabel(i))+'</TD>';
		sb.append(s);
	}		
	sb.append("</TR></TABLE>");
	return sb.toString();		
}
/**
* 根据行数得到左边列表格的串
**/
function getLeftHeadStr(rows,bNewReport){
	var sb = new Sys.StringBuilder();
	var s ='<TABLE id=tabLeftHead style="font-size:'+fcpub.fontsize+'px;margin-top:0;margin-left:0; TABLE-LAYOUT: fixed; BORDER-TOP: 1px solid;  BORDER-LEFT: 1px solid; BORDER-Right: 1px solid;  BORDER-BOTTOM: 1px solid; "  cellSpacing="0"  cellPadding="0" ><colgroup><COL style="WIDTH:'+fcpub.firstColWidth+';" align=center ></colgroup> ' ;
	sb.append(s);
	
	for(var i=0;i<rows;i++){
		s='<TR style="HEIGHT:' + fcpub.rowHeight + '" ><TD class="left_td">'+(i+1)+(bNewReport?"":GetRowLabel(i))+'</TD></TR>';
		sb.append(s);
	}		
	sb.append("</TR></TABLE>");
	return sb.toString();		
}
/**
* 根据行数列数得到主表格的串

**/
function getMainStr(rows,cols){
	var sb = new Sys.StringBuilder();
	var s = '<TABLE cellPadding="0" cellSpacing="0"	frame="box" border="1" id="t" style="font-size:' + fcpub.fontsize + 'px;TABLE-LAYOUT: fixed; BORDER-COLLAPSE: collapse"   onmousedown="t_onmousedown()" onmousemove="t_onmousemove()" onmouseup="t_onmouseup()"	e_paper_margin_left="8" e_paper_margin_top="8" e_paper_margin_right="8" e_paper_margin_bottom="8" e_page_size="4" e_page_orientation="1" e_page_style="1"	> ';
	//borderColor="lightgrey" borderColorDark="white"  margin-top:0;margin-left:0; z-index:-5; border="1"
	sb.append(s);
	var sb1 = new Sys.StringBuilder();
	for(var i=0;i<cols;i++){
		s='<COL style="WIDTH:' + fcpub.colWidth + '">';
		sb.append(s);
		sb1.append("<TD></TD>");
	}		
	var s1=sb1.toString();
	for(var i=0;i<rows;i++){
		s='<TR style="HEIGHT:' + fcpub.rowHeight + '">'+s1+'</TR>';
		sb.append(s);
	}		
	sb.append("</TABLE>");
	return sb.toString();		
}
/**
* 同步列数得到顶行表格的串
**/
function setTopHeadTabStr(){
	var cols = $id("t").childNodes(0).childNodes.length;
	var sb = new Sys.StringBuilder();
	var s ='<table id=tabTopHead  cellPadding="2" cellSpacing="0"	frame="box" style="font-size:'+fcpub.fontsize+'px;margin-top:0;margin-left:0;BORDER-RIGHT: 0px; TABLE-LAYOUT: fixed; BORDER-TOP: black 1px solid;  BORDER-LEFT: black 1px solid;  BORDER-BOTTOM: 0px;"  >' ;
	sb.append(s);
	
	for(var i=0;i<cols;i++){
		s='<COL style="WIDTH:' + $id("t").childNodes(0).childNodes(i).style.width + '">';
		sb.append(s);
	}		
	s='<TR align="center" >';
	sb.append(s);
	for(var i=0;i<cols;i++){
		s='<TD class="top_td">'+IntToLbl(i+1)+GetColLabel(i)+'</TD>';
		sb.append(s);
	}		
	sb.append("</TR></TABLE>");
	$id("tabTopHead").outerHTML =  sb.toString();		
}
/**
* 同步行数得到左边列表格的串
**/
function setLeftHeadTabStr(){
	var rows = $id("t").rows.length;
	var sb = new Sys.StringBuilder();
	var s ='<TABLE id=tabLeftHead style="font-size:'+fcpub.fontsize+'px;margin-top:0;margin-left:0; TABLE-LAYOUT: fixed; BORDER-TOP: 1px solid;  BORDER-LEFT: 1px solid; BORDER-Right: 1px solid;  BORDER-BOTTOM: 1px solid; "  cellSpacing="0"  cellPadding="0" ><colgroup><COL style="WIDTH:'+fcpub.firstColWidth+';" align=center ></colgroup> ' ;
	sb.append(s);
	
	for(var i=0;i<rows;i++){
		s='<TR style="HEIGHT:' + $id("t").rows(i).style.height + '" ><TD class="left_td">'+(i+1)+GetRowLabel(i)+'</TD></TR>';
		sb.append(s);
	}		
	sb.append("</TR></TABLE>");
	$id("tabLeftHead").outerHTML =  sb.toString();		
}
/**
* 同步tr的offsetHeight到tr的style.height
*@date 2008-01-24
**/
function setRowHeightOffset(){
    var arrHeight=new Array();
	var i,arrI=0;
	var rows = $id("t").rows.length;
	for(i=0;i<rows;i++){
	    if($id("t").rows(i).style.pixelHeight != $id("t").rows(i).offsetHeight){
		    arrHeight[arrI] = {pos:i,height:$id("t").rows(i).offsetHeight} ;
		    arrI++;
	    }
	}		
    for(i=0;i<arrI;i++){
        $id("t").rows(arrHeight[i].pos).style.height = arrHeight[i].height; 
    }		

}

/**
* 将HTML中出现的替换成XML标准
**/
function RepHtmToXml(s){
	s = RepStr(s,'&nbsp;','&amp;nbsp;');
	return s;
}
/**
//检查报表是否变化了，提示保存
**/
function CheckReportChange() {
	//if(blnRunMode)return
	if(blnChange){
		var ret = window.confirm("报表内容已改变，需要保存吗？按 [确定] 则保存!");		
		if (ret) {
			SaveReport()
		}
		else {
			blnChange=false
		}
	}
		
}

/**
取运行报表的数据源信息  no use
2008-05-21
**/
function getDataSourceInfo(sDataSource){
//运行报表的URL串

	//pubDataSource =	"default,dsnName" 逗号分开的此次后台要打开的数据源名称,如为内建数据集则此值为空，就表示无须试连数据库
	var sDs = "";
	var sUrlDs=parent.Request.QueryString("urldatasource").toString(); //通过运行报表的url来指定数据源
	if(sUrlDs == "undefined"){	
	    //if(typeof(pubDataSource) == "undefined") 
	    //    var pubDataSource1 =sDataSource;
	    //else
    	//    var pubDataSource1=pubDataSource;
	    
	    /*    
		if(IsSpace(pubDataSource1)==false){ //计算此次运行报表后台需要打开的数据库连接
			var arr = pubDataSource1.split(',');
			var l=arr.length;
			var i=0;
			if(arr[0]=="default") {
				i++;
				sDs = "default"; //以它开头
			}
			if(l>=1){
				var sDs1="";
				var oXml = SetDomFile("../.."+fcpubdata.userDir+"/xml/econfig.xml");
				var ll = oXml.documentElement.childNodes(0).childNodes.length;
				for(;i<l;i++){
					for(var j=0;j<ll;j++){
						if(arr[i]==oXml.documentElement.childNodes(0).childNodes(j).getAttribute("name")){
							sDs1 += oXml.documentElement.childNodes(0).childNodes(j).xml ;
						}
					}
				}
				if(sDs1 != "") {
					sDs1 = "<datasources>" + sDs1 + "</datasources>";
					sDs += sDs1;
				} 
			}
		} */
		
		//sDs = escape(sDs);
		if(IsSpace(sDataSource)==false) sDs = sDataSource;
	}else{ //通过运行报表的url来指定数据源
		//sDs = 	unescape(sUrlDs); //sUrlDs应是加了一个escape 的
		sDs = sUrlDs;
	}
	return sDs;
}
function batchPrint(sXml,oPageSet){
///成批打印报表文件
    new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=genHtmlFile", sXml,
		function(result) {
		    var sRet = result.value;
		    var ooPageSet = result.context;
		    //alert(sRet);	
		    if (IsSpace(sRet)) return;
		    if (sRet.substring(0, 12) != "<reportfile>") {
		        alert(sRet);
		        return;
		    }
		    var oXml = SetDom("<root>" + sRet + "</root>");

		    fcpub.batchPrintUrlArr = new Array();
		    var pageAll = 0;
		    for (var k = 0; k < oXml.documentElement.childNodes.length; k++) {
		        var errMsg = oXml.documentElement.childNodes(k).childNodes(2).text;
		        if (IsSpace(errMsg) == false) { //生成文件时出错
		            alert(errMsg);
		            return;
		        }
		        var totalPages = oXml.documentElement.childNodes(k).childNodes(1).text;
		        totalPages = ToInt(totalPages);
		        var fileName = oXml.documentElement.childNodes(k).childNodes(3).text;
		        var sRandom = ""; // "?r="+Math.random();
		        if (IsSpace(ooPageSet)) {
		            fcpub.oPageSet = setPageSetObj(oXml.documentElement.childNodes(k).childNodes(4));
		        } else {
		            fcpub.oPageSet = ooPageSet;
		        }
		        for (var i = 0; i < totalPages; i++) {
		            var sFile = location.protocol + "//" + location.host + fcpubdata.path + "/ebtmpfile/printtemp/" + fileName + "_" + (i + 1) + ".htm" + sRandom;
		            fcpub.batchPrintUrlArr[pageAll + i] = sFile;
		        }
		        pageAll += totalPages;
		    }
		    printNextJob(0);

		}
	, oPageSet);		 

}
function setPageSetObj(oNode){
	var oPageSet = new Object();
	//oPageSet.e_page_style = oNode.getAttribute("e_page_style");
	//oPageSet.e_print_layout_index = oNode.getAttribute("e_print_layout_index");
	//oPageSet.e_header_footer_setup = oNode.getAttribute("e_header_footer_setup");
	oPageSet.e_page_size = oNode.getAttribute("e_page_size");
	//oPageSet.e_rows_per_page = oNode.getAttribute("e_rows_per_page");
	//oPageSet.e_print_layout_row = oNode.getAttribute("e_print_layout_row");
	//oPageSet.e_print_layout_col = oNode.getAttribute("e_print_layout_col");
	oPageSet.e_paper_width = oNode.getAttribute("e_paper_width");
	oPageSet.e_paper_height = oNode.getAttribute("e_paper_height");
	oPageSet.e_paper_margin_left = oNode.getAttribute("e_paper_margin_left");
	oPageSet.e_paper_margin_top = oNode.getAttribute("e_paper_margin_top");
	oPageSet.e_paper_margin_right = oNode.getAttribute("e_paper_margin_right");
	oPageSet.e_paper_margin_bottom = oNode.getAttribute("e_paper_margin_bottom");
	//oPageSet.e_columns = oNode.getAttribute("e_columns");
	oPageSet.e_page_orientation = oNode.getAttribute("e_page_orientation");
    return oPageSet;
}
function printNextJob(index){
///做批量打印的通用函数,在调用前应将要打印的URL放入到 fcpub.batchPrintUrlArr 数组中. 将打印页面的设置信息放到 fcpub.oPageSet中, index 一般从0开始打印.
    if ( document.all(fcpub.batchPrintIframeName) == null ){
	    document.body.insertAdjacentHTML("BeforeEnd", "<IFRAME id="+fcpub.batchPrintIframeName+" name="+fcpub.batchPrintIframeName+" src='' width=0 height=0></IFRAME>");
    }
    if(fcpub.batchPrintTime == 0 || window.frames(fcpub.batchPrintIframeName).oFcsoftPrint.printState == "over"){
        if(fcpub.batchPrintTime != 0) {
            window.clearInterval(fcpub.batchPrintTime);
            fcpub.batchPrintTime = 0;
        }
        if(index>=fcpub.batchPrintUrlArr.length) return;
        var oIframe = $id(fcpub.batchPrintIframeName);
        oIframe.src = fcpub.batchPrintUrlArr[index];
        oIframe.onreadystatechange= function () {
            if($id(fcpub.batchPrintIframeName).readyState != "complete") return;
            fcpub.oPrint = getPrintCom(window.frames(fcpub.batchPrintIframeName),fcpub.oPageSet);
		    if(fcpub.oPrint == null){
		        if(fcpub.isPrintComReg != "失败"){ //控制只提示一次.
		            alert("打印activeX控件初始化失败! 可能是打印activeX控件未注册成功,需要将当前区域加入到可信任站点,以便让它注册上.");
		            fcpub.isPrintComReg = "失败";
		        }
		        return;
		    }
            window.frames(fcpub.batchPrintIframeName).oFcsoftPrint.printState ="start";
            window.frames(fcpub.batchPrintIframeName).oFcsoftPrint.Print(true);
            fcpub.batchPrintTime = window.setInterval("printNextJob("+(index+1)+")",500);
        }
    }

}

function getPrintCom(ooWin,oPageSet){
    ///取得打印对象, oPageSet 打印页面的参数对象
	var oPrint = ooWin.document.getElementById("oFcsoftPrint") ;
	if(oPrint == null){
		var sPrint = "<object id=\"oFcsoftPrint\" style=\"display:none;\" classid=\"clsid:CA03A5A8-9890-49BE-BA4A-8C524EB06441\" codebase=\"eprint.cab#Version=3,0,0,24\" VIEWASTEXT> </object>";
		ooWin.document.body.insertAdjacentHTML("BeforeEnd",sPrint);
		oPrint = ooWin.document.getElementById("oFcsoftPrint") ;
	}
	try {
		oPrint.InitPrint();
	}catch(e){
		//alert("再试一次如还是这样,则可能是打印activeX控件未注册成功,需要将当前区域加入到可信任站点,以便让它注册上.");
		return null;
	}

	//oPrint.companyName = "大庆油田有限责任公司第九采油厂";
	//oPrint.seriesNo = "8480-3613-1202-1920";
	oPrint.companyName = "北京浩太同益科技发展有限公司";
	oPrint.seriesNo = "6304-1031-1852-5216";


	//将打印参数赋给eprint控件
	if(typeof(oPageSet) != "undefined"){
	    oPrint.SetMarginMeasure(1); //1 表示单位为mm 2 表示in
	    var defaultMargin = 8 ; //内部定的最小边距
	    if(IsSpace(oPageSet.e_paper_margin_top) == false) {
		    oPrint.marginTop = Num(oPageSet.e_paper_margin_top);
	    }else {
		    oPrint.marginTop = defaultMargin;
	    }	
	    //oPageSet.e_paper_margin_top = oPrint.marginTop;
	    if(IsSpace(oPageSet.e_paper_margin_bottom) == false) {
		    oPrint.marginBottom = Num(oPageSet.e_paper_margin_bottom);
	    }else {
		    oPrint.marginBottom = defaultMargin;
	    }	
	    //oPageSet.e_paper_margin_bottom = oPrint.marginBottom ;
    	
	    if(IsSpace(oPageSet.e_paper_margin_left) == false) {
		    oPrint.marginLeft = Num(oPageSet.e_paper_margin_left);
	    }else {
		    oPrint.marginLeft = defaultMargin;
	    }	
	    //oPageSet.e_paper_margin_left = oPrint.marginLeft ;
    	
	    if(IsSpace(oPageSet.e_paper_margin_right) == false) {
		    oPrint.marginRight = Num(oPageSet.e_paper_margin_right);
	    }else {
		    oPrint.marginRight = defaultMargin;
	    }	
	    //oPageSet.e_paper_margin_right = oPrint.marginRight;
    	
	    if(oPageSet.e_page_orientation == "0")
		    oPrint.orientation = 2;//横向打印
	    else
		    oPrint.orientation = 1;
    	
	    if(IsSpace(oPageSet.e_page_size) == false) oPrint.paperSize = _SizeToOther(oPageSet.e_page_size);

	    if (IsSpace(oPageSet.e_paper_width) == false) oPrint.pageWidth = Num(oPageSet.e_paper_width);
	    if (IsSpace(oPageSet.e_paper_height) == false) oPrint.pageHeight = Num(oPageSet.e_paper_height); //此行可能会中断vs.net调试器,但程序实际能正常运行下去.

	    //try{
	    if(oPageSet.e_page_size == "13" && oPageSet.e_page_orientation == "0"){ //自定义纸张且横向时
		    if(IsSpace(oPageSet.e_paper_width) == false ) oPrint.pageHeight = Num(oPageSet.e_paper_width);
	        if (IsSpace(oPageSet.e_paper_height) == false) oPrint.pageWidth = Num(oPageSet.e_paper_height); //此行可能会中断vs.net调试器,但程序实际能正常运行下去.

		    defaultMargin = oPrint.marginLeft;
		    oPrint.marginLeft = oPrint.marginTop;
		    oPrint.marginTop = oPrint.marginRight;
		    oPrint.marginRight = oPrint.marginBottom;
		    oPrint.marginBottom = defaultMargin;
		    oPrint.orientation = 1;
		    
		    
	    }
	    //}catch(e1){}
    
    	if(IsSpace(oPageSet.e_printer_name) == false) oPrint.defaultPrinterName = oPageSet.e_printer_name;
	}
	//页眉页脚
	var sHeader="",sFooter="";
	oPrint.header = sHeader;
	oPrint.footer = sFooter;
	return oPrint;	
	
	function _SizeToOther(sour) {
		var s = "";
		switch (sour) {
			case "1" : s = "A1";break;	
			case "2" : s = "A2";break;	
			case "3" : s = "A3";break;	
			case "4" : s = "A4";break;	
			case "5" : s = "A5";break;	
			case "6" : s = "B1";break;	
			case "7" : s = "B2";break;	
			case "8" : s = "B3";break;	
			case "9" : s = "B4";break;	
			case "10" : s = "B5";break;	
			case "11" : s = "A0";break;	
			case "12" : s = "B0";break;	
			case "13" : s = "自定义";break;	
			case "14" : s = "B4 JIS";break;	
			case "15" : s = "B5 JIS";break;	
			default: s = "A4";break;
		}
		return s;
	}


}

function attachMergeTag(sReportXml) {
    ///加上<fc />标记合并格到报表文件串

    var arrRow = new Array(); //保存行号
    var arrData = new Array(); //保存列号数据

    var oXml = SetDom(sReportXml);
    if (oXml.documentElement == null) {
        CopyToPub(sReportXml);
        alert("报表XML串是不符合XML格式");
        
        return;
    }
    var sTd = "TD";
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer) sTd = "td";
    //e_merge="1,3-1,4"
    var oList = oXml.documentElement.selectNodes("/TABLE/TBODY/TR/" + sTd + "[@e_merge!='']");
    var ll = oList.length;
    for (var i = 0; i < ll; i++) {
        var attrValue = oList[i].getAttribute("e_merge");
        var arrS = attrValue.split('-');
        var arrSS1 = arrS[0].split(',');
        var arrSS2 = arrS[1].split(',');
        var sRow = 0, sCol = 0, eRow = 0, eCol = 0;
        sRow = ToInt(arrSS1[0]) - 1;
        sCol = ToInt(arrSS1[1]) - 1;
        eRow = ToInt(arrSS2[0]) - 1;
        eCol = ToInt(arrSS2[1]) - 1;

        for (var j = 0; j <= eRow - sRow; j++) {
            var pos = 0;
            if (j > 0 || eCol - sCol > 0) {
                pos = Array.indexOf(arrRow, j + sRow);
                if (pos < 0) {
                    arrRow[arrRow.length] = j + sRow;
                    //arrData.Add(new ArrayList());
                    arrData[arrData.length] = new Array();
                    pos = arrRow.length - 1;
                }
            }
            var k = 0;
            if (j == 0) k = 1;

            for (; k <= eCol - sCol; k++) {
                var arrCol = arrData[pos];
                arrCol[arrCol.length] = k + sCol;
            }
        }


    }
    var fcNodeName = "FC";
    //if (Sys.Browser.agent != Sys.Browser.InternetExplorer) fcNodeName = sTd;
    var ofcNode = SetDom("<"+fcNodeName +"/>");
    var fcNodeBak = ofcNode.documentElement;

    var oRowList = oXml.documentElement.selectNodes("/TABLE/TBODY/TR");
    
    //var fcNodeBak = oXml.createNode(1, "fc", "");
    //将数组排序
    for (var ii = 0; ii < arrRow.length; ii++) {
        var arr1 = arrData[ii];
        arr1.sort();
        var curRow = arrRow[ii];
        for (var jj = 0; jj < arr1.length; jj++) {
            var newCol = arr1[jj];

            var fcNode = fcNodeBak.cloneNode(true);
            //var tmpNode = oXml.documentElement.childNodes[1].childNodes[curRow];
            //tmpNode.insertBefore(fcNode, tmpNode.childNodes[newCol]);
            var tmpNode = oRowList[curRow];
            var posNode;
//            if (Sys.Browser.agent != Sys.Browser.InternetExplorer) {
//                var oTmpList = tmpNode.selectNodes(sTd);
//                if (oTmpList.length > newCol) {
//                    posNode = oTmpList[newCol];
//                } 
//            } else {
//                posNode = tmpNode.childNodes[newCol];
//            }
            posNode = NavJs.xmlChild(tmpNode,newCol);
            tmpNode.insertBefore(fcNode, posNode);
        }
    }
    //CopyToPub(oXml.documentElement.xml);
    //alert(oXml.documentElement.xml);
    return oXml.documentElement.xml;

}

/*
function eblayoutToRun(obj, oContXml) {
    ///不要运行E表文件的eblayout控件设计串转运行串, 2012-06-21
    ///obj 为eblayout控件对象, oContXml 为表单中控件的XML对象

    var oRecRows = getRecRowsObj(obj.getAttribute("recRows"));
    var oStartRow = [];
    var oContsId = [];
    var sbHide = new Sys.StringBuilder();
    var sbDs = new Sys.StringBuilder();
    var sbAll = new Sys.StringBuilder();

    var arrDs = new Array();
    var sbConts = new Sys.StringBuilder();
    //扫描表单中的控件
    for (var j = 0; j < oContXml.documentElement.childNodes.length; j++) {
        var sNodeName = oContXml.documentElement.childNodes[j].nodeName;
        if (sNodeName == "ebiao" || sNodeName == "tab" || sNodeName == "eblayout") continue;
        for (var k = 0; k < oContXml.documentElement.childNodes[j].childNodes.length; k++) {
            var contId = oContXml.documentElement.childNodes[j].childNodes[k].text;
            var oId = $get(contId, obj);
            if (oId == null) continue;

            var sDs = oId.getAttribute("dataset");
            var isGridDs = _isGridDs(oRecRows, sDs);

            var oTD = oId.parentNode;
            if (oTD == null) continue;

            if (isGridDs) {
                
                var tableId = "t"; //table的id固定为t
                oTD.setAttribute("controlId", contId);

                var sTmp = oContsId[sDs];
                if (IsSpace(sTmp)) sTmp = "";
                oContsId[sDs] = sTmp + contId + ",";
                //找一个最小的行作为明细数据集的起始行
                var r = oTD.parentNode.rowIndex;
                var oldr;
                if (IsSpace(oStartRow[sDs])) {
                    oldr = r;
                } else {
                    oldr = oStartRow[sDs][0];
                }


                oStartRow[sDs] = [Math.min(r, oldr), sDs, tableId];
                //隐藏所有的动态显示控件
                if (oId.getAttribute("controltype") == "dropdownlist")
                    oId.setAttribute("visible", "否");
                else
                    oId.style.display = "none";


            } else {
                oTD.id = "eb_cell_"+contId;
                //oName[0].id = "eb_cell_" + contId; //将原来有name属性的控件的ID设置为对应eform控件的ID前+"eb_cell_" , 运行时按此找到控件的位置.
                //oName[0].style.visibility = "hidden";
                sbHide.append("<" + contId + ">1</" + contId + ">");
            }
            //移动eform中的控件到布局控件上
            oId.style.left = 0;
            oId.style.top = 0;
            var sOuterHtml = oId.outerHTML;
            oId.outerHTML = "";
            //obj.insertAdjacentHTML("beforeEnd",sOuterHtml);
            NavJs.insertHtml("beforeEnd", obj, sOuterHtml);

        }
        var oDsSort = oStartRow.sort(function(a, b) { return a[0] - b[0]; });

        var j;
        for (j in oDsSort) {
            //for(var j=0;j<oDsSort.length;j++){
            var sDs = oDsSort[j][1];
            var sConts = oContsId[sDs];
            if (IsSpace(sConts) == false) {
                sConts = sConts.substring(0, sConts.length - 1);
            }
            sbDs.append("<" + sDs + "><startRow>" + oDsSort[j][0] + "</startRow><contsId>" + sConts + "</contsId><tableId>" + oDsSort[j][2] + "</tableId></" + sDs + ">"); //加一个html table的ID
        }
    }

    sbAll.append("<root><hide>");
    sbAll.append(sbHide.toString());
    sbAll.append("</hide><dss></dss><conts>");
    sbAll.append(sbDs.toString());
    sbAll.append("</conts></root>");

    NavJs.child(obj, "div", 0).setAttribute("dsXml", escape(sbAll.toString()));
    //obj.childNodes[0].setAttribute("dsXml",escape(sbAll.toString()));
        

    function _isGridDs(oRecRows, sDs) {
        ///判断是否是明细数据集,用于layout控件
        if (oRecRows == null) return false;
        if (typeof (oRecRows[sDs]) == "undefined") { return false; }
        return true;
    }
}
*/

/**
* 保存时修改e_merge属性, 从adjust.js中移入
*@date 2006-06-28
**/
function shiftMerge() {
    //调节e_merge属性
    //	$id("t").rows(SelObj.cells[0].tdrow).cells(SelObj.cells[0].tdcol).e_merge =(SelObj.sRowSort+1)+ ","+(SelObj.sColSort+1)+"-"+(SelObj.eRowSort+1)+","+(SelObj.eColSort+1) ; //e_merge="1,3-1,4"
    var rows = tabLeftHead.rows.length;
    for (var i = 0; i < rows; i++) {
        for (var tr = $id("t").rows[i], j = 0; j < tr.cells.length; j++) {
            var iRowSpan = tr.cells[j].rowSpan;
            var iColSpan = tr.cells[j].colSpan;
            if (iRowSpan > 1 || iColSpan > 1) {
                var colNo = TDToCol(tr.cells[j]);
                tr.cells[j].setAttribute("e_merge", (i + 1) + "," + (colNo + 1) + "-" + (i + iRowSpan) + "," + (colNo + iColSpan));
            } else {
                tr.cells[j].removeAttribute("e_merge");
            }
            //colNo += iColSpan;
        }
    }

}
/**
* 保存前处理, 2012-07-16 my add
**/
function saveBeforeAction() {
    SelObj.curTD.oTD.innerText = $id("txtEdit").value;
    shiftMerge();
}