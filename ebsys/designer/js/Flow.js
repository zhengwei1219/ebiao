//*************************************************************
// 功能描述： 创建新的流程
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CreateWorkFlow()
{
	// 判断是否已经存在流程
	//if (FlowArea.FlowNodes.Nodes.length > 0)
	if (bActiveNodeChange)
	{
		if (confirm("是否要保存当前的流程，再建立新的流程？"))
		{
			// 保存流程
			Flow_SaveFlow();
			return;
		}
	}
	// 清除当前流程
	Flow_RemoveAllActiveNode();
	//********************* start ****************************************
	//清除当前流程的属性
	Flow_RemoveFlowAttributes();
	//清除历史操作
	Flow_ClearOperations();
	//设置工具栏编辑状态
	Flow_SetFlowToolBarEditStatus();
	//初始化流程定义xml信息
	//Flow_InitDefinXmlObj();
	//------------------------ end -------------------------------------
	//打开保存按钮
	Flow_NodeHasChanged();
	Flow_ChangePageTitle("");
	// 创建起始节点
	Flow_CreateStartAndEndNode("StartNode");
	Flow_CreateStartAndEndNode("EndNode");
}

//*************************************************************
// 功能描述： 清除当前流程的属性
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RemoveFlowAttributes()
{
	FlowArea.FlowAttributes = null;
}

//*************************************************************
// 功能描述： 清除历史操作
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ClearOperations()
{
	G_CurrentHistoryIndex = -1;
	
	var objs = FlowArea.OperationLists.Operations;
	objs.splice(0, objs.length);
}

//*************************************************************
// 功能描述： 创建起始节点
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CreateStartAndEndNode(strNodeType)
{
	var rnd_no = Math.round(Math.random() * 10000);
	//var date_time = new Date();
	//var Node_id = "Node_" + date_time.valueOf() + rnd_no
	var Node_id =  rnd_no;

	var activeNode = document.createElement("<div />");
	activeNode.style.position = "absolute";
	activeNode.style.visibility = "visible";
	activeNode.style.zIndex = "799";
	activeNode.style.border = "0px solid #000000";
	activeNode.id = Node_id;
	activeNode.NodeType = strNodeType;
	activeNode.style.textAlign = "center";
	var intTop=0;
	var intLeft=0;
	if (strNodeType == "StartNode")
	{
		strNodeName = "开始节点";
		strImageSrc = "images/start.gif";
		intTop = 80;
		intLeft = 30;
		//********************** start ***************************************
		var objProperty = new NodePropertys();
		objProperty.ID = Node_id; 
		objProperty.Name = strNodeName;
		//objProperty.DealMan = "";
		//objProperty.AlermNumber = "";
		//objProperty.EndNumber = "";
		activeNode.NodePropertys = objProperty;
		//------------------------- end ------------------------------------
	}
	else
	{
		strNodeName = "结束节点";
		strImageSrc = "images/end.gif";
		 if (document.documentElement)//document.body.offsetHeight - 100; 2012-11-8
			 intTop = document.documentElement.offsetHeight - 100;
		 else
			 intTop = document.body.offsetHeight -100;
		
		intLeft = document.body.offsetWidth - 100;
		//********************** start ***************************************
		var objProperty = new NodePropertys();
		objProperty.ID = Node_id;
		objProperty.Name = strNodeName;
		
		objProperty.TaskCollections = new Array();
		var objTaskInfo = new TaskInfo();
		objTaskInfo.ID = "1";
		objTaskInfo.ContentRemark = "End";
		objProperty.TaskCollections[objProperty.TaskCollections.length] = objTaskInfo;
		activeNode.NodePropertys = objProperty;
		//------------------------- end ------------------------------------
	}
	activeNode.style.width = strNodeName.length * 16;
	activeNode.style.height = 50;
	activeNode.style.left = intLeft;
	activeNode.style.top = intTop;
	activeNode.Name = strNodeName;
	activeNode.Activate = Flow_SetNodeActivate;
	activeNode.Deactivate = Flow_SetNodeDeActivate;
	activeNode.onmousedown = Flow_MoveActiveNode;
	activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
	activeNode.onclick = Flow_ShowActiveNodeDetail;
	activeNode.onmouseover = Flow_ActiveNodeOver;
	activeNode.onmouseout = Flow_ActiveNodeOut;
	activeNode.ondblclick = Flow_ChangeActiveNodeName;
	
	// Create active image element
	var activeImage = document.createElement("<img src='"+ strImageSrc +"' style='border: 0px solid #000000;>");
	var activeText = document.createElement("<font class='actName' />");//font修改成div 2012-11-8
	activeText.style.cursor = "default";
	activeText.innerHTML = strNodeName;

	// Add the activeNode to the document body:
	FlowArea.appendChild(activeNode);

	activeNode.appendChild(activeImage);
	activeNode.appendChild(activeText);
	
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
	//Flow_SetCurrentActiveNode(activeNode);
}


//*************************************************************
// 功能描述： 装入节点
// 参数描述： strNodeID		- 对象ID
//			strNodeName	- 节点名称
//			strNodeType	- 节点类型
//			strOuterHTML	- 节点HTML
//-------------------------------------------------------------
function Flow_BuildActiveNode(strNodeID, strNodeName, strNodeType, strOuterHTML)
{
	FlowArea.insertAdjacentHTML('beforeEnd',strOuterHTML);
	
	var activeNode = document.getElementById(strNodeID);

	activeNode.Activate = Flow_SetNodeActivate;
	activeNode.Deactivate = Flow_SetNodeDeActivate;
	activeNode.onmousedown = Flow_MoveActiveNode;
	activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
	activeNode.onclick = Flow_ShowActiveNodeDetail;
	activeNode.onmouseover = Flow_ActiveNodeOver;
	activeNode.onmouseout = Flow_ActiveNodeOut;
	activeNode.ondblclick = Flow_ChangeActiveNodeName;

	
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
}//*************************************************************
// 功能描述： 创建节点
// 参数描述： strOrigiSrc - 图片源路径
//           strNodeName - 节点名称
//-------------------------------------------------------------
function Flow_CreateActiveNode(strOrigiSrc, strNodeType)
{
	
	var obj = Flow_GetCurrentActiveNode();
	
	if(obj)
	{
		// 如果上一一个对象没有取名字，则自动给它使用默认名称
		if(obj.Name == "None")
		{
			// 取得默认名称
			obj.Name = Flow_GetNodeDefaultName(obj.NodeType);
			Flow_SetActiveNodeName();
		}
	}

	var rnd_no = Math.round(Math.random() * 10000);
	//var date_time = new Date();
	//var Node_id = "Node_" + date_time.valueOf() + rnd_no
	var Node_id =  rnd_no;

	var activeNode = document.createElement("<div />");
	activeNode.style.position = "absolute";
	activeNode.style.visibility = "visible";
	activeNode.style.zIndex = "799";
	activeNode.style.width = 1;
	activeNode.style.height = 50;
	activeNode.style.border = "0px solid #000000";
	activeNode.style.textAlign = "center";
	activeNode.id = Node_id;
	activeNode.NodeType = strNodeType;
	activeNode.Name = "None";

	
	//复合节点 需要创建action节点的信息 2011-3-8
	if (strNodeType=="CompNode"){
		var rnd_action_no =  Math.round(Math.random() * 10000);
		activeNode.ActionId = rnd_action_no;
		activeNode.ActionProperty = new NodePropertys();//增加复合节点的赋值2011-3-8
	}
	
	//activeNode.Name = "步骤节点";
	activeNode.Activate = Flow_SetNodeActivate;
	activeNode.Deactivate = Flow_SetNodeDeActivate;
	activeNode.onmousedown = Flow_MoveActiveNode;
	activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
	activeNode.onclick = Flow_ShowActiveNodeDetail;
	activeNode.onmouseover = Flow_ActiveNodeOver;
	activeNode.onmouseout = Flow_ActiveNodeOut;
	activeNode.ondblclick = Flow_ChangeActiveNodeName;
	
	// Create active image element
	var activeImage = document.createElement("<img src='"+ strOrigiSrc +"' style='border: 0px solid #000000;>");	
	activeImage.style.filter = "alpha(opacity=60)";
	var activeText = document.createElement("<font class='actName' />");//去掉font修改成div
	
	activeText.style.cursor = "default";

	// Add the activeNode to the document body:
	FlowArea.appendChild(activeNode);

	activeNode.appendChild(activeImage);
	activeNode.appendChild(activeText);
	
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
	Flow_SetCurrentActiveNode(activeNode);
	
	Flow_SetActiveNode();
	document.onmousedown = Flow_PutActiveNode;
	document.onmousemove = Flow_SetActiveNode;
}

//*************************************************************
// 功能描述： 根据节点类型设置默认名称
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetNodeDefaultName(strNodeType)
{
	var strNodeName = null;
	switch (strNodeType)
	{
		case "StartNode":
			strNodeName = "开始节点";
			break;
		case "EndNode":
			strNodeName = "结束节点";
			break;
		case "JoinNode":
			strNodeName = "协同节点";
			break;
		case "SplitNode":
			strNodeName = "分支节点";
			break;
		case "StepNode":
			strNodeName = "步骤节点";
			break;
		case "ActionNode":
			strNodeName = "动作节点";
			break;
			
		case "SubflowNode":
			strNodeName = "子流程节点";
			break;
		case "CompNode":
			strNodeName = "复合节点";
			break;
	}

	return strNodeName;
}

