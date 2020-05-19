# git commit

## 配置

```json
  {
    "commit":"auto-commit",
    "lint":"eslint src && lint-staged" // eslint
  }
```

## git操作

* 默认使用git push origin currentBranch
  
* 使用其他方式需配置.auto-commit 文件

```json
{
  "pull":"",
  "push":"origin HEAD:refs/for/"  // git push origin HEAD:refs/for/currentBranch
}
```

## 使用命令 npm run commit