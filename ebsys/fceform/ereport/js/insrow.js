var	lngUndo=-1;
var	lngRedo=-1;
var oUndo=[];
var oRedo=[];

//---------------------
/*var oFormula
oFormula=new ActiveXObject("Microsoft.XMLDOM")
oFormula.async ="false";
oFormula.loadXML("<root></root>")
*/

/**
*������
**/
function InsRow(bAppend){
		var d=new Date()
	var t2=d.getTime()
	
	SaveoUndoOneRecord();
	var offsetRow = 0;
	if(bAppend) {
		//�̶������һ��׷��
		var minRow=$id("t").rows.length;
		for(var i=0;i<=SelObj.eRowSort-SelObj.sRowSort;i++){
			var oTr=$id("t").insertRow();
			oTr.style.height=fcpub.rowHeight;
			var tdCount = tabTopHead.rows(0).cells.length;
			for(var j=0;j<tdCount;j++){
				oTr.insertCell();
			}
			var oTr=tabLeftHead.insertRow();
			oTr.style.height=fcpub.rowHeight;
			var oTDClass = oTr.insertCell();
			oTDClass.className = "left_td";
		}


	}else{

		var minRow=SelObj.sRowSort+offsetRow;
		shiftFormulas($id("t"), SelObj.sRowSort, -1, SelObj.eRowSort-SelObj.sRowSort+1, 0);
		
		ShowTitleColor(false);
		//var scrollBak = divMain.scrollLeft;
		var iRows=SelObj.eRowSort-SelObj.sRowSort;
		var l=$id("tabTopHead").rows(0).cells.length;
		var countTD=0 ;//����Ҫ�ٲ����TD��Ŀ
		var arrTD=[] ; //Ҫ�����TD����
		var count=0;
		
		
		
		for(var i=0;i<l;i++){
			var td1 = findLogTd(minRow,i);
			if(td1 == null ) {
				break;
			}
			//var col1 = TDToCol(td1);
			//if(col1 > td1.cellIndex+countTD){
				//�ҵ�Ҫ���������TD
			//	var td2 = findLogTd(minRow,col1-1);
				if(td1.parentNode.rowIndex < minRow){
					arrTD[count]=td1;
					count++;
					countTD += td1.colSpan;
				}
			//}
			i += td1.colSpan-1;
		}
	
				
		for(var i=0;i<=iRows;i++){
			var ll = arrTD.length;
			for(var j=0;j<ll;j++){
				arrTD[j].rowSpan++; //����һ����ϲ���Ԫ���td��rowSpan��1
				
			}
			//���ռ���õ�TD����������
			var oTr=$id("t").insertRow(minRow)
			oTr.style.height=fcpub.rowHeight;
			var tdCount = tabTopHead.rows(0).cells.length-countTD;
			for(j=0;j<tdCount;j++){
				$id("t").rows(minRow).insertCell();
			}
			var oTr=tabLeftHead.insertRow(minRow)
			oTr.style.height=fcpub.rowHeight;
			//oTr.className="fixedStyle";
			var oTDClass = tabLeftHead.rows(minRow).insertCell();
			oTDClass.className = "left_td";
			
		}
	}
	//��˳�б�
	for (i=minRow;i<=$id("t").rows.length-1;i++){
		tabLeftHead.rows(i).cells(0).innerText=(i+1)+GetRowLabel(i);
	}	
	//��λ��ǰ����
	//divMain.scrollLeft = scrollBak;
	selectRange("insrow");
	
	//�ӵ�Ԫ�����н���ʽ��Ԥ�������Ĺ�ʽװ��oFormula��
//	LoadAllFormula()

	SaveoRedoOneRecord();
	blnChange=true;
	
	var d=new Date()
	var t1=d.getTime()
	//alert(t1-t2)

	
}
/**
*ɾ����
**/
function DelRow(){
	if(SelObj.eRowSort-SelObj.sRowSort+1 >= $id("t").rows.length ) {
		alert("����ɾ��������!");
		return;
	}
	SaveoUndoOneRecord();
	shiftFormulas($id("t"), SelObj.sRowSort, -1,(-1) * (SelObj.eRowSort-SelObj.sRowSort+1), 0);
	ShowTitleColor(false);
	
	//var scrollBak = divMain.scrollLeft;
	var minRow=SelObj.eRowSort;
	var l=$id("tabTopHead").rows(0).cells.length; //$id("t").rows(minRow).cells.length;

	var arrInsCell=new Array();
	var ipos=0;
	//�ȴ���β��
	for(var i=l-1;i>=0;i--){
		var td1 = findLogTd(minRow,i);
		if(td1 == null ) {
			break;
		}
		var td1row = td1.parentNode.rowIndex;
		if(td1.rowSpan>1 && td1row==minRow){
			//�統ǰ��Ԫ�Ǻϲ���Ԫ������Ԫ����ϲ���Ԫ����
			var arrInsCol=PhyToLogCol(minRow+1,i);
			var iInsertCol=arrInsCol[1]+1;
			if(arrInsCol[0] == 3) iInsertCol = 0;
			//�ȼ�סҪ�����λ��
			arrInsCell[ipos]=new Object();
			arrInsCell[ipos].col = iInsertCol;
			arrInsCell[ipos].td = td1;
			ipos++;
		}

		if(td1row < SelObj.eRowSort && td1row >=SelObj.sRowSort && td1row+td1.rowSpan-1 > SelObj.eRowSort ){
			//��Ҫ����ĵ�Ԫ����ѡ��Χ��,��β������ѡ��������ʱ,��Ҫ���ϲ���Ԫ����С��ѡ�������к�.
			var tdNode=td1.cloneNode(true);

			var arrInsCol=PhyToLogCol(minRow+1,i);
			var iInsertCol = arrInsCol[1]+1;
			if(arrInsCol[0] == 3) iInsertCol = 0;
			
			if(iInsertCol > $id("t").rows(minRow+1).cells.length-1 ){
				iInsertCol = $id("t").rows(minRow+1).cells.length;
				$id("t").rows(minRow+1).insertCell();
			}else{
				$id("t").rows(minRow+1).insertCell(iInsertCol);
			}
			$id("t").rows(minRow+1).cells(iInsertCol).replaceNode(tdNode);
			$id("t").rows(minRow+1).cells(iInsertCol).rowSpan=td1.rowSpan-(SelObj.eRowSort-td1row)-1;
			
		}
		i -= td1.colSpan-1;
	}
	
	//��������
	minRow=SelObj.sRowSort;
	for(var i=l-1;i>=0;i--){
		var td1 = findLogTd(minRow,i);
		if(td1 == null ) {
			break;
		}
		var td1row = td1.parentNode.rowIndex;
			
		if(td1row < SelObj.sRowSort){
		//���Ҫ����ĵ�Ԫ����ѡ�е�����֮��
			if( td1row+td1.rowSpan <= SelObj.eRowSort ){
				td1.rowSpan = SelObj.sRowSort-td1row;
			} else {
				td1.rowSpan = td1.rowSpan-(SelObj.eRowSort-SelObj.sRowSort+1);
			}
		}
		i -= td1.colSpan-1;
	}
	
	minRow=SelObj.eRowSort;
	for(var i=0;i<arrInsCell.length;i++){
		var td1=arrInsCell[i].td;
		var iInsertCol = arrInsCell[i].col;	
		var tdNode=td1.cloneNode(true);
		if(iInsertCol > $id("t").rows(minRow+1).cells.length-1 ){
			iInsertCol = $id("t").rows(minRow+1).cells.length;
			$id("t").rows(minRow+1).insertCell();
		}else{
			$id("t").rows(minRow+1).insertCell(iInsertCol);
		}
		
		//$id("t").rows(minRow+1).insertCell(iInsertCol);
		$id("t").rows(minRow+1).cells(iInsertCol).replaceNode(tdNode);
		$id("t").rows(minRow+1).cells(iInsertCol).rowSpan=td1.rowSpan-1;
	}
	
	var bNotEndRow = SelObj.eRowSort < $id("t").rows.length-1 ; //���������
	for(var i=SelObj.eRowSort;i>=SelObj.sRowSort;i--){
		//�粻ɾ�� cell,��ʹ�϶��޸��п�ʱ����δˢ�µ�����
		if(bNotEndRow){
			var ll = $id("t").rows(i).cells.length;
			for(var j=ll-1;j>=0;j--){
				$id("t").rows(i).deleteCell(j);
			}
			tabLeftHead.rows(i).deleteCell(0);
		}
		$id("t").deleteRow(i);
		tabLeftHead.deleteRow(i);
	}
	
	//��˳�б�
	for (var i=SelObj.sRowSort;i<=tabLeftHead.rows.length-1;i++){
		tabLeftHead.rows(i).cells(0).innerText=(i+1)+GetRowLabel(i);
	}	
	
//	$id("t").style.visibility="hidden";
//	$id("t").style.visibility="visible";
	if(bNotEndRow==false){
		//tabLeftHead.outerHTML = tabLeftHead.outerHTML ; //ˢ��,����ɾ������к�����
		//$id("t").outerHTML = $id("t").outerHTML;
		//$id("t").style.visibility="hidden";
		//$id("t").style.visibility="visible";
		//$id("t").refresh();
		//tabLeftHead.refresh();
		var l = $id("t").rows.length-1;
		$id("t").rows(0).swapNode($id("t").rows(l));
		$id("t").rows(l).swapNode($id("t").rows(0));
		tabLeftHead.rows(0).swapNode(tabLeftHead.rows(l));
		tabLeftHead.rows(l).swapNode(tabLeftHead.rows(0)); 
	}

	//��λ��ǰ����
	if(SelObj.sRowSort>tabLeftHead.rows.length-1) {
		SelObj.sRowSort=tabLeftHead.rows.length-1;
	}
	SelObj.sRow=SelObj.eRow=SelObj.eRowSort= SelObj.sRowSort;
	//divMain.scrollLeft = scrollBak;
	//if(SelObj.sRowSort != tabLeftHead.rows.length-1)
	selectRange("insrow");
	//�ӵ�Ԫ�����н���ʽ��Ԥ�������Ĺ�ʽװ��oFormula��
	//LoadAllFormula()
	SaveoRedoOneRecord()
	blnChange=true
}
/**
*�����б�
*@date 2006-11-22
**/
function GetRowLabel(row) {
	var sRet = "";
	if($id("t") != null){
		switch ($id("t").rows(row).e_row_type){
			case "0" : sRet="_��";break;
			case "1" : sRet="_ͷ";break;
			case "2" : sRet="_β";break;
			case "3" : sRet="_ü";break;
			case "4" : sRet="_��";break;
		}
	}
	return sRet;
}
/**
*������
**/
function InsCol(bAppend){
	SaveoUndoOneRecord();
	var minCol = SelObj.sColSort;
	if(bAppend) {
		//�̶������һ��׷��
		for(var i=0;i<$id("t").rows.length;i++){
			var oTr=$id("t").rows(i);
			for(var j=0;j<=SelObj.eColSort-SelObj.sColSort;j++){
				oTr.insertCell();
			}
		}
		minCol = tabTopHead.rows(0).cells.length-1;
		//�����ͷ��Ϣ
		for(var i=0;i<=SelObj.eColSort-SelObj.sColSort;i++){
			var o=document.createElement("COL");
			o.style.width = fcpub.colWidth;
			var iPos=minCol ;
			var obak = o.cloneNode();		
			$id("t").children[0].appendChild(o);
			tabTopHead.children[0].appendChild(obak);
			var oTDClass = tabTopHead.rows(0).insertCell();
			oTDClass.className = "top_td";
		}
	}else{
		shiftFormulas($id("t"),-1, SelObj.sColSort,0, SelObj.eColSort-SelObj.sColSort+1);
		//ShowTitleColor(false);
		//var scrollBak=divMain.scrollTop;
		var iCols = SelObj.eColSort - SelObj.sColSort ;
		var l=$id("t").rows.length;
		for(var i=0;i<l;i++){
			var bActed = false;
			var oTd = findLogTd(i,SelObj.sColSort); //,true
			if(oTd.colSpan > 1 ) {
				var col1 = TDToCol(oTd);
				if(col1 < SelObj.sColSort ) {
					//��Ҫ����ϲ���Ԫ��
					oTd.colSpan += SelObj.eColSort - SelObj.sColSort + 1 ; 
					i += oTd.rowSpan - 1 ; 
					bActed = true;
				}
			}
			if(bActed == false){
				//����TD
				for(var j=0;j<=iCols;j++){
					$id("t").rows(i).insertCell(oTd.cellIndex);
				}
			}
		}
		ShowTitleColor(false);
		//�����ͷ��Ϣ
		for(var i=0;i<=iCols;i++){
			var o=document.createElement("COL");
			o.style.width = fcpub.colWidth;
			var iPos=minCol ;
			var obak = o.cloneNode();		
			$id("t").children[0].insertBefore(o,$id("t").children[0].children[iPos]);
			tabTopHead.children[0].insertBefore(obak,tabTopHead.children[0].children[iPos]);
			var oTDClass = tabTopHead.rows(0).insertCell(iPos);
			oTDClass.className = "top_td";
		}
		//divMain.scrollTop = scrollBak;
	}	
	
	//��˳�б�
	for (i=minCol;i<=tabTopHead.rows(0).cells.length-1;i++){
		var iText = IntToLbl(i+1) ;
		tabTopHead.rows(0).cells(i).innerText= iText + GetColLabel(i);
	}	
	selectRange("insrow");
	
	//LoadAllFormula();
	SaveoRedoOneRecord();
	blnChange=true;
}
/**
*ɾ����
* �������:
	1 ��β�е�����ѭ��,��ȡ����βλ��eColSort+1�ĵ�Ԫ,���Ǻϲ���Ԫ��,�絥Ԫ�����ڵ����ǵ�ǰ��,
		������޸����λ��,��С��=eColSort�Ҵ���sColSort,��ϲ���Ԫ������.
	2 ȡsColSort��Ԫ,���Ǻϲ���Ԫ��,�絥Ԫ�����ڵ����ǵ�ǰ��,������޸����λ��,�����µ�colSpan.
	3 �Ӻ���ǰɾ��֮���td
*@date 2006-05-18
**/
function DelCol(){
	if(SelObj.eColSort-SelObj.sColSort+1 >= tabTopHead.rows(0).cells.length ) {
		alert("����ɾ��������!");
		return;
	}

	SaveoUndoOneRecord() ;
	shiftFormulas($id("t"),-1, SelObj.sColSort,0,(-1)*( SelObj.eColSort-SelObj.sColSort+1));
	
	ShowTitleColor(false);
	//var scrollBak=divMain.scrollTop;
	var iStart=iEnd=0;
	
	for(var i = $id("t").rows.length -1;i>=0;i-- ){
		
		var bActed = false;
		//����β��
		var td1 = findLogTd(i,SelObj.eColSort);//,true
		if(td1 == null){
			//��ɾ�����һ�������һ�е��п��Сʱ��Ϊnull
			return;
		}
		if(td1.colSpan >1  ){
			
			if(td1.parentNode.rowIndex == i){
				var col1 = TDToCol(td1);
				if(col1<= SelObj.eColSort && col1 >= SelObj.sColSort && col1 + td1.colSpan -1 > SelObj.eColSort ){
					//��Ԫ������
					td1.colSpan = td1.colSpan - (SelObj.eColSort - col1 + 1) ;
					bActed =  true;
				}
				
			}
		}
		
		if(td1.parentNode.rowIndex < i){
			var arr = PhyToLogCol(i,SelObj.eColSort);
			if(arr[0] == 2){
				iEnd = arr[1] ;
			}else{
				iEnd = -1 ;
			}
		}else if(bActed){
			iEnd = td1.cellIndex-1;
		}else{
			iEnd = td1.cellIndex;
		}
		
		bActed = false;
		//��������
		var td2 = findLogTd(i,SelObj.sColSort);//,true
		if(td2.colSpan >1  ){
			if(td2.parentNode.rowIndex == i){
				var col2 = TDToCol(td2);
				if(col2 <  SelObj.sColSort ){
					if(col2 + td2.colSpan-1 > SelObj.eColSort){
						td2.colSpan = td2.colSpan - (SelObj.eColSort-SelObj.sColSort+1);
					}else{
						td2.colSpan = SelObj.sColSort - col2 ;
					}
					bActed = true;
				}
				
			}
		}
		if(td2.parentNode.rowIndex < i){
			var arr = PhyToLogCol(i,SelObj.sColSort);
			if(arr[0] == 2){
				iStart = arr[1] + 1  ;
			}else{
				iStart = 0 ;
			}
		}else if(bActed){
			iStart = td2.cellIndex+1;
		}else{
			iStart = td2.cellIndex;
		}

		if(iStart <= $id("t").rows(i).cells.length-1) {
			//ɾ���м��td
			for(var k = iEnd; k>= iStart; k--){
				
				$id("t").rows(i).deleteCell(k);
			}
		}
		
	}
	
	for(var i = SelObj.sColSort;i<=SelObj.eColSort;i++){
		$id("t").children[0].removeChild($id("t").children[0].children[SelObj.sColSort]);
		tabTopHead.children[0].removeChild(tabTopHead.children[0].children[SelObj.sColSort]);
		tabTopHead.rows(0).deleteCell(SelObj.sColSort);
	
	}
	
	//��˳�б�
	var l=tabTopHead.rows(0).cells.length-1;
	for (i=SelObj.sColSort;i<=l;i++){
		tabTopHead.rows(0).cells(i).innerText=IntToLbl(i+1)+GetColLabel(i);
		
	}	
	
	//divMain.scrollTop = scrollBak;
	//��λ��ǰ����
	if(SelObj.sColSort>tabTopHead.rows(0).cells.length-1) SelObj.sColSort = tabTopHead.rows(0).cells.length-1 ;
	SelObj.sCol=SelObj.eCol=SelObj.eColSort= SelObj.sColSort;
	selectRange("insrow");
	
	SaveoRedoOneRecord();
	blnChange=true	;
}
/**
*�����б�
*@date 2006-11-22
**/
function GetColLabel(col) {
	var sRet = "";
	if($id("t") != null){
		switch ($id("t").childNodes[0].childNodes[col].e_col_type){
			case "0" : sRet="_ͷ";break;
		}
	}
	return sRet;
}
/**
* 1--->A��������ȡ����ĸ
**/
function IntToLbl(index){
        // The index is 1 based.  Convert 1 to A, 2 to B, 25 to Y, 26 to Z, 27 to AA, 28 to AB.
        // TODO: Got a bug when index > 676.  675==YZ.  676==YZ.  677== AAA, which skips ZA series.
        //       In the spirit of billg, who needs more than 676 columns anyways?
        var b = (index - 1).toString(26).toUpperCase();   // Radix is 26.
        var c = [];
        for (var i = 0; i < b.length; i++) {
            var x = b.charCodeAt(i);
            if (i <= 0 && b.length > 1)                   // Leftmost digit is special, where 1 is A.
                x = x - 1;
            if (x <= 57)                                  // x <= '9'.
                c.push(String.fromCharCode(x - 48 + 65)); // x - '0' + 'A'.
            else
                c.push(String.fromCharCode(x + 10));
        }
        return c.join("");

/*
	var strLbl="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var inx=parseInt(colno/26);
	if (inx>26)
		return 
	var strPrefix=strLbl.substring(inx-1,inx)
	var strColLbl=strLbl.substring(colno-inx*26-1,colno-inx*26)				
	return strPrefix+strColLbl	*/
}
/**
* A--->1����ĸȡ�������ţ�ֻ֧����󳤶�Ϊ2��strS
**/
function LblToInt(str){
        // Converts A to 1, B to 2, Z to 26, AA to 27.
        var num = 0;
        for (var i = 0; i < str.length; i++) {
            var digit = str.charCodeAt(i) - 65 + 1;       // 65 == 'A'.
            num = (num * 26) + digit;
        }
        return num;


/*
	var strLbl="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	var inx=strC.length
	var iCol
	if (inx==1)//һ����ĸ
		iCol=strLbl.indexOf(strC)+1
	else//������ĸ
	{
		iCol=(strLbl.indexOf(strC.substring(0,1))+1)*26+strLbl.indexOf(strC.substring(1,2))+1
	}	
	return iCol	*/
}
/**
* a1==>1,1
* strLbl="a1"
* ����һ���������е�����
**/
function TransAto1(strLbl){
    if(isSpace(strLbl)) return
    
    strLbl=new Eapi.Str().trim(strLbl)
	var strChar,strInt	
	var iLength=strLbl.length-1
	var iRow,iCol
	var lngA
	var dblR
	for (var i=0;i<=iLength;i++){
		lngA=parseInt(strLbl.charCodeAt(i))		
		if (lngA>=49 && lngA<=57){
			var strChar=strLbl.substring(0,i)
			var strInt=strLbl.substring(i,iLength+1)
			break;	
		}		
	}
	
	iRow=parseInt(strInt)
	strChar=strChar.toUpperCase()
	iCol=parseInt(LblToInt(strChar))
	
	var sR=new Array(2)
	sR[0]=iRow
	sR[1]=iCol
	return sR;
}
/**
//��ɾ��ʱҪ�ƶ���ʽ������õ�

function MoveFormula(startCol,iCols,iTag){
	var strFormula
	for (var k=0;k<oFormula.documentElement.childNodes.length;k++){
		strFormula=new Eapi.Str().trim(oFormula.documentElement.childNodes(k).childNodes(4).text)
		strFormula=" " +strFormula+" "
		re=/(([a-z]|[A-Z])|([a-z]|[A-Z])([a-z]|[A-Z]))([1-9]|([1-9][0-9])|([1-9][0-9][0-9]))[^0-9]/ig
		r=strFormula.match(re)
		if(r!=null){
		var lngPrePos=0
		var lngPrePos1=0
		var strRet=""  //���ع�ʽ
		//�Ӵ�ѭ����Ϊ�����һ����ʽ�еĶ��A2
		for (var i=0;i<=r.length-1;i++){
			strSearch=new Eapi.Str().trim(r[i].substring(0,r[i].length-1))//ȡ����һ����־��
			//alert(strSearch)
			var strChar,strInt	
			var iLength=strSearch.length-1
			var sCurRow,sCurCol
			var lngA
			for (var ii=0;ii<=iLength;ii++){
				lngA=parseInt(strSearch.charCodeAt(ii))		
				if (lngA>=49 && lngA<=57){
					var strChar=strSearch.substring(0,ii)
					var strInt=strSearch.substring(ii,iLength+1)
					break;	
				}		
			}
			//��B5==>�к�����
			sCurRow=parseInt(strInt)
			sCurCol=LblToInt(strChar)
			
			if(sCurCol>startCol) {
				//=1��ʾ����,�����ƶ���
				if(iTag==1)
					sCurRow=sCurRow+iCols
				else
					sCurCol=sCurCol+iCols
				
				//-----------���  B5===>F5
				strReplace=IntToLbl(sCurCol)+sCurRow
				//alert(strReplace)
				lngPrePos1=strFormula.indexOf(strSearch,lngPrePos)	
				if (lngPrePos1>0){
					//�滻�ַ�
					strRet=strRet+strFormula.substring(lngPrePos,lngPrePos1)+strReplace
					lngPrePos=lngPrePos1+strSearch.length
				}
				else {
					strRet=strRet+strFormula.substring(lngPrePos,strFormula.length-1)
				}
				//alert(i+":"+strRet)
			}	

		}
		//alert(strRet)
		var iRow=parseInt(new Eapi.Str().trim(oFormula.documentElement.childNodes(k).childNodes(0).text))
		var iCol=parseInt(new Eapi.Str().trim(oFormula.documentElement.childNodes(k).childNodes(1).text))
		var arr=PhyToLog(iRow,iCol)
		$id("t").rows(arr[0]).cells(arr[1]).setAttribute("formula",new Eapi.Str().trim(strRet))
		}
	}


}**/

