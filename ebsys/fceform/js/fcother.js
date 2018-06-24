///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />



//在数据库的表信息界面上选择函数时,可以供选择的内容的列表在下面配制.
//var arrUserFuncList = [
// 	["选择部门", "selectDept", "输出参数：<br/> 当前日期. "],
// 	["在数据库的表信息界面上选择函数示例", "getdate()", "输出参数：<br/> 当前日期. "]
//];

var fcUserFunc = {

    selectDept: function(id) {//在打开窗口的radiolist控件中选择数据
        ///id为dropdownlist控件的ID
        //alert($obj($id(id).getAttribute("dataset")).Field("sdeptid").Value);
        CommonSelect({
            istree: 1,
            ismultisel: 1,
            //islist: 1, //多选时为checkboxlist,否则是radiolist
            cols: 3, //列数
            obj: $obj(id), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            selectedvalue: $obj($id(id).getAttribute("dataset")).Field("sdeptid").Value,
            idfieldname: "sdeptid",
            textfieldname: "sdeptname", //可选项, 前一窗口的text字段名,用于按字段同名传递数据.只在isgrid!=1时才有效
            //hidefields:"sdeptid",
            sql: "select sdeptcode,sdeptname,sdeptid from FCS_DEPT where sdeptname !='' order by sdeptcode " //必选项, 弹出窗口的显示数据用的SQL语句.

        })
    },
    //    selectRole: function(controlId, fieldId, fieldName) {
    //        if (IsSpace(fieldId)) fieldId = "roleId";
    //        if (IsSpace(fieldName)) fieldName = "roleName";
    //        CommonSelect({
    //            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
    //            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
    //            idfieldname: fieldId,
    //            width: "350",
    //            height: "600",
    //            textfieldname: fieldName,
    //            istreenewsql: 1,
    //            title: "选择角色",
    //            sql: "select roleid,parentid,rolename,roleid from FCQ_ROLE where deleteMark <> 1 order by sortNo  " //必选项, 弹出窗口的显示数据用的SQL语句.
    //        })
    //    },

    selectOrg: function(controlId, fieldId, fieldName) {
        //选择组织机构
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "选择组织机构",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectOrgUp: function(controlId, fieldId, fieldName) {
        //选择不要用户节点的组织机构。
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "选择组织机构",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' and sOrgKindID <> 'usr' order by sortNo  "
        })
    },
    selectOrgUsers: function(controlId, fieldId, fieldName) {
        //通过组织机构来多选用户。
        if (IsSpace(fieldId)) fieldId = "sID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            ismultisel: 1,
            selectedvalue: $id(controlId).value,
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            treeNodeType: "ef_tree_psm", //指定只返回用户。
            title: "选择用户",
            sql: "select  sID,sParent,sName,sID,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectOrgUserEb: function(controlId, callback) {
        //通过组织来选择单个用户。在E表中用，即不能绑定到数据集来传值
        //if (IsSpace(fieldId)) fieldId = "sID";
        //if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            callback: callback,
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            //ismultisel: 1,
            //selectedvalue: $id(controlId).value,
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            //idfieldname: fieldId,
            width: "350",
            height: "600",
            //textfieldname: fieldName,
            istreenewsql: 1,
            treeNodeType: "ef_tree_usr", //指定只返回用户。
            title: "选择用户",
            sql: "select  sID,sParent,sName,sPersonId,sOrgKindID from fcq_org  where deleteMark <> 1 and sOrgKindID <> 'psm' order by sortNo  "
        })
    },

    selectOrgAll: function(controlId, fieldId, fieldName) {
        //选择组织全路径
        if (IsSpace(fieldId)) fieldId = "sFID";
        if (IsSpace(fieldName)) fieldName = "sName";
        CommonSelect({
            istree: 1, //可选项, 弹出窗口中是否有tree控件,其值=0或1.树控件可以单独用,或是和grid,radiolist,checkboxlist组合用,组合用时可以设置树控件的宽度
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "350",
            height: "600",
            textfieldname: fieldName,
            istreenewsql: 1,
            title: "选择组织机构",
            sql: "select  sID,sParent,sName,sFID,sOrgKindID from fcq_org  where deleteMark <> 1  and sOrgKindID <> 'psm' order by sortNo  "
        })
    },
    selectProfile: function(controlId, fieldId, fieldName) {
        //选择角色
        if (IsSpace(fieldId)) fieldId = "profileId";
        if (IsSpace(fieldName)) fieldName = "profileName";
        CommonSelect({
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "选择角色",
            sql: "select profileId,profilename from fcq_profile where deleteMark <> 1 and profileId <> 'systemadmin' order by sortNo "
        })
    },
    selectProfiles: function(controlId, fieldId, fieldName) {
        //多选角色
        if (IsSpace(fieldId)) fieldId = "profileId";
        if (IsSpace(fieldName)) fieldName = "profileName";
        var ret = CommonSelect({
            obj: controlId, //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            textfieldname: fieldName,
            isgrid: 1, //1是打开窗口中在grid控件中显示数据,0是无,
            ismultisel: 1,
            gridcoltitle: ["角色名称"],
            hidefields: fieldId,
            title: "选择角色",
            sql: "select profileId as " + fieldId + ",profilename from fcq_profile where deleteMark <> 1 and profileId <> 'systemadmin' order by sortNo "
        })
        return ret;
    },
    selectUser: function(controlId, fieldId, fieldName) {
        //选择用户
        if (IsSpace(fieldId)) fieldId = "userId";
        if (IsSpace(fieldName)) fieldName = "userName";
        CommonSelect({
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "选择用户",
            sql: "select userId,username from fcq_user where deleteMark <> 1 order by sortNo"
        })
    },
    selectUsers: function(controlId, fieldId, fieldName) {
        //多选用户
        if (IsSpace(fieldId)) fieldId = "userId";
        if (IsSpace(fieldName)) fieldName = "userName";
        var ret = CommonSelect({
            obj: controlId, //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            isgrid: 1,
            textfieldname: fieldName,
            ismultisel: 1,
            hidefields: fieldId,
            gridcolwidth: [250],
            gridcoltitle: ["用户名称"],
            title: "选择用户",
            sql: "select userId as " + fieldId + ",username from fcq_user where deleteMark <> 1 order by sortNo"
        })
        return ret;
    },
    selectEmployee: function(controlId, fieldId, fieldName) {
        if (IsSpace(fieldId)) fieldId = "employeeid";
        if (IsSpace(fieldName)) fieldName = "employeename";
        CommonSelect({
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: fieldName,
            cols: 3,
            islist: 1,
            title: "选择职员",
            sql: "select employeeid,employeename from FCQ_EMPLOYEE where deleteMark <> 1 and typeName='民族' order by sortNo"
        })
    },
    //    selectManageType: function(controlId, fieldId, fieldName) {
    //        if (IsSpace(fieldId)) fieldId = "id";
    //        if (IsSpace(fieldName)) fieldName = "manageType";
    //        CommonSelect({
    //            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
    //            idfieldname: fieldId,
    //            width: "600",
    //            height: "600",
    //            textfieldname: fieldName,
    //            cols: 3,
    //            islist: 1,
    //            title: "选择业务管理类型",
    //            sql: "select id,manageType from FCQ_manageType where deleteMark <> 1  "
    //        })
    //    },
    selectUnit: function(controlId, fieldId, fieldName) {
        //选择功能点
        if (IsSpace(fieldId)) fieldId = "id";
        if (IsSpace(fieldName)) fieldName = "name";
        var ret = CommonSelect({
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            idfieldname: fieldId,
            isgrid: 1,
            isfind: 1, //1是模糊查找,0是没有模糊查找
            findvalue: unit.value, //模糊查找值
            textfieldname: fieldName,
            hidefields: fieldId,
            gridcolwidth: [230, 300, 130, 100, 80, 120, 70],
            gridcoltitle: ["功能点名称", "url", "名称", "类型", "参数", "生成时间", "设备类型"],
            title: "选择功能点",
            width: "1050",
            height: "600",
            sql: "select fcq_unit.id,fcq_unit.name,url,fromName,fc_datadict.name as fromType,paramUrl,genTime,envType from fcq_unit inner join fc_datadict on fcq_unit.fromType=fc_datadict.code where fcq_unit.deleteMark <> 1 and fc_datadict.typeName='功能点类型' and fcq_unit.name like ':v_get%' order by fcq_unit.sortNo"
        })
        return ret;
    },
    selectNation: function(controlId, field) {
        if (IsSpace(field)) field = "nation";
        CommonSelect({
            obj: $id(controlId), //必选项, 用于修改的前一窗口控件对象,包含是grid对象.
            //idfieldname: fieldId,
            width: "600",
            height: "600",
            textfieldname: field,
            cols: 2,
            islist: 1,
            title: "选择民族",
            sql: "select name as " + field + " from fc_datadict where deleteMark <> 1 and fcSysMark=0 and typename='民族' order by sortNo"
        })
    }


}
