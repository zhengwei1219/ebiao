/**
*在页面div中装入流程实例轨迹图 2011-5-13
*wfId :指定流程实例id
*odiv : 页面的指定div
*ds   : 步骤列表的数据集，当不传入值时（null），则不列出步骤列表
* 使用示例workflow\sys_dj\wf_history_list.dj
**/
function LoadWorkflowTrace(wfId,FlowArea,ds1){
	var sKey = "?operate=get_history_list";
	sKey+="&wf_id=" + wfId ;
	
	var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");	
	
	var oXml=SetDom(strReturn);

	var bResult=oXml.documentElement.childNodes[0].text;
	var stepInfo = "";
	if (bResult=="false") {
		alert("装入历史步骤发生如下错误：" + oXml.documentElement.childNodes[1].text);
		return;	
	}
	else{		
		stepInfo = oXml.documentElement.childNodes[1].text;
		if (ds1!=null && typeof(ds1)!="undefined"){
			var s = ds1.xml;				
			//s= "<root>"+strReturn+s.substring(6,s.length);
			s="<root>" + stepInfo + s.substring(6,s.length);
			
			ds1.OpenXmlData(s);
			
		}
	}
	
	//装入流程图形
	
	//FlowArea.top = grid1.top + grid1.height;
	var _Nodes = new Flow_FlowNodes();
	_Nodes.Nodes = new Array();
	//$id("FlowArea").FlowNodes = _Nodes;
	$id("FlowArea").setAttribute("FlowNodes", _Nodes);
	
	
	var flowPosition = oXml.documentElement.childNodes[2].xml; 
	var dom = SetDom(flowPosition);
	if (dom==null || dom.documentElement==null){
		alert("未找到流程定义布局位置信息！");
		return;
	}
	var len =dom.documentElement.childNodes.length;
	var id,name,nodetype,outerhtml;
	var fromnode_id,tonode_id;
	
	for (var i=0;i<len; i++){
		id = dom.documentElement.childNodes[i].childNodes[0].text;
		name = dom.documentElement.childNodes[i].childNodes[1].text;
		nodetype = dom.documentElement.childNodes[i].childNodes[2].text;
		outerhtml =dom.documentElement.childNodes[i].childNodes[3].text;		
		outerhtml = repStr(outerhtml,'src="images/','src="../../designer/images/');		
		//2011-12-28
		if (nodetype!="StartNode" && nodetype!="EndNode" && nodetype!="Result"){//去掉，节点上点击打开的表单 traceId传入不了2011-9-17
			outerhtml = repStr(outerhtml,'style="BORDER-RIGHT:','style="cursor:hand;BORDER-RIGHT:');
		}
		if (nodetype=="Result"){
			fromnode_id = dom.documentElement.childNodes(i).childNodes(4).text;
			tonode_id  = dom.documentElement.childNodes(i).childNodes(5).text;
			Flow_BuildResult($id("FlowArea"),id,fromnode_id, tonode_id,outerhtml);
		}
		else{
			
			Flow_BuildActiveNode($id("FlowArea"),id, name, nodetype, outerhtml);
		}
	}

	//重新设置连线的位置，连线的位置会偏移
	Flow_ResetResultsPosition($id("FlowArea"));		
	
	//2011-12-28 从stepInfo步骤列表信息中，找到dynamicId,traceId,是否当前步骤，赋值图形节点，同一个步骤有多个轨迹时，取dynamciId,traceId最大号
	var oStep = SetDom("<root>" + stepInfo +"</root>");
	if (oStep.documentElement!=null)
		SetStepInfoToIcon(oStep);				
	//查找流程运行历史，增加小图片标识运行的轨迹
	//var oStep = SetDom("<root>" + stepInfo +"</root>");//2011-12-28
	if (oStep.documentElement!=null)
		LoadFlowLittleIcon(oStep);
}
/**点击打开此节点上的任务列表
*/
function Flow_ShowActiveNodeDetail(){
	var obj = document.elementFromPoint(event.x, event.y);
	var objTag =null;
	if (obj!=null && obj.parentNode.id=="FlowArea"){
		objTag = obj;
	}
	else{
		objTag = obj.parentNode;
	}
	var strNodeType = objTag.NodeType;
	var surl = "";
	switch (strNodeType)
	{
		case "StartNode":
			break;
		case "EndNode":
			break;
		case "StepNode":
			surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_steptask_list&djtype=WF";
			//surl +="&nodetype=StepNode";
			surl +="&wf_id=" + wfId;
			surl +="&step_id=" + objTag.id;
			
			window.open(surl);
			break;
		case "JoinNode":
			//strNodeName = "协同节点";
			break;
		case "SplitNode":
			//strNodeName = "分支节点";
			break;
		case "ActionNode":		
			var stepid = objTag.getAttribute("step_id");
			var dynamicid = objTag.getAttribute("dynamic_id");
			var traceid = objTag.getAttribute("trace_id");
			var stepType = objTag.getAttribute("step_type");//当前步骤，历史步骤
			openHistoryAction(stepid,objTag.id,dynamicid,traceid,stepType);	//2011-12-28	
			break;			
		case "SubflowNode":
			//2012-1-6
			var subwfId = objTag.getAttribute("sub_wfid");
			if (!IsSpace(subwfId) && subwfId!="-1")//2012-1-6
				show_subtrace(subwfId);
			else
				alert("无关联的子流程！");
			//strNodeName = "子流程节点";
			break;
		case "CompNode":
			//strNodeName = "步动节点";
			var dynamicid = objTag.getAttribute("dynamic_id");
			var traceid = objTag.getAttribute("trace_id");
			var stepType = objTag.getAttribute("step_type");//当前步骤，历史步骤
			openHistoryAction(objTag.id,objTag.ActionId,dynamicid,traceid,stepType);//2011-12-28
			break;
	}
	
}
function show_subtrace(subwfid){//2012-1-6显示子流程的轨迹图
	var surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_history_list&djtype=WF";
	surl +="&wf_id=" + subwfid;
	window.open(surl);				
}
function openHistoryAction(stepId,actionId,dynamicId,traceId,stepType,subwfId){
	if (!IsSpace(subwfId) && subwfId!="-1"){//2012-1-6
		show_subtrace(subwfId);
		return;		
	}
	
	if (stepType=="当前步骤") stepType="1";
	if (stepType=="历史步骤") stepType="2";
	
	var sKey = "?operate=get_history_view";
	sKey+="&wf_id=" + wfId ;
	sKey+="&step_id=" + stepId ;//2011-12-28
	sKey+="&action_id=" + actionId;
	sKey+="&step_type=" + stepType;	
	
	sKey+="&trace_id=" + traceId;	
	//2011-12-28
	if (dynamicId!=null && dynamicId!="null" && typeof(dynamicId)!="undefined" && dynamicId!="undefined")
		sKey+="&dynamic_instance_id=" + dynamicId;
	
	var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");	
	
	var oXml=SetDom(strReturn);

	var bResult=oXml.documentElement.childNodes(0).text;
	
	if (bResult=="false") {
		alert("装入流程实例轨迹发生如下错误：" + oXml.documentElement.childNodes(1).text);
		return;	
	}
		
	var view = oXml.documentElement.childNodes(1).childNodes(0).text;
	var idField = oXml.documentElement.childNodes(1).childNodes(1).text;
	var idFieldValue = oXml.documentElement.childNodes(1).childNodes(2).text;	
	//2011-12-28 从图片上点击打开轨迹中id号最大的那条记录	
	//if (traceId==null || traceId=="null" || typeof(traceId)=="undefined" || traceId=="undefined")
	//	traceId = oXml.documentElement.childNodes(1).childNodes(3).text;
	
	//if (view=="" || idField=="" || idFieldValue==""){
	if (view==""){
		alert("无关联的表单记录！");
		return;
	}
	//从后台获取actionId
	if(actionId=="-1") actionId = oXml.documentElement.childNodes(1).childNodes(3).text;	
	
	var surl = unescape(view) ;	
	surl = surl + "&wfName=" + WfName ;
	surl = surl + "&wfDesc=" + escape(WfDesc);
	//2011-12-28
	if (stepType=="2")
		surl = surl + "&show=true";
	surl = surl + "&wfVersion=" + WfVersion ;
	surl = surl + "&wfId=" + wfId
	surl = surl + "&actionId=" + actionId;
	surl = surl + "&"+ idField +"=" + idFieldValue;
	
	if (dynamicId!=null && dynamicId!="null" && typeof(dynamicId)!="undefined" && dynamicId!="undefined")
		surl = surl + "&dynamicInstanceId=" + dynamicId;
	//2011-9-17
	if (traceId!=null && traceId!="null" && typeof(traceId)!="undefined" && traceId!="undefined")
		surl = surl + "&traceId=" + traceId;	
	
	window.open(location.protocol+'//'+location.host + fcpubdata.path + surl);	
	return;			

}

