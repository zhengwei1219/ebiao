function Flow_OpenWindow(){
	var flowname ="";
	var flowdesc = "";
	var flowversion = "";
	var flowsavetype = "database";
	var flowrun = "����";
		
	try{
		/* ��index���ҳ��ʱ����
		flowname = parent.window.window.opener.Flowname;
		flowdesc = parent.window.window.opener.Flowdesc;
		flowversion = parent.window.window.opener.Flowversion;
		flowsavetype = parent.window.window.opener.Flowsavetype;
		*/				
		flowname = Request.QueryString('flow_name').toString();		
		flowdesc = unescape(Request.QueryString('flow_desc').toString());		
		flowversion = Request.QueryString('flow_version').toString();		
		flowsavetype = Request.QueryString('save_type').toString();				
		flowrun = unescape(Request.QueryString('flow_run').toString());

    } catch (e) {}

	if(typeof(flowname)=="undefined" || flowname=="undefined"){
	    flowname = "";
	    flowdesc = "";
	    flowversion = "";
	    flowsavetype = "database";
	    flowrun = "����";	
	}

	var strOperate = "flow_getdataxml";
	if (flowsavetype=="xmlfile")
		strOperate = "flow_getfilexml";
		
	var strUp ="";
	if (typeof(flowname)!="undefined" && flowname!=""){
	
		strUp +="<root>"
		strUp +="<flowname>"+ flowname + "</flowname>";  //��������
		strUp +="<flowversion>"+ flowversion + "</flowversion>";  //���̰汾
		strUp +="<curopenfile></curopenfile>";//��ǰ�򿪵������ļ� TODO
		strUp +="</root>";
	
		var strReturn=SendHttp(fcpubdata.servletPath + "/DesignerServlet"+fcpubdata.dotnetVersion+"?operate=" + strOperate,strUp);	

		var oXml = SetDom(strReturn);
		if (oXml.documentElement==null){
			alert("���̶���"+ flowname +"��ʽ�д����ܴ򿪣�");
			return;
		}
		
		if (oXml.childNodes(0).childNodes(0).text=="false"){
			alert(oXml.childNodes(0).childNodes(1).text);
			return;
		}	
		var flowtype = oXml.childNodes(0).childNodes(1).text; //ģ�����id
		var descriptor = oXml.childNodes(0).childNodes(2).xml; //���ص�����xml����
		var oDescriptor = SetDom(descriptor);
		var flownodes = oXml.childNodes(0).childNodes(3).xml; //FlowArea.FlowNodes.Nodes����ڵ�ֵ
		flowrun = oXml.childNodes(0).childNodes(4).text;//�޸ĳɴӺ�̨��ȡ������ҳ�洫�� ģ��״̬
	
		// �ָ����ð�ť��״̬
		//FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
		FlowArea.style.cursor = "default";
		Flow_SetCurrentTool("None");
		// ����FlowArea����ȫ��Ԫ�������ʽ
		Flow_SetCursorStyle("");
				
		Flow_ClearNowFlow();
		
		var oAttribute = new FlowAttributes();
		
		oAttribute.FlowName = flowname;
		oAttribute.FlowDesc = flowdesc;
		oAttribute.FlowSaveType = flowsavetype;
		oAttribute.FlowVersion = flowversion;
		oAttribute.FlowRUN = flowrun;
		oAttribute.FlowDefsType = flowtype;//ģ�����id
		FlowArea.FlowAttributes = oAttribute;

		//װ������
		Flow_LoadNamedFlow(flowname,oDescriptor,flownodes);			
		
	}

	

}
function Flow_OpenData(){
	//Flow_ClearNowFlow();
	var objReturn = window.showModalDialog(fcpubdata.Path + "/fceform/common/djframe.htm?djsn=wf_db_list&djtype=WF_DSN", window, "dialogHeight:570px; dialogWidth:680px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes");
	//var objReturn = window.showModalDialog("FlowDataList.htm", window, "dialogHeight:580px; dialogWidth:500px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes;dialogLeft:260;dialogTop:353");
	
	// �ָ����ð�ť��״̬
	FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
	FlowArea.style.cursor = "default";
	Flow_SetCurrentTool("None");
	// ����FlowArea����ȫ��Ԫ�������ʽ
	Flow_SetCursorStyle("");
	
	if (objReturn==null) return;
	
	Flow_ClearNowFlow();
	
	FlowArea.FlowAttributes = objReturn;

	var flowname = objReturn[0];
	var flowdesc = objReturn[1];
	var oXml = SetDom(objReturn[2]);
	var flownodes = objReturn[3]; //FlowArea.FlowNodes.Nodes
	var version = objReturn[4];
	var flowrun = objReturn[5];
	var flowtype = objReturn[6];//ģ�����id
	
	var oAttribute = new FlowAttributes();
	
	oAttribute.FlowName = flowname;
	oAttribute.FlowDesc = flowdesc;
	oAttribute.FlowSaveType = "database";
	oAttribute.FlowVersion = version;
	oAttribute.FlowRUN = flowrun;
	oAttribute.FlowDefsType = flowtype;//ģ�����id
	FlowArea.FlowAttributes = oAttribute;

	//װ������
	Flow_LoadNamedFlow(flowname,oXml,flownodes);

}
function Flow_OpenFile(){
	
	//var oDom = SetDomFile("http://localhost/desinger/aa.xml");
	var objReturn = window.showModalDialog(fcpubdata.Path + "/fceform/common/djframe.htm?djsn=wf_xml_list&djtype=WF_DSN", window, "dialogHeight:570px; dialogWidth:680px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes");
	//var objReturn = window.showModalDialog("FlowFileList.htm", window, "dialogHeight:580px; dialogWidth:500px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes;dialogLeft:260;dialogTop:353");
	
	// �ָ����ð�ť��״̬
	FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
	FlowArea.style.cursor = "default";
	Flow_SetCurrentTool("None");
	// ����FlowArea����ȫ��Ԫ�������ʽ
	Flow_SetCursorStyle("");

	if (objReturn==null) return;
	
	Flow_ClearNowFlow();
	var flowname = objReturn[0];
	var flowdesc = objReturn[1];
	var oXml = SetDom(objReturn[2]);
	var flownodes = objReturn[3]; //FlowArea.FlowNodes.Nodes
	var version = objReturn[4]; 
	var flowrun = objReturn[5];
	var flowtype = objReturn[6];//ģ�����id
	
	var oAttribute = new FlowAttributes();
	
	oAttribute.FlowName = flowname;
	oAttribute.FlowDesc = flowdesc;
	oAttribute.FlowSaveType = "xmlfile";
	oAttribute.FlowVersion = version;
	oAttribute.FlowRUN = flowrun;
	oAttribute.FlowDefsType = flowtype;//ģ�����id
	FlowArea.FlowAttributes = oAttribute;
	
	//װ������
	Flow_LoadNamedFlow(flowname,oXml,flownodes);


	
}
//*************************************************************
// ���������� װ��ָ������������
// ���������� flowname�������� oXml���̶������ݣ�flownodes���̵���ƽ���λ����Ϣ
//-------------------------------------------------------------

