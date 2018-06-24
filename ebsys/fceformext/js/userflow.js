
//*************************************************************
// 功能描述： 流程属性
// 参数描述： 无
//-------------------------------------------------------------
function FlowAttributes()
{
}

//*************************************************************
// 功能描述： 节点属性
// 参数描述： 无
//-------------------------------------------------------------
function NodePropertys()
{
}

//*************************************************************
// 功能描述： 条件属性
// 参数描述： 无
//-------------------------------------------------------------
function NodeCondition()
{
}

//*************************************************************
// 功能描述： 任务属性
// 参数描述： 无
//-------------------------------------------------------------
function TaskInfo()
{
}
//*************************************************************
// 功能描述： 条件&前置后置函数的参数设置属性
// 参数描述： 无
//-------------------------------------------------------------
function ParameterInfo()
{
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//流程设计器中  属性页 的公共 函数
/**
* div中的显示用户，角色，组等信息
*/
function showDivInfo(divId,keyids,keynames,isCopy){
	var ids = keyids.split(",");
	var idnames = keynames.split(",");
	var items="";
	for (var i=0;i<ids.length;i++){
		items +="&nbsp;&nbsp;&nbsp;";
		if (typeof isCopy!="undefined" && isCopy=="true")
			items +="<span is_copy='true' id_value='" + ids[i] +"' id_name='" + idnames[i] + "'>";
		else
			items +="<span id_value='" + ids[i] +"' id_name='" + idnames[i] + "'>";
		items +="<input type='checkbox' checked onclick='removeItems(this)'>&nbsp;&nbsp;";		
		if (typeof isCopy!="undefined" && isCopy=="true")
			items += "抄送给：" + idnames[i];		
		else
			items += idnames[i];		
		items +="</span></br>"; //加上换行			
	
	}
	
	var obj = document.getElementById(divId);
	var inner = obj.innerHTML;
	obj.innerHTML = inner + items;
//	if (typeof isCopy!="undefined" && isCopy=="true")
//		obj.innerHTML = obj.innerHTML + items;
//	else	
//		obj.innerHTML = items;			
}
/**
 * 在div中显示变量类的用户，角色，群组
 * @param oClass
 * @return
 */
function showVarClassDivInfo(oDom){
	var oClass = oDom.getElementsByTagName("var-class");
	//要完成 拼接 userids 和 dsTask.Field("var_class").Value 的 值
	
	for (var k=0;k<oClass.length;k++){
		var clsroleid="",clsrolename="",clsgroupid="",clsgroupname="",clsuserid="",clsusername="";
		var clscopyRoleid="",clscopyRolename="",clscopyGroupid="",clscopyGroupname="",clscopyUserid="",clscopyUsername="";
		var classname="",classParam="";

		for (var l=0;l<oClass.item(k).childNodes.length;l++){
			var attrname = oClass.item(k).childNodes(l).getAttribute("name");
			if (attrname=="class") classname = oClass.item(k).childNodes(l).text; 
			if (attrname=="role") clsroleid = oClass.item(k).childNodes(l).text;
			if (attrname=="rolename") clsrolename = oClass.item(k).childNodes(l).text;
			if (attrname=="copy_role") clscopyRoleid = oClass.item(k).childNodes(l).text;
			if (attrname=="copy_rolename") clscopyRolename = oClass.item(k).childNodes(l).text;
			
			if (attrname=="group") clsgroupid = oClass.item(k).childNodes(l).text;
			if (attrname=="groupname") clsgroupname = oClass.item(k).childNodes(l).text;
			if (attrname=="copy_group") clscopyGroupid = oClass.item(k).childNodes(l).text;
			if (attrname=="copy_groupname") clscopyGroupname = oClass.item(k).childNodes(l).text;

			if (attrname=="user") clsuserid = oClass.item(k).childNodes(l).text;
			if (attrname =="username") clsusername = oClass.item(k).childNodes(l).text;
			if (attrname=="copy_user") clscopyUserid = oClass.item(k).childNodes(l).text;
			if (attrname =="copy_username") clscopyUsername = oClass.item(k).childNodes(l).text;
			
			if(attrname!="class" && attrname!="role"&& attrname!="rolename"&& attrname!="copy_role"&& attrname!="copy_rolename"
				&& attrname!="group"&& attrname!="groupname"&& attrname!="copy_group"&& attrname!="copy_groupname"
				&& attrname!="user"&& attrname!="username"&& attrname!="copy_user"&& attrname!="copy_username"){
				classParam +=oClass.item(k).childNodes(l).xml; //得到class_param值
			}		
		}
		//加入用户div 中
		var isCopy="false";
		var id="",idname="";	
		var divid="";
		if (clsuserid!=""){
			isCopy="false";//一个函数类，只能赋一个变量的值，这些id属性只有一个有值
			divid = "divTaskUser";
			id = clsuserid;
			idname = clsusername;
		}
		if (clscopyUserid!=""){
			isCopy="true";
			divid = "divTaskUser";
			id = clscopyUserid;
			idname = clscopyUsername;
		}		
		if (clsroleid!=""){
			isCopy="false";
			divid = "divTaskRole";
			id = clsroleid;
			idname = clsrolename;
		}
		if (clscopyRoleid!=""){
			isCopy="true";
			divid = "divTaskRole";
			id = clscopyRoleid;
			idname = clscopyRolename;
		}			
		if (clsgroupid!=""){
			isCopy="false";
			divid = "divTaskGroup";
			id = clsgroupid;
			idname = clsgroupname;
		}
		if (clscopyGroupid!=""){
			isCopy="true";
			divid = "divTaskGroup";
			id = clscopyGroupid;
			idname = clscopyGroupname;
		}		
		var items="&nbsp;&nbsp;&nbsp;";
		if (isCopy=="true")			
			items +="<span is_copy='true' id_value='" + id +"' id_name='" + idname + "'";
		else
			items +="<span id_value='" + id +"' id_name='" + idname + "'";
		items +=" class_name='" + classname +"' "
		items +=" class_param='" + escape(classParam) +"' "
		items +=">";
		items +="<input type='checkbox' checked onclick='removeItems(this)'>&nbsp;&nbsp;";
		if (isCopy=="true")
			items += "抄送给：" + idname;		
		else
			items += idname;			
		items +="</span></br>"; //加上换行			

		var obj = document.getElementById(divid);
		var inner = obj.innerHTML;
		if (IsSpace(inner))
			obj.innerHTML = items;
		else
			obj.innerHTML = inner + items;
	}	
}

function removeItems(which){
	
	//if(confirm("确认删除该选项？"))
	//{
		var objParent = which.parentNode.parentNode;
		which.parentNode.removeNode(true);		
		setChoiceValueToDataset(objParent);
		//alert("删除成功！");
		
	//}else{
	//	which.checked = true;
	//}
}

function uf_select(type,divId,isCopy){
	var surl = fcpubdata.path + "/fceform/common/djframe.htm?";
	var sFeatures = "top=100,left=300,toolbar=no,width=700,height=530,directories=no,status=no,scrollbars=yes,resize=no,menubar=no"
	if (type=="user"){
		surl += "djsn=wd_user_list&djtype=WF_DSN";
		
	}
	if (type=="role"){
		surl += "djsn=wd_role_list&djtype=WF_DSN";
		sFeatures = "top=100,left=300,toolbar=no,width=620,height=530,directories=no,status=no,scrollbars=yes,resize=no,menubar=no"	
	}
	if (type=="group"){
		surl += "djsn=wd_group_list&djtype=WF_DSN";
		sFeatures = "top=100,left=300,toolbar=no,width=620,height=530,directories=no,status=no,scrollbars=yes,resize=no,menubar=no"	
	}

	surl += "&div_id=" + divId;
	if (typeof isCopy!="undefined"){
		surl +="&is_copy=true";
	}
   
	
	window.open(surl,"",sFeatures);	
}
//后台类中任务节点下面增加了var-classes 任务的用户选择用wd_user_new_list.dj 2012-4-5
function uf_task_select(type,divId,isCopy){
	var surl = fcpubdata.path + "/fceform/common/djframe.htm?";
	var sFeatures = "top=100,left=300,toolbar=no,width=680,height=630,directories=no,status=no,scrollbars=yes,resize=no,menubar=no"
	if (type=="user"){
		surl += "djsn=wd_user_new_list&djtype=WF_DSN";
		
	}
	if (type=="role"){
		surl += "djsn=wd_role_new_list&djtype=WF_DSN";
		//sFeatures = "top=100,left=300,toolbar=no,width=620,height=630,directories=no,status=no,scrollbars=yes,resize=no,menubar=no"	
	}
	if (type=="group"){
		surl += "djsn=wd_group_new_list&djtype=WF_DSN";
		//sFeatures = "top=100,left=300,toolbar=no,width=620,height=630,directories=no,status=no,scrollbars=yes,resize=no,menubar=no"	
	}

	surl += "&div_id=" + divId;
	if (typeof isCopy!="undefined"){
		surl +="&is_copy=true";
	}

	window.open(surl,"",sFeatures);	
}
/**
 * 装入动作参数的下拉项
 * @param obj
 * @param xml
 * @return
 */
function loadActionCbo(obj,xml){
	if (obj.id=="cboTaskAction")
		obj.FieldNameList="action_id,action_name";
		
	obj.xml = xml;
}
/**
 * 装入步骤参数的下拉项
 * @param obj
 * @param xml
 * @return
 */
function loadStepCbo(obj,xml){
	if (obj.id=="cboCondStep")
		obj.FieldNameList="cond_step,cond_step_chn";
	if (obj.id=="cboPrefStep")	
		obj.FieldNameList="pref_step,pref_step_chn";
	if (obj.id=="cboPostStep")	
		obj.FieldNameList="post_step,post_step_chn";
		
	obj.xml = xml;
}
/**
 * 数据集上的删除，删除行
 * @param dataset
 * @return
 */
function uf_delete(dataset){
	dataset.Delete();
	if (dataset.id=="dsTask")
		uf_task_scroll();
	if (dataset.id=="dsCond")
		uf_cond_scroll();
	if (dataset.id=="dsPref")
		uf_pref_scroll();		
	if (dataset.id=="dsPost")
		uf_post_scroll();	
	if(dataset.RecordCount==0)
		dataset.Append();

}

function uf_delete_row(dataset){
	dataset.Delete();
	if(dataset.RecordCount==0)
		dataset.Append();	
}
/**
 * 新增条件，函数等
 * @param dataset
 * @return
 */
function uf_insert_row(dataset,key){
	if (dataset.RecordCount==0)
		dataset.Append();
	else{
		if (!IsSpace(key) && key=="trigger"){
			if (!IsSpace(dataset.Field(1).Value)) //trigger的第一个为triggerid，一定有值
				dataset.Append();
		}
		else if (!IsSpace(dataset.Field(0).Value))
			dataset.Append();		
	}
}
/**
 * 条件数据集的滚动事件
 * @return
 */
function uf_cond_scroll(){
	var userids = dsCond.Field("cond_user_id").Value;
	var usernames = dsCond.Field("cond_user").Value;
	var roleids = dsCond.Field("cond_role_id").Value;
	var rolenames = dsCond.Field("cond_role").Value;
	var groupids = dsCond.Field("cond_group_id").Value;
	var groupnames = dsCond.Field("cond_group").Value;		
	
	//2012-4-1
	divCondUser.innerHTML="";
	divCondRole.innerHTML="";
	divCondGroup.innerHTML="";
	
	if (userids.length>0) showDivInfo("divCondUser",userids,usernames); 
	if (roleids.length>0) showDivInfo("divCondRole",roleids,rolenames); 
	if (groupids.length>0) showDivInfo("divCondGroup",groupids,groupnames);
	
	$id("txtCondUndefine").value = unescape(dsCond.Field("cond_undefine").Value);
}
/**
 * 前置函数的滚动事件
 * @return
 */
function uf_pref_scroll(){
	var userids = dsPref.Field("pref_user_id").Value;
	var usernames = dsPref.Field("pref_user").Value;
	var roleids = dsPref.Field("pref_role_id").Value;
	var rolenames = dsPref.Field("pref_role").Value;
	var groupids = dsPref.Field("pref_group_id").Value;
	var groupnames = dsPref.Field("pref_group").Value;		
	
	//2012-4-1
	divPrefUser.innerHTML="";
	divPrefRole.innerHTML="";
	divPrefGroup.innerHTML="";
	if (userids.length>0) showDivInfo("divPrefUser",userids,usernames); 
	if (roleids.length>0) showDivInfo("divPrefRole",roleids,rolenames); 
	if (groupids.length>0) showDivInfo("divPrefGroup",groupids,groupnames); 
	
	$id("txtPrefUndefine").value = unescape(dsPref.Field("pref_undefine").Value);
}
/**
 * 后置函数的滚动事件
 * @return
 */
function uf_post_scroll(){
	var userids = dsPost.Field("post_user_id").Value;
	var usernames = dsPost.Field("post_user").Value;
	var roleids = dsPost.Field("post_role_id").Value;
	var rolenames = dsPost.Field("post_role").Value;
	var groupids = dsPost.Field("post_group_id").Value;
	var groupnames = dsPost.Field("post_group").Value;		
	//2012-4-1
	divPostUser.innerHTML="";
	divPostRole.innerHTML="";
	divPostGroup.innerHTML="";
	
	if (userids.length>0) showDivInfo("divPostUser",userids,usernames); 
	if (roleids.length>0) showDivInfo("divPostRole",roleids,rolenames); 
	if (groupids.length>0) showDivInfo("divPostGroup",groupids,groupnames); 
	
	$id("txtPostUndefine").value = unescape(dsPost.Field("post_undefine").Value);
}

function getArgNameKeyFromDivid(divid){
	var strkey = "";
	if (divid.indexOf("User")>0){
		strkey = "user";
	}
	if (divid.indexOf("Role")>0){
		strkey = "role";
	}
	if (divid.indexOf("Group")>0){
		strkey = "group";
	}
	return strkey;
}

function getVarClassesByKey(key,orig){	
	var oClass = SetDom("<root>" + unescape(orig) + "</root>");
	
	//按关键字先去掉原来的定义信息
	var oNodes = oClass.selectNodes("root/var-class/arg[@name = '"+ key +"']");
	for(var i=0;i<oNodes.length;i++)
	{
		var parentNode = oNodes(i).parentNode;
		oClass.documentElement.removeChild(parentNode);
	}
	//再去掉抄送的
	oNodes = oClass.selectNodes("root/var-class/arg[@name = 'copy_"+ key +"']");
	for(var i=0;i<oNodes.length;i++)
	{
		var parentNode = oNodes(i).parentNode;
		oClass.documentElement.removeChild(parentNode);
	}
	
	var stmp="";
	if (IsSpace(oClass.xml) == false)
		stmp = new Eapi.Str().removeRoot(oClass.documentElement.xml);
	else
		stmp = oClass.xml.substring(6,oClass.xml.length-7);
	
	return stmp;
}
/**
 *回刷用户，角色，群组 到数据集上面  ,在 选择用户，角色，群组等的页面确认后调用，用于刷新相应数据集中的值 
 */
function setChoiceValueToDataset(oDiv){
	var haveItem=oDiv.all.tags("SPAN");
	var haveLen = haveItem.length;	
	var ids = "",idnames="";
	var copyids ="",copyidnames="";
	var varclasses="";//变量类	
	var key = getArgNameKeyFromDivid(oDiv.id);

	if (oDiv.id.substring(3,7)=="Task")//仅 任务需要处理 2012-4-1
		varclasses = getVarClassesByKey(key,dsTask.Field("var_class").Value);
	
	for(var j=0; j< haveLen;j++)
	{
		var idValue = haveItem[j].getAttribute("id_value");
		var idName =  haveItem[j].getAttribute("id_name");
		var isCopy =  haveItem[j].getAttribute("is_copy");
		//当是 类变量的方式，赋值了var-class 2012-4-1
		var className =  haveItem[j].getAttribute("class_name");
		var classParam =  haveItem[j].getAttribute("class_param");
		
		if (!IsSpace(className) && oDiv.id.substring(0,7)=="divTask"){
			varclasses +="<var-class type='class'>";//先默认为class类
			varclasses +="<arg name='class'>" + className + "</arg>";
			
			if (typeof isCopy!="undefined" && isCopy=="true"){
				varclasses +="<arg name='copy_" + key + "'>" + idValue + "</arg>";
				varclasses +="<arg name='copy_" + key + "name'>" + idName + "</arg>";
			}
			else{
				varclasses +="<arg name='" + key + "'>" + idValue + "</arg>";
				varclasses +="<arg name='" + key + "name'>" + idName + "</arg>";
			}
			varclasses +=unescape(classParam);
			varclasses +="</var-class>";				
		}
		else{//end
			if (typeof isCopy!="undefined" && isCopy=="true"){
				copyids +=idValue + ",";
				copyidnames +=idName + ","; //名字里面不能有 抄送给
				
			}
			else{
				ids +=idValue + ",";
				idnames +=idName + ","; 
			}
		}
	}
	
	ids = ids.substring(0,ids.length-1);
	idnames = idnames.substring(0,idnames.length-1);
	copyids = copyids.substring(0,copyids.length-1);
	copyidnames = copyidnames.substring(0,copyidnames.length-1);
	if (oDiv.id=="divTaskUser"){
		dsTask.Field("task_user_id").Value = ids;
		dsTask.Field("task_user").Value = idnames;
		dsTask.Field("task_copy_user_id").Value = copyids;
		dsTask.Field("task_copy_user").Value = copyidnames;
		dsTask.Field("var_class").Value = escape(varclasses);
	}
	if (oDiv.id=="divTaskRole"){
		dsTask.Field("task_role_id").Value = ids;
		dsTask.Field("task_role").Value = idnames;
		dsTask.Field("task_copy_role_id").Value = copyids;
		dsTask.Field("task_copy_role").Value = copyidnames;
		dsTask.Field("var_class").Value = escape(varclasses);
	}	
	if (oDiv.id=="divTaskGroup"){
		dsTask.Field("task_group_id").Value = ids;
		dsTask.Field("task_group").Value = idnames;
		dsTask.Field("task_copy_group_id").Value = copyids;
		dsTask.Field("task_copy_group").Value = copyidnames;
		dsTask.Field("var_class").Value = escape(varclasses);
	}
	
	if (oDiv.id=="divCondUser"){
		dsCond.Field("cond_user_id").Value = ids;
		dsCond.Field("cond_user").Value = idnames;
	}
	if (oDiv.id=="divCondRole"){
		dsCond.Field("cond_role_id").Value = ids;
		dsCond.Field("cond_role").Value = idnames;
	}
	if (oDiv.id=="divCondGroup"){
		dsCond.Field("cond_group_id").Value = ids;
		dsCond.Field("cond_group").Value = idnames;
	}	
	
	if (oDiv.id=="divPrefUser"){
		dsPref.Field("pref_user_id").Value = ids;
		dsPref.Field("pref_user").Value = idnames;
	}
	if (oDiv.id=="divPrefRole"){
		dsPref.Field("pref_role_id").Value = ids;
		dsPref.Field("pref_role").Value = idnames;
	}
	if (oDiv.id=="divPrefGroup"){
		dsPref.Field("pref_group_id").Value = ids;
		dsPref.Field("pref_group").Value = idnames;
	}	
	
	if (oDiv.id=="divPostUser"){
		dsPost.Field("post_user_id").Value = ids;
		dsPost.Field("post_user").Value = idnames;
	}
	if (oDiv.id=="divPostRole"){
		dsPost.Field("post_role_id").Value = ids;
		dsPost.Field("post_role").Value = idnames;
	}
	if (oDiv.id=="divPostGroup"){
		dsPost.Field("post_group_id").Value = ids;
		dsPost.Field("post_group").Value = idnames;
	}		
	var skey = oDiv.id.substring(3,7);
	if (skey=="Task") dsTask.fset_cont();
	if (skey=="Cond") dsCond.fset_cont();
	if (skey=="Pref") dsPref.fset_cont();
	if (skey=="Post") dsPost.fset_cont();		
}
//自定义参数onchange()事件，修改对象的数据集值
//isResultCond = "isResultCond" 表示result页面的beanshell条件显示
function uf_undefine_onchange(dsname){	
	var userdefine = "";
	
	if (dsname=="dsCond"){
		userdefine = $id("txtCondUndefine").value;
		//if (isResultCond==null){
			if(!IsFlowUserDefineFormat(userdefine)){
				alert("请按照xml的格式(<arg name='xxx'>xxx</arg>)设置条件的自定义参数 \r\t" + userdefine );	
				return;
			} 
			dsCond.Field("cond_undefine").Value = escape(userdefine);			
		//}
		
		//if (isResultCond!=null && isResultCond=="isResultCond"){
		//	if (dsCond.Field("cond_class_name")=="beanshell"){ //自定义的beanshell条件类
		//		uf_setBeanshellCondToDataSet();
		//		return;			
		//	}
		//}

	}	
	if (dsname =="dsPref"){
		userdefine = $id("txtPrefUndefine").value;
		if(!IsFlowUserDefineFormat(userdefine)){
			alert("请按照xml的格式(<arg name='xxx'>xxx</arg>)设置前置函数的自定义参数 \r\t" + userdefine );	
			return;
		} 
		
		dsPref.Field("pref_undefine").Value = escape($id("txtPrefUndefine").value);
	}	
	if (dsname =="dsPost"){
		userdefine = $id("txtPostUndefine").value;
		if(!IsFlowUserDefineFormat(userdefine)){
			alert("请按照xml的格式(<arg name='xxx'>xxx</arg>)设置后置函数的自定义参数 \r\t" + userdefine );	
			return;
		} 
		dsPost.Field("post_undefine").Value = escape($id("txtPostUndefine").value);
	}	
}
//beanshell的脚本设置到数据集的行上面 2011-4-15
//function uf_setBeanshellCondToDataSet(){
//	var scripShowname = $id("txtCondUndefine").value;
//	//需要转换出code 从eform的表单中转
//	var userdefine = $id("txtCondUndefine").getAttribute("codeValue");
//	dsCond.Field("cond_undefine").Value = escape(userdefine);
//	dsCond.Field("cond_undefine_name").Value = escape(scripShowname);
//}
/**
 * 检查用户自定义参数，是否是 <arg name='xxx'>xxxxx</arg>的格式
 */
function IsFlowUserDefineFormat(userdefine){
	var bReturn = true;
	var otemp = SetDom("<root>" + userdefine +"</root>");
	if (otemp==null ||otemp.documentElement ==null) return false;
	//	alert("请按照xml的格式来设置条件的自定义参数 " + userdefine );	
	var len = otemp.documentElement.childNodes.length;
	for (var i=0;i<len;i++){		
		if (otemp.documentElement.childNodes(i).nodeName!="arg"){
			bReturn = false
			break;
		}
	}
	return bReturn;	
}

/*
 * 打开属性页时候，将属性串 赋值到dataset上面.
 * skey = Cond,Pref,Post
 * isResultCond = "isResultCond" 是result页面的条件 2011-4-15
 */
function LoadXmlToDataset(skey,oList){
	var strXml = "";
	for (var i=0;i<oList.length;i++){
		strXml +="<tr>";
		var userdefine="";
		var classname="",classchn="",userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="",status="",statuschn="",step="",stepchn="";
		//var scriptshowname="";
		//分析参数
		for (var j=0;j<oList.item(i).childNodes.length;j++){					
			var sname="";
			//忽略不按照<arg name='xxx'>xxxx</arg>的格式
			try{sname = oList.item(i).childNodes(j).getAttribute("name");}catch(e){}
			switch(sname){
			case "class.name":
				classname = oList.item(i).childNodes(j).text;						
				break;
			case "class.chn":
				classchn = oList.item(i).childNodes(j).text;
				break;
			case "user":
				userids = oList.item(i).childNodes(j).text;
				break;
			case "username":
				usernames =oList.item(i).childNodes(j).text;
				break;
			case "group":
				groupids = oList.item(i).childNodes(j).text;
				break;					
			case "groupname":
				groupnames = oList.item(i).childNodes(j).text;
				break;					
			case "role":
				roleids =oList.item(i).childNodes(j).text;
				break;					
			case "rolename":
				rolenames =oList.item(i).childNodes(j).text;
				break;					
			case "status":
				status = oList.item(i).childNodes(j).text;
				break;					
			case "statuschn":
				statuschn =oList.item(i).childNodes(j).text;
				break;					
			case "stepId":
				step =oList.item(i).childNodes(j).text;
				break;
			case "stepchn":
				stepchn =oList.item(i).childNodes(j).text;
				break;	
			case "step_id":
			case "action_id":
				break; //忽略这两个属性，点击确认后，系统自动拼上这两个属性
			//case "script.showname":
			//	scriptshowname = oList.item(i).childNodes(j).xml;//beanshell脚本的显示值
			//	break;
			default:					
				userdefine+=escape(oList.item(i).childNodes(j).xml);//自定义包含子节点，故用 .xml属性
			
			}					
		}
		strXml +="<td>" + classchn + "</td>";
		strXml +="<td>" + classname + "</td>";
		strXml +="<td>" + userids + "</td>";
		strXml +="<td>" + usernames + "</td>";
		strXml +="<td>" + roleids + "</td>";
		strXml +="<td>" + rolenames + "</td>";
		strXml +="<td>" + groupids + "</td>";
		strXml +="<td>" + groupnames + "</td>";
		strXml +="<td>" + status + "</td>";
		strXml +="<td>" + statuschn + "</td>";
		strXml +="<td>" + step + "</td>";
		strXml +="<td>" + stepchn + "</td>";
		strXml +="<td>" + userdefine + "</td>";
		//if (isResultCond!=null && isResultCond=="isResultCond"){
		//	strXml +="<td>" + scriptshowname + "</td>";
		//}

		//显示第一条的信息 //2012-4-1 去掉
//		if (i==0){
//			if (userids.length>0) showDivInfo("div"+skey +"User",userids,usernames);
//			if (roleids.length>0) showDivInfo("div"+skey + "Role",roleids,rolenames);
//			if (groupids.length>0) showDivInfo("div"+skey+"Group",groupids,groupnames);
//			
//		}
		strXml +="</tr>";
	}	
	return strXml;
}
/*
 * 复合节点 打开属性页时候，将属性串 赋值到dataset上面.
 * skey = Cond,Pref,Post
 */
function LoadXmlToDatasetForComp(skey,oList,oListAction){
	var strXml = "";
	for (var i=0;i<oList.length;i++){
		strXml +="<tr>";
		var userdefine="";
		var classname="",classchn="",userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="",status="",statuschn="",step="",stepchn="";
		//分析参数
		for (var j=0;j<oList.item(i).childNodes.length;j++){					
			var sname="";
			//忽略不按照<arg name='xxx'>xxxx</arg>的格式
			try{sname = oList.item(i).childNodes(j).getAttribute("name");}catch(e){}
			switch(sname){
			case "class.name":
				classname = oList.item(i).childNodes(j).text;						
				break;
			case "class.chn":
				classchn = oList.item(i).childNodes(j).text;
				break;
			case "user":
				userids = oList.item(i).childNodes(j).text;
				break;
			case "username":
				usernames =oList.item(i).childNodes(j).text;
				break;
			case "group":
				groupids = oList.item(i).childNodes(j).text;
				break;					
			case "groupname":
				groupnames = oList.item(i).childNodes(j).text;
				break;					
			case "role":
				roleids =oList.item(i).childNodes(j).text;
				break;					
			case "rolename":
				rolenames =oList.item(i).childNodes(j).text;
				break;					
			case "status":
				status = oList.item(i).childNodes(j).text;
				break;					
			case "statuschn":
				statuschn =oList.item(i).childNodes(j).text;
				break;					
			case "stepId":
				step =oList.item(i).childNodes(j).text;
				break;
			case "stepchn":
				stepchn =oList.item(i).childNodes(j).text;
				break;	
			case "step_id":
			case "action_id":
				break; //忽略这两个属性，点击确认后，系统自动拼上这两个属性
			default:					
				userdefine+=escape(oList.item(i).childNodes(j).xml);//自定义包含子节点，故用 .xml属性
			
			}					
		}
		strXml +="<td>" + classchn + "</td>";
		strXml +="<td>" + classname + "</td>";
		strXml +="<td>" + userids + "</td>";
		strXml +="<td>" + usernames + "</td>";
		strXml +="<td>" + roleids + "</td>";
		strXml +="<td>" + rolenames + "</td>";
		strXml +="<td>" + groupids + "</td>";
		strXml +="<td>" + groupnames + "</td>";
		strXml +="<td>" + status + "</td>";
		strXml +="<td>" + statuschn + "</td>";
		strXml +="<td>" + step + "</td>";
		strXml +="<td>" + stepchn + "</td>";
		strXml +="<td>" + userdefine + "</td>";
		strXml +="<td>1</td>";// step

		//显示第一条的信息 去掉2012-4-1
//		if (i==0){
//			if (userids.length>0) showDivInfo("div"+skey +"User",userids,usernames);
//			if (roleids.length>0) showDivInfo("div"+skey + "Role",roleids,rolenames);
//			if (groupids.length>0) showDivInfo("div"+skey+"Group",groupids,groupnames);
//			
//		}
		strXml +="</tr>";		
	}
	for (var i=0;i<oListAction.length;i++){
		strXml +="<tr>";
		var userdefine="";
		var classname="",classchn="",userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="",status="",statuschn="",step="",stepchn="";
		//分析参数
		for (var j=0;j<oListAction.item(i).childNodes.length;j++){					
			var sname="";
			//忽略不按照<arg name='xxx'>xxxx</arg>的格式
			try{sname = oListAction.item(i).childNodes(j).getAttribute("name");}catch(e){}
			switch(sname){
			case "class.name":
				classname = oListAction.item(i).childNodes(j).text;						
				break;
			case "class.chn":
				classchn = oListAction.item(i).childNodes(j).text;
				break;
			case "user":
				userids = oListAction.item(i).childNodes(j).text;
				break;
			case "username":
				usernames =oListAction.item(i).childNodes(j).text;
				break;
			case "group":
				groupids = oListAction.item(i).childNodes(j).text;
				break;					
			case "groupname":
				groupnames = oListAction.item(i).childNodes(j).text;
				break;					
			case "role":
				roleids =oListAction.item(i).childNodes(j).text;
				break;					
			case "rolename":
				rolenames =oListAction.item(i).childNodes(j).text;
				break;					
			case "status":
				status = oListAction.item(i).childNodes(j).text;
				break;					
			case "statuschn":
				statuschn =oListAction.item(i).childNodes(j).text;
				break;					
			case "stepId":
				step =oListAction.item(i).childNodes(j).text;
				break;
			case "stepchn":
				stepchn =oListAction.item(i).childNodes(j).text;
				break;	
			case "step_id":
			case "action_id":
				break; //忽略这两个属性，点击确认后，系统自动拼上这两个属性
			default:					
				userdefine+=escape(oListAction.item(i).childNodes(j).xml);//自定义包含子节点，故用 .xml属性
			
			}					
		}
		strXml +="<td>" + classchn + "</td>";
		strXml +="<td>" + classname + "</td>";
		strXml +="<td>" + userids + "</td>";
		strXml +="<td>" + usernames + "</td>";
		strXml +="<td>" + roleids + "</td>";
		strXml +="<td>" + rolenames + "</td>";
		strXml +="<td>" + groupids + "</td>";
		strXml +="<td>" + groupnames + "</td>";
		strXml +="<td>" + status + "</td>";
		strXml +="<td>" + statuschn + "</td>";
		strXml +="<td>" + step + "</td>";
		strXml +="<td>" + stepchn + "</td>";
		strXml +="<td>" + userdefine + "</td>";
		strXml +="<td>2</td>";// action

		//显示第一条的信息 2012-4-1 去掉，在滚动事件中加
//		if (i==0){
//			if (userids.length>0) showDivInfo("div"+skey +"User",userids,usernames);
//			if (roleids.length>0) showDivInfo("div"+skey + "Role",roleids,rolenames);
//			if (groupids.length>0) showDivInfo("div"+skey+"Group",groupids,groupnames);
//			
//		}		
		strXml +="</tr>";
	}		
	return strXml;
}
/**
 * 属性页点击确认 时，将数据集上的 信息，返回到内存对象中。
 * @parm nodePref condition,function
 * @param oXml
 * @return
 */
function SetDatasetToXml(nodePref,oXml){
	var conditionXml="";
	
	var len =  oXml.documentElement.childNodes.length-1;
	for (var i=0;i<len;i++){
		//类名选择了，才是有效的条件
		var classname = oXml.documentElement.childNodes(i).childNodes(1).text;
		if (IsSpace(classname))continue;
		var type="class";				
		if (classname=="beanshell") type="beanshell"; 
		
		conditionXml += '<' + nodePref + ' type="'+ type + '">';
		conditionXml += '<arg name="class.name">'+ classname + '</arg>';		
		conditionXml += '<arg name="class.chn">'+ oXml.documentElement.childNodes(i).childNodes(0).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(2).text))			
			conditionXml += '<arg name="user">'+ oXml.documentElement.childNodes(i).childNodes(2).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(3).text))			
			conditionXml += '<arg name="username">'+ oXml.documentElement.childNodes(i).childNodes(3).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(4).text))
			conditionXml += '<arg name="role">'+ oXml.documentElement.childNodes(i).childNodes(4).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(5).text))
			conditionXml += '<arg name="rolename">'+ oXml.documentElement.childNodes(i).childNodes(5).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(6).text))
			conditionXml += '<arg name="group">'+ oXml.documentElement.childNodes(i).childNodes(6).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(7).text))
			conditionXml += '<arg name="groupname">'+ oXml.documentElement.childNodes(i).childNodes(7).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(8).text))	
			conditionXml += '<arg name="status">'+ oXml.documentElement.childNodes(i).childNodes(8).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(9).text))
			conditionXml += '<arg name="statuschn">'+ oXml.documentElement.childNodes(i).childNodes(9).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(10).text))
			conditionXml += '<arg name="stepId">'+ oXml.documentElement.childNodes(i).childNodes(10).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(11).text))
			conditionXml += '<arg name="stepchn">'+ oXml.documentElement.childNodes(i).childNodes(11).text + '</arg>';
		//自定义参数		
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(12).text)){	
			var userdefine = unescape(oXml.documentElement.childNodes(i).childNodes(12).text);
			conditionXml +=userdefine;
		}
		conditionXml +="</" + nodePref + ">";		
	}
	return conditionXml;
}
//设置任务前置后置事件给数据集2013-7-4
function SetTaskFunctionToXml(oXml){
	var preTaskXml="",postTaskXml="";

	var flen = oXml.documentElement.childNodes.length-1;

	for (var k=0;k<flen;k++){
		var classname = oXml.documentElement.childNodes(k).childNodes(1).text;
		if (IsSpace(classname)) continue;
		
		var classnameChn = oXml.documentElement.childNodes(k).childNodes(0).text;
		var userdefine = oXml.documentElement.childNodes(k).childNodes(2).text;
		var type=oXml.documentElement.childNodes(k).childNodes(3).text;	
	
		var sXml = '<function type="class">';
		sXml += '<arg name="class.name">'+ classname + '</arg>';		
		sXml += '<arg name="class.chn">'+ classnameChn + '</arg>';
		//自定义参数		
		if (!IsSpace(userdefine)){	
			var userdefine = unescape(userdefine);
			sXml +=userdefine;
		}	
		sXml +="</function>";
		
		if(type=="1")
			preTaskXml+=sXml;
		
		else
			postTaskXml+=sXml;		
	
	}
	if (preTaskXml.length>0)
		preTaskXml ="<pre-functions>" + preTaskXml + "</pre-functions>";
	if (postTaskXml.length>0)
		postTaskXml ="<post-functions>" + postTaskXml + "</post-functions>";	
	
	return preTaskXml + postTaskXml;
}
/**
 * 复合节点中的 前置后置函数 ，将数据集上的信息，返回到内存变量中(step,action)
 * @parm nodePref condition,function
 * @param oXml
 * @return
 */
