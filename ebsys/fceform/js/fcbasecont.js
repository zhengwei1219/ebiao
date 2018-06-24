///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />
///<reference path="/ebsys/fceform/js/fcbasecont.js" />

Eapi.BaseCont = function(){}
Eapi.BaseCont.prototype =
{
    setRadioValue : SetRadioValue ,
    setCheckBoxValue : SetCheckBoxValue ,
    sqlToOption : fillcombox ,
    selectAddOption : SelectAddOption ,
    addOption : function (obj,sHtml) {
        var ss=obj.outerHTML;
        obj.outerHTML = ss.substring(0,ss.length-9)+sHtml+"</select>";
    } ,
    setDisabled : function (arrObjs,boolValue){
        for(var i=0;i<arrObjs.length;i++){
            var obj = $id(arrObjs[i]);
            if(boolValue){
                obj.disabled = true;
            }else{
                obj.disabled = false;
                obj.removeAttribute("disabled");
            }
        }
    },
    sqlCombo : SqlCombo ,
    setComboText : SetComboText ,
    radioListInit : DivRadioInitLoad ,
    checkboxListInit : DivCheckBoxInitLoad ,
    getRadioListValue : GetDivRadioValue ,
    getCheckBoxListValue : GetDivCheckBoxValue ,
    setRadioListValue : SetDivRadioValue ,
    setCheckBoxListValue : SetDivCheckBoxValue ,
    sqlToRadio : SqlToRadio 
}
if(Type.parse("Eapi.BaseCont") == null) Eapi.BaseCont.registerClass("Eapi.BaseCont");

/**
//给值,r1为radio对象名,sValue为要给的值
**/
function SetRadioValue(r1,sValue){
 	//alert(sValue)

	r1.value=sValue;
	//第一个元素不要
	for(var i=1;i<r1.childNodes.length;i++){
	   if(typeof r1.childNodes[i].tagName!="undefined"){
			if(r1.childNodes[i].tagName.toUpperCase()=="INPUT"){
				//alert(r1.childNodes(i).value)
				if(r1.childNodes[i].value==r1.value){
					r1.childNodes[i].checked=true;
                    if(NavJs.getClassName(r1.childNodes[i]) == "ef_out"){ //变图标
			            var radioEl=document.getElementsByName(r1.childNodes[i].name);
			            for(var i=radioEl.length;i>0;i--){
			                if (radioEl[i - 1].type && radioEl[i - 1].type == "radio") {
					            NavJs.setClassName(radioEl[i-1].previousSibling,NavJs.getClassName(radioEl[i-1].previousSibling).replace(/ef_input_radio_[^_]+_(out|over)/,"ef_input_radio_"+(radioEl[i-1].checked?"":"no")+"check_$1"));	
				            }
			            }
                        
                    }
					break;
				}
			}

			if(r1.childNodes[i].tagName.toUpperCase()=="TABLE"){
				var oTable = r1.childNodes[i];
				for(var j=0;j<oTable.rows.length;j++){
					for(var k=0;k<oTable.rows[j].cells.length;k++){
						var oRadio = oTable.rows[j].cells[k].childNodes[0] ;
						if(oRadio.value == sValue){
							oRadio.checked=true;
							return;
						}					
					}
				}
			}
	   }
	}

}
/**
给checkbox值
*@date 2004-08-25
**/
function SetCheckBoxValue(obj,sValue){
    var oInput = obj.children[0];
    var oSpan = null;
    if(obj.children[0].tagName == "SPAN"){
        oInput = obj.children[1];
        oSpan = obj.children[0];
    }
        
	if(obj.getAttribute("truevalue") == sValue){
		oInput.checked=true;
		if (oSpan != null) {
		    NavJs.setClassName(oSpan, NavJs.getClassName(oSpan).replace("_nocheck_","_check_"));
		}
	}else{
		oInput.checked=false;
		if(oSpan != null){
		    NavJs.setClassName(oSpan, NavJs.getClassName(oSpan).replace("_check_","_nocheck_"));
		}
	}
	obj.value=sValue;
}

