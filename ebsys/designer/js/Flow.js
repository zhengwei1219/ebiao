//*************************************************************
// ���������� �����µ�����
// ���������� ��
//-------------------------------------------------------------
function Flow_CreateWorkFlow()
{
	// �ж��Ƿ��Ѿ���������
	//if (FlowArea.FlowNodes.Nodes.length > 0)
	if (bActiveNodeChange)
	{
		if (confirm("�Ƿ�Ҫ���浱ǰ�����̣��ٽ����µ����̣�"))
		{
			// ��������
			Flow_SaveFlow();
			return;
		}
	}
	// �����ǰ����
	Flow_RemoveAllActiveNode();
	//********************* start ****************************************
	//�����ǰ���̵�����
	Flow_RemoveFlowAttributes();
	//�����ʷ����
	Flow_ClearOperations();
	//���ù������༭״̬
	Flow_SetFlowToolBarEditStatus();
	//��ʼ�����̶���xml��Ϣ
	//Flow_InitDefinXmlObj();
	//------------------------ end -------------------------------------
	//�򿪱��水ť
	Flow_NodeHasChanged();
	Flow_ChangePageTitle("");
	// ������ʼ�ڵ�
	Flow_CreateStartAndEndNode("StartNode");
	Flow_CreateStartAndEndNode("EndNode");
}

//*************************************************************
// ���������� �����ǰ���̵�����
// ���������� ��
//-------------------------------------------------------------
function Flow_RemoveFlowAttributes()
{
	FlowArea.FlowAttributes = null;
}

//*************************************************************
// ���������� �����ʷ����
// ���������� ��
//-------------------------------------------------------------
function Flow_ClearOperations()
{
	G_CurrentHistoryIndex = -1;
	
	var objs = FlowArea.OperationLists.Operations;
	objs.splice(0, objs.length);
}

