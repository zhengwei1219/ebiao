/**
*��ҳ��div��װ������ʵ���켣ͼ 2011-5-13
*wfId :ָ������ʵ��id
*odiv : ҳ���ָ��div
*ds   : �����б������ݼ�����������ֵʱ��null�������г������б�
* ʹ��ʾ��workflow\sys_dj\wf_history_list.dj
**/
var FlowNodes = new Array();//����ڵ�����滻 FlowArea.FlowNodes.Nodes ���Զ��� 2012-10-25
function LoadWorkflowTrace(wfId,FlowArea,ds1){
	var sKey = "?operate=get_history_list";
	sKey+="&wf_id=" + wfId ;
	
	var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");	
	
	var oXml=SetDom(strReturn);

	var bResult=oXml.documentElement.childNodes[0].text;
	var stepInfo = "";
	if (bResult=="false") {
		alert("װ����ʷ���跢�����´���" + oXml.documentElement.childNodes[1].text);
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
	
	//װ������ͼ��
	
	//FlowArea.top = grid1.top + grid1.height;
	//�޸ĳ�һ������ 2012-10-25
	//var _Nodes = new Flow_FlowNodes();
	//_Nodes.Nodes = new Array();
	//$id("FlowArea").setAttribute("FlowNodes", _Nodes);
	//FlowArea.setAttribute("FlowNodes", new Array());
	
	
	var flowPosition = oXml.documentElement.childNodes[2].xml; 
	var dom = SetDom(flowPosition);
	if (dom==null || dom.documentElement==null){
		alert("δ�ҵ����̶��岼��λ����Ϣ��");
		return;
	}
	var len =dom.documentElement.childNodes.length;
	var id,name,nodetype,outerhtml;
	var fromnode_id,tonode_id;
	
	//��svg��Ԫ��׼��
	var browser = GetBrowserKey();
	if (browser.indexOf("msie")<0){
		var svgXml='<svg id="svgRoot" width="2000" height="3000" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
		svgXml+='<marker id="markerEndArrow" viewBox="0 0 30 30" refX="10" refY="13.5" markerUnits="strokeWidth" markerWidth="12" markerHeight="30" orient="auto">';
		svgXml+='<path style="stroke-width:1;stroke:black;fill:black;opacity:1" d="M0.3125 0.625 9.3125 12.625 0.3125 24.625 21.3125 12.625 Z" />';
		svgXml+='</marker>';
		svgXml+='</svg>';
		//FlowArea.insertAdjacentHTML('beforeEnd',svgXml);
		NavJs.insertHtml('beforeEnd',FlowArea,svgXml);
		
	}
	for (var i=0;i<len; i++){
		id = dom.documentElement.childNodes[i].childNodes[0].text;
		name = dom.documentElement.childNodes[i].childNodes[1].text;
		nodetype = dom.documentElement.childNodes[i].childNodes[2].text;
		outerhtml =dom.documentElement.childNodes[i].childNodes[3].text;		
		outerhtml = repStr(outerhtml,'src="images/','src="../../designer/images/');		
		//2011-12-28
		if (nodetype!="StartNode" && nodetype!="EndNode" && nodetype!="Result"){//ȥ�����ڵ��ϵ���򿪵ı��� traceId���벻��2011-9-17
			outerhtml = repStr(outerhtml,'BORDER-RIGHT:','cursor:hand;BORDER-RIGHT:');			
		}
		if (nodetype=="Result"){
			fromnode_id = dom.documentElement.childNodes[i].childNodes[4].text;
			tonode_id  = dom.documentElement.childNodes[i].childNodes[5].text;
			Flow_BuildResult(FlowArea,id,fromnode_id, tonode_id,outerhtml);
		}
		else{
			
			Flow_BuildActiveNode(FlowArea,id, name, nodetype, outerhtml);
		}
	}

	//�����������ߵ�λ�ã����ߵ�λ�û�ƫ��
	Flow_ResetResultsPosition(FlowArea);		
	
	//2011-12-28 ��stepInfo�����б���Ϣ�У��ҵ�dynamicId,traceId,�Ƿ�ǰ���裬��ֵͼ�νڵ㣬ͬһ�������ж���켣ʱ��ȡdynamciId,traceId����
	var oStep = SetDom("<root>" + stepInfo +"</root>");
	if (oStep.documentElement!=null)
		SetStepInfoToIcon(oStep);				
	//��������������ʷ������СͼƬ��ʶ���еĹ켣
	//var oStep = SetDom("<root>" + stepInfo +"</root>");//2011-12-28
	if (oStep.documentElement!=null)
		LoadFlowLittleIcon(oStep);
}
/**����򿪴˽ڵ��ϵı���
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
	var strNodeType = objTag.getAttribute("NodeType");
	var scene = GetSceneKey();
	scene = escape(scene);
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
			//strNodeName = "Эͬ�ڵ�";
			break;
		case "SplitNode":
			//strNodeName = "��֧�ڵ�";
			break;
		case "ActionNode":		
			var stepid = objTag.getAttribute("step_id");
			var dynamicid = objTag.getAttribute("dynamic_id");
			var traceid = objTag.getAttribute("trace_id");
			var stepType = objTag.getAttribute("step_type");//��ǰ���裬��ʷ����
			openHistoryAction(stepid,objTag.id,dynamicid,traceid,stepType,scene);	//2011-12-28	
			break;			
		case "SubflowNode":
			//2012-1-6
			var subwfId = objTag.getAttribute("sub_wfid");
			if (!IsSpace(subwfId) && subwfId!="-1")//2012-1-6
				show_subtrace(subwfId);
			else
				alert("�޹����������̣�");
			//strNodeName = "�����̽ڵ�";
			break;
		case "CompNode":
			//strNodeName = "�����ڵ�";
			var dynamicid = objTag.getAttribute("dynamic_id");
			var traceid = objTag.getAttribute("trace_id");
			var stepType = objTag.getAttribute("step_type");//��ǰ���裬��ʷ����

			openHistoryAction(objTag.id,objTag.getAttribute("ActionId"),dynamicid,traceid,stepType,scene);//2011-12-28
			break;
	}
	
}
function show_subtrace(subwfid){//2012-1-6��ʾ�����̵Ĺ켣ͼ
	var browser = GetBrowserKey();
	var surl="";
	if (browser.indexOf("msie")>=0)
		surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_history_list&djtype=WF";
	else
		surl = location.protocol+'//'+location.host + fcpubdata.path +"/fceform/common/djframe.htm?djsn=wf_history_mini_list&djtype=WF";
	surl +="&wf_id=" + subwfid;
	window.open(surl);				
}
function openHistoryAction(stepId,actionId,dynamicId,traceId,stepType,scene){

	/*if (!IsSpace(subwfId) && subwfId!="-1"){//2012-1-6
		show_subtrace(subwfId);
		return;		
	}*/

	if (stepType=="��ǰ����") stepType="1";
	if (stepType=="��ʷ����") stepType="2";
	
	var sKey = "?operate=get_history_view";
	sKey+="&wf_id=" + wfId ;
	sKey+="&step_id=" + stepId ;//2011-12-28
	sKey+="&action_id=" + actionId;
	sKey+="&step_type=" + stepType;		
	sKey+="&trace_id=" + traceId;	
	
	sKey+="&scene=" + scene;//����
	
	//2011-12-28
	if (dynamicId!=null && dynamicId!="null" && typeof(dynamicId)!="undefined" && dynamicId!="undefined")
		sKey+="&dynamic_instance_id=" + dynamicId;
	
	var strReturn=new Eapi.RunAjax().sendHttp(location.protocol+'//'+location.host + fcpubdata.servletPath + '/WorkflowPortal'+fcpubdata.dotnetVersion + sKey,"");	
	
	var oXml=SetDom(strReturn);

	var bResult=oXml.documentElement.childNodes[0].text;
	
	if (bResult=="false") {
		alert("װ������ʵ���켣�������´���" + oXml.documentElement.childNodes[1].text);
		return;	
	}
		
	var view = oXml.documentElement.childNodes[1].childNodes[0].text;
	var idField = oXml.documentElement.childNodes[1].childNodes[1].text;
	var idFieldValue = oXml.documentElement.childNodes[1].childNodes[2].text;	
	//2011-12-28 ��ͼƬ�ϵ���򿪹켣��id������������¼	
	//if (traceId==null || traceId=="null" || typeof(traceId)=="undefined" || traceId=="undefined")
	//	traceId = oXml.documentElement.childNodes(1).childNodes(3).text;
	
	//if (view=="" || idField=="" || idFieldValue==""){
	if (view==""){
		alert("�޹����ı�����¼��");
		return;
	}
	//�Ӻ�̨��ȡactionId
	if(actionId=="-1") actionId = oXml.documentElement.childNodes[1].childNodes[3].text;	
	
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
		var stepType = oList[i].childNodes[0].text	; // ��ǰ���裻��ʷ����
		var stepid = oList[i].childNodes[2].text;
		var actionid = oList[i].childNodes[4].text;
		//var userActionType = oList.item(i).childNodes(14).text;//�û��ڵ����2012-1-6
		
		var sCurrentIcon = '<IMG style="POSITION: absolute; TOP: 0px;left:0px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="../../fceform/images/wf_little_run.gif">';
		var sHistoryIcon = '<IMG style="POSITION: absolute; TOP: 0px;left:0px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="../../fceform/images/wf_little_ok.gif">';
	
		//var sRedIcon = '<IMG style="POSITION: absolute; TOP: 0px;left:15px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="' + spath + 'fceform/images/wf_banner_red.gif">';
		//var sPurpleIcon = '<IMG style="POSITION: absolute; TOP: 0px;left:15px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="' + spath + 'fceform/images/wf_banner_purple.gif">';

		if (stepid!=-1){
			var oDiv=document.getElementById(stepid);
			
			if (stepType=="��ǰ����")			
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
				if (stepType=="��ǰ����")
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
		var stepType = oList[i].childNodes[0].text	; // ��ǰ���裻��ʷ����
		var stepid = oList[i].childNodes[2].text;
		var actionid = oList[i].childNodes[4].text;
		var dynamicid = oList[i].childNodes[5].text;
		var traceid = oList[i].childNodes[12].text;
		var subwfid = oList[i].childNodes[13].text;//������ʵ��id 2012-1-6
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
	var browser = GetBrowserKey();

	if (browser.indexOf("msie")>=0){
		FlowArea.insertAdjacentHTML('beforeEnd',strOuterHTML);		
	}
	else{
		var path = getLinePointsValue(strOuterHTML); 
		var line = document.createElementNS("http://www.w3.org/2000/svg","path");
		line.setAttribute("id",strResultId);		
		//line.setAttribute("d","M 297 211.5 L 297 241.5 L 338.25 241.5");
		//line.setAttribute("d","M141,174,141,174,198,174");
		line.setAttribute("d",path);
		//id=8043 NodeType="Result" Name="���߽ڵ�" ToNode="4493" FromNode="3352"
		line.setAttribute("NodeType","Result");
		line.setAttribute("FromNode",strFromId);
		line.setAttribute("ToNode",strEndId);
		
		line.setAttribute("style","opacity:1;fill:none;stroke:black;stroke-width:0.8px;stroke-dasharray:5,3;marker-end:url(#markerEndArrow)");
		var svgElement = document.getElementById("svgRoot");
		svgElement.appendChild(line);
		//alert(svgElement.xml);

	}
	var activeNode = document.getElementById(strResultId);
	activeNode.strokecolor = "#030"; //vml������
	activeNode.style.visibility = "hidden";
		
	//FlowArea.FlowNodes.Nodes[FlowArea.FlowNodes.Nodes.length] = activeNode;
	//var nodes = FlowArea.getAttribute("FlowNodes");
	//nodes[nodes.length] = activeNode;
	FlowNodes[FlowNodes.length] = activeNode;
}
function getLinePointsValue(strOuterHTML){
	var path="";
	var start=strOuterHTML.indexOf("points") + 10;
	var end=strOuterHTML.indexOf("filled") - 2;	
	var points = strOuterHTML.substring(start,end);	
	points = repStr(points,"pt","");
	path ="M" + points.trim();

	return path;
}

function Flow_BuildActiveNode(FlowArea,strNodeID, strNodeName, strNodeType, strOuterHTML){
	var browser = GetBrowserKey();
	if (browser.indexOf("msie")<0){//��safari��font�ڵ㲻֧��width���ԣ�����div
		strOuterHTML = repStr(strOuterHTML,"FONT","DIV");
	}
	FlowArea.insertAdjacentHTML('beforeEnd',strOuterHTML);

	var activeNode = document.getElementById(strNodeID);
	
	activeNode.ondblclick = Flow_ShowActiveNodeDetail;// ����򿪲������ϸ��Ϣ	

	if (activeNode.getAttribute("NodeType") =="StartNode"){//��ʾ��
		var sHistoryIcon = '<IMG style="POSITION: absolute; TOP: 0px;lef:0px;BORDER-RIGHT: #000000 0px solid; BORDER-TOP: #000000 0px solid; FILTER: ; BORDER-LEFT: #000000 0px solid; BORDER-BOTTOM: #000000 0px solid"	src="../../fceform/images/wf_little_ok.gif">';
		
		activeNode.innerHTML = sHistoryIcon + activeNode.innerHTML;
	}

	FlowNodes[FlowNodes.length] = activeNode;
}	
//*************************************************************
// ���������� �������ö������ߵ�λ�� װ���ʱ����������
// ���������� obj��Result���� 
//-------------------------------------------------------------
function Flow_ResetResultsPosition(FlowArea){
	//var len = FlowArea.FlowNodes.Nodes.length;
	//var nodes = FlowArea.getAttribute("FlowNodes");
	//var len = nodes.length;
	var len = FlowNodes.length;
	
	var browser = GetBrowserKey();
	var obj,objFromNode,objToNode;
	var strPointsValue;
	//alert(len);
	for (var i=0;i<len;i++){
		//obj = FlowArea.FlowNodes.Nodes[i];
		//var nodes = FlowArea.getAttribute("FlowNodes");
		obj = FlowNodes[i];
		if (browser.indexOf("msie")>=0){
			if (obj.id && obj.NodeType == "Result" )
			{
				objFromNode = document.getElementById(obj.FromNode);
				objToNode = document.getElementById(obj.ToNode);
				var strPointsValue = getResultPoints("PolyLine", objFromNode, objToNode);
				obj.points.value = strPointsValue;		
				obj.style.visibility = "visible";
			}
		}
		else{					
			if (obj.id && obj.getAttribute("NodeType")=="Result"){					
				objFromNode = document.getElementById(obj.getAttribute("FromNode"));
				objToNode = document.getElementById(obj.getAttribute("ToNode"));
				var strPathValue = getResultPoints("path", objFromNode, objToNode);
				//alert(obj.getAttribute("d") + "---" + strPathValue);
				strPathValue = removeRepeatValue(strPathValue);
				obj.setAttribute("d","M" + strPathValue);
				obj.style.visibility = "visible";				
			}
		}
	}
}
//ȥ���ظ���ֵ, �ظ���ֵӰ���ͷ�ķ���
function removeRepeatValue(value){
	//62,130 62,156 62,156
	var pathValue=value;
	var group = value.split(" ");
	var last = "";
	var len = group.length;
	if (len > 0){
		last = group[len-1];
		twolast = group[len-2];
		if (last.trim()==twolast){
			pathValue = group[0] + " " + last;
		}
	}
	return pathValue;	
}
//*************************************************************
// ���������� �������нڵ���
// ���������� ��
//-------------------------------------------------------------
//function Flow_FlowNodes()
//{
//}

//*************************************************************
// ���������� ������֯�����λ��
// ���������� ��
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
		//������Line�Ļ����㷨
		//ToStep�����϶���
		toStepX1 = toStepX;
		toStepY1 = toStepY;
		//ToStep�����϶���
		toStepX2 = toStepX + toStepWidth;
		toStepY2 = toStepY;
		//ToStep�����¶���
		toStepX3 = toStepX;
		toStepY3 = toStepY + toStepHeight;
		//ToStep�����¶���
		toStepX4 = toStepX + toStepWidth;
		toStepY4 = toStepY + toStepHeight;

		//���ToStep��FromStep�����·�����ȡToStep�����϶���
		if (toStepX>fromStepX && toStepY>fromStepY) {toX = toStepX1;toY = toStepY1;}
		//���ToStep��FromStep�����·�����ȡToStep�����϶���
		if (toStepX<fromStepX && toStepY>fromStepY) {toX = toStepX2;toY = toStepY2;}
		//���ToStep��FromStep�����Ϸ�����ȡToStep�����¶���
		if (toStepX>fromStepX && toStepY<fromStepY) {toX = toStepX3;toY = toStepY3;}
		//���ToStep��FromStep�����Ϸ�����ȡToStep�����¶���
		if (toStepX<fromStepX && toStepY<fromStepY) {toX = toStepX4;toY = toStepY4;}

		pointsHTML = 'from="'+fromCenterX+','+fromCenterY+'" to="'+toX+','+toY+'"'; 
	}
	else
	{
		//������PolyLine�Ļ����㷨

		if(fromStep!=toStep)
		{
			//�����Ƿ����: ���ǾͲ�������
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
// ���������� �жϵ����λ���Ƿ��ظ�
// ���������� ��
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
	lblScale.innerText = "��ʾ�ٷֱȣ�" + scale + " %";
}	
/////