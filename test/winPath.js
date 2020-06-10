#! /usr/bin/env node

const path = require('path');
// path.normalize 统一不同操作系统分隔符问题
const binPathMod = path.normalize('./node_modules/.bin');
console.log('binPathMod: ', binPathMod);

// path.find(binPathMod)