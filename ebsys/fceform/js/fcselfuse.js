///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />
///<reference path="/ebsys/fceform/js/fcrundj.js" />
///<reference path="/ebsys/fceform/js/fcbasecont.js" />

Eform.SysForm = function(){}
Eform.SysForm.prototype =
{
    getBillType: GetBillType,
    billTypeNameToPath: BillTypeNameToPath,
    selColor: SelColor,
    selFgColor: SelFgColor,
    selFunction: SelFunction,
    setButtonImage: function() {
        var cmdOk = $id("cmdOk");
        if (cmdOk != null) {

            cmdOk.style.width = "66px";
            cmdOk.style.height = "21px";
            //cmdOk.className = "cmdOk";
            NavJs.setClassName(cmdOk, 'cmdOk');
            NavJs.addEvent(cmdOk, "onmouseout", function() { NavJs.setClassName(this,'cmdOk'); });
            NavJs.addEvent(cmdOk, "onmouseover", function() { NavJs.setClassName(this, 'cmdOk-over'); });
            //cmdOk.attachEvent("onmouseout", function() { this.className = 'cmdOk'; });
            //cmdOk.attachEvent("onmouseover", function() { this.className = 'cmdOk-over'; });
        }
        var cmdClose = $id("cmdClose");
        if (cmdClose != null) {
            cmdClose.style.width = "66px";
            cmdClose.style.height = "21px";
            NavJs.setClassName(cmdClose, 'cmdClose');
            NavJs.addEvent(cmdClose, "onmouseout", function() { NavJs.setClassName(this, 'cmdClose'); });
            NavJs.addEvent(cmdClose, "onmouseover", function() { NavJs.setClassName(this, 'cmdClose-over'); });
            
//            but.className = "cmdClose";
//            but.attachEvent("onmouseout", function() { cmdClose.className = 'cmdClose'; });
//            but.attachEvent("onmouseover", function() { cmdClose.className = 'cmdClose-over'; });
        }
        var cmdNotBg = $id("cmdNotBg");
        if (cmdNotBg != null) {
            //SetButtonImage(cmdNotBg, "../images/ef_run_button_notbg.gif");
            //cmdNotBg.className = 'ef_run_button_notbg';
            NavJs.setClassName(cmdNotBg, 'ef_run_button_notbg');
            cmdNotBg.title = "删除背景色";
        }


        //        var oRunForm = new Eapi.RunForm();
        //        oRunForm.setButtonImage($id("cmdOk"),"../../fceform/images/ef_run_button_ok.gif");
        //        oRunForm.setButtonImage($id("cmdClose"), "../../fceform/images/ef_run_button_close.gif");
        //	    
        //加上下拉按钮的图片
        var i = 1;
        //    	var bmpPath = fcpubdata.path+fcpubdata.skinsPath+"/css/skins/"+fcpubdata.skins+"/images/ef_run_downarrow.gif";

        while ($id("cmdDropDown" + i) != null) {
            action_button_down($id("cmdDropDown" + i));
            //            var obj = $id("cmdDropDown" + i);
            //            obj.style.width = "16px";
            //            obj.style.height = "18px";
            //            oRunForm.setButtonImage(obj,bmpPath);

            i++;
        }
        //日期按钮图片
        var j = 1;
        while ($id("cmdDate" + j) != null) {
            action_button_down($id("cmdDate" + j))
            j++;
        }
    },
    setValue: function(oCont, value) {
        if (IsSpace(value) == false) {
            if (oCont.controltype == "radio") {
                new Eapi.BaseCont().setRadioValue(oCont, value);
            } else if (oCont.controltype == "checkbox") {
                new Eapi.BaseCont().setCheckBoxValue(oCont, value);
            } else {
                oCont.value = value;
            }
        }
    },
    jsonToCont: function(oJson, arrContId) {
        ///假定控件的ID和oJson的属性名相同
        ///一般用于表单打开事件中
        for (var i = 0; i < arrContId.length; i++) {
            this.setValue($id(arrContId[i]), oJson[arrContId[i]]);
        }
    },
    contToJson: function(oJson, arrContId) {
        ///假定控件的ID和oJson的属性名相同
        ///一般用于表单确定按钮的点击事件中
        for (var i = 0; i < arrContId.length; i++) {
            oJson[arrContId[i]] = $id(arrContId[i]).value;
        }
    }
}
if(Type.parse("Eform.SysForm") == null) Eform.SysForm.registerClass("Eform.SysForm");

Eform.Prop = function(){}
Eform.Prop.prototype =
{
    displayAction : PropWinDisplayAction ,
    fontAction : PropWinFontAction ,
    changePosition : PropWinChangePosition ,
    termStyle : PropWinClickTermStyle ,
    selField : PropWinSelField ,
    changeDs : PropWinChangeDs ,
    onload : PropWinOnload ,
    clickOk : PropWinClickOk 
}
if(Type.parse("Eform.Prop") == null) Eform.Prop.registerClass("Eform.Prop");


/**
* 取得 fceform/billtype.xml文件的内容
*@return 返回一个option节点组成的字符串
*/
function GetBillType() {
	//return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?GetBillType","")
	var oXml = SetDomFile(fcpubdata.path+fcpubdata.userDir+"/xml/billtype.xml");
	var sRet = new Sys.StringBuilder() ;
	if(oXml.documentElement != null) {
		var l = oXml.documentElement.childNodes.length-1;
		for(var i=0;i<l ; i++) {
			var stext = oXml.documentElement.childNodes(i).childNodes(1).text;
			var svalue = oXml.documentElement.childNodes(i).childNodes(2).text;
			var spath = oXml.documentElement.childNodes(i).childNodes(3).text;
			var sextname = oXml.documentElement.childNodes(i).childNodes(4).text;
			sRet.append( "<option value=\""+svalue+"\" extname=\""+sextname+"\" path=\""+spath+"\">"+stext+"</option>" );

		}
	}	
	return sRet.toString();
}

/**
用于在控件的属性窗口中绑定数据集和字段
*@param arr 为传入的pubDataSet[1]，即数据集的信息
*@return 返回一个数组，依次存数据集ID，字段名，字段中文名
*@date 2004-07-27
**/
function contselfield(arr) {
//   var arr=fcpubdata.obj[1]
   if(arr.length == 0 ){
		alert("请增加了数据集后再试!") ;
		return ;
   }
   var sRet = DjOpen('../../fceform/common/djframe.htm?djsn=fieldsel&djtype=ST', arr, '展现', '有模式窗口', '直接', '选择字段');
   if(typeof sRet!="undefined"){
       var arr1=sRet.split(",");
       return arr1;
   }
}
/**
弹出颜色对话框选择颜色。
*背景颜色
*@sTag ="borderColor" 就表示线的颜色
*@date 2004-07-28
**/
function SelColor(obj,sTag){
	var oFont=$id('displayfont');
	if(typeof obj != "undefined" ) oFont=$id(obj.id);
	//if(typeof oDlg != "undefined") 
	//	var odlgHelper = oDlg ;
	//else
	//	var odlgHelper = $id("dlgHelper");
      var sInitColor = oFont.style.backgroundColor;
      if(sTag == 1) sInitColor = oFont.style.borderColor;
      var sColor;
      if (isSpace(sInitColor ))
        //display color dialog box
         sColor = dlgHelper.ChooseColorDlg();
        else
         sColor = dlgHelper.ChooseColorDlg(sInitColor);
    //  alert(sColor);  
		sColor = sColor.toString(16);
        //add extra zeroes if hex number is less than 6 digits
      if (sColor.length < 6) {
	      var sTempString = "000000".substring(0,6-sColor.length);
	     // alert(sTempString)
	      sColor = sTempString.concat(sColor);
	      
      }
      if(typeof(sTag) == "undefined"){
        oFont.style.backgroundColor=sColor;
        oFont.changebg = "是" ; //传递一个标志告诉背景色改动了。
      }else{ //处理边线颜色
        if(sTag == 1) sTag = "borderColor" ; //报表设计器中用 
        var sCommand = obj.id+".style."+sTag+"=\""+sColor+"\"";
        eval(sCommand);
      }
}
/**
弹出颜色对话框选择颜色。
*前景色
*@date 2004-11-20
**/

function SelFgColor(obj) {
	var oFont=$id('displayfont');
	if(typeof obj != "undefined" ) oFont=$id(obj.id);

	var sInitColor = oFont.style.color;
	var sColor;
	      if (isSpace(sInitColor ))
        //display color dialog box
         sColor = dlgHelper.ChooseColorDlg();
        else
         sColor = dlgHelper.ChooseColorDlg(sInitColor);
        
		sColor = sColor.toString(16);
        //add extra zeroes if hex number is less than 6 digits
      if (sColor.length < 6) {
	      var sTempString = "000000".substring(0,6-sColor.length);
	     // alert(sTempString)
	      sColor = sTempString.concat(sColor);
	      
      }
      
      oFont.style.color=sColor;
}

/**
表单设计时选择事件中的函数
*@date 2004-07-29
**/
function SelFunction(obj){
	var arr = new Array() ;
	arr[0] = fcpubdata.obj[5] ; //传来的自定义函数内容
	try{
		arr[1] = arrRegFuncList ; //来自usertb.js文件中.
	}catch(e){}
	var sRet = DjOpen('../../fceform/common/djframe.htm?djsn=funclist&djtype=ST', arr, '展现', '有模式窗口', '直接', '选择函数');
	if(isSpace(sRet) == false){
	    if(sRet.startsWith("$valid(")){
	        obj.value += sRet ;
	    }else{
		    obj.value = sRet ;
		}
	}
//	DjOpen('selfunc',obj,'展现','有模式窗口','直接','选择函数');
}
/**
*交换表格中的两行
先将数据集的XML串中进行换位，然后直接对表格上的两行进行交换swapNode，再将ds.recno-1
*@param up==true 表示向上换，否则向下换
*@date 2004-08-06
**/
function GridChangeRow(up,ogrid1){
	var ogrid;
	if(typeof ogrid1 == "undefined"){
		ogrid=SKBILLgrid1;
	}else{
		ogrid=ogrid1;
	}
	var ods=$obj(ogrid.dataset);
	if ((up && ods.RecNo==0) || (up==false && ods.RecNo>=ods.RecordCount-1)) return;
	
	var oP=ods.oDom.documentElement;
	var oNode,oNode1;
	if(up){
		
		if(ogrid.TopRow>0 && ogrid.Row==ogrid.TopRow+1){
			ogrid.VscrollTo(ogrid.TopRow-1);
		}
		oNode=oP.childNodes[ods.RecNo].cloneNode(true);
		//alert(ods.RecNo)
		oNode1=oP.childNodes[ods.RecNo-1].cloneNode(true);
		oP.replaceChild(oNode1,oP.childNodes[ods.RecNo]);
		oP.replaceChild(oNode,oP.childNodes[ods.RecNo-1]);
	}else{
		if(ogrid.Vmax>0 && ogrid.TopRow<ogrid.Vmax && ogrid.Row>ogrid.TopRow+1){
			ogrid.VscrollTo(ogrid.TopRow+1);
		}


		oNode=oP.childNodes[ods.RecNo].cloneNode(true);
		oNode1=oP.childNodes[ods.RecNo+1].cloneNode(true);
		oP.replaceChild(oNode1,oP.childNodes[ods.RecNo]);
		oP.replaceChild(oNode,oP.childNodes[ods.RecNo+1]);
	}
	//alert(ods.RecordCount)
	//换表格上的行
	if(up){
		ogrid.tab.rows[ods.RecNo+1].swapNode(ogrid.tab.rows[ods.RecNo])	;
		ods.RecNo--;
	}else{
		ogrid.tab.rows[ods.RecNo+1].swapNode(ogrid.tab.rows[ods.RecNo+2]);	
		ods.RecNo++;
	}
	ods.SetPos(ods.RecNo);
}
/**
*交换表格中的两行
先将数据集的XML串中进行换位，然后直接对表格上的两行进行交换swapNode，再将ds.recno-1
再将序列号兑换
*@param up==true 表示向上换，否则向下换
*@date 2010-09-21
**/
function GridChangeRowSort(up, ogrid1) {
    
    var oDs = $obj(ogrid1.dataset);
    changeRowSave(oDs, up);
    GridChangeRow(up, ogrid1);
    
}

/**
设计表单中的处理事件串 fc_billevent()
bill_onclick("")  ondblclick=bill_ondblclick("zl_select_employee")  onfocus=bill_onenter("") 
 onblur=bill_onexit("") onkeydown=bill_onkeydown("")
 BillEventHeadOpen(obj.onclick,SKDBedit3)
*@date 2004-08-08
**/
function BillEventHeadOpen(svalue,obj){
	var s=svalue ;
	var ilen=14 ;//bill_onclick(" 的长度
    if(typeof s == "function"){
        s = s.toString();
        //alert(s);
        ilen = BillEventHeadOpenTmp(s);
        var ipos = s.indexOf("bill_");
        obj.value=s.substring(ilen+ipos,s.length-4);
    }else{
        if(IsSpace(s)){
               obj.value="";
        }else{
        	ilen=BillEventHeadOpenTmp(s);
               obj.value=s.substring(ilen,s.length-2) ;
        }
    }
}
function BillEventHeadOpenTmp(s) {
	var iRet=14;
	if(s.indexOf("bill_ondblclick")>=0){
		iRet=17;
	}else if (s.indexOf("bill_onexit")>=0){
		iRet=13;
	}else if (s.indexOf("bill_onkeydown")>=0){
		iRet=16;
	}	
	return iRet;
}
/**
*设置某编辑框为密码输入框,它一般放在窗体打开事件中.
SKDBedit2 为要设置的输入框的ID 
*@date 2004-02-18
**/
function SetPasswordEdit(SKDBedit2) {
  var s1=SKDBedit2.outerHTML;
  var sRet=repStr(s1,'<INPUT ','<INPUT type=password ');
  SKDBedit2.outerHTML=sRet;
}
/**
 *@func:由数据库的原始字段类型转换成eform的数据集的字段类型
 *@date:2008-3-26
 *@param:sourType 数据库的原始字段类型
 *@return eform的数据集的字段类型
**/
function getDsType(sourType) {
    if (IsSpace(sourType)) return "字符";
	var stype = sourType;
	stype = stype.toLowerCase();
	if(stype == "char" || stype =="string" || stype =="varchar" || stype =="nchar" || stype =="nvarchar" || stype == "varchar2" || stype == "nvarchar2") //char and varchar
		stype = "字符";
	if (stype =="text" || stype =="ntext" || stype == "clob" || stype == "nclob" || stype == "long")
		stype = "文本";
	if(stype == "decimal" || stype == "float" || stype == "real" || stype == "money" || stype == "smallmoney"  || stype == "numeric" )
		stype="实数";
	if(stype == "int32" || stype == "smallint" || stype == "bit" || stype == "int" || stype == "bigint" || stype == "tinyint" || stype == "integer") //INTEGER
		stype="整数";
	if(stype == "date" || stype == "datetime" || stype == "smalldatetime" )
		stype="日期";
	if(stype == "image" || stype == "blob"  || stype == "varbinary"  || stype == "binary" || stype == "raw" || stype == "long raw" || stype == "bfile")
		stype="图象";
	if((stype != "日期") &&stype != "实数" && stype != "整数" && stype != "文本" &&  stype != "图象")
		stype="字符";
	return stype;	
}

