//用户选择页面增加变量 选择项
function InsertVarUser(oTable,stype){
	//增加call和mostrecentowner变量的选择
	InsertTableBlankRow(oTable);
	oTable.rows(1).cells(0).innerText = 1;
	oTable.rows(1).cells(1).innerText = "变量（caller）";			
	oTable.rows(1).cells(2).innerText = "执行者";
	if (stype=="s")
		oTable.rows(1).cells(3).innerHTML = "<input type='radio' ondblclick ='returnValue(this)' name='rdoSelect' class='inupt_selec' value='${caller}' >";
	else
		oTable.rows(1).cells(3).innerHTML = "<input type='checkbox' name='chkSelect' key ='User' chnname ='变量 （caller）' class='inupt_selec' value='${caller}' >";	
	InsertTableBlankRow(oTable);
	oTable.rows(2).cells(0).innerText = 2;
	oTable.rows(2).cells(1).innerText = "变量（mostRecentCaller）";			
	oTable.rows(2).cells(2).innerText = "步骤执行者";
	if (stype=="s")
		oTable.rows(2).cells(3).innerHTML = "<input type='radio' ondblclick ='returnValue(this)' name='rdoSelect' class='inupt_selec' value='${mostRecentCaller}' >";					
	else
		oTable.rows(2).cells(3).innerHTML ="<input type='checkbox' name='chkSelect' key ='User' chnname ='变量 （mostRecentCaller）' class='inupt_selec' value='${mostRecentCaller}' >";	
	InsertTableBlankRow(oTable);
	oTable.rows(3).cells(0).innerText = 3;
	oTable.rows(3).cells(1).innerText = "变量（mostRecentOwner）";			
	oTable.rows(3).cells(2).innerText = "步骤所有者";
	if (stype=="s")
		oTable.rows(3).cells(3).innerHTML = "<input type='radio' ondblclick ='returnValue(this)' name='rdoSelect' class='inupt_selec' value='${mostRecentOwner}' >";	
	else
		oTable.rows(3).cells(3).innerHTML ="<input type='checkbox' name='chkSelect' key ='User' chnname ='变量 （mostRecentOwner）' class='inupt_selec' value='${mostRecentOwner}' >";	
}
//生成表格的空行	
//返回行号	
function InsertTableBlankRow(oTable)
{
	var cols = oTable.rows(0).cells.length;
	var oTR = oTable.insertRow();
	
	//oTR.onMouseOut = MOut(this);
	//oTR.onMouseOver = mOvr(this);
	//oTR.onclick = SetThisSelect(objCondition);
	for (var i=0;i<cols; i++){
		var oTD = oTR.insertCell();
		oTD.className = "date_table";
		oTD.vAlign="bottom";
		oTD.STYLE = "cursor:default";
		oTD.innerHTML ="";
	}
	return oTR.rowIndex;
}
//删除本行的内容
function DelTableRowContent(obj){	

	var oTr = obj.parentNode.parentNode;
	for (var i=0;i<oTr.cells.length-1;i++){
		oTr.cells(i).children[0].innerHTML="";
	}
	
}

/**
* 表格中的显示用户，角色，组等信息
*/
function showDivInfo(divId,sKey,keyids,keynames){
	var ids = keyids.split(",");
	var idnames = keynames.split(",");
	var items="";
	for (var i=0;i<ids.length;i++){
		items+="<span><input type='checkbox' name='" + sKey + "' value='" + ids[i] +"' isSychro='false' checked onclick='removeItems(this)'>"+idnames[i]+"</span>";
	}
	//var obj = eval("div"+sKey + no );
	var obj = document.getElementById(divId);
	obj.innerHTML = items;			
}	
/**
* 选择用户，角色，用户组等
*/
function choice()
{
	var inputs = document.all.tags("INPUT");
	var len = inputs.length;
	var items = "";
	var num = 0;
	
	for(var i=0;i < len ;i++)
	{
		if(inputs[i].name=="chkSelect" && inputs[i].type=="checkbox" && inputs[i].checked)
		{
			if(hasItem(inputs[i].value))
			{
				which = inputs[i];

				items += "<span><input type='checkbox' name='" + which.key + "' value='"+which.value + "' checked onclick='removeItems(this)' isSychro='false' class='input_selec' >"+ which.chnname+"</span>";
				//if(opener.document.all.doseageStatus!=null) opener.document.all.doseageStatus.value = "true";

				inputs[i].checked = false;
				inputs[i].disabled = true;
				num++;
					
			}else{
				alert("您选择的"+inputs[i].chnname+"已经存在");
				return false;					
			}
		}
	}//*/
	if(num > 0 ) alert("记录新增成功！");
	
	
	opener.document.getElementById(DivId).innerHTML += items;
	//window.close();
}

