///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

var _g_dt2_imgCBB = "images/cbb_drop.gif";
var _g_dt2_imgCurDay = "images/curDayTip.gif";
var _g_dt2_imgSelDay = "images/selDayBg.gif";

var _g_dt2_ShowingDTPicker = null;
var _g_dt2_theMonths = new Array("一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月");
var _g_dt2_theWeeks = new Array("日", "一", "二", "三", "四", "五", "六");
var _g_dt2_days = new Array(42);
var _g_dt2_UseTime = false;		//added by liuxr at 2009-5-13 是否使用时间
var dateFrm = null; //liujp新增
var objTxt =null; //txt对象
function DateControl20(ctn) {
	if(typeof ctn =="object"){
		objTxt=ctn;
		_dt2_drawDTPicker("txtname"); 

	}else {
	    objTxt = document.getElementById(ctn);
		_dt2_drawDTPicker(ctn); 
	}
}

function _dt2_drawDTPicker(ctn) {
    if (document.getElementById("div_dtTable_" + ctn) == null)
	{
		NavJs.insertHtml("BeforeEnd",document.body, "<div id='div_dtTable_" + ctn + "' style='position:absolute; visibility:hidden; left:0;  top:22; z-index:2;'></div>");
	}

	_dt2_showDTTable(ctn);
}

