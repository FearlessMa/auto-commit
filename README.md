
# git commit 

* 提交git message
  
``` bash
git add .
git cz
git pull
git push

```

feat 新功能

fix Bug 修复

docs 文档更新

style 代码的格式，标点符号的更新

refactor 代码重构

perf 性能优化

test 测试更新

build 构建系统或者包依赖更新

ci CI 配置，脚本文件等更新

chore 非 src 或者 测试文件的更新

revert commit 回退


* 生成changelog
  
``` bash
npm run changelog
```

* 自动增加版本号
  
``` bash
npm run release
```

* [版本号规则](https://semver.org/lang/zh-CN/)
  
主版本号：当你做了不兼容的 API 修改，
次版本号：当你做了向下兼容的功能性新增，
修订号：当你做了向下兼容的问题修正。





* 参考
  
[阮一峰commit message](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

[知乎](https://zhuanlan.zhihu.com/p/51894196)