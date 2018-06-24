///<reference name="MicrosoftAjax.js" />
///<reference path="fcpub.js" />
///<reference path="fcother.js" />


(function() {
	var scripts =  [ fcpubdata.path + "/fceformext/js/usertb.js" ];
	var heads = document.getElementsByTagName("head");
	if(heads.length>0){
		for (var i = 0; i < scripts.length; ++i) {
		    var script = document.createElement("script");
		    script.src = scripts[i];
		    heads[0].appendChild(script);
	    }
	}
})();

Eapi.RunForm = function(){}
Eapi.RunForm.prototype =
{
    setPara : SetPara ,
    getPara : GetPara ,
    setParaPub : SetParaPub ,
    getParaPub : GetParaPub ,
    loadMod : LoadMod ,
    closeBill : CloseBill ,
    setButtonImage : SetButtonImage ,
    sqlPropTrans : SqlPropTrans ,
    unSqlPropTrans : UnSqlPropTrans ,
    getFirstGridDs : Getdssub1 ,
    toolbarFunc : $eform ,
    //dbSql : DbSql ,
    //dbSqlCombo   : DbSqlCombo ,
    checkFieldRepeat : CheckFieldRepeat ,
    getKeyFieldValue : function () {
        ///找到当前界面上主键字段的值,用于修改保存时.
        ///@date 2008-02-26
        var sRet = "";
        var oDsMain = $id(fcpubdata.dsMain) ;
        var sIdType = fcpubdata.area.getAttribute("idtype");
        if(sIdType != 5){
            sRet = oDsMain.Field(fcpubdata.area.getAttribute("keyfield")).Value;
        }
        return sRet;    
    },
    getConts : function () {
        ///<summary>取表单上的所有控件</summary>
        //<root><checkbox><id>checkbox1</id></checkbox></root>
	    fcpubdata.controls = new Object();
	    var sContXml = fcpubdata.area.getAttribute("contxml");
	    var oConts = SetDom(sContXml);
	    if(oConts.documentElement != null ){
            for(var kk=0;kk<oConts.documentElement.childNodes.length;kk++){
                var typeName = oConts.documentElement.childNodes[kk].nodeName;
                fcpubdata.controls[typeName]=new Array();
                for(var kkk=0;kkk<oConts.documentElement.childNodes[kk].childNodes.length;kkk++){
//                    fcpubdata.controls[typeName][kkk] = $id(oConts.documentElement.childNodes(kk).childNodes(kkk).text);
                    fcpubdata.controls[typeName][kkk] = $id( NavJs.getNodeValue11(oConts,kk,kkk) );
                }
            }
        }
    
    },
    gridAddEmptyRow : GridAddEmptyRow 
}
Eapi.RunForm.registerClass("Eapi.RunForm");


/**
*以下两函数用于在两个单据之间传参数时使用
*@param paraname 参数名称
*@param vValue 参数值
*@date 2003-12-05
**/

function SetPara(paraname,vValue){
	SaveUserData("pub",paraname,vValue);
}
function GetPara(paraname){
	return LoadUserData("pub",paraname ) ;
}
function SetParaPub(vValue){
	SaveUserData("pub","pub",vValue) ;	
}
function GetParaPub(){
	return LoadUserData("pub","pub" ) ;
}
/**
*装入各个事件的处理模块
*@param sKey1 标识调用不同的函数,如为空则表示啥也不做,例如:sKey1="savedj" 
*@param sclass 函数分类参数  ='clickmenu'点击主菜单 ='click'非表格控件的事件 ='grid'表格事件(右键菜单,表格ID存在sXml参数中)  ='gridclick'表格中的事件(分列处理单击双击按键三个事件)
*@param sXml 为表格事件中为区分从哪一列发出的XML串,此参数只用于表格事件中.
*@return 无
**/
function LoadMod(sKey1, sclass, sXml) {
 
    if(arguments.length==0 || isSpace(sKey1) ) return;
    var sKey=new Eapi.Str().trim(sKey1);
    var blnRemove=false;  //true 表示去掉了后面的()
    //去掉右边的()
    if(sKey.length>2){
   		if(sKey.substring(sKey.length-2,sKey.length)=="()"){
   			sKey=sKey.substring(0,sKey.length-2);
   			blnRemove=true;
   		}
    }
 
 
    var curO,ogrid,o,i ;
//    if(sclass=="click"){
//        curO=NavJs.getEventObj() ;
//    }
//    
    if (sclass == "gridclick") {
       curO = NavJs.getEventObj();
	   //if(event.srcElement.id!="txtMyGrid") return
	   var oXml=SetDom(sXml);
	    
		//根据列号得到相同的命令      
	   ogrid=$obj(oXml.documentElement.tagName);
	   //当前列号
	   var curcol = ogrid.curTD.cellIndex;
	   //加上如下的代码以使点击checkbox列时会发生点击事件 2010-07-28 my add
	   var curEventTD = NavJs.getEventObj();
	   if (IsSpace(curEventTD) == false && curEventTD.tagName == "TD") {
	       if (curEventTD.style.backgroundImage == "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checked.gif)" || curEventTD.style.backgroundImage == "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheck.gif)") {
	           curcol = curEventTD.cellIndex;
	       }
           //加下面一行,以防止点到固定行列上时还会执行点击事件的代码.2010-12-09 my add
	       if (curEventTD.cellIndex < ogrid.FixCols || IsSpace(curEventTD.parentNode) || curEventTD.parentNode.rowIndex < ogrid.FixRows) return;
	   }
	   //=================
       
	   if(curcol>0 && oXml.documentElement.childNodes.length>0){ 
			try{
//	   			sKey=oXml.documentElement.childNodes(curcol-1).text;
			    sKey = NavJs.getNodeValue1(oXml, curcol - 1); //oXml.documentElement.childNodes(curcol - 1).text;
	        } catch (e) { return; }
   	   }else{
   	   		return	;
	   }
		//alert("sKey:"+sKey)   	   		
   }
	//表格右键功能
//	if(sclass=="grid"){
//		ogrid=$obj(sXml);
//		var grid_ds=$obj(ogrid.dataset);
//		//当表格只有一行时加行出错
//		try {
//		    curO = NavJs.getEventObj();
//      	}catch (e) {}
//	}

  	//找不到则当命令来运行，如运行出错则显示
 	if(isSpace(sKey)==false){
 	    if (blnRemove) sKey = sKey + "()";
 	    var oEvent = NavJs.getEvent();
 	    var oEventObj = NavJs.getEventObj();
 	    if (oEvent != null && (oEvent.type == "change" || oEvent.type == "blur")) sKey = "var objContEvent = $id('" + oEventObj.id + "'); if(objContEvent!=null) objContEvent.setAttribute('stopValid',0); try {" + sKey + "}catch (e) {if(IsSpace(e.description) == false) alert(e.description);if(objContEvent!=null) objContEvent.setAttribute('stopValid',1);}"; //change事件时用于做验证函数
 	    var oev = new Function("oEvent", sKey);
        oev(oEvent);
 	    
 	    //NavJs.insertEventParam(sKey, oEvent);
 	      
    	//eval(sKey);
    	//try {
    	//}catch (e) {
    	//	alert(sKey+"函数运行出错，原因："+e.description);
    	//}
    }


}

/**
*单据的单击菜单事件处理
**/
function clickmenu(sKey) {
   LoadMod(sKey,"clickmenu");
}
/**
*单据的表格右击菜单事件处理
*@param sKey 处理函数名
*@param gridID 表格ID
*@date 2003-05-23
**/
function clickrightmenu(sKey,gridID) {
   LoadMod(sKey,"grid",gridID);
}
/**
*单据的open事件处理
**/

function bill_blonopen(sKey) {
   LoadMod(sKey,"clickmenu");
}
function bill_blonclose(sKey) {
   LoadMod(sKey,"clickmenu");
}

/**
*单据的单击事件处理
**/
function bill_onclick(sKey){
//用sKey来标识调用不同的函数,如为空则表示啥也不做
	//alert('a'+event.srcElement.isContentEditable)
	//if(event.srcElement.isContentEditable==false){
		/*if(typeof sKey == 'function'){
			sKey=sKey.toString()
			alert(sKey)
		}*/
    
		LoadMod(sKey,"click");
	//}
}
/**
*单据的双击事件处理
**/
function bill_ondblclick(sKey, ogrid) {
	LoadMod(sKey,"click");
}
/**
*单据的获得焦点事件处理
**/
function bill_onenter(sKey){
	//if(event.srcElement.isContentEditable==false){
	
		LoadMod(sKey,"click");
	//}
}
/**
*单据的失去焦点事件处理
**/
function bill_onexit(sKey){
	//if(event.srcElement.isContentEditable==false){
		LoadMod(sKey,"click");
	//}
}
/**
*单据的按键事件处理
**/
function bill_onkeydown(sKey){
	//if(event.srcElement.isContentEditable==false){
	/*
	var keycode=event.keyCode
	if(keycode==13) { //回车键
		var s2=event.srcElement.ondblclick
		if(s2 != null ){
			//去掉{}外边的东西
			var s1=s2+""
			s1=s1.substring(22,s1.length-1)
			//alert(s1)
			if(isSpace(s1)==false){
				try{
					eval(s1)
				}catch(e){}
			}
		}
	}*/
	LoadMod(sKey,"click");
	//}
}
/**
*运行导航
**/
function RunTabindex(){
	var sXml=fcpubdata.area.getAttribute("billtaborder");
	if(sXml=="<root></root>")return ;//界面无一控件.
	
   //var stagname=event.srcElement.tagName.toUpperCase()
   //if(stagname=="TEXTAREA" || event.srcElement.id=="txtMyGrid" ) return
	var evt = NavJs.getEvent();
	var ikeycode = evt.keyCode;
	var objSrc = NavJs.getEventObj();

	

	//	alert("aaa")
	//	topic.focus()
/*	
   if(ikeycode==27) {
		var ret = window.confirm("确定关闭当前窗口吗？");		
		if (ret) {
   			parent.window.close()  //ESC键退出
		}   		
   }
*/   //alert(ikeycode)
   //|| ikeycode==40 || ikeycode==13  || ikeycode==38
   if( ikeycode==9){ //tab键
       
       var bRunUp=false;  //表示向下走,true表示向上走
       if(ikeycode==38) bRunUp=true;
       //如当前控件为 checkbox 则取父ID

       curID = objSrc.id;
       if (curID == "chk") curID = objSrc.parentNode.parentNode.id;
		//如当前控件为空,取父ID,指radio
       if (isSpace(curID)) curID = objSrc.parentNode.id;
	   //如为fccode控件
       if (curID == "fc_txtName") curID = objSrc.parentNode.id;
       if (curID == "Numedit") curID = objSrc.parentNode.id;
	   //表示当前为表格控件
       if (objSrc.id == "txtMyGrid") curID = objSrc.parentNode.parentNode.id;
       if (objSrc.id == "t") curID = objSrc.parentNode.parentNode.id;
       if (objSrc.tagName.toUpperCase() == "TD") curID = objSrc.parentNode.parentNode.parentNode.parentNode.parentNode.id;
	   
	   
	   //alert(event.srcElement.tagName+":"+curID)	   

	   
	   //var sXml="<root><s>SKDBedit1</s><s>SKDBedit3</s><s>SKDBedit4</s><s>SKDBcombobox1</s><s>SKDBcheckbox1</s><s>SKBILLgrid1</s><s>SKDBMemo1</s></root>"
		//sXml=fcpubdata.area.billtaborder;
		//alert(sXml)
	   var oXml=SetDom(sXml);
	   var b1=false;
	   for(var i=0;i<oXml.documentElement.childNodes.length;i++){
	        if( NavJs.getNodeValue1(oXml,i)==curID){
	       	    b1=true;
	       	    break;
	       	}
	   }
	   
			   
		if(b1==false){
	      i=0;
		}	   	


	   //加上当下一个控件不可见或不可用时要将焦点再移到下一个控件.
		var iLoops=1;  //为避免死循环,限制最多循环20个
		while(iLoops<20){
			if(bRunUp){
			  if(i==0)
			      i=oXml.documentElement.childNodes.length-1;
			  else
			      i=i-1;
			}else {
			  if(i==oXml.documentElement.childNodes.length-1)
			      i=0;
			  else
			      i=i+1;
			}

			var nextObj = $id(NavJs.getNodeValue1(oXml, i));
			var gridObj = $obj(nextObj.id); //htc控件的对象
			
			var stagname1=nextObj.tagName.toUpperCase();
			if(nextObj.disabled || nextObj.style.display=="none"){
				iLoops++;
				continue;			  	
			}else{
				if(stagname1=="FIELDSET"){
				  if(nextObj.childNodes.length > 1) try{nextObj.childNodes[1].focus();}catch(E){}
				}else if(stagname1=="FC_CODE"){
				//nextObj.txt.focus() ;
					gridObj.fc_txtName.focus();
				}else if(stagname1=="DIV") {
					try { nextObj.txt.focus() ;}catch(e){}
	            } else if (stagname1 == "WEBGRID" || stagname1 == "FC:WEBGRID") {
	                if (gridObj.visible == "是") {
					    if (gridObj.tab.rows.length >= gridObj.FixRows) {
					        gridObj.SetFocus(gridObj.FindFirstTD(gridObj.FixRows), "程序给焦点");
	
						}else{
						    gridObj.SetFocus(null, "");
							//给当前TD焦点
						    gridObj.curTD.focus();
						}					
						//nextObj.SetFocus(null,"")
						//给当前TD焦点
						//nextObj.curTD.focus()
					}else {
						iLoops++;
						continue;			  	
					
					}
				}else {
					//因页签控件使控件不可见则出错
					try{
				  		nextObj.focus();
					}catch(E){}
			    }
			}
			iLoops=21;
		}

		evt.returnValue = false;
   }


}
//页面打开时设置第一个控件的焦点
function FirstFocus(){
    var sXml = fcpubdata.area.getAttribute("billtaborder");
	if(sXml=="<root></root>")return; //界面无一控件.
	//alert(sXml)
	var oXml=SetDom(sXml);
	var ll=oXml.documentElement.childNodes.length;
	i=0;
	while(i<20 && i<ll){
	    var nextObj = $id(NavJs.getNodeValue1(oXml, i));
	    var gridObj = $obj(nextObj.id);
	    
		var stagname1=nextObj.tagName.toUpperCase();
		if(nextObj.disabled || nextObj.style.display=="none"){
			i++;
			continue;			  	
		}else{
			if(stagname1=="FIELDSET"){
			    if (nextObj.childNodes.length > 1) try { nextObj.childNodes[1].focus(); } catch (eer) { }
			//alert(nextObj.childNodes(1).tagName)
        } else if (stagname1 == "WEBGRID" || stagname1 == "FC:WEBGRID") {
			    if (gridObj.visible == "是") {
			        if (gridObj.tab.rows.length >= gridObj.FixRows) {
			            gridObj.SetFocus(gridObj.FindFirstTD(gridObj.FixRows), "程序给焦点");

					}else{
					    gridObj.SetFocus(null, "");
						//给当前TD焦点
					    gridObj.curTD.focus();
					}
					//nextObj.SetFocus(nextObj.curTD);
				}else {
					i++;
					continue;			  	
				}
			}else {
				//因页签控件使控件不可见则出错
				try{
			  		nextObj.focus();
			  	}catch(E){}
			}
		}
		i=21;
	}

}


