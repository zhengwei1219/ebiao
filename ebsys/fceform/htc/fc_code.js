///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

function dropdownlist(obj)
{
    this.id = obj;
    //my �¼ӵ�
    this.isAutoDropWin = false; //="��"ʱ����ʱ�Զ�������������
    
    this.datasourceName = ""; //����Դ����
    this.isShowTree = 0; //�Ƿ���ʾ��,=1/0 =1��ʾ��ʾ��
    this.isTreeNewSql = 0; //�Ƿ����¸�ʽ��SQL, =1/0
    //-------------------
    //this.ConnectString=""; //�����ⲿ����Դʱ�����Ӵ�
    this.left = $id(this.id).getAttribute("left");  //�ؼ���Left����
    this.top = $id(this.id).getAttribute("top");      //�ؼ���top����
    this.height = $id(this.id).getAttribute("height");  //�ؼ��ĸ߶�����
    //if (this.height == null) this.height = ToInt($id(this.id).style.height);
    this.width = $id(this.id).getAttribute("width");      //�ؼ��Ŀ������
    
    //�����С
//    this.fontsize = $id(this.id).getAttribute("fontsize");
//    this.fontfamily = $id(this.id).getAttribute("fontfamily");  //��������
//    this.fontstyle = $id(this.id).getAttribute("fontstyle");      //��������
//    this.backgroundColor = $id(this.id).getAttribute("backgroundColor");  //����ɫ
//    this.color = $id(this.id).getAttribute("color");                               //������ɫ
//    this.fontweight = $id(this.id).getAttribute("fontweight");    //�Ƿ�Ϊ����
//    this.Url;//
    this.sqltrans = $id(this.id).getAttribute("sqltrans");     //���ܺ��SQL���
    this.sql1=$id(this.id).getAttribute("sql1");//�ؼ����յ�Sql���
    
    //this.sql2="";   //û�� �õ�
    this.pagesize = 50;    //50һҳ������
    this.format = $id(this.id).getAttribute("format");            //��������
    if (this.format == null) this.format = "";
    
    this.multiselect = IsTrue($id(this.id).getAttribute("multiselect")); //��ѡ����
    this.returnxml = "<root>"; //����XML
    this.value="";    //�����ı����Valueֵ
    this.text="";         //�����ı������ʾֵ
    this.position = $id(this.id).getAttribute("position");  // �ؼ�����������position
    //this.align = $id(this.id).getAttribute("align"); //���뷽ʽ
    this.FieldNameList; // �ֶ����б�,��,�ָ�,���ڳ�������Դʱ�����ֶ����б�
    this.ParentPos = $id(this.id).getAttribute("ParentPos");
    //�Ƿ�ɼ�
    this.visible=$id(this.id).getAttribute("visible");
    this.disabled = $id(this.id).getAttribute("disabled"); //�Ƿ�
    this.addrow = $id(this.id).getAttribute("addrow");        //���������,��һ�ű�,���ı���ֵ
    this.blninput = $id(this.id).getAttribute("blninput"); //��ȡ�ܷ����ı�����ֱ����������ֵ
    //Ҫ��һ���Ƶ�����ϱ��Ƿ����ص�����

    //�Ƿ��п�������
    this.blnempty=$id(this.id).getAttribute("blnempty");
    //������XML����������Դ
    this.xml = $id(this.id).getAttribute("xml");
   
    //����value����Ϊ��һ��
    this.keycol=0; //keycol���ڵ�ǰ��ʾ���ƣ���Ҫȡ��ID�У�����ID���ڵ�2�У���keycol=2
    //���ز��յı��
    //this.tab; //������ID
    this.fc_list;
    this.txt;
    //���ص�ǰѡ��ı���к�
    //this.selectrow=0;
    //���ص�һ���ǿյ��б�ֵ,������Ӧ�ڸ����Ժ���ȡ��
    //this.firstvalue=""; // not do
    this.dataset = $id(this.id).getAttribute("dataset");
    this.field = $id(this.id).getAttribute("field");

    this.sPubFieldCol = "" ; //ȫ�ֱ���,�����ö��ŷָ����ֶ����б�

    this.fc_txtName;  //�ı���
    this.fc_cmdCz;	//���հ�ť
    this.fc_divList ; //div�ؼ�
    this.fc_divListPage;	//��ҳ����,���ID
    this.upsidepage;  //��ҳ��ť,��һҳ
    this.currentpage ;//��ҳ����,�ı���
    this.nextpage;    //��һҳ
    this.mwidthButton=17; //��ť���
    //this.mLoadXmlData="" ;	//����װ���XML����

    this.runtimesql="";//��ǰSQL���
    this.runtimetext="";//����ʱ�Ĺ�������
    this.findrownum=0;  //��������������һ��
    //this.findrowbgcolor="";//���ҵ����в������б���ɫ����Ϊ"blue"֮ǰ,�����еİ���ɫ�����ڸñ�����,�Ա�������ƶ�ʱ,����ɫ����;
    this.perpagenum=1;//ҳ��
    this.overallpagenum=1; //��ҳ
    //this.Strsend="";	//"<root><percolnum>"+perpagenum+"</percolnum><sql>"+sSql+"</sql></root>"
    this.sXml=""	;//<root><rec><fc>aaaa</fc><fc>222</fc></rec><rec><fc>wwww</fc><fc>2322</fc></rec><rec><fc>eeee</fc><fc>5222</fc></rec><rec><fc>ddd</fc><fc>1222</fc></rec><rec><fc>sss</fc><fc>2232</fc></rec></root>
    //this.tabcolnum=1;//����������,������format�ֽ������ĸ���.
    //�Ƿ񷵻ض���ֵ(����ֵ������ֿ�,Ҫ���ص������д������һ���ַ�Ϊ!)
    //�ô˴�����ÿ�еı���\���\�Ƿ�����\���뷽ʽ����Ϣ
    //����Ϊ��ʱ����
    //ÿ�е�һ���ַ���ʾ���뷽ʽ"<,^,>"
    //this.dblClick=false;
    //this.oldgroundcolor="";
    //this.oldcolor="";
    //this.changcol=0;//�ڵ�һ�������п�ʱѡ�������һ��
    //this.formerLineleft=0;
    //this.moveQuantity=0;
    this.gridposition = 0;      //added by liuxr at 2010-11-23 16:30 grid�ؼ�ʹ��

}
dropdownlist.prototype.getAttribute = function(attrName) {
    var retValue = eval(this.id + "." + attrName);
    if (typeof retValue == "undefined") retValue = $id(this.id).getAttribute(attrName);
    return retValue;
}
dropdownlist.prototype.setAttribute = function(attrName, attrValue) {
    $id(this.id).setAttribute(attrName,attrValue);
}



////////////////////////////////////////////////////////////////////////////////


//�ı���Ľ���
dropdownlist.prototype.onfocus = function() {
	this.fc_txtName.focus();
}
//���ÿؼ�left����ֵ
dropdownlist.prototype.fnPutleft = function(vValue)
{
	this.left=vValue;
	this.fnInitstyle();����//��ʵ������
}
//���ÿؼ�top����ֵ
dropdownlist.prototype.fnPuttop = function(vValue)
{
	this.top=vValue;
	this.fnInitstyle();
}
//���ÿؼ��߶�����ֵ
dropdownlist.prototype.fnPutheight = function(vValue)
{
	this.height=vValue;
	this.fnInitstyle();
}

//���ÿؼ��������ֵ
dropdownlist.prototype.fnPutwidth = function(vValue)
{	
	this.width=vValue;
	this.fnInitstyle();
	//try{
	//	fnInit();
	//}catch(e){}
}

// ��ѡ����
dropdownlist.prototype.fnPutmultiselect = function(vValue)
{
	//������Ϊ�ַ��� ,�Ƿ����Ӷ�ѡ�У���Ϊ��ѡ
	if (vValue=="��")
		this.multiselect=true;
	else
		this.multiselect=false;
}
//�����ı����value����
dropdownlist.prototype.fnPutvalue = function(vValue)
{
	//��û����keycolʱ��value���Խ���text����һ��
	this.value=vValue;
	if(this.keycol==0){
		try{
			this.fc_txtName.value=this.value;
            this.text=this.fc_txtName.value;
		}catch(e){
			
		}
	}
}
dropdownlist.prototype.fnGetvalue = function () {
    //��û����keycolʱ��value���Խ���text����һ��
    if (this.keycol == 0)
        this.value = fc_txtName.value;
    return this.value;
}
//���ÿɼ�����ֵ
dropdownlist.prototype.fnPutvisible = function(vValue)
{
	this.visible=vValue;
	try {
	//�Ƿ���ʾ������Ϊ����ʾ
	//modify by shenfr ad 2010-11-15 15:19 ��uniqueID�޸�Ϊ$id(this.id)
		//eval(uniqueID).style.display = this.visible == "��"?"":"none";
		$id(this.id).style.display = this.visible == "��"?"":"none";
	}catch(e){}
}

//����ֻ������ֵ
dropdownlist.prototype.fnPutdisabled = function(vValue)
{
    this.disabled = vValue;
	try{
	if(typeof this.fc_txtName != "undefined") {
		//�ؼ��Ƿ�,�ı���Ͱ�ť�ؼ�Ϊ���,�����Ƴ�disabled����
	    if (IsTrue(this.disabled)) {
			this.fc_txtName.disabled=true;
			this.fc_cmdCz.disabled=true;
		}else {
			//�Ƴ�ֻ������
			this.fc_txtName.removeAttribute("disabled");
			this.fc_cmdCz.removeAttribute("disabled");
		}
	}
	}catch(e){}
}

/**
* �ڱ����ڵ������ط�mousedownʱ�����������б�
**/
dropdownlist.prototype.hidelist = function() {
    //��ǰ����
    var event = NavJs.getEvent();
    var curObj = event.srcElement || event.target;   //��ǰ�ؼ�

    var objSour = curObj;
    if (curObj.tagName == "TD") {
        //����ĸ��ڵ�
        curObj = curObj.parentNode;
        curObj = curObj.parentNode;
        curObj = curObj.parentNode;
    }
    if (curObj.tagName == "TR") {
        curObj = curObj.parentNode;
        curObj = curObj.parentNode;
    }
    //window.status=curObj.id ||  || curObj.id=="fc_cmdCz"curObj.id=="fc_txtName"  || 

    //��ǰ�ؼ�id��������һ������
    if (curObj.id == "fc_list" || curObj.id == "fc_divList" || curObj.id == "upsidepage" || curObj.id == "currentpage" || curObj.id == "nextpage") return;

    //��ѡʱ�ĸ�ѡ��
    if (curObj.tagName == "INPUT") {
        curObj = curObj.parentNode;
        if (curObj.tagName == "TD") {
            curObj = curObj.parentNode;
            curObj = curObj.parentNode;
            curObj = curObj.parentNode;
            if (curObj.id == "fc_list") return;
        }
    }
    //��ǰ�ؼ�id�Ƿ����eval(uniqueID+".id"),���������,����������
    //modify by shenfr ad 2010-11-15 15:19 ��uniqueID�޸�Ϊ$id(this.id)
    //if(curObj.id != eval(uniqueID+".id") ) {

    if (curObj.id != this.id) {  //ȡ��ǰѡ�еĿؼ�id
        //alert("empty4");
        if (objSour.id != "fc_cmdCz") {

            this.fc_divList.style.display = "none";
            //this.fc_divList.style.backgroundColor = "transparent";
            this.fc_divList.innerHTML = "";

            this.fc_divListPage.style.display = "none";

        }
    }
    //if ( curObj.id==element.id) return;
    //Ҫ��һ���Ƶ�����ϱ��Ƿ����ص�����


}
//----------------------------

