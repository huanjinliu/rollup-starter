// import fs from 'fs';
// import path from 'path';
import inquirer from 'inquirer';
import { program } from 'commander';
import pkg from '../package.json';

program
  .name('rollup-starter')
  .description(pkg.description)
  .version('0.1.0', '-v, --version');

program
  .command('create [name]')
  .description('create project')
  .action(async (name: string) => {
    let projectName = name;
    // 1.如果没有指向项目名,询问项目名
    if (projectName === void 0) {
      const { name: newName } = await inquirer
        .prompt<{ name: string }>([
          {
            type: 'input',
            name: 'name',
            message: `input your project's name`,
          }
        ])
      projectName = newName;
      console.dir(projectName);
    }
  })

program.parse(process.argv);