/**
*sql语句查询的内容到combox中
*@param sSql:sql语句
*@return 返回的串不带根节点,<option>...</option>...
**/
function fillcombox(oSql,callback,context) {
	if(typeof oSql == "undefined"  || oSql == "undefined" ) { return "" ;}
	
    var oDsn = new Eapi.Str().getDsnSql(oSql);

    //替代非法XML字符
    if (IsSpace(oDsn.sql)) oDsn.sql = "";
    var sXml = "<sql>" + RepXml(oDsn.sql) + "</sql>";

    //支持调用外部dll, 2013-07-17
    if (IsSpace(oSql) == false && IsSpace(oSql.xml) == false) {
    //格式：<dllFileName></dllFileName><nameSpaceClass></nameSpaceClass><methodName></methodName>
        sXml += "<classXml>" + oSql.xml + "</classXml>";
    }
	
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=fillcombox"+oDsn.dsn,sXml,callback,context);
	if(IsSpace(retX)==false){
	    if(retX.substring(0,8).toLowerCase() != "<option "){
	        alert(retX); //提示后台的错误信息
	    }
	}
	return retX;
	//返回的串不带根节点
	//<option>...</option>...
}
/**
*对select控件加上option串
*@param obj 要加的select 对象
*@param sHtml 要加的option串
*@return 新的outerHTML串,将它给obj.outerHTML即可
*@date 2005-01-16
**/
function SelectAddOption(obj,sHtml) {
	var ss=obj.outerHTML;
	return ss.substring(0,ss.length-9)+sHtml+"</select>";
}
/**
*用一个sql语句的结果填充combox
*@param obj combox对象
*@date 2003-09-23
**/
function sqlcombox(obj,sql){
   if(typeof obj != "object") obj=$id(obj);
   if(isSpace(sql)==false)obj.setAttribute("sql",sql);
   if(isSpace(obj.getAttribute("sql"))==false){
       var s1 = fillcombox(obj.getAttribute("sql"));
       if(isSpace(s1)==false){
           obj.outerHTML=SelectAddOption(obj,s1);
       }
   }
   //支持调用外部dll, 2013-07-17
   if (IsSpace(obj.getAttribute("xml")) == false) {
       var oDsn = new Object();
       oDsn.xml = unescape(obj.getAttribute("xml"));
       var s1 = fillcombox(oDsn);
       if(isSpace(s1)==false){
           obj.outerHTML=SelectAddOption(obj,s1);
       }
   }
   
}
function SqlCombo(obj,sql){sqlcombox(obj,sql);}
/**
* 采用动态加option的方式填充combobox
**/
function SqlCombo1(obj,sql){
   if(typeof obj != "object") obj=$id(obj);
   if (isSpace(sql) == false) obj.setAttribute("sql", sql);
   if (isSpace(obj.getAttribute("sql")) == false) {
       var s1 = fillcombox(obj.getAttribute("sql"));
       if(isSpace(s1)==false){
            obj.options.length = 0;
            var oXml = SetDom("<root>"+s1+"</root>"); 
            if(oXml.documentElement != null){
                for(var i=0;i<oXml.documentElement.childNodes.length;i++){
                    var oOpt = document.createElement("option");
				    oOpt.text = NavJs.getNodeValue1(oXml,i);
				    oOpt.value=oXml.documentElement.childNodes[i].getAttribute("value");
				    obj.add(oOpt);
                
                }
            }
       }
   }
}
/**
*由combobox控件的text值来得到选中
*@param obj  combobox控件
*@param sText 给的text属性值
*@date 2005-11-11
**/
function SetComboText(obj,sText) {
	l=obj.options.length ;
	for(var i=0;i<l;i++){
		if(obj.options[i].text == sText){
			obj.selectedIndex = i;
			return
		}
	}
}

/*@date:2004-12-08
@主要功能:在数据库中查出的每一条记录作为一个Radio出现!
@编写程序:liuhao
* @修改日期：2010-4-27 15:57
* @修改人：liuxr
* @修改原因： 给单选框列表增加常数选项

*/
function DivRadioInitLoad(obj, sql, callback, context) {
    //if (isSpace(obj.sqltrans) && IsSpace(sql)) return;

    //if(isSpace(obj.sqltrans)) return ;
    //modify by liuxr at 2009-11-19 17:19 去掉调试语句

    //liuxr 2010-4-27 常数赋值
    if (obj.getAttribute("check") == "1"){
        var stxt = obj.getAttribute("tempvalue").split("\r\n");
        var sval = obj.getAttribute("temptext").split("\r\n");

        var sHtml = ""
        if (IsSpace(obj.getAttribute("temptext")) == false) {
            var strReturn = "<root>";
            for (var i = 0; i < stxt.length; i++) {
                try {
                    s1 = stxt[i];
                    s2 = sval[i];
                    if (typeof s1 == "undefined") {
                        s1 = "";
                    }
                    if (typeof s2 == "undefined") {
                        s2 = "";
                    }
                } catch (e) {
                    s1 = "";
                    s2 = "";
                }

                strReturn += "<tr><td>" + s1 + "</td><td>" + s2 + "</td></tr>";
            }

            strReturn += "<tr><td>" + stxt.length + "</td><td>" + stxt.length + "</td></tr></root>";
            afterHttpReturn(obj, strReturn);
        }
    }
    else        //SQL语句赋值
    {

        if (IsSpace(sql)) {
            var strsql = UnSqlPropTrans(obj.getAttribute("sqltrans"));
        } else {
            var strsql = sql;
        }
        strsql = RepOpenSql(strsql);
        if (IsSpace(strsql)) return;
        var oSql = new Object();
        oSql.sql = strsql;
        oSql.datasourceName = obj.getAttribute("datasourceName");

        if (typeof (callback) != "function") {
            var strReturn = SelectSql(oSql, 1, -1);
            afterHttpReturn(obj, strReturn);
        } else {
            SelectSql(oSql, 1, -1, function(result) {
                var strReturn = result.value;
                var obj = result.context[0];
                afterHttpReturn(obj, strReturn);
                var newResult = new Object();
                newResult.value = result.value;
                newResult.context = result.context[1];
                callback(newResult);

            }, [obj, context]);

        }
    }
    function afterHttpReturn(obj, strReturn) {
        var sfont = obj.style.fontSize;
        var sfontstyle = obj.style.fontStyle;
        var sfontweight = obj.style.fontWeight;
        var sColor = obj.style.color;
        var oXml = SetDom(strReturn);
        if (oXml.documentElement == null) {
            alert(strReturn);
            return;
        }
        var sLen = oXml.documentElement.childNodes.length; //子节点的个数

        var cols = ToInt(obj.getAttribute("rows")); //此处不能用getAttribute
        if (cols == 0) cols = 1;
        
        var strX = new Sys.StringBuilder();
        if (sLen > 0) {
            strX.append("<table border=0 width='98%' style='font-size:" + sfont + "; font-Style:" + sfontstyle + "; font-Weight:" + sfontweight + "; color:" + sColor + "'><tr>");
            //alert(strX)
            var j = 0;
            var s = cols - 1;
            //added by liuxr at 2011-6-22 18:36 增加td的width比例
            var iwidth = (1 / cols) * 100;
            for (var i = 0; i < sLen - 1; i++) {
                sdwid = NavJs.getNodeValue11(oXml,i,0);
                if (oXml.documentElement.childNodes[i].childNodes.length > 1)
                    sdwname = NavJs.getNodeValue11(oXml,i,1);
                else
                    sdwname = sdwid;
                    
                j = j + 1;
                var width = "width:"+iwidth + "%;";
                if (j == s)
                    width = "";
                                        
                strX.append("<td style='"+ width +"'><input type='radio' name='radio" + obj.id + "' value='" + sdwid + "' text='" + sdwname + "' onclick='setTextWrite(this,"+obj.id+");'>" + sdwname + "</td>");

                if (j > s) {
                    strX.append("</tr><tr>");
                    j = 0;
                }
            }
            
            //added by liuxr at 2011-6-22 radiolist增加其他选项 
            if (obj.getAttribute("other") == "是")
            {
                var colspan = cols - j;
				strX.append("<td style='white-space:nowrap;' colspan = '"+ colspan +"'><input type='radio' name='radio"+obj.id+"' value='other' text='other' onclick='setTextWrite(this,"+obj.id+");'>其他&nbsp;<input type='text'id='"+obj.id+"_txt' style='BORDER-LEFT: 0px; BORDER-TOP: 0px; BORDER-RIGHT: 0px; WIDTH:85%;'readOnly ></td>");
            }
            strX.append("</tr></table>");
        }

        obj.innerHTML = strX.toString();
    }
}

