///<reference name="MicrosoftAjax.js" />
///<reference path="fcpub.js" />

Eapi.SaveForm = function(){}
Eapi.SaveForm.prototype =
{
    SaveBill : SaveBill ,
    DelBill : DelBill ,
    DelRow : DelRow ,
    DelGridRow : DelGridRow ,
    MultiDelGridRow : MultiDelGridRow ,
    DjSave : DjSave ,
    DjSaveShow : DjSaveShow ,
    GridSaveShow : GridSaveShow ,
    GridSave : GridSave ,
    SaveAfterRefreshGrid : SaveAfterRefreshGrid ,
    AddBill : AddBill 
}
Eapi.SaveForm.registerClass("Eapi.SaveForm");

/**
*���浱ǰ����	
*����: 1.�����ݼ��������еõ���ʱ����,
*      2.�����ݼ�����KEY�еõ�ID,��IDΪ�ձ�ʾ����״̬,����Ϊ�޸�״̬.
*      3.�������ɹ���ID�Ĵ洢����getmaxID���õ�����ID.
*      4.�������ݼ����ֶ��б����ƴ��INSERT ��UPDATE ���
*      5.ִ�������б���.
*      6.�籣��ɹ�,���ñ�����Ĵ洢����.
*      7.ɾ���˹���ID����ʱ���еļ�¼.
*      8.�������,���ݴ������״̬.
*@param iTag =1 ��ʾ�����̺�رմ��� =2 �����̺󲻹رմ��ڷ���
*@param strXmlSql ��ͬһ�����е�ǰ������sql���,��beforesql,aftersql���ڵ��� 
*@return ������Ϣ���
����ķ�ʽ:
 iTag=undefined : �����̺��һ��ʾ��������ѡ���ӡ/����
 iTag=1 : �����̺�ֱ�ӹرմ���
 iTag=2 : �����̺󲻹رմ��ڷ���
 iTag=3 : �����̺�ֱ�ӽ���������һ�ŵ��ݽ���
 iTag=4 : ֻ���浽��ʱ����,��ʱ����,��һ��������ʱ�������Ƶ������.
 			��saveasTableΪ��,��ִ�й���,���ɾ����ʱ���ֵ.
 iTag=5 : ֻ���浽�ݸ����,��һ������ݸ�����
 
 ע:�ݸ���е��ֶ�һ��Ҫ�������е��ֶ�һһ��Ӧ��,����ͱ�������ƴ�ֶ��б�
 
 
 
**/
function SaveBill(iTag,strXmlSql){
			var d=new Date();
			var t = d.getTime();      
	
	if(NotCanSave()) return "չ��״̬���ܱ���";
	//var owin=new Eapi.Str().showWait("���ڱ���......");
	
	var draftTable="draft";   //�ݸ�������
	var draftsubTable="draftsub";   //�ݸ��ӱ���
	//�ݸ�˵���ֶ���Ϊ draftdesc
	var draftdescValue="" ;	//����Ĳݸ�˵��ֵ
	if(iTag==5){
		draftdescValue=window.showModalDialog(fcpubdata.path+"/fceform/common/inputmsg.htm","������ݸ�˵��:","status:no;dialogHeight:105px;dialogWidth:470px;dialogTop:180;dialogLeft:250px"); 
	}
	
	var oDsMain = $id(fcpubdata.dsMain);
	if(oDsMain == null ) return "ֻ�б��Ϻ��������ݼ��ؼ�(����ָû�а󶨵��������ݼ��ؼ�)ʱ���ܱ���!";
	var arrImgValue="";  //װͼ���ֶ�ֵ
	var arrImgName="";	//װͼ���ֶε��ֶ���
	var arrImgChange=""; //װͼ���ֶεĸı��ʶ
	var sProcName=fcpubdata.area.runsave;  //���Ĵ������
	var billkeyfield = fcpubdata.area.keyfield ;
	var strRet="";
      var xmlSql=new Sys.StringBuilder() ; //��������Sql
      var sInsert="";
      var s1="";
      var gzid="";
      var tmpTable,saveasTable,xmlFields,oXmlField,arrField,kk,sF,tmp_sF,sV,arri,arrRet,sQuot ; 
      if((isSpace(sProcName) == false && fcpubdata.databaseTypeName != "mysql" ) || iTag == 4) {
			gzid = getgzid() ; //ȡ�ù���ID
			if(gzid==fcpubdata.sendHttpErrMsg) return fcpubdata.sendHttpErrMsg;
      }
  //��������--------------------------------------------------------------------
	if(oDsMain.Empty!="null"){
      //��ȥ������������checkbox radio����ȷ
      //oDsMain.cont1_fset();
      //oDsMain.bEdit=true;
      //---------------------------
      
      if(oDsMain.Update()==1) {
      	//new Eapi.Str().showWait("end");
      	return "�����ݼ�����ͨ������У��,����ʧ��!";  //�˴�������ʾһ�±���Ƿ�����,Ȼ������ʾ��.
      }
      var sTmpErrMsg = validAllForm();
      if(sTmpErrMsg != "") return sTmpErrMsg;

      tmpTable=oDsMain.temptable;
      saveasTable=oDsMain.saveastable;
	  if(iTag==4)saveasTable="";
      
		//�õ�Ҫ������ֶ�����
		xmlFields = oDsMain.format;
		oXmlField = SetDom(xmlFields)  ;  
		
		arrField = Save_GetFieldArr(oDsMain,oXmlField) ;
		if(arrField == null) {
			return fcpubdata.sendHttpErrMsg ;
		}
        kk = arrField.length ;
      //ƴ�ֶ��б�  
		sF = Save_GetsF(arrField,oXmlField,"��");      
      //ƴֵ�б�
      sV="";
      //ƴupdate���
      var sU="";
        //�����ݼ����ֶ��б�ѭ��������ͼ���ֶ�
        var ltmp = oDsMain.FieldCount ;
        for(var j=0;j<ltmp;j++){
			if(oDsMain.Field(j).DataType=="ͼ��"){
				arrImgValue=oDsMain.Field(j).Value ;   //�����û���ѡͼ���λ��
				arrImgName=oDsMain.Field(j).FieldName;
				arrImgChange=oDsMain.Field(j).valid ;  //����ֵΪ"��"ʱ��ʾ�������ϴ�
				break;
			}
		}
		 
	  //�������ֶ���ѭ��    
	  for(arri=0;arri<kk;arri++){
			i=arrField[arri];
		  
		  
			//oracle������ID
			if(fcpubdata.area.idtype == "3" && fcpubdata.keyValue=="" &&  oDsMain.Field(i).FieldName.toUpperCase() == fcpubdata.area.keyfield.toUpperCase()) {
				sV += fcpubdata.area.codeheader + ".nextval," ;
				continue;
			}
		  
			arrRet = Save_GetsVsU(oDsMain,0,i,billkeyfield,sV,sU,"��") ;
			sV = arrRet.sV;
			sU = arrRet.sU;
		  
		}		// end for

	  
      //sInsert="Insert "+tmpTable+" ("+sF+"GZID) Values ("+sV+"'"+gzid+"')"
      //���������ݼ�����ʱ����ֶδ���
      if((isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ) || iTag ==4){
	      //sInsert=TmpTableAddField(tmpTable,sF,sV,gzid);
	      tmp_sF=InsertTmpTableFields(oDsMain);
	      sInsert = "Insert into "+tmpTable+" ("+tmp_sF+"GZID) Values ("+InsertTmpTableSql(oDsMain,oDsMain.RecNo)+"'"+gzid+"')";
	      xmlSql.append("<no>"+repXml(sInsert)+"</no>");
	      
	      if(fcpubdata.area.idtype == "3" && fcpubdata.keyValue==""){ 
	      	
	      	//����oracle�����ֶ�ʱҪ���ڶ�����insert���Ĺؼ��ֶ�ֵ����:get_keyfield
	      	sV = RepStr(sV,fcpubdata.area.codeheader + ".nextval",":get_keyfield");
	      	
	      }
      }
      if(isSpace(saveasTable)==false){	
      	 if(sV.length>0) sV=sV.substring(0,sV.length-1);
      	 if(sU.length>0) sU=sU.substring(0,sU.length-1);
      	 
      	 
      	 if(fcpubdata.keyValue==""){
         	sInsert="Insert into "+saveasTable+" ("+sF+") Values ("+sV+")";
         }else{
			//my add ������ֶ�������ʱ�ı༭����
			var sWhere1 = "";
			if (fcpubdata.area.idtype == "5"){
				sWhere1 = MultiKeyWhere(MultiKeyTmp(oDsMain),oDsMain.RecNo,oDsMain);
			} else {
				sQuot="'";
				if(oDsMain.Field(billkeyfield).DataType == "����" || oDsMain.Field(billkeyfield).DataType == "ʵ��") sQuot="";
				sWhere1 = billkeyfield+"="+sQuot+fcpubdata.keyValue+sQuot;
			}
         	sInsert="Update "+saveasTable+" set "+sU+" where "+ sWhere1;
         }
         xmlSql.append("<no>"+repXml(sInsert)+"</no>");
		 
		 //����ݸ��			
		 if(iTag==5){		    
	     	 sInsert="Insert into "+draftTable+" ("+sF+",draftdesc) Values ("+sV+",'"+draftdescValue+"')";
	         xmlSql.append("<no>"+repXml(sInsert)+"</no>");
		 }

      }
   }

   
	//alert(dssub1.xml)
   //�����ӱ�-------------------------------------------------------------------------

   var oArrGrid=window.document.all.tags("webgrid");
   //����ѭ��
   for (var iGrid=0;iGrid<oArrGrid.length;iGrid++){
   	  //ֻ���ı�񲻱���
   	  if(oArrGrid[iGrid].readonly=="��") continue;
      var dssub1=eval("window."+oArrGrid[iGrid].dataset);
      //ָ���˲�����ʱ
      if(dssub1.pubpara == "��") continue;

		//��δ�����������»����
		/*try {
		    if(oArrGrid[iGrid].txt.style.display == "block" ){
			    oArrGrid[iGrid].hide();
				dssub1.cont_onDataChange();
				dssub1.Update("�����");
			}
			dssub1.UnFilter();
		}catch(e){} */
		if(DsBeforeSave(dssub1,oArrGrid[iGrid])) return;
        var sTmpErrMsg = validDsGrid(dssub1);
        if(sTmpErrMsg != "") {
            alert(sTmpErrMsg);
            return sTmpErrMsg;
        }
		
		if(SaveBillSub(dssub1,billkeyfield,iTag,xmlSql,sProcName ) == false) continue;

   } //end for webgrid
    //E��ؼ��Ĵ���
    var arrDss = fcpubdata.controls["dataset"];
    for(var iEbiao=0;iEbiao < arrDss.length;iEbiao++){
        if(arrDss[iEbiao].isSubGrid=="��"){
            if(arrDss[iEbiao].Update() == 1 ) return ; //��ʾ���ݼ��û��ͨ��.
            if(SaveBillSub(arrDss[iEbiao],billkeyfield,iTag,xmlSql,sProcName ) == false) continue;
        }
    }
	
	if(iTag!=4){
	    //���д������,�˹��̴���������,һ��Ϊ��ID���ڶ�λ���ĸ���ʱ��,һ��Ϊ����ID���ڶ�λ�����Ҫ����ļ�¼.
	    //����;�ָ�,��һ���ڵ��б���洢������+��ID+����ID������
	 	if(isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ){
	 		xmlSql.append("<runsave>{ call "+repXml(new Eapi.Str().trim(sProcName))+"(?,?) };"+fcpubdata.area.dj_sn+";"+gzid+"</runsave>");
		}
		//if(isSpace(sProc)==false){
			//���ù������õ���ɹ���
		   // xmlSql+="<action>"+repXml(sProc)+"</action>"; //��no ==> action
		   
		//}
		//
		if(isSpace(strXmlSql) == false){  //����beforesql,aftersql �ȶ����sql���
			xmlSql.append( strXmlSql);
		}
	
	}else{ //������ʱ��
	
		//���������Ϣ
		var sName=window.showModalDialog(fcpubdata.path+"/fceform/common/inputmsg.htm","���������˵��:","status:no;dialogHeight:105px;dialogWidth:470px;dialogTop:180;dialogLeft:250px") ;
		/*��billgz����дһ����¼,gzid,��������,ʱ��,��ǰ����Ա,��������(������ĸ)
		*/
		s1="insert into billgz (gzid,sgzname,sgzdate,semployeeid,sbilltag) values ('"+gzid+"','"+sName+"','"+curDateTime()+"','"+getuser()+"','"+fcpubdata.area.codeheader+"')";
		xmlSql.append("<no>"+s1+"</no>");
	}

	//��һ���ڵ�Ϊ������󵥾ݱ�ŵı�ʶ,�ں�̨ͨ���˽ڵ�Ľڵ����������������޸�
	var strHead = "";
	if(fcpubdata.keyValue==""){
		var sidtype = fcpubdata.area.idtype;
		if(isSpace(sidtype)) sidtype = "";
		if(sidtype == "4" || sidtype == "5"){
			var tmp1="" ;
			try{
				tmp1 = oDsMain.Field(fcpubdata.area.keyfield).Value ;
			}catch(e){}
			strHead = "<fc"+tmp1+">"+fcpubdata.area.codeheader+"</fc"+tmp1+">";
		}else{
			if(sidtype == "1" || sidtype == ""){
				if(IsSpace(fcpubdata.area.keyfield) == false){
					if(oDsMain.Field(fcpubdata.area.keyfield).DataType == "����"){
						sidtype = "7"; //��ʾ��������
					}
				}
			}
			strHead="<add"+sidtype+">"+fcpubdata.area.codeheader+"</add"+sidtype+">";
		}
	}else {
		//�����ֲ�����XML�Ľڵ���,���Լ���һ��fc
		strHead="<fc"+fcpubdata.keyValue+">"+fcpubdata.area.codeheader+"</fc"+fcpubdata.keyValue+">";
	}
	//---------------------------------------------------------------------------------   

  strHead += xmlSql.toString();
   var blnOk="";		//���̳ɹ���ʶ
   var strReturn=""; //��������ֵ
   //alert(strHead)
   //CopyToPub(strHead)
   var sRet=djupdate(strHead);
	if(sRet==fcpubdata.sendHttpErrMsg) return fcpubdata.sendHttpErrMsg ;
   
   if(isSpace(sRet)==false){
       strRet= sRet ;
   }    
   if(iTag!=4 && isSpace(sProcName)==false && isSpace(oDsMain.temptable)==false ){
	   xmlSql.clear();
	   //�����ʱ��
	   xmlSql.append("<no>"+"delete from "+oDsMain.temptable+" where GZID='"+gzid+"'"+"</no>");
	   try{	
		   if(oArrGrid.length>0 && isSpace(dssub1.temptable) == false )
		   		xmlSql.append("<no>"+"delete from "+dssub1.temptable+" where GZID='"+gzid+"'"+"</no>");
	   }catch(e){}
	   var sRet1=inserts(xmlSql.toString());
	   //alert(xmlSql)
	   if(isSpace(sRet1)==false){
	       alert(sRet1);
	   }
	   
   }	   
   
   //���µĵ��ݱ��ˢ�½��� strRet=�µĵ��ݱ��
//   if(sRet.substring(0,3)==fcpubdata.area.codeheader || sRet.length<12  ){
   if( sRet.indexOf('����:') < 0 ){
	//alert(arrImgValue)
		if(arrImgValue!="" && arrImgChange == "��" ){  //&& arrImgValue.substring(0,4)=="file"){
			var stable=fcpubdata.area.mastertable;
			if(IsSpace(stable)) stable=oDsMain.saveastable;
			if(isSpace(stable)){
				var stip1="������"+fcpubdata.dsMain+"�ı������!";
				alert(stip1);
				return stip1;
			}

			var sRet11 = new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=writeImage&sTablename="+stable+"&sImgname="+arrImgName+"&sKeyname="+fcpubdata.area.keyfield+"&sKeyvalue="+strRet+"&sKeyname1="+escape(fcpubdata.path)+"&sKeyvalue1="+escape(arrImgValue),"");
			if(IsSpace(sRet11)==false){
				alert(sRet11);
				return sRet11;
			}else{
				oDsMain.Field(arrImgName).valid = ""; //���־.�����ظ�����
			}
			
		}
		//-----------------------------------

		//�ϴ������ı���
		//if(isSpace(strRet)) strRet =fcpubdata.keyValue ;
		if(HaveUpload() == true ) upload_save(strRet) ;

	   	blnOk="ok";
	   	//DsMain.oDom.documentElement.childNodes(DsMain.RecNo).
	   	if(oDsMain.Empty!="null" && fcpubdata.area.keyfield != "" ){
		   	oDsMain.bEdit=true;
		   	oDsMain.Field(fcpubdata.area.keyfield).Value=strRet;
		   	oDsMain.Update();
			oDsMain.fset_cont1();
		}
	}else {	//��ʾ������Ϣ
		strReturn=strRet+" ���е�����Ϊ: "+strHead;
        alert(strRet);
        return strReturn;
	}

	//-------------------------------------
	
   	//������ȫ�ֱ���,��������ʱû��djbh�ֶ�
   try{	
	   fcpubdata.keyValue=oDsMain.Field(fcpubdata.area.keyfield).Value ;  //��DsMain.Empty=="null"����
	}catch (e){}
	//alert(fcpubdata.keyValue);
	oDsMain.bAdd=false;
	oDsMain.bEdit=false;

	//HideWait(owin)
	
	//new Eapi.Str().showWait("end");
	fcpubdata.isEdit=false ;  //��ʶ��ǰ�����Ƿ�Ķ�����ȫ�ֱ���

	//�����̺�ֱ�ӹرմ���
	if(iTag==1){
	    window.returnValue="ok"; //�رմ���ǰ��һ��ok�ı�־,��ǰ�洰�����ж��Ǳ���ɹ���رմ���
		CloseBill();
		return strReturn;
	}
	//�����̺�ֱ�ӽ���������һ�ŵ��ݽ���
	if(iTag==3){
		AddBill();
		return strReturn;
	}

	//�����̺󲻹رմ��ڷ���
	if(iTag==2){
		return strReturn;
	}

			d=new Date();
			var t1 = d.getTime();
			//alert(t1-t)	  

	
	if(blnOk=="ok"){    //�������ɹ�

		//s1=message("","��ӡ ����","�¿� ����","�˳� ����");
		//if(s1=="3"){
			//�رյ�ǰ����
			CloseBill();
		
	}
	return strReturn  ;  
}
function SaveBillSub(dssub1,billkeyfield,iTag,xmlSql,sProcName) {
///���������ϸ�����ݼ�, 2008-07-27 ��

		//���ӱ�ʱ���ӱ����ָ������ĺ�����������ֶ���
		if(IsSpace(dssub1.otherkey) ){
			billkeyfield = fcpubdata.area.keyfield ;
		}else{
			billkeyfield = dssub1.otherkey ;  
		}
		
      tmpTable=dssub1.temptable;
      saveasTable=dssub1.saveastable;
	  if(iTag==4)saveasTable="";
      
	/*
 	 ���ӱ����һ�ִӱ��޸ı����ģʽ��ʵ�ֲ��裺
 		1 �ж��Ƿ������ݼ��й��˴Ӽ��ֶΣ��繴������pubdjbh��Ϊ�ղ�תΪ��ģʽ���õ��Ӽ��ֶε��кţ�
 			��ֻ����һ���Ӽ��ֶε������
 		2 �ռ����еĴӼ�ֵ���һ��,�ָ����б�,���������� delete �� where �Ӿ�,�� not in
 		3 ���ϵ���ѭ���ж�,��û��add��edit���,������update, where ԭֵ="";	
 	*/	
 	var sOtherSave = false;
	if(isSpace(saveasTable)==false && fcpubdata.keyValue != "" && fcpubdata.area.OtherSave == "��" ){
		xmlSql.append( SubTableEditSave(dssub1,billkeyfield));
		sOtherSave = true ;
	}else {
	
	  //����ʵ�ʼ�����
	//	ReAllLineSum(dssub1);
      //����������ֶ�
	  dssub1.ReSum();


      if(isSpace(saveasTable)==false && fcpubdata.keyValue != "" ){	
          //ɾ��ԭ���ļ�¼
		sQuot="'";
		if(dssub1.Field(billkeyfield).DataType == "����" || dssub1.Field(billkeyfield).DataType == "ʵ��") sQuot="";          
          sInsert="delete from "+saveasTable+" where "+billkeyfield+"="+sQuot+fcpubdata.keyValue+sQuot;
          xmlSql.append("<no>"+repXml(sInsert)+"</no>");
      }      

	var sSubKeyFieldName = getSubKeyName(dssub1,billkeyfield); //�Ӽ��ֶ���
	
		//�õ�Ҫ������ֶ�����
		xmlFields = dssub1.format;
		oXmlField = SetDom(xmlFields)  ;  
		
		arrField = Save_GetFieldArr(dssub1,oXmlField) ;
		if(arrField == null) {
			return false; //continue ; //return fcpubdata.sendHttpErrMsg ;
		}
		kk = arrField.length ;
		sF = Save_GetsF(arrField,oXmlField,"��");
		if((isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ) || iTag ==4){
			tmp_sF=InsertTmpTableFields(dssub1);
		}		
	  var ll= dssub1.RecordCount ;
      for(var ii=0;ii<ll;ii++){
		if(dssub1.oDom.documentElement.childNodes(ii).getAttribute("rowstate") == "new") continue; //ǿ������������δ�޸Ĺ�,����
         //ƴֵ�б�
			sV="";
			for(arri=0;arri<kk;arri++){
				i=arrField[arri];
				arrRet = Save_GetsVsU(dssub1,ii,i,billkeyfield,sV,"","��",sSubKeyFieldName) ;
				sV = arrRet.sV;
				//sU = arrRet.sU;
   	   		} // end for

		if((isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ) || iTag ==4){
		 	//sInsert="Insert into "+tmpTable+" ("+sF+",GZID) Values ("+sV+"'"+gzid+"')";
			sInsert = "Insert into "+tmpTable+" ("+tmp_sF+"GZID) Values ("+InsertTmpTableSql(dssub1,ii)+"'"+gzid+"')";
		 	xmlSql.append("<no>"+repXml(sInsert)+"</no>");
		}
        if(isSpace(saveasTable)==false){	

	     	if(sV.length>0){
	     	    sV=sV.substring(0,sV.length-1);
	     	}
		    sInsert="Insert into "+saveasTable+" ("+sF+") Values ("+sV+")";
		    xmlSql.append("<no>"+repXml(sInsert)+"</no>");
			//����ݸ��
			if(iTag==5){		    
			    sInsert="Insert into "+draftsubTable+" ("+sF+") Values ("+sV+")";
			    xmlSql.append("<no>"+repXml(sInsert)+"</no>");
		    }
	 	}
   	  } //end for record
   	  
	 } // othersave endif

    return true;
}
/**
*���ع���ID
**/
function getgzid() {
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?getRecnum","<no>LGZ</no>");
}

