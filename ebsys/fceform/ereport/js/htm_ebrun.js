var iRunWait = 1;   //在主窗口运行wait窗口
var oPubXmlFile = null; //保存当前报表文件的dom对象
var sPubPath = ""; //报表文件
var sPubDjContent = ""; //报表参数表单的内容
var sPubPerRun = "是"; //输入条件前先就运行报表
var sPubModalWin = "";  //模态窗口的位置.
var sPubUrlPara = Request.QueryString("urlpara").toString(); //为yes 表示在URL上带好了报表参数
var winPos = {
    height: 0,
    type: 4
};
function _start() {
    var isFromDb = Request.QueryString("fromdb").toString();
    if (IsSpace(isFromDb)) {
        ReadConfig(); //读econfig.xml中的配置信息
        isFromDb = fcpub.fromdb;
    }
    var oTopWin = top;
    if (IsSpace(oTopWin.zkpub) == false) {
        if (IsSpace(oTopWin.zkpub.skin) == false) {
            fcpubdata.skins = oTopWin.zkpub.skin;

        }
    }
    cssId.href = "../../fceform/css/skins/" + fcpubdata.skins + "/style/efskin.css";


    var spath = Request.QueryString("file").toString();
    if (IsSpace(spath)) { //如没有指定file,则可能是用 name=报表名方式来指定的
        var sname = Request.QueryString("name").toString();
        if (IsSpace(sname)) {
            alert("没有指定要运行的报表文件!");
            return;
        }
        if (isFromDb == "yes") {
            spath = sname;
        } else {
            spath = fcpub.rootPath + sname + ".htm"; //固定加上.htm的文件名
        }
        //        var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=isRunReport&spath="+spath,"");
        //        if(retX != "ok"){
        //            alert(retX);
        //            window.close();
        //            return;
        //        } 
        //		
    }
    //my add 2013-03-22
    //alert(spath + "   " + escape(spath) + "|||" + unescape(spath));
    //     var xx=new GB2312UTF8();
    //     var Utf8 = xx.Gb2312ToUtf8(spath);
    //     alert(xx.Utf8ToGb2312(spath) + "|||" + Utf8 + "|||" + spath + "|||" + escape("s_主从表") + "|||" + encodeURI("s_主从表"))
    //     var Gb2312=xx.Utf8ToGb2312(Utf8);
    //     alert(xx.Gb2312ToUtf8(spath) + "|||" + xx.Utf8ToGb2312(spath))	
    //    if (Sys.Browser.agent != Sys.Browser.InternetExplorer) spath = unescape(spath);

    spath = unescape(spath); //在chrome上中文文件名的问题 my add 2013-03-22

    var oXml = null;
    //找到报表的参数串
    //if(sTag == "翻页" || sTag == "带参初始进入" || (sTag == "改变页面设置" ) || (sTag == "改变参数" && oPara=="") ){


    //alert(unescape(spath));
    if (fcpubdata.dotnetVersion == "") spath = escape(spath);
    if (isFromDb == "yes") {
        var retX = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=loadFile&fromdb=yes&dbtype=" + fcpubdata.databaseTypeName + "&spath=" + escape(spath), "");
        var ipos = retX.indexOf("<TABLE ");
        if (ipos > 0) {
            retX = retX.substring(ipos, retX.length);
        }

    } else {
        //oXml = SetDomFile(escape(spath)); //2007-03-26 add,防止汉字文件名时在.net2.0上出错.
        var retX = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=GetFileContent&pathfile=" + escape(spath), "");
    }
    //function _callback(result){
    //var retX = result.value;
    oXml = SetDom(retX);
    if (oXml.documentElement == null) {
        if (isFromDb == "yes") {
            alert("当前报表格式文件是设置为从数据库中读写的,而从数据库中读不到合法的XML格式的内容!");
        } else {
            alert("报表文件路径不对或内容不是合法的XML数据!错误信息:" + retX);
        }
        return;
    }

    //能否运行的检查.
    var sPermit = Request.QueryString("ispermit").toString();
    var isPermit = (IsSpace(sPermit) && oXml.documentElement.getAttribute("e_check_permit") == "是") || sPermit == "1";
    if (isPermit) {
        var sUnitId = Request.QueryString("unitid").toString();
        if (IsSpace(sUnitId))
            sUnitId = "";
        else
            sUnitId = "&unitid=" + sUnitId;
        var retX = SendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=zkLoadMod" + sUnitId, "");
        if (retX != "ok") {
            document.write(retX);
            return;
        }

    }


    var bShowWin = false;

    //		var sFrame = "";
    //		var sFrame11 = '<frameset rows="';
    //		var sFrame12 = '25px,*';
    //		var sFrame13 = '" frameborder=0 border=0>';
    //		var sFrame2 = '<frame id="toolbar" src="ebruntb.htm" scrolling=no border=0 >';
    //		var sFrame31 = '<frame id ="filter" SRC="';
    //		var sFrame32 = '../common/djempty.htm?djcontent=yes';
    //		var sFrame33 = '"  scrolling=yes border=0  frameborder=1  bordercolor=LightGrey marginwidth=1 noresize>';
    //		var sFrame4 = '<frame id ="topic" name="topic" SRC="ebruntopic.htm"  scrolling=yes border=0  frameborder=1  bordercolor=LightGrey marginwidth=1 noresize>';
    //		var sFrame5 = '</frameset>';
    //		
    //判断是否是带参数的报表
    var sPara = oXml.documentElement.getAttribute("e_argsbak");
    if (IsSpace(sPara) == false && sPubUrlPara != "yes") {
        var sRun = oXml.documentElement.getAttribute("eform_run");
        if (IsSpace(sRun) == false) { //表示有参数表单
            sPubDjContent = "<scr" + "ipt>" + unescape(oXml.documentElement.getAttribute("eform_function")) + "</scr" + "ipt>" + unescape(sRun);
            var sWinProp = oXml.documentElement.getAttribute("eform_winprop");
            if (IsSpace(sWinProp) == false) { //表示设置了参数表单的窗口
                var arr = sWinProp.split(",");
                if (arr[0] == "2") { //当前窗口打开
                    if (arr[1] == "是") { //条件在上
                        //							sFrame12 = '25px,'+arr[2]+'px,*';
                        //							sFrame = sFrame11 + sFrame12 + sFrame13 + sFrame2 + sFrame31 + sFrame32 + sFrame33 + sFrame4 + sFrame5;
                        //							
                        winPos.height = arr[2];
                        winPos.type = 1;
                    } else {
                        //sFrame12 = '25px,*,'+arr[2]+'px';
                        //sFrame = sFrame11 + sFrame12 + sFrame13 + sFrame2 + sFrame4 + sFrame31 + sFrame32 + sFrame33 + sFrame5;

                        winPos.height = arr[2];
                        winPos.type = 2;
                    }
                } else if (arr[0] == "3") {  //在iframe显示报表运行结果
                    //sFrame = sFrame11+sFrame12+sFrame13+sFrame2+sFrame31+sFrame32+sFrame33+sFrame5;
                    winPos.type = 3;


                } else { //弹出一个模态窗口打开
                    bShowWin = true;
                    var stmp = "dialogWidth:" + arr[2] + "px;dialogHeight:" + arr[3] + "px;"
                    if (arr[1] == "是") { //居中
                        stmp += "center:yes;"
                    } else {
                        stmp += "dialogLeft:" + arr[4] + "px;dialogTop:" + arr[5] + "px;"
                    }
                    sPubModalWin = stmp;

                }
                sPubPerRun = arr[6];
            }
        }
    }
    //if (sFrame == "") sFrame = sFrame11 + sFrame12 + sFrame13 + sFrame2 + sFrame4 + sFrame5;

    //document.write(sFrame);
    oPubXmlFile = oXml;
    sPubPath = spath;

    var sIframeFilter = '<iframe  width=100% height=100% id="filter" name="filter" src = "../common/djempty.htm?djcontent=yes" scrolling=auto border=0  frameborder=0  bordercolor=LightGrey ></iframe>';
    var sIframeTopic = '<iframe width=100% height=100% id="topic" name="topic"  src="ebruntopic.htm" scrolling=auto border=0  frameborder=0   ></iframe>'; //bordercolor=LightGrey
    var oTopic = $id("oTopic");
    var oFilter = $id("oFilter");
    if (winPos.type == 3) {
        oTopic.style.display = "none";
        oFilter.innerHTML = sIframeFilter;
    }
    if (winPos.type == 4) {
        oFilter.style.display = "none";
        oTopic.innerHTML = sIframeTopic;
    }
    if (winPos.type == 1) {
        oFilter.innerHTML = sIframeFilter;
        oTopic.innerHTML = sIframeTopic;
    }
    if (winPos.type == 2) {
        oFilter.innerHTML = sIframeTopic;
        oTopic.innerHTML = sIframeFilter;
    }

    $id("toolbar").src = "ebruntb.htm";
    window_onresize();

    if (bShowWin) {
        EbiaoShowModalParaWin(window);
    }
    //}
}


