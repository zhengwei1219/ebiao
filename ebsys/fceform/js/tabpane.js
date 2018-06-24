/*----------------------------------------------------------------------------\
|                               Tab Pane 1.02                                 |
|-----------------------------------------------------------------------------|
|                         Created by Erik Arvidsson                           |
|                  (http://webfx.eae.net/contact.html#erik)                   |
|                      For WebFX (http://webfx.eae.net/)                      |
|-----------------------------------------------------------------------------|
|                  Copyright (c) 1998 - 2003 Erik Arvidsson                   |
|-----------------------------------------------------------------------------|
| This software is provided "as is", without warranty of any kind, express or |
| implied, including  but not limited  to the warranties of  merchantability, |
| fitness for a particular purpose and noninfringement. In no event shall the |
| authors or  copyright  holders be  liable for any claim,  damages or  other |
| liability, whether  in an  action of  contract, tort  or otherwise, arising |
| from,  out of  or in  connection with  the software or  the  use  or  other |
| dealings in the software.                                                   |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| This  software is  available under the  three different licenses  mentioned |
| below.  To use this software you must chose, and qualify, for one of those. |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| The WebFX Non-Commercial License          http://webfx.eae.net/license.html |
| Permits  anyone the right to use the  software in a  non-commercial context |
| free of charge.                                                             |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| The WebFX Commercial license           http://webfx.eae.net/commercial.html |
| Permits the  license holder the right to use  the software in a  commercial |
| context. Such license must be specifically obtained, however it's valid for |
| any number of  implementations of the licensed software.                    |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
| GPL - The GNU General Public License    http://www.gnu.org/licenses/gpl.txt |
| Permits anyone the right to use and modify the software without limitations |
| as long as proper  credits are given  and the original  and modified source |
| code are included. Requires  that the final product, software derivate from |
| the original  source or any  software  utilizing a GPL  component, such  as |
| this, is also licensed under the GPL license.                               |
|-----------------------------------------------------------------------------|
| 2002-01-?? | First working version                                          |
| 2002-02-17 | Cleaned up for 1.0 public version                              |
| 2003-02-18 | Changed from javascript uri for anchors to return false        |
| 2003-03-03 | Added dispose methods to release IE memory                     |
|-----------------------------------------------------------------------------|
| Dependencies: *.css           a css file to define the layout               |
|-----------------------------------------------------------------------------|
| Created 2002-01-?? | All changes are in the log above. | Updated 2003-03-03 |
\----------------------------------------------------------------------------*/

// This function is used to define if the browser supports the needed
// features

function hasSupport() {

	if (typeof hasSupport.support != "undefined")
		return hasSupport.support;
	
	var ie55 = /msie 5\.[56789]/i.test( navigator.userAgent );
	
	hasSupport.support = ( typeof document.implementation != "undefined" &&
			document.implementation.hasFeature( "html", "1.0" ) || ie55 );
			
	// IE55 has a serious DOM1 bug... Patch it!
	if ( ie55 ) {
		document._getElementsByTagName = document.getElementsByTagName;
		document.getElementsByTagName = function ( sTagName ) {
			if ( sTagName == "*" )
				return document.all;
			else
				return document._getElementsByTagName( sTagName );
		};
	}

	return hasSupport.support;
}

///////////////////////////////////////////////////////////////////////////////////
// The constructor for tab panes
//
// el : HTMLElement		The html element used to represent the tab pane
// bUseCookie : Boolean	Optional. Default is true. Used to determine whether to us
//						persistance using cookies or not
//
function WebFXTabPane( el, bUseCookie ) {
	if ( !hasSupport() || el == null ) return;
	this.id = el.id ;
	this.IsShow = true;
	
	this.element = el;
	this.element.tabPane = this;
	this.pages = [];
	this.selectedIndex = null;
	this.useCookie = bUseCookie != null ? bUseCookie : true;
	
	// add class name tag to class name
	this.element.className = this.classNameTag + " " + this.element.className;
	
	// add tab row
	this.tabRow = document.createElement( "div" );
	this.tabRow.className = "tab-row";
	el.insertBefore( this.tabRow, el.firstChild );

	var tabIndex = 0;
	/*
	if ( this.useCookie ) {
		tabIndex = Number( WebFXTabPane.getCookie( "webfxtab_" + this.element.id ) );
		if ( isNaN( tabIndex ) )
			tabIndex = 0;
	}*/
	this.selectedIndex = tabIndex;
	
	// loop through child nodes and add them
	var cs = el.childNodes;
	var n;
	for (var i = 0; i < cs.length; i++) {
		if (cs[i].nodeType == 1 && cs[i].className == "tab-page") {
			this.addTabPage( cs[i] );
		}
	}
}

