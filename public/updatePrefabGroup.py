# encoding=utf-8

import sys, re, os
import api_file

# 自定义配置
config = api_file.readCacheJsonFile()

#传入参数长度
args = sys.argv
argcLen = len(args)
print("传入参数长度 : " + str(argcLen))

#分组id
#Default: '1073741824', UI_2D: '33554432', UI_3D: '8388608', 
groupID = '1073741824'
if argcLen > 1:
    groupID = args[1]

gitignoreFile = {
    'TrucoLayer': True
    'scratchCard': True
}

layerStr =  '\"_layer\": ' + str(groupID)
def dealPath(fullPath):
    fullPath = os.path.abspath(fullPath)
    fileType = api_file.getFileExtensionName(fullPath)
    if fileType == '.prefab':
        fileName = api_file.getFileName(fullPath)
        if fileName in gitignoreFile:
            return
        content = None
        try:
            with open(fullPath, 'r', encoding='utf-8') as f:
                content = re.sub(r'\"_layer\":\s*(\d+)', layerStr, f.read())
        except Exception as err:
            print('--began-------------------------------------')
            print(fullPath)
            print(err)
            print('--end--------------------------------------')
            return
        with open(fullPath, 'w', encoding='utf-8') as f:
            f.write(content)

dirPath = os.path.join(config['projectPath'], 'assets')
if os.path.exists(dirPath):
    api_file.traverseDir(dirPath, dealPath)
