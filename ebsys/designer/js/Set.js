
//*************************************************************
// 功能描述： 设置工具栏编辑状态
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SetFlowToolBarEditStatus()
{
	var obj = Flow_GetCurrentActiveNode();

	// 处理复制按钮
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
	
	// 处理粘贴按钮
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
	
	// 处理删除按钮
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

	// 处理撤销按钮
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

	// 处理重复按钮
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

	// 处理保存按钮	
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
// 功能描述： 设置工具栏状态
// 参数描述： 无
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
	// 设置工具栏编辑状态
	Flow_SetFlowToolBarEditStatus();
}

//*************************************************************
// 功能描述： 处理菜单特殊情况
// 参数描述： 无
//-------------------------------------------------------------
function Flow_SetNodeContentMenuStatus(obj)
{
	// 开始节点和结束节点不允许复制和删除
	if (obj.NodeType == "StartNode" || obj.NodeType == "EndNode")
	{
		// 复制
		CopyTd.disabled = true;
		CopyTd.onclick = "";
		// 删除
		DeleteTd.disabled = true;
		DeleteTd.onclick = "";
		// 属性
		NodeAttributeTd.disabled = false;
		NodeAttributeTd.onclick = Flow_ModifyActiveNodeName;
	}
	// 动作连线节点只允许删除
	else if (obj.NodeType == "Result")
	{
		// 复制
		CopyTd.disabled = true;
		CopyTd.onclick = "";
		// 删除
		DeleteTd.disabled = false;
		DeleteTd.onclick = Flow_RemoveActiveNode;
		// 属性
		NodeAttributeTd.disabled = true;
		NodeAttributeTd.onclick = "";
	}
	else
	{
		// 复制
		CopyTd.disabled = false;
		CopyTd.onclick = Flow_CopyActiveNode;
		// 删除
		DeleteTd.disabled = false;
		DeleteTd.onclick = Flow_RemoveActiveNode;
		// 属性
		NodeAttributeTd.disabled = false;
		NodeAttributeTd.onclick = Flow_ModifyActiveNodeName;
	}
}

//*************************************************************
// 功能描述： 设置右键菜单操作状态
// 参数描述： 无
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
// 功能描述： 设置FlowArea下面全部元素鼠标样式
// 参数描述： 无
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