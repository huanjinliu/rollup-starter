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


export const copyTemplateFile = async (
  src: string,
  dest: string,
  props: Record<string, unknown> = {},
) => {
  const buffer = await fs.promises.readFile(src);

  const conditionReg = /( *){%([\s\S]+?)%}(\n?)/mg;
  const valueReg = /{=([\s\S]+?)=}/g;

  const content = buffer.toString()
    // 替换模版中的条件
    .replace(conditionReg, (_, space, content, wrap) => {
      let [key, trueStr, falseStr] = content.split('=>') as string[];
      key = key.trim();
      [trueStr, falseStr] = [trueStr, falseStr].map(str => {
        if (str === undefined) return '';
        const multiple = /^\s*\n([\s\S]+\n)\s*$/;
        return multiple.test(str)
          ? str.replace(/^\s*\n([\s\S]+\n)\s*$/, '$1')
          : space + str.trim() + wrap;
      });
      return Boolean(props[key]) ? trueStr : falseStr;
    })
    // 替换模版中的值
    .replace(valueReg, (_, $1) => {
      const [key, defualtValue = ''] = $1.trim().split(':');
      return props[key] ?? defualtValue;
    })

  await fs.promises.writeFile(dest, content);
};