<%@
//设置输出文件
out="java/${package_path}/modules/${moduleDirName}/controller/${moduleName}Controller.java"
%>
package <%=package_name%>.modules.<%=moduleDirName%>.controller;

import cn.xishan.global.bridge.BridgePermissionHandler;
import cn.xishan.global.sdk2d1.annotation.FUser;
import cn.xishan.oftenporter.porter.core.JResponse;
import cn.xishan.oftenporter.porter.core.annotation.PortComment;
import cn.xishan.oftenporter.porter.core.base.OftenObject;
import cn.xishan.oftenporter.porter.core.util.OftenTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.*;

import <%=package_name%>.common.db.TheBaseController;
import <%=package_name%>.modules.<%=moduleDirName%>.entity.<%=moduleName%>;
import <%=package_name%>.modules.<%=moduleDirName%>.service.<%=moduleName%>Service;

/**
 * author <%=author%>
 * created by <%=currentTime%>
 */
@Controller
@RequestMapping("/<%=moduleName%>/")
@PortComment(name = "<%=moduleName%>")
public class <%=moduleName%>Controller extends TheBaseController<<%=moduleName%>,<%=moduleName%>Service> {
    
}
