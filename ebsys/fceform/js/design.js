///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

Eform.UnDo = function(){}
Eform.UnDo.prototype =
{
    init : initoUndooRedo ,
    saveRedo : SaveoRedoOneRecord ,
    saveUndo : SaveoUndoOneRecord ,
    readRedo : ReadoRedoOneRecord ,
    readUndo : ReadoUndoOneRecord ,
    delRedo : DeleteoRedoOneRecord ,
    delUndo : DeleteoUndoOneRecord ,
    cmdRedo : cmdRedo ,
    cmdUndo : cmdUndo ,

    addObj: Addobj,
    designDjSave: designdjsave,
    saveDesignHtml: savedesignhtml,
    savePubData: SavePubData,
    loadPubData: LoadPubData,
    getNewContID: getNewContID,
    main_ondblclick: main_ondblclick,
    main_onkeydel: main_onkeydel,
    main_onkeyup: main_onkeyup,
    main_onkeydown: main_onkeydown,
    selFieldToArr: SelFieldToArr,
    isDivCont: IsDivCont,
    htmlToCont: htmltocont,
    addContXml: AddContXml,
    copyCont: CopyCont,
    pasteCont: PasteCont,
    currSel: CurrSel,
    selectObj: SelectObj,
    openObjList: openobjlist,
    showAllField: ShowAllField,
    addBindField: AddBindField,
    getFieldInputStr: getFieldInputStr,
    autoAddDsMain: AutoAddDsMain,
    autoAddQueryDj: AutoAddQueryDj,
    addRecentFile: ef_AddRecentFile,
    refreshRecentFile: ef_RefreshRecentFile     
}
if(Type.parse("Eform.UnDo") == null) Eform.UnDo.registerClass("Eform.UnDo");

Eform.Wizard = function(){}
Eform.Wizard.prototype =
{
    disabledButton : function uf_DisabledButton(){
	            //var cmdPrev	 = parent.parent.toolbar.cmdPrev;
	            //var cmdNext	 = parent.parent.toolbar.cmdNext;
	            //var cmdOk	 = parent.parent.toolbar.cmdOk;
	            var objNav = parent.mainform.topic.objNav;
	            if(objNav.prevPage == "") {
		            cmdPrev.disabled = true;
	            }else{
		            cmdPrev.removeAttribute("disabled");
	            }
            	
	            if(objNav.nextPage == "") {
		            cmdNext.disabled = true;
		            cmdOk.removeAttribute("disabled");
	            }else{
		            cmdNext.removeAttribute("disabled");
		            cmdOk.disabled = true;
	            }
            },

    prev : function cmdPrev_onclick() {
            parent.mainform.topic.objNav.saveConfig();
            if(parent.mainform.topic.objNav.isOk==false) return;
            var htmlPath = parent.mainform.topic.objNav.prevPage;
            if(htmlPath != ""){
                cmdPrev.disabled = true;
                parent.mainform.location.replace("../../fceform/common/djframe.htm?djtype=ZK&djsn="+htmlPath);
            }
        } ,         
    next : function cmdNext_onclick() {
            parent.mainform.topic.objNav.saveConfig();
            if(parent.mainform.topic.objNav.isOk==false) return;
            var htmlPath = parent.mainform.topic.objNav.nextPage;
            if(htmlPath != ""){
                cmdNext.disabled = true;
                parent.mainform.location.replace("../../fceform/common/djframe.htm?djtype=ZK&djsn="+htmlPath);
            }
        }          
    
}
if(Type.parse("Eform.Wizard") == null) Eform.Wizard.registerClass("Eform.Wizard");

/**
	将控件添加到页面上
	@date 2004-06-28 liuxr 整理
	@name 要添加的控件的名称
**/
function Addobj(name){

	//切换回设计状态
	//parent.selhtml.execScript("design_check()")
	if($id("bigmain") != null && bigmain.style.display == "none"){
		alert("只有在设计状态下才有此功能!请点下面的设计按钮切换到设计状态后再试!");
		return;
	}
	var oAddField = null; //要加绑定字段的对象，
	switch (name){
		case "button":{
		//fcpubdata.area.focus();
			ArrNum[name]++;
			//alert(ArrNum['SKButton'])
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<button controltype='" + name + "' style='position:" + fcpubdata.position + ";left:0px;top:0px;width:75px;height:25px;' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() id="+sid+">"+sid+"</button>";
			htmltocont(sHtml,name);
			
			SelectObj(sid);
			break;
		}
		case "spin":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+" Min='1' Max='32000' NextNum='1' style='position:" + fcpubdata.position + ";Left:0;Top:0; Height:22; Width:70;' src='../images/ef_designer_numedit.gif' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() />";
			//var sHtml="<label style='position:absolute;left:350px;top:150px;width:65px;height:15px; Font-Size:12px; 'nowrap=true onresize=resize() onmove=move() oncontrolselect=controlselect() value=Label"+ArrNum['Label']+" id=Label"+ArrNum['Label']+"><div nowrap=true> Label"+ArrNum['Label']+" </div></label>";
			htmltocont(sHtml,name);
			
			SelectObj(sid);
			
			oAddField = $id(sid);
			break;
		}
		case "label":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<label controltype='" + name + "' style='position:" + fcpubdata.position + ";left:0px;top:0px;width:65px;height:15px; ' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() id="+sid+">"+sid+"</label>";
			//var sHtml="<label style='position:absolute;left:350px;top:150px;width:65px;height:15px; Font-Size:12px; 'nowrap=true onresize=resize() onmove=move() oncontrolselect=controlselect() value=Label"+ArrNum['Label']+" id=Label"+ArrNum['Label']+"><div nowrap=true> Label"+ArrNum['Label']+" </div></label>";
			htmltocont(sHtml,name);
			
			SelectObj(sid);
			break;
		}
		case "hr":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<HR controltype='" + name + "' id="+sid+" width='95' color='silver' style='position:" + fcpubdata.position + ";left:0px;top:0px;width:165px;height:2px;' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect()>";
			//var sHtml="<label style='position:absolute;left:350px;top:150px;width:65px;height:15px; Font-Size:12px; 'nowrap=true onresize=resize() onmove=move() oncontrolselect=controlselect() value=Label"+ArrNum['Label']+" id=Label"+ArrNum['Label']+"><div nowrap=true> Label"+ArrNum['Label']+" </div></label>";
			htmltocont(sHtml,name);
			
			//SelectObj("HR"+ArrNum['HR']);
			break;
		}
		case "a":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<a controltype='" + name + "' style='position:" + fcpubdata.position + "; left:0px; Top:0px; height:15px; Width:80px; ' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() id="+sid+" >超级链接</a>";  //id=SKDBLike"+ArrNum['SKDBLike']+" value=SKDBLike"+ArrNum['SKDBLike']+"
			htmltocont(sHtml,name);
			
			SelectObj(sid);
			break;
		}
		case "text":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
