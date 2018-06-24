///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

//|�Ƿָ���,br�ǻ���
//opendjfile,billtype,
//var toolbar = "newnull,opendj,|,opendjfile,billtype,djpreview,save,saveas,copy,paste,undo,redo,align,focus,front,behind,form,userfunction,userfunction1,addhtml,execute,showlist,eformhelp,cbozoom,listmenu,br,button,label,image,fcdiv,shape,pagecontrol,treeview,dblike,numedit,divcheckbox,divradio,dataset,webgrid,htmltable,formattab,dbedit,dbcheckbox,dbradiogroup,dblistbox,fccode,dbcombobox,dbmemo,dbimage,dbchart,file,excel,imgsetposition";
//red,yellow,light,Office,blue,green,CoolBlue,white  //������ʽ����б�
//var toolbarstyle = "light"; // ���õ���ʽ���Ŀ¼


	//newdj,opendj,opendjfile,billtype,djpreview,save,saveas,copy,paste,undo,redo,align,focus,front,behind,form,userfunction,userfunction,addhtml,execute,showlist,eformhelp,cbozoom,button,label,img,div,shape,tab,treeview,a,spin,checkboxlist,radiolist,dataset,grid,htmltable,formattab,text,checkbox,radio,listbox,dropdownlist,combobox,textarea,dbimg,chart,upload,excel,setPosition,menu,tree
	
	var btnList={ //���а�ť���б�
		newempty: ["�½��ձ�", "../images/ef_design_newempty.gif", false, 'Add("newempty")'],
		newdj: ["�����½���", "../images/ef_design_new.gif", false, 'Add("new")'],
		opendj: ["�����ݿ��еı�", "../images/ef_design_open.gif", false, 'Add("opendj")'],
		opendjfile: ["�򿪱��ļ�", "../images/ef_design_openfile.gif", false, 'Add("opendjfile")'],
		billtype: ["����·������ά��", "../images/ef_design_billtype.gif", false, 'Add("billtype")'],
		djpreview: ["��Ԥ��", "../images/ef_design_preview.gif", false, 'Add("djpreview")'],
		directrun: ["ֱ�����б�", "../images/ef_design_directrun.gif", false, 'Add("directrun")'],
		save: ["�����", "../images/ef_design_save.gif", false, 'Add("save")'],
		saveas: ["����", "../images/ef_design_saveas.gif", false, 'Add("saveas")'],
		cut: ["����", "../images/ef_design_cut.gif", false, 'Add("cut")'],
		copy: ["����", "../images/ef_design_copy.gif", false, 'Add("copy")'],
		paste: ["ճ��", "../images/ef_design_paste.gif", false, 'Add("paste")'],
		undo: ["����", "../images/ef_design_undo.gif", false, 'Add("undo")'],
		redo: ["����", "../images/ef_design_redo.gif", false, 'Add("redo")'],
		align: ["�������", "../images/ef_design_align.gif", false, 'Add("align")'],
		focus: ["�������", "../images/ef_design_tabbtn.gif", false, 'Add("focus")'],
		front: ["ǰ��", "../images/ef_design_qianzhi.gif", false, 'Add("front")'],
		behind: ["����", "../images/ef_design_houzhi.gif", false, 'Add("behind")'],
		form: ["������", "../images/ef_design_shuxing.gif", false, 'Add("form")'],
		userfunction: ["�Զ��庯��", "../images/ef_design_function.gif", false, 'Add("userfunction")'],
		//userfunction1: ["�ܱ�ɫ���Զ��庯��", "../images/ef_design_userfunction.gif", false, 'Add("userfunction1")'],
		userfunction1: ["�ܱ�ɫ���Զ��庯��", "../images/ef_design_userfunction.gif", false, 'Add("userfunction_codemirror")'],
		addhtml: ["����ҳ��Ԫ��", "../images/ef_design_addobj.gif", false, 'Add("addhtml")'],
		execute: ["��������", "../images/ef_design_command.gif", false, 'RunCommand()'],
		showlist: ["��ʾ/���ؿؼ��б�", "../images/ef_design_left.gif", false, 'showobjlist()'],
		listconfig: ["�г�������Ϣ", "../images/ef_design_help.gif", false, 'Add("listconfig")'],
		importconfig: ["����������Ϣ", "../images/eb_designform.gif", false, 'parent.topic.execScript("importConfig()")'],
		eformhelp: ["����", "../images/ef_design_help.gif", false, 'window.open("../../eformhelp/efhelp/efhelp_index.htm")'],
		cbozoom: ["�����༭��", "", false, 'cboZoom_onchange()'],
		//listmenu: ["", "", false, ''],
		
		button: ["button�ؼ�", "../images/ef_design_button.gif", false, 'Add("button")'],
		label: ["label�ؼ�", "../images/ef_design_label.gif", false, 'Add("label")'],
		img: ["img�ؼ�", "../images/ef_design_image.gif", false, 'Add("img")'],
		div: ["div�ؼ�", "../images/ef_design_div.gif", false, 'Add("div")'],
		ebshow: ["��ʾe�����ؼ�", "../images/eb_control.gif", false, 'Add("ebshow")'],
		shape: ["shape�ؼ�", "../images/ef_design_shape.gif", false, 'Add("shape")'],
		tab: ["tabҳǩ�ؼ�", "../images/ef_design_pagecontrol.gif", false, 'Add("tab")'],
		page: ["pageҳ�ؼ�", "../images/ef_design_page.gif", false, 'Add("page")'],
		treeview: ["treeView�ؼ�", "../images/ef_design_tree.gif", false, 'Add("SKDBTreeView")'],
		a: ["�������ӿؼ�", "../images/ef_design_href.gif", false, 'Add("a")'],
		spin: ["spin�ؼ�", "../images/ef_design_numedit.gif", false, 'Add("spin")'],
		checkboxlist: ["checkboxlist�ؼ�", "../images/ef_design_divcheckbox.gif", false, 'Add("checkboxlist")'],
		radiolist: ["radiolist�ؼ�", "../images/ef_design_divradio.gif", false, 'Add("radiolist")'],
		dataset: ["dataset���ݼ��ؼ�", "../images/ef_design_dataset.gif", false, 'Add("dataset")'],
		grid: ["grid���ؼ�", "../images/ef_design_webgrid.gif", false, 'Add("grid")'],
		htmltable: ["HTML table�ؼ�", "../images/ef_design_htmltab.gif", false, 'Add("HtmlTab")'],
		formattab: ["��ʽ�ͱ����", "../images/ef_design_formattab.gif", false, 'Add("formatTab")'],
		text: ["text�ؼ�", "../images/ef_design_edit.gif", false, 'Add("text")'],
		checkbox: ["checkbox�ؼ�", "../images/ef_design_chk.gif", false, 'Add("checkbox")'],
		radio: ["radio�ؼ�", "../images/ef_design_radio.gif", false, 'Add("radio")'],
		listbox: ["listbox�ؼ�", "../images/ef_design_list.gif", false, 'Add("listbox")'],
		dropdownlist: ["dropdownlist�ؼ�", "../images/ef_design_fccode.gif", false, 'Add("dropdownlist")'],
	
		combobox: ["combobox�ؼ�", "../images/ef_design_combo.gif", false, 'Add("combobox")'],
		textarea: ["textarea�ؼ�", "../images/ef_design_area.gif", false, 'Add("textarea")'],
		dbimg: ["dbimg�ؼ�", "../images/ef_design_dbmage.gif", false, 'Add("dbimg")'],
		chart: ["chart�ؼ�", "../images/ef_design_chart.gif", false, 'Add("chart")'],
		upload: ["upload�฽���ϴ��ؼ�", "../images/ef_design_filed.gif", false, 'Add("upload")'],
		excel: ["excel�ؼ�", "../images/ef_design_excel.gif", false, 'Add("excel")'],
		setPosition: ["�л���λ����(static/absolute)", "../images/ef_design_position.gif", false, 'setPosition()'],
		menu: ["���ù���", "../images/ef_design_designmenu.gif", false, 'Add("menu")'],
		ebiaoform: ["������", "../images/ef_design_shuxing.gif", false, 'Add("ebiaoform")'],
		ebiaobind: ["�󶨱������", "../images/eb_para.gif", false, 'Add("ebiaobind")'],
		ebiao: ["e��ؼ�", "../images/eb_control.gif", false, 'Add("ebiao")'],
		layout: ["���ֿؼ�", "../images/eb_subreport.gif", false, 'Add("layout")'],
		eblayout: ["����ģ��ؼ�", "../images/eb_subreport.gif", false, 'Add("eblayout")'],
//		test: ["test�ؼ�", "../images/eb_subreport.gif", false, 'Add("test")'],
		tree: ["tree�ؼ�", "../images/ef_design_tree.gif", false, 'Add("tree")']
	};

