	
	var btnListAdd={	//要注册的按钮的列表
		mytest1: ["这是我新加的工具栏上的按钮", "../images/ef_design_test.gif", false, "mytest1_onclick()"]
	}
	
	//fcpubdata.toolbar = "newnull,opendj,mytest1,|,opendjfile,billtype,djpreview,save,saveas,copy,paste,undo,redo,align,focus,front,behind,form,userfunction,userfunction1,addhtml,execute,showlist,eformhelp,designmenu,cbozoom,br,button,label,image,fcdiv,shape,pagecontrol,treeview,dblike,numedit,divcheckbox,divradio,dataset,webgrid,htmltable,formattab,dbedit,dbcheckbox,dbradiogroup,dblistbox,fccode,dbcombobox,dbmemo,dbimage,dbchart,file,excel,imgsetposition",

function mytest1_onclick() {
	alert("这是我新加的工具栏上的按钮!");
}

//将用户的业务函数注册到函数的选择窗口中.下面是两个简单的示例.用户可以根据需要增加

var arrRegFuncList=[
// 	["校验函数","用户名","getuser11()","输出参数：<br/> 当前用户名. "],
 	["业务函数", "选择组织机构", "fcUserFunc.selectOrg()", "说明：<br/> 以树控件来显示组织机构数据，单选。 "],
 	["业务函数", "选择不要用户节点的组织机构", "fcUserFunc.selectOrgUp()", "说明：<br/> 以树控件来显示不要用户节点的组织机构数据，单选。 "],
 	["业务函数", "通过组织机构来多选用户", "fcUserFunc.selectOrgUsers()", "说明：<br/> 以树形组织机构数据来选择用户，多选。 "],
 	["业务函数", "通过组织机构来单选用户", "fcUserFunc.selectOrgUserEb()", "说明：<br/> 以树形组织机构数据来选择用户，单选。在E表中用，即不能绑定到数据集来传值。 "],
 	["业务函数", "选择组织全路径", "fcUserFunc.selectOrgAll()", "说明：<br/> 以树控件来显示组织机构数据，单选，返回组织全路径。 "],
 	["业务函数", "选择角色", "fcUserFunc.selectProfile()", "说明：<br/> 以radiolist控件来选择角色，单选。 "],
 	["业务函数", "多选角色", "fcUserFunc.selectProfiles()", "说明：<br/> 以checkboxlist控件来选择角色，多选。 "],
 	["业务函数", "选择用户", "fcUserFunc.selectUser()", "说明：<br/> 以radiolist控件来选择用户，单选。 "],
 	["业务函数", "多选用户", "fcUserFunc.selectUsers()", "说明：<br/> 以checkboxlist控件来选择用户，多选。"],
 	["业务函数", "选择功能点", "fcUserFunc.selectUnit()", "说明：<br/> 以grid控件来选择功能点，可模糊查找。"]
];
