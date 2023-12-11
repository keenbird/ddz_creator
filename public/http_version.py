#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os, sys
sys.path.append("..")
import public.api_file as api_file

api_file.autoImport("json")
import json
api_file.autoImport("requests")
import requests

config = api_file.readCacheJsonFile()

#传入参数长度
args = sys.argv
argcLen = len(args)
print('传入参数长度 : ' + str(argcLen))

#渠道
channel_id = 0
if argcLen > 1:
    channel_id = args[1]
channel_id = str(channel_id)

# http请求地址
webUrl = config['webUrl']
versionFileName = 'version' + channel_id + '.txt'
remotePath = 'Static/game/Resources/creator/' + versionFileName

def doHttp_1():
    #创建连接
    url = webUrl + remotePath
    # print(url)
    # os.system('pause')
    r = requests.get(url)
    print('requests status: ' + str(r.status_code))
    if r.status_code != 200:
        print(r.text)
    else:
        changed = {}
        versions = json.loads(r.text)
        if 'game_dynamic' in config:
            for name in config['game_dynamic']:
                if config['game_dynamic'][name]['select']:
                    if name in versions:
                        versions[name] = versions[name] + 1
                    else:
                        versions[name] = 1
                    changed[name] = versions[name]
        localPath = os.path.join(config['hotPath'], 'versionConfig.json')
        changedPath = os.path.join(config['hotPath'], 'versionConfig_changed.json')
        api_file.writeJsonFile(localPath, versions)
        api_file.writeJsonFile(changedPath, changed)
        # 上传
        os.system('python ftp.py {0} {1} True'.format('/' + remotePath, localPath))
        print(versions)

doHttp_1()

print('')
