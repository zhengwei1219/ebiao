
//2004-03-03 用户自定义的全局函数,用于放一些在某个模块中(比如CRM JXC)常用的全局函数.
function getuser() {
	return "fc";
}
function getusername() {
	return "fc";
}

/**
* 控制打开eform设计的表单的权限
* 在此函数中用parent.Request.QueryString("djsn").toString() 形式接收?后的参数.
*@return 空 表示无权打开.
*@date 2006-02-11
**/
function EformEnterStatus() {
/*
	var djtype = parent.Request.QueryString("djtype").toString();  //表单分类号
	var djsn = parent.Request.QueryString("djsn").toString();	//表单djsn

	if(djsn == "application_sub"){
		var name = GetSession('username=')['username'];
		if(name == "liuxm"){
			return "";
		}
	
	}
*/
	return "OK";
}
/**
* 从表的另一种保存模式时的从键字段的生成函数
*@param iRowNo 行号，从0开始的,整型
*@param sSubKeyFieldName 从键的字段名
**/
function IGetSubTableKeyValue(iRowNo,sSubKeyFieldName) {
	return iRowNo + 1 ;
}
/**
* 控制能不能运行某个报表
*@date 2007-04-18
**/
function EbiaoEnterStatus(callback) {
	/**
	参照下面的示例代码来对运行报表进行权限控制,即先从session变量中取出权限信息,然后再判断.
	GetSession("username",function (arrRet){
		var sessionValue = arrRet["username"];
		alert(parent.Request.QueryString("name").toString()); //报表名称
		alert(parent.Request.QueryString("file").toString()); //报表文件
		if(sessionValue == "liuxm" && parent.Request.QueryString("name").toString()=="销售汇总报表" ){
			alert("你无权运行此报表!");
			callback(false); //通知关闭窗口
			return;
		}
		callback(true); 
	})
	*/
	// fcpub.toolbar = "preview,print,printdirect,printall,|,query,pageset,refresh,|,expexcel,expexcelall,directexppdf";e_directrun
	
//	if(parent.Request.QueryString("e_runsavefile").toString() != "undefined" || (parent.Request.QueryString("e_directrun").toString() != "undefined" && parent.Request.QueryString("e_directrun").toString() != "yes") ){
//		fcpub.tempFilePath =  GetUrlFirstPart() + "/ebsys/ebtmpfile1/";
//	}
	callback(true); //执行此命令表示能正常运行报表.
}
/**
* 从工具栏上点保存按钮时执行此函数,它用保存当前报表运行结果时
*@date 2007-09-03
**/
function EbiaoSaveEvent() {
	//此处做弹出一个输入窗口工作,按确定关闭窗口后,将要保存的文件名传给下面的saveFileName变量,要保存的路径传给fcpub.tempFilePath变量,
	
	var saveFileName = "curSave";//要保存的主文件名
	RunReport(1,"保存",saveFileName,function (result){
		var TotalPages = result.pages ; //总页数
		var sRetValue = result.value ; //本次报表运行的参数与宏的xml字符串.
		var sReportFile = parent.sPubPath; //本次运行的报表文件.
	});

}

