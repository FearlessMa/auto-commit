#! /usr/bin/env node

const { echo, ls, exit, which, pwd, sed, cat } = require('shelljs');
const shell = require('shelljs');
const { err, infoBold, errBold, orange } = require('./util/chalk')
const inquirer = require('inquirer');

const promptList = [];
const release = "minor";
const nodeModules = "node_modules";

if (!which("git")) {
  echo(err('Sorry, this script requires git'));
  exit(1);
}

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

  if (res.versionNumber) {
    //  npm run releasealpha
    const pwd = shell.pwd('index.js').stdout;
    // const nodeModulesPath = 
    console.log('pwd: ', pwd);
    // shell.exec("npm run  release")
  }
})

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