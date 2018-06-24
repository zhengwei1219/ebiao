//*************************************************************
// ���������� ��������
// ���������� ��
//-------------------------------------------------------------
function Flow_DownloadFlow()
{
	var oAttribute = FlowArea.FlowAttributes;
	
	if (oAttribute==null || typeof(oAttribute)=="undefined" ){		
		alert("���ȱ��������ļ����ļ�Ŀ¼�������أ�");
		return false;
	}
	
	var flowname = oAttribute.FlowName ;
	var flowversion = oAttribute.FlowVersion ;
	var flowsavetype = oAttribute.FlowSaveType;
	if (typeof(flowname)=="undefined" || flowname==""){		
		alert("���ȱ��������ļ����ļ�Ŀ¼�������أ�");
		return false;
	}
	var sPath = fcpubdata.Path + "/designfile/" + flowname + "." + flowversion + ".xml";
	window.open(sPath,"","");

}


//*************************************************************
// ���������� ����У��
// ���������� ��
//-------------------------------------------------------------
function Flow_CheckFlow(bNotShowSuccessInfo)
{
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		// ���õ�ǰ����Ϊ�״̬
		Flow_SetCurrentActiveNode(objs[i]);

		var strNodeTypeName = Flow_GetNodeDefaultName(objs[i].NodeType);
		// ��֧�ڵ㲻��ֻ��һ����������
		//if(objs[i].NodeType == "SplitNode")
		//{
		//	if (Flow_CheckSplitNode(objs[i]))
		//	{
		//		alert("����:��"+ strNodeTypeName +"�� \n����:��"+ objs[i].Name +"��\n��Ϣ: ����ֻ��һ����������");				
		//		return false;
		//	}
		//}
		// ����ʼ�ڵ��ⲻ��û�����뷽��Ľڵ�
		if(objs[i].NodeType != "StartNode" && objs[i].NodeType != "Result")
		{
			if (Flow_CheckPourAndOut(objs[i], "Pour"))
			{
				alert("����:��"+ strNodeTypeName +"�� \n����:��"+ objs[i].Name +"��\n��Ϣ: ����û�����뷽��");
				return false;
			}
		}
		// �������ڵ��ⲻ��û����������Ľڵ�
		if(objs[i].NodeType != "EndNode" && objs[i].NodeType != "Result")
		{
			if (Flow_CheckPourAndOut(objs[i], "Out"))
			{
				alert("����:��"+ strNodeTypeName +"�� \n����:��"+ objs[i].Name +"��\n��Ϣ: ����û����������");
				return false;
			}
		}
		//����ڵ� �������� ���� ��action�ڵ�  step->action->step | step->action->split | step->action->join | split->step | join->step | split->split | split->join | join->join
		if (objs[i].NodeType == "StartNode" || objs[i].NodeType == "StepNode") {
			if ( Flow_CheckNodeResultNode(objs[i])){
				alert("����:��"+ strNodeTypeName +"�� \n����:��"+ objs[i].Name +"��\n��Ϣ: ֻ���붯���ڵ��������������������͵Ľڵ������ߣ�");
				return false;			
			}
		}
		//split �������� ������action�ڵ�
		//join �������� ������action�ڵ�
		if (objs[i].NodeType == "SplitNode" || objs[i].NodeType == "JoinNode") {
			if ( Flow_CheckSplitAndJoinNode(objs[i])){
				alert("����:��"+ strNodeTypeName +"�� \n����:��"+ objs[i].Name +"��\n��Ϣ: �����붯���ڵ������ߣ�");
				return false;			
			}
		}
		
	}
	
	// �Ƿ���ʾ�ɹ���Ϣ
	if (!bNotShowSuccessInfo)
	{
		alert("����У��ɹ���")
	}	

	return true;

}
//*************************************************************
// ���������� ���node���������߶����Ƿ�ΪActionNode
// ���������� ��
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
// ���������� ���node���������߶����Ƿ�ΪActionNode
// ���������� ��
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
// ���������� ��������ģ�����
// ���������� ��
//-------------------------------------------------------------
function Flow_StartFlowSimulation()
{
	// У������
	if (Flow_CheckFlow(true))
	{
		G_StopSimulation = false;
		// ����ģ����濪ʼ
		Flow_Simulation();
	}
}

