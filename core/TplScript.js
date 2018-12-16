const {
	TYPE_CONTENT,
	TYPE_LOCAL,
	TYPE_GLOBAL,
	TYPE_SET,
	TYPE_CONFIG,
	Lexer2
} = require("./lexer.js");
const path = require("path");
const fs = require("fs");
const vm = require('vm');

function doListFileRecursive(pathStr, list) {
	if(!fs.existsSync(pathStr)) {
		return;
	}
	var stat = fs.statSync(pathStr);
	if(stat.isFile()) {
		list.push(pathStr);
	} else {
		var files = fs.readdirSync(pathStr);
		files.forEach((item) => doListFileRecursive(path.join(pathStr, item), list));
	}
}

let exeIdCount = 0;

function genScript(baseOutDir, lexer2, globalContextMap, currentFile, includeDeep, includeSuffix, encoding) {
	let scriptLocalQueue = [];
	let scriptCurrentQueue = [];

	let contextMap = {};

	let __xs_code_gen_bridge__ = {
		content: {},
		getContent(id) {
			let value = this.content[id];
			return value;
		}
	};

	for(let name in globalContextMap) {
		contextMap[name] = globalContextMap[name];
	}
	contextMap.__xs_code_gen_bridge__ = __xs_code_gen_bridge__;
	contextMap.console = console;

	let outPath = path.join(baseOutDir, path.basename(currentFile, path.extname(currentFile))) + ".txt";
	let write = true;
	let execute = undefined;
	for(let i = 0; i < lexer2.length; i++) {
		let item = lexer2.get(i);
		let valId = "var-" + (exeIdCount++);

		switch(item.type) {
			case TYPE_CONTENT:
				{
					__xs_code_gen_bridge__.content[valId] = item.value;
					scriptLocalQueue.push('out.print(__xs_code_gen_bridge__.getContent("' + valId + '"));');
				}
				break;
			case TYPE_LOCAL:
				{
					scriptLocalQueue.push(item.value);
				}
				break;
			case TYPE_GLOBAL: //全局脚本
				{
					scriptCurrentQueue.push(item.value);
				}
				break;
			case TYPE_SET:
				{
					let keyName = item.value;
					scriptLocalQueue.push('out.print(' + keyName + ');');
				}
				break;
			case TYPE_CONFIG:
				{
					let attrs = item.value;
					for(let name in attrs) {
						var attrValue = attrs[name];

						if(attrValue) { //处理属性
							let strPast = "";
							while(true) {
								var rs = /\$\{([a-zA-Z0-9_.$-]+)\}/.exec(attrValue);
								if(rs) {
									let varName = rs[1];
									strPast += attrValue.substring(0, rs.index);
									strPast += contextMap[varName] === undefined || contextMap[varName] === null ? "" : contextMap[varName];
									attrValue = attrValue.substring(rs.index + rs[0].length);
								} else {
									strPast += attrValue;
									break;
								}
							}
							attrValue = strPast;
						}
						if(/^$\{[a-zA-Z0-9_.$-]+\}$/.test(attrValue)) {
							attrValue = contextMap[attrValue.substring(2, attrValue.length - 1)];

						}
						if(attrValue === null || attrValue === undefined) {
							console.log("attr " + name + " is empty:file=" + currentFile);
							continue;
						}
						switch(name) {
							case "out": //设置输出文件
								outPath = path.join(baseOutDir, attrValue);
								break;
							case "write":
								if(attrValue === "false" || attrValue === false || attrValue === "0") {
									write = false;
								} else {
									write = true;
								}
								break;
							case "execute":
								if(attrValue === "false" || attrValue === false || attrValue === "0") {
									execute = false;
								} else {
									execute = true;
								}
								break;
							case "include": //导入子模板
								if(includeDeep > 100) {
									throw new Error("include too deep:" + includeDeep);
								} else {
									let file = _getPath(path.dirname(currentFile), attrValue + (path.extname(attrValue) == includeSuffix ? "" : includeSuffix));
									let rs = _exeScript(baseOutDir, file, globalContextMap, includeDeep, includeSuffix, encoding);
									if(rs.write) {
										__xs_code_gen_bridge__.content[valId] = rs.content;
										scriptLocalQueue.push('out.print(__xs_code_gen_bridge__.getContent("' + valId + '"));');
									}
								}
								break;
						}
					}
				}
				break;
		}
	}

	execute = execute === undefined || write ? write : execute;
	var buffers = [];
	if(execute) {

		let script;
		let code;
		let context = vm.createContext(contextMap);
		let options = {
			timeout: 60 * 1000
		};

		code = scriptCurrentQueue.join("\n");
		if(code) {
			//执行 全局脚本
			script = new vm.Script(code, options);
			script.runInContext(context);
		}

		let globalKeys = {};
		for(let name in contextMap) {
			globalKeys[name] = true;
		}

		contextMap.out = {
			print(...objs) {
				for(let i = 0; i < objs.length; i++) {
					buffers.push(objs[i]);
				}
			},
			println(...objs) {
				this.print.apply(this, objs);
				buffers.push("\n");
			}
		}

		//执行局部脚本
		code = "(function(){\n" + scriptLocalQueue.join("\n") + "\n})();";
		script = new vm.Script(code, options);
		script.runInContext(context);

		for(let name in globalContextMap) {
			delete globalContextMap[name];
		}
		for(let name in globalKeys) {
			if(name != "out" && name != "console") {
				globalContextMap[name] = contextMap[name];
			}
		}
	}

	return {
		content: buffers.join(""),
		out: outPath,
		write: write,
		execute: execute
	};
}

function _getPath(base, pathStr) {
	if(!pathStr) {
		return base;
	}
	pathStr = pathStr.replace("/", path.sep);
	if(pathStr.charAt(0) == path.sep || pathStr.indexOf(":") > 0) {
		return pathStr;
	} else {
		return path.join(base, pathStr);
	}
}

function _exeScript(baseOutDir, file, globalContextMap, includeDeep, includeSuffix, encoding = 'utf-8') {
	let str = fs.readFileSync(file, {
		encoding
	});
	let lexer2 = new Lexer2(str);
	lexer2.analyze();

	var rs = genScript(baseOutDir, lexer2, globalContextMap, file, includeDeep + 1, includeSuffix, encoding);

	return rs;
};

module.exports = {
	getPath: _getPath,
	exeScript(baseOutDir, file, globalContextMap, includeSuffix, encoding) {
		return _exeScript(baseOutDir, file, globalContextMap, 0, includeSuffix, encoding)
	},
	listFileRecursive(base, dir) {
		if(dir !== undefined) {
			dir = this.getPath(base, dir);
		} else {
			dir = base;
		}
		var as = [];
		doListFileRecursive(dir, as);
		return as;
	}
};