#!/usr/bin/python
# -*- coding: UTF-8 -*-

import sys, os, re
import api_file
import json

fileContent = ""
declareFileContent = ""
fileName = "ResPath.ts"
declareFileName = "ResPath.define.d.ts"
assertPath = "./../assets"
finalFilePath = os.path.join(assertPath, "app/external", fileName)
finalDeclareFilePath = os.path.join(assertPath, "app/external", declareFileName)

jsonObj = {}
supportExtensionName = {
    #图片
    ".png": {
        "texture": "__type_1__",
        "spriteFrame": "__type_1__",
    },
    ".jpg": {
        "texture": "__type_1__",
        "spriteFrame": "__type_1__",
    },
    ".webp": {
        "texture": "__type_1__",
        "spriteFrame": "__type_1__",
    },

    #音频视频
    ".ogg": 1,
    ".mp3": 1,
    ".mp4": 1,

    #文本
    ".txt": 1,
    ".json": 1,

    #字体
    ".ttf": 1,
    ".fnt": 1,

    #其它
    ".anim": 1,
    ".plist": 1,
    ".atlas": 1,
    ".prefab": 1,
}

def dealDir(path, obj, rootObj = None, bBundle = False):
    bHave = False
    rootObj = rootObj or obj
    names = os.listdir(path)
    for name in names:
        newPath = os.path.join(path, name)
        if os.path.isfile(newPath):
            if bBundle:
                fileExtensionName = api_file.getFileExtensionName(name).lower()
                if fileExtensionName in supportExtensionName:
                    bHave = True
                    fileName = api_file.getFileName(name)
                    if supportExtensionName[fileExtensionName] == 1:
                        obj[fileName] = "__type_1__"

                    else:
                        obj[fileName] = supportExtensionName[fileExtensionName]
        else:
            bTempBundle = len(re.findall("isBundle\":\s*true", api_file.readfile(newPath + ".meta"))) > 0
            tempObj = None
            if bTempBundle:
                tempObj = rootObj
            else:
                tempObj = obj
            tempObj[name] = {}
            bTempHave = dealDir(newPath, tempObj[name], rootObj, bBundle or bTempBundle) and not bTempBundle
            if not bTempHave and not bTempBundle:
                del tempObj[name]
            bHave = bHave or bTempHave
    return bHave

dealDir(assertPath, jsonObj)

fileContent = fileContent + """
let func = (str?: string) => {
	str ??= ``;
	let bInit = { end: true, };
	let obj = new Proxy(Object.assign({}, { end: () => str }), {
		get(target, p: string, receiver) {
			let value: any;
			let bTempInit = bInit[p];
			if (!bTempInit) {
				bInit[p] = true;
				Reflect.set(target, p, value = func(`${str}${str ? `/` : ``}${p}`), receiver);
			} else {
				value = Reflect.get(target, p, receiver);
			}
			return value;
		},
		set(target, p: string, newValue, receiver) {
			console.log(`only read`);
			return false;
		},
	});
	return obj;
}
declare global {
	namespace globalThis {
		var ResPath: ResPathType
	}
}
globalThis.ResPath = <ResPathType><unknown>func();
export {}
"""

declareFileContent = declareFileContent + """type ResPathType = """ + json.dumps(jsonObj)
declareFileContent = re.sub("\"__type_1__\"", "{ end: () => string }", declareFileContent)

#写入文件
api_file.writefile(finalFilePath, fileContent)

#写入文件
api_file.writefile(finalDeclareFilePath, declareFileContent)

print("")
