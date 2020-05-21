

const path = require('path');
const shell = require('shelljs');
const { findBin, exec } = require('../util/shell.js')
const binPath = findBin();

// require('/Users/mhc 1/Work/gitMessage/node_modules/.bin/git-cz')
// const nStr = `require('${path.join(process.cwd(), binPath)}/git-cz')`;
// const nStr = "require('/Users/mhc 1/Work/gitMessage/node_modules/.bin/git-cz')";
// console.log('nStr: ', nStr);

// exec('node', (code, stdout, stderr) => {
//   console.log('stdout: ', stdout);
//   console.log('stderr: ', stderr);
//   console.log('code: ', code);
// })

// shell.ln(path.join(process.cwd(), binPath)+'/git-cz', './lgc');
// exec('lgc', (code, stdout, stderr) => {
//   console.log('code: ', code);
// })