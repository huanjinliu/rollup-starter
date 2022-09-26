'use strict';

var tslib = require('tslib');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var commander = require('commander');
var shell = require('shelljs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var shell__default = /*#__PURE__*/_interopDefaultLegacy(shell);

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
	"@types/shelljs": "^0.8.11",
	"cross-env": "^7.0.3",
	rollup: "^2.78.1",
	"rollup-external-modules": "^2.0.0",
	"rollup-plugin-commonjs": "^10.1.0",
	"rollup-plugin-copy": "^3.4.0",
	"rollup-plugin-json": "^4.0.0",
	"rollup-plugin-typescript": "^1.0.1",
	tslib: "^2.4.0",
	typescript: "^4.8.2"
};
var dependencies = {
	commander: "^9.4.0",
	inquirer: "^8.0.0",
	shelljs: "^0.8.5"
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

/**
 * 是否是非空文件夹
 */
var isNonEmptyDir = function (path) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    var files;
    return tslib.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, fs__default["default"].promises.readdir(path)];
            case 1:
                files = _b.sent();
                if (files.length)
                    return [2 /*return*/, true];
                return [2 /*return*/, false];
            case 2:
                _b.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };

var copyFile = (function (src, dest) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    return tslib.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!fs__default["default"].existsSync(dest)) return [3 /*break*/, 2];
                return [4 /*yield*/, fs__default["default"].promises.writeFile(dest, '')];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, fs__default["default"].promises.copyFile(src, dest)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); });

var exec = function (command) {
    if (shell__default["default"].exec(command).code === 0)
        return Promise.resolve();
    return Promise.reject(new Error("command is invalid"));
};

var getTemplatePath = (function (fileName) {
    return path__default["default"].join(path__default["default"].resolve(__dirname), "templates/", fileName);
});

