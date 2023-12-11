/**


// 配置信息
// package.json
{
    "contributions": {
        "assets": {
            "menu": {
                //对应方法所在的脚本
                "methods": "./dist/assets-menu.js",

                //菜单被创建时触发
                "createMenu": "onCreateMenu",

                //右键 “根目录” 时触发
                "dbMenu": "onDBMenu",

                //右键 “文件夹” 或者 “资源” 时触发
                "assetMenu": "onAssetMenu",

                //右键 “空白区域” 时触发
                "panelMenu": "onPanelMenu"
            }
        }
    }
}


*/