//<!--
var btnList = { //���а�ť���б�
    eb_newempty: ["�½��հױ���", "../images/ef_design_newempty.gif", false, 'NewReport()'],
    eb_newwizard: ["�����½�����", "../images/ef_design_new.gif", false, 'OpenWizard()'],
    eb_open: ["�򿪱���", "../images/ef_design_open.gif", false, 'LoadReport()'],
    eb_save: ["���汨��", "../images/ef_design_save.gif", false, 'SaveReport()'],
    eb_saveas: ["��汨��", "../images/ef_design_saveas.gif", false, 'SaveAsReport()'],
    eb_run: ["���б���", "../images/ef_design_directrun.gif", false, 'PreviewReport()'],
    eb_cut: ["����", "../images/ef_design_cut.gif", false, 'cmdBlockCut()'],
    eb_copy: ["�鸴��", "../images/ef_design_copy.gif", false, 'cmdBlockCopy()'],
    eb_paste: ["��ճ��", "../images/ef_design_paste.gif", false, 'cmdBlockPaste()'],
    eb_formatcopy: ["��ʽˢ", "../images/eb_formatbrush.gif", false, 'cmdFormatBrush()'],
    eb_undo: ["����", "../images/ef_design_undo.gif", false, 'cmdUndo()'],
    eb_redo: ["����", "../images/ef_design_redo.gif", false, 'cmdRedo()'],

    eb_insertrow: ["������", "../images/eb_tab_cell_insert_before.gif", false, 'InsRow()'],
    eb_addrow: ["������", "../images/eb_tab_cell_insert_after.gif", false, 'InsRow(true)'],
    eb_delrow: ["ɾ����", "../images/eb_tab_row_delete.gif", false, 'DelRow()'],
    eb_insertcol: ["������", "../images/eb_tab_col_insert_before.gif", false, 'InsCol()'],
    eb_addcol: ["������", "../images/eb_tab_col_insert_after.gif", false, 'InsCol(true)'],
    eb_delcol: ["ɾ����", "../images/eb_tab_col_delete.gif", false, 'DelCol()'],
    eb_fx: ["���õ�Ԫ��Ĺ�ʽ", "../images/eb_fx.gif", false, 'cmdFormula()'],
    eb_prop: ["���ñ�������", "../images/ef_tab_table_prop.gif", false, 'setReportProp()'],
    eb_newlayout: ["�½��հ׵Ĳ���ģ��", "../images/ef_design_newempty.gif", false, 'parent.newLayout()'], //fhj2012-05-12���ģ�幤������ť
    eb_layoutprop: ["���ò���ģ������", "../images/ef_tab_table_prop.gif", false, 'parent.setLayoutProperty()'],
    eb_selecttable: ["ѡ���", "../images/ef_tab_table_prop.gif", false, 'parent.selectLayoutTable()'], //fhj
    eb_layoutsave: ["���沼��ģ��", "../images/ef_tab_table_prop.gif", false, 'parent.saveLayoutModule()'], //fhj
    eb_layoutsaveas: ["��沼��ģ��", "../images/ef_design_saveas.gif", false, 'parent.layoutDesignSaveAs()'], //fhj
    eb_fieldcheck: ["��鵥Ԫ�������õ��ֶ���Ϣ", "../images/ef_tab_table_prop.gif", false, 'parent.checkBadField()'], //fhj
    eb_addproperty: ["���õ�Ԫ���ϵĿؼ�", "../images/ef_tab_table_prop.gif", false, 'parent.addProperty()'], //fhj
    eb_delproperty: ["�����Ԫ���ϵĿؼ�����ʾ", "../images/ef_tab_table_prop.gif", false, 'parent.delAll()'], //fhj
    eb_openlayout: ["���ݿ��д򿪲���ģ��", "../images/ef_design_open.gif", false, 'parent.loadLayoutDbSel() '],
    eb_openlayoutf: ["�ļ��д򿪲���ģ��", "../images/ef_design_open.gif", false, 'parent.loadLayoutFileSel()'],
    eb_newlayoutwizard: ["���������µĲ���ģ��", "../images/ef_design_open.gif", false, 'parent.quickLayoutModle()'],
    eb_layoutrun: ["���б���", "../images/ef_design_directrun.gif", false, 'parent.runMoudleReport()'],

    eb_rowprop: ["����������", "../images/ef_tab_row_prop.gif", false, 'setRowProp()'],
    eb_colprop: ["����������", "../images/ef_tab_col_prop.gif", false, 'setColProp()'],
    eb_cellprop: ["���õ�Ԫ������", "../images/ef_tab_cell_prop.gif", false, 'OpenSetWin("eb_cell","cellstyle","���õ�Ԫ������");'],

    eb_dsn: ["��������Դ", "../images/eb_dsn.gif", false, 'OpenSetWin("eb_dsn","","��������Դ")'],
    eb_dataset: ["���ݼ�����", "../images/ef_design_dataset.gif", false, 'OpenSetWin("eb_dataset","","���ݼ�����")'],
    eb_param: ["���ñ������", "../images/eb_para.gif", false, 'OpenSetWin("eb_para","","���ñ������")'],
    eb_designform: ["���뱨������������ƽ���", "../images/eb_designform.gif", false, 'EbiaoFormDesign()'],
    eb_macro: ["���ú�", "../images/eb_macro.gif", false, 'OpenSetWin("eb_macro","","���ú�")'],
    eb_subreport: ["�����ӱ�������", "../images/eb_subreport.gif", false, 'OpenSetWin("eb_subrptset","","�����ӱ�������")'],
    eb_chart: ["ͳ��ͼ", "../images/ef_design_chart.gif", false, 'OpenChartWin()'],
    eb_flash: ["FLASHͳ��ͼ", "../images/ef_design_chart_flash.gif", false, 'OpenFlashWin()'],
    eb_barcode: ["���������Դ���", "../images/eb_barcode.gif", false, 'OpenBarCodeWin()'],
    eb_importexcel: ["����excel�ļ�", "../images/ef_design_excel.gif", false, 'OpenSetWin("eb_importexcel","","����excel�ļ�")'],
    eb_option: ["ѡ��", "../images/eb_option.gif", false, 'OpenSetWin("eb_option","option","ѡ��")'],
    eb_runcommand: ["ֱ�������û����������", "../images/ef_design_command.gif", false, 'RunCommand()'],
    eb_showinfo: ["��ʾ������Ϣ", "../images/ef_design_help.gif", false, 'OpenWinShowInfo()'],

    eb_b: ["����", "../images/eb_b.gif", false, 'cmdFont("B")'],
    eb_i: ["б��", "../images/eb_i.gif", false, 'cmdFont("I")'],
    eb_u: ["�»���", "../images/eb_u.gif", false, 'cmdFont("U")'],
    eb_alignleft: ["�����", "../images/eb_alignleft.gif", false, 'cmdAlign("left","h")'],
    eb_aligncenter: ["ˮƽ����", "../images/eb_aligncenter.gif", false, 'cmdAlign("center","h")'],
    eb_alignright: ["�Ҷ���", "../images/eb_alignright.gif", false, 'cmdAlign("right","h")'],
    eb_aligntop: ["�϶���", "../images/eb_aligntop.gif", false, 'cmdAlign("top","v")'],
    eb_alignmiddle: ["��ֱ����", "../images/eb_alignmiddle.gif", false, 'cmdAlign("middle","v")'],
    eb_alignbottom: ["�¶���", "../images/eb_alignbottom.gif", false, 'cmdAlign("bottom","v")'],
    eb_merge: ["�ϲ���Ԫ��", "../images/eb_tab_cell_merge.gif", false, 'Merge()'],
    eb_split: ["��ֵ�Ԫ��", "../images/eb_tab_cell_split.gif", false, 'Split()']

};

