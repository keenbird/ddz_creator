#!/usr/bin/python
# -*- coding: UTF-8 -*-

import sys, os, re
import api_file

api_file.autoImport("json")
import json
api_file.autoImport("requests")
import requests

curPath = os.getcwd()
config = api_file.readCacheJsonFile()

# 初始化路径
srcPath = os.path.join(config['hotPath'], 'assets/')
if config['doWebp']:
    webpPath = os.path.join(config['hotPath'], 'webp/')
    if os.path.exists(webpPath):
        srcPath = webpPath

desPath = os.path.join(config['hotPath'], 'remote/')
projectAssetsPath = os.path.join(config['projectPath'], 'assets/')
mainProjectResourcePath = os.path.join(
    config['projectPath'], 'assetsresources/')

# 编译指令
url = os.path.join(config['webUrl'], 'Static/game/Resources/creator/')
fmt = 'node version_generator.js -v %s -u %s -s %s -d %s %s'

# 先获取版本，并提升响应游戏的版本号
os.system('python http_version.py ' + config['channel'])

# 版本文件
versionConfigJsonPath = os.path.join(config['hotPath'], 'versionConfig.json')
versionConfigJson = api_file.readJsonFile(versionConfigJsonPath)

# 移除旧资源
api_file.deletedir(desPath)
print('')

dealPath = ''
projectManifest = {}

def compress(filePath):
    global dealPath
    global projectManifest
    extension = api_file.getFileExtensionName(filePath)
    if extension == '.js' or extension == '.json':
        fileSize = os.path.getsize(filePath) / 1024
        if fileSize > 200:
            filePathEx1 = os.path.splitext(os.path.abspath(filePath))[0] + '.zip'
            os.system('{0} a -tzip {1} {2}'.format(os.path.join(config['projectPath'], 'public/haoya/HaoZipC.exe'), filePathEx1, filePath))
            fileSize = os.path.getsize(filePathEx1)
            api_file.deletefile(filePath)
            filePathEx2 = re.sub(dealPath, '',api_file.dealPathForRe(filePath))
            filePathEx2 = re.sub(r'^[\\\\/]+', '', filePathEx2)
            if filePathEx2 in projectManifest['assets']:
                filePathEx3 = os.path.splitext(filePathEx2)[0] + '.zip'
                projectManifest['assets'][filePathEx2]['size'] = fileSize
                projectManifest['assets'][filePathEx2]['compressed'] = True
                projectManifest['assets'][filePathEx2]['extension'] = extension
                projectManifest['assets'][filePathEx3] = projectManifest['assets'][filePathEx2]
                del projectManifest['assets'][filePathEx2]

def doCompress(path):
    global dealPath
    global projectManifest
    dealPath = api_file.dealPathForRe(path)
    projectManifest = api_file.readJsonFile(os.path.join(dealPath, 'project.manifest'))
    api_file.traverseDir(dealPath, compress)
    api_file.writeJsonFile(os.path.join(dealPath, 'project.manifest'), projectManifest)