/*
			var sHtml="<label controltype='" + name + "'  CanSelect=false style='position:" + fcpubdata.position + ";left:0px;top:0px;width:110px;height:20px; Font-Size:12px; BORDER-BOTTOM: silver 1px solid' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect()  id="+sid+" ></label>";
*/
			var sHtml="<input controltype='" + name + "'  style='position:" + fcpubdata.position + ";left:0px;top:0px;width:110px;height:20px; ' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect()  id="+sid+" >";
			htmltocont(sHtml,name);
			SelectObj(sid);
			oAddField = $id(sid);
			//eval("FCDBedit"+ArrNum['FCDBedit']).setActive()
			//var oControlRange=document.body.createControlRang();
			//oControlRange.add(eval("SKDBedit"+ArrNum['SKDBedit']));
			//oControlRange.select();
			break;
		}
		case "checkboxlist":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml = "<DIV controltype='" + name + "' id=" + sid + " style='position:" + fcpubdata.position + ";left:0;top:0;width:300;height:200;BORDER: 1px solid;' class='control-border-color' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() >checkboxlist</DIV>";
			htmltocont(sHtml,name) ;
			
			SelectObj(sid);
			break;
		}
		case "radiolist":{
			ArrNum[name]++;////style='position:absolute;Left:184;Top:160;Height:96;Width:152;FONT-FAMILY:宋体;FONT-SIZE:12px;color:#000000 ;'
			var sid = getNewContID(name,oContXml) ;
			var sHtml = "<DIV controltype='" + name + "' id=" + sid + " style='position:" + fcpubdata.position + ";left:0;top:0;width:300;height:200;BORDER: 1px solid;' class='control-border-color' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() >radiolist</DIV>";
			htmltocont(sHtml,name) ;
			
			SelectObj(sid);
			break;
		}
		case "chart":{
			ArrNum[name]++;
			//var sHtml="<div id=SKDBchart"+ArrNum['SKDBchart']+" other=' <param name=3DModeOn valuea=true> 3D显示 ' style='position:absolute;Left:304;Top:144;Height:88;Width:96;' graphxml='<root> <samplevalues> </samplevalues> <samplelabels><field> </field></samplelabels></root> '></div>"
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+" type=graph style='position:" + fcpubdata.position + ";Left:0;Top:0; Height:188; Width:326;' src='../images/ef_designer_graph.gif' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() />";
			htmltocont(sHtml,name);
			
			SelectObj(sid);
			break;
		}
		case "dropdownlist": {
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+" multiselect='否' addrow='否'  blnempty='否'  blninput='是' visible='是' style='position:" + fcpubdata.position + ";left:0px; top:0px; width:100px; height:20px ;' src='"+fcpubdata.path+"/fceform/images/ef_designer_fccode.gif' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() />";
			htmltocont(sHtml,name);
			
			SelectObj(sid);
			oAddField = $id(sid);
			break;
		}
		case "checkbox":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<div controltype='" + name + "' nowrap id="+sid+" truevalue='是' falsevalue='否' value='否' style='position:" + fcpubdata.position + "; left:0px; top:0px; width:80; height:20px;'onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect()><input type=checkbox oncontrolselect=controlselectcancel()><span>复选框</span></div>";
			htmltocont(sHtml,name);
			
			SelectObj(sid);
			oAddField = $id(sid);
			//obj.setActive();
			break;
		}
		case "radio":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml = "<fieldset controltype='" + name + "' id=" + sid + " contentEditable=false value=选项一  style='position:" + fcpubdata.position + ";Left:0;Top:0;Height:50;Width:152; ' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() tempvalue='选项一&#13;&#10;选项二' temptext='选项一&#13;&#10;选项二' ><legend>单选表</legend><INPUT id=RG" + sid + "1 onclick=" + sid + ".value=RG" + sid + "[0].value; type=radio CHECKED value=选项一 name=RG" + sid + " text='选项一'><SPAN>选项一</SPAN>&nbsp;<INPUT id=RG" + sid + "2 onclick=" + sid + ".value=RG" + sid + "[1].value; type=radio value=选项二 name=RG" + sid + " text='选项二'><SPAN>选项二</SPAN>&nbsp;</fieldset>";
			htmltocont(sHtml,name) ;
			
			SelectObj(sid);
			oAddField = $id(sid);
			break ;
		 
		}
		case "listbox":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<select controltype='" + name + "' size=8  style='position:" + fcpubdata.position + "; left:0px; top:0px; width:100px; height:80px; ' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() id="+sid+"></select>" ;
			htmltocont(sHtml,name) ;
			
			SelectObj(sid);
			oAddField = $id(sid);
			//alert(SelectObj)
			break;
		}	
		case "textarea":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<textarea controltype='" + name + "' style='position:" + fcpubdata.position + "; left:0px; top:0px; width:100px; height:85px; ' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() value="+sid+" id="+sid+"></textarea>" ;
			htmltocont(sHtml,name) ;
			
			SelectObj(sid);
			oAddField = $id(sid);
			break ;
		}
		case "combobox":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<select controltype='" + name + "' style='position:" + fcpubdata.position + "; left:0px; top:0px; width:120px; height:25px; ' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() id="+sid+"></select>" ;
			htmltocont(sHtml,name) ;
		
			SelectObj(sid);
			oAddField = $id(sid);
			break;
		}
		case "upload":{
			try{
				obj=upload1.id;
				alert("每个表单上只能有一个File Field多附件上传控件！");
				return;
			}catch(e){
				ArrNum[name]++;
				var sHtml = "<div controltype='" + name + "' id='upload1' style='overflow: auto;position:" + fcpubdata.position + ";Left:0;Top:0;Height:48px;Width:152px;BORDER: 1px solid;' class='control-border-color' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() ><table  border=0 cellPadding=0 cellSpacing=0  style='BORDER-BOTTOM: 0px solid; BORDER-LEFT: 0px solid; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; FONT-SIZE: 12px; BORDER-TOP: 0px solid; BORDER-RIGHT: 0px solid'> <tr height=30><td colspan=5  >&nbsp;&nbsp;<a href='javascript:uploadAddFile()' NotShowCtrlType='是'>增加附件</a></td></tr>  </table>  </div> ";
			}
			htmltocont(sHtml,name);
			
			SelectObj(upload1);
			break ;
		}

		case "dbimg":{   /*DBImage*/
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+"  alt='用鼠标双击此可选择图形' ondblclick=uploadImg() style='position:" + fcpubdata.position + ";Left:0;Top:0;' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() >";
			//var sHtml="<img controltype='Image' id="+sid+" alt='用鼠标双击此可选择图形'ondblclick=uploadImg() style='position:absolute;Left:184;Top:16;Height:48;Width:56;' >";
			
			htmltocont(sHtml,name) ;
			
			SelectObj(sid);
			oAddField = $id(sid);
			break ;
		}
		case "img":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+" style='position:" + fcpubdata.position + ";Left:0;Top:0;' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() >";
			
			htmltocont(sHtml,name) ;
			//alert(htmltocont(sHtml))
			SelectObj(sid);
			break ;
		}
		case "tree": {
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml);
			var sHtml = "<img controltype='" + name + "' id=" + sid + " isAll='true' ischecked='false'  src='../images/ef_designer_tree.gif' style='position:" + fcpubdata.position + ";Left:0;Top:0;Height:205;Width:187;BORDER: 1px solid;' class='control-border-color' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() >";
			
			htmltocont(sHtml,name) ;
			SelectObj(sid);
			break;
		}
		case "tab":{
			var sidtype=name;
			ArrNum[sidtype]++;
			var sid = getNewContID(name,oContXml) ;
			 var sHtml="<div id="+sid+" controltype='" + name + "' onresize=page_onresize() onresizestart=resizeStart() onresizeend=resizeEnd() onmovestart=moveStart() onmoveend=moveEnd() style='position:absolute;top:0px;left:0px;width:402px;height:320px'>"
						+"<table id=fcpagesubtable bgcolor=white onmousedown=pageonclick() onresizestart=CancelEvent()><tbody><tr contentEditable=false><td style='background-color:white;border-left:1px solid #8BA7B6;border-top:1px solid #8BA7B6;border-right:1px solid #8BA7B6;color:red;' width=80px height=20px align=center><font size=2>页签1</font></td><td style='background-color:white;border-left:1px solid #8BA7B6;border-right:1px solid #8BA7B6;border-top:1px solid #8BA7B6;' width=80px height=20px align=center><font size=2>页签2</font></td></tr></tbody></table>"
						+"<div id=fcpagesub style='z-index:1;background-color:white;position:absolute;top:22px;height:250px;border-left:1px solid #8BA7B6;border-bottom:1px solid #8BA7B6;border-right:1px solid #8BA7B6;border-top:1px solid #8BA7B6;' onmovestart=CancelEvent() onresizestart=CancelEvent() oncontrolselect=controlselect()></div>"
						+"<div id=fcpagesub style='background-color:white;position:absolute;top:22px;height:250px;border-left:1px solid #8BA7B6;border-bottom:1px solid #8BA7B6;border-right:1px solid #8BA7B6;border-top:1px solid #8BA7B6;' onmovestart=CancelEvent() onresizestart=CancelEvent() oncontrolselect=controlselect()></div>"
						+"</div>";	
			
			htmltocont(sHtml,name) ;			
			
			SelectObj(sid);
			break ;
		}
        case "page": 
        {
            var sidtype = name;
            ArrNum[sidtype]++;
            var sid = getNewContID(name, oContXml);
            var sHtml = "<img controltype='" + name + "' id=" + sid + " isAll='true' ischecked='false'  src='../images/ef_run_page.gif' style='position:" + fcpubdata.position + ";Left:0;Top:0;Height:320;Width:402;BORDER: 1px solid;' class='control-border-color' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() pageXml=\"<option value='页签' linkUrl=''>页签</option>\" >";
            htmltocont(sHtml, name);

            SelectObj(sid);
            break;
        }
        case "shape": 
        {
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			sidtype="Shape";
			var sHtml="<v:Rect controltype='" + name + "' id="+sid+" style='position:" + fcpubdata.position + ";Left:0;Top:0;width:100px;height:100px;' StrokeColor='#000000'  fillcolor='#ffffff' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() > "
					+" <v:stroke dashstyle='Soild' /> "    //Soild
					+"</v:Rect> ";
			
			htmltocont(sHtml,name);
			SelectObj(sid);
			break;
		}
		//流程设计器中的步骤
		
		/*
		case "wfstep":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			sidtype="wfstep";
			var width=100,height=50,X="100px",Y="100px",strokeWeight="",textWeight="";
			var sHtml= new Eapi.WfDesign().getStepHTML(sidtype,WfConfig.zIndex,sid,"新步骤",WfConfig.stepTextColor,WfConfig.stepStrokeColor,WfConfig.stepShadowColor,WfConfig.isStepShadow,width,height,X,Y,strokeWeight,textWeight,WfConfig.fillColor1,WfConfig.fillColor2,WfConfig.isStep3D,WfConfig.step3DDepth);
			
			htmltocont(sHtml,name);
			refreshAllLinePos();
			SelectObj(sid);
			break;
		}
		case "wfline":{
		    //取一个步骤节点ID
		    var id1 = getOneStepNode(oContXml);
		    if(id1 == null) {
		        alert("至少要有一个以上的步骤后才能加动作!");
		        break;
		    }
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			sidtype="wfline";
			//var width=100,height=50,X="100px",Y="100px",strokeWeight="",textWeight="";
			var sHtml= new Eapi.WfDesign().getActionHTML("PolyLine",WfConfig.zIndex,sid,BeginStep,$id(id1),WfConfig.actionStrokeColor,WfConfig.actionStrokeWeight,"","Classic");
			
			htmltocont(sHtml,name);
			refreshAllLinePos();
			SelectObj(sid);
			break;
		}
		case "wfprop":{   //流程属性
			var arrForm=new Array();
			arrForm[0]=fcpubdata.area;
			arrForm[5]=pstrUserFunction;
			var sRet=DjOpen('wfprop',arrForm,'展现',"有模式窗口","直接","流程属性");
			if(sRet == "ok"){
				blnChange=true ;
			}
			break;

		}
		case "openwffile":{   // 打开流程文件 
			var sPathValue = '';  
			var spath = '..'+sPathValue;
			if(fcpubdata.dotnetVersion == "") spath = fcpubdata.path.substring(fcpubdata.path.indexOf("/",2),fcpubdata.path.length)+sPathValue;
			var spathback = '../..'+sPathValue;
			var sRet = DjOpen('getUrl',[spath,'file','yes','wf'],'展现','有模式窗口','直接','选择文件');
			if(IsSpace(sRet) == false){
				pdjFilePath = sRet;
				var shtm=readdesignhtml("<no>"+sRet+"</no><no></no>"+"<No>"+fcpubdata.path+"</No>");
				DesignDjOpenSub(shtm,0);
			}
						
			break;

		}*/
		
		/*表格数据集*/
		/*最后修改时间：2005-01-07*/
		case "grid":{
			var sidtype=name;
			ArrNum[sidtype]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+" style='position:" + fcpubdata.position + ";Left:0;Top:0;Height:140;Width:300;' src='../images/ef_designer_webgrid.gif' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() >";	
			htmltocont(sHtml,name) ;
			SelectObj(sid);
			break ;
		}
		/*主数据集属性*/
		case "dataset":{   
			var no=1;
			var sidtype=name;
			ArrNum[sidtype]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+" opensortno="+no+" style='position:absolute;Left:5;Top:5;Height:47;Width:39;' src='../images/ef_designer_dataset.gif' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() >";	
			htmltocont(sHtml,name) ;
			SelectObj(sid);
			
			break ;

		}
		case "div": {
			ArrNum[name]++ ;
			var sid = getNewContID(name,oContXml) ;
			var sHtml = "<div controltype='" + name + "' id=" + sid + " style='position:" + fcpubdata.position + "; left:0; Top:0; width:280; height:200;;BORDER: 1px solid;' class='control-border-color' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect()></div>"; //
			
			htmltocont(sHtml,name) ;
			SelectObj(sid);
			break ;
		}
		case "ebshow": {
			try{
				obj=ebshow1.id;
				alert("每个表单上只能有一个显示e表结果控件！");
				return;
			}catch(e){
		
				ArrNum[name]++ ;
				var sid = "ebshow1" ;
				var sHtml = "<div controltype='" + name + "' id=" + sid + " style='overflow: auto; background-color:#ffffff; position:" + fcpubdata.position + "; left:0; Top:0; width:280; height:200;;BORDER: 1px solid;' class='control-border-color' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() InHtml='" + escape('<iframe id=fcebTopic name=fcebTopic style="WIDTH:99%; height:99%;" NORESIZE=NORESIZE SCROLLING=auto MARGINWIDTH=0 MARGINHEIGHT=0 FRAMESPACING=0 FRAMEBORDER=0 ALLOWTRANSPARENCY="true"></iframe>') + "'></div>";
			
				htmltocont(sHtml,name) ;
				SelectObj(sid);
			}
			break ;
		}
		case "ebiao" :{  //e表控件
	        ArrNum[name]++;
	        var sid = getNewContID(name,oContXml) ;
	        var sHtml = "<div controltype='" + name + "' id=" + sid + " style='background-color:#ffffff; position:" + fcpubdata.position + "; left:0; Top:0; width:500; height:360;BORDER: 1px solid;' class='control-border-color' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() ondrop='new Eapi.EformEbiao().dragEnter();' ondragend='new Eapi.EformEbiao().dragExit();' ondragstart='new Eapi.EformEbiao().dragStart();' isOnloadRun='是'></div>";

	        htmltocont(sHtml,name) ;
	        SelectObj(sid);
			break ;
		
		}
		case "layout" :{  //布局控件
	        ArrNum[name]++;
	        var sid = getNewContID(name,oContXml) ;
	        var sHtml = "<div controltype='" + name + "' id=" + sid + " style='background-color:#ffffff; position:" + fcpubdata.position + "; left:0; Top:0; width:500; height:360;;BORDER: 1px solid;' class='control-border-color' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() ></div>";

	        htmltocont(sHtml,name) ;
	        SelectObj(sid);
			break ;

        }
        case "eblayout": 
        {  //布局模版控件
            ArrNum[name]++;
            var sid = getNewContID(name, oContXml);
            var sHtml = "<div controltype='" + name + "' id=" + sid + " style='background-color:#ffffff; position:" + fcpubdata.position + "; left:0; Top:0; width:500; height:360;;BORDER: 1px solid;' class='control-border-color' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() ></div>";

            htmltocont(sHtml, name);
            SelectObj(sid);
            break;

        }
		
//		case "excel": {
//			ArrNum[name]++ ;
//			var sid = getNewContID(name,oContXml) ;
//			var sHtml="<object controltype='" + name + "' classid='clsid:0002E510-0000-0000-C000-000000000046' id="+sid+" style='position:" + fcpubdata.position + "; left:0; Top:0; width:80%; height:200;'><param name='HTMLURL' value><param name='HTMLData' value='&lt;html xmlns:x=&quot;urn:schemas-microsoft-com:office:excel&quot;xmlns=&quot;http://www.w3.org/TR/REC-html40&quot;&gt;&lt;head&gt;&lt;style type=&quot;text/css&quot;&gt;&lt;!--tr{mso-height-source:auto;}td{black-space:nowrap;}.wc4590F88{black-space:nowrap;font-family:宋体;mso-number-format:General;font-size:auto;font-weight:auto;font-style:auto;text-decoration:auto;mso-background-source:auto;mso-pattern:auto;mso-color-source:auto;text-align:general;vertical-align:bottom;border-top:none;border-left:none;border-right:none;border-bottom:none;mso-protection:locked;}--&gt;&lt;/style&gt;&lt;/head&gt;&lt;body&gt;&lt;!--[if gte mso 9]&gt;&lt;xml&gt;&lt;x:ExcelWorkbook&gt;&lt;x:ExcelWorksheets&gt;&lt;x:ExcelWorksheet&gt;&lt;x:OWCVersion&gt;9.0.0.2710&lt;/x:OWCVersion&gt;&lt;x:Label Style='border-top:solid .5pt silver;border-left:solid .5pt silver;border-right:solid .5pt silver;border-bottom:solid .5pt silver'&gt;&lt;x:Caption&gt;Microsoft Office Spreadsheet&lt;/x:Caption&gt; &lt;/x:Label&gt;&lt;x:Name&gt;Sheet1&lt;/x:Name&gt;&lt;x:WorksheetOptions&gt;&lt;x:Selected/&gt;&lt;x:Height&gt;7620&lt;/x:Height&gt;&lt;x:Width&gt;15240&lt;/x:Width&gt;&lt;x:TopRowVisible&gt;0&lt;/x:TopRowVisible&gt;&lt;x:LeftColumnVisible&gt;0&lt;/x:LeftColumnVisible&gt; &lt;x:ProtectContents&gt;False&lt;/x:ProtectContents&gt; &lt;x:DefaultRowHeight&gt;210&lt;/x:DefaultRowHeight&gt; &lt;x:StandardWidth&gt;2389&lt;/x:StandardWidth&gt; &lt;/x:WorksheetOptions&gt; &lt;/x:ExcelWorksheet&gt;&lt;/x:ExcelWorksheets&gt; &lt;x:MaxHeight&gt;80%&lt;/x:MaxHeight&gt;&lt;x:MaxWidth&gt;80%&lt;/x:MaxWidth&gt;&lt;/x:ExcelWorkbook&gt;&lt;/xml&gt;&lt;![endif]--&gt;&lt;table class=wc4590F88 x:str&gt;&lt;col width=&quot;56&quot;&gt;&lt;tr height=&quot;14&quot;&gt;&lt;td&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;&lt;/body&gt;&lt;/html&gt;'> <param name='DataType' value='HTMLDATA'> <param name='AutoFit' value='0'><param name='DisplayColHeaders' value='-1'><param name='DisplayGridlines' value='-1'><param name='DisplayHorizontalScrollBar' value='-1'><param name='DisplayRowHeaders' value='-1'><param name='DisplayTitleBar' value='0'><param name='DisplayToolbar' value='-1'><param name='DisplayVerticalScrollBar' value='-1'> <param name='EnableAutoCalculate' value='-1'> <param name='EnableEvents' value='-1'><param name='MoveAfterReturn' value='-1'><param name='MoveAfterReturnDirection' value='0'><param name='RightToLeft' value='0'><param name='ViewableRange' value='1:65536'></object>" ;
//			htmltocont(sHtml,name) ;
//			SelectObj(sid);
//			break ;
//		}		
//		
		
		
		
		case "focus":{   /*焦点次序*/
			var sXml=TaborderXml();
			var oX = SetDom(sXml) ;
			var sX = oX.childNodes(0).childNodes.length ;
			if (RemoveRoot(sXml)!="" && sX >= 2){
				SaveoUndoOneRecord();
				var sRet=DjOpen('SKDBfocus',sXml,'展现',"有模式窗口","直接","焦点次序");
				fcpubdata.area.billtaborder=sRet;
				SaveoRedoOneRecord();
				//alert(sRet)
			}else{
				alert("有两个或以上控件才能使用此控制！");
			}
			
			break;
		}
		case "align":{   /*对齐面板*/
			sArray=CurrSel();
			if(sArray.length<2){
				alert("选中两个或以上控件才能使用此控制");
				break;
			}
			//alert(sArray.length)
			if(sArray !=""  ){
			   SaveoUndoOneRecord();
		       var sRet=DjOpen('SKDBalign',sArray,'展现',"有模式窗口","直接","对齐面板");
		       SaveoRedoOneRecord();
			}    
			break;

		}
		case "menu":{
			var str = DjOpen('menu','','展现',"无模式窗口","直接","");
			break;
		}
		case "cut":	//---剪切
			if(CopyCont()){ 
				main_onkeydown(46);
				main_exec('Delete');
				main_onkeyup(46);
				//event.returnValue=false ;
			}
			break;
		case "copy":	//---复制
			if(CopyCont() == false){
				document.execCommand("Copy") ;
			}
			break;
		case "paste":	//---粘贴
			
			if(PasteCont() == false){
				document.execCommand("Paste") ;
			}
			break;

		case "front":{	/*前置*/
			AdjustPositionBefore("是");
			break;
		}
		case "behind":{	/*后置*/
			AdjustPositionBefore("否");
			break;
		}
		/*
		case "dsmain":{   
		
			arrtmp1[0]=pubDsMain ;
			arrtmp1[2]=fcpubdata.area ;
			var sRet=DjOpen('SKBILLgrid',arrtmp1,'展现',"有模式窗口","直接","主数据集属性") ;
			blnChange=true ;
			break;

		}*/
		case "formatTab":{ /*版式表格*/
			var Htm = DjOpen('fcs_NewFormatTab','SKbillsheet','展现',"有模式窗口","直接","新建版式表格") ;
			if(typeof Htm == 'undefined') {
				fcpubdata.area.innerHTML += "";
			}else{
				htmltocont(Htm);
			}
			blnChange=true ;
			break;
		}
		case "HtmlTab":{  /*HTML表格*/
			var sHTab = DjOpen('fcs_NewHtmlTab',fcpubdata,'展现',"有模式窗口","直接","新建表格") ;
			if(typeof sHTab == 'undefined') {
				fcpubdata.area.innerHTML += "";
			}else{
				try{
					htmltocont(sHTab) ;
				}catch(e){}
			}
			blnChange=true;
			break ;
		}
		case "form":{   /*表单属性*/
			//sArray=CurrSel();
			var arrForm=new Array();
			arrForm[0]=fcpubdata.area;
			arrForm[5]=pstrUserFunction;
			var sRet=DjOpen('form',arrForm,'展现',"有模式窗口","直接","表单属性");
			if(sRet == "ok"){
				var iwidth=0;
				if(isSpace(fcpubdata.area.poswidth) == false ){
					iwidth = parseInt(fcpubdata.area.poswidth);
					if(bigmain.offsetWidth<iwidth){
						bigmain.style.width = iwidth;
					}
				}
				var iheight=0;
				if(isSpace(fcpubdata.area.posheight) == false ) {
					iheight = parseInt(fcpubdata.area.posheight);
					if(bigmain.offsetHeight<iheight){
						bigmain.style.height = iheight;
					}
				}
				blnChange=true ;
			}
			break;

		}
		case "listconfig":{   /*列出本表单的所有配置信息供集中查看*/
			DjOpen("FormElementInfo",window,"展现","有模式窗口","直接","列出本表单的配置信息");
			break;
		}
		
		case "ebiaoform":{   /*ebiao 表单属性*/
			var obj = parent.dialogArguments[0]; //e报表table对象.
			var s1 = obj.eform_winprop;
			if(typeof s1 == "undefined") s1="";
			var sRet=DjOpen('eb_parawin',[s1,fcpubdata.area],'展现',"有模式窗口","直接","设置窗口相关属性");
			if(IsSpace(sRet) == false){
				obj.eform_winprop = sRet;
			}
		
			break;
		}
