(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

(function () {
  if (!(cc && cc.internal && cc.internal.EditBox)) {
    return;
  }

  var EditBoxComp = cc.internal.EditBox;
  var js = cc.js;
  var KeyboardReturnType = EditBoxComp.KeyboardReturnType;
  var MAX_VALUE = 65535;
  var KEYBOARD_HIDE_TIME = 600;
  var _hideKeyboardTimeout = null;
  var _currentEditBoxImpl = null;

  function getKeyboardReturnType(type) {
    switch (type) {
      case KeyboardReturnType.DEFAULT:
      case KeyboardReturnType.DONE:
        return 'done';

      case KeyboardReturnType.SEND:
        return 'send';

      case KeyboardReturnType.SEARCH:
        return 'search';

      case KeyboardReturnType.GO:
        return 'go';

      case KeyboardReturnType.NEXT:
        return 'next';
    }

    return 'done';
  }

  function MiniGameEditBoxImpl() {
    this._delegate = null;
    this._editing = false;
    this._eventListeners = {
      onKeyboardInput: null,
      onKeyboardConfirm: null,
      onKeyboardComplete: null
    };
  }

  js.extend(MiniGameEditBoxImpl, EditBoxComp._EditBoxImpl);
  EditBoxComp._EditBoxImpl = MiniGameEditBoxImpl;
  Object.assign(MiniGameEditBoxImpl.prototype, {
    init: function init(delegate) {
      if (!delegate) {
        cc.error('EditBox init failed');
        return;
      }

      this._delegate = delegate;
    },
    beginEditing: function beginEditing() {
      var _this = this;

      // In case multiply register events
      if (this._editing) {
        return;
      }

      this._ensureKeyboardHide(function () {
        var delegate = _this._delegate;

        _this._showKeyboard();

        _this._registerKeyboardEvent();

        _this._editing = true;
        _currentEditBoxImpl = _this;

        delegate._editBoxEditingDidBegan();
      });
    },
    endEditing: function endEditing() {
      this._hideKeyboard();

      var cbs = this._eventListeners;
      cbs.onKeyboardComplete && cbs.onKeyboardComplete();
    },
    _registerKeyboardEvent: function _registerKeyboardEvent() {
      var self = this;
      var delegate = this._delegate;
      var cbs = this._eventListeners;

      cbs.onKeyboardInput = function (res) {
        if (delegate._string !== res.value) {
          delegate._editBoxTextChanged(res.value);
        }
      };

      cbs.onKeyboardConfirm = function (res) {
        delegate._editBoxEditingReturn();

        var cbs = self._eventListeners;
        cbs.onKeyboardComplete && cbs.onKeyboardComplete();
      };

      cbs.onKeyboardComplete = function () {
        self._editing = false;
        _currentEditBoxImpl = null;

        self._unregisterKeyboardEvent();

        delegate._editBoxEditingDidEnded();
      };

      ral.onKeyboardInput(cbs.onKeyboardInput);
      ral.onKeyboardConfirm(cbs.onKeyboardConfirm);
      ral.onKeyboardComplete(cbs.onKeyboardComplete);
    },
    _unregisterKeyboardEvent: function _unregisterKeyboardEvent() {
      var cbs = this._eventListeners;

      if (cbs.onKeyboardInput) {
        ral.offKeyboardInput(cbs.onKeyboardInput);
        cbs.onKeyboardInput = null;
      }

      if (cbs.onKeyboardConfirm) {
        ral.offKeyboardConfirm(cbs.onKeyboardConfirm);
        cbs.onKeyboardConfirm = null;
      }

      if (cbs.onKeyboardComplete) {
        ral.offKeyboardComplete(cbs.onKeyboardComplete);
        cbs.onKeyboardComplete = null;
      }
    },
    _otherEditing: function _otherEditing() {
      return !!_currentEditBoxImpl && _currentEditBoxImpl !== this && _currentEditBoxImpl._editing;
    },
    _ensureKeyboardHide: function _ensureKeyboardHide(cb) {
      var otherEditing = this._otherEditing();

      if (!otherEditing && !_hideKeyboardTimeout) {
        return cb();
      }

      if (_hideKeyboardTimeout) {
        clearTimeout(_hideKeyboardTimeout);
      }

      if (otherEditing) {
        _currentEditBoxImpl.endEditing();
      }

      _hideKeyboardTimeout = setTimeout(function () {
        _hideKeyboardTimeout = null;
        cb();
      }, KEYBOARD_HIDE_TIME);
    },
    _showKeyboard: function _showKeyboard() {
      var delegate = this._delegate;
      var multiline = delegate.inputMode === EditBoxComp.InputMode.ANY;
      ral.showKeyboard({
        defaultValue: delegate.string,
        maxLength: delegate.maxLength < 0 ? MAX_VALUE : delegate.maxLength,
        multiple: multiline,
        confirmHold: false,
        confirmType: getKeyboardReturnType(delegate.returnType),
        success: function success(res) {},
        fail: function fail(res) {
          cc.warn(res.errMsg);
        }
      });
    },
    _hideKeyboard: function _hideKeyboard() {
      ral.hideKeyboard({
        success: function success(res) {},
        fail: function fail(res) {
          cc.warn(res.errMsg);
        }
      });
    }
  });
})();

},{}],2:[function(require,module,exports){
"use strict";

var cacheManager = require('./cache-manager');

var _require = require('./fs-utils'),
    downloadFile = _require.downloadFile,
    readText = _require.readText,
    readArrayBuffer = _require.readArrayBuffer,
    readJson = _require.readJson,
    loadSubpackage = _require.loadSubpackage,
    getUserDataPath = _require.getUserDataPath,
    _subpackagesPath = _require._subpackagesPath;

cc.assetManager.fsUtils = ral.fsUtils;
var REGEX = /^https?:\/\/.*/;
var downloader = cc.assetManager.downloader;
var parser = cc.assetManager.parser;
var presets = cc.assetManager.presets;
downloader.maxConcurrency = 8;
downloader.maxRequestsPerFrame = 64;
presets['scene'].maxConcurrency = 10;
presets['scene'].maxRequestsPerFrame = 64;
var subpackages = {};
var loadedScripts = {};

function downloadScript(url, options, onComplete) {
  if (REGEX.test(url)) {
    onComplete && onComplete(new Error('Can not load remote scripts'));
    return;
  }

  if (loadedScripts[url]) return onComplete && onComplete();

  require(url);

  loadedScripts[url] = true;
  onComplete && onComplete(null);
}

function handleZip(url, options, onComplete) {
  var cachedUnzip = cacheManager.cachedFiles.get(url);

  if (cachedUnzip) {
    cacheManager.updateLastTime(url);
    onComplete && onComplete(null, cachedUnzip.url);
  } else if (REGEX.test(url)) {
    downloadFile(url, null, options.header, options.onFileProgress, function (err, downloadedZipPath) {
      if (err) {
        onComplete && onComplete(err);
        return;
      }

      cacheManager.unzipAndCacheBundle(url, downloadedZipPath, options.__cacheBundleRoot__, onComplete);
    });
  } else {
    cacheManager.unzipAndCacheBundle(url, url, options.__cacheBundleRoot__, onComplete);
  }
}

function loadAudioPlayer(url, options, onComplete) {
  cc.AudioPlayer.load(url).then(function (player) {
    var audioMeta = {
      player: player,
      url: url,
      duration: player.duration,
      type: player.type
    };
    onComplete(null, audioMeta);
  })["catch"](function (err) {
    onComplete(err);
  });
}

function download(url, func, options, onFileProgress, onComplete) {
  var result = transformUrl(url, options);

  if (result.inLocal) {
    func(result.url, options, onComplete);
  } else if (result.inCache) {
    cacheManager.updateLastTime(url);
    func(result.url, options, function (err, data) {
      if (err) {
        cacheManager.removeCache(url);
      }

      onComplete(err, data);
    });
  } else {
    downloadFile(url, null, options.header, onFileProgress, function (err, path) {
      if (err) {
        onComplete(err, null);
        return;
      }

      func(path, options, function (err, data) {
        if (!err) {
          cacheManager.tempFiles.add(url, path);
          cacheManager.cacheFile(url, path, options.cacheEnabled, options.__cacheBundleRoot__, true);
        }

        onComplete(err, data);
      });
    });
  }
}

function parseArrayBuffer(url, options, onComplete) {
  readArrayBuffer(url, onComplete);
}

function parseText(url, options, onComplete) {
  readText(url, onComplete);
}

function parseJson(url, options, onComplete) {
  readJson(url, onComplete);
}

function downloadText(url, options, onComplete) {
  download(url, parseText, options, options.onFileProgress, onComplete);
}

function downloadJson(url, options, onComplete) {
  download(url, parseJson, options, options.onFileProgress, onComplete);
}

function loadFont(url, options, onComplete) {
  var fontFamilyName = _getFontFamily(url);

  var fontFace = new FontFace(fontFamilyName, "url('" + url + "')");
  document.fonts.add(fontFace);
  fontFace.load();
  fontFace.loaded.then(function () {
    onComplete(null, fontFamilyName);
  }, function () {
    cc.warnID(4933, fontFamilyName);
    onComplete(null, fontFamilyName);
  });
}

function _getFontFamily(fontHandle) {
  var ttfIndex = fontHandle.lastIndexOf(".ttf");

  if (ttfIndex === -1) {
    ttfIndex = fontHandle.lastIndexOf(".tmp");
  }

  if (ttfIndex === -1) return fontHandle;
  var slashPos = fontHandle.lastIndexOf("/");
  var fontFamilyName;

  if (slashPos === -1) {
    fontFamilyName = fontHandle.substring(0, ttfIndex) + "_LABEL";
  } else {
    fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex) + "_LABEL";
  }

  return fontFamilyName;
}

function doNothing(content, options, onComplete) {
  onComplete(null, content);
}

function downloadAsset(url, options, onComplete) {
  download(url, doNothing, options, options.onFileProgress, onComplete);
}

function downloadBundle(nameOrUrl, options, onComplete) {
  var bundleName = cc.path.basename(nameOrUrl);
  var version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
  var suffix = version ? version + '.' : '';

  if (subpackages[bundleName]) {
    var config = "".concat(_subpackagesPath).concat(bundleName, "/config.").concat(suffix, "json");
    loadSubpackage(bundleName, options.onFileProgress, function (err) {
      if (err) {
        onComplete(err, null);
        return;
      }

      downloadJson(config, options, function (err, data) {
        data && (data.base = "".concat(_subpackagesPath).concat(bundleName, "/"));
        onComplete(err, data);
      });
    });
  } else {
    var js, url;

    if (REGEX.test(nameOrUrl) || nameOrUrl.startsWith(getUserDataPath())) {
      url = nameOrUrl;
      js = "src/bundle-scripts/".concat(bundleName, "/index.").concat(suffix, "js");
      cacheManager.makeBundleFolder(bundleName);
    } else {
      if (downloader.remoteBundles.indexOf(bundleName) !== -1) {
        url = "".concat(downloader.remoteServerAddress, "remote/").concat(bundleName);
        js = "src/bundle-scripts/".concat(bundleName, "/index.").concat(suffix, "js");
        cacheManager.makeBundleFolder(bundleName);
      } else {
        url = "assets/".concat(bundleName);
        js = "assets/".concat(bundleName, "/index.").concat(suffix, "js");
      }
    }

    if (!loadedScripts[js]) {
      require(js);

      loadedScripts[js] = true;
    }

    options.__cacheBundleRoot__ = bundleName;
    var config = "".concat(url, "/config.").concat(suffix, "json");
    downloadJson(config, options, function (err, data) {
      if (err) {
        onComplete && onComplete(err);
        return;
      }

      if (data.isZip) {
        var zipVersion = data.zipVersion;
        var zipUrl = "".concat(url, "/res.").concat(zipVersion ? zipVersion + '.' : '', "zip");
        handleZip(zipUrl, options, function (err, unzipPath) {
          if (err) {
            onComplete && onComplete(err);
            return;
          }

          data.base = unzipPath + '/res/';
          onComplete && onComplete(null, data);
        });
      } else {
        data.base = url + '/';
        onComplete && onComplete(null, data);
      }
    });
  }
}

;

var downloadCCON = function downloadCCON(url, options, onComplete) {
  downloadJson(url, options, function (err, json) {
    if (err) {
      onComplete(err);
      return;
    }

    var cconPreface = cc.internal.parseCCONJson(json);
    var chunkPromises = Promise.all(cconPreface.chunks.map(function (chunk) {
      return new Promise(function (resolve, reject) {
        downloadArrayBuffer("".concat(cc.path.mainFileName(url)).concat(chunk), {}, function (errChunk, chunkBuffer) {
          if (errChunk) {
            reject(errChunk);
          } else {
            resolve(new Uint8Array(chunkBuffer));
          }
        });
      });
    }));
    chunkPromises.then(function (chunks) {
      var ccon = new cc.internal.CCON(cconPreface.document, chunks);
      onComplete(null, ccon);
    })["catch"](function (err) {
      onComplete(err);
    });
  });
};

var downloadCCONB = function downloadCCONB(url, options, onComplete) {
  downloadArrayBuffer(url, options, function (err, arrayBuffer) {
    if (err) {
      onComplete(err);
      return;
    }

    try {
      var ccon = cc.internal.decodeCCONBinary(new Uint8Array(arrayBuffer));
      onComplete(null, ccon);
    } catch (err) {
      onComplete(err);
    }
  });
};

function downloadArrayBuffer(url, options, onComplete) {
  download(url, parseArrayBuffer, options, options.onFileProgress, onComplete);
}

var originParsePVRTex = parser.parsePVRTex;

var parsePVRTex = function parsePVRTex(file, options, onComplete) {
  readArrayBuffer(file, function (err, data) {
    if (err) return onComplete(err);
    originParsePVRTex(data, options, onComplete);
  });
};

var originParsePKMTex = parser.parsePKMTex;

var parsePKMTex = function parsePKMTex(file, options, onComplete) {
  readArrayBuffer(file, function (err, data) {
    if (err) return onComplete(err);
    originParsePKMTex(data, options, onComplete);
  });
};

var originParseASTCTex = parser.parseASTCTex;

var parseASTCTex = function parseASTCTex(file, options, onComplete) {
  readArrayBuffer(file, function (err, data) {
    if (err) return onComplete(err);
    originParseASTCTex(data, options, onComplete);
  });
};

var originParsePlist = parser.parsePlist;

var parsePlist = function parsePlist(url, options, onComplete) {
  readText(url, function (err, file) {
    if (err) return onComplete(err);
    originParsePlist(file, options, onComplete);
  });
};

downloader.downloadScript = downloadScript;
parser.parsePVRTex = parsePVRTex;
parser.parsePKMTex = parsePKMTex;
parser.parseASTCTex = parseASTCTex;
parser.parsePlist = parsePlist;
downloader.register({
  '.js': downloadScript,
  // Audio
  '.mp3': downloadAsset,
  '.ogg': downloadAsset,
  '.wav': downloadAsset,
  '.m4a': downloadAsset,
  // Image
  '.png': downloadAsset,
  '.jpg': downloadAsset,
  '.bmp': downloadAsset,
  '.jpeg': downloadAsset,
  '.gif': downloadAsset,
  '.ico': downloadAsset,
  '.tiff': downloadAsset,
  '.image': downloadAsset,
  '.webp': downloadAsset,
  '.pvr': downloadAsset,
  '.pkm': downloadAsset,
  '.astc': downloadAsset,
  '.font': downloadAsset,
  '.eot': downloadAsset,
  '.ttf': downloadAsset,
  '.woff': downloadAsset,
  '.svg': downloadAsset,
  '.ttc': downloadAsset,
  // Txt
  '.txt': downloadAsset,
  '.xml': downloadAsset,
  '.vsh': downloadAsset,
  '.fsh': downloadAsset,
  '.atlas': downloadAsset,
  '.tmx': downloadAsset,
  '.tsx': downloadAsset,
  '.plist': downloadAsset,
  '.fnt': downloadAsset,
  '.json': downloadJson,
  '.ExportJson': downloadAsset,
  '.ccon': downloadCCON,
  '.cconb': downloadCCONB,
  '.binary': downloadAsset,
  '.bin': downloadAsset,
  '.dbbin': downloadAsset,
  '.skel': downloadAsset,
  '.mp4': downloadAsset,
  '.avi': downloadAsset,
  '.mov': downloadAsset,
  '.mpg': downloadAsset,
  '.mpeg': downloadAsset,
  '.rm': downloadAsset,
  '.rmvb': downloadAsset,
  'bundle': downloadBundle,
  'default': downloadText
});
parser.register({
  '.png': downloader.downloadDomImage,
  '.jpg': downloader.downloadDomImage,
  '.bmp': downloader.downloadDomImage,
  '.jpeg': downloader.downloadDomImage,
  '.gif': downloader.downloadDomImage,
  '.ico': downloader.downloadDomImage,
  '.tiff': downloader.downloadDomImage,
  '.image': downloader.downloadDomImage,
  '.webp': downloader.downloadDomImage,
  '.pvr': parsePVRTex,
  '.pkm': parsePKMTex,
  '.astc': parseASTCTex,
  '.font': loadFont,
  '.eot': loadFont,
  '.ttf': loadFont,
  '.woff': loadFont,
  '.svg': loadFont,
  '.ttc': loadFont,
  // Audio
  '.mp3': loadAudioPlayer,
  '.ogg': loadAudioPlayer,
  '.wav': loadAudioPlayer,
  '.m4a': loadAudioPlayer,
  // Txt
  '.txt': parseText,
  '.xml': parseText,
  '.vsh': parseText,
  '.fsh': parseText,
  '.atlas': parseText,
  '.tmx': parseText,
  '.tsx': parseText,
  '.fnt': parseText,
  '.plist': parsePlist,
  '.binary': parseArrayBuffer,
  '.bin': parseArrayBuffer,
  '.dbbin': parseArrayBuffer,
  '.skel': parseArrayBuffer,
  '.ExportJson': parseJson
});

var transformUrl = function transformUrl(url, options) {
  var inLocal = false;
  var inCache = false;
  var isInUserDataPath = url.startsWith(getUserDataPath());

  if (isInUserDataPath) {
    inLocal = true;
  } else if (REGEX.test(url)) {
    if (!options.reload) {
      var cache = cacheManager.cachedFiles.get(url);

      if (cache) {
        inCache = true;
        url = cache.url;
      } else {
        var tempUrl = cacheManager.tempFiles.get(url);

        if (tempUrl) {
          inLocal = true;
          url = tempUrl;
        }
      }
    }
  } else {
    inLocal = true;
  }

  return {
    url: url,
    inLocal: inLocal,
    inCache: inCache
  };
};

cc.assetManager.transformPipeline.append(function (task) {
  var input = task.output = task.input;

  for (var i = 0, l = input.length; i < l; i++) {
    var item = input[i];
    var options = item.options;

    if (!item.config) {
      if (item.ext === 'bundle') continue;
      options.cacheEnabled = options.cacheEnabled !== undefined ? options.cacheEnabled : false;
    } else {
      options.__cacheBundleRoot__ = item.config.name;
    }

    if (item.ext === '.cconb') {
      item.url = item.url.replace(item.ext, '.bin');
    } else if (item.ext === '.ccon') {
      item.url = item.url.replace(item.ext, '.json');
    }
  }
});
var originInit = cc.assetManager.init;

cc.assetManager.init = function (options) {
  originInit.call(cc.assetManager, options);
  var subpacks = cc.settings.querySettings('assets', 'subpackages');
  subpacks && subpacks.forEach(function (x) {
    return subpackages[x] = "".concat(_subpackagesPath) + x;
  });
  cacheManager.init();
};

},{"./cache-manager":3,"./fs-utils":5}],3:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.
 https://www.cocos.com/
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of cache-manager software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.
 The software or tools in cache-manager License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var _require = require('./fs-utils'),
    getUserDataPath = _require.getUserDataPath,
    readJsonSync = _require.readJsonSync,
    makeDirSync = _require.makeDirSync,
    writeFileSync = _require.writeFileSync,
    copyFile = _require.copyFile,
    downloadFile = _require.downloadFile,
    deleteFile = _require.deleteFile,
    rmdirSync = _require.rmdirSync,
    unzip = _require.unzip,
    isOutOfStorage = _require.isOutOfStorage;

