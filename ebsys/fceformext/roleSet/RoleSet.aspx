<%@ Page language="c#" Codebehind="RoleSet.aspx.cs" AutoEventWireup="false" Inherits="WebBill.ebsys.fceformext.roleSet.RoleSet" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html>
  <head>
    <title>权限设置</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
    <style>
		.alternate{ background-color:#f6f6f6; height:30px;}
		.alternate2{ background-color:#fbfbfb; height:30px;}
		body,td,th,p,div,span,select,form,option,textarea,li,a{ font-size:12px; font-family:"宋体";}
    </style>
    <script language=javascript>
<!--
var myObj = window.dialogArguments;
var objType = myObj.type;
var objid = myObj.id;

/**
 * 取消
**/
function doCancel()
{
	window.returnValue = myObj.roleXml;
	window.close();
}
/**
 * 确定
**/
function Save()
{
	var strXml = "";
	var irows = document.all.tab.rows.length;
	if (irows >0)
	{
		strXml += "<record id ='"+objid+"' type='"+objType+"'>";
		for(var i=0;i<irows;i++)
		{
			var chkDisplay = document.all.chkDisplay[i].checked;
			var chkDisabled = document.all.chkDisabled[i].checked;
			var chkRead = document.all.chkRead[i].checked;
			if (chkDisplay != false || chkDisabled != false || chkRead != false)
			{
				var strName = document.all.tab.rows[i].cells[0].innerText;
				strName = strName.replace(/^\s*/, "").replace(/\s*$/, "");
				strXml += "<Name value ='"+strName+"'>";
				strXml += "<Display>"+chkDisplay+"</Display>";
				strXml += "<Disabled>"+chkDisabled+"</Disabled>";
				strXml += "<Read>"+chkRead+"</Read>";
				strXml += "</Name>";
			}
		}
		strXml += "</record>";
	}
	window.returnValue = strXml;
	window.close();
	//alert(strXml);
}

function initLoad()
{
	var oXml=new ActiveXObject("Microsoft.XMLDOM");
	oXml.async=false;
	oXml.loadXML ("<root>"+myObj.roleXml+"</root>");

	var irows = document.all.tab.rows.length;
	if (irows >0)
	{
		for(var i=0;i<irows;i++)
		{
			var strName = document.all.tab.rows[i].cells[0].innerText;
			strName = strName.replace(/^\s*/, "").replace(/\s*$/, "");
			
			var oNode = oXml.selectNodes("root/record/Name[@value = '"+strName+"']")
			
			if (oNode.length>0)
			{
				var chkDisplay = oNode(0).childNodes(0).text;
				var chkDisabled = oNode(0).childNodes(1).text;
				var chkRead = oNode(0).childNodes(2).text;
				//alert("display："+chkDisplay + "  diabled："+chkDisabled + "  read："+ chkRead);
				
				eval("document.all.chkDisplay[i].checked = "+chkDisplay);
				eval("document.all.chkDisabled[i].checked = "+chkDisabled);
				eval("document.all.chkRead[i].checked = "+chkRead);
			}
		}
	}
}
//-->
</script>

  </head>
  <body MS_POSITIONING="GridLayout" scroll=no onload="initLoad();">
    <form id="Form1" method="post" runat="server">
		<TABLE border="0" cellpadding="0" cellspacing="0"  width="100%" frame=border>
				<TR class=alternate>
					<TD><b>操作员权限设置</b></TD>
				</TR>
				<TR class=alternate2>
					<TD vAlign="top" width="100%">
						<DIV id="div1" style="OVERFLOW: auto;HEIGHT: expression(document.body.offsetHeight-90)"
							runat="server"></DIV>
					</TD>
				</TR>
			</TABLE>
			<TABLE cellPadding="0" width="100%" border="0" height="56">
				<TR class="alternate">
					<TD align="right">
						<INPUT id="btnOk" onclick="Save();" value="确定" class="button-1" type="button" name="btnOk"> &nbsp;&nbsp;
						<INPUT id=btnCancel onclick="doCancel()" class="button-1" type=button value="取消" name=btnCancel>&nbsp;&nbsp;
					</TD>
				</TR>
			</TABLE>
     </form>
  </body>
</html>