/**
 * added by liuxr at 2011-6-23 9:57 
 * @func radiolist中选中“其他”选项时使text框可以编辑
**/
function setTextWrite(obj,Divradio)
{
	if (obj.checked == true && obj.value =="other")
	{
		$id(Divradio.id+"_txt").readOnly = false;
	}
	else if ($id(Divradio.id+"_txt")!=null)
	{
	
		$id(Divradio.id+"_txt").value = "";
		$id(Divradio.id+"_txt").readOnly = true;
	}
}

/**************************/
/*@date:2004-12-08
@主要功能:在数据库中查出的每一条记录作为一个CheckBox出现!
@编写程序:liuhao
* @修改日期：2010-4-27 13:43
* @修改人：liuxr
* @修改原因： 给复选框列表增加常数选项
*/
function DivCheckBoxInitLoad(obj, sql, callback, context) {

    //if(isSpace(obj.sqltrans)) return ;
    //modify by liuxr at 2009-11-19 17:19 去掉调试语句

    //liuxr 2010-4-27 常数赋值
    if (obj.getAttribute("check") == "1") {
        var stxt = obj.getAttribute("tempvalue").split("\r\n");
        var sval = obj.getAttribute("temptext").split("\r\n");

        var sHtml = ""
        if (IsSpace(obj.getAttribute("temptext")) == false) {
            var strReturn = "<root>";
            for (var i = 0; i < stxt.length; i++) {
                try {
                    s1 = stxt[i];
                    s2 = sval[i];
                    if (typeof s1 == "undefined") {
                        s1 = "";
                    }
                    if (typeof s2 == "undefined") {
                        s2 = "";
                    }
                } catch (e) {
                    s1 = "";
                    s2 = "";
                }

                strReturn += "<tr><td>" + s1 + "</td><td>" + s2 + "</td></tr>";
            }

            strReturn += "<tr><td>" + stxt.length + "</td><td>" + stxt.length + "</td></tr></root>";
            afterHttpReturn(obj, strReturn);
        }
    }
    else        //SQL语句赋值
    {
        if (IsSpace(sql)) {
            var strsql = UnSqlPropTrans(obj.getAttribute("sqltrans"));
        } else {
            var strsql = sql;
        }
        strsql = RepOpenSql(strsql);
        if (IsSpace(strsql)) return;
        var oSql = new Object();
        oSql.sql = strsql;
        oSql.datasourceName = obj.getAttribute("datasourceName");
        if (typeof (callback) != "function") {
            var strReturn = SelectSql(oSql, 1, -1);
            afterHttpReturn(obj, strReturn);
        } else {
            SelectSql(oSql, 1, -1, function(result) {
                var strReturn = result.value;
                var obj = result.context[0];
                afterHttpReturn(obj, strReturn);
                var newResult = new Object();
                newResult.value = result.value;
                newResult.context = result.context[1];
                callback(newResult);

            }, [obj, context]);

        }

    }
    function afterHttpReturn(obj, strReturn) {

        var sfontsize = obj.style.fontSize;
        var sfontstyle = obj.style.fontStyle;
        var sfontweight = obj.style.fontWeight;
        var sColor = obj.style.color;
        var oXml = SetDom(strReturn);
        if (oXml.documentElement == null) {
            alert(strReturn);
            return;
        }
        var sLen = oXml.documentElement.childNodes.length; //子节点的个数
        var cols = ToInt(obj.getAttribute("rows")); //
        if (cols == 0) cols = 1;
        
        var strX = new Sys.StringBuilder();
        if (sLen > 0) {
            strX.append("<table border=0 width='98%' style='font-size:" + sfontsize + "; font-style:" + sfontstyle + " ; font-weight:" + sfontweight + "; color:" + sColor + "'><tr>");
            //alert(strX)
            var j = 0;
            //alert(strX)
            var s = cols - 1;
            //added by liuxr at 2011-6-22 18:36 增加td的width比例
            var iwidth = (1 / cols) * 100;
            for (var i = 0; i < sLen - 1; i++) {
                sdwid = NavJs.getNodeValue11(oXml,i,0);
                if (oXml.documentElement.childNodes[i].childNodes.length > 1)
                    sdwname = NavJs.getNodeValue11(oXml,i,1);
                else
                    sdwname = sdwid;
                j = j + 1;
                var width = "width:"+iwidth + "%;";
                if (j == s)
                    width = "";
                    
                strX.append("<td style='"+ width +"'><input type='checkbox' value='" + sdwid + "' text='" + sdwname + "'>" + sdwname + "</td>");
                if (j > s) {
                    strX.append("</tr><tr>");
                    j = 0;
                }


            }
            //added by liuxr at 2011-6-22 checkboxlist增加其他选项 
            if (obj.getAttribute("other") == "是")
            {
                var colspan = cols - j;
				strX.append("<td style='white-space:nowrap;' colspan='"+ colspan +"'>其他：<input type='text'id='"+obj.id+"_txt' style='BORDER-LEFT: 0px; BORDER-TOP: 0px; BORDER-RIGHT: 0px; WIDTH:85%;' ></td>");
            }
            strX.append("</tr></table>");
        }

        obj.innerHTML = strX.toString();
    }
    // alert(MaxCheckBox.innerHTML)
}

