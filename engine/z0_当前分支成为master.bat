@echo off

rem chcp 65001 就是换成UTF-8代码页 
rem chcp 936 可以换回默认的GBK 
rem chcp 437 是美国英语 

chcp 65001
echo,

rem 删除本地master分支
git branch -D master

rem 删除远程master分支（git主分支不能是该分支，需修改为其它分支后再执行此操作）
git push origin --delete master

rem 新建本地master分支，然后切换到master分支
git checkout -b master

rem 把本地master分支推送到远程
git push --set-upstream origin master

rem 推送修改
git push

if %errorlevel% == 0 (
exit
) else (
pause
)
