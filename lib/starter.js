'use strict';

var tslib = require('tslib');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var commander = require('commander');
var shell = require('shelljs');
var camelCase = require('camel-case');
var nanospinner = require('nanospinner');
var os = require('os');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var shell__default = /*#__PURE__*/_interopDefaultLegacy(shell);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);

var name = "rolluper";
var version = "1.2.3";
var description = "start a rollup project quickly :)";
var main = "lib/index.js";
var scripts = {
	build: "rollup --config",
	watch: "rollup --config --silence -w",
	link: "npm run build && sudo npm link",
	"publish:major": "npm version major && npm run build && npm publish",
	"publish:minor": "npm version minor && npm run build && npm publish",
	"publish:patch": "npm version patch && npm run build && npm publish"
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
	rolluper: "link.js"
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
	"rollup-plugin-clear": "^2.0.7",
	"rollup-plugin-commonjs": "^10.1.0",
	"rollup-plugin-copy": "^3.4.0",
	"rollup-plugin-json": "^4.0.0",
	"rollup-plugin-typescript": "^1.0.1",
	tslib: "^2.4.0",
	typescript: "^4.8.2"
};
var dependencies = {
	"camel-case": "^4.1.2",
	commander: "^9.4.0",
	inquirer: "^8.0.0",
	nanospinner: "^1.1.0",
	os: "^0.1.2",
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

var exec = function (command) {
    var result = shell__default["default"].exec(command);
    if (result.code === 0)
        return Promise.resolve();
    return Promise.reject(result.stderr);
};

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

var copyTemplateFile = function (src, dest, props) {
    if (props === void 0) { props = {}; }
    return tslib.__awaiter(void 0, void 0, void 0, function () {
        var buffer, conditionReg, valueReg, content;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs__default["default"].promises.readFile(src)];
                case 1:
                    buffer = _a.sent();
                    conditionReg = /( *){%([\s\S]+?)%}(\n?)/mg;
                    valueReg = /{=([\s\S]+?)=}/g;
                    content = buffer.toString()
                        // 替换模版中的条件
                        .replace(conditionReg, function (_, space, content, wrap) {
                        var _a;
                        var _b = content.split('=>'), key = _b[0], trueStr = _b[1], falseStr = _b[2];
                        key = key.trim();
                        _a = [trueStr, falseStr].map(function (str) {
                            if (str === undefined)
                                return '';
                            var multiple = /^\s*\n([\s\S]+\n)\s*$/;
                            return multiple.test(str)
                                ? str.replace(/^\s*\n([\s\S]+\n)\s*$/, '$1')
                                : space + str.trim() + wrap;
                        }), trueStr = _a[0], falseStr = _a[1];
                        return Boolean(props[key]) ? trueStr : falseStr;
                    })
                        // 替换模版中的值
                        .replace(valueReg, function (_, $1) {
                        var _a;
                        var _b = $1.trim().split(':'), key = _b[0], _c = _b[1], defualtValue = _c === void 0 ? '' : _c;
                        return (_a = props[key]) !== null && _a !== void 0 ? _a : defualtValue;
                    });
                    return [4 /*yield*/, fs__default["default"].promises.writeFile(dest, content)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};

var getTemplatePath = (function (fileName) {
    return path__default["default"].join(path__default["default"].resolve(__dirname), "templates/", fileName);
});

/** 是否是错误类型 */
var isError = function (err) { return err instanceof Error; };
/**
 * 创建一个任务
 * @param {Function} task 任务执行函数
 * @param {string} description 任务描述
 */
var createTask = function (description) {
    return {
        run: function (task) { return tslib.__awaiter(void 0, void 0, void 0, function () {
            var spinner, result, err_1;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spinner = nanospinner.createSpinner(description).start();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, task(spinner)];
                    case 2:
                        result = _a.sent();
                        spinner.success();
                        return [2 /*return*/, result];
                    case 3:
                        err_1 = _a.sent();
                        if (isError(err_1)) {
                            spinner.error({
                                text: err_1.message
                            });
                        }
                        process.exit();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); }
    };
};

/**
 * 获取当前机器的ip地址
 */
var getIPv4 = function () {
    var ifaces = os__default["default"].networkInterfaces();
    if (!ifaces)
        return 'localhost';
    for (var dev in ifaces) {
        var iface = ifaces[dev];
        for (var i = 0; i < iface.length; i++) {
            var _a = iface[i], family = _a.family, address = _a.address, internal = _a.internal;
            if (family === "IPv4" && address !== "127.0.0.1" && !internal) {
                return address;
            }
        }
    }
};

/**
 * 构建命令
 */
var build = function (_a) {
    var workplace = _a.workplace, projectName = _a.projectName, description = _a.description, isNeedCreateDir = _a.isNeedCreateDir, isUseTS = _a.isUseTS, isUseEslint = _a.isUseEslint, isNeedServe = _a.isNeedServe, isUsePnpm = _a.isUsePnpm, isStartServe = _a.isStartServe;
    return tslib.__awaiter(void 0, void 0, void 0, function () {
        var pkg, npm;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isNeedCreateDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, createTask('创建项目文件夹')
                            .run(function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fs__default["default"].promises.mkdir(workplace)];
                                    case 1:
                                        _a.sent();
                                        // 进入项目文件夹
                                        shell__default["default"].cd(projectName);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    pkg = createPackage(projectName, description);
                    npm = createNPM(isUsePnpm);
                    return [4 /*yield*/, createTask('初始化项目package.json')
                            .run(function () { return pkg.writeFile(workplace); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, createTask('安装Rollup项目必要依赖')
                            .run(function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, npm.add([
                                            'rollup',
                                            'rollup-plugin-clear',
                                            'rollup-plugin-terser',
                                            '@rollup/plugin-commonjs',
                                            '@rollup/plugin-node-resolve',
                                        ], { isDevDependencies: true })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, createTask('安装babel相关依赖及写入配置')
                            .run(function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, npm.add([
                                            '@babel/core',
                                            '@babel/preset-env',
                                            '@rollup/plugin-babel',
                                        ], { isDevDependencies: true })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, copyTemplateFile(getTemplatePath('babel/.babelrc.temp'), "".concat(workplace, "/.babelrc.json"))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 5:
                    _b.sent();
                    if (!isUseTS) return [3 /*break*/, 7];
                    return [4 /*yield*/, createTask('安装typescript相关依赖及写入配置')
                            .run(function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, npm.add([
                                            'typescript',
                                            'tslib',
                                            '@rollup/plugin-typescript'
                                        ], { isDevDependencies: true })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, copyTemplateFile(getTemplatePath('ts/tsconfig.temp'), "".concat(workplace, "/tsconfig.json"), {
                                                brower: isNeedServe,
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    if (!isNeedServe) return [3 /*break*/, 9];
                    return [4 /*yield*/, createTask('安装web服务相关依赖及写入配置')
                            .run(function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, npm.add([
                                            'rollup-plugin-serve',
                                            'rollup-plugin-livereload',
                                        ], { isDevDependencies: true })];
                                    case 1:
                                        _a.sent();
                                        // 创建public文件夹，默认以public文件夹中的html作为文档入口
                                        return [4 /*yield*/, fs__default["default"].promises.mkdir(path__default["default"].join(workplace, 'public'))];
                                    case 2:
                                        // 创建public文件夹，默认以public文件夹中的html作为文档入口
                                        _a.sent();
                                        // 创建html入口文件
                                        return [4 /*yield*/, copyTemplateFile(getTemplatePath("html/index.temp"), "".concat(workplace, "/public/index.html"), {
                                                title: projectName,
                                                script: "./index.js"
                                            })];
                                    case 3:
                                        // 创建html入口文件
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    if (!isUseEslint) return [3 /*break*/, 11];
                    return [4 /*yield*/, createTask('安装Eslint相关依赖及写入配置')
                            .run(function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, npm.add(tslib.__spreadArray([
                                            'prettier',
                                            'eslint@^8.23.0',
                                            'eslint-config-prettier@^8.5.0',
                                            'eslint-plugin-prettier@^4.2.1'
                                        ], (isUseTS ? [
                                            "@typescript-eslint/parser@5.36.2",
                                            "@typescript-eslint/eslint-plugin@5.36.2",
                                        ] : []), true), { isDevDependencies: true })];
                                    case 1:
                                        _a.sent();
                                        // 创建编辑器配置文件
                                        return [4 /*yield*/, copyTemplateFile(getTemplatePath("editor/.editorconfig.temp"), "".concat(workplace, "/.editorconfig"))];
                                    case 2:
                                        // 创建编辑器配置文件
                                        _a.sent();
                                        // 创建prettier配置文件
                                        return [4 /*yield*/, copyTemplateFile(getTemplatePath("prettier/.prettierrc.temp"), "".concat(workplace, "/.prettierrc"))];
                                    case 3:
                                        // 创建prettier配置文件
                                        _a.sent();
                                        return [4 /*yield*/, copyTemplateFile(getTemplatePath("prettier/.prettierignore.temp"), "".concat(workplace, "/.prettierignore"))];
                                    case 4:
                                        _a.sent();
                                        // 创建eslint配置文件
                                        return [4 /*yield*/, copyTemplateFile(getTemplatePath("eslint/.eslintrc.temp"), "".concat(workplace, "/.eslintrc.js"), {
                                                ts: isUseTS,
                                                web: isNeedServe,
                                            })];
                                    case 5:
                                        // 创建eslint配置文件
                                        _a.sent();
                                        return [4 /*yield*/, copyTemplateFile(getTemplatePath("eslint/.eslintignore.temp"), "".concat(workplace, "/.eslintignore"))];
                                    case 6:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [4 /*yield*/, createTask('生成src文件夹及入口文件')
                        .run(function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                        var enterFileExt;
                        return tslib.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fs__default["default"].promises.mkdir(path__default["default"].join(workplace, 'src'))];
                                case 1:
                                    _a.sent();
                                    enterFileExt = isUseTS ? 'ts' : 'js';
                                    return [4 /*yield*/, copyTemplateFile(getTemplatePath("".concat(enterFileExt, "/enter.temp")), "".concat(workplace, "/src/index.").concat(enterFileExt))];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 12:
                    _b.sent();
                    if (!isNeedServe) return [3 /*break*/, 14];
                    return [4 /*yield*/, createTask('生成web文件夹及入口文件')
                            .run(function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            var enterFileExt;
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fs__default["default"].promises.mkdir(path__default["default"].join(workplace, 'src/web'))];
                                    case 1:
                                        _a.sent();
                                        enterFileExt = isUseTS ? 'ts' : 'js';
                                        return [4 /*yield*/, copyTemplateFile(getTemplatePath("js/web-enter.temp"), "".concat(workplace, "/src/web/index.").concat(enterFileExt), {
                                                libName: camelCase.camelCase(projectName),
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 13:
                    _b.sent();
                    _b.label = 14;
                case 14: return [4 /*yield*/, createTask('生成rollup打包相关配置')
                        .run(function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return tslib.__generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: 
                                // 创建打包配置文件夹
                                return [4 /*yield*/, fs__default["default"].promises.mkdir(path__default["default"].join(workplace, 'build'))];
                                case 1:
                                    // 创建打包配置文件夹
                                    _b.sent();
                                    // 创建基本打包配置文件
                                    return [4 /*yield*/, copyTemplateFile(getTemplatePath("rollup/base.config.temp"), "".concat(workplace, "/build/base.build.js"), {
                                            ts: isUseTS,
                                            web: isNeedServe,
                                            libName: camelCase.camelCase(projectName),
                                        })];
                                case 2:
                                    // 创建基本打包配置文件
                                    _b.sent();
                                    if (!isNeedServe) return [3 /*break*/, 4];
                                    return [4 /*yield*/, copyTemplateFile(getTemplatePath("rollup/web.config.temp"), "".concat(workplace, "/build/web.build.js"), {
                                            ts: isUseTS,
                                            port: 8080,
                                            open: true,
                                        })];
                                case 3:
                                    _b.sent();
                                    _b.label = 4;
                                case 4: 
                                // 写入入口文件
                                return [4 /*yield*/, pkg.update((_a = {},
                                        _a[isNeedServe ? 'brower' : 'main'] = "dist/".concat(camelCase.camelCase(projectName), ".js"),
                                        _a["module"] = "dist/".concat(camelCase.camelCase(projectName), ".esm.js"),
                                        _a))];
                                case 5:
                                    // 写入入口文件
                                    _b.sent();
                                    // 创建最外层rollup.config.js文件
                                    return [4 /*yield*/, copyTemplateFile(getTemplatePath("rollup/rollup.config.temp"), "".concat(workplace, "/rollup.config.js"), {
                                            web: isNeedServe,
                                        })];
                                case 6:
                                    // 创建最外层rollup.config.js文件
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, createTask('更新package.json脚本命令')
                            .run(function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            var addScripts;
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!isNeedServe) return [3 /*break*/, 2];
                                        return [4 /*yield*/, npm.add('cross-env', { isDevDependencies: true })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        addScripts = {
                                            "dev": isNeedServe
                                                ? "cross-env NODE_ENV=development npm run watch --silent"
                                                : "node dist/".concat(camelCase.camelCase(projectName), ".js"),
                                            "build": "rollup --config",
                                            "watch": "rollup --config -w --silent",
                                        };
                                        if (isUseTS) {
                                            addScripts["build:type"] = "tsc";
                                        }
                                        if (isUseEslint) {
                                            addScripts["prettier"] = "prettier --write . --loglevel silent";
                                        }
                                        return [4 /*yield*/, pkg.update({
                                                scripts: addScripts,
                                            })];
                                    case 3:
                                        _a.sent();
                                        if (!isUseEslint) return [3 /*break*/, 5];
                                        return [4 /*yield*/, exec('npm run prettier --silent')];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 16:
                    _b.sent();
                    if (!(isNeedServe && isStartServe)) return [3 /*break*/, 18];
                    return [4 /*yield*/, createTask('开启服务')
                            .run(function (spinner) { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        spinner.success({
                                            text: "\u6210\u529F\u5F00\u542F\u670D\u52A1\uFF1A\u672C\u5730\uFF08http://localhost:8080/\uFF09 \u8FDC\u7A0B\u8BBF\u95EE\uFF08http://".concat(getIPv4(), ":8080/\uFF09")
                                        });
                                        return [4 /*yield*/, exec('npm run dev --silent')];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 17:
                    _b.sent();
                    _b.label = 18;
                case 18: return [2 /*return*/];
            }
        });
    });
};

commander.program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version, '-v, --version');
commander.program
    .command('create [name]')
    .description('create project')
    .action(function (name) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    var requireProjectName, requireProjectDescription, getProjectRootPath, require, projectName, _a, description, rootPath, isNeedCreateDir, isUsePnpm, isUseTS, isUseEslint, isNeedServe, isStartServe, _b;
    return tslib.__generator(this, function (_c) {
        switch (_c.label) {
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
                                        message: "\u8F93\u5165\u9879\u76EE\u540D",
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
                                        message: "\u8F93\u5165\u9879\u76EE\u63CF\u8FF0",
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
                _a = _c.sent();
                _c.label = 3;
            case 3:
                projectName = _a;
                return [4 /*yield*/, requireProjectDescription()];
            case 4:
                description = _c.sent();
                return [4 /*yield*/, getProjectRootPath(projectName)];
            case 5:
                rootPath = _c.sent();
                isNeedCreateDir = !fs__default["default"].existsSync(rootPath);
                return [4 /*yield*/, require("\u662F\u5426\u4F7F\u7528pnpm\u7BA1\u7406\u4F9D\u8D56?", true)];
            case 6:
                isUsePnpm = _c.sent();
                return [4 /*yield*/, require("\u662F\u5426\u4F7F\u7528Typescript?", true)];
            case 7:
                isUseTS = _c.sent();
                return [4 /*yield*/, require("\u662F\u5426\u4F7F\u7528eslint\u63A7\u5236\u4EE3\u7801\u683C\u5F0F(\u9ED8\u8BA4\u914D\u5957\u4F7F\u7528prettier)?", false)];
            case 8:
                isUseEslint = _c.sent();
                return [4 /*yield*/, require("\u662F\u5426\u9700\u8981web\u670D\u52A1(\u9ED8\u8BA4\u7AEF\u53E38080)?", false)];
            case 9:
                isNeedServe = _c.sent();
                if (!isNeedServe) return [3 /*break*/, 11];
                return [4 /*yield*/, require("\u662F\u5426\u5728\u642D\u5EFA\u5B8C\u5F00\u542Fweb\u670D\u52A1?", false)];
            case 10:
                _b = _c.sent();
                return [3 /*break*/, 12];
            case 11:
                _b = false;
                _c.label = 12;
            case 12:
                isStartServe = _b;
                // 执行构建命令
                return [4 /*yield*/, build({
                        workplace: rootPath,
                        projectName: projectName,
                        description: description,
                        isNeedCreateDir: isNeedCreateDir,
                        isUsePnpm: isUsePnpm,
                        isUseTS: isUseTS,
                        isUseEslint: isUseEslint,
                        isNeedServe: isNeedServe,
                        isStartServe: isStartServe,
                    })];
            case 13:
                // 执行构建命令
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
commander.program.parse(process.argv);
