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
*保存当前单据	
*步骤: 1.从数据集的属性中得到临时表名,
*      2.从数据集的主KEY中得到ID,如ID为空表示增加状态,否则为修改状态.
*      3.调用生成挂帐ID的存储过程getmaxID来得到挂帐ID.
*      4.根据数据集的字段列表进行拼接INSERT 或UPDATE 语句
*      5.执行它进行保存.
*      6.如保存成功,调用表单处理的存储过程.
*      7.删除此挂帐ID的临时表中的记录.
*      8.保存完后,单据处于清空状态.
*@param iTag =1 表示存完盘后关闭窗口 =2 存完盘后不关闭窗口返回
*@param strXmlSql 在同一事务中的前后运行sql语句,用beforesql,aftersql作节点名 
*@return 错误信息或空
保存的方式:
 iTag=undefined : 存完盘后出一提示窗口用于选择打印/新增
 iTag=1 : 存完盘后直接关闭窗口
 iTag=2 : 存完盘后不关闭窗口返回
 iTag=3 : 存完盘后直接进入新增下一张单据界面
 iTag=4 : 只保存到临时表中,临时挂帐,出一个输入临时挂帐名称的输入框.
 			让saveasTable为空,不执行过程,最后不删除临时表的值.
 iTag=5 : 只保存到草稿表中,出一个输入草稿名称
 
 注:草稿表中的字段一定要和另存表中的字段一一对应上,否则就必须重新拼字段列表
 
 
 