/**
*此处可以使用document.write
*@date 2004-05-19
**/
function pub_djhtm() {
    fcpubdata.logger().debug("init start!", arguments.callee);
    parent.fcpubdata.loading = "init";

    if (!IsSpace(Eform.AllWidget)) {
        new Eform.AllWidget().readyBefore();
    }

    //document.writeln("<img id=imgFcWait src='../../fceform/images/ef_wait.gif' style='position:absolute;left:30px;top:30px;'>");
    
    fcpubdata.keyValue = parent.sOpenDjNo ; //给初值
   //单据全局变量
    fcpubdata.obj = fcpubdata.keyValue;   //让只传一个字符变量时,pubDataSet也是此字符变量的值.
	
	if(typeof fcpubdata.keyValue == "object"){
		fcpubdata.keyValue="";
	} 
	//var skinJs = "<script src='../css/skins/fcskins.js'></" + "script>";
	//var sSkin
	//alert(fcpubdata.skins);
	//if(typeof(parent.pubMainObj) != "undefined"){ //加上此判断,以免直接运行表单生成的htm文件时出错.
    //    sSkin = parent.pubMainObj.skins;//parent.Request.QueryString("skins").toString();
	//}
	    
//	    if(IsSpace(sSkin) ==false){
//	        fcpubdata.skins = sSkin;
//	        new Eapi.Css().setSkinsPath(fcpubdata.skins);
//	        fcpubdata.cssFiles[fcpubdata.cssFiles.length] = "/css/skins/"+sSkin+"/style/efskin.css";
//	    } else if(IsSpace(fcpubdata.skins) == false){
//	        fcpubdata.cssFiles[fcpubdata.cssFiles.length] = "/css/skins/"+fcpubdata.skins+"/style/efskin.css";
//	    }else{
//	        //skinJs = "";
//	    }
//	    //if(sSkin != "base") document.writeln(skinJs);

	    new Eapi.Css().actionSkins();

	    new Eapi.Css().setSkinsPath(fcpubdata.skins);
	    
	    fcpubdata.cssFiles[fcpubdata.cssFiles.length] = "/css/skins/" + fcpubdata.skins + "/style/efskin.css";
    	
	    var basePath = fcpubdata.path+fcpubdata.skinsPath; //"/fceform"
	    for (var i = 0; i < fcpubdata.cssFiles.length; i++) {
	        document.writeln("<link href='" + basePath + fcpubdata.cssFiles[i] + "' type='text/css' rel='stylesheet'>")
	    }
	    //固定加上自定义控件的样式，my add 2013-03-21
	    document.writeln("<link href='../../widget/css/" + fcpubdata.skins + "/all.css' type='text/css' rel='stylesheet'>"); 
	    
	//清除内存
    NavJs.addEvent(window, "onunload", function() {
        fcpubdata.obj = null;
        fcpubdata.controls = null;
        fcpubdata.popup = null;
        fcpubdata.arrValidObj = null;
        fcpubdata.area = null;
    });

    if (!IsSpace(Eform.AllWidget)) {
        new Eform.AllWidget().readyAfter();
    }

    
}
function pub_window_onkeypress() {
	fcpubdata.isEdit=true;
}
function pub_window_onbeforeunload() {
	/*
	//开票单提取订单时清空加锁表djselectlock
	try{	
		var tmpgzid=GetPara("sys_gzid") ;
		SetPara('sys_gzid',"")
		//alert(tmpgzid)
		if(isSpace(tmpgzid)==false){
			try {
			//	alert("ddd")
				var sql="delete from djselectlock where gzid='"+tmpgzid+"'"
				var sRet=fc_insert(sql) ;
			}catch(E){}
		}
	}catch(e){

	}
	*/
	try{
		eval(fcpubdata.area.getAttribute("BLONclose"));
	}catch(e){}
	//if(parent.piAction != 3 && fcpubdata.isEdit){
	//	event.returnValue="离开当前页面将导致当前输入的数据丢失! 按 [确定] 则不保存数据并关闭窗口。";
	//}
	ajax_stop();
}
function pub_window_onresize() {
    //工作转移到djframe.htm 页面上做了。
}
function pub_window_onresize_bak() {
    var eventResize = fcpubdata.area.getAttribute("BLONresizeBefore");
    if (!IsSpace(eventResize))
        eval(eventResize);

    runWidget("resizeBefore()");
    //表格的自动高宽
    try {
        var winHeight = 0;
        try {
            if (window.parent.document.getElementById("filter") == null) { // 避开E表调用时
                var oToolbar = window.parent.document.getElementById("toolbar");
                if (oToolbar != null) {
                    var iHeight = ToInt(oToolbar.style.height);
                    winHeight = (getClientSize(parent).height - iHeight);
                    window.parent.document.getElementById("topic").style.height = winHeight + "px";
                }
            }
        } catch (e) {
            fcpubdata.logger().error("Resize时计算表单工具栏高度出错!", arguments.callee, e);

        }

        var o = NavJs.getGridArr() ; //window.document.all.tags("webgrid");
        var oWinSize = getClientSize();
        var winWidth = oWinSize.offsetWidth;
        if(winHeight == 0) winHeight = oWinSize.offsetHeight;
        
        //2013-07-29 add下边两行。
        if (winWidth < 100) winWidth = oWinSize.width;
        if (winHeight < 100) winHeight = oWinSize.height;
	    //alert(winWidth)
	    //var winWidth = document.body.offsetWidth;
	    //var winHeight = document.body.offsetHeight;
	   // alert(winHeight)

	    for(var ii=0;ii<o.length;ii++){

	        //if(o[ii].childNodes(0).style.position != "absolute"){
	        if (o[ii].parentNode.id != "SKbillsheet") {
	            winWidth = o[ii].parentNode.offsetWidth;
	            winHeight = o[ii].parentNode.offsetHeight;

	            //alert("winWidth=" + winWidth + "winHeight=" + winHeight)
	        } else {
	            //调用 webgrid.js 时，2013-07-25
	            if (document.compatMode == "CSS1Compat") {
	                winWidth = winWidth - 2;
	                winHeight = winHeight - 2;

	            } 	        
	        }
		    if (o[ii].getAttribute("autowidth") == "是") {

		        var tmpwidth = winWidth - parseInt(o[ii].getAttribute("left")) ; //-16 (new Eapi.GetPos().getPosLeft(o[ii])))
			    if (tmpwidth < 0) tmpwidth = 0;
			    //alert(tmpwidth)
			    o[ii].width = tmpwidth;
			    try {
			        //modify by liuxr at 2010-12-6 15:29 给grid付 height值
			        $obj(o[ii].id).fnPutwidth(tmpwidth+"px");
			    } catch (e) { }
			    
		    }
		    if (o[ii].getAttribute("autoheight") == "是") {

		        var tmpheight = winHeight - parseInt(o[ii].getAttribute("top")) ; //-10 (new Eapi.GetPos().getPosTop(o[ii])))
			    if (tmpheight < 0) tmpheight = 0;
			    //alert(tmpheight);
			    o[ii].height = tmpheight;
			    try {
			        //modify by liuxr at 2010-12-6 15:29 给grid付 height值
			        $obj(o[ii].id).fnPutheight(tmpheight + "px");
			    } catch (e) { }
			    
    			

		    }

	    }
    } catch (e) {
        fcpubdata.logger().error("处理表格的自动高宽出错!", arguments.callee, e);

    }
	
	//alert("a:"+document.body.clientWidth)

    try {
	    FormAutoResize();
	   
    }catch (e) 
    {
        fcpubdata.logger().error("FormAutoResize() 处理自动布局出错!", arguments.callee, e);
            
    }
/* 下边的代码移到 fcebiao.js 中
    var arrLayout = fcpubdata.controls["eblayout"];
    if (!IsSpace(arrLayout)) {
        for (var i = 0; i < arrLayout.length; i++) {
            var obj = arrLayout[i];
            if (obj.getAttribute("resizeType") == 1) {
                var oTable = NavJs.child(NavJs.child(obj, "div", 0), "table", 0);
                if (oTable != null) {
                    obj.style.width = oTable.offsetWidth + 0;
                    obj.style.height = oTable.offsetHeight + 0;
                }
            } else if (obj.getAttribute("resizeType") == 2) {
                new Eapi.EformEbiao().resizeTable(obj);                                     
            }
        }
    } */

    runWidget("resizeAfter()");
    //加上resize事件，2012-08-28
    var eventResize = fcpubdata.area.getAttribute("BLONresizeAfter");
    if (!IsSpace(eventResize))
        eval(eventResize);
}
//把页面上的控件按照设置布局
//added by liuxr at 2008-10-15
function FormAutoResize()
{
	var sXml = fcpubdata.area.getAttribute("AutoResizeXml");
	//alert("运行   " + sXml);
	if (IsSpace(sXml)) return ;
	var oXml = SetDom("<root>" + sXml + "</root>");
	for (var i=0;i<oXml.documentElement.childNodes.length;i++)
	{
		var id = oXml.documentElement.childNodes[i].getAttribute("id");				//控件ID

		var Halign = NavJs.getNodeValue11(oXml,i,0); //oXml.documentElement.childNodes(i).childNodes(0).text;			//水平方向对齐方式
		var HWidth = NavJs.getNodeValue11(oXml, i, 1);  		//距窗口边有多远
		var HUnit = NavJs.getNodeValue11(oXml, i, 2); 		//单位（距窗口边有多远；px/%）

		var WSetType = NavJs.getNodeValue11(oXml, i, 3); 	//宽度设置方式（百分比设置；伸缩设置）
		var Width = NavJs.getNodeValue11(oXml, i, 4); 		//宽度
		var WExt = NavJs.getNodeValue11(oXml, i, 5); 		//宽度变化伸缩到距右多远(px/%)
		var WSetUnit = NavJs.getNodeValue11(oXml, i, 6); 	//单位（宽度变化伸缩到距右多远）
		var MinW = NavJs.getNodeValue11(oXml, i, 7); 		//最小值（宽度）

		var Palign = NavJs.getNodeValue11(oXml, i, 8); 		//垂直方向对齐方式
		var PWidth = NavJs.getNodeValue11(oXml, i, 9); 		//距窗口边有多远
		var PUnit = NavJs.getNodeValue11(oXml, i, 10); 		//单位（距窗口边有多远；px/%）

		var HSetType = NavJs.getNodeValue11(oXml, i, 11); 	//高度设置方式（百分比设置；伸缩设置）
		var Height = NavJs.getNodeValue11(oXml, i, 12); 	//高度
		var HExt = NavJs.getNodeValue11(oXml, i, 13); 		//高度变化伸缩到距下多远(px/%)
		var HSetUnit = NavJs.getNodeValue11(oXml, i, 14); 	//单位（高度变化伸缩到距右多远）
		var MinH = NavJs.getNodeValue11(oXml, i, 15); 		//最小值（高度）

		var objCont = $id(id);
		runAutoResize({
		    type: "width", //要调整的属性
		    objCont: objCont, //要调整的控件对象
		    align: "", //对齐方式
		    setType: WSetType, //伸缩设置、百分比设置
		    value100: Width, //百分比值
		    valueUnit: WExt,  //伸缩时，距右或距下的值，对齐时，距窗口边的值。
		    unitName: WSetUnit, //单位 px/%
		    minValue: MinW //最小值。

		});
		runAutoResize({
		    type: "height", //要调整的属性
		    objCont: objCont, //要调整的控件对象
		    align: "", //对齐方式
		    setType: HSetType, //伸缩设置、百分比设置
		    value100: Height, //百分比值
		    valueUnit: HExt,  //伸缩时，距右或距下的值，对齐时，距窗口边的值。
		    unitName: HSetUnit, //单位 px/%
		    minValue: MinH //最小值。

		});
		runAutoResize({
		    type: "left", //要调整的属性
		    objCont: objCont, //要调整的控件对象
		    align: Halign, //对齐方式
		    setType: "", //伸缩设置、百分比设置
		    value100: "", //百分比值
		    valueUnit: HWidth,  //伸缩时，距右或距下的值，对齐时，距窗口边的值。
		    unitName: HUnit, //单位 px/%
		    minValue: "" //最小值。

		});
		runAutoResize({
		    type: "top", //要调整的属性
		    objCont: objCont, //要调整的控件对象
		    align: Palign, //对齐方式
		    setType: "", //伸缩设置、百分比设置
		    value100: "", //百分比值
		    valueUnit: PWidth,  //伸缩时，距右或距下的值，对齐时，距窗口边的值。
		    unitName: PUnit, //单位 px/%
		    minValue: "" //最小值。

		});		
		
	/*	 		
		var ObjId = $id(id);		//控件对象
		//alert(id);
		//alert(document.body.offsetWidth);
		//控件宽度
		var iWidth = CalObjWidthOrHeight(ObjId,"宽度",WSetType,Width,WExt,WSetUnit,MinW);
		if (parseInt(iWidth, 10) > 0) setContPosValue(ObjId, "width", iWidth); //ObjId.style.width = iWidth; 
		//alert("width：" +ObjId.style.width);
		
		//控件高度
		var iHeight = CalObjWidthOrHeight(ObjId,"高度",HSetType,Height,HExt,HSetUnit,MinH);
		if (parseInt(iHeight, 10) > 0) setContPosValue(ObjId, "height", iHeight); //ObjId.style.height = iHeight;
		//alert("height：" + ObjId.style.height )
		
		//水平对齐
		//debugger;
		var ileft = CalObjLeftOrTop(ObjId,"left",Halign,HWidth,HUnit);
		if (parseInt(ileft, 10) > 0) setContPosValue(ObjId, "left", ileft); //ObjId.style.left = ileft;
		//alert("left：" + ObjId.style.left);
		
		//垂直对齐
		var itop = CalObjLeftOrTop(ObjId,"top",Palign,PWidth,PUnit);
		if (parseInt(itop, 10) > 0) setContPosValue(ObjId, "top", itop); //ObjId.style.top = itop;
		//alert("top：" + ObjId.style.top);
*/
    }

}
function runAutoResize(objParam) {
    ///供外部调用的API，用于自动布局功能的代码实现。2012-12-30
  /*  
    var objParam = {
        type: "left/top/width/height", //要调整的属性
        objCont: null, //要调整的控件对象
        align: "",//对齐方式
        setType: "", //伸缩设置、百分比设置
        value100: 20, //百分比值
        valueUnit:2,  //伸缩时，距右或距下的值，对齐时，距窗口边的值。
        unitName: "px", //单位 px/%
        minValue: 100 //最小值。
    }
    */
    if (objParam.type == "left") {
        //水平对齐
        var ileft = CalObjLeftOrTop(objParam.objCont , "left", objParam.align , objParam.valueUnit , objParam.unitName);
        if (parseInt(ileft, 10) > 0) setContPosValue(objParam.objCont, "left", ileft); 
    }
    if (objParam.type == "top") {
        //垂直对齐
        var itop = CalObjLeftOrTop(objParam.objCont, "top", objParam.align, objParam.valueUnit, objParam.unitName);
        if (parseInt(itop, 10) > 0) setContPosValue(objParam.objCont, "top", itop); 
    }
    if (objParam.type == "width") {
        //控件宽度
        var iWidth = CalObjWidthOrHeight(objParam.objCont, "宽度", objParam.setType , objParam.value100  , objParam.valueUnit, objParam.unitName , objParam.minValue );
        if (parseInt(iWidth, 10) > 0) setContPosValue(objParam.objCont, "width", iWidth); 
    }
    if (objParam.type == "height") {
        //控件高度
        var iHeight = CalObjWidthOrHeight(objParam.objCont, "高度", objParam.setType, objParam.value100, objParam.valueUnit, objParam.unitName, objParam.minValue);
        if (parseInt(iHeight, 10) > 0) setContPosValue(objParam.objCont, "height", iHeight); 
    }
    //给控件赋位置值, 2010-12-07 my add
    function setContPosValue(objId, pos, ivalue) {
        if (objId.getAttribute("controltype") == "dropdownlist") {
            if (pos == "left") objId.left = ivalue;
            if (pos == "top") objId.top = ivalue;
            if (pos == "width") objId.width = ivalue;
            if (pos == "height") objId.height = ivalue;
        } else {
            if (pos == "left") objId.style.left = ivalue + "px";
            if (pos == "top") objId.style.top = ivalue + "px";

            if (objId.getAttribute("controltype") == "tab" || objId.getAttribute("controltype") == "page") {
                if (pos == "width") setTabWidth(objId, ivalue);
                if (pos == "height") setTabHeight(objId, ivalue);
            } else {
                //alert(objId.id +"."+ pos + "=" + ivalue);
                if (pos == "width") objId.style.width = ivalue + "px";
                if (pos == "height") objId.style.height = ivalue + "px";
                //alert(objId.style.width);
            }
        }
    }

    //计算控件的left或top
    /**
     * objid：控件对象；objtype：计算控件的left还是top；objalign：对齐方式；
     * objwidth：距窗口边有多少(px/%)；objunit：单位(px/%)
    **/
    function CalObjLeftOrTop(objid,objtype,objalign,objwidth,objunit)
    {
	    var ivalue = 0;	//控件对象的left或top的值
	    var bodyWidth = getClientSize().offsetWidth; //objid.parentNode.offsetWidth; //document.body.offsetWidth;
	    var bodyHeight = getClientSize().offsetHeight; //objid.parentNode.offsetHeight; //document.body.offsetHeight;
	    //if (bodyHeight == 0) bodyHeight = getClientSize().height;  //当objid.parentNode = SKbillsheet时,其offsetHeight=0
    	
	    var iwidth = objid.style.width;
	    if (iwidth == "") iwidth = "0";
	    var iheight = objid.style.height;
	    if (iheight == "") iheight = "0";
    	
	    if (objwidth == "") objwidth = "0";
    	
	    switch(objalign)
	    {
		    case "居左":
			    if (objunit == "%")
				    ivalue = parseInt(bodyWidth,10)*parseInt(objwidth,10)/100;
			    else
				    ivalue = objwidth;
			    break;
		    case "居右":
			    if (objunit == "%")
				    ivalue = parseInt(bodyWidth,10)-(parseInt(bodyWidth,10)*parseInt(objwidth,10)/100)-parseInt(iwidth);
			    else
				    ivalue = parseInt(bodyWidth,10)-parseInt(objwidth,10)-parseInt(iwidth);
			    break;
		    case "居上":
			    if (objunit == "%")
				    ivalue = parseInt(bodyHeight,10)*parseInt(objwidth,10)/100;
			    else
				    ivalue = objwidth;
			    break;

            case "居下":
    		    
			    if (objunit == "%")
				    ivalue = parseInt(bodyHeight,10)-(parseInt(bodyHeight,10)*parseInt(objwidth,10)/100)-ToInt(iheight);
			    else
				    ivalue = parseInt(bodyHeight,10)-parseInt(objwidth,10)-ToInt(iheight);
			    break;
		    case "居中":
			    if (objtype == "top")
				    ivalue = (parseInt(bodyHeight,10)-parseInt(iheight))/2;			
			    else
				    ivalue = (parseInt(bodyWidth,10)-parseInt(iwidth))/2;
			    break;
	    }
	    return ivalue;
    }

    //计算控件的宽度或高度
    /**
    * objid：控件对象；objtype:计算控件的高度还是宽度；settype:（宽度/高度）的设置方式；
    * objattr：控件对象的宽度或高度；objext:（宽度/高度）变化伸缩到距右多远（px/%）；
    * objsetunit：单位（宽度/高度变化伸缩到距右多远）;objmin:最小值（宽度或高度）
    **/
    function CalObjWidthOrHeight(objid, objtype, settype, objattr, objext, objsetunit, objmin) {
        var ivalue = 0;   //控件对象的宽度或高度的值
        //var bodyWidth = objid.parentNode.offsetWidth; //document.body.offsetWidth;
        //var bodyHeight = objid.parentNode.offsetHeight; //document.body.offsetHeight;
        //if (bodyHeight == 0) bodyHeight = getClientSize().height;  //当objid.parentNode = SKbillsheet时,其offsetHeight=0
        var bodyWidth = getClientSize().offsetWidth;
        var bodyHeight = getClientSize().offsetHeight; 
        
        //控件对象的宽度或高度的设置方式
        if (settype == "百分比设置") {
            if (objattr == "") objattr = "0";
            if (objtype == "宽度")
                ivalue = ToInt(bodyWidth) * ToInt(objattr) / 100;
            else
                ivalue = ToInt(bodyHeight) * ToInt(objattr) / 100;
        }
        else	//伸缩设置
        {
            if (objext == "") objext = "0";
            var ileft = objid.style.left;
            if (ileft == "") ileft = 0;
            var itop = objid.style.top;
            if (itop == "") itop = 0;

            if (objsetunit == "%") {
                if (objtype == "宽度")
                    ivalue = ToInt(bodyWidth) - (ToInt(bodyWidth) * ToInt(objext) / 100) - ToInt(ileft);
                else
                    ivalue = ToInt(bodyHeight) - (ToInt(bodyHeight) * ToInt(objattr) / 100) - ToInt(itop);
            }
            else {
                if (objtype == "宽度") {
                    ivalue = ToInt(bodyWidth) - ToInt(objext) - ToInt(ileft);
                } else {
                //alert("bodyHeight" + bodyHeight + ":objext" + objext + ":itop" + itop);
               
                    ivalue = ToInt(bodyHeight) - ToInt(objext) - ToInt(itop);
                }
            }
        }

        if (objmin == "") objmin = 0;

        if (ToInt(ivalue) > ToInt(objmin))
            return ivalue;
        else
            return objmin;

    }
}
function pub_window_onload() {
    
    fcpubdata.logger().debug(window.location.href+ " onload start!", arguments.callee);
    fcpubdata.area = document.getElementById("SKbillsheet");
    var obj = fcpubdata.area;
    if (obj == null) {
        fcpubdata.logger().error("表单中没有SKbillsheet元素!", arguments.callee);
        after_onload();
        return;
    }
    //手机上固定用openModalDialog, 2013-03-26
    var envType = fcpubdata.area.getAttribute("envType");
    if (!IsSpace(envType) && envType != "电脑") {
        fcpubdata.isModalUser = true;
    }

    //能否运行表单的检查.
    var sPermit = $urlParam("ispermit");
    var isPermit = (IsSpace(sPermit) && fcpubdata.area.getAttribute("isCheckPermit") == "是") || sPermit == "1";
    if (isPermit) {
        var sUnitId = parent.Request.QueryString("unitid").toString();
        if (IsSpace(sUnitId))
            sUnitId = "";
        else
            sUnitId = "&unitid=" + sUnitId;    
        var retX = SendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=zkLoadMod"+sUnitId, "");
        if (retX != "ok") {
            after_onload();
            document.write(retX);
            return;
        }
    }
    
    parent.fcpubdata.loading = "onload";
	//alert("window_onload");
      
	//try{
		
	//}catch(e){}
	
//var   d = new Date();
//var   t = d.getTime() ;  

	//控制打开eform设计的表单的权限接口
	if(typeof EformEnterStatus == "function" ) {
		fcpubdata.enterStatus = EformEnterStatus();
		if(IsSpace(fcpubdata.enterStatus)) { //无权打开此表单
			parent.close() ;
			after_onload();
			window.document.write("无权打开此表单");
			return ;
		}
    }

    runWidget("loadBefore()");

    //加上表单运行参数，2013-05-23
    var tmpRunParams = fcpubdata.area.getAttribute("runParams");
    if (!IsSpace(tmpRunParams)) {
        var arrTmp = tmpRunParams.split("\r\n");
        for (var iTmp = 0; iTmp < arrTmp.length; iTmp++) {
            var s2 = arrTmp[iTmp];
            s2 = Trim(s2);
            var arrTmp1 = s2.split("=");
            if (arrTmp1.length == 2) {
                var paramName = Trim(arrTmp1[0]);
                var paramValue = Trim(arrTmp1[1]);
                var paramValue1 = $urlParam(paramName);
                if (!IsSpace(paramValue1)) paramValue = paramValue1;
                fcpubdata.runParams[paramName] = paramValue;
            }
        }
    }
        
    //装入布局模版. 2012-07-04
    if (fcpubdata.area.getAttribute("type") == "MB") {
        fcpubdata.genEventObj.isGen = $urlParam("isgen");
        if (!IsSpace(fcpubdata.genEventObj.isGen)) { //为空表示直接运行生成好的HTM文件
            var tmpErr = loadAllLayout();
            if (fcpubdata.genEventObj.isGen == "htm") {
                //装入并保存下一个htm
                var tmpObj = parent.parent.fcpubdata.pubObj;
                if (typeof (tmpErr) == "undefined") tmpObj.errInfo += tmpObj.arrUrl[tmpObj.indexUrl] + " 没有生成！";
                if (!IsSpace(tmpErr)) tmpObj.errInfo += tmpObj.arrUrl[tmpObj.indexUrl] + " 保存htm文件时出错！错误信息是 "+tmpErr;
                if (!IsSpace(fcpubdata.genEventObj.genErrInfo)) tmpObj.errInfo += tmpObj.arrUrl[tmpObj.indexUrl] + " 生成出错！错误信息是 " + fcpubdata.genEventObj.genErrInfo;

                if (tmpObj.indexUrl < tmpObj.arrUrl.length - 1) {
                    fcpubdata.genEventObj.genErrInfo = "";
                    tmpObj.indexUrl++;
                    //alert(tmpObj.arrUrl[tmpObj.indexUrl]);
                   // alert(parent.location.href)
                    parent.location.href = tmpObj.arrUrl[tmpObj.indexUrl];
                    //parent.location.replace(tmpObj.arrUrl[tmpObj.indexUrl]);
                } else {
                    after_onload();
                    if (typeof (tmpObj.callback) == "function") tmpObj.callback();
                }
                
                return;
            }
        }
    }



    
    try {
        eval(obj.getAttribute("BLONopenBefore"));
        
        } catch (e) {
        fcpubdata.logger().error("表单打开之前事件代码 " + obj.getAttribute("BLONopenBefore") + " 运行出错!", arguments.callee, e);

    }
    
	//new Eapi.Str().showWait("end")
    if (IsSpace(window.parent.document.title) && IsSpace(fcpubdata.area.getAttribute("caption")) == false) window.parent.document.title = fcpubdata.area.getAttribute("caption");
		//alert(obj.outerHTML) //+"  "+obj.poswidth)
		//CopyToPub(obj.outerHTML)
		//alert(obj.posheight+" "+obj.poswidth)
	//if(isSpace(obj.posheight)==false && (obj.type != "LR" && obj.type != "ST" && obj.type != "PR") ){
	//	window.dialogHeight=obj.posheight+"px";
	//	window.dialogWidth=obj.poswidth+"px";
		//top.resizeTo(parseInt(obj.poswidth),parseInt(obj.posheight))
		//parent.resizeTo(obj.poswidth,obj.posheight)
	//}
	var iAction=parent.piAction;
	//alert(parent.piAction)
	//alert(obj.entertype)
	//加上 (typeof(iAction) != "undefined" && iAction.constructor == window.Array ) 以免当直接用window.showModal打开表单并传递数组参数时,下边行会出错, 2011-04-15
	if(typeof iAction =="undefined" || (typeof(iAction) != "undefined" && iAction.constructor == window.Array ) || iAction==0 || iAction=="0"){
		if(obj.getAttribute("entertype")=="新增")
			parent.piAction=1;

        if (obj.getAttribute("entertype") == "修改")
			parent.piAction=2;

        if (obj.getAttribute("entertype") == "展现")
			parent.piAction=3;
	}else{
		parent.piAction=iAction;
	}
	//alert(parent.piAction)
	//alert(obj.entertype+":"+parent.piAction)
	
	//如为居中,则应计算出窗口的位置
	
	
	//工具栏
	var i;
	var sbar = obj.getAttribute("toolbar");
	if(sbar != "不带工具栏" && IsSpace(fcpubdata.formToolbar) == false){
		var oDom = SetDom("<root>"+fcpubdata.formToolbar+"</root>");
		var ll = oDom.documentElement.childNodes.length ;
		for (i=0;i<ll;i++){
			var name = NavJs.getNodeValue1(oDom,i);
			if(sbar == name){
				var path = oDom.documentElement.childNodes[i].getAttribute("path");
				var sHeight = oDom.documentElement.childNodes[i].getAttribute("height");
				if(IsSpace(path) ==false){
					if(IsSpace(sHeight)) sHeight = "31" ; //31
					path = RepStr(path,"~",fcpubdata.path);
					if(path.indexOf("?") < 0 ){
					    //接收djframe.htm?后面的参数给工具栏页面
					    var spara=parent.location.search ;
					    if(IsSpace(spara)) spara="";
				        path = path+spara;
					}
//					parent.toolbar.location.replace(path);
					//					parent.mainframeset.rows=sHeight + ",*,0";

					parent.toolbarWinHeight = ToInt(sHeight);
                    var tmpWinHeight = getClientSize(parent).height - ToInt(sHeight);
                    //alert(sHeight+"  "+path)
                    window.parent.document.getElementById("topic").style.height = tmpWinHeight+"px"; //需要先给topic窗口的高度,否则会在运行过程中有一段时间topic窗口的高度很小,为23

                   // window.parent.document.getElementById("toolbar").parentNode.parentNode.style.display = "";
                    
					window.parent.document.getElementById("toolbar").src = path ;
					window.parent.document.getElementById("toolbar").style.height = sHeight; //+"px"
					//alert("onload:" + tmpWinHeight)
					    
				}
			}
		}
    }
    else if(fcpubdata.area.getAttribute("dj_sn") != "wf_tools") // 去掉工作流工具栏的表单页面 2013-05-14
    {
        window.parent.document.getElementById("toolbar").style.display = "none"; // my add 2013-04-27
       //window.parent.document.getElementById("topic").style.height = (window.parent.document.documentElement.clientHeight - 10) + "px";
        window.parent.document.getElementById("topic").style.height = getClientSize(parent).height  + "px";
    }
    
    
    //alert(window.parent.document.getElementById("toolbar").outerHTML);
	//new Eapi.Str().showWait("正在打开表单......");
    //取表单上的所有控件

    new Eapi.RunForm().getConts();
    
    
    fcpubdata.dsMain = GetDsMain(false);
    //赋默认的表单的主键字段名
    if($id(fcpubdata.dsMain) != null){   
        fcpubdata.area.setAttribute("keyfield", $obj(fcpubdata.dsMain).getFirstKeyFieldName());
    }
    
	//当传对象时，自动给pubdjbh,
	if(IsSpace(fcpubdata.obj) == false ){
		if(isSpace(fcpubdata.area.getAttribute("keyfield"))==false){
		    try {
		        if(fcpubdata.obj.isFieldName(fcpubdata.area.getAttribute("keyfield")))
			        fcpubdata.keyValue = fcpubdata.obj.Field(fcpubdata.area.getAttribute("keyfield")).Value; // 可能不用它.
				
			}catch(E){}
		}
	}


	var o = window.document.getElementsByTagName("label");
    var l=o.length;
    for (ii = 0; ii < l; ii++) {
        //if (IsSpace(o[ii])) continue;
        var tmpS = o[ii].innerHTML;
        if (tmpS.indexOf("${") >= 0) {
            o[ii].innerHTML = new Eapi.Str().repMark(tmpS);
        }
    }

    //处理label的必须输入*标识    
    if (IsSpace(fcpubdata.area.getAttribute("labelInputTag")) == false) {
        try {
            eval(fcpubdata.area.getAttribute("labelInputTag"));
        } catch (e) { }
    }

    
	//处理下拉图形按钮
//	var bmpPath = fcpubdata.path+fcpubdata.skinsPath+"/css/skins/"+fcpubdata.skins+"/images/ef_run_downarrow.gif";
//	var ii,s1,o,l ;
    o = window.document.getElementsByTagName("button");
	l=o.length;
	for (ii = 0; ii < l; ii++) {
	    //if (IsSpace(o[ii])) continue;
	    var tmpS = o[ii].value;
	    if (tmpS.indexOf("${") >= 0) {
	        o[ii].value = new Eapi.Str().repMark(tmpS);
	    }
	}
	
	
	fcpubdata.loadingStatus = "start";
	
   //处理combox的sql属性--------------------------------------------------------------

	var o = window.document.getElementsByTagName("select");
   var l=o.length;
   for (ii = 0; ii < l; ii++) {
        //my add 2013-07-17 
       if (!IsSpace(o[ii].getAttribute("xml"))){
           SqlCombo(o[ii]);
       }         
          
       if (isSpace(o[ii].getAttribute("sqltrans"))) continue;
       try {
           s1 = UnSqlPropTrans(o[ii].getAttribute("sqltrans"));
           if (isSpace(s1) == false) {
               if (o[ii].getAttribute("async") == "是") {
                   fillcombox(s1, function(result) {
                       var s1 = result.value;
                       var obj = result.context;
                       if (isSpace(s1) == false) {
                           obj.outerHTML = SelectAddOption(obj, s1);
                       }
                   }, o[ii]);
               } else {
                   var oSql = new Object();
                   oSql.sql = s1;
                   oSql.datasourceName = o[ii].getAttribute("datasourceName");
                   s1 = fillcombox(oSql);
                   obj = o[ii];
                   if (isSpace(s1) == false) {
                       obj.outerHTML = SelectAddOption(obj, s1);
                   }
               }

           }
       } catch (e) {
            fcpubdata.logger().error("loading err " + o[ii].id , arguments.callee, e);
       }
   }

   
//------------------------------	
//新的树控件的处理

	var sContXml = fcpubdata.area.getAttribute("contxml") ;
	var _oContXml = SetDom(sContXml);
	if(_oContXml.documentElement != null ){
		var oNode = _oContXml.documentElement.selectSingleNode("tree") ;
		if(oNode != null ){
			l=oNode.childNodes.length;
			for (i = 0; i < l; i++) {

			    try {
				    obj = $id(NavJs.textContent(oNode.childNodes[i]));
				    if (obj == null) continue;
				}catch(E){
					continue;
				}
                
    				TreeRefresh(obj, "", function() { });
    			try {
                } catch (e) {
                    fcpubdata.logger().error("loading err " + obj.id, arguments.callee, e);
                }

			} // end for
		}
	}
	//运行divcheckbox控件时所用的函数;
	
	o = window.document.getElementsByTagName("div");
	l = o.length;
	for (i = 0; i < l; i++) {
	    //if (IsSpace(o[i])) continue;
	    var callback_list = null;
	    if (o[i].getAttribute("async") == "是") callback_list = function() { };
	    
	        if (o[i].getAttribute("controltype") == "checkboxlist") {
	            DivCheckBoxInitLoad(o[i], "", callback_list);
	        } else if (o[i].getAttribute("controltype") == "radiolist") {
	            DivRadioInitLoad(o[i], "", callback_list);
	        }
	        try {    
	    } catch (e) {
	        fcpubdata.logger().error("loading err " + o[i].id, arguments.callee, e);
	    }

	}
	
	
   //----------------------------------------------------------------------------------
//增加模式打开单据	
//   if(parent.piAction==1) {
//		fcpubdata.keyValue = "" ; //新增模式时此变量为空
//		openemptybill();
//	}
//修改模式打开单据
//   if(parent.piAction==2 || parent.piAction==3 )
	
		openselbill(fcpubdata.keyValue);



		
		fcpubdata.backRunCount = 0; 
		//运行E表控件时所用的函数;
	o = window.document.getElementsByTagName("div");
	l = o.length;
	for (i = 0; i < l; i++) {
	    //if (IsSpace(o[i])) continue;
	    var sType = o[i].getAttribute("controltype");
	    
	    if (sType != "ebiao" && sType != "layout" && sType != "eblayout") continue;
        var isRun;
        if (sType == "ebiao" && IsTrue(o[i].getAttribute("isOnloadRun"))) {
            tmpType = 1;
            isRun = true;
        }
        if (sType == "layout") isRun = false;
        if (sType == "eblayout") {
            var contentType = o[i].getAttribute("contentType");
            if (IsSpace(contentType) || contentType == "rptStr") {
                if (o[i].getAttribute("isRunEbiao") != 3)
                    isRun = true;
                else
                    isRun = false;
            } else {
                isRun = true;
            }
            if (!IsTrue(o[i].getAttribute("isShowView"))) {
                new Eapi.EformEbiao().doReadOnlyPermit(o[i]); //处理字段只读权限，2012-09-11

                new Eapi.EformEbiao().doReadOnlyPermitWf(o[i]); //处理带流程的字段只读权限，2013-05-20
            }
        }
        

        if (isRun) {
            //fcpubdata.isAfterEbiaoExec = "否";
            
            fcpubdata.backRunCount++;
            new Eapi.EformEbiao().run(o[i], "", 1, function() {
                fcpubdata.backRunCount--;
                if (fcpubdata.backRunCount == 0) afterLoadingHttp();
            });
        }else {
        
            var ooDiv = NavJs.child(o[i], "div", 0);
            if(ooDiv != null) new Eapi.EformEbiao().runAction(o[i], ooDiv.getAttribute("dsXml"));
        }
        try {    
	    } catch (e) {
	        fcpubdata.logger().error("loading err " + o[i].id, arguments.callee, e);
	    }

	}
	  
	  
	//setupAllTabs() ;
   //-----------------   
   //d = new Date();
   //alert(d.getTime()-t)
   //t=d.getTime()  
   
   //window.execScript(fcpubdata.area.BLONopen);
   //BLONopenID.fire()
	//alert(parent.modNo)
	//eval('window.showModalDialog(fcpubdata.path+"/fceform/common/pause.htm",1000,"dialogHeight:100px;dialogWidth:100px;dialogTop:180;dialogLeft:250px") ;');

  
//------------------------------------------------

//new Eapi.Str().showWait("end");
	//alert("test")
	//alert("end")

	if (fcpubdata.loadingHttpArr.length > 0) {
	    fcpubdata.backRunCount++;
	    SendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=loadingBatchAction", "", function() {
	        fcpubdata.backRunCount--;
	        if (fcpubdata.backRunCount == 0) afterLoadingHttp();
	    });
    }

    if (fcpubdata.backRunCount == 0) afterLoadingHttp();

	
	//parent.fcpubdata.loadFinish = "ok"; //加上一个表单装入完成的通知.
	
