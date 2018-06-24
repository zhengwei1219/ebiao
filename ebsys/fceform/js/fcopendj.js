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
*�򿪴���ĵ���ģ��
*@param tmpNo ����ģ����,djNo ��������ID,iAction =1Ϊ����=2Ϊ�޸�, UserIDΪ��ǰ����ԱID
*@param arrWorkFlow �������õĲ����ĵ�
*@param ComputerName �ͻ��˵Ļ�����
*@param modNo �ⲿ�����ģ����(C3),���ں͵���ģ���е�ģ���Ž��бȽ��Ƿ����.
*@param openMode ="��ģʽ����" ��ʾǿ�ƴ򿪷�ʽΪ��ģʽ��
*@param sOpenCommand Ϊ�ڴ򿪱�����eval���е����,����OpenUserQuery��
*@param sVersion =����/��ʽ/ֱ�� Ϊ�ձ�ʾ����
*@param sTitle ���ڱ��� Ϊ����ȡȱʡ����

**/
function OpenBillMain(tmpNo, djNo, iAction, oRequest, arrWorkFlow, ComputerName, modNo, openMode, sOpenCommand, sVersion, sTitle, callback, context) {
	//alert(tmpNo)
	
		//new Eapi.Str().showWait("���ڴ򿪱�....");
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
            sVersion="�����ļ�";
        }else if(up_isfile == "test"){
		    sVersion="����";
		}else{
			sVersion="ֱ��";   //����/�����ļ�/ֱ�� 
		}
	}
   //if(sVersion != "�����ļ�") sVersion="����";
   
    if(tmpNo == "userfunction1" ) sVersion = "ֱ��";
	if(typeof tmpNo != "undefined" ) tmpNo=new Eapi.Str().trim(tmpNo);
	var tmpNoBak = tmpNo; //����ԭ���� 2009-01-19 add
	tmpNo=_getDjsn(tmpNo); //�õ�������djsn
	
	var htmfile="djframe.htm?isfile=release";
	var posstyle="";
	var arr=new Array();
	var curdjid="" ; 
	var sPos ;
	var arrPos;
	//�ҵ������λ��
  if(sVersion=="����"){
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
				if(arrPos[6]=="����")
					iAction=1;
				if(arrPos[6]=="�޸�")
					iAction=2;
				if(arrPos[6]=="չ��")
					iAction=3;
			}
			htmfile = "djframe.htm?isfile=test"	;
				
		}	


		if(arrPos.length>=4){
			var iheight=ToInt(arrPos[3])	;
			posstyle=";dialogWidth:"+(ToInt(arrPos[2]))+"px;dialogHeight:"+iheight+"px";
		
		}
		if(arrPos.length>=5){
			if(arrPos[4]=="����")
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
			}catch(e){		openMode="��ǰ����";}
		}
		arr[7]=openMode;  //�򿪷�ʽ
		arr[8]=sOpenCommand;
		if(isSpace(sTitle)){
		    //���������������ڱ���
			arr[9]=NavJs.getNodeValue1(oXml,1)+"["+tmpNo+"]";
		}else{
			arr[9]=sTitle;
		}
  }else if(sVersion == "�����ļ�") { //�Բ����ļ���ʽ��,��Ԥ��������
		htmfile="djframe.htm?isfile=yes";
	    var sTypePath = "";
	    var up_djsn = parent.Request.QueryString("djsn").toString();
	    if(tmpNo != up_djsn){  //ֱ����DjOpen,�������� opendj.htm�����õ���
		    var posPath = up_djsn.lastIndexOf("/");
		    if(posPath >= 0) sTypePath = up_djsn.substring(0,posPath)+"/";
		}
		var sAllPath = sTypePath + tmpNo;
		if (sAllPath.substring(0, 1) != "/") sAllPath = "/" + sAllPath;
		arr[0]=readdesignhtml("<file>"+sAllPath+".dj</file>");
		if(isSpace(sTitle) == false){
			arr[9]=sTitle;
		}	
	
  } else { //ֱ�Ӵ�
          arr[0] = tmpNo + ".htm";
//          if (openMode == "��ģʽ����") {
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
          //���������ڵģ������djtype����ֵ����ǰҪ�򿪵ı���djtype����
          try {
              if (parent.location.pathname.indexOf("djframe.htm") >= 0) {
                  sdjtype = parent.Request.QueryString("djtype").toString();
                  if (sdjtype != "undefined") {
                      htmfile = htmfile + "&djtype=" + sdjtype;
                  }
              }
          } catch (e) {
              //����djframe.htm�����б�ʱ���쳣,parent.Request == undefined
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
          //��billpos�ļ��е�λ����Ϣ
          var oXmlFile = SetDomFile(location.protocol + "//" + location.host + fcpubdata.path + "/" + spathBillPos + "billpos.xml");
          if (oXmlFile.documentElement != null) {
              var oNode = oXmlFile.documentElement.selectSingleNode("//tr[td='" + tmpNo + "']");
              if (oNode == null && spathBillPos != "fceform/dj/") { //����һ��ϵͳĿ¼
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
                      posstyle = ";dialogWidth:" + (ToInt(arrPos[2])) + "px;dialogHeight:" + (ToInt(arrPos[3]) + offsetValue) + "px"; //30�ǲ�ͬ�����´��ڸ߶ȵĵ���ֵ.��Ϊ0����30.
                  }
                  if (arrPos.length >= 5) {
                      if (arrPos[4] == "����")
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
	    //2011-02-25 ��Ϊȡ���㴰��
	    var oTopWin = getTopWin();

	    arr[4] = oTopWin; //arrWorkFlow;  //����������
	} else if (oArgu.length > 4) {
	    arr[4] = oArgu[4];
	}
    arr[5]=ComputerName;  //�ͻ��˵Ļ�����

    arr[6]=modNo;  //ģ����
    
    htmfile = htmfile +"&djsn="+tmpNo;
    //OpenSys();
  
  //alert(posstyle)  showModelessDialog
    //alert(sOpen)
//  var sRet=window.showModalDialog("fceform/common/djmain.htm",arr,"status:no;dialogHeight:"+screenHeight+"px;dialogWidth:"+screenWidth+"px;dialogTop:"+iTop+"px;dialogLeft:"+iLeft+"px") 
	//new Eapi.Str().showWait("test1")
    
    var openUrlFile = sPath+htmfile;
    if(tmpNo != tmpNoBak) openUrlFile = tmpNoBak;
    
	var sRet ;
	if (openMode == "��ģʽ����") {

	    var isNewModalWin = !IsSpace(top.Dialog) && Sys.Browser.agent != Sys.Browser.InternetExplorer;
	    if (isNewModalWin && false) {
	        NavJs.openModalDialog(openUrlFile, arr, winSizeTrans(posstyle), callback, context);
	    } else {
	        sRet = window.showModalDialog(openUrlFile, arr, "resizable:yes;status:yes;" + posstyle);
	    }
		
	}else if(openMode=="��ģʽ����"){
	  	sRet=window.showModelessDialog(openUrlFile,arr,"resizable:yes;status:yes;"+posstyle); 
/*	}else if(sOpen=="����֡����"){
		//top.arr=arr
		//aadd
		//open("http://"+location.host+"/fceform/common/"+htmfile,"rightmain")
		var strHTML=arr[0]
		alert(strHTML)
		window.frames("tt").document.open();
		window.frames("tt").document.write(strHTML);
		window.frames("tt").document.close();
		*/
	}else { //֡���ڴ�
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
	* ��ʾdemo�汾��Ϣ
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
//			var numberMillis = 1500;		//������ʱֵ
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
	///������djsn����һ��URL,������������djsn
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
	    ///��url��ȡ��djtype 2011-03-17
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
	    ///��  window.showModalDialog ����winSize���崮ת�����µĶ��� 2013-02-19
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
*���ļ��ж���ƴ�������
*@date 2004-12-25
**/
function readdesignhtml(sXml) {
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=readdesignhtml",sXml);

}

/**
* װ��oracle��clob�ֶ�
*@date 2005-01-05
**/
function loadClob(sXml) {

	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=loadClob",sXml);
	return retX;
}

/**
*�ı䴰�ڵı���
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
ͨ�����˵��򿪱�
*@date 2004-09-29
**/
function DjOpenMenu(tmpNo,sTitle){
	DjOpen(tmpNo,"","","��ǰ����","ֱ��",sTitle);
}
/**
* �ڵ�ǰ�����Բ���ģʽ���б�
*@date 2004-10-11
**/
function DjOpenTest(tmpNo){
	DjOpen(tmpNo,"","","","����","",parent.Request);
}
/**
* �ڵ�ǰ�����Բ���ģʽ�����ļ���
*@date 2004-12-25
**/
function DjOpenTestFile(tmpNo){
	DjOpen(tmpNo,"","","","�����ļ�","",parent.Request);
}
/*
function selecttext(sSql,PageNo,PageSize) {
//ִ�в�ѯ
//PageNoҳ��
//PageSizeҳ�ߴ�,��һҳ��������
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
	//����Ƿ�XML�ַ�
	var sXml="<No>"+sql1+"</No>"+"<No1>"+PageNo+"</No1>"+"<No2>"+PageSize+"</No2>";
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?selecttext",sXml);
	return retX;
}*/
/**
*�򿪵���,����һ�ŵ���ģ�������һ��ʱ.
*tmpNoΪ����ģ��ID,djNoΪ���ݱ��(Key),����ʱdjNoΪ��.
*����: 1.�����˵���ģ���XML��,�ŵ�ҳ����.
*     // 2.��ʼ���˵�
*      3.�����ݼ���base_dset����������djNo������opensql,:�ź���Ϊ������.
*@param tmpNo ����ģ��ID
*@param djNo �˵��ݵĵ��ݱ�� 
*@param iAction =1��ʾ����״̬��=2�޸�״̬ =3չ��״̬��
*@param modNo �ⲿ�����ģ����(C3),���ں͵���ģ���е�ģ���Ž��бȽ��Ƿ����.

**/
function OpenBill(tmpNo,djNo,iAction,UserID){
	var suser="";
	try{suser=getuser();}catch(E){}
	var sRet= OpenBillMain(tmpNo,djNo,iAction,suser,"","","EE","��ģʽ����","");
	//alert("2"+sRet);
	return sRet;

}

/**
*�����˵����õ���
*@param tmpNo ģ����
*@param UserID ��ǰ����Ա����
*@param modNo �ⲿ�����ģ����(C3),���ں͵���ģ���е�ģ���Ž��бȽ��Ƿ����.
**/
function OpenBillMenu(tmpNo){
	window.open(fcpubdata.path+"/fceform/common/djframe.htm?djtype=LH&djsn="+tmpNo,fcpubdata.billOpenWinName);
	//DjOpenMenu(tmpNo);
    /*
    if(loadauth()=="��"){
   		alert("����Ȩʹ�ô˹���!!!")
   		return ;
    }
	//alert(curUserID)
	//
	OpenBillMain(tmpNo,"",0,UserID,null,ComputerName,modNo,"","")
	*/

}

/**
*ͳһ�ĵ��ݴ򿪺���
*@param djsn ����ģ���ʶ
*@param updataset Ҫ�������ݼ�����
*@param opentype �򿪱������,��Ϊ: Ĭ��/����/�޸�/չ��
*@param sModal =��ģʽ����/��ģʽ����/��ǰ���� Ϊ�ձ�ʾ��ǰ����
*@param sVersion =����/��ʽ/ֱ�� Ϊ�ձ�ʾ����
*@param sTitle ���ڱ��� Ϊ����ȡȱʡ����
*@param oRequest htm?��Ĳ�����request����
*@return ����ģʽ����ģʽ�򿪱�ʱ,����ֵ����ͨ���ڴ򿪵ı��и�window.returnValueֵ,
         Ȼ���ڵ�һ�����н��պ��жϴ�ֵ.
*@date 2004-03-24
**/
function DjOpen(djsn,updataset,opentype,sModal,sVersion,sTitle,oRequest,callback,context){
	var sAction = "";
	try {
		if(IsSpace(opentype)) sAction = oRequest.QueryString("opentype").toString() ; //��ΪURL�к��ֻ�������,������123����������/�޸�/չ��
	}catch(e){}
	try {
		if(IsSpace(updataset)) updataset = oRequest.QueryString("paravalue").toString() ; //���������ݱ��֮��Ĳ���,����ͨ��URL������
	}catch(e){}
	var iAction=0;
	
	if(opentype == "����" || sAction == "1") {
		iAction=1;
		//updataset="";
	}
	if(opentype == "�޸�"  || sAction == "2" ) iAction=2;
	if(opentype == "չ��"  || sAction == "3" ) iAction=3;
	
	
	if(typeof sModal == "undefined"){
		//alert("q")
	    return OpenBillMain(djsn, updataset, iAction, oRequest, "", "", "", "��ģʽ����", "", sVersion, callback, context);
	}else{
	//alert(djsn+":"+iAction)
		return OpenBillMain(djsn,updataset,iAction,oRequest,"","","",sModal,"",sVersion,sTitle);
	}
	//return OpenBill(djsn,updataset,iAction)
}

function billTypeToPos(sdjtype, djsn, arr, sTitle) {
///��djtype��������ڵ�λ�õ���Ϣ��arr��Ϊ��ʱ�������ô��ڱ���;�ʱ��ʹ�á�2013-03-27
    var posstyle = "";
    var tmpNo = djsn;
    var spathBillPos = "fceform/dj/";
    if (IsSpace(sdjtype) == false && sdjtype != "ST" && sdjtype != "LR") {
        var objBillType = BillTypeNameToPath(sdjtype);
        spathBillPos = objBillType.path;
    }
    //��billpos�ļ��е�λ����Ϣ
    var oXmlFile = SetDomFile(location.protocol + "//" + location.host + fcpubdata.path + "/" + spathBillPos + "billpos.xml");
    if (oXmlFile.documentElement != null) {
        var oNode = oXmlFile.documentElement.selectSingleNode("//tr[td='" + tmpNo + "']");
        if (oNode == null && spathBillPos != "fceform/dj/") { //����һ��ϵͳĿ¼
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
                posstyle = ";dialogWidth:" + (ToInt(arrPos[2])) + "px;dialogHeight:" + (ToInt(arrPos[3]) + offsetValue) + "px"; //30�ǲ�ͬ�����´��ڸ߶ȵĵ���ֵ.��Ϊ0����30.
                if (IsSpace(arr)) {
                   // alert("width:"+ToInt(arrPos[2]))
                    return { width: ToInt(arrPos[2])+45, height: ToInt(arrPos[3]) + offsetValue+25 };
                }
            }
            if (arrPos.length >= 5) {
                if (arrPos[4] == "����")
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