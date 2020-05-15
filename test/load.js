const ora = require('ora');

const spinner = ora('Loading unicorns').start();

spinner.color = 'blue';
spinner.text = 'Loading rainbows';
// 动画样式
spinner.spinner = "weather";
setTimeout(() => {
  // spinner.stop();
  spinner.succeed();
  const r = spinner.isSpinning
  console.log('r: ', r);
}, 3000);