//*************************************************************
// 功能描述： 放置节点到流程区域
// 参数描述： 无
//-------------------------------------------------------------
var G_NodePropertys = null;
function Flow_PutActiveNode()
{
	// 如果是直接在工具上取消添加节点对象
	if (event.srcElement.id)
	{
		// 取消添加节点对象
		var obj = Flow_GetCurrentActiveNode();
		// 点击右键取消创建对象
		if(obj && obj.Name == "None")
		{
			// 如果还没有取名就要删除说明用户不想建立该对象则关闭对象命名窗口
			Flow_HiddenNodeNameDiv();
			Flow_RemoveNodeFromFlow(obj);

			document.onmousemove = MMove;
			document.onmousedown = null;
		}

		return;
	}

	if(event.button == 1)
	{
		Flow_SetActiveNode();		
		var obj = Flow_GetCurrentActiveNode();
		//********************* start ****************************************
		// 确定创建后的默认名称
		//var strNodeName = Flow_GetNodeDefaultName(obj.NodeType);
		//Flow_ShowNodeNameDiv(strNodeName);
		MUp();				
		
		G_NodePropertys = null;//objProperty;
		//Flow_ShowActiveNodePropertys(obj); //去掉拉下控件就弹出属性页 2013-8-15				
		var objProperty = new NodePropertys();
		objProperty.ID = obj.id;
		objProperty.Name = Flow_GetNodeDefaultName(obj.NodeType);

		if (obj.NodeType == "CompNode") {//2011-3-8 增加复合节点的赋值
		    objProperty.ActionID = obj.ActionId;
		    objProperty.ActionProperty = obj.ActionProperty;
		}
		obj.NodePropertys = objProperty;
			
		if (obj.NodeType && obj.NodeType != "Result") {
		    //obj.Name = objProperty.Name;
		    if (objProperty.Name.length > 8)//2012-1-6
		        obj.style.width = "70px";
		    else
		        obj.style.width = objProperty.Name.length * 14;

		    if (obj.childNodes[1].nodeType == 3)
		        obj.childNodes[2].innerHTML = objProperty.Name; //用doctype 空白或文本都是一个子节点   2012-11-8
		    else
		        obj.childNodes[1].innerHTML = objProperty.Name; //与Flow_ShowActiveNodePropertys(obj)函数中返回值一样赋值2013-8-15
		}
		//将step.id step.name, action.id action.Name加到 FlowArea.FlowNodes.Nodes中
	    var len = FlowArea.FlowNodes.Nodes.length;
	    for (var i = 0; i < len; i++) {
	        var node = FlowArea.FlowNodes.Nodes[i];
	        var nodeType = node.NodeType;
	        if (node.id && node.NodeType == "CompNode" && node.id == objProperty.ID) {
	            node.Name = objProperty.Name;
	            node.NodePropertys.Name = objProperty.Name;
	            node.NodePropertys.ActionProperty.ID = objProperty.ActionID;
	            node.NodePropertys.ActionProperty.Name = objProperty.Name;
	            break;
	        }
	    }
		
		Flow_NodeHasChanged();
		//end 2013-8-15
		//--------------------- end ----------------------------------------

		// 保存操作到列表
		Flow_SaveOperation(obj, "Add", null);				
	}

	// 恢复设置动作连线工具状态
	Flow_ResetFlowToolBar();
	// 对象发生改变
	Flow_NodeHasChanged();

	document.onmousemove = MMove;
	document.onmousedown = null;
}

//*************************************************************
// 功能描述： 节点的闪动偏移
// 参数描述： 无
//-------------------------------------------------------------
var G_HasRestoration = true;
function Flow_ActiveNodeOver()
{
	// 实现对象闪动效果
	var obj = event.srcElement;
	// 如果没有得到对象则直接退出
	if (!obj)
	{
		return;
	}
	// 如果得到的是目标对象的子对象
	if (obj.id == "")
	{
		obj = obj.parentNode;
	}
	if (obj.nodeType == 9) return; //2012-11-8
	// 判断是否已经复位同时如果正在使用动作工具则不允许移动节点
	if (G_HasRestoration && !G_Started)
	{
		obj.style.pixelLeft += 2;
		obj.style.pixelTop += 2;
		G_HasRestoration = false;

		var repTime = setTimeout("Flow_ActiveNodeRestoration('"+ obj.id +"')", 500);
	}
	// 判断鼠标是否松开
	if (Obj == '' && MTy == '')
	{
		// 显示设置节点信息
		Flow_ShowActiveNodeInfo(obj);
	}
}

//*************************************************************
// 功能描述： 通过鼠标事件的节点闪动复位
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ActiveNodeOut()
{
	// 关闭信息显示层
	Flow_CloseActiveNodeInfo();
}

//*************************************************************
// 功能描述： 节点闪动定时复位
// 参数描述： strNodeId - 对象ID
//-------------------------------------------------------------
function Flow_ActiveNodeRestoration(strNodeId)
{
	try
	{
		G_HasRestoration = true;
		// 对象闪动复位
		var obj = document.getElementById(strNodeId);
		obj.style.pixelLeft -= 2;
		obj.style.pixelTop -= 2;
	}
	catch(wError){}
}

//*************************************************************
// 功能描述： 显示设置节点信息
// 参数描述： obj - 指定对象
//			srcX - 屏幕坐标X
//			srcY - 屏幕坐标Y
//-------------------------------------------------------------
function Flow_ShowActiveNodeInfo(obj)
{
	var infoDiv = document.getElementById("ActiveNodeInfoDiv");
	if(!infoDiv)
	{
		infoDiv = document.createElement("<div />");
		infoDiv.style.position = "absolute";
		infoDiv.style.visibility = "visible";
		// 没有命名前不显示信息层
		infoDiv.style.display = "none";
		infoDiv.style.zIndex = "999999999";
		infoDiv.style.width = 1;
		infoDiv.style.height = 44;
		infoDiv.style.background = "#FEFFF0";
		infoDiv.style.paddingLeft = "2px";
		infoDiv.style.paddingTop = "2px";
		infoDiv.style.border = "1px solid #DF8202";
		infoDiv.id = "ActiveNodeInfoDiv";

		// Add the activeNode to the document body:
		FlowArea.appendChild(infoDiv);
	}
	var strNodeTypeName = Flow_GetNodeDefaultName(obj.NodeType);
	var strInfo0 = "类型:【" + strNodeTypeName + "】";
	var strInfo1 = "<br>";
	var strInfo2 = "名称:【" + obj.Name + "】";
	var intMaxLength = Math.max(strInfo0.length, strInfo2.length);
	var strInfo = strInfo0 + strInfo1 + strInfo2;
	if(strInfo == "None" || !strInfo) strInfo = "没有相关信息";
	infoDiv.innerHTML = strInfo;
	infoDiv.style.width = intMaxLength * 12;
	infoDiv.style.pixelLeft = obj.style.pixelLeft + obj.style.pixelWidth;
	infoDiv.style.pixelTop = obj.style.pixelTop;
	// 处理出界情况
	if(infoDiv.style.pixelTop <= FlowNodeElement.style.pixelHeight)
	{
		infoDiv.style.pixelTop = FlowNodeElement.style.pixelHeight;
	}
	if(infoDiv.style.pixelLeft >= document.body.offsetWidth - infoDiv.style.pixelWidth - 1)
	{
		infoDiv.style.pixelLeft = obj.style.pixelLeft - infoDiv.style.pixelWidth + 5;
	}
	if(infoDiv.style.pixelTop >= document.body.offsetHeight - infoDiv.style.pixelHeight)
	{
		infoDiv.style.pixelTop = document.body.offsetHeight - infoDiv.style.pixelHeight - 1;
	}
	// 如果还没有取名则不显示
	if(obj.Name != "None")
		infoDiv.style.display = "block";
}

//*************************************************************
// 功能描述： 显示设置节点详细信息
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowActiveNodeDetail()
{
}

//*************************************************************
// 功能描述： 关闭节点信息显示层
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CloseActiveNodeInfo()
{
	var infoDiv = document.getElementById("ActiveNodeInfoDiv");
	if (infoDiv)
	{
		infoDiv.style.display = "none";
	}
}

//*************************************************************
// 功能描述： 显示设置节点名称层
// 参数描述： strNodeName - 对象名称
//-------------------------------------------------------------
function Flow_ShowNodeNameDiv(strNodeName)
{
	var obj = Flow_GetCurrentActiveNode();	
	
	var bStillShow = false;
	// 关闭所有窗口
	HideAllWindow(NodeNameDiv);

	NodeNameDiv.style.display = "block";

	FocusMe(NodeNameDivHead, null, NodeNameDiv);

	intLeft = obj.style.pixelLeft + 30;
	intTop = obj.style.pixelTop + 30;
	
	if(intLeft > document.body.offsetWidth - NodeNameDiv.style.pixelWidth)
	{
		intLeft = document.body.offsetWidth - NodeNameDiv.style.pixelWidth - 1;
	}
	
	if(intTop > document.body.offsetHeight - NodeNameDiv.style.pixelHeight)
	{
		intTop = document.body.offsetHeight - NodeNameDiv.style.pixelHeight - 1;
	}

	NodeNameDiv.style.pixelLeft = intLeft;
	NodeNameDiv.style.pixelTop = intTop;

	NodeName.value = strNodeName;
}

//*************************************************************
// 功能描述： 隐藏所有层窗口
// 参数描述： 无
//-------------------------------------------------------------
function HideAllWindow(objDiv)
{
	// 对象名称设置窗口
	NodeNameDiv.style.display = "none";
}

