[![Community Project header](https://github.com/newrelic/open-source-office/raw/master/examples/categories/images/Community_Project.png)](https://github.com/newrelic/open-source-office/blob/master/examples/categories/index.md#community-project)

# [Validate Nerdpack Action] [build badges go here when available]

Checks for the presence of OSS Standard Nerdpack files and commands in the repository

This is a basic sanity check for files that need to be there. Will
complain if they are missing, or changed name.

# Use it

Include something like this in a `file-presence.yml` file:

```yaml
name: "File presence check"
on: [pull_request, push]

jobs:
  file_presence:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: "Check file presence"
        uses: JJ/files-present-action@releases/v1
        with:
          files: "package.json, LICENSE, README.md, foo, bar"
```


## Installation

> [Include a step-by-step procedure on how to get your code installed. Be sure to include any third party dependencies that need to be installed separately]

## Getting Started
>Simple steps to start working with the software similar to a "Hello World"

## Usage - optional
>Include more thorough instructions on how to use the software. This section may not be needed if the Getting Started section is enough.


## Building - optional

>Include this section if users will need to follow specific instructions to build the software from source. Be sure to include any third party build dependencies that need to be installed separately

## Testing - optional

>Include instructions on how to run tests if we include tests with the codebase

## Support

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

>Add the url for the support thread here

## Contributing
Full details about how to contribute to
Contributions to improve [Project Name] are encouraged! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.
To execute our corporate CLA, which is required if your contribution is on behalf of a company, or if you have any questions, please drop us an email at open-source@newrelic.com.

## License
[Project Name] is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
>[If applicable: The [Project Name] also uses source code from third party libraries. Full details on which libraries are used and the terms under which they are licensed can be found in the third party notices document.]