case "ebiaobind": 
    {   /*ebiao 参数绑定*/
        /*if(curSelElement == null )
        {
        alert("请在界面上选中一个控件后再试!");
        break;
        }
        var tmpType = curSelElement.controltype ; 
        if(tmpType != "text"  && tmpType != "checkbox"  && tmpType != "radio"  && tmpType != "listbox"  && tmpType != "combobox"  && tmpType != "dropdownlist"  && tmpType != "textarea"  && tmpType != "spin"){
        alert("当前选中的控件不能绑定!");
        break;
        }
        var s2 =curSelElement.id ;
        if(IsSpace(s2) ) {
        alert("当前选中的控件的id不能为空!");
        break ;
        }*/
        var obj = parent.dialogArguments[0]; //e报表table对象.
        var s1 = obj.e_argsbak;
        if (typeof s1 == "undefined") s1 = "";
     
        var sRet = DjOpen('eb_parabind', [s1, oContXml], '展现', "有模式窗口", "直接", "选择报表参数的绑定控件");
        if (IsSpace(sRet) == false) {
            obj.e_argsbak = sRet;
        }

        break;
    }
		case "userfunction":{   /*自定义函数*/
			var stmp=DjOpen('userfunction',pstrUserFunction,'展现',"有模式窗口","直接","自定义函数");
			if(typeof stmp != "undefined") pstrUserFunction=stmp;
			blnChange=true ;
			break;

		}
		case "userfunction1":{   /*用codemax的自定义函数*/
			try{
				var l=new ActiveXObject("CodeMax.Language.3");
			}catch(e){
				if(window.confirm("没有安装codemax或是IE的安全设置属性框中对没有标记为安全的activex控件进行初始化和脚本运行的选项没为启动；是否下载安装codemax!")==true){
					window.open("../design/download.htm","","height=250,width=300,left=300,top=150,resizabel=no,menubar=no") ;
				}
				break;
			}
			var stmp=DjOpen('userfunction1',pstrUserFunction,'展现',"有模式窗口","直接","带颜色的自定义函数");
			if(typeof stmp != "undefined") pstrUserFunction=stmp;
			//blnChange=true 
			//break;
			//CopyToPub("aa:"+pstrUserFunction);
			//var stmp=window.showModalDialog("../design/codemax.htm",pstrUserFunction,"status:no;dialogHeight:570px;dialogWidth:780px;center:yes;resizable:yes")  
			//if(typeof stmp != "undefined") pstrUserFunction=stmp
			
			//pstrUserFunction=DjOpen('userfunction',pstrUserFunction,'展现')
			blnChange=true ;
			break;
        }
    case "userfunction_codemirror":
        {   /*自定义函数*/
            var url = "../../fceform/codemirror/codeedit.htm";
            var fileName = "newJs";
            if (!IsSpace(fcpubdata.area.dj_sn)) fileName = fcpubdata.area.dj_sn;
            var winName = fcpubdata.area.type +"_"+fileName;
            var titleName = "*" + fileName ;
            //if (typeof (top.CreateNewTabWin) == "function") {
            //    top.CreateNewTabWin(url, titleName, "");

            //}
            var textarea_code = new Object();
            textarea_code.value = pstrUserFunction;
            textarea_code.title = titleName;
            textarea_code.winName = winName;
            window.textarea_code = textarea_code;
            window.open(url, winName, "toolbar=no,menubar=no,status=no");
            blnChange = true;
            break;

        }
		
		case "addhtml":{   /*附加页面*/
			var stmp=DjOpen('addhtml',pstrAddHtml,'展现',"有模式窗口","直接","附加页面");
			if(typeof stmp != "undefined") pstrAddHtml=stmp;
			blnChange=true ;
			break;

		}
		case "opendj":{   /*打开表单*/

			var sRet=DjOpen('opendj','','修改',"有模式窗口","直接","选择从数据库中打开的表单");
			//alert(sRet)
			if(isSpace(sRet)==false){
				DesignDjOpen(sRet);
			}
			
			break;

		}
case "opendjfile": 
    {   /* 打开表单文件 */
        //var sPathValue = '';  // /fceform/djfile
        //var spath = '..' + sPathValue;
        //if(fcpubdata.dotnetVersion == "") spath = fcpubdata.path.substring(fcpubdata.path.indexOf("/",2),fcpubdata.path.length)+sPathValue;
        //var spathback = '../..' + sPathValue;
        var spath = '';
        var sRet = DjOpen('getUrl', [spath, 'file', 'yes', 'dj'], '展现', '有模式窗口', '直接', '选择文件');
        if (IsSpace(sRet) == false) {
            //obj.value ="../"+ spath+sRet;	//因eformaspx目录比当前表单页面所在目录高一层
            pdjFilePath = sRet;
            //var shtm=readdesignhtml("<no>"+sRet+"</no><no></no>"+"<No>"+fcpubdata.path+"</No>");
            var shtm = readdesignhtml("<file>" + sRet + "</file>");
            DesignDjOpenSub(shtm, 0);
        }


        break;

    }
		
		case "save":{   /*保存表单*/
			DesignDjSave() ;
			//AutoAddQueryDj();
			blnChange=false;
			//起始页
			//SetPara("origPage",)
			break;

		}
		case "saveas":{   /*另存表单*/
			DesignDjSaveAs() ;
			blnChange=false;
			break;

		}
		case "new":{   /*新建表单*/
			parent.objlist.select1.options.length = 0;
			DesignDjNew("是") ;
			//blnChange=false;

			break;

		}
		case "newempty":{   /*新建空表单*/
			parent.objlist.select1.options.length = 0;
			DesignDjNew() ;
			//blnChange=false;

			break;

		}
		
		case "djpreview":{   /*表单预览*/
			var djsn=fcpubdata.area.dj_sn;
			if(typeof djsn == "undefined"){
				alert("请进入表单属性窗口输入了单据sn后才能预览!");
				return ;
			}
			if(blnChange){
				var stmp = DesignDjSave("不提示") ;
				if(IsSpace(stmp) == false) {
					//alert(stmp) ;
					return ;
				}
			}
			var sUrl=location.protocol + "//"+location.host+fcpubdata.path+"/fceform/design/opendj.htm?djsn=" ;
			var isfile=fcpubdata.area.isfile;
			if(isfile == "是"){
				var objBillType = BillTypeNameToPath(fcpubdata.area.type);
				sUrl += "/" + objBillType.path + djsn + "&isfile=yes";
			} else {
				sUrl += djsn + "&isfile=test" ;
			}
			open(sUrl);
			break;

		}
		case "directrun":{   /*表单直接运行*/
			var djsn=fcpubdata.area.dj_sn;
			if(typeof djsn == "undefined"){
				alert("请进入表单属性窗口输入了单据sn后才能预览!");
				return;
			}
			/*
			var isfile=fcpubdata.area.isfile;
			if(isfile == "是"){
				alert("文件表单无法直接运行，只有将表单保存在数据库中时才能直接运行!");
				return;
			}*/

			if(blnChange){
				var stmp = DesignDjSave("不提示") ;
				if(IsSpace(stmp) == false) {
					//alert(stmp) ;
					return ;
				}
			}
			var sUrl=location.protocol + "//"+location.host+fcpubdata.path+"/fceform/common/djframe.htm?djsn="+djsn+"&djtype="+fcpubdata.area.type ;
			open(sUrl);
			break;

		}
		case "billtype":{   /*表单分类维护*/

			var sRet=DjOpen('billtypefile','','展现',"有模式窗口","直接","表单分类维护");
			break;

		}
		case "createhtmfile":{   /*生成正式运行的HTM文件*/
			if(isSpace(fcpubdata.area.dj_sn)){
				var s1 = '表单sn不能为空!请进入表单属性窗口输入表单SN.';
				alert(s1);
				return ;
			}
		
			//由设计界面计算出运行串
			DesignStr_RunStr_Before(fcpubdata.area);
			fcpubdata.area.removeAttribute("contentEditable");
			fcpubdata.area.removeAttribute("unselectable");

			//由设计转为运行串
			var sRun=fcpubdata.area.outerHTML;
			
			sRun=DesignStr_RunStr_After(sRun);
			//运行串=函数串+处理后的设计串+附加页面串	
			sRun="<scr"+"ipt>"+pstrUserFunction+"</scr"+"ipt>"+sRun+pstrAddHtml	;
			
			//将运行串保存为HTM文件
			sRun="<![CDATA["+sRun+"]]>";
			var sFile = new Eapi.Str().trim(fcpubdata.area.dj_sn) + ".htm";
			var sPath = "fceform/dj/" + sFile; //fceform开始的路径文件名
			//var sXml = "<no>djsn</no><no>"+sRun+"</no><no>" + sPath + "</no>"+"<No>"+fcpubdata.path+"</No>";
			var sXml = "<file>/" + sPath + "</file><text>"+sRun+"</text>";
			var ret=savedesignhtml(sXml);
			if(ret == "") {
				alert(sFile+"文件保存成功!");
				return "";
			}else{
				alert(ret);
				return ret;
			}					
			break;

		}
		case "undo" : { cmdUndo() ; break ;}
		case "redo": { cmdRedo(); break; }
		default:
		    {
		        ArrNum[name]++;
		        var sid = getNewContID(name, oContXml);
		        //		        var sHtml = "<div controltype='" + name + "' id=" + sid + " style='position:" + fcpubdata.position + "; left:0; Top:0; width:280; height:200;;BORDER: 1px solid;' class='control-border-color' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect()></div>"; //

		        var oo = new Eform.AllWidget().getDesignObj(name);
		        var sHtml = oo.getDefaultHtml(sid, fcpubdata.position);

		        htmltocont(sHtml, name);
		        SelectObj(sid);

		        oo.addAfter();
		        
		        break;
		    }
		
			
	}
	//加控件时加上数据集中的内容
	if(fcpubdata.autoAddField == "yes" && oAddField != null && $id("DsMain") != null ){
		 
		var s = $id("DsMain").formatxml ;
		var curNo = 0;
		if(typeof s == "undefined"){
			s = ""
		}else{
			s = RemoveRoot(s);
			curNo = getMaxFieldNo();
		}
		var sF = '<tr><td>field'+ curNo +'</td><td>field'+ curNo +'</td><td>字符</td><td>50</td><td>0</td><td>数据项</td><td></td><td></td><td>否</td><td>否</td><td>否</td><td>否</td><td>是</td><td>否</td><td>否</td><td>否</td><td></td><td></td><td>left</td><td>80</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
		$id("DsMain").formatxml = "<root>"+s+sF+"</root>";
		oAddField.dataset = "DsMain";
		oAddField.field = "field"+curNo;
		
		
	}
	
	//找最大流水号作字段名
	function getMaxFieldNo() {
		var comType = "DsMain_field";
		var curNo = 0;
		if(isNaN(parseInt(ArrNum[comType])) == false){ ; //当前本控件类型的最大编号,int型
			curNo = parseInt(ArrNum[comType]) ;
		}
		var oXml = SetDom($id("DsMain").formatxml);
		if(oXml.documentElement != null){
			for(var i=curNo;i<curNo+200;i++){
				var oNode = oXml.documentElement.selectSingleNode("/root/tr/td[0][.= 'field" + i + "']");
				if(oNode == null){
					ArrNum[comType]=i+1;
					return i;
				}
			}
			alert("DsMain数据集的字段名重复，请立即修改。");
		}
		
		return curNo;
	}
	//前置/后置
	function AdjustPositionBefore(yes) {
		//当前表单控件个数
		var slen=oContXml.selectNodes("//id").length;
		if(slen<2){
			alert("单个控件不能设置此控制");
			return;
		}
		var sArray=CurrSel();
		ilen=sArray.length;
		if (ilen>0){
			SaveoUndoOneRecord();
			var oParent = sArray[0].parentNode;
			var parentid = oParent.id;
			var strHtm="";
			for(var i=0;i<ilen;i++){
				upid=sArray[i].parentNode.id;
				if(upid==parentid){
					stmp=sArray[i].outerHTML;
					sArray[i].outerHTML="";
					strHtm=strHtm+stmp;
				}
			}
			var ss=oParent.innerHTML;
			if(yes == "是"){
				oParent.innerHTML=ss+strHtm ;
			}else {
				oParent.innerHTML=strHtm+ss ;
			
			}
			try{ refreshAllLinePos();}catch(e){}
			
			blnChange=true ;
		    SaveoRedoOneRecord();
		}
		
	}
}