//*************************************************************
// 功能描述： 隐藏节点名称设置层
// 参数描述： 无
//-------------------------------------------------------------
function Flow_HiddenNodeNameDiv()
{
	NodeNameDiv.style.display = "none";
}

//*************************************************************
// 功能描述： 设置节点位置
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SetActiveNode()
{
	var obj = Flow_GetCurrentActiveNode();

	obj.style.left = event.x - obj.childNodes[0].width / 2;
	obj.style.top = event.y - obj.childNodes[0].height / 2;
}

//*************************************************************
// 功能描述： 设置节点名称
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SetActiveNodeName()
{
	Flow_HiddenNodeNameDiv();

	var obj = Flow_GetCurrentActiveNode();
    
	//obj.Name = NodeName.value; //去掉弹出节点属性页2013-8-15
	//obj.style.width = NodeName.value.length * 14;
	//obj.childNodes[1].innerHTML = NodeName.value;
}

//*************************************************************
// 功能描述： 修改节点名称
// 参数描述： flag - 名称标识
//-------------------------------------------------------------
function Flow_ChangeActiveNodeName(flag)
{
	if(flag)
	{
		var obj = Flow_GetCurrentActiveNode();
		Flow_ShowNodeNameDiv(obj.Name);
	}
	else
	{
		var obj = document.elementFromPoint(event.x, event.y);
		var objTag =null;
		if (obj!=null && obj.parentNode.id=="FlowArea"){
			objTag = obj;
		}
		else{
			objTag = obj.parentNode;
		}
		//判断如果 连线 如果是 step->action之间的连线，不出属性页 是action->step,split->step,join->step之间的则需要出属性页
		var showTagPage = true;
		if (objTag.NodeType && objTag.NodeType=="Result"){
			if (document.getElementById(objTag.FromNode).NodeType=="StepNode" || document.getElementById(objTag.FromNode).NodeType=="StartNode")
				showTagPage = false;
		} 
		if (showTagPage){
		
			Flow_SetCurrentActiveNode(objTag);
		
		//******************** start *****************************************
//		var strNodeName = objTag.Name;
//
//		// 如果是创建对象时候直接双击对象则会出现修改时候其名称为None情况
//		if( strNodeName == "None" )
//			strNodeName = Flow_GetNodeDefaultName(objTag.NodeType);
//		Flow_ShowNodeNameDiv(strNodeName);
			G_NodePropertys = objTag.NodePropertys;
			Flow_ShowActiveNodePropertys(objTag);
		}	
		//----------------------- end --------------------------------------
	}
}



//*************************************************************
// 功能描述： 显示节点属性窗口
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowActiveNodePropertys(objParm)
{
	var strPage = fcpubdata.Path;
	var strWindowParam = "dialogHeight:500px; dialogWidth:610px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes";
	
	if( objParm.NodeType == "StartNode" || objParm.NodeType == "EndNode"){
		strPage += "/fceform/common/djframe.htm?djsn=wd_startend_node&djtype=WF_DSN";
		strWindowParam = "dialogHeight:270px; dialogWidth:420px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes"
	}	
	else if( objParm.NodeType == "StepNode" ){		
		strPage += "/fceform/common/djframe.htm?djsn=wd_step_node&djtype=WF_DSN";
	}
	else if( objParm.NodeType == "ActionNode" )
		strPage += "/fceform/common/djframe.htm?djsn=wd_action_node&djtype=WF_DSN";
	else if (objParm.NodeType =="Result"){
		strWindowParam = "dialogHeight:500px; dialogWidth:590px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes";
		strPage += "/fceform/common/djframe.htm?djsn=wd_result_node&djtype=WF_DSN";
	}	
	else if (objParm.NodeType =="SplitNode"){
		strWindowParam = "dialogHeight:270px; dialogWidth:420px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes"
		strPage += "/fceform/common/djframe.htm?djsn=wd_split_node&djtype=WF_DSN";
	}	
	else if (objParm.NodeType =="JoinNode"){
		strWindowParam = "dialogHeight:300px; dialogWidth:590px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes";
		strPage += "/fceform/common/djframe.htm?djsn=wd_join_node&djtype=WF_DSN";
	}	
	else if (objParm.NodeType =="SubflowNode"){
		strWindowParam = "dialogHeight:300px; dialogWidth:442px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes"
		strPage += "/fceform/common/djframe.htm?djsn=wd_subflow_node&djtype=WF_DSN";
	}	
	else if (objParm.NodeType = "CompNode")
		strPage += "/fceform/common/djframe.htm?djsn=wd_comp_node&djtype=WF_DSN";
	else
		strPage = objParm.NodeType + ".htm";
	
	//增加NodePropertys中的ID等值的赋值	
	if (G_NodePropertys==null){
		G_NodePropertys = new NodePropertys();		
		if (objParm.Name=="None")
			G_NodePropertys.Name = Flow_GetNodeDefaultName(objParm.NodeType);
		else
			G_NodePropertys.Name = objParm.Name;
		G_NodePropertys.ID = objParm.id;
		if (objParm.NodeType=="CompNode"){//2011-3-8 增加复合节点的赋值
			G_NodePropertys.ActionID = objParm.ActionId;
			G_NodePropertys.ActionProperty = objParm.ActionProperty;
		}
	}

	//分支节点，收集分支节点下面的result，作为结果显示
	if (objParm.NodeType == "SplitNode"){				
		G_NodePropertys.result = Flow_GetResultsBySplitNode(objParm);
		
	}
	//动作结果连线，查找动作节点关联的view (eform的表单) 2011-4-15
	if (objParm.NodeType =="Result"){
		G_NodePropertys.view = Flow_GetActionNodeView(objParm);
	}	
	var objReturn = window.showModalDialog(strPage, window,strWindowParam );
	if (objReturn==null) return;

	var obj = Flow_GetCurrentActiveNode();	
	
	obj.NodePropertys = objReturn;
	
	var userActionType = "";//2012-1-6
	if (obj.NodeType && (obj.NodeType=="CompNode" || obj.NodeType=="ActionNode")){
		if (obj.innerHTML.indexOf("images/wf_banner")>0)
			Remove_UserActionType_icon(obj)//移走所有标识图片 2012-1-6
		if (obj.NodeType=="CompNode") userActionType = objReturn.ActionProperty.UserActionType;
		if (obj.NodeType=="ActionNode") userActionType = objReturn.UserActionType;
	}
	
	if (obj.NodeType && obj.NodeType!="Result"){
		obj.Name = objReturn.Name;
		if (objReturn.Name.length>8)//2012-1-6
			obj.style.width = "70px";
		else
			obj.style.width = objReturn.Name.length * 14;
		
        if (obj.childNodes[1].nodeType == 3)
            obj.childNodes[2].innerHTML = objReturn.Name; //用doctype 空白或文本都是一个子节点   2012-11-8
		else
		    obj.childNodes[1].innerHTML = objReturn.Name; 

		
	}
	//2012-1-6增加节点分类标识
	if (obj.NodeType && (obj.NodeType=="CompNode" || obj.NodeType=="ActionNode")){		
		if (userActionType!=""){
			Create_UserActionType_icon(obj,userActionType);
		}
	}
	//打开保存按钮
	//Flow_NodeHasChanged();
	
	
}
//2012-1-6创建节点分类小图片 
function Create_UserActionType_icon(obj,userActionType){
	var sRedIcon = '<IMG style="POSITION: absolute; TOP: 0px;left:15px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="images/wf_banner_red.gif">';
	var sPurpleIcon = '<IMG style="POSITION: absolute; TOP: 0px;left:15px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="images/wf_banner_purple.gif">';

	if (userActionType =="1"){
		obj.innerHTML = sRedIcon + obj.innerHTML;
	}
	if (userActionType =="2"){
		obj.innerHTML = sPurpleIcon + obj.innerHTML;
	}
}
//移走节点分类小图片2012-1-6
function Remove_UserActionType_icon(obj){
	var innerHTML = "";
	var len = obj.childNodes.length;
	for (var i=0;i<len;i++){
		if (obj.childNodes[i].nodeType == 3) continue; //用doctype 2012-11-8
		if (obj.childNodes[i].outerHTML.indexOf("comp.gif")>0)
			innerHTML = innerHTML + obj.childNodes[i].outerHTML;
		if (obj.childNodes[i].outerHTML.indexOf("</FONT>")>0)//font修改成div 2012-11-8
			innerHTML = innerHTML + obj.childNodes[i].outerHTML;
		if (obj.childNodes[i].outerHTML.indexOf("cluster.gif")>0)
			innerHTML = innerHTML + obj.childNodes[i].outerHTML;
	}
	obj.innerHTML = innerHTML;	
}
//获得结果连线 前面 的动作节点的view 2011-4-15
function Flow_GetActionNodeView(objResult){
	var view = "";		
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++){				
		if(objs[i].id && (objs[i].NodeType == "ActionNode" || objs[i].NodeType == "CompNode")){
			if (objResult.FromNode && objs[i].id==objResult.FromNode){
				if (objs[i].NodeType=="ActionNode"){						
					if (objs[i].NodePropertys && objs[i].NodePropertys.View)
						view = objs[i].NodePropertys.View;					
				}
				if (objs[i].NodeType=="CompNode"){
					if (objs[i].NodePropertys.ActionProperty && objs[i].NodePropertys.ActionProperty.View)
					    view = objs[i].NodePropertys.ActionProperty.View;
				}
				break;
			}
		}
	}
	return view;
}
//*************************************************************
// 功能描述： 得到指定分支节点下面的results
// 参数描述： 分支节点对象
//-------------------------------------------------------------
function Flow_GetResultsBySplitNode(obj){
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
		if (objResults[i].NodePropertys){
		//id="13" old-status="Finished" status="Underway" step="6" owner="test"/>
			strXml +="<result>";
			strXml += "<id>" + objResults[i].NodePropertys.ID + "</id>";
			strXml +="<name><![CDATA[" + objResults[i].Name + "]]></name>";
			if (objResults[i].NodePropertys.OldStatus)
				strXml +="<old_status><![CDATA[" + objResults[i].NodePropertys.OldStatus + "]]></old_status>";
			else	
				strXml +="<old_status><![CDATA[&nbsp;]]></old_status>";
			strXml +="<status><![CDATA[" + objResults[i].NodePropertys.Status + "]]></status>";
			strXml +="<step>" + objResults[i].ToNode + "</step>";
			
			strXml +="<step_name><![CDATA[" + document.getElementById(objResults[i].ToNode).Name + "]]></step_name>";
			if (objResults[i].NodePropertys.Owner)
				strXml +="<owner><![CDATA[" + objResults[i].NodePropertys.Owner  + "]]></owner>";
			else
				strXml +="<owner><![CDATA[&nbsp;]]></owner>";
			strXml +="</result>";
		}
	}
	
	return strXml;
}	

