//�����ݿ�ı���Ϣ������ѡ����ʱ,���Թ�ѡ������ݵ��б�����������.
//var arrUserFuncList = [
// 	["ѡ����", "selectDept", "���������<br/> ��ǰ����. "],
// 	["�����ݿ�ı���Ϣ������ѡ����ʾ��", "getdate()", "���������<br/> ��ǰ����. "]
//];
var fcUserFunc = {

    selectDept: function(id) {//�ڴ򿪴��ڵ�radiolist�ؼ���ѡ������
        ///idΪdropdownlist�ؼ���ID
        //alert($obj($id(id).getAttribute("dataset")).Field("sdeptid").Value);
        CommonSelect({
            istree: 1,
            ismultisel: 1,
            //islist: 1, //��ѡʱΪcheckboxlist,������radiolist
            cols: 3, //����
            obj: $obj(id), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            selectedvalue: $obj($id(id).getAttribute("dataset")).Field("sdeptid").Value,
            idfieldname: "sdeptid",
            textfieldname: "sdeptname", //��ѡ��, ǰһ���ڵ�text�ֶ���,���ڰ��ֶ�ͬ����������.ֻ��isgrid!=1ʱ����Ч
            //hidefields:"sdeptid",
            sql: "select sdeptcode,sdeptname,sdeptid from FCS_DEPT where sdeptname !='' order by sdeptcode " //��ѡ��, �������ڵ���ʾ�����õ�SQL���.

        })
    },
    selectRole: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "roleId";
        if (IsSpace(fieldName)) fieldName = "roleName";
        CommonSelect({
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "ѡ���ɫ",
            sql: "select roleid,parentid,rolename,roleid from FCQ_ROLE where deleteMark <> 1 order by sortNo  " //��ѡ��, �������ڵ���ʾ�����õ�SQL���.
        })
    },

    selectOrg: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "ѡ����֯�ṹ",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 order by sortNo  "
        })
    },
    selectOrgUp: function(controlId, fieldId, fieldName) {
        //��ҪְԱ�ڵ����֯��
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "ѡ����֯�ṹ",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectOrgUsers: function(controlId, fieldId, fieldName) {
        //ͨ����֯��ѡ���ѡ�û���
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            ismultisel: 1,
            selectedvalue: $id(controlId).value,
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            treeNodeType: "ef_tree_psm", //ָ��ֻ�����û���
            title: "ѡ���û�",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectOrgUserEb: function(controlId,callback) {
        //ͨ����֯��ѡ�񵥸��û�����E�����ã������ܰ󶨵����ݼ�����ֵ
        //if (IsSpace(fieldId)) fieldId = "sID";
        //if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            callback: callback,    
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            //ismultisel: 1,
            //selectedvalue: $id(controlId).value,
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            //idfieldname: fieldId,
            width: "350",
            height: "600",
            //textfieldname: fieldName,
            istreenewsql: 1,
            treeNodeType: "ef_tree_usr", //ָ��ֻ�����û���
            title: "ѡ���û�",
            sql: "select  sID,sParent,sName,sPersonId,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },

    selectOrgAll: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "sFID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "ѡ����֯�ṹ",
            sql: "select  sID,sParent,sName,sFID,sOrgKindID from fcq_org  where deleteMark <> 1  and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectProfile: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "profileId";
        if (IsSpace(fieldName)) fieldName = "profileName";
        CommonSelect({
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "ѡ���ɫ",
            sql: "select profileId,profilename from fcq_profile where deleteMark <> 1 and profileId <> 'systemadmin' order by sortNo "
        })
    },
    selectProfiles: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "profileId";
        if (IsSpace(fieldName)) fieldName = "profileName";
        var ret = CommonSelect({
            obj: controlId, //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            textfieldname: fieldName,
            isgrid: 1, //1�Ǵ򿪴�������grid�ؼ�����ʾ����,0����,
            ismultisel: 1,
            gridcoltitle: ["��ɫ����"],
            hidefields: fieldId,
            title: "ѡ���ɫ",
            sql: "select profileId as "+ fieldId +  ",profilename from fcq_profile where deleteMark <> 1 and profileId <> 'systemadmin' order by sortNo "
        })
        return ret;
    },
    selectUser: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "userId";
        if (IsSpace(fieldName)) fieldName = "userName";
        CommonSelect({
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "ѡ���û�",
            sql: "select userId,username from fcq_user where deleteMark <> 1 order by sortNo"
        })
    },
    selectUsers: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "userId";
        if (IsSpace(fieldName)) fieldName = "userName";
        var ret = CommonSelect({
            obj: controlId, //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            isgrid: 1,
            textfieldname: fieldName,
            ismultisel: 1,
            hidefields: fieldId,
            gridcolwidth: [250], 
            gridcoltitle: ["�û�����"],
            title: "ѡ���û�",
            sql: "select userId as " + fieldId + ",username from fcq_user where deleteMark <> 1 order by sortNo"
        })
        return ret;
    },
    selectEmployee: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "employeeid";
        if (IsSpace(fieldName)) fieldName = "employeename";
        CommonSelect({
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "ѡ��ְԱ",
            sql: "select employeeid,employeename from FCQ_EMPLOYEE where deleteMark <> 1 and typeName='����' order by sortNo"
        })
    },
    selectManageType: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "id";
        if (IsSpace(fieldName)) fieldName = "manageType";
        CommonSelect({
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "ѡ��ҵ���������",
            sql: "select id,manageType from FCQ_manageType where deleteMark <> 1  "
        })
    },
    selectNation: function(controlId, field) {
        if (IsSpace(field)) field = "nation";
        CommonSelect({
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            //idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: field,
            cols: 2,
            islist: 1,
            title: "ѡ������",
            sql: "select name as "+ field +" from fc_datadict where deleteMark <> 1 and fcSysMark=0 and typename='����' order by sortNo"
        })
    }
    

}



function selectDept(id) {//�ڴ򿪴��ڵ�radiolist�ؼ���ѡ������
    ///idΪdropdownlist�ؼ���ID
    //alert($obj($id(id).getAttribute("dataset")).Field("sdeptid").Value);
    CommonSelect({
        istree: 1,
        ismultisel:1,
        //islist: 1, //��ѡʱΪcheckboxlist,������radiolist
        cols: 3, //����
        obj: $obj(id), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
        selectedvalue:$obj($id(id).getAttribute("dataset")).Field("sdeptid").Value,
        idfieldname:"sdeptid",
        textfieldname: "sdeptname", //��ѡ��, ǰһ���ڵ�text�ֶ���,���ڰ��ֶ�ͬ����������.ֻ��isgrid!=1ʱ����Ч
        //hidefields:"sdeptid",
        sql: "select sdeptcode,sdeptname,sdeptid from FCS_DEPT where sdeptname !='' order by sdeptcode " //��ѡ��, �������ڵ���ʾ�����õ�SQL���.

    })
}

//��fcuser.xml�ļ������ݶ�Ӧ����eform���еĶ��û���ɫȺ���ѡ��
var fcuser={
	userTable        : "", 
	roleTable        : "",
	groupTable       : "",
	userRoleTable    : "",
	userGroupTable   : "",
	groupRoleTable   : "",
	
	userId           : "",userId_mark           : "",
	userCode         : "",userCode_mark         : "",
	userName         : "",userName_mark         : "",
	userStatus       : "",userStatus_mark       : "",
	
	roleId           : "",roleId_mark           : "",
	roleName         : "",roleName_mark         : "",
	roleStatus       : "",roleStatus_mark       : "",
	
	groupId          : "",groupId_mark          : "",
	groupCode        : "",groupCode_mark        : "",
	groupName        : "",groupName_mark        : "",
	groupStatus      : "",groupStatus_mark      : "",
	
	userRole_id      : "",userRole_id_mark      : "",
	userRole_roleId  : "",userRole_roleId_mark  : "",
	userRole_userId  : "",userRole_userId_mark  : "",
	
	userGroup_id     : "",userGroup_id_mark     : "",
	userGroup_groupId: "",userGroup_groupId_mark: "",
	userGroup_userId : "",userGroup_userId_mark : "",
	
	groupRole_id     : "",groupRole_id_mark     : "",
	groupRole_groupId: "",groupRole_groupId_mark: "",
	groupRole_roleId : "",groupRole_roleId_mark : ""
	};	