/**
* 取 DivDivRadio控件的值
*@param obj DivDivRadio控件对象
*@return DivDivRadio控件选中的值,
*@param isText !="是" 表示取value值，否则取显示值
**/
function GetDivRadioValue(obj,isText) {
	 var t=obj.children[0];
	 var strReturn = "";
     for (var i=0;i<t.rows.length;i++){
         for (var j=0;j<t.rows[i].cells.length;j++){
              if (t.rows[i].cells[j].childNodes[0].checked){
              	if(typeof isText=="undefined" || isText=='')
					strReturn = t.rows[i].cells[j].childNodes[0].value ;
				else
					strReturn = t.rows[i].cells[j].childNodes[0].getAttribute("text") ;
              }
		 }
     }
     
     //added by liuxr at 2011-6-23 10:22 获取DivRadiolist选中的值和其他选项值,用“|&|”分割，||前面是选中的值，后面是在text中输入的值。
     if (strReturn == "other")
		strReturn += "|&|"+ $id(obj.id+"_txt").value;
	
	return strReturn;
}

/**
* 取 DivCheckBox控件的值
*@param obj DivCheckBox控件对象
*@return DivCheckBox控件选中的值,多个值的话中间用逗号分隔
*@param isText !="是" 表示取value值，否则取显示值
**/
function GetDivCheckBoxValue(obj,isText) {
	var strX="";
	var t=obj.children[0] ;     
	for (var i=0;i<t.rows.length;i++){         
		for (var j=0;j<t.rows[i].cells.length;j++){             
			if (t.rows[i].cells[j].childNodes[0].checked){     
					if(typeof isText=="undefined" || isText=='')
						strX= strX + t.rows[i].cells[j].childNodes[0].value +"," ;
					else        
						strX= strX + t.rows[i].cells[j].childNodes[0].getAttribute("text") +"," ;
			}		 
		}     
	}     
	var ll=strX.length ;
	strX=strX.substring(0,ll-1);
	
	//added by liuxr at 2011-6-23 10:22 获取Divcheckboxlist选中的值和其他选项值,用“|&|”分割，||前面是选中的值，后面是在text中输入的值。
	if (obj.getAttribute("other") == "是")
	{
		var txtvalue = new Eapi.Str().trim($id(obj.id+"_txt").value);
		if(txtvalue.length >0)
		{
			strX += "|&|" + txtvalue;
		}
	}
	//alert(strX);
	return strX;

}

