import fs from 'fs';

const replaceTemplate = async (path: string, sources: Record<string, string>) => {
  const contentBuffer = await fs.promises.readFile(path);
  let content = contentBuffer.toString();

  Object.entries(sources).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  })

  await fs.promises.writeFile(path, content);
};

export default replaceTemplate;