import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import { camelCase } from 'camel-case';
import { createNPM } from './utils/npm';
import { createPackage } from './utils/pkg';
import exec from './utils/exec';
import { copyTemplateFile } from './utils/copy-file';
import getTemplatePath from './utils/get-template-path';
import { createTask } from './utils/create-task';
import { getIPv4 } from './utils/get-ip-address';

interface BuildOptions {
  /** 项目根路径 */
  workplace: string;
  /** 项目名 */
  projectName: string;
  /** 项目描述 */
  description: string;
  /**
   * 是否需要创建新项目文件夹
   * 如果当前路径存在同名空文件夹将直接使用
   */
  isNeedCreateDir: boolean;
  /** 是否使用TS */
  isUseTS: boolean;
  /** 是否使用eslint */
  isUseEslint: boolean;
  /** 是否使用pnpm代替npm */
  isUsePnpm: boolean;
  /** 是否使用web服务 */
  isNeedServe: boolean;
  /** 是否直接启动web服务 */
  isStartServe: boolean;
};


/**
 * 构建命令
 */
const build = async ({
  workplace,
  projectName,
  description,
  isNeedCreateDir,
  isUseTS,
  isUseEslint,
  isNeedServe,
  isUsePnpm,
  isStartServe,
}: BuildOptions) => {
  if (isNeedCreateDir) await createTask('创建项目文件夹')
    .run(async () => {
      await fs.promises.mkdir(workplace);
      // 进入项目文件夹
      shell.cd(projectName);
    });

  const pkg = createPackage(projectName, description);
  const npm = createNPM(isUsePnpm);

  await createTask('初始化项目package.json')
    .run(() => pkg.writeFile(workplace));

  await createTask('安装Rollup项目必要依赖')
    .run(async () => {
      await npm.add([
        'rollup',
        'rollup-plugin-clear',
        'rollup-plugin-terser',
        '@rollup/plugin-commonjs',
        '@rollup/plugin-node-resolve',
      ], { isDevDependencies: true });
    });

  await createTask('安装babel相关依赖及写入配置')
    .run(async () => {
      await npm.add([
        '@babel/core',
        '@babel/preset-env',
        '@rollup/plugin-babel',
      ], { isDevDependencies: true });

      await copyTemplateFile(
        getTemplatePath('babel/.babelrc.temp'),
        `${workplace}/.babelrc.json`,
      );
    });

  if (isUseTS) await createTask('安装typescript相关依赖及写入配置')
    .run(async () => {
      await npm.add([
        'typescript',
        'tslib',
        '@rollup/plugin-typescript'
      ], { isDevDependencies: true });

      await copyTemplateFile(
        getTemplatePath('ts/tsconfig.temp'),
        `${workplace}/tsconfig.json`,
        {
          brower: isNeedServe,
        }
      );
    });

  if (isNeedServe) await createTask('安装web服务相关依赖及写入配置')
    .run(async () => {
      await npm.add([
        'rollup-plugin-serve',
        'rollup-plugin-livereload',
      ], { isDevDependencies: true });

      // 创建public文件夹，默认以public文件夹中的html作为文档入口
      await fs.promises.mkdir(path.join(workplace, 'public'));
      // 创建html入口文件
      await copyTemplateFile(
        getTemplatePath(`html/index.temp`),
        `${workplace}/public/index.html`,
        {
          title: projectName,
          script: `./index.js`
        }
      );
    });

  if (isUseEslint) await createTask('安装Eslint相关依赖及写入配置')
    .run(async () => {
      await npm.add([
        'prettier',
        'eslint@^8.23.0',
        'eslint-config-prettier@^8.5.0',
        'eslint-plugin-prettier@^4.2.1',
        ...(isUseTS ? [
          "@typescript-eslint/parser@5.36.2",
          "@typescript-eslint/eslint-plugin@5.36.2",
        ]: [])
      ], { isDevDependencies: true });

      // 创建编辑器配置文件
      await copyTemplateFile(
        getTemplatePath(`editor/.editorconfig.temp`),
        `${workplace}/.editorconfig`,
      );
      // 创建prettier配置文件
      await copyTemplateFile(
        getTemplatePath(`prettier/.prettierrc.temp`),
        `${workplace}/.prettierrc`,
      );
      await copyTemplateFile(
        getTemplatePath(`prettier/.prettierignore.temp`),
        `${workplace}/.prettierignore`,
      );
      // 创建eslint配置文件
      await copyTemplateFile(
        getTemplatePath(`eslint/.eslintrc.temp`),
        `${workplace}/.eslintrc.js`,
        {
          ts: isUseTS,
          web: isNeedServe,
        }
      );
      await copyTemplateFile(
        getTemplatePath(`eslint/.eslintignore.temp`),
        `${workplace}/.eslintignore`,
      );
    });

  await createTask('生成src文件夹及入口文件')
    .run(async () => {
      await fs.promises.mkdir(path.join(workplace, 'src'));
      // 创建src入口文件
      const enterFileExt = isUseTS ? 'ts' : 'js';
      await copyTemplateFile(
        getTemplatePath(`${enterFileExt}/enter.temp`),
        `${workplace}/src/index.${enterFileExt}`,
      );
    });
  
  if (isNeedServe) await createTask('生成web文件夹及入口文件')
    .run(async () => {
      await fs.promises.mkdir(path.join(workplace, 'src/web'));
      // 创建web入口文件
      const enterFileExt = isUseTS ? 'ts' : 'js';
      await copyTemplateFile(
        getTemplatePath(`js/web-enter.temp`),
        `${workplace}/src/web/index.${enterFileExt}`,
        {
          libName: camelCase(projectName),
        }
      );
    });

  await createTask('生成rollup打包相关配置')
    .run(async () => {
      // 创建打包配置文件夹
      await fs.promises.mkdir(path.join(workplace, 'build'));
      // 创建基本打包配置文件
      await copyTemplateFile(
        getTemplatePath(`rollup/base.config.temp`),
        `${workplace}/build/base.build.js`,
        {
          ts: isUseTS,
          web: isNeedServe,
          libName: camelCase(projectName),
        }
      );
      // 如果需要web服务，创建web打包配置文件
      if (isNeedServe) await copyTemplateFile(
        getTemplatePath(`rollup/web.config.temp`),
        `${workplace}/build/web.build.js`,
        {
          ts: isUseTS,
          port: 8080,
          open: true,
        }
      );
      // 写入入口文件
      await pkg.update({
        [isNeedServe ? 'brower' : 'main']: `dist/${camelCase(projectName)}.js`,
        "module": `dist/${camelCase(projectName)}.esm.js`
      });
      // 创建最外层rollup.config.js文件
      await copyTemplateFile(
        getTemplatePath(`rollup/rollup.config.temp`),
        `${workplace}/rollup.config.js`,
        {
          web: isNeedServe,
        }
      );
    });

  await createTask('更新package.json脚本命令')
    .run(async () => {
      if (isNeedServe) await npm.add('cross-env', { isDevDependencies: true });

      const addScripts: Record<string, string> = {
        "dev": isNeedServe
          ? "cross-env NODE_ENV=development npm run watch --silent"
          : `node dist/${camelCase(projectName)}.js`,
        "build": "rollup --config",
        "watch": "rollup --config -w --silent",
      };
      if (isUseTS) {
        addScripts["build:type"] = "tsc";
      }
      if (isUseEslint) {
        addScripts["prettier"] = "prettier --write . --loglevel silent";
      }
      await pkg.update({
        scripts: addScripts,
      });
      if (isUseEslint) await exec('npm run prettier --silent');
    });

  if (isNeedServe && isStartServe) await createTask('开启服务')
    .run(async (spinner) => {
      spinner.success({
        text: `成功开启服务：本地（http://localhost:8080/） 远程访问（http://${getIPv4()}:8080/）`
      });
      await exec('npm run dev --silent');
    });
};

export default build;
