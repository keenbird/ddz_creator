#!/usr/bin/python
# -*- coding: UTF-8 -*-
import os, sys
sys.path.append('..')
import api_file

#这里是为了确保PIL库存在，不存在会自动下载
api_file.autoImport('filecmp')
import filecmp
api_file.autoImport('json')
import json
api_file.autoImport('re')
import re

localPath = api_file.getPathDirName(os.path.abspath(__file__))
print('localPath: ' + localPath)
#libwebp的cwebp.exe路径
webpPath = os.path.join(localPath, 'libwebp-1.2.0-windows-x64/bin/webpinfo.exe')


srcPath = sys.argv[1]

#路径处理
def dealPath(path):
    fileDir, fullFileName = os.path.split(path)
    fileName, fileType = os.path.splitext(fullFileName)
    if fileType == '.png' or fileType == '.jpg':
        os.system('{0} {1}'.format(webpPath, path));

#遍历文件夹
api_file.traverseDir(srcPath, dealPath)

print('Successed')
