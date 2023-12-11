#!/usr/bin/python
# -*- coding: UTF-8 -*-

import sys, os, re
sys.path.append("..")
import public.api_file as api_file

#这里是为了确保ftplib库存在，不存在会自动下载
api_file.autoImport("ftplib")

from ftplib import FTP
# ftp.cwd(path) # 设置FTP当前操作的路径，同linux中的cd
# ftp.dir() # 显示目录下所有信息
# ftp.nlst() # 获取目录下的文件，显示的是文件名列表
# ftp.mkd(directory) # 新建远程目录
# ftp.rmd(directory) # 删除远程目录
# ftp.rename(old, new) # 将远程文件old重命名为new
# ftp.delete(file_name) # 删除远程文件
# ftp.storbinary(cmd, fp, bufsize) # 上传文件，cmd是一个存储命令，可以为'STOR filename.txt'， fp为类文件对象（有read方法），bufsize设置缓冲大小
# ftp.retrbinary(cmd, callback, bufsize) # 下载文件，cmd是一个获取命令，可以为'RETR filename.txt'， callback是一个回调函数，用于读取获取到的数据块

config = api_file.readCacheJsonFile()

ip = re.sub(r'https?:/*', '', config['webUrl'])
ip = re.sub(r'/*$', '', ip)
print('ip: ' + ip)
host = 60021

account = 'abc'
password = 'abc'
if ('isRelease' in config) and config['isRelease']:
    host = 50021
    account = 'abc'
    ip = 'abc'
    password = 'abc+abc'

# print(account)
# print(password)
# print(ip)
# print(host)

# os.system('pause')

#基础路径
basePath = 'Static/game/Resources/creator/'
#游戏
game = 'main/'
#指定文件夹
appointPaths = ['100/assets']
appointPaths = []
#排除文件夹
excludePaths = {'304': True, '272': True,}
excludePaths = {}
#指定文件
appointFiles = ['100/src/chunks/bundle.js']
appointFiles = []

def remove_file(ftp, file):
    try:
        ftp.delete(file)  # 删除目录下的文件
    except Exception as e:
        print(f"Failed to delete file: {file} - {str(e)}")

def remove_directory(ftp, directory):
    try:
        filelist = ftp.nlst(directory)  # 获取目录下的文件和文件夹列表
        for file in filelist:
            try:
                ftp.cwd(file)  # 尝试切换到文件夹
                ftp.cwd('/')
                remove_directory(ftp, f"{file}")  # 递归删除子文件夹及其内容
            except Exception:
                ftp.delete(f"{file}")  # 删除文件
        ftp.rmd(directory)  # 删除空文件夹
        print(f"Directory '{directory}' has been removed.")
    except Exception as e:
        print(f"Failed to remove directory '{directory}': {str(e)}")

ftp = FTP()
ftp.set_debuglevel(2)
ftp.connect(ip, host, 60) # 第一个参数可以是ftp服务器的ip或者域名，第二个参数为ftp服务器的连接端口，默认为21
ftp.login(account, password) # 匿名登录直接使用ftp.login()

if len(appointPaths) > 0:
    for item in appointPaths:
        remove_directory(ftp, basePath + game + str(item))

if len(excludePaths) > 0:
    list = ftp.nlst(basePath + game)
    for item in list:
        name = api_file.getFileName(item)
        if not (name in excludePaths):
            remove_directory(ftp, item)

if len(appointFiles) > 0:
    for item in appointFiles:
        ftp.delete(basePath + game + str(item))
        
ftp.quit()

print('')