function SetDatasetToXmlForComp(nodePref,oXml){
	var objReturn = new Object();
	objReturn.stepXml = "";
	objReturn.actionXml = "";
	
	var len =  oXml.documentElement.childNodes.length-1;
	for (var i=0;i<len;i++){
		//类名选择了，才是有效的条件
		var classname = oXml.documentElement.childNodes(i).childNodes(1).text;
		if (IsSpace(classname))continue;
		var type="class";				
		if (classname=="beanshell") type="beanshell"; 
		
		var conditionXml="";	
		conditionXml += '<' + nodePref + ' type="'+ type + '">';
		conditionXml += '<arg name="class.name">'+ classname + '</arg>';		
		conditionXml += '<arg name="class.chn">'+ oXml.documentElement.childNodes(i).childNodes(0).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(2).text))			
			conditionXml += '<arg name="user">'+ oXml.documentElement.childNodes(i).childNodes(2).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(3).text))			
			conditionXml += '<arg name="username">'+ oXml.documentElement.childNodes(i).childNodes(3).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(4).text))
			conditionXml += '<arg name="role">'+ oXml.documentElement.childNodes(i).childNodes(4).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(5).text))
			conditionXml += '<arg name="rolename">'+ oXml.documentElement.childNodes(i).childNodes(5).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(6).text))
			conditionXml += '<arg name="group">'+ oXml.documentElement.childNodes(i).childNodes(6).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(7).text))
			conditionXml += '<arg name="groupname">'+ oXml.documentElement.childNodes(i).childNodes(7).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(8).text))	
			conditionXml += '<arg name="status">'+ oXml.documentElement.childNodes(i).childNodes(8).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(9).text))
			conditionXml += '<arg name="statuschn">'+ oXml.documentElement.childNodes(i).childNodes(9).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(10).text))
			conditionXml += '<arg name="stepId">'+ oXml.documentElement.childNodes(i).childNodes(10).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(11).text))
			conditionXml += '<arg name="stepchn">'+ oXml.documentElement.childNodes(i).childNodes(11).text + '</arg>';
		//自定义参数		
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(12).text)){	
			var userdefine = unescape(oXml.documentElement.childNodes(i).childNodes(12).text);
			conditionXml +=userdefine;
		}

		conditionXml +="</" + nodePref + ">";		
		//pref_type,post_type 1step 2action
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(13).text)){	
			if (oXml.documentElement.childNodes(i).childNodes(13).text=="1")
				objReturn.stepXml +=conditionXml;
			else
				objReturn.actionXml +=conditionXml;
		}
		
	}
	return objReturn;
}