/**
* 打开表单元素权限设置窗口 added by liuxr at 2008-3-14
* 此函数在属性窗口的权限设置按钮的点击事件上调用
**/
function EformActionButtonClick()
{
    var arr = fcpubdata.obj[0];
    var isMulti = arr.constructor == window.Array || arr.length > 1;
    if (isMulti) {
        for (var i = 0; i < arr.length; i++) {
            if (IsSpace(arr[i]) == false && arr[i].controltype == "dataset") {
                alert("选中包含数据集控件在内的多个控件时,不能进入权限设置!");
                return;
            }
        }
    }
    var obj = arr;
    if (isMulti) obj = arr[0];

    var MainDiv = fcpubdata.obj[2]; 	//eformarea();
    var sFile = fcpubdata.path + "/fceform/common/djframe.htm?djsn=roleSet&djtype=OF";	
    //var sFile = fcpubdata.path + "/fceform/common/djframe.htm?djsn=rs_role_set&djtype=WF_DSN";
    if (obj.controltype == "dataset") {
        obj.curFieldName = dssub1.Field("fdname").Value;
    }
    var strReturn = window.showModalDialog(sFile, [MainDiv, obj, isMulti], "scroll:no;status:no;dialogHeight:480px;dialogWidth:380px;dialogTop:180;dialogLeft:250px");
    if (IsSpace(strReturn) == false) {
        //alert(obj.controltype);
        //obj.roleXml = strReturn;
        var stmp = "";
        if (IsSpace(MainDiv.roleXml) == false) {
            var oXml = SetDom("<root>" + MainDiv.roleXml + "</root>");
            if (isMulti) {
                for (var j = 0; j < arr.length; j++) {
                    var obj = arr[j];
                    var oNodes = oXml.selectNodes("root/record[@id = '" + obj.id + "']");
                    for (var i = 0; i < oNodes.length; i++) {
                        oXml.documentElement.removeChild(oNodes(i));
                    }
                }

            } else {
                //删除原来的	
                if (obj.controltype == "dataset") {
                    var oNodes = oXml.selectNodes("root/record[@id = '" + obj.id + "' and @fieldname = '" + obj.curFieldName + "' ]");
                } else {
                    var oNodes = oXml.selectNodes("root/record[@id = '" + obj.id + "']");
                }
                for (var i = 0; i < oNodes.length; i++) {
                    oXml.documentElement.removeChild(oNodes(i));
                }
            }
            stmp = new Eapi.Str().removeRoot(oXml.documentElement.xml);
        }

        MainDiv.roleXml = stmp + strReturn;
        //alert(MainDiv.roleXml);
        //CopyToPub(MainDiv.roleXml);
    }
}

/**
*页面运行时表单元素的权限检查 added by liuxr at 2008-3-14
* 此函数在表单打开事件中调用,也可以在自己需要时调用
**/
function EformCheckRoleInfo()
{
	if (IsSpace(fcpubdata.area.roleXml)) return ;
	var strRoleXml = fcpubdata.area.roleXml
	if(strRoleXml == "<root></root>") return;
	/*if(fcpubdata.dotnetVersion==".aspx"){
		var retX=SendHttp(location.protocol+"//"+location.host + fcpubdata.path + "/fceformext/roleSet/RoleCheck.aspx",strRoleXml);
		//alert(retX);
		try{
			eval(retX);
		}catch(e){}
	}else{*/
		SendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=roleCheckEmployee",strRoleXml,function(result){
//		SendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=profileCheck",strRoleXml,function(result){
			if(result.value == null)return;
			try{
				eval(result.value);
			}catch(e){}
		});
	//}
}
/**
* 给联通做的示例表单中用,用于动态取得列信息.
* 2009-11-16
**/
function lt_get_col_info() {
    var sqlstr = "select id,";

    var xmlRet = SelectSql("select fieldname,chnname from lt_fieldinfo where typeid='" + cboType.value + "'", 1, -1);

    var oXml = SetDom(xmlRet);
    if (oXml.documentElement == null) {
        alert(xmlRet);
        return true;
    }
    if (oXml.documentElement.childNodes.length <= 1) {
        alert("没有查到要显示的列");
        return true;
    }
    for (var i = 0; i < oXml.documentElement.childNodes.length - 1; i++) {
        sqlstr += oXml.documentElement.childNodes(i).childNodes(0).text + " as " + oXml.documentElement.childNodes(i).childNodes(1).text + ",";
    }
    sqlstr = sqlstr.substring(0, sqlstr.length - 1);
    sqlstr += " from lt_data ";
    //CopyToPub(escape(sqlstr));

    fcpubdata.pubSqlStr = sqlstr;
    sqlstr += " where rtrim(typeid)='" + cboType.value + "'"
    if (fcpubdata.dotnetVersion == "") sqlstr = escape(sqlstr);
    new Eapi.EformEbiao().run(ebiao1, "&sqlstr=" + escape(sqlstr));
    return false;
}