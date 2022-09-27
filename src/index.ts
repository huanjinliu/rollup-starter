import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { program } from 'commander';
import pkg from '../package.json';
import isNonEmptyDir from './utils/is-nonempty-dir';
import build from './build';

program
  .name('rollup-starter')
  .description(pkg.description)
  .version('0.1.0', '-v, --version');

program
  .command('create [name]')
  .description('create project')
  .action(async (name: string) => {
    /**
     * 询问项目名称
     */
    const requireProjectName = async () => {
      const { name } = await inquirer
        .prompt<{ name: string }>([
          {
            type: 'input',
            name: 'name',
            message: `输入项目名`,
          }
        ])
      return name;
    };

    /**
     * 询问项目描述
     */
    const requireProjectDescription = async () => {
      const { description } = await inquirer
        .prompt<{ description: string }>([
          {
            type: 'input',
            name: 'description',
            message: `输入项目描述`,
          }
        ])
      return description;
    };

    /**
     * 取得当前项目文件夹根路径
     */
    const getProjectRootPath = async (projectName: string) => {
      const workplace = path.join(process.cwd(), `/${projectName}`);
      // 如果是非空文件夹将抛出错误提醒
      if (await isNonEmptyDir(workplace)) {
        throw new ReferenceError(`directory not empty`)
      }
      return workplace;
    };

    /**
     *  询问
     */
    const require = async (message: string, defaultValue: boolean = true) => {
      const { need } = await inquirer
        .prompt<{ need: boolean }>([
          {
            type: 'confirm',
            name: 'need',
            default: defaultValue,
            message,
          }
        ]);
      return need;
    };

    // 1.如果没有指向项目名,询问项目名
    const projectName = name ?? await requireProjectName(); 

    // 2.询问项目描述
    const description = await requireProjectDescription(); 

    // 3.取得当前项目文件夹根路径
    const rootPath = await getProjectRootPath(projectName);

    // 4.如果项目跟路径不存在，需要记录创建操作
    const isNeedCreateDir = !fs.existsSync(rootPath);

    // 执行构建命令
    await build({
      workplace: rootPath,
      projectName,
      description,
      newDir: isNeedCreateDir,
      // 是否使用pnpm
      pnpm: await require(`是否使用pnpm管理依赖?`, true),
      // 是否需要ts
      ts: await require(`是否使用Typescript?`, true),
      // 是否需要引入rollup的web服务
      webServer: await require(`是否需要开启web服务(默认端口8080)?`, false),
      // 是否需要eslint + perttier
      eslint: await require(`是否使用eslint控制代码格式(默认配套使用prettier)?`, false),
    });
  })

program.parse(process.argv);
