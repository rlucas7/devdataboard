# Dev Data Dashboard README

This is the README for the extension "Dev Data Dashboard".

The intent of this extension is to allow monitoring and visualizing
important software metrics using AI tools with `Continue.dev`.

## Features

Accepted Autocompletions rate:
 - The autocompletions from the continue extesion are
   tracked and rendered in the dashboard.


## Requirements

See `package.json` for runtime dependency and dev-dependency info.

## Extension Settings

So far there are so changes to VS Code settings through the
 `contributes.configuration` extension point. In the future
 we might have use of these.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

For now this only uses the `dev_data/0.2.0/autocompletions.jsonl` file.
I run a mac air so testing is primarily on mac. If run ubuntu or other
*nix or windows and you see any issues please open an issue which details
what is not working.

## Release Notes

The first release has not be done yet.
This is development toward a `0.1.0` version.

### 0.1.0

- Accepted/rejected count of autocompletes.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