function _dt2_drawDTTable(ctn) {
	var strHTML;
	var hours = "";
	var minutes = "";
	if( objTxt.value == "" ) {
	    var now = new Date();
	    
	    var year = now.getYear();
	    year = (year < 1900 ? (1900 + year) : year);
	    
		var month = now.getMonth()+1;
		var day = now.getDate();
		//added by liuxr at 2009-5-13
		hours = now.getHours();
		if (hours<10)
			hours = "0" + hours;
		minutes = now.getMinutes();
		if (minutes<10)
			minutes = "0" + minutes;
		//-----end------------------//
		if(month<10) {
		   var smonth="0"+month;
		}else{
		   var smonth=month;
		}
		if(day<10) {
		   var sday="0"+day;
		}else{
		   var sday=day;
		}
		//给当前日期作初值
		objTxt.value = year + "-" + smonth + "-" + sday;
		//此switch由LIUJP创建-2010-03-11
		switch (dateFrm) {
		    case "year": objTxt.value = year; break;
		    case "year-m": objTxt.value = year + "-" + smonth; break;
		}
		
		//added by liuxr at 2009-5-13 如果使用时间，默认值加上时间
		if (_g_dt2_UseTime)
			objTxt.value = objTxt.value + " " + hours + ":" + minutes;

        //赋当天日期的值后,需要发生onchange事件,以便通知数据集相应变化.            _dt2_fireChangeDate();
	}else {
		var year = _dt2_getDTYear(ctn);
		var month = _dt2_getDTMonth(ctn);
		var day = _dt2_getDTDay(ctn);
		if (_g_dt2_UseTime)
		{
			hours = _dt2_getDTHour(ctn);
			minutes = _dt2_getDTMinute(ctn);
		}
	}

	var i = 0;
    //此switch由LIUJP创建-2010-03-11
	switch (dateFrm) {
	    case "year":
	        $id("div_dtTable_" + ctn).innerHTML = "<iframe src='' name='_dt2_iframe_" + ctn + "' id='_dt2_iframe_" + ctn + "' width='200' height='110' border=0 NORESIZE=NORESIZE SCROLLING=no MARGINWIDTH=0 MARGINHEIGHT=0 FRAMESPACING=0 FRAMEBORDER=0></iframe>";
	        strHTML = "<html><head></head><body leftmargin=0 topmargin=0 style='font-size:9pt; font-family:宋体; border-width:1px; border-style:solid; border-color:#000000'><table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0' style='font-size:9pt;' bgcolor='#ffffff'>";
	        strHTML += "<tr>";
	        strHTML += "<td valign='top'>";
	        strHTML += "<table border='0' width='100%' height='25' cellpadding='0' cellspacing='0' bgcolor='#004080'> ";
	        strHTML += "<tr align='right'><td width=3></td>";
	        strHTML += "<td style='font-size:9pt; color:#ffffff;'><input id='dt2_input_year_" + ctn + "' type='text' size='4' key='false' minLength='0' maxLength='4' value='" + year + "' style='font-size:9pt;text-align:right; width:32px; border-left: #000000 solid 1; border-right: #000000 solid 1; border-top: #000000 solid 1; border-bottom: #000000 solid 1;' onblur=\"javascript:window.parent._dt2_onYearChange_yearFrm('" + ctn + "');\"></td>";
	        strHTML += "<td align='left' width='20'><input type='button' value='▲' onClick=\"window.parent._dt2_addYear_yearFrm('" + ctn + "')\" style='height:10;width:17;font-size:4pt'><br><input type='button' value='▼' onClick=\"window.parent._dt2_subYear_yearFrm('" + ctn + "')\" style='height:10;width:17;font-size:4pt'>";
	        strHTML += "</td><td style='font-size:9pt'>&nbsp;</td><td align='right'><input type='button'  style='height:18px; width:18px;font-size:7pt' onclick='javascript:window.parent._dt2_closeDTTable(\"" + ctn + "\");' value='X' title='关闭'></td><td width=2></td></tr>";
	        strHTML += "</table></td></tr><tr><td><table id='_dt2_dttable_" + ctn + "' style='font-size:9pt' border='0' width='100%' height='100%' cellpadding='0' cellspacing='0' >";
	        strHTML += "</table></td></tr></table></body></html>";
	        $win("_dt2_iframe_" + ctn).document.open();
	        $win("_dt2_iframe_" + ctn).document.write(strHTML);
	        $win("_dt2_iframe_" + ctn).document.close();
	        _dt2_drawDTYears(ctn, year);
	        break;
	    case "year-m":
	        $id("div_dtTable_" + ctn).innerHTML = "<iframe src='' name='_dt2_iframe_" + ctn + "' id='_dt2_iframe_" + ctn + "' width='200' height='110' border=0 NORESIZE=NORESIZE SCROLLING=no MARGINWIDTH=0 MARGINHEIGHT=0 FRAMESPACING=0 FRAMEBORDER=0></iframe>";
	        strHTML = "<html><head></head><body leftmargin=0 topmargin=0 style='font-size:9pt; font-family:宋体; border-width:1px; border-style:solid; border-color:#000000'><table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0' style='font-size:9pt;' bgcolor='#ffffff'>";
	        strHTML += "<tr>";
	        strHTML += "<td valign='top'>";
	        strHTML += "<table border='0' width='100%' height='25' cellpadding='0' cellspacing='0' bgcolor='#004080'> ";

	        strHTML += "<tr align='right'><td width=3></td><td align='left' style='font-size:9pt'><input type='button' style='height:18px; width:24px;font-size:9pt' value='《 ' onclick=\"javascript:window.parent._dt2_subMonth_monFrm('" + ctn + "');\"></td>";
	        strHTML += "<td style='font-size:9pt; color:#ffffff;'><input id='dt2_input_year_" + ctn + "' type='text' size='4' key='false' minLength='0' maxLength='4' value='" + year + "' style='font-size:9pt;text-align:right; width:32px; border-left: #000000 solid 1; border-right: #000000 solid 1; border-top: #000000 solid 1; border-bottom: #000000 solid 1;' onblur=\"javascript:window.parent._dt2_onYearChange_yearFrm('" + ctn + "');\"></td>";
	        strHTML += "<td align='left' width='20'><input type='button' value='▲' onClick=\"window.parent._dt2_addYear_yearFrm('" + ctn + "')\" style='height:10;width:17;font-size:4pt'><br><input type='button' value='▼' onClick=\"window.parent._dt2_subYear_yearFrm('" + ctn + "')\" style='height:10;width:17;font-size:4pt'>";
	        strHTML += "<td align='center'><select id='dt2_cbb_month_" + ctn + "' onchange=\"javascript:window.parent._dt2_onMonthChange_monFrm('" + ctn + "');\" style='width:60px; font-size:9pt'>";

	        for (i = 0; i < 12; i++) {
	            strHTML += "<option value='" + (i + 1) + "'";
	            if (i + 1 == month)
	                strHTML += " selected";
	            strHTML += ">" + _g_dt2_theMonths[i] + "</option>";
	        }
	        strHTML += "</select></td><td style='font-size:9pt'><input type='button'  style='height:18px; width:24px;font-size:9pt' value=' 》' onclick=\"javascript:window.parent._dt2_addMonth_monFrm('" + ctn + "');\">&nbsp;</td><td align='right'><input type='button'  style='height:18px; width:18px;font-size:7pt' onclick='javascript:window.parent._dt2_closeDTTable(\"" + ctn + "\");' value='X' title='关闭'></td><td width=2></td></tr>";
	        strHTML += "</table></td></tr><tr><td><table id='_dt2_dttable_" + ctn + "' style='font-size:9pt' border='0' width='100%' height='100%' cellpadding='0' cellspacing='0' >";
	        strHTML += "</table></td></tr></table></body></html>";
	        $win("_dt2_iframe_" + ctn).document.open();
	        $win("_dt2_iframe_" + ctn).document.write(strHTML);
	        $win("_dt2_iframe_" + ctn).document.close();
	        _dt2_drawDTYears(ctn, year);
	        break;
	    default:

	        $id("div_dtTable_" + ctn).innerHTML = "<iframe src='' name='_dt2_iframe_" + ctn + "' id='_dt2_iframe_" + ctn + "' width='200' height='157' border=0 NORESIZE=NORESIZE SCROLLING=no MARGINWIDTH=0 MARGINHEIGHT=0 FRAMESPACING=0 FRAMEBORDER=0></iframe>";

	        strHTML = "<html><head></head><body leftmargin=0 topmargin=0 style='font-size:9pt; font-family:宋体; border-width:1px; border-style:solid; border-color:#000000'><table border='0' width='100%' height='100%' cellpadding='0' cellspacing='0' style='font-size:9pt;' bgcolor='#ffffff'>";
	        strHTML += "<tr>";
	        strHTML += "<td valign='top'>";
	        strHTML += "<table border='0' width='100%' height='25' cellpadding='0' cellspacing='0' bgcolor='#004080'> ";

	        //draw year and month
	        strHTML += "<tr align='right'><td width=3></td><td align='left' style='font-size:9pt'><input type='button' style='height:18px; width:24px;font-size:9pt' value='《 ' onclick=\"javascript:window.parent._dt2_subMonth('" + ctn + "');\"></td>";
	        strHTML += "<td style='font-size:9pt; color:#ffffff;'><input id='dt2_input_year_" + ctn + "' type='text' size='4' key='false' minLength='0' maxLength='4' value='" + year + "' style='font-size:9pt;text-align:right; width:32px; border-left: #000000 solid 1; border-right: #000000 solid 1; border-top: #000000 solid 1; border-bottom: #000000 solid 1;' onblur=\"javascript:window.parent._dt2_onYearChange('" + ctn + "');\"></td>";
	        strHTML += "<td align='left' width='20'><input type='button' value='▲' onClick=\"window.parent._dt2_addYear('" + ctn + "')\" style='height:10;width:17;font-size:4pt'><br><input type='button' value='▼' onClick=\"window.parent._dt2_subYear('" + ctn + "')\" style='height:10px;width:17px;font-size:4pt'>";
	        strHTML += "<td align='center'><select id='dt2_cbb_month_" + ctn + "' onchange=\"javascript:window.parent._dt2_onMonthChange('" + ctn + "');\" style='width:60px; font-size:9pt'>";

	        for (i = 0; i < 12; i++) {
	            strHTML += "<option value='" + (i + 1) + "'";
	            if (i + 1 == month)
	                strHTML += " selected";
	            strHTML += ">" + _g_dt2_theMonths[i] + "</option>";
	        }
	        strHTML += "</select></td><td style='font-size:9pt'><input type='button'  style='height:18px; width:24px;font-size:9pt' value=' 》' onclick=\"javascript:window.parent._dt2_addMonth('" + ctn + "');\">&nbsp;</td><td align='right'><input type='button'  style='height:18px; width:18px;font-size:7pt' onclick='javascript:window.parent._dt2_closeDTTable(\"" + ctn + "\");' value='X' title='关闭'></td><td width=2></td></tr>";
	        strHTML += "</table></td></tr><tr><td>";

	        //draw weeks
	        strHTML += "<table id='_dt2_dttable_" + ctn + "' style='font-size:9pt' border='0' width='100%' height='100%' cellpadding='0' cellspacing='0' > ";
	        strHTML += "<thead><tr>";
	        for (i = 0; i < 7; i++)
	            strHTML += "<td valign='bottom' align='center' height='16' style='font-size:9pt; color:#004080;'>" + _g_dt2_theWeeks[i] + "</td>";
	        strHTML += "</tr><tr><td height='1' colspan='7' bgcolor='#000000'></td></tr>";
	        strHTML += "</thead>";
	        strHTML += "<tbody></tbody>";
	        strHTML += "<tfoot><tr><tr><td colspan='7' height='1' bgcolor='#000000'></td></tr>";
	        //var curDay = new Date();
	        strHTML += "<tr><td valign='bottom' colspan='7' style='font-color:#000000; font-weight:bold; font-size:9pt; verical-align:bottom;'><span style='cursor:hand;color:blue;' onclick='javascript:window.parent._dt2_getCurDay();'>&nbsp;今天:</span>" + _dt_getToday() + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style='cursor:hand;font-weight:normal;font-size:9pt; color:#004080;' onclick='javascript:window.parent._dt2_ClearDate(\"" + ctn + "\");'>清除</span>&nbsp;&nbsp;</td></tr>";

	        //added by liuxr at 2009-5-13 增加时间选择功能
	        if (_g_dt2_UseTime) {
	            strHTML += "<tr><td colspan='7' height='1' bgcolor='#000000'></td></tr><tr><td colspan='7'><table width='100%' border='0' cellpadding='0' cellspacing='0'>";
	            strHTML += "<tr><td width='45' style='font-size:9pt; color:#004080;align:rigth'>&nbsp;时间：</td><td style='font-size:9pt; color:#ffffff;' width='33'><input id='dt2_input_hour_" + ctn + "' type='text' readonly='true' size='2' key='false' minLength='0' maxLength='2' value='" + hours + "' style='font-size:9pt;text-align:right; width:32px; border-left: #000000 solid 1; border-right: #000000 solid 1; border-top: #000000 solid 1; border-bottom: #000000 solid 1;'>";
	            strHTML += "</td><td align='left' width='20'>";
	            strHTML += "<input type='button' value='▲' onClick=\"window.parent._dt2_addHour('" + ctn + "')\" style='height:10px;width:17px;font-size:4pt'><br><input type='button' value='▼' onClick=\"window.parent._dt2_subHour('" + ctn + "')\" style='height:10px;width:17px;font-size:4pt'>";
	            strHTML += "</td><td style='font-size:9pt; color:#ffffff;' width='32'>";
	            //strHTML += "<td align='center' width='6'>：</td>";
	            strHTML += "<input id='dt2_input_minute_" + ctn + "' type='text' size='2' key='false' minLength='0' maxLength='2' readonly='true' value='" + minutes + "' style='font-size:9pt;text-align:right; width:32px; border-left: #000000 solid 1; border-right: #000000 solid 1; border-top: #000000 solid 1; border-bottom: #000000 solid 1;'>";
	            strHTML += "</td><td align='left' width='20'>";
	            strHTML += "<input type='button' value='▲' onClick=\"window.parent._dt2_addMinute('" + ctn + "')\" style='height:10px;width:17px;font-size:4pt'><br><input type='button' value='▼' onClick=\"window.parent._dt2_subMinute('" + ctn + "')\" style='height:10px;width:17px;font-size:4pt'>";
	            strHTML += "</td><td>&nbsp;</td></tr></table></td></tr>";
	        }
	        //---------------------------------end--------------------//
	        strHTML += "</tfoot></table></body></html>";
	        $win("_dt2_iframe_" + ctn).document.open();
	        $win("_dt2_iframe_" + ctn).document.write(strHTML);
	        $win("_dt2_iframe_" + ctn).document.close();
	        _dt2_drawDTDays(ctn, year, month, day);
	}
}