/**
*另存文件到客户端
*@param sFile 客户端的路径和文件名,如c:/1.xls
*@date 2004-12-7
**/
function SaveFile(sFile,sHtml){
	try{
		var fso = new ActiveXObject("Scripting.FileSystemObject");
	}catch(e){
		alert("因当前IE禁止运行ActiveX控件,请调低IE的安全属性后再运行此功能!");
		return;
	}
	var char1=unescape("%5C"); //特殊字符\
	var sFile1=repStr(sFile,char1,char1+char1);
	try{
		var a = fso.CreateTextFile(sFile1, false);
	}catch(e){
		alert("文件"+sFile+"已存在.");
		return;
	}
	var s1="" ;
	if(typeof sHtml == "undefined" ){
		s1=t.outerHTML;
	}else {
		s1=sHtml;
	}
	a.WriteLine(s1);
	a.Close();
	alert("文件成功保存到: "+sFile);

}


/**
* 检查控件ID同名
* 当属性框上的ID onchange 时检查,同时给新的ID值
*@param oContXml 全局的Dom对象
*@param sid 要检查的控件名称,修改后的ID
*@param obj 为修改的对象
*@return 空表示不重名,否则为错误信息
*@date 2005-01-01
**/
function CheckContSameName(oContXml,sid,obj,SKbillsheet) {
	var oldid = obj.id;
	sid = new Eapi.Str().trim(sid);
	//检查ID的合法性
	var re = /\W/g ; //匹配任何非单词字符
	if( re.test(sid) ) {
		sRet = "控件名称只能为a-z或A-Z或0-9或_";
		return sRet;
	}
	
	var sRet = "" ;
	var oList = oContXml.documentElement.selectNodes("//id[. ='"+sid+"']") ;
	if(oList.length > 0 ) {
		sRet = sid+ "控件名称重复! 请另外输入一个名称! " ;
	} else if (oList.length <= 0 ){		//update control id
		var oNode = oContXml.documentElement.selectSingleNode("//id[. ='"+oldid+"']") ;
		if(oNode != null) {
			oNode.text = sid ;
			obj.id = sid ;
			SKbillsheet.ownerDocument.parentWindow.parent.objlist.execScript("objlist_edit('"+oldid+"','"+sid+"')");
		}
		
		//修改taborder
		var sxml = SKbillsheet.billtaborder;
		if(isSpace(sxml) == false ){
			var oXml = SetDom(sxml);
			oNode = oXml.documentElement.selectSingleNode("//taborder[. ='"+oldid+"']") ;
			if( oNode  != null ) { 
				oNode.text = sid ;
				SKbillsheet.billtaborder = oXml.documentElement.xml;
			}
		}
		
	}

	return sRet;
}
/**
//给值,oCont为text对象名,oP为要给的值,
**/
function SetTextValue(oP,oCont){
	if(IsSpace(oP)){
		oCont.value="";
	}else{
		oCont.value=oP;
	}
}
/**
*oCont为checkbox对象名,oP为要给的值,
*如果为空时,checkbox值为否
**/
function SetCheckBoxPutValue(oP,oCont){
	if(IsSpace(oP)){
		SetCheckBoxValue(oCont,"否");
	}else{
		SetCheckBoxValue(oCont,oP);
	}
}
/**
*oCont为checkbox对象名,oP为要给的值,此函数用在e表中.
*如果为空时,checkbox值为否
**/
function e_SetCheckBoxValue(value,oCont){
	if(IsSpace(value) == false ){
		SetCheckBoxValue(oCont,value);
	}
}
function e_SetComboValue(value,oCont){
	if(IsSpace(value) == false ){
		oCont.value = value;
	}
}
function e_SetRadioValue(value,oCont){
	if(IsSpace(value) == false ){
		SetRadioValue(oCont,value);
	}
}
/**
* 将值赋给某个对象的属性,用于属性框的确定按钮
* 
  obj = obj
  propName = "e_display_value"
  value = text.value
*@date 2006-06-30
**/
function e_SetPropValue(obj,propName,value){
	//alert(value)
	if(IsSpace(value)){
		obj.removeAttribute(propName);
	}else{
		obj.setAttribute(propName,value);
		//objProp = value;
	}
}
/**
*
*/
function SetPosOnChange(oCont,pos) {
	var obj = event.srcElement;
	if(obj.value == txtLeft.value) {
		oCont.style.left=obj.value ;
	}
	if(obj.value == txtTop.value) {
		oCont.style.top=obj.value;
	}
	if(obj.value == txtWidth.value) {
		oCont.style.width=obj.value ;
	}
	if(obj.value == txtHeight.value ) {
		oCont.style.height=obj.value ;
	}
}

/**
*obj控件ID
*文本框中是否包涵双引号,如包涵则return false;
**/
function RepDqMarks(obj) {
	if(obj.value.indexOf('"') != -1)
	return false;
}