/**
*���ݴ���
*@param sSql Ҫִ�е�SQL���
**/
function djupdate(sSql) {
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?djupdate",sSql);
}
/**
*������ݴ���
*@param sSql Ҫִ�е�SQL���
**/
function savegrid(sSql) {
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?savegrid",sSql);
}

/**
*���������ݼ�����ʱ����ֶδ���
*����ʱ����Ҫ������SQL����в����ڵ��ֶ�ʱ,����ʱ��������б�ʶ,��Ĭ��ֵ�и������㺯��.
*��Щֵֻ�浽��ʱ����,���浽������.
*@date 2003-09-29
**/
function TmpTableAddField(tmpTable,sF,sV,gzid){
	sF = sF + "," ;
	var oDsMain = $id(fcpubdata.dsMain);
    var sInsert="Insert into "+tmpTable+" ("+sF+"GZID) Values ("+sV+"'"+gzid+"')";

  //������ʽ----------
      //ͨ��dataset format�����ҵ����ʽ���ֶ���
   var sFadd="";
   var sVadd=""   ;
   var s11=oDsMain.format;
   if(isSpace(s11)==false){
	   var oXml=new ActiveXObject("Microsoft.XMLDOM");
	   oXml.async=false;
	   oXml.loadXML (s11);
	   var oList=oXml.documentElement.selectNodes("//field[fieldkind='��ʱ������']");
	   for(var iList=0;iList<oList.length;iList++){     
		   var sExp=oList.item(iList).childNodes(6).text;
		   var sFieldName=oList.item(iList).childNodes(0).text;
		   var vValue=eval(sExp);
		   
			sFadd+=sFieldName+",";
			sVadd+="'"+vValue+"',";
	   }
	   sInsert="Insert into "+tmpTable+" ("+sF+sFadd+"GZID) Values ("+sV+sVadd+"'"+gzid+"')";
   }
   //---------------------   
   return sInsert;
}

