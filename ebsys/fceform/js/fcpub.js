///<reference name="MicrosoftAjax.js" />

//ȫ�����ݶ���
/**
	servletPath			���ú�̨�ļ��Ļ�·��
	Path				������������Ŀ¼��
	dotnetVersion		=""��ʾΪjava�汾,=".aspx"Ϊ.net�汾
	databaseTypeName	���ݿ�����,sqlserver/mysql/oracle
	pub_sendhttp_errmsg	�ض�������̨������Ϣ
	gridno_fieldname	���ӱ�༭ʱ�ӱ��˳����ֶ���
	BillOpenWinName		���б���֡���ڵ�����
	position			ȱʡ�Ķ�λģʽ =absolute/static
	toolbarstyle		������ʽ����б�;red,yellow,light,Office,blue,green,CoolBlue,white ������ʽ����б�
	toolbar				���еĿؼ���ť���б�,|�Ƿָ���,br�ǻ���
	formtb				������eform���ı��Ŀ��ù�����,����Ϊ<option>��ʽ��XML��,
						�ڵ�����path��ʾҳ��·����~��ʾfcpubdata.pathֵ
						�ڵ�����height��ʾ������ռ�ĸ߶ȣ��粻ָ������ȡĬ��ֵΪ31px
						�ڵ�ֵΪ���������ƣ��ڱ�������ı����Դ��������б���ʽ��ʾ��������Աѡ��
**/

