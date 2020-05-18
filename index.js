#! /usr/bin/env node

const shell = require('shelljs');
const { err, info, infoBold, errBold, orange } = require('./util')
const inquirer = require('inquirer');
const path = require('path');
const fs = require("fs");

// const pwd = shell.pwd().stdout;
// const basePath = path.basename(pwd);
const promptList = [];
const binPathPro = "../.bin";
const binPathMod = "./node_modules/.bin";
const depList = [
  {
    name: "standard-version",
    depName: "standard-version"
  },
  {
    name: "conventional-changelog",
    depName: "conventional-changelog-cli"
  },
  {
    name: "git-cz",
    depName: "commitizen cz-conventional-changelog"
  },
  {
    name: "eslint",
    depName: "eslint"
  },
  {
    name: "husky-run",
    depName: "husky"
  },
  {
    name: "lint-staged",
    depName: "lint-staged"
  },
  {
    name: "prettier",
    depName: "prettier"
  },
  {
    name: "validate-commit-msg",
    depName: "validate-commit-msg"
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

const exec = (command, options = { silent: true }) => shell.exec(command, options)

/**
 * 寻找路径
 *
 * @param {*} path string
 */
const find = path => exec("find " + path).stdout;

/**
 * 安装依赖
 *
 * @param {*} depName string
 */
const installDep = (depName) => {
  console.log('depName: ', depName);
  const installTool = shell.which("cnpm") ? 'cnpm' : 'npm';
  process.exitCode = exec(`${installTool} i ${depName} -D `);
  if (process.exitCode.code == 0) {
    // loading.stop();
  }
  // exec(`${installTool} i ${depName} -D `, (code, stdout, stderr) => {
  //   console.log('stderr: ', stderr);
  //   console.log('stdout: ', stdout);
  //   console.log('code: ', code);
  //   loading.stop();
  // });
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
  // console.log('fileDesc: ', fileDesc);
  fs.writeFileSync('./' + fileDesc.fileName, fileDesc.fileContent)
  // console.log(' fileDesc.name: ', './' + fileDesc.name);
  // exec('touch '+fileDesc.name,function(){
  // })
}

const validateDepFile = (fileNameList) => {
  fileNameList.forEach(file => {
    !find(`${file.fileName}`) && createDepFile(file);
  })
}

/**
 * find bin 
 *
 * @returns path 
 */
const findBin = () => {
  const binDir = find(binPathPro);
  const binMod = find(binPathMod);
  if (!binDir && !binMod) {
    shell.echo(errBold("缺少依赖无法执行"));
    shell.exit(1);
  }
  return binDir ? binPathPro : binPathMod;
}

const binPath = findBin();

// 校验依赖
validateDeps(depList, binPath);
// 校验依赖文件
validateDepFile(fileNameList);


// const hasStandardVersion = !!find(binPath + "/standard-version");
const standardVersion = 'node ' + binPath + '/standard-version';
const standardVersionAlpha = 'node ' + binPath + '/standard-version  --prerelease alpha';
const changelog = 'node ' + binPath + "/conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
const lastTag = "git describe --tags `git rev-list --tags --max-count=1`";

// 获取当前分支
const { stdout } = exec("git symbolic-ref --short -q HEAD")
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
  /* 版本号操作 */
  if (res.versionNumber) {
    if (res.versionAlpha) {
      //  发布 alpha
      const msg = exec(standardVersionAlpha);
      shell.echo("alpha版本信息:\n" + infoBold(msg));
    } else {
      //  发布 release
      const msg = exec(standardVersion);
      shell.echo("版本信息:\n" + infoBold(msg));
    }
    const tag = exec(lastTag);
    shell.echo("最新版本号：\n" + infoBold(tag));
  } else {
    shell.echo(info("跳过版本号升级"))
  }

  /* changelog */

  if (res.changelog) {
    exec(changelog);
  } else {
    shell.echo(info("跳过changelog"))
  }


  /*  git commit */
  if (res.gitPush) {
    shell.exec("git add .");
    infoBold(require(path.join(process.cwd(), binPath) + '/git-cz'))
    shell.echo("\n");
    // exec("git pull");
    // exec("git push");
    // exec("git push --tags");
    process.on('exit', function () {
      const pullMsg = exec("git pull");
      shell.echo("\n pull：" + infoBold(pullMsg));
      pullMsg.stdout.on('data', function(){
        
        console.log('pullMsg:1223 ', pullMsg);
      })
      const pushMsg = exec("git push");
      shell.echo("\n push：" + infoBold(pushMsg.stderr));

      const tagMsg = exec("git push --tags");
      shell.echo("\n tags：" + infoBold(tagMsg.stderr));
    });
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
// const child = exec('node git-cz',function(code,stdout,stderr){
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