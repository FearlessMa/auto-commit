const shell = require('shelljs');
const { loading } = require('./ora');
const { errBold, infoBold, magentaBold } = require('./chalk');
const fs = require('fs');
const path = require('path');
// path.normalize 统一不同操作系统分隔符问题
const binPathPro = path.normalize('../.bin');
const binPathMod = path.normalize('./node_modules/.bin');

const exec = (command, options = { silent: true }, fn) =>
  shell.exec(command, options, fn);

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
        resolve({ code, stdout, stderr, ...args });
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * 寻找路径
 *
 * @param {*} path string
 */
const find = (path) => exec('find ' + path).stdout;

/**
 * 判断是否安装
 *
 * @param {*} PackageName  string 包名
 * @returns boolean
 */
const hasInstall = (PackageName) => {
  try {
    require.resolve(PackageName);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * 安装依赖
 *
 * @param {*} depName string
 */
const installDep = async (depName) => {
  const loadingOpt = {
    text: '正在安装：' + infoBold(depName),
    spinner: 'dots'
  };
  const installTool = shell.which('cnpm') ? 'cnpm' : 'npm';
  const command = `${installTool} i ${depName} -D `;
  return echoLoading(command, loadingOpt, ({ loadingInstance }) => {
    loadingInstance.succeed(infoBold(depName) + ' 安装完成');
  });
};

/**
 * 校验依赖是否安装
 *
 * @param {*} [depNameList=[]] stringArray
 * @param {string} [dirPath=""] string
 */
const validateDeps = async (depNameList, dirPath = '') => {
  const pList = [];
  depNameList.forEach((dep) => {
    !hasInstall(path.join(process.cwd(), dirPath + '/' + dep.name)) &&
      pList.push(installDep.bind(null, dep.depName));
  });
  for (let i = 0; i < pList.length; i++) {
    await pList[i]();
  }
  return true;
};

/**
 * 创建依赖文件
 *
 * @param {*} fileDesc 文件名称
 */
// const createDepFile = fileDesc => {
//   shell.echo("缺少配置文件：" + magentaBold(fileDesc.fileName))
//   fs.writeFileSync('./' + fileDesc.fileName, fileDesc.fileContent);
// }

const createDepFile = (filename) => {
  shell.echo('缺少配置文件：' + magentaBold(filename));
  const readStream = fs.createReadStream(
    path.resolve(__dirname, '../lib/template/' + filename)
  );
  const writeStream = fs.createWriteStream(process.cwd() + '/' + filename);
  readStream.pipe(writeStream);
};

const validateDepFile = (fileNameList) => {
  fileNameList.forEach((file) => {
    !find(`${file.fileName}`) && createDepFile(file.fileName);
  });
};

/**
 * find bin
 *
 * @returns path
 */
const findBin = () => {
  const binDir = find(binPathPro);
  const binMod = find(binPathMod);
  if (!binDir && !binMod) {
    shell.echo(errBold('缺少依赖文件无法执行'));
    shell.exit(1);
  }
  return binDir ? binPathPro : binPathMod;
};

/**
 * loading
 *
 * @param {*} command
 * @param {string} [loadingOptions={ spinner: "dots" }]
 * @param {*} fn callback,fn(loadingInstance,{code,stdout,stderr})
 * @returns asyncExec => Promise
 */
const echoLoading = (command, loadingOptions = { spinner: 'dots' }, fn) => {
  const loadingInstance = loading(loadingOptions);
  return asyncExec(
    command,
    { silent: true },
    (code, stdout, stderr) => {
      fn && fn({ loadingInstance, code, stdout, stderr });
    },
    loadingInstance
  );
};
module.exports = {
  echoLoading,
  findBin,
  validateDepFile,
  validateDeps,
  exec,
  find,
  asyncExec
};
