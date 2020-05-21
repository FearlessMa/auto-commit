# git auto-commit

* 自动提交git commit
  * gitHook eslint 校验
  * prettier 格式化代码
  * changelog 自动生成
  * version 自动生成
  * git message 格式化

## 安装

``` bash
  npm install @fearless-ma/auto-commit --save-dev
```

## 配置

```json
  {
    "commit":"auto-commit"
  }
```

## 使用命令

* npm run commit

## git操作配置

* 默认使用git push origin currentBranch
  
* 使用其他方式需配置.autocommitrc 文件

```json
{
  "pull":"",
  "push":"origin HEAD:refs/for/"  // git push origin HEAD:refs/for/currentBranch
}
```

## 其他说明

* eslint配置文件默认配置为空
* 