function hasItem(src)
{
	var haveItem = opener.document.all.tags("INPUT");
	var haveLen = haveItem.length;	
	for(var j=0; j< haveLen;j++)
	{
		if( haveItem[j].value==src && haveItem[j].parentNode.parentNode.id == DivId )
		{
			return false;
		}
	}
	
	return true;			
}
function removeItems(which)
{
	if(confirm("确认删除该选项？"))
	{
		which.parentNode.removeNode(true);			
		alert("删除成功！");
	}else{
		which.checked = true;
	}
}
/**
* 从xml串中装入条件到设置页面的表格中
*/
function LoadConditionXmlToTable(oList){
	for (var i=0;i<oList.length;i++){
		//var type = oList.item(i).getAttribute("type");	
		var userdefine="";
		var classname="",classchn="",userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="",status="",statuschn="",step="",stepchn="";
		//分析参数
		for (var j=0;j<oList.item(i).childNodes.length;j++){					
			var sname="";
			//忽略不按照<arg name='xxx'>xxxx</arg>的格式
			try{sname = oList.item(i).childNodes(j).getAttribute("name");}catch(e){}
			switch(sname){
			case "class.name":
				classname = oList.item(i).childNodes(j).text;						
				break;
			case "class.chn":
				classchn = oList.item(i).childNodes(j).text;
				break;
			case "user":
				userids = oList.item(i).childNodes(j).text;
				break;
			case "username":
				usernames =oList.item(i).childNodes(j).text;
				break;
			case "group":
				groupids = oList.item(i).childNodes(j).text;
				break;					
			case "groupname":
				groupnames = oList.item(i).childNodes(j).text;
				break;					
			case "role":
				roleids =oList.item(i).childNodes(j).text;
				break;					
			case "rolename":
				rolenames =oList.item(i).childNodes(j).text;
				break;					
			case "status":
				status = oList.item(i).childNodes(j).text;
				break;					
			case "statuschn":
				statuschn =oList.item(i).childNodes(j).text;
				break;					
			case "stepId":
				step =oList.item(i).childNodes(j).text;
				break;
			case "stepchn":
				stepchn =oList.item(i).childNodes(j).text;
				break;					
			default:
				userdefine+=oList.item(i).childNodes(j).xml;
			
			}					
		}
		document.getElementById("divClass"+i).innerHTML = "<span value='" + classname + "'><B>类名：</B>"+classname +"</span><span value='" +classchn+ "'>  <B>类中文名：</B>" +classchn + "</span>";
		if (userids!=null && userids!="")
			showDivInfo("divUser"+i,"User",userids,usernames);
		if (groupids!=null && groupids!="")
			showDivInfo("divGroup"+i,"Group",groupids,groupnames);
		if (roleids!=null && rolenames!="")
			showDivInfo("divRole"+i,"Role",roleids,rolenames);				
		if (typeof (status)!="undefined")
			document.getElementById("divStatus" + i).innerHTML = "<span value='" + status + "'>" + statuschn + "</span>";
		if (typeof (step)!="undefined")	
			document.getElementById("divStep" + i).innerHTML = "<span value='" + step + "'>" + stepchn + "</span>";
		if (typeof (userdefine)!="undefined")
			document.getElementById("divUserDefine" + i).innerText = userdefine;
	}	
}
/**
* 从页面表格中获取 条件的xml串 返回 到流程对象中
*/
function SetConditionTableToXml(oTable){
	var conditionXml="";
	for (var i=0;i<oTable.rows.length -1;i++){
		if (document.getElementById("divClass"+i).childNodes.length==0) continue;			
		var classname = document.getElementById("divClass"+i).childNodes(0).getAttribute("value");	
		var classchn = document.getElementById("divClass"+i).childNodes(1).getAttribute("value");
		//classname必须设置
		var type="class";
				
		if (classname=="beanshell") type="beanshell"; 
		conditionXml += '<condition type="'+ type + '">';
		conditionXml += '<arg name ="class.name">'+ classname + '</arg>';
		conditionXml += '<arg name ="class.chn">'+ classchn + '</arg>';
		var userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="";
		var obj = document.getElementById("divUser"+i);
		for (var j=0;j<obj.childNodes.length;j++){
			if (j==0){
				userids+=obj.childNodes(j).childNodes(0).value;
				usernames+=obj.childNodes(j).innerText;
			}else{
				userids+=","+obj.childNodes(j).childNodes(0).value;
				usernames+=","+obj.childNodes(j).innerText;				
			}
		}
		if(userids.length>0){
			conditionXml += '<arg name ="user">'+ userids + '</arg>';
			conditionXml += '<arg name ="username">'+ usernames + '</arg>';
		}
		
		obj = document.getElementById("divGroup"+i);
		for (var j=0;j<obj.childNodes.length;j++){
			if (j==0){
			groupids+=obj.childNodes(j).childNodes(0).value;
			groupnames+=obj.childNodes(j).innerText;
			}else{
			groupids+=","+obj.childNodes(j).childNodes(0).value;
			groupnames+=","+obj.childNodes(j).innerText;
			
			}
		}
		if(groupids.length>0){
			conditionXml += '<arg name ="group">'+ groupids + '</arg>';
			conditionXml += '<arg name ="groupname">'+ groupnames + '</arg>';
		}
		
		obj = document.getElementById("divRole"+i);
		for (var j=0;j<obj.childNodes.length;j++){
			if (j==0){
				roleids+=obj.childNodes(j).childNodes(0).value;
				rolenames+=obj.childNodes(j).innerText;
			}else{
				roleids+=","+obj.childNodes(j).childNodes(0).value;
				rolenames+=","+obj.childNodes(j).innerText;				
			}
		}
		if(roleids.length>0){
			conditionXml += '<arg name ="role">'+ roleids + '</arg>';
			conditionXml += '<arg name ="rolename">'+ rolenames + '</arg>';
		}
		obj = document.getElementById("divStatus"+i);
		if (obj.childNodes.length>0){
			if (obj.childNodes(0).getAttribute("value")!=""){
			conditionXml += '<arg name ="status">'+ obj.childNodes(0).getAttribute("value") + '</arg>';
			conditionXml += '<arg name ="statuschn">'+ obj.childNodes(0).innerText + '</arg>';
			}
		}
		obj = document.getElementById("divStep"+i);
		if (obj.childNodes.length>0){
			if (obj.childNodes(0).getAttribute("value")!=""){
			conditionXml += '<arg name ="stepId">'+ obj.childNodes(0).getAttribute("value") + '</arg>';
			conditionXml += '<arg name ="stepchn">'+ obj.childNodes(0).innerText + '</arg>';
			}
		}		
		userdefine = document.getElementById("divUserDefine"+i).innerText;
		var otemp = SetDom("<root>" + userdefine +"</root>");
		if (otemp==null ||otemp.documentElement ==null){
			alert("请按照xml的格式来设置条件的自定义参数 " + userdefine );						
			return "-1";
		}
							
		conditionXml += userdefine;	
		conditionXml +="</condition>";			
		
	}
	return conditionXml;
}

