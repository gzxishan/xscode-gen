<%@
//设置输出文件
out="webapp/back/${moduleDirName}/main/edit.js"
%>
define(["xsdk",  "pageReady!"], function(sdk) {
	var editHandler = sdk.xsSimpleEdit({
		urlPrefix: lconfig.sporter,
		method: "post",
		form: "#editForm",
		onConnected: function(initData, option) {
			option.path = "<%=moduleName%>/save";
			var handle = this;
			if(initData && initData.id) {
				sdk.xsGetItem({
					urlPrefix: lconfig.sporter,
					path: "<%=moduleName%>/getById?id=" + initData.id,
					onSuccess: function(item) {
						handle.putValues(item);
					}
				});
			} else {

			}
		},
		toSave: function() {
			var thiz = this;
			thiz.submit();
		}
	});

});