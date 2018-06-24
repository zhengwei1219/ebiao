///<reference name="MicrosoftAjax.js" />

//全局数据对象
/**
	servletPath			调用后台文件的基路径
	Path				做发布的虚拟目录用
	dotnetVersion		=""表示为java版本,=".aspx"为.net版本
	databaseTypeName	数据库类型,sqlserver/mysql/oracle
	pub_sendhttp_errmsg	特定的连后台出错信息
	gridno_fieldname	主子表编辑时子表的顺序号字段名
	BillOpenWinName		运行表单的帧窗口的名称
	position			缺省的定位模式 =absolute/static
	toolbarstyle		所有样式表的列表;red,yellow,light,Office,blue,green,CoolBlue,white 所有样式表的列表
	toolbar				所列的控件按钮的列表,|是分隔符,br是换行
	formtb				配置用eform画的表单的可用工具栏,内容为<option>格式的XML串,
						节点属性path表示页面路径，~表示fcpubdata.path值
						节点属性height表示工具栏占的高度，如不指定，则取默认值为31px
						节点值为工具栏名称，在表单设计器的表单属性窗口中以列表形式显示，供操作员选择。
**/

var fcpubdata = {
servletPath: "/ebsys/eformaspx", 		//调用后台文件的基路径, for .NET的常用写法是: /ebsys/eformaspx ,eform for j2ee的常用写法是: /servlet
    path: "/ebsys", 				//定位到fceform目录,不含虚拟目录的路径,常用写法是: /eformsys
    dotnetVersion: ".aspx", 			//=""表示为java版本,=".aspx"为.net版本
    databaseTypeName: "sqlserver", 		//数据库类型,sqlserver/mysql/oracle/db2
    isOleDb: "yes", //是否为OleDb连接,no表示为sqlclient或oracleclient连接
    dbStruDict: "FC_ENTITY",         //="FC_DBSTRU" ="FC_FLDLIST" ="" 表示临时从数据库中取. ="FC_ENTITY" 表示在正康平台中用
    cssFiles: ["/css/efdesign.css"],                   //在表单中加载的css文件,路径在fceform目录,一般写 /css/xx.css      "/css/tdm_main.css"
    skins: "blue",                   //表单skin 可设值为: base/blue/light/green
    skinsPath: "/fceform",                   //样式的基路径: fceform/fceformext 或是orgid
    //toolbarStyle: "blue",                //设计器工具栏的样式 可设值为: base/blue/light/green,no use,统一用 skins
    actionButtonDisplay: "",                   //控件属性框中的设置权限按钮的style.display属性值 "none"表示不显示
    fcbugButtonDisplay: "none",         //控件属性框中 是否显示提问按钮
    db2UserName: "EBORACLE", 		//db2数据库的用户名(即模式名 DB2ADMIN)
    gridNoFieldName: "dj_sn", 			//主子表编辑时子表的顺序号字段名
    billOpenWinName: "rightmain", 		//运行表单的帧窗口的名称
    position: "absolute", 		//缺省的定位模式 =absolute/static
    toolbar: "newempty,opendj,opendjfile,billtype,djpreview,directrun,save,saveas,|,cut,copy,paste,undo,redo,|,align,focus,front,behind,form,|,userfunction,userfunction1,addhtml,execute,showlist,listconfig,importconfig,setPosition,eformhelp,|,cbozoom,br,button,label,img,div,shape,|,tab,page,tree,a,spin,checkboxlist,radiolist,|,dataset,grid,htmltable,formattab,|,text,checkbox,radio,listbox,combobox,dropdownlist,textarea,|,dbimg,upload,layout,ebiao,eblayout,test", //表单设计器工具栏按钮,|是分隔符,br是换行
    formToolbar: "<option path=\"~/fceformext/common/toolbarform.htm?type=88\">自定义工具栏</option><option path=\"~/fceformext/common/toolbarform.htm?type=1\">确定_取消</option><option path=\"~/fceformext/common/toolbarform.htm?type=5\">确定_取消_保存后新增_清空</option><option path=\"~/fceformext/common/toolbarform.htm?type=3\">翻页组_增加_删除_保存</option><option path=\"~/fceformext/common/toolbarform.htm?type=4\">翻页组_增加行_删除行_增加_删除_保存</option><option path=\"~/fceformext/common/toolbarform.htm?type=2\">增加_删除</option><option path=\"~/fceformext/common/toolbarform.htm?type=7\">增加行_删除行_保存</option><option path=\"~/fceformext/common/toolbarform.htm?type=6\">查询组</option><option path=\"~/fceformext/common/toolbarform.htm?type=8\">查询组_增加行_删除行_保存</option><option path=\"~/fceformext/common/toolbarform.htm?type=9\">查询组_增加_删除</option><option path=\"~/fceformext/common/toolbarform.htm?type=10\">确定_取消_打印组</option><option path=\"~/workflow/sys_dj/wf_tools.htm\" height=\"60px\">工作流工具栏</option>", //配置用eform画的表单的可用工具栏,内容为<option>格式的XML串,节点属性path表示页面路径，~表示fcpubdata.path值,节点属性height表示工具栏占的高度，如不指定，则取默认值为31px,节点值为工具栏名称，在表单设计器的表单属性窗口中以列表形式显示，供操作员选择。
    toolbarButtons: {
        printpreview: ["55", "ef_preview_button.gif", "e表控件打印预览", "打印预览"],
        selectprint: ["55", "ef_print_button.gif", "e表控件打印", "打印"],
        directprint: ["20", "eb_printdirect.gif", "e表控件直接打印", "直接打印"],
        directprintall: ["20", "eb_printall.gif", "e表控件直接打印所有页", "直接打印所有页"],
        printall: ["20", "eb_printall.gif", "e表控件打印所有页", "打印所有页"],
        expexcel: ["20", "ef_design_excel.gif", "分页导出到excel文件中", "导出excel"],
        expexcelall: ["20", "eb_excelone.gif", "不分页导出到excel文件中", "导出excel"],
        exppdf: ["20", "eb_exppdf.gif", "导出所有页到pdf文件中", "导出pdf"],


        ok: ["55", "ef_run_button_ok1.gif", "提交数据成功后刷新上一窗口", "确定"],
        close: ["55", "ef_run_button_close1.gif", "关闭窗口", "取消"],
        openwinadd: ["55", "ef_run_button_add.gif", "打开窗口新增记录", "增加"],
        add: ["55", "ef_run_button_add.gif", "新增", "新增"],
        del: ["55", "ef_run_button_del.gif", "删除", "删除"],
        griddel: ["55", "ef_run_button_del.gif", "删除行且删除记录", "删除"],
        edit: ["55", "ef_run_button_edit.gif", "修改保存", "修改"],
        save: ["55", "ef_run_button_save.gif", "提交数据成功后提示", "保存"],
        saveadd: ["92", "ef_run_button_saveadd.gif", "提交数据成功后新增", "保存后新增"],

        seeview: ["65", "ef_run_button_addrow.gif", "查看视图", "查看视图"],
        addview: ["65", "ef_run_button_add.gif", "新增视图", "新增视图"],
        editview: ["65", "ef_run_button_edit.gif", "编辑视图", "编辑视图"],
        selall: ["65", "ef_run_button_allsel.gif", "全选", "全选"],
        noselall: ["65", "ef_run_button_noallsel.gif", "全不选", "全不选"],

        addrow: ["65", "ef_run_button_addrow.gif", "增加行", "增加行"],
        deleterow: ["65", "ef_run_button_deleterow.gif", "删除行", "删除行"],
        query: ["55", "ef_run_button_query.gif", "查询", "查询"],
        first: ["64", "ef_run_button_first.gif", "第一页", "第一页"],
        up: ["60", "ef_run_button_up1.gif", "上一页", "上一页"],
        down: ["60", "ef_run_button_down1.gif", "下一页", "下一页"],
        last: ["64", "ef_run_button_last.gif", "最后页", "最后页"],
        upmove: ["60", "ef_run_button_up_move.gif", "上移", "上移"],
        downmove: ["60", "ef_run_button_down_move.gif", "下移", "下移"],
        closewin: ["64", "ef_run_button_closewin.gif", "关闭窗口", "关闭"],
        wf_tempsave: ["64", "ef_run_button_closewin.gif", "只保存业务数据", "暂存"],
        wf_save: ["64", "ef_run_button_closewin.gif", "提交业务数据并执行流程", "执行"],
        wf_save1: ["64", "ef_run_button_closewin.gif", "提交业务和流程后转下一步", "执行"],
        wf_save2: ["64", "ef_run_button_closewin.gif", "提交业务和流程后关闭窗口", "执行"],
        wf_save3: ["64", "ef_run_button_closewin.gif", "提交业务和流程后无操作", "执行"],
        wf_flowsave: ["64", "ef_run_button_closewin.gif", "只执行流程的动作", "执行"],
        wf_flowsave1: ["64", "ef_run_button_closewin.gif", "只执行流程的动作后转下一步", "执行"],
        wf_flowsave2: ["64", "ef_run_button_closewin.gif", "只执行流程的动作后关闭窗口", "执行"],
        wf_flowsave3: ["64", "ef_run_button_closewin.gif", "只执行流程的动作后无操作", "执行"],
        wf_trace: ["64", "ef_run_button_closewin.gif", "流程的轨迹图", "轨迹"],
        wf_free_select: ["64", "ef_run_button_closewin.gif", "请选择自由流", "自由流"],
        wf_suspended: ["64", "ef_run_button_closewin.gif", "挂起流程实例", "挂起"],
        wf_killed: ["64", "ef_run_button_closewin.gif", "终止流程实例", "终止"]
    },      //运行表单的工具栏中的所有系统内置按钮.
    repMark: { //界面名称替换标志
        role: "角色",
        role1: "角色",
        group: "群组"

    },
    sendHttpErrMsg: ":与后台连接出错:", //特定的连后台出错信息

    area: null, // eform的设计区,是个div元素.
    dsMain: "DsMain", 	//主数据集即未绑定到表格的第一个数据集的ID
    pubSession: "null", //取得session的标识,这是为了用同步方式取session的方法,常用写法是: username=&deptname=
    autoAddField: "no", 	//为yes表示新建表单时是否自动加一个主数据集，以及加控件时自动加字段。 
    pubdataSrc: "", 		//保存各子窗口的url,下同
    topicSrc: "",
    keyValue: "",       //原来的pubdjbh,用于跟踪主键字段的值
    obj: null,     //原来的pubDataSet,用于在表单之间传递对象参数时用.
    isEdit: false,    //原来的pubEdit,判断表单是否手动修改过的标志.
    enterStatus: "OK", 	//判断能不能进入表单,为OK表示可以进入.
    arrValidObj: new Array(), //保存校验失败的事件对象,用于在保存前再校验.
    controls: new Object(),         //取表单上的所有控件,

    //   reportTempFilePath : "/ebsys/ebtmpfile/file/", //报表临时文件路径
    wfToolbar: "newwf,openfile,save,saveas,|,cut,copy,paste,undo,redo,|,front,behind,wfprop,|,cbozoom,br,wfstep,wfline", //流程设计器工具栏
    labelInputTag: " <font color=red>*</font>", //必须输入时,在label上做的标识,一般为红色的 * 
    userDir: "/fceformext", //用户自定义数据的基目录
    keyFieldValueTag: ":get_keyfield", //用于替换主键字段值的标识 
    cardWinUrl: "", //用于在列表式表单中传递要打开的卡片式表单的URL或djsn.
    eventBefore: new Array(), //工具栏上按钮的事件
    eventAfter: new Array(),
    submitUserType: null, //传给提交函数的用户自用的分类
    submitPubParam: null, //传给提交函数的全局参数
    transRecNo: 0,   //数据集中用于保存前转换事件中取当前记录号
    loadingHttpArr: new Array(), //
    loadingHttpData: "",

    loading: null,     //记录表单打开时的装入过程
    encoding: "gb2312", //前台的字符集名称.
    getServerTimeTag: ":get_server_time", // 取服务器时间的替换标识,
    nullValue: ":null", //表示数据库中的null值

    isDebug: true, //是否能进入用vs工具来调试js代码, 如为false则只是记录错误日志,不会显示错误,被try catch掉了.
    loggerObj: null,
    logger: function() { //日志
        return {
            debug: function(msg, _callee, e) {
                return; //不要日志，因为在带工具栏的页面中用时下面的行会出错。2013-06-07
                if (parent.fcpubdata.loggerObj == null) return;
                if (typeof (_callee) == "function") msg = " " + getCurRunFunctionName(_callee.caller) + "() " + getCurRunFunctionName(_callee) + "() " + msg;
                parent.fcpubdata.loggerObj.debug(msg);
            },
            info: function(msg, _callee, e) {
                if (parent.fcpubdata.loggerObj == null) return;
                if (typeof (_callee) == "function") msg = " " + getCurRunFunctionName(_callee.caller) + "() " + getCurRunFunctionName(_callee) + "() " + msg;
                parent.fcpubdata.loggerObj.info(msg, e);
            },
            warn: function(msg, _callee, e) {
                if (parent.fcpubdata.loggerObj == null) return;
                if (typeof (_callee) == "function") msg = " " + getCurRunFunctionName(_callee.caller) + "() " + getCurRunFunctionName(_callee) + "() " + msg;
                parent.fcpubdata.loggerObj.warn(msg, e);
            },
            error: function(msg, _callee, e) {
                return;
                if (parent.fcpubdata.loggerObj != null) {
                    if (typeof (_callee) == "function") msg = " " + getCurRunFunctionName(_callee.caller) + "() " + getCurRunFunctionName(_callee) + "() " + msg;
                    parent.fcpubdata.loggerObj.error(msg, e);
                }
                if (fcpubdata.isDebug && e != undefined) throw e;
            }
        }
    },
    noPermitTag: "*N/A*", //没有权限时显示的标记，2012-09-04
    querySelectTag: "*请选择*", //查询条件选择输入时的标记，2012-09-28
    owneridHead: "fc_owner_id_", //记录级权限控制时，字段名的前缀，2012-11-02
    fc_org_all_id: "fc_org_all_id_", //记录级权限控制时，字段名的前缀，2013-05-22

    eformPrintIframeName: "fcEbiaoPrnIframe", //在eform中打印ebiao控件时加的隐藏iframe名称

    tmpDomainPath: "http://192.168.1.161/fcbug", //="http://localhost/fcbug"或是="http://demo.fcsoft.com.cn:9090/fcbug" http://192.168.1.161/fcbug
    validEventObj: null, //用于记住数据集中的数据验证事件的对象

    genArrObj: new Array(), //表单布局模版的生成程序中用的对象.
    genEventObj: new Object(), //表单布局模版的生成程序中用的对象.用于事件代码中取.

    pubObj: new Object(), //通用的对象，供用户自由定义全局变量用，不固定有某个作用。
    topWinObj: new Object(), //通用的对象，供用户自由定义全局变量用，不固定有某个作用。仅在顶层窗口中用，供两个分离的窗口中交换对象变量用，比如用于交换查询条件
    elList: null, //明细表类E表对象。
    elCard: null, //卡片式表单中类E表对象。
    oldWidgets: "SKButton,SKDBedit,checkbox,label,radio,listbox,textarea,combobox,password,upload,SKDBtext,chart,dbimg,img,SKBILLgrid,shape,tab,div,DsMain_field,a,button,text,hr,checkboxlist,radiolist,dropdownlist,grid,dataset,spin,excel,tree,ebshow,ebiao,layout,page,eblayout", //原来的控件
    isModalUser: Sys.Browser.agent != Sys.Browser.InternetExplorer, //是否用自己做的模态窗口。true,//
    runParams: new Array(), //表单运行参数
    popup: null, //window.createPopup() //等待窗口
    keyScene: "电脑" //场景关键字

};

