
var NumEdit = function(id) {
    this.fcNumObj = $id(id);
    this.fontsize = "12px";
    this.fontfamily = "宋体";
    this.fontstyle = "normal";
    this.backgroundColor = "";
    this.color = "black";
    this.fontweight = "bold";
    this.ParentPos = "";
    this.txt = "";
    this.align = "right";
    this.value = "0";
    this.enabled = "否";
    this.display = "block";

    this.Numedit;            //文本框值
    this.upButton;            //上按钮
    this.downButton;          //下按钮
    this.Min = 0; 		 // 最小值 
    this.Max = 32000; 	 //最大值
    this.NextNum = 1;         //加减值
    
    /**
    *是否活动
    **/
   NumEdit.prototype.disabled = function(vValue){
	    //var o = element.id;
	    try{	
	        this.enabled = vValue ;
	        if(typeof this.Numedit != "undefined") {
		        if(this.enabled=="否" || this.enabled==false){
		           // alert(Numedit.parentNode.outerHTML)
			        this.Numedit.disabled = true;
			        this.upButton.disabled = true;
			        this.downButton.disabled = true ;
		        }else {
			        this.Numedit.removeAttribute("disabled");
			        this.upButton.removeAttribute("disabled");
			        this.downButton.removeAttribute("disabled");
		        }
	        }
	    }catch(e){}
    }

    NumEdit.prototype.Init = function() {
        //debugger;
        if (this.fcNumObj.getAttribute("fontsize") != "") this.fontsize = this.fcNumObj.getAttribute("fontsize");
        if (this.fcNumObj.getAttribute("fontfamily") != "") this.fontfamily = this.fcNumObj.getAttribute("fontfamily");
        if (this.fcNumObj.getAttribute("fontstyle") != "") this.fontstyle = this.fcNumObj.getAttribute("fontstyle");
        if (this.fcNumObj.getAttribute("backgroundColor") != "") this.backgroundColor = this.fcNumObj.getAttribute("backgroundColor");
        if (this.fcNumObj.getAttribute("color") != "") this.color = this.fcNumObj.getAttribute("color");
        if (this.fcNumObj.getAttribute("fontweight") != "") this.fontweight = this.fcNumObj.getAttribute("fontweight");
        if (this.fcNumObj.getAttribute("ParentPos") != "") this.ParentPos = this.fcNumObj.getAttribute("ParentPos");
        if (this.fcNumObj.getAttribute("align") != "") this.align = this.fcNumObj.getAttribute("align");
        if (this.fcNumObj.getAttribute("value") != "" && this.fcNumObj.getAttribute("value") != "undefined") this.value = this.fcNumObj.getAttribute("value");
        if (this.fcNumObj.getAttribute("enabled") != "") this.enabled = this.fcNumObj.getAttribute("enabled");
        if (this.fcNumObj.getAttribute("display") != "") this.display = this.fcNumObj.getAttribute("display");

        if (this.fcNumObj.getAttribute("Min") != "" && this.fcNumObj.getAttribute("Min") != "undefined") this.Min = this.fcNumObj.getAttribute("Min");
        if (this.fcNumObj.getAttribute("Max") != "" && this.fcNumObj.getAttribute("Max") != "undefined") Max = this.fcNumObj.getAttribute("Max");
        if (this.fcNumObj.getAttribute("NextNum") != "" && this.fcNumObj.getAttribute("NextNum") != "undefined") this.NextNum = this.fcNumObj.getAttribute("NextNum");
        //debugger;
        var divWidth = this.fcNumObj.style.width;
        var divLeft = "";  //div控件的left坐标
        var divHeight = parseInt(this.fcNumObj.style.height);   //div控件的高度
        var iWidthButton = 14;    //按钮的宽度
        var iHeightButton = 10;   //按钮的高度
        var iHeight = parseInt(divHeight);  //文本框的高度
        var downTop = "";  //down按钮的top坐标
        var divTop = "";
        var inpututil = "px";
        var txtWidth = "";
        if (this.value != this.Min) this.value = this.Min;
        //计算控件的位置
        //debugger;
        if (this.fcNumObj.style.position == "static") {
            var len = divWidth.length;
            if (len != "" || typeof len != "undefined") {
                var s2 = this.fcNumObj.style.width.substring(len - 1, len);
            }
            if (s2 == "%") {
                // modfiy 2010-10-20
                var tmpW = this.fcNumObj.offsetWidth; //parentNode.offsetWidth;
                txtWidth = parseInt(100 * ((tmpW * parseInt(divWidth) / 100) - 26) / tmpW) + "%";  //文本框中Width
                //debugger;
                var mButtonWidth = 14;  //按钮的width
                ButtonLeft = parseInt(this.fcNumObj.clientWidth) + parseInt(getAbsLeft(this.fcNumObj)) - 14;  //按钮的left坐标
                divTop = getAbsTop(this.fcNumObj);   //控件的高度
                downTop = parseInt(divTop) + 11;   //下边按钮的高度
                divLeft = getAbsLeft(this.fcNumObj);   //控件的left坐标
                inpututil = "%";
            } else {

                txtWidth = divWidth;
                mButtonWidth = "14";
                if (this.ParentPos == "相对") {
                    //downTop = parseInt(divTop) + 11;
                    //divLeft = parseInt(this.fcNumObj.style.left);
                    txtWidth = parseInt(divWidth);
                    divLeft = getAbsLeft(this.fcNumObj);
                    divTop = getAbsTop(this.fcNumObj);
                } else {
                    divLeft = getAbsLeft(this.fcNumObj);
                    divTop = getAbsTop(this.fcNumObj);
                }
                //ButtonLeft = parseInt(this.fcNumObj.offsetWidth) + parseInt(this.fcNumObj.style.left) + 4; //-14//parseInt(element.style.left) ;
                ButtonLeft = parseInt(this.fcNumObj.offsetWidth) + parseInt(getAbsLeft(this.fcNumObj)); //;+ 4; //-14//parseInt(element.style.left) ;
                downTop = parseInt(divTop) + 11;
            }
        } else {
            //if(this.fcNumObj.style.position == "absolute") {
            //绝对坐标
            //放在div中
            //debugger
            txtWidth = parseInt(divWidth) - 14;
            //以div的坐标为准
            divTop = 0; //parseInt(this.fcNumObj.style.top) ;
            downTop = divTop + 11;
            divLeft = 0; //parseInt(this.fcNumObj.style.left);
            ButtonLeft = divLeft + txtWidth + 2;
        }
        //debugger;
        var sdisabled = "";
        if (this.enabled == "是" || this.enabled == true) sdisabled = " disabled ";
        //alert(txtWidth);
        var sHtml = "";  // onkeydown='fc_txt_onkeydown(event)'
        sHtml += "<input type='text' " + sdisabled + " value='" + this.value + "' id='Numedit' style='ime-mode:disabled;display:" + this.display + "; POSITION: absolute; width:" + txtWidth + "; left:" + divLeft + "px;  height:" + iHeight + "px; top:" + divTop + "px; TEXT-ALIGN:" + this.align + ";font-size:" + this.fontsize + "; font-style:" + this.fontstyle + "; font-family:" + this.fontfamily + "; background-color:" + this.backgroundColor + "; font-weight:" + this.fontweight + " ; color:" + this.color + ";'>";
        sHtml += "<input type='button' " + sdisabled + " id='upButton' style='display:" + this.display + ";cursor:hand; position:absolute; border:0px; top:" + divTop + "px; left:" + ButtonLeft + "px; height:" + iHeightButton + "px; width:" + iWidthButton + "px; BACKGROUND-COLOR:white;BACKGROUND-IMAGE:url(" + fcpubdata.path + "/fceform/images/ef_run_up.gif);background-position:center; background-repeat:no-repeat;'>";
        sHtml += "<input type='button' " + sdisabled + "  id='downButton' style='display:" + this.display + ";cursor:hand; position:absolute; border:0px; top:" + downTop + "px;  left:" + ButtonLeft + "px; height:" + iHeightButton + "px; width:" + iWidthButton + "px; BACKGROUND-COLOR:white;BACKGROUND-IMAGE:url(" + fcpubdata.path + "/fceform/images/ef_run_down.gif);background-position:center; background-repeat:no-repeat;' >";

        this.fcNumObj.innerHTML = sHtml;
        //alert(this.fcNumObj.innerHTML);
        //modify by liuxr at 2010-11-11 9:40 附加事件时传递当前控件ID作为参数
        var myobj = new Object();
        myobj.objID = id;
        
        // modfiy 2010-10-19 给控件增加事件，兼容浏览器
        NavJs.addEvent(this.fcNumObj.childNodes[0], "onchange", Max_Min,myobj);
        NavJs.addEvent(this.fcNumObj.childNodes[1], "onclick", Numedit_up,myobj);
        NavJs.addEvent(this.fcNumObj.childNodes[2], "onclick", Numedit_down,myobj);
        NavJs.addEvent(this.fcNumObj.childNodes[1], "onmouseup", Button_onblur,myobj);
        NavJs.addEvent(this.fcNumObj.childNodes[2], "onmouseup", Button_onblur,myobj);
        NavJs.addEvent(this.fcNumObj.childNodes[0], "onkeydown", fc_txt_onkeydown,myobj);
        this.Numedit = this.fcNumObj.childNodes[0];
        this.upButton = this.fcNumObj.childNodes[1];
        this.downButton = this.fcNumObj.childNodes[2];
        //debugger;
        if (this.fcNumObj.style.position == "static") {
            var len = divWidth.length;
            if (len != "" || typeof len != "undefined") {
                var s2 = this.fcNumObj.style.width.substring(len - 1, len);
            }
            if (s2 == "%") {
                if (typeof this.Numedit != "undefined") {
                    // Numedit.attachEvent("onresize", buttononresize);
                    //debugger;
                    window.onresize = buttononresize;
                    //addObjectEvent(this.fcNumObj, "onresize", buttononresize);
                }
            }
        }
    }
    //lh add 2010-10-19 增加事件
    function addObjectEvent(obj, eventName, eventFunc) {
        var targetObj = obj; //document.getElementById(objId);
        if (targetObj) {
            if (targetObj.attachEvent) {
                targetObj.attachEvent(eventName, eventFunc);
            }
            else if (targetObj.addEventListener) {
                eventNameeventName = eventName.toString().replace(/on(.*)/i, '$1');
                targetObj.addEventListener(eventNameeventName, eventFunc, true);
            }
        }

    }
    //检查最大值和最小值是否合法。
    function Max_Min() {
        var spinobj;
	    if (typeof this.objID !="undefined" && this.objID != null && this.objID != "") 
	    {
	        spinobj = eval(this.objID);
	    }
	    else
	    {
	        spinobj = this;
	    }
      
        if (parseInt(spinobj.Numedit.value) < spinobj.Min) {
            spinobj.Numedit.value = spinobj.Min;
        }
        if (parseInt(spinobj.Numedit.value) > spinobj.Max) {
            spinobj.Numedit.value = spinobj.Max;
        }
        if (isNaN(parseInt(spinobj.Numedit.value))) {
            spinobj.Numedit.value = "0";
        }
    }

    //减一
    function Numedit_down() {
        var spinobj;
	    if (typeof this.objID !="undefined" && this.objID != null && this.objID != "") 
	    {
	        spinobj = eval(this.objID);
	    }
	    else
	    {
	        spinobj = this;
	    }
	    
        if (parseInt(spinobj.Numedit.value) > spinobj.Min) {
            if (parseInt(spinobj.Numedit.value) - parseInt(spinobj.NextNum) > spinobj.Min) {
                spinobj.Numedit.value = parseInt(spinobj.Numedit.value) - parseInt(spinobj.NextNum);
            } else {
                spinobj.Numedit.value = spinobj.Min;
            }
        } else {
            spinobj.Numedit.value = parseInt(spinobj.Min);
        }
    }

    //加一
    function Numedit_up() {
        var spinobj;
	    if (typeof this.objID !="undefined" && this.objID != null && this.objID != "") 
	    {
	        spinobj = eval(this.objID);
	    }
	    else
	    {
	        spinobj = this;
	    }
	    
        if (parseInt(spinobj.Numedit.value) < spinobj.Max) {
            if (parseInt(spinobj.Numedit.value) + parseInt(spinobj.NextNum) < spinobj.Max) {
                spinobj.Numedit.value = parseInt(spinobj.Numedit.value) + parseInt(spinobj.NextNum);
            } else {
                spinobj.Numedit.value = spinobj.Max;
            }
        } else {
            if (spinobj.Numedit.value == "") {
                spinobj.Numedit.value = parseInt(spinobj.Min);
            } else {
                spinobj.Numedit.value = parseInt(spinobj.Max);
            }
        }
    }

    /**
    *失去焦点
    **/
    function Button_onblur() {
        var spinobj;
	    if (typeof this.objID !="undefined" && this.objID != null && this.objID != "") 
	    {
	        spinobj = eval(this.objID);
	    }
	    else
	    {
	        spinobj = this;
	    }
	
        spinobj.upButton.blur();
        spinobj.downButton.blur();
    }
    function buttononresize() {
        //debugger;
        var tmpW = this.fcNumObj.offsetWidth;
        //alert(tmpW);
        var tmp1 = (tmpW * parseInt(this.fcNumObj.clientWidth) / 100) - 14;
        
        //alert(upButton.offsetWidth);
        if (upButton.offsetWidth != tmp1) {
            this.Numedit.style.width = tmp1;
            this.Numedit.style.left = getAbsLeft(this.fcNumObj);
            this.Numedit.style.top = getAbsTop(this.fcNumObj);
            this.upButton.style.left = 300; // +getAbsLeft(this.fcNumObj);
            this.downButton.style.left = 300; // +getAbsLeft(this.fcNumObj);
            this.upButton.style.top = getAbsTop(this.fcNumObj);
            this.downButton.style.top = parseInt(this.upButton.style.top) + 11;
        }
    }
    function fc_txt_onkeydown(evs) {
        var spinobj;
        var event = getEvent();
	    if (typeof this.objID !="undefined" && this.objID != null && this.objID != "") 
	    {
	        spinobj = eval(this.objID);
	    }
	    else
	    {
	        spinobj = this;
	    }
	    
        var scode = event.keyCode;
        //alert(scode);
        if (scode == "40") {
            spinobj.Numedit_down();
        }
        if (scode == "38") {
            spinobj.Numedit_up();
        }
    }
    
    /**
     * @func 获取Event,同时兼容ie和ff的写法
     * @date 2010-10-18 16:40
    **/
    function getEvent(){
        if(document.all)  return window.event;        
        func=getEvent.caller;            
        while(func!=null)
        {    
            var arg0=func.arguments[0];
            if(arg0)
            {
                if((arg0.constructor==Event || arg0.constructor ==MouseEvent)
                 || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation))
                {    
                    return arg0;
                }
            }
            func=func.caller;
         }
        return null;
    }
}