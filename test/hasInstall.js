const hasInstall = PackageName => {
  try {
    require.resolve(PackageName);
    return true;
  } catch (err) {
    return false;
  }
};

const has = hasInstall("react");
console.log('has: ', has);
const has1 = hasInstall("shelljs");
console.log('has1: ', has1);


// const child_process = require('child_process');
// child_process.cwd()

console.log(process.cwd())