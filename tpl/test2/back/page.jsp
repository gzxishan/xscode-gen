<%@
//设置输出文件
out="webapp/back/${moduleDirName}/index.html"
%>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="description" content="">
		<meta name="author" content="">
		<title><%=moduleName%></title>
		<script src="../../xsloader.js" data-xsloader-conf2="./xsloader.config" async="async" type="text/javascript" charset="utf-8"></script>
	</head>

	<body>
		<div class="container-fluid body" style="padding-bottom: 0;display:none;">
			<div class="row">
				<div class="col-lg-12">
					<div id="tableContainer"></div>
				</div>
			</div>
		</div>

	</body>

</html>