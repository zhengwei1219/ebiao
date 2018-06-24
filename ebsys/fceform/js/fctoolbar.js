///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

//|是分隔符,br是换行
//opendjfile,billtype,
//var toolbar = "newnull,opendj,|,opendjfile,billtype,djpreview,save,saveas,copy,paste,undo,redo,align,focus,front,behind,form,userfunction,userfunction1,addhtml,execute,showlist,eformhelp,cbozoom,listmenu,br,button,label,image,fcdiv,shape,pagecontrol,treeview,dblike,numedit,divcheckbox,divradio,dataset,webgrid,htmltable,formattab,dbedit,dbcheckbox,dbradiogroup,dblistbox,fccode,dbcombobox,dbmemo,dbimage,dbchart,file,excel,imgsetposition";
//red,yellow,light,Office,blue,green,CoolBlue,white  //所有样式表的列表
//var toolbarstyle = "light"; // 调用的样式表的目录


	//newdj,opendj,opendjfile,billtype,djpreview,save,saveas,copy,paste,undo,redo,align,focus,front,behind,form,userfunction,userfunction,addhtml,execute,showlist,eformhelp,cbozoom,button,label,img,div,shape,tab,treeview,a,spin,checkboxlist,radiolist,dataset,grid,htmltable,formattab,text,checkbox,radio,listbox,dropdownlist,combobox,textarea,dbimg,chart,upload,excel,setPosition,menu,tree
	
	var btnList={ //所有按钮的列表
		newempty: ["新建空表单", "../images/ef_design_newempty.gif", false, 'Add("newempty")'],
		newdj: ["带向导新建表单", "../images/ef_design_new.gif", false, 'Add("new")'],
		opendj: ["打开数据库中的表单", "../images/ef_design_open.gif", false, 'Add("opendj")'],
		opendjfile: ["打开表单文件", "../images/ef_design_openfile.gif", false, 'Add("opendjfile")'],
		billtype: ["生成路径分类维护", "../images/ef_design_billtype.gif", false, 'Add("billtype")'],
		djpreview: ["表单预览", "../images/ef_design_preview.gif", false, 'Add("djpreview")'],
		directrun: ["直接运行表单", "../images/ef_design_directrun.gif", false, 'Add("directrun")'],
		save: ["保存表单", "../images/ef_design_save.gif", false, 'Add("save")'],
		saveas: ["另存表单", "../images/ef_design_saveas.gif", false, 'Add("saveas")'],
		cut: ["剪切", "../images/ef_design_cut.gif", false, 'Add("cut")'],
		copy: ["复制", "../images/ef_design_copy.gif", false, 'Add("copy")'],
		paste: ["粘贴", "../images/ef_design_paste.gif", false, 'Add("paste")'],
		undo: ["撤消", "../images/ef_design_undo.gif", false, 'Add("undo")'],
		redo: ["重做", "../images/ef_design_redo.gif", false, 'Add("redo")'],
		align: ["对齐面板", "../images/ef_design_align.gif", false, 'Add("align")'],
		focus: ["焦点次序", "../images/ef_design_tabbtn.gif", false, 'Add("focus")'],
		front: ["前置", "../images/ef_design_qianzhi.gif", false, 'Add("front")'],
		behind: ["后置", "../images/ef_design_houzhi.gif", false, 'Add("behind")'],
		form: ["表单属性", "../images/ef_design_shuxing.gif", false, 'Add("form")'],
		userfunction: ["自定义函数", "../images/ef_design_function.gif", false, 'Add("userfunction")'],
		//userfunction1: ["能变色的自定义函数", "../images/ef_design_userfunction.gif", false, 'Add("userfunction1")'],
		userfunction1: ["能变色的自定义函数", "../images/ef_design_userfunction.gif", false, 'Add("userfunction_codemirror")'],
		addhtml: ["附加页面元素", "../images/ef_design_addobj.gif", false, 'Add("addhtml")'],
		execute: ["立即窗口", "../images/ef_design_command.gif", false, 'RunCommand()'],
		showlist: ["显示/隐藏控件列表", "../images/ef_design_left.gif", false, 'showobjlist()'],
		listconfig: ["列出配置信息", "../images/ef_design_help.gif", false, 'Add("listconfig")'],
		importconfig: ["导入配置信息", "../images/eb_designform.gif", false, 'parent.topic.execScript("importConfig()")'],
		eformhelp: ["帮助", "../images/ef_design_help.gif", false, 'window.open("../../eformhelp/efhelp/efhelp_index.htm")'],
		cbozoom: ["放缩编辑区", "", false, 'cboZoom_onchange()'],
		//listmenu: ["", "", false, ''],
		
		button: ["button控件", "../images/ef_design_button.gif", false, 'Add("button")'],
		label: ["label控件", "../images/ef_design_label.gif", false, 'Add("label")'],
		img: ["img控件", "../images/ef_design_image.gif", false, 'Add("img")'],
		div: ["div控件", "../images/ef_design_div.gif", false, 'Add("div")'],
		ebshow: ["显示e表结果控件", "../images/eb_control.gif", false, 'Add("ebshow")'],
		shape: ["shape控件", "../images/ef_design_shape.gif", false, 'Add("shape")'],
		tab: ["tab页签控件", "../images/ef_design_pagecontrol.gif", false, 'Add("tab")'],
		page: ["page页控件", "../images/ef_design_page.gif", false, 'Add("page")'],
		treeview: ["treeView控件", "../images/ef_design_tree.gif", false, 'Add("SKDBTreeView")'],
		a: ["超级链接控件", "../images/ef_design_href.gif", false, 'Add("a")'],
		spin: ["spin控件", "../images/ef_design_numedit.gif", false, 'Add("spin")'],
		checkboxlist: ["checkboxlist控件", "../images/ef_design_divcheckbox.gif", false, 'Add("checkboxlist")'],
		radiolist: ["radiolist控件", "../images/ef_design_divradio.gif", false, 'Add("radiolist")'],
		dataset: ["dataset数据集控件", "../images/ef_design_dataset.gif", false, 'Add("dataset")'],
		grid: ["grid表格控件", "../images/ef_design_webgrid.gif", false, 'Add("grid")'],
		htmltable: ["HTML table控件", "../images/ef_design_htmltab.gif", false, 'Add("HtmlTab")'],
		formattab: ["版式和表格向导", "../images/ef_design_formattab.gif", false, 'Add("formatTab")'],
		text: ["text控件", "../images/ef_design_edit.gif", false, 'Add("text")'],
		checkbox: ["checkbox控件", "../images/ef_design_chk.gif", false, 'Add("checkbox")'],
		radio: ["radio控件", "../images/ef_design_radio.gif", false, 'Add("radio")'],
		listbox: ["listbox控件", "../images/ef_design_list.gif", false, 'Add("listbox")'],
		dropdownlist: ["dropdownlist控件", "../images/ef_design_fccode.gif", false, 'Add("dropdownlist")'],
	
		combobox: ["combobox控件", "../images/ef_design_combo.gif", false, 'Add("combobox")'],
		textarea: ["textarea控件", "../images/ef_design_area.gif", false, 'Add("textarea")'],
		dbimg: ["dbimg控件", "../images/ef_design_dbmage.gif", false, 'Add("dbimg")'],
		chart: ["chart控件", "../images/ef_design_chart.gif", false, 'Add("chart")'],
		upload: ["upload多附件上传控件", "../images/ef_design_filed.gif", false, 'Add("upload")'],
		excel: ["excel控件", "../images/ef_design_excel.gif", false, 'Add("excel")'],
		setPosition: ["切换定位类型(static/absolute)", "../images/ef_design_position.gif", false, 'setPosition()'],
		menu: ["常用工具", "../images/ef_design_designmenu.gif", false, 'Add("menu")'],
		ebiaoform: ["表单属性", "../images/ef_design_shuxing.gif", false, 'Add("ebiaoform")'],
		ebiaobind: ["绑定报表参数", "../images/eb_para.gif", false, 'Add("ebiaobind")'],
		ebiao: ["e表控件", "../images/eb_control.gif", false, 'Add("ebiao")'],
		layout: ["布局控件", "../images/eb_subreport.gif", false, 'Add("layout")'],
		eblayout: ["布局模版控件", "../images/eb_subreport.gif", false, 'Add("eblayout")'],
//		test: ["test控件", "../images/eb_subreport.gif", false, 'Add("test")'],
		tree: ["tree控件", "../images/ef_design_tree.gif", false, 'Add("tree")']
	};