WebFXTabPane.prototype.classNameTag = "dynamic-tab-pane-control";

WebFXTabPane.prototype.setSelectedIndex = function ( n ) {
	if (this.selectedIndex != n) {
		if (this.selectedIndex != null && this.pages[ this.selectedIndex ] != null )
			this.pages[ this.selectedIndex ].hide();
		this.selectedIndex = n;
		this.pages[ this.selectedIndex ].show();
		
		if ( this.useCookie )
			WebFXTabPane.setCookie( "webfxtab_" + this.element.id, n );	// session cookie
	}
};
	
WebFXTabPane.prototype.getSelectedIndex = function () {
	return this.selectedIndex;
};
	
WebFXTabPane.prototype.addTabPage = function ( oElement ) {
	//alert(oElement.id)
	if ( !hasSupport() ) return;
	
	if ( oElement.tabPage == this )	// already added
		return oElement.tabPage;

	var n = this.pages.length;
	var tp = this.pages[n] = new WebFXTabPage( oElement, this, n );
	tp.tabPane = this;
	
	// move the tab out of the box
	this.tabRow.appendChild( tp.tab );
			
	if ( n == this.selectedIndex )
		tp.show();
	else
		tp.hide();
		
	
	return tp;
	
};
	
WebFXTabPane.prototype.dispose = function () {
	this.element.tabPane = null;
	this.element = null;		
	this.tabRow = null;
	
	for (var i = 0; i < this.pages.length; i++) {
		this.pages[i].dispose();
		this.pages[i] = null;
	}
	this.pages = null;
};



// Cookie handling
WebFXTabPane.setCookie = function ( sName, sValue, nDays ) {
	var expires = "";
	if ( nDays ) {
		var d = new Date();
		d.setTime( d.getTime() + nDays * 24 * 60 * 60 * 1000 );
		expires = "; expires=" + d.toGMTString();
	}
	document.cookie = sName + "=" + sValue + expires + "; path=/";
};

WebFXTabPane.getCookie = function (sName) {
	var re = new RegExp( "(\;|^)[^;]*(" + sName + ")\=([^;]*)(;|$)" );
	var res = re.exec( document.cookie );
	return res != null ? res[3] : null;
};

WebFXTabPane.removeCookie = function ( name ) {
	setCookie( name, "", -1 );
};

//增加页
WebFXTabPane.prototype.AddPage = function() {
    var odiv = document.createElement("div");
    odiv.className = "tab-page";
    odiv.style.height = this.pages[0].element.style.height;
    odiv.style.width = this.pages[0].element.style.width;
    var objHTML = $id(this.id);
    //alert(this.id);
    //alert(objHTML.outerHTML)
    if (objHTML.getAttribute("controltype") == "page")
        var sPage = "<iframe " + unescape(objHTML.getAttribute("iframeProps")) + " srcbak='' ></iframe>";
    else
        var sPage = "<table border=0 width='98%' align='center'><tr><td></td></tr></table>";

    odiv.innerHTML = '<h2 class="tab">增加新页</h2>' + sPage;
    this.addTabPage(odiv);

    document.getElementById(this.id).insertBefore(odiv);
    if (this.IsShow == false)
        this.HideTitle();
    //alert(tabPane1.outerHTML)
};

