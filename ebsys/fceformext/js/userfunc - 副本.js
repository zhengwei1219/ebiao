//在数据库的表信息界面上选择函数时,可以供选择的内容的列表在下面配制.
//var arrUserFuncList = [
// 	["选择部门", "selectDept", "输出参数：<br/> 当前日期. "],
// 	["在数据库的表信息界面上选择函数示例", "getdate()", "输出参数：<br/> 当前日期. "]
//];
var fcUserFunc = {

    selectDept: function(id) {//在打开窗口的radiolist控件中选择数据
        ///id为dropdownlist控件的ID
        //alert($obj($id(id).getAttribute("dataset")).Field("sdeptid").Value);
        CommonSelect({
            istree: 1,
            ismultisel: 1,
            //islist: 1, //多选时为checkboxlist,否则是radiolist
            cols: 3, //列数
            obj: $obj(id), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            selectedvalue: $obj($id(id).getAttribute("dataset")).Field("sdeptid").Value,
            idfieldname: "sdeptid",
            textfieldname: "sdeptname", //可选项, 前一窗口的text字段名,用于按字段同名传递数据.只在isgrid!=1时才有效
            //hidefields:"sdeptid",
            sql: "select sdeptcode,sdeptname,sdeptid from FCS_DEPT where sdeptname !='' order by sdeptcode " //必选项, 弹出窗口的显示数据用的SQL语句.

        })
    },
    selectRole: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "roleId";
        if (IsSpace(fieldName)) fieldName = "roleName";
        CommonSelect({
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "选择角色",
            sql: "select roleid,parentid,rolename,roleid from FCQ_ROLE where deleteMark <> 1 order by sortNo  " //必选项, 弹出窗口的显示数据用的SQL语句.
        })
    },

    selectOrg: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "选择组织结构",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 order by sortNo  "
        })
    },
    selectOrgUp: function(controlId, fieldId, fieldName) {
        //不要职员节点的组织。
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "选择组织结构",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectOrgUsers: function(controlId, fieldId, fieldName) {
        //通过组织来选择多选用户。
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            ismultisel: 1,
            selectedvalue: $id(controlId).value,
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            treeNodeType: "ef_tree_psm", //指定只返回用户。
            title: "选择用户",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectOrgUserEb: function(controlId,callback) {
        //通过组织来选择单个用户。在E表中用，即不能绑定到数据集来传值
        //if (IsSpace(fieldId)) fieldId = "sID";
        //if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            callback: callback,    
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            //ismultisel: 1,
            //selectedvalue: $id(controlId).value,
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            //idfieldname: fieldId,
            width: "350",
            height: "600",
            //textfieldname: fieldName,
            istreenewsql: 1,
            treeNodeType: "ef_tree_usr", //指定只返回用户。
            title: "选择用户",
            sql: "select  sID,sParent,sName,sPersonId,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },

    selectOrgAll: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "sFID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "选择组织结构",
            sql: "select  sID,sParent,sName,sFID,sOrgKindID from fcq_org  where deleteMark <> 1  and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectProfile: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "profileId";
        if (IsSpace(fieldName)) fieldName = "profileName";
        CommonSelect({
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "选择角色",
            sql: "select profileId,profilename from fcq_profile where deleteMark <> 1 and profileId <> 'systemadmin' order by sortNo "
        })
    },
    selectProfiles: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "profileId";
        if (IsSpace(fieldName)) fieldName = "profileName";
        var ret = CommonSelect({
            obj: controlId, //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            textfieldname: fieldName,
            isgrid: 1, //1是打开窗口中在grid控件中显示数据,0是无,
            ismultisel: 1,
            gridcoltitle: ["角色名称"],
            hidefields: fieldId,
            title: "选择角色",
            sql: "select profileId as "+ fieldId +  ",profilename from fcq_profile where deleteMark <> 1 and profileId <> 'systemadmin' order by sortNo "
        })
        return ret;
    },
    selectUser: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "userId";
        if (IsSpace(fieldName)) fieldName = "userName";
        CommonSelect({
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "选择用户",
            sql: "select userId,username from fcq_user where deleteMark <> 1 order by sortNo"
        })
    },
    selectUsers: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "userId";
        if (IsSpace(fieldName)) fieldName = "userName";
        var ret = CommonSelect({
            obj: controlId, //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            isgrid: 1,
            textfieldname: fieldName,
            ismultisel: 1,
            hidefields: fieldId,
            gridcolwidth: [250], 
            gridcoltitle: ["用户名称"],
            title: "选择用户",
            sql: "select userId as " + fieldId + ",username from fcq_user where deleteMark <> 1 order by sortNo"
        })
        return ret;
    },
    selectEmployee: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "employeeid";
        if (IsSpace(fieldName)) fieldName = "employeename";
        CommonSelect({
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "选择职员",
            sql: "select employeeid,employeename from FCQ_EMPLOYEE where deleteMark <> 1 and typeName='民族' order by sortNo"
        })
    },
    selectManageType: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "id";
        if (IsSpace(fieldName)) fieldName = "manageType";
        CommonSelect({
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "选择业务管理类型",
            sql: "select id,manageType from FCQ_manageType where deleteMark <> 1  "
        })
    },
    selectNation: function(controlId, field) {
        if (IsSpace(field)) field = "nation";
        CommonSelect({
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            //idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: field,
            cols: 2,
            islist: 1,
            title: "选择民族",
            sql: "select name as "+ field +" from fc_datadict where deleteMark <> 1 and fcSysMark=0 and typename='民族' order by sortNo"
        })
    }
    

}



