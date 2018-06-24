///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

var icon = {
	root	: {src : 'ef_tree_root'},
	open	: {src : 'ef_tree_open'},
	close	: {src : 'ef_tree_close'},
	file	: {src : 'ef_tree_file'},
	Rplus	: {src : 'ef_tree_Rplus'},
	Rminus	: {src : 'ef_tree_Rminus'},
	join	: {src : 'ef_tree_T'},
	joinbottom: {src : 'ef_tree_L'},
	plus	: {src : 'ef_tree_Tplus'},
	plusbottom: {src : 'ef_tree_Lplus'},
	minus	: {src : 'ef_tree_Tminus'},
	minusbottom: {src : 'ef_tree_Lminus'},
	blank	: {src : 'ef_tree_blank'},
	line	: {src : 'ef_tree_I'} 
};
var Global={
	id:0,
	getId:function(){return this.id++;},
	all:[],
	selectedItem:null,
	defaultText:"",
	defaultAction:"javascript:void(0)",
	defaultTarget: "_self",
	checkedType: 1,  // ==3 表示两种效果都有,==4 两种效果都无 ==1 表示只能: 选中上级节点时自动选中所有下级. ==2 下级有节点被选中时,上级必须选中,下一级节点都没有选中时,上级必须没有选中.
	isCheck:false
}
function preLoadImage() {
    var oImg = new Image();
    icon.touming = "../../fceform/images/ef_touming.gif", //透明图.
    oImg.src = icon.touming;
    icon.obj_touming = oImg;
    
//	for(i in icon){
//		var tem=icon[i];
//		icon[i]=new Image()
//		icon[i].src=tem
//    }
//	
};preLoadImage();
/**
* 构造一个树的节点
*@param text 节点显示值
*@param action 点击后打开的链接
*@param target 点击后在什么地方打开链接
*@param title 鼠标在此节点上停留时在小黄框中的显示值
*@param Icon 节点图标
*@param Check 为true表示节点前有复选框
*@param code 节点隐藏值，一般为ID值供程序使用
**/
function treeItem(text,action,target,title,Icon,Check,code)
{
	this.id=Global.getId();
	this.level=0;
	this.text=text?text:Global.defaultText;
	this.action=action?action:Global.defaultAction;
	this.target=target?target:Global.defaultTarget;
	this.title=title?title:this.text;
	if (typeof(Check)=="undefined")
	{
		Check = Global.isCheck;
	}
	this.Checked = Check;
	this.code = code;
	this.isLast=true;
	this.childNodes=new Array();
	this.indent=new Array();
	this.parent=null;
	var c =0; 
	//if(getCookie("item"+this.id) != null) c = getCookie("item"+this.id);
	this.open=parseInt(c);
	this.load=false;
	this.setuped=false;
	this.JsItem=null;
	this.container=document.createElement("div");
	this.icon=Icon;
	Global.all[Global.all.length]=this;
}

treeItem.prototype.toString = function() {
    var o = this;
    //下面两行是为了给节点的点击事件中能用Global.selectedItem 来取当前节点信息.
    var Global = new Object();
    Global.selectedItem = this;
    var oItem = document.createElement("div");
    oItem.id = "treeItem" + this.id;
    oItem.code = this.code;
    oItem.className = "treeItem";
    //oItem.noWrap = true;
    oItem.onselectstart = function() { return false; }
    oItem.oncontextmenu = function() { return false; }
    this.JsItem = oItem;
    this.drawIndents();
    var iIcon = document.createElement("img"); //"img"
    iIcon.src = icon.touming;
    iIcon.align = "absmiddle";
    iIcon.className = this.childNodes.length > 0 ? (this.open ? (this.level > 0 ? (this.isLast ? icon.minusbottom.src : icon.minus.src) : icon.Rminus.src) : (this.level > 0 ? (this.isLast ? icon.plusbottom.src : icon.plus.src) : icon.Rplus.src)) : (this.level > 0 ? (this.isLast ? icon.joinbottom.src : icon.join.src) : icon.blank.src);


    iIcon.id = "treeItem-icon-handle-" + this.id;
    iIcon.onclick = function() { o.toggle(); };
    oItem.appendChild(iIcon);
    var iIcon = document.createElement("img"); //"img"
    iIcon.src = icon.touming;
    iIcon.align = "absmiddle";
    iIcon.className = this.icon ? this.icon : (this.childNodes.length > 0 ? (this.open ? icon.open.src : icon.close.src) : icon.file.src);

    iIcon.id = "treeItem-icon-folder-" + this.id;
    iIcon.onclick = function() { o.select(o); };  //加了参数o,以防点图标时打开空链接
    iIcon.ondblclick = function() { o.toggle(); };
    oItem.appendChild(iIcon);
    var eText = document.createElement("span");
    //增加Checkbox
    if (o.parent != null) {
        o.Checked = o.parent.Checked;
    }

    if (o.Checked) {
        var eCheck = document.createElement("Input");
        eCheck.type = "checkbox";
        eCheck.id = "chk" + this.id;
        eCheck.onclick = function() { o.SubChecked(); }
        eCheck.onkeydown = function(e) { return o.KeyDown(e); }
        eText.appendChild(eCheck);
    }
    var eA = document.createElement("a");
    eA.innerHTML = this.text;
    eA.target = this.target;
    eA.href = this.action;
    eA.onkeydown = function(e) { return o.KeyDown(e); }
    if (this.action == Global.defaultAction) {
        eA.onclick = function() { return false; };
    } else {
        var stmp1 = this.action.substring(0, 11).toUpperCase(); //javascript:
        if (stmp1 == "JAVASCRIPT:") {

            eA.href = "javascript:void(0);";
            var sClick = o.action.substring(11, o.action.length);
            if (IsSpace(sClick)) {
                eA.onclick = function() { return false; }; //加上return false,否则在ie6+模态窗口中时会固定弹出新窗口. 2011-03-15
            } else {
                eA.onclick = function() { eval(sClick); return false; };
            }
        }

    }
    eText.appendChild(eA);

    eText.id = "treeItem-text-" + this.id;
    eText.className = "treeItem-unselect";
    eText.onclick = function() { o.select(1); };
    eText.title = this.title;
    oItem.appendChild(eText);

    this.container.id = "treeItem-container-" + this.id;
    this.container.style.display = this.open ? "" : "none";
    oItem.appendChild(this.container);
    return oItem;
}
/**
* 返回根节点
**/
treeItem.prototype.root = function()
{
	var p = this;
	while(p.parent)
		p = p.parent;
	return p;
}