//*************************************************************
// 功能描述： 修改节点名称
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ModifyActiveNodeName()
{
	//******************** start *****************************************
	var obj = Flow_GetCurrentActiveNode();
//	Flow_ShowNodeNameDiv(obj.Name);
	G_NodePropertys = obj.NodePropertys;
	Flow_ShowActiveNodePropertys(obj);
	//----------------------- end --------------------------------------
}

//*************************************************************
// 功能描述： 保存所有节点类
// 参数描述： 无
//-------------------------------------------------------------
function Flow_FlowNodes()
{
}

//*************************************************************
// 功能描述： 移动节点 节点的点击事件
// 参数描述： 无
//-------------------------------------------------------------
var bActiveNodeChange = false;
var G_CancelAddNode = false;
function Flow_MoveActiveNode()
{
	// 关闭右键菜单
	Flow_CloseActiveNodeContextmenu();
	Flow_CloseFlowContextmenu();
	// 关闭详细信息
	Flow_CloseActiveNodeInfo();

	var obj = document.elementFromPoint(event.x, event.y);

	// 如果没有得到对象则直接退出
	if (!obj)
	{
		return false;
	}
	// 如果是动作对象单独处理
	if (obj.NodeType == "Result")
	{
		Flow_SetCurrentActiveNode(obj);
		return;
	}
	// 如果得到的是目标对象的子对象
	if (obj.id == "")
	{
		obj = obj.parentNode;
	}
	
	//打开保存按钮
	Flow_NodeHasChanged();
	
	if(event.button == 1)
	{
		// 激活当前对象
		Flow_SetCurrentActiveNode(obj);
		// 如果正在使用动作工具则不允许移动节点
		if (!G_Started)
		{
			MDown(obj);
		}
		else
		{
			// 创建动作连线对象
			Flow_PolyLineOnMouseClick(obj);
		}
	}
	else
	{
		// 点击右键取消创建对象
		if(obj.Name == "None")
		{
			// 如果还没有取名就要删除说明用户不想建立该对象则关闭对象命名窗口
			Flow_HiddenNodeNameDiv();
			Flow_RemoveNodeFromFlow(obj);

			document.onmousemove = MMove;
			document.onmousedown = null;

			// 恢复设置动作连线工具状态
			Flow_ResetFlowToolBar();
			// 设置取消标识
			G_CancelAddNode = true;

			return false;
		}
	}
}

//*************************************************************
// 功能描述： 取得流程区域当前节点
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetCurrentActiveNode()
{
	var act = FlowArea.CurrentActiveNode;

	return act;
}

//*************************************************************
// 功能描述： 设定指定节点的活动状态
// 参数描述： obj - 指定对象
//-------------------------------------------------------------
function Flow_SetNodeActivate(obj)
{
	if(obj)
	{
		// 动作连线
		if (obj.NodeType == "Result")
		{	
			obj.strokecolor = "#CC0000";
			return;
		}
		else
		{
			if(obj.childNodes[0].style.filter.indexOf("alpha(opacity=60)") == -1)
			{
				obj.childNodes[0].style.filter = "alpha(opacity=60)" + obj.childNodes[0].style.filter;
			}
			if (obj.childNodes.length==3)//2012-1-6增加节点分类小图片
				Flow_SetNodeStyle(obj.childNodes[2], "#FF0000");
			else
				Flow_SetNodeStyle(obj.childNodes[1], "#FF0000");
						
		}
	}
}

//*************************************************************
// 功能描述： 取消指定对象活动状态
// 参数描述： obj - 指定对象
//-------------------------------------------------------------
function Flow_SetNodeDeActivate(obj)
{
	if(obj)
	{
		// 动作连线
		if (obj.NodeType == "Result")
		{
			obj.strokecolor = "#003300";
			return;
		}
		if(obj.childNodes[0].style.filter.indexOf("alpha(opacity=60)") > -1)
		{
			obj.childNodes[0].style.filter = obj.childNodes[0].style.filter.replace("alpha(opacity=60)", "");
		}
		
		if (obj.childNodes.length==3)
			Flow_SetNodeStyle(obj.childNodes[2], "#0000FF");
		else
			Flow_SetNodeStyle(obj.childNodes[1], "#0000FF");
	}
}

//*************************************************************
// 功能描述： 设置对象样式
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SetNodeStyle(obj, strColor)
{
    if (obj) {//2012-11-8
        if (typeof (obj.style) != "undefined")
        	obj.style.color = strColor;
    }
}

//*************************************************************
// 功能描述： 将指定对象设当前选中对象
// 参数描述： obj - 当前对象
//-------------------------------------------------------------
function Flow_SetCurrentActiveNode(obj)
{
	if(obj == null)
	{
		FlowArea.CurrentActiveNode = null;
	}
	else
	{
		if (FlowArea.CurrentActiveNode != null && FlowArea.CurrentActiveNode.id != obj.id)
		{
			FlowArea.CurrentActiveNode.Deactivate(FlowArea.CurrentActiveNode);
		}
		if (obj.id && obj.id!="FlowArea")
		{
			FlowArea.CurrentActiveNode = obj;
			FlowArea.CurrentActiveNode.Activate(obj);
		}
	}
	// 设置工具栏编辑状态
	Flow_SetFlowToolBarEditStatus();
}

//*************************************************************
// 功能描述： 创建节点表单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CreateActiveNodeField()
{
	var objs = FlowArea.FlowNodes.Nodes;
	var strFlowNodes = "";
	for(var i = 0; i < objs.length; i++)
	{
		var strStyleFilter = objs[i].childNodes[0].style.filter.replace("alpha(opacity=60)", "");
		if(strFlowNodes == "")
			strFlowNodes = objs[i].id +","+ objs[i].Name +","+ objs[i].NodeType +","+ objs[i].childNodes[0].src +","+ objs[i].style.pixelLeft +","+ objs[i].style.pixelTop +","+ strStyleFilter +","+ objs[i].MapX +","+ objs[i].MapY +","+ objs[i].WorkId;
		else
			strFlowNodes += ";" + objs[i].id +","+ objs[i].Name +","+ objs[i].NodeType +","+ objs[i].childNodes[0].src +","+ objs[i].style.pixelLeft +","+ objs[i].style.pixelTop +","+ strStyleFilter +","+ objs[i].MapX +","+ objs[i].MapY +","+ objs[i].WorkId;
	}
	//alert(strFlowNodes);
	Flow_CreateHiddenField("FlowNodes", strFlowNodes);
}

//*************************************************************
// 功能描述： 通过键盘移动对象
// 参数描述： 无
//-------------------------------------------------------------
document.onkeydown = CheckKeyPress;
function CheckKeyPress()
{
	var obj = Flow_GetCurrentActiveNode();
	// 如果没有设置当前对象则退出
	if(!obj)
	{
		return;
	}

	var intStep = 5;

	if(event.ctrlKey)
		intStep = 1;
	
	// 记录移动前的位置
	var aryNodePosition = new Array();
	if (event.keyCode != 46)
	{
		aryNodePosition[0] = obj.style.pixelLeft;
		aryNodePosition[1] = obj.style.pixelTop;
	}

	// 使用键盘操作对象
	switch(event.keyCode)
	{
		case 46:
			Flow_RemoveActiveNode();
			return;
		case 40:
			obj.style.pixelTop += intStep;
			break;
		case 39:
			obj.style.pixelLeft += intStep;
			break;
		case 38:
			obj.style.pixelTop -= intStep;
			break;
		case 37:
			obj.style.pixelLeft -= intStep;
			break;
		default:
			return;
	}
	
	// 记录移动后的位置
	aryNodePosition[2] = obj.style.pixelLeft;
	aryNodePosition[3] = obj.style.pixelTop;
	// 保存位置移动操作
	Flow_SaveOperation(obj, "Move", aryNodePosition);
	// 重新设置连接对象位置
	Flow_ResetResultPosition(obj);
}