//   d = new Date();
//   t1 = d.getTime() ;  
//  // alert(t1-t)

    function after_onload() {
        runWidget("loadAfter()");
        
        //onload 结束处
        try {
            parent.parent.document.getElementById("imgFcWait").style.display = "none";
        } catch (e) { }
    }

    function afterLoadingHttp() {
        fcpubdata.loadingStatus = "finish";
        fcpubdata.logger().debug("onload afterLoadingHttp!", arguments.callee);
       
       var o, l, i;

       //初始化grid
       /*o = NavJs.getGridArr();
       for (var ii = 0; ii < o.length; ii++) {
           try {
               //modify by liuxt at 2010-10-27 10:18 把webgrid.htc改为webgrid.js后需要初始化grid对象后在使用
               var sAttachEnd = "";
               sAttachEnd += ' ' + o[ii].id + ' = new webgrid("' + o[ii].id + '"); ';
               eval(sAttachEnd);
               $obj(o[ii].id).Init();
           } catch (e) {
               fcpubdata.logger().error("grid init err " + o[ii].id, arguments.callee, e);
           }

       }*/

       //初始化所有数据集的绑定
       o = NavJs.getDatasetArr();
       for (var ii = 0; ii < o.length; ii++) {
           
                   //modify by liuxt at 2010-10-27 10:18 把dataset.htc改为dataset.js后需要创建dataset对象后在使用
                    
                    var oNew = o[ii];
                    if (IsTrue(fcpubdata.area.getAttribute("allBrowser"))) oNew = $obj(o[ii].id);
                    
                    oNew.InitLinkObj();
                    oNew.fset_cont1(); //加上向绑定控件传数,否则会因为数据集在打开时绑定控件上没数.
                    try { } catch (e) {
                    fcpubdata.logger().error("dataset init err " + o[ii].id, arguments.callee, e);
               }

       }
       //初始化grid
       /*o = NavJs.getDropdownlistArr();
       for (var ii = 0; ii < o.length; ii++) {
           try {
               //modify by liuxt at 2010-10-27 10:18 把webgrid.htc改为webgrid.js后需要初始化grid对象后在使用
               var sAttachEnd = "";
               sAttachEnd += ' ' + o[ii].id + ' = new dropdownlist("' + o[ii].id + '"); ';
               eval(sAttachEnd);
               $obj(o[ii].id).fnInit();
           } catch (e) {
               fcpubdata.logger().error("dropdownlist init err " + o[ii].id, arguments.callee, e);
           }

       }*/

       //补足空白行 2007-03-21 add
       try{
           GridAddEmptyRow();
       } catch (e) {
            fcpubdata.logger().error("loading err run GridAddEmptyRow()", arguments.callee, e);
       }
        
       if (typeof (EformCheckRoleInfo) == "function") {
        
           try{
               EformCheckRoleInfo(); //权限设置验证
           } catch (e) {
                fcpubdata.logger().error("loading err run EformCheckRoleInfo()", arguments.callee, e);
           }
           
       }

       //上传附件

       //上传文件控件中的超级链接会引起window_onbeforeunload所以加上点击事件关闭标志
       //然后在处理完后再打开标志
       //if (typeof upload1 != "undefined") {
       if($id("upload1") != null){
            try{
               upload_onload();
               //modify by liuxr at 2010-10-19 9:44 修改获取附件中table对象的方式，upload1.childNodes[0]在sarafi下取到的是text对象，upload1.childNodes[1]才取到table对象
               //var tb=upload1.childNodes[0] ;
               var tb = $id("upload1").getElementsByTagName("table")[0];
               var ohref = tb.rows[tb.rows.length - 1].cells[0].children[0];
               ohref.onclick = function href_onclick() { if (fcpubdata.isEdit) { fcpubdata.isEdit = false; } };
               for (i = 0; i < tb.rows.length - 1; i++) {
                   //删除列在第3列
                   tb.rows[i].cells[2].children[0].onclick = function() { if (fcpubdata.isEdit) { fcpubdata.isEdit = false; } };
               }
           } catch (e) {
               fcpubdata.logger().error("loading err upload1", arguments.callee, e);
           }
       }
      
            eval(fcpubdata.area.getAttribute("BLONopen")); //表单打开之后事件
            try { } catch (e) {
            fcpubdata.logger().error("表单打开之后事件 " + fcpubdata.area.getAttribute("BLONopen") + " 运行出错!", arguments.callee, e);
       }

                
       //处理条件格式
       try{
           contTermStyle();
       } catch (e) 
       {
           fcpubdata.logger().error("loading err contTermStyle() 处理条件格式出错!", arguments.callee, e);
            
       }

       if (fcpubdata.skins != "base") {
            
                //if (fcpubdata.isAfterEbiaoExec != "否")
                   new Eform.Skins().init();
                   try { } catch (e) {
                   fcpubdata.logger().error("loading err 处理皮肤样式出错!", arguments.callee, e);

               }
       }
       //附加上新checkbox的事件,应放在表单打开事件之后做,防止表单打开事件中重新给了innerHTML

       var ds1;
       o = window.document.getElementsByTagName("div"); //新的checkbox
       l = o.length;
       for (i = 0; i < l; i++) {
           //if (IsSpace(o[i])) continue;
           if (o[i].getAttribute("controltype") != "checkbox") continue;
           //ds1=o[i].getAttribute("dataset");
           //if(isSpace(ds1)){
           for (var jj = 0; jj < o[i].childNodes.length; jj++) {
               //o[i].childNodes(jj).attachEvent("onclick", radio_checkbox_click);
               NavJs.addEvent(o[i].childNodes[jj], "onclick", radio_checkbox_click);
           }
           //o[i].children[0].attachEvent("onclick", checkboxclick);    	
           //o[i].children[1].attachEvent("onclick", checkboxclick);    	
           //}
       }

       o = window.document.getElementsByTagName("fieldset");
       l = o.length;
       for (i = 0; i < l; i++) {
           //if (IsSpace(o[i])) continue;
           //ds1=o[i].getAttribute("dataset");
           //if(isSpace(ds1)){
           for (var jj = 1; jj < o[i].childNodes.length; jj++) {
               try { //最后一个空格元素会出错
                   //o[i].childNodes(jj).attachEvent("onclick", radio_checkbox_click);
                   NavJs.addEvent(o[i].childNodes[jj], "onclick", radio_checkbox_click);
               } catch (e) { }
           }
           // }
       }
       
       pub_window_onresize_bak(); //让表格控件最大化
       //设置焦点,因表格中的txt为延时10
       window.setTimeout("FirstFocus();", 30);
       parent.fcpubdata.loading = "finish";
       fcpubdata.logger().debug("onload finish!", arguments.callee);
       after_onload();

    }
	
	/**
	*用于DJ.HTC调用,以新增状态打开表单
	**/
	function openemptybill(){

	    //打开子表数据集
		var o= NavJs.getDatasetArr();
		for(var ii=0;ii<o.length;ii++){
			//if (o[ii].id!="DsMain"){
				$obj(o[ii].id).PageSize=-1;
				sErr = $obj(o[ii].id).OpenEmpty();
				//alert(o[ii].id+":"+o[ii].Empty )
				if(sErr!="") {
					alert(sErr);
					return;
				}
				//o[ii].bAdd = true;
			//}
	      
		}
			
	}
	/**
	*打开选择的单据
	*@param djbh 当前打开的单据编号,单据模版ID自动取当前的
	*@param gzid 挂帐ID
	*@param noeditdjbh 不要修改单据编号 用于提取另种单据.
	**/
	function openselbill(djbh,gzid,noeditdjbh){
        
		var sErr = "",ii,s1;

		//打开数据集
		var oo = NavJs.getDatasetArr();
		var l = oo.length;
		var o = new Array(l);
		if(l <= 0) return;

		for(ii=0;ii<l;ii++){
			o[ii] = oo[ii];
		}
		if(isSpace(o[0]) == false && isSpace(o[0].getAttribute("opensortno")) == false){
			o.sort(cmpdataset);

        }
		for (ii = 0; ii < l; ii++) {
		    //if (IsSpace(o[ii])) continue;
			//if(isSpace(gzid)){
		    if (isSpace(o[ii].getAttribute("crossvalue"))) {
		        //2012-10-10 add
		        try {
		            new Eapi.FormTemp().dsGenSql(o[ii].id);
		        } catch (e44) { }
		        
				s1=o[ii].getAttribute("opensql");
				if(IsSpace(s1)) s1="";
				if(s1 == "") s1 = UnSqlPropTrans(o[ii].getAttribute("sqltrans")) ;
				
				if(s1.length>1){
					//去掉尾部的回车符
					if (s1.charCodeAt(s1.length-1)==10 && s1.charCodeAt(s1.length-2)==13 ){
						s1=s1.substring(0,s1.length-2);
						o[ii].setAttribute("opensql",s1);
					}
        		}
                //给数据集加上 isOnloadOpen 开关，用于在列表查询时，刚进入时列表为空。2012-10-11
        		var isOnloadRun = o[ii].getAttribute("isOnloadRun");
        		if (!IsSpace(isOnloadRun) && !IsTrue(isOnloadRun)) {
        		    $obj(o[ii].id).OpenEmpty();
        		} else {
        		    if (IsSpace(s1) == false) {
        		        if (o[ii].getAttribute("async") == "是") {
        		            sErr = $obj(o[ii].id).Open(s1, "空", function(result) {
        		                var objDs = result.context;
        		                dsAppendEmptyRec(objDs);

        		            }, o[ii]);
        		        } else {
        		            sErr = $obj(o[ii].id).Open(s1);
        		            dsAppendEmptyRec(o[ii]);
        		        }
        		    } else {
        		        $obj(o[ii].id).OpenEmpty();
        		        dsAppendEmptyRec(o[ii]);
        		    }
        		}
			}else { //交叉表
				s1= CrossTab(o[ii].getAttribute("crossvalue"));
				if(isSpace(s1)==false){
				    $obj(o[ii].id).OpenXml(s1);
			  		sErr="";
				  	
				}
			}
			//}else{
			//	sErr=o[ii].Open("select * from "+o[ii].temptable+" where gzid='"+gzid+"'");
			//}
			if(isSpace(sErr) == false ) {
				alert(sErr);
				return;
			}

		}

		//给单据全局变量
		if(noeditdjbh != "不要修改单据编号"){
		    if(IsSpace(djbh) ==false) //o[ii].FirstPage(); //移到第一页以赋pubdjbh值 2008-02-22 add
   				fcpubdata.keyValue=djbh;   //DsMain.Field(fcpubdata.area.keyfield).Value
		}

		function cmpdataset(a,b) {
		    return parseInt(a.getAttribute("opensortno")) - parseInt(b.getAttribute("opensortno"));
		}
		function dsAppendEmptyRec(objDs) {
		    //加一空记录
		    var isAddEmptyRec = false;
		    if (objDs.getAttribute("isaddemptyrec") == "是") {
		        isAddEmptyRec = true;
		    } else if (objDs.getAttribute("submittype") == 2) {
		        //alert(objDs.RecordCount + "::" + parent.piAction);
		        if ($obj(objDs.id).RecordCount == 0) {
		            //当数据集打开后,如没有记录,且它的提交方式为提交当前的一条记录时,则自动ds.Append
		            isAddEmptyRec = true;
		        } else if (parent.piAction == 1) {
		            isAddEmptyRec = true;
		        }
		    } else if (objDs.getAttribute("submittype") == 1) { //或者当不是表格数据集时,提交方式选择了默认
		        if ($obj(objDs.id).RecordCount == 0) {
		            if (isGridDs(objDs.id)==false) {
		                isAddEmptyRec = true;
		            }
		        }
		    }
		    

		    if (isAddEmptyRec) {
		        $obj(objDs.id).bAdd = false;
		        $obj(objDs.id).bEdit = false;
		        $obj(objDs.id).Append();
		    }
		}
	}
    /**
    *取得界面上的第一个没有绑定到表格的数据集
    *@param bUseSelect =true 表示在selectall.htm中用此函数,no use
    *@return 数据集对象ID
    *@date 2005-02-24
    **/
	function GetDsMain(bUseSelect) {
	    //fcpubdata.logger().debug("test1", arguments.callee);
        var sRet = fcpubdata.dsMain ; //如何没有找到主数据集的话则用此配置的主数据集名.
        var oContXml,s1 ;
        //if(bUseSelect == true ) {
	    //    oContXml = SetDom(Parent.SKbillsheet.contxml);
        //}else{
	        oContXml = SetDom(fcpubdata.area.getAttribute("contxml"));
        //}
        if(oContXml.documentElement == null) return sRet;

        var oNodeDs = oContXml.documentElement.selectSingleNode("dataset") ;
        if(oNodeDs != null ){
	        for(var i=0;i<oNodeDs.childNodes.length;i++){
		        //通过主从关系设置来找主数据集
	            var oDs = $id(NavJs.textContent(oNodeDs.childNodes[i]));
	            if (IsSpace(oDs.getAttribute("masterds")) == false) {
	                return oDs.getAttribute("masterds");
	            }
	        }
        }    	
        var oNode = oContXml.documentElement.selectSingleNode("grid") ;
        if(oNodeDs != null ){
	        for(var i=0;i<oNodeDs.childNodes.length;i++){
		        //判断数据集是否绑定在表格上
		        var bool = false ;
		        var s = NavJs.textContent(oNodeDs.childNodes[i]);
		        if(oNode != null ){
			        for(var j=0;j<oNode.childNodes.length;j++){
			            s1 = NavJs.textContent(oNode.childNodes[j]); //oNode.childNodes(j).text ; 
				        //if(bUseSelect == true ) s1="Parent."+s1;
				        var otmp = $id(s1) ;
				        if(s == otmp.getAttribute("dataset") ){
					        bool=true;
					        break;
				        }
			        }
		        }
		        if(bool == false){
		            s1 = NavJs.textContent(oNodeDs.childNodes[i]);
			        //if(bUseSelect == true ) s1="Parent."+s1 ;
		            var oods = $id(s1);
			        if(oods.getAttribute("pubpara") != "是"){
				        sRet = oods.id;
				        break;
			        }
		        }
    			
	        }

        }
        return sRet ;			

    }
	
	
}
function contTermStyle(){
///应用条件格式
    _inner("button");
    _inner("input");
    _inner("label");

    function _inner(tagName) {
        var oXml, slen, str1, str2;
        //button条件格式
        var o = window.document.getElementsByTagName(tagName);
        var l = o.length;
        for (var ii = 0; ii < l; ii++) {
            if (IsSpace(o[ii].getAttribute("termStyle")) == false) {
                oXml = SetDom(o[ii].getAttribute("termStyle"));
                slen = oXml.documentElement.childNodes.length;
                for (var i = 0; i < slen; i++) {
                    str1 = NavJs.getNodeValue11(oXml, i, 4);
                    str2 = NavJs.getNodeValue11(oXml, i, 5);
                    //alert(eval(str1));
                    if (eval(str1) == true) {
                        str2 = RepStr(str2, "curObjID", o[ii].id);
                        eval(str2);

                    }
                }
            }
        }
    }
}

