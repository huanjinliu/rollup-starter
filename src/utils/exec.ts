import shell from 'shelljs';

const exec = (command: string) => {
  if (shell.exec(command).code === 0) return Promise.resolve();
  return Promise.reject(new Error(`command is invalid`));
};

export default exec;