//选中节点(包括子节点)
treeItem.prototype.SubChecked = function() {
    
    
    CheckedAll(this, Global.checkedType);
}

function CheckedAll(sid,iTag)
{
    if (eval("chk" + sid.id).checked) {
        if (iTag == 3 || iTag == 1) {
            for (var i = 0; i < eval(sid).childNodes.length; i++) {
                eval("chk" + eval(sid).childNodes[i].id).checked = true;
                CheckedAll(eval(sid).childNodes[i], 1);
            }
        }
        if (iTag == 3 || iTag == 2) {
            //让上级选中

            if (eval(sid).parent != null && eval(sid).parent != eval(sid).parent.root) {
                eval("chk" + eval(sid).parent.id).checked = true;
                CheckedAll(eval(sid).parent, 2);
            }
        }
		
	}
	else {
	    if (iTag == 3 || iTag == 1) {
	        for (var i = 0; i < eval(sid).childNodes.length; i++) {
	            eval("chk" + eval(sid).childNodes[i].id).checked = false;
	            CheckedAll(eval(sid).childNodes[i], 1);
	        }
	    }
	    if (iTag == 3 || iTag == 2) {
	        if(eval(sid).parent != null && eval(sid).parent != eval(sid).parent.root){
	            //如果同级的都没有选中,则上级也不能选中
	            var isSel = false;
	            for (var i = 0; i < eval(sid).parent.childNodes.length; i++) {
	                if (eval("chk" + eval(sid).parent.childNodes[i].id).checked) {
	                    isSel = true;
	                    break;
	                }

	            }
	            if (isSel == false) {
	                eval("chk" + eval(sid).parent.id).checked = false;
	                CheckedAll(eval(sid).parent, 2);
	            }
	        }
	    }
	}
}
/**
* 设置节点显示值
*@param sText 要设置的值
**/
treeItem.prototype.setText = function(sText)
{

	if(this.root().setuped)
	{
		var oItem = document.getElementById("treeItem-text-" + this.id);
		oItem.childNodes[oItem.childNodes.length-1].innerHTML = sText;
	}
	this.text = sText;
	
}
treeItem.prototype.setTitle = function(sText) {

    if (this.root().setuped) {
        var oItem = document.getElementById("treeItem-text-" + this.id);
        oItem.childNodes[oItem.childNodes.length - 1].title = sText;
    }
    this.title = sText;

}

treeItem.prototype.setIndent = function(l,v)
{
	for(var i=0;i<this.childNodes.length;i++)
	{
		this.childNodes[i].indent[l] = v;
		this.childNodes[i].setIndent(l,v);
	}
}

treeItem.prototype.drawIndents = function() {
    var oItem = this.JsItem;
    for (var i = 0; i < this.indent.length; i++) {
        var iIcon = document.createElement("img"); //"img"

        iIcon.align = "absmiddle";
        iIcon.id = "treeItem-icon-" + this.id + "-" + i;
        iIcon.className = this.indent[i] ? icon.blank.src : icon.line.src;
        iIcon.src = icon.touming;
    
        oItem.appendChild(iIcon);
    }
}
/**
* 在当前节点上增加一个子节点
*@param oItem 要增加的节点对象
**/
treeItem.prototype.add = function(oItem)
{
	oItem.parent=this;
	this.childNodes[this.childNodes.length]=oItem;
	oItem.level=this.level+1;
	oItem.indent=this.indent.concat();
	oItem.indent[oItem.indent.length]=this.isLast;
	if(this.childNodes.length>1){
		var o=this.childNodes[this.childNodes.length-2];
		o.isLast=false;
		o.setIndent(o.level,0);
		if(this.root().setuped)o.reload(1);
	}
	else if(this.root().setuped)
		this.reload(0);
	
	this.container.appendChild(oItem.toString());
	this.container.style.display=this.open?"":"none";
	
}
/**
* 在当前节点的前或后增加一个节点
*@param oItem 要增加的节点
*@bAfter 为 true 表示在当前节点后面增加，否则表示在当前节点前面增加。
**/
treeItem.prototype.insert = function(oItem,bAfter)
{
	//当前节点为根节点
	if(this.parent == null) return;
	
	oItem.parent=this.parent;
	var pos = getPos(this.parent.childNodes,this);
	if(pos == -1) return;  //没找到当前元素
	var offset = 0;
	oItem.isLast = false ;
	if(bAfter) {
		offset = 1 ;
		if(pos == this.parent.childNodes.length -1 ){
			this.parent.childNodes[pos].isLast = false;
			oItem.isLast = true;
		}
	}
	this.parent.childNodes = this.parent.childNodes.addAt(pos+offset,oItem)

	oItem.level=this.level;
	oItem.indent=this.indent ;
	
		
	var o = document.getElementById("treeItem"+this.id);
	var sPos = "beforeBegin" ;
	if(bAfter) sPos = "afterEnd" ;
	o.insertAdjacentElement(sPos,oItem.toString());
	//this.parent.container.style.display=this.open?"":"none";
	
	if(this.parent.childNodes.length>1){
		var o=this.parent.childNodes[this.parent.childNodes.length-2];
		o.setIndent(o.level,0);
		if(this.root().setuped)o.reload(1);
	}
	
		this.parent.reload(1);
	
	
	//返回某元素在数组中的位置号
	function getPos(mainArr,o) {
		var l = mainArr.length;
		for(var i=0;i<l;i++){
			if(mainArr[i].id == o.id){
				return i ;
			}
		}
		return -1 ;
	}
}
/**
* 移动节点
* bAfter = true 表示上移, false 表示下移.
**/
treeItem.prototype.moveNode = function(bAfter) {
    var oAddNode = this.getNextNode();
    if (bAfter) oAddNode = this.getPreviousNode();
    if (oAddNode == null) return;
    this.insertNodes(oAddNode, bAfter);
    oAddNode.remove();
}

