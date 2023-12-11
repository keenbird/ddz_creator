@echo off

rem chcp 65001 就是换成UTF-8代码页 
rem chcp 936 可以换回默认的GBK 
rem chcp 437 是美国英语 

rem chcp 65001

echo 生成多语言声明文件

rem 打印空白行
echo,

cd public

python updateLanguage.py
echo,

pause