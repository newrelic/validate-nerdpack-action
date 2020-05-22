[![Community Project header](https://github.com/newrelic/open-source-office/raw/master/examples/categories/images/Community_Project.png)](https://github.com/newrelic/open-source-office/blob/master/examples/categories/index.md#community-project)

# Validate Nerdpack Action

A GitHub Action to check for the presence of our standard open source files, catalog files (if applicable), and package script commands.

## Inputs

| Key        | Required | Default | Description                                                                                                                                  |
| ---------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `files`    | no       | -       | Comma-separated list of files to validate existence for. These are appended to default list of files, unless `override` flag is set to true. |
| `path`     | no       | -       | Sets the directory the Action will run from.                                                                                                 |
| `override` | no       | false   | By default, the files option will append to the default list of files being checked. This flag allows overwriting the whole list.            |

# Example Usage

TODO: Add better example usage here

Include something like this in a `pr.yml` file:

```yaml
name: "Build and Validate Nerdpack"
on: [pull_request, push]

jobs:
  validate-nerdpack-action:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: "Validate Nerdpack"
        uses: newrelic/validate-nerdpack-action@v1
        with:
          files: "package.json, LICENSE, README.md, foo, bar"
```

## License
Validate Nerdpack Action is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
>[If applicable: The [Project Name] also uses source code from third party libraries. Full details on which libraries are used and the terms under which they are licensed can be found in the third party notices document.]
