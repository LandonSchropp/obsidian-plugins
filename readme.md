# Obsidian Plugins

This is a monorepo containing all of my personal Obsidian plugins. The monorepo structure makes it
easier to develop plugins without duplicating infrastructure, and allows the plugins to share code.

These plugins will unfortunately _not_ be released to the Obsidian Community Plugins store. While
I'd be happy to contribute back to the community, Obsidian's process makes it unnecessarily
cumbersome to submit plugins, and they don't support the monorepo structure.

If you're interested in extracting one of these plugins, submitting it and maintaining it, please
let me know. I'd be more than happy to assist. 🙂

## Plugins

Right now, this repo contains the following Obsidian plugins:

- [List Cycler](/plugins/list-cycler/readme.md): Cycles between different types of lists and
  checkboxes
- [Task Forwarder](/plugins/task-forwarder/readme.md): Forwards tasks from previous daily notes
- [List Deleter](/plugins/list-item-deleter/readme.md): Quickly delete list items with the backspace
- [Cleaner](/plugins/cleaner/readme.md): Removes "empty" content of files
- [Extractor](/plugins/extractor/readme.md): Extracts selected text into a new note

## Installation

If you'd like to install these plugins, you can do so by doing the following.

1. Ensure you have the correct versions of Node.js and pnpm installed.
2. Set the `$OBSIDIAN_VAULT` environment variable to point to the root of your vault.
3. Run `pnpm prod`, which will build the plugins and copy them to your Obsidian vault.

## Local Development

This repo contains a few useful `pnpm` commands to assist with development.

- `pnpm lint`: Runs Prettier and ESLint.
- `pnpm build`: Generates a build of each plugin to the `dist` folder.
- `pnpm dev`: This starts up the development server, automatically rebuilding each plugin when the
  content is changed. It also automatically generates the plugin directories in the development
  vault and symlinks the build files so the plugin can be iterated on. This command requires the
  `$OBSIDIAN_DEVELOPMENT_VAULT` environment variable to be defined.
