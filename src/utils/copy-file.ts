import fs from 'fs';

export const copyFile = async (src: string, dest: string) => {
  if (!fs.existsSync(dest)) await fs.promises.writeFile(dest, '');
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(src);
    const writeStream = fs.createWriteStream(dest);
    readStream.pipe(writeStream, { end: true });
    readStream.on('end', resolve);
    readStream.on('error', reject);
  })
};

// export const copyTemplateFile = async (src: string, dest: string, props: Record<string, string>) => {
//   if (!fs.existsSync(dest)) await fs.promises.writeFile(dest, '');

//   const contentBuffer = await fs.promises.readFile(src);
//   let content = contentBuffer.toString();

//   Object.entries(props).forEach(([key, value]) => {
//     content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
//   })

//   await fs.promises.writeFile(path, content);
// };