/** 增加多个节点(包含下级节点)
*@param oItem 要增加的节点
*@bAfter 为 true 表示在当前节点后面增加，否则表示在当前节点前面增加。
**/
treeItem.prototype.insertNodes = function(oItem, bAfter) {
    var tmp = new treeItem(oItem.text, oItem.action, oItem.target, oItem.title, oItem.icon, oItem.Checked, oItem.code);
    this.insert(tmp,bAfter);
    if (oItem.childNodes.length > 0) {
        addSubNodes(tmp, oItem);
    }
}
//增加多个节点(包含下级节点)
treeItem.prototype.addNodes = function(oItem)
{
	var tmp = new treeItem(oItem.text,oItem.action,oItem.target,oItem.title,oItem.icon,oItem.Checked,oItem.code);
	this.add(tmp);
	if (oItem.childNodes.length>0)
	{
		addSubNodes(tmp,oItem);
	}
}

function addSubNodes(obj,oparent)
{
	for(i=0;i<oparent.childNodes.length;i++)
	{
		var SubNode = new treeItem(oparent.childNodes[i].text,oparent.childNodes[i].action,oparent.childNodes[i].target,oparent.childNodes[i].title,oparent.childNodes[i].icon,oparent.childNodes[i].Checked,oparent.childNodes[i].code);
		obj.add(SubNode);
		if (oparent.childNodes[i].childNodes.length>0)
		{
			addSubNodes(SubNode,oparent.childNodes[i]);
		}
	}
}

//查找节点
treeItem.prototype.FindNode = function(oItem,searchObj,searchText){
///	示例:	tree1.FindNode(tree1,"text","库房二部");
///		    tree1.FindNode(tree1,"code","005033")
	
	if (oItem[searchObj] ==searchText)
	{
		oItem.select(this);
		expandOneNode(this);
	}
	else
	{
		FindSubNodes(oItem,searchObj,searchText);
		
	}
}
function FindSubNodes(obj,searchObj,searchText)
{
	for (var i=0;i<obj.childNodes.length;i++)
	{
		if (obj.childNodes[i][searchObj] == searchText)
		{
			obj.childNodes[i].select(this);
			expandOneNode(obj);
			break;
		}
		else
		{
			FindSubNodes(obj.childNodes[i],searchObj,searchText);
		}
	}
}
/**
* 展开某个节点,一直展到根节点
*@date 2006-12-30
**/
function expandOneNode(obj) {
	var oRoot = obj.root();
	while(oRoot != obj) {
		obj.expand();
		obj = obj.parent;
	}
	oRoot.expand();
}
//复制对象
treeItem.cloneNode = function(obj)
{
	var newObj = new Object; 

	// check for array objects 
	if (obj.constructor.toString().indexOf("function Array(") == 1) { 
		newObj = obj.constructor(); 
	} 

	// check for function objects (as usual, IE is ) 
	if (obj.constructor.toString().indexOf("function Function(") == 1) { 
		newObj = obj; // just copy reference to it 
	}
	else for (var n in obj) { 
		var node = obj[n]; 
		if (typeof node == 'object'){
			newObj[n] = treeItem.cloneNode(node); 
		} 
		else if(typeof node != "undefined"){
			newObj[n] = node; 
		} 
	} 

	return newObj;	
}

treeItem.prototype.loadChildren = function()
{
	//do something
}
/**
* 删除当前节点
**/
treeItem.prototype.remove = function()
{
	//var tmp = this.getPreviousSibling();
	//if(tmp){ tmp.select();}
	this.removeChildren();
	var p = this.parent;
	if(!p){ return };
	if(p.childNodes.length>0){
		var o = p.childNodes[p.childNodes.length-1];
		o.isLast = true;
		o.setIndent(o.level,1);
		if(o.root().setuped)o.reload(1);
	}
	else
		p.reload();
}
/**
* 删除当前节点的所有子节点
**/
treeItem.prototype.removeChildren = function ()
{
	if(this == Global.selectedItem){ Global.selectedItem = null;}
	for(var i=this.childNodes.length-1;i>=0;i--)
		this.childNodes[i].removeChildren();
	var o = this;
	var p = this.parent;
	if (p) { p.childNodes = p.childNodes._remove(o);}
	Global.all[this.id] = null
	var oItem = document.getElementById("treeItem"+this.id);
	if (oItem) { oItem.parentNode.removeChild(oItem); }
}
/**
* 
**/
treeItem.prototype.reload = function(flag) {
    if (flag) {
        for (var j = 0; j < this.childNodes.length; j++) { this.childNodes[j].reload(1); }
        for (var i = 0; i < this.indent.length; i++) {
            document.getElementById("treeItem-icon-" + this.id + "-" + i).className = this.indent[i] ? icon.blank.src : icon.line.src; //"img"
            document.getElementById("treeItem-icon-" + this.id + "-" + i).src = icon.touming;
        }
    }
    document.getElementById("treeItem-icon-handle-" + this.id).className = this.childNodes.length > 0 ? (this.open ? (this.level > 0 ? (this.isLast ? icon.minusbottom.src : icon.minus.src) : icon.Rminus.src) : (this.level > 0 ? (this.isLast ? icon.plusbottom.src : icon.plus.src) : icon.Rplus.src)) : (this.level > 0 ? (this.isLast ? icon.joinbottom.src : icon.join.src) : icon.blank.src);
    if (!this.icon)
        document.getElementById("treeItem-icon-folder-" + this.id).className = this.childNodes.length > 0 ? (this.open ? icon.open.src : icon.close.src) : icon.file.src;
}
/**
* 在展开节点和收缩节点之间进行切换
**/
treeItem.prototype.toggle = function()
{
	if(this.childNodes.length>0){
		if(this.open)
			this.collapse();
		else
			this.expand();
	}
}
/**
* 展开当前节点
**/
treeItem.prototype.expand = function()
{
	this.open=1;
	//setCookie("item"+this.id,1);
	if(!this.load){
		this.load=true;
		this.loadChildren();
		this.reload(1);
	}
	else 
		this.reload(0);
	this.container.style.display = "";
}
/**
* 收缩当前节点
**/
treeItem.prototype.collapse = function()
{
	this.open=0;
	//setCookie("item"+this.id,0);
	this.container.style.display = "none";
	this.reload(0);
	this.select(1);
}
/**
* 展开所有节点
**/