//��ʼ������
dropdownlist.prototype.init = function() {
    //modify by liuxr at 2009-12-16 14:11 ��ʼ������ǰ���ȫ���ֶ��б��ֵ��
    this.sPubFieldCol = "";
    var fc_list_width = 0; //���ĸ����п�֮��
    var maxWinHeight = 250; //�����������ڸ߶�,��С�߶���150
    //
    var ArrFormat = this.format.split("|");
    //format���Եĳ���,����ĳ���
    var iTitleLen = ArrFormat.length;
    //
    //CopyToPub(sXml);
    //sXml = repStr(sXml,"<","&lt;");
    //sXml = repStr(sXml,">","&gt;");
    //debugger;
    var iTitleLenBak = iTitleLen;
    if (iTitleLenBak == 1) iTitleLenBak = 2; //my add 2013-04-27


    var oXML = SetDom(this.sXml);
    if (oXML.documentElement == null) {
        if (IsSpace(this.sXml) == false) alert(this.sXml);
        return;
    }

    var recCount = oXML.documentElement.childNodes.length - 3; //�����б�ļ�¼����
    var contentCols = 1; //��xml���ݼ�����������������ж�ѡ�С�
    if (recCount > 0) {
        contentCols = oXML.documentElement.childNodes[0].childNodes.length;
    }

    var multiStr = ""; //����������Դ���϶�ѡ���ܣ� 2013-08-09
    if (this.multiselect) {
        multiStr = "<td style='width:20px'><input type='checkbox' /></td>";

    }

    //sXml�Ǳ������
    //������
    //��¼��
    var lngchildNodeone = oXML.documentElement.childNodes.length;
    //sql���������Դʱ
    if (IsSpace(this.sql1) == false) {
        //my add 2013-06-20
        if (lngchildNodeone > 3 && oXML.documentElement.childNodes[0].childNodes.length == 1 && iTitleLen == 1) {
            iTitleLenBak = 1;
        }


        //
        //this.sPubFieldCol = oXML.documentElement.childNodes(lngchildNodeone).text;
        this.sPubFieldCol = NavJs.textContent(oXML.documentElement.childNodes[lngchildNodeone-1])
        //

    } else { //��������Դʱ
        this.sPubFieldCol = this.FieldNameList; //���ŷָ����ֶ���,�����ֶ�ͬ������

    }
    lngchildNodeone--; //�����һ��fields�ӽڵ�,����-1
    oXML.documentElement.removeChild(oXML.documentElement.childNodes[lngchildNodeone]);
    //alert(lngchildNodeone)
    //����ĳ���
    //var iTitleLen = this.tabcolnum;    //parseInt(oXML.childNodes(0).childNodes(0).childNodes .length)
    //����
    //var col_len = oXML.documentElement.childNodes[0].childNodes.length;

    //loadtabΪ�������ݱ���ǰ�����ݡ�
    //������� borderColor=#B8B7B7
    var loadtab = "<table border=1 id=fc_list  cellPadding=0 cellSpacing=0  style='WIDTH:100%;BORDER-COLLAPSE: collapse;TABLE-LAYOUT: fixed;overflow:hidden;BORDER-BOTTOM: #848284 0px solid;BORDER-right: #848284 0px solid;BORDER-top: #848284 0px solid;BORDER-left: #848284 0px solid;' frame='box'>";  //overflow:hidden; ������ֺ����������2013-06-04


    loadtab += "<tr>"; //�ӱ����С�

    var titleCols = 1; //�����е�������
    if (IsSpace(this.format)) {
        titleCols = contentCols;
        if (this.multiselect) {
            titleCols = contentCols - 1;
        }
    } else {
        titleCols = iTitleLen;
    }
    //����һ��<td>Ԫ��
    for (var i = 0; i < titleCols; i++) {
        loadtab += "<td></td>";
    }
    loadtab += multiStr;
    loadtab += "</tr>";

    //�ҵ���һ�е�ֵ�����ı����ֵ,���������һ��
    if (lngchildNodeone != 2) {
        for (var i = 0; i < lngchildNodeone - 2; i++) {
            //Format���Եĳ���
            for (var k = 0; k < iTitleLen; k++) {
                //�ҵ����������һ��ֵ�����ı����ֵ,������,�����һ��ǰ�м�1
                try {
                    var strtext1 = NavJs.textContent(oXML.childNodes[0].childNodes[i].childNodes[k]);
                    if (Trim(strtext1) == Trim(this.runtimetext) && Trim(this.runtimetext) != "") {
                        this.findrownum = i + 1;
                        break;
                    }
                } catch (e) {
                    var strtext2 = NavJs.textContent(oXML.childNodes[0].childNodes[i]);
                    if (Trim(strtext2) == Trim(this.runtimetext) && Trim(this.runtimetext) != "") {
                        this.findrownum = i + 1;
                        break;
                    }
                }
            }
        }
    }
    //ҳ��
    //perpagenum=oXML.documentElement.childNodes(lngchildNodeone-1).text;
    this.perpagenum = NavJs.textContent(oXML.documentElement.childNodes[lngchildNodeone - 1]);
    //��ҳ��
    //this.overallpagenum=oXML.documentElement.childNodes(lngchildNodeone-2).text;
    this.overallpagenum = NavJs.textContent(oXML.documentElement.childNodes[lngchildNodeone - 2]);
    //alert(this.overallpagenum)
    //intpage��һ���ڵ�
    var oChild = oXML.documentElement.childNodes[lngchildNodeone - 1];
    oXML.documentElement.removeChild(oChild);
    //pagenumber��һ���ڵ�
    oChild = oXML.documentElement.childNodes[lngchildNodeone - 2];
    oXML.documentElement.removeChild(oChild);
    //�滻�ַ���ȥ��<root>�ڵ�

    this.sXml = RepStr(NavJs.xml(oXML), "<root>", "");
    //�滻�ַ���ȥ��</root>�ڵ�
    this.sXml = RepStr(this.sXml, "</root>", "");

    //added by liuxr at 2009-9-9 �Ƴ�CDATA
    this.sXml = RepStr(this.sXml, "<![CDATA[", "");
    this.sXml = RepStr(this.sXml, "]]></", "</");
    //ת��
    this.sXml = unescape(this.sXml);
    //�ָ�txt��ֵ
    var fc_txtNamebak = this.fc_txtName.value;

    this.fnInit(loadtab + this.sXml + "</table>");
    this.fc_txtName.value = fc_txtNamebak;

    this.value = this.fc_txtName.value;
    this.text = this.fc_txtName.value;
    if (IsSpace(this.format)) {
        //alert(contentCols)
        if (recCount > 0 && ((contentCols > 1 && this.multiselect == false) || (this.multiselect && contentCols > 2))) {

            dropdownlist_setColWidth(this.fc_list, 0); //���ص�һ�е�����,��id��
        }
    }
    else {
        for (var k = 0; k < iTitleLen; k++) {
            //����Ϊ�����
            if (ArrFormat[k].indexOf("<") != -1) {
                //this.fc_list.childNodes[0].childNodes[k].align = "left";
                ArrFormat[k] = RepStr(ArrFormat[k], "<", "");
            }
            //������ж���
            if (ArrFormat[k].indexOf("^") != -1) {
                //this.fc_list.childNodes[0].childNodes[k].align = "middle";
                ArrFormat[k] = RepStr(ArrFormat[k], "^", "");
            }
            //�����Ƿ�Ϊ�գ����Ϊ�գ���һ�п��Ϊ0
            if ((ArrFormat[k] == "" || ArrFormat[k] == "!") && (this.format != "")) { //&& Sys.Browser.agent == Sys.Browser.InternetExplorer
                //            this.fc_list.childNodes[0].childNodes[k].style.visibility = "collapse";
                //            this.fc_list.childNodes[0].childNodes[k].style.overflow = "hidden";
                //            this.fc_list.childNodes[0].childNodes[k].style.width = "0px";
                //            //this.fc_list.childNodes[0].childNodes[k].style.display = "none";
                //this.fc_list.rows[0].cells[k].style.display = "none";
                dropdownlist_setColWidth(this.fc_list, k);
            }
            //�����Ҷ���
            if (ArrFormat[k].indexOf(">") != -1) {
                // this.fc_list.childNodes[0].childNodes[k].align = "right";
                ArrFormat[k] = RepStr(ArrFormat[k], ">", "");
            }
            //�����Ƿ���������ţ�����У����ţ��滻��=""
            if (ArrFormat[k].indexOf("!") != -1) {
                ArrFormat[k] = RepStr(ArrFormat[k], "!", "");
            }
            //�����0�е�һ�е���ArrFormat[k]
            try {
                //this.fc_list.rows[0].cells[k].innerText = ArrFormat[k];
                NavJs.innerText(this.fc_list.rows[0].cells[k], ArrFormat[k]);
            } catch (e) { }
            //�����Ƿ�Ϊ��,��������еĿ��
            var itmp = parseInt(ArrFormat[k].length) * 15; //+2 //+17 ;POSITION
            //alert(k + "-" + iTitleLen)
            //��ֹ������ѡ��,��ѡ,����Ϊ��ʱ,��ʾ�п�����, 22 Ϊcheckbox���п�, 2012-07-09 my add
            //if (itmp == 0 && this.multiselect) itmp = 100; //this.fc_txtName.offsetWidth + this.fc_cmdCz.offsetWidth - 22;
            //------------
            //if (Sys.Browser.agent == Sys.Browser.InternetExplorer)
            //if (iTitleLen == 1 && iTitleLenBak == 2) {
            //    dropdownlist_setColWidth(this.fc_list, k, itmp);
            //this.fc_list.childNodes[0].childNodes[k].style.width = itmp;
            //}

            dropdownlist_setColWidth(this.fc_list, k, itmp);

            fc_list_width += itmp;

        }
        if (this.multiselect) {
            //this.fc_list.childNodes[1].childNodes[col_len].style.width=22; //��checkbox���п�
            //this.fc_list.childNodes[0].childNodes[iTitleLen].style.width = "22px"; //��checkbox���п�
            //dropdownlist_setColWidth(this.fc_list, iTitleLen, 22);
            fc_list_width += 22;
        }
    }
    //�������
    this.fc_list.rows[0].align = "middle";

    //�ںÿؼ���λ��
    //��ʼ���������е�����
    //�����������еĿ��
    //ʹ���ĵ��Ƴɰ�����
    //for (var i=1;i<this.fc_list.rows.length;i=i+2){
    /*for (var i=1;i<this.fc_list.rows.length;i++){
    if (i % 2 == 0)
    this.fc_list.rows[i].style.backgroundColor="#eeffee";
    else
    this.fc_list.rows[i].style.backgroundColor="#ffffff";
    }*/
    var iTwo = 2;
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer) iTwo = 1; //�ڹȸ���,����δ����ʱ��͸��.����ȥ��������Ч��
    iTwo = 1; //����δ����ʱ��͸��.����ȥ��������Ч��

    for (var i = 1; i < this.fc_list.rows.length; i = i + iTwo) {
        NavJs.setClassName(this.fc_list.rows[i], "pertworow");
    }
    //���ҵ����б���ɫ

    if (this.fc_list.rows.length > this.findrownum) {
        //�ҵ�����ڵĵ�ǰ��,�ı䵱ǰ�е�������ɫ�ͱ���ɫ
        if (parseInt(this.findrownum) != 0) {
            //this.findrowbgcolor = this.fc_list.rows[this.findrownum].style.backgroundColor;
            //this.oldgroundcolor = this.fc_list.rows[this.findrownum].style.backgroundColor;
            //�ı���findrownum�еı���ɫ
            //this.fc_list.rows[this.findrownum].style.backgroundColor = "blue";
            //����findrownum��������ɫ
            //this.fc_list.rows[this.findrownum].style.color="red";
            NavJs.setClassName(this.fc_list.rows[this.findrownum], "findrow");

            //div�ĸ߶�
            this.fc_divList.scrollTop = this.fc_list.rows[this.findrownum].offsetTop;
        }
        /*else{
        //����һ�е������Ϊ��ɫ
        try{
        this.fc_list.rows[1].style.color="red";
        this.fc_list.rows[1].style.backgroundColor="blue";
        }catch(e){}
        }*/

    }

    //��һ�е�ɫΪ��ɫ,�������а�͹��
    var sl = this.fc_list.rows[0].cells.length;
    //�������ʽ
    NavJs.setClassName(this.fc_list.rows[0], "firstrow");

    //	for(i=0;i<sl;i++){
    //		this.fc_list.rows[0].cells[i].style.cssText="border-left:1px solid white; border-top: 2px solid white; border-bottom: 1px solid #818080; border-right:1px solid #B8B7B7;background-color: #D3D3D3;";
    //	}
    var iTopOffset = 0;
    //���������Ϊ��,���ص�һ�е�����
    if (this.format == "") {
        this.fc_list.rows[0].style.display = "none";
        iTopOffset = -2;
        //�̶����ص�һ�е����ݣ�2013-04-27
        //if (iTitleLen == 1 && iTitleLenBak == 2) {
        //    dropdownlist_setColWidth(this.fc_list, 0);
        //for (var kk = 0; kk < this.fc_list.rows.length; kk++) {
        //if (Sys.Browser.agent == Sys.Browser.InternetExplorer)
        // this.fc_list.rows[kk].cells[0].style.display = "none";
        //else
        //    this.fc_list.rows[kk].cells[0].style.width = "0px"; //���ô�����chrome���п���㲻�ԣ�2013-06-05
        //this.fc_list.rows[kk].cells[1].style.width = "100%";
        //}
        // }
    }

    //��ʾdiv
    this.fc_divList.style.display = "block";
    //����������Ŀ��.
    //���û�й�����,div�Ŀ�ȼ�17
    var iScrollWidth = 17;

    //alert(this.fc_list.offsetHeight);
    if (this.fc_list.offsetHeight < maxWinHeight) { //maxWinHeight�������������ڵĸ߶�
        $id("fc_ifra").style.height = (this.fc_list.offsetHeight + 0) + "px";
        this.fc_divList.style.height = $id("fc_ifra").style.height;
        iScrollWidth = 0;
    } else {
        $id("fc_ifra").style.height = maxWinHeight + "px";
        this.fc_divList.style.height = $id("fc_ifra").style.height;
    }
    //alert(fc_divList.offsetHeight+"aa"+fc_divList.offsetWidth);

    var iBorder = 2 + iTitleLen; //�߿�Ĳ�ֵ

    var iTmpWidth = this.fc_txtName.style.width;
    iTmpWidth = ToInt(RepStr(iTmpWidth, 'px', ''));
    if (IsSpace(iTmpWidth)) iTmpWidth = this.fc_txtName.offsetWidth;

    var newWidth1 = iTmpWidth + this.fc_cmdCz.offsetWidth;
    var newWidth2 = fc_list_width + iBorder + iScrollWidth;
    this.fc_divList.style.width = newWidth1 > newWidth2 ? (newWidth1) + "px" : (newWidth2) + "px";
    //this.fc_list.style.width = (parseInt(this.fc_divList.style.width)- iBorder - iScrollWidth) + "px";  //ȥ�������ÿ��Ϊ100%
    //alert(this.fc_divList.offsetHeight+"aa"+this.fc_divList.offsetWidth);
    //����fc_divList���ֵ�λ��
    this.iframeWinPos();
    //�Ƿ���ʾ��ҳ��ť
    //��ʾҳ�ŵ��ı����ֵ
    this.currentpage.value = this.perpagenum;
    //�����ҳ������1ʱ��ʾ��ҳ��ť
    if (this.overallpagenum > 1) {
        this.fc_divListPage.style.display = "";
        this.fc_divListPage.style.top = (parseInt(this.fc_divList.style.top) + parseInt(this.fc_divList.offsetHeight) - parseInt(this.fc_divListPage.offsetHeight)) + "px";
        this.fc_divListPage.style.left = (parseInt(this.fc_divList.style.left) + 1) + "px";
        this.PageDisplayStatus();
    }
    else {
        //���ط�ҳ��ť
        this.fc_divListPage.style.display = "none";
        this.fc_divListPage.style.top = (parseInt(this.fc_divList.style.top) + parseInt(this.fc_divList.offsetHeight) - parseInt(this.fc_divListPage.offsetHeight)) + "px";
        this.fc_divListPage.style.left = (parseInt(this.fc_divList.style.left) + 1) + "px";
    }
    if (this.xml != "") {
        //������ԴΪ����ʱ���ط�ҳ�͹��˿ؼ�
        this.fc_divListPage.style.display = "none";
    }

    //alert(this.fc_divList.style.top);
    //alert(this.fc_divList.style.left);
    //alert(this.fc_list.outerHTML);

    function dropdownlist_setColWidth(oTable, colNo, widthValue) {
        //2013-07-25
        for (var kk = 0; kk < oTable.rows.length; kk++) {
            if (!IsSpace(widthValue)) {
                oTable.rows[kk].cells[colNo].style.width = widthValue + "px";
            } else {
                if (Sys.Browser.agent != Sys.Browser.InternetExplorer)
                //    oTable.rows[kk].cells[colNo].style.display = "none";
                //else
                    oTable.rows[kk].cells[colNo].style.width = "0px"; //���ô�����chrome���п���㲻�ԣ�2013-06-05
                //this.fc_list.rows[kk].cells[1].style.width = "100%";

                oTable.rows[kk].cells[colNo].style.display = "none";
            }
        }
    }
}
dropdownlist.prototype.iframeWinPos = function() {
    //����fc_divList���ֵ�λ��
    var iHeight = this.fc_txtName.style.height;
    iHeight = RepStr(iHeight, 'px', '');
    if (IsSpace(iHeight)) iHeight = this.fc_txtName.offsetHeight;

    var iToptmp = getAbsTop(this.fc_txtName) + ToInt(iHeight);

    this.fc_divList.style.left = getAbsLeft(this.fc_txtName) + "px";
    var fc_divList_height = ToInt(this.fc_divList.style.height);
    var ilen = getClientSize().height - iToptmp;
    if (ilen < fc_divList_height ) {
        if (iToptmp > fc_divList_height + ToInt(this.fc_txtName.style.height)) { //��ʾ������
            this.fc_divList.style.top = (iToptmp - (fc_divList_height + ToInt(this.fc_txtName.style.height))) + "px";
        } else {
            this.fc_divList.style.top = 0 + "px"; //��ʾ���м�
        }

    } else { //������ʾ������
        //��div��ʾ��top����
        this.fc_divList.style.top = iToptmp + "px";

    }

}
/*
�������ı�����ƶ����ʱ�䱳��ɫ
*/
dropdownlist.prototype.fc_listonmouse = function() {
    var oMouseover = NavJs.getEventObj("fc_ifra");

    if (oMouseover.tagName == "TD") oMouseover = oMouseover.parentNode;
    if (oMouseover.tagName == "TR") {
        if (oMouseover.rowIndex != 0) {
            Sys.UI.DomElement.toggleCssClass(this.fc_list.rows[oMouseover.rowIndex], "selectrow");
        }
    }

}
/**
* ���µ�������ʾ��������
*@date 2007-10-11
**/
dropdownlist.prototype.ShowDropWin = function() {


    if (IsTrue(this.isShowTree)) {

        var sStr = new Sys.StringBuilder();
        sStr.append('<body onload=\'TreeRefresh($id("dropdownTree"), "", function() { TreeSetMultiValue($id("dropdownTree"),"' + this.fc_txtName.value + '",true);TreeRootNodeHide($id("dropdownTree"),"none"); });\' >');
        sStr.append('<div id="dropdownTree" controltype="tree" ');
        var sourceType = "0";
        if (IsSpace(this.sql1) == false) {
            if (this.isTreeNewSql == "1")
                sourceType = "3";
            else
                sourceType = "1";
        }
        sStr.append('sourcetype=' + sourceType + ' opentb="_self" clicknode="');
        sStr.append('" ');

        sStr.append('roottext="" ');
        if (IsSpace(this.xml) == false) {
            sStr.append('xml="' + escape(this.xml) + '" ');
        }
        if (this.multiselect) {
            sStr.append('ischecked="1" ');
        }
        sStr.append('isAll="1" ');
        sStr.append('datasourceName="' + this.datasourceName + '" ');

        if (this.isTreeNewSql == "1") {
            sStr.append('sql2="' + SqlPropTrans(this.sql1) + '" ');
        } else {
            sStr.append('sql="' + SqlPropTrans(this.sql1) + '" ');
        }

        sStr.append('style="'); //OVERFLOW: auto; width:100%; height:100%;
        sStr.append('border-width:0;');
        sStr.append(' background-color:#ffffff;  " ></div>');
        sStr.append('<script language="JavaScript">');
        sStr.append('var dropdownTree;');   //����һ��ȫ�ֱ���

        sStr.append('window.attachEvent( "onunload", function(){dropdownTree=null;});\r\n'); //����ڴ�

        sStr.append('</' + 'script>');
        //        sStr.append('<script language="JavaScript" for="onload">');
        //      sStr.append('TreeRefresh($id("dropdownTree"), "", function() { });');
        //    sStr.append('</' + 'script>');
        sStr.append('</body>');
        this.fnInit(sStr.toString());

        var baseWidth = 150;
        var newWidth1 = this.fc_txtName.offsetWidth + this.fc_cmdCz.offsetWidth;
        this.fc_divList.style.width = Math.max(baseWidth, newWidth1)+"px";
        this.fc_divList.style.height = 250+"px"; //�����߶ȹ̶�Ϊ 250.
        this.fc_divList.style.display = "";
        this.iframeWinPos();

        this.sPubFieldCol = this.FieldNameList; //���ŷָ����ֶ���,�����ֶ�ͬ������

        //   fc_divTreeButton.style.top = parseInt(fc_divList.style.top) + parseInt(fc_divList.offsetHeight) - parseInt(fc_divTreeButton.offsetHeight);
        //   fc_divTreeButton.style.left = parseInt(fc_divList.style.left) + 1;
        //   fc_divTreeButton.style.display = "";
        return;

    }

    //alert("bb")
    //	fc_divList.style.display ="none";
    
    //alert(this.sql1);
    //��ǰsql���
    this.runtimesql = this.sql1;
    //����򿪵�sql���
    this.runtimesql = RepOpenSql(this.sql1, this.fc_txtName.value);
    strX = this.fc_txtName.value;
    runtimetext = this.fc_txtName.value;
    var Strsend = "<percolnum>" + this.perpagenum + "</percolnum><sql>" + this.runtimesql + "</sql><strValue>" + strX + "</strValue><perpagerownum>" + this.pagesize + "</perpagerownum><showcheckbox>" + this.multiselect + "</showcheckbox><blnempty>" + this.blnempty + "</blnempty><addrow>" + this.addrow + "</addrow>";
    //��ʾҳ�ŵ��ı����ֵ
    this.currentpage.value = this.perpagenum;
    if (this.xml == "" || this.xml == null) {
        if (this.runtimesql == "") {
            //��ʾ���ձ�񲢼�����λ��
            this.fc_divList.style.display = "block";
            //alert("empty");
            return;
        } else {
            var sDsn = "";
            if (IsSpace(this.datasourceName) == false) sDsn = "&datasourceName=" + this.datasourceName;
            //��SQL�����������
            this.sXml = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=sqltoxml" + sDsn, Strsend);
        }
    } else {
        //ֱ�ӵ�����Դ
        var s1 = "<root>" + this.xml;
        //�Ƿ��ж�ѡ����
        if (this.multiselect == true) {
            s1 = RepStr(s1, "</tr>", "<td style='width:20px' align='center' ><input type='checkbox'></input></td></tr>");
        }
        //��������
        //alert(s1)
        this.sXml = s1 + "<pagenumber>1</pagenumber><intpage>1</intpage><fields></fields></root>";

    }

    //��ʵ������

    this.init();

}

