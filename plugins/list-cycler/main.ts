import { cycleListItemBackward, cycleListItemForward } from "./commands/commands";
import { Editor, MarkdownView, Plugin } from "obsidian";
import { SettingsView } from "./settings/settings-view";
import { GroupSettings, Settings } from "./types";
import { kebabCase } from "./utilities/string";
import { sanitizeListItem } from "./settings/sanitize";
import {
  BULLET_LIST_ITEM,
  DEFAULT_SETTINGS,
  EMPTY_LIST_ITEM,
  NUMBER_LIST_ITEM,
  TASK_LIST_ITEM,
} from "./settings/constants";

export default class ListCyclerPlugin extends Plugin {
  settings: Settings;

  async onload() {
    await this.loadSettings();

    // Add the group commands.
    for (const [index, group] of this.settings.groups.entries()) {
      this.addCommands(group, index);
    }

    // Add the other commands.
    this.addCommand({
      id: "remove-list",
      name: "Remove List",
      icon: "delete",
      callback: async () => {
        const editor = await this.activeEditor();
        if (editor) cycleListItemForward(editor, [EMPTY_LIST_ITEM.text]);
      },
    });

    this.addCommand({
      id: "convert-to-bullet-list",
      name: "Convert to Bullet List",
      icon: "list",
      callback: async () => {
        const editor = await this.activeEditor();
        if (editor) cycleListItemForward(editor, [`${BULLET_LIST_ITEM.text} `]);
      },
    });

    this.addCommand({
      id: "convert-to-number-list",
      name: "Convert to Number List",
      icon: "list-ordered",
      callback: async () => {
        const editor = await this.activeEditor();
        if (editor) cycleListItemForward(editor, [`${NUMBER_LIST_ITEM.text} `]);
      },
    });

    this.addCommand({
      id: "convert-to-task-list",
      name: "Convert to Task List",
      icon: "list-todo",
      callback: async () => {
        const editor = await this.activeEditor();
        if (editor) cycleListItemForward(editor, [`${TASK_LIST_ITEM.text} `]);
      },
    });

    // Load the settings
    this.addSettingTab(new SettingsView(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  addCommands(group: GroupSettings, index: number) {
    this.addCommand({
      id: this.generateCommandId(group.name, "forward"),
      name: `Cycle ${group.name} Forward`,
      icon: "square-chevron-right",
      callback: async () => {
        // NOTE: The list items must be loaded dynamically in the callback. Otherwise, the plugin
        // will not respond immediately to changes in the settings.
        const editor = await this.activeEditor();
        if (editor) cycleListItemForward(editor, this.groupListItems(index));
      },
    });

    this.addCommand({
      id: this.generateCommandId(group.name, "backward"),
      name: `Cycle ${group.name} Backward`,
      icon: "square-chevron-left",
      callback: async () => {
        // NOTE: The list items must be loaded dynamically in the callback. Otherwise, the plugin
        // will not respond immediately to changes in the settings.
        const editor = await this.activeEditor();
        if (editor) cycleListItemBackward(editor, this.groupListItems(index));
      },
    });
  }

  removeCommands(group: GroupSettings) {
    // The `removeCommand` method is only supported on the very latest version of Obsidian. As
    // such, we can't remove the commands unless it's present.
    if (this.removeCommand) {
      this.removeCommand(this.generateCommandId(group.name, "forward"));
      this.removeCommand(this.generateCommandId(group.name, "backward"));
    }
  }

  private generateCommandId(name: string, direction: "forward" | "backward"): string {
    return `cycle-${kebabCase(name)}-${direction}`;
  }

  private groupListItems(index: number): string[] {
    return this.settings.groups[index].listItems.map((item) => sanitizeListItem(item.text));
  }

  /**
   * Returns the active Markdown editor, or `null` if there isn't one. Unlike an `editorCallback`,
   * this works on a cold start, where Obsidian may have deferred the active leaf's view. In that
   * case, the command would otherwise be disabled until the leaf is interacted with. Hydrating the
   * leaf first ensures the hotkey works on the very first press.
   */
  private async activeEditor(): Promise<Editor | null> {
    const leaf = this.app.workspace.getMostRecentLeaf();

    if (!leaf) {
      return null;
    }

    // Hydrate the leaf if Obsidian deferred its view on startup.
    if (leaf.isDeferred) {
      await leaf.loadIfDeferred();
    }

    const view = leaf.view;
    return view instanceof MarkdownView ? view.editor : null;
  }
}