/*
 * 打开属性页时候，将属性串 赋值到dataset上面，针对trigger.  2011-2-25
 * skey = Cond,Pref,Post
 	<trigger-functions>
		<trigger-function id="10">
            <function type="class">
              <arg name="class.chn">用户自定义定时执行的类</arg>
              <arg name="class.name">cn.com.fcsoft.workflow.util.TestTimer</arg>
            </function>
		 </trigger-function>
	</trigger-functions> 
 */
function LoadXmlToDatasetForTrigger(skey,oTriggers){
	var oTrigger;
	if (oTriggers.length>0){
		oTrigger = oTriggers.item(0).getElementsByTagName("trigger-function");
	}		
	if (oTrigger.length<=0){
		return "";
	}	
	
	var strXml = "";
	for (var i=0;i<oTrigger.length;i++){
		strXml +="<tr>";
				
		var userdefine="";
		var classname="",classchn="",userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="",status="",statuschn="",step="",stepchn="";
		var triggerid = oTrigger.item(i).getAttribute("id");
		var oArg = oTrigger.item(i).getElementsByTagName("arg");
		
		for (var j=0;j<oArg.length;j++){
			
			var sname="";
			//忽略不按照<arg name='xxx'>xxxx</arg>的格式
			try{sname = oArg.item(j).getAttribute("name");}catch(e){}	
			switch(sname){
			case "class.name":
				classname = oArg.item(j).text;						
				break;
			case "class.chn":
				classchn =oArg.item(j).text;
				break;
			case "user":
				userids = oArg.item(j).text;
				break;
			case "username":
				usernames =oArg.item(j).text;
				break;
			case "group":
				groupids = oArg.item(j).text;
				break;					
			case "groupname":
				groupnames = oArg.item(j).text;
				break;					
			case "role":
				roleids =oArg.item(j).text;
				break;					
			case "rolename":
				rolenames =oArg.item(j).text;
				break;					
			case "status":
				status = oArg.item(j).text;
				break;					
			case "statuschn":
				statuschn =oArg.item(j).text;
				break;					
			case "stepId":
				step =oArg.item(j).text;
				break;
			case "stepchn":
				stepchn =oArg.item(j).text;
				break;	
			case "step_id":
			case "action_id":
				break; //忽略这两个属性，点击确认后，系统自动拼上这两个属性
			default:					
				userdefine+=escape(oArg.item(j).xml);//自定义包含子节点，故用 .xml属性
			
			}								
		}
		strXml +="<td>" + triggerid + "</td>";
		strXml +="<td>" + classchn + "</td>";
		strXml +="<td>" + classname + "</td>";
		strXml +="<td>" + userids + "</td>";
		strXml +="<td>" + usernames + "</td>";
		strXml +="<td>" + roleids + "</td>";
		strXml +="<td>" + rolenames + "</td>";
		strXml +="<td>" + groupids + "</td>";
		strXml +="<td>" + groupnames + "</td>";
		strXml +="<td>" + status + "</td>";
		strXml +="<td>" + statuschn + "</td>";
		strXml +="<td>" + step + "</td>";
		strXml +="<td>" + stepchn + "</td>";
		strXml +="<td>" + userdefine + "</td>";

		//显示第一条的信息 //去掉 2012-4-1 在滚动事件中有
//		if (i==0){
//			if (userids.length>0) showDivInfo("div"+skey +"User",userids,usernames);
//			if (roleids.length>0) showDivInfo("div"+skey + "Role",roleids,rolenames);
//			if (groupids.length>0) showDivInfo("div"+skey+"Group",groupids,groupnames);
//			
//		}
		strXml +="</tr>";	
		
		
	}


	return strXml;
}
/**
 * 属性页点击确认 时，将数据集上的 信息，返回到内存对象中。针对trigger 2011-2-25
 * @parm nodePref condition,function
 * @param oXml
 * @return
 */
