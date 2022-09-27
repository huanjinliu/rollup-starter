import shell from 'shelljs';

const exec = (command: string) => {
  const result = shell.exec(command);
  if (result.code === 0) return Promise.resolve();
  return Promise.reject(result.stderr);
};

export default exec;