/**
*检查绑定数据集的字段，如果其中一个为空，一个不为空，不能保存
*obj1,obj2绑定数据集的字段控件ID
**/
function IsCheckDataField(obj1,obj2) {
	if(IsSpace(obj1.value) == false && IsSpace(obj2.value) == true || IsSpace(obj1.value) == true && IsSpace(obj2.value) == false) 
	return false;
	
	
}
/**
*用于由值生成option串
*@date 2005-11-17
**/
/*
function ListValueOption(stext,svalue){
	var stxt=stext.split("\r\n");
	var sval=svalue.split("\r\n");
	var sHtml=new Sys.StringBuilder();
	if(IsSpace(stext)==false) {
		for(var i=0;i<stxt.length;i++){
			try{
				s1=stxt[i];
				s2=sval[i];
				if(typeof s1=="undefined"){
					s1="";
				}
				if(typeof s2=="undefined"){
					s2="";
				}
			}catch(e){
				s1="";
				s2="";
			}
			//if (sHtml==""){
			//	sHtml="<option value='"+s2+"'>"+s1+"</option>"
			//}else{
				sHtml.append("<option value='"+s2+"'>"+s1+"</option>");
			//}
		}
	}
	return sHtml.toString() ;
}*/
/**
*用于由值生成option串
*@date 2005-11-17
**/
/*
function DropDownValueOption(stext,svalue){

	var stxt=stext.split("\r\n");
	var sval=svalue.split("\r\n");	
	var sHtml="" ;
	for(var i=0;i<stxt.length;i++){
		try{
			s1=stxt[i];
			s2=sval[i];
			if(typeof s1=="undefined"){
				s1="";
			}
			if(typeof s2=="undefined"){
				s2="";
			}
		}catch(e){
			s1="";
			s2="";
		}
		
		if(IsSpace(svalue)) {
			sHtml=sHtml+"<tr><td height='16'>"+s1+"</td></tr>" ;	
		}else{
			sHtml=sHtml+"<tr><td height='16px'>"+s1+"</td><td height='16px'>"+s2+"</td></tr>"
		}
	}
	return sHtml ;
}*/
/**
* 处理属性窗口中的控件是否显示属性，在点确定时运行。
*@para obj 对象
*@para chkobj checkbox对象
*@date 2006-02-17
**/
function PropWinDisplayAction(obj,chkObj){
	if(chkObj.value=='否'){
		obj.style.display="none";
	}else{
		obj.style.cssText=RepStr(obj.style.cssText,"DISPLAY: none;","");
	}

}
/**
* 处理属性窗口中的控件的字体等相关属性
*@date 2006-02-17
**/
function PropWinFontAction(obj,obj1){
	if(obj1.change == "是"){
		obj.style.color=obj1.style.color ;
		obj.style.fontStyle=obj1.style.fontStyle;
		obj.style.textDecoration=obj1.style.textDecoration;
		obj.style.fontFamily=obj1.style.fontFamily;
		obj.style.fontSize=obj1.style.fontSize;
		obj.style.fontWeight=obj1.style.fontWeight;
	}

}
/**
* 处理属性窗口中的控件的定位模式的变化
*@date 2006-02-18
**/
function PropWinChangePosition() {
	if(cboPosition.value!="absolute"){
		txtLeft.value="";
		txtTop.value="";
	}	
	if(cboPosition.value != "absolute") {
		txtLeft.disabled = true ; 
		txtTop.disabled = true;	
	}else{
		txtLeft.disabled = false;
		txtTop.disabled = false;
	}
}
/**
* 处理属性窗口中的控件的条件格式的按钮的事件
*@date 2006-02-18
**/
function PropWinClickTermStyle(){
	var arr1=new Array();
	var obj=fcpubdata.obj[0] ;
	arr1[0]=fcpubdata.obj[1];
	arr1[1]=obj.termStyle;
	var sxml = DjOpen('../../fceform/common/djframe.htm?djsn=termcard&djtype=ST', arr1, '展现', '有模式窗口', '直接', '条件格式');
	if(typeof(sxml)=="undefined"){
		return;	
	}
	obj.termStyle=sxml;
}
/**
* 处理属性窗口中的控件的选择数据集和字段
*@date 2006-02-18
**/
function PropWinSelField() {
	var arrtmp=contselfield(fcpubdata.obj[1]);
	if(typeof arrtmp != "undefined"){
		$id("txtDataset").value=arrtmp[0];
		$id("txtField").value=arrtmp[1];
		$id("txtFieldChn").value = arrtmp[2];
		//if (fcpubdata.obj[0].controltype == "label") $id("txtContent").value = arrtmp[2];
		if (fcpubdata.obj[0].controltype == "text") $id("txtValue").value = arrtmp[2];
		if (fcpubdata.obj[0].controltype == "textarea") $id("txtValue").value = arrtmp[2];
		if (fcpubdata.obj[0].controltype == "checkbox") {
		    if ($id("txtLabel").value == "复选框") {
		        $id("txtLabel").value = arrtmp[2];
		    }
		    $id("txtValue").value = "";
		}
		if (fcpubdata.obj[0].controltype == "radio") {
		    if ($id("txtLabel").value == "单选表") {
		        $id("txtLabel").value = arrtmp[2];
		    }
		    $id("txtValue").value = "";
		}
		
	}
}
/**
* 处理属性窗口中的控件的改变数据源
*@date 2006-02-18
**/
function PropWinChangeDs() {
    if ($id("rdoDs").value != "2") $id("rdoDs").value = 1;
    var oAsync = $id("async");
    if($id("rdoDs").value == "2"){
          $id("txtListText").style.width=0;
          $id("txtListValue").style.width=0;
          $id("lblListValue").style.width=0 ;
          $id("txtListSql").style.width=315;
          if(fcpubdata.dbStruDict == "FC_ENTITY") aGenSql.style.display="";
          $id("lblDsn").style.display="";
          $id("cboDsn").style.display = "";
          if (oAsync != null) oAsync.style.display = "";
     }else{
          $id("txtListText").style.width=138;
          $id("txtListValue").style.width=138;
          $id("lblListValue").style.width=50 ;
          $id("txtListSql").style.width=0;
          if(fcpubdata.dbStruDict == "FC_ENTITY") aGenSql.style.display="none";
          $id("lblDsn").style.display="none";
          $id("cboDsn").style.display = "none";
          if (oAsync != null) oAsync.style.display = "none";

     }
}
/**
* 通过选择表名来产生SQL语句
*@date 2009-01-13
**/
function PropWinGenSql(sType, oCont) {
    var oRetCont = oCont;
    if (IsSpace(oRetCont)) oRetCont = $id("txtListSql");
    var sPlus = " + ";
    if(fcpubdata.databaseTypeName == "oracle") sPlus=" || ";
    var outsql = "'select '"+sPlus+"fc_query.fdlist"+sPlus+"' from '"+sPlus+"fc_entity.tbname as sqlstr";
    var sql = "select " + outsql + ",fc_entity.tbname,fc_entity.tbchnname as 表中文名,fc_query.fdchnlist as 字段中文名列表 from fc_entity inner join fc_query on fc_entity.tbname=fc_query.tbname where fc_query.type=" + sType;
    //var sRet = SelectZlSql(sql,"否","sqlstr,tbname");
    var sRet = CommonSelect({ sql: sql, isgrid: 1, obj: oRetCont, hidefields: 'sqlstr,tbname', gridcolwidth: [200, 480] });
    
    if(IsSpace(sRet) == false){
        SetRadioValue(rdoDs, "2");
        PropWinChangeDs();

        oRetCont.value = sRet;
        
    }    
}
/**
* 属性框的打开事件
*@date 2006-02-18
**/
function PropWinOnload() {
	var obj=fcpubdata.obj[0] ;
	if(typeof displayfont == "object"){
		var obj1=displayfont  ;
		if(obj.style.backgroundColor==""){
			obj1.style.backgroundColor="#ffffff";
		}else{
			obj1.style.backgroundColor=obj.style.backgroundColor;
		}
		
		obj1.style.color=obj.style.color ;
		obj1.style.fontStyle=obj.style.fontStyle;
		obj1.style.textDecoration=obj.style.textDecoration;
		obj1.style.fontFamily=obj.style.fontFamily;
		obj1.style.fontSize=obj.style.fontSize;
		obj1.style.fontWeight=obj.style.fontWeight;
	}
	if (typeof txtId == "object")  SetTextValue(obj.id, txtId);
	if (typeof txtClassName == "object") SetTextValue(obj.className, txtClassName); //样式class


	//var bmpPath = fcpubdata.path+fcpubdata.skinsPath+"/css/skins/"+fcpubdata.skins+"/images/ef_run_downarrow.gif";

	if(typeof cmdActionSet == "object") cmdActionSet.style.display = fcpubdata.actionButtonDisplay;
	if (typeof cmdActionFcBug == "object") cmdActionFcBug.style.display = fcpubdata.fcbugButtonDisplay;
	
	
	action_button_down($id("cmdEclick"));
	action_button_down($id("cmdEdblclick"));
	action_button_down($id("cmdEfocus"));
	action_button_down($id("cmdEblur"));
	action_button_down($id("cmdEkey"));
	action_button_down($id("cmdEchange"));
	//if(typeof cmdEdblclick == "object") SetButtonImage(cmdEdblclick,bmpPath);
	//if(typeof cmdEfocus == "object") SetButtonImage(cmdEfocus,bmpPath);
	//if(typeof cmdEblur == "object") SetButtonImage(cmdEblur,bmpPath);
	//if(typeof cmdEkey == "object") SetButtonImage(cmdEkey,bmpPath);
	//if(typeof cmdEchange == "object") SetButtonImage(cmdEchange,bmpPath);
//	BillEventHeadOpen(obj.fc_onclick,txtEclick)
	if (typeof cmdBgcolor == "object") {
	    //SetButtonImage(cmdBgcolor, "../images/ef_run_button_color.gif");
	    cmdBgcolor.className = 'ef_run_button_color';
	    cmdBgcolor.title = "设置背景色";
	}
	if (typeof cmdNotBg == "object") {
	   // SetButtonImage(cmdNotBg, "../images/ef_run_button_notbg.gif");
	    cmdNotBg.className = 'ef_run_button_notbg';
	    cmdNotBg.title = "删除背景色";
	}
	if (typeof cmdNotBg1 == "object") {
	    //SetButtonImage(cmdNotBg1, "../images/ef_run_button_notbg.gif");
	    cmdNotBg1.className = 'ef_run_button_notbg';
	    cmdNotBg1.title = "删除背景色";
	}
	if (typeof cmdFont == "object") {
	    //SetButtonImage(cmdFont, "../images/ef_run_button_font.gif");
	    cmdFont.className = 'ef_run_button_font';
	    cmdFont.title = "设置字体";
	}
	if (typeof cmdSmallUp == "object") {
	    cmdSmallUp.className = 'ef_run_button_up';
	    cmdSmallUp.title = "上移一行";
	}

	if (typeof cmdSmallDown == "object") {
	    cmdSmallDown.className = 'ef_run_button_down';
	    cmdSmallDown.title = "下移一行";
	}
    
	if (typeof cmdOk == "object") {
	    var but = $id("cmdOk");
	    but.style.width = "66px";
	    but.style.height = "21px";
	    but.className = "cmdOk";
	    but.attachEvent("onmouseout", function() { cmdOk.className = 'cmdOk'; });
	    but.attachEvent("onmouseover", function() { cmdOk.className = 'cmdOk-over'; });
	}
	if (typeof cmdClose == "object") {
	    var but = $id("cmdClose");
	    but.style.width = "66px";
	    but.style.height = "21px";
	    but.className = "cmdClose";
	    but.attachEvent("onmouseout", function() { cmdClose.className = 'cmdClose'; });
	    but.attachEvent("onmouseover", function() { cmdClose.className = 'cmdClose-over'; });
	}
	//SetButtonImage($id("cmdOk"),"../images/ok.gif");
	//SetButtonImage($id("cmdClose"),"../images/close.gif");
	//SetCheckBoxPutValue(obj.dropstyle,SKDBcheckbox1) ;
	if(typeof chkLeftLine == "object") CheckBoxPutValue(obj.style.borderLeft,chkLeftLine,'0px');
	if(typeof chkTopLine == "object") CheckBoxPutValue(obj.style.borderTop,chkTopLine,'0px');
	if(typeof chkBottomLine == "object") CheckBoxPutValue(obj.style.borderBottom,chkBottomLine,'0px');
	if(typeof chkRightLine == "object") CheckBoxPutValue(obj.style.borderRight,chkRightLine,'0px');
	if (typeof chkDisplay == "object") {
	    if (obj.style.display == "none")
	        SetCheckBoxValue(chkDisplay, "否");
	    else
	        SetCheckBoxValue(chkDisplay, "是");
	}
	if(typeof txtWidth == "object") SetTextValue(obj.style.width,txtWidth);
	if(typeof txtHeight == "object") SetTextValue(obj.style.height,txtHeight);
	if(typeof txtTop == "object") SetTextValue(obj.style.top,txtTop);
	if(typeof txtLeft == "object") SetTextValue(obj.style.left,txtLeft);
	if (typeof txtId == "object") {
	    $id("txtId").onchange = function uf_id_onchange() {
	        var sR = CheckContSameName(fcpubdata.obj[3], $id("txtId").value, obj, fcpubdata.obj[2]);
	        if (sR != "") {
	            alert(sR);
	            event.returnValue = false;
	        } else {
	            //需要同步修改自动布局中的内容. 2011-03-22
	            var sAutoXml = fcpubdata.obj[0].AutoSizeXml;
	            if (IsSpace(sAutoXml) == false) {
	                var pos = sAutoXml.indexOf(">");
	                if (pos >= 0) {
	                    fcpubdata.obj[0].AutoSizeXml = "<record id ='" + $id("txtId").value + "'>" + sAutoXml.substring(pos + 1, sAutoXml.length);
	                }
	            }
	        }
	    }
	}
//	if(obj.style.backgroundColor==""){
//		displayfont.style.backgroundColor="#d4d0c8"
//	}else{
//		displayfont.style.backgroundColor=obj.style.backgroundColor;
//	}
	if(typeof chkDisabled == "object")	{
		if(obj.disabled==false){
			SetCheckBoxValue(chkDisabled,"是");
		}else{
			SetCheckBoxValue(chkDisabled,"否");
		}
	}
	if (typeof cboPosition == "object") {
	    $id("cboPosition").value = obj.style.position;
	    var tmpB = true;
	    if (obj.style.position == "absolute") {
	        tmpB = false
	    }
	}
	if(typeof txtLeft == "object") $id("txtLeft").disabled = tmpB ; 
	if(typeof txtTop == "object") $id("txtTop").disabled = tmpB ;	
	
	//动态部分
	if(typeof cboDsn == "object") {  
	    getDsnList(cboDsn,obj.datasourceName); 
    }
	if(typeof txtValue == "object")	SetTextValue(obj.value,txtValue);
	if(typeof txtDataset == "object") SetTextValue(obj.dataset,txtDataset);
	if(typeof txtField == "object") SetTextValue(obj.field,txtField);
	if(typeof txtFieldChn == "object") SetTextValue(obj.china,txtFieldChn);
	if(typeof txtEclick == "object") {
	    BillEventHeadOpen(obj.fc_onclick,txtEclick);
	    txtEclick.ondblclick=EventCodeOpenBigWindow;
	}
	if(typeof txtEdblclick == "object") {
	    BillEventHeadOpen(obj.fc_ondblclick,txtEdblclick);
	    txtEdblclick.ondblclick=EventCodeOpenBigWindow;
	}
	if(typeof txtEfocus == "object") {
	    BillEventHeadOpen(obj.fc_onfocus,txtEfocus);
	    txtEfocus.ondblclick=EventCodeOpenBigWindow;
	}
	if(typeof txtEblur == "object") {
	    BillEventHeadOpen(obj.fc_onblur,txtEblur);
	    txtEblur.ondblclick=EventCodeOpenBigWindow;
	}
	if(typeof txtEkey == "object") {
	    BillEventHeadOpen(obj.fc_onkeydown,txtEkey);
	    txtEkey.ondblclick=EventCodeOpenBigWindow;
	}
	if(typeof txtEchange == "object") {
	    BillEventHeadOpen(obj.onchange,txtEchange);
	    txtEchange.ondblclick=EventCodeOpenBigWindow;
	}
	if(typeof chkReadOnly == "object"){
		if(obj.readOnly==true){
			SetCheckBoxValue(chkReadOnly,"是");
		}else{
			SetCheckBoxValue(chkReadOnly,"否");
		}
	}
	if(typeof chkNotBg == "object"){
		if(IsSpace(obj.NotBg)){
			SetCheckBoxValue(chkNotBg,"否");
		}else{
			SetCheckBoxValue(chkNotBg,obj.NotBg);
		}
	}
	
	//--------------------------added by liuxr at 2008-01-03 控件的自定义属性-----------------------//
	if (typeof txtCustomAttr == "object") {
	    SetTextValue(obj.CustomAttr,txtCustomAttr);
	    txtCustomAttr.ondblclick=EventCodeOpenBigWindow;
	}
	//----------------------------------------------------------------------------------------------//
	
	if(typeof cboAlign == "object") cboAlign.value=obj.style.textAlign ;
	
	if(typeof txtListText == "object") SetTextValue(obj.temptext,txtListText);
	if(typeof txtListValue == "object") SetTextValue(obj.tempvalue,txtListValue);
	if(typeof txtListSql == "object") {
	    var tempSql = obj.sql1; //兼容dropdownlist 的 sql1
	    if(IsSpace(tempSql)) tempSql = obj.sql;
	    SetTextValue(tempSql,txtListSql);
	}
	if(typeof rdoDs == "object"){
		SetRadioValue(rdoDs,obj.check);
	}
	
	//if(fcpubdata.dbStruDict == "FC_ENTITY"){
	//    if(typeof aGenSql == "object") aGenSql.style.display="";
	//}
	
	    //取表单上的所有控件
    new Eapi.RunForm().getConts();

	/**
	*oP为checkbox对象名,oCont为要给的值
	**/
	function CheckBoxPutValue(oP,oCont,vValue){
		if( oP == vValue){
			SetCheckBoxValue(oCont,"否");
		}else{
			SetCheckBoxValue(oCont,"是");
		}
    }


}
function action_button_down(oButton) {
    if (oButton != null) {
        var cmdClass = "cmdDown";
        var cmdWidth = "17px";
        if (oButton.id.substring(0, 7) == "cmdDate") {
            cmdClass = "cmdDate";
            cmdWidth = "20px";
        }
        var but = oButton;
        but.className = cmdClass;
        but.style.width = cmdWidth;
        but.style.height = "20px";
        //but.attachEvent("onmouseout", function() { oButton.className = cmdClass; });
        //but.attachEvent("onmouseover", function() { oButton.className = cmdClass + '-over'; });
        NavJs.addEvent(but, "onmouseout", function() { this.className = cmdClass; });
        NavJs.addEvent(but, "onmouseover", function() { this.className = cmdClass + '-over'; });

    }
}
/**
* 清除背景色 2010-09-28
**/
function PropWinClearBg() {
    new Eapi.Css().clearPart(displayfont, 'backgroundColor', 'background-color');
    displayfont.changebg = "是";
}
function EventCodeOpenBigWindow(){
///打开一个大的编辑框用来显示和输入事件代码
var obj = event.srcElement;
var sret = DjOpen("../../fceform/common/djframe.htm?djsn=inputBigText&djtype=ST", obj.value, "展现", "有模式窗口", "直接", "");
if(typeof(sret) != "undefined" ){
obj.value = sret;
try{
obj.fireEvent("onchange");
}catch(e){}
}
}
/**
* 属性框的确定事件
*@return true 表示不合法.
*@date 2006-02-18
**/
function PropWinClickOk() {
    var obj=fcpubdata.obj[0] ;
	if(typeof displayfont == "object"){
		var obj1=displayfont ;
		if(obj1.changebg == "是") obj.style.backgroundColor=obj1.style.backgroundColor;
		
		PropWinFontAction(obj,obj1);
	}
	if (typeof txtClassName == "object") {
	    var sValue1 = $id("txtClassName").value;
	    if (IsSpace(sValue1) == false) obj.className = sValue1;
	}
	
	if(typeof txtValue == "object") {
	    obj.value=txtValue.value;
	}
	if(typeof chkDisabled == "object"){
		if(chkDisabled.value=='否'){
			obj.disabled=true;
		}else{
			obj.disabled=false;
		}
	}
	if(typeof chkDisplay == "object") PropWinDisplayAction(obj,chkDisplay);
	if(typeof chkNotBg == "object"){
		obj.NotBg = chkNotBg.value ;
		if(chkNotBg.value=='是'){
			obj.style.backgroundColor="";
		}
	}
	if(typeof chkLeftLine == "object"){
		if(chkLeftLine.value=='否'){
		    obj.style.borderLeft = "0px";
		    //obj.style.cssText = RepStr(obj.style.cssText, "BORDER-LEFT: 0px;", "")
		}else{
			obj.style.cssText=RepStr(obj.style.cssText,"BORDER-LEFT: 0px;","")
			if(obj.tagName == "DIV"){
			    obj.style.borderLeft = "1px solid";
			}
		}
	}
	if(typeof chkTopLine == "object"){
		if(chkTopLine.value=='否'){
		    obj.style.borderTop = "0px";
		    //obj.style.cssText = RepStr(obj.style.cssText, "BORDER-TOP: 0px;", "")
		}else{
			obj.style.cssText=RepStr(obj.style.cssText,"BORDER-TOP: 0px;","")
			if(obj.tagName == "DIV"){
				obj.style.borderTop = "1px solid" ;
			}
		}
	}
	if(typeof chkBottomLine == "object"){
		if(chkBottomLine.value=='否'){
		    obj.style.borderBottom = "0px";
		    //obj.style.cssText = RepStr(obj.style.cssText, "BORDER-BOTTOM: 0px;", "")
		}else{
			obj.style.cssText=RepStr(obj.style.cssText,"BORDER-BOTTOM: 0px;","")
			if(obj.tagName == "DIV"){
				obj.style.borderBottom = "1px solid" ;
			}
		}
	}
	if(typeof chkRightLine == "object"){
		if(chkRightLine.value=='否'){
		    obj.style.borderRight = "0px";
		    //obj.style.cssText = RepStr(obj.style.cssText, "BORDER-RIGHT: 0px;", "")
		}else{
			obj.style.cssText=RepStr(obj.style.cssText,"BORDER-RIGHT: 0px;","")
			if(obj.tagName == "DIV"){
				obj.style.borderRight = "1px solid" ;
			}
		}
	}
	if(typeof cboPosition == "object") obj.style.position = $id("cboPosition").value ;
	
	//---------------------added by liuxr at 2008-01-03 控件的自定义属性----------//
	if (typeof txtCustomAttr == "object")
	{
		if(txtCustomAttr.value.indexOf('"') != -1 || txtCustomAttr.value.indexOf("'") != -1)
		{
			alert("自定义属性中不支持双引号或单引号。")
			return true;
		}
		if(IsSpace(txtCustomAttr.value))
		    obj.removeAttribute("CustomAttr");
		else
		    obj.CustomAttr = txtCustomAttr.value;
		  
	}
	//-----------------------------------------------------------------------------//
	
	//动态部分
	if(typeof cboDsn == "object") obj.datasourceName=cboDsn.value;

	if(typeof txtFieldChn == "object") obj.china=txtFieldChn.value;
	var sMsg = "不支持双引号!" ;
	if(typeof txtEclick == "object"){
		if(RepDqMarks(txtEclick) == false )
		{
			alert(sMsg)
			return true; 
		}
	}
	if(typeof txtEdblclick == "object"){
		if(RepDqMarks(txtEdblclick) == false )
		{
			alert(sMsg)
			return true; 
		}
	}
	if(typeof txtEfocus == "object"){
		if(RepDqMarks(txtEfocus) == false )
		{
			alert(sMsg)
			return true; 
		}
	}
	if(typeof txtEblur == "object"){
		if(RepDqMarks(txtEblur) == false )
		{
			alert(sMsg)
			return true; 
		}
	}
	if(typeof txtEkey == "object"){
		if(RepDqMarks(txtEkey) == false )
		{
			alert(sMsg)
			return true; 
		}
	}
	if(typeof txtEchange == "object"){
		if(RepDqMarks(txtEchange) == false )
		{
			alert(sMsg)
			return true; 
		}
	}
	if(typeof txtDataset == "object" && typeof txtField == "object"){
		if(IsCheckDataField(txtDataset,txtField) == false )
		{
			alert("数据集和字段名称不能为空，请选择！");
			return true;
		}
        /*if(txtDataset.value != "" && txtField.value != ""){
	        if(typeof txtValue == "object") {
	            if(txtValue.value != ""){
                    alert("警告:当控件绑定到了数据集后,再设置控件的默认值的话,控件的默认值将不起作用,因为控件的值是由数据集来决定的.")        	    
	            }
            }
        }*/		
	}
	
	var s="";
	if(typeof txtEclick == "object"){
		s=new Eapi.Str().trim(txtEclick.value)
		if(s==""){
			obj.removeAttribute('fc_onclick')
		}else{
			obj.fc_onclick="bill_onclick(\""+s+"\")";
		}
	}
	if(typeof txtEchange == "object"){
		s=new Eapi.Str().trim(txtEchange.value)
		if(s==""){
			obj.removeAttribute('onchange')
		}else{
			obj.onchange="bill_onclick(\""+s+"\")";
		}
	}
	if(typeof txtEdblclick == "object"){
		s=new Eapi.Str().trim(txtEdblclick.value)
		if(s==""){
			obj.removeAttribute('fc_ondblclick')
		}else{
			obj.fc_ondblclick="bill_ondblclick(\""+s+"\")";
		}
	}
	if(typeof txtEfocus == "object"){
		s=new Eapi.Str().trim(txtEfocus.value)
		if(s==""){
			obj.removeAttribute('fc_onfocus')
		}else{
			obj.fc_onfocus="bill_onenter(\""+s+"\")";
		}
	}
	if(typeof txtEblur == "object"){
		s=new Eapi.Str().trim(txtEblur.value)
		if(s==""){
			obj.removeAttribute('fc_onblur')
		}else{
			obj.fc_onblur="bill_onexit(\""+s+"\")";
		}
	}
	if(typeof txtEkey == "object"){
		s=new Eapi.Str().trim(txtEkey.value)
		if(s==""){
			obj.removeAttribute('fc_onkeydown')
		}else{
			obj.fc_onkeydown="bill_onkeydown(\""+s+"\")";
		}
	}
	if(typeof txtDataset == "object"){
		s=new Eapi.Str().trim(txtDataset.value)
		if(s==""){
			obj.removeAttribute('dataset')
		}else{
			obj.dataset=s;
		}
	}
	if(typeof txtField == "object"){
		s=new Eapi.Str().trim(txtField.value)
		if(s==""){
			obj.removeAttribute('field')
		}else{
			obj.field=s;
		}
	}
	if(typeof txtFieldChn == "object"){
		s=new Eapi.Str().trim(txtFieldChn.value)
		if(s==""){
			obj.removeAttribute('china')
		}else{
			obj.china=s;
		}
	}
	
	if(typeof cboAlign == "object") obj.style.textAlign = cboAlign.value ;
	if(typeof chkReadOnly == "object") {
		if(chkReadOnly.value=='是'){
			obj.readOnly=true ;
		}else{
			obj.readOnly=false;
			obj.removeAttribute("readOnly")
		}
	}
	
	
	//combobox
	if(typeof rdoDs == "object" && typeof txtListText == "object" && typeof txtListValue == "object" && typeof txtListSql == "object" ) {
		if(rdoDs.value == "2"){
			obj.check=2;
		}else{
			obj.check=1 ;
		}
		var isDropDownList = obj.controltype == "dropdownlist";
		var sDefaultValue = "";
		if(typeof txtValue == "object")sDefaultValue = txtValue.value;
		var sHtml=PropWinListValueToOption(txtListText.value,txtListValue.value,sDefaultValue,isDropDownList);
		var stxt=txtListText.value.split("\r\n");
		var sval=txtListValue.value.split("\r\n");
		/*var sHtml=new Sys.StringBuilder();
		if(IsSpace(txtListText.value)==false) {
			for(var i=0;i<stxt.length;i++){
				try{
					s1=stxt[i];
					s2=sval[i];
					if(typeof s1=="undefined"){
						s1="";
					}
					if(typeof s2=="undefined"){
						s2="";
					}
				}catch(e){
					s1="";
					s2="";
				}
				var sSel="";
				if(typeof txtValue == "object"){ 
					if (s2 == txtValue.value) sSel=" selected ";
				}
				if(isDropDownList){
				    sHtml.append("<tr height='16px' ><td>"+s1+"</td>");
				    if(IsSpace(txtListValue.value) == false) sHtml.append("<td>"+s2+"</td>");
				    sHtml.append("</tr>");
				}else{
				    sHtml.append("<option value='"+s2+"'"+sSel+">"+s1+"</option>");
				}
			}
		}*/
		var slen = stxt.length ;
		var lent = sval.length;
		if(IsSpace(txtListText.value) == false && IsSpace(txtListValue.value) == false) {
			if(slen != lent){
				alert("显示值和取值的长度不相等,请修改!")	;
				return true;
			}	
		}
		if(IsSpace(txtListText.value) == false && IsSpace(txtListValue.value) == true && isDropDownList==false){
			txtListValue.value = txtListText.value ;	
		}	
		obj.tempvalue=txtListValue.value;
		obj.temptext=txtListText.value;
		obj.sql=txtListSql.value;
		if(isDropDownList){
            obj.xml = sHtml;
		}else if(obj.tagName.toLowerCase() == "select"){
		    obj.options.length=0;
		    obj.outerHTML=SelectAddOption(obj,sHtml);
		}
	}	
	
//added by liuxr at 2009-5-26 增加判断，如果控件绑定字段后且默认值不为空时则提示"绑定字段后的控件默认值无效，需要到dataset数据集的字段上设置默认值"。
	var dvalue = obj.value;
	if( (typeof dvalue == "undefined" || dvalue == "" ) && typeof(txtValue) != "undefined") dvalue = txtValue.value;
	if (typeof dvalue != "undefined" && dvalue != "" && obj.field != "undefined" && obj.field != "" && typeof obj.dataset != "undefined" && obj.dataset != "")
	{
	    if(dvalue != obj.china) //当默认值不等于字段中文名时
		    return !window.confirm("绑定字段后的控件默认值无效，需要到dataset数据集的字段上设置默认值，是否继续？");
	}
	
	return false;

	
}

