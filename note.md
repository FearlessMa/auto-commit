
# git commit 

## 配置

```json
  {
    "commit":"autoCommit"
  }
```

## 使用命令 npm run commit

* 提交git message
  
``` bash
git add .
git cz
git pull
git push
```
* 说明
  * feat 新功能
  * fix Bug 修复
  * docs 文档更新
  * style 代码的格式，标点符号的更新
  * refactor 代码重构
  * perf 性能优化
  * test 测试更新
  * build 构建系统或者包依赖更新
  * ci CI 配置，脚本文件等更新
  * chore 非 src 或者 测试文件的更新
  * revert commit 回退

* 生成changelog
  
``` bash
npm run changelog
```

* 自动增加版本号
  
``` bash
npm run release
```

* [版本号规则](https://semver.org/lang/zh-CN/)
  -  主版本号：当你做了不兼容的 API 修改，
  - 次版本号：当你做了向下兼容的功能性新增，
  - 修订号：当你做了向下兼容的问题修正。


* husky
  * .huskyrc 配置，commit 钩子执行 eslint 或 格式化代码

* cz-conventional-changelog
  * .czrc 配置文件，Commitizen是一个撰写合格 Commit message 的工具。

* lint-staged
  * .lintstagedrc 配置文件,lint-staged 是一个在git暂存文件上运行linters的工具

*  validate-commit-msg 
   *  .vcmrc 配置文件，用于检查 Node 项目的 Commit message 是否符合格式。

```json
"lint-staged": {
    "src/**/*.{js,jsx}": [
      "prettier --tab-width 4 --write", //格式化代码
      "eslint --fix", // eslint 修复
      "git add" // 修复后重新增加
    ]
  }
```

* npm 发布

  * npm publish --access=public


* 参考
  
[阮一峰commit message](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

[知乎](https://zhuanlan.zhihu.com/p/51894196)

[使用 ESlint、lint-staged 半自动提升项目代码质量](https://www.jianshu.com/p/cdd749c624d9)

[chalk命令行颜色](https://github.com/chalk/chalk)
[node.js 命令行接口的完整解决方案，灵感来自 Ruby 的 commander。](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)
[shelljs](https://juejin.im/post/5cdb76166fb9a032196ef1ff)

[版本号语义化](https://www.jianshu.com/p/d306ed03de62)