//*************************************************************
// 功能描述： 通过右键移除对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RemoveActiveNode()
{
	// 如果鼠标焦点在当前要删除对象才删除
	if(event.srcElement.type != "text")
	{
		var obj = Flow_GetCurrentActiveNode();
		if(obj)
		{
			var strNodeName = obj.Name;			
			if(strNodeName == "None")
			{
				// 取得相关的动作对象
				var objResults = Flow_GetRelationResults(obj);
				// 保存操作到列表
				Flow_SaveOperation(obj, "Delete", objResults);

				// 如果还没有取名就要删除说明用户不想建立该对象则关闭对象命名窗口
				Flow_HiddenNodeNameDiv();
				Flow_RemoveNodeFromFlow(obj);
			}
			else
			{
				//开始和结束节点不能删除
				if (obj && (obj.NodeType=="StartNode" || obj.NodeType=="EndNode")){
					return;
				}				
				if(obj && confirm("确认要删除【"+ strNodeName +"】对象？"))
				{
					// 取得相关的动作对象
					var objResults = Flow_GetRelationResults(obj);
					// 保存操作到列表
					Flow_SaveOperation(obj, "Delete", objResults);

					Flow_RemoveNodeFromFlow(obj);
				}
			}
		}
	}
}

//*************************************************************
// 功能描述： 移除所有节点
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RemoveAllActiveNode()
{
	Flow_SetCurrentActiveNode(null);
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		FlowArea.removeChild(objs[i]);
	}
	objs.splice(0, objs.length)	
}

//*************************************************************
// 功能描述： 丛流程区域删除指定对象
// 参数描述： obj - 要删除的对象
//-------------------------------------------------------------
function Flow_RemoveNodeFromFlow(obj)
{
	// 设置当前活动节点为空
	Flow_SetCurrentActiveNode(null);

	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		//if(objs[i].Name && objs[i].Name == obj.Name)
		if(objs[i].id && objs[i].id == obj.id)
		{
			// 丛工作区域移出对象
			FlowArea.removeChild(obj);
			// 丛数组移出对象
			objs.splice(i, 1);
			// 删除相关动作连线
			Flow_RemoveResultFromFlow(obj);
			// 对象发生改变
			Flow_NodeHasChanged();
			return;
		}
	}
}

//*************************************************************
// 功能描述： 丛流程区域删除相关动作连线
// 参数描述： obj
//-------------------------------------------------------------
function Flow_RemoveResultFromFlow(obj)
{
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		if((objs[i].FromNode && objs[i].FromNode == obj.id) || (objs[i].ToNode && objs[i].ToNode == obj.id))
		{
			//************************ start *************************************
			//if( objs[i].ToNode && objs[i].ToNode == obj.id )
			//{
			//	//如果是条件节点，去除分支节点的某一个连接节点属性
			//	if( document.getElementById(objs[i].FromNode) && document.getElementById(objs[i].FromNode).NodeType == "SplitNode" )
			//		Flow_RemoveSplitNodeAttribute(document.getElementById(objs[i].FromNode), obj.id);
			//}
			//--------------------------- end ----------------------------------
			try{//2012-11-8
			FlowArea.removeChild(objs[i]);
			}catch(e){}
			objs.splice(i, 1);
			Flow_RemoveResultFromFlow(obj);
			
			return;
		}
	}
}

//*************************************************************
// 功能描述： 显示节点右键菜单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowActiveNodeContextmenu()
{
	var obj = document.elementFromPoint(event.x, event.y);
	// 如果没有得到对象则直接退出
	if (!obj)
	{
		return;
	}
	// 如果得到的是目标对象的子对象
	if (obj.id == "")
	{
		obj = obj.parentNode;
	}
	Flow_SetCurrentActiveNode(obj);

	// 处理菜单出界情况
	var intLeft = event.x + 5;
	var intTop = event.y;
	if(intLeft > document.body.offsetWidth - ActiveNodeContextmenuDiv.style.pixelWidth)
	{
		intLeft = obj.style.pixelLeft - ActiveNodeContextmenuDiv.style.pixelWidth - 1;
	}
	if(intTop > document.body.offsetHeight - ActiveNodeContextmenuDiv.style.pixelHeight)
	{
		intTop = obj.style.pixelTop - ActiveNodeContextmenuDiv.style.pixelHeight - 1;
	}
	/*
	if(intLeft > document.body.offsetWidth - ActiveNodeContextmenuDiv.style.pixelWidth)
	{
		intLeft = document.body.offsetWidth - ActiveNodeContextmenuDiv.style.pixelWidth - 1;
	}
	
	if(intTop > document.body.offsetHeight - ActiveNodeContextmenuDiv.style.pixelHeight)
	{
		intTop = document.body.offsetHeight - ActiveNodeContextmenuDiv.style.pixelHeight - 1;
	}
	*/
	ActiveNodeContextmenuDiv.style.pixelLeft = intLeft;
	ActiveNodeContextmenuDiv.style.pixelTop = intTop;

	ActiveNodeContextmenuDiv.filters.revealTrans.Apply();
	ActiveNodeContextmenuDiv.style.display = "block";
	ActiveNodeContextmenuDiv.filters.revealTrans.Play();

	// 开始节点和结束节点不允许复制和删除
	Flow_SetNodeContentMenuStatus(obj);
}

//*************************************************************
// 功能描述： 关闭节点右键菜单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CloseActiveNodeContextmenu()
{
	ActiveNodeContextmenuDiv.style.display = "none";
}

//*************************************************************
// 功能描述： 显示流程区域右键菜单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowFlowContextmenu()
{
	// 处理菜单出界情况
	var intLeft = event.x + 5;
	var intTop = event.y;
	if(intLeft > document.body.offsetWidth - FlowContextmenuDiv.style.pixelWidth)
	{
		intLeft = document.body.offsetWidth - FlowContextmenuDiv.style.pixelWidth - 1;
	}
	
	if(intTop > document.body.offsetHeight - FlowContextmenuDiv.style.pixelHeight)
	{
		intTop = document.body.offsetHeight - FlowContextmenuDiv.style.pixelHeight - 1;
	}

	FlowContextmenuDiv.style.pixelLeft = intLeft;
	FlowContextmenuDiv.style.pixelTop = intTop;

	FlowContextmenuDiv.filters.revealTrans.Apply()
	FlowContextmenuDiv.style.display = "block";
	FlowContextmenuDiv.filters.revealTrans.Play()

	// 判断是否有可粘贴内容
	if(objCopy)
	{
		PlastTd.disabled = false;
		PlastTd.onclick = Flow_PlastActiveNode;
	}
	else
	{
		PlastTd.disabled = true;
		PlastTd.onclick = "";
	}

	// 判断是否已经建立流程
	if (FlowArea.FlowNodes.Nodes.length > 0)
	{
		// 流程属性	
		AttributeTd.disabled = false;
		//********************* start ****************************************
		//AttributeTd.onclick = Flow_ShowFlowAttributeDiv;
		AttributeTd.onclick = Flow_ShowFlowAttribute;
		//------------------------ end -------------------------------------
		// 保存流程
		if (bActiveNodeChange)
			SaveFlowTd.disabled = false;
		else
			SaveFlowTd.disabled = true;
		SaveFlowTd.onclick = Flow_SaveFlow;
	}
	else
	{
		// 流程属性
		AttributeTd.disabled = true;
		AttributeTd.onclick = "";
		// 保存流程
		if (bActiveNodeChange)
			SaveFlowTd.disabled = false;
		else
			SaveFlowTd.disabled = true;
		
		SaveFlowTd.onclick = "";
	}
}

//*************************************************************
// 功能描述： 显示流程属性界面
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ShowFlowAttribute()
{
	var objReturn = window.showModalDialog(fcpubdata.Path + "/fceform/common/djframe.htm?djsn=wd_pageset&djtype=WF_DSN", window, "dialogHeight:380px; dialogWidth:590px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes");

	if (objReturn){
		Flow_NodeHasChanged();//打开保存按钮
		if (objReturn[0]){
			FlowArea.FlowAttributes = objReturn[0];
			Flow_ChangePageTitle(FlowArea.FlowAttributes.FlowName);
		}
	}		
}

//*************************************************************
// 功能描述： 关闭流程区域右键菜单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CloseFlowContextmenu()
{
	FlowContextmenuDiv.style.display = "none";
}

//*************************************************************
// 功能描述： 复制对象
// 参数描述： 无
//-------------------------------------------------------------
var objCopy = null;
function Flow_CopyActiveNode()
{
	var obj = Flow_GetCurrentActiveNode();
	objCopy = obj;

	// 设置工具栏编辑状态
	Flow_SetFlowToolBarEditStatus();
}

//*************************************************************
// 功能描述： 粘贴对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_PlastActiveNode()
{
	// 创建新的对象
	Flow_CreateActiveNode(objCopy.childNodes[0].src, objCopy.NodeType);

	// 将记录粘贴对象设为空
	objCopy = null;
}

