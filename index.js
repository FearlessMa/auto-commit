#! /usr/bin/env node

const shell = require('shelljs');
const { err, info, infoBold, errBold, orange } = require('./util/chalk')
const inquirer = require('inquirer');

const promptList = [];
const release = "minor";
const nodeModules = "node_modules";

if (!shell.which("git")) {
  shell.echo(err('Sorry, this script requires git'));
  shell.exit(1);
}
/* bin path */
const binPathPro = "../.bin";
const binPathMod = "./node_modules/.bin";
const binDir = shell.find(binPathPro).stdout;
const binMod = shell.find(binPathMod).stdout;
if (!binDir && !binMod) {
  shell.echo(errBold("无法找到cz命令"));
  shell.exit(1);
}
// console.log('binMod: ', binMod);
// shell.echo(shell.which('git cz'))
const binPath = binDir ? binPathPro : binPathMod;
console.log('binPath: ', binPath);

const standardVersion = 'node ' + binPath + '/standard-version';
const standardVersionAlpha = 'node ' + binPath + '/standard-version  --prerelease alpha';
const changelog = 'node ' + binPath + "/conventional-changelog -p angular -i CHANGELOG.md -s -r 0"

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
    //  npm run releasealpha
    // const pwd = shell.pwd('index.js').stdout;
    // const nodeModulesPath = 
    // console.log('pwd: ', pwd);
    // shell.exec("npm run  release")
    shell.exec("git tag")
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
    require(binPath + '/git-cz');
    // shell.exec("git cz ");
    shell.exec("git pull");
    shell.exec("git push");
    shell.exec("git push --tags");
  }
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