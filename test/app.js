#! /usr/bin/env node

const program = require('commander')
const inquirer = require('inquirer')
// const chalk = require('chalk')

program
  .command('module')
  .alias('m')
  .description('创建新的模块')
  .option('-a, --name [moduleName]', '模块名称')
  .action(option => {
    //     console.log('option: ', option);
    console.log('Hello World')
    const promps = [];
    promps.push({
      type: 'input',
      name: 'moduleName',
      message: "输入模块名:",
      validate: (input) => {
        if (!input) {
          return "必填";
        }
        return true;
      }
    })

    inquirer.prompt(promps).then(res=>{
      console.log('res: ', res);
    })
  })    //自定义帮助信息
  .on('--help', function () {
    console.log('  Examples:')
    console.log('')
    console.log('$ app module moduleName')
    console.log('$ app m moduleName')
  })


program.parse(process.argv)