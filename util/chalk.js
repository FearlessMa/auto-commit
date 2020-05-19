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