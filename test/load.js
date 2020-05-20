const ora = require('ora');
const shell = require('shelljs');
const spinner = ora('Loading unicorns').start();

spinner.color = 'blue';
spinner.text = 'Loading rainbows';
// 动画样式
spinner.spinner = "weather";
// shell.exec('sleep 2 && find load.js');
// spinner.succeed();

// setTimeout(() => {
//   // spinner.stop();
//   spinner.succeed();
//   const r = spinner.isSpinning
//   console.log('r: ', r);
// }, 3000);

let time = null;
const load = () => {
  const aminStr = '123456';
  let i = 0;
  time = setInterval(() => {
    i = (++i) % aminStr.length;
    process.stdout.write('\r' + aminStr[i])
  }, 500)
}
// load();
shell.exec('cnpm i  eslint -D',(code)=>{
  console.log('code: ', code);
  // clearInterval(time)
  spinner.succeed();

});

// setTimeout(() => {
//   clearInterval(time)
// }, 3000)