function Flow_LoadNamedFlow(flowname,oXml,flownodes){

	
	//Flow_InitDefinXmlObj(flowname,oXml);
	
	//װ��ҳ��Ĳ���
	//<position>
	//<node>
	//<id></id><name></name><nodetype></nodetype><outerhtml></outerhtml>
	//</node>
	//<node>
	//<id></id><name></name><nodetype>Result</nodetype><outerhtml></outerhtml><formnode></fromnode><tonode></tonode>
	//</node>	
	//...
	//</position>
	var dom = SetDom(flownodes);
	if (dom==null || dom.documentElement==null){
		alert("δ�ҵ����̲���λ�ã�");
		return;
	}
	var len =dom.documentElement.childNodes.length;
	var id,name,nodetype,outerhtml;
	var fromnode_id,tonode_id;
	for (var i=0;i<len; i++){
		id = dom.childNodes(0).childNodes(i).childNodes(0).text;
		name = dom.childNodes(0).childNodes(i).childNodes(1).text;
		nodetype = dom.childNodes(0).childNodes(i).childNodes(2).text;
		outerhtml =dom.childNodes(0).childNodes(i).childNodes(3).text;
		//2011-3-8 ��ӷ��ø��Ͻڵ�
		if (nodetype=="Result"){
			fromnode_id = dom.childNodes(0).childNodes(i).childNodes(4).text;
			tonode_id  = dom.childNodes(0).childNodes(i).childNodes(5).text;
			Flow_BuildResult(id,fromnode_id, tonode_id,outerhtml);
		}
		else{
			Flow_BuildActiveNode(id, name, nodetype, outerhtml);
		}
	}
	//�����������ߵ�λ�ã����ߵ�λ�û�ƫ��
	Flow_ResetResultsPosition();	

	//������������
	Flow_SetFlowAttribute(flowname,oXml); 
	
	Flow_SetWorkflowXmlToNode(oXml);
	
	// ���ù�����״̬
	Flow_SetFlowToolBarStatus();
	
	//�رձ��水ť
	Flow_NodeNotHasChanged();
	
	//�޸�ҳ���title
	Flow_ChangePageTitle(flowname);	

}
function Flow_SetWorkflowXmlToNode(oXml){	
	if (typeof oXml=="undefined" || oXml.documentElement==null) return;
	
	//��initial-actions
	var oList = oXml.getElementsByTagName("initial-actions");
	var oListChild = oList.item(i).getElementsByTagName("action");
	Flow_SetActionXmlInfoToNode(oListChild);
	
	
	//��step
	var oList = oXml.getElementsByTagName("step");
	for (var i=0;i<oList.length;i++){
		var id = oList.item(i).getAttribute("id");
		var name = oList.item(i).getAttribute("name");
		var compensate = oList.item(i).getAttribute("compensate");
		
		var oListChild = oList.item(i).selectNodes("meta");
		var metaXml="";
		for (var j=0; j<oListChild.length; j++){
			metaXml += oListChild.item(j).xml;
		}
			
		var oListChild = oList.item(i).getElementsByTagName("action");
		//Flow_SetActionXmlInfoToNode(oListChild);
		//2011-3-8 ���ӷ���ֵ
		var actionProperty = Flow_SetActionXmlInfoToNode(oListChild);
		
		var oListChild = oList.item(i).getElementsByTagName("external-permissions");
		var permissionXml="";
		if (oListChild.length>0) permissionXml = oListChild.item(0).xml;

		//��tasks
		var oListChild = oList.item(i).selectNodes("tasks");//getElementsByTagName("tasks");
		var taskXml="";
		if (oListChild.length>0) taskXml = oListChild.item(0).xml;
		
		//��pre-functions ��Ԫ��action,result���л���pre-functions
		var oListChild = oList.item(i).selectNodes("pre-functions");//getElementsByTagName("pre-functions");
		var prefunctionXml="";
		if (oListChild.length>0) prefunctionXml = oListChild.item(0).xml;
		
		var oListChild = oList.item(i).selectNodes("post-functions");//getElementsByTagName("post-functions");
		var postfunctionXml="";
		if (oListChild.length>0) postfunctionXml = oListChild.item(0).xml;
		
		var property = new NodePropertys();
		property.ID = id;
		property.Name = name;
		property.Compensate = compensate;

		property.meta = metaXml;
		property.permission = permissionXml;
		
		property.task = taskXml;
		property.prefunction = prefunctionXml;
		property.postfunction = postfunctionXml;				
		
		//���Ӹ��Ͻڵ㣬��action�Ĵ���2011-3-8 ��ȡaction id �Ƿ��Ӧ��ͼƬ�ڵ㣬��ͼƬ�ڵ㣬���property��
		if (actionProperty){
			property.ActionProperty = actionProperty;
			property.ActionID = actionProperty.ID;
		}

		var tagNode = Flow_GetFlowNodeById(id);

		if (tagNode){
			tagNode.NodePropertys= property;			
		}	
	}
	
	//��split
	var oList = oXml.getElementsByTagName("split");
	for (var i=0;i<oList.length ;i++){
		var id = oList.item(i).getAttribute("id");
		var name = oList.item(i).getAttribute("name")
		var isDynamic = oList.item(i).getAttribute("is-dynamic");
		//��ʼ�������̵Ĵ��봫������
		var oListChild = oList.item(i).getElementsByTagName("param");
		var paramsXml = "";
		for (var k=0;k<oListChild.length;k++){
			paramsXml +=oListChild.item(k).xml;
		}
		//��ʼ��<split>�ڵ������unconditional-result
		Flow_SetResultXmlInfoToNode(oList.item(i),"split");

		var oListChild = oList.item(i).getElementsByTagName("unconditional-result");
		var resultXml = "";
		for (var j=0;j<oListChild.length; j++){
			resultXml +=oListChild.item(j).xml;
		}

		var property = new NodePropertys();
		property.ID = id;
		property.Name = name;
		property.IsDynamic = isDynamic;
		if (paramsXml.length>0){
			paramsXml = "<params>" + paramsXml + "</params>";
		}
		property.params = paramsXml;
		//property.result = resultXml;//��Flow_GetResultsBySplitNode()������̬�Ļ��
		var tagNode = Flow_GetFlowNodeById(id);
		if (tagNode){
			tagNode.NodePropertys= property;
		}	
	}
	
	//��join
	var oList = oXml.getElementsByTagName("join");
	for (var i=0;i<oList.length; i++){
		var id = oList.item(i).getAttribute("id");
		var name = oList.item(i).getAttribute("name")
		var isDynamic = oList.item(i).getAttribute("is-dynamic");		
		//��ʼ��<join>�ڵ������unconditional-result
		Flow_SetResultXmlInfoToNode(oList.item(i),"join");
				
		var oListChild = oList.item(i).getElementsByTagName("conditions");
		var conditionXml = "";
		for (var j=0;j<oListChild.length; j++){
			conditionXml +=oListChild.item(j).xml;
		}

		var property = new NodePropertys();
		property.ID = id;
		property.Name = name;
		property.IsDynamic = isDynamic;
		property.condition = conditionXml;
		var tagNode = Flow_GetFlowNodeById(id);
		if (tagNode){
			tagNode.NodePropertys= property;
		}	
	}

	//��sub-flow ������
	//<sub-flow id="3456" name="ȱ��������" is-sync="1" sub-flowname="oos_flow" sub-flowdesc="ȱ���Ǽ�����" sub-flowversion="1" /> 
	var oList = oXml.getElementsByTagName("sub-flow");
	for (var i=0;i<oList.length; i++){
		var id = oList.item(i).getAttribute("id");
		var name = oList.item(i).getAttribute("name");
		var isSync = oList.item(i).getAttribute("is-sync");
		var unique = oList.item(i).getAttribute("unique");//2012-1-29
		var flowname = oList.item(i).getAttribute("sub-flowname");
		var flowdesc = oList.item(i).getAttribute("sub-flowdesc");
		var flowversion = oList.item(i).getAttribute("sub-flowversion");
		var floworig = oList.item(i).getAttribute("sub-floworig"); //ģ����Դ		
		//��ʼ�������̵Ĵ��봫������
		var oListChild = oList.item(i).getElementsByTagName("param");
		var paramsXml = "";
		for (var k=0;k<oListChild.length;k++){
			paramsXml +=oListChild.item(k).xml;
		}
		
		//��ʼ��<sub-flow>�ڵ������result(�������ĺ��������Ľ�)
		Flow_SetResultXmlInfoToNode(oList.item(i),"sub-flow");
				
		var oListChild = oList.item(i).getElementsByTagName("results");
		var resultXml = "";
		for (var j=0;j<oListChild.length; j++){
			resultXml +=oListChild.item(j).xml;
		}

/**
		if (objNodePropertys.Name)
			document.all.txtName.value = objNodePropertys.Name;
		if (objNodePropertys.IsSync=="1"){
			document.all.rdoIsSync[0].checked = true;					
		}
		else{
			document.all.rdoIsSync[1].checked = true;
		}
		
		if (objNodePropertys.SubFlowname){
			document.all.txtFlow.value = objNodePropertys.SubFlowname + "��"+ objNodePropertys.SubFlowdesc +"��" + " �汾��" + objNodePropertys.SubFlowversion;
			document.all.txtFlow.setAttribute("flowname",objNodePropertys.SubFlowname);
			document.all.txtFlow.setAttribute("flowdesc",objNodePropertys.SubFlowdesc);
			document.all.txtFlow.setAttribute("flowversion",objNodePropertys.SubFlowversion);

**/
		var property = new NodePropertys();
		property.ID = id;
		property.Name = name;
		property.IsSync = isSync;
		property.Unique = unique;
		property.SubFlowname = flowname;
		property.SubFlowdesc = flowdesc;
		property.SubFlowversion = flowversion;
		property.SubFloworig = floworig;//ģ����Դ
		
		property.result = resultXml;
		
		if (paramsXml.length>0){
			paramsXml = "<params>" + paramsXml + "</params>";
		}
		property.params = paramsXml;
		var tagNode = Flow_GetFlowNodeById(id);
		if (tagNode){
			tagNode.NodePropertys= property;
		}	
	}

}

