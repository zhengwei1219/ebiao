///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />


/**
*����upload����ϼ�һ��
*@param tb table����,����Ϊ����ֵ
*@date 2003-11-04
**/
function upload_addrow(tb){
	var oTr=tb.insertRow(tb.rows.length-1);
	oTr.style.borderBottom="1px solid";
	var oTd;

	oTd=oTr.insertCell(0);
	oTd.style.width="40px";
	oTd.style.borderBottom="1px solid";


	oTd=oTr.insertCell(1);
	oTd.style.width="40%";
	oTd.style.borderBottom="1px solid";
//�ӱ�ע��
	oTd=oTr.insertCell(2);
	oTd.style.width="30%";
	oTd.style.borderBottom="1px solid";
	

	oTd=oTr.insertCell(3);
	oTd.style.display="none";
	
	oTd=oTr.insertCell(4);
	oTd.style.display="none";
//ɾ��
	oTd=oTr.insertCell(5);
	oTd.style.width="80px";
	oTd.style.borderBottom="1px solid";
//���صĺ�̨�ļ���
	oTd=oTr.insertCell(6);
	oTd.style.display="none";
	
	oTr.style.height="20px";  //parseInt(tb.style.fontSize)+4	

	
	return oTr;
}
/**
*�ϴ������Ŀؼ�
*@date 2003-10-13
**/
function upload_onload(){
	if(HaveUpload() == false ) return;

	var sRet="";
	var sDs = $id("upload1").getAttribute("dataset");
	if(IsSpace(sDs)){
        alert("Ӧ���ϴ��ؼ��󶨵����ݼ���");
        return;
	}
	var oDs = $obj(sDs);
	
	//alert(oDs.firstKeyFieldName);
	var tmpdjbh=oDs.Field(oDs.firstKeyFieldName).Value;   //��ǰ���ݵ�ȫ�ֵ��ݱ�ű���
	
	if(IsSpace(tmpdjbh)) return; //����ʱ���账��
	if(IsSpace(fcpubdata.uploadForm)) fcpubdata.uploadForm = $id(oDs.id).getAttribute("savetable") ; //�ɴ������Ϊ����� fcpubdata.area.dj_sn
	new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=doUploadInfo&sKeyvalue=" + tmpdjbh + "&sKeyvalue1=" + fcpubdata.uploadForm, "", function(result) {

	    var retX = result.value;
	    var oXml = SetDom(retX);
	    if (oXml.documentElement == null) {
	        alert(retX);
	        return;
	    }
	    var tb = $id("upload1").getElementsByTagName("table")[0];
	    for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
	        //���������:
	        //ͼ�� : �������� : ��ע : ����attachid�ֶ� : ��־(����/ɾ��/��) : ɾ��
	        if (isSpace(NavJs.getNodeValue11(oXml,i,0)) == false) {
	            var oTr = upload_addrow(tb);


	            //����չ���õ�ͼ��·��.
	            var extName = NavJs.getNodeValue11(oXml,i,3);
	            var tmp_extname = extName.substring(1, extName.length);

	            if (tmp_extname != "avi" && tmp_extname != "css" && tmp_extname != "doc" && tmp_extname != "gif" && tmp_extname != "htm" && tmp_extname != "jpg" && tmp_extname != "js" && tmp_extname != "mid" && tmp_extname != "psd" && tmp_extname != "rar" && tmp_extname != "txt" && tmp_extname != "wav" && tmp_extname != "xml" && tmp_extname != "xsl" && tmp_extname != "zip" && tmp_extname != "asf" && tmp_extname != "mpeg" && tmp_extname != "mpg" && tmp_extname != "pdf" && tmp_extname != "ppt" && tmp_extname != "swf" && tmp_extname != "au" && tmp_extname != "bmp" && tmp_extname != "ini" && tmp_extname != "mdb" && tmp_extname != "midi" && tmp_extname != "mov" && tmp_extname != "mp3" && tmp_extname != "xls") {
	                tmp_extname = "other";
	            }
	            var fileName1 = tmp_extname + ".gif";
				//������ 2010-5-17 10��40 ����docx��xlsx�ļ���չ�����ж�
		        if (tmp_extname == "docx")
		            fileName1 = "doc.gif";
		        if (tmp_extname == "xlsx")
		            fileName1 = "xls.gif";
	            var gifPath = fcpubdata.path + '/fceform/images/filetype/';
	            tb.rows[i].cells[0].innerHTML = "<img src='" + gifPath + fileName1 + "'></img>";


	            //����attachid�ֶ�(��fc_attach��������ֶ�)ֵ
	            tb.rows[i].cells[3].innerText = NavJs.getNodeValue11(oXml,i,2);

	            //��ע
	            tb.rows[i].cells[2].innerText = NavJs.getNodeValue11(oXml,i,4);
	            var tmpPath = "";
	            //��������
	            if ($id("upload1").getAttribute("uploadType") == "1") { //@fhj 2011-05-30 ==1��ʾ�渽�����ݵ�����
	                tmpPath = location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=readImage&sTablename=fc_attach&sImgname=filedata&sKeyname=attachid&sKeyvalue=" + tb.rows[i].cells[3].innerText + "&random=" + Math.random();
	            } else {
	                tmpPath = location.protocol + "//" + location.host + fcpubdata.path + NavJs.getNodeValue11(oXml,i,0);
	            }
	            tb.rows[i].cells[1].innerHTML = "<a target='_blank' href='" + tmpPath + "'>" + sepFile(NavJs.getNodeValue11(oXml,i,1)) + "</a>";
	            //ɾ��
	            tb.rows[i].cells[5].innerHTML = "<span style='cursor:hand;color:blue;text-decoration:underline;width:70px' onclick='uploadDelFile(" + i + ")'  >ɾ��</span>";
	            //��̨����ʱ�ļ���,����·��
	            tb.rows[i].cells[6].innerText = NavJs.getNodeValue11(oXml,i,0);
	        }
	    }

	});	
}
/**
*�ϴ������Ŀؼ�,���沿��
����ʱ
	2 ��ѡ�����ϴ��ļ���Ӧ����Update filename �� Update �ļ����ĸ������.
*@date 2003-10-13
**/
function upload_save(){
    if (HaveUpload() == false) return;
    var sDs = $id("upload1").getAttribute("dataset");
    if (IsSpace(sDs)) {
        alert("Ӧ���ϴ��ؼ��󶨵����ݼ���");
        return;
    }
    var oDs = $obj(sDs);
	if (IsSpace(fcpubdata.uploadForm)) fcpubdata.uploadForm = $id(oDs.id).getAttribute("savetable"); //�ɴ������Ϊ����� fcpubdata.area.dj_sn
	var djbh = fcpubdata.keyFieldValueTag;
	if (oDs.getAttribute("idtype") == 4) djbh = oDs.Field(oDs.firstKeyFieldName).Value; //my add 2010-08-17 ֧�ֵ����ֶ�������
	
	//���������:
	//ͼ�� : �������� : ��ע : ���ص��ݱ�� : ��־(����/ɾ��/��) : ɾ�� : �ϴ�����ļ���
	var sDelXml="";
	//�����ļ���
	var sql=new Sys.StringBuilder();
	var tb = $id("upload1").getElementsByTagName("table")[0];
	for(var i=0;i<tb.rows.length-1;i++){
		var sTag = tb.rows[i].cells[4].innerText;
		if(sTag == "����" ){
			var filename = tb.rows[i].cells[1].innerText;
			if(isSpace(filename)==false){
				filename=new Eapi.Str().trim(filename);
				var extname=filename.substring(filename.length-4,filename.length);
				extname=extname.toLowerCase();
				filename=tb.rows[i].cells[1].title;
				var m_attachid = tb.rows[i].cells[3].innerText;
				var sBz = tb.rows[i].cells[2].innerText;
				var sFilepos = tb.rows[i].cells[6].innerText;
				//sql.append( "<no>Delete FC_ATTACH where attachid='" + m_attachid + "' and djbh='"+djbh+"' and djsn='"+fcpubdata.uploadForm+"' </no>");
				//sql.append( "<no>insert into FC_ATTACH (attachid,djbh,filename,extend,bz,djsn,filepos) values ('"+m_attachid+"','"+djbh+"','"+filename+"','"+extname+"','"+sBz+"','"+fcpubdata.uploadForm+ "','" + sFilepos+"') </no>");
				sql.append("<delete tableName='FC_ATTACH' ><where>attachid='"+m_attachid+"'</where></delete>");
				sql.append("<insert tableName='FC_ATTACH' ><names>attachid,djbh,filename,extend,bz,djsn,filepos</names><values>'"+m_attachid+"','"+djbh+"','"+filename+"','"+extname+"','"+sBz+"','"+fcpubdata.uploadForm+ "','" + sFilepos+"'</values></insert>");
			}
		}else if(sTag == "ɾ��"){
			var m_attachid = tb.rows[i].cells[3].innerText;
			if(isSpace(m_attachid)==false){
				//sql.append("<no>delete from FC_ATTACH where attachid='"+m_attachid+"' </no>");
				sql.append("<delete tableName='FC_ATTACH' ><where>attachid='"+m_attachid+"'</where></delete>");
			}
		}
		if(sTag == "ɾ��" || sTag == "���Ӻ�ɾ��"){
			
			sDelXml += "<file>" + tb.rows[i].cells[6].innerText + "</file>";
			
			    

		}
	}
	if(sDelXml!=""){
		//sDelXml = "<path>"+fcpubdata.path+"</path>" + sDelXml  ;
		//alert(sDelXml)
		var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=DelUploadFile",sDelXml);
		if(IsSpace(retX) == false){
			alert(retX);
		}
	}
	return sql.toString();
	/*
	if(sql.isEmpty() == false){
		var sRet1=inserts(sql.toString());
		if(isSpace(sRet1)==false){
		   alert(sRet1);
		   return;
		}   
	}  
    */

}
/**
*�ڸ����ؼ��ϵ����Ӹ�����ťʱ���д˺���HtmCurPath
*@date 2003-11-03
**/
function uploadAddFile(){
    var upload1 = $id("upload1");
	if($id("upload1").disabled)return;
	var arrPara = new Array();
	arrPara[0] = upload1.getAttribute("setpath") ;
	if (IsSpace(arrPara[0])) arrPara[0] = "/fceformext/res/";
	arrPara[1] = upload1.getAttribute("extfiles") ;
	if (IsSpace(arrPara[1])) arrPara[1] = "";
    var arr = window.showModalDialog(fcpubdata.path+"/fceform/common/uploadfilemain.htm",arrPara,"scroll:no;status:no;dialogHeight:200px;dialogWidth:350px;dialogTop:180;dialogLeft:250px") ;
 	fcpubdata.isEdit=true;
 	if(isSpace(arr)==false) {
		//�ڱ���ϼ�һ��,���ϴ��ļ�������.
		//���������:
		//ͼ�� : �������� : ��ע : ���ص��ݱ�� : ��־(����/ɾ��/��) : ɾ��
		var sRet = arr[0];
		var tb=upload1.getElementsByTagName("table")[0];

		var oTr=upload_addrow(tb);
		var expName=sRet.substring(sRet.length-3,sRet.length);
		var tmp_extname=expName.toLowerCase();
		
		if (tmp_extname != "avi" && tmp_extname != "css" && tmp_extname != "doc" && tmp_extname != "gif" && tmp_extname != "htm" && tmp_extname != "jpg" && tmp_extname != "js" && tmp_extname != "mid" && tmp_extname != "psd" && tmp_extname != "rar" && tmp_extname != "txt" && tmp_extname != "wav" && tmp_extname != "xml" && tmp_extname != "xsl" && tmp_extname != "zip" && tmp_extname != "asf" && tmp_extname != "mpeg" && tmp_extname != "mpg" && tmp_extname != "pdf" && tmp_extname != "ppt" && tmp_extname != "swf" && tmp_extname != "au" && tmp_extname != "bmp" && tmp_extname != "ini" && tmp_extname != "mdb" && tmp_extname != "midi" && tmp_extname != "mov" && tmp_extname != "mp3" && tmp_extname !="xls"){
			tmp_extname = "other" ;
		}
		var fileName1=tmp_extname+".gif";
		
		//������ 2010-5-17 10��40 ����docx��xlsx�ļ���չ�����ж�
		if (tmp_extname == "docx")
		    fileName1 = "doc.gif";
		if (tmp_extname == "xlsx")
		    fileName1 = "xls.gif";
		var gifPath=fcpubdata.path+'/fceform/images/filetype/';
		oTr.cells[0].innerHTML="<img src='"+gifPath+fileName1+"'></img>";
		oTr.cells[1].innerText=sepFile(sRet);
		oTr.cells[1].title=sRet;
		oTr.cells[2].innerText = arr[1] ;//��ע
		oTr.cells[3].innerText=getMaxNo("UPF");
		oTr.cells[4].innerText="����";
		oTr.cells[5].innerHTML="<span style='cursor:hand;color:blue;text-decoration:underline;width:70px;' onclick='uploadDelFile("+oTr.rowIndex+")'>ɾ��</span>";
		//��̨���ɵ��ļ���
		oTr.cells[6].innerText=arr[2];
 	}
    
}
/**
*�ڸ����ؼ��ϵ�ɾ������ʱ���д˺���
*@date 2003-11-03
**/
function uploadDelFile(iRow) {
    var upload1 = $id("upload1");
	if(upload1.disabled)return;

	var tb = upload1.getElementsByTagName("table")[0];
	var o=tb.rows[iRow].cells[2];
//	var o=event.srcElement
	var s1=o.parentNode.cells[4].innerText;
	if(isSpace(s1)){
		o.parentNode.cells[4].innerText="ɾ��";
		o.parentNode.cells[1].innerHTML="<font color=red>��ɾ��</font>";
	}else if(s1=="ɾ��" || s1==="���Ӻ�ɾ��"){
		alert("��������ɾ����־!");
	}else {
		o.parentNode.cells[4].innerText="���Ӻ�ɾ��";
		o.parentNode.cells[1].innerHTML="<font color=red>��ɾ��</font>";
	}
	fcpubdata.isEdit=true;	

}
/**
*�����һ���ļ���,���������/\:�����ַ�
*@param sPath =·�����ļ���
*@date 2003-11-04
**/
function sepFile(sPath) {
    if (isSpace(sPath)) { return ""; }
    var ss = "";
    for (var i = sPath.length; i > 0; i--) {
        var s1 = sPath.substring(i - 1, i);
        //alert("s1��" + s1 + "   escape(s1)��" + escape(s1));
        if (escape(s1) == "%5C" || s1 == "/" || s1 == ":") {
            ss = sPath.substring(i, sPath.length);
            break;
        }
    }
    if (ss == "")
        ss = sPath;
    return ss;
}



// initialization hook up
//if ( typeof window.attachEvent != "undefined" ) {
//	window.attachEvent( "onload", upload_onload );
	
//}
