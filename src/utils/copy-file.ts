import fs from 'fs';

export default async (src: string, dest: string) => {
  if (!fs.existsSync(dest)) await fs.promises.writeFile(dest, '');
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(src);
    const writeStream = fs.createWriteStream(dest);
    readStream.pipe(writeStream, { end: true });
    readStream.on('end', resolve);
    readStream.on('error', reject);
  })
}