"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = exports.unload = exports.load = void 0;
const load = function () {
};
exports.load = load;
const unload = function () {
};
exports.unload = unload;
const options = {
    dealFirst: {
        label: '首屏优化',
        default: true,
        render: {
            ui: 'ui-checkbox'
        }
    }
};
exports.configs = {
    'wechatgame': {
        hooks: './hooks',
        options
    },
    'bytedance-mini-game': {
        hooks: './hooks',
        options
    }
};
