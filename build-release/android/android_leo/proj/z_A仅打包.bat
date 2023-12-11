@echo off

rem chcp 65001 就是换成UTF-8代码页 
rem chcp 936 可以换回默认的GBK 
rem chcp 437 是美国英语 

chcp 65001

set rootPath=%cd%

echo,
echo 开始打包
echo,
call gradlew assembleRelease --stacktrace -info > zz_autobuild.log
echo,

echo,
echo 收集发包文档后再发到群里，标明是否需要更新服务器
echo 收集发包文档后再发到群里，标明是否需要更新服务器
echo 收集发包文档后再发到群里，标明是否需要更新服务器

pause