function PropWinListValueToOption(sText,sValue,sDefaultValue,isDropDownList){
///将常数的多选值转换成option串
	var stxt=sText.split("\r\n");
	if(IsSpace(sValue)) sValue = sText;
	var sval=sValue.split("\r\n");
	var sHtml=new Sys.StringBuilder();
	//	if(IsSpace(sText)==false) {
	if(sText != null && typeof(sText) != "undefined" && sText != "") {
		for(var i=0;i<stxt.length;i++){
			try{
				s1=stxt[i];
				s2=sval[i];
				if(typeof s1=="undefined"){
					s1="";
				}
				if(typeof s2=="undefined"){
					s2="";
				}
			}catch(e){
				s1="";
				s2="";
			}
			var sSel="";
			//if(typeof txtValue == "object"){ 
				if (s2 == sDefaultValue) sSel=" selected ";
			//}
			if(isDropDownList){
			    sHtml.append("<tr height='20px' ><td>"+s1+"</td>");
			    if(IsSpace(sValue) == false) sHtml.append("<td>"+s2+"</td>");
			    sHtml.append("</tr>");
			}else{
			    sHtml.append("<option value='"+s2+"'"+sSel+">"+s1+"</option>");
			}
		}
	}
    return sHtml.toString();
}

/**
* 打开控件自动布局窗口
* added by liuxr at 2008-8-26
**/
function PropWinClickAutoSize()
{
	var arr=new Array();
	arr[0]=fcpubdata.obj[0];
	arr[1]=fcpubdata.obj[2];
	DjOpen("../../fceform/common/djframe.htm?djsn=FormAutoResize&djtype=ST", arr, "展现", "有模式窗口", "直接", "自动布局");
}


