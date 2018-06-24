//*************************************************************
// 功能描述： 下载流程
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DownloadFlow()
{
	var oAttribute = FlowArea.FlowAttributes;
	
	if (oAttribute==null || typeof(oAttribute)=="undefined" ){		
		alert("请先保存流程文件到文件目录，再下载！");
		return false;
	}
	
	var flowname = oAttribute.FlowName ;
	var flowversion = oAttribute.FlowVersion ;
	var flowsavetype = oAttribute.FlowSaveType;
	if (typeof(flowname)=="undefined" || flowname==""){		
		alert("请先保存流程文件到文件目录，再下载！");
		return false;
	}
	var sPath = fcpubdata.Path + "/designfile/" + flowname + "." + flowversion + ".xml";
	window.open(sPath,"","");

}


//*************************************************************
// 功能描述： 流程校验
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CheckFlow(bNotShowSuccessInfo)
{
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		// 设置当前对象为活动状态
		Flow_SetCurrentActiveNode(objs[i]);

		var strNodeTypeName = Flow_GetNodeDefaultName(objs[i].NodeType);
		// 分支节点不能只有一个流出方向
		//if(objs[i].NodeType == "SplitNode")
		//{
		//	if (Flow_CheckSplitNode(objs[i]))
		//	{
		//		alert("类型:【"+ strNodeTypeName +"】 \n名称:【"+ objs[i].Name +"】\n信息: 不能只有一个流出方向！");				
		//		return false;
		//	}
		//}
		// 除开始节点外不能没有流入方向的节点
		if(objs[i].NodeType != "StartNode" && objs[i].NodeType != "Result")
		{
			if (Flow_CheckPourAndOut(objs[i], "Pour"))
			{
				alert("类型:【"+ strNodeTypeName +"】 \n名称:【"+ objs[i].Name +"】\n信息: 不能没有流入方向！");
				return false;
			}
		}
		// 除结束节点外不能没有流出方向的节点
		if(objs[i].NodeType != "EndNode" && objs[i].NodeType != "Result")
		{
			if (Flow_CheckPourAndOut(objs[i], "Out"))
			{
				alert("类型:【"+ strNodeTypeName +"】 \n名称:【"+ objs[i].Name +"】\n信息: 不能没有流出方向！");
				return false;
			}
		}
		//步骤节点 流出方向 必须 是action节点  step->action->step | step->action->split | step->action->join | split->step | join->step | split->split | split->join | join->join
		if (objs[i].NodeType == "StartNode" || objs[i].NodeType == "StepNode") {
			if ( Flow_CheckNodeResultNode(objs[i])){
				alert("类型:【"+ strNodeTypeName +"】 \n名称:【"+ objs[i].Name +"】\n信息: 只能与动作节点相连，不能与其它类型的节点相连线！");
				return false;			
			}
		}
		//split 流出方向 不能是action节点
		//join 流出方向 不能是action节点
		if (objs[i].NodeType == "SplitNode" || objs[i].NodeType == "JoinNode") {
			if ( Flow_CheckSplitAndJoinNode(objs[i])){
				alert("类型:【"+ strNodeTypeName +"】 \n名称:【"+ objs[i].Name +"】\n信息: 不能与动作节点相连线！");
				return false;			
			}
		}
		
	}
	
	// 是否显示成功信息
	if (!bNotShowSuccessInfo)
	{
		alert("流程校验成功！")
	}	

	return true;

}
//*************************************************************
// 功能描述： 检查node发出的连线对象，是否为ActionNode
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CheckSplitAndJoinNode(node){
	var nodes = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < nodes.length; i++){
		if(nodes[i].NodeType == "Result" && nodes[i].FromNode == node.id ){		
			if (nodes[i].ToNode && document.getElementById(nodes[i].ToNode).NodeType=="ActionNode"){
				
				return true;
			}	
		}
	}
	return false;
}

//*************************************************************
// 功能描述： 检查node发出的连线对象，是否为ActionNode
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CheckNodeResultNode(node)
{
	var nodes = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < nodes.length; i++)
	{		
		if(nodes[i].NodeType == "Result" && nodes[i].FromNode == node.id )
		{
			if (nodes[i].ToNode && document.getElementById(nodes[i].ToNode).NodeType!="ActionNode"){
				
				return true;
			}	
		}
	}
	return false;
}
//*************************************************************
// 功能描述： 进行流程模拟仿真
// 参数描述： 无
//-------------------------------------------------------------
function Flow_StartFlowSimulation()
{
	// 校验流程
	if (Flow_CheckFlow(true))
	{
		G_StopSimulation = false;
		// 流程模拟仿真开始
		Flow_Simulation();
	}
}