var createNPM = function (pnpm) {
    if (pnpm === void 0) { pnpm = false; }
    var npm = shell__default["default"].which('pnpm') && pnpm ? 'pnpm' : 'npm';
    return {
        add: function (depend, others) { return tslib.__awaiter(void 0, void 0, void 0, function () {
            var depends, isDevDependencies;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        depends = Array.isArray(depend) ? depend : [depend];
                        isDevDependencies = (others !== null && others !== void 0 ? others : { isDevDependencies: false }).isDevDependencies;
                        return [4 /*yield*/, exec("".concat(npm, " i ").concat(depends.join(' '), " ").concat(isDevDependencies ? '-D' : '-S', " --silent"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        remove: function (depend) { return tslib.__awaiter(void 0, void 0, void 0, function () {
            var depends;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        depends = Array.isArray(depend) ? depend : [depend];
                        return [4 /*yield*/, exec("".concat(npm, " uninstall ").concat(depends.join(' '), " --silent"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }
    };
};

/**
 * 初始项目，返回项目初始package.json
 * @param options 基础配置
 * @returns package.json对象数据
 */
var initProject = function (options) {
    var name = options.name, description = options.description;
    return {
        name: name,
        version: '1.0.0',
        description: description,
        main: 'index.js',
        scripts: {},
        author: '',
        license: 'ISC',
    };
};
var createPackage = function (name, description) {
    if (description === void 0) { description = ''; }
    var content = initProject({ name: name, description: description });
    var fileDir;
    var methods = {
        get: function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
            var jsonBuffer;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fileDir) return [3 /*break*/, 2];
                        return [4 /*yield*/, fs__default["default"].promises.readFile(path__default["default"].join(fileDir, 'package.json'))];
                    case 1:
                        jsonBuffer = _a.sent();
                        return [2 /*return*/, JSON.parse(jsonBuffer.toString())];
                    case 2: return [2 /*return*/, initProject({ name: name, description: description })];
                }
            });
        }); },
        update: function (options) { return tslib.__awaiter(void 0, void 0, void 0, function () {
            var _a;
            return tslib.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = [{}];
                        return [4 /*yield*/, methods.get()];
                    case 1:
                        content = tslib.__assign.apply(void 0, [tslib.__assign.apply(void 0, _a.concat([(_b.sent())])), options]);
                        if (!fileDir) return [3 /*break*/, 3];
                        return [4 /*yield*/, methods.writeFile(fileDir)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        writeFile: function (dirPath, space) {
            if (space === void 0) { space = 2; }
            return tslib.__awaiter(void 0, void 0, void 0, function () {
                return tslib.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fs__default["default"].promises.writeFile(path__default["default"].join(dirPath, 'package.json'), JSON.stringify(content, undefined, space))];
                        case 1:
                            _a.sent();
                            fileDir = dirPath;
                            return [2 /*return*/];
                    }
                });
            });
        },
    };
    return methods;
};

var replaceTemplate = function (path, sources) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    var contentBuffer, content;
    return tslib.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs__default["default"].promises.readFile(path)];
            case 1:
                contentBuffer = _a.sent();
                content = contentBuffer.toString();
                Object.entries(sources).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    content = content.replace(new RegExp("{{".concat(key, "}}"), 'g'), value);
                });
                return [4 /*yield*/, fs__default["default"].promises.writeFile(path, content)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };

var WRAP = '\n';
var createRollupConfigs = function (_a) {
    var _b;
    var ts = _a.ts, webServer = _a.webServer;
    var content = [
        // `import path from 'path';`,
        "import resolve from '@rollup/plugin-node-resolve';",
        "import babel from '@rollup/plugin-babel';",
        "import commonjs from 'rollup-plugin-commonjs';",
        ts === true ? "import typescript from 'rollup-plugin-typescript';" : '',
        webServer ? "import serve from 'rollup-plugin-serve';" : '',
        webServer ? "import livereload from 'rollup-plugin-livereload';" : '',
        "\nexport default () => [",
        "  {",
        "    input: 'src/index.ts',",
        "    output: {",
        "      file: 'dist/index.js',",
        "      format: '".concat(webServer ? 'umd' : 'cjs', "',"),
        webServer ? "      name: '".concat(webServer.name, "',") : '',
        "    },",
        "    plugins: [ ",
        "      resolve(),",
        "      commonjs(),",
        ts === true ? "      typescript()," : '',
        "      babel({",
        "        babelHelpers: 'bundled',",
        "      }),",
        webServer ? [
            "      serve({",
            "        open: true,",
            "        openPage: '/public/index.html',",
            "        port: ".concat((_b = webServer.port) !== null && _b !== void 0 ? _b : 8080, ","),
            "        verbose: false,",
            "      }),",
            "      livereload({",
            "        watch: ['dist'],",
            "        verbose: false,",
            "      })",
        ].join(WRAP) : '',
        "    ],",
        "  }",
        "];",
    ].filter(function (part) { return part !== ''; }).join(WRAP);
    return {
        get: function () { return content; },
        writeFile: function (dirPath) { return tslib.__awaiter(void 0, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs__default["default"].promises.writeFile(path__default["default"].join(dirPath, 'rollup.config.js'), content)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    };
};

/**
 * 构建命令
 */
var build = function (_a) {
    var workplace = _a.workplace, projectName = _a.projectName, description = _a.description, newDir = _a.newDir, ts = _a.ts; _a.eslint; var webServer = _a.webServer, pnpm = _a.pnpm;
    return tslib.__awaiter(void 0, void 0, void 0, function () {
        var pkg, rollup, npm, enterFileExt, addScripts;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pkg = createPackage(projectName, description);
                    rollup = createRollupConfigs({
                        ts: ts,
                        webServer: webServer ? {
                            name: projectName,
                        } : void 0,
                    });
                    if (!newDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, fs__default["default"].promises.mkdir(workplace)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2: 
                // pkg生成文件
                return [4 /*yield*/, pkg.writeFile(workplace)];
                case 3:
                    // pkg生成文件
                    _b.sent();
                    // 进入项目文件夹
                    return [4 /*yield*/, shell__default["default"].cd(projectName)];
                case 4:
                    // 进入项目文件夹
                    _b.sent();
                    npm = createNPM(pnpm);
                    // 安装依赖
                    return [4 /*yield*/, npm.add([
                            'rollup',
                            'rollup-plugin-commonjs',
                            '@rollup/plugin-node-resolve',
                        ], { isDevDependencies: true })];
                case 5:
                    // 安装依赖
                    _b.sent();
                    // 安装babel相关
                    return [4 /*yield*/, npm.add([
                            '@babel/core',
                            '@babel/preset-env',
                            '@rollup/plugin-babel',
                        ], { isDevDependencies: true })];
                case 6:
                    // 安装babel相关
                    _b.sent();
                    return [4 /*yield*/, copyFile(getTemplatePath('.babelrc.json'), "".concat(workplace, "/.babelrc.json"))];
                case 7:
                    _b.sent();
                    if (!ts) return [3 /*break*/, 10];
                    return [4 /*yield*/, npm.add([
                            'typescript',
                            'tslib',
                            'rollup-plugin-typescript'
                        ], { isDevDependencies: true })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, copyFile(getTemplatePath('tsconfig.json'), "".concat(workplace, "/tsconfigs.json"))];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    if (!webServer) return [3 /*break*/, 15];
                    return [4 /*yield*/, npm.add([
                            'rollup-plugin-serve',
                            'rollup-plugin-livereload',
                        ], { isDevDependencies: true })];
                case 11:
                    _b.sent();
                    // 创建public文件夹
                    return [4 /*yield*/, fs__default["default"].promises.mkdir(path__default["default"].join(workplace, 'public'))];
                case 12:
                    // 创建public文件夹
                    _b.sent();
                    // 创建html入口文件
                    return [4 /*yield*/, copyFile(getTemplatePath("index.html"), "".concat(workplace, "/public/index.html"))];
                case 13:
                    // 创建html入口文件
                    _b.sent();
                    // 修改html模版数据
                    return [4 /*yield*/, replaceTemplate("".concat(workplace, "/public/index.html"), {
                            title: projectName,
                            script: "../dist/index.js"
                        })];
                case 14:
                    // 修改html模版数据
                    _b.sent();
                    _b.label = 15;
                case 15: 
                // 创建src源码文件夹
                return [4 /*yield*/, fs__default["default"].promises.mkdir(path__default["default"].join(workplace, 'src'))];
                case 16:
                    // 创建src源码文件夹
                    _b.sent();
                    enterFileExt = ts ? 'ts' : 'js';
                    return [4 /*yield*/, copyFile(getTemplatePath("index.".concat(enterFileExt)), "".concat(workplace, "/src/index.").concat(enterFileExt))];
                case 17:
                    _b.sent();
                    // rollup config生成文件
                    return [4 /*yield*/, rollup.writeFile(workplace)];
                case 18:
                    // rollup config生成文件
                    _b.sent();
                    addScripts = {
                        "build": "rollup --config",
                        "watch": "rollup --config -w",
                    };
                    if (ts) {
                        addScripts["build:type"] = "tsc";
                        addScripts["build:all"] = "tsc && npm run build";
                    }
                    return [4 /*yield*/, pkg.update({
                            scripts: addScripts,
                        })
                        // 跑起项目
                    ];
                case 19:
                    _b.sent();
                    // 跑起项目
                    return [4 /*yield*/, exec('npm run build')];
                case 20:
                    // 跑起项目
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};

commander.program
    .name('rollup-starter')
    .description(pkg.description)
    .version('0.1.0', '-v, --version');
commander.program
    .command('create [name]')
    .description('create project')
    .action(function (name) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    var requireProjectName, requireProjectDescription, getProjectRootPath, require, projectName, _a, description, rootPath, isNeedCreateDir, _b;
    var _c;
    return tslib.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                requireProjectName = function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                    var name;
                    return tslib.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inquirer__default["default"]
                                    .prompt([
                                    {
                                        type: 'input',
                                        name: 'name',
                                        message: "input project's name",
                                    }
                                ])];
                            case 1:
                                name = (_a.sent()).name;
                                return [2 /*return*/, name];
                        }
                    });
                }); };
                requireProjectDescription = function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                    var description;
                    return tslib.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, inquirer__default["default"]
                                    .prompt([
                                    {
                                        type: 'input',
                                        name: 'description',
                                        message: "input project's description",
                                    }
                                ])];
                            case 1:
                                description = (_a.sent()).description;
                                return [2 /*return*/, description];
                        }
                    });
                }); };
                getProjectRootPath = function (projectName) { return tslib.__awaiter(void 0, void 0, void 0, function () {
                    var workplace;
                    return tslib.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                workplace = path__default["default"].join(process.cwd(), "/".concat(projectName));
                                return [4 /*yield*/, isNonEmptyDir(workplace)];
                            case 1:
                                // 如果是非空文件夹将抛出错误提醒
                                if (_a.sent()) {
                                    throw new ReferenceError("directory not empty");
                                }
                                return [2 /*return*/, workplace];
                        }
                    });
                }); };
                require = function (message, defaultValue) {
                    if (defaultValue === void 0) { defaultValue = true; }
                    return tslib.__awaiter(void 0, void 0, void 0, function () {
                        var need;
                        return tslib.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, inquirer__default["default"]
                                        .prompt([
                                        {
                                            type: 'confirm',
                                            name: 'need',
                                            default: defaultValue,
                                            message: message,
                                        }
                                    ])];
                                case 1:
                                    need = (_a.sent()).need;
                                    return [2 /*return*/, need];
                            }
                        });
                    });
                };
                if (!(name !== null && name !== void 0)) return [3 /*break*/, 1];
                _a = name;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, requireProjectName()];
            case 2:
                _a = _d.sent();
                _d.label = 3;
            case 3:
                projectName = _a;
                return [4 /*yield*/, requireProjectDescription()];
            case 4:
                description = _d.sent();
                return [4 /*yield*/, getProjectRootPath(projectName)];
            case 5:
                rootPath = _d.sent();
                isNeedCreateDir = !fs__default["default"].existsSync(rootPath);
                _b = build;
                _c = {
                    workplace: rootPath,
                    projectName: projectName,
                    description: description,
                    newDir: isNeedCreateDir
                };
                return [4 /*yield*/, require("use pnpm?", true)];
            case 6:
                // 是否使用pnpm
                _c.pnpm = _d.sent();
                return [4 /*yield*/, require("do you need typescript?", true)];
            case 7:
                // 是否需要ts
                _c.ts = _d.sent();
                return [4 /*yield*/, require("do you need eslint(and prettier)?", false)];
            case 8:
                // 是否需要eslint + perttier
                _c.eslint = _d.sent();
                return [4 /*yield*/, require("do you need web server?", false)];
            case 9: 
            // 执行构建命令
            return [4 /*yield*/, _b.apply(void 0, [(
                    // 是否需要引入rollup的web服务
                    _c.webServer = _d.sent(),
                        _c)])];
            case 10:
                // 执行构建命令
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
commander.program.parse(process.argv);
