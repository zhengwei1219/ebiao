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
	���ؼ���ӵ�ҳ����
	@date 2004-06-28 liuxr ����
	@name Ҫ��ӵĿؼ�������
**/
function Addobj(name){

	//�л������״̬
	//parent.selhtml.execScript("design_check()")
	if($id("bigmain") != null && bigmain.style.display == "none"){
		alert("ֻ�������״̬�²��д˹���!����������ư�ť�л������״̬������!");
		return;
	}
	var oAddField = null; //Ҫ�Ӱ��ֶεĶ���
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
			var sHtml="<a controltype='" + name + "' style='position:" + fcpubdata.position + "; left:0px; Top:0px; height:15px; Width:80px; ' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() id="+sid+" >��������</a>";  //id=SKDBLike"+ArrNum['SKDBLike']+" value=SKDBLike"+ArrNum['SKDBLike']+"
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
			ArrNum[name]++;////style='position:absolute;Left:184;Top:160;Height:96;Width:152;FONT-FAMILY:����;FONT-SIZE:12px;color:#000000 ;'
			var sid = getNewContID(name,oContXml) ;
			var sHtml = "<DIV controltype='" + name + "' id=" + sid + " style='position:" + fcpubdata.position + ";left:0;top:0;width:300;height:200;BORDER: 1px solid;' class='control-border-color' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() >radiolist</DIV>";
			htmltocont(sHtml,name) ;
			
			SelectObj(sid);
			break;
		}
		case "chart":{
			ArrNum[name]++;
			//var sHtml="<div id=SKDBchart"+ArrNum['SKDBchart']+" other=' <param name=3DModeOn valuea=true> 3D��ʾ ' style='position:absolute;Left:304;Top:144;Height:88;Width:96;' graphxml='<root> <samplevalues> </samplevalues> <samplelabels><field> </field></samplelabels></root> '></div>"
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+" type=graph style='position:" + fcpubdata.position + ";Left:0;Top:0; Height:188; Width:326;' src='../images/ef_designer_graph.gif' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() />";
			htmltocont(sHtml,name);
			
			SelectObj(sid);
			break;
		}
		case "dropdownlist": {
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+" multiselect='��' addrow='��'  blnempty='��'  blninput='��' visible='��' style='position:" + fcpubdata.position + ";left:0px; top:0px; width:100px; height:20px ;' src='"+fcpubdata.path+"/fceform/images/ef_designer_fccode.gif' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() />";
			htmltocont(sHtml,name);
			
			SelectObj(sid);
			oAddField = $id(sid);
			break;
		}
		case "checkbox":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<div controltype='" + name + "' nowrap id="+sid+" truevalue='��' falsevalue='��' value='��' style='position:" + fcpubdata.position + "; left:0px; top:0px; width:80; height:20px;'onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect()><input type=checkbox oncontrolselect=controlselectcancel()><span>��ѡ��</span></div>";
			htmltocont(sHtml,name);
			
			SelectObj(sid);
			oAddField = $id(sid);
			//obj.setActive();
			break;
		}
		case "radio":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml = "<fieldset controltype='" + name + "' id=" + sid + " contentEditable=false value=ѡ��һ  style='position:" + fcpubdata.position + ";Left:0;Top:0;Height:50;Width:152; ' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() tempvalue='ѡ��һ&#13;&#10;ѡ���' temptext='ѡ��һ&#13;&#10;ѡ���' ><legend>��ѡ��</legend><INPUT id=RG" + sid + "1 onclick=" + sid + ".value=RG" + sid + "[0].value; type=radio CHECKED value=ѡ��һ name=RG" + sid + " text='ѡ��һ'><SPAN>ѡ��һ</SPAN>&nbsp;<INPUT id=RG" + sid + "2 onclick=" + sid + ".value=RG" + sid + "[1].value; type=radio value=ѡ��� name=RG" + sid + " text='ѡ���'><SPAN>ѡ���</SPAN>&nbsp;</fieldset>";
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
				alert("ÿ������ֻ����һ��File Field�฽���ϴ��ؼ���");
				return;
			}catch(e){
				ArrNum[name]++;
				var sHtml = "<div controltype='" + name + "' id='upload1' style='overflow: auto;position:" + fcpubdata.position + ";Left:0;Top:0;Height:48px;Width:152px;BORDER: 1px solid;' class='control-border-color' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() ><table  border=0 cellPadding=0 cellSpacing=0  style='BORDER-BOTTOM: 0px solid; BORDER-LEFT: 0px solid; BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; FONT-SIZE: 12px; BORDER-TOP: 0px solid; BORDER-RIGHT: 0px solid'> <tr height=30><td colspan=5  >&nbsp;&nbsp;<a href='javascript:uploadAddFile()' NotShowCtrlType='��'>���Ӹ���</a></td></tr>  </table>  </div> ";
			}
			htmltocont(sHtml,name);
			
			SelectObj(upload1);
			break ;
		}

		case "dbimg":{   /*DBImage*/
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+"  alt='�����˫���˿�ѡ��ͼ��' ondblclick=uploadImg() style='position:" + fcpubdata.position + ";Left:0;Top:0;' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() >";
			//var sHtml="<img controltype='Image' id="+sid+" alt='�����˫���˿�ѡ��ͼ��'ondblclick=uploadImg() style='position:absolute;Left:184;Top:16;Height:48;Width:56;' >";
			
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
						+"<table id=fcpagesubtable bgcolor=white onmousedown=pageonclick() onresizestart=CancelEvent()><tbody><tr contentEditable=false><td style='background-color:white;border-left:1px solid #8BA7B6;border-top:1px solid #8BA7B6;border-right:1px solid #8BA7B6;color:red;' width=80px height=20px align=center><font size=2>ҳǩ1</font></td><td style='background-color:white;border-left:1px solid #8BA7B6;border-right:1px solid #8BA7B6;border-top:1px solid #8BA7B6;' width=80px height=20px align=center><font size=2>ҳǩ2</font></td></tr></tbody></table>"
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
            var sHtml = "<img controltype='" + name + "' id=" + sid + " isAll='true' ischecked='false'  src='../images/ef_run_page.gif' style='position:" + fcpubdata.position + ";Left:0;Top:0;Height:320;Width:402;BORDER: 1px solid;' class='control-border-color' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() pageXml=\"<option value='ҳǩ' linkUrl=''>ҳǩ</option>\" >";
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
		//����������еĲ���
		
		/*
		case "wfstep":{
			ArrNum[name]++;
			var sid = getNewContID(name,oContXml) ;
			sidtype="wfstep";
			var width=100,height=50,X="100px",Y="100px",strokeWeight="",textWeight="";
			var sHtml= new Eapi.WfDesign().getStepHTML(sidtype,WfConfig.zIndex,sid,"�²���",WfConfig.stepTextColor,WfConfig.stepStrokeColor,WfConfig.stepShadowColor,WfConfig.isStepShadow,width,height,X,Y,strokeWeight,textWeight,WfConfig.fillColor1,WfConfig.fillColor2,WfConfig.isStep3D,WfConfig.step3DDepth);
			
			htmltocont(sHtml,name);
			refreshAllLinePos();
			SelectObj(sid);
			break;
		}
		case "wfline":{
		    //ȡһ������ڵ�ID
		    var id1 = getOneStepNode(oContXml);
		    if(id1 == null) {
		        alert("����Ҫ��һ�����ϵĲ������ܼӶ���!");
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
		case "wfprop":{   //��������
			var arrForm=new Array();
			arrForm[0]=fcpubdata.area;
			arrForm[5]=pstrUserFunction;
			var sRet=DjOpen('wfprop',arrForm,'չ��',"��ģʽ����","ֱ��","��������");
			if(sRet == "ok"){
				blnChange=true ;
			}
			break;

		}
		case "openwffile":{   // �������ļ� 
			var sPathValue = '';  
			var spath = '..'+sPathValue;
			if(fcpubdata.dotnetVersion == "") spath = fcpubdata.path.substring(fcpubdata.path.indexOf("/",2),fcpubdata.path.length)+sPathValue;
			var spathback = '../..'+sPathValue;
			var sRet = DjOpen('getUrl',[spath,'file','yes','wf'],'չ��','��ģʽ����','ֱ��','ѡ���ļ�');
			if(IsSpace(sRet) == false){
				pdjFilePath = sRet;
				var shtm=readdesignhtml("<no>"+sRet+"</no><no></no>"+"<No>"+fcpubdata.path+"</No>");
				DesignDjOpenSub(shtm,0);
			}
						
			break;

		}*/
		
		/*������ݼ�*/
		/*����޸�ʱ�䣺2005-01-07*/
		case "grid":{
			var sidtype=name;
			ArrNum[sidtype]++;
			var sid = getNewContID(name,oContXml) ;
			var sHtml="<img controltype='" + name + "' id="+sid+" style='position:" + fcpubdata.position + ";Left:0;Top:0;Height:140;Width:300;' src='../images/ef_designer_webgrid.gif' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() >";	
			htmltocont(sHtml,name) ;
			SelectObj(sid);
			break ;
		}
		/*�����ݼ�����*/
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
				alert("ÿ������ֻ����һ����ʾe�����ؼ���");
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
		case "ebiao" :{  //e��ؼ�
	        ArrNum[name]++;
	        var sid = getNewContID(name,oContXml) ;
	        var sHtml = "<div controltype='" + name + "' id=" + sid + " style='background-color:#ffffff; position:" + fcpubdata.position + "; left:0; Top:0; width:500; height:360;BORDER: 1px solid;' class='control-border-color' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() ondrop='new Eapi.EformEbiao().dragEnter();' ondragend='new Eapi.EformEbiao().dragExit();' ondragstart='new Eapi.EformEbiao().dragStart();' isOnloadRun='��'></div>";

	        htmltocont(sHtml,name) ;
	        SelectObj(sid);
			break ;
		
		}
		case "layout" :{  //���ֿؼ�
	        ArrNum[name]++;
	        var sid = getNewContID(name,oContXml) ;
	        var sHtml = "<div controltype='" + name + "' id=" + sid + " style='background-color:#ffffff; position:" + fcpubdata.position + "; left:0; Top:0; width:500; height:360;;BORDER: 1px solid;' class='control-border-color' onresize=resize() onresizestart=resizeStart() onresizeend=resizeEnd() onmove=move() onmovestart=moveStart() onmoveend=moveEnd() oncontrolselect=controlselect() ></div>";

	        htmltocont(sHtml,name) ;
	        SelectObj(sid);
			break ;

        }
        case "eblayout": 
        {  //����ģ��ؼ�
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
//			var sHtml="<object controltype='" + name + "' classid='clsid:0002E510-0000-0000-C000-000000000046' id="+sid+" style='position:" + fcpubdata.position + "; left:0; Top:0; width:80%; height:200;'><param name='HTMLURL' value><param name='HTMLData' value='&lt;html xmlns:x=&quot;urn:schemas-microsoft-com:office:excel&quot;xmlns=&quot;http://www.w3.org/TR/REC-html40&quot;&gt;&lt;head&gt;&lt;style type=&quot;text/css&quot;&gt;&lt;!--tr{mso-height-source:auto;}td{black-space:nowrap;}.wc4590F88{black-space:nowrap;font-family:����;mso-number-format:General;font-size:auto;font-weight:auto;font-style:auto;text-decoration:auto;mso-background-source:auto;mso-pattern:auto;mso-color-source:auto;text-align:general;vertical-align:bottom;border-top:none;border-left:none;border-right:none;border-bottom:none;mso-protection:locked;}--&gt;&lt;/style&gt;&lt;/head&gt;&lt;body&gt;&lt;!--[if gte mso 9]&gt;&lt;xml&gt;&lt;x:ExcelWorkbook&gt;&lt;x:ExcelWorksheets&gt;&lt;x:ExcelWorksheet&gt;&lt;x:OWCVersion&gt;9.0.0.2710&lt;/x:OWCVersion&gt;&lt;x:Label Style='border-top:solid .5pt silver;border-left:solid .5pt silver;border-right:solid .5pt silver;border-bottom:solid .5pt silver'&gt;&lt;x:Caption&gt;Microsoft Office Spreadsheet&lt;/x:Caption&gt; &lt;/x:Label&gt;&lt;x:Name&gt;Sheet1&lt;/x:Name&gt;&lt;x:WorksheetOptions&gt;&lt;x:Selected/&gt;&lt;x:Height&gt;7620&lt;/x:Height&gt;&lt;x:Width&gt;15240&lt;/x:Width&gt;&lt;x:TopRowVisible&gt;0&lt;/x:TopRowVisible&gt;&lt;x:LeftColumnVisible&gt;0&lt;/x:LeftColumnVisible&gt; &lt;x:ProtectContents&gt;False&lt;/x:ProtectContents&gt; &lt;x:DefaultRowHeight&gt;210&lt;/x:DefaultRowHeight&gt; &lt;x:StandardWidth&gt;2389&lt;/x:StandardWidth&gt; &lt;/x:WorksheetOptions&gt; &lt;/x:ExcelWorksheet&gt;&lt;/x:ExcelWorksheets&gt; &lt;x:MaxHeight&gt;80%&lt;/x:MaxHeight&gt;&lt;x:MaxWidth&gt;80%&lt;/x:MaxWidth&gt;&lt;/x:ExcelWorkbook&gt;&lt;/xml&gt;&lt;![endif]--&gt;&lt;table class=wc4590F88 x:str&gt;&lt;col width=&quot;56&quot;&gt;&lt;tr height=&quot;14&quot;&gt;&lt;td&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;&lt;/body&gt;&lt;/html&gt;'> <param name='DataType' value='HTMLDATA'> <param name='AutoFit' value='0'><param name='DisplayColHeaders' value='-1'><param name='DisplayGridlines' value='-1'><param name='DisplayHorizontalScrollBar' value='-1'><param name='DisplayRowHeaders' value='-1'><param name='DisplayTitleBar' value='0'><param name='DisplayToolbar' value='-1'><param name='DisplayVerticalScrollBar' value='-1'> <param name='EnableAutoCalculate' value='-1'> <param name='EnableEvents' value='-1'><param name='MoveAfterReturn' value='-1'><param name='MoveAfterReturnDirection' value='0'><param name='RightToLeft' value='0'><param name='ViewableRange' value='1:65536'></object>" ;
//			htmltocont(sHtml,name) ;
//			SelectObj(sid);
//			break ;
//		}		
//		
		
		
		
		case "focus":{   /*�������*/
			var sXml=TaborderXml();
			var oX = SetDom(sXml) ;
			var sX = oX.childNodes(0).childNodes.length ;
			if (RemoveRoot(sXml)!="" && sX >= 2){
				SaveoUndoOneRecord();
				var sRet=DjOpen('SKDBfocus',sXml,'չ��',"��ģʽ����","ֱ��","�������");
				fcpubdata.area.billtaborder=sRet;
				SaveoRedoOneRecord();
				//alert(sRet)
			}else{
				alert("�����������Ͽؼ�����ʹ�ô˿��ƣ�");
			}
			
			break;
		}
		case "align":{   /*�������*/
			sArray=CurrSel();
			if(sArray.length<2){
				alert("ѡ�����������Ͽؼ�����ʹ�ô˿���");
				break;
			}
			//alert(sArray.length)
			if(sArray !=""  ){
			   SaveoUndoOneRecord();
		       var sRet=DjOpen('SKDBalign',sArray,'չ��',"��ģʽ����","ֱ��","�������");
		       SaveoRedoOneRecord();
			}    
			break;

		}
		case "menu":{
			var str = DjOpen('menu','','չ��',"��ģʽ����","ֱ��","");
			break;
		}
		case "cut":	//---����
			if(CopyCont()){ 
				main_onkeydown(46);
				main_exec('Delete');
				main_onkeyup(46);
				//event.returnValue=false ;
			}
			break;
		case "copy":	//---����
			if(CopyCont() == false){
				document.execCommand("Copy") ;
			}
			break;
		case "paste":	//---ճ��
			
			if(PasteCont() == false){
				document.execCommand("Paste") ;
			}
			break;

		case "front":{	/*ǰ��*/
			AdjustPositionBefore("��");
			break;
		}
		case "behind":{	/*����*/
			AdjustPositionBefore("��");
			break;
		}
		/*
		case "dsmain":{   
		
			arrtmp1[0]=pubDsMain ;
			arrtmp1[2]=fcpubdata.area ;
			var sRet=DjOpen('SKBILLgrid',arrtmp1,'չ��',"��ģʽ����","ֱ��","�����ݼ�����") ;
			blnChange=true ;
			break;

		}*/
		case "formatTab":{ /*��ʽ���*/
			var Htm = DjOpen('fcs_NewFormatTab','SKbillsheet','չ��',"��ģʽ����","ֱ��","�½���ʽ���") ;
			if(typeof Htm == 'undefined') {
				fcpubdata.area.innerHTML += "";
			}else{
				htmltocont(Htm);
			}
			blnChange=true ;
			break;
		}
		case "HtmlTab":{  /*HTML���*/
			var sHTab = DjOpen('fcs_NewHtmlTab',fcpubdata,'չ��',"��ģʽ����","ֱ��","�½����") ;
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
		case "form":{   /*������*/
			//sArray=CurrSel();
			var arrForm=new Array();
			arrForm[0]=fcpubdata.area;
			arrForm[5]=pstrUserFunction;
			var sRet=DjOpen('form',arrForm,'չ��',"��ģʽ����","ֱ��","������");
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
		case "listconfig":{   /*�г�����������������Ϣ�����в鿴*/
			DjOpen("FormElementInfo",window,"չ��","��ģʽ����","ֱ��","�г�������������Ϣ");
			break;
		}
		
		case "ebiaoform":{   /*ebiao ������*/
			var obj = parent.dialogArguments[0]; //e����table����.
			var s1 = obj.eform_winprop;
			if(typeof s1 == "undefined") s1="";
			var sRet=DjOpen('eb_parawin',[s1,fcpubdata.area],'չ��',"��ģʽ����","ֱ��","���ô����������");
			if(IsSpace(sRet) == false){
				obj.eform_winprop = sRet;
			}
		
			break;
		}
case "ebiaobind": 
    {   /*ebiao ������*/
        /*if(curSelElement == null )
        {
        alert("���ڽ�����ѡ��һ���ؼ�������!");
        break;
        }
        var tmpType = curSelElement.controltype ; 
        if(tmpType != "text"  && tmpType != "checkbox"  && tmpType != "radio"  && tmpType != "listbox"  && tmpType != "combobox"  && tmpType != "dropdownlist"  && tmpType != "textarea"  && tmpType != "spin"){
        alert("��ǰѡ�еĿؼ����ܰ�!");
        break;
        }
        var s2 =curSelElement.id ;
        if(IsSpace(s2) ) {
        alert("��ǰѡ�еĿؼ���id����Ϊ��!");
        break ;
        }*/
        var obj = parent.dialogArguments[0]; //e����table����.
        var s1 = obj.e_argsbak;
        if (typeof s1 == "undefined") s1 = "";
     
        var sRet = DjOpen('eb_parabind', [s1, oContXml], 'չ��', "��ģʽ����", "ֱ��", "ѡ�񱨱�����İ󶨿ؼ�");
        if (IsSpace(sRet) == false) {
            obj.e_argsbak = sRet;
        }

        break;
    }
		case "userfunction":{   /*�Զ��庯��*/
			var stmp=DjOpen('userfunction',pstrUserFunction,'չ��',"��ģʽ����","ֱ��","�Զ��庯��");
			if(typeof stmp != "undefined") pstrUserFunction=stmp;
			blnChange=true ;
			break;

		}
		case "userfunction1":{   /*��codemax���Զ��庯��*/
			try{
				var l=new ActiveXObject("CodeMax.Language.3");
			}catch(e){
				if(window.confirm("û�а�װcodemax����IE�İ�ȫ�������Կ��ж�û�б��Ϊ��ȫ��activex�ؼ����г�ʼ���ͽű����е�ѡ��ûΪ�������Ƿ����ذ�װcodemax!")==true){
					window.open("../design/download.htm","","height=250,width=300,left=300,top=150,resizabel=no,menubar=no") ;
				}
				break;
			}
			var stmp=DjOpen('userfunction1',pstrUserFunction,'չ��',"��ģʽ����","ֱ��","����ɫ���Զ��庯��");
			if(typeof stmp != "undefined") pstrUserFunction=stmp;
			//blnChange=true 
			//break;
			//CopyToPub("aa:"+pstrUserFunction);
			//var stmp=window.showModalDialog("../design/codemax.htm",pstrUserFunction,"status:no;dialogHeight:570px;dialogWidth:780px;center:yes;resizable:yes")  
			//if(typeof stmp != "undefined") pstrUserFunction=stmp
			
			//pstrUserFunction=DjOpen('userfunction',pstrUserFunction,'չ��')
			blnChange=true ;
			break;
        }
    case "userfunction_codemirror":
        {   /*�Զ��庯��*/
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
		
		case "addhtml":{   /*����ҳ��*/
			var stmp=DjOpen('addhtml',pstrAddHtml,'չ��',"��ģʽ����","ֱ��","����ҳ��");
			if(typeof stmp != "undefined") pstrAddHtml=stmp;
			blnChange=true ;
			break;

		}
		case "opendj":{   /*�򿪱�*/

			var sRet=DjOpen('opendj','','�޸�',"��ģʽ����","ֱ��","ѡ������ݿ��д򿪵ı�");
			//alert(sRet)
			if(isSpace(sRet)==false){
				DesignDjOpen(sRet);
			}
			
			break;

		}
case "opendjfile": 
    {   /* �򿪱��ļ� */
        //var sPathValue = '';  // /fceform/djfile
        //var spath = '..' + sPathValue;
        //if(fcpubdata.dotnetVersion == "") spath = fcpubdata.path.substring(fcpubdata.path.indexOf("/",2),fcpubdata.path.length)+sPathValue;
        //var spathback = '../..' + sPathValue;
        var spath = '';
        var sRet = DjOpen('getUrl', [spath, 'file', 'yes', 'dj'], 'չ��', '��ģʽ����', 'ֱ��', 'ѡ���ļ�');
        if (IsSpace(sRet) == false) {
            //obj.value ="../"+ spath+sRet;	//��eformaspxĿ¼�ȵ�ǰ��ҳ������Ŀ¼��һ��
            pdjFilePath = sRet;
            //var shtm=readdesignhtml("<no>"+sRet+"</no><no></no>"+"<No>"+fcpubdata.path+"</No>");
            var shtm = readdesignhtml("<file>" + sRet + "</file>");
            DesignDjOpenSub(shtm, 0);
        }


        break;

    }
		
		case "save":{   /*�����*/
			DesignDjSave() ;
			//AutoAddQueryDj();
			blnChange=false;
			//��ʼҳ
			//SetPara("origPage",)
			break;

		}
		case "saveas":{   /*����*/
			DesignDjSaveAs() ;
			blnChange=false;
			break;

		}
		case "new":{   /*�½���*/
			parent.objlist.select1.options.length = 0;
			DesignDjNew("��") ;
			//blnChange=false;

			break;

		}
		case "newempty":{   /*�½��ձ�*/
			parent.objlist.select1.options.length = 0;
			DesignDjNew() ;
			//blnChange=false;

			break;

		}
		
		case "djpreview":{   /*��Ԥ��*/
			var djsn=fcpubdata.area.dj_sn;
			if(typeof djsn == "undefined"){
				alert("���������Դ��������˵���sn�����Ԥ��!");
				return ;
			}
			if(blnChange){
				var stmp = DesignDjSave("����ʾ") ;
				if(IsSpace(stmp) == false) {
					//alert(stmp) ;
					return ;
				}
			}
			var sUrl=location.protocol + "//"+location.host+fcpubdata.path+"/fceform/design/opendj.htm?djsn=" ;
			var isfile=fcpubdata.area.isfile;
			if(isfile == "��"){
				var objBillType = BillTypeNameToPath(fcpubdata.area.type);
				sUrl += "/" + objBillType.path + djsn + "&isfile=yes";
			} else {
				sUrl += djsn + "&isfile=test" ;
			}
			open(sUrl);
			break;

		}
		case "directrun":{   /*��ֱ������*/
			var djsn=fcpubdata.area.dj_sn;
			if(typeof djsn == "undefined"){
				alert("���������Դ��������˵���sn�����Ԥ��!");
				return;
			}
			/*
			var isfile=fcpubdata.area.isfile;
			if(isfile == "��"){
				alert("�ļ����޷�ֱ�����У�ֻ�н������������ݿ���ʱ����ֱ������!");
				return;
			}*/

			if(blnChange){
				var stmp = DesignDjSave("����ʾ") ;
				if(IsSpace(stmp) == false) {
					//alert(stmp) ;
					return ;
				}
			}
			var sUrl=location.protocol + "//"+location.host+fcpubdata.path+"/fceform/common/djframe.htm?djsn="+djsn+"&djtype="+fcpubdata.area.type ;
			open(sUrl);
			break;

		}
		case "billtype":{   /*������ά��*/

			var sRet=DjOpen('billtypefile','','չ��',"��ģʽ����","ֱ��","������ά��");
			break;

		}
		case "createhtmfile":{   /*������ʽ���е�HTM�ļ�*/
			if(isSpace(fcpubdata.area.dj_sn)){
				var s1 = '��sn����Ϊ��!���������Դ��������SN.';
				alert(s1);
				return ;
			}
		
			//����ƽ����������д�
			DesignStr_RunStr_Before(fcpubdata.area);
			fcpubdata.area.removeAttribute("contentEditable");
			fcpubdata.area.removeAttribute("unselectable");

			//�����תΪ���д�
			var sRun=fcpubdata.area.outerHTML;
			
			sRun=DesignStr_RunStr_After(sRun);
			//���д�=������+��������ƴ�+����ҳ�洮	
			sRun="<scr"+"ipt>"+pstrUserFunction+"</scr"+"ipt>"+sRun+pstrAddHtml	;
			
			//�����д�����ΪHTM�ļ�
			sRun="<![CDATA["+sRun+"]]>";
			var sFile = new Eapi.Str().trim(fcpubdata.area.dj_sn) + ".htm";
			var sPath = "fceform/dj/" + sFile; //fceform��ʼ��·���ļ���
			//var sXml = "<no>djsn</no><no>"+sRun+"</no><no>" + sPath + "</no>"+"<No>"+fcpubdata.path+"</No>";
			var sXml = "<file>/" + sPath + "</file><text>"+sRun+"</text>";
			var ret=savedesignhtml(sXml);
			if(ret == "") {
				alert(sFile+"�ļ�����ɹ�!");
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
	//�ӿؼ�ʱ�������ݼ��е�����
	if(fcpubdata.autoAddField == "yes" && oAddField != null && $id("DsMain") != null ){
		 
		var s = $id("DsMain").formatxml ;
		var curNo = 0;
		if(typeof s == "undefined"){
			s = ""
		}else{
			s = RemoveRoot(s);
			curNo = getMaxFieldNo();
		}
		var sF = '<tr><td>field'+ curNo +'</td><td>field'+ curNo +'</td><td>�ַ�</td><td>50</td><td>0</td><td>������</td><td></td><td></td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td></td><td></td><td>left</td><td>80</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
		$id("DsMain").formatxml = "<root>"+s+sF+"</root>";
		oAddField.dataset = "DsMain";
		oAddField.field = "field"+curNo;
		
		
	}
	
	//�������ˮ�����ֶ���
	function getMaxFieldNo() {
		var comType = "DsMain_field";
		var curNo = 0;
		if(isNaN(parseInt(ArrNum[comType])) == false){ ; //��ǰ���ؼ����͵������,int��
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
			alert("DsMain���ݼ����ֶ����ظ����������޸ġ�");
		}
		
		return curNo;
	}
	//ǰ��/����
	function AdjustPositionBefore(yes) {
		//��ǰ���ؼ�����
		var slen=oContXml.selectNodes("//id").length;
		if(slen<2){
			alert("�����ؼ��������ô˿���");
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
			if(yes == "��"){
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
//ִ�б���Ʊ���
*@date 2004-08-04
**/
function designdjsave(sXml) {
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=designdjsave",sXml);
	return retX;
}
/**
*������ƴ����ļ������س�����Ϣ
**/
function savedesignhtml(sXml) {
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=savedesignhtml",sXml);
}

/**
*�����ݴ浽���ݻ�����
*@param Main Ϊ��key, ��"List".
*@param Sub Ϊ��key,��"CustomerFlag"
*@param userData ָ��userData��λ��
*@param strContent ΪҪ���������
*@return �޷���
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
*�����ݻ�����װ�뵽������
*@param Main Ϊ��key, ��"List".
*@param Sub Ϊ��key,��"CustomerFlag"
*@param userData ָ��userData��λ��
*@return ����ȡ��������
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
*�����ؼ���ճ���ؼ�ʱ�Զ��������ID
*@param comType �ؼ�����
*@param oContXml ��ǰҳ���ID ��dom����
*@return �ַ���,�õ����ظ���ID����
*@date 2005-01-16
**/
function getNewContID(comType,oContXml){
	var sRet = "id1" ;
	var curNo = 1 ;
	if(isNaN(parseInt(ArrNum[comType])) == false){ ; //��ǰ���ؼ����͵������,int��
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
	alert(sid + "�ؼ������ظ�!�������޸�!");
	return sid;

}
function isHaveControlType(controlType) {
///�ж��Ƿ��ǾɵĿؼ����ͣ�2013-03-18
    for (var i = 0; i < 36; i++) {
        if (ArrName[i] == controlType) return true;
    }
    return false;
}
/**
* �ڿؼ���˫��ʱ,�����Կ�
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
		try { //�³���
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
		//����checkbox�㵽�ڲ����ݵ����
		try {
			var stmp1 = obj.parentNode.controltype;
			if( stmp1 =="checkbox"){
				obj=obj.parentNode;
				strid=obj.id;
			}
		} catch(e) {}
		
		//�������ҳǩ�ؼ���table������������
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
	arr[3]=oContXml;  //��ǰ���Ŀؼ����Ƶ�XML����
	//try {
	    //��ȡ���㴰��,2011-03-15
	    arr[4] = getTopWin(); // Printer; //eprintʹ��
	//}catch(e){}
	arr[5]=pstrUserFunction; 
	arr[6]= window; //2008-10-29 add,����������������������Ա�
	SaveoUndoOneRecord();

	var arrCur = CurrSel();
	if(arrCur.length>1){
		arr[0]=arrCur;
		var sRet=DjOpen('pubAttr',arr,'չ��','��ģʽ����','ֱ��','���ö���ؼ�������');

    } else {
        var controlType = obj.controltype;
		if(isSpace(controlType) == false ){
			if(controlType == "ebiao"){
			    var oTable = new Eapi.EformEbiao().open(obj);
			    arr[7] = oTable; 
			    var oRet = window.showModalDialog("../ereport/ebdesign.htm",arr,"center:yes;dialogWidth:800px;dialogHeight:600px;resizable:yes");
			    new Eapi.EformEbiao().ret(obj,oRet,oTable) ;
			}else{
			//				var sRet=DjOpen("../../fceform/common/djframe.htm?djsn="+obj.controltype+"&djtype=ST",arr,'չ��','��ģʽ����','ֱ��',obj.controltype+'����');
			if (isHaveControlType(controlType)) {
			        
			        var sRet = DjOpen(controlType, arr, 'չ��', '��ģʽ����', 'ֱ��', controlType + '����');
			    } else {
			        
			        var oo = new Eform.AllWidget().getDesignObj(controlType);
    			    oo.propBefore();
    			    var sRet = DjOpen("../../fceform/common/djframe.htm?djtype=WG&djsn="+controlType, arr, 'չ��', '��ģʽ����', 'ֱ��', controlType + '����');
    			    oo.propAfter();
                    
			    }
				if(controlType == "dataset"){
					//ˢ�����ҳ����ֶ��б�
					ShowAllField();
				}
			}
		}else {	//Ϊ�˼�����ǰ��ģʽ
	
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
					var sRet=DjOpen(ArrNameNew[ArrName1[i]],arr,'չ��','��ģʽ����','ֱ��',ArrNameNew[ArrName1[i]]+'����');
					bool = true;
					break;
				}
			}
			if(bool == false ) {
				var sTag = obj.tagName;
				if(isSpace(sTag) == false ) {
					sTag = sTag.toUpperCase() ;
					//�ⲿ�ؼ�ֻ������Щ
					if(sTag == "INPUT" || sTag == "SELECT" || sTag == "TEXTAREA" || sTag == "BUTTON" || sTag == "A" || sTag == "IMG") {
						//set controltype setting_controltype
						if (obj.NotShowCtrlType != "��")
						    var sRet=DjOpen('SetCtrlType',arr,'չ��','��ģʽ����','ֱ��','����');
					}
				}
			}
		}
		SaveoRedoOneRecord();
	return;
	}
}
/**
�ӽ����ϵõ��ɹ�ѡ������ݼ��ֶ���Ϣ������������
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
*ɾ�����е�oUndo��oRedo�����еĽڵ�
**/
function initoUndooRedo(){
	lngUndo=-1;//childNodes.item(0)��0��ʼ
	lngRedo=-1;
	//cmdUndo.disabled =true
	//cmdRedo.disabled =true
	oUndo.loadXML("<root></root>");
	oRedo.loadXML("<root></root>");
}
/**
*����һ��oRedo����ļ�¼�����Ƚ��ȳ��Ĺ��򣬱���ֻ��8����¼
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
*����һ��oUndo����ļ�¼�����Ƚ��ȳ��Ĺ��򣬱���ֻ��8����¼
**/
function SaveoUndoOneRecord(){
	var root = oUndo.documentElement	;
	var newNode = oUndo.createNode (1, "record", "");
	root.appendChild(newNode);
	var newElem = oUndo.createElement("contxml") ;
	newNode.appendChild(newElem);
	newNode.lastChild.text = escape(oContXml.documentElement.xml);

	var newElem = oUndo.createElement("SKbillsheet"); //���
	newNode.appendChild(newElem);
	newNode.lastChild.text = escape(fcpubdata.area.outerHTML);

	//var newElem = oUndo.createElement("oFormula")
	//newNode.appendChild(newElem)
	//newNode.lastChild.text = escape(oFormula.documentElement.xml)
	
	lngUndo=lngUndo+1;	
	//cmdUndo.disabled =false//����undo
	if (oUndo.documentElement.childNodes.length >8)	{
		DeleteoUndoOneRecord(0);
		lngUndo=7;//��0-7
	}	
}
/**
*����һ��oUndo����ļ�¼	
**/
function ReadoRedoOneRecord(lngKey){
	oContXml=SetDom(unescape(oRedo.documentElement.childNodes(lngKey).childNodes(0).childNodes(0).xml));
	fcpubdata.area.outerHTML=unescape(oRedo.documentElement.childNodes(lngKey).childNodes(1).childNodes(0).xml);
	fcpubdata.area = $id("SKbillsheet");
	openobjlist();
	//oFormula.loadXML (unescape(oRedo.documentElement.childNodes.item(lngKey).childNodes.item(2).childNodes.item(0).xml))
}
/**
*����һ��oUndo����ļ�¼	
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
*ɾ��Redoһ�м�¼�����Ƚ���ɾ�Ĺ��򣬱���ֻ��8����¼
* intR=0ɾ����һ���ڵ�
**/
function DeleteoRedoOneRecord(intR){
	oRedo.documentElement.removeChild(oRedo.documentElement.childNodes.item(intR));
}
/**
*ɾ��Undoһ�м�¼�����Ƚ���ɾ�Ĺ��򣬱���ֻ��8����¼
* intR=0ɾ����һ���ڵ�
**/
function DeleteoUndoOneRecord(intR){
	oUndo.documentElement.removeChild(oUndo.documentElement.childNodes.item(intR));	
}
/**
*�������ϵ�Redo��ť�ĵ���¼�
**/

function cmdRedo(){	
		
	var intMaxR=oRedo.documentElement.childNodes.length - 1;//��ǰoRedo�����е�����¼��
	if (lngRedo>=0 && lngRedo<=intMaxR){
		ReadoRedoOneRecord(lngRedo);//������ǰundo��Ӧ��ֵ
		lngUndo=lngRedo;
		lngRedo=lngRedo+1;
		//cmdUndo.disabled =false//����һ��redo��undo�϶�������
	}
	//if (lngRedo>intMaxR && lngRedo<0){
		//cmdRedo.disabled =true //�϶�������redo�Ĺ���
	//}	
	window.focus();
	fcpubdata.area.focus();
}
/**
*�������ϵ�Undo��ť�ĵ���¼�
**/
function cmdUndo(){	
	//SaveoRedoOneRecord();
	var intMaxR=oUndo.documentElement.childNodes.length - 1;//��ǰoRedo�����е�����¼��
	if (lngUndo>=0 && lngUndo<=intMaxR){
		ReadoUndoOneRecord(lngUndo);	
		lngRedo=lngUndo;
		lngUndo=lngUndo - 1;		
		//cmdRedo.disabled =true//����һ��undo��redo�϶�������
	
		//clearBlueScale()
	}
	/*if (lngUndo<=0 && lngUndo>intMaxR){
		cmdUndo.disabled =true//undo�϶���������
	}
	if (lngUndo>=intMaxR && lngUndo<0){
		cmdRedo.disabled =true//redo�϶���������
	}*/
	window.focus();
	fcpubdata.area.focus();
}
function resizeStart(){
	SaveoUndoOneRecord();
}
function resizeEnd() {
    //�޸�shape���϶�
    AdjustShapePos(event.srcElement);
	SaveoRedoOneRecord();
}
function AdjustShapePos(objEvent) {
    //�޸�shape���϶� 2011-07-08

    if (objEvent.controltype == "shape") {
        var s1 = objEvent.style.width;
        var s2 = objEvent.style.height;
        var sType = objEvent.linetype;
        var sFrom = "";
        var sTo = "";
        if (sType == '����' || sType == '�Ҽ�ͷ' || sType == '���ͷ') {
            sFrom = "0,0";
            sTo = s1 + ",0";
        }
        if (sType == '����' || sType == '�ϼ�ͷ' || sType == '�¼�ͷ') {
            sFrom = "0,0";
            sTo = "0," + s2;
        }
        if (sType == '��б��' || sType == '����б��ͷ' || sType == '����б��ͷ') {
            sFrom = "0," + s2;
            sTo = s1 + ",0";
        }
        if (sType == '��б��' || sType == '����б��ͷ' || sType == '����б��ͷ') {
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
*�жϵ�ǰѡ�еĿؼ��Ƿ�Ϊ����
*@return true ������,����Ϊnull�������
*@date 2005-02-26
**/
function IsDivCont() {
	if(curSelElement == null) return false;
	//|| curSelElement.id.indexOf("PageControl")>=0
	if (curSelElement.id == "fcpagesub"  || curSelElement.controltype == "div" || curSelElement.controltype == "tab") return true;
	
	return false;

}
/**
��HTML���ӵ��ؼ���,����ArrCom����
@param sHtml Ҫ�ӵ�HTM��
@param comName ��ǰ�ؼ���������
@param NotOne == "��" ��ʾһ�μӶ���ؼ�,����ճ���ؼ�
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
        //�ж��Ƿ��п��õĵ�Ԫ��
        var oTd = new Eapi.EformEbiao().getEmptyTd(curSelElement);
        if(oTd == null){
            alert("û���ܹ�װ�ؼ��ĵ�Ԫ��,�ؼ������ӵ�����.");
            fcpubdata.area.innerHTML+=sHtml;
        }else{ //�ؼ��ŵ���Ԫ����.
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
	

	//����һ���ؼ����޸�ȫ�ֵ�oContXml����
	if(NotOne == "��"){
		//��ճ�����ĵ��ô˺���֮���ٴ���
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
*����һ���ؼ����޸�ȫ�ֵ�oContXml����
*@param comType �ؼ���������
*@param contID  Ҫ�ӵĿؼ���ID
**/
function AddContXml(comType,contID) {
	if(isSpace(contID)) contID = comType + ArrNum[comType];
	//���ID�Ѵ���,�򲻼�
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
	//��ҳ���ϵĿؼ����ӵ�select1��
	parent.objlist.execScript("objlist_add('"+contID+"','"+comType+"')");
}



/**
	�ؼ�����
*@return true ��ʾ�����˿ؼ�����,�����ý���Ĭ�ϴ���
	@date 2004-06-28
**/
function CopyCont() {
	var sAll="fc__~$#@__fc"; //eform�ؼ��ı�ʶ.
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
	�ؼ�ճ��
*@return true ��ʾ�����˿ؼ�����,�����ý���Ĭ�ϴ���
	
	@date 2004-06-28
**/
function PasteCont() {
	try{
		fcpubdata.area.focus() ;
	}catch(e){}
	var s1=window.clipboardData.getData("Text") ;
	if (isSpace(s1)) return false;
	
	
	//alert(s1.substring(0,1))
	//����ճ��HTML
	var sAll="fc__~$#@__fc"; //eform�ؼ��ı�ʶ.
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
	var sLen=oXml.documentElement.childNodes.length;//�ӽڵ�ĸ���
	var arrNewId = new Array() ; //������ID������ָ�ѡ��״̬��
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

	htmltocont(s1,"","��");
	//�ָ�ѡ��״̬
	var oControlRange = document.body.createControlRange();
	for(var i=0;i<sLen;i++){
		
		try { //���˿ؼ��ڽ����ϲ�����ʱ�����.����try
			oControlRange.add(eval(arrNewId[i]));
		}catch(e){}
	}	
	try { //���˿ؼ��ڽ����ϲ�����ʱ�����.����try
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
	��ǰѡ�еĿؼ�
	@date 2004-07-19
	@return ���飨�ѵ�ǰѡ�еĿؼ�����һ�������У�
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
�ó�����ģ�ⰴ��del��
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
	����shift,ctrl�����ƶ��ؼ��Ĵ�С��λ��
	@date 2004-07-20 
	@return ��
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
		//����ǲ���ѡ����controltypeΪ�յĿؼ�
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
		//�޸� oContXml 
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
					//ɾ��objlist
					parent.objlist.execScript("objlist_del('"+sid+"')");
					//ˢ���ֶ��б�
					if(comType == "dataset"){
						ShowAllField();
					}
				}					
			}
			//alert(oContXml.documentElement.xml)
			
			//�޸�taborder
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
			//�ָ�E��ؼ��еĵ�Ԫ������
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
            if (sArray[j].length > 1) return; //�ж��ͬ���ؼ�,ѡ��ҳǩ����ҳʱ.
            try { //�п��ܿ�Ȼ�߶�С��0������
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
	������ӵ�ҳ���ϵĿؼ�����ѡ��״̬
	@date 2004-07-23 zl
	@param sidΪ�ؼ���id
	@param noadd_objlist =true ��ʾ����
	@return ��
**/
function SelectObj(sid,noadd_objlist){
	blnChange=true ;
	if(typeof noadd_objlist == "undefined"){


		if(curSelElement != null){
			if (IsDivCont() ) return;
		}
	}
	try { //���˿ؼ��ڽ����ϲ�����ʱ�����.����try
		var oControlRange = document.body.createControlRange();
		oControlRange.add(eval(sid));
		oControlRange.select();
	}catch(e){}
}
/**
* ͬ��ocontxml ==> objlist.htm
*@date 2005-04-05
**/
function openobjlist() {
	//�������δ����,����ʱ
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
		//����ؼ��б�
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
*��ʾ�����ֶ�
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
		//�����ֶ��б�
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
* ���ֶ��б���˫�����ֶε������
*@param dsName ���ݼ�����
*@param fieldName �ֶ���
*@param chnName �ֶ�������
*@date 2006-01-23
**/
function AddBindField(dsName,fieldName,chnName) {
	var sPosition="";
	if(curSelElement != null && curSelElement.tagName.toUpperCase() == "TD"){
		sPosition="inTD";
	}
	if(fcpubdata.dbStruDict == "FC_ENTITY"){
	    //var tableName =  //���ȡ�ñ�����?
	    var tableName = $id(dsName).queryTableName;
	    var obj = getNewFieldInputStr(dsName,tableName,fieldName,chnName,sPosition);
	}else{
	    var obj = getFieldInputStr(dsName,fieldName,chnName,sPosition);
    }
	if(obj.content != ""){
		AddContXml(obj.type,obj.sid);
		htmltocont(obj.content,obj.type,"��");
		SelectObj(obj.sid);
	}else{
		alert("��ǰ�ֶ�Ĭ������Ϊ���أ�");
	}

}
/**
* ȡ��һ���ֶε�����ؼ���Ϣ
*@param sPosition ="inTD" ��ʾ��TD�����м�, ="" ��ʾ��static��ʽ, ="position:absolute;left:5;top:10;" ��ʾ�ӵ�������Ϣ,
*@date 2008-02-01
**/
function getFieldInputStr(dsName,fieldName,chnName,sPosition){
	var sStr =new Sys.StringBuilder(); 
	var sType = "" ; 
	var retWidth = 0,retHeight = 20; //�����õĸ߿�,��������¼��ǰ�ؼ�ռ�õĸ߿�
	//����TD�м��룬����Ϊ100%
	var sWid = "";
	var sHei = "20px"; //�༭��Ĭ�ϸ߶�Ϊ20px
	var sBorder = " BORDER-BOTTOM: silver 1px solid;" ;
	var sid = "" ; //�ؼ�id
	if(sPosition == "inTD" ){ //��TD������
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
				//option��
				if(oo.documentElement.childNodes.length>=4) var spubOption = UnRepXml(oo.documentElement.childNodes(3).text) ;
				//format��
				if(oo.documentElement.childNodes.length>=5) var spubFormat = UnRepXml(oo.documentElement.childNodes(4).text ) ;
			var spubCheck ="1" ; //1Ϊ����,2Ϊsql���
			if(IsSpace(sX2) == false) spubCheck="2";
			sType = oo.documentElement.nodeName ;
			
			switch ( sType ) {
				case 'radio':{  //radio�ؼ�
				    retHeight = 50 ;
					sid = "rdo"+fieldName ;
					sStr.append( '<FIELDSET id="'+sid+'" dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() contentEditable=false style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() value="-1" controltype="radio" tempvalue="'+sX0+'" temptext="'+sX+'" aspect="����" readOnly="false" legend="'+chnName+'"><LEGEND>'+chnName+'</LEGEND>');
					var rdolen = sX.split('\n') ;
					var rdol = sX0.split('\n') ;
					for(var jj=0; jj<rdolen.length; jj++){
						sStr.append( '<INPUT type=radio value="'+rdol[jj]+'" name=RGrdo'+fieldName+' text="'+rdolen[jj]+'"><SPAN onclick=RGrdo'+fieldName+'['+jj+'].checked=true;');
						sStr.append( 'rdo'+fieldName+'.value=RGrdo'+fieldName+'['+jj+'].value;RGrdo'+fieldName+'['+jj+'].focus();>'+rdolen[jj]+'</SPAN>&nbsp;');
					}
					sStr.append( '</FIELDSET>' );
					break;	
				}
				
				case 'readonly':{  //ֻ���ؼ�
					sid = "txt"+fieldName ;
					sStr.append( '<INPUT type=text onmove=move() readOnly oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					sStr.append( 'style="'+sPosition+''+sBorder+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'; TEXT-ALIGN: left" onmovestart=moveStart() ');
					sStr.append( 'controltype="text" dataset="'+dsName+'" value="'+chnName+'" CanSelect="false" china="'+chnName+'" field="'+fieldName+'"></INPUT>');
					break ;
				}
				case 'facard':{ //��������
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

					sStr.append( '<BUTTON onmove=move() oncontrolselect=controlselect() id=cmd_'+fieldName+' onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition1+'BORDER-RIGHT: 0px; BORDER-TOP: 0px; BORDER-LEFT: 0px; WIDTH: 17px; BORDER-BOTTOM: 0px; BACKGROUND-REPEAT: no-repeat; HEIGHT: 18px; " onmovestart=moveStart() controltype="button" fc_onclick="bill_onclick(&quot;'+sfacard+'&quot;)" dropstyle="��"></BUTTON>');
					//CopyToPub(sStr)
					retWidth += 17 ;
					break;
				}
				
				case 'hidden':{  //���ؿؼ�
					sStr.append( '');
					retWidth = 0;
					retHeight = 0;
					break;
				}
				case 'checkbox':{  //checkbox�ؼ�
				    retHeight = 20;
					sid = "chk"+fieldName ;
					sStr.append( '<DIV onmove=move() dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" truevalue="'+sX0+'" falsevalue="'+sX+'" oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px;" onmovestart=moveStart() noWrap value="��" falsevalue="��" truevalue="��" controltype="checkbox"><INPUT oncontrolselect=controlselectcancel() type=checkbox><SPAN>'+chnName+'</SPAN></DIV>');
					break;
				}
				
				case 'date':{  //���ڿؼ�
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
					sStr.append( '<BUTTON onmove=move() oncontrolselect=controlselect() id=cmd_'+fieldName+' onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition1+'BORDER-RIGHT: 0px; BORDER-TOP: 0px; BORDER-LEFT: 0px; WIDTH: 17px; BORDER-BOTTOM: 0px; BACKGROUND-REPEAT: no-repeat; HEIGHT: 18px; " onmovestart=moveStart() controltype="button" fc_onclick="'+Seldate+'" dropstyle="��"></BUTTON>');
					retWidth += 17;
					break;
				}
				case 'textarea':{  //���ı�
				    retHeight = 50 ;
					sid = "txt"+fieldName ;
					sStr.append('<TEXTAREA onmove=move() dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+';WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'" onmovestart=moveStart() cols=26 controltype="textarea" value=""></TEXTAREA>');
					break;
				}
				case 'combobox' :{  //combobox�ؼ�
				    retHeight = 25;
					sid = "cbo"+fieldName;
					sStr.append( '<SELECT onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					sStr.append( 'style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() controltype="combobox" ');
					sStr.append( 'check="'+spubCheck+'" dataset="'+dsName+'" tempvalue="'+sX0+'" temptext="'+sX+'" sql="'+sX2+'"  china="'+chnName+'" field="'+fieldName+'">');
					sStr.append( spubOption);
					sStr.append('</SELECT>');
					break;
				}
				case 'listbox':{   //lst�ؼ�
				    retHeight = 50 ;
					sid = "lst"+fieldName;
					sStr.append( '<SELECT onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+'; ');
					sStr.append( 'WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() size=8 controltype="listbox"');
					sStr.append( 'dataset="'+dsName+'" china="'+chnName+'" field="'+fieldName+'" check="'+spubCheck+'" tempvalue="'+sX0+'" temptext="'+sX+'" sql="'+sX2+'">');
					sStr.append( spubOption);
					sStr.append( '</SELECT>');
					break;
				}
				case 'dropdownlist':{ //fccode�ؼ�
					sid = "ddl"+fieldName ;
					sStr.append( '<IMG id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() style="'+sPosition);
					sStr.append( 'WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; ');
					sStr.append( 'ButtonWidth: 10" onmovestart=moveStart() src="../images/ef_designer_fccode.gif" controltype="dropdownlist" ');
					sStr.append( 'dataset="'+dsName+'" china="'+chnName+'" field="'+fieldName+'" check="'+spubCheck+'" tempvalue="'+sX0+'" temptext="'+sX+'" visible="��" blninput="��" blnempty="��" addrow="��" multiselect="��" sql1="'+sX2+'" xml="'+spubOption+'" format="'+spubFormat+'" >');
					break;
				}
				default:{ //�ı���
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
* ȡ��һ���ֶε�����ؼ���Ϣ,��������ƽ̨��
*@param sPosition ="inTD" ��ʾ��TD�����м�, ="" ��ʾ��static��ʽ, ="position:absolute;left:5;top:10;" ��ʾ�ӵ�������Ϣ,
*@date 2009-03-12
**/
function getNewFieldInputStr(dsName,tableName,fieldName,chnName,sPosition){

	var sStr =new Sys.StringBuilder(); 
	var sType = "" ; 
	var retWidth = 0,retHeight = 0; //�����õĸ߿�,��������¼��ǰ�ؼ�ռ�õĸ߿�
	//����TD�м��룬����Ϊ100%
	var sWid = "80";
	var sHei = ""; 
	//var sBorder = " BORDER-BOTTOM: silver 1px solid;" ;
	var sid = "" ; //�ؼ�id
	if(sPosition == "inTD" ){ //��TD������
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
		
            if(sType == "ѡ���б�" || sType == "��ѡ�б�" || sType == "���ҹ�ϵ"){
                var contType = getDomNodeValue(oo,"isLstContType");
		        var sListText = getDomNodeValue(oo,"listText");
		        sListText = RepStr(sListText,"&#13;&#10;","\r\n") ;
		        var sListValue = getDomNodeValue(oo,"listValue");
		        if(IsSpace(sListValue) == false) sListValue = RepStr(sListValue,"&#13;&#10;","\r\n") ;
		        
		        //sql
		        var sListSql  = "" ;
		        if(sType == "���ҹ�ϵ"){
		            var mainTabName = getDomNodeValue(oo,"mainTableName");
		            var sQueryType = "1";
		            if(contType == "dropdownlist"){
		                sQueryType = "2";
		            }
		            var ret1 = SqlToField("select fdlist from fc_query where fc_query.type="+sQueryType+" and tbname='"+mainTabName+"'");
		            if(IsSpace(ret1) == false){
		                sListSql = "select "+ret1+" from " + mainTabName ; //�˴�û�п��Ǳƽ�����
		            }
		        }
		        //option��
		        var spubOption = PropWinListValueToOption(sListText,sListValue,getDomNodeValue(oo,"defaultValue"),contType == "dropdownlist") ;
		        //format��
		        var spubFormat = "";
		        var spubCheck ="1" ; //1Ϊ����,2Ϊsql���
		        if(IsSpace(sListSql) == false) spubCheck="2";
		        
                switch (contType){
				    case 'combobox' :{  //combobox�ؼ�
				        retHeight = _getContHeight(sHei,25) ;
					    sid = "cbo"+fieldName;
					    sStr.append( '<SELECT onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					    sStr.append( 'style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() controltype="combobox" ');
					    sStr.append( 'check="'+spubCheck+'" dataset="'+dsName+'" tempvalue="'+sListValue+'" temptext="'+sListText+'" sql="'+sListSql+'"  china="'+chnName+'" field="'+fieldName+'">');
					    sStr.append( spubOption);
					    sStr.append('</SELECT>');
					    break;
				    }
				    case 'listbox':{   //lst�ؼ�
				        retHeight = _getContHeight(sHei,50) ;
					    sid = "lst"+fieldName;
					    sStr.append( '<SELECT onmove=move() oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+'; ');
					    sStr.append( 'WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() size=8 controltype="listbox"');
					    sStr.append( 'dataset="'+dsName+'" china="'+chnName+'" field="'+fieldName+'" check="'+spubCheck+'" tempvalue="'+sListValue+'" temptext="'+sListText+'" sql="'+sListSql+'">');
					    sStr.append( spubOption);
					    sStr.append( '</SELECT>');
					    break;
				    }
				    case 'dropdownlist':{ //fccode�ؼ�
				        retHeight = _getContHeight(sHei,20) ;
					    sid = "ddl"+fieldName ;
					    sStr.append( '<IMG id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() style="'+sPosition);
					    sStr.append( 'WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; ');
					    sStr.append( 'ButtonWidth: 10" onmovestart=moveStart() src="../images/ef_designer_fccode.gif" controltype="dropdownlist" ');
					    sStr.append( 'dataset="'+dsName+'" china="'+chnName+'" field="'+fieldName+'" check="'+spubCheck+'" tempvalue="'+sListValue+'" temptext="'+sListText+'" visible="��" blninput="��" blnempty="��" addrow="��" multiselect="��" sql1="'+sListSql+'" xml="'+spubOption+'" format="'+spubFormat+'" >');
					    break;
				    }
					    case 'radio':{  //radio�ؼ�
				        retHeight = _getContHeight(sHei,50) ;
					    sid = "rdo"+fieldName ;
					    sStr.append( '<FIELDSET id="'+sid+'" dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() contentEditable=false style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px; " onmovestart=moveStart() value="-1" controltype="radio" tempvalue="'+sListValue+'" temptext="'+sListText+'"NotBg="��" aspect="����"  legend="'+chnName+'" china="'+chnName+'"> <LEGEND>'+chnName+'</LEGEND>');
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
			    case '�Զ����':
			    case '��ʽ':
			    case '�ۼƻ���':
				case 'readonly':{  //ֻ���ؼ�
				    retHeight=20;
					sid = "txt"+fieldName ;
					sStr.append( '<INPUT type=text onmove=move() readOnly oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
					sStr.append( 'style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'; TEXT-ALIGN: left" onmovestart=moveStart() ');
					sStr.append( 'controltype="text" dataset="'+dsName+'" value="'+chnName+'" CanSelect="false" china="'+chnName+'" field="'+fieldName+'"></INPUT>');
					break ;
				}
				case 'facard':{ //��������
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

					sStr.append( '<BUTTON onmove=move() oncontrolselect=controlselect() id=cmd_'+fieldName+' onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition1+'BORDER-RIGHT: 0px; BORDER-TOP: 0px; BORDER-LEFT: 0px; WIDTH: 17px; BORDER-BOTTOM: 0px; BACKGROUND-REPEAT: no-repeat; HEIGHT: 18px; " onmovestart=moveStart() controltype="button" fc_onclick="bill_onclick(&quot;'+sfacard+'&quot;)" dropstyle="��"></BUTTON>');
					//CopyToPub(sStr)
					retWidth += 17 ;
					break;
				}
				
				case '������Ϣ��':
				case 'ID�ֶ�':{  //���ؿؼ�
					sStr.append( '');
					retWidth = 0;
					retHeight = 0;
					break;
				}
				case '��ѡ��':{  //checkbox�ؼ�
				    retHeight = _getContHeight(sHei,25) ;;
					sid = "chk"+fieldName ;
					sStr.append( '<DIV onmove=move() dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+'; WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'px;" onmovestart=moveStart() noWrap value="'+getDomNodeValue(oo,"defaultValue")+'" falsevalue="'+getDomNodeValue(oo,"falseValue")+'" truevalue="'+getDomNodeValue(oo,"trueValue")+'" controltype="checkbox"><INPUT oncontrolselect=controlselectcancel() type=checkbox><SPAN>'+chnName+'</SPAN></DIV>');
					break;
				}
				case 'ͼƬ�ֶ�':{
				    retWidth = 200;  
				    retHeight = _getContHeight(sHei,50) ;;
				    
					sid = "img"+fieldName ;
					sStr.append('<img controltype="dbimg" id="'+sid+'"  alt="�����˫���˿�ѡ��ͼ��" ondblclick=uploadImg() style="'+ sPosition + '" onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" >');
					break;
				}
                case '����ʱ��':
                case '����': 
                    {  //���ڿؼ�
                        retHeight = _getContHeight(sHei, 20);
                        retWidth = 80;
                        sid = "txt" + fieldName;
                        sStr.append('<INPUT type=text onmove=move() oncontrolselect=controlselect() id="' + sid + '" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() ');
                        sStr.append('style="' + sPosition + '; WIDTH: ' + retWidth + 'px; HEIGHT: ' + retHeight + 'px; TEXT-ALIGN: left" onmovestart=moveStart() ');
                        sStr.append('controltype="text" dataset="' + dsName + '" value="' + chnName + '" CanSelect="false" china="' + chnName + '" field="' + fieldName + '"></INPUT>');
                        var Selectdt = "SelectDate(txt" + fieldName;
                        if (sType == "����ʱ��") Selectdt += ",true"; //����ƴ��ʱ�䴮
                        Selectdt += ")";
                        var sQuot = "&quot;";
                        var Seldate = "bill_onclick(" + sQuot + Selectdt + sQuot + ")";
                        var sPosition1 = "";
                        if (sPosition != "inTD" && sPosition != "") {
                            sPosition1 = new Eapi.Css().changePosition(sPosition, "LEFT", retWidth);
                        }
                        sStr.append('<BUTTON onmove=move() oncontrolselect=controlselect() id=cmd_' + fieldName + ' class="cmdDown" onmouseover="this.className=\'cmdDown-over\'" onmouseout="this.className=\'cmdDown\'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="' + sPosition1 + 'BORDER-RIGHT: 0px; BORDER-TOP: 0px; BORDER-LEFT: 0px; WIDTH: 17px; BORDER-BOTTOM: 0px; BACKGROUND-REPEAT: no-repeat; HEIGHT: 20px; " onmovestart=moveStart() controltype="button" fc_onclick="' + Seldate + '" dropstyle="��"></BUTTON>');
                        retWidth += 17;
                        break;
                    }
				case '�ı�����':
				case '�ı���':{  //���ı�
				    retHeight = _getContHeight(sHei,50) ; ;
					sid = "txt"+fieldName ;
					sStr.append('<TEXTAREA onmove=move() dataset="'+dsName+'"  china="'+chnName+'" field="'+fieldName+'" oncontrolselect=controlselect() id="'+sid+'" onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="'+sPosition+'+WIDTH: '+retWidth+'; HEIGHT: '+retHeight+'"onmovestart=moveStart() cols=26 controltype="textarea" value=""></TEXTAREA>');
					break;
				}
				case "���ҹ�ϵ" :
                case "ѡ���б�" : 
                case "��ѡ�б�" :{
                
                
				    break;
				}
				default:{ //�ı���
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
* ������ʱ�Զ�����dsmain
*@date 2006-04-26
**/
function AutoAddDsMain() {
		//������ʱ�Զ�����dsmain
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
			var sHtml="<img controltype='dataset' id=DsMain opensortno=1 style='position:absolute;Left:400;Top:5;Height:47;Width:39;' src='../images/ef_designer_dataset.gif' onmovestart=moveStart() onmoveend=moveEnd() onresizestart=resizeStart() onresizeend=resizeEnd() formatxml=\"<root><tr><td>mainkey</td><td>mainkey</td><td>�ַ�</td><td>11</td><td>0</td><td>������</td><td></td><td></td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td></td><td></td><td>left</td><td>80</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>userid</td><td>�û�ID</td><td>�ַ�</td><td>100</td><td>0</td><td>����Ĭ��ֵ</td><td>" + s1 + "</td><td></td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td>��</td><td></td><td></td><td>left</td><td>80</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></root>\" AfterScroll=\"fcpubdata.keyValue=DsMain.Field('mainkey').Value\" BeforeOpen=\"DsMain.PageSize=1;\"   saveastable=\"" + tablename + "\" opensql=\"select * from " + tablename + " \" >";	
			

			fcpubdata.area.innerHTML += sHtml;
			AddContXml("dataset","DsMain");
			fcpubdata.area.keyfield="mainkey";
			fcpubdata.area.toolbar = "�������빤����";
			var newdjtype = parent.Request.QueryString("newdjtype").toString();			
			if(isSpace(newdjtype)==false)	
				fcpubdata.area.type = newdjtype;
			var newdjname = parent.Request.QueryString("newdjname").toString();			
			if(isSpace(newdjname)==false)	
				fcpubdata.area.caption = unescape(newdjname);
				
		}

}
/**
* �Զ����ϲ�ѯ��
*@date 2006-12-26
**/
function AutoAddQueryDj(){
	var allbak = fcpubdata.area.innerHTML;
	DsMain.id="PubQueryGridDs"
	PubQueryGridDs.opensortno="5";
	//����ѯ��sql����Ϊ�����ݼ��Ĵ�֮ǰ�¼��д���
	PubQueryGridDs.opensql = "";
	PubQueryGridDs.saveastable="";
	PubQueryGridDs.BeforeOpen="ActionQueryCond();";
	
	
	fcpubdata.area.innerHTML = '<DIV onmove=move() oncontrolselect=controlselect() id=divQueryFilter onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() onresize=resize() style="BORDER-RIGHT: black 1px solid; BORDER-TOP: black 1px solid; OVERFLOW-Y: scroll; LEFT: 1px; OVERFLOW-X: scroll; OVERFLOW: auto; BORDER-LEFT: black 1px solid; WIDTH: 97%; BORDER-BOTTOM: black 1px solid; POSITION: absolute; TOP: 11px; HEIGHT: 214px; BACKGROUND-COLOR: #ffffff" onmovestart=moveStart() controltype="div" NotBg="��">' + allbak + '</DIV><IMG id=PubQueryGrid onresizeend=resizeEnd() onresizestart=resizeStart() onmoveend=moveEnd() style="LEFT: 1px; WIDTH: 979px; POSITION: absolute; TOP: 229px; HEIGHT: 289px" onmovestart=moveStart() src="http://localhost/WebBill/fceform/images/ef_designer_webgrid.gif" controltype="grid" dataset="PubQueryGridDs" canselect="��" autoheight="��" autowidth="��" autoappend="��" readonly="��" visible="��" titlerowheight usertitle="��" iscrosstab="��" rcount="��" rsum="��" rmin="��" rmax="��" ravg="��" ccount="��" csum="��" cmin="��" cmax="��" cavg="��" titlerows usertitlehtml crosstabtitle crosstabdatatype crosstabsumtype crosstabformat rowtitle coltitle crosstabsql>' + PubQueryGridDs.outerHTML ;

	//�������еİ�ť
	var o=window.document.all.tags("button");
	var l=o.length;
	for(var ii=0;ii<l;ii++){
		o[ii].style.display="none";
	}
	
	fcpubdata.area.dj_sn = fcpubdata.area.dj_sn+"_auto_query";
	fcpubdata.area.toolbar="��ѯ������" ;
	curdjid=0;   //��ʾ�½�һ����ģ��,�����Ǹ��ǵ�ǰ��ģ��
	DesignDjSave("����ʾ");
}
/**
* �򿪱�������ı����Դ���
*@date 2007-01-22
**/
function e_open_ebiao_form(){
	var obj = parent.dialogArguments[0]; //e����table����.
	var s1 = obj.eform_winprop;
	if(typeof s1 == "undefined") s1="";
	var sRet=DjOpen('eb_parawin',s1,'չ��',"��ģʽ����","ֱ��","���ô����������");
	if(IsSpace(sRet) == false){
		obj.eform_winprop = sRet;
	}

}
/**
* ��һ������򿪵��ļ�
*@date 2007-05-22
**/
function ef_AddRecentFile(sFile){
	var s = fcpubdata.recentFile;
	if(typeof s == "undefined") return;
	if(s.length>0){
		var pos = s.indexOf(";") ; //��;�ָ��ı���
		if(pos < 0){
			s = s + ";"+sFile;			
		}else{
			var s1 = s.substring(pos+1,s.length);
			if(sFile != s1){ //���������ļ�һ��
				s = s1 + ";" +sFile;
			}
		}
	}else{
		s = sFile;
	}
	fcpubdata.recentFile = s ;
	
}
/**
* �� fcpubdata.recentFile ˢ�½���
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
        alert("�����������ݼ�������!");
        return;
    }
    DjOpen('importConfig', [window, arr], 'չ��', '��ģʽ����', 'ֱ��', '������Ϣ����');
}