function SetDatasetToXmlForTrigger(nodePref,oXml){
	var conditionXml="";
	
	var len =  oXml.documentElement.childNodes.length-1;
	for (var i=0;i<len;i++){
		//类名选择了，才是有效的条件
		var classname = oXml.documentElement.childNodes(i).childNodes(2).text;
		if (IsSpace(classname))continue;
		var type="class";				
		if (classname=="beanshell") type="beanshell"; 
		
		conditionXml += '<trigger-function id="' + oXml.documentElement.childNodes(i).childNodes(0).text + '">';
		
		conditionXml += '<' + nodePref + ' type="'+ type + '">';
		conditionXml += '<arg name="class.name">'+ classname + '</arg>';		
		conditionXml += '<arg name="class.chn">'+ oXml.documentElement.childNodes(i).childNodes(1).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(2).text))			
			conditionXml += '<arg name="user">'+ oXml.documentElement.childNodes(i).childNodes(3).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(3).text))			
			conditionXml += '<arg name="username">'+ oXml.documentElement.childNodes(i).childNodes(4).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(4).text))
			conditionXml += '<arg name="role">'+ oXml.documentElement.childNodes(i).childNodes(5).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(5).text))
			conditionXml += '<arg name="rolename">'+ oXml.documentElement.childNodes(i).childNodes(6).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(6).text))
			conditionXml += '<arg name="group">'+ oXml.documentElement.childNodes(i).childNodes(7).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(7).text))
			conditionXml += '<arg name="groupname">'+ oXml.documentElement.childNodes(i).childNodes(8).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(8).text))	
			conditionXml += '<arg name="status">'+ oXml.documentElement.childNodes(i).childNodes(9).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(9).text))
			conditionXml += '<arg name="statuschn">'+ oXml.documentElement.childNodes(i).childNodes(10).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(10).text))
			conditionXml += '<arg name="stepId">'+ oXml.documentElement.childNodes(i).childNodes(11).text + '</arg>';
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(11).text))
			conditionXml += '<arg name="stepchn">'+ oXml.documentElement.childNodes(i).childNodes(12).text + '</arg>';
		//自定义参数		
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(13).text)){	
			var userdefine = unescape(oXml.documentElement.childNodes(i).childNodes(13).text);
			conditionXml +=userdefine;
		}
		conditionXml +="</" + nodePref + ">";	
		
		conditionXml += '</trigger-function>';	
	}
	return conditionXml;
}



