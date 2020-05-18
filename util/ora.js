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



module.exports = { loading }