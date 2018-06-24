
///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

Eform.Skins = function(){}
Eform.Skins.prototype =
{
    preloadImages: function preloadImages(imagesPath) {
        ///<summary>preloading required images</summary>
        /*
        preloads = new Object();
        preloads[0] = new Image(); preloads[0].src = imagesPath + "button_left_xon.gif";
        preloads[1] = new Image(); preloads[1].src = imagesPath + "button_right_xon.gif";
        preloads[2] = new Image(); preloads[2].src = imagesPath + "input_left_xon.gif";
        preloads[3] = new Image(); preloads[3].src = imagesPath + "input_right_xon.gif";
        preloads[4] = new Image(); preloads[4].src = imagesPath + "txtarea_bl_xon.gif";
        preloads[5] = new Image(); preloads[5].src = imagesPath + "txtarea_br_xon.gif";
        preloads[6] = new Image(); preloads[6].src = imagesPath + "txtarea_cntr_xon.gif";
        preloads[7] = new Image(); preloads[7].src = imagesPath + "txtarea_l_xon.gif";
        preloads[8] = new Image(); preloads[8].src = imagesPath + "txtarea_tl_xon.gif";
        preloads[9] = new Image(); preloads[9].src = imagesPath + "txtarea_tr_xon.gif";
        */
    },
    radio_checkbox: function(elType) {
        // var elType = "checkbox";
        var arr = fcpubdata.controls[elType];
        if (typeof (arr) == "undefined" || arr == null) return;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].childNodes.length; j++) {
                var curEle = arr[i].childNodes[j];

                if (curEle.tagName == "SPAN") {
                    if (IsSpace(curEle.className))
                        curEle.className = "ef_" + elType + "_label";
                }
                if (curEle.tagName == "INPUT") {
                    //if (Sys.Browser.agent == Sys.Browser.InternetExplorer)
                    curEle.className = "ef_out";

                    var statu = curEle.checked;
                    var oSpanLabel = curEle.nextSibling;
                    var sDisabledCss = "out";
                    if (curEle.parentNode.disabled) sDisabledCss = "disabled";
                    //var spanHtm = "<span class='ef_input_" + elType + "_" + (statu ? "" : "no") + "check_" + sDisabledCss + "'></span>";
                    var ooSpan = document.createElement("SPAN");
                    ooSpan.className = "ef_input_" + elType + "_" + (statu ? "" : "no") + "check_" + sDisabledCss;
                    var elem = curEle.parentNode.insertBefore(ooSpan, curEle);

                    j++;

                    elem.onclick = function() {
                        //alert();
                        var curObj = NavJs.getEventObj();
                        if (curObj.parentNode.disabled) return;
                        if (curObj.className.indexOf('ef_input') < 0) curObj = curObj.previousSibling.previousSibling; //前两个,curObj为图标对象
                        var obj = curObj.nextSibling; //obj为input对象
                        if (typeof (obj) == "undefined" || obj == null) return;

                        var cls = curObj.className;
                        if (cls.indexOf("no") > -1) {
                            curObj.className = cls.replace("_nocheck_", "_check_");
                            obj.checked = true;
                        } else {
                            if (elType == "checkbox") {
                                curObj.className = cls.replace("_check_", "_nocheck_");
                                obj.checked = false;
                            }
                        }
                        //radio只允许选择一项
                        if (obj.type == "radio") {
                            var radioEl = document.getElementsByName(obj.name);
                            for (var i = radioEl.length; i > 0; i--) {
                                if (radioEl[i - 1].type && radioEl[i - 1].type == "radio") {
                                    radioEl[i - 1].previousSibling.className = radioEl[i - 1].previousSibling.className.replace(/ef_input_radio_[^_]+_(out|over)/, "ef_input_radio_" + (radioEl[i - 1].checked ? "" : "no") + "check_$1");
                                }
                            }
                        }
                        //数据集
                        /*var sDs = curObj.parentNode.dataset ;
                        if(IsSpace(sDs) == false){
                        $id(sDs).cont1_onblur();
                        }*/
                    };


                    elem.onmouseover = function() {
                        this.className = this.className.replace("out", "over");
                    };
                    elem.onmouseout = function() {
                        this.className = this.className.replace("over", "out");
                    }

                    if (oSpanLabel.tagName == "SPAN") {
                        oSpanLabel.onclick = elem.onclick;
                    }

                }
            }
        }
    },
    button: function() {
        if (NavJs.isIpad()) return;
        var arr = fcpubdata.controls["button"];
        if (typeof (arr) == "undefined" || arr == null) return;
        for (var i = 0; i < arr.length; i++) {
            var oButton = arr[i];
            if (IsSpace(oButton.style.backgroundImage) == false || IsSpace(oButton.className) == false) continue;
            this.oneButton(oButton);
        }
    },
    oneButton: function(oButton) {

        var btnWidth = oButton.clientWidth;

        if (btnWidth < 40) btnWidth += 10; //此处为误差调整,以免当有两个汉字时会只显示一个汉字.

        //var btnHeight=oButton.clientHeight;
        var objXY = new Object(); //Sys.UI.DomElement.getLocation(oButton);
        if (oButton.style.position == "absolute") {

            objXY.x = ToInt(oButton.style.left);
            objXY.y = ToInt(oButton.style.top);
            btnWidth = ToInt(oButton.style.width);

        }
        // btnHeight = oButton.style.pixelHeight;

        var sDisplay = "", sDisabled = "";
        if (oButton.style.display == "none") sDisplay = "display:none;";
        if (oButton.disabled) sDisabled = "disabled";
        var oDiv = document.createElement("div");
        //oDiv.setAttribute("style", "cursor:default;" + sDisplay + "position:absolute;top:" + objXY.y + "px;left:" + objXY.x + "px;width:" + btnWidth + "px");
        NavJs.cssText(oDiv, "cursor:default;" + sDisplay + "position:absolute;top:" + objXY.y + "px;left:" + objXY.x + "px;width:" + btnWidth + "px");
        if (oButton.disabled) oDiv.disabled = true;

        var elm = oButton.parentNode.insertBefore(oDiv, oButton);
        var oDiv1 = document.createElement("div");
        oDiv1.className = 'ef_input_button_out';
        NavJs.cssText(oDiv1, 'float:left');
        //oDiv1.setAttribute("style", 'float:left');

        var buttonText = oButton.innerText;
        if (oButton.tagName.toLowerCase() == "input") buttonText = oButton.value; //my add 2013-02-21
        //var lBg = elm.appendChild(document.createElement("<div class='ef_input_button_out' style='float:left'></div>"));
        var lBg = elm.appendChild(oDiv1);
        if (oButton.parentNode.className == "tab-page") {
            lBg.innerHTML = "<div style='float:left;width:5px'></div><div style='width:" + (btnWidth - 10) + "px;float:left;line-height:22px; text-align:center;'>" + buttonText + "</div>";
        } else {
        lBg.innerHTML = "<div style='float:left;width:5px'></div><div style='width:" + (btnWidth - 10) + "px;float:left; text-align:center;'>" + buttonText + "</div>";
        }
        //lBg.innerHTML="<div style='float:left;width:5px'></div><div style='width:"+(btnWidth-10)+"px;float:left; text-align:center;'>"+oButton.value+"</div>";

        var oDiv2 = document.createElement("div");
        oDiv2.className = 'ef_input_button_right_out';
        //oDiv2.setAttribute("style", 'float:left;width:5px');
        NavJs.cssText(oDiv2, 'float:left;width:5px');
        //var rBg = elm.appendChild(document.createElement("<div style='float:left;width:5px'; class='ef_input_button_right_out'></div>"));
        var rBg = elm.appendChild(oDiv2);
        /* 结构
        <DIV class="" id=button1 style="LEFT: 187px; WIDTH: 75px; CURSOR: default; POSITION: absolute; TOP: 107px">
        <DIV class=ef_input_button_out style="FLOAT: left">
        <DIV style="FLOAT: left; WIDTH: 5px"></DIV>
        <DIV style="FLOAT: left; WIDTH: 65px; HEIGHT: 100%; TEXT-ALIGN: center">button1</DIV>
        </DIV>
        <DIV class=ef_input_button_right_out style="FLOAT: left; WIDTH: 5px"></DIV>
        </DIV>
        */
        //下面的写法是为了在事件中能带参数的调用 _button 方法.实现将当前对象this传入到事件中,即能this._button 
        elm.onmouseover = Function.createCallback(Function.createDelegate(this, this._button), ["out", "over"]);
        elm.onmouseout = Function.createCallback(Function.createDelegate(this, this._button), [/over|down/, "out"]); //over或down 变成 out 
        elm.onmousedown = Function.createCallback(Function.createDelegate(this, this._button), ["over", "down"]);
        elm.onmouseup = Function.createCallback(Function.createDelegate(this, this._button), ["down", "over"]);

        elm.onclick = oButton.onclick;
        elm.id = oButton.id;
        oButton.outerHTML = "";
        //oButton.style.display="none";
        //oButton.className = "ef_out";

    },
    _button: function(arr) {
        var class1 = arr[0], class2 = arr[1];
        var obj = NavJs.getEventObj();
        var lBg, rBg;
        if (obj.className.startsWith("ef_input_button_")) {
            lBg = obj; rBg = lBg.nextSibling;
        } else if (obj.className.endsWith("ef_input_button_right_")) {
            lBg = obj.previousSibling; rBg = obj;
        } else if (IsSpace(obj.id) == false && obj.childNodes.length == 2) {
            lBg = obj.childNodes[0];
            rBg = obj.childNodes[1];
        } else {
            lBg = obj.parentNode; rBg = lBg.nextSibling;
        }
        if (lBg != null)
            if (IsSpace(lBg.className) == false) lBg.className = lBg.className.replace(class1, class2);
        if (rBg != null)
            if (IsSpace(rBg.className) == false) rBg.className = rBg.className.replace(class1, class2);
    },
    textbox: function() {
        var arr = fcpubdata.controls["text"];
        if (typeof (arr) == "undefined" || arr == null) return;
        for (var i = 0; i < arr.length; i++) {
            var oText = arr[i];
            Sys.UI.DomElement.addCssClass(oText, "ef_input_text_out");
            oText.onmouseover = function() {
                NavJs.getEventObj().className = NavJs.getEventObj().className.replace("out", "over");
            };
            oText.onmouseout = function() {
                NavJs.getEventObj().className = NavJs.getEventObj().className.replace("over", "out");
            };
        }
    },
    textarea: function() {
        if (fcpubdata.skins == "light") return; //为light时不和textbox一样.
        var arr = fcpubdata.controls["textarea"];
        if (typeof (arr) == "undefined" || arr == null) return;
        for (var i = 0; i < arr.length; i++) {
            var oText = arr[i];
            Sys.UI.DomElement.addCssClass(oText, "ef_input_text_out");
            oText.onmouseover = function() {
                NavJs.getEventObj().className = NavJs.getEventObj().className.replace("out", "over");
            };
            oText.onmouseout = function() {
                NavJs.getEventObj().className = NavJs.getEventObj().className.replace("over", "out");
            };
        }
    },
    label: function() {
        var arr = fcpubdata.controls["label"];
        if (typeof (arr) == "undefined" || arr == null) return;
        for (var i = 0; i < arr.length; i++) {
            var oText = arr[i];
            if (IsSpace(oText)) continue;
            Sys.UI.DomElement.addCssClass(oText, "ef_input_label_out");
            /*
            oText.onmouseover=function(){
            event.srcElement.className=event.srcElement.className.replace("out","over");
            };
            oText.onmouseout=function(){
            event.srcElement.className=event.srcElement.className.replace("over","out");
            };*/
        }
    },

    init: function() {
        //if(fcpubdata.skins == "base") return;
        this.radio_checkbox("radio");
        this.radio_checkbox("checkbox");
        this.button();
        this.textbox();
        this.textarea();
        this.label();
    }
}
if (Type.parse("Eform.Skins") == null) Eform.Skins.registerClass("Eform.Skins");
