///<reference name="MicrosoftAjax.js" />
///<reference path="/ebsys/fceform/js/fcpub.js" />

Eapi.DataSet = function(){}
Eapi.DataSet.prototype =
{
	getEditedData : function(oDs){
		var oList = oDs.oDom.documentElement.selectNodes("//tr[@rowstate='edit' ]")	; // or @rowstate='add'
		if(oList == null) return;
		var s =new Sys.StringBuilder() ;
		for(var i=0;i<oList.length;i++){
			s.append(NavJs.xml(oList[i]));
		}
		//����ɾ��������
		//s.append(dataset1.DeletedData);
		return s.toString();
	
	},
	actionEditedData : function(oDs,callback){
		var oList = oDs.oDom.documentElement.selectNodes("//tr[@rowstate='edit' ]")	; // or @rowstate='add'
		if(oList == null) return;
		for(var i=0;i<oList.length;i++){
			callback(oList[i]);
		}
	
	},
	getChangeData : function (dataset1){
        ///ȡ���ݼ��б䶯�˵�����
	    var oList = dataset1.oDom.documentElement.selectNodes("//tr[@rowstate='edit' or @rowstate='add']")	;
	    if(oList == null) return;
	    var s =new Sys.StringBuilder() ;
	    for(var i=0;i<oList.length;i++){
		    s.append(NavJs.xml(oList[i]));
	    }
	    return s.toString();
    },
	actionChangeData : function(oDs,callback){
		var oList = oDs.oDom.documentElement.selectNodes("//tr[@rowstate='edit' or @rowstate='add' ]")	; // or @rowstate='add'
		if(oList == null) return;
		for(var i=0;i<oList.length;i++){
			callback(oList[i]);
		}
	
	},
    copyDataset : copydataset ,
    copyDatasetSel : copydatasetsel ,
    dsBeforeSave : DsBeforeSave 


}
Eapi.DataSet.registerClass("Eapi.DataSet");