/**
*由字段信息串生成建表语句,数据集属性框中要用
*@param stablename 表名
*@param sfieldxml 字段xml串
*@param bAddGzid = true 表示要加上一个挂帐ID字段
*@param bAll = true 表示要取XML串中所有节点值，它用于外面建表
*@param sField = 要增加的字段串
*@return 返回一个建表语句的字符串
*@date 2004-07-30
**/
function GetCreateTable(stablename,sfieldxml,bAddGzid,bAll,sField){
	var sNewLine="\r\n"; //&#13;&#10;
	var sRet=new Sys.StringBuilder();
	var oXml=SetDom(sfieldxml) ;
	//西文字段名0 中文名称1 字段类型2 字段宽度3 字段精度4 
	var l=oXml.documentElement.childNodes.length-1 ;
	if(bAll) l++;
	var sF="";
	var autoFieldName = "";
	//处理自动编号,
	if(fcpubdata.area.idtype== "2" ){
	var oDsMain = $id(fcpubdata.dsMain);
	if(oDsMain != null ){
		if(oDsMain.saveastable == stablename){
			autoFieldName =  fcpubdata.area.keyfield ;
		}
	}
	}
	for(var j=0;j<l;j++){
		sF+=oXml.documentElement.childNodes(j).childNodes(0).text;
		var stype=oXml.documentElement.childNodes(j).childNodes(2).text;
		var slen=oXml.documentElement.childNodes(j).childNodes(3).text;
		var sDot=oXml.documentElement.childNodes(j).childNodes(4).text;
		if(oXml.documentElement.childNodes(j).childNodes(0).text == autoFieldName && autoFieldName != ""){
			sF += " int IDENTITY (1, 1) NOT NULL , ";
		}else if(stype=="整数"){
			sF+=" integer null ,";
				
		}else if(stype=="实数"){
			sF+=" decimal("+slen+","+sDot+") null ," ;
		}else if(stype=="文本"){
			sF+=" text null ," ;
		}else if(stype=="图象"){
			sF+=" image null ," ;
		}else if(stype=="日期"){
			sF+=" datetime null ," ;
		}else{
			sF+=" varchar("+slen+") null ," ;
		}
	}
	if(IsSpace(sField)==false) sF+=sField;
	if(bAddGzid) {
		sF += "GZID varchar(11) null " ;
	} else {		
		sF=sF.substring(0,sF.length-1)+sNewLine;
	}
	sRet.append("if exists(select * from sysobjects where name='"+stablename+"')"+sNewLine) ;
	sRet.append(" drop table "+stablename+" "+sNewLine +";") ; 
	sRet.append("create table "+stablename+" ("+sNewLine); 
	sRet.append(sF+")"+sNewLine );
	return sRet.toString() ;

}
/**
//由数据集自动建数据库的表
*@para oDs 要建表的数据集对象
*@param sField = 要增加的字段串
*@return "" 表示建表成功。否则为错误信息
*@date 2006-04-26
**/
function DsCreateTable(oDs,sField) {
	var DsMain=$id("DsMain");
	if(typeof oDs != "undefined") DsMain=oDs;
	var sql = GetCreateTable(DsMain.saveastable,DsMain.formatxml,false,true,sField) ;
	var arr = sql.split(";") ;
	var l =  arr.length ;
	var sRet = new Sys.StringBuilder() ;
	for(var i=0;i<l;i++){
		var s1 = new Eapi.Str().trim(arr[i]) 
		if(IsSpace(s1) == false ){
			sRet.append("<no>" + s1 + "</no>") ;
		}
	}
	if(sRet.toString() != "" ){
		var s = InsertSqls(sRet.toString())
		if(IsSpace(s)){
			return "";
		}else{
			return s ;
		}
	}

}
/**
* e表中用的转换函数
*@date 2006-06-12
**/
function e_ConvertDataTypeToValue(chnName) {
	var ret=9 ;
	
	switch (chnName){
		case "整数" :	ret=17;break;
		case "实数" :	ret=19;break;
		case "字符串" :	ret=6;break;
		case "日期" :	ret=2;break;
		case "时间" :	ret=3;break;
		case "日期时间" :	ret=4;break;
		case "布尔" :	ret=5;break;
		case "整数组" :	ret=273;break;
		case "实数组" :	ret=275;break;
		case "字符串组" :	ret=262;break;
		case "默认" :	ret=9;break;
		default : ret = chnName; break;
	}
	
	return ret;
}
function e_ConvertDataTypeToName(ivalue) {
	var ret="默认" ;
	
	switch (ivalue){
		case "17" :	ret="整数"; break;
		case "19" :	ret="实数";break;
		case "6" :	ret="字符串";break;
		case "2" :	ret="日期";break;
		case "3" :	ret="时间";break;
		case "4" :	ret="日期时间";break;
		case "5" :	ret="布尔";break;
		case "273" :	ret="整数组";break;
		case "275" :	ret="实数组";break;
		case "262" :	ret="字符串组";break;
		case "9" :	ret="默认";break;
	
	}
	
	return ret;
}
/**
* 取sql语句的字段名列表,以<option>格式
*@date 2006-06-14
**/
function e_GetFieldName(sSql,callback,context) {
	if(typeof sSql == "undefined"  || sSql == "undefined" ) { return "" ;}
	
	//替代非法XML字符
	var sXml="<No>"+RepXml(sSql)+"</No>";
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?GetFieldName",sXml,callback,context);
	return retX;
	//返回的串不带根节点
	//<option>...</option>...
}
/**
* 属性窗口的onload事件中调用。
**/
function e_PropWinOnload() {
//	if(typeof cmdOk == "object")
//		e_SetButtonImage(cmdOk,"../images/ef_run_button_ok1.gif");
//	if(typeof cmdClose == "object")
    //		e_SetButtonImage(cmdClose,"../images/ef_run_button_close1.gif");
    new Eform.SysForm().setButtonImage();
    var bmpPath = "../css/skins/" + fcpubdata.skins + "/images";
    
    var cmdAdd = $id("cmdAdd");
    if (cmdAdd != null) {
        cmdAdd.style.width = "66px";
        cmdAdd.style.height = "21px";
        cmdAdd.className = "buttonadd";
        cmdAdd.attachEvent("onmouseout", function() { cmdAdd.className = 'buttonadd'; });
        cmdAdd.attachEvent("onmouseover", function() { cmdAdd.className = 'buttonadd-over'; });
    }
    if (typeof cmdDel == "object") {
        cmdDel.style.width = "66px";
        cmdDel.style.height = "21px";
        cmdDel.className = "buttondel";
        cmdDel.attachEvent("onmouseout", function() { cmdDel.className = 'buttondel'; });
        cmdDel.attachEvent("onmouseover", function() { cmdDel.className = 'buttondel-over'; });
    }
    if (typeof cmdAdd1 == "object") {
        cmdAdd1.style.width = "66px";
        cmdAdd1.style.height = "21px";
        cmdAdd1.className = "buttonadd";
        cmdAdd1.attachEvent("onmouseout", function() { cmdAdd1.className = 'buttonadd'; });
        cmdAdd1.attachEvent("onmouseover", function() { cmdAdd1.className = 'buttonadd-over'; });
    }
    if (typeof cmdDel1 == "object") {
        cmdDel1.style.width = "66px";
        cmdDel1.style.height = "21px";
        cmdDel1.className = "buttondel";
        cmdDel1.attachEvent("onmouseout", function() { cmdDel1.className = 'buttondel'; });
        cmdDel1.attachEvent("onmouseover", function() { cmdDel1.className = 'buttondel-over'; });
    }
    if (typeof cmdEdit == "object") {
        cmdEdit.style.width = "66px";
        cmdEdit.style.height = "21px";
        cmdEdit.className = "buttonedit";
        cmdEdit.attachEvent("onmouseout", function() { cmdEdit.className = 'buttonedit'; });
        cmdEdit.attachEvent("onmouseover", function() { cmdEdit.className = 'buttonedit-over'; });
    }
    if (typeof cmdAddRow == "object") {
        cmdAddRow.style.width = "75px";
        cmdAddRow.style.height = "21px";
        cmdAddRow.className = "buttonaddrow";
        cmdAddRow.attachEvent("onmouseout", function() { cmdAddRow.className = 'buttonaddrow'; });
        cmdAddRow.attachEvent("onmouseover", function() { cmdAddRow.className = 'buttonaddrow-over'; });
    }
    if (typeof cmdDelRow == "object") {
        cmdDelRow.style.width = "75px";
        cmdDelRow.style.height = "21px";
        cmdDelRow.className = "buttondeleterow";
        cmdDelRow.attachEvent("onmouseout", function() { cmdDelRow.className = 'buttondeleterow'; });
        cmdDelRow.attachEvent("onmouseover", function() { cmdDelRow.className = 'buttondeleterow-over'; });
    }
    if (typeof cmdSave == "object") {
        cmdSave.style.width = "66px";
        cmdSave.style.height = "21px";
        cmdSave.className = "buttonsave";
        cmdSave.attachEvent("onmouseout", function() { cmdSave.className = 'buttonsave'; });
        cmdSave.attachEvent("onmouseover", function() { cmdSave.className = 'buttonsave-over'; });
    }
	if (typeof cmdQuery == "object") {
        cmdQuery.style.width = "66px";
        cmdQuery.style.height = "21px";
        cmdQuery.className = "buttonquery";
        cmdQuery.attachEvent("onmouseout", function() { cmdQuery.className = 'buttonquery'; });
        cmdQuery.attachEvent("onmouseover", function() { cmdQuery.className = 'buttonquery-over'; });
    }
    if (typeof cmdCloseWin == "object") {//关闭按钮
        cmdCloseWin.style.width = "66px";
        cmdCloseWin.style.height = "21px";
        cmdCloseWin.className = "buttonclosewin";
        cmdCloseWin.attachEvent("onmouseout", function() { cmdCloseWin.className = 'buttonclosewin'; });
        cmdCloseWin.attachEvent("onmouseover", function() { cmdCloseWin.className = 'buttonclosewin-over'; });
    }
    if (typeof cmdUpMove == "object") {//上移按钮
        cmdUpMove.style.width = "66px";
        cmdUpMove.style.height = "21px";
        cmdUpMove.className = "buttonupmove";
        cmdUpMove.attachEvent("onmouseout", function() { cmdUpMove.className = 'buttonupmove'; });
        cmdUpMove.attachEvent("onmouseover", function() { cmdUpMove.className = 'buttonupmove-over'; });
    }
    if (typeof cmdDownMove == "object") {//下移按钮
        cmdDownMove.style.width = "66px";
        cmdDownMove.style.height = "21px";
        cmdDownMove.className = "buttondownmove";
        cmdDownMove.attachEvent("onmouseout", function() { cmdDownMove.className = 'buttondownmove'; });
        cmdDownMove.attachEvent("onmouseover", function() { cmdDownMove.className = 'buttondownmove-over'; });
    }
    //fhj2012-08-27
    if (typeof cmdPreview == "object") {//预览
        cmdPreview.style.width = "66px";
        cmdPreview.style.height = "21px";
        cmdPreview.className = "buttonprintpreview";
        cmdPreview.attachEvent("onmouseout", function() { cmdPreview.className = 'buttonprintpreview'; });
        cmdPreview.attachEvent("onmouseover", function() { cmdPreview.className = 'buttonprintpreview-over'; });
    }
    if (typeof cmdPrint == "object") {//打印
        cmdPrint.style.width = "66px";
        cmdPrint.style.height = "21px";
        cmdPrint.className = "buttonselectprint";
        cmdPrint.attachEvent("onmouseout", function() { cmdPrint.className = 'buttonselectprint'; });
        cmdPrint.attachEvent("onmouseover", function() { cmdPrint.className = 'buttonselectprint-over'; });
    }
    if (typeof cmdDirectPrintAll == "object") {//直接打印全部
        cmdDirectPrintAll.style.width = "66px";
        cmdDirectPrintAll.style.height = "21px";
        cmdDirectPrintAll.className = "buttonprintall";
        cmdDirectPrintAll.attachEvent("onmouseout", function() { cmdDirectPrintAll.className = 'buttonprintall'; });
        cmdDirectPrintAll.attachEvent("onmouseover", function() { cmdDirectPrintAll.className = 'buttonprintall-over'; });
    }
    if (typeof cmdFirstPage == "object") {//第一页
        cmdFirstPage.style.width = "66px";
        cmdFirstPage.style.height = "21px";
        cmdFirstPage.className = "buttonfirstpage";
        cmdFirstPage.attachEvent("onmouseout", function() { cmdFirstPage.className = 'buttonfirstpage'; });
        cmdFirstPage.attachEvent("onmouseover", function() { cmdFirstPage.className = 'buttonfirstpage-over'; });
    }
    if (typeof cmdUpPage == "object") {//上一页
        cmdUpPage.style.width = "66px";
        cmdUpPage.style.height = "21px";
        cmdUpPage.className = "buttonuppage";
        cmdUpPage.attachEvent("onmouseout", function() { cmdUpPage.className = 'buttonuppage'; });
        cmdUpPage.attachEvent("onmouseover", function() { cmdUpPage.className = 'buttonuppage-over'; });
    }
    if (typeof cmdDownPage == "object") {//下一页
        cmdDownPage.style.width = "66px";
        cmdDownPage.style.height = "21px";
        cmdDownPage.className = "buttondownpage";
        cmdDownPage.attachEvent("onmouseout", function() { cmdDownPage.className = 'buttondownpage'; });
        cmdDownPage.attachEvent("onmouseover", function() { cmdDownPage.className = 'buttondownpage-over'; });
    }
    if (typeof cmdLastPage == "object") {//最后页
        cmdLastPage.style.width = "66px";
        cmdLastPage.style.height = "21px";
        cmdLastPage.className = "buttonlastpage";
        cmdLastPage.attachEvent("onmouseout", function() { cmdLastPage.className = 'buttonlastpage'; });
        cmdLastPage.attachEvent("onmouseover", function() { cmdLastPage.className = 'buttonlastpage-over'; });
    }  

}
/**
*设置按钮为图形按钮
  obutton.style.backgroundImage="url(../image/b5_cancel.gif)" ;
*@date 2004-02-16
**/
function e_SetButtonImage(sbutton,spathgif) {
  var obutton=eval(sbutton);
  obutton.style.backgroundImage="url("+spathgif+")" ;
  obutton.style.cursor="hand" ;
  obutton.style.borderTop ="";
  obutton.style.borderBottom ="";
  obutton.style.borderLeft ="";
  obutton.style.borderRight ="";
  //obutton.onmouseout=function func_onmouseout() { this.style.color="black";};
  //obutton.onmouseover=function func_onmouseover() {	this.style.color="red";};


}
/**
* 报表参数表单上的运行查询函数
*@return "" 表示成功运行,否则为错误信息.
*@date 2007-01-24
**/
function EbiaoRunQuery(){
	//ActEbiaoPara();
	var owin ;
	var owin1 = window.dialogArguments;
	var s1 = "";
	if(typeof  owin1 != "undefined"){
		s1 = owin1.sPubDjContent ; 
	}
	if(IsSpace(s1)){
		owin = parent ;
	}else{
		owin = owin1 ;
	}
	if(ActEbiaoPara(owin)==false) return ; //因为还有一处调用此函数是用execScript调用的,它无法返回,它是在一开始运行报表时调用.
	//owin.toolbar.execScript("RunReport(curPageNo,'从参数表单上运行');");
	$win("toolbar", owin).eval("RunReport(curPageNo,'从参数表单上运行');");
	
	if(IsSpace(s1) ==false ){
		window.close();
	}

}
/**
* 处理报表参数
**/
function ActEbiaoPara(oWin){
	if(typeof oWin == "undefined") oWin = parent;
	
	var sxml = oWin.oPubXmlFile.documentElement.getAttribute("e_argsbak");
	
	if(IsSpace(sxml)){
		alert("没有报表参数!");
		return false;
	}
	var oX = SetDom("<root>"+unescape(sxml)+"</root>");
	//alert(unescape(sxml));
	var oWinToolbar = $win("toolbar", oWin);
	var newPara=new Sys.StringBuilder();
	var basePara = oWinToolbar.pubBasePara; //初值为url上的参数
	var sMsg = "";
	for(var i=0;i<oX.documentElement.childNodes.length;i++){
		var objid = oX.documentElement.childNodes[i].childNodes[4].text;
		if(IsSpace(objid)) continue; //表示此报表参数没有绑定到表单中的控件上
		var curParaValue = oX.documentElement.childNodes[i].childNodes[5].text;

		var objValue = "";
		var objHtml = $id(objid);
		if (objHtml != null) {
		    if (objHtml.getAttribute("controltype") == "dropdownlist") {
		        objValue = $obj(objid).value;
		    } else {
		        objValue = objHtml.value;
		    }
		} 

		if(typeof objValue == "undefined") objValue = "";
		//需要检查控件上的值是否合法.
		switch (oX.documentElement.childNodes[i].childNodes[2].text){ //数据类型
			case "整数" : {
				if(IsInt(objValue) == false){
					sMsg = 	oX.documentElement.childNodes[i].childNodes[1].text + "的值不是整数!";
					alert(sMsg);
					return false;	
				}
				break;
			}
			case "实数" : {
				if(IsNum(objValue) == false){
					sMsg = 	oX.documentElement.childNodes[i].childNodes[1].text + "的值不是实数!";
					alert(sMsg);
					return false;	
				}
				break;
			}
			case "字符串" : {
				var swidth = oX.documentElement.childNodes[i].childNodes[3].text;
				if(IsSpace(swidth) == false){
					if(objValue.length > ToInt(swidth)){
						sMsg = 	oX.documentElement.childNodes[i].childNodes[1].text + "的长度超长!";
						alert(sMsg);
						return false;	
					}
				}
				break;
			}		

				
		}
		curParaValue = objValue;
		//alert(curParaValue);
		
		var tmp1 = "&"+oX.documentElement.childNodes[i].childNodes[0].text+"=" ;
		//只有当url中不含有此参数的值时才加入
		//var posStart = basePara.indexOf(tmp1);
		//if(isQueryButton || posStart < 0){
			var tempParamValue = escape(curParaValue);
			if(fcpubdata.dotnetVersion=="") tempParamValue = escape(tempParamValue);
			newPara.append( tmp1+tempParamValue);
		
		/*}
		if(isQueryButton && posStart >= 0){
		    var sEnd="";
            var posEnd = basePara.indexOf("&",posStart+tmp1.length);
            if(posEnd >= 0) sEnd = basePara.substring(posEnd);
            basePara = basePara.substring(0,posStart)+sEnd;
		}*/
	}
	//alert(newPara);
	//oWin.toolbar.pubBasePara = basePara ;
	oWinToolbar.pubPara = newPara.toString();
	oWinToolbar.cacheId = ""; //改变了参数应清空cache
	//alert(parent.toolbar.pubPara);
	//if(sTag != "只计算参数"){
	//	parent.toolbar.execScript("RunReport(curPageNo,'改变参数');");
	//}
	return true;
}

/**
* 清空元素的背景色
*@date 2006-12-20
**/
function ClearBgColor(obj) {
	obj.style.backgroundColor = "transparent";
}
/**
* 只用于数据集的打开之前的事件中,用它来处理查询条件
*@date 2006-12-26
**/
function ActionQueryCond() {
	var sql = "";
	for(var i=0;i<DsMain.Fields.Field.length;i++){
		if(IsSpace(DsMain.Field(i).Value) == false){
			sql += DsMain.Field(i).FieldName + "='" + DsMain.Field(i).Value + "' and ";
		}
	}
	if(sql != "") sql = " where " + sql.substring(0,sql.length-4);
	PubQueryGridDs.opensql = "select * from " + DsMain.saveastable + sql;
}
/**
//取页面所有的控件ID，控件绑定的字段，字段的长度及字段的类型组成XML串
<info><contid></contid><dataset></dataset><fieldname></fieldname><datatype></datatype><displaylabel></displaylabel><size></size><precision></precision></info>

*@date 2007-11-1
**/
function GetBindInfos(){
	var sRet = new Sys.StringBuilder();
	var l = oContXml.documentElement.childNodes.length;
	for(var i=0;i<l;i++){
		if(IsBindContType(oContXml.documentElement.childNodes(i).nodeName)){
			var oSub = oContXml.documentElement.childNodes(i);
			for(var j=0;j<oSub.childNodes.length;j++){
				var sId = oSub.childNodes(j).text;
				var oId = $id(sId);
				var sDs = oId.dataset;
				var sField = oId.field;
				if(IsSpace(sDs) || IsSpace(sField)) continue;
				var fieldInfos = GetFieldInfos(sDs,sField) ;
				if(fieldInfos != ""){
					sRet.append( "<info><contid>"+sId+"</contid><dataset>"+sDs+"</dataset>" +fieldInfos +"</info>");
					
				}
			}
		}
	}
	return sRet.toString();
	
	function IsBindContType(typeName){
		var ArrName=new Array();
		ArrName[0]="checkbox";
		ArrName[1]="radio" ;
		ArrName[2]="listbox"
		ArrName[3]="textarea"
		ArrName[4]="combobox"
		ArrName[5]="dbimg";
		ArrName[6]="text" ;
		ArrName[7]="dropdownlist";
		ArrName[8]="spin";
		for(var i=0;i<ArrName.length;i++){
			if(typeName == ArrName[i]) return true;
		}
		return false;
	}
	
	function GetFieldInfos(sDs,sField){
		var sFormat=new Sys.StringBuilder();
		var oXml=SetDom($id(sDs).formatxml); 
		var l=oXml.documentElement.childNodes.length;
		for(var i=0;i<l;i++){
			var fdname=oXml.documentElement.childNodes(i).childNodes(0).text;
			if(fdname == sField) { 
				var datatype=oXml.documentElement.childNodes(i).childNodes(2).text;
				var displaylabel=oXml.documentElement.childNodes(i).childNodes(1).text;
				var size=oXml.documentElement.childNodes(i).childNodes(3).text;
				var precision=oXml.documentElement.childNodes(i).childNodes(4).text;
				sFormat.append("<fieldname>"+fdname+"</fieldname>");
				sFormat.append("<datatype>"+datatype+"</datatype>");
				sFormat.append("<displaylabel>"+displaylabel+"</displaylabel>");
				sFormat.append("<size>"+size+"</size>");
				sFormat.append("<precision>"+precision+"</precision>");
				break;
			}
		}
		return sFormat.toString();
		
	}
}