//*************************************************************
// ���������� ����ģ�����
// ���������� ��
//-------------------------------------------------------------
var objFlowTime = null;
var G_StopSimulation = false;
function Flow_Simulation(objNextNodeList)
{
	if (!G_StopSimulation)
	{
		// �ӿ�ʼ�ڵ㿪ʼ
		if (!objNextNodeList)
		{
			// ������ʼ�ڵ�
			var objs = FlowArea.FlowNodes.Nodes;
			for(var i = 0; i < objs.length; i++)
			{
				var obj = objs[i];
				// �ӿ�ʼ�ڵ㿪ʼ
				if (obj.NodeType == "StartNode")
				{
					// ���1���Ӻ�ִ�ж�Ӧ����
					objFlowTime = setTimeout("Flow_ShowCurrentFlowMovingInfo('"+ obj.id +"')", 1000);
					return;
				}
			}
		}
		// ������������ת�Ķ���
		if (objNextNodeList)
		{
			// ������������ת�������߶���
			if (objNextNodeList.length == 1 && objNextNodeList[0].NodeType != "Result")
			{
				// ���1���Ӻ�ִ�ж�Ӧ����
				objFlowTime = setTimeout("Flow_ShowCurrentFlowMovingInfo('"+ objNextNodeList[0].id +"')", 1000);
			}
			else
			{
				for (var i = 0; i < objNextNodeList.length; i++)
				{
					// ���1���Ӻ�ִ�ж�Ӧ����
					objFlowTime = setTimeout("Flow_ShowCurrentFlowMovingInfo('"+ objNextNodeList[i].id +"')", 1000);
				}
			}
		}
	}
}

//*************************************************************
// ���������� ��ʾ��ǰ��ת�ڵ�ģ����Ϣ
// ���������� ��
//-------------------------------------------------------------
function Flow_ShowCurrentFlowMovingInfo(strNodeId)
{
	if (!G_StopSimulation)
	{
		var obj = document.getElementById(strNodeId);
		if (obj)
		{
			// ���õ�ǰ����Ϊ�״̬
			Flow_SetCurrentActiveNode(obj);
			// ������תʾ���
			Flow_DrawMovingHintChart(obj);
			// ȡ�ú���Ķ���
			var objNextNodeList = new Array();
			objNextNodeList = Flow_GetNextNodeList(obj);
			// ������к���Ķ����������ת
			if (objNextNodeList.length)
			{
				// Ƕ��ִ��
				Flow_Simulation(objNextNodeList);
			}
			else
			{
				// ����������תģ�ⲿ�ֽ���
				alert("������תģ�������");
				// �����ʱʾ��ͼ
				Flow_ClearMovingHintChart();
			}
		}
	}
}

