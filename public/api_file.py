#!/usr/bin/python
# -*- coding: UTF-8 -*-


import os, sys
import platform


def downPackage(moduleName, bAutoImport=True):
    """自动导入模块，当模块不存在时自动下载，系统路径下不能有中文（'文件名'，'文件夹名'，'系统用户名'等都不行）"""
    print('模块\'' + moduleName + '\'不存在')
    print('正在安装: ' + moduleName)
    print(sys.getdefaultencoding())
    # 获取当前环境编码模式
    chcpResult = os.popen('chcp').read()
    # 这里默认有值
    encodingType = re.findall('\d+', chcpResult)[0]
    # 936为GBK编码，此编码模式下才能正常执行python命令行代码
    os.system('chcp 936')
    # 打印旧编码模式
    print('old encoding type : ' + encodingType)
    os.system('python -m pip install --upgrade pip')
    # os.popen方法用于从一个命令打开一个管道。返回的是一个file，.read()是为了查看打印执行结果
    installResult = os.popen('pip install ' + moduleName).read()
    # os.system可能会出现ERROR: Could not install packages due to an EnvironmentError，暂时没找到较好的解决办法
    # os.system('pip install ' + moduleName + ' --user')
    result = None
    if bAutoImport:
        try:
            result = tempImport(moduleName)
        except ImportError:
            result = None
    # 65001为UTF-8编码，此编码模式下才能显示中文输出，这里
    # os.system('chcp 65001')
    # 还原编码模式
    os.system('chcp ' + encodingType)
    print(installResult)
    if not bAutoImport or result != None:
        print(moduleName + '安装成功')
    else:
        print(moduleName + '安装失败')
    return result


def tempImport(moduleName):
    return __import__(moduleName)


def autoImport(moduleName, bAutoImport=True):
    try:
        if bAutoImport:
            return tempImport(moduleName)
        else:
            allPackage = os.popen('pip list').read()
            print(allPackage)
            if moduleName in allPackage:
                return None
            else:
                return downPackage(moduleName, bAutoImport)
    except ImportError:
        return downPackage(moduleName, bAutoImport)


autoImport('shutil')  # 文件处理模块
import shutil
autoImport('re')  # 正则
import re
autoImport('json')  # json
import json
autoImport('hashlib')  # md5
import hashlib


def md5(string):
    """获取字符串md5值"""
    return hashlib.md5(str(string).encode()).hexdigest()


def md5File(filePath):
    """获取文件md5值"""
    if not os.path.exists(filePath):
        return ''
    hash_md5 = hashlib.md5()
    with open(filePath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b''):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def objectDefault(obj, key, default):
    """设置对象默认值"""
    if type(obj) == dict:
        if (not (key in obj)):
            obj[key] = default
        return obj[key]
    return None


def isWin32Platform(targetPlatform=None):
    """是否是Window平台"""
    return (targetPlatform or platform.system()) == 'Windows'


def isLinuxPlatform(targetPlatform=None):
    """是否是Linux平台"""
    return (targetPlatform or platform.system()) == 'Linux'


def getPlatform():
    """获取当前平台"""
    return platform.system()


def abspath(path):
    """转为绝对路径"""
    return os.path.abspath(path)


def getPathDirName(path):
    """获取路径
    native/e2/e22ab8f1-503b-494e-acec-e8ed7c5277cb.json => native/e2
    native/e2/e22ab8f1-503b-494e-acec-e8ed7c5277cb => native/e2
    """
    return os.path.dirname(path)


def getPathFileName(path):
    """获取文件名（包涵扩展名，也可以是文件夹路径最后一个文件夹名称）
    native/e2/e22ab8f1-503b-494e-acec-e8ed7c5277cb.json => e22ab8f1-503b-494e-acec-e8ed7c5277cb.json
    native/e2/e22ab8f1-503b-494e-acec-e8ed7c5277cb => e22ab8f1-503b-494e-acec-e8ed7c5277cb
    """
    return os.path.basename(path)


def getFileName(fileName):
    """获取文件名
    native/e2/e22ab8f1-503b-494e-acec-e8ed7c5277cb.json => e22ab8f1-503b-494e-acec-e8ed7c5277cb
    native/e2/e22ab8f1-503b-494e-acec-e8ed7c5277cb => e22ab8f1-503b-494e-acec-e8ed7c5277cb
    """
    return os.path.splitext(getPathFileName(fileName))[0]


def getFileExtensionName(fileName):
    """获取扩展名
    native/e2/e22ab8f1-503b-494e-acec-e8ed7c5277cb.json => .json
    native/e2/e22ab8f1-503b-494e-acec-e8ed7c5277cb => ''
    """
    return os.path.splitext(getPathFileName(fileName))[1]


def dealPathForRe(filePath):
    """将路径转为正则匹配路径"""
    return re.sub('\\\\', '/', filePath)


def traverseDir(srcdir, callback, traverseData={}):
    """遍历文件夹"""
    srcdir = os.path.abspath(srcdir)
    if 'couldStop' in traverseData and traverseData['couldStop']:
        return
    if os.path.isdir(srcdir):
        if 'bDirDoCallback' in traverseData and traverseData['bDirDoCallback']:
            callback(srcdir)
        paths = os.listdir(srcdir)
        for item in paths:
            if 'couldStop' in traverseData and traverseData['couldStop']:
                return
            fullPath = srcdir + '/' + item
            if os.path.exists(fullPath):
                if os.path.isfile(fullPath):
                    callback(fullPath)
                else:
                    traverseDir(fullPath, callback, traverseData)
    else:
        callback(srcdir)


