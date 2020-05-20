
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

/**
 * 输出loading
 *
 * @param {*} command string 命令
 * @param {*} [loadingOptions={}]loading options
 * @param {*} fn 结果处理
 */
const echoLoading = (command, loadingOptions = { spinner: "dots" }, fn) => {
  const loadingInstance = loading(loadingOptions);
  // const execMsg =
  exec(command, { silent: true }, (code, stdout, stderr) => {
    fn && fn(loadingInstance, { code, stdout, stderr });
  });
}

const branch = 'dev';
const pull = 'origin';
let push = 'origin';

shell.exec('git add .');
shell.exec('git commit -m "test"');

echoLoading(`git pull ${pull} ${branch}`, { text: "正在拉取最新" }, (instance, msg) => {
  instance.succeed("pull：" + infoBold(msg.stderr))
})
if (!push.includes('/')) { push = push + " " }
echoLoading(`git push ${push}${branch}`, { text: "正在提交" }, (instance, msg) => {
  instance.succeed("push：" + infoBold(msg.stderr))
})
echoLoading(`git push --tags`, { text: "正在提交tags" }, (instance, msg) => {
  instance.succeed("tags：" + infoBold(msg.stderr))
})