//������հ�ť
dropdownlist.prototype.fc_cmdCz_onclick = function() {
    //var event = getEvent();
    //var cur_obj = event.srcElement || event.target;//��ǰ��ť����

    this.perpagenum = 1;
    //��������¼�onclickopen������հ�ť����һ�ű������oEvent.showlist = true�������հ�ťʱ��ʾ������Ϊfalse����ʾ,
    var oEvent = new Object();
    //��ʾ������
    oEvent.showlist = true;
    //added by liuxr at 2010-12-29 16:50 ����onclickopen�¼��ĵ���
    //eval($id(this.id).getAttribute("onclickopen"))

    oEvent.obj = $id(this.id);

    fcpubdata.validEventObj = oEvent;
    var sClickOpen = $id(this.id).getAttribute("onclickopen");
    if (!IsSpace(sClickOpen)) {
        oEvent.showlist = false;
        this.fc_divList.style.display = "none"; //ǿ�йر��������ڣ���õ��������������ڣ�һ�������ڣ���2013-08-16
        eval(sClickOpen);
    }
    
    fcpubdata.validEventObj = null;
    var bShowList = oEvent.showlist;
    //onclickopenID.fire(oEvent);
    if (typeof oEvent.ret != "undefined") {
        this.fc_txtName.value = oEvent.ret;
        //�����ı��¼��Դ����������ݼ�����Ӧ��ֵ�ĸı�
        var oEvent = new Object();
        oEvent.afterchangevalue = this.fc_txtName.value;

        //onchangeID.fire(oEvent1);
        eval($id(this.id).getAttribute("onchange"));
        eval($id(this.id).getAttribute("onchangeCz"));
    }
    //��������ʾ
    if (IsSpace(bShowList) || bShowList == false) {
        return;
    }

    //�ı����Ƿ�Ϊֻ��,Ϊֻ������
    if (this.fc_txtName.disabled == true) return;

    strXML = "";
    //��ǰsql���
    this.runtimesql = this.sql1;
    //����򿪵�sql���
    this.runtimesql = RepOpenSql(this.sql1, this.fc_txtName.value);

    if (this.fc_divList.style.display == "none") {
        this.ShowDropWin();
        //����������ӽ���
        try {
            this.fc_list.focus(); //fc_list
        } catch (e) { }
        this.fc_divList.style.display = "block";
    } else {
        //alert(fc_divList.style.display)
        //����������
        this.fc_divList.style.display = "none";
        this.fc_divList.innerHTML = "";
        this.fc_divListPage.style.display = "none";
        try {
            this.fc_txtName.focus();
        } catch (e) { }


    }
}