/**
//执行表单设计保存
*@date 2004-08-04
**/
function designdjsave(sXml) {
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=designdjsave",sXml);
	return retX;
}
/**
*保存设计串到文件并返回出错信息
**/
function savedesignhtml(sXml) {
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=savedesignhtml",sXml);
}

/**
*把数据存到数据缓存中
*@param Main 为主key, 如"List".
*@param Sub 为子key,如"CustomerFlag"
*@param userData 指定userData的位置
*@param strContent 为要存入的内容
*@return 无返回
*/
function SavePubData(Sub,strContent,userData){
	if(typeof(parent.menu.oForm) == "undefined" ) return ;
	var Main="pubdata";
	if(typeof userData == "undefined")
		userData=parent.menu.oForm.oInput ;
	userData.setAttribute(Main+userData.value,strContent) ;
	userData.save(Sub+userData.value) ;
}
/**
*从数据缓存中装入到变量中
*@param Main 为主key, 如"List".
*@param Sub 为子key,如"CustomerFlag"
*@param userData 指定userData的位置
*@return 返回取出的内容
*/
function LoadPubData(Sub,userData){
    if(typeof(parent.menu.oForm) == "undefined" ) return "";
	var Main="pubdata";
	try {
	    if (typeof userData == "undefined")
	        userData = parent.menu.oForm.oInput;
	    userData.load(Sub + userData.value);
	    var sTmp = userData.getAttribute(Main + userData.value);
	    if (sTmp == null) { sTmp = ""; }
	    return sTmp;
	} catch (e) {
	    return "";
	}

}

/**
*新增控件和粘贴控件时自动求得最新ID
*@param comType 控件类型
*@param oContXml 当前页面的ID 的dom对象
*@return 字符串,得到不重复的ID名称
*@date 2005-01-16
**/
function getNewContID(comType,oContXml){
	var sRet = "id1" ;
	var curNo = 1 ;
	if(isNaN(parseInt(ArrNum[comType])) == false){ ; //当前本控件类型的最大编号,int型
		curNo = parseInt(ArrNum[comType]) ;
	}
	for(var i=curNo;i<curNo+200;i++){
		var sid = comType+i ;
		var oList = oContXml.documentElement.selectNodes("//id[. ='"+sid+"']") ;
		if(oList.length == 0 ) {
			ArrNum[comType] = i ;
			return sid ;
		}
	}
	alert(sid + "控件名称重复!请立即修改!");
	return sid;

}
function isHaveControlType(controlType) {
///判断是否是旧的控件类型，2013-03-18
    for (var i = 0; i < 36; i++) {
        if (ArrName[i] == controlType) return true;
    }
    return false;
}
/**
* 在控件上双击时,出属性框
**/
function main_ondblclick(obj) {

	var arr=new Array();
	if(typeof obj == "undefined"){
		try {
			var obj=event.srcElement;
		}catch(e){
			obj=curSelElement;
		}
	}else{
		try { //怕出错
			parent.topic.focus();
		}catch(e) {}
	}
	if(obj == null) {
		Addobj('form');
		return;
	}
	if(typeof obj.tagName=="undefined"){
		obj=curSelElement;
	}
	
	var strid=obj.id;
	if(isSpace(strid)){
		//处理checkbox点到内部内容的情况
		try {
			var stmp1 = obj.parentNode.controltype;
			if( stmp1 =="checkbox"){
				obj=obj.parentNode;
				strid=obj.id;
			}
		} catch(e) {}
		
		//如果点在页签控件的table上则让它返回
/*		
		var sTag = obj.tagName
		if(isSpace(sTag) == false ) sTag = sTag.toUpperCase() ;
		if(sTag == "TD" || sTag == "TR" || sTag == "TABLE" || sTag == "FONT"){
			return
		}
		*/
		//-----------------------------------
	}
    if(strid == "fcpagesub") return;
    
	arr[0]=obj;
	arr[1]=SelFieldToArr();
	arr[2]=fcpubdata.area;
	arr[3]=oContXml;  //当前表单的控件名称的XML对象
	//try {
	    //改取顶层窗口,2011-03-15
	    arr[4] = getTopWin(); // Printer; //eprint使用
	//}catch(e){}
	arr[5]=pstrUserFunction; 
	arr[6]= window; //2008-10-29 add,用于做工作流设计器中属性表单
	SaveoUndoOneRecord();

	var arrCur = CurrSel();
	if(arrCur.length>1){
		arr[0]=arrCur;
		var sRet=DjOpen('pubAttr',arr,'展现','有模式窗口','直接','设置多个控件的属性');

    } else {
        var controlType = obj.controltype;
		if(isSpace(controlType) == false ){
			if(controlType == "ebiao"){
			    var oTable = new Eapi.EformEbiao().open(obj);
			    arr[7] = oTable; 
			    var oRet = window.showModalDialog("../ereport/ebdesign.htm",arr,"center:yes;dialogWidth:800px;dialogHeight:600px;resizable:yes");
			    new Eapi.EformEbiao().ret(obj,oRet,oTable) ;
			}else{
			//				var sRet=DjOpen("../../fceform/common/djframe.htm?djsn="+obj.controltype+"&djtype=ST",arr,'展现','有模式窗口','直接',obj.controltype+'属性');
			if (isHaveControlType(controlType)) {
			        
			        var sRet = DjOpen(controlType, arr, '展现', '有模式窗口', '直接', controlType + '属性');
			    } else {
			        
			        var oo = new Eform.AllWidget().getDesignObj(controlType);
    			    oo.propBefore();
    			    var sRet = DjOpen("../../fceform/common/djframe.htm?djtype=WG&djsn="+controlType, arr, '展现', '有模式窗口', '直接', controlType + '属性');
    			    oo.propAfter();
                    
			    }
				if(controlType == "dataset"){
					//刷新设计页面的字段列表
					ShowAllField();
				}
			}
		}else {	//为了兼容以前的模式
	
			var bool = false;
			var ArrNameNew=new Array();
			ArrNameNew["SKButton"]="SKButton";
			ArrNameNew["SKDBedit"]="SKDBedit";
			ArrNameNew["SKDBcheckbox"]="checkbox";
			ArrNameNew["Label"]="label";
			ArrNameNew["SKDBRadioGroup"]="radio";
			ArrNameNew["SKDBListBox"]="listbox";
			ArrNameNew["SKDBMemo"]="textarea";
			ArrNameNew["SKDBcombobox"]="combobox";
			ArrNameNew["password"]="password";
			ArrNameNew["SKuploadfile"]="upload";
			ArrNameNew["SKDBtext"]="SKDBtext";
			ArrNameNew["SKDBchart"]="chart";
			ArrNameNew["SKDBImage"]="dbimg";
			ArrNameNew["Image"]="img";
			ArrNameNew["SKBILLgrid"]="SKBILLgrid";
			ArrNameNew["Shape"]="shape";
			ArrNameNew["PageControl"]="tab";
			ArrNameNew["FCDiv"]="div";
			ArrNameNew["SKDBTreeView"]="SKDBTreeView";
			ArrNameNew["SKDBLike"]="a";
			ArrNameNew["FCButton"]="button";
			ArrNameNew["FCDBedit"]="text";
			ArrNameNew["HR"]="hr";
			ArrNameNew["divcheckbox"]="checkboxlist";
			ArrNameNew["divradio"]="radiolist";
			ArrNameNew["fccode"]="textarea";
			ArrNameNew["imgwebgrid"]="grid";
			ArrNameNew["imgdataset"]="dataset";
			ArrNameNew["NumEdit"]="spin";
			ArrNameNew["excel"]="excel";
			ArrNameNew["Tree"]="tree";

			var ArrName1=new Array();
			ArrName1[0]="SKButton";
			ArrName1[1]="SKDBedit";
			ArrName1[2]="SKDBcheckbox";
			ArrName1[3]="Label";
			ArrName1[4]="SKDBRadioGroup" ;
			ArrName1[5]="SKDBListBox"
			ArrName1[6]="SKDBMemo"
			ArrName1[7]="SKDBcombobox"
			ArrName1[8]="password" ;
			ArrName1[9]="SKuploadfile" ;
			ArrName1[10]="SKDBtext";
			ArrName1[11]="SKDBchart";
			ArrName1[12]="SKDBImage";
			ArrName1[13]="Image";
			ArrName1[14]="SKBILLgrid";
			ArrName1[15]="Shape";
			ArrName1[16]="PageControl";
			ArrName1[17]="FCDiv";
			ArrName1[18]="SKDBTreeView";
			ArrName1[19]="SKDBLike" ;
			ArrName1[20]="FCButton" ;
			ArrName1[21]="FCDBedit" 
			ArrName1[22]="HR" ;
			ArrName1[23]="divcheckbox" ;
			ArrName1[24]="divradio" ;
			ArrName1[25]="fccode" ;
			ArrName1[26]="imgwebgrid" ;
			ArrName1[27]="imgdataset" ;
			ArrName1[28]="NumEdit" ;
			ArrName1[29]="excel"	;	
			ArrName1[30]="Tree"	;		
			
			var l=ArrName1.length;
			for (var i=0;i<l;i++){
				if (strid.indexOf(ArrName1[i])==0){
					var sRet=DjOpen(ArrNameNew[ArrName1[i]],arr,'展现','有模式窗口','直接',ArrNameNew[ArrName1[i]]+'属性');
					bool = true;
					break;
				}
			}
			if(bool == false ) {
				var sTag = obj.tagName;
				if(isSpace(sTag) == false ) {
					sTag = sTag.toUpperCase() ;
					//外部控件只处理这些
					if(sTag == "INPUT" || sTag == "SELECT" || sTag == "TEXTAREA" || sTag == "BUTTON" || sTag == "A" || sTag == "IMG") {
						//set controltype setting_controltype
						if (obj.NotShowCtrlType != "是")
						    var sRet=DjOpen('SetCtrlType',arr,'展现','有模式窗口','直接','属性');
					}
				}
			}
		}
		SaveoRedoOneRecord();
	return;
	}
}
/**
从界面上得到可供选择的数据集字段信息，放入数组中
*@date 2004-07-27
**/
function SelFieldToArr(){
	var arr=new Array();
/*	
	var sOption="<option value='DsMain' selected >DsMain</option>"
	arr[0]=sOption
	arr['DsMain']=pubDsMain.formatxml
	var o=fcpubdata.area.all.tags('img')
	var iLen=o.length;
	for(var i=0;i<iLen;i++){
		if(typeof o[i].dsid != "undefined"){
			sOption+="<option value='"+o[i].dsid+"'>"+o[i].dsid+"</option>"
			arr[o[i].dsid]=o[i].formatxml			
		}
	}
	arr[0]=sOption
	*/
	if (IsSpace(oContXml) == false){
	    var oNode = oContXml.documentElement.selectSingleNode("dataset");
	    if(oNode != null) {
		    var l = oNode.childNodes.length;
		    var sOption = new Sys.StringBuilder();
		    for(var i=0;i<l;i++){
			    var id = oNode.childNodes(i).text;
			    var ods=eval(id);
			    sOption.append( "<option value='"+id+"'>"+id+"</option>");
			    arr[id]=ods.formatxml;
		    }
    		
		    arr[0]=sOption.toString();
        }
	}
	return arr;

}