function window_onresize() {
    var oWinPos = getClientSize()
    var winHeight = oWinPos.height;
    var winWidth = oWinPos.width;
    //alert(winHeight)
    var filterHeight = ToInt(winPos.height);


    var tbHeight = 27;
    if (winPos.type == 3) {
        //oTopic.style.display = "none";
        if (document.getElementById("filter") != null) document.getElementById("filter").style.height = actionMin(winHeight - tbHeight);
    }
    if (winPos.type == 4) {
        //oFilter.style.display = "none";
        if (document.getElementById("topic") != null) document.getElementById("topic").style.height = actionMin(winHeight - tbHeight);
    }

    if (winPos.type == 1 || winPos.type == 2) {
        //oTopic.style.overflow = "auto";
        //oFilter.style.display = "none";
        //oFilter.style.height = filterHeight;
        //oTopic.style.top = tbHeight + filterHeight;
        //oTopic.style.height = actionMin(winHeight - tbHeight - filterHeight);
        if (document.getElementById("topic") != null) document.getElementById("topic").style.height = actionMin(winHeight - tbHeight - filterHeight);
        if (document.getElementById("filter") != null) document.getElementById("filter").style.height = filterHeight + "px";
    }
    //    if (winPos.type == 2) {
    //        document.getElementById("topic").style.height = actionMin(winHeight - tbHeight - filterHeight);
    ////        oTopic.style.height = actionMin(winHeight - tbHeight - filterHeight);
    //        document.getElementById("filter").style.height = filterHeight;
    //  //      oFilter.style.top = tbHeight + actionMin(winHeight - tbHeight - filterHeight);
    //        
    //    }

    document.getElementById("toolbar").style.width = winWidth + "px";
    if (document.getElementById("filter") != null) document.getElementById("filter").style.width = winWidth + "px";
    if (document.getElementById("topic") != null) document.getElementById("topic").style.width = winWidth + "px";

    //alert(oTopic.style.cssText) 
    function actionMin(iH) {
        if (iH < 10) iH = 10;
        return iH + "px";
    }

}