/**
*�������б�
**/

function AddToolbarButton() {
    var arr = window.dialogArguments;
    if (IsSpace(arr) == false) {
        var oTable = arr[7];
    }
    if (IsSpace(oTable) == false) { //��eform�е���
        fcpub.designToolbar = "eb_newempty,eb_newwizard,eb_open,eb_run,|,eb_cut,eb_copy,eb_paste,eb_formatcopy,eb_undo,eb_redo,|,eb_insertrow,eb_addrow,eb_delrow,eb_insertcol,eb_addcol,eb_delcol,|,eb_fx,eb_prop,eb_rowprop,eb_colprop,eb_cellprop,|,eb_dataset,|,eb_param,eb_designform,eb_macro,eb_subreport,eb_chart,eb_barcode,|,eb_importexcel,eb_option,eb_showinfo,eb_runcommand,br,eb_font,eb_b,eb_i,eb_u,eb_alignleft,eb_aligncenter,eb_alignright,eb_aligntop,eb_alignmiddle,eb_alignbottom,eb_bgcolor,eb_fgcolor,eb_merge,eb_split,eb_line,eb_editfx";
    }

    var layoutModule = Request.QueryString("layoutModule").toString(); ; //�����Ʋ���ģ���e��������
    if (layoutModule == "yes") { //�Ӳ���ģ���е���
        fcpub.designToolbar = "eb_newlayout,eb_newlayoutwizard,eb_openlayout,eb_openlayoutf,eb_layoutprop,|,eb_selecttable,eb_fieldcheck,eb_addproperty,eb_delproperty,eb_layoutsave,eb_layoutsaveas,|,eb_open,eb_layoutrun,eb_save,|,eb_cut,eb_copy,eb_paste,eb_formatcopy,eb_undo,eb_redo,|,eb_insertrow,eb_addrow,eb_delrow,eb_insertcol,eb_addcol,eb_delcol,|,eb_fx,eb_prop,eb_rowprop,eb_colprop,eb_cellprop,eb_dataset,|,eb_param,eb_macro,eb_importexcel,eb_option,eb_showinfo,br,eb_font,eb_b,eb_i,eb_u,eb_alignleft,eb_aligncenter,eb_alignright,eb_aligntop,eb_alignmiddle,eb_alignbottom,eb_bgcolor,eb_fgcolor,eb_merge,eb_split,eb_line,eb_subreport,eb_chart,eb_flash,eb_barcode,eb_editfx";
    }

    if (IsSpace(top.zkpub) == false) {
        if (IsSpace(top.zkpub.skin) == false) {
            fcpubdata.skins = top.zkpub.skin;
        }
    }

    var sSkins = Request.QueryString("skins").toString();
    if (IsSpace(sSkins) == false) {
        fcpubdata.skins = sSkins;
        new Eapi.Css().setSkinsPath(fcpubdata.skins);
    }
    var arr = fcpub.designToolbar.split(",");
    var str = new Sys.StringBuilder(); //�������Ĵ�
    //Ҫ���õ�css
    var hrefstyle = "<link rel='stylesheet' type='text/css' href='../.." + fcpubdata.skinsPath + "/css/skins/";
    var docstyle = "/style/Editor.css'>";
    str.append(hrefstyle + fcpubdata.skins + docstyle);
    /*
    //str.append("<table id='tbr0' class='Toolbar' cellSpacing='0' cellPadding='0' border='0' style='POSITION:absolute;TOP:0px; LEFT: 2px; HEIGHT: 22px;' ><tr>");
    str.append("<table id='Toolbar' class='Toolbar' cellSpacing='1' cellPadding='0' border='0' style='table-layout:fixed;LEFT:2px;POSITION:absolute;TOP:0px;'  ondrag='tb_ondrag()'><tr>");

	str.append("<td width='5px' height='22px'><span class='leftstart' ></span></td>");
    var positionLeft = 5 + 2 + 1;
    var bEditFx = false;
    for(var j=0; j<arr.length; j++){
	    
    var btn = btnList[arr[j]];
    //�зָ�����
    if (arr[j] == "|") {
    //		    str.append("<td width='3px'><img src='../images/ef_design_menuline.gif'></td>");
    str.append("<td width='5px' height='22px'><span class='menuline'></span></td>");
    positionLeft += 5 + 1;
    } else if (arr[j] == "br") { //�Ƿ���
    //str.append("<td width='10px' height='22px'></td></tr></table><table id='tbr1' class='Toolbar' cellSpacing='0' cellPadding='0' border='0' style='LEFT:2px;POSITION:absolute;TOP:27px; HEIGHT: 22px;'  ><tr align='center' valign='top'>");
    str.append("</tr></table><span class='rightend' style='position:absolute;top:0px;width:8px;left:" + positionLeft + "'></span><table id='Toolbar1' class='Toolbar' cellSpacing='1' cellPadding='0' border='0' style='table-layout:fixed;LEFT:2px;POSITION:absolute;TOP:27px;margin-top:1px;'  ondrag='tb_ondrag()'><tr align='center' valign='top'>");

		str.append("<td width='5px' height='22px'><span class='leftstart' ></span></td>");
    positionLeft = 5 + 2 + 1;
    } else if (arr[j] == "eb_editfx") { //�Ƿ��б��ʽ��
    bEditFx = true;
    } else if (arr[j] == "eb_font" || arr[j] == "eb_bgcolor" || arr[j] == "eb_fgcolor" || arr[j] == "eb_line") {
    var oo = _tagHtm(arr[j], positionLeft);
    positionLeft = oo.positionLeft;
    str.append(oo.str);
    } else { //�������İ�ť
    var strId = _idHtm(arr[j]);
    //		        str.append("<td width='22px' height='22px' onmouseover='tbr1_onmouseover()' onmouseout='tbr1_onmouseout()' onmousedown='tbr1_onmousedown()' onmouseup='tbr1_onmouseup()' ><img class='tbnormal' " + strId + " title='" + btn[0] + "' onclick='" + btn[3] + "'  src='" + btn[1] + "' width='20px' height='20px'></td>");
    str.append("<td width='22px' height='22px' class='tbnormal' ><span onmouseover='tbr1_onmouseover()' onmouseout='tbr1_onmouseout()' onmousedown='tbr1_onmousedown()' onmouseup='tbr1_onmouseup()' width='20px' height='20px' class='" + arr[j] + "' "+strId+" title='" + btn[0] + "' onclick='" + btn[3] + "'></span></td>");
    positionLeft += 22 + 1;
            
    }		
		
	}
    str.append("<td width='10px' height='22px'></td></tr></table><span class='rightend' style='position:absolute;top:27px;width:8px;left:" + positionLeft + "'></span>");
    */

    str.append("<table id='tbr0' class='Toolbar' cellSpacing='0' cellPadding='0' border='0' style='POSITION:absolute;TOP:0px; LEFT: 2px; HEIGHT: 22px;' ><tr>");
    str.append("<td width='5px' height='22px'><span class='leftstart' src='../images/ef_touming_20_20.gif'></span></td>");
    var positionLeft = 5;
    var bEditFx = false;
    for (var j = 0; j < arr.length; j++) {

        var btn = btnList[arr[j]];
        //�зָ�����
        if (arr[j] == "|") {
            str.append("<td><img width='3px' height='20px' class='menuline' src='../images/ef_touming_20_20.gif'></td>");
            positionLeft += 3;
        } else if (arr[j] == "br") { //�Ƿ���
            str.append("</tr></table><span class='rightend' style='position:absolute;top:0px;width:8px;left:" + positionLeft + "'></span><table id='Toolbar1' class='Toolbar' cellSpacing='0' cellPadding='0' border='0' style='LEFT:2px;POSITION:absolute;TOP:27px' ><tr>");

            str.append("<td><img width='5px' height='20px' class='leftstart' src='../images/ef_touming_20_20.gif'></td>");
            positionLeft = 5;
        } else if (arr[j] == "eb_editfx") { //�Ƿ��б��ʽ��
            bEditFx = true;
        } else if (arr[j] == "eb_font" || arr[j] == "eb_bgcolor" || arr[j] == "eb_fgcolor" || arr[j] == "eb_line") {
            var oo = _tagHtm(arr[j], positionLeft);
            positionLeft = oo.positionLeft;
            str.append(oo.str);
        } else { //�������İ�ť
            var strId = _idHtm(arr[j]);
            var sClassName = arr[j];
            str.append("<td width='22px' height='22px' onmouseover='tbr1_onmouseover()' onmouseout='tbr1_onmouseout()' onmousedown='tbr1_onmousedown()' onmouseup='tbr1_onmouseup()' ><img class='tbnormal " + sClassName + "' classbak='" + sClassName + "' " + strId + " title='" + btn[0] + "' onclick='" + btn[3] + "' src='../../fceform/images/ef_touming_20_20.gif' width='20px' height='20px'></td>");

            positionLeft += 22;

        }

    }
    str.append("</tr></table><span class='rightend' style='position:absolute;top:27px;width:8px;left:" + positionLeft + "'></span>");


    if (bEditFx) {
        str.append('<TABLE id="tbr2"  border="0" cellPadding="0" cellSpacing="0" style="LEFT:2px;POSITION:absolute;TOP:52px;TABLE-LAYOUT: fixed; WIDTH: 100%; BORDER-BOTTOM: gray 2px solid; HEIGHT: 22px;"><TR align="center"><td width="1"></td><TD id=tdFx width="50" valign="bottom"></TD><TD width="20" valign="bottom">=</TD><TD><input type=text id=txtFx value="" style="width:100%" onkeyup=txtFx_onkeyup() ><select id="cboZoom" onchange="cboZoom_onchange()" style="display:none;"><option>200%</option><option>150%</option><option>125%</option><option selected >100%</option><option>75%</option><option>50%</option><option>25%</option></select></TD></TR></TABLE>');
    }
    //div1.outerHTML = str; 
    //CopyToPub(str.toString());
    document.write(str.toString());
    function _idHtm(sTag) {
        var sRet = "";
        switch (sTag) {
            case "eb_b": sRet = ' id="cmdFontBold" '; break;
            case "eb_i": sRet = ' id="cmdFontItalic" '; break;
            case "eb_u": sRet = ' id="cmdFontU" '; break;
            case "eb_alignleft": sRet = ' id="cmdLeft" '; break;
            case "eb_alignright": sRet = ' id="cmdRight" '; break;
            case "eb_aligncenter": sRet = ' id="cmdCenter" '; break;
            case "eb_aligntop": sRet = ' id="cmdTopv" '; break;
            case "eb_alignmiddle": sRet = ' id="cmdMiddle" '; break;
            case "eb_alignbottom": sRet = ' id="cmdBottomv" '; break;
            case "eb_formatcopy": sRet = ' id="cmdBrush" '; break;
        }
        return sRet;
    }
    function _tagHtm(sTag, positionLeft) {
        var sRet = "";
        var imgsrc = '../..' + fcpubdata.skinsPath + '/css/skins/' + fcpubdata.skins + '/images/ef_run_downarrow.gif';
        if (sTag == "eb_font") {
            sRet = '<td width="150" height="22px" valign="middle"><SELECT id="cboFont" onchange=cmdFont("F") style="WIDTH: 150px;HEIGHT: 112px" title="����"><OPTION></OPTION><OPTION>����</OPTION><OPTION>������</OPTION><OPTION>����</OPTION><OPTION>����</OPTION><OPTION>����</OPTION><OPTION>����</OPTION><OPTION>��Բ</OPTION><OPTION>��������</OPTION><OPTION>����Ҧ��</OPTION><OPTION>���Ĳ���</OPTION><OPTION>����ϸ��</OPTION><OPTION>������κ</OPTION><OPTION>�����п�</OPTION><OPTION>��������</OPTION><OPTION>@��������</OPTION><OPTION>@����Ҧ��</OPTION><OPTION>@����</OPTION><OPTION>@����</OPTION><OPTION>@���Ĳ���</OPTION><OPTION>@����ϸ��</OPTION><OPTION>@������κ</OPTION><OPTION>@�����п�</OPTION><OPTION>@��������</OPTION><OPTION>@����</OPTION><OPTION>@����</OPTION><OPTION>@����</OPTION><OPTION>@������</OPTION><OPTION>@����</OPTION><OPTION>Arial</OPTION><OPTION>Arial Black</OPTION><OPTION>Arial Narrow</OPTION><OPTION>Basemic</OPTION><OPTION>Basemic Symbol</OPTION><OPTION>Basemic Times</OPTION><OPTION>Book Antiaua</OPTION><OPTION>Bookman Old Style</OPTION><OPTION>Cemtury Bothic</OPTION><OPTION>Comic sams MS</OPTION><OPTION>Copperplate</OPTION><OPTION>Gothic</OPTION><OPTION>Copperplate</OPTION><OPTION>Gothic</OPTION><OPTION>Courier</OPTION><OPTION>Courier New</OPTION><OPTION>FixedSyS</OPTION><OPTION>Garamond</OPTION><OPTION>Ceorgia</OPTION><OPTION>HarettemSchweiler</OPTION><OPTION>Impact</OPTION><OPTION>Kingsoft Phonetic</OPTION><OPTION>Lucida console</OPTION><OPTION>Lucida Sans</OPTION><OPTION>Unicod</OPTION><OPTION>Marlett</OPTION><OPTION>Microsoft sans</OPTION><OPTION>ser</OPTION><OPTION>MingLiU</OPTION><OPTION>Modern</OPTION><OPTION>Monotype corsive</OPTION><OPTION>MS Sans serif</OPTION><OPTION>Ms Serif</OPTION><OPTION>palatino Linotype</OPTION><OPTION>PMingLiU</OPTION><OPTION>Roman</OPTION><OPTION>Script</OPTION><OPTION>Small Fonts</OPTION><OPTION>Symbol</OPTION><OPTION>System</OPTION><OPTION>Tahoma</OPTION><OPTION>Terminal</OPTION><OPTION>Times New Roman</OPTION><OPTION>Trebucher MS</OPTION><OPTION>Verdana</OPTION><OPTION>Webdings</OPTION><OPTION>Wingdings</OPTION><OPTION>Wingdings 2</OPTION><OPTION>Wingdings 3</OPTION><OPTION>@Fixedsys</OPTION><OPTION>@MingLiU</OPTION><OPTION>@PMingLiU</OPTION><OPTION>@System</OPTION><OPTION>@Terminal</OPTION></SELECT></td><td width="50" valign="middle"><SELECT id="cboFontSize" onchange=cmdFont("S") style="WIDTH: 50px;HEIGHT: 22px" title="�ֺ�"><OPTION>4</OPTION><OPTION>6</OPTION><OPTION>8</OPTION><OPTION>9</OPTION><OPTION>10</OPTION><OPTION>11</OPTION><OPTION>12</OPTION><OPTION selected>13</OPTION><OPTION>14</OPTION><OPTION>15</OPTION><OPTION>16</OPTION><OPTION>17</OPTION><OPTION>18</OPTION><OPTION>20</OPTION><OPTION>22</OPTION><OPTION>24</OPTION><OPTION>26</OPTION><OPTION>28</OPTION><OPTION>36</OPTION><OPTION>48</OPTION><OPTION>72</OPTION></SELECT></td>';
            positionLeft += 150 + 50;
        } else if (sTag == "eb_bgcolor") {
            sRet = '<td width="6" height="22px"></td><td width="36px" height="22px" ><img style="position:absolute;left:' + (positionLeft + 6) + 'px;top:2px;" id="imgSetBgColor" onclick="SetColor(tdBgColor.style.backgroundColor)" src="../images/eb_bgcolor.gif"><span id=tdBgColor style="position:absolute;left:' + (positionLeft + 6) + 'px;top:15px;width:17px;height:5px;background-color:white;font-size:5px;"></span><img style="position:absolute;left:' + (positionLeft + 6 + 18) + 'px;top:2px;width:16px;height:18px" onclick="SelColor(tdBgColor);SetColor(tdBgColor.style.backgroundColor);" src="' + imgsrc + '"></td>';
            positionLeft += 6 + 36;
        } else if (sTag == "eb_fgcolor") {
            sRet = '<td width="6" height="22px"></td><td width="36px" height="22px" ><img style="position:absolute;left:' + (positionLeft + 6) + 'px;top:2px;" id="imgSetFgColor" onclick="SetColor(tdFgColor.style.backgroundColor,1)" src="../images/eb_fgcolor.gif"><span id=tdFgColor style="position:absolute;left:' + (positionLeft + 6) + 'px;top:15px;width:17px;height:5px;background-color:black;font-size:5px;"></span><img style="position:absolute;left:' + (positionLeft + 6 + 18) + 'px;top:2px;width:16px;height:18px" onclick="SelColor(tdFgColor);SetColor(tdFgColor.style.backgroundColor,1);" src="' + imgsrc + '"></td><td width="6" height="22px"></td>';
            positionLeft += 6 + 36 + 6;
        } else if (sTag == "eb_line") {
            sRet = '<td width="12" height="22px"></td><td width="40" height="22px" valign="middle"><hr id=hrStyle style="border:1px solid black;" size="1"></td><td width="20" onmouseover="tbr1_onmouseover()" onmouseout="tbr1_onmouseout()" onmousedown="tbr1_onmousedown()" onmouseup="tbr1_onmouseup()" valign="middle"><img onclick="MenuLine_onclick()" id="cmdMenuLine" src="' + imgsrc + '"></td><td width="6" height="22px"></td><td width="40" valign="middle"><hr id=tdLineColor size=8 style="border:8px solid black;"></td><td valign="middle" width="20" onmouseover="tbr1_onmouseover()" onmouseout="tbr1_onmouseout()" onmousedown="tbr1_onmousedown()" onmouseup="tbr1_onmouseup()"><img onclick="SelColor(tdLineColor,1)" src="' + imgsrc + '"></td><td width="6" height="22px"></td><td width="20"  valign="middle"><img onclick="imgLineStyle_onclick()" id="imgLineStyle" indexImg="1" src="../images/eb_line1.gif"></td><td valign="middle" width="20" onmouseover="tbr1_onmouseover()" onmouseout="tbr1_onmouseout()" onmousedown="tbr1_onmousedown()" onmouseup="tbr1_onmouseup()"><img onclick="MenuLineStyle_onclick()" id="cmdMenuLineStyle" src="' + imgsrc + '"></td>';
            positionLeft += 12 + 40 + 20 + 6 + 40 + 20 + 6 + 20 + 20;
        }
        return { str: sRet, positionLeft: positionLeft };
    }
}
AddToolbarButton();
ReadConfig(); //��econfig.xml�е�������Ϣ  onmouseover="tbr1_onmouseover()" onmouseout="tbr1_onmouseout()" onmousedown="tbr1_onmousedown()" onmouseup="tbr1_onmouseup()"
var isFromDb = Request.QueryString("fromdb").toString();
if (!IsSpace(isFromDb)) {
    fcpub.fromdb = isFromDb;
}

