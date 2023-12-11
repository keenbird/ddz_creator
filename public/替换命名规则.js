const fs = require('fs');
const readline = require('readline');
const path = require('path');


const assertPath = './assets'; // 需要操作的文件夹路径
var searchWords = ['old_word1', 'old_word2']; // 需要替换的单词
var replaceWords  = ['old_word1', 'old_word2']; // 对应的驼峰规则
const inputFilePath = './Proto.js/common.d.ts';


function camelCase(string) {
  /**
   * 将字符串转换为驼峰命名法格式
   */
  const components = string.split('_');
  return components[0] + components.slice(1).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join('');
}

function getUnderscoreParams(inputFilePath) {
  const fileStream = fs.createReadStream(inputFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const underscoreParams = new Set();

  rl.on('line', line => {
    const matches = line.match(/\b[a-z0-9_]+_[a-z0-9_]+(?<!_s|_cs|_c)\b/g);
    if (matches) {
      matches.forEach(match => {
        underscoreParams.add(match);
      });
    }
  });

  rl.on('close', () => {
	replaceWords = Array.from(underscoreParams);
	searchWords = []
	replaceWords.forEach((string,i) => {
        searchWords[i] = (camelCase(string));
      });
	replaceInFolder(assertPath)
  });
}

getUnderscoreParams(inputFilePath);


// 遍历文件夹中的所有文件
function replaceInFolder(folderPath) {
	fs.readdirSync(folderPath).forEach(file => {
	  const filePath = path.join(folderPath, file);
	  // 如果是文件夹，则递归遍历子文件夹
	  if (fs.lstatSync(filePath).isDirectory()) {
		return replaceInFolder(filePath);
	  }
	  const extname = path.extname(filePath);
		if (extname === '.ts') {
		  // 读取文件内容
		  let content = fs.readFileSync(filePath, 'utf-8');
		  // 逐个替换需要替换的单词
		  searchWords.forEach((searchWord, i) => {
			content = content.replace(new RegExp(`\\b${searchWord}\\b`, 'g'), replaceWords[i]);
		  });
		  // 将替换后的内容写回文件
		  fs.writeFileSync(filePath, content, 'utf-8');
		}
	});
}