/*
对divradio控件赋值
obj为divradio对象名称,vValue为要给的值.
*@param isText =="" 表示取value值，否则取显示值
*/
function SetDivRadioValue(obj,vValue,isText) {
	var strX="";
	var t=obj.children[0] ;     
	
	//added by liuxr at 2011-6-23 10:50 给DivRadiolist的“其他”选项赋值.
	if (vValue != "")
	{
		var arrValue = vValue.split("|&|");
		if (arrValue.length >1)
		{
			vValue = arrValue[0];
			if (obj.getAttribute("other") == "是")
				$id(obj.id+"_txt").value = arrValue[1];
		}
	}
	    
	for (var i=0;i<t.rows.length;i++){         
		for (var j=0;j<t.rows[i].cells.length;j++){             
			var s = t.rows[i].cells[j].childNodes[0].getAttribute("text") ;
			if(typeof isText == "undefined" || isText=="") s = t.rows[i].cells[j].childNodes[0].value ;
			if(s==vValue){
			    t.rows[i].cells[j].childNodes[0].checked = true;
			    return;	
			}
		}     
	}
}
/*
对checkboxlist控件赋值
obj为checkboxlist对象,strX为要给的值.
*@param isText !="是" 表示取value值，否则取显示值
*@param isEmpty = true,表示需要将其它的勾去掉.
*/
function SetDivCheckBoxValue(obj,strX,isText,isEmpty) {
    if (typeof strX == "undefined" || strX == "") return;
    
	//added by liuxr at 2011-6-23 10:50 给Divcheckboxlist的“其他”选项赋值
	var arrValue = strX.split("|&|");
	if (arrValue.length >1)
	{
		strX = arrValue[0];
		if (obj.other == "是")
			$id(obj.id+"_txt").value = arrValue[1];
	}
	
	var arr = strX.split(",");
	var t=obj.children[0] ;     
	for (var i=0;i<t.rows.length;i++){         
		for (var j=0;j<t.rows[i].cells.length;j++){
			//added by liuxr at 2011-6-24 最后一行的最后列是其他,不用付值
			if (obj.getAttribute("other") == "是" && i == (t.rows.length-1))
				break;
		    var bFind = false;
			for (var k=0; k<arr.length; k++){
				var s = t.rows[i].cells[j].childNodes[0].getAttribute("text") ;
				if(typeof isText == "undefined" || isText=="") s = t.rows[i].cells[j].childNodes[0].value ;
				if (s == arr[k]) {
				    t.rows[i].cells[j].childNodes[0].checked = true;
				    bFind = true;
				    break;
				    //if (!isEmpty) return;
				}
            }
			if (isEmpty && bFind ==false) {
			    t.rows[i].cells[j].childNodes[0].checked = false;
			}
		}     
	}
}
/**
* 用sql语句的结果初始化radio控件
*@param obj radio对象
*@param cols 布局的列数,为-1表示一行布局
*@param strsql sql语句
*@date 2007-09-13
**/
function SqlToRadio(obj, cols, strsql) {
    var strReturn = SelectSql(strsql, 1, -1);
    var oXml = SetDom(strReturn);
    if (oXml.documentElement == null) {
        alert(strReturn);
        return;
    }
    var sLen = oXml.documentElement.childNodes.length; //子节点的个数
    if (sLen < 0) return;
    var RGid = obj.id;
    var strX = new Sys.StringBuilder();
    strX.append("<table border=0 width='100%' ><tr>");
    var j = 0;
    for (var i = 0; i < sLen - 1; i++) {
        sdwid = NavJs.getNodeValue11(oXml, i, 0);
        sdwname = NavJs.getNodeValue11(oXml, i, 1);
        strX.append("<td><input type=radio name='RG" + RGid + "' value='" + sdwid + "' text='" + sdwname + "' onclick='" + RGid + ".value=RG" + RGid + "[" + i + "].value;'>" + "<span onclick=RG" + RGid + "[" + i + "].checked=true;" + obj.id + ".value=RG" + RGid + "[" + i + "].value;RG" + RGid + "[" + i + "].focus();>" + sdwname + "</span></td>");

        j = j + 1;
        if (j >= cols && cols > 0) {
            strX.append("</tr><tr>");
            j = 0;
        }


    }
    strX.append("</tr></table>");
    obj.innerHTML += strX.toString();
}


//=========================================================================================================
//下边是从 fcother.js中移过来的内容。


/**
*显示计算器,只能用于某输入框的事件中
*@date 2003-12-16
**/
function ShowCalc(){
  var s1="";
//dsaf
  try{
  	s1=event.srcElement.value;
  }catch(e){};
  var sRet=window.showModalDialog(fcpubdata.path+"/fceform/common/caculator.htm",s1,"status:no;scroll:no;dialogHeight:310px;dialogWidth:300px;center:yes ;") ;
  try{
	  event.srcElement.value=sRet;
  }catch(e){}
}

/**
*自动发送email
*示例      var sR=SendEmail("82645151@sina.com","tab","中共中央政治局委员","smtp.sina.com.cn","82645151@sina.com","82645151","8264","82645151@sina.com",SKBILLgrid1.tab.outerHTML,"测试报表","82645151@sina.com");

*@param to 对方email地址
*@param title :标题
*@param body 内容
**/
function SendEmail(to,title,body,sip,sfrom,susername,spassword,copyto,sData,sFileName,sBcc) {
//自动发送email
//to:对方email地址,title:标题,body:内容
//sip 邮局的IP地址
//sfrom 发送方的Email地址
//susername 验证用的用户名
//spassword 验证用的密码
//copyto 抄送
//sData 为要发送的HTML文件的内容
//sFileName 为sData 内容的指定的文件名,不要加上.htm 到时会自动加上.
//sBcc 为暗送的EMAIL地址
    if(isSpace(sip)){ sip="smtp.sina.com.cn";}
    if(isSpace(sfrom)){ sfrom="82645151@sina.com";}
    if(isSpace(susername)) {susername="82645151" ;}
    if(isSpace(spassword)) {spassword="8264";}
    //body="<meta http-equiv=Content-Type content=text/html; charset=gb2312>"+body
	title=escape(title);
	body=escape(body);
	sData=escape(sData);
	sFileName=escape(sFileName);
	var sXml="<no>"+to+"</no>"+"<no>"+title+"</no>"+"<no>"+body+"</no>"
	    +"<no>"+sip+"</no>"+"<no>"+sfrom+"</no>"+"<no>"+susername+"</no>"+"<no>"+spassword+"</no>"
	    +"<no>"+copyto+"</no>"+"<no>"+sData+"</no>"+"<no>"+sFileName+"</no>"+"<no>"+sBcc+"</no>";
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?autosendmail",sXml);
	return retX;
}
/**
*资料选择返回SQL等
*@param sXml:1方案号 2过滤参数
**/
function zl_select(sXml) {
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?zl_select",sXml);
	
	return retX;
}

