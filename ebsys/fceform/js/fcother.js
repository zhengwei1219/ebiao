///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />



//�����ݿ�ı���Ϣ������ѡ����ʱ,���Թ�ѡ������ݵ��б�����������.
//var arrUserFuncList = [
// 	["ѡ����", "selectDept", "���������<br/> ��ǰ����. "],
// 	["�����ݿ�ı���Ϣ������ѡ����ʾ��", "getdate()", "���������<br/> ��ǰ����. "]
//];

var fcUserFunc = {

    selectDept: function(id) {//�ڴ򿪴��ڵ�radiolist�ؼ���ѡ������
        ///idΪdropdownlist�ؼ���ID
        //alert($obj($id(id).getAttribute("dataset")).Field("sdeptid").Value);
        CommonSelect({
            istree: 1,
            ismultisel: 1,
            //islist: 1, //��ѡʱΪcheckboxlist,������radiolist
            cols: 3, //����
            obj: $obj(id), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            selectedvalue: $obj($id(id).getAttribute("dataset")).Field("sdeptid").Value,
            idfieldname: "sdeptid",
            textfieldname: "sdeptname", //��ѡ��, ǰһ���ڵ�text�ֶ���,���ڰ��ֶ�ͬ����������.ֻ��isgrid!=1ʱ����Ч
            //hidefields:"sdeptid",
            sql: "select sdeptcode,sdeptname,sdeptid from FCS_DEPT where sdeptname !='' order by sdeptcode " //��ѡ��, �������ڵ���ʾ�����õ�SQL���.

        })
    },
    //    selectRole: function(controlId, fieldId, fieldName) {
    //        if (IsSpace(fieldId)) fieldId = "roleId";
    //        if (IsSpace(fieldName)) fieldName = "roleName";
    //        CommonSelect({
    //            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
    //            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
    //            idfieldname: fieldId,
    //            width: "350",
    //            height: "600",
    //            textfieldname: fieldName,
    //            istreenewsql: 1,
    //            title: "ѡ���ɫ",
    //            sql: "select roleid,parentid,rolename,roleid from FCQ_ROLE where deleteMark <> 1 order by sortNo  " //��ѡ��, �������ڵ���ʾ�����õ�SQL���.
    //        })
    //    },

    selectOrg: function(controlId, fieldId, fieldName) {
        //ѡ����֯����
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "ѡ����֯����",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectOrgUp: function(controlId, fieldId, fieldName) {
        //ѡ��Ҫ�û��ڵ����֯������
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "ѡ����֯����",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' and sOrgKindID <> 'usr' order by sortNo  "
        })
    },
    selectOrgUsers: function(controlId, fieldId, fieldName) {
        //ͨ����֯��������ѡ�û���
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            ismultisel: 1,
            selectedvalue: $id(controlId).value,
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            treeNodeType: "ef_tree_psm", //ָ��ֻ�����û���
            title: "ѡ���û�",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectOrgUserEb: function(controlId, callback) {
        //ͨ����֯��ѡ�񵥸��û�����E�����ã������ܰ󶨵����ݼ�����ֵ
        //if (IsSpace(fieldId)) fieldId = "sID";
        //if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            callback: callback,
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            //ismultisel: 1,
            //selectedvalue: $id(controlId).value,
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            //idfieldname: fieldId,
            width: "350",
            height: "600",
            //textfieldname: fieldName,
            istreenewsql: 1,
            treeNodeType: "ef_tree_usr", //ָ��ֻ�����û���
            title: "ѡ���û�",
            sql: "select  sID,sParent,sName,sPersonId,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },

    selectOrgAll: function(controlId, fieldId, fieldName) {
        //ѡ����֯ȫ·��
        if (IsSpace(fieldId)) fieldId = "sFID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //��ѡ��, �����������Ƿ���tree�ؼ�,��ֵ=0��1.���ؼ����Ե�����,���Ǻ�grid,radiolist,checkboxlist�����,�����ʱ�����������ؼ��Ŀ��
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "ѡ����֯����",
            sql: "select  sID,sParent,sName,sFID,sOrgKindID from fcq_org  where deleteMark <> 1  and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectProfile: function(controlId, fieldId, fieldName) {
        //ѡ���ɫ
        if (IsSpace(fieldId)) fieldId = "profileId";
        if (IsSpace(fieldName)) fieldName = "profileName";
        CommonSelect({
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "ѡ���ɫ",
            sql: "select profileId,profilename from fcq_profile where deleteMark <> 1 and profileId <> 'systemadmin' order by sortNo "
        })
    },
    selectProfiles: function(controlId, fieldId, fieldName) {
        //��ѡ��ɫ
        if (IsSpace(fieldId)) fieldId = "profileId";
        if (IsSpace(fieldName)) fieldName = "profileName";
        var ret = CommonSelect({
            obj: controlId, //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            textfieldname: fieldName,
            isgrid: 1, //1�Ǵ򿪴�������grid�ؼ�����ʾ����,0����,
            ismultisel: 1,
            gridcoltitle: ["��ɫ����"],
            hidefields: fieldId,
            title: "ѡ���ɫ",
            sql: "select profileId as " + fieldId + ",profilename from fcq_profile where deleteMark <> 1 and profileId <> 'systemadmin' order by sortNo "
        })
        return ret;
    },
    selectUser: function(controlId, fieldId, fieldName) {
        //ѡ���û�
        if (IsSpace(fieldId)) fieldId = "userId";
        if (IsSpace(fieldName)) fieldName = "userName";
        CommonSelect({
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "ѡ���û�",
            sql: "select userId,username from fcq_user where deleteMark <> 1 order by sortNo"
        })
    },
    selectUsers: function(controlId, fieldId, fieldName) {
        //��ѡ�û�
        if (IsSpace(fieldId)) fieldId = "userId";
        if (IsSpace(fieldName)) fieldName = "userName";
        var ret = CommonSelect({
            obj: controlId, //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            isgrid: 1,
            textfieldname: fieldName,
            ismultisel: 1,
            hidefields: fieldId,
            gridcolwidth: [250],
            gridcoltitle: ["�û�����"],
            title: "ѡ���û�",
            sql: "select userId as " + fieldId + ",username from fcq_user where deleteMark <> 1 order by sortNo"
        })
        return ret;
    },
    selectEmployee: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "employeeid";
        if (IsSpace(fieldName)) fieldName = "employeename";
        CommonSelect({
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "ѡ��ְԱ",
            sql: "select employeeid,employeename from FCQ_EMPLOYEE where deleteMark <> 1 and typeName='����' order by sortNo"
        })
    },
    //    selectManageType: function(controlId, fieldId, fieldName) {
    //        if (IsSpace(fieldId)) fieldId = "id";
    //        if (IsSpace(fieldName)) fieldName = "manageType";
    //        CommonSelect({
    //            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
    //            idfieldname: fieldId,
    //            width: "600",
    //            height: "600",
    //            textfieldname: fieldName,
    //            cols: 3,
    //            islist: 1,
    //            title: "ѡ��ҵ���������",
    //            sql: "select id,manageType from FCQ_manageType where deleteMark <> 1  "
    //        })
    //    },
    selectUnit: function(controlId, fieldId, fieldName) {
        //ѡ���ܵ�
        if (IsSpace(fieldId)) fieldId = "id";
        if (IsSpace(fieldName)) fieldName = "name";
        var ret = CommonSelect({
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            idfieldname: fieldId,
            isgrid: 1,
            isfind: 1, //1��ģ������,0��û��ģ������
            findvalue: unit.value, //ģ������ֵ
            textfieldname: fieldName,
            hidefields: fieldId,
            gridcolwidth: [230, 300, 130, 100, 80, 120, 70],
            gridcoltitle: ["���ܵ�����", "url", "����", "����", "����", "����ʱ��", "�豸����"],
            title: "ѡ���ܵ�",
            width: "1050",
            height: "600",
            sql: "select fcq_unit.id,fcq_unit.name,url,fromName,fc_datadict.name as fromType,paramUrl,genTime,envType from fcq_unit inner join fc_datadict on fcq_unit.fromType=fc_datadict.code where fcq_unit.deleteMark <> 1 and fc_datadict.typeName='���ܵ�����' and fcq_unit.name like ':v_get%' order by fcq_unit.sortNo"
        })
        return ret;
    },
    selectNation: function(controlId, field) {
        if (IsSpace(field)) field = "nation";
        CommonSelect({
            obj: $id(controlId), //��ѡ��, �����޸ĵ�ǰһ���ڿؼ�����,������grid����.
            //idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: field,
            cols: 2,
            islist: 1,
            title: "ѡ������",
            sql: "select name as " + field + " from fc_datadict where deleteMark <> 1 and fcSysMark=0 and typename='����' order by sortNo"
        })
    }


}
