"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAfterBuild = exports.throwError = void 0;
const mfs_1 = require("./mfs");
const constant_1 = require("./constant");
exports.throwError = true;
const adapterActualPlatform = ['bytedance-mini-game', 'wechatgame'];
const tempEngineFirst = `function end() {
    GameGlobal.onEngineLoad && GameGlobal.onEngineLoad(1);
    return Promise.resolve();
}

function setProgress(progress) {
    GameGlobal.onEngineLoad && GameGlobal.onEngineLoad(progress);
    return Promise.resolve();
}

function start() {
    return Promise.resolve();
}
module.exports = { start, end, setProgress };
`;
const onAfterBuild = async function (options, result) {
    var _a;
    const { platform, packages } = options;
    if (!adapterActualPlatform.includes(platform)) {
        return;
    }
    const packageOption = packages[constant_1.PACKAGE_NAME];
    if (!packageOption.dealFirst) {
        console.info(constant_1.PACKAGE_NAME, '小游戏首屏启动优化已关闭');
        return;
    }
    const { dest } = result;
    console.info(constant_1.PACKAGE_NAME, '小游戏首屏启动优化开始');
    // 首屏配置
    const cfgBgColor = await Editor.Profile.getProject(constant_1.PACKAGE_NAME, 'bgColor');
    let cfgImageFile = await Editor.Profile.getProject(constant_1.PACKAGE_NAME, 'imageFile');
    cfgImageFile = cfgImageFile.replace('project://', '');
    if ('' == cfgImageFile) {
        console.error('首屏图片没有设置');
        return;
    }
    cfgImageFile = (0, mfs_1.join)(Editor.Project.path, cfgImageFile);
    const cfgImageRatio = await Editor.Profile.getProject(constant_1.PACKAGE_NAME, 'imageRatio');
    const cfgImageMode = await Editor.Profile.getProject(constant_1.PACKAGE_NAME, 'imageMode');
    const cfgBarRatio = await Editor.Profile.getProject(constant_1.PACKAGE_NAME, 'barRatio');
    const cfgBarOffset = await Editor.Profile.getProject(constant_1.PACKAGE_NAME, 'barOffset');
    const cfgBarBgColor = await Editor.Profile.getProject(constant_1.PACKAGE_NAME, 'barBgColor');
    const cfgBarColor = await Editor.Profile.getProject(constant_1.PACKAGE_NAME, 'barColor');
    if (!(0, mfs_1.existsSync)(cfgImageFile)) {
        console.error('首屏图片路径错误');
        return;
    }
    const imageName = (0, mfs_1.basename)(cfgImageFile);
    // 覆盖first
    (0, mfs_1.writeFileSync)((0, mfs_1.join)(dest, 'first-screen.js'), tempEngineFirst);
    // 删除特定语句
    const gameJSStr = (0, mfs_1.readFileSync)((0, mfs_1.join)(dest, 'game.js'), 'utf-8').replace(`require('./web-adapter');`, `//require('./web-adapter');`);
    const gameIdx = gameJSStr.indexOf('if (canvas && window.devicePixelRatio >= 2)');
    let newGameJSStr = gameJSStr.slice(0, gameIdx) + '//' + gameJSStr.slice(gameIdx, gameJSStr.length);
    if (platform === 'bytedance-mini-game') {
        newGameJSStr = `const firstScreen = require('./first-screen');` + newGameJSStr;
        newGameJSStr = newGameJSStr.replace('application.start()', 'firstScreen.end().then(() => application.start())');
    }
    (0, mfs_1.writeFileSync)((0, mfs_1.join)(dest, 'game.js'), newGameJSStr);
    // 获取分包配置
    const gameConfig = JSON.parse((0, mfs_1.readFileSync)((0, mfs_1.join)(dest, 'game.json'), 'utf-8'));
    if (!gameConfig.subpackages) {
        gameConfig.subpackages = [];
    }
    // 覆盖文件夹
    const templatesPath = (0, mfs_1.join)(Editor.Project.path, 'build-templates', platform);
    // 首屏优化
    // 1. 移动引擎文件
    const enginePath = (0, mfs_1.join)(dest, 'subpackages', 'engine');
    // 复制脚本
    const files = (0, mfs_1.readdirAllSync)(dest);
    const templatesFiles = (0, mfs_1.existsSync)(templatesPath) ? (0, mfs_1.readdirAllSync)(templatesPath).map((item) => {
        return (0, mfs_1.relative)(templatesPath, item);
    }) : [];
    // 判断cocos-js是否被分包
    let isWASMSub = false;
    for (let i = 0; i < gameConfig.subpackages.length; i++) {
        if (gameConfig.subpackages[i].root.indexOf('cocos-js') !== -1) {
            isWASMSub = true;
            break;
        }
    }
    if (isWASMSub) {
        const all = (0, mfs_1.readdirSync)((0, mfs_1.join)(dest, 'cocos-js'));
        for (let i = 0; i < all.length; i++) {
            const dirPath = (0, mfs_1.join)(dest, 'cocos-js', all[i]);
            if (!(0, mfs_1.isDirectory)(dirPath)) {
                continue;
            }
            const files = (0, mfs_1.readdirAllSync)(dirPath);
            for (let j = 0; j < files.length; j++) {
                templatesFiles.push((0, mfs_1.relative)(dest, files[j]));
            }
        }
    }
    files.forEach((item) => {
        if ((0, mfs_1.extname)(item) !== '.js' && !item.endsWith('.js.map')) {
            return;
        }
        if ((0, mfs_1.basename)(item) === 'web-adapter.js') {
            return;
        }
        const relativePath = (0, mfs_1.relative)(dest, item);
        if (relativePath.indexOf('subpackages') === 0 || templatesFiles.indexOf(relativePath) !== -1) {
            return;
        }
        const newPath = (0, mfs_1.join)(enginePath, relativePath);
        (0, mfs_1.mkdirSync)((0, mfs_1.parse)(newPath).dir);
        (0, mfs_1.renameSync)(item, newPath);
    });
    (0, mfs_1.copySync)(cfgImageFile, (0, mfs_1.join)(dest, imageName));
    // 移动game.js
    (0, mfs_1.copySync)((0, mfs_1.join)(__dirname, '..', 'static', 'game.js'), (0, mfs_1.join)(dest, 'game.js'));
    // 处理first.js
    const firstJS = (0, mfs_1.readFileSync)((0, mfs_1.join)(__dirname, '..', 'static', 'first-screen.js'), 'utf-8')
        .replace('__BG_COLOR_R__', `${cfgBgColor[0]}/255`)
        .replace('__BG_COLOR_G__', `${cfgBgColor[1]}/255`)
        .replace('__BG_COLOR_B__', `${cfgBgColor[2]}/255`)
        .replace('__IMAGE_NAME__', `'${imageName}'`)
        .replace('__IMAGE_RATIO__', `${cfgImageRatio}`)
        .replace('__IMAGE_MODE__', `'${cfgImageMode}'`)
        .replace('__BAR_RATIO__', cfgBarRatio)
        .replace('__BAR_OFFSET__', cfgBarOffset)
        .replace('__BAR_COLOR_R__', `${cfgBarColor[0]}/255`)
        .replace('__BAR_COLOR_G__', `${cfgBarColor[1]}/255`)
        .replace('__BAR_COLOR_B__', `${cfgBarColor[2]}/255`)
        .replace('__BAR_COLOR_A__', `${cfgBarColor[3]}/255`)
        .replace('__BAR_BG_COLOR_R__', `${cfgBarBgColor[0]}/255`)
        .replace('__BAR_BG_COLOR_G__', `${cfgBarBgColor[1]}/255`)
        .replace('__BAR_BG_COLOR_B__', `${cfgBarBgColor[2]}/255`)
        .replace('__BAR_BG_COLOR_A__', `${cfgBarBgColor[3]}/255`);
    (0, mfs_1.writeFileSync)((0, mfs_1.join)(dest, 'first-screen.js'), firstJS);
    // 判断是否有引擎分离
    if ((_a = gameConfig.plugins) === null || _a === void 0 ? void 0 : _a.cocos) {
        (0, mfs_1.copySync)((0, mfs_1.join)(dest, 'cocos'), (0, mfs_1.join)(enginePath, 'cocos'));
        gameConfig.plugins.cocos.path = 'subpackages/engine/cocos';
    }
    let addSub = true;
    gameConfig.subpackages.forEach((item) => {
        if (item.name === 'engine') {
            addSub = false;
        }
    });
    if (addSub) {
        gameConfig.subpackages.push({ name: 'engine', root: 'subpackages/engine' });
        (0, mfs_1.writeFileSync)((0, mfs_1.join)(dest, 'game.json'), JSON.stringify(gameConfig));
    }
    console.info(constant_1.PACKAGE_NAME, '小游戏首屏启动优化结束');
};
exports.onAfterBuild = onAfterBuild;