//*************************************************************
// 功能描述： 流程模拟仿真
// 参数描述： 无
//-------------------------------------------------------------
var objFlowTime = null;
var G_StopSimulation = false;
function Flow_Simulation(objNextNodeList)
{
	if (!G_StopSimulation)
	{
		// 从开始节点开始
		if (!objNextNodeList)
		{
			// 搜索开始节点
			var objs = FlowArea.FlowNodes.Nodes;
			for(var i = 0; i < objs.length; i++)
			{
				var obj = objs[i];
				// 从开始节点开始
				if (obj.NodeType == "StartNode")
				{
					// 间隔1秒钟后执行对应过程
					objFlowTime = setTimeout("Flow_ShowCurrentFlowMovingInfo('"+ obj.id +"')", 1000);
					return;
				}
			}
		}
		// 处理依次叙流转的对象
		if (objNextNodeList)
		{
			// 处理依次叙流转的连接线对象
			if (objNextNodeList.length == 1 && objNextNodeList[0].NodeType != "Result")
			{
				// 间隔1秒钟后执行对应过程
				objFlowTime = setTimeout("Flow_ShowCurrentFlowMovingInfo('"+ objNextNodeList[0].id +"')", 1000);
			}
			else
			{
				for (var i = 0; i < objNextNodeList.length; i++)
				{
					// 间隔1秒钟后执行对应过程
					objFlowTime = setTimeout("Flow_ShowCurrentFlowMovingInfo('"+ objNextNodeList[i].id +"')", 1000);
				}
			}
		}
	}
}

//*************************************************************
// 功能描述： 显示当前流转节点模拟信息
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowCurrentFlowMovingInfo(strNodeId)
{
	if (!G_StopSimulation)
	{
		var obj = document.getElementById(strNodeId);
		if (obj)
		{
			// 设置当前对象为活动状态
			Flow_SetCurrentActiveNode(obj);
			// 画出流转示意框
			Flow_DrawMovingHintChart(obj);
			// 取得后面的对象
			var objNextNodeList = new Array();
			objNextNodeList = Flow_GetNextNodeList(obj);
			// 如果还有后面的对象则继续流转
			if (objNextNodeList.length)
			{
				// 嵌套执行
				Flow_Simulation(objNextNodeList);
			}
			else
			{
				// 到此流程运转模拟部分结束
				alert("流程运转模拟结束！");
				// 清除临时示意图
				Flow_ClearMovingHintChart();
			}
		}
	}
}

//*************************************************************
// 功能描述： 取得后面的对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetNextNodeList(obj)
{
	var objNextNodeList = new Array();
	var intIndex = 0;
	if (obj)
	{
		// 找出动作连线的指向对象
		if (obj.NodeType == "Result")
		{
			var objs = FlowArea.FlowNodes.Nodes;
			for(var i = 0; i < objs.length; i++)
			{
				if (objs[i].id == obj.ToNode)
				{
					objNextNodeList[0] = objs[i];
					return objNextNodeList;
				}
			}
		}
		// 找出节点的的流出动作连线
		else
		{
			var objs = FlowArea.FlowNodes.Nodes;
			for(var i = 0; i < objs.length; i++)
			{
				if (objs[i].FromNode == obj.id)
				{
					objNextNodeList[intIndex] = objs[i];
					intIndex++;
				}
			}
		}
	}

	return objNextNodeList
}

//*************************************************************
// 功能描述： 画出流转示意信息
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DrawMovingHintChart(obj)
{
	if (obj.NodeType != "Result")
	{
		// 显示设置节点信息
		Flow_ShowActiveNodeInfo(obj);
	}
	// 画出流转示意框
	Flow_DrawMovingHintRetangle(obj);
}

//*************************************************************
// 功能描述： 画出流转示意框
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DrawMovingHintRetangle(obj)
{
	if (obj.NodeType == "Result")
	{
		obj.strokeweight = 1.2;
	}
	else
	{
		var rect = document.createElement("<v:rect/>");
		rect.id = "FlowWebEntity";
		rect.style.position = "absolute";
		rect.style.visibility = 'visible';
		rect.style.zIndex = 90000000;

		var fill = document.createElement("<v:fill opacity=0.20 color='#00CC00'></v:fill>");
		var stroke = document.createElement("<v:stroke dashstyle='dash' color='#CC0000'></v:fill>");

		FlowArea.appendChild(rect);

		rect.appendChild(fill);		
		rect.appendChild(stroke);

		rect.style.top = obj.style.pixelTop - 3;
		rect.style.left = obj.style.pixelLeft - 3;
		rect.style.width = obj.style.pixelWidth + 8;
		rect.style.height = obj.style.pixelHeight + 8;
	}
}

//*************************************************************
// 功能描述： 清除临时示意图
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ClearMovingHintChart()
{
	try
	{
		// 清除示意框
		if (FlowWebEntity)
		{
			if (FlowWebEntity.length)
			{
				var intCount = FlowWebEntity.length;
				for (var i = 0; i < intCount -1; i++)
				{
					FlowArea.removeChild(FlowWebEntity[0]);
				}
				FlowArea.removeChild(FlowWebEntity);//移走最后一个2012-11-8
			}
			else
			{
				FlowArea.removeChild(FlowWebEntity);
			}
		}
		// 设置动作连线的粗细
		var objs = FlowArea.FlowNodes.Nodes;
		for(var i = 0; i < objs.length; i++)
		{
			var obj = objs[i];
			// 从开始节点开始
			if (obj.NodeType == "Result")
			{
				obj.strokeweight = 0;
			}
		}

		// 是否停止模拟
		G_StopSimulation = true;
		clearTimeout(objFlowTime);
		// 关闭节点信息显示层
		Flow_CloseActiveNodeInfo();
	}
	catch(wError){}
}

