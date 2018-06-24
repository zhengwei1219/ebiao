///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />
///<reference path="/ebsys/fceform/js/fcrundj.js" />
///<reference path="/ebsys/fceform/js/fcdataset.js" />

 Valid = {
	Require : /.+/,
	Email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	Phone : /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
	Mobile : /^((\(\d{2,3}\))|(\d{3}\-))?13\d{9}$/,
	Url : /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
	IdCard : "this.IsIdCard(value)",
	Currency : /^\d+(\.\d+)?$/,
	Number : /^\d+$/,
	Zip : /^[1-9]\d{5}$/,
	QQ : /^[1-9]\d{4,8}$/,
	Integer : /^[-\+]?\d+$/,
	Double : /^[-\+]?\d+(\.\d+)?$/,
	English : /^[A-Za-z]+$/,
	Chinese :  /^[\u0391-\uFFE5]+$/,
	Username : /^[a-z]\w{3,}$/i,
	UnSafe : /^(([A-Z]*|[a-z]*|\d*|[-_\~!@#\$%\^&\*\.\(\)\[\]\{\}<>\?\\\/\'\"]*)|.{0,5})$|\s/,
	IsSafe : function(str){return !this.UnSafe.test(str);},
	SafeString : "this.IsSafe(value)",
	Filter : "this.DoFilter(value, getAttribute('accept'))",
	Limit : "this.limit(value.length,getAttribute('min'),  getAttribute('max'))",
	LimitB : "this.limit(this.LenB(value), getAttribute('min'), getAttribute('max'))",
	Date : "this.IsDate(value, getAttribute('min'), getAttribute('format'))",
	Repeat : "value == document.getElementsByName(getAttribute('to'))[0].value",
	Range : "getAttribute('min') < (value|0) && (value|0) < getAttribute('max')",
	Compare : "this.compare(value,getAttribute('operator'),getAttribute('to'))",
	Custom : "this.Exec(value, getAttribute('regexp'))",
	Group : "this.MustChecked(getAttribute('name'), getAttribute('min'), getAttribute('max'))",
	ErrorItem : [document.forms[0]],
	ErrorMessage : ["以下原因导致提交失败：\t\t\t\t"],
	getAttribute : function(name){ return eval("this."+name) ; },
	_choose : function(obj,typeNo,_dataType,i) {
					with(obj){
						switch(_dataType){
							case "IdCard" :
							case "Date" :
							case "Repeat" :
							case "Range" :
							case "Compare" :
							case "Custom" :
							case "Group" : 
							case "Limit" :
							case "LimitB" :
							case "SafeString" :
							case "Filter" :
								if(!eval(this[_dataType]))	{
									return _ret(obj,typeNo);
								}
								break;
							default :
								if(!this[_dataType].test(value)){
									return _ret(obj,typeNo);
								}
								break;
						}
					}
					if(typeNo == 1) return true;
					if(typeNo == 2) return "";

					function _ret(obj,typeNo) {
						with(obj){
							if(typeNo == 1) return false;
							if(typeNo == 2) return getAttribute("msg");
							if(typeNo == 3) this.AddError(i, getAttribute("msg"));
						}
					}		
	
	},
	//检查value是否为_dataType类型的值,返回true/false ;
	checkValue : function(_dataType,value){
					this.value = value ;
					return this._choose(this,1,_dataType) ;
	},
	//检查一个编辑框控件,返回错误信息或空
	checkObj: function(obj) {
				var o = obj || NavJs.getEventObj() ;
				var _dataType = o.getAttribute("dataType") ;
				return this._choose(o,2,_dataType) ;
	},
	
	Validate : function(theForm, mode){
	    var obj = theForm || NavJs.getEventObj();
		var count = obj.elements.length;
		this.ErrorMessage.length = 1;
		this.ErrorItem.length = 1;
		this.ErrorItem[0] = obj;
		for(var i=0;i<count;i++){
			with(obj.elements[i]){
				var _dataType = getAttribute("dataType");
				if(typeof(_dataType) == "object" || typeof(this[_dataType]) == "undefined")  continue;
				this.ClearState(obj.elements[i]);
				if(getAttribute("require") == "false" && value == "") continue;
			}
			this._choose(obj.elements[i],3,_dataType,i) ; 
		}
		if(this.ErrorMessage.length > 1){
			mode = mode || 1;
			var errCount = this.ErrorItem.length;
			switch(mode){
			case 2 :
				for(var i=1;i<errCount;i++)
					this.ErrorItem[i].style.color = "red";
			case 1 :
				alert(this.ErrorMessage.join("\n"));
				this.ErrorItem[1].focus();
				break;
			case 3 :
				for(var i=1;i<errCount;i++){
				try{
					var span = document.createElement("SPAN");
					span.id = "__ErrorMessagePanel";
					span.style.color = "red";
					this.ErrorItem[i].parentNode.appendChild(span);
					span.innerHTML = this.ErrorMessage[i].replace(/\d+:/,"*");
					}
					catch(e){alert(e.description);}
				}
				this.ErrorItem[1].focus();
				break;
			default :
				alert(this.ErrorMessage.join("\n"));
				break;
			}
			return false;
		}
		return true;
	},
	limit : function(len,min, max){
		min = min || 0;
		max = max || Number.MAX_VALUE;
		return min <= len && len <= max;
	},
	LenB : function(str){
		return str.replace(/[^\x00-\xff]/g,"**").length;
	},
	ClearState : function(elem){
		with(elem){
			if(style.color == "red")
				style.color = "";
			var lastNode = parentNode.childNodes[parentNode.childNodes.length-1];
			if(lastNode.id == "__ErrorMessagePanel")
				parentNode.removeChild(lastNode);
		}
	},
	AddError : function(index, str){
		this.ErrorItem[this.ErrorItem.length] = this.ErrorItem[0].elements[index];
		this.ErrorMessage[this.ErrorMessage.length] = this.ErrorMessage.length + ":" + str;
	},
	Exec : function(op, reg){
		return new RegExp(reg,"g").test(op);
	},
	compare : function(op1,operator,op2){
		switch (operator) {
			case "NotEqual":
				return (op1 != op2);
			case "GreaterThan":
				return (op1 > op2);
			case "GreaterThanEqual":
				return (op1 >= op2);
			case "LessThan":
				return (op1 < op2);
			case "LessThanEqual":
				return (op1 <= op2);
			default:
				return (op1 == op2);            
		}
	},
	MustChecked : function(name, min, max){
		var groups = document.getElementsByName(name);
		var hasChecked = 0;
		min = min || 1;
		max = max || groups.length;
		for(var i=groups.length-1;i>=0;i--)
			if(groups[i].checked) hasChecked++;
		return min <= hasChecked && hasChecked <= max;
	},
	DoFilter : function(input, filter){
		return new RegExp("^.+\.(?=EXT)(EXT)$".replace(/EXT/g, filter.split(/\s*,\s*/).join("|")), "gi").test(input);
	},
	IsIdCard : function(number){
		var date, Ai;
		var verify = "10x98765432";
		var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
		var area = ['','','','','','','','','','','','bj','bj','bj','bj','bj','','','','','','bj','bj','bj','','','','','','','','bj','bj','bj','bj','bj','bj','bj','','','','bj','bj','bj','bj','bj','bj','','','','bj','bj','bj','bj','bj','','','','','','','bj','bj','bj','bj','bj','','','','','','bj','','','','','','','','','','bj','bj','','','','','','','','','bj'] ;
		var re = number.match(/^(\d{2})\d{4}(((\d{2})(\d{2})(\d{2})(\d{3}))|((\d{4})(\d{2})(\d{2})(\d{3}[x\d])))$/i);
		if(re == null) return false;
		if(re[1] >= area.length || area[re[1]] == "") return false;
		if(re[2].length == 12){
			Ai = number.substr(0, 17);
			date = [re[9], re[10], re[11]].join("-");
		}
		else{
			Ai = number.substr(0, 6) + "19" + number.substr(6);
			date = ["19" + re[4], re[5], re[6]].join("-");
		}
		if(!this.IsDate(date, "ymd")) return false;
		var sum = 0;
		for(var i = 0;i<=16;i++){
			sum += Ai.charAt(i) * Wi[i];
		}
		Ai +=  verify.charAt(sum%11);
		return (number.length ==15 || number.length == 18 && number == Ai);
	},
	IsDate : function(op, formatString){
		formatString = formatString || "ymd";
		var m, year, month, day;
		switch(formatString){
			case "ymd" :
				m = op.match(new RegExp("^((\\d{4})|(\\d{2}))([-./])(\\d{1,2})\\4(\\d{1,2})$"));
				if(m == null ) return false;
				day = m[6];
				month = m[5]*1;
				year =  (m[2].length == 4) ? m[2] : GetFullYear(parseInt(m[3], 10));
				break;
			case "dmy" :
				m = op.match(new RegExp("^(\\d{1,2})([-./])(\\d{1,2})\\2((\\d{4})|(\\d{2}))$"));
				if(m == null ) return false;
				day = m[1];
				month = m[3]*1;
				year = (m[5].length == 4) ? m[5] : GetFullYear(parseInt(m[6], 10));
				break;
			default :
				break;
		}
		if(!parseInt(month)) return false;
		month = month==0 ?12:month;
		var date = new Date(year, month-1, day);
        return (typeof(date) == "object" && year == date.getFullYear() && month == (date.getMonth()+1) && day == date.getDate());
		function GetFullYear(y){return ((y<30 ? "20" : "19") + y)|0;}
	}
 }
 /**
 * 是否是double数
 *@date 2007-01-29
 **/
function IsNum(sNum){
	sNum=new Eapi.Str().trim(sNum+"");
    var reg = /^(-|\+)?\d+(\.\d+)?$/; 
    return reg.test(sNum);
	
//	var s1=parseFloat(sNum);
//	if(isNaN(s1))return false;
//	if(s1+"" != sNum) return false;
//	return true;
	
}
 /**
 * 是否是整数
 *@date 2007-01-29
 **/
function IsInt(sNum){
	sNum=new Eapi.Str().trim(sNum+"");
    var reg = /^(-|\+)?\d+$/; 
    return reg.test(sNum);

//	var s1=parseInt(sNum,10);
//	if(isNaN(s1))return false;
//	if(s1+"" != sNum) return false;
	//added by liuxr at 2008-2-25 
//	if (s1>2147483647) return false
//	return true;
}
/**
 * @func:是否是合法的身份证号
 * @date:2008-2-15
 * @param:sId身份号码
**/
function IsIdcard(sId)
{ 
	//alert(sId);
    var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外" };
    
    if(!/^\d{15}(\d{2}(\d|x))?$/i.test(sId))
    {
        return false; 
    }
	if(aCity[parseInt(sId.substr(0,2))]==null)
	{
		return false;
	}
	if(sId.length==15)
	{
		sBirthday="19"+sId.substr(6,2)+"-"+Number(sId.substr(8,2))+"-"+Number(sId.substr(10,2)); 	
	}
	else
	{
		sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2)); 
	}
	var d=new Date(sBirthday.replace(/-/g,"/")) 
	if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))
	{
		return false;
	}
    if(sId.length==18)
    {
        var iSum=0 
		sId=sId.replace(/x$/i,"a"); 
		for(var i = 17;i>=0;i --)
		{
			iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) 
		}
		if(iSum%11!=1)
		{
			return false; 
		}
	}
	return true;
}