function LoadFlowLittleIcon(oXml){
	//var spath = location.protocol+"//"+location.host + fcpubdata.path + "/";
	var oList = oXml.getElementsByTagName("tr");
	for (var i=0;i<oList.length;i++){
		var stepType = oList.item(i).childNodes(0).text	; // 当前步骤；历史步骤
		var stepid = oList.item(i).childNodes(2).text;
		var actionid = oList.item(i).childNodes(4).text;
		//var userActionType = oList.item(i).childNodes(14).text;//用户节点分类2012-1-6
		
		var sCurrentIcon = '<IMG style="POSITION: absolute; TOP: 0px;left:0px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="../../fceform/images/wf_little_run.gif">';
		var sHistoryIcon = '<IMG style="POSITION: absolute; TOP: 0px;left:0px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="../../fceform/images/wf_little_ok.gif">';
	
		//var sRedIcon = '<IMG style="POSITION: absolute; TOP: 0px;left:15px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="' + spath + 'fceform/images/wf_banner_red.gif">';
		//var sPurpleIcon = '<IMG style="POSITION: absolute; TOP: 0px;left:15px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="' + spath + 'fceform/images/wf_banner_purple.gif">';

		if (stepid!=-1){
			var oDiv=document.getElementById(stepid);
			
			if (stepType=="当前步骤")			
				oDiv.innerHTML=sCurrentIcon + oDiv.innerHTML;
			else
				oDiv.innerHTML=sHistoryIcon + oDiv.innerHTML;
			//2012-1-6	
			//if (userActionType=="1") oDiv.innerHTML= sRedIcon + oDiv.innerHTML ;
			//if (userActionType=="2") oDiv.innerHTML= sPurpleIcon + oDiv.innerHTML ;

		}
		
		if (actionid!="-1"){
			var oDiv=document.getElementById(actionid);
			if (oDiv){
				if (stepType=="当前步骤")
					oDiv.innerHTML=sCurrentIcon + oDiv.innerHTML;
				else
					oDiv.innerHTML=sHistoryIcon + oDiv.innerHTML;
				
				//2012-1-6
				//if (userActionType=="1") oDiv.innerHTML= sRedIcon + oDiv.innerHTML ;
				//if (userActionType=="2") oDiv.innerHTML= sPurpleIcon + oDiv.innerHTML;
			}
		}	
	}
}
//2011-12-28 
function SetStepInfoToIcon(oXml){
	var oList = oXml.getElementsByTagName("tr");
	for (var i=oList.length-1;i>=0;i--){
		var stepType = oList.item(i).childNodes(0).text	; // 当前步骤；历史步骤
		var stepid = oList.item(i).childNodes(2).text;
		var actionid = oList.item(i).childNodes(4).text;
		var dynamicid = oList.item(i).childNodes(5).text;
		var traceid = oList.item(i).childNodes(12).text;
		var subwfid = oList.item(i).childNodes(13).text;//子流程实例id 2012-1-6
		//var traceRemark = oList.item(i).childNodes(8).text;		
		if (stepid!=-1){
			var oDiv=document.getElementById(stepid);
			oDiv.setAttribute("step_type",stepType);
			oDiv.setAttribute("dynamic_id",dynamicid);
			oDiv.setAttribute("trace_id",traceid);
			oDiv.setAttribute("sub_wfid",subwfid);//2012-1-6
			//oDiv.setAttribute("trace_remark",traceRemark);
		}
		
		if (actionid!="-1"){
			var oDiv=document.getElementById(actionid);
			if (oDiv){
				oDiv.setAttribute("step_type",stepType);
				oDiv.setAttribute("dynamic_id",dynamicid);
				oDiv.setAttribute("trace_id",traceid);
				oDiv.setAttribute("sub_wfid",subwfid);//2012-1-6
			}
		}	
		
	}	
}

