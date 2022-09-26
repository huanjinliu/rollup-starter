import path from 'path';

export default (fileName: string) => {
  return path.join(path.resolve(__dirname), `templates/`, fileName);
};