/**
*ִ�в�ѯ,ֱ����һ��SQL������õ���ѯ������ֶ���Ϣ
*@param sSql sql���
*@param PageNo ҳ��
*@param PageSize ҳ�ߴ�,��һҳ��������
*@param sfieldset ��,�ָ����ֶμ�
*@return ��ѯ���
**/
function dataset_select(oSql, PageNo, PageSize, sfieldset, callback, context) {
    
    var oDsn = new Eapi.Str().getDsnSql(oSql);
    
    var fsql="";
    if(fcpubdata.dbStruDict == "FC_FLDLIST" ){
	  	  var  tmpsql1 = "select chnname,fdsize,fddec from FC_FLDLIST where ";
	  	  if(fcpubdata.databaseTypeName == "oracle"){
	  	  	tmpsql1 += "UPPER(fdname)='GET_FIELD_NAME_FLAG' " ;
	  	  }else{
	  	  	tmpsql1 += "fdname='GET_FIELD_NAME_FLAG' " ;  //GET_FIELD_NAME_FLAG Ϊ��̨������滻��־,
	  	  }        
        fsql = tmpsql1 ;
    }else if(fcpubdata.dbStruDict == "FC_DBSTRU"){
        fsql = "select chnname,fdsize,fddec from FC_DBSTRU where fdname='GET_FIELD_NAME_FLAG'";
    }else if(fcpubdata.dbStruDict == "FC_ENTITY"){
        fsql = "select chnname,fdsize,fddec from FC_ENTITYSUB where fdname='GET_FIELD_NAME_FLAG'";
    }
    
	//����Ƿ�XML�ַ�
	var sXml="<sql>"+RepXml(oDsn.sql)+"</sql>"+"<pageno>"+PageNo+"</pageno>"+"<pagesize>"+PageSize+"</pagesize>"+"<fset>"+sfieldset+"</fset>"+"<fieldsql>"+fsql+"</fieldsql>";
	
	var retX=new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=dataset_select"+oDsn.dsn,sXml,callback,context);
	return retX;
}
/**
*�������ݼ�,��Դ���ݼ��ĵ�ǰ��¼ֵ��ͬ���ֶθ��Ƶķ�ʽ��Ŀ�����ݼ�
*@param dsSour Դ���ݼ�
*@param dsDest Ŀ�����ݼ�
*@param notCopyFieldName ����Ҫcopy���ֶ���,һ��ΪID�ֶ�
*@date 2003-08-05
**/
function copydataset(dsSour, dsDest, notCopyFieldName) {
    //dsSour = eval(dsSour.id);
    //dsDest = eval(dsDest.id);
	var fName ;
	if(typeof(notCopyFieldName) == "undefined") 
	    fName="";
	else
	    fName = notCopyFieldName.toUpperCase();
	    
	for(var i=0;i<dsSour.FieldCount;i++){
		var s1=dsSour.Field(i).FieldName ;
		if(s1.toUpperCase() != fName ){
			//try{
			if(dsDest.isFieldName(s1))
				dsDest.Field(s1).Value=dsSour.Field(i).Value;
			//}catch(e){}
		}
	}
}
/**
*�������ݼ�,��Դ���ݼ�������ѡ���˵ļ�¼ֵ��ͬ���ֶθ��Ƶķ�ʽ��Ŀ�����ݼ�
*@param dsSour Դ���ݼ�
*@param dsDest Ŀ�����ݼ�
*@param isNewSel �¾����ֱ���е�ѡ�з�ʽ
*@param sNoRepeat = "���ظ�" ��ʾ���ز�Ҫ�ظ����С�
*@date 2003-12-12
**/
function copydatasetsel(dsSour,dsDest,isNewSel,sNoRepeat){
    var arrSour = new Array();
	var arrDest=new Array();
	var k = 0, i, j;
	if (sNoRepeat == "���ظ�") {
	    var sourkeyfieldNo = -1; //Դ���ݼ������ֶ�����˳��ţ�
	    var keyfieldNo = dsDest.FieldNameToNo(dsDest.firstKeyFieldName); //�����ֶ�����˳��ţ�
	    var sb = new Sys.StringBuilder();
	    for (var i = 0; i < dsDest.RecordCount; i++) {
	        sb.append(NavJs.getNodeValue11(dsDest.oDom, i, keyfieldNo));
	        sb.append(",");
	    }
	    var sKeyFieldValue = sb.toString();
	    
	}

	for (i = 0; i < dsSour.FieldCount; i++) {
	    if (!IsSpace(dsDest.firstKeyFieldName) && dsSour.Field(i).FieldName.toUpperCase() == dsDest.firstKeyFieldName.toUpperCase()) sourkeyfieldNo = i;
		for( j=0;j<dsDest.FieldCount;j++){
			if(dsDest.Field(j).FieldName.toUpperCase()==dsSour.Field(i).FieldName.toUpperCase()){
				arrSour[k]=i;
				arrDest[k]=j;
				k++;
				break;	
			}
		}
	}
	var tmpB=false;
	if(k>0){
	    for (i = 0; i < dsSour.RecordCount; i++) {
	        if (sNoRepeat == "���ظ�" && sourkeyfieldNo != -1 && sKeyFieldValue.indexOf(dsSour.oDom.documentElement.childNodes[i].childNodes[sourkeyfieldNo].text) >= 0) continue; 
	        
			if((isNewSel && NavJs.getNodeValue11(dsSour.oDom,i,0) == "��") || ( IsSpace(isNewSel) && dsSour.oDom.documentElement.childNodes[i].getAttribute("multisel")=="��")){
				//���Ƶ�һ�β�����.
				//alert("recno:"+dsDest.RecNo)
				var iTmp=dsDest.RecNo;
				if(tmpB){
					dsDest.Append("ǿ�м�һ��");
					iTmp=dsDest.oDom.documentElement.childNodes.length-2;
				}
				for (j = 0; j < k; j++) {
					NavJs.textContent(dsDest.oDom.documentElement.childNodes[iTmp].childNodes[arrDest[j]],NavJs.textContent(dsSour.oDom.documentElement.childNodes[i].childNodes[arrSour[j]]));
				}
				tmpB=true;
				//���� ʵ�ʼ�����Ĺ�ʽ
				dsDest.LineSum(null,iTmp);
			}
		}
		//CopyToPub(dsDest.xml)
		return tmpB;	
	}else {return false;}
}
/**
* ȡ���ݼ�ѡ���е�ĳ�е�ֵ,�ö��ŷָ�.2011-06-13
**/
function getDsMultiSelValue(dsSour, colNo, isNewSel) {
    var sb = new Sys.StringBuilder();
    for (var i = 0; i < dsSour.RecordCount; i++) {
        if ((isNewSel && NavJs.getNodeValue11(dsSour.oDom, i, 0) == "��") || (IsSpace(isNewSel) && dsSour.oDom.documentElement.childNodes[i].getAttribute("multisel") == "��")) {
            sb.append(NavJs.getNodeValue11(dsSour.oDom,i,colNo));
            sb.append(",");
            
        }
    }
    var sRet = sb.toString();
    if (IsSpace(sRet) == false) sRet = sRet.substring(0, sRet.length - 1);
    return sRet;
}
/**
* ���ö�ѡʱ,����ѡ��״̬ 2011-06-14
**/
function setDsMultiSelValue(dsSour, colNo, sValue) {
    
    if(IsSpace(sValue)) return;
    var arr = sValue.split(",");
    for (var i = 0; i < dsSour.RecordCount; i++) {
        for (var j = 0; j < arr.length; j++) {
            if(NavJs.getNodeValue11(dsSour.oDom,i,colNo) == arr[j]) NavJs.textContent(dsSour.oDom.documentElement.childNodes[i].childNodes[0], "��");
            
        }
    }
}

