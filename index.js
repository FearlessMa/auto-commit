#! /usr/bin/env node

const shell = require('shelljs');
const { err, info, infoBold, errBold, orange } = require('./util/chalk')
const inquirer = require('inquirer');
const path = require('path');
const fs = require("fs");

const pwd = shell.pwd().stdout;
const basePath = path.basename(pwd);
console.log('basePath: ', basePath);
const promptList = [];
const binPathPro = "../.bin";
const binPathMod = pwd + "/node_modules/.bin";
const depList = [
  {
    name: "standard-version",
    depName: ["standard-version"]
  },
  {
    name: "conventional-changelog",
    depName: ["conventional-changelog-cli"]
  },
  {
    name: "git-cz",
    depName: ["commitizen cz-conventional-changelog"]
  },
  {
    name: "eslint",
    depName: ["eslint"]
  },
  {
    name: "husky-run",
    depName: ["husky"]
  },
  {
    name: "lint-staged",
    depName: ["lint-staged"]
  },
  {
    name: "prettier",
    depName: ["prettier"]
  },
  {
    name: "validate-commit-msg",
    depName: ["validate-commit-msg"]
  },
];



const fileNameList = [
  { fileName: '.czrc', fileContent: `{ "path": "cz-conventional-changelog" }` },
  {
    fileName: '.huskyrc', fileContent: `{
    "hooks": {
      "pre-commit": "npm run lint"
    }
  }` },
  {
    fileName: '.lintstagedrc', fileContent: `
  {
    "src/**/*.{js,jsx}": [
      "prettier --tab-width 4 --write",
      "eslint --fix",
      "git add ."
    ]
  }
  ` },
  { fileName: '.vcmrc', fileContent: `{"commit-msg": "./validate-commit-msg.js"}` },
  { fileName: '.eslintrc.js', fileContent: `module.exports={}` }
]

if (!shell.which("git")) {
  shell.echo(err('Sorry, this script requires git'));
  shell.exit(1);
}
/**
 * 寻找路径
 *
 * @param {*} path string
 */
const find = path => shell.find(path).stdout;

/**
 * 安装依赖
 *
 * @param {*} depName string
 */
const installDep = depName => {
  const installTool = shell.which("cnpm") ? 'cnpm' : 'npm';
  console.log('installTool: ', installTool);
  shell.exec(`${installTool} i ${depName} -D `);
}

/**
 * 校验依赖是否安装
 *
 * @param {*} [depNameList=[]] stringArray
 * @param {string} [dirPath=""] string
 */
const validateDeps = (depNameList = [], dirPath = "") => {
  depNameList.forEach(dep => {
    !find(dirPath + "/" + dep.name) && installDep(dep.depName)
  })
}
/**
 * 创建依赖文件
 *
 * @param {*} fileDesc 文件名称
 */
const createDepFile = fileDesc => {
  // shell.touch(fileDesc.name);
  console.log('create')
  // console.log('fileDesc: ', fileDesc);
  fs.writeFileSync('./' + fileDesc.fileName, fileDesc.fileContent)
  // console.log(' fileDesc.name: ', './' + fileDesc.name);
  // shell.exec('touch '+fileDesc.name,function(){
  // })
}

const validateDepFile = (fileNameList) => {
  fileNameList.forEach(file => {
    !find(`${file.fileName}`) && createDepFile(file);
    console.log('find(`${file.fileName}`): ', find(`${file.fileName}`));
  })
}

/**
 * find bin 
 *
 * @returns path 
 */
const findBin = () => {
  const binDir = find(binPathPro);
  console.log('binDir: ', binDir);
  const binMod = find(binPathMod);
  console.log('binMod: ', binMod);
  if (!binDir && !binMod) {
    shell.echo(errBold("缺少依赖无法执行"));
    shell.exit(1);
  }
  return binDir ? binPathPro : binPathMod;
}

const binPath = findBin();

// 校验依赖
validateDeps(depList, binPath);
validateDepFile(fileNameList);


const hasStandardVersion = !!find(binPath + "/standard-version");
console.log('hasStandardVersion: ', hasStandardVersion);