Eapi.DbStru = function(){}
Eapi.DbStru.prototype =
{
    listTables : function(oCont){
        if(oCont.tagName.indexOf("dataset")>=0)
            this._listTablesToGrid(oCont);
        else
            this._listTablesToDropdownlist(oCont);
    },
    _listTablesToGrid : function(dsGrid){
	    if(fcpubdata.dbStruDict == ""){
		    new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=GetAllTables","<returnType>dataset</returnType><sFilter></sFilter>",
			    function (result){
				    var retX = result.value;
				    var obj = result.context;
				    obj.OpenXmlData(retX);
			    }
		    ,dsGrid);
	    }else {
		    var sql = "select tbname,chnname from FC_TBLIST order by tbname";
		    if(fcpubdata.dbStruDict == "FC_DBSTRU") sql = "select distinct tbname,tbchnname as chnname from FC_DBSTRU order by tbname";	
		    if(fcpubdata.dbStruDict == "FC_ENTITY") sql = "select distinct tbname,tbchnname as chnname from FC_ENTITY order by tbname";	
		    dsGrid.Open(sql,"nouse",function (){});		
	    }

    },
    _listTablesToDropdownlist : function (cboTableName) {
        ///用dropdownlist来选择表名, dropdownlist1.onclickopen=
        ///@date 2008-02-21
	    cboTableName.onclickopen = function (){
	        if(fcpubdata.dbStruDict == "FC_FLDLIST"){
		        cboTableName.sql1 = "select tbname,chnname from FC_TBLIST where tbname like ':v_get%' order by tbname";
	        }else if(fcpubdata.dbStruDict == "FC_DBSTRU"){
		        cboTableName.sql1 = "select distinct tbname,tbchnname as chnname from FC_DBSTRU where tbname like ':v_get%' order by tbname";
	        }else if(fcpubdata.dbStruDict == "FC_ENTITY"){
		        cboTableName.sql1 = "select distinct tbname,tbchnname as chnname from FC_ENTITY where tbname like ':v_get%' order by tbname";
	        }else if(fcpubdata.dbStruDict == ""){
		        cboTableName.xml = new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=GetAllTables","<returnType>dropdownlist</returnType><sFilter>"+new Eapi.Str().trim(cboTableName.value)+"</sFilter>");
	        }
	    }
    },
    listFields : function(tableName,oCont){
        if(oCont.tagName.indexOf("dataset")>=0)
            this._listFieldsToGrid(tableName,oCont);
        else
            this._listFieldsToDropdownlist(tableName,oCont);
    },
    _listFieldsToGrid : function(tableName,dsGrid){
        var sql= "";
        if(fcpubdata.dbStruDict=="FC_DBSTRU"){
            sql = "select * from FC_DBSTRU where tbname='"+tableName+"' order by fdname";
        }else if(fcpubdata.dbStruDict=="FC_ENTITY"){
            sql = "select * from FC_ENTITYSUB where tbname='" + tableName.toUpperCase() + "' order by fdname";
        }else if(fcpubdata.dbStruDict=="FC_FLDLIST"){
            var s="fdname";
            var s1="tbname";
            if(fcpubdata.databaseTypeName == "oracle") {
	             s = "upper(new Eapi.Str().trim(fdname))";
	             s1 = "new Eapi.Str().trim(tbname)"
            }   		 
            sql="select * from FC_FLDLIST where "+s+" in (select "+s+" from FC_TBSTRU where "+s1+"='"+ tableName + "') order by fdname " ;
            if(fcpubdata.databaseTypeName == "mysql"){
   		        sql = "select a.* from FC_FLDLIST a ,FC_TBSTRU b where a.fdname=b.fdname and b.tbname='"+ tableName + "' order by a.fdname" ;
   	        }
   	    }
   	    if(fcpubdata.dbStruDict==""){
            var retX = new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=GetFieldName","<sql></sql><returnType>dataset</returnType><tableName>"+tableName+"</tableName>");
            dsGrid.OpenXmlData(retX);   	        
   	    }else{
   	        dsGrid.Open(sql);
   	    }

    },
    _listFieldsToDropdownlist : function(tableName,cboFields){
        var sql= "";
        if(fcpubdata.dbStruDict=="FC_DBSTRU"){
            sql = "select fdname,chnname from FC_DBSTRU where tbname='"+tableName+"' order by fdname";
        }else if(fcpubdata.dbStruDict=="FC_ENTITY"){
            sql = "select fdname,chnname from FC_ENTITYSUB where tbname='" + tableName.toUpperCase() + "' order by fdname";
            
        }else if(fcpubdata.dbStruDict=="FC_FLDLIST"){
            var s="fdname";
            var s1="tbname";
            if(fcpubdata.databaseTypeName == "oracle") {
	             s = "upper(new Eapi.Str().trim(fdname))";
	             s1 = "new Eapi.Str().trim(tbname)"
            }   		 
            sql="select fdname,chnname from FC_FLDLIST where "+s+" in (select "+s+" from FC_TBSTRU where "+s1+"='"+ tableName + "') order by fdname " ;
            if(fcpubdata.databaseTypeName == "mysql"){
   		        sql = "select a.fdname,a.chnname from FC_FLDLIST a ,FC_TBSTRU b where a.fdname=b.fdname and b.tbname='"+ tableName + "' order by a.fdname" ;
   	        }
   	    }
   	    if(cboFields.tagName.toUpperCase() == "SELECT"){
   	        if(fcpubdata.dbStruDict==""){
                var sOption = new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=GetFieldName","<sql>select * from "+tableName+"</sql><returnType>option</returnType><tableName></tableName>");
   	            cboFields.outerHTML = SelectAddOption(cboFields,sOption);
   	        }else{
   	            SqlCombo(cboFields, sql);
   	        }
   	    }else{
   	        if(fcpubdata.dbStruDict==""){
                cboFields.xml = new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=GetFieldName","<sql>select * from "+tableName+"</sql><returnType>dropdownlist</returnType><tableName></tableName>");
   	        }else{
   	            cboFields.sql1 = sql;
   	        }
        }
    }
    
}
if(Type.parse("Eapi.DbStru") == null) Eapi.DbStru.registerClass("Eapi.DbStru");

//生成sql语句
function MakeSaveSql(WizardConfig) 
{
    var xmlsqlNot = false;//oracle修改字段名不需要最后的xmlsql语句格式 ，自己写了一个修改xml串格式
    var sXml1 = "";
	var type="alter";
	//if(WizardConfig.isNull=="是" || WizardConfig.editTag !="null") type = "create";
	var arr = new Array();
	arr[0] = WizardConfig.fdname + " " + WizardConfig.dataType;
	arr[1] = WizardConfig.fdname + " " + WizardConfig.dataType + "(" + WizardConfig.len + "," + WizardConfig.dotLen +")";
	arr[2] = WizardConfig.fdname + " " + WizardConfig.dataType + "(" + WizardConfig.len + ")";
	//var modifySign = sqldatamodify(WizardConfig);//直接修改返回1，删除再新增返回2
	var sStart = " add ";
	//if (WizardConfig.editTag == "1") sStart = " (";//不判断增加表
	if (WizardConfig.editTag == "3") {
	    if (fcpubdata.databaseTypeName == "oracle") { // fhj2011-09-05 如果是oracle数据库修改数据类型用modify
	        if (WizardConfig.dataType != WizardConfig.oldDataType) {//如果修改时没有执行修改类型，就不需要最后的xmlsql语句
	            sStart = " modify ";
	        } else { xmlsqlNot = true }
	    } else if(fcpubdata.databaseTypeName == "sqlserver"){
	        if (WizardConfig.fdname != WizardConfig.oldFdname) {//如果sqlserver修改字段名先删除后修改
	                sXml1 = "<alter tableName='" + WizardConfig.tbname + "'><detail> drop column " + WizardConfig.oldFdname + "\n</detail></alter>";
	        } else { sStart = " alter column "; }
	    } 
	}
	var sEnd = "";
	//不用弄下面的,因为要加not null的字段的话,就需要指定默认值.
	//if (WizardConfig.isNull == "是") sEnd = " NOT NULL ";
	//if (WizardConfig.type == "查找关系" || WizardConfig.type == "主从信息表" || WizardConfig.type == "ID字段" || WizardConfig.type == "自动编号") sEnd = " NOT NULL ";
	//if (WizardConfig.editTag == "1") sEnd = " NULL );";
	//if (WizardConfig.editTag == "2") sEnd = " NULL );";
	var dataSign =sqldatatype(WizardConfig.dataType);//固定长度返回1，带小数返回2，其他返回3	
	var sDetail=sStart+arr[dataSign-1]+sEnd;
	if(WizardConfig.idType==2) {sDetail="add "+  WizardConfig.fdname + " int   identity(1,1)" };
	//CopyToPub(sDetail)
    //var sXml1="";
    /*ifif (WizardConfig.editTag == "3" && modifySign == 2)
    sXml1 = "<alter tableName='"+WizardConfig.tbname+"'><detail> drop column " + WizardConfig.oldFdname + "\n</detail></alter>";
    sXml1+="<"+type+" tableName='"+WizardConfig.tbname+"'><detail>"+sDetail+"</detail></"+type+">";//*/

    if (WizardConfig.editTag == "3" && WizardConfig.fdname != WizardConfig.oldFdname && fcpubdata.databaseTypeName == "oracle") {//fhjoracle数据库修改字段名
        sXml1 = "<alter tableName='" + WizardConfig.tbname + "'><detail> rename   column  " + WizardConfig.oldFdname + " to  " + WizardConfig.fdname + "</detail></alter>";
    }
    if (xmlsqlNot == false) {//oracle修改字段名不正此处处理，true是修改字段名
        sXml1 += "<" + type + " tableName='" + WizardConfig.tbname + "'><detail>" + sDetail + "</detail></" + type + ">";
    }
	//CopyToPub(sXml1);
	//alert(sXml1);
	return sXml1;
	//doSaveData(sXml);
	
	
	
	function sqldatatype()//固定长度返回1，带小数返回2，其他返回3
	{
		var s = WizardConfig.dataType;
		var i = 0;
		var guding = new Array("datetime", "int", "text", "image", "date", "blob", "timestamp", "number", "integer","clob"); //固定长度的列数据类型，fhj增加了"bolb", "timestamp", "number", "integer"
		var xiaoshu = new Array("decimal");//带小数的列数据类型
		var qita = new Array("char", "varchar", "varchar2", "nvarchar", "nvarchar2"); //其他fhj增加了"varchar2" ,"nvarchar", "nvarchar2"
		for (i = 0; i < guding.length; i++)
		{
			if (s == guding[i])return 1;
		}
		for (i=0;i<xiaoshu.length;i++)
		{
			if (s == xiaoshu[i])return 2;
		}
		for (i=0;i<qita.length;i++)
		{
			if (s == qita[i])return 3;
		}
			alert("未知的数据类型!");
			return 0;
	}
		
	/*function sqldatamodify(WizardConfig)//直接修改返回1，删除再新增返回2
	{
		var ndt = WizardConfig.dataType;
		var odt = WizardConfig.oldDataType;
		/*if (ndt == odt && ndt == "decimal")return 2;
		else if (WizardConfig.fdname != WizardConfig.oldFdname)return 2;
		else if (odt == ndt && WizardConfig.len<WizardConfig.oldLen)return 2;
		else if (odt == ndt && WizardConfig.len>=WizardConfig.oldLen)return 1;
		else if (ndt == odt)return 1;
		else if (odt == "text" || odt =="image")return 2;
		else if (ndt == "char" || ndt == "varchar")return 1;
		else if (odt == "int" && (ndt == "decimal" || ndt == "datetime"))return 1;
		else if (odt == "decimal" && (ndt == "int" || ndt == "datetime"))return 1;
		else if ((odt == "char" || odt == "varchar") && (ndt == "text" || ndt == "image"))return 1;
		
	}//*/
}
/**
* 默认公式，读出时转换，保存前转换
**/

function PropWinFx(txtObj, tbName) {
    var sOption = "";
    if (IsSpace(tbName) == false) {
        var sql = "select fdname,chnname from fc_entitysub where tbname ='" + tbName + "'";
        sOption = fillcombox(sql);
    }
    var sRet = DjOpen("../../fceform/common/djframe.htm?djsn=js_fx&djtype=ST", [sOption, txtObj.value], "展现", "有模式窗口", "直接", "设置表达式");
    if (IsSpace(sRet) == false) {
        txtObj.value = sRet;
        txtObj.fireEvent("onchange");
    }
}

/**
* fhj2012-05-29向导打开字段类型表单时赋值 
**/
function PropWinOpenConfig(objNav) {
    new Eform.SysForm().setButtonImage();
    objNav.config = parent.parent.toolbar.WizardConfig;

   if ($id("tbname") != null) {
        SetTextValue(objNav.config.tbname, $id("tbname"));
    }

    /*if ($id("type") != null) {
        SetTextValue(objNav.config.type, $id("type"));
    }*/

    if ($id("labTbname") != null) {
        $id("labTbname").innerText = "表名：" + objNav.config.tbname + ",字段类型：" + objNav.config.type;
    }

    if ($id("fdname") != null) {
        if (objNav.config.type == "删除标记" || objNav.config.type == "顺序号" || objNav.config.type == "所有者ID" || objNav.config.type == "组织全路径") {
            if (objNav.config.type == "删除标记" ) objNav.config.fdname = "deleteMark";
            if (objNav.config.type == "顺序号") objNav.config.fdname = "sortNo";
            if (objNav.config.type == "所有者ID") objNav.config.fdname = "ownerId";
            if (objNav.config.type == "组织全路径") objNav.config.fdname = "allPath";
            $id("fdname").readOnly = true;
        }
        SetTextValue(objNav.config.fdname, $id("fdname"));
    }

    if ($id("fdchnname") != null) {
        if (objNav.config.type == "删除标记" || objNav.config.type == "顺序号" || objNav.config.type == "所有者ID" || objNav.config.type == "组织全路径") {
            if (objNav.config.type == "删除标记") objNav.config.fdchnname = "删除标记";
            if (objNav.config.type == "顺序号") objNav.config.fdchnname = "顺序号";
            if (objNav.config.type == "所有者ID") objNav.config.fdchnname = "所有者ID";
            if (objNav.config.type == "组织全路径") objNav.config.fdchnname = "组织全路径";
            $id("fdchnname").readOnly = true;
        }
        SetTextValue(objNav.config.fdchnname, $id("fdchnname"));
    }

    if ($id("helpText") != null) {
        SetTextValue(objNav.config.helpText, $id("helpText"));
    }

    if ($id("readTrans") != null) {
        SetTextValue(objNav.config.readTrans, $id("readTrans"));
    }

    if ($id("saveTrans") != null) {
        SetTextValue(objNav.config.saveTrans, $id("saveTrans"));
    }

    if ($id("lblTitle") != null) {
        lblTitle.fieldPowerXmlSet = objNav.config.permitSet;
    }

    if ($id("width") != null) {
        SetTextValue(objNav.config.width, $id("width"));
    }

    if ($id("height") != null) {
        SetTextValue(objNav.config.height, $id("height"));
    }

    if ($id("len") != null) {//没有值，使用默认值，所以没使用SetTextValue方法赋值
        if (IsSpace(objNav.config.len) == false) $id("len").value = objNav.config.len;
    }

    if ($id("defaultExp") != null) {
        if (IsSpace(objNav.config.defaultExp) == true && objNav.config.type == "顺序号") objNav.config.defaultExp = "getMaxIntNo('SOR')";
        if (IsSpace(objNav.config.defaultExp) == true && objNav.config.type == "删除标记") {
            $id("defaultExp").value = 0;
        } else {
            SetTextValue(objNav.config.defaultExp, $id("defaultExp"));
        }
    }

    if ($id("queryExp") != null) {
        SetTextValue(objNav.config.queryExp, $id("queryExp"));
    }
    if ($id("isNull") != null) {
        SetCheckBoxValue($id("isNull"), objNav.config.isNull);
    }

    if ($id("isRepeat") != null) {
        SetCheckBoxValue($id("isRepeat"), objNav.config.isRepeat);
    }

    if ($id("selectFunction") != null) {
        SetTextValue(objNav.config.selectFunction, $id("selectFunction"));
    }

    if ($id("listText") != null) {
        SetTextValue(objNav.config.listText, $id("listText"));
    }

    if ($id("listValue") != null) {
        SetTextValue(objNav.config.listValue, $id("listValue"));
    }

    if ($id("isTree") != null) {
        SetCheckBoxValue($id("isTree"), objNav.config.isTree);
    }

    if ($id("isInput") != null) {
        SetCheckBoxValue($id("isInput"), objNav.config.isInput);
    }

    if ($id("isOther") != null) {
        SetCheckBoxValue($id("isOther"), objNav.config.isOther);
    }

    if ($id("colsNum") != null) {
        if (!IsSpace(objNav.config.colsNum)) colsNum.value = objNav.config.colsNum;
    }
 
    if ($id("dictType") != null) {
        SetTextValue(objNav.config.dictType, $id("dictType"));
    }

    if ($id("contComputer") != null) {
        if (IsSpace(objNav.config.contComputer) == false) {
            SetRadioValue($id("contComputer"), objNav.config.contComputer);
        }
    }
    if ($id("isSamePhone") != null) {//fhj 2013-03-09 0/1 表示手机上的配制是否和电脑上一样
        if (IsSpace(objNav.config.isSamePhone) == false)
            SetCheckBoxValue($id("isSamePhone"), objNav.config.isSamePhone);
    }

    if ($id("contPhone") != null) {
        if (IsSpace(objNav.config.contPhone) == false)
        
            SetTextValue(objNav.config.contPhone, $id("contPhone"));
    }

    if ($id("isConst") != null) {
        if (IsSpace(objNav.config.isConst) == false) {
            SetRadioValue($id("isConst"), objNav.config.isConst);
        }
    }

    if ($id("subType") != null) {
        if (IsSpace(objNav.config.subType) == false)
            SetRadioValue($id("subType"), objNav.config.subType);
    }

    if ($id("mainTableName") != null) {
        if (IsSpace(objNav.config.mainTableName) == false)
            SetTextValue(objNav.config.mainTableName, $id("mainTableName"));
    }

    if ($id("mainTableFieldName") != null) {
        if (IsSpace(objNav.config.mainTableFieldName) == false)
            SetTextValue(objNav.config.mainTableFieldName, $id("mainTableFieldName"));
    }

    if ($id("linkFdChnName") != null) {
        if (IsSpace(objNav.config.linkFdChnName) == false)
            SetTextValue(objNav.config.linkFdChnName, $id("linkFdChnName"));
    }

    if ($id("returnType") != null) {
        if (IsSpace(objNav.config.returnType) == false) {
            SetTextValue(objNav.config.returnType, $id("returnType"));
        }
    }

    if ($id("permitDs") != null) {
        if (objNav.config.isFirstEnter == true) {
            var fdPermitSql = " select hide,readonly from fc_fieldpermit where tbname='" + objNav.config.tbname + "' and fdname='" + objNav.config.fdname + "'";
            var retXml = SelectSql(fdPermitSql, 1, 1);
            var oXml = SetDom(retXml);
            if (oXml.documentElement == null) {
                parent.parent.toolbar.execScript("new Eform.Wizard().disabledButton();")
                alert(retXml);
                return;
            }
            if (oXml.documentElement.childNodes.length < 1) {
                parent.parent.toolbar.execScript("new Eform.Wizard().disabledButton();");
                objNav.config.isFirstEnter = false;
                return;
            }
            var hide = oXml.documentElement.childNodes[0].childNodes[0].text;
            var readonly = oXml.documentElement.childNodes[0].childNodes[1].text;
            if (IsSpace(hide) == false) {
                hide = addChnname(hide);
                objNav.config.fdHide = hide;
                permitDs.Field("valueHide").Value = hide;
            }
            if (IsSpace(readonly) == false) {
                readonly = addChnname(readonly);
                objNav.config.fdReadonly = readonly;
                permitDs.Field("valueDisable").Value = readonly;
            }
            objNav.config.isFirstEnter = false;
        } else {
            if (IsSpace(objNav.config.fdHide) == false) {
                permitDs.Field('valueHide').Value = addChnname(objNav.config.fdHide);
            }
            if (IsSpace(objNav.config.fdReadonly) == false) {
                permitDs.Field('valueDisable').Value = addChnname(objNav.config.fdReadonly);
            }
        }
    }   
    parent.parent.toolbar.execScript("new Eform.Wizard().disabledButton();")

    /**
    **获取字段只读隐藏权限后，在user或profile节点上添加chnname属性
    ** permitStr xml权限串
    **/
    function addChnname(permitStr) {
        var oXml = SetDom(unescape(permitStr));
        var oNodeUser = oXml.documentElement.selectSingleNode("/root/user");
        var oNodeProfile = oXml.documentElement.selectSingleNode("/root/profile");
        oNodeUser.setAttribute("chnname", new Eapi.CommonPermit().toNameUsers(oNodeUser.text));
        oNodeProfile.setAttribute("chnname", new Eapi.CommonPermit().toNameProfiles(oNodeProfile.text));
        return escape(oXml.xml);
    }
}