//删除页(只有两页时不能删除)
WebFXTabPane.prototype.DelPage = function ()
{
	//if (this.pages.length>2)
	//{
		arr1 = this.pages.slice(0,this.selectedIndex);
		arr2 = this.pages.slice(this.selectedIndex+1);
		
		this.pages = arr1.concat(arr2);
		var all = document.getElementsByTagName("*");
		for (var i=0;i<all.length;i++ )
		{
			cn=all[i].className;
			if (cn == "tab selected")
			{
				all[i].outerHTML = "";
			}
		}
		for (var j=0;j<this.pages.length;j++ )
		{
			this.pages[j].index = j;
		}
		
		document.getElementById(this.id).childNodes[this.selectedIndex+1].outerHTML = "";
		if (this.selectedIndex == 0)
			this.setSelectedIndex(this.pages.length-1);
		else
			this.setSelectedIndex(0);
	//}else
	//{
	//	alert("只有两页,不能删除!");		
	//}
};

//隐藏标题
WebFXTabPane.prototype.HideTitle = function ()
{
	this.IsShow = false;
	var all = document.getElementsByTagName("*");
	for (var i=0;i<all.length;i++ )
	{
		cn=all[i].className;
		if (cn == "tab" || cn == "tab selected")
		{
			all[i].style.display = "none";
		}
	}
};
//显示标题
WebFXTabPane.prototype.ShowTitle = function()
{
	this.IsShow = true;
	var all = document.getElementsByTagName("*");
	for (var i=0;i<all.length;i++ )
	{
		cn=all[i].className;
		if (cn == "tab" || cn == "tab selected")
		{
			all[i].style.display = "";
		}
	}
};
//设置iframe的url,iPageNo为从0开始的页号
WebFXTabPane.prototype.SetUrl = function(iPageNo, sUrl) {
    var obj = $id(this.id);
    //CopyToPub(obj.childNodes(iPageNo + 1).outerHTML);
    var oIframe = obj.childNodes[iPageNo + 1].childNodes[0];
    if (oIframe == null) return;
    //if (oIframe.tagName != "IFRAME") { 
        
    //}
    oIframe.setAttribute("srcbak", sUrl);
    oIframe.src = sUrl;
    oIframe.setAttribute("isLoaded", 1);
};
//设置iframe的页的点击事件代码,iPageNo为从0开始的页号
WebFXTabPane.prototype.SetClick = function(iPageNo, sClick) {
    var obj = $id(this.id);
    var oIframe = obj.childNodes[iPageNo + 1].childNodes[0];
    oIframe.setAttribute("pageClick", sClick);
};

//上一页
WebFXTabPane.prototype.PrevPage = function()
{
	var inti=this.selectedIndex;
	if (inti==0)
	{
		inti=inti;
	}
	else
	{
		inti=inti-1;
	}
	this.setSelectedIndex(inti);
};

//下一页
WebFXTabPane.prototype.NextPage = function()
{
	var inti=this.selectedIndex;
	if (inti==this.pages.length-1)
	{
		inti=inti;
	}
	else
	{
		inti=inti+1;
	}
	this.setSelectedIndex(inti);
};
//修改标题
WebFXTabPane.prototype.EditTitle = function(svalue)
{
	var all = document.getElementsByTagName("*");
	for (var i=0;i<all.length;i++ )
	{
		cn=all[i].className;
		if (cn == "tab selected")
		{
			all[i].innerText = svalue;
			//alert(all[i].innerText);
		}
	}
};
//移动节点0:上移；1：下移

