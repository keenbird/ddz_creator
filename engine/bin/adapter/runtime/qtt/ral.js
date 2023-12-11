(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _features = {};
var _getCallbacks = {};
var _setCallbacks = {};
var _FEATURE_UNSUPPORT = -1;
var _default = {
  FEATURE_UNSUPPORT: _FEATURE_UNSUPPORT,
  CANVAS_CONTEXT2D_TEXTBASELINE_ALPHABETIC: {
    name: "canvas.context2d.textbaseline.alphabetic",
    enable: 1,
    disable: 0
  },
  CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT: {
    name: "canvas.context2d.textbaseline.default",
    alphabetic: 1,
    bottom: 0
  },
  setFeature: function setFeature(featureName, property, value) {
    var feature = _features[featureName];
    if (!feature) {
      feature = _features[featureName] = {};
    }
    feature[property] = value;
  },
  getFeatureProperty: function getFeatureProperty(featureName, property) {
    var feature = _features[featureName];
    return feature ? feature[property] : undefined;
  },
  registerFeatureProperty: function registerFeatureProperty(key, getFunction, setFunction) {
    if (typeof key !== "string") {
      return false;
    }
    if (typeof getFunction !== "function" && typeof setFunction !== "function") {
      return false;
    }
    if (typeof getFunction === "function" && typeof _getCallbacks[key] === "function") {
      return false;
    }
    if (typeof setFunction === "function" && typeof _setCallbacks[key] === "function") {
      return false;
    }
    if (typeof getFunction === "function") {
      _getCallbacks[key] = getFunction;
    }
    if (typeof setFunction === "function") {
      _setCallbacks[key] = setFunction;
    }
    return true;
  },
  unregisterFeatureProperty: function unregisterFeatureProperty(key, getBool, setBool) {
    if (typeof key !== "string") {
      return false;
    }
    if (typeof getBool !== "boolean" || typeof setBool !== "boolean") {
      return false;
    }
    if (getBool === true && typeof _getCallbacks[key] === "function") {
      _getCallbacks[key] = undefined;
    }
    if (setBool === true && typeof _setCallbacks[key] === "function") {
      _setCallbacks[key] = undefined;
    }
    return true;
  },
  getFeaturePropertyInt: function getFeaturePropertyInt(key) {
    if (typeof key !== "string") {
      return _FEATURE_UNSUPPORT;
    }
    var getFunction = _getCallbacks[key];
    if (getFunction === undefined) {
      return _FEATURE_UNSUPPORT;
    }
    var value = getFunction();
    if (typeof value !== "number") {
      return _FEATURE_UNSUPPORT;
    }
    if (value < _FEATURE_UNSUPPORT) {
      value = _FEATURE_UNSUPPORT;
    }
    return value;
  },
  setFeaturePropertyInt: function setFeaturePropertyInt(key, value) {
    if (typeof key !== "string" && typeof value !== "number" && value < 0) {
      return false;
    }
    var setFunction = _setCallbacks[key];
    if (setFunction === undefined) {
      return false;
    }
    var returnCode = setFunction(value);
    if (typeof returnCode !== "number" && typeof returnCode !== 'boolean') {
      return false;
    }
    return returnCode ? true : false;
  }
};
exports["default"] = _default;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _CANPLAY_CALLBACK = "canplayCallbacks";
var _ENDED_CALLBACK = "endedCallbacks";
var _ERROR_CALLBACK = "errorCallbacks";
var _PAUSE_CALLBACK = "pauseCallbacks";
var _PLAY_CALLBACK = "playCallbacks";
var _SEEKED_CALLBACK = "seekedCallbacks";
var _SEEKING_CALLBACK = "seekingCallbacks";
var _STOP_CALLBACK = "stopCallbacks";
var _TIME_UPDATE_CALLBACK = "timeUpdateCallbacks";
var _WAITING_CALLBACK = "waitingCallbacks";
var _ERROR_CODE = {
  ERROR_SYSTEM: 10001,
  ERROR_NET: 10002,
  ERROR_FILE: 10003,
  ERROR_FORMAT: 10004,
  ERROR_UNKNOWN: -1
};
var _STATE = {
  ERROR: -1,
  INITIALIZING: 0,
  PLAYING: 1,
  PAUSED: 2
};
var _audioEngine = undefined;
var _weakMap = new WeakMap();
var _offCallback = function _offCallback(target, type, callback) {
  var privateThis = _weakMap.get(target);
  if (typeof callback !== "function" || !privateThis) {
    return -1;
  }
  var callbacks = privateThis[type] || [];
  for (var i = 0, len = callbacks.length; i < len; ++i) {
    if (callback === callbacks[i]) {
      callbacks.splice(i, 1);
      return callback.length + 1;
    }
  }
  return 0;
};
var _onCallback = function _onCallback(target, type, callback) {
  var privateThis = _weakMap.get(target);
  if (typeof callback !== "function" || !privateThis) {
    return -1;
  }
  var callbacks = privateThis[type];
  if (!callbacks) {
    callbacks = privateThis[type] = [callback];
  } else {
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      if (callback === callbacks[i]) {
        return 0;
      }
    }
    callbacks.push(callback);
  }
  return callbacks.length;
};
var _dispatchCallback = function _dispatchCallback(target, type) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var privateThis = _weakMap.get(target);
  if (privateThis) {
    var callbacks = privateThis[type] || [];
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(target, args);
    }
  }
};
function InnerAudioContext() {
  this.startTime = 0;
  this.autoplay = false;
  _weakMap.set(this, {
    src: "",
    volume: 1,
    loop: false,
    seekPosition: -1
  });
  Object.defineProperty(this, "loop", {
    set: function set(value) {
      value = !!value;
      var privateThis = _weakMap.get(this);
      if (privateThis) {
        var audioID = privateThis.audioID;
        if (typeof audioID === "number" && audioID >= 0) {
          _audioEngine.setLoop(audioID, value);
        }
        privateThis.loop = value;
      }
    },
    get: function get() {
      var privateThis = _weakMap.get(this);
      return privateThis ? privateThis.loop : false;
    }
  });
  Object.defineProperty(this, "volume", {
    set: function set(value) {
      if (typeof value === "number") {
        if (value < 0) {
          value = 0;
        } else if (value > 1) {
          value = 1;
        }
      } else {
        value = 1;
      }
      var privateThis = _weakMap.get(this);
      if (privateThis) {
        var audioID = privateThis.audioID;
        if (typeof audioID === "number" && audioID >= 0) {
          _audioEngine.setVolume(audioID, value);
        }
        privateThis.volume = value;
      }
    },
    get: function get() {
      var privateThis = _weakMap.get(this);
      return privateThis ? privateThis.volume : 1;
    }
  });
  Object.defineProperty(this, "src", {
    set: function set(value) {
      var privateThis = _weakMap.get(this);
      if (!privateThis) {
        return;
      }
      var oldSrc = privateThis.src;
      privateThis.src = value;
      if (typeof value === "string") {
        var audioID = privateThis.audioID;
        if (typeof audioID === "number" && audioID >= 0 && _audioEngine.getState(audioID) === _STATE.PAUSED && oldSrc !== value) {
          _audioEngine.stop(audioID);
          privateThis.audioID = -1;
        }
        var self = this;
        _audioEngine.preload(value, function () {
          setTimeout(function () {
            if (self.src === value) {
              _dispatchCallback(self, _CANPLAY_CALLBACK);
              if (self.autoplay) {
                self.play();
              }
            }
          });
        });
      }
    },
    get: function get() {
      var privateThis = _weakMap.get(this);
      return privateThis ? privateThis.src : "";
    }
  });
  Object.defineProperty(this, "duration", {
    get: function get() {
      var privateThis = _weakMap.get(this);
      if (privateThis) {
        var audioID = privateThis.audioID;
        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getDuration(audioID);
        }
      }
      return NaN;
    },
    set: function set() {}
  });
  Object.defineProperty(this, "currentTime", {
    get: function get() {
      var privateThis = _weakMap.get(this);
      if (privateThis) {
        var audioID = privateThis.audioID;
        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getCurrentTime(audioID);
        }
      }
      return 0;
    },
    set: function set() {}
  });
  Object.defineProperty(this, "paused", {
    get: function get() {
      var privateThis = _weakMap.get(this);
      if (privateThis) {
        var audioID = privateThis.audioID;
        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getState(audioID) === _STATE.PAUSED;
        }
      }
      return true;
    },
    set: function set() {}
  });
  Object.defineProperty(this, "buffered", {
    get: function get() {
      var privateThis = _weakMap.get(this);
      if (privateThis) {
        var audioID = privateThis.audioID;
        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getBuffered(audioID);
        }
      }
      return 0;
    },
    set: function set() {}
  });
}
var _prototype = InnerAudioContext.prototype;
_prototype.destroy = function () {
  var privateThis = _weakMap.get(this);
  if (privateThis) {
    var audioID = privateThis.audioID;
    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.stop(audioID);
      privateThis.audioID = -1;
      _dispatchCallback(this, _STOP_CALLBACK);
    }
    privateThis[_CANPLAY_CALLBACK] = [];
    privateThis[_ENDED_CALLBACK] = [];
    privateThis[_ERROR_CALLBACK] = [];
    privateThis[_PAUSE_CALLBACK] = [];
    privateThis[_PLAY_CALLBACK] = [];
    privateThis[_SEEKED_CALLBACK] = [];
    privateThis[_SEEKING_CALLBACK] = [];
    privateThis[_STOP_CALLBACK] = [];
    privateThis[_TIME_UPDATE_CALLBACK] = [];
    privateThis[_WAITING_CALLBACK] = [];
    clearInterval(privateThis.intervalID);
  }
};
_prototype.play = function () {
  var privateThis = _weakMap.get(this);
  if (!privateThis) {
    return;
  }
  var src = privateThis.src;
  var audioID = privateThis.audioID;
  if (typeof src !== "string" || src === "") {
    _dispatchCallback(this, _ERROR_CALLBACK, [{
      errMsg: "invalid src",
      errCode: _ERROR_CODE.ERROR_FILE
    }]);
    return;
  }
  if (typeof audioID === "number" && audioID >= 0) {
    if (_audioEngine.getState(audioID) === _STATE.PAUSED) {
      _audioEngine.resume(audioID);
      _dispatchCallback(this, _PLAY_CALLBACK);
      return;
    } else {
      _audioEngine.stop(audioID);
      privateThis.audioID = -1;
    }
  }
  audioID = _audioEngine.play(src, this.loop, this.volume);
  if (audioID === -1) {
    _dispatchCallback(this, _ERROR_CALLBACK, [{
      errMsg: "unknown",
      errCode: _ERROR_CODE.ERROR_UNKNOWN
    }]);
    return;
  }
  privateThis.audioID = audioID;
  if (privateThis.seekPosition >= 0) {
    _audioEngine.setCurrentTime(audioID, privateThis.seekPosition);
    privateThis.seekPosition = -1;
  } else {
    if (typeof this.startTime === "number" && this.startTime > 0) {
      _audioEngine.setCurrentTime(audioID, this.startTime);
    }
  }
  _dispatchCallback(this, _WAITING_CALLBACK);
  var self = this;
  _audioEngine.setCanPlayCallback(audioID, function () {
    if (src === self.src) {
      _dispatchCallback(self, _CANPLAY_CALLBACK);
      _dispatchCallback(self, _PLAY_CALLBACK);
    }
  });
  _audioEngine.setWaitingCallback(audioID, function () {
    if (src === self.src) {
      _dispatchCallback(self, _WAITING_CALLBACK);
    }
  });
  _audioEngine.setErrorCallback(audioID, function () {
    if (src === self.src) {
      privateThis.audioID = -1;
      _dispatchCallback(self, _ERROR_CALLBACK);
    }
  });
  _audioEngine.setFinishCallback(audioID, function () {
    if (src === self.src) {
      privateThis.audioID = -1;
      _dispatchCallback(self, _ENDED_CALLBACK);
    }
  });
};
_prototype.pause = function () {
  var privateThis = _weakMap.get(this);
  if (privateThis) {
    var audioID = privateThis.audioID;
    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.pause(audioID);
      _dispatchCallback(this, _PAUSE_CALLBACK);
    }
  }
};
_prototype.seek = function (position) {
  var privateThis = _weakMap.get(this);
  if (privateThis && typeof position === "number" && position >= 0) {
    var audioID = privateThis.audioID;
    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.setCurrentTime(audioID, position);
      _dispatchCallback(this, _SEEKING_CALLBACK);
      _dispatchCallback(this, _SEEKED_CALLBACK);
    } else {
      privateThis.seekPosition = position;
    }
  }
};
_prototype.stop = function () {
  var privateThis = _weakMap.get(this);
  if (privateThis) {
    var audioID = privateThis.audioID;
    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.stop(audioID);
      privateThis.audioID = -1;
      _dispatchCallback(this, _STOP_CALLBACK);
    }
  }
};
_prototype.offCanplay = function (callback) {
  _offCallback(this, _CANPLAY_CALLBACK, callback);
};
_prototype.offEnded = function (callback) {
  _offCallback(this, _ENDED_CALLBACK, callback);
};
_prototype.offError = function (callback) {
  _offCallback(this, _ERROR_CALLBACK, callback);
};
_prototype.offPause = function (callback) {
  _offCallback(this, _PAUSE_CALLBACK, callback);
};
_prototype.offPlay = function (callback) {
  _offCallback(this, _PLAY_CALLBACK, callback);
};
_prototype.offSeeked = function (callback) {
  _offCallback(this, _SEEKED_CALLBACK, callback);
};
_prototype.offSeeking = function (callback) {
  _offCallback(this, _SEEKING_CALLBACK, callback);
};
_prototype.offStop = function (callback) {
  _offCallback(this, _STOP_CALLBACK, callback);
};
_prototype.offTimeUpdate = function (callback) {
  var result = _offCallback(this, _TIME_UPDATE_CALLBACK, callback);
  if (result === 1) {
    clearInterval(_weakMap.get(this).intervalID);
  }
};
_prototype.offWaiting = function (callback) {
  _offCallback(this, _WAITING_CALLBACK, callback);
};
_prototype.onCanplay = function (callback) {
  _onCallback(this, _CANPLAY_CALLBACK, callback);
};
_prototype.onEnded = function (callback) {
  _onCallback(this, _ENDED_CALLBACK, callback);
};
_prototype.onError = function (callback) {
  _onCallback(this, _ERROR_CALLBACK, callback);
};
_prototype.onPause = function (callback) {
  _onCallback(this, _PAUSE_CALLBACK, callback);
};
_prototype.onPlay = function (callback) {
  _onCallback(this, _PLAY_CALLBACK, callback);
};
_prototype.onSeeked = function (callback) {
  _onCallback(this, _SEEKED_CALLBACK, callback);
};
_prototype.onSeeking = function (callback) {
  _onCallback(this, "seekingCallbacks", callback);
};
_prototype.onStop = function (callback) {
  _onCallback(this, _STOP_CALLBACK, callback);
};
_prototype.onTimeUpdate = function (callback) {
  var result = _onCallback(this, _TIME_UPDATE_CALLBACK, callback);
  if (result === 1) {
    var privateThis = _weakMap.get(this);
    var self = this;
    var intervalID = setInterval(function () {
      var privateThis = _weakMap.get(self);
      if (privateThis) {
        var audioID = privateThis.audioID;
        if (typeof audioID === "number" && audioID >= 0 && _audioEngine.getState(audioID) === _STATE.PLAYING) {
          _dispatchCallback(self, _TIME_UPDATE_CALLBACK);
        }
      } else {
        clearInterval(intervalID);
      }
    }, 500);
    privateThis.intervalID = intervalID;
  }
};
_prototype.onWaiting = function (callback) {
  _onCallback(this, _WAITING_CALLBACK, callback);
};
function _default(AudioEngine) {
  if (_audioEngine === undefined) {
    _audioEngine = Object.assign({}, AudioEngine);
    Object.keys(AudioEngine).forEach(function (name) {
      if (typeof AudioEngine[name] === "function") {
        AudioEngine[name] = function () {
          console.warn("AudioEngine." + name + " is deprecated");
          return _audioEngine[name].apply(AudioEngine, arguments);
        };
      }
    });
  }
  return new InnerAudioContext();
}
;

},{}],3:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("onShow", _rt, ral);
_util["default"].exportTo("onHide", _rt, ral);
_util["default"].exportTo("offShow", _rt, ral);
_util["default"].exportTo("offHide", _rt, ral);

},{"../../util":21}],4:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("loadSubpackage", _rt, ral);

},{"../../util":21}],5:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("env", _rt, ral);
_util["default"].exportTo("getSystemInfo", _rt, ral);
_util["default"].exportTo("getSystemInfoSync", _rt, ral);

},{"../../util":21}],6:[function(require,module,exports){
"use strict";

var _jsb = window.jsb;
if (!_jsb) {
  _jsb = {};
}
var _rt = loadRuntime();
var _touches = [];
var _getTouchIndex = function _getTouchIndex(touch) {
  var element;
  for (var index = 0; index < _touches.length; index++) {
    element = _touches[index];
    if (touch.identifier === element.identifier) {
      return index;
    }
  }
  return -1;
};
var _copyObject = function _copyObject(fromObj, toObject) {
  for (var key in fromObj) {
    if (fromObj.hasOwnProperty(key)) {
      toObject[key] = fromObj[key];
    }
  }
};
var _listenerMap = {
  "touchstart": [],
  "touchmove": [],
  "touchend": [],
  "touchcancel": []
};
function _addListener(key, value) {
  var listenerArr = _listenerMap[key];
  for (var index = 0, length = listenerArr.length; index < length; index++) {
    if (value === listenerArr[index]) {
      return;
    }
  }
  listenerArr.push(value);
}
function _removeListener(key, value) {
  var listenerArr = _listenerMap[key] || [];
  var length = listenerArr.length;
  for (var index = 0; index < length; ++index) {
    if (value === listenerArr[index]) {
      listenerArr.splice(index, 1);
      return;
    }
  }
}
var _hasDellWith = false;
var _systemInfo = _rt.getSystemInfoSync();
if (window.innerWidth && _systemInfo.windowWidth !== window.innerWidth) {
  _hasDellWith = true;
}
var _touchEventHandlerFactory = function _touchEventHandlerFactory(type) {
  return function (changedTouches) {
    if (typeof changedTouches === "function") {
      _addListener(type, changedTouches);
      return;
    }
    var touchEvent = new TouchEvent(type);
    var index;
    if (type === "touchstart") {
      changedTouches.forEach(function (touch) {
        index = _getTouchIndex(touch);
        if (index >= 0) {
          _copyObject(touch, _touches[index]);
        } else {
          var tmp = {};
          _copyObject(touch, tmp);
          _touches.push(tmp);
        }
      });
    } else if (type === "touchmove") {
      changedTouches.forEach(function (element) {
        index = _getTouchIndex(element);
        if (index >= 0) {
          _copyObject(element, _touches[index]);
        }
      });
    } else if (type === "touchend" || type === "touchcancel") {
      changedTouches.forEach(function (element) {
        index = _getTouchIndex(element);
        if (index >= 0) {
          _touches.splice(index, 1);
        }
      });
    }
    var touches = [].concat(_touches);
    var _changedTouches = [];
    changedTouches.forEach(function (touch) {
      var length = touches.length;
      for (var _index = 0; _index < length; ++_index) {
        var _touch = touches[_index];
        if (touch.identifier === _touch.identifier) {
          _changedTouches.push(_touch);
          return;
        }
      }
      _changedTouches.push(touch);
    });
    touchEvent.touches = touches;
    touchEvent.targetTouches = touches;
    touchEvent.changedTouches = _changedTouches;
    if (_hasDellWith) {
      touches.forEach(function (touch) {
        touch.clientX /= window.devicePixelRatio;
        touch.clientY /= window.devicePixelRatio;
        touch.pageX /= window.devicePixelRatio;
        touch.pageY /= window.devicePixelRatio;
      });
      if (type === "touchcancel" || type === "touchend") {
        _changedTouches.forEach(function (touch) {
          touch.clientX /= window.devicePixelRatio;
          touch.clientY /= window.devicePixelRatio;
          touch.pageX /= window.devicePixelRatio;
          touch.pageY /= window.devicePixelRatio;
        });
      }
    }
    var listenerArr = _listenerMap[type];
    var length = listenerArr.length;
    for (var _index2 = 0; _index2 < length; _index2++) {
      listenerArr[_index2](touchEvent);
    }
  };
};
if (_rt.onTouchStart) {
  ral.onTouchStart = _rt.onTouchStart;
  ral.offTouchStart = _rt.offTouchStart;
} else {
  _jsb.onTouchStart = _touchEventHandlerFactory('touchstart');
  _jsb.offTouchStart = function (callback) {
    _removeListener("touchstart", callback);
  };
  ral.onTouchStart = _jsb.onTouchStart.bind(_jsb);
  ral.offTouchStart = _jsb.offTouchStart.bind(_jsb);
}
if (_rt.onTouchMove) {
  ral.onTouchMove = _rt.onTouchMove;
  ral.offTouchMove = _rt.offTouchMove;
} else {
  _jsb.onTouchMove = _touchEventHandlerFactory('touchmove');
  _jsb.offTouchMove = function (callback) {
    _removeListener("touchmove", callback);
  };
  ral.onTouchMove = _jsb.onTouchMove.bind(_jsb);
  ral.offTouchMove = _jsb.offTouchMove.bind(_jsb);
}
if (_rt.onTouchCancel) {
  ral.onTouchCancel = _rt.onTouchCancel;
  ral.offTouchCancel = _rt.offTouchCancel;
} else {
  _jsb.onTouchCancel = _touchEventHandlerFactory('touchcancel');
  _jsb.offTouchCancel = function (callback) {
    _removeListener("touchcancel", callback);
  };
  ral.onTouchCancel = _jsb.onTouchCancel.bind(_jsb);
  ral.offTouchCancel = _jsb.offTouchCancel.bind(_jsb);
}
if (_rt.onTouchEnd) {
  ral.onTouchEnd = _rt.onTouchEnd;
  ral.offTouchEnd = _rt.offTouchEnd;
} else {
  _jsb.onTouchEnd = _touchEventHandlerFactory('touchend');
  _jsb.offTouchEnd = function (callback) {
    _removeListener("touchend", callback);
  };
  ral.onTouchEnd = _jsb.onTouchEnd.bind(_jsb);
  ral.offTouchEnd = _jsb.offTouchEnd.bind(_jsb);
}

},{}],7:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
var _listeners = [];
ral.device = ral.device || {};
if (_rt.offAccelerometerChange) {
  if (_rt._compatibleMode === 1) {
    var _systemInfo = _rt.getSystemInfoSync();
    var _isAndroid = _systemInfo.platform.toLowerCase() === "android";
    var _compatibleAccelerometerChange = function _compatibleAccelerometerChange(e) {
      if (_isAndroid) {
        e.x /= -10;
        e.y /= -10;
        e.z /= -10;
      } else {
        e.x /= 10;
        e.y /= 10;
        e.z /= 10;
      }
      _listeners.forEach(function (listener) {
        listener(e);
      });
    };
    var _onAccelerometerChange = _rt.onAccelerometerChange.bind(_rt);
    ral.onAccelerometerChange = function (listener) {
      if (typeof listener === "function") {
        var length = _listeners.length;
        for (var index = 0; index < length; ++index) {
          if (listener === _listeners[index]) {
            return;
          }
        }
        _listeners.push(listener);
        if (_listeners.length === 1) {
          _onAccelerometerChange(_compatibleAccelerometerChange);
        }
      }
    };
    var _offAccelerometerChange = _rt.offAccelerometerChange.bind(_rt);
    ral.offAccelerometerChange = function (listener) {
      var length = _listeners.length;
      for (var index = 0; index < length; ++index) {
        if (listener === _listeners[index]) {
          _listeners.splice(index, 1);
          if (_listeners.length === 0) {
            _offAccelerometerChange(_compatibleAccelerometerChange);
          }
          break;
        }
      }
    };
  } else {
    ral.onAccelerometerChange = _rt.onAccelerometerChange.bind(_rt);
    ral.offAccelerometerChange = _rt.offAccelerometerChange.bind(_rt);
  }
  ral.stopAccelerometer = _rt.stopAccelerometer.bind(_rt);
  var _startAccelerometer = _rt.startAccelerometer.bind(_rt);
  ral.startAccelerometer = function (obj) {
    return _startAccelerometer(Object.assign({
      type: "accelerationIncludingGravity"
    }, obj));
  };
} else {
  ral.onAccelerometerChange = function (listener) {
    if (typeof listener === "function") {
      var length = _listeners.length;
      for (var index = 0; index < length; ++index) {
        if (listener === _listeners[index]) {
          return;
        }
      }
      _listeners.push(listener);
    }
  };
  ral.offAccelerometerChange = function (listener) {
    var length = _listeners.length;
    for (var index = 0; index < length; ++index) {
      if (listener === _listeners[index]) {
        _listeners.splice(index, 1);
        return;
      }
    }
  };
  var _systemInfo2 = _rt.getSystemInfoSync();
  var _isAndroid2 = _systemInfo2.platform.toLowerCase() === "android";
  jsb.device.dispatchDeviceMotionEvent = function (event) {
    var acceleration = Object.assign({}, event._accelerationIncludingGravity);
    if (_isAndroid2) {
      acceleration.x /= -10;
      acceleration.y /= -10;
      acceleration.z /= -10;
    } else {
      acceleration.x /= 10;
      acceleration.y /= 10;
      acceleration.z /= 10;
    }
    _listeners.forEach(function (listener) {
      listener({
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z
      });
    });
  };
  ral.stopAccelerometer = function () {
    jsb.device.setMotionEnabled(false);
  };
  ral.startAccelerometer = function () {
    jsb.device.setMotionEnabled(true);
  };
}

},{"../../util":21}],8:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("getBatteryInfo", _rt, ral);
_util["default"].exportTo("getBatteryInfoSync", _rt, ral);

},{"../../util":21}],9:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("getFileSystemManager", _rt, ral);

},{"../../util":21}],10:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../util"));
var _feature = _interopRequireDefault(require("../feature"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
if (window.jsb) {
  window.ral = Object.assign({}, window.jsb);
} else {
  window.ral = {};
}
require("./base/lifecycle");
require("./base/subpackage");
require("./base/system-info");
require("./base/touch-event");
require("./device/accelerometer");
require("./device/battery");
require("./file/file-system-manager");
require("./interface/keyboard");
require("./interface/window");
require("./media/audio");
require("./media/video");
require("./network/download");
require("./rendering/canvas");
require("./rendering/webgl");
require("./rendering/font");
require("./rendering/frame");
require("./rendering/image");
for (var key in _feature["default"]) {
  if (key === "setFeature" || key === "registerFeatureProperty" || key === "unregisterFeatureProperty") {
    continue;
  }
  if (_feature["default"].hasOwnProperty(key)) {
    _util["default"].exportTo(key, _feature["default"], ral);
  }
}

},{"../feature":1,"../util":21,"./base/lifecycle":3,"./base/subpackage":4,"./base/system-info":5,"./base/touch-event":6,"./device/accelerometer":7,"./device/battery":8,"./file/file-system-manager":9,"./interface/keyboard":11,"./interface/window":12,"./media/audio":13,"./media/video":14,"./network/download":15,"./rendering/canvas":16,"./rendering/font":17,"./rendering/frame":18,"./rendering/image":19,"./rendering/webgl":20}],11:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("onKeyboardInput", _rt, ral);
_util["default"].exportTo("onKeyboardConfirm", _rt, ral);
_util["default"].exportTo("onKeyboardComplete", _rt, ral);
_util["default"].exportTo("offKeyboardInput", _rt, ral);
_util["default"].exportTo("offKeyboardConfirm", _rt, ral);
_util["default"].exportTo("offKeyboardComplete", _rt, ral);
_util["default"].exportTo("hideKeyboard", _rt, ral);
_util["default"].exportTo("showKeyboard", _rt, ral);
_util["default"].exportTo("updateKeyboard", _rt, ral);

},{"../../util":21}],12:[function(require,module,exports){
"use strict";

var _rt = loadRuntime();
var _onWindowResize = _rt.onWindowResize;
ral.onWindowResize = function (callBack) {
  _onWindowResize(function (size) {
    callBack(size.width || size.windowWidth, size.height || size.windowHeight);
  });
};
window.resize = function () {
  console.warn('window.resize() is deprecated');
};

},{}],13:[function(require,module,exports){
"use strict";

var _innerContext = _interopRequireDefault(require("../../inner-context"));
var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("AudioEngine", _rt, ral);
_util["default"].exportTo("createInnerAudioContext", _rt, ral, function () {
  if (_rt.AudioEngine) {
    ral.createInnerAudioContext = function () {
      return (0, _innerContext["default"])(_rt.AudioEngine);
    };
  }
});

},{"../../inner-context":2,"../../util":21}],14:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("createVideo", _rt, ral);

},{"../../util":21}],15:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("downloadFile", _rt, ral);

},{"../../util":21}],16:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
var _feature = _interopRequireDefault(require("../../feature"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("createCanvas", _rt, ral, function () {
  var featureValue = "unsupported";
  if (document && typeof document.createElement === "function") {
    featureValue = "wrapper";
    ral.createCanvas = function () {
      return document.createElement("canvas");
    };
  }
  _feature["default"].setFeature("ral.createCanvas", "spec", featureValue);
});
var _rt_getFeature = _rt.getFeature;
var _rt_setFeature = _rt.setFeature;
_feature["default"].registerFeatureProperty(_feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_ALPHABETIC.name, function () {
  if (typeof _rt_getFeature === "function") {
    var value = _rt_getFeature(_feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_ALPHABETIC.name);
    switch (value) {
      case 1:
        return _feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_ALPHABETIC.enable;
      default:
        break;
    }
  }
  return _feature["default"].FEATURE_UNSUPPORT;
}, undefined);
_feature["default"].registerFeatureProperty(_feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.name, function () {
  if (typeof _rt_getFeature === "function") {
    var value = _rt_getFeature(_feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.name);
    switch (value) {
      case 1:
        return _feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.alphabetic;
      case 0:
        return _feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.bottom;
      default:
        break;
    }
  }
  return _feature["default"].FEATURE_UNSUPPORT;
}, function (value) {
  if (typeof _rt_setFeature === "function") {
    switch (value) {
      case _feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.alphabetic:
        value = 1;
        break;
      case _feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.bottom:
        value = 0;
        break;
      default:
        return false;
    }
    return _rt_setFeature(_feature["default"].CANVAS_CONTEXT2D_TEXTBASELINE_DEFAULT.name, value);
  }
  return false;
});

},{"../../feature":1,"../../util":21}],17:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("loadFont", _rt, ral);

},{"../../util":21}],18:[function(require,module,exports){
"use strict";

var _rt = loadRuntime();
if (window.jsb && jsb.setPreferredFramesPerSecond) {
  ral.setPreferredFramesPerSecond = jsb.setPreferredFramesPerSecond.bind(jsb);
} else if (_rt.setPreferredFramesPerSecond) {
  ral.setPreferredFramesPerSecond = _rt.setPreferredFramesPerSecond.bind(_rt);
} else {
  ral.setPreferredFramesPerSecond = function () {
    console.error("The setPreferredFramesPerSecond is not define!");
  };
}

},{}],19:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));
var _feature = _interopRequireDefault(require("../../feature"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _rt = loadRuntime();
_util["default"].exportTo("loadImageData", _rt, ral);
_util["default"].exportTo("createImage", _rt, ral, function () {
  var featureValue = "unsupported";
  if (document && typeof document.createElement === "function") {
    featureValue = "wrapper";
    ral.createImage = function () {
      return document.createElement("image");
    };
  }
  _feature["default"].setFeature("ral.createImage", "spec", featureValue);
});

},{"../../feature":1,"../../util":21}],20:[function(require,module,exports){
"use strict";

if (window.__gl) {
  var gl = window.__gl;
  var _glTexImage2D = gl.texImage2D;
  gl.texImage2D = function (target, level, internalformat, width, height, border, format, type, pixels) {
    var argc = arguments.length;
    if (argc === 6) {
      var image = border;
      type = height;
      format = width;
      if (image instanceof HTMLImageElement) {
        var error = console.error;
        console.error = function () {};
        _glTexImage2D.apply(void 0, arguments);
        console.error = error;
        gl.texImage2D_image(target, level, image._imageMeta);
      } else if (image instanceof HTMLCanvasElement) {
        var _error = console.error;
        console.error = function () {};
        _glTexImage2D.apply(void 0, arguments);
        console.error = _error;
        var context2D = image.getContext('2d');
        gl.texImage2D_canvas(target, level, internalformat, format, type, context2D);
      } else if (image instanceof ImageData) {
        _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, image.data);
      } else {
        console.error("Invalid pixel argument passed to gl.texImage2D!");
      }
    } else if (argc === 9) {
      _glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels);
    } else {
      console.error("gl.texImage2D: invalid argument count!");
    }
  };
  var _glTexSubImage2D = gl.texSubImage2D;
  gl.texSubImage2D = function (target, level, xoffset, yoffset, width, height, format, type, pixels) {
    var argc = arguments.length;
    if (argc === 7) {
      var image = format;
      type = height;
      format = width;
      if (image instanceof HTMLImageElement) {
        var error = console.error;
        console.error = function () {};
        _glTexSubImage2D.apply(void 0, arguments);
        console.error = error;
        gl.texSubImage2D_image(target, level, xoffset, yoffset, image._imageMeta);
      } else if (image instanceof HTMLCanvasElement) {
        var _error2 = console.error;
        console.error = function () {};
        _glTexSubImage2D.apply(void 0, arguments);
        console.error = _error2;
        var context2D = image.getContext('2d');
        gl.texSubImage2D_canvas(target, level, xoffset, yoffset, format, type, context2D);
      } else if (image instanceof ImageData) {
        _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, image.data);
      } else {
        console.error("Invalid pixel argument passed to gl.texImage2D!");
      }
    } else if (argc === 9) {
      _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
    } else {
      console.error(new Error("gl.texImage2D: invalid argument count!").stack);
    }
  };
}

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _default = {
  exportTo: function exportTo(name, from, to, errCallback, successCallback) {
    if (_typeof(from) !== "object" || _typeof(to) !== "object") {
      console.warn("invalid exportTo: ", name);
      return;
    }
    var fromProperty = from[name];
    if (typeof fromProperty !== "undefined") {
      if (typeof fromProperty === "function") {
        to[name] = fromProperty.bind(from);
        Object.assign(to[name], fromProperty);
      } else {
        to[name] = fromProperty;
      }
      if (typeof successCallback === "function") {
        successCallback();
      }
    } else {
      to[name] = function () {
        console.error(name + " is not support!");
        return {};
      };
      if (typeof errCallback === "function") {
        errCallback();
      }
    }
  }
};
exports["default"] = _default;

},{}]},{},[10]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xudmFyIF9mZWF0dXJlcyA9IHt9O1xudmFyIF9nZXRDYWxsYmFja3MgPSB7fTtcbnZhciBfc2V0Q2FsbGJhY2tzID0ge307XG52YXIgX0ZFQVRVUkVfVU5TVVBQT1JUID0gLTE7XG52YXIgX2RlZmF1bHQgPSB7XG4gIEZFQVRVUkVfVU5TVVBQT1JUOiBfRkVBVFVSRV9VTlNVUFBPUlQsXG4gIENBTlZBU19DT05URVhUMkRfVEVYVEJBU0VMSU5FX0FMUEhBQkVUSUM6IHtcbiAgICBuYW1lOiBcImNhbnZhcy5jb250ZXh0MmQudGV4dGJhc2VsaW5lLmFscGhhYmV0aWNcIixcbiAgICBlbmFibGU6IDEsXG4gICAgZGlzYWJsZTogMFxuICB9LFxuICBDQU5WQVNfQ09OVEVYVDJEX1RFWFRCQVNFTElORV9ERUZBVUxUOiB7XG4gICAgbmFtZTogXCJjYW52YXMuY29udGV4dDJkLnRleHRiYXNlbGluZS5kZWZhdWx0XCIsXG4gICAgYWxwaGFiZXRpYzogMSxcbiAgICBib3R0b206IDBcbiAgfSxcbiAgc2V0RmVhdHVyZTogZnVuY3Rpb24gc2V0RmVhdHVyZShmZWF0dXJlTmFtZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgdmFyIGZlYXR1cmUgPSBfZmVhdHVyZXNbZmVhdHVyZU5hbWVdO1xuICAgIGlmICghZmVhdHVyZSkge1xuICAgICAgZmVhdHVyZSA9IF9mZWF0dXJlc1tmZWF0dXJlTmFtZV0gPSB7fTtcbiAgICB9XG4gICAgZmVhdHVyZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgfSxcbiAgZ2V0RmVhdHVyZVByb3BlcnR5OiBmdW5jdGlvbiBnZXRGZWF0dXJlUHJvcGVydHkoZmVhdHVyZU5hbWUsIHByb3BlcnR5KSB7XG4gICAgdmFyIGZlYXR1cmUgPSBfZmVhdHVyZXNbZmVhdHVyZU5hbWVdO1xuICAgIHJldHVybiBmZWF0dXJlID8gZmVhdHVyZVtwcm9wZXJ0eV0gOiB1bmRlZmluZWQ7XG4gIH0sXG4gIHJlZ2lzdGVyRmVhdHVyZVByb3BlcnR5OiBmdW5jdGlvbiByZWdpc3RlckZlYXR1cmVQcm9wZXJ0eShrZXksIGdldEZ1bmN0aW9uLCBzZXRGdW5jdGlvbikge1xuICAgIGlmICh0eXBlb2Yga2V5ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZ2V0RnVuY3Rpb24gIT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2Ygc2V0RnVuY3Rpb24gIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGdldEZ1bmN0aW9uID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIF9nZXRDYWxsYmFja3Nba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc2V0RnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgX3NldENhbGxiYWNrc1trZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBnZXRGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBfZ2V0Q2FsbGJhY2tzW2tleV0gPSBnZXRGdW5jdGlvbjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBzZXRGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBfc2V0Q2FsbGJhY2tzW2tleV0gPSBzZXRGdW5jdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIHVucmVnaXN0ZXJGZWF0dXJlUHJvcGVydHk6IGZ1bmN0aW9uIHVucmVnaXN0ZXJGZWF0dXJlUHJvcGVydHkoa2V5LCBnZXRCb29sLCBzZXRCb29sKSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBnZXRCb29sICE9PSBcImJvb2xlYW5cIiB8fCB0eXBlb2Ygc2V0Qm9vbCAhPT0gXCJib29sZWFuXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGdldEJvb2wgPT09IHRydWUgJiYgdHlwZW9mIF9nZXRDYWxsYmFja3Nba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBfZ2V0Q2FsbGJhY2tzW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChzZXRCb29sID09PSB0cnVlICYmIHR5cGVvZiBfc2V0Q2FsbGJhY2tzW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgX3NldENhbGxiYWNrc1trZXldID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgZ2V0RmVhdHVyZVByb3BlcnR5SW50OiBmdW5jdGlvbiBnZXRGZWF0dXJlUHJvcGVydHlJbnQoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiBfRkVBVFVSRV9VTlNVUFBPUlQ7XG4gICAgfVxuICAgIHZhciBnZXRGdW5jdGlvbiA9IF9nZXRDYWxsYmFja3Nba2V5XTtcbiAgICBpZiAoZ2V0RnVuY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIF9GRUFUVVJFX1VOU1VQUE9SVDtcbiAgICB9XG4gICAgdmFyIHZhbHVlID0gZ2V0RnVuY3Rpb24oKTtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcIm51bWJlclwiKSB7XG4gICAgICByZXR1cm4gX0ZFQVRVUkVfVU5TVVBQT1JUO1xuICAgIH1cbiAgICBpZiAodmFsdWUgPCBfRkVBVFVSRV9VTlNVUFBPUlQpIHtcbiAgICAgIHZhbHVlID0gX0ZFQVRVUkVfVU5TVVBQT1JUO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH0sXG4gIHNldEZlYXR1cmVQcm9wZXJ0eUludDogZnVuY3Rpb24gc2V0RmVhdHVyZVByb3BlcnR5SW50KGtleSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIGtleSAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YgdmFsdWUgIT09IFwibnVtYmVyXCIgJiYgdmFsdWUgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBzZXRGdW5jdGlvbiA9IF9zZXRDYWxsYmFja3Nba2V5XTtcbiAgICBpZiAoc2V0RnVuY3Rpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgcmV0dXJuQ29kZSA9IHNldEZ1bmN0aW9uKHZhbHVlKTtcbiAgICBpZiAodHlwZW9mIHJldHVybkNvZGUgIT09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHJldHVybkNvZGUgIT09ICdib29sZWFuJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcmV0dXJuQ29kZSA/IHRydWUgOiBmYWxzZTtcbiAgfVxufTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xudmFyIF9DQU5QTEFZX0NBTExCQUNLID0gXCJjYW5wbGF5Q2FsbGJhY2tzXCI7XG52YXIgX0VOREVEX0NBTExCQUNLID0gXCJlbmRlZENhbGxiYWNrc1wiO1xudmFyIF9FUlJPUl9DQUxMQkFDSyA9IFwiZXJyb3JDYWxsYmFja3NcIjtcbnZhciBfUEFVU0VfQ0FMTEJBQ0sgPSBcInBhdXNlQ2FsbGJhY2tzXCI7XG52YXIgX1BMQVlfQ0FMTEJBQ0sgPSBcInBsYXlDYWxsYmFja3NcIjtcbnZhciBfU0VFS0VEX0NBTExCQUNLID0gXCJzZWVrZWRDYWxsYmFja3NcIjtcbnZhciBfU0VFS0lOR19DQUxMQkFDSyA9IFwic2Vla2luZ0NhbGxiYWNrc1wiO1xudmFyIF9TVE9QX0NBTExCQUNLID0gXCJzdG9wQ2FsbGJhY2tzXCI7XG52YXIgX1RJTUVfVVBEQVRFX0NBTExCQUNLID0gXCJ0aW1lVXBkYXRlQ2FsbGJhY2tzXCI7XG52YXIgX1dBSVRJTkdfQ0FMTEJBQ0sgPSBcIndhaXRpbmdDYWxsYmFja3NcIjtcbnZhciBfRVJST1JfQ09ERSA9IHtcbiAgRVJST1JfU1lTVEVNOiAxMDAwMSxcbiAgRVJST1JfTkVUOiAxMDAwMixcbiAgRVJST1JfRklMRTogMTAwMDMsXG4gIEVSUk9SX0ZPUk1BVDogMTAwMDQsXG4gIEVSUk9SX1VOS05PV046IC0xXG59O1xudmFyIF9TVEFURSA9IHtcbiAgRVJST1I6IC0xLFxuICBJTklUSUFMSVpJTkc6IDAsXG4gIFBMQVlJTkc6IDEsXG4gIFBBVVNFRDogMlxufTtcbnZhciBfYXVkaW9FbmdpbmUgPSB1bmRlZmluZWQ7XG52YXIgX3dlYWtNYXAgPSBuZXcgV2Vha01hcCgpO1xudmFyIF9vZmZDYWxsYmFjayA9IGZ1bmN0aW9uIF9vZmZDYWxsYmFjayh0YXJnZXQsIHR5cGUsIGNhbGxiYWNrKSB7XG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0YXJnZXQpO1xuICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIgfHwgIXByaXZhdGVUaGlzKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHZhciBjYWxsYmFja3MgPSBwcml2YXRlVGhpc1t0eXBlXSB8fCBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChjYWxsYmFjayA9PT0gY2FsbGJhY2tzW2ldKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrLmxlbmd0aCArIDE7XG4gICAgfVxuICB9XG4gIHJldHVybiAwO1xufTtcbnZhciBfb25DYWxsYmFjayA9IGZ1bmN0aW9uIF9vbkNhbGxiYWNrKHRhcmdldCwgdHlwZSwgY2FsbGJhY2spIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRhcmdldCk7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIiB8fCAhcHJpdmF0ZVRoaXMpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgdmFyIGNhbGxiYWNrcyA9IHByaXZhdGVUaGlzW3R5cGVdO1xuICBpZiAoIWNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IHByaXZhdGVUaGlzW3R5cGVdID0gW2NhbGxiYWNrXTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBpZiAoY2FsbGJhY2sgPT09IGNhbGxiYWNrc1tpXSkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9XG4gICAgY2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICB9XG4gIHJldHVybiBjYWxsYmFja3MubGVuZ3RoO1xufTtcbnZhciBfZGlzcGF0Y2hDYWxsYmFjayA9IGZ1bmN0aW9uIF9kaXNwYXRjaENhbGxiYWNrKHRhcmdldCwgdHlwZSkge1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogW107XG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0YXJnZXQpO1xuICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICB2YXIgY2FsbGJhY2tzID0gcHJpdmF0ZVRoaXNbdHlwZV0gfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRhcmdldCwgYXJncyk7XG4gICAgfVxuICB9XG59O1xuZnVuY3Rpb24gSW5uZXJBdWRpb0NvbnRleHQoKSB7XG4gIHRoaXMuc3RhcnRUaW1lID0gMDtcbiAgdGhpcy5hdXRvcGxheSA9IGZhbHNlO1xuICBfd2Vha01hcC5zZXQodGhpcywge1xuICAgIHNyYzogXCJcIixcbiAgICB2b2x1bWU6IDEsXG4gICAgbG9vcDogZmFsc2UsXG4gICAgc2Vla1Bvc2l0aW9uOiAtMVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwibG9vcFwiLCB7XG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIHZhbHVlID0gISF2YWx1ZTtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcbiAgICAgIGlmIChwcml2YXRlVGhpcykge1xuICAgICAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG4gICAgICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgICAgICBfYXVkaW9FbmdpbmUuc2V0TG9vcChhdWRpb0lELCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZVRoaXMubG9vcCA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZVRoaXMgPyBwcml2YXRlVGhpcy5sb29wIDogZmFsc2U7XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwidm9sdW1lXCIsIHtcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICBpZiAodmFsdWUgPCAwKSB7XG4gICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID4gMSkge1xuICAgICAgICAgIHZhbHVlID0gMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgfVxuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgICAgIF9hdWRpb0VuZ2luZS5zZXRWb2x1bWUoYXVkaW9JRCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGVUaGlzLnZvbHVtZSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG4gICAgICByZXR1cm4gcHJpdmF0ZVRoaXMgPyBwcml2YXRlVGhpcy52b2x1bWUgOiAxO1xuICAgIH1cbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInNyY1wiLCB7XG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcbiAgICAgIGlmICghcHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIG9sZFNyYyA9IHByaXZhdGVUaGlzLnNyYztcbiAgICAgIHByaXZhdGVUaGlzLnNyYyA9IHZhbHVlO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG4gICAgICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDAgJiYgX2F1ZGlvRW5naW5lLmdldFN0YXRlKGF1ZGlvSUQpID09PSBfU1RBVEUuUEFVU0VEICYmIG9sZFNyYyAhPT0gdmFsdWUpIHtcbiAgICAgICAgICBfYXVkaW9FbmdpbmUuc3RvcChhdWRpb0lEKTtcbiAgICAgICAgICBwcml2YXRlVGhpcy5hdWRpb0lEID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBfYXVkaW9FbmdpbmUucHJlbG9hZCh2YWx1ZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHNlbGYuc3JjID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICBfZGlzcGF0Y2hDYWxsYmFjayhzZWxmLCBfQ0FOUExBWV9DQUxMQkFDSyk7XG4gICAgICAgICAgICAgIGlmIChzZWxmLmF1dG9wbGF5KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcbiAgICAgIHJldHVybiBwcml2YXRlVGhpcyA/IHByaXZhdGVUaGlzLnNyYyA6IFwiXCI7XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiZHVyYXRpb25cIiwge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgICAgIHJldHVybiBfYXVkaW9FbmdpbmUuZ2V0RHVyYXRpb24oYXVkaW9JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBOYU47XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCgpIHt9XG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJjdXJyZW50VGltZVwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG4gICAgICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuICAgICAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIF9hdWRpb0VuZ2luZS5nZXRDdXJyZW50VGltZShhdWRpb0lEKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCgpIHt9XG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJwYXVzZWRcIiwge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgICAgIHJldHVybiBfYXVkaW9FbmdpbmUuZ2V0U3RhdGUoYXVkaW9JRCkgPT09IF9TVEFURS5QQVVTRUQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQoKSB7fVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiYnVmZmVyZWRcIiwge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgICAgIHJldHVybiBfYXVkaW9FbmdpbmUuZ2V0QnVmZmVyZWQoYXVkaW9JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQoKSB7fVxuICB9KTtcbn1cbnZhciBfcHJvdG90eXBlID0gSW5uZXJBdWRpb0NvbnRleHQucHJvdG90eXBlO1xuX3Byb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG4gIGlmIChwcml2YXRlVGhpcykge1xuICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcbiAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICBfYXVkaW9FbmdpbmUuc3RvcChhdWRpb0lEKTtcbiAgICAgIHByaXZhdGVUaGlzLmF1ZGlvSUQgPSAtMTtcbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9TVE9QX0NBTExCQUNLKTtcbiAgICB9XG4gICAgcHJpdmF0ZVRoaXNbX0NBTlBMQVlfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX0VOREVEX0NBTExCQUNLXSA9IFtdO1xuICAgIHByaXZhdGVUaGlzW19FUlJPUl9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfUEFVU0VfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX1BMQVlfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX1NFRUtFRF9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfU0VFS0lOR19DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfU1RPUF9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfVElNRV9VUERBVEVfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX1dBSVRJTkdfQ0FMTEJBQ0tdID0gW107XG4gICAgY2xlYXJJbnRlcnZhbChwcml2YXRlVGhpcy5pbnRlcnZhbElEKTtcbiAgfVxufTtcbl9wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuICBpZiAoIXByaXZhdGVUaGlzKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBzcmMgPSBwcml2YXRlVGhpcy5zcmM7XG4gIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcbiAgaWYgKHR5cGVvZiBzcmMgIT09IFwic3RyaW5nXCIgfHwgc3JjID09PSBcIlwiKSB7XG4gICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX0VSUk9SX0NBTExCQUNLLCBbe1xuICAgICAgZXJyTXNnOiBcImludmFsaWQgc3JjXCIsXG4gICAgICBlcnJDb2RlOiBfRVJST1JfQ09ERS5FUlJPUl9GSUxFXG4gICAgfV0pO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgaWYgKF9hdWRpb0VuZ2luZS5nZXRTdGF0ZShhdWRpb0lEKSA9PT0gX1NUQVRFLlBBVVNFRCkge1xuICAgICAgX2F1ZGlvRW5naW5lLnJlc3VtZShhdWRpb0lEKTtcbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9QTEFZX0NBTExCQUNLKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgX2F1ZGlvRW5naW5lLnN0b3AoYXVkaW9JRCk7XG4gICAgICBwcml2YXRlVGhpcy5hdWRpb0lEID0gLTE7XG4gICAgfVxuICB9XG4gIGF1ZGlvSUQgPSBfYXVkaW9FbmdpbmUucGxheShzcmMsIHRoaXMubG9vcCwgdGhpcy52b2x1bWUpO1xuICBpZiAoYXVkaW9JRCA9PT0gLTEpIHtcbiAgICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfRVJST1JfQ0FMTEJBQ0ssIFt7XG4gICAgICBlcnJNc2c6IFwidW5rbm93blwiLFxuICAgICAgZXJyQ29kZTogX0VSUk9SX0NPREUuRVJST1JfVU5LTk9XTlxuICAgIH1dKTtcbiAgICByZXR1cm47XG4gIH1cbiAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IGF1ZGlvSUQ7XG4gIGlmIChwcml2YXRlVGhpcy5zZWVrUG9zaXRpb24gPj0gMCkge1xuICAgIF9hdWRpb0VuZ2luZS5zZXRDdXJyZW50VGltZShhdWRpb0lELCBwcml2YXRlVGhpcy5zZWVrUG9zaXRpb24pO1xuICAgIHByaXZhdGVUaGlzLnNlZWtQb3NpdGlvbiA9IC0xO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgdGhpcy5zdGFydFRpbWUgPT09IFwibnVtYmVyXCIgJiYgdGhpcy5zdGFydFRpbWUgPiAwKSB7XG4gICAgICBfYXVkaW9FbmdpbmUuc2V0Q3VycmVudFRpbWUoYXVkaW9JRCwgdGhpcy5zdGFydFRpbWUpO1xuICAgIH1cbiAgfVxuICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfV0FJVElOR19DQUxMQkFDSyk7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgX2F1ZGlvRW5naW5lLnNldENhblBsYXlDYWxsYmFjayhhdWRpb0lELCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNyYyA9PT0gc2VsZi5zcmMpIHtcbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHNlbGYsIF9DQU5QTEFZX0NBTExCQUNLKTtcbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHNlbGYsIF9QTEFZX0NBTExCQUNLKTtcbiAgICB9XG4gIH0pO1xuICBfYXVkaW9FbmdpbmUuc2V0V2FpdGluZ0NhbGxiYWNrKGF1ZGlvSUQsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc3JjID09PSBzZWxmLnNyYykge1xuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2soc2VsZiwgX1dBSVRJTkdfQ0FMTEJBQ0spO1xuICAgIH1cbiAgfSk7XG4gIF9hdWRpb0VuZ2luZS5zZXRFcnJvckNhbGxiYWNrKGF1ZGlvSUQsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc3JjID09PSBzZWxmLnNyYykge1xuICAgICAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IC0xO1xuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2soc2VsZiwgX0VSUk9SX0NBTExCQUNLKTtcbiAgICB9XG4gIH0pO1xuICBfYXVkaW9FbmdpbmUuc2V0RmluaXNoQ2FsbGJhY2soYXVkaW9JRCwgZnVuY3Rpb24gKCkge1xuICAgIGlmIChzcmMgPT09IHNlbGYuc3JjKSB7XG4gICAgICBwcml2YXRlVGhpcy5hdWRpb0lEID0gLTE7XG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayhzZWxmLCBfRU5ERURfQ0FMTEJBQ0spO1xuICAgIH1cbiAgfSk7XG59O1xuX3Byb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG4gICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgX2F1ZGlvRW5naW5lLnBhdXNlKGF1ZGlvSUQpO1xuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX1BBVVNFX0NBTExCQUNLKTtcbiAgICB9XG4gIH1cbn07XG5fcHJvdG90eXBlLnNlZWsgPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuICBpZiAocHJpdmF0ZVRoaXMgJiYgdHlwZW9mIHBvc2l0aW9uID09PSBcIm51bWJlclwiICYmIHBvc2l0aW9uID49IDApIHtcbiAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG4gICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgX2F1ZGlvRW5naW5lLnNldEN1cnJlbnRUaW1lKGF1ZGlvSUQsIHBvc2l0aW9uKTtcbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9TRUVLSU5HX0NBTExCQUNLKTtcbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9TRUVLRURfQ0FMTEJBQ0spO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcml2YXRlVGhpcy5zZWVrUG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICB9XG4gIH1cbn07XG5fcHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcbiAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgIF9hdWRpb0VuZ2luZS5zdG9wKGF1ZGlvSUQpO1xuICAgICAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IC0xO1xuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX1NUT1BfQ0FMTEJBQ0spO1xuICAgIH1cbiAgfVxufTtcbl9wcm90b3R5cGUub2ZmQ2FucGxheSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb2ZmQ2FsbGJhY2sodGhpcywgX0NBTlBMQVlfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5fcHJvdG90eXBlLm9mZkVuZGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfRU5ERURfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5fcHJvdG90eXBlLm9mZkVycm9yID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfRVJST1JfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5fcHJvdG90eXBlLm9mZlBhdXNlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfUEFVU0VfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5fcHJvdG90eXBlLm9mZlBsYXkgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9QTEFZX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuX3Byb3RvdHlwZS5vZmZTZWVrZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9TRUVLRURfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5fcHJvdG90eXBlLm9mZlNlZWtpbmcgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9TRUVLSU5HX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuX3Byb3RvdHlwZS5vZmZTdG9wID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfU1RPUF9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcbl9wcm90b3R5cGUub2ZmVGltZVVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB2YXIgcmVzdWx0ID0gX29mZkNhbGxiYWNrKHRoaXMsIF9USU1FX1VQREFURV9DQUxMQkFDSywgY2FsbGJhY2spO1xuICBpZiAocmVzdWx0ID09PSAxKSB7XG4gICAgY2xlYXJJbnRlcnZhbChfd2Vha01hcC5nZXQodGhpcykuaW50ZXJ2YWxJRCk7XG4gIH1cbn07XG5fcHJvdG90eXBlLm9mZldhaXRpbmcgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9XQUlUSU5HX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuX3Byb3RvdHlwZS5vbkNhbnBsYXkgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX0NBTlBMQVlfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5fcHJvdG90eXBlLm9uRW5kZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX0VOREVEX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuX3Byb3RvdHlwZS5vbkVycm9yID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIF9FUlJPUl9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcbl9wcm90b3R5cGUub25QYXVzZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBfUEFVU0VfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5fcHJvdG90eXBlLm9uUGxheSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBfUExBWV9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcbl9wcm90b3R5cGUub25TZWVrZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX1NFRUtFRF9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcbl9wcm90b3R5cGUub25TZWVraW5nID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIFwic2Vla2luZ0NhbGxiYWNrc1wiLCBjYWxsYmFjayk7XG59O1xuX3Byb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX1NUT1BfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5fcHJvdG90eXBlLm9uVGltZVVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB2YXIgcmVzdWx0ID0gX29uQ2FsbGJhY2sodGhpcywgX1RJTUVfVVBEQVRFX0NBTExCQUNLLCBjYWxsYmFjayk7XG4gIGlmIChyZXN1bHQgPT09IDEpIHtcbiAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBpbnRlcnZhbElEID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHNlbGYpO1xuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCAmJiBfYXVkaW9FbmdpbmUuZ2V0U3RhdGUoYXVkaW9JRCkgPT09IF9TVEFURS5QTEFZSU5HKSB7XG4gICAgICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2soc2VsZiwgX1RJTUVfVVBEQVRFX0NBTExCQUNLKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElEKTtcbiAgICAgIH1cbiAgICB9LCA1MDApO1xuICAgIHByaXZhdGVUaGlzLmludGVydmFsSUQgPSBpbnRlcnZhbElEO1xuICB9XG59O1xuX3Byb3RvdHlwZS5vbldhaXRpbmcgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX1dBSVRJTkdfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5mdW5jdGlvbiBfZGVmYXVsdChBdWRpb0VuZ2luZSkge1xuICBpZiAoX2F1ZGlvRW5naW5lID09PSB1bmRlZmluZWQpIHtcbiAgICBfYXVkaW9FbmdpbmUgPSBPYmplY3QuYXNzaWduKHt9LCBBdWRpb0VuZ2luZSk7XG4gICAgT2JqZWN0LmtleXMoQXVkaW9FbmdpbmUpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgQXVkaW9FbmdpbmVbbmFtZV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBBdWRpb0VuZ2luZVtuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJBdWRpb0VuZ2luZS5cIiArIG5hbWUgKyBcIiBpcyBkZXByZWNhdGVkXCIpO1xuICAgICAgICAgIHJldHVybiBfYXVkaW9FbmdpbmVbbmFtZV0uYXBwbHkoQXVkaW9FbmdpbmUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIG5ldyBJbm5lckF1ZGlvQ29udGV4dCgpO1xufVxuO1xuXG59LHt9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvblNob3dcIiwgX3J0LCByYWwpO1xuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib25IaWRlXCIsIF9ydCwgcmFsKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9mZlNob3dcIiwgX3J0LCByYWwpO1xuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib2ZmSGlkZVwiLCBfcnQsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIxfV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwibG9hZFN1YnBhY2thZ2VcIiwgX3J0LCByYWwpO1xuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImVudlwiLCBfcnQsIHJhbCk7XG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJnZXRTeXN0ZW1JbmZvXCIsIF9ydCwgcmFsKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImdldFN5c3RlbUluZm9TeW5jXCIsIF9ydCwgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2pzYiA9IHdpbmRvdy5qc2I7XG5pZiAoIV9qc2IpIHtcbiAgX2pzYiA9IHt9O1xufVxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG52YXIgX3RvdWNoZXMgPSBbXTtcbnZhciBfZ2V0VG91Y2hJbmRleCA9IGZ1bmN0aW9uIF9nZXRUb3VjaEluZGV4KHRvdWNoKSB7XG4gIHZhciBlbGVtZW50O1xuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgX3RvdWNoZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgZWxlbWVudCA9IF90b3VjaGVzW2luZGV4XTtcbiAgICBpZiAodG91Y2guaWRlbnRpZmllciA9PT0gZWxlbWVudC5pZGVudGlmaWVyKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn07XG52YXIgX2NvcHlPYmplY3QgPSBmdW5jdGlvbiBfY29weU9iamVjdChmcm9tT2JqLCB0b09iamVjdCkge1xuICBmb3IgKHZhciBrZXkgaW4gZnJvbU9iaikge1xuICAgIGlmIChmcm9tT2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRvT2JqZWN0W2tleV0gPSBmcm9tT2JqW2tleV07XG4gICAgfVxuICB9XG59O1xudmFyIF9saXN0ZW5lck1hcCA9IHtcbiAgXCJ0b3VjaHN0YXJ0XCI6IFtdLFxuICBcInRvdWNobW92ZVwiOiBbXSxcbiAgXCJ0b3VjaGVuZFwiOiBbXSxcbiAgXCJ0b3VjaGNhbmNlbFwiOiBbXVxufTtcbmZ1bmN0aW9uIF9hZGRMaXN0ZW5lcihrZXksIHZhbHVlKSB7XG4gIHZhciBsaXN0ZW5lckFyciA9IF9saXN0ZW5lck1hcFtrZXldO1xuICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IGxpc3RlbmVyQXJyLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICBpZiAodmFsdWUgPT09IGxpc3RlbmVyQXJyW2luZGV4XSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBsaXN0ZW5lckFyci5wdXNoKHZhbHVlKTtcbn1cbmZ1bmN0aW9uIF9yZW1vdmVMaXN0ZW5lcihrZXksIHZhbHVlKSB7XG4gIHZhciBsaXN0ZW5lckFyciA9IF9saXN0ZW5lck1hcFtrZXldIHx8IFtdO1xuICB2YXIgbGVuZ3RoID0gbGlzdGVuZXJBcnIubGVuZ3RoO1xuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyArK2luZGV4KSB7XG4gICAgaWYgKHZhbHVlID09PSBsaXN0ZW5lckFycltpbmRleF0pIHtcbiAgICAgIGxpc3RlbmVyQXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG52YXIgX2hhc0RlbGxXaXRoID0gZmFsc2U7XG52YXIgX3N5c3RlbUluZm8gPSBfcnQuZ2V0U3lzdGVtSW5mb1N5bmMoKTtcbmlmICh3aW5kb3cuaW5uZXJXaWR0aCAmJiBfc3lzdGVtSW5mby53aW5kb3dXaWR0aCAhPT0gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgX2hhc0RlbGxXaXRoID0gdHJ1ZTtcbn1cbnZhciBfdG91Y2hFdmVudEhhbmRsZXJGYWN0b3J5ID0gZnVuY3Rpb24gX3RvdWNoRXZlbnRIYW5kbGVyRmFjdG9yeSh0eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY2hhbmdlZFRvdWNoZXMpIHtcbiAgICBpZiAodHlwZW9mIGNoYW5nZWRUb3VjaGVzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIF9hZGRMaXN0ZW5lcih0eXBlLCBjaGFuZ2VkVG91Y2hlcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0b3VjaEV2ZW50ID0gbmV3IFRvdWNoRXZlbnQodHlwZSk7XG4gICAgdmFyIGluZGV4O1xuICAgIGlmICh0eXBlID09PSBcInRvdWNoc3RhcnRcIikge1xuICAgICAgY2hhbmdlZFRvdWNoZXMuZm9yRWFjaChmdW5jdGlvbiAodG91Y2gpIHtcbiAgICAgICAgaW5kZXggPSBfZ2V0VG91Y2hJbmRleCh0b3VjaCk7XG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgX2NvcHlPYmplY3QodG91Y2gsIF90b3VjaGVzW2luZGV4XSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHRtcCA9IHt9O1xuICAgICAgICAgIF9jb3B5T2JqZWN0KHRvdWNoLCB0bXApO1xuICAgICAgICAgIF90b3VjaGVzLnB1c2godG1wKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInRvdWNobW92ZVwiKSB7XG4gICAgICBjaGFuZ2VkVG91Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGluZGV4ID0gX2dldFRvdWNoSW5kZXgoZWxlbWVudCk7XG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgX2NvcHlPYmplY3QoZWxlbWVudCwgX3RvdWNoZXNbaW5kZXhdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInRvdWNoZW5kXCIgfHwgdHlwZSA9PT0gXCJ0b3VjaGNhbmNlbFwiKSB7XG4gICAgICBjaGFuZ2VkVG91Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGluZGV4ID0gX2dldFRvdWNoSW5kZXgoZWxlbWVudCk7XG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgX3RvdWNoZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHZhciB0b3VjaGVzID0gW10uY29uY2F0KF90b3VjaGVzKTtcbiAgICB2YXIgX2NoYW5nZWRUb3VjaGVzID0gW107XG4gICAgY2hhbmdlZFRvdWNoZXMuZm9yRWFjaChmdW5jdGlvbiAodG91Y2gpIHtcbiAgICAgIHZhciBsZW5ndGggPSB0b3VjaGVzLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIF9pbmRleCA9IDA7IF9pbmRleCA8IGxlbmd0aDsgKytfaW5kZXgpIHtcbiAgICAgICAgdmFyIF90b3VjaCA9IHRvdWNoZXNbX2luZGV4XTtcbiAgICAgICAgaWYgKHRvdWNoLmlkZW50aWZpZXIgPT09IF90b3VjaC5pZGVudGlmaWVyKSB7XG4gICAgICAgICAgX2NoYW5nZWRUb3VjaGVzLnB1c2goX3RvdWNoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF9jaGFuZ2VkVG91Y2hlcy5wdXNoKHRvdWNoKTtcbiAgICB9KTtcbiAgICB0b3VjaEV2ZW50LnRvdWNoZXMgPSB0b3VjaGVzO1xuICAgIHRvdWNoRXZlbnQudGFyZ2V0VG91Y2hlcyA9IHRvdWNoZXM7XG4gICAgdG91Y2hFdmVudC5jaGFuZ2VkVG91Y2hlcyA9IF9jaGFuZ2VkVG91Y2hlcztcbiAgICBpZiAoX2hhc0RlbGxXaXRoKSB7XG4gICAgICB0b3VjaGVzLmZvckVhY2goZnVuY3Rpb24gKHRvdWNoKSB7XG4gICAgICAgIHRvdWNoLmNsaWVudFggLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgIHRvdWNoLmNsaWVudFkgLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgIHRvdWNoLnBhZ2VYIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB0b3VjaC5wYWdlWSAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgIH0pO1xuICAgICAgaWYgKHR5cGUgPT09IFwidG91Y2hjYW5jZWxcIiB8fCB0eXBlID09PSBcInRvdWNoZW5kXCIpIHtcbiAgICAgICAgX2NoYW5nZWRUb3VjaGVzLmZvckVhY2goZnVuY3Rpb24gKHRvdWNoKSB7XG4gICAgICAgICAgdG91Y2guY2xpZW50WCAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICB0b3VjaC5jbGllbnRZIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgIHRvdWNoLnBhZ2VYIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgIHRvdWNoLnBhZ2VZIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGxpc3RlbmVyQXJyID0gX2xpc3RlbmVyTWFwW3R5cGVdO1xuICAgIHZhciBsZW5ndGggPSBsaXN0ZW5lckFyci5sZW5ndGg7XG4gICAgZm9yICh2YXIgX2luZGV4MiA9IDA7IF9pbmRleDIgPCBsZW5ndGg7IF9pbmRleDIrKykge1xuICAgICAgbGlzdGVuZXJBcnJbX2luZGV4Ml0odG91Y2hFdmVudCk7XG4gICAgfVxuICB9O1xufTtcbmlmIChfcnQub25Ub3VjaFN0YXJ0KSB7XG4gIHJhbC5vblRvdWNoU3RhcnQgPSBfcnQub25Ub3VjaFN0YXJ0O1xuICByYWwub2ZmVG91Y2hTdGFydCA9IF9ydC5vZmZUb3VjaFN0YXJ0O1xufSBlbHNlIHtcbiAgX2pzYi5vblRvdWNoU3RhcnQgPSBfdG91Y2hFdmVudEhhbmRsZXJGYWN0b3J5KCd0b3VjaHN0YXJ0Jyk7XG4gIF9qc2Iub2ZmVG91Y2hTdGFydCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIF9yZW1vdmVMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgY2FsbGJhY2spO1xuICB9O1xuICByYWwub25Ub3VjaFN0YXJ0ID0gX2pzYi5vblRvdWNoU3RhcnQuYmluZChfanNiKTtcbiAgcmFsLm9mZlRvdWNoU3RhcnQgPSBfanNiLm9mZlRvdWNoU3RhcnQuYmluZChfanNiKTtcbn1cbmlmIChfcnQub25Ub3VjaE1vdmUpIHtcbiAgcmFsLm9uVG91Y2hNb3ZlID0gX3J0Lm9uVG91Y2hNb3ZlO1xuICByYWwub2ZmVG91Y2hNb3ZlID0gX3J0Lm9mZlRvdWNoTW92ZTtcbn0gZWxzZSB7XG4gIF9qc2Iub25Ub3VjaE1vdmUgPSBfdG91Y2hFdmVudEhhbmRsZXJGYWN0b3J5KCd0b3VjaG1vdmUnKTtcbiAgX2pzYi5vZmZUb3VjaE1vdmUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICBfcmVtb3ZlTGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgY2FsbGJhY2spO1xuICB9O1xuICByYWwub25Ub3VjaE1vdmUgPSBfanNiLm9uVG91Y2hNb3ZlLmJpbmQoX2pzYik7XG4gIHJhbC5vZmZUb3VjaE1vdmUgPSBfanNiLm9mZlRvdWNoTW92ZS5iaW5kKF9qc2IpO1xufVxuaWYgKF9ydC5vblRvdWNoQ2FuY2VsKSB7XG4gIHJhbC5vblRvdWNoQ2FuY2VsID0gX3J0Lm9uVG91Y2hDYW5jZWw7XG4gIHJhbC5vZmZUb3VjaENhbmNlbCA9IF9ydC5vZmZUb3VjaENhbmNlbDtcbn0gZWxzZSB7XG4gIF9qc2Iub25Ub3VjaENhbmNlbCA9IF90b3VjaEV2ZW50SGFuZGxlckZhY3RvcnkoJ3RvdWNoY2FuY2VsJyk7XG4gIF9qc2Iub2ZmVG91Y2hDYW5jZWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICBfcmVtb3ZlTGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBjYWxsYmFjayk7XG4gIH07XG4gIHJhbC5vblRvdWNoQ2FuY2VsID0gX2pzYi5vblRvdWNoQ2FuY2VsLmJpbmQoX2pzYik7XG4gIHJhbC5vZmZUb3VjaENhbmNlbCA9IF9qc2Iub2ZmVG91Y2hDYW5jZWwuYmluZChfanNiKTtcbn1cbmlmIChfcnQub25Ub3VjaEVuZCkge1xuICByYWwub25Ub3VjaEVuZCA9IF9ydC5vblRvdWNoRW5kO1xuICByYWwub2ZmVG91Y2hFbmQgPSBfcnQub2ZmVG91Y2hFbmQ7XG59IGVsc2Uge1xuICBfanNiLm9uVG91Y2hFbmQgPSBfdG91Y2hFdmVudEhhbmRsZXJGYWN0b3J5KCd0b3VjaGVuZCcpO1xuICBfanNiLm9mZlRvdWNoRW5kID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgX3JlbW92ZUxpc3RlbmVyKFwidG91Y2hlbmRcIiwgY2FsbGJhY2spO1xuICB9O1xuICByYWwub25Ub3VjaEVuZCA9IF9qc2Iub25Ub3VjaEVuZC5iaW5kKF9qc2IpO1xuICByYWwub2ZmVG91Y2hFbmQgPSBfanNiLm9mZlRvdWNoRW5kLmJpbmQoX2pzYik7XG59XG5cbn0se31dLDc6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcbnZhciBfbGlzdGVuZXJzID0gW107XG5yYWwuZGV2aWNlID0gcmFsLmRldmljZSB8fCB7fTtcbmlmIChfcnQub2ZmQWNjZWxlcm9tZXRlckNoYW5nZSkge1xuICBpZiAoX3J0Ll9jb21wYXRpYmxlTW9kZSA9PT0gMSkge1xuICAgIHZhciBfc3lzdGVtSW5mbyA9IF9ydC5nZXRTeXN0ZW1JbmZvU3luYygpO1xuICAgIHZhciBfaXNBbmRyb2lkID0gX3N5c3RlbUluZm8ucGxhdGZvcm0udG9Mb3dlckNhc2UoKSA9PT0gXCJhbmRyb2lkXCI7XG4gICAgdmFyIF9jb21wYXRpYmxlQWNjZWxlcm9tZXRlckNoYW5nZSA9IGZ1bmN0aW9uIF9jb21wYXRpYmxlQWNjZWxlcm9tZXRlckNoYW5nZShlKSB7XG4gICAgICBpZiAoX2lzQW5kcm9pZCkge1xuICAgICAgICBlLnggLz0gLTEwO1xuICAgICAgICBlLnkgLz0gLTEwO1xuICAgICAgICBlLnogLz0gLTEwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZS54IC89IDEwO1xuICAgICAgICBlLnkgLz0gMTA7XG4gICAgICAgIGUueiAvPSAxMDtcbiAgICAgIH1cbiAgICAgIF9saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgbGlzdGVuZXIoZSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBfb25BY2NlbGVyb21ldGVyQ2hhbmdlID0gX3J0Lm9uQWNjZWxlcm9tZXRlckNoYW5nZS5iaW5kKF9ydCk7XG4gICAgcmFsLm9uQWNjZWxlcm9tZXRlckNoYW5nZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHZhciBsZW5ndGggPSBfbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgKytpbmRleCkge1xuICAgICAgICAgIGlmIChsaXN0ZW5lciA9PT0gX2xpc3RlbmVyc1tpbmRleF0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgaWYgKF9saXN0ZW5lcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgX29uQWNjZWxlcm9tZXRlckNoYW5nZShfY29tcGF0aWJsZUFjY2VsZXJvbWV0ZXJDaGFuZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgX29mZkFjY2VsZXJvbWV0ZXJDaGFuZ2UgPSBfcnQub2ZmQWNjZWxlcm9tZXRlckNoYW5nZS5iaW5kKF9ydCk7XG4gICAgcmFsLm9mZkFjY2VsZXJvbWV0ZXJDaGFuZ2UgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgIHZhciBsZW5ndGggPSBfbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgICAgaWYgKGxpc3RlbmVyID09PSBfbGlzdGVuZXJzW2luZGV4XSkge1xuICAgICAgICAgIF9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICBpZiAoX2xpc3RlbmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIF9vZmZBY2NlbGVyb21ldGVyQ2hhbmdlKF9jb21wYXRpYmxlQWNjZWxlcm9tZXRlckNoYW5nZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICByYWwub25BY2NlbGVyb21ldGVyQ2hhbmdlID0gX3J0Lm9uQWNjZWxlcm9tZXRlckNoYW5nZS5iaW5kKF9ydCk7XG4gICAgcmFsLm9mZkFjY2VsZXJvbWV0ZXJDaGFuZ2UgPSBfcnQub2ZmQWNjZWxlcm9tZXRlckNoYW5nZS5iaW5kKF9ydCk7XG4gIH1cbiAgcmFsLnN0b3BBY2NlbGVyb21ldGVyID0gX3J0LnN0b3BBY2NlbGVyb21ldGVyLmJpbmQoX3J0KTtcbiAgdmFyIF9zdGFydEFjY2VsZXJvbWV0ZXIgPSBfcnQuc3RhcnRBY2NlbGVyb21ldGVyLmJpbmQoX3J0KTtcbiAgcmFsLnN0YXJ0QWNjZWxlcm9tZXRlciA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gX3N0YXJ0QWNjZWxlcm9tZXRlcihPYmplY3QuYXNzaWduKHtcbiAgICAgIHR5cGU6IFwiYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eVwiXG4gICAgfSwgb2JqKSk7XG4gIH07XG59IGVsc2Uge1xuICByYWwub25BY2NlbGVyb21ldGVyQ2hhbmdlID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgaWYgKHR5cGVvZiBsaXN0ZW5lciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gX2xpc3RlbmVycy5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICAgIGlmIChsaXN0ZW5lciA9PT0gX2xpc3RlbmVyc1tpbmRleF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIF9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuICByYWwub2ZmQWNjZWxlcm9tZXRlckNoYW5nZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHZhciBsZW5ndGggPSBfbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICBpZiAobGlzdGVuZXIgPT09IF9saXN0ZW5lcnNbaW5kZXhdKSB7XG4gICAgICAgIF9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgdmFyIF9zeXN0ZW1JbmZvMiA9IF9ydC5nZXRTeXN0ZW1JbmZvU3luYygpO1xuICB2YXIgX2lzQW5kcm9pZDIgPSBfc3lzdGVtSW5mbzIucGxhdGZvcm0udG9Mb3dlckNhc2UoKSA9PT0gXCJhbmRyb2lkXCI7XG4gIGpzYi5kZXZpY2UuZGlzcGF0Y2hEZXZpY2VNb3Rpb25FdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBhY2NlbGVyYXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCBldmVudC5fYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG4gICAgaWYgKF9pc0FuZHJvaWQyKSB7XG4gICAgICBhY2NlbGVyYXRpb24ueCAvPSAtMTA7XG4gICAgICBhY2NlbGVyYXRpb24ueSAvPSAtMTA7XG4gICAgICBhY2NlbGVyYXRpb24ueiAvPSAtMTA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjY2VsZXJhdGlvbi54IC89IDEwO1xuICAgICAgYWNjZWxlcmF0aW9uLnkgLz0gMTA7XG4gICAgICBhY2NlbGVyYXRpb24ueiAvPSAxMDtcbiAgICB9XG4gICAgX2xpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgbGlzdGVuZXIoe1xuICAgICAgICB4OiBhY2NlbGVyYXRpb24ueCxcbiAgICAgICAgeTogYWNjZWxlcmF0aW9uLnksXG4gICAgICAgIHo6IGFjY2VsZXJhdGlvbi56XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgcmFsLnN0b3BBY2NlbGVyb21ldGVyID0gZnVuY3Rpb24gKCkge1xuICAgIGpzYi5kZXZpY2Uuc2V0TW90aW9uRW5hYmxlZChmYWxzZSk7XG4gIH07XG4gIHJhbC5zdGFydEFjY2VsZXJvbWV0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAganNiLmRldmljZS5zZXRNb3Rpb25FbmFibGVkKHRydWUpO1xuICB9O1xufVxuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImdldEJhdHRlcnlJbmZvXCIsIF9ydCwgcmFsKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImdldEJhdHRlcnlJbmZvU3luY1wiLCBfcnQsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIxfV0sOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiZ2V0RmlsZVN5c3RlbU1hbmFnZXJcIiwgX3J0LCByYWwpO1xuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDEwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi91dGlsXCIpKTtcbnZhciBfZmVhdHVyZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL2ZlYXR1cmVcIikpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5pZiAod2luZG93LmpzYikge1xuICB3aW5kb3cucmFsID0gT2JqZWN0LmFzc2lnbih7fSwgd2luZG93LmpzYik7XG59IGVsc2Uge1xuICB3aW5kb3cucmFsID0ge307XG59XG5yZXF1aXJlKFwiLi9iYXNlL2xpZmVjeWNsZVwiKTtcbnJlcXVpcmUoXCIuL2Jhc2Uvc3VicGFja2FnZVwiKTtcbnJlcXVpcmUoXCIuL2Jhc2Uvc3lzdGVtLWluZm9cIik7XG5yZXF1aXJlKFwiLi9iYXNlL3RvdWNoLWV2ZW50XCIpO1xucmVxdWlyZShcIi4vZGV2aWNlL2FjY2VsZXJvbWV0ZXJcIik7XG5yZXF1aXJlKFwiLi9kZXZpY2UvYmF0dGVyeVwiKTtcbnJlcXVpcmUoXCIuL2ZpbGUvZmlsZS1zeXN0ZW0tbWFuYWdlclwiKTtcbnJlcXVpcmUoXCIuL2ludGVyZmFjZS9rZXlib2FyZFwiKTtcbnJlcXVpcmUoXCIuL2ludGVyZmFjZS93aW5kb3dcIik7XG5yZXF1aXJlKFwiLi9tZWRpYS9hdWRpb1wiKTtcbnJlcXVpcmUoXCIuL21lZGlhL3ZpZGVvXCIpO1xucmVxdWlyZShcIi4vbmV0d29yay9kb3dubG9hZFwiKTtcbnJlcXVpcmUoXCIuL3JlbmRlcmluZy9jYW52YXNcIik7XG5yZXF1aXJlKFwiLi9yZW5kZXJpbmcvd2ViZ2xcIik7XG5yZXF1aXJlKFwiLi9yZW5kZXJpbmcvZm9udFwiKTtcbnJlcXVpcmUoXCIuL3JlbmRlcmluZy9mcmFtZVwiKTtcbnJlcXVpcmUoXCIuL3JlbmRlcmluZy9pbWFnZVwiKTtcbmZvciAodmFyIGtleSBpbiBfZmVhdHVyZVtcImRlZmF1bHRcIl0pIHtcbiAgaWYgKGtleSA9PT0gXCJzZXRGZWF0dXJlXCIgfHwga2V5ID09PSBcInJlZ2lzdGVyRmVhdHVyZVByb3BlcnR5XCIgfHwga2V5ID09PSBcInVucmVnaXN0ZXJGZWF0dXJlUHJvcGVydHlcIikge1xuICAgIGNvbnRpbnVlO1xuICB9XG4gIGlmIChfZmVhdHVyZVtcImRlZmF1bHRcIl0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgIF91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhrZXksIF9mZWF0dXJlW1wiZGVmYXVsdFwiXSwgcmFsKTtcbiAgfVxufVxuXG59LHtcIi4uL2ZlYXR1cmVcIjoxLFwiLi4vdXRpbFwiOjIxLFwiLi9iYXNlL2xpZmVjeWNsZVwiOjMsXCIuL2Jhc2Uvc3VicGFja2FnZVwiOjQsXCIuL2Jhc2Uvc3lzdGVtLWluZm9cIjo1LFwiLi9iYXNlL3RvdWNoLWV2ZW50XCI6NixcIi4vZGV2aWNlL2FjY2VsZXJvbWV0ZXJcIjo3LFwiLi9kZXZpY2UvYmF0dGVyeVwiOjgsXCIuL2ZpbGUvZmlsZS1zeXN0ZW0tbWFuYWdlclwiOjksXCIuL2ludGVyZmFjZS9rZXlib2FyZFwiOjExLFwiLi9pbnRlcmZhY2Uvd2luZG93XCI6MTIsXCIuL21lZGlhL2F1ZGlvXCI6MTMsXCIuL21lZGlhL3ZpZGVvXCI6MTQsXCIuL25ldHdvcmsvZG93bmxvYWRcIjoxNSxcIi4vcmVuZGVyaW5nL2NhbnZhc1wiOjE2LFwiLi9yZW5kZXJpbmcvZm9udFwiOjE3LFwiLi9yZW5kZXJpbmcvZnJhbWVcIjoxOCxcIi4vcmVuZGVyaW5nL2ltYWdlXCI6MTksXCIuL3JlbmRlcmluZy93ZWJnbFwiOjIwfV0sMTE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9uS2V5Ym9hcmRJbnB1dFwiLCBfcnQsIHJhbCk7XG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvbktleWJvYXJkQ29uZmlybVwiLCBfcnQsIHJhbCk7XG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvbktleWJvYXJkQ29tcGxldGVcIiwgX3J0LCByYWwpO1xuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib2ZmS2V5Ym9hcmRJbnB1dFwiLCBfcnQsIHJhbCk7XG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvZmZLZXlib2FyZENvbmZpcm1cIiwgX3J0LCByYWwpO1xuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib2ZmS2V5Ym9hcmRDb21wbGV0ZVwiLCBfcnQsIHJhbCk7XG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJoaWRlS2V5Ym9hcmRcIiwgX3J0LCByYWwpO1xuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwic2hvd0tleWJvYXJkXCIsIF9ydCwgcmFsKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcInVwZGF0ZUtleWJvYXJkXCIsIF9ydCwgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSwxMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG52YXIgX29uV2luZG93UmVzaXplID0gX3J0Lm9uV2luZG93UmVzaXplO1xucmFsLm9uV2luZG93UmVzaXplID0gZnVuY3Rpb24gKGNhbGxCYWNrKSB7XG4gIF9vbldpbmRvd1Jlc2l6ZShmdW5jdGlvbiAoc2l6ZSkge1xuICAgIGNhbGxCYWNrKHNpemUud2lkdGggfHwgc2l6ZS53aW5kb3dXaWR0aCwgc2l6ZS5oZWlnaHQgfHwgc2l6ZS53aW5kb3dIZWlnaHQpO1xuICB9KTtcbn07XG53aW5kb3cucmVzaXplID0gZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLndhcm4oJ3dpbmRvdy5yZXNpemUoKSBpcyBkZXByZWNhdGVkJyk7XG59O1xuXG59LHt9XSwxMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF9pbm5lckNvbnRleHQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi9pbm5lci1jb250ZXh0XCIpKTtcbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIkF1ZGlvRW5naW5lXCIsIF9ydCwgcmFsKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImNyZWF0ZUlubmVyQXVkaW9Db250ZXh0XCIsIF9ydCwgcmFsLCBmdW5jdGlvbiAoKSB7XG4gIGlmIChfcnQuQXVkaW9FbmdpbmUpIHtcbiAgICByYWwuY3JlYXRlSW5uZXJBdWRpb0NvbnRleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gKDAsIF9pbm5lckNvbnRleHRbXCJkZWZhdWx0XCJdKShfcnQuQXVkaW9FbmdpbmUpO1xuICAgIH07XG4gIH1cbn0pO1xuXG59LHtcIi4uLy4uL2lubmVyLWNvbnRleHRcIjoyLFwiLi4vLi4vdXRpbFwiOjIxfV0sMTQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImNyZWF0ZVZpZGVvXCIsIF9ydCwgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSwxNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiZG93bmxvYWRGaWxlXCIsIF9ydCwgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSwxNjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG52YXIgX2ZlYXR1cmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi9mZWF0dXJlXCIpKTtcbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJjcmVhdGVDYW52YXNcIiwgX3J0LCByYWwsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZlYXR1cmVWYWx1ZSA9IFwidW5zdXBwb3J0ZWRcIjtcbiAgaWYgKGRvY3VtZW50ICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmZWF0dXJlVmFsdWUgPSBcIndyYXBwZXJcIjtcbiAgICByYWwuY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgfTtcbiAgfVxuICBfZmVhdHVyZVtcImRlZmF1bHRcIl0uc2V0RmVhdHVyZShcInJhbC5jcmVhdGVDYW52YXNcIiwgXCJzcGVjXCIsIGZlYXR1cmVWYWx1ZSk7XG59KTtcbnZhciBfcnRfZ2V0RmVhdHVyZSA9IF9ydC5nZXRGZWF0dXJlO1xudmFyIF9ydF9zZXRGZWF0dXJlID0gX3J0LnNldEZlYXR1cmU7XG5fZmVhdHVyZVtcImRlZmF1bHRcIl0ucmVnaXN0ZXJGZWF0dXJlUHJvcGVydHkoX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLkNBTlZBU19DT05URVhUMkRfVEVYVEJBU0VMSU5FX0FMUEhBQkVUSUMubmFtZSwgZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIF9ydF9nZXRGZWF0dXJlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgdmFsdWUgPSBfcnRfZ2V0RmVhdHVyZShfZmVhdHVyZVtcImRlZmF1bHRcIl0uQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfQUxQSEFCRVRJQy5uYW1lKTtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiBfZmVhdHVyZVtcImRlZmF1bHRcIl0uQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfQUxQSEFCRVRJQy5lbmFibGU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIF9mZWF0dXJlW1wiZGVmYXVsdFwiXS5GRUFUVVJFX1VOU1VQUE9SVDtcbn0sIHVuZGVmaW5lZCk7XG5fZmVhdHVyZVtcImRlZmF1bHRcIl0ucmVnaXN0ZXJGZWF0dXJlUHJvcGVydHkoX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLkNBTlZBU19DT05URVhUMkRfVEVYVEJBU0VMSU5FX0RFRkFVTFQubmFtZSwgZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIF9ydF9nZXRGZWF0dXJlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgdmFsdWUgPSBfcnRfZ2V0RmVhdHVyZShfZmVhdHVyZVtcImRlZmF1bHRcIl0uQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfREVGQVVMVC5uYW1lKTtcbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiBfZmVhdHVyZVtcImRlZmF1bHRcIl0uQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfREVGQVVMVC5hbHBoYWJldGljO1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLkNBTlZBU19DT05URVhUMkRfVEVYVEJBU0VMSU5FX0RFRkFVTFQuYm90dG9tO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBfZmVhdHVyZVtcImRlZmF1bHRcIl0uRkVBVFVSRV9VTlNVUFBPUlQ7XG59LCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBfcnRfc2V0RmVhdHVyZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgY2FzZSBfZmVhdHVyZVtcImRlZmF1bHRcIl0uQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfREVGQVVMVC5hbHBoYWJldGljOlxuICAgICAgICB2YWx1ZSA9IDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBfZmVhdHVyZVtcImRlZmF1bHRcIl0uQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfREVGQVVMVC5ib3R0b206XG4gICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBfcnRfc2V0RmVhdHVyZShfZmVhdHVyZVtcImRlZmF1bHRcIl0uQ0FOVkFTX0NPTlRFWFQyRF9URVhUQkFTRUxJTkVfREVGQVVMVC5uYW1lLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG5cbn0se1wiLi4vLi4vZmVhdHVyZVwiOjEsXCIuLi8uLi91dGlsXCI6MjF9XSwxNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwibG9hZEZvbnRcIiwgX3J0LCByYWwpO1xuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDE4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcbmlmICh3aW5kb3cuanNiICYmIGpzYi5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQpIHtcbiAgcmFsLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCA9IGpzYi5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQuYmluZChqc2IpO1xufSBlbHNlIGlmIChfcnQuc2V0UHJlZmVycmVkRnJhbWVzUGVyU2Vjb25kKSB7XG4gIHJhbC5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQgPSBfcnQuc2V0UHJlZmVycmVkRnJhbWVzUGVyU2Vjb25kLmJpbmQoX3J0KTtcbn0gZWxzZSB7XG4gIHJhbC5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5lcnJvcihcIlRoZSBzZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQgaXMgbm90IGRlZmluZSFcIik7XG4gIH07XG59XG5cbn0se31dLDE5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcbnZhciBfZmVhdHVyZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL2ZlYXR1cmVcIikpO1xuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImxvYWRJbWFnZURhdGFcIiwgX3J0LCByYWwpO1xuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiY3JlYXRlSW1hZ2VcIiwgX3J0LCByYWwsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZlYXR1cmVWYWx1ZSA9IFwidW5zdXBwb3J0ZWRcIjtcbiAgaWYgKGRvY3VtZW50ICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmZWF0dXJlVmFsdWUgPSBcIndyYXBwZXJcIjtcbiAgICByYWwuY3JlYXRlSW1hZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltYWdlXCIpO1xuICAgIH07XG4gIH1cbiAgX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLnNldEZlYXR1cmUoXCJyYWwuY3JlYXRlSW1hZ2VcIiwgXCJzcGVjXCIsIGZlYXR1cmVWYWx1ZSk7XG59KTtcblxufSx7XCIuLi8uLi9mZWF0dXJlXCI6MSxcIi4uLy4uL3V0aWxcIjoyMX1dLDIwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5pZiAod2luZG93Ll9fZ2wpIHtcbiAgdmFyIGdsID0gd2luZG93Ll9fZ2w7XG4gIHZhciBfZ2xUZXhJbWFnZTJEID0gZ2wudGV4SW1hZ2UyRDtcbiAgZ2wudGV4SW1hZ2UyRCA9IGZ1bmN0aW9uICh0YXJnZXQsIGxldmVsLCBpbnRlcm5hbGZvcm1hdCwgd2lkdGgsIGhlaWdodCwgYm9yZGVyLCBmb3JtYXQsIHR5cGUsIHBpeGVscykge1xuICAgIHZhciBhcmdjID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAoYXJnYyA9PT0gNikge1xuICAgICAgdmFyIGltYWdlID0gYm9yZGVyO1xuICAgICAgdHlwZSA9IGhlaWdodDtcbiAgICAgIGZvcm1hdCA9IHdpZHRoO1xuICAgICAgaWYgKGltYWdlIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xuICAgICAgICB2YXIgZXJyb3IgPSBjb25zb2xlLmVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgIF9nbFRleEltYWdlMkQuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yID0gZXJyb3I7XG4gICAgICAgIGdsLnRleEltYWdlMkRfaW1hZ2UodGFyZ2V0LCBsZXZlbCwgaW1hZ2UuX2ltYWdlTWV0YSk7XG4gICAgICB9IGVsc2UgaWYgKGltYWdlIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgICAgdmFyIF9lcnJvciA9IGNvbnNvbGUuZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgX2dsVGV4SW1hZ2UyRC5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBfZXJyb3I7XG4gICAgICAgIHZhciBjb250ZXh0MkQgPSBpbWFnZS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBnbC50ZXhJbWFnZTJEX2NhbnZhcyh0YXJnZXQsIGxldmVsLCBpbnRlcm5hbGZvcm1hdCwgZm9ybWF0LCB0eXBlLCBjb250ZXh0MkQpO1xuICAgICAgfSBlbHNlIGlmIChpbWFnZSBpbnN0YW5jZW9mIEltYWdlRGF0YSkge1xuICAgICAgICBfZ2xUZXhJbWFnZTJEKHRhcmdldCwgbGV2ZWwsIGludGVybmFsZm9ybWF0LCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0LCAwLCBmb3JtYXQsIHR5cGUsIGltYWdlLmRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgcGl4ZWwgYXJndW1lbnQgcGFzc2VkIHRvIGdsLnRleEltYWdlMkQhXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXJnYyA9PT0gOSkge1xuICAgICAgX2dsVGV4SW1hZ2UyRCh0YXJnZXQsIGxldmVsLCBpbnRlcm5hbGZvcm1hdCwgd2lkdGgsIGhlaWdodCwgYm9yZGVyLCBmb3JtYXQsIHR5cGUsIHBpeGVscyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJnbC50ZXhJbWFnZTJEOiBpbnZhbGlkIGFyZ3VtZW50IGNvdW50IVwiKTtcbiAgICB9XG4gIH07XG4gIHZhciBfZ2xUZXhTdWJJbWFnZTJEID0gZ2wudGV4U3ViSW1hZ2UyRDtcbiAgZ2wudGV4U3ViSW1hZ2UyRCA9IGZ1bmN0aW9uICh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCB3aWR0aCwgaGVpZ2h0LCBmb3JtYXQsIHR5cGUsIHBpeGVscykge1xuICAgIHZhciBhcmdjID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAoYXJnYyA9PT0gNykge1xuICAgICAgdmFyIGltYWdlID0gZm9ybWF0O1xuICAgICAgdHlwZSA9IGhlaWdodDtcbiAgICAgIGZvcm1hdCA9IHdpZHRoO1xuICAgICAgaWYgKGltYWdlIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xuICAgICAgICB2YXIgZXJyb3IgPSBjb25zb2xlLmVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgIF9nbFRleFN1YkltYWdlMkQuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yID0gZXJyb3I7XG4gICAgICAgIGdsLnRleFN1YkltYWdlMkRfaW1hZ2UodGFyZ2V0LCBsZXZlbCwgeG9mZnNldCwgeW9mZnNldCwgaW1hZ2UuX2ltYWdlTWV0YSk7XG4gICAgICB9IGVsc2UgaWYgKGltYWdlIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgICAgdmFyIF9lcnJvcjIgPSBjb25zb2xlLmVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgIF9nbFRleFN1YkltYWdlMkQuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yID0gX2Vycm9yMjtcbiAgICAgICAgdmFyIGNvbnRleHQyRCA9IGltYWdlLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIGdsLnRleFN1YkltYWdlMkRfY2FudmFzKHRhcmdldCwgbGV2ZWwsIHhvZmZzZXQsIHlvZmZzZXQsIGZvcm1hdCwgdHlwZSwgY29udGV4dDJEKTtcbiAgICAgIH0gZWxzZSBpZiAoaW1hZ2UgaW5zdGFuY2VvZiBJbWFnZURhdGEpIHtcbiAgICAgICAgX2dsVGV4U3ViSW1hZ2UyRCh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0LCBmb3JtYXQsIHR5cGUsIGltYWdlLmRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgcGl4ZWwgYXJndW1lbnQgcGFzc2VkIHRvIGdsLnRleEltYWdlMkQhXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXJnYyA9PT0gOSkge1xuICAgICAgX2dsVGV4U3ViSW1hZ2UyRCh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCB3aWR0aCwgaGVpZ2h0LCBmb3JtYXQsIHR5cGUsIHBpeGVscyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobmV3IEVycm9yKFwiZ2wudGV4SW1hZ2UyRDogaW52YWxpZCBhcmd1bWVudCBjb3VudCFcIikuc3RhY2spO1xuICAgIH1cbiAgfTtcbn1cblxufSx7fV0sMjE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgcmV0dXJuIF90eXBlb2YgPSBcImZ1bmN0aW9uXCIgPT0gdHlwZW9mIFN5bWJvbCAmJiBcInN5bWJvbFwiID09IHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIFwiZnVuY3Rpb25cIiA9PSB0eXBlb2YgU3ltYm9sICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9LCBfdHlwZW9mKG9iaik7IH1cbnZhciBfZGVmYXVsdCA9IHtcbiAgZXhwb3J0VG86IGZ1bmN0aW9uIGV4cG9ydFRvKG5hbWUsIGZyb20sIHRvLCBlcnJDYWxsYmFjaywgc3VjY2Vzc0NhbGxiYWNrKSB7XG4gICAgaWYgKF90eXBlb2YoZnJvbSkgIT09IFwib2JqZWN0XCIgfHwgX3R5cGVvZih0bykgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGNvbnNvbGUud2FybihcImludmFsaWQgZXhwb3J0VG86IFwiLCBuYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGZyb21Qcm9wZXJ0eSA9IGZyb21bbmFtZV07XG4gICAgaWYgKHR5cGVvZiBmcm9tUHJvcGVydHkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmICh0eXBlb2YgZnJvbVByb3BlcnR5ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9bbmFtZV0gPSBmcm9tUHJvcGVydHkuYmluZChmcm9tKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0b1tuYW1lXSwgZnJvbVByb3BlcnR5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvW25hbWVdID0gZnJvbVByb3BlcnR5O1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBzdWNjZXNzQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdG9bbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobmFtZSArIFwiIGlzIG5vdCBzdXBwb3J0IVwiKTtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfTtcbiAgICAgIGlmICh0eXBlb2YgZXJyQ2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBlcnJDYWxsYmFjaygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5cbn0se31dfSx7fSxbMTBdKTtcbiJdLCJmaWxlIjoicmFsLmpzIn0=
