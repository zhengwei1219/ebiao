/// <reference name="MicrosoftAjax.js" />
/// <reference path="/ebsys/fceform/js/fcpub.js" />
if(typeof(Eapi.OpenForm) != "function")
{
    Eapi.OpenForm = function(){}
    Eapi.OpenForm.prototype =
    {
        openMain : OpenBillMain ,
        openMenu : DjOpenMenu ,
        openTest : DjOpenTest ,
        openTestFile : DjOpenTestFile ,
        open   : DjOpen
    }
    Eapi.OpenForm.registerClass("Eapi.OpenForm");
}

/**
*打开窗体的调用模块
*@param tmpNo 单据模版编号,djNo 单据数据ID,iAction =1为新增=2为修改, UserID为当前操作员ID
*@param arrWorkFlow 工作流用的参照文档
*@param ComputerName 客户端的机器名
*@param modNo 外部传入的模块编号(C3),用于和单据模版中的模块编号进行比较是否相等.
*@param openMode ="有模式窗口" 表示强制打开方式为有模式打开
*@param sOpenCommand 为在打开表单后用eval运行的命令串,用于OpenUserQuery中
*@param sVersion =测试/正式/直接 为空表示测试
*@param sTitle 窗口标题 为空则取缺省标题

**/
function OpenBillMain(tmpNo, djNo, iAction, oRequest, arrWorkFlow, ComputerName, modNo, openMode, sOpenCommand, sVersion, sTitle, callback, context) {
	//alert(tmpNo)
	
		//new Eapi.Str().showWait("正在打开表单....");
	//if(tmpNo == "ziliao_hp" || tmpNo == "jxc_hp" || tmpNo == "saleMain" || tmpNo == "stockMain"){
	//	new Eapi.Str().showWait("end");
	//}

	var sPathBase=location.protocol + "//"+location.host+fcpubdata.path+"/fceform/";
	if(isSpace(sVersion)){
		//var s = location.href ;
		//var ss = sPathBase + "common/djempty.htm" ;
		//if(s==ss){
	    var up_isfile = parent.Request.QueryString("isfile").toString();
        if(up_isfile == "yes"){
            sVersion="测试文件";
        }else if(up_isfile == "test"){
		    sVersion="测试";
		}else{
			sVersion="直接";   //测试/测试文件/直接 
		}
	}
   //if(sVersion != "测试文件") sVersion="测试";
   
    if(tmpNo == "userfunction1" ) sVersion = "直接";
	if(typeof tmpNo != "undefined" ) tmpNo=new Eapi.Str().trim(tmpNo);
	var tmpNoBak = tmpNo; //备份原来的 2009-01-19 add
	tmpNo=_getDjsn(tmpNo); //得到真正的djsn
	
	var htmfile="djframe.htm?isfile=release";
	var posstyle="";
	var arr=new Array();
	var curdjid="" ; 
	var sPos ;
	var arrPos;
	//找到窗体的位置
  if(sVersion=="测试"){
		sPos=fc_select("select djposition,dj_name,djid from FC_BILLZL where djsn='"+tmpNo+"'",1,1);
		var oXml=SetDom(sPos);
		if(oXml.documentElement == null){
			if(isSpace(sPos) == false){
				alert(sPos);
			}
			return; 
		}
		sPos = NavJs.xml(oXml.documentElement.childNodes[0]);
		curdjid= NavJs.getNodeValue11(oXml,0,2);
		oXml = SetDom(sPos);
		sPos= NavJs.getNodeValue1(oXml,0);
		//alert(sPos)
		arrPos=sPos.split(",");

		if(arrPos.length>=6){
			if(typeof iAction =="undefined" || iAction==0 ){
				if(arrPos[6]=="新增")
					iAction=1;
				if(arrPos[6]=="修改")
					iAction=2;
				if(arrPos[6]=="展现")
					iAction=3;
			}
			htmfile = "djframe.htm?isfile=test"	;
				
		}	


		if(arrPos.length>=4){
			var iheight=ToInt(arrPos[3])	;
			posstyle=";dialogWidth:"+(ToInt(arrPos[2]))+"px;dialogHeight:"+iheight+"px";
		
		}
		if(arrPos.length>=5){
			if(arrPos[4]=="居中")
				posstyle+=";center:yes;";
			else
				posstyle+=";dialogLeft:"+arrPos[0]+"px;dialogTop:"+arrPos[1]+"px;";
		}	
  		if(fcpubdata.databaseTypeName == "oracle"){
			arr[0]=loadClob("<no>xmltext</no><no>"+curdjid+"</no>") ; 		
			//arr[0]=UnTransSql(arr[0]);
  		}else{
			arr[0]=SqlToField("select xmltext from FC_BILLZL where djsn='"+tmpNo+"'",1,1);
		}
		//alert(arr[0])
		//CopyToPub(arr[0])
		if(isSpace(openMode)) {
			try{
			openMode = arrPos[7];
			}catch(e){		openMode="当前窗口";}
		}
		arr[7]=openMode;  //打开方式
		arr[8]=sOpenCommand;
		if(isSpace(sTitle)){
		    //表单中文名称作窗口标题
			arr[9]=NavJs.getNodeValue1(oXml,1)+"["+tmpNo+"]";
		}else{
			arr[9]=sTitle;
		}
  }else if(sVersion == "测试文件") { //以测试文件方式打开,点预览后运行
		htmfile="djframe.htm?isfile=yes";
	    var sTypePath = "";
	    var up_djsn = parent.Request.QueryString("djsn").toString();
	    if(tmpNo != up_djsn){  //直接用DjOpen,而不是用 opendj.htm来调用到此
		    var posPath = up_djsn.lastIndexOf("/");
		    if(posPath >= 0) sTypePath = up_djsn.substring(0,posPath)+"/";
		}
		var sAllPath = sTypePath + tmpNo;
		if (sAllPath.substring(0, 1) != "/") sAllPath = "/" + sAllPath;
		arr[0]=readdesignhtml("<file>"+sAllPath+".dj</file>");
		if(isSpace(sTitle) == false){
			arr[9]=sTitle;
		}	
	
  } else { //直接打开
          arr[0] = tmpNo + ".htm";
//          if (openMode == "有模式窗口") {
//              if (isSpace(sTitle)) {
//                  var sDbTitle = SqlToField("select dj_name from FC_BILLZL where djsn='" + tmpNo + "'");
//                  if (IsSpace(sDbTitle))
//                      arr[9] = arr[0];
//                  else
//                      arr[9] = sDbTitle;
//              } else {
//                  arr[9] = sTitle;
//              }
//          }

          arr[9] = sTitle;
          
          var sdjtype;
          //读出父窗口的？后面的djtype参数值给当前要打开的表单作djtype参数
          try {
              if (parent.location.pathname.indexOf("djframe.htm") >= 0) {
                  sdjtype = parent.Request.QueryString("djtype").toString();
                  if (sdjtype != "undefined") {
                      htmfile = htmfile + "&djtype=" + sdjtype;
                  }
              }
          } catch (e) {
              //不用djframe.htm来运行表单时会异常,parent.Request == undefined
          };

          //alert(tmpNoBak);
          var tmpDjType = _getDjtype(tmpNoBak);
          //alert(tmpDjType);
          if (IsSpace(tmpDjType) == false) sdjtype = tmpDjType;
          
          var spathBillPos = "fceform/dj/";
          if (IsSpace(sdjtype) == false && sdjtype != "ST" && sdjtype != "LR") {
              var objBillType = BillTypeNameToPath(sdjtype);
              spathBillPos = objBillType.path;
          } 
          //读billpos文件中的位置信息
          var oXmlFile = SetDomFile(location.protocol + "//" + location.host + fcpubdata.path + "/" + spathBillPos + "billpos.xml");
          if (oXmlFile.documentElement != null) {
              var oNode = oXmlFile.documentElement.selectSingleNode("//tr[td='" + tmpNo + "']");
              if (oNode == null && spathBillPos != "fceform/dj/") { //再找一下系统目录
                  oXmlFile = SetDomFile(location.protocol + "//" + location.host + fcpubdata.path + "/" + "fceform/dj/" + "billpos.xml");
                  oNode = oXmlFile.documentElement.selectSingleNode("//tr[td='" + tmpNo + "']");
              }
              if (oNode != null) {
                  sPos = NavJs.textContent(oNode.childNodes[1]);
                  arrPos = sPos.split(",");
                  if (arrPos.length >= 4) {
                      var ieVersion = getIEVersion();
                      var offsetValue = 0;
                      if (Sys.Browser.agent != Sys.Browser.InternetExplorer || (Sys.Browser.agent == Sys.Browser.InternetExplorer && ieVersion < 7)) offsetValue = 60;
                      posstyle = ";dialogWidth:" + (ToInt(arrPos[2])) + "px;dialogHeight:" + (ToInt(arrPos[3]) + offsetValue) + "px"; //30是不同环境下窗口高度的调节值.它为0或是30.
                  }
                  if (arrPos.length >= 5) {
                      if (arrPos[4] == "居中")
                          posstyle += ";center:yes;";
                      else
                          posstyle += ";dialogLeft:" + arrPos[0] + "px;dialogTop:" + arrPos[1] + "px;";
                  }
                  //alert(arrPos[8])
                  if (IsSpace(sTitle) && arrPos.length >= 8) {
                      if (IsSpace(arrPos[8]) == false ) arr[9] = arrPos[8];
                  }
              }
          }	
		
  }

	var sPath=sPathBase+"common/";
  	if(isSpace(djNo) && typeof djNo != "object"){
  		djNo="";
  	}
  	arr[1]=djNo;
  	if(isSpace(iAction) || iAction == "0")iAction=0;
  	if(iAction=="1")iAction=1;
  	if(iAction=="2")iAction=2;
  	if(iAction=="3")iAction=3;

  	arr[2]=iAction;

	//if(isSpace(o)==false)
	arr[3]=oRequest;

	var oArgu = window.dialogArguments;
	if (typeof (oArgu) == "undefined" && window.location.href.indexOf("layout.htm") >= 0) {
	    oArgu = parent.dialogArguments;
	}
	if (typeof (oArgu) == "undefined") {
	    //2011-02-25 改为取顶层窗口
	    var oTopWin = getTopWin();

	    arr[4] = oTopWin; //arrWorkFlow;  //工作流参数
	} else if (oArgu.length > 4) {
	    arr[4] = oArgu[4];
	}
    arr[5]=ComputerName;  //客户端的机器名

    arr[6]=modNo;  //模块编号
    
    htmfile = htmfile +"&djsn="+tmpNo;
    //OpenSys();
  
  //alert(posstyle)  showModelessDialog
    //alert(sOpen)
//  var sRet=window.showModalDialog("fceform/common/djmain.htm",arr,"status:no;dialogHeight:"+screenHeight+"px;dialogWidth:"+screenWidth+"px;dialogTop:"+iTop+"px;dialogLeft:"+iLeft+"px") 
	//new Eapi.Str().showWait("test1")
    
    var openUrlFile = sPath+htmfile;
    if(tmpNo != tmpNoBak) openUrlFile = tmpNoBak;
    
	var sRet ;
	if (openMode == "有模式窗口") {

	    var isNewModalWin = !IsSpace(top.Dialog) && Sys.Browser.agent != Sys.Browser.InternetExplorer;
	    if (isNewModalWin && false) {
	        NavJs.openModalDialog(openUrlFile, arr, winSizeTrans(posstyle), callback, context);
	    } else {
	        sRet = window.showModalDialog(openUrlFile, arr, "resizable:yes;status:yes;" + posstyle);
	    }
		
	}else if(openMode=="无模式窗口"){
	  	sRet=window.showModelessDialog(openUrlFile,arr,"resizable:yes;status:yes;"+posstyle); 
/*	}else if(sOpen=="浮动帧窗口"){
		//top.arr=arr
		//aadd
		//open("http://"+location.host+"/fceform/common/"+htmfile,"rightmain")
		var strHTML=arr[0]
		alert(strHTML)
		window.frames("tt").document.open();
		window.frames("tt").document.write(strHTML);
		window.frames("tt").document.close();
		*/
	}else { //帧窗口打开
		//parent.arr=arr
			
			var spathwin = parent.location.pathname;
			if(spathwin.indexOf('djframe.htm') >= 0){
				top.arrPubEformPara = arr;
			}else{
				parent.arrPubEformPara = arr;
			}
			//aadd
			//fcpubarr = arr
			window.open(openUrlFile,fcpubdata.billOpenWinName);
			/*
			var s1=""
			try{
				var winWidth = arrPos[2]
				var winHeight = arrPos[3]
			}catch(e){ }
			if(IsSpace(winWidth)==false || IsSpace(winHeight)==false){
				s1 = "status=no,toolbar=no,menubar=no,location=no,scrollbars=no "
			}
				window.open(sPath+htmfile,fcpubdata.billOpenWinName,s1)
			*/
			//ChangeWinTitle(arr[9])
			//open("../fceform/common/"+htmfile,"rightmain")
    	//try{}catch(E){}
    	
	}
	//alert("1"+sRet)
	return sRet;
	/**
	* 显示demo版本信息
	*@date 2005-03-07
	**/
//	function OpenSys() {
//		var iLen = 10000 ;
//		var curD = curDate();
//		if(curD > "2007-06-01") iLen = 30;
//		if(curD > "2007-07-01") iLen = 10;
//		if(curD > "2007-08-01") iLen = 5;
//		var   d = new Date();
//		var   t = d.getTime();   
//		t=Math.ceil(t/1000);
//		if(Math.ceil(t/iLen) == (t/iLen)){
//			var numberMillis = 1500;		//窗口延时值
//			var dialogScript = 
//				'window.setTimeout(' +
//				' function () { window.close(); }, ' + numberMillis + ');';
//			var result = 
//				window.showModalDialog(
//				'javascript:document.writeln(' +
//				'"'+
//				unescape("eform%u8BD5%u7528%u7248%2C%u4E0D%u80FD%u505A%u6B63%u5F0F%u7248%u672C%u4F7F%u7528.%3Cbr%3E%u5317%u4EAC%u65B9%u6210%u516C%u53F8%20%u7248%u6743%u6240%u6709%20%u4E0D%u5F97%u590D%u5236%21%21") +
//				'<script>' + dialogScript + '<' + '/script>")'); 
//		}
//    }
	//	

	function _getDjsn(sValue){
	///区别是djsn还是一个URL,并返回真正的djsn
	    var djsn=sValue;
	    var posStart = sValue.indexOf("?djsn=");
	    if(posStart < 0) posStart = sValue.indexOf("&djsn=");
	    if(posStart >= 0){ 
	        var posEnd = sValue.indexOf("&",posStart+1);
	        if(posEnd < 0) posEnd = sValue.length;
	        if(posEnd > posStart+6){
	            djsn = sValue.substring(posStart+6,posEnd);
	        }
        }
        return djsn;
	        
	}
	function _getDjtype(sValue) {
	    ///从url中取出djtype 2011-03-17
	    var djsn = "";
	    var posStart = sValue.indexOf("?djtype=");
	    if (posStart < 0) posStart = sValue.indexOf("&djtype=");
	    
	    //alert(sValue + posStart)
	    
	    if (posStart >= 0) {
	        var posEnd = sValue.indexOf("&", posStart+1);
	        if (posEnd < 0) posEnd = sValue.length;
	        
	        //alert(posEnd+ ">"+ posStart)
	        if (posEnd > posStart + 8) {
	            djsn = sValue.substring(posStart + 8, posEnd);
	        }
	    }
	    return djsn;

	}
	function winSizeTrans(winSize) {
	    ///由  window.showModalDialog 带的winSize定义串转换成新的对象， 2013-02-19
	    var oWinSize = {};

	    var arrSize = winSize.split(";");
	    for (var i = 0; i < arrSize.length; i++) {
	        var sName = arrSize[i];
	        if (sName == "dialogWidth") {
	            var arr1 = sName.split(":");
	            oWinSize.width = ToInt(arr1[1]);
	        }
	        if (sName == "dialogHeight") {
	            var arr1 = sName.split(":");
	            oWinSize.height = ToInt(arr1[1]);
	        }
	    }
	    return oWinSize;
	    //getClientSize(top)
	}
}
/**
*从文件中读设计串并返回
*@date 2004-12-25
**/
function readdesignhtml(sXml) {
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=readdesignhtml",sXml);

}