//��һҳ
dropdownlist.prototype.NextPage = function() {
	//��ǰҳ���Ƿ�С����ҳ��
	if (this.perpagenum<this.overallpagenum){
		//����һҳ��¼
		this.perpagenum=parseInt(this.perpagenum)+1;
		//��ʾҳ�ŵ��ı����ֵ
		this.currentpage.value =this.perpagenum;
		this.runtimesql = RepOpenSql(this.sql1,this.fc_txtName.value);
		//������ִ̨��
		var Strsend="<percolnum>"+this.perpagenum+"</percolnum><sql>"+this.runtimesql+"</sql><strValue>###</strValue><pagesize>"+this.pagesize+"</pagesize><multiselect>"+this.multiselect+"</multiselect><blnempty>"+this.blnempty+"</blnempty><addrow>"+this.addrow+"</addrow>";
		var sDsn = "";
		if (IsSpace(this.datasourceName) == false) sDsn = "&datasourceName=" + this.datasourceName;

		this.sXml = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=sqltoxml" + sDsn, Strsend);

		//init() ;
		this.ShowDropWin(); //�˴�������
		this.fc_list.focus(); //���������ƽ���
		this.PageDisplayStatus();
	}
	//
}

//��һҳ
dropdownlist.prototype.PrevPage = function() {
	//�����ǰҳ�Ŵ���1,���ʱ����һҳ��¼
	if(this.perpagenum>1){
		//����һҳ��¼
		this.perpagenum=parseInt(this.perpagenum)-1;
		//��ʾҳ�ŵ��ı����ֵ
		this.currentpage.value =this.perpagenum;
		//����򿪵�sql����е�
		this.runtimesql = RepOpenSql(this.sql1,this.fc_txtName.value);
		var Strsend="<percolnum>"+this.perpagenum+"</percolnum><sql>"+this.runtimesql+"</sql><strValue>###</strValue><pagesize>"+this.pagesize+"</pagesize><multiselect>"+this.multiselect+"</multiselect><blnempty>"+this.blnempty+"</blnempty><addrow>"+this.addrow+"</addrow>";

		var sDsn = "";
		if (IsSpace(this.datasourceName) == false) sDsn = "&datasourceName=" + this.datasourceName;
		this.sXml = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=sqltoxml" + sDsn, Strsend);
		this.ShowDropWin();

		this.fc_list.focus();
		this.PageDisplayStatus();	
	}
	//
}
dropdownlist.prototype.PageDisplayStatus = function() {

	//���currentpage�ı����ֵ����1,��һҳ��ťΪֻ��
	//alert("currentpage: " +this.currentpage.value)
	if(this.currentpage.value <= 1) {
		this.upsidepage.disabled = true ;
	}else{
		this.upsidepage.disabled = false ;
		this.upsidepage.removeAttribute("disabled") ;
	}
	//���currentpage�ı����ֵ������ҳ��,��һҳ��ťΪֻ��
	//alert("overallpagenum: " +this.overallpagenum)
	if(this.currentpage.value == this.overallpagenum) {
		this.nextpage.disabled = true ;
	}else{
		this.nextpage.disabled = false ;
		this.nextpage.removeAttribute("disabled") ;
	}
}
//ȫѡ��2013-08-10
dropdownlist.prototype.selectAll = function(isSel) {
    var startRow = 0;
    if (!IsSpace(this.format)) startRow++;
    if (this.addrow == "��") startRow++;
    if (this.blnempty == "��") startRow++;
    var endCol = 0;
    if (this.fc_list.rows.length > startRow) endCol = this.fc_list.rows[startRow].cells.length - 1;

    for (var j = startRow; j < this.fc_list.rows.length; j++) {

        NavJs.child(this.fc_list.rows[j].cells[endCol], "INPUT", 0).checked = isSel;
    }
}
//˫����񷵻�ʱ
dropdownlist.prototype.cmdreturn_onclick = function() {
    //ָ�����ڵĶ����¼�
    var iEvent = NavJs.getEventObj("fc_ifra");

    var rowobj;
    //����ȫѡ��2013-08-10
    if (!IsSpace(this.format) && iEvent.tagName == "INPUT" && iEvent.parentNode.tagName == "TD" && iEvent.parentNode.parentNode.tagName == "TR" && iEvent.parentNode.parentNode.rowIndex == 0) {
        this.selectAll(iEvent.checked);
    }


    if (iEvent.tagName == "TD")
        rowobj = iEvent.parentNode;
    if (iEvent.tagName == "TR")
        rowobj = iEvent;
    if (typeof rowobj == "undefined") return;
    //var strXML = "<root>";

    //����
    //var ss = rowobj.rowIndex;
    //������
    if (this.addrow == "��") {
        //ss = 1;
        if (rowobj.rowIndex == 1) {
            //���������¼�onclickadd������һ�ű������ı���ֵ
            var oEvent = new Object(); // createEventObject();
            oEvent.ret = "";
            //onclickaddID.fire(oEvent);
            /*var strlink = document.getElementById(this.id).getAttribute("onclickadd");
            var fun;
            if (strlink.indexOf("(")>=0)
            {
            fun = strlink.substring(strlink.indexOf("(")+2,strlink.length-2);
            }
	        
    	    eval(QuotForm42(fun));*/
            NavJs.insertEventParam($id(this.id).getAttribute("onclickadd"), oEvent);


            if (typeof oEvent.ret == "undefined") {
            } else {
                this.fc_txtName.value = oEvent.ret;
                this.value = this.fc_txtName.value;
                this.text = this.fc_txtName.value;
            }
            //����������
            //alert("empty1");
            this.fc_divList.style.display = "none";
            this.fc_divList.innerHTML = "";
            this.fc_divListPage.style.display = "none";
            return; //2007-08-01 add
        }
    }
    //    else {
    //        ss = 0;
    //    }
    //
    var retArr = this.returnSelValue(rowobj.rowIndex);
    if (IsSpace(retArr)) return;
    this.CopyFieldsValue(retArr[1]);

    /*
    if (iEvent.tagName != "INPUT" && rowobj.rowIndex > ss) {

        //��ΪLOADXMLDATA
    if (this.sql1 == "" && this.xml == "") {
    //��û����format����//text���Թ̶����ص�һ��
    var selectrow = rowobj.rowIndex;
    this.fc_txtName.value = NavJs.innerText(this.fc_list.rows[selectrow].cells[0]); //this.fc_list.rows[this.selectrow].cells[0].innerText;
    this.value = NavJs.innerText(this.fc_list.rows[selectrow].cells[this.keycol]); //.innerText;
    this.text = this.value;
    //ÿ���ұߵĵ�һ���ַ���Ϊ!��ʾ�ɷ��ض��У�Ӱ��returnxml����
    if (this.format != "") {
    var arrFormat = this.format.split("|");
    strXML = strXML + "<tr>";
    //��ѡ					
    for (var k = 0; k < arrFormat.length; k++) {
    if (arrFormat[k].substring(arrFormat[k].length - 1, arrFormat[k].length) == "!");
    strXML = strXML + "<td>" + NavJs.innerText(this.fc_list.rows[selectrow].cells[k]) + "</td>";
    }
    strXML = strXML + "</tr>";
    }
    } else {
    var ArrFormatnew = this.format.split("|");
    //�����������
    var nodesNumber = this.fc_list.rows[0].cells.length; //this.fc_list.childNodes[1].childNodes.length;
    //�����������	
    var rowsnum = this.fc_list.rows.length;
    if (this.multiselect == true) {

                //�ж�ѡ
    var j = 1;
    //�����еĿ�������	�Ƿ������
    if (this.addrow == "��" && this.blnempty != "��") {
    j = 2;
    }
    if (this.addrow != "��" && this.blnempty == "��") {
    j = 2;
    }
    if (this.addrow == "��" && this.blnempty == "��") {
    j = 3;
    }

                var arrMulti = new Array(ArrFormatnew.length);
    var isCol0 = this.format.indexOf("!") == -1;

                var showxml = ""; //��ѡ��ֵ

                for (var i = j; i < nodesNumber; i++) {
    //myȥ��nodesNumber -4
    if (this.fc_list.rows[i].cells[this.fc_list.rows[i].cells.length - 1].childNodes[0].checked == true) {
    //format���Եĳ���
    var Arrlength = ArrFormatnew.length;
    strXML = strXML + "<tr>";
    for (var k = 0; k < Arrlength; k++) {
    if (ArrFormatnew[k].indexOf("!") != -1 || (isCol0 && k == 0)) {
    strXML = strXML + "<td>" + NavJs.innerText(this.fc_list.rows[i].cells[k]) + "</td>";
    showxml += Trim(NavJs.innerText(this.fc_list.rows[i].cells[k])) + ",";
    }
    }
    //���϶�ѡʱ,ͬ���ֶδ������ݵĹ����֧��, 2011-06-16
    if (typeof (arrMulti[k]) == "undefined") arrMulti[k] = "";
    arrMulti[k] += new Eapi.Str().trim(this.fc_list.rows[i].cells[k].innerText) + ",";
    }
    strXML = strXML + "</tr>";
    }
    this.fc_txtName.value = showxml.substring(0, showxml.length - 1);
    this.CopyFieldsValue(arrMulti);
    //�±�����Ϊliuxr�ӵ�
    this.value = this.fc_txtName.value;
    this.text = this.fc_txtName.value;
    }
    else {
    //��ѡ		
    //format���Եĳ���			
    var Arrlength = ArrFormatnew.length;
    strXML = strXML + "<tr>";
    var bfind = false;
    for (var k = 0; k < Arrlength; k++) {
    if (ArrFormatnew[k].indexOf("!") != -1) {
    strXML = strXML + "<td>" + NavJs.innerText(this.fc_list.rows[rowobj.rowIndex].cells[k]) + "</td>";
    if (bfind == false) {
    this.fc_txtName.value = Trim(NavJs.innerText(this.fc_list.rows[rowobj.rowIndex].cells[k]));

                            this.value = this.fc_txtName.value;
    this.text = this.fc_txtName.value;
    this.CopyFieldsValue(rowobj.rowIndex);
    bfind = true;
    }
    }
    }
    strXML = strXML + "</tr>";
    }
    }

        //����ؼ���format���Բ�����!���ص�һ�е�ֵ
    var slen = this.format.length;
    var m = 0;
    if (this.multiselect == false) {
    //����format�����Ƿ����!����
    for (i = 0; i < slen; i++) {
    if (this.format.substring(i, i + 1) == "!") {
    m++;
    break;
    }

            }
    if (m == 0) {
    var selectrow = rowobj.rowIndex;
    //ͼƬ�������Ϊ�գ�����û�У�����ʱ�����ص�0�е�ֵ����Ϊ��ʱ�����ص�һ�е�ֵ
    //this.fc_txtName.value = this.fc_list.rows[this.selectrow].cells[0].innerText;
    //this.value=this.fc_list.rows[this.selectrow].cells[this.keycol].innerText;
    this.fc_txtName.value = NavJs.innerText(this.fc_list.rows[selectrow].cells[0]);
    this.value = NavJs.innerText(this.fc_list.rows[selectrow].cells[this.keycol]);
    this.text = this.value;
    this.CopyFieldsValue(selectrow);

            }
    }

        strXML = strXML + "</root>";
    */

    //����������
    //alert("empty2");
    this.fc_divList.style.display = "none";
    this.fc_divList.innerHTML = "";
    this.fc_divListPage.style.display = "none";
    this.fc_txtName.disabled = false;
    //���ı���ֵ����ǰ��
    var oEvent = new Object(); //createEventObject();
    oEvent.afterchangevalue = this.fc_txtName.value;
    oEvent.returnxml = retArr[0]; //strXML;
    //ѡ����д�¼�
    //onchangeID.fire(oEvent);
    //alert("my6" + $id(this.id).getAttribute("onchange") + "(2)" + $id(this.id).getAttribute("onchangeCz") + "(3)" + $id(this.id).getAttribute("oninterchange") + "(4)" + $id(this.id).getAttribute("onselchange"))
    //modify by liuxr at �޸�Ϊֱ��ִ��onchange����	
    eval($id(this.id).getAttribute("onchange"));

    //added by liuxr at 2010-12-30 9:30 grid���������onchange�¼�
    eval($id(this.id).getAttribute("onchangeCz"));

    eval($id(this.id).getAttribute("oninterchange"));
    /*var strlink = document.getElementById(this.id).getAttribute("onchange");
    var fun;
    if (strlink.indexOf("(")>=0)
    {
    fun = strlink.substring(strlink.indexOf("(")+2,strlink.length-2);
    }
    eval(QuotForm42(fun));*/


    //ѡ���¼�
    //onselchangeID.fire(oEvent);

    //modify by liuxr at �޸�Ϊֱ��ִ��onchange����	

    eval($id(this.id).getAttribute("onselchange"));
    /*strlink = document.getElementById(this.id).getAttribute("onselchange");
    if (strlink.indexOf("(")>=0)
    {
    fun = strlink.substring(strlink.indexOf("(")+2,strlink.length-2);
    }
    eval(QuotForm42(fun));*/


    //�����յ�ѡ���¼�����WebGrid����ҳ��
    //if (oEvent.position == 88) {
    //if (this.girdposition == 88) {
    //    window.setTimeout("try {fc_czselchange()} catch (e) {} ", 10);
    //}
    //if(Sys.Browser.agent == Sys.Browser.InternetExplorer) this.fc_txtName.focus();

    //    }

}
/**
* ����ѡ���ֵ���ؼ��ϣ�2013-08-10
**/
dropdownlist.prototype.returnSelValue = function(curRow) {
    var startRow = 0;
    if (!IsSpace(this.format)) startRow++;
    if (this.addrow == "��") startRow++;
    if (this.blnempty == "��") startRow++;

    if (curRow < startRow) return;
    var retCol = 0; //���ص��к�
    if (IsSpace(this.format) || this.format.indexOf("!") < 0) {
        for (var i = 0; i < this.fc_list.rows[0].cells.length; i++) {
            if (this.fc_list.rows[0].cells[i].style.display != "none") {
                retCol = i;
                break;
            }
        }
    } else {
        //var isFind = false;
        var arrFormat = this.format.split("|");
        for (var k = 0; k < arrFormat.length; k++) {
            if (arrFormat[k].indexOf("!") < 0) continue;
            retCol = k;
            //isFind = true;
            break;
        }


    }
    var retXml = "";
    var retRowObj = curRow;
    if (this.multiselect == true) {
        var multiValue = ""; //��ѡ��ֵ
        var endCol = 0;
        if (this.fc_list.rows.length > startRow) endCol = this.fc_list.rows[startRow].cells.length - 1;
        for (var j = startRow; j < this.fc_list.rows.length; j++) {

            if (NavJs.child(this.fc_list.rows[j].cells[endCol], "INPUT", 0).checked == true) {
                var tmpV = this.fc_list.rows[j].cells[retCol].innerText;
                retXml += "<tr><td>" + tmpV + "</td></tr>";
                multiValue += tmpV + ",";
            }
        }
        if (multiValue != "") multiValue = multiValue.substring(0, multiValue.length - 1);
        this.fc_txtName.value = multiValue;
        retRowObj = multiValue.split(",");
    } else {
        var tmpV = this.fc_list.rows[curRow].cells[retCol].innerText;
        retXml += "<tr><td>" + tmpV + "</td></tr>";
        this.fc_txtName.value = tmpV;
    }
    this.value = this.fc_txtName.value;
    this.text = this.fc_txtName.value;
    $id(this.id).setAttribute("value", this.value);
    return [retXml, retRowObj];

}
/**
* ��ͬ���ֶη�ʽ����ֵ
**/
dropdownlist.prototype.CopyFieldsValue = function(curRow) {

    if (IsSpace(this.sPubFieldCol)) return false;
    //modify by shenfr ad 2010-11-15 15:19 ��uniqueID�޸�Ϊ$id(this.id)
    //var o = eval(uniqueID) ;
    var o = $id(this.id);
    var s = o.getAttribute('dataset');
    var oDs;
    var sTag = "";

    //modify by liuxr at 2010-12-14 8:45 ��grid�ϵ�cz������������czFc_grid1
    //if(IsSpace(s) && o.id != "czFc" ) return ;
    if (IsSpace(s) && o.id.indexOf("czFc_") < 0) return false;

    if (IsSpace(s) == false) {
        oDs = $obj(s);
    } else {
        oDs = $obj(o.parentNode.getAttribute("dataset")); //�ڱ��ؼ���
        sTag = "grid";
    }

    var arrField = this.sPubFieldCol.split(",");
    var l = arrField.length;
    //alert(this.fc_list.childNodes[1].rows[2].cells[0].innerHTML + "||" + this.fc_list.childNodes[1].rows[2].cells[1].innerHTML)
    
    for (var i = 0; i < l; i++) {
        if (oDs.isFieldName(arrField[i])) {
            var sValue = "";
            if (IsTrue(this.isShowTree)) {
                sValue = curRow[i]; //��ʱ,curRow��һ��[value,code]
            } else if (this.multiselect == true) {
                sValue = curRow[i];                     //��ѡʱ,curRow��һ������
                if (IsSpace(sValue))
                    sValue = "";
                else
                    sValue = sValue.substring(0, sValue.length - 1);
            } else {
                sValue = new Eapi.Str().trim(this.fc_list.rows[curRow].cells[i].innerHTML);
            }
            oDs.Field(arrField[i]).Value = sValue;
            
        }
    }
    if (sTag == "") {
        oDs.fset_cont1();
    } else {
        oDs.fset_cont();
    }
    return true;
}
//�ı���Ľ����¼�
dropdownlist.prototype.focus = function() {
	try{
	this.fc_txtName.focus();
	}catch(e){};
}
//ʧȥ�����¼�
dropdownlist.prototype.fc_txtName_onblur = function() {
	//onblurID.fire();
	eval(document.getElementById(this.id).getAttribute("onblur"));
}
//�ı���Ľ����¼�
dropdownlist.prototype.fc_txtName_onfocus = function() {

}
//����һ��ѡ���¼�
//���ı���ֵ����ǰ��
dropdownlist.prototype.fc_txtName_onchange = function() {
	var oEvent = new Object(); //createEventObject();
	oEvent.afterchangevalue=this.fc_txtName.value;
	this.value = this.fc_txtName.value;
	this.text = this.fc_txtName.value;
	//onchangeID.fire(oEvent);
	
	eval($id(this.id).getAttribute("onchange"));
	//added by liuxr at 2010-12-30 9:30 grid���������onchange�¼�
	eval($id(this.id).getAttribute("onchangeCz"));	
	//oninterchangeID.fire(oEvent);
	
	eval($id(this.id).getAttribute("oninterchange"));	
	
}
//����һ��onkeydown�¼�
/*function fc_txtName_keyCode() {
	oEvent=createEventObject();
	oEvent.afterchangevalue=fc_txtName.value;
	onkeyCodeID.fire(oEvent);
}*/
//�ı��򰴼��¼�
//����������룬��ǰ������0
dropdownlist.prototype.fc_txtName_onkeydown = function() {
    //added by liuxr at 2011-6-22 10:00 ����alt+�·�����ͻس����������б�
    this.fc_txt_onkeydown();
}
//������������keyup�¼�����
dropdownlist.prototype.fc_txtName_keyup = function() {
    var event = NavJs.getEvent();
    var keycode1 = event.keyCode;

    if (keycode1 == 37 || keycode1 == 39) return; //left right 
    if (event.shiftKey) return;
    if (this.isAutoDropWin != null && isTrue(this.isAutoDropWin))
        this.ShowDropWin();
}
//���ı���ֵ����ǰ��
dropdownlist.prototype.fc_txtName_onkeyup = function() {
    this.value = this.fc_txtName.value;
    NavJs.insertEventParam($id(this.id).getAttribute("oninterchange"));	
}
//�û�����ĸ���¼�
dropdownlist.prototype.fc_txtName_onkeypress = function() {
    var event = NavJs.getEvent();
    if (!IsTrue(this.blninput)) {
        NavJs.preventDefault(event);
    }
}
//�����¼�
dropdownlist.prototype.fc_txtName_onpaste = function() {
   	var event = NavJs.getEvent();
   	if (!IsTrue(this.blninput)) 
    {
        NavJs.preventDefault(event);
    }
	this.fc_txtName_onkeyup();
}
//�����¼�
dropdownlist.prototype.fc_txtName_oncut = function() {
	fc_txtName_onpaste();
}
//�����ͻ����е�����ť,����ز˵�
dropdownlist.prototype.fc_txtName_oncontextmenu = function() {
   	var event = NavJs.getEvent();
   	if (!IsTrue(this.blninput)) 
    {
        NavJs.preventDefault(event);
    }
}
dropdownlist.prototype.fnInitstyle = function() {
    if (IsSpace(this.top)) this.top = 0;
    if (IsSpace(this.left)) this.left = 0;
    var mleftButton = ToInt(this.width) + ToInt(this.left) - this.mwidthButton;
    var mwidthText = ToInt(this.width) - this.mwidthButton; // -ToInt(this.fc_cmdCz.style.borderLeftWidth) - ToInt(this.fc_cmdCz.style.borderRightWidth) - ToInt(this.fc_txtName.style.borderLeftWidth) - ToInt(this.fc_txtName.style.borderRightWidth) - ToInt(this.fc_txtName.style.paddingLeft) - ToInt(this.fc_txtName.style.paddingRight);

    if (mwidthText <= 0) mwidthText = 40;
    this.fc_txtName.style.top = this.top + "px";

    this.fc_txtName.style.left = this.left + "px";

    NavJs.setWidth(this.fc_txtName, mwidthText);
    NavJs.setHeight(this.fc_txtName, this.height);


    mButtonRate = 10;
    this.fc_cmdCz.style.top = this.top + "px";
    this.fc_cmdCz.style.left = mleftButton + "px";
    try {  //δ��ʼ��ʱ����쳣

    } catch (e) { }
}