//tblclassup����̬,divmenutrue����ʱ,tblclassdown����ʱ,
function SetToolBarClass(sTag) {
    var curTD = event.srcElement;
    if (curTD.tagName == "IMG") {
        var s1 = curTD.getAttribute("fcDown");
        //curTD = curTD.parentNode;

        switch (sTag) {
            /*			    case "onmousedown":
            if (s1 == "1")
            curTD.className = "tbin " + curTD.classbak;
            else
            curTD.className = "tbdownin " + curTD.classbak;
            break; */ 
            case "onmouseup":
                if (s1 == "1")
                    curTD.className = "tbin " + curTD.classbak;
                else
                    curTD.className = "tbdownin " + curTD.classbak;
                break;
            case "onmouseout":
                if (s1 == "1")
                    curTD.className = "tbdownout " + curTD.classbak;
                else
                    curTD.className = "tbnormal " + curTD.classbak;
                break;
            case "onmouseover":
                if (s1 == "1")
                    curTD.className = "tbdownin " + curTD.classbak;
                else
                    curTD.className = "tbin " + curTD.classbak;
                break;
        }
        event.returnValue = false;
        event.cancelBubble = true;

        //}

    }
}
function tbr1_onmousedown() {
    SetToolBarClass("onmousedown")
}
function tbr1_onmouseup() {
    SetToolBarClass("onmouseup")
}
function tbr1_onmouseout() {
    SetToolBarClass("onmouseout")
}
function tbr1_onmouseover() {
    SetToolBarClass("onmouseover")
}