//*************************************************************
// 功能描述： 对象发生改变设置函数
// 参数描述： 无
//-------------------------------------------------------------
function Flow_NodeHasChanged()
{
	if (!bActiveNodeChange){
		// 改变右键菜单保存选项状态
		Flow_EnableSaveFlowMenu();
		// 对象发生改变
		bActiveNodeChange = true;
		// 创建对象表单
		//Flow_CreateHiddenField("bActiveNodeChange", bActiveNodeChange);
	}
}
//*************************************************************
// 功能描述： 恢复未发生改变设置函数
// 参数描述： 无
//-------------------------------------------------------------
function Flow_NodeNotHasChanged()
{
	if (bActiveNodeChange){
		// 改变右键菜单保存选项状态
		Flow_DisableSaveFlowMenu();
		// 对象发生改变
		bActiveNodeChange = false;
	}
}
//修改页面的 title，加上当前流程文件名
function Flow_ChangePageTitle(flowname){
	if(flowname=="")
		document.title = "流程设计器" ;
	else
		document.title = "流程设计器" + "（" + flowname + "）";
}
function Flow_CreateHiddenField(elemID, elemValue)
{
	//alert("Name:"+ elemID);
	//alert("Value:"+ elemValue);
	//theform = _win.GISWin.tool_form;
	//var elem = _win.GISWin.document.getElementById(elemID);
	//if(elem != null)
	//{
		//elem.value = elemValue;
	//}
}

//*************************************************************
// 功能描述： 改变右键菜单保存选项状态
// 参数描述： 无
//-------------------------------------------------------------
function Flow_EnableSaveFlowMenu()
{
	SaveFlowTd.disabled = false;
}

//*************************************************************
// 功能描述： 改变右键菜单保存选项状态
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DisableSaveFlowMenu()
{
	SaveFlowTd.disabled = true;
}

//*************************************************************
// 功能描述： 恢复对象发生改变设置函数
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RestoreNodeChangedStatus()
{
	// 恢复对象未发生改变状态
	bActiveNodeChange = false;
}

//*************************************************************
// 功能描述： 添加流程动作
// 参数描述： 无
//-------------------------------------------------------------
function Flow_AddResult()
{
	Flow_PolyLineStart();
}


//*************************************************************
// 功能描述： 准备开始画动作连线
// 参数描述： 无
//-------------------------------------------------------------
var G_Started = false;
function Flow_PolyLineStart()
{
	if(!G_Started)
	{
		// Add event handlers to Flow
		FlowArea.onmousemove = Flow_PolyLineOnMouseMove;
		FlowArea.ondragstart = Flow_PolyLineOnMouseMove;
		FlowArea.ondblclick = Flow_CancelResult;
		
		G_Started = true;
	}
}

//*************************************************************
// 功能描述： 停止画动作连线
// 参数描述： 无
//-------------------------------------------------------------
function Flow_PolyLineStop()
{
	if(G_Started)
	{
		FlowArea.onmousemove = null;
		FlowArea.ondragstart = null;
		FlowArea.ondblclick = null;

		G_Started = false;
	}
}

//*************************************************************
// 功能描述： 取消动作连接
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CancelResult()
{
	Flow_ClearTempResult();
}

//*************************************************************
// 功能描述： 流程动作连线
// 参数描述： 无
//-------------------------------------------------------------
function Flow_PolyLineOnMouseMove()
{
	var line = document.getElementById("FlowWebEntity");
	
	if(line)
	{
		Flow_UpdatePolyLine(new Flow_Point(event.x+document.body.scrollLeft, event.y+document.body.scrollTop));
		//Flow_UpdatePolyLine(new Flow_Point(event.x+left, event.y+top));
	}

	return false;
}

//*************************************************************
// 功能描述： 重画动作连线
// 参数描述： 无
//-------------------------------------------------------------
function Flow_UpdatePolyLine(currentPoint)
{
	var line = document.getElementById("FlowWebEntity");

	var left = getScroll().left;
	var top = getScroll().top;

	// Clip the current point based on the size of the image:
	currentPoint.x = Math.max(0, Math.min(currentPoint.x , FlowArea.offsetWidth+2));
	currentPoint.y = Math.max(0, Math.min(currentPoint.y , FlowArea.offsetHeight+2));

	// Now set the polylines points collection so that it draws the segments
	// it contains all the previously clicked points + current point (which is moving)
	// + the first point to complete the PolyLine
	var offset = line.lineOffset;
	currentPoint.x = currentPoint.x - offset.x + left;
	currentPoint.y = currentPoint.y - offset.y + top;
	line.points.value = G_StartPoint.x +","+ G_StartPoint.y + 
				" " + currentPoint.x + "," + currentPoint.y;
				
	//alert( G_StartPoint.x +","+ G_StartPoint.y + " " + currentPoint.x + "," + currentPoint.y);
}

getScroll = function () {//计算滚动条的位置   
  var t, l;   
  if (document.documentElement && document.documentElement.scrollTop) {   
  	t = document.documentElement.scrollTop;   
 	 l = document.documentElement.scrollLeft;   
  } else if (document.body) {   
  	t = document.body.scrollTop;   
  	l = document.body.scrollLeft;   
  }   
  else {   
  	t = 0; l = 0;   
  }   
  	return { top: t, left: l };   
  }  

//*************************************************************
// 功能描述： 画出连线对象
// 参数描述： 无
//-------------------------------------------------------------
var G_StartPoint;
var G_FromId;
var G_EndId;
function Flow_PolyLineOnMouseClick(obj)
{
	var left = getScroll().left;
	var top = getScroll().top;
	if (obj && obj.id=="FlowArea") return;	//2012-11-8
	if (obj && obj.id 
		&& obj.NodeType.indexOf("Node") > -1 
		|| (obj.parentNode && obj.parentNode.NodeType.indexOf("Node") > -1))
	{
		if (typeof(obj.parentNode.NodeType)!="undefined" && obj.parentNode.NodeType.indexOf("Node") > -1)
		{
			obj = obj.parentNode;
		}
		var line = document.getElementById("FlowWebEntity");
		if(!line)
		{
			line = document.createElement("<v:polyline filled='false' points=\"0,0\"/>");
			line.style.position = "absolute";			
			line.style.visibility = "visible";
			line.id = "FlowWebEntity";			
			line.style.zIndex = 200;
					
			var stroke = document.createElement("<v:stroke dashstyle='dash' color='#CC0000' EndArrow='Classic' />");
			
			FlowArea.appendChild(line);			
			line.appendChild(stroke);
			

			
			line.lineOffset = new Flow_Point(line.offsetLeft, line.offsetTop);

			if (!G_StartPoint)
			{
				G_StartPoint = new Flow_Point(event.x , event.y);
				var offset = line.lineOffset;
				//G_StartPoint.x = G_StartPoint.x - offset.x + document.body.scrollLeft;
				//G_StartPoint.y = G_StartPoint.y - offset.y + document.body.scrollTop;
				G_StartPoint.x = G_StartPoint.x - offset.x + left;
				G_StartPoint.y = G_StartPoint.y - offset.y + top;
				
				//alert(G_StartPoint.y);
				//G_FromId = obj.id;
				// 结束节点不能指向其它节点
				if (obj.NodeType != "EndNode")
				{
					G_FromId = obj.id;
				}
			}
		}
		else
		{
			G_EndId = obj.id;
			// 不能重复连线，并且不能指向开始节点
			if (!Flow_CheckResultBeExisted(G_FromId, G_EndId) && obj.NodeType != "StartNode")
			{
				Flow_CreateResult(G_FromId, G_EndId);

			}
			// 清除临时连线
			Flow_ClearTempResult();
			//***************** start ********************************************
			//清除指向开始节点的连线
			//if (typeof(G_EndId)!="undefined" && obj.NodeType=="StartNode"){
			//	Flow_ClearTempResult();
			//}
			//添加分支节点的属性
			if (typeof(G_FromId)!="undefined"){
				var obj = document.getElementById(G_FromId);
				if( obj.NodeType == "SplitNode" )
					Flow_AddSplitNodeAttribute(obj, G_EndId);
			}
			//------------------- end ------------------------------------------
		}
	}
	else
	{
		// 如果不是节点对象则不连线
		Flow_ClearTempResult();
	}

	return false;
}

//*************************************************************
// 功能描述： 添加条件节点的属性
// 参数描述： 无
//-------------------------------------------------------------
function Flow_AddSplitNodeAttribute(objNode, strEndId)
{
	if( !objNode.NodePropertys.NodeConditions )
		objNode.NodePropertys.NodeConditions = new Array();

	var objCondition = new NodeCondition();
	objCondition.NodeIdentify = strEndId;
	objCondition.NodeName = Flow_GetNodeDefaultName(document.getElementById(strEndId).NodeType);
	objCondition.ConditionNote = " ";
	objNode.NodePropertys.NodeConditions[objNode.NodePropertys.NodeConditions.length] = objCondition;
}

//*************************************************************
// 功能描述： 去除条件节点的某一个连接节点属性
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RemoveSplitNodeAttribute(objNode, strToNodeId)
{
	//alert("ok");
	var intToNodeIndex = -1;
	var objNodeConditions = objNode.NodePropertys.NodeConditions;
	for( var i = 0; i < objNodeConditions.length; i++ )
	{
		var objCondition = objNodeConditions[i];
		if( objCondition.NodeIdentify == strToNodeId )
			intToNodeIndex = i;
	}
//	try{
	if( intToNodeIndex > -1 )
		objNodeConditions.splice(intToNodeIndex, 1);
//	}catch(wError){alert(wError);}
//	alert(objNodeConditions.length);
}

