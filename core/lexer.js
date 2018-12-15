const Lexer1_TYPE_STRING = "String";
const Lexer1_TYPE_OTHER = "Other";
const Lexer1_TYPE1 = "<%!";
const Lexer1_TYPE2 = "<%=";
const Lexer1_TYPE3 = "<%@";
const Lexer1_TYPE4 = "<%";
const Lexer1_TYPE5 = "%>";

function Lexer1(content) {
	let parts = [];
	let cache = [];
	let index = -1;

	this.length = 0;
	this.analyze = function() {
		goNext(start);
		if(cache.length) {
			newPartAndNext(Lexer1_TYPE_OTHER);
		}
		this.length = parts.length;
	};

	this.get = function(index) {
		return parts[index];
	};

	/**
	 * 
	 * @param {Function} stateFun 下一个状态
	 * @param {Object} 
	 */
	function goNext(stateFun, isEffect) {
		if(isEffect) {
			stateFun();
		} else {
			index++;
			if(index < content.length) {
				cache.push(get());
				stateFun();
			}
		}
	}

	function get() {
		return content[index];
	}

	/**
	 * 
	 * @param {Object} type
	 * @param {Object} backStep 回退的步数
	 */
	function newPartAndNext(type, backStep) {
		if(backStep) {
			index -= backStep;
			cache.splice(cache.length - backStep, backStep);
		}
		var part = {
			type: type,
			value: cache.join("")
		};
		cache = [];
		parts.push(part);
		goNext(start);
		return part;
	}

	function start() {
		switch(get()) {
			case "<":
				goNext(state1);
				break;
			case "%":
				goNext(state9);
				break;
			case "'":
				goNext(state11);
				break;
			case "\"":
				goNext(state12);
				break;
			default:
				goNext(state7);
				break;
		}
	}

	function state1() {
		var c = get();
		if(c == "%") {
			goNext(state2)
		} else if(c == "'" || c == "\"") {
			goNext(state8);
		} else {
			goNext(state7);
		}
	}

	function state2() {
		switch(get()) {
			case "!":
				goNext(state3_effect, true);
				break;
			case "=":
				goNext(state4_effect, true);
				break;
			case "@":
				goNext(state5_effect, true);
				break;
			default:
				goNext(state6_effect, true);
		}
	}

	function state3_effect() {
		newPartAndNext(Lexer1_TYPE1);
	}

	function state4_effect() {
		newPartAndNext(Lexer1_TYPE2);
	}

	function state5_effect() {
		newPartAndNext(Lexer1_TYPE3);
	}

	function state6_effect() {
		newPartAndNext(Lexer1_TYPE4, 1);
	}

	function state7() {
		switch(get()) {
			case "'":
			case "\"":
			case "<":
			case "%":
				goNext(state8_effect, true);
				break;
			default:
				goNext(state7);
		}
	}

	function state8_effect() {
		newPartAndNext(Lexer1_TYPE_OTHER, 1);
	}

	function state9() {
		if(get() == ">") {
			goNext(state10_effect, true);
		} else {
			goNext(state7);
		}
	}

	function state10_effect() {
		newPartAndNext(Lexer1_TYPE5);
	}

	function isNewLine() {
		return /[\r\n]/.test(get());
	}

	function state11() {
		if(isNewLine()) {
			goNext(state8_effect, true);
		} else if(get() == "'") {
			goNext(state13_effect, true);
		} else {
			goNext(state11);
		}
	}

	function state12() {
		if(isNewLine()) {
			goNext(state8_effect, true);
		} else if(get() == "\"") {
			goNext(state13_effect, true);
		} else {
			goNext(state12);
		}
	}

	function state13_effect() {
		newPartAndNext(Lexer1_TYPE_STRING);
	}
}

/////////////////////////////
const LexerConfig_TYPE_ATTR = "attr";
const LexerConfig_TYPE_EQ = "=";
const LexerConfig_TYPE_VALUE = "value";