//*************************************************************
// 功能描述： 提交流程
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SaveFlow()
{
	if (!bActiveNodeChange) return;
	// 校验流程
	if (!Flow_CheckFlow(true)) return;
	
	//--------------------------------------------------------------------
	var strXml="";
	var strWorkflow="";
	var strWorkflowDesc="";
	var strFlowRun = "定义";
	var strDefsType = "";//模版分类id
	if (FlowArea.FlowAttributes){
		if(typeof FlowArea.FlowAttributes.bs_table!="undefined")
			strXml+="<meta name=\"bs_table\">" +  FlowArea.FlowAttributes.bs_table +"</meta>";
		else	
			strXml+="<meta name=\"bs_table\"></meta>";
		if(typeof FlowArea.FlowAttributes.bs_id_field!="undefined")
			strXml+="<meta name=\"bs_id_field\">" +  FlowArea.FlowAttributes.bs_id_field +"</meta>";
		else
			strXml+="<meta name=\"bs_id_field\"></meta>";
		if(typeof FlowArea.FlowAttributes.bs_desc_field!="undefined")
			strXml+="<meta name=\"bs_desc_field\">" +  FlowArea.FlowAttributes.bs_desc_field +"</meta>";
		else
			strXml+="<meta name=\"bs_desc_field\"></meta>";	
		if(typeof(FlowArea.FlowAttributes.bs_instanceid_field)!="undefined"
			&& FlowArea.FlowAttributes.bs_instanceid_field.length>0){ //2012-1-31
			strXml+="<meta name=\"bs_instanceid_field\">" +  FlowArea.FlowAttributes.bs_instanceid_field +"</meta>";
		}				
		//register
		if (typeof(FlowArea.FlowAttributes.register)!="undefined")
			strXml +=FlowArea.FlowAttributes.register;
		//trigger-function
		if (typeof(FlowArea.FlowAttributes.trigger)!="undefined")
			strXml +=FlowArea.FlowAttributes.trigger;
		
		strWorkflow = FlowArea.FlowAttributes.FlowName;
		strWorkflowDesc = FlowArea.FlowAttributes.FlowDesc;
		strFlowRun = FlowArea.FlowAttributes.FlowRUN;
		if(typeof FlowArea.FlowAttributes.FlowDefsType!="undefined")
			strDefsType = FlowArea.FlowAttributes.FlowDefsType;//模版分类id
	}
	if (strWorkflow==""){
		alert("请在流程属性窗口设置流程名称，然后再保存！");
		return;
	}
	//检查  发布状态的流程 不能修改 2011-2-11
	//alert(strFlowRun);
	if (strFlowRun=="发布"){
		alert("处于发布状态的流程不能再次修改，请增加流程的版本或将状态修改成定义后，才可以保存！");
		return;
	}
	
	//FlowArea.FlowNodes.Nodes[].NodeProperty 里面保存流程定义属性
	strXml +=Flow_GetWorkflowXmlInfo(); //流程定义信息
	
	var strUp="<root>" 
	var flowSaveType="database";	
	if (typeof FlowArea.FlowAttributes.FlowSaveType!="undefined")
		flowSaveType =FlowArea.FlowAttributes.FlowSaveType;
	var flowVersion="-1";
	if (typeof FlowArea.FlowAttributes.FlowSaveType!="undefined")
		flowVersion =FlowArea.FlowAttributes.FlowVersion;


	strUp +="<workflow_savetype>" + flowSaveType + "</workflow_savetype>"; //流程保存方式
	strUp +="<workflow_name>" + strWorkflow + "</workflow_name>"; //流程名称
	strUp +="<workflow_desc>" + strWorkflowDesc + "</workflow_desc>"; //流程描述
	strUp +="<workflow_version>" +flowVersion + "</workflow_version>"; //流程版本 -1表示新建一个最大版本号的流程
	strUp +="<workflow_defstype>" + strDefsType + "</workflow_defstype>"; //模版分类id		
	//strUp +="<workflow><![CDATA[" + strXml + "]]></workflow>";//流程节点	??不能用CDATA，节点里面包含了这种TODO
	strUp +="<workflow>" + strXml + "</workflow>";//流程节点	??不能用CDATA，节点里面包含了这种TODO


	//<position>
	//<node>
	//<id></id><name></name><nodetype></nodetype><outerhtml></outerhtml>
	//</node>
	//...
	//</position>
	
	strUp +="<position>" + Flow_GetPositionXmlInfo() + "</position>";//位置节点
	//strUp +="<position><![CDATA[" + FlowArea.innerHTML +"]]></position>";//位置节点
	strUp +="</root>";
	
	var strReturn=SendHttp(fcpubdata.servletPath + "/DesignerServlet"+fcpubdata.dotnetVersion+"?operate=flow_save",strUp)
	var dom = SetDom(strReturn);
	if (dom.documentElement==null){
		alert("保存流程发生错误！")
		return;
	}
	if (dom.childNodes(0).childNodes(0).text=="true"){
		FlowArea.FlowAttributes.FlowVersion = dom.childNodes(0).childNodes(1).text; //得到新生成的流程版本		
		alert("流程保存成功！");
		Flow_NodeNotHasChanged();//关闭保存按钮
		Flow_ChangePageTitle(strWorkflow);
		
	}else{
		alert(dom.childNodes(0).childNodes(1).text);
	}
	
	
}
//*************************************************************
// 功能描述： 得到页面编辑的流程定义xml信息
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetWorkflowXmlInfo(){

	var strRet = "";
	var initActionXml="";//<initial-actions>
	var stepXml="";
	var splitXml="";
	var joinXml ="";
	var subflowXml ="";
	
	
	var len = FlowArea.FlowNodes.Nodes.length;
	
	for (var i=0;i<len;i++){
		var node = FlowArea.FlowNodes.Nodes[i];
		var nodeType = node.NodeType;
		var fromActions = null;

		switch (nodeType)
		{
			case "StartNode": //只有一个StartNode
				initActionXml ="<initial-actions>"; 
				fromActions = Flow_GetRelationActionNode(node);
				for (var j=0;j<fromActions.length;j++){
					initActionXml += Flow_GetActionAllPropertys(fromActions[j]);
				}
				initActionXml+="</initial-actions>";
				break;
			case "EndNode":
			case "StepNode":
			case "CompNode":				
				stepXml += "<step id='" + node.id + "' name='" + node.Name +"'";
				if (node.NodePropertys){
					//if (typeof(node.NodePropertys.Compensate)!="undefined" && node.NodePropertys.Compensate!=null && node.NodePropertys.Compensate!="" && node.NodePropertys.Compensate!="null")
					if (node.NodePropertys.Compensate!=null && node.NodePropertys.Compensate!="")
						stepXml +=" compensate='" + node.NodePropertys.Compensate +"'";
				}
				stepXml +=">";
								
				if (node.NodePropertys){
					if (typeof(node.NodePropertys.meta)!="undefined" && node.NodePropertys.meta!="")
						stepXml += node.NodePropertys.meta;
					if (typeof(node.NodePropertys.task)!="undefined" && node.NodePropertys.task!="")
						stepXml += node.NodePropertys.task;							
						
					if (typeof(node.NodePropertys.permission)!="undefined" && node.NodePropertys.permission!="")
						stepXml += unescape(node.NodePropertys.permission);											
													
						
					if (typeof(node.NodePropertys.prefunction)!="undefined" && node.NodePropertys.prefunction!="")
						stepXml += node.NodePropertys.prefunction;
					if (typeof(node.NodePropertys.postfunction)!="undefined" && node.NodePropertys.postfunction!="")
						stepXml += node.NodePropertys.postfunction;
				}
				
				fromActions = Flow_GetRelationActionNode(node);
				var actionXml = "";	
				if (fromActions.length>0){
					for (var j=0;j<fromActions.length ;j++){
						actionXml += Flow_GetActionAllPropertys(fromActions[j]);
					}		
				}
				else{//是复合步骤节点，则没有fromActions,包含在step中了2011-3-8
					//一个复合节点 只能带一个 动作节点
					if (nodeType=="CompNode")
						actionXml =Flow_GetActionAllPropertys(node,"1");
				}
				if (actionXml.length>0){
					stepXml += "<actions>";
					stepXml += actionXml;
					stepXml += "</actions>";
				}
				stepXml +="</step>";
				break;
			
			case "SplitNode":
				//splitXml += "<split id='" + node.id + "' name='" + node.Name + "'>";
				splitXml += "<split id='" + node.id + "' name='" + node.Name + "'";
				if (node.NodePropertys){
					if (typeof(node.NodePropertys.IsDynamic)!="undefined" && node.NodePropertys.IsDynamic!="")
						splitXml +=" is-dynamic='" + node.NodePropertys.IsDynamic + "'";
				}	
				splitXml +=">";
				//动态节点定义的参数，在动态生成的节点中使用，和动态流程节点实例关联
				splitXml +=node.NodePropertys.params;
				
				splitXml +=Flow_GetResultsPropertysByNode(node);
				splitXml +="</split>";
				break;
			case "JoinNode":
				//joinXml +="<join id='"+ node.id + "' name='" + node.Name + "'>";
				joinXml +="<join id='"+ node.id + "' name='" + node.Name + "'";
				
				if (node.NodePropertys){
					if (typeof(node.NodePropertys.IsDynamic)!="undefined" && node.NodePropertys.IsDynamic!="")
						joinXml +=" is-dynamic='" + node.NodePropertys.IsDynamic + "' ";
				}	
				joinXml +=">";
				if (typeof(node.NodePropertys.condition)!="undefined" && node.NodePropertys.condition!="")
					joinXml+=node.NodePropertys.condition;

				//获得连线的xml串
				joinXml +=Flow_GetResultsPropertysByNode(node);	
				joinXml +="</join>";
				break;	
			case "SubflowNode":
			//<sub-flow id="3456" name="缺货子流程" is-sync="1" sub-flowname="oos_flow" sub-flowdesc="缺货登记流程" sub-flowversion="1" /> 
				subflowXml +="<sub-flow id='" + node.id + "' name='" + node.Name + "'";
				if (node.NodePropertys){
					if (typeof(node.NodePropertys.IsSync)!="undefined" && node.NodePropertys.IsSync!="")
						subflowXml +=" is-sync='" + node.NodePropertys.IsSync + "'";
					if (typeof(node.NodePropertys.Unique)!="undefined" && node.NodePropertys.Unique=="true")//2012-1-29
						subflowXml +=" unique='" + node.NodePropertys.Unique + "'";
					
					if (typeof(node.NodePropertys.SubFlowname)!="undefined" && node.NodePropertys.SubFlowname!="")
						subflowXml +=" sub-flowname='" + node.NodePropertys.SubFlowname + "'";
					if (typeof(node.NodePropertys.SubFlowdesc)!="undefined" && node.NodePropertys.SubFlowdesc!="")
						subflowXml +=" sub-flowdesc='" + node.NodePropertys.SubFlowdesc + "'";
					if (typeof(node.NodePropertys.SubFlowversion)!="undefined" && node.NodePropertys.SubFlowversion!="")
						subflowXml +=" sub-flowversion='" + node.NodePropertys.SubFlowversion + "'";
					if (typeof(node.NodePropertys.SubFloworig)!="undefined" && node.NodePropertys.SubFloworig!="")
						subflowXml +=" sub-floworig='" + node.NodePropertys.SubFloworig + "'";					
					
				}
				subflowXml +=" >";
				//子流程的输入输出参数
				subflowXml +=node.NodePropertys.params;
				
				//所有的results置需要从Result连线属性中获得	
				var objResults = Flow_GetRelationResultsFromAction(node);
				subflowXml +="<results>";
				for (var j=0;j<objResults.length;j++){
					subflowXml +=Flow_GetResultAllPropertys(objResults[j]);
				}
				subflowXml +="</results>";			    	
					
			
				subflowXml +="</sub-flow>";
				break;	
					
		}		
	}
	strRet =initActionXml;
	strRet +="<steps>";
	strRet +=stepXml;
	strRet +="</steps>";
			
	if (splitXml.length>0){
		strRet +="<splits>";
		strRet +=splitXml;
		strRet +="</splits>";
	}

	if (joinXml.length>0){
		strRet +="<joins>";
		strRet +=joinXml;
		strRet +="</joins>";
	}	
	if (subflowXml.length>0){
		strRet +="<sub-flows>";
		strRet +=subflowXml;
		strRet +="</sub-flows>";	
	}
	return strRet;
}
//得到splitNode和joinNode节点的results xml串
function Flow_GetResultsPropertysByNode(obj){
	var objResults=new Array();
	var j=0;
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++){			
		if(objs[i].id && objs[i].NodeType == "Result"){
			if (objs[i].FromNode && objs[i].FromNode==obj.id){
				objResults[j] = objs[i];
				j++;
			}
		}
	}
	//<unconditional-result id="13" old-status="Finished" status="Underway" step="6" owner="test"/>
	var strXml="";
	for (var i=0;i<objResults.length;i++){
		strXml +="<unconditional-result ";			
		strXml += 'id="' + objResults[i].id + '" ';			
	
		if (objResults[i].NodePropertys){
			if (objResults[i].NodePropertys.OldStatus )
				strXml +=' old-status="' + objResults[i].NodePropertys.OldStatus + '" ';
			if (objResults[i].NodePropertys.Status)	
				strXml +=' status="' + objResults[i].NodePropertys.Status + '"';	
			if (objResults[i].NodePropertys.Owner)
				strXml +=' owner="' + objResults[i].NodePropertys.Owner  + '" ';	
			if (objResults[i].NodePropertys.OwnerName && objResults[i].NodePropertys.OwnerName!="")
				strXml +=' ownername="' + objResults[i].NodePropertys.OwnerName + '"';								
		}
		var ToNode = document.getElementById(objResults[i].ToNode);
		if (ToNode.NodeType=="SplitNode")
			strXml +=' split="' + objResults[i].ToNode + '" ';			
		else if(ToNode.NodeType =="JoinNode")
			strXml +=' join="' + objResults[i].ToNode + '" ';			
		else if (ToNode.NodeType =="SubflowNode")
			strXml +=' sub-flow="' + objResults[i].ToNode + '" ';			
		else
			strXml +=' step="' + objResults[i].ToNode + '" ';
		strXml +=" >";
		if (objResults[i].NodePropertys){
			//条件不需要if (result.NodePropertys.condition && result.NodePropertys.condition!="")
			if (objResults[i].NodePropertys.prefunction && objResults[i].NodePropertys.prefunction!="")
				strXml +=objResults[i].NodePropertys.prefunction
			if (objResults[i].NodePropertys.postfunction && objResults[i].NodePropertys.postfunction!="")
				strXml +=objResults[i].NodePropertys.postfunction;						
		}
		strXml +="</unconditional-result>";
	}
	
	return strXml;
}	
//自动添加 步骤动作id属性到action的条件参数中，<arg name="step_id">xxxx</arg> <arg name="action_id">xxxx</arg>
function ActionAppendTaskNodeArg(actionId,permissionXml,stepid){
	
	
	//找到动作关联的 步骤节点id	
	var Nodes = FlowArea.FlowNodes.Nodes;
	var stepId="0";
	if (typeof(stepid)!="undefined" && stepid!="")
		stepId = stepid;
	else{	
		for (var i=0;i<Nodes.length;i++){	
			if (Nodes[i].ToNode && Nodes[i].ToNode==actionId && Nodes[i].NodeType == "Result" ){
				stepId = Nodes[i].FromNode;	
				break;								
			}			
		}
	}
	
	//如果设置了 判断竞争型任务的签收人 则自动加上 step_id和action_id 属性	
	var orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.CompetitionTaskCondition</arg>';
	var tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.CompetitionTaskCondition</arg>';
	
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	permissionXml = repStr(permissionXml,orgStr,tagStr);

	//直接指派
	orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.DirectTaskCondition</arg>';
	tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.DirectTaskCondition</arg>';		
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	permissionXml = repStr(permissionXml,orgStr,tagStr);

	//动态会签
	orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.CounterSignCondition</arg>';
	tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.CounterSignCondition</arg>';		
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	permissionXml = repStr(permissionXml,orgStr,tagStr);

	//平均分配
	orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.AverageTaskCondition</arg>';
	tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.AverageTaskCondition</arg>';		
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	permissionXml = repStr(permissionXml,orgStr,tagStr);
	return permissionXml;

	
}
//返回actionNode节点定义的xml串
//是复合步骤节点，参数action就是step节点,不是action节点
//isComposite ="1" 是复合节点
function Flow_GetActionAllPropertys(action,isComposite){
	var strXml = "";			
	//var isComp = false;
	var actionProperty = action.NodePropertys;
	if (typeof isComposite !="undefined" && isComposite =="1"){
		//isComp = true;
		actionProperty = action.NodePropertys.ActionProperty;//是复合步骤节点，则action就是step对象
	}	
	
	if (actionProperty){
		
		strXml +='<action id="' + actionProperty.ID + '" name ="' + actionProperty.Name + '"';
		
		if (actionProperty.View && actionProperty.View!="")
			strXml +=" view='" + escape(actionProperty.View) + "'";
		if (actionProperty.Remark && actionProperty.Remark!="")//加轨迹备注 2011-9-16
			strXml +=" remark='" + actionProperty.Remark + "'";		
		if (actionProperty.Auto && actionProperty.Auto!="")
			strXml +=" auto='" + actionProperty.Auto +"'";
		if (actionProperty.Finish && actionProperty.Finish!="")
			strXml +=" finish='" + actionProperty.Finish +"'";
		if (actionProperty.UserActionType && actionProperty.UserActionType!="")//2012-1-4
			strXml +=" useractiontype='" + actionProperty.UserActionType +"'";	
		
		strXml += ">";
		if (actionProperty.bs_table && actionProperty.bs_table!="")
			strXml +=' <meta name="bs_table">' + actionProperty.bs_table + '</meta>';
		if (actionProperty.bs_id_field && actionProperty.bs_id_field!="")
			strXml +=' <meta name="bs_id_field">' + actionProperty.bs_id_field + '</meta>';
		if (actionProperty.bs_desc_field && actionProperty.bs_desc_field!="")
			strXml +=' <meta name="bs_desc_field">' + actionProperty.bs_desc_field + '</meta>';
		if (actionProperty.rela_instance_id && actionProperty.rela_instance_id!="")
			strXml +=' <meta name="rela_instance_id">' + actionProperty.rela_instance_id + '</meta>';
					
	
		if (actionProperty.permission && actionProperty.permission!=""){		
			//当复合节点，则直接加步骤id 2011-3-8
			if (typeof isComposite !="undefined" && isComposite =="1")
				strXml +=ActionAppendTaskNodeArg(actionProperty.ID,actionProperty.permission,action.id);//action.id就是stepid
			else			
				strXml +=ActionAppendTaskNodeArg(actionProperty.ID,actionProperty.permission);
		}	
			
		if (actionProperty.validators && actionProperty.validators!="")
			strXml +=actionProperty.validators;
		//2011-7-19增加access-controls节点	
		if (actionProperty.accesscontrol && actionProperty.accesscontrol!="")
			strXml +=actionProperty.accesscontrol;		
		
		//2012-10-22增加action-forms节点	
		if (actionProperty.actionForms && actionProperty.actionForms!="")
			strXml +=actionProperty.actionForms;						
		
		if (actionProperty.prefunction && actionProperty.prefunction!="")
			strXml +=actionProperty.prefunction;

		if (actionProperty.postfunction && actionProperty.postfunction!="")
			strXml +=actionProperty.postfunction;
			
		//所有的results置需要从Result连线属性中获得	
		var objResults = Flow_GetRelationResultsFromAction(action);
		strXml +="<results>";
		for (var i=0;i<objResults.length;i++){
			strXml +=Flow_GetResultAllPropertys(objResults[i]);
		}
		strXml +="</results>";
			
		strXml +="</action>";	 
	}
	return strXml;
}

