'use strict';

var tslib = require('tslib');
var inquirer = require('inquirer');
var commander = require('commander');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);

var name = "rollup-starter";
var version = "0.0.1";
var description = "start a rollup project quickly :)";
var main = "lib/index.js";
var scripts = {
	build: "rollup --config",
	watch: "rollup --config --silence -w",
	link: "npm run build && sudo npm link"
};
var repository = {
	type: "git",
	url: "git+https://github.com/huanjinliu/rollup-starter.git"
};
var keywords = [
	"rollup",
	"starter",
	"lib",
	"typescript"
];
var bin = {
	"rollup-starter": "link.js"
};
var author = "huanjin.liu@foxmail.com";
var license = "MIT";
var bugs = {
	url: "https://github.com/huanjinliu/rollup-starter/issues"
};
var homepage = "https://github.com/huanjinliu/rollup-starter#readme";
var devDependencies = {
	"@babel/core": "^7.18.13",
	"@babel/preset-env": "^7.18.10",
	"@rollup/plugin-babel": "^5.3.1",
	"@rollup/plugin-node-resolve": "^13.3.0",
	"@types/inquirer": "^9.0.1",
	"cross-env": "^7.0.3",
	rollup: "^2.78.1",
	"rollup-external-modules": "^2.0.0",
	"rollup-plugin-commonjs": "^10.1.0",
	"rollup-plugin-json": "^4.0.0",
	"rollup-plugin-typescript": "^1.0.1",
	tslib: "^2.4.0",
	typescript: "^4.8.2"
};
var dependencies = {
	commander: "^9.4.0",
	inquirer: "^8.0.0"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	bin: bin,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	dependencies: dependencies
};

commander.program
    .name('rollup-starter')
    .description(pkg.description)
    .version('0.1.0', '-v, --version');
commander.program
    .command('create [name]')
    .description('create project')
    .action(function (name) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    var projectName, newName;
    return tslib.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                projectName = name;
                if (!(projectName === void 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, inquirer__default["default"]
                        .prompt([
                        {
                            type: 'input',
                            name: 'name',
                            message: "input your project's name",
                        }
                    ])];
            case 1:
                newName = (_a.sent()).name;
                projectName = newName;
                console.dir(projectName);
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
commander.program.parse(process.argv);