/**
*关闭当前单据
*@date 2003-11-27
**/
function CloseBill(){
		
//	alert("can")
    fcpubdata.isEdit = false;

    if (!IsSpace(top.Dialog) && top.Dialog.arrObj != null) {
        top.Dialog.Close();
        return;
    }
	
	//if(parent.arr[7]!="有模式窗口" && parent.arr[7]!="无模式窗口"  ){
		//后退两步,因直接调主页面的话，无法确定哪个页面为主页面
		history.go(-2);
		//history.back()
		//parent.topic.location.assign("topic.htm")
//	}else{
		parent.close();
		try{
			parent.parent.eval('try{ CloseWin();}catch(e){} ');
		}catch(e){}
//	}   
}

/**
*设置按钮为图形按钮
  obutton.style.backgroundImage="url(../image/b5_cancel.gif)" ;
*@date 2004-02-16
**/
function SetButtonImage(sbutton, spathgif) {
    var obutton = $id(sbutton);
    if (typeof sbutton == "object") obutton = sbutton;    
    obutton.style.backgroundImage="url("+spathgif+")" ;
    obutton.style.cursor="hand" ;
  //obutton.onmouseout=function func_onmouseout() { this.style.color="black";};
  //obutton.onmouseover=function func_onmouseover() {	this.style.color="red";};


}
/**
* 转换SQL语句
*@date 2005-11-08
**/
function SqlPropTrans(sql) {
	var s = new Eapi.Str().trim(sql) ;
	if(IsSpace(s)) return "" ;
	s = escape(s) ;
	var sRet = "" ;
	var l = s.length ;
	for(var i=0;i<l;i++){
		var c = 2 * (s.charCodeAt(i) + 7) ; 
		sRet += String.fromCharCode(c);
	}
	sRet = escape(sRet);
	return sRet ;
}
function UnSqlPropTrans(s1) {
	var s = new Eapi.Str().trim(s1) ;
	if(IsSpace(s)) return "" ;
	s = unescape(s) ;
	var sRet = "" ;
	var l = s.length ;
	for(var i=0;i<l;i++){
		var c = (s.charCodeAt(i)/2) - 7 ; 
		sRet += String.fromCharCode(c);
	}
	sRet = unescape(sRet);
	return sRet ;
}
/**
*求当前年的第一天
*@date 2004-05-02
**/
function YearFirstDay(){
	var dDate=new Date();
	var s1=""+dDate.getYear();
	s1+="-01-01";
	return s1;
}
/**
*求当前年的最后一天
*@date 2004-05-02
**/
function YearLastDay(){
	var dDate=new Date();
	var s1=""+dDate.getYear();
	s1+="-12-31";
	return s1;
}
/**
*显示Flash页面
*@para htmlfile falsh所在页面的HTM文件名
*@date 2005-07-25

function ShowFlash(htmlfile) {
	window.open(fcpubdata.path+"/flash/" + htmlfile + ".htm","_blank","top=0,left=0,height=700,width=900,status=no,toolbar=no,menubar=no,location=no,resizable=yes,scrollbars=yes")	
}**/
function getuser() {
	return "fc";
}
function getusername() {
	return "fc";
}
/**
*找到当前界面上第一个绑定到了数据集的表格控件,返回它的数据集控件
*@return 所绑定的数据集对象.如无则返回null
*@date 2006-01-25
**/
function Getdssub1() {
   var o=NavJs.getGridArr();
   for(var ii=0;ii<o.length;ii++){
        if (IsSpace(o[ii].getAttribute("dataset")) == false){
            var ods = $obj(o[ii].getAttribute("dataset")); //eval("window."+o[ii].dataset);
			if(ods != null) return ods ;
        }
   }

   var o=NavJs.getDatasetArr();
   for(var ii=0;ii<o.length;ii++){
        if(typeof(o[ii].getAttribute("isSubGrid")) != "undefined") return $obj(o[ii].id);
   }
   
   return null;


}
/**
* 判断 dsId 是否为表格数据集
* 2011-12-01 my add
**/
function isGridDs(dsId) {
    var oDs = $id(dsId);
    if (IsSpace(oDs)) return false;
    if (IsTrue(oDs.getAttribute("isSubGrid"))) return true;

    var o = NavJs.getGridArr();
    for (var ii = 0; ii < o.length; ii++) {
        if (IsSpace(o[ii].getAttribute("dataset")) == false && o[ii].getAttribute("dataset") == dsId) {
            return true;
        }
    }
    return false;
}