/**
*删除所有的oUndo与oRedo对象中的节点
**/
function initoUndooRedo(){
	lngUndo=-1;//childNodes.item(0)从0开始
	lngRedo=-1;
	//cmdUndo.disabled =true
	//cmdRedo.disabled =true
	oUndo.loadXML("<root></root>");
	oRedo.loadXML("<root></root>");
}
/**
*增加一行oRedo对象的记录，按先进先出的规则，保持只有8条记录
**/
function SaveoRedoOneRecord(){
	var root = oRedo.documentElement;	
	var newNode = oRedo.createNode (1, "record", "");
	root.appendChild(newNode);
	var newElem = oRedo.createElement("contxml");
	newNode.appendChild(newElem);
	newNode.lastChild.text = escape(oContXml.documentElement.xml);
	
	var newElem = oUndo.createElement("SKbillsheet");
	newNode.appendChild(newElem);
	newNode.lastChild.text = escape(fcpubdata.area.outerHTML);

	//var newElem = oRedo.createElement("oFormula")
	//newNode.appendChild(newElem)
	//newNode.lastChild.text = escape(oFormula.documentElement.xml)
	if (oRedo.documentElement.childNodes.length >8)	{
		DeleteoRedoOneRecord(0);
	}	
}
/**
*增加一行oUndo对象的记录，按先进先出的规则，保持只有8条记录
**/
function SaveoUndoOneRecord(){
	var root = oUndo.documentElement	;
	var newNode = oUndo.createNode (1, "record", "");
	root.appendChild(newNode);
	var newElem = oUndo.createElement("contxml") ;
	newNode.appendChild(newElem);
	newNode.lastChild.text = escape(oContXml.documentElement.xml);

	var newElem = oUndo.createElement("SKbillsheet"); //表格
	newNode.appendChild(newElem);
	newNode.lastChild.text = escape(fcpubdata.area.outerHTML);

	//var newElem = oUndo.createElement("oFormula")
	//newNode.appendChild(newElem)
	//newNode.lastChild.text = escape(oFormula.documentElement.xml)
	
	lngUndo=lngUndo+1;	
	//cmdUndo.disabled =false//可以undo
	if (oUndo.documentElement.childNodes.length >8)	{
		DeleteoUndoOneRecord(0);
		lngUndo=7;//从0-7
	}	
}
/**
*读出一行oUndo对象的记录	
**/
function ReadoRedoOneRecord(lngKey){
	oContXml=SetDom(unescape(oRedo.documentElement.childNodes(lngKey).childNodes(0).childNodes(0).xml));
	fcpubdata.area.outerHTML=unescape(oRedo.documentElement.childNodes(lngKey).childNodes(1).childNodes(0).xml);
	fcpubdata.area = $id("SKbillsheet");
	openobjlist();
	//oFormula.loadXML (unescape(oRedo.documentElement.childNodes.item(lngKey).childNodes.item(2).childNodes.item(0).xml))
}
/**
*读出一行oUndo对象的记录	
**/
function ReadoUndoOneRecord(lngKey){
	oContXml=SetDom(unescape(oUndo.documentElement.childNodes(lngKey).childNodes(0).childNodes(0).xml));
	fcpubdata.area.outerHTML=unescape(oUndo.documentElement.childNodes(lngKey).childNodes(1).childNodes(0).xml);
	fcpubdata.area = $id("SKbillsheet");
	openobjlist();
	//grid.reload(t.outerHTML)
	//tCopy.outerHTML=unescape(oUndo.documentElement.childNodes.item(lngKey).childNodes.item(1).childNodes.item(0).xml)
	//oFormula.loadXML (unescape(oUndo.documentElement.childNodes.item(lngKey).childNodes.item(2).childNodes.item(0).xml))
}
/**
*删除Redo一行记录，按先进先删的规则，保持只有8条记录
* intR=0删除第一个节点
**/
function DeleteoRedoOneRecord(intR){
	oRedo.documentElement.removeChild(oRedo.documentElement.childNodes.item(intR));
}
/**
*删除Undo一行记录，按先进先删的规则，保持只有8条记录
* intR=0删除第一个节点
**/
function DeleteoUndoOneRecord(intR){
	oUndo.documentElement.removeChild(oUndo.documentElement.childNodes.item(intR));	
}
/**
*工具栏上的Redo按钮的点击事件
**/

function cmdRedo(){	
		
	var intMaxR=oRedo.documentElement.childNodes.length - 1;//当前oRedo对象中的最大记录数
	if (lngRedo>=0 && lngRedo<=intMaxR){
		ReadoRedoOneRecord(lngRedo);//读出当前undo对应的值
		lngUndo=lngRedo;
		lngRedo=lngRedo+1;
		//cmdUndo.disabled =false//做了一步redo则undo肯定可以做
	}
	//if (lngRedo>intMaxR && lngRedo<0){
		//cmdRedo.disabled =true //肯定不能做redo的功能
	//}	
	window.focus();
	fcpubdata.area.focus();
}
/**
*工具栏上的Undo按钮的点击事件
**/
function cmdUndo(){	
	//SaveoRedoOneRecord();
	var intMaxR=oUndo.documentElement.childNodes.length - 1;//当前oRedo对象中的最大记录数
	if (lngUndo>=0 && lngUndo<=intMaxR){
		ReadoUndoOneRecord(lngUndo);	
		lngRedo=lngUndo;
		lngUndo=lngUndo - 1;		
		//cmdRedo.disabled =true//做了一步undo则redo肯定可以做
	
		//clearBlueScale()
	}
	/*if (lngUndo<=0 && lngUndo>intMaxR){
		cmdUndo.disabled =true//undo肯定不可以做
	}
	if (lngUndo>=intMaxR && lngUndo<0){
		cmdRedo.disabled =true//redo肯定不可以做
	}*/
	window.focus();
	fcpubdata.area.focus();
}
function resizeStart(){
	SaveoUndoOneRecord();
}
function resizeEnd() {
    //修改shape的拖动
    AdjustShapePos(event.srcElement);
	SaveoRedoOneRecord();
}
function AdjustShapePos(objEvent) {
    //修改shape的拖动 2011-07-08

    if (objEvent.controltype == "shape") {
        var s1 = objEvent.style.width;
        var s2 = objEvent.style.height;
        var sType = objEvent.linetype;
        var sFrom = "";
        var sTo = "";
        if (sType == '横线' || sType == '右箭头' || sType == '左箭头') {
            sFrom = "0,0";
            sTo = s1 + ",0";
        }
        if (sType == '竖线' || sType == '上箭头' || sType == '下箭头') {
            sFrom = "0,0";
            sTo = "0," + s2;
        }
        if (sType == '左斜线' || sType == '左下斜箭头' || sType == '右上斜箭头') {
            sFrom = "0," + s2;
            sTo = s1 + ",0";
        }
        if (sType == '右斜线' || sType == '左上斜箭头' || sType == '右下斜箭头') {
            sFrom = "0,0";
            sTo = s1 + "," + s2;
        }
        if (sFrom == "" && sTo == "") return;
        objEvent.from = sFrom;
        objEvent.to = sTo;
    }

}

function moveStart(){
	SaveoUndoOneRecord();
}
function moveEnd(){
	SaveoRedoOneRecord();
}
/**
*判断当前选中的控件是否为容器
*@return true 是容器,否则为null或非容器
*@date 2005-02-26
**/
function IsDivCont() {
	if(curSelElement == null) return false;
	//|| curSelElement.id.indexOf("PageControl")>=0
	if (curSelElement.id == "fcpagesub"  || curSelElement.controltype == "div" || curSelElement.controltype == "tab") return true;
	
	return false;

}
/**
将HTML串加到控件上,增加ArrCom数组
@param sHtml 要加的HTM串
@param comName 当前控件类型名称
@param NotOne == "是" 表示一次加多个控件,用于粘贴控件
@date 2004-06-07
**/
function htmltocont(sHtml,comType,NotOne){
	SaveoUndoOneRecord();
	
	if(curSelElement==null ){
		fcpubdata.area.innerHTML+=sHtml;
	}else if(curSelElement.id=="fcpagesub" ){
		curSelElement.innerHTML+=sHtml;
	}else if(curSelElement.controltype =="tab"){
		var l=curSelElement.childNodes.length;
		for(var i=1;i<l;i++){
			if(curSelElement.childNodes(i).style.zIndex==1){
				curSelElement.childNodes(i).innerHTML+=sHtml;
				break;
			}
		}
	}else if ((curSelElement.controltype == "div" && comType != "div") || curSelElement.tagName == "TD") {
		curSelElement.innerHTML += sHtml;
	}else if(curSelElement.controltype =="ebiao" && curSelElement.innerHTML != ""){ //
        //判断是否有可用的单元格
        var oTd = new Eapi.EformEbiao().getEmptyTd(curSelElement);
        if(oTd == null){
            alert("没有能够装控件的单元格,控件将被加到外面.");
            fcpubdata.area.innerHTML+=sHtml;
        }else{ //控件放到单元格中.
            oTd.backupValue = oTd.innerText;
            oTd.innerHTML = sHtml;
            var oDrag = oTd.childNodes(0);
            oDrag.style.position="static";
            oDrag.style.width="100%";
            oDrag.style.height="100%";

	        
        }
	}else {
		fcpubdata.area.innerHTML+=sHtml;
	}	
	

	//增加一个控件后修改全局的oContXml对象
	if(NotOne == "是"){
		//在粘贴处的调用此函数之后再处理
	}else {
		try{
			AddContXml(comType);
		}catch(e){}
	}
	blnChange = true;
	SaveoRedoOneRecord();
	//alert(oContXml.documentElement.xml)
}
/**
*增加一个控件后修改全局的oContXml对象
*@param comType 控件类型名称
*@param contID  要加的控件的ID
**/
function AddContXml(comType,contID) {
	if(isSpace(contID)) contID = comType + ArrNum[comType];
	//如此ID已存在,则不加
	var oNode = oContXml.documentElement.selectSingleNode("//id[. ='"+contID+"']") ;
	if(oNode != null) return;
	
	var oNode = oContXml.documentElement.selectSingleNode(comType) ;
	if(oNode == null) {
		var sxml = "<"+comType+"><id>" + contID + "</id></"+comType+">";
		var oX = SetDom(sxml);
		oContXml.documentElement.appendChild(oX.documentElement);
		
	}else {
		var sxml = "<id>" + contID + "</id>";
		var oX = SetDom(sxml);
		oNode.appendChild(oX.documentElement);
	}
	//将页面上的控件增加到select1中
	parent.objlist.execScript("objlist_add('"+contID+"','"+comType+"')");
}



/**
	控件复制
*@return true 表示进行了控件处理,否则让进行默认处理
	@date 2004-06-28
**/
function CopyCont() {
	var sAll="fc__~$#@__fc"; //eform控件的标识.
	var stype="";
	if(document.selection.type=="Control"){
		var o=document.selection.createRange();
		strXml="";
		for(var i=0;i<o.length;i++){
			var sid=o(i).id;
			var svalue=o(i).value;
			if(isSpace(o(i).controltype)){
				for (var j=0;j<ArrName.length;j++){
					if (sid.indexOf(ArrName[j])>=0){
						stype=ArrName[j];
						break;
					}
				}
			}else {
				stype = o(i).controltype;
			}
			if(isSpace(stype)) continue ;
			strXml=strXml+"<Node><id>"+sid+"</id>";
			strXml=strXml+"<type>"+stype+"</type></Node>";
			var strHtm=o(i).outerHTML;
			sAll+=strHtm;
			
		}
		//alert(strXml);
		//alert(document.selection.typeDetail )
	}
	if(sAll !=""){
		//alert(sAll)
		sAll=new Eapi.Str().trim(sAll);
		//alert(sAll)
		CopyToPub(sAll);
		
		//alert(CopyToPub)
		//sAll=""
		
		SavePubData("stmpid",strXml);
		return true ;
	}else{
		return false ;
	}
	
	
	//alert(sAll)
}

