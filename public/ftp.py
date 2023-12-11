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

#传入参数长度
args = sys.argv
argcLen = len(args)
print('传入参数长度 : ' + str(argcLen))

#远程路径/Static/game/Resources
remote_path_ = '/Static/game/Resources/haoya'
#本地路径
bUploadVersion = False
if argcLen > 1:
    remote_path_ = args[1]
if argcLen > 2:
    local_path_ = args[2]
if argcLen > 3:
    bUploadVersion = args[3]

ip = re.sub(r'https?:/*', '', config['webUrl'])
ip = re.sub(r'/*$', '', ip)
print('ip: ' + ip)
host = 60021

account = 'abc'
password = 'abc'
if not bUploadVersion:
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

def upload(ftp, remote_path, local_path):
    remote_path = re.sub(r'\\', r'/', remote_path)
    if os.path.isdir(local_path):
        paths = os.listdir(local_path)
        for item in paths:
            upload(ftp, os.path.join(remote_path, item), os.path.join(local_path, item))
    else:
        dirPath, filePath = os.path.split(remote_path)
        try:
            ftp.mkd(dirPath)
        except Exception as err:
            #尝试创建全目录
            tempDirPath = ''
            while True:
                tempDirPath = re.match(tempDirPath + r'/[^/]+', dirPath).group()
                try:
                    ftp.mkd(tempDirPath)
                except Exception as err:
                    pass
                if tempDirPath == dirPath:
                    break
        fp = open(local_path, 'rb')
        buf_size = 1024
        try:
            ftp.storbinary('STOR {}'.format(remote_path), fp, buf_size)
        except Exception as err:
            print('上传文件出错，出现异常 : %s ' % err)
        fp.close()

def download(ftp, remote_path, local_path):
    fp = open(local_path, 'wb')
    buf_size = 1024
    try:
        ftp.retrbinary('RETR ' + remote_path, fp.write, buf_size)
    except Exception as err:
        print('下载文件出错，出现异常 : %s ' % err)
    fp.close()

ftp = FTP()
ftp.set_debuglevel(2)
ftp.connect(ip, host, 60) # 第一个参数可以是ftp服务器的ip或者域名，第二个参数为ftp服务器的连接端口，默认为21
ftp.login(account, password) # 匿名登录直接使用ftp.login()
upload(ftp, remote_path_, local_path_) # 将当前目录下的a.txt文件上传到ftp服务器的tmp目录，命名为ftp_a.txt
ftp.quit()

print('')
