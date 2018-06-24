//*************************************************************
// 功能描述： 流程属性
// 参数描述： 无
//-------------------------------------------------------------
function FlowAttributes()
{
}

//*************************************************************
// 功能描述： 节点属性
// 参数描述： 无
//-------------------------------------------------------------
function NodePropertys()
{
}

//*************************************************************
// 功能描述： 条件属性
// 参数描述： 无
//-------------------------------------------------------------
function NodeCondition()
{
}

//*************************************************************
// 功能描述： 任务属性
// 参数描述： 无
//-------------------------------------------------------------
function TaskInfo()
{
}
//*************************************************************
// 功能描述： 条件&前置后置函数的参数设置属性
// 参数描述： 无
//-------------------------------------------------------------
function ParameterInfo()
{
}
//*************************************************************
// 功能描述： 切换Tab页
// 参数描述： strTabName ,strFocus focus对象
//-------------------------------------------------------------
var oldObjTabName = "";
function ChangeTab(strTabName,strFocus)
{
	if( oldObjTabName != "" )
	{
		document.getElementById(oldObjTabName + "1").src = "images/blue_l.gif";
		document.getElementById(oldObjTabName).background = "images/blue_bg.gif"
		document.getElementById(oldObjTabName + "3").src = "images/blue_r.gif";
		document.getElementById("Table" + oldObjTabName).style.display = "none";
	}

	document.getElementById(strTabName + "1").src = "images/green_l.gif";
	document.getElementById(strTabName).background = "images/green_bg.gif"
	document.getElementById(strTabName + "3").src = "images/green_r.gif";
	oldObjTabName = strTabName;
	document.getElementById("Table" + strTabName).style.display = "block";
	
	var objFocus = eval(strFocus);
	if (objFocus && typeof(strFocus)!="undefined")
		objFocus.focus();
}

//*************************************************************
// 功能描述： 设置处理人
// 参数描述： 无
//-------------------------------------------------------------
function SetTextValue()
{
	switch( document.all.SelectDealMan.value )
	{
		case "submiter":
			document.all.TxtDealMan.value = "#Submiter#";
			break;
		case "user":
			var strReturn = ShowUsersDialog();
			if( strReturn != "" )
				document.all.TxtDealMan.value = strReturn;
			break;
		case "":
			document.all.TxtDealMan.value = "";
			break;
	}
}

//*************************************************************
// 功能描述： 显示用户/角色对话框
// 参数描述： 无
//-------------------------------------------------------------
function ShowUsersDialog()
{
	var strReturn = window.showModalDialog("UsersRoles.htm", window, "dialogHeight:250px; dialogWidth:400px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:no");

	return strReturn;
}

//----------------------------------------------
//函数：SetAllRecord
//功能：选择或不选择记录
//参数：Null
//----------------------------------------------
var b_Allchecked = false;
function SetAllRecord()
{	
	if( b_Allchecked == false )
	{
		b_Allchecked = true;
		document.datafrm.imgSelect.src = "images/all_select.gif";
	}
	else
	{
		b_Allchecked = false;
		document.datafrm.imgSelect.src = "images/none_select.gif";
	}
	if( document.datafrm.strPKey.length )
	{
		for( var i = 1; i < document.datafrm.strPKey.length; i++ )
		{			
			document.datafrm.strPKey[i].checked = b_Allchecked;
		}
	}
}

function SetReturnRecords()
{
	var int_CheckedCount = 0;    //记录用户选择的记录个数
	var strValue = "";
	//如果没有记录则不检查
	if( document.datafrm.strPKey.length )
	{
		//开始检查用户是否选择了记录
		for( var i = 1; i < document.datafrm.strPKey.length; i++ )
		{		
			if( document.datafrm.strPKey[i].checked == true )
			{			
				//将保存用户选择记录个数变量加1
				int_CheckedCount = int_CheckedCount + 1;
				if( strValue != "" )
					strValue = strValue + ";" + "#" + document.datafrm.strPKey[i].value + "#";
				else
					strValue = "#" + document.datafrm.strPKey[i].value + "#";

				//保存返回值
//				var oRow = document.getElementById("TableContent").rows(i);
//				if( oRow.cells(3).innerText == "Role" )
//				{
//					alert("dsdsd");
//					if( strValue != "" )
///					strValue = strValue + ";" + "<" + oRow.cells(1).innerText + ">";
//					else
//						strValue = "<" + oRow.cells(1).innerText + ">";
//				}
//				else
//				{
//					if( strValue != "" )
//						strValue = strValue + ";" + "#" + oRow.cells(1).innerText + "#";
//					else
//						strValue = "#" + oRow.cells(1).innerText + "#";
//				}
			}
		}
		if( int_CheckedCount == 0 )
		{
			alert("没有选择某一角色或用户。请选择。");
			return false;
		}
		else
		{
			document.all.HiddenValue.value = strValue;
		}
	}
	else
	{
		alert("没有记录。");
		return false;
	}	
}
//----------------------------------------------
//函数：CloseWindow()
//功能：属性页面中退出
//参数：Null
//----------------------------------------------
function CloseWindow(){
	window.close();

}