function getUserConfiguration(){
	// �Ѿ���ù��ˣ��Ͳ�����������
	// if (!IsSpace(fcuser.userTable)) return;

	// ���sql���û��������û�id���ֶε�ֵ
	var sKey = "?operate=get_user_configuration";

	var strReturn = new Eapi.RunAjax().sendHttp(location.protocol + '//' + location.host + fcpubdata.servletPath + '/DesignerServlet' + fcpubdata.dotnetVersion + sKey, "");
	if (IsSpace(strReturn)) return; //fhj 2013-03-20���û����Ϣ�ͷ��ر��ⷢ���վ���alert()
	var oDom = SetDom(strReturn);
	if (oDom.documentElement == null) {//fhj 2013-03-20����Ϊ�վͷ���
	    alert(strReturn);
	    return;
	}
	var bResult = oDom.documentElement.childNodes[0].text;
	
	if (bResult=="false") {
		alert(oDom.documentElement.childNodes[1].text);
		return;	
	}
	
	var oList = oDom.getElementsByTagName("node");
	for (var i=0; i<oList.length; i++){	

		var key = oList[i].getAttribute("key");
		var datatype = oList[i].getAttribute("datatype");
		if (IsSpace(datatype) || datatype=="string") // ������������
			datatype="'";
		else
		    datatype="";
		    	
		var val = oList[i].text;
		
		if (key=="user.table") fcuser.userTable = val;
		if (key=="role.table") fcuser.roleTable = val;
		if (key=="group.table") fcuser.groupTable = val;
		if (key=="user_role.table") fcuser.userRoleTable = val;
		if (key=="user_group.table") fcuser.userGroupTable = val;
		if (key=="group_role.table") fcuser.groupRoleTable = val;
	
		if (key=="user.id") {fcuser.userId = val;fcuser.userId_mark = datatype;}
		if (key=="user.code") { fcuser.userCode = val;fcuser.userCode_mark =datatype;}
		if (key=="user.name") {fcuser.userName = val;fcuser.userName_mark =datatype;}
		if (key=="user.status") {fcuser.userStatus = val;fcuser.userStatus_mark =datatype;}

		if (key=="group.id") {fcuser.groupId = val;fcuser.groupId_mark =datatype;}
		if (key=="group.code") {fcuser.groupCode = val;fcuser.groupCode_mark =datatype;}
		if (key=="group.name") {fcuser.groupName = val;fcuser.groupName_mark =datatype;}
		if (key=="group.status") {fcuser.groupStatus = val;fcuser.groupStatus_mark =datatype;}
	
		if (key=="role.id") {fcuser.roleId = val;fcuser.roleId_mark =datatype;}
		if (key=="role.name") {fcuser.roleName = val;fcuser.roleName_mark =datatype;}
		if (key=="role.status") {fcuser.roleStatus = val;fcuser.roleStatus_mark =datatype;}
	
		if (key=="user_role.id") {fcuser.userRole_id = val;fcuser.userRole_id_mark =datatype;}
		if (key=="user_role.roleid") {fcuser.userRole_roleId = val;fcuser.userRole_roleId_mark =datatype;}
		if (key=="user_role.userid") {fcuser.userRole_userId = val;fcuser.userRole_userId_mark =datatype;}

		if (key=="user_group.id") {fcuser.userGroup_id = val;fcuser.userGroup_id_mark =datatype;}
		if (key=="user_group.groupid") {fcuser.userGroup_groupId = val;fcuser.userGroup_groupId_mark =datatype;}
		if (key=="user_group.userid") {fcuser.userGroup_userId = val;fcuser.userGroup_userId_mark =datatype;}
		
		if (key=="group_role.id") {fcuser.groupRole_id = val;fcuser.groupRole_id_mark =datatype;}
		if (key=="group_role.roleid") {fcuser.groupRole_roleId = val;fcuser.groupRole_roleId_mark =datatype;}
		if (key=="group_role.groupid") {fcuser.groupRole_groupId = val;fcuser.groupRole_groupId_mark =datatype;}
	}
	
}
// ����fcuser.xml�����õı��ֶβ�ѯ��������sMark��ֵ��ƴsql
function setFcuserCondition(sField,sMark,sValue){
	var str = "";
	if (!IsSpace(sValue)){
		if (sMark=="'"){
			str = " and " +  sField + " like " + sMark +"%" + sValue + "%" + sMark ;
		}
		else{
			str = " and " +  sField + " = " + sValue;
		}
	}	
	return str;
}
// ����ҳ������������
function setLikeCondition(sField,sValue){
	var str = "";
	if (!IsSpace(sValue))
		str = " and " +  sField + " like '%" + sValue + "%' ";
	
	return str;	
}
// ����ҳ��������������Ϊ���ֵ���� 2011-5-18
function setIntCondition(sField,sValue){
	var str = "";
	if (!IsSpace(sValue))
		str = " and " +  sField + " =" + sValue ;
	
	return str;	
}

// ʵ������ ִ�ж��� �������б�ʵ���б��е� ִ�ж�����
function uf_doAction(wfId,wfName,wfDesc,wfVersion){
	var sKey = "?operate=get_action_list&wf_id=" + wfId ;	


	var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");
	var oDom=SetDom(strReturn);

	var bResult=oDom.documentElement.childNodes[0].text;
	var surl,wfName
	if (bResult=="false") {
		alert(oDom.documentElement.childNodes[1].text);
		return;	
	}
	else{
		
		var stage = oDom.documentElement.childNodes[1].text; // ="step" �����˲�����
		var num = oDom.documentElement.childNodes[2].text; // ����ĵ�ǰ��ִ�е�
															// action����
		var wfId = oDom.documentElement.childNodes[3].text;// ����ʵ��id
		// var fieldkey = oDom.childNodes(0).childNodes(5).text;//ҵ��id�ֶ�
		// var fieldkeyvalue =
		// oDom.childNodes(0).childNodes(6).text;//ҵ��id�ֶζ�Ӧ�ļ�¼ֵ
	
		if (num==1){// ֱ�����ӵ�action��view��
			var action = oDom.getElementsByTagName("action");
			var actionId = action[0].getAttribute("id");
			var actionName = action[0].getAttribute("name");
			var view = action[0].getAttribute("view");
			var traceId = action[0].getAttribute("traceId");// �ӵ�ǰ��������id
																	// 2011-9-17
			var dynamicId = action[0].getAttribute("dynamic_instance_id");
			var fieldkey = action[0].getAttribute("bs_id_field");
			if (fieldkey==null) fieldkey="";
			var fieldkeyvalue = action[0].getAttribute("id_field_value");
			if (fieldkeyvalue==null) fieldkeyvalue="";
			
			if (view==""){// û��view,�����actionѡ��ҳ�����action���֣�ִ��doAction
				var sXml = "<root>";
				sXml +="<wfname>" + wfName +"</wfname>";
				sXml +="<wfdesc>" + escape(wfDesc) +"</wfdesc>";
				sXml +="<wfversion>" + wfVersion +"</wfversion>";
			
				sXml +="<action name ='" + escape(actionName) + "' id='" + actionId +"'";
				sXml +=" field_key='" + fieldkey + "' ";
				sXml +=" field_key_value='" + fieldkeyvalue + "' ";
				if (dynamicId!=null)
					sXml +=" dynamic_instance_id='" + dynamicId + "' ";
				sXml +=" traceId='" + traceId + "' ";// 2011-9-17
				sXml +="/>";
					
				sXml+="</root>";
				
				var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
				surl +="&domxml=" + sXml;
				surl +="&wfId=" + wfId;

				surl +="&wfName=" + wfName;
				surl +="&wfDesc=" + escape(wfDesc);
				surl +="&wfVersion=" + wfVersion;				
				
				window.open(surl,"_self");
				// window.open(surl);
				return;				
			}
			else{// ��view��ֱ�ӽ���view���ӵı�ҳ�棬���ύ��ʱ��ͬʱ������doAction
				var surl = unescape(view) ;
				surl = surl + "&wfName=" + wfName ;
				surl = surl + "&wfDesc=" + escape(wfDesc);
				surl = surl + "&wfVersion=" + wfVersion ;
				surl = surl + "&wfId=" + wfId
				surl = surl + "&actionId=" + actionId;
				surl = surl + "&traceId=" + traceId;// 2011-9-17
				surl = surl + "&"+fieldkey+"="+fieldkeyvalue;
				if (dynamicId!=null)
					surl = surl + "&dynamicInstanceId="+dynamicId; // ��wf_tools.htmҳ����ȡ�˲���
				
				// window.open(location.protocol+'//'+location.host +
				// fcpubdata.path + surl,"_self");
				window.open(location.protocol+'//'+location.host + fcpubdata.path + surl);
				return;			
			}			
		}
		else{// ���action���û�ѡ��һ��ִ��
			var sXml = "<root>";
			sXml +="<wfname>" + wfName +"</wfname>";
			sXml +="<wfdesc>" + escape(wfDesc) +"</wfdesc>";
			sXml +="<wfversion>" + wfVersion +"</wfversion>";
			// sXml +="<fieldkey>" + fieldkey + "</fieldkey>";
			// sXml +="<fieldkeyvalue>" + fieldkeyvalue + "</fieldkeyvalue>";
		
		
			var oActionList = oDom.getElementsByTagName("action");
			var name,id,view,traceId;
			var dynamicId;
			for (var i=0;i<oActionList.length;i++){
				name = escape(oActionList[i].getAttribute("name"));
				id = oActionList[i].getAttribute("id");
				view = oActionList[i].getAttribute("view");
				traceId = oActionList[i].getAttribute("traceId");// 2011-9-17
				dynamicId = oActionList[i].getAttribute("dynamic_instance_id");

				var fieldkey = oActionList[i].getAttribute("bs_id_field");
				if (fieldkey==null) fieldkey="";
				var fieldkeyvalue = oActionList[i].getAttribute("id_field_value");
				if (fieldkeyvalue==null) fieldkeyvalue="";
				
				sXml +="<action name ='" + name + "' id='" + id + "' view='" + view + "'";
				sXml +=" field_key='" + fieldkey + "' ";
				sXml +=" field_key_value='" + fieldkeyvalue + "' ";
				if (dynamicId!=null)
					sXml +=" dynamic_instance_id='" + dynamicId + "' ";
				sXml +=" traceId='" + traceId + "' ";
				sXml +="/>";
			}
			sXml+="</root>";
			
			var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
			surl +="&wfId=" + wfId;

			surl +="&wfName=" + wfName;
			surl +="&wfDesc=" + escape(wfDesc);
			surl +="&wfVersion=" + wfVersion;			
			
			surl +="&domxml=" + sXml;
			
			window.open(surl,"_self");
			// window.open(surl);
			return;
		}	
	}	
}
// �����ύ���� 2011-12-5
function show_next_step(oDom){
	var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=show_next_step&djtype=WF";
	surl +="&domxml=" + escape(oDom.documentElement.xml);
	parent.window.open(surl,"_self");	
	return;					
}

