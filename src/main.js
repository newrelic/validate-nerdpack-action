const core = require('@actions/core');
const path = require('path');
const fsp = require('fs').promises;
const fs = require('fs');

const { DEFAULT_NERDPACK_FILES, CATALOG_FILES } = require('./constants');

async function run() {
  await validatePackageJson();

  await validateNerdpackFiles();

  await validateCatalogFiles();
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
    const inputPath = core.getInput('path') || process.env.PATH || '';
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
    if (doesntExist.length > 0) {
      core.setFailed(`These files do not exist: ${doesntExist.join(', ')}`);
    }
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
    const inputPath = core.getInput('path') || process.env.PATH || '';

    const catalogPath = path.join(inputPath, 'catalog');
    if (fs.existsSync(catalogPath)) {
      // First check catalog files
      const doesntExist = [];
      CATALOG_FILES.forEach(function (file) {
        const pathedFile = path.join(catalogPath, file);

        // eslint-disable-next-line no-console
        console.debug(`Pathed file: ${pathedFile}`);

        if (!fs.existsSync(pathedFile)) {
          doesntExist.push(pathedFile);
        }
      });
      if (doesntExist.length > 0) {
        core.setFailed(`These files do not exist: ${doesntExist.join(', ')}`);
      }

      // Now check screenshots
      await validateScreenshotsDir();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function validateScreenshotsDir() {
  const wd = process.env.GITHUB_WORKSPACE || '';
  const inputPath = core.getInput('path') || process.env.PATH || '';
  const screenshotsPath = path.join(wd, inputPath, 'catalog/screenshots');

  try {
    const screenshotsFiles = await fsp.readdir(screenshotsPath);
    if (!screenshotsFiles.length) {
      core.setFailed(
        `No screenshots present in catalog/screenshots. Must have at least one.`
      );
    }
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
    const inputPath = core.getInput('path') || process.env.PATH || '';
    const packageJsonPath = path.join(workspaceDir, inputPath, 'package.json');

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
    core.setFailed(error.message);
  }
}

run();
