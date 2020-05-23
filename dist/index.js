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

const {
  DEFAULT_NERDPACK_FILES,
  CATALOG_FILES,
  REACT_PINNED_VERSION,
  REACT_DOM_PINNED_VERSION
} = __webpack_require__(648);

/**
 * Performs series of validation checks:
 *  - Validates version, scripts, and React version in package.json
 *  - Validates OSS Nerdpack files are present
 *  - If catalog directory is present, validates required catalog files
 */
async function run() {
  try {
    await validatePackageJson();

    const missingNerdpackFiles = await validateNerdpackFiles();
    const missingCatalogFiles = await validateCatalogFiles();
    const allMissingFiles = [...missingNerdpackFiles, ...missingCatalogFiles];

    if (allMissingFiles.length > 0) {
      core.setFailed(
        `-- SUMMARY >> These files do not exist: ${allMissingFiles.join(', ')}`
      );
    }
  } catch (error) {
    core.setFailed(`Error occurred run | ${error.message}`);
  }
}

/**
 * Helper to check for existance of @param file and returns file name
 * (including @param inputPath) if it exists. Otherwise, returns null.
 * @param {*} inputPath Path to the file
 * @param {*} file Name of file to check
 */
async function checkFileExists(inputPath, file) {
  const pathedFile = path.join(inputPath, file);

  const fileExists = await fsp
    .access(pathedFile)
    .then(() => true)
    .catch(() => false);

  // eslint-disable-next-line no-console
  console.debug(`Pathed file: ${pathedFile} | Exists: ${fileExists}`);

  return !fileExists ? pathedFile : null;
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
  // eslint-disable-next-line no-console
  console.log(`-- Validating Nerdpack Files --`);

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

    const missingNerdpackFiles = (
      await Promise.all(
        fileList.map((file) => checkFileExists(inputPath, file))
      )
    ).filter((f) => f);

    return missingNerdpackFiles;
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
  // eslint-disable-next-line no-console
  console.log(`-- Validating catalog files --`);

  try {
    const inputPath = core.getInput('path') || '';
    const catalogPath = path.join(inputPath, 'catalog');
    const defaultSuccessResponse = [];

    const catalogDirExists = await fsp
      .access(catalogPath)
      .then(() => true)
      .catch(() => false);

    if (catalogDirExists) {
      const missingCatalogFiles = (
        await Promise.all(
          CATALOG_FILES.map((file) => checkFileExists(inputPath, file))
        )
      ).filter((f) => f);

      // Now check screenshots
      const screenshotsFilesResult = !missingCatalogFiles.includes(
        'catalog/screenshots'
      )
        ? await validateScreenshotsDir()
        : null;

      return missingCatalogFiles.length > 0 || screenshotsFilesResult
        ? [...missingCatalogFiles, screenshotsFilesResult].filter((f) => f)
        : defaultSuccessResponse;
    }

    return defaultSuccessResponse;
  } catch (error) {
    core.setFailed(error.message);
  }
}

/**
 * If the catalog/screenshots directory exists, this validates that at least
 * one screenshot exists.
 */
async function validateScreenshotsDir() {
  // eslint-disable-next-line no-console
  console.log(`-- Validating catalog/screenshot directory --`);

  const wd = process.env.GITHUB_WORKSPACE || '';
  const inputPath = core.getInput('path') || '';
  const screenshotsPath = path.join(wd, inputPath, 'catalog/screenshots');
  // const defaultSuccessResponse = [];

  try {
    const screenshotsFiles = await fsp
      .readdir(screenshotsPath)
      .then((files) => files)
      .catch(() => []);

    // eslint-disable-next-line no-console
    console.log(`Files in catalog/screenshots: ${screenshotsFiles}`);

    return !screenshotsFiles.length
      ? `No screenshots present in catalog/screenshots - must have at least one.`
      : null;

    // return defaultSuccessResponse;
  } catch (error) {
    core.setFailed(`Failed to read catalog/screenshots directory.`);
    return [`Failed to read catalog/screenshots but it appears to be empty`];
  }
}

/**
 * package.json should contain the following fields:
 *  - version
 *  - scripts.eslint-check
 *  - scripts.eslint-fix
 * @see {@link https://github.com/newrelic/nr1-catalog/issues/3|Issue 3}
 */
async function validatePackageJson() {
  // eslint-disable-next-line no-console
  console.log(`-- Validating package.json --`);

  try {
    const workspaceDir = process.env.GITHUB_WORKSPACE || './';
    const inputPath = core.getInput('path') || '';
    const packageJsonPath = path.join(workspaceDir, inputPath, 'package.json');

    // eslint-disable-next-line no-console
    console.log(
      `> workspaceDir: ${workspaceDir} \n> inputPath: ${inputPath} \n> packageJsonPath: ${packageJsonPath}`
    );

    const rawPackageJsonData = await fsp.readFile(packageJsonPath);
    const packageJson = JSON.parse(rawPackageJsonData);

    // Version Check
    validateSemanticVersionExists(packageJson);

    // Scripts Check
    validateScripts(packageJson);

    // React pinned library check
    validatePinnedReactVersion(packageJson);
  } catch (error) {
    core.setFailed(`Error occurred in validatePackageJson | ${error.message}`);
  }
}

function validateSemanticVersionExists(packageJson) {
  if (packageJson && !packageJson.version) {
    core.setFailed(`validatePackageJson | version missing from package.json`);
  }
}

function validateScripts(packageJson) {
  if (packageJson && !packageJson.scripts) {
    core.setFailed(`validatePackageJson | scripts missing from package.json`);
  }

  if (packageJson && !packageJson.scripts['eslint-check']) {
    core.setFailed(
      `validatePackageJson | eslint-check missing from package.json#scripts`
    );
  }

  if (packageJson && !packageJson.scripts['eslint-fix']) {
    core.setFailed(
      `validatePackageJson | eslint-fix missing from package.json#scripts`
    );
  }
}

function validatePinnedReactVersion(packageJson) {
  if (packageJson && !packageJson.dependencies.react !== REACT_PINNED_VERSION) {
    core.setFailed(
      `validatePackageJson | react version must be set to ${REACT_PINNED_VERSION}`
    );
  }
  if (
    packageJson &&
    !packageJson.dependencies['react-dom'] !== REACT_DOM_PINNED_VERSION
  ) {
    core.setFailed(
      `validatePackageJson | react-dom version must be set to ${REACT_DOM_PINNED_VERSION}`
    );
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
  'package.json',
  'package-lock.json',
  'nr1.json',
  'releaserc',
  'cla.md',
  'third_party_manifest.json',

  'THIRD_PARTY_NOTICES.md',
  'LICENSE',
  'CODE_OF_CONDUCT.md',
  'CONTRIBUTING.md',

  '.prettierrc.js',
  '.eslintrc.js',
  '.gitignore',
  '.github/ISSUE_TEMPLATE/bug_report.md',
  '.github/ISSUE_TEMPLATE/enhancement.md',
  '.github/workflows/pr.yml',
  '.github/workflows/release.yml'
];

const CATALOG_FILES = [
  'catalog/config.json',
  'catalog/documentation.md',
  'catalog/screenshots',
  'icon.png'
];

const REACT_PINNED_VERSION = '16.6.3';
const REACT_DOM_PINNED_VERSION = '16.6.3';

module.exports = {
  DEFAULT_NERDPACK_FILES,
  CATALOG_FILES,
  REACT_PINNED_VERSION,
  REACT_DOM_PINNED_VERSION
};


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ })

/******/ });