function SetPrefunctionTableToXml(oTable){
	var prefunctionXml = "";
	for (var i=0;i<oTable.rows.length -1;i++){
		if (document.getElementById("divPreClass"+i).childNodes.length==0) continue;	
		var classname = document.getElementById("divPreClass"+i).childNodes(0).getAttribute("value");	
		var classchn = document.getElementById("divPreClass"+i).childNodes(1).getAttribute("value");
		var type="class";
		if (classname=="beanshell") type="beanshell"; 
		
		prefunctionXml += '<function type="' + type +'">';
		prefunctionXml += '<arg name ="class.name">'+ classname + '</arg>';
		prefunctionXml += '<arg name ="class.chn">'+ classchn + '</arg>';			
		var userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="";
		var obj = document.getElementById("divPreUser"+i);
		for (var j=0;j<obj.childNodes.length;j++){
			if (j==0){
				userids+=obj.childNodes(j).childNodes(0).value;
				usernames+=obj.childNodes(j).innerText;
			}else{
				userids+=","+obj.childNodes(j).childNodes(0).value;
				usernames+=","+obj.childNodes(j).innerText;				
			}
		}
		if(userids.length>0){
			prefunctionXml += '<arg name ="user">'+ userids + '</arg>';
			prefunctionXml += '<arg name ="username">'+ usernames + '</arg>';
		}
		
		obj = document.getElementById("divPreGroup"+i);
		for (var j=0;j<obj.childNodes.length;j++){
			if (j==0){
			groupids+=obj.childNodes(j).childNodes(0).value;
			groupnames+=obj.childNodes(j).innerText;
			}else{
			groupids+=","+obj.childNodes(j).childNodes(0).value;
			groupnames+=","+obj.childNodes(j).innerText;
			
			}
		}
		if(groupids.length>0){
			prefunctionXml += '<arg name ="group">'+ groupids + '</arg>';
			prefunctionXml += '<arg name ="groupname">'+ groupnames + '</arg>';
		}
		
		obj = document.getElementById("divPreRole"+i);
		for (var j=0;j<obj.childNodes.length;j++){
			if (j==0){
				roleids+=obj.childNodes(j).childNodes(0).value;
				rolenames+=obj.childNodes(j).innerText;
			}else{
				roleids+=","+obj.childNodes(j).childNodes(0).value;
				rolenames+=","+obj.childNodes(j).innerText;				
			}
		}
		if(roleids.length>0){
			prefunctionXml += '<arg name ="role">'+ roleids + '</arg>';
			prefunctionXml += '<arg name ="rolename">'+ rolenames + '</arg>';
		}
		obj = document.getElementById("divPreStatus"+i);
		if (obj.childNodes.length>0){
			if (obj.childNodes(0).getAttribute("value")!=""){
			prefunctionXml += '<arg name ="status">'+ obj.childNodes(0).getAttribute("value") + '</arg>';
			prefunctionXml += '<arg name ="statuschn">'+ obj.childNodes(0).innerText + '</arg>';
			}
		}
		obj = document.getElementById("divPreStep"+i);
		if (obj.childNodes.length>0){
			if (obj.childNodes(0).getAttribute("value")!=""){
			prefunctionXml += '<arg name ="stepId">'+ obj.childNodes(0).getAttribute("value") + '</arg>';
			prefunctionXml += '<arg name ="stepchn">'+ obj.childNodes(0).innerText + '</arg>';
			}
		}		
		userdefine = document.getElementById("divPreUserDefine"+i).innerText;
		var otemp = SetDom("<root>" + userdefine +"</root>");
		if (otemp==null ||otemp.documentElement ==null){
			alert("请按照xml的格式来设置前置函数的自定义参数 " + userdefine );						
			return "-1";
		}
		prefunctionXml += userdefine;				
		
		prefunctionXml +="</function>";	

	}
	return prefunctionXml;

}
function SetPostfunctionTableToXml(oTable){
	var postfunctionXml = "";
	for (var i=0;i<oTable.rows.length -1;i++){
		if (document.getElementById("divPostClass"+i).childNodes.length==0) continue;	
		var classname = document.getElementById("divPostClass"+i).childNodes(0).getAttribute("value");	
		var classchn = document.getElementById("divPostClass"+i).childNodes(1).getAttribute("value");
		var type="class";
		if (classname=="beanshell") type="beanshell"; 
		
		postfunctionXml += '<function type="' + type +'">';
		postfunctionXml += '<arg name ="class.name">'+ classname + '</arg>';
		postfunctionXml += '<arg name ="class.chn">'+ classchn + '</arg>';			
		var userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="";
		var obj = document.getElementById("divPostUser"+i);
		for (var j=0;j<obj.childNodes.length;j++){
			if (j==0){
				userids+=obj.childNodes(j).childNodes(0).value;
				usernames+=obj.childNodes(j).innerText;
			}else{
				userids+=","+obj.childNodes(j).childNodes(0).value;
				usernames+=","+obj.childNodes(j).innerText;				
			}
		}
		if(userids.length>0){
			postfunctionXml += '<arg name ="user">'+ userids + '</arg>';
			postfunctionXml += '<arg name ="username">'+ usernames + '</arg>';
		}
		
		obj = document.getElementById("divPostGroup"+i);
		for (var j=0;j<obj.childNodes.length;j++){
			if (j==0){
			groupids+=obj.childNodes(j).childNodes(0).value;
			groupnames+=obj.childNodes(j).innerText;
			}else{
			groupids+=","+obj.childNodes(j).childNodes(0).value;
			groupnames+=","+obj.childNodes(j).innerText;
			
			}
		}
		if(groupids.length>0){
			postfunctionXml += '<arg name ="group">'+ groupids + '</arg>';
			postfunctionXml += '<arg name ="groupname">'+ groupnames + '</arg>';
		}
		
		obj = document.getElementById("divPostRole"+i);
		for (var j=0;j<obj.childNodes.length;j++){
			if (j==0){
				roleids+=obj.childNodes(j).childNodes(0).value;
				rolenames+=obj.childNodes(j).innerText;
			}else{
				roleids+=","+obj.childNodes(j).childNodes(0).value;
				rolenames+=","+obj.childNodes(j).innerText;				
			}
		}
		if(roleids.length>0){
			postfunctionXml += '<arg name ="role">'+ roleids + '</arg>';
			postfunctionXml += '<arg name ="rolename">'+ rolenames + '</arg>';
		}
		obj = document.getElementById("divPostStatus"+i);
		if (obj.childNodes.length>0){
			if (obj.childNodes(0).getAttribute("value")!=""){
			postfunctionXml += '<arg name ="status">'+ obj.childNodes(0).getAttribute("value") + '</arg>';
			postfunctionXml += '<arg name ="statuschn">'+ obj.childNodes(0).innerText + '</arg>';
			}
		}
		obj = document.getElementById("divPostStep"+i);
		if (obj.childNodes.length>0){
			if (obj.childNodes(0).getAttribute("value")!=""){
			postfunctionXml += '<arg name ="stepId">'+ obj.childNodes(0).getAttribute("value") + '</arg>';
			postfunctionXml += '<arg name ="stepchn">'+ obj.childNodes(0).innerText + '</arg>';
			}
		}		
		userdefine = document.getElementById("divPostUserDefine"+i).innerText;
		var otemp = SetDom("<root>" + userdefine +"</root>");
		if (otemp==null ||otemp.documentElement ==null){
			alert("请按照xml的格式来设置后置函数的自定义参数 " + userdefine );						
			return "-1";
		}
		postfunctionXml +=userdefine;
		postfunctionXml +="</function>";	
	}	
	return postfunctionXml;
}
function LoadPrefunctionXmlToTable(oList){
	for (var i=0;i<oList.length;i++){		
		//var type = oList.item(i).getAttribute("type");					
		var userdefine="";
		var classname="",classchn="",userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="",status="",statuschn="",step="",stepchn="";
		//分析参数
		for (var j=0;j<oList.item(i).childNodes.length;j++){							
			var sname="";
			//忽略不按照<arg name='xxx'>xxxx</arg>的格式
			try{sname = oList.item(i).childNodes(j).getAttribute("name");}catch(e){}
				
			switch(sname){
			case "class.name":
				classname = oList.item(i).childNodes(j).text;						
				break;
			case "class.chn":
				classchn = oList.item(i).childNodes(j).text;
				break;
			case "user":
				userids = oList.item(i).childNodes(j).text;
				break;
			case "username":
				usernames =oList.item(i).childNodes(j).text;
				break;
			case "group":
				groupids = oList.item(i).childNodes(j).text;
				break;					
			case "groupname":
				groupnames = oList.item(i).childNodes(j).text;
				break;					
			case "role":
				roleids =oList.item(i).childNodes(j).text;
				break;					
			case "rolename":
				rolenames =oList.item(i).childNodes(j).text;
				break;					
			case "status":
				status = oList.item(i).childNodes(j).text;
				break;					
			case "statuschn":
				statuschn =oList.item(i).childNodes(j).text;
				break;					
			case "stepId":
				step =oList.item(i).childNodes(j).text;
				break;
			case "stepchn":
				stepchn =oList.item(i).childNodes(j).text;
				break;					
			default:
				userdefine+=oList.item(i).childNodes(j).xml;
			
			}					
		}
		document.getElementById("divPreClass"+i).innerHTML = "<span value='" + classname + "'><B>类名：</B>"+classname +"</span><span value='" +classchn+ "'>  <B>类中文名：</B>" +classchn + "</span>";
		if (userids!=null && userids!="")
			showDivInfo("divPreUser"+i,"User",userids,usernames);
		if (groupids!=null && groupids!="")
			showDivInfo("divPreGroup"+i,"Group",groupids,groupnames);
		if (roleids!=null && rolenames!="")
			showDivInfo("divPreRole"+i,"Role",roleids,rolenames);				
		if (typeof (status)!="undefined")
			document.getElementById("divPreStatus" + i).innerHTML = "<span value='" + status + "'>" + statuschn + "</span>";
		if (typeof (step)!="undefined")	
			document.getElementById("divPreStep" + i).innerHTML = "<span value='" + step + "'>" + stepchn + "</span>";
		if (typeof (userdefine)!="undefined")
			document.getElementById("divPreUserDefine" + i).innerText = userdefine;
	}	

}
function LoadPostfunctionXmlToTable(oList){

	for (var i=0;i<oList.length;i++){
		//var type = oList.item(i).getAttribute("type");				
		var userdefine="";
		var classname="",classchn="",userids="",usernames="",groupids="",groupnames="",roleids="",rolenames="",status="",statuschn="",step="",stepchn="";
		//分析参数
		for (var j=0;j<oList.item(i).childNodes.length;j++){
			var sname="";
			//忽略不按照<arg name='xxx'>xxxx</arg>的格式
			try{sname = oList.item(i).childNodes(j).getAttribute("name");}catch(e){}
			switch(sname){
			case "class.name":
				classname = oList.item(i).childNodes(j).text;						
				break;
			case "class.chn":
				classchn = oList.item(i).childNodes(j).text;
				break;
			case "user":
				userids = oList.item(i).childNodes(j).text;
				break;
			case "username":
				usernames =oList.item(i).childNodes(j).text;
				break;
			case "group":
				groupids = oList.item(i).childNodes(j).text;
				break;					
			case "groupname":
				groupnames = oList.item(i).childNodes(j).text;
				break;					
			case "role":
				roleids =oList.item(i).childNodes(j).text;
				break;					
			case "rolename":
				rolenames =oList.item(i).childNodes(j).text;
				break;					
			case "status":
				status = oList.item(i).childNodes(j).text;
				break;					
			case "statuschn":
				statuschn =oList.item(i).childNodes(j).text;
				break;					
			case "stepId":
				step =oList.item(i).childNodes(j).text;
				break;
			case "stepchn":
				stepchn =oList.item(i).childNodes(j).text;
				break;					
			default:
				userdefine+=oList.item(i).childNodes(j).xml;
			
			}					
		}
		document.getElementById("divPostClass"+i).innerHTML = "<span value='" + classname + "'><B>类名：</B>"+classname +"</span><span value='" +classchn+ "'>  <B>类中文名：</B>" +classchn + "</span>";
		if (userids!=null && userids!="")
			showDivInfo("divPostUser"+i,"User",userids,usernames);
		if (groupids!=null && groupids!="")
			showDivInfo("divPostGroup"+i,"Group",groupids,groupnames);
		if (roleids!=null && rolenames!="")
			showDivInfo("divPostRole"+i,"Role",roleids,rolenames);				
		if (typeof (status)!="undefined")
			document.getElementById("divPostStatus" + i).innerHTML = "<span value='" + status + "'>" + statuschn + "</span>";
		if (typeof (step)!="undefined")	
			document.getElementById("divPostStep" + i).innerHTML = "<span value='" + step + "'>" + stepchn + "</span>";
		if (typeof (userdefine)!="undefined")
			document.getElementById("divPostUserDefine" + i).innerText = userdefine;
	}	
}
//点击增加表格的空行
function AddConditionBlankRow(tableid){
	var oTable = document.getElementById(tableid);
	//var oTable = obj.parentNode.parentNode.parentNode;
	var irow = InsertTableBlankRow(oTable); //行号
	var ino = irow -1;
	oTable.rows(irow).cells(0).innerHTML = '<div id="divClass'+ino +'"></div>&nbsp;'
	oTable.rows(irow).cells(1).innerHTML = '<div id="divUser' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(2).innerHTML = '<div id="divGroup' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(3).innerHTML = '<div id="divRole' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(4).innerHTML = '<div id="divStatus' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(5).innerHTML = '<div id="divStep' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(6).innerHTML = '<div id="divUserDefine' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(7).innerHTML = '<input onclick="showSetParameter(this,\'1\',\'\')" type="button" value="设置" name="setParameter"><input onclick="DelTableRowContent(this)" type="button" value="清空" name="delParameter" >';
} 
function AddPrefunctionBlankRow(tableid){
	var oTable = document.getElementById(tableid);
	//var oTable = obj.parentNode.parentNode.parentNode;
	var irow = InsertTableBlankRow(oTable); //行号
	var ino = irow -1;
	oTable.rows(irow).cells(0).innerHTML = '<div id="divPreClass'+ino +'"></div>&nbsp;'
	oTable.rows(irow).cells(1).innerHTML = '<div id="divPreUser' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(2).innerHTML = '<div id="divPreGroup' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(3).innerHTML = '<div id="divPreRole' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(4).innerHTML = '<div id="divPreStatus' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(5).innerHTML = '<div id="divPreStep' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(6).innerHTML = '<div id="divPreUserDefine' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(7).innerHTML = '<input onclick="showSetParameter(this,\'2\',\'Pre\')" type="button" value="设置" name="setPrefunction"><input onclick="DelTableRowContent(this)" type="button" value="清空" name="delPrefunction" >';
}
function AddPostfunctionBlankRow(tableid){
	var oTable = document.getElementById(tableid);
	//var oTable = obj.parentNode.parentNode.parentNode;
	var irow = InsertTableBlankRow(oTable); //行号
	var ino = irow -1;
	oTable.rows(irow).cells(0).innerHTML = '<div id="divPostClass'+ino +'"></div>&nbsp;'
	oTable.rows(irow).cells(1).innerHTML = '<div id="divPostUser' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(2).innerHTML = '<div id="divPostGroup' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(3).innerHTML = '<div id="divPostRole' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(4).innerHTML = '<div id="divPostStatus' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(5).innerHTML = '<div id="divPostStep' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(6).innerHTML = '<div id="divPostUserDefine' + ino +'"></div>&nbsp;';
	oTable.rows(irow).cells(7).innerHTML = '<input onclick="showSetParameter(this,\'2\',\'Post\')" type="button" value="设置" name="setPostfunction"><input onclick="DelTableRowContent(this)" type="button" value="清空" name="delPostfunction" >';
}	   
	