/**
*流程设计器帮助页面
*@para htmlfile 帮助页面的HTM文件名
*@date 2011-05-24
**/
function ShowFlowHelp(htmlfile,tagname) {
	var surl =fcpubdata.path + "/workflow/workflow_help/" + htmlfile + ".htm";
	if (!IsSpace(tagname))
		surl = surl + "#" + tagname;
		
    window.open(surl, "_blank", "top=0,left=0,height=400,width=300,status=no,toolbar=yes,menubar=no,location=no,resizable=yes,scrollbars=yes")
}

/**
*流程设计器中 复合节点，动作节点 点击 "设置表访问权限" 按钮 打开的页面
*@para AccessControlPage 步动节点，动作节点 设置表访问权限 按钮打开的页面，""空则关闭此按钮，用eform表单中的权限设置 
*@date 2011-07-19
**/
var AccessControlPage = "../../fceform/common/djframe.htm?djsn=action_access_control&djtype=WF_DSN";
function uf_setControl(){
	var arrSend=new Array();
	arrSend[0] = accessControls;
	var objReturn = window.showModalDialog(AccessControlPage, arrSend, "dialogHeight:700px; dialogWidth:660px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes");
	if (objReturn==null) return;
	accessControls=objReturn; //节点属性页面中的全局变量，存设置的返回信息。
	//返回的信息格式
	//<access-controls>
	//		<access-control name="table1">
	//		<control name="field1" readonly="true" disabled="false" display="false"/>
	//		<control name="field2" readonly="true" disabled="false" display="false"/>
	//		</access-control>		
	//</access-controls>	
}
/**
 * 设置多场景访问对应的表单，如 手机，ipad等设备使用的表单
 * @return
 * @date 2012-10-22
 */
