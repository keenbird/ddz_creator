@echo off

rem chcp 65001 就是换成UTF-8代码页 
rem chcp 936 可以换回默认的GBK 
rem chcp 437 是美国英语 

chcp 65001

echo 正在生成

rem 打印空白行
echo,

python genbindings_customs.py

pause