// �����õĺ��� ִ��һ������֮�� (�Զ��幤�����͹�����������)
function after_doAction(oDom){
	// ��wf_action_list.djҳ�������ӽ���wfName��ȫ�ֱ������Ѿ���ֵ�ˡ�
	// ��ҵ����е�url�ϵõ�����
	var wfName = parent.Request.QueryString('wfName').toString();
	var wfDesc = unescape(parent.Request.QueryString('wfDesc').toString());

	var wfVersion = parent.Request.QueryString('wfVersion').toString();
	
	// var actionId=parent.Request.QueryString('actionId').toString();

	// var dynamicInstanceId =
	// parent.Request.QueryString('dynamicInstanceId').toString();


	// ִ�гɹ���
	var stage = oDom.documentElement.childNodes[1].text;// stage�϶���"step"

	var num = oDom.documentElement.childNodes[2].text; // ����ĵ�ǰ��ִ�е� action����
	wfId = oDom.documentElement.childNodes[3].text;// ����ʵ��id
	// var bsTable = oDom.childNodes(0).childNodes(4).text;//ҵ�������
	// var fieldkey = oDom.childNodes(0).childNodes(5).text;//ҵ��id�ֶ�
	// var fieldkeyvalue = oDom.childNodes(0).childNodes(6).text;//ҵ��id�ֶζ�Ӧ�ļ�¼ֵ
	// ��ʼ�����̺���ܻ�δ�õ� ҵ��id�ֶ�ֵ���ٴλ��ֵ��ȥ����ҵ�����Ϣ�����޸ĵ�action�ڵ��У�
// if (wfId!="" && bsTable!="" && fieldkey!="" && fieldkeyvalue==""){
// var sKey = "?operate=get_bs_id_value&wf_id=" + wfId +"&field_key=" + fieldkey
// + "&bs_table=" + bsTable;
// var strReturn=new
// Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host +
// fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");
// var oBs=SetDom(strReturn);
// var bResult=oBs.childNodes(0).childNodes(0).text;
// if (bResult=="false") {
// alert(oBs.childNodes(0).childNodes(1).text);
// return;
// }
// else{
// fieldkeyvalue = oBs.childNodes(0).childNodes(1).text;
// }
// }
	if (num=="0"){// ��һ���޿�ִ�е�action
		// parent.window.close();���ҳ�йرղ��˴�ҳ�档
		// alert("����ִ����ɣ�");
		// �����wf_action_list������������ˢ�´�ҳ����wf_tools��������parent.window.close()��رյ�ǰ�򿪵ı�ҳ��
		var sXml = "<root>";		
		sXml +="<wfname>" + wfName +"</wfname>";
		sXml +="<wfdesc>" + escape(wfDesc) +"</wfdesc>";
		sXml +="<wfversion>" + wfVersion +"</wfversion>";
		
		// sXml +="<fieldkey>" + fieldkey + "</fieldkey>";
		// sXml +="<fieldkeyvalue>" + fieldkeyvalue + "</fieldkeyvalue>";
		// sXml +="<action name ='" + escape(actionName) + "' id='" + actionId
		// +"'/>";
		sXml+="</root>";
	
		var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
		surl +="&domxml=" + sXml;
		surl +="&wfId=" + wfId;
		
		surl +="&wfName=" + wfName;
		surl +="&wfDesc=" + escape(wfDesc);
		surl +="&wfVersion=" + wfVersion;
	
		parent.window.close();
		window.open(surl,"_parent");	
		return;					
	}
	else if (num=="1"){// ֱ�����ӵ�action��view��
		var action = oDom.getElementsByTagName("action");// ֻ��һ��action�ڵ�����
		var actionId = action[0].getAttribute("id");
		var actionName = action[0].getAttribute("name");
		var view = action[0].getAttribute("view");
		var traceId = action[0].getAttribute("traceId");// ��ǰ��������id
																// 2011-9-17
		var dynamicId = action[0].getAttribute("dynamic_instance_id");

		var fieldkey = action[0].getAttribute("bs_id_field");
		if (fieldkey==null) fieldkey="";
		var fieldkeyvalue = action[0].getAttribute("id_field_value");
		if (fieldkeyvalue==null) fieldkeyvalue="";
		
		if (view==""){// û��view,�����actionѡ��ҳ�����action���֣�ִ��doAction
			var sXml = "<root>";
			sXml +="<wfname>" + wfName +"</wfname>";
			sXml +="<wfdesc>" + escape(wfDesc) +"</wfdesc>";
			sXml +="<wfversion>" + wfVersion +"</wfversion>";

			// sXml +="<action name ='" + escape(actionName) + "' id='" +
			// actionId +"'/>";
			sXml +="<action name ='" + escape(actionName) + "' id='" + actionId +"'";
			sXml +=" field_key='" + fieldkey + "' ";
			sXml +=" field_key_value='" + fieldkeyvalue + "' ";
			if (dynamicId!=null)
				sXml +=" dynamic_instance_id='" + dynamicId + "' ";
			sXml +=" traceId='" + traceId + "' ";// 2011-9-17
			sXml +="/>";

			sXml+="</root>";
		
			var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
			surl +="&domxml=" + sXml;
			surl +="&wfId=" + wfId;
			
			surl +="&wfName=" + wfName;
			surl +="&wfDesc=" + escape(wfDesc);
			surl +="&wfVersion=" + wfVersion;
			
			parent.window.close();
			window.open(surl,"_self");	
			return;				
		}
		else{// ��view��ֱ�ӽ���view���ӵı�ҳ�棬���ύ��ʱ��ͬʱ������doAction
			var surl = unescape(view) ;
			surl = surl + "&wfName=" + wfName ;
			surl = surl + "&wfDesc=" + escape(wfDesc) ;
			surl = surl + "&wfVersion=" + wfVersion ;
			surl = surl + "&wfId=" + wfId
			surl = surl + "&actionId=" + actionId;
			surl = surl + "&traceId=" + traceId;// 2011-9-17
			surl = surl + "&"+fieldkey+"="+fieldkeyvalue;
			if (dynamicId!=null)
				surl = surl + "&dynamicInstanceId="+dynamicId; // ��wf_tools.htmҳ����ȡ�˲���
			
			parent.window.close();
			window.open(location.protocol+'//'+location.host + fcpubdata.path + surl);	
			return;			
		}			
	}
	else{// ���action���û�ѡ��һ��ִ��
		var sXml = "<root>";
		sXml +="<wfname>" + wfName +"</wfname>";
		sXml +="<wfdesc>" + escape(wfDesc) +"</wfdesc>";
		sXml +="<wfversion>" + wfVersion +"</wfversion>";
		// sXml +="<fieldkey>" + fieldkey + "</fieldkey>";
		// sXml +="<fieldkeyvalue>" + fieldkeyvalue + "</fieldkeyvalue>";
			
		var oActionList = oDom.getElementsByTagName("action");
		var name,id,view,traceId;
		var dynamicId;
		for (var i=0;i<oActionList.length;i++){
			name = escape(oActionList[i].getAttribute("name"));
			id = oActionList[i].getAttribute("id");
			view = oActionList[i].getAttribute("view");
			traceId = oActionList[i].getAttribute("traceId");// 2011-9-17
			dynamicId = oActionList[i].getAttribute("dynamic_instance_id");
			
			var fieldkey = oActionList[i].getAttribute("bs_id_field");
			if (fieldkey==null) fieldkey="";
			var fieldkeyvalue = oActionList[i].getAttribute("id_field_value");
			if (fieldkeyvalue==null) fieldkeyvalue="";
			
			
			// sXml +="<action name ='" + name + "' id='" + id + "' view='" +
			// view + "'/>";
			sXml +="<action name ='" + name + "' id='" + id + "' view='" + view + "'";	
			sXml +=" field_key='" + fieldkey + "' ";
			sXml +=" field_key_value='" + fieldkeyvalue + "' ";
			if (dynamicId!=null)
				sXml +=" dynamic_instance_id='" + dynamicId + "' ";
			sXml +=" traceId='" + traceId + "' ";// 2011-9-17
			sXml +="/>";
			
		}
		sXml+="</root>";
		
		var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
		surl +="&wfId=" + wfId;
		
		surl +="&wfName=" + wfName;
		surl +="&wfDesc=" + escape(wfDesc);
		surl +="&wfVersion=" + wfVersion;
				
		surl +="&domxml=" + sXml;
		
		parent.window.close();
		window.open(surl,"_self");	
		return;
	}		
}
// 2004-03-03 �û��Զ����ȫ�ֺ���,���ڷ�һЩ��ĳ��ģ����(����CRM JXC)���õ�ȫ�ֺ���.
function getuser() {
	return "fc";
}
function getusername() {
	return "fc";
}

