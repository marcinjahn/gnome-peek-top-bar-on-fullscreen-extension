import { ExtensionPreferences } from "gnomejs://prefs.js";

import Adw from "@gi-ts/adw1";
import Gtk from "@gi-ts/gtk4";

export default class PeekTopBarOnFullscreenPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window: Adw.PreferencesWindow) {
    const settings = this.getSettings();
    // @ts-ignore Using window_settings is recommended in docs https://gjs.guide/extensions/development/preferences.html#prefs-js
    window._settings = settings;

    const page = new Adw.PreferencesPage({
      title: "General",
      icon_name: "preferences-system-symbolic",
    });
    window.add(page);

    const group = new Adw.PreferencesGroup({
      title: "Panel Position",
      description:
        "Select which edge of the screen should trigger the panel peek",
    });
    page.add(group);

    const row = new Adw.ComboRow({
      title: "Panel Edge",
      subtitle: "Choose the edge where your panel is located",
      model: Gtk.StringList.new(["Top", "Bottom", "Left", "Right"]),
    });

    const currentValue = settings.get_string("panel-edge") || "top";
    const options = ["top", "bottom", "left", "right"];
    const selectedIndex = options.indexOf(currentValue);
    if (selectedIndex >= 0) {
      row.set_selected(selectedIndex);
    }

    row.connect("notify::selected", () => {
      const selected = row.get_selected();
      if (selected >= 0 && selected < options.length) {
        settings.set_string("panel-edge", options[selected]);
      }
    });

    group.add(row);
  }
}