function selectDept(id) {//在打开窗口的radiolist控件中选择数据
    ///id为dropdownlist控件的ID
    //alert($obj($id(id).getAttribute("dataset")).Field("sdeptid").Value);
    CommonSelect({
        istree: 1,
        ismultisel:1,
        //islist: 1, //多选时为checkboxlist,否则是radiolist
        cols: 3, //列数
        obj: $obj(id), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
        selectedvalue:$obj($id(id).getAttribute("dataset")).Field("sdeptid").Value,
        idfieldname:"sdeptid",
        textfieldname: "sdeptname", //可选项, 前一窗口的text字段名,用于按字段同名传递数据.只在isgrid!=1时才有效
        //hidefields:"sdeptid",
        sql: "select sdeptcode,sdeptname,sdeptid from FCS_DEPT where sdeptname !='' order by sdeptcode " //必选项, 弹出窗口的显示数据用的SQL语句.

    })
}

//与fcuser.xml文件中内容对应用于eform表单中的对用户角色群组的选择
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
	// 已经获得过了，就不再请求获得了
	// if (!IsSpace(fcuser.userTable)) return;

	// 获得sql中用户表名，用户id等字段的值
	var sKey = "?operate=get_user_configuration";

	var strReturn = new Eapi.RunAjax().sendHttp(location.protocol + '//' + location.host + fcpubdata.servletPath + '/DesignerServlet' + fcpubdata.dotnetVersion + sKey, "");
	if (IsSpace(strReturn)) return; //fhj 2013-03-20如果没有信息就返回避免发生空警告alert()
	var oDom = SetDom(strReturn);
	if (oDom.documentElement == null) {//fhj 2013-03-20对象为空就返回
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
		if (IsSpace(datatype) || datatype=="string") // 增加数据类型
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
// 设置fcuser.xml中设置的表字段查询条件，按sMark的值来拼sql
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
// 设置页面的输入的条件
function setLikeCondition(sField,sValue){
	var str = "";
	if (!IsSpace(sValue))
		str = " and " +  sField + " like '%" + sValue + "%' ";
	
	return str;	
}
// 设置页面的输入的条件，为数字的情况 2011-5-18
function setIntCondition(sField,sValue){
	var str = "";
	if (!IsSpace(sValue))
		str = " and " +  sField + " =" + sValue ;
	
	return str;	
}

// 实例链接 执行动作 （任务列表，实例列表中的 执行动作）
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
		
		var stage = oDom.documentElement.childNodes[1].text; // ="step" 到达了步骤了
		var num = oDom.documentElement.childNodes[2].text; // 步骤的当前可执行的
															// action数量
		var wfId = oDom.documentElement.childNodes[3].text;// 流程实例id
		// var fieldkey = oDom.childNodes(0).childNodes(5).text;//业务id字段
		// var fieldkeyvalue =
		// oDom.childNodes(0).childNodes(6).text;//业务id字段对应的记录值
	
		if (num==1){// 直接链接到action的view中
			var action = oDom.getElementsByTagName("action");
			var actionId = action[0].getAttribute("id");
			var actionName = action[0].getAttribute("name");
			var view = action[0].getAttribute("view");
			var traceId = action[0].getAttribute("traceId");// 加当前步骤主键id
																	// 2011-9-17
			var dynamicId = action[0].getAttribute("dynamic_instance_id");
			var fieldkey = action[0].getAttribute("bs_id_field");
			if (fieldkey==null) fieldkey="";
			var fieldkeyvalue = action[0].getAttribute("id_field_value");
			if (fieldkeyvalue==null) fieldkeyvalue="";
			
			if (view==""){// 没有view,则出现action选择页，点击action名字，执行doAction
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
			else{// 有view的直接进入view链接的表单页面，表单提交的时候，同时做流程doAction
				var surl = unescape(view) ;
				surl = surl + "&wfName=" + wfName ;
				surl = surl + "&wfDesc=" + escape(wfDesc);
				surl = surl + "&wfVersion=" + wfVersion ;
				surl = surl + "&wfId=" + wfId
				surl = surl + "&actionId=" + actionId;
				surl = surl + "&traceId=" + traceId;// 2011-9-17
				surl = surl + "&"+fieldkey+"="+fieldkeyvalue;
				if (dynamicId!=null)
					surl = surl + "&dynamicInstanceId="+dynamicId; // 在wf_tools.htm页面会获取此参数
				
				// window.open(location.protocol+'//'+location.host +
				// fcpubdata.path + surl,"_self");
				window.open(location.protocol+'//'+location.host + fcpubdata.path + surl);
				return;			
			}			
		}
		else{// 多个action，用户选择一个执行
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
// 增加提交类型 2011-12-5
function show_next_step(oDom){
	var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=show_next_step&djtype=WF";
	surl +="&domxml=" + escape(oDom.documentElement.xml);
	parent.window.open(surl,"_self");	
	return;					
}

// 流程用的函数 执行一个动作之后 (自定义工具条和工作流工具条)
function after_doAction(oDom){
	// 从wf_action_list.dj页面上链接进来wfName是全局变量，已经有值了。
	// 从业务表单中的url上得到参数
	var wfName = parent.Request.QueryString('wfName').toString();
	var wfDesc = unescape(parent.Request.QueryString('wfDesc').toString());

	var wfVersion = parent.Request.QueryString('wfVersion').toString();
	
	// var actionId=parent.Request.QueryString('actionId').toString();

	// var dynamicInstanceId =
	// parent.Request.QueryString('dynamicInstanceId').toString();


	// 执行成功后
	var stage = oDom.documentElement.childNodes[1].text;// stage肯定＝"step"

	var num = oDom.documentElement.childNodes[2].text; // 步骤的当前可执行的 action数量
	wfId = oDom.documentElement.childNodes[3].text;// 流程实例id
	// var bsTable = oDom.childNodes(0).childNodes(4).text;//业务表名称
	// var fieldkey = oDom.childNodes(0).childNodes(5).text;//业务id字段
	// var fieldkeyvalue = oDom.childNodes(0).childNodes(6).text;//业务id字段对应的记录值
	// 初始化流程后可能还未得到 业务id字段值，再次获得值（去掉，业务表信息－－修改到action节点中）
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
	if (num=="0"){// 下一步无可执行的action
		// parent.window.close();框架页中关闭不了此页面。
		// alert("动作执行完成！");
		// 如果从wf_action_list中链接来，则刷新此页。从wf_tools中来，则parent.window.close()会关闭当前打开的表单页。
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
	else if (num=="1"){// 直接链接到action的view中
		var action = oDom.getElementsByTagName("action");// 只有一个action节点的情况
		var actionId = action[0].getAttribute("id");
		var actionName = action[0].getAttribute("name");
		var view = action[0].getAttribute("view");
		var traceId = action[0].getAttribute("traceId");// 当前步骤主键id
																// 2011-9-17
		var dynamicId = action[0].getAttribute("dynamic_instance_id");

		var fieldkey = action[0].getAttribute("bs_id_field");
		if (fieldkey==null) fieldkey="";
		var fieldkeyvalue = action[0].getAttribute("id_field_value");
		if (fieldkeyvalue==null) fieldkeyvalue="";
		
		if (view==""){// 没有view,则出现action选择页，点击action名字，执行doAction
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
		else{// 有view的直接进入view链接的表单页面，表单提交的时候，同时做流程doAction
			var surl = unescape(view) ;
			surl = surl + "&wfName=" + wfName ;
			surl = surl + "&wfDesc=" + escape(wfDesc) ;
			surl = surl + "&wfVersion=" + wfVersion ;
			surl = surl + "&wfId=" + wfId
			surl = surl + "&actionId=" + actionId;
			surl = surl + "&traceId=" + traceId;// 2011-9-17
			surl = surl + "&"+fieldkey+"="+fieldkeyvalue;
			if (dynamicId!=null)
				surl = surl + "&dynamicInstanceId="+dynamicId; // 在wf_tools.htm页面会获取此参数
			
			parent.window.close();
			window.open(location.protocol+'//'+location.host + fcpubdata.path + surl);	
			return;			
		}			
	}
	else{// 多个action，用户选择一个执行
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
// 2004-03-03 用户自定义的全局函数,用于放一些在某个模块中(比如CRM JXC)常用的全局函数.
function getuser() {
	return "fc";
}
function getusername() {
	return "fc";
}

/**
 * 控制打开eform设计的表单的权限 在此函数中用parent.Request.QueryString("djsn").toString()
 * 形式接收?后的参数.
 * 
 * @return 空 表示无权打开.
 * @date 2006-02-11
 */
function EformEnterStatus() {
/*
 * var djtype = parent.Request.QueryString("djtype").toString(); //表单分类号 var
 * djsn = parent.Request.QueryString("djsn").toString(); //表单djsn
 * 
 * if(djsn == "application_sub"){ var name =
 * GetSession('username=')['username']; if(name == "liuxm"){ return ""; }
 *  }
 */
	return "OK";
}
/**
 * 从表的另一种保存模式时的从键字段的生成函数
 * 
 * @param iRowNo
 *            行号，从0开始的,整型
 * @param sSubKeyFieldName
 *            从键的字段名
 */
function IGetSubTableKeyValue(iRowNo,sSubKeyFieldName) {
	return iRowNo + 1 ;
}
/**
 * 控制能不能运行某个报表
 * 
 * @date 2007-04-18
 */
function EbiaoEnterStatus(callback) {
	/**
	 * 参照下面的示例代码来对运行报表进行权限控制,即先从session变量中取出权限信息,然后再判断.
	 * GetSession("username",function (arrRet){ var sessionValue =
	 * arrRet["username"]; alert(parent.Request.QueryString("name").toString());
	 * //报表名称 alert(parent.Request.QueryString("file").toString()); //报表文件
	 * if(sessionValue == "liuxm" &&
	 * parent.Request.QueryString("name").toString()=="销售汇总报表" ){
	 * alert("你无权运行此报表!"); callback(false); //通知关闭窗口 return; } callback(true); })
	 */
	// fcpub.toolbar =
	// "preview,print,printdirect,printall,|,query,pageset,refresh,|,expexcel,expexcelall,directexppdf";e_directrun
	
// if(parent.Request.QueryString("e_runsavefile").toString() != "undefined" ||
// (parent.Request.QueryString("e_directrun").toString() != "undefined" &&
// parent.Request.QueryString("e_directrun").toString() != "yes") ){
// fcpub.tempFilePath = GetUrlFirstPart() + "/ebsys/ebtmpfile1/";
// }
	callback(true); // 执行此命令表示能正常运行报表.
}
/**
 * 从工具栏上点保存按钮时执行此函数,它用保存当前报表运行结果时
 * 
 * @date 2007-09-03
 */
function EbiaoSaveEvent() {
	// 此处做弹出一个输入窗口工作,按确定关闭窗口后,将要保存的文件名传给下面的saveFileName变量,要保存的路径传给fcpub.tempFilePath变量,
	
	var saveFileName = "curSave";// 要保存的主文件名
	RunReport(1,"保存",saveFileName,function (result){
		var TotalPages = result.pages ; // 总页数
		var sRetValue = result.value ; // 本次报表运行的参数与宏的xml字符串.
		var sReportFile = parent.sPubPath; // 本次运行的报表文件.
	});

}

/**
 * 打开表单元素权限设置窗口 added by liuxr at 2008-3-14 此函数在属性窗口的权限设置按钮的点击事件上调用
 */
function EformActionButtonClick()
{
    var arr = fcpubdata.obj[0];
    var isMulti = (arr.constructor == window.Array || arr.length > 1 ) && IsSpace(arr.controltype); // 2011-06-29
																									// 以免
																									// combobox时判断不对.
    if (isMulti) {
        for (var i = 0; i < arr.length; i++) {
            if (IsSpace(arr[i]) == false && arr[i].controltype == "dataset") {
                alert("选中包含数据集控件在内的多个控件时,不能进入权限设置!");
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
            if (dssub1.oDom.documentElement.childNodes(i).getAttribute("multisel") == '是') {
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
		        // 删除原来的
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
 * 页面运行时表单元素的权限检查 added by liuxr at 2008-3-14 此函数在表单打开事件中调用,也可以在自己需要时调用
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
	// 打开流程挂接的表单
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
 * 正康在线的装入模块 2011-02-15 sTitle 标题 sUrl url串
 */
function zkLoadMod(sTitle, sUrl) {
    // 以后可以在此加上统一性的控制,如控制当前的界面是哪个等等
    var urlAll = "../../zk/common/zkDjFrame.htm?url=" + escape(sUrl) + "&caption=" + escape(sTitle);
    window.open(urlAll, "rightWin");
}



// *************************************************************
// 功能描述： 工作流工具条按钮对应的功能函数 暂存 2011-06-02
// 参数描述： 只保存 业务记录，不执行流程的action
// -------------------------------------------------------------
function wftools_tempSave(){
	var wfId=parent.Request.QueryString('wfId').toString();
	if (IsSpace(wfId)){
		alert("流程实例还未启动，不能做业务数据的暂存！");
		return;
	}
	if (!window.confirm("确定只暂时提交表单数据吗？")) return;
	
	
	var wfName = parent.Request.QueryString('wfName').toString();
	var wfDesc = unescape(parent.Request.QueryString('wfDesc').toString());
	var wfVersion = parent.Request.QueryString('wfVersion').toString();	
	var actionId=parent.Request.QueryString('actionId').toString();
	var dynamicInstanceId = parent.Request.QueryString('dynamicInstanceId').toString();	
	
	// var oWin = parent.topic; //在同一个页面中
	
	try{// 增加兼容性2012-1-17
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

	try{// 增加兼容性2012-1-17
	if(oDsMain.Update()==1) { // eform
		alert("保存数据出错！");
		return;
	}
	}catch(e){}
	
	if (parent.Request.QueryString('show').toString()=="true"){
		alert("执行过的动作，不能做暂存操作！");
		return;	
	}
	if (parent.Request.QueryString('show').toString()=="copy"){
		alert("抄送的任务信息，只能查看，不能做暂存操作！");
		return;	
	}
	
	var haveSaveFun=true;	
	try { 		
		// parent.topic.uf_wf_save(); //执行业务页面的保存
		uf_wf_save(); // 执行业务页面的保存
		alert("保存记录成功！");
		// parent.window.close();
		
	}catch(e){ 
		haveSaveFun = false; 
	}
	if (!haveSaveFun){
		// 暂存记录，检查当前步骤 是否有此，可执行的动作，避免执行打开历史步骤的动作，修改业务数据
		var sKey = "wf_id=" + wfId +";action_id=" + actionId;	
		if(typeof(dynamicInstanceId) != "undefined" && dynamicInstanceId != null && dynamicInstanceId!="undefined" && dynamicInstanceId!="null") 
			sKey += ";dynamic_instance_id=" + dynamicInstanceId;
		fcpubdata.submitUserType = "before_temp_check";
		fcpubdata.submitPubParam = sKey;
		
		var sErr =doSubmitData(function(retDom){
			// var oDom = SetDom(retDom.childNodes(0).xml);
			alert("暂存数据成功!");
			parent.window.close();
			// after_doAction(oDom);
		}); 
		if(IsSpace(sErr)==false) alert(sErr);
	}
	else{
		
	}
}
// *************************************************************
// 功能描述： 工作流工具条按钮对应的功能函数 执行 2011-07-21
// 参数描述： 只执行流程的动作，不保存业务记录 typeof(type)="undefined" 只提交流程后，并列出有执行权限的下一步动作。
// type=1 "只执行流程的动作后转下一步": wftools_flowSave(1); break;
// type=2 "只执行流程的动作后关闭窗口": wftools_flowSave(2); break;
// type=3 "只执行流程的动作后无操作": wftools_flowSave(3); break;
// -------------------------------------------------------------
function wftools_flowSave(type){
	// if (!window.confirm("确定只执行流程的动作吗？")) return;
	var wfId=parent.Request.QueryString('wfId').toString();
	if (IsSpace(wfId)){
		alert("流程实例还未启动，不能执行流程的动作！");
		return;
	}
	// 从url中获得参数
	var wfName = parent.Request.QueryString('wfName').toString();
	var wfDesc = unescape(parent.Request.QueryString('wfDesc').toString());

	var wfVersion = parent.Request.QueryString('wfVersion').toString();
	var actionId=parent.Request.QueryString('actionId').toString();

	var dynamicInstanceId = parent.Request.QueryString('dynamicInstanceId').toString();
	

	var sKey = "?operate=do_action&wf_name=" + wfName + "&wf_version=" + wfVersion +"&wf_id=" + wfId +"&action_id=" + actionId;	// 执行一个初始化的动作
	sKey +="&save_type="+type;// 增加提交类型控制提交完成后的显示 2011-12-5
	
	if (dynamicInstanceId!=null && dynamicInstanceId!="null" && dynamicInstanceId!="undefined" && typeof(dynamicInstanceId)!="undefined" && dynamicInstanceId!="")
		sKey +="&dynamic_instance_id=" + dynamicInstanceId;

	
	// 准备自由流设置
	try{
	//var cbofree =parent.toolbar.$id("wf_free_select")
	var cbofree =$id("wf_free_select",$win("toolbar",parent));
	if (cbofree!=null){
		var freeStepid = cbofree.value;
		if (!IsSpace(freeStepid)){
			var freeshow = 	cbofree.options[cbofree.selectedIndex].text;
			var freetype = freeshow.substring(0,3);

			if (freetype=="回退到") 
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
		alert("执行动作发生错误：" + oDom.documentElement.childNodes[1].text);
		return;	
	}

	if (typeof(type)=="undefined"){
		alert("提交数据成功!");
		after_doAction(oDom);
	}
	else if (type==1){ // 提交业务和流程后转下一步 type="1"
		alert("提交数据成功!");
		show_next_step(oDom);
	}
	else if (type==2){ // 提交业务和流程后关闭窗口 type="2" 提交业务和流程后无 type="3"
		var stepList = oDom.getElementsByTagName("step");
		var name,caller;
		var message="";
		for (var i=0;i<stepList.length;i++){
			name = stepList[i].getAttribute("name");
			caller = stepList[i].getAttribute("caller");
			message = message +"\r   " +  name + "(执行人：" + caller +")";
		}
		if (message=="")
			alert("提交数据成功！\r流程运行结束！");
		else
			alert("提交数据成功！\r下一步：" + message );
		parent.window.close();
	}
	else{
		alert("提交数据成功!");
	}
	return;

	
}
// *************************************************************
// 功能描述： 工作流工具条按钮对应的功能函数 执行 2011-06-02
// 参数描述： 带流程的保存，保存业务记录，并执行流程的action
// 提交业务数据并执行流程 typeof(type)="undefined" 并列出有执行权限的下一步动作。
// 提交业务和流程后转下一步 type="1"
// 提交业务和流程后关闭窗口 type="2"
// 提交业务和流程后无 type="3"
// -------------------------------------------------------------
function wftools_save(type){	
	var wfId=parent.Request.QueryString('wfId').toString();
	// if (!window.confirm("确定提交表单数据并执行流程的动作吗？")) return;
	if (IsSpace(wfId))
		wftools_save_nowfid(type);
	else		
		wftools_save_wfid(type,wfId);
}
// 有wfid的保存，保存业务记录并执行流程动作，在url中带有wfName,wfVersion,escape(wfDesc),actionId,dynamicInstanceId
function wftools_save_wfid(type,wfId){

	var wfName = parent.Request.QueryString('wfName').toString();
	var wfDesc = unescape(parent.Request.QueryString('wfDesc').toString());

	var wfVersion = parent.Request.QueryString('wfVersion').toString();
	// var wfId=parent.Request.QueryString('wfId').toString();
	var actionId=parent.Request.QueryString('actionId').toString();

	var dynamicInstanceId = parent.Request.QueryString('dynamicInstanceId').toString();

	// var oWin = parent.topic;
	try{// 增加兼容性2012-1-17
		var oDsMain = document.getElementById(fcpubdata.dsMain);		
		if (oDsMain.isFieldName("WF_ID") == true){
			if (IsSpace(oDsMain.Field("WF_ID").Value))
				oDsMain.Field("WF_ID").Value = wfId;
		}	
	}catch(e){}			

	// 访问后端，执行doAction() 增加 提交当前表单并执行 actionId的 保存方法
	// 重做 保存函数 实现三个功能：保存当前的记录；将一些信息保存到ps变量里面；执行doAction方法；
	// 返回：下一步骤名，可执行的动作列表
	var sKey = "wf_id=" + wfId +";action_id=" + actionId;	
	sKey +=";save_type="+type;// 增加提交类型控制提交完成后的显示 2011-12-5
	if(typeof(dynamicInstanceId) != "undefined" && dynamicInstanceId != null && dynamicInstanceId!="undefined" && dynamicInstanceId!="null") 
		sKey += ";dynamic_instance_id=" + dynamicInstanceId;

	// 准备自由流设置
	try{
	
	//var cbofree =parent.toolbar.$id("wf_free_select")
	var cbofree =$id("wf_free_select",$win("toolbar",parent));
		
	if (cbofree!=null){
		var freeStepid = cbofree.value;
		if (!IsSpace(freeStepid)){
			var freeshow = 	cbofree.options[cbofree.selectedIndex].text;
			var freetype = freeshow.substring(0,3);

			if (freetype=="回退到") 
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
	
	try{// 增加兼容性2012-1-17
	if(oDsMain.Update()==1) { // eform
		alert("保存数据出错！");
		return;
	}
	}catch(e){}
	
	if (parent.Request.QueryString('show').toString()=="true"){
		alert("执行过的动作，不能再执行了！");
		return;	
	}
	if (parent.Request.QueryString('show').toString()=="copy"){
		alert("抄送的任务信息，只能查看，不能再执行了！");
		return;	
	}
	
	var haveSaveFun=true;	
	try { 		
		uf_wf_save(); // 执行业务页面的保存
		alert("保存记录成功！");
		// parent.window.close();
		
	}catch(e){ 
		haveSaveFun = false; 
	}
	if (!haveSaveFun){
		
		// oWin.$eform('提交数据成功后提示')
		fcpubdata.submitUserType = "workflow_do_action";
		fcpubdata.submitPubParam = sKey;
		var sErr =doSubmitData(function(retDom){
			var oDom = SetDom(retDom.childNodes[0].xml);
			
			if (typeof(type)=="undefined"){
				alert("提交数据成功!");
				after_doAction(oDom);
			}
			else if (type==1){ // 提交业务和流程后转下一步 type="1"
				alert("提交数据成功!");
				show_next_step(oDom);
			}
			else if (type==2){ // 提交业务和流程后关闭窗口 type="2" 提交业务和流程后无 type="3"
				var stepList = oDom.getElementsByTagName("step");
				var name,caller;
				var message="";
				for (var i=0;i<stepList.length;i++){
					name = stepList[i].getAttribute("name");
					caller = stepList[i].getAttribute("caller");
					message = message +"\r   " +  name + "(执行人：" + caller +")";
				}	
				if (message=="")
					alert("提交数据成功！\r流程运行结束！");
				else
					alert("提交数据成功！\r下一步：" + message );
				parent.window.close();
			}
			else{
				alert("提交数据成功!");
			}
		}); 
		if(IsSpace(sErr)==false) alert(sErr);
	}
	else{
		// parent.window.close();
		// 链接到下一步骤的可执行动作列表，或者（当只有一个action时候，直接打开view）
		// after_doAction(oDom);
	}
	
}
// 无wfid的保存，保存业务记录并执行初始化流程得到wfid,并执行流程的第一个步骤的指定动作(actionId)
// 在url中带有initActionId,wfName,wfVersion,escape(wfDesc),actionId,dynamicInstanceId
// 直接打开表单的形式，表单提交的时候启动流程
function wftools_save_nowfid(type){
	var wfName = parent.Request.QueryString('wfName').toString();
	var wfDesc = unescape(parent.Request.QueryString('wfDesc').toString());

	var wfVersion = parent.Request.QueryString('wfVersion').toString();
	
	var actionId=parent.Request.QueryString('actionId').toString();

	var dynamicInstanceId = parent.Request.QueryString('dynamicInstanceId').toString();	
	
	var initActionId = parent.Request.QueryString('initActionId').toString();// 初始化动作id
	// 第一个步骤执行的动作id
	// var actionId = parent.Request.QueryString('actionId').toString();
	
	
	var sKey = "wf_name=" + wfName ;
	sKey +=";wf_version=" + wfVersion ;
	sKey += ";init_actionid=" + initActionId;
	sKey += ";action_id=" + actionId	
	sKey +=";save_type="+type;// 增加提交类型控制提交完成后的显示 2011-12-5
	
	// var oWin = parent.topic;
	fcpubdata.submitUserType = "eform_inital_workflow";
	fcpubdata.submitPubParam = sKey;
	
	var sErr = doSubmitData(function(retDom){
		var oDom = SetDom(retDom.childNodes[0].xml);
		
		if (typeof(type)=="undefined"){
			alert("提交数据成功!");
			after_doAction(oDom);
		}
		else if (type==1){ // 提交业务和流程后转下一步 type="1"
			alert("提交数据成功!");
			show_next_step(oDom);
		}
		else if (type==2){ // 提交业务和流程后关闭窗口 type="2" 提交业务和流程后无 type="3"
			var stepList = oDom.getElementsByTagName("step");
			var name,caller;
			var message="";
			for (var i=0;i<stepList.length;i++){
				name = stepList[i].getAttribute("name");
				caller = stepList[i].getAttribute("caller");
				message = message +"\r   " +  name + "(执行人：" + caller +")";
			}	
			if (message=="")
				alert("提交数据成功！\r流程运行结束！");
			else
				alert("提交数据成功！\r下一步：" + message );
			parent.window.close();
		}
		else{
			alert("提交数据成功!");
		}
		
	}); 
	if(IsSpace(sErr)==false) alert(sErr);
			
	
}
// *************************************************************
// 功能描述： 工作流工具条按钮对应的功能函数 轨迹 2011-06-02
// 参数描述： 显示流程轨迹
// -------------------------------------------------------------
function wftools_trace(){
	var wfId=parent.Request.QueryString('wfId').toString();
	if (IsSpace(wfId)){
		alert("流程实例还未启动，不能查看轨迹！");
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
// 功能描述： 工作流工具条按钮对应的功能函数 回退 2011-06-02
// 参数描述： 只指定回退到那个节点。点击 执行 才能真正执行回退
// -------------------------------------------------------------
/*
 * function wftools_return(){ var wfId =
 * parent.Request.QueryString('wf_id').toString(); var
 * wfName=parent.Request.QueryString('wf_name').toString(); var
 * wfDesc=parent.Request.QueryString('wf_desc').toString(); var
 * wfVersion=parent.Request.QueryString('wf_version').toString(); if
 * (IsSpace(wfId)){ alert("流程实例还未启动，不能回退！"); return; }
 * 
 * var surl ="/fceform/common/djframe.htm?djsn=wf_tools_return&djtype=WF"; surl
 * +="&type=last";//标识回退 surl +="&wf_id=" + wfId; surl +="&wf_name=" + wfName;
 * surl +="&wf_desc=" + wfDesc; surl +="&wf_version=" + wfVersion;
 * 
 * var sFeatures =
 * "top=100,left=100,toolbar=no,width=420,height=200,directories=no,status=no,scrollbars=yes,resize=no,menubar=no";
 * window.open(location.protocol+'//'+location.host + fcpubdata.path +
 * surl,"",sFeatures); }
 */
// *************************************************************
// 功能描述： 工作流工具条按钮对应的功能函数 跳转 2011-06-02
// 参数描述： 只指定跳转到那个节点。点击 执行 才能真正执行跳转
// -------------------------------------------------------------
/*
 * function wftools_skip(){ var wfId =
 * parent.Request.QueryString('wf_id').toString(); var
 * wfName=parent.Request.QueryString('wf_name').toString(); var
 * wfDesc=parent.Request.QueryString('wf_desc').toString(); var
 * wfVersion=parent.Request.QueryString('wf_version').toString(); if
 * (IsSpace(wfId)){ alert("流程实例还未启动，不能跳转！"); return; }
 * 
 * var surl ="/fceform/common/djframe.htm?djsn=wf_tools_skip&djtype=WF"; surl
 * +="&type=next";//标识跳转 surl +="&wf_id=" + wfId; surl +="&wf_name=" + wfName;
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
	var sOption = "<option selected value=''>请选择自由流</option>";
	for (var i=0;i<oListNext.length;i++){
		var stepid = oListNext.item(i).getAttribute("id");
		var stepname ="跳转到：" + oListNext[i].getAttribute("name");

		sOption += "<option value='" + stepid +"'>" + stepname + "</option>";	
	}
	
	
	for (var i=0;i<oListLast.length;i++){
		var stepid = oListLast[i].getAttribute("id");
		var stepname ="回退到：" +  oListLast[i].getAttribute("name");

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
// 功能描述： 工作流工具条按钮对应的功能函数 挂起 2011-08-19
// 参数描述： 挂起流程实例
// -------------------------------------------------------------

function wftools_suspended(){
	var wfId=parent.Request.QueryString('wfId').toString();
	if (IsSpace(wfId)){
		alert("还没有初始化流程得到实例，不能挂起");
		return;
	}
	if (!window.confirm("确定要挂起流程实例吗？")) return;
	
	
		var sKey = "?operate=set_instances_status";
		sKey +="&wf_id=" + wfId;
		sKey +="&wf_state=2" ;// 2挂起
		
		var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");
		
		var oDom=SetDom(strReturn);
	
		var bResult=oDom.documentElement.childNodes[0].text;
		
		if (bResult=="false") {
			alert(oDom.documentElement.childNodes[1].text);
			//uf_search();
			return;	
		}
		if (bResult =="true"){
			alert("流程实例挂起了！");	
		}

}
// *************************************************************
// 功能描述： 工作流工具条按钮对应的功能函数 终止 2011-08-19
// 参数描述： 终止流程实例
// -------------------------------------------------------------
function wftools_killed(){
	var wfId=parent.Request.QueryString('wfId').toString();
	if (IsSpace(wfId)){
		alert("还没有初始化流程得到实例，不能终止！");
		return;
	}
	if (!window.confirm("确定要终止流程实例吗？")) return;
	
	
		var sKey = "?operate=set_instances_status";
		sKey +="&wf_id=" + wfId;
		sKey +="&wf_state=3" ;// 2终止
		
		var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");
		
		var oDom=SetDom(strReturn);
	
		var bResult=oDom.documentElement.childNodes[0].text;
		
		if (bResult=="false") {
			alert(oDom.documentElement.childNodes[1].text);
			//uf_search();
			return;	
		}
		if (bResult =="true"){
			alert("流程实例终止结束了！");	
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
//表单中的 启动流程实例
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
	//根据	<stage>init,step</stage>来判断调用那个页面
	//=init 有多个初始化action，列表让用户选择个执行，流程未初始化，没得到wfid(流程实例id)
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
	//=step 只有一个初始化的action,后台已经执行了此action，即流程已经初始化了，得到了wfid(流程实例id)
	if (stage=="step"){
		var num = getXmlNodeValue(oDom.documentElement.childNodes[2]); //步骤的当前可执行的 action数量
		var wfId = getXmlNodeValue(oDom.documentElement.childNodes[3]);//流程实例id
		//var fieldkey = oDom.childNodes(0).childNodes(5).text;//业务id字段
		//var fieldkeyvalue = oDom.childNodes(0).childNodes(6).text;//业务id字段对应的记录值
	
		
		if (num==1){//直接链接到action的view中
			var action = oDom.getElementsByTagName("action");
			var actionId = action[0].getAttribute("id");
			var actionName = action[0].getAttribute("name");
			var view = action[0].getAttribute("view");
			var traceId = action[0].getAttribute("traceId");//加当前步骤主键id 2011-9-17
			
			var fieldkey = action[0].getAttribute("field_key");
			var fieldkeyvalue = action[0].getAttribute("field_key_value");
			var dynamicId = action[0].getAttribute("dynamic_instance_id");
			
			if (view==""){//没有view,则出现action选择页，点击action名字，执行doAction		
				//增加场景的判断2012-12-3
				if (unescape(keyScene)!="电脑"){
					alert("流程已启动，但第一个步骤未设置 " + unescape(keyScene) + " 场景关联的表单\r\t请在流程设计器中关联好表单\r\t再从我启动的流程实例中运行，填写表单！");
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
			else{//有view的直接进入view链接的表单页面，表单提交的时候，同时做流程doAction
				
				var surl = unescape(view) ;
				surl = surl + "&wfName=" + wfName ;
				surl = surl + "&wfDesc=" + escape(wfDesc);
				surl = surl + "&wfVersion=" + wfVersion;
				surl = surl + "&wfId=" + wfId
				surl = surl + "&actionId=" + actionId;
				surl = surl + "&traceId=" + traceId;//2011-9-17
				surl = surl + "&"+fieldkey+"="+fieldkeyvalue;
				if (dynamicId!=null)
					surl = surl + "&dynamicInstanceId="+dynamicId; //在wf_tools.htm页面会获取此参数 唯一一个dynamicInstanceId的参数，没带
				
				window.open(location.protocol+'//'+location.host + fcpubdata.path + surl);	
				return;			
			}			
		}
		else{//多个action，用户选择一个执行
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