**/
function SaveBill(iTag,strXmlSql){
			var d=new Date();
			var t = d.getTime();      
	
	if(NotCanSave()) return "展现状态不能保存";
	//var owin=new Eapi.Str().showWait("正在保存......");
	
	var draftTable="draft";   //草稿主表名
	var draftsubTable="draftsub";   //草稿子表名
	//草稿说明字段名为 draftdesc
	var draftdescValue="" ;	//输入的草稿说明值
	if(iTag==5){
		draftdescValue=window.showModalDialog(fcpubdata.path+"/fceform/common/inputmsg.htm","请输入草稿说明:","status:no;dialogHeight:105px;dialogWidth:470px;dialogTop:180;dialogLeft:250px"); 
	}
	
	var oDsMain = $id(fcpubdata.dsMain);
	if(oDsMain == null ) return "只有表单上含有主数据集控件(就是指没有绑定到表格的数据集控件)时才能保存!";
	var arrImgValue="";  //装图形字段值
	var arrImgName="";	//装图形字段的字段名
	var arrImgChange=""; //装图形字段的改变标识
	var sProcName=fcpubdata.area.runsave;  //表单的处理过程
	var billkeyfield = fcpubdata.area.keyfield ;
	var strRet="";
      var xmlSql=new Sys.StringBuilder() ; //保存整个Sql
      var sInsert="";
      var s1="";
      var gzid="";
      var tmpTable,saveasTable,xmlFields,oXmlField,arrField,kk,sF,tmp_sF,sV,arri,arrRet,sQuot ; 
      if((isSpace(sProcName) == false && fcpubdata.databaseTypeName != "mysql" ) || iTag == 4) {
			gzid = getgzid() ; //取得挂帐ID
			if(gzid==fcpubdata.sendHttpErrMsg) return fcpubdata.sendHttpErrMsg;
      }
  //保存主表--------------------------------------------------------------------
	if(oDsMain.Empty!="null"){
      //如去掉下面两行则checkbox radio不正确
      //oDsMain.cont1_fset();
      //oDsMain.bEdit=true;
      //---------------------------
      
      if(oDsMain.Update()==1) {
      	//new Eapi.Str().showWait("end");
      	return "主数据集不能通过数据校验,保存失败!";  //此处会先提示一下比如非法整数,然后再提示此.
      }
      var sTmpErrMsg = validAllForm();
      if(sTmpErrMsg != "") return sTmpErrMsg;

      tmpTable=oDsMain.temptable;
      saveasTable=oDsMain.saveastable;
	  if(iTag==4)saveasTable="";
      
		//得到要保存的字段数组
		xmlFields = oDsMain.format;
		oXmlField = SetDom(xmlFields)  ;  
		
		arrField = Save_GetFieldArr(oDsMain,oXmlField) ;
		if(arrField == null) {
			return fcpubdata.sendHttpErrMsg ;
		}
        kk = arrField.length ;
      //拼字段列表  
		sF = Save_GetsF(arrField,oXmlField,"主");      
      //拼值列表
      sV="";
      //拼update语句
      var sU="";
        //按数据集的字段列表循环来计算图象字段
        var ltmp = oDsMain.FieldCount ;
        for(var j=0;j<ltmp;j++){
			if(oDsMain.Field(j).DataType=="图象"){
				arrImgValue=oDsMain.Field(j).Value ;   //保存用户所选图象的位置
				arrImgName=oDsMain.Field(j).FieldName;
				arrImgChange=oDsMain.Field(j).valid ;  //当此值为"变"时表示上重新上传
				break;
			}
		}
		 
	  //按可用字段来循环    
	  for(arri=0;arri<kk;arri++){
			i=arrField[arri];
		  
		  
			//oracle的序列ID
			if(fcpubdata.area.idtype == "3" && fcpubdata.keyValue=="" &&  oDsMain.Field(i).FieldName.toUpperCase() == fcpubdata.area.keyfield.toUpperCase()) {
				sV += fcpubdata.area.codeheader + ".nextval," ;
				continue;
			}
		  
			arrRet = Save_GetsVsU(oDsMain,0,i,billkeyfield,sV,sU,"是") ;
			sV = arrRet.sV;
			sU = arrRet.sU;
		  
		}		// end for

	  
      //sInsert="Insert "+tmpTable+" ("+sF+"GZID) Values ("+sV+"'"+gzid+"')"
      //处理主数据集的临时表加字段存盘
      if((isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ) || iTag ==4){
	      //sInsert=TmpTableAddField(tmpTable,sF,sV,gzid);
	      tmp_sF=InsertTmpTableFields(oDsMain);
	      sInsert = "Insert into "+tmpTable+" ("+tmp_sF+"GZID) Values ("+InsertTmpTableSql(oDsMain,oDsMain.RecNo)+"'"+gzid+"')";
	      xmlSql.append("<no>"+repXml(sInsert)+"</no>");
	      
	      if(fcpubdata.area.idtype == "3" && fcpubdata.keyValue==""){ 
	      	
	      	//新增oracle序列字段时要将第二条的insert语句的关键字段值换成:get_keyfield
	      	sV = RepStr(sV,fcpubdata.area.codeheader + ".nextval",":get_keyfield");
	      	
	      }
      }
      if(isSpace(saveasTable)==false){	
      	 if(sV.length>0) sV=sV.substring(0,sV.length-1);
      	 if(sU.length>0) sU=sU.substring(0,sU.length-1);
      	 
      	 
      	 if(fcpubdata.keyValue==""){
         	sInsert="Insert into "+saveasTable+" ("+sF+") Values ("+sV+")";
         }else{
			//my add 处理多字段作主键时的编辑保存
			var sWhere1 = "";
			if (fcpubdata.area.idtype == "5"){
				sWhere1 = MultiKeyWhere(MultiKeyTmp(oDsMain),oDsMain.RecNo,oDsMain);
			} else {
				sQuot="'";
				if(oDsMain.Field(billkeyfield).DataType == "整数" || oDsMain.Field(billkeyfield).DataType == "实数") sQuot="";
				sWhere1 = billkeyfield+"="+sQuot+fcpubdata.keyValue+sQuot;
			}
         	sInsert="Update "+saveasTable+" set "+sU+" where "+ sWhere1;
         }
         xmlSql.append("<no>"+repXml(sInsert)+"</no>");
		 
		 //处理草稿表			
		 if(iTag==5){		    
	     	 sInsert="Insert into "+draftTable+" ("+sF+",draftdesc) Values ("+sV+",'"+draftdescValue+"')";
	         xmlSql.append("<no>"+repXml(sInsert)+"</no>");
		 }

      }
   }

   
	//alert(dssub1.xml)
   //保存子表-------------------------------------------------------------------------

   var oArrGrid=window.document.all.tags("webgrid");
   //多表格循环
   for (var iGrid=0;iGrid<oArrGrid.length;iGrid++){
   	  //只读的表格不保存
   	  if(oArrGrid[iGrid].readonly=="是") continue;
      var dssub1=eval("window."+oArrGrid[iGrid].dataset);
      //指定了不保存时
      if(dssub1.pubpara == "是") continue;

		//从未进入表格的情况下会出错
		/*try {
		    if(oArrGrid[iGrid].txt.style.display == "block" ){
			    oArrGrid[iGrid].hide();
				dssub1.cont_onDataChange();
				dssub1.Update("不检查");
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
    //E表控件的处理
    var arrDss = fcpubdata.controls["dataset"];
    for(var iEbiao=0;iEbiao < arrDss.length;iEbiao++){
        if(arrDss[iEbiao].isSubGrid=="是"){
            if(arrDss[iEbiao].Update() == 1 ) return ; //表示数据检查没有通过.
            if(SaveBillSub(arrDss[iEbiao],billkeyfield,iTag,xmlSql,sProcName ) == false) continue;
        }
    }
	
	if(iTag!=4){
	    //运行处理过程,此过程带两个参数,一个为表单ID用于定位到哪个临时表,一个为挂帐ID用于定位到这次要处理的记录.
	    //采用;分隔,在一个节点中保存存储过程名+表单ID+挂帐ID三个数
	 	if(isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ){
	 		xmlSql.append("<runsave>{ call "+repXml(new Eapi.Str().trim(sProcName))+"(?,?) };"+fcpubdata.area.dj_sn+";"+gzid+"</runsave>");
		}
		//if(isSpace(sProc)==false){
			//调用工作流用的完成过程
		   // xmlSql+="<action>"+repXml(sProc)+"</action>"; //将no ==> action
		   
		//}
		//
		if(isSpace(strXmlSql) == false){  //增加beforesql,aftersql 等额外的sql语句
			xmlSql.append( strXmlSql);
		}
	
	}else{ //仅存临时表
	
		//输入挂帐信息
		var sName=window.showModalDialog(fcpubdata.path+"/fceform/common/inputmsg.htm","请输入挂帐说明:","status:no;dialogHeight:105px;dialogWidth:470px;dialogTop:180;dialogLeft:250px") ;
		/*往billgz表中写一条记录,gzid,挂帐描述,时间,当前操作员,单据类型(三个字母)
		*/
		s1="insert into billgz (gzid,sgzname,sgzdate,semployeeid,sbilltag) values ('"+gzid+"','"+sName+"','"+curDateTime()+"','"+getuser()+"','"+fcpubdata.area.codeheader+"')";
		xmlSql.append("<no>"+s1+"</no>");
	}

	//第一个节点为计算最大单据编号的标识,在后台通过此节点的节点名来区分新增和修改
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
					if(oDsMain.Field(fcpubdata.area.keyfield).DataType == "整数"){
						sidtype = "7"; //表示整形主键
					}
				}
			}
			strHead="<add"+sidtype+">"+fcpubdata.area.codeheader+"</add"+sidtype+">";
		}
	}else {
		//因数字不能作XML的节点名,所以加上一个fc
		strHead="<fc"+fcpubdata.keyValue+">"+fcpubdata.area.codeheader+"</fc"+fcpubdata.keyValue+">";
	}
	//---------------------------------------------------------------------------------   

  strHead += xmlSql.toString();
   var blnOk="";		//存盘成功标识
   var strReturn=""; //函数返回值
   //alert(strHead)
   //CopyToPub(strHead)
   var sRet=djupdate(strHead);
	if(sRet==fcpubdata.sendHttpErrMsg) return fcpubdata.sendHttpErrMsg ;
   
   if(isSpace(sRet)==false){
       strRet= sRet ;
   }    
   if(iTag!=4 && isSpace(sProcName)==false && isSpace(oDsMain.temptable)==false ){
	   xmlSql.clear();
	   //清空临时表
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
   
   //用新的单据编号刷新界面 strRet=新的单据编号
//   if(sRet.substring(0,3)==fcpubdata.area.codeheader || sRet.length<12  ){
   if( sRet.indexOf('错误:') < 0 ){
	//alert(arrImgValue)
		if(arrImgValue!="" && arrImgChange == "变" ){  //&& arrImgValue.substring(0,4)=="file"){
			var stable=fcpubdata.area.mastertable;
			if(IsSpace(stable)) stable=oDsMain.saveastable;
			if(isSpace(stable)){
				var stip1="请设置"+fcpubdata.dsMain+"的保存表名!";
				alert(stip1);
				return stip1;
			}

			var sRet11 = new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?key=writeImage&sTablename="+stable+"&sImgname="+arrImgName+"&sKeyname="+fcpubdata.area.keyfield+"&sKeyvalue="+strRet+"&sKeyname1="+escape(fcpubdata.path)+"&sKeyvalue1="+escape(arrImgValue),"");
			if(IsSpace(sRet11)==false){
				alert(sRet11);
				return sRet11;
			}else{
				oDsMain.Field(arrImgName).valid = ""; //清标志.以免重复保存
			}
			
		}
		//-----------------------------------

		//上传附件的保存
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
	}else {	//显示错误信息
		strReturn=strRet+" 运行的命令为: "+strHead;
        alert(strRet);
        return strReturn;
	}

	//-------------------------------------
	
   	//给单据全局变量,单表输入时没有djbh字段
   try{	
	   fcpubdata.keyValue=oDsMain.Field(fcpubdata.area.keyfield).Value ;  //当DsMain.Empty=="null"出错
	}catch (e){}
	//alert(fcpubdata.keyValue);
	oDsMain.bAdd=false;
	oDsMain.bEdit=false;

	//HideWait(owin)
	
	//new Eapi.Str().showWait("end");
	fcpubdata.isEdit=false ;  //标识当前单据是否改动过的全局变量

	//存完盘后直接关闭窗口
	if(iTag==1){
	    window.returnValue="ok"; //关闭窗口前给一个ok的标志,供前面窗口中判断是保存成功后关闭窗口
		CloseBill();
		return strReturn;
	}
	//存完盘后直接进入新增下一张单据界面
	if(iTag==3){
		AddBill();
		return strReturn;
	}

	//存完盘后不关闭窗口返回
	if(iTag==2){
		return strReturn;
	}

			d=new Date();
			var t1 = d.getTime();
			//alert(t1-t)	  

	
	if(blnOk=="ok"){    //如果保存成功

		//s1=message("","打印 单据","新开 单据","退出 单据");
		//if(s1=="3"){
			//关闭当前单据
			CloseBill();
		
	}
	return strReturn  ;  
}
function SaveBillSub(dssub1,billkeyfield,iTag,xmlSql,sProcName) {
///保存表单的明细表数据集, 2008-07-27 改

		//主从表时，子表可以指定另外的和主表关联的字段名
		if(IsSpace(dssub1.otherkey) ){
			billkeyfield = fcpubdata.area.keyfield ;
		}else{
			billkeyfield = dssub1.otherkey ;  
		}
		
      tmpTable=dssub1.temptable;
      saveasTable=dssub1.saveastable;
	  if(iTag==4)saveasTable="";
      
	/*
 	 主从表的另一种从表修改保存的模式的实现步骤：
 		1 判断是否在数据集中勾了从键字段，如勾上了且pubdjbh不为空才转为此模式。得到从键字段的列号，
 			（只考虑一个从键字段的情况）
 		2 收集现有的从键值组成一个,分隔的列表,用它来生成 delete 的 where 子句,用 not in
 		3 从上到下循环判断,如没有add或edit标记,则生成update, where 原值="";	
 	*/	
 	var sOtherSave = false;
	if(isSpace(saveasTable)==false && fcpubdata.keyValue != "" && fcpubdata.area.OtherSave == "是" ){
		xmlSql.append( SubTableEditSave(dssub1,billkeyfield));
		sOtherSave = true ;
	}else {
	
	  //重算实际计算项
	//	ReAllLineSum(dssub1);
      //处理汇总项字段
	  dssub1.ReSum();


      if(isSpace(saveasTable)==false && fcpubdata.keyValue != "" ){	
          //删除原来的记录
		sQuot="'";
		if(dssub1.Field(billkeyfield).DataType == "整数" || dssub1.Field(billkeyfield).DataType == "实数") sQuot="";          
          sInsert="delete from "+saveasTable+" where "+billkeyfield+"="+sQuot+fcpubdata.keyValue+sQuot;
          xmlSql.append("<no>"+repXml(sInsert)+"</no>");
      }      

	var sSubKeyFieldName = getSubKeyName(dssub1,billkeyfield); //从键字段名
	
		//得到要保存的字段数组
		xmlFields = dssub1.format;
		oXmlField = SetDom(xmlFields)  ;  
		
		arrField = Save_GetFieldArr(dssub1,oXmlField) ;
		if(arrField == null) {
			return false; //continue ; //return fcpubdata.sendHttpErrMsg ;
		}
		kk = arrField.length ;
		sF = Save_GetsF(arrField,oXmlField,"从");
		if((isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ) || iTag ==4){
			tmp_sF=InsertTmpTableFields(dssub1);
		}		
	  var ll= dssub1.RecordCount ;
      for(var ii=0;ii<ll;ii++){
		if(dssub1.oDom.documentElement.childNodes(ii).getAttribute("rowstate") == "new") continue; //强行新增的行且未修改过,不存
         //拼值列表
			sV="";
			for(arri=0;arri<kk;arri++){
				i=arrField[arri];
				arrRet = Save_GetsVsU(dssub1,ii,i,billkeyfield,sV,"","从",sSubKeyFieldName) ;
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
			//处理草稿表
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
*返回挂帐ID
**/
function getgzid() {
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?getRecnum","<no>LGZ</no>");
}

/**
*单据存盘
*@param sSql 要执行的SQL语句
**/
function djupdate(sSql) {
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?djupdate",sSql);
}
/**
*表格数据存盘
*@param sSql 要执行的SQL语句
**/
function savegrid(sSql) {
	return new Eapi.RunAjax().sendHttp(location.protocol+"//"+location.host+ fcpubdata.servletPath + "/WebBill"+fcpubdata.dotnetVersion+"?savegrid",sSql);
}

/**
*处理主数据集的临时表加字段存盘
*当临时表中要存在线SQL语句中不存在的字段时,用临时计算项进行标识,在默认值中给出计算函数.
*这些值只存到临时表中,不存到另存表中.
*@date 2003-09-29
**/
function TmpTableAddField(tmpTable,sF,sV,gzid){
	sF = sF + "," ;
	var oDsMain = $id(fcpubdata.dsMain);
    var sInsert="Insert into "+tmpTable+" ("+sF+"GZID) Values ("+sV+"'"+gzid+"')";

  //计算表达式----------
      //通过dataset format属性找到表达式及字段名
   var sFadd="";
   var sVadd=""   ;
   var s11=oDsMain.format;
   if(isSpace(s11)==false){
	   var oXml=new ActiveXObject("Microsoft.XMLDOM");
	   oXml.async=false;
	   oXml.loadXML (s11);
	   var oList=oXml.documentElement.selectNodes("//field[fieldkind='临时计算项']");
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
*# 删除单据 no use
*      步骤:   1.从主数据集上取到单据编号作ID,表名标识如:JXH0001,由此得到表名.
*              2.拼成一个删除的SQL语句,然后执行.
*              3.成功后,单据处于清空状态.
*      			4.从当前数据集中删除此记录.
**/ 
function DelBill(){
	if(NotCanSave())return;
	var ret = window.confirm("确定删除吗？");		
	if (ret==false) {
		return;
	}   	   
	var oDsMain = $id(fcpubdata.dsMain);
	if(oDsMain == null) {
		alert("请在表单模版上增加一个主数据集控件(指没有绑定到表格控件的数据集控件)后再试此功能");
		return;
	}
   var sTable=fcpubdata.area.mastertable ; //"zhiydoc" //"jxddhz"
   if(isSpace(sTable))sTable=oDsMain.saveastable;
   if(isSpace(sTable)){
      alert("请设置"+fcpubdata.dsMain+"的保存表名!");
      return;
   }
   var sdjbh=oDsMain.Field(fcpubdata.area.keyfield).Value;
     var sInsert="update "+sTable+" set beactive='否'"+" where "+fcpubdata.area.keyfield+"='"+sdjbh+"'";
  
   //alert(sInsert)
   var sRet=fc_insert(sInsert);
   if(isSpace(sRet)==false){
       alert(sRet)	;
   }else {
   	   oDsMain.Delete();
       //成功后,单据处于清空状态.
       AddBill() ;
   }
}
/**
*删除表格上的一行记录,beactive='否'
*@param dsGrid 表格对应的数据集
*@date 2003-08-04
*/
function DelRow(dsGrid){
	if(NotCanSave())return;
	var ret = window.confirm("确定删除当前行吗？");		
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
		alert("请设置表格数据集的另存表名!");
		return;
	}   	
	
	var arr=MultiKeyTmp(dsGrid);
	var sWhere=""; //拼update后面的where子句
	//alert(dsGrid.RecNo)
	sWhere=MultiKeyWhere(arr,dsGrid.RecNo,dsGrid);
	if(isSpace(sWhere)){    //为空时为了兼容取表单关键字段当主键。
	    var sdjbh=dsGrid.Field(fcpubdata.area.keyfield).Value;
		sWhere=fcpubdata.area.keyfield+"='"+sdjbh+"'";
	}

   
//   var sInsert="delete from "+sTable+" where "+fcpubdata.area.keyfield+"='"+sdjbh+"'"
     var sInsert="update "+sTable+" set beactive='否'"+" where "+sWhere;
  
   //alert(sInsert)
   var sRet=fc_insert(sInsert);
   if(isSpace(sRet)==false){
       alert(sRet)	;
   }else {
   	   dsGrid.Delete();
       //成功后,单据处于清空状态.
   }
	
}

/**
  //判断tablename表中是否有fieldname,如有返回true
  比较另存表中的字段和数据集中的字段
**/
function table_have_field1(tablename){
	
  var sXml=dataset_select("select * from "+tablename+" where 1=2",1,1);
  if(sXml==fcpubdata.sendHttpErrMsg) return fcpubdata.sendHttpErrMsg ;
  var oXml=new ActiveXObject("Microsoft.XMLDOM");
  oXml.async=false;
  oXml.loadXML (sXml);
  if(oXml.documentElement == null) {
	alert("很可能是数据库中无"+tablename + "表,或者是select * from "+tablename+" where 1=2 执行出错!");
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
*新的保存表格的函数
*@param sExit=="退出" ,表示执行成功后关闭窗口.
*@param ogridDs grid控件所绑定的数据集对象
*@param strXmlSql 在同一事务中的前后运行sql语句,用beforesql,aftersql作节点名 
*@return 空:表示存盘正确,否则为错误信息.
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
	
	//如需要将表格上的数据送往fset则需要下面这行
//	var oGrid = GetDsGrid(oDs);
//	if(oGrid.txt.style.display != "none"){
//		oDs.cont_onDataChange();
//	}
//		if(oDs.Update()==1) return;  //如未离开当前行则要强行更新.	
    if(typeof(oDs.isSubGrid) == "undefined"){
	    if(DsBeforeSave(oDs)) return;
        var sTmpErrMsg = validDsGrid(oDs);
        if(sTmpErrMsg != "") {
            alert(sTmpErrMsg);
            return sTmpErrMsg;
        }
	}else{ //E表控件中
	    if(oDs.Update() == 1) return;
	}
	var billkeyfield=fcpubdata.area.keyfield; //表单上的KEY字段名
	var sProcName=fcpubdata.area.runsave;  //表单的处理过程    
   
	
	var saveasTable=oDs.saveastable;
	if(isSpace(saveasTable)){
		alert("数据集"+oDs.id+"的保存表名不能为空!");
		return;
	}
    
    
	var tmpTable=oDs.temptable;
	if(isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ){
		var gzid=getgzid();  //取得挂帐ID
		if(gzid==fcpubdata.sendHttpErrMsg)return fcpubdata.sendHttpErrMsg;
		var tmp_sF=InsertTmpTableFields(oDs);
	}	
	//得到要保存的字段数组
	var xmlFields = oDs.format;
	var oXmlField = SetDom(xmlFields)  ;  
	
	var arrField = Save_GetFieldArr(oDs,oXmlField) ;
	if(arrField == null) {
		return fcpubdata.sendHttpErrMsg ;
	}
	var fieldLen = arrField.length ;
	var sF = Save_GetsF(arrField,oXmlField);
	
	
	var arr=MultiKeyTmp(oDs);

    if(fcpubdata.area.idtype == "") fcpubdata.area.idtype = "1"; //默认值
    var arrNewId=new Array(); //记录需要回写ID字段值的行号
    var arrNewIdCount=0;
    var colNoKeyField = 0; //主键字段所处的列号,在数据集XML中的
    if(IsSpace(billkeyfield)){
        if(arr.length>0){
            colNoKeyField = arr[0];
        }else{
            alert("没有设置主键字段,表格上的数据无法保存!");
            return;
        }
    }else{
        colNoKeyField = oDs.FieldNameToNo(billkeyfield);
    }

	var xmlSql=new Sys.StringBuilder();
	var ll = oDs.RecordCount;
	for(var ii=0;ii<ll;ii++){

		//如果此行为新增行
		if(oDs.oDom.documentElement.childNodes(ii).getAttribute("rowstate")=="add" || oDs.oDom.documentElement.childNodes(ii).getAttribute("rowstate")=="edit"){
			var sWhere=""; //拼update后面的where子句
			//拼值列表
			var sV="";
			var sU="";
			for(var arri=0;arri<fieldLen; arri++){
				i=arrField[arri]; //列号
				
				var arrRet = Save_GetsVsU(oDs,ii,i,billkeyfield,sV,sU) ;
				sV = arrRet.sV;
				sU = arrRet.sU;
			}
			if(sV.length>0) sV=sV.substring(0,sV.length-1);
			if(sU.length>0)	sU=sU.substring(0,sU.length-1);
			
	        if(isSpace(saveasTable)==false){	
				sWhere=MultiKeyWhere(arr,ii,oDs);
				var s11111 = "" ;
				if(isSpace(sWhere)){    //为空时为了兼容取表单关键字段当主键。
					try {
						s11111 = oDs.oDom.documentElement.childNodes(ii).childNodes(oDs.FieldNameToNo(billkeyfield)).text ;
					}catch(e){} ;
					sWhere=billkeyfield+"='"+s11111+"'";
				}
				if(isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ){
			 		//插入到临时表
			 		//var sV1=repStr(sV,":get_keyfield",""); //临时表中用空值,以免字段装不下.
					var sInsert="Insert into "+tmpTable+" ("+tmp_sF+"GZID) Values ("+InsertTmpTableSql(oDs,ii)+"'"+gzid+"')";
					xmlSql.append("<no>"+repXml(sInsert)+"</no>");
				}
				
				//判断表中是否存在,如不则新增
				var sHave="存在";
				if(oDs.oDom.documentElement.childNodes(ii).getAttribute("rowstate")=="edit"){
				    var s11=fc_select("select * from "+saveasTable+" where "+sWhere,1,1);
				    if(s11.length<16)sHave="不存在";
                }
				if (sHave=="不存在" || oDs.oDom.documentElement.childNodes(ii).getAttribute("rowstate")=="add" ){
					//序列ID时将 ":get_keyfield" 换成 序列
					if(fcpubdata.area.idtype == "3") {
						sV = RepStr(sV,":get_keyfield",fcpubdata.area.codeheader + ".nextval" );
					}
					//插入到正式表
				    sInsert="Insert into "+saveasTable+" ("+sF+") Values ("+sV+")";
				    var sstmp1=fcpubdata.area.codeheader; //// 当fcpubdata.area.idtype == "1" 时
				    if (isSpace(sstmp1)) sstmp1 = "no"; // 当fcpubdata.area.idtype == "4" or "5" 时
				    //自定义主键字段的值,此处做一个runsave6的标识供后台程序使用
					if(fcpubdata.area.idtype == "3" || fcpubdata.area.idtype == "6" || fcpubdata.area.idtype == "8") { // =8 表示GUID主键
						sstmp1 = "runsave"+fcpubdata.area.idtype+fcpubdata.area.codeheader;
					}else if (fcpubdata.area.idtype == "2"){
						sstmp1 = "runsave2";
					}else if( fcpubdata.area.idtype == "1"  && IsSpace(fcpubdata.keyfield) == false ) {
						if(oDs.Field(fcpubdata.keyfield).DataType == "整数" ){ 
							//此处做一个runsave7的标识供后台程序使用,用于整数最大号主键
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
			    	//真正的修改Update
					 var sUpdate="Update "+saveasTable+" Set "+sU+" where "+sWhere;
				     xmlSql.append("<no>"+repXml(sUpdate)+"</no>");
			    	
				}
		 	}			
		} //end if add	     
	} // end for recordcount
   //运行处理过程,此过程带两个参数,一个为表单ID用于定位到哪个临时表,一个为挂帐ID用于定位到这次要处理的记录.
   //采用;分隔,在一个节点中保存存储过程名+表单ID+挂帐ID三个数
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
		sRet=sRet1+" 运行的命令为: "+xmlSql ;
		alert(sRet);
	}else{
	    //传送后台返回的IDs到XML中.
	    var arrId = sRet1.split(",");
        var i=0;
        while(i<arrId.length-1 && arrNewIdCount > 0 && i< arrNewIdCount ){ //因最后会多一个,号
            oDs.oDom.documentElement.childNodes(arrNewId[i]).childNodes(colNoKeyField).text = arrId[i];
            i++;
        }	 
        //要同步fset和grid及零散控件.
        oDs.dset_cont(); 
        oDs.dset_fset();
        oDs.fset_cont1();
        oDs.bAdd=false;
        oDs.bEdit=false;
        //-------------------
        
		fcpubdata.isEdit=false;   //标识当前单据是否改动过的全局变量	
		ClearEditTag(oDs);
		alert("保存成功！");
	}	
	//清空临时表
	
	if(isSpace(sProcName)==false && fcpubdata.databaseTypeName != "mysql" ){
		
	    sRet1=inserts("<no>"+"delete from "+tmpTable+" where GZID='"+gzid+"'"+"</no>");
		if(isSpace(sRet1)==false){
			alert(sRet1);
		}  	
	}
	if(sExit=="退出"){
	    window.returnValue="ok"; //关闭窗口前给一个ok的标志,供前面窗口中判断是保存成功后关闭窗口
		CloseBill();
	}
	return sRet;
}

/**
*阻止存盘
*@return true 表示不能保存 在savebill delbill savegrid delrow 调用
*@date 2003-12-05
**/
function NotCanSave() {
	if(parent.piAction==3){
		alert("单据展现状态,不能保存!");
		return true;
	}
	return false;
}
/**
*统一的表单保存函数
*@param sExit ="退出" 表示存盘后关闭表单,否则不关闭 
*@return 空:表示正确存盘,否则为错误提示.
*@date 2004-03-24
**/
function DjSave(sExit){
	var sRet="";
	if(sExit=="退出"){
		sRet=SaveBill(1);
	}else if(typeof(sExit) == "undefined"){
		sRet=SaveBill(2);
	}else{ //表示 sExit = xml格式的sql语句.
	    sRet=SaveBill(2,sExit);
	}
	return sRet ;
}
/**
*保存表单成功后提示保存成功.无返回值.
*@date 2006-01-20
**/
function DjSaveShow(){
	var b=DjSave();if(IsSpace(b)){alert('保存成功')}else{alert(b)}
}
/**
*表格保存成功后提示保存成功.无返回值. no use
*@date 2006-01-20
**/
function GridSaveShow(odsgrid){
	var b=GridSave(odsgrid);if(IsSpace(b)){
		//alert('保存成功');
	}else{alert(b)}
}

/**
*单表格数据的保存函数
*@date 2004-11-26
**/
function GridSave(odsgrid,sExit) {
    if(sExit == "退出" || typeof(sExit) == "undefined")
	    return SaveOneGrid(sExit,odsgrid);
    else
        return SaveOneGrid("",odsgrid,sExit); //sExit = xml 格式的sql	    
}
/**
*将数据存盘时的数据部分进行替代,如将' ==> ''
*@param svalue 为要提交的字段的值
*@date 2004-04-23
**/
function RepUpdateSql(svalue){
	//if(fcpubdata.databaseTypeName != "sqlserver" ) return svalue;
	var sRet=repStr(svalue,"'","''") ;
	return sRet;
}

/**
*#新增单据
**/
function AddBill(){
	var oDsMain = $id(fcpubdata.dsMain);
	if(oDsMain == null) {
		alert("请在表单模版上增加一个主数据集控件(指没有绑定到表格控件的数据集控件)后再试此功能");
		return;
	}
	
    //openselbill("")
   // DsMain.Append()
   //打开主表数据集
   var sErr=oDsMain.OpenEmpty();
	
   //打开子表数据集
   var o=window.document.all.tags("dataset");
   for(var ii=0;ii<o.length;ii++){
      if (o[ii].id!=fcpubdata.dsMain){
             o[ii].PageSize=-1;
             sErr=o[ii].OpenEmpty();
            // o[ii].Append()
      }
      
   }    
   	//给单据全局变量,单表输入时没有djbh字段
   fcpubdata.keyValue="" ;

}
/**
存盘前字段转换
*@para sXml 数据集中的fieldtrans属性值
*@para fieldname 字段名
*@para fieldvalue 字段值
*@para mRecNo 记录号,从0开始的
*@return 返回转换后的字段值
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
*重算所有记录的实际计算项
*@param dssub1 表格对应的数据集对象
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
*返回数据集中的一个从键的字段名
*@para MainKey 为整个表单的主键
*@date 2006-03-04
**/
function getSubKeyName(dssub1,MainKey){
	var xmlFields=dssub1.format;
	var oXml=new ActiveXObject("Microsoft.XMLDOM");
	oXml.async=false;
	oXml.loadXML (xmlFields) ;
	var oList=oXml.documentElement.selectNodes("//field[primarykey='是']");
	for(var iList=0;iList<oList.length;iList++){     
		var sFieldName=oList.item(iList).childNodes(0).text;
		if(sFieldName.toUpperCase() != MainKey.toUpperCase()){
			return sFieldName;
		}
	}
	return "";
}
/**
* 存盘用的子程序，得到字段的数组对象
*如另存表为空,则数据集中的所有字段都保存到临时表中,如不为空,则只是另存表中有的数据集字段才
*保存到临时表中.
**/
function Save_GetFieldArr(dssub1,oXml) {
	  var arrField=new Array();
      var saveasTable = dssub1.saveastable ;
      var arri,i;
      if(isSpace(saveasTable) == false){
			var ooXml=table_have_field1(saveasTable);
			if(typeof ooXml != "object") return null ;

	  		// 计算 xmlFields
	  		arri=0;
	  		for( i=0;i<dssub1.FieldCount;i++){
	  			if(dssub1.Field(i).DataType == "图象" ) continue;
				if(table_have_field2(ooXml,oXml.documentElement.childNodes(i).childNodes(0).text)){
					arrField[arri]=i;
					arri++;
				}
	  		}
	  }else{
	  		arri=0;
	  		for( i=0;i<dssub1.FieldCount;i++){
	  			if(dssub1.Field(i).DataType == "图象" ) continue;
				arrField[arri]=i;
				arri++;
	  		}
	  	
	  }
	  return arrField ;
}
/**
* 存盘用的子程序，得到insert语句前半部分的字段列表
*@para bMainTab ==是 表示从主表时调用, ==从 表示主从表时从从表调用
**/
function Save_GetsF(arrField,oXml,bMainTab) {
      //拼字段列表  
      
      var sF="";
      for(var arri=0;arri<arrField.length;arri++){
			i=arrField[arri];
			var curFieldName = oXml.documentElement.childNodes(i).childNodes(0).text ;
			if(fcpubdata.area.idtype == "2" &&  curFieldName.toUpperCase() == fcpubdata.area.keyfield.toUpperCase() && bMainTab != "从") {
				//自动编号ID
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
* 存盘用的子程序，得到insert语句后半部分和update语句的set部分
*@para bMainTab ==是 表示从主表时调用, ==从 表示主从表时从从表调用,sSubKeyFieldName为从键字段名 ii=记录号,i=字段号
**/
function Save_GetsVsU(oDs,ii,i,billkeyfield,sV,sU,bMainTab,sSubKeyFieldName) {
	var bool = true ; 
	var s1="";
	var s11111 ="";
	billkeyfield = billkeyfield.toLowerCase() ;
	var curFieldName = oDs.Field(i).FieldName.toLowerCase() ;
	var curFieldValue = "" ;
	if(bMainTab == "是") {
		curFieldValue = oDs.Field(i).Value ;
	}else{
		curFieldValue = oDs.oDom.documentElement.childNodes(ii).childNodes(i).text ;
	}
	//自动编号ID
	if(fcpubdata.area.idtype == "2" &&  curFieldName == billkeyfield && bMainTab != "从") {
		//什么也不做

	//oracle的序列ID 从GridSave中调用时
	//}else if(fcpubdata.area.idtype == "3" &&  curFieldName == billkeyfield && bMainTab!= "从" && bMainTab!= "主") {
	//	sV += fcpubdata.area.codeheader + ".nextval," ;
	}else if(bMainTab == "从" && curFieldName == sSubKeyFieldName.toLowerCase()){
		sV += "'"+IGetSubTableKeyValue(ii,sSubKeyFieldName)+"'," ;  //调用外部函数来生成从键字段值
	} else {
		//if(isSpace(curFieldValue))
		//	s1="";
		//else
			//s1=BeforeSaveFieldTrans(oDs.fieldtrans,oDs.Field(i).FieldName,curFieldValue,i ) ;  //s1=oDs.oDom.documentElement.childNodes(ii).childNodes(i).text ; 
		var irecno = ii;
		if(bMainTab == "是") irecno=-1;
		s1 = oDs.fieldTrans(i,irecno);	
		//这样将主表的KEY给子表.
		if(curFieldName == billkeyfield) {
			if ( typeof fcpubdata.area.idtype=="undefined" || fcpubdata.area.idtype=="1" || fcpubdata.area.idtype=="2" || fcpubdata.area.idtype=="3" || fcpubdata.area.idtype=="6" || fcpubdata.area.idtype=="8") {
				s1=":get_keyfield" ;   
				if(bMainTab != "是"){
					s11111=curFieldValue;
					//当关键字段给值后就不再找一个新的,2004-03-14
					if(isSpace(s11111)==false) s1=s11111;
				}
			}else{ // 2007-03-29 add ,以便设置为单个字段作主键时能自动传递主键字段的值到从表.
			    var oDsTmp = $id(fcpubdata.dsMain);
				if(typeof(bMainTab) == "undefined"){ //用GridSave时
				    oDsTmp = oDs;
				}
			    if(IsSpace(billkeyfield)==false) //加这个判断是因为当多个字段作主键时billkeyfield为空
				    s1 = oDsTmp.Field(billkeyfield).Value ;
				
			}
			//----------------------
		}  
		if(oDs.Field(i).DataType=="整数" || oDs.Field(i).DataType=="实数"){
			//明细序号字段
			if(oDs.Field(i).FieldName==fcpubdata.gridNoFieldName){
			    	sV+=(ii+1)+",";
			}else {
			    if(isSpace(s1)){
			    	sV+="0,";
			    	s1="0"; //给0值供sU+时用
			    }else{
			    	sV+=s1+",";
			    }
			}
		}else if(oDs.Field(i).DataType=="自定"){
			sV+=""+s1+",";				
		}else if(oDs.Field(i).DataType=="日期" && fcpubdata.databaseTypeName == "oracle"){
			sV+=""+"to_date('"+s1+"','yyyy-mm-dd')"+",";			
		}else {
			//替代单引号等特殊字符
			s1=RepUpdateSql(s1);
			sV+="'"+s1+"',";
		}
		var squot="'";
		if(oDs.Field(i).DataType=="自定" || oDs.Field(i).DataType=="整数" || oDs.Field(i).DataType=="实数"){
			squot="";
		}
		if(oDs.Field(i).DataType=="日期" && fcpubdata.databaseTypeName == "oracle"){
			squot="";
			s1="to_date('"+s1+"','yyyy-mm-dd')";
		}
		//key字段不用再更新
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
主从表的另一种从表修改保存的模式的实现步骤：
1 判断是否在数据集中勾了从键字段，如勾上了且pubdjbh不为空才转为此模式。得到从键字段的列号，
 	（只考虑一个从键字段的情况）
2 收集现有的从键值组成一个,分隔的列表,用它来生成 delete 的 where 子句,用 not in
3 从上到下循环判断,如没有add或edit标记,则生成update, where 原值="";
4 要保证先执行删除，再修改，再增加的SQL语句执行顺序.
**/
function SubTableEditSave(oDs,billkeyfield) {
	var sWhere = "",s1,ii;
	var saveasTable = oDs.saveastable ;
	var ll = oDs.RecordCount;
	//var billkeyfield = fcpubdata.area.keyfield ;
	var SubKeyName = getSubKeyName(oDs,billkeyfield);  //从键字段名
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
	//拼删除语句
	s1 = "delete from " + saveasTable + " where " + billkeyfield + "='" + fcpubdata.keyValue 
			+ "' and " + SubKeyName + " not in (" + s1 + ")" ;
	xmlSql.append("<no>" + s1 + "</no>");

	//得到要保存的字段数组
	var xmlFields = oDs.format;
	var oXmlField = SetDom(xmlFields)  ;  
	
	var arrField = Save_GetFieldArr(oDs,oXmlField) ;
	if(arrField == null) {
		return fcpubdata.sendHttpErrMsg ;
	}
	var fieldLen = arrField.length ;
	var sF = Save_GetsF(arrField,oXmlField,"从");
	
	var sInsert="";
	var oldValue="" ; //从键字段的旧值
	var newValue="" ; //从键字段的新值
	var sEditSql = new Sys.StringBuilder() ; //收集修改的SQL语句
	var sAddSql =  new Sys.StringBuilder() ; //收集增加的SQL语句
	for(ii=0;ii<ll;ii++){  //子表记录循环
		var sRowTag = oDs.oDom.documentElement.childNodes(ii).getAttribute("rowstate") ;
		oldValue = oDs.oDom.documentElement.childNodes(ii).childNodes(iSubKeyNo).text ;
		//自定义由行号得到的从键字段值
		newValue = IGetSubTableKeyValue(ii) ;
		sWhere = " where " + billkeyfield + "='" + fcpubdata.keyValue + "' and " + SubKeyName + "='" + oldValue + "'" ;
		
		if(sRowTag == "add" || sRowTag == "edit" ){
			var sV="";
			var sU="";
			for(var arri=0;arri<fieldLen; arri++){
				i=arrField[arri]; //列号
				var arrRet = Save_GetsVsU(oDs,ii,i,billkeyfield,sV,sU,"从",SubKeyName) ;
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
			
			
		} else { //只生成update从键字段的update语句
			sInsert = "update " + saveasTable + " set " + SubKeyName + "='" + newValue + "' " + sWhere;
			sEditSql.append("<no>" + repXml(sInsert) + "</no>") ;	
			
		}
		
	}
	xmlSql.append(sEditSql.toString());
	xmlSql.append(sAddSql.toString());
	
	return xmlSql.toString();
}
/**
* 计算临时表要用的字段列表
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
* 计算临时表要用的值列表
*@param curRow 当前数据集的记录行
*@date 2006-07-04
**/

function InsertTmpTableSql(oDs,curRow) {
	var oV=oDs.oDom.documentElement.childNodes(curRow);
	var l=oV.childNodes.length;
	var sV='';
	for(var i=0;i<l;i++){     
		var s1= oV.childNodes(i).text ;
		if(oDs.Field(i).DataType=="整数" || oDs.Field(i).DataType=="实数"){
			//明细序号字段
			if(oDs.Field(i).FieldName==fcpubdata.gridNoFieldName){
			    	sV+=(ii+1)+",";
			}else {
			    if(isSpace(s1)){
			    	sV+="0,";
			    	s1="0"; //给0值供sU+时用
			    }else{
			    	sV+=s1+",";
			    }
			}
		}else if(oDs.Field(i).DataType=="自定"){
			sV+=""+s1+",";				
		}else if(oDs.Field(i).DataType=="日期" && fcpubdata.databaseTypeName == "oracle"){
			sV+=""+"to_date('"+s1+"','yyyy-mm-dd')"+",";			
		}else {
			//替代单引号等特殊字符
			s1=RepUpdateSql(s1);
			sV+="'"+s1+"',";
		}
	}
	return sV;
}

///保存表单后刷新上一窗口的grid控件
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
*删除表格上的一行记录,直接删除记录
*@param dsGrid 表格对应的数据集
*@date 2003-08-04
*/
function DelGridRow(dsGrid, callback) {
    if (NotCanSave()) return;
    var ret = window.confirm("确定删除当前行吗？");
    if (ret == false) {
        return;
    }

    if (arguments.length == 0) {
        dsGrid = dssub1;
    }
    var sTable = dsGrid.getAttribute("savetable");
    var arr = MultiKeyTmp(dsGrid);
    var sWhere = ""; //拼update后面的where子句
    //alert(dsGrid.RecNo)
    sWhere = MultiKeyWhere(arr, dsGrid.RecNo, dsGrid);
    //alert(sWhere)
    if (IsSpace(sWhere)) {    //为空时为了兼容取表单关键字段当主键。
        alert("没有设置数据集: " + dsGrid.id + " 的主键字段!");
        return;
    }
    var sXml = "<delete tableName='" + sTable + "' ><where>" + sWhere + "</where></delete>";

    //2011-08-15 加上扫描子表.如有,则删除.
    if (arr.length == 1) {  //一个字段做主键时
        var oo = NavJs.getDatasetArr();
        var l = oo.length;
        for (var j = 0; j < l; j++) {
            var oDs = oo[j];

            if (IsSpace(oo[j].getAttribute("masterds")) == false && oo[j].getAttribute("masterds") == oDs.id && IsSapce(oDs.getAttribute("savetable")) == false && IsSpace(oDs.getAttribute("masterdsfield")) == false && IsSpace($id(oDs.getAttribute("masterds")).Field(oDs.getAttribute("masterdsfield")).Value) == false) {
                var quot = "";
                if (oDs.Field(oDs.getAttribute("subdsfield")).DataType == "字符") quot = "'";

                sXml += "<delete tableName='" + oDs.getAttribute("savetable") + "' ><where>" + +oDs.getAttribute("subdsfield") + "=" + quot + $id(oDs.getAttribute("masterds")).Field(oDs.getAttribute("masterdsfield")).Value + quot + "</where></delete>";
            }

        }

    }

    doSaveData(sXml, function() { dsGrid.Delete(); if (typeof (callback) == "function") callback(); });


}
/**
* 用做标记的方式来删除记录,deleteMark=1
* 2010-09-16
**/
function MarkDelRow(dsGrid, callback) {
    MarkDelRec(dsGrid,"",function(){ dsGrid.Delete(); if (typeof (callback) == "function") callback();});
}
function MarkDelRec(dsGrid,markExp,callback) {
    ///以标记方式删除，只处理数据库中的记录。markExp = "deleteMark=1" 用于指定标记方式，即标记哪个字段。 2012-08-23
    //if (NotCanSave()) return;
    var ret = window.confirm("确定删除当前行吗？");
    if (ret == false) {
        return;
    }
    if(IsSpace(markExp)) markExp = "deleteMark=1"; //给默认值
    
    var sTable = $id(dsGrid.id).getAttribute("savetable");
    var arr = MultiKeyTmp(dsGrid);
    var sWhere = ""; //拼update后面的where子句
    sWhere = MultiKeyWhere(arr, dsGrid.RecNo, dsGrid);
    if (IsSpace(sWhere)) {    
        alert("没有设置数据集: " + dsGrid.id + " 的主键字段!");
        return;
    }
    var sXml = "<update tableName='" + sTable + "' ><set>" + markExp + "</set><where>" + sWhere + "</where></update>";
    if (markExp == "直接删除") sXml = "<delete tableName='" + sTable + "' ><where>" + sWhere + "</where></delete>"; //加上直接删除记录的功能，2013-08-15
    //alert(sXml)
    doSaveData(sXml, callback);

}
function MultiMarkDelRec(dsGrid, markExp, callback) {
    ///以标记方式删除，只处理数据库中的记录。markExp = "deleteMark=1" 用于指定标记方式，即标记哪个字段。 2012-08-24
    //if (NotCanSave()) return;
    if (IsSpace(markExp)) markExp = "deleteMark=1"; //给默认值

    var sTable = $id(dsGrid.id).getAttribute("savetable");
    var arr = MultiKeyTmp(dsGrid);
    var sWhere = ""; //拼update后面的where子句
    var sb = new Sys.StringBuilder();
    for (var i = dsGrid.RecordCount - 1; i >= 0; i--) {
        if (dsGrid.oDom.documentElement.childNodes[i].getAttribute("isSel") != 1) continue;
        sWhere = MultiKeyWhere(arr, i, dsGrid);
        if (IsSpace(sWhere)) {
            alert("没有设置数据集: " + dsGrid.id + " 的主键字段!");
            return;
        }
        if (markExp == "直接删除") {
            sb.append("<delete tableName='" + sTable + "' ><where>" + sWhere + "</where></delete>"); //加上直接删除记录的功能，2013-08-15
        } else {
            sb.append("<update tableName='" + sTable + "' ><set>" + markExp + "</set><where>" + sWhere + "</where></update>");
        }
    }
    if (sb.isEmpty()) {
        alert("没有选择要删除的行！");
        return;
    } else {
        var ret = window.confirm("确定删除吗？");
        if (ret == false) {
            return;
        }

        doSaveData(sXml, callback);
    }
}
/**
*成批删除表格上选择的记录
*@param dsGrid 表格对应的数据集
*@param iMultiSelCol 多选（打勾）列在数据集中的顺序号。默认为0,
*@date 2006-11-20
*/
function MultiDelGridRow(dsGrid, iMultiSelCol, callback) {
    if (NotCanSave()) return;
    var ret = window.confirm("确定删除吗？");
    if (ret == false) {
        return;
    }

    if (arguments.length == 0) {
        dsGrid = dssub1;
    }
    if (typeof iMultiSelCol == "undefined") iMultiSelCol = 0;

    var sTable = $id(dsGrid.id).getAttribute("savetable");
    var arr = MultiKeyTmp(dsGrid);
    var sWhere = ""; //拼update后面的where子句
    //alert(dsGrid.RecNo)
    var l = dsGrid.oDom.documentElement.childNodes.length - 1;
    for (var i = 0; i < l; i++) {
        //选择列在第0列.
        if (NavJs.getNodeValue11(dsGrid.oDom,i,iMultiSelCol) == "是") {
            var sWhere1 = MultiKeyWhere(arr, i, dsGrid);
            if (isSpace(sWhere1) && IsSpace(fcpubdata.area.getAttribute("keyfield"))) {    //为空时为了兼容取表单关键字段当主键。
                var sdjbh = NavJs.getNodeValue11(dsGrid.oDom,i,dsGrid.FieldNameToNo(fcpubdata.area.getAttribute("keyfield"))); //dsGrid.Field(fcpubdata.area.keyfield).Value;

                var sQuot = "'";
                if (dsGrid.Field(fcpubdata.area.getAttribute("keyfield")).DataType == "整数" || dsGrid.Field(fcpubdata.area.getAttribute("keyfield")).DataType == "实数") {
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
        alert("请打勾选中要删除的记录!");
        return;
    }
    var sXml = "<delete tableName='" + sTable + "' ><where>" + sWhere + "</where></delete>";
    //alert(sXml);
    doSaveData(sXml, function() { dsGrid.Open(); if (typeof (callback) == "function") callback(); });

}
/**
*保存后清除表格中的编辑标记
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
由数据集中的多主键设置得到where子句

*@date 2004-03-22
**/
function MultiKeyTmp(dssub1) {
    var arr = new Array();
    var xmlFields = dssub1.format;
    var oXml = SetDom(xmlFields);
    var oList = oXml.documentElement.selectNodes("//field[primarykey='是']");
    for (var iList = 0; iList < oList.length; iList++) {
        var sFieldName = NavJs.textContent(oList[iList].childNodes[0]);
        var no = dssub1.FieldNameToNo(sFieldName);
        arr[iList] = no;
    }
    return arr;

}
/**
*@param curRecNo 记录号
oneRecordXml xml格式的一行记录
**/
function MultiKeyWhere(arr, curRecNo, dssub1, oneRecordXml) {
    var oneRecord = oneRecordXml;
    if (typeof (oneRecord) == "undefined") oneRecord = dssub1.oDom.documentElement.childNodes[curRecNo];
    var sWhere = "";
    for (var i = 0; i < arr.length; i++) {
        var sQuot = "'";
        var sQuotEnd = "'";
        if (NavJs.textContent(dssub1.oDataField.childNodes[arr[i]].childNodes[1]) == "整数" || NavJs.textContent(dssub1.oDataField.childNodes[arr[i]].childNodes[1]) == "实数") {
            sQuot = "";
            sQuotEnd = "";
        }
        if (NavJs.textContent(dssub1.oDataField.childNodes[arr[i]].childNodes[1]) == "日期" && fcpubdata.databaseTypeName == "oracle") {
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
    ///保存后,刷新上一窗口的grid
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
///由删除记录的数据生成类SQL语句
    if(IsSpace(oDs.DeletedData)) return "";
    var sb = new Sys.StringBuilder();
    var sTable=oDs.getAttribute("savetable");
    var arr = MultiKeyTmp(oDs);
    //alert("key1:" + oDs.DeletedData)
    var oDelXml = SetDom("<root>"+oDs.DeletedData+"</root>");
    for(var i=0;i<oDelXml.documentElement.childNodes.length;i++){
        var sWhere=MultiKeyWhere(arr,1,oDs,oDelXml.documentElement.childNodes[i]); //此处的1可为任意值,为无用的参数
        if(IsSpace(sWhere)){    //为空时为了兼容取表单关键字段当主键。
            throw "没有设置数据集: "+oDs.id+" 的主键字段!";
        }
        sb.append("<delete tableName='"+sTable+"' ><where>"+sWhere+"</where></delete>");
    }
    return sb.toString();
}

function doSaveData(sXml,callback){
///执行类SQL的保存数据语句,如insert update delete 或存储过程
    //取要保存到的数据源信息
    var datasourceMsg = "";
    if (IsSpace(fcpubdata.area) == false && IsSpace(fcpubdata.area.getAttribute("submitDsn")) == false) datasourceMsg = "&datasourceName=" + fcpubdata.area.getAttribute("submitDsn");

    //加上根节点上的属性
    var sRoot = "<root";
    if(fcpubdata.submitUserType != null) sRoot += " userType=\""+fcpubdata.submitUserType+"\"";
    if (fcpubdata.submitPubParam != null) sRoot += " pubParam=\"" + fcpubdata.submitPubParam + "\"";

    sRoot +=">";
    if (typeof (callback) == "function") {
        new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=doSaveData" + datasourceMsg, sRoot + sXml + "</root>", function(result) {
            var ret = result.value;
            if (ret != "") { //报错了
                alert(ret);
                return;
            }
            if (typeof (callback) == "function") callback();
        }, null, "noRoot");
    } else { //同步运行
        var ret = new Eapi.RunAjax().sendHttp(location.protocol + "//" + location.host + fcpubdata.servletPath + "/WebBill" + fcpubdata.dotnetVersion + "?key=doSaveData" + datasourceMsg, sRoot + sXml + "</root>", null, null, "noRoot");
        if (ret != "") { //报错了
            alert(ret);
        }

    }
}
function doSubmitData(callback) {
    
    fcpubdata.logger().debug("submitdata start!", arguments.callee);
    ///处理要提交的数据, 2009-05-11 add
    try{
        var sTmpErrMsg = validAllForm();
        if (sTmpErrMsg != "") return sTmpErrMsg;
    } catch (e) {
        fcpubdata.logger().error("validAllForm() err!", arguments.callee, e);

    }
    //alert(dssub1.Field("product_name").Value+":")
    //取要保存到的数据源信息
    var datasourceMsg = "";
    if (IsSpace(fcpubdata.area) == false && IsSpace(fcpubdata.area.getAttribute("submitDsn")) == false) datasourceMsg = "&datasourceName=" + fcpubdata.area.getAttribute("submitDsn");
    
	var oo= NavJs.getDatasetArr();
	var l = oo.length;
	var o = new Array(l);
	if(l <= 0) return "表单中没有数据集!";

	for(var ii=0;ii<l;ii++){
		o[ii] = oo[ii];
	}
	o.sort(cmpdataset);
	
	var oDss=new Array();
	var oDsSub=new Array();
	var j=0,jj=0;
	for(var ii=0;ii<l;ii++){
	    if (o[ii].getAttribute("submittype") == 4) continue; //4 表示不提交
	    var oDsJs = $obj(o[ii].id);
        try{
            var sRetErr = oDsJs.Update();
            if (sRetErr != "") return sRetErr;
        } catch (e) {
            fcpubdata.logger().error("ds.Update() err! "+o[ii].id, arguments.callee, e);

        }
        //验证因grid失去焦点而强行存入的数据.
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
            if (oDsMaster == null) return o[ii].id + "的主数据集 " + o[ii].getAttribute("masterds") + " 不存在!";
            oDsMaster.setAttribute("isMasterDs", "是");
            oDsMaster.setAttribute("subdsfield",o[ii].getAttribute("masterdsfield")) ;
            oDsSub[jj]=o[ii];
            jj++;

            try{
                oDsJs.ReSum(); //处理汇总项字段
            } catch (e) {
                fcpubdata.logger().error(o[ii].id+"汇总项字段计算时出错! " , arguments.callee, e);

            }
            
        }else{
            oDss[j]=o[ii];
            j++;
        }

    }
    
    //检查界面的控件上的值是否和数据集上的值一致 2011-03-16
    var tmpRet = checkContValue(fcpubdata.controls["text"]);
    if (tmpRet != null) return tmpRet;
    var tmpRet = checkContValue(fcpubdata.controls["textarea"]);
    if (tmpRet != null) return tmpRet;
    var tmpRet = checkGridValue();
    if (tmpRet != null) return tmpRet;

    
    
    //加上根节点上的属性
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
	    if(oDss[ii].getAttribute("isMasterDs") == "是"){
	        for(var k=0;k<jj;k++){
	            if(oDsSub[k].getAttribute("masterds") == oDss[ii].id){
                    sErr = doSubmitDataOne($obj(oDsSub[k].id),sb,false);
                    if(IsSpace(sErr) == false) return sErr;
	            }
	        }
	    }
	}
	
	if (sb.isEmpty()) return "没有要提交的数据!";
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
                //回写新产生的主键字段的值
                var keyfieldNo = oNode.getAttribute("keyfieldno");
                var sRetNo = oDs.getAttribute("retno");
                if (IsSpace(sRetNo)) sRetNo = oDs.RecNo + "";
                var arr = sRetNo.split(",");
                var arrValue = NavJs.textContent(oNode).split(",");
                
                for (var j = 0; j < arr.length; j++) {
                    NavJs.textContent(oDs.oDom.documentElement.childNodes[arr[j]].childNodes[keyfieldNo],arrValue[j]);
                }
                
                //要同步fset和grid及零散控件.
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
        
        //回调函数可以带一个参数,这个参数是一个XML的节点,节点用来装用户定义的返回值,在保存时,如调用了用户的后台程序,它可能需要返回值到前台,这个返回值就通过这个参数来接收.
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

            if (oDs.Field(arrCont[kk].getAttribute("field")).DataType == "文本" || oDs.Field(arrCont[kk].getAttribute("field")).DataType == "图象") break;

            if (arrCont[kk].tagName.toUpperCase() == "TEXTAREA") { // 2011-05-13
                value1 = RepStr(value1, "\r\n", "&#13;&#10;");
                value1 = RepStr(value1, "\t", "&#9;");
            }
            var value2 = oDs.Field(arrCont[kk].getAttribute("field")).Value;
            if (Trim(value1) != Trim(value2)) {
                var value3 = oDs.fset_contall(oDs.Field(arrCont[kk].getAttribute("field")));
                if(Trim(value1) != Trim(value3))
                    return "控件 " + arrCont[kk].id + " 的值=" + value1 + " 和它所绑定的数据集上字段 " + oDs.Field(arrCont[kk].getAttribute("field")).DisplayLabel + " 的值=" + value2 + " 不一致!"; 
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
                            return "grid控件 " + arrCont[kk].id + "行:" + i + "列:" + j + "的值=" + value1 + " 和它所绑定的数据集上的值=" + value2 + " 不一致!";
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
            //if (IsSpace(xmlRet)) return ""; //去掉此行，以便当没有要提交的记录时也会提交数据集的结构数据,这样就能处理子表的删除记录。
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

        ///计算要返回Key值的行号,处理字段保存前转换
        var xmlRet = new Sys.StringBuilder();
        var isNotTrans = IsSpace(oDs.getAttribute("fieldtrans"));
        var countType = "单条";
        if (oDs.getAttribute("submittype") == 3) {
            countType = "变化";
        } else if (oDs.getAttribute("submittype") == 5) {
            countType = "所有";
        } else if (oDs.getAttribute("submittype") == 1) {
            if (oDs.getAttribute("isMasterDs") != "是") {
                countType = "变化";
            }
        }
        if (countType == "单条") {
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
                if (rState == "new") continue; //强行新增的行且未修改过,不存
                if (countType == "变化" && rState != "add" && rState != "edit") continue;
                if (oDs.getAttribute("idtype") == 1 || oDs.getAttribute("idtype") == 2 || oDs.getAttribute("idtype") == 3 || oDs.getAttribute("idtype") == 6 || oDs.getAttribute("idtype") == 8) {
                    if (iKeyFieldNo >= 0) {
                        if (IsSpace(NavJs.textContent(oRowXml.childNodes[iKeyFieldNo]))) {
                            retNo.append(ii + ",");
                        }
                    } else {
                        var sErrMsg = oDs.id + "没设置主键字段!";
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
            oDs.retno = sRetNo.substring(0, sRetNo.length - 1); //要返回Key值的行号保存到 oDs.retno 中
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
    var sType = "单";
    if (oDs.getAttribute("isMasterDs") == "是") sType = "主";
    if (IsTrue(oDs.getAttribute("issubds"))) sType = "从";
    xmlRet.append(sType);
    xmlRet.append("</type>");
    xmlRet.append("<field>");
    if (IsSpace(oDs.getAttribute("subdsfield")) == false) xmlRet.append(oDs.getAttribute("subdsfield"));
    xmlRet.append("</field>");
    xmlRet.append("</relation>");
    //加上用户自定的数据集级全局变量值.
    if (typeof (oDs.getAttribute("pubVars")) != "undefined") {
        xmlRet.append("<pubVars>");
        xmlRet.append(oDs.getAttribute("pubVars"));
        xmlRet.append("</pubVars>")
    }
    if (isExport == false) {
        var sDeletedData = deletedDataToSql(oDs);

        var sUploadSave = doUploadSave(oDs.id);
    }
    //加上事件串
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
        //预处理上传控件
        if (HaveUpload()) {
            var oDsUpload;
            if (IsSpace($id("upload1").getAttribute("dataset")) == false) {
                oDsUpload = $id($id("upload1").getAttribute("dataset"));
            } else {
                throw "应将上传控件绑定到数据集上";
            }
            if (dsId == $id("upload1").getAttribute("dataset")) {
                return upload_save();
            }
        }

    }
}


function piDelSubTableData(oDs) {
///本函数用于主从表保存时,先删除子表的所有记录,然后再增加上界面上的行.将本函数的返回值赋给数据集的保存之前事件上.然后调用通用的提交保存函数. 
///提交数据之前的处理插件,用于删除当前的所有子表数据,oDs为子表数据集,返回删除子表的类SQL语句
/// 	1 找到表名,where条件,以生成删除子表所有记录的语句. 通过和主数据集的关系设置来找到字段名,如果主数据集的主键字段值为空,则返回.
/// 	2 将子数据集的所有记录的rowstate强制改为 add 
    if(IsSpace(oDs.getAttribute("savetable"))){
        alert("数据集 "+oDs.id+" 的保存表名不能为空!");
        return;
    }    
    if(IsSpace(oDs.getAttribute("subdsfield"))){
        alert("数据集 "+oDs.id+" 不是从表数据集!");
        return;
    }    
    var keyValue = $id(oDs.getAttribute("masterds")).Field(oDs.getAttribute("masterdsfield")).Value;
    if(IsSpace(keyValue)) return; //关联字段值为空则不做
    var sb = new Sys.StringBuilder();
    sb.append("<delete tableName='" + oDs.getAttribute("savetable") + "' >");
    var quot = "";
    if (oDs.Field(oDs.getAttribute("subdsfield")).DataType == "字符") quot = "'";
    sb.append("<where>"+oDs.getAttribute("subdsfield")+"="+quot+keyValue+quot+"</where></delete>");
    for(var i=0;i<oDs.oDom.documentElement.childNodes.length-1;i++){
        oDs.oDom.documentElement.childNodes[i].setAttribute("rowstate","add");
    }
    oDs.DeletedData=""; 
    return sb.toString();
}
/**
* 导出数据 2010-12-28 
**/
function doExportData(sFileName,callback) {
    var oo = NavJs.getDatasetArr();
    var l = oo.length;
    var o = new Array(l);
    if (l <= 0) return "表单中没有数据集!";

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
            oDsMaster.setAttribute("isMasterDs","是");
            oDsMaster.setAttribute("subdsfield",o[ii].getAttribute("masterdsfield"));
            oDsSub[jj] = o[ii];
            jj++;


        } else {
            oDss[j] = o[ii];
            j++;
        }

    }
    sFileName = RepXml(sFileName);
    //加上根节点上的属性
    var sRoot = "<root";
    sRoot += " exportFile=\"" + sFileName + "\"";
    if (fcpubdata.submitUserType != null) sRoot += " userType=\"" + fcpubdata.submitUserType + "\"";
    if (fcpubdata.submitPubParam != null) sRoot += " pubParam=\"" + fcpubdata.submitPubParam + "\"";
    sRoot += ">";

    var sb = new Sys.StringBuilder(sRoot);
    for (var ii = 0; ii < j; ii++) {
        var sErr = doSubmitDataOne($obj(oDss[ii].id), sb, true);
        if (IsSpace(sErr) == false) return sErr;
        if (oDss[ii].getAttribute("isMasterDs") == "是") {
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
    ///上下移动行时要做的数据库保存工作，2012-08-23
    if (IsSpace(sortFieldName)) sortFieldName = 'sortno';
    var colNo = oDs.FieldNameToNo(sortFieldName);
    var rowNo = oDs.RecNo;
    var oRoot = oDs.oDom.documentElement;
    if (oRoot.childNodes.length < 2) return; //fhj 2013-03-19 检查一下如果没有记录就返回
    
    var sTableName = $id(oDs.id).getAttribute("savetable"); //保存表名
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
    //取主键where串
    var arr = MultiKeyTmp(oDs);
    sb.append("<update tableName='" + sTableName + "' ><set>" + sortFieldName + "=" + sort2 + "</set><where>" + MultiKeyWhere(arr, rowNo, oDs) + "</where></update>");
    sb.append("<update tableName='" + sTableName + "' ><set>" + sortFieldName + "=" + sort1 + "</set><where>" + MultiKeyWhere(arr, changeRowNo, oDs) + "</where></update>");
    //alert(sb.toString());
    doSaveData(sb.toString());

    oRoot.childNodes[rowNo].childNodes[colNo].text = sort2;
    oRoot.childNodes[changeRowNo].childNodes[colNo].text = sort1;


}
