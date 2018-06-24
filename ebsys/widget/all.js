///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />
///<reference path="/ebsys/fceform/js/fcrundj.js" />
///<reference path="/ebsys/fceform/js/fcbasecont.js" />

Type.registerNamespace("Eform.Design");
Type.registerNamespace("Eform.Run");
Eform.AllWidget = function() {}
Eform.AllWidget.prototype =
{
    designReadyBefore: function() { }, //在设计器页面上的function之外运行的程序
    designReadyAfter: function() { //在设计器页面上的function之外运行的程序
        //ArrName[ArrName.length] = "test";
        var oXml = SetDomFile("../../widget/config.xml");
        if (oXml.documentElement != null) {
            for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
                ArrName[ArrName.length] = oXml.documentElement.childNodes[i].getAttribute("controlType");
            }
        }
    },
    designLoadBefore: function() { }, //在设计器页面上的onload时运行的程序
    designLoadAfter: function() { }, //在设计器页面上的onload时运行的程序
    designOpenBefore: function() { }, //在设计器页面上的打开表单文件时运行的程序
    designOpenAfter: function() { }, //在设计器页面上的打开表单文件时运行的程序

    readyBefore: function() { }, //在运行页面上的function之外运行的程序
    readyAfter: function() { }, //在运行页面上的function之外运行的程序

    getDesignObj: function(controlType) {
        return eval("new Eform.Design." + controlType + "()");
    },
    getRunObj: function(controlType) {
        return eval("new Eform.Run." + controlType + "()");
    }
}
Eform.AllWidget.registerClass("Eform.AllWidget");

Eform.Design.Widget = function() {

}
Eform.Design.Widget.prototype =
{
    toolbarAddAfter: function(controlType) { //在设计器的工具栏上加上了此控件之后要调用的程序
        var arrCont = [];
        arrCont[0] = controlType + "控件";
        arrCont[3] = 'Add("' + controlType + '")';
        btnList[controlType] = arrCont;
    },
    addAfter: function() { }, //在设计器上加上了此控件之后要调用的程序
    propBefore: function() { }, //在设计器上进入控件属性窗口之前要调用的程序
    propAfter: function() { }, //在设计器上进入控件属性窗口之后要调用的程序
    saveBefore: function() { }, //在设计器页面上的保存时运行的程序
    saveAfter: function() { }, //在设计器页面上的保存时运行的程序
    toRunBefore: function() { }, //在设计器页面上的转运行串时运行的程序
    toRunAfter: function() { }, //在设计器页面上的转运行串时运行的程序
    delBefore: function() { }, //在设计器页面上的删除本控件时运行的程序
    delAfter: function() { }, //在设计器页面上的删除本控件时运行的程序

    getDefaultHtml: function(sId, sPosition) { }

}
Eform.Design.Widget.registerClass("Eform.Design.Widget");

Eform.Run.Widget = function() {

}
Eform.Run.Widget.prototype =
{
    loadBefore: function() { }, //在运行页面上的onload时运行的程序
    loadAfter: function() { }, //在运行页面上的onload时运行的程序
    resizeBefore: function() { }, //在运行页面上的resize时运行的程序
    resizeAfter: function() { }, //在运行页面上的resize时运行的程序
    initBind: function() { }, //在运行页面上的绑定到数据集时的初始化程序
    fsetCont: function() { }, //在运行页面上的将值从数据集的fset中传递给控件上
    contFset: function() { } //在运行页面上的将值从控件传递给数据集的fset上

}
Eform.Run.Widget.registerClass("Eform.Run.Widget");

Eform.BaseWidget = function(element) {
    Eform.BaseWidget.initializeBase(this, [element]);

}
Eform.BaseWidget.prototype =
{

    loadBefore: function() { }, //在运行页面上的onload时运行的程序
    loadAfter: function() { }, //在运行页面上的onload时运行的程序
    resizeBefore: function() { }, //在运行页面上的resize时运行的程序
    resizeAfter: function() { }, //在运行页面上的resize时运行的程序
    initBind: function() { }, //在运行页面上的绑定到数据集时的初始化程序
    fsetCont: function() { }, //在运行页面上的将值从数据集的fset中传递给控件上
    contFset: function() { 
    
    } //在运行页面上的将值从控件传递给数据集的fset上
    
    
}
Eform.BaseWidget.registerClass("Eform.BaseWidget", Sys.UI.Control);

//定义一个接口
Eform.IWidget = function()
{
    throw Error.notImplemented();
}
Eform.IWidget.prototype =
{
}
Eform.IWidget.registerInterface("Eform.IWidget");



Eform.Design.test = function() {
    Eform.Design.test.initializeBase(this);
}
Eform.Design.test.prototype =
{
    toolbarAddAfter: function() {

        Eform.Design.test.callBaseMethod(this, "toolbarAddAfter", ["test"]);

    }, //在设计器的工具栏上加上了此控件之后要调用的程序
    addAfter: function() { }, //在设计器上加上了此控件之后要调用的程序
    propBefore: function() { }, //在设计器上进入控件属性窗口之前要调用的程序
    propAfter: function() { }, //在设计器上进入控件属性窗口之后要调用的程序
    saveBefore: function() { return ""; }, //在设计器页面上的保存时运行的程序,返回空或是错误信息
    saveAfter: function() { }, //在设计器页面上的保存时运行的程序
    toRunBefore: function() { }, //在设计器页面上的转运行串时运行的程序
    toRunAfter: function() { }, //在设计器页面上的转运行串时运行的程序
    delBefore: function() { }, //在设计器页面上的删除本控件时运行的程序
    delAfter: function() { }, //在设计器页面上的删除本控件时运行的程序
    getDefaultHtml: function(sId, sPosition) { return '<div controltype="test" id="' + sId + '" style="position:' + fcpubdata.position + ';left:0;top:0;width:300px;height:200px;BORDER: 1px solid;">test...</div>'; },
    getJsFile: function() { //返回需要引入的JS文件串
        return "<script src='../../widget/js/test.js'></" + "script>";
    
    }

}
Eform.Design.test.registerClass("Eform.Design.test", Eform.Design.Widget);

Eform.Run.test = function() {
    Eform.Run.test.initializeBase(this);
}
Eform.Run.test.prototype =
{
    getVersion: function() { return 130314000001; },
    getAuthorName: function() { return "张三"; },
    getAuthorId: function() { return "AAA0000001"; },

    loadBefore: function() { }, //在运行页面上的onload时运行的程序
    loadAfter: function() { }, //在运行页面上的onload时运行的程序
    resizeBefore: function() { }, //在运行页面上的resize时运行的程序
    resizeAfter: function() { }, //在运行页面上的resize时运行的程序
    initBind: function() { }, //在运行页面上的绑定到数据集时的初始化程序
    fsetCont: function(oCont, oField) {
        //在运行页面上的将值从数据集的fset中传递给控件上,oCont为html控件对象，oField为数据集的字段对象，
    },
    contFset: function(oField, sValue) { //在运行页面上的将值从控件传递给数据集的fset上,oField为数据集的字段对象，sValue为控件的值，return 错误信息或空，此处兼顾处理及数据验证两个功能
        
        return "";
    }

}
Eform.Run.test.registerClass("Eform.Run.test", Eform.Run.Widget);
