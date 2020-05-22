module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(31);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 31:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(470);
const path = __webpack_require__(622);
const fsp = __webpack_require__(747).promises;
const fs = __webpack_require__(747);

const { DEFAULT_NERDPACK_FILES, CATALOG_FILES } = __webpack_require__(648);

async function run() {
  await validatePackageJson();

  const missingNerdpackFiles = await validateNerdpackFiles();

  const missingCatalogFiles = await validateCatalogFiles();

  const result = [...missingNerdpackFiles, ...missingCatalogFiles];
  if (result.length > 0) {
    core.setFailed(`These files do not exist: ${result.join(', ')}`);
  }
}

/**
 * Validates that the common OSS Nerdpack files are present.
 * Note: The list of files checked is able to be extended
 * through the use of the `files` and `override` Action inputs.
 *
 * Actions execute from the github_workspace directory (i.e. the root of the
 * checked out repo). `path` provides a mechanism for changing to a different
 * directory and executing this check. It's worth noting that the `existsSync`
 * below is relative to github_workspace/${inputPath}
 */
async function validateNerdpackFiles() {
  try {
    const inputPath = core.getInput('path') || '';
    const inputFiles = core.getInput('files') || process.env.FILES || '';
    const override =
      (core.getInput('override') || process.env.OVERRIDE) === 'true';

    const combinedFileList = override
      ? inputFiles.split(/,\s+/)
      : [...DEFAULT_NERDPACK_FILES, ...inputFiles.split(/,\s*/)];

    const fileList =
      inputFiles.length > 0 ? combinedFileList : DEFAULT_NERDPACK_FILES;

    const doesntExist = [];
    fileList.forEach((file) => {
      const pathedFile = path.join(inputPath, file);

      // eslint-disable-next-line no-console
      console.debug(`Pathed file: ${pathedFile}`);

      if (!fs.existsSync(pathedFile)) {
        doesntExist.push(pathedFile);
      }
    });
    // if (doesntExist.length > 0) {
    //   core.setFailed(`These files do not exist: ${doesntExist.join(', ')}`);
    // }
    return doesntExist;
  } catch (error) {
    core.setFailed(error.message);
  }
}

/**
 * If the catalog directory exists, this validates that the common
 * New Relic One Catalog files are present.
 * @see {@link https://github.com/newrelic/template-nerdpack/issues/4}
 *
 * Actions execute from the github_workspace directory (i.e. the root of the
 * checked out repo). `path` provides a mechanism for changing to a different
 * directory and executing this check. It's worth noting that the `existsSync`
 * below is relative to github_workspace/${inputPath}
 */
async function validateCatalogFiles() {
  try {
    const inputPath = core.getInput('path') || '';

    const catalogPath = path.join(inputPath, 'catalog');
    if (fs.existsSync(catalogPath)) {
      // First check catalog files
      const doesntExist = [];
      CATALOG_FILES.forEach(function (file) {
        const pathedFile = path.join(inputPath, file);

        // eslint-disable-next-line no-console
        console.debug(`Pathed file: ${pathedFile}`);

        if (!fs.existsSync(pathedFile)) {
          doesntExist.push(pathedFile);
        }
      });
      // if (doesntExist.length > 0) {
      //   core.setFailed(`These files do not exist: ${doesntExist.join(', ')}`);
      // }

      // Now check screenshots
      const screenshotsFiles = await validateScreenshotsDir();

      return doesntExist.lenth > 0 || screenshotsFiles.length > 0
        ? [...doesntExist, ...screenshotsFiles]
        : [];
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function validateScreenshotsDir() {
  const wd = process.env.GITHUB_WORKSPACE || '';
  const inputPath = core.getInput('path') || '';
  const screenshotsPath = path.join(wd, inputPath, 'catalog/screenshots');

  try {
    const screenshotsFiles = await fsp.readdir(screenshotsPath);
    if (!screenshotsFiles.length)
      return `No screenshots present in catalog/screenshots. Must have at least one.`;
    // if (!screenshotsFiles.length) {
    //   core.setFailed(
    //     `No screenshots present in catalog/screenshots. Must have at least one.`
    //   );
    // }
  } catch (error) {
    core.setFailed(`Failed to read catalog/screenshots directory.`);
  }

  // fs.readdir(screenshotsPath, (err, files) => {
  //   if (err) {
  //     core.setFailed('Failed to read catalog/screenshots directory');
  //   }

  //   if (!files.length) {
  //     core.setFailed(
  //       'No screenshots present in catalog/screenshots. Must have at least one.'
  //     );
  //   }
  // });
}

/**
 * package.json should contain the following fields:
 *  - version
 *  - scripts.eslint-check
 *  - scripts.eslint-fix
 * @see {@link https://github.com/newrelic/nr1-catalog/issues/3|Issue 3}
 */
async function validatePackageJson() {
  try {
    const workspaceDir = process.env.GITHUB_WORKSPACE || './';
    const inputPath = core.getInput('path') || '';
    const packageJsonPath = path.join(workspaceDir, inputPath, 'package.json');

    console.log(`workspaceDir: ${workspaceDir}`);
    console.log(`inputPath: ${inputPath}`);
    console.log(`packageJsonPath: ${packageJsonPath}`);

    const rawPackageJsonData = await fsp.readFile(packageJsonPath);
    const packageJson = JSON.parse(rawPackageJsonData);

    if (packageJson && !packageJson.version) {
      // !packageJson.hasOwnProperty('version')) {
      core.setFailed('version missing from package.json');
    }

    if (packageJson && !packageJson.scripts) {
      // !packageJson.hasOwnProperty('scripts')) {
      core.setFailed('scripts missing from package.json');
    }

    if (packageJson && !packageJson.scripts['eslint-check']) {
      // !packageJson.scripts.hasOwnProperty('eslint-check')) {
      core.setFailed('eslint-check missing from package.json#scripts');
    }

    if (packageJson && !packageJson.scripts['eslint-fix']) {
      // !packageJson.scripts.hasOwnProperty('eslint-fix')) {
      core.setFailed('eslint-fix missing from package.json#scripts');
    }
  } catch (error) {
    core.setFailed(`Error occurred validatePackageJson | ${error.message}`);
  }
}

run();


/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store
 */
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 648:
/***/ (function(module) {

const DEFAULT_NERDPACK_FILES = [
  'README.md',
  '.prettierrc.js',
  '.eslintrc.js',
  '.gitignore',
  'package.json',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'CODE_OF_CONDUCT.md',
  'cla.md',
  '.github/ISSUE_TEMPLATE/bug_report.md',
  '.github/ISSUE_TEMPLATE/enhancement.md',
  'nr1.json'
];

const CATALOG_FILES = [
  'catalog/config.json',
  'catalog/documentation.md',
  'catalog/screenshots',
  'icon.png'
];

module.exports = {
  DEFAULT_NERDPACK_FILES,
  CATALOG_FILES
};


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ })

/******/ });