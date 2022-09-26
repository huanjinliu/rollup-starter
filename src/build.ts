import fs from 'fs';
import path from 'path';
import shell from 'shelljs';
import copyFile from './utils/copy-file';
import exec from './utils/exec';
import getTemplatePath from './utils/get-template-path';
import { createNPM } from './utils/npm';
import { createPackage } from './utils/pkg';
import replaceTemplate from './utils/replace-template';
import { createRollupConfigs } from './utils/rollup';

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
  const pkg = createPackage(projectName, description);
  const rollup = createRollupConfigs({
    ts,
    webServer: webServer ? {
      name: projectName,
    } : void 0,
  });
  // 是否需要新建文件夹目录
  if (newDir) await fs.promises.mkdir(workplace);

  // pkg生成文件
  await pkg.writeFile(workplace);

  // 进入项目文件夹
  await shell.cd(projectName);

  const npm = createNPM(pnpm);

  // 安装依赖
  await npm.add([
    'rollup',
    'rollup-plugin-commonjs',
    '@rollup/plugin-node-resolve',
  ], { isDevDependencies: true });

  // 安装babel相关
  await npm.add([
    '@babel/core',
    '@babel/preset-env',
    '@rollup/plugin-babel',
  ], { isDevDependencies: true });
  await copyFile(
    getTemplatePath('.babelrc.json'),
    `${workplace}/.babelrc.json`,
  );

  // 安装ts相关依赖
  if (ts) {
    await npm.add([
      'typescript',
      'tslib',
      'rollup-plugin-typescript'
    ], { isDevDependencies: true });

    await copyFile(
      getTemplatePath('tsconfig.json'),
      `${workplace}/tsconfigs.json`,
    );
  }

  // 安装web server相关依赖
  if (webServer) {
    await npm.add([
      'rollup-plugin-serve',
      'rollup-plugin-livereload',
    ], { isDevDependencies: true });
    // 创建public文件夹
    await fs.promises.mkdir(path.join(workplace, 'public'));
    // 创建html入口文件
    await copyFile(
      getTemplatePath(`index.html`),
      `${workplace}/public/index.html`,
    );
    // 修改html模版数据
    await replaceTemplate(`${workplace}/public/index.html`, {
      title: projectName,
      script: `../dist/index.js`
    })
  }

  // 创建src源码文件夹
  await fs.promises.mkdir(path.join(workplace, 'src'));
  // 创建入口文件
  const enterFileExt = ts ? 'ts' : 'js';
  await copyFile(
    getTemplatePath(`index.${enterFileExt}`),
    `${workplace}/src/index.${enterFileExt}`,
  );

  // rollup config生成文件
  await rollup.writeFile(workplace);

  // 调整package.json的命令
  const addScripts: Record<string, string> = {
    "build": "rollup --config",
    "watch": "rollup --config -w",
  };
  if (ts) {
    addScripts["build:type"] = "tsc";
    addScripts["build:all"] = "tsc && npm run build"
  }
  await pkg.update({
    scripts: addScripts,
  })

  // 跑起项目
  await exec('npm run build');
};

export default build;