/**
 * @func 获取当前日期
 * @date 2009-5-14
**/
function _dt2_getCurDay()
{
	var curDay = new Date();
	try
	{
		objTxt.value= curDay.getFullYear() + "-" + ((curDay.getMonth() < 9) ? "0" + (curDay.getMonth() + 1) : (curDay.getMonth() + 1)) + "-" + ((curDay.getDate() < 10) ? "0" + curDay.getDate() : curDay.getDate()) ;
		if (_g_dt2_UseTime)
		{
			var hours = curDay.getHours();
			var minutes = curDay.getMinutes();
			objTxt.value = objTxt.value + " "  + ((hours < 10) ? "0" + hours:hours) + ":" + ((minutes < 10) ? "0" + minutes:minutes);
		}
	}catch(e){}
}

function _dt2_showDTTable(ctn) {
	if ( _g_dt2_ShowingDTPicker != null ) {
		if( ctn != _g_dt2_ShowingDTPicker ) {
		    document.getElementById("div_dtTable_" + _g_dt2_ShowingDTPicker).innerHTML = "";
		    document.getElementById("div_dtTable_" + _g_dt2_ShowingDTPicker).style.visibility = "hidden";
		}
    }

    var event = NavJs.getEvent();
    var eventObj = NavJs.getEventObj();
	ct = document.getElementById("div_dtTable_" + ctn);
	if ( ct.style.visibility == "hidden") {
		_dt2_drawDTTable(ctn);
		ct.style.visibility = "visible";
		//alert(document.body.scrollLeft + "  " + document.body.scrollTop )
		if (objTxt.id == "fc_txtName") { //2011-05-10 加上grid的dropdownlist控件选日期的情况.
		    var oGrid = objTxt.parentNode.parentNode;
		    var sControlType = oGrid.getAttribute("controltype");
		    if (sControlType == "ebiao" || sControlType == "layout" || sControlType == "eblayout") {
		        var oDropDownList = objTxt.parentNode;
		        x = getAbsLeft(oDropDownList);
		        y = getAbsTop(oDropDownList) + 17;
		        //加上 SKbillsheet的滚动条的偏移量 2011-07-11
		        x = x - document.body.scrollLeft;
		        y = y - document.body.scrollTop;
		        
		    } else {
		        x = getAbsLeft($obj(eventObj.parentNode).curTD);
		        y = getAbsTop($obj(eventObj.parentNode).curTD) + 17;
		    }

		} else {
		    x = event.clientX - event.offsetX - 4;
		    y = event.clientY - event.offsetY + 17;
		}
		//一个编辑框边加上一个参照按钮
		try {
		    if (eventObj.type == "button" && eventObj.tagName == "BUTTON") {
		
				x=x-objTxt.offsetWidth+4;
			}
		} catch (E) { }
		/*
		if(window.event.srcElement.tagName == "fc_code"){
			if(window.event.srcElement.parentNode.tagName == "webgrid"){
				x = getAbsLeft(window.event.srcElement.parentNode.curTD)
				x = getAbsTop(window.event.srcElement.parentNode.curTD)
				window.event.srcElement.parentNode.hide()
			}
		
			//x = getPosLeft(window.event.srcElement)
			//y = getPosTop(window.event.srcElement)
		}
		*/
		clWidth = getClientSize().width;
		if ( clWidth < 200 ) {
			x = 1 + document.body.scrollLeft ;
		} else if ( x + 200 + 1 > clWidth) {
			x = clWidth - 200 - 1 + document.body.scrollLeft ;
		} else {
			x = x + document.body.scrollLeft ;
		}
		clHeight = getClientSize().height;
		var y1 = y + 140 + 1 - clHeight ;
		if (clHeight < 140) {	//窗口的高度小于日历窗口的高度,所以top=1
			y = 1 + document.body.scrollTop;
		} else if ( y + 140 + 1 > clHeight){	//当日历窗口在控件的下面显示不下时.要移到上面显示
			y = clHeight - 140 - 1 + document.body.scrollTop ;
		} else {	//直接在下面显示日历窗口
			y = y + document.body.scrollTop ;	
		}
		
		ct.style.left = x + "px";
		ct.style.top = y + "px";
		_g_dt2_ShowingDTPicker = ctn;
		//document.attachEvent("onmousedown", _dt2_HideDateWin);
		NavJs.addEvent(document, "onmousedown", _dt2_HideDateWin);
	} else {
		_dt2_closeDTTable(ctn);
	}
}