treeItem.prototype.expandAll = function()
{
	if(this.childNodes.length>0 && !this.open)this.expand();
	this.expandChildren();
}
/**
* 收缩所有节点
**/

treeItem.prototype.collapseAll = function()
{
	this.collapseChildren();
	if(this.childNodes.length>0 && this.open)this.collapse();
}
/**
* 展开子节点
**/

treeItem.prototype.expandChildren = function()
{
	for(var i=0;i<this.childNodes.length;i++)
	this.childNodes[i].expandAll();
}
/**
* 收缩子节点
**/
treeItem.prototype.collapseChildren = function()
{
	for(var i=0;i<this.childNodes.length;i++)
	this.childNodes[i].collapseAll()
}
/**
* 打开当前节点的链接
**/
treeItem.prototype.openURL=function()
{
	if(this.action!=Global.defaultAction){
		window.open(this.action,this.target);
	}
}
/**
* 选中某个节点
*@param o 要选中的节点
**/
treeItem.prototype.select=function(o)
{
	if (Global.selectedItem) Global.selectedItem.unselect();
	var oItem = document.getElementById("treeItem-text-" + this.id);
	oItem.className = "treeItem-selected";
	try{
	oItem.firstChild.focus();
	}
	catch(e){}
	Global.selectedItem = this;
	if(!o) this.openURL();
}
/**
* 取消树的选中节点
**/
treeItem.prototype.unselect=function()
{
	var oItem = document.getElementById("treeItem-text-" + this.id);
	if(oItem != null){
		oItem.className = "treeItem-unselect";
		try{
		oItem.firstChild.blur();
		}
		catch(e){}
	}
	Global.selectedItem = null;
}
/**
* 将树安装到某个容器（常为DIV元素）下
*@param oTaget 要安装的容器（常为DIV元素）对象
**/
treeItem.prototype.setup = function(oTaget)
{
	oTaget.appendChild(this.toString());
	this.setuped = true;
	if(this.childNodes.length>0 || this.open) this.expand();
}

/**
* 取第一个子节点
**/
treeItem.prototype.getFirstChild = function()
{
	if(this.childNodes.length>0 && this.open)
		return this.childNodes[0];
	return this;
}
/**
* 取最后一个子节点
**/

treeItem.prototype.getLastChild = function()
{
	if(this.childNodes.length>0 && this.open)
		return this.childNodes[this.childNodes.length-1].getLastChild();
	return this;
}
/**
* 取上一个子节点
**/

treeItem.prototype.getPreviousSibling = function()
{
	if(!this.parent) return null;
	for(var i=0;i<this.parent.childNodes.length;i++)
		if(this.parent.childNodes[i] == this)break;
	if(i == 0) 
		return this.parent;
	else
		return this.parent.childNodes[i-1].getLastChild();
}
/**
* 取下一个子节点
**/

treeItem.prototype.getNextSibling = function()
{
	if(!this.parent) return null;
	for(var i=0;i<this.parent.childNodes.length;i++)
		if(this.parent.childNodes[i] == this)break;
	if(i == this.parent.childNodes.length-1)
		return this.parent.getNextSibling();
	else
		return this.parent.childNodes[i+1];
}
/**
* 取同级上一个节点,如无,则返回null
**/

treeItem.prototype.getPreviousNode = function() {
    if (!this.parent) return null;
    for (var i = 0; i < this.parent.childNodes.length; i++)
        if (this.parent.childNodes[i] == this) break;
    if (i == 0)
        return null;
    else
        return this.parent.childNodes[i - 1];
}
/**
* 取同级下一个节点,如无,则返回null
**/

treeItem.prototype.getNextNode = function() {
    if (!this.parent) return null;
    for (var i = 0; i < this.parent.childNodes.length; i++)
        if (this.parent.childNodes[i] == this) break;
    if (i == this.parent.childNodes.length - 1)
        return null;
    else
        return this.parent.childNodes[i + 1];
}

treeItem.prototype.KeyDown=function(e){
	
	var code,o;
	if(!e) e = window.event;
	code = e.which ? e.which : e.keyCode;
	o = this;
	if(code == 37)
	{
		if(o.open) o.collapse();
		else
		{
			if(o.parent) o.parent.select();
		}
		return false;
	}
	else if(code == 38)
	{
		var tmp = o.getPreviousSibling();
		if(tmp) tmp.select();
		return false;
	}
	else if(code == 39)
	{
		if(o.childNodes.length>0)
		{
			if(!o.open) o.expand();
			else
			{
				var tmp = o.getFirstChild();
				if(tmp) tmp.select();
			}
		}
		return false;
	}
	else if(code == 40)
	{
		if(o.open&&o.childNodes.length>0)o.getFirstChild().select();
		else
		{
			var tmp = o.getNextSibling();
			if(tmp) tmp.select();
		}
		return false;
	}
	else if(code == 13)
	{
		o.toggle();
		o.openURL();
		return false;
	}
	return true;
}

