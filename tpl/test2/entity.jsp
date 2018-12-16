<%@
//设置输出文件
out="java/${package_path}/modules/${moduleDirName}/entity/${moduleName}.java"
%>
package <%=package_name%>.modules.<%=moduleDirName%>.entity;
<%
//获取类型的简单命名称
function getTypeName(type){
	if(!type){
		return "String";
	}
	let index=type.lastIndexOf(".");
	return index==-1?type:type.substring(index+1);
}

function isString(obj){
	return typeof obj == "string";
}
%>
import cn.xishan.oftenporter.porter.core.annotation.param.Nece;
import cn.xishan.oftenporter.porter.core.annotation.param.Unece;
import cn.xishan.oftenporter.porter.core.annotation.param.DBField;
import <%=package_name%>.common.db.TheBaseEntity;

<%
//导入包
if(moduleFields){
	function importType(array){
		if(!array){
			return;
		}
		for(let i=0;i<array.length;i++){
            let item=isString(array[i])?null:array[i];
            if(item&&item.type&&item.type.indexOf(".")>0){
                out.println("import ",item.type,";");
            }
        }
	}
	importType(moduleFields.nece);
	importType(moduleFields.unece);
	importType(moduleFields.field);
}
%>

/**
 * author <%=author%>
 * created by <%=currentTime%>
 */
public class <%=moduleName%> extends TheBaseEntity {

<%
//成员变量
if(moduleFields){
	function writeField(annotation,array){
		if(!array){
			return;
		}
		for(let i=0;i<array.length;i++){
            let item=isString(array[i])?{type:"String",name:array[i]}:array[i];
            out.println("    @",annotation);
            out.println("    private ",getTypeName(item.type)," ",item.name,";");
        }
	}
	writeField("Nece",moduleFields.nece);
	writeField("Unece",moduleFields.unece);
	writeField("DBField",moduleFields.field);
}
%>

<%
//setter和getter
if(moduleFields){
	function writeSetterGetter(array){
		if(!array){
			return;
		}
		for(let i=0;i<array.length;i++){
            let item=isString(array[i]) ?{type:"String",name:array[i]}:array[i];
            let typeName=getTypeName(item.type);
            let funName=item.name.charAt(0).toUpperCase()+item.name.substring(1);

            out.println("    public void set",funName,"(",typeName,item.name,")\n    {");
            out.println("        this.",item.name,"=",item.name,";");
            out.println("    }");

            out.println("    public ",typeName," get",funName,"()\n    {");
            out.println("        return this.",item.name,";");
            out.println("    }");
            out.println();
        }
	}
	writeSetterGetter(moduleFields.nece);
	writeSetterGetter(moduleFields.unece);
	writeSetterGetter(moduleFields.field);
}

%>
}