function _dt2_closeDTTable(ctn) {
	ct = document.getElementById("div_dtTable_" + ctn);
	ct.innerHTML = "";
	ct.style.visibility = "hidden";
	_g_dt2_ShowingDTPicker = null;

	_dt2_fireChangeDate();
}
/**
* 日期值改变的通知 2011-05-13
**/
function _dt2_fireChangeDate() {
    if (objTxt.id == "txtMyGrid") {
        var oGrid = objTxt.parentNode.parentNode;
        //var o=window.document.all.tags("webgrid")
        //for(var ii=0;ii<o.length;ii++){
        $obj(oGrid).txtTotd();
        //}
        //eval('txtMyGrid.style.display="block";txtMyGrid.focus();txtMyGrid.parentNode.parentNode.Act_onDataChange("强行发生数据改变事件");')
        objTxt.style.display = "block";
        objTxt.focus();
        $obj(oGrid).Act_onDataChange("强行发生数据改变事件");
    } else if (objTxt.id == "fc_txtName") { //2011-05-10 加上grid的dropdownlist控件选日期的情况.
        var oGrid = objTxt.parentNode.parentNode;
		var sControlType = oGrid.getAttribute("controltype");
		if (sControlType == "ebiao" || sControlType == "layout" || sControlType == "eblayout") { //2011-06-21 加上ebiao控件中用dropdownlist选日期
            var oDropDownList = objTxt.parentNode;
            var sDs = oDropDownList.getAttribute("dataset");
            if (typeof sDs != "undefined" && sDs != null && sDs != "") {
                var oDs = $obj(sDs);
                oDs.Field(oDropDownList.getAttribute("field")).Value = objTxt.value;
                new Eapi.EformEbiao().fset_cont2(oDs, oGrid); //刷新E表控件
            }
                
        } else {
            $obj(oGrid).curTD.innerText = objTxt.value;
            $obj(oGrid).Act_onDataChange("强行发生数据改变事件");
        }

    } else {
        objTxt.focus();
        //强行发生改变事件，以便向fset传值
        //objTxt.fireEvent("onchange");
        NavJs.fireEvent(objTxt, "onchange");

        var sDs = objTxt.getAttribute("dataset");
        if (typeof sDs != "undefined" && sDs != null && sDs != "") {
            var oDs = $obj(sDs);
            oDs.Field(objTxt.getAttribute("field")).Value = objTxt.value;
           
        }
    }

}
/**
* added by liuxr at 2009-9-22 17:21 增加清除日期的功能 
**/
function _dt2_ClearDate(ctn)
{
	try
	{
		objTxt.value = "";
		_dt2_closeDTTable(ctn);
	}catch(e){}
}

function _dt2_getDTYear(ctn) {
	if ( objTxt.value.length > 0 ) {
		year = parseInt(objTxt.value.substr(0, 4));
		if ( !isNaN(year) ) 
			return year;
	}
	return 1900;
}

function _dt2_getDTMonth(ctn) {
	var value = objTxt.value;
	if ( value.length > 0 ) {
		pos = value.indexOf('-');
		if ( pos > 0 ) {
			if ( value.substr(pos+1, 1) == '0' ) {
				month = parseInt(value.substr(pos+2, 1));
			} else {
				month = parseInt(value.substr(pos+1, 2));
			}
			//alert(month)
			//month = parseInt(value.substr(pos+1, 2));
			if ( !isNaN(month) )
				return month;
		}
	}
	return 1;
}

function _dt2_getDTDay(ctn) {
	var value = objTxt.value;
	if ( value.length > 0 ) {
		pos = value.indexOf('-');
		if ( pos > 0 ) {
			dpos = value.indexOf('-', pos+1);
			if (dpos > 0) {
				if ( value.substr(dpos+1, 1) == '0' ) {
					day = parseInt(value.substr(dpos+2, 1));
				} else {
					day = parseInt(value.substr(dpos+1, 2));
				}
				
				//day = parseInt(value.substr(dpos+1, 2));
				if ( !isNaN(day) )
					return day;
			}
		}
	}
	return 1;
//	var dt = new Date(_dt2_GetStdDate(objTxt.value).replace("-", "/"))
//	return dt.getDate();
}

