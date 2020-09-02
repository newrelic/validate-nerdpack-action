const core = require('@actions/core');
const path = require('path');
const fsp = require('fs').promises;
const semver = require('semver');

const {
  DEFAULT_NERDPACK_FILES,
  CATALOG_FILES,
  SCREENSHOTS_DIR,
  REACT_PINNED_VERSION,
  REACT_DOM_PINNED_VERSION
} = require('./constants');

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
        `>> SUMMARY >> These files do not exist: ${allMissingFiles.join(', ')}`
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

      // Catalog files checked, now check screenshots
      const screenshotsFilesResult = !missingCatalogFiles.includes(
        SCREENSHOTS_DIR
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
  const screenshotsPath = path.join(wd, inputPath, SCREENSHOTS_DIR);
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
  // validate `react`
  const reactDependencySatisfied =
    packageJson &&
    packageJson.dependencies &&
    packageJson.dependencies.react &&
    semver.satisfies(packageJson.dependencies.react, REACT_PINNED_VERSION);

  const reactDevDependencySatisfied =
    packageJson &&
    packageJson.devDependencies &&
    packageJson.devDependencies.react &&
    semver.satisfies(packageJson.devDependencies.react, REACT_PINNED_VERSION);

  if (!reactDependencySatisfied && !reactDevDependencySatisfied) {
    core.setFailed(
      `validatePackageJson | react version must be set to ${REACT_PINNED_VERSION} - currently set to ${packageJson.dependencies.react}`
    );
  }

  // validate `react-dom`
  const reactDomDependencySatisfied =
    packageJson &&
    packageJson.dependencies &&
    packageJson.dependencies['react-dom'] &&
    semver.satisfies(
      packageJson.dependencies['react-dom'],
      REACT_DOM_PINNED_VERSION
    );

  const reactDomDevDependencySatisfied =
    packageJson &&
    packageJson.devDependencies &&
    packageJson.devDependencies['react-dom'] &&
    semver.satisfies(
      packageJson.devDependencies['react-dom'],
      REACT_DOM_PINNED_VERSION
    );

  if (!reactDomDependencySatisfied && !reactDomDevDependencySatisfied) {
    core.setFailed(
      `validatePackageJson | react-dom version must be set to ${REACT_DOM_PINNED_VERSION} - currently set to ${packageJson.dependencies['react-dom']}`
    );
  }
}

run();
