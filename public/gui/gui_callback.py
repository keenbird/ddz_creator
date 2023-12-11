#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os, sys
import traceback
sys.path.append('..')
import api_file

api_file.autoImport('re')  # 正则
import re

# 配置信息
config = api_file.readCacheJsonFile()

# 处理回调
def deal(data):
    print(data['data'])
    print(data['info'][data['data']])
    print('')
    # 数据相同不处理
    if (data['key'] in config) and (config[data['key']] == data['info'][data['data']]):
        return
    config[data['key'] + '_default'] = data['data']
    config[data['key']] = data['info'][data['data']]
    # 保存信息
    doSave()

# 退出（t为Tkinter.Tk）
def doExit(t):
    t.destroy()
    sys.exit(0)

# 执行命令
def doCmd(cmdStr, check = None):
    print('doCmd: %s' % (cmdStr))
    result = os.system('%s' % (cmdStr))
    bOk = False
    if check != None:
        bOk = check(result)
    else:
        bOk = result == 0
    if bOk:
        print(u'完成')
    else:
        print('')
        print(cmdStr)
        print('')
        raise Exception(u'以上命令执行失败，请检查相关代码后重试！')
    # os.system('start %s' % (cmdStr))

# 保存配置
def doSave():
    # 保存信息
    api_file.writeCacheJsonFile(config)
    print('配置保存成功\n')

# 刷新子包配置
def updateBundleConfig(k, relativePath):
    path = os.path.join(config['projectPath'], relativePath)
    paths = os.listdir(path)
    config[k] = []
    for item in paths:
        fullPath = os.path.join(path, item)
        if os.path.exists(fullPath) and os.path.isdir(fullPath):
            metaPath = os.path.join(path, item + '.meta')
            if os.path.exists(metaPath):
                if (len(re.findall("isBundle\":\s*true", api_file.readfile(metaPath))) > 0):
                    config[k].append(item)

# cocos路径--began-------------------------------------------------------------------
cccPath = api_file.objectDefault(config, 'cccPath', u'')
def doCCCPath(data):
    # 转为绝对路径
    data = os.path.abspath(data)
    print('doCCCPath: ' + data + '\n')
    if data == config['cccPath']:
        return
    config['cccPath'] = data
    # 保存配置
    doSave()
# cocos路径--end-------------------------------------------------------------------

# 工程路径--began-------------------------------------------------------------------
projectPath = api_file.objectDefault(config, 'projectPath', os.path.abspath(os.path.join(api_file.getPathDirName(__file__), '../../')))
def doProjectPath(data):
    # 转为绝对路径
    data = os.path.abspath(data)
    print('doProjectPath: ' + data + '\n')
    if data == config['projectPath']:
        return
    # 格式调整
    data = api_file.dealPathForRe(data)
    data = re.sub(r'/+', '/', data + '/')
    config['projectPath'] = data
    # 刷新子包配置
    updateBundleConfig('games', 'assets/game')
    updateBundleConfig('activitys', 'assets/activity')
    # 保存配置
    doSave()
# 工程路径--end-------------------------------------------------------------------

# 是否初始化配置--began-------------------------------------------------------------------
# 刷新子包配置
updateBundleConfig('games', 'assets/game')
updateBundleConfig('activitys', 'assets/activity')
# 保存配置
doSave()
# 是否初始化配置--end-------------------------------------------------------------------

# 构建配置文件--began-------------------------------------------------------------------
buildConfigPath = api_file.objectDefault(config, 'buildConfigPath', os.path.join(projectPath, 'build/buildConfig_android.json'))
def doBuildConfigPath(data):
    # 转为绝对路径
    data = os.path.abspath(data)
    print('doBuildConfigPath: ' + data + '\n')
    if data == config['buildConfigPath']:
        return
    config['buildConfigPath'] = data
    # 保存配置
    doSave()
# 构建配置文件--end-------------------------------------------------------------------

# 热更输出路径--began-------------------------------------------------------------------
hotPath = api_file.objectDefault(config, 'hotPath', os.path.join(projectPath, 'hotupdate'))
def doHotPath(data):
    # 转为绝对路径
    data = os.path.abspath(data)
    print('doHotPath: ' + data + '\n')
    if data == config['hotPath']:
        return
    config['hotPath'] = data
    # 保存配置
    doSave()
# 热更输出路径--end-------------------------------------------------------------------

# 热更下载地址--began-------------------------------------------------------------------
webUrl = api_file.objectDefault(config, 'webUrl', 'http://192.168.125.109/')
def doWebUrl(data):
    print('doWebUrl: ' + data + '\n')
    if data == config['webUrl']:
        return
    config['webUrl'] = data
    # 保存配置
    doSave()
# 热更下载地址--end-------------------------------------------------------------------