/**
 * ���ƴ�eform��Ƶı���Ȩ�� �ڴ˺�������parent.Request.QueryString("djsn").toString()
 * ��ʽ����?��Ĳ���.
 * 
 * @return �� ��ʾ��Ȩ��.
 * @date 2006-02-11
 */
function EformEnterStatus() {
/*
 * var djtype = parent.Request.QueryString("djtype").toString(); //������� var
 * djsn = parent.Request.QueryString("djsn").toString(); //��djsn
 * 
 * if(djsn == "application_sub"){ var name =
 * GetSession('username=')['username']; if(name == "liuxm"){ return ""; }
 *  }
 */
	return "OK";
}
/**
 * �ӱ����һ�ֱ���ģʽʱ�ĴӼ��ֶε����ɺ���
 * 
 * @param iRowNo
 *            �кţ���0��ʼ��,����
 * @param sSubKeyFieldName
 *            �Ӽ����ֶ���
 */
function IGetSubTableKeyValue(iRowNo,sSubKeyFieldName) {
	return iRowNo + 1 ;
}
/**
 * �����ܲ�������ĳ������
 * 
 * @date 2007-04-18
 */
function EbiaoEnterStatus(callback) {
	/**
	 * ���������ʾ�������������б������Ȩ�޿���,���ȴ�session������ȡ��Ȩ����Ϣ,Ȼ�����ж�.
	 * GetSession("username",function (arrRet){ var sessionValue =
	 * arrRet["username"]; alert(parent.Request.QueryString("name").toString());
	 * //�������� alert(parent.Request.QueryString("file").toString()); //�����ļ�
	 * if(sessionValue == "liuxm" &&
	 * parent.Request.QueryString("name").toString()=="���ۻ��ܱ���" ){
	 * alert("����Ȩ���д˱���!"); callback(false); //֪ͨ�رմ��� return; } callback(true); })
	 */
	// fcpub.toolbar =
	// "preview,print,printdirect,printall,|,query,pageset,refresh,|,expexcel,expexcelall,directexppdf";e_directrun
	
// if(parent.Request.QueryString("e_runsavefile").toString() != "undefined" ||
// (parent.Request.QueryString("e_directrun").toString() != "undefined" &&
// parent.Request.QueryString("e_directrun").toString() != "yes") ){
// fcpub.tempFilePath = GetUrlFirstPart() + "/ebsys/ebtmpfile1/";
// }
	callback(true); // ִ�д������ʾ���������б���.
}
/**
 * �ӹ������ϵ㱣�水ťʱִ�д˺���,���ñ��浱ǰ�������н��ʱ
 * 
 * @date 2007-09-03
 */
function EbiaoSaveEvent() {
	// �˴�������һ�����봰�ڹ���,��ȷ���رմ��ں�,��Ҫ������ļ������������saveFileName����,Ҫ�����·������fcpub.tempFilePath����,
	
	var saveFileName = "curSave";// Ҫ��������ļ���
	RunReport(1,"����",saveFileName,function (result){
		var TotalPages = result.pages ; // ��ҳ��
		var sRetValue = result.value ; // ���α������еĲ�������xml�ַ���.
		var sReportFile = parent.sPubPath; // �������еı����ļ�.
	});

}

/**
 * �򿪱�Ԫ��Ȩ�����ô��� added by liuxr at 2008-3-14 �˺��������Դ��ڵ�Ȩ�����ð�ť�ĵ���¼��ϵ���
 */
function EformActionButtonClick()
{
    var arr = fcpubdata.obj[0];
    var isMulti = (arr.constructor == window.Array || arr.length > 1 ) && IsSpace(arr.controltype); // 2011-06-29
																									// ����
																									// comboboxʱ�жϲ���.
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

    var MainDiv = fcpubdata.obj[2]; 	// eformarea();
	// var sFile = fcpubdata.path +
	// "/fceform/common/djframe.htm?djsn=roleSet&djtype=OF";
	var sFile = fcpubdata.path + "/fceform/common/djframe.htm?djsn=rs_role_set&djtype=WF_DSN";
    if(obj.controltype == "dataset"){
        obj.curFieldName = dssub1.Field("fdname").Value;
        var multiFields = "";
        for (var i = 0; i < dssub1.RecordCount; i++) {
            if (dssub1.oDom.documentElement.childNodes(i).getAttribute("multisel") == '��') {
                if (dssub1.oDom.documentElement.childNodes(i).childNodes(0).text != dssub1.Field("fdname").Value) {
                    multiFields += dssub1.oDom.documentElement.childNodes(i).childNodes(0).text + ",";
                }
            }
        }
        if (multiFields != "") multiFields = multiFields.substring(0, multiFields.length - 1);
        obj.multiFields = multiFields;
        
    }
    
	var strReturn = window.showModalDialog(sFile,[MainDiv, arr,isMulti ],"scroll:no;status:no;dialogHeight:590px;dialogWidth:730px;dialogTop:180;dialogLeft:250px");
	if(IsSpace(strReturn) == false){
		// alert(obj.controltype);
		// obj.roleXml = strReturn;
		var stmp = "";
		if (IsSpace( MainDiv.roleXml) == false) {
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
		        // ɾ��ԭ����
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
		
		MainDiv.roleXml = stmp + strReturn ;
		// alert(MainDiv.roleXml);
		// CopyToPub(MainDiv.roleXml);
	}
}

/**
 * ҳ������ʱ��Ԫ�ص�Ȩ�޼�� added by liuxr at 2008-3-14 �˺����ڱ����¼��е���,Ҳ�������Լ���Ҫʱ����
 */
function EformCheckRoleInfo()
{
	if (IsSpace(fcpubdata.area.roleXml)) return ;
	var strRoleXml = fcpubdata.area.roleXml
	if(strRoleXml == "<root></root>") return;
	/*
	 * if(fcpubdata.dotnetVersion==".aspx"){ var
	 * retX=SendHttp(location.protocol+"//"+location.host + fcpubdata.path +
	 * "/fceformext/roleSet/RoleCheck.aspx",strRoleXml); //alert(retX); try{
	 * eval(retX); }catch(e){} }else{
	 */
	// �����̹ҽӵı�
	var wfName = parent.Request.QueryString('wfName').toString();
	var wfVersion=parent.Request.QueryString('wfVersion').toString();
	var actionId=parent.Request.QueryString('actionId').toString();
	
	var sKey ="&wf_name=" + wfName;
	sKey +="&wf_version=" + wfVersion;
	sKey +="&action_id=" + actionId;	
	SendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=roleCheck"+sKey,strRoleXml,function(result){
		if(result.value == null)return;
		try{
			eval(result.value);
		}catch(e){}
	});
	// }
}

