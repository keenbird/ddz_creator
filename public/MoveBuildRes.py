# encoding=utf-8

import re,os
import api_file

# 自定义配置
config = api_file.readCacheJsonFile()
api_file.objectDefault(config, 'games', [])
api_file.objectDefault(config, 'activitys', [])

# 构建配置
buildConfig = api_file.readJsonFile(config['buildConfigPath'])

desPath = config['hotPath'] + '/assets/'
srcPath = config['projectPath'] + '/build/' + buildConfig['outputName'] + '/data/'

# 移除旧资源
api_file.deletedir(desPath)

# main资源
mainPath = desPath + 'main/'
if config['game_dynamic']['plaza']['select']:
    paths = [
        'main.js', 
        'src',
        'jsb-adapter',
        'assets/internal',
        'assets/main',
        'assets/login',
        'assets/plaza',
        'assets/resources',
        'assets/update',
    ]
    for item in paths:
        path = srcPath + item
        if os.path.exists(path):
            if os.path.isfile(path):
                api_file.copyfile(path, mainPath + item)
            else:
                api_file.copydir(path, mainPath + item)

# 游戏资源
assetsPath = srcPath + 'assets/'
if os.path.exists(assetsPath):
    dirs = os.listdir(assetsPath)
    for item in dirs:
        if os.path.isdir(assetsPath + item):
            if item in config['games']:
                if (item in config['game_dynamic']) and config['game_dynamic'][item]['select']:
                    api_file.copydir(assetsPath + item, desPath + '/game/' + item)
            elif item in config['activitys']:
                if (item in config['game_dynamic']) and config['game_dynamic'][item]['select']:
                    api_file.copydir(assetsPath + item, desPath + '/activity/' + item)
            else:
                continue