//href="'+oNode.href+'" target="'+oNode.target+'" title="'+oNode.title+'" icon="'+oNode.icon+'" check="'+oNode.check+'" code="'+oNode.code+'" xml="'+oNode.xml+'"
treeItem.prototype.getNodeXml = function (m_target,m_action) {
var oNode = this;
	var l = oNode.childNodes.length ;
	var sXml = '<TreeNode id="'+oNode.id+'" text="'+RepXml(oNode.text)+'" ';
	if(typeof m_target != "undefined") sXml += 'roottarget="'+m_target+'" ';
	if(typeof m_action != "undefined") sXml += 'rootaction="'+RepXml(m_action)+'" ';
	if(typeof oNode.href != "undefined"){
		sXml += 'href="'+RepXml(oNode.href)+'" ';
	}
	if(typeof oNode.target != "undefined") {
		sXml += ' target="'+oNode.target+'" ';
	}
	if(typeof oNode.title != "undefined") {
		sXml += 'title="'+RepXml(oNode.title)+'" ';
	}
	if(typeof oNode.icon != "undefined") {
		sXml += ' icon="'+oNode.icon+'" ';
	}
	//if(typeof oNode.check != "undefined") {
		sXml += ' check="'+oNode.check+'" ';
	//}
	if(typeof oNode.code != "undefined") {
	    sXml += 'code="' + RepXml(oNode.code) + '"';
	}
	if(l == 0){
		sXml += '/>' ;
	}else{
		sXml += '>';
		for(var i=0;i<l;i++){
			sXml += oNode.childNodes[i].getNodeXml() ;
		}
		sXml += '</TreeNode>' ;
	}
	//ll
	return sXml ;
}

treeItem.prototype.getMenuXml = function(arr) {
    ///生成主菜单XML串。2012-12-24
    var oNode = this;
    var unitId = "";
    var l = oNode.childNodes.length;
    var sXml = '<item id="' + oNode.id + '" name="' + RepXml(oNode.text) + '" ';
    sXml += 'openType="01" ';
    if (typeof oNode.code != "undefined") {
        /*if (l > 0) {
        sXml += 'href="" ';
        } else {
        sXml += 'href="' + RepXml(oNode.code) + '" ';
        }
        var href = oNode.code;
        if (!IsSpace(oNode.code)) {
        var codeArr = oNode.code.split(',');
        if (codeArr.length > 4) href = unescape(codeArr[4]);
        }*/
        var href = oNode.code;
        var codeArr = new Array(); //2013-07-11 fhj
        if (!IsSpace(oNode.code)) {
            codeArr = oNode.code.split(',');
            if (codeArr.length > 4) {
                href = unescape(codeArr[4]);
            }

        }
        if (l > 0) {//如果当前节点有子节点，此节点不能要链接否则子节点打不开
            sXml += 'href="" ';
            unitId = codeArr[0]; //fhj2013-07-11现在存储在数组中以前是在url字符串中
        } else {
            if (codeArr.length > 4) {
                href = unescape(codeArr[4]);
                //unitId = codeArr[0]; //fhj2013-07-11现在存储在数组中以前是在url字符串中
                sXml += 'href="' + RepXml(href) + '" '; //新生成的菜单节点code属性值fhj2013-04-08
            } else {
                //unitId = href.substring(href.indexOf("&unitid=") + 8, href.length)
                sXml += 'href="' + RepXml(oNode.code) + '" '; //兼容以前生成的菜单节点的code属性值fhj2013-04-08
            }
        }
        var imgPos = unescape(codeArr[2]);
        if (IsSpace(imgPos) == false) {
            sXml += 'imgPos="' + imgPos + '" ';
        } else {
            sXml += 'ImageUrl=""';
        }

    }
    /*if (IsSpace(unitId) == false && IsSpace(arr[unitId]) == false) {
    sXml += 'imgPos="' + arr[unitId] + '" ';
    } else {
    sXml += 'ImageUrl=""';
    }*/
    if (l == 0) {
        sXml += '></item>';
    } else {
        sXml += '>';
        for (var i = 0; i < l; i++) {
            sXml += oNode.childNodes[i].getMenuXml(arr);
        }
        sXml += '</item>';
    }
    return sXml;
}
/*****************************************************/
Array.prototype.indexOf=function(o){
	for(var i=0;i<this.length;i++)
		if(this[i]==o)return i;
	return -1;
}

Array.prototype.removeAt=function(i){
	return this.slice(0,i).concat(this.slice(i+1));
}
Array.prototype.addAt=function(i,o){
	var arr = new Array(1);
	arr[0] = o ;
	var oRet = null ;
	if(i == this.length) {
		oRet = this.slice(0).concat(arr) ;
	}else{
		oRet = this.slice(0,i).concat(arr,this.slice(i)) ;
	}
	return oRet ;
}

Array.prototype._remove=function(o){
	var i=this.indexOf(o);
	if(i!= -1) return this.removeAt(i)
	return this
}
/*****************************************************/

/*****************************************************/
/*
	xtreeItem Class
*/
/*****************************************************/

function xtreeItem(uid,text,action,target,title,Icon,Check,code,xml){
	this.uid=uid;
	this.base=treeItem;
	this.base(text,action,target,title,Icon,Check,code);
	this.Xml=xml;

	
}
xtreeItem.prototype=new treeItem;