//打开设置类参数的页面，obj为当前点击的button
//type=1 条件类，2函数类
//divFix div的后缀名
function showSetParameter(obj,type,divFix){
	var irow = obj.parentNode.parentNode.rowIndex-1;
	//准备信息
	var arr = new Array();
	var objOpener = window.dialogArguments;
	arr[0] = objOpener.FlowArea.FlowNodes.Nodes;
	arr[1] = type; //条件 classtype='1'条件 2 前置后置函数
	
	var obj = new ParameterInfo();
	var divID = "div" + divFix + "Class" + irow;
	obj.divClass = document.getElementById(divID).innerHTML;
	divID = "div" + divFix + "User" + irow;
	obj.divUser = document.getElementById(divID).innerHTML;
	divID = "div" + divFix + "Group" + irow;
	obj.divGroup = document.getElementById(divID).innerHTML;
	divID = "div" + divFix + "Role" + irow;
	obj.divRole = document.getElementById(divID).innerHTML;
	
	divID = "div" + divFix + "Status" + irow;
	var oSel = document.getElementById(divID);
	if (oSel.childNodes.length>0){
		obj.status = oSel.childNodes(0).getAttribute("value");
		obj.statuschn = oSel.childNodes(0).innerText;
	}	
		
	divID = "div" + divFix + "Step" + irow;
	var oSel = document.getElementById(divID);
	if (oSel.childNodes.length>0){
		obj.step = oSel.childNodes(0).getAttribute("value");
		obj.stepchn = oSel.childNodes(0).innerText;
	}	
	
	divID = "div" + divFix + "UserDefine" + irow;
	obj.userdefine = document.getElementById(divID).innerText;
	
	arr[2] = obj;


	var oPara = window.showModalDialog("SetParameters.htm", arr, "dialogHeight:580px; dialogWidth:900px;help:no;center:yes;status:no;resizable:no;location:yes;scroll:no");
	if (oPara==null) return;
	var divID = "div" + divFix + "Class"+irow;
	document.getElementById(divID).innerHTML= oPara.divClass;
	divID = "div" + divFix + "User"+irow;
	document.getElementById(divID).innerHTML = oPara.divUser;
	divID = "div" + divFix + "Group" + irow;
	document.getElementById(divID).innerHTML = oPara.divGroup;
	divID = "div" + divFix + "Role" + irow;
	document.getElementById(divID).innerHTML = oPara.divRole;
	
	divID = "div" + divFix + "Status"+irow;
	document.getElementById(divID).innerHTML = "<span value='" + oPara.status + "'>" + oPara.statuschn + "</span>";
	divID = "div" + divFix + "Step" + irow;
	document.getElementById(divID).innerHTML = "<span value='" + oPara.step + "'>" + oPara.stepchn + "</span>";
	
	divID = "div" + divFix + "UserDefine" + irow;
	document.getElementById(divID).innerText = oPara.userdefine; 
	
	
}	
//装入流程状态的下拉列表选择项
function loadStatusComboxOptions(){
			//装入定义的流程状态
		var strReturn=SendHttp(fcpubdata.servletPath +"/DesignerServlet"+fcpubdata.dotnetVersion+"?operate=flow_getstatuslist","");
		var oXml = SetDom(strReturn);
		if (oXml.documentElement==null) return;
		
		if (oXml.childNodes(0).childNodes(0).text=="false"){
			alert(oXml.childNodes(0).childNodes(1).text);
			return;
		}
		var oList = oXml.getElementsByTagName("record");
		var status,statuschn;
		//var sCombox='<select id="selStatus" NAME="selStatus">';
		var sCombox = "";
		//sCombox="<option value=''></option>";
		for (var i=0; i<oList.length; i++){
			status = oList.item(i).childNodes(0).text;
			statuschn = oList.item(i).childNodes(1).text;
			sCombox += "<option value='" + status +"'>" + statuschn + "</option>";
		}	
		//sCombox +='</select>';
		//objCbo.outerHTML = sCombox;
		return sCombox;

}