(function() {
	//计算路径	
	var tmp12345 = GetUrlFirstPart();
	fcpubdata.servletPath = tmp12345+fcpubdata.servletPath;
	fcpubdata.path = tmp12345+fcpubdata.path;
	//alert(fcpubdata.servletPath + "---" + fcpubdata.path );

	var scripts = [fcpubdata.path + "/fceform/js/fcskins.js", fcpubdata.path + "/fceform/js/fcvalid.js"];
	var heads = document.getElementsByTagName("head");
	if(heads.length>0){
	    for (var i = 0; i < scripts.length; ++i) {
		    var script = document.createElement("script");
		    //script.charset="gb2312";
		    script.src = scripts[i];
		    heads[0].appendChild(script);
	    }
    }
/*
    //建立日志对象
    fcpubdata.loggerObj = log4javascript.getLogger();
   // var popUpAppender = new log4javascript.PopUpAppender();
   // var popUpLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p - %m%n");
   // popUpAppender.setLayout(popUpLayout);
   // fcpubdata.logger.addAppender(popUpAppender);
    var ajaxAppender = new log4javascript.AjaxAppender(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=logger");
    ajaxAppender.setThreshold(log4javascript.Level.ERROR);
    ajaxAppender.setTimed(true);
    ajaxAppender.setTimerInterval(60000); //ms毫秒
 //   ajaxAppender.setBatchSize(10); //一次10条
    ajaxAppender.setSendAllOnUnload(true);

    //alert(ajaxAppender.getBatchSize(3))
    //var xmlLayout = new log4javascript.XmlLayout();
   // ajaxAppender.setLayout(log4javascript.XmlLayout());
    fcpubdata.loggerObj.addAppender(ajaxAppender);
    //fcpubdata.logger.debug("Debugging message (appears in pop-up)");
*/
})();

/**
* 取当前URL的第一节内容,一般是虚拟目录的内容,如: /WebBill
* 如直接发布到root目录下,不加虚拟目录的话,则让此函数固定返回"".
**/
function GetUrlFirstPart(){
	var tmp12345 = location.pathname ;
	tmp12345 = tmp12345.substring(0,tmp12345.indexOf("/",1));
	if(tmp12345.substring(0,1) != "/") tmp12345 = "/" +tmp12345;
	return tmp12345;
}
//------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------
//下面开始

Type.registerNamespace("Eapi");
Type.registerNamespace("Eform");
Eapi.UserData = function() {}
Eapi.UserData.prototype = 
{
    save : function (Main,Sub,strContent){
        /**
        *把数据存到数据缓存中
        *@param Main 为主key, 如"List".
        *@param Sub 为子key,如"CustomerFlag"
        *@param strContent 为要存入的内容
        *@return 无返回
        */
	    try{
    	    userData=parent.pubdata.oForm.oInput ;
	    }catch(e){return;}
	    userData.setAttribute(Main+userData.value,strContent) ;
	    userData.save(Sub+userData.value) ;
    },
    load : function (Main,Sub){
        /**
        *从数据缓存中装入到变量中
        *@param Main 为主key, 如"List".
        *@param Sub 为子key,如"CustomerFlag"
        *@return 返回取出的内容
        */
	    try{
		    userData=parent.pubdata.oForm.oInput ;
	    }catch(e){return "";}
	    userData.load(Sub+userData.value)   ;
	    var sTmp=userData.getAttribute(Main+userData.value) ;
	    if (sTmp==null) {sTmp="" ; } 
	    return sTmp ;

    }
}
Eapi.UserData.registerClass("Eapi.UserData");

Eapi.Num = function(){}
Eapi.Num.prototype = 
{
    toFloat : function (str1){
        /// <summary>字符型变实数，用于用户自定义函数用，如字符为空则为0</summary>
        /// <param name="str1" type="String" >要转换的字符串</param>
        /// <returns type="Float" >转换后的数值</returns>
	    var s1=new Eapi.Str().trim(str1);
	    var f1=parseFloat(s1);
	    if(isNaN(f1)) {return 0;}
	    return f1;
    },
    toInt : function (str1){
        /**
        转换成整数
        *@date 2004-08-17
        **/
	    var s1=new Eapi.Str().trim(str1);
	    //if(s1.charAt(0)=="0") s1 = s1.substring(1,s1.length);
	    var f1=parseInt(s1,10);
	    if(isNaN(f1)) {return 0;}
	    return f1;
    },
    format : function (sValue,sPointNum) {
        /**
        *按小数位数格式化字符
        *@param sValue 为要格式化的字符串,
        *@param sPointNum 为小数位数,整型
        *@return 返回格式化后的字符串
        */
	    var dblValue=parseFloat(sValue) ;
	    if (isNaN(dblValue)) {return sValue ;}
	    var iPointNum=parseInt(sPointNum);
	    if (isNaN(iPointNum)) { iPointNum=0 ;}
	    if (iPointNum>9){ iPointNum=9 ;}
	    if (iPointNum<0){ iPointNum=0 ;}
	    var dbl1=Math.round(dblValue*Math.pow(10,iPointNum))/Math.pow(10,iPointNum) ;
	    var s1=dbl1+"" ;
	    var num0=0 ;
	    if(s1.indexOf(".")==-1){
		    num0=iPointNum ;
	    }
	    else {
		    var num1=s1.length-s1.indexOf(".")-1 ;
    		
		    if(num1<iPointNum ){
			    num0=iPointNum-num1 ; 
		    }
	    }

	    if (num0>0) {
		    var s2="000000000000000" ;
		    if(num0==iPointNum) {
			    s1=s1+"."+s2.substring(0,num0) ;
		    }else {
			    s1=s1+s2.substring(0,num0);
		    }
	    }
	    //if (right(s1,1)==".")
	    //	s1=s1.substring(s1.length-1,s1.length)
	    return s1 ;
    }
}
Eapi.Num.registerClass("Eapi.Num");

Eapi.DateParse = function(){}
Eapi.DateParse.prototype = 
{
    parse : function (strDate){
        /// <summary>字符型变日期，支持几种常见的日期格式</summary>
        /// <param name="strDate" type="String" >要转换成日期的字符串</param>
        /// <returns type="Date" >转换后的日期</returns>
        strDate = strDate.trim();
        var format = ["yyyy-MM-dd","yyyy-M-d","yyyy/MM/dd","yyyy/M/d","yyyy.MM.dd","yyyy.M.d","yyyyMMdd","yyyyMd","yyyy年MM月dd日","yyyy年M月d日" ];
        var timeFormat = ["HH:mm", "H:m", "hh:mm", "h:m", "HH:mm:ss", "H:m:s", "hh:mm:ss", "h:m:s", "hh:mm:ss tt", "hh:mm:ss t", "h:m:s tt", "h:m:s t", "hh:mm:ss.f", "hh:mm:ss.ff", "hh:mm:ss.fff"];
        var ret=null,i=0;
        for(i=0;i<format.length;i++){
	        ret = Date.parseInvariant(strDate,format[i]);
	        if(ret != null) return ret;
	    }
        for(i=0;i<format.length;i++){
	        for(var j=0;j<timeFormat.length;j++){
	            ret = Date.parseInvariant(strDate,format[i]+" "+timeFormat[j]);
	            if(ret != null) return ret;
	        }
	    }
    }
}
Eapi.DateParse.registerClass("Eapi.DateParse");


