# Component-compare

Get the diff of two versions of component from command line.

By default, it checks duplicates component and prompt you to select two version for comparison.

Need `colordiff` installed to show the diff in command line, on MacOS you can do

    brew install colordiff

With `-b` (aka browser) option you can also get the diff infomation shown on github, the tags are retrived remotely.

It **must** be runned under component project which contains file `component.json`.

## Usage

    component compare [-b] [repo]

## License

MIT
