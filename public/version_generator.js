var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}

var dest = './remote-assets/';
var manifest = {
    packageUrl: 'http://localhost/hot-update/remote-assets/',
    remoteManifestUrl: 'http://localhost/hot-update/remote-assets/project.manifest',
    remoteVersionUrl: 'http://localhost/hot-update/remote-assets/version.manifest',
    version: '1.0.0'
};
var i = 2;
var isMain = true;
var src = './jsb/';
while (i < process.argv.length) {
    var arg = process.argv[i];
    switch (arg) {
        case '--url':
        case '-u':
            var url = process.argv[i + 1];
            manifest.packageUrl = url;
            manifest.remoteManifestUrl = url + 'project.manifest';
            manifest.remoteVersionUrl = url + 'version.manifest';
            i += 2;
            break;
        case '--version':
        case '-v':
            manifest.version = process.argv[i + 1];
            i += 2;
            break;
        case '--src':
        case '-s':
            src = process.argv[i + 1];
            i += 2;
            break;
        case '--dest':
        case '-d':
            dest = process.argv[i + 1];
            i += 2;
            break;
        case '-isGame':
            isMain = false;
            i += 2;
            break;
        case '-isMain':
            isMain = true;
            i += 2;
            break;
        default:
            i++;
            break;
    }
}
mkdirSync(dest);

var destVersion = path.join(dest, 'version.manifest');
fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    console.log('Version successfully generated');
});

function readDir(dir, obj) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath, obj);
        }
        else if (stat.isFile()) {
            // Size in Bytes
            size = stat['size'];
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
            compressed = path.extname(subpath).toLowerCase() === '.zip';

            relative = path.relative(src, subpath);
            relative = relative.replace(/\\/g, '/');
            relative = encodeURI(relative);
            obj[relative] = {
                'size': size,
                'md5': md5
            };
            if (compressed) {
                obj[relative].compressed = true;
            }
        }
    }
}
manifest.assets = {}
manifest.searchPaths = []
if (isMain) {
    readDir(src, manifest.assets);
    readDir(path.join(src, 'src'), manifest.assets);
    readDir(path.join(src, 'assets'), manifest.assets);
    readDir(path.join(src, 'jsb-adapter'), manifest.assets);
} else {
    readDir(src, manifest.assets);
}
var destManifest = path.join(dest, 'project.manifest');
fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    console.log('Manifest successfully generated');
});