/**
* 向导保存当前页前的检查
**/
function PropWinSaveConfig(objNav) {
    if ($id("width") != null) {
        var sValue = new Eapi.Str().trim($id("width").value);
        var sRet = isLayoutValue(sValue, true);
        if (sRet != "") {
            alert("宽度" + sRet);
            return true;
        }
        if (IsSpace(sValue) == false) {
            objNav.config.width = sValue;
        } else {
            objNav.config.width = null;
        }

    }
    if ($id("height") != null) {
        var sValue = new Eapi.Str().trim($id("height").value);
        var sRet = isLayoutValue(sValue, true);
        if (sRet != "") {
            alert("高度" + sRet);
            return true;
        }
        if (IsSpace(sValue) == false) {
            objNav.config.height = sValue;
        } else {
            objNav.config.height = null;
        }
    }

    if ($id("fdname") != null) {
        var sValue = new Eapi.Str().trim($id("fdname").value);
        if (IsSpace(sValue)) {
            alert("字段名称不能为空!");
            return true;
        }
        var sRet = isValidFieldName(sValue);
        if (sRet != "") {
            alert(sRet);
            return true;
        }
        objNav.config.fdname = sValue;
    }

    if ($id("fdname") != null) {
        var sValue = new Eapi.Str().trim($id("fdchnname").value);
        if (IsSpace(sValue)) {
            alert("字段中文名不能为空!");
            return true;
        } else {
            objNav.config.fdchnname = sValue;
        }
    }
    if ($id("defaultExp") != null) {
        var sValue = new Eapi.Str().trim($id("defaultExp").value);
        if (IsSpace(sValue) == false) {
            if (sValue.indexOf('"') != -1) {
                alert("公式默认值不能含有双引号");
                return true;
            } else {
                objNav.config.defaultExp = sValue;
            }
        } else {
            objNav.config.defaultExp = null;
        }
    }

    if ($id("queryExp") != null) {
        var sValue = new Eapi.Str().trim($id("queryExp").value);
        if (IsSpace(sValue) == false) {
            objNav.config.queryExp = sValue;
        } else {
            objNav.config.queryExp = null;
        }
    }

    if ($id("helpText") != null) {
        var sValue = new Eapi.Str().trim($id("helpText").value);
        if (IsSpace(sValue) == false) {
            objNav.config.helpText = sValue;
        } else {
            objNav.config.helpText = null;
        }
    }

    if ($id("len") != null) {
        var sValue = new Eapi.Str().trim($id("len").value);
        var sRet = IsInt(sValue);
        if (sRet != "" && sRet != true) {
            alert("长度" + sRet);
            return true;
        }
        if (IsSpace(sValue) == false) {
            objNav.config.len = sValue;
        } else {
            objNav.config.len = null;
        }
    }

    if ($id("readTrans") != null) {
        var sValue = new Eapi.Str().trim($id("readTrans").value);
        if (IsSpace(sValue) == false) {
            objNav.config.readTrans = sValue;
        } else {
            objNav.config.readTrans = null;
        }
    }

    if ($id("saveTrans") != null) {
        var sValue = new Eapi.Str().trim($id("saveTrans").value);
        if (IsSpace(sValue) == false) {
            objNav.config.saveTrans = sValue;
        } else {
            objNav.config.saveTrans = null;
        }
    }

    if ($id("lblTitle") != null) {
        var sValue = new Eapi.Str().trim(lblTitle.fieldPowerXmlSet);
        if (IsSpace(sValue) == false) {
            objNav.config.permitSet = sValue;
        } else {
            objNav.config.permitSet = null;
        }
    }

    if ($id("isNull") != null) {
        var sValue = new Eapi.Str().trim($id("isNull").value);
        objNav.config.isNull = $id("isNull").value;
    }

    if ($id("isRepeat") != null) {
        var sValue = new Eapi.Str().trim($id("isRepeat").value);
        objNav.config.isRepeat = $id("isRepeat").value;
    }


    if ($id("selectFunction") != null) {
        var sValue = new Eapi.Str().trim($id("selectFunction").value);
        if (IsSpace(sValue) == false) {
            objNav.config.selectFunction = selectFunction.value;
        } else {
            objNav.config.selectFunction = null;
        }
    }

    if ($id("isTree") != null) {
        objNav.config.isTree = $id("isTree").value;
    }

    if ($id("isInput") != null) {
        objNav.config.isInput = $id("isInput").value;
    }

    if ($id("isOther") != null) {
        objNav.config.isOther = $id("isOther").value;
    }
    if ($id("colsNum") != null) {
        objNav.config.colsNum = $id("colsNum").value;
    } 
    
    if ($id("isConst") != null) {
        objNav.config.isConst = $id("isConst").value;
    }

    if ($id("listText") != null && $id("listValue") != null) {
        var sValue = new Eapi.Str().trim($id("listText").value);
        var sValue1 = new Eapi.Str().trim($id("listValue").value);
        if (IsSpace(sValue) == false || IsSpace(sValue1) == false) {
            var ret = checkConstLength();
            if (ret) return true;
            objNav.config.listText = sValue;
            objNav.config.listValue = sValue1;
        }
    }

    if ($id("dictType") != null) {
        var sValue = new Eapi.Str().trim($id("dictType").value);
        if (IsSpace(sValue) == false) {
            objNav.config.dictType = sValue;
        } else {
            objNav.config.dictType = null;
        }
    }

    if ($id("contComputer") != null) {
        objNav.config.contComputer = $id("contComputer").value;
    }

    if ($id("contPhone") != null) {
        objNav.config.contPhone = $id("contPhone").value;
    }

    if ($id("isSamePhone") != null) {// 2013-03-09 0/1 表示手机上的配制是否和电脑上一样
        objNav.config.isSamePhone = $id("isSamePhone").value;
    }

    if ($id("subType") != null) {
        objNav.config.subType = $id("subType").value;
    }

    if ($id("mainTableName") != null) {
        var sValue = new Eapi.Str().trim($id("mainTableName").value);
        if (IsSpace(sValue) == false) {
            objNav.config.mainTableName = $id("mainTableName").value;
        } else {
            alert("表名称不能为空!");
            return true;
        }
    }

    if ($id("mainTableFieldName") != null) {
        var sValue = new Eapi.Str().trim($id("mainTableFieldName").value);
        if (IsSpace(sValue) == false) {
            objNav.config.mainTableFieldName = $id("mainTableFieldName").value;
        } else {
            alert("字段名称不能为空!");
            return true;
        }
    }

    if ($id("linkFdChnName") != null) {
        var sValue = new Eapi.Str().trim($id("linkFdChnName").value);
        if (IsSpace(sValue) == false) {
            objNav.config.linkFdChnName = $id("linkFdChnName").value;
        }else{
            objNav.config.linkFdChnName = null;        	
        }
    }
    
    if ($id("returnType") != null) {
        var sValue = new Eapi.Str().trim($id("returnType").value);
        if (IsSpace(sValue) == false) {
            objNav.config.returnType = sValue;
        } else {
            objNav.config.returnType = null;
        }
    }

    if ($id("permitDs") != null) {
        var sHideValue = new Eapi.Str().trim(permitDs.Field('valueHide').Value);
        if (IsSpace(sHideValue) == false) {
            sHideValue = removeChnname(sHideValue);
            objNav.config.fdHide = sHideValue;
        } else {
            objNav.config.fdHide = "";
        }
        var sDisableValue = new Eapi.Str().trim(permitDs.Field('valueDisable').Value);
        if (IsSpace(sDisableValue) == false) {
            sDisableValue = removeChnname(sDisableValue);
            objNav.config.fdReadonly = sDisableValue;
        } else {
            objNav.config.fdReadonly = "";
        }
    }


    objNav.isOk = true;
    return false;


    /**
    **获取字段只读隐藏权限后，在user或profile节点删除chnname属性
    ** permitStr xml权限串
    **/
    function removeChnname(permitStr) {
        var oXml = SetDom(unescape(permitStr));
        var oNodeUser = oXml.documentElement.selectSingleNode("/root/user");
        var oNodeProfile = oXml.documentElement.selectSingleNode("/root/profile");
        oNodeUser.removeAttribute("chnname");
        oNodeProfile.removeAttribute("chnname");
        return escape(oXml.xml);
    }
}

/**
**fhj设置字段隐藏只读权限
**/
function propWinFieldPermit(permitDs, fieldName) {
    DjOpen("../../fceform/common/djframe.htm?djsn=toolbarPermit&djtype=ST", [permitDs, fieldName], "展现", "有模式窗口", "直接", "选择");
}

/**
* 检查常数选择项的选中值和显示值是否相同
**/
function checkConstLength() {
    var stxt = listText.value.split("\r\n");
    var sval = listValue.value.split("\r\n");
    var slen = stxt.length;
    var lent = sval.length;
    if (IsSpace(listText.value) == false && IsSpace(listValue.value) == false) {
        if (slen != lent) {
            alert("显示值和取值的长度不相等,请修改!");
            return true;
        }
    }
    return false;
}


//这个封装函数把汉字名返回到表单名
function WizardGetFormName(type) {
    var sUrl = "wiz_field_common";
    if (type == "自动编号")
        sUrl = "wiz_field_autonumber";
    if (type == "复选框")
        sUrl = "wiz_field_checkbox";
    if (type == "选项列表")
        sUrl = "wiz_field_combobox";
    if (type == "多选列表")
        sUrl = "wiz_field_select_much";
    if (type == "ID字段")
        sUrl = "wiz_field_id";
    if (type == "图片字段" || type == "大文本")
        sUrl = "wiz_field_bmp";
    if ((type == "币种") || (type == "百分比") || (type == "实数"))
        sUrl = "wiz_field_num";
    if ((type == "公式") || type == ("累计汇总"))
        sUrl = "wiz_field_exp";
    if (type == "取累计汇总")//fhj2012-05-06
        sUrl = "wiz_field_getCollect";

    if (type == "查找关系")
        sUrl = "wiz_field_find";
    if (type == "主从信息表")
        sUrl = "wiz_field_mainsub";
    if (type == "整数")
        sUrl = "wiz_field_int";
    if ((type == "日期") || (type == "日期时间"))
        sUrl = "wiz_field_date";
    if ((type == "URL") || (type == "电子邮件") || (type == "名称")) {
            sUrl = "wiz_field_common";
    }
    if (type == "文本")
        sUrl = "wiz_field_text";

    if (type == "特别格式")
        sUrl = "wiz_field_special_format";
    if (type == "删除标记" || type == "顺序号" || type == "所有者ID" || type == "组织全路径")
        sUrl = "wiz_field_delete_mark";
    return sUrl;
}

