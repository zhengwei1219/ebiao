
//2004-03-03 �û��Զ����ȫ�ֺ���,���ڷ�һЩ��ĳ��ģ����(����CRM JXC)���õ�ȫ�ֺ���.
function getuser() {
	return "fc";
}
function getusername() {
	return "fc";
}

/**
* ���ƴ�eform��Ƶı���Ȩ��
* �ڴ˺�������parent.Request.QueryString("djsn").toString() ��ʽ����?��Ĳ���.
*@return �� ��ʾ��Ȩ��.
*@date 2006-02-11
**/
function EformEnterStatus() {
/*
	var djtype = parent.Request.QueryString("djtype").toString();  //�������
	var djsn = parent.Request.QueryString("djsn").toString();	//��djsn

	if(djsn == "application_sub"){
		var name = GetSession('username=')['username'];
		if(name == "liuxm"){
			return "";
		}
	
	}
*/
	return "OK";
}
/**
* �ӱ����һ�ֱ���ģʽʱ�ĴӼ��ֶε����ɺ���
*@param iRowNo �кţ���0��ʼ��,����
*@param sSubKeyFieldName �Ӽ����ֶ���
**/
function IGetSubTableKeyValue(iRowNo,sSubKeyFieldName) {
	return iRowNo + 1 ;
}
/**
* �����ܲ�������ĳ������
*@date 2007-04-18
**/
function EbiaoEnterStatus(callback) {
	/**
	���������ʾ�������������б������Ȩ�޿���,���ȴ�session������ȡ��Ȩ����Ϣ,Ȼ�����ж�.
	GetSession("username",function (arrRet){
		var sessionValue = arrRet["username"];
		alert(parent.Request.QueryString("name").toString()); //��������
		alert(parent.Request.QueryString("file").toString()); //�����ļ�
		if(sessionValue == "liuxm" && parent.Request.QueryString("name").toString()=="���ۻ��ܱ���" ){
			alert("����Ȩ���д˱���!");
			callback(false); //֪ͨ�رմ���
			return;
		}
		callback(true); 
	})
	*/
	// fcpub.toolbar = "preview,print,printdirect,printall,|,query,pageset,refresh,|,expexcel,expexcelall,directexppdf";e_directrun
	
//	if(parent.Request.QueryString("e_runsavefile").toString() != "undefined" || (parent.Request.QueryString("e_directrun").toString() != "undefined" && parent.Request.QueryString("e_directrun").toString() != "yes") ){
//		fcpub.tempFilePath =  GetUrlFirstPart() + "/ebsys/ebtmpfile1/";
//	}
	callback(true); //ִ�д������ʾ���������б���.
}
/**
* �ӹ������ϵ㱣�水ťʱִ�д˺���,���ñ��浱ǰ�������н��ʱ
*@date 2007-09-03
**/
function EbiaoSaveEvent() {
	//�˴�������һ�����봰�ڹ���,��ȷ���رմ��ں�,��Ҫ������ļ������������saveFileName����,Ҫ�����·������fcpub.tempFilePath����,
	
	var saveFileName = "curSave";//Ҫ��������ļ���
	RunReport(1,"����",saveFileName,function (result){
		var TotalPages = result.pages ; //��ҳ��
		var sRetValue = result.value ; //���α������еĲ�������xml�ַ���.
		var sReportFile = parent.sPubPath; //�������еı����ļ�.
	});

}

