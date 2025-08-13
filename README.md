# Dev Data Dashboard README

This is the README for the extension "Dev Data Dashboard".

The intent of this extension is to allow monitoring and visualizing
important software metrics using AI tools with `Continue.dev`.

## Features

Accepted Autocompletions rate:
 - The autocompletions from the continue extesion are
   tracked and rendered in the dashboard.
 - The length of accepted/rejected autocompletions are
   tracked and rendered in two distinct plots in the
   dashboard.

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

## Packaged Install

The vscode extension is not released onto the VSCode marketplace
currently. If `vsce` is not installed already you can do
`npm install -g @vscode/vsce` to install globally.
To install the tip of `MAIN` navigate to the top level directory
you have cloned from git remote. Then do:

```bash
vsce package
```
now you should see a file called

`devdataboard-<major.minor.bugfix>.vsix`
where the version number inside the `<>` corresponds to your local
setting in package.json.

The installation can now proceed as shown

https://github.com/user-attachments/assets/c5508224-bd8e-4ba4-b414-247032a1903f

Note the latest version contains additional plots
than those shown in the rendered dashboard in the
install demo video. Here is a screenshot of the default
view of the rendered dashboard.

<img width="693" height="1094" alt="Screenshot 2025-08-13 at 7 31 26 PM" src="https://github.com/user-attachments/assets/c9fbc0f8-07aa-45a0-bc7b-de6db38b8a7f" />

## Release Notes

The first release has not be done yet.
This is development toward a `0.1.0` version.

### 0.1.0

- Accepted/rejected count of autocompletes.
- Accepted/rejected lengths over time are plotted in two panels

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