# 正式热更下载地址--began-------------------------------------------------------------------
webUrlRelease = api_file.objectDefault(config, 'webUrlRelease', 'http://127.0.0.1/')
def doWebUrlRelease(data):
    print('doWebUrlRelease: ' + data + '\n')
    if data == config['webUrlRelease']:
        return
    config['webUrlRelease'] = data
    # 保存配置
    doSave()
# 正式热更下载地址--end-------------------------------------------------------------------

# 渠道--began-------------------------------------------------------------------
channel_default = api_file.objectDefault(config, 'channel_default', u'官方渠道')
channel_info = {
    u'官方渠道': '0',
}
def channel(data=channel_default):
    deal({
        'info': channel_info,
        'key': 'channel',
        'data': data
    })
# 渠道--end-------------------------------------------------------------------

# apk版本号--began-------------------------------------------------------------------
apkVersion = api_file.objectDefault(config, 'apkVersion', '1.0.0')
def doApkVersion(data):
    print('apkVersion: ' + data + '\n')
    if data == config['apkVersion']:
        return
    config['apkVersion'] = data
    # 保存配置
    doSave()
# apk版本号--end-------------------------------------------------------------------

# 需要压缩的最小大小--began-------------------------------------------------------------------
compressSize = api_file.objectDefault(config, 'compressSize', '200')
def doCompressSize(data):
    print('compressSize: ' + data + '\n')
    if data == config['compressSize']:
        return
    config['compressSize'] = data
    # 保存配置
    doSave()
# 需要压缩的最小大小--end-------------------------------------------------------------------

# 正式 or 测试--began-------------------------------------------------------------------
isRelease_default = api_file.objectDefault(config, 'isRelease_default', '0')
isRelease_info = {
    '0': False,
    '1': True,
}
def doIsRelease(data=isRelease_default):
    deal({
        'info': isRelease_info,
        'key': 'isRelease',
        'data': data
    })
# 正式 or 测试--end-------------------------------------------------------------------

# 类型
Type = {
    'plaza': 0,
    'activity': 1,
    'game': 2,
}
# 游戏--began-------------------------------------------------------------------
# 配置信息
game_info = api_file.objectDefault(config, 'game_info', {})
# 动态调整的信息
game_dynamic = api_file.objectDefault(config, 'game_dynamic', {})
# 游戏列表
game_list = [
    {'name': u'大厅', 'res': 'plaza', 'type': Type['plaza'], },
]
game_default = {}
for item in game_list:
    game_default[item['res']] = item
for item in game_default:
    game_info[item] = game_default[item]
    if not (item in game_dynamic):
        game_dynamic[item] = {'select': True}
deleteList = []
for item in game_info:
    if not (item in game_default):
        deleteList.append(item)
for item in deleteList:
    del game_info[item]
    del game_dynamic[item]
def doGame(select, name, bSave):
    config['game_dynamic'][name]['select'] = select == '1'
    if bSave:
        doSave()
# 游戏--end-------------------------------------------------------------------

# 图片转webp--began-------------------------------------------------------------------
doWebp_default = api_file.objectDefault(config, 'doWebp_default', '1')
doWebp_info = {
    '0': False,
    '1': True,
}
def doWebp(data=doWebp_default):
    deal({
        'info': doWebp_info,
        'key': 'doWebp',
        'data': data
    })
# 调整资源路径
config['webpConfig'] = {
    # 原始资源路径
    'srcPath': os.path.join(projectPath, 'hotupdate/assets'),
    # 输出资源路径
    'desPath': os.path.join(projectPath, 'hotupdate/webp'),
}
def doWebpMain():
    # 当前路径
    curPath = os.getcwd()
    # 切换工作路径
    os.chdir(os.path.join(projectPath, 'public/webp_tool'))
    # copy
    doCmd('call q_normal.bat')
    # 调整当前路径
    os.chdir(curPath)
    print('图片转webp -- over --')
# 图片转webp--end-------------------------------------------------------------------

# manifest生成--began-------------------------------------------------------------------
def doManifest():
    # 当前路径
    curPath = os.getcwd()
    # webp处理
    # 切换工作路径
    os.chdir(os.path.join(projectPath, 'public'))
    # copy
    doCmd('python GenerateManifest.py')
    # 调整当前路径
    os.chdir(curPath)
    print('manifest生成 -- over --')
# manifest生成--end-------------------------------------------------------------------

# 构建资源--began-------------------------------------------------------------------
buildLogPath = os.path.join(config['projectPath'], 'build.log')
def structureCheck(result = None):
    logTxt = api_file.readfile(buildLogPath)
    lines = logTxt.splitlines()
    for line in reversed(lines):
        if line == '':
            continue
        else:
            if re.search(r'Build\s*Task.*Finished', line):
                return True
            else:
                return False
    return False
