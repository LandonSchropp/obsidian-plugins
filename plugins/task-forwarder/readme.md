# Task Forwarder

This is a plugin for importing tasks from the previous day's daily note to the current day.

This is a plugin build around my _personal_ workflow for importing tasks from previous daily notes.
Since it's catered specifically to the way that I work, I'm not releasing it to the Obsidian
Community Plugin store. It also doesn't include any settings for the same reason.

If you stumble across this plugin and would like to see it released, let me know, and I may
reconsider.

## Assumptions

Since this plugin isn't being released and it's tailored to my personal workflow, it makes a few
assumptions about the structures of the notes it interacts with.

- This plugin currently only work with the Daily Notes plugin. If there's demand, I can add support
  for [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes).
- All daily notes must be located in the `Daily Notes` folder.
- The notes must be in alphabetical order. (It would likely be better to parse the note names using
  the scheme identified in the Daily Notes plugin, but this isn't necessary for my notes.)
- The note will look at the previous seven days worth of notes.
- All tasks are imported under the first heading labeled "Tasks".

## Setup

This plugin should be used with a theme that supports alternative checkboxes, such as
[Minimal](https://minimal.guide/checklists) or
[Things](https://github.com/colineckert/obsidian-things?tab=readme-ov-file#checkbox-styling).
Otherwise, you won't be able to distinguish between the list types. It's also helpful to use a
plugin like [List Cycler](https://github.com/LandonSchropp/obsidian-list-cycler/edit/main/readme.md)
to quickly switch between task types.

## How It Works

Task Forwarder adds a couple of new commands: `Task Forwarder: Forward Tasks to Today's Daily Note`
and `Task Forwarder: Forward Tasks`. When you run these commands, Task forwarder will collect the
tasks from the previous day and process them in different ways:

- **Completed tasks (`[x]`):** These are ignored. They're already completed, so there's no action to
  take.

- **Incomplete tasks (`[ ]`):** These are _also_ ignored. An incomplete item is treated as a task
  that hasn't yet been considered. If you have any incomplete tasks in your previous daily notes,
  Task Forwarder will display a warning.

- **Forwarded tasks (`[>]`):** If you've mark a task as forwarded, then Task Forwarder will copy it to
  the current day's note.

* **Scheduled tasks (`[<]`):** Scheduled tasks are handled a little differently than forwarded
  tasks. Like forwarded tasks, they're copied to the current day's note. However, unlike forwarded
  tasks, they're removed from note where they originated. This is a convenient way of signaling that
  a task should be recorded, but it's too early to act upon it.

All other types of tasks are ignored by the plugin. It will also ignore any tasks that have already
been imported into the current day, making the command idempotent. 😎

> [!NOTE]  
> In the future, instead of hardcoding the actions to perform with each task, I may make the actions
> configurable. However, that's not worth it unless I decide to release the plugin.
