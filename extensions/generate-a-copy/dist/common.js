"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUUID = exports.walkDir = exports.log = exports.TestConfig = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**配置 */
exports.TestConfig = {
    /**是否打印日志 */
    bLog: true,
};
/**打印日志 */
function log(...arg) {
    exports.TestConfig.bLog && console.log(...arg);
}
exports.log = log;
/**遍历文件夹 */
function walkDir(dir, callback) {
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
exports.walkDir = walkDir;
/**重新生成uuid */
function generateUUID(filePath) {
    const obj = JSON.parse(fs.readFileSync(filePath, `utf8`));
    const newUUID = Editor.Utils.UUID.generate(false);
    const oldUUID = obj.uuid;
    obj.uuid = newUUID;
    fs.writeFileSync(filePath, JSON.stringify(obj));
    return { oldUUID, newUUID };
}
exports.generateUUID = generateUUID;
