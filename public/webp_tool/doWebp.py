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

#加载配置
config = api_file.readCacheJsonFile()

#源资源路径
api_file.objectDefault(config, 'webpConfig', api_file.objectDefault(config['webpConfig'], 'srcPath', 'res'))
srcPath = config['webpConfig']['srcPath']
#输出资源路径
api_file.objectDefault(config, 'webpConfig', api_file.objectDefault(config['webpConfig'], 'desPath', 'webp'))
desPath = config['webpConfig']['desPath']
#移除旧目录
api_file.deletedir(desPath)
# os.makedirs(desPath)
#webp临时文件目录
tempWebpPath = desPath + '_temp'
#libwebp的cwebp.exe路径
webpPath = os.path.join(localPath, 'libwebp-1.2.0-windows-x64/bin/cwebp.exe')

#传入参数长度，第一个参数为文件所在位置
argvLen = len(sys.argv)
#图像质量
img_q = 75
if argvLen >= 2 and sys.argv[1]:
    img_q = int(sys.argv[1])
#压缩比
img_m = 6
if argvLen >= 3 and sys.argv[2]:
    img_m = int(sys.argv[2])

#路径处理
def dealPath(path):
    fileDir, fullFileName = os.path.split(path)
    fileName, fileType = os.path.splitext(fullFileName)
    newPath = re.sub(re.sub('(\\\\)+', '/', '^' + srcPath), re.sub('(\\\\)+', '/', desPath), re.sub('(\\\\)+', '/', fileDir))
    newFile = newPath + '/' + fullFileName
    if fileType == '.png' or fileType == '.jpg':
        newMd5Value = api_file.md5File(path)
        oldWebpFile = os.path.join(tempWebpPath, newMd5Value)
        if not os.path.exists(oldWebpFile):
            if not os.path.exists(newPath):
                os.makedirs(newPath)
            #google libwebp 官方工具功能齐全效果好
            # -q: [0~100] 图像质量，0表示最差质量，文件体积最小，细节损失严重，100表示最高图像质量，文件体积较大。该参数只针对有损压缩有明显效果。Google 官方的建议是 75，腾讯在对 WebP 评测时给出的建议也是 75。在这个值附近，WebP 能在压缩比、图像质量上取得较好的平衡。
            # -m: [0~6] 压缩比，0表示快速压缩，耗时短，压缩质量一般，6表示极限压缩，耗时长，压缩质量好。该参数也只针对有损压缩有明显效果。调节该参数最高能带来 20% ～ 40% 的更高压缩比，但相应的编码时间会增加 5～20 倍。Google 推荐的值是 4。
            os.system('{0} -q {1} -m {2} {3} -o {4}'.format(webpPath, img_q, img_m, path, newFile))
            #检测图片是否增大，如果增大则使用原图
            if os.path.exists(newFile):
                if os.path.getsize(newFile) > os.path.getsize(path):
                    api_file.copyfile(path, newFile)
                #缓存资源（以便下次无需再次压缩）
                api_file.copyfile(newFile, oldWebpFile)
            else:
                if not os.path.exists(newFile) or not filecmp.cmp(path, newFile):
                    api_file.copyfile(path, newFile)
        else:
            #直接使用缓存资源
            api_file.copyfile(oldWebpFile, newFile)
    else:
        if not os.path.exists(newFile) or not filecmp.cmp(path, newFile):
            api_file.copyfile(path, newFile)

#遍历文件夹
api_file.traverseDir(srcPath, dealPath)

print('Successed')
