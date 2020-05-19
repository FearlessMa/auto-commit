#! /usr/bin/env node

const shell = require('shelljs');
const { err, info, infoBold, errBold, orange } = require('../util');
const { echoLoading, findBin, validateDepFile, validateDeps, exec, find } = require('../util/shell');
const inquirer = require('inquirer');
const path = require('path');
const fs = require("fs");

const promptList = [];
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
const autoCommit = '.auto-commit';
const binPath = findBin();

let branch = "";
// git  config
let pull = "origin";
let push = "origin";



if (!shell.which("git")) {
  shell.echo(err('Sorry, this script requires git'));
  shell.exit(1);
}

// 获取配置文件内容
if (find(autoCommit)) {
  const d = fs.readFileSync(autoCommit)
  const gitCommands = JSON.parse(d.toString());
  pull = gitCommands.pull ? gitCommands.pull : "origin";
  push = gitCommands.push ? gitCommands.push : "origin";
}


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
const branchObj = exec("git symbolic-ref --short -q HEAD")
branch = branchObj.stdout;
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
    shell.echo("开始执行git-cz：");
    infoBold(require(path.join(process.cwd(), binPath) + '/git-cz'))
    process.on('exit', function () {
      echoLoading(`git pull ${pull} ${branch}`, { text: "正在拉取最新" }, (instance, msg) => {
        instance.succeed("pull：" + infoBold(msg))
      })
      echoLoading(`git push ${push} ${branch}`, { text: "正在提交" }, (instance, msg) => {
        instance.succeed("push：" + infoBold(msg.stderr))
      })
      echoLoading(`git push --tags ${push}${branch}`, { text: "正在提交tags" }, (instance, msg) => {
        instance.succeed("tags：" + infoBold(msg.stderr))
      })
    });
  }
})