/**
 * @func 获取日期的小时
 * @date 2009-5-13
**/
function _dt2_getDTHour(ctn) {
	var value = objTxt.value;
	if ( value.length > 0 ) 
	{
		var stime = value.split(' ')[1];
		if (typeof stime != "undefined" && stime.length > 0)
		{
			var shour = stime.split(':')[0];
			if (shour.length == 0) return "";
			//if (shour.substring(0,1) == '0')
				//shour = shour.substring(1,2);
			//shour = parseInt(shour,10);
			if (!isNaN(shour))
				return shour;
		}
	}
	return "";
}

/**
 * @func 获取日期的分钟
 * @date 2009-5-13
**/
function _dt2_getDTMinute(ctn) {
	var value = objTxt.value;
	if ( value.length > 0 ) 
	{
		var stime = value.split(' ')[1];
		if (typeof stime != "undefined" && stime.length > 0)
		{
			var sminute = stime.split(':')[1];
			if (typeof sminute == "undefined" || sminute.length ==0) return "";
			//if (sminute.substring(0,1) == '0')
				//sminute = sminute.substring(1,2);
			//sminute = parseInt(sminute,10);
			if (!isNaN(sminute))
				return sminute;
		}
	}
	return "";
}


function _dt2_setDTYear(ctn, year) {
	_dt2_setDT(ctn, year, _dt2_getDTMonth(ctn), _dt2_getDTDay(ctn));
}
function _dt2_setDTMonth(ctn, month) {
	var year = _dt2_getDTYear(ctn);
	var day = _dt2_getDTDay(ctn);
	var maxDays = _dt2_getDayCount(year, month);
	day = day < maxDays ? day : maxDays;
	_dt2_setDT(ctn, year, month, day);
}
function _dt2_setDTDay(ctn, day) {
	_dt2_setDT(ctn, _dt2_getDTYear(ctn), _dt2_getDTMonth(ctn), day);
}

function _dt2_setDT(ctn, year, month, day) { //,hour,minute
    var s = year + "/" + (month < 10 ? "0" + month : month) + "/" + (day < 10 ? "0" + day : day);
    if (_g_dt2_UseTime) {
        var hours = parseInt($id("dt2_input_hour_" + ctn, $win("_dt2_iframe_" + ctn)).value, 10);
        //alert(window.frames("_dt2_iframe_" + ctn).document.all("dt2_input_minute_" + ctn).value);
        var minutes = parseInt($id("dt2_input_minute_" + ctn, $win("_dt2_iframe_" + ctn)).value, 10);

        if (hours.toString() == "" || isNaN(hours) || parseInt(hours, 10) < 0 || parseInt(hours, 10) > 23) {
            alert("错误：日期中的小时格式不正确定，请输入0--23之间的数字。");
            return;
        }
        if (minutes.toString() == "" || isNaN(minutes) || parseInt(minutes, 10) < 0 || parseInt(minutes, 10) > 59) {
            alert("错误：日期中的分钟格式不正确定，请输入0--59之间的数字。");
            return;
        }
        //_dt2_setDT(ctn, year, month, day, hours, minutes);
        objTxt.value = _dt2_GetStdDate(s, hours, minutes);
    } else {
        objTxt.value = _dt2_GetStdDate(s);
    }
}
function _dt_setToday(){
	objTxt.value = _dt_getToday();
}
function _dt_getToday(){
	var curDay = new Date();
	return curDay.getFullYear() + "-" + ((curDay.getMonth() < 9) ? "0" + (curDay.getMonth() + 1) : (curDay.getMonth() + 1)) + "-" + ((curDay.getDate() < 10) ? "0" + curDay.getDate() : curDay.getDate()) ;
}
//此方法由LIUJP创建-2010-03-11
function _dt2_onYearChange_yearFrm(ctn) {
    var year = parseInt($id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn)).value);
    if (!isNaN(year)) {
        _dt2_setDTYear(ctn, year);
        _dt2_drawDTYears(ctn, year);
    } else {
        alert("非法的年份格式，请重新输入年份");
        $id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn)).focus();
    }
}

function _dt2_onYearChange(ctn) {
    var year = parseInt($id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn)).value);
	if (!isNaN(year)) {
		_dt2_setDTYear(ctn, year);
		_dt2_drawDTDays(ctn, year, _dt2_getDTMonth(ctn), _dt2_getDTDay(ctn));
	} else {
		alert("非法的年份格式，请重新输入年份");
		$id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn)).focus();
	}
}
//此方法由LIUJP创建-2010-03-11
function _dt2_onMonthChange_monFrm(ctn) {
    var month = parseInt($id("dt2_cbb_month_" + ctn, $win("_dt2_iframe_" + ctn)).value);
    if (month == 0)
        return;
    if (!isNaN(month)) {
        _dt2_setDTMonth(ctn, month);
    }
}

function _dt2_onMonthChange(ctn) {
    var month = parseInt($id("dt2_cbb_month_" + ctn, $win("_dt2_iframe_" + ctn)).value);
	if (month == 0)
		return;
	if ( !isNaN(month) )	{
		_dt2_setDTMonth(ctn, month);
		_dt2_drawDTDays(ctn, _dt2_getDTYear(ctn), month, _dt2_getDTDay(ctn));
	}
}
//此方法由LIUJP创建-2010-03-11
function _dt2_addYear_yearFrm(ctn) {
    var obj = $id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn));
    var year = parseInt(obj.value);
    if (isNaN(year)) {
        alert("非法的年份格式，请重新输入年份");
        obj.focus();
        return;
    }
    obj.value = year + 1;
    _dt2_setDTYear(ctn, year + 1);
    _dt2_drawDTYears(ctn, year);
}

function _dt2_addYear(ctn) {
    var obj = $id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn));
    var year = parseInt(obj.value);
	if (isNaN(year)) {
		alert("非法的年份格式，请重新输入年份");
		obj.focus();
		return;
	}
	obj.value = year + 1;
	_dt2_setDTYear(ctn, year+1);
	_dt2_drawDTDays(ctn, year + 1, _dt2_getDTMonth(ctn), _dt2_getDTDay(ctn));
}
//此方法由LIUJP创建-2010-03-11
function _dt2_subYear_yearFrm(ctn) {
    var obj = $id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn));
    var year = parseInt(obj.value);
    if (isNaN(year)) {
        alert("非法的年份格式，请重新输入年份");
        obj.focus();
        return;
    }
    obj.value = year - 1;
    _dt2_setDTYear(ctn, year - 1);
    _dt2_drawDTYears(ctn, year);
}