//*************************************************************
// 功能描述： 添加新的动作对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CreateResult(strFromId, strEndId)
{
	var line = document.getElementById("FlowWebEntity");
	if (line)
	{
		var activeNode = line;

		var rnd_no = Math.round(Math.random() * 10000);
		//var date_time = new Date();
		//var Node_id = "Result_" + date_time.valueOf() + rnd_no;
		var Node_id = rnd_no;

		activeNode.id = Node_id;
		activeNode.NodeType = "Result";
		activeNode.Name = "连线节点";
		activeNode.FromNode = strFromId;
		activeNode.ToNode = strEndId;
		activeNode.Activate = Flow_SetNodeActivate;
		activeNode.Deactivate = Flow_SetNodeDeActivate;
		activeNode.onmousedown = Flow_MoveActiveNode;
		activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
		activeNode.ondblclick = Flow_ChangeActiveNodeName;
		
		//********************** start ***************************************
		var objProperty = new NodePropertys();
		objProperty.ID = Node_id; 
		objProperty.Name = activeNode.Name.Name;
		objProperty.OldStatus = "Finished";
		objProperty.Status = "Underway";
		//objProperty.DealMan = "";
		//objProperty.AlermNumber = "";
		//objProperty.EndNumber = "";
		activeNode.NodePropertys = objProperty;
		//------------------------- end ------------------------------------

		// Add the activeNode to the document body:
		FlowArea.appendChild(activeNode);
		
		FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
		Flow_SetCurrentActiveNode(activeNode);
		
		var objFromNode = document.getElementById(strFromId);
		var objToNode = document.getElementById(strEndId);
		var strPointsValue = getResultPoints("PolyLine", objFromNode, objToNode);
		activeNode.points.value = strPointsValue;
		// 保存操作到列表
		Flow_SaveOperation(activeNode, "Add", null);
	}
}
//*************************************************************
// 功能描述： 从系统重新恢复连线输出
// 参数描述： 无(strResultId,strFromId, strEndId,strOuterHTML)
//-------------------------------------------------------------
function Flow_BuildResult(strResultId,strFromId, strEndId,strOuterHTML)
{
	FlowArea.insertAdjacentHTML('beforeEnd',strOuterHTML);
	//document.body.insertAdjacentHTML('beforeEnd',strOuterHTML);
	
	var activeNode = document.getElementById(strResultId);
	activeNode.style.visibility = "hidden";
	activeNode.Activate = Flow_SetNodeActivate;
	activeNode.Deactivate = Flow_SetNodeDeActivate;
	activeNode.onmousedown = Flow_MoveActiveNode;
	activeNode.oncontextmenu = Flow_ShowActiveNodeContextmenu;
	activeNode.ondblclick = Flow_ChangeActiveNodeName;
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
	Flow_SetCurrentActiveNode(activeNode);
	
	//var objFromNode = document.getElementById(strFromId);
	//var objToNode = document.getElementById(strEndId);
	//var strPointsValue = getResultPoints("PolyLine", objFromNode, objToNode);
	//activeNode.points.value = strPointsValue;		
	

	
}

//*************************************************************
// 功能描述： 重新设置动作连线的位置
// 参数描述： obj是node对象
//-------------------------------------------------------------
function Flow_ResetResultPosition(obj)
{
	if (obj.id && obj.NodeType.indexOf("Node") >-1)
	{
		// 取得相关的动作对象
		var objResults = Flow_GetRelationResults(obj);
		var intTop = obj.style.top;
		var intLeft = obj.style.left;
		for (var i = 0; i < objResults.length; i++)
		{
			var objFromNode = document.getElementById(objResults[i].FromNode);
			var objToNode = document.getElementById(objResults[i].ToNode);
			var strPointsValue = getResultPoints("PolyLine", objFromNode, objToNode);
			objResults[i].points.value = strPointsValue;
		}
	}
}
//*************************************************************
// 功能描述： 重新设置动作连线的位置 装入的时候重新设置
// 参数描述： obj是Result对象 
//-------------------------------------------------------------
function Flow_ResetResultsPosition()
{
	var len = FlowArea.FlowNodes.Nodes.length;
	var obj,objFromNode,objToNode;
	var strPointsValue;
	for (var i=0;i<len;i++){
		obj = FlowArea.FlowNodes.Nodes[i];		
		if (obj.id && obj.NodeType == "Result" )
		{
			objFromNode = document.getElementById(obj.FromNode);
			objToNode = document.getElementById(obj.ToNode);
			var strPointsValue = getResultPoints("PolyLine", objFromNode, objToNode);
			obj.points.value = strPointsValue;
			obj.style.visibility = "visible";
		}
	}
}
//*************************************************************
// 功能描述： 取得相关的动作对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetRelationResults(obj)
{
	var objs = FlowArea.FlowNodes.Nodes;
	var objResults = new Array();
	var intIndex = 0;
	for(var i = 0; i < objs.length; i++)
	{
		// 如果是节点图像则进行检查
		if(objs[i].NodeType == "Result" && (objs[i].FromNode == obj.id || objs[i].ToNode == obj.id))
		{
			objResults[intIndex] = objs[i];
			intIndex++;
		}
	}
	return objResults;
}

//*************************************************************
// 功能描述： 检查动作连线是否已经存在两个对象之间 两个对象之间可以画多条连线
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CheckResultBeExisted(strFromId, strEndId)
{
	// 只有当起始和终止节点有效后才判断
/*	if (strFromId && strEndId)
	{
		// 如果是指向自己则自动退出
		if (strFromId == strEndId)
		{
			return true;
		}

		var objs = FlowArea.FlowNodes.Nodes;
		for(var i = 0; i < objs.length; i++)
		{
			// 如果是节点图像则进行检查
			if(objs[i].NodeType == "Result")
			{
				if (objs[i].FromNode == strFromId && objs[i].ToNode == strEndId)
				{
					return true;
				}
			}
		}
	}*/
	return false;
}

//*************************************************************
// 功能描述： 清除动作连线
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ClearTempResult()
{
	var line = document.getElementById("FlowWebEntity");
	if(line)
	{
		// 移除动作线
		FlowArea.removeChild(line);
	}
	Flow_PolyLineStop();
	// 恢复设置动作连线工具状态
	Flow_ResetFlowToolBar();
	// 恢复动作连线标识变量
	G_StartPoint = null;
}

//*************************************************************
// 功能描述： 恢复设置动作连线工具状态
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ResetFlowToolBar()
{
	// 粘贴对象时候可能出错
	try
	{
		// 判断是否已经恢复过
		var obj = Flow_GetCurrentActiveNode();
		if (obj)
		{
			FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
			FlowArea.style.cursor = "default";
			Flow_SetCurrentTool("None");
			// 设置FlowArea下面全部元素鼠标样式
			Flow_SetCursorStyle("");
		}
	}
	catch(wError){}
}

//*************************************************************
// 功能描述： 组织点对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_Point(x, y)
{
	this.x = parseInt(x);
	this.y = parseInt(y);
}

//*************************************************************
// 功能描述： 判断点对象位置是否重复
// 参数描述： 无
//-------------------------------------------------------------
function Flow_IfNodeRepeat(fromStepX, fromStepY, fromStepWidth, fromStepHeight, toStepX, toStepY, toStepWidth, toStepHeight)
{
	return (fromStepX + fromStepWidth >= toStepX) && (fromStepY + fromStepHeight >= toStepY) && (toStepX + toStepWidth >= fromStepX) && (toStepY + toStepHeight >= fromStepY);
}

