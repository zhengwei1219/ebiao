//*************************************************************
// ���������� ��ʼ�ƶ��ڵ�
// ���������� ��
//-------------------------------------------------------------
var Obj = '';
var MTy = '';
var aryPressXY = null;
document.onmouseup = MUp;
document.onmousemove = MMove;
function MDown(Object, MType)
{
	Obj = Object.id;
	MTy = MType;

	// �������λ��
	aryPressXY = new Array();
	aryPressXY[0] = event.x;
	aryPressXY[1] = event.y;

	document.all(Obj).setCapture()
	if(MTy == "lr")
	{
		pX = event.x - document.all(Obj).style.pixelLeft;
	}
	else if(MTy == "ud")
	{
		pY = event.y - document.all(Obj).style.pixelTop;
	}
	else
	{
		pX = event.x - document.all(Obj).style.pixelLeft;
		pY = event.y - document.all(Obj).style.pixelTop;
	}
}

//*************************************************************
// ���������� ��ʼ�ƶ�����
// ���������� ��
//-------------------------------------------------------------
function MMove()
{
	if(Obj != '')
	{
		if(MTy == "lr")
		{
			document.all(Obj).style.left=event.x-pX;
		}
		else if(MTy == "ud")
		{
			document.all(Obj).style.top=event.y-pY;
			var intHeight = window.document.body.offsetHeight
			document.all(Obj).style.height=Math.abs(intHeight-(event.y-pY));
		}
		else
		{
			document.all(Obj).style.left=event.x-pX;
			document.all(Obj).style.top=event.y-pY;
		}
		
		// �������ö������ߵ�λ��
		Flow_ResetResultPosition(document.all(Obj));
	}
}

//*************************************************************
// ���������� �����������
// ���������� ��
//-------------------------------------------------------------
function MUp()
{
	// �ر����Ư���˵�
	Flow_ClosePopuMenueDiv();

	if(Obj != '')
	{
		// ����������
		
		
		if(document.all(Obj).style.pixelLeft <= 0)
		{
			document.all(Obj).style.pixelLeft = 0;
		}
		if(document.all(Obj).style.pixelTop <= FlowNodeElement.style.pixelHeight)
		{
			document.all(Obj).style.pixelTop = FlowNodeElement.style.pixelHeight;
		}
		/*
		if(document.all(Obj).style.pixelLeft >= document.body.offsetWidth - document.all(Obj).style.pixelWidth)
		{
			document.all(Obj).style.pixelLeft = document.body.offsetWidth - document.all(Obj).style.pixelWidth;
		}
		if(document.all(Obj).style.pixelTop >= document.body.offsetHeight - document.all(Obj).style.pixelHeight)
		{
			document.all(Obj).style.pixelTop = document.body.offsetHeight - document.all(Obj).style.pixelHeight - 3;
		}
		*/
		
		// ����ǽڵ㷢���ƶ����������õ�������
		if((Obj.indexOf("_") > -1 && (aryPressXY[0] != event.x || aryPressXY[1] != event.y)))
		{
			// �����ƶ�������λ��
			aryPressXY[2] = document.all(Obj).style.pixelLeft;
			aryPressXY[3] = document.all(Obj).style.pixelTop;
			// ����λ���ƶ�����
			Flow_SaveOperation(document.all(Obj), "Move", aryPressXY);
			// �������ı�
			Flow_NodeHasChanged();
		}

		// �ͷ�
		document.all(Obj).releaseCapture();
		Obj = '';
		MTy = '';
	}
}

//*************************************************************
// ���������� ������ʾ��ɫת��
// ���������� ��
//-------------------------------------------------------------
function mOvr(src) 
{ 
	if (!src.contains(event.fromElement))
	{ 
		with (src.style)
		{
			if(background == "#ffee88") return; 
			background = "#98AAB1";
			cursor = "hand";
		}
	}
}

//*************************************************************
// ���������� ������ʾ��ɫת��
// ���������� ��
//-------------------------------------------------------------
function mOut(src)
{ 
	if (!src.contains(event.toElement)) 
	{ 		
		with(src.style) 
		{
			if(background == "#ffee88") return; 
			background = "#fefefe";
		}
	}
}

//*************************************************************
// ���������� �Ե�ǰ���ڽ��о۽�
// ���������� ��
//-------------------------------------------------------------
var maxzIndex = 9000;
var oldObject = null;
function FocusMe(Object, ChildObject, ParentObject)
{
	maxzIndex++;
	ParentObject.style.zIndex = maxzIndex;

	var ObjDiv=Object
	if(oldObject == ObjDiv)
		return;

	if(oldObject != null)
	{
		oldObject.filters.alpha.opacity=80;
		oldObject.style.backgroundImage = "url('images/tabs_m_tile.gif')";
	}

	oldObject = ObjDiv;
	ObjDiv.filters.alpha.opacity=100;
	ObjDiv.style.backgroundImage = "url('images/tabs_m_tile1.gif')";
}