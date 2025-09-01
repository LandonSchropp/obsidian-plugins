# Obsidian Project Manager

A lightweight Obsidian plugin for managing project-based task lists using clean markdown formatting.
The focus is on long-term, non-time-bound projects.

This is a plugin built around my personal project management workflow. Since it's catered
specifically to the way that I work, I'm not releasing it to the Obsidian Community Plugin store. It
also doesn't include any settings for the same reason.

## Features

- **One file per project:** Tasks are self-contained within project notes.
- **Standard markdown checkboxes:** Custom states for different task phases.
- **Automatic task organization:** Items are organized under status headers.
- **Categories:** Tasks can be tagged using `[category:: Name]` syntax.
- **Archiving:** Move completed and cancelled items to Archive section.
- **Prettier:** The plugin follows standard markdown formatting.
- **Plain text:** Files remain clean and manually editable.

## File Format

Tasks are organized under markdown headers, which correspond to statuses. The items under each
header are assigned a specific checkbox:

- `[<]` Backlog
- `[?]` Blocked
- `[ ]` To-Do
- `[/]` In Progress
- `[x]` Done
- `[-]` Cancelled

When items are moved under headers, they're automatically assigned the appropriate checkbox. New
list items created under headers automatically use the header's checkbox style as well.

Finally, any text at the beginning of a section is ignored.

### Example

```markdown
## Backlog

- [<] Future feature to consider later

## Blocked

- [?] Task waiting for external dependency

## To-Do

- [ ] Build MCP server for todos

      Should integrate with Obsidian and support categories.
      Could potentially replace the kanban plugin entirely.

      [category:: MCP]

## In Progress

- [/] Research todo formats [category:: Research]

## Done

- [x] Document requirements [category:: Planning]

## Cancelled

- [-] Old feature that's no longer needed

## Archive

Completed and cancelled items can be moved here to keep the active sections clean.
```