/**
*���ݼ��ϵĸ����¼��Ĵ�����
*@param eventname Ϊ���ݼ����¼�����,����AfterOpen,�ַ���
*@param eventfunction Ϊ���¼�����Ӧ�Ĵ�������־,�ַ���
*@return �� 
**/
function bill_dsevent(eventname,eventfunction){
    LoadMod(eventfunction,"clickmenu");
}
//���ݼ���Valid�¼�
function bill_ondatasetvalid(event, sXml) {
//ogridΪ������
/*  sXml��ʽ:
  <dsid>
    <col>zl_select_100</col>
    <col></col>
  </dsid>
*/
    //sXml="<DsMain><shl>alert('shlvalid')</shl><col></col></DsMain>"
    if (arguments.length == 1) { //���ݾɵı�����htc�ļ�����
        sXml = event;
        event = window.event;
    }
   var oXml=SetDom(sXml);
   var iLen=oXml.documentElement.childNodes.length;
   if(iLen>0){ 
			//�����кŵõ���ͬ������      
			   //var oDs=eval(oXml.documentElement.tagName)
			   //��ǰ�ֶ���

               if (event == null) var curFieldName = "null";
               else
                   var curFieldName = event.FieldName;
               if (curFieldName == null || typeof curFieldName == "undefined") curFieldName = "null";
			   var oNode = oXml.documentElement.selectSingleNode(curFieldName) ;
			   if(IsSpace(oNode) == false){
			       var sKey = NavJs.textContent(oNode);
			       //�˴�Ӧͳһ������Ч�Լ��֮��Ĵ���,
			       
					sKey = "try {"+sKey+"}catch (e) {event.returnValue=e.description;}";
					eval(sKey);
					//NavJs.insertEventParam(sKey);
			   }
	}
   
}
/**
*���ݼ��Ļ�д�����¼�
*@date 2003-11-25
**/
function bill_ondatasetsettext(event, sXml) {
//ogridΪ������
/*  sXml��ʽ:
  <dsid>
    <col>zl_select_100</col>
    <col></col>
  </dsid>
*/
   //sXml="<DsMain><shl>alert('shlvalid')</shl><col></col></DsMain>"
    if (arguments.length == 1) { //���ݾɵı�����htc�ļ�����
        sXml = event;
        event = window.event;
    }

   var oXml=SetDom(sXml);
   var iLen=oXml.documentElement.childNodes.length;
   if(iLen>0){ 
		if(event.FieldName==""){ //���������ֶ�
			for(var i=0;i<iLen;i++){
			    eval(NavJs.getNodeValue1(oXml, i));
			    
				
			}
		
		}else{
   	
			//�����кŵõ���ͬ������      
			   //��ǰ�ֶ��� 
			   
			   var curFieldName=event.FieldName;
			   var oo = oXml.documentElement.selectSingleNode(curFieldName);
			   if(oo != null){
					var sCommand=oo.text;
					//�˴�Ӧͳһ������Ч�Լ��֮��Ĵ���,
					eval(sCommand);
					
			   }
		}
	}
   
}
/**
ֱ���޸����ݼ��е�����
@date 2004-06-17
**/
function EditDs(dssub1, fieldname, fieldvalue) {
    
	var colno=dssub1.FieldNameToNo(fieldname);
	var ii = dssub1.RecNo;
	NavJs.textContent(dssub1.oDom.documentElement.childNodes[ii].childNodes[colno],fieldvalue) ;
	dssub1.oDom.documentElement.childNodes[ii].setAttribute("rowstate","edit") ;
}	
/**
*����fset�е��ֶ�ֵ��������
*@para oDs ���ݼ�����
*@return ����һ������
*@date 2006-03-11
**/
function CopyFieldsToArr(oDs) {
    
	var arr = new Array() ;
	var ll = oDs.FieldCount;
	for(var i=0;i<ll;i++){
		arr[i]=oDs.Field(i).Value ;
	}
	return arr ;
}
/**
*�������鵽fset�е��ֶ�ֵ��
*@para oDs ���ݼ�����
*@para arr ����
*@date 2006-03-11
**/
function CopyArrToFields(oDs, arr) {

    var ll = oDs.FieldCount;
	for(var i=0;i<ll;i++){
		oDs.Field(i).Value = arr[i] ;
	}
	
}
/**
* ���ؼ�����ǰ�Ĵ���
*@param oDs ���ݼ�����
*@param oGrid1 ��Ӧ�ı�����
*@return true ��ʾ���ûͨ��,Ӧ�˳�����
*@date 2006-12-08
**/
function DsBeforeSave(oDs,oGrid1,isNotAlert) {
	var oGrid = oGrid1;
	if(typeof oGrid1 == "undefined"){
		oGrid = GetDsGrid(oDs);
    }
    
	if (oGrid.txt.style.display != "none") {
		oDs.cont_onDataChange();
	}
	if(oDs.Update("��ʾ������Ϣ")!="") 
	    return true;
	else
        return false;
}