/**
 * �������ߵ�װ��ģ�� 2011-02-15 sTitle ���� sUrl url��
 */
function zkLoadMod(sTitle, sUrl) {
    // �Ժ�����ڴ˼���ͳһ�ԵĿ���,����Ƶ�ǰ�Ľ������ĸ��ȵ�
    var urlAll = "../../zk/common/zkDjFrame.htm?url=" + escape(sUrl) + "&caption=" + escape(sTitle);
    window.open(urlAll, "rightWin");
}



// *************************************************************
// ���������� ��������������ť��Ӧ�Ĺ��ܺ��� �ݴ� 2011-06-02
// ���������� ֻ���� ҵ���¼����ִ�����̵�action
// -------------------------------------------------------------
function wftools_tempSave(){
	var wfId=parent.Request.QueryString('wfId').toString();
	if (IsSpace(wfId)){
		alert("����ʵ����δ������������ҵ�����ݵ��ݴ棡");
		return;
	}
	if (!window.confirm("ȷ��ֻ��ʱ�ύ��������")) return;
	
	
	var wfName = parent.Request.QueryString('wfName').toString();
	var wfDesc = unescape(parent.Request.QueryString('wfDesc').toString());
	var wfVersion = parent.Request.QueryString('wfVersion').toString();	
	var actionId=parent.Request.QueryString('actionId').toString();
	var dynamicInstanceId = parent.Request.QueryString('dynamicInstanceId').toString();	
	
	// var oWin = parent.topic; //��ͬһ��ҳ����
	
	try{// ���Ӽ�����2012-1-17
		var oDsMain = document.getElementById(fcpubdata.dsMain);		
		if (oDsMain.isFieldName("WF_ID") == true){
			if (IsSpace(oDsMain.Field("WF_ID").Value))
				oDsMain.Field("WF_ID").Value = wfId;
		}	
	}catch(e){}
	
	// try{
	// if (typeof(oDsMain.Field("DYNAMIC_INSTANCE_ID"))!="undefined" &&
	// dynamicInstanceId!="undefined")
	// oDsMain.Field("DYNAMIC_INSTANCE_ID").Value = dynamicInstanceId;
	// }catch(e){}

	try{// ���Ӽ�����2012-1-17
	if(oDsMain.Update()==1) { // eform
		alert("�������ݳ���");
		return;
	}
	}catch(e){}
	
	if (parent.Request.QueryString('show').toString()=="true"){
		alert("ִ�й��Ķ������������ݴ������");
		return;	
	}
	if (parent.Request.QueryString('show').toString()=="copy"){
		alert("���͵�������Ϣ��ֻ�ܲ鿴���������ݴ������");
		return;	
	}
	
	var haveSaveFun=true;	
	try { 		
		// parent.topic.uf_wf_save(); //ִ��ҵ��ҳ��ı���
		uf_wf_save(); // ִ��ҵ��ҳ��ı���
		alert("�����¼�ɹ���");
		// parent.window.close();
		
	}catch(e){ 
		haveSaveFun = false; 
	}
	if (!haveSaveFun){
		// �ݴ��¼����鵱ǰ���� �Ƿ��дˣ���ִ�еĶ���������ִ�д���ʷ����Ķ������޸�ҵ������
		var sKey = "wf_id=" + wfId +";action_id=" + actionId;	
		if(typeof(dynamicInstanceId) != "undefined" && dynamicInstanceId != null && dynamicInstanceId!="undefined" && dynamicInstanceId!="null") 
			sKey += ";dynamic_instance_id=" + dynamicInstanceId;
		fcpubdata.submitUserType = "before_temp_check";
		fcpubdata.submitPubParam = sKey;
		
		var sErr =doSubmitData(function(retDom){
			// var oDom = SetDom(retDom.childNodes(0).xml);
			alert("�ݴ����ݳɹ�!");
			parent.window.close();
			// after_doAction(oDom);
		}); 
		if(IsSpace(sErr)==false) alert(sErr);
	}
	else{
		
	}
}
// *************************************************************
// ���������� ��������������ť��Ӧ�Ĺ��ܺ��� ִ�� 2011-07-21
// ���������� ִֻ�����̵Ķ�����������ҵ���¼ typeof(type)="undefined" ֻ�ύ���̺󣬲��г���ִ��Ȩ�޵���һ��������
// type=1 "ִֻ�����̵Ķ�����ת��һ��": wftools_flowSave(1); break;
// type=2 "ִֻ�����̵Ķ�����رմ���": wftools_flowSave(2); break;
// type=3 "ִֻ�����̵Ķ������޲���": wftools_flowSave(3); break;
// -------------------------------------------------------------
function wftools_flowSave(type){
	// if (!window.confirm("ȷ��ִֻ�����̵Ķ�����")) return;
	var wfId=parent.Request.QueryString('wfId').toString();
	if (IsSpace(wfId)){
		alert("����ʵ����δ����������ִ�����̵Ķ�����");
		return;
	}
	// ��url�л�ò���
	var wfName = parent.Request.QueryString('wfName').toString();
	var wfDesc = unescape(parent.Request.QueryString('wfDesc').toString());

	var wfVersion = parent.Request.QueryString('wfVersion').toString();
	var actionId=parent.Request.QueryString('actionId').toString();

	var dynamicInstanceId = parent.Request.QueryString('dynamicInstanceId').toString();
	

	var sKey = "?operate=do_action&wf_name=" + wfName + "&wf_version=" + wfVersion +"&wf_id=" + wfId +"&action_id=" + actionId;	// ִ��һ����ʼ���Ķ���
	sKey +="&save_type="+type;// �����ύ���Ϳ����ύ��ɺ����ʾ 2011-12-5
	
	if (dynamicInstanceId!=null && dynamicInstanceId!="null" && dynamicInstanceId!="undefined" && typeof(dynamicInstanceId)!="undefined" && dynamicInstanceId!="")
		sKey +="&dynamic_instance_id=" + dynamicInstanceId;

	
	// ׼������������
	try{
	//var cbofree =parent.toolbar.$id("wf_free_select")
	var cbofree =$id("wf_free_select",$win("toolbar",parent));
	if (cbofree!=null){
		var freeStepid = cbofree.value;
		if (!IsSpace(freeStepid)){
			var freeshow = 	cbofree.options[cbofree.selectedIndex].text;
			var freetype = freeshow.substring(0,3);

			if (freetype=="���˵�") 
				freetype = "last";		
			else
				freetype = "next";	
			
			if (freetype!=null && freeStepid!=null){
		
				sKey +="&free_type=" + freetype + "&free_stepid=" + freeStepid; // "last"
																				// "next"
			}
		}	
	}
	}catch(e){}

	var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,null);
	
	var oDom=SetDom(strReturn);

	var bResult=oDom.documentElement.childNodes[0].text;
	
	if (bResult=="false") {
		alert("ִ�ж�����������" + oDom.documentElement.childNodes[1].text);
		return;	
	}

	if (typeof(type)=="undefined"){
		alert("�ύ���ݳɹ�!");
		after_doAction(oDom);
	}
	else if (type==1){ // �ύҵ������̺�ת��һ�� type="1"
		alert("�ύ���ݳɹ�!");
		show_next_step(oDom);
	}
	else if (type==2){ // �ύҵ������̺�رմ��� type="2" �ύҵ������̺��� type="3"
		var stepList = oDom.getElementsByTagName("step");
		var name,caller;
		var message="";
		for (var i=0;i<stepList.length;i++){
			name = stepList[i].getAttribute("name");
			caller = stepList[i].getAttribute("caller");
			message = message +"\r   " +  name + "(ִ���ˣ�" + caller +")";
		}
		if (message=="")
			alert("�ύ���ݳɹ���\r�������н�����");
		else
			alert("�ύ���ݳɹ���\r��һ����" + message );
		parent.window.close();
	}
	else{
		alert("�ύ���ݳɹ�!");
	}
	return;

	
}
// *************************************************************
// ���������� ��������������ť��Ӧ�Ĺ��ܺ��� ִ�� 2011-06-02
// ���������� �����̵ı��棬����ҵ���¼����ִ�����̵�action
// �ύҵ�����ݲ�ִ������ typeof(type)="undefined" ���г���ִ��Ȩ�޵���һ��������
// �ύҵ������̺�ת��һ�� type="1"
// �ύҵ������̺�رմ��� type="2"
// �ύҵ������̺��� type="3"
// -------------------------------------------------------------
function wftools_save(type){	
	var wfId=parent.Request.QueryString('wfId').toString();
	// if (!window.confirm("ȷ���ύ�����ݲ�ִ�����̵Ķ�����")) return;
	if (IsSpace(wfId))
		wftools_save_nowfid(type);
	else		
		wftools_save_wfid(type,wfId);
}
// ��wfid�ı��棬����ҵ���¼��ִ�����̶�������url�д���wfName,wfVersion,escape(wfDesc),actionId,dynamicInstanceId
function wftools_save_wfid(type,wfId){

	var wfName = parent.Request.QueryString('wfName').toString();
	var wfDesc = unescape(parent.Request.QueryString('wfDesc').toString());

	var wfVersion = parent.Request.QueryString('wfVersion').toString();
	// var wfId=parent.Request.QueryString('wfId').toString();
	var actionId=parent.Request.QueryString('actionId').toString();

	var dynamicInstanceId = parent.Request.QueryString('dynamicInstanceId').toString();

	// var oWin = parent.topic;
	try{// ���Ӽ�����2012-1-17
		var oDsMain = document.getElementById(fcpubdata.dsMain);		
		if (oDsMain.isFieldName("WF_ID") == true){
			if (IsSpace(oDsMain.Field("WF_ID").Value))
				oDsMain.Field("WF_ID").Value = wfId;
		}	
	}catch(e){}			

	// ���ʺ�ˣ�ִ��doAction() ���� �ύ��ǰ����ִ�� actionId�� ���淽��
	// ���� ���溯�� ʵ���������ܣ����浱ǰ�ļ�¼����һЩ��Ϣ���浽ps�������棻ִ��doAction������
	// ���أ���һ����������ִ�еĶ����б�
	var sKey = "wf_id=" + wfId +";action_id=" + actionId;	
	sKey +=";save_type="+type;// �����ύ���Ϳ����ύ��ɺ����ʾ 2011-12-5
	if(typeof(dynamicInstanceId) != "undefined" && dynamicInstanceId != null && dynamicInstanceId!="undefined" && dynamicInstanceId!="null") 
		sKey += ";dynamic_instance_id=" + dynamicInstanceId;

	// ׼������������
	try{
	
	//var cbofree =parent.toolbar.$id("wf_free_select")
	var cbofree =$id("wf_free_select",$win("toolbar",parent));
		
	if (cbofree!=null){
		var freeStepid = cbofree.value;
		if (!IsSpace(freeStepid)){
			var freeshow = 	cbofree.options[cbofree.selectedIndex].text;
			var freetype = freeshow.substring(0,3);

			if (freetype=="���˵�") 
				freetype = "last";		
			else
				freetype = "next";	
			
			if (freetype!=null && freeStepid!=null){
		
				sKey +=";free_type=" + freetype + ";free_stepid=" + freeStepid; // "last"
																				// "next"
			}
		}	
	}
	}catch(e){}
	
	try{// ���Ӽ�����2012-1-17
	if(oDsMain.Update()==1) { // eform
		alert("�������ݳ���");
		return;
	}
	}catch(e){}
	
	if (parent.Request.QueryString('show').toString()=="true"){
		alert("ִ�й��Ķ�����������ִ���ˣ�");
		return;	
	}
	if (parent.Request.QueryString('show').toString()=="copy"){
		alert("���͵�������Ϣ��ֻ�ܲ鿴��������ִ���ˣ�");
		return;	
	}
	
	var haveSaveFun=true;	
	try { 		
		uf_wf_save(); // ִ��ҵ��ҳ��ı���
		alert("�����¼�ɹ���");
		// parent.window.close();
		
	}catch(e){ 
		haveSaveFun = false; 
	}
	if (!haveSaveFun){
		
		// oWin.$eform('�ύ���ݳɹ�����ʾ')
		fcpubdata.submitUserType = "workflow_do_action";
		fcpubdata.submitPubParam = sKey;
		var sErr =doSubmitData(function(retDom){
			var oDom = SetDom(retDom.childNodes[0].xml);
			
			if (typeof(type)=="undefined"){
				alert("�ύ���ݳɹ�!");
				after_doAction(oDom);
			}
			else if (type==1){ // �ύҵ������̺�ת��һ�� type="1"
				alert("�ύ���ݳɹ�!");
				show_next_step(oDom);
			}
			else if (type==2){ // �ύҵ������̺�رմ��� type="2" �ύҵ������̺��� type="3"
				var stepList = oDom.getElementsByTagName("step");
				var name,caller;
				var message="";
				for (var i=0;i<stepList.length;i++){
					name = stepList[i].getAttribute("name");
					caller = stepList[i].getAttribute("caller");
					message = message +"\r   " +  name + "(ִ���ˣ�" + caller +")";
				}	
				if (message=="")
					alert("�ύ���ݳɹ���\r�������н�����");
				else
					alert("�ύ���ݳɹ���\r��һ����" + message );
				parent.window.close();
			}
			else{
				alert("�ύ���ݳɹ�!");
			}
		}); 
		if(IsSpace(sErr)==false) alert(sErr);
	}
	else{
		// parent.window.close();
		// ���ӵ���һ����Ŀ�ִ�ж����б����ߣ���ֻ��һ��actionʱ��ֱ�Ӵ�view��
		// after_doAction(oDom);
	}
	
}
// ��wfid�ı��棬����ҵ���¼��ִ�г�ʼ�����̵õ�wfid,��ִ�����̵ĵ�һ�������ָ������(actionId)
// ��url�д���initActionId,wfName,wfVersion,escape(wfDesc),actionId,dynamicInstanceId
// ֱ�Ӵ򿪱�����ʽ�����ύ��ʱ����������
function wftools_save_nowfid(type){
	var wfName = parent.Request.QueryString('wfName').toString();
	var wfDesc = unescape(parent.Request.QueryString('wfDesc').toString());

	var wfVersion = parent.Request.QueryString('wfVersion').toString();
	
	var actionId=parent.Request.QueryString('actionId').toString();

	var dynamicInstanceId = parent.Request.QueryString('dynamicInstanceId').toString();	
	
	var initActionId = parent.Request.QueryString('initActionId').toString();// ��ʼ������id
	// ��һ������ִ�еĶ���id
	// var actionId = parent.Request.QueryString('actionId').toString();
	
	
	var sKey = "wf_name=" + wfName ;
	sKey +=";wf_version=" + wfVersion ;
	sKey += ";init_actionid=" + initActionId;
	sKey += ";action_id=" + actionId	
	sKey +=";save_type="+type;// �����ύ���Ϳ����ύ��ɺ����ʾ 2011-12-5
	
	// var oWin = parent.topic;
	fcpubdata.submitUserType = "eform_inital_workflow";
	fcpubdata.submitPubParam = sKey;
	
	var sErr = doSubmitData(function(retDom){
		var oDom = SetDom(retDom.childNodes[0].xml);
		
		if (typeof(type)=="undefined"){
			alert("�ύ���ݳɹ�!");
			after_doAction(oDom);
		}
		else if (type==1){ // �ύҵ������̺�ת��һ�� type="1"
			alert("�ύ���ݳɹ�!");
			show_next_step(oDom);
		}
		else if (type==2){ // �ύҵ������̺�رմ��� type="2" �ύҵ������̺��� type="3"
			var stepList = oDom.getElementsByTagName("step");
			var name,caller;
			var message="";
			for (var i=0;i<stepList.length;i++){
				name = stepList[i].getAttribute("name");
				caller = stepList[i].getAttribute("caller");
				message = message +"\r   " +  name + "(ִ���ˣ�" + caller +")";
			}	
			if (message=="")
				alert("�ύ���ݳɹ���\r�������н�����");
			else
				alert("�ύ���ݳɹ���\r��һ����" + message );
			parent.window.close();
		}
		else{
			alert("�ύ���ݳɹ�!");
		}
		
	}); 
	if(IsSpace(sErr)==false) alert(sErr);
			
	
}
// *************************************************************
// ���������� ��������������ť��Ӧ�Ĺ��ܺ��� �켣 2011-06-02
// ���������� ��ʾ���̹켣
// -------------------------------------------------------------
function wftools_trace(){
	var wfId=parent.Request.QueryString('wfId').toString();
	if (IsSpace(wfId)){
		alert("����ʵ����δ���������ܲ鿴�켣��");
		return;
	}
	var browser = GetBrowserKey();
	var surl="";
	if (browser.indexOf("msie")>=0)	
		 surl = "/fceform/common/djframe.htm?djsn=wf_history_list&djtype=WF" ;
    else
    	surl = "/fceform/common/djframe.htm?djsn=wf_history_mini&djtype=WF_MO" ;	 		
	surl +="&wf_id=" + wfId;
	window.open(location.protocol+'//'+location.host + fcpubdata.path + surl);

}
// *************************************************************
// ���������� ��������������ť��Ӧ�Ĺ��ܺ��� ���� 2011-06-02
// ���������� ָֻ�����˵��Ǹ��ڵ㡣��� ִ�� ��������ִ�л���
// -------------------------------------------------------------
/*
 * function wftools_return(){ var wfId =
 * parent.Request.QueryString('wf_id').toString(); var
 * wfName=parent.Request.QueryString('wf_name').toString(); var
 * wfDesc=parent.Request.QueryString('wf_desc').toString(); var
 * wfVersion=parent.Request.QueryString('wf_version').toString(); if
 * (IsSpace(wfId)){ alert("����ʵ����δ���������ܻ��ˣ�"); return; }
 * 
 * var surl ="/fceform/common/djframe.htm?djsn=wf_tools_return&djtype=WF"; surl
 * +="&type=last";//��ʶ���� surl +="&wf_id=" + wfId; surl +="&wf_name=" + wfName;
 * surl +="&wf_desc=" + wfDesc; surl +="&wf_version=" + wfVersion;
 * 
 * var sFeatures =
 * "top=100,left=100,toolbar=no,width=420,height=200,directories=no,status=no,scrollbars=yes,resize=no,menubar=no";
 * window.open(location.protocol+'//'+location.host + fcpubdata.path +
 * surl,"",sFeatures); }
 */