/**
* 建表单向导上的新增按钮用.
*@date 2006-02-08 
**/
//function ToolBarFuncAdd() { $eform("新增");}
function CheckDate(sdate){
	return Valid.checkValue("Date",sdate);
}
/**
* 执行其它数据源的SQL语句，返回数据集所需要的XML串
*@param oDs 为数据集对象，如dataset1
*@param sConn 为数据库连接串， 如 "Provider=SQLOLEDB;Data Source=my;Initial Catalog=mytest;User ID=sa;pwd=;"
*@param sSql 要运行的sql语句，
*@param PageNo 起始页号
*@param PageSize 页尺寸，-1表示取所有记录
*@date 2006-09-06
**/
/*function DbSql(oDs,sConn,sSql,PageNo,PageSize,callback,context) {
//执行比较后再执行此来进行查询记录,但注意结果没有加上字段串

//sField=带;分隔的字段名
	var sFieldNameList = "";
	if(IsSpace(oDs.getAttribute("format")) == false){
	    var oSour = SetDom(oDs.getAttribute("format"));
	    for(var i=0;i<oSour.documentElement.childNodes.length;i++){
	    	    sFieldNameList+=NavJs.getNodeValue11( oSour,i,0)+";";
	    }
	    sFieldNameList=sFieldNameList.substring(0,sFieldNameList.length-1); //去掉尾部;
	}
	//替代非法XML字符
	var sXml="<No>"+RepXml(sSql)+"</No>"+"<No1>"+PageNo+"</No1>"+"<No2>"+PageSize+"</No2>"+"<No3>"+sFieldNameList+"</No3>";
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=DbSql&connectstring="+escape(sConn),sXml,callback,context);
	retX = RepStr(retX, "<fields></fields>", oDs.getAttribute("format"));
	oDs.OpenXmlData(retX);
	return retX;
}*/
/**
* 执行其它数据源的SQL语句，返回combobox所需要的XML串
*@param oCombobox 为combobox对象，
*@param sConn 为数据库连接串， 如 "Provider=SQLOLEDB;Data Source=my;Initial Catalog=mytest;User ID=sa;pwd=;"
*@param sSql 要运行的sql语句，
*@date 2006-09-06
**/
/*function DbSqlCombo(oCombobox,sConn,sSql,callback,context) {

	//替代非法XML字符
	var sXml="<No>"+RepXml(sSql)+"</No>";
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=DbSqlCombo&connectstring="+escape(sConn),sXml,callback,context);
    if(IsSpace(retX)==false){
        oCombobox.outerHTML=SelectAddOption(oCombobox,retX);
    }

}*/
/**
* 检查一个数据集中某列的值是否重复
*@param ods 数据集对象
*@param fieldName 字段名
*@return true表示重复了,
*@date 2006-12-05 
**/
function CheckFieldRepeat(oDs, fieldName) {
    var ods = $obj(oDs.id);
	var l = ods.oDom.documentElement.childNodes.length-1 ;	
	var col = ods.FieldNameToNo(fieldName);
	var bRepeat = false;
	for (var i = 0; i < l; i++) {
		var value1 = NavJs.getNodeValue11(ods.oDom,i,col);
		for(var j=i+1;j<l;j++){
		    if (value1 == NavJs.getNodeValue11(ods.oDom, j, col)) {
				bRepeat = true ;
				break; 
			}
		}
		if(bRepeat) break;
	}
	if (bRepeat) {
		alert( NavJs.textContent(ods.oDom.documentElement.childNodes[l].childNodes[1].childNodes[col].childNodes[2])+" 的值重复!");
	}
	return bRepeat;
}
/**
* 固定行数的grid控件时,需要调用此来补足空白行,此函数为公共的api用.
*@param sDs 数据集的id,
*@date 2007-07-12
**/
function GridAddEmptyRow(sDs){
//补足空白行 2007-03-21 add
	var o= NavJs.getGridArr();
	for(var ii=0;ii<o.length;ii++){
        if (IsSpace(o[ii].getAttribute("dataset")) ) continue;
        if (typeof sDs != "undefined" && sDs != o[ii].getAttribute("dataset")) continue;
        var ods = $id(o[ii].getAttribute("dataset"));
		if(ods == null) continue;
		var rowCount = o[ii].getAttribute("bodyrows"); //固定行数
		if(typeof rowCount == "undefined") rowCount =-1;
		var rowHeight = o[ii].getAttribute("bodyrowheight"); //行高
		if(typeof rowHeight == "undefined" || rowHeight == -1) rowHeight =21;
		var offsetV = rowCount - $obj(ods.id).RecordCount;
		if(offsetV<=0) continue;
        for(var jj = 0;jj<offsetV;jj++){
            $obj(ods.id).Append("强行加一行"); //
            var oTr = $obj(o[ii].id).InsertRow();
			oTr.style.height = rowHeight + "px";
			//ods.Update("不检查");
        }
        $obj(ods.id).dset_cont();
        $obj(o[ii].id).initGrid(); //调整表格的外框

        $obj(o[ii].id).EndRowState = "edit";
        $obj(ods.id).SetPos(0); //加此以同步当前单元格和fset 2010-09-03 add  
	}	
}
	/**
	*表单onload事件时用下面三个函数
	**/
	/*
	function checkboxclick(){
	    var bool;
		var obj=event.srcElement ;
		if(obj.tagName.toUpperCase() == "SPAN"){
			if(obj.parentNode.children[0].checked == true)
				obj.parentNode.children[0].checked = false;
			else
				obj.parentNode.children[0].checked = true;
				
			bool = obj.parentNode.children[0].checked;

		}else{
			bool = obj.checked;
		}

		obj=obj.parentNode;
		if(bool){
			obj.value=obj.truevalue;
		}else{
			obj.value=obj.falsevalue ;
		}
		
	}
	
	function radioclick1() {
		var o=event.srcElement ;
		o.parentNode.value=o.value ;
	}
	function radioclick2() {
		var o=event.srcElement ;
		o.parentNode.value=o.previousSibling.value ;
	}*/
	function radio_checkbox_click(){
	    ///<summary>此程序附加到radio checkbox的内部控件上,用于将子控件的值传到控件上</summary>
	    var objInput;
	    var obj = NavJs.getEventObj();  
		if(obj.parentNode.disabled) return;
		if(obj.tagName.toUpperCase() == "SPAN"){
            if(obj.className.indexOf("ef_input") < 0){
                objInput = obj.previousSibling ;
            }else {
                objInput = obj.nextSibling ;
            }
        }else{ //INPUT
            objInput = obj;
            
        }	    
        if(objInput == null) return;
        
        if(objInput.type == "checkbox"){
            if(obj.tagName.toUpperCase() == "SPAN" && fcpubdata.skins=="base") objInput.checked = objInput.checked ? false : true;
            obj.parentNode.value = objInput.checked ? obj.parentNode.getAttribute("truevalue") : obj.parentNode.getAttribute("falsevalue") ;
        }else{ //radio
            objInput.checked = true;
            obj.parentNode.value = objInput.value;
        }
        //数据集
        var sDs = objInput.parentNode.getAttribute("dataset") ;
        if(IsSpace(sDs) == false){
            $obj(sDs).cont1_onblur();
        }
        
	}
