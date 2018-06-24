<%@ page import="cn.com.fcsoft.user.UserManager,
                 cn.com.fcsoft.user.UserException,
                 cn.com.fcsoft.base.Environment,
                 cn.com.fcsoft.user.provider.User,
                 java.sql.SQLException"%>
<%@ page contentType="text/html;charset=GBK"%>    
<%
	String ipad = request.getParameter("ipad");
%>             
<!DOCTYPE html>
<html>
    <head>
		<meta http-equiv="Content-Type" content="text/html; charset=GBK" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" /> 
        <title>eWorkflow 移动登录</title>
        <link rel="stylesheet" href="login_m.css" type="text/css"/>    
		<script type="text/javascript">
		function login(){
			frm.submit();
		}
		function on_load(){
			frm.username.focus();
		}
		</script>           
    </head>

    <body onload="on_load();">
    <form id="frm" method="POST" action="login_submit.jsp">
    <input type="hidden" name="ipad" value="<%=ipad%>"></input>
    	<div class="header"><div class="htitle">eworkflow登录</div></div>
		<div class="container">
	    <% if (request.getParameter("auth_failed")!=null && request.getParameter("auth_failed").equals("true")) { %>
        <div style="padding:10px 0px 10px 0px;color:red;" align="center" >用户名或密码错误，请重新输入！</div>
    	<% } %>		
				<div class="div_login">
					<span><b>用户：</b></span><br/>
					<input name="username" type="text" value=""><br/>	
					<br/>		
					<span><b>密码：</b></span><br/>
					<input name="password" type="password" value="" ><br/>
					<br/>
				</div>
				<div class="div_but" align="center">
				<button class="loginBtn" onclick="login()">登 录</button>						
				</div>
			
		</div>  
		<div class="footer">
	    	<a href="login.jsp">手机登录</a><span style="margin:0 10px;">|</span><a href="login.jsp?ipad=1">平板登录</a>
	    	<div class="gray">Copyright &copy; 2013 www.fcsoft.com.cn</div>
	    </div> 
    </form>
    </body>
</html>