// *************************************************************
// ���������� ��������������ť��Ӧ�Ĺ��ܺ��� ��ת 2011-06-02
// ���������� ָֻ����ת���Ǹ��ڵ㡣��� ִ�� ��������ִ����ת
// -------------------------------------------------------------
/*
 * function wftools_skip(){ var wfId =
 * parent.Request.QueryString('wf_id').toString(); var
 * wfName=parent.Request.QueryString('wf_name').toString(); var
 * wfDesc=parent.Request.QueryString('wf_desc').toString(); var
 * wfVersion=parent.Request.QueryString('wf_version').toString(); if
 * (IsSpace(wfId)){ alert("����ʵ����δ������������ת��"); return; }
 * 
 * var surl ="/fceform/common/djframe.htm?djsn=wf_tools_skip&djtype=WF"; surl
 * +="&type=next";//��ʶ��ת surl +="&wf_id=" + wfId; surl +="&wf_name=" + wfName;
 * surl +="&wf_desc=" + wfDesc; surl +="&wf_version=" + wfVersion;
 * 
 * var sFeatures =
 * "top=100,left=100,toolbar=no,width=420,height=200,directories=no,status=no,scrollbars=yes,resize=no,menubar=no";
 * window.open(location.protocol+'//'+location.host + fcpubdata.path +
 * surl,"",sFeatures); }
 */