/**
*# ɾ������ no use
*      ����:   1.�������ݼ���ȡ�����ݱ����ID,������ʶ��:JXH0001,�ɴ˵õ�����.
*              2.ƴ��һ��ɾ����SQL���,Ȼ��ִ��.
*              3.�ɹ���,���ݴ������״̬.
*      			4.�ӵ�ǰ���ݼ���ɾ���˼�¼.
**/ 
function DelBill(){
	if(NotCanSave())return;
	var ret = window.confirm("ȷ��ɾ����");		
	if (ret==false) {
		return;
	}   	   
	var oDsMain = $id(fcpubdata.dsMain);
	if(oDsMain == null) {
		alert("���ڱ�ģ��������һ�������ݼ��ؼ�(ָû�а󶨵����ؼ������ݼ��ؼ�)�����Դ˹���");
		return;
	}
   var sTable=fcpubdata.area.mastertable ; //"zhiydoc" //"jxddhz"
   if(isSpace(sTable))sTable=oDsMain.saveastable;
   if(isSpace(sTable)){
      alert("������"+fcpubdata.dsMain+"�ı������!");
      return;
   }
   var sdjbh=oDsMain.Field(fcpubdata.area.keyfield).Value;
     var sInsert="update "+sTable+" set beactive='��'"+" where "+fcpubdata.area.keyfield+"='"+sdjbh+"'";
  
   //alert(sInsert)
   var sRet=fc_insert(sInsert);
   if(isSpace(sRet)==false){
       alert(sRet)	;
   }else {
   	   oDsMain.Delete();
       //�ɹ���,���ݴ������״̬.
       AddBill() ;
   }
}
/**
*ɾ������ϵ�һ�м�¼,beactive='��'
*@param dsGrid ����Ӧ�����ݼ�
*@date 2003-08-04
*/
function DelRow(dsGrid){
	if(NotCanSave())return;
	var ret = window.confirm("ȷ��ɾ����ǰ����");		
	if (ret==false) {
		return;
	}   	   
	if(arguments.length==0)
		dsGrid=dssub1;
   var sTable=fcpubdata.area.mastertable ; //"zhiydoc" //"jxddhz"
   if(isSpace(sTable)){
   		sTable=dsGrid.saveastable;
   	}
   if(isSpace(sTable)){
		alert("�����ñ�����ݼ���������!");
		return;
	}   	
	
	var arr=MultiKeyTmp(dsGrid);
	var sWhere=""; //ƴupdate�����where�Ӿ�
	//alert(dsGrid.RecNo)
	sWhere=MultiKeyWhere(arr,dsGrid.RecNo,dsGrid);
	if(isSpace(sWhere)){    //Ϊ��ʱΪ�˼���ȡ���ؼ��ֶε�������
	    var sdjbh=dsGrid.Field(fcpubdata.area.keyfield).Value;
		sWhere=fcpubdata.area.keyfield+"='"+sdjbh+"'";
	}

   
//   var sInsert="delete from "+sTable+" where "+fcpubdata.area.keyfield+"='"+sdjbh+"'"
     var sInsert="update "+sTable+" set beactive='��'"+" where "+sWhere;
  
   //alert(sInsert)
   var sRet=fc_insert(sInsert);
   if(isSpace(sRet)==false){
       alert(sRet)	;
   }else {
   	   dsGrid.Delete();
       //�ɹ���,���ݴ������״̬.
   }
	
}

/**
  //�ж�tablename�����Ƿ���fieldname,���з���true
  �Ƚ������е��ֶκ����ݼ��е��ֶ�
**/
function table_have_field1(tablename){
	
  var sXml=dataset_select("select * from "+tablename+" where 1=2",1,1);
  if(sXml==fcpubdata.sendHttpErrMsg) return fcpubdata.sendHttpErrMsg ;
  var oXml=new ActiveXObject("Microsoft.XMLDOM");
  oXml.async=false;
  oXml.loadXML (sXml);
  if(oXml.documentElement == null) {
	alert("�ܿ��������ݿ�����"+tablename + "��,������select * from "+tablename+" where 1=2 ִ�г���!");
	return ;
  }
  var sFields=oXml.documentElement.childNodes(0).childNodes(1).xml;
  oXml=new ActiveXObject("Microsoft.XMLDOM");
  oXml.async=false;
  oXml.loadXML (sFields);
  return oXml;
}
function table_have_field2(oXml,fieldname){
	var oNode=oXml.documentElement.selectSingleNode("field[fieldname='"+fieldname.toLowerCase()+"']");
	if(oNode == null )
		return false;	
	else
		return true;
	
}
/**
*�µı�����ĺ���
*@param sExit=="�˳�" ,��ʾִ�гɹ���رմ���.
*@param ogridDs grid�ؼ����󶨵����ݼ�����
*@param strXmlSql ��ͬһ�����е�ǰ������sql���,��beforesql,aftersql���ڵ��� 
*@return ��:��ʾ������ȷ,����Ϊ������Ϣ.
*@date 2004-03-22
**/
function SaveOneGrid(sExit,ogridDs,strXmlSql) {
	if(NotCanSave())return;
	var oDs ;
	if(typeof ogridDs == "undefined"){
		oDs=dssub1;
	}else{
		oDs=ogridDs;
	}
	
	//����Ҫ������ϵ���������fset����Ҫ��������
//	var oGrid = GetDsGrid(oDs);
//	if(oGrid.txt.style.display != "none"){
//		oDs.cont_onDataChange();
//	}
//		if(oDs.Update()==1) return;  //��δ�뿪��ǰ����Ҫǿ�и���.	
    if(typeof(oDs.isSubGrid) == "undefined"){
	    if(DsBeforeSave(oDs)) return;
        var sTmpErrMsg = validDsGrid(oDs);
        if(sTmpErrMsg != "") {
            alert(sTmpErrMsg);
            return sTmpErrMsg;
        }
	}else{ //E��ؼ���
	    if(oDs.Update() == 1) return;
	}
	var billkeyfield=fcpubdata.area.keyfield; //���ϵ�KEY�ֶ���
	var sProcName=fcpubdata.area.runsave;  //���Ĵ������    
   
	
	var saveasTable=oDs.saveastable;
	if(isSpace(saveasTable)){
		alert("���ݼ�"+oDs.id+"�ı����������Ϊ��!");
		return;
	}
    
    
	var tmpTable=oDs.temptable;
	if(isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ){
		var gzid=getgzid();  //ȡ�ù���ID
		if(gzid==fcpubdata.sendHttpErrMsg)return fcpubdata.sendHttpErrMsg;
		var tmp_sF=InsertTmpTableFields(oDs);
	}	
	//�õ�Ҫ������ֶ�����
	var xmlFields = oDs.format;
	var oXmlField = SetDom(xmlFields)  ;  
	
	var arrField = Save_GetFieldArr(oDs,oXmlField) ;
	if(arrField == null) {
		return fcpubdata.sendHttpErrMsg ;
	}
	var fieldLen = arrField.length ;
	var sF = Save_GetsF(arrField,oXmlField);
	
	
	var arr=MultiKeyTmp(oDs);

    if(fcpubdata.area.idtype == "") fcpubdata.area.idtype = "1"; //Ĭ��ֵ
    var arrNewId=new Array(); //��¼��Ҫ��дID�ֶ�ֵ���к�
    var arrNewIdCount=0;
    var colNoKeyField = 0; //�����ֶ��������к�,�����ݼ�XML�е�
    if(IsSpace(billkeyfield)){
        if(arr.length>0){
            colNoKeyField = arr[0];
        }else{
            alert("û�����������ֶ�,����ϵ������޷�����!");
            return;
        }
    }else{
        colNoKeyField = oDs.FieldNameToNo(billkeyfield);
    }

	var xmlSql=new Sys.StringBuilder();
	var ll = oDs.RecordCount;
	for(var ii=0;ii<ll;ii++){

		//�������Ϊ������
		if(oDs.oDom.documentElement.childNodes(ii).getAttribute("rowstate")=="add" || oDs.oDom.documentElement.childNodes(ii).getAttribute("rowstate")=="edit"){
			var sWhere=""; //ƴupdate�����where�Ӿ�
			//ƴֵ�б�
			var sV="";
			var sU="";
			for(var arri=0;arri<fieldLen; arri++){
				i=arrField[arri]; //�к�
				
				var arrRet = Save_GetsVsU(oDs,ii,i,billkeyfield,sV,sU) ;
				sV = arrRet.sV;
				sU = arrRet.sU;
			}
			if(sV.length>0) sV=sV.substring(0,sV.length-1);
			if(sU.length>0)	sU=sU.substring(0,sU.length-1);
			
	        if(isSpace(saveasTable)==false){	
				sWhere=MultiKeyWhere(arr,ii,oDs);
				var s11111 = "" ;
				if(isSpace(sWhere)){    //Ϊ��ʱΪ�˼���ȡ���ؼ��ֶε�������
					try {
						s11111 = oDs.oDom.documentElement.childNodes(ii).childNodes(oDs.FieldNameToNo(billkeyfield)).text ;
					}catch(e){} ;
					sWhere=billkeyfield+"='"+s11111+"'";
				}
				if(isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ){
			 		//���뵽��ʱ��
			 		//var sV1=repStr(sV,":get_keyfield",""); //��ʱ�����ÿ�ֵ,�����ֶ�װ����.
					var sInsert="Insert into "+tmpTable+" ("+tmp_sF+"GZID) Values ("+InsertTmpTableSql(oDs,ii)+"'"+gzid+"')";
					xmlSql.append("<no>"+repXml(sInsert)+"</no>");
				}
				
				//�жϱ����Ƿ����,�粻������
				var sHave="����";
				if(oDs.oDom.documentElement.childNodes(ii).getAttribute("rowstate")=="edit"){
				    var s11=fc_select("select * from "+saveasTable+" where "+sWhere,1,1);
				    if(s11.length<16)sHave="������";
                }
				if (sHave=="������" || oDs.oDom.documentElement.childNodes(ii).getAttribute("rowstate")=="add" ){
					//����IDʱ�� ":get_keyfield" ���� ����
					if(fcpubdata.area.idtype == "3") {
						sV = RepStr(sV,":get_keyfield",fcpubdata.area.codeheader + ".nextval" );
					}
					//���뵽��ʽ��
				    sInsert="Insert into "+saveasTable+" ("+sF+") Values ("+sV+")";
				    var sstmp1=fcpubdata.area.codeheader; //// ��fcpubdata.area.idtype == "1" ʱ
				    if (isSpace(sstmp1)) sstmp1 = "no"; // ��fcpubdata.area.idtype == "4" or "5" ʱ
				    //�Զ��������ֶε�ֵ,�˴���һ��runsave6�ı�ʶ����̨����ʹ��
					if(fcpubdata.area.idtype == "3" || fcpubdata.area.idtype == "6" || fcpubdata.area.idtype == "8") { // =8 ��ʾGUID����
						sstmp1 = "runsave"+fcpubdata.area.idtype+fcpubdata.area.codeheader;
					}else if (fcpubdata.area.idtype == "2"){
						sstmp1 = "runsave2";
					}else if( fcpubdata.area.idtype == "1"  && IsSpace(fcpubdata.keyfield) == false ) {
						if(oDs.Field(fcpubdata.keyfield).DataType == "����" ){ 
							//�˴���һ��runsave7�ı�ʶ����̨����ʹ��,����������������
							sstmp1 = "runsave7"+fcpubdata.area.codeheader;
						}
					}				    
				    xmlSql.append("<"+sstmp1+">"+repXml(sInsert)+"</"+sstmp1+">");

				    if(sstmp1 != "no"){
				        arrNewId[arrNewIdCount] = ii;
				        arrNewIdCount++;
				    }
					//alert(sInsert)				
			    } else {
			    	//�������޸�Update
					 var sUpdate="Update "+saveasTable+" Set "+sU+" where "+sWhere;
				     xmlSql.append("<no>"+repXml(sUpdate)+"</no>");
			    	
				}
		 	}			
		} //end if add	     
	} // end for recordcount
   //���д������,�˹��̴���������,һ��Ϊ��ID���ڶ�λ���ĸ���ʱ��,һ��Ϊ����ID���ڶ�λ�����Ҫ����ļ�¼.
   //����;�ָ�,��һ���ڵ��б���洢������+��ID+����ID������
 	if(isSpace(sProcName)==false){
 		xmlSql.append("<runsave>{ call "+repXml(new Eapi.Str().trim(sProcName))+"(?,?) };"+fcpubdata.area.dj_sn+";"+gzid+"</runsave>");
	}
	
	if(IsSpace(strXmlSql) == false){
		xmlSql.append(strXmlSql);
	}
	//alert(xmlSql)
	if(xmlSql.isEmpty()) return ;
	var sRet="";
	var sRet1=savegrid(xmlSql.toString());
	if(isSpace(sRet1)==false && sRet1.substring(0,6) == "error:"){
		sRet=sRet1+" ���е�����Ϊ: "+xmlSql ;
		alert(sRet);
	}else{
	    //���ͺ�̨���ص�IDs��XML��.
	    var arrId = sRet1.split(",");
        var i=0;
        while(i<arrId.length-1 && arrNewIdCount > 0 && i< arrNewIdCount ){ //�������һ��,��
            oDs.oDom.documentElement.childNodes(arrNewId[i]).childNodes(colNoKeyField).text = arrId[i];
            i++;
        }	 
        //Ҫͬ��fset��grid����ɢ�ؼ�.
        oDs.dset_cont(); 
        oDs.dset_fset();
        oDs.fset_cont1();
        oDs.bAdd=false;
        oDs.bEdit=false;
        //-------------------
        
		fcpubdata.isEdit=false;   //��ʶ��ǰ�����Ƿ�Ķ�����ȫ�ֱ���	
		ClearEditTag(oDs);
		alert("����ɹ���");
	}	
	//�����ʱ��
	
	if(isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ){
		
	    sRet1=inserts("<no>"+"delete from "+tmpTable+" where GZID='"+gzid+"'"+"</no>");
		if(isSpace(sRet1)==false){
			alert(sRet1);
		}  	
	}
	if(sExit=="�˳�"){
	    window.returnValue="ok"; //�رմ���ǰ��һ��ok�ı�־,��ǰ�洰�����ж��Ǳ���ɹ���رմ���
		CloseBill();
	}
	return sRet;
}