function Flow_BuildResult(FlowArea,strResultId,strFromId, strEndId,strOuterHTML){

	FlowArea.insertAdjacentHTML('beforeEnd',strOuterHTML);
	var activeNode = document.getElementById(strResultId);
	activeNode.strokecolor = "#030";
	activeNode.style.visibility = "hidden";
	
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
}

function Flow_BuildActiveNode(FlowArea,strNodeID, strNodeName, strNodeType, strOuterHTML){
	
	FlowArea.insertAdjacentHTML('beforeEnd',strOuterHTML);
	
	var activeNode = document.getElementById(strNodeID);
	
	activeNode.ondblclick = Flow_ShowActiveNodeDetail;// 点击打开步骤的详细信息	
	
	if (activeNode.NodeType =="StartNode"){//显示打勾
		var sHistoryIcon = '<IMG style="POSITION: absolute; TOP: 0px;lef:0px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="../../fceform/images/wf_little_ok.gif">';
		
		activeNode.innerHTML = sHistoryIcon + activeNode.innerHTML;
	}
	FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
}	


//*************************************************************
// 功能描述： 重新设置动作连线的位置 装入的时候重新设置
// 参数描述： obj是Result对象 
//-------------------------------------------------------------
function Flow_ResetResultsPosition(FlowArea){
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
// 功能描述： 保存所有节点类
// 参数描述： 无
//-------------------------------------------------------------
function Flow_FlowNodes()
{
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
	fromStepY = parseInt(fromStep.style.top);
/*	if(parseInt(fromStep.style.top)<=grid1.style.pixelHeight)
	{
		fromStepY = grid1.style.pixelHeight;
			
	}
	else
	{
		fromStepY = parseInt(fromStep.style.top);
	}
	*/	
		
	var toStepX = parseInt(toStep.style.left);
		
	var toStepY;
	toStepY = parseInt(toStep.style.top);
/*	if(parseInt(toStep.style.top)<=grid1.style.pixelHeight)
	{
		toStepY = grid1.style.pixelHeight;
	}
	else
	{
		toStepY = parseInt(toStep.style.top);
	}
	*/
	
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
// 功能描述： 判断点对象位置是否重复
// 参数描述： 无
//-------------------------------------------------------------
function Flow_IfNodeRepeat(fromStepX, fromStepY, fromStepWidth, fromStepHeight, toStepX, toStepY, toStepWidth, toStepHeight)
{
	return (fromStepX + fromStepWidth >= toStepX) && (fromStepY + fromStepHeight >= toStepY) && (toStepX + toStepWidth >= fromStepX) && (toStepY + toStepHeight >= fromStepY);
}



var scale = 100 ;
function uf_zoom(FlowArea,method){
	if (method=="big"){
		if (scale <200) scale +=20;				
		else  scale =200;			

	}
	if (method=="small"){		
		
		if (scale>20) scale -=20;		
		else scale =20;		
	}	
	FlowArea.style.zoom = scale +"%";	
	
	FlowArea.style.height = 400/(scale/100)  + "px";
	FlowArea.style.width = 1000/(scale/100)  + "px";
	lblScale.innerText = "显示百分比：" + scale + " %";
}	
/////