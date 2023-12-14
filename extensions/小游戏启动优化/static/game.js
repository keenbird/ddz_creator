const pf = globalThis.tt || globalThis.ks || globalThis.wx;
function __initApp() {  // init app
    globalThis.__wxRequire = require;  // FIX: require cannot work in separate engine 
    require('./web-adapter');
    const firstScreen = require('./first-screen');
    // Adapt for IOS, swap if opposite
    const info = pf.getSystemInfoSync();
    if (canvas) {
        var _w = canvas.width;
        var _h = canvas.height;
        if (info.screenWidth < info.screenHeight) {
            if (canvas.width > canvas.height) {
                _w = canvas.height;
                _h = canvas.width;
            }
        } else {
            if (canvas.width < canvas.height) {
                _w = canvas.height;
                _h = canvas.width;
            }
        }
        canvas.width = _w;
        canvas.height = _h;
    }
    // Adjust initial canvas size
    if (canvas && info.devicePixelRatio >= 2) { canvas.width *= info.devicePixelRatio; canvas.height *= info.devicePixelRatio; }

    let end = false;

    GameGlobal.onEngineLoad = function (progress) {
        if (progress === 1) {
            if (end) {
                firstScreen.end();
                return;
            }
            end = true;
        }
        firstScreen.setProgress(0.5 + progress * 0.5);
    };

    firstScreen.start('default', 'default', 'false').then(() => {
        if (pf.loadSubpackage) {
            const task = pf.loadSubpackage({
                name: 'engine',
                success: () => {
                    if (end) {
                        firstScreen.end();
                    }
                    end = true;
                }
            });
            task.onProgressUpdate((res) => {
                firstScreen.setProgress(0.5 * res.progress / 100);
            });
        } else {
            require('./subpackages/engine/game');
        }
    }).catch((err) => {
        console.error(err);
    });
}  // init app

// NOTE: on WeChat Android end, we can only get the correct screen size at the second tick of game.
var sysInfo = pf.getSystemInfoSync();
if (sysInfo.platform.toLocaleLowerCase() === 'android') {
    GameGlobal.requestAnimationFrame(__initApp);
} else {
    __initApp();
}