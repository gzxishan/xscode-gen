<%@
//设置输出文件
out="resources/mapper/${moduleName}Dao.xml"
%>
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="$[mapperDaoClass]">

<!--****************引入子页面、变量设置***************-->
<!--$path:../mapper-include/base.xml-->
<!--$json:
{
    tableName:'<%=tableName%>',
    insertExcept:'',
    updateExcept:''
 }
-->
</mapper>