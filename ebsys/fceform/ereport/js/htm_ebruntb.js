var curPageNo = 1;  //��ǰҳ��
var iPages = 1;   //��ҳ��
var cacheId = ""; //����Ļ���ID
var e_paramid = ""; //��������Ļ���ID
var oPara = "";  //�����������ʼ��eb_filter����
var pubPara = ""; //������,�������̨������
var pubBasePara = ""; //url�ϴ��õĲ�����

var pubMacro = ""; //�괮,�������̨������
var oPageSet = null;
var pubPageSet = ""; //ҳ�����ô�
var pubDataSource = ""; //Ҫ�򿪵����ݿ����Ӵ�
var pubDirectRun = "undefined"; //ֱ�Ӵ����ɺõı����ļ�,Ĭ��ֵӦΪ "undefined" ,��Ϊ���е��ж϶��Ǵ�.
var pubPreRunUrl = ""; //��һ�����б����URL,���ڱ��汨������
var isFromDb = parent.Request.QueryString("fromdb").toString();
if (IsSpace(isFromDb)) {
    ReadConfig(); //��econfig.xml�е�������Ϣ
    isFromDb = fcpub.fromdb;
}

/**
* ���б���
*@param sTag = �ı����/�ı�ҳ������/��ҳ/ˢ��/��ʼ����/���γ�ʼ����/ǿ�з�ҳ����/����
*@param sSaveFileName = Ҫ���汨�����н�������ļ���
*@param EventAfterSave = ���б������¼�,ӦΪfunction��
*@date 2006-04-18
**/
function RunReport(pageno, sTag, sSaveFileName, EventAfterSave) {

    EbiaoEnterStatus(function(bRun) {
        if (!bRun) {
            //�رյ�ǰ����
            history.go(-1);
            parent.close();
            return;
        }



        var oXml = parent.oPubXmlFile;
        var spath = parent.sPubPath;
        pubDataSource = oXml.documentElement.getAttribute("e_datasource");
        //}

        //�ҵ����б���URL������ĺ�ֵ�� no use
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
        //���ô�ӡ����
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
        if (pubDirectRun != "undefined") { //ֱ����ʾ����õı����ļ�
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

        if (sTag == "���γ�ʼ����" || sTag == "�ı����" || sTag == "�Ӳ�����������") {
            if (sTag == "���γ�ʼ����" && parent.sPubPerRun != "��") {
                return;
            }
            if (sTag == "�ı����" && parent.sPubUrlPara == "yes") {
                return;
            }
            //if(sTag == "���γ�ʼ����"){
            //��ʾֱ����url�ϴ����˱������
            //"?file=/webbill/ebfile/s_������.htm&urlpara=yes&startdate=2005-02-01"
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
                // ȥ��β����&
                if (s1.substring(s1.length - 1, s1.length) == "&") {
                    s1 = s1.substring(0, s1.length - 1);
                }
                if (s1.length > 0) {
                    //���濪ͷ��&
                    if (s1.substring(0, 1) != "&") {
                        s1 = "&" + s1;
                    }
                    //��ֹ����ֵ���к���ʱ,���Խ�����ֵȫ��escapeһ��.

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
                pubBasePara = s1; //�������̨������
                cacheId = "";  //�޸Ĳ�����Ӧ���cacheId
            }
            //}
            if (parent.sPubUrlPara != "yes") {  //��ʾ����Ҫ���û��������ֵ
                if (parent.sPubDjContent == "") { //û�в�����ʱ
                    var sXml = "";
                    if (sTag == "�ı����" && oPara != "") {
                        sXml = oPara;
                    } else {
                        sXml = oXml.documentElement.getAttribute("e_argsbak");
                    }
                    if (IsSpace(sXml) == false) {
                        if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
                            var sRet = DjOpen("eb_filter", sXml, "չ��", "��ģʽ����", "ֱ��", "���뱨�����");
                            if (IsSpace(sRet) == false) {
                                var sX = unescape(sRet);
                                var oX = SetDom("<root>" + sX + "</root>");
                                var newPara = "";
                                for (var i = 0; i < oX.documentElement.childNodes.length; i++) {
                                    var tmp1 = "&" + NavJs.getNodeValue11(oX, i, 0) + "=";
                                    //ֻ�е�url�в����д˲�����ֵʱ�ż���
                                    if (pubBasePara.indexOf(tmp1) < 0) {
                                        var tempParamValue = escape(NavJs.getNodeValue11(oX, i, 5));
                                        if (fcpubdata.dotnetVersion == "") tempParamValue = escape(tempParamValue);
                                        newPara += "&" + NavJs.getNodeValue11(oX, i, 0) + "=" + tempParamValue;
                                    }
                                }
                                oPara = sRet; //�����������ʼ��eb_filter����
                                pubPara = newPara; //�������̨������
                                cacheId = "";  //�޸Ĳ�����Ӧ���cacheId
                            } else {
                                return;
                            }
                        }
                    }
                } else { //�Ӳ�������
                    if ($win("filter", parent) == null) {
                        if (sTag != "�Ӳ�����������") {
                            //var old = pubPara;
                            EbiaoShowModalParaWin(parent);
                            return;
                            //if(old == pubPara) return; //����û��ʱ(��رմ���)�����б���.
                        }
                    } else {
                        //��Ϊ�첽������,�޷��ӱ������Ϻϳɱ��������Ĭ��ֵȥ���б���.
                        //����������һ������ʱ���ܻ����첽��ԭ�������,����try
                        if (sTag == "�Ӳ�����������") {
                            $win("filter", parent).eval("try{ ActEbiaoPara();}catch(e){}");
                        }
                    }
                }


            }

            //ɾ���ظ�����ֵ 2009-01-08 add
            var sb = new Sys.StringBuilder();
            var arr1 = pubPara.split("&");
            var arr2 = pubBasePara.split("&");
            for (var i = arr1.length - 1; i >= 0; i--) {
                var arr1Sub = arr1[i].split("=");
                for (var j = arr2.length - 1; j >= 0; j--) {
                    var arr2Sub = arr2[j].split("=");
                    if (arr1Sub[0].toUpperCase() == arr2Sub[0].toUpperCase()) {
                        if (sTag == "�Ӳ�����������") { //��ʾ��pubParaΪ׼
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

        //������ʾ������ʱ,���������ֻ��һ�������ҳ,��һ�����򲻷�ҳ
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
                    } else if (propName == "e_paper_height" && oPageSet["e_page_size"] != "13") { //13Ϊ�Զ���
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
        //ҳ��������Ϣ
        if (sTag == "�ı�ҳ������") {
            if (Sys.Browser.agent != Sys.Browser.InternetExplorer) {
                alert("ֻ����IE�в��д˹��ܣ�");
                return;
            }
            var oo = DjOpen("eb_pageset", oPageSet, "չ��", "��ģʽ����", "ֱ��", "ҳ������");
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



        if (sTag == "ˢ��") cacheId = "";

        var ooWin = null;
        if (!fcpub.twoRunReport && sTag != "����") {
            ooWin = getEbWin();
            if (ooWin != null) {
                //ooWin.document.body.innerHTML = "<table width='100%' height='100%' id=waitTable ><tr><td valign=middle align=center style='color:red'><img src='../../fceform/images/ef_wait.gif'> ���ڼ��㱨��...<td><tr></table>";
                if (Sys.Browser.agent != Sys.Browser.Firefox) ooWin.document.write("<table width='100%' height='100%' id=waitTable ><tr><td valign=middle align=center style='color:red'><img src='../../fceform/images/ef_wait.gif'> ���ڼ��㱨��,���Ժ�...<td><tr></table>");
            }
        }

        if (sTag != "��ҳ" && sTag != "����") {  //����ʱ���治�ܶ�
            curPageNo = 1;
            pageno = 1;
            if (sTag != "ǿ�з�ҳ����") {
                //ָ��ҳ�Ż򲻷�ҳ,ҳ��=-2Ϊ����ҳ
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
        if (sTag == "����" && pubPreRunUrl != "") {
            sAspxUrl = pubPreRunUrl + "&e_runsavefile=" + sSaveFileName;
        } else {
            sAspxUrl = getUrl("run", spath, pageno);
            if (sTag != "��ҳ") pubPreRunUrl = sAspxUrl;
        }
        //�����������Ϊ��XML���ݴ�����̨
        var xmlParams = pubBasePara + pubPara + pubMacro; //pubBasePara������URL�Ϻ�POST�ж�Ҫ,

        xmlParams = "<params>" + RepStr(xmlParams, "&", "&amp;") + "</params>";


        //�첽���б���.
        new Eapi.RunAjax().sendHttp(sAspxUrl, xmlParams, function(result) {

            //"<ds>"+getDataSourceInfo(pubDataSource)+"</ds>"

            var href = result.value;
            if (IsSpace(href) == false) {
                var arr = href.split(",,,");
                if (arr.length >= 6) {
                    cacheId = arr[0];
                    //var ooWin1 = getEbWin(); || (sTag == "��ҳ" && parent.Request.QueryString("e_pageno").toString() == "-1" && ooWin1.document.body == null)
                    if ((sTag != "��ҳ" && sTag != "����")) {
                        iPages = parseInt(arr[1]); //��ҳ��
                        //alert(iPages);
                        var olblPage = $id("lblPage");
                        if (olblPage != null) {
                            olblPage.innerText = "��ҳ��:" + arr[1]; //
                        }
                        var ocboPage = $id("cboPage");
                        if (ocboPage != null) {
                            _InitPageNo();
                            //ocboPage = $id("cboPage");
                            ocboPage.selectedIndex = 0;
                            //ȡURL�е�ҳ��,������ҳ�������б����ʾ.
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
                        e_paramid = arr[3]; //�������ID
                        //�����������н��
                        //                        if (arr[4] == "href") { //no use ��̨��������ȥ����.
                        //                            var sHtmlUrl = location.protocol + "//" + location.host + arr[5];
                        //                            if (parent.topic == null && parent.filter != null) { //��iframe����ʾ
                        //                                parent.filter.document.getElementById("fcebTopic").src = sHtmlUrl;
                        //                            } else {
                        //                                open(sHtmlUrl, "topic");
                        //                            }
                        //                        }

                        if (arr[4] == "html") { //ֱ�����html����
                            var sHtml = arr[5];

                            for (var i = 6; i < arr.length; i++) { //��ֹHTML��������Ҳ����,,,�ķָ���
                                sHtml += ",,," + arr[i];
                            }
                            var isHideWin = false;
                            if (parent.Request.QueryString("e_pageno").toString() == "-1") {
                                if (sTag == "��ҳ") isHideWin = true;
                            }
                            if (parent.Request.QueryString("e_paper_width").toString() == "-1") {
                                if (typeof (EventAfterSave) == "function") isHideWin = true;
                            }
                            //alert(isHideWin);
                            var ooWin = getEbWin(isHideWin);
                            if (ooWin == null) {
                                _CloseWait(result);
                                //debugger
                                alert("��ʾ�������Ĵ��ڲ�����!");
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
                                    MovePage(3); //�Ƶ���һҳ,����ʼʱ��ӡ���ǵ�һҳ
                                    //fcpub.twoRunReport = false;
                                }
                            }

                        }
                        //��iframe��͸���Ĵ���
                        if ($win("topic", parent) == null && $win("filter", parent) != null) { //��iframe����ʾ
                            if ($win("filter", parent).document.getElementById("fcebTopic").allowTransparency) { //iframe͸��
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

                        //�������н���
                        var hEnd = parent.parent.HandleAfterInitReport; //����HandleAfterInitReport�¼�.
                        //alert(hEnd)
                        if (typeof hEnd == "function") {
                            hEnd(_AfterRunRpt(arr[5]));
                        }
                        if (typeof EventAfterSave == "function") {
                            EventAfterSave(_AfterRunRpt(arr[5]));
                        }

                    } else {
                        _CloseWait(result);
                        alert(arr[2]); //������Ϣ
                    }
                } else {
                    _CloseWait(result);
                    alert(href);
                }
            }
            _CloseShow();
        }, ooWin); //���ú�������
    });                                                          //���ú�������
    function _CloseWait(result) {
        //ȥ���ȴ���Ϣ
        if (result.context != null) {
            result.context.document.open();
            result.context.document.write("");
            result.context.document.close();
        }

    }
    function _AfterRunRpt(sRetValue) {
        var oReturnValue = new Object();
        oReturnValue.pages = iPages; //������ҳ�����¼�.
        oReturnValue.value = sRetValue; //���صĲ������ֵ.
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
* ���㾲̬�ı����ļ���·��.
*@date 2007-08-03
**/
function _getExpFilePath() {
    var sHtmlUrl = fcpubdata.path;
    if (pubDirectRun == "yes") {
        var sTmp = parent.sPubPath;
        sTmp = sTmp.substring(0, sTmp.length - 4); // remove .htm
        sTmp = RepStr(sTmp, "/", ",");
        sHtmlUrl += fcpub.expFilePath + sTmp; //�˴���URL·��,���Ǻ�̨�ļ���·��
    } else {
        sHtmlUrl += fcpub.tempFilePath + pubDirectRun;
    }
    return sHtmlUrl;

}
/**
* index =1 2 3 4 �ֱ�����һҳ,��һҳ,��һҳ,���һҳ
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
            RunReport(curPageNo, "��ҳ", "", callback);
        } else {
            RunReport(curPageNo, "��ҳ");
        }
    }
}
/**
* ������ʾ�������Ĵ���
* isHideWin != true ������ʾ�������н��ʱ����,�������ڴ�ӡʱ����.
*@date 2007-08-02
**/
function getEbWin(isHideWin) {
    var ooWin = $win("topic", parent);
    if (ooWin == null && $win("filter", parent) != null) { //��iframe����ʾ
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
*@param index=1 ��ʾ��ӡԤ�� =2 ��ʾ��ӡ =3 ��ʾֱ�Ӵ�ӡ =4 ��ʾ��ӡ����ҳ
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
        alert("ֻ����IE�в��д˹��ܣ�");
        return;
    }

    var ooWin = getEbWin(parent.Request.QueryString("e_paper_width").toString() == "-1" || parent.Request.QueryString("e_pageno").toString() == "-1");
    if (ooWin.document.body == null) {
        alert("��û�в���Ҫ��ӡ������,���Ե�һ�������!");
        return;
    }
    var oPrint = getPrintCom(ooWin, oPageSet);
    if (oPrint == null) {
        var iReg = DjOpen('eb_regprint', '', 'չ��');
        if (iReg == 2) {

            var sPrint = "<object ID='WebBrowser1' WIDTH=0 HEIGHT=0 CLASSID='CLSID:8856F961-340A-11D0-A96B-00C04FD705A2'></object> ";
            //ooWin.document.body.insertAdjacentHTML("BeforeEnd", sPrint);
            NavJs.insertHtml("BeforeEnd", ooWin.document.body, sPrint)
            var oWB = ooWin.document.getElementById("WebBrowser1");
            if (index == 1)
                oWB.ExecWB(7, 1); //��ӡԤ��
            else
                oWB.ExecWB(6, 1); //��ӡ


        } else if (iReg == 3) {
            ooWin.print();
        }
        return;
    }
    if (oPrint.defaultPrinterName.length == 0) {
        alert("���Ȱ�װ��ӡ������ִ�д˹��ܣ�");
        return;
    }
    if (index == 1) oPrint.Preview();
    if (index == 2) oPrint.Print();
    if (index == 3) oPrint.Print(true);

    if (index == 4 || index == 5) {
        var pubPageSetNew = "";
        if (index == 5) { //�������ں��ٳ�����ӡ

            var oo = DjOpen("eb_pageset", oPageSet, "չ��", "��ģʽ����", "ֱ��", "ҳ������");
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
        //��ӡ����õı�����ҳ��
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

            //��ӡ����ҳ
            var sGen = ""; //�ļ����ɺ�̨��ʱ����.
            //�������
            var sCurParams = "";
            var sAllParams = pubBasePara + pubPara;
            if (sAllParams != "") {
                var arrP = sAllParams.split("&");
                for (var j = 0; j < arrP.length; j++) {
                    if (IsSpace(arrP[j])) continue;
                    var arrP1 = arrP[j].split("=");
                    if (IsSpace(arrP1[0])) continue; //�������Ϊ��
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
* ��ӡһ��url
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
oWin.oFcsoftPrint.Print(true);	  //�����˲���Ĵ�ӡԤ���Ĺ���   
//oWin.parent.fcpubdata.keyValue += oWin.oPrintElm.href+" end= "+(new Date()).getTime()+"\r\n";
//oWin.oPrintElm.href ="";
aHeads[0].removeChild(oWin.oPrintElm); //
		    
}
return true;
}
else return false;
}*/
/**
* ����ΪExcel�ļ�,bPageBreak=true ��ʾ��ҳ������excel�ļ���,��һҳ����Ϊһ��excel�ļ���sheet.
* bPageBreak=false ��ʾ������������Ϊһ��sheet.
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
* ����Ϊpdf�ļ�
**/
function SaveasPdf() {
    var spath = parent.sPubPath; //parent.Request.QueryString("file").toString();
    var sAll = getUrl("saveasPdf", spath, 1);
    //alert(sAll);
    open(sAll, "");


}
/**
*@param sKey = ���б���saveasPdf�Ȳ���
*@param sPath �����ļ�
*@param pageno ��ʼҳ��
**/
function getUrl(sKey, sPath, pageno) {
    //���б����URL��

    var sFromDb = "";
    if (isFromDb == "yes") {
        if (pubBasePara.indexOf("&fromdb=yes") < 0)
            sFromDb += "&fromdb=yes";
        sFromDb += "&dbtype=" + fcpubdata.databaseTypeName;
    }

    //ֻ����IE�²��̶ܹ�������ʾ
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
    //sDs��Ҫ����escape����Ϊһ���ᱻ.net�Զ�ȥ��.�������ֻ��пո�.
}
/**
* ǿ�з�ҳ���б���,��ʱ���,���ô�Ӧ��RunReport�м�һ��callback���¼��ص�.
*@date 2007-07-24 nouse
**/
function PageRunReport() {
    var sUrlPageNo = parent.Request.QueryString("e_pageno").toString();
    if (sUrlPageNo == "-2") {
        if (curPageNo == 1) RunReport(curPageNo, "ǿ�з�ҳ����");
    }

}
/**
* e�����й������İ�ť�������ó���
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
//expexcel: ["������ǰҳ��excel�ļ���", "../images/eb_excelone.gif", false, 'saveasExcel(curPageNo)'],

var btnList = { //���а�ť���б�
    firstpage: ["��һҳ", "eb_firstpage", false, 'MovePage(3)'],
    prevpage: ["��һҳ", "eb_prevpage", false, 'MovePage(1)'],
    nextpage: ["��һҳ", "eb_nextpage", false, 'MovePage(2)'],
    lastpage: ["���һҳ", "eb_lastpage", false, 'MovePage(4)'],
    preview: ["��ӡԤ��", "djpreview", false, 'Print(1);'],
    print: ["��ӡ", "eb_print", false, 'Print(2)'],
    printdirect: ["ֱ�Ӵ�ӡ", "eb_printdirect", false, 'Print(3)'],
    printalldirect: ["ֱ�Ӵ�ӡ����ҳ", "eb_printall", false, 'Print(4)'],
    printall: ["��ӡ����ҳ", "eb_printall", false, 'Print(5)'],

    //	savereport: ["���汨�����������", "../images/ef_design_save.gif", false, 'Add("save")'],
    //	email: ["���ʼ�", "../images/ef_run_mail.gif", false, 'DjOpen("TTsendemail",parent.topic.document.body.outerHTML,3,"��ģʽ����","ֱ��","���ʼ�")'],
    expexcel: ["��ҳ������excel�ļ���", "eb_importexcel", false, 'ebRunToolbarMain("expexcel")'],
    expexcelall: ["����ҳ������excel�ļ���", "eb_excelone", false, 'ebRunToolbarMain("expexcelall")'],
    exppdf: ["��������ҳ��pdf�ļ���", "eb_exppdf", false, 'ebRunToolbarMain("exppdf")'],
    query: ["�����������������б���", "eb_find", false, 'RunReport(curPageNo,"�ı����")'],
    pageset: ["ҳ������", "eb_pageset", false, 'RunReport(curPageNo,"�ı�ҳ������")'],
    save: ["���浱ǰ�������н��", "eb_save", false, 'EbiaoSaveEvent()'],

    pages: ["��ҳ��", "", false, ''],
    curpage: ["���õ�ǰҳ", "", false, ''],
    refresh: ["ˢ�±�������", "eb_refresh", false, 'RunReport(curPageNo,"ˢ��")'],

    directexppdf: ["��������ҳ��pdf�ļ���", "eb_exppdf", false, 'parent.open("../../ebtmpfile/a1.pdf")'],

    userdefine: ["�Զ��幤������ť��ʾ��", "../images/ef_run_mail.gif", false, 'alert("�����û��Զ���Ĺ�������ť��ʾ��!")']
};

/**
*�������б�
*TbStyle�ǹ���������ʽ
*Tb�ǹ��������б�
**/

function AddToolbarButton() {
    //if($id("Toolbar") != null ) return;
    if (pubDirectRun != "undefined") { //ֱ�����ӵ�html�ļ�
        fcpub.toolbar = "firstpage,prevpage,curpage,pages,nextpage,lastpage,|,preview,print,printdirect,printall,|,expexcel,expexcelall,exppdf";
    }


    //���й������ϰ�ť���ٵ�����
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
    var str = new Sys.StringBuilder(); //�������Ĵ�
    //Ҫ���õ�css
    str.append("<link rel='stylesheet' type='text/css' href='../css/skins/" + fcpubdata.skins + "/style/Editor.css'>");

    /*
    //str += "<table id='Toolbar' class='Toolbar' cellSpacing='0' cellPadding='0' border='0' style='LEFT:5px;POSITION:absolute;TOP:0px'  ><tr>"
    str.append("<table id='Toolbar' class='Toolbar' cellSpacing='1' cellPadding='0' border='0' style='table-layout:fixed;LEFT:2px;POSITION:absolute;TOP:0px;'><tr>");
    str.append("<td width='5px' height='22px'><span class='leftstart' ></span></td>");
    var positionLeft = 5 + 2 + 1;

	for(var j=0; j<arr.length; j++){
    var btn = btnList[arr[j]];
    //�зָ�����
    if(arr[j] == "|") {
    //str += "<td><img src='../images/ef_design_menuline.gif'></td>"
    str.append("<td width='5px' height='22px'><span class='menuline'></span></td>");
    positionLeft += 5 + 1;

		}else{
    //���Ӱ�ť
    if(arr[j] == "curpage"){
    //str += "<td><select id='cboPage' onchange='cboPage_onchange()'><option selected>1</option></select></td>" ;
    str.append("<td width='45px' height='22px'><select id='cboPage' onchange='cboPage_onchange()'><option selected>1</option></select></td>");
    positionLeft += 45 + 1;
				
    }else if(arr[j] == "pages"){  //��ҳ��
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
        //�зָ�����
        if (arr[j] == "|") {
            str.append("<td><img width='3px' height='20px' class='menuline' src='../images/ef_touming_20_20.gif'></td>");
            positionLeft += 3;

        } else {
            //���Ӱ�ť
            if (arr[j] == "curpage") {
                //str += "<td><select id='cboPage' onchange='cboPage_onchange()'><option selected>1</option></select></td>" ;
                str.append("<td width='45px' height='22px' valign='top' style='padding-top:2px;'><select id='cboPage' onchange='cboPage_onchange()' ><option selected>1</option></select></td>");
                positionLeft += 45;

            } else if (arr[j] == "pages") {  //��ҳ��
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
    //32Ϊ��ʽ��ʱ,����"����",
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
*�ӹ���������ʽ
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
    //	//Ҫ���õ�css
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
���ؼ���ӵ�ҳ����
@date 2004-06-28 liuxr ����
@name Ҫ��ӵĿؼ�������
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
    RunReport(curPageNo, '���γ�ʼ����');

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