/**
* 装入oracle的clob字段
*@date 2005-01-05
**/
function loadClob(sXml) {

	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=loadClob",sXml);
	return retX;
}

/**
*改变窗口的标题
*@date 2004-02-24
**/
function ChangeWinTitle(sTitle){
	document.title=sTitle;
	parent.document.title=sTitle;
	try{
	    parent.parent.document.title=sTitle;
	}catch(e){}
}
/**
通过主菜单打开表
*@date 2004-09-29
**/
function DjOpenMenu(tmpNo,sTitle){
	DjOpen(tmpNo,"","","当前窗口","直接",sTitle);
}
/**
* 在当前窗口以测试模式运行表单
*@date 2004-10-11
**/
function DjOpenTest(tmpNo){
	DjOpen(tmpNo,"","","","测试","",parent.Request);
}
/**
* 在当前窗口以测试模式运行文件表单
*@date 2004-12-25
**/
function DjOpenTestFile(tmpNo){
	DjOpen(tmpNo,"","","","测试文件","",parent.Request);
}
/*
function selecttext(sSql,PageNo,PageSize) {
//执行查询
//PageNo页码
//PageSize页尺寸,即一页含多少行
	var sql1="";
	for(var i=0;i<sSql.length;i++) {
		switch (sSql.charAt(i)) {
			case "<" :
				sql1=sql1+"&lt;";
				break;
			case ">" :
				sql1=sql1+"&gt;";
				break;
			default:
				sql1=sql1+sSql.charAt(i);
		}
	}
	//替代非法XML字符
	var sXml="<No>"+sql1+"</No>"+"<No1>"+PageNo+"</No1>"+"<No2>"+PageSize+"</No2>";
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?selecttext",sXml);
	return retX;
}*/
/**
*打开单据,用于一张单据模版调用另一张时.
*tmpNo为单据模版ID,djNo为单据编号(Key),新增时djNo为空.
*步骤: 1.读出此单据模版的XML串,放到页面上.
*     // 2.初始化菜单
*      3.用数据集的base_dset方法运行用djNo替代后的opensql,:号后面为参数名.
*@param tmpNo 单据模版ID
*@param djNo 此单据的单据编号 
*@param iAction =1表示新增状态，=2修改状态 =3展现状态。
*@param modNo 外部传入的模块编号(C3),用于和单据模版中的模块编号进行比较是否相等.

**/
function OpenBill(tmpNo,djNo,iAction,UserID){
	var suser="";
	try{suser=getuser();}catch(E){}
	var sRet= OpenBillMain(tmpNo,djNo,iAction,suser,"","","EE","有模式窗口","");
	//alert("2"+sRet);
	return sRet;

}

