#!/usr/bin/python
# -*- coding: UTF-8 -*-

import sys,os

curPath = os.getcwd()

srcPath = curPath + "./../assets"

def dfs_dir(dir_path,record_tab):
    #lst = os.scandir(dir_path)
    lst = os.listdir(dir_path)
    for file in lst:
        file = dir_path + "/" + file
        if os.path.isdir(file):
            dfs_dir(file,record_tab)
        if os.path.isfile(file):
            if os.path.basename(file).endswith(".ts"):
                if record_tab.get(os.path.basename(file)) == None:
                    record_tab[os.path.basename(file)] = 1
                else:
                    record_tab[os.path.basename(file)] += 1
    return

record = {}
dfs_dir(srcPath,record)

for key,values in record.items():
    if values > 1 :
        print (key,values)