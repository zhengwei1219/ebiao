
//*************************************************************
// ���������� ���ù������༭״̬
// ���������� ��
//-------------------------------------------------------------
function Flow_SetFlowToolBarEditStatus()
{
	var obj = Flow_GetCurrentActiveNode();

	// �����ư�ť
	if (!obj || obj.NodeType == "StartNode" || obj.NodeType == "EndNode" || obj.NodeType == "Result")
	{
		var objTool = document.getElementById("CopyNode");
		objTool.style.filter = "alpha(opacity=50)";
		objTool.disabled = true;
	}
	else
	{
		var objTool = document.getElementById("CopyNode");
		objTool.style.filter = "";
		objTool.disabled = false;
	}
	
	// ����ճ����ť
	if (!objCopy)
	{
		var objTool = document.getElementById("PlastNode");
		objTool.style.filter = "alpha(opacity=50)";
		objTool.disabled = true;
	}
	else
	{
		var objTool = document.getElementById("PlastNode");
		objTool.style.filter = "";
		objTool.disabled = false;
	}
	
	// ����ɾ����ť
	if (!obj || obj.NodeType == "StartNode" || obj.NodeType == "EndNode")
	{
		var objTool = document.getElementById("DeleteNode");
		objTool.style.filter = "alpha(opacity=50)";
		objTool.disabled = true;
	}
	else
	{
		var objTool = document.getElementById("DeleteNode");
		objTool.style.filter = "";
		objTool.disabled = false;
	}

	// ��������ť
	var objTool = document.getElementById("UnDo");
	if (G_CurrentHistoryIndex == -1)
	{
		objTool.style.filter = "alpha(opacity=50)";
		objTool.disabled = true;
	}
	else
	{
		objTool.style.filter = "";
		objTool.disabled = false;
	}

	// �����ظ���ť
	var objTool = document.getElementById("ReDo");
	if (G_CurrentHistoryIndex == FlowArea.OperationLists.Operations.length - 1)
	{
		objTool.style.filter = "alpha(opacity=50)";
		objTool.disabled = true;
	}
	else
	{
		objTool.style.filter = "";
		objTool.disabled = false;
	}

	// �����水ť	
	var objTool = document.getElementById("SaveFlow");
	if (!bActiveNodeChange){
		objTool.style.filter = "alpha(opacity=50)";
		objTool.disabled = true;
	}
	else
	{
		objTool.style.filter = "";
		objTool.disabled = false;
	}	
}

//*************************************************************
// ���������� ���ù�����״̬
// ���������� ��
//-------------------------------------------------------------
function Flow_SetFlowToolBarStatus()
{
	var _area = document.getElementById('FlowArea');
	for (var i = 0; i < _area.FlowTools.Tools.length; i++)
	{
		var strToolName = _area.FlowTools.Tools[i].Name;
		var objTool = document.getElementById(strToolName);
		objTool.style.filter = "";
		objTool.disabled = false;
	}
	// ���ù������༭״̬
	Flow_SetFlowToolBarEditStatus();
}

//*************************************************************
// ���������� ����˵��������
// ���������� ��
//-------------------------------------------------------------
function Flow_SetNodeContentMenuStatus(obj)
{
	// ��ʼ�ڵ�ͽ����ڵ㲻�����ƺ�ɾ��
	if (obj.NodeType == "StartNode" || obj.NodeType == "EndNode")
	{
		// ����
		CopyTd.disabled = true;
		CopyTd.onclick = "";
		// ɾ��
		DeleteTd.disabled = true;
		DeleteTd.onclick = "";
		// ����
		NodeAttributeTd.disabled = false;
		NodeAttributeTd.onclick = Flow_ModifyActiveNodeName;
	}
	// �������߽ڵ�ֻ����ɾ��
	else if (obj.NodeType == "Result")
	{
		// ����
		CopyTd.disabled = true;
		CopyTd.onclick = "";
		// ɾ��
		DeleteTd.disabled = false;
		DeleteTd.onclick = Flow_RemoveActiveNode;
		// ����
		NodeAttributeTd.disabled = true;
		NodeAttributeTd.onclick = "";
	}
	else
	{
		// ����
		CopyTd.disabled = false;
		CopyTd.onclick = Flow_CopyActiveNode;
		// ɾ��
		DeleteTd.disabled = false;
		DeleteTd.onclick = Flow_RemoveActiveNode;
		// ����
		NodeAttributeTd.disabled = false;
		NodeAttributeTd.onclick = Flow_ModifyActiveNodeName;
	}
}

//*************************************************************
// ���������� �����Ҽ��˵�����״̬
// ���������� ��
//-------------------------------------------------------------
function Flow_SetOperationStatus(strOperationStatus)
{
	ShowCurrentNodeTd.style.background = "#fefefe";
	ShowAllNodeTd.style.background = "#fefefe";
	HideAllNodeTd.style.background = "#fefefe";
	switch (strOperationStatus)
	{
	}
}

//*************************************************************
// ���������� ����FlowArea����ȫ��Ԫ�������ʽ
// ���������� ��
//-------------------------------------------------------------
function Flow_SetCursorStyle(strCursorUrl)
{
	for (var i = 0; i < FlowArea.childNodes.length; i++)
	{
		 if (typeof(FlowArea.childNodes[i].style)!="undefined")//2012-11-8
			 FlowArea.childNodes[i].style.cursor = strCursorUrl;
	}
	FlowArea.style.cursor = strCursorUrl;
}