/**
*从主菜单调用单据
*@param tmpNo 模版编号
*@param UserID 当前操作员内码
*@param modNo 外部传入的模块编号(C3),用于和单据模版中的模块编号进行比较是否相等.
**/
function OpenBillMenu(tmpNo){
	window.open(fcpubdata.path+"/fceform/common/djframe.htm?djtype=LH&djsn="+tmpNo,fcpubdata.billOpenWinName);
	//DjOpenMenu(tmpNo);
    /*
    if(loadauth()=="否"){
   		alert("你无权使用此功能!!!")
   		return ;
    }
	//alert(curUserID)
	//
	OpenBillMain(tmpNo,"",0,UserID,null,ComputerName,modNo,"","")
	*/

}

/**
*统一的单据打开函数
*@param djsn 单据模版标识
*@param updataset 要传的数据集对象
*@param opentype 打开表单的类别,可为: 默认/新增/修改/展现
*@param sModal =有模式窗口/无模式窗口/当前窗口 为空表示当前窗口
*@param sVersion =测试/正式/直接 为空表示测试
*@param sTitle 窗口标题 为空则取缺省标题
*@param oRequest htm?后的参数的request对象
*@return 当有模式或无模式打开表单时,返回值可以通过在打开的表单中给window.returnValue值,
         然后在第一个表单中接收后判断此值.
*@date 2004-03-24
**/
function DjOpen(djsn,updataset,opentype,sModal,sVersion,sTitle,oRequest,callback,context){
	var sAction = "";
	try {
		if(IsSpace(opentype)) sAction = oRequest.QueryString("opentype").toString() ; //因为URL中汉字会有问题,所以用123来代替新增/修改/展现
	}catch(e){}
	try {
		if(IsSpace(updataset)) updataset = oRequest.QueryString("paravalue").toString() ; //传给表单单据编号之类的参数,不能通过URL传对象
	}catch(e){}
	var iAction=0;
	
	if(opentype == "新增" || sAction == "1") {
		iAction=1;
		//updataset="";
	}
	if(opentype == "修改"  || sAction == "2" ) iAction=2;
	if(opentype == "展现"  || sAction == "3" ) iAction=3;
	
	
	if(typeof sModal == "undefined"){
		//alert("q")
	    return OpenBillMain(djsn, updataset, iAction, oRequest, "", "", "", "有模式窗口", "", sVersion, callback, context);
	}else{
	//alert(djsn+":"+iAction)
		return OpenBillMain(djsn,updataset,iAction,oRequest,"","","",sModal,"",sVersion,sTitle);
	}
	//return OpenBill(djsn,updataset,iAction)
}