/**
* �򿪱�Ԫ��Ȩ�����ô��� added by liuxr at 2008-3-14
* �˺��������Դ��ڵ�Ȩ�����ð�ť�ĵ���¼��ϵ���
**/
function EformActionButtonClick()
{
    var arr = fcpubdata.obj[0];
    var isMulti = arr.constructor == window.Array || arr.length > 1;
    if (isMulti) {
        for (var i = 0; i < arr.length; i++) {
            if (IsSpace(arr[i]) == false && arr[i].controltype == "dataset") {
                alert("ѡ�а������ݼ��ؼ����ڵĶ���ؼ�ʱ,���ܽ���Ȩ������!");
                return;
            }
        }
    }
    var obj = arr;
    if (isMulti) obj = arr[0];

    var MainDiv = fcpubdata.obj[2]; 	//eformarea();
    var sFile = fcpubdata.path + "/fceform/common/djframe.htm?djsn=roleSet&djtype=OF";	
    //var sFile = fcpubdata.path + "/fceform/common/djframe.htm?djsn=rs_role_set&djtype=WF_DSN";
    if (obj.controltype == "dataset") {
        obj.curFieldName = dssub1.Field("fdname").Value;
    }
    var strReturn = window.showModalDialog(sFile, [MainDiv, obj, isMulti], "scroll:no;status:no;dialogHeight:480px;dialogWidth:380px;dialogTop:180;dialogLeft:250px");
    if (IsSpace(strReturn) == false) {
        //alert(obj.controltype);
        //obj.roleXml = strReturn;
        var stmp = "";
        if (IsSpace(MainDiv.roleXml) == false) {
            var oXml = SetDom("<root>" + MainDiv.roleXml + "</root>");
            if (isMulti) {
                for (var j = 0; j < arr.length; j++) {
                    var obj = arr[j];
                    var oNodes = oXml.selectNodes("root/record[@id = '" + obj.id + "']");
                    for (var i = 0; i < oNodes.length; i++) {
                        oXml.documentElement.removeChild(oNodes(i));
                    }
                }

            } else {
                //ɾ��ԭ����	
                if (obj.controltype == "dataset") {
                    var oNodes = oXml.selectNodes("root/record[@id = '" + obj.id + "' and @fieldname = '" + obj.curFieldName + "' ]");
                } else {
                    var oNodes = oXml.selectNodes("root/record[@id = '" + obj.id + "']");
                }
                for (var i = 0; i < oNodes.length; i++) {
                    oXml.documentElement.removeChild(oNodes(i));
                }
            }
            stmp = new Eapi.Str().removeRoot(oXml.documentElement.xml);
        }

        MainDiv.roleXml = stmp + strReturn;
        //alert(MainDiv.roleXml);
        //CopyToPub(MainDiv.roleXml);
    }
}

/**
*ҳ������ʱ��Ԫ�ص�Ȩ�޼�� added by liuxr at 2008-3-14
* �˺����ڱ����¼��е���,Ҳ�������Լ���Ҫʱ����
**/
function EformCheckRoleInfo()
{
	if (IsSpace(fcpubdata.area.roleXml)) return ;
	var strRoleXml = fcpubdata.area.roleXml
	if(strRoleXml == "<root></root>") return;
	/*if(fcpubdata.dotnetVersion==".aspx"){
		var retX=SendHttp(location.protocol+"//"+location.host + fcpubdata.path + "/fceformext/roleSet/RoleCheck.aspx",strRoleXml);
		//alert(retX);
		try{
			eval(retX);
		}catch(e){}
	}else{*/
		SendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=roleCheckEmployee",strRoleXml,function(result){
//		SendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=profileCheck",strRoleXml,function(result){
			if(result.value == null)return;
			try{
				eval(result.value);
			}catch(e){}
		});
	//}
}
/**
* ����ͨ����ʾ��������,���ڶ�̬ȡ������Ϣ.
* 2009-11-16
**/
function lt_get_col_info() {
    var sqlstr = "select id,";

    var xmlRet = SelectSql("select fieldname,chnname from lt_fieldinfo where typeid='" + cboType.value + "'", 1, -1);

    var oXml = SetDom(xmlRet);
    if (oXml.documentElement == null) {
        alert(xmlRet);
        return true;
    }
    if (oXml.documentElement.childNodes.length <= 1) {
        alert("û�в鵽Ҫ��ʾ����");
        return true;
    }
    for (var i = 0; i < oXml.documentElement.childNodes.length - 1; i++) {
        sqlstr += oXml.documentElement.childNodes(i).childNodes(0).text + " as " + oXml.documentElement.childNodes(i).childNodes(1).text + ",";
    }
    sqlstr = sqlstr.substring(0, sqlstr.length - 1);
    sqlstr += " from lt_data ";
    //CopyToPub(escape(sqlstr));

    fcpubdata.pubSqlStr = sqlstr;
    sqlstr += " where rtrim(typeid)='" + cboType.value + "'"
    if (fcpubdata.dotnetVersion == "") sqlstr = escape(sqlstr);
    new Eapi.EformEbiao().run(ebiao1, "&sqlstr=" + escape(sqlstr));
    return false;
}