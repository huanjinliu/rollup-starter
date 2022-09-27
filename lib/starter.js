'use strict';

var tslib = require('tslib');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var commander = require('commander');
var shell = require('shelljs');
var nanospinner = require('nanospinner');
var os = require('os');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var shell__default = /*#__PURE__*/_interopDefaultLegacy(shell);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);

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

var WRAP = '\n';
var createRollupConfigs = function (_a) {
    var ts = _a.ts, webServer = _a.webServer;
    var content = [
        "import resolve from '@rollup/plugin-node-resolve';",
        "import babel from '@rollup/plugin-babel';",
        "import commonjs from '@rollup/plugin-commonjs';",
        ts === true ? "import typescript from '@rollup/plugin-typescript';" : '',
        webServer ? "import serve from 'rollup-plugin-serve';" : '',
        webServer ? "import livereload from 'rollup-plugin-livereload';" : '',
        webServer ? "import copy from 'rollup-plugin-copy';" : '',
        "\nexport default () => [",
        "  {",
        "    input: 'src/index.ts',",
        "    output: {",
        "      file: 'dist/index.js',",
        "      format: '".concat(webServer ? 'umd' : 'cjs', "',"),
        webServer
            ? "      name: '".concat(webServer.name, "',")
            : "      exports: 'default',",
        "    },",
        "    plugins: [ ",
        "      resolve(),",
        "      commonjs(),",
        ts === true ? "      typescript()," : '',
        "      babel({",
        "        babelHelpers: 'bundled',",
        "      }),",
        webServer ? [
            "      copy({",
            "        targets: [",
            "          {",
            "            src: 'public/**',",
            "            dest: 'dist/'",
            "          }",
            "        ]",
            "      }),",
            "      serve({",
            "        contentBase: 'dist/',",
            "        port: ".concat(webServer.port, ","),
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

var copyFile = (function (src, dest) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    return tslib.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!fs__default["default"].existsSync(dest)) return [3 /*break*/, 2];
                return [4 /*yield*/, fs__default["default"].promises.writeFile(dest, '')];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/, new Promise(function (resolve, reject) {
                    var readStream = fs__default["default"].createReadStream(src);
                    var writeStream = fs__default["default"].createWriteStream(dest);
                    readStream.pipe(writeStream, { end: true });
                    readStream.on('end', resolve);
                    readStream.on('error', reject);
                })];
        }
    });
}); });

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
var createTask = function (description, task) { return tslib.__awaiter(void 0, void 0, void 0, function () {
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
}); };

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
    var workplace = _a.workplace, projectName = _a.projectName, description = _a.description, newDir = _a.newDir, ts = _a.ts, eslint = _a.eslint, webServer = _a.webServer, pnpm = _a.pnpm;
    return tslib.__awaiter(void 0, void 0, void 0, function () {
        var pkg, rollup, npm;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!newDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, createTask('创建项目文件夹', function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
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
                    rollup = createRollupConfigs({
                        ts: ts,
                        webServer: webServer ? {
                            name: projectName,
                            port: 8080,
                        } : void 0,
                    });
                    npm = createNPM(pnpm);
                    return [4 /*yield*/, createTask('初始化项目package.json', function () { return pkg.writeFile(workplace); })];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, createTask('安装Rollup项目必要依赖', function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, npm.add([
                                            'rollup',
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
                    return [4 /*yield*/, createTask('安装babel相关依赖及写入配置', function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, npm.add([
                                            '@babel/core',
                                            '@babel/preset-env',
                                            '@rollup/plugin-babel',
                                        ], { isDevDependencies: true })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, copyFile(getTemplatePath('.babelrc.json'), "".concat(workplace, "/.babelrc.json"))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 5:
                    _b.sent();
                    if (!ts) return [3 /*break*/, 7];
                    return [4 /*yield*/, createTask('安装typescript相关依赖及写入配置', function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, npm.add([
                                            'typescript',
                                            'tslib',
                                            '@rollup/plugin-typescript'
                                        ], { isDevDependencies: true })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, copyFile(getTemplatePath('tsconfig.json'), "".concat(workplace, "/tsconfigs.json"))];
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
                    if (!webServer) return [3 /*break*/, 9];
                    return [4 /*yield*/, createTask('安装web服务相关依赖及写入配置', function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, npm.add([
                                            'rollup-plugin-copy',
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
                                        return [4 /*yield*/, copyFile(getTemplatePath("index.html"), "".concat(workplace, "/public/index.html"))];
                                    case 3:
                                        // 创建html入口文件
                                        _a.sent();
                                        // 替换html模版占位符数据
                                        return [4 /*yield*/, replaceTemplate("".concat(workplace, "/public/index.html"), {
                                                title: projectName,
                                                script: "./index.js"
                                            })];
                                    case 4:
                                        // 替换html模版占位符数据
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    if (!eslint) return [3 /*break*/, 11];
                    return [4 /*yield*/, createTask('安装Eslint相关依赖及写入配置', function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, npm.add(tslib.__spreadArray([
                                            'prettier',
                                            'eslint@^8.23.0',
                                            'eslint-config-prettier@^8.5.0',
                                            'eslint-plugin-prettier@^4.2.1'
                                        ], (ts ? [
                                            "@typescript-eslint/parser@5.36.2",
                                            "@typescript-eslint/eslint-plugin@5.36.2",
                                        ] : []), true), { isDevDependencies: true })];
                                    case 1:
                                        _a.sent();
                                        // 创建编辑器配置文件
                                        return [4 /*yield*/, copyFile(getTemplatePath(".editorconfig"), "".concat(workplace, "/.editorconfig"))];
                                    case 2:
                                        // 创建编辑器配置文件
                                        _a.sent();
                                        // 创建prettier配置文件
                                        return [4 /*yield*/, copyFile(getTemplatePath(".prettierrc"), "".concat(workplace, "/.prettierrc"))];
                                    case 3:
                                        // 创建prettier配置文件
                                        _a.sent();
                                        return [4 /*yield*/, copyFile(getTemplatePath(".prettierignore"), "".concat(workplace, "/.prettierignore"))];
                                    case 4:
                                        _a.sent();
                                        // 创建eslint配置文件
                                        return [4 /*yield*/, copyFile(getTemplatePath(".eslintrc-".concat(ts ? 'ts' : 'js', ".js")), "".concat(workplace, "/.eslintrc.js"))];
                                    case 5:
                                        // 创建eslint配置文件
                                        _a.sent();
                                        return [4 /*yield*/, copyFile(getTemplatePath(".eslintignore"), "".concat(workplace, "/.eslintignore"))];
                                    case 6:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [4 /*yield*/, createTask('写入src文件夹及打包入口文件', function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                        var enterFileExt;
                        return tslib.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fs__default["default"].promises.mkdir(path__default["default"].join(workplace, 'src'))];
                                case 1:
                                    _a.sent();
                                    enterFileExt = ts ? 'ts' : 'js';
                                    return [4 /*yield*/, copyFile(getTemplatePath("index.".concat(enterFileExt)), "".concat(workplace, "/src/index.").concat(enterFileExt))];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, createTask('生成rollup打包配置文件(rollup.config.js)', function () { return tslib.__awaiter(void 0, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
                            return [2 /*return*/, rollup.writeFile(workplace)];
                        }); }); })];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, createTask('更新package.json脚本命令', function () { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            var addScripts;
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        addScripts = {
                                            "build": "rollup --config",
                                            "watch": "rollup --config -w",
                                        };
                                        if (ts) {
                                            addScripts["build:type"] = "tsc";
                                            addScripts["build:silent"] = "rollup --config --silent";
                                        }
                                        if (eslint) {
                                            addScripts["prettier"] = "prettier --write .";
                                        }
                                        return [4 /*yield*/, pkg.update({
                                                scripts: addScripts,
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, createTask('执行打包（启动）命令', function (spinner) { return tslib.__awaiter(void 0, void 0, void 0, function () {
                            return tslib.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!eslint) return [3 /*break*/, 2];
                                        return [4 /*yield*/, exec('npm run prettier --silent')];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2:
                                        if (webServer) {
                                            spinner.success({
                                                text: "\u542F\u52A8\u670D\u52A1\uFF1A\u672C\u5730\uFF08http://localhost:8080/\uFF09 \u8FDC\u7A0B\u8BBF\u95EE\uFF08http://".concat(getIPv4(), ":8080/\uFF09")
                                            });
                                        }
                                        return [4 /*yield*/, exec('npm run build:silent --silent')];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 15:
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
                return [4 /*yield*/, require("\u662F\u5426\u4F7F\u7528pnpm\u7BA1\u7406\u4F9D\u8D56?", true)];
            case 6:
                // 是否使用pnpm
                _c.pnpm = _d.sent();
                return [4 /*yield*/, require("\u662F\u5426\u4F7F\u7528Typescript?", true)];
            case 7:
                // 是否需要ts
                _c.ts = _d.sent();
                return [4 /*yield*/, require("\u662F\u5426\u9700\u8981\u5F00\u542Fweb\u670D\u52A1(\u9ED8\u8BA4\u7AEF\u53E38080)?", false)];
            case 8:
                // 是否需要引入rollup的web服务
                _c.webServer = _d.sent();
                return [4 /*yield*/, require("\u662F\u5426\u4F7F\u7528eslint\u63A7\u5236\u4EE3\u7801\u683C\u5F0F(\u9ED8\u8BA4\u914D\u5957\u4F7F\u7528prettier)?", false)];
            case 9: 
            // 执行构建命令
            return [4 /*yield*/, _b.apply(void 0, [(
                    // 是否需要eslint + perttier
                    _c.eslint = _d.sent(),
                        _c)])];
            case 10:
                // 执行构建命令
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
commander.program.parse(process.argv);
