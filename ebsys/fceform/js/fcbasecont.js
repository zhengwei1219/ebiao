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
//��ֵ,r1Ϊradio������,sValueΪҪ����ֵ
**/
function SetRadioValue(r1,sValue){
 	//alert(sValue)

	r1.value=sValue;
	//��һ��Ԫ�ز�Ҫ
	for(var i=1;i<r1.childNodes.length;i++){
	   if(typeof r1.childNodes[i].tagName!="undefined"){
			if(r1.childNodes[i].tagName.toUpperCase()=="INPUT"){
				//alert(r1.childNodes(i).value)
				if(r1.childNodes[i].value==r1.value){
					r1.childNodes[i].checked=true;
                    if(NavJs.getClassName(r1.childNodes[i]) == "ef_out"){ //��ͼ��
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
��checkboxֵ
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
*sql����ѯ�����ݵ�combox��
*@param sSql:sql���
*@return ���صĴ��������ڵ�,<option>...</option>...
**/
function fillcombox(oSql,callback,context) {
	if(typeof oSql == "undefined"  || oSql == "undefined" ) { return "" ;}
	
    var oDsn = new Eapi.Str().getDsnSql(oSql);

    //����Ƿ�XML�ַ�
    if (IsSpace(oDsn.sql)) oDsn.sql = "";
    var sXml = "<sql>" + RepXml(oDsn.sql) + "</sql>";

    //֧�ֵ����ⲿdll, 2013-07-17
    if (IsSpace(oSql) == false && IsSpace(oSql.xml) == false) {
    //��ʽ��<dllFileName></dllFileName><nameSpaceClass></nameSpaceClass><methodName></methodName>
        sXml += "<classXml>" + oSql.xml + "</classXml>";
    }
	
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=fillcombox"+oDsn.dsn,sXml,callback,context);
	if(IsSpace(retX)==false){
	    if(retX.substring(0,8).toLowerCase() != "<option "){
	        alert(retX); //��ʾ��̨�Ĵ�����Ϣ
	    }
	}
	return retX;
	//���صĴ��������ڵ�
	//<option>...</option>...
}
/**
*��select�ؼ�����option��
*@param obj Ҫ�ӵ�select ����
*@param sHtml Ҫ�ӵ�option��
*@return �µ�outerHTML��,������obj.outerHTML����
*@date 2005-01-16
**/
function SelectAddOption(obj,sHtml) {
	var ss=obj.outerHTML;
	return ss.substring(0,ss.length-9)+sHtml+"</select>";
}
/**
*��һ��sql���Ľ�����combox
*@param obj combox����
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
   //֧�ֵ����ⲿdll, 2013-07-17
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
* ���ö�̬��option�ķ�ʽ���combobox
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
*��combobox�ؼ���textֵ���õ�ѡ��
*@param obj  combobox�ؼ�
*@param sText ����text����ֵ
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
@��Ҫ����:�����ݿ��в����ÿһ����¼��Ϊһ��Radio����!
@��д����:liuhao
* @�޸����ڣ�2010-4-27 15:57
* @�޸��ˣ�liuxr
* @�޸�ԭ�� ����ѡ���б����ӳ���ѡ��

*/
function DivRadioInitLoad(obj, sql, callback, context) {
    //if (isSpace(obj.sqltrans) && IsSpace(sql)) return;

    //if(isSpace(obj.sqltrans)) return ;
    //modify by liuxr at 2009-11-19 17:19 ȥ���������

    //liuxr 2010-4-27 ������ֵ
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
    else        //SQL��丳ֵ
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
        var sLen = oXml.documentElement.childNodes.length; //�ӽڵ�ĸ���

        var cols = ToInt(obj.getAttribute("rows")); //�˴�������getAttribute
        if (cols == 0) cols = 1;
        
        var strX = new Sys.StringBuilder();
        if (sLen > 0) {
            strX.append("<table border=0 width='98%' style='font-size:" + sfont + "; font-Style:" + sfontstyle + "; font-Weight:" + sfontweight + "; color:" + sColor + "'><tr>");
            //alert(strX)
            var j = 0;
            var s = cols - 1;
            //added by liuxr at 2011-6-22 18:36 ����td��width����
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
            
            //added by liuxr at 2011-6-22 radiolist��������ѡ�� 
            if (obj.getAttribute("other") == "��")
            {
                var colspan = cols - j;
				strX.append("<td style='white-space:nowrap;' colspan = '"+ colspan +"'><input type='radio' name='radio"+obj.id+"' value='other' text='other' onclick='setTextWrite(this,"+obj.id+");'>����&nbsp;<input type='text'id='"+obj.id+"_txt' style='BORDER-LEFT: 0px; BORDER-TOP: 0px; BORDER-RIGHT: 0px; WIDTH:85%;'readOnly ></td>");
            }
            strX.append("</tr></table>");
        }

        obj.innerHTML = strX.toString();
    }
}

/**
 * added by liuxr at 2011-6-23 9:57 
 * @func radiolist��ѡ�С�������ѡ��ʱʹtext����Ա༭
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
@��Ҫ����:�����ݿ��в����ÿһ����¼��Ϊһ��CheckBox����!
@��д����:liuhao
* @�޸����ڣ�2010-4-27 13:43
* @�޸��ˣ�liuxr
* @�޸�ԭ�� ����ѡ���б����ӳ���ѡ��
*/
function DivCheckBoxInitLoad(obj, sql, callback, context) {

    //if(isSpace(obj.sqltrans)) return ;
    //modify by liuxr at 2009-11-19 17:19 ȥ���������

    //liuxr 2010-4-27 ������ֵ
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
    else        //SQL��丳ֵ
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
        var sLen = oXml.documentElement.childNodes.length; //�ӽڵ�ĸ���
        var cols = ToInt(obj.getAttribute("rows")); //
        if (cols == 0) cols = 1;
        
        var strX = new Sys.StringBuilder();
        if (sLen > 0) {
            strX.append("<table border=0 width='98%' style='font-size:" + sfontsize + "; font-style:" + sfontstyle + " ; font-weight:" + sfontweight + "; color:" + sColor + "'><tr>");
            //alert(strX)
            var j = 0;
            //alert(strX)
            var s = cols - 1;
            //added by liuxr at 2011-6-22 18:36 ����td��width����
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
            //added by liuxr at 2011-6-22 checkboxlist��������ѡ�� 
            if (obj.getAttribute("other") == "��")
            {
                var colspan = cols - j;
				strX.append("<td style='white-space:nowrap;' colspan='"+ colspan +"'>������<input type='text'id='"+obj.id+"_txt' style='BORDER-LEFT: 0px; BORDER-TOP: 0px; BORDER-RIGHT: 0px; WIDTH:85%;' ></td>");
            }
            strX.append("</tr></table>");
        }

        obj.innerHTML = strX.toString();
    }
    // alert(MaxCheckBox.innerHTML)
}

/**
* ȡ DivDivRadio�ؼ���ֵ
*@param obj DivDivRadio�ؼ�����
*@return DivDivRadio�ؼ�ѡ�е�ֵ,
*@param isText !="��" ��ʾȡvalueֵ������ȡ��ʾֵ
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
     
     //added by liuxr at 2011-6-23 10:22 ��ȡDivRadiolistѡ�е�ֵ������ѡ��ֵ,�á�|&|���ָ||ǰ����ѡ�е�ֵ����������text�������ֵ��
     if (strReturn == "other")
		strReturn += "|&|"+ $id(obj.id+"_txt").value;
	
	return strReturn;
}

/**
* ȡ DivCheckBox�ؼ���ֵ
*@param obj DivCheckBox�ؼ�����
*@return DivCheckBox�ؼ�ѡ�е�ֵ,���ֵ�Ļ��м��ö��ŷָ�
*@param isText !="��" ��ʾȡvalueֵ������ȡ��ʾֵ
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
	
	//added by liuxr at 2011-6-23 10:22 ��ȡDivcheckboxlistѡ�е�ֵ������ѡ��ֵ,�á�|&|���ָ||ǰ����ѡ�е�ֵ����������text�������ֵ��
	if (obj.getAttribute("other") == "��")
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
��divradio�ؼ���ֵ
objΪdivradio��������,vValueΪҪ����ֵ.
*@param isText =="" ��ʾȡvalueֵ������ȡ��ʾֵ
*/
function SetDivRadioValue(obj,vValue,isText) {
	var strX="";
	var t=obj.children[0] ;     
	
	//added by liuxr at 2011-6-23 10:50 ��DivRadiolist�ġ�������ѡ�ֵ.
	if (vValue != "")
	{
		var arrValue = vValue.split("|&|");
		if (arrValue.length >1)
		{
			vValue = arrValue[0];
			if (obj.getAttribute("other") == "��")
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
��checkboxlist�ؼ���ֵ
objΪcheckboxlist����,strXΪҪ����ֵ.
*@param isText !="��" ��ʾȡvalueֵ������ȡ��ʾֵ
*@param isEmpty = true,��ʾ��Ҫ�������Ĺ�ȥ��.
*/
function SetDivCheckBoxValue(obj,strX,isText,isEmpty) {
    if (typeof strX == "undefined" || strX == "") return;
    
	//added by liuxr at 2011-6-23 10:50 ��Divcheckboxlist�ġ�������ѡ�ֵ
	var arrValue = strX.split("|&|");
	if (arrValue.length >1)
	{
		strX = arrValue[0];
		if (obj.other == "��")
			$id(obj.id+"_txt").value = arrValue[1];
	}
	
	var arr = strX.split(",");
	var t=obj.children[0] ;     
	for (var i=0;i<t.rows.length;i++){         
		for (var j=0;j<t.rows[i].cells.length;j++){
			//added by liuxr at 2011-6-24 ���һ�е������������,���ø�ֵ
			if (obj.getAttribute("other") == "��" && i == (t.rows.length-1))
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
* ��sql���Ľ����ʼ��radio�ؼ�
*@param obj radio����
*@param cols ���ֵ�����,Ϊ-1��ʾһ�в���
*@param strsql sql���
*@date 2007-09-13
**/
function SqlToRadio(obj, cols, strsql) {
    var strReturn = SelectSql(strsql, 1, -1);
    var oXml = SetDom(strReturn);
    if (oXml.documentElement == null) {
        alert(strReturn);
        return;
    }
    var sLen = oXml.documentElement.childNodes.length; //�ӽڵ�ĸ���
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
//�±��Ǵ� fcother.js���ƹ��������ݡ�


/**
*��ʾ������,ֻ������ĳ�������¼���
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
*�Զ�����email
*ʾ��      var sR=SendEmail("82645151@sina.com","tab","�й��������ξ�ίԱ","smtp.sina.com.cn","82645151@sina.com","82645151","8264","82645151@sina.com",SKBILLgrid1.tab.outerHTML,"���Ա���","82645151@sina.com");

*@param to �Է�email��ַ
*@param title :����
*@param body ����
**/
function SendEmail(to,title,body,sip,sfrom,susername,spassword,copyto,sData,sFileName,sBcc) {
//�Զ�����email
//to:�Է�email��ַ,title:����,body:����
//sip �ʾֵ�IP��ַ
//sfrom ���ͷ���Email��ַ
//susername ��֤�õ��û���
//spassword ��֤�õ�����
//copyto ����
//sData ΪҪ���͵�HTML�ļ�������
//sFileName ΪsData ���ݵ�ָ�����ļ���,��Ҫ����.htm ��ʱ���Զ�����.
//sBcc Ϊ���͵�EMAIL��ַ
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
*����ѡ�񷵻�SQL��
*@param sXml:1������ 2���˲���
**/
function zl_select(sXml) {
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?zl_select",sXml);
	
	return retX;
}

/**
�µ�ѡ�����Ϻ���
*@param fabh ���ϼ����������,����zl_select_,�纬��<��,���ʾΪֱ�ӵ�XML��.����Ҫ����zl_select_
*@param likevalue ģ�����Ҵ�
*@param ogrid	  ���ڱ���ϵ�������ѡ��ʱҪ���ı�����
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
*ͨ��ֱ������SQL�����ѡ������,������FC_ZLSEL��
*@param sql sql���
*@param shidefield �����ֶ��б�,��,�ָ�
*@param slikevalue ģ�����Ҵ�
*@param ogrid	  ���ڱ���ϵ�������ѡ��ʱҪ���ı�����
*@date 2004-12-13
**/
function SelectZlSql(sql,sMultiSel,sHideField,sLikeValue,oGrid) {
	if(typeof sMultiSel == "undefined") sMultiSel="��";
	if(typeof sHideField == "undefined") sHideField="";
	if(typeof sLikeValue == "undefined") sLikeValue="";
	var s="<root><dialog_cap></dialog_cap><dialog_hei>400</dialog_hei><dialog_wid>400</dialog_wid><displyflds></displyflds>"
		+"<filterflds></filterflds><hzcode></hzcode><multisel>"+sMultiSel+"</multisel><editflds></editflds><undispflds>"+sHideField+"</undispflds>"
		+"<sql>"+sql+"</sql></root>";
	return zlSelect(s,sLikeValue,1,"",oGrid);
}
/**
//����ѡ��
//zlfabsΪ������,����zl_select_
//zlfieldΪ�����Ĳ���
//ipos=1��ʾ�ӵ����ϵ��ü�ͬһĿ¼����,=2��ʾ�����˵��ϵ��ü�����·��fceform/common/
//zlPara��ʾ������XML��,��ṹΪ:name:value;name:value

//ogridΪ�ӱ�����ʱ�ı�����
��zlfabs��ǰ������ĸ��Ϊzl_select_ʱ����Ϊ���½ṹ:
<root><dialog_cap></dialog_cap><dialog_hei>400</dialog_hei><dialog_wid>400</dialog_wid><displyflds></displyflds>
<filterflds></filterflds><hzcode></hzcode><multisel>��</multisel><editflds></editflds><undispflds>dwbh</undispflds>
<sql>select dwbh,danwbh,dwmch from mchk where beactive='��'   and ( danwbh like ''+'%' or dwmch like ''+'%' )</sql></root>
���ڲ�ͨ��ֱ�ӵ��á�
**/
function zlSelect(zlfabs,zlfield,ipos,zlPara,ogrid){
//alert(fcpubdata.servletPath + "---" + fcpubdata.path );
	var sRet,sXml,ooField,j;
	//new Eapi.Str().showWait('����װ��....');
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
   if(isSpace(screenHeight) || isNaN(screenHeight)){   //����Ĭ��ֵ��
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
   arr[1]=oXml.documentElement.childNodes(9).text;  //SQL���
   arr[1]=RepOpenSql(arr[1],zlfield);
   //alert(arr[1])
   arr[2]=ogrid;
   arr[3]=oXml.documentElement.childNodes(8).text;  //��,�ŷָ��������ֶ�
   arr[4]=oXml.documentElement.childNodes(6).text;  //�ܷ��ѡ
   if(IsSpace(arr[4])) arr[4]="��";
   arr[5]=getuser() ;   //��ǰ����Ա���룬����������ѡ��ҳ���Ա�������ȡ����
   //zhangsp
   arr[6]=zlfabs;
   //---
   var sPath="";
   if(ipos==1 || typeof ipos =="undefined") { sPath=fcpubdata.path+"/fceform/common/" ;}
   if(ipos==2) {sPath="fceform/common/";}

//��ֻ��һ��  
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
		//���
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
			oDs.Update("�����")  ;
			//���� ʵ�ʼ�����Ĺ�ʽ
			oDs.LineSum(ogrid,oDs.RecNo);
			oDs.fset_cont1();
			oDs.fset_cont();
			//��Ϊ���һ����ȥ������״̬
			if(ogrid.curTD.parentNode.rowIndex == ogrid.tab.rows.length-1){
				ogrid.EndRowState="edit";
			}			
		}
		//new Eapi.Str().showWait("end");
		return;
   }else if(oXml.documentElement.childNodes.length==1){
   		//new Eapi.Str().showWait("end");
   		alert("û��Ҫ��ʾ����������!");
   		return;
   }


   
   sRet=window.showModalDialog(sPath+"selectall.htm",arr,dialogStyle);
  // sRet.document.title="����ѡ�񷽰���"+zlfabs;
   if(typeof ogrid != "undefined"){   //
	
   			//ˢ�±��
			DsToGrid(ogrid,arr[4]);
   }
   //new Eapi.Str().showWait("end");
   return sRet;
}

function ZlSelect(zlfabs, zlfield, ipos, zlPara, ogrid) { return zlSelect(zlfabs, zlfield, ipos, zlPara, ogrid); }

/**
* ͨ�õ�����ѡ��
**/
function CommonSelect(oJson) {
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer && document.compatMode == "BackCompat") {
        alert("ֻ���ڱ�׼ģʽ�²�����ģ̬���ڣ�");
        return;
    }
    var commonParam = {
        callback:null, //�ص�������
        left: 10,
        top: 39, //����λ��top ��width��height��left
        width: 770,
        height: 400,
        center: 0, //=1; (Ĭ��ʱ�� ����,��д�� left��top ���ʾ������)
        title: "����ѡ��", //���ڱ���

        istree: 1, //(���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��)
        isgrid: 0, //1/0(�Ƿ���grid,Ĭ������.), 
        islist: 1, //��ѡʱΪcheckboxlist,������radiolist
        isfind: 1, //(�Ƿ���ģ��������)  
        findvalue: null, //ģ������ֵ
        cols: 3, //radiolist ������
        datasource: null, //����Դ����

        hidefields: null, // �����ֶ�
        ismultisel: 0, //�Ƿ��ѡ
        istreenewsql: 0, //�Ƿ������ؼ����¸�ʽ��SQL���

        idfieldname: null, //ǰһ���ڵ�id�ֶ���,���ڰ��ֶ�ͬ����������
        textfieldname: null, //ǰһ���ڵ�text�ֶ���,���ڰ��ֶ�ͬ����������
        treeNodeType: null, //��ѡʱ��Ҫ�������ؼ��Ľڵ����ͣ�����ֵΪ��ef_tree_psm 
        
        xml: null,

        pagesize: 50, //grid��ҳ��С
        gridcoltitle: null, //grid�ؼ��ĸ��еı���,��һ������,д��: ["��һ������","�ڶ�������","����������"] ,��Ҫ��grid��ʾ����һһ��Ӧ��.
        gridcolwidth: null, //grid�ؼ��ĸ����п�,��һ������,д��: [80,100,70] ,��Ҫ��grid��ʾ����һһ��Ӧ��.
        treewidth: 200, //���ؼ��Ŀ��
        roottext: null, //���ؼ��ĸ��ڵ��ı�

        obj: null, //�����޸ĵ�ǰһ���ڿؼ�����,����grid����

        clicknodesql: "select semployeeid,semployeename from fcs_employee where sdeptid={������}{nodeIdValue}{������}", // ��ʶ {nodeIdValue} ����ȡ��ǰ��������ڵ�
        sql: "select sdeptcode,sdeptname,sdeptid from FCS_DEPT where sdeptname !='' order by sdeptcode "   //��ѯsql   

    };

    commonParam = oJson;
    //��Ĭ��ֵ
    if (IsSpace(commonParam.width)) commonParam.width = 770;
    if (IsSpace(commonParam.height)) commonParam.height = 400;
    if (IsSpace(commonParam.treewidth)) commonParam.treewidth = 200;
    if (IsSpace(commonParam.cols)) commonParam.cols = 3;
    if (IsSpace(commonParam.center) && IsSpace(commonParam.left) && IsSpace(commonParam.top)) commonParam.center = 1;
    if (IsSpace(commonParam.title)) commonParam.title = "����ѡ��";
    if (IsSpace(commonParam.pagesize)) commonParam.pagesize = 50;
    
    if (IsSpace(commonParam.obj) == false)  commonParam.dsobj = $obj(commonParam.obj.getAttribute("dataset"));
    
    if (commonParam.isfind == 1 && IsSpace(commonParam.findvalue) == false ){
        if(commonParam.isgrid == 1) {
            //��ֻ��һ��  
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
                //���
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
                    oDs.Update("�����");
                    //���� ʵ�ʼ�����Ĺ�ʽ
                    oDs.LineSum(ogrid, oDs.RecNo);
                    oDs.fset_cont1();
                    oDs.fset_cont();
                    //��Ϊ���һ����ȥ������״̬
                    if (ogrid.curTD.parentNode.rowIndex == ogrid.tab.rows.length - 1) {
                        ogrid.EndRowState = "edit";
                    }
                }
                return;
            } else if (oXml.documentElement.childNodes.length == 1) {
                alert("û��Ҫ��ʾ����������!");
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
            var sMulti = commonParam.ismultisel == 1 ? "��" : "��";
            DsToGrid($obj(commonParam.obj.id), sMulti);
        }
        if (typeof (sRet) == "object") { //sRet != "ok" && 
            if (typeof (commonParam.callback) == "function") {
                commonParam.callback(sRet);
            }
        }
    }
}