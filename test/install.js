const shell = require('shelljs')

const ora = require('ora');
/**
 * loading 设置
 *
 * @param {*} [option={}] default { color: "blue", text: "loading", spinner: "weather" }
 * @returns oraInstance
 */
const loading = (option = {}) => {
  const defaultOpt = { color: "blue", text: "", spinner: "weather" };
  const { color, text, spinner } = Object.assign({}, defaultOpt, option);
  const instance = ora(text).start();
  instance.color = color;
  instance.text = text;
  instance.spinner = spinner;
  return instance;
}
// spinner.succeed();
const chalk = require('chalk');
const err = chalk.redBright;
const errBold = chalk.redBright.bold;
const info = chalk.blueBright;
const infoBold = chalk.blueBright.bold;
const orange = chalk.rgb(255, 136, 0);
const orangeBold = chalk.rgb(255, 136, 0).bold;
const magenta = chalk.magentaBright;
const magentaBold = chalk.magentaBright.bold;


module.exports = { err, errBold, info, infoBold, orange, orangeBold, magenta, magentaBold };

const exec = (command, options = { silent: true }, fn) => shell.exec(command, options, fn)


const depList = [
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
];
/**
 * 安装依赖
 *
 * @param {*} depName string
 */
const installDep = async (depName) => {
  const instance = loading({ text: "正在安装：" + infoBold(depName), spinner: "dots" });
  const installTool = shell.which("cnpm") ? 'cnpm' : 'npm';
  return new Promise((resolve) => {
    exec(`${installTool} i ${depName} -D `, { silent: true },
      (code, stdout, stderr) => {
        resolve({ code, stdout, stderr });
        instance.succeed(infoBold(depName) + ' 安装完成');
      }
    )
  })
}

const find = path => exec("find " + path).stdout;

/**
 * 校验依赖是否安装  异步遍历器版本
 *
 * @param {*} [depNameList=[]] stringArray
 * @param {string} [dirPath=""] string
 */
// const validateDeps = async (depNameList, dirPath = "") => {
//   const pList = [];
//   depNameList.forEach((dep) => {
//     !find(dirPath + "/" + dep.name) && pList.push(installDep.bind(null, dep.depName));
//   });
//   pList[Symbol.iterator] = function () {
//     let i = 0;
//     console.log('this: ', this);
//     return {
//       next: () => {
//         // return i++ < this.length ? { done: false, value: this[i - 1] } : { done: true, value: undefined }
//         return i++ < this.length ? { done: false, value: this[i - 1]() } : { done: true, value: undefined }
//       }
//     }
//   }
//   for await (let item of pList) {
//     // item()
//     console.log('item: ', item);
//   }
// }
// const validateDeps = async (depNameList, dirPath = "") => {
//   depNameList[Symbol.iterator] = function () {
//     let i = 0;
//     return {
//       next: () => {
//         return i++ < this.length
//           ? {
//             done: false,
//             value: !find(dirPath + "/" + this[i - 1].name) && installDep(this[i - 1].depName)
//           }
//           : {
//             done: true,
//             value: undefined
//           }
//       }
//     }
//   }
//   for await (let item of depNameList) {
//     shell.echo(item.stderr)
//   }
// }

const validateDeps = async (depNameList, dirPath = "") => {
  const pList = [];
  depNameList.forEach((dep) => {
    console.log('dep.name: ', dep.name);
    !find(dirPath + "/" + dep.name) && pList.push(installDep.bind(null, dep.depName));
  });
  for (let i = 0; i < pList.length; i++) {
    console.log('validateDeps r: ', r);
    const r = await pList[i]();
  }
  return true;
}

validateDeps(depList).then(res => {
  console.log('res: ', res);

})

// const i = async () => {
//   const r1 = await installDep('eslint')
//   console.log('r1: ', r1);
//   const r2 = await installDep('react')
//   console.log('r2: ', r2);
//   const r3 = await installDep('vue')
//   console.log('r3: ', r3);
// }

// i()