xtreeItem.prototype.parseElement=function(dom){
	if(IsSpace(dom) == false){
		return dom.selectSingleNode("/TreeNode");
	}
}
//,m_target,m_action 为所有节点共用的点击事件内容和打开窗口的方式
xtreeItem.prototype.addNodesLoop = function(oItem, m_target, m_action) {
    for (var i = 0; i < oItem.childNodes.length; i++) {
        var o = NavJs.xmlChild(oItem, i); //oItem.childNodes[i];
        if (o == null) continue;
        //alert(o.getAttribute('Xml'))
        var m_target1 = m_target;
        var m_action1 = m_action;
        if (typeof m_target == "undefined") m_target1 = o.getAttribute("target");
        if (typeof m_action == "undefined") m_action1 = o.getAttribute("href");
        var tmp = new xtreeItem(o.getAttribute("id"), o.getAttribute("text"), m_action1, m_target1, o.getAttribute("title"), o.getAttribute("icon"), o.getAttribute("check"), o.getAttribute("code"), o.getAttribute('xml'));
        this.add(tmp);
        if (o.getAttribute("xml")) {

            tmp.add(new treeItem("Loading..."));
        }
        else {
            tmp.load = true;
            tmp.addNodesLoop(o, m_target, m_action);
        }
    }
}
/**
*从XML文件中装入
*@param xmlfile 为 http://localhost/tree/1.xml
**/
xtreeItem.prototype.loadXmlFile = function(xmlfile)
{
	/*
	this.add(new treeItem("Loading..."));
	oItem.add(this);
	this.setuped=true;
	if(this.childNodes.length>0 || this.open) this.expand();	
	*/
	if(this.childNodes.length == 0){
		this.add(new treeItem("Loading..."));
	}else{
		this.childNodes[0].insert(new treeItem("Loading..."));
	}
	this.loadChildren(xmlfile);
}
/**
*从XML字符串中装入
*@param sXml 为 '<TreeNode><TreeNode text="无限级XML树型"  /><TreeNode text="fason"/><TreeNode text="功能"><TreeNode text="异步加载/一次加载"/><TreeNode text="静态/数据库方式加载"><TreeNode text="XML数据文件"/><TreeNode text="数据库"/></TreeNode><TreeNode text="Arrow键操作"/></TreeNode></TreeNode>'
**/

xtreeItem.prototype.loadXmlStr = function(sXml)
{
	//if(typeof sXml == "undefined") sXml = this.Xmlstr ;
	var oXml=SetDom(sXml);
	//alert(sXml);
	if(oXml.documentElement != null){
	    //alert(sXml);
		var s1=NavJs.textContent(oXml.documentElement);
		if(Sys.Browser.agent == Sys.Browser.InternetExplorer && IsSpace(s1) == false){
			alert(s1);
		}else{
			var XmlItem=this.parseElement(oXml.documentElement);
			//将所有节点使用的点击事件和打开窗口属性保存在根节点上
			var m_target ;
			var m_action ;
			var tmpTarget = oXml.documentElement.getAttribute("roottarget");
			if(IsSpace(tmpTarget) == false) m_target = tmpTarget;
			
			var tmp = oXml.documentElement.getAttribute("rootaction") ;
			if(IsSpace(tmp) == false){
				m_action = "javascript:"+unescape(tmp);
			}
			this.addNodesLoop(XmlItem,m_target,m_action);	
		}
	}
	
}
xtreeItem.prototype.loadChildren=function(xmlfile)
{
	var thisXml = this.Xml ;
	if (thisXml == "" || thisXml == null || typeof thisXml == "undefined") {
		if(typeof xmlfile == "undefined"){
			return;
		}else{
			thisXml = xmlfile ;
		}
	}		
	var oItem = this;
	var oLoad = oItem.childNodes[0];
	//modify by liuxr at 2010-10-14 16:37 修改创建跨浏览器的XMLDoc对象
	var XmlHttp = null; //new ActiveXObject("Microsoft.XMLHTTP");
	if (window.ActiveXObject) {
	    XmlHttp = new ActiveXObject('Microsoft.XMLDOM');
	}
	else if (document.implementation && document.implementation.createDocument) {
	    XmlHttp = new window.XMLHttpRequest();
	}
	XmlHttp.onreadystatechange = function() {
		if(XmlHttp.readyState==4){
			if(XmlHttp.status==200){
				
				if(XmlHttp.responseXML.xml == ""){ oLoad.setText("unavaible1");return;}
				
				var XmlItem=oItem.parseElement(XmlHttp.responseXML.documentElement);
				if(XmlItem.childNodes.length == 0){ oLoad.setText("unavaible") }
				else
				{
					
					//oItem.addNodesLoop(XmlItem);
					oItem.addNodesLoop(XmlItem, null, oItem.action);	//ljy modify
					/*
					for(var i=0;i<oItem.childNodes.length;i++)
					{
						if(parseInt(getCookie("item"+oItem.childNodes[i].id)) ==1)
						{ oItem.childNodes[i].expand();}
					}*/
					if(Global.selectedItem == oItem.childNodes[0])oItem.select();
					try{
					oLoad.remove();
					}
					catch(e){}
					
				}
			}
			else{
				oLoad.setText("unavaible");
			}
			XmlHttp = null;
			oItem.select(1);
		}
	}
	try{
		XmlHttp.open("get",thisXml+(/\?/g.test(thisXml)?"&":"?")+"temp="+Math.random(),true);
		XmlHttp.send(null);
	}catch(e){ oLoad.setText("unavaible");}
}
xtreeItem.prototype.setup=function(oTarget){
	if(this.Xml != "" && this.Xml != null && typeof this.Xml != "undefined")	this.add(new treeItem("Loading..."));
	oTarget.appendChild(this.toString());
	this.setuped=true;
	if(this.childNodes.length>0 || this.open) this.expand();
}

/**
* 由sql得到数据后,再转换成树.
*@date 2006-02-23
**/
xtreeItem.prototype.sqlToTreeData = function(oSql, callback, context) {
    var oDsn = new Eapi.Str().getDsnSql(oSql);
    var sXml = "<sql>" + RepXml(oDsn.sql) + "</sql>";
    if (typeof (callback) != "function") {
        var strX = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=sqltotreedata" + oDsn.dsn, sXml);
        return TreeAfterHttpRun(strX);
    } else {
        new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=sqltotreedata" + oDsn.dsn, sXml, function(result) {
            return TreeAfterHttpRun(result.value);
        }, context);
    }
    //alert(strX)
}


