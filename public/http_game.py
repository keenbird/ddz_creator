#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os, sys
sys.path.append("..")
import public.api_file as api_file

api_file.autoImport("re")
import re
api_file.autoImport("requests")
import requests

config = api_file.readCacheJsonFile()

#传入参数长度
args = sys.argv
argcLen = len(args)
print("传入参数长度 : " + str(argcLen))

#后台“游戏子集分类设置”中的序号
id = 1
if argcLen > 1:
    id = args[1]
version_id = 1
if argcLen > 2:
    version_id = args[2]

webUrl = config['webUrl']
if ('isRelease' in config) and config['isRelease']:
    webUrl = config['webUrlRelease']

# http请求地址
def doHttp_1():
    params = {
        #后台“游戏子集分类设置”中的序号
        "id": id,
        "version": version_id,
    }
    print(params)
    #创建连接
    url = webUrl + 'ClientWidget/gamechild'
    # print(url)
    # os.system('pause')
    r = requests.post(url, params)
    print("requests status: " + str(r.status_code))
    if r.status_code != 200:
        print(r.text)

doHttp_1()

print("")