var checkNextPeriod = false;
var writeCacheFileList = null;
var cleaning = false;
var suffix = 0;
var REGEX = /^https?:\/\/.*/;
var cacheManager = {
  cacheDir: 'gamecaches',
  cachedFileName: 'cacheList.json',
  // whether or not cache asset into user's storage space
  cacheEnabled: true,
  // whether or not auto clear cache when storage ran out
  autoClear: true,
  // cache one per cycle
  cacheInterval: 500,
  deleteInterval: 500,
  writeFileInterval: 2000,
  // whether or not storage space has run out
  outOfStorage: false,
  tempFiles: null,
  cachedFiles: null,
  cacheQueue: {},
  version: '1.0',
  getCache: function getCache(url) {
    return this.cachedFiles.has(url) ? this.cachedFiles.get(url).url : '';
  },
  getTemp: function getTemp(url) {
    return this.tempFiles.has(url) ? this.tempFiles.get(url) : '';
  },
  init: function init() {
    this.cacheDir = getUserDataPath() + '/' + this.cacheDir;
    var cacheFilePath = this.cacheDir + '/' + this.cachedFileName;
    var result = readJsonSync(cacheFilePath);

    if (result instanceof Error || !result.version) {
      if (!(result instanceof Error)) rmdirSync(this.cacheDir, true);
      this.cachedFiles = new cc.AssetManager.Cache();
      makeDirSync(this.cacheDir, true);
      writeFileSync(cacheFilePath, JSON.stringify({
        files: this.cachedFiles._map,
        version: this.version
      }), 'utf8');
    } else {
      this.cachedFiles = new cc.AssetManager.Cache(result.files);
    }

    this.tempFiles = new cc.AssetManager.Cache();
  },
  updateLastTime: function updateLastTime(url) {
    if (this.cachedFiles.has(url)) {
      var cache = this.cachedFiles.get(url);
      cache.lastTime = Date.now();
    }
  },
  _write: function _write() {
    writeCacheFileList = null;
    writeFileSync(this.cacheDir + '/' + this.cachedFileName, JSON.stringify({
      files: this.cachedFiles._map,
      version: this.version
    }), 'utf8');
  },
  writeCacheFile: function writeCacheFile() {
    if (!writeCacheFileList) {
      writeCacheFileList = setTimeout(this._write.bind(this), this.writeFileInterval);
    }
  },
  _cache: function _cache() {
    checkNextPeriod = false;
    var self = this;
    var id = '';

    for (var key in this.cacheQueue) {
      id = key;
      break;
    }

    if (!id) return;
    var _this$cacheQueue$id = this.cacheQueue[id],
        srcUrl = _this$cacheQueue$id.srcUrl,
        isCopy = _this$cacheQueue$id.isCopy,
        cacheBundleRoot = _this$cacheQueue$id.cacheBundleRoot;
    var time = Date.now().toString();
    var localPath = '';

    if (cacheBundleRoot) {
      localPath = "".concat(this.cacheDir, "/").concat(cacheBundleRoot, "/").concat(time).concat(suffix++).concat(cc.path.extname(id));
    } else {
      localPath = "".concat(this.cacheDir, "/").concat(time).concat(suffix++).concat(cc.path.extname(id));
    }

    function callback(err) {
      if (err) {
        if (isOutOfStorage(err.message)) {
          self.outOfStorage = true;
          self.autoClear && self.clearLRU();
          return;
        }
      } else {
        self.cachedFiles.add(id, {
          bundle: cacheBundleRoot,
          url: localPath,
          lastTime: time
        });
        self.writeCacheFile();
      }

      delete self.cacheQueue[id];

      if (!cc.js.isEmptyObject(self.cacheQueue) && !checkNextPeriod) {
        checkNextPeriod = true;
        setTimeout(self._cache.bind(self), self.cacheInterval);
      }
    }

    if (!isCopy) {
      downloadFile(srcUrl, localPath, null, callback);
    } else {
      copyFile(srcUrl, localPath, callback);
    }
  },
  cacheFile: function cacheFile(id, srcUrl, cacheEnabled, cacheBundleRoot, isCopy) {
    cacheEnabled = cacheEnabled !== undefined ? cacheEnabled : this.cacheEnabled;
    if (!cacheEnabled || this.cacheQueue[id] || this.cachedFiles.has(id)) return;
    this.cacheQueue[id] = {
      srcUrl: srcUrl,
      cacheBundleRoot: cacheBundleRoot,
      isCopy: isCopy
    };

    if (!checkNextPeriod && !this.outOfStorage) {
      checkNextPeriod = true;
      setTimeout(this._cache.bind(this), this.cacheInterval);
    }
  },
  clearCache: function clearCache() {
    var _this = this;

    rmdirSync(this.cacheDir, true);
    this.cachedFiles = new cc.AssetManager.Cache();
    makeDirSync(this.cacheDir, true);
    this.outOfStorage = false;
    clearTimeout(writeCacheFileList);

    this._write();

    cc.assetManager.bundles.forEach(function (bundle) {
      if (REGEX.test(bundle.base)) _this.makeBundleFolder(bundle.name);
    });
  },
  clearLRU: function clearLRU() {
    if (cleaning) return;
    cleaning = true;
    var caches = [];
    var self = this;
    this.cachedFiles.forEach(function (val, key) {
      if (self._isZipFile(key) && cc.assetManager.bundles.find(function (bundle) {
        return bundle.base.indexOf(val.url) !== -1;
      })) return;
      caches.push({
        originUrl: key,
        url: val.url,
        lastTime: val.lastTime
      });
    });
    caches.sort(function (a, b) {
      return a.lastTime - b.lastTime;
    });
    caches.length = Math.floor(caches.length / 3);
    if (caches.length === 0) return;

    for (var i = 0, l = caches.length; i < l; i++) {
      this.cachedFiles.remove(caches[i].originUrl);
    }

    clearTimeout(writeCacheFileList);

    this._write();

    function deferredDelete() {
      var item = caches.pop();

      if (self._isZipFile(item.originUrl)) {
        rmdirSync(item.url, true);

        self._deleteFileCB();
      } else {
        deleteFile(item.url, self._deleteFileCB.bind(self));
      }

      if (caches.length > 0) {
        setTimeout(deferredDelete, self.deleteInterval);
      } else {
        cleaning = false;
      }
    }

    setTimeout(deferredDelete, self.deleteInterval);
  },
  removeCache: function removeCache(url) {
    if (this.cachedFiles.has(url)) {
      var self = this;
      var path = this.cachedFiles.remove(url).url;
      clearTimeout(writeCacheFileList);

      this._write();

      if (this._isZipFile(url)) {
        rmdirSync(path, true);

        self._deleteFileCB();
      } else {
        deleteFile(path, self._deleteFileCB.bind(self));
      }
    }
  },
  _deleteFileCB: function _deleteFileCB(err) {
    if (!err) this.outOfStorage = false;
  },
  makeBundleFolder: function makeBundleFolder(bundleName) {
    makeDirSync(this.cacheDir + '/' + bundleName, true);
  },
  unzipAndCacheBundle: function unzipAndCacheBundle(id, zipFilePath, cacheBundleRoot, onComplete) {
    var time = Date.now().toString();
    var targetPath = "".concat(this.cacheDir, "/").concat(cacheBundleRoot, "/").concat(time).concat(suffix++);
    var self = this;
    makeDirSync(targetPath, true);
    unzip(zipFilePath, targetPath, function (err) {
      if (err) {
        rmdirSync(targetPath, true);

        if (isOutOfStorage(err.message)) {
          self.outOfStorage = true;
          self.autoClear && self.clearLRU();
        }

        onComplete && onComplete(err);
        return;
      }

      self.cachedFiles.add(id, {
        bundle: cacheBundleRoot,
        url: targetPath,
        lastTime: time
      });
      self.writeCacheFile();
      onComplete && onComplete(null, targetPath);
    });
  },
  _isZipFile: function _isZipFile(url) {
    return url.slice(-4) === '.zip';
  }
};
cc.assetManager.cacheManager = module.exports = cacheManager;

},{"./fs-utils":5}],4:[function(require,module,exports){
"use strict";

var originalCreateCanvas = ral.createCanvas.bind(ral);

ral.createCanvas = function () {
  var canvas = originalCreateCanvas();
  canvas.style = {}; // canvas has no style property on runtime 2.0

  return canvas;
};

},{}],5:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of fsUtils software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in fsUtils License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var fs = ral.getFileSystemManager ? ral.getFileSystemManager() : null;
var outOfStorageRegExp = /the maximum size of the file storage/;
var fsUtils = {
  fs: fs,
  _subpackagesPath: 'usr_',
  isOutOfStorage: function isOutOfStorage(errMsg) {
    return outOfStorageRegExp.test(errMsg);
  },
  getUserDataPath: function getUserDataPath() {
    return ral.env.USER_DATA_PATH;
  },
  checkFsValid: function checkFsValid() {
    if (!fs) {
      console.warn('can not get the file system!');
      return false;
    }

    return true;
  },
  deleteFile: function deleteFile(filePath, onComplete) {
    fs.unlink({
      filePath: filePath,
      success: function success() {
        onComplete && onComplete(null);
      },
      fail: function fail(res) {
        console.warn("Delete file failed: path: ".concat(filePath, " message: ").concat(res.errMsg));
        onComplete && onComplete(new Error(res.errMsg));
      }
    });
  },
  downloadFile: function downloadFile(remoteUrl, filePath, header, onProgress, onComplete) {
    var options = {
      url: remoteUrl,
      success: function success(res) {
        if (res.statusCode === 200) {
          onComplete && onComplete(null, res.tempFilePath || res.filePath);
        } else {
          if (res.filePath) {
            fsUtils.deleteFile(res.filePath);
          }

          console.warn("Download file failed: path: ".concat(remoteUrl, " message: ").concat(res.statusCode));
          onComplete && onComplete(new Error(res.statusCode), null);
        }
      },
      fail: function fail(res) {
        console.warn("Download file failed: path: ".concat(remoteUrl, " message: ").concat(res.errMsg));
        onComplete && onComplete(new Error(res.errMsg), null);
      }
    };
    if (filePath) options.filePath = filePath;
    if (header) options.header = header;
    var task = ral.downloadFile(options);
    onProgress && task.onProgressUpdate(onProgress);
  },
  saveFile: function saveFile(srcPath, destPath, onComplete) {
    ral.saveFile({
      tempFilePath: srcPath,
      filePath: destPath,
      success: function success(res) {
        onComplete && onComplete(null);
      },
      fail: function fail(res) {
        console.warn("Save file failed: path: ".concat(srcPath, " message: ").concat(res.errMsg));
        onComplete && onComplete(new Error(res.errMsg));
      }
    });
  },
  copyFile: function copyFile(srcPath, destPath, onComplete) {
    fs.copyFile({
      srcPath: srcPath,
      destPath: destPath,
      success: function success() {
        onComplete && onComplete(null);
      },
      fail: function fail(res) {
        console.warn("Copy file failed: path: ".concat(srcPath, " message: ").concat(res.errMsg));
        onComplete && onComplete(new Error(res.errMsg));
      }
    });
  },
  writeFile: function writeFile(path, data, encoding, onComplete) {
    fs.writeFile({
      filePath: path,
      encoding: encoding,
      data: data,
      success: function success() {
        onComplete && onComplete(null);
      },
      fail: function fail(res) {
        console.warn("Write file failed: path: ".concat(path, " message: ").concat(res.errMsg));
        onComplete && onComplete(new Error(res.errMsg));
      }
    });
  },
  writeFileSync: function writeFileSync(path, data, encoding) {
    try {
      fs.writeFileSync(path, data, encoding);
      return null;
    } catch (e) {
      console.warn("Write file failed: path: ".concat(path, " message: ").concat(e.message));
      return new Error(e.message);
    }
  },
  readFile: function readFile(filePath, encoding, onComplete) {
    fs.readFile({
      filePath: filePath,
      encoding: encoding,
      success: function success(res) {
        onComplete && onComplete(null, res.data);
      },
      fail: function fail(res) {
        console.warn("Read file failed: path: ".concat(filePath, " message: ").concat(res.errMsg));
        onComplete && onComplete(new Error(res.errMsg), null);
      }
    });
  },
  readDir: function readDir(filePath, onComplete) {
    fs.readdir({
      dirPath: filePath,
      success: function success(res) {
        onComplete && onComplete(null, res.files);
      },
      fail: function fail(res) {
        console.warn("Read directory failed: path: ".concat(filePath, " message: ").concat(res.errMsg));
        onComplete && onComplete(new Error(res.errMsg), null);
      }
    });
  },
  readText: function readText(filePath, onComplete) {
    fsUtils.readFile(filePath, 'utf8', onComplete);
  },
  readArrayBuffer: function readArrayBuffer(filePath, onComplete) {
    fsUtils.readFile(filePath, 'binary', onComplete);
  },
  readJson: function readJson(filePath, onComplete) {
    fsUtils.readFile(filePath, 'utf8', function (err, text) {
      var out = null;

      if (!err) {
        try {
          out = JSON.parse(text);
        } catch (e) {
          console.warn("Read json failed: path: ".concat(filePath, " message: ").concat(e.message));
          err = new Error(e.message);
        }
      }

      onComplete && onComplete(err, out);
    });
  },
  readJsonSync: function readJsonSync(path) {
    try {
      var str = fs.readFileSync(path, 'utf8');
      return JSON.parse(str);
    } catch (e) {
      console.warn("Read json failed: path: ".concat(path, " message: ").concat(e.message));
      return new Error(e.message);
    }
  },
  makeDirSync: function makeDirSync(path, recursive) {
    try {
      fs.mkdirSync(path, recursive);
      return null;
    } catch (e) {
      console.warn("Make directory failed: path: ".concat(path, " message: ").concat(e.message));
      return new Error(e.message);
    }
  },
  rmdirSync: function rmdirSync(dirPath, recursive) {
    try {
      fs.rmdirSync(dirPath, recursive);
    } catch (e) {
      console.warn("rm directory failed: path: ".concat(dirPath, " message: ").concat(e.message));
      return new Error(e.message);
    }
  },
  exists: function exists(filePath, onComplete) {
    fs.access({
      path: filePath,
      success: function success() {
        onComplete && onComplete(true);
      },
      fail: function fail() {
        onComplete && onComplete(false);
      }
    });
  },
  loadSubpackage: function loadSubpackage(name, onProgress, onComplete) {
    var task = ral.loadSubpackage({
      name: "".concat(fsUtils._subpackagesPath).concat(name),
      success: function success() {
        onComplete && onComplete();
      },
      fail: function fail(res) {
        console.warn("Load Subpackage failed: path: ".concat(name, " message: ").concat(res.errMsg));
        onComplete && onComplete(new Error("Failed to load subpackage ".concat(name, ": ").concat(res.errMsg)));
      }
    });
    onProgress && task.onProgressUpdate(onProgress);
    return task;
  },
  unzip: function unzip(zipFilePath, targetPath, onComplete) {
    fs.unzip({
      zipFilePath: zipFilePath,
      targetPath: targetPath,
      success: function success() {
        onComplete && onComplete(null);
      },
      fail: function fail(res) {
        console.warn("unzip failed: path: ".concat(zipFilePath, " message: ").concat(res.errMsg));
        onComplete && onComplete(new Error('unzip failed: ' + res.errMsg));
      }
    });
  }
};
window.fsUtils = module.exports = fsUtils;

},{}],6:[function(require,module,exports){
"use strict";

cc.game.restart = function () {};

ral.onWindowResize && ral.onWindowResize(function (width, height) {
  // Since the initialization of the creator engine may not take place until after the onWindowResize call,
  // you need to determine whether the canvas already exists before you can call the setCanvasSize method
  cc.game.canvas && cc.view.setCanvasSize(width, height);
});

},{}],7:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
require('./fs-utils');