//*************************************************************
// 功能描述： 重新组织点对象位置
// 参数描述： 无
//-------------------------------------------------------------
function getResultPoints(actionType, fromStep, toStep)
{
	if (fromStep==null || toStep==null) return '';

	var pointsHTML = '';

	var fromStepWidth = parseInt(fromStep.style.width);
	var fromStepHeight = parseInt(fromStep.style.height);
	var toStepWidth = parseInt(toStep.style.width);
	var toStepHeight = parseInt(toStep.style.height);
	var fromStepX = parseInt(fromStep.style.left);
	var fromStepY;
	if(parseInt(fromStep.style.top)<=FlowNodeElement.style.pixelHeight)
	{
		fromStepY = FlowNodeElement.style.pixelHeight;
			
	}
	else
	{
		fromStepY = parseInt(fromStep.style.top);
	}
		
		
	var toStepX = parseInt(toStep.style.left);
		
	var toStepY;
	if(parseInt(toStep.style.top)<=FlowNodeElement.style.pixelHeight)
	{
		toStepY = FlowNodeElement.style.pixelHeight;
	}
	else
	{
		toStepY = parseInt(toStep.style.top);
	}
	
	//var fromStepY = parseInt(fromStep.style.top);
	//var toStepX = parseInt(toStep.style.left);
	//var toStepY = parseInt(toStep.style.top);

	//FromStep Center X,Y
	fromCenterX = fromStepX + parseInt(fromStepWidth/2);
	fromCenterY = fromStepY + parseInt(fromStepHeight/2);
	//ToStep Center X,Y
	toCenterX = toStepX + parseInt(toStepWidth/2);
	toCenterY = toStepY + parseInt(toStepHeight/2);

	if(actionType=='Line' && fromStep!=toStep)
	{
		//以下是Line的画线算法
		//ToStep：左上顶点
		toStepX1 = toStepX;
		toStepY1 = toStepY;
		//ToStep：右上顶点
		toStepX2 = toStepX + toStepWidth;
		toStepY2 = toStepY;
		//ToStep：左下顶点
		toStepX3 = toStepX;
		toStepY3 = toStepY + toStepHeight;
		//ToStep：右下顶点
		toStepX4 = toStepX + toStepWidth;
		toStepY4 = toStepY + toStepHeight;

		//如果ToStep在FromStep的右下方，则取ToStep的左上顶点
		if (toStepX>fromStepX && toStepY>fromStepY) {toX = toStepX1;toY = toStepY1;}
		//如果ToStep在FromStep的左下方，则取ToStep的右上顶点
		if (toStepX<fromStepX && toStepY>fromStepY) {toX = toStepX2;toY = toStepY2;}
		//如果ToStep在FromStep的右上方，则取ToStep的左下顶点
		if (toStepX>fromStepX && toStepY<fromStepY) {toX = toStepX3;toY = toStepY3;}
		//如果ToStep在FromStep的左上方，则取ToStep的右下顶点
		if (toStepX<fromStepX && toStepY<fromStepY) {toX = toStepX4;toY = toStepY4;}

		pointsHTML = 'from="'+fromCenterX+','+fromCenterY+'" to="'+toX+','+toY+'"'; 
	}
	else
	{
		//以下是PolyLine的画线算法

		if(fromStep!=toStep)
		{
			//步骤是否叠盖: 叠盖就不画连线
			if (Flow_IfNodeRepeat(fromStepX, fromStepY, fromStepWidth, fromStepHeight, toStepX, toStepY, toStepWidth, toStepHeight)) 
			{
				return "";
			} 

			point2X = fromCenterX;
			point2Y = toCenterY;

			if (toCenterX > fromCenterX) 
			{		  
				absY = toCenterY>=fromCenterY?toCenterY-fromCenterY:fromCenterY-toCenterY;
				if (parseInt(fromStepHeight/2)>=absY) 
				{
					point1X = fromStepX + fromStepWidth;
					point1Y = toCenterY;
					point2X = point1X;
					point2Y = point1Y;
				}
				else
				{
					point1X = fromCenterX;
					point1Y = fromCenterY<toCenterY?fromStepY+fromStepHeight:fromStepY;
				}
				absX = toCenterX-fromCenterX;
				if (parseInt(fromStepWidth/2) >= absX)
				{
					point3X = fromCenterX;
					point3Y = fromCenterY<toCenterY?toStepY:toStepY+toStepHeight;
					point2X = point3X;
					point2Y = point3Y;
				}
				else
				{
					point3X = toStepX;
					point3Y = toCenterY;
				}		   
			}
			if (toCenterX < fromCenterX)
			{
				absY = toCenterY>=fromCenterY?toCenterY-fromCenterY:fromCenterY-toCenterY;
				if (parseInt(fromStepHeight/2) >= absY)
				{
					point1X = fromStepX;
					point1Y = toCenterY;
					point2X = point1X;
					point2Y = point1Y;
				}
				else
				{
					point1X = fromCenterX;
					point1Y = fromCenterY<toCenterY?fromStepY+fromStepHeight:fromStepY;
				}
				absX = fromCenterX-toCenterX;
				if (parseInt(fromStepWidth/2)>=absX) 
				{
					point3X = fromCenterX;
					point3Y = fromCenterY<toCenterY?toStepY:toStepY+toStepHeight;
					point2X = point3X;
					point2Y = point3Y;
				}
				else
				{
					point3X = toStepX + toStepWidth;
					point3Y = toCenterY;
				}		   
			}
			if (toCenterX == fromCenterX)
			{
				point1X = fromCenterX;
				point1Y = fromCenterY>toCenterY?fromStepY:fromStepY+fromStepHeight;
				point3X = fromCenterX;
				point3Y = fromCenterY>toCenterY?toStepY+toStepHeight:toStepY;
				point2X = point3X;point2Y = point3Y;
			}
			if (toCenterY == fromCenterY) 
			{
				point1X = fromCenterX>toCenterX?fromStepX:fromStepX+fromStepWidth;
				point1Y = fromCenterY;
				point3Y = fromCenterY;
				point3X = fromCenterX>toCenterX?toStepX+toStepWidth:toStepX;
				point2X = point3X;point2Y = point3Y;
			}	   

			pointsHTML = point1X+','+point1Y+' '+point2X+','+point2Y+' '+point3X+','+point3Y;
		}
		else
		{
			var constLength = 30;
			point0X = fromStepX+fromStepWidth-constLength;
			point0Y = fromStepY+fromStepHeight;
			point1X = point0X;
			point1Y = point0Y+constLength;
			point2X = fromStepX+fromStepWidth+constLength;
			point2Y = point1Y;
			point3X = point2X;
			point3Y = point0Y-constLength;
			point4X = fromStepX+fromStepWidth;
			point4Y = point3Y;

			pointsHTML = point0X+','+point0Y+' '+point1X+','+point1Y+' '+point2X+','+point2Y+' '+point3X+','+point3Y+' '+point4X+','+point4Y;
		}
	}

	return pointsHTML;
}

//*************************************************************
// 功能描述： 工具初始化设置
// 参数描述： 无
//-------------------------------------------------------------
function SetupTool(objTool, activeSrc, inactiveSrc, strCursor, objCommand, objOrder)
{
	objTool.Activate = Flow_ToolActivate;
	objTool.Deactivate = Flow_ToolDeactivate;
	objTool.activeSrc = activeSrc;
	objTool.inactiveSrc = inactiveSrc;
	if (strCursor)
	{
		objTool.cursorUrl = strCursor;
	}
	if (objCommand)
	{
		objTool.command = objCommand;
	}
	if (objOrder)
	{
		objTool.order = objOrder;
	}
}

//*************************************************************
// 功能描述： 当前流程工具
// 参数描述： 无
//-------------------------------------------------------------
function Flow_FlowTool()
{
	this.Name = "";
}

//*************************************************************
// 功能描述： 流程工具集合
// 参数描述： 无
//-------------------------------------------------------------
function Flow_FlowTools()
{
}

//*************************************************************
// 功能描述： 激活当前工具
// 参数描述： 无
//-------------------------------------------------------------
var objTimer = null;
function Flow_ActivateTool (tool, strNodeImage, strNodeType)
{
	// 如果点击了任意工具即停止流程模拟
	if (!G_StopSimulation)
	{
		// 清除临时示意图
		Flow_ClearMovingHintChart();
	}
	// 如果点击了动作连线工具则取消动作连线
	Flow_PolyLineStop();

	if(tool.order)
	{
		tool.Activate(tool);
		tool.order();
		objTimer = setTimeout("Flow_DeactivateCommandTool('"+ tool.id +"')", 200);

		// 恢复工具栏状态
		Flow_SetFlowToolBarStatus();
		// 恢复设置动作连线工具状态
		Flow_ResetFlowToolBar();
		return;
	}
	
	if (FlowArea.activeToolControl != null && FlowArea.activeToolControl.id == tool.id && FlowArea.activeToolControl.active) {
		FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
		Flow_SetCurrentTool("None");
		// 设置FlowArea下面全部元素鼠标样式
		Flow_SetCursorStyle("");
	} 
	else
	{
		if (FlowArea.activeToolControl != null) FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
		FlowArea.activeToolControl = tool;
		if(FlowArea.activeToolControl != null)
		{
			FlowArea.activeToolControl.Activate(tool);
		}
		
		Flow_SetCurrentTool(tool);
		// 设置FlowArea下面全部元素鼠标样式
		Flow_SetCursorStyle(tool.cursorUrl);
		
		tool.command(strNodeImage, strNodeType);
	} 
}

//*************************************************************
// 功能描述： 恢复工具按钮状态
// 参数描述： 无
//-------------------------------------------------------------
function Flow_DeactivateCommandTool(toolId)
{
	var tool = document.getElementById(toolId);
	tool.Deactivate(tool);
	clearTimeout(objTimer);
}

//*************************************************************
// 功能描述： 设置流程区域的当前工具
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SetCurrentTool(objTool)
{
	if (FlowArea != null && FlowArea.FlowTools != null)
	{
		for (i = 0; i < FlowArea.FlowTools.Tools.length; i++)
		{
			var tool = FlowArea.FlowTools.Tools[i];
			if (tool != null)
			{
				if (objTool.id == tool.Name)
				{
					FlowArea.FlowTools.CurrentTool = objTool;
				}
			}
		}
	}
}

//*************************************************************
// 功能描述： 取得流程区域的当前工具
// 参数描述： 无
//-------------------------------------------------------------
function Flow_GetCurrentTool()
{
	if (FlowArea != null && FlowArea.FlowTools != null)
	{
		return FlowArea.FlowTools.CurrentTool;
	}
}

//*************************************************************
// 功能描述： 激活当前工具
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ToolActivate(tool)
{
	tool.src = tool.activeSrc;
	tool.active = true;
}

//*************************************************************
// 功能描述： 恢复当前工具
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ToolDeactivate(tool)
{
	tool.src = this.inactiveSrc;
	tool.active = false;
}

//*************************************************************
// 功能描述： 取消节点焦点
// 参数描述： 无
//-------------------------------------------------------------
function Flow_CancelActiveNodeFocus()
{
	// 如果在节点上点击右键则不取消对象焦点
	if((!event.srcElement.NodeType && !event.srcElement.parentNode.NodeType) && event.srcElement.id && !G_CancelAddNode)
	{
		var obj = Flow_GetCurrentActiveNode();
		Flow_SetNodeDeActivate(obj);
		Flow_SetCurrentActiveNode(null);
		// 显示右键菜单
		Flow_ShowFlowContextmenu();
		// 恢复取消标识
		G_CancelAddNode = false;
	}
	
	event.cancelBubble = true
	event.returnValue = false;
	return false;
}

//*************************************************************
// 功能描述： 关闭相关漂浮菜单
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ClosePopuMenueDiv()
{
	// 关闭右键菜单
	Flow_CloseActiveNodeContextmenu();
	Flow_CloseFlowContextmenu();
}