Eapi.Str = function(){}
Eapi.Str.prototype =
{
    trim: function(strMain) {
        //滤掉两边空格
        if (strMain == null) { return ""; }
        strMain = strMain + "";
        return strMain.trim();
    },
    isTrue: function(svalue) {
        /**
        *判断是否为true值
        *@date 2005-01-14
        **/
        if (svalue == false || svalue == "false" || svalue == "False" || svalue == "no" || svalue == 0 || svalue == "0" || svalue == "off" || svalue == "否" || svalue == "假" || svalue == "" || typeof (svalue) == "undefined" || svalue == "undefined" || svalue == null || svalue == "null") // 2012-12-23 加上 || svalue == "null"
            return false;
        else
            return true;
    },
    isSpace: function(strMain) {
        /**
        *判断是否为空
        **/
        var strComp = strMain;
        try {
            if (strComp == "　" || strComp == "" || strComp == " " || strComp == null || strComp == "null" || (typeof (strComp) == "string" && strComp.length == 0) || typeof strMain == "undefined" || strMain == "undefined") {
                return true;
            }
            else {
                return false;
            }
        } catch (e) { return false; }
    },
    isBackErrInfo: function(sRet) {
        ///是否是后台返回的错误信息
        return IsSpace(sRet) == false && sRet.substring(0, 12) == '{"errInfo":"';
    },
    repStr: function(mainStr, findStr, replaceStr) {
        /**
        //多次替代字符串

        **/
        if (typeof (mainStr) == "undefined" || mainStr == null) { return ""; }
        
        mainStr = mainStr + ""; //强制变成字符型
        var convertedString = mainStr.split(findStr);
        convertedString = convertedString.join(replaceStr);
        return convertedString;
    },
    repNewLine: function(sRun) {
        /**
        *替换换行符
        **/
        return RepStr(sRun, "\r\n", "&#13;&#10;");
    },
    unRepNewLine: function(sRun) {
        return RepStr(sRun, "&#13;&#10;", "\r\n");
    },
    repXml: function(sRun) {
        /**
        //替代非法XML字符	
        **/
        sRun = RepStr(sRun, "&", "&amp;");
        sRun = RepStr(sRun, ">", "&gt;");
        sRun = RepStr(sRun, "<", "&lt;");
        return sRun;
    },
    unRepXml: function(sSql) {
        /**
        //转回原串	
        **/
        sSql = RepStr(sSql, "&lt;", "<");
        sSql = RepStr(sSql, "&gt;", ">");
        sSql = RepStr(sSql, "&amp;", "&");
        return sSql;
    },
    getDsnSql: function(oSql) {
        ///取得sql及datasourceName
        var sSql = "";
        var sDsn = ""
        if (typeof (oSql) == "object") {
            sSql = oSql.sql;
            if (IsSpace(oSql.datasourceName) == false)
                sDsn = "&datasourceName=" + oSql.datasourceName;
        } else {
            sSql = oSql;
        }
        sSql = RepOpenSql(sSql);
        return { sql: sSql, dsn: sDsn };
    },
    repMark: function(sTitle) {
        var propName; //替换字段中文名中的特别标识.
        for (propName in fcpubdata.repMark) {
            sTitle = RepStr(sTitle, "${" + propName + "}", fcpubdata.repMark[propName])
        }
        return sTitle;
    },
    genWhere: function(fieldName, fieldType, fieldValue, isLike) {
        ///生成一节where, 2012-09-27
        var sQuot = "'";
        var sQuotEnd = "'";
        if (fieldType == "整数" || fieldType == "实数") {
            sQuot = "";
            sQuotEnd = "";
        }
        if (fieldType == "日期" && fcpubdata.databaseTypeName == "oracle") {
            sQuot = "to_date('";
            sQuotEnd = "','yyyy-mm-dd')";
        }
        var sValue = fieldValue;
        if (sQuot == "" && sQuotEnd == "" && sValue == "") sValue = "0";
        if (isLike)
            return fieldName + " like " + sQuot + sValue + "%" + sQuotEnd;
        else
            return fieldName + "=" + sQuot + sValue + sQuotEnd;

    },
    bigMoney: function(value) {
        /**
        *金额转换成大写
        *@date 2003-12-10
        **/
        var intFen, i;
        var strArr, strCheck, strFen, strDW, strNum, strBig, strNow;

        if (new Eapi.Str().trim(value) == "") {   //数据为空时返回"零"
            return "零";
        }
        if (isNaN(value))   //数据非法时提示，并返回空串
        {
            strErr = "数据" + value + "非法！";
            alert(strErr);
            return "";
        }
        strCheck = value + ".";
        strArr = strCheck.split(".");
        strCheck = strArr[0];
        var len = strCheck.length;
        if (len > 12)   //数据大于等于一万亿时提示无法处理
        {
            strErr = "数据" + value + "过大，无法处理！";
            alert(strErr);
            return "";
        }
        try {
            i = 0;
            strBig = "";
            var s00 = "00";
            var svalue = value + "";
            var ipos = svalue.indexOf(".");
            var iiLen = svalue.length;
            if (ipos < 0) {  //没有小数位
                strFen = svalue + "00";
            } else if (ipos == iiLen - 2) { //只有一位小数
                strFen = svalue.substring(0, iiLen - 2) + svalue.substring(iiLen - 1, iiLen) + "0";
            } else if (ipos == iiLen - 3) { //只有2位小数
                strFen = svalue.substring(0, iiLen - 3) + svalue.substring(iiLen - 2, iiLen);
            } else { //有2位以上的小数位
                strFen = svalue.substring(0, ipos) + svalue.substring(ipos + 1, ipos + 3);
            }
            //intFen = value*100;          //转换为以分为单位的数值
            //strFen = intFen.toString();
            //strArr = strFen.split(".");
            //strFen = strArr[0];
            intFen = strFen.length;      //获取长度
            strArr = strFen.split(""); //将各个数值分解到数组内
            while (intFen != 0)   //分解并转换
            {
                i = i + 1;
                switch (i)              //选择单位
                {
                    case 1: strDW = "分"; break;
                    case 2: strDW = "角"; break;
                    case 3: strDW = "元"; break;
                    case 4: strDW = "拾"; break;
                    case 5: strDW = "佰"; break;
                    case 6: strDW = "仟"; break;
                    case 7: strDW = "万"; break;
                    case 8: strDW = "拾"; break;
                    case 9: strDW = "佰"; break;
                    case 10: strDW = "仟"; break;
                    case 11: strDW = "亿"; break;
                    case 12: strDW = "拾"; break;
                    case 13: strDW = "佰"; break;
                    case 14: strDW = "仟"; break;
                }
                switch (strArr[intFen - 1])              //选择数字
                {
                    case "1": strNum = "壹"; break;
                    case "2": strNum = "贰"; break;
                    case "3": strNum = "叁"; break;
                    case "4": strNum = "肆"; break;
                    case "5": strNum = "伍"; break;
                    case "6": strNum = "陆"; break;
                    case "7": strNum = "柒"; break;
                    case "8": strNum = "捌"; break;
                    case "9": strNum = "玖"; break;
                    case "0": strNum = "零"; break;
                }

                //处理特殊情况
                strNow = strBig.split("");
                //分为零时的情况
                if ((i == 1) && (strArr[intFen - 1] == "0")) {
                    strBig = "整";
                }
                //角为零时的情况
                else if ((i == 2) && (strArr[intFen - 1] == "0")) {    //角分同时为零时的情况
                    if (strBig != "整")
                        strBig = "零" + strBig;
                }
                //元为零的情况
                else if ((i == 3) && (strArr[intFen - 1] == "0")) {
                    strBig = "元" + strBig;
                }
                //拾－仟中一位为零且其前一位（元以上）不为零的情况时补零
                else if ((i < 7) && (i > 3) && (strArr[intFen - 1] == "0") && (strNow[0] != "零") && (strNow[0] != "元")) {
                    strBig = "零" + strBig;
                }
                //拾－仟中一位为零且其前一位（元以上）也为零的情况时跨过
                else if ((i < 7) && (i > 3) && (strArr[intFen - 1] == "0") && (strNow[0] == "零"))
                { }
                //拾－仟中一位为零且其前一位是元且为零的情况时跨过
                else if ((i < 7) && (i > 3) && (strArr[intFen - 1] == "0") && (strNow[0] == "元"))
                { }
                //当万为零时必须补上万字
                else if ((i == 7) && (strArr[intFen - 1] == "0")) {
                    strBig = "万" + strBig;
                }
                //拾万－仟万中一位为零且其前一位（万以上）不为零的情况时补零
                else if ((i < 11) && (i > 7) && (strArr[intFen - 1] == "0") && (strNow[0] != "零") && (strNow[0] != "万")) {
                    strBig = "零" + strBig;
                }
                //拾万－仟万中一位为零且其前一位（万以上）也为零的情况时跨过
                else if ((i < 11) && (i > 7) && (strArr[intFen - 1] == "0") && (strNow[0] == "万"))
                { }
                //拾万－仟万中一位为零且其前一位为万位且为零的情况时跨过
                else if ((i < 11) && (i > 7) && (strArr[intFen - 1] == "0") && (strNow[0] == "零"))
                { }
                //万位为零且存在仟位和十万以上时，在万仟间补零
                else if ((i < 11) && (i > 8) && (strArr[intFen - 1] != "0") && (strNow[0] == "万") && (strNow[2] == "仟")) {
                    strBig = strNum + strDW + "万零" + strBig.substring(1, strBig.length);
                }
                //单独处理亿位
                else if (i == 11) {
                    //亿位为零且万全为零存在仟位时，去掉万补为零
                    if ((strArr[intFen - 1] == "0") && (strNow[0] == "万") && (strNow[2] == "仟")) {
                        strBig = "亿" + "零" + strBig.substring(1, strBig.length);
                    }
                    //亿位为零且万全为零不存在仟位时，去掉万
                    else if ((strArr[intFen - 1] == "0") && (strNow[0] == "万") && (strNow[2] != "仟")) {
                        strBig = "亿" + strBig.substring(1, strBig.length);
                    }
                    //亿位不为零且万全为零存在仟位时，去掉万补为零
                    else if ((strNow[0] == "万") && (strNow[2] == "仟")) {
                        strBig = strNum + strDW + "零" + strBig.substring(1, strBig.length);
                    }
                    //亿位不为零且万全为零不存在仟位时，去掉万	
                    else if ((strNow[0] == "万") && (strNow[2] != "仟")) {
                        strBig = strNum + strDW + strBig.substring(1, strBig.length);
                    }
                    //其他正常情况
                    else {
                        strBig = strNum + strDW + strBig;
                    }
                }
                //拾亿－仟亿中一位为零且其前一位（亿以上）不为零的情况时补零
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] == "0") && (strNow[0] != "零") && (strNow[0] != "亿")) {
                    strBig = "零" + strBig;
                }
                //拾亿－仟亿中一位为零且其前一位（亿以上）也为零的情况时跨过
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] == "0") && (strNow[0] == "亿"))
                { }
                //拾亿－仟亿中一位为零且其前一位为亿位且为零的情况时跨过
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] == "0") && (strNow[0] == "零"))
                { }
                //亿位为零且不存在仟万位和十亿以上时去掉上次写入的零
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] != "0") && (strNow[0] == "零") && (strNow[1] == "亿") && (strNow[3] != "仟")) {
                    strBig = strNum + strDW + strBig.substring(1, strBig.length);
                }
                //亿位为零且存在仟万位和十亿以上时，在亿仟万间补零
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] != "0") && (strNow[0] == "零") && (strNow[1] == "亿") && (strNow[3] == "仟")) {
                    strBig = strNum + strDW + "亿零" + strBig.substring(2, strBig.length);
                } else {
                    strBig = strNum + strDW + strBig;
                }
                strFen = strFen.substring(0, intFen - 1);
                intFen = strFen.length;
                strArr = strFen.split("");
            }
            if (strBig == "整") { strBig = "零"; }
            return strBig;
        } catch (err) {
            return "";      //若失败则返回原值
        }
    },

    repOpenSql: function(sql, slikevalue) {
        /**

        替代打开的sql语句中的 :
        查找方式: 以:号开头,结尾为) ,
        取当前用户内码用 :get_userid
        取当前日期用 :get_curdate
        :DsMain.field1 
        *@date 2004-03-23
        **/

        //alert("sql:"+sql)
        if (isSpace(sql)) { return ""; }
        if (fcpubdata.databaseTypeName == "mysql") {
            sql = new Eapi.Str().trim(sql);
            if (sql.substring(0, 4).toUpperCase() == "EXEC") {
                alert("因mysql数据库不支持存储过程!故无法使用此功能!");
                return sql;
            }
        }


        //因正则表达式中用pubDataSet['DsMain']有问题,故用pubDsMain = fcpubdata.obj['DsMain'] pubdssub1 = fcpubdata.obj['dssub1']
        /*
        try{
        var pubDsMain = fcpubdata.obj['DsMain'] ;
        }catch(E){}
        try{	
        var pubdssub1 = fcpubdata.obj['dssub1'] ;
        }catch(E){}
        */
        //将回车换行符变成空格,以免正则表达式匹配出错
        //alert("a:"+sql)

        sql = repStr(sql, "\r\n", " ");
        //alert("s:"+sql);
        //CopyToPub(sql)

        //将关键字 {单引号}  ==> ' 2008-03-27 add
        sql = repStr(sql, "{单引号}", "'");
        //先替换掉以 :{ 和 }: 之间 js变量的值 2008-02-28

        var arrTmp = sql.split(":{");
        if (arrTmp.length > 1) {
            var pos = 0;
            var retSql = new Sys.StringBuilder();
            retSql.append(arrTmp[0]);
            for (var k = 1; k < arrTmp.length; k++) {
                pos = arrTmp[k].indexOf("}:");
                if (pos >= 0) {
                    retSql.append(eval(arrTmp[k].substring(0, pos)));
                    retSql.append(arrTmp[k].substring(pos + 2, arrTmp[k].length));
                } else {
                    alert("sql语句中的 :{ 没有和 }: 相匹配!");
                    return sql;
                }
            }
            sql = retSql.toString();
        }

        var posStart = 0;
        var posEnd = 0;
        var ret = "";
        var re = new RegExp();
        re.compile("(:[a-zA-Z0-9_\.\$]*)([), =+%']|$|\s)", "gi");
        var sInput = sql;
        var nextpoint = 0;
        while ((arr = re.exec(sInput)) != null) {
            //alert(arr.index + "-" + arr.lastIndex + " |" + arr[0]+"|"+ " |" + RegExp.$1+"|");
            posEnd = arr.index;
            var s1 = RegExp.$1;
            var sRep = "";
            //if(s1==":get_userid"){
            //    sRep="'"+new Eapi.Str().trim(getuser())+"'";
            //}else 

            if (s1 == ":v_get") {
                sRep = slikevalue;
                //}else if(s1==":get_date"){
                //    sRep="'"+getdate()+"'";
                //}else if(s1==":get_time"){
                //    sRep="'"+getTime()+"'";
                //}else if(s1==":get_datetime"){
                //    sRep="'"+getdatetime()+"'";
                //}else if(s1==":get_jgid"){
                //	sRep="'"+getCookie('jgid')+"'";
                //}else if(s1==":get_bmid"){
                //	sRep="'"+getCookie('bmid')+"'";
                //}else if(s1.substring(0,2) == ":$"){
                //支持变量名
                //    sRep= eval(s1.substring(2,s1.length)) ;
                //    sRep=sRep;
            } else {
                //alert(s1)
                var arr2 = s1.split(".");
                if (arr2.length == 1) {
                    if (s1 == ":key_value") {
                        sRep = "'" + fcpubdata.keyValue + "'";
                    } else { //考虑到sql语句中如有 2006-01-01 01:01:01 时会出错,因而固定写法为 :key_value
                        sRep = s1;
                    }
                } else {
                    //前面为数据集名后面为字段名
                    var stmp1 = arr2[0].substring(1, arr2[0].length);
                    if (arr2.length == 3) stmp1 = stmp1 + "." + arr2[1];
                    var oDs = eval(stmp1);
                    if (oDs != null) {
                        if (oDs.Empty == "null") {
                            sRep = "''";
                        } else {
                            var stmpField = arr2[1];
                            if (arr2.length == 3) stmpField = arr2[2];
                            try {
                                sRep = "'" + oDs.Field(stmpField).Value + "'";
                            } catch (E) {
                                //if(oDs.Empty == "null"){
                                //	alert("数据集"+stmp1+"尚未打开,此时无法取其字段值.");
                                //}else{
                                alert(stmp1 + "中不存在字段" + stmpField); sRep = "'" + "'";
                                //}
                            }
                        }
                    }
                }
            }

            ret += sql.substring(posStart + nextpoint, posEnd + nextpoint);
            ret += sRep;
            posStart = arr.index + s1.length;
            //nextpoint=nextpoint+arr.index+s1.length
            //sInput=sql.substr(nextpoint)

        }
        if (ret == "") {
            ret = sql;
        } else if (posStart <= sql.length) {
            ret += sql.substring(posStart, sql.length);
        }
        //alert("ret:"+ret)
        if (isSpace(ret)) { ret = ""; }
        return ret;
    },
    removeRoot: function(strX) {
        /**
        * 去掉根结点标记
        * 13==>15 -7==>-9 是指结尾用换行回车符
        *@param strX 为要处理前的字符串,
        *@return 返回处理后的字符串
        */
        if (strX.length > 13) {
            strX = strX.substring(6, strX.length - 7);
            return strX;
        } else {
            return "";
        }
    },
    copyToPub: function(str) {
        /**
        *将字符串写到粘贴版上
        *@date 2004-02-20
        **/
        window.clipboardData.setData("Text", str);
    },
    showHelp: function(htmlfile) {
        /**
        *显示帮助页面
        *@para htmlfile 帮助页面的HTM文件名
        *@date 2005-07-25
        **/
        //alert(fcpubdata.path+"/eformhelp/" + htmlfile + ".htm");
        window.open(fcpubdata.path + "/eformhelp/" + htmlfile + ".htm", "_blank", "top=0,left=0,height=400,width=300,status=no,toolbar=yes,menubar=no,location=no,resizable=yes,scrollbars=yes")
    },
    /*showWait: function(displaystr) {
    ///显示等待窗口
    var oPubPopup = fcpubdata.popup;
    var oPubPopupBody = oPubPopup.document.body;
    if (displaystr == "end") {
    oPubPopup.hide();
    } else {
    if (event != null) {
    if (event.srcElement != null) {
    //alert(event.srcElement.tagName)
    if (event.srcElement.tagName.toUpperCase() == "SELECT") return;
    }
    }
    //alert(event.srcElement.outerHTML)
    var strHTML = ""; // "<html><head></head><body leftmargin=0 topmargin=0>";
    strHTML += "<TABLE WIDTH=100% BORDER=0 CELLSPACING=0 CELLPADDING=0><TR><td width=0%></td>";
    strHTML += "<TD bgcolor=#ff9900><TABLE WIDTH=100% height=60 BORDER=0 CELLSPACING=2 CELLPADDING=0>";
    strHTML += "<TR><td bgcolor=#eeeeee align=center>" + displaystr + "</td></tr></table></td>";
    strHTML += "<td width=0%></td></tr></table>";

            oPubPopupBody.innerHTML = strHTML;
    var iwidth = 300;
    var iheight = 60;
    var ileft = (screen.availWidth - iwidth) / 2;
    var itop = (screen.availHeight - iheight) / 2;
    oPubPopup.show(ileft, itop, iwidth, iheight);
    }
    },*/
    setDisabled: function(obj, boolValue) {
        if (boolValue) {
            obj.disabled = true;
        } else {
            obj.disabled = false;
            obj.removeAttribute("disabled");
        }

    },
    comboToStr: function(lstSelField2) {
        /**
        *将一个combo控件的value生成,分隔的一个字符串
        *@date 2006-02-10
        **/
        var sb = new Sys.StringBuilder();
        var len = lstSelField2.options.length;
        for (var i = 0; i < len; i++) {
            var stmp = new Eapi.Str().trim(lstSelField2.options(i).value);
            if (stmp == "") stmp = new Eapi.Str().trim(lstSelField2.options(i).text);
            sb.append(stmp);
            sb.append(",");
        }
        var sV = sb.toString();
        sV = sV.substring(0, sV.length - 1);
        return sV;
    }

}
Eapi.Str.registerClass("Eapi.Str");

