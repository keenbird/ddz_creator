@echo off

rem chcp 65001 就是换成UTF-8代码页 
rem chcp 936 可以换回默认的GBK 
rem chcp 437 是美国英语 

rem 打印空白行
echo,

chcp 65001

cd public

set file_or_folder=%1

rem Check if there are parameters passed in
rem 检测是否有参数传入
rem if not exit "%1" ( TODO )
if "%1"=="" (
set file_or_folder=D:\creator_master\index.js
)

echo,
echo %file_or_folder%
echo,

python en_de_cryption_rc4.py %1

pause