function _dt2_subYear(ctn) {
    var obj = $id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn));
    var year = parseInt(obj.value);
	if (isNaN(year)) {
		alert("非法的年份格式，请重新输入年份");
		obj.focus();
		return;
	}
	obj.value = year - 1;
	_dt2_setDTYear(ctn, year-1);
	_dt2_drawDTDays(ctn, year - 1, _dt2_getDTMonth(ctn), _dt2_getDTDay(ctn));
}
//此方法由LIUJP创建-2010-03-11
function _dt2_addMonth_monFrm(ctn) {
    var objM = $id("dt2_cbb_month_" + ctn, $win("_dt2_iframe_" + ctn));
    var month = parseInt(objM.value);
    var year = parseInt($id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn)).value);

    if (isNaN(year) || isNaN(month))
        return;

    if (month == 12) {
        year++;
        month = 1;
    } else {
        month++;
    }
    objM.value = month;
    _dt2_setDT(ctn, year, month, _dt2_getDTDay(ctn));
}

function _dt2_addMonth(ctn) {
    var objM = $id("dt2_cbb_month_" + ctn, $win("_dt2_iframe_" + ctn));
    var month = parseInt(objM.value);
    var year = parseInt($id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn)).value);

	if ( isNaN(year) || isNaN(month) )
		return;

	if ( month == 12 ) {
		year ++;
		month = 1;
	} else {
		month ++;
	}
	objM.value = month;
	_dt2_setDT(ctn, year, month, _dt2_getDTDay(ctn));
	_dt2_drawDTDays(ctn, year, month, _dt2_getDTDay(ctn));
}
//此方法由LIUJP创建-2010-03-11
function _dt2_subMonth_monFrm(ctn) {
    var objM = $id("dt2_cbb_month_" + ctn, $win("_dt2_iframe_" + ctn));
    var month = parseInt(objM.value);
    var year = parseInt($id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn)).value);

    if (isNaN(year) || isNaN(month))
        return;

    if (month == 1) {
        year--;
        month = 12;
    } else {
        month--;
    }
    objM.value = month;
    _dt2_setDT(ctn, year, month, _dt2_getDTDay(ctn));
}
function _dt2_subMonth(ctn) {
    var objM = $id("dt2_cbb_month_" + ctn, $win("_dt2_iframe_" + ctn));
	var month = parseInt(objM.value);
	var year = parseInt($id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn)).value);

	if ( isNaN(year) || isNaN(month) )
		return;

	if ( month == 1 ) {
		year --;
		month = 12;
	} else {
		month --;
	}
	objM.value = month;
	_dt2_setDT(ctn, year, month, _dt2_getDTDay(ctn));
	_dt2_drawDTDays(ctn, year, month, _dt2_getDTDay(ctn));
}

/**
 * @func 增加小时
 * @date 2009-5-13
**/
function _dt2_addHour(ctn) {
    var objH = $id("dt2_input_hour_" + ctn, $win("_dt2_iframe_" + ctn));
	var hour = parseInt(objH.value,10);
	if (isNaN(hour)) {
		alert("非法的小时格式，请重新输入小时");
		objH.focus();
		objH.value = new Date().getHours();
		return;
	}
	if (hour<23)
		objH.value = hour + 1;
	//_dt2_setDTYear(ctn, year+1);
	//_dt2_drawDTDays(ctn, year + 1, _dt2_getDTMonth(ctn), _dt2_getDTDay(ctn));
}

/**
 * @func 递减小时
 * @date 2009-5-13
**/
function _dt2_subHour(ctn) {
    var objH = $id("dt2_input_hour_" + ctn, $win("_dt2_iframe_" + ctn));
    var hour = parseInt(objH.value, 10);
	if (isNaN(hour)) {
		alert("非法的小时格式，请重新输入小时");
		objH.focus();
		objH.value = new Date().getHours();
		return;
	}
	if (hour>0)
		objH.value = hour - 1;
	//_dt2_setDTYear(ctn, year-1);
	//_dt2_drawDTDays(ctn, year - 1, _dt2_getDTMonth(ctn), _dt2_getDTDay(ctn));
}

/**
 * @func 增加分钟
 * @date 2009-5-13
**/
function _dt2_addMinute(ctn) {
    var objM = $id("dt2_input_minute_" + ctn, $win("_dt2_iframe_" + ctn));
	var minute = parseInt(objM.value,10);
	if (isNaN(minute)) {
		alert("非法的分钟格式，请重新输入分钟");
		objM.focus();
		objM.value = new Date().getMinutes();
		return;
	}
	if (minute<59)
		objM.value = minute + 1;
	//_dt2_setDTYear(ctn, year+1);
	//_dt2_drawDTDays(ctn, year + 1, _dt2_getDTMonth(ctn), _dt2_getDTDay(ctn));
}

/**
 * @func 递减分钟
 * @date 2009-5-13
**/
function _dt2_subMinute(ctn) {
    var objM = $id("dt2_input_minute_" + ctn, $win("_dt2_iframe_" + ctn));
    var minute = parseInt(objM.value, 10);
	if (isNaN(minute)) {
		alert("非法的分钟格式，请重新输入分钟");
		objM.focus();
		objM.value = new Date().getMinutes();
		return;
	}
	if (minute>0)
		objM.value = minute - 1;
	//_dt2_setDTYear(ctn, year-1);
	//_dt2_drawDTDays(ctn, year - 1, _dt2_getDTMonth(ctn), _dt2_getDTDay(ctn));
}

