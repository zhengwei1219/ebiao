function Flow_OpenWindow(){
	var flowname ="";
	var flowdesc = "";
	var flowversion = "";
	var flowsavetype = "database";
	var flowrun = "定义";
		
	try{
		/* 用index框架页的时候用
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
	    flowrun = "定义";	
	}

	var strOperate = "flow_getdataxml";
	if (flowsavetype=="xmlfile")
		strOperate = "flow_getfilexml";
		
	var strUp ="";
	if (typeof(flowname)!="undefined" && flowname!=""){
	
		strUp +="<root>"
		strUp +="<flowname>"+ flowname + "</flowname>";  //流程名称
		strUp +="<flowversion>"+ flowversion + "</flowversion>";  //流程版本
		strUp +="<curopenfile></curopenfile>";//当前打开的流程文件 TODO
		strUp +="</root>";
	
		var strReturn=SendHttp(fcpubdata.servletPath + "/DesignerServlet"+fcpubdata.dotnetVersion+"?operate=" + strOperate,strUp);	

		var oXml = SetDom(strReturn);
		if (oXml.documentElement==null){
			alert("流程定义"+ flowname +"格式有错，不能打开！");
			return;
		}
		
		if (oXml.childNodes(0).childNodes(0).text=="false"){
			alert(oXml.childNodes(0).childNodes(1).text);
			return;
		}	
		var flowtype = oXml.childNodes(0).childNodes(1).text; //模版分类id
		var descriptor = oXml.childNodes(0).childNodes(2).xml; //返回的流程xml内容
		var oDescriptor = SetDom(descriptor);
		var flownodes = oXml.childNodes(0).childNodes(3).xml; //FlowArea.FlowNodes.Nodes对象节点值
		flowrun = oXml.childNodes(0).childNodes(4).text;//修改成从后台获取，不从页面传递 模版状态
	
		// 恢复设置按钮的状态
		//FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
		FlowArea.style.cursor = "default";
		Flow_SetCurrentTool("None");
		// 设置FlowArea下面全部元素鼠标样式
		Flow_SetCursorStyle("");
				
		Flow_ClearNowFlow();
		
		var oAttribute = new FlowAttributes();
		
		oAttribute.FlowName = flowname;
		oAttribute.FlowDesc = flowdesc;
		oAttribute.FlowSaveType = flowsavetype;
		oAttribute.FlowVersion = flowversion;
		oAttribute.FlowRUN = flowrun;
		oAttribute.FlowDefsType = flowtype;//模版分类id
		FlowArea.FlowAttributes = oAttribute;

		//装入流程
		Flow_LoadNamedFlow(flowname,oDescriptor,flownodes);			
		
	}

	

}
function Flow_OpenData(){
	//Flow_ClearNowFlow();
	var objReturn = window.showModalDialog(fcpubdata.Path + "/fceform/common/djframe.htm?djsn=wf_db_list&djtype=WF_DSN", window, "dialogHeight:570px; dialogWidth:680px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes");
	//var objReturn = window.showModalDialog("FlowDataList.htm", window, "dialogHeight:580px; dialogWidth:500px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes;dialogLeft:260;dialogTop:353");
	
	// 恢复设置按钮的状态
	FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
	FlowArea.style.cursor = "default";
	Flow_SetCurrentTool("None");
	// 设置FlowArea下面全部元素鼠标样式
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
	var flowtype = objReturn[6];//模版分类id
	
	var oAttribute = new FlowAttributes();
	
	oAttribute.FlowName = flowname;
	oAttribute.FlowDesc = flowdesc;
	oAttribute.FlowSaveType = "database";
	oAttribute.FlowVersion = version;
	oAttribute.FlowRUN = flowrun;
	oAttribute.FlowDefsType = flowtype;//模版分类id
	FlowArea.FlowAttributes = oAttribute;

	//装入流程
	Flow_LoadNamedFlow(flowname,oXml,flownodes);

}
function Flow_OpenFile(){
	
	//var oDom = SetDomFile("http://localhost/desinger/aa.xml");
	var objReturn = window.showModalDialog(fcpubdata.Path + "/fceform/common/djframe.htm?djsn=wf_xml_list&djtype=WF_DSN", window, "dialogHeight:570px; dialogWidth:680px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes");
	//var objReturn = window.showModalDialog("FlowFileList.htm", window, "dialogHeight:580px; dialogWidth:500px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes;dialogLeft:260;dialogTop:353");
	
	// 恢复设置按钮的状态
	FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
	FlowArea.style.cursor = "default";
	Flow_SetCurrentTool("None");
	// 设置FlowArea下面全部元素鼠标样式
	Flow_SetCursorStyle("");

	if (objReturn==null) return;
	
	Flow_ClearNowFlow();
	var flowname = objReturn[0];
	var flowdesc = objReturn[1];
	var oXml = SetDom(objReturn[2]);
	var flownodes = objReturn[3]; //FlowArea.FlowNodes.Nodes
	var version = objReturn[4]; 
	var flowrun = objReturn[5];
	var flowtype = objReturn[6];//模版分类id
	
	var oAttribute = new FlowAttributes();
	
	oAttribute.FlowName = flowname;
	oAttribute.FlowDesc = flowdesc;
	oAttribute.FlowSaveType = "xmlfile";
	oAttribute.FlowVersion = version;
	oAttribute.FlowRUN = flowrun;
	oAttribute.FlowDefsType = flowtype;//模版分类id
	FlowArea.FlowAttributes = oAttribute;
	
	//装入流程
	Flow_LoadNamedFlow(flowname,oXml,flownodes);


	
}
//*************************************************************
// 功能描述： 装入指定的流程内容
// 参数描述： flowname流程名， oXml流程定义内容，flownodes流程的设计界面位置信息
//-------------------------------------------------------------

function Flow_LoadNamedFlow(flowname,oXml,flownodes){

	
	//Flow_InitDefinXmlObj(flowname,oXml);
	
	//装入页面的布局
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
		alert("未找到流程布局位置！");
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
		//2011-3-8 添加放置复合节点
		if (nodetype=="Result"){
			fromnode_id = dom.childNodes(0).childNodes(i).childNodes(4).text;
			tonode_id  = dom.childNodes(0).childNodes(i).childNodes(5).text;
			Flow_BuildResult(id,fromnode_id, tonode_id,outerhtml);
		}
		else{
			Flow_BuildActiveNode(id, name, nodetype, outerhtml);
		}
	}
	//重新设置连线的位置，连线的位置会偏移
	Flow_ResetResultsPosition();	

	//设置流程属性
	Flow_SetFlowAttribute(flowname,oXml); 
	
	Flow_SetWorkflowXmlToNode(oXml);
	
	// 设置工具栏状态
	Flow_SetFlowToolBarStatus();
	
	//关闭保存按钮
	Flow_NodeNotHasChanged();
	
	//修改页面的title
	Flow_ChangePageTitle(flowname);	

}
function Flow_SetWorkflowXmlToNode(oXml){	
	if (typeof oXml=="undefined" || oXml.documentElement==null) return;
	
	//找initial-actions
	var oList = oXml.getElementsByTagName("initial-actions");
	var oListChild = oList.item(i).getElementsByTagName("action");
	Flow_SetActionXmlInfoToNode(oListChild);
	
	
	//找step
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
		//2011-3-8 增加返回值
		var actionProperty = Flow_SetActionXmlInfoToNode(oListChild);
		
		var oListChild = oList.item(i).getElementsByTagName("external-permissions");
		var permissionXml="";
		if (oListChild.length>0) permissionXml = oListChild.item(0).xml;

		//找tasks
		var oListChild = oList.item(i).selectNodes("tasks");//getElementsByTagName("tasks");
		var taskXml="";
		if (oListChild.length>0) taskXml = oListChild.item(0).xml;
		
		//找pre-functions 子元素action,result等中还有pre-functions
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
		
		//增加复合节点，对action的处理2011-3-8 获取action id 是否对应了图片节点，无图片节点，则放property中
		if (actionProperty){
			property.ActionProperty = actionProperty;
			property.ActionID = actionProperty.ID;
		}

		var tagNode = Flow_GetFlowNodeById(id);

		if (tagNode){
			tagNode.NodePropertys= property;			
		}	
	}
	
	//找split
	var oList = oXml.getElementsByTagName("split");
	for (var i=0;i<oList.length ;i++){
		var id = oList.item(i).getAttribute("id");
		var name = oList.item(i).getAttribute("name")
		var isDynamic = oList.item(i).getAttribute("is-dynamic");
		//初始化子流程的传入传出参数
		var oListChild = oList.item(i).getElementsByTagName("param");
		var paramsXml = "";
		for (var k=0;k<oListChild.length;k++){
			paramsXml +=oListChild.item(k).xml;
		}
		//初始化<split>节点下面的unconditional-result
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
		//property.result = resultXml;//由Flow_GetResultsBySplitNode()函数动态的获得
		var tagNode = Flow_GetFlowNodeById(id);
		if (tagNode){
			tagNode.NodePropertys= property;
		}	
	}
	
	//找join
	var oList = oXml.getElementsByTagName("join");
	for (var i=0;i<oList.length; i++){
		var id = oList.item(i).getAttribute("id");
		var name = oList.item(i).getAttribute("name")
		var isDynamic = oList.item(i).getAttribute("is-dynamic");		
		//初始化<join>节点下面的unconditional-result
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

	//找sub-flow 子流程
	//<sub-flow id="3456" name="缺货子流程" is-sync="1" sub-flowname="oos_flow" sub-flowdesc="缺货登记流程" sub-flowversion="1" /> 
	var oList = oXml.getElementsByTagName("sub-flow");
	for (var i=0;i<oList.length; i++){
		var id = oList.item(i).getAttribute("id");
		var name = oList.item(i).getAttribute("name");
		var isSync = oList.item(i).getAttribute("is-sync");
		var unique = oList.item(i).getAttribute("unique");//2012-1-29
		var flowname = oList.item(i).getAttribute("sub-flowname");
		var flowdesc = oList.item(i).getAttribute("sub-flowdesc");
		var flowversion = oList.item(i).getAttribute("sub-flowversion");
		var floworig = oList.item(i).getAttribute("sub-floworig"); //模版来源		
		//初始化子流程的传入传出参数
		var oListChild = oList.item(i).getElementsByTagName("param");
		var paramsXml = "";
		for (var k=0;k<oListChild.length;k++){
			paramsXml +=oListChild.item(k).xml;
		}
		
		//初始化<sub-flow>节点下面的result(有条件的和无条件的结)
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
			document.all.txtFlow.value = objNodePropertys.SubFlowname + "（"+ objNodePropertys.SubFlowdesc +"）" + " 版本：" + objNodePropertys.SubFlowversion;
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
		property.SubFloworig = floworig;//模版来源
		
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
// 功能描述： 将action的xml信息赋值到node对象 
// 参数描述： oList action节点list
//-------------------------------------------------------------
function Flow_SetActionXmlInfoToNode(oList){
	for (var i=0;i<oList.length;i++){		
		var id = oList.item(i).getAttribute("id");
		
		var name = oList.item(i).getAttribute("name");
		var view="";
		if (oList.item(i).getAttribute("view")!=null)
			view = unescape(oList.item(i).getAttribute("view"));
		var remark="";//加轨迹备注 2011-9-16
		if (oList.item(i).getAttribute("remark")!=null)
			remark = unescape(oList.item(i).getAttribute("remark"));			
		var auto = oList.item(i).getAttribute("auto");
		var finish = oList.item(i).getAttribute("finish");
		//加useractiontype 2012-1-4
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

		//2011-7-19 增加的access-controls节点
		oListChild = oList.item(i).selectNodes("access-controls");
		var accesscontrolXml ="";
		if (oListChild.length>0) accesscontrolXml = oListChild.item(0).xml;
		
		//2012-10-22 多场景表单链接
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
		//找Result赋值给 下面的连线
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
		property.accesscontrol = accesscontrolXml;//2011-7-19 增加的access-controls节点
		property.actionForms = actionFormsXml;//2012-10-22
		property.prefunction = prefunctionXml;
		property.postfunction = postfunctionXml;		
		//property.result = resultXml;
		
		var tagNode = Flow_GetFlowNodeById(id);
		if (tagNode){
			tagNode.NodePropertys= property;
		}
		else{//2011-3-8 如果未找到则在复合节点中，查找步骤＋动作的 复合节点
			return property;
		}			
	}	
}
//将Results的信息赋值给页面的连线对象
//oList: results节点，或者split节点，或者join 节点
function Flow_SetResultXmlInfoToNode(oList,skey){
	var oListChild=null;
	if (skey=="action" || skey =="sub-flow"){
		//有条件结果
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
				//无step或split或join属性的设置
				
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
		//无条件结果		
		oListChild = oList.getElementsByTagName("unconditional-result");
	}
	else{
		//无条件结果
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
// 功能描述： 通过id返回FlowArea.FlowNodes.Nodes[]对象
// 参数描述： oList action节点list
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
// 功能描述： 清空现有流程
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ClearNowFlow(){
	// 判断是否已经存在流程
	//if (FlowArea.FlowNodes.Nodes.length > 0)
	if (bActiveNodeChange)
	{
		if (confirm("是否要保存当前的流程，再打开新的流程？"))
		{
			// 保存流程
			Flow_SaveFlow();
			//return;
		}
	}
	// 清除当前流程
	Flow_RemoveAllActiveNode();
	//********************* start ****************************************
	//清除当前流程的属性
	Flow_RemoveFlowAttributes();
	
	//清除步骤分支合并动作
	Flow_ClearStepSplitJoinAction();

	//清除历史操作	
	Flow_ClearOperations();
	//设置工具栏编辑状态
	Flow_SetFlowToolBarEditStatus();
	//------------------------ end -------------------------------------
}


//*************************************************************
// 功能描述： 初始化流程定义文件 xml 未使用
// 参数描述： 无
//-------------------------------------------------------------
function Flow_InitDefinXmlObj(flowname,oXml){
//	var oXml=new ActiveXObject("Microsoft.XMLDOM");
//	oXml.async=false;
//	if (filename)
//		oXml.load("http://localhost/desinger/leave_apply.xml");
	//初始化xml
	Flow_SetFlowAttribute(flowname,oXml); //打开现有流程时传入打开流程的版本号
	//Flow_SetActionDom(oXml);
	//Flow_SetStepDom(oXml);
	//Flow_SetSplitDom(oXml);
	//Flow_SetJoinDom(oXml);
}
//*************************************************************
// 功能描述： 初始化流程的属性
// 参数描述： 无
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
		
		
		//注册器
		var oList = oXml.getElementsByTagName("register");
		if (oList.length>0)	FlowArea.FlowAttributes.register =  oList.item(0).xml ;
		//触发器
		oList =  oXml.getElementsByTagName("trigger-functions");
		if (oList.length>0) FlowArea.FlowAttributes.trigger = oList.item(0).xml;
		
		
		//FlowArea.FlowAttributes = oAttribute;
}		

//*************************************************************
// 功能描述： 设置步骤
// 参数描述： 无
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
// 功能描述： 设置动作
// 参数描述： 无
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
// 功能描述： 设置分支
// 参数描述： 无
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
// 功能描述： 设置合并
// 参数描述： 无
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
// 功能描述： 保存所有步骤类
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DefinSteps(){}
function Flow_Step(){}
//*************************************************************
// 功能描述： 保存动作类
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DefinActions(){}
function Flow_Action(){}
//*************************************************************
// 功能描述： 保存分支类
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DefinSplits(){}
function Flow_Split(){}
//*************************************************************
// 功能描述： 保存合并类
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DefinJoins(){}
function Flow_Join(){}

function Flow_ClearStepSplitJoinAction(){
	
}
//*************************************************************
// 功能描述： 初始化步骤分支，合并，动作等的属性
// 参数描述： 无
//-------------------------------------------------------------
function Flow_InitStepDom(oXml){
	
}