/**
*�����
**/
function cmdBlockCut(){
	cmdBlockCopy();
	var l = SelObj.cells.length;
	for(var i=0;i<l;i++){
		SelObj.cells[i].oTD.innerText = "";
	}	
	RefreshCurTdValue();
}
/**
*�鸴��
**/
function cmdBlockCopy(){
	var sCopy="";
	getSelCells();
	var len = SelObj.cells.length;
	var tdrow ;
	for (var i=0;i<len;i++){
		var curTD=SelObj.cells[i].oTD;
		//sCopy +=curTD.innerText;
		if(tdrow != SelObj.cells[i].tdrow){
			if(typeof tdrow != "undefined") {
				sCopy += "\n"+curTD.innerText+"\t";
			}else{
				sCopy += curTD.innerText+"\t";
			}
			tdrow=SelObj.cells[i].tdrow;
		}else{
			sCopy += curTD.innerText + "\t";
		}
	}
	CopyToPub(sCopy);
}
/**
*��ճ��
**/

function cmdBlockPaste(){	
	var sCopy = window.clipboardData.getData("Text")
	if (IsSpace(sCopy) ) {
		alert("����δ�����ݵĸ��ƣ��ȸ������ݣ�Ȼ������ճ����")	;
		return;
	}
	SaveoUndoOneRecord();
	//���ⲿ������������
	var arrRow,arrCol;
	arrRow=sCopy.split("\n");
	for (var i=0 ;i<arrRow.length;i++) {
		var curTD=findLogTd(i+SelObj.sRowSort,SelObj.sColSort);
		var arr=new Array();
		arr[0] = curTD.parentNode.rowIndex;
		arr[1] = curTD.cellIndex;
		arrCol=arrRow[i].split("\t");
		arrCol=arrCol.slice(0,-1);
		for (var j=0;j<arrCol.length;j++) {
			var curTD=$id("t").rows(arr[0]).cells(arr[1]+j);
			try{ //����TD�����
				curTD.innerText=arrCol[j];
			}catch(e){}
		}
	}
	RefreshCurTdValue();
	SaveoRedoOneRecord();
}
/**
*�������ϵĸ�ʽˢ��ť�ĵ���¼�
**/
function cmdFormatBrush() {
	//if(blnRunMode)return
	if (cmdBrush.getAttribute("fcDown")=="1") {
		cmdBrush.setAttribute("fcDown","0")
		cmdBrush.className = "tbnormal " + cmdBrush.classbak;
	}
	else {
		cmdCopyFormat()
		cmdBrush.setAttribute("fcDown","1")
		cmdBrush.className = "tbdownout " + cmdBrush.classbak;
	}
}
/**
*�������ϵĸ��ư�ť�ĵ���¼�
**/
function cmdCopyFormat() {
	SelObj.sPasteFormat = SelObj.curTD.oTD.style.cssText;
	//if (tc.style.display =="none")
	//	return
	
//	if (lngStatus==3 || lngStatus==4 ){
//		alert("ѡ����������кϲ���Ԫ�񣬲������鸴�ƣ�")
//		return
//	}
	//FormatRow=sRow
	//FormatCol=sCol
	
}
/**
*�������ϵ�ճ����ť�ĵ���¼�
**/

