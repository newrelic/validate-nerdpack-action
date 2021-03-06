## [1.0.5](https://github.com/newrelic/validate-nerdpack-action/compare/v1.0.4...v1.0.5) (2021-04-28)


### Bug Fixes

* remove check for pinned React/React-Dom versions ([d6eddf6](https://github.com/newrelic/validate-nerdpack-action/commit/d6eddf664279f6221d83d5a6c606fd9a46534254))

## [1.0.4](https://github.com/newrelic/validate-nerdpack-action/compare/v1.0.3...v1.0.4) (2020-10-20)


### Bug Fixes

* remove checking for CoC because it now comes from .github repo ([957f9a4](https://github.com/newrelic/validate-nerdpack-action/commit/957f9a4861c8271b55e7ec940fd1d1cc3618192a))

## [1.0.3](https://github.com/newrelic/validate-nerdpack-action/compare/v1.0.2...v1.0.3) (2020-09-02)


### Bug Fixes

* better checking of react version in deps or devDeps ([235bdd7](https://github.com/newrelic/validate-nerdpack-action/commit/235bdd790d2f7137834108a02bb03fd21c159848))

## [1.0.2](https://github.com/newrelic/validate-nerdpack-action/compare/v1.0.1...v1.0.2) (2020-05-27)


### Bug Fixes

* ensure correct ordering of jobs ([82867a2](https://github.com/newrelic/validate-nerdpack-action/commit/82867a22ccdc9b64bf4dcde812d392d9c56d3e5a))
* include dist/index.js in tag after semantic-release runs ([0609351](https://github.com/newrelic/validate-nerdpack-action/commit/06093512ce40754bd751486cf5c93f18b3fff89f))

## [1.0.1](https://github.com/newrelic/validate-nerdpack-action/compare/v1.0.0...v1.0.1) (2020-05-27)


### Bug Fixes

* need to run build for dist/index.js to be included in release ([a72f13c](https://github.com/newrelic/validate-nerdpack-action/commit/a72f13c7daf56a695b11e1e8481ff6846b555da4))

# 1.0.0 (2020-05-27)


### Bug Fixes

* .releaserc typo and fixing logic mistake with React checks ([2337ad7](https://github.com/newrelic/validate-nerdpack-action/commit/2337ad7bedd292ebd841fafba69489a9a73ab57e))
* adding some logging ([c33fbee](https://github.com/newrelic/validate-nerdpack-action/commit/c33fbeefacb360052ce42afeeaebc939a785c3ec))
* await all promises ([d855093](https://github.com/newrelic/validate-nerdpack-action/commit/d855093e2a4ee342692f3a283bedc9a8b45fac20))
* better logging for react version issues ([0da09d8](https://github.com/newrelic/validate-nerdpack-action/commit/0da09d831fe90f0d1731a425e84a36554276e1c1))
* don't forget to await, kids ([3a3beb2](https://github.com/newrelic/validate-nerdpack-action/commit/3a3beb208bc146a3bb984400f8b47f22cd190d45))
* filter after we await Promise.all ([5dd2c27](https://github.com/newrelic/validate-nerdpack-action/commit/5dd2c2788b10ee985053e5d83b48be86e1a6d0f5))
* formatting not working without this for some reason ([1b1d2ce](https://github.com/newrelic/validate-nerdpack-action/commit/1b1d2cecee1221ae9ea13010a50f640d0a4c3a1c))
* going back to setting errors along the way and improving screenshots check ([0c785f3](https://github.com/newrelic/validate-nerdpack-action/commit/0c785f3cf90e627e0607142d7a3d8b098caf86bb))
* logic *should* flow now ([54f36c6](https://github.com/newrelic/validate-nerdpack-action/commit/54f36c6747ae5ee6bcdfe84ed18a71c02cd53677))
* make this non-async/await ([8ecc475](https://github.com/newrelic/validate-nerdpack-action/commit/8ecc475abdb8cf6548454b70b63379b6679e2d3b))
* need default return values ([e330e6e](https://github.com/newrelic/validate-nerdpack-action/commit/e330e6ed05c28187c2dba0ed96895c2526516bb6))
* need to use different path to check catalog files ([57a86c6](https://github.com/newrelic/validate-nerdpack-action/commit/57a86c6427ed05792f691430015a5aeafc649802))
* need to use different path to check catalog files (forgot file) ([6de2696](https://github.com/newrelic/validate-nerdpack-action/commit/6de26969f5795cb1121f2d67f6e4d7e8fc5d0843))
* process.env.PATH is already a thing, so don't use that :facepalm: ([791d0b3](https://github.com/newrelic/validate-nerdpack-action/commit/791d0b360c0893af03928e113a0bb4a1f9f584ca))
* return empty array for spread to work ([992531f](https://github.com/newrelic/validate-nerdpack-action/commit/992531f084e40a0d55ea972dbbb9640141a48ae2))
* reworked async/await handling ([07b172b](https://github.com/newrelic/validate-nerdpack-action/commit/07b172b901994678bb84f36cfac53471e0d2630d))
* try once more ([a77ae00](https://github.com/newrelic/validate-nerdpack-action/commit/a77ae001bac45fa182493991ba512be0f767e2f2))
* typo ([68adc8c](https://github.com/newrelic/validate-nerdpack-action/commit/68adc8ccdc6ff0b5dbf20a20f2bf9b21fcbb8c87))
* updating main entry point to be correct name ([216d191](https://github.com/newrelic/validate-nerdpack-action/commit/216d1916c3917a1a6998920a137e57da744dfe59))
* wrong var ([760da3a](https://github.com/newrelic/validate-nerdpack-action/commit/760da3ac68d875114b3eeb13cdd23258534574bb))


### Features

* removing release workflow to let semantic-release do it's thing ([cc2836c](https://github.com/newrelic/validate-nerdpack-action/commit/cc2836c692f30b4fb397751a04539024f1ec851e))
* **workflows:** added build and generate-third-party-notices jobs ([c830f01](https://github.com/newrelic/validate-nerdpack-action/commit/c830f01aa2fcf13b4a29b178def9bfdffe36c310))
* add semantic-release config and workflows ([1acead3](https://github.com/newrelic/validate-nerdpack-action/commit/1acead304ac46a620c2fe9a5764467c18cb8f6ad))
* added semver to perform React version check ([d6c1c4e](https://github.com/newrelic/validate-nerdpack-action/commit/d6c1c4ee49067891c4f08b14c4a1286b4aa4b405))
* adding built output for test run ([4b09c03](https://github.com/newrelic/validate-nerdpack-action/commit/4b09c03ccc5b71be3aad9ff431c61afa982cb046))
* logging cleanup, verifying pinned React version, better promise usage ([60ea923](https://github.com/newrelic/validate-nerdpack-action/commit/60ea92321c131e98e272ef48a007583f9c0926af))
* removed typescript in favor of simplifying things ([b177062](https://github.com/newrelic/validate-nerdpack-action/commit/b1770623d74c11336104d64b6ba18d394a6411d2))
* testing out this idea for map/filter ([e741fdd](https://github.com/newrelic/validate-nerdpack-action/commit/e741fdde45eed340a42a7d58bb2a4c48e12b8f3b))
