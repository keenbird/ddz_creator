#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os, sys
import traceback
import gui_callback as c
sys.path.append('..')
import api_file

# GUI
api_file.autoImport('tkinter')
import tkinter
from tkinter import ttk
from tkinter import filedialog

# hashlib
api_file.autoImport('hashlib')
import hashlib
# time
api_file.autoImport('time')
import time

# win32gui
api_file.autoImport('win32gui')
import win32gui
# win32con
api_file.autoImport('win32con')
import win32con
# win32process
api_file.autoImport('win32process')
import win32process

jsonFilePath = os.path.join(api_file.getPathDirName(os.path.abspath(__file__)), 'guiConfig.json')
guiConfig = api_file.readJsonFile(jsonFilePath)
#移除旧窗口
if 'lastWindowHwnd' in guiConfig:
    hwnd = guiConfig['lastWindowHwnd']
    if win32gui.IsWindow(hwnd) and win32gui.IsWindowEnabled(hwnd) and win32gui.IsWindowVisible(hwnd):
        win32gui.PostMessage(guiConfig['lastWindowHwnd'], win32con.WM_CLOSE, 0, 0)

# 线程
# api_file.autoImport('threading')
# import threading
# #开启一个定时器
# threading.Timer(1, lambda: addd(t)).start()

# 像素大小
# 添加虚拟的不可见的 1x1 像素图像
# pixelVirtual = tkinter.PhotoImage(width=1, height=1)
# 然后在对应的ui下添加下列两个参数
# image = pixelVirtual,
# compound = tkinter.CENTER,

# ui相关回调
def OptionMenu_1(data):
    """创建一个下拉单选"""
    # 标题
    title = tkinter.Label(data['t'], text=data['title'])
    title.place(x=data['x'], y=data['y'] + title.winfo_reqheight() / 2 / 2)
    # 内容显示对象
    text = tkinter.StringVar()
    data['command'](data['default'])
    # 列表内容
    option_menu = tkinter.OptionMenu(
        data['t'],
        # 文本显示 tkinter
        text,
        # 复选框内容列表
        *data['info'],
        # 回调（参数为列表字符串）
        command=data['command']
    )
    option_menu.place(x=data['x'] + title.winfo_reqwidth(), y=data['y'])
    # 默认值
    text.set(data['default'])


def Checkbox_1(data):
    """创建一个多选按钮"""
    # 内容显示对象
    text = tkinter.StringVar()
    # 复选框内容
    checkButton = None
    if ('width' in data) or ('height' in data):
        # 添加虚拟的不可见的 1x1 像素图像
        checkButton = tkinter.Checkbutton(
            data['t'],
            # 标题
            text=data['title'],
            # 复合物
            bg='white',
            # 大小，这里不赋值，默认自动大小
            width=('width' in data) and data['width'] or 0,
            height=('height' in data) and data['height'] or 0,
            # 对齐方式
            anchor='sw',
            # 文本显示 tkinter
            variable=text,
            # 回调
            command=lambda: data['command'](text.get())
        )
    else:
        checkButton = tkinter.Checkbutton(
            data['t'],
            # 标题
            text=data['title'],
            # 背景
            bg='white',
            # 文本显示 tkinter
            variable=text,
            # 回调
            command=lambda: data['command'](text.get())
        )
    checkButton.place(x=data['x'], y=data['y'])
    # 默认值
    data['command'](data['default'])
    # 调整“选中”“未选中”效果
    if data['default'] == '1':
        checkButton.select()
    else:
        checkButton.deselect()
    return checkButton


def EditBox_1(data):
    """创建一个输入框"""
    tempX = data['x']
    # 标题
    title = tkinter.Label(data['t'], text=data['title'])
    title.place(x=tempX, y=data['y'] + title.winfo_reqheight() / 2 / 2)
    # 输入框
    text = tkinter.StringVar()
    enter = tkinter.Entry(data['t'], width=data['width'], textvariable=text)
    enter.insert(0, data['default'])
    tempX += title.winfo_reqwidth()
    enter.place(x=tempX, y=data['y'] + enter.winfo_reqheight() / 2 / 2)
    # 按钮
    b = tkinter.Button(data['t'], text=data['btnTxt'],
                       command=lambda: data['command'](text.get()))
    tempX += enter.winfo_reqwidth()
    b.place(x=tempX, y=data['y'])
    # 设置默认
    data['command'](data['default'])
    # 保存引用
    data['enter'] = enter
    return data


