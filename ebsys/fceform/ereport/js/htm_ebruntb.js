var curPageNo = 1;  //当前页号
var iPages = 1;   //总页数
var cacheId = ""; //报表的缓存ID
var e_paramid = ""; //报表参数的缓存ID
var oPara = "";  //这个参数供初始化eb_filter表单用
var pubPara = ""; //参数串,这个供后台计算用
var pubBasePara = ""; //url上带好的参数串

var pubMacro = ""; //宏串,这个供后台计算用
var oPageSet = null;
var pubPageSet = ""; //页面设置串
var pubDataSource = ""; //要打开的数据库连接串
var pubDirectRun = "undefined"; //直接打开生成好的报表文件,默认值应为 "undefined" ,因为所有的判断都是此.
var pubPreRunUrl = ""; //上一个运行报表的URL,用于保存报表结果中
var isFromDb = parent.Request.QueryString("fromdb").toString();
if (IsSpace(isFromDb)) {
    ReadConfig(); //读econfig.xml中的配置信息
    isFromDb = fcpub.fromdb;
}

/**
* 运行报表
*@param sTag = 改变参数/改变页面设置/翻页/刷新/初始进入/带参初始进入/强行分页运行/保存
*@param sSaveFileName = 要保存报表运行结果的主文件名
*@param EventAfterSave = 运行报表后的事件,应为function型
*@date 2006-04-18
**/
function RunReport(pageno, sTag, sSaveFileName, EventAfterSave) {

    EbiaoEnterStatus(function(bRun) {
        if (!bRun) {
            //关闭当前窗口
            history.go(-1);
            parent.close();
            return;
        }



        var oXml = parent.oPubXmlFile;
        var spath = parent.sPubPath;
        pubDataSource = oXml.documentElement.getAttribute("e_datasource");
        //}

        //找到运行报表URL后面带的宏值串 no use
        /* 
        var sXml1  = oXml.documentElement.getAttribute("e_macrosbak"); 
        if(IsSpace(sXml1)==false){
        var oX = SetDom("<root>"+unescape(sXml1)+"</root>");
        var newPara="";
        for(var i=0;i<oX.documentElement.childNodes.length;i++){
        var macroName = oX.documentElement.childNodes(i).childNodes(0).text;
        var macroValue = parent.Request.QueryString(macroName).toString();
        if(IsSpace(macroValue)==false){
        newPara += "&"+macroName+"="+escape(macroValue);
        }
        }
        pubMacro = newPara;
        }*/
        //设置打印参数
        if (oPageSet == null) {
            oPageSet = new Object();
            oPageSet.e_page_style = oXml.documentElement.getAttribute("e_page_style");
            oPageSet.e_print_layout_index = oXml.documentElement.getAttribute("e_print_layout_index");
            oPageSet.e_header_footer_setup = oXml.documentElement.getAttribute("e_header_footer_setup");
            oPageSet.e_page_size = oXml.documentElement.getAttribute("e_page_size");
            oPageSet.e_rows_per_page = oXml.documentElement.getAttribute("e_rows_per_page");
            oPageSet.e_print_layout_row = oXml.documentElement.getAttribute("e_print_layout_row");
            oPageSet.e_print_layout_col = oXml.documentElement.getAttribute("e_print_layout_col");
            oPageSet.e_paper_width = oXml.documentElement.getAttribute("e_paper_width");
            oPageSet.e_paper_height = oXml.documentElement.getAttribute("e_paper_height");
            oPageSet.e_paper_margin_left = oXml.documentElement.getAttribute("e_paper_margin_left");
            oPageSet.e_paper_margin_top = oXml.documentElement.getAttribute("e_paper_margin_top");
            oPageSet.e_paper_margin_right = oXml.documentElement.getAttribute("e_paper_margin_right");
            oPageSet.e_paper_margin_bottom = oXml.documentElement.getAttribute("e_paper_margin_bottom");
            oPageSet.e_columns = oXml.documentElement.getAttribute("e_columns");
            oPageSet.e_page_orientation = oXml.documentElement.getAttribute("e_page_orientation");
            oPageSet.e_printer_name = oXml.documentElement.getAttribute("e_printer_name");
        }
        if (pubDirectRun != "undefined") { //直接显示计算好的报表文件
            var sSetPages = parent.Request.QueryString("e_pages").toString();
            var iSetPages = parseInt(sSetPages);
            if (isNaN(iSetPages) == false) {
                iPages = iSetPages;
                _InitPageNo();
            }
            //alert(parent.sPubPath);
            open(_getExpFilePath() + "_1.htm", "topic");
            _CloseShow();
            return;
        }

        if (sTag == "带参初始进入" || sTag == "改变参数" || sTag == "从参数表单上运行") {
            if (sTag == "带参初始进入" && parent.sPubPerRun != "是") {
                return;
            }
            if (sTag == "改变参数" && parent.sPubUrlPara == "yes") {
                return;
            }
            //if(sTag == "带参初始进入"){
            //表示直接在url上带好了报表参数
            //"?file=/webbill/ebfile/s_参数表单.htm&urlpara=yes&startdate=2005-02-01"
            var s1 = parent.location.search;
            if (s1.length > 0) {
                s1 = s1.substring(1, s1.length);
                var s2 = parent.Request.QueryString("file").toString();
                if (IsSpace(s2) == false) {
                    s1 = RepStr(s1, "file=" + escape(s2), "");
                }
                var s2 = parent.Request.QueryString("name").toString();
                if (IsSpace(s2) == false) {
                    s1 = RepStr(s1, "name=" + escape(s2), "");
                }
                s1 = RepStr(s1, "urlpara=yes", "");
                s1 = RepStr(s1, "&&", "&");
                // 去掉尾部的&
                if (s1.substring(s1.length - 1, s1.length) == "&") {
                    s1 = s1.substring(0, s1.length - 1);
                }
                if (s1.length > 0) {
                    //保存开头有&
                    if (s1.substring(0, 1) != "&") {
                        s1 = "&" + s1;
                    }
                    //防止参数值中有汉字时,所以将参数值全部escape一下.

                    var sActedParam = "";
                    var arrP = s1.split("&");
                    for (var k = 1; k < arrP.length; k++) {
                        var sGroup = arrP[k];
                        var arrS = sGroup.split("=");

                        if (fcpubdata.dotnetVersion == "") arrS[1] = escape(arrS[1]);

                        sActedParam += "&" + arrS[0] + "=" + arrS[1]; //escape(arrS[1])
                    }
                    s1 = sActedParam;
                }
                pubBasePara = s1; //这个供后台计算用
                cacheId = "";  //修改参数后应清空cacheId
            }
            //}
            if (parent.sPubUrlPara != "yes") {  //表示还需要由用户输入参数值
                if (parent.sPubDjContent == "") { //没有参数表单时
                    var sXml = "";
                    if (sTag == "改变参数" && oPara != "") {
                        sXml = oPara;
                    } else {
                        sXml = oXml.documentElement.getAttribute("e_argsbak");
                    }
                    if (IsSpace(sXml) == false) {
                        if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
                            var sRet = DjOpen("eb_filter", sXml, "展现", "有模式窗口", "直接", "输入报表参数");
                            if (IsSpace(sRet) == false) {
                                var sX = unescape(sRet);
                                var oX = SetDom("<root>" + sX + "</root>");
                                var newPara = "";
                                for (var i = 0; i < oX.documentElement.childNodes.length; i++) {
                                    var tmp1 = "&" + NavJs.getNodeValue11(oX, i, 0) + "=";
                                    //只有当url中不含有此参数的值时才加入
                                    if (pubBasePara.indexOf(tmp1) < 0) {
                                        var tempParamValue = escape(NavJs.getNodeValue11(oX, i, 5));
                                        if (fcpubdata.dotnetVersion == "") tempParamValue = escape(tempParamValue);
                                        newPara += "&" + NavJs.getNodeValue11(oX, i, 0) + "=" + tempParamValue;
                                    }
                                }
                                oPara = sRet; //这个参数供初始化eb_filter表单用
                                pubPara = newPara; //这个供后台计算用
                                cacheId = "";  //修改参数后应清空cacheId
                            } else {
                                return;
                            }
                        }
                    }
                } else { //从参数表单上
                    if ($win("filter", parent) == null) {
                        if (sTag != "从参数表单上运行") {
                            //var old = pubPara;
                            EbiaoShowModalParaWin(parent);
                            return;
                            //if(old == pubPara) return; //参数没变时(点关闭窗口)不运行报表.
                        }
                    } else {
                        //因为异步的问题,无法从表单界面上合成报表参数的默认值去运行报表.
                        //下面的命令第一次运行时可能会因异步的原因而出错,所以try
                        if (sTag == "从参数表单上运行") {
                            $win("filter", parent).eval("try{ ActEbiaoPara();}catch(e){}");
                        }
                    }
                }


            }

            //删除重复参数值 2009-01-08 add
            var sb = new Sys.StringBuilder();
            var arr1 = pubPara.split("&");
            var arr2 = pubBasePara.split("&");
            for (var i = arr1.length - 1; i >= 0; i--) {
                var arr1Sub = arr1[i].split("=");
                for (var j = arr2.length - 1; j >= 0; j--) {
                    var arr2Sub = arr2[j].split("=");
                    if (arr1Sub[0].toUpperCase() == arr2Sub[0].toUpperCase()) {
                        if (sTag == "从参数表单上运行") { //表示以pubPara为准
                            Array.removeAt(arr2, j);
                        } else {
                            Array.removeAt(arr1, i);
                            break;
                        }
                    }
                }
            }
            pubPara = arr1.join("&");
            if (arr1.length == 1 && pubPara.length > 0) pubPara = "&" + pubPara;
            pubBasePara = arr2.join("&");
            if (arr2.length == 1 && pubBasePara.length > 0) pubBasePara = "&" + pubBasePara;
            //______________________

        }

        //控制显示报表结果时,横向和纵向只有一个方向分页,另一个方向不分页
        var s_e_paper_width = parent.Request.QueryString("e_paper_width").toString();
        var s_e_paper_height = parent.Request.QueryString("e_paper_height").toString();
        var sMaxValue = "-1";
        if (s_e_paper_width == sMaxValue || s_e_paper_height == sMaxValue) {
            pubPageSet = "&pageset=";
            for (propName in oPageSet) {
                if (typeof (EventAfterSave) == "function") {
                    pubPageSet += propName + ":" + oPageSet[propName] + ";";
                } else {
                    if ((s_e_paper_width == sMaxValue && propName == "e_paper_width") || (s_e_paper_height == sMaxValue && propName == "e_paper_height")) {
                        pubPageSet += propName + ":" + sMaxValue + ";";
                    } else if (propName == "e_paper_height" && oPageSet["e_page_size"] != "13") { //13为自定义
                        var sHeight = "297";
                        var sPageSize = oPageSet["e_page_size"];

                        if (sPageSize == "1") sHeight = "841";
                        if (sPageSize == "2") sHeight = "594";
                        if (sPageSize == "3") sHeight = "420";
                        if (sPageSize == "4") sHeight = "297";
                        if (sPageSize == "5") sHeight = "210";

                        if (sPageSize == "6") sHeight = "1000";
                        if (sPageSize == "7") sHeight = "707";
                        if (sPageSize == "8") sHeight = "500";
                        if (sPageSize == "9") sHeight = "353";
                        if (sPageSize == "10") sHeight = "250";

                        if (sPageSize == "11") sHeight = "1189";
                        if (sPageSize == "12") sHeight = "1414";
                        if (sPageSize == "14") sHeight = "364";
                        if (sPageSize == "15") sHeight = "257";
                        pubPageSet += propName + ":" + sHeight + ";";
                    } else if (propName == "e_page_size") {
                        pubPageSet += propName + ":" + "13" + ";";
                    } else {
                        pubPageSet += propName + ":" + oPageSet[propName] + ";";
                    }
                }
            }

        }
        //alert(pubPageSet);
        //页面设置信息
        if (sTag == "改变页面设置") {
            if (Sys.Browser.agent != Sys.Browser.InternetExplorer) {
                alert("只有在IE中才有此功能！");
                return;
            }
            var oo = DjOpen("eb_pageset", oPageSet, "展现", "有模式窗口", "直接", "页面设置");
            if (IsSpace(oo) == false) {
                oPageSet = oo;
                pubPageSet = "&pageset=";
                for (propName in oPageSet) {
                    pubPageSet += propName + ":" + oPageSet[propName] + ";";
                }
                //cacheId = "" ;
            } else {
                return;
            }
        }



        if (sTag == "刷新") cacheId = "";

        var ooWin = null;
        if (!fcpub.twoRunReport && sTag != "保存") {
            ooWin = getEbWin();
            if (ooWin != null) {
                //ooWin.document.body.innerHTML = "<table width='100%' height='100%' id=waitTable ><tr><td valign=middle align=center style='color:red'><img src='../../fceform/images/ef_wait.gif'> 正在计算报表...<td><tr></table>";
                if (Sys.Browser.agent != Sys.Browser.Firefox) ooWin.document.write("<table width='100%' height='100%' id=waitTable ><tr><td valign=middle align=center style='color:red'><img src='../../fceform/images/ef_wait.gif'> 正在计算报表,请稍候...<td><tr></table>");
            }
        }

        if (sTag != "翻页" && sTag != "保存") {  //保存时界面不能动
            curPageNo = 1;
            pageno = 1;
            if (sTag != "强行分页运行") {
                //指定页号或不分页,页号=-2为不分页
                var sUrlPageNo = parent.Request.QueryString("e_pageno").toString();
                if (sUrlPageNo != "undefined") {
                    var iUrlPageNo = parseInt(sUrlPageNo);
                    if (isNaN(iUrlPageNo) == false) {
                        pageno = iUrlPageNo;
                        if (iUrlPageNo > 0) {
                            curPageNo = iUrlPageNo;
                        }

                    }
                }
            }
        }
        var sAspxUrl = "";
        if (sTag == "保存" && pubPreRunUrl != "") {
            sAspxUrl = pubPreRunUrl + "&e_runsavefile=" + sSaveFileName;
        } else {
            sAspxUrl = getUrl("run", spath, pageno);
            if (sTag != "翻页") pubPreRunUrl = sAspxUrl;
        }
        //将报表参数改为用XML数据传到后台
        var xmlParams = pubBasePara + pubPara + pubMacro; //pubBasePara参数在URL上和POST中都要,

        xmlParams = "<params>" + RepStr(xmlParams, "&", "&amp;") + "</params>";


        //异步运行报表.
        new Eapi.RunAjax().sendHttp(sAspxUrl, xmlParams, function(result) {

            //"<ds>"+getDataSourceInfo(pubDataSource)+"</ds>"

            var href = result.value;
            if (IsSpace(href) == false) {
                var arr = href.split(",,,");
                if (arr.length >= 6) {
                    cacheId = arr[0];
                    //var ooWin1 = getEbWin(); || (sTag == "翻页" && parent.Request.QueryString("e_pageno").toString() == "-1" && ooWin1.document.body == null)
                    if ((sTag != "翻页" && sTag != "保存")) {
                        iPages = parseInt(arr[1]); //总页数
                        //alert(iPages);
                        var olblPage = $id("lblPage");
                        if (olblPage != null) {
                            olblPage.innerText = "总页数:" + arr[1]; //
                        }
                        var ocboPage = $id("cboPage");
                        if (ocboPage != null) {
                            _InitPageNo();
                            //ocboPage = $id("cboPage");
                            ocboPage.selectedIndex = 0;
                            //取URL中的页号,来控制页号下拉列表的显示.
                            var sUrlPageNo = parent.Request.QueryString("e_pageno").toString();
                            if (sUrlPageNo != "undefined") {
                                var iUrlPageNo = parseInt(sUrlPageNo);
                                if (isNaN(iUrlPageNo) == false) {
                                    tmpPageNo = iUrlPageNo;
                                    if (iUrlPageNo > 0) {
                                        curPageNo = iUrlPageNo;
                                        ocboPage.selectedIndex = curPageNo - 1;
                                    }

                                }
                            }

                        }
                    }
                    if (arr[2] == "") {
                        e_paramid = arr[3]; //报表参数ID
                        //输出报表的运行结果
                        //                        if (arr[4] == "href") { //no use 后台程序中已去掉此.
                        //                            var sHtmlUrl = location.protocol + "//" + location.host + arr[5];
                        //                            if (parent.topic == null && parent.filter != null) { //在iframe中显示
                        //                                parent.filter.document.getElementById("fcebTopic").src = sHtmlUrl;
                        //                            } else {
                        //                                open(sHtmlUrl, "topic");
                        //                            }
                        //                        }

                        if (arr[4] == "html") { //直接输出html内容
                            var sHtml = arr[5];

                            for (var i = 6; i < arr.length; i++) { //防止HTML的内容中也出现,,,的分隔符
                                sHtml += ",,," + arr[i];
                            }
                            var isHideWin = false;
                            if (parent.Request.QueryString("e_pageno").toString() == "-1") {
                                if (sTag == "翻页") isHideWin = true;
                            }
                            if (parent.Request.QueryString("e_paper_width").toString() == "-1") {
                                if (typeof (EventAfterSave) == "function") isHideWin = true;
                            }
                            //alert(isHideWin);
                            var ooWin = getEbWin(isHideWin);
                            if (ooWin == null) {
                                _CloseWait(result);
                                //debugger
                                alert("显示报表结果的窗口不存在!");
                                return;
                            }

                            //                            var scripts = [fcpubdata.path + "/fceform/js/MicrosoftAjax.js", fcpubdata.path + "/fceform/js/fcpub.js"];
                            //                            var heads = ooWin.document.getElementsByTagName("head");
                            //                            if (heads.length > 0) {
                            //                                for (var i = 0; i < scripts.length; ++i) {
                            //                                    var script = ooWin.document.createElement("script");
                            //                                    //script.charset="gb2312";
                            //                                    script.src = scripts[i];
                            //                                    heads[0].appendChild(script);
                            //                                }
                            //                            } else { 
                            //                                alert(12)
                            //                            }

                            ooWin.document.open();
                            //ooWin.document.writeln("<script src='../../fceformext/flash/FusionCharts.js'></" + "script>");
                            //ooWin.document.writeln("<script src='../../fceform/js/MicrosoftAjax.js'></" + "script>");
                            //ooWin.document.writeln("<script src='../../fceform/js/fcpub.js'></" + "script>");

                            ooWin.document.writeln("<!DOCTYPE html><html xmlns=\"http://www.w3.org/1999/xhtml\"><head><meta http-equiv=\"X-UA-Compatible\" content=\"IE=EmulateIE8\" />");
                            ooWin.document.writeln("<STYLE> td { word-break: break-all;overflow:hidden;}</STYLE>");
                            ooWin.document.writeln("<STYLE> @import url(../css/skins/" + fcpubdata.skins + "/style/efskin.css); </STYLE>");
                            ooWin.document.writeln("</head>");
                            ooWin.document.writeln(sHtml);
                            ooWin.document.writeln("</html>");
                            ooWin.document.close();

                            //                            ooWin.document.body.insertAdjacentHTML("afterBegin", sHtml);

                            //parent.document.all.topic.height = parent.oTopic.style.height;
                            //alert(parent.document.frames("topic").document.body.offsetHeight);
                            //ooWin.attachEvent('onresize', ebrun_win_onresize);
                            if (parent.Request.QueryString("e_pageno").toString() == "-1") { //|| parent.Request.QueryString("e_paper_width").toString() == "-1"

                                var ooWin1 = getEbWin(true);
                                if (ooWin1.document.body == null) {
                                    fcpub.twoRunReport = true;
                                    MovePage(3); //移到第一页,即开始时打印的是第一页
                                    //fcpub.twoRunReport = false;
                                }
                            }

                        }
                        //在iframe中透明的处理
                        if ($win("topic", parent) == null && $win("filter", parent) != null) { //在iframe中显示
                            if ($win("filter", parent).document.getElementById("fcebTopic").allowTransparency) { //iframe透明
                                var oWinIframe = $win("fcebTopic", $win("filter", parent));
                                oWinIframe.document.onreadystatechange = function() {
                                    if (oWinIframe.document.readyState == "complete") {
                                        oWinIframe.document.body.style.backgroundColor = "transparent";
                                    }
                                }
                                if (oWinIframe.document.readyState == "complete") {
                                    oWinIframe.document.body.style.backgroundColor = "transparent";
                                }
                            }
                        }

                        //报表运行结束
                        var hEnd = parent.parent.HandleAfterInitReport; //加上HandleAfterInitReport事件.
                        //alert(hEnd)
                        if (typeof hEnd == "function") {
                            hEnd(_AfterRunRpt(arr[5]));
                        }
                        if (typeof EventAfterSave == "function") {
                            EventAfterSave(_AfterRunRpt(arr[5]));
                        }

                    } else {
                        _CloseWait(result);
                        alert(arr[2]); //错误信息
                    }
                } else {
                    _CloseWait(result);
                    alert(href);
                }
            }
            _CloseShow();
        }, ooWin); //内置函数结束
    });                                                          //内置函数结束
    function _CloseWait(result) {
        //去除等待信息
        if (result.context != null) {
            result.context.document.open();
            result.context.document.write("");
            result.context.document.close();
        }

    }
    function _AfterRunRpt(sRetValue) {
        var oReturnValue = new Object();
        oReturnValue.pages = iPages; //保存总页数给事件.
        oReturnValue.value = sRetValue; //返回的参数与宏值.
        return oReturnValue;
    }
    function _CloseShow() {
        if (parent.iRunWait == 1) {
            //parent.execScript('try{new Eapi.Str().showWait("end");}catch(e){}');
            parent.iRunWait = 2;

        } else {
            //new Eapi.Str().showWait("end");
        }
    }
    function _InitPageNo() {
        var sOption = "";
        for (var i = 0; i < iPages; i++) sOption += "<option>" + (i + 1) + "</option>";
        $id("cboPage").outerHTML = "<select id='cboPage' onchange='cboPage_onchange()'>" + sOption + "</select>";

    }
}
/**
* 计算静态的报表文件的路径.
*@date 2007-08-03
**/
function _getExpFilePath() {
    var sHtmlUrl = fcpubdata.path;
    if (pubDirectRun == "yes") {
        var sTmp = parent.sPubPath;
        sTmp = sTmp.substring(0, sTmp.length - 4); // remove .htm
        sTmp = RepStr(sTmp, "/", ",");
        sHtmlUrl += fcpub.expFilePath + sTmp; //此处是URL路径,不是后台文件的路径
    } else {
        sHtmlUrl += fcpub.tempFilePath + pubDirectRun;
    }
    return sHtmlUrl;

}
/**
* index =1 2 3 4 分别是上一页,下一页,第一页,最后一页
*@date 2006-05-24
**/
function MovePage(index) {
    switch (index) {
        case 1: 
            {
                if (curPageNo > 1) {
                    curPageNo--;
                    _MovePageAction();
                }
                break;
            }
        case 2: 
            {
                if (curPageNo < iPages) {
                    curPageNo++;
                    _MovePageAction();
                }
                break;
            }
        case 3: 
            {
                curPageNo = 1;
                _MovePageAction();
                break;
            }
        case 4: 
            {
                curPageNo = iPages;
                _MovePageAction();
                break;
            }
    }
    var ocboPage = $id("cboPage");
    if (ocboPage != null) {
        ocboPage.selectedIndex = curPageNo - 1;
    }

}
function cboPage_onchange() {
    curPageNo = $id("cboPage").selectedIndex + 1;
    _MovePageAction();
}
function _MovePageAction(callback) {
    if (pubDirectRun != "undefined") {
        open(_getExpFilePath() + "_" + curPageNo + ".htm", "topic");
    } else {
        if (typeof (callback) == "function") {
            RunReport(curPageNo, "翻页", "", callback);
        } else {
            RunReport(curPageNo, "翻页");
        }
    }
}
/**
* 返回显示报表结果的窗口
* isHideWin != true 是在显示报表运行结果时调用,而不是在打印时调用.
*@date 2007-08-02
**/
function getEbWin(isHideWin) {
    var ooWin = $win("topic", parent);
    if (ooWin == null && $win("filter", parent) != null) { //在iframe中显示
        try {
            ooWin = $win("fcebTopic", $win("filter", parent));
        } catch (e) { }
    }
    if (Sys.Browser.agent == Sys.Browser.InternetExplorer && isHideWin == true) { //&& (parent.Request.QueryString("e_pageno").toString() == "-1") || parent.Request.QueryString("e_paper_width").toString() == "-1"
        if (ooWin.document.getElementById("fcebPrintWin") == null) {
            var sIframe = '<iframe id=fcebPrintWin name=fcebPrintWin style="WIDTH:0; height:0;" ></iframe>';
            //ooWin.document.body.insertAdjacentHTML("BeforeEnd", sIframe);
            NavJs.insertHtml("BeforeEnd", ooWin.document.body, sIframe)
        }
        ooWin = ooWin.frames["fcebPrintWin"];
    }

    return ooWin;
}
/**
*@param index=1 表示打印预览 =2 表示打印 =3 表示直接打印 =4 表示打印所有页
**/
function Print(index) {
    if (index == 4) return PrintSub(index);
    if (parent.Request.QueryString("e_paper_width").toString() == "-1") {
        _MovePageAction(function() {
            return PrintSub(index);
        })
        //} else if (parent.Request.QueryString("e_pageno").toString() == "-1") { 

    } else {
        return PrintSub(index);
    }
}
function PrintSub(index) {
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer) {
        alert("只有在IE中才有此功能！");
        return;
    }

    var ooWin = getEbWin(parent.Request.QueryString("e_paper_width").toString() == "-1" || parent.Request.QueryString("e_pageno").toString() == "-1");
    if (ooWin.document.body == null) {
        alert("还没有产生要打印的数据,请稍等一会后再试!");
        return;
    }
    var oPrint = getPrintCom(ooWin, oPageSet);
    if (oPrint == null) {
        var iReg = DjOpen('eb_regprint', '', '展现');
        if (iReg == 2) {

            var sPrint = "<object ID='WebBrowser1' WIDTH=0 HEIGHT=0 CLASSID='CLSID:8856F961-340A-11D0-A96B-00C04FD705A2'></object> ";
            //ooWin.document.body.insertAdjacentHTML("BeforeEnd", sPrint);
            NavJs.insertHtml("BeforeEnd", ooWin.document.body, sPrint)
            var oWB = ooWin.document.getElementById("WebBrowser1");
            if (index == 1)
                oWB.ExecWB(7, 1); //打印预览
            else
                oWB.ExecWB(6, 1); //打印


        } else if (iReg == 3) {
            ooWin.print();
        }
        return;
    }
    if (oPrint.defaultPrinterName.length == 0) {
        alert("请先安装打印机，再执行此功能！");
        return;
    }
    if (index == 1) oPrint.Preview();
    if (index == 2) oPrint.Print();
    if (index == 3) oPrint.Print(true);

    if (index == 4 || index == 5) {
        var pubPageSetNew = "";
        if (index == 5) { //弹出窗口后再成批打印

            var oo = DjOpen("eb_pageset", oPageSet, "展现", "有模式窗口", "直接", "页面设置");
            if (IsSpace(oo) == false) {
                oPageSet = oo;

                for (propName in oPageSet) {
                    pubPageSetNew += propName + ":" + oPageSet[propName] + ";";
                }
                pubPageSetNew = RepXml(pubPageSetNew);
            } else {
                return;
            }
        }
        //打印保存好的报表结果页面
        if (pubDirectRun != "undefined") {
            var sSetPages = parent.Request.QueryString("e_pages").toString();
            var totalPages = parseInt(sSetPages);
            if (isNaN(totalPages) == false) {
                fcpub.oPageSet = oPageSet;
                fcpub.batchPrintUrlArr = new Array();
                for (var i = 0; i < totalPages; i++) {
                    fcpub.batchPrintUrlArr[i] = _getExpFilePath() + "_" + (i + 1) + ".htm";
                }
                printNextJob(0);
            }

        } else {

            //打印所有页
            var sGen = ""; //文件名由后台临时生成.
            //计算参数
            var sCurParams = "";
            var sAllParams = pubBasePara + pubPara;
            if (sAllParams != "") {
                var arrP = sAllParams.split("&");
                for (var j = 0; j < arrP.length; j++) {
                    if (IsSpace(arrP[j])) continue;
                    var arrP1 = arrP[j].split("=");
                    if (IsSpace(arrP1[0])) continue; //如参数名为空
                    sCurParams += "<p><name>" + arrP1[0] + "</name><value>" + arrP1[1] + "</value></p>";
                }
            }
            var sRate = oPageSet.e_print_rate;
            if (IsSpace(sRate)) sRate = "";
            var sPageNoArea = oPageSet.e_pageno_area;
            if (IsSpace(sPageNoArea)) sPageNoArea = "";

            var sXml = "<filenames><fn><in>" + parent.sPubPath + "</in><out>" + sGen + "</out><params>" + sCurParams + "</params><rate>" + sRate + "</rate><pagenoarea>" + sPageNoArea + "</pagenoarea><pageset>" + pubPageSetNew + "</pageset></fn></filenames><paths><gen>/ebtmpfile/printtemp/</gen><fromdb>" + isFromDb + "</fromdb><exptype>htm</exptype></paths>";

            //alert(sXml);
            //CopyToPub(sXml);
            batchPrint(sXml, oPageSet);
        }
    }


}
/**
* 打印一个url
*@date 2007-05-15
**/
/*function PrintUrl(sHref,notPrint) {
var oWin = getEbWin();
if(oWin.document.getElementById && oWin.document.all && sHref){
//if(!oWin.oPrintElm){
var aHeads = oWin.document.getElementsByTagName('HEAD');
if(!aHeads || !aHeads.length)
return false;
//if(!oWin.oPrintElm)
oWin.oPrintElm = oWin.document.createElement('LINK');
oWin.oPrintElm.rel = 'alternate'; //'alternate';
oWin.oPrintElm.media = 'print';
aHeads[0].appendChild(oWin.oPrintElm);
//}
oWin.oPrintElm.href = sHref;
		
oWin.focus();    
		
if(typeof(notPrint) == "undefined") {
//oWin.parent.fcpubdata.keyValue += oWin.oPrintElm.href+" = "+(new Date()).getTime()+"\r\n";
oWin.oFcsoftPrint.Print(true);	  //利用了插件的打印预览的功能   
//oWin.parent.fcpubdata.keyValue += oWin.oPrintElm.href+" end= "+(new Date()).getTime()+"\r\n";
//oWin.oPrintElm.href ="";
aHeads[0].removeChild(oWin.oPrintElm); //
		    
}
return true;
}
else return false;
}*/
/**
* 导出为Excel文件,bPageBreak=true 表示分页导出到excel文件中,即一页导出为一个excel文件的sheet.
* bPageBreak=false 表示将整个报表导出为一个sheet.
**/
function SaveasExcel(bPageBreak) {
    var sTag = "saveasExcelAll";
    if (bPageBreak) sTag = "saveasExcel";
    var spath = parent.sPubPath; //parent.Request.QueryString("file").toString();
    //if(typeof pageno == "undefined"){
    var sAll = getUrl(sTag, spath, 1);
    //alert(sAll)
    open(sAll, "");
    //}else{
    //	open(getUrl(sTag,spath,pageno),"");
    //}


}
/**
* 导出为pdf文件
**/
function SaveasPdf() {
    var spath = parent.sPubPath; //parent.Request.QueryString("file").toString();
    var sAll = getUrl("saveasPdf", spath, 1);
    //alert(sAll);
    open(sAll, "");


}
/**
*@param sKey = 运行报表还saveasPdf等参数
*@param sPath 报表文件
*@param pageno 开始页号
**/
function getUrl(sKey, sPath, pageno) {
    //运行报表的URL串

    var sFromDb = "";
    if (isFromDb == "yes") {
        if (pubBasePara.indexOf("&fromdb=yes") < 0)
            sFromDb += "&fromdb=yes";
        sFromDb += "&dbtype=" + fcpubdata.databaseTypeName;
    }

    //只有在IE下才能固定行列显示
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer) {
        if (pubBasePara.indexOf("&e_fixrowcol=1") >= 0) {
            pubBasePara = RepStr(pubBasePara, "&e_fixrowcol=1", "&e_fixrowcol=0");
        } else if (pageno == -1) {
            pubBasePara += "&e_fixrowcol=0";
        }
    }

    if (fcpubdata.dotnetVersion == "") sPath = escape(sPath);



    sPath = escape(sPath);
    //alert(pubPara);
    //	return "http://localhost/webbill/eformaspx/RunReport.aspx?key="+sKey+"&spath="+sPath+"&pageno="+pageno+"&cacheid="+cacheId+pubPara+"&datasources="+escape(escape(oXml.documentElement.childNodes(0).xml))+pubPageSet ;
    return location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=" + sKey + "&spath=" + sPath + "&tempfilepath=" + escape(fcpub.tempFilePath) + sFromDb + "&pageno=" + pageno + "&cacheid=" + cacheId + "&e_paramid=" + e_paramid + pubBasePara + pubPageSet; // + pubPara + pubMacro
    //sDs需要两个escape是因为一个会被.net自动去掉.而其中又会有空格.
}
/**
* 强行分页运行报表,暂时如此,做好此应在RunReport中加一个callback的事件回调.
*@date 2007-07-24 nouse
**/
function PageRunReport() {
    var sUrlPageNo = parent.Request.QueryString("e_pageno").toString();
    if (sUrlPageNo == "-2") {
        if (curPageNo == 1) RunReport(curPageNo, "强行分页运行");
    }

}
/**
* e表运行工具栏的按钮的主调用程序
*@param sTag = firstpage/prevpage
*@date 2007-08-03
**/
function ebRunToolbarMain(sTag) {

    if (pubDirectRun != "undefined") {
        if (pubDirectRun == "yes") {
            var sTmp = parent.sPubPath;
            sTmp = sTmp.substring(0, sTmp.length - 4); // remove .htm
            sTmp = RepStr(sTmp, "/", ",");
            var sHtmlUrl = fcpub.expFilePath + sTmp;
        } else {
            var sHtmlUrl = fcpub.tempFilePath + pubDirectRun;
        }
        switch (sTag) {
            case "expexcel":
                open(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=loadFileStream" + "&spath=" + sHtmlUrl + ".xlt", "");
                break;
            case "expexcelall":

                open(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=loadFileStream" + "&spath=" + sHtmlUrl + ".xls", "");
                break;
            case "exppdf":
                //alert(event.srcElement.parentNode.outerHTML);
                open(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=loadFileStream" + "&spath=" + sHtmlUrl + ".pdf", "");

                break;
        }

    } else {
        switch (sTag) {
            case "expexcel":
                SaveasExcel(true);
                break;
            case "expexcelall":
                SaveasExcel(false);
                break;
            case "exppdf":
                SaveasPdf();
                break;
        }
    }
}
//expexcel: ["导出当前页到excel文件中", "../images/eb_excelone.gif", false, 'saveasExcel(curPageNo)'],

var btnList = { //所有按钮的列表
    firstpage: ["第一页", "eb_firstpage", false, 'MovePage(3)'],
    prevpage: ["上一页", "eb_prevpage", false, 'MovePage(1)'],
    nextpage: ["下一页", "eb_nextpage", false, 'MovePage(2)'],
    lastpage: ["最后一页", "eb_lastpage", false, 'MovePage(4)'],
    preview: ["打印预览", "djpreview", false, 'Print(1);'],
    print: ["打印", "eb_print", false, 'Print(2)'],
    printdirect: ["直接打印", "eb_printdirect", false, 'Print(3)'],
    printalldirect: ["直接打印所有页", "eb_printall", false, 'Print(4)'],
    printall: ["打印所有页", "eb_printall", false, 'Print(5)'],

    //	savereport: ["保存报表输入的条件", "../images/ef_design_save.gif", false, 'Add("save")'],
    //	email: ["发邮件", "../images/ef_run_mail.gif", false, 'DjOpen("TTsendemail",parent.topic.document.body.outerHTML,3,"有模式窗口","直接","发邮件")'],
    expexcel: ["分页导出到excel文件中", "eb_importexcel", false, 'ebRunToolbarMain("expexcel")'],
    expexcelall: ["不分页导出到excel文件中", "eb_excelone", false, 'ebRunToolbarMain("expexcelall")'],
    exppdf: ["导出所有页到pdf文件中", "eb_exppdf", false, 'ebRunToolbarMain("exppdf")'],
    query: ["重新输入条件来运行报表", "eb_find", false, 'RunReport(curPageNo,"改变参数")'],
    pageset: ["页面设置", "eb_pageset", false, 'RunReport(curPageNo,"改变页面设置")'],
    save: ["保存当前报表运行结果", "eb_save", false, 'EbiaoSaveEvent()'],

    pages: ["总页数", "", false, ''],
    curpage: ["设置当前页", "", false, ''],
    refresh: ["刷新报表数据", "eb_refresh", false, 'RunReport(curPageNo,"刷新")'],

    directexppdf: ["导出所有页到pdf文件中", "eb_exppdf", false, 'parent.open("../../ebtmpfile/a1.pdf")'],

    userdefine: ["自定义工具栏按钮的示例", "../images/ef_run_mail.gif", false, 'alert("这是用户自定义的工具栏按钮的示例!")']
};

/**
*工具栏列表
*TbStyle是工具栏的样式
*Tb是工具栏的列表
**/

function AddToolbarButton() {
    //if($id("Toolbar") != null ) return;
    if (pubDirectRun != "undefined") { //直接链接到html文件
        fcpub.toolbar = "firstpage,prevpage,curpage,pages,nextpage,lastpage,|,preview,print,printdirect,printall,|,expexcel,expexcelall,exppdf";
    }


    //运行工具栏上按钮多少的设置
    var strType = parent.Request.QueryString("tbtype").toString();
    if (IsSpace(strType) == false) {
        fcpub.toolbar = "firstpage,prevpage,curpage,pages,nextpage,lastpage,|,preview,print,printdirect,printall,|,query,pageset,refresh,|,expexcelall,exppdf,|,userdefine";
    }

    if (IsSpace(top.zkpub) == false) {
        if (IsSpace(top.zkpub.skin) == false) {
            fcpubdata.skins = top.zkpub.skin;
        }
    }
    var strCss = parent.Request.QueryString("tbcss").toString();
    if (IsSpace(strCss) == false) fcpubdata.skins = strCss;

    var arr = fcpub.toolbar.split(",");
    var str = new Sys.StringBuilder(); //工具栏的串
    //要调用的css
    str.append("<link rel='stylesheet' type='text/css' href='../css/skins/" + fcpubdata.skins + "/style/Editor.css'>");

    /*
    //str += "<table id='Toolbar' class='Toolbar' cellSpacing='0' cellPadding='0' border='0' style='LEFT:5px;POSITION:absolute;TOP:0px'  ><tr>"
    str.append("<table id='Toolbar' class='Toolbar' cellSpacing='1' cellPadding='0' border='0' style='table-layout:fixed;LEFT:2px;POSITION:absolute;TOP:0px;'><tr>");
    str.append("<td width='5px' height='22px'><span class='leftstart' ></span></td>");
    var positionLeft = 5 + 2 + 1;

	for(var j=0; j<arr.length; j++){
    var btn = btnList[arr[j]];
    //有分隔符号
    if(arr[j] == "|") {
    //str += "<td><img src='../images/ef_design_menuline.gif'></td>"
    str.append("<td width='5px' height='22px'><span class='menuline'></span></td>");
    positionLeft += 5 + 1;

		}else{
    //增加按钮
    if(arr[j] == "curpage"){
    //str += "<td><select id='cboPage' onchange='cboPage_onchange()'><option selected>1</option></select></td>" ;
    str.append("<td width='45px' height='22px'><select id='cboPage' onchange='cboPage_onchange()'><option selected>1</option></select></td>");
    positionLeft += 45 + 1;
				
    }else if(arr[j] == "pages"){  //总页数
    //str += "<td><span id='lblPage' style='font-size:12px'></span></td>" ;
    str.append("<td width='60px' height='22px' style='padding-top:5px'><span id='lblPage' style='font-size:12px;' ></span></td>");
    positionLeft += 60 + 1;
    }else{
    //	str += "<td width='22px' height='22px' onmouseover='tbr1_onmouseover()' onmouseout='tbr1_onmouseout()' onmousedown='tbr1_onmousedown()' onmouseup='tbr1_onmouseup()'><img class='aFilter' title='"+btn[0]+"' onclick='"+btn[3]+"' src='"+btn[1]+"' width='20px' height='20px'></td>";
    str.append("<td width='22px' height='22px' class='normal' ><span onmouseover='tbr1_onmouseover()' onmouseout='tbr1_onmouseout()' onmousedown='tbr1_onmousedown()' onmouseup='tbr1_onmouseup()' width='20px' height='20px' class='" + btn[1] + "' title='" + btn[0] + "' onclick='" + btn[3] + "'></span></td>");
    positionLeft += 22 + 1;

			}
    }
    }
    positionLeft += 32 + 1;
    str.append("<td width='32px' style='padding-top:5px'></td></tr></table><span class='rightend' style='position:absolute;top:0px;width:8px;left:" + positionLeft + "'></span>");
    //str += "<td  height='22px'>&nbsp;</td></tr></table>"	;
    //div1.outerHTML = str;
    */

    str.append("<table id='Toolbar' class='Toolbar' cellSpacing='0' cellPadding='0' border='0' style='LEFT:2px;POSITION:absolute;TOP:0px;'><tr>");
    str.append("<td><img width='5px' height='20px' class='leftstart' src='../images/ef_touming_20_20.gif'></td>");
    var positionLeft = 5;

    for (var j = 0; j < arr.length; j++) {
        var btn = btnList[arr[j]];
        //有分隔符号
        if (arr[j] == "|") {
            str.append("<td><img width='3px' height='20px' class='menuline' src='../images/ef_touming_20_20.gif'></td>");
            positionLeft += 3;

        } else {
            //增加按钮
            if (arr[j] == "curpage") {
                //str += "<td><select id='cboPage' onchange='cboPage_onchange()'><option selected>1</option></select></td>" ;
                str.append("<td width='45px' height='22px' valign='top' style='padding-top:2px;'><select id='cboPage' onchange='cboPage_onchange()' ><option selected>1</option></select></td>");
                positionLeft += 45;

            } else if (arr[j] == "pages") {  //总页数
                //str += "<td><span id='lblPage' style='font-size:12px'></span></td>" ;
                str.append("<td width='60px' height='22px'><span id='lblPage' style='font-size:12px;top:5px;position:absolute;' ></span></td>");
                positionLeft += 60;
            } else {
                var sClassName = btn[1];
                str.append("<td width='22px' height='22px' onmouseover='tbr1_onmouseover()' onmouseout='tbr1_onmouseout()' onmousedown='tbr1_onmousedown()' onmouseup='tbr1_onmouseup()'><img class='normal " + sClassName + "' classbak='" + sClassName + "' title='" + btn[0] + "' onclick='" + btn[3] + "' src='../../fceform/images/ef_touming_20_20.gif' width='20px' height='20px'></td>");
                positionLeft += 22;


            }
        }
    }
    //32为正式版时,因有"关于",
    //positionLeft += 32 ;
    //str.append("<td width='32px' ></td></tr></table><span class='rightend' style='position:absolute;top:0px;width:8px;left:" + positionLeft + "'></span>");
    //if (Sys.Browser.agent != Sys.Browser.InternetExplorer) 
    positionLeft += 20;
    str.append("</tr></table><span class='rightend' style='position:absolute;top:0px;width:8px;left:" + positionLeft + "px'></span>");
    //alert(str.toString());
    document.write(str.toString());
    //document.body.insertAdjacentHTML("afterBegin",str.toString());

}

AddToolbarButton();
/**
*加工具栏的样式
*@date 2007-07-15
**/
function AddToolbarStyle() {
    if (IsSpace(top.zkpub) == false) {
        if (IsSpace(top.zkpub.skin) == false) {
            fcpubdata.skins = top.zkpub.skin;
        }
    }
    var strCss = parent.Request.QueryString("tbcss").toString();
    if (IsSpace(strCss) == false) fcpubdata.skins = strCss;

    //	var strCss = parent.Request.QueryString("tbcss").toString();
    //	if(IsSpace(strCss)==false) fcpub.toolbarstyle = strCss;
    //	//要调用的css
    //	var hrefstyle = "<link rel='stylesheet' type='text/css' href='../css/skins/" ;
    //	var docstyle = "/style/Editor.css'>";

    //var head = document.getElementsByTagName("head")[0];
    //	head.insertAdjacentHTML("afterBegin","<style>@import url(../css/" + fcpub.toolbarstyle + "/Editor.css);</style>");
    //var oStyle = document.createElement("style");
    //	oStyle.innerHTML = "@import url(../css/" + fcpub.toolbarstyle + "/Editor.css);";
    //	head.appendChild(oStyle);


    document.write("<link rel='stylesheet' type='text/css' href='../css/skins/" + fcpubdata.skins + "/style/Editor.css'>");

}

/**
将控件添加到页面上
@date 2004-06-28 liuxr 整理
@name 要添加的控件的名称
**/
function SetToolBarClass(sTag) {
    var curTD = NavJs.getEventObj();
    // if (curTD.tagName == "TD") {
    //curTD=curTD.parentNode
    if (curTD.tagName == "IMG") {
        //curTD = curTD.parentNode;
        switch (sTag) {
            case "onmousedown":
                curTD.className = "down " + curTD.getAttribute("classbak");
                break
            case "onmouseup":
                curTD.className = "over " + curTD.getAttribute("classbak");
                break
            case "onmouseout":
                curTD.className = "normal " + curTD.getAttribute("classbak");
                // curTD.childNodes[0].className = "aFilter";
                break
            case "onmouseover":
                //curTD.childNodes[0].className = curTD.childNodes[0].className+"over";
                curTD.className = "over " + curTD.getAttribute("classbak");
                break
                //}

        }
    }
}
function tbr1_onmousedown() {
    SetToolBarClass("onmousedown")
}
function tbr1_onmouseup() {
    SetToolBarClass("onmouseup")
}
function tbr1_onmouseout() {
    SetToolBarClass("onmouseout")
}
function tbr1_onmouseover() {
    SetToolBarClass("onmouseover")
}
function window_onload() {
    pubDirectRun = parent.Request.QueryString("e_directrun").toString();
    //alert( pubDirectRun == "undefined")
    RunReport(curPageNo, '带参初始进入');

}
/*
function ebrun_win_onresize(){
_actWidth(document.getElementById("div4Area2"));
_actWidth(document.getElementById("div4Area4"));
_actHeight(document.getElementById("div4Area3"));
_actHeight(document.getElementById("div4Area4"));


function _actWidth(obj)
{
if(obj == null || typeof obj != "object") return
var winWidth=document.body.clientWidth   ;
var tmpwidth = winWidth-obj.offsetLeft;
if(tmpwidth < 0 ) tmpwidth = 0 ;
obj.style.width =tmpwidth;
	
}
function _actHeight(obj)
{
if(obj == null || typeof obj != "object") return
var winHeight=document.body.clientHeight  ;
var tmpwidth = winHeight-obj.offsetTop;
if(tmpwidth < 0 ) tmpwidth = 0 ;
obj.style.height =tmpwidth;
	
}
}*/