//*************************************************************
// ���������� ȡ�ú���Ķ���
// ���������� ��
//-------------------------------------------------------------
function Flow_GetNextNodeList(obj)
{
	var objNextNodeList = new Array();
	var intIndex = 0;
	if (obj)
	{
		// �ҳ��������ߵ�ָ�����
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
		// �ҳ��ڵ�ĵ�������������
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
// ���������� ������תʾ����Ϣ
// ���������� ��
//-------------------------------------------------------------
function Flow_DrawMovingHintChart(obj)
{
	if (obj.NodeType != "Result")
	{
		// ��ʾ���ýڵ���Ϣ
		Flow_ShowActiveNodeInfo(obj);
	}
	// ������תʾ���
	Flow_DrawMovingHintRetangle(obj);
}

//*************************************************************
// ���������� ������תʾ���
// ���������� ��
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
// ���������� �����ʱʾ��ͼ
// ���������� ��
//-------------------------------------------------------------
function Flow_ClearMovingHintChart()
{
	try
	{
		// ���ʾ���
		if (FlowWebEntity)
		{
			if (FlowWebEntity.length)
			{
				var intCount = FlowWebEntity.length;
				for (var i = 0; i < intCount -1; i++)
				{
					FlowArea.removeChild(FlowWebEntity[0]);
				}
				FlowArea.removeChild(FlowWebEntity);//�������һ��2012-11-8
			}
			else
			{
				FlowArea.removeChild(FlowWebEntity);
			}
		}
		// ���ö������ߵĴ�ϸ
		var objs = FlowArea.FlowNodes.Nodes;
		for(var i = 0; i < objs.length; i++)
		{
			var obj = objs[i];
			// �ӿ�ʼ�ڵ㿪ʼ
			if (obj.NodeType == "Result")
			{
				obj.strokeweight = 0;
			}
		}

		// �Ƿ�ֹͣģ��
		G_StopSimulation = true;
		clearTimeout(objFlowTime);
		// �رսڵ���Ϣ��ʾ��
		Flow_CloseActiveNodeInfo();
	}
	catch(wError){}
}

//*************************************************************
// ���������� �ύ����
// ���������� ��
//-------------------------------------------------------------
function Flow_SaveFlow()
{
	if (!bActiveNodeChange) return;
	// У������
	if (!Flow_CheckFlow(true)) return;
	
	//--------------------------------------------------------------------
	var strXml="";
	var strWorkflow="";
	var strWorkflowDesc="";
	var strFlowRun = "����";
	var strDefsType = "";//ģ�����id
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
			strDefsType = FlowArea.FlowAttributes.FlowDefsType;//ģ�����id
	}
	if (strWorkflow==""){
		alert("�����������Դ��������������ƣ�Ȼ���ٱ��棡");
		return;
	}
	//���  ����״̬������ �����޸� 2011-2-11
	//alert(strFlowRun);
	if (strFlowRun=="����"){
		alert("���ڷ���״̬�����̲����ٴ��޸ģ����������̵İ汾��״̬�޸ĳɶ���󣬲ſ��Ա��棡");
		return;
	}
	
	//FlowArea.FlowNodes.Nodes[].NodeProperty ���汣�����̶�������
	strXml +=Flow_GetWorkflowXmlInfo(); //���̶�����Ϣ
	
	var strUp="<root>" 
	var flowSaveType="database";	
	if (typeof FlowArea.FlowAttributes.FlowSaveType!="undefined")
		flowSaveType =FlowArea.FlowAttributes.FlowSaveType;
	var flowVersion="-1";
	if (typeof FlowArea.FlowAttributes.FlowSaveType!="undefined")
		flowVersion =FlowArea.FlowAttributes.FlowVersion;


	strUp +="<workflow_savetype>" + flowSaveType + "</workflow_savetype>"; //���̱��淽ʽ
	strUp +="<workflow_name>" + strWorkflow + "</workflow_name>"; //��������
	strUp +="<workflow_desc>" + strWorkflowDesc + "</workflow_desc>"; //��������
	strUp +="<workflow_version>" +flowVersion + "</workflow_version>"; //���̰汾 -1��ʾ�½�һ�����汾�ŵ�����
	strUp +="<workflow_defstype>" + strDefsType + "</workflow_defstype>"; //ģ�����id		
	//strUp +="<workflow><![CDATA[" + strXml + "]]></workflow>";//���̽ڵ�	??������CDATA���ڵ��������������TODO
	strUp +="<workflow>" + strXml + "</workflow>";//���̽ڵ�	??������CDATA���ڵ��������������TODO


	//<position>
	//<node>
	//<id></id><name></name><nodetype></nodetype><outerhtml></outerhtml>
	//</node>
	//...
	//</position>
	
	strUp +="<position>" + Flow_GetPositionXmlInfo() + "</position>";//λ�ýڵ�
	//strUp +="<position><![CDATA[" + FlowArea.innerHTML +"]]></position>";//λ�ýڵ�
	strUp +="</root>";
	
	var strReturn=SendHttp(fcpubdata.servletPath + "/DesignerServlet"+fcpubdata.dotnetVersion+"?operate=flow_save",strUp)
	var dom = SetDom(strReturn);
	if (dom.documentElement==null){
		alert("�������̷�������")
		return;
	}
	if (dom.childNodes(0).childNodes(0).text=="true"){
		FlowArea.FlowAttributes.FlowVersion = dom.childNodes(0).childNodes(1).text; //�õ������ɵ����̰汾		
		alert("���̱���ɹ���");
		Flow_NodeNotHasChanged();//�رձ��水ť
		Flow_ChangePageTitle(strWorkflow);
		
	}else{
		alert(dom.childNodes(0).childNodes(1).text);
	}
	
	
}
//*************************************************************
// ���������� �õ�ҳ��༭�����̶���xml��Ϣ
// ���������� ��
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
			case "StartNode": //ֻ��һ��StartNode
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
				else{//�Ǹ��ϲ���ڵ㣬��û��fromActions,������step����2011-3-8
					//һ�����Ͻڵ� ֻ�ܴ�һ�� �����ڵ�
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
				//��̬�ڵ㶨��Ĳ������ڶ�̬���ɵĽڵ���ʹ�ã��Ͷ�̬���̽ڵ�ʵ������
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

				//������ߵ�xml��
				joinXml +=Flow_GetResultsPropertysByNode(node);	
				joinXml +="</join>";
				break;	
			case "SubflowNode":
			//<sub-flow id="3456" name="ȱ��������" is-sync="1" sub-flowname="oos_flow" sub-flowdesc="ȱ���Ǽ�����" sub-flowversion="1" /> 
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
				//�����̵������������
				subflowXml +=node.NodePropertys.params;
				
				//���е�results����Ҫ��Result���������л��	
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
//�õ�splitNode��joinNode�ڵ��results xml��
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
			//��������Ҫif (result.NodePropertys.condition && result.NodePropertys.condition!="")
			if (objResults[i].NodePropertys.prefunction && objResults[i].NodePropertys.prefunction!="")
				strXml +=objResults[i].NodePropertys.prefunction
			if (objResults[i].NodePropertys.postfunction && objResults[i].NodePropertys.postfunction!="")
				strXml +=objResults[i].NodePropertys.postfunction;						
		}
		strXml +="</unconditional-result>";
	}
	
	return strXml;
}	
//�Զ���� ���趯��id���Ե�action�����������У�<arg name="step_id">xxxx</arg> <arg name="action_id">xxxx</arg>
function ActionAppendTaskNodeArg(actionId,permissionXml,stepid){
	
	
	//�ҵ����������� ����ڵ�id	
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
	
	//��������� �жϾ����������ǩ���� ���Զ����� step_id��action_id ����	
	var orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.CompetitionTaskCondition</arg>';
	var tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.CompetitionTaskCondition</arg>';
	
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	permissionXml = repStr(permissionXml,orgStr,tagStr);

	//ֱ��ָ��
	orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.DirectTaskCondition</arg>';
	tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.DirectTaskCondition</arg>';		
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	permissionXml = repStr(permissionXml,orgStr,tagStr);

	//��̬��ǩ
	orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.CounterSignCondition</arg>';
	tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.CounterSignCondition</arg>';		
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	permissionXml = repStr(permissionXml,orgStr,tagStr);

	//ƽ������
	orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.AverageTaskCondition</arg>';
	tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.AverageTaskCondition</arg>';		
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	permissionXml = repStr(permissionXml,orgStr,tagStr);
	return permissionXml;

	
}
//����actionNode�ڵ㶨���xml��
//�Ǹ��ϲ���ڵ㣬����action����step�ڵ�,����action�ڵ�
//isComposite ="1" �Ǹ��Ͻڵ�
function Flow_GetActionAllPropertys(action,isComposite){
	var strXml = "";			
	//var isComp = false;
	var actionProperty = action.NodePropertys;
	if (typeof isComposite !="undefined" && isComposite =="1"){
		//isComp = true;
		actionProperty = action.NodePropertys.ActionProperty;//�Ǹ��ϲ���ڵ㣬��action����step����
	}	
	
	if (actionProperty){
		
		strXml +='<action id="' + actionProperty.ID + '" name ="' + actionProperty.Name + '"';
		
		if (actionProperty.View && actionProperty.View!="")
			strXml +=" view='" + escape(actionProperty.View) + "'";
		if (actionProperty.Remark && actionProperty.Remark!="")//�ӹ켣��ע 2011-9-16
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
			//�����Ͻڵ㣬��ֱ�ӼӲ���id 2011-3-8
			if (typeof isComposite !="undefined" && isComposite =="1")
				strXml +=ActionAppendTaskNodeArg(actionProperty.ID,actionProperty.permission,action.id);//action.id����stepid
			else			
				strXml +=ActionAppendTaskNodeArg(actionProperty.ID,actionProperty.permission);
		}	
			
		if (actionProperty.validators && actionProperty.validators!="")
			strXml +=actionProperty.validators;
		//2011-7-19����access-controls�ڵ�	
		if (actionProperty.accesscontrol && actionProperty.accesscontrol!="")
			strXml +=actionProperty.accesscontrol;		
		
		//2012-10-22����action-forms�ڵ�	
		if (actionProperty.actionForms && actionProperty.actionForms!="")
			strXml +=actionProperty.actionForms;						
		
		if (actionProperty.prefunction && actionProperty.prefunction!="")
			strXml +=actionProperty.prefunction;

		if (actionProperty.postfunction && actionProperty.postfunction!="")
			strXml +=actionProperty.postfunction;
			
		//���е�results����Ҫ��Result���������л��	
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

//�õ�result����������
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
 *�Զ���� ���趯��id���Ե�result�����������У�<arg name="step_id">xxxx</arg> <arg name="action_id">xxxx</arg> 
 */
function ResultAppendTaskNodeArg(nodeId,conditionXml){
	var stepId="0";
	var actionId ="0";
	
	//����actionId�Ľڵ����ͣ���λactionId��stepId 2011-3-30
	var Nodes = FlowArea.FlowNodes.Nodes;
	var nodeType = "ActionNode";
	for (var i=0;i<Nodes.length;i++){
		if (Nodes[i].id == nodeId){
			nodeType = Nodes[i].NodeType;
			if (nodeType=="CompNode"){ //���Ͻڵ�
				stepId = nodeId;
				actionId = Nodes[i].ActionId;
			}				
			break;
		}
	}	
	if (nodeType=="ActionNode"){
		//�ҵ����������� ����ڵ�id	
		var Nodes = FlowArea.FlowNodes.Nodes;
		for (var i=0;i<Nodes.length;i++){	
			if (Nodes[i].ToNode && Nodes[i].ToNode==nodeId && Nodes[i].NodeType == "Result" ){
				stepId = Nodes[i].FromNode;	
				actionId = nodeId;
				break;								
			}			
		}
	}

	
	//��������� δ��ɶ�̬��ǩ ������  ���Զ����� step_id��action_id ����	
	var orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.NotFinishCounterSignResult</arg>';
	var tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.NotFinishCounterSignResult</arg>';	
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	conditionXml = repStr(conditionXml,orgStr,tagStr);
	
	
	//��������� ��ɶ�̬��ǩ ������  ���Զ����� step_id��action_id ����	
	orgStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.FinishCounterSignResult</arg>';
	tagStr = '<arg name="class.name">cn.com.fcsoft.workflow.util.FinishCounterSignResult</arg>';	
	tagStr +='<arg name="step_id">' + stepId + '</arg>';
	tagStr +='<arg name="action_id">' + actionId + '</arg>';
	conditionXml = repStr(conditionXml,orgStr,tagStr);
	return conditionXml;
}
//*************************************************************
// ���������� �ӵ�ǰAction�еõ����е�Result, Action ���� sub-flow
// ���������� ��
//-------------------------------------------------------------
function Flow_GetRelationResultsFromAction(action){
	var nodes = FlowArea.FlowNodes.Nodes;
	var objResults = new Array();
	var intIndex = 0;
	for(var i = 0; i < nodes.length; i++)
	{
		// ����ǽڵ�ͼ������м��
		if(nodes[i].NodeType == "Result" && nodes[i].FromNode == action.id )
		{
			objResults[intIndex] = nodes[i];
			intIndex++;
		}
	}
	return objResults;
}
//*************************************************************
// ���������� �õ�Node����������ActionNode�ڵ����
// ���������� ��
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
// ���������� �õ�ҳ��༭�����нڵ�Ĳ���λ����Ϣ
// ���������� ��
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
// ���������� ��֧�ڵ㲻��ֻ��һ����������
// ���������� ��
//-------------------------------------------------------------
function Flow_CheckSplitNode(obj)
{
	// ��֧�ڵ㲻��ֻ��һ����������
	var j = 0;
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		// ����ǽڵ�ͼ������м��
		if(objs[i].NodeType == "Result")
		{
			if (objs[i].FromNode == obj.id)
			{
				j++;
			}
		}
	}

	// ������������������ ,�޸ķ�֧�ڵ� ֻ��һ����������Ҳ����	
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
// ���������� ���������������
// ���������� ��
//-------------------------------------------------------------
function Flow_CheckPourAndOut(obj, strDirection)
{
	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		// ����ǽڵ�ͼ������м��
		if(objs[i].NodeType == "Result")
		{
			// ����ʼ�ڵ��ⲻ��û�����뷽��Ľڵ�
			if (strDirection == "Pour")
			{
				if (objs[i].ToNode == obj.id)
				{
					return false;
				}
			}
			// �������ڵ��ⲻ��û����������Ľڵ�
			else if (strDirection == "Out")
			{	
				//if (obj.NodeType=="ActionNode" && obj.NodePropertys.Finish=="true") // action���Զ��ս� �������������-> ���޸ģ�����Ҫ�����̷���
				//	return false;
				//if (obj.NodeType=="SubflowNode" && obj.NodePropertys.IsSync=="2") //sub-flow�ڵ㣬�첽�ģ�����û����������ͬ���ı���Ҫ����������--->�޸�Ϊ��ͬ���첽���������򣬷����޷�ȷ����һ��
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
//		if (confirm("�Ƿ�Ҫ���浱ǰ�����̣����뿪��"))
//			Flow_SaveFlow();
//	}			
}