def doPath(enter, data):
    """路径或文件夹"""
    p = ''
    api_file.objectDefault(data, 'type', 'file')
    if (data['type'] == 'file'):
        p = filedialog.askopenfilename(filetypes=data['filetyps'])
    elif (data['type'] == 'dir'):
        p = filedialog.askdirectory()
    else:
        p = ''
    if p != '':
        enter.delete(0, 'end')
        enter.insert(0, p)
        data['command'](p)


def Path_1(data):
    tempX = data['x']
    # 标题
    title = tkinter.Label(data['t'], text=data['title'])
    title.place(x=tempX, y=data['y'] + title.winfo_reqheight() / 2 / 2)
    # 输入框
    enter = tkinter.Entry(data['t'], width=data['width'])
    enter.insert(0, data['default'])
    tempX += title.winfo_reqwidth()
    enter.place(x=tempX, y=data['y'] + enter.winfo_reqheight() / 2 / 2)
    # 按钮
    b = tkinter.Button(data['t'], text=data['btnTxt'],
                       command=lambda: doPath(enter, data))
    tempX += enter.winfo_reqwidth()
    b.place(x=tempX, y=data['y'])
    # 设置默认
    data['command'](data['default'])
    # 保存引用
    data['enter'] = enter
    return data


bInited = False
nRowLength = 35
nColLength = 200
nRowLengthNow = 0