/**
	控件粘贴
*@return true 表示进行了控件处理,否则让进行默认处理
	
	@date 2004-06-28
**/
function PasteCont() {
	try{
		fcpubdata.area.focus() ;
	}catch(e){}
	var s1=window.clipboardData.getData("Text") ;
	if (isSpace(s1)) return false;
	
	
	//alert(s1.substring(0,1))
	//不是粘贴HTML
	var sAll="fc__~$#@__fc"; //eform控件的标识.
	if(s1.substring(0,12)!=sAll) {
		return false;
	}
	//
	s1 = s1.substring(12,s1.length);
	sXml=LoadPubData("stmpid");
	//alert(sXml)
	if(isSpace(sXml)) return false;
	
	//
	var oXml=new ActiveXObject("Microsoft.XMLDOM");
	oXml.async=false;
	oXml.loadXML ("<root>"+sXml+"</root>");
	var newid = "" ;
	var sLen=oXml.documentElement.childNodes.length;//子节点的个数
	var arrNewId = new Array() ; //保存新ID供后面恢复选中状态用
	for(var i=0;i<sLen;i++){
		sid=oXml.documentElement.childNodes(i).childNodes(0).text;
		stype=oXml.documentElement.childNodes(i).childNodes(1).text;
		newid = sid;
		for(j=0;j<ArrName.length;j++){
			if(stype==ArrName[j]){
				if(ObjIsHave(newid)) {
					newid = getNewContID(stype,oContXml,ArrNum[stype]);
				}
				searchStr="id="+sid+" ";
				replaceStr="id="+newid+" ";
				svalue="value="+sid+" ";
				repvalue="value="+newid+" ";
				s1=RepStr(s1,searchStr,replaceStr);
				s1=RepStr(s1,svalue,repvalue);
				
				AddContXml(stype,newid);
				arrNewId[i] = newid;
				break;
			}
		}
		
	}
	//alert(s1)
	//fcpubdata.area.innerHTML+=s1;

	htmltocont(s1,"","是");
	//恢复选中状态
	var oControlRange = document.body.createControlRange();
	for(var i=0;i<sLen;i++){
		
		try { //当此控件在界面上不存在时会出错.所以try
			oControlRange.add(eval(arrNewId[i]));
		}catch(e){}
	}	
	try { //当此控件在界面上不存在时会出错.所以try
		oControlRange.select();
	}catch(e){}


	if(IsDivCont() == false) curSelElement = null ;
	return true;
	
	function ObjIsHave(sid){
		try{
			var obj = eval(sid) ;
			return true;
		}catch(E){
			return false;
		}

	}
	
	
} 
/**
	当前选中的控件
	@date 2004-07-19
	@return 数组（把当前选中的控件放入一个数组中）
**/	
function CurrSel(){
	var sArray=new Array();
	if(document.selection.type=="Control"){
		var ii = 0 ; 
		var o=document.selection.createRange();
		for(var i=0;i<o.length;i++){
			var sid=o(i).id;
			if(isSpace(sid) == false  ) {
				sArray[ii]=eval(sid);
				ii++ ;
			}
		}
	}
	return sArray;
}
/**
用程序来模拟按了del键
**/
function main_onkeydel() {
	if(curSelElement == null) return;
	if(curSelElement.id == "fcpagesub" || curSelElement.id == "fcpagesubtable" ) return;
	
	main_onkeydown(46);
	main_exec('Delete');
	main_onkeyup(46);
}
function main_onkeyup(skeycode){
	if(typeof(skeycode)=="undefined"){
		var scode=event.keyCode;
	}else{
		var scode = skeycode;
	}
	if(scode == 46){
		SaveoRedoOneRecord();
	}
}
/**
	按下shift,ctrl键后移动控件的大小，位置
	@date 2004-07-20 
	@return 无
**/
function main_onkeydown(skeycode,sshift,sctrl){
	
	var sArray=CurrSel();
	//alert("aa")
	if(arguments.length == 0){
		var scode=event.keyCode;
		var skey=event.shiftKey;
		var sctrlkey=event.ctrlKey;
	}else{
		var scode = skeycode;
		var skey = sshift;
		var sctrlkey = sctrl;
	}
	//alert(event.keyCode)
	/**********************************************  */
	/*if(event.ctrlKey==true && event.keyCode==86){      //ctrl+v
		PasteCont();
		event.returnValue=false
		return
	}*//*
	if(event.ctrlKey==true && event.keyCode==88){
		alert("aa")
		return false;
		
	}*/
	if(scode == 46){  //del 
		//检查是不是选中了controltype为空的控件
		var ltmp = sArray.length ;
		for(var jj=0;jj<ltmp;jj++){
			if(isSpace(sArray[jj].controltype)) {
				try{
					event.returnValue=false;
				}catch(e){}
				return ;
			}
		}
		
		SaveoUndoOneRecord();
		var oXml = null ;
		var sxml = fcpubdata.area.billtaborder;
		if(isSpace(sxml) == false ){
			oXml = SetDom(sxml);
		}
		del_cont(sArray,oContXml,oXml);
		if(oXml != null){
			fcpubdata.area.billtaborder = oXml.documentElement.xml;
		}
		curSelElement = null ;
		return;
	}
	

	
	function del_cont(arr,oContXml,oXml) {
		//修改 oContXml 
		for(var i=0; i<arr.length; i++ ){
			var sid = arr[i].id;
			if(isSpace(sid)) continue;
			var comType = arr[i].controltype;
			if(isSpace(comType)){
				var l=ArrName.length ;
				for(var ii=0;ii<l;ii++){
					if(sid.indexOf(ArrName[ii]) == 0) {
						comType = ArrName[ii];
						break;
					}
				}
			}
			if(isSpace(comType)) continue;
			var oNode = oContXml.documentElement.selectSingleNode(comType) ;
			if(oNode != null ){
				var oNodeSub = oNode.selectSingleNode("//id[. ='"+sid+"']");
				if(oNodeSub != null){
					oNode.removeChild(oNodeSub);
					//删除objlist
					parent.objlist.execScript("objlist_del('"+sid+"')");
					//刷新字段列表
					if(comType == "dataset"){
						ShowAllField();
					}
				}					
			}
			//alert(oContXml.documentElement.xml)
			
			//修改taborder
			if(oXml != null){
				var oNode = oXml.documentElement.selectSingleNode("//taborder[. ='"+sid+"']") ;
				if(oNode != null ) {
					oXml.documentElement.removeChild(oNode);
				}
			}
			if(comType == "div") {
				del_cont(arr[i].all,oContXml,oXml);
			}else if (comType == "tab") {
				for(var jj=1;jj<arr[i].childNodes.length;jj++){
					del_cont(arr[i].childNodes(jj).all,oContXml,oXml);
				}
			}
			//恢复E表控件中的单元格数据
			if(arr[i].parentNode.tagName == "TD"){
			    if(arr[i].parentNode.parentNode.parentNode.parentNode.parentNode.controltype == "ebiao"){
                    var oTd = arr[i].parentNode;
                    if(typeof(oTd.backupValue) != "undefined") {
                        oTd.innerText=oTd.backupValue;
                        oTd.removeAttribute("backupValue");
                    }
			        
			    }
			}
			
		}
	}
	/*
	if(sctrlkey==true && scode==83){
		Addobj('save')
		event.retrunValue==false
		return
	}*/
	/******************************************************************/

	if (sctrlkey==true){	
		
		switch(scode){
			case 40:{
			    ActionDirectionKey("top", 1, event, sArray);
				break;
			}
			case 38:{
			    ActionDirectionKey("top", -1, event, sArray);
				break;
			}
			case 39:{
			    ActionDirectionKey("left", 1, event, sArray);
				break;
			}
			case 37:{
			    ActionDirectionKey("left", -1, event, sArray);
				break;
			}
			case 67:{  //ctrl+c
				if(CopyCont()){
					event.returnValue=false;
				}
				break;
			}
			case 86:{	//ctrl+v
				
				if(PasteCont()){
					event.returnValue=false;
				}
				break;
			}
			case 88:{	//ctrl+x
				if(CopyCont()){ 
					main_onkeydown(46);
					main_exec('Delete');
					main_onkeyup(46);
					event.returnValue=false ;
				}
				break;
			}
			case 90:{	//ctrl+z 
				//event.returnValue=false ;
				cmdUndo();
				break;
			}
			case 89:{	//ctrl+y
				//event.returnValue=false ;
				cmdRedo();
				break;
			}
			case 83:{	//ctrl+s
				Addobj('save');
				event.returnValue=false;
				break;
			} 
			case 65:{	//ctrl+a
				if (sArray.length==1){
					try{
						if (sArray[0].controltype=="ep_band")
							BandSelectAll(sArray[0]);
						}
					catch(e){};
				}	
				event.returnValue=false;
				break;
			} 
			
		}
	}
	
//	if(scode==37 || scode==39){
//		event.returnValue=false;
//	}
	if (skey==true){
		switch (scode){
		    case 40: 
		        {
		            ActionDirectionKey("height", 1, event, sArray);
		            break;
		        }
			case 38:{
			    ActionDirectionKey("height", -1, event, sArray);
				break;
			}
			case 39:{
			    ActionDirectionKey("width", 1, event, sArray);
				break;
			}
			case 37:{
			    ActionDirectionKey("width", -1, event, sArray);
				break;
			}
		
		}

    }
    /**
    * propName=width/top/left/height
    * addvalue = 1/-1
    **/
    function ActionDirectionKey(propName, addValue, eventBak, sArray) {
        
        for (var j = 0; j < sArray.length; j++) {
            if (sArray[j].length > 1) return; //有多个同名控件,选中页签的子页时.
            try { //有可能宽度或高度小于0而出错
                switch (propName) {
                    case "width": sArray[j].style.width = ToInt(sArray[j].style.width) + addValue; AdjustShapePos(sArray[j]); break;
                    case "height": sArray[j].style.height = ToInt(sArray[j].style.height) + addValue; AdjustShapePos(sArray[j]); break;
                    case "top": sArray[j].style.top = ToInt(sArray[j].style.top) + addValue; break;
                    case "left": sArray[j].style.left = ToInt(sArray[j].style.left) + addValue; break;
                }
                
            } catch (e) { }
        }
        blnChange = true;
        eventBak.returnValue = false;
        eventBak.cancelBubble = true;
    }
}

