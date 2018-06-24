//*************************************************************
// 功能描述： 撤销操作
// 参数描述： 无
//-------------------------------------------------------------
var G_CurrentHistoryIndex = -1;
function Flow_UnDo()
{
	// 进行撤销操作
	var operation = FlowArea.OperationLists.Operations[G_CurrentHistoryIndex];
	var objNode = operation.Node;
	var strNodeOperationType = operation.NodeOperationType;
	var objNodeOperationData = operation.NodeOperationData;
	switch (strNodeOperationType)
	{
		case "Add":
		case "Plast":
			// 移出对象
			Flow_RemoveNodeFromFlow(objNode);
			break;
		case "Delete":	
			// 重新添加对象
			Flow_ReAddFlowNode(objNode, objNodeOperationData);
			break;
		case "Move":
			// 重新回到原来位置
			Flow_RepositionNode(objNode, objNodeOperationData, false);
			break;
	}
	// 撤销操作记数
	G_CurrentHistoryIndex--;
}

//*************************************************************
// 功能描述： 重复操作
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ReDo()
{
	// 重复操作记数
	G_CurrentHistoryIndex++;
	// 进行重复操作
	var operation = FlowArea.OperationLists.Operations[G_CurrentHistoryIndex];
	var objNode = operation.Node;
	var strNodeOperationType = operation.NodeOperationType;
	var objNodeOperationData = operation.NodeOperationData;
	switch (strNodeOperationType)
	{
		case "Add":
		case "Plast":
			// 重新添加对象
			Flow_ReAddFlowNode(objNode, objNodeOperationData);
			break;
		case "Delete":
			// 移出对象
			Flow_RemoveNodeFromFlow(objNode);
			break;
		case "Move":
			// 重新回到原来位置
			Flow_RepositionNode(objNode, objNodeOperationData, true);
			break;
	}
}

//*************************************************************
// 功能描述： 重新回到原来位置
// 参数描述： 无
//-------------------------------------------------------------
function Flow_RepositionNode(obj, objNodeOperationData, bRedo)
{
	if (bRedo)
	{
		obj.style.left = objNodeOperationData[2];
		obj.style.top = objNodeOperationData[3];
	}
	else
	{
		obj.style.left = objNodeOperationData[0];
		obj.style.top = objNodeOperationData[1];
	}

	// 设置联动动作连线位置
	//Flow_ResetActionPosition(obj);
}

//*************************************************************
// 功能描述： 重新添加对象
// 参数描述： 无
//-------------------------------------------------------------
function Flow_ReAddFlowNode(obj, objNodeOperationData)
{
	FlowArea.appendChild(obj);
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = obj;
	Flow_SetCurrentActiveNode(obj);
	// 处理动作连线的位置发生变化问题
	if (obj.NodeType == "Result")
	{
		var objFromNode = document.getElementById(obj.FromNode);
		var objToNode = document.getElementById(obj.ToNode);
		var strPointsValue = getResultPoints("PolyLine", objFromNode, objToNode);
		obj.points.value = strPointsValue;
	}

	// 恢复相关动作连线对象
	if (objNodeOperationData)
	{
		for (var i = 0; i < objNodeOperationData.length; i++)
		{
			FlowArea.appendChild(objNodeOperationData[i]);
			FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = objNodeOperationData[i];
			Flow_SetCurrentActiveNode(objNodeOperationData[i]);
			if (objNodeOperationData[i].NodeType == "Result") //2012-11-8
			{
			    var objFromNode = document.getElementById(objNodeOperationData[i].FromNode);
			    var objToNode = document.getElementById(objNodeOperationData[i].ToNode);
			    var strPointsValue = getResultPoints("PolyLine", objFromNode, objToNode);
			    objNodeOperationData[i].points.value = strPointsValue;			
			}			
		}
	}

	// 设置联动动作连线位置
	//Flow_ResetActionPosition(obj);
}

//*************************************************************
// 功能描述： 保存操作
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SaveOperation(obj, strOperationType, objOperationData)
{
	var operation = new Flow_Operation();
	operation.Node = obj;
	operation.NodeOperationType = strOperationType;
	operation.NodeOperationData = objOperationData;
	FlowArea.OperationLists.Operations[FlowArea.OperationLists.Operations.length] = operation;
	G_CurrentHistoryIndex = FlowArea.OperationLists.Operations.length - 1;

	// 恢复编辑工具栏状态
	Flow_SetFlowToolBarEditStatus();
}

//*************************************************************
// 功能描述： 重复操作
// 参数描述： 无
//-------------------------------------------------------------
function Flow_Operation()
{
	this.Node = null;
	this.NodeOperationType = "";
	this.NodeOperationData = null;
}

//*************************************************************
// 功能描述： 重复操作
// 参数描述： 无
//-------------------------------------------------------------
function Flow_Operations()
{
}