//得到result的所有属性
function Flow_GetResultAllPropertys(result){
/*
 <results>
            <result id="17" old-status="Finished" split="1">
              <conditions>
                <condition type="beanshell">
                  <arg name="script"><![CDATA[
									propertySet.getString("caller").equals("test")
									]]></arg>
                </condition>
              </conditions>
              <post-functions>
                <function type="beanshell">
                  <arg name="script"><![CDATA[
                                    System.out.println("action1 condition post_function");
                                    System.out.println("11111111111111");
                                    ]]></arg>
                </function>
              </post-functions>
            </result>
            <unconditional-result id="18" old-status="Finished" split="2"/>
		objProperty.ID = document.all.txtID.value;
		objProperty.Name = document.all.txtName.value;

		objProperty.Owner = document.all.txtOwner.value;
		objProperty.OldStatus = document.all.txtOldStatus.value;
		objProperty.Status = document.all.txtStatus.value;            
          </results>
*/	
	var bflag=true;
	var strXml ='<unconditional-result id="' + result.id + '" ';
	if (result.NodePropertys){
		if (result.NodePropertys.condition && result.NodePropertys.condition!=""){
			strXml ='<result id="' + result.id + '" ';
			bflag=false;
		}	

		if (result.NodePropertys.OldStatus && result.NodePropertys.OldStatus!="")
			strXml +=' old-status="' + result.NodePropertys.OldStatus + '"';

		if (result.NodePropertys.Status && result.NodePropertys.Status!="")
			strXml +=' status="' + result.NodePropertys.Status + '"';
		if (result.NodePropertys.Owner && result.NodePropertys.Owner!="")
			strXml +=' owner="' + result.NodePropertys.Owner + '"';
		if (result.NodePropertys.OwnerName && result.NodePropertys.OwnerName!="")
			strXml +=' ownername="' + result.NodePropertys.OwnerName + '"';			
	}
	var ToNode = document.getElementById(result.ToNode);
	if (ToNode.NodeType=="SplitNode")
		strXml +=' split="' + result.ToNode + '">';				
	else if (ToNode.NodeType=="JoinNode")
		strXml +=' join="' + result.ToNode + '">';
	else if (ToNode.NodeType=="SubflowNode")
		strXml +=' sub-flow="' + result.ToNode + '">';		
	else
		strXml +=' step="' + result.ToNode + '">';			
	if (result.NodePropertys){
		if (result.NodePropertys.condition && result.NodePropertys.condition!="")
			strXml +=ResultAppendTaskNodeArg(result.FromNode,result.NodePropertys.condition);
		if (result.NodePropertys.prefunction && result.NodePropertys.prefunction!="")
			strXml +=result.NodePropertys.prefunction
		if (result.NodePropertys.postfunction && result.NodePropertys.postfunction!="")
			strXml +=result.NodePropertys.postfunction;						
	}
	if (bflag)
		strXml +="</unconditional-result>";
	else	
		strXml +="</result>";
	return strXml;
}

