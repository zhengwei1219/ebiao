///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

function dropdownlist(obj)
{
    this.id = obj;
    //my 新加的
    this.isAutoDropWin = false; //="是"时按键时自动弹出下拉窗口
    
    this.datasourceName = ""; //数据源名称
    this.isShowTree = 0; //是否显示树,=1/0 =1表示显示树
    this.isTreeNewSql = 0; //是否是新格式的SQL, =1/0
    //-------------------
    //this.ConnectString=""; //调用外部数据源时的连接串
    this.left = $id(this.id).getAttribute("left");  //控件的Left属性
    this.top = $id(this.id).getAttribute("top");      //控件的top属性
    this.height = $id(this.id).getAttribute("height");  //控件的高度属性
    //if (this.height == null) this.height = ToInt($id(this.id).style.height);
    this.width = $id(this.id).getAttribute("width");      //控件的宽度属性
    
    //字体大小
//    this.fontsize = $id(this.id).getAttribute("fontsize");
//    this.fontfamily = $id(this.id).getAttribute("fontfamily");  //字体名称
//    this.fontstyle = $id(this.id).getAttribute("fontstyle");      //字体类型
//    this.backgroundColor = $id(this.id).getAttribute("backgroundColor");  //背景色
//    this.color = $id(this.id).getAttribute("color");                               //字体颜色
//    this.fontweight = $id(this.id).getAttribute("fontweight");    //是否为粗体
//    this.Url;//
    this.sqltrans = $id(this.id).getAttribute("sqltrans");     //加密后的SQL语句
    this.sql1=$id(this.id).getAttribute("sql1");//控件参照的Sql语句
    
    //this.sql2="";   //没有 用到
    this.pagesize = 50;    //50一页的行数
    this.format = $id(this.id).getAttribute("format");            //标题属性
    if (this.format == null) this.format = "";
    
    this.multiselect = IsTrue($id(this.id).getAttribute("multiselect")); //多选属性
    this.returnxml = "<root>"; //返回XML
    this.value="";    //返回文本框的Value值
    this.text="";         //返回文本框的显示值
    this.position = $id(this.id).getAttribute("position");  // 控件的坐标属性position
    //this.align = $id(this.id).getAttribute("align"); //对齐方式
    this.FieldNameList; // 字段名列表,以,分隔,用于常数数据源时设置字段名列表
    this.ParentPos = $id(this.id).getAttribute("ParentPos");
    //是否可见
    this.visible=$id(this.id).getAttribute("visible");
    this.disabled = $id(this.id).getAttribute("disabled"); //是否活动
    this.addrow = $id(this.id).getAttribute("addrow");        //点击新增行,打开一张表单,给文本框赋值
    this.blninput = $id(this.id).getAttribute("blninput"); //获取能否在文本框中直接输入属性值
    //要加一控制点界面上别处是否隐藏的属性

    //是否有空行属性
    this.blnempty=$id(this.id).getAttribute("blnempty");
    //单纯的XML数据作数据源
    this.xml = $id(this.id).getAttribute("xml");
   
    //设置value属性为哪一列
    this.keycol=0; //keycol用于当前显示名称，而要取得ID列，比如ID列在第2列，则keycol=2
    //返回参照的表格
    //this.tab; //下拉框ID
    this.fc_list;
    this.txt;
    //返回当前选择的表格行号
    //this.selectrow=0;
    //返回第一个非空的列表值,此属性应在各属性后方能取出
    //this.firstvalue=""; // not do
    this.dataset = $id(this.id).getAttribute("dataset");
    this.field = $id(this.id).getAttribute("field");

    this.sPubFieldCol = "" ; //全局变量,保存用逗号分隔的字段名列表

    this.fc_txtName;  //文本框
    this.fc_cmdCz;	//参照按钮
    this.fc_divList ; //div控件
    this.fc_divListPage;	//翻页功能,表格ID
    this.upsidepage;  //翻页按钮,上一页
    this.currentpage ;//翻页功能,文本框
    this.nextpage;    //下一页
    this.mwidthButton=17; //按钮宽度
    //this.mLoadXmlData="" ;	//保存装入的XML数据

    this.runtimesql="";//当前SQL语句
    this.runtimetext="";//过滤时的过滤条件
    this.findrownum=0;  //鼠标在下拉框的哪一行
    //this.findrowbgcolor="";//在找到该行并将该行背景色设置为"blue"之前,将此行的斑马色保存在该变量中,以便在鼠标移动时,将该色附回;
    this.perpagenum=1;//页号
    this.overallpagenum=1; //总页
    //this.Strsend="";	//"<root><percolnum>"+perpagenum+"</percolnum><sql>"+sSql+"</sql></root>"
    this.sXml=""	;//<root><rec><fc>aaaa</fc><fc>222</fc></rec><rec><fc>wwww</fc><fc>2322</fc></rec><rec><fc>eeee</fc><fc>5222</fc></rec><rec><fc>ddd</fc><fc>1222</fc></rec><rec><fc>sss</fc><fc>2232</fc></rec></root>
    //this.tabcolnum=1;//表格的总列数,它等于format分解后数组的个数.
    //是否返回多列值(多列值用数组分开,要返回的列在列串的最后一个字符为!)
    //用此串代表每列的标题\宽度\是否隐藏\对齐方式等信息
    //标题为空时隐藏
    //每列第一个字符表示对齐方式"<,^,>"
    //this.dblClick=false;
    //this.oldgroundcolor="";
    //this.oldcolor="";
    //this.changcol=0;//在第一行设置列宽时选择的是哪一列
    //this.formerLineleft=0;
    //this.moveQuantity=0;
    this.gridposition = 0;      //added by liuxr at 2010-11-23 16:30 grid控件使用

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


//文本框的焦点
dropdownlist.prototype.onfocus = function() {
	this.fc_txtName.focus();
}
//设置控件left属性值
dropdownlist.prototype.fnPutleft = function(vValue)
{
	this.left=vValue;
	this.fnInitstyle();　　//初实化函数
}
//设置控件top属性值
dropdownlist.prototype.fnPuttop = function(vValue)
{
	this.top=vValue;
	this.fnInitstyle();
}
//设置控件高度属性值
dropdownlist.prototype.fnPutheight = function(vValue)
{
	this.height=vValue;
	this.fnInitstyle();
}

//设置控件宽度属性值
dropdownlist.prototype.fnPutwidth = function(vValue)
{	
	this.width=vValue;
	this.fnInitstyle();
	//try{
	//	fnInit();
	//}catch(e){}
}

// 多选开关
dropdownlist.prototype.fnPutmultiselect = function(vValue)
{
	//此属性为字符型 ,是否增加多选列，是为多选
	if (vValue=="是")
		this.multiselect=true;
	else
		this.multiselect=false;
}
//设置文本框的value属性
dropdownlist.prototype.fnPutvalue = function(vValue)
{
	//当没设置keycol时，value属性将和text属性一样
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
    //当没设置keycol时，value属性将和text属性一样
    if (this.keycol == 0)
        this.value = fc_txtName.value;
    return this.value;
}
//设置可见属性值
dropdownlist.prototype.fnPutvisible = function(vValue)
{
	this.visible=vValue;
	try {
	//是否显示下拉框，为是显示
	//modify by shenfr ad 2010-11-15 15:19 将uniqueID修改为$id(this.id)
		//eval(uniqueID).style.display = this.visible == "是"?"":"none";
		$id(this.id).style.display = this.visible == "是"?"":"none";
	}catch(e){}
}

//设置只读属性值
dropdownlist.prototype.fnPutdisabled = function(vValue)
{
    this.disabled = vValue;
	try{
	if(typeof this.fc_txtName != "undefined") {
		//控件是否活动,文本框和按钮控件为不活动,否则移除disabled属性
	    if (IsTrue(this.disabled)) {
			this.fc_txtName.disabled=true;
			this.fc_cmdCz.disabled=true;
		}else {
			//移除只读属性
			this.fc_txtName.removeAttribute("disabled");
			this.fc_cmdCz.removeAttribute("disabled");
		}
	}
	}catch(e){}
}

/**
* 在本窗口的其它地方mousedown时，隐藏下拉列表
**/
dropdownlist.prototype.hidelist = function() {
    //当前对象
    var event = NavJs.getEvent();
    var curObj = event.srcElement || event.target;   //当前控件

    var objSour = curObj;
    if (curObj.tagName == "TD") {
        //对象的父节点
        curObj = curObj.parentNode;
        curObj = curObj.parentNode;
        curObj = curObj.parentNode;
    }
    if (curObj.tagName == "TR") {
        curObj = curObj.parentNode;
        curObj = curObj.parentNode;
    }
    //window.status=curObj.id ||  || curObj.id=="fc_cmdCz"curObj.id=="fc_txtName"  || 

    //当前控件id等于其中一个返回
    if (curObj.id == "fc_list" || curObj.id == "fc_divList" || curObj.id == "upsidepage" || curObj.id == "currentpage" || curObj.id == "nextpage") return;

    //多选时的复选框
    if (curObj.tagName == "INPUT") {
        curObj = curObj.parentNode;
        if (curObj.tagName == "TD") {
            curObj = curObj.parentNode;
            curObj = curObj.parentNode;
            curObj = curObj.parentNode;
            if (curObj.id == "fc_list") return;
        }
    }
    //当前控件id是否等于eval(uniqueID+".id"),如果不等于,下拉框隐藏
    //modify by shenfr ad 2010-11-15 15:19 将uniqueID修改为$id(this.id)
    //if(curObj.id != eval(uniqueID+".id") ) {

    if (curObj.id != this.id) {  //取当前选中的控件id
        //alert("empty4");
        if (objSour.id != "fc_cmdCz") {

            this.fc_divList.style.display = "none";
            //this.fc_divList.style.backgroundColor = "transparent";
            this.fc_divList.innerHTML = "";

            this.fc_divListPage.style.display = "none";

        }
    }
    //if ( curObj.id==element.id) return;
    //要加一控制点界面上别处是否隐藏的属性


}
//----------------------------

//初始化函数
dropdownlist.prototype.init = function() {
    //modify by liuxr at 2009-12-16 14:11 初始化内容前清空全局字段列表的值。
    this.sPubFieldCol = "";
    var fc_list_width = 0; //表格的各列列宽之和
    var maxWinHeight = 250; //最大的下拉窗口高度,最小高度是150
    //
    var ArrFormat = this.format.split("|");
    //format属性的长度,标题的长度
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

    var recCount = oXML.documentElement.childNodes.length - 3; //下拉列表的记录数，
    var contentCols = 1; //由xml内容计算出的列数，它含有多选列。
    if (recCount > 0) {
        contentCols = oXML.documentElement.childNodes[0].childNodes.length;
    }

    var multiStr = ""; //给常数数据源加上多选功能， 2013-08-09
    if (this.multiselect) {
        multiStr = "<td style='width:20px'><input type='checkbox' /></td>";

    }

    //sXml是表格数据
    //计算表格串
    //记录数
    var lngchildNodeone = oXML.documentElement.childNodes.length;
    //sql语句作数据源时
    if (IsSpace(this.sql1) == false) {
        //my add 2013-06-20
        if (lngchildNodeone > 3 && oXML.documentElement.childNodes[0].childNodes.length == 1 && iTitleLen == 1) {
            iTitleLenBak = 1;
        }


        //
        //this.sPubFieldCol = oXML.documentElement.childNodes(lngchildNodeone).text;
        this.sPubFieldCol = NavJs.textContent(oXML.documentElement.childNodes[lngchildNodeone-1])
        //

    } else { //常数数据源时
        this.sPubFieldCol = this.FieldNameList; //逗号分隔的字段名,用于字段同名传递

    }
    lngchildNodeone--; //因加了一个fields子节点,所以-1
    oXML.documentElement.removeChild(oXML.documentElement.childNodes[lngchildNodeone]);
    //alert(lngchildNodeone)
    //标题的长度
    //var iTitleLen = this.tabcolnum;    //parseInt(oXML.childNodes(0).childNodes(0).childNodes .length)
    //列数
    //var col_len = oXML.documentElement.childNodes[0].childNodes.length;

    //loadtab为参照内容表格的前面数据。
    //下拉表格 borderColor=#B8B7B7
    var loadtab = "<table border=1 id=fc_list  cellPadding=0 cellSpacing=0  style='WIDTH:100%;BORDER-COLLAPSE: collapse;TABLE-LAYOUT: fixed;overflow:hidden;BORDER-BOTTOM: #848284 0px solid;BORDER-right: #848284 0px solid;BORDER-top: #848284 0px solid;BORDER-left: #848284 0px solid;' frame='box'>";  //overflow:hidden; 以免出现横向滚动条，2013-06-04


    loadtab += "<tr>"; //加标题行。

    var titleCols = 1; //标题行的列数。
    if (IsSpace(this.format)) {
        titleCols = contentCols;
        if (this.multiselect) {
            titleCols = contentCols - 1;
        }
    } else {
        titleCols = iTitleLen;
    }
    //增加一个<td>元素
    for (var i = 0; i < titleCols; i++) {
        loadtab += "<td></td>";
    }
    loadtab += multiStr;
    loadtab += "</tr>";

    //找到哪一行的值等于文本框的值,下拉框的哪一行
    if (lngchildNodeone != 2) {
        for (var i = 0; i < lngchildNodeone - 2; i++) {
            //Format属性的长度
            for (var k = 0; k < iTitleLen; k++) {
                //找到下拉框的哪一行值等于文本框的值,如果相等,鼠标在一当前行加1
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
    //页号
    //perpagenum=oXML.documentElement.childNodes(lngchildNodeone-1).text;
    this.perpagenum = NavJs.textContent(oXML.documentElement.childNodes[lngchildNodeone - 1]);
    //总页数
    //this.overallpagenum=oXML.documentElement.childNodes(lngchildNodeone-2).text;
    this.overallpagenum = NavJs.textContent(oXML.documentElement.childNodes[lngchildNodeone - 2]);
    //alert(this.overallpagenum)
    //intpage是一个节点
    var oChild = oXML.documentElement.childNodes[lngchildNodeone - 1];
    oXML.documentElement.removeChild(oChild);
    //pagenumber是一个节点
    oChild = oXML.documentElement.childNodes[lngchildNodeone - 2];
    oXML.documentElement.removeChild(oChild);
    //替换字符串去掉<root>节点

    this.sXml = RepStr(NavJs.xml(oXML), "<root>", "");
    //替换字符串去掉</root>节点
    this.sXml = RepStr(this.sXml, "</root>", "");

    //added by liuxr at 2009-9-9 移除CDATA
    this.sXml = RepStr(this.sXml, "<![CDATA[", "");
    this.sXml = RepStr(this.sXml, "]]></", "</");
    //转码
    this.sXml = unescape(this.sXml);
    //恢复txt的值
    var fc_txtNamebak = this.fc_txtName.value;

    this.fnInit(loadtab + this.sXml + "</table>");
    this.fc_txtName.value = fc_txtNamebak;

    this.value = this.fc_txtName.value;
    this.text = this.fc_txtName.value;
    if (IsSpace(this.format)) {
        //alert(contentCols)
        if (recCount > 0 && ((contentCols > 1 && this.multiselect == false) || (this.multiselect && contentCols > 2))) {

            dropdownlist_setColWidth(this.fc_list, 0); //隐藏第一列的内容,将id列
        }
    }
    else {
        for (var k = 0; k < iTitleLen; k++) {
            //标题为左对齐
            if (ArrFormat[k].indexOf("<") != -1) {
                //this.fc_list.childNodes[0].childNodes[k].align = "left";
                ArrFormat[k] = RepStr(ArrFormat[k], "<", "");
            }
            //标题居中对齐
            if (ArrFormat[k].indexOf("^") != -1) {
                //this.fc_list.childNodes[0].childNodes[k].align = "middle";
                ArrFormat[k] = RepStr(ArrFormat[k], "^", "");
            }
            //标题是否为空，如果为空，第一行宽度为0
            if ((ArrFormat[k] == "" || ArrFormat[k] == "!") && (this.format != "")) { //&& Sys.Browser.agent == Sys.Browser.InternetExplorer
                //            this.fc_list.childNodes[0].childNodes[k].style.visibility = "collapse";
                //            this.fc_list.childNodes[0].childNodes[k].style.overflow = "hidden";
                //            this.fc_list.childNodes[0].childNodes[k].style.width = "0px";
                //            //this.fc_list.childNodes[0].childNodes[k].style.display = "none";
                //this.fc_list.rows[0].cells[k].style.display = "none";
                dropdownlist_setColWidth(this.fc_list, k);
            }
            //标题右对齐
            if (ArrFormat[k].indexOf(">") != -1) {
                // this.fc_list.childNodes[0].childNodes[k].align = "right";
                ArrFormat[k] = RepStr(ArrFormat[k], ">", "");
            }
            //标题是否包含！符号，如果有！符号，替换！=""
            if (ArrFormat[k].indexOf("!") != -1) {
                ArrFormat[k] = RepStr(ArrFormat[k], "!", "");
            }
            //标题的0行的一列等于ArrFormat[k]
            try {
                //this.fc_list.rows[0].cells[k].innerText = ArrFormat[k];
                NavJs.innerText(this.fc_list.rows[0].cells[k], ArrFormat[k]);
            } catch (e) { }
            //标题是否为空,计算标题行的宽度
            var itmp = parseInt(ArrFormat[k].length) * 15; //+2 //+17 ;POSITION
            //alert(k + "-" + iTitleLen)
            //防止常数可选项,多选,标题为空时,显示列宽不正常, 22 为checkbox的列宽, 2012-07-09 my add
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
            //this.fc_list.childNodes[1].childNodes[col_len].style.width=22; //给checkbox的列宽
            //this.fc_list.childNodes[0].childNodes[iTitleLen].style.width = "22px"; //给checkbox的列宽
            //dropdownlist_setColWidth(this.fc_list, iTitleLen, 22);
            fc_list_width += 22;
        }
    }
    //标题居中
    this.fc_list.rows[0].align = "middle";

    //摆好控件的位置
    //初始化下拉表列的内容
    //计算下拉表列的宽度
    //使表格的底纹成斑马纹
    //for (var i=1;i<this.fc_list.rows.length;i=i+2){
    /*for (var i=1;i<this.fc_list.rows.length;i++){
    if (i % 2 == 0)
    this.fc_list.rows[i].style.backgroundColor="#eeffee";
    else
    this.fc_list.rows[i].style.backgroundColor="#ffffff";
    }*/
    var iTwo = 2;
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer) iTwo = 1; //在谷歌中,背景未设置时会透明.所以去掉斑马纹效果
    iTwo = 1; //背景未设置时会透明.所以去掉斑马纹效果

    for (var i = 1; i < this.fc_list.rows.length; i = i + iTwo) {
        NavJs.setClassName(this.fc_list.rows[i], "pertworow");
    }
    //将找到的行变颜色

    if (this.fc_list.rows.length > this.findrownum) {
        //找到鼠标在的当前行,改变当前行的字体颜色和背景色
        if (parseInt(this.findrownum) != 0) {
            //this.findrowbgcolor = this.fc_list.rows[this.findrownum].style.backgroundColor;
            //this.oldgroundcolor = this.fc_list.rows[this.findrownum].style.backgroundColor;
            //改变表格findrownum行的背景色
            //this.fc_list.rows[this.findrownum].style.backgroundColor = "blue";
            //表格的findrownum行字体变红色
            //this.fc_list.rows[this.findrownum].style.color="red";
            NavJs.setClassName(this.fc_list.rows[this.findrownum], "findrow");

            //div的高度
            this.fc_divList.scrollTop = this.fc_list.rows[this.findrownum].offsetTop;
        }
        /*else{
        //表格第一行的字体改为红色
        try{
        this.fc_list.rows[1].style.color="red";
        this.fc_list.rows[1].style.backgroundColor="blue";
        }catch(e){}
        }*/

    }

    //第一行底色为灰色,标题行有凹凸感
    var sl = this.fc_list.rows[0].cells.length;
    //标题的样式
    NavJs.setClassName(this.fc_list.rows[0], "firstrow");

    //	for(i=0;i<sl;i++){
    //		this.fc_list.rows[0].cells[i].style.cssText="border-left:1px solid white; border-top: 2px solid white; border-bottom: 1px solid #818080; border-right:1px solid #B8B7B7;background-color: #D3D3D3;";
    //	}
    var iTopOffset = 0;
    //如果标题行为空,隐藏第一行的内容
    if (this.format == "") {
        this.fc_list.rows[0].style.display = "none";
        iTopOffset = -2;
        //固定隐藏第一列的内容，2013-04-27
        //if (iTitleLen == 1 && iTitleLenBak == 2) {
        //    dropdownlist_setColWidth(this.fc_list, 0);
        //for (var kk = 0; kk < this.fc_list.rows.length; kk++) {
        //if (Sys.Browser.agent == Sys.Browser.InternetExplorer)
        // this.fc_list.rows[kk].cells[0].style.display = "none";
        //else
        //    this.fc_list.rows[kk].cells[0].style.width = "0px"; //不用此则在chrome下列宽计算不对，2013-06-05
        //this.fc_list.rows[kk].cells[1].style.width = "100%";
        //}
        // }
    }

    //显示div
    this.fc_divList.style.display = "block";
    //计算下拉框的宽高.
    //如果没有滚动条,div的宽度加17
    var iScrollWidth = 17;

    //alert(this.fc_list.offsetHeight);
    if (this.fc_list.offsetHeight < maxWinHeight) { //maxWinHeight是最大的下拉窗口的高度
        $id("fc_ifra").style.height = (this.fc_list.offsetHeight + 0) + "px";
        this.fc_divList.style.height = $id("fc_ifra").style.height;
        iScrollWidth = 0;
    } else {
        $id("fc_ifra").style.height = maxWinHeight + "px";
        this.fc_divList.style.height = $id("fc_ifra").style.height;
    }
    //alert(fc_divList.offsetHeight+"aa"+fc_divList.offsetWidth);

    var iBorder = 2 + iTitleLen; //边框的差值

    var iTmpWidth = this.fc_txtName.style.width;
    iTmpWidth = ToInt(RepStr(iTmpWidth, 'px', ''));
    if (IsSpace(iTmpWidth)) iTmpWidth = this.fc_txtName.offsetWidth;

    var newWidth1 = iTmpWidth + this.fc_cmdCz.offsetWidth;
    var newWidth2 = fc_list_width + iBorder + iScrollWidth;
    this.fc_divList.style.width = newWidth1 > newWidth2 ? (newWidth1) + "px" : (newWidth2) + "px";
    //this.fc_list.style.width = (parseInt(this.fc_divList.style.width)- iBorder - iScrollWidth) + "px";  //去掉此行让宽度为100%
    //alert(this.fc_divList.offsetHeight+"aa"+this.fc_divList.offsetWidth);
    //计算fc_divList出现的位置
    this.iframeWinPos();
    //是否显示翻页按钮
    //显示页号的文本框的值
    this.currentpage.value = this.perpagenum;
    //如果总页数大于1时显示翻页按钮
    if (this.overallpagenum > 1) {
        this.fc_divListPage.style.display = "";
        this.fc_divListPage.style.top = (parseInt(this.fc_divList.style.top) + parseInt(this.fc_divList.offsetHeight) - parseInt(this.fc_divListPage.offsetHeight)) + "px";
        this.fc_divListPage.style.left = (parseInt(this.fc_divList.style.left) + 1) + "px";
        this.PageDisplayStatus();
    }
    else {
        //隐藏翻页按钮
        this.fc_divListPage.style.display = "none";
        this.fc_divListPage.style.top = (parseInt(this.fc_divList.style.top) + parseInt(this.fc_divList.offsetHeight) - parseInt(this.fc_divListPage.offsetHeight)) + "px";
        this.fc_divListPage.style.left = (parseInt(this.fc_divList.style.left) + 1) + "px";
    }
    if (this.xml != "") {
        //当数据源为常串时隐藏分页和过滤控件
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
                    oTable.rows[kk].cells[colNo].style.width = "0px"; //不用此则在chrome下列宽计算不对，2013-06-05
                //this.fc_list.rows[kk].cells[1].style.width = "100%";

                oTable.rows[kk].cells[colNo].style.display = "none";
            }
        }
    }
}
dropdownlist.prototype.iframeWinPos = function() {
    //计算fc_divList出现的位置
    var iHeight = this.fc_txtName.style.height;
    iHeight = RepStr(iHeight, 'px', '');
    if (IsSpace(iHeight)) iHeight = this.fc_txtName.offsetHeight;

    var iToptmp = getAbsTop(this.fc_txtName) + ToInt(iHeight);

    this.fc_divList.style.left = getAbsLeft(this.fc_txtName) + "px";
    var fc_divList_height = ToInt(this.fc_divList.style.height);
    var ilen = getClientSize().height - iToptmp;
    if (ilen < fc_divList_height ) {
        if (iToptmp > fc_divList_height + ToInt(this.fc_txtName.style.height)) { //显示到上面
            this.fc_divList.style.top = (iToptmp - (fc_divList_height + ToInt(this.fc_txtName.style.height))) + "px";
        } else {
            this.fc_divList.style.top = 0 + "px"; //显示在中间
        }

    } else { //正常显示到下面
        //求div显示的top坐标
        this.fc_divList.style.top = iToptmp + "px";

    }

}
/*
在下拉的表格中移动鼠标时变背景色
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
* 用新的数据显示下拉窗口
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
        sStr.append('var dropdownTree;');   //定义一个全局变量

        sStr.append('window.attachEvent( "onunload", function(){dropdownTree=null;});\r\n'); //清除内存

        sStr.append('</' + 'script>');
        //        sStr.append('<script language="JavaScript" for="onload">');
        //      sStr.append('TreeRefresh($id("dropdownTree"), "", function() { });');
        //    sStr.append('</' + 'script>');
        sStr.append('</body>');
        this.fnInit(sStr.toString());

        var baseWidth = 150;
        var newWidth1 = this.fc_txtName.offsetWidth + this.fc_cmdCz.offsetWidth;
        this.fc_divList.style.width = Math.max(baseWidth, newWidth1)+"px";
        this.fc_divList.style.height = 250+"px"; //下拉高度固定为 250.
        this.fc_divList.style.display = "";
        this.iframeWinPos();

        this.sPubFieldCol = this.FieldNameList; //逗号分隔的字段名,用于字段同名传递

        //   fc_divTreeButton.style.top = parseInt(fc_divList.style.top) + parseInt(fc_divList.offsetHeight) - parseInt(fc_divTreeButton.offsetHeight);
        //   fc_divTreeButton.style.left = parseInt(fc_divList.style.left) + 1;
        //   fc_divTreeButton.style.display = "";
        return;

    }

    //alert("bb")
    //	fc_divList.style.display ="none";
    
    //alert(this.sql1);
    //当前sql语句
    this.runtimesql = this.sql1;
    //替代打开的sql语句
    this.runtimesql = RepOpenSql(this.sql1, this.fc_txtName.value);
    strX = this.fc_txtName.value;
    runtimetext = this.fc_txtName.value;
    var Strsend = "<percolnum>" + this.perpagenum + "</percolnum><sql>" + this.runtimesql + "</sql><strValue>" + strX + "</strValue><perpagerownum>" + this.pagesize + "</perpagerownum><showcheckbox>" + this.multiselect + "</showcheckbox><blnempty>" + this.blnempty + "</blnempty><addrow>" + this.addrow + "</addrow>";
    //显示页号的文本框的值
    this.currentpage.value = this.perpagenum;
    if (this.xml == "" || this.xml == null) {
        if (this.runtimesql == "") {
            //显示参照表格并计算其位置
            this.fc_divList.style.display = "block";
            //alert("empty");
            return;
        } else {
            var sDsn = "";
            if (IsSpace(this.datasourceName) == false) sDsn = "&datasourceName=" + this.datasourceName;
            //用SQL语句生成数据
            this.sXml = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=sqltoxml" + sDsn, Strsend);
        }
    } else {
        //直接的数据源
        var s1 = "<root>" + this.xml;
        //是否有多选属性
        if (this.multiselect == true) {
            s1 = RepStr(s1, "</tr>", "<td style='width:20px' align='center' ><input type='checkbox'></input></td></tr>");
        }
        //生成数据
        //alert(s1)
        this.sXml = s1 + "<pagenumber>1</pagenumber><intpage>1</intpage><fields></fields></root>";

    }

    //初实化函数

    this.init();

}

//点击参照按钮
dropdownlist.prototype.fc_cmdCz_onclick = function() {
    //var event = getEvent();
    //var cur_obj = event.srcElement || event.target;//当前按钮对象

    this.perpagenum = 1;
    //定义对象事件onclickopen点击参照按钮，打开一张表单，如果oEvent.showlist = true则点击参照按钮时显示下拉框，为false不显示,
    var oEvent = new Object();
    //显示下拉框
    oEvent.showlist = true;
    //added by liuxr at 2010-12-29 16:50 增加onclickopen事件的调用
    //eval($id(this.id).getAttribute("onclickopen"))

    oEvent.obj = $id(this.id);

    fcpubdata.validEventObj = oEvent;
    var sClickOpen = $id(this.id).getAttribute("onclickopen");
    if (!IsSpace(sClickOpen)) {
        oEvent.showlist = false;
        this.fc_divList.style.display = "none"; //强行关闭下拉窗口，免得弹出两个下拉窗口（一个是日期），2013-08-16
        eval(sClickOpen);
    }
    
    fcpubdata.validEventObj = null;
    var bShowList = oEvent.showlist;
    //onclickopenID.fire(oEvent);
    if (typeof oEvent.ret != "undefined") {
        this.fc_txtName.value = oEvent.ret;
        //发生改变事件以带动表格和数据集中相应的值的改变
        var oEvent = new Object();
        oEvent.afterchangevalue = this.fc_txtName.value;

        //onchangeID.fire(oEvent1);
        eval($id(this.id).getAttribute("onchange"));
        eval($id(this.id).getAttribute("onchangeCz"));
    }
    //下拉框不显示
    if (IsSpace(bShowList) || bShowList == false) {
        return;
    }

    //文本框是否为只读,为只读返回
    if (this.fc_txtName.disabled == true) return;

    strXML = "";
    //当前sql语句
    this.runtimesql = this.sql1;
    //替代打开的sql语句
    this.runtimesql = RepOpenSql(this.sql1, this.fc_txtName.value);

    if (this.fc_divList.style.display == "none") {
        this.ShowDropWin();
        //给下拉框表格加焦点
        try {
            this.fc_list.focus(); //fc_list
        } catch (e) { }
        this.fc_divList.style.display = "block";
    } else {
        //alert(fc_divList.style.display)
        //隐藏下拉框
        this.fc_divList.style.display = "none";
        this.fc_divList.innerHTML = "";
        this.fc_divListPage.style.display = "none";
        try {
            this.fc_txtName.focus();
        } catch (e) { }


    }
}

//下一页
dropdownlist.prototype.NextPage = function() {
	//当前页号是否小于总页数
	if (this.perpagenum<this.overallpagenum){
		//打开下一页记录
		this.perpagenum=parseInt(this.perpagenum)+1;
		//显示页号的文本框的值
		this.currentpage.value =this.perpagenum;
		this.runtimesql = RepOpenSql(this.sql1,this.fc_txtName.value);
		//发到后台执行
		var Strsend="<percolnum>"+this.perpagenum+"</percolnum><sql>"+this.runtimesql+"</sql><strValue>###</strValue><pagesize>"+this.pagesize+"</pagesize><multiselect>"+this.multiselect+"</multiselect><blnempty>"+this.blnempty+"</blnempty><addrow>"+this.addrow+"</addrow>";
		var sDsn = "";
		if (IsSpace(this.datasourceName) == false) sDsn = "&datasourceName=" + this.datasourceName;

		this.sXml = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=sqltoxml" + sDsn, Strsend);

		//init() ;
		this.ShowDropWin(); //此处有问题
		this.fc_list.focus(); //给下拉框制焦点
		this.PageDisplayStatus();
	}
	//
}

//上一页
dropdownlist.prototype.PrevPage = function() {
	//如果当前页号大于1,点击时打开上一页记录
	if(this.perpagenum>1){
		//打开上一页记录
		this.perpagenum=parseInt(this.perpagenum)-1;
		//显示页号的文本框的值
		this.currentpage.value =this.perpagenum;
		//替代打开的sql语句中的
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

	//如果currentpage文本框的值等于1,上一页按钮为只读
	//alert("currentpage: " +this.currentpage.value)
	if(this.currentpage.value <= 1) {
		this.upsidepage.disabled = true ;
	}else{
		this.upsidepage.disabled = false ;
		this.upsidepage.removeAttribute("disabled") ;
	}
	//如果currentpage文本框的值等于总页数,下一页按钮为只读
	//alert("overallpagenum: " +this.overallpagenum)
	if(this.currentpage.value == this.overallpagenum) {
		this.nextpage.disabled = true ;
	}else{
		this.nextpage.disabled = false ;
		this.nextpage.removeAttribute("disabled") ;
	}
}
//全选，2013-08-10
dropdownlist.prototype.selectAll = function(isSel) {
    var startRow = 0;
    if (!IsSpace(this.format)) startRow++;
    if (this.addrow == "是") startRow++;
    if (this.blnempty == "是") startRow++;
    var endCol = 0;
    if (this.fc_list.rows.length > startRow) endCol = this.fc_list.rows[startRow].cells.length - 1;

    for (var j = startRow; j < this.fc_list.rows.length; j++) {

        NavJs.child(this.fc_list.rows[j].cells[endCol], "INPUT", 0).checked = isSel;
    }
}
//双击表格返回时
dropdownlist.prototype.cmdreturn_onclick = function() {
    //指定窗口的对象事件
    var iEvent = NavJs.getEventObj("fc_ifra");

    var rowobj;
    //加上全选，2013-08-10
    if (!IsSpace(this.format) && iEvent.tagName == "INPUT" && iEvent.parentNode.tagName == "TD" && iEvent.parentNode.parentNode.tagName == "TR" && iEvent.parentNode.parentNode.rowIndex == 0) {
        this.selectAll(iEvent.checked);
    }


    if (iEvent.tagName == "TD")
        rowobj = iEvent.parentNode;
    if (iEvent.tagName == "TR")
        rowobj = iEvent;
    if (typeof rowobj == "undefined") return;
    //var strXML = "<root>";

    //行数
    //var ss = rowobj.rowIndex;
    //增加行
    if (this.addrow == "是") {
        //ss = 1;
        if (rowobj.rowIndex == 1) {
            //创键对象事件onclickadd，条打开一张表单，难文本框赋值
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
            //隐藏下拉框
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

        //如为LOADXMLDATA
    if (this.sql1 == "" && this.xml == "") {
    //如没设置format属性//text属性固定返回第一列
    var selectrow = rowobj.rowIndex;
    this.fc_txtName.value = NavJs.innerText(this.fc_list.rows[selectrow].cells[0]); //this.fc_list.rows[this.selectrow].cells[0].innerText;
    this.value = NavJs.innerText(this.fc_list.rows[selectrow].cells[this.keycol]); //.innerText;
    this.text = this.value;
    //每列右边的第一个字符如为!表示可返回多列，影响returnxml属性
    if (this.format != "") {
    var arrFormat = this.format.split("|");
    strXML = strXML + "<tr>";
    //单选					
    for (var k = 0; k < arrFormat.length; k++) {
    if (arrFormat[k].substring(arrFormat[k].length - 1, arrFormat[k].length) == "!");
    strXML = strXML + "<td>" + NavJs.innerText(this.fc_list.rows[selectrow].cells[k]) + "</td>";
    }
    strXML = strXML + "</tr>";
    }
    } else {
    var ArrFormatnew = this.format.split("|");
    //下拉框的列数
    var nodesNumber = this.fc_list.rows[0].cells.length; //this.fc_list.childNodes[1].childNodes.length;
    //下拉框的行数	
    var rowsnum = this.fc_list.rows.length;
    if (this.multiselect == true) {

                //有多选
    var j = 1;
    //增加行的空行属性	是否等于是
    if (this.addrow == "是" && this.blnempty != "是") {
    j = 2;
    }
    if (this.addrow != "是" && this.blnempty == "是") {
    j = 2;
    }
    if (this.addrow == "是" && this.blnempty == "是") {
    j = 3;
    }

                var arrMulti = new Array(ArrFormatnew.length);
    var isCol0 = this.format.indexOf("!") == -1;

                var showxml = ""; //多选的值

                for (var i = j; i < nodesNumber; i++) {
    //my去掉nodesNumber -4
    if (this.fc_list.rows[i].cells[this.fc_list.rows[i].cells.length - 1].childNodes[0].checked == true) {
    //format属性的长度
    var Arrlength = ArrFormatnew.length;
    strXML = strXML + "<tr>";
    for (var k = 0; k < Arrlength; k++) {
    if (ArrFormatnew[k].indexOf("!") != -1 || (isCol0 && k == 0)) {
    strXML = strXML + "<td>" + NavJs.innerText(this.fc_list.rows[i].cells[k]) + "</td>";
    showxml += Trim(NavJs.innerText(this.fc_list.rows[i].cells[k])) + ",";
    }
    }
    //加上多选时,同名字段传递数据的规则的支持, 2011-06-16
    if (typeof (arrMulti[k]) == "undefined") arrMulti[k] = "";
    arrMulti[k] += new Eapi.Str().trim(this.fc_list.rows[i].cells[k].innerText) + ",";
    }
    strXML = strXML + "</tr>";
    }
    this.fc_txtName.value = showxml.substring(0, showxml.length - 1);
    this.CopyFieldsValue(arrMulti);
    //下边三行为liuxr加的
    this.value = this.fc_txtName.value;
    this.text = this.fc_txtName.value;
    }
    else {
    //单选		
    //format属性的长度			
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

        //如果控件中format属性不包括!返回第一列的值
    var slen = this.format.length;
    var m = 0;
    if (this.multiselect == false) {
    //查找format属性是否包含!符号
    for (i = 0; i < slen; i++) {
    if (this.format.substring(i, i + 1) == "!") {
    m++;
    break;
    }

            }
    if (m == 0) {
    var selectrow = rowobj.rowIndex;
    //图片属性如果为空，而在没有！符号时，返回第0列的值，不为空时，返回第一列的值
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

    //隐藏下拉框
    //alert("empty2");
    this.fc_divList.style.display = "none";
    this.fc_divList.innerHTML = "";
    this.fc_divListPage.style.display = "none";
    this.fc_txtName.disabled = false;
    //将改变后的值传到前面
    var oEvent = new Object(); //createEventObject();
    oEvent.afterchangevalue = this.fc_txtName.value;
    oEvent.returnxml = retArr[0]; //strXML;
    //选择填写事件
    //onchangeID.fire(oEvent);
    //alert("my6" + $id(this.id).getAttribute("onchange") + "(2)" + $id(this.id).getAttribute("onchangeCz") + "(3)" + $id(this.id).getAttribute("oninterchange") + "(4)" + $id(this.id).getAttribute("onselchange"))
    //modify by liuxr at 修改为直接执行onchange属性	
    eval($id(this.id).getAttribute("onchange"));

    //added by liuxr at 2010-12-30 9:30 grid的下拉框的onchange事件
    eval($id(this.id).getAttribute("onchangeCz"));

    eval($id(this.id).getAttribute("oninterchange"));
    /*var strlink = document.getElementById(this.id).getAttribute("onchange");
    var fun;
    if (strlink.indexOf("(")>=0)
    {
    fun = strlink.substring(strlink.indexOf("(")+2,strlink.length-2);
    }
    eval(QuotForm42(fun));*/


    //选择事件
    //onselchangeID.fire(oEvent);

    //modify by liuxr at 修改为直接执行onchange属性	

    eval($id(this.id).getAttribute("onselchange"));
    /*strlink = document.getElementById(this.id).getAttribute("onselchange");
    if (strlink.indexOf("(")>=0)
    {
    fun = strlink.substring(strlink.indexOf("(")+2,strlink.length-2);
    }
    eval(QuotForm42(fun));*/


    //将参照的选择事件穿过WebGrid传到页面
    //if (oEvent.position == 88) {
    //if (this.girdposition == 88) {
    //    window.setTimeout("try {fc_czselchange()} catch (e) {} ", 10);
    //}
    //if(Sys.Browser.agent == Sys.Browser.InternetExplorer) this.fc_txtName.focus();

    //    }

}
/**
* 返回选择的值到控件上，2013-08-10
**/
dropdownlist.prototype.returnSelValue = function(curRow) {
    var startRow = 0;
    if (!IsSpace(this.format)) startRow++;
    if (this.addrow == "是") startRow++;
    if (this.blnempty == "是") startRow++;

    if (curRow < startRow) return;
    var retCol = 0; //返回的列号
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
        var multiValue = ""; //多选的值
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
* 按同名字段方式返回值
**/
dropdownlist.prototype.CopyFieldsValue = function(curRow) {

    if (IsSpace(this.sPubFieldCol)) return false;
    //modify by shenfr ad 2010-11-15 15:19 将uniqueID修改为$id(this.id)
    //var o = eval(uniqueID) ;
    var o = $id(this.id);
    var s = o.getAttribute('dataset');
    var oDs;
    var sTag = "";

    //modify by liuxr at 2010-12-14 8:45 把grid上的cz改名，加上了czFc_grid1
    //if(IsSpace(s) && o.id != "czFc" ) return ;
    if (IsSpace(s) && o.id.indexOf("czFc_") < 0) return false;

    if (IsSpace(s) == false) {
        oDs = $obj(s);
    } else {
        oDs = $obj(o.parentNode.getAttribute("dataset")); //在表格控件里
        sTag = "grid";
    }

    var arrField = this.sPubFieldCol.split(",");
    var l = arrField.length;
    //alert(this.fc_list.childNodes[1].rows[2].cells[0].innerHTML + "||" + this.fc_list.childNodes[1].rows[2].cells[1].innerHTML)
    
    for (var i = 0; i < l; i++) {
        if (oDs.isFieldName(arrField[i])) {
            var sValue = "";
            if (IsTrue(this.isShowTree)) {
                sValue = curRow[i]; //树时,curRow是一个[value,code]
            } else if (this.multiselect == true) {
                sValue = curRow[i];                     //多选时,curRow是一个数组
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
//文本框的焦点事件
dropdownlist.prototype.focus = function() {
	try{
	this.fc_txtName.focus();
	}catch(e){};
}
//失去焦点事件
dropdownlist.prototype.fc_txtName_onblur = function() {
	//onblurID.fire();
	eval(document.getElementById(this.id).getAttribute("onblur"));
}
//文本框的焦点事件
dropdownlist.prototype.fc_txtName_onfocus = function() {

}
//定义一个选择事件
//将改变后的值传到前面
dropdownlist.prototype.fc_txtName_onchange = function() {
	var oEvent = new Object(); //createEventObject();
	oEvent.afterchangevalue=this.fc_txtName.value;
	this.value = this.fc_txtName.value;
	this.text = this.fc_txtName.value;
	//onchangeID.fire(oEvent);
	
	eval($id(this.id).getAttribute("onchange"));
	//added by liuxr at 2010-12-30 9:30 grid的下拉框的onchange事件
	eval($id(this.id).getAttribute("onchangeCz"));	
	//oninterchangeID.fire(oEvent);
	
	eval($id(this.id).getAttribute("oninterchange"));	
	
}
//定义一个onkeydown事件
/*function fc_txtName_keyCode() {
	oEvent=createEventObject();
	oEvent.afterchangevalue=fc_txtName.value;
	onkeyCodeID.fire(oEvent);
}*/
//文本框按键事件
//如果不能输入，当前键等于0
dropdownlist.prototype.fc_txtName_onkeydown = function() {
    //added by liuxr at 2011-6-22 10:00 增加alt+下方向键和回车键出下列列表
    this.fc_txt_onkeydown();
}
//下面是真正的keyup事件代码
dropdownlist.prototype.fc_txtName_keyup = function() {
    var event = NavJs.getEvent();
    var keycode1 = event.keyCode;

    if (keycode1 == 37 || keycode1 == 39) return; //left right 
    if (event.shiftKey) return;
    if (this.isAutoDropWin != null && isTrue(this.isAutoDropWin))
        this.ShowDropWin();
}
//将改变后的值传到前面
dropdownlist.prototype.fc_txtName_onkeyup = function() {
    this.value = this.fc_txtName.value;
    NavJs.insertEventParam($id(this.id).getAttribute("oninterchange"));	
}
//用户按字母键事件
dropdownlist.prototype.fc_txtName_onkeypress = function() {
    var event = NavJs.getEvent();
    if (!IsTrue(this.blninput)) {
        NavJs.preventDefault(event);
    }
}
//剪贴事件
dropdownlist.prototype.fc_txtName_onpaste = function() {
   	var event = NavJs.getEvent();
   	if (!IsTrue(this.blninput)) 
    {
        NavJs.preventDefault(event);
    }
	this.fc_txtName_onkeyup();
}
//复制事件
dropdownlist.prototype.fc_txtName_oncut = function() {
	fc_txtName_onpaste();
}
//单击客户区中的右鼠按钮,打开相关菜单
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
    try {  //未初始化时会出异常

    } catch (e) { }
}

//strHtml为参照表格的HTML串＋＜BR＞
dropdownlist.prototype.fnInit = function(strHtml) {

    var blnEnter = typeof (strHtml) != "undefined" && typeof (strHtml) != "object" && strHtml != "";
    //alert("ondocumentReady");
    //return ;

    var myObj = new Object();
    myObj = this;



    if (blnEnter == false) {

        //debugger;
        //返原加密的sql语句
        //if(this.sql1 == "" ){
        if (IsSpace(this.sqltrans) == false) {
            this.sql1 = UnSqlPropTrans(this.sqltrans);
        }
        //}

        //按钮的Left坐标
        var mleftButton = parseInt(this.width) + parseInt(this.left) - this.mwidthButton;
        //文本框的宽度
        var txtWidth = 0;
        //var mwidthText = this.width - this.mwidthButton;
        //按钮的宽度 
        //var mButtonWidth = 17;


        //计算百分比  
        if (this.position == "static") {
            var len = this.width.length;
            //查找!
            if (len != "" || typeof len != "undefined") {
                var s2 = this.width.substring(len - 1, len);
            }
            if (s2 == "%") {
                //固定按钮的宽度为17px,编辑框的宽度为%
                //父节点的宽度
                var tmpW = $id(this.id).parentNode.offsetWidth;
                //文本框的宽度
                txtWidth = (100 * ((tmpW * parseInt(this.width) / 100) - 17) / tmpW) + "%";


            } else {
                txtWidth = parseInt(this.width) - parseInt(this.mwidthButton);

            }
        } else {
            txtWidth = parseInt(this.width) - parseInt(this.mwidthButton);

            var mleftButton = parseInt(this.width) + parseInt(this.left) - this.mwidthButton;
        }

        //只读
        var sdisabled = "";
        //是否活动
        if (IsTrue(this.disabled)) {
            sdisabled = " disabled=true ";
        }
        //2013-07-26 add
        var sReadOnly = "";
        if (!IsTrue(this.blninput)) sReadOnly = " readOnly=true ";
        
        
        //如果文本框的宽度<=0默认为40
        if (txtWidth <= 0) txtWidth = 40;
        //文本框串
        var obj_ddl = $id(this.id);

        //	var s1='<INPUT id=fc_txtName  '+ sdisabled +'  style="POSITION: '+this.position+'; TEXT-ALIGN:'+this.align+'; border-left-width:1;border-right-width:1;border-top-width:1;border-bottom-width:2;LEFT: '+this.left+'px;  TOP: '+this.top+'px; WIDTH:'+txtWidth+';HEIGHT:'+this.height+'px; font-size:'+this.fontsize+'; font-style:'+this.fontstyle+'; font-family:'+this.fontfamily+'; background-color:'+this.backgroundColor+'; font-weight:'+this.fontweight+' ; color:'+this.color+';';
        var s1 = '<INPUT id=fc_txtName  ' + sdisabled + sReadOnly + '  style="POSITION: ' + this.position + '; LEFT: ' + this.left + 'px;  TOP: ' + this.top + 'px; WIDTH:' + txtWidth + 'px;HEIGHT:' + this.height + 'px;' + new Eapi.Css().getPart(NavJs.cssText(obj_ddl)) + ';';

        //if(visible=="否") 
        //	s1=s1+'display:none;';
        s1 = s1 + '">';
        //参照按钮串
        //	s1=s1+'<INPUT id=fc_cmdCz type=button  '+ sdisabled +' style="BACKGROUND-IMAGE: url('+fcpubdata.path+'/fceform/images/ef_run_cz.gif);background-repeat:no-repeat;  BORDER-BOTTOM-WIDTH: 0px; BORDER-LEFT-WIDTH: 0px; BORDER-RIGHT-WIDTH: 0px; BORDER-TOP-WIDTH: 0px; HEIGHT: 18px; WIDTH: '+mButtonWidth+';POSITION: '+this.position+' ;LEFT: '+mleftButton+'; TOP: '+this.top+'px;';
        s1 = s1 + '<INPUT id=fc_cmdCz type=button class="cmdDown" onmouseover="this.className=\'cmdDown-over\'" onmouseout="this.className=\'cmdDown\'" ' + sdisabled + ' style="BORDER-BOTTOM-WIDTH: 0px; BORDER-LEFT-WIDTH: 0px; BORDER-RIGHT-WIDTH: 0px; BORDER-TOP-WIDTH: 0px; HEIGHT: 20px; WIDTH: ' + this.mwidthButton + 'px;POSITION: ' + this.position + ' ;LEFT: ' + mleftButton + 'px; TOP: ' + this.top + 'px;';

        //if(visible=="否")
        //	s1=s1+'display:none;';
        s1 = s1 + '">';



        //隐藏控件
        if (this.visible == "否") {
            obj_ddl.style.display = "none";
        }
        obj_ddl.innerHTML = s1;

        //文档事件
        NavJs.addEvent(document, "onmousedown", this.hidelist, myObj);
        //文本框的焦点事件
        //element.children[0].attachEvent("onfocus", fc_txtName_onfocus);
        NavJs.addEvent(obj_ddl.children[0], "onfocus", this.fc_txtName_onfocus, myObj);
        //方本框的失去焦点事件
        //element.children[0].attachEvent("onblur", fc_txtName_onblur);
        NavJs.addEvent(obj_ddl.children[0], "onblur", this.fc_txtName_onblur, myObj);
        //文本框的选择事件,在选择改变或填写改变时事件
        //element.children[0].attachEvent("onchange", fc_txtName_onchange);
        NavJs.addEvent(obj_ddl.children[0], "onchange", this.fc_txtName_onchange, myObj);
        //文本框的按键事件
        //element.children[0].attachEvent("onkeydown", fc_txtName_onkeydown);
        //NavJs.addEvent(obj_ddl.children[0], "onkeydown", this.fc_txtName_onkeydown, myObj);
        //NavJs.addEvent(obj_ddl.children[0], "onkeyup", this.fc_txtName_keyup, myObj);
        //按字母键事件,控制不能输入
        //element.children[0].attachEvent("onkeypress", fc_txtName_onkeypress);
        //NavJs.addEvent(obj_ddl.children[0], "onkeypress", this.fc_txtName_onkeypress, myObj);
        //文本框剪贴事件
        //element.children[0].attachEvent("onpaste", fc_txtName_onpaste);
        NavJs.addEvent(obj_ddl.children[0], "onpaste", this.fc_txtName_onpaste, myObj);
        //文本框复制事件
        //element.children[0].attachEvent("oncut", fc_txtName_oncut);
        NavJs.addEvent(obj_ddl.children[0], "oncut", this.fc_txtName_oncut, myObj);
        //单击文本框右鼠按钮,打开相关菜单
        //element.children[0].attachEvent("oncontextmenu", fc_txtName_oncontextmenu);
        NavJs.addEvent(obj_ddl.children[0], "oncontextmenu", this.fc_txtName_oncontextmenu, myObj);
        //文本框的双击事件
        //element.children[0].attachEvent("ondblclick",dblclick_cmdCz_onclick);
        NavJs.addEvent(obj_ddl.children[0], "ondblclick", this.dblclick_cmdCz_onclick, myObj);
        //参照按钮的点击事件
        //element.children[1].attachEvent("onclick", fc_cmdCz_onclick);
        NavJs.addEvent(obj_ddl.children[1], "onclick", this.fc_cmdCz_onclick, myObj);
        //文本框
        this.fc_txtName = obj_ddl.children[0];
        this.value = this.fc_txtName.value;
        this.text = this.fc_txtName.value;
        this.txt = this.fc_txtName;

        //参照按钮
        this.fc_cmdCz = obj_ddl.children[1];
        this.createDropWin();
        //div
        this.fc_divList = $id("fc_divList"); //element.children[2];
        //翻页表格
        this.fc_divListPage = $id("fc_divListPage"); //element.children[3];
        //上一页
        this.upsidepage = $id("upsidepage"); //element.children[3].children[0].children[0].children[0].children[0];
        //
        this.currentpage = $id("currentpage"); //element.children[3].children[0].children[0].children[1].children[0];
        //下一页
        this.nextpage = $id("nextpage"); //element.children[3].children[0].children[0].children[2].children[0];
        //加翻页事件
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
        //加一个iframe内联浮动框
        this.fc_divList.innerHTML = '<iframe id=fc_ifra style="WIDTH:100%; height:100%;border-Bottom:1 #818080 solid;border-Left:1 #818080 solid; border-right:1 #818080 solid; z-index:99999;" NORESIZE=NORESIZE SCROLLING=' + sTMP + ' MARGINWIDTH=0 MARGINHEIGHT=0 FRAMESPACING=0 FRAMEBORDER=0></iframe>';
        //如 SCROLLING=auto 则下拉树时会空出滚动条的位置.

        var obj_ifra;
        var obj_dom;
        if (navigator.appName.indexOf("Explorer") > -1) {
            obj_dom = window.frames["fc_ifra"].document;
        }
        else {
            obj_ifra = window.document.getElementById('fc_ifra');
            obj_dom = (obj_ifra.document) ? obj_ifra.document : obj_ifra.contentDocument;
        }

        //打开
        obj_dom.open();
        //给iframe加值
        var skins = fcpubdata.skins;
        if (skins == "") skins = "base"; //默认值
        var strAdd = '<!Doctype html><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />'; //加上标准模式 2013-04-27 
        if (IsTrue(this.isShowTree)) {
            strAdd = '<script src="../../fceform/js/MicrosoftAjax.js" charset="' + fcpubdata.encoding + '"></scr' + 'ipt><script src="../../fceform/js/fcpub.js" charset="' + fcpubdata.encoding + '"></scr' + 'ipt><script src="../../fceform/js/fcrundj.js" charset="' + fcpubdata.encoding + '"></scr' + 'ipt><script src="../../fceform/js/xtree.js" charset="' + fcpubdata.encoding + '"></scr' + 'ipt><link type="text/css" rel="stylesheet" href="' + fcpubdata.path + fcpubdata.skinsPath + '/css/xtree.css" /><link type="text/css" rel="stylesheet" href="' + fcpubdata.path + fcpubdata.skinsPath + '/css/efdesign.css" />';

        }
        strAdd = strAdd + '<STYLE> td { word-break: break-all;overflow:hidden;}</STYLE>'; //2013-07-12 my add 以防显示的内容溢出
        strAdd = strAdd + '<LINK REL=stylesheet HREF="' + fcpubdata.path + fcpubdata.skinsPath + '/css/skins/' + skins + '/style/efiframe.css" type="text/css">'
        strAdd += "</head>";
        strAdd += strHtml;
        strAdd += "</html>";

        obj_dom.write(strAdd);

        //added by liuxr at 2010-11-26 16:20 在iframe中增加TD的样式
       // var htmlcss = "<style type=\"text/css\">td{ white-space: nowrap;overflow:hidden; }</style>"
       // NavJs.insertHtml('AfterBegin', obj_dom.getElementsByTagName('head')[0], htmlcss);


        //关闭
        obj_dom.close();

        //alert(('fc_ifra').innerHTML);
        if (IsTrue(this.isShowTree) == false) {
            //下拉表列的数据表
            //fc_list=window.frames["fc_ifra"].document.all.fc_list;
            this.fc_list = obj_dom.getElementById("fc_list");
            //fc_list.attachEvent("onmouseover", fc_listonmouseover);
            NavJs.addEvent(this.fc_list, "onmouseover", this.fc_listonmouse, myObj);
            ///fc_list.attachEvent("onmouseout", fc_listonmouseout);
            NavJs.addEvent(this.fc_list, "onmouseout", this.fc_listonmouse, myObj);
            //表格点击事件，把选中的一行记录值返回到文本框
            //fc_list.attachEvent("onclick", cmdreturn_onclick);
            NavJs.addEvent(this.fc_list, "onclick", this.cmdreturn_onclick, myObj);
            //表格的按键事件
            //fc_list.attachEvent("onkeydown", tab_onkeydown);
            NavJs.addEvent(this.fc_list, "onkeydown", this.tab_onkeydown, myObj);
        } else {
            var objTree = obj_dom.getElementById("dropdownTree");
            NavJs.addEvent(objTree, "onclick", this.treeReturn, myObj);
        }
    }

}
//tab按键事件
dropdownlist.prototype.tab_onkeydown = function() {
    ///指定一个窗口按下键的Code值
    var event = NavJs.getEvent("fc_ifra");
    var iEvent = event.keyCode;
    //var oMouseout=window.frames("fc_ifra").event.srcElement

    var ArrFormat = this.format.split("|");
    //三个循环
    //按下箭头,
    for (var i = 2; i < this.fc_list.rows.length; i++) {
        //上剪头
        if (iEvent == '38') {
            //指定一个窗口没有返回值，控制滚动条不滚动
            //window.frames["fc_ifra"].event.returnValue = false;
            NavJs.preventDefault(event);
            //找到字体为红色的一行记录 ;
            if (this.fc_list.rows[i].style.color == 'red') {
                this.fc_list.rows[i - 1].style.color = 'red';
                this.fc_list.rows[i].style.color = 'black';
                this.fc_list.rows[i - 1].style.backgroundColor = "blue";
                //使表格的底纹成斑马纹
                if (this.fc_list.rows[i - 2].style.backgroundColor == "#eeffee") {
                    this.fc_list.rows[i].style.backgroundColor = "#eeffee";
                } else {
                    this.fc_list.rows[i].style.backgroundColor = "";
                }
            }

        }
    }
    //按下箭头
    for (var i = 0; i < this.fc_list.rows.length - 1; i++) {
        //下剪头
        if (iEvent == '40') {
            //指定一个窗口没有返回值，控制滚动条不滚动
            //window.frames["fc_ifra"].event.returnValue = false;
            NavJs.preventDefault(event);
            //找出字体为红色的一行
            if (this.fc_list.rows[i].style.color == 'red') {
                //把字体为红色的下一行改为红色
                this.fc_list.rows[i + 1].style.color = 'red';
                this.fc_list.rows[i].style.color = 'black';
                this.fc_list.rows[i + 1].style.backgroundColor = "blue";
                //使表格的底纹成斑马纹
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
    //按回车键,把选中一行值返回给文本框
    for (var j = 0; j < this.fc_list.rows.length; j++) {
        //回车键
        if (iEvent == "13") {
            //找到字体变红的一行
            if (this.fc_list.rows[j].style.color == "red") {
                for (var k = 0; k < ArrFormat.length; k++) {
                    //是否有！返回列，如果没有则返回第一列的其中一行															
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
                //值返回文本框后，把下拉框隐藏
                //alert("empty3");
                this.fc_divList.style.display = "none";
                this.fc_divList.innerHTML = "";
                //翻页表格隐藏
                this.fc_divListPage.style.display = "none";
                this.fc_txtName.disabled = false;
                //传值到文本框
                this.fc_txtName_onkeyup();

                //onchangeID.fire(oEvent);
                eval($id(this.id).getAttribute("onchange"));
                //added by liuxr at 2010-12-30 9:30 grid的下拉框的onchange事件
                eval($id(this.id).getAttribute("onchangeCz"));

                //onselchangeID.fire(oEvent);
                eval($id(this.id).getAttribute("onselchange"));
                //将参照的选择事件穿过WebGrid传到页面
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
    //pageup键
    if (iEvent == "33") {
        //window.frames["fc_ifra"].event.returnValue = false;
        NavJs.preventDefault(event);
        if (this.currentpage.value == 1) return;
        this.PrevPage();
        this.fc_list.focus();
    }
    //pagedown键
    if (iEvent == "34") {
        //window.frames["fc_ifra"].event.returnValue = false;
        NavJs.preventDefault(event);
        if (this.currentpage.value == this.overallpagenum) return;
        this.NextPage();
        this.fc_list.focus();
    }
}
//按Alt+↓键，同点击参照按钮一样效果
dropdownlist.prototype.fc_txt_onkeydown = function() {
    var event = NavJs.getEvent();
    //当前按键
    var scode = event.keyCode;
    //alt键
    var skey = event.altKey;
    if (skey == true) {
        switch (scode) {
            case 40: 
                {  //↓
                    //event.returnValue = false;
                    NavJs.preventDefault(event);
                    this.fc_cmdCz_onclick();
                    //指定一个窗口,增加焦点并延时
                    try {
                        $win("fc_ifra").setTimeout("this.fc_list.focus();", 10);
                    } catch (e) { }
                    break;
                }
        }
    }
    //当grid中用dropdownlist时,会用到下面这行.
    eval($id(this.id).getAttribute("onkeydownCz"));
}
/**
双击文本框，弹出下拉框
**/
dropdownlist.prototype.dblclick_cmdCz_onclick = function() {
		this.fc_cmdCz_onclick();
		//指定一个窗口,增加焦点并延时
		try{
		    $win("fc_ifra").setTimeout("this.fc_list.focus();", 10);
		}catch(e){}

}
//调整窗口的大小，改变文本框的大小和按钮的left坐标
dropdownlist.prototype.txt_onresize = function() {
	//父节点的宽度
	var s_mwidth = this.width+"";
	var len = s_mwidth.length ;
		//查找!
//	if(len != "" || typeof len != "undefined") {
	if(len > 0) var s2 = s_mwidth.substring(len-1,len);
//	}
	if(s2 == "%") {
		var tmpW = parentNode.offsetWidth;
		//fc_txtName的宽度
		var tmp1 = (tmpW * parseInt(this.width) /100) - 17 - 2;
		if( parseInt(this.fc_txtName.style.width) != tmp1 ) {
			this.fc_txtName.style.width = tmp1;
		}
	}
}
/**
*找到一个对象的绝对位置
**/
/*
dropdownlist.prototype.getContLeft = function(e){
	var objFirstAbs=null;//上升过程中第一个绝对定位的元素
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
	var objFirstAbs=null;//上升过程中第一个绝对定位的元素
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
    //modify by shenfr ad 2010-11-15 15:19 将uniqueID修改为$id(this.id)
    //var contid=eval(uniqueID+".id");
    var contid = this.id;
    if ($id("fc_divList") != null) {
        $id('fc_divListPage').contid = contid;
        return;
    }
    //做上下页的点击事件
    var sEventNext = ""; //"eval($id('fc_divListPage').contid+'.NextPage()')";
    var sEventPrev = ""; //"eval($id('fc_divListPage').contid+'.PrevPage()')";
    //下拉框串
    var s1 = '<label id=fc_divList style="z-index:9998; DISPLAY: none; LEFT: 0px;  POSITION: absolute; TOP: 40px;'; //加background-color:white; 以免背景透明，2013-06-05

    //if (Sys.Browser.agent != Sys.Browser.InternetExplorer) { //2013-07-25 调chrome下的样式
        s1 += 'BORDER-BOTTOM: #848284 1px solid;BORDER-right: #848284 1px solid;BORDER-top: #848284 1px solid;BORDER-left: #848284 1px solid;';
   // }



    s1 = s1 + '" ></label>';
    //翻页功能表格串
    s1 = s1 + '<table border=0 id=fc_divListPage style="z-index:9999;DISPLAY: none; LEFT: 72px; POSITION: absolute; TOP: 157px"  cellPadding=0 cellSpacing=0>';
    s1 = s1 + '<tr><td><INPUT type="button" value="上" id=upsidepage style="BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; BORDER-TOP: 1px solid; HEIGHT: 18px; WIDTH: 18px" value="上" onclick="' + sEventPrev + '" ></td>';
    s1 = s1 + '<td><INPUT id=currentpage style="BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; BORDER-TOP: 1px solid; HEIGHT: 18px; TEXT-ALIGN: center; WIDTH: 18px" ></td>';
    s1 = s1 + '<td><INPUT type="button" value="下" id=nextpage style="BORDER-BOTTOM: 1px solid; BORDER-LEFT: 1px solid; BORDER-RIGHT: 1px solid; BORDER-TOP: 1px solid; HEIGHT: 18px; WIDTH: 18px" value="下" onclick="' + sEventNext + '" ></td></tr></table>';

    //firefox不兼容insertAdjacentHTML方法
    //window.document.body.insertAdjacentHTML("BeforeEnd", s1);
    NavJs.insertHtml("BeforeEnd", window.document.body, s1);

    $id('fc_divListPage').contid = contid;
}


/**
*@para obj 树控件的HTML中的对象
* 取树控件的选中的值 2011-01-11
**/
dropdownlist.prototype.getTreeSelNodeValue = function() {
    var objRet = null;
    var obj = $id("dropdownTree", $win("fc_ifra")); // window.frames("fc_ifra").$id("dropdownTree");
    var sValue = "";
    var sCode = "";

    if (obj.getAttribute("ischecked") == "1" || obj.getAttribute("ischecked") == "是") {
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
* 下拉树控件时,返回函数
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
    //将改变后的值传到前面
    var oEvent = new Object();
    oEvent.afterchangevalue = this.fc_txtName.value;
    //选择填写事件
    //onchangeID.fire(oEvent);
    eval($id(this.id).getAttribute("onchange"));
    //added by liuxr at 2010-12-30 9:30 grid的下拉框的onchange事件
    eval(document.getElementById(this.id).getAttribute("onchangeCz"));
    
    //选择事件
    //onselchangeID.fire(oEvent);
    eval($id(this.id).getAttribute("onselchange"));

    //将参照的选择事件穿过WebGrid传到页面
    //if (oEvent.position == 88) {
    //if (this.girdposition == 88) {
    //    window.setTimeout("try {fc_czselchange()} catch (e) {} ", 10);
    //}

    this.fc_txtName.focus();


}
