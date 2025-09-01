# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

This is a monorepo containing personal [Obsidian plugins](https://docs.obsidian.md/Plugins/Getting+started/) built with TypeScript. The monorepo structure allows plugins to share common code through the `shared/` directory.

## Development Commands

- `pnpm dev`: Start development server with hot reload (requires `$OBSIDIAN_DEVELOPMENT_VAULT` env var)
- `pnpm prod`: Build plugins and copy to production vault (requires `$OBSIDIAN_VAULT` env var)
- `pnpm build`: Build all plugins to `dist/` directory
- `pnpm lint`: Run ESLint and Prettier

## Architecture

### Plugin Structure

Each plugin in `plugins/` follows the standard Obsidian plugin structure:

- `main.ts` - Plugin entry point extending Obsidian's `Plugin` class
- `manifest.json` - Plugin metadata
- Individual plugins may have subdirectories for commands, settings, utilities, etc.

### Shared Code

The `shared/` directory contains common utilities used across plugins:

- String manipulation, date handling, file operations
- List item parsing and task list item utilities
- Whitespace and periodic notes helpers

### Build System

- Uses esbuild for bundling (configured in `esbuild.config.mjs`)
- TypeScript compilation with strict settings
- Development builds output directly to vault plugins directory
- Production builds go to `dist/` then get copied to vault

## Current Plugins

- **cleaner** - Removes "empty" content from files
- **list-cycler** - Cycles between different list types and checkboxes
- **list-item-deleter** - Quick deletion of list items with backspace
- **project-manager** - Manages project-based task lists using clean markdown formatting
- **task-forwarder** - Forwards tasks from previous daily notes

## Environment Variables

- `$OBSIDIAN_DEVELOPMENT_VAULT` - Path to development vault for `pnpm dev`
- `$OBSIDIAN_VAULT` - Path to production vault for `pnpm prod`