var fcpubdata = {
servletPath: "/ebsys/eformaspx", 		//���ú�̨�ļ��Ļ�·��, for .NET�ĳ���д����: /ebsys/eformaspx ,eform for j2ee�ĳ���д����: /servlet
    path: "/ebsys", 				//��λ��fceformĿ¼,��������Ŀ¼��·��,����д����: /eformsys
    dotnetVersion: ".aspx", 			//=""��ʾΪjava�汾,=".aspx"Ϊ.net�汾
    databaseTypeName: "sqlserver", 		//���ݿ�����,sqlserver/mysql/oracle/db2
    isOleDb: "yes", //�Ƿ�ΪOleDb����,no��ʾΪsqlclient��oracleclient����
    dbStruDict: "FC_ENTITY",         //="FC_DBSTRU" ="FC_FLDLIST" ="" ��ʾ��ʱ�����ݿ���ȡ. ="FC_ENTITY" ��ʾ������ƽ̨����
    cssFiles: ["/css/efdesign.css"],                   //�ڱ��м��ص�css�ļ�,·����fceformĿ¼,һ��д /css/xx.css      "/css/tdm_main.css"
    skins: "blue",                   //��skin ����ֵΪ: base/blue/light/green
    skinsPath: "/fceform",                   //��ʽ�Ļ�·��: fceform/fceformext ����orgid
    //toolbarStyle: "blue",                //���������������ʽ ����ֵΪ: base/blue/light/green,no use,ͳһ�� skins
    actionButtonDisplay: "",                   //�ؼ����Կ��е�����Ȩ�ް�ť��style.display����ֵ "none"��ʾ����ʾ
    fcbugButtonDisplay: "none",         //�ؼ����Կ��� �Ƿ���ʾ���ʰ�ť
    db2UserName: "EBORACLE", 		//db2���ݿ���û���(��ģʽ�� DB2ADMIN)
    gridNoFieldName: "dj_sn", 			//���ӱ�༭ʱ�ӱ��˳����ֶ���
    billOpenWinName: "rightmain", 		//���б���֡���ڵ�����
    position: "absolute", 		//ȱʡ�Ķ�λģʽ =absolute/static
    toolbar: "newempty,opendj,opendjfile,billtype,djpreview,directrun,save,saveas,|,cut,copy,paste,undo,redo,|,align,focus,front,behind,form,|,userfunction,userfunction1,addhtml,execute,showlist,listconfig,importconfig,setPosition,eformhelp,|,cbozoom,br,button,label,img,div,shape,|,tab,page,tree,a,spin,checkboxlist,radiolist,|,dataset,grid,htmltable,formattab,|,text,checkbox,radio,listbox,combobox,dropdownlist,textarea,|,dbimg,upload,layout,ebiao,eblayout,test", //���������������ť,|�Ƿָ���,br�ǻ���
    formToolbar: "<option path=\"~/fceformext/common/toolbarform.htm?type=88\">�Զ��幤����</option><option path=\"~/fceformext/common/toolbarform.htm?type=1\">ȷ��_ȡ��</option><option path=\"~/fceformext/common/toolbarform.htm?type=5\">ȷ��_ȡ��_���������_���</option><option path=\"~/fceformext/common/toolbarform.htm?type=3\">��ҳ��_����_ɾ��_����</option><option path=\"~/fceformext/common/toolbarform.htm?type=4\">��ҳ��_������_ɾ����_����_ɾ��_����</option><option path=\"~/fceformext/common/toolbarform.htm?type=2\">����_ɾ��</option><option path=\"~/fceformext/common/toolbarform.htm?type=7\">������_ɾ����_����</option><option path=\"~/fceformext/common/toolbarform.htm?type=6\">��ѯ��</option><option path=\"~/fceformext/common/toolbarform.htm?type=8\">��ѯ��_������_ɾ����_����</option><option path=\"~/fceformext/common/toolbarform.htm?type=9\">��ѯ��_����_ɾ��</option><option path=\"~/fceformext/common/toolbarform.htm?type=10\">ȷ��_ȡ��_��ӡ��</option><option path=\"~/workflow/sys_dj/wf_tools.htm\" height=\"60px\">������������</option>", //������eform���ı��Ŀ��ù�����,����Ϊ<option>��ʽ��XML��,�ڵ�����path��ʾҳ��·����~��ʾfcpubdata.pathֵ,�ڵ�����height��ʾ������ռ�ĸ߶ȣ��粻ָ������ȡĬ��ֵΪ31px,�ڵ�ֵΪ���������ƣ��ڱ�������ı����Դ��������б���ʽ��ʾ��������Աѡ��
    toolbarButtons: {
        printpreview: ["55", "ef_preview_button.gif", "e��ؼ���ӡԤ��", "��ӡԤ��"],
        selectprint: ["55", "ef_print_button.gif", "e��ؼ���ӡ", "��ӡ"],
        directprint: ["20", "eb_printdirect.gif", "e��ؼ�ֱ�Ӵ�ӡ", "ֱ�Ӵ�ӡ"],
        directprintall: ["20", "eb_printall.gif", "e��ؼ�ֱ�Ӵ�ӡ����ҳ", "ֱ�Ӵ�ӡ����ҳ"],
        printall: ["20", "eb_printall.gif", "e��ؼ���ӡ����ҳ", "��ӡ����ҳ"],
        expexcel: ["20", "ef_design_excel.gif", "��ҳ������excel�ļ���", "����excel"],
        expexcelall: ["20", "eb_excelone.gif", "����ҳ������excel�ļ���", "����excel"],
        exppdf: ["20", "eb_exppdf.gif", "��������ҳ��pdf�ļ���", "����pdf"],


        ok: ["55", "ef_run_button_ok1.gif", "�ύ���ݳɹ���ˢ����һ����", "ȷ��"],
        close: ["55", "ef_run_button_close1.gif", "�رմ���", "ȡ��"],
        openwinadd: ["55", "ef_run_button_add.gif", "�򿪴���������¼", "����"],
        add: ["55", "ef_run_button_add.gif", "����", "����"],
        del: ["55", "ef_run_button_del.gif", "ɾ��", "ɾ��"],
        griddel: ["55", "ef_run_button_del.gif", "ɾ������ɾ����¼", "ɾ��"],
        edit: ["55", "ef_run_button_edit.gif", "�޸ı���", "�޸�"],
        save: ["55", "ef_run_button_save.gif", "�ύ���ݳɹ�����ʾ", "����"],
        saveadd: ["92", "ef_run_button_saveadd.gif", "�ύ���ݳɹ�������", "���������"],

        seeview: ["65", "ef_run_button_addrow.gif", "�鿴��ͼ", "�鿴��ͼ"],
        addview: ["65", "ef_run_button_add.gif", "������ͼ", "������ͼ"],
        editview: ["65", "ef_run_button_edit.gif", "�༭��ͼ", "�༭��ͼ"],
        selall: ["65", "ef_run_button_allsel.gif", "ȫѡ", "ȫѡ"],
        noselall: ["65", "ef_run_button_noallsel.gif", "ȫ��ѡ", "ȫ��ѡ"],

        addrow: ["65", "ef_run_button_addrow.gif", "������", "������"],
        deleterow: ["65", "ef_run_button_deleterow.gif", "ɾ����", "ɾ����"],
        query: ["55", "ef_run_button_query.gif", "��ѯ", "��ѯ"],
        first: ["64", "ef_run_button_first.gif", "��һҳ", "��һҳ"],
        up: ["60", "ef_run_button_up1.gif", "��һҳ", "��һҳ"],
        down: ["60", "ef_run_button_down1.gif", "��һҳ", "��һҳ"],
        last: ["64", "ef_run_button_last.gif", "���ҳ", "���ҳ"],
        upmove: ["60", "ef_run_button_up_move.gif", "����", "����"],
        downmove: ["60", "ef_run_button_down_move.gif", "����", "����"],
        closewin: ["64", "ef_run_button_closewin.gif", "�رմ���", "�ر�"],
        wf_tempsave: ["64", "ef_run_button_closewin.gif", "ֻ����ҵ������", "�ݴ�"],
        wf_save: ["64", "ef_run_button_closewin.gif", "�ύҵ�����ݲ�ִ������", "ִ��"],
        wf_save1: ["64", "ef_run_button_closewin.gif", "�ύҵ������̺�ת��һ��", "ִ��"],
        wf_save2: ["64", "ef_run_button_closewin.gif", "�ύҵ������̺�رմ���", "ִ��"],
        wf_save3: ["64", "ef_run_button_closewin.gif", "�ύҵ������̺��޲���", "ִ��"],
        wf_flowsave: ["64", "ef_run_button_closewin.gif", "ִֻ�����̵Ķ���", "ִ��"],
        wf_flowsave1: ["64", "ef_run_button_closewin.gif", "ִֻ�����̵Ķ�����ת��һ��", "ִ��"],
        wf_flowsave2: ["64", "ef_run_button_closewin.gif", "ִֻ�����̵Ķ�����رմ���", "ִ��"],
        wf_flowsave3: ["64", "ef_run_button_closewin.gif", "ִֻ�����̵Ķ������޲���", "ִ��"],
        wf_trace: ["64", "ef_run_button_closewin.gif", "���̵Ĺ켣ͼ", "�켣"],
        wf_free_select: ["64", "ef_run_button_closewin.gif", "��ѡ��������", "������"],
        wf_suspended: ["64", "ef_run_button_closewin.gif", "��������ʵ��", "����"],
        wf_killed: ["64", "ef_run_button_closewin.gif", "��ֹ����ʵ��", "��ֹ"]
    },      //���б��Ĺ������е�����ϵͳ���ð�ť.
    repMark: { //���������滻��־
        role: "��ɫ",
        role1: "��ɫ",
        group: "Ⱥ��"

    },
    sendHttpErrMsg: ":���̨���ӳ���:", //�ض�������̨������Ϣ

    area: null, // eform�������,�Ǹ�divԪ��.
    dsMain: "DsMain", 	//�����ݼ���δ�󶨵����ĵ�һ�����ݼ���ID
    pubSession: "null", //ȡ��session�ı�ʶ,����Ϊ����ͬ����ʽȡsession�ķ���,����д����: username=&deptname=
    autoAddField: "no", 	//Ϊyes��ʾ�½���ʱ�Ƿ��Զ���һ�������ݼ����Լ��ӿؼ�ʱ�Զ����ֶΡ� 
    pubdataSrc: "", 		//������Ӵ��ڵ�url,��ͬ
    topicSrc: "",
    keyValue: "",       //ԭ����pubdjbh,���ڸ��������ֶε�ֵ
    obj: null,     //ԭ����pubDataSet,�����ڱ�֮�䴫�ݶ������ʱ��.
    isEdit: false,    //ԭ����pubEdit,�жϱ��Ƿ��ֶ��޸Ĺ��ı�־.
    enterStatus: "OK", 	//�ж��ܲ��ܽ����,ΪOK��ʾ���Խ���.
    arrValidObj: new Array(), //����У��ʧ�ܵ��¼�����,�����ڱ���ǰ��У��.
    controls: new Object(),         //ȡ���ϵ����пؼ�,

    //   reportTempFilePath : "/ebsys/ebtmpfile/file/", //������ʱ�ļ�·��
    wfToolbar: "newwf,openfile,save,saveas,|,cut,copy,paste,undo,redo,|,front,behind,wfprop,|,cbozoom,br,wfstep,wfline", //���������������
    labelInputTag: " <font color=red>*</font>", //��������ʱ,��label�����ı�ʶ,һ��Ϊ��ɫ�� * 
    userDir: "/fceformext", //�û��Զ������ݵĻ�Ŀ¼
    keyFieldValueTag: ":get_keyfield", //�����滻�����ֶ�ֵ�ı�ʶ 
    cardWinUrl: "", //�������б�ʽ���д���Ҫ�򿪵Ŀ�Ƭʽ����URL��djsn.
    eventBefore: new Array(), //�������ϰ�ť���¼�
    eventAfter: new Array(),
    submitUserType: null, //�����ύ�������û����õķ���
    submitPubParam: null, //�����ύ������ȫ�ֲ���
    transRecNo: 0,   //���ݼ������ڱ���ǰת���¼���ȡ��ǰ��¼��
    loadingHttpArr: new Array(), //
    loadingHttpData: "",

    loading: null,     //��¼����ʱ��װ�����
    encoding: "gb2312", //ǰ̨���ַ�������.
    getServerTimeTag: ":get_server_time", // ȡ������ʱ����滻��ʶ,
    nullValue: ":null", //��ʾ���ݿ��е�nullֵ

    isDebug: true, //�Ƿ��ܽ�����vs����������js����, ��Ϊfalse��ֻ�Ǽ�¼������־,������ʾ����,��try catch����.
    loggerObj: null,
    logger: function() { //��־
        return {
            debug: function(msg, _callee, e) {
                return; //��Ҫ��־����Ϊ�ڴ���������ҳ������ʱ������л����2013-06-07
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
    noPermitTag: "*N/A*", //û��Ȩ��ʱ��ʾ�ı�ǣ�2012-09-04
    querySelectTag: "*��ѡ��*", //��ѯ����ѡ������ʱ�ı�ǣ�2012-09-28
    owneridHead: "fc_owner_id_", //��¼��Ȩ�޿���ʱ���ֶ�����ǰ׺��2012-11-02
    fc_org_all_id: "fc_org_all_id_", //��¼��Ȩ�޿���ʱ���ֶ�����ǰ׺��2013-05-22

    eformPrintIframeName: "fcEbiaoPrnIframe", //��eform�д�ӡebiao�ؼ�ʱ�ӵ�����iframe����

    tmpDomainPath: "http://192.168.1.161/fcbug", //="http://localhost/fcbug"����="http://demo.fcsoft.com.cn:9090/fcbug" http://192.168.1.161/fcbug
    validEventObj: null, //���ڼ�ס���ݼ��е�������֤�¼��Ķ���

    genArrObj: new Array(), //������ģ������ɳ������õĶ���.
    genEventObj: new Object(), //������ģ������ɳ������õĶ���.�����¼�������ȡ.

    pubObj: new Object(), //ͨ�õĶ��󣬹��û����ɶ���ȫ�ֱ����ã����̶���ĳ�����á�
    topWinObj: new Object(), //ͨ�õĶ��󣬹��û����ɶ���ȫ�ֱ����ã����̶���ĳ�����á����ڶ��㴰�����ã�����������Ĵ����н�����������ã��������ڽ�����ѯ����
    elList: null, //��ϸ����E�����
    elCard: null, //��Ƭʽ������E�����
    oldWidgets: "SKButton,SKDBedit,checkbox,label,radio,listbox,textarea,combobox,password,upload,SKDBtext,chart,dbimg,img,SKBILLgrid,shape,tab,div,DsMain_field,a,button,text,hr,checkboxlist,radiolist,dropdownlist,grid,dataset,spin,excel,tree,ebshow,ebiao,layout,page,eblayout", //ԭ���Ŀؼ�
    isModalUser: Sys.Browser.agent != Sys.Browser.InternetExplorer, //�Ƿ����Լ�����ģ̬���ڡ�true,//
    runParams: new Array(), //�����в���
    popup: null, //window.createPopup() //�ȴ�����
    keyScene: "����" //�����ؼ���

};

(function() {
	//����·��	
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
    //������־����
    fcpubdata.loggerObj = log4javascript.getLogger();
   // var popUpAppender = new log4javascript.PopUpAppender();
   // var popUpLayout = new log4javascript.PatternLayout("%d{HH:mm:ss} %-5p - %m%n");
   // popUpAppender.setLayout(popUpLayout);
   // fcpubdata.logger.addAppender(popUpAppender);
    var ajaxAppender = new log4javascript.AjaxAppender(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=logger");
    ajaxAppender.setThreshold(log4javascript.Level.ERROR);
    ajaxAppender.setTimed(true);
    ajaxAppender.setTimerInterval(60000); //ms����
 //   ajaxAppender.setBatchSize(10); //һ��10��
    ajaxAppender.setSendAllOnUnload(true);

    //alert(ajaxAppender.getBatchSize(3))
    //var xmlLayout = new log4javascript.XmlLayout();
   // ajaxAppender.setLayout(log4javascript.XmlLayout());
    fcpubdata.loggerObj.addAppender(ajaxAppender);
    //fcpubdata.logger.debug("Debugging message (appears in pop-up)");
*/
})();

/**
* ȡ��ǰURL�ĵ�һ������,һ��������Ŀ¼������,��: /WebBill
* ��ֱ�ӷ�����rootĿ¼��,��������Ŀ¼�Ļ�,���ô˺����̶�����"".
**/
function GetUrlFirstPart(){
	var tmp12345 = location.pathname ;
	tmp12345 = tmp12345.substring(0,tmp12345.indexOf("/",1));
	if(tmp12345.substring(0,1) != "/") tmp12345 = "/" +tmp12345;
	return tmp12345;
}
//------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------
//���濪ʼ

Type.registerNamespace("Eapi");
Type.registerNamespace("Eform");
Eapi.UserData = function() {}
Eapi.UserData.prototype = 
{
    save : function (Main,Sub,strContent){
        /**
        *�����ݴ浽���ݻ�����
        *@param Main Ϊ��key, ��"List".
        *@param Sub Ϊ��key,��"CustomerFlag"
        *@param strContent ΪҪ���������
        *@return �޷���
        */
	    try{
    	    userData=parent.pubdata.oForm.oInput ;
	    }catch(e){return;}
	    userData.setAttribute(Main+userData.value,strContent) ;
	    userData.save(Sub+userData.value) ;
    },
    load : function (Main,Sub){
        /**
        *�����ݻ�����װ�뵽������
        *@param Main Ϊ��key, ��"List".
        *@param Sub Ϊ��key,��"CustomerFlag"
        *@return ����ȡ��������
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
        /// <summary>�ַ��ͱ�ʵ���������û��Զ��庯���ã����ַ�Ϊ����Ϊ0</summary>
        /// <param name="str1" type="String" >Ҫת�����ַ���</param>
        /// <returns type="Float" >ת�������ֵ</returns>
	    var s1=new Eapi.Str().trim(str1);
	    var f1=parseFloat(s1);
	    if(isNaN(f1)) {return 0;}
	    return f1;
    },
    toInt : function (str1){
        /**
        ת��������
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
        *��С��λ����ʽ���ַ�
        *@param sValue ΪҪ��ʽ�����ַ���,
        *@param sPointNum ΪС��λ��,����
        *@return ���ظ�ʽ������ַ���
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
        /// <summary>�ַ��ͱ����ڣ�֧�ּ��ֳ��������ڸ�ʽ</summary>
        /// <param name="strDate" type="String" >Ҫת�������ڵ��ַ���</param>
        /// <returns type="Date" >ת���������</returns>
        strDate = strDate.trim();
        var format = ["yyyy-MM-dd","yyyy-M-d","yyyy/MM/dd","yyyy/M/d","yyyy.MM.dd","yyyy.M.d","yyyyMMdd","yyyyMd","yyyy��MM��dd��","yyyy��M��d��" ];
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
        //�˵����߿ո�
        if (strMain == null) { return ""; }
        strMain = strMain + "";
        return strMain.trim();
    },
    isTrue: function(svalue) {
        /**
        *�ж��Ƿ�Ϊtrueֵ
        *@date 2005-01-14
        **/
        if (svalue == false || svalue == "false" || svalue == "False" || svalue == "no" || svalue == 0 || svalue == "0" || svalue == "off" || svalue == "��" || svalue == "��" || svalue == "" || typeof (svalue) == "undefined" || svalue == "undefined" || svalue == null || svalue == "null") // 2012-12-23 ���� || svalue == "null"
            return false;
        else
            return true;
    },
    isSpace: function(strMain) {
        /**
        *�ж��Ƿ�Ϊ��
        **/
        var strComp = strMain;
        try {
            if (strComp == "��" || strComp == "" || strComp == " " || strComp == null || strComp == "null" || (typeof (strComp) == "string" && strComp.length == 0) || typeof strMain == "undefined" || strMain == "undefined") {
                return true;
            }
            else {
                return false;
            }
        } catch (e) { return false; }
    },
    isBackErrInfo: function(sRet) {
        ///�Ƿ��Ǻ�̨���صĴ�����Ϣ
        return IsSpace(sRet) == false && sRet.substring(0, 12) == '{"errInfo":"';
    },
    repStr: function(mainStr, findStr, replaceStr) {
        /**
        //�������ַ���

        **/
        if (typeof (mainStr) == "undefined" || mainStr == null) { return ""; }
        
        mainStr = mainStr + ""; //ǿ�Ʊ���ַ���
        var convertedString = mainStr.split(findStr);
        convertedString = convertedString.join(replaceStr);
        return convertedString;
    },
    repNewLine: function(sRun) {
        /**
        *�滻���з�
        **/
        return RepStr(sRun, "\r\n", "&#13;&#10;");
    },
    unRepNewLine: function(sRun) {
        return RepStr(sRun, "&#13;&#10;", "\r\n");
    },
    repXml: function(sRun) {
        /**
        //����Ƿ�XML�ַ�	
        **/
        sRun = RepStr(sRun, "&", "&amp;");
        sRun = RepStr(sRun, ">", "&gt;");
        sRun = RepStr(sRun, "<", "&lt;");
        return sRun;
    },
    unRepXml: function(sSql) {
        /**
        //ת��ԭ��	
        **/
        sSql = RepStr(sSql, "&lt;", "<");
        sSql = RepStr(sSql, "&gt;", ">");
        sSql = RepStr(sSql, "&amp;", "&");
        return sSql;
    },
    getDsnSql: function(oSql) {
        ///ȡ��sql��datasourceName
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
        var propName; //�滻�ֶ��������е��ر��ʶ.
        for (propName in fcpubdata.repMark) {
            sTitle = RepStr(sTitle, "${" + propName + "}", fcpubdata.repMark[propName])
        }
        return sTitle;
    },
    genWhere: function(fieldName, fieldType, fieldValue, isLike) {
        ///����һ��where, 2012-09-27
        var sQuot = "'";
        var sQuotEnd = "'";
        if (fieldType == "����" || fieldType == "ʵ��") {
            sQuot = "";
            sQuotEnd = "";
        }
        if (fieldType == "����" && fcpubdata.databaseTypeName == "oracle") {
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
        *���ת���ɴ�д
        *@date 2003-12-10
        **/
        var intFen, i;
        var strArr, strCheck, strFen, strDW, strNum, strBig, strNow;

        if (new Eapi.Str().trim(value) == "") {   //����Ϊ��ʱ����"��"
            return "��";
        }
        if (isNaN(value))   //���ݷǷ�ʱ��ʾ�������ؿմ�
        {
            strErr = "����" + value + "�Ƿ���";
            alert(strErr);
            return "";
        }
        strCheck = value + ".";
        strArr = strCheck.split(".");
        strCheck = strArr[0];
        var len = strCheck.length;
        if (len > 12)   //���ݴ��ڵ���һ����ʱ��ʾ�޷�����
        {
            strErr = "����" + value + "�����޷�����";
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
            if (ipos < 0) {  //û��С��λ
                strFen = svalue + "00";
            } else if (ipos == iiLen - 2) { //ֻ��һλС��
                strFen = svalue.substring(0, iiLen - 2) + svalue.substring(iiLen - 1, iiLen) + "0";
            } else if (ipos == iiLen - 3) { //ֻ��2λС��
                strFen = svalue.substring(0, iiLen - 3) + svalue.substring(iiLen - 2, iiLen);
            } else { //��2λ���ϵ�С��λ
                strFen = svalue.substring(0, ipos) + svalue.substring(ipos + 1, ipos + 3);
            }
            //intFen = value*100;          //ת��Ϊ�Է�Ϊ��λ����ֵ
            //strFen = intFen.toString();
            //strArr = strFen.split(".");
            //strFen = strArr[0];
            intFen = strFen.length;      //��ȡ����
            strArr = strFen.split(""); //��������ֵ�ֽ⵽������
            while (intFen != 0)   //�ֽⲢת��
            {
                i = i + 1;
                switch (i)              //ѡ��λ
                {
                    case 1: strDW = "��"; break;
                    case 2: strDW = "��"; break;
                    case 3: strDW = "Ԫ"; break;
                    case 4: strDW = "ʰ"; break;
                    case 5: strDW = "��"; break;
                    case 6: strDW = "Ǫ"; break;
                    case 7: strDW = "��"; break;
                    case 8: strDW = "ʰ"; break;
                    case 9: strDW = "��"; break;
                    case 10: strDW = "Ǫ"; break;
                    case 11: strDW = "��"; break;
                    case 12: strDW = "ʰ"; break;
                    case 13: strDW = "��"; break;
                    case 14: strDW = "Ǫ"; break;
                }
                switch (strArr[intFen - 1])              //ѡ������
                {
                    case "1": strNum = "Ҽ"; break;
                    case "2": strNum = "��"; break;
                    case "3": strNum = "��"; break;
                    case "4": strNum = "��"; break;
                    case "5": strNum = "��"; break;
                    case "6": strNum = "½"; break;
                    case "7": strNum = "��"; break;
                    case "8": strNum = "��"; break;
                    case "9": strNum = "��"; break;
                    case "0": strNum = "��"; break;
                }

                //�����������
                strNow = strBig.split("");
                //��Ϊ��ʱ�����
                if ((i == 1) && (strArr[intFen - 1] == "0")) {
                    strBig = "��";
                }
                //��Ϊ��ʱ�����
                else if ((i == 2) && (strArr[intFen - 1] == "0")) {    //�Ƿ�ͬʱΪ��ʱ�����
                    if (strBig != "��")
                        strBig = "��" + strBig;
                }
                //ԪΪ������
                else if ((i == 3) && (strArr[intFen - 1] == "0")) {
                    strBig = "Ԫ" + strBig;
                }
                //ʰ��Ǫ��һλΪ������ǰһλ��Ԫ���ϣ���Ϊ������ʱ����
                else if ((i < 7) && (i > 3) && (strArr[intFen - 1] == "0") && (strNow[0] != "��") && (strNow[0] != "Ԫ")) {
                    strBig = "��" + strBig;
                }
                //ʰ��Ǫ��һλΪ������ǰһλ��Ԫ���ϣ�ҲΪ������ʱ���
                else if ((i < 7) && (i > 3) && (strArr[intFen - 1] == "0") && (strNow[0] == "��"))
                { }
                //ʰ��Ǫ��һλΪ������ǰһλ��Ԫ��Ϊ������ʱ���
                else if ((i < 7) && (i > 3) && (strArr[intFen - 1] == "0") && (strNow[0] == "Ԫ"))
                { }
                //����Ϊ��ʱ���벹������
                else if ((i == 7) && (strArr[intFen - 1] == "0")) {
                    strBig = "��" + strBig;
                }
                //ʰ��Ǫ����һλΪ������ǰһλ�������ϣ���Ϊ������ʱ����
                else if ((i < 11) && (i > 7) && (strArr[intFen - 1] == "0") && (strNow[0] != "��") && (strNow[0] != "��")) {
                    strBig = "��" + strBig;
                }
                //ʰ��Ǫ����һλΪ������ǰһλ�������ϣ�ҲΪ������ʱ���
                else if ((i < 11) && (i > 7) && (strArr[intFen - 1] == "0") && (strNow[0] == "��"))
                { }
                //ʰ��Ǫ����һλΪ������ǰһλΪ��λ��Ϊ������ʱ���
                else if ((i < 11) && (i > 7) && (strArr[intFen - 1] == "0") && (strNow[0] == "��"))
                { }
                //��λΪ���Ҵ���Ǫλ��ʮ������ʱ������Ǫ�䲹��
                else if ((i < 11) && (i > 8) && (strArr[intFen - 1] != "0") && (strNow[0] == "��") && (strNow[2] == "Ǫ")) {
                    strBig = strNum + strDW + "����" + strBig.substring(1, strBig.length);
                }
                //����������λ
                else if (i == 11) {
                    //��λΪ������ȫΪ�����Ǫλʱ��ȥ����Ϊ��
                    if ((strArr[intFen - 1] == "0") && (strNow[0] == "��") && (strNow[2] == "Ǫ")) {
                        strBig = "��" + "��" + strBig.substring(1, strBig.length);
                    }
                    //��λΪ������ȫΪ�㲻����Ǫλʱ��ȥ����
                    else if ((strArr[intFen - 1] == "0") && (strNow[0] == "��") && (strNow[2] != "Ǫ")) {
                        strBig = "��" + strBig.substring(1, strBig.length);
                    }
                    //��λ��Ϊ������ȫΪ�����Ǫλʱ��ȥ����Ϊ��
                    else if ((strNow[0] == "��") && (strNow[2] == "Ǫ")) {
                        strBig = strNum + strDW + "��" + strBig.substring(1, strBig.length);
                    }
                    //��λ��Ϊ������ȫΪ�㲻����Ǫλʱ��ȥ����	
                    else if ((strNow[0] == "��") && (strNow[2] != "Ǫ")) {
                        strBig = strNum + strDW + strBig.substring(1, strBig.length);
                    }
                    //�����������
                    else {
                        strBig = strNum + strDW + strBig;
                    }
                }
                //ʰ�ڣ�Ǫ����һλΪ������ǰһλ�������ϣ���Ϊ������ʱ����
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] == "0") && (strNow[0] != "��") && (strNow[0] != "��")) {
                    strBig = "��" + strBig;
                }
                //ʰ�ڣ�Ǫ����һλΪ������ǰһλ�������ϣ�ҲΪ������ʱ���
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] == "0") && (strNow[0] == "��"))
                { }
                //ʰ�ڣ�Ǫ����һλΪ������ǰһλΪ��λ��Ϊ������ʱ���
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] == "0") && (strNow[0] == "��"))
                { }
                //��λΪ���Ҳ�����Ǫ��λ��ʮ������ʱȥ���ϴ�д�����
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] != "0") && (strNow[0] == "��") && (strNow[1] == "��") && (strNow[3] != "Ǫ")) {
                    strBig = strNum + strDW + strBig.substring(1, strBig.length);
                }
                //��λΪ���Ҵ���Ǫ��λ��ʮ������ʱ������Ǫ��䲹��
                else if ((i < 15) && (i > 11) && (strArr[intFen - 1] != "0") && (strNow[0] == "��") && (strNow[1] == "��") && (strNow[3] == "Ǫ")) {
                    strBig = strNum + strDW + "����" + strBig.substring(2, strBig.length);
                } else {
                    strBig = strNum + strDW + strBig;
                }
                strFen = strFen.substring(0, intFen - 1);
                intFen = strFen.length;
                strArr = strFen.split("");
            }
            if (strBig == "��") { strBig = "��"; }
            return strBig;
        } catch (err) {
            return "";      //��ʧ���򷵻�ԭֵ
        }
    },

    repOpenSql: function(sql, slikevalue) {
        /**

        ����򿪵�sql����е� :
        ���ҷ�ʽ: ��:�ſ�ͷ,��βΪ) ,
        ȡ��ǰ�û������� :get_userid
        ȡ��ǰ������ :get_curdate
        :DsMain.field1 
        *@date 2004-03-23
        **/

        //alert("sql:"+sql)
        if (isSpace(sql)) { return ""; }
        if (fcpubdata.databaseTypeName == "mysql") {
            sql = new Eapi.Str().trim(sql);
            if (sql.substring(0, 4).toUpperCase() == "EXEC") {
                alert("��mysql���ݿⲻ֧�ִ洢����!���޷�ʹ�ô˹���!");
                return sql;
            }
        }


        //��������ʽ����pubDataSet['DsMain']������,����pubDsMain = fcpubdata.obj['DsMain'] pubdssub1 = fcpubdata.obj['dssub1']
        /*
        try{
        var pubDsMain = fcpubdata.obj['DsMain'] ;
        }catch(E){}
        try{	
        var pubdssub1 = fcpubdata.obj['dssub1'] ;
        }catch(E){}
        */
        //���س����з���ɿո�,����������ʽƥ�����
        //alert("a:"+sql)

        sql = repStr(sql, "\r\n", " ");
        //alert("s:"+sql);
        //CopyToPub(sql)

        //���ؼ��� {������}  ==> ' 2008-03-27 add
        sql = repStr(sql, "{������}", "'");
        //���滻���� :{ �� }: ֮�� js������ֵ 2008-02-28

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
                    alert("sql����е� :{ û�к� }: ��ƥ��!");
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
                //֧�ֱ�����
                //    sRep= eval(s1.substring(2,s1.length)) ;
                //    sRep=sRep;
            } else {
                //alert(s1)
                var arr2 = s1.split(".");
                if (arr2.length == 1) {
                    if (s1 == ":key_value") {
                        sRep = "'" + fcpubdata.keyValue + "'";
                    } else { //���ǵ�sql��������� 2006-01-01 01:01:01 ʱ�����,����̶�д��Ϊ :key_value
                        sRep = s1;
                    }
                } else {
                    //ǰ��Ϊ���ݼ�������Ϊ�ֶ���
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
                                //	alert("���ݼ�"+stmp1+"��δ��,��ʱ�޷�ȡ���ֶ�ֵ.");
                                //}else{
                                alert(stmp1 + "�в������ֶ�" + stmpField); sRep = "'" + "'";
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
        * ȥ���������
        * 13==>15 -7==>-9 ��ָ��β�û��лس���
        *@param strX ΪҪ����ǰ���ַ���,
        *@return ���ش������ַ���
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
        *���ַ���д��ճ������
        *@date 2004-02-20
        **/
        window.clipboardData.setData("Text", str);
    },
    showHelp: function(htmlfile) {
        /**
        *��ʾ����ҳ��
        *@para htmlfile ����ҳ���HTM�ļ���
        *@date 2005-07-25
        **/
        //alert(fcpubdata.path+"/eformhelp/" + htmlfile + ".htm");
        window.open(fcpubdata.path + "/eformhelp/" + htmlfile + ".htm", "_blank", "top=0,left=0,height=400,width=300,status=no,toolbar=yes,menubar=no,location=no,resizable=yes,scrollbars=yes")
    },
    /*showWait: function(displaystr) {
    ///��ʾ�ȴ�����
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
        *��һ��combo�ؼ���value����,�ָ���һ���ַ���
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
        ///ȡ������ȫ�ֲ�������
        var pubAllValue = this.getAllPubParamValue();
        if (IsSpace(pubAllValue)) return "";
        var arrRet = new Array();
        var arr = pubAllValue.split(",");
        for (var i = 0; i < arr.length; i++) {
            var arrSub = arr[i].split("=");
            var sName = arrSub[0];
            var arr1 = new Array();
            arr1[0] = sName;
            arr1[1] = "<span style='color:red;'>����˵����</span><br/>ȡ��ǰ��" + sName + "<br/>";
            arrRet[i] = arr1;
        }
        return arrRet;
    },
    getAllPubParamValue: function() {
        ///ȡȫ�ֲ������ݵ�ǰ̨   
        var pubAllValue = top.eformPubParamValue;
        if (typeof (pubAllValue) == "undefined") {
            //��Ҫ����̨ȥȡ
            pubAllValue = this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getAllPubParamValue", "");

            if (new Eapi.Str().isBackErrInfo(pubAllValue)) {
                alert(pubAllValue); //��ʾ��̨������
                return "";
            }
            top.eformPubParamValue = pubAllValue;
        }
        //if(pubAllValue == "") return ""; //��ʾ��session��������û������ȫ�ֲ�������
        return pubAllValue;
    },
    directLogin: function() {
        ///�������ֱ�ӵ�¼��2013-08-18   
        //��Ҫ�����Ǹ��ݵ�ǰ��cookie���ݸ���һ������������session����
        var sRet = this.sendHttp(fcpubdata.tmpDomainPath + "/ebsys/eformaspx/WebBill.aspx?key=directLogin", ""); //��Ϊfcbug���̶̹���.net�档
        if (!IsSpace(sRet)) {
            alert(sRet);
            return false;
        }
        return true;
    },
    sqlToField: function(oSql) {
        /**
        *ͨ��SQL����һ���ֶεĵ�һ����¼ֵ,��������:�ַ�
        *@param sql ΪҪ������ַ���,
        *@return ����һ������
        */
        var oDsn = new Eapi.Str().getDsnSql(oSql);
        var sXml = "<No>" + RepXml(oDsn.sql) + "</No>";
        var retX = this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=SqlToField" + oDsn.dsn, sXml);
        if (new Eapi.Str().isBackErrInfo(retX)) {
            //���г�����
            alert(retX);
        }
        return retX;
    },
    /*insertSqls : function (sSql) {
    ///ִ�ж�SQL����
    var retX=this.sendHttp(location.protocol+"//"+location.host + fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?inserts",sSql);
    return retX;
    },
    insertSql : function (sSql) {
    ///ִ�в���
    if(fcpubdata.databaseTypeName == "mysql" && sSql.substring(0,4).toUpperCase() == "EXEC" ){
    alert("��mysql���ݿⲻ֧�ִ洢����!���޷�ʹ�ô˹���!");
    return "";
    }
    var sXml="<No>"+sSql+"</No>";
    var retX=this.sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?fc_insert",sXml);
    return retX;
    },*/
    selectSql: function(oSql, PageNo, PageSize, callback, context) {
        /**
        *ִ�в�ѯ
        *@param PageNo ҳ��
        *@param PageSize ҳ�ߴ�,��һҳ��������
        *@return ��ѯ���
        **/
        //if(fcpubdata.databaseTypeName == "mysql" && sSql.substring(0,4).toUpperCase() == "EXEC" ){
        //    alert("��mysql���ݿⲻ֧�ִ洢����!���޷�ʹ�ô˹���!");

        //}

        var oDsn = new Eapi.Str().getDsnSql(oSql);
        var sql1 = RepXml(oDsn.sql);
        //CopyToPub(sql1)
        //����Ƿ�XML�ַ�
        var sXml = "<sql>" + sql1 + "</sql>" + "<pageno>" + PageNo + "</pageno>" + "<pagesize>" + PageSize + "</pagesize>";
        var retX = this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=fc_select" + oDsn.dsn, sXml, callback, context);
        return retX;
    },
    getMaxNo: function(sTag, strMK) {
        /**
        *��������
        **/
        return this.sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=getRecnum", "<no>" + sTag + "</no>");
    },
    getMaxIntNo: function(sTag) {
        /**
        *�������������
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
        *����XMLDOM����
        *@param sXml xml�ַ���
        *@return XML����
        *@date 2004-03-27
        **/

        //modify by liuxr at 2010-10-12 �������������dom����
        var oXml = null;
        if (window.ActiveXObject) {
            if (sXml == null) sXml = undefined; //��Ϊ�˺���ǰ�Ĵ������,�� SKbillsheet.contxml == undefined,�� $id("SKbillsheet").getAttribute("contxml") == null 2012-02-09 my add
            oXml = new ActiveXObject('Microsoft.XMLDOM');
            oXml.async = false;
            oXml.loadXML(sXml);
        }
        else {
            if (IsSpace(sXml) || sXml.substring(0,1) != "<") { //��Ϊ�˺���ǰ�Ĵ������
                var o = new Object();
                o.documentElement = null;
                return o;
            }
            parser = new DOMParser();  //IE ��֧�� DOMParser�����෴����֧��ʹ�� Document.loadXML() �� XML ������
            oXml = parser.parseFromString(sXml, "text/xml");
        }
        return oXml;
    },
    setDomFile: function(sPath) {
        /**
        *����XMLDOM����
        *@param sPath ���������ļ���url
        *@return XML����
        *@date 2005-02-17
        **/

        var oTopWin = getTopWin();
        var isFindTopWin = typeof (oTopWin.fctopdata) != "undefined"; //��ʾ�Ҷ��˶���������

        var isBillType = isFindTopWin && sPath.indexOf("billtype.xml") >= 0;
        if (isBillType && oTopWin.fctopdata.billtype != null) return oTopWin.fctopdata.billtype;

        var isBillPos = isFindTopWin && sPath.indexOf("billpos.xml") >= 0;
        if (isBillPos && oTopWin.fctopdata.billpos[sPath] != null) return oTopWin.fctopdata.billpos[sPath];

        var isEconfig = isFindTopWin && sPath.indexOf("econfig.xml") >= 0;
        if (isEconfig && oTopWin.fctopdata.econfig != null) return oTopWin.fctopdata.econfig;

        var bReRead = false;
        var oXml;
        //modify by liuxr at 2010-10-12 �������������dom����
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
                //��������Ϊ��ajax��ʽ�� 2011-05-06
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
            //ע����������,�����һ��ʱ�ᱨ�ļ�δ�ҵ�. 2011-10-27
            //if (oXml.documentElement == null) {
            //    alert("���ļ� " + sPath + " ����,���������ݲ��ǺϷ���XML��ʽ! ������Ϣ: " + retX);
            //}
        }
        
        if (isBillType) oTopWin.fctopdata.billtype = oXml; //�����ȥ.
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
        var oTopWin = top; //ȡ���㴰��
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
        ///��̬������ʽ����·��.
        if (sSkins != "base" && sSkins != "red" && sSkins != "green" && sSkins != "blue" && sSkins != "white" && sSkins != "yellow" && sSkins != "light")
            fcpubdata.skinsPath = fcpubdata.userDir;
    },
    getPart: function(csstext) {
        /**
        ������CSS�е�������ɫ����Ϣ
        csstext1="DISPLAY: block; FONT-WEIGHT: bold; FONT-SIZE: 18px; LEFT: 339px; WIDTH: 48px; COLOR: #000000; FONT-STYLE: italic; FONT-FAMILY: ����_GB2312; POSITION: absolute; TOP: 65px; HEIGHT: 12px; BACKGROUND-COLOR: #80ffff" 
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
        *���CSS�е�һ��
        *@para obj Ҫ����Ķ���
        *@para attrName Ҫ��յ�������
        *@date 2005-04-26
        **/
        if (typeof (obj) == "undefined" || typeof (attrName) == "undefined") return;
        eval("obj.style." + attrNameJs + "='';");
        var s1 = obj.style.cssText;
        attrName = attrName.toUpperCase();
        obj.style.cssText = RepStr(s1, attrName, "");

    },
    changePosition: function(csstext, propName, adjustValue) {
        ///����һ��style�ַ����е��󶥸߿�ֵ,���ص���Ľ���ַ���
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
        ///�����п�Ϊ0�����أ�2012-12-11
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

//        ///����table ��ĳһ�У�2012-12-04
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
//        //��Ҫɾ��colԪ��
//        oTable.children[0].removeChild(objCol);
//        
    },
    showCol: function(oTable, colNo) {
        ///�����п�Ϊ0�����أ�2012-12-11
        var oTd = oTable.rows[0].cells[colNo];
        if (ToInt(oTd.getAttribute("oldWidth")) > 0) oTd.style.width = oTd.getAttribute("oldWidth");

        /*
        for (var j = 0; j < oTable.childNodes[0].childNodes.length; j++) {
        if (oTable.childNodes[0].childNodes[j].getAttribute("pos") == colNo + 1) {
        oTable.childNodes[0].childNodes[j].style.width = oTable.childNodes[0].childNodes[j].getAttribute("oldWidth");
        break;
        }
        }

        
        ///��ʾtable ��ĳһ�У�2012-12-07
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
        //����col
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
        *�ж��Ƿ����ϴ��ؼ�
        *@date 2005-01-13
        **/
        try {
            var ooo = $id("upload1");
            if (ooo == null) { return false; }
        } catch (e) {
            //�����ʾ���ϲ������ϴ������Ŀؼ�.
            return false;
        }
        return true;

    },
    uploadImg: function() {
        /**
        //��ͼ���ֶ���˫��ʱ��ʾ�ϴ�ģʽ����
        **/

        //���д�UPDATE���Ĳ�������
        var oImg = NavJs.getEventObj();
        //��ʾ�����״̬
        if (oImg.isContentEditable) return;
        //alert("out:"+oImg.id)
        var arr = window.showModalDialog(fcpubdata.path + "/fceform/common/uploadimgmain.htm", oImg, "scroll:no;status:no;dialogHeight:150px;dialogWidth:350px;dialogTop:180;dialogLeft:250px");
        if (typeof arr == "undefined") return;
        //alert(arr[2]);
        
        //modify by liuxr at 2010-10-20 17:55 ����safari���������<input type="file" name="file"> �ϴ��ļ���ȡfile.valueʱֻ��ȥ���ļ�����û���ļ�·��������ʵ��Ԥ����Ч����������ʾ�������ϵ�·��
        if (navigator.userAgent.indexOf("Safari") > -1) {
            oImg.src = location.protocol + "//" + location.host + fcpubdata.path + arr[2];
        } else {

            //���ǵ�IE8�����޷�ֱ����ʾ�ͻ��˵�ͼƬ,���Ը�����ʾ�������˵�ͼƬ, 2010-12-16 my add
            oImg.src = "../.." + arr[2];
        }
        //alert(oImg.field+":"+oImg.src)
        var ods = $obj(oImg.getAttribute("dataset"));
        if (ods != null) {
            if (ods.bAdd == false) ods.bEdit = true;
            ods.Field(oImg.getAttribute("field")).Value = arr[2]; //��̨���ļ���+/fceformext/res·��
            ods.Field(oImg.getAttribute("field")).valid = "��"; //��ʾ��ͼƬ�ѸĶ���,Ҫ�����ϴ�.

        }

    }

}
Eapi.Upload.registerClass("Eapi.Upload");

Eapi.GetPos = function(){}
Eapi.GetPos.prototype =
{
    getAbsLeft: function(e) {
        /**
        *�ҵ�һ������ľ���λ��
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
        //����һ������Session����ֵ
        //strQueryString ��:userid=12&username=liuxm
        //����ֵ:��
        /*if (document.all("ifrSession") == null) {
        document.body.insertAdjacentHTML("BeforeEnd", "<IFRAME id=ifrSession name=ifrSession src='' width=0 height=0></IFRAME>");

        }
        document.all.ifrSession.src = location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=setSession&" + strQueryString;

        document.all.ifrSession.onreadystatechange = function() {
        if (document.all.ifrSession.readyState != "complete") return;
        if (typeof callback == "function") {
        callback(); //��ֵ����
        }
        }
        */

        SendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=setSession&" + strQueryString, callback);
    },

    getSession: function(strQueryString, callback) {
        //ȡ��һ������Session����ֵ
        //strQueryString ��:userid=&username=
        //�����������:arrRet["userid"]
        /*	    if(typeof callback == "function"){
        if(strQueryString.substring(strQueryString.length-1,strQueryString.length) != "=") {
        strQueryString = strQueryString+"=";
        }
        if ( document.all("ifrSession") == null ){
        document.body.insertAdjacentHTML("BeforeEnd", "<IFRAME id=ifrSession name=ifrSession src='' width=0 height=0></IFRAME>");
        }
        fcpubdata.pubSession = "null" ; //���ȫ�ֱ�����ֵ.
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
        callback(arrRet); //��ֵ����
        }
        }
        }else{  //ȡ�̶���session����ֵ
        //����:"userid=12&username=liu" ==> arr
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
                callback(arrRet); //��ֵ����
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
        *ȡ����sessionֵ
        *@date 2006-01-26
        **/
        return GetSession(name + "=")[name];
    },
    iframeRun: function(iframeId, src, callback) {
        ///��iframe�����ú�̨����,
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
                callback(); //��ֵ����
            }
        }
    }


}



/**
*����ajax���첽�ص���ʽ
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
	        //�첽ʱ������Ϊ�ص������Ĳ���,����������: value,context,error
	        showWaitIframe("end");
	        var oRet = new ajax_response(request);
	        
	        if (oRet.error == null) {
	            ajaxCallbackAction(oRet.value, callback, oRet.context);
	        }
	        
	    }
	}
	
	request.obj.open('POST', url, async);
//	alert(url);
	//������ǰ��ͬ��д��
	if(noRoot == "noRoot" ){
		request.obj.send(data);
	}else{
		request.obj.send("<root>"+data+"</root>");
	}
	if(!async){
		//��ͬ��ʱ��ֱ�ӷ���ֵ,
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
                curXml += arrP2[0] + '="' + arrP2[1] + '"'; //�˴���datasourceName
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
    ///�첽ajax�Ĵ������
    
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
            //�����Լ�Ȩ����ʾ��Ϣ.
            //result.permitmsg = oJson.permitmsg;
        } catch (e) {
            result.value = sRet;
        }
        callback(result);
    }
    else { //�������ͷ���ʱ
        
        var oDom = SetDom(sRet);
        if (oDom.documentElement == null) {
            //CopyToPub(sRet);
            alert(sRet); //��̨�����쳣,�����쳣��Ϣ.
            return;
        }
        for (var j = 0; j < oDom.documentElement.childNodes.length; j++) {
            var sXmlOne = NavJs.xml(oDom.documentElement.childNodes[j]);
            sXmlOne = new Eapi.Str().removeRoot(sXmlOne);
            result.value = sXmlOne;
            result.context = fcpubdata.loadingHttpArr[j].context;
            fcpubdata.loadingHttpArr[j].callback(result);
        }
        callback(result); //�ٴε���һ�µ�ǰ�Ļص�����, ��ʱ result����û���õ� 
        fcpubdata.loadingHttpArr = new Array(); //���
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
    ///ȡHTC�ؼ���JS����
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
    ///ȡiframe���ڴ��ڶ���,iframe_idΪiframe��ID,oWin Ϊ��ĳ����������iframe,�ɿ�.
    if (typeof (oWin) == "undefined"){
        oWin = window;
    }
    var objIframe = oWin.document.getElementById(iframe_id);
    if (objIframe == null) return null;
    return objIframe.contentWindow;
}
function setTabTitle(sTitle) {
    ///�ı���ҳtabҳǩ�ı���, 2012-12-24

    var win_TabMenu = top.win_TabMenu;
    if (typeof (win_TabMenu) == "object") {
        top.eval("win_TabMenu.setTabTitle(\"" + sTitle + "\")");
        return true;
    }
    return false;
}
///ȡ�ͻ��˵ĵ�ǰ����,���� 2008-08-08 ��ʽ
function getdate()
{
    var curDate = new Date();
    return curDate.format("yyyy-MM-dd");
}
///ȡ�ͻ��˵ĵ�ǰʱ��,���� 2008-08-08 17:05:15 ��ʽ
function GetTime() {
    var curDate = new Date();
    return curDate.format("yyyy-MM-dd HH:mm:ss"); 
}

/**
*��������
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



//�µļ��ݺ���,2008-01-18

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

//ȫ�ֵ�$����
//function $isTrue(svalue) { return new Eapi.Str().isTrue(svalue);}
//function $isSpace(strMain){return new Eapi.Str().isSpace(strMain);}
//function $repStr(mainStr,findStr,replaceStr){return new Eapi.Str().repStr(mainStr,findStr,replaceStr);}
//function $toFloat(str1){return new Eapi.Num().toFloat(str1);}
//function $toInt(str1){return new Eapi.Num().toInt(str1);}
function $if(bool,trueValue,falseValue){if(bool) {return trueValue; } else { return falseValue; }}

function getDomNodeValue(oXml,nodeName){
///ȡDom��ָ���ڵ��ֵ
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
///ȡ�û���ȫ�ֲ�����Ϣ
///sName == "�û�.����" ��ʽ
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
///��ʱִ������,ֱ�������ڼ������
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
///document ready ��ִ������
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
//    ///��IDȡ��Name,������Nameȡ��Id,���������ݼ��Ķ���ʱת���¼���
//    if (typeof (sqlOrArr) == "array") {

//    } else { //sql���
//        var sXml = SelectSql(sqlOrArr, 1, -1);
//        var oXml = SetDom(sXml);
//        if (oXml.documentElement == null) {
//            alert("SQL��� " + sqlOrArr + " ���г���! ������Ϣ�� " + sXml);
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
*�ж�IE�汾
*@return ������ֵ��:5.5
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
ȡ��ǰ���еĺ�����.
�����ǰ�����������������򷵻������֣���������������򷵻ر���ֵ�ĺ���������������Ǳհ������������򷵻ء�anonymous����
ʹ�ã���Ҫ����ĺ����ڲ�ִ�д˺���������һ��������Ϊarguments.callee��
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
* ȡ���ڵĿ��,�߶� 2011-02-25
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
        default: //firefox ��
            clientWidth = Math.min(oWin.innerWidth, oWin.document.documentElement.clientWidth);
            clientHeight = Math.min(oWin.innerHeight, oWin.document.documentElement.clientHeight);
            offsetWidth = clientWidth;
            offsetHeight = clientHeight;

            break;
    }

    return { width: clientWidth, height: clientHeight,offsetWidth:offsetWidth ,offsetHeight:offsetHeight  };
/*    
��document.compatMode����BackCompatʱ��������ͻ��������document.body.clientWidth��
��document.compatMode����CSS1Compatʱ��������ͻ��������document.documentElement.clientWidth��
 
������ͻ����߶ȡ��������߶ȡ���������Left����������Top�ȵȶ�������������
 
һ��׼ȷ��ȡ��ҳ�ͻ����Ŀ�ߡ���������ߡ�������Left��Top�Ĵ��룺
 
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
 
�����ϴ������Ŀǰ���е�ȫ���������������IE��Firefox��Safari��Opera��Chrome��
*/    
}
/**
* ȡ����������, 2011-03-05
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
*�����ű��42
*@date 2004-12-03
**/
function quot_xml(s) {
    s = RepStr(s, "'", "&amp;quot;");
    return s;

}
/**
*�����ű��42
*@date 2004-12-03
**/
function quot_42(s) {
    var s1 = "";
    s = RepStr(s, "'", s1 + "\\42");
    return s;

}
//����ĺ����� fcselfuse.js ���Ƶ��˴�. my 2012-07-16
function getRecRowsObj(recRows) {
    ///��ÿ����¼��ռ��������һ������,����layout e��ؼ���
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
*�������д����ļ��������ļ���
*@param typePath �˱�������ָ��������·��
**/
function genDjHtmlFile(shtml, djsn, typePath, extname,allBrowser, callback, context) {
    //fcpubdata.path ������java����,.netδ��
    //var dtype = fcpubdata.databaseTypeName ;
    //if(fcpubdata.area.isfile == "��") dtype = "file" ; //��ʾ���ļ�������html�ļ�.
    var sXml = "<text>" + shtml + "</text>" + "<djsn>" + djsn + "</djsn>" + "<typepath>" + typePath + "</typepath>" + "<extname>" + extname + "</extname>" + "<allBrowser>" + allBrowser + "</allBrowser>";
    return new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=genDjHtmlFile", sXml, callback, context);
}


/// �����������
//===================================================================================

/**
* @func:����jqueryд����xpathд����ת������
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
        //�ж������Ƿ�����iPhone
        return /iPhone/i.test(navigator.userAgent);
    },
    isAndroid: function() {
        //�ж������Ƿ�����Android
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
        ///ģ̬�򿪴��ڣ�   sURL ���ڵ�ַ��vArguments ����������ڴ򿪵ı���ģ̬��������fcpubdata.obj ���յ������������ vOptions ģ̬���ڵĿ��(vOptions.width)�߶�(vOptions.height)��fCallback ģ̬���ڹرպ�ص��ĺ�����context �����ص������е������Ĳ���, fCallback ������д��Ϊ  function(oRet){  oRet.value ����ģ̬������ window.returnValue ��ֵ��oRet.context ���� context }
        openModalDialog(sURL, vArguments, vOptions, fCallback, context, null, null);

        function openModalDialog(sURL, vArguments, vOptions, fCallback, aCallbackArguments, btnOk, btnCancel) {
            if (sURL.toLowerCase().indexOf(location.host.toLowerCase()) == -1) { //����·����������
                var href = location.pathname;
                href = href.substring(href.indexOf("/", 1) + 1, href.length);
                href = href.substring(0, href.lastIndexOf("/") + 1);
                sURL = href.substring(0, href.lastIndexOf("/") + 1) + sURL;
                //������ 2011-04-07 �޸�����·�����������pathname�г��롣
                var pathname = top.location.href.substring(top.location.href.indexOf("//") + 2);
                var num = pathname.split("/").length - 3;
                for (i = 0; i < num; i++) {
                    sURL = "../" + sURL;
                }
            }
            if (IsSpace(top.Dialog)) {
                alert("Ӧ��ƽ̨��ҳ�����У�");
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
                //tianr 2011-6-16 ����frame.contentWindow�пգ�IE9�±��� 
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
    * @func ���������������ȡxml�ڵ��text����ֵ���Xml�ڵ��text���Ը�ֵ
    * @param node xml�ڵ����
    * @param svalue ��Ҫ��xml�ڵ�ĸ�ֵ���������Ҫ��ֵ�򲻴�ֵ��null
    * @return ����xml�ڵ��ֵ
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
    * @func ���������������ȡxml�ڵ��xml����ֵ
    * @param node xml�ڵ����
    * @return ����xml�ڵ��xml����ֵ
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
    * @func ֧�ֿ����������HTML�ַ���
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
    * @func ��չIE�µ�obj.fireEvent(eventType)
    * @date 2010-10-21 14:15
    * @param objID �ؼ�����
    * @param eventType �¼�����,onchange,onclick......
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
    * @func ��������������¼�
    * @date 2010-11-5 
    * @param objID �ؼ�����
    * @param eventType �¼����� onchange,onclick,onload......
    * @param methodName ��������
    * @param paramObj ��Ҫ���ݵ������еĲ�������,û�в���ʱ���Բ�д�˲���.
    **/
    addEvent: function(objID, eventType, methodName, paramObj) {

        var eventHander = methodName;
        if (paramObj) {
            // ���������¶���һ��������
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
    * @func ����ipad���������¼�
    * @date 2010-11-5 14:13 
    * @param el �ؼ�����
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
    * @func ��FF��û��innerText���ԣ�����һ������ʹ��,��fc_code��iframe��ȡinnerText����ʱʹ��
    * @date 2010-11-29 17:12
    * @param obj �ؼ�����
    * @param svalue ��Ҫ�ĸ�ֵ���������Ҫ��ֵ�򲻴�ֵ��null
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
    * @func ��ȡEvent,ͬʱ����ie��ff��д��
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
    * ȡ�÷����¼��Ķ���
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
        ///ȡ�ӽڵ��ֵ
        return NavJs.textContent(oXml.documentElement.childNodes[pos]);
    },
    getNodeValue11: function(oXml, pos, subPos) {
        ///ȡ���ӽڵ��ֵ
        return NavJs.textContent(oXml.documentElement.childNodes[pos].childNodes[subPos]);
    },
    getGridArr: function() {
        //modify by liuxr at 2010-11-15 11:48 ��ʼ�����е�grid�ؼ���onload�¼��жϵ�ǰ���������ȡwebgrid�ı�ǩ������IE����<html xmlns:fc xmlns:v="urn:schemas-microsoft-com:vml">ָ�������в���ǰ׺
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
        ///���¼��Ĵ�����,ԭ����eval(sCommand)��ִ�е��¼�����,��Ҫ�ô˺���������event����,
        var event_str = "event";
        //if (typeof (oEvent) == "undefined") event_str = "event"; //Ĭ��ʱ�¼�����Ϊevent
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
        ///ȡ���¼���ð��.
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
        ///ȡ��Ԫ��,��Ϊ��IE������Ὣ�սڵ�Ҳ��Ϊһ���ڵ���ռλ,����Ҫȥ���սڵ�. my add 2013-03-04 
        if (Sys.Browser.agent == Sys.Browser.InternetExplorer) {
            return oParent.childNodes[index];
        }

        var len = oParent.childNodes.length;
        var i = 0, j = 0;
        while (j < len) {
            if (oParent.childNodes[j].nodeType != 1) { // == 1 ��ʾ��׼�ڵ�
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
        ///�ж�һ��Ԫ���Ƿ��з��ı�����Ԫ�ء�2013-01-07
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
        ///ȡ��һ���ڵ㣬�����ı��ڵ㡣2013-06-05
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
        ///ȡ��һ���ڵ㣬�����ı��ڵ㡣2013-06-05
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
        ///ȡ��Ԫ��,��Ϊ��IE������Ὣ�սڵ�Ҳ��Ϊһ��Ԫ����ռλ,���Ը�Ϊͨ��tagName��ȡ,��ȥ���սڵ�.
        ///objMain = div �ؼ�����, tagName = "div" , index = 0,1 ֮���ֵ.
        if (objMain == null) return null;
        var tmpObj = objMain.getElementsByTagName(tagName);
        if (tmpObj.length < index + 1) return null;
        return tmpObj[index];
    },
    index: function(obj, tagName) {
        ///�ҵ������λ�ã���Ҫ���滻 oTd.cellIndex���ԣ� tagName ="TD"
        var objMain = obj.parentNode;
        var tmpObj = objMain.getElementsByTagName(tagName);
        for (var i = 0; i < tmpObj.length; i++) {
            if (tmpObj[i] == obj) {
                return i;
            }
        }

    },
    indexCol: function(oTable, colNo) {
        ///ȡ��table�е�col����Ϊ�˷����޸���ǰ�Ĵ����á�2012-12-09
        var oColGroup = this.child(oTable, "colgroup", 0);
        var oCol = this.child(oColGroup, "col", colNo);
        if (oCol == null) {
            oCol = oTable.rows[0].cells[colNo];
        }
        return oCol;
    },
    setWidth: function(obj, valuePx) {
        ///����objԪ�صĿ�ȣ�valuePxΪ��������λΪpx
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
        ///����objԪ�صĸ߶ȣ�valuePxΪ��������λΪpx
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
        ///���ֻ���ʱ����һ��url
        parent.location.replace(url);
    },
    mainOpenUrl: function(url, name, id) {
        ///�ڵ��Եģ���ҳ�ϴ�һ��ҳ�档
        ///idΪ�ϼ��˵���id,nameΪ��������
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
    * @func ��չ��IE�µ�selectNodes �� selectSingleNode ����
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
                //added by liuxr at 2011-7-28 13:43 android��selectNodes��д��
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
    * @func ��FF���������չouterHTML����
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
        //��չinnerText����
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
        * ���Ӽ����������detachEvent attachEvent ����
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
    // ����Ϊmy add 2012-02-02
    if (window.Event) {
        //���event��������
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
            //���srcElement
//            window.Event.constructor.prototype.__defineGetter__("srcElement", function() {
//                return this.target;
//            });
//            window.MouseEvent.constructor.prototype.__defineGetter__("srcElement", function() {
//                return this.target;
//            });
//            
        } catch (ee) { }
    }
    //����Ϊ 2013-01-05 my add
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
//ȡ������ؼ���
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
//��ȡ�����ؼ���
//var ApplicationScene="";//ȫ��Ӧ�ó��� 
function GetSceneKey() {
    //�ӿ����ҳ��ȡfcpubdata.keyScene��ֵ
    /*var scene = "����"; //PC,mobilePhone,tabletPC --PC�����ֻ�Ӧ�ã�ƽ�����	
    var browser = GetBrowserKey();
    if (browser.indexOf("msie") >= 0)
    scene = "����";
    else
    scene = "�ֻ�";
    */

    var scene = parent.fcpubdata.keyScene;

    return escape(scene);
}

/*
 * GB2312תUTF8
 * ����
 * var xx=new GB2312UTF8();
 * var Utf8=xx.Gb2312ToUtf8("��aaa��aaaaa");
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
*�ɱ��������Ƶõ�·��
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