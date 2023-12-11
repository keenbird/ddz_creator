from asyncio.windows_events import NULL
import sys
import os
import configparser
import shutil
import json
from PIL import Image,ImageDraw
import aggdraw    
import random
import string


def circle_corner(image, radius):  #把原图片变成圆角，这个函数是从网上找的，原址 https://www.pyget.cn/p/185266
    """generate round corner for image"""
    mask = Image.new('L', image.size) # filled with black by default
    draw = aggdraw.Draw(mask)
    brush = aggdraw.Brush('white')
    width, height = mask.size
    #upper-left corner
    draw.pieslice((0,0,radius*2, radius*2), 90, 180, None, brush)
    #upper-right corner
    draw.pieslice((width - radius*2, 0, width, radius*2), 0, 90, None, brush)
    #bottom-left corner
    draw.pieslice((0, height - radius * 2, radius*2, height),180, 270, None, brush)
    #bottom-right corner
    draw.pieslice((width - radius * 2, height - radius * 2, width, height), 270, 360, None, brush)
    #center rectangle
    draw.rectangle((radius, radius, width - radius, height - radius), brush)
    #four edge rectangle
    draw.rectangle((radius, 0, width - radius, radius), brush)
    draw.rectangle((0, radius, radius, height-radius), brush)
    draw.rectangle((radius, height-radius, width-radius, height), brush)
    draw.rectangle((width-radius, radius, width, height-radius), brush)
    draw.flush()
    image = image.convert('RGBA')
    image.putalpha(mask)
    return image
def change_circle_corner(img,per):# 图片和圆角百分比
    w, h = img.size
    return circle_corner(img,radius=int(w* per))
    
androidIcon = [
    ((72,72),"res\mipmap-hdpi\ic_launcher.png"),
    ((48,48),"res\mipmap-mdpi\ic_launcher.png"),
    ((96,96),"res\mipmap-xhdpi\ic_launcher.png"),
    ((144,144),"res\mipmap-xxhdpi\ic_launcher.png"),
    ((192,192),"res\mipmap-xxxhdpi\ic_launcher.png"),
]
def create_icon(iconPath,outPath):
    i = 0
    for i in range(len(androidIcon)):
        imt = Image.open(iconPath)
        size = androidIcon[i][0] 
        #print size
        name = os.path.join(outPath,androidIcon[i][1])
        create_dir(os.path.dirname(name))
        imt.thumbnail(size)
        change_circle_corner(imt,per=0.1754).save(name)
        i = i+1
        
def create_dir(dir):
    #dir = os.path.dirname(outPath)
    # create directory if it does not exist
    #print("create_dir",dir)
    if not os.path.exists(dir):
        print("create_dir",dir)
        os.makedirs(dir)

if __name__ == '__main__':
    workPath = sys.argv[0]
    path = sys.argv[1] #'D:/git/india_rummy_as/india_rummy_as_awgp/app/src/test'
    iconPath=path
    outPath='./out'
    print('iconPath',iconPath)
    print('outPath',outPath)
    create_dir(outPath)
    create_icon(iconPath,outPath)
    print('已生成',outPath)