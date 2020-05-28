const glob = require('glob');
const path = require('path');
const PATHS = {
  src: path.join(__dirname, '../')
};
glob("*.js",(err,files) => {
  console.log('files: ', files);
  console.log('err: ', err);
})

const depList = [
  {
    name: "husky-run",
    depName: "husky"
  },
  {
    name: "lint-staged",
    depName: "lint-staged"
  },
  {
    name: "prettier",
    depName: "prettier"
  },
  { name:"",depName: ".eslintrc.js"}
];

depList.forEach(dep => {
  glob(`${PATHS.src}/${dep.name}`,(err,files) => {
    console.log('err: ', err);
    console.log('files: ', files);
  })
})