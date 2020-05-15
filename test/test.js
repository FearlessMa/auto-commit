const path = require('path');
const shell = require('shelljs');
let rootName = path.basename(process.cwd())
console.log('dirname: ', path.dirname(process.cwd()));
console.log('shell: ', shell.pwd().stdout);
console.log('process.cwd(): ', process.cwd());
console.log('rootName: ', rootName);
