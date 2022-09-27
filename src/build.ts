import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import { createNPM } from './utils/npm';
import { createPackage } from './utils/pkg';
import { createRollupConfigs } from './utils/rollup';
import exec from './utils/exec';
import copyFile from './utils/copy-file';
import replaceTemplate from './utils/replace-template';
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
  newDir: boolean;
  /** 是否使用TS */
  ts: boolean;
  /** 是否使用eslint */
  eslint: boolean;
  /** 是否使用web服务 */
  webServer: boolean;
  /** 是否使用pnpm代替npm */
  pnpm: boolean;
};


/**
 * 构建命令
 */
const build = async ({
  workplace,
  projectName,
  description,
  newDir,
  ts,
  eslint,
  webServer,
  pnpm,
}: BuildOptions) => {
  if (newDir) await createTask(
    '创建项目文件夹',
    async () => {
      await fs.promises.mkdir(workplace);
      // 进入项目文件夹
      shell.cd(projectName);
    },
  );

  const pkg = createPackage(projectName, description);
  const rollup = createRollupConfigs({
    ts,
    webServer: webServer ? {
      name: projectName,
      port: 8080,
    } : void 0,
  });
  const npm = createNPM(pnpm);

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

      await copyFile(
        getTemplatePath('.babelrc.json'),
        `${workplace}/.babelrc.json`,
      );
    },
  );

  if (ts) {
    await createTask(
      '安装typescript相关依赖及写入配置',
      async () => {
        await npm.add([
          'typescript',
          'tslib',
          '@rollup/plugin-typescript'
        ], { isDevDependencies: true });
  
        await copyFile(
          getTemplatePath('tsconfig.json'),
          `${workplace}/tsconfigs.json`,
        );
      },
    );
  }

  if (webServer) {
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
        await copyFile(
          getTemplatePath(`index.html`),
          `${workplace}/public/index.html`,
        );
        // 替换html模版占位符数据
        await replaceTemplate(`${workplace}/public/index.html`, {
          title: projectName,
          script: `./index.js`
        })
      },
    );
  }

  if (eslint) {
    await createTask(
      '安装Eslint相关依赖及写入配置',
      async () => {
        await npm.add([
          'prettier',
          'eslint@^8.23.0',
          'eslint-config-prettier@^8.5.0',
          'eslint-plugin-prettier@^4.2.1',
          ...(ts ? [
            "@typescript-eslint/parser@5.36.2",
            "@typescript-eslint/eslint-plugin@5.36.2",
          ]: [])
        ], { isDevDependencies: true });

        // 创建编辑器配置文件
        await copyFile(
          getTemplatePath(`.editorconfig`),
          `${workplace}/.editorconfig`,
        );
        // 创建prettier配置文件
        await copyFile(
          getTemplatePath(`.prettierrc`),
          `${workplace}/.prettierrc`,
        );
        await copyFile(
          getTemplatePath(`.prettierignore`),
          `${workplace}/.prettierignore`,
        );
        // 创建eslint配置文件
        await copyFile(
          getTemplatePath(`.eslintrc-${ts ? 'ts' : 'js'}.js`),
          `${workplace}/.eslintrc.js`,
        );
        await copyFile(
          getTemplatePath(`.eslintignore`),
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
      const enterFileExt = ts ? 'ts' : 'js';
      await copyFile(
        getTemplatePath(`index.${enterFileExt}`),
        `${workplace}/src/index.${enterFileExt}`,
      );
    },
  );

  await createTask(
    '生成rollup打包配置文件(rollup.config.js)',
    async () => rollup.writeFile(workplace),
  );

  await createTask(
    '更新package.json脚本命令',
    async () => {
      const addScripts: Record<string, string> = {
        "build": "rollup --config",
        "watch": "rollup --config -w",
      };
      if (ts) {
        addScripts["build:type"] = "tsc";
        addScripts["build:silent"] = "rollup --config --silent";
      }
      if (eslint) {
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
      if (eslint) await exec('npm run prettier --silent');
      if (webServer) {
        spinner.success({
          text: `启动服务：本地（http://localhost:8080/） 远程访问（http://${getIPv4()}:8080/）`
        });
      };
      await exec('npm run build:silent --silent');
    },
  );
};

export default build;