//*************************************************************
// ���������� ��action��xml��Ϣ��ֵ��node���� 
// ���������� oList action�ڵ�list
//-------------------------------------------------------------
function Flow_SetActionXmlInfoToNode(oList){
	for (var i=0;i<oList.length;i++){		
		var id = oList.item(i).getAttribute("id");
		
		var name = oList.item(i).getAttribute("name");
		var view="";
		if (oList.item(i).getAttribute("view")!=null)
			view = unescape(oList.item(i).getAttribute("view"));
		var remark="";//�ӹ켣��ע 2011-9-16
		if (oList.item(i).getAttribute("remark")!=null)
			remark = unescape(oList.item(i).getAttribute("remark"));			
		var auto = oList.item(i).getAttribute("auto");
		var finish = oList.item(i).getAttribute("finish");
		//��useractiontype 2012-1-4
		var useractiontype = oList.item(i).getAttribute("useractiontype");
				
		var oListChild = oList.item(i).getElementsByTagName("meta");
		var bsTable ="";
		var bsIdField="";
		var bsDescField="";
		var bsRelaInstanceId="";
		
		for(var j=0;j<oListChild.length;j++){
			var attrName = oListChild.item(j).getAttribute("name");
			var attrValue = oListChild.item(j).text;
			if (attrName=="bs_table")
				bsTable = attrValue;
			if (attrName=="bs_id_field")
				bsIdField = attrValue;
			if (attrName=="bs_desc_field")
				bsDescField = attrValue;
			if (attrName=="rela_instance_id")
				bsRelaInstanceId = attrValue;
		}
		
		oListChild = oList.item(i).getElementsByTagName("restrict-to");
		var conditionXml="";
		if (oListChild.length>0) conditionXml = oListChild.item(0).xml;

		oListChild = oList.item(i).getElementsByTagName("validators");
		var validatorXml ="";
		if (oListChild.length>0) validatorXml = oListChild.item(0).xml;

		//2011-7-19 ���ӵ�access-controls�ڵ�
		oListChild = oList.item(i).selectNodes("access-controls");
		var accesscontrolXml ="";
		if (oListChild.length>0) accesscontrolXml = oListChild.item(0).xml;
		
		//2012-10-22 �ೡ��������
		oListChild = oList.item(i).selectNodes("action-forms");
		var actionFormsXml ="";
		if (oListChild.length>0) actionFormsXml = oListChild.item(0).xml;
		
		oListChild = oList.item(i).selectNodes("pre-functions");
		var prefunctionXml ="";
		if (oListChild.length>0) prefunctionXml = oListChild.item(0).xml;
		
		oListChild = oList.item(i).selectNodes("post-functions");
		var postfunctionXml ="";
		if (oListChild.length>0) postfunctionXml = oListChild.item(0).xml;
		
		oListChild = oList.item(i).getElementsByTagName("results");
		//��Result��ֵ�� ���������
		Flow_SetResultXmlInfoToNode(oListChild,"action");
	
					
		var property = new NodePropertys();
		property.ID = id;
		property.Name = name;
		property.View = view;
		property.Remark = remark;
		property.Auto = auto;
		property.Finish = finish;
		property.UserActionType = useractiontype;//2012-1-4
		
		property.bs_table = bsTable;
		property.bs_id_field = bsIdField;
		property.bs_desc_field = bsDescField;
		property.rela_instance_id = bsRelaInstanceId;
		
		//property.meta = metaXml;
		property.permission = conditionXml;
		property.validator = validatorXml;
		property.accesscontrol = accesscontrolXml;//2011-7-19 ���ӵ�access-controls�ڵ�
		property.actionForms = actionFormsXml;//2012-10-22
		property.prefunction = prefunctionXml;
		property.postfunction = postfunctionXml;		
		//property.result = resultXml;
		
		var tagNode = Flow_GetFlowNodeById(id);
		if (tagNode){
			tagNode.NodePropertys= property;
		}
		else{//2011-3-8 ���δ�ҵ����ڸ��Ͻڵ��У����Ҳ��裫������ ���Ͻڵ�
			return property;
		}			
	}	
}
//��Results����Ϣ��ֵ��ҳ������߶���
//oList: results�ڵ㣬����split�ڵ㣬����join �ڵ�
function Flow_SetResultXmlInfoToNode(oList,skey){
	var oListChild=null;
	if (skey=="action" || skey =="sub-flow"){
		//���������
		if (skey=="action")
			oListChild = oList.item(0).getElementsByTagName("result");
		if (skey =="sub-flow")	
			oListChild = oList.getElementsByTagName("result");
		//<result id="17" old-status="Finished" split="1">
		//         <conditions>
		
		for (var i=0;i<oListChild.length;i++){
			var id = oListChild.item(i).getAttribute("id");
			var oldStatus = oListChild.item(i).getAttribute("old-status");
			var status = oListChild.item(i).getAttribute("status");
			var owner = oListChild.item(i).getAttribute("owner");
			var ownerName = oListChild.item(i).getAttribute("ownername");

			var tagNode = Flow_GetFlowNodeById(id);
			if (tagNode){
				var property = new NodePropertys();
				property.ID = id;
				//property.Name = 
				if (oldStatus)	property.OldStatus = oldStatus;
				if (status) property.Status = status;
				if (owner) property.Owner = owner;
				if (ownerName) property.OwnerName = ownerName;
				//��step��split��join���Ե�����
				
				var oChild = oListChild.item(i).getElementsByTagName("conditions");
				if (oChild.length>0) property.condition = oChild.item(0).xml;
				oChild = oListChild.item(i).getElementsByTagName("pre-functions");
				if (oChild.length>0) property.prefunction = oChild.item(0).xml;
				oChild  = oListChild.item(i).getElementsByTagName("post-functions");
				if (oChild.length>0) property.postfunction = oChild.item(0).xml;
				
				tagNode.NodePropertys= property;			
			}	
		}
	}

	if (skey=="split" || skey=="join" || skey=="sub-flow"){
		//���������		
		oListChild = oList.getElementsByTagName("unconditional-result");
	}
	else{
		//���������
		oListChild = oList.item(0).getElementsByTagName("unconditional-result");
	}
	for (var i=0; i<oListChild.length ; i++){
		var id = oListChild.item(i).getAttribute("id");
		var oldStatus = oListChild.item(i).getAttribute("old-status");
		var status = oListChild.item(i).getAttribute("status");
		var owner = oListChild.item(i).getAttribute("owner");
		var ownerName = oListChild.item(i).getAttribute("ownername");

		var tagNode = Flow_GetFlowNodeById(id);
		if (tagNode){
			var property = new NodePropertys();
			property.ID = id;
			//property.Name = 
			if (oldStatus)	property.OldStatus = oldStatus;
			if (status) property.Status = status;
			if (owner) property.Owner = owner;
			if (ownerName) property.OwnerName = ownerName;

			var oChild = oListChild.item(i).getElementsByTagName("conditions");
			if (oChild.length>0) property.condition = oChild.item(0).xml;
			oChild = oListChild.item(i).getElementsByTagName("pre-functions");
			if (oChild.length>0) property.prefunction = oChild.item(0).xml;
			oChild  = oListChild.item(i).getElementsByTagName("post-functions");
			if (oChild.length>0) property.postfunction = oChild.item(0).xml;
			
			tagNode.NodePropertys= property;		
		}	
	}
	
}
//*************************************************************
// ���������� ͨ��id����FlowArea.FlowNodes.Nodes[]����
// ���������� oList action�ڵ�list
//-------------------------------------------------------------
function Flow_GetFlowNodeById(strId){
	var tagObj = null;
	var nodes = FlowArea.FlowNodes.Nodes;
	var len = nodes.length;
	for (var i=0;i<len;i++){
		if (nodes[i].id && nodes[i].id==strId){
			tagObj = nodes[i];
			break;
		}
		
	}
	return tagObj;
}	
//*************************************************************
// ���������� �����������
// ���������� ��
//-------------------------------------------------------------
function Flow_ClearNowFlow(){
	// �ж��Ƿ��Ѿ���������
	//if (FlowArea.FlowNodes.Nodes.length > 0)
	if (bActiveNodeChange)
	{
		if (confirm("�Ƿ�Ҫ���浱ǰ�����̣��ٴ��µ����̣�"))
		{
			// ��������
			Flow_SaveFlow();
			//return;
		}
	}
	// �����ǰ����
	Flow_RemoveAllActiveNode();
	//********************* start ****************************************
	//�����ǰ���̵�����
	Flow_RemoveFlowAttributes();
	
	//��������֧�ϲ�����
	Flow_ClearStepSplitJoinAction();

	//�����ʷ����	
	Flow_ClearOperations();
	//���ù������༭״̬
	Flow_SetFlowToolBarEditStatus();
	//------------------------ end -------------------------------------
}


