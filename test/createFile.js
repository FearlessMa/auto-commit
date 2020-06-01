const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
console.log('cwd: ', cwd);

// const fileNameList = [
//   { fileName: '.czrc', fileContent: `{ "path": "cz-conventional-changelog" }` },
//   {
//     fileName: '.huskyrc',
//     fileContent: `{
//     "hooks": {
//       "pre-commit": "lint-staged"
//     }
//   }`
//   },
//   {
//     fileName: '.lintstagedrc',
//     fileContent: `
//   {
//     "src/**/*.{js,jsx}": [
//       "eslint",
//       "prettier --write",
//       "eslint --fix",
//       "git add ."
//     ]
//   }
//   `
//   },
//   {
//     fileName: '.vcmrc',
//     fileContent: `{"commit-msg": "./validate-commit-msg.js"}`
//   },
//   { fileName: '.eslintrc.js', fileContent: `module.exports={}` }
// ];

const fileNameList = [
  '.czrc','.huskyrc','.lintstagedrc','.vcmrc','.eslintrc.js','.prettierrc.js'
]

const createDepFile = (filename) => {
  shell.echo('缺少配置文件：' + filename);
  const resolvePath = path.resolve(__dirname,'../data')
  console.log('resolvePath: ', resolvePath);
  const readStream = fs.createReadStream(
    path.resolve(__dirname, '../util/' + filename)
  );
  try {
    fs.statSync(resolvePath);
  } catch (err) {
    fs.mkdirSync(resolvePath);
  }
  const writeStream = fs.createWriteStream(
    cwd + '/test/data/' + filename
  );
  readStream.pipe(writeStream);
};

fileNameList.forEach((item) => {
  createDepFile(item);
});

module.exports = { fileNameList, createDepFile };