function LexerConfig(content) {

	let parts = [];
	let cache = [];
	let index = -1;

	this.length = 0;

	this.analyze = function() {
		goNext(start);
		this.length = parts.length;
	};
	this.get = function(index) {
		return parts[index];
	};

	function isName() {
		return /[a-zA-Z0-9_.$-]/.test(get());
	}

	/**
	 * 
	 * @param {Function} stateFun 下一个状态
	 */
	function goNext(stateFun, isEffect) {
		if(isEffect) {
			stateFun();
		} else {
			index++;
			if(index < content.length) {
				cache.push(get());
				stateFun();
			}
		}
	}

	/**
	 * 
	 * @param {Object} type
	 * @param {Object} backStep backStep 为0或undefind表示push当前字符到cache、并把index增加1，否则表示回退
	 */
	function newPartAndNext(type, backStep, ignore) {
		if(!ignore) {
			if(backStep) {
				index -= backStep;
				cache.splice(cache.length - backStep, backStep);
			}
			if(type == LexerConfig_TYPE_VALUE) { //移除引号
				cache.splice(0, 1);
				cache.splice(cache.length - 1, 1);
			}
			var part = {
				type: type,
				value: cache.join("")
			};
			parts.push(part);
		}
		cache = [];
		goNext(start);
		return part;
	}

	function get() {
		return content[index];
	}

	function start() {

		switch(get()) {
			case "'":
				goNext(state2);
				break;
			case "\"":
				goNext(state4);
				break;
			case "=":
				goNext(state7_effect, true);
				break;
			default:
				if(isName()) {
					goNext(state1);
				} else {
					goNext(state8_effect, true);
				}
				break;
		}
	}

	function state1() {
		if(!isName()) {
			goNext(state6_effect, true);
		} else {
			goNext(state1);
		}
	}

	function state2() {
		if(get() == "'") {
			goNext(state3_effect, true);
		} else {
			goNext(state2);
		}
	}

	function state3_effect() {
		newPartAndNext(LexerConfig_TYPE_VALUE);
	}

	function state4() {
		if(get() == "\"") {
			goNext(state5_effect, true);
		} else {
			goNext(state4);
		}
	}

	function state5_effect() {
		newPartAndNext(LexerConfig_TYPE_VALUE);
	}

	function state6_effect() {
		newPartAndNext(LexerConfig_TYPE_ATTR, 1);
	}

	function state7_effect() {
		newPartAndNext(LexerConfig_TYPE_EQ);
	}

	function state8_effect() {
		//忽略
		newPartAndNext(undefined, undefined, true);
	}

}

/////////////////////////

const TYPE_CONTENT = "Content";
const TYPE_LOCAL = "<%%>";
const TYPE_GLOBAL = "<%!%>";
const TYPE_SET = "<%=%>";
const TYPE_CONFIG = "<%@%>";

function trimRL(str) {
	if(str) {
		str = str.replace(/((\r\n)|(\n)|(\r))$/g, "");
	}
	return str;
};

function trimLL(str) {
	if(str) {
		str = str.replace(/^((\r\n)|(\n)|(\r))/g, "");
	}
	return str;
};

