# encoding=utf-8

import os
import api_file

# 自定义配置
config = api_file.readCacheJsonFile()
desPath = os.path.join(config['hotPath'], 'remote/')
wholePackagePath = os.path.join(config['hotPath'], 'wholePackage/')
if os.path.exists(wholePackagePath):
    api_file.deletedir(wholePackagePath)
os.makedirs(wholePackagePath)

# 构建配置
buildConfig = api_file.readJsonFile(config['buildConfigPath'])

# 恢复压缩资源
def restoreZip(dealPath):
    projectManifest = api_file.readJsonFile(os.path.join(dealPath, 'project.manifest'))
    for filePath in projectManifest['assets']:
        obj = projectManifest['assets'][filePath]
        if ('compressed' in obj) and obj['compressed']:
            newPath = os.path.join(dealPath, filePath)
            os.system('{0} e {1} -o{2}'.format(os.path.join(config['projectPath'], 'public/haoya/HaoZipC.exe'), newPath, api_file.getPathDirName(newPath)))
            api_file.deletefile(newPath)

# 复制主资源
api_file.copydir(os.path.join(desPath, 'main'), wholePackagePath, { 'bKeepOld': True })
restoreZip(wholePackagePath)
# 是否仅大厅资源
if not ('onlyPlazaRes' in config) or not config['onlyPlazaRes']:
    # 复制游戏
    api_file.copydir(os.path.join(desPath, 'game'), os.path.join(wholePackagePath, 'assets'), { 'bKeepOld': True })
    for item in os.listdir(os.path.join(desPath, 'game')):
        restoreZip(os.path.join(wholePackagePath, 'assets', item))
        pass
    # 复制活动
    api_file.copydir(os.path.join(desPath, 'activity'), os.path.join(wholePackagePath, 'assets'), { 'bKeepOld': True })
    for item in os.listdir(os.path.join(desPath, 'activity')):
        restoreZip(os.path.join(wholePackagePath, 'assets', item))
        pass
# 复制到android工程
if ('replace' in config) and config['replace']:
    dataPath = os.path.join(config['projectPath'], 'build/' + buildConfig['outputName'] + '/assets')
    api_file.deletedir(dataPath)
    api_file.copydir(wholePackagePath, dataPath)