function uf_setActionForm(){
	var arrSend=new Array();
	arrSend[0] = actionForms;
	var actionFormPage = "../../fceform/common/djframe.htm?djsn=set_action_form&djtype=WF_DSN";
	var objReturn = window.showModalDialog(actionFormPage, arrSend, "dialogHeight:400px; dialogWidth:600px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes");
	if (objReturn==null) return;
	actionForms=objReturn; //节点属性页面中的全局变量，存设置的返回信息。
	//返回的信息格式
	//<action-forms>
	//		<action-form name="handphone">表单url链接值</action-form>
	//		<action-form name="ipad">表单url链接值</action-form>	
	//</action-forms>	
	
}
/**
*流程设计器中 条件类名选择 自定义脚本，预置false条件
*@para drpObj 条件类名下拉框,
*@para txtObj 自定义条件输入框
*@date 2011-07-20
**/
function uf_setCondBeanshell(drpObj,txtObj){
	
	var condName = drpObj.value;
	if ((condName=="自定义脚本"||condName=="beanshell") && IsSpace(txtObj.value)){
		txtObj.value="<arg name=\"script\">false</arg>";
		txtObj.fireEvent("onchange");
		
	}		
}
function uf_setFuncBeanshell(drpObj,txtObj){
	var condName = drpObj.value;
	//alert(condName);
	if (condName=="自定义脚本" && IsSpace(txtObj.value)){
		txtObj.value="<arg name=\"script\"></arg>";
		txtObj.fireEvent("onchange");		
	}		
}

