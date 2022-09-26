import shell from 'shelljs';
import exec from './exec';

export const createNPM = (pnpm: boolean = false) => {
  const npm = shell.which('pnpm') && pnpm ? 'pnpm' : 'npm';
  return {
    add: async (depend: string | string[], others?: { isDevDependencies: boolean }) => {
      const depends = Array.isArray(depend) ? depend : [depend];
      const { isDevDependencies } = others ?? { isDevDependencies: false };

      await exec(`${npm} i ${depends.join(' ')} ${isDevDependencies ? '-D' : '-S'} --silent`);
    },
    remove: async (depend: string | string[]) => {
      const depends = Array.isArray(depend) ? depend : [depend];
      await exec(`${npm} uninstall ${depends.join(' ')} --silent`);
    }
  }
};