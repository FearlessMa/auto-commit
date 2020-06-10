const child_process = require('child_process');
const fs = require('fs');

const s = fs.readFileSync('./test/git.sh').toString();
console.log('s: ', s);
// console.log('s: ', s.toString());
// const exec = child_process.execFile(s);
// const exec = child_process.spawn(s, { stdio: 'inherit', shell: true });
// const exec = child_process.execFile(s);

// exec.stdout.on('data', (err, stdout, stderr) => {
//   console.log('err: ', err);
//   console.log('stderr: ', stderr);
//   console.log('stdout: ', stdout);
// });