function _dt2_drawDTDays(ctn, year, month, day) {
	var dayCount = _dt2_getDayCount(year, month);
	var dayIndex = 0;
	var preMonthDayCount = 0, preMonthShowDayCount = 0, nextMonthShowDayCount = 0;
	var startDate;
//	var table = $id("_dt2_dttable_" + ctn, $win("_dt2_iframe_" + ctn)); //.tBodies[0];
	var table = NavJs.child($id("_dt2_dttable_" + ctn, $win("_dt2_iframe_" + ctn)), "tbody", 0);

	if (month > 1)	{
		startDate = new Date(year, month-1, 1);
		preMonthDayCount = _dt2_getDayCount(year, month-1);
	} else {
		startDate = new Date(year-1, 12, 1);
		preMonthDayCount = _dt2_getDayCount(year-1, 12);
	}
	var week = startDate.getDay();
	var strHTML = "";

	preMonthShowDayCount = week;
	if ( week > 0 ) { 	
		if (month == 1) {			
			for ( i = week; i > 0; i -- )
				_g_dt2_days[dayIndex++] = 31 - i + 1;
		} else {
			for ( i = week; i > 0; i -- )
					_g_dt2_days[dayIndex++] = preMonthDayCount - i + 1;
		}
	}
	for ( i = 0; i < dayCount; i ++ ) {
		_g_dt2_days[dayIndex++] = i + 1;
	}
	nextMonthShowDayCount = 42 - dayIndex;
	for ( i = 0; i < nextMonthShowDayCount; i ++ ) {
		_g_dt2_days[dayIndex++] = i + 1;
	}

	//clear all rows
	while ( table.rows.length > 0 ) {
		table.deleteRow();
	}

	for ( i = 0; i < 6; i++ ) {
		aRow = table.insertRow(-1);
		for ( j = 0; j < 7; j++ ) {
			cell = aRow.insertCell(-1);
			cell.align = "center";
			cell.onmousemove = new Function("this.style.cursor='hand'; if ( this.style.color != 'white' ) this.style.backgroundColor='#4aff73';");
			cell.onmouseout = new Function("if ( this.style.color != 'white' ) this.style.backgroundColor='#ffffff';");
			cell.style.fontSize="9pt";
			
			if ( (i*7 + j) < preMonthShowDayCount ) {
				cell.style.color = "#808080";
				cell.onclick = new Function("_dt2_on_selectDay('" + ctn + "', -1, " + _g_dt2_days[i*7 + j] + ");");
			}
			else if ( (42 - (i*7 + j)) <= nextMonthShowDayCount ) {
				cell.style.color = "#909090";
				cell.onclick = new Function("_dt2_on_selectDay('" + ctn + "', 1, " + _g_dt2_days[i*7 + j] + ");");
			}
			else if ( _g_dt2_days[i*7 + j] == day) {
			    cell.style.color = "white"; //"#ffffff"
				cell.style.backgroundColor = "#004080";
				if (_g_dt2_UseTime == false)
					cell.onclick = new Function("_dt2_closeDTTable('" + ctn + "');");
				else
					cell.onclick = new Function("_dt2_on_selectDay('" + ctn + "', 0, " + _g_dt2_days[i*7 + j] + ");");
				//cell.style.backgroundImage="url('" + _g_dt2_imgSelDay + "')";
			}
			else {
				cell.style.color = (j == 0 || j == 6) ? "#f00000" : "#000000";
				cell.onclick = new Function("_dt2_on_selectDay('" + ctn + "', 0, " + _g_dt2_days[i*7 + j] + ");");
			}
			cell.innerText = _g_dt2_days[i*7 + j];
		}
	}
	
	//var oToday = window.frames("_dt2_iframe_" + ctn).document.all("_dt2_dttable_" + ctn).tFoot;
	//if(oToday != null)
	//	if(oToday.rows(0).cells(0) != null)
	//		oToday.rows(0).cells(0).childNodes(0).onclick = new Function("_dt_setToday()");
	//return strHTML;
}


//此方法由LIUJP创建
function _dt2_drawDTYears(ctn, year) {

    var table = $id("_dt2_dttable_" + ctn, $win("_dt2_iframe_" + ctn)); //.tBodies[0];
    while (table.rows.length > 0) {
        table.deleteRow();
    }

    for (i = 0; i < 4; i++) {
        aRow = table.insertRow();
        for (j = 0; j < 4; j++) {
            cell = aRow.insertCell();
            cell.align = "center";
            cell.onmousemove = new Function("this.style.cursor='hand'; if ( this.style.color != '#ffffff' ) this.style.backgroundColor='#4aff73';");
            cell.onmouseout = new Function("if ( this.style.color != '#ffffff' ) this.style.backgroundColor='#ffffff';");
            cell.style.fontSize = "9pt";
            //cell.style.color = "#909090"; //window.parent.
            cell.onclick = new Function("_dt2_setDTYear('" + ctn + "', " + (year - i * 4 - j) + ");window.frames('_dt2_iframe_" + ctn + "').document.all('dt2_input_year_" + ctn + "').value=" + (year - i * 4 - j) + ";_dt2_onYearChange_yearFrm('" + ctn + "');");
            cell.innerText = year - i * 4 - j;
        }
    }
}

function _dt2_on_selectDay(ctn, flag, day) 
{
    var year = parseInt($id("dt2_input_year_" + ctn, $win("_dt2_iframe_" + ctn)).value);
    var month = parseInt($id("dt2_cbb_month_" + ctn, $win("_dt2_iframe_" + ctn)).value);
		
	if ( isNaN(year) || isNaN(month) )
		return;
	//alert(year+month)
	if ( flag == -1 ) {
		if ( month == 1 ) {
			year --;
			month = 12;
		} else {
			month --;
		}
	}
	else if ( flag == 1 ) {
		if ( month == 12 ) {
			year ++;
			month = 1;
		} else {
			month ++;
		}
	}
//	if (_g_dt2_UseTime)
//	{
//	    var hours = parseInt($id("dt2_input_hour_" + ctn, $win("_dt2_iframe_" + ctn)).value, 10);
//		//alert(window.frames("_dt2_iframe_" + ctn).document.all("dt2_input_minute_" + ctn).value);
//	    var minutes = parseInt($id("dt2_input_minute_" + ctn, $win("_dt2_iframe_" + ctn)).value, 10);
//		
//		if (hours.toString() == "" || isNaN(hours) || parseInt(hours,10)<0 || parseInt(hours,10)>23)
//		{
//			alert("错误：日期中的小时格式不正确定，请输入0--23之间的数字。");
//			return;
//		}
//		if (minutes.toString() == "" || isNaN(minutes) || parseInt(minutes,10)<0 || parseInt(minutes,10)>59)
//		{
//			alert("错误：日期中的分钟格式不正确定，请输入0--59之间的数字。");
//			return;
//		}
//		_dt2_setDT(ctn, year, month, day,hours,minutes);
//	}
//	else
		_dt2_setDT(ctn, year, month, day);
	_dt2_closeDTTable(ctn);
	//alert(txtMyGrid.value)
		//alert(eval(ctn+".outerHTML"))
	
}