function $urlParam(paramName){
///取前台URL中的参数 2008-03-31 add
    if(IsSpace(paramName) == false){
        var values = parent.Request.QueryString(paramName);
        if(values == "undefined"){
            return "";
        }else{    
            return values.toString();
        }
    }
}
/**
*工具栏上的按钮的常用点击事件
*@date 2006-01-25
**/
function $eform(sKey) {
    
    var result=new Object();
    if(typeof(fcpubdata.eventBefore[sKey]) == "function"){
        fcpubdata.eventBefore[sKey](result);
        if(typeof(result) != "undefined" && typeof(result.returnValue) != "undefined"){
            if (result.returnValue == false) {
                return; //取消默认的动作.
            }
        }
    }
    var oEbiao = null;
    try{
        oEbiao = fcpubdata.controls["ebiao"][0] ;
    } catch (e) { }
    var webGrid = null;
    try {
        webGrid = fcpubdata.controls["grid"][0];
    } catch (e) { }

    var oDsMain = $id(fcpubdata.dsMain) ;
    var oDsMainJs = $obj(fcpubdata.dsMain);
    var oDsGridJs = Getdssub1(); //为JS对象
   // var oDsGrid ;
   // if (oDsGridJs != null) oDsGrid = $id(oDsGridJs.id); //转为JS对象
    
	switch (sKey){
	    case "第一页": oDsMainJs.FirstPage(); break;
	    case "上一页": oDsMainJs.PrevPage(); break;
	    case "下一页": oDsMainJs.NextPage(); break;
	    case "最后页": oDsMainJs.LastPage(); break;

	    case "新增": if (oEbiao != null) new Eapi.EformEbiao().run(oEbiao); oDsMainJs.Append(); oDsMainJs.fset_cont1(); fcpubdata.keyValue = ''; break; //当主键字段的默认值不为空时,就必须强制pubdjbh=''
	    case "删除": DelGridRow(oDsMain, function() { oDsMainJs.PrevPage(); }); break; //删除后记录上翻一页

	    case "复制新增": oDsMainJs.AppendCopy(); oDsMainJs.fset_cont1(); fcpubdata.keyValue = ''; break; //当主键字段的默认值不为空时,就必须强制pubdjbh=''
/*
		case "新增保存" :  fcpubdata.keyValue='';var sR=DjSave(); if(IsSpace(sR)){alert('新增保存成功!');oDsMain.Append();}else{alert(sR);} break; //当主键字段的默认值不为空时,就必须强制pubdjbh=''
		case "修改保存" :  fcpubdata.keyValue=new Eapi.RunForm().getKeyFieldValue();DjSaveShow(); break; 
		case "表单保存好后提示" : DjSaveShow(); break;
		case "表单保存" : DjSave(); break;
		case "表单保存好后退出" : DjSave('退出'); break;
        case "表单保存好后新增" : var sR=DjSave(); if(IsSpace(sR)){alert('保存成功!');oDsMain.Append();}else{alert(sR);} break;
*/

		case "查看视图": viewWinUrl(oDsGridJs, 1); break;
		case "新增视图": viewWinUrl(oDsGridJs, 2); break;
		case "编辑视图": viewWinUrl(oDsGridJs, 3); break;

		case "上移": if (IsSpace(webGrid) == false) GridChangeRowSort(true, webGrid); break;
		case "下移": if (IsSpace(webGrid) == false) GridChangeRowSort(false, webGrid); break;
		case "表格第一页": oDsGridJs.FirstPage(); break;
		case "表格上一页": oDsGridJs.PrevPage(); break;
		case "表格下一页": oDsGridJs.NextPage(); break;
		case "表格最后页": oDsGridJs.LastPage(); break;
		case "增加行": oDsGridJs.Append(); break;
		case "删除行": oDsGridJs.Delete(); break;
		case "删除行且删除记录": DelGridRow(oDsGridJs); break;
		case "标记方式删除": MarkDelRow(oDsGridJs); break;
		case "删除表格多选行" : MultiDelGridRow(oDsGridJs); break;
//		case "表格保存" : GridSave(oDsGrid); break;
//		case "表格保存好后退出" : GridSave(oDsGrid,'退出'); break;
		case "表格选中多行" : GridMultiSel(); break;

        case "提交数据" : return doSubmitData(); break;
        case "提交数据成功后提示" : var sErr = doSubmitData(function(){alert("提交数据成功!");}); if(IsSpace(sErr)==false) alert(sErr); break;
        case "提交数据成功后退出" : var sErr = doSubmitData(function(){CloseBill();}); if(IsSpace(sErr)==false) alert(sErr); break;
        case "提交数据成功后新增" : var sErr = doSubmitData(function(){alert("提交数据成功!");if(oEbiao != null)  new Eapi.EformEbiao().run(oEbiao); oDsMain.Append();}); if(IsSpace(sErr)==false) alert(sErr); break;

        case "提交数据成功后刷新上一窗口" : var sErr = doSubmitData(function(){alert("提交数据成功!");refreshUpGrid();}); if(IsSpace(sErr)==false) alert(sErr); break;
        case "打开窗口新增记录":
            if (fcpubdata.cardWinUrl == "") {
                alert("应先给fcpubdata.cardWinUrl全局变量赋值为要打开的窗口的URL或表单的djsn");
            } else {
                var oDs = getGridUseEvent();
                oDs = IsSpace(oDs) ? oDs = oDsGridJs : oDs = $obj(oDs.dataset);
                if (fcpubdata.isModalUser) {
                    var djsn = fcpubdata.cardWinUrl;
                    var sUrl = fcpubdata.cardWinUrl;
                    if (fcpubdata.cardWinUrl.indexOf("djframe.htm?") < 0) {
                        sUrl = "../../fceform/common/djframe.htm?djsn=" + fcpubdata.cardWinUrl + "&djtype=" + $urlParam("djtype");
                    } else {
                        var pos1 = fcpubdata.cardWinUrl.indexOf("djsn=");
                        if (pos1 >= 0) {
                            var pos2 = fcpubdata.cardWinUrl.indexOf("&", pos1);
                            if (pos2 < 0) {
                                djsn = fcpubdata.cardWinUrl.substring(pos1 + 5, fcpubdata.cardWinUrl.length);
                            } else {
                                djsn = fcpubdata.cardWinUrl.substring(pos1 + 5, pos2);
                            }
                        }
                    }
                    var oWinWidthHeight = billTypeToPos($urlParam("djtype"), djsn);
                    NavJs.openModalDialog(sUrl + "&opentype=1", oDs, oWinWidthHeight); //url上加上opentype=1表示新增。
                } else {

                    DjOpen(fcpubdata.cardWinUrl, oDs, "新增");
                }
            }
            break;
        case "打开窗口修改记录":
            if (fcpubdata.cardWinUrl == "") {
                alert("应先给fcpubdata.cardWinUrl全局变量赋值为要打开的窗口的URL或表单的djsn");
            } else {

                var oDs = getGridUseEvent();
                oDs = IsSpace(oDs) ? oDs = oDsGridJs : oDs = $obj(oDs.dataset);
                if (fcpubdata.isModalUser) {
                    var djsn = fcpubdata.cardWinUrl;
                    var sUrl = fcpubdata.cardWinUrl;
                    if (fcpubdata.cardWinUrl.indexOf("djframe.htm?") < 0) {
                        sUrl = "../../fceform/common/djframe.htm?djsn=" + fcpubdata.cardWinUrl + "&djtype=" + $urlParam("djtype");
                    } else {
                        var pos1 = fcpubdata.cardWinUrl.indexOf("djsn=");
                        if (pos1 >= 0) {
                            var pos2 = fcpubdata.cardWinUrl.indexOf("&", pos1);
                            if (pos2 < 0) {
                                djsn = fcpubdata.cardWinUrl.substring(pos1 + 5, fcpubdata.cardWinUrl.length);
                            } else {
                                djsn = fcpubdata.cardWinUrl.substring(pos1 + 5, pos2);
                            }
                        }
                    }
                    var oWinWidthHeight = billTypeToPos($urlParam("djtype"), djsn);
                    NavJs.openModalDialog(sUrl, oDs, oWinWidthHeight);
                } else {
                    DjOpen(fcpubdata.cardWinUrl, oDs, "修改");
                }
            }
            break;

		case "e表控件打印预览": doSubmitData(); printSubAction(1); break;
		case "e表控件打印": doSubmitData(); printSubAction(2); break;
		case "e表控件直接打印": doSubmitData(); printSubAction(3); break;
		case "e表控件直接打印所有页": doSubmitData(); printSubAction(4); break;
		case "e表控件打印所有页": doSubmitData(); printSubAction(5); break;
		case "分页导出到excel文件中": doSubmitData(); printSubAction("expexcel"); break;
		case "不分页导出到excel文件中": doSubmitData(); printSubAction("expexcelall"); break;
		case "导出所有页到pdf文件中": doSubmitData(); printSubAction("exppdf"); break;
		case "e表控件增加行": new Eapi.EformEbiao().appendRow(oEbiao, 0, false); break;
		case "e表控件删除行": new Eapi.EformEbiao().deleteRow(oEbiao, 0); break;

		case "选择日期": SelectDate(); break;
		case "选择日期时间": SelectDate("", true); break;
		case "选择日期年月": SelectDate(undefined, "year-m"); break;
		case "选择日期年": SelectDate(undefined, "year"); break;
		case "计算器" : ShowCalc(); break;
		case "关闭窗口" : CloseBill(); break;
		case "工具栏查询": toolbarQuery(); break;
		case "刷新条件格式": contTermStyle(); break;
		case "刷新权限控制" : if(typeof(EformCheckRoleInfo) == "function") EformCheckRoleInfo(); break;
		
		case "只保存业务数据": wftools_tempSave(); break;
		case "提交业务数据并执行流程": wftools_save(); break;
		case "提交业务和流程后转下一步": wftools_save(1); break;
		case "提交业务和流程后关闭窗口": wftools_save(2); break;
		case "提交业务和流程后无": wftools_save(3); break;
		case "只执行流程的动作": wftools_flowSave(); break;
		case "只执行流程的动作后转下一步": wftools_flowSave(1); break;
		case "只执行流程的动作后关闭窗口": wftools_flowSave(2); break;
		case "只执行流程的动作后无操作": wftools_flowSave(3); break;
		case "流程的轨迹图": wftools_trace(); break;
		case "挂起流程实例": wftools_suspended(); break;
		case "终止流程实例": wftools_killed(); break;
		
	}
    if(typeof(fcpubdata.eventAfter[sKey]) == "function"){
        fcpubdata.eventAfter[sKey](result);
    }

    function toolbarQuery() {
        
        if (IsSpace(parent.toolbar.document.getElementById("pagesize"))) return;

        var ipagesize = parent.toolbar.document.getElementById("pagesize").value;
        ipagesize = parseInt(ipagesize, 10);
        if (isNaN(ipagesize)) {
            alert("页尺寸必须是整数!");
            return;
        }
        var ipagegoto = parent.toolbar.document.getElementById("pagegoto").value;
        ipagegoto = parseInt(ipagegoto, 10);
        if (isNaN(ipagegoto)) {
            alert("跳转页数必须是整数!");
            return;
        }
        if (ipagegoto < 1) ipagegoto = 1;

        var odssub1 = Getdssub1();
        if (odssub1 == null) return;
        var oSKBILLgrid1 = GetDsGrid(odssub1);
                
        //odssub1 = eval(odssub1.id); //转为JS对象
        
        odssub1.PageSize = ipagesize;
        odssub1.PageNo = ipagegoto ;
        odssub1.Open(odssub1.opensql,'是');
        try {
            //oSKBILLgrid1 = eval(oSKBILLgrid1.id);
            oSKBILLgrid1.SetFocus(oSKBILLgrid1.FindFirstTD(oSKBILLgrid1.FixRows),'程序给焦点');
        }catch(e){}
        var iPageCount = odssub1.PageCount; 
        if(iPageCount < 1) iPageCount=1;
        var iPageNo = odssub1.PageNo; 
        if(iPageNo < 1) iPageNo=1;
        parent.toolbar.document.getElementById("pageno").value = iPageNo + '/' + iPageCount;
        if(ipagegoto> iPageCount) alert('转到页数不要大于总页数,这会造成查不到记录!');
    }
    function printSubAction(iTag) {
        var runSrc = "";
        //alert(fcpubdata.ebiaoRunUrl)
        if (IsSpace(fcpubdata.ebiaoRunUrl)) {
            var oFirstEbiao = fcpubdata.elList.oEbiao;
            if (IsSpace(oFirstEbiao)) {
                try {
                    var oFirstEbiao = fcpubdata.controls["ebiao"][0];
                } catch (e) { }
            }
            if (IsSpace(oFirstEbiao)) {
                try {
                    var oFirstEbiao = fcpubdata.controls["eblayout"][0];
                } catch (e) { }
            }
            
            if (IsSpace(oFirstEbiao)) {
                alert("必须设置全局变量:fcpubdata.ebiaoRunUrl的值或者在表单中加了ebiao控件或eblayout控件后才能使用此功能!");
                return;
            } else if (IsSpace(oFirstEbiao.getAttribute("printFile"))) {
                alert("未在ebiao控件的属性窗口中设置打印文件,所以无法使用此功能!");
                return;
            }
            var sP = oFirstEbiao.getAttribute("runParams");
            if (IsSpace(sP)) sP = "";
            runSrc = "../../fceform/ereport/ebrun.htm?file=" + oFirstEbiao.getAttribute("printFile") + "&urlpara=yes" + sP;
        } else {
            runSrc = fcpubdata.ebiaoRunUrl;
        }

        fcpubdata.eformPrintTag = iTag;
        if ($id(fcpubdata.eformPrintIframeName) == null) {
            //document.body.insertAdjacentHTML("BeforeEnd", "<IFRAME id=" + fcpubdata.eformPrintIframeName + " name=" + fcpubdata.eformPrintIframeName + " src='' width=0 height=0></IFRAME>");
            NavJs.insertHtml("BeforeEnd", document.body, "<IFRAME id=" + fcpubdata.eformPrintIframeName + " name=" + fcpubdata.eformPrintIframeName + " src='' width=0 height=0></IFRAME>");
        }
	    
	    //alert(runSrc)
	    $id(fcpubdata.eformPrintIframeName).src = runSrc;
	}
}
/* 运行报表结束后事件
* HandleAfterInitReport 函数名是固定名称,是在运行报表结束后就会调用此函数.
*	要调用运行报表工具栏的函数,可以用如下方式:
*	其中,Print(4) 为运行报表工具栏窗口的全局的js函数.
*/
function HandleAfterInitReport() {
    //alert("oo")
    var iTag = fcpubdata.eformPrintTag;
    if (IsSpace(iTag)) return;
    var sCommand = "";
    if (iTag == 1 || iTag == 2 || iTag == 3 || iTag == 4 || iTag == 5) {
        sCommand = "Print(" + iTag + ");";
    } else {
        sCommand = "ebRunToolbarMain('" + iTag + "')";
    }
    var oWin = $win(fcpubdata.eformPrintIframeName);
    
    
    $win("toolbar", oWin).eval(sCommand);
}