//strHtmlΪ���ձ���HTML������BR��
dropdownlist.prototype.fnInit = function(strHtml) {

    var blnEnter = typeof (strHtml) != "undefined" && typeof (strHtml) != "object" && strHtml != "";
    //alert("ondocumentReady");
    //return ;

    var myObj = new Object();
    myObj = this;



    if (blnEnter == false) {

        //debugger;
        //��ԭ���ܵ�sql���
        //if(this.sql1 == "" ){
        if (IsSpace(this.sqltrans) == false) {
            this.sql1 = UnSqlPropTrans(this.sqltrans);
        }
        //}

        //��ť��Left����
        var mleftButton = parseInt(this.width) + parseInt(this.left) - this.mwidthButton;
        //�ı���Ŀ��
        var txtWidth = 0;
        //var mwidthText = this.width - this.mwidthButton;
        //��ť�Ŀ�� 
        //var mButtonWidth = 17;


        //����ٷֱ�  
        if (this.position == "static") {
            var len = this.width.length;
            //����!
            if (len != "" || typeof len != "undefined") {
                var s2 = this.width.substring(len - 1, len);
            }
            if (s2 == "%") {
                //�̶���ť�Ŀ��Ϊ17px,�༭��Ŀ��Ϊ%
                //���ڵ�Ŀ��
                var tmpW = $id(this.id).parentNode.offsetWidth;
                //�ı���Ŀ��
                txtWidth = (100 * ((tmpW * parseInt(this.width) / 100) - 17) / tmpW) + "%";


            } else {
                txtWidth = parseInt(this.width) - parseInt(this.mwidthButton);

            }
        } else {
            txtWidth = parseInt(this.width) - parseInt(this.mwidthButton);

            var mleftButton = parseInt(this.width) + parseInt(this.left) - this.mwidthButton;
        }

        //ֻ��
        var sdisabled = "";
        //�Ƿ�
        if (IsTrue(this.disabled)) {
            sdisabled = " disabled=true ";
        }
        //2013-07-26 add
        var sReadOnly = "";
        if (!IsTrue(this.blninput)) sReadOnly = " readOnly=true ";
        
        
        //����ı���Ŀ��<=0Ĭ��Ϊ40
        if (txtWidth <= 0) txtWidth = 40;
        //�ı���
        var obj_ddl = $id(this.id);

        //	var s1='<INPUT id=fc_txtName  '+ sdisabled +'  style="POSITION: '+this.position+'; TEXT-ALIGN:'+this.align+'; border-left-width:1;border-right-width:1;border-top-width:1;border-bottom-width:2;LEFT: '+this.left+'px;  TOP: '+this.top+'px; WIDTH:'+txtWidth+';HEIGHT:'+this.height+'px; font-size:'+this.fontsize+'; font-style:'+this.fontstyle+'; font-family:'+this.fontfamily+'; background-color:'+this.backgroundColor+'; font-weight:'+this.fontweight+' ; color:'+this.color+';';
        var s1 = '<INPUT id=fc_txtName  ' + sdisabled + sReadOnly + '  style="POSITION: ' + this.position + '; LEFT: ' + this.left + 'px;  TOP: ' + this.top + 'px; WIDTH:' + txtWidth + 'px;HEIGHT:' + this.height + 'px;' + new Eapi.Css().getPart(NavJs.cssText(obj_ddl)) + ';';

        //if(visible=="��") 
        //	s1=s1+'display:none;';
        s1 = s1 + '">';
        //���հ�ť��
        //	s1=s1+'<INPUT id=fc_cmdCz type=button  '+ sdisabled +' style="BACKGROUND-IMAGE: url('+fcpubdata.path+'/fceform/images/ef_run_cz.gif);background-repeat:no-repeat;  BORDER-BOTTOM-WIDTH: 0px; BORDER-LEFT-WIDTH: 0px; BORDER-RIGHT-WIDTH: 0px; BORDER-TOP-WIDTH: 0px; HEIGHT: 18px; WIDTH: '+mButtonWidth+';POSITION: '+this.position+' ;LEFT: '+mleftButton+'; TOP: '+this.top+'px;';
        s1 = s1 + '<INPUT id=fc_cmdCz type=button class="cmdDown" onmouseover="this.className=\'cmdDown-over\'" onmouseout="this.className=\'cmdDown\'" ' + sdisabled + ' style="BORDER-BOTTOM-WIDTH: 0px; BORDER-LEFT-WIDTH: 0px; BORDER-RIGHT-WIDTH: 0px; BORDER-TOP-WIDTH: 0px; HEIGHT: 20px; WIDTH: ' + this.mwidthButton + 'px;POSITION: ' + this.position + ' ;LEFT: ' + mleftButton + 'px; TOP: ' + this.top + 'px;';

        //if(visible=="��")
        //	s1=s1+'display:none;';
        s1 = s1 + '">';



        //���ؿؼ�
        if (this.visible == "��") {
            obj_ddl.style.display = "none";
        }
        obj_ddl.innerHTML = s1;

        //�ĵ��¼�
        NavJs.addEvent(document, "onmousedown", this.hidelist, myObj);
        //�ı���Ľ����¼�
        //element.children[0].attachEvent("onfocus", fc_txtName_onfocus);
        NavJs.addEvent(obj_ddl.children[0], "onfocus", this.fc_txtName_onfocus, myObj);
        //�������ʧȥ�����¼�
        //element.children[0].attachEvent("onblur", fc_txtName_onblur);
        NavJs.addEvent(obj_ddl.children[0], "onblur", this.fc_txtName_onblur, myObj);
        //�ı����ѡ���¼�,��ѡ��ı����д�ı�ʱ�¼�
        //element.children[0].attachEvent("onchange", fc_txtName_onchange);
        NavJs.addEvent(obj_ddl.children[0], "onchange", this.fc_txtName_onchange, myObj);
        //�ı���İ����¼�
        //element.children[0].attachEvent("onkeydown", fc_txtName_onkeydown);
        //NavJs.addEvent(obj_ddl.children[0], "onkeydown", this.fc_txtName_onkeydown, myObj);
        //NavJs.addEvent(obj_ddl.children[0], "onkeyup", this.fc_txtName_keyup, myObj);
        //����ĸ���¼�,���Ʋ�������
        //element.children[0].attachEvent("onkeypress", fc_txtName_onkeypress);
        //NavJs.addEvent(obj_ddl.children[0], "onkeypress", this.fc_txtName_onkeypress, myObj);
        //�ı�������¼�
        //element.children[0].attachEvent("onpaste", fc_txtName_onpaste);
        NavJs.addEvent(obj_ddl.children[0], "onpaste", this.fc_txtName_onpaste, myObj);
        //�ı������¼�
        //element.children[0].attachEvent("oncut", fc_txtName_oncut);
        NavJs.addEvent(obj_ddl.children[0], "oncut", this.fc_txtName_oncut, myObj);
        //�����ı�������ť,����ز˵�
        //element.children[0].attachEvent("oncontextmenu", fc_txtName_oncontextmenu);
        NavJs.addEvent(obj_ddl.children[0], "oncontextmenu", this.fc_txtName_oncontextmenu, myObj);
        //�ı����˫���¼�
        //element.children[0].attachEvent("ondblclick",dblclick_cmdCz_onclick);
        NavJs.addEvent(obj_ddl.children[0], "ondblclick", this.dblclick_cmdCz_onclick, myObj);
        //���հ�ť�ĵ���¼�
        //element.children[1].attachEvent("onclick", fc_cmdCz_onclick);
        NavJs.addEvent(obj_ddl.children[1], "onclick", this.fc_cmdCz_onclick, myObj);
        //�ı���
        this.fc_txtName = obj_ddl.children[0];
        this.value = this.fc_txtName.value;
        this.text = this.fc_txtName.value;
        this.txt = this.fc_txtName;

        //���հ�ť
        this.fc_cmdCz = obj_ddl.children[1];
        this.createDropWin();
        //div
        this.fc_divList = $id("fc_divList"); //element.children[2];
        //��ҳ���
        this.fc_divListPage = $id("fc_divListPage"); //element.children[3];
        //��һҳ
        this.upsidepage = $id("upsidepage"); //element.children[3].children[0].children[0].children[0].children[0];
        //
        this.currentpage = $id("currentpage"); //element.children[3].children[0].children[0].children[1].children[0];
        //��һҳ
        this.nextpage = $id("nextpage"); //element.children[3].children[0].children[0].children[2].children[0];
        //�ӷ�ҳ�¼�
        //upsidepage.attachEvent("onclick", PrevPage);
        NavJs.addEvent(this.upsidepage, "onclick", this.PrevPage, myObj);
        //nextpage.attachEvent("onclick", NextPage);
        NavJs.addEvent(this.nextpage, "onclick", this.NextPage, myObj);
        if (this.position == "static") {
            //fc_txtName.attachEvent( "onresize",txt_onresize);
            NavJs.addEvent(this.fc_txtName, "onclick", this.txt_onresize, myObj);
        }

    } //
    if (blnEnter) {
        var sTMP = "auto";
        //	    if (isShowTree == "1") sTMP = "no";
        //��һ��iframe����������
        this.fc_divList.innerHTML = '<iframe id=fc_ifra style="WIDTH:100%; height:100%;border-Bottom:1 #818080 solid;border-Left:1 #818080 solid; border-right:1 #818080 solid; z-index:99999;" NORESIZE=NORESIZE SCROLLING=' + sTMP + ' MARGINWIDTH=0 MARGINHEIGHT=0 FRAMESPACING=0 FRAMEBORDER=0></iframe>';
        //�� SCROLLING=auto ��������ʱ��ճ���������λ��.

        var obj_ifra;
        var obj_dom;
        if (navigator.appName.indexOf("Explorer") > -1) {
            obj_dom = window.frames["fc_ifra"].document;
        }
        else {
            obj_ifra = window.document.getElementById('fc_ifra');
            obj_dom = (obj_ifra.document) ? obj_ifra.document : obj_ifra.contentDocument;
        }

        //��
        obj_dom.open();
        //��iframe��ֵ
        var skins = fcpubdata.skins;
        if (skins == "") skins = "base"; //Ĭ��ֵ
        var strAdd = '<!Doctype html><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />'; //���ϱ�׼ģʽ 2013-04-27 
        if (IsTrue(this.isShowTree)) {
            strAdd = '<script src="../../fceform/js/MicrosoftAjax.js" charset="' + fcpubdata.encoding + '"></scr' + 'ipt><script src="../../fceform/js/fcpub.js" charset="' + fcpubdata.encoding + '"></scr' + 'ipt><script src="../../fceform/js/fcrundj.js" charset="' + fcpubdata.encoding + '"></scr' + 'ipt><script src="../../fceform/js/xtree.js" charset="' + fcpubdata.encoding + '"></scr' + 'ipt><link type="text/css" rel="stylesheet" href="' + fcpubdata.path + fcpubdata.skinsPath + '/css/xtree.css" /><link type="text/css" rel="stylesheet" href="' + fcpubdata.path + fcpubdata.skinsPath + '/css/efdesign.css" />';

        }
        strAdd = strAdd + '<STYLE> td { word-break: break-all;overflow:hidden;}</STYLE>'; //2013-07-12 my add �Է���ʾ���������
        strAdd = strAdd + '<LINK REL=stylesheet HREF="' + fcpubdata.path + fcpubdata.skinsPath + '/css/skins/' + skins + '/style/efiframe.css" type="text/css">'
        strAdd += "</head>";
        strAdd += strHtml;
        strAdd += "</html>";

        obj_dom.write(strAdd);

        //added by liuxr at 2010-11-26 16:20 ��iframe������TD����ʽ
       // var htmlcss = "<style type=\"text/css\">td{ white-space: nowrap;overflow:hidden; }</style>"
       // NavJs.insertHtml('AfterBegin', obj_dom.getElementsByTagName('head')[0], htmlcss);


        //�ر�
        obj_dom.close();

        //alert(('fc_ifra').innerHTML);
        if (IsTrue(this.isShowTree) == false) {
            //�������е����ݱ�
            //fc_list=window.frames["fc_ifra"].document.all.fc_list;
            this.fc_list = obj_dom.getElementById("fc_list");
            //fc_list.attachEvent("onmouseover", fc_listonmouseover);
            NavJs.addEvent(this.fc_list, "onmouseover", this.fc_listonmouse, myObj);
            ///fc_list.attachEvent("onmouseout", fc_listonmouseout);
            NavJs.addEvent(this.fc_list, "onmouseout", this.fc_listonmouse, myObj);
            //������¼�����ѡ�е�һ�м�¼ֵ���ص��ı���
            //fc_list.attachEvent("onclick", cmdreturn_onclick);
            NavJs.addEvent(this.fc_list, "onclick", this.cmdreturn_onclick, myObj);
            //���İ����¼�
            //fc_list.attachEvent("onkeydown", tab_onkeydown);
            NavJs.addEvent(this.fc_list, "onkeydown", this.tab_onkeydown, myObj);
        } else {
            var objTree = obj_dom.getElementById("dropdownTree");
            NavJs.addEvent(objTree, "onclick", this.treeReturn, myObj);
        }
    }

}
//tab�����¼�
dropdownlist.prototype.tab_onkeydown = function() {
    ///ָ��һ�����ڰ��¼���Codeֵ
    var event = NavJs.getEvent("fc_ifra");
    var iEvent = event.keyCode;
    //var oMouseout=window.frames("fc_ifra").event.srcElement

    var ArrFormat = this.format.split("|");
    //����ѭ��
    //���¼�ͷ,
    for (var i = 2; i < this.fc_list.rows.length; i++) {
        //�ϼ�ͷ
        if (iEvent == '38') {
            //ָ��һ������û�з���ֵ�����ƹ�����������
            //window.frames["fc_ifra"].event.returnValue = false;
            NavJs.preventDefault(event);
            //�ҵ�����Ϊ��ɫ��һ�м�¼ ;
            if (this.fc_list.rows[i].style.color == 'red') {
                this.fc_list.rows[i - 1].style.color = 'red';
                this.fc_list.rows[i].style.color = 'black';
                this.fc_list.rows[i - 1].style.backgroundColor = "blue";
                //ʹ���ĵ��Ƴɰ�����
                if (this.fc_list.rows[i - 2].style.backgroundColor == "#eeffee") {
                    this.fc_list.rows[i].style.backgroundColor = "#eeffee";
                } else {
                    this.fc_list.rows[i].style.backgroundColor = "";
                }
            }

        }
    }
    //���¼�ͷ
    for (var i = 0; i < this.fc_list.rows.length - 1; i++) {
        //�¼�ͷ
        if (iEvent == '40') {
            //ָ��һ������û�з���ֵ�����ƹ�����������
            //window.frames["fc_ifra"].event.returnValue = false;
            NavJs.preventDefault(event);
            //�ҳ�����Ϊ��ɫ��һ��
            if (this.fc_list.rows[i].style.color == 'red') {
                //������Ϊ��ɫ����һ�и�Ϊ��ɫ
                this.fc_list.rows[i + 1].style.color = 'red';
                this.fc_list.rows[i].style.color = 'black';
                this.fc_list.rows[i + 1].style.backgroundColor = "blue";
                //ʹ���ĵ��Ƴɰ�����
                if (this.fc_list.rows[i - 1].style.backgroundColor == "#eeffee") {
                    this.fc_list.rows[i].style.backgroundColor = "";
                } else {
                    this.fc_list.rows[i].style.backgroundColor = "#eeffee";
                }
                //this.fc_list.rows(i).style.backgroundColor=this.oldgroundcolor
                //this.fc_list.rows(i).style.color=this.oldcolor
                break;
            }
        }
    }
    //���س���,��ѡ��һ��ֵ���ظ��ı���
    for (var j = 0; j < this.fc_list.rows.length; j++) {
        //�س���
        if (iEvent == "13") {
            //�ҵ��������һ��
            if (this.fc_list.rows[j].style.color == "red") {
                for (var k = 0; k < ArrFormat.length; k++) {
                    //�Ƿ��У������У����û���򷵻ص�һ�е�����һ��															
                    if (ArrFormat[k].indexOf("!") != -1) {
                        this.fc_txtName.value = NavJs.innerText(this.fc_list.rows[j].cells[k]); //.innerText ;
                        this.value = this.fc_txtName.value;
                        this.text = this.fc_txtName.value;
                    } else {
                        this.fc_txtName.value = NavJs.innerText(this.fc_list.rows[j].cells[0]); //.innerText;
                        this.value = this.fc_txtName.value;
                        this.text = this.fc_txtName.value;
                    }
                }
                //ֵ�����ı���󣬰�����������
                //alert("empty3");
                this.fc_divList.style.display = "none";
                this.fc_divList.innerHTML = "";
                //��ҳ�������
                this.fc_divListPage.style.display = "none";
                this.fc_txtName.disabled = false;
                //��ֵ���ı���
                this.fc_txtName_onkeyup();

                //onchangeID.fire(oEvent);
                eval($id(this.id).getAttribute("onchange"));
                //added by liuxr at 2010-12-30 9:30 grid���������onchange�¼�
                eval($id(this.id).getAttribute("onchangeCz"));

                //onselchangeID.fire(oEvent);
                eval($id(this.id).getAttribute("onselchange"));
                //�����յ�ѡ���¼�����WebGrid����ҳ��
                //if (this.girdposition == 88) {
                //	window.setTimeout("try {fc_czselchange()} catch (e) {} ", 10);
                //}
                //this.fc_txtName.focus() ;
                try {
                    this.fc_txtName.focus();
                } catch (e) { }
            }
        }
    }
    //pageup��
    if (iEvent == "33") {
        //window.frames["fc_ifra"].event.returnValue = false;
        NavJs.preventDefault(event);
        if (this.currentpage.value == 1) return;
        this.PrevPage();
        this.fc_list.focus();
    }
    //pagedown��
    if (iEvent == "34") {
        //window.frames["fc_ifra"].event.returnValue = false;
        NavJs.preventDefault(event);
        if (this.currentpage.value == this.overallpagenum) return;
        this.NextPage();
        this.fc_list.focus();
    }
}
//��Alt+������ͬ������հ�ťһ��Ч��
dropdownlist.prototype.fc_txt_onkeydown = function() {
    var event = NavJs.getEvent();
    //��ǰ����
    var scode = event.keyCode;
    //alt��
    var skey = event.altKey;
    if (skey == true) {
        switch (scode) {
            case 40: 
                {  //��
                    //event.returnValue = false;
                    NavJs.preventDefault(event);
                    this.fc_cmdCz_onclick();
                    //ָ��һ������,���ӽ��㲢��ʱ
                    try {
                        $win("fc_ifra").setTimeout("this.fc_list.focus();", 10);
                    } catch (e) { }
                    break;
                }
        }
    }
    //��grid����dropdownlistʱ,���õ���������.
    eval($id(this.id).getAttribute("onkeydownCz"));
}
/**
˫���ı��򣬵���������
**/
dropdownlist.prototype.dblclick_cmdCz_onclick = function() {
		this.fc_cmdCz_onclick();
		//ָ��һ������,���ӽ��㲢��ʱ
		try{
		    $win("fc_ifra").setTimeout("this.fc_list.focus();", 10);
		}catch(e){}

}
//�������ڵĴ�С���ı��ı���Ĵ�С�Ͱ�ť��left����
dropdownlist.prototype.txt_onresize = function() {
	//���ڵ�Ŀ��
	var s_mwidth = this.width+"";
	var len = s_mwidth.length ;
		//����!
//	if(len != "" || typeof len != "undefined") {
	if(len > 0) var s2 = s_mwidth.substring(len-1,len);
//	}
	if(s2 == "%") {
		var tmpW = parentNode.offsetWidth;
		//fc_txtName�Ŀ��
		var tmp1 = (tmpW * parseInt(this.width) /100) - 17 - 2;
		if( parseInt(this.fc_txtName.style.width) != tmp1 ) {
			this.fc_txtName.style.width = tmp1;
		}
	}
}
/**
*�ҵ�һ������ľ���λ��
**/
/*
dropdownlist.prototype.getContLeft = function(e){
	var objFirstAbs=null;//���������е�һ�����Զ�λ��Ԫ��
	var obj = e;
    var l = 0;
	while(e != null){
		if(e.style.position == "absolute"){
			if(objFirstAbs == null) objFirstAbs=e;
		}else{
			l += e.offsetLeft;
		}
		e=e.offsetParent;
	}
	
	if(objFirstAbs != null){
//		if(objFirstAbs.tagName.toUpperCase() == "DIV" && objFirstAbs.style.className != "tab-pane" ){
//		}
		if(obj.style.position == "absolute"){
			l += parseInt(obj.style.left);
		}
	}
	return l;
}
dropdownlist.prototype.getContTop = function(e){
	var objFirstAbs=null;//���������е�һ�����Զ�λ��Ԫ��
	var obj = e;
    var l = 0;
	while(e != null){
		if(e.style.position == "absolute"){
			if(objFirstAbs == null) objFirstAbs=e;
		}else{
			l += e.offsetTop;
		}
		e=e.offsetParent;
	}
	
	if(objFirstAbs != null){
//		if(objFirstAbs.tagName.toUpperCase() == "DIV" && objFirstAbs.style.className != "tab-pane" ){
//		}
		if(obj.style.position == "absolute"){
			l += parseInt(obj.style.top);
		}
	}
	return l;
}*/
/**

**/
dropdownlist.prototype.createDropWin = function() {
    //modify by shenfr ad 2010-11-15 15:19 ��uniqueID�޸�Ϊ$id(this.id)
    //var contid=eval(uniqueID+".id");
    var contid = this.id;
    if ($id("fc_divList") != null) {
        $id('fc_divListPage').contid = contid;
        return;
    }
    //������ҳ�ĵ���¼�
    var sEventNext = ""; //"eval($id('fc_divListPage').contid+'.NextPage()')";
    var sEventPrev = ""; //"eval($id('fc_divListPage').contid+'.PrevPage()')";
    //������
    var s1 = '<label id=fc_divList style="z-index:9998; DISPLAY: none; LEFT: 0px;  POSITION: absolute; TOP: 40px;'; //��background-color:white; ���ⱳ��͸����2013-06-05

    //if (Sys.Browser.agent != Sys.Browser.InternetExplorer) { //2013-07-25 ��chrome�µ���ʽ
        s1 += 'BORDER-BOTTOM: #848284 1px solid;BORDER-right: #848284 1px solid;BORDER-top: #848284 1px solid;BORDER-left: #848284 1px solid;';
   // }



    s1 = s1 + '" ></label>';
    //��ҳ���ܱ��
    s1 = s1 + '<table border=0 id=fc_divListPage style="z-index:9999;DISPLAY: none; LEFT: 72px; POSITION: absolute; TOP: 157px"  cellPadding=0 cellSpacing=0>';
    s1 = s1 + '<tr><td><INPUT type="button" value="��" id=upsidepage style="BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; BORDER-TOP: 1px solid; HEIGHT: 18px; WIDTH: 18px" value="��" onclick="' + sEventPrev + '" ></td>';
    s1 = s1 + '<td><INPUT id=currentpage style="BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; BORDER-TOP: 1px solid; HEIGHT: 18px; TEXT-ALIGN: center; WIDTH: 18px" ></td>';
    s1 = s1 + '<td><INPUT type="button" value="��" id=nextpage style="BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; BORDER-TOP: 1px solid; HEIGHT: 18px; WIDTH: 18px" value="��" onclick="' + sEventNext + '" ></td></tr></table>';

    //firefox������insertAdjacentHTML����
    //window.document.body.insertAdjacentHTML("BeforeEnd", s1);
    NavJs.insertHtml("BeforeEnd", window.document.body, s1);

    $id('fc_divListPage').contid = contid;
}