//����
function imgLineStyle_onclick() {

    DrawLine(imgLineStyle.indexImg, hrStyle.style.borderWidth, hrStyle.style.borderStyle, tdLineColor.style.borderColor)
}

function window_onbeforeunload() {
    //�ȼ���Ƿ�Ҫ���浱ǰ����
    CheckReportChange();
    SaveRepData("recentFile", fcpub.recentFile);
}
/**
//ֱ���������������,���������ñ�񱳾��ȹ���
**/
function RunCommand() {
    var s1 = LoadRepData("historycommand")
    if (isSpace(s1)) s1 = ""
    var sRet = window.showModalDialog("../design/dsncommand.htm", s1, "center:yes;status:no;scroll:no;dialogHeight:340px;dialogWidth:695px;")
    if (isSpace(sRet) == false) {
        //parent.topic.execScript("eval("+sRet+")")
        SaveRepData("historycommand", sRet)
        eval(sRet)

    }

}
/**
*�����ݴ浽���ݻ�����
*@param Main Ϊ��key, ��"List".
*@param Sub Ϊ��key,��"CustomerFlag"
*@param userData ָ��userData��λ��
*@param strContent ΪҪ���������
*@return �޷���
*/
function SaveRepData(Sub, strContent, userData) {
    var Main = "pubdata";
    if (typeof userData == "undefined")
        userData = oForm.oInput;
    userData.setAttribute(Main + userData.value, strContent);
    try {
        userData.save(Sub + userData.value);
    } catch (e) { }
}
/**
*�����ݻ�����װ�뵽������
*@param Main Ϊ��key, ��"List".
*@param Sub Ϊ��key,��"CustomerFlag"
*@param userData ָ��userData��λ��
*@return ����ȡ��������
*/
function LoadRepData(Sub, userData) {
    var Main = "pubdata";
    if (typeof userData == "undefined")
        userData = oForm.oInput;
    try {
        userData.load(Sub + userData.value);
    } catch (e) { }
    var sTmp = userData.getAttribute(Main + userData.value);
    if (sTmp == null) { sTmp = ""; }
    return sTmp;

}



