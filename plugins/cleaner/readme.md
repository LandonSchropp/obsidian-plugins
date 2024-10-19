# Obsidian Cleaner

This is a plugin for removing unused and unfilled sections of notes. It's especially useful for
notes created from templates that won't always have all sections filled out.

This is a plugin build around my personal daily notes workflow. Since it's catered specifically to
the way that I work, I'm not releasing it to the Obsidian Community Plugin store. It also doesn't
include any settings for the same reason.

## How It Works

This plugin provides a `Cleaner: Clean Current Note` command which will clean the currently open
note in the editor. When run, the command will remove the following from the note:

- HTML Comments
- Empty list items
- Headers with empty content
- Lines containing only whitespace
- Multiple empty lines

When a new daily note is created, this plugin will also clean the previous daily note.
