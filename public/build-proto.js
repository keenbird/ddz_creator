const fs = require('fs');
const ps = require('path');
const child_process = require("child_process");

const args = process.argv.slice(2);
console.log(args);
// 额外的命令
const cmds = args[0] ? args[0] : ""

console.log(__dirname);
//根目录
const rootPath = ps.join(__dirname, '..', 'Proto');
//源资源目录
const srcPath = ps.join(rootPath, 'src')
//格式化
var format = (tsContent,declareContent) => {
return `
${tsContent}
declare namespace proto {
${declareContent}
}
var proto = $root;
export default proto;
`;
}

var replace = (content,searchStr,replaceStr) => {
	const regex = new RegExp(searchStr, 'g');
	return content.replace(regex, replaceStr);
}

var js2tsFile = (jsContent,declareContent) => {
	//js 转 ts代码
	// 删除 "use strict";
	jsContent = replace(jsContent,'"use strict";',"")
	// 替换 var $protobuf = require("protobufjs/minimal");
    var searchStr = 'var \\$protobuf = require\\("protobufjs/minimal"\\);';
	var replaceStr = 'import $protobuf from "protobufjs/minimal.js";'; // 新的替换字符串
	jsContent = replace(jsContent,searchStr,replaceStr)
	// 替换 module.exports = $root;
	var searchStr = 'module\\.exports = \\$root';
	var replaceStr = ''; // 新的替换字符串
	jsContent = replace(jsContent,searchStr,replaceStr)
	return format(jsContent,declareContent);
}

var deleteFile = (path)=> {
	fs.unlink(path, (err) => {
	  if (err) {
		console.error(err);
		return;
	  }
	});
}


//可能的前缀
var prefix = [`plaza_`, `game_`];
//遍历文件夹
var pa = fs.readdirSync(srcPath);
pa.forEach((name, index) => {
	var file = ps.join(srcPath, name)
	var pa = fs.statSync(file)
	if (pa.isDirectory()) {
		console.log(``);
		var fileName = name;
		console.log(`start folder--> ${fileName}`);
		//生成js代码，--keep-case保持proto中的命名格式
		var jsFilePath = ps.join(rootPath, `${fileName}.js`);
		var protoFilesPath = ps.join(srcPath, name, `*.proto`).replace(/\\+/g, `/`);
		child_process.execSync(`pbjs ${cmds} -t static-module -w commonjs -o ${jsFilePath} ${protoFilesPath}`);
		//生成.d.ts申明文件
		var tsdFilePath = ps.join(rootPath, `${fileName}.d.ts`);
		child_process.execSync(`pbts --m -o ${tsdFilePath} ${jsFilePath}`);
		//生成ts文件
		var tsFilePath = ps.join(rootPath, `${fileName}.ts`);
		//申明文件内容
		var declareContent = fs.readFileSync(tsdFilePath, { encoding: 'utf8' })
		//js文件内容
		var jsContent = fs.readFileSync(jsFilePath, { encoding: 'utf8' })
		//调整编码格式
		fs.writeFileSync(tsFilePath, js2tsFile(jsContent,declareContent));
		//删除js 文件
		deleteFile(jsFilePath);
		//删除d.ts声明文件
		deleteFile(tsdFilePath);
		console.log(`--end--`);
	} else {
		console.log(``);
		if (name.endsWith(`.proto`)) {
			var regExp = new RegExp(`^(${prefix.join('|')})(\\w+)\.proto`);
			var fileName = name.replace(regExp, `$2`);
			console.log(`start file--> ${fileName}`);
			//生成js代码，--keep-case保持proto中的命名格式
			var jsFilePath = ps.join(rootPath, `${fileName}.js`);
			child_process.execSync(`pbjs ${cmds} -t static-module -w commonjs -o ${jsFilePath} ${file}`);
			//生成.d.ts申明文件
			var tsdFilePath = ps.join(rootPath, `${fileName}.d.ts`);
			child_process.execSync(`pbts --m -o ${tsdFilePath} ${jsFilePath}`);
			//生成ts文件
			var tsFilePath = ps.join(rootPath, `${fileName}.ts`);
			//申明文件内容
			var declareContent = fs.readFileSync(tsdFilePath, { encoding: 'utf8' })
			//js文件内容
			var jsContent = fs.readFileSync(jsFilePath, { encoding: 'utf8' })
			//调整编码格式
			fs.writeFileSync(tsFilePath, js2tsFile(jsContent,declareContent));
			//删除js 文件
			deleteFile(jsFilePath);
			//删除d.ts声明文件
			deleteFile(tsdFilePath);
			console.log(`--end--`);
		}
	}
});
console.log(``);