Eapi.RunAjax = function(){}
Eapi.RunAjax.prototype =
{
    sendHttp: SendHttp,
    getAllPubParamName: function() {
        ///取到所有全局参数名称
        var pubAllValue = this.getAllPubParamValue();
        if (IsSpace(pubAllValue)) return "";
        var arrRet = new Array();
        var arr = pubAllValue.split(",");
        for (var i = 0; i < arr.length; i++) {
            var arrSub = arr[i].split("=");
            var sName = arrSub[0];
            var arr1 = new Array();
            arr1[0] = sName;
            arr1[1] = "<span style='color:red;'>函数说明：</span><br/>取当前的" + sName + "<br/>";
            arrRet[i] = arr1;
        }
        return arrRet;
    },
    getAllPubParamValue: function() {
        ///取全局参数数据到前台   
        var pubAllValue = top.eformPubParamValue;
        if (typeof (pubAllValue) == "undefined") {
            //需要到后台去取
            pubAllValue = this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getAllPubParamValue", "");

            if (new Eapi.Str().isBackErrInfo(pubAllValue)) {
                alert(pubAllValue); //表示后台出错了
                return "";
            }
            top.eformPubParamValue = pubAllValue;
        }
        //if(pubAllValue == "") return ""; //表示无session变量或是没有设置全局参数名称
        return pubAllValue;
    },
    directLogin: function() {
        ///跨服务器直接登录，2013-08-18   
        //主要工作是根据当前的cookie数据给另一个服务器设置session变量
        var sRet = this.sendHttp(fcpubdata.tmpDomainPath + "/ebsys/eformaspx/WebBill.aspx?key=directLogin", ""); //因为fcbug工程固定是.net版。
        if (!IsSpace(sRet)) {
            alert(sRet);
            return false;
        }
        return true;
    },
    sqlToField: function(oSql) {
        /**
        *通过SQL返回一个字段的第一个记录值,返回类型:字符
        *@param sql 为要处理的字符串,
        *@return 返回一个数组
        */
        var oDsn = new Eapi.Str().getDsnSql(oSql);
        var sXml = "<No>" + RepXml(oDsn.sql) + "</No>";
        var retX = this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=SqlToField" + oDsn.dsn, sXml);
        if (new Eapi.Str().isBackErrInfo(retX)) {
            //运行出错了
            alert(retX);
        }
        return retX;
    },
    /*insertSqls : function (sSql) {
    ///执行多SQL插入
    var retX=this.sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?inserts",sSql);
    return retX;
    },
    insertSql : function (sSql) {
    ///执行插入
    if(fcpubdata.databaseTypeName == "mysql" && sSql.substring(0,4).toUpperCase() == "EXEC" ){
    alert("因mysql数据库不支持存储过程!故无法使用此功能!");
    return "";
    }
    var sXml="<No>"+sSql+"</No>";
    var retX=this.sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?fc_insert",sXml);
    return retX;
    },*/
    selectSql: function(oSql, PageNo, PageSize, callback, context) {
        /**
        *执行查询
        *@param PageNo 页码
        *@param PageSize 页尺寸,即一页含多少行
        *@return 查询结果
        **/
        //if(fcpubdata.databaseTypeName == "mysql" && sSql.substring(0,4).toUpperCase() == "EXEC" ){
        //    alert("因mysql数据库不支持存储过程!故无法使用此功能!");

        //}

        var oDsn = new Eapi.Str().getDsnSql(oSql);
        var sql1 = RepXml(oDsn.sql);
        //CopyToPub(sql1)
        //替代非法XML字符
        var sXml = "<sql>" + sql1 + "</sql>" + "<pageno>" + PageNo + "</pageno>" + "<pagesize>" + PageSize + "</pagesize>";
        var retX = this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=fc_select" + oDsn.dsn, sXml, callback, context);
        return retX;
    },
    getMaxNo: function(sTag, strMK) {
        /**
        *返回最大号
        **/
        return this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getRecnum", "<no>" + sTag + "</no>");
    },
    getMaxIntNo: function(sTag) {
        /**
        *返回最大整数号
        **/
        return this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getMaxIntNo", "<no>" + sTag + "</no>");
    }

}
Eapi.RunAjax.registerClass("Eapi.RunAjax");
Eapi.Dom = function () {}
Eapi.Dom.prototype =
{
    setDom: function(sXml) {
        /**
        *建立XMLDOM对象
        *@param sXml xml字符串
        *@return XML对象
        *@date 2004-03-27
        **/

        //modify by liuxr at 2010-10-12 创建跨浏览器的dom对象
        var oXml = null;
        if (window.ActiveXObject) {
            if (sXml == null) sXml = undefined; //此为了和以前的代码兼容,因 SKbillsheet.contxml == undefined,而 $id("SKbillsheet").getAttribute("contxml") == null 2012-02-09 my add
            oXml = new ActiveXObject('Microsoft.XMLDOM');
            oXml.async = false;
            oXml.loadXML(sXml);
        }
        else {
            if (IsSpace(sXml) || sXml.substring(0,1) != "<") { //此为了和以前的代码兼容
                var o = new Object();
                o.documentElement = null;
                return o;
            }
            parser = new DOMParser();  //IE 不支持 DOMParser对象。相反，它支持使用 Document.loadXML() 的 XML 解析。
            oXml = parser.parseFromString(sXml, "text/xml");
        }
        return oXml;
    },
    setDomFile: function(sPath) {
        /**
        *建立XMLDOM对象
        *@param sPath 服务器端文件的url
        *@return XML对象
        *@date 2005-02-17
        **/

        var oTopWin = getTopWin();
        var isFindTopWin = typeof (oTopWin.fctopdata) != "undefined"; //表示找对了顶层主窗口

        var isBillType = isFindTopWin && sPath.indexOf("billtype.xml") >= 0;
        if (isBillType && oTopWin.fctopdata.billtype != null) return oTopWin.fctopdata.billtype;

        var isBillPos = isFindTopWin && sPath.indexOf("billpos.xml") >= 0;
        if (isBillPos && oTopWin.fctopdata.billpos[sPath] != null) return oTopWin.fctopdata.billpos[sPath];

        var isEconfig = isFindTopWin && sPath.indexOf("econfig.xml") >= 0;
        if (isEconfig && oTopWin.fctopdata.econfig != null) return oTopWin.fctopdata.econfig;

        var bReRead = false;
        var oXml;
        //modify by liuxr at 2010-10-12 创建跨浏览器的dom对象
        if (window.ActiveXObject) {
            try {
                oXml = new ActiveXObject("Msxml2.DOMDocument");
            } catch (e) {

            }
            try {
                if (typeof oXml == "undefined") oXml = new ActiveXObject("Microsoft.XMLDOM");
                oXml.async = false;
                oXml.load(sPath);
            } catch (e) {
                //如出错则改为用ajax方式读 2011-05-06
                bReRead = true;
            }
        }
        else if (document.implementation && document.implementation.createDocument) {
            //oXml = document.implementation.createDocument('','',null);
            oXml = new window.XMLHttpRequest();
            oXml.open("GET", sPath, false);
            oXml.send(null);
            oXml = oXml.responseXML;

        }
        
        if (bReRead || oXml.documentElement == null) {
            sPath = Trim(sPath);
            var sFind = location.protocol + "//" + location.host + fcpubdata.path;
            var pos = sPath.indexOf(sFind);
            if (pos == 0) sPath = sPath.substring(sFind.length, sPath.length);

            sFind = fcpubdata.path;
            pos = sPath.indexOf(sFind);
            if (pos == 0) sPath = sPath.substring(sFind.length, sPath.length);

            sFind = "../..";
            pos = sPath.indexOf(sFind);
            if (pos == 0) sPath = sPath.substring(sFind.length, sPath.length);

            var retX = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=GetFileContent&pathfile=" + escape(sPath), "");

            oXml = SetDom(retX);
            //注释下面三行,以免第一次时会报文件未找到. 2011-10-27
            //if (oXml.documentElement == null) {
            //    alert("读文件 " + sPath + " 出错,或它的内容不是合法的XML格式! 错误信息: " + retX);
            //}
        }
        
        if (isBillType) oTopWin.fctopdata.billtype = oXml; //保存回去.
        if (isBillPos) oTopWin.fctopdata.billpos[sPath] = oXml;
        if (isEconfig) oTopWin.fctopdata.econfig = oXml;
        return oXml;
    }

}
Eapi.Dom.registerClass("Eapi.Dom");
Eapi.Css = function(){}
Eapi.Css.prototype =
{
    actionSkins: function() {
        var oTopWin = top; //取顶层窗口
        if (!IsSpace(parent.dialogArguments)) {
            var arrDjOpen = parent.dialogArguments;
            if (IsSpace(arrDjOpen.length) == false && arrDjOpen.length > 4) {
                oTopWin = arrDjOpen[4];

            }
        }
        if (IsSpace(oTopWin) == false && IsSpace(oTopWin.zkpub) == false) {
            if (IsSpace(oTopWin.zkpub.skin) == false) {
                fcpubdata.skins = oTopWin.zkpub.skin;

            }
        }
        try {
            var tmpSkins = parent.Request.QueryString("skins").toString();
            if (tmpSkins != "undefined") fcpubdata.skins = tmpSkins;
        } catch (ee) { }
        // my add 2013-01-29
        if (fcpubdata.skins != "green" && fcpubdata.skins != "light" && fcpubdata.skins != "base")
            fcpubdata.skins = "blue";

    },
    setSkinsPath: function(sSkins) {
        ///动态调整样式所在路径.
        if (sSkins != "base" && sSkins != "red" && sSkins != "green" && sSkins != "blue" && sSkins != "white" && sSkins != "yellow" && sSkins != "light")
            fcpubdata.skinsPath = fcpubdata.userDir;
    },
    getPart: function(csstext) {
        /**
        分析出CSS中的字体颜色等信息
        csstext1="DISPLAY: block; FONT-WEIGHT: bold; FONT-SIZE: 18px; LEFT: 339px; WIDTH: 48px; COLOR: #000000; FONT-STYLE: italic; FONT-FAMILY: 楷体_GB2312; POSITION: absolute; TOP: 65px; HEIGHT: 12px; BACKGROUND-COLOR: #80ffff" 
        *@date 2004-08-11
        **/
        if (IsSpace(csstext)) return "";
        var sRet = new Sys.StringBuilder();
        var arr = csstext.split(";");
        var l = arr.length;
        for (var i = 0; i < l; i++) {
            var arr1 = arr[i].split(":");
            if (arr1.length != 2) continue;
            var stitle = new Eapi.Str().trim(arr1[0]);
            var svalue = new Eapi.Str().trim(arr1[1]);
            if (stitle == "FONT-WEIGHT" || stitle == "FONT-SIZE" || stitle == "COLOR" || stitle == "FONT-STYLE" || stitle == "FONT-FAMILY" || stitle == "BACKGROUND-COLOR" || stitle == "TEXT-DECORATION") {
                sRet.append(stitle + ":" + svalue + ";");
            }
        }
        return sRet.toString();
    },
    clearPart: function(obj, attrNameJs, attrName) {
        /**
        *清空CSS中的一节
        *@para obj 要处理的对象
        *@para attrName 要清空的属性名
        *@date 2005-04-26
        **/
        if (typeof (obj) == "undefined" || typeof (attrName) == "undefined") return;
        eval("obj.style." + attrNameJs + "='';");
        var s1 = obj.style.cssText;
        attrName = attrName.toUpperCase();
        obj.style.cssText = RepStr(s1, attrName, "");

    },
    changePosition: function(csstext, propName, adjustValue) {
        ///调节一个style字符串中的左顶高宽值,返回调后的结果字符串
        var sRet = new Sys.StringBuilder();
        var arr = csstext.split(";");
        var l = arr.length;
        for (var i = 0; i < l; i++) {
            var arr1 = arr[i].split(":");
            if (arr1.length == 2) {
                var stitle = new Eapi.Str().trim(arr1[0]).toUpperCase();
                if (stitle == propName.toUpperCase()) {
                    var svalue = parseInt(new Eapi.Str().trim(arr1[1]));
                    if (isNaN(svalue)) svalue = 0;
                    sRet.append(arr1[0] + ":" + (svalue + adjustValue - 1));
                } else {
                    sRet.append(arr[i]);
                }
            } else {
                sRet.append(arr[i]);
            }
            sRet.append(";");
        }
        return sRet.toString();

    },
    hideCol: function(oTable, colNo) {
        ///设置列宽为0来隐藏，2012-12-11
        var oTd = oTable.rows[0].cells[colNo];
        if (ToInt(oTd.style.width) > 0) oTd.setAttribute("oldWidth", oTd.style.width);
        oTd.style.width = "0px";

        
//        for (var j = 0; j < oTable.childNodes[0].childNodes.length; j++) {
//        if (oTable.childNodes[0].childNodes[j].getAttribute("pos") == colNo + 1) {
//        oTable.childNodes[0].childNodes[j].setAttribute("oldWidth", oTable.childNodes[0].childNodes[j].style.width);
//        oTable.childNodes[0].childNodes[j].style.width = "0px";
//        break;
//        }
//        }

//        

//        ///隐藏table 的某一列，2012-12-04
//        var l = oTable.rows.length;
//        for (var i = 0; i < l; i++) {
//        if (oTable.rows[i].cells.length <= colNo) continue;
//        oTable.rows[i].cells[colNo].style.display = "none";
//        }

//        var sXml = oTable.getAttribute("colXml");
//        if (sXml == null) sXml = "<root></root>";
//        var oXml = SetDom(sXml);
//        for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
//        if (oXml.documentElement.childNodes[i].getAttribute("pos") == colNo+1) return;
//        }
//        var objCol = null;
//        for (var j = 0; j < oTable.childNodes[0].childNodes.length; j++) {
//        if (oTable.childNodes[0].childNodes[j].getAttribute("pos") == colNo+1) {
//        objCol = oTable.childNodes[0].childNodes[j];
//        break;
//        }
//        }
//        var oNode = SetDom("<col pos=\"" + (colNo+1) + "\" newPos=\"" + j + "\" width=\"" + objCol.style.width + "\" />");
//        oXml.documentElement.appendChild(oNode.documentElement);
//        oTable.setAttribute("colXml", oXml.documentElement.xml);
//        //需要删除col元素
//        oTable.children[0].removeChild(objCol);
//        
    },
    showCol: function(oTable, colNo) {
        ///设置列宽为0来隐藏，2012-12-11
        var oTd = oTable.rows[0].cells[colNo];
        if (ToInt(oTd.getAttribute("oldWidth")) > 0) oTd.style.width = oTd.getAttribute("oldWidth");

        /*
        for (var j = 0; j < oTable.childNodes[0].childNodes.length; j++) {
        if (oTable.childNodes[0].childNodes[j].getAttribute("pos") == colNo + 1) {
        oTable.childNodes[0].childNodes[j].style.width = oTable.childNodes[0].childNodes[j].getAttribute("oldWidth");
        break;
        }
        }

        
        ///显示table 的某一列，2012-12-07
        var l = oTable.rows.length;
        for (var i = 0; i < l; i++) {
        if (oTable.rows[i].cells.length <= colNo) continue;
        oTable.rows[i].cells[colNo].style.display = "";
        }
        var sXml = oTable.getAttribute("colXml");
        if (sXml == null) return;
        var oXml = SetDom(sXml);
        var newPos, oldWidth;
        var bFind = false;
        for (var i = 0; i < oXml.documentElement.childNodes.length; i++) {
        if (oXml.documentElement.childNodes[i].getAttribute("pos") == colNo+1) {
        bFind = true;
        newPos = oXml.documentElement.childNodes[i].getAttribute("newPos") ;
        oldWidth = oXml.documentElement.childNodes[i].getAttribute("width");
        oXml.documentElement.removeChild(oXml.documentElement.childNodes[i]);
        oTable.setAttribute("colXml", oXml.documentElement.xml);
        break;
        }
        }
        if (bFind == false) return;
        //增加col
        var o = document.createElement("colgroup");
        o.style.width = oldWidth;
        o.setAttribute("pos", colNo+1);
        var iPos = oTable.childNodes[0].childNodes.length - 1;
        if (iPos > newPos) iPos = newPos;
        oTable.childNodes[0].insertBefore(o, oTable.childNodes[0].childNodes[iPos]);
        */

    }

}
Eapi.Css.registerClass("Eapi.Css");

Eapi.Upload = function(){}
Eapi.Upload.prototype =
{
    isHave: function() {
        /**
        *判断是否有上传控件
        *@date 2005-01-13
        **/
        try {
            var ooo = $id("upload1");
            if (ooo == null) { return false; }
        } catch (e) {
            //出错表示表单上不存在上传附件的控件.
            return false;
        }
        return true;

    },
    uploadImg: function() {
        /**
        //在图形字段上双击时显示上传模式窗口
        **/

        //还有传UPDATE语句的参数问题
        var oImg = NavJs.getEventObj();
        //表示表单设计状态
        if (oImg.isContentEditable) return;
        //alert("out:"+oImg.id)
        var arr = window.showModalDialog(fcpubdata.path + "/fceform/common/uploadimgmain.htm", oImg, "scroll:no;status:no;dialogHeight:150px;dialogWidth:350px;dialogTop:180;dialogLeft:250px");
        if (typeof arr == "undefined") return;
        //alert(arr[2]);
        
        //modify by liuxr at 2010-10-20 17:55 因在safari浏览器下用<input type="file" name="file"> 上传文件后取file.value时只能去掉文件名而没有文件路径，不能实现预览的效果，所以显示服务器上的路径
        if (navigator.userAgent.indexOf("Safari") > -1) {
            oImg.src = location.protocol + "//" + location.host + fcpubdata.path + arr[2];
        } else {

            //考虑到IE8可能无法直接显示客户端的图片,所以改用显示服务器端的图片, 2010-12-16 my add
            oImg.src = "../.." + arr[2];
        }
        //alert(oImg.field+":"+oImg.src)
        var ods = $obj(oImg.getAttribute("dataset"));
        if (ods != null) {
            if (ods.bAdd == false) ods.bEdit = true;
            ods.Field(oImg.getAttribute("field")).Value = arr[2]; //后台的文件名+/fceformext/res路径
            ods.Field(oImg.getAttribute("field")).valid = "变"; //表示此图片已改动了,要重新上传.

        }

    }

}
Eapi.Upload.registerClass("Eapi.Upload");

Eapi.GetPos = function(){}
Eapi.GetPos.prototype =
{
    getAbsLeft: function(e) {
        /**
        *找到一个对象的绝对位置
        **/
        var l = e.offsetLeft;
        while (e = e.offsetParent) {
            if (e.style.position != "absolute") {
                l += e.offsetLeft;
            } else {
                l += ToInt(e.style.left);
            }
        }
        return l;
    },
    getAbsTop: function(e) {
        var t = e.offsetTop;
        while (e = e.offsetParent) {
            if (e.style.position != "absolute") {
                t += e.offsetTop;
            } else {
                var scrollValue = 0;
                if (e.tagName == "DIV") scrollValue = e.scrollTop; // 2011-06-21
                t += ToInt(e.style.top)-scrollValue;
            }
        }
        return t;
    },
    getPosLeft: function(e) {
        var t = 0;
        while (e = e.parentNode) {
            if (e.style != null && e.style.position == "absolute") break;
            var t1 = e.offsetLeft;
            if (isNaN(t1)) t1 = 0;
            t += t1;
        }
        //        alert("t=" + t);
        return t;
    },
    getPosTop: function(e) {
        var t = 0;
        while (e = e.parentNode) {
            if (e.style != null && e.style.position == "absolute") break;
            var t1 = e.offsetTop;
            if (isNaN(t1)) t1 = 0;
            t += t1;
        }
        //      alert("t=" + t);
        return t;
    }

}
Eapi.GetPos.registerClass("Eapi.GetPos");