def doMain():
    # main资源
    if config['game_dynamic']['plaza']['select']:
        mainVersion = api_file.objectDefault(versionConfigJson, 'plaza', 1)
        mainUrl = url + 'main/' + str(mainVersion) + '/'
        mainSrcPath = os.path.join(srcPath, 'main/')
        mainDesPath = os.path.join(desPath, 'main/')
        # 资源加密
        if ('encryption' in config) and config['encryption']:
            print('正在加密main资源')
            os.system('python en_de_cryption_rc4.py ' + mainSrcPath)
        print('正在复制main资源')
        api_file.copydir(mainSrcPath, mainDesPath)
        # 确保文件存在
        print('正在生成main资源的Manifest文件')
        if not os.path.exists(mainDesPath):
            os.makedirs(mainDesPath)
        os.system(fmt % (mainVersion, mainUrl, mainSrcPath, mainDesPath, '-isMain'))
        doCompress(mainDesPath)

    # 游戏资源
    def doPath(k):
        api_file.objectDefault(config, k + 's', [])
        assetsPath = srcPath + k + '/'
        if os.path.exists(assetsPath):
            dirs = os.listdir(assetsPath)
            for item in dirs:
                print(item)
                if not (item in config['game_dynamic']) or not config['game_dynamic'][item]['select']:
                    continue
                gameSrcPath = assetsPath + item + '/'
                if os.path.isdir(gameSrcPath) and (item in config[k + 's']):
                    # 版本号
                    gameVersion = api_file.objectDefault(versionConfigJson, item, 1)
                    gameDesPath = desPath + k + '/' + item
                    gameUrl = url + item + '/' + str(gameVersion) + '/'
                    # 资源加密
                    if ('encryption' in config) and config['encryption']:
                        print('正在加密' + item + '资源')
                        os.system('python en_de_cryption_rc4.py ' + gameSrcPath)
                    # 复制资源文件
                    api_file.copydir(gameSrcPath, gameDesPath)
                    # 确保文件存在
                    if not os.path.exists(gameDesPath):
                        os.makedirs(gameDesPath)
                        if os.path.exists(gameDesPath):
                            os.system(fmt % (gameVersion, gameUrl, gameSrcPath, gameDesPath, '-isGame'))
                        else:
                            print('makedirs err : ' + gameDesPath)
                    else:
                        os.system(fmt % (gameVersion, gameUrl, gameSrcPath, gameDesPath, '-isGame'))
                    doCompress(gameDesPath)
                    print('')

    doPath('game')
    doPath('activity')

    # 调整版本文件位置
    vPath = os.path.join(config['hotPath'], 'v/')
    if not os.path.exists(vPath):
        os.makedirs(vPath)

    def dealVersion(fullPath):
        print('dealVersion: ' + fullPath)
        dirName = re.findall(r'([\w_]+)[\\\\/]*$', fullPath)
        if len(dirName) > 0:
            dirName = dirName[0]
            versionName = dirName
            if versionName == 'main':
                versionName = 'plaza'
            vDir = os.path.join(vPath, dirName + '/' + str(versionConfigJson[versionName]))
            print('vDir: ' + vDir)
            if os.path.exists(vDir):
                api_file.deletedir(vDir)
            api_file.copydir(fullPath, vDir)

    if config['game_dynamic']['plaza']['select']:
        dealVersion(os.path.join(desPath, 'main'))
    gDir = os.path.join(desPath, 'game/')
    print(gDir)
    if os.path.exists(gDir):
        for item in os.listdir(gDir):
            print(item)
            if (item in config['game_dynamic']) and config['game_dynamic'][item]['select']:
                dealVersion(os.path.join(gDir, item))
    aDir = os.path.join(desPath, 'activity/')
    if os.path.exists(aDir):
        for item in os.listdir(aDir):
            if (item in config['game_dynamic']) and config['game_dynamic'][item]['select']:
                dealVersion(os.path.join(aDir, item))

webUrl = re.sub(r'(\d+)/*$', r'\1:81/', config['webUrl'])
if ('isRelease' in config) and config['isRelease']:
    webUrl = config['webUrlRelease']

# http请求地址
def doHttp_main():
    params = {
        'channel': config['channel'],
        'os': 'android',
        'sign': api_file.md5((config['channel'] + 'aiwan2019')),
    }
    print(params)
    # 创建连接
    r = requests.get(webUrl + 'update/getVersion', params)
    print("requests status: " + str(r.status_code))
    if r.status_code != 200:
        print(r.text)
        print(r)
    else:
        jsonData = json.loads(r.text)
        if jsonData:
            # 字典是否为空
            if ('newFlist' in jsonData):
                versionConfigJson['main_new'] = int(jsonData['newFlist']) + 1
            # 活动
            if ('activitys' in jsonData):
                for activityName, activityVersion in jsonData['activitys'].items():
                    versionConfigJson[activityName + '_new'] = int(activityVersion) + 1
            # 游戏
            if ('gamses' in jsonData):
                for gameID, gameVersion in jsonData['gamses'].items():
                    for gameName, gameInfo in config['game_info']:
                        if ('id' in gameInfo) and int(gameInfo['id']) == int(gameID):
                            versionConfigJson[gameName + '_new'] = int(gameVersion) + 1
                            break
            # 保存大厅版本信息
            if not ('plaza_version' in config):
                config['plaza_version'] = {}
            if not (config['channel'] in config['plaza_version']):
                config['plaza_version'][config['channel']] = {}
            for key in jsonData:
                config['plaza_version'][config['channel']][key] = jsonData[key]
            # 刷新配置缓存文件
            api_file.writeCacheJsonFile(config)

# http请求地址
def doHttp_game():
    params = {
        'channel': 0,
        'os': 'android',
        'sign': api_file.md5('0aiwan2019'),
    }
    print(params)
    # 创建连接
    r = requests.get(webUrl + 'OtherApi/gamechild', params)
    print("requests status: " + str(r.status_code))
    if r.status_code != 200:
        print(r.text)
        print(r)
    else:
        jsonData = json.loads(r.text)
        if jsonData:
            print(jsonData)
            # 字典是否为空
            if ('data' in jsonData) and bool(jsonData['data']):
                for key1, item1 in jsonData['data'].items():
                    for key2, item2 in config['game_info'].items():
                        if ('id' in item2) and (key1 == item2['id']):
                            versionConfigJson[key2 + '_new'] = int(item1) + 1
                            break

# 刷新版本
doHttp_main()
# doHttp_game()

# 主
doMain()