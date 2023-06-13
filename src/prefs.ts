// import { DeviceType } from "identification";
// import { CustomName, OriginalName, SettingsUtils } from "./settings";
// import {
//   PreferencesPage,
//   PreferencesGroup,
//   PreferencesWindow,
//   EntryRow,
//   Toast,
//   ToastPriority,
// } from "@gi-ts/adw1";
// import { validate } from "settings-validation";
// import { Button } from "@gi-ts/gtk4";

// function init() {}

// function fillPreferencesWindow(window: PreferencesWindow) {
//   const settings = new SettingsUtils();

//   window.add(createOutputsPage(settings, window));
//   window.add(createInputsPage(settings, window));
// }

// function createOutputsPage(
//   settings: SettingsUtils,
//   window: PreferencesWindow
// ): PreferencesPage {
//   const page = new PreferencesPage({
//     title: "Outputs",
//     iconName: "audio-speakers-symbolic",
//   });

//   const group = new PreferencesGroup({
//     title: "Output Audio Devices",
//     description: "Rename devices and apply the changes",
//   });
//   page.add(group);

//   const outputs = settings.getOutputNamesMap();
//   Object.keys(outputs).forEach((originalName) => {
//     const customName = outputs[originalName];
//     group.add(
//       createDeviceRow(originalName, customName, settings, "output", window)
//     );
//   });

//   return page;
// }

// function createInputsPage(
//   settings: SettingsUtils,
//   window: PreferencesWindow
// ): PreferencesPage {
//   const page = new PreferencesPage({
//     title: "Inputs",
//     iconName: "audio-input-microphone-symbolic",
//   });

//   const group = new PreferencesGroup({
//     title: "Input Audio Devices",
//     description: "Rename devices and apply the changes",
//   });
//   page.add(group);

//   const inputs = settings.getInputNamesMap();
//   Object.keys(inputs).forEach((originalName) => {
//     const customName = inputs[originalName];
//     group.add(
//       createDeviceRow(originalName, customName, settings, "input", window)
//     );
//   });

//   return page;
// }

// function createDeviceRow(
//   originalName: string,
//   customName: string,
//   settings: SettingsUtils,
//   type: DeviceType,
//   window: PreferencesWindow
// ): EntryRow {
//   const row = new EntryRow({
//     title: originalName,
//     text: customName,
//     show_apply_button: true,
//   });

//   const resetButton = new Button({
//     icon_name: "view-refresh",
//     has_frame: false,
//     tooltip_text: "Restore original name",
//   });

//   resetButton.connect("clicked", () => {
//     row.text = originalName;
//     restoreDevice(type, settings, originalName);
//   });

//   row.add_suffix(resetButton);

//   row.connect("apply", ({ title, text }) => {
//     applyCustomName(type, settings, title, text, window);
//   });

//   return row;
// }

// function applyCustomName(
//   type: string,
//   settings: SettingsUtils,
//   originalName: OriginalName,
//   customName: CustomName,
//   window: PreferencesWindow
// ) {
//   const currentMap =
//     type === "output"
//       ? settings.getOutputNamesMap()
//       : settings.getInputNamesMap();

//   const newMap = {
//     ...currentMap,
//     [originalName]: customName,
//   };

//   const validation = validate(newMap);

//   if (!validation.isOk) {
//     displayError(window, validation.errorMessage!);
//   } else {
//     type === "output"
//       ? settings.setOutputNamesMap(newMap)
//       : settings.setInputNamesMap(newMap);
//   }
// }

// function restoreDevice(
//   type: string,
//   settings: SettingsUtils,
//   originalName: string
// ) {
//   const currentMap =
//     type === "output"
//       ? settings.getOutputNamesMap()
//       : settings.getInputNamesMap();

//   const newMap = {
//     ...currentMap,
//     [originalName]: originalName,
//   };

//   type === "output"
//     ? settings.setOutputNamesMap(newMap)
//     : settings.setInputNamesMap(newMap);
// }

// function displayError(window: PreferencesWindow, error: string) {
//   window.add_toast(
//     new Toast({
//       title: error,
//       priority: ToastPriority.HIGH,
//       timeout: 5,
//     })
//   );
// }

// export default { init, fillPreferencesWindow };