/**
*��ֹ����
*@return true ��ʾ���ܱ��� ��savebill delbill savegrid delrow ����
*@date 2003-12-05
**/
function NotCanSave() {
	if(parent.piAction==3){
		alert("����չ��״̬,���ܱ���!");
		return true;
	}
	return false;
}
/**
*ͳһ�ı����溯��
*@param sExit ="�˳�" ��ʾ���̺�رձ�,���򲻹ر� 
*@return ��:��ʾ��ȷ����,����Ϊ������ʾ.
*@date 2004-03-24
**/
function DjSave(sExit){
	var sRet="";
	if(sExit=="�˳�"){
		sRet=SaveBill(1);
	}else if(typeof(sExit) == "undefined"){
		sRet=SaveBill(2);
	}else{ //��ʾ sExit = xml��ʽ��sql���.
	    sRet=SaveBill(2,sExit);
	}
	return sRet ;
}
/**
*������ɹ�����ʾ����ɹ�.�޷���ֵ.
*@date 2006-01-20
**/
function DjSaveShow(){
	var b=DjSave();if(IsSpace(b)){alert('����ɹ�')}else{alert(b)}
}
/**
*��񱣴�ɹ�����ʾ����ɹ�.�޷���ֵ. no use
*@date 2006-01-20
**/
function GridSaveShow(odsgrid){
	var b=GridSave(odsgrid);if(IsSpace(b)){
		//alert('����ɹ�');
	}else{alert(b)}
}

/**
*��������ݵı��溯��
*@date 2004-11-26
**/
function GridSave(odsgrid,sExit) {
    if(sExit == "�˳�" || typeof(sExit) == "undefined")
	    return SaveOneGrid(sExit,odsgrid);
    else
        return SaveOneGrid("",odsgrid,sExit); //sExit = xml ��ʽ��sql	    
}
/**
*�����ݴ���ʱ�����ݲ��ֽ������,�罫' ==> ''
*@param svalue ΪҪ�ύ���ֶε�ֵ
*@date 2004-04-23
**/
function RepUpdateSql(svalue){
	//if(fcpubdata.databaseTypeName != "sqlserver" ) return svalue;
	var sRet=repStr(svalue,"'","''") ;
	return sRet;
}

/**
*#��������
**/
function AddBill(){
	var oDsMain = $id(fcpubdata.dsMain);
	if(oDsMain == null) {
		alert("���ڱ�ģ��������һ�������ݼ��ؼ�(ָû�а󶨵����ؼ������ݼ��ؼ�)�����Դ˹���");
		return;
	}
	
    //openselbill("")
   // DsMain.Append()
   //���������ݼ�
   var sErr=oDsMain.OpenEmpty();
	
   //���ӱ����ݼ�
   var o=window.document.all.tags("dataset");
   for(var ii=0;ii<o.length;ii++){
      if (o[ii].id!=fcpubdata.dsMain){
             o[ii].PageSize=-1;
             sErr=o[ii].OpenEmpty();
            // o[ii].Append()
      }
      
   }    
   	//������ȫ�ֱ���,��������ʱû��djbh�ֶ�
   fcpubdata.keyValue="" ;

}
/**
����ǰ�ֶ�ת��
*@para sXml ���ݼ��е�fieldtrans����ֵ
*@para fieldname �ֶ���
*@para fieldvalue �ֶ�ֵ
*@para mRecNo ��¼��,��0��ʼ��
*@return ����ת������ֶ�ֵ
*@date 2005-12-22
**/
function BeforeSaveFieldTrans(sXml,fieldname,fieldvalue,mRecNo) {
	if(isSpace(sXml)) return fieldvalue ;
	var oXml=SetDom(sXml);
	var l=oXml.documentElement.childNodes.length;
	for(var i=0;i<l;i++){
		if(oXml.documentElement.childNodes(i).childNodes(0).text == fieldname){
			var ss = unescape(oXml.documentElement.childNodes(i).childNodes(1).text) ;
			//if(ss.indexOf("mRecNo")>=0){
			//	ss = RepStr(ss,"mRecNo",mRecNo);	
			//	ss = eval(ss);
			//}else{
			//	ss = RepStr(ss,"ff()",fieldvalue);
			//}
			ss =eval(ss);
			return ss;
		}
	}
	return fieldvalue ;
}
/**
*�������м�¼��ʵ�ʼ�����
*@param dssub1 ����Ӧ�����ݼ�����
*@date 2006-02-27
**/
function ReAllLineSum(dssub1){
	
	var tmpNo = dssub1.RecNo;
	for(var i=0;i<dssub1.RecordCount;i++){
		dssub1.LineSum(null,i);
	}
	dssub1.RecNo = tmpNo;

}


/**
*�������ݼ��е�һ���Ӽ����ֶ���
*@para MainKey Ϊ������������
*@date 2006-03-04
**/
function getSubKeyName(dssub1,MainKey){
	var xmlFields=dssub1.format;
	var oXml=new ActiveXObject("Microsoft.XMLDOM");
	oXml.async=false;
	oXml.loadXML (xmlFields) ;
	var oList=oXml.documentElement.selectNodes("//field[primarykey='��']");
	for(var iList=0;iList<oList.length;iList++){     
		var sFieldName=oList.item(iList).childNodes(0).text;
		if(sFieldName.toUpperCase() != MainKey.toUpperCase()){
			return sFieldName;
		}
	}
	return "";
}
/**
* �����õ��ӳ��򣬵õ��ֶε��������
*������Ϊ��,�����ݼ��е������ֶζ����浽��ʱ����,�粻Ϊ��,��ֻ���������е����ݼ��ֶβ�
*���浽��ʱ����.
**/
function Save_GetFieldArr(dssub1,oXml) {
	  var arrField=new Array();
      var saveasTable = dssub1.saveastable ;
      var arri,i;
      if(isSpace(saveasTable) == false){
			var ooXml=table_have_field1(saveasTable);
			if(typeof ooXml != "object") return null ;

	  		// ���� xmlFields
	  		arri=0;
	  		for( i=0;i<dssub1.FieldCount;i++){
	  			if(dssub1.Field(i).DataType == "ͼ��" ) continue;
				if(table_have_field2(ooXml,oXml.documentElement.childNodes(i).childNodes(0).text)){
					arrField[arri]=i;
					arri++;
				}
	  		}
	  }else{
	  		arri=0;
	  		for( i=0;i<dssub1.FieldCount;i++){
	  			if(dssub1.Field(i).DataType == "ͼ��" ) continue;
				arrField[arri]=i;
				arri++;
	  		}
	  	
	  }
	  return arrField ;
}
/**
* �����õ��ӳ��򣬵õ�insert���ǰ�벿�ֵ��ֶ��б�
*@para bMainTab ==�� ��ʾ������ʱ����, ==�� ��ʾ���ӱ�ʱ�Ӵӱ����
**/
function Save_GetsF(arrField,oXml,bMainTab) {
      //ƴ�ֶ��б�  
      
      var sF="";
      for(var arri=0;arri<arrField.length;arri++){
			i=arrField[arri];
			var curFieldName = oXml.documentElement.childNodes(i).childNodes(0).text ;
			if(fcpubdata.area.idtype == "2" &&  curFieldName.toUpperCase() == fcpubdata.area.keyfield.toUpperCase() && bMainTab != "��") {
				//�Զ����ID
			}else{
				sF+=curFieldName+",";	
			}
      }

	if(sF.length>0){
		sF=sF.substring(0,sF.length-1);
	}
	return sF ;
}
/**
* �����õ��ӳ��򣬵õ�insert����벿�ֺ�update����set����
*@para bMainTab ==�� ��ʾ������ʱ����, ==�� ��ʾ���ӱ�ʱ�Ӵӱ����,sSubKeyFieldNameΪ�Ӽ��ֶ��� ii=��¼��,i=�ֶκ�
**/
function Save_GetsVsU(oDs,ii,i,billkeyfield,sV,sU,bMainTab,sSubKeyFieldName) {
	var bool = true ; 
	var s1="";
	var s11111 ="";
	billkeyfield = billkeyfield.toLowerCase() ;
	var curFieldName = oDs.Field(i).FieldName.toLowerCase() ;
	var curFieldValue = "" ;
	if(bMainTab == "��") {
		curFieldValue = oDs.Field(i).Value ;
	}else{
		curFieldValue = oDs.oDom.documentElement.childNodes(ii).childNodes(i).text ;
	}
	//�Զ����ID
	if(fcpubdata.area.idtype == "2" &&  curFieldName == billkeyfield && bMainTab != "��") {
		//ʲôҲ����

	//oracle������ID ��GridSave�е���ʱ
	//}else if(fcpubdata.area.idtype == "3" &&  curFieldName == billkeyfield && bMainTab!= "��" && bMainTab!= "��") {
	//	sV += fcpubdata.area.codeheader + ".nextval," ;
	}else if(bMainTab == "��" && curFieldName == sSubKeyFieldName.toLowerCase()){
		sV += "'"+IGetSubTableKeyValue(ii,sSubKeyFieldName)+"'," ;  //�����ⲿ���������ɴӼ��ֶ�ֵ
	} else {
		//if(isSpace(curFieldValue))
		//	s1="";
		//else
			//s1=BeforeSaveFieldTrans(oDs.fieldtrans,oDs.Field(i).FieldName,curFieldValue,i ) ;  //s1=oDs.oDom.documentElement.childNodes(ii).childNodes(i).text ; 
		var irecno = ii;
		if(bMainTab == "��") irecno=-1;
		s1 = oDs.fieldTrans(i,irecno);	
		//�����������KEY���ӱ�.
		if(curFieldName == billkeyfield) {
			if ( typeof fcpubdata.area.idtype=="undefined" || fcpubdata.area.idtype=="1" || fcpubdata.area.idtype=="2" || fcpubdata.area.idtype=="3" || fcpubdata.area.idtype=="6" || fcpubdata.area.idtype=="8") {
				s1=":get_keyfield" ;   
				if(bMainTab != "��"){
					s11111=curFieldValue;
					//���ؼ��ֶθ�ֵ��Ͳ�����һ���µ�,2004-03-14
					if(isSpace(s11111)==false) s1=s11111;
				}
			}else{ // 2007-03-29 add ,�Ա�����Ϊ�����ֶ�������ʱ���Զ����������ֶε�ֵ���ӱ�.
			    var oDsTmp = $id(fcpubdata.dsMain);
				if(typeof(bMainTab) == "undefined"){ //��GridSaveʱ
				    oDsTmp = oDs;
				}
			    if(IsSpace(billkeyfield)==false) //������ж�����Ϊ������ֶ�������ʱbillkeyfieldΪ��
				    s1 = oDsTmp.Field(billkeyfield).Value ;
				
			}
			//----------------------
		}  
		if(oDs.Field(i).DataType=="����" || oDs.Field(i).DataType=="ʵ��"){
			//��ϸ����ֶ�
			if(oDs.Field(i).FieldName==fcpubdata.gridNoFieldName){
			    	sV+=(ii+1)+",";
			}else {
			    if(isSpace(s1)){
			    	sV+="0,";
			    	s1="0"; //��0ֵ��sU+ʱ��
			    }else{
			    	sV+=s1+",";
			    }
			}
		}else if(oDs.Field(i).DataType=="�Զ�"){
			sV+=""+s1+",";				
		}else if(oDs.Field(i).DataType=="����" && fcpubdata.databaseTypeName == "oracle"){
			sV+=""+"to_date('"+s1+"','yyyy-mm-dd')"+",";			
		}else {
			//��������ŵ������ַ�
			s1=RepUpdateSql(s1);
			sV+="'"+s1+"',";
		}
		var squot="'";
		if(oDs.Field(i).DataType=="�Զ�" || oDs.Field(i).DataType=="����" || oDs.Field(i).DataType=="ʵ��"){
			squot="";
		}
		if(oDs.Field(i).DataType=="����" && fcpubdata.databaseTypeName == "oracle"){
			squot="";
			s1="to_date('"+s1+"','yyyy-mm-dd')";
		}
		//key�ֶβ����ٸ���
		if(curFieldName != billkeyfield ){
			sU+=oDs.Field(i).FieldName +"="+squot+s1+squot+",";
		}
	}
		
	var arrRet = {
		sV : "",
		sU : ""
	}
	arrRet.sV = sV;
	arrRet.sU = sU;
	//if(IsSpace(s11111) == false)
	//arrRet.sKeyValue = s11111;
	return arrRet ;
}


