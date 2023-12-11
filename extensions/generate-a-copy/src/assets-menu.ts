import * as fs from 'fs';
import * as path from 'path';
import { generateUUID, log, walkDir } from './common';
import { AssetInfo } from "../@types/packages/asset-db/@types/public";

//https://docs.cocos.com/creator/3.7/manual/zh/editor/assets/extension.html

export function onCreateMenu(assetsInfo: AssetInfo) {
    log(`onCreateMenu`);
    const list: Editor.Menu.BaseMenuItem[] = [
        {
            //名称
            label: `onCreateMenu`,
            //点击回调
            click() {
                log(`onCreateMenu`);
            }
        }
    ]
    return list;
}

export function onDBMenu(assetsInfo: AssetInfo) {
    log(`onDBMenu`);
    const list: Editor.Menu.BaseMenuItem[] = [
        {
            //名称
            label: `onDBMenu`,
            //点击回调
            click() {
                log(`onDBMenu`);
            }
        }
    ]
    return list;
}

export function onAssetMenu(assetsInfo: AssetInfo) {
    log(`onAssetMenu`);
    const list: Editor.Menu.BaseMenuItem[] = [
        {
            //名称
            label: `生成副本（自动刷新uuid引用）`,
            //点击回调
            click() {
                //新文件名
                let newFileName: string;
                //新文件路径（包涵文件名）
                let newFilePath: string;
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
                } else {
                    //添加文件索引
                    newFileName = `${fileName}-0`;
                    newFilePath = `${fileDir}/${newFileName}${extName}`;
                }
                Editor.Utils.File.copy(assetsInfo.file, newFilePath);
                Editor.Utils.File.copy(`${assetsInfo.file}.meta`, `${newFilePath}.meta`);
                //重新生成uuid
                const uuidMap: { [key: string]: string } = {};
                let { oldUUID, newUUID } = generateUUID(`${newFilePath}.meta`);
                uuidMap[oldUUID] = newUUID;
                if (assetsInfo.isDirectory) {
                    //检测列表
                    const fileList: string[] = [];
                    //依赖uuid的文件
                    const dependentUUIDFileExt = new Set([
                        `.prefab`, `.scene`, `.anim`, `.mtl`, `.pmtl`, `.cubemap`, `.animgraph`, `.animgraphvari`, `.animask`, `.labelatlas`, `.rpp`,
                    ]);
                    walkDir(newFilePath, (filePath: string, bFile: boolean) => {
                        if (bFile) {
                            const ext = path.extname(filePath);
                            if (ext == `.meta`) {
                                let { oldUUID, newUUID } = generateUUID(filePath);
                                uuidMap[oldUUID] = newUUID;
                                let oldUUIDConpress = Editor.Utils.UUID.compressUUID(oldUUID, false);
                                let newUUIDConpress = Editor.Utils.UUID.compressUUID(newUUID, false);
                                uuidMap[oldUUIDConpress] = newUUIDConpress;
                            } else {
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
                            return `${s1}__uuid__${s1}:${s1}${uuidMap[s2] ?? s2}${s3 ?? ``}${s1}`;
                        });
                        //脚本
                        content = content.replace(/(\}\s*,\s*\{\s*)([\`\'\"])__type__\2\s*:\s*\2([\w\/]+)\2/g, (_, s0, s1, s2) => {
                            return `${s0}${s1}__type__${s1}:${s1}${uuidMap[s2] ?? s2}${s1}`;
                        });
                        fs.writeFileSync(filePath, content);
                    });
                }
                //通知资源管理器刷新资源
                Editor.Message.send(`asset-db`, `refresh-asset`, assetsInfo.url.replace(new RegExp(`${fileName}`), newFileName));
            }
        }
    ]
    return list;
}

export function onPanelMenu(assetsInfo: AssetInfo) {
    log(`onPanelMenu`);
    const list: Editor.Menu.BaseMenuItem[] = [
        {
            //名称
            label: `onPanelMenu`,
            //点击回调
            click() {
                log(`onPanelMenu`);
            }
        }
    ]
    return list;
}
