
'use strict';

var Fs = require("fs");
var Path = require("path");

exports.load = function (options, result) {
    console.log(`hotUpdate —> load`);
}

var inject_script = `
(function () {
    if (typeof window.jsb === 'object') {
        var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
        if (hotUpdateSearchPaths) {
            var paths = JSON.parse(hotUpdateSearchPaths);
            jsb.fileUtils.setSearchPaths(paths);

            var fileList = [];
            var storagePath = paths[0] || '';
            var tempPath = storagePath + '_temp/';
            var baseOffset = tempPath.length;

            if (jsb.fileUtils.isDirectoryExist(tempPath) && !jsb.fileUtils.isFileExist(tempPath + 'project.manifest.temp')) {
                jsb.fileUtils.listFilesRecursively(tempPath, fileList);
                fileList.forEach(srcPath => {
                    var relativePath = srcPath.substr(baseOffset);
                    var dstPath = storagePath + relativePath;
                    if (srcPath[srcPath.length] == '/') {
                        jsb.fileUtils.createDirectory(dstPath)
                    }
                    else {
                        if (jsb.fileUtils.isFileExist(dstPath)) {
                            jsb.fileUtils.removeFile(dstPath)
                        }
                        jsb.fileUtils.renameFile(srcPath, dstPath);
                    }
                });
                jsb.fileUtils.removeDirectory(tempPath);
            }
        }
    }
})();`;

let getPrerequisite = (bundleName) => {
    return `
(function(r) {
    r('virtual:///prerequisite-imports/${bundleName}', 'chunks:///_virtual/${bundleName}'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
                if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
        
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});`;
}

exports.onAfterBuild = function (options, result) {
    console.log(`hotUpdate —> onAfterBuild`);
	//添加热更路径，确保启动时可以优先使用热更资源
    var root = Path.join(Editor.Project.path, `build/`, options.outputName, `data`);
    {
        var mainPath = Path.join(root, `main.js`);
        let data = Fs.readFileSync(mainPath, `utf8`)
        var newStr = inject_script + data;
        Fs.writeFileSync(mainPath, newStr);
    }
	//添加卸载脚本代码，确保热更后脚本刷新问题
	/**var engineAdapterPath = Path.join(root, `jsb-adapter`, `engine-adapter.js`);
	Fs.readFile(engineAdapterPath, `utf8`, function (err, data) {
        if (err) {
            throw err;
        }
		data = data.replace(/if\s*\(loadedScripts\[(\w+)\]\)\s*return\s*onComplete\s*&&\s*onComplete\(\);/, `console.log(\`downloadScript: \${$1}\`);if(loadedScripts[$1]){return onComplete&&onComplete();}`);
        data = data.replace(/downloader\.downloadScript\s*=\s*downloadScript;/, `downloader.downloadScript=downloadScript;downloader.undownloadBundleScriptCache=function(bundleName){loadedScripts[\`assets/\${bundleName}/index.js\`]=null;}`);
        Fs.writeFile(engineAdapterPath, data, function (error) {
            if (err) {
                throw err;
            }
        });
    });*/
	//添加卸载脚本代码，确保热更后脚本刷新问题
    {
        var systemBundlePath = Path.join(root, `src`, `system.bundle.js`);
        let data = Fs.readFileSync(systemBundlePath, `utf8`)
        data = data.replace(/(\w+)\s*=\s*(\w+)\s*\?\s*Symbol\(\)\s*:\s*[\'\"]@[\'\"];\s*function\s*(\w+)\s*\(\)\s*\{\s*this\[\w+\]\s*=\s*\{\};?\s*\}/, `$1=$2?Symbol():"@";var REGISTEY_TABLE = {};function $3(){this[$1]=REGISTEY_TABLE;}globalThis.unloadBundleScriptCache=function(list){console.log(\`do unloadBundleScriptCache\`);list.forEach(element=>{console.log(element);REGISTEY_TABLE[element]=null;});};`);
        Fs.writeFileSync(systemBundlePath, data);
    }
	
	//移除bundle对import-map的依赖
	const assertsPath = Path.join(root, "assets");
	const importMapPath = Path.join(root, "src", "import-map.json");
    let importMapData = JSON.parse(Fs.readFileSync(importMapPath, `utf8`));
    console.log(`移除bundle对import-map的依赖`);
    result.settings.assets.projectBundles.forEach(bundleName => {
        let bundlePath = Path.join(assertsPath, bundleName,`index.js`);
        let data = Fs.readFileSync(bundlePath, `utf8`)
        let virtualKey = `virtual:///prerequisite-imports/${bundleName}`
        if(data.indexOf(virtualKey) == -1) {
            console.log(`移除`,bundlePath,virtualKey);
            // console.log(`content`,data);
            if(importMapData.imports[virtualKey]) {
                delete importMapData.imports[virtualKey]
            }
            var newStr = data + getPrerequisite(bundleName)
            Fs.writeFileSync(bundlePath, newStr);
        }
    });
    Fs.writeFileSync(importMapPath, JSON.stringify(importMapData));
}
