function mOvr(src) 
{ 
	if (!src.contains(event.fromElement))
	{ 
		with (src.style)
		{
			if(background == "#d5f5c2") return; 
			background = "#E3ECFD";
			cursor = "hand";
		}
	}
}

function mOut(src) 
{ 
	if (!src.contains(event.toElement)) 
	{ 		
		with(src.style) 
		{
			if(background == "#d5f5c2") return; 
			background = "#FCFAF8";
		}
	}
}

//*************************************************************
// 功能描述： 选择当前条目
// 参数描述： objTR - 条目对象
//-------------------------------------------------------------
var objOldItem = null;
function SelectItem(objTR)
{
	if(objOldItem)
		objOldItem.style.background = "";
	objTR.style.background = "#d5f5c2";
	objOldItem = objTR;
}

function ShowImageBorder(src) 
{ 
	if (!src.contains(event.fromElement))
	{ 
		with (src.style)
		{
			borderWidth = "1px";
			borderStyle = "solid";
			borderColor = "#666666";
			cursor = "hand";
		}
	}
}

function HideImageBorder(src) 
{ 
	if (!src.contains(event.toElement)) 
	{ 		
		with(src.style) 
		{
			borderWidth = "0px";
			cursor = "hand";
		}
	}
}

function ExpendOrFoldTable(objButton, objTable)
{
	for (var i = 1; i < objTable.rows.length; i++)
	{
		var objStyle = objTable.rows[i].style;
		if (objStyle.display == "none")
		{
			objButton.src = "images/minn.gif";
			objStyle.display = "block";
		}
		else
		{
			objButton.src = "images/max.gif";
			objStyle.display = "none";
		}
	}
}