/**
���ӱ����һ�ִӱ��޸ı����ģʽ��ʵ�ֲ��裺
1 �ж��Ƿ������ݼ��й��˴Ӽ��ֶΣ��繴������pubdjbh��Ϊ�ղ�תΪ��ģʽ���õ��Ӽ��ֶε��кţ�
 	��ֻ����һ���Ӽ��ֶε������
2 �ռ����еĴӼ�ֵ���һ��,�ָ����б�,���������� delete �� where �Ӿ�,�� not in
3 ���ϵ���ѭ���ж�,��û��add��edit���,������update, where ԭֵ="";
4 Ҫ��֤��ִ��ɾ�������޸ģ������ӵ�SQL���ִ��˳��.
**/
function SubTableEditSave(oDs,billkeyfield) {
	var sWhere = "",s1,ii;
	var saveasTable = oDs.saveastable ;
	var ll = oDs.RecordCount;
	//var billkeyfield = fcpubdata.area.keyfield ;
	var SubKeyName = getSubKeyName(oDs,billkeyfield);  //�Ӽ��ֶ���
	var iSubKeyNo = oDs.FieldNameToNo(SubKeyName);
	var xmlSql = new Sys.StringBuilder() ;
	var sList = new Sys.StringBuilder() ;
	for(ii=0;ii<ll;ii++){
		s1 = oDs.oDom.documentElement.childNodes(ii).childNodes(iSubKeyNo).text ;
		if(isSpace(s1) == false){
			sList.append("'"+s1+"'");
		}
	}
	s1 = sList.toString(",");
	//ƴɾ�����
	s1 = "delete from " + saveasTable + " where " + billkeyfield + "='" + fcpubdata.keyValue 
			+ "' and " + SubKeyName + " not in (" + s1 + ")" ;
	xmlSql.append("<no>" + s1 + "</no>");

	//�õ�Ҫ������ֶ�����
	var xmlFields = oDs.format;
	var oXmlField = SetDom(xmlFields)  ;  
	
	var arrField = Save_GetFieldArr(oDs,oXmlField) ;
	if(arrField == null) {
		return fcpubdata.sendHttpErrMsg ;
	}
	var fieldLen = arrField.length ;
	var sF = Save_GetsF(arrField,oXmlField,"��");
	
	var sInsert="";
	var oldValue="" ; //�Ӽ��ֶεľ�ֵ
	var newValue="" ; //�Ӽ��ֶε���ֵ
	var sEditSql = new Sys.StringBuilder() ; //�ռ��޸ĵ�SQL���
	var sAddSql =  new Sys.StringBuilder() ; //�ռ����ӵ�SQL���
	for(ii=0;ii<ll;ii++){  //�ӱ��¼ѭ��
		var sRowTag = oDs.oDom.documentElement.childNodes(ii).getAttribute("rowstate") ;
		oldValue = oDs.oDom.documentElement.childNodes(ii).childNodes(iSubKeyNo).text ;
		//�Զ������кŵõ��ĴӼ��ֶ�ֵ
		newValue = IGetSubTableKeyValue(ii) ;
		sWhere = " where " + billkeyfield + "='" + fcpubdata.keyValue + "' and " + SubKeyName + "='" + oldValue + "'" ;
		
		if(sRowTag == "add" || sRowTag == "edit" ){
			var sV="";
			var sU="";
			for(var arri=0;arri<fieldLen; arri++){
				i=arrField[arri]; //�к�
				var arrRet = Save_GetsVsU(oDs,ii,i,billkeyfield,sV,sU,"��",SubKeyName) ;
				sV = arrRet.sV;
				sU = arrRet.sU;
			}
			if(sV.length>0) sV=sV.substring(0,sV.length-1);
			if(sU.length>0)	sU=sU.substring(0,sU.length-1);
			
			if(sRowTag == "add"){
				sInsert="Insert into "+saveasTable+" ("+sF+") Values ("+sV+")";
				sAddSql.append("<no>" + repXml(sInsert) + "</no>");
			}else{		//edit
				sInsert="Update "+saveasTable+" set "+sU+" "+ sWhere;
				sEditSql.append("<no>" + repXml(sInsert) + "</no>");
			}
			
			
		} else { //ֻ����update�Ӽ��ֶε�update���
			sInsert = "update " + saveasTable + " set " + SubKeyName + "='" + newValue + "' " + sWhere;
			sEditSql.append("<no>" + repXml(sInsert) + "</no>") ;	
			
		}
		
	}
	xmlSql.append(sEditSql.toString());
	xmlSql.append(sAddSql.toString());
	
	return xmlSql.toString();
}
/**
* ������ʱ��Ҫ�õ��ֶ��б�
*@date 2006-07-04
**/
function InsertTmpTableFields(oDs) {
	var oF=oDs.oDom.documentElement.childNodes(oDs.oDom.documentElement.childNodes.length-1).childNodes(1);
	var l=oF.childNodes.length;
	var sFieldName='';
	for(var i=0;i<l;i++){     
		sFieldName += oF.childNodes(i).childNodes(0).text + ",";
	}
	return sFieldName;	
}
/**
* ������ʱ��Ҫ�õ�ֵ�б�
*@param curRow ��ǰ���ݼ��ļ�¼��
*@date 2006-07-04
**/

function InsertTmpTableSql(oDs,curRow) {
	var oV=oDs.oDom.documentElement.childNodes(curRow);
	var l=oV.childNodes.length;
	var sV='';
	for(var i=0;i<l;i++){     
		var s1= oV.childNodes(i).text ;
		if(oDs.Field(i).DataType=="����" || oDs.Field(i).DataType=="ʵ��"){
			//��ϸ����ֶ�
			if(oDs.Field(i).FieldName==fcpubdata.gridNoFieldName){
			    	sV+=(ii+1)+",";
			}else {
			    if(isSpace(s1)){
			    	sV+="0,";
			    	s1="0"; //��0ֵ��sU+ʱ��
			    }else{
			    	sV+=s1+",";
			    }
			}
		}else if(oDs.Field(i).DataType=="�Զ�"){
			sV+=""+s1+",";				
		}else if(oDs.Field(i).DataType=="����" && fcpubdata.databaseTypeName == "oracle"){
			sV+=""+"to_date('"+s1+"','yyyy-mm-dd')"+",";			
		}else {
			//��������ŵ������ַ�
			s1=RepUpdateSql(s1);
			sV+="'"+s1+"',";
		}
	}
	return sV;
}

///�������ˢ����һ���ڵ�grid�ؼ�
function SaveAfterRefreshGrid(){
	var isAdd = IsSpace(fcpubdata.keyValue);
	var ret=DjSave();
	if(ret == ""){
		if(isAdd)
			fcpubdata.obj.Append();
		else
			fcpubdata.obj.bEdit = true;
		
		copydataset($id(fcpubdata.dsMain),fcpubdata.obj);
		fcpubdata.obj.fset_cont();	
		fcpubdata.obj.Update();
		CloseBill();
	}else{
		alert(ret);
	}
}







///=======================================================================================================







