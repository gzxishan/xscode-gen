{
	"tpl": "../tpl/test2",
	"out": "./out2",
	"attrs": {
		"package_path": "cn/xishan/test2",
		"package_name": "cn.xishan.test2",
		"moduleName": "TestModule",
		"moduleDirName": "testmodule",
		"tableName": "xs_g2d1_testtable",
		"author": "chenyg",
		"moduleFields": {
			"nece": ["name", {
				"name": "birthday",
				"type": "java.util.Date"
			}],
			"unece": ["description"],
			"field": [{
				"name": "state",
				"type": "Integer"
			}]
		},
		"currentTime": (function() {
			let d = new Date();
			let timeStr = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" +
				(d.getDate()) + " " + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
			return timeStr;
		})()
	}
}