WebFXTabPane.prototype.Move = function(flg)
{
	var selIndex=this.selectedIndex;
	if (flg==0)
	{
		if (selIndex == 0) return;
		var oTitle = document.getElementById(this.id).childNodes[0].childNodes[selIndex];
		var oContent = document.getElementById(this.id).childNodes[selIndex+1]; //+2 有一个tab和script节点
		var oTitleUp = document.getElementById(this.id).childNodes[0].childNodes[selIndex-1];
		var oContentUp = document.getElementById(this.id).childNodes[selIndex];	// +1  == +2-1
		//交换div
		oTitle.swapNode(oTitleUp);
		oContent.swapNode(oContentUp);	
		//交换pages数组
		var arr =this.pages[selIndex-1];
		this.pages[selIndex-1] = this.pages[selIndex];
		this.pages[selIndex] = arr;
		//交换index
		this.pages[selIndex-1].index = selIndex-1;
		this.pages[selIndex].index = selIndex;
		//给新的当前选中页
		this.selectedIndex = selIndex-1;
	}else
	{
		if (selIndex == this.pages.length-1) return;
		var oTitle = document.getElementById(this.id).childNodes[0].childNodes[selIndex];
		var oContent = document.getElementById(this.id).childNodes[selIndex+1]; //+2 有一个tab和script节点
		var oTitleDown = document.getElementById(this.id).childNodes[0].childNodes[selIndex+1];
		var oContentDown = document.getElementById(this.id).childNodes[selIndex+2];	// +3  == +2+1
		//交换div
		oTitle.swapNode(oTitleDown);
		oContent.swapNode(oContentDown);	
		//交换pages数组
		var arr =this.pages[selIndex+1];
		this.pages[selIndex+1] = this.pages[selIndex];
		this.pages[selIndex] = arr;
		//交换index
		this.pages[selIndex+1].index = selIndex+1;
		this.pages[selIndex].index = selIndex;
		//给新的当前选中页
		this.selectedIndex = selIndex+1;
	}
};




///////////////////////////////////////////////////////////////////////////////////
// The constructor for tab pages. This one should not be used.
// Use WebFXTabPage.addTabPage instead
//
// el : HTMLElement			The html element used to represent the tab pane
// tabPane : WebFXTabPane	The parent tab pane
// nindex :	Number			The index of the page in the parent pane page array
//
function WebFXTabPage( el, tabPane, nIndex ) {
	if ( !hasSupport() || el == null ) return;
	
	this.element = el;
	this.element.tabPage = this;
	this.index = nIndex;
	
	var cs = el.childNodes;
	for (var i = 0; i < cs.length; i++) {
		if (cs[i].nodeType == 1 && cs[i].className == "tab") {
			if(el.parentNode.getAttribute("IsHideTitle") == "是") cs[i].style.display = "none" ;
			this.tab = cs[i];
			break;
		}
	}
	
	// insert a tag around content to support keyboard navigation
	
	
	var a = document.createElement( "A" );
	this.aElement = a;
	a.href = "#";
	a.onclick = function () { return false; };
	while ( this.tab.hasChildNodes() )
		a.appendChild( this.tab.firstChild );
	this.tab.appendChild( a );

	
	// hook up events, using DOM0
	var oThis = this;

	this.tab.onclick = function() {
	    oThis.select();
	    //处理page页控件时,点某页时才加载
	    var oIframe;
	    //alert(oThis.element.outerHTML);
	    if (oThis.element.childNodes.length > 0 && oThis.element.childNodes[0].tagName == "IFRAME") {
	        oIframe = oThis.element.childNodes[0];
	        var sClick = oIframe.getAttribute("pageClick");
	        if (IsSpace(sClick) == false) {
	            eval(sClick);
	        }
	        if (oIframe.getAttribute("isLoaded") != 1) {
	            oIframe.src = oIframe.getAttribute("srcbak");
	            oIframe.setAttribute("isLoaded" , 1);
	        }
	    }


	    //增加一个页签的点击事件
	    eval("try{PubClickPageControl(" + oThis.index + ");}catch(e){}");
	    //eval("PubClickPageControl("+oThis.index+");") ;
	    //alert("aa");
	};
	this.tab.onmouseover = function () { WebFXTabPage.tabOver( oThis ); };
	this.tab.onmouseout = function () { WebFXTabPage.tabOut( oThis ); };
}


WebFXTabPage.prototype.show = function () {
	var el = this.tab;
	var s = el.className + " selected";
	s = s.replace(/ +/g, " ");
	el.className = s;
	this.element.style.display = "block";
};

WebFXTabPage.prototype.hide = function () {
	var el = this.tab;
	var s = el.className;
	s = s.replace(/ selected/g, "");
	el.className = s;

	this.element.style.display = "none";
};
	
