///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

//供显示e表结果控件所用
//作者：梅勇，
//日期：2007-08-02

NavJs.addEvent(window, 'onload', function() {
    var ebshow1 = $id("ebshow1");
    ebshow1.innerHTML = unescape(ebshow1.getAttribute("InHtml"));
    if ($id("fcebTopic").allowTransparency) { //iframe透明
        var oWinIframe = $win("fcebTopic");
        oWinIframe.document.onreadystatechange = function() {
            if (oWinIframe.document.readyState == "complete") {
                oWinIframe.document.body.style.backgroundColor = "transparent";
            }
        }
        if (oWinIframe.document.readyState == "complete") {
            oWinIframe.document.body.style.backgroundColor = "transparent";
        }
    }
    ebshow_win_onresize();
})
NavJs.addEvent(window,'onresize', ebshow_win_onresize)	;
function ebshow_win_onresize(){
	var obj=$id("ebshow1");
	var oWinSize = getClientSize();
	var offset = 2;
	if (Sys.Browser.agent == Sys.Browser.InternetExplorer) offset = 0;
	var winWidth = oWinSize.width-offset;
	var winHeight = oWinSize.height-offset;
	if(obj.getAttribute("autoWidth")=="是"){
		var tmpwidth = winWidth-obj.offsetLeft;
		if(tmpwidth < 0 ) tmpwidth = 0 ;
		obj.style.width =tmpwidth+"px";
	}
	if(obj.getAttribute("autoHeight")=="是"){
		var tmpwidth = winHeight-obj.offsetTop;
		if(tmpwidth < 0 ) tmpwidth = 0 ;
		obj.style.height = tmpwidth + "px";
	}

}