//*************************************************************
// ���������� ��ʼ�����̶����ļ� xml δʹ��
// ���������� ��
//-------------------------------------------------------------
function Flow_InitDefinXmlObj(flowname,oXml){
//	var oXml=new ActiveXObject("Microsoft.XMLDOM");
//	oXml.async=false;
//	if (filename)
//		oXml.load("http://localhost/desinger/leave_apply.xml");
	//��ʼ��xml
	Flow_SetFlowAttribute(flowname,oXml); //����������ʱ��������̵İ汾��
	//Flow_SetActionDom(oXml);
	//Flow_SetStepDom(oXml);
	//Flow_SetSplitDom(oXml);
	//Flow_SetJoinDom(oXml);
}
//*************************************************************
// ���������� ��ʼ�����̵�����
// ���������� ��
//-------------------------------------------------------------
function Flow_SetFlowAttribute(FlowName,oXml){
		//var oAttribute = new FlowAttributes();
		//oAttribute.FlowName = FlowName;
		//oAttribute.FlowVersion = flowversion;
		if (typeof(oXml)=="undefined" || oXml==null) return;
		if (oXml.documentElement==null) return;
		var oMetas = oXml.selectNodes("workflow/meta");		
		for (var i=0;i<oMetas.length;i++){
			var attrName = oMetas(i).getAttribute("name");
			var attrValue = oMetas(i).text;
			if (attrName =="bs_table") FlowArea.FlowAttributes.bs_table = attrValue;
			if (attrName =="bs_id_field") FlowArea.FlowAttributes.bs_id_field = attrValue;
			if (attrName =="bs_desc_field") FlowArea.FlowAttributes.bs_desc_field = attrValue;
			if (attrName =="bs_instanceid_field") FlowArea.FlowAttributes.bs_instanceid_field = attrValue;//2012-1-31
		}
		
		
		//ע����
		var oList = oXml.getElementsByTagName("register");
		if (oList.length>0)	FlowArea.FlowAttributes.register =  oList.item(0).xml ;
		//������
		oList =  oXml.getElementsByTagName("trigger-functions");
		if (oList.length>0) FlowArea.FlowAttributes.trigger = oList.item(0).xml;
		
		
		//FlowArea.FlowAttributes = oAttribute;
}		

