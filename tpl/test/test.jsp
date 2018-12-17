<%@ out="test.html" %>
<html>
<title><%=title%></title>
<%@ include="notwrite-execute" %>
<%@ include="write" %>
<%
	for(let i=0;i<10;i++){	
%>
<span><%=i%></span><%}%>
</html>