Eapi.Session = function(){}
Eapi.Session.prototype =
{
    setSession: function(strQueryString, callback) {
        //设置一个或多个Session变量值
        //strQueryString 如:userid=12&username=liuxm
        //返回值:无
        /*if (document.all("ifrSession") == null) {
        document.body.insertAdjacentHTML("BeforeEnd", "<IFRAME id=ifrSession name=ifrSession src='' width=0 height=0></IFRAME>");

        }
        document.all.ifrSession.src = location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=setSession&" + strQueryString;

        document.all.ifrSession.onreadystatechange = function() {
        if (document.all.ifrSession.readyState != "complete") return;
        if (typeof callback == "function") {
        callback(); //将值传出
        }
        }
        */

        SendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=setSession&" + strQueryString, callback);
    },

    getSession: function(strQueryString, callback) {
        //取到一个或多个Session变量值
        //strQueryString 如:userid=&username=
        //返回数组对象:arrRet["userid"]
        /*	    if(typeof callback == "function"){
        if(strQueryString.substring(strQueryString.length-1,strQueryString.length) != "=") {
        strQueryString = strQueryString+"=";
        }
        if ( document.all("ifrSession") == null ){
        document.body.insertAdjacentHTML("BeforeEnd", "<IFRAME id=ifrSession name=ifrSession src='' width=0 height=0></IFRAME>");
        }
        fcpubdata.pubSession = "null" ; //清空全局变量的值.
        document.all.ifrSession.src=location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion + "?key=getSession&"+strQueryString;
    		
		    document.all.ifrSession.onreadystatechange= function () {
        if(document.all.ifrSession.readyState != "complete") return;
        var arrRet=new Array();
        var arr=fcpubdata.pubSession.split("&");
        var ilen=arr.length;
        for(i=0;i<ilen;i++){
        var arr1=arr[i].split("=");
        arrRet[arr1[0]]=arr1[1];	
        }			
        if(typeof callback == "function"){
        callback(arrRet); //将值传出
        }
        }
        }else{  //取固定的session变量值
        //下面:"userid=12&username=liu" ==> arr
        var arrRet=new Array();
        var arr=parent.fcpubdata.pubSession.split("&");
        var ilen=arr.length;
        for(i=0;i<ilen;i++){
        var arr1=arr[i].split("=");
        arrRet[arr1[0]]=arr1[1];	
        }
        return arrRet;
        }
        */

        if (strQueryString.substring(strQueryString.length - 1, strQueryString.length) != "=") {
            strQueryString = strQueryString + "=";
        }
        if (typeof callback == "function") {
            SendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getSession&" + strQueryString, "", function(result) {
                var sRetValue = result.value;
                //alert(sRetValue)
                var arrRet = new Array();
                var arr = sRetValue.split("&");
                var ilen = arr.length;
                for (var i = 0; i < ilen; i++) {
                    var arr1 = arr[i].split("=");
                    arrRet[arr1[0]] = arr1[1];
                }
                callback(arrRet); //将值传出
            })
        } else {
            var sRetValue = SendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getSession&" + strQueryString, "");
            var arrRet = new Array();
            var arr = sRetValue.split("&");
            var ilen = arr.length;
            for (var i = 0; i < ilen; i++) {
                var arr1 = arr[i].split("=");
                arrRet[arr1[0]] = arr1[1];
            }
            return arrRet;

        }

    },
    getSessionOne: function(name) {
        /**
        *取单个session值
        *@date 2006-01-26
        **/
        return GetSession(name + "=")[name];
    },
    iframeRun: function(iframeId, src, callback) {
        ///用iframe来调用后台程序,
        var oIframe = document.getElementById(iframeId);
        if (oIframe == null) {
            //document.body.insertAdjacentHTML("BeforeEnd", "<IFRAME id='" + iframeId + "' name='" + iframeId + "' src='' width=0 height=0></IFRAME>");
            NavJs.insertHtml("BeforeEnd", document.body, "<IFRAME id='" + iframeId + "' name='" + iframeId + "' src='' width=0 height=0></IFRAME>");
            oIframe = document.getElementById(iframeId);
        }
        oIframe.src = src;

        oIframe.onreadystatechange = function() {
            if (oIframe.readyState != "complete") return;
            if (typeof callback == "function") {
                callback(); //将值传出
            }
        }
    }


}



/**
*采用ajax的异步回调方式
*@date 2005-10-14
*/

var requests = new Array();

if(typeof(XMLHttpRequest) == 'undefined')
var XMLHttpRequest = function()
{
	var request = null;
	try
	{
		request = new ActiveXObject('Msxml2.XMLHTTP');
		//request.setTimeouts(20000, 20000, 50000,100000);  
	}
	catch(e)
	{
		try
		{
			request = new ActiveXObject('Microsoft.XMLHTTP');
		}
		catch(ee)
		{}
	}
	return request;
}

function ajax_stop()
{
	for(var i=0; i<requests.length; i++)
	{
		if(requests[i] != null){
			requests[i].obj.abort();
			//requests[i] = null ;
		}
	}
}

function ajax_create_request(context)
{
	for(var i=0; i<requests.length; i++)
	{
		if(requests[i].readyState == 4)
		{
			requests[i].abort();
			requests[i].context = null;
			return requests[i];
		}
	}

	var pos = requests.length;
	
	requests[pos] = Object();
	requests[pos].obj = new XMLHttpRequest();
	requests[pos].context = context;
	
	return requests[pos];
}

function ajax_request(url, data, callback, context,noRoot)
{
	var request = ajax_create_request(context);
	var async = typeof(callback) == 'function';

	if (async) request.obj.onreadystatechange = function() {
	    if (request.obj.readyState == 4) {
	        
	        //callback(new ajax_response(request));
	        //异步时对象作为回调函数的参数,有三个属性: value,context,error
	        showWaitIframe("end");
	        var oRet = new ajax_response(request);
	        
	        if (oRet.error == null) {
	            ajaxCallbackAction(oRet.value, callback, oRet.context);
	        }
	        
	    }
	}
	
	request.obj.open('POST', url, async);
//	alert(url);
	//兼容以前的同步写法
	if(noRoot == "noRoot" ){
		request.obj.send(data);
	}else{
		request.obj.send("<root>"+data+"</root>");
	}
	if(!async){
		//如同步时则直接返回值,
		var o = new ajax_response(request);
		//if(o.error != null) alert(o.error.description)
		return o.value ;
	}
}

function ajax_response(request)
{
	this.request = request.obj;
	this.error = null;
	this.value = null;
	this.context = request.context;
	
	if(request.obj.status == 200)
	{
		try
		{
			this.value = object_from_json(request);
			
			if(this.value && this.value.error)
			{
				this.error = this.value.error;
				this.value = null;
			}
		}
		catch(e)
		{
			this.error = new ajax_error(e.name, e.description, e.number);
		}
	}
	else
	{
		this.error = new ajax_error('HTTP request failed with status: ' + request.obj.status, request.obj.status);
		//alert(request.obj.status);
	}
	
	return this;
}

//function enc(s)
//{
//	return s.toString().replace(/\%/g, "%26").replace(/=/g, "%3D");
//}

function object_from_json(request)
{
	if(request.obj.responseXML != null && request.obj.responseXML.xml != null && request.obj.responseXML.xml != '')
		return request.obj.responseXML;
	
	//var r = null;	
	//eval('r=' + request.obj.responseText + ';');
	//return r;
	return request.obj.responseText ;
}

function ajax_error(name, description, number)
{
	this.name = name;
	this.description = description;
	this.number = number;

	return this;
}

ajax_error.prototype.toString = function()
{
	return this.name + " " + this.description;
}

function SendHttp(url, data, callback, context, noRoot) {
    
    if (typeof (callback) != 'function') {
        showWaitIframe();
        var retValue = ajax_request(url, data, callback, context, noRoot);

        showWaitIframe("end");
//        if (retValue == "relogin") {
//            top.close();
//            top.location.replace("../../fceform/common/djframe.htm?djsn=ZK_login&djtype=ZK");
//            return;
//        }              
        return retValue;
    }
    if (fcpubdata.loadingStatus == "start") {
        var urlStart = location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?";
        var urlEnd = url.substring(urlStart.length, url.length);
        var arrP = urlEnd.split("&");
        var arrP1 = arrP[0].split("=");
        if (arrP1[1] == "fillcombox" || arrP1[1] == "getDsns" || arrP1[1] == "fc_select" || arrP1[1] == "dataset_fields1" || arrP1[1] == "dataset_select" || arrP1[1] == "sqltotreedata" || arrP1[1] == "getTreeXml") {
            var iLen = fcpubdata.loadingHttpArr.length;
            fcpubdata.loadingHttpArr[iLen] = new Object();
            fcpubdata.loadingHttpArr[iLen].callback = callback;
            fcpubdata.loadingHttpArr[iLen].context = context;
            var curXml = '<root key="' + arrP1[1] + '" ';
            if (arrP.length > 1) {
                var arrP2 = arrP[1].split("=");
                curXml += arrP2[0] + '="' + arrP2[1] + '"'; //此处加datasourceName
            }
            curXml += '>' + data + '</root>';
            fcpubdata.loadingHttpData += curXml;
            return;
        }
        if (arrP1[1] == "loadingBatchAction") 
        {
            data = fcpubdata.loadingHttpData;
            
        }
    }
    showWaitIframe();
    if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
        var wRequest = new Sys.Net.WebRequest();
        // Set the request Url.  
        wRequest.set_url(url);

        // Set the request verb.
        wRequest.set_httpVerb("POST");
        wRequest.set_userContext(context);
        var sdata = data;
        if (noRoot != "noRoot") {
            sdata = "<root>" + data + "</root>";
        }
        wRequest.set_body(sdata);
        wRequest.callback = callback;
        wRequest.get_headers()['Content-Type'] = 'text/xml; charset=utf-8';
        //
        var handle = function(executor) {
            if (executor.get_responseAvailable()) {
                showWaitIframe("end");
                var sRet = executor.get_responseData();
                var wRequest = executor.get_webRequest();
                ajaxCallbackAction(sRet, wRequest.callback, wRequest.get_userContext());
            } else {
                showWaitIframe("end");
                if (executor.get_timedOut())
                    alert("Timed Out");
                else
                    if (executor.get_aborted())
                    alert("Aborted");
            }

        }
        wRequest.add_completed(handle);
        wRequest.invoke();
    } else {
        ajax_request(url, data, callback, context, noRoot);
    }


}
function showWaitIframe(sTag) {
    //alert(Sys.Browser.agent == Sys.Browser.Firefox);
    var sDivFrameName = "showWaitIframeDiv";
    var sFrameName = "showWaitIframe";
    if ($id(sDivFrameName) == null) {
        if (sTag == "end" || document.body == null) return;
        //alert(222);
        var obj = NavJs.insertHtml("BeforeEnd", document.body, "<DIV id=" + sDivFrameName + " style='position:absolute;left:30px;top:30px'><IFRAME id=" + sFrameName + " name=" + sFrameName + " src='../../fceform/images/ef_wait.gif' width='32px' height='32px' border=0 NORESIZE=NORESIZE SCROLLING=no MARGINWIDTH=0 MARGINHEIGHT=0 FRAMESPACING=0 FRAMEBORDER=0  ></IFRAME></DIV>");
        //obj.src = '../../fceform/images/ef_wait.gif';
        //$id(sDivFrameName).innerHTML = ""
        //var strHTML = "<img src='../../fceform/images/ef_wait.gif'>" allowTransparency='true' 
        //window.frames(sFrameName).document.open();
        //window.frames(sFrameName).document.write(strHTML);
        //window.frames(sFrameName).document.close();

    } else {

        if (sTag == "end") {
            //alert(333);
            $id(sDivFrameName).style.display = "none";
            //$id(sFrameName).style.display = "none";
            //alert($id(sDivFrameName).style.display)
        } else {
            //alert(111);
            $id(sDivFrameName).style.display = "";
            //$id(sFrameName).style.display = "";
        }
    }

}
function ajaxCallbackAction(returnData,callback,context) {
    ///异步ajax的处理程序
    
    var sRet = returnData;
    var result = new Object();
//    var wRequest = executor.get_webRequest();
    var iLen = fcpubdata.loadingHttpArr.length;
    if (iLen == 0) {
        result.context = context;
        try {
            var oJson = Sys.Serialization.JavaScriptSerializer.deserialize(sRet);
            result.value = oJson.value;
            result.errmsg = oJson.errmsg;
            //还可以加权限提示信息.
            //result.permitmsg = oJson.permitmsg;
        } catch (e) {
            result.value = sRet;
        }
        callback(result);
    }
    else { //成批发送返回时
        
        var oDom = SetDom(sRet);
        if (oDom.documentElement == null) {
            //CopyToPub(sRet);
            alert(sRet); //后台发生异常,报出异常信息.
            return;
        }
        for (var j = 0; j < oDom.documentElement.childNodes.length; j++) {
            var sXmlOne = NavJs.xml(oDom.documentElement.childNodes[j]);
            sXmlOne = new Eapi.Str().removeRoot(sXmlOne);
            result.value = sXmlOne;
            result.context = fcpubdata.loadingHttpArr[j].context;
            fcpubdata.loadingHttpArr[j].callback(result);
        }
        callback(result); //再次调用一下当前的回调函数, 此时 result参数没有用到 
        fcpubdata.loadingHttpArr = new Array(); //清空
    }

}

function $id(elementID, oWin) {
    if(typeof oWin == "undefined")
        return document.getElementById(elementID);
    else
        return oWin.document.getElementById(elementID);
}

function $obj(elementID, oWin) {
    if (IsSpace(elementID)) return null;
    if (typeof oWin == "undefined")
        oWin = window;
    ///取HTC控件的JS对象
    if (typeof (elementID) == "string") {
        try {
            var tmpObj = oWin.eval(elementID);
            if (typeof tmpObj == "undefined")
                return oWin.document.getElementById(elementID);
            else
                return tmpObj;
        } catch (e) { return null; }
    } else {
        return oWin.eval(elementID.id);
    }
}
function $win(iframe_id,oWin) {
    ///取iframe所在窗口对象,iframe_id为iframe的ID,oWin 为在某个窗口下找iframe,可空.
    if (typeof (oWin) == "undefined"){
        oWin = window;
    }
    var objIframe = oWin.document.getElementById(iframe_id);
    if (objIframe == null) return null;
    return objIframe.contentWindow;
}
function setTabTitle(sTitle) {
    ///改变主页tab页签的标题, 2012-12-24

    var win_TabMenu = top.win_TabMenu;
    if (typeof (win_TabMenu) == "object") {
        top.eval("win_TabMenu.setTabTitle(\"" + sTitle + "\")");
        return true;
    }
    return false;
}
///取客户端的当前日期,返回 2008-08-08 格式
function getdate()
{
    var curDate = new Date();
    return curDate.format("yyyy-MM-dd");
}
///取客户端的当前时间,返回 2008-08-08 17:05:15 格式
function GetTime() {
    var curDate = new Date();
    return curDate.format("yyyy-MM-dd HH:mm:ss"); 
}

/**
*函数兼容
*@date 2004-03-01
**/
function Trim(strMain){return new Eapi.Str().trim(strMain);}
function SelectSql(sSql,PageNo,PageSize,callback,context){return new Eapi.RunAjax().selectSql(sSql,PageNo,PageSize,callback,context);}
function InsertSql(sSql){return fc_insert(sSql);}
function InsertSqls(sSql){return inserts(sSql);}
function GetDate(){return getdate();}
function RepStr(mainStr,findStr,replaceStr){return repStr(mainStr,findStr,replaceStr);}
function IsSpace(strMain){return isSpace(strMain);}
function RepXml(sSql){return repXml(sSql);}
function unRepXml(sSql){return UnRepXml(sSql);}
function Num(str1){return num(str1);}
function IsTrue(svalue){ return isTrue(svalue);}



//新的兼容函数,2008-01-18