def gui(title):
    """设计UI"""
    global bInited
    global nRowLength
    global nColLength
    global nRowLengthNow
    # 创建窗口
    t = tkinter.Tk()
    # 设置窗口大小
    winWith = 820
    winHeight = 800
    t.geometry('{0}x{1}'.format(winWith, winHeight))
    # 标题
    t.title(title)
    # #设置窗口图标
    t.iconbitmap('./favicon.ico')
    # 设置窗口宽高固定
    t.resizable(width=True, height=True)
    # 起始位置
    # 分辨率，width
    # screenWidth = t.winfo_screenwidth()
    # 分辨率，height
    # screenHeight = t.winfo_screenheight()
    # 行间距
    # Cocos Creator路径
    cccPathData = Path_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow,
        'width': 70,
        'btnTxt': '选择文件',
        'type': 'file',
        'filetyps': [('运行程序', '.exe')],
        'title': 'Cocos Creator.exe路径:',
        'default': c.cccPath,
        'command': c.doCCCPath
    })
    nRowLengthNow += nRowLength
    # Project路径
    projectPathData = Path_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow,
        'width': 45,
        'btnTxt': '选择文件夹',
        'type': 'dir',
        'title': 'Cocos Creator工程路径:',
        'default': c.projectPath,
        'command': c.doProjectPath
    })
    nRowLengthNow += nRowLength
    # 后台ip
    webUrlData = EditBox_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow,
        'width': 55,
        'btnTxt': '刷新',
        'title': '后台ip:',
        'default': c.webUrl,
        'command': c.doWebUrl
    })
    nRowLengthNow += nRowLength
    # 正式服后台ip
    webUrlReleaseData = EditBox_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow,
        'width': 55,
        'btnTxt': '刷新',
        'title': '正式后台ip:',
        'default': c.webUrlRelease,
        'command': c.doWebUrlRelease
    })
    nRowLengthNow += nRowLength
    # 热更输出路径
    hotPathData = Path_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow,
        'width': 50,
        'btnTxt': '选择文件夹',
        'type': 'dir',
        'title': '热更输出路径:',
        'default': c.hotPath,
        'command': c.doHotPath
    })
    nRowLengthNow += nRowLength
    # 构建配置文件路径
    buildConfigPathData = Path_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow,
        'width': 50,
        'btnTxt': '选择文件',
        'type': 'file',
        'filetyps': [('json文件', '.json')],
        'title': '构建配置文件路径:',
        'default': c.buildConfigPath,
        'command': c.doBuildConfigPath
    })
    nRowLengthNow += nRowLength

    def doClass(dealType):
        global nRowLength
        global nColLength
        global nRowLengthNow
        # 添加提示
        text = {
            c.Type['plaza']: '大厅:',
            c.Type['activity']: '活动:',
            c.Type['game']: '游戏:',
        }
        allList = []

        def doAll():
            for item in allList:
                item['btn'].select()
                c.doGame('1', item['key'], False)
            c.doSave()

        def doClean():
            for item in allList:
                item['btn'].deselect()
                c.doGame('0', item['key'], False)
            c.doSave()
        title = tkinter.Label(t, text=text[dealType])
        title.place(x=nColLength * 0, y=nRowLengthNow + title.winfo_reqheight() / 2 / 2)
        all = tkinter.Button(t, text='全选', command=doAll)
        all.place(x=title.winfo_reqwidth() + 5, y=nRowLengthNow)
        clean = tkinter.Button(t, text='清空', command=doClean)
        clean.place(x=title.winfo_reqwidth() + all.winfo_reqwidth() + 15, y=nRowLengthNow)
        nRowLengthNow += nRowLength
        nCount = 0
        for item in c.game_list:
            if item['type'] == dealType:
                allList.append({
                    'btn': Checkbox_1({
                        't': t,
                        'x': 117 * nCount - 1,
                        'y': nRowLengthNow,
                        'width': 12,
                        'title': item['name'],
                        'default': c.game_dynamic[item['res']]['select'] and '1' or '0',
                        'command': (lambda key: lambda state: c.doGame(state, key, bInited))(item['res'])
                    }),
                    'key': item['res']
                })
                if nCount > 5:
                    nCount = 0
                    nRowLengthNow += nRowLength - 5
                else:
                    nCount = nCount + 1
        nRowLengthNow += nRowLength
    # 正式 or 测试
    Checkbox_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow + 3,
        'title': '是否正式服（脚本中调整参数）',
        'default': c.isRelease_default,
        'command': c.doIsRelease
    })
    # 渠道
    OptionMenu_1({
        't': t,
        'x': nColLength * 1,
        'y': nRowLengthNow,
        'title': '渠道:',
        'default': c.channel_default,
        'info': c.channel_info,
        'command': c.channel
    })
    # apk版本号
    apkVerionData = EditBox_1({
        't': t,
        'x': nColLength * 2,
        'y': nRowLengthNow,
        'width': 10,
        'btnTxt': '刷新',
        'title': 'apk版本号:',
        'default': c.apkVersion,
        'command': c.doApkVersion
    })
    # 压缩资源的最小大小
    compressSizeData = EditBox_1({
        't': t,
        'x': nColLength * 3,
        'y': nRowLengthNow,
        'width': 5,
        'btnTxt': '刷新',
        'title': '压缩大小:',
        'default': c.compressSize,
        'command': c.doCompressSize
    })
    nRowLengthNow += nRowLength
    doClass(c.Type['plaza'])
    doClass(c.Type['activity'])
    doClass(c.Type['game'])
    # webp图片处理
    Checkbox_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow,
        'title': '图片转webp（ "复制编译资源" 时是否webp处理，同时决定 "生成manifest" 时使用的目录）',
        'default': c.doWebp_default,
        'command': c.doWebp
    })
    nRowLengthNow += nRowLength
    # 整包仅大厅资源
    Checkbox_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow,
        'title': '生成整包时仅大厅资源（整包资源不包含 “游戏” 和 “活动”）',
        'default': c.onlyPlazaRes_default,
        'command': c.doOnlyPlazaRes
    })
    nRowLengthNow += nRowLength
    # 生成整包后自动替换android资源build/android/data
    Checkbox_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow,
        'title': '生成整包后自动替换android资源',
        'default': c.replace_default,
        'command': c.doReplace
    })
    nRowLengthNow += nRowLength
    # 生成整包后自动替换android资源build/android/data
    Checkbox_1({
        't': t,
        'x': nColLength * 0,
        'y': nRowLengthNow,
        'title': '资源是否加密（测试时不要勾选此选项）',
        'default': c.encryption_default,
        'command': c.doEncryption
    })
    nRowLengthNow += nRowLength
    # 位置
    tempXDiff = 20
    tempX = winWith
    tempY = winHeight - 20
    # 构建资源
    btn_structure = tkinter.Button(t, text='构建资源', fg='white', bg='black', command=lambda: c.doStructure())
    tempX -= btn_structure.winfo_reqwidth() + tempXDiff
    btn_structure.place(x=tempX, y=tempY - btn_structure.winfo_reqheight())
    # 复制编译资源
    btn_copyRes = tkinter.Button(t, text='复制编译资源', fg='white', bg='black', command=lambda: c.doCopyRes())
    tempX -= btn_copyRes.winfo_reqwidth() + tempXDiff
    btn_copyRes.place(x=tempX, y=tempY - btn_copyRes.winfo_reqheight())
    # 生成manifest
    btn_manifest = tkinter.Button(t, text='生成manifest', fg='white', bg='black', command=lambda: c.doManifest())
    tempX -= btn_manifest.winfo_reqwidth() + tempXDiff
    btn_manifest.place(x=tempX, y=tempY - btn_manifest.winfo_reqheight())
    # 生成压缩包
    btn_zip = tkinter.Button(t, text='压缩上传', fg='white', bg='black', command=lambda: c.doCompressAndUpload())
    tempX -= btn_zip.winfo_reqwidth() + tempXDiff
    btn_zip.place(x=tempX, y=tempY - btn_zip.winfo_reqheight())
    # 生成整包资源
    btn_wholePackage = tkinter.Button(t, text='生成整包资源', fg='white', bg='black', command=lambda: c.doPackageRes())
    tempX -= btn_wholePackage.winfo_reqwidth() + tempXDiff
    btn_wholePackage.place(x=tempX, y=tempY - btn_wholePackage.winfo_reqheight())
    # 一键更新
    btn_update = tkinter.Button(t, text='一键更新', fg='white', bg='black', command=lambda: c.doOnestopService())
    tempX -= btn_update.winfo_reqwidth() + tempXDiff
    btn_update.place(x=tempX, y=tempY - btn_update.winfo_reqheight())
    # 保存配置
    funcs_save = []
    funcs_save.append(lambda: webUrlData['command'](webUrlData['enter'].get()))
    funcs_save.append(lambda: webUrlReleaseData['command'](webUrlReleaseData['enter'].get()))
    funcs_save.append(lambda: hotPathData['command'](hotPathData['enter'].get()))
    funcs_save.append(lambda: cccPathData['command'](cccPathData['enter'].get()))
    funcs_save.append(lambda: apkVerionData['command'](apkVerionData['enter'].get()))
    funcs_save.append(lambda: projectPathData['command'](projectPathData['enter'].get()))
    funcs_save.append(lambda: compressSizeData['command'](compressSizeData['enter'].get()))
    funcs_save.append(lambda: buildConfigPathData['command'](buildConfigPathData['enter'].get()))
    funcs_save.append(lambda: c.doSave())
    btn_save = tkinter.Button(t, text='保存配置', fg='white', bg='black', command=lambda: [func() for func in funcs_save])
    tempX -= btn_save.winfo_reqwidth() + tempXDiff
    btn_save.place(x=tempX, y=tempY - btn_save.winfo_reqheight())
    # 完成
    funcs_close = []
    funcs_close.append(lambda: cccPathData['command'](cccPathData['enter'].get()))
    funcs_close.append(lambda: projectPathData['command'](projectPathData['enter'].get()))
    funcs_close.append(lambda: c.doFinish(t))
    btn_close = tkinter.Button(t, text='完成', fg='white', bg='black', command=lambda: [func() for func in funcs_close])
    tempX -= btn_close.winfo_reqwidth() + tempXDiff
    btn_close.place(x=tempX, y=tempY - btn_close.winfo_reqheight())
    # 窗口置顶
    # t.attributes('-topmost', 1)
    # 初始化完成
    bInited = True
    # 缓存当前窗口句柄
    guiConfig['lastWindowHwnd'] = win32gui.FindWindow(None, title)
    api_file.writeJsonFile(jsonFilePath, guiConfig)
    # 开启主循环
    t.mainloop()
    return t

# 执行
try:
    t = gui('快捷工具:' + hashlib.md5(str(time.time()).encode()).hexdigest())
except Exception as e:
    # 打印堆栈
    print(traceback.format_exc())
    # 暂停，便于查看错误
    os.system('pause')