const standardVersion = 'node ' + binPath + '/standard-version';
const standardVersionAlpha = 'node ' + binPath + '/standard-version  --prerelease alpha';
const changelog = 'node ' + binPath + "/conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
const lastTag = "git describe --tags `git rev-list --tags --max-count=1`";

// 获取当前分支
const { stdout } = shell.exec("git symbolic-ref --short -q HEAD", { silent: true })
const branch = stdout;
if (branch) {
  shell.echo(infoBold("当前分支：" + branch))
} else {
  shell.echo(errBold("无法找到当前分支：" + branch))
  shell.exit(1);
}

promptList.push({
  type: "list",
  name: "versionNumber",
  message: orange("是否进行版本升级？"),
  choices: [
    { name: "是", value: 1 },
    { name: "否", value: 0 },
  ]
});
promptList.push({
  type: "list",
  name: "versionAlpha",
  message: orange("是否是预发版本？"),
  choices: [
    { name: "是", value: 1 },
    { name: "否", value: 0 },
  ]
});
promptList.push({
  type: "list",
  name: "gitPush",
  message: orange("是否进行版本提交?"),
  choices: [
    { name: "是", value: 1 },
    { name: "否", value: 0 },
  ]
});
promptList.push({
  type: "list",
  name: "changelog",
  message: orange("是否更新changelog? "),
  choices: [
    { name: "是", value: 1 },
    { name: "否", value: 0 },
  ]
});



inquirer.prompt(promptList).then(res => {
  console.log('res: ', res);
  /* 版本号操作 */
  if (res.versionNumber) {
    if (res.versionAlpha) {
      //  发布 alpha
      shell.exec(standardVersionAlpha)
    } else {
      //  发布 release
      shell.exec(standardVersion)
    }
    shell.exec(lastTag)
  } else {
    shell.echo(info("跳过版本号升级"))
  }

  /* changelog */

  if (res.changelog) {
    shell.exec(changelog)
  } else {
    shell.echo(info("跳过changelog"))
  }

  /*  git commit */

  if (res.gitPush) {
    shell.exec("git add .");
    const cz = require(binPath + '/git-cz');
    console.log('cz: ', cz);
    // shell.exec("git cz ");
    const res = shell.exec("git pull");
    console.log('res: ', res);
    shell.exec("git push");
    shell.exec("git push --tags");
  }
}).finally(() => {
  console.log(infoBold("----end----"))
})

// program.parse(process.argv)


// const pwd = shell.pwd().stdout;
/* bin */
// if (!shell.which('git cz')) {
//   const binPathPro = "../.bin";
//   const binPathMod = "./node_modules/.bin";
//   const binDir = shell.find(binPathPro).stdout;
//   const binMod = shell.find(binPathMod).stdout;
//   if (!binDir && !binMod) {
//     shell.echo(errBold("无法找到cz命令"));
//     shell.exit(1);
//   }
//   console.log('binMod: ', binMod);
//   shell.echo(shell.which('git cz'))
//   const binPath = binDir ? binPathPro : binPathMod;
//   require(binPath + '/git-cz');
// }

// shell.ln('git-cz','/usr/local/lib/node_modus/.bin')
// const child = shell.exec('node git-cz',function(code,stdout,stderr){
//   console.log('stderr: ', stderr);
//   console.log('stdout: ', stdout);
//   console.log('code: ', code);

// })
// console.log('child: ', child);
// const ls = shell.ls('-d','node_modules')
// console.log('ls: ', ls);
// // console.log('nodeM: ', nodeM);
// console.log('pwd: ', pwd);


// shell.read()



// 异步
// child.stdout.on('data',d=>{
//   console.log('d: ', d);
// })
// console.log('a: ', child.stdout);


// echo(pwd())
// cd('../');
// echo(pwd())
// ls('./test/test.js').forEach(item => {
//   console.log('item: ', item);
//   // echo(item)
//   // sed('-i', 'BUILD_VERSION', 'v0.1.2', item);
//   // sed 修改文件
//   echo(sed('-i', /a/g, 'b', item))
//   var p = null;
//   p = shell.find(['./test/copy.js'])
//   shell.rm('-rf', p[0])
//   shell.touch('./test/copy.js')
//   // 打印 文件
//   echo(cat(item).to('./test/copy.js'))
// })
// shell.exit(0)
// 