/**
*@para obj ���ؼ���HTML�еĶ���
* ȡ���ؼ���ѡ�е�ֵ 2011-01-11
**/
dropdownlist.prototype.getTreeSelNodeValue = function() {
    var objRet = null;
    var obj = $id("dropdownTree", $win("fc_ifra")); // window.frames("fc_ifra").$id("dropdownTree");
    var sValue = "";
    var sCode = "";

    if (obj.getAttribute("ischecked") == "1" || obj.getAttribute("ischecked") == "��") {
        var arr = $win("fc_ifra").TreeGetMultiValue(obj);
        if (arr != null) {
            for (var i = 0; i < arr.length; i++) {
                sCode += arr[i].code + ",";
                sValue += arr[i].text + ",";
            }
            if (arr.length > 0) {
                sCode = sCode.substring(0, sCode.length - 1);
                sValue = sValue.substring(0, sValue.length - 1);
            }
            objRet = [sValue, sCode];
        }

    } else {
        objRet = [$win("fc_ifra").Global.selectedItem.text, $win("fc_ifra").Global.selectedItem.code];
    }
    return objRet;
}

/**
* �������ؼ�ʱ,���غ���
**/
dropdownlist.prototype.treeReturn = function() {
    var oEvent = NavJs.getEventObj("fc_ifra"); // = window.frames("fc_ifra").event.srcElement;
    //alert(oEvent.outerHTML);
    if (oEvent.tagName != "A") {

        //alert(window.frames("fc_ifra").getTreeSelNodeValue()[0])
        return;
    }
    var arrValues = this.getTreeSelNodeValue();
    if (arrValues == null) return;
    var bool = this.CopyFieldsValue(arrValues);
    //if (bool == false) {
    this.fc_txtName.value = arrValues[0];
    //}

    this.fc_divList.style.display = "none";
    this.fc_divList.innerHTML = "";
    //���ı���ֵ����ǰ��
    var oEvent = new Object();
    oEvent.afterchangevalue = this.fc_txtName.value;
    //ѡ����д�¼�
    //onchangeID.fire(oEvent);
    eval($id(this.id).getAttribute("onchange"));
    //added by liuxr at 2010-12-30 9:30 grid���������onchange�¼�
    eval(document.getElementById(this.id).getAttribute("onchangeCz"));
    
    //ѡ���¼�
    //onselchangeID.fire(oEvent);
    eval($id(this.id).getAttribute("onselchange"));

    //�����յ�ѡ���¼�����WebGrid����ҳ��
    //if (oEvent.position == 88) {
    //if (this.girdposition == 88) {
    //    window.setTimeout("try {fc_czselchange()} catch (e) {} ", 10);
    //}

    this.fc_txtName.focus();


}