function _dt2_getDayCount(year, month) {
	switch(month) { 
	case 1:case 3:case 5:case 7:case 8:case 10:case 12:
		return 31;
	case 4:case 6:case 9:case 11:
		return 30;
	case 2:
		return (((year%4)==0) && ((year%10)!=0) ) || ((year%100)==0) ? 29 : 28;
	default:
		return 31;
	}
}

function _dt2_check(ctn) {
	if ( !_dt2_CheckDate( objTxt.value ) ) {
		objTxt.focus();
	}
}

function _dt2_CheckDate( dateStr ) {
	var standStr;
	var newDateObj;
	var strErr, idxMonth, idxDay;
	var year, month, day;

	strErr1 = "标准的日期格式如：\r\n    短日期格式：2000-02-21 \r\n    长日期格式：2000-02-21 21:01:20 或 2000-02-21 21:01\r\n";
	if ( dateStr.length == 0 ) {	
		alert("错误：日期不能为空，请输入标准格式的日期\r\n\r\n" + strErr1 );
		return false;
	}
	standStr = dateStr.replace("-","/");
	if ( dateStr.indexOf("-", 0) != 2 && dateStr.indexOf("-", 0) != 4 )	{
		alert("错误：日期输入不规范！\r\n\r\n" + strErr1);
		return false;
	}
	idxMonth = dateStr.indexOf("-", 0) + 1;
	idxDay = dateStr.indexOf("-", idxMonth) + 1;

	year = dateStr.substring(0, idxMonth - 1);
	month = dateStr.substring(idxMonth, idxDay - 1);
	if ( month < 1 || month > 12 ) {
		alert("错误：输入的月份无效\r\n");
		return false;
	}	
	if (dateStr.indexOf(" ", idxDay) != -1){
		day = dateStr.substring(idxDay, dateStr.indexOf(" ", idxDay));
	}else{
		day = dateStr.substring(idxDay);
	}
	newDateObj = new Date( standStr );
	if ( newDateObj == "NaN" ) {
		alert("错误：日期输入不规范！中间可能有空格或者字符\r\n\r\n" + strErr1);
		return false;
	}
	if ( day != newDateObj.getDate()) {
		alert("错误：日期不是正常公历日期！\r\n\r\n     公元" + parseInt(year) + "年" + parseInt(month) + "月没有" + day + "号！");
		return false;
	}
	return true;
}
function _dt2_GetStdDate( dateStr,hour,minute) {
	var newDateObj;
	var month, day;
	newDateObj = new Date( dateStr.replace("-", "/") );
	if ( newDateObj == "NaN" )
		return dateStr;

	month = newDateObj.getMonth() + 1;
	day = newDateObj.getDate();
//此switch由LIUJP创建-2010-03-11
	switch (dateFrm) {
	    case "year": return newDateObj.getFullYear(); break;
	    case "year-m": return newDateObj.getFullYear() + "-" + (month < 10 ? "0" + month : month); break;
	    default:
	        var sdate = newDateObj.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
	        if (typeof hour == "undefined" || typeof minute == "undefined") return sdate;
	        if (hour < 10) hour = "0" + hour;
	        if (minute < 10) minute = "0" + minute;
	        sdate = sdate + " " + hour + ":" + minute;
	        return sdate;
	}
}
///隐藏日期下拉窗口
function _dt2_HideDateWin() {
        var ctn = "txtname";
        var oDate = $id("div_dtTable_" + ctn);
        if (oDate != null) {
            if (oDate.style.visibility != "hidden") {
                oDate.innerHTML = "";
                oDate.style.visibility = "hidden";
                _g_dt2_ShowingDTPicker = null;

            }
        }
        //alert("show");
        //document.detachEvent("onmousedown", _dt2_HideDateWin);
        $removeHandler(document, "mousedown", _dt2_HideDateWin); //记住不能加 on ,用 onmousedown
        //$clearHandlers(document);
}

/**
	//进入日期参照
*@param obj 输入日期的文本框对象
*@param blUseTime 是否选择时间 true：是；false：否；
**/
function SelectDate(obj, blUseTime) {
    
    var dfrm = blUseTime; //此句由LIUJP创建-2010-04-29
	var ctrlName;
	if (IsSpace(obj)){
	    var iEvent = NavJs.getEvent();
	    if (IsSpace(iEvent) && fcpubdata.validEventObj != null) {
	        var oEvent = fcpubdata.validEventObj.obj;
	    }else{
	        var oEvent = iEvent.srcElement || iEvent.target;
	        //加上dropdownlist中选日期
	        if (IsSpace(oEvent) == false && IsSpace(oEvent.parentNode) == false && oEvent.parentNode.getAttribute("controltype") == "dropdownlist") {
	            oEvent = oEvent.parentNode;
	        }
	    }
	    
	    if (oEvent.tagName.toUpperCase() == "TD") {
			try {
				var oGrid=txtMyGrid.parentNode.parentNode;
			}catch(E){
				try {
				    var oGrid = oEvent.parentNode.parentNode.parentNode.parentNode.parentNode;
				}catch(E){
					var oGrid=$id("grid1");
				}
            }

            oGrid = $obj(oGrid.id);
			oGrid.moveedit(oEvent);
			if (oGrid.txt.style.display == "none") return; //如grid列只读则退出.
			ctrlName = oGrid.txt;   //"txtMyGrid"

        } else if (IsSpace(oEvent.tagName)==false && (oEvent.tagName.toUpperCase() == "FC_CODE" || oEvent.tagName.toUpperCase() == "FC:FC_CODE")) {
            
		    ctrlName = $obj(oEvent.id).txt;
		} else {
			ctrlName=oEvent;
		}
	}else if(typeof obj =="object"){
		ctrlName=obj;
	}else {
		ctrlName=$id(obj);
	}
	if (typeof blUseTime != "undefined" && (blUseTime == "true" || blUseTime == true))
	    _g_dt2_UseTime = true;
	else
	    _g_dt2_UseTime = false;

	
	//此IF由LIUJP添加，以设置返回的日期格式；
	if (typeof dfrm != "undefined") {
	    dateFrm = dfrm;
	} else {
	    dateFrm = null;
	}

	var tagsName = "";
	try {
	    tagsName = ctrlName.tagName.toUpperCase();
	} catch (e) { }
	
	if(tagsName == "INPUT")	new DateControl20(ctrlName);
//	alert(event.srcElement.value)
}