function cmdPasteFormat() {
	SaveoUndoOneRecord()
	getSelCells();
	var len = SelObj.cells.length;
	for (var i=0;i<len;i++){
		var curTD=SelObj.cells[i].oTD;
		curTD.style.cssText = SelObj.sPasteFormat ;
	}	
	/*
	var arrFormat=PhyToLog(FormatRow,FormatCol)
	
	var i,j
	for (i=sRowSort;i<=eRowSort;i++)
	{
		for (j=sColSort;j<=eColSort;j++) {
			var arr=PhyToLog(i,j)
			var curTD=$id("t").rows(arr[0]).cells(arr[1])
			var gNodeTD=$id("t").rows(arrFormat[0]).cells(arrFormat[1]).cloneNode(true)
			gNodeTD.rowSpan=curTD.rowSpan
			gNodeTD.colSpan=curTD.colSpan
			var sTmp=curTD.innerText
			curTD.replaceNode(gNodeTD)
			$id("t").rows(arr[0]).cells(arr[1]).innerText=sTmp
		}
	}
	*/
	SaveoRedoOneRecord()
}
/**
*ɾ�����е�oUndo��oRedo�����еĽڵ�
**/
function initoUndooRedo(){
	lngUndo=-1; //childNodes.item(0)��0��ʼ
	lngRedo=-1;
	//cmdUndo.disabled =true
	//cmdRedo.disabled =true
	//oUndo.loadXML("<root></root>")
	//oRedo.loadXML("<root></root>")
	oUndo=[];
	oRedo=[];
	
	//onmousedown="t_onmousedown()" onmousemove="t_onmousemove()" onmouseup="t_onmouseup()"
	$id("t").onmousedown=t_onmousedown;
	$id("t").onmousemove=t_onmousemove;
	$id("t").onmouseup=t_onmouseup;
}
/**
*����һ��oRedo����ļ�¼�����Ƚ��ȳ��Ĺ��򣬱���ֻ��8����¼
**/
function SaveoRedoOneRecord(){
	if(tabLeftHead.rows.length * tabTopHead.rows(0).cells.length > 2000 ) return;

	lngRedo++ ;	
	//cmdRedo.disabled =false; //����undo
	var arr =[];
	arr[0]=$id("t").outerHTML;
	arr[1]=tabTopHead.outerHTML;
	arr[2]=tabLeftHead.outerHTML;
	arr[3]=SelObj;
	arr[4]=getEditObj();
	oRedo[oRedo.length]=arr;
	if (oRedo.length >8)	{
		DeleteoRedoOneRecord(0);
		lngRedo=7; //��0-7
	}		
}
/**
*����һ��oUndo����ļ�¼�����Ƚ��ȳ��Ĺ��򣬱���ֻ��8����¼
**/
function SaveoUndoOneRecord(){
	if(tabLeftHead.rows.length * tabTopHead.rows(0).cells.length > 2000 ) return;

	lngUndo=lngUndo+1 ;	
	//cmdUndo.disabled =false; //����undo
	var arr =[];
	arr[0]=$id("t").outerHTML;
	arr[1]=tabTopHead.outerHTML;
	arr[2]=tabLeftHead.outerHTML;
	arr[3]=SelObj;
	arr[4]=getEditObj();
	oUndo[oUndo.length] = arr ;
	if (oUndo.length >8)	{
		DeleteoUndoOneRecord(0);
		lngUndo=7; //��0-7
	}	
}
/**
*����һ��oUndo����ļ�¼	
**/
function ReadoRedoOneRecord(lngKey){
	$id("t").outerHTML = oRedo[lngKey][0];
	tabTopHead.outerHTML = oRedo[lngKey][1];
	tabLeftHead.outerHTML = oRedo[lngKey][2];
	SelObj = oRedo[lngKey][3];
	setEditObj(oRedo[lngKey][4]);

}
/**
*����һ��oUndo����ļ�¼	
**/
function ReadoUndoOneRecord(lngKey){
	$id("t").outerHTML = oUndo[lngKey][0];
	tabTopHead.outerHTML = oUndo[lngKey][1];
	tabLeftHead.outerHTML = oUndo[lngKey][2];
	SelObj = oUndo[lngKey][3];
	setEditObj(oUndo[lngKey][4]);
	
}
/**
*ɾ��Redoһ�м�¼�����Ƚ���ɾ�Ĺ��򣬱���ֻ��8����¼
* intR=0ɾ����һ���ڵ�
**/
function DeleteoRedoOneRecord(intR){
	//oRedo.documentElement.removeChild(oRedo.documentElement.childNodes.item(intR))	
	oRedo.slice(1);
}
/**
*ɾ��Undoһ�м�¼�����Ƚ���ɾ�Ĺ��򣬱���ֻ��8����¼
* intR=0ɾ����һ���ڵ�
**/
function DeleteoUndoOneRecord(intR){
	//oUndo.documentElement.removeChild(oUndo.documentElement.childNodes.item(intR))	
	oUndo.slice(1);
}
/**
*�������ϵ�Redo��ť�ĵ���¼�
**/

