
var fcpubdata={	
	servletPath			: location.protocol+"//"+location.host + GetUrlFirstPart()+ "/servlet",//���ú�̨�ļ��Ļ�·�� for java ��д��
	//servletPath			: location.protocol+"//"+location.host + GetUrlFirstPart()+ "/ebsys/eformaspx",//���ú�̨�ļ��Ļ�·�� for dotnet��д��
	dotnetVersion       : "", 			//=""��ʾΪjava�汾,=".aspx"Ϊ.net�汾	
	Path				: location.protocol+"//"+location.host + GetUrlFirstPart()+"/ebsys"
	} ;
/**
* ȡ��ǰURL�ĵ�һ������,һ��������Ŀ¼������,��: /eworkflow
**/
function GetUrlFirstPart(){
	var tmp12345 = location.pathname ;
	tmp12345 = tmp12345.substring(0,tmp12345.indexOf("/",1));
	if(tmp12345.substring(0,1) != "/") tmp12345 = "/" +tmp12345;
	return tmp12345;
}

function SetDomFile(sPath) {
	var oXml=new ActiveXObject("Microsoft.XMLDOM");
	oXml.async=false;
	oXml.load(sPath);
	return oXml;
}

function SetDom(sXml) {
	var oXml=new ActiveXObject("Microsoft.XMLDOM");
	oXml.async=false;
	oXml.loadXML(sXml);
	return oXml;
}

/**
 * ��һ���Ի��������û�Ⱥ���ɫ��
 * @param argument����Ϊ null;
 * @param url
 */
function openWin(url,divid)
{
	//��¼�к�
	document.all.txtDivId.value = divid;
   	var sFeatures = "top=100,left=100,toolbar=no,width=620,height=400,directories=no,status=no,scrollbars=yes,resize=no,menubar=no"
	var rets = window.open(url,"",sFeatures);
	return rets;
}
/**
 * ��һ��ҳ��
 * @param argument����Ϊ null;
 * @param url
 */
function openWindow(url)
{
   	var sFeatures = "top=100,left=100,toolbar=no,width=620,height=400,directories=no,status=no,scrollbars=yes,resize=no,menubar=no"
	var rets = window.open(url,"",sFeatures);
	return rets;
}
//location : 1
//����Ƿ������֣���0
//������ �ַ���
//����һ��booleanֵ��
function IsInt(value){
	var returnValue = true;
	var re =  new RegExp("^([0-9]+)$");
	if(value.search(re) == -1)
	{
	returnValue=false;
	}
	return returnValue;
}
function repStr(mainStr,findStr,replaceStr){
    /**
    //�������ַ���

    **/
    if(typeof(mainStr)=="undefined" || mainStr == null) {return "";}

    var convertedString = mainStr.split(findStr);
    convertedString = convertedString.join(replaceStr);
    return convertedString;
}
//*************************************************************
// ���������� ����ajax���첽�ص���ʽ
// ���������� ��
// @date   �� 2005-10-14
//-------------------------------------------------------------
function SendHttp(url, data, callback, context){
	return ajax_request(url, data, callback, context);
}

var requests = new Array();

if(typeof(XMLHttpRequest) == 'undefined')
var XMLHttpRequest = function()
{
	var request = null;
	try
	{
		request = new ActiveXObject('Msxml2.XMLHTTP');
		request.setTimeouts(20000, 20000, 50000,100000);  
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

function ajax_request(url, data, callback, context)
{
	var request = ajax_create_request(context);
	var async = typeof(callback) == 'function';

	if(async) request.obj.onreadystatechange = function()
	{
		if(request.obj.readyState == 4)
			callback(new ajax_response(request));
	}
	
	request.obj.open('POST', url, async);
	//������ǰ��ͬ��д��
	request.obj.send("<root>"+data+"</root>");
	
	if(!async){

		var o = new ajax_response(request);
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
	}
	
	return this;
}

function enc(s)
{
	return s.toString().replace(/\%/g, "%26").replace(/=/g, "%3D");
}




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

function json_from_object(o)
{
	if(o == null)
		return 'null';

	switch(typeof(o))
	{
		case 'object':
			if(o.constructor == Array)		// checks if it is an array [,,,]
			{
				var s = '';
				for(var i=0; i<o.length; ++i)
				{
					s += json_from_object(o[i]);

					if(i < o.length -1)
						s += ',';
				}

				return '[' + s + ']';
			}
			break;
		case 'string':
			return '"' + o.replace(/(["\\])/g, '\\$1') + '"';
		default:
			return String(o);
	}
}var ajaxVersion = '5.6.3.4'
//-----------------------------------------------------------------------------------------------