/**
新的选择资料函数
*@param fabh 资料检索方案编号,不带zl_select_,如含有<号,则表示为直接的XML串.否则要加上zl_select_
*@param likevalue 模糊查找串
*@param ogrid	  当在表格上调用资料选择时要传的表格对象
*@date 2004-12-02
**/
function SelectZl(fabh,likevalue,ogrid){
	if(fabh.indexOf("<") < 0){
		fabh="zl_select_"+fabh ;
	}
	if(typeof likevalue == "undefined") likevalue="";
	return zlSelect(fabh,likevalue,1,"",ogrid);
	
	
}
/**
*通过直接设置SQL语句来选择资料,即不用FC_ZLSEL表
*@param sql sql语句
*@param shidefield 隐藏字段列表,用,分隔
*@param slikevalue 模糊查找串
*@param ogrid	  当在表格上调用资料选择时要传的表格对象
*@date 2004-12-13
**/
function SelectZlSql(sql,sMultiSel,sHideField,sLikeValue,oGrid) {
	if(typeof sMultiSel == "undefined") sMultiSel="否";
	if(typeof sHideField == "undefined") sHideField="";
	if(typeof sLikeValue == "undefined") sLikeValue="";
	var s="<root><dialog_cap></dialog_cap><dialog_hei>400</dialog_hei><dialog_wid>400</dialog_wid><displyflds></displyflds>"
		+"<filterflds></filterflds><hzcode></hzcode><multisel>"+sMultiSel+"</multisel><editflds></editflds><undispflds>"+sHideField+"</undispflds>"
		+"<sql>"+sql+"</sql></root>";
	return zlSelect(s,sLikeValue,1,"",oGrid);
}
/**
//资料选择
//zlfabs为方案号,包括zl_select_
//zlfield为传来的参数
//ipos=1表示从单据上调用即同一目录调用,=2表示从主菜单上调用即加上路径fceform/common/
//zlPara表示参数的XML串,其结构为:name:value;name:value

//ogrid为从表格调用时的表格对象
当zlfabs的前几个字母不为zl_select_时，则为以下结构:
<root><dialog_cap></dialog_cap><dialog_hei>400</dialog_hei><dialog_wid>400</dialog_wid><displyflds></displyflds>
<filterflds></filterflds><hzcode></hzcode><multisel>否</multisel><editflds></editflds><undispflds>dwbh</undispflds>
<sql>select dwbh,danwbh,dwmch from mchk where beactive='是'   and ( danwbh like ''+'%' or dwmch like ''+'%' )</sql></root>
用于不通过直接调用。
**/
function zlSelect(zlfabs,zlfield,ipos,zlPara,ogrid){
//alert(fcpubdata.servletPath + "---" + fcpubdata.path );
	var sRet,sXml,ooField,j;
	//new Eapi.Str().showWait('正在装入....');
    if(zlfabs.substring(0,10)=="zl_select_"){
		   if(typeof zlPara == "undefined") zlPara=""; // zlSelectParaData()
		   sXml="<no>"+zlfabs+"</no>"+"<no>"+new Eapi.Str().trim(zlfield)+"</no>"+"<no>"+zlPara+"</no>";
		   sRet=zl_select(sXml);
		  // alert(sRet)
		   if(sRet=="<root></root>") return;
	}else{
		sRet=zlfabs ;
	}
   
   var oXml=SetDom(sRet);
   var screenHeight=parseInt(oXml.documentElement.childNodes(1).text);
   var screenWidth=parseInt(oXml.documentElement.childNodes(2).text);
   if(isSpace(screenHeight) || isNaN(screenHeight)){   //设置默认值。
      screenHeight=600;
   }
   if(isSpace(screenWidth) || isNaN(screenWidth)){
      screenWidth=500;
   }
   var iLeft=(screen.availWidth-screenWidth)/2;
   var iTop=(screen.availHeight-screenHeight)/2   ;
   //var dialogStyle="dialogHeight:"+screenHeight+"px;dialogWidth:"+screenWidth+"px;dialogTop:"+iTop+"px;dialogLeft:"+iLeft+"px;status:no;center:yes;scroll:auto;resizable:yes";
   var dialogStyle="dialogHeight:314px;dialogWidth:480px;status:no;scroll:no";
   var arr=new Array();
   arr[0]=window;
   arr[1]=oXml.documentElement.childNodes(9).text;  //SQL语句
   arr[1]=RepOpenSql(arr[1],zlfield);
   //alert(arr[1])
   arr[2]=ogrid;
   arr[3]=oXml.documentElement.childNodes(8).text;  //带,号分隔的隐藏字段
   arr[4]=oXml.documentElement.childNodes(6).text;  //能否多选
   if(IsSpace(arr[4])) arr[4]="否";
   arr[5]=getuser() ;   //当前操作员内码，传它到资料选择页面以便在哪能取到。
   //zhangsp
   arr[6]=zlfabs;
   //---
   var sPath="";
   if(ipos==1 || typeof ipos =="undefined") { sPath=fcpubdata.path+"/fceform/common/" ;}
   if(ipos==2) {sPath="fceform/common/";}

//如只有一条  
   //alert(arr[1])
   sXml=dataset_select(arr[1],1,2);
   oXml=SetDom(sXml);
   if(oXml.documentElement == null){
		alert(sXml);
		return
   }
   if(oXml.documentElement.childNodes.length==2){
		if(typeof ogrid == "undefined" ) {
			var odsmain=$id(fcpubdata.dsMain);
			if(odsmain != null){
   				ooField=oXml.documentElement.childNodes(oXml.documentElement.childNodes.length-1).childNodes(1);
				for(j=0;j<ooField.childNodes.length;j++){
					//try {
					var tmpFieldName = ooField.childNodes(j).childNodes(0).text; 
					if(odsmain.isFieldName(tmpFieldName))	
						odsmain.Field(tmpFieldName).Value = oXml.documentElement.childNodes(0).childNodes(j).text ;
					//}catch(e){}
				};
				odsmain.fset_cont1();
			}
		}
		//表格
		if(typeof ogrid != "undefined" ) {
			ogrid.hide();
			var oDs=eval(ogrid.dataset);
			ooField=oXml.documentElement.childNodes(oXml.documentElement.childNodes.length-1).childNodes(1);

			//if(typeof ooField != "undefined"){
				for(j=0;j<ooField.childNodes.length;j++){
					//try {
					var tmpFieldName1 = ooField.childNodes(j).childNodes(0).text ;
					if(oDs.isFieldName(tmpFieldName1))	
						oDs.Field(tmpFieldName1).Value = oXml.documentElement.childNodes(0).childNodes(j).text ;
								
					//}catch(e){}
				}
			//}
			oDs.bEdit = true;
			oDs.Update("不检查")  ;
			//计算 实际计算项的公式
			oDs.LineSum(ogrid,oDs.RecNo);
			oDs.fset_cont1();
			oDs.fset_cont();
			//如为最后一行则去掉增加状态
			if(ogrid.curTD.parentNode.rowIndex == ogrid.tab.rows.length-1){
				ogrid.EndRowState="edit";
			}			
		}
		//new Eapi.Str().showWait("end");
		return;
   }else if(oXml.documentElement.childNodes.length==1){
   		//new Eapi.Str().showWait("end");
   		alert("没有要显示的资料数据!");
   		return;
   }


   
   sRet=window.showModalDialog(sPath+"selectall.htm",arr,dialogStyle);
  // sRet.document.title="资料选择方案："+zlfabs;
   if(typeof ogrid != "undefined"){   //
	
   			//刷新表格
			DsToGrid(ogrid,arr[4]);
   }
   //new Eapi.Str().showWait("end");
   return sRet;
}

