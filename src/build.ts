import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
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
  if (isNeedCreateDir) await createTask(
    '创建项目文件夹',
    async () => {
      await fs.promises.mkdir(workplace);
      // 进入项目文件夹
      shell.cd(projectName);
    },
  );

  const pkg = createPackage(projectName, description);
  const npm = createNPM(isUsePnpm);

  await createTask(
    '初始化项目package.json',
    () => pkg.writeFile(workplace),
  );

  await createTask(
    '安装Rollup项目必要依赖',
    async () => {
      await npm.add([
        'rollup',
        '@rollup/plugin-commonjs',
        '@rollup/plugin-node-resolve',
      ], { isDevDependencies: true });
    },
  );

  await createTask(
    '安装babel相关依赖及写入配置',
    async () => {
      await npm.add([
        '@babel/core',
        '@babel/preset-env',
        '@rollup/plugin-babel',
      ], { isDevDependencies: true });

      await copyTemplateFile(
        getTemplatePath('babel/.babelrc.temp'),
        `${workplace}/.babelrc.json`,
      );
    },
  );

  if (isUseTS) {
    await createTask(
      '安装typescript相关依赖及写入配置',
      async () => {
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
      },
    );
  }

  if (isNeedServe) {
    await createTask(
      '安装web服务相关依赖及写入配置',
      async () => {
        await npm.add([
          'rollup-plugin-copy',
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
      },
    );
  }

  if (isUseEslint) {
    await createTask(
      '安装Eslint相关依赖及写入配置',
      async () => {
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
      },
    );
  }

  await createTask(
    '写入src文件夹及打包入口文件',
    async () => {
      await fs.promises.mkdir(path.join(workplace, 'src'));
      // 创建src入口文件
      const enterFileExt = isUseTS ? 'ts' : 'js';
      await copyTemplateFile(
        getTemplatePath(`${enterFileExt}/enter.temp`),
        `${workplace}/src/index.${enterFileExt}`,
      );
    },
  );

  await createTask(
    '生成rollup打包配置文件(rollup.config.js)',
    async () => {
      await copyTemplateFile(
        getTemplatePath(`rollup/rollup.config.temp`),
        `${workplace}/rollup.config.js`,
        {
          ts: isUseTS,
          web: isNeedServe,
          libName: projectName,
          port: 8080,
        }
      );
    },
  );

  await createTask(
    '更新package.json脚本命令',
    async () => {
      const addScripts: Record<string, string> = {
        "build": "rollup --config",
        "watch": "rollup --config -w",
        "build:silent": "rollup --config --silent",
      };
      if (isUseTS) {
        addScripts["build:type"] = "tsc";
      }
      if (isNeedServe) {
        await npm.add([
          'cross-env',
        ], { isDevDependencies: true });

        addScripts["dev"] = "cross-env NODE_ENV=development rollup --config --silent";
      }
      if (isUseEslint) {
        addScripts["prettier"] = "prettier --write . --loglevel silent";
      }
      await pkg.update({
        scripts: addScripts,
      });
    },
  );

  await createTask(
    '执行打包（启动）命令',
    async (spinner) => {
      if (isUseEslint) await exec('npm run prettier --silent');
      if (isNeedServe && isStartServe) {
        spinner.success({
          text: `启动服务：本地（http://localhost:8080/） 远程访问（http://${getIPv4()}:8080/）`
        });
        await exec('npm run dev --silent');
      } else {
        await exec('npm run build:silent --silent');
      };
    },
  );
};

export default build;