//*************************************************************
// ���������� ���ò���
// ���������� ��
//-------------------------------------------------------------
function Flow_SetStepDom(oXml){
	var _Steps = new Flow_DefinSteps();
	_Steps.Steps = new Array();
	FlowArea.DefinSteps = _Steps;
	if (typeof oXml=="undefined") return;
	var oSteps = oXml.getElementsByTagName("steps");
	if (oSteps.length<=0) return 
	var stepList = oSteps.item(0).getElementsByTagName("step");
	for (var i=0;i<stepList.length;i++){
		var step = new Flow_Step();
		step.id = stepList.item(i).getAttribute("id");
		step.xml = stepList.item(i).xml;
		FlowArea.DefinSteps.Steps[i] = step;
	}
	
}
//*************************************************************
// ���������� ���ö���
// ���������� ��
//-------------------------------------------------------------
function Flow_SetActionDom(oXml){
	var _Actions = new Flow_DefinActions();
	_Actions.Actions = new Array();
	FlowArea.DefinActions = _Actions;
	
	if (typeof oXml=="undefined") return;
	var actionList = oXml.getElementsByTagName("action");
	for (var i=0;i<actionList.length;i++){			
		var action = new Flow_Action();		
		action.id =  actionList.item(i).getAttribute("id");
		var oParent = actionList.item(i).parentNode;
		action.isInit = false;
		if (oParent.nodeName=="initial-actions"){ 			
			action.isInit = true;
			action.parentNodeId = "";
		}	
		if (oParent.nodeName =="step"){			
			action.parentNodeId = oParent.getAttribute("id");
		}
		action.xml = actionList.item(i).xml;
			
		FlowArea.DefinActions.Actions[i] = action;
		
	}		
}