/**
* 树刷新
*@date 2006-03-09
*@para obj 树控件的HTML中的对象
*@para newsql 新的sql语句,可为空

**/
function TreeRefresh(obj, newsql, callback, context) {
    //alert(obj.ischecked)
    
	var sAttachEnd = "";
	sAttachEnd += ' '+obj.id+'=new xtreeItem('
	var sEvent = obj.getAttribute("clicknode");
	if (IsSpace(sEvent)) {
	    sEvent = "";
	} else {
	    sEvent = unescape(sEvent);
	    sEvent = RepStr(sEvent, "\r", " ");
	    sEvent = RepStr(sEvent, "\n", " ");
	    sEvent = "javascript:" + Trim(sEvent);
	}
	sAttachEnd += '"","' + obj.getAttribute("roottext") + '","' + sEvent + '","' + "" + '","",'; //
	if (obj.getAttribute("ischecked") == "是" || obj.getAttribute("ischecked") == "1") {
		sAttachEnd += 'icon.root.src,true'
	}else{
		sAttachEnd += '"",""'
	}
	sAttachEnd += ',"",'
	//if(obj.ischecked != true ) {
	sAttachEnd += '""'
	//}
	sAttachEnd += '); ' + obj.id + '.setup(document.getElementById("' + obj.id + '"));';
	
	eval(sAttachEnd);
	
	var objJs = $obj(obj.id);

    
	if (fcpubdata.area == null || fcpubdata.area.getAttribute("djsn") != "tree") {
		var itmp = parseInt(obj.getAttribute("sourcetype")) ;
		switch(itmp){
			case 0 :
				var tmpxml = unescape(obj.getAttribute("xml"));
				if(IsSpace(tmpxml) == false ) {
					objJs.loadXmlStr(tmpxml); 
				}
				break ;

            case 1:
                if (IsSpace(newsql)) {
                    var sql = UnSqlPropTrans(obj.getAttribute("sql"));
                } else {
                    var sql = newsql;
                }
                if (IsSpace(sql) == false) {

                    var s1 = "";
                    if (IsSpace(obj.getAttribute("clicknode")) == false) s1 = ' roottarget="' + obj.getAttribute("opentb") + '" rootaction="' + obj.getAttribute("clicknode") + '"';
                    var sDsn = "";
                    if (IsSpace(obj.getAttribute("datasourceName")) == false) sDsn = "&datasourceName=" + obj.getAttribute("datasourceName");

                    if (typeof (callback) != "function") {

                        var tmp1 = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getTreeXml" + sDsn, "<sql>" + RepXml(RepOpenSql(sql)) + "</sql>");
                        
                        objJs.loadXmlStr('<TreeNode ' + s1 + '>' + tmp1 + '</TreeNode>');
                    } else {
                    
                        new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getTreeXml" + sDsn, "<sql>" + RepXml(RepOpenSql(sql)) + "</sql>", function(result) {
                            var objJs = result.context[0];
                            var s1 = result.context[1];
                            var obj = result.context[2];
                            objJs.loadXmlStr('<TreeNode ' + s1 + '>' + result.value + '</TreeNode>');

                            if (obj.getAttribute("isAll") == "是" || obj.getAttribute("isAll") == "1") {
                                objJs.expandAll();
                            } else {
                                objJs.collapseAll();
                            }
                            var newResult = new Object();
                            newResult.value = result.value;
                            newResult.context = result.context[3];
                            callback(newResult);
                        }, [objJs, s1, obj, context]);
                    }
                }
                break;	
			case 2 :
				var tmpxml = unescape(obj.getAttribute("xmlpath"));
				if(IsSpace(tmpxml) == false ) {
					objJs.loadXmlFile(tmpxml); 
				}
				break ;
			case 3 :
				if(IsSpace( newsql) ){
					var sql = UnSqlPropTrans(obj.getAttribute("sql2")) ;
				}else{
					var sql = newsql ;
	            }
				
				
				if(IsSpace(sql) == false){
					var s1 ="";
					if(IsSpace(obj.getAttribute("clicknode")) == false) s1 = ' roottarget="'+obj.getAttribute("opentb")+'" rootaction="' + obj.getAttribute("clicknode") + '"' ;
				    var oSql = new Object();
                    oSql.sql = RepOpenSql(sql);
                    oSql.datasourceName = obj.getAttribute("datasourceName");
                    var oDsn = new Eapi.Str().getDsnSql(oSql);
                    var sXml = "<sql>" + RepXml(oDsn.sql) + "</sql>";
                    if (typeof (callback) != "function") {
                        var strX = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=sqltotreedata" + oDsn.dsn, sXml);
                        var tmp1 = TreeAfterHttpRun(strX);
                        objJs.loadXmlStr('<TreeNode ' + s1 + '>' + tmp1 + '</TreeNode>');
                    } else {
                        new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=sqltotreedata" + oDsn.dsn, sXml, function(result) {
                            var objJs = result.context[0];
                            var s1 = result.context[1];
                            var obj = result.context[2];
                            objJs.loadXmlStr('<TreeNode ' + s1 + '>' + TreeAfterHttpRun(result.value) + '</TreeNode>');

                            if (obj.getAttribute("isAll") == "是" || obj.getAttribute("isAll") == "1") {
                                objJs.expandAll();
                            } else {
                                objJs.collapseAll();
                            }
                            var newResult = new Object();
                            newResult.value = result.value;
                            newResult.context = result.context[3];
                            callback(newResult);

                        }, [objJs, s1, obj, context]);
                    }
                    
				}
				break ;	
				
		}
		if (obj.getAttribute("isAll") == "是" || obj.getAttribute("isAll") == "1") {
			objJs.expandAll();
		}else{
			objJs.collapseAll();
		}
		
		
	} // end if

}
function TreeAfterHttpRun(strX) {

    var oXml = SetDom(strX);
    if (oXml.documentElement == null) {
        alert(strX);
        return "";
    }
    var sid = "";
    var NewXml = new Sys.StringBuilder();
    //父节点为''时表示根节点
    var ss = oXml.selectNodes("//fathercode[. = '' or . = '0' ]"); //
    for (var i = 0; i < ss.length; i++) {
        var oo = ss[i].parentNode.childNodes[3];
        if (oo != null) var sid = " code=\"" + NavJs.textContent(oo) + "\" ";
        //支持定义节点icon, 2013-06-04
        if (ss[i].parentNode.childNodes.length > 4) {
            var oo = ss[i].parentNode.childNodes[4];
            if (oo != null) {
                var sTmpIcon = NavJs.textContent(oo);
                sTmpIcon = Trim(sTmpIcon);
                if (!IsSpace(sTmpIcon)) {
                    sid += " icon=\"ef_tree_" + sTmpIcon + "\" ";
                }
            }
        }
        
        var name = NavJs.textContent(ss[i].parentNode.childNodes[2]);
        var code = NavJs.textContent(ss[i].parentNode.childNodes[0]);
        var fathercode = NavJs.textContent(ss[i].parentNode.childNodes[1]);

        NewXml.append("<TreeNode text=\"" + name + "\" " + sid + " >");
        XmlTree(NewXml, code, oXml);

    }
    return NewXml.toString();

    function XmlTree(NewXml, code, obj) {
        var ss = eval(obj.selectNodes("//fathercode[. = '" + code + "']"));
        if (ss.length > 0) {
            for (var j = 0; j < ss.length; j++) {
                var sid = "";
                var oo = ss[j].parentNode.childNodes[3];
                if (oo != null) sid = " code=\"" + NavJs.textContent(oo) + "\" ";
                //支持定义节点icon, 2013-06-04
                if (ss[j].parentNode.childNodes.length > 4) {
                    var oo = ss[j].parentNode.childNodes[4];
                    if (oo != null) {
                        var sTmpIcon = NavJs.textContent(oo);
                        sTmpIcon = Trim(sTmpIcon);
                        if (!IsSpace(sTmpIcon)) {
                            sid += " icon=\"ef_tree_" + sTmpIcon +"\" ";
                        }
                    }
                }
                
                var name = NavJs.textContent(ss[j].parentNode.childNodes[2]);
                var code = NavJs.textContent(ss[j].parentNode.childNodes[0]);
                var fathercode = NavJs.textContent(ss[j].parentNode.childNodes[1]);

                NewXml.append("<TreeNode text=\"" + name + "\" " + sid + " >");
                XmlTree(NewXml, code, obj);

            }
            NewXml.append("</TreeNode>");
        }
        else {
            NewXml.append("</TreeNode>");
        }

    }

}

