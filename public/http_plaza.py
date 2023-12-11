#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os, sys
sys.path.append("..")
import public.api_file as api_file

api_file.autoImport("re")
import re
api_file.autoImport("time")
import time
api_file.autoImport("json")
import json
api_file.autoImport("hashlib")
import hashlib
api_file.autoImport("requests")
import requests

config = api_file.readCacheJsonFile()

#传入参数长度
args = sys.argv
argcLen = len(args)
print('传入参数长度 : ' + str(argcLen))

#版本号
version_id = 1
#渠道
channel_id = 3
#键值
keys = ['newFlist']
if argcLen > 1:
    version_id = args[1]
if argcLen > 2:
    channel_id = args[2]
if argcLen > 3:
    keys = args[3].split(',')
version_id = str(version_id)
channel_id = str(channel_id)

extraObj = {}
if ('plaza_version' in config):
    if (channel_id in config['plaza_version']):
        extraObj = config['plaza_version'][channel_id]

# 总长度
nMaxCount = len(keys)
if nMaxCount > 1:
    extraObjEx = extraObj
    # 倒数第1个
    nLastIndex = nMaxCount - 1
    for index in range(nMaxCount):
        value = keys[index]
        if not (value in extraObjEx):
            extraObjEx[value] = {}
        # 倒数第2个
        if index == nLastIndex - 1:
            extraObjEx[value][keys[nLastIndex]] = version_id
            break
        else:
            extraObjEx = extraObjEx[value]
else:
    extraObj[keys[0]] = version_id

# 保存信息
api_file.writeCacheJsonFile(config)

# 写一个单独的文件
api_file.writeJsonFile(os.path.join(config['hotPath'], 'phpJsonVersion.json'), extraObj)
api_file.writefile(os.path.join(config['hotPath'], 'phpJsonVersionMin.json'), json.dumps(extraObj,separators=(',',':')))

# http请求地址
webUrl = config['webUrl']
if ('isRelease' in config) and config['isRelease']:
    webUrl = config['webUrlRelease']

def doHttp_1():
    params = {
        #渠道
        'channel': channel_id,
        #版本号
        'extra': json.dumps(extraObj),
    }
    print(json.dumps(params))
    #创建连接
    url = webUrl + 'ClientWidget/version'
    # print(url)
    # os.system('pause')
    r = requests.post(url, params)
    print('requests status: ' + str(r.status_code))
    if r.status_code != 200:
        print(r.text)

doHttp_1()

print('')
