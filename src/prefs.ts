import { ExtensionPreferences } from "gnomejs://prefs.js";

import Adw from "@gi-ts/adw1";
import Gtk from "@gi-ts/gtk4";
import Gio from "@gi-ts/gio2";

export default class PeekTopBarOnFullscreenPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window: Adw.PreferencesWindow) {
    const settings = this.getSettings();

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

    // Set the current value
    const currentValue = settings.get_string("panel-edge") || "top";
    const options = ["top", "bottom", "left", "right"];
    const selectedIndex = options.indexOf(currentValue);
    if (selectedIndex >= 0) {
      row.set_selected(selectedIndex);
    }

    // Connect the change signal
    row.connect("notify::selected", () => {
      const selected = row.get_selected();
      if (selected >= 0 && selected < options.length) {
        settings.set_string("panel-edge", options[selected]);
      }
    });

    group.add(row);
  }
}