def doStructure():
    # --project：必填，指定项目路径
    # --build：指定构建项目使用的参数
    #     在 --build 后如果没有指定参数，则会使用 Cocos Creator 中 构建发布 面板当前的平台、模板等设置来作为默认参数。如果指定了其他参数设置，则会使用指定的参数来覆盖默认参数。可选择的参数有：
    #     configPath - 参数文件路径。如果定义了这个字段，那么构建时将会按照 json 文件格式来加载这个数据，并作为构建参数。这个参数可以自己修改也可以直接从构建面板导出，当配置和 configPath 内的配置冲突时，configPath 指定的配置将会被覆盖。
    #     logDest - 指定日志输出路径
    #     includedModules - 定制引擎打包功能模块，只打包需要的功能模块。具体有哪些功能模块可以参考引擎仓库根目录下 cc.config.json（GitHub | Gitee）文件中的 features 字段。
    #     outputName - 构建后生成的发布包文件夹名称。
    #     name - 游戏名称
    #     platform - 必填，构建的平台，具体名称参考面板上对应插件名称即可，例如android, web-desktop, ...
    #     buildPath - 指定构建发布包生成的目录，默认为项目目录下的 build 目录。可使用绝对路径或者相对于项目的路径（例如 project://release）。从 v3.4.2 开始支持类似 ../ 这样的相对路径。
    #     startScene - 主场景的 UUID 值（参与构建的场景将使用上一次的编辑器中的构建设置），未指定时将使用参与构建场景的第一个
    #     scenes - 参与构建的场景信息，未指定时默认为全部场景，具体格式为：
    #     debug - 是否为 debug 模式，默认关闭
    #     replaceSplashScreen - 是否替换插屏，默认关闭
    #     md5Cache - 是否开启 md5 缓存，默认关闭
    #     mainBundleCompressionType - 主包压缩类型，具体选项值可参考文档 Asset Bundle — 压缩类型。
    #     mainBundleIsRemote - 配置主包为远程包
    #     packages - 各个插件支持的构建配置参数，需要存放的是对于数据对象的序列化字符串，具体可以参考下文。
    # 保存信息
    doSave()
    # 构建
    buildParamStr = '\"configPath=%s\"' % (config['buildConfigPath'])
    doCmd('%s --project %s --build %s >%s' % (config['cccPath'], config['projectPath'], buildParamStr, buildLogPath), structureCheck)
    print('构建资源 -- over --')
# 构建资源--end-------------------------------------------------------------------

# 复制编译资源--began-------------------------------------------------------------------
def doCopyRes():
    # 当前路径
    curPath = os.getcwd()
    # 切换工作路径
    os.chdir(os.path.join(projectPath, 'public'))
    # 复制
    doCmd('python MoveBuildRes.py')
    # 调整当前路径
    os.chdir(curPath)
    # 是否webp处理
    if ('doWebp' in config) and config['doWebp']:
        doWebpMain()
    print('复制编译资源 -- over --')
# 复制编译资源--end-------------------------------------------------------------------

# 生成包资源仅大厅资源
onlyPlazaRes_default = api_file.objectDefault(config, 'onlyPlazaRes_default', '1')
onlyPlazaRes_info = {
    '0': False,
    '1': True,
}
def doOnlyPlazaRes(data=onlyPlazaRes_default):
    deal({
        'info': onlyPlazaRes_info,
        'key': 'onlyPlazaRes',
        'data': data
    })

# 生成整包后自动替换android资源build/android/data
replace_default = api_file.objectDefault(config, 'replace_default', '1')
replace_info = {
    '0': False,
    '1': True,
}
def doReplace(data=replace_default):
    deal({
        'info': replace_info,
        'key': 'replace',
        'data': data
    })
    
# 资源是否加密
encryption_default = api_file.objectDefault(config, 'encryption_default', '1')
encryption_info = {
    '0': False,
    '1': True,
}
def doEncryption(data=encryption_default):
    deal({
        'info': encryption_info,
        'key': 'encryption',
        'data': data
    })

# 生成整包资源
def doPackageRes():
    # 当前路径
    curPath = os.getcwd()
    # 切换工作路径
    os.chdir(os.path.join(projectPath, 'public'))
    # 复制
    doCmd('python PackageRes.py')
    # 调整当前路径
    os.chdir(curPath)
    print('生成整包资源 -- over --')

# 压缩
def doCompress(src):
    src = os.path.abspath(src)
    print('doCompress: ' + src)
    #（1、python自带zipfile）
    # os.chdir('./python_tools')
    # api_file.copydir(outPath, zipPath)
    # os.system('Call python zip.py {0} {1} {2}'.format('compressed', './upd', './upd'))
    # os.chdir('./../')
    #（2、2345好压）
    os.system('{0} a -tzip {1} {2}'.format(os.path.join(projectPath, 'public/haoya/HaoZipC.exe'), src + '.zip', src))