/**
*工具栏列表
*TbStyle是工具栏的样式
*Tb是工具栏的列表
**/

function AddToolbarButton(TbStyle, Tb) {
    if (IsSpace(top.zkpub) == false) {
        if (IsSpace(top.zkpub.skin) == false) {
            fcpubdata.skins = top.zkpub.skin;
        }
    }
    //加工具栏
    var tbCss = "";
    tbCss = parent.Request.QueryString("tbcss").toString();
    if (tbCss != "undefined" && tbCss != "") {
        fcpubdata.skins = tbCss;
    }
    
	var sPosition = LoadPubData("eformPosition");
	if(sPosition == "static"){
		//btnList['setPosition'][1]="../images/ef_design_position.gif";
		pubPositionChange = "是";
		//try{
		//if(typeof parent.topic.fcpubdata == "object"){
		//	parent.topic.fcpubdata.position=sPosition;
		//}
		//}catch(e){
		//	window.setTimeout("try{parent.topic.fcpubdata.position=sPosition;}catch(e){};",1000)
		//}
	}
	var arr = fcpubdata.toolbar.split(",");
	var str = new Sys.StringBuilder() ; //工具栏的串
	//要调用的css
	var hrefstyle = "<link rel='stylesheet' type='text/css' href='../css/skins/" ;
	var docstyle = "/style/Editor.css'>";
	str.append(hrefstyle + fcpubdata.skins + docstyle);
	/*
	str.append("<table id='Toolbar' class='Toolbar' cellSpacing='1' cellPadding='0' border='0' style='table-layout:fixed;LEFT:2px;POSITION:absolute;TOP:0px;'  ondrag='tb_ondrag()'><tr>");

//	str.append("<td width='5px' height='22px'><img src='../css/skins/" + fcpubdata.skins + "/images/ef_design_ToolbarLeft.gif'></td>");
	str.append("<td width='5px' height='22px'><span class='leftstart' ></span></td>");
	var positionLeft = 5 + 2 + 1;
	for(var j=0; j<arr.length; j++){
		var btn = btnList[arr[j]];
		//有分隔符号
		if(arr[j] == "|") {
		    str.append("<td width='5px' height='22px'><span class='menuline'></span></td>");
		    positionLeft += 5+1;
		}else{
		//是否换行 
		if (arr[j] == "br") {
		        
			    str.append("</tr></table><span class='rightend' style='position:absolute;top:0px;width:8px;left:"+positionLeft+"'></span><table id='Toolbar1' class='Toolbar' cellSpacing='1' cellPadding='0' border='0' style='table-layout:fixed;LEFT:2px;POSITION:absolute;TOP:27px;margin-top:1px;'  ondrag='tb_ondrag()'><tr>");

			    str.append("<td width='5px' height='22px'><span class='leftstart' ></span></td>");
			    positionLeft = 5 + 2+1;
			}else{
				//增加按钮
				if(arr[j] == "cbozoom"){
				    str.append("<td width='55px' height='22px'><select id='cboZoom' onchange='cboZoom_onchange()'><option selected>10%</option><option>25%</option><option>50%</option><option>75%</option><option selected>100%</option><option>150%</option><option>200%</option><option>300%</option><option>500%</option></select></td>");
				    positionLeft += 55+1;
				} else {
				var sClassName = arr[j];
				if (sPosition == "static" && sClassName == "setPosition") sClassName = "ef_design_static";
				str.append("<td width='22px' height='22px' class='normal' ><span onmouseover='tbr1_onmouseover()' onmouseout='tbr1_onmouseout()' onmousedown='tbr1_onmousedown()' onmouseup='tbr1_onmouseup()' width='20px' height='20px' class='" + sClassName + "' title='" + btn[0] + "' onclick='" + btn[3] + "'></span></td>");
				positionLeft += 22+1;
				}
			}
		}
	}
	str.append("</tr></table><span class='rightend' style='position:absolute;top:27px;width:8px;left:" + positionLeft + "'></span>");
	//div1.outerHTML = str;
	//alert(str)
	*/

	str.append("<table id='Toolbar' class='Toolbar' cellSpacing='0' cellPadding='0' border='0' style='LEFT:2px;POSITION:absolute;TOP:0px'  ondrag='tb_ondrag()'><tr>");

	str.append("<td><img width='5px' height='20px' class='leftstart' src='../images/ef_touming_20_20.gif'></td>");
	var positionLeft = 5;
	for (var j = 0; j < arr.length; j++) {
	    var btn = btnList[arr[j]];
	    //有分隔符号
	    if (arr[j] == "|") {
	        str.append("<td><img width='3px' height='20px' class='menuline' src='../images/ef_touming_20_20.gif'></td>");
	        positionLeft += 3;
	    } else {
	        //是否换行
	        if (arr[j] == "br") {
	            str.append("</tr></table><span class='rightend' style='position:absolute;top:0px;width:8px;left:" + positionLeft + "'></span><table id='Toolbar1' class='Toolbar' cellSpacing='0' cellPadding='0' border='0' style='LEFT:2px;POSITION:absolute;TOP:27px'  ondrag='tb_ondrag()'><tr>");

	            str.append("<td><img width='5px' height='20px' class='leftstart' src='../images/ef_touming_20_20.gif'></td>");
	            positionLeft = 5;
	        } else {
	            //增加按钮
	            if (arr[j] == "cbozoom") {
	                str.append("<td width='55px'  height='22px'><select id='cboZoom' onchange='cboZoom_onchange()'><option selected>10%</option><option>25%</option><option>50%</option><option>75%</option><option selected>100%</option><option>150%</option><option>200%</option><option>300%</option><option>500%</option></select></td>");
	                positionLeft += 55;
	            } else {
	                var sClassName = arr[j];
	                if (sPosition == "static" && sClassName == "setPosition") sClassName = "ef_design_static";
	                
	                str.append("<td width='22px' height='22px' onmouseover='tbr1_onmouseover()' onmouseout='tbr1_onmouseout()' onmousedown='tbr1_onmousedown()' onmouseup='tbr1_onmouseup()'><img class='normal " + sClassName + "' classbak='" + sClassName + "' title='" + btn[0] + "' onclick='" + btn[3] + "' src='../../fceform/images/ef_touming_20_20.gif' width='20px' height='20px'></td>");
	                positionLeft += 22;
	            }
	        }
	    }
	}
	str.append("</tr></table><span class='rightend' style='position:absolute;top:27px;width:8px;left:" + positionLeft + "'></span>");
	//加上帮助链接
	//str.append("<a href='../../eformhelp/efhelp/efhelp_index.htm' target='_blank' style='position:absolute;top:32px;left:" + (positionLeft+10) + "'>帮助</a>");
	document.write(str.toString());

}

/**
* 设置表单元素的定位方式
**/
function setPosition() {
	
	if(parent.topic.fcpubdata.position == "absolute"){
		parent.topic.fcpubdata.position = "static" ;
		event.srcElement.className = "ef_design_static";
		event.srcElement.classbak = "ef_design_static";
	}else{
		parent.topic.fcpubdata.position = "absolute" ;
		event.srcElement.className = "setPosition";
		event.srcElement.classbak = "setPosition";
	}
		//保存起来
		SavePubData("eformPosition",parent.topic.fcpubdata.position);
}
function DjOpenHtm() {
	var Htm = DjOpen('menu','','展现',"有模式窗口","直接","") ;
	htmltocont(Htm);
	blnChange=true ;
}
/**
* 注册工具栏上的可用按钮,btnListAdd全局变量中保存了要加上的按钮
*@date 2005-10-12
**/
function RegButton() {
	
	for(var i in btnListAdd){
		// i = "mytest"
		var objid = btnListAdd[i] ; 
		if(typeof btnList[objid] != "undefined"){
			//此按钮名称已存在
			continue;
		}
		btnList[i] = [objid[0], objid[1], objid[2], objid[3]] ;
	}
	
}