/*
function ebiaoExpFile(sKey,sPath){
   // var sPath = oFirstEbiao.printFile;
	var sFromDb = "";
    //if(fcpub.fromdb == "yes") sFromDb = "&fromdb=yes" ;
    if(fcpubdata.dotnetVersion == "") sPath=escape(sPath);
    sPath = escape(sPath);
    var sAll = location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=" + sKey + "&urlpara=yes&spath=" + sPath + sFromDb + getAllUrlParam();
    alert(sAll);
    open(sAll,"");
}
*/

/**
* 根据格式串计算出一个自动编号值
**/
function getAutoNum(sFormat)
{
	//var sFormat = "<format>"+txtFormat.value+"</format><param><name>凭证类别</name><value>收</value></param>";
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=getAutoNum","<format>"+sFormat+"</format>");

}
/**
* 取URL上的所有参数串,用于ebiao控件中,
* no use 2012-08-20
**/
function getAllUrlParam() { 
    var sParam=""
    for (var jj = 1; jj <= parent.Request.QueryString.Count(); jj++) {
        var sName = parent.Request.QueryString.Key(jj);
        if (sName != "djsn" && sName != "djtype")
            sParam += "&" + sName + "=" + parent.Request.QueryString.Item(jj); //.toString()
    }
    //约定报表参数名为 fcKeyValue,当DjOpen打开并传数据集对象时.当DjOpen新增时(即 parent.piAction == 1) 不能加上下面这一行传参.
    if (IsSpace(fcpubdata.keyValue) == false && parent.piAction != 1) sParam = "&fcKeyValue=" + escape(fcpubdata.keyValue);
    return sParam;
}
/**
*打开新增视图，修改视图，查看视图的方法
*2011-04-27
**/
function viewWinUrl(oDs, code) {
    var djsn = "";
    var colNoKeyField = "";
    var arr = MultiKeyTmp(oDs); //主键字段数组
    var billkeyfield = fcpubdata.area.getAttribute("keyfield");
    var colNoKeyField = 0; //主键字段所处的列号,在数据集XML中的
    if (IsSpace(billkeyfield)) {
        if (arr.length > 0) {
            colNoKeyField = arr[0];
        } else {
            alert("没有设置主键字段,表格上的数据无法保存!");
            return;
        }
    } else {
        colNoKeyField = oDs.FieldNameToNo(billkeyfield);
    }
    keyField = NavJs.textContent( oDs.oDataField.childNodes[colNoKeyField].childNodes[0]); //主键字段
    var keyFieldValue = NavJs.getNodeValue11(oDs.oDom, oDs.RecNo, colNoKeyField);  //主键字段值
    if (code == 1) {
        djsn = fcpubdata.viewWinSee;
        keyFieldValue = "&keyFieldValue=" + keyFieldValue;
    } else if (code == 2) {
        djsn = fcpubdata.viewWinAdd;
        keyFieldValue = "";
    } else if (code == 3) {
        djsn = fcpubdata.viewWinEdit;
        keyFieldValue = "&keyFieldValue=" + keyFieldValue;
    }
    var djType = $urlParam("djtype");
    var sUrl = "../../fceform/common/djframe.htm?djsn=" + djsn + "&djtype=" + djType + keyFieldValue;
    window.open(sUrl, '_parent');
}
/**
* 生成时，控制不出alert,只记录错误信息
**/
function alertMsgInfo(sMsg) {
    if (fcpubdata.genEventObj.isGen == "htm") {
        if (IsSpace(fcpubdata.genEventObj.genErrInfo)) fcpubdata.genEventObj.genErrInfo = "";
        fcpubdata.genEventObj.genErrInfo += sMsg + " \n";
    }else{
        alert(sMsg);
    }
    return sMsg;
}
function loadAllLayout() {
    ///所有布局模版的生成程序
    
    var sContXml = fcpubdata.area.getAttribute("contxml");
    if (sContXml == null) return;
    var oContXml = SetDom(sContXml);
    if (oContXml.documentElement == null) return;
    var oNode = oContXml.documentElement.selectSingleNode("eblayout");
    if (oNode == null) return;

    
    if (fcpubdata.genEventObj.isGen == "htm") {
        fcpubdata.genEventObj.sbDsStr = new Sys.StringBuilder();
        fcpubdata.genEventObj.sbJsStr = new Sys.StringBuilder();
    }
    var htmFileName = fcpubdata.area.getAttribute("dj_sn");
    
    for (var i = 0; i < oNode.childNodes.length; i++) {
        var id = oNode.childNodes[i].text;
        var layoutName = $urlParam(id);

        var oEbiao = $id(id);
        var contentType = oEbiao.getAttribute("contentType");
        if (!IsSpace(contentType) && contentType  != "rptStr") break;
        
        fcpubdata.genArrObj[id] = new Array();

        if (IsSpace(fcpubdata.genEventObj.oContsId)) fcpubdata.genEventObj.oContsId = new Array();
        if (IsSpace(fcpubdata.genEventObj.oStartRow)) fcpubdata.genEventObj.oStartRow = new Array();
        if (IsSpace(fcpubdata.genEventObj.sbHide)) fcpubdata.genEventObj.sbHide = new Sys.StringBuilder();

        if (IsSpace(layoutName)) {
            var tableName = $urlParam(id + "_table");
            tableName = tableName.toUpperCase();
            if (IsSpace(tableName) == true) { //fhj2012-07-26 表单运行参数不正确
                return alertMsgInfo("表单运行参数不正确");
                
            }

            new Eapi.Layout().loadOneLayoutTable(tableName, oEbiao, oContXml);
            if (!IsSpace(tableName)) htmFileName += "," + id + "_table=" + tableName;
        } else {

            new Eapi.Layout().loadOneLayout(layoutName, oEbiao, oContXml);
            htmFileName += "," + id + "=" + layoutName;
        }
    }
    
    if (fcpubdata.genEventObj.isGen != "htm") return;
    //保存编译后的HTM文件。
    //    sAllHtml = "<![CDATA[" + "<script>" + pstrUserFunction + "</script>" + sRun + pstrAddHtml + "]]>";
    
    var jsUser = fcpubdata.area.getAttribute("jsUser");
    var refJs1 = fcpubdata.area.getAttribute("refJs1");
    var refJs2 = fcpubdata.area.getAttribute("refJs2");
    var addHtml = fcpubdata.area.getAttribute("addHtml");

    fcpubdata.area.removeAttribute("jsUser");
    fcpubdata.area.removeAttribute("refJs1");
    fcpubdata.area.removeAttribute("refJs2");
    fcpubdata.area.removeAttribute("addHtml");
    
    var sbAll = new Sys.StringBuilder();
    sbAll.append("<![CDATA[");
    sbAll.append("<script>");

    if(jsUser != null) sbAll.append(unescape(jsUser));
    sbAll.append("</" + "script>");
    //alert(refJs1)
    if (refJs1 != null) sbAll.append(unescape(refJs1));
    var tmpS1 = fcpubdata.area.outerHTML;
    tmpS1 = Trim(tmpS1);

    sbAll.append(tmpS1.substring(0, tmpS1.length - 6)); //去掉</div>
    sbAll.append(fcpubdata.genEventObj.sbDsStr);
    sbAll.append("</DIV>");
    sbAll.append("<script>")
    if (refJs2 != null) sbAll.append(unescape(refJs2));
    sbAll.append(fcpubdata.genEventObj.sbJsStr);
    sbAll.append("</" + "script>");
    if (addHtml != null) sbAll.append(unescape(addHtml));
    sbAll.append("]]>");
    htmFileName = RepXml(htmFileName);
    var sErr = genDjHtmlFile(sbAll.toString(), htmFileName, "zk/formtemp/", "htm", fcpubdata.area.getAttribute("allBrowser"));
    return sErr;
}
function runWidget(sCommand) {
    /// sCommand == loadBefore ,运行自定义控件中的相应事件，2013-03-19

	var sContXml = fcpubdata.area.getAttribute("contxml") ;
	var _oContXml = SetDom(sContXml);
	if (_oContXml.documentElement != null) {
	    var len = _oContXml.documentElement.childNodes.length;
	    for (var i = 0; i < len; i++) {
	        var controlType = _oContXml.documentElement.childNodes[i].nodeName;
	        if (isWidget(controlType)) {
	            var oo = new Eform.AllWidget().getRunObj(controlType);
	            eval("oo."+sCommand);
	        }
	    }
	}


}
function isWidget(controlType) {
    var arr = fcpubdata.oldWidgets.split(",");
    for (var j = 0; j < arr.length; j++) {
        if (arr[j] == controlType) return false;
    }
    return true;
}