require('./canvas');

require('./asset-manager.js');

require('./EditBox.js');

require('./game.js');

},{"./EditBox.js":1,"./asset-manager.js":2,"./canvas":4,"./fs-utils":5,"./game.js":6}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

https://www.cocos.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated engine source code (the "Software"), a limited,
worldwide, royalty-free, non-assignable, revocable and non-exclusive license
to use Cocos Creator solely to develop games on your target platforms. You shall
not use Cocos Creator software for developing other software or tools that's
used for developing games. You are not granted to publish, distribute,
sublicense, and/or sell copies of Cocos Creator.

The software or tools in this License Agreement are licensed, not sold.
Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
if (cc.internal.VideoPlayer) {
  var EventType = cc.internal.VideoPlayer.EventType;
  var vec3 = cc.Vec3;

  var _mat4_temp = cc.mat4();

  var _topLeft = new vec3();

  var _bottomRight = new vec3();

  var dpr = ral.getSystemInfoSync().pixelRatio;

  cc.internal.VideoPlayerImplManager.getImpl = function (componenet) {
    return new VideoPlayerImplMiniGame(componenet);
  };

  var VideoPlayerImplMiniGame = /*#__PURE__*/function (_cc$internal$VideoPla) {
    _inherits(VideoPlayerImplMiniGame, _cc$internal$VideoPla);

    function VideoPlayerImplMiniGame(componenet) {
      _classCallCheck(this, VideoPlayerImplMiniGame);

      return _possibleConstructorReturn(this, _getPrototypeOf(VideoPlayerImplMiniGame).call(this, componenet));
    }

    _createClass(VideoPlayerImplMiniGame, [{
      key: "syncClip",
      value: function syncClip(clip) {
        this.removeVideoPlayer();

        if (!clip) {
          return;
        }

        this.createVideoPlayer(clip._nativeAsset);
      }
    }, {
      key: "syncURL",
      value: function syncURL(url) {
        this.removeVideoPlayer();

        if (!url) {
          return;
        }

        this.createVideoPlayer(url);
      }
    }, {
      key: "onCanplay",
      value: function onCanplay() {
        if (this._loaded) {
          return;
        }

        this._loaded = true;
        this.setVisible(this._visible);
        this.dispatchEvent(EventType.READY_TO_PLAY);
        this.delayedPlay();
      }
    }, {
      key: "_bindEvent",
      value: function _bindEvent() {
        var video = this._video,
            self = this;

        if (!video) {
          return;
        }

        video.onPlay(function () {
          if (self._video !== video) return;
          self._playing = true;
          self.dispatchEvent(EventType.PLAYING);
        });
        video.onEnded(function () {
          if (self._video !== video) return;
          self._playing = false;
          self._currentTime = self._duration; // ensure currentTime is at the end of duration

          self.dispatchEvent(EventType.COMPLETED);
        });
        video.onPause(function () {
          if (self._video !== video) return;
          self._playing = false;
          self.dispatchEvent(EventType.PAUSED);
        });
        video.onTimeUpdate(function (res) {
          self._duration = res.duration;
          self._currentTime = res.position;
        }); // onStop not supported, implemented in promise returned by video.stop call.
      }
    }, {
      key: "_unbindEvent",
      value: function _unbindEvent() {
        var video = this._video;

        if (!video) {
          return;
        } // BUG: video.offPlay(cb) is invalid


        video.offPlay();
        video.offEnded();
        video.offPause();
        video.offTimeUpdate(); // offStop not supported
      }
    }, {
      key: "createVideoPlayer",
      value: function createVideoPlayer(url) {
        if (!ral.createVideo) {
          console.warn('VideoPlayer not supported');
          return;
        }

        if (!this._video) {
          var initRect = this._getInitRect();

          this._video = ral.createVideo(_objectSpread({}, initRect, {
            // OPPO video only can resize when it is initiated
            src: url,
            objectFit: "contain",
            live: false,
            showCenterPlayBtn: false,
            controls: false // autoplay: true,  // autoplay is invalid

          }));
          this._duration = 0;
          this._currentTime = 0;
          this._loaded = false;
          this.setVisible(this._visible);

          this._bindEvent();

          this._forceUpdate = true;
        }

        this.setURL(url);
        this._forceUpdate = true;
      }
    }, {
      key: "setURL",
      value: function setURL(path) {
        var video = this._video;

        if (!video || video.src === path) {
          return;
        }

        video.stop();

        this._unbindEvent();

        video.src = path;
        video.muted = true;
        var self = this;
        this._loaded = false;

        var loadedCallback = function loadedCallback() {
          video.offPlay(loadedCallback);
          video.offTimeUpdate(timeCallBack);
          self.enable();

          self._bindEvent();

          video.stop();
          video.muted = false;
          self._loaded = true;
          self._playing = false;
          self._currentTime = 0;
          self.dispatchEvent(EventType.READY_TO_PLAY);
        };

        var timeCallBack = function timeCallBack(res) {
          var data = JSON.parse(res.position);

          if (_typeof(data) === "object") {
            self._duration = data.duration;
            self._currentTime = data.position;
            return;
          }

          self._duration = res.duration;
          self._currentTime = res.position;
        };

        video.onPlay(loadedCallback);
        video.onTimeUpdate(timeCallBack); // HACK: keep playing till video loaded

        video.play();
      }
    }, {
      key: "removeVideoPlayer",
      value: function removeVideoPlayer() {
        var video = this.video;

        if (video) {
          video.stop();
          video.destroy();
          this._playing = false;
          this._loaded = false;
          this._loadedMeta = false;
          this._ignorePause = false;
          this._cachedCurrentTime = 0;
          this._video = null;
        }
      }
    }, {
      key: "setVisible",
      value: function setVisible(value) {
        var video = this._video;

        if (!video || this._visible === value) {
          return;
        }

        if (value) {
          video.width = this._actualWidth || 0;
        } else {
          video.width = 0; // hide video
        }

        this._visible = value;
      }
    }, {
      key: "getDuration",
      value: function getDuration() {
        return this.duration();
      }
    }, {
      key: "duration",
      value: function duration() {
        return this._duration;
      }
    }, {
      key: "syncPlaybackRate",
      value: function syncPlaybackRate(value) {
        var video = this._video;

        if (video && value !== video.playbackRate) {
          if (value === 0.5 | value === 0.8 | value === 1.0 | value === 1.25 | value === 1.5) {
            video.playbackRate = value;
          } else {
            console.warn('The platform does not support this PlaybackRate!');
          }
        }
      }
    }, {
      key: "syncVolume",
      value: function syncVolume() {
        console.warn('The platform does not support');
      }
    }, {
      key: "syncMute",
      value: function syncMute(enable) {
        var video = this._video;

        if (video && video.muted !== enable) {
          video.muted = enable;
        }
      }
    }, {
      key: "syncLoop",
      value: function syncLoop(enable) {
        var video = this._video;

        if (video && video.loop !== enable) {
          video.loop = enable;
        }
      }
    }, {
      key: "syncStayOnBottom",
      value: function syncStayOnBottom() {
        console.warn('The platform does not support');
      }
    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        if (this.video) {
          return this.currentTime();
        }

        return -1;
      }
    }, {
      key: "currentTime",
      value: function currentTime() {
        return this._currentTime;
      }
    }, {
      key: "seekTo",
      value: function seekTo(time) {
        var video = this._video;
        if (!video || !this._loaded) return;
        video.seek(time);
      }
    }, {
      key: "disable",
      value: function disable(noPause) {
        if (this._video) {
          if (!noPause) {
            this._video.pause();
          }

          this.setVisible(false);
          this._visible = false;
        }
      }
    }, {
      key: "enable",
      value: function enable() {
        if (this._video) {
          this.setVisible(true);
          this._visible = true;
        }
      }
    }, {
      key: "canPlay",
      value: function canPlay() {
        this._video.play();

        this.syncCurrentTime();
      }
    }, {
      key: "resume",
      value: function resume() {
        var video = this._video;
        if (this._playing || !video) return;
        video.play();
      }
    }, {
      key: "pause",
      value: function pause() {
        var video = this._video;
        if (!this._playing || !video) return;
        video.pause();
      }
    }, {
      key: "stop",
      value: function stop() {
        var self = this;
        var video = this._video;
        if (!video || !this._visible) return;
        video.stop().then(function (res) {
          if (res.errMsg && !res.errMsg.includes('ok')) {
            console.error('failed to stop video player');
            return;
          }

          self._currentTime = 0;
          self._playing = false;
          self.dispatchEvent(EventType.STOPPED);
        });
      }
    }, {
      key: "canFullScreen",
      value: function canFullScreen(enabled) {
        if (this._video) {
          this.setFullScreenEnabled(enabled);
        }
      }
    }, {
      key: "setFullScreenEnabled",
      value: function setFullScreenEnabled(enable) {
        var video = this._video;

        if (!video || this._fullScreenEnabled === enable) {
          return;
        }

        if (enable) {
          video.requestFullScreen();
        } else {
          video.exitFullScreen();
        }

        this._fullScreenEnabled = enable;
      }
    }, {
      key: "syncKeepAspectRatio",
      value: function syncKeepAspectRatio(enabled) {
        console.warn('On wechat game videoPlayer is always keep the aspect ratio');
      }
    }, {
      key: "syncMatrix",
      value: function syncMatrix() {// DO NOTHING...
      }
    }, {
      key: "_getInitRect",
      value: function _getInitRect() {
        if (!this._component || !this._uiTrans) return;
        var camera = this.UICamera;

        if (!camera) {
          return;
        }

        this._component.node.getWorldMatrix(_mat4_temp);

        var uiWidth = this._uiTrans.contentSize.width;
        var uiHeight = this._uiTrans.contentSize.height;
        this._m00 = _mat4_temp.m00;
        this._m01 = _mat4_temp.m01;
        this._m04 = _mat4_temp.m04;
        this._m05 = _mat4_temp.m05;
        this._m12 = _mat4_temp.m12;
        this._m13 = _mat4_temp.m13;
        this._w = uiWidth;
        this._h = uiHeight;
        var canvas_width = cc.game.canvas.width;
        var canvas_height = cc.game.canvas.height;
        var ap = this._uiTrans.anchorPoint; // Vectors in node space

        vec3.set(_topLeft, -ap.x * this._w, (1.0 - ap.y) * this._h, 0);
        vec3.set(_bottomRight, (1 - ap.x) * this._w, -ap.y * this._h, 0); // Convert to world space

        vec3.transformMat4(_topLeft, _topLeft, _mat4_temp);
        vec3.transformMat4(_bottomRight, _bottomRight, _mat4_temp); // Convert to Screen space

        camera.worldToScreen(_topLeft, _topLeft);
        camera.worldToScreen(_bottomRight, _bottomRight);
        var finalWidth = _bottomRight.x - _topLeft.x;
        var finalHeight = _topLeft.y - _bottomRight.y;
        var x = _topLeft.x / dpr;
        var y = (canvas_height - _topLeft.y) / dpr;
        var width = finalWidth / dpr;
        var height = finalHeight / dpr;
        return {
          x: x,
          y: y,
          width: width,
          height: height
        };
      }
    }]);

    return VideoPlayerImplMiniGame;
  }(cc.internal.VideoPlayerImpl);
}

},{}],9:[function(require,module,exports){
"use strict";

require('../../../common/engine/index');

require('./VideoPlayer');

},{"../../../common/engine/index":7,"./VideoPlayer":8}]},{},[9]);
