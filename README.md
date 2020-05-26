[![Community Project header](https://github.com/newrelic/open-source-office/raw/master/examples/categories/images/Community_Project.png)](https://github.com/newrelic/open-source-office/blob/master/examples/categories/index.md#community-project)

# Validate Nerdpack Action

[![GitHub Marketplace version](https://img.shields.io/github/release/newrelic/validate-nerdpack-action.svg?label=Marketplace&logo=github)](https://github.com/marketplace/actions/validate-nerdpack-action)

A GitHub Action to check for the presence of our standard open source files, catalog files (if applicable), and package script commands.

## Inputs

| Key        | Required | Default | Description                                                                                                                                  |
| ---------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `files`    | no       | -       | Comma-separated list of files to validate existence for. These are appended to default list of files, unless `override` flag is set to true. |
| `path`     | no       | -       | Sets the directory the Action will run from.                                                                                                 |
| `override` | no       | false   | By default, the files option will append to the default list of files being checked. This flag allows overwriting the whole list.            |

## Example Usage

### Basic validation

The following example shows how to use the valiate-nerdpace-action to ensure all Nerdpack standards are adhered to in a Pull Request.

```yaml
name: "Build and Validate Nerdpack"

on:
  pull_request:
      branches:
        - master

jobs:
  validate-nerdpack:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: "Validate Nerdpack"
        uses: newrelic/validate-nerdpack-action@v1
        with:
          files: "package.json, LICENSE, README.md, foo, bar"
      
      # Now run nr1 nerdpack:validate to ensure nerdpack is able to be published
      - name: Install NR1 CLI
        run: |
          curl -s https://cli.nr-ext.net/installer.sh | sudo bash
      - name: Validate Nerdpack Schema
        run: |
          nr1 nerdpack:validate
```

## Custom Input Options

Add `files`, `path`, and `override` configuration.

```yaml
name: "Build and Validate Nerdpack"

on: 
  pull_request:
      branches:
        - master

jobs:
  validate-nerdpack:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: "Validate Nerdpack"
        uses: newrelic/validate-nerdpack-action@v1
        with:
          files: "package.json, LICENSE, README.md, foo, bar"
          override: true
          path: ./apps/nr1-browser-analyzer # set Action to run from base Nerdpack directory
      
      # Now run nr1 nerdpack:validate to ensure nerdpack is able to be published
      - name: Install NR1 CLI
        run: |
          curl -s https://cli.nr-ext.net/installer.sh | sudo bash
      - name: Validate Nerdpack Schema
        run: |
          nr1 nerdpack:validate
```

## License
Validate Nerdpack Action is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
>[If applicable: The [Project Name] also uses source code from third party libraries. Full details on which libraries are used and the terms under which they are licensed can be found in the third party notices document.]
