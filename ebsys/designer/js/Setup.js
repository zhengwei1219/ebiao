// 流程工具设置
var _area = document.getElementById('FlowArea');
var _tools = new Flow_FlowTools();
_tools.Tools = new Array();
_area.FlowTools = _tools;

var _tool = new Flow_FlowTool();
_tool.Name = "OpenData";
_tools.Tools[_tools.Tools.length] = _tool;

var _tool = new Flow_FlowTool();
_tool.Name = "OpenFile";
_tools.Tools[_tools.Tools.length] = _tool;

var _tool = new Flow_FlowTool();
_tool.Name = "ActionNode";
_tools.Tools[_tools.Tools.length] = _tool;


var _tool = new Flow_FlowTool();
_tool.Name = "SubflowNode";
_tools.Tools[_tools.Tools.length] = _tool;

var _tool = new Flow_FlowTool();
_tool.Name = "JoinNode";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "SplitNode";
_tools.Tools[_tools.Tools.length] = _tool;

var _tool = new Flow_FlowTool();
_tool.Name = "CompNode";
_tools.Tools[_tools.Tools.length] = _tool;

var _tool = new Flow_FlowTool();
_tool.Name = "StepNode";
_tools.Tools[_tools.Tools.length] = _tool;

var _tool = new Flow_FlowTool();
_tool.Name = "NodeResult";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "NewFlow";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "FlowAttribute";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "CheckFlow";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "FlowSimulation";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "DownloadFlow";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "SaveFlow";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "CopyNode";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "PlastNode";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "DeleteNode";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "UnDo";
_tools.Tools[_tools.Tools.length] = _tool;
var _tool = new Flow_FlowTool();
_tool.Name = "ReDo";
_tools.Tools[_tools.Tools.length] = _tool;

// 保存工作区域历史操作数据
var _operations = new Flow_Operations();
_operations.Operations = new Array();
_area.OperationLists = _operations;

function FlowArea_DoPostBack() { __doPostBack('FlowArea','FlowArea_Submit'); }
_area.DoPostBack = FlowArea_DoPostBack;

//*************************************************************
// 功能描述： 流程区域操作提交
// 参数描述： 无
//-------------------------------------------------------------
function __doPostBack(eventTarget, eventArgument) {
	WaitingDiv.style.display = 'block';
	var theform;
	theform = parent.ActionWin.tool_form;
	//alert(bActiveObjectChange);
	if(bActiveObjectChange)
		GIS_CreateActiveObjectField();
	theform.submit();
}

//*************************************************************
// 功能描述： 页面初始化
// 参数描述： 无
//-------------------------------------------------------------
window.onload = Setup_InitPage;
function Setup_InitPage()
{
	// 初始化流程节点
	Setup_InitFlowNodes()
	// 初始化工具栏
	Setup_InitFlowToolBar();
	Flow_OpenWindow();
}

//*************************************************************
// 功能描述： 初始化流程节点
// 参数描述： 无
//-------------------------------------------------------------
function Setup_InitFlowNodes()
{
	var _Nodes = new Flow_FlowNodes();
	_Nodes.Nodes = new Array();
	FlowArea.FlowNodes = _Nodes;
}

//*************************************************************
// 功能描述： 初始化工具栏
// 参数描述： 无
//-------------------------------------------------------------
function Setup_InitFlowToolBar()
{
	var _area = document.getElementById('FlowArea');
	for (var i = 0; i < _area.FlowTools.Tools.length; i++)
	{
		var strToolName = _area.FlowTools.Tools[i].Name;
		if (strToolName != "NewFlow"  && strToolName!="OpenData"&& strToolName!="OpenFile")
		{
			var objTool = document.getElementById(strToolName);
			objTool.style.filter = "alpha(opacity=50)";
			objTool.disabled = "true";
		}
	}
}