/**
 *自动添加 步骤动作id属性到result的条件参数中，<arg name="step_id">xxxx</arg> <arg name="action_id">xxxx</arg> 
 */
function ResultAppendTaskNodeArg(nodeId,conditionXml){
	var stepId="0";
	var actionId ="0";
	
	//根据actionId的节点类型，定位actionId和stepId 2011-3-30
	var Nodes = FlowArea.FlowNodes.Nodes;
	var nodeType = "ActionNode";
	for (var i=0;i<Nodes.length;i++){
		if (Nodes[i].id == nodeId){
			nodeType = Nodes[i].NodeType;
			if (nodeType=="CompNode"){ //复合节点
				stepId = nodeId;
				actionId = Nodes[i].ActionId;
			}				
			break;
		}
	}	
	if (nodeType=="ActionNode"){
		//找到动作关联的 步骤节点id	
		var Nodes = FlowArea.FlowNodes.Nodes;
		for (var i=0;i<Nodes.length;i++){	
			if (Nodes[i].ToNode && Nodes[i].ToNode==nodeId && Nodes[i].NodeType == "Result" ){
				stepId = Nodes[i].FromNode;	
				actionId = nodeId;
				break;								
			}			
		}
	}

	
	//如果设置了 未完成动态会签 的条件  则自动加上 step_id和action_id 属性	
	var orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.NotFinishCounterSignResult</arg>';
	var tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.NotFinishCounterSignResult</arg>';	
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	conditionXml = repStr(conditionXml,orgStr,tagStr);
	
	
	//如果设置了 完成动态会签 的条件  则自动加上 step_id和action_id 属性	
	orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.FinishCounterSignResult</arg>';
	tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.FinishCounterSignResult</arg>';	
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	conditionXml = repStr(conditionXml,orgStr,tagStr);
	return conditionXml;
}
//*************************************************************
// 功能描述： 从当前Action中得到所有的Result, Action 或者 sub-flow
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetRelationResultsFromAction(action){
	var nodes = FlowArea.FlowNodes.Nodes;
	var objResults = new Array();
	var intIndex = 0;
	for(var i = 0; i < nodes.length; i++)
	{
		// 如果是节点图像则进行检查
		if(nodes[i].NodeType == "Result" && nodes[i].FromNode == action.id )
		{
			objResults[intIndex] = nodes[i];
			intIndex++;
		}
	}
	return objResults;
}
//*************************************************************
// 功能描述： 得到Node发出的所有ActionNode节点对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetRelationActionNode(node)
{
	var nodes = FlowArea.FlowNodes.Nodes;
	var objActions = new Array();
	var intIndex = 0;
	for(var i = 0; i < nodes.length; i++)
	{		
		if(nodes[i].NodeType == "Result" && nodes[i].FromNode == node.id )
		{
			if (nodes[i].ToNode && document.getElementById(nodes[i].ToNode).NodeType=="ActionNode"){
				objActions[intIndex] = document.getElementById(nodes[i].ToNode);
				intIndex++;
			}	
		}
	}
	return objActions;
}
//*************************************************************
// 功能描述： 得到页面编辑的所有节点的布局位置信息
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetPositionXmlInfo(){
	var strRet = "";
	var len = FlowArea.FlowNodes.Nodes.length;
	for (var i=0;i<len;i++){
		var nodeType =FlowArea.FlowNodes.Nodes[i].NodeType;
		strRet +="<node>";
		strRet +="<id>" + FlowArea.FlowNodes.Nodes[i].id + "</id>";
		strRet +="<name>" + FlowArea.FlowNodes.Nodes[i].Name + "</name>";
		strRet +="<nodetype>" + nodeType + "</nodetype>";
		
		var sHtml = FlowArea.FlowNodes.Nodes[i].outerHTML;
		sHtml = repStr(sHtml,fcpubdata.Path + "/designer/images/","images/");
	
		strRet +="<outerhtml><![CDATA[" + sHtml + "]]></outerhtml>"; 
		//strRet +="<outerhtml>" + FlowArea.FlowNodes.Nodes[i].outerHTML + "</outerhtml>"; 
		if (nodeType=="Result"){
			strRet +="<fromnode>" +  FlowArea.FlowNodes.Nodes[i].FromNode + "</fromnode>";
			strRet +="<tonode>" +  FlowArea.FlowNodes.Nodes[i].ToNode + "</tonode>";
		}
		strRet +="</node>";
		
	}
	return strRet;
}
//*************************************************************
// 功能描述： 分支节点不能只有一个流出方向
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CheckSplitNode(obj)
{
	// 分支节点不能只有一个流出方向
	var j = 0;
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		// 如果是节点图像则进行检查
		if(objs[i].NodeType == "Result")
		{
			if (objs[i].FromNode == obj.id)
			{
				j++;
			}
		}
	}

	// 必须有两个流出方向 ,修改分支节点 只有一个流出方向也可以	
	//if (j > 1)
	if (j > 0)
	{
		return false;
	}
	else
	{
		return true;
	}
}

//*************************************************************
// 功能描述： 检查流入流出方向
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CheckPourAndOut(obj, strDirection)
{
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		// 如果是节点图像则进行检查
		if(objs[i].NodeType == "Result")
		{
			// 除开始节点外不能没有流入方向的节点
			if (strDirection == "Pour")
			{
				if (objs[i].ToNode == obj.id)
				{
					return false;
				}
			}
			// 除结束节点外不能没有流出方向的节点
			else if (strDirection == "Out")
			{	
				//if (obj.NodeType=="ActionNode" && obj.NodePropertys.Finish=="true") // action的自动终结 不检查流出方向-> 已修改，必需要有流程方向
				//	return false;
				//if (obj.NodeType=="SubflowNode" && obj.NodePropertys.IsSync=="2") //sub-flow节点，异步的，可以没有流出方向，同步的必须要有流出方向--->修改为，同步异步都流出方向，否则无法确定下一步
				//	return false;	
				if (objs[i].FromNode == obj.id)
				{
					return false;
				}
			}
		}
	}

	return true;
}

function Flow_CloseWindow(){
//	if (bActiveNodeChange){
//		if (confirm("是否要保存当前的流程，再离开？"))
//			Flow_SaveFlow();
//	}			
}