function ZlSelect(zlfabs, zlfield, ipos, zlPara, ogrid) { return zlSelect(zlfabs, zlfield, ipos, zlPara, ogrid); }

/**
* 通用的资料选择
**/
function CommonSelect(oJson) {
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer && document.compatMode == "BackCompat") {
        alert("只有在标准模式下才能用模态窗口！");
        return;
    }
    var commonParam = {
        callback:null, //回调函数，
        left: 10,
        top: 39, //窗口位置top ，width，height，left
        width: 770,
        height: 400,
        center: 0, //=1; (默认时是 居中,如写了 left或top 则表示不居中)
        title: "资料选择", //窗口标题

        istree: 1, //(树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度)
        isgrid: 0, //1/0(是否有grid,默认是无.), 
        islist: 1, //多选时为checkboxlist,否则是radiolist
        isfind: 1, //(是否有模糊查找项)  
        findvalue: null, //模糊查找值
        cols: 3, //radiolist 的列数
        datasource: null, //数据源名称

        hidefields: null, // 隐藏字段
        ismultisel: 0, //是否多选
        istreenewsql: 0, //是否是树控件的新格式的SQL语句

        idfieldname: null, //前一窗口的id字段名,用于按字段同名传递数据
        textfieldname: null, //前一窗口的text字段名,用于按字段同名传递数据
        treeNodeType: null, //多选时，要返回树控件的节点类型，它的值为：ef_tree_psm 
        
        xml: null,

        pagesize: 50, //grid的页大小
        gridcoltitle: null, //grid控件的各列的标题,是一个数组,写法: ["第一列名称","第二列名称","第三列名称"] ,需要和grid显示的列一一对应上.
        gridcolwidth: null, //grid控件的各列列宽,是一个数组,写法: [80,100,70] ,需要和grid显示的列一一对应上.
        treewidth: 200, //树控件的宽度
        roottext: null, //树控件的根节点文本

        obj: null, //用于修改的前一窗口控件对象,包含grid对象

        clicknodesql: "select semployeeid,semployeename from fcs_employee where sdeptid={单引号}{nodeIdValue}{单引号}", // 标识 {nodeIdValue} 用于取当前点击的树节点
        sql: "select sdeptcode,sdeptname,sdeptid from FCS_DEPT where sdeptname !='' order by sdeptcode "   //查询sql   

    };

    commonParam = oJson;
    //赋默认值
    if (IsSpace(commonParam.width)) commonParam.width = 770;
    if (IsSpace(commonParam.height)) commonParam.height = 400;
    if (IsSpace(commonParam.treewidth)) commonParam.treewidth = 200;
    if (IsSpace(commonParam.cols)) commonParam.cols = 3;
    if (IsSpace(commonParam.center) && IsSpace(commonParam.left) && IsSpace(commonParam.top)) commonParam.center = 1;
    if (IsSpace(commonParam.title)) commonParam.title = "资料选择";
    if (IsSpace(commonParam.pagesize)) commonParam.pagesize = 50;
    
    if (IsSpace(commonParam.obj) == false)  commonParam.dsobj = $obj(commonParam.obj.getAttribute("dataset"));
    
    if (commonParam.isfind == 1 && IsSpace(commonParam.findvalue) == false ){
        if(commonParam.isgrid == 1) {
            //如只有一条  
            var sXml = dataset_select(RepOpenSql(commonParam.sql,commonParam.findvalue), 1, 2);
            oXml = SetDom(sXml);
            if (oXml.documentElement == null) {
                alert(sXml);
                return
            } else if (oXml.documentElement.childNodes.length == 2) {
                if (commonParam.obj.getAttribute("controltype") != "grid") {
                    var odsmain = $obj(commonParam.obj.getAttribute("dataset"));
                    if (odsmain != null) {
                        ooField = oXml.documentElement.childNodes[oXml.documentElement.childNodes.length - 1].childNodes[1];
                        for (var j = 0; j < ooField.childNodes.length; j++) {
                            var tmpFieldName = NavJs.textContent(ooField.childNodes[j].childNodes[0]);
                            if (odsmain.isFieldName(tmpFieldName))
                                odsmain.Field(tmpFieldName).Value = NavJs.getNodeValue11(oXml,0,j);
                        };
                        odsmain.fset_cont1();
                    }
                }
                //表格
                if (commonParam.obj.getAttribute("controltype") == "grid") {
                    var ogrid = $obj(commonParam.obj.id);
                    ogrid.hide();
                    var oDs = $obj(ogrid.dataset);
                    ooField = oXml.documentElement.childNodes[oXml.documentElement.childNodes.length - 1].childNodes[1];

                    for (var j = 0; j < ooField.childNodes.length; j++) {
                        var tmpFieldName1 = NavJs.textContent(ooField.childNodes[j].childNodes[0]);
                        if (oDs.isFieldName(tmpFieldName1))
                            oDs.Field(tmpFieldName1).Value = NavJs.getNodeValue11(oXml,0,j);
                    }
                    oDs.bEdit = true;
                    oDs.Update("不检查");
                    //计算 实际计算项的公式
                    oDs.LineSum(ogrid, oDs.RecNo);
                    oDs.fset_cont1();
                    oDs.fset_cont();
                    //如为最后一行则去掉增加状态
                    if (ogrid.curTD.parentNode.rowIndex == ogrid.tab.rows.length - 1) {
                        ogrid.EndRowState = "edit";
                    }
                }
                return;
            } else if (oXml.documentElement.childNodes.length == 1) {
                alert("没有要显示的资料数据!");
                return;
            }
           
        }
    }

    var dialogStyle = "dialogHeight:" + commonParam.height + "px;dialogWidth:" + commonParam.width + "px;status:no;scroll:auto;resizable:yes;";
    if(commonParam.center == 1)
        dialogStyle += "center:yes;";
    else
        dialogStyle += "dialogTop:" + commonParam.top + "px;dialogLeft:" + commonParam.left + "px;";

    var arr = new Array();
    arr[0] = commonParam;
    arr[1] = null;
    arr[2] = null;
    arr[3] = null;
    
    var oArgu = window.dialogArguments;
    if (typeof (oArgu) == "undefined") {
        var oTopWin = getTopWin();
        arr[4] = oTopWin; 
    } else if (oArgu.length > 4) {
        arr[4] = oArgu[4];
    }

    //var envType = fcpubdata.area.getAttribute("envType");
    if (fcpubdata.isModalUser) { //  || true
        NavJs.openModalDialog("../../fceform/common/commonSelect.htm", arr, commonParam, function(oRet) { var sRet = oRet.value; var commonParam = oRet.context; _modalReturn(sRet,commonParam); }, commonParam);
    } else {
        var sRet = window.showModalDialog("../../fceform/common/commonSelect.htm", arr, dialogStyle);
        _modalReturn(sRet, commonParam);
        return sRet;
    }
    
    function _modalReturn(sRet, commonParam) {
        if (IsSpace(sRet)) return;
        if (IsSpace(commonParam)) return;

        if (commonParam.obj.getAttribute("controltype") == "grid") {
            var sMulti = commonParam.ismultisel == 1 ? "是" : "否";
            DsToGrid($obj(commonParam.obj.id), sMulti);
        }
        if (typeof (sRet) == "object") { //sRet != "ok" && 
            if (typeof (commonParam.callback) == "function") {
                commonParam.callback(sRet);
            }
        }
    }
}