//*************************************************************
// 功能描述： 开始移动节点
// 参数描述： 无
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

	// 保存鼠标位置
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
// 功能描述： 开始移动对象
// 参数描述： 无
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
		
		// 重新设置动作连线的位置
		Flow_ResetResultPosition(document.all(Obj));
	}
}

//*************************************************************
// 功能描述： 引动对象结束
// 参数描述： 无
//-------------------------------------------------------------
function MUp()
{
	// 关闭相关漂浮菜单
	Flow_ClosePopuMenueDiv();

	if(Obj != '')
	{
		// 处理出界情况
		
		
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
		
		// 如果是节点发生移动才重新设置地理坐标
		if((Obj.indexOf("_") > -1 && (aryPressXY[0] != event.x || aryPressXY[1] != event.y)))
		{
			// 保存移动后对象的位置
			aryPressXY[2] = document.all(Obj).style.pixelLeft;
			aryPressXY[3] = document.all(Obj).style.pixelTop;
			// 保存位置移动操作
			Flow_SaveOperation(document.all(Obj), "Move", aryPressXY);
			// 对象发生改变
			Flow_NodeHasChanged();
		}

		// 释放
		document.all(Obj).releaseCapture();
		Obj = '';
		MTy = '';
	}
}

//*************************************************************
// 功能描述： 对象显示颜色转换
// 参数描述： 无
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
// 功能描述： 对象显示颜色转换
// 参数描述： 无
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
// 功能描述： 对当前窗口进行聚焦
// 参数描述： 无
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