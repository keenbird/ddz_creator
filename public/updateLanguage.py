import os, sys
import json
import re

bundlePathKey = "path"
bundleTsPathsKey = "paths"
bundle = {};

workPaht = os.path.join(sys.path[0], "..","assets")
print(workPaht)
def get_ts_files(path):
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(".ts"):
                print(file);
                break;

def traverse_folders(path,bundleName):
    if bundleName not in bundle:
        bundle[bundleName] = {};
        bundle[bundleName][bundlePathKey] = path;
        bundle[bundleName][bundleTsPathsKey] = [];
    for filename in os.listdir(path):
        # 拼接路径
        full_path = os.path.join(path, filename);
        # 判断是否为目录
        if os.path.isdir(full_path):
            #print("子目录：", full_path);
            full_meta_path = os.path.join(path, filename+".meta");
            #print("meta 文件：", full_meta_path);
            isBundle = False;
            newBundleName = filename;
            if(os.path.exists(full_meta_path)):
                with open(full_meta_path, 'r') as f:
                    data = json.load(f);
                    userData = data["userData"]
                    isBundle = userData.get("isBundle",False);
                    newBundleName = userData.get("bundleName",filename);
            if isBundle:
                # 递归遍历子目录
                traverse_folders(full_path,newBundleName);
            else:
                # 递归遍历子目录
                traverse_folders(full_path,bundleName);
        # 如果是文件，则打印文件名
        elif filename.endswith('.ts') and not filename.endswith('.d.ts'):
            #print("文件：", full_path)
            bundle[bundleName][bundleTsPathsKey].append(full_path);


def parse_ts(path):
    print("解析文件：", path)
    result = []
    with open(path, "r",encoding='utf-8') as f:
        content = f.read()
        
    pattern = r'fw\.language\.(get|getString)\(([`\'"])(.+?)\2'
    matches = re.findall(pattern, content)
    # 将所有匹配项添加到 functions 和 strings 列表中
    for match in matches:
        result.append(match[2])
        
    #pattern = r'fw\.language\.getString\(([\'"])(.+?)\1\s*,'
    #matches = re.findall(pattern, content)
    # 将所有匹配项添加到 functions 和 strings 列表中
    #for match in matches:
    #    result.append(match[1])
        
    pattern = r'\b(bindLabel|bindParamsLabel)\(([`\'"])(.+?)\2'
    matches = re.findall(pattern, content)
    # 将所有匹配项添加到 functions 和 strings 列表中
    for match in matches:
        result.append(match[2])
    
    #pattern = r'\bbindParamsLabel\(["\'](.+?)["\'](\s*),'
    #matches = re.findall(pattern, content)
    # 将所有匹配项添加到 functions 和 strings 列表中
    #for match in matches:
    #    result.append(match[0])
        
    pattern = r'/\*\*lang\*/\s*([`\'"])(.+?)\1'
    matches = re.findall(pattern, content)
    # 将所有匹配项添加到 functions 和 strings 列表中
    for match in matches:
        result.append(match[1])
    
    return result;
    
# 转义字符串
def escape_string(string):
    escaped = string.encode('utf-8').decode('utf-8').replace('"', '\\"')
    return f'"{escaped}"'
    
    
#开始扫描代码路径
traverse_folders(workPaht,"main")

#用于检查扫描的数据释否正确
#with open("bundle.json", "w") as f:
#    json.dump(bundle, f)

# 遍历键值对
for bundleName, bundleConfig in bundle.items():
    bundlePath = bundleConfig.get(bundlePathKey)
    bundleTsPaths = bundleConfig.get(bundleTsPathsKey)
    result = []
    for tsPath in bundleTsPaths:
        result = list(set(result + parse_ts(tsPath)))
    
    with open(os.path.join(bundlePath, "language.auto.d.ts"), "w",encoding='utf-8') as f:
        f.write(f'declare interface {bundleName}_keys {{\n')
        for key in sorted(result):
            escaped = escape_string(key)
            f.write(f'  {escaped}: LanguageConfigType;\n')
        f.write('}\n\n')
        f.write('/**多语言key全集，用于提示 */\n')
        f.write(f'declare type language_{bundleName}_keys = {{\n')
        f.write(f'  [key in keyof {bundleName}_keys]: LanguageConfigType\n')
        f.write('}')