function OpenDjWin(sUrl) {
    ///在主页的右下区运行表单
    window.open(sUrl, "rightWin");
}
function metadata_dataset(tableName, sFields, getPart) {
    ///由元数据生成数据集格式串,getPart=="是" 表示返回数据集的中间部分串,getPart == "只读" 表示在只读的列表中用.
    var arrField = new Array();
    var pos = 0;
    //var orgid=getpubvalue("组织.ID");
    var sql = "select fdname,chnname,fdtype,fdsize,fddec,type,detailxml from fc_entitysub where tbname='" + tableName + "' order by fdname";
    var sXml = SelectSql(sql, 1, -1);
    var oXml = SetDom(sXml);
    if (oXml.documentElement == null) throw sXml;
    if (IsSpace(sFields)) {
        for (var i = 0; i < oXml.documentElement.childNodes.length - 1; i++) {
            var oNode = oXml.documentElement.childNodes(i);
            arrField[pos] = _do_one_field(oNode, getPart);
            arrField[arrField[pos]["fdname"]] = arrField[pos];
            pos++;
        }
    } else {
        var arr = sFields.split(",");
        for (var i = 0; i < arr.length; i++) {
            //var oNodeSub = oXml.documentElement.selectSingleNode("/root/record/fc[0][.= '" + arr[i] + "']");
            var oNodeSub = oXml.documentElement.selectSingleNode("/root/record[FDNAME= '" + arr[i] + "' || fdname= '" + arr[i] + "']");

            if (oNodeSub != null) {
                //arrField[pos] = _do_one_field(oNodeSub.parentNode, getPart);
                arrField[pos] = _do_one_field(oNodeSub, getPart);

                arrField[arrField[pos]["fdname"]] = arrField[pos];
                pos++;
            }
        }
    }
    //生成数据集格式串
    var arrColName = ["fdname", "chnname", "fdtype", "fdsize", "fddec", "fieldkind", "defaultvalue", "displayformat", "readonly", "visible", "iskey", "isnull", "valid", "procvalid", "primarykey", "link", "target", "href", "align", "columnwidth", "gettext", "settext", "datavalid", "keydown", "click", "dblclick", "fieldvalid", "tag"];
    var arrColDefaultValue = ["", "", "字符", "50", "", "数据项", "", "", "否", "是", "否", "否", "是", "否", "否", "否", "", "", "left", "80", "", "", "", "", "", "", "", ""];
    var sb = new Sys.StringBuilder("<root>");
    var sbSub = new Sys.StringBuilder("");
    for (var i = 0; i < arrField.length; i++) {
        sbSub.append("<tr>");
        var arrProp = arrField[i];
        for (var j = 0; j < arrColName.length; j++) {
            sbSub.append("<td>");
            var sValue = arrProp[arrColName[j]];
            if (IsSpace(sValue)) sValue = arrColDefaultValue[j];
            sbSub.append(sValue);
            sbSub.append("</td>");
        }
        sbSub.append("</tr>");
    }
    if (getPart == "是" || getPart == "只读") return sbSub.toString();
    sb.append(sbSub);
    var sSets = "<set><pages>0</pages><fields><field><fieldname>fdname</fieldname><datatype>字符</datatype><displaylabel>西文字段名</displaylabel><size>50</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>a</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>是</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>chnname</fieldname><datatype>字符</datatype><displaylabel>中文名称</displaylabel><size>40</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>新建字段</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>是</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>fdtype</fieldname><datatype>字符</datatype><displaylabel>字段类型</displaylabel><size>4</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>字符</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>fdsize</fieldname><datatype>整数</datatype><displaylabel>字段宽度</displaylabel><size>2</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>10</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>fddec</fieldname><datatype>整数</datatype><displaylabel>字段精度</displaylabel><size>2</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>0</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>是</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>fieldkind</fieldname><datatype>字符</datatype><displaylabel>类型</displaylabel><size>12</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>数据项</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>defaultvalue</fieldname><datatype>字符</datatype><displaylabel>默认值</displaylabel><size>2000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>displayformat</fieldname><datatype>字符</datatype><displaylabel>数据格式</displaylabel><size>20</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>readonly</fieldname><datatype>字符</datatype><displaylabel>只读</displaylabel><size>2000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>否</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>visible</fieldname><datatype>字符</datatype><displaylabel>显示</displaylabel><size>2</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>是</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>iskey</fieldname><datatype>字符</datatype><displaylabel>唯一</displaylabel><size>2</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>否</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>isnull</fieldname><datatype>字符</datatype><displaylabel>不能为空</displaylabel><size>2</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>否</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>valid</fieldname><datatype>字符</datatype><displaylabel>常规校验</displaylabel><size>2</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>是</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>procvalid</fieldname><datatype>字符</datatype><displaylabel>过程校验</displaylabel><size>2</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>否</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>primarykey</fieldname><datatype>字符</datatype><displaylabel>主键</displaylabel><size>2</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>否</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>link</fieldname><datatype>字符</datatype><displaylabel>超链接</displaylabel><size>2</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>否</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>target</fieldname><datatype>字符</datatype><displaylabel>窗口</displaylabel><size>10</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>href</fieldname><datatype>字符</datatype><displaylabel>地址</displaylabel><size>500</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>align</fieldname><datatype>字符</datatype><displaylabel>对齐</displaylabel><size>10</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>left</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>columnwidth</fieldname><datatype>字符</datatype><displaylabel>列宽</displaylabel><size>10</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue>80</defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>gettext</fieldname><datatype>字符</datatype><displaylabel>表现数据</displaylabel><size>1000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>settext</fieldname><datatype>字符</datatype><displaylabel>回写数据</displaylabel><size>1000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>datavalid</fieldname><datatype>字符</datatype><displaylabel>数据验证</displaylabel><size>1000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>keydown</fieldname><datatype>字符</datatype><displaylabel>按键事件</displaylabel><size>1000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>click</fieldname><datatype>字符</datatype><displaylabel>鼠标单击</displaylabel><size>1000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>dblclick</fieldname><datatype>字符</datatype><displaylabel>鼠标双击</displaylabel><size>1000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>fieldvalid</fieldname><datatype>字符</datatype><displaylabel>字段数据验证</displaylabel><size>7000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field><field><fieldname>tag</fieldname><datatype>字符</datatype><displaylabel>自定义</displaylabel><size>7000</size><precision>0</precision><fieldkind>数据项</fieldkind><defaultvalue></defaultvalue><displayformat></displayformat><isnull>否</isnull><iskey>否</iskey><valid>否</valid><procvalid>否</procvalid><link>否</link><target>_blank</target><href></href><visible>否</visible><primarykey>否</primarykey><fieldvalid></fieldvalid><tag></tag></field></fields></set>";
    sb.append(sSets);
    sb.append("</root>");
    return sb.toString();

    function _do_one_field(oNode, readOnly) {
        ///readOnly = "只读" 表示在列表式,表格中使用.

        var arrProp = new Array();
        arrProp["fdname"] = oNode.childNodes(0).text;

        arrProp["chnname"] = oNode.childNodes(1).text;
        arrProp["fdtype"] = oNode.childNodes(2).text;
        arrProp["fdsize"] = oNode.childNodes(3).text;
        arrProp["fddec"] = oNode.childNodes(4).text;
        arrProp["type"] = Trim(oNode.childNodes(5).text);
        var sDetailXml = unescape(oNode.childNodes(6).text);
        var oDXml = SetDom("<root>" + sDetailXml + "</root>");
        var sbValid = metadata_type_valid(arrProp["type"]);
        //if(readOnly != "只读"){
        switch (arrProp["type"]) {
            case "ID字段":
                {
                    arrProp["primarykey"] = "是";
                    arrProp["visible"] = "否";
                    break;
                }
            case "自动编号":
                {
                    //产生默认值
                    var oNode = oDXml.documentElement.selectSingleNode("/root/showFormat");
                    if (oNode != null) {
                        if (IsSpace(oNode.text) == false) {
                            arrProp["fieldkind"] = "变量默认值";
                            arrProp["defaultvalue"] = "getAutoNum('" + oNode.text + "')";
                        }
                    }
                    arrProp["readonly"] = "是";
                    break;
                }
            case "名称":
            case "文本":
            case "文本区":
            case "整数":
            case "实数":
            case "日期":
            case "日期时间":
            case "百分比":
            case "币种":
            case "URL":
            case "电子邮件":
            case "电话":
            case "邮编":
            case "身份证号":
            case "QQ号":
                {
                    //是否不能为空
                    var oNode = oDXml.documentElement.selectSingleNode("/root/isNull");
                    if (oNode != null) {
                        if (oNode.text == "是") {
                            arrProp["isnull"] = "是";
                        }
                    }
                    //是否必须唯一
                    var oNode = oDXml.documentElement.selectSingleNode("/root/isRepeat");
                    if (oNode != null) {
                        if (oNode.text == "是") {
                            sbValid.append("$valid('字段值不重复');");
                            sbValid.append("$valid('值已存在');");
                        }
                    }
                    //公式默认值
                    var oNode = oDXml.documentElement.selectSingleNode("/root/defaultExp");
                    if (oNode != null) {
                        if (IsSpace(oNode.text) == false) {
                            arrProp["fieldkind"] = "变量默认值";
                            arrProp["defaultvalue"] = oNode.text;
                        }
                    }
                    break;
                }
            case "文本区长":
                {
                    break;
                }
            case "复选框":
            case "选项列表":
            case "多选列表":
                {
                    var oNode = oDXml.documentElement.selectSingleNode("/root/defaultValue");
                    if (oNode != null) {
                        if (IsSpace(oNode.text) == false) {
                            arrProp["fieldkind"] = "数据项";
                            arrProp["defaultvalue"] = oNode.text;
                        }
                    }

                    break;
                }
            case "公式":
                {
                    //公式默认值
                    var oNode = oDXml.documentElement.selectSingleNode("/root/defaultExp");
                    if (oNode != null) {
                        if (IsSpace(oNode.text) == false) {
                            arrProp["fieldkind"] = "实际计算项"; //还要考虑汇总项的情况
                            arrProp["defaultvalue"] = oNode.text;
                        }
                    }
                    arrProp["readonly"] = "是";
                    break;
                }
            case "查找关系":
                {

                    break;
                }
            case "主从信息表":
                {
                    arrProp["visible"] = "否";
                    break;
                }

        }
        //}
        //grid列宽
        var oNode = oDXml.documentElement.selectSingleNode("/root/width");
        if (oNode != null) {
            if (IsSpace(oNode.text) == false) {
                arrProp["columnwidth"] = oNode.text;
            }
        }
        //列对齐方式
        if (arrProp["fdtype"] == "整数" || arrProp["fdtype"] == "实数") arrProp["align"] = "right";
        if (arrProp["type"] == "日期") arrProp["dblclick"] = "$eform('选择日期')";
        if (arrProp["type"] == "日期时间") arrProp["dblclick"] = "$eform('选择日期时间')";

        if (readOnly == "只读") { //只读的列表中才会有超链接

            //超链接
            if (arrProp["type"] == "电子邮件") {
                arrProp["link"] = "是";
                arrProp["target"] = "_blank";
                arrProp["href"] = "mailto";
            }
            if (arrProp["type"] == "URL") {
                arrProp["link"] = "是";
                arrProp["target"] = "_blank";
                arrProp["href"] = "http";
            }
            if (arrProp["type"] == "名称") {
                //arrProp["link"] = "是";
                //arrProp["target"] = "_blank";
                //arrProp["href"] = "mailto";
            }

            arrProp["readonly"] = "是";
            arrProp["dblclick"] = "$eform('打开窗口修改记录')";
        }
        var sValid = sbValid.toString();
        if (IsSpace(sValid) == false) {
            arrProp["datavalid"] = sValid;
        }
        return arrProp;
    }
}
function metadata_type_valid(sType) {
    ///根据元数据中的字段类型来进行数据验证
    var sb = new Sys.StringBuilder();
    switch (sType) {
        case "ID字段":
            {
                break;
            }
        case "自动编号":
            {
                break;
            }
        case "名称":
            {
                sb.append("$valid('汉字、字母、数字或_');");
                sb.append("$valid('字段值不重复');");
                sb.append("$valid('值已存在');");
                break;
            }
        case "文本":
            {
                break;
            }
        case "文本区":
            {
                break;
            }
        case "整数":
            {
                sb.append("$valid('整数');");
                break;
            }
        case "实数":
            {
                sb.append("$valid('实数');");
                break;
            }
        case "日期":
            {
                sb.append("$valid('日期');");
                break;
            }
        case "日期时间":
            {
                sb.append("$valid('日期');");
                break;
            }
        case "文本区长":
            {
                break;
            }
        case "复选框":
            {
                break;
            }
        case "选项列表":
            {
                break;
            }
        case "多选列表":
            {
                break;
            }
        case "百分比":
            {
                sb.append("$valid('实数');");
                break;
            }
        case "币种":
            {
                sb.append("$valid('实数');");
                break;
            }
        case "URL":
            {
                break;
            }
        case "电子邮件":
            {
                sb.append("$valid('Email');");
                break;
            }
        case "电话":
            {
                sb.append("$valid('电话号码');");
                break;
            }
        case "邮编":
            {
                sb.append("$valid('邮政编号');");
                break;
            }
        case "身份证号":
            {
                sb.append("$valid('身份证号');");
                break;
            }
        case "QQ号":
            {
                sb.append("$valid('QQ');");
                break;
            }
        case "公式":
            {
                break;
            }
        case "查找关系":
            {
                break;
            }
        case "主从信息表":
            {
                break;
            }
    }

    return sb;

}
function getDsnList(oCont, contValue) {
    ///取得数据源名称列表到 oCont控件上, contValue 是要给控件的赋值.因为异步的原因,要在此赋值.
    var oTopWin = getTopWin();
    var isFindTopWin = typeof (oTopWin.fctopdata) != "undefined"; //表示找对了顶层主窗口
    if (isFindTopWin && oTopWin.fctopdata.dsnlist != null) {
        getDsnListSub(oTopWin.fctopdata.dsnlist, oCont, contValue);
    } else {
        new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getDsns", "",
        function(result) {
            var errMsg = result.errmsg;
            if (IsSpace(errMsg) == false) {
                alert(errMsg);
                return;
            }
            var retX = result.value;
            var obj = result.context[0];
            fcpubdata.logger().debug("load dsn list!", arguments.callee);
            //alert(retX)
            getDsnListSub(retX, obj, contValue);
            //回写
            var oTopWin = result.context[1];
            var isFindTopWin = typeof (oTopWin.fctopdata) != "undefined"; //表示找对了顶层主窗口
            if (isFindTopWin) {
                oTopWin.fctopdata.dsnlist = retX;
            }
        }
        , [oCont, oTopWin]);
    }

}
function getDsnListSub(retX, obj, contValue) {
    if (obj.tagName == "SELECT") {
        var sId = obj.id;
        obj.outerHTML = SelectAddOption(obj, retX);
        if (typeof (contValue) != "undefined") $id(sId).value = contValue;
    } else {
        //设置表格中的下拉列表
        var sHtml = new Sys.StringBuilder("<tr height='18px'><td></td></tr>");
        var oXml = SetDom("<root>" + retX + "</root>");
        var ll = oXml.documentElement.childNodes.length;
        for (var j = 1; j < ll; j++) {
            sHtml.append("<tr height='18px'><td>" + oXml.documentElement.childNodes(j).text + "</td></tr>");
        }
        var sHtml1 = new Sys.StringBuilder("<code><format></format><sql1></sql1><xml>");
        sHtml.append("</xml><blninput>否</blninput><blnempty>否</blnempty><check>2</check><onclickopen>event.showlist=true</onclickopen></code>");
        sHtml1.append(sHtml);
        obj.cz = sHtml1.toString(); //grid1.tab.children[0].children[4].cz 

    }
}
/**
* 属性窗口中向方成提问的按钮的点击事件, 2011-09-07
**/
function PropWinActionFcBug() {
    var oCont = fcpubdata.obj[0]; //当前控件
    var oSheet = fcpubdata.obj[2]; //上一窗口的SKbillsheet 对象
    var curForm = SKbillsheet.dj_sn; //当前窗口的表单

    var unitType = "表单";
    if (curForm.indexOf("eb_") == 0) unitType = "报表";

    var unitName = "";
    if (IsSpace(oSheet) == false && unitType == "表单") unitName = oSheet.dj_sn;

    var sPath = fcpubdata.tmpDomainPath + "/ebsys/fceform/common/djframe.htm?djsn=b_enteringbug&djtype=ZK&wfName=fc_test_trace&wfVersion=1&initActionId=2229&actionId=3072";
    if (unitType != "") sPath += "&unitType=" + escape(unitType);
    if (IsSpace(unitName) == false) sPath += "&unitName=" + unitName;
    if (IsSpace(oCont.id) == false) sPath += "&contId=" + oCont.id;
    if (IsSpace(curForm) == false) sPath += "&curForm=" + curForm;

    window.showModalDialog(sPath, undefined, "center:yes;resizable:yes;scroll:auto;dialogHeight:600px;dialogWidth:800px");

}
