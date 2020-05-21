

const path = require('path');
const shell = require('shelljs');
const { findBin, exec } = require('../util/shell.js')
const binPath = findBin();

shell.exec('git add .');
shell.exec('git commit -m "test"');

const aPath = path.join(process.cwd(), binPath);
// require('/Users/mhc 1/Work/gitMessage/node_modules/.bin/git-cz')
const nStr = `require('${path.join(process.cwd(), binPath)}/git-cz')`;
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

// exec('npm run cz', (code, stdout, stderr) => {
//   console.log('code: ', code);
// })
// shell.cd(aPath)
// shell.ls().forEach(item => {
//   console.log('item: ', item);
// })
// const res = shell.ShellString(require(path.join(process.cwd(), binPath) + '/git-cz'))
// console.log('res: ', res.cat());

const r = shell.exec('' + shell.ShellString(require(path.join(process.cwd(), binPath) + '/git-cz')), { silent: false }, (code, stdout, stderr) => {
  // console.log('stderr: ', stderr);
  // console.log('stdout: ', stdout);
  // console.log('code: ', code);
  // require('/git-cz')
  shell.echo(code)
})
console.log('r: ', r.code);

// r.ChildProcess.on('data', (code, stdout, stderr) => {
//   console.log('code: ', code);
// })