//-->bgcolor="#d4d0c8"





var sChk = 1;
function design_click() {
    if (sChk != 1) {
        design_check()
        sChk = 1
    }
}
function html_click() {
    if (sChk != 2) {
        html_check()
        sChk = 2
    }
}
function design_check() {
    visibleBlue();
    //imgDesign.src="../images/ef_design_designmode.gif" ;
    //imgHtml.src="../images/ef_design_htmlmode1.gif" ;
    imgDesign.className = "ef_design_designmode";
    imgHtml.className = "ef_design_htmlmode1";
    divMain.style.display = "";
    divTopLeft.style.display = "";
    divTopHead.style.display = "";
    divLeftHead.style.display = "";
    txtEdit.style.display = "";
    txtFx.style.display = "";


    srcHtml.style.display = "none";
    $id("t").outerHTML = srcHtml.value;

    $id("t").onmousedown = t_onmousedown;
    $id("t").onmousemove = t_onmousemove;
    $id("t").onmouseup = t_onmouseup;
    //ͬ��
    setRowHeightOffset();
    setTopHeadTabStr();
    setLeftHeadTabStr();
    AdjustTDs();
}
function html_check() {
    hiddenBlue();
    //imgDesign.src="../images/ef_design_designmode1.gif"
    //imgHtml.src="../images/ef_design_htmlmode.gif"
    imgDesign.className = "ef_design_designmode1";
    imgHtml.className = "ef_design_htmlmode";
    divMain.style.display = "none";
    divTopLeft.style.display = "none";
    divTopHead.style.display = "none";
    divLeftHead.style.display = "none";
    txtEdit.style.display = "none";
    txtFx.style.display = "none";


    srcHtml.style.display = "";
    srcHtml.value = $id("t").outerHTML;
}
/**
* ����ƴ��ڵ��Ҽ��˵��ĵ���
*@date 2005-08-11
**/
function MenuLine_onclick() {
    if (MenuLine.showed != "��") {
        var x = getAbsLeft(cmdMenuLine) - 40;
        var y = getAbsTop(cmdMenuLine) + cmdMenuLine.offsetHeight + 2;
        MenuLine.showMenu(window, MenuLine.dataSource.documentElement.selectSingleNode('//MenuItem'), window.document.body, x, y);
    } else {
        MenuLine.hideMenu();
    }


}
function MenuLineStyle_onclick() {
    if (MenuLineStyle.showed != "��") {
        var x = getAbsLeft(cmdMenuLineStyle) - 20;
        var y = getAbsTop(cmdMenuLineStyle) + cmdMenuLineStyle.offsetHeight + 2;
        MenuLineStyle.showMenu(window, MenuLineStyle.dataSource.documentElement.selectSingleNode('//MenuItem'), window.document.body, x, y);
    } else {
        MenuLineStyle.hideMenu();
    }


}
function setLineStyle(index) {
    var sHtml = "<hr id=hrStyle ";
    switch (index) {
        case 1: sHtml += "style='border:1px dotted black;' >"; break;
        case 2: sHtml += "style='border:1px dashed black;' >"; break;
        case 3: sHtml += "style='border:1px solid black;' size='1' >"; break;
        case 4: sHtml += "style='border:3px double black;' size='3' >"; break;
        case 5: sHtml += "style='border:2px solid black;' size='2' >"; break;
        case 6: sHtml += "style='border:3px solid black;' size='3' >"; break;
        case 7: sHtml += "style='border:4px solid black;' size='4' >"; break;
        case 8: sHtml += "style='border:5px solid black;' size='5' >"; break;
    }
    hrStyle.outerHTML = sHtml;
}
function setLineType(index) {
    imgLineStyle.src = "../images/eb_line" + index + ".gif";
    imgLineStyle.indexImg = index;
    imgLineStyle_onclick();
}
