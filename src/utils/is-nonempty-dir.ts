import fs from 'fs';

/**
 * 是否是非空文件夹
 */
const isNonEmptyDir = async (path: string) => {
  try {
    const files = await fs.promises.readdir(path);
    if (files.length) return true;
    return false;
  } catch {
    return false;
  }
}

export default isNonEmptyDir;