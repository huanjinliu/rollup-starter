import fs from 'fs';

export default async (src: string, dest: string) => {
  if (!fs.existsSync(dest)) await fs.promises.writeFile(dest, '');
  return await fs.promises.copyFile(src, dest);
}