function wftools_loadfree(cboGoto){
	
	var wfId = parent.Request.QueryString('wfId').toString();
	
	if (IsSpace(wfId)){
		// cboGoto.disabled=true;
		cboGoto.style.display="none";
		return;
	}
	var wfName=parent.Request.QueryString('wfName').toString();
	var wfVersion=parent.Request.QueryString('wfVersion').toString();
	// var wfDesc=escape(parent.Request.QueryString('wfDesc').toString());
	
	
	
	var sKey = "?operate=get_wffree_list";
	sKey +="&wf_id=" + wfId;
	sKey +="&wf_name=" + wfName;
	sKey +="&wf_version=" + wfVersion;
	
	var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");
	var oDom=SetDom(strReturn);
	
	var bResult=oDom.documentElement.childNodes[0].text;
	
	if (bResult=="false") {
		alert(oDom.documentElement.childNodes[1].text);
		return;	
	}
	var oListLast = oDom.getElementsByTagName("last");
	var oListNext = oDom.getElementsByTagName("next");
	
	
	// var lastInfo = oDom.childNodes(0).childNodes(1).xml;
	// var nextInfo = oDom.childNodes(0).childNodes(2).xml;
	
	// var cboGoto = $id("wf_free_select");
	var sOption = "<option selected value=''>��ѡ��������</option>";
	for (var i=0;i<oListNext.length;i++){
		var stepid = oListNext.item(i).getAttribute("id");
		var stepname ="��ת����" + oListNext[i].getAttribute("name");

		sOption += "<option value='" + stepid +"'>" + stepname + "</option>";	
	}
	
	
	for (var i=0;i<oListLast.length;i++){
		var stepid = oListLast[i].getAttribute("id");
		var stepname ="���˵���" +  oListLast[i].getAttribute("name");

		sOption += "<option value='" + stepid +"'>" + stepname + "</option>";	
	}
	var s = cboGoto.outerHTML.substring(0,cboGoto.outerHTML.length-9);
	cboGoto.outerHTML = s + sOption + "</select>";	
	

}

function wf_setQueryImage(){
	if (typeof(btnSearch) == "object") {
		var but1 = $id("btnSearch");
		but1.className = "buttonquery";
		NavJs.addEvent(but1,"onmouseout", function() { $id("btnSearch").className = 'buttonquery'; });
		NavJs.addEvent(but1,"onmouseover", function() { $id("btnSearch").className = 'buttonquery'; });
	}  
	if (typeof(btnFirst) == "object") {
		var but2 = $id("btnFirst");
		but2.className = "buttonfirstpage";
		NavJs.addEvent(but2,"onmouseout", function() { $id("btnFirst").className = 'buttonfirstpage'; });
		NavJs.addEvent(but2,"onmouseover", function() { $id("btnFirst").className = 'buttonfirstpage-over'; });

	}    
	if (typeof(btnPrev) == "object") {
		var but3 = $id("btnPrev");
		but3.className = "buttonuppage";
		NavJs.addEvent(but3,"onmouseout", function() { $id("btnPrev").className = 'buttonuppage'; });
		NavJs.addEvent(but3,"onmouseover", function() { $id("btnPrev").className = 'buttonuppage-over'; });		
	}    
	if (typeof(btnNext) == "object") {
		var but4 = $id("btnNext");
		but4.className = "buttondownpage";

		NavJs.addEvent(but4,"onmouseout", function() { $id("btnNext").className = 'buttondownpage'; });
		NavJs.addEvent(but4,"onmouseover", function() { $id("btnNext").className = 'buttondownpage-over'; });			
	}    
	if (typeof(btnLast) == "object") {
		var but5 = $id("btnLast");
		but5.className = "buttonlastpage";

		NavJs.addEvent(but5,"onmouseout", function() {$id("btnLast").className = 'buttonlastpage'; });
		NavJs.addEvent(but5,"onmouseover", function() {$id("btnLast").className = 'buttonlastpage-over'; });			
	}    

}

// *************************************************************
// ���������� ��������������ť��Ӧ�Ĺ��ܺ��� ���� 2011-08-19
// ���������� ��������ʵ��
// -------------------------------------------------------------

function wftools_suspended(){
	var wfId=parent.Request.QueryString('wfId').toString();
	if (IsSpace(wfId)){
		alert("��û�г�ʼ�����̵õ�ʵ�������ܹ���");
		return;
	}
	if (!window.confirm("ȷ��Ҫ��������ʵ����")) return;
	
	
		var sKey = "?operate=set_instances_status";
		sKey +="&wf_id=" + wfId;
		sKey +="&wf_state=2" ;// 2����
		
		var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");
		
		var oDom=SetDom(strReturn);
	
		var bResult=oDom.documentElement.childNodes[0].text;
		
		if (bResult=="false") {
			alert(oDom.documentElement.childNodes[1].text);
			//uf_search();
			return;	
		}
		if (bResult =="true"){
			alert("����ʵ�������ˣ�");	
		}

}
// *************************************************************
// ���������� ��������������ť��Ӧ�Ĺ��ܺ��� ��ֹ 2011-08-19
// ���������� ��ֹ����ʵ��
// -------------------------------------------------------------
function wftools_killed(){
	var wfId=parent.Request.QueryString('wfId').toString();
	if (IsSpace(wfId)){
		alert("��û�г�ʼ�����̵õ�ʵ����������ֹ��");
		return;
	}
	if (!window.confirm("ȷ��Ҫ��ֹ����ʵ����")) return;
	
	
		var sKey = "?operate=set_instances_status";
		sKey +="&wf_id=" + wfId;
		sKey +="&wf_state=3" ;// 2��ֹ
		
		var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");
		
		var oDom=SetDom(strReturn);
	
		var bResult=oDom.documentElement.childNodes[0].text;
		
		if (bResult=="false") {
			alert(oDom.documentElement.childNodes[1].text);
			//uf_search();
			return;	
		}
		if (bResult =="true"){
			alert("����ʵ����ֹ�����ˣ�");	
		}
}