WebFXTabPage.prototype.delPage = function () {
	var el = this.tab;
	var s = el.className;
	s = s.replace(/ selected/g, "");
	el.className = s;

	this.element.outerHTML = "";
};

WebFXTabPage.prototype.select = function () {
	//alert(this.index);
	this.tabPane.setSelectedIndex( this.index );
};
	
WebFXTabPage.prototype.dispose = function () {
	this.aElement.onclick = null;
	this.aElement = null;
	this.element.tabPage = null;
	this.tab.onclick = null;
	this.tab.onmouseover = null;
	this.tab.onmouseout = null;
	this.tab = null;
	this.tabPane = null;
	this.element = null;
};

WebFXTabPage.tabOver = function ( tabpage ) {
	var el = tabpage.tab;
	var s = el.className + " hover";
	s = s.replace(/ +/g, " ");
	el.className = s;
};

WebFXTabPage.tabOut = function ( tabpage ) {
	var el = tabpage.tab;
	var s = el.className;
	s = s.replace(/ hover/g, "");
	el.className = s;
};


// This function initializes all uninitialized tab panes and tab pages
function setupAllTabs() {
	if ( !hasSupport() ) return;

	var all = document.getElementsByTagName( "*" );
	var l = all.length;
	
	var tabPaneRe = /tab\-pane/;
	var tabPageRe = /tab\-page/;
	var cn, el;
	var parentTabPane;
	
	for ( var i = 0; i < l; i++ ) {
		el = all[i];
		cn = el.className;

		// no className
		if ( cn == "" ) continue;
		
		// uninitiated tab pane
		if ( tabPaneRe.test( cn ) && !el.tabPane )
			new WebFXTabPane( el );
	
		// unitiated tab page wit a valid tab pane parent
		else if ( tabPageRe.test( cn ) && !el.tabPage &&
					tabPaneRe.test( el.parentNode.className ) ) {
			el.parentNode.tabPane.addTabPage( el );			
		}
	}
}

function disposeAllTabs() {
	if ( !hasSupport() ) return;
	
	var all = document.getElementsByTagName( "*" );
	var l = all.length;
	var tabPaneRe = /tab\-pane/;
	var cn, el;
	var tabPanes = [];
	
	for ( var i = 0; i < l; i++ ) {
		el = all[i];
		cn = el.className;

		// no className
		if ( cn == "" ) continue;
		
		// tab pane
		if ( tabPaneRe.test( cn ) && el.tabPane )
			tabPanes[tabPanes.length] = el.tabPane;
	}
	
	for (var i = tabPanes.length - 1; i >= 0; i--) {
		tabPanes[i].dispose();
		tabPanes[i] = null;
	}
}
/**
* 设置tab控件的宽度值,2010-12-07 my add
**/
function setTabWidth(objId, iValue) {
    objId.style.width = iValue;
    var newValue = ToInt(iValue);
    if (newValue < 0) newValue = 0;
    for (var i = 0; i < objId.childNodes.length; i++) {
        if (objId.childNodes[i].className == "tab-page")
            objId.childNodes[i].style.width = newValue;
    }
}
/**
* 设置tab控件的高度值
**/
function setTabHeight(objId, iValue) {
    objId.style.height = iValue;
    var newValue = ToInt(iValue) - 18;
    if (newValue < 0) newValue = 0;
    for (var i = 0; i < objId.childNodes.length; i++) {
        if (objId.childNodes[i].className == "tab-page")
            objId.childNodes[i].style.height = newValue;
    }
}

// initialization hook up

// DOM2
if ( typeof window.addEventListener != "undefined" )
	window.addEventListener( "load", setupAllTabs, false );

// IE 
else if ( typeof window.attachEvent != "undefined" ) {
	window.attachEvent( "onload", setupAllTabs );
	window.attachEvent( "onunload", disposeAllTabs );
}

else {
	if ( window.onload != null ) {
		var oldOnload = window.onload;
		window.onload = function ( e ) {
			oldOnload( e );
			setupAllTabs();
		};
	}
	else 
		window.onload = setupAllTabs;
}