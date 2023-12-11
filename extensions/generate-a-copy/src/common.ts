import * as fs from 'fs';
import * as path from 'path';

/**配置 */
export const TestConfig = {
    /**是否打印日志 */
    bLog: true,
}

/**打印日志 */
export function log(...arg: any[]) {
    TestConfig.bLog && console.log(...arg);
}

/**遍历文件夹 */
export function walkDir(dir: string, callback: (filePath: string, bFile: boolean) => void) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        //如果是子文件夹
        if (stat.isDirectory()) {
            //调用回调函数处理文件夹
            callback(filePath, false);
            //递归遍历
            walkDir(filePath, callback);
        }
        //如果是文件
        else if (stat.isFile()) {
            //调用回调函数处理文件
            callback(filePath, true);
        }
        //其它
        else {
            //TODO
        }
    });
}

/**重新生成uuid */
export function generateUUID(filePath: string) {
    const obj = JSON.parse(fs.readFileSync(filePath, `utf8`));
    const newUUID = Editor.Utils.UUID.generate(false);
    const oldUUID = obj.uuid;
    obj.uuid = newUUID;
    fs.writeFileSync(filePath, JSON.stringify(obj));
    return { oldUUID, newUUID };
}