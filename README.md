## rollup-starter

> 为简化Rollup打包的工具库项目起始搭建过程而生的终端命令行工具（脚手架工具）。

如果你现在需要开发一个工具库，可以尝试使用它，它将根据你的需求快速搭建起Rollup起始项目。

为啥是Rollup，因为适合做工具库，所以如果想用来做复杂应用，那还是算了。

当前可以满足的需求：

* 想快速使用typescript写demo（这是我开发它的原因🤠）
* 多人开发？来点eslint + prettier
* 开发的工具库用于浏览器，需要一个浏览器测试环境

### Installation

`rollup-starter`名称被占用，所以只能使用`rolluper`作为包名。

```shell
npm install rolluper -g
```

### Usage

1）使用`create` 命令开始项目的搭建，项目名可选

```shell
rolluper create [project-name]
```

2）根据自己的项目需求选择回答项

```shell
? 输入项目描述 
? 是否使用pnpm管理依赖? <Yes> or No
? 是否使用Typescript? <Yes> or No
? 是否使用eslint控制代码格式(默认配套使用prettier) Yes or <No>
? 是否需要web服务(默认端口8080)? Yes or <No>
? 是否在搭建完开启web服务? Yes or <No>
```

3）等待项目自动搭建

```shell
✔ 创建项目文件夹
✔ 初始化项目package.json
✔ 安装Rollup项目必要依赖
✔ 安装babel相关依赖及写入配置
✔ 安装typescript相关依赖及写入配置
✔ 安装web服务相关依赖及写入配置
✔ 安装Eslint相关依赖及写入配置
✔ 生成src文件夹及入口文件
✔ 生成web文件夹及入口文件
✔ 生成rollup打包相关配置
✔ 更新package.json脚本命令
✔ 成功开启服务：本地（http://localhost:8080/） 远程访问（http://xxx.xxx.xx:8080/）
```

4）搭建完成后即可享用

