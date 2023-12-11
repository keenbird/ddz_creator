# 例如 https://docs.cocos.com/creator/manual/zh/editor/publish/publish-in-command-line.html
...\CocosCreator.exe --project projectPath --build "platform=web-desktop;debug=true"

--project：必填，指定项目路径

--build：指定构建项目使用的参数

在 --build 后如果没有指定参数，则会使用 Cocos Creator 中 构建发布 面板当前的平台、模板等设置来作为默认参数。如果指定了其他参数设置，则会使用指定的参数来覆盖默认参数。可选择的参数有：
	configPath - 参数文件路径。如果定义了这个字段，那么构建时将会按照 json 文件格式来加载这个数据，并作为构建参数。这个参数可以自己修改也可以直接从构建面板导出，当配置和 configPath 内的配置冲突时，configPath 指定的配置将会被覆盖。
	logDest - 指定日志输出路径
	includedModules - 定制引擎打包功能模块，只打包需要的功能模块。具体有哪些功能模块可以参考引擎仓库根目录下 cc.config.json（GitHub | Gitee）文件中的 features 字段。
	outputName - 构建后生成的发布包文件夹名称。
	name - 游戏名称
	platform - 必填，构建的平台，具体名称参考面板上对应插件名称即可
	buildPath - 指定构建发布包生成的目录，默认为项目目录下的 build 目录。可使用绝对路径或者相对于项目的路径（例如 project://release）。从 v3.4.2 开始支持类似 ../ 这样的相对路径。
	startScene - 主场景的 UUID 值（参与构建的场景将使用上一次的编辑器中的构建设置），未指定时将使用参与构建场景的第一个
	scenes - 参与构建的场景信息，未指定时默认为全部场景，具体格式为：{}
	debug - 是否为 debug 模式，默认关闭
	replaceSplashScreen - 是否替换插屏，默认关闭
	md5Cache - 是否开启 md5 缓存，默认关闭
	mainBundleCompressionType - 主包压缩类型，具体选项值可参考文档 Asset Bundle — 压缩类型。
	mainBundleIsRemote - 配置主包为远程包
	packages - 各个插件支持的构建配置参数，需要存放的是对于数据对象的序列化字符串，具体可以参考下文。