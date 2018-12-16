<%@
//设置输出文件
out="java/${package_path}/modules/${moduleDirName}/service/${moduleName}Service.java"
%>
package <%=package_name%>.modules.<%=moduleDirName%>.service;

import org.springframework.stereotype.Service;
import <%=package_name%>.common.db.TheBaseService;
import <%=package_name%>.modules.<%=moduleDirName%>.entity.<%=moduleName%>;

/**
 * author <%=author%>
 * created by <%=currentTime%>
 */
@Service
public class <%=moduleName%>Service extends TheBaseService<<%=moduleName%>,<%=moduleName%>Dao>{
    public <%=moduleName%>Service()
    {
        super(true);
    }
}
