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

	let outPath = _getPath(baseOutDir, path.basename(currentFile, path.extname(currentFile))) + ".txt";
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
						switch(name) {
							case "out": //设置输出文件
								{
									outPath = _getPath(baseOutDir, attrs[name]);
								}
								break;
							case "include": //导入子模板
								if(includeDeep > 100) {
									throw new Error("include too deep:" + includeDeep);
								} else {
									let file = _getPath(path.dirname(currentFile), attrs[name] + (path.extname(attrs[name]) == includeSuffix ? "" : includeSuffix));
									let rs = _exeScript(baseOutDir, file, globalContextMap, includeDeep, includeSuffix, encoding);
									__xs_code_gen_bridge__.content[valId] = rs.content;
									scriptLocalQueue.push('out.print(__xs_code_gen_bridge__.getContent("' + valId + '"));');
								}
								break;
						}
					}
				}
				break;
		}
	}

	let code;
	let options = {
		timeout: 60 * 1000
	};

	//执行当前脚本
	code = scriptCurrentQueue.join("\n");
	let context = vm.createContext(contextMap);
	let script = new vm.Script(code, options);
	script.runInContext(context);

	let globalKeys = {};
	for(let name in contextMap) {
		globalKeys[name] = true;
	}

	var buffers = [];
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
		if(name != "out") {
			globalContextMap[name] = contextMap[name];
		}
	}

	return {
		content: buffers.join(""),
		out: outPath
	};
}

function _getPath(base, pathStr) {
	if(!pathStr) {
		return base;
	}
	pathStr = pathStr.replace("/", path.sep);
	if(pathStr.charAt(0) == path.sep) {
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