//*************************************************************
// ���������� ������ʼ�ڵ�
// ���������� ��
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
		strNodeName = "��ʼ�ڵ�";
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
		strNodeName = "�����ڵ�";
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
	var activeText = document.createElement("<font class='actName' />");//font�޸ĳ�div 2012-11-8
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
// ���������� װ��ڵ�
// ���������� strNodeID		- ����ID
//			strNodeName	- �ڵ�����
//			strNodeType	- �ڵ�����
//			strOuterHTML	- �ڵ�HTML
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
// ���������� �����ڵ�
// ���������� strOrigiSrc - ͼƬԴ·��
//           strNodeName - �ڵ�����
//-------------------------------------------------------------
function Flow_CreateActiveNode(strOrigiSrc, strNodeType)
{
	
	var obj = Flow_GetCurrentActiveNode();
	
	if(obj)
	{
		// �����һһ������û��ȡ���֣����Զ�����ʹ��Ĭ������
		if(obj.Name == "None")
		{
			// ȡ��Ĭ������
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

	
	//���Ͻڵ� ��Ҫ����action�ڵ����Ϣ 2011-3-8
	if (strNodeType=="CompNode"){
		var rnd_action_no =  Math.round(Math.random() * 10000);
		activeNode.ActionId = rnd_action_no;
		activeNode.ActionProperty = new NodePropertys();//���Ӹ��Ͻڵ�ĸ�ֵ2011-3-8
	}
	
	//activeNode.Name = "����ڵ�";
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
	var activeText = document.createElement("<font class='actName' />");//ȥ��font�޸ĳ�div
	
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
// ���������� ���ݽڵ���������Ĭ������
// ���������� ��
//-------------------------------------------------------------
function Flow_GetNodeDefaultName(strNodeType)
{
	var strNodeName = null;
	switch (strNodeType)
	{
		case "StartNode":
			strNodeName = "��ʼ�ڵ�";
			break;
		case "EndNode":
			strNodeName = "�����ڵ�";
			break;
		case "JoinNode":
			strNodeName = "Эͬ�ڵ�";
			break;
		case "SplitNode":
			strNodeName = "��֧�ڵ�";
			break;
		case "StepNode":
			strNodeName = "����ڵ�";
			break;
		case "ActionNode":
			strNodeName = "�����ڵ�";
			break;
			
		case "SubflowNode":
			strNodeName = "�����̽ڵ�";
			break;
		case "CompNode":
			strNodeName = "���Ͻڵ�";
			break;
	}

	return strNodeName;
}

//*************************************************************
// ���������� ���ýڵ㵽��������
// ���������� ��
//-------------------------------------------------------------
var G_NodePropertys = null;
function Flow_PutActiveNode()
{
	// �����ֱ���ڹ�����ȡ����ӽڵ����
	if (event.srcElement.id)
	{
		// ȡ����ӽڵ����
		var obj = Flow_GetCurrentActiveNode();
		// ����Ҽ�ȡ����������
		if(obj && obj.Name == "None")
		{
			// �����û��ȡ����Ҫɾ��˵���û����뽨���ö�����رն�����������
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
		// ȷ���������Ĭ������
		//var strNodeName = Flow_GetNodeDefaultName(obj.NodeType);
		//Flow_ShowNodeNameDiv(strNodeName);
		MUp();				
		
		G_NodePropertys = null;//objProperty;
		//Flow_ShowActiveNodePropertys(obj); //ȥ�����¿ؼ��͵�������ҳ 2013-8-15				
		var objProperty = new NodePropertys();
		objProperty.ID = obj.id;
		objProperty.Name = Flow_GetNodeDefaultName(obj.NodeType);

		if (obj.NodeType == "CompNode") {//2011-3-8 ���Ӹ��Ͻڵ�ĸ�ֵ
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
		        obj.childNodes[2].innerHTML = objProperty.Name; //��doctype �հ׻��ı�����һ���ӽڵ�   2012-11-8
		    else
		        obj.childNodes[1].innerHTML = objProperty.Name; //��Flow_ShowActiveNodePropertys(obj)�����з���ֵһ����ֵ2013-8-15
		}
		//��step.id step.name, action.id action.Name�ӵ� FlowArea.FlowNodes.Nodes��
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

		// ����������б�
		Flow_SaveOperation(obj, "Add", null);				
	}

	// �ָ����ö������߹���״̬
	Flow_ResetFlowToolBar();
	// �������ı�
	Flow_NodeHasChanged();

	document.onmousemove = MMove;
	document.onmousedown = null;
}

//*************************************************************
// ���������� �ڵ������ƫ��
// ���������� ��
//-------------------------------------------------------------
var G_HasRestoration = true;
function Flow_ActiveNodeOver()
{
	// ʵ�ֶ�������Ч��
	var obj = event.srcElement;
	// ���û�еõ�������ֱ���˳�
	if (!obj)
	{
		return;
	}
	// ����õ�����Ŀ�������Ӷ���
	if (obj.id == "")
	{
		obj = obj.parentNode;
	}
	if (obj.nodeType == 9) return; //2012-11-8
	// �ж��Ƿ��Ѿ���λͬʱ�������ʹ�ö��������������ƶ��ڵ�
	if (G_HasRestoration && !G_Started)
	{
		obj.style.pixelLeft += 2;
		obj.style.pixelTop += 2;
		G_HasRestoration = false;

		var repTime = setTimeout("Flow_ActiveNodeRestoration('"+ obj.id +"')", 500);
	}
	// �ж�����Ƿ��ɿ�
	if (Obj == '' && MTy == '')
	{
		// ��ʾ���ýڵ���Ϣ
		Flow_ShowActiveNodeInfo(obj);
	}
}

//*************************************************************
// ���������� ͨ������¼��Ľڵ�������λ
// ���������� ��
//-------------------------------------------------------------
function Flow_ActiveNodeOut()
{
	// �ر���Ϣ��ʾ��
	Flow_CloseActiveNodeInfo();
}

//*************************************************************
// ���������� �ڵ�������ʱ��λ
// ���������� strNodeId - ����ID
//-------------------------------------------------------------
function Flow_ActiveNodeRestoration(strNodeId)
{
	try
	{
		G_HasRestoration = true;
		// ����������λ
		var obj = document.getElementById(strNodeId);
		obj.style.pixelLeft -= 2;
		obj.style.pixelTop -= 2;
	}
	catch(wError){}
}

//*************************************************************
// ���������� ��ʾ���ýڵ���Ϣ
// ���������� obj - ָ������
//			srcX - ��Ļ����X
//			srcY - ��Ļ����Y
//-------------------------------------------------------------
function Flow_ShowActiveNodeInfo(obj)
{
	var infoDiv = document.getElementById("ActiveNodeInfoDiv");
	if(!infoDiv)
	{
		infoDiv = document.createElement("<div />");
		infoDiv.style.position = "absolute";
		infoDiv.style.visibility = "visible";
		// û������ǰ����ʾ��Ϣ��
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
	var strInfo0 = "����:��" + strNodeTypeName + "��";
	var strInfo1 = "<br>";
	var strInfo2 = "����:��" + obj.Name + "��";
	var intMaxLength = Math.max(strInfo0.length, strInfo2.length);
	var strInfo = strInfo0 + strInfo1 + strInfo2;
	if(strInfo == "None" || !strInfo) strInfo = "û�������Ϣ";
	infoDiv.innerHTML = strInfo;
	infoDiv.style.width = intMaxLength * 12;
	infoDiv.style.pixelLeft = obj.style.pixelLeft + obj.style.pixelWidth;
	infoDiv.style.pixelTop = obj.style.pixelTop;
	// ����������
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
	// �����û��ȡ������ʾ
	if(obj.Name != "None")
		infoDiv.style.display = "block";
}

//*************************************************************
// ���������� ��ʾ���ýڵ���ϸ��Ϣ
// ���������� ��
//-------------------------------------------------------------
function Flow_ShowActiveNodeDetail()
{
}

//*************************************************************
// ���������� �رսڵ���Ϣ��ʾ��
// ���������� ��
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
// ���������� ��ʾ���ýڵ����Ʋ�
// ���������� strNodeName - ��������
//-------------------------------------------------------------
function Flow_ShowNodeNameDiv(strNodeName)
{
	var obj = Flow_GetCurrentActiveNode();	
	
	var bStillShow = false;
	// �ر����д���
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
// ���������� �������в㴰��
// ���������� ��
//-------------------------------------------------------------
function HideAllWindow(objDiv)
{
	// �����������ô���
	NodeNameDiv.style.display = "none";
}

//*************************************************************
// ���������� ���ؽڵ��������ò�
// ���������� ��
//-------------------------------------------------------------
function Flow_HiddenNodeNameDiv()
{
	NodeNameDiv.style.display = "none";
}

//*************************************************************
// ���������� ���ýڵ�λ��
// ���������� ��
//-------------------------------------------------------------
function Flow_SetActiveNode()
{
	var obj = Flow_GetCurrentActiveNode();

	obj.style.left = event.x - obj.childNodes[0].width / 2;
	obj.style.top = event.y - obj.childNodes[0].height / 2;
}

//*************************************************************
// ���������� ���ýڵ�����
// ���������� ��
//-------------------------------------------------------------
function Flow_SetActiveNodeName()
{
	Flow_HiddenNodeNameDiv();

	var obj = Flow_GetCurrentActiveNode();
    
	//obj.Name = NodeName.value; //ȥ�������ڵ�����ҳ2013-8-15
	//obj.style.width = NodeName.value.length * 14;
	//obj.childNodes[1].innerHTML = NodeName.value;
}

//*************************************************************
// ���������� �޸Ľڵ�����
// ���������� flag - ���Ʊ�ʶ
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
		//�ж���� ���� ����� step->action֮������ߣ���������ҳ ��action->step,split->step,join->step֮�������Ҫ������ҳ
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
//		// ����Ǵ�������ʱ��ֱ��˫�������������޸�ʱ��������ΪNone���
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
// ���������� ��ʾ�ڵ����Դ���
// ���������� ��
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
	
	//����NodePropertys�е�ID��ֵ�ĸ�ֵ	
	if (G_NodePropertys==null){
		G_NodePropertys = new NodePropertys();		
		if (objParm.Name=="None")
			G_NodePropertys.Name = Flow_GetNodeDefaultName(objParm.NodeType);
		else
			G_NodePropertys.Name = objParm.Name;
		G_NodePropertys.ID = objParm.id;
		if (objParm.NodeType=="CompNode"){//2011-3-8 ���Ӹ��Ͻڵ�ĸ�ֵ
			G_NodePropertys.ActionID = objParm.ActionId;
			G_NodePropertys.ActionProperty = objParm.ActionProperty;
		}
	}

	//��֧�ڵ㣬�ռ���֧�ڵ������result����Ϊ�����ʾ
	if (objParm.NodeType == "SplitNode"){				
		G_NodePropertys.result = Flow_GetResultsBySplitNode(objParm);
		
	}
	//����������ߣ����Ҷ����ڵ������view (eform�ı�) 2011-4-15
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
			Remove_UserActionType_icon(obj)//�������б�ʶͼƬ 2012-1-6
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
            obj.childNodes[2].innerHTML = objReturn.Name; //��doctype �հ׻��ı�����һ���ӽڵ�   2012-11-8
		else
		    obj.childNodes[1].innerHTML = objReturn.Name; 

		
	}
	//2012-1-6���ӽڵ�����ʶ
	if (obj.NodeType && (obj.NodeType=="CompNode" || obj.NodeType=="ActionNode")){		
		if (userActionType!=""){
			Create_UserActionType_icon(obj,userActionType);
		}
	}
	//�򿪱��水ť
	//Flow_NodeHasChanged();
	
	
}
//2012-1-6�����ڵ����СͼƬ 
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
//���߽ڵ����СͼƬ2012-1-6
function Remove_UserActionType_icon(obj){
	var innerHTML = "";
	var len = obj.childNodes.length;
	for (var i=0;i<len;i++){
		if (obj.childNodes[i].nodeType == 3) continue; //��doctype 2012-11-8
		if (obj.childNodes[i].outerHTML.indexOf("comp.gif")>0)
			innerHTML = innerHTML + obj.childNodes[i].outerHTML;
		if (obj.childNodes[i].outerHTML.indexOf("</FONT>")>0)//font�޸ĳ�div 2012-11-8
			innerHTML = innerHTML + obj.childNodes[i].outerHTML;
		if (obj.childNodes[i].outerHTML.indexOf("cluster.gif")>0)
			innerHTML = innerHTML + obj.childNodes[i].outerHTML;
	}
	obj.innerHTML = innerHTML;	
}
//��ý������ ǰ�� �Ķ����ڵ��view 2011-4-15
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
// ���������� �õ�ָ����֧�ڵ������results
// ���������� ��֧�ڵ����
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
// ���������� �޸Ľڵ�����
// ���������� ��
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
// ���������� �������нڵ���
// ���������� ��
//-------------------------------------------------------------
function Flow_FlowNodes()
{
}

//*************************************************************
// ���������� �ƶ��ڵ� �ڵ�ĵ���¼�
// ���������� ��
//-------------------------------------------------------------
var bActiveNodeChange = false;
var G_CancelAddNode = false;
function Flow_MoveActiveNode()
{
	// �ر��Ҽ��˵�
	Flow_CloseActiveNodeContextmenu();
	Flow_CloseFlowContextmenu();
	// �ر���ϸ��Ϣ
	Flow_CloseActiveNodeInfo();

	var obj = document.elementFromPoint(event.x, event.y);

	// ���û�еõ�������ֱ���˳�
	if (!obj)
	{
		return false;
	}
	// ����Ƕ������󵥶�����
	if (obj.NodeType == "Result")
	{
		Flow_SetCurrentActiveNode(obj);
		return;
	}
	// ����õ�����Ŀ�������Ӷ���
	if (obj.id == "")
	{
		obj = obj.parentNode;
	}
	
	//�򿪱��水ť
	Flow_NodeHasChanged();
	
	if(event.button == 1)
	{
		// ���ǰ����
		Flow_SetCurrentActiveNode(obj);
		// �������ʹ�ö��������������ƶ��ڵ�
		if (!G_Started)
		{
			MDown(obj);
		}
		else
		{
			// �����������߶���
			Flow_PolyLineOnMouseClick(obj);
		}
	}
	else
	{
		// ����Ҽ�ȡ����������
		if(obj.Name == "None")
		{
			// �����û��ȡ����Ҫɾ��˵���û����뽨���ö�����رն�����������
			Flow_HiddenNodeNameDiv();
			Flow_RemoveNodeFromFlow(obj);

			document.onmousemove = MMove;
			document.onmousedown = null;

			// �ָ����ö������߹���״̬
			Flow_ResetFlowToolBar();
			// ����ȡ����ʶ
			G_CancelAddNode = true;

			return false;
		}
	}
}

//*************************************************************
// ���������� ȡ����������ǰ�ڵ�
// ���������� ��
//-------------------------------------------------------------
function Flow_GetCurrentActiveNode()
{
	var act = FlowArea.CurrentActiveNode;

	return act;
}

//*************************************************************
// ���������� �趨ָ���ڵ�Ļ״̬
// ���������� obj - ָ������
//-------------------------------------------------------------
function Flow_SetNodeActivate(obj)
{
	if(obj)
	{
		// ��������
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
			if (obj.childNodes.length==3)//2012-1-6���ӽڵ����СͼƬ
				Flow_SetNodeStyle(obj.childNodes[2], "#FF0000");
			else
				Flow_SetNodeStyle(obj.childNodes[1], "#FF0000");
						
		}
	}
}

//*************************************************************
// ���������� ȡ��ָ������״̬
// ���������� obj - ָ������
//-------------------------------------------------------------
function Flow_SetNodeDeActivate(obj)
{
	if(obj)
	{
		// ��������
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
// ���������� ���ö�����ʽ
// ���������� ��
//-------------------------------------------------------------
function Flow_SetNodeStyle(obj, strColor)
{
    if (obj) {//2012-11-8
        if (typeof (obj.style) != "undefined")
        	obj.style.color = strColor;
    }
}

//*************************************************************
// ���������� ��ָ�������赱ǰѡ�ж���
// ���������� obj - ��ǰ����
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
	// ���ù������༭״̬
	Flow_SetFlowToolBarEditStatus();
}

//*************************************************************
// ���������� �����ڵ��
// ���������� ��
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
// ���������� ͨ�������ƶ�����
// ���������� ��
//-------------------------------------------------------------
document.onkeydown = CheckKeyPress;
function CheckKeyPress()
{
	var obj = Flow_GetCurrentActiveNode();
	// ���û�����õ�ǰ�������˳�
	if(!obj)
	{
		return;
	}

	var intStep = 5;

	if(event.ctrlKey)
		intStep = 1;
	
	// ��¼�ƶ�ǰ��λ��
	var aryNodePosition = new Array();
	if (event.keyCode != 46)
	{
		aryNodePosition[0] = obj.style.pixelLeft;
		aryNodePosition[1] = obj.style.pixelTop;
	}

	// ʹ�ü��̲�������
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
	
	// ��¼�ƶ����λ��
	aryNodePosition[2] = obj.style.pixelLeft;
	aryNodePosition[3] = obj.style.pixelTop;
	// ����λ���ƶ�����
	Flow_SaveOperation(obj, "Move", aryNodePosition);
	// �����������Ӷ���λ��
	Flow_ResetResultPosition(obj);
}

//*************************************************************
// ���������� ͨ���Ҽ��Ƴ�����
// ���������� ��
//-------------------------------------------------------------
function Flow_RemoveActiveNode()
{
	// �����꽹���ڵ�ǰҪɾ�������ɾ��
	if(event.srcElement.type != "text")
	{
		var obj = Flow_GetCurrentActiveNode();
		if(obj)
		{
			var strNodeName = obj.Name;			
			if(strNodeName == "None")
			{
				// ȡ����صĶ�������
				var objResults = Flow_GetRelationResults(obj);
				// ����������б�
				Flow_SaveOperation(obj, "Delete", objResults);

				// �����û��ȡ����Ҫɾ��˵���û����뽨���ö�����رն�����������
				Flow_HiddenNodeNameDiv();
				Flow_RemoveNodeFromFlow(obj);
			}
			else
			{
				//��ʼ�ͽ����ڵ㲻��ɾ��
				if (obj && (obj.NodeType=="StartNode" || obj.NodeType=="EndNode")){
					return;
				}				
				if(obj && confirm("ȷ��Ҫɾ����"+ strNodeName +"������"))
				{
					// ȡ����صĶ�������
					var objResults = Flow_GetRelationResults(obj);
					// ����������б�
					Flow_SaveOperation(obj, "Delete", objResults);

					Flow_RemoveNodeFromFlow(obj);
				}
			}
		}
	}
}

//*************************************************************
// ���������� �Ƴ����нڵ�
// ���������� ��
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
// ���������� ����������ɾ��ָ������
// ���������� obj - Ҫɾ���Ķ���
//-------------------------------------------------------------
function Flow_RemoveNodeFromFlow(obj)
{
	// ���õ�ǰ��ڵ�Ϊ��
	Flow_SetCurrentActiveNode(null);

	var objs = FlowArea.FlowNodes.Nodes;
	for(var i = 0; i < objs.length; i++)
	{
		//if(objs[i].Name && objs[i].Name == obj.Name)
		if(objs[i].id && objs[i].id == obj.id)
		{
			// �Թ��������Ƴ�����
			FlowArea.removeChild(obj);
			// �������Ƴ�����
			objs.splice(i, 1);
			// ɾ����ض�������
			Flow_RemoveResultFromFlow(obj);
			// �������ı�
			Flow_NodeHasChanged();
			return;
		}
	}
}

//*************************************************************
// ���������� ����������ɾ����ض�������
// ���������� obj
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
			//	//����������ڵ㣬ȥ����֧�ڵ��ĳһ�����ӽڵ�����
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
// ���������� ��ʾ�ڵ��Ҽ��˵�
// ���������� ��
//-------------------------------------------------------------
function Flow_ShowActiveNodeContextmenu()
{
	var obj = document.elementFromPoint(event.x, event.y);
	// ���û�еõ�������ֱ���˳�
	if (!obj)
	{
		return;
	}
	// ����õ�����Ŀ�������Ӷ���
	if (obj.id == "")
	{
		obj = obj.parentNode;
	}
	Flow_SetCurrentActiveNode(obj);

	// ����˵��������
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

	// ��ʼ�ڵ�ͽ����ڵ㲻�����ƺ�ɾ��
	Flow_SetNodeContentMenuStatus(obj);
}

//*************************************************************
// ���������� �رսڵ��Ҽ��˵�
// ���������� ��
//-------------------------------------------------------------
function Flow_CloseActiveNodeContextmenu()
{
	ActiveNodeContextmenuDiv.style.display = "none";
}

//*************************************************************
// ���������� ��ʾ���������Ҽ��˵�
// ���������� ��
//-------------------------------------------------------------
function Flow_ShowFlowContextmenu()
{
	// ����˵��������
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

	// �ж��Ƿ��п�ճ������
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

	// �ж��Ƿ��Ѿ���������
	if (FlowArea.FlowNodes.Nodes.length > 0)
	{
		// ��������	
		AttributeTd.disabled = false;
		//********************* start ****************************************
		//AttributeTd.onclick = Flow_ShowFlowAttributeDiv;
		AttributeTd.onclick = Flow_ShowFlowAttribute;
		//------------------------ end -------------------------------------
		// ��������
		if (bActiveNodeChange)
			SaveFlowTd.disabled = false;
		else
			SaveFlowTd.disabled = true;
		SaveFlowTd.onclick = Flow_SaveFlow;
	}
	else
	{
		// ��������
		AttributeTd.disabled = true;
		AttributeTd.onclick = "";
		// ��������
		if (bActiveNodeChange)
			SaveFlowTd.disabled = false;
		else
			SaveFlowTd.disabled = true;
		
		SaveFlowTd.onclick = "";
	}
}

//*************************************************************
// ���������� ��ʾ�������Խ���
// ���������� ��
//-------------------------------------------------------------
function Flow_ShowFlowAttribute()
{
	var objReturn = window.showModalDialog(fcpubdata.Path + "/fceform/common/djframe.htm?djsn=wd_pageset&djtype=WF_DSN", window, "dialogHeight:380px; dialogWidth:590px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:yes");

	if (objReturn){
		Flow_NodeHasChanged();//�򿪱��水ť
		if (objReturn[0]){
			FlowArea.FlowAttributes = objReturn[0];
			Flow_ChangePageTitle(FlowArea.FlowAttributes.FlowName);
		}
	}		
}

//*************************************************************
// ���������� �ر����������Ҽ��˵�
// ���������� ��
//-------------------------------------------------------------
function Flow_CloseFlowContextmenu()
{
	FlowContextmenuDiv.style.display = "none";
}

//*************************************************************
// ���������� ���ƶ���
// ���������� ��
//-------------------------------------------------------------
var objCopy = null;
function Flow_CopyActiveNode()
{
	var obj = Flow_GetCurrentActiveNode();
	objCopy = obj;

	// ���ù������༭״̬
	Flow_SetFlowToolBarEditStatus();
}

//*************************************************************
// ���������� ճ������
// ���������� ��
//-------------------------------------------------------------
function Flow_PlastActiveNode()
{
	// �����µĶ���
	Flow_CreateActiveNode(objCopy.childNodes[0].src, objCopy.NodeType);

	// ����¼ճ��������Ϊ��
	objCopy = null;
}

//*************************************************************
// ���������� �������ı����ú���
// ���������� ��
//-------------------------------------------------------------
function Flow_NodeHasChanged()
{
	if (!bActiveNodeChange){
		// �ı��Ҽ��˵�����ѡ��״̬
		Flow_EnableSaveFlowMenu();
		// �������ı�
		bActiveNodeChange = true;
		// ���������
		//Flow_CreateHiddenField("bActiveNodeChange", bActiveNodeChange);
	}
}
//*************************************************************
// ���������� �ָ�δ�����ı����ú���
// ���������� ��
//-------------------------------------------------------------
function Flow_NodeNotHasChanged()
{
	if (bActiveNodeChange){
		// �ı��Ҽ��˵�����ѡ��״̬
		Flow_DisableSaveFlowMenu();
		// �������ı�
		bActiveNodeChange = false;
	}
}
//�޸�ҳ��� title�����ϵ�ǰ�����ļ���
function Flow_ChangePageTitle(flowname){
	if(flowname=="")
		document.title = "���������" ;
	else
		document.title = "���������" + "��" + flowname + "��";
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
// ���������� �ı��Ҽ��˵�����ѡ��״̬
// ���������� ��
//-------------------------------------------------------------
function Flow_EnableSaveFlowMenu()
{
	SaveFlowTd.disabled = false;
}

//*************************************************************
// ���������� �ı��Ҽ��˵�����ѡ��״̬
// ���������� ��
//-------------------------------------------------------------
function Flow_DisableSaveFlowMenu()
{
	SaveFlowTd.disabled = true;
}

//*************************************************************
// ���������� �ָ��������ı����ú���
// ���������� ��
//-------------------------------------------------------------
function Flow_RestoreNodeChangedStatus()
{
	// �ָ�����δ�����ı�״̬
	bActiveNodeChange = false;
}

//*************************************************************
// ���������� ������̶���
// ���������� ��
//-------------------------------------------------------------
function Flow_AddResult()
{
	Flow_PolyLineStart();
}


//*************************************************************
// ���������� ׼����ʼ����������
// ���������� ��
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
// ���������� ֹͣ����������
// ���������� ��
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
// ���������� ȡ����������
// ���������� ��
//-------------------------------------------------------------
function Flow_CancelResult()
{
	Flow_ClearTempResult();
}

//*************************************************************
// ���������� ���̶�������
// ���������� ��
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
// ���������� �ػ���������
// ���������� ��
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

getScroll = function () {//�����������λ��   
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
// ���������� �������߶���
// ���������� ��
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
				// �����ڵ㲻��ָ�������ڵ�
				if (obj.NodeType != "EndNode")
				{
					G_FromId = obj.id;
				}
			}
		}
		else
		{
			G_EndId = obj.id;
			// �����ظ����ߣ����Ҳ���ָ��ʼ�ڵ�
			if (!Flow_CheckResultBeExisted(G_FromId, G_EndId) && obj.NodeType != "StartNode")
			{
				Flow_CreateResult(G_FromId, G_EndId);

			}
			// �����ʱ����
			Flow_ClearTempResult();
			//***************** start ********************************************
			//���ָ��ʼ�ڵ������
			//if (typeof(G_EndId)!="undefined" && obj.NodeType=="StartNode"){
			//	Flow_ClearTempResult();
			//}
			//��ӷ�֧�ڵ������
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
		// ������ǽڵ����������
		Flow_ClearTempResult();
	}

	return false;
}

//*************************************************************
// ���������� ��������ڵ������
// ���������� ��
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
// ���������� ȥ�������ڵ��ĳһ�����ӽڵ�����
// ���������� ��
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
// ���������� ����µĶ�������
// ���������� ��
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
		activeNode.Name = "���߽ڵ�";
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
		// ����������б�
		Flow_SaveOperation(activeNode, "Add", null);
	}
}
//*************************************************************
// ���������� ��ϵͳ���»ָ��������
// ���������� ��(strResultId,strFromId, strEndId,strOuterHTML)
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
// ���������� �������ö������ߵ�λ��
// ���������� obj��node����
//-------------------------------------------------------------
function Flow_ResetResultPosition(obj)
{
	if (obj.id && obj.NodeType.indexOf("Node") >-1)
	{
		// ȡ����صĶ�������
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
// ���������� �������ö������ߵ�λ�� װ���ʱ����������
// ���������� obj��Result���� 
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
// ���������� ȡ����صĶ�������
// ���������� ��
//-------------------------------------------------------------
function Flow_GetRelationResults(obj)
{
	var objs = FlowArea.FlowNodes.Nodes;
	var objResults = new Array();
	var intIndex = 0;
	for(var i = 0; i < objs.length; i++)
	{
		// ����ǽڵ�ͼ������м��
		if(objs[i].NodeType == "Result" && (objs[i].FromNode == obj.id || objs[i].ToNode == obj.id))
		{
			objResults[intIndex] = objs[i];
			intIndex++;
		}
	}
	return objResults;
}

//*************************************************************
// ���������� ��鶯�������Ƿ��Ѿ�������������֮�� ��������֮����Ի���������
// ���������� ��
//-------------------------------------------------------------
function Flow_CheckResultBeExisted(strFromId, strEndId)
{
	// ֻ�е���ʼ����ֹ�ڵ���Ч����ж�
/*	if (strFromId && strEndId)
	{
		// �����ָ���Լ����Զ��˳�
		if (strFromId == strEndId)
		{
			return true;
		}

		var objs = FlowArea.FlowNodes.Nodes;
		for(var i = 0; i < objs.length; i++)
		{
			// ����ǽڵ�ͼ������м��
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
// ���������� �����������
// ���������� ��
//-------------------------------------------------------------
function Flow_ClearTempResult()
{
	var line = document.getElementById("FlowWebEntity");
	if(line)
	{
		// �Ƴ�������
		FlowArea.removeChild(line);
	}
	Flow_PolyLineStop();
	// �ָ����ö������߹���״̬
	Flow_ResetFlowToolBar();
	// �ָ��������߱�ʶ����
	G_StartPoint = null;
}

//*************************************************************
// ���������� �ָ����ö������߹���״̬
// ���������� ��
//-------------------------------------------------------------
function Flow_ResetFlowToolBar()
{
	// ճ������ʱ����ܳ���
	try
	{
		// �ж��Ƿ��Ѿ��ָ���
		var obj = Flow_GetCurrentActiveNode();
		if (obj)
		{
			FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
			FlowArea.style.cursor = "default";
			Flow_SetCurrentTool("None");
			// ����FlowArea����ȫ��Ԫ�������ʽ
			Flow_SetCursorStyle("");
		}
	}
	catch(wError){}
}

//*************************************************************
// ���������� ��֯�����
// ���������� ��
//-------------------------------------------------------------
function Flow_Point(x, y)
{
	this.x = parseInt(x);
	this.y = parseInt(y);
}

//*************************************************************
// ���������� �жϵ����λ���Ƿ��ظ�
// ���������� ��
//-------------------------------------------------------------
function Flow_IfNodeRepeat(fromStepX, fromStepY, fromStepWidth, fromStepHeight, toStepX, toStepY, toStepWidth, toStepHeight)
{
	return (fromStepX + fromStepWidth >= toStepX) && (fromStepY + fromStepHeight >= toStepY) && (toStepX + toStepWidth >= fromStepX) && (toStepY + toStepHeight >= fromStepY);
}

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
// ���������� ���߳�ʼ������
// ���������� ��
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
// ���������� ��ǰ���̹���
// ���������� ��
//-------------------------------------------------------------
function Flow_FlowTool()
{
	this.Name = "";
}

//*************************************************************
// ���������� ���̹��߼���
// ���������� ��
//-------------------------------------------------------------
function Flow_FlowTools()
{
}

//*************************************************************
// ���������� ���ǰ����
// ���������� ��
//-------------------------------------------------------------
var objTimer = null;
function Flow_ActivateTool (tool, strNodeImage, strNodeType)
{
	// �����������⹤�߼�ֹͣ����ģ��
	if (!G_StopSimulation)
	{
		// �����ʱʾ��ͼ
		Flow_ClearMovingHintChart();
	}
	// �������˶������߹�����ȡ����������
	Flow_PolyLineStop();

	if(tool.order)
	{
		tool.Activate(tool);
		tool.order();
		objTimer = setTimeout("Flow_DeactivateCommandTool('"+ tool.id +"')", 200);

		// �ָ�������״̬
		Flow_SetFlowToolBarStatus();
		// �ָ����ö������߹���״̬
		Flow_ResetFlowToolBar();
		return;
	}
	
	if (FlowArea.activeToolControl != null && FlowArea.activeToolControl.id == tool.id && FlowArea.activeToolControl.active) {
		FlowArea.activeToolControl.Deactivate(FlowArea.activeToolControl);
		Flow_SetCurrentTool("None");
		// ����FlowArea����ȫ��Ԫ�������ʽ
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
		// ����FlowArea����ȫ��Ԫ�������ʽ
		Flow_SetCursorStyle(tool.cursorUrl);
		
		tool.command(strNodeImage, strNodeType);
	} 
}

//*************************************************************
// ���������� �ָ����߰�ť״̬
// ���������� ��
//-------------------------------------------------------------
function Flow_DeactivateCommandTool(toolId)
{
	var tool = document.getElementById(toolId);
	tool.Deactivate(tool);
	clearTimeout(objTimer);
}

//*************************************************************
// ���������� ������������ĵ�ǰ����
// ���������� ��
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
// ���������� ȡ����������ĵ�ǰ����
// ���������� ��
//-------------------------------------------------------------
function Flow_GetCurrentTool()
{
	if (FlowArea != null && FlowArea.FlowTools != null)
	{
		return FlowArea.FlowTools.CurrentTool;
	}
}

//*************************************************************
// ���������� ���ǰ����
// ���������� ��
//-------------------------------------------------------------
function Flow_ToolActivate(tool)
{
	tool.src = tool.activeSrc;
	tool.active = true;
}

//*************************************************************
// ���������� �ָ���ǰ����
// ���������� ��
//-------------------------------------------------------------
function Flow_ToolDeactivate(tool)
{
	tool.src = this.inactiveSrc;
	tool.active = false;
}

//*************************************************************
// ���������� ȡ���ڵ㽹��
// ���������� ��
//-------------------------------------------------------------
function Flow_CancelActiveNodeFocus()
{
	// ����ڽڵ��ϵ���Ҽ���ȡ�����󽹵�
	if((!event.srcElement.NodeType && !event.srcElement.parentNode.NodeType) && event.srcElement.id && !G_CancelAddNode)
	{
		var obj = Flow_GetCurrentActiveNode();
		Flow_SetNodeDeActivate(obj);
		Flow_SetCurrentActiveNode(null);
		// ��ʾ�Ҽ��˵�
		Flow_ShowFlowContextmenu();
		// �ָ�ȡ����ʶ
		G_CancelAddNode = false;
	}
	
	event.cancelBubble = true
	event.returnValue = false;
	return false;
}

//*************************************************************
// ���������� �ر����Ư���˵�
// ���������� ��
//-------------------------------------------------------------
function Flow_ClosePopuMenueDiv()
{
	// �ر��Ҽ��˵�
	Flow_CloseActiveNodeContextmenu();
	Flow_CloseFlowContextmenu();
}