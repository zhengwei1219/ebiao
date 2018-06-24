
//*************************************************************
// ���������� ��������
// ���������� ��
//-------------------------------------------------------------
function FlowAttributes()
{
}

//*************************************************************
// ���������� �ڵ�����
// ���������� ��
//-------------------------------------------------------------
function NodePropertys()
{
}

//*************************************************************
// ���������� ��������
// ���������� ��
//-------------------------------------------------------------
function NodeCondition()
{
}

//*************************************************************
// ���������� ��������
// ���������� ��
//-------------------------------------------------------------
function TaskInfo()
{
}
//*************************************************************
// ���������� ����&ǰ�ú��ú����Ĳ�����������
// ���������� ��
//-------------------------------------------------------------
function ParameterInfo()
{
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//�����������  ����ҳ �Ĺ��� ����
/**
* div�е���ʾ�û�����ɫ�������Ϣ
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
			items += "���͸���" + idnames[i];		
		else
			items += idnames[i];		
		items +="</span></br>"; //���ϻ���			
	
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
 * ��div����ʾ��������û�����ɫ��Ⱥ��
 * @param oClass
 * @return
 */
function showVarClassDivInfo(oDom){
	var oClass = oDom.getElementsByTagName("var-class");
	//Ҫ��� ƴ�� userids �� dsTask.Field("var_class").Value �� ֵ
	
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
				classParam +=oClass.item(k).childNodes(l).xml; //�õ�class_paramֵ
			}		
		}
		//�����û�div ��
		var isCopy="false";
		var id="",idname="";	
		var divid="";
		if (clsuserid!=""){
			isCopy="false";//һ�������ֻ࣬�ܸ�һ��������ֵ����Щid����ֻ��һ����ֵ
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
			items += "���͸���" + idname;		
		else
			items += idname;			
		items +="</span></br>"; //���ϻ���			

		var obj = document.getElementById(divid);
		var inner = obj.innerHTML;
		if (IsSpace(inner))
			obj.innerHTML = items;
		else
			obj.innerHTML = inner + items;
	}	
}

