<%@
//设置输出文件
out="webapp/back/${moduleDirName}/edit.html"
%>
<!DOCTYPE html>
<html>

	<head>
		<meta charset="UTF-8">
		<title>编辑<%=moduleName%>信息</title>
		<script src="../../xsloader.js" data-xsloader-conf2="./xsloader.config" async="async" type="text/javascript" charset="utf-8"></script>
	</head>

	<body style="background: #f8f8f8;">
		<div class="body" style="display: none;">
			<form id="editForm" class="layui-form layui-form-pane">
				<input type="hidden" name="id" />
				<div class="layui-form-item">
					<label class="layui-form-label"><%=moduleName%>名称</label>
					<div class="layui-input-block">
						<input type="text" name="name" required maxlength="16" required="required" xs-validate-errmsg="<%=moduleName%>名称不能为空" placeholder="请输入<%=moduleName%>名称" autocomplete="off" class="layui-input">
					</div>
				</div>
				<div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">描述</label>
                    <div class="layui-input-block">
                        <textarea name="description" maxlength="512" placeholder="" class="layui-textarea"></textarea>
                    </div>
                </div>
			</form>
		</div>

	</body>

</html>