/**
 * @func:是否为合法的邮政编码；
 * @date:2008-2-15
 * @param:str邮政编码
**/
function IsPostcode(str)
{
	var reg = /^\d{6}$/;
	return reg.test(str);
}

/**
 * @func:是否为合法的电话号码；
 * @date:2008-2-25
 * @param:str电话号码；
**/
function IsPhone(str)
{
	//var reg=  /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;   
	var reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?(,(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?)*$/;

	return reg.test(str);
}

/**
 * @func:是否为合法的手机号码；
 * @date:2008-2-25
 * @param:str手机号码；
**/
function IsMobile(str)
{     
     //var reg =/(^[1][3][0-9]{9}$)|(^0[1][3][0-9]{9}$)/;  
     var reg = /(^0?[1][3|5][0-9]{9}(,0?[1][3|5][0-9]{9})*$)/;
     return reg.test(str);  
}  
/**
* 判断数据集的某个字段值是否重复.
*@date 2008-03-27
**/
function IsDataSetFieldRepeat(ods,fieldName,curValue) {
	var l = ods.oDom.documentElement.childNodes.length-1 ;	
	var col = ods.FieldNameToNo(fieldName);
	var bRepeat = true;
	for (var i = 0; i < l; i++) {
		if(curValue == NavJs.getNodeValue11(ods.oDom,i,col) && i != ods.RecNo) {
			bRepeat = false ;
			break; 
		}
	}
	return bRepeat;
}

/**
 * @func: 数据校验
 * @date; 2008-2-25
 * @param:checkType为校验类型，整数、小数、日期、QQ、Email、身份证号等；
 * @param:alertMsg为可选参数，验证不通过时的提示信息。
 * objEvent = txtUserName.value 或是 事件对象
**/
function $valid(checkType,alertMsg,objEvent)
{
    var oEvent = objEvent;
    if (typeof (objEvent) == "undefined") {
        if (fcpubdata.validEventObj != null) {
            oEvent = fcpubdata.validEventObj;
        } else {
            oEvent = NavJs.getEvent();
        }
    }
    if (typeof alertMsg == "undefined") alertMsg = "";
    var strChinese = alertMsg;
    var strvalue; //要验证的数据
    
    //    if (IsSpace(oEvent.type) || IsSpace(NavJs.getEventObj())) {
    if (typeof(objEvent) == "string") {
        strvalue = objEvent;
    } else {
        var eType = oEvent.type;
        if (eType == "Valid") {
            strvalue = oEvent.FieldValue;
        } else {
            var checkObj = oEvent.srcElement || oEvent.target; //oEvent.srcElement;
            strvalue = checkObj.value;
        }
	    //控件绑定的中文字段名
	    if (IsSpace(strChinese)){
		    if(eType == "Valid"){
		        strChinese = oEvent.DisplayLabel;
		    }else{
		        strChinese = checkObj.getAttribute("china");
		    }
	    }
    }
    if (typeof strChinese == "undefined") strChinese = "";	
	if (typeof strvalue == "undefined") strvalue = "";	
	
	var reg; 
	var ret = true;
	var strMsg = "";
	
	//2011-05-11 用自定义函数来验证时,写法: $valid(uf_test); 其中uf_test为自定义的ＪＳ函数，它返回为空表示验证通过，否则为错误信息．
	if (typeof (checkType) == "function") {
	    var sR = checkType();
	    if (IsSpace(sR) == false) {
	        ret = false;
	        alertMsg = sR;
	    }
	}
	else if (strvalue.length == 0 && checkType == "不能为空") {
	    strMsg = "不能为空。";
	    ret = false;
	}
	else if (strvalue.length > 0) {

	    switch (checkType) {
	        case "数字范围":
	            strMsg = "不能含有逗号数字减号和空格以外的其它字符。";
	            reg = /^[\d, \-]+$/;
	            ret = reg.test(strvalue);
	            break;

	        case "整数":
	            ret = IsInt(strvalue);
	            break;
	        case "实数":
	        case "小数":
	            //ret = IsNum(strvalue);
	            reg = /^(-|\+)?\d+(\.\d+)?$/;
	            ret = reg.test(strvalue);

	            break;
	        case "日期":
	            ret = Valid.checkValue("Date", strvalue);
	            break;
	        case "日期时间":
	            strvalue = Trim(strvalue);
	            if (strvalue.length == 19) {
	                reg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
	            } else {
	                reg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/;
	            }
	            ret = reg.test(strvalue);
	            break;

	        case "QQ":
	            ret = Valid.checkValue("QQ", strvalue);
	            break;
	        case "身份证号":
	            ret = IsIdcard(strvalue);
	            break;
	        case "Email":
	            ret = Valid.checkValue("Email", strvalue);
	            break;
	        case "电话号码":
	            ret = IsPhone(strvalue);
	            break;
	        case "手机":
	            ret = IsMobile(strvalue);
	            break;
	        case "邮政编号":
	            ret = IsPostcode(strvalue);
	            break;
	        case "正数":
	            reg = /^\+?\d+(\.\d+)?$/;
	            ret = reg.test(strvalue);
	            break;
	        case "正整数":
	            reg = /^\+?[0-9]*[1-9][0-9]*$/;
	            ret = reg.test(strvalue);
	            break;
	        case "负数":
	            reg = /^-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
	            ret = reg.test(strvalue);
	            break;
	        case "负整数":
	            reg = /^-[0-9]*[1-9][0-9]*$/;
	            ret = reg.test(strvalue);
	            break;
	        case "零或正数":
	            reg = /^\+?\d+(\.\d+)?$/;
	            ret = reg.test(strvalue);
	            break;
	        case "零或负数":
	            reg = /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/;
	            ret = reg.test(strvalue);
	            break;
	        case "零或正整数":
	            reg = /^\+?[0-9]*[0-9][0-9]*$/;
	            ret = reg.test(strvalue);
	            break;
	        case "零或负整数":
	            reg = /^([0?]$)|(-[0-9]*[0-9][0-9]*$)/;
	            ret = reg.test(strvalue);

	            break;
	        case "字母、数字或_":
	            strMsg = "只能是字母、数字或_。";
	            reg = /[^_|a-z|A-Z|0-9]/;
	            ret = !reg.test(strvalue);
	            break;
	        case "汉字、字母、数字或_":
	            strMsg = "只能是汉字、字母、数字或_。";
	            reg = /[^_|a-z|A-Z|0-9|\u4e00-\u9fa5]/;
	            ret = !reg.test(strvalue);
	            break;
	        case "不含汉字":
	            strMsg = "不能含有汉字。";
	            reg = /[\u4e00-\u9fa5]/;
	            ret = !reg.test(strvalue);
	            break;
	        case "不含双引号":
	            strMsg = "不能含有双引号。";
	            reg = /[\"]/;
	            ret = !reg.test(strvalue);
	            break;
	        case "不含单引号":
	            strMsg = "不能含有单引号。";
	            reg = /[\']/;
	            ret = !reg.test(strvalue);
	            break;
	        case "不能为空":
	            strMsg = "不能为空。";
	            reg = /^\s*$/;
	            ret = !reg.test(strvalue);
	            break;
	        case "字段值不重复":
	            if (eType == "Valid") { //只有在数据集的数据验证事件(Valid)中才有效
	                var oDs = oEvent.DataSet;
	                if (IsSpace(oDs) == false) {
	                    ret = IsDataSetFieldRepeat(oDs, oEvent.FieldName, oEvent.FieldValue);
	                    strMsg = "字段值不能重复。";
	                }
	            }
	            break;
	        case "值已存在": //检查后台数据库中字段值是否重复
	            var oDs, fieldName;
	            if (eType == "Valid") { //只有在数据集的数据验证事件(Valid)中才有效
	                oDs = oEvent.DataSet;
	                fieldName = oEvent.FieldName;
	            } else {  //在编辑框的onchange事件中使用
	                oDs = $id(checkObj.getAttribute("dataset"));
	                fieldName = checkObj.getAttribute("field");

	            }
	            if (IsSpace(oDs) == false && IsSpace(oDs.getAttribute("savetable")) == false) {
	                var arr = MultiKeyTmp(oDs);
	                var sIdWhere = " and not(" + MultiKeyWhere(arr, oDs.RecNo, oDs) + ")";

	                //if(IsSpace(fcpubdata.keyValue) == false){
	                //    var sQuot="";
	                //    if(fcpubdata.area.idtype != "2" && fcpubdata.area.idtype != "3") sQuot="'";
	                //    sIdWhere = " and "+fcpubdata.area.keyfield+"!="+sQuot+fcpubdata.keyValue+sQuot;
	                //}
	                var sQuotValue = "'" + strvalue + "'";
	                var fieldType = oDs.Field(fieldName).DataType;
	                if (fieldType == "实数" || fieldType == "整数") {
	                    sQuotValue = strvalue;
	                } else if (fieldType == "日期" && fcpubdata.databaseTypeName == "oracle") {
	                    sQuotValue = "to_date('" + strvalue + "','yyyy-mm-dd')";
	                }
	                var sql = "select " + fieldName + " from " + oDs.getAttribute("savetable") + " where " + fieldName + "=" + sQuotValue + sIdWhere;
	                var sRet = SqlToField(sql);
	                ret = IsSpace(sRet);
	                strMsg = "值已存在。";
	            }
	            break;

	    }
	}

	if (!ret) {
	    if (typeof (checkType) == "function") {
	        strChinese = "";
	        strMsg = alertMsg;
	    } else {
	        if (strChinese == checkType) strChinese = "";
	        if (strMsg == "") strMsg = "不是合法的" + checkType + "。";
	    }
	}

	var objSour = oEvent.srcElement || oEvent.target;
	
	//判断是否为明细数据集，2012-11-17
	var isDetailDs = false;
	if (!IsSpace(objSour)) {
	    var sDs = objSour.getAttribute("dataset");
	    if (!IsSpace(sDs)) {
	        var oDs = $obj(sDs);
	        isDetailDs = typeof(oDs.e_startRow) != "undefined";
	    } 
	}
	var bShowMsg = IsSpace(fcpubdata.area) == false && (fcpubdata.area.getAttribute("alertType") == 2 || fcpubdata.area.getAttribute("alertType") == 3) && !isDetailDs;
    if (typeof (objEvent) == "undefined" && eType != "Valid") {
        if (ret) { //验证失败后再验证通过时
            for (var i = fcpubdata.arrValidObj.length - 1; i >= 0; i--) {
                var obj = fcpubdata.arrValidObj[i];
                var objSRC = obj.srcElement || obj.target;
                if (objSRC.id == objSour.id) {
                    if (bShowMsg) {
                        if (typeof (objSour.oSysUIControl) != "undefined") objSour.oSysUIControl.removeCssClass("valid-fail-text");
                        objSour.oSpanMsgErr.style.display = "none";
                    }
                    Array.removeAt(fcpubdata.arrValidObj, i);
                }
            }

        } else {
        
            var iFind = 0;
            if (bShowMsg) {
                for (var i = fcpubdata.arrValidObj.length - 1; i >= 0; i--) {
                    var obj = fcpubdata.arrValidObj[i];
                    var objSRC = obj.srcElement || obj.target;
                    if (objSRC.id == objSour.id) {
                        if (obj.checkType == checkType && obj.alertMsg == alertMsg)
                            iFind = 1;
                        else
                            iFind = 2;

                        break;
                    }
                }
            }
            if (iFind == 0) {
                if (bShowMsg) {
                    var oSpanMsg;
                    if (typeof (objSour.oSpanMsgErr) == "undefined") {
                        oSpanMsg = document.createElement("SPAN");
                        NavJs.setClassName(oSpanMsg,"valid-fail-msg");
                        oSpanMsg.style.position = "absolute";
                        if (fcpubdata.area.getAttribute("alertType") == 2) {
                            oSpanMsg.style.top = objSour.offsetTop + 4;
                            oSpanMsg.style.left = objSour.offsetLeft + objSour.offsetWidth + 20; //20为间隔值
                        }
                        if (fcpubdata.area.getAttribute("alertType") == 3) {
                            oSpanMsg.style.top = objSour.offsetTop + objSour.offsetHeight + 4;
                            oSpanMsg.style.left = objSour.offsetLeft;
                        }
                        objSour.parentNode.appendChild(oSpanMsg);
                        objSour.oSpanMsgErr = oSpanMsg;
                    } else {
                        
                        oSpanMsg = objSour.oSpanMsgErr;
                    }
                    oSpanMsg.style.display = "";
                    oSpanMsg.innerText = strChinese + strMsg;
                    //加上界面的样式
                    if (typeof (objSour.oSysUIControl) == "undefined") objSour.oSysUIControl = new Sys.UI.Control(objSour);
                    objSour.oSysUIControl.addCssClass("valid-fail-text");
                }
                var obj = new Object();
                obj.srcElement = objSour;
                //obj.FieldValue = oEvent.FieldValue;
                //obj.DisplayLabel = oEvent.DisplayLabel;
                obj.type = oEvent.type;
                obj.checkType = checkType;
                obj.alertMsg = alertMsg;
                fcpubdata.arrValidObj[fcpubdata.arrValidObj.length] = obj;
            }
            if (iFind == 2) {
                objSour.oSpanMsgErr.innerText = strChinese + strMsg;
            }
            
        }
    }

    if (!ret) {
        if (bShowMsg == false)
            throw (new Error(-1, strChinese + strMsg)); //如果验证出错后需要alert出错误信息的话则需要这一行.
        else
            throw new Error(-2, "");  //为了中止执行后面的验证程序，只抛出异常，不alert出错误信息．   
	} 
}
///验证整个表单
///返回 ""表示通过,否则为错误信息.
///date 2008-03-07
function validAllForm(){
    for(var i=fcpubdata.arrValidObj.length-1;i>=0;i--){
        var obj = fcpubdata.arrValidObj[i];
        try{
            $valid(obj.checkType,obj.alertMsg,obj);
        }catch(e){
            return e.description;
        }
        //Array.removeAt(fcpubdata.arrValidObj,i);
    }
    //加上检查数据集的常规验证，2013-07-25
    if (!IsSpace(fcpubdata.arrValidDs)) {
        for (var i = 0; i < fcpubdata.arrValidDs.length; i++) {
            var obj = fcpubdata.arrValidDs[i];
            var errInfo = obj.oDs.dataValid(obj.oField, obj.oCont.value, 6);
            if (errInfo != "") {
                return errInfo;
            }
        }
        fcpubdata.arrValidDs = null;
    }
        return "";
}
function validDsGrid(dsGrid){
///校验曾经非法进入了数据集中的所有变动数据,在doSubmitData保存前调用
    if(dsGrid.isNeedValid == "yes"){
        var l = dsGrid.oDom.documentElement.childNodes.length - 1;
        var cols = dsGrid.FieldCount;
        for (var i = 0; i < l; i++) {
            if (dsGrid.oDom.documentElement.childNodes[i].getAttribute("rowstate") != "add" && dsGrid.oDom.documentElement.childNodes[i].getAttribute("rowstate") != "edit") continue;
            dsGrid.SetPos(i);
            for (var j = 0; j < cols; j++) {
                var sErr = dsGrid.dataValid(dsGrid.Field(j), NavJs.getNodeValue11(dsGrid.oDom,i,j), 5);
                if (sErr != "") return sErr;
            }
            var sErr = dsGrid.RunBeforeUpdate();
            if (sErr != "") return sErr;
        }
        dsGrid.isNeedValid = "no";
    }
    return "";
}
//合法的字段名（表单名）
function isValidFieldName(sValue)
{
    //判断字符串str是否正确，规则是第一个可以是字母和下划线，后面可以是数字，字母和下划线，下划线不能连续。

    var tmpSign = 0;//标志位，=0表示字符串出错
    if(!isNaN(sValue.charAt(0)))
    {
	    tmpSign = 1;
    }
    if (tmpSign == 1)
    {
	    return "第一个字符不能为数字";
    }

    if(!/^\w{1,200}$/.test(sValue))
    {
	    tmpSign = 2;
    }
    if (tmpSign == 2)
    {
	    return "只能由数字、字母、下划线组合而成";
    }

    var tmpStr = sValue;
    var t = "_";

    while (tmpStr.indexOf(t) != -1)
    {
	    if (tmpStr != sValue && tmpStr.indexOf(t) == 0)
	    {
		    tmpSign = 4;
		    break;
	    }
	    tmpStr = tmpStr.substr(tmpStr.indexOf(t)+1);
    }
    if (tmpSign == 4)
    {
	    return "两个下划线_不能连在一起";
    }

    if (tmpSign == 0)
    {
	    return "";
    }
}
	
function isLayoutValue(sValue,isG){
    ///判断是否是有效的布局位置值,如width height left top
	///isG = true 表示不能输入负数 
	///返回""表示是合法的,否则为错误信息
	var iLen = sValue.length;
	if(iLen == 0) return "" ;
	var sVal = sValue;
	if(iLen >2){
		var end2 = sValue.substring(iLen-2);
		if(end2 == "em" || end2 == "ex" || end2 == "px" || end2 == "pt" || end2 == "pc" || end2 == "cm" || end2 == "mm" || end2 == "in" ){
			sVal = sValue.substring(0,iLen-2);
		}
	}
	if(iLen > 1 ){
		var end1 = sValue.substring(iLen-1);
		if(end1 == "%"){
			sVal = sValue.substring(0,iLen-1);	
		}
	}	
	if(IsSpace(sVal) || IsNum(sVal)==false) return "非法值!";
	if(isG && sValue.substring(0,1) == "-") return "不能为负数!";
	return "";
}
	