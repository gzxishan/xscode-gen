
const fs = require("fs");
const path = require("path");


const tplScript = require("./core/TplScript.js");
const args = process.argv.splice(2);

const configFile = tplScript.getPath(__dirname, args && args[0] || "./build/config.json");
const BASE_DIR = path.dirname(configFile);
const tplConfig = eval("(" + fs.readFileSync(configFile, {
	encoding: "utf-8"
}) + ")");


const BASE_OUT_DIR = tplScript.getPath(BASE_DIR, tplConfig.out);
const encoding = tplConfig.encoding || "utf-8";
const outEncoding = tplConfig.outEncoding || encoding;
const includeSuffix = tplConfig.includeSuffix || ".include";
const tplSuffix = tplConfig.tplSuffix || ".jsp";
const tplPaths = tplScript.listFileRecursive(BASE_DIR, tplConfig.tpl);

if(includeSuffix == tplSuffix) {
	throw new Error("unexpected:includeSuffix == tplSuffix");
}

const globalContext = tplConfig.attrs || {};

tplPaths.forEach((file) => {
	if(path.extname(file) == tplSuffix) {
		console.log("handle template:", file);
		let result = tplScript.exeScript(BASE_OUT_DIR, file, globalContext, includeSuffix, encoding);
		let outFile = result.out;
		let content = result.content;
		console.log("write file:", outFile);
		createFileSync(outFile);
		fs.writeFileSync(outFile, content, {
			encoding: outEncoding
		});
	}
});

function createFileSync(file) {
	if (!fs.existsSync(file)) {
		mkdirsSync(path.dirname(file));
	}
}

function mkdirsSync(dir) {
	if (!fs.existsSync(dir)) {
		mkdirsSync(path.dirname(dir));
		fs.mkdirSync(dir);
	}
}