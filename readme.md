# Obsidian Plugins

This is a monorepo containing all of my personal Obsidian plugins. The monorepo structure makes it
easier to develop plugins without duplicating infrastructure, and allows the plugins to share code.

At this time, it's unclear if Obsidian supports monorepos for their community plugins, so these
plugins may or may not get released.

## Plugins

Right now, this repo contains the following Obsidian plugins:

- [Task Forwarder](/plugins/task-forwarder/readme.md): Forwards tasks from previous daily notes
- [List Deleter](/plugins/list-item-deleter/readme.md): Quickly delete list items with the backspace
- [Cleaner](/plugins/cleaner/readme.md): Removes "empty" content of files

## Usage

This repo contains a few useful `pnpm` commands to assist with development.

- `pnpm build`: Generates a build of each plugin to the `dist` folder.
- `pnpm dev`: This starts up the development server, automatically rebuilding each plugin when the
  content is changed. It also automatically generates the plugin directories in the development
  vault and symlinks the build files so the plugin can be iterated on. This command requires the
  `$OBSIDIAN_DEVELOPMENT_VAULT` environment variable to be defined.
- `pnpm prod`: This builds and "deploys" the plugins to the Obsidian vault. Unlike the `dev`
  command, this copies the generated build files, which allows them to be synced to other files.
  This command requires the `$OBSIDIAN_VAULT` environment variable to be defined.
