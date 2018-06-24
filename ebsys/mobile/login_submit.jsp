<%@ page import="cn.com.fcsoft.user.UserManager,
                 cn.com.fcsoft.user.UserException,
                 cn.com.fcsoft.base.Environment,
                 cn.com.fcsoft.user.provider.User,
                 java.sql.SQLException"%>
<%@ page contentType="text/html;charset=GBK"%>                 
<%
	String usercode = request.getParameter("username");
	String password = request.getParameter("password");
	//String browser = request.getParameter("browsertype");
	
	//将使用场景存到session
	//if (browser.equals("msie"))
	//	session.setAttribute("scenekey","电脑");//PC,mobilePhone,tabletPC --PC机，手机应用，平板电脑	
	// else 
	//	session.setAttribute("scenekey","手机");
	
	   
	String ipad = request.getParameter("ipad");
	String url = "";
	if (ipad!=null && ipad.equals("1"))//是平板登录
	    url = "ipad=1";
	
	Environment env = new Environment(request);
	
	try {
	    boolean authenticated = false;   
	    UserManager um = new UserManager(env);
		User user = um.findUserByCode(usercode);
		
	
		if (user!=null)
			authenticated = user.checkPassword(password);
		
	    if (authenticated) {
	        //eworkflow工作流引擎中使用
		    session.setAttribute("userid",user.getId());
		    session.setAttribute("username",user.getName());
		    session.setAttribute("grantorid","");//清空代理人id
	        
			
			//eform表单中的系统函数使用，值的顺序：用户.ID,用户.名称,用户建档...;
			String sValue = "用户.ID="+user.getId() + "," + "用户.名称="+user.getName() + ",系统.单位名称=北京正康方成软件有限公司"; 
			cn.com.fcsoft.report.ext.EformRole er = new cn.com.fcsoft.report.ext.EformRole(request);
			er.loginAfter(sValue,request);
			
			if (!url.equals("")) 
				url = "&" + url;
	          
	        response.sendRedirect("main.htm?suffix=jsp" +url);
			
	    } else {	 
			if (!url.equals("")) 
				url = "&" + url;
	    	response.sendRedirect("login.jsp?auth_failed=true" + url);
	    }               
	
	    env.commitConnection();
	} catch (UserException e) {
			e.printStackTrace();    	
			try{
				env.rollbackConnection();
			}catch(SQLException ee){
				
			}
	}
	finally{
		try{
			env.closeConnection();
		}catch (SQLException ee){}
	}	

%>