function billTypeToPos(sdjtype, djsn, arr, sTitle) {
///由djtype计算出窗口的位置等信息，arr不为空时用于设置窗口标题和旧时的使用。2013-03-27
    var posstyle = "";
    var tmpNo = djsn;
    var spathBillPos = "fceform/dj/";
    if (IsSpace(sdjtype) == false && sdjtype != "ST" && sdjtype != "LR") {
        var objBillType = BillTypeNameToPath(sdjtype);
        spathBillPos = objBillType.path;
    }
    //读billpos文件中的位置信息
    var oXmlFile = SetDomFile(location.protocol + "//" + location.host + fcpubdata.path + "/" + spathBillPos + "billpos.xml");
    if (oXmlFile.documentElement != null) {
        var oNode = oXmlFile.documentElement.selectSingleNode("//tr[td='" + tmpNo + "']");
        if (oNode == null && spathBillPos != "fceform/dj/") { //再找一下系统目录
            oXmlFile = SetDomFile(location.protocol + "//" + location.host + fcpubdata.path + "/" + "fceform/dj/" + "billpos.xml");
            oNode = oXmlFile.documentElement.selectSingleNode("//tr[td='" + tmpNo + "']");
        }
        if (oNode != null) {
            sPos = NavJs.textContent(oNode.childNodes[1]);
            arrPos = sPos.split(",");
            if (arrPos.length >= 4) {
                var ieVersion = getIEVersion();
                var offsetValue = 0;
                if (ieVersion < 7) offsetValue = 60;
                posstyle = ";dialogWidth:" + (ToInt(arrPos[2])) + "px;dialogHeight:" + (ToInt(arrPos[3]) + offsetValue) + "px"; //30是不同环境下窗口高度的调节值.它为0或是30.
                if (IsSpace(arr)) {
                   // alert("width:"+ToInt(arrPos[2]))
                    return { width: ToInt(arrPos[2])+45, height: ToInt(arrPos[3]) + offsetValue+25 };
                }
            }
            if (arrPos.length >= 5) {
                if (arrPos[4] == "居中")
                    posstyle += ";center:yes;";
                else
                    posstyle += ";dialogLeft:" + arrPos[0] + "px;dialogTop:" + arrPos[1] + "px;";
            }
            //alert(arrPos[8])
            if (IsSpace(sTitle) && arrPos.length >= 8 && !IsSpace(arr)) {
                if (IsSpace(arrPos[8]) == false) arr[9] = arrPos[8];
            }
        }
    }
    
    return posstyle;

}