
const shell = require('shelljs')
const { loading } = require('./ora')
const { errBold, infoBold, magentaBold } = require('./chalk');
const fs = require('fs');


const binPathPro = "../.bin";
const binPathMod = "./node_modules/.bin";

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
// const installDep = (depName) => {
//   const instance = loading({ spinner: "dots" });
//   shell.echo("正在安装：" + infoBold(depName))
//   const installTool = shell.which("cnpm") ? 'cnpm' : 'npm';
//   exec(`${installTool} i ${depName} -D `);
//   instance.succeed('安装完成');
// }
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

/**
 * 校验依赖是否安装
 *
 * @param {*} [depNameList=[]] stringArray
 * @param {string} [dirPath=""] string
 */
// const validateDeps = (depNameList = [], dirPath = "") => {
//   depNameList.forEach(async (dep) => {
//     const res = await !find(dirPath + "/" + dep.name) && installDep(dep.depName)
//     console.log('res: ', res);
//   })
// }

const validateDeps = async (depNameList, dirPath = "") => {
  const pList = [];
  depNameList.forEach((dep) => {
    !find(dirPath + "/" + dep.name) && pList.push(installDep.bind(null, dep.depName));
  });
  for (let i = 0; i < pList.length; i++) {
    await pList[i]();
    // console.log('r: ', r);
  }
}
/**
 * 创建依赖文件
 *
 * @param {*} fileDesc 文件名称
 */
const createDepFile = fileDesc => {
  shell.echo("缺少配置文件：" + magentaBold(fileDesc.fileName))
  fs.writeFileSync('./' + fileDesc.fileName, fileDesc.fileContent);
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

/**
 * 输出loading
 *
 * @param {*} command string 命令
 * @param {*} [loadingOptions={}]loading options
 * @param {*} fn 结果处理
 */
const echoLoading = (command, loadingOptions = {}, fn) => {
  const loadingInstance = loading(loadingOptions);
  const execMsg = exec(command);
  fn && fn(loadingInstance, execMsg)
}

module.exports = {
  echoLoading,
  findBin,
  validateDepFile,
  validateDeps,
  exec,
  find
}