function SaveUserData(Main,Sub,strContent){ return new Eapi.UserData().save(Main,Sub,strContent); }
function LoadUserData(Main,Sub){return new Eapi.UserData().load(Main,Sub);}
function num(str1){return new Eapi.Num().toFloat(str1);}
function ToInt(str1){return new Eapi.Num().toInt(str1);}
function ContDec(sValue,sPointNum) {return new Eapi.Num().format(sValue,sPointNum);}
function isTrue(svalue) { return new Eapi.Str().isTrue(svalue);}
function isSpace(strMain){return new Eapi.Str().isSpace(strMain);}
function repStr(mainStr,findStr,replaceStr){return new Eapi.Str().repStr(mainStr,findStr,replaceStr);}
function repNewLine(sRun) {return new Eapi.Str().repNewLine(sRun);}
function unRepNewLine(sRun) {return new Eapi.Str().unRepNewLine(sRun);}
function repXml(sRun) {return new Eapi.Str().repXml(sRun);}
function UnRepXml(sSql) {return new Eapi.Str().unRepXml(sSql);}
function ChangeToBig(value){return new Eapi.Str().bigMoney(value);}
function SqlToField(sql) {return new Eapi.RunAjax().sqlToField(sql);}
function RepOpenSql(sql,slikevalue) {return new Eapi.Str().repOpenSql(sql,slikevalue);}
function inserts(sSql) {return new Eapi.RunAjax().insertSqls(sSql);}
function fc_insert(sSql) {return new Eapi.RunAjax().insertSql(sSql);}
function fc_select(sSql,PageNo,PageSize) {return new Eapi.RunAjax().selectSql(sSql,PageNo,PageSize);}
function CopyToPub(str){return new Eapi.Str().copyToPub(str);}
function SetDom(sXml) {return new Eapi.Dom().setDom(sXml);}
function SetDomFile(sPath) {return new Eapi.Dom().setDomFile(sPath);}
function RemoveRoot(strX){return new Eapi.Str().removeRoot(strX);}
function CssPart(csstext){return new Eapi.Css().getPart(csstext);}
function ClearCssPart(obj,attrNameJs,attrName) {return new Eapi.Css().clearPart(obj,attrNameJs,attrName);}
function HaveUpload() {return new Eapi.Upload().isHave();}
function getMaxNo(sTag,strMK) {return new Eapi.RunAjax().getMaxNo(sTag,strMK);}
function getMaxIntNo(sTag) {return new Eapi.RunAjax().getMaxIntNo(sTag);}
function getAbsLeft(e){return new Eapi.GetPos().getAbsLeft(e);}
function getAbsTop(e){return new Eapi.GetPos().getAbsTop(e);}
function getPosLeft(e){return new Eapi.GetPos().getPosLeft(e);}
function getPosTop(e){return new Eapi.GetPos().getPosTop(e);}
function uploadImg(){return new Eapi.Upload().uploadImg();}
function SetSession(strQueryString,callback){return new Eapi.Session().setSession(strQueryString,callback);}
function GetSession(strQueryString,callback){return new Eapi.Session().getSession(strQueryString,callback);}
function GetSessionOne(name) {return new Eapi.Session().getSessionOne(name);}
function ShowHelp(htmlfile) {return new Eapi.Str().showHelp(htmlfile);}
function ComboToStr(lstSelField2){return new Eapi.Str().comboToStr(lstSelField2);}

//全局的$函数
//function $isTrue(svalue) { return new Eapi.Str().isTrue(svalue);}
//function $isSpace(strMain){return new Eapi.Str().isSpace(strMain);}
//function $repStr(mainStr,findStr,replaceStr){return new Eapi.Str().repStr(mainStr,findStr,replaceStr);}
//function $toFloat(str1){return new Eapi.Num().toFloat(str1);}
//function $toInt(str1){return new Eapi.Num().toInt(str1);}
function $if(bool,trueValue,falseValue){if(bool) {return trueValue; } else { return falseValue; }}

function getDomNodeValue(oXml,nodeName){
///取Dom中指定节点的值
	var oNode = oXml.documentElement.selectSingleNode("/root/"+nodeName);
	if (oNode != null) {
	    if(Sys.Browser.agent == Sys.Browser.InternetExplorer)
	        return oNode.text;
        else
            return oNode.textContent;		    
	}		
	return null;
}

function getpubvalue(sName){
///取用户的全局参数信息
///sName == "用户.名称" 格式
    var pubAllValue = new Eapi.RunAjax().getAllPubParamValue();
    if(IsSpace(pubAllValue)) return "";
    var arr = pubAllValue.split(",");
    for(var i=0;i<arr.length;i++){
        var arrSub = arr[i].split("=");
        if(arrSub[0] == sName){
            return arrSub[1];
        }
    }
    return "";
}
function DelayRunCommand(iTime,callback) {
///延时执行命令,直到表单窗口加载完成
    if (IsSpace(fcpubdata.idTime) == false) window.clearTimeout(fcpubdata.idTime);
    if (typeof(callback) != "undefined") {
        if (parent.fcpubdata.loading == "finish") {
            callback();
        } else {
            
            fcpubdata.idTime = window.setTimeout("DelayRunCommand(" + iTime + "," + callback + ")", iTime);
        }
    }
}
function documentReadyAfter(callback, oWin) {
///document ready 后执行命令
    if (typeof oWin == "undefined") oWin = window;
    if (oWin.document.readyState == "complete") {
        callback();
    }
    else {
        oWin.document.onreadystatechange = function() {

            if (oWin.document.readyState == "complete") {
                callback();
            }
        }
    }

}
/*
function xpathSelectNodes(oXml, strXpath, oFuncFilter, oFuncAction) {
    if (oXml.documentElement == null) return;

    if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
        var oList = oXml.selectNodes(strXpath);
        if (oList != null) {
            for (var i = 0; i < oList.length; i++) {
                oFuncAction(oList[i]);
            }
        }
    } else { 
        var len = oXml.documentElement.childNodes.length;
        for (var i = 0; i < len; i++) {
            var oNode = oXml.documentElement.childNode[i];
            if(oFuncFilter(oNode)) oFuncAction(oNode);            
        }
    }
}*/

//function GetCodeOrName(sqlOrArr,colNo,sValue) {
//    ///由ID取得Name,或是由Name取得Id,可用于数据集的读出时转换事件中
//    if (typeof (sqlOrArr) == "array") {

//    } else { //sql语句
//        var sXml = SelectSql(sqlOrArr, 1, -1);
//        var oXml = SetDom(sXml);
//        if (oXml.documentElement == null) {
//            alert("SQL语句 " + sqlOrArr + " 运行出错! 错误信息是 " + sXml);
//            return "";
//        }
//        fcpubdata.codeToNameXml = 
//    }
//}

