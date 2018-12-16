<%@
//设置输出文件
out="java/${package_path}/modules/${moduleDirName}/service/${moduleName}Dao.java"
%>
package <%=package_name%>.modules.<%=moduleDirName%>.service;

import org.apache.ibatis.annotations.Param;
import <%=package_name%>.common.db.TheBaseDao;
import <%=package_name%>.modules.<%=moduleDirName%>.entity.<%=moduleName%>;

/**
 * author <%=author%>
 * created by <%=currentTime%>
 */
public interface <%=moduleName%>Dao extends TheBaseDao<<%=moduleName%>> {
}
