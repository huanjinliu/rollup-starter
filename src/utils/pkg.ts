import fs from 'fs';
import path from 'path';

/**
 * 初始项目，返回项目初始package.json
 * @param options 基础配置
 * @returns package.json对象数据
 */
const initProject = (options: { name: string; description: string }) => {
  const { name, description } = options;
  return {
    name,
    version: '1.0.0',
    description,
    scripts: {},
    author: '',
    license: 'ISC',
  };
};

export const createPackage = (name: string, description: string = '') => {
  let content = initProject({ name, description });
  let fileDir: string;

  const methods = {
    get: async () => {
      if (fileDir) {
        const jsonBuffer = await fs.promises.readFile(path.join(fileDir, 'package.json'));
        return JSON.parse(jsonBuffer.toString());
      }
      return initProject({ name, description });
    },
    update: async (options: Record<string, any>) => {
      content = { ...(await methods.get()), ...options };
      if (fileDir) await methods.writeFile(fileDir);
    },
    writeFile: async (dirPath: string, space: number = 2) => {
      await fs.promises.writeFile(
        path.join(dirPath, 'package.json'),
        JSON.stringify(content, undefined, space),
      );
      fileDir = dirPath;
    },
  };
  return methods;
};