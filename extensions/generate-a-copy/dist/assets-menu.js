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
exports.onPanelMenu = exports.onAssetMenu = exports.onDBMenu = exports.onCreateMenu = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const common_1 = require("./common");
//https://docs.cocos.com/creator/3.7/manual/zh/editor/assets/extension.html
function onCreateMenu(assetsInfo) {
    (0, common_1.log)(`onCreateMenu`);
    const list = [
        {
            //名称
            label: `onCreateMenu`,
            //点击回调
            click() {
                (0, common_1.log)(`onCreateMenu`);
            }
        }
    ];
    return list;
}
exports.onCreateMenu = onCreateMenu;
function onDBMenu(assetsInfo) {
    (0, common_1.log)(`onDBMenu`);
    const list = [
        {
            //名称
            label: `onDBMenu`,
            //点击回调
            click() {
                (0, common_1.log)(`onDBMenu`);
            }
        }
    ];
    return list;
}
exports.onDBMenu = onDBMenu;
function onAssetMenu(assetsInfo) {
    (0, common_1.log)(`onAssetMenu`);
    const list = [
        {
            //名称
            label: `生成副本（自动刷新uuid引用）`,
            //点击回调
            click() {
                //新文件名
                let newFileName;
                //新文件路径（包涵文件名）
                let newFilePath;
                //文件夹路径
                let fileDir = path.dirname(assetsInfo.file);
                //文件扩展名
                let extName = path.extname(assetsInfo.file);
                //文件名
                let fileName = path.basename(assetsInfo.file, extName);
                //检测是否以数值结尾
                const numberEnd = fileName.match(/\d+$/);
                if (numberEnd) {
                    const str = numberEnd[0];
                    let nIndex = Number(str);
                    const reg = new RegExp(`${str}$`);
                    //文件索引递增
                    do {
                        newFileName = fileName.replace(reg, `${++nIndex}`.padStart(str.length, `0`));
                        newFilePath = `${fileDir}/${newFileName}${extName}`;
                    } while (fs.existsSync(newFilePath));
                }
                else {
                    //添加文件索引
                    newFileName = `${fileName}-0`;
                    newFilePath = `${fileDir}/${newFileName}${extName}`;
                }
                Editor.Utils.File.copy(assetsInfo.file, newFilePath);
                Editor.Utils.File.copy(`${assetsInfo.file}.meta`, `${newFilePath}.meta`);
                //重新生成uuid
                const uuidMap = {};
                let { oldUUID, newUUID } = (0, common_1.generateUUID)(`${newFilePath}.meta`);
                uuidMap[oldUUID] = newUUID;
                if (assetsInfo.isDirectory) {
                    //检测列表
                    const fileList = [];
                    //依赖uuid的文件
                    const dependentUUIDFileExt = new Set([
                        `.prefab`, `.scene`, `.anim`, `.mtl`, `.pmtl`, `.cubemap`, `.animgraph`, `.animgraphvari`, `.animask`, `.labelatlas`, `.rpp`,
                    ]);
                    (0, common_1.walkDir)(newFilePath, (filePath, bFile) => {
                        if (bFile) {
                            const ext = path.extname(filePath);
                            if (ext == `.meta`) {
                                let { oldUUID, newUUID } = (0, common_1.generateUUID)(filePath);
                                uuidMap[oldUUID] = newUUID;
                                let oldUUIDConpress = Editor.Utils.UUID.compressUUID(oldUUID, false);
                                let newUUIDConpress = Editor.Utils.UUID.compressUUID(newUUID, false);
                                uuidMap[oldUUIDConpress] = newUUIDConpress;
                            }
                            else {
                                if (dependentUUIDFileExt.has(ext)) {
                                    fileList.push(filePath);
                                }
                            }
                        }
                    });
                    //替换文件的依赖
                    fileList.forEach(filePath => {
                        let content = fs.readFileSync(filePath, `utf-8`);
                        //uuid
                        content = content.replace(/([\`\'\"])__uuid__\1\s*:\s*\1([\w\-]+)(@[\w]+)?\1/g, (_, s1, s2, s3) => {
                            var _a;
                            return `${s1}__uuid__${s1}:${s1}${(_a = uuidMap[s2]) !== null && _a !== void 0 ? _a : s2}${s3 !== null && s3 !== void 0 ? s3 : ``}${s1}`;
                        });
                        //脚本
                        content = content.replace(/(\}\s*,\s*\{\s*)([\`\'\"])__type__\2\s*:\s*\2([\w\/]+)\2/g, (_, s0, s1, s2) => {
                            var _a;
                            return `${s0}${s1}__type__${s1}:${s1}${(_a = uuidMap[s2]) !== null && _a !== void 0 ? _a : s2}${s1}`;
                        });
                        fs.writeFileSync(filePath, content);
                    });
                }
                //通知资源管理器刷新资源
                Editor.Message.send(`asset-db`, `refresh-asset`, assetsInfo.url.replace(new RegExp(`${fileName}`), newFileName));
            }
        }
    ];
    return list;
}
exports.onAssetMenu = onAssetMenu;
function onPanelMenu(assetsInfo) {
    (0, common_1.log)(`onPanelMenu`);
    const list = [
        {
            //名称
            label: `onPanelMenu`,
            //点击回调
            click() {
                (0, common_1.log)(`onPanelMenu`);
            }
        }
    ];
    return list;
}
exports.onPanelMenu = onPanelMenu;
