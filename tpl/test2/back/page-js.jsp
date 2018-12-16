<%@
//设置输出文件
out="webapp/back/${moduleDirName}/main/index.js"
%>
define(["xsdk", "ela-page", "pageReady!"], function(sdk) {
	var that = this;
	var option = {
		cols: [{
				title: "序号",
				field: function(item, col, index) {
					return index + 1;
				},
				width: "50px"
			}, {
				title: "<%=moduleName%>名称",
				field: "name",
				width: "250px"
			},
			{
				title: function() {
					var btns = [];
					btns.push(sdk.widget().genButton({
						text: "刷新",
						size: "small",
						type: "default",
						radius: false,
						click: function() {
							tableHandle.flush();
						}
					}).done());

					btns.push(sdk.widget().genButton({
						text: "+添加<%=moduleName%>",
						size: "small",
						type: "default",
						radius: false,
						click: function() {
							sdk.xsSimpleEdit({
								title: "添加<%=moduleName%>信息",
								size: ["515px", "420px"],
								url: that.getUrl("../edit.html"),
								initData: {
									cid: null
								},
								onResult: function(isOk) {
									if(isOk) {
										tableHandle.flush();
										this.close();
									}
								}
							});
						}
					}).done());

					return btns;
				},
				fixed: "right",
				width: "180px",
				align: "left",
				isText: false,
				field: function(item) {
					var btns = [];
					btns.push(sdk.widget().genButton({
						text: "编辑",
						size: "small",
						type: "default",
						radius: false,
						click: function() {
							sdk.xsSimpleEdit({
								title: "编辑<%=moduleName%>信息",
								size: ["515px", "420px"],
								url: that.getUrl("../edit.html"),
								initData: {
									id: item.id
								},
								onResult: function(isOk) {
									if(isOk) {
										tableHandle.flush();
										this.close();
									}
								}
							});
						}
					}).done());

					btns.push(sdk.widget().genButton({
						text: "删除",
						size: "small",
						type: "danger",
						radius: false,
						click: function() {
							sdk.useTop().confirm({
								content: "是否删除<%=moduleName%>[" + item.name + "]?",
								type: "error",
								onOk: function() {
									sdk.useTop().deleteWithLoading(lconfig.sporter + "<%=moduleName%>/deleteById?id=" + item.id, tableHandle.flush);
								}
							}).done();
						}
					}).done());
					return $(btns);
				}
			}
		],
		container: "#tableContainer",
		url: lconfig.sporter + "<%=moduleName%>/listTable",
		hasPage: true,
		size: "normal",
		notToggle: true,
		attrTitle: true,
		sortMulti: false,
		height: "full-2",
		flushBy: "#flushButton",
		bindForm: ["#searchForm", "#searchBtn"]
	};
	var tableHandle = sdk.table(option).done();
});