function Lexer2(content) {
	let lexer1 = new Lexer1(content);
	lexer1.analyze();

	let parts = [];
	let cache = [];
	let index = -1;

	this.length = 0;
	this.analyze = function() {
		goNext(start);
		if(cache.length) {
			newPartAndNext(TYPE_CONTENT);
		}
		this.length = parts.length;
		for(let i = 0; i < parts.length - 1; i++) {
			let part = parts[i];
			if(part.type == TYPE_CONTENT && parts[i + 1].type != TYPE_CONTENT) {
				part.value = trimRL(part.value);
			}
		}
	};
	this.get = function(index) {
		return parts[index];
	};

	/**
	 * 
	 * @param {Function} stateFun 下一个状态
	 */
	function goNext(stateFun, isEffect) {
		if(isEffect) {
			stateFun();
		} else {
			index++;
			if(index < lexer1.length) {
				cache.push(lexer1.get(index));
				stateFun();
			}
		}
	}

	function get() {
		var v = lexer1.get(index);
		return v && v.type;
	}

	/**
	 * 
	 * @param {Object} type
	 * @param {Object} backStep backStep 为0或undefind表示push当前字符到cache、并把index增加1，否则表示回退
	 */
	function newPartAndNext(type, backStep) {
		if(backStep) {
			index -= backStep;
			cache.splice(cache.length - backStep, backStep);
		}
		if(type != TYPE_CONTENT) { //移除包裹的关键字
			cache.splice(0, 1);
			cache.splice(cache.length - 1, 1);
		}
		var as = []
		for(let i = 0; i < cache.length; i++) {
			let value = cache[i].value;
			as.push(value);
		}
		var part = {
			type: type,
			value: as.join("")
		};
		cache = [];
		parts.push(part);
		goNext(start);
		return part;
	}

	function start() {
		switch(get()) {
			case "<%":
				goNext(state1);
				break;
			case "<%!":
				goNext(state2);
				break;
			case "<%=":
				goNext(state3);
				break;
			case "<%@":
				goNext(state4);
				break;
			default:
				goNext(state9);
				break;
		}
	}

	function isEffectStart() {
		switch(get()) {
			case "<%":
			case "<%!":
			case "<%=":
			case "<%@":
				return true;
			default:
				return false;
		}
	}

	function state1() {
		if(isEffectStart()) {
			goNext(state10_effect, true);
		} else {
			switch(get()) {
				case "%>":
					goNext(state5_effect, true);
					break;
				default:
					goNext(state1);
					break;
			}
		}
	}

	function state2() {
		if(isEffectStart()) {
			goNext(state10_effect, true);
		} else {
			switch(get()) {
				case "%>":
					goNext(state6_effect, true);
					break;
				default:
					goNext(state2);
					break;
			}
		}
	}

	function state3() {
		if(isEffectStart()) {
			goNext(state10_effect, true);
		} else {
			switch(get()) {
				case "%>":
					goNext(state7_effect, true);
					break;
				default:
					goNext(state3);
					break;
			}
		}
	}

	function state4() {
		if(isEffectStart()) {
			goNext(state10_effect, true);
		} else {
			switch(get()) {
				case "%>":
					goNext(state8_effect, true);
					break;
				default:
					goNext(state4);
					break;
			}
		}
	}

	function state5_effect() {
		newPartAndNext(TYPE_LOCAL);
	}

	function state6_effect() {
		newPartAndNext(TYPE_GLOBAL);
	}

	function state7_effect() {
		var part = newPartAndNext(TYPE_SET);
		part.value && (part.value = part.value.trim());
	}

	function state8_effect() {
		let part = newPartAndNext(TYPE_CONFIG);
		let lc = new LexerConfig(part.value);
		lc.analyze();
		var attrs = {};
		for(let i = 0; i < lc.length; i++) {
			let name = lc.get(i);
			let eq = lc.get(i + 1);
			let val = lc.get(i + 2);
			if(name.type == LexerConfig_TYPE_ATTR) {
				let value;
				if(eq && eq.type == LexerConfig_TYPE_EQ && val && val.type == LexerConfig_TYPE_VALUE) {
					value = val.value;
				}
				attrs[name.value] = value;
			}
		}
		part.value = attrs;
	}

	function state9() {
		if(isEffectStart()) {
			goNext(state10_effect, true);
		} else {
			goNext(state9);
		}
	}

	function state10_effect() {
		newPartAndNext(TYPE_CONTENT, 1);
	}

}

module.exports = {
	TYPE_CONTENT,
	TYPE_LOCAL,
	TYPE_GLOBAL,
	TYPE_SET,
	TYPE_CONFIG,
	Lexer2
};