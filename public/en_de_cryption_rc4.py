#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import re
import sys
import api_file
import xxtea

# 加解密key 源于 md5（16位） -> awpdgame
key = b'6bbbd5e1fcb48273'
# 加解密key 源于 md5（32位） -> awpd
prefix = b'bbfe37f87dc5d5843409deea52e39e7c'

# fungame md5 16
simple_key = b"48de5cbe515b7e13";
# fungamebr md5 16
simple_prefix = b"1cef9bc25c4d39a3";

def crypt(filePath):
    crypted = None
    with open(filePath, 'rb') as f_in:
        data = f_in.read()
        if data.startswith(prefix):
            crypted = xxtea.decrypt(data.removeprefix(prefix), key)
        else:
            crypted = prefix + xxtea.encrypt(data, key)
    with open(filePath, 'wb') as f_out:
        f_out.write(crypted)
        
def simple_xor_encrypt(data, key):
    # 将字符串转换为字节流
    data_bytes = data
    key_bytes = key
    # 用密钥循环异或明文数据
    encrypted_bytes = bytearray()
    for i in range(len(data_bytes)):
        encrypted_bytes.append(data_bytes[i] ^ key_bytes[i % len(key_bytes)])
    return encrypted_bytes

def crypt_simple(filePath):
    crypted = None
    with open(filePath, 'rb') as f_in:
        data = f_in.read()
        if data.startswith(simple_prefix):
            crypted = simple_xor_encrypt(data.removeprefix(simple_prefix),simple_key)
        else:
            crypted = simple_prefix + simple_xor_encrypt(data,simple_key)
    with open(filePath, 'wb') as f_out:
        f_out.write(crypted)


#检测加解密（不检测音频文件）
soundTypeMark = {}
soundTypes = [".mp3", ".ogg", ".wav"]
for i in soundTypes:
    soundTypeMark[i] = True
def en_de_cryption(filePath):
    if os.path.isfile(filePath):
        print(filePath)
        if (api_file.getFileExtensionName(filePath) in soundTypeMark):
            print('无需加解密文件：' + filePath)
        else:
            crypt_simple(filePath)
    else:
        for filePathEx in os.listdir(filePath):
            en_de_cryption(filePath + "/" + filePathEx)


#执行
argPath = sys.argv[1]
if os.path.exists(argPath):
    en_de_cryption(argPath)
else:
    print("文件不存在：" + argPath)
print("")