/*****************************************************/
function setCookie(name, value) {
    var Days = 7;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]); return null;
}
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
/**
*判断IE版本
*@return 返回数值型:5.5
*@date 2003-06-18
*/
function getIEVersion() {
    var sVer = navigator.appVersion;
    var l = sVer.indexOf("MSIE");
    if (l < 0) return 0;
    sVer = sVer.substring(l + 5, l + 8);
    var dbl = parseFloat(sVer);
    if (isNaN(dbl))
        return 0;
    else
        return dbl;

}
/**
取当前运行的函数名.
如果当前函数是有名函数，则返回其名字，如果是匿名函数则返回被赋值的函数变量名，如果是闭包中匿名函数则返回“anonymous”。
使用：在要调查的函数内部执行此函数，传入一个参数，为arguments.callee。
**/
function getCurRunFunctionName(callee) {
    if (callee == null) return "";
    var _callee = callee.toString().replace(/[\s\?]*/g,""),
    comb = _callee.length >= 50 ? 50 :_callee.length;
    _callee = _callee.substring(0,comb);
    var name = _callee.match(/^function([^\(]+?)\(/);
    if(name && name[1]){
        return name[1];
    }
    var caller = callee.caller;
    if(caller != null){
        _caller = caller.toString().replace(/[\s\?]*/g,"");
        var last = _caller.indexOf(_callee),
        str = _caller.substring(last-30,last);
        name = str.match(/var([^\=]+?)\=/);
        if(name && name[1]){
            return name[1];
        }
    }
    return "anonymous"
}
/**
* 取窗口的宽度,高度 2011-02-25
**/
function getClientSize(oWin) {
    if (typeof (oWin) == "undefined") oWin = window;
    
    var clientWidth;
    var clientHeight;
    var offsetWidth, offsetHeight;
    

    
    //alert(clientWidth+"||"+clientHeight)
    switch (Sys.Browser.agent) 
    {
        case Sys.Browser.InternetExplorer:
            var isModalWin = typeof (oWin.dialogWidth) != "undefined"; //typeof (oWin.dialogArguments) == "undefined" || 

            if (isModalWin) {
                clientWidth = ToInt(oWin.dialogWidth) - 2;
                offsetWidth = clientWidth;
            } else {
                clientWidth = oWin.document.compatMode == "CSS1Compat" ? oWin.document.documentElement.clientWidth : oWin.document.body.clientWidth;
                offsetWidth = oWin.document.compatMode == "CSS1Compat" ? oWin.document.documentElement.offsetWidth : oWin.document.body.offsetWidth;

            }
            if (isModalWin) {
                clientHeight = ToInt(oWin.dialogHeight) - 2;
                offsetHeight = clientHeight;
            } else {
                clientHeight = oWin.document.compatMode == "CSS1Compat" ? oWin.document.documentElement.clientHeight : oWin.document.body.clientHeight;
                offsetHeight = oWin.document.compatMode == "CSS1Compat" ? oWin.document.documentElement.offsetHeight : oWin.document.body.offsetHeight;
            }

            break;
        case Sys.Browser.Safari:
            clientWidth = oWin.innerWidth;
            clientHeight = oWin.innerHeight;
            offsetWidth = clientWidth ;
            offsetHeight = clientHeight ;
            
            break;
        case Sys.Browser.Opera:
            clientWidth = Math.min(oWin.innerWidth, oWin.document.body.clientWidth);
            clientHeight = Math.min(oWin.innerHeight, oWin.document.body.clientHeight);
            offsetWidth = clientWidth;
            offsetHeight = clientHeight;
            
            break;
        default: //firefox 等
            clientWidth = Math.min(oWin.innerWidth, oWin.document.documentElement.clientWidth);
            clientHeight = Math.min(oWin.innerHeight, oWin.document.documentElement.clientHeight);
            offsetWidth = clientWidth;
            offsetHeight = clientHeight;

            break;
    }

    return { width: clientWidth, height: clientHeight,offsetWidth:offsetWidth ,offsetHeight:offsetHeight  };
/*    
当document.compatMode等于BackCompat时，浏览器客户区宽度是document.body.clientWidth；
当document.compatMode等于CSS1Compat时，浏览器客户区宽度是document.documentElement.clientWidth。
 
浏览器客户区高度、滚动条高度、滚动条的Left、滚动条的Top等等都是上面的情况。
 
一个准确获取网页客户区的宽高、滚动条宽高、滚动条Left和Top的代码：
 
if (document.compatMode == "BackCompat") {
cWidth = document.body.clientWidth;
cHeight = document.body.clientHeight;
sWidth = document.body.scrollWidth;
sHeight = document.body.scrollHeight;
sLeft = document.body.scrollLeft;
sTop = document.body.scrollTop;
}
else { //document.compatMode == "CSS1Compat"
cWidth = document.documentElement.clientWidth;
cHeight = document.documentElement.clientHeight;
sWidth = document.documentElement.scrollWidth;
sHeight = document.documentElement.scrollHeight;
sLeft = document.documentElement.scrollLeft == 0 ? document.body.scrollLeft : document.documentElement.scrollLeft;
sTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
}
 
（以上代码兼容目前流行的全部浏览器，包括：IE、Firefox、Safari、Opera、Chrome）
*/    
}
/**
* 取顶层主窗口, 2011-03-05
**/
function getTopWin() {
    var oTopWin = top;
    if (!IsSpace(window.dialogArguments)) {
        var arrDjOpen = window.dialogArguments;
        if (IsSpace(arrDjOpen.length) == false && arrDjOpen.length > 4) {
            if (IsSpace(arrDjOpen[4]) == false)
                oTopWin = arrDjOpen[4];
        }
    }
    return oTopWin;
}
/**
*将引号变成42
*@date 2004-12-03
**/
function quot_xml(s) {
    s = RepStr(s, "'", "&amp;quot;");
    return s;

}
/**
*将引号变成42
*@date 2004-12-03
**/
function quot_42(s) {
    var s1 = "";
    s = RepStr(s, "'", s1 + "\\42");
    return s;

}
//下面的函数从 fcselfuse.js 中移到此处. my 2012-07-16
function getRecRowsObj(recRows) {
    ///由每条记录所占行数返回一个对象,用于layout e表控件中
    var sRecRows = recRows;
    var oRecRows = null;
    if (IsSpace(sRecRows) == false) {
        sRecRows = RepStr(sRecRows, "\r\n", ",");
        sRecRows = RepStr(sRecRows, "=", ":");
        oRecRows = eval("({" + sRecRows + "})");
    }
    return oRecRows;
}
/**
*保存运行串到文件并返回文件名
*@param typePath 此表单分类所指定的生成路径
**/
function genDjHtmlFile(shtml, djsn, typePath, extname,allBrowser, callback, context) {
    //fcpubdata.path 参数是java中用,.net未用
    //var dtype = fcpubdata.databaseTypeName ;
    //if(fcpubdata.area.isfile == "是") dtype = "file" ; //表示是文件表单生成html文件.
    var sXml = "<text>" + shtml + "</text>" + "<djsn>" + djsn + "</djsn>" + "<typepath>" + typePath + "</typepath>" + "<extname>" + extname + "</extname>" + "<allBrowser>" + allBrowser + "</allBrowser>";
    return new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=genDjHtmlFile", sXml, callback, context);
}


/// 跨浏览器而加
//===================================================================================

/**
* @func:增加jquery写法与xpath写法的转换方法
**/
function xpathExpress(expression) {
    var str = expression.replace(/\"/gi, "'");
    str = str.replace(/\/?\/?(.+)\[\.\s*?='(.+?)'\]/gi, "$1:contains('$2')");
    str = str.replace(/\/?\/?(.+)\[([^@]+?)='(.+?)'\]/gi, "$1:has($2:contains('$3'))");
    str = str.replace(/@/gi, "");
    str = str.replace(/^\/\/?/gi, "");
    str = str.replace(/\/\//gi, " ");
    str = str.replace(/\//gi, " ");
    return str;
}


var NavJs = {

    isIphone: function() {
        //判断请求是否来自iPhone
        return /iPhone/i.test(navigator.userAgent);
    },
    isAndroid: function() {
        //判断请求是否来自Android
        return /Android/i.test(navigator.userAgent);
    },
    isIpad: function() {
        var ua = navigator.userAgent.toLowerCase();
        var s;
        s = ua.match(/iPad/i);

        if (s == "ipad") {
            return true;
        }
        else {
            return false;
        }
        return false;

    },
    openModalDialog: function(sURL, vArguments, vOptions, fCallback, context) {
        ///模态打开窗口，   sURL 窗口地址，vArguments 输入参数，在打开的表单的模态窗口中用fcpubdata.obj 来收到此输入参数。 vOptions 模态窗口的宽度(vOptions.width)高度(vOptions.height)，fCallback 模态窗口关闭后回调的函数。context 传给回调函数中的上下文参数, fCallback 函数的写法为  function(oRet){  oRet.value 接收模态窗口中 window.returnValue 的值，oRet.context 接收 context }
        openModalDialog(sURL, vArguments, vOptions, fCallback, context, null, null);

        function openModalDialog(sURL, vArguments, vOptions, fCallback, aCallbackArguments, btnOk, btnCancel) {
            if (sURL.toLowerCase().indexOf(location.host.toLowerCase()) == -1) { //绝对路径不做处理
                var href = location.pathname;
                href = href.substring(href.indexOf("/", 1) + 1, href.length);
                href = href.substring(0, href.lastIndexOf("/") + 1);
                sURL = href.substring(0, href.lastIndexOf("/") + 1) + sURL;
                //刘立方 2011-04-07 修改锁定路径，个别情况pathname有出入。
                var pathname = top.location.href.substring(top.location.href.indexOf("//") + 2);
                var num = pathname.split("/").length - 3;
                for (i = 0; i < num; i++) {
                    sURL = "../" + sURL;
                }
            }
            if (IsSpace(top.Dialog)) {
                alert("应在平台主页下运行！");
                return;
            }
            top.Dialog.Installize(sURL, vArguments, vOptions, fCallback, aCallbackArguments, btnOk, btnCancel, 'Modal');
            var frame = top.document.getElementById(top.Dialog.dlialogiframe);
            //alert(frame);
            if (frame.attachEvent) {
                frame.attachEvent("onload", function() {
                    load();
                });
            }
            else {
                frame.addEventListener("load", function() {
                    load();
                }, false);
            }
            var load = function() {
                //alert("modaldialogtitle" + top.Dialog.zindex)
                if (!top.document.getElementById("modaldialogtitle" + top.Dialog.zindex)) return false;
                //tianr 2011-6-16 增加frame.contentWindow判空，IE9下报错。 
                if (frame.contentWindow != null) {
                    var title = frame.contentWindow.document.title;
                    if (title != "") {
                        top.document.getElementById("modaldialogtitle" + top.Dialog.zindex).innerHTML = title;
                    }
                    if (btnOk != null) {
                        var elementOK = frame.contentWindow.document.getElementById(btnOk);
                        if (elementOK) {
                            if (elementOK.attachEvent) {
                                elementOK.attachEvent("onclick", function() {
                                    doCallback();
                                });
                            }
                            else {
                                elementOK.addEventListener("click", function() {
                                    doCallback();
                                }, false);
                            }
                        }
                    }

                    if (btnCancel != null) {
                        var btnNo = frame.contentWindow.document.getElementById(btnCancel);
                        if (btnNo) {
                            if (btnNo.attachEvent) {
                                btnNo.attachEvent("onclick", function() {
                                    top.Dialog.Close();
                                });
                            }
                            else {
                                btnNo.addEventListener("click", function() {
                                    top.Dialog.Close();
                                }, false);
                            }
                        }
                    }
                }

            }
            //my add

            //var arrObj = new Array();
            var arrName = "arrName" + top.Dialog.zindex;
            top.Dialog.arrObj[arrName] = {};
            //arrObj[arrName].returnValue = frame.contentWindow.returnValue;
            top.Dialog.arrObj[arrName].callback = fCallback;
            top.Dialog.arrObj[arrName].context = aCallbackArguments;
            //top.Dialog.arrObj = arrObj;
            //================================================================
            var doCallback = function() {
                var returnvalue = frame.contentWindow.returnValue;
                if (fCallback != null) {
                    if (typeof (returnvalue) == "undefined") {
                        return false;
                    }
                    var arg = new Array();
                    arg[0] = returnvalue;
                    if (aCallbackArguments != null) {
                        for (j = 0; j < aCallbackArguments.length; j++) {
                            arg[j + 1] = aCallbackArguments[j];
                        }
                    }
                    if (fCallback.apply(openModalDialog, arg) != false) {
                        //top.Dialog.Close();
                    }
                }
                else {
                    if (typeof (returnvalue) != "undefined") {
                        //top.Dialog.Close();
                    }
                }
            }
        }

    },
    /**
    * @func 兼容其他浏览器获取xml节点的text属性值或给Xml节点的text属性赋值
    * @param node xml节点对象
    * @param svalue 需要给xml节点的赋值，如果不需要赋值则不传值或付null
    * @return 返回xml节点的值
    * @date 2010-10-12 liuxr 
    **/
    textContent: function(node, svalue) {
        var stext = "";
        if (navigator.appName.indexOf("Explorer") > -1) {
            if (typeof (svalue) != "undefined" && (svalue != null) && (svalue != "undefined")) {
                node.text = svalue;
            }
            stext = node.text;
        }
        else {
            if (typeof (svalue) != "undefined" && (svalue != null) && (svalue != "undefined")) {
                node.textContent = svalue;
            }
            stext = node.textContent;

        }
        return stext;
    },

    /**
    * @func 兼容其他浏览器获取xml节点的xml属性值
    * @param node xml节点对象
    * @return 返回xml节点的xml属性值
    * @date 2010-10-29 liuxr 
    **/
    xml: function(node) {
        var sXml = "";
        if (navigator.appName.indexOf("Explorer") > -1) {
            sXml = node.xml;
        }
        else {
            sXml = (new XMLSerializer()).serializeToString(node);
        }
        return sXml;
    },

    /**
    * @func 支持跨浏览器插入HTML字符串
    * @date 2010-10-15 10:50  
    **/
    insertHtml: function(where, el, html) {
        where = where.toLowerCase();
        if (el.insertAdjacentHTML) {
            switch (where) {
                case "beforebegin":
                    el.insertAdjacentHTML('BeforeBegin', html);
                    return el.previousSibling;
                case "afterbegin":
                    el.insertAdjacentHTML('AfterBegin', html);
                    return el.firstChild;
                case "beforeend":
                    el.insertAdjacentHTML('BeforeEnd', html);
                    return el.lastChild;
                case "afterend":
                    el.insertAdjacentHTML('AfterEnd', html);
                    return el.nextSibling;
            }
            throw 'Illegal insertion point -> "' + where + '"';
        }
        else {
            var range = el.ownerDocument.createRange();
            var frag;
            switch (where) {
                case "beforebegin":
                    range.setStartBefore(el);
                    frag = range.createContextualFragment(html);
                    el.parentNode.insertBefore(frag, el);
                    return el.previousSibling;
                case "afterbegin":
                    if (el.firstChild) {
                        range.setStartBefore(el.firstChild);
                        frag = range.createContextualFragment(html);
                        el.insertBefore(frag, el.firstChild);
                        return el.firstChild;
                    } else {
                        el.innerHTML = html;
                        return el.firstChild;
                    }
                case "beforeend":
                    if (el.lastChild) {
                        range.setStartAfter(el.lastChild);
                        frag = range.createContextualFragment(html);
                        el.appendChild(frag);
                        return el.lastChild;
                    } else {
                        el.innerHTML = html;
                        return el.lastChild;
                    }
                case "afterend":
                    range.setStartAfter(el);
                    frag = range.createContextualFragment(html);
                    el.parentNode.insertBefore(frag, el.nextSibling);
                    return el.nextSibling;
            }
            throw 'Illegal insertion point -> "' + where + '"';
        }
    },
    /**
    * @func 扩展IE下的obj.fireEvent(eventType)
    * @date 2010-10-21 14:15
    * @param objID 控件对象
    * @param eventType 事件类型,onchange,onclick......
    **/
    fireEvent: function(objID, eventType) {
        if (document.all)    // For IE.
        {
            objID.fireEvent(eventType);
        }
        else    // For FF or Safari
        {
            if (eventType.toString().substring(0, 2).toLowerCase() == "on") {
                eventType = eventType.substring(2, eventType.length);
            }
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(eventType, true, true);
            objID.dispatchEvent(evt);
        }
    },
    /**
    * @func 兼容浏览器附加事件
    * @date 2010-11-5 
    * @param objID 控件对象
    * @param eventType 事件类型 onchange,onclick,onload......
    * @param methodName 方法名称
    * @param paramObj 需要传递到方法中的参数对象,没有参数时可以不写此参数.
    **/
    addEvent: function(objID, eventType, methodName, paramObj) {

        var eventHander = methodName;
        if (paramObj) {
            // 在这里重新定义一个处理函数
            eventHander = function() {
                methodName.call(paramObj);
            }
        }
        if (navigator.userAgent.indexOf("Firefox") >= 0) {
            if (eventType.toString().toLowerCase() == "onmousewheel") {
                eventType = "DOMMouseScroll";
            }
            if (eventType.toString().toLowerCase() == "onfocusout") {
                eventType = "onblur";
            }
        }
        if (navigator.userAgent.indexOf("MSIE") < 0) {
            if (eventType.toString().toLowerCase() == "onfocusout") {
                eventType = "onblur";
            }

        }
        if (eventType.toString().substring(0, 2).toLowerCase() == "on") {
            eventType = eventType.substring(2, eventType.length);
        }
        $addHandler(objID, eventType, eventHander);


        //        if (typeof window.attachEvent != "undefined") {
        //            objID.attachEvent(eventType, eventHander);
        //        }
        //        else {
        //            objID.addEventListener(eventType, eventHander, false);
        //        }
        //        
    },

    /**
    * @func 增加ipad触摸滚动事件
    * @date 2010-11-5 14:13 
    * @param el 控件对象
    **/
    touchScroll: function(id) {
        if (this.isTouchDevice()) { //if touch events exist...      
            var el = document.getElementById(id);
            var scrollStartPos = 0;
            el.addEventListener("touchstart", function(event) {
                scrollStartPos = this.scrollTop + event.touches[0].pageY;
                event.preventDefault();
            }, false);
            el.addEventListener("touchmove", function(event) {
                this.scrollTop = scrollStartPos - event.touches[0].pageY;
                event.preventDefault();
            }, false);
        }
    },
    isTouchDevice: function() {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    },
    /**
    * @func 在FF下没有innerText属性，整理一个方法使用,在fc_code的iframe中取innerText属性时使用
    * @date 2010-11-29 17:12
    * @param obj 控件对象
    * @param svalue 需要的赋值，如果不需要赋值则不传值或付null
    **/
    innerText: function(obj, svalue) {
        var stext = "";
        if (typeof (HTMLElement) == "undefined") {
            if (typeof (svalue) != "undefined" && (svalue != null) && (svalue != "undefined")) {
                obj.innerText = svalue;
            }
            stext = obj.innerText;
        }
        else {
            if (typeof (svalue) != "undefined" && (svalue != null) && (svalue != "undefined")) {
                obj.textContent = svalue;
            }
            stext = obj.textContent;
        }
        return stext;
    },
    /**
    * @func 获取Event,同时兼容ie和ff的写法
    * @date 2010-10-18 16:40
    **/
    getEvent: function(iframeWinId) {
        if (document.all) {
            if (typeof iframeWinId == "undefined")
                return window.event;
            else
                return $win(iframeWinId).event;
        }
        func = NavJs.getEvent.caller;
        //&& func.arguments != null my add  2013-03-22
        while (func != null && func.arguments != null) {
            var arg0 = func.arguments[0];

            if (arg0) {
                if ((arg0.constructor == Event || arg0.constructor == MouseEvent)
                 || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {

                    return arg0;
                }
            }
            func = func.caller;
        }
        return null;
    },
    /**
    * 取得发生事件的对象
    **/
    getEventObj: function(iframeWinId) {
        var event = NavJs.getEvent(iframeWinId);
        if (event == null) return null;
        return event.srcElement || event.target;
    },
    /*    getNode1: function(oXml, pos) {
    return oXml.documentElement.childNodes[pos];
    },
    getNode11: function(oXml, pos, subPos) {
    return oXml.documentElement.childNodes[pos].childNodes[subPos];
    }, */
    getNodeValue1: function(oXml, pos) {
        ///取子节点的值
        return NavJs.textContent(oXml.documentElement.childNodes[pos]);
    },
    getNodeValue11: function(oXml, pos, subPos) {
        ///取子子节点的值
        return NavJs.textContent(oXml.documentElement.childNodes[pos].childNodes[subPos]);
    },
    getGridArr: function() {
        //modify by liuxr at 2010-11-15 11:48 初始化所有的grid控件的onload事件判断当前的浏览器获取webgrid的标签，因在IE下有<html xmlns:fc xmlns:v="urn:schemas-microsoft-com:vml">指定，所有不用前缀
        var gridobj;
        if (navigator.appName.indexOf("Explorer") > 1) // && parseInt(MSIEver) <9)
        {
            gridobj = window.document.getElementsByTagName("webgrid");
        }
        //else
        if (gridobj == null || gridobj.length == 0) {
            gridobj = window.document.getElementsByTagName("fc:webgrid");
        }
        return gridobj;
    },
    getDropdownlistArr: function() {
        var gridobj;
        if (navigator.appName.indexOf("Explorer") > 1) // && parseInt(MSIEver) <9)
        {
            gridobj = window.document.getElementsByTagName("fc_code");
        }
        //else
        if (gridobj == null || gridobj.length == 0) {
            gridobj = window.document.getElementsByTagName("fc:fc_code");
        }
        return gridobj;
    },
    getDatasetArr: function() {
        var gridobj;
        if (navigator.appName.indexOf("Explorer") > 1) // && parseInt(MSIEver) <9)
        {
            gridobj = window.document.getElementsByTagName("dataset");
        }
        //else
        if (gridobj == null || gridobj.length == 0) {
            gridobj = window.document.getElementsByTagName("fc:dataset");
        }
        return gridobj;
    },
    getClassName: function(obj) {
        if (Sys.Browser.agent == Sys.Browser.InternetExplorer)
            return obj.className;
        else
            return obj.getAttribute("class");
    },
    setClassName: function(obj, sValue) {
        obj.className = sValue;
        if (Sys.Browser.agent == Sys.Browser.InternetExplorer)
            obj.className = sValue;
        else
            obj.setAttribute("class", sValue);
    },
    insertEventParam: function(strlink, oEvent) {
        ///在事件的代码中,原来用eval(sCommand)来执行的事件代码,需要用此函数来插入event参数,
        var event_str = "event";
        //if (typeof (oEvent) == "undefined") event_str = "event"; //默认时事件名称为event
        if (strlink.indexOf("(") >= 0) {
            var ss = strlink.substring(strlink.indexOf("(") + 1, strlink.length);

            strlink = strlink.substring(0, strlink.indexOf("(") + 1) + event_str;
            if (ss.length > 1)
                strlink = strlink + "," + ss;
            else
                strlink = strlink + ss;
        }
        if (strlink != "") {
            var oev = new Function(event_str, strlink);
            if (typeof (oEvent) == "undefined")
                oev(event);
            else
                oev(oEvent);
        }

    },
    preventDefault: function(event) {
        /// <summary locid="M:J#Sys.UI.DomEvent.preventDefault" />
        if (event.preventDefault) {
            event.preventDefault();
        }
        else if (window.event) {
            event.returnValue = false;
        }
    },
    cancelBubble: function(event) {
        ///取消事件的冒泡.
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        else if (window.event) {
            event.cancelBubble = true;
        }
    },
    cssText: function(obj, sValue) {
        if (typeof sValue == "undefined") {
            if (Sys.Browser.agent == Sys.Browser.InternetExplorer)
                return obj.style.cssText;
            else
                return obj.getAttribute("style");
        } else {
            if (Sys.Browser.agent == Sys.Browser.InternetExplorer)
                obj.style.cssText = sValue;
            else
                obj.setAttribute("style", sValue);

        }

    },
    xmlChild: function(oParent, index) {
        ///取子元素,因为非IE浏览器会将空节点也作为一个节点来占位,所以要去掉空节点. my add 2013-03-04 
        if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
            return oParent.childNodes[index];
        }

        var len = oParent.childNodes.length;
        var i = 0, j = 0;
        while (j < len) {
            if (oParent.childNodes[j].nodeType != 1) { // == 1 表示标准节点
                j++;
                continue;
            }
            if (i == index) {
                return oParent.childNodes[j];
            }
            i++;
            j++;
        }
        return null;
    },
    isHaveChild: function(obj) {
        ///判断一个元素是否含有非文本的子元素。2013-01-07
        if (obj == null) return false;
        //if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
        //    return obj.childNodes.length > 0;
        //} else {
        for (var i = 0; i < obj.childNodes.length; i++) {
            if (obj.childNodes[i].nodeType == 1) return true;
        }
        return false;
        //}

    },
    prevNode: function(obj) {
        ///取上一个节点，不算文本节点。2013-06-05
        while (obj != null) {
            if (obj.previousSibling != null && obj.previousSibling.nodeType == 1) {
                return obj.previousSibling;
            } else {
                obj = obj.previousSibling;
            }
        }
        return null;

    },
    nextNode: function(obj) {
        ///取下一个节点，不算文本节点。2013-06-05
        while (obj != null) {
            if (obj.nextSibling != null && obj.nextSibling.nodeType == 1) {
                return obj.nextSibling;
            } else {
                obj = obj.nextSibling;
            }
        }
        return null;

    },
    child: function(objMain, tagName, index) {
        ///取子元素,因为非IE浏览器会将空节点也作为一个元素来占位,所以改为通过tagName来取,以去掉空节点.
        ///objMain = div 控件对象, tagName = "div" , index = 0,1 之类的值.
        if (objMain == null) return null;
        var tmpObj = objMain.getElementsByTagName(tagName);
        if (tmpObj.length < index + 1) return null;
        return tmpObj[index];
    },
    index: function(obj, tagName) {
        ///找到对象的位置，主要是替换 oTd.cellIndex属性， tagName ="TD"
        var objMain = obj.parentNode;
        var tmpObj = objMain.getElementsByTagName(tagName);
        for (var i = 0; i < tmpObj.length; i++) {
            if (tmpObj[i] == obj) {
                return i;
            }
        }

    },
    indexCol: function(oTable, colNo) {
        ///取得table中的col对象，为了方便修改以前的代码用。2012-12-09
        var oColGroup = this.child(oTable, "colgroup", 0);
        var oCol = this.child(oColGroup, "col", colNo);
        if (oCol == null) {
            oCol = oTable.rows[0].cells[colNo];
        }
        return oCol;
    },
    setWidth: function(obj, valuePx) {
        ///设置obj元素的宽度，valuePx为整数，单位为px
        if (valuePx < 0) return;
        obj.style.width = valuePx + "px";
        var offsetWidth = obj.offsetWidth;
        if (offsetWidth > 0 && offsetWidth > valuePx) {
            valuePx = valuePx - (offsetWidth - valuePx);
            if (valuePx < 0) return;
            obj.style.width = valuePx + "px";
        }
        return valuePx;
    },
    setHeight: function(obj, valuePx) {
        ///设置obj元素的高度，valuePx为整数，单位为px
        if (valuePx < 0) return;
        obj.style.height = valuePx + "px";
        var offsetHeight = obj.offsetHeight;
        if (offsetHeight > 0 && offsetHeight > valuePx) {
            valuePx = valuePx - (offsetHeight - valuePx);
            if (valuePx < 0) return;
            obj.style.height = valuePx + "px";
        }
        return valuePx;
    },
    phoneOpenUrl: function(url) {
        ///在手机上时，打开一个url
        parent.location.replace(url);
    },
    mainOpenUrl: function(url, name, id) {
        ///在电脑的，主页上打开一个页面。
        ///id为上级菜单的id,name为中文名称
        if (typeof (top.CreateNewTabWin) == "function") {
            top.CreateNewTabWin(url, name, id);
            return true;
        }
        return false;
    }

}
NavJsExt();
function NavJsExt() {
    /**
    * @func 扩展非IE下的selectNodes 和 selectSingleNode 方法
    * @date 2010-10-14 
    **/
    // check for XPath implementation
    if (Sys.Browser.agent != Sys.Browser.InternetExplorer && document.implementation.hasFeature("XPath", "3.0")) { //
        // prototying the XMLDocument
        XMLDocument.prototype.selectNodes = function(cXPathString, xNode) {
            if (!xNode) { xNode = this; }

            //if (typeof this.evaluate != "undefined") {
                var oNSResolver = this.createNSResolver(this.documentElement)
                var aItems = this.evaluate(cXPathString, xNode, oNSResolver,
                        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
                var aResult = [];
                aResult.length = aItems.snapshotLength;
                for (var i = 0; i < aItems.snapshotLength; i++) {
                    aResult[i] = aItems.snapshotItem(i);
                }
                aResult.item = function(index) {
                    return aResult[index]
                }
                return aResult;
                /*}
                else {
                //added by liuxr at 2011-7-28 13:43 android下selectNodes的写法
                cXPathString = xpathExpress(cXPathString);
                var node = $(this).find(cXPathString);
                return node;
                }*/
        }

        // prototying the Element
        Element.prototype.selectNodes = function(cXPathString) {
            if (this.ownerDocument.selectNodes) {
                return this.ownerDocument.selectNodes(cXPathString, this);
            }
            else { throw "For XML Elements Only"; }
        }
        // prototying the XMLDocument
        XMLDocument.prototype.selectSingleNode = function(cXPathString, xNode) {
            if (!xNode) { xNode = this; }
            var xItems = this.selectNodes(cXPathString, xNode);
            if (xItems.length > 0) {
                return xItems[0];
            }
            else {
                return null;
            }
        }

        // prototying the Element
        Element.prototype.selectSingleNode = function(cXPathString) {
            if (this.ownerDocument.selectSingleNode) {
                return this.ownerDocument.selectSingleNode(cXPathString, this);
            }
            else { throw "For XML Elements Only"; }
        }
    }

    /**
    * @func 在FF浏览器下扩展outerHTML方法
    * @date 2010-10-15 11:40
    **/

    if (typeof (HTMLElement) != "undefined" && !window.opera && window.navigator.appName.indexOf("Explorer") < 0) {
        var pro = window.HTMLElement.prototype;
        pro.__defineGetter__("outerHTML", function() {
            var quot = "'";
            var str = "<" + this.tagName;
            var a = this.attributes;
            for (var i = 0, len = a.length; i < len; i++) {
                if (a[i].specified) {
                    if (a[i].value.indexOf("bill_") > -1) {
                        str += " " + a[i].name + "=" + a[i].value;
                    }
                    else {
                        str += " " + a[i].name + "=" + quot + a[i].value + quot;
                    }
                }
            }
            if (!this.canHaveChildren) {
                return str + " />";
            }
            return str + ">" + this.innerHTML + "</" + this.tagName + ">";
        });
        pro.__defineSetter__("outerHTML", function(s) {
            var r = this.ownerDocument.createRange();
            r.setStartBefore(this);
            var df = r.createContextualFragment(s);
            this.parentNode.replaceChild(df, this);
            return s;
        });
        pro.__defineGetter__("canHaveChildren", function() {
            return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase());
        });
        //扩展innerText属性
        pro.__defineGetter__("innerText", function() {
            var anyString = "";
            var childS = this.childNodes;
            for (var i = 0; i < childS.length; i++) {
                if (childS[i].nodeType == 1) {
                    anyString += childS[i].tagName == "BR" ? '\n' : childS[i].innerText;
                }
                else if (childS[i].nodeType == 3) {
                    anyString += childS[i].nodeValue;
                }
            }
            return anyString;
        });
        pro.__defineSetter__("innerText", function(sText) {
            //this.textContent=sText; 
            while (this.childNodes.length != 0) {
                this.removeChild(this.childNodes[0]);
            }
            this.appendChild(document.createTextNode(sText));

        });
        if (Sys.Browser.agent != Sys.Browser.Firefox) {
            pro.__defineGetter__("nextSibling", function() {

                var obj = this.nextSibling;
                while (obj != null && IsSpace(obj.innerHTML)) {
                    obj = obj.nextSibling;
                }
                return obj;
            });
        }

        XMLDocument.prototype.__defineGetter__("xml", function() {
            return (new XMLSerializer()).serializeToString(this);
        });

        Element.prototype.__defineGetter__("xml", function() {
            return (new XMLSerializer()).serializeToString(this);
        });

        Element.prototype.__defineGetter__("text", function() {
            return this.textContent;
        });
        Element.prototype.__defineSetter__("text", function(sText) {
            this.textContent = sText;
        });


        /**
        * 增加兼容浏览器的detachEvent attachEvent 方法
        * @date:2010-11-26
        **/
        //  window.constructor.prototype.detachEvent=HTMLDocument.prototype.detachEvent=HTMLElement.prototype.detachEvent=function(e,f){
        //    this.removeEventListener(e.replace(/^on/i,""),f,false);
        // };

        pro.insertAdjacentElement = function(where, parsedNode) {
            switch (where) {
                case "beforeBegin":
                    this.parentNode.insertBefore(parsedNode, this);
                    break;
                case "afterBegin":
                    this.insertBefore(parsedNode, this.firstChild);
                    break;
                case "beforeEnd":
                    this.appendChild(parsedNode);
                    break;
                case "afterEnd":
                    if (this.nextSibling)
                        this.parentNode.insertBefore(parsedNode, this.nextSibling);
                    else
                        this.parentNode.appendChild(parsedNode);
                    break;
            }
        }

    }
    // 下面为my add 2012-02-02
    if (window.Event) {
        //解决event参数传递
        try {
            window.constructor.prototype.__defineGetter__("event", function() {
                var o = arguments.callee.caller;
                var e;
                while (o != null) {
                    e = o.arguments[0];
                    if (e && (e.constructor == Event || e.constructor == MouseEvent)) return e;
                    o = o.caller;
                }
                return null;
            });
            //解决srcElement
//            window.Event.constructor.prototype.__defineGetter__("srcElement", function() {
//                return this.target;
//            });
//            window.MouseEvent.constructor.prototype.__defineGetter__("srcElement", function() {
//                return this.target;
//            });
//            
        } catch (ee) { }
    }
    //下面为 2013-01-05 my add
    if (window.Node) {
        Node.prototype.replaceNode = function($target) {
            return this.parentNode.replaceChild($target, this);
        }
        Node.prototype.swapNode = function($target) {
            var $targetParent = $target.parentNode;
            var $targetNextSibling = $target.nextSibling;
            if ($targetNextSibling != null && $targetNextSibling == this) {
                $targetNextSibling = this.nextSibling;
                var $thisNode = this.parentNode.replaceChild(this, $target);
            } else {
                var $thisNode = this.parentNode.replaceChild($target, this);
            }
            if ($targetNextSibling) {
                $targetParent.insertBefore($thisNode, $targetNextSibling);
            } else {
                $targetParent.appendChild($thisNode);
            }
            return this;
        }
    }

}

//===================================================================================
//取浏览器关键字
function GetBrowserKey() {
    var browser = "msie";
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("msie") >= 0)
        browser = "msie";
    else if (agent.indexOf("firefox") >= 0)
        browser = "firefox";
    else if (agent.indexOf("chrome") >= 0 && agent.indexOf("safari") >= 0)
        browser = "chrome";
    else if (agent.indexOf("opera") >= 0 && agent.indexOf("presto/") >= 0)
        browser = "opera";
    else if (agent.indexOf("chrome") < 0 && agent.indexOf("safari") >= 0)
        browser = "safari";
    else
        browser = "other";
    return browser;
}
//获取场景关键字
//var ApplicationScene="";//全局应用场景 
function GetSceneKey() {
    //从框架主页上取fcpubdata.keyScene的值
    /*var scene = "电脑"; //PC,mobilePhone,tabletPC --PC机，手机应用，平板电脑	
    var browser = GetBrowserKey();
    if (browser.indexOf("msie") >= 0)
    scene = "电脑";
    else
    scene = "手机";
    */

    var scene = parent.fcpubdata.keyScene;

    return escape(scene);
}

/*
 * GB2312转UTF8
 * 例：
 * var xx=new GB2312UTF8();
 * var Utf8=xx.Gb2312ToUtf8("你aaa好aaaaa");
 * var Gb2312=xx.Utf8ToGb2312(Utf8);
 * alert(Gb2312);
 */

function GB2312UTF8(){
  this.Dig2Dec=function(s){
      var retV = 0;
      if(s.length == 4){
          for(var i = 0; i < 4; i ++){
              retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
          }
          return retV;
      }
      return -1;
  } 
  this.Hex2Utf8=function(s){
     var retS = "";
     var tempS = "";
     var ss = "";
     if(s.length == 16){
         tempS = "1110" + s.substring(0, 4);
         tempS += "10" +  s.substring(4, 10); 
         tempS += "10" + s.substring(10,16); 
         var sss = "0123456789ABCDEF";
         for(var i = 0; i < 3; i ++){
            retS += "%";
            ss = tempS.substring(i * 8, (eval(i)+1)*8);
            retS += sss.charAt(this.Dig2Dec(ss.substring(0,4)));
            retS += sss.charAt(this.Dig2Dec(ss.substring(4,8)));
         }
         return retS;
     }
     return "";
  } 
  this.Dec2Dig=function(n1){
      var s = "";
      var n2 = 0;
      for(var i = 0; i < 4; i++){
         n2 = Math.pow(2,3 - i);
         if(n1 >= n2){
            s += '1';
            n1 = n1 - n2;
          }
         else
          s += '0';
      }
      return s;      
  }

  this.Str2Hex=function(s){
      var c = "";
      var n;
      var ss = "0123456789ABCDEF";
      var digS = "";
      for(var i = 0; i < s.length; i ++){
         c = s.charAt(i);
         n = ss.indexOf(c);
         digS += this.Dec2Dig(eval(n));
      }
      return digS;
  }
  this.Gb2312ToUtf8=function(s1){
    var s = escape(s1);
    var sa = s.split("%");
    var retV ="";
    if(sa[0] != ""){
      retV = sa[0];
    }
    for(var i = 1; i < sa.length; i ++){
      if(sa[i].substring(0,1) == "u"){
        retV += this.Hex2Utf8(this.Str2Hex(sa[i].substring(1,5)));
  if(sa[i].length){
    retV += sa[i].substring(5);
  }
      }
      else{
     retV += unescape("%" + sa[i]);
  if(sa[i].length){
    retV += sa[i].substring(5);
  }
   }
    }
    return retV;
  }
  this.Utf8ToGb2312=function(str1){
        var substr = "";
        var a = "";
        var b = "";
        var c = "";
        var i = -1;
        i = str1.indexOf("%");
        if(i==-1){
          return str1;
        }
        while(i!= -1){
    if(i<3){
                substr = substr + str1.substr(0,i-1);
                str1 = str1.substr(i+1,str1.length-i);
                a = str1.substr(0,2);
                str1 = str1.substr(2,str1.length - 2);
                if(parseInt("0x" + a) & 0x80 == 0){
                  substr = substr + String.fromCharCode(parseInt("0x" + a));
                }
                else if(parseInt("0x" + a) & 0xE0 == 0xC0){ //two byte
                        b = str1.substr(1,2);
                        str1 = str1.substr(3,str1.length - 3);
                        var widechar = (parseInt("0x" + a) & 0x1F) << 6;
                        widechar = widechar | (parseInt("0x" + b) & 0x3F);
                        substr = substr + String.fromCharCode(widechar);
                }
                else{
                        b = str1.substr(1,2);
                        str1 = str1.substr(3,str1.length - 3);
                        c = str1.substr(1,2);
                        str1 = str1.substr(3,str1.length - 3);
                        var widechar = (parseInt("0x" + a) & 0x0F) << 12;
                        widechar = widechar | ((parseInt("0x" + b) & 0x3F) << 6);
                        widechar = widechar | (parseInt("0x" + c) & 0x3F);
                        substr = substr + String.fromCharCode(widechar);
                }
     }
     else {
      substr = substr + str1.substring(0,i);
      str1= str1.substring(i);
     }
              i = str1.indexOf("%");
        }

        return substr+str1;
  }
}

/**
*由表单分类名称得到路径
*@date 2005-10-08
**/
function BillTypeNameToPath(name) {
    //return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?GetBillType","")
    var oXml = SetDomFile(fcpubdata.path + fcpubdata.userDir + "/xml/billtype.xml");
    var oRet = new Object();
    if (oXml.documentElement != null) {
        var l = oXml.documentElement.childNodes.length - 1;
        for (var i = 0; i < l; i++) {
            var svalue = oXml.documentElement.childNodes[i].childNodes[2].text;
            var spath = oXml.documentElement.childNodes[i].childNodes[3].text;
            var extname = oXml.documentElement.childNodes[i].childNodes[4].text;

            if (svalue == name) {
                oRet.path = spath;
                oRet.extname = extname;
                break;
            }

        }
    }
    return oRet;
}