/**
*取多选时选中的值
*@param obj 树控件的HTML中的对象
*@param type ="ef_tree_psm"表示只取职员节点。
*@return null表示没有选中任何节点,否则为选中的节点数组,每个元素有code,text,href,target属性.
*@date 2006-03-23
**/
function TreeGetMultiValue(obj,type){
	//CopyToPub($id("tree1").innerHTML)
	var arr = new Array();
	var j=0;
	//var oList = obj.all.tags("input");
	var oList = obj.getElementsByTagName("INPUT");
	for(var i=0;i<oList.length;i++){

	    if (oList[i].checked) {
	        if (!IsSpace(type)) {
	            //var arrImg = oList[i].parentNode.parentNode.getElementsByTagName("IMG");
	            //if (arrImg[arrImg.length - 1].getAttribute("class") != type) continue;
	            var oImgNode = NavJs.prevNode(oList[i].parentNode);
	            if(oImgNode!= null && oImgNode.getAttribute("class") != type) continue;
	        }
	        
			arr[j] = new Object();
			//var scode = oList[i].parentNode.parentNode.getAttribute("code");
			var scode = oList[i].parentNode.parentNode.code; //此处在chrome下不能用getAttribute来取，2013-03-07
			if (scode == null) scode = "";
			arr[j].code = scode ;
			arr[j].text = oList[i].nextSibling.innerText ;
			arr[j].href = oList[i].nextSibling.href ;
			arr[j].target = oList[i].nextSibling.target ;
			j++;
		}
	}
	if(j == 0) return null ;
	return arr;
}
/**
*设置多选时选中的值
*@para obj 树控件的HTML中的对象
*@para svalue 以,分隔的树节点的code属性值
*@para isText =true 表示svalue为text属性值.
*@date 2006-03-27
**/
function TreeSetMultiValue(obj, svalue, isText) {
    if (IsSpace(obj.getAttribute("ischecked"))) return;
	if(IsSpace(svalue)) return ;
	
	var arrSel = svalue.split(",");
	var ll = arrSel.length ;
	var arr = new Array();
	var j=0;
	var oList = obj.getElementsByTagName("INPUT");
	for (var i = 0; i < oList.length; i++) {
	    if (isText) {
	        //var scode = oList[i].parentNode.parentNode.innerText; //只能取明细节点
	        var scode = oList[i].nextSibling.innerText; 
	    } else {
	        var scode = oList[i].parentNode.parentNode.code;
	    }
	    //alert(oList[i].parentNode.parentNode.outerHTML);    
		if (IsSpace(scode) == false) {
		    for (var j = 0; j < ll; j++) {
		        if (scode == arrSel[j]) {
		            oList[i].checked = true;
		        }
		    }
		}
	}
}

/**
* 隐藏根节点 2011-01-13
**/
function TreeRootNodeHide(obj, svalue) {
    var arr; // = ["treeItem-icon-handle-1", "treeItem-icon-folder-1", "treeItem-text-1"];
    //if ($id(arr[0]) == null) {  
        var oDiv = obj.getElementsByTagName("DIV")[0];
        var s = oDiv.id;
        s = s.substring(8); //去掉 treeItem
        arr = ["treeItem-icon-handle-1", "treeItem-icon-folder-1", "treeItem-text-1","treeItem-icon-handle-"+s, "treeItem-icon-folder-"+s, "treeItem-text-"+s];
    //}
    for (var i = 0; i < arr.length; i++) {
        var oId = $id(arr[i]);
        if (oId != null) oId.style.display = svalue;
    }
    
    for (var i = 0; i < Global.id; i++) {
        var oId = $id("treeItem-icon-" + i + "-0");
        if (oId != null) oId.style.display = svalue;
    }
}
