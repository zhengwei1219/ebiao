//*************************************************************
// ���������� ��������
// ���������� ��
//-------------------------------------------------------------
var G_CurrentHistoryIndex = -1;
function Flow_UnDo()
{
	// ���г�������
	var operation = FlowArea.OperationLists.Operations[G_CurrentHistoryIndex];
	var objNode = operation.Node;
	var strNodeOperationType = operation.NodeOperationType;
	var objNodeOperationData = operation.NodeOperationData;
	switch (strNodeOperationType)
	{
		case "Add":
		case "Plast":
			// �Ƴ�����
			Flow_RemoveNodeFromFlow(objNode);
			break;
		case "Delete":	
			// ������Ӷ���
			Flow_ReAddFlowNode(objNode, objNodeOperationData);
			break;
		case "Move":
			// ���»ص�ԭ��λ��
			Flow_RepositionNode(objNode, objNodeOperationData, false);
			break;
	}
	// ������������
	G_CurrentHistoryIndex--;
}

//*************************************************************
// ���������� �ظ�����
// ���������� ��
//-------------------------------------------------------------
function Flow_ReDo()
{
	// �ظ���������
	G_CurrentHistoryIndex++;
	// �����ظ�����
	var operation = FlowArea.OperationLists.Operations[G_CurrentHistoryIndex];
	var objNode = operation.Node;
	var strNodeOperationType = operation.NodeOperationType;
	var objNodeOperationData = operation.NodeOperationData;
	switch (strNodeOperationType)
	{
		case "Add":
		case "Plast":
			// ������Ӷ���
			Flow_ReAddFlowNode(objNode, objNodeOperationData);
			break;
		case "Delete":
			// �Ƴ�����
			Flow_RemoveNodeFromFlow(objNode);
			break;
		case "Move":
			// ���»ص�ԭ��λ��
			Flow_RepositionNode(objNode, objNodeOperationData, true);
			break;
	}
}

//*************************************************************
// ���������� ���»ص�ԭ��λ��
// ���������� ��
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

	// ����������������λ��
	//Flow_ResetActionPosition(obj);
}

//*************************************************************
// ���������� ������Ӷ���
// ���������� ��
//-------------------------------------------------------------
function Flow_ReAddFlowNode(obj, objNodeOperationData)
{
	FlowArea.appendChild(obj);
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = obj;
	Flow_SetCurrentActiveNode(obj);
	// ���������ߵ�λ�÷����仯����
	if (obj.NodeType == "Result")
	{
		var objFromNode = document.getElementById(obj.FromNode);
		var objToNode = document.getElementById(obj.ToNode);
		var strPointsValue = getResultPoints("PolyLine", objFromNode, objToNode);
		obj.points.value = strPointsValue;
	}

	// �ָ���ض������߶���
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

	// ����������������λ��
	//Flow_ResetActionPosition(obj);
}

//*************************************************************
// ���������� �������
// ���������� ��
//-------------------------------------------------------------
function Flow_SaveOperation(obj, strOperationType, objOperationData)
{
	var operation = new Flow_Operation();
	operation.Node = obj;
	operation.NodeOperationType = strOperationType;
	operation.NodeOperationData = objOperationData;
	FlowArea.OperationLists.Operations[FlowArea.OperationLists.Operations.length] = operation;
	G_CurrentHistoryIndex = FlowArea.OperationLists.Operations.length - 1;

	// �ָ��༭������״̬
	Flow_SetFlowToolBarEditStatus();
}

//*************************************************************
// ���������� �ظ�����
// ���������� ��
//-------------------------------------------------------------
function Flow_Operation()
{
	this.Node = null;
	this.NodeOperationType = "";
	this.NodeOperationData = null;
}

//*************************************************************
// ���������� �ظ�����
// ���������� ��
//-------------------------------------------------------------
function Flow_Operations()
{
}
