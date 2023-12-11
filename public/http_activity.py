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
print("传入参数长度 : " + str(argcLen))

#活动名称
activityName = ""
#活动版本
version_id = ""
#channel
channel_id = ""
if argcLen > 1:
    activityName = args[1]
if argcLen > 2:
    version_id = args[2]
if argcLen > 3:
    channel_id = args[3]

extraObj = {}
if ('plaza_version' in config):
    if (channel_id in config['plaza_version']):
        extraObj = config['plaza_version'][channel_id]
if not ('activitys' in extraObj):
    extraObj['activitys'] = {}
extraObj['activitys'][activityName] = version_id

# 保存信息
api_file.writeCacheJsonFile(config)

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

print("")
