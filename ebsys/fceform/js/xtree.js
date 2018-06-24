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
	checkedType: 1,  // ==3 ��ʾ����Ч������,==4 ����Ч������ ==1 ��ʾֻ��: ѡ���ϼ��ڵ�ʱ�Զ�ѡ�������¼�. ==2 �¼��нڵ㱻ѡ��ʱ,�ϼ�����ѡ��,��һ���ڵ㶼û��ѡ��ʱ,�ϼ�����û��ѡ��.
	isCheck:false
}
function preLoadImage() {
    var oImg = new Image();
    icon.touming = "../../fceform/images/ef_touming.gif", //͸��ͼ.
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
* ����һ�����Ľڵ�
*@param text �ڵ���ʾֵ
*@param action �����򿪵�����
*@param target �������ʲô�ط�������
*@param title ����ڴ˽ڵ���ͣ��ʱ��С�ƿ��е���ʾֵ
*@param Icon �ڵ�ͼ��
*@param Check Ϊtrue��ʾ�ڵ�ǰ�и�ѡ��
*@param code �ڵ�����ֵ��һ��ΪIDֵ������ʹ��
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
    //����������Ϊ�˸��ڵ�ĵ���¼�������Global.selectedItem ��ȡ��ǰ�ڵ���Ϣ.
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
    iIcon.onclick = function() { o.select(o); };  //���˲���o,�Է���ͼ��ʱ�򿪿�����
    iIcon.ondblclick = function() { o.toggle(); };
    oItem.appendChild(iIcon);
    var eText = document.createElement("span");
    //����Checkbox
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
                eA.onclick = function() { return false; }; //����return false,������ie6+ģ̬������ʱ��̶������´���. 2011-03-15
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
* ���ظ��ڵ�
**/
treeItem.prototype.root = function()
{
	var p = this;
	while(p.parent)
		p = p.parent;
	return p;
}

//ѡ�нڵ�(�����ӽڵ�)
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
            //���ϼ�ѡ��

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
	            //���ͬ���Ķ�û��ѡ��,���ϼ�Ҳ����ѡ��
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
* ���ýڵ���ʾֵ
*@param sText Ҫ���õ�ֵ
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
* �ڵ�ǰ�ڵ�������һ���ӽڵ�
*@param oItem Ҫ���ӵĽڵ����
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
* �ڵ�ǰ�ڵ��ǰ�������һ���ڵ�
*@param oItem Ҫ���ӵĽڵ�
*@bAfter Ϊ true ��ʾ�ڵ�ǰ�ڵ�������ӣ������ʾ�ڵ�ǰ�ڵ�ǰ�����ӡ�
**/
treeItem.prototype.insert = function(oItem,bAfter)
{
	//��ǰ�ڵ�Ϊ���ڵ�
	if(this.parent == null) return;
	
	oItem.parent=this.parent;
	var pos = getPos(this.parent.childNodes,this);
	if(pos == -1) return;  //û�ҵ���ǰԪ��
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
	
	
	//����ĳԪ���������е�λ�ú�
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
* �ƶ��ڵ�
* bAfter = true ��ʾ����, false ��ʾ����.
**/
treeItem.prototype.moveNode = function(bAfter) {
    var oAddNode = this.getNextNode();
    if (bAfter) oAddNode = this.getPreviousNode();
    if (oAddNode == null) return;
    this.insertNodes(oAddNode, bAfter);
    oAddNode.remove();
}

/** ���Ӷ���ڵ�(�����¼��ڵ�)
*@param oItem Ҫ���ӵĽڵ�
*@bAfter Ϊ true ��ʾ�ڵ�ǰ�ڵ�������ӣ������ʾ�ڵ�ǰ�ڵ�ǰ�����ӡ�
**/
treeItem.prototype.insertNodes = function(oItem, bAfter) {
    var tmp = new treeItem(oItem.text, oItem.action, oItem.target, oItem.title, oItem.icon, oItem.Checked, oItem.code);
    this.insert(tmp,bAfter);
    if (oItem.childNodes.length > 0) {
        addSubNodes(tmp, oItem);
    }
}
//���Ӷ���ڵ�(�����¼��ڵ�)
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

//���ҽڵ�
treeItem.prototype.FindNode = function(oItem,searchObj,searchText){
///	ʾ��:	tree1.FindNode(tree1,"text","�ⷿ����");
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
* չ��ĳ���ڵ�,һֱչ�����ڵ�
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
//���ƶ���
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
* ɾ����ǰ�ڵ�
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
* ɾ����ǰ�ڵ�������ӽڵ�
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
* ��չ���ڵ�������ڵ�֮������л�
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
* չ����ǰ�ڵ�
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
* ������ǰ�ڵ�
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
* չ�����нڵ�
**/

treeItem.prototype.expandAll = function()
{
	if(this.childNodes.length>0 && !this.open)this.expand();
	this.expandChildren();
}
/**
* �������нڵ�
**/

treeItem.prototype.collapseAll = function()
{
	this.collapseChildren();
	if(this.childNodes.length>0 && this.open)this.collapse();
}
/**
* չ���ӽڵ�
**/

treeItem.prototype.expandChildren = function()
{
	for(var i=0;i<this.childNodes.length;i++)
	this.childNodes[i].expandAll();
}
/**
* �����ӽڵ�
**/
treeItem.prototype.collapseChildren = function()
{
	for(var i=0;i<this.childNodes.length;i++)
	this.childNodes[i].collapseAll()
}
/**
* �򿪵�ǰ�ڵ������
**/
treeItem.prototype.openURL=function()
{
	if(this.action!=Global.defaultAction){
		window.open(this.action,this.target);
	}
}
/**
* ѡ��ĳ���ڵ�
*@param o Ҫѡ�еĽڵ�
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
* ȡ������ѡ�нڵ�
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
* ������װ��ĳ����������ΪDIVԪ�أ���
*@param oTaget Ҫ��װ����������ΪDIVԪ�أ�����
**/
treeItem.prototype.setup = function(oTaget)
{
	oTaget.appendChild(this.toString());
	this.setuped = true;
	if(this.childNodes.length>0 || this.open) this.expand();
}

/**
* ȡ��һ���ӽڵ�
**/
treeItem.prototype.getFirstChild = function()
{
	if(this.childNodes.length>0 && this.open)
		return this.childNodes[0];
	return this;
}
/**
* ȡ���һ���ӽڵ�
**/

treeItem.prototype.getLastChild = function()
{
	if(this.childNodes.length>0 && this.open)
		return this.childNodes[this.childNodes.length-1].getLastChild();
	return this;
}
/**
* ȡ��һ���ӽڵ�
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
* ȡ��һ���ӽڵ�
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
* ȡͬ����һ���ڵ�,����,�򷵻�null
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
* ȡͬ����һ���ڵ�,����,�򷵻�null
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
    ///�������˵�XML����2012-12-24
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
        if (l > 0) {//�����ǰ�ڵ����ӽڵ㣬�˽ڵ㲻��Ҫ���ӷ����ӽڵ�򲻿�
            sXml += 'href="" ';
            unitId = codeArr[0]; //fhj2013-07-11���ڴ洢����������ǰ����url�ַ�����
        } else {
            if (codeArr.length > 4) {
                href = unescape(codeArr[4]);
                //unitId = codeArr[0]; //fhj2013-07-11���ڴ洢����������ǰ����url�ַ�����
                sXml += 'href="' + RepXml(href) + '" '; //�����ɵĲ˵��ڵ�code����ֵfhj2013-04-08
            } else {
                //unitId = href.substring(href.indexOf("&unitid=") + 8, href.length)
                sXml += 'href="' + RepXml(oNode.code) + '" '; //������ǰ���ɵĲ˵��ڵ��code����ֵfhj2013-04-08
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
//,m_target,m_action Ϊ���нڵ㹲�õĵ���¼����ݺʹ򿪴��ڵķ�ʽ
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
*��XML�ļ���װ��
*@param xmlfile Ϊ http://localhost/tree/1.xml
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
*��XML�ַ�����װ��
*@param sXml Ϊ '<TreeNode><TreeNode text="���޼�XML����"  /><TreeNode text="fason"/><TreeNode text="����"><TreeNode text="�첽����/һ�μ���"/><TreeNode text="��̬/���ݿⷽʽ����"><TreeNode text="XML�����ļ�"/><TreeNode text="���ݿ�"/></TreeNode><TreeNode text="Arrow������"/></TreeNode></TreeNode>'
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
			//�����нڵ�ʹ�õĵ���¼��ʹ򿪴������Ա����ڸ��ڵ���
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
	//modify by liuxr at 2010-10-14 16:37 �޸Ĵ������������XMLDoc����
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
* ��sql�õ����ݺ�,��ת������.
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
* ��ˢ��
*@date 2006-03-09
*@para obj ���ؼ���HTML�еĶ���
*@para newsql �µ�sql���,��Ϊ��

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
	if (obj.getAttribute("ischecked") == "��" || obj.getAttribute("ischecked") == "1") {
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

                            if (obj.getAttribute("isAll") == "��" || obj.getAttribute("isAll") == "1") {
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

                            if (obj.getAttribute("isAll") == "��" || obj.getAttribute("isAll") == "1") {
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
		if (obj.getAttribute("isAll") == "��" || obj.getAttribute("isAll") == "1") {
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
    //���ڵ�Ϊ''ʱ��ʾ���ڵ�
    var ss = oXml.selectNodes("//fathercode[. = '' or . = '0' ]"); //
    for (var i = 0; i < ss.length; i++) {
        var oo = ss[i].parentNode.childNodes[3];
        if (oo != null) var sid = " code=\"" + NavJs.textContent(oo) + "\" ";
        //֧�ֶ���ڵ�icon, 2013-06-04
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
                //֧�ֶ���ڵ�icon, 2013-06-04
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
*ȡ��ѡʱѡ�е�ֵ
*@param obj ���ؼ���HTML�еĶ���
*@param type ="ef_tree_psm"��ʾֻȡְԱ�ڵ㡣
*@return null��ʾû��ѡ���κνڵ�,����Ϊѡ�еĽڵ�����,ÿ��Ԫ����code,text,href,target����.
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
			var scode = oList[i].parentNode.parentNode.code; //�˴���chrome�²�����getAttribute��ȡ��2013-03-07
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
*���ö�ѡʱѡ�е�ֵ
*@para obj ���ؼ���HTML�еĶ���
*@para svalue ��,�ָ������ڵ��code����ֵ
*@para isText =true ��ʾsvalueΪtext����ֵ.
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
	        //var scode = oList[i].parentNode.parentNode.innerText; //ֻ��ȡ��ϸ�ڵ�
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
* ���ظ��ڵ� 2011-01-13
**/
function TreeRootNodeHide(obj, svalue) {
    var arr; // = ["treeItem-icon-handle-1", "treeItem-icon-folder-1", "treeItem-text-1"];
    //if ($id(arr[0]) == null) {  
        var oDiv = obj.getElementsByTagName("DIV")[0];
        var s = oDiv.id;
        s = s.substring(8); //ȥ�� treeItem
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
