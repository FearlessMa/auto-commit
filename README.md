# git auto-commit

* 自动提交git commit
  * gitHook eslint 校验
  * prettier 格式化代码
  * changelog 自动生成
  * version 自动生成
  * git message 格式化

## 配置

```json
  {
    "commit":"auto-commit",
    "lint":"eslint src && lint-staged" // eslint 配置检查目录
  }
```

## 使用命令

* npm run commit

## git操作配置

* 默认使用git push origin currentBranch
  
* 使用其他方式需配置.auto-commit 文件

```json
{
  "pull":"",
  "push":"origin HEAD:refs/for/"  // git push origin HEAD:refs/for/currentBranch
}
```

## 其他说明

* eslint 默认配置为空
* 