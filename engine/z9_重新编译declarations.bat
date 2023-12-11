rem 如果 npm 安装依赖失败 就把老的 node_modules 目录删除重新添加就好了

set tempOldPath=.\bin\cc.d.old.ts
set oldPath=.\bin\.declarations\cc.d.ts
set newPath=.\bin\.declarations\cc.d.new.ts

rem 复制一份旧的
move %oldPath% %tempOldPath%

rem 生成
call gulp build build-declarations

rem 新生成的改名
move %oldPath% %newPath%

rem 恢复旧的
move %tempOldPath% %oldPath% 

pause