function removeItems(which){
	
	//if(confirm("ȷ��ɾ����ѡ�"))
	//{
		var objParent = which.parentNode.parentNode;
		which.parentNode.removeNode(true);		
		setChoiceValueToDataset(objParent);
		//alert("ɾ���ɹ���");
		
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
//��̨��������ڵ�����������var-classes ������û�ѡ����wd_user_new_list.dj 2012-4-5
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
 * װ�붯��������������
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
 * װ�벽�������������
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
 * ���ݼ��ϵ�ɾ����ɾ����
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
 * ����������������
 * @param dataset
 * @return
 */
function uf_insert_row(dataset,key){
	if (dataset.RecordCount==0)
		dataset.Append();
	else{
		if (!IsSpace(key) && key=="trigger"){
			if (!IsSpace(dataset.Field(1).Value)) //trigger�ĵ�һ��Ϊtriggerid��һ����ֵ
				dataset.Append();
		}
		else if (!IsSpace(dataset.Field(0).Value))
			dataset.Append();		
	}
}
/**
 * �������ݼ��Ĺ����¼�
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
 * ǰ�ú����Ĺ����¼�
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
 * ���ú����Ĺ����¼�
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
	
	//���ؼ�����ȥ��ԭ���Ķ�����Ϣ
	var oNodes = oClass.selectNodes("root/var-class/arg[@name = '"+ key +"']");
	for(var i=0;i<oNodes.length;i++)
	{
		var parentNode = oNodes(i).parentNode;
		oClass.documentElement.removeChild(parentNode);
	}
	//��ȥ�����͵�
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
 *��ˢ�û�����ɫ��Ⱥ�� �����ݼ�����  ,�� ѡ���û�����ɫ��Ⱥ��ȵ�ҳ��ȷ�Ϻ���ã�����ˢ����Ӧ���ݼ��е�ֵ 
 */
function setChoiceValueToDataset(oDiv){
	var haveItem=oDiv.all.tags("SPAN");
	var haveLen = haveItem.length;	
	var ids = "",idnames="";
	var copyids ="",copyidnames="";
	var varclasses="";//������	
	var key = getArgNameKeyFromDivid(oDiv.id);

	if (oDiv.id.substring(3,7)=="Task")//�� ������Ҫ���� 2012-4-1
		varclasses = getVarClassesByKey(key,dsTask.Field("var_class").Value);
	
	for(var j=0; j< haveLen;j++)
	{
		var idValue = haveItem[j].getAttribute("id_value");
		var idName =  haveItem[j].getAttribute("id_name");
		var isCopy =  haveItem[j].getAttribute("is_copy");
		//���� ������ķ�ʽ����ֵ��var-class 2012-4-1
		var className =  haveItem[j].getAttribute("class_name");
		var classParam =  haveItem[j].getAttribute("class_param");
		
		if (!IsSpace(className) && oDiv.id.substring(0,7)=="divTask"){
			varclasses +="<var-class type='class'>";//��Ĭ��Ϊclass��
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
				copyidnames +=idName + ","; //�������治���� ���͸�
				
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
//�Զ������onchange()�¼����޸Ķ�������ݼ�ֵ
//isResultCond = "isResultCond" ��ʾresultҳ���beanshell������ʾ
function uf_undefine_onchange(dsname){	
	var userdefine = "";
	
	if (dsname=="dsCond"){
		userdefine = $id("txtCondUndefine").value;
		//if (isResultCond==null){
			if(!IsFlowUserDefineFormat(userdefine)){
				alert("�밴��xml�ĸ�ʽ(<arg name='xxx'>xxx</arg>)�����������Զ������ \r\t" + userdefine );	
				return;
			} 
			dsCond.Field("cond_undefine").Value = escape(userdefine);			
		//}
		
		//if (isResultCond!=null && isResultCond=="isResultCond"){
		//	if (dsCond.Field("cond_class_name")=="beanshell"){ //�Զ����beanshell������
		//		uf_setBeanshellCondToDataSet();
		//		return;			
		//	}
		//}

	}	
	if (dsname =="dsPref"){
		userdefine = $id("txtPrefUndefine").value;
		if(!IsFlowUserDefineFormat(userdefine)){
			alert("�밴��xml�ĸ�ʽ(<arg name='xxx'>xxx</arg>)����ǰ�ú������Զ������ \r\t" + userdefine );	
			return;
		} 
		
		dsPref.Field("pref_undefine").Value = escape($id("txtPrefUndefine").value);
	}	
	if (dsname =="dsPost"){
		userdefine = $id("txtPostUndefine").value;
		if(!IsFlowUserDefineFormat(userdefine)){
			alert("�밴��xml�ĸ�ʽ(<arg name='xxx'>xxx</arg>)���ú��ú������Զ������ \r\t" + userdefine );	
			return;
		} 
		dsPost.Field("post_undefine").Value = escape($id("txtPostUndefine").value);
	}	
}
//beanshell�Ľű����õ����ݼ��������� 2011-4-15
//function uf_setBeanshellCondToDataSet(){
//	var scripShowname = $id("txtCondUndefine").value;
//	//��Ҫת����code ��eform�ı���ת
//	var userdefine = $id("txtCondUndefine").getAttribute("codeValue");
//	dsCond.Field("cond_undefine").Value = escape(userdefine);
//	dsCond.Field("cond_undefine_name").Value = escape(scripShowname);
//}
/**
 * ����û��Զ���������Ƿ��� <arg name='xxx'>xxxxx</arg>�ĸ�ʽ
 */
function IsFlowUserDefineFormat(userdefine){
	var bReturn = true;
	var otemp = SetDom("<root>" + userdefine +"</root>");
	if (otemp==null ||otemp.documentElement ==null) return false;
	//	alert("�밴��xml�ĸ�ʽ�������������Զ������ " + userdefine );	
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
 * ������ҳʱ�򣬽����Դ� ��ֵ��dataset����.
 * skey = Cond,Pref,Post
 * isResultCond = "isResultCond" ��resultҳ������� 2011-4-15
 */
function LoadXmlToDataset(skey,oList){
	var strXml = "";
	for (var i=0;i<oList.length;i++){
		strXml +="<tr>";
		var userdefine="";
		var classname="",classchn="",userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="",status="",statuschn="",step="",stepchn="";
		//var scriptshowname="";
		//��������
		for (var j=0;j<oList.item(i).childNodes.length;j++){					
			var sname="";
			//���Բ�����<arg name='xxx'>xxxx</arg>�ĸ�ʽ
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
				break; //�������������ԣ����ȷ�Ϻ�ϵͳ�Զ�ƴ������������
			//case "script.showname":
			//	scriptshowname = oList.item(i).childNodes(j).xml;//beanshell�ű�����ʾֵ
			//	break;
			default:					
				userdefine+=escape(oList.item(i).childNodes(j).xml);//�Զ�������ӽڵ㣬���� .xml����
			
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

		//��ʾ��һ������Ϣ //2012-4-1 ȥ��
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
 * ���Ͻڵ� ������ҳʱ�򣬽����Դ� ��ֵ��dataset����.
 * skey = Cond,Pref,Post
 */
function LoadXmlToDatasetForComp(skey,oList,oListAction){
	var strXml = "";
	for (var i=0;i<oList.length;i++){
		strXml +="<tr>";
		var userdefine="";
		var classname="",classchn="",userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="",status="",statuschn="",step="",stepchn="";
		//��������
		for (var j=0;j<oList.item(i).childNodes.length;j++){					
			var sname="";
			//���Բ�����<arg name='xxx'>xxxx</arg>�ĸ�ʽ
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
				break; //�������������ԣ����ȷ�Ϻ�ϵͳ�Զ�ƴ������������
			default:					
				userdefine+=escape(oList.item(i).childNodes(j).xml);//�Զ�������ӽڵ㣬���� .xml����
			
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

		//��ʾ��һ������Ϣ ȥ��2012-4-1
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
		//��������
		for (var j=0;j<oListAction.item(i).childNodes.length;j++){					
			var sname="";
			//���Բ�����<arg name='xxx'>xxxx</arg>�ĸ�ʽ
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
				break; //�������������ԣ����ȷ�Ϻ�ϵͳ�Զ�ƴ������������
			default:					
				userdefine+=escape(oListAction.item(i).childNodes(j).xml);//�Զ�������ӽڵ㣬���� .xml����
			
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

		//��ʾ��һ������Ϣ 2012-4-1 ȥ�����ڹ����¼��м�
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
 * ����ҳ���ȷ�� ʱ�������ݼ��ϵ� ��Ϣ�����ص��ڴ�����С�
 * @parm nodePref condition,function
 * @param oXml
 * @return
 */
function SetDatasetToXml(nodePref,oXml){
	var conditionXml="";
	
	var len =  oXml.documentElement.childNodes.length-1;
	for (var i=0;i<len;i++){
		//����ѡ���ˣ�������Ч������
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
		//�Զ������		
		if (!IsSpace(oXml.documentElement.childNodes(i).childNodes(12).text)){	
			var userdefine = unescape(oXml.documentElement.childNodes(i).childNodes(12).text);
			conditionXml +=userdefine;
		}
		conditionXml +="</" + nodePref + ">";		
	}
	return conditionXml;
}
//��������ǰ�ú����¼������ݼ�2013-7-4
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
		//�Զ������		
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
 * ���Ͻڵ��е� ǰ�ú��ú��� �������ݼ��ϵ���Ϣ�����ص��ڴ������(step,action)
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
		//����ѡ���ˣ�������Ч������
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
		//�Զ������		
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
 * ������ҳʱ�򣬽����Դ� ��ֵ��dataset���棬���trigger.  2011-2-25
 * skey = Cond,Pref,Post
 	<trigger-functions>
		<trigger-function id="10">
            <function type="class">
              <arg name="class.chn">�û��Զ��嶨ʱִ�е���</arg>
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
			//���Բ�����<arg name='xxx'>xxxx</arg>�ĸ�ʽ
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
				break; //�������������ԣ����ȷ�Ϻ�ϵͳ�Զ�ƴ������������
			default:					
				userdefine+=escape(oArg.item(j).xml);//�Զ�������ӽڵ㣬���� .xml����
			
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

		//��ʾ��һ������Ϣ //ȥ�� 2012-4-1 �ڹ����¼�����
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
 * ����ҳ���ȷ�� ʱ�������ݼ��ϵ� ��Ϣ�����ص��ڴ�����С����trigger 2011-2-25
 * @parm nodePref condition,function
 * @param oXml
 * @return
 */
function SetDatasetToXmlForTrigger(nodePref,oXml){
	var conditionXml="";
	
	var len =  oXml.documentElement.childNodes.length-1;
	for (var i=0;i<len;i++){
		//����ѡ���ˣ�������Ч������
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
		//�Զ������		
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
*�������������ҳ��
*@para htmlfile ����ҳ���HTM�ļ���
*@date 2011-05-24
**/
function ShowFlowHelp(htmlfile,tagname) {
	var surl =fcpubdata.path + "/workflow/workflow_help/" + htmlfile + ".htm";
	if (!IsSpace(tagname))
		surl = surl + "#" + tagname;
		
    window.open(surl, "_blank", "top=0,left=0,height=400,width=300,status=no,toolbar=yes,menubar=no,location=no,resizable=yes,scrollbars=yes")
}

/**
*����������� ���Ͻڵ㣬�����ڵ� ��� "���ñ����Ȩ��" ��ť �򿪵�ҳ��
*@para AccessControlPage �����ڵ㣬�����ڵ� ���ñ����Ȩ�� ��ť�򿪵�ҳ�棬""����رմ˰�ť����eform���е�Ȩ������ 
*@date 2011-07-19
**/
var AccessControlPage = "../../fceform/common/djframe.htm?djsn=action_access_control&djtype=WF_DSN";
function uf_setControl(){
	var arrSend=new Array();
	arrSend[0] = accessControls;
	var objReturn = window.showModalDialog(AccessControlPage, arrSend, "dialogHeight:700px; dialogWidth:660px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes");
	if (objReturn==null) return;
	accessControls=objReturn; //�ڵ�����ҳ���е�ȫ�ֱ����������õķ�����Ϣ��
	//���ص���Ϣ��ʽ
	//<access-controls>
	//		<access-control name="table1">
	//		<control name="field1" readonly="true" disabled="false" display="false"/>
	//		<control name="field2" readonly="true" disabled="false" display="false"/>
	//		</access-control>		
	//</access-controls>	
}
/**
 * ���öೡ�����ʶ�Ӧ�ı����� �ֻ���ipad���豸ʹ�õı�
 * @return
 * @date 2012-10-22
 */
function uf_setActionForm(){
	var arrSend=new Array();
	arrSend[0] = actionForms;
	var actionFormPage = "../../fceform/common/djframe.htm?djsn=set_action_form&djtype=WF_DSN";
	var objReturn = window.showModalDialog(actionFormPage, arrSend, "dialogHeight:400px; dialogWidth:600px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes");
	if (objReturn==null) return;
	actionForms=objReturn; //�ڵ�����ҳ���е�ȫ�ֱ����������õķ�����Ϣ��
	//���ص���Ϣ��ʽ
	//<action-forms>
	//		<action-form name="handphone">��url����ֵ</action-form>
	//		<action-form name="ipad">��url����ֵ</action-form>	
	//</action-forms>	
	
}
/**
*����������� ��������ѡ�� �Զ���ű���Ԥ��false����
*@para drpObj ��������������,
*@para txtObj �Զ������������
*@date 2011-07-20
**/
function uf_setCondBeanshell(drpObj,txtObj){
	
	var condName = drpObj.value;
	if ((condName=="�Զ���ű�"||condName=="beanshell") && IsSpace(txtObj.value)){
		txtObj.value="<arg name=\"script\">false</arg>";
		txtObj.fireEvent("onchange");
		
	}		
}
function uf_setFuncBeanshell(drpObj,txtObj){
	var condName = drpObj.value;
	//alert(condName);
	if (condName=="�Զ���ű�" && IsSpace(txtObj.value)){
		txtObj.value="<arg name=\"script\"></arg>";
		txtObj.fireEvent("onchange");		
	}		
}

/**
 * ����ͨ�õĲ�������ҳ��
 * @param dsname =comp_cond,comp_pref,com_post,action....
 * @return
 */
function uf_class_onclick(dsname){
	var strWindowParam = "dialogHeight:300px; dialogWidth:600px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes";
	var strPage = location.protocol+'//'+location.host +fcpubdata.path;
	strPage +="/fceform/common/djframe.htm?djsn=wd_class_param&djtype=WF_DSN";
	
	var arr = new Array();
	arr[0] = dsname;	
	arr[1] = stepOptions; //��ҳ����׼����ȫ�ֱ���(����) 
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
 * ��������ǰ�ú����¼��� ����ҳ�� 2013-7-4
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
		dsTaskFunction.Field("type_chn").Value="ǰ���¼�";
	else
		dsTaskFunction.Field("type_chn").Value="�����¼�";

	
	dsTaskFunction.fset_cont();

	//alert(dsTaskFunction.oDom.documentElement.xml);

}