/**
*ɾ������ϵ�һ�м�¼,ֱ��ɾ����¼
*@param dsGrid ����Ӧ�����ݼ�
*@date 2003-08-04
*/
function DelGridRow(dsGrid, callback) {
    if (NotCanSave()) return;
    var ret = window.confirm("ȷ��ɾ����ǰ����");
    if (ret == false) {
        return;
    }

    if (arguments.length == 0) {
        dsGrid = dssub1;
    }
    var sTable = dsGrid.getAttribute("savetable");
    var arr = MultiKeyTmp(dsGrid);
    var sWhere = ""; //ƴupdate�����where�Ӿ�
    //alert(dsGrid.RecNo)
    sWhere = MultiKeyWhere(arr, dsGrid.RecNo, dsGrid);
    //alert(sWhere)
    if (IsSpace(sWhere)) {    //Ϊ��ʱΪ�˼���ȡ���ؼ��ֶε�������
        alert("û���������ݼ�: " + dsGrid.id + " �������ֶ�!");
        return;
    }
    var sXml = "<delete tableName='" + sTable + "' ><where>" + sWhere + "</where></delete>";

    //2011-08-15 ����ɨ���ӱ�.����,��ɾ��.
    if (arr.length == 1) {  //һ���ֶ�������ʱ
        var oo = NavJs.getDatasetArr();
        var l = oo.length;
        for (var j = 0; j < l; j++) {
            var oDs = oo[j];

            if (IsSpace(oo[j].getAttribute("masterds")) == false && oo[j].getAttribute("masterds") == oDs.id && IsSapce(oDs.getAttribute("savetable")) == false && IsSpace(oDs.getAttribute("masterdsfield")) == false && IsSpace($id(oDs.getAttribute("masterds")).Field(oDs.getAttribute("masterdsfield")).Value) == false) {
                var quot = "";
                if (oDs.Field(oDs.getAttribute("subdsfield")).DataType == "�ַ�") quot = "'";

                sXml += "<delete tableName='" + oDs.getAttribute("savetable") + "' ><where>" + +oDs.getAttribute("subdsfield") + "=" + quot + $id(oDs.getAttribute("masterds")).Field(oDs.getAttribute("masterdsfield")).Value + quot + "</where></delete>";
            }

        }

    }

    doSaveData(sXml, function() { dsGrid.Delete(); if (typeof (callback) == "function") callback(); });


}
/**
* ������ǵķ�ʽ��ɾ����¼,deleteMark=1
* 2010-09-16
**/
function MarkDelRow(dsGrid, callback) {
    MarkDelRec(dsGrid,"",function(){ dsGrid.Delete(); if (typeof (callback) == "function") callback();});
}
function MarkDelRec(dsGrid,markExp,callback) {
    ///�Ա�Ƿ�ʽɾ����ֻ�������ݿ��еļ�¼��markExp = "deleteMark=1" ����ָ����Ƿ�ʽ��������ĸ��ֶΡ� 2012-08-23
    //if (NotCanSave()) return;
    var ret = window.confirm("ȷ��ɾ����ǰ����");
    if (ret == false) {
        return;
    }
    if(IsSpace(markExp)) markExp = "deleteMark=1"; //��Ĭ��ֵ
    
    var sTable = $id(dsGrid.id).getAttribute("savetable");
    var arr = MultiKeyTmp(dsGrid);
    var sWhere = ""; //ƴupdate�����where�Ӿ�
    sWhere = MultiKeyWhere(arr, dsGrid.RecNo, dsGrid);
    if (IsSpace(sWhere)) {    
        alert("û���������ݼ�: " + dsGrid.id + " �������ֶ�!");
        return;
    }
    var sXml = "<update tableName='" + sTable + "' ><set>" + markExp + "</set><where>" + sWhere + "</where></update>";
    if (markExp == "ֱ��ɾ��") sXml = "<delete tableName='" + sTable + "' ><where>" + sWhere + "</where></delete>"; //����ֱ��ɾ����¼�Ĺ��ܣ�2013-08-15
    //alert(sXml)
    doSaveData(sXml, callback);

}
function MultiMarkDelRec(dsGrid, markExp, callback) {
    ///�Ա�Ƿ�ʽɾ����ֻ�������ݿ��еļ�¼��markExp = "deleteMark=1" ����ָ����Ƿ�ʽ��������ĸ��ֶΡ� 2012-08-24
    //if (NotCanSave()) return;
    if (IsSpace(markExp)) markExp = "deleteMark=1"; //��Ĭ��ֵ

    var sTable = $id(dsGrid.id).getAttribute("savetable");
    var arr = MultiKeyTmp(dsGrid);
    var sWhere = ""; //ƴupdate�����where�Ӿ�
    var sb = new Sys.StringBuilder();
    for (var i = dsGrid.RecordCount - 1; i >= 0; i--) {
        if (dsGrid.oDom.documentElement.childNodes[i].getAttribute("isSel") != 1) continue;
        sWhere = MultiKeyWhere(arr, i, dsGrid);
        if (IsSpace(sWhere)) {
            alert("û���������ݼ�: " + dsGrid.id + " �������ֶ�!");
            return;
        }
        if (markExp == "ֱ��ɾ��") {
            sb.append("<delete tableName='" + sTable + "' ><where>" + sWhere + "</where></delete>"); //����ֱ��ɾ����¼�Ĺ��ܣ�2013-08-15
        } else {
            sb.append("<update tableName='" + sTable + "' ><set>" + markExp + "</set><where>" + sWhere + "</where></update>");
        }
    }
    if (sb.isEmpty()) {
        alert("û��ѡ��Ҫɾ�����У�");
        return;
    } else {
        var ret = window.confirm("ȷ��ɾ����");
        if (ret == false) {
            return;
        }

        doSaveData(sXml, callback);
    }
}
/**
*����ɾ�������ѡ��ļ�¼
*@param dsGrid ����Ӧ�����ݼ�
*@param iMultiSelCol ��ѡ���򹴣��������ݼ��е�˳��š�Ĭ��Ϊ0,
*@date 2006-11-20
*/
function MultiDelGridRow(dsGrid, iMultiSelCol, callback) {
    if (NotCanSave()) return;
    var ret = window.confirm("ȷ��ɾ����");
    if (ret == false) {
        return;
    }

    if (arguments.length == 0) {
        dsGrid = dssub1;
    }
    if (typeof iMultiSelCol == "undefined") iMultiSelCol = 0;

    var sTable = $id(dsGrid.id).getAttribute("savetable");
    var arr = MultiKeyTmp(dsGrid);
    var sWhere = ""; //ƴupdate�����where�Ӿ�
    //alert(dsGrid.RecNo)
    var l = dsGrid.oDom.documentElement.childNodes.length - 1;
    for (var i = 0; i < l; i++) {
        //ѡ�����ڵ�0��.
        if (NavJs.getNodeValue11(dsGrid.oDom,i,iMultiSelCol) == "��") {
            var sWhere1 = MultiKeyWhere(arr, i, dsGrid);
            if (isSpace(sWhere1) && IsSpace(fcpubdata.area.getAttribute("keyfield"))) {    //Ϊ��ʱΪ�˼���ȡ���ؼ��ֶε�������
                var sdjbh = NavJs.getNodeValue11(dsGrid.oDom,i,dsGrid.FieldNameToNo(fcpubdata.area.getAttribute("keyfield"))); //dsGrid.Field(fcpubdata.area.keyfield).Value;

                var sQuot = "'";
                if (dsGrid.Field(fcpubdata.area.getAttribute("keyfield")).DataType == "����" || dsGrid.Field(fcpubdata.area.getAttribute("keyfield")).DataType == "ʵ��") {
                    sQuot = "";
                }
                sWhere1 = fcpubdata.area.getAttribute("keyfield") + "=" + sQuot + sdjbh + sQuot;
            }
            if (IsSpace(sWhere1) == false) {
                sWhere += "(" + sWhere1 + ") or ";
            }
        }
    }
    if (sWhere != "") {
        sWhere = sWhere.substring(0, sWhere.length - 3);
    }
    if (sWhere == "") {
        alert("���ѡ��Ҫɾ���ļ�¼!");
        return;
    }
    var sXml = "<delete tableName='" + sTable + "' ><where>" + sWhere + "</where></delete>";
    //alert(sXml);
    doSaveData(sXml, function() { dsGrid.Open(); if (typeof (callback) == "function") callback(); });

}
/**
*������������еı༭���
*@date 2004-03-22
**/
function ClearEditTag(oDs) {
//    var oList = oDs.oDom.documentElement.selectNodes("/root/tr[@rowstate='add' || @rowstate='edit']");
//    if (oList != null) {
//        for (var iList = 0; iList < oList.length; iList++) {
//            oList[iList].setAttribute("rowstate", "");
//        }
//    }
    var len = oDs.oDom.documentElement.childNodes.length;
    for (var i = 0; i < len - 1; i++) {
        oDs.oDom.documentElement.childNodes[i].setAttribute("rowstate", "");
    }
    oDs.DeletedData = "";
}
/**
�����ݼ��еĶ��������õõ�where�Ӿ�

*@date 2004-03-22
**/
function MultiKeyTmp(dssub1) {
    var arr = new Array();
    var xmlFields = dssub1.format;
    var oXml = SetDom(xmlFields);
    var oList = oXml.documentElement.selectNodes("//field[primarykey='��']");
    for (var iList = 0; iList < oList.length; iList++) {
        var sFieldName = NavJs.textContent(oList[iList].childNodes[0]);
        var no = dssub1.FieldNameToNo(sFieldName);
        arr[iList] = no;
    }
    return arr;

}
/**
*@param curRecNo ��¼��
oneRecordXml xml��ʽ��һ�м�¼
**/
function MultiKeyWhere(arr, curRecNo, dssub1, oneRecordXml) {
    var oneRecord = oneRecordXml;
    if (typeof (oneRecord) == "undefined") oneRecord = dssub1.oDom.documentElement.childNodes[curRecNo];
    var sWhere = "";
    for (var i = 0; i < arr.length; i++) {
        var sQuot = "'";
        var sQuotEnd = "'";
        if (NavJs.textContent(dssub1.oDataField.childNodes[arr[i]].childNodes[1]) == "����" || NavJs.textContent(dssub1.oDataField.childNodes[arr[i]].childNodes[1]) == "ʵ��") {
            sQuot = "";
            sQuotEnd = "";
        }
        if (NavJs.textContent(dssub1.oDataField.childNodes[arr[i]].childNodes[1]) == "����" && fcpubdata.databaseTypeName == "oracle") {
            sQuot = "to_date('";
            sQuotEnd = "','yyyy-mm-dd')";
        }
        var sValue = NavJs.textContent(oneRecord.childNodes[arr[i]]);
        if (sQuot == "" && sQuotEnd == "" && sValue == "") sValue = "0";

        sWhere += NavJs.textContent(dssub1.oDataField.childNodes[arr[i]].childNodes[0]) + "=" + sQuot
		 		+ sValue + sQuotEnd + " and ";
    }
    if (sWhere != "") {
        sWhere = sWhere.substring(0, sWhere.length - 4);
    }
    return sWhere;
}

//================================================================================================================================


function refreshUpGrid(){
    ///�����,ˢ����һ���ڵ�grid
    if (IsSpace(fcpubdata.obj) == false){
        var sTagName = fcpubdata.obj.tagName;
        if (IsSpace(sTagName)) {
            var oHtml = $id(fcpubdata.obj.id);
            if(!IsSpace(oHtml))
                sTagName = oHtml.tagName;
        }
        if(!IsSpace(sTagName) && (sTagName.toLowerCase() == "dataset" || sTagName.toLowerCase() == "fc:dataset")){
	        var isAdd = parent.piAction == 1;//IsSpace(fcpubdata.keyValue);
	        if(isAdd)
		        fcpubdata.obj.Append();
	        else
		        fcpubdata.obj.bEdit = true;
		    var oDsMain = $obj(fcpubdata.dsMain);
    	    if(oDsMain != null)
	            copydataset(oDsMain,fcpubdata.obj);
	        fcpubdata.obj.fset_cont();	
	        fcpubdata.obj.Update();
	    }
	}
	CloseBill();
}

function deletedDataToSql(oDs){
///��ɾ����¼������������SQL���
    if(IsSpace(oDs.DeletedData)) return "";
    var sb = new Sys.StringBuilder();
    var sTable=oDs.getAttribute("savetable");
    var arr = MultiKeyTmp(oDs);
    //alert("key1:" + oDs.DeletedData)
    var oDelXml = SetDom("<root>"+oDs.DeletedData+"</root>");
    for(var i=0;i<oDelXml.documentElement.childNodes.length;i++){
        var sWhere=MultiKeyWhere(arr,1,oDs,oDelXml.documentElement.childNodes[i]); //�˴���1��Ϊ����ֵ,Ϊ���õĲ���
        if(IsSpace(sWhere)){    //Ϊ��ʱΪ�˼���ȡ���ؼ��ֶε�������
            throw "û���������ݼ�: "+oDs.id+" �������ֶ�!";
        }
        sb.append("<delete tableName='"+sTable+"' ><where>"+sWhere+"</where></delete>");
    }
    return sb.toString();
}