def doCompressAll():
    verJson = api_file.readJsonFile(os.path.join(projectPath, 'hotupdate/versionConfig.json'))
    gDir = os.path.join(projectPath, 'hotupdate/v/')
    if os.path.exists(gDir):
        for item in os.listdir(gDir):
                if item == 'main':
                    if ('plaza' in config['game_dynamic']) and config['game_dynamic']['plaza']['select']:
                        doCompress(os.path.join(gDir, 'main/' + str(verJson['plaza'])))
                else:
                    if (item in config['game_dynamic']) and config['game_dynamic'][item]['select']:
                        doCompress(os.path.join(gDir, item + '/' + str(verJson[item])))
                    
def doUpload(path, name, version, bUpload):
    # ftp文件路径
    webDirPath = '/Static/game/Resources/creator/'
    if ('isRelease' in config) and config['isRelease']:
        webDirPath = '/Static/game/Resources/creator/'
    os.chdir(os.path.join(projectPath, 'public/'))
    filePath = webDirPath + name + '/' + str(version) + '.zip'
    # 上传
    os.system('python ftp.py {0} {1}'.format(filePath, path))
    # 解压
    os.system('python http_unzip.py {0}'.format(re.sub(r'abc', r'htdocs', filePath)))
    # 调整版本号
    if bUpload:
        if name == 'main':
            os.system('python http_plaza.py {0} {1}'.format(str(version), str(config['channel'])))
        else:
            if game_info[name]['type'] == Type['game']:
                os.system('python http_plaza.py {0} {1} {2}'.format(str(version), str(config['channel']), 'games,' + game_info[name]['id']))
            elif game_info[name]['type'] == Type['activity']:
                os.system('python http_plaza.py {0} {1} {2}'.format(str(version), str(config['channel']), 'activitys,' + name))
            else:
                todo = '其它处理'
        # if name == 'main':
        #     os.system('python http_plaza.py {0} {1}'.format(str(version), str(config['channel'])))
        # else:
        #     if game_info[name]['type'] == Type['game']:
        #         os.system('python http_game.py {0} {1}'.format(game_info[name]['id'], str(version)))
        #     elif game_info[name]['type'] == Type['activity']:
        #         os.system('python http_activity.py {0} {1} {2}'.format(name, str(version), str(config['channel'])))
        #     else:
        #         todo = '其它处理'

def doUploadAll(bUpload):
    verJson = api_file.readJsonFile(os.path.join(projectPath, 'hotupdate/versionConfig.json'))
    gDir = os.path.join(projectPath, 'hotupdate/v/')
    if os.path.exists(gDir):
        for item in os.listdir(gDir):
                if item == 'main':
                    if ('plaza' in config['game_dynamic']) and config['game_dynamic']['plaza']['select']:
                        doUpload(os.path.join(gDir, 'main/' + str(verJson['plaza']) + '.zip'), 'main', verJson['plaza'], bUpload)
                else:
                    if (item in config['game_dynamic']) and config['game_dynamic'][item]['select']:
                        doUpload(os.path.join(gDir, item + '/' + str(verJson[item]) + '.zip'), item, verJson[item], bUpload)

# 压缩 -> 上传 -> 解压
def doCompressAndUpload():
    # 压缩
    doCompressAll()
    # 上传 -> 解压 -> 调整版本号?
    doUploadAll(True)
    # doUploadAll(False)
    print('压缩 -> 上传 -> 解压 -> 修改版本号 -- over --')

# 构建? -> webp? -> manifest? -> 压缩 -> 上传 -> 解压 -> 修改版本号
def doOnestopService():
    # 执行
    try:
        # 当前路径
        curPath = os.getcwd()
        #began----------------------------------------------------------
        # 构建
        doStructure()
        # 复制编译资源
        doCopyRes()
        # manifest生成
        doManifest()
        # 压缩
        doCompressAll()
        # 上传 -> 解压 -> 调整版本号
        doUploadAll(True)
        #end------------------------------------------------------------
        # 调整当前路径
        os.chdir(curPath)
        print('构建? -> webp? -> manifest? -> 压缩 -> 上传 -> 解压 -> 修改版本号 -- over --')
    except Exception as e:
        print(u'发生异常:', e)
        # 打印堆栈
        print(traceback.format_exc())
        # 暂停，便于查看错误
        os.system('pause')

# 完成（t为Tkinter.Tk）
def doFinish(t):
    # 保存信息
    doSave()
    # 退出
    doExit(t)