//*************************************************************
// ���������� ���÷�֧
// ���������� ��
//-------------------------------------------------------------
function Flow_SetSplitDom(oXml){
	var _Splits = new Flow_DefinSplits();
	_Splits.Splits = new Array();
	FlowArea.DefinSplits = _Splits;
	
	if (typeof oXml=="undefined") return;
	var splitList = oXml.getElementsByTagName("split");
	for (var i=0;i<splitList.length;i++){			
		var split = new Flow_Split();		
		split.id =  actionList.item(i).getAttribute("id");
		split.xml = splitList.item(i).xml;			
		FlowArea.DefinSplits.Splits[i] = split;
	}	

}

//*************************************************************
// ���������� ���úϲ�
// ���������� ��
//-------------------------------------------------------------
function Flow_SetJoinDom(oXml){
	var _Joins = new Flow_DefinJoins();
	_Joins.Joins = new Array();
	FlowArea.DefinJoins = _Joins;
	
	if (typeof oXml=="undefined") return;
	var joinList = oXml.getElementsByTagName("join");
	for (var i=0;i<joinList.length;i++){			
		var join = new Flow_Join();		
		join.id =  joinList.item(i).getAttribute("id");
		join.xml = joinList.item(i).xml;			
		FlowArea.DefinJoins.Joins[i] = join;

	}	
}//*************************************************************
// ���������� �������в�����
// ���������� ��
//-------------------------------------------------------------
function Flow_DefinSteps(){}
function Flow_Step(){}
//*************************************************************
// ���������� ���涯����
// ���������� ��
//-------------------------------------------------------------
function Flow_DefinActions(){}
function Flow_Action(){}
//*************************************************************
// ���������� �����֧��
// ���������� ��
//-------------------------------------------------------------
function Flow_DefinSplits(){}
function Flow_Split(){}
//*************************************************************
// ���������� ����ϲ���
// ���������� ��
//-------------------------------------------------------------
function Flow_DefinJoins(){}
function Flow_Join(){}

function Flow_ClearStepSplitJoinAction(){
	
}
//*************************************************************
// ���������� ��ʼ�������֧���ϲ��������ȵ�����
// ���������� ��
//-------------------------------------------------------------
function Flow_InitStepDom(oXml){
	
}