/**
*�������б�
*TbStyle�ǹ���������ʽ
*Tb�ǹ��������б�
**/

function AddToolbarButton(TbStyle, Tb) {
    if (IsSpace(top.zkpub) == false) {
        if (IsSpace(top.zkpub.skin) == false) {
            fcpubdata.skins = top.zkpub.skin;
        }
    }
    //�ӹ�����
    var tbCss = "";
    tbCss = parent.Request.QueryString("tbcss").toString();
    if (tbCss != "undefined" && tbCss != "") {
        fcpubdata.skins = tbCss;
    }
    
	var sPosition = LoadPubData("eformPosition");
	if(sPosition == "static"){
		//btnList['setPosition'][1]="../images/ef_design_position.gif";
		pubPositionChange = "��";
		//try{
		//if(typeof parent.topic.fcpubdata == "object"){
		//	parent.topic.fcpubdata.position=sPosition;
		//}
		//}catch(e){
		//	window.setTimeout("try{parent.topic.fcpubdata.position=sPosition;}catch(e){};",1000)
		//}
	}
	var arr = fcpubdata.toolbar.split(",");
	var str = new Sys.StringBuilder() ; //�������Ĵ�
	//Ҫ���õ�css
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
		//�зָ�����
		if(arr[j] == "|") {
		    str.append("<td width='5px' height='22px'><span class='menuline'></span></td>");
		    positionLeft += 5+1;
		}else{
		//�Ƿ��� 
		if (arr[j] == "br") {
		        
			    str.append("</tr></table><span class='rightend' style='position:absolute;top:0px;width:8px;left:"+positionLeft+"'></span><table id='Toolbar1' class='Toolbar' cellSpacing='1' cellPadding='0' border='0' style='table-layout:fixed;LEFT:2px;POSITION:absolute;TOP:27px;margin-top:1px;'  ondrag='tb_ondrag()'><tr>");

			    str.append("<td width='5px' height='22px'><span class='leftstart' ></span></td>");
			    positionLeft = 5 + 2+1;
			}else{
				//���Ӱ�ť
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
	    //�зָ�����
	    if (arr[j] == "|") {
	        str.append("<td><img width='3px' height='20px' class='menuline' src='../images/ef_touming_20_20.gif'></td>");
	        positionLeft += 3;
	    } else {
	        //�Ƿ���
	        if (arr[j] == "br") {
	            str.append("</tr></table><span class='rightend' style='position:absolute;top:0px;width:8px;left:" + positionLeft + "'></span><table id='Toolbar1' class='Toolbar' cellSpacing='0' cellPadding='0' border='0' style='LEFT:2px;POSITION:absolute;TOP:27px'  ondrag='tb_ondrag()'><tr>");

	            str.append("<td><img width='5px' height='20px' class='leftstart' src='../images/ef_touming_20_20.gif'></td>");
	            positionLeft = 5;
	        } else {
	            //���Ӱ�ť
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
	//���ϰ�������
	//str.append("<a href='../../eformhelp/efhelp/efhelp_index.htm' target='_blank' style='position:absolute;top:32px;left:" + (positionLeft+10) + "'>����</a>");
	document.write(str.toString());

}

/**
* ���ñ�Ԫ�صĶ�λ��ʽ
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
		//��������
		SavePubData("eformPosition",parent.topic.fcpubdata.position);
}
function DjOpenHtm() {
	var Htm = DjOpen('menu','','չ��',"��ģʽ����","ֱ��","") ;
	htmltocont(Htm);
	blnChange=true ;
}
/**
* ע�Ṥ�����ϵĿ��ð�ť,btnListAddȫ�ֱ����б�����Ҫ���ϵİ�ť
*@date 2005-10-12
**/
function RegButton() {
	
	for(var i in btnListAdd){
		// i = "mytest"
		var objid = btnListAdd[i] ; 
		if(typeof btnList[objid] != "undefined"){
			//�˰�ť�����Ѵ���
			continue;
		}
		btnList[i] = [objid[0], objid[1], objid[2], objid[3]] ;
	}
	
}