//*************************************************************
// ���������� ��������
// ���������� ��
//-------------------------------------------------------------
function FlowAttributes()
{
}

//*************************************************************
// ���������� �ڵ�����
// ���������� ��
//-------------------------------------------------------------
function NodePropertys()
{
}

//*************************************************************
// ���������� ��������
// ���������� ��
//-------------------------------------------------------------
function NodeCondition()
{
}

//*************************************************************
// ���������� ��������
// ���������� ��
//-------------------------------------------------------------
function TaskInfo()
{
}
//*************************************************************
// ���������� ����&ǰ�ú��ú����Ĳ�����������
// ���������� ��
//-------------------------------------------------------------
function ParameterInfo()
{
}
//*************************************************************
// ���������� �л�Tabҳ
// ���������� strTabName ,strFocus focus����
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
// ���������� ���ô�����
// ���������� ��
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
// ���������� ��ʾ�û�/��ɫ�Ի���
// ���������� ��
//-------------------------------------------------------------
function ShowUsersDialog()
{
	var strReturn = window.showModalDialog("UsersRoles.htm", window, "dialogHeight:250px; dialogWidth:400px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:no");

	return strReturn;
}

//----------------------------------------------
//������SetAllRecord
//���ܣ�ѡ���ѡ���¼
//������Null
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
	var int_CheckedCount = 0;    //��¼�û�ѡ��ļ�¼����
	var strValue = "";
	//���û�м�¼�򲻼��
	if( document.datafrm.strPKey.length )
	{
		//��ʼ����û��Ƿ�ѡ���˼�¼
		for( var i = 1; i < document.datafrm.strPKey.length; i++ )
		{		
			if( document.datafrm.strPKey[i].checked == true )
			{			
				//�������û�ѡ���¼����������1
				int_CheckedCount = int_CheckedCount + 1;
				if( strValue != "" )
					strValue = strValue + ";" + "#" + document.datafrm.strPKey[i].value + "#";
				else
					strValue = "#" + document.datafrm.strPKey[i].value + "#";

				//���淵��ֵ
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
			alert("û��ѡ��ĳһ��ɫ���û�����ѡ��");
			return false;
		}
		else
		{
			document.all.HiddenValue.value = strValue;
		}
	}
	else
	{
		alert("û�м�¼��");
		return false;
	}	
}
//----------------------------------------------
//������CloseWindow()
//���ܣ�����ҳ�����˳�
//������Null
//----------------------------------------------
function CloseWindow(){
	window.close();

}