/**
	将新添加到页面上的控件处于选中状态
	@date 2004-07-23 zl
	@param sid为控件的id
	@param noadd_objlist =true 表示不加
	@return 无
**/
function SelectObj(sid,noadd_objlist){
	blnChange=true ;
	if(typeof noadd_objlist == "undefined"){


		if(curSelElement != null){
			if (IsDivCont() ) return;
		}
	}
	try { //当此控件在界面上不存在时会出错.所以try
		var oControlRange = document.body.createControlRange();
		oControlRange.add(eval(sid));
		oControlRange.select();
	}catch(e){}
}
/**
* 同步ocontxml ==> objlist.htm
*@date 2005-04-05
**/
function openobjlist() {
	//如果对象还未加载,则延时
	/*var tmpErr = true ;
	var kk = 0 ;
	while (kk<100 && tmpErr) {
		try{
			parent.objlist.select1.options.length = 0;
			tmpErr=false;
		}catch(e){
			Pause(100);
			kk++;
		}
	}*/
	parent.objlist.document.onreadystatechange= function ()
	{
	    openobjlist_sub();
	}
    openobjlist_sub();
	
}
function openobjlist_sub(){
	if (parent.objlist.document.readyState=="complete")
	{
		//处理控件列表
		parent.objlist.select1.options.length = 0;
		var sOpt =new Sys.StringBuilder();
		var l=oContXml.documentElement.childNodes.length;
		for(var i=0;i<l;i++){
			var l1 = oContXml.documentElement.childNodes(i).childNodes.length;
			var comtype =oContXml.documentElement.childNodes(i).tagName;
			for(var j=0;j<l1;j++){
				sOpt.append( "<option controltype='"+ comtype +"'>"+oContXml.documentElement.childNodes(i).childNodes(j).text+"</option>");
			}
		}
		var objList = parent.objlist.select1;
		objList.outerHTML = SelectAddOption(objList,sOpt.toString());
	}

}
/**
*显示所有字段
*@date 2006-01-23
**/
function ShowAllField() {
	if(typeof(parent.objlist.cboField) == "undefined"){
		parent.objlist.document.onreadystatechange= function (){
			if (parent.objlist.document.readyState=="complete") 	_tempBody();
		}	
	}else{
		_tempBody();
	}
	function _tempBody(){
		parent.objlist.cboField.options.length = 0;
		//计算字段列表
		var sOption = new Sys.StringBuilder();
		var oNode = oContXml.documentElement.selectSingleNode("dataset");
		if(oNode != null) {
			var l = oNode.childNodes.length;
			
			for(var i=0;i<l;i++){
				var id = oNode.childNodes(i).text;
				var ods=eval(id);
				if(IsSpace(ods.formatxml)) continue ;
				var oXml=SetDom(ods.formatxml);
				if(oXml.documentElement == null ) continue ;
				var ll=oXml.documentElement.childNodes.length;
				if(ll<=1) continue;
				if(ll>1) sOption.append( "<OPTGROUP LABEL=\"" + id + "\">" );
				for(var j=0;j<ll;j++){
					sOption.append( "<option value='" + oXml.documentElement.childNodes(j).childNodes(0).text + "'>"+oXml.documentElement.childNodes(j).childNodes(1).text +"</option>");
				}
				if(ll>1) sOption.append( "</OPTGROUP>" );

			}
			
			
		}
		parent.objlist.cboField.outerHTML = '<SELECT size=2 id="cboField" style="width:100%;height:47%" ondblclick=selectField()>' +sOption.toString()+'</SELECT>';
	}
}
/**
* 从字段列表中双击加字段到设计区
*@param dsName 数据集名称
*@param fieldName 字段名
*@param chnName 字段中文名
*@date 2006-01-23
**/
function AddBindField(dsName,fieldName,chnName) {
	var sPosition="";
	if(curSelElement != null && curSelElement.tagName.toUpperCase() == "TD"){
		sPosition="inTD";
	}
	if(fcpubdata.dbStruDict == "FC_ENTITY"){
	    //var tableName =  //如何取得表名呢?
	    var tableName = $id(dsName).queryTableName;
	    var obj = getNewFieldInputStr(dsName,tableName,fieldName,chnName,sPosition);
	}else{
	    var obj = getFieldInputStr(dsName,fieldName,chnName,sPosition);
    }
	if(obj.content != ""){
		AddContXml(obj.type,obj.sid);
		htmltocont(obj.content,obj.type,"是");
		SelectObj(obj.sid);
	}else{
		alert("当前字段默认设置为隐藏！");
	}

}
/**
* 取得一个字段的输入控件信息
*@param sPosition ="inTD" 表示在TD容器中加, ="" 表示加static方式, ="position:absolute;left:5;top:10;" 表示加的坐标信息,
*@date 2008-02-01
**/
function getFieldInputStr(dsName,fieldName,chnName,sPosition){
	var sStr =new Sys.StringBuilder(); 
	var sType = "" ; 
	var retWidth = 0,retHeight = 20; //返回用的高宽,用它来记录当前控件占用的高宽
	//如在TD中加入，则宽高为100%
	var sWid = "";
	var sHei = "20px"; //编辑框默认高度为20px
	var sBorder = " BORDER-BOTTOM: silver 1px solid;" ;
	var sid = "" ; //控件id
	if(sPosition == "inTD" ){ //在TD容器中
		sWid = "100%";
		sHei = "100%" ;
		sBorder = "" ;
		sPosition = "";
	}
	if(sWid == ""){
		var sSql = "select objwidth from "+fcpubdata.dbStruDict+" where fdname='"+fieldName+"'" ;
		sWid = SqlToField(sSql);
		sWid = sWid.trim();
		if(IsSpace(sWid)){ 
			sWid = "80" ;
		}
	}
	retWidth = Num(sWid) ;
	var sSql = "select inputstyle from "+fcpubdata.dbStruDict+" where fdname='"+fieldName+"'" ;
	var sV1 = SqlToField(sSql);
	if(isSpace(sV1)==false && sV1 != "NULL") {
		var oo= SetDom(sV1);
		if(oo.documentElement != null){
				//tempvalue
				if(oo.documentElement.childNodes.length>=1) var sX0 = UnRepXml(oo.documentElement.childNodes(0).text);
				//temptext
				if(oo.documentElement.childNodes.length>=2) var sX = UnRepXml(oo.documentElement.childNodes(1).text );
				//sql
				if(oo.documentElement.childNodes.length>=3) var sX2  = UnRepXml(oo.documentElement.childNodes(2).text) ;
				//option串
				if(oo.documentElement.childNodes.length>=4) var spubOption = UnRepXml(oo.documentElement.childNodes(3).text) ;
				//format串
				if(oo.documentElement.childNodes.length>=5) var spubFormat = UnRepXml(oo.documentElement.childNodes(4).text ) ;
			var spubCheck ="1" ; //1为常数,2为sql语句
			if(IsSpace(sX2) == false) spubCheck="2";
			sType = oo.documentElement.nodeName ;
			
			switch ( sType ) {
				case 'radio':{  //radio控件
				    retHeight = 50 ;
					sid = "rdo"+fieldName ;
					sStr.append( '<FIELDSET id="'+sid+'" dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() contentEditable=false style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() value="-1" controltype="radio" tempvalue="'+sX0+'" temptext="'+sX+'" aspect="横向" readOnly="false" legend="'+chnName+'"><LEGEND>'+chnName+'</LEGEND>');
					var rdolen = sX.split('\n') ;
					var rdol = sX0.split('\n') ;
					for(var jj=0; jj<rdolen.length; jj++){
						sStr.append( '<INPUT type=radio value="'+rdol[jj]+'" name=RGrdo'+fieldName+' text="'+rdolen[jj]+'"><SPAN onclick=RGrdo'+fieldName+'['+jj+'].checked=true;');
						sStr.append( 'rdo'+fieldName+'.value=RGrdo'+fieldName+'['+jj+'].value;RGrdo'+fieldName+'['+jj+'].focus();>'+rdolen[jj]+'</SPAN>&nbsp;');
					}
					sStr.append( '</FIELDSET>' );
					break;	
				}
				
				case 'readonly':{  //只读控件
					sid = "txt"+fieldName ;
					sStr.append( '<INPUT type=text onmove=move() readOnly oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					sStr.append( 'style="'+sPosition+''+sBorder+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'; TEXT-ALIGN: left" onmovestart=moveStart() ');
					sStr.append( 'controltype="text" dataset="'+dsName+'" value="'+chnName+'" CanSelect="false" china="'+chnName+'" field="'+fieldName+'"></INPUT>');
					break ;
				}
				case 'facard':{ //检索方案
					sid = "txt"+fieldName;
					sStr.append( '<INPUT type=text onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					sStr.append( 'style="'+sPosition+''+sBorder+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'; " onmovestart=moveStart() ');
					sStr.append( 'controltype="text" dataset="'+dsName+'" value="'+chnName+'" CanSelect="false" china="'+chnName+'" field="'+fieldName+'"></INPUT>');
					//var iTop = tmpTop - 1;
					//var iLeft = parseInt(txtLeft) + parseInt(sWid) +1 ;
					var sfacard = "SelectZlSql('"+sX0+"','"+sX2+"','"+sX+"')" ;
					var sPosition1 = "";
					if(sPosition != "inTD" && sPosition != ""){
					    sPosition1 = new Eapi.Css().changePosition(sPosition,"LEFT",retWidth);
					}

					sStr.append( '<BUTTON onmove=move() oncontrolselect=controlselect() id=cmd_'+fieldName+' onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition1+'BORDER-RIGHT: 0px; BORDER-TOP: 0px; BORDER-LEFT: 0px; WIDTH: 17px; BORDER-BOTTOM: 0px; BACKGROUND-REPEAT: no-repeat; HEIGHT: 18px; " onmovestart=moveStart() controltype="button" fc_onclick="bill_onclick(&quot;'+sfacard+'&quot;)" dropstyle="是"></BUTTON>');
					//CopyToPub(sStr)
					retWidth += 17 ;
					break;
				}
				
				case 'hidden':{  //隐藏控件
					sStr.append( '');
					retWidth = 0;
					retHeight = 0;
					break;
				}
				case 'checkbox':{  //checkbox控件
				    retHeight = 20;
					sid = "chk"+fieldName ;
					sStr.append( '<DIV onmove=move() dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" truevalue="'+sX0+'" falsevalue="'+sX+'" oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px;" onmovestart=moveStart() noWrap value="否" falsevalue="否" truevalue="是" controltype="checkbox"><INPUT oncontrolselect=controlselectcancel() type=checkbox><SPAN>'+chnName+'</SPAN></DIV>');
					break;
				}
				
				case 'date':{  //日期控件
				    retHeight = 20;
				    retWidth = 80;
					sid = "txt"+fieldName ;
					sStr.append( '<INPUT type=text onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					sStr.append( 'style="'+sPosition+''+sBorder+'; WIDTH: '+retWidth+'px; HEIGHT: '+retHeight+'px; TEXT-ALIGN: left" onmovestart=moveStart() ');
					sStr.append( 'controltype="text" dataset="'+dsName+'" value="'+chnName+'" CanSelect="false" china="'+chnName+'" field="'+fieldName+'"></INPUT>');
					var Selectdt = "SelectDate(txt"+fieldName+")";
					var sQuot = "&quot;";
					var Seldate = "bill_onclick("+sQuot+Selectdt+sQuot+")";
					var sPosition1 = "";
					if(sPosition != "inTD" && sPosition != ""){
					    sPosition1 = new Eapi.Css().changePosition(sPosition,"LEFT",retWidth);
					}
					sStr.append( '<BUTTON onmove=move() oncontrolselect=controlselect() id=cmd_'+fieldName+' onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition1+'BORDER-RIGHT: 0px; BORDER-TOP: 0px; BORDER-LEFT: 0px; WIDTH: 17px; BORDER-BOTTOM: 0px; BACKGROUND-REPEAT: no-repeat; HEIGHT: 18px; " onmovestart=moveStart() controltype="button" fc_onclick="'+Seldate+'" dropstyle="是"></BUTTON>');
					retWidth += 17;
					break;
				}
				case 'textarea':{  //大文本
				    retHeight = 50 ;
					sid = "txt"+fieldName ;
					sStr.append('<TEXTAREA onmove=move() dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+';WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'" onmovestart=moveStart() cols=26 controltype="textarea" value=""></TEXTAREA>');
					break;
				}
				case 'combobox' :{  //combobox控件
				    retHeight = 25;
					sid = "cbo"+fieldName;
					sStr.append( '<SELECT onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					sStr.append( 'style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() controltype="combobox" ');
					sStr.append( 'check="'+spubCheck+'" dataset="'+dsName+'" tempvalue="'+sX0+'" temptext="'+sX+'" sql="'+sX2+'"  china="'+chnName+'" field="'+fieldName+'">');
					sStr.append( spubOption);
					sStr.append('</SELECT>');
					break;
				}
				case 'listbox':{   //lst控件
				    retHeight = 50 ;
					sid = "lst"+fieldName;
					sStr.append( '<SELECT onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+'; ');
					sStr.append( 'WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() size=8 controltype="listbox"');
					sStr.append( 'dataset="'+dsName+'" china="'+chnName+'" field="'+fieldName+'" check="'+spubCheck+'" tempvalue="'+sX0+'" temptext="'+sX+'" sql="'+sX2+'">');
					sStr.append( spubOption);
					sStr.append( '</SELECT>');
					break;
				}
				case 'dropdownlist':{ //fccode控件
					sid = "ddl"+fieldName ;
					sStr.append( '<IMG id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() style="'+sPosition);
					sStr.append( 'WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; ');
					sStr.append( 'ButtonWidth: 10" onmovestart=moveStart() src="../images/ef_designer_fccode.gif" controltype="dropdownlist" ');
					sStr.append( 'dataset="'+dsName+'" china="'+chnName+'" field="'+fieldName+'" check="'+spubCheck+'" tempvalue="'+sX0+'" temptext="'+sX+'" visible="是" blninput="是" blnempty="否" addrow="否" multiselect="否" sql1="'+sX2+'" xml="'+spubOption+'" format="'+spubFormat+'" >');
					break;
				}
				default:{ //文本框
					sType = "";
				}
				
			} // end switch
			
		}
	}
	if(sStr.isEmpty() && sType == ""){
		sType = "text" ;
		sid = "txt"+fieldName;
		sStr.append( '<INPUT type=text onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
		sStr.append( 'style="'+sPosition+''+sBorder+'FONT-SIZE: 12px; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; TEXT-ALIGN: left" onmovestart=moveStart() ');
		sStr.append( 'controltype="text" dataset="'+dsName+'" value="'+chnName+'" CanSelect="false" china="'+chnName+'" field="'+fieldName+'"></INPUT>');
	
	}
    
    return {type : sType, sid : sid, content : sStr.toString(), width : retWidth , height : retHeight };
    

}
/**
* 取得一个字段的输入控件信息,用于正康平台中
*@param sPosition ="inTD" 表示在TD容器中加, ="" 表示加static方式, ="position:absolute;left:5;top:10;" 表示加的坐标信息,
*@date 2009-03-12
**/
function getNewFieldInputStr(dsName,tableName,fieldName,chnName,sPosition){

	var sStr =new Sys.StringBuilder(); 
	var sType = "" ; 
	var retWidth = 0,retHeight = 0; //返回用的高宽,用它来记录当前控件占用的高宽
	//如在TD中加入，则宽高为100%
	var sWid = "80";
	var sHei = ""; 
	//var sBorder = " BORDER-BOTTOM: silver 1px solid;" ;
	var sid = "" ; //控件id
	if(sPosition == "inTD" ){ //在TD容器中
		sWid = "100%";
		sHei = "100%" ;
		//sBorder = "" ;
		sPosition = "";
	}
	retWidth = Num(sWid) ;
	var sSql = "select type,detailxml from FC_ENTITYSUB where fdname='"+fieldName+"' and tbname='"+tableName+"'"; 
    var s1 = SelectSql(sSql,1,1);
    var oXml=SetDom(s1);
    if (oXml.documentElement != null && oXml.documentElement.childNodes.length > 1) {
        sType = oXml.documentElement.childNodes(0).childNodes(0).text;
        var sDetail = unescape(oXml.documentElement.childNodes(0).childNodes(1).text)
        sDetail = RepStr(sDetail,"\r\n","&amp;#13;&amp;#10;") ;

		var oo= SetDom("<root>"+sDetail+"</root>");

        var tmpWid = getDomNodeValue(oo,"width");
        if(IsSpace(tmpWid) == false) retWidth = Num(tmpWid);
        var tmpHei = getDomNodeValue(oo,"height");
        if(IsSpace(tmpHei) == false) sHei = tmpHei;
        
		if(oo.documentElement != null){
		
            if(sType == "选项列表" || sType == "多选列表" || sType == "查找关系"){
                var contType = getDomNodeValue(oo,"isLstContType");
		        var sListText = getDomNodeValue(oo,"listText");
		        sListText = RepStr(sListText,"&#13;&#10;","\r\n") ;
		        var sListValue = getDomNodeValue(oo,"listValue");
		        if(IsSpace(sListValue) == false) sListValue = RepStr(sListValue,"&#13;&#10;","\r\n") ;
		        
		        //sql
		        var sListSql  = "" ;
		        if(sType == "查找关系"){
		            var mainTabName = getDomNodeValue(oo,"mainTableName");
		            var sQueryType = "1";
		            if(contType == "dropdownlist"){
		                sQueryType = "2";
		            }
		            var ret1 = SqlToField("select fdlist from fc_query where fc_query.type="+sQueryType+" and tbname='"+mainTabName+"'");
		            if(IsSpace(ret1) == false){
		                sListSql = "select "+ret1+" from " + mainTabName ; //此处没有考虑逼近查找
		            }
		        }
		        //option串
		        var spubOption = PropWinListValueToOption(sListText,sListValue,getDomNodeValue(oo,"defaultValue"),contType == "dropdownlist") ;
		        //format串
		        var spubFormat = "";
		        var spubCheck ="1" ; //1为常数,2为sql语句
		        if(IsSpace(sListSql) == false) spubCheck="2";
		        
                switch (contType){
				    case 'combobox' :{  //combobox控件
				        retHeight = _getContHeight(sHei,25) ;
					    sid = "cbo"+fieldName;
					    sStr.append( '<SELECT onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					    sStr.append( 'style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() controltype="combobox" ');
					    sStr.append( 'check="'+spubCheck+'" dataset="'+dsName+'" tempvalue="'+sListValue+'" temptext="'+sListText+'" sql="'+sListSql+'"  china="'+chnName+'" field="'+fieldName+'">');
					    sStr.append( spubOption);
					    sStr.append('</SELECT>');
					    break;
				    }
				    case 'listbox':{   //lst控件
				        retHeight = _getContHeight(sHei,50) ;
					    sid = "lst"+fieldName;
					    sStr.append( '<SELECT onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+'; ');
					    sStr.append( 'WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() size=8 controltype="listbox"');
					    sStr.append( 'dataset="'+dsName+'" china="'+chnName+'" field="'+fieldName+'" check="'+spubCheck+'" tempvalue="'+sListValue+'" temptext="'+sListText+'" sql="'+sListSql+'">');
					    sStr.append( spubOption);
					    sStr.append( '</SELECT>');
					    break;
				    }
				    case 'dropdownlist':{ //fccode控件
				        retHeight = _getContHeight(sHei,20) ;
					    sid = "ddl"+fieldName ;
					    sStr.append( '<IMG id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() style="'+sPosition);
					    sStr.append( 'WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; ');
					    sStr.append( 'ButtonWidth: 10" onmovestart=moveStart() src="../images/ef_designer_fccode.gif" controltype="dropdownlist" ');
					    sStr.append( 'dataset="'+dsName+'" china="'+chnName+'" field="'+fieldName+'" check="'+spubCheck+'" tempvalue="'+sListValue+'" temptext="'+sListText+'" visible="是" blninput="是" blnempty="否" addrow="否" multiselect="否" sql1="'+sListSql+'" xml="'+spubOption+'" format="'+spubFormat+'" >');
					    break;
				    }
					    case 'radio':{  //radio控件
				        retHeight = _getContHeight(sHei,50) ;
					    sid = "rdo"+fieldName ;
					    sStr.append( '<FIELDSET id="'+sid+'" dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() contentEditable=false style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() value="-1" controltype="radio" tempvalue="'+sListValue+'" temptext="'+sListText+'"NotBg="否" aspect="横向"  legend="'+chnName+'" china="'+chnName+'"> <LEGEND>'+chnName+'</LEGEND>');
					    var rdolen = sListText.split('\n') ;
					    var rdol = sListValue.split('\n') ;
					    for(var jj=0; jj<rdolen.length; jj++){
						    sStr.append( '<INPUT id= RGrdo'+fieldName+jj+' onclick= rdo'+fieldName+'.value=RGrdo'+fieldName+'['+jj+'].value; type=radio value='+rdol[jj]+' name=RGrdo'+fieldName+' text='+rdolen[jj]+'><SPAN>'+rdolen[jj]+'</SPAN>&nbsp;');
					    }
					    sStr.append( '</FIELDSET>' );
					    break;	
				    }
			    }
		        
            }
			
			switch ( sType ) {
			    case '自动编号':
			    case '公式':
			    case '累计汇总':
				case 'readonly':{  //只读控件
				    retHeight=20;
					sid = "txt"+fieldName ;
					sStr.append( '<INPUT type=text onmove=move() readOnly oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					sStr.append( 'style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'; TEXT-ALIGN: left" onmovestart=moveStart() ');
					sStr.append( 'controltype="text" dataset="'+dsName+'" value="'+chnName+'" CanSelect="false" china="'+chnName+'" field="'+fieldName+'"></INPUT>');
					break ;
				}
				case 'facard':{ //检索方案
					sid = "txt"+fieldName;
					sStr.append( '<INPUT type=text onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					sStr.append( 'style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'; " onmovestart=moveStart() ');
					sStr.append( 'controltype="text" dataset="'+dsName+'" value="'+chnName+'" CanSelect="false" china="'+chnName+'" field="'+fieldName+'"></INPUT>');
					//var iTop = tmpTop - 1;
					//var iLeft = parseInt(txtLeft) + parseInt(sWid) +1 ;
					var sfacard = "SelectZlSql('"+sListValue+"','"+sListSql+"','"+sListText+"')" ;
					var sPosition1 = "";
					if(sPosition != "inTD" && sPosition != ""){
					    sPosition1 = new Eapi.Css().changePosition(sPosition,"LEFT",retWidth);
					}

					sStr.append( '<BUTTON onmove=move() oncontrolselect=controlselect() id=cmd_'+fieldName+' onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition1+'BORDER-RIGHT: 0px; BORDER-TOP: 0px; BORDER-LEFT: 0px; WIDTH: 17px; BORDER-BOTTOM: 0px; BACKGROUND-REPEAT: no-repeat; HEIGHT: 18px; " onmovestart=moveStart() controltype="button" fc_onclick="bill_onclick(&quot;'+sfacard+'&quot;)" dropstyle="是"></BUTTON>');
					//CopyToPub(sStr)
					retWidth += 17 ;
					break;
				}
				
				case '主从信息表':
				case 'ID字段':{  //隐藏控件
					sStr.append( '');
					retWidth = 0;
					retHeight = 0;
					break;
				}
				case '复选框':{  //checkbox控件
				    retHeight = _getContHeight(sHei,25) ;;
					sid = "chk"+fieldName ;
					sStr.append( '<DIV onmove=move() dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px;" onmovestart=moveStart() noWrap value="'+getDomNodeValue(oo,"defaultValue")+'" falsevalue="'+getDomNodeValue(oo,"falseValue")+'" truevalue="'+getDomNodeValue(oo,"trueValue")+'" controltype="checkbox"><INPUT oncontrolselect=controlselectcancel() type=checkbox><SPAN>'+chnName+'</SPAN></DIV>');
					break;
				}
				case '图片字段':{
				    retWidth = 200;  
				    retHeight = _getContHeight(sHei,50) ;;
				    
					sid = "img"+fieldName ;
					sStr.append('<img controltype="dbimg" id="'+sid+'"  alt="用鼠标双击此可选择图形" ondblclick=uploadImg() style="'+ sPosition + '" onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" >');
					break;
				}
                case '日期时间':
                case '日期': 
                    {  //日期控件
                        retHeight = _getContHeight(sHei, 20);
                        retWidth = 80;
                        sid = "txt" + fieldName;
                        sStr.append('<INPUT type=text onmove=move() oncontrolselect=controlselect() id="' + sid + '" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
                        sStr.append('style="' + sPosition + '; WIDTH: ' + retWidth + 'px; HEIGHT: ' + retHeight + 'px; TEXT-ALIGN: left" onmovestart=moveStart() ');
                        sStr.append('controltype="text" dataset="' + dsName + '" value="' + chnName + '" CanSelect="false" china="' + chnName + '" field="' + fieldName + '"></INPUT>');
                        var Selectdt = "SelectDate(txt" + fieldName;
                        if (sType == "日期时间") Selectdt += ",true"; //用于拼上时间串
                        Selectdt += ")";
                        var sQuot = "&quot;";
                        var Seldate = "bill_onclick(" + sQuot + Selectdt + sQuot + ")";
                        var sPosition1 = "";
                        if (sPosition != "inTD" && sPosition != "") {
                            sPosition1 = new Eapi.Css().changePosition(sPosition, "LEFT", retWidth);
                        }
                        sStr.append('<BUTTON onmove=move() oncontrolselect=controlselect() id=cmd_' + fieldName + ' class="cmdDown" onmouseover="this.className=\'cmdDown-over\'" onmouseout="this.className=\'cmdDown\'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="' + sPosition1 + 'BORDER-RIGHT: 0px; BORDER-TOP: 0px; BORDER-LEFT: 0px; WIDTH: 17px; BORDER-BOTTOM: 0px; BACKGROUND-REPEAT: no-repeat; HEIGHT: 20px; " onmovestart=moveStart() controltype="button" fc_onclick="' + Seldate + '" dropstyle="是"></BUTTON>');
                        retWidth += 17;
                        break;
                    }
				case '文本区长':
				case '文本区':{  //大文本
				    retHeight = _getContHeight(sHei,50) ; ;
					sid = "txt"+fieldName ;
					sStr.append('<TEXTAREA onmove=move() dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+'+WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'"onmovestart=moveStart() cols=26 controltype="textarea" value=""></TEXTAREA>');
					break;
				}
				case "查找关系" :
                case "选项列表" : 
                case "多选列表" :{
                
                
				    break;
				}
				default:{ //文本框
					sType = "";
				}
				
			} // end switch
			
		}
	}
	if(sStr.isEmpty() && sType == ""){
	    retHeight = _getContHeight(sHei,20) ;
		sType = "text" ;
		sid = "txt"+fieldName;
		sStr.append( '<INPUT type=text onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
		sStr.append( 'style="'+sPosition+'FONT-SIZE: 12px; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; TEXT-ALIGN: left" onmovestart=moveStart() ');
		sStr.append( 'controltype="text" dataset="'+dsName+'" value="'+chnName+'" CanSelect="false" china="'+chnName+'" field="'+fieldName+'"></INPUT>');
	
	}
    
    return {type : sType, sid : sid, content : sStr.toString(), width : retWidth , height : retHeight };
    
    function _getContHeight(sValue,iDefaultValue){
        if(sValue == "") 
            return iDefaultValue;
        else    
            return ToInt(sValue);
    }
}
/**
* 新增表单时自动加上dsmain
*@date 2006-04-26
**/
function AutoAddDsMain() {
		//新增表单时自动加上dsmain
		if(fcpubdata.autoAddField == "yes" ){
			var tablename="";
			var newdjsn = parent.Request.QueryString("newdjsn").toString();			
			if(isSpace(newdjsn)){
				tablename = "UD_"+getMaxNo("BBB");
			}else{
				tablename="UD_"+newdjsn;
				fcpubdata.area.dj_sn = newdjsn;
			}
			var s1 = "GetSession('userid')['userid']";
			var sHtml="<img controltype='dataset' id=DsMain opensortno=1 style='position:absolute;Left:400;Top:5;Height:47;Width:39;' src='../images/ef_designer_dataset.gif' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() formatxml=\"<root><tr><td>mainkey</td><td>mainkey</td><td>字符</td><td>11</td><td>0</td><td>数据项</td><td></td><td></td><td>否</td><td>否</td><td>否</td><td>否</td><td>是</td><td>否</td><td>否</td><td>否</td><td></td><td></td><td>left</td><td>80</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>userid</td><td>用户ID</td><td>字符</td><td>100</td><td>0</td><td>变量默认值</td><td>" + s1 + "</td><td></td><td>否</td><td>否</td><td>否</td><td>否</td><td>是</td><td>否</td><td>否</td><td>否</td><td></td><td></td><td>left</td><td>80</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></root>\" AfterScroll=\"fcpubdata.keyValue=DsMain.Field('mainkey').Value\" BeforeOpen=\"DsMain.PageSize=1;\"   saveastable=\"" + tablename + "\" opensql=\"select * from " + tablename + " \" >";	
			

			fcpubdata.area.innerHTML += sHtml;
			AddContXml("dataset","DsMain");
			fcpubdata.area.keyfield="mainkey";
			fcpubdata.area.toolbar = "单表输入工具栏";
			var newdjtype = parent.Request.QueryString("newdjtype").toString();			
			if(isSpace(newdjtype)==false)	
				fcpubdata.area.type = newdjtype;
			var newdjname = parent.Request.QueryString("newdjname").toString();			
			if(isSpace(newdjname)==false)	
				fcpubdata.area.caption = unescape(newdjname);
				
		}

}
/**
* 自动加上查询表单
*@date 2006-12-26
**/
function AutoAddQueryDj(){
	var allbak = fcpubdata.area.innerHTML;
	DsMain.id="PubQueryGridDs"
	PubQueryGridDs.opensortno="5";
	//将查询的sql语句改为在数据集的打开之前事件中处理
	PubQueryGridDs.opensql = "";
	PubQueryGridDs.saveastable="";
	PubQueryGridDs.BeforeOpen="ActionQueryCond();";
	
	
	fcpubdata.area.innerHTML = '<DIV onmove=move() oncontrolselect=controlselect() id=divQueryFilter onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="BORDER-RIGHT: black 1px solid; BORDER-TOP: black 1px solid; OVERFLOW-Y: scroll; LEFT: 1px; OVERFLOW-X: scroll; OVERFLOW: auto; BORDER-LEFT: black 1px solid; WIDTH: 97%; BORDER-BOTTOM: black 1px solid; POSITION: absolute; TOP: 11px; HEIGHT: 214px; BACKGROUND-COLOR: #ffffff" onmovestart=moveStart() controltype="div" NotBg="否">' + allbak + '</DIV><IMG id=PubQueryGrid onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() style="LEFT: 1px; WIDTH: 979px; POSITION: absolute; TOP: 229px; HEIGHT: 289px" onmovestart=moveStart() src="http://localhost/WebBill/fceform/images/ef_designer_webgrid.gif" controltype="grid" dataset="PubQueryGridDs" canselect="是" autoheight="是" autowidth="是" autoappend="否" readonly="否" visible="是" titlerowheight usertitle="否" iscrosstab="否" rcount="否" rsum="否" rmin="否" rmax="否" ravg="否" ccount="否" csum="否" cmin="否" cmax="否" cavg="否" titlerows usertitlehtml crosstabtitle crosstabdatatype crosstabsumtype crosstabformat rowtitle coltitle crosstabsql>' + PubQueryGridDs.outerHTML ;

	//隐藏所有的按钮
	var o=window.document.all.tags("button");
	var l=o.length;
	for(var ii=0;ii<l;ii++){
		o[ii].style.display="none";
	}
	
	fcpubdata.area.dj_sn = fcpubdata.area.dj_sn+"_auto_query";
	fcpubdata.area.toolbar="查询工具栏" ;
	curdjid=0;   //表示新建一个表单模版,而不是覆盖当前表单模版
	DesignDjSave("不提示");
}
/**
* 打开表单设计器的表单属性窗口
*@date 2007-01-22
**/
function e_open_ebiao_form(){
	var obj = parent.dialogArguments[0]; //e报表table对象.
	var s1 = obj.eform_winprop;
	if(typeof s1 == "undefined") s1="";
	var sRet=DjOpen('eb_parawin',s1,'展现',"有模式窗口","直接","设置窗口相关属性");
	if(IsSpace(sRet) == false){
		obj.eform_winprop = sRet;
	}

}
/**
* 加一个最近打开的文件
*@date 2007-05-22
**/
function ef_AddRecentFile(sFile){
	var s = fcpubdata.recentFile;
	if(typeof s == "undefined") return;
	if(s.length>0){
		var pos = s.indexOf(";") ; //用;分隔的表单名
		if(pos < 0){
			s = s + ";"+sFile;			
		}else{
			var s1 = s.substring(pos+1,s.length);
			if(sFile != s1){ //以免两个文件一样
				s = s1 + ";" +sFile;
			}
		}
	}else{
		s = sFile;
	}
	fcpubdata.recentFile = s ;
	
}
/**
* 用 fcpubdata.recentFile 刷新界面
*@date 2007-05-22
**/
function ef_RefreshRecentFile(){
	var s = fcpubdata.recentFile ;
	if(typeof s == "undefined") return;
	if(s.length == 0 ) return;
	var oWin = parent.selhtml;
	var arr = s.split(";");
	var arr1 = arr[0].split(",");
	_genHref(arr1,oWin.recentFile1);
	if(arr.length > 1){
		arr1 = arr[1].split(",");
		_genHref(arr1,oWin.recentFile2);
	}
	function _genHref(arr1,oHref) {
		if(arr1[0] == "-1"){
			oHref.href="javascript:parent.topic.execScript('DesignDjOpenSub(readdesignhtml(\"<file>"+arr1[1]+"</file>\"),0);pdjFilePath=\""+arr1[1]+"\"')"; // ../../fceform/djfile
			oHref.innerText = arr1[1];
		}else{
			oHref.href="javascript:parent.topic.execScript('DesignDjOpen(\"" + arr1[0] + "\")')";
			oHref.innerText = arr1[1]+"("+arr1[2]+")";
		}
	
	}	
}

function importConfig() {
    
    var arr = SelFieldToArr();
    if (arr.length == 0) {
        alert("请增加了数据集后再试!");
        return;
    }
    DjOpen('importConfig', [window, arr], '展现', '有模式窗口', '直接', '导入信息配置');
}