
'use strict';

var Fs = require("fs");
var Path = require("path");

exports.onAfterBuild = function (options, result) {
	//包加载顺序
	// {
	// 	var applicationFile = Path.join(Editor.Project.path, "build/", options.outputName, "assets/src/application.js");
	// 	console.log("处理包加载顺序：", applicationFile);
	// 	let data = Fs.readFileSync(applicationFile, "utf8")
	// 	data = data.replace(/RESOURCES, MAIN/, "MAIN, RESOURCES")
	// 	Fs.writeFileSync(applicationFile, data);
	// 	console.log("处理包加载顺序：处理完成");
	// }
	//包内脚本加载顺序
    // {
	// 	var assetsMainRoot = Path.join(Editor.Project.path, "build/", options.outputName, "assets/assets/main");
	// 	var files = Fs.readdirSync(assetsMainRoot)
	// 	for (let index = 0; index < files.length; index++) {
	// 		var fileName = files[index]
	// 		if (fileName.match(/^index\.*\w*\.js$/)) {
	// 			var indexFile = Path.join(assetsMainRoot, fileName);
	// 			let data = Fs.readFileSync(indexFile, "utf8")
	// 			var oldScriptList = data.match(/System\.register\(\"chunks:\/\/\/_virtual\/main\",\[(\"[^\]]+\")\]/)
	// 			if (oldScriptList && oldScriptList[1]) {
	// 				data = data.replace(oldScriptList[1], oldScriptList[1].split(",").sort(function (a, b) {
	// 					return a.toLowerCase().localeCompare(b.toLowerCase());
	// 				}).join(","));
	// 				Fs.writeFileSync(indexFile, data);
	// 			}
	// 			break;
	// 		}
	// 	}
	// }
}
