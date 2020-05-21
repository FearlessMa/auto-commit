#! /usr/bin/env node

const shell = require('shelljs');
const { err, info, infoBold, errBold, orange } = require('../util');
const { echoLoading, findBin, validateDepFile, validateDeps, exec, find, asyncExec } = require('../util/shell');
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




// const hasStandardVersion = !!find(binPath + "/standard-version");
const standardVersion = 'node ' + binPath + '/standard-version';
const standardVersionName = (versionName) => `node ${binPath}/standard-version --prerelease ${versionName}`;
const cmdChangelog = 'node ' + binPath + "/conventional-changelog -p angular -i CHANGELOG.md -s -r 0";
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
  type: "confirm",
  name: "versionNumber",
  message: orange("是否进行版本升级？"),
  // choices: [
  //   { name: "是", value: 1 },
  //   { name: "否", value: 0 },
  // ]
});
promptList.push({
  type: "list",
  name: "versionTest",
  message: orange("请选版本"),
  choices: [
    { name: "无选版本后缀", value: false },
    { name: "Stable(稳定版本)", value: "stable" },
    { name: "Alpha(内测版本)", value: "alpha" },
    { name: "Beta(公测版本)", value: "beta" },
    { name: "Gamma(测试版本)", value: "gamma" },
    { name: "RC(Release Candidate候选版本)", value: "rc" },
  ],
  when(answers) { // 当versionNumber 为true时 ，显示选择
    return answers.versionNumber
  }
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
promptList.push({
  type: "list",
  name: "gitPush",
  message: orange("是否进行版本提交?"),
  choices: [
    { name: "是", value: 1 },
    { name: "否", value: 0 },
  ]
});



// // 校验依赖
// validateDeps(depList, binPath);
// // 校验依赖文件
/**
 * git commit 
 *
 */
async function gitCommit() {
  // git pull
  await echoLoading(`git pull ${pull} ${branch}`, { text: "正在拉取最新" }, ({ loadingInstance, code, stdout, stderr }) => {
    loadingInstance.succeed("pull：" + infoBold(stderr))
  })
  // git push 
  if (!push.includes('/')) { push = push + " " }
  await echoLoading(`git push ${push}${branch}`, { text: "正在提交" }, ({ loadingInstance, code, stdout, stderr }) => {
    loadingInstance.succeed("push：" + infoBold(stderr))
  })
  // git push tags
  await echoLoading(`git push --tags`, { text: "正在提交tags" }, ({ loadingInstance, code, stdout, stderr }) => {
    loadingInstance.succeed("tags：" + infoBold(stderr))
  })
}

async function execCmd(inputCmdRes) {
  console.log('inputCmdRes: ', inputCmdRes);
  const { versionNumber, versionTest, changelog, gitPush } = inputCmdRes;
  /* 版本号操作 */
  if (versionNumber) {
    // 版本号增加后缀
    if (versionTest) {
      const command = standardVersionName(versionTest);
      await echoLoading(command, { text: "正在更新版本号" }, ({ loadingInstance, code, stdout, stderr }) => {
        loadingInstance.succeed("版本信息：\n" + infoBold(stderr))
      })
    } else {
      const command = standardVersion;
      await echoLoading(command, { text: "正在更新版本号" }, ({ loadingInstance, code, stdout, stderr }) => {
        loadingInstance.succeed("版本信息：\n" + infoBold(stdout))
      })
    }
    await echoLoading(lastTag, { text: "正在更新tag" }, ({ loadingInstance, code, stdout, stderr }) => {
      loadingInstance.succeed("最新tag：\n" + infoBold(stdout))
    })
  } else {
    shell.echo(info("跳过版本号升级"))
  }

  /* changelog */

  if (changelog) {
    await echoLoading(cmdChangelog, { text: "正在更新changelog" }, ({ loadingInstance, code, stdout, stderr }) => {
      loadingInstance.succeed(infoBold("changelog更新完成"))
    })
  } else {
    shell.echo(info("跳过changelog"))
  }

  // /*  git commit */
  if (gitPush) {
    const cmdAdd = "git add .";
    await echoLoading(cmdAdd, { text: "git add " }, ({ loadingInstance, code, stdout, stderr }) => {
      loadingInstance.succeed(infoBold("git add 完成"))
      // infoBold(require(path.join(process.cwd(), binPath) + '/git-cz'))
    })

    // gitCommit()

    const r = await new Promise((resolve, reject) => {
      const res = require(path.join(process.cwd(), binPath) + '/git-cz')
      console.log('res: ', res);
    })
    console.log('r: ', r);
    // try {
    //   await asyncExec(require(path.join(process.cwd(), binPath) + '/git-cz'), { silent: true }, (code, stdout, stderr) => {
    //     console.log('code: ', code);
    //   })
    // } catch (err) {
    //   console.log('err: ', err);
    // }
    gitCommit()
    // await asyncExec(, { silent: true }, (code, stdout, stderr) => {
    //   console.log('stderr: ', stderr);
    //   console.log('stdout: ', stdout);
    //   console.log('code: ', code);
    // })
    // shell.exec("git add .");
    // shell.echo("开始执行git-cz：");
    // infoBold(require(path.join(process.cwd(), binPath) + '/git-cz'))
    // process.on('exit', gitCommit);
  }
}

/**
 * cmd输入的结果操作
 *
 */
function chooseCMD() {
  inquirer.prompt(promptList).then(res => {
    execCmd(res)
    /* 版本号操作 */
    // if (res.versionNumber) {
    //   if (res.versionTest) {
    //     const versionName = res.versionTest;
    //     //  发布 release 版本
    //     const cmd = standardVersionName(versionName);
    //     const msg = exec(cmd);
    //     shell.echo("版本信息:\n" + infoBold(msg));
    //   } else {
    //     //  发布 版本
    //     const msg = exec(standardVersion);
    //     shell.echo("版本信息:\n" + infoBold(msg));
    //   }
    //   const tag = exec(lastTag);
    //   shell.echo("最新tag：\n" + infoBold(tag));
    // } else {
    //   shell.echo(info("跳过版本号升级"))
    // }

    /* changelog */

    // if (res.changelog) {
    //   exec(changelog);
    // } else {
    //   shell.echo(info("跳过changelog"))
    // }


    // /*  git commit */
    // if (res.gitPush) {
    //   shell.exec("git add .");
    //   shell.echo("开始执行git-cz：");
    //   infoBold(require(path.join(process.cwd(), binPath) + '/git-cz'))
    //   process.on('exit', gitCommit);
    // }
  })
}


async function init() {
  // 校验依赖
  await validateDeps(depList, binPath);
  // 校验依赖文件
  validateDepFile(fileNameList);
  chooseCMD()
}

init()