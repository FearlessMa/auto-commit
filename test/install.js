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
const exec = (command, options = { silent: true }, fn) => shell.exec(command, options, fn)
/**
 * 异步exec
 *
 * @param {*} command string cmd指令
 * @param {boolean} [options={ silent: true }] object exec 配置
 * @param {*} fn async callback
 * @param {*} args other arguments
 * @returns Promise
 */
const asyncExec = (command, options = { silent: true }, fn, ...args) => {
  return new Promise((resolve, reject) => {
    try {
      shell.exec(command, options, (code, stdout, stderr) => {
        fn(code, stdout, stderr);
        resolve({ code, stdout, stderr, ...args })
      })
    } catch (err) {
      reject(err)
    }
  })
}


/**
 * loading
 *
 * @param {*} command
 * @param {string} [loadingOptions={ spinner: "dots" }] 
 * @param {*} fn callback,fn(instance,{code,stdout,stderr})
 * @returns asyncExec => Promise  
 */
const echoLoading = (command, loadingOptions = { spinner: "dots" }, fn) => {
  const loadingInstance = loading(loadingOptions);
  return asyncExec(
    command,
    { silent: true },
    (code, stdout, stderr) => { fn && fn(loadingInstance, { code, stdout, stderr }); },
    loadingInstance
  )
}
/**
 * 安装依赖
 *
 * @param {*} depName string
 */
// const installDep = async (depName) => {
//   const instance = loading({ text: "正在安装：" + infoBold(depName), spinner: "dots" });
//   const installTool = shell.which("cnpm") ? 'cnpm' : 'npm';
//   return new Promise((resolve) => {
//     exec(`${installTool} i ${depName} -D `, { silent: true },
//       (code, stdout, stderr) => {
//         resolve({ code, stdout, stderr });
//         instance.succeed(infoBold(depName) + ' 安装完成');
//       }
//     )
//   })
// }
// const installDep = async (depName) => {
//   const instance = loading({ text: "正在安装：" + infoBold(depName), spinner: "dots" });
//   const installTool = shell.which("cnpm") ? 'cnpm' : 'npm';
//   const command = `${installTool} i ${depName} -D `;
//   return asyncExec(command, { silent: true }, () => {
//     instance.succeed(infoBold(depName) + ' 安装完成');
//   })
// }
const installDep = async (depName) => {
  // const instance = loading({ text: "正在安装：" + infoBold(depName), spinner: "dots" });
  const loadingOpt = { text: "正在安装：" + infoBold(depName), spinner: "dots" };
  const installTool = shell.which("cnpm") ? 'cnpm' : 'npm';
  const command = `${installTool} i ${depName} -D `;
  return echoLoading(command, loadingOpt, (loadingIns) => {
    loadingIns.succeed(infoBold(depName) + ' 安装完成');
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
    !find(dirPath + "/" + dep.name) && pList.push(installDep.bind(null, dep.depName));
  });
  for (let i = 0; i < pList.length; i++) {
    const res = await pList[i]();
    console.log('res: ', res);
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

