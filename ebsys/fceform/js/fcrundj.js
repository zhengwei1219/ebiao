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
        ///�ҵ���ǰ�����������ֶε�ֵ,�����޸ı���ʱ.
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
        ///<summary>ȡ���ϵ����пؼ�</summary>
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
*������������������������֮�䴫����ʱʹ��
*@param paraname ��������
*@param vValue ����ֵ
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
*װ������¼��Ĵ���ģ��
*@param sKey1 ��ʶ���ò�ͬ�ĺ���,��Ϊ�����ʾɶҲ����,����:sKey1="savedj" 
*@param sclass �����������  ='clickmenu'������˵� ='click'�Ǳ��ؼ����¼� ='grid'����¼�(�Ҽ��˵�,���ID����sXml������)  ='gridclick'����е��¼�(���д�����˫�����������¼�)
*@param sXml Ϊ����¼���Ϊ���ִ���һ�з�����XML��,�˲���ֻ���ڱ���¼���.
*@return ��
**/
function LoadMod(sKey1, sclass, sXml) {
 
    if(arguments.length==0 || isSpace(sKey1) ) return;
    var sKey=new Eapi.Str().trim(sKey1);
    var blnRemove=false;  //true ��ʾȥ���˺����()
    //ȥ���ұߵ�()
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
	    
		//�����кŵõ���ͬ������      
	   ogrid=$obj(oXml.documentElement.tagName);
	   //��ǰ�к�
	   var curcol = ogrid.curTD.cellIndex;
	   //�������µĴ�����ʹ���checkbox��ʱ�ᷢ������¼� 2010-07-28 my add
	   var curEventTD = NavJs.getEventObj();
	   if (IsSpace(curEventTD) == false && curEventTD.tagName == "TD") {
	       if (curEventTD.style.backgroundImage == "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_checked.gif)" || curEventTD.style.backgroundImage == "url(" + fcpubdata.path + "/fceform/images/ef_run_grid_uncheck.gif)") {
	           curcol = curEventTD.cellIndex;
	       }
           //������һ��,�Է�ֹ�㵽�̶�������ʱ����ִ�е���¼��Ĵ���.2010-12-09 my add
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
	//����Ҽ�����
//	if(sclass=="grid"){
//		ogrid=$obj(sXml);
//		var grid_ds=$obj(ogrid.dataset);
//		//�����ֻ��һ��ʱ���г���
//		try {
//		    curO = NavJs.getEventObj();
//      	}catch (e) {}
//	}

  	//�Ҳ��������������У������г�������ʾ
 	if(isSpace(sKey)==false){
 	    if (blnRemove) sKey = sKey + "()";
 	    var oEvent = NavJs.getEvent();
 	    var oEventObj = NavJs.getEventObj();
 	    if (oEvent != null && (oEvent.type == "change" || oEvent.type == "blur")) sKey = "var objContEvent = $id('" + oEventObj.id + "'); if(objContEvent!=null) objContEvent.setAttribute('stopValid',0); try {" + sKey + "}catch (e) {if(IsSpace(e.description) == false) alert(e.description);if(objContEvent!=null) objContEvent.setAttribute('stopValid',1);}"; //change�¼�ʱ��������֤����
 	    var oev = new Function("oEvent", sKey);
        oev(oEvent);
 	    
 	    //NavJs.insertEventParam(sKey, oEvent);
 	      
    	//eval(sKey);
    	//try {
    	//}catch (e) {
    	//	alert(sKey+"�������г���ԭ��"+e.description);
    	//}
    }


}

/**
*���ݵĵ����˵��¼�����
**/
function clickmenu(sKey) {
   LoadMod(sKey,"clickmenu");
}
/**
*���ݵı���һ��˵��¼�����
*@param sKey ��������
*@param gridID ���ID
*@date 2003-05-23
**/
function clickrightmenu(sKey,gridID) {
   LoadMod(sKey,"grid",gridID);
}
/**
*���ݵ�open�¼�����
**/

function bill_blonopen(sKey) {
   LoadMod(sKey,"clickmenu");
}
function bill_blonclose(sKey) {
   LoadMod(sKey,"clickmenu");
}

/**
*���ݵĵ����¼�����
**/
function bill_onclick(sKey){
//��sKey����ʶ���ò�ͬ�ĺ���,��Ϊ�����ʾɶҲ����
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
*���ݵ�˫���¼�����
**/
function bill_ondblclick(sKey, ogrid) {
	LoadMod(sKey,"click");
}
/**
*���ݵĻ�ý����¼�����
**/
function bill_onenter(sKey){
	//if(event.srcElement.isContentEditable==false){
	
		LoadMod(sKey,"click");
	//}
}
/**
*���ݵ�ʧȥ�����¼�����
**/
function bill_onexit(sKey){
	//if(event.srcElement.isContentEditable==false){
		LoadMod(sKey,"click");
	//}
}
/**
*���ݵİ����¼�����
**/
function bill_onkeydown(sKey){
	//if(event.srcElement.isContentEditable==false){
	/*
	var keycode=event.keyCode
	if(keycode==13) { //�س���
		var s2=event.srcElement.ondblclick
		if(s2 != null ){
			//ȥ��{}��ߵĶ���
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
*���е���
**/
function RunTabindex(){
	var sXml=fcpubdata.area.getAttribute("billtaborder");
	if(sXml=="<root></root>")return ;//������һ�ؼ�.
	
   //var stagname=event.srcElement.tagName.toUpperCase()
   //if(stagname=="TEXTAREA" || event.srcElement.id=="txtMyGrid" ) return
	var evt = NavJs.getEvent();
	var ikeycode = evt.keyCode;
	var objSrc = NavJs.getEventObj();

	

	//	alert("aaa")
	//	topic.focus()
/*	
   if(ikeycode==27) {
		var ret = window.confirm("ȷ���رյ�ǰ������");		
		if (ret) {
   			parent.window.close()  //ESC���˳�
		}   		
   }
*/   //alert(ikeycode)
   //|| ikeycode==40 || ikeycode==13  || ikeycode==38
   if( ikeycode==9){ //tab��
       
       var bRunUp=false;  //��ʾ������,true��ʾ������
       if(ikeycode==38) bRunUp=true;
       //�統ǰ�ؼ�Ϊ checkbox ��ȡ��ID

       curID = objSrc.id;
       if (curID == "chk") curID = objSrc.parentNode.parentNode.id;
		//�統ǰ�ؼ�Ϊ��,ȡ��ID,ָradio
       if (isSpace(curID)) curID = objSrc.parentNode.id;
	   //��Ϊfccode�ؼ�
       if (curID == "fc_txtName") curID = objSrc.parentNode.id;
       if (curID == "Numedit") curID = objSrc.parentNode.id;
	   //��ʾ��ǰΪ���ؼ�
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


	   //���ϵ���һ���ؼ����ɼ��򲻿���ʱҪ���������Ƶ���һ���ؼ�.
		var iLoops=1;  //Ϊ������ѭ��,�������ѭ��20��
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
			var gridObj = $obj(nextObj.id); //htc�ؼ��Ķ���
			
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
	                if (gridObj.visible == "��") {
					    if (gridObj.tab.rows.length >= gridObj.FixRows) {
					        gridObj.SetFocus(gridObj.FindFirstTD(gridObj.FixRows), "���������");
	
						}else{
						    gridObj.SetFocus(null, "");
							//����ǰTD����
						    gridObj.curTD.focus();
						}					
						//nextObj.SetFocus(null,"")
						//����ǰTD����
						//nextObj.curTD.focus()
					}else {
						iLoops++;
						continue;			  	
					
					}
				}else {
					//��ҳǩ�ؼ�ʹ�ؼ����ɼ������
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
//ҳ���ʱ���õ�һ���ؼ��Ľ���
function FirstFocus(){
    var sXml = fcpubdata.area.getAttribute("billtaborder");
	if(sXml=="<root></root>")return; //������һ�ؼ�.
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
			    if (gridObj.visible == "��") {
			        if (gridObj.tab.rows.length >= gridObj.FixRows) {
			            gridObj.SetFocus(gridObj.FindFirstTD(gridObj.FixRows), "���������");

					}else{
					    gridObj.SetFocus(null, "");
						//����ǰTD����
					    gridObj.curTD.focus();
					}
					//nextObj.SetFocus(nextObj.curTD);
				}else {
					i++;
					continue;			  	
				}
			}else {
				//��ҳǩ�ؼ�ʹ�ؼ����ɼ������
				try{
			  		nextObj.focus();
			  	}catch(E){}
			}
		}
		i=21;
	}

}


/**
*�˴�����ʹ��document.write
*@date 2004-05-19
**/
function pub_djhtm() {
    fcpubdata.logger().debug("init start!", arguments.callee);
    parent.fcpubdata.loading = "init";

    if (!IsSpace(Eform.AllWidget)) {
        new Eform.AllWidget().readyBefore();
    }

    //document.writeln("<img id=imgFcWait src='../../fceform/images/ef_wait.gif' style='position:absolute;left:30px;top:30px;'>");
    
    fcpubdata.keyValue = parent.sOpenDjNo ; //����ֵ
   //����ȫ�ֱ���
    fcpubdata.obj = fcpubdata.keyValue;   //��ֻ��һ���ַ�����ʱ,pubDataSetҲ�Ǵ��ַ�������ֵ.
	
	if(typeof fcpubdata.keyValue == "object"){
		fcpubdata.keyValue="";
	} 
	//var skinJs = "<script src='../css/skins/fcskins.js'></" + "script>";
	//var sSkin
	//alert(fcpubdata.skins);
	//if(typeof(parent.pubMainObj) != "undefined"){ //���ϴ��ж�,����ֱ�����б����ɵ�htm�ļ�ʱ����.
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
	    //�̶������Զ���ؼ�����ʽ��my add 2013-03-21
	    document.writeln("<link href='../../widget/css/" + fcpubdata.skins + "/all.css' type='text/css' rel='stylesheet'>"); 
	    
	//����ڴ�
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
	//��Ʊ����ȡ����ʱ��ռ�����djselectlock
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
	//	event.returnValue="�뿪��ǰҳ�潫���µ�ǰ��������ݶ�ʧ! �� [ȷ��] �򲻱������ݲ��رմ��ڡ�";
	//}
	ajax_stop();
}
function pub_window_onresize() {
    //����ת�Ƶ�djframe.htm ҳ�������ˡ�
}
function pub_window_onresize_bak() {
    var eventResize = fcpubdata.area.getAttribute("BLONresizeBefore");
    if (!IsSpace(eventResize))
        eval(eventResize);

    runWidget("resizeBefore()");
    //�����Զ��߿�
    try {
        var winHeight = 0;
        try {
            if (window.parent.document.getElementById("filter") == null) { // �ܿ�E�����ʱ
                var oToolbar = window.parent.document.getElementById("toolbar");
                if (oToolbar != null) {
                    var iHeight = ToInt(oToolbar.style.height);
                    winHeight = (getClientSize(parent).height - iHeight);
                    window.parent.document.getElementById("topic").style.height = winHeight + "px";
                }
            }
        } catch (e) {
            fcpubdata.logger().error("Resizeʱ������������߶ȳ���!", arguments.callee, e);

        }

        var o = NavJs.getGridArr() ; //window.document.all.tags("webgrid");
        var oWinSize = getClientSize();
        var winWidth = oWinSize.offsetWidth;
        if(winHeight == 0) winHeight = oWinSize.offsetHeight;
        
        //2013-07-29 add�±����С�
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
	            //���� webgrid.js ʱ��2013-07-25
	            if (document.compatMode == "CSS1Compat") {
	                winWidth = winWidth - 2;
	                winHeight = winHeight - 2;

	            } 	        
	        }
		    if (o[ii].getAttribute("autowidth") == "��") {

		        var tmpwidth = winWidth - parseInt(o[ii].getAttribute("left")) ; //-16 (new Eapi.GetPos().getPosLeft(o[ii])))
			    if (tmpwidth < 0) tmpwidth = 0;
			    //alert(tmpwidth)
			    o[ii].width = tmpwidth;
			    try {
			        //modify by liuxr at 2010-12-6 15:29 ��grid�� heightֵ
			        $obj(o[ii].id).fnPutwidth(tmpwidth+"px");
			    } catch (e) { }
			    
		    }
		    if (o[ii].getAttribute("autoheight") == "��") {

		        var tmpheight = winHeight - parseInt(o[ii].getAttribute("top")) ; //-10 (new Eapi.GetPos().getPosTop(o[ii])))
			    if (tmpheight < 0) tmpheight = 0;
			    //alert(tmpheight);
			    o[ii].height = tmpheight;
			    try {
			        //modify by liuxr at 2010-12-6 15:29 ��grid�� heightֵ
			        $obj(o[ii].id).fnPutheight(tmpheight + "px");
			    } catch (e) { }
			    
    			

		    }

	    }
    } catch (e) {
        fcpubdata.logger().error("��������Զ��߿����!", arguments.callee, e);

    }
	
	//alert("a:"+document.body.clientWidth)

    try {
	    FormAutoResize();
	   
    }catch (e) 
    {
        fcpubdata.logger().error("FormAutoResize() �����Զ����ֳ���!", arguments.callee, e);
            
    }
/* �±ߵĴ����Ƶ� fcebiao.js ��
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
    //����resize�¼���2012-08-28
    var eventResize = fcpubdata.area.getAttribute("BLONresizeAfter");
    if (!IsSpace(eventResize))
        eval(eventResize);
}
//��ҳ���ϵĿؼ��������ò���
//added by liuxr at 2008-10-15
function FormAutoResize()
{
	var sXml = fcpubdata.area.getAttribute("AutoResizeXml");
	//alert("����   " + sXml);
	if (IsSpace(sXml)) return ;
	var oXml = SetDom("<root>" + sXml + "</root>");
	for (var i=0;i<oXml.documentElement.childNodes.length;i++)
	{
		var id = oXml.documentElement.childNodes[i].getAttribute("id");				//�ؼ�ID

		var Halign = NavJs.getNodeValue11(oXml,i,0); //oXml.documentElement.childNodes(i).childNodes(0).text;			//ˮƽ������뷽ʽ
		var HWidth = NavJs.getNodeValue11(oXml, i, 1);  		//�ര�ڱ��ж�Զ
		var HUnit = NavJs.getNodeValue11(oXml, i, 2); 		//��λ���ര�ڱ��ж�Զ��px/%��

		var WSetType = NavJs.getNodeValue11(oXml, i, 3); 	//������÷�ʽ���ٷֱ����ã��������ã�
		var Width = NavJs.getNodeValue11(oXml, i, 4); 		//���
		var WExt = NavJs.getNodeValue11(oXml, i, 5); 		//��ȱ仯���������Ҷ�Զ(px/%)
		var WSetUnit = NavJs.getNodeValue11(oXml, i, 6); 	//��λ����ȱ仯���������Ҷ�Զ��
		var MinW = NavJs.getNodeValue11(oXml, i, 7); 		//��Сֵ����ȣ�

		var Palign = NavJs.getNodeValue11(oXml, i, 8); 		//��ֱ������뷽ʽ
		var PWidth = NavJs.getNodeValue11(oXml, i, 9); 		//�ര�ڱ��ж�Զ
		var PUnit = NavJs.getNodeValue11(oXml, i, 10); 		//��λ���ര�ڱ��ж�Զ��px/%��

		var HSetType = NavJs.getNodeValue11(oXml, i, 11); 	//�߶����÷�ʽ���ٷֱ����ã��������ã�
		var Height = NavJs.getNodeValue11(oXml, i, 12); 	//�߶�
		var HExt = NavJs.getNodeValue11(oXml, i, 13); 		//�߶ȱ仯���������¶�Զ(px/%)
		var HSetUnit = NavJs.getNodeValue11(oXml, i, 14); 	//��λ���߶ȱ仯���������Ҷ�Զ��
		var MinH = NavJs.getNodeValue11(oXml, i, 15); 		//��Сֵ���߶ȣ�

		var objCont = $id(id);
		runAutoResize({
		    type: "width", //Ҫ����������
		    objCont: objCont, //Ҫ�����Ŀؼ�����
		    align: "", //���뷽ʽ
		    setType: WSetType, //�������á��ٷֱ�����
		    value100: Width, //�ٷֱ�ֵ
		    valueUnit: WExt,  //����ʱ�����һ���µ�ֵ������ʱ���ര�ڱߵ�ֵ��
		    unitName: WSetUnit, //��λ px/%
		    minValue: MinW //��Сֵ��

		});
		runAutoResize({
		    type: "height", //Ҫ����������
		    objCont: objCont, //Ҫ�����Ŀؼ�����
		    align: "", //���뷽ʽ
		    setType: HSetType, //�������á��ٷֱ�����
		    value100: Height, //�ٷֱ�ֵ
		    valueUnit: HExt,  //����ʱ�����һ���µ�ֵ������ʱ���ര�ڱߵ�ֵ��
		    unitName: HSetUnit, //��λ px/%
		    minValue: MinH //��Сֵ��

		});
		runAutoResize({
		    type: "left", //Ҫ����������
		    objCont: objCont, //Ҫ�����Ŀؼ�����
		    align: Halign, //���뷽ʽ
		    setType: "", //�������á��ٷֱ�����
		    value100: "", //�ٷֱ�ֵ
		    valueUnit: HWidth,  //����ʱ�����һ���µ�ֵ������ʱ���ര�ڱߵ�ֵ��
		    unitName: HUnit, //��λ px/%
		    minValue: "" //��Сֵ��

		});
		runAutoResize({
		    type: "top", //Ҫ����������
		    objCont: objCont, //Ҫ�����Ŀؼ�����
		    align: Palign, //���뷽ʽ
		    setType: "", //�������á��ٷֱ�����
		    value100: "", //�ٷֱ�ֵ
		    valueUnit: PWidth,  //����ʱ�����һ���µ�ֵ������ʱ���ര�ڱߵ�ֵ��
		    unitName: PUnit, //��λ px/%
		    minValue: "" //��Сֵ��

		});		
		
	/*	 		
		var ObjId = $id(id);		//�ؼ�����
		//alert(id);
		//alert(document.body.offsetWidth);
		//�ؼ����
		var iWidth = CalObjWidthOrHeight(ObjId,"���",WSetType,Width,WExt,WSetUnit,MinW);
		if (parseInt(iWidth, 10) > 0) setContPosValue(ObjId, "width", iWidth); //ObjId.style.width = iWidth; 
		//alert("width��" +ObjId.style.width);
		
		//�ؼ��߶�
		var iHeight = CalObjWidthOrHeight(ObjId,"�߶�",HSetType,Height,HExt,HSetUnit,MinH);
		if (parseInt(iHeight, 10) > 0) setContPosValue(ObjId, "height", iHeight); //ObjId.style.height = iHeight;
		//alert("height��" + ObjId.style.height )
		
		//ˮƽ����
		//debugger;
		var ileft = CalObjLeftOrTop(ObjId,"left",Halign,HWidth,HUnit);
		if (parseInt(ileft, 10) > 0) setContPosValue(ObjId, "left", ileft); //ObjId.style.left = ileft;
		//alert("left��" + ObjId.style.left);
		
		//��ֱ����
		var itop = CalObjLeftOrTop(ObjId,"top",Palign,PWidth,PUnit);
		if (parseInt(itop, 10) > 0) setContPosValue(ObjId, "top", itop); //ObjId.style.top = itop;
		//alert("top��" + ObjId.style.top);
*/
    }

}
function runAutoResize(objParam) {
    ///���ⲿ���õ�API�������Զ����ֹ��ܵĴ���ʵ�֡�2012-12-30
  /*  
    var objParam = {
        type: "left/top/width/height", //Ҫ����������
        objCont: null, //Ҫ�����Ŀؼ�����
        align: "",//���뷽ʽ
        setType: "", //�������á��ٷֱ�����
        value100: 20, //�ٷֱ�ֵ
        valueUnit:2,  //����ʱ�����һ���µ�ֵ������ʱ���ര�ڱߵ�ֵ��
        unitName: "px", //��λ px/%
        minValue: 100 //��Сֵ��
    }
    */
    if (objParam.type == "left") {
        //ˮƽ����
        var ileft = CalObjLeftOrTop(objParam.objCont , "left", objParam.align , objParam.valueUnit , objParam.unitName);
        if (parseInt(ileft, 10) > 0) setContPosValue(objParam.objCont, "left", ileft); 
    }
    if (objParam.type == "top") {
        //��ֱ����
        var itop = CalObjLeftOrTop(objParam.objCont, "top", objParam.align, objParam.valueUnit, objParam.unitName);
        if (parseInt(itop, 10) > 0) setContPosValue(objParam.objCont, "top", itop); 
    }
    if (objParam.type == "width") {
        //�ؼ����
        var iWidth = CalObjWidthOrHeight(objParam.objCont, "���", objParam.setType , objParam.value100  , objParam.valueUnit, objParam.unitName , objParam.minValue );
        if (parseInt(iWidth, 10) > 0) setContPosValue(objParam.objCont, "width", iWidth); 
    }
    if (objParam.type == "height") {
        //�ؼ��߶�
        var iHeight = CalObjWidthOrHeight(objParam.objCont, "�߶�", objParam.setType, objParam.value100, objParam.valueUnit, objParam.unitName, objParam.minValue);
        if (parseInt(iHeight, 10) > 0) setContPosValue(objParam.objCont, "height", iHeight); 
    }
    //���ؼ���λ��ֵ, 2010-12-07 my add
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

    //����ؼ���left��top
    /**
     * objid���ؼ�����objtype������ؼ���left����top��objalign�����뷽ʽ��
     * objwidth���ര�ڱ��ж���(px/%)��objunit����λ(px/%)
    **/
    function CalObjLeftOrTop(objid,objtype,objalign,objwidth,objunit)
    {
	    var ivalue = 0;	//�ؼ������left��top��ֵ
	    var bodyWidth = getClientSize().offsetWidth; //objid.parentNode.offsetWidth; //document.body.offsetWidth;
	    var bodyHeight = getClientSize().offsetHeight; //objid.parentNode.offsetHeight; //document.body.offsetHeight;
	    //if (bodyHeight == 0) bodyHeight = getClientSize().height;  //��objid.parentNode = SKbillsheetʱ,��offsetHeight=0
    	
	    var iwidth = objid.style.width;
	    if (iwidth == "") iwidth = "0";
	    var iheight = objid.style.height;
	    if (iheight == "") iheight = "0";
    	
	    if (objwidth == "") objwidth = "0";
    	
	    switch(objalign)
	    {
		    case "����":
			    if (objunit == "%")
				    ivalue = parseInt(bodyWidth,10)*parseInt(objwidth,10)/100;
			    else
				    ivalue = objwidth;
			    break;
		    case "����":
			    if (objunit == "%")
				    ivalue = parseInt(bodyWidth,10)-(parseInt(bodyWidth,10)*parseInt(objwidth,10)/100)-parseInt(iwidth);
			    else
				    ivalue = parseInt(bodyWidth,10)-parseInt(objwidth,10)-parseInt(iwidth);
			    break;
		    case "����":
			    if (objunit == "%")
				    ivalue = parseInt(bodyHeight,10)*parseInt(objwidth,10)/100;
			    else
				    ivalue = objwidth;
			    break;

            case "����":
    		    
			    if (objunit == "%")
				    ivalue = parseInt(bodyHeight,10)-(parseInt(bodyHeight,10)*parseInt(objwidth,10)/100)-ToInt(iheight);
			    else
				    ivalue = parseInt(bodyHeight,10)-parseInt(objwidth,10)-ToInt(iheight);
			    break;
		    case "����":
			    if (objtype == "top")
				    ivalue = (parseInt(bodyHeight,10)-parseInt(iheight))/2;			
			    else
				    ivalue = (parseInt(bodyWidth,10)-parseInt(iwidth))/2;
			    break;
	    }
	    return ivalue;
    }

    //����ؼ��Ŀ�Ȼ�߶�
    /**
    * objid���ؼ�����objtype:����ؼ��ĸ߶Ȼ��ǿ�ȣ�settype:�����/�߶ȣ������÷�ʽ��
    * objattr���ؼ�����Ŀ�Ȼ�߶ȣ�objext:�����/�߶ȣ��仯���������Ҷ�Զ��px/%����
    * objsetunit����λ�����/�߶ȱ仯���������Ҷ�Զ��;objmin:��Сֵ����Ȼ�߶ȣ�
    **/
    function CalObjWidthOrHeight(objid, objtype, settype, objattr, objext, objsetunit, objmin) {
        var ivalue = 0;   //�ؼ�����Ŀ�Ȼ�߶ȵ�ֵ
        //var bodyWidth = objid.parentNode.offsetWidth; //document.body.offsetWidth;
        //var bodyHeight = objid.parentNode.offsetHeight; //document.body.offsetHeight;
        //if (bodyHeight == 0) bodyHeight = getClientSize().height;  //��objid.parentNode = SKbillsheetʱ,��offsetHeight=0
        var bodyWidth = getClientSize().offsetWidth;
        var bodyHeight = getClientSize().offsetHeight; 
        
        //�ؼ�����Ŀ�Ȼ�߶ȵ����÷�ʽ
        if (settype == "�ٷֱ�����") {
            if (objattr == "") objattr = "0";
            if (objtype == "���")
                ivalue = ToInt(bodyWidth) * ToInt(objattr) / 100;
            else
                ivalue = ToInt(bodyHeight) * ToInt(objattr) / 100;
        }
        else	//��������
        {
            if (objext == "") objext = "0";
            var ileft = objid.style.left;
            if (ileft == "") ileft = 0;
            var itop = objid.style.top;
            if (itop == "") itop = 0;

            if (objsetunit == "%") {
                if (objtype == "���")
                    ivalue = ToInt(bodyWidth) - (ToInt(bodyWidth) * ToInt(objext) / 100) - ToInt(ileft);
                else
                    ivalue = ToInt(bodyHeight) - (ToInt(bodyHeight) * ToInt(objattr) / 100) - ToInt(itop);
            }
            else {
                if (objtype == "���") {
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
        fcpubdata.logger().error("����û��SKbillsheetԪ��!", arguments.callee);
        after_onload();
        return;
    }
    //�ֻ��Ϲ̶���openModalDialog, 2013-03-26
    var envType = fcpubdata.area.getAttribute("envType");
    if (!IsSpace(envType) && envType != "����") {
        fcpubdata.isModalUser = true;
    }

    //�ܷ����б��ļ��.
    var sPermit = $urlParam("ispermit");
    var isPermit = (IsSpace(sPermit) && fcpubdata.area.getAttribute("isCheckPermit") == "��") || sPermit == "1";
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

	//���ƴ�eform��Ƶı���Ȩ�޽ӿ�
	if(typeof EformEnterStatus == "function" ) {
		fcpubdata.enterStatus = EformEnterStatus();
		if(IsSpace(fcpubdata.enterStatus)) { //��Ȩ�򿪴˱�
			parent.close() ;
			after_onload();
			window.document.write("��Ȩ�򿪴˱�");
			return ;
		}
    }

    runWidget("loadBefore()");

    //���ϱ����в�����2013-05-23
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
        
    //װ�벼��ģ��. 2012-07-04
    if (fcpubdata.area.getAttribute("type") == "MB") {
        fcpubdata.genEventObj.isGen = $urlParam("isgen");
        if (!IsSpace(fcpubdata.genEventObj.isGen)) { //Ϊ�ձ�ʾֱ���������ɺõ�HTM�ļ�
            var tmpErr = loadAllLayout();
            if (fcpubdata.genEventObj.isGen == "htm") {
                //װ�벢������һ��htm
                var tmpObj = parent.parent.fcpubdata.pubObj;
                if (typeof (tmpErr) == "undefined") tmpObj.errInfo += tmpObj.arrUrl[tmpObj.indexUrl] + " û�����ɣ�";
                if (!IsSpace(tmpErr)) tmpObj.errInfo += tmpObj.arrUrl[tmpObj.indexUrl] + " ����htm�ļ�ʱ����������Ϣ�� "+tmpErr;
                if (!IsSpace(fcpubdata.genEventObj.genErrInfo)) tmpObj.errInfo += tmpObj.arrUrl[tmpObj.indexUrl] + " ���ɳ���������Ϣ�� " + fcpubdata.genEventObj.genErrInfo;

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
        fcpubdata.logger().error("����֮ǰ�¼����� " + obj.getAttribute("BLONopenBefore") + " ���г���!", arguments.callee, e);

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
	//���� (typeof(iAction) != "undefined" && iAction.constructor == window.Array ) ���⵱ֱ����window.showModal�򿪱��������������ʱ,�±��л����, 2011-04-15
	if(typeof iAction =="undefined" || (typeof(iAction) != "undefined" && iAction.constructor == window.Array ) || iAction==0 || iAction=="0"){
		if(obj.getAttribute("entertype")=="����")
			parent.piAction=1;

        if (obj.getAttribute("entertype") == "�޸�")
			parent.piAction=2;

        if (obj.getAttribute("entertype") == "չ��")
			parent.piAction=3;
	}else{
		parent.piAction=iAction;
	}
	//alert(parent.piAction)
	//alert(obj.entertype+":"+parent.piAction)
	
	//��Ϊ����,��Ӧ��������ڵ�λ��
	
	
	//������
	var i;
	var sbar = obj.getAttribute("toolbar");
	if(sbar != "����������" && IsSpace(fcpubdata.formToolbar) == false){
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
					    //����djframe.htm?����Ĳ�����������ҳ��
					    var spara=parent.location.search ;
					    if(IsSpace(spara)) spara="";
				        path = path+spara;
					}
//					parent.toolbar.location.replace(path);
					//					parent.mainframeset.rows=sHeight + ",*,0";

					parent.toolbarWinHeight = ToInt(sHeight);
                    var tmpWinHeight = getClientSize(parent).height - ToInt(sHeight);
                    //alert(sHeight+"  "+path)
                    window.parent.document.getElementById("topic").style.height = tmpWinHeight+"px"; //��Ҫ�ȸ�topic���ڵĸ߶�,����������й�������һ��ʱ��topic���ڵĸ߶Ⱥ�С,Ϊ23

                   // window.parent.document.getElementById("toolbar").parentNode.parentNode.style.display = "";
                    
					window.parent.document.getElementById("toolbar").src = path ;
					window.parent.document.getElementById("toolbar").style.height = sHeight; //+"px"
					//alert("onload:" + tmpWinHeight)
					    
				}
			}
		}
    }
    else if(fcpubdata.area.getAttribute("dj_sn") != "wf_tools") // ȥ���������������ı�ҳ�� 2013-05-14
    {
        window.parent.document.getElementById("toolbar").style.display = "none"; // my add 2013-04-27
       //window.parent.document.getElementById("topic").style.height = (window.parent.document.documentElement.clientHeight - 10) + "px";
        window.parent.document.getElementById("topic").style.height = getClientSize(parent).height  + "px";
    }
    
    
    //alert(window.parent.document.getElementById("toolbar").outerHTML);
	//new Eapi.Str().showWait("���ڴ򿪱�......");
    //ȡ���ϵ����пؼ�

    new Eapi.RunForm().getConts();
    
    
    fcpubdata.dsMain = GetDsMain(false);
    //��Ĭ�ϵı��������ֶ���
    if($id(fcpubdata.dsMain) != null){   
        fcpubdata.area.setAttribute("keyfield", $obj(fcpubdata.dsMain).getFirstKeyFieldName());
    }
    
	//��������ʱ���Զ���pubdjbh,
	if(IsSpace(fcpubdata.obj) == false ){
		if(isSpace(fcpubdata.area.getAttribute("keyfield"))==false){
		    try {
		        if(fcpubdata.obj.isFieldName(fcpubdata.area.getAttribute("keyfield")))
			        fcpubdata.keyValue = fcpubdata.obj.Field(fcpubdata.area.getAttribute("keyfield")).Value; // ���ܲ�����.
				
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

    //����label�ı�������*��ʶ    
    if (IsSpace(fcpubdata.area.getAttribute("labelInputTag")) == false) {
        try {
            eval(fcpubdata.area.getAttribute("labelInputTag"));
        } catch (e) { }
    }

    
	//��������ͼ�ΰ�ť
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
	
   //����combox��sql����--------------------------------------------------------------

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
               if (o[ii].getAttribute("async") == "��") {
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
//�µ����ؼ��Ĵ���

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
	//����divcheckbox�ؼ�ʱ���õĺ���;
	
	o = window.document.getElementsByTagName("div");
	l = o.length;
	for (i = 0; i < l; i++) {
	    //if (IsSpace(o[i])) continue;
	    var callback_list = null;
	    if (o[i].getAttribute("async") == "��") callback_list = function() { };
	    
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
//����ģʽ�򿪵���	
//   if(parent.piAction==1) {
//		fcpubdata.keyValue = "" ; //����ģʽʱ�˱���Ϊ��
//		openemptybill();
//	}
//�޸�ģʽ�򿪵���
//   if(parent.piAction==2 || parent.piAction==3 )
	
		openselbill(fcpubdata.keyValue);



		
		fcpubdata.backRunCount = 0; 
		//����E��ؼ�ʱ���õĺ���;
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
                new Eapi.EformEbiao().doReadOnlyPermit(o[i]); //�����ֶ�ֻ��Ȩ�ޣ�2012-09-11

                new Eapi.EformEbiao().doReadOnlyPermitWf(o[i]); //��������̵��ֶ�ֻ��Ȩ�ޣ�2013-05-20
            }
        }
        

        if (isRun) {
            //fcpubdata.isAfterEbiaoExec = "��";
            
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

	
	//parent.fcpubdata.loadFinish = "ok"; //����һ����װ����ɵ�֪ͨ.
	
//   d = new Date();
//   t1 = d.getTime() ;  
//  // alert(t1-t)

    function after_onload() {
        runWidget("loadAfter()");
        
        //onload ������
        try {
            parent.parent.document.getElementById("imgFcWait").style.display = "none";
        } catch (e) { }
    }

    function afterLoadingHttp() {
        fcpubdata.loadingStatus = "finish";
        fcpubdata.logger().debug("onload afterLoadingHttp!", arguments.callee);
       
       var o, l, i;

       //��ʼ��grid
       /*o = NavJs.getGridArr();
       for (var ii = 0; ii < o.length; ii++) {
           try {
               //modify by liuxt at 2010-10-27 10:18 ��webgrid.htc��Ϊwebgrid.js����Ҫ��ʼ��grid�������ʹ��
               var sAttachEnd = "";
               sAttachEnd += ' ' + o[ii].id + ' = new webgrid("' + o[ii].id + '"); ';
               eval(sAttachEnd);
               $obj(o[ii].id).Init();
           } catch (e) {
               fcpubdata.logger().error("grid init err " + o[ii].id, arguments.callee, e);
           }

       }*/

       //��ʼ���������ݼ��İ�
       o = NavJs.getDatasetArr();
       for (var ii = 0; ii < o.length; ii++) {
           
                   //modify by liuxt at 2010-10-27 10:18 ��dataset.htc��Ϊdataset.js����Ҫ����dataset�������ʹ��
                    
                    var oNew = o[ii];
                    if (IsTrue(fcpubdata.area.getAttribute("allBrowser"))) oNew = $obj(o[ii].id);
                    
                    oNew.InitLinkObj();
                    oNew.fset_cont1(); //������󶨿ؼ�����,�������Ϊ���ݼ��ڴ�ʱ�󶨿ؼ���û��.
                    try { } catch (e) {
                    fcpubdata.logger().error("dataset init err " + o[ii].id, arguments.callee, e);
               }

       }
       //��ʼ��grid
       /*o = NavJs.getDropdownlistArr();
       for (var ii = 0; ii < o.length; ii++) {
           try {
               //modify by liuxt at 2010-10-27 10:18 ��webgrid.htc��Ϊwebgrid.js����Ҫ��ʼ��grid�������ʹ��
               var sAttachEnd = "";
               sAttachEnd += ' ' + o[ii].id + ' = new dropdownlist("' + o[ii].id + '"); ';
               eval(sAttachEnd);
               $obj(o[ii].id).fnInit();
           } catch (e) {
               fcpubdata.logger().error("dropdownlist init err " + o[ii].id, arguments.callee, e);
           }

       }*/

       //����հ��� 2007-03-21 add
       try{
           GridAddEmptyRow();
       } catch (e) {
            fcpubdata.logger().error("loading err run GridAddEmptyRow()", arguments.callee, e);
       }
        
       if (typeof (EformCheckRoleInfo) == "function") {
        
           try{
               EformCheckRoleInfo(); //Ȩ��������֤
           } catch (e) {
                fcpubdata.logger().error("loading err run EformCheckRoleInfo()", arguments.callee, e);
           }
           
       }

       //�ϴ�����

       //�ϴ��ļ��ؼ��еĳ������ӻ�����window_onbeforeunload���Լ��ϵ���¼��رձ�־
       //Ȼ���ڴ�������ٴ򿪱�־
       //if (typeof upload1 != "undefined") {
       if($id("upload1") != null){
            try{
               upload_onload();
               //modify by liuxr at 2010-10-19 9:44 �޸Ļ�ȡ������table����ķ�ʽ��upload1.childNodes[0]��sarafi��ȡ������text����upload1.childNodes[1]��ȡ��table����
               //var tb=upload1.childNodes[0] ;
               var tb = $id("upload1").getElementsByTagName("table")[0];
               var ohref = tb.rows[tb.rows.length - 1].cells[0].children[0];
               ohref.onclick = function href_onclick() { if (fcpubdata.isEdit) { fcpubdata.isEdit = false; } };
               for (i = 0; i < tb.rows.length - 1; i++) {
                   //ɾ�����ڵ�3��
                   tb.rows[i].cells[2].children[0].onclick = function() { if (fcpubdata.isEdit) { fcpubdata.isEdit = false; } };
               }
           } catch (e) {
               fcpubdata.logger().error("loading err upload1", arguments.callee, e);
           }
       }
      
            eval(fcpubdata.area.getAttribute("BLONopen")); //����֮���¼�
            try { } catch (e) {
            fcpubdata.logger().error("����֮���¼� " + fcpubdata.area.getAttribute("BLONopen") + " ���г���!", arguments.callee, e);
       }

                
       //����������ʽ
       try{
           contTermStyle();
       } catch (e) 
       {
           fcpubdata.logger().error("loading err contTermStyle() ����������ʽ����!", arguments.callee, e);
            
       }

       if (fcpubdata.skins != "base") {
            
                //if (fcpubdata.isAfterEbiaoExec != "��")
                   new Eform.Skins().init();
                   try { } catch (e) {
                   fcpubdata.logger().error("loading err ����Ƥ����ʽ����!", arguments.callee, e);

               }
       }
       //��������checkbox���¼�,Ӧ���ڱ����¼�֮����,��ֹ�����¼������¸���innerHTML

       var ds1;
       o = window.document.getElementsByTagName("div"); //�µ�checkbox
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
               try { //���һ���ո�Ԫ�ػ����
                   //o[i].childNodes(jj).attachEvent("onclick", radio_checkbox_click);
                   NavJs.addEvent(o[i].childNodes[jj], "onclick", radio_checkbox_click);
               } catch (e) { }
           }
           // }
       }
       
       pub_window_onresize_bak(); //�ñ��ؼ����
       //���ý���,�����е�txtΪ��ʱ10
       window.setTimeout("FirstFocus();", 30);
       parent.fcpubdata.loading = "finish";
       fcpubdata.logger().debug("onload finish!", arguments.callee);
       after_onload();

    }
	
	/**
	*����DJ.HTC����,������״̬�򿪱�
	**/
	function openemptybill(){

	    //���ӱ����ݼ�
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
	*��ѡ��ĵ���
	*@param djbh ��ǰ�򿪵ĵ��ݱ��,����ģ��ID�Զ�ȡ��ǰ��
	*@param gzid ����ID
	*@param noeditdjbh ��Ҫ�޸ĵ��ݱ�� ������ȡ���ֵ���.
	**/
	function openselbill(djbh,gzid,noeditdjbh){
        
		var sErr = "",ii,s1;

		//�����ݼ�
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
					//ȥ��β���Ļس���
					if (s1.charCodeAt(s1.length-1)==10 && s1.charCodeAt(s1.length-2)==13 ){
						s1=s1.substring(0,s1.length-2);
						o[ii].setAttribute("opensql",s1);
					}
        		}
                //�����ݼ����� isOnloadOpen ���أ��������б��ѯʱ���ս���ʱ�б�Ϊ�ա�2012-10-11
        		var isOnloadRun = o[ii].getAttribute("isOnloadRun");
        		if (!IsSpace(isOnloadRun) && !IsTrue(isOnloadRun)) {
        		    $obj(o[ii].id).OpenEmpty();
        		} else {
        		    if (IsSpace(s1) == false) {
        		        if (o[ii].getAttribute("async") == "��") {
        		            sErr = $obj(o[ii].id).Open(s1, "��", function(result) {
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
			}else { //�����
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

		//������ȫ�ֱ���
		if(noeditdjbh != "��Ҫ�޸ĵ��ݱ��"){
		    if(IsSpace(djbh) ==false) //o[ii].FirstPage(); //�Ƶ���һҳ�Ը�pubdjbhֵ 2008-02-22 add
   				fcpubdata.keyValue=djbh;   //DsMain.Field(fcpubdata.area.keyfield).Value
		}

		function cmpdataset(a,b) {
		    return parseInt(a.getAttribute("opensortno")) - parseInt(b.getAttribute("opensortno"));
		}
		function dsAppendEmptyRec(objDs) {
		    //��һ�ռ�¼
		    var isAddEmptyRec = false;
		    if (objDs.getAttribute("isaddemptyrec") == "��") {
		        isAddEmptyRec = true;
		    } else if (objDs.getAttribute("submittype") == 2) {
		        //alert(objDs.RecordCount + "::" + parent.piAction);
		        if ($obj(objDs.id).RecordCount == 0) {
		            //�����ݼ��򿪺�,��û�м�¼,�������ύ��ʽΪ�ύ��ǰ��һ����¼ʱ,���Զ�ds.Append
		            isAddEmptyRec = true;
		        } else if (parent.piAction == 1) {
		            isAddEmptyRec = true;
		        }
		    } else if (objDs.getAttribute("submittype") == 1) { //���ߵ����Ǳ�����ݼ�ʱ,�ύ��ʽѡ����Ĭ��
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
    *ȡ�ý����ϵĵ�һ��û�а󶨵��������ݼ�
    *@param bUseSelect =true ��ʾ��selectall.htm���ô˺���,no use
    *@return ���ݼ�����ID
    *@date 2005-02-24
    **/
	function GetDsMain(bUseSelect) {
	    //fcpubdata.logger().debug("test1", arguments.callee);
        var sRet = fcpubdata.dsMain ; //���û���ҵ������ݼ��Ļ����ô����õ������ݼ���.
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
		        //ͨ�����ӹ�ϵ�������������ݼ�
	            var oDs = $id(NavJs.textContent(oNodeDs.childNodes[i]));
	            if (IsSpace(oDs.getAttribute("masterds")) == false) {
	                return oDs.getAttribute("masterds");
	            }
	        }
        }    	
        var oNode = oContXml.documentElement.selectSingleNode("grid") ;
        if(oNodeDs != null ){
	        for(var i=0;i<oNodeDs.childNodes.length;i++){
		        //�ж����ݼ��Ƿ���ڱ����
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
			        if(oods.getAttribute("pubpara") != "��"){
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
///Ӧ��������ʽ
    _inner("button");
    _inner("input");
    _inner("label");

    function _inner(tagName) {
        var oXml, slen, str1, str2;
        //button������ʽ
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
*�رյ�ǰ����
*@date 2003-11-27
**/
function CloseBill(){
		
//	alert("can")
    fcpubdata.isEdit = false;

    if (!IsSpace(top.Dialog) && top.Dialog.arrObj != null) {
        top.Dialog.Close();
        return;
    }
	
	//if(parent.arr[7]!="��ģʽ����" && parent.arr[7]!="��ģʽ����"  ){
		//��������,��ֱ�ӵ���ҳ��Ļ����޷�ȷ���ĸ�ҳ��Ϊ��ҳ��
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
*���ð�ťΪͼ�ΰ�ť
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
* ת��SQL���
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
*��ǰ��ĵ�һ��
*@date 2004-05-02
**/
function YearFirstDay(){
	var dDate=new Date();
	var s1=""+dDate.getYear();
	s1+="-01-01";
	return s1;
}
/**
*��ǰ������һ��
*@date 2004-05-02
**/
function YearLastDay(){
	var dDate=new Date();
	var s1=""+dDate.getYear();
	s1+="-12-31";
	return s1;
}
/**
*��ʾFlashҳ��
*@para htmlfile falsh����ҳ���HTM�ļ���
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
*�ҵ���ǰ�����ϵ�һ���󶨵������ݼ��ı��ؼ�,�����������ݼ��ؼ�
*@return ���󶨵����ݼ�����.�����򷵻�null
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
* �ж� dsId �Ƿ�Ϊ������ݼ�
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
* �������ϵ�������ť��.
*@date 2006-02-08 
**/
//function ToolBarFuncAdd() { $eform("����");}
function CheckDate(sdate){
	return Valid.checkValue("Date",sdate);
}
/**
* ִ����������Դ��SQL��䣬�������ݼ�����Ҫ��XML��
*@param oDs Ϊ���ݼ�������dataset1
*@param sConn Ϊ���ݿ����Ӵ��� �� "Provider=SQLOLEDB;Data Source=my;Initial Catalog=mytest;User ID=sa;pwd=;"
*@param sSql Ҫ���е�sql��䣬
*@param PageNo ��ʼҳ��
*@param PageSize ҳ�ߴ磬-1��ʾȡ���м�¼
*@date 2006-09-06
**/
/*function DbSql(oDs,sConn,sSql,PageNo,PageSize,callback,context) {
//ִ�бȽϺ���ִ�д������в�ѯ��¼,��ע����û�м����ֶδ�

//sField=��;�ָ����ֶ���
	var sFieldNameList = "";
	if(IsSpace(oDs.getAttribute("format")) == false){
	    var oSour = SetDom(oDs.getAttribute("format"));
	    for(var i=0;i<oSour.documentElement.childNodes.length;i++){
	    	    sFieldNameList+=NavJs.getNodeValue11( oSour,i,0)+";";
	    }
	    sFieldNameList=sFieldNameList.substring(0,sFieldNameList.length-1); //ȥ��β��;
	}
	//����Ƿ�XML�ַ�
	var sXml="<No>"+RepXml(sSql)+"</No>"+"<No1>"+PageNo+"</No1>"+"<No2>"+PageSize+"</No2>"+"<No3>"+sFieldNameList+"</No3>";
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=DbSql&connectstring="+escape(sConn),sXml,callback,context);
	retX = RepStr(retX, "<fields></fields>", oDs.getAttribute("format"));
	oDs.OpenXmlData(retX);
	return retX;
}*/
/**
* ִ����������Դ��SQL��䣬����combobox����Ҫ��XML��
*@param oCombobox Ϊcombobox����
*@param sConn Ϊ���ݿ����Ӵ��� �� "Provider=SQLOLEDB;Data Source=my;Initial Catalog=mytest;User ID=sa;pwd=;"
*@param sSql Ҫ���е�sql��䣬
*@date 2006-09-06
**/
/*function DbSqlCombo(oCombobox,sConn,sSql,callback,context) {

	//����Ƿ�XML�ַ�
	var sXml="<No>"+RepXml(sSql)+"</No>";
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=DbSqlCombo&connectstring="+escape(sConn),sXml,callback,context);
    if(IsSpace(retX)==false){
        oCombobox.outerHTML=SelectAddOption(oCombobox,retX);
    }

}*/
/**
* ���һ�����ݼ���ĳ�е�ֵ�Ƿ��ظ�
*@param ods ���ݼ�����
*@param fieldName �ֶ���
*@return true��ʾ�ظ���,
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
		alert( NavJs.textContent(ods.oDom.documentElement.childNodes[l].childNodes[1].childNodes[col].childNodes[2])+" ��ֵ�ظ�!");
	}
	return bRepeat;
}
/**
* �̶�������grid�ؼ�ʱ,��Ҫ���ô�������հ���,�˺���Ϊ������api��.
*@param sDs ���ݼ���id,
*@date 2007-07-12
**/
function GridAddEmptyRow(sDs){
//����հ��� 2007-03-21 add
	var o= NavJs.getGridArr();
	for(var ii=0;ii<o.length;ii++){
        if (IsSpace(o[ii].getAttribute("dataset")) ) continue;
        if (typeof sDs != "undefined" && sDs != o[ii].getAttribute("dataset")) continue;
        var ods = $id(o[ii].getAttribute("dataset"));
		if(ods == null) continue;
		var rowCount = o[ii].getAttribute("bodyrows"); //�̶�����
		if(typeof rowCount == "undefined") rowCount =-1;
		var rowHeight = o[ii].getAttribute("bodyrowheight"); //�и�
		if(typeof rowHeight == "undefined" || rowHeight == -1) rowHeight =21;
		var offsetV = rowCount - $obj(ods.id).RecordCount;
		if(offsetV<=0) continue;
        for(var jj = 0;jj<offsetV;jj++){
            $obj(ods.id).Append("ǿ�м�һ��"); //
            var oTr = $obj(o[ii].id).InsertRow();
			oTr.style.height = rowHeight + "px";
			//ods.Update("�����");
        }
        $obj(ods.id).dset_cont();
        $obj(o[ii].id).initGrid(); //�����������

        $obj(o[ii].id).EndRowState = "edit";
        $obj(ods.id).SetPos(0); //�Ӵ���ͬ����ǰ��Ԫ���fset 2010-09-03 add  
	}	
}
	/**
	*��onload�¼�ʱ��������������
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
	    ///<summary>�˳��򸽼ӵ�radio checkbox���ڲ��ؼ���,���ڽ��ӿؼ���ֵ�����ؼ���</summary>
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
        //���ݼ�
        var sDs = objInput.parentNode.getAttribute("dataset") ;
        if(IsSpace(sDs) == false){
            $obj(sDs).cont1_onblur();
        }
        
	}
function $urlParam(paramName){
///ȡǰ̨URL�еĲ��� 2008-03-31 add
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
*�������ϵİ�ť�ĳ��õ���¼�
*@date 2006-01-25
**/
function $eform(sKey) {
    
    var result=new Object();
    if(typeof(fcpubdata.eventBefore[sKey]) == "function"){
        fcpubdata.eventBefore[sKey](result);
        if(typeof(result) != "undefined" && typeof(result.returnValue) != "undefined"){
            if (result.returnValue == false) {
                return; //ȡ��Ĭ�ϵĶ���.
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
    var oDsGridJs = Getdssub1(); //ΪJS����
   // var oDsGrid ;
   // if (oDsGridJs != null) oDsGrid = $id(oDsGridJs.id); //תΪJS����
    
	switch (sKey){
	    case "��һҳ": oDsMainJs.FirstPage(); break;
	    case "��һҳ": oDsMainJs.PrevPage(); break;
	    case "��һҳ": oDsMainJs.NextPage(); break;
	    case "���ҳ": oDsMainJs.LastPage(); break;

	    case "����": if (oEbiao != null) new Eapi.EformEbiao().run(oEbiao); oDsMainJs.Append(); oDsMainJs.fset_cont1(); fcpubdata.keyValue = ''; break; //�������ֶε�Ĭ��ֵ��Ϊ��ʱ,�ͱ���ǿ��pubdjbh=''
	    case "ɾ��": DelGridRow(oDsMain, function() { oDsMainJs.PrevPage(); }); break; //ɾ�����¼�Ϸ�һҳ

	    case "��������": oDsMainJs.AppendCopy(); oDsMainJs.fset_cont1(); fcpubdata.keyValue = ''; break; //�������ֶε�Ĭ��ֵ��Ϊ��ʱ,�ͱ���ǿ��pubdjbh=''
/*
		case "��������" :  fcpubdata.keyValue='';var sR=DjSave(); if(IsSpace(sR)){alert('��������ɹ�!');oDsMain.Append();}else{alert(sR);} break; //�������ֶε�Ĭ��ֵ��Ϊ��ʱ,�ͱ���ǿ��pubdjbh=''
		case "�޸ı���" :  fcpubdata.keyValue=new Eapi.RunForm().getKeyFieldValue();DjSaveShow(); break; 
		case "������ú���ʾ" : DjSaveShow(); break;
		case "������" : DjSave(); break;
		case "������ú��˳�" : DjSave('�˳�'); break;
        case "������ú�����" : var sR=DjSave(); if(IsSpace(sR)){alert('����ɹ�!');oDsMain.Append();}else{alert(sR);} break;
*/

		case "�鿴��ͼ": viewWinUrl(oDsGridJs, 1); break;
		case "������ͼ": viewWinUrl(oDsGridJs, 2); break;
		case "�༭��ͼ": viewWinUrl(oDsGridJs, 3); break;

		case "����": if (IsSpace(webGrid) == false) GridChangeRowSort(true, webGrid); break;
		case "����": if (IsSpace(webGrid) == false) GridChangeRowSort(false, webGrid); break;
		case "����һҳ": oDsGridJs.FirstPage(); break;
		case "�����һҳ": oDsGridJs.PrevPage(); break;
		case "�����һҳ": oDsGridJs.NextPage(); break;
		case "������ҳ": oDsGridJs.LastPage(); break;
		case "������": oDsGridJs.Append(); break;
		case "ɾ����": oDsGridJs.Delete(); break;
		case "ɾ������ɾ����¼": DelGridRow(oDsGridJs); break;
		case "��Ƿ�ʽɾ��": MarkDelRow(oDsGridJs); break;
		case "ɾ������ѡ��" : MultiDelGridRow(oDsGridJs); break;
//		case "��񱣴�" : GridSave(oDsGrid); break;
//		case "��񱣴�ú��˳�" : GridSave(oDsGrid,'�˳�'); break;
		case "���ѡ�ж���" : GridMultiSel(); break;

        case "�ύ����" : return doSubmitData(); break;
        case "�ύ���ݳɹ�����ʾ" : var sErr = doSubmitData(function(){alert("�ύ���ݳɹ�!");}); if(IsSpace(sErr)==false) alert(sErr); break;
        case "�ύ���ݳɹ����˳�" : var sErr = doSubmitData(function(){CloseBill();}); if(IsSpace(sErr)==false) alert(sErr); break;
        case "�ύ���ݳɹ�������" : var sErr = doSubmitData(function(){alert("�ύ���ݳɹ�!");if(oEbiao != null)  new Eapi.EformEbiao().run(oEbiao); oDsMain.Append();}); if(IsSpace(sErr)==false) alert(sErr); break;

        case "�ύ���ݳɹ���ˢ����һ����" : var sErr = doSubmitData(function(){alert("�ύ���ݳɹ�!");refreshUpGrid();}); if(IsSpace(sErr)==false) alert(sErr); break;
        case "�򿪴���������¼":
            if (fcpubdata.cardWinUrl == "") {
                alert("Ӧ�ȸ�fcpubdata.cardWinUrlȫ�ֱ�����ֵΪҪ�򿪵Ĵ��ڵ�URL�����djsn");
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
                    NavJs.openModalDialog(sUrl + "&opentype=1", oDs, oWinWidthHeight); //url�ϼ���opentype=1��ʾ������
                } else {

                    DjOpen(fcpubdata.cardWinUrl, oDs, "����");
                }
            }
            break;
        case "�򿪴����޸ļ�¼":
            if (fcpubdata.cardWinUrl == "") {
                alert("Ӧ�ȸ�fcpubdata.cardWinUrlȫ�ֱ�����ֵΪҪ�򿪵Ĵ��ڵ�URL�����djsn");
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
                    DjOpen(fcpubdata.cardWinUrl, oDs, "�޸�");
                }
            }
            break;

		case "e��ؼ���ӡԤ��": doSubmitData(); printSubAction(1); break;
		case "e��ؼ���ӡ": doSubmitData(); printSubAction(2); break;
		case "e��ؼ�ֱ�Ӵ�ӡ": doSubmitData(); printSubAction(3); break;
		case "e��ؼ�ֱ�Ӵ�ӡ����ҳ": doSubmitData(); printSubAction(4); break;
		case "e��ؼ���ӡ����ҳ": doSubmitData(); printSubAction(5); break;
		case "��ҳ������excel�ļ���": doSubmitData(); printSubAction("expexcel"); break;
		case "����ҳ������excel�ļ���": doSubmitData(); printSubAction("expexcelall"); break;
		case "��������ҳ��pdf�ļ���": doSubmitData(); printSubAction("exppdf"); break;
		case "e��ؼ�������": new Eapi.EformEbiao().appendRow(oEbiao, 0, false); break;
		case "e��ؼ�ɾ����": new Eapi.EformEbiao().deleteRow(oEbiao, 0); break;

		case "ѡ������": SelectDate(); break;
		case "ѡ������ʱ��": SelectDate("", true); break;
		case "ѡ����������": SelectDate(undefined, "year-m"); break;
		case "ѡ��������": SelectDate(undefined, "year"); break;
		case "������" : ShowCalc(); break;
		case "�رմ���" : CloseBill(); break;
		case "��������ѯ": toolbarQuery(); break;
		case "ˢ��������ʽ": contTermStyle(); break;
		case "ˢ��Ȩ�޿���" : if(typeof(EformCheckRoleInfo) == "function") EformCheckRoleInfo(); break;
		
		case "ֻ����ҵ������": wftools_tempSave(); break;
		case "�ύҵ�����ݲ�ִ������": wftools_save(); break;
		case "�ύҵ������̺�ת��һ��": wftools_save(1); break;
		case "�ύҵ������̺�رմ���": wftools_save(2); break;
		case "�ύҵ������̺���": wftools_save(3); break;
		case "ִֻ�����̵Ķ���": wftools_flowSave(); break;
		case "ִֻ�����̵Ķ�����ת��һ��": wftools_flowSave(1); break;
		case "ִֻ�����̵Ķ�����رմ���": wftools_flowSave(2); break;
		case "ִֻ�����̵Ķ������޲���": wftools_flowSave(3); break;
		case "���̵Ĺ켣ͼ": wftools_trace(); break;
		case "��������ʵ��": wftools_suspended(); break;
		case "��ֹ����ʵ��": wftools_killed(); break;
		
	}
    if(typeof(fcpubdata.eventAfter[sKey]) == "function"){
        fcpubdata.eventAfter[sKey](result);
    }

    function toolbarQuery() {
        
        if (IsSpace(parent.toolbar.document.getElementById("pagesize"))) return;

        var ipagesize = parent.toolbar.document.getElementById("pagesize").value;
        ipagesize = parseInt(ipagesize, 10);
        if (isNaN(ipagesize)) {
            alert("ҳ�ߴ����������!");
            return;
        }
        var ipagegoto = parent.toolbar.document.getElementById("pagegoto").value;
        ipagegoto = parseInt(ipagegoto, 10);
        if (isNaN(ipagegoto)) {
            alert("��תҳ������������!");
            return;
        }
        if (ipagegoto < 1) ipagegoto = 1;

        var odssub1 = Getdssub1();
        if (odssub1 == null) return;
        var oSKBILLgrid1 = GetDsGrid(odssub1);
                
        //odssub1 = eval(odssub1.id); //תΪJS����
        
        odssub1.PageSize = ipagesize;
        odssub1.PageNo = ipagegoto ;
        odssub1.Open(odssub1.opensql,'��');
        try {
            //oSKBILLgrid1 = eval(oSKBILLgrid1.id);
            oSKBILLgrid1.SetFocus(oSKBILLgrid1.FindFirstTD(oSKBILLgrid1.FixRows),'���������');
        }catch(e){}
        var iPageCount = odssub1.PageCount; 
        if(iPageCount < 1) iPageCount=1;
        var iPageNo = odssub1.PageNo; 
        if(iPageNo < 1) iPageNo=1;
        parent.toolbar.document.getElementById("pageno").value = iPageNo + '/' + iPageCount;
        if(ipagegoto> iPageCount) alert('ת��ҳ����Ҫ������ҳ��,�����ɲ鲻����¼!');
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
                alert("��������ȫ�ֱ���:fcpubdata.ebiaoRunUrl��ֵ�����ڱ��м���ebiao�ؼ���eblayout�ؼ������ʹ�ô˹���!");
                return;
            } else if (IsSpace(oFirstEbiao.getAttribute("printFile"))) {
                alert("δ��ebiao�ؼ������Դ��������ô�ӡ�ļ�,�����޷�ʹ�ô˹���!");
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
/* ���б���������¼�
* HandleAfterInitReport �������ǹ̶�����,�������б��������ͻ���ô˺���.
*	Ҫ�������б��������ĺ���,���������·�ʽ:
*	����,Print(4) Ϊ���б����������ڵ�ȫ�ֵ�js����.
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
* ���ݸ�ʽ�������һ���Զ����ֵ
**/
function getAutoNum(sFormat)
{
	//var sFormat = "<format>"+txtFormat.value+"</format><param><name>ƾ֤���</name><value>��</value></param>";
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=getAutoNum","<format>"+sFormat+"</format>");

}
/**
* ȡURL�ϵ����в�����,����ebiao�ؼ���,
* no use 2012-08-20
**/
function getAllUrlParam() { 
    var sParam=""
    for (var jj = 1; jj <= parent.Request.QueryString.Count(); jj++) {
        var sName = parent.Request.QueryString.Key(jj);
        if (sName != "djsn" && sName != "djtype")
            sParam += "&" + sName + "=" + parent.Request.QueryString.Item(jj); //.toString()
    }
    //Լ�����������Ϊ fcKeyValue,��DjOpen�򿪲������ݼ�����ʱ.��DjOpen����ʱ(�� parent.piAction == 1) ���ܼ���������һ�д���.
    if (IsSpace(fcpubdata.keyValue) == false && parent.piAction != 1) sParam = "&fcKeyValue=" + escape(fcpubdata.keyValue);
    return sParam;
}
/**
*��������ͼ���޸���ͼ���鿴��ͼ�ķ���
*2011-04-27
**/
function viewWinUrl(oDs, code) {
    var djsn = "";
    var colNoKeyField = "";
    var arr = MultiKeyTmp(oDs); //�����ֶ�����
    var billkeyfield = fcpubdata.area.getAttribute("keyfield");
    var colNoKeyField = 0; //�����ֶ��������к�,�����ݼ�XML�е�
    if (IsSpace(billkeyfield)) {
        if (arr.length > 0) {
            colNoKeyField = arr[0];
        } else {
            alert("û�����������ֶ�,����ϵ������޷�����!");
            return;
        }
    } else {
        colNoKeyField = oDs.FieldNameToNo(billkeyfield);
    }
    keyField = NavJs.textContent( oDs.oDataField.childNodes[colNoKeyField].childNodes[0]); //�����ֶ�
    var keyFieldValue = NavJs.getNodeValue11(oDs.oDom, oDs.RecNo, colNoKeyField);  //�����ֶ�ֵ
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
* ����ʱ�����Ʋ���alert,ֻ��¼������Ϣ
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
    ///���в���ģ������ɳ���
    
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
            if (IsSpace(tableName) == true) { //fhj2012-07-26 �����в�������ȷ
                return alertMsgInfo("�����в�������ȷ");
                
            }

            new Eapi.Layout().loadOneLayoutTable(tableName, oEbiao, oContXml);
            if (!IsSpace(tableName)) htmFileName += "," + id + "_table=" + tableName;
        } else {

            new Eapi.Layout().loadOneLayout(layoutName, oEbiao, oContXml);
            htmFileName += "," + id + "=" + layoutName;
        }
    }
    
    if (fcpubdata.genEventObj.isGen != "htm") return;
    //���������HTM�ļ���
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

    sbAll.append(tmpS1.substring(0, tmpS1.length - 6)); //ȥ��</div>
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
    /// sCommand == loadBefore ,�����Զ���ؼ��е���Ӧ�¼���2013-03-19

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