/**
* 2009-11-11ȡ���ݼ���sql��where����idֵ
*@param oDs ���ݼ�����
*idField id�ֶ�
**/
function getListFormIdValue(oDs, idField) {
    var oXml = SetDom(oDs.format);
    if (oXml.documentElement == null) return "";
    var oNode = oXml.documentElement.selectSingleNode("//field[fieldname='" + idField + "']");
    if (oNode == null) return "";

    var fieldType = NavJs.textContent(oNode.childNodes[1]);


    var sRet = "";
    if (IsSpace(fcpubdata.obj)) {
        if (fieldType == "����" || fieldType == "ʵ��") sRet = "0";
    } else {
        sRet =fcpubdata.obj.Field(idField).Value;
        if ((fieldType == "����" || fieldType == "ʵ��") && sRet == "") sRet = "0";
    }
    return sRet;
}
/**
* ��URL��ȡ��ID�ֶ�(������ʱ)��ֵ,�����ݼ���SQL�������
**/
function getUrlIdValue(idFieldName) {
    var svalue = $urlParam(idFieldName);
    if (IsSpace(svalue)) svalue = "0";
    return svalue;
}
/**
 * ǰ̨��Ҫ��һ������XML�������ݼ��ļ�¼ƴ��һ���ĺ���: OpenDsAddSql
 	* �������: oDs,���е�Xml��¼��,SQL���. Ҫ��SQL�������:v_get��ʶ,�����滻������.
 			oDs�еĵ�һ���ֶ�ӦΪID�ֶ�,SQL����е�һ��������ֶ�ӦΪ�Դ�Ϊ������ID�ֶ�.
 	* �������: ���ҵ�oDs��һ���ֶε��ֶ������ֶ�����,�����е�Xml��¼����ѭ���õ�SQL����е� in ()����,
 		    �����滻SQL���,Ȼ��SQL���ִ��SelectSql����,����һ��XML��.�����е�Xml��¼����ѭ��,
 		    ����XPATH���������ɵ�XML��,��������.Ȼ�����µĺϲ����XML�������´�oDs.	
* 2011-12-07 
**/
function OpenDsAddSql(oDs,sXml,sql) {
    var sType = oDs.Field(0).DataType;
    var sQuot = "'";
    if (sType == "����") sQuot = "";
    var oXml = SetDom("<root>" + sXml + "</root>");
    
    if (oXml.documentElement == null) {
        return;
    }
    var sb = new Sys.StringBuilder();
    var len = oXml.documentElement.childNodes.length;
    if (len == 0) return;
    
    for (var i = 0; i < len; i++) {
        sb.append(sQuot);
        sb.append(NavJs.getNodeValue11(oXml,i,0));
        sb.append(sQuot);
        if(i<len-1) sb.append(",")
    }
    var newsql = RepStr(sql, ":v_get", sb.toString());
    var sXmlAdd = SelectSql(newsql, 1, -1);
    var oXmlAdd = SetDom(sXmlAdd);
  
    if (oXmlAdd.documentElement == null) {
        alert(sXmlAdd);
        return;
    }
    
    var sbAll = new Sys.StringBuilder();
    for (var i = 0; i < len; i++) {
        _add_two_xml(sbAll,oXml,oXmlAdd,i);
    }
	var ss = oDs.xml;
	var pos = ss.indexOf("<set><pages>");
	if (pos>=0){
		ss = ss.substring(pos,ss.length);	
	}else{
		ss = ss.substring(6,ss.length); //ȥ��<root>
	}
	ss= "<root>"+sbAll.toString()+ss;

	oDs.OpenXmlData(ss);    
	
    
    function _add_two_xml(sbAll,oXml,oXmlAdd,i) 
    {
        var s1 = NavJs.xml(oXml.documentElement.childNodes[i]);
        s1 = s1.substring(0, s1.length - 5); //ȥ������� </tr>
        
        sbAll.append(s1);
        //var sName = oXmlAdd.documentElement.childNodes(0).childNodes(0).nodeName;

        //var oNode = oXmlAdd.documentElement.SelectSingleNode("//record[" + sName + "=" + oXml.documentElement.childNodes(i).childNodes(0).text+"]");
        var sId = NavJs.getNodeValue11(oXml,i,0);
        var k=0;
        for (k = 0; k < oXmlAdd.documentElement.childNodes.length - 1; k++) {
            if (NavJs.getNodeValue11(oXmlAdd,k,0) == sId) break;
        }
        
        if (oXmlAdd.documentElement.childNodes.length > 0) {
            var len1 = oXmlAdd.documentElement.childNodes[0].childNodes.length;
            for (var j = 1; j < len1; j++) {
                sbAll.append("<td>");
                if (k < oXmlAdd.documentElement.childNodes.length - 1) {
                    sbAll.append(NavJs.getNodeValue11(oXmlAdd, k, j));
                }
                sbAll.append("</td>");
            }
        }
        sbAll.append("</tr>");
    }
    
}