<%@ out="dao.xml" %>
<html>
<title><%=title%></title>
<%@ include="test.include" %>
<%
	for(let i=0;i<10;i++){	
%>
<span><%=i%></span>
<%}%>
</html>