def copyfile(srcfile, desfile):
    """复制文件"""
    srcfile = os.path.abspath(srcfile)
    desfile = os.path.abspath(desfile)
    print('\n')
    if not os.path.isfile(srcfile):
        print('%s not exist!' % (srcfile))
    else:
        fpath, fname = os.path.split(desfile)  # 分离文件名和路径
        if not os.path.exists(fpath):
            os.makedirs(fpath)  # 创建路径
        if os.path.exists(desfile):
            os.unlink(desfile)
        shutil.copyfile(srcfile, desfile)  # 复制文件
        print('copyfile %s -> %s' % (srcfile, desfile))


def copydir(srcdir, desdir, traverseData={}):
    """复制文件夹"""
    srcdir = os.path.abspath(srcdir)
    desdir = os.path.abspath(desdir)
    print('try copy %s -> %s\n' % (srcdir, desdir))
    if not os.path.exists(srcdir):
        print('%s not exist!' % (srcdir))
    else:
        if os.path.isdir(srcdir):
            if ('bKeepOld' in traverseData) and traverseData['bKeepOld']:
                srcdirRe = dealPathForRe(srcdir)
                desdirRe = dealPathForRe(desdir)
                traverseDir(srcdir, lambda fullPath: copyfile(
                    fullPath, re.sub(srcdirRe, desdirRe, dealPathForRe(fullPath))))
            else:
                # 为了提高效率，各平台单独处理
                if isWin32Platform():
                    newDesdir = re.sub(r'/', r'\\', desdir)
                    newSrcdir = re.sub(r'/', r'\\', srcdir)
                    if os.path.exists(newDesdir):
                        os.system('rmdir /s/q %s' % (newDesdir))
                    os.system('xcopy %s\ %s\ /S /F /R /Y /E /Q' %
                              (newSrcdir, newDesdir))
                else:
                    if os.path.exists(desdir):
                        shutil.rmtree(desdir)
                    shutil.copytree(srcdir, desdir)
            print('copydir successed')
        else:
            print('copydir error %s not exist' % (srcdir))


def movefile(srcfile, desfile):
    """移动文件"""
    srcfile = os.path.abspath(srcfile)
    desfile = os.path.abspath(desfile)
    print('\n')
    if not os.path.isfile(srcfile):
        print('%s not exist!' % (srcfile))
    else:
        fpath, fname = os.path.split(desfile)  # 分离文件名和路径
        if not os.path.exists(fpath):
            os.makedirs(fpath)  # 创建路径
        if os.path.exists(desfile):
            os.unlink(desfile)
        shutil.move(srcfile, desfile)  # 移动文件
        print('movefile %s -> %s' % (srcfile, desfile))


def movedir(srcdir, desdir):
    """移动文件夹"""
    srcdir = os.path.abspath(srcdir)
    desdir = os.path.abspath(desdir)
    print('try move %s -> %s\n' % (srcdir, desdir))
    if not os.path.exists(srcdir):
        print('%s not exist!' % (srcdir))
    else:
        if os.path.isdir(srcdir):
            if os.path.exists(desdir):
                shutil.rmtree(desdir)
            shutil.move(srcdir, desdir)
            print('movedir successed')
        else:
            print('movedir error %s not exist' % (srcdir))


def deletefile(srcfile):
    """移除文件"""
    srcfile = os.path.abspath(srcfile)
    print('try delete %s\n' % (srcfile))
    if not os.path.exists(srcfile):
        print('%s not exist!' % (srcfile))
    else:
        if os.path.isfile(srcfile):
            os.unlink(srcfile)
            print('deletefile successed')
        else:
            print('deletefile error %s is not file' % (srcfile))


def deletedir(srcdir):
    """移除文件夹"""
    srcdir = os.path.abspath(srcdir)
    print('try delete %s\n' % (srcdir))
    if not os.path.exists(srcdir):
        print('%s not exist!' % (srcdir))
    else:
        if os.path.isdir(srcdir):
            shutil.rmtree(srcdir)
            print('deletedir successed')
        else:
            print('deletedir error %s is not dir' % (srcdir))


def readfile(filePath):
    """读取文件"""
    filePath = os.path.abspath(filePath)
    print('try readfile %s\n' % (filePath))
    if not os.path.exists(filePath):
        print('%s not exist!' % (filePath))
        return ''
    else:
        with open(filePath, 'r', encoding='utf-8') as f:
            fileData = f.read()
            f.close()
            return fileData


def writefile(filePath, fileData):
    """写入文件"""
    filePath = os.path.abspath(filePath)
    print('try writefile %s\n' % (filePath))
    if os.path.isdir(filePath):
        print('%s is dir\n' % (filePath))
        return
    if os.path.exists(filePath):
        deletefile(filePath)
    with open(filePath, 'w') as f:
        f.write(fileData)
        f.close()


def readJsonFile(filePath):
    """json文件读取"""
    filePath = os.path.abspath(filePath)
    if os.path.exists(filePath):
        with open(filePath, 'r') as f:
            return json.load(f)
    else:
        return {}


def writeJsonFile(filePath, data):
    """json文件写入"""
    with open(filePath, 'w') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


# 用于缓存运行时参数，通过读写文件的形式
# 文件路径
cacheJsonFilePath = os.path.join(getPathDirName(os.path.abspath(__file__)), 'cacheJsonFile.json')
print('cacheJsonFilePath: ' + cacheJsonFilePath)


def readCacheJsonFile():
    """读取json配置文件，文件格式GBK2312，如果格式异常请重新生成"""
    return readJsonFile(cacheJsonFilePath)


def writeCacheJsonFile(data):
    """刷新json配置文件，文件格式GBK2312，如果格式异常请重新生成"""
    #配置可能在其他地方刷新了，所以这里先读一遍
    tempData = readCacheJsonFile()
    for key in data:
        tempData[key] = data[key]
    writeJsonFile(cacheJsonFilePath, tempData)
