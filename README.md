# xscode-gen

# 帮助文档

## 一、使用
1. 安装node环境
2. node main.js 配置文件路径
<br>
说明：配置文件路径默认为:build/config.json

## 二、配置文件说明
```
{
	"tpl": "../tpl/g2d1",
	"out": "./out",
	"encoding": "utf-8",
	"outEncoding": "utf-8",
	"includeSuffix": ".include",
	"tplSuffix": ".jsp",
	"attrs":{
		"title":"你啊号啊"
	}
}
```
- tpl：模板目录，相对于配置文件所在目录,也可是绝对路径。
- out：输出目标目录，相对于配置文件所在目录,也可是绝对路径。
- encoding：模板文件的编码方式，默认utf-8。
- outEncoding：输出文件的编码方式，默认等于encoding。
- includeSuffix：导入子模板文件的后缀名，默认".include"，不能和tplSuffix相等。
- tplSuffix：模板文件后缀名，默认".jsp"。
- attrs：属性，可以在脚本里直接访问，可以包括函数与对象。

## 三、脚本说明
脚本语言为JavaScript。

### 1)设置：<%@ %>
在当前模板页脚本执行前进行设置。属性值支持通过${varName}引用变量。
```
<%@ write="true" include="${testInclude}" %>
```
- out：设置当前模板目标文件的输出目录，相对于输出目录。
- include：引入子模板，相对于当前模板文件,可以省略后缀名。
- write：是否写到目标文件，默认true。当取值为false或0时表示逻辑false，其余为true。

### 2)全局脚本：<%! %> 
全局脚本会先执行。

### 3)局部脚本：<% %>
内置变量为out:
- print：function(...args),输出内容
- println：function(...args),输出内容,增加换行

### 4)输出：<%=varName%>
输出变量内容。