function getXmlNodeValue(node){
	var nodeValue="";
	if (GetBrowserKey()=="msie")
		nodeValue = node.text;
	else
		nodeValue = node.textContent;
	return nodeValue;
}
//���е� ��������ʵ��
function initWorkflow(wfName,wfVersion,wfDesc){
	var keyScene = GetSceneKey();
	var sKey = "?operate=init_workflow&wf_name=" + wfName +"&wf_version=" + wfVersion;
	sKey +="&key_scene=" + keyScene;

	var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey);
	strReturn = RepStr(strReturn, "&", "&amp;");
	
	var oDom=SetDom(strReturn);
	
	var wfid;
	var surl="";
	var bResult=getXmlNodeValue(oDom.documentElement.childNodes[0]);
	
	if (bResult=="false") {
		alert(getXmlNodeValue(oDom.documentElement.childNodes[1]));
		return;	
	}
	//����	<stage>init,step</stage>���жϵ����Ǹ�ҳ��
	//=init �ж����ʼ��action���б����û�ѡ���ִ�У�����δ��ʼ����û�õ�wfid(����ʵ��id)
	var stage = getXmlNodeValue(oDom.documentElement.childNodes[1]);
	if (stage =="init"){
		var sXml = "<root>";
		sXml +="<wfname>" + wfName +"</wfname>";
		sXml +="<wfdesc>" + escape(wfDesc) +"</wfdesc>"
		sXml +="<wfversion>" + wfVersion +"</wfversion>";
	
		var oActionList = oDom.getElementsByTagName("action");
		var name,id;
		for (var i=0;i<oActionList.length;i++){
			name = escape(oActionList[i].getAttribute("name"));
			id = oActionList[i].getAttribute("id");
			
			sXml +="<action name ='" + name + "' id='" + id +"'/>";
		}
		sXml+="</root>";
		
		var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
		surl +="&domxml=" + sXml;
		
		surl +="&wfName=" + wfName;
		surl +="&wfDesc=" + escape(wfDesc);
		surl +="&wfVersion=" + wfVersion;
		
		window.open(surl,"_self");
		return;
	}
	//=step ֻ��һ����ʼ����action,��̨�Ѿ�ִ���˴�action���������Ѿ���ʼ���ˣ��õ���wfid(����ʵ��id)
	if (stage=="step"){
		var num = getXmlNodeValue(oDom.documentElement.childNodes[2]); //����ĵ�ǰ��ִ�е� action����
		var wfId = getXmlNodeValue(oDom.documentElement.childNodes[3]);//����ʵ��id
		//var fieldkey = oDom.childNodes(0).childNodes(5).text;//ҵ��id�ֶ�
		//var fieldkeyvalue = oDom.childNodes(0).childNodes(6).text;//ҵ��id�ֶζ�Ӧ�ļ�¼ֵ
	
		
		if (num==1){//ֱ�����ӵ�action��view��
			var action = oDom.getElementsByTagName("action");
			var actionId = action[0].getAttribute("id");
			var actionName = action[0].getAttribute("name");
			var view = action[0].getAttribute("view");
			var traceId = action[0].getAttribute("traceId");//�ӵ�ǰ��������id 2011-9-17
			
			var fieldkey = action[0].getAttribute("field_key");
			var fieldkeyvalue = action[0].getAttribute("field_key_value");
			var dynamicId = action[0].getAttribute("dynamic_instance_id");
			
			if (view==""){//û��view,�����actionѡ��ҳ�����action���֣�ִ��doAction		
				//���ӳ������ж�2012-12-3
				if (unescape(keyScene)!="����"){
					alert("����������������һ������δ���� " + unescape(keyScene) + " ���������ı�\r\t��������������й����ñ�\r\t�ٴ�������������ʵ�������У���д����");
					return;
					
				}
				var sXml = "<root>";
				sXml +="<wfname>" + wfName +"</wfname>";
				sXml +="<wfdesc>" + escape(wfDesc) +"</wfdesc>"				
				sXml +="<wfversion>" + wfVersion +"</wfversion>";
				//sXml +="<fieldkey>" + fieldkey + "</fieldkey>";
				//sXml +="<fieldkeyvalue>" + fieldkeyvalue + "</fieldkeyvalue>";				
						
				sXml +="<action name ='" + escape(actionName) + "' id='" + actionId +"'";
				sXml +=" field_key='" + fieldkey + "' ";
				sXml +=" field_key_value='" + fieldkeyvalue + "' ";
				if (dynamicId!=null)
					sXml +=" dynamic_instance_id='" + dynamicId + "' ";
				sXml +=" traceId='" + traceId + "' ";//2011-9-17
					
				sXml +="/>";
				
				sXml+="</root>";
				
				var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
				surl +="&domxml=" + sXml;
				surl +="&wfId=" + wfId;
				surl +="&wfName=" + wfName;
				surl +="&wfDesc=" + escape(wfDesc);
				surl +="&wfVersion=" + wfVersion;				
				
				window.open(surl,"_self");
				return;				
			}
			else{//��view��ֱ�ӽ���view���ӵı�ҳ�棬���ύ��ʱ��ͬʱ������doAction
				
				var surl = unescape(view) ;
				surl = surl + "&wfName=" + wfName ;
				surl = surl + "&wfDesc=" + escape(wfDesc);
				surl = surl + "&wfVersion=" + wfVersion;
				surl = surl + "&wfId=" + wfId
				surl = surl + "&actionId=" + actionId;
				surl = surl + "&traceId=" + traceId;//2011-9-17
				surl = surl + "&"+fieldkey+"="+fieldkeyvalue;
				if (dynamicId!=null)
					surl = surl + "&dynamicInstanceId="+dynamicId; //��wf_tools.htmҳ����ȡ�˲��� Ψһһ��dynamicInstanceId�Ĳ�����û��
				
				window.open(location.protocol+'//'+location.host + fcpubdata.path + surl);	
				return;			
			}			
		}
		else{//���action���û�ѡ��һ��ִ��
			var sXml = "<root>";
			sXml +="<wfname>" + wfName +"</wfname>";
			sXml +="<wfdesc>" + escape(wfDesc) +"</wfdesc>"			
			sXml +="<wfversion>" + wfVersion +"</wfversion>";
			//sXml +="<fieldkey>" + fieldkey + "</fieldkey>";
			//sXml +="<fieldkeyvalue>" + fieldkeyvalue + "</fieldkeyvalue>";			
		
			var oActionList = oDom.getElementsByTagName("action");
			var name,id,view,traceId;
			for (var i=0;i<oActionList.length;i++){
				name = escape(oActionList[i].getAttribute("name"));
				id = oActionList[i].getAttribute("id");
				view = oActionList[i].getAttribute("view");
				traceId = oActionList[i].getAttribute("traceId");//2011-9-17
				var fieldkey =oActionList[i].getAttribute("field_key");
				var fieldkeyvalue = oActionList[i].getAttribute("field_key_value");
				var dynamicId = oActionList[i].getAttribute("dynamic_instance_id");
				
				sXml +="<action name ='" + name + "' id='" + id + "' view='" + view + "'";
				sXml +=" field_key='" + fieldkey + "' ";
				sXml +=" field_key_value='" + fieldkeyvalue + "' ";
				if (dynamicId!=null)
					sXml +=" dynamic_instance_id='" + dynamicId + "' ";
				sXml +=" traceId='" + traceId + "' ";//2011-9-17
				sXml +="/>";
			}
			sXml+="</root>";
			
			var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_action_list&djtype=WF";
			surl +="&wfId=" + wfId;
			
			surl +="&wfName=" + wfName;
			surl +="&wfDesc=" + escape(wfDesc);
			surl +="&wfVersion=" + wfVersion;			
			
			surl +="&domxml=" + sXml;
			
			window.open(surl,"_self");
			return;
		}
	}
	
}