function cmdRedo(){		
	var intMaxR=oRedo.length - 1 ; //��ǰoRedo�����е�����¼��
	if (lngRedo>=0 && lngRedo<=intMaxR){
		ReadoRedoOneRecord(lngRedo); //������ǰundo��Ӧ��ֵ
		lngUndo=lngRedo;
		lngRedo=lngRedo+1;
		//cmdUndo.disabled =false; //����һ��redo��undo�϶�������

	}
	//if (lngRedo>intMaxR && lngRedo<0){
	//	cmdRedo.disabled =true; //�϶�������redo�Ĺ���
	//}	
}
/**
*�������ϵ�Undo��ť�ĵ���¼�
**/
function cmdUndo(){	
	var intMaxR=oUndo.length - 1//��ǰoRedo�����е�����¼��
	if (lngUndo>=0 && lngUndo<=intMaxR){
		ReadoUndoOneRecord(lngUndo)	;	
		lngRedo=lngUndo;
		lngUndo=lngUndo - 1	;
		//cmdRedo.disabled =true; //����һ��undo��redo�϶�������
		
	}
	//if (lngUndo<=0 && lngUndo>intMaxR){
	//	cmdUndo.disabled =true; //undo�϶���������
	//}
	//if (lngUndo>=intMaxR && lngUndo<0){
	//	cmdRedo.disabled =true; //redo�϶���������
	//}
}
/**
����undoʱ�ָ��ֳ�
**/
function getEditObj(){
	var obj = new Object();
	obj.line0=tLine[0].style.cssText;
	obj.line1=tLine[1].style.cssText;
	obj.line2=tLine[2].style.cssText;
	obj.line3=tLine[3].style.cssText;
	obj.text = txtEdit.style.cssText;
	obj.textvalue = txtEdit.value;
	return obj;
}
function setEditObj(obj){
	tLine[0].style.cssText = obj.line0;
	tLine[1].style.cssText = obj.line1;
	tLine[2].style.cssText = obj.line2;
	tLine[3].style.cssText = obj.line3;
	txtEdit.style.cssText = obj.text;
	txtEdit.value = obj.textvalue;
}