/**
 * 调用通用的参数设置页面
 * @param dsname =comp_cond,comp_pref,com_post,action....
 * @return
 */
function uf_class_onclick(dsname){
	var strWindowParam = "dialogHeight:300px; dialogWidth:600px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes";
	var strPage = location.protocol+'//'+location.host +fcpubdata.path;
	strPage +="/fceform/common/djframe.htm?djsn=wd_class_param&djtype=WF_DSN";
	
	var arr = new Array();
	arr[0] = dsname;	
	arr[1] = stepOptions; //在页面中准备的全局变量(步骤) 
	if (dsname=="comp_cond" ||dsname=="action_cond" || dsname=="result_cond" ||dsname=="join_cond")
		arr[2] = dsCond;
	if (dsname=="comp_pref" ||dsname=="action_pref" || dsname=="result_pref" ||dsname=="trigger" || dsname=="step_pref")
		arr[2] = dsPref;
	if (dsname=="comp_post" ||dsname=="action_post" || dsname=="result_post" || dsname=="step_post")
		arr[2] = dsPost;	
	//$id("cboPermType").setAttribute("billName",objNodePropertys.view
	if (dsname=="result_cond")
		arr[3] = $id("cboPermType").getAttribute("billName");
	
	var arrOk = window.showModalDialog(strPage, arr,strWindowParam);
	if (arrOk==null) 
		return;	
	var key = "";
	var ds;
	if (dsname=="comp_cond" ||dsname=="action_cond" || dsname=="result_cond" ||dsname=="join_cond"){ key="cond_"; ds=dsCond;}
	if (dsname=="comp_pref" ||dsname=="action_pref" || dsname=="result_pref" || dsname=="trigger" ||dsname=="step_pref"){ key="pref_"; ds=dsPref;}
	if (dsname=="comp_post" ||dsname=="action_post" || dsname=="result_post" ||dsname=="step_post"){ key="post_"; ds=dsPost;}

	ds.Field(key+"class_name").Value =arrOk[0];
	ds.Field(key+"class_name_chn").Value = arrOk[1];
	ds.Field(key+"step").Value = arrOk[2];
	ds.Field(key+"status").Value = arrOk[3];
	ds.Field(key+"undefine").Value = arrOk[4];
	
	ds.Field(key+"user_id").Value = arrOk[5];
	ds.Field(key+"user").Value = arrOk[6];
	ds.Field(key+"role_id").Value = arrOk[7];
	ds.Field(key+"role").Value = arrOk[8];
	ds.Field(key+"group_id").Value = arrOk[9];
	ds.Field(key+"group").Value = arrOk[10];	
	
	if (dsname=="comp_pref") ds.Field("pref_type").Value = arrOk[11];
	if (dsname=="comp_post") ds.Field("post_type").Value = arrOk[11];
	
	ds.fset_cont();	
	
	//dataset2.Field("class_param").Value=objReturn;
	//dataset2.fset_cont();
}
/**
 * 调用任务前置后置事件类 设置页面 2013-7-4
 * @param 
 * @return
 */
function uf_taskfunction(){
	var strWindowParam = "dialogHeight:300px; dialogWidth:600px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes";
	var strPage = location.protocol+'//'+location.host +fcpubdata.path;
	strPage +="/fceform/common/djframe.htm?djsn=wd_task_function&djtype=WF_DSN";
	
	var arr = new Array();
	arr[0] = dsTaskFunction;	
	
	var arrOk = window.showModalDialog(strPage, arr,strWindowParam);
	if (arrOk==null) 
		return;	

	dsTaskFunction.Field("class_name").Value =arrOk[0];
	dsTaskFunction.Field("class_name_chn").Value = arrOk[1];
	dsTaskFunction.Field("user_undefine").Value = arrOk[2];
	dsTaskFunction.Field("type").Value = arrOk[3];
	if (arrOk[3]=="1")
		dsTaskFunction.Field("type_chn").Value="前置事件";
	else
		dsTaskFunction.Field("type_chn").Value="后置事件";

	
	dsTaskFunction.fset_cont();

	//alert(dsTaskFunction.oDom.documentElement.xml);

}
