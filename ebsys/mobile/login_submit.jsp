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
	
	//��ʹ�ó����浽session
	//if (browser.equals("msie"))
	//	session.setAttribute("scenekey","����");//PC,mobilePhone,tabletPC --PC�����ֻ�Ӧ�ã�ƽ�����	
	// else 
	//	session.setAttribute("scenekey","�ֻ�");
	
	   
	String ipad = request.getParameter("ipad");
	String url = "";
	if (ipad!=null && ipad.equals("1"))//��ƽ���¼
	    url = "ipad=1";
	
	Environment env = new Environment(request);
	
	try {
	    boolean authenticated = false;   
	    UserManager um = new UserManager(env);
		User user = um.findUserByCode(usercode);
		
	
		if (user!=null)
			authenticated = user.checkPassword(password);
		
	    if (authenticated) {
	        //eworkflow������������ʹ��
		    session.setAttribute("userid",user.getId());
		    session.setAttribute("username",user.getName());
		    session.setAttribute("grantorid","");//��մ�����id
	        
			
			//eform���е�ϵͳ����ʹ�ã�ֵ��˳���û�.ID,�û�.����,�û�����...;
			String sValue = "�û�.ID="+user.getId() + "," + "�û�.����="+user.getName() + ",ϵͳ.��λ����=������������������޹�˾"; 
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