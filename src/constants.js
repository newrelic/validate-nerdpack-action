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
