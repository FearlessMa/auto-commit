const ora = require('ora');
/**
 * loading 设置
 *
 * @param {*} [option={}] default { color: "blue", text: "loading", spinner: "weather" }
 * @returns oraInstance
 */
const loadingStart = (option = {}) => {
  const defaultOpt = { color: "blue", text: "loading", spinner: "weather" };
  const { color, text, spinner } = Object.assign({}, defaultOpt, option);
  const instance = ora('').start();
  instance.color = color;
  instance.text = text;
  instance.spinner = spinner;
  return instance;
}
// spinner.succeed();

const loadingStop = instance => {
  instance.stop();
}


module.exports = { loadingStart, loadingStop }