function doSaveData(sXml,callback){
///ִ����SQL�ı����������,��insert update delete ��洢����
    //ȡҪ���浽������Դ��Ϣ
    var datasourceMsg = "";
    if (IsSpace(fcpubdata.area) == false && IsSpace(fcpubdata.area.getAttribute("submitDsn")) == false) datasourceMsg = "&datasourceName=" + fcpubdata.area.getAttribute("submitDsn");

    //���ϸ��ڵ��ϵ�����
    var sRoot = "<root";
    if(fcpubdata.submitUserType != null) sRoot += " userType=\""+fcpubdata.submitUserType+"\"";
    if (fcpubdata.submitPubParam != null) sRoot += " pubParam=\"" + fcpubdata.submitPubParam + "\"";

    sRoot +=">";
    if (typeof (callback) == "function") {
        new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=doSaveData" + datasourceMsg, sRoot + sXml + "</root>", function(result) {
            var ret = result.value;
            if (ret != "") { //������
                alert(ret);
                return;
            }
            if (typeof (callback) == "function") callback();
        }, null, "noRoot");
    } else { //ͬ������
        var ret = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=doSaveData" + datasourceMsg, sRoot + sXml + "</root>", null, null, "noRoot");
        if (ret != "") { //������
            alert(ret);
        }

    }
}
function doSubmitData(callback) {
    
    fcpubdata.logger().debug("submitdata start!", arguments.callee);
    ///����Ҫ�ύ������, 2009-05-11 add
    try{
        var sTmpErrMsg = validAllForm();
        if (sTmpErrMsg != "") return sTmpErrMsg;
    } catch (e) {
        fcpubdata.logger().error("validAllForm() err!", arguments.callee, e);

    }
    //alert(dssub1.Field("product_name").Value+":")
    //ȡҪ���浽������Դ��Ϣ
    var datasourceMsg = "";
    if (IsSpace(fcpubdata.area) == false && IsSpace(fcpubdata.area.getAttribute("submitDsn")) == false) datasourceMsg = "&datasourceName=" + fcpubdata.area.getAttribute("submitDsn");
    
	var oo= NavJs.getDatasetArr();
	var l = oo.length;
	var o = new Array(l);
	if(l <= 0) return "����û�����ݼ�!";

	for(var ii=0;ii<l;ii++){
		o[ii] = oo[ii];
	}
	o.sort(cmpdataset);
	
	var oDss=new Array();
	var oDsSub=new Array();
	var j=0,jj=0;
	for(var ii=0;ii<l;ii++){
	    if (o[ii].getAttribute("submittype") == 4) continue; //4 ��ʾ���ύ
	    var oDsJs = $obj(o[ii].id);
        try{
            var sRetErr = oDsJs.Update();
            if (sRetErr != "") return sRetErr;
        } catch (e) {
            fcpubdata.logger().error("ds.Update() err! "+o[ii].id, arguments.callee, e);

        }
        //��֤��gridʧȥ�����ǿ�д��������.
        try{
            var sTmpErrMsg = validDsGrid(oDsJs);
            if (sTmpErrMsg != "") {
                return sTmpErrMsg;
            }
        } catch (e) {
            fcpubdata.logger().error("validDsGrid() err! "+o[ii].id, arguments.callee, e);

        }
        
        if(IsTrue(o[ii].getAttribute("issubds"))){
            var oDsMaster = $id(o[ii].getAttribute("masterds"));
            if (oDsMaster == null) return o[ii].id + "�������ݼ� " + o[ii].getAttribute("masterds") + " ������!";
            oDsMaster.setAttribute("isMasterDs", "��");
            oDsMaster.setAttribute("subdsfield",o[ii].getAttribute("masterdsfield")) ;
            oDsSub[jj]=o[ii];
            jj++;

            try{
                oDsJs.ReSum(); //����������ֶ�
            } catch (e) {
                fcpubdata.logger().error(o[ii].id+"�������ֶμ���ʱ����! " , arguments.callee, e);

            }
            
        }else{
            oDss[j]=o[ii];
            j++;
        }

    }
    
    //������Ŀؼ��ϵ�ֵ�Ƿ�����ݼ��ϵ�ֵһ�� 2011-03-16
    var tmpRet = checkContValue(fcpubdata.controls["text"]);
    if (tmpRet != null) return tmpRet;
    var tmpRet = checkContValue(fcpubdata.controls["textarea"]);
    if (tmpRet != null) return tmpRet;
    var tmpRet = checkGridValue();
    if (tmpRet != null) return tmpRet;

    
    
    //���ϸ��ڵ��ϵ�����
    var sRoot = new Sys.StringBuilder("<root");
    if(fcpubdata.submitUserType != null) sRoot.append(" userType=\""+fcpubdata.submitUserType+"\"");
    if(fcpubdata.submitPubParam != null) sRoot.append(" pubParam=\""+fcpubdata.submitPubParam+"\"");

    if (new Eapi.Upload().isHave()) { //@fhj 2011-05-30
        if (IsSpace($id("upload1").getAttribute("uploadType")) == false) {
            sRoot.append(" uploadType=\"" + $id("upload1").getAttribute("uploadType") + "\"");
        }
    }
    
    sRoot.append(">");
    
    var sb=new Sys.StringBuilder();
	for(var ii=0;ii<j;ii++){
        var sErr = doSubmitDataOne($obj(oDss[ii].id),sb,false);	    
        if(IsSpace(sErr) == false) return sErr;
	    if(oDss[ii].getAttribute("isMasterDs") == "��"){
	        for(var k=0;k<jj;k++){
	            if(oDsSub[k].getAttribute("masterds") == oDss[ii].id){
                    sErr = doSubmitDataOne($obj(oDsSub[k].id),sb,false);
                    if(IsSpace(sErr) == false) return sErr;
	            }
	        }
	    }
	}
	
	if (sb.isEmpty()) return "û��Ҫ�ύ������!";
	sRoot.append(sb);
	sRoot.append("</root>");
	var sXml = sRoot.toString();
	
    //CopyToPub(sXml);
	fcpubdata.logger().debug("doSubmitData before! " + sXml, arguments.callee);
	if (typeof (callback) == "function") {
	    var ret = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=doSubmitData" + datasourceMsg, sXml, function(result) {
	        var ret = result.value;
	        _save_after(ret, callback);
	    }, null, "noRoot");
	} else {
	    var ret = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=doSubmitData" + datasourceMsg, sXml, undefined, null, "noRoot");
	    return _save_after(ret, callback);

	}
	
    return "";

    function _save_after(ret,callback) {
        fcpubdata.logger().debug("doSubmitData after! " + ret, arguments.callee);
        var oXml = SetDom(ret);
        if (oXml.documentElement == null) {
            if (typeof (callback) == "function") alert(ret);
            return ret;
        }
        try {
            for (var i = 0; i < oXml.documentElement.childNodes.length - 1; i++) {
                var oNode = oXml.documentElement.childNodes[i];
                
                var oDs = $obj(oNode.nodeName);
                
                ClearEditTag(oDs);

                
                if (IsSpace(NavJs.textContent(oNode))) continue;
                //��д�²����������ֶε�ֵ
                var keyfieldNo = oNode.getAttribute("keyfieldno");
                var sRetNo = oDs.getAttribute("retno");
                if (IsSpace(sRetNo)) sRetNo = oDs.RecNo + "";
                var arr = sRetNo.split(",");
                var arrValue = NavJs.textContent(oNode).split(",");
                
                for (var j = 0; j < arr.length; j++) {
                    NavJs.textContent(oDs.oDom.documentElement.childNodes[arr[j]].childNodes[keyfieldNo],arrValue[j]);
                }
                
                //Ҫͬ��fset��grid����ɢ�ؼ�.
                oDs.dset_cont();
                oDs.dset_fset();
                oDs.fset_cont1();
                oDs.bAdd = false;
                oDs.bEdit = false;
                //-------------------
            }
        } catch (e) {
            fcpubdata.logger().error("doSubmitData after err!", arguments.callee, e);

        }
        
        //�ص��������Դ�һ������,���������һ��XML�Ľڵ�,�ڵ�����װ�û�����ķ���ֵ,�ڱ���ʱ,��������û��ĺ�̨����,��������Ҫ����ֵ��ǰ̨,�������ֵ��ͨ���������������.
        if (typeof (callback) == "function") {
            try {
                callback(oXml.documentElement.childNodes[oXml.documentElement.childNodes.length - 1]);

            } catch (e) {
                fcpubdata.logger().error("doSubmitData after callback run err!", arguments.callee, e);

            }

        }
        fcpubdata.logger().debug("submitdata end!", arguments.callee);
    
    
    }

    function cmpdataset(a, b) {
        return parseInt(a.submitno) - parseInt(b.submitno);
    }
    function checkContValue(arrCont) {
        if (IsSpace(arrCont)) return null;
        var len = arrCont.length;
        for (var kk = 0; kk < len; kk++) {
            if (IsSpace(arrCont[kk].getAttribute("dataset")) || IsSpace(arrCont[kk].getAttribute("field"))) break;
            var oDs = $obj(arrCont[kk].getAttribute("dataset"));
            var value1 = arrCont[kk].value;

            if (oDs.Field(arrCont[kk].getAttribute("field")).DataType == "�ı�" || oDs.Field(arrCont[kk].getAttribute("field")).DataType == "ͼ��") break;

            if (arrCont[kk].tagName.toUpperCase() == "TEXTAREA") { // 2011-05-13
                value1 = RepStr(value1, "\r\n", "&#13;&#10;");
                value1 = RepStr(value1, "\t", "&#9;");
            }
            var value2 = oDs.Field(arrCont[kk].getAttribute("field")).Value;
            if (Trim(value1) != Trim(value2)) {
                var value3 = oDs.fset_contall(oDs.Field(arrCont[kk].getAttribute("field")));
                if(Trim(value1) != Trim(value3))
                    return "�ؼ� " + arrCont[kk].id + " ��ֵ=" + value1 + " �������󶨵����ݼ����ֶ� " + oDs.Field(arrCont[kk].getAttribute("field")).DisplayLabel + " ��ֵ=" + value2 + " ��һ��!"; 
            }
        }
        return null;
    
    }
    function checkGridValue() {
        //CopyToPub(dssub1.xml);
        var arrCont = fcpubdata.controls["grid"];
        if (IsSpace(arrCont)) return null;
        var len = arrCont.length;
        for (var kk = 0; kk < len; kk++) {
            if (IsSpace(arrCont[kk].getAttribute("dataset"))) break;

            var dsGrid = $obj(arrCont[kk].getAttribute("dataset"));
            var l = dsGrid.oDom.documentElement.childNodes.length - 1;
            var cols = arrCont[kk].Cols;
            
            for (var i = 0; i < l; i++) {
                if (dsGrid.oDom.documentElement.childNodes[i].getAttribute("rowstate") != "add" && dsGrid.oDom.documentElement.childNodes[i].getAttribute("rowstate") != "edit") continue;
                for (var j = 1; j < cols; j++) {
                    var value1 = arrCont[kk].tab.rows[arrCont[kk].FixRows + i].cells[j].innerText;
                    //alert(value1 + ":" + arrCont[kk].tab.rows(arrCont[kk].FixRows + i).cells(j).innerText+":")
                    var iNo = ToInt(arrCont[kk].tab.childNodes[0].childNodes[j].getAttribute("dsfield"));
                    //                    var value2 = NavJs.getNodeValue11(dsGrid.oDom,i,iNo);
                    //alert(NavJs.getNodeValue11(dsGrid.oDom, i, iNo) + ":" + dsGrid.oDom.documentElement.childNodes(i).childNodes(iNo).text+":")
                    var value2 = dsGrid.oDom.documentElement.childNodes(i).childNodes(iNo).text;
                    if (Trim(value1) != Trim(value2)) {
                        var value3 = dsGrid.fset_contall(dsGrid.Field(iNo), value2);
                        //alert(value1+":"+value2+":"+value3+":")
                        if (Trim(value1) != Trim(value3))
                            return "grid�ؼ� " + arrCont[kk].id + "��:" + i + "��:" + j + "��ֵ=" + value1 + " �������󶨵����ݼ��ϵ�ֵ=" + value2 + " ��һ��!";
                    }
                    
                }
            }
        }
        return null;

    }        

}
function doSubmitDataOne(oDs, sb,isExport) {
    
        if (isExport == false) {
            var xmlRet = doSaveBeforeFieldTrans(oDs);
            //if (IsSpace(xmlRet)) return ""; //ȥ�����У��Ա㵱û��Ҫ�ύ�ļ�¼ʱҲ���ύ���ݼ��Ľṹ����,�������ܴ����ӱ��ɾ����¼��
            sb.append("<" + oDs.id + ">");
            sb.append(xmlRet);
        } else {
            sb.append("<" + oDs.id + ">");
        }
        sb.append("<set>");
        sb.append(doSubmitConfig(oDs, isExport));

        try { } catch (e) {
    
        return e.description;
    }
    sb.append(NavJs.xml(oDs.oDataField));
    sb.append("</set>");
    sb.append("</" + oDs.id + ">");

    function doSaveBeforeFieldTrans(oDs) {
        //alert(oDs.getAttribute("fieldtrans"))
        //alert(oDs.fieldtrans)

        ///����Ҫ����Keyֵ���к�,�����ֶα���ǰת��
        var xmlRet = new Sys.StringBuilder();
        var isNotTrans = IsSpace(oDs.getAttribute("fieldtrans"));
        var countType = "����";
        if (oDs.getAttribute("submittype") == 3) {
            countType = "�仯";
        } else if (oDs.getAttribute("submittype") == 5) {
            countType = "����";
        } else if (oDs.getAttribute("submittype") == 1) {
            if (oDs.getAttribute("isMasterDs") != "��") {
                countType = "�仯";
            }
        }
        if (countType == "����") {
            //if (isNotTrans) {
            //    xmlRet.append(NavJs.xml(oDs.oDom.documentElement.childNodes[oDs.RecNo]));
            //} else {
                addOneRow(xmlRet, oDs, -1);
            //}
        } else {
            var retNo = new Sys.StringBuilder();
            var iKeyFieldNo = oDs.getKeyFieldNo();
            var ll = oDs.RecordCount;
            var isHaveRec = false;
            for (var ii = 0; ii < ll; ii++) {
                var oRowXml = oDs.oDom.documentElement.childNodes[ii];
                var rState = oRowXml.getAttribute("rowstate");
                if (rState == "new") continue; //ǿ������������δ�޸Ĺ�,����
                if (countType == "�仯" && rState != "add" && rState != "edit") continue;
                if (oDs.getAttribute("idtype") == 1 || oDs.getAttribute("idtype") == 2 || oDs.getAttribute("idtype") == 3 || oDs.getAttribute("idtype") == 6 || oDs.getAttribute("idtype") == 8) {
                    if (iKeyFieldNo >= 0) {
                        if (IsSpace(NavJs.textContent(oRowXml.childNodes[iKeyFieldNo]))) {
                            retNo.append(ii + ",");
                        }
                    } else {
                        var sErrMsg = oDs.id + "û���������ֶ�!";
                        fcpubdata.logger().error(sErrMsg, arguments.callee);
                        throw new Error(sErrMsg);
                    }
                }
                isHaveRec = true;
                //if (isNotTrans) {
                //    xmlRet.append(NavJs.xml(oRowXml));
                //} else {
                    addOneRow(xmlRet, oDs, ii);
                //}

            }
            if (isHaveRec == false) {
                return "";
            }
            var sRetNo = retNo.toString();
            oDs.retno = sRetNo.substring(0, sRetNo.length - 1); //Ҫ����Keyֵ���кű��浽 oDs.retno ��
        }
        return xmlRet;

        function addOneRow(xmlRet, oDs, rowNo) {
            xmlRet.append("<tr>");
            for (var i = 0; i < oDs.FieldCount; i++) {
                xmlRet.append("<td>");
                xmlRet.append(RepXml(oDs.fieldTrans(i, rowNo)));
                xmlRet.append("</td>");
            }
            xmlRet.append("</tr>");

        }
    }

}

function doSubmitConfig(oDs, isExport) {
    var xmlRet = new Sys.StringBuilder("<submitconfig>");
    xmlRet.append("<savetable>");
    if (IsSpace(oDs.getAttribute("savetable")) == false) xmlRet.append(oDs.getAttribute("savetable"));
    xmlRet.append("</savetable>");
    xmlRet.append("<key>");
    xmlRet.append("<idtype>");
    if (IsSpace(oDs.getAttribute("idtype")) == false) xmlRet.append(oDs.getAttribute("idtype"));
    xmlRet.append("</idtype>");
    xmlRet.append("<idparam>");
    if (IsSpace(oDs.getAttribute("idparam")) == false) xmlRet.append(oDs.getAttribute("idparam"));
    xmlRet.append("</idparam>");
    xmlRet.append("<retno>");
    if (IsSpace(oDs.getAttribute("retno")) == false) xmlRet.append(oDs.getAttribute("retno"));
    xmlRet.append("</retno>");
    xmlRet.append("</key>");
    xmlRet.append("<relation>");
    xmlRet.append("<type>");
    var sType = "��";
    if (oDs.getAttribute("isMasterDs") == "��") sType = "��";
    if (IsTrue(oDs.getAttribute("issubds"))) sType = "��";
    xmlRet.append(sType);
    xmlRet.append("</type>");
    xmlRet.append("<field>");
    if (IsSpace(oDs.getAttribute("subdsfield")) == false) xmlRet.append(oDs.getAttribute("subdsfield"));
    xmlRet.append("</field>");
    xmlRet.append("</relation>");
    //�����û��Զ������ݼ���ȫ�ֱ���ֵ.
    if (typeof (oDs.getAttribute("pubVars")) != "undefined") {
        xmlRet.append("<pubVars>");
        xmlRet.append(oDs.getAttribute("pubVars"));
        xmlRet.append("</pubVars>")
    }
    if (isExport == false) {
        var sDeletedData = deletedDataToSql(oDs);

        var sUploadSave = doUploadSave(oDs.id);
    }
    //�����¼���
    if (typeof (oDs.getAttribute("eventSaveDsBefore")) != "undefined" || IsSpace(sDeletedData) == false) {
        xmlRet.append("<eventSaveDsBefore>");
        if (typeof (oDs.getAttribute("eventSaveDsBefore")) != "undefined") xmlRet.append(oDs.getAttribute("eventSaveDsBefore"));
        if (IsSpace(sDeletedData) == false) xmlRet.append(sDeletedData);
        xmlRet.append("</eventSaveDsBefore>")
    }
    if (typeof (oDs.getAttribute("eventSaveDsAfter")) != "undefined") {
        xmlRet.append("<eventSaveDsAfter>");
        xmlRet.append(oDs.getAttribute("eventSaveDsAfter"));
        xmlRet.append("</eventSaveDsAfter>")
    }
    if (typeof (oDs.getAttribute("eventSaveRecordBefore")) != "undefined") {
        xmlRet.append("<eventSaveRecordBefore>");
        xmlRet.append(oDs.getAttribute("eventSaveRecordBefore"));
        xmlRet.append("</eventSaveRecordBefore>")
    }
    if (typeof (oDs.getAttribute("eventSaveRecordAfter")) != "undefined" || IsSpace(sUploadSave) == false) {
        xmlRet.append("<eventSaveRecordAfter>");
        if (IsSpace(sUploadSave) == false) xmlRet.append(sUploadSave);
        if (typeof (oDs.getAttribute("eventSaveRecordAfter")) != "undefined") xmlRet.append(oDs.getAttribute("eventSaveRecordAfter"));
        xmlRet.append("</eventSaveRecordAfter>")
    }

    if (isExport) {
		xmlRet.append("<import>");
		if(IsSpace(oDs.getAttribute("importTrans"))==false) xmlRet.append(unescape(oDs.getAttribute("importTrans")));
		if(IsSpace(oDs.getAttribute("importType"))==false) xmlRet.append("<type>"+oDs.getAttribute("importType")+"</type>");
		xmlRet.append("</import>");
		
        xmlRet.append("<export>");
        xmlRet.append("<fields>");
        var len = 0;
        var oXmlTrans = SetDom(oDs.getAttribute("fieldtrans"));
        if (oXmlTrans.documentElement != null) len = oXmlTrans.documentElement.childNodes.length;
        for (var j = 0; j < oDs.oDataField.childNodes.length; j++) {
            var fieldName = NavJs.textContent(oDs.oDataField.childNodes[j].childNodes[0]);
            xmlRet.append("<field>");
            xmlRet.append("<name>");
            xmlRet.append(fieldName);
            xmlRet.append("</name>");
            if (oXmlTrans.documentElement != null) {
                for (var k = 0; k < len; k++) {
                    if (NavJs.getNodeValue11(oXmlTrans,k,0) != fieldName) continue;
                    if (oXmlTrans.documentElement.childNodes[k].childNodes.length > 3 && IsSpace(NavJs.getNodeValue11(oXmlTrans,k,3)) == false)
                        xmlRet.append("<sql>" + NavJs.getNodeValue11(oXmlTrans,k,3) + "</sql>");

                }
                
            }
            xmlRet.append("</field>");            
        }
        xmlRet.append("</fields>");
        if (IsSpace(oDs.getAttribute("datasourceName")) == false) {
            xmlRet.append("<dsn>");
            xmlRet.append(oDs.getAttribute("datasourceName"));
            xmlRet.append("</dsn>");
        }
        if (IsSpace(oDs.getAttribute("opensql")) == false) {
            xmlRet.append("<sql>");
            xmlRet.append(RepXml(oDs.getAttribute("opensql")));
            xmlRet.append("</sql>");
        }
        
        xmlRet.append("</export>");
    }
    
    
    xmlRet.append("</submitconfig>");
    return xmlRet;

    function doUploadSave(dsId) {
        //Ԥ�����ϴ��ؼ�
        if (HaveUpload()) {
            var oDsUpload;
            if (IsSpace($id("upload1").getAttribute("dataset")) == false) {
                oDsUpload = $id($id("upload1").getAttribute("dataset"));
            } else {
                throw "Ӧ���ϴ��ؼ��󶨵����ݼ���";
            }
            if (dsId == $id("upload1").getAttribute("dataset")) {
                return upload_save();
            }
        }

    }
}


function piDelSubTableData(oDs) {
///�������������ӱ���ʱ,��ɾ���ӱ�����м�¼,Ȼ���������Ͻ����ϵ���.���������ķ���ֵ�������ݼ��ı���֮ǰ�¼���.Ȼ�����ͨ�õ��ύ���溯��. 
///�ύ����֮ǰ�Ĵ�����,����ɾ����ǰ�������ӱ�����,oDsΪ�ӱ����ݼ�,����ɾ���ӱ����SQL���
/// 	1 �ҵ�����,where����,������ɾ���ӱ����м�¼�����. ͨ���������ݼ��Ĺ�ϵ�������ҵ��ֶ���,��������ݼ��������ֶ�ֵΪ��,�򷵻�.
/// 	2 �������ݼ������м�¼��rowstateǿ�Ƹ�Ϊ add 
    if(IsSpace(oDs.getAttribute("savetable"))){
        alert("���ݼ� "+oDs.id+" �ı����������Ϊ��!");
        return;
    }    
    if(IsSpace(oDs.getAttribute("subdsfield"))){
        alert("���ݼ� "+oDs.id+" ���Ǵӱ����ݼ�!");
        return;
    }    
    var keyValue = $id(oDs.getAttribute("masterds")).Field(oDs.getAttribute("masterdsfield")).Value;
    if(IsSpace(keyValue)) return; //�����ֶ�ֵΪ������
    var sb = new Sys.StringBuilder();
    sb.append("<delete tableName='" + oDs.getAttribute("savetable") + "' >");
    var quot = "";
    if (oDs.Field(oDs.getAttribute("subdsfield")).DataType == "�ַ�") quot = "'";
    sb.append("<where>"+oDs.getAttribute("subdsfield")+"="+quot+keyValue+quot+"</where></delete>");
    for(var i=0;i<oDs.oDom.documentElement.childNodes.length-1;i++){
        oDs.oDom.documentElement.childNodes[i].setAttribute("rowstate","add");
    }
    oDs.DeletedData=""; 
    return sb.toString();
}
/**
* �������� 2010-12-28 
**/
function doExportData(sFileName,callback) {
    var oo = NavJs.getDatasetArr();
    var l = oo.length;
    var o = new Array(l);
    if (l <= 0) return "����û�����ݼ�!";

    for (var ii = 0; ii < l; ii++) {
        o[ii] = oo[ii];
    }
    o.sort(cmpdataset);
    var oDss = new Array();
    var oDsSub = new Array();
    var j = 0, jj = 0;
    for (var ii = 0; ii < l; ii++) {

        if (IsTrue(o[ii].getAttribute("issubds"))) {
            var oDsMaster = $id(o[ii].getAttribute("masterds"));
            oDsMaster.setAttribute("isMasterDs","��");
            oDsMaster.setAttribute("subdsfield",o[ii].getAttribute("masterdsfield"));
            oDsSub[jj] = o[ii];
            jj++;


        } else {
            oDss[j] = o[ii];
            j++;
        }

    }
    sFileName = RepXml(sFileName);
    //���ϸ��ڵ��ϵ�����
    var sRoot = "<root";
    sRoot += " exportFile=\"" + sFileName + "\"";
    if (fcpubdata.submitUserType != null) sRoot += " userType=\"" + fcpubdata.submitUserType + "\"";
    if (fcpubdata.submitPubParam != null) sRoot += " pubParam=\"" + fcpubdata.submitPubParam + "\"";
    sRoot += ">";

    var sb = new Sys.StringBuilder(sRoot);
    for (var ii = 0; ii < j; ii++) {
        var sErr = doSubmitDataOne($obj(oDss[ii].id), sb, true);
        if (IsSpace(sErr) == false) return sErr;
        if (oDss[ii].getAttribute("isMasterDs") == "��") {
            for (var k = 0; k < jj; k++) {
                if (oDsSub[k].getAttribute("masterds") == oDss[ii].id) {
                    sErr = doSubmitDataOne($obj(oDsSub[k].id), sb, true);
                    if (IsSpace(sErr) == false) return sErr;
                }
            }
        }
    }
    sb.append("</root>");
    var sXml = sb.toString();
    new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=exportData" , sXml, function(result) {
        var ret = result.value;       
        if(IsSpace(ret)){
            if (typeof (callback) == "function") callback();
        }else{
            alert(ret);
        }
    }, null, "noRoot");


    function cmpdataset(a, b) {
        return parseInt(a.submitno) - parseInt(b.submitno);
    }

}
function changeRowSave(oDs, isUp, sortFieldName) {
    ///�����ƶ���ʱҪ�������ݿⱣ�湤����2012-08-23
    if (IsSpace(sortFieldName)) sortFieldName = 'sortno';
    var colNo = oDs.FieldNameToNo(sortFieldName);
    var rowNo = oDs.RecNo;
    var oRoot = oDs.oDom.documentElement;
    if (oRoot.childNodes.length < 2) return; //fhj 2013-03-19 ���һ�����û�м�¼�ͷ���
    
    var sTableName = $id(oDs.id).getAttribute("savetable"); //�������
    var sort1 = oRoot.childNodes[rowNo].childNodes[colNo].text;
    //alert(sort1 + "rowNo=" + rowNo);
    var changeRowNo;
    if (isUp) {
        changeRowNo = rowNo - 1;
        if (changeRowNo < 0) return;
    } else {
        changeRowNo = rowNo + 1;
        if (changeRowNo >= oDs.RecordCount) return;
    }
    var sort2 = oRoot.childNodes[changeRowNo].childNodes[colNo].text;

    var sb = new Sys.StringBuilder();
    //ȡ����where��
    var arr = MultiKeyTmp(oDs);
    sb.append("<update tableName='" + sTableName + "' ><set>" + sortFieldName + "=" + sort2 + "</set><where>" + MultiKeyWhere(arr, rowNo, oDs) + "</where></update>");
    sb.append("<update tableName='" + sTableName + "' ><set>" + sortFieldName + "=" + sort1 + "</set><where>" + MultiKeyWhere(arr, changeRowNo, oDs) + "</where></update>");
    //alert(sb.toString());
    doSaveData(sb.toString());

    oRoot.childNodes[rowNo].childNodes[colNo].text = sort2;
    oRoot.childNodes[changeRowNo].childNodes[colNo].text = sort1;


}
