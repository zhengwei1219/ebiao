	
	var btnListAdd={	//Ҫע��İ�ť���б�
		mytest1: ["�������¼ӵĹ������ϵİ�ť", "../images/ef_design_test.gif", false, "mytest1_onclick()"]
	}
	
	//fcpubdata.toolbar = "newnull,opendj,mytest1,|,opendjfile,billtype,djpreview,save,saveas,copy,paste,undo,redo,align,focus,front,behind,form,userfunction,userfunction1,addhtml,execute,showlist,eformhelp,designmenu,cbozoom,br,button,label,image,fcdiv,shape,pagecontrol,treeview,dblike,numedit,divcheckbox,divradio,dataset,webgrid,htmltable,formattab,dbedit,dbcheckbox,dbradiogroup,dblistbox,fccode,dbcombobox,dbmemo,dbimage,dbchart,file,excel,imgsetposition",

function mytest1_onclick() {
	alert("�������¼ӵĹ������ϵİ�ť!");
}

//���û���ҵ����ע�ᵽ������ѡ�񴰿���.�����������򵥵�ʾ��.�û����Ը�����Ҫ����

var arrRegFuncList=[
// 	["У�麯��","�û���","getuser11()","���������<br/> ��ǰ�û���. "],
 	["ҵ����", "ѡ����֯����", "fcUserFunc.selectOrg()", "˵����<br/> �����ؼ�����ʾ��֯�������ݣ���ѡ�� "],
 	["ҵ����", "ѡ��Ҫ�û��ڵ����֯����", "fcUserFunc.selectOrgUp()", "˵����<br/> �����ؼ�����ʾ��Ҫ�û��ڵ����֯�������ݣ���ѡ�� "],
 	["ҵ����", "ͨ����֯��������ѡ�û�", "fcUserFunc.selectOrgUsers()", "˵����<br/> ��������֯����������ѡ���û�����ѡ�� "],
 	["ҵ����", "ͨ����֯��������ѡ�û�", "fcUserFunc.selectOrgUserEb()", "˵����<br/> ��������֯����������ѡ���û�����ѡ����E�����ã������ܰ󶨵����ݼ�����ֵ�� "],
 	["ҵ����", "ѡ����֯ȫ·��", "fcUserFunc.selectOrgAll()", "˵����<br/> �����ؼ�����ʾ��֯�������ݣ���ѡ��������֯ȫ·���� "],
 	["ҵ����", "ѡ���ɫ", "fcUserFunc.selectProfile()", "˵����<br/> ��radiolist�ؼ���ѡ���ɫ����ѡ�� "],
 	["ҵ����", "��ѡ��ɫ", "fcUserFunc.selectProfiles()", "˵����<br/> ��checkboxlist�ؼ���ѡ���ɫ����ѡ�� "],
 	["ҵ����", "ѡ���û�", "fcUserFunc.selectUser()", "˵����<br/> ��radiolist�ؼ���ѡ���û�����ѡ�� "],
 	["ҵ����", "��ѡ�û�", "fcUserFunc.selectUsers()", "˵����<br/> ��checkboxlist�ؼ���ѡ���û�����ѡ��"],
 	["ҵ����", "ѡ���ܵ�", "fcUserFunc.selectUnit()", "˵����<br/> ��grid�ؼ���ѡ���ܵ㣬��ģ�����ҡ�"]
];
