#!/usr/bin/env gjs

imports.gi.versions.Gtk = "3.0";
const { Gio, Gtk } = imports.gi;

class ImageViewerWindow {
  constructor(app) {
    this._app = app;
    this._window = null;
    this._box = null;
    this._image = null;
    this._fileChooserButton = null;
  }

  _buildUI() {
    this._window = new Gtk.ApplicationWindow({
      application: this._app,
      defaultHeight: 600,
      defaultWidth: 800,
    });
    this._box = new Gtk.Box({
      orientation: Gtk.Orientation.VERTICAL,
    });

    this._image = new Gtk.Image({
      vexpand: true,
    });
    this._box.add(this._image);

    this._fileChooserButton = Gtk.FileChooserButton.new(
      "Pick An Image",
      Gtk.FileChooserAction.OPEN
    );

    this._fileChooserButton.connect("file-set", (button) => {
      const fileName = button.get_filename();
      this._image.set_from_file(fileName);
    });

    this._box.add(this._fileChooserButton);
    this._box.show_all();

    this._window.add(this._box);
  }

  getWidget() {
    this._buildUI();
    return this._window;
  }
}

const application = new Gtk.Application({
  application_id: "org.gnome.Sandbox.ImageViewerExample",
  flags: Gio.ApplicationFlags.FLAGS_NONE,
});

application.connect("activate", (app) => {
  let activeWindow = app.activeWindow;

  if (!activeWindow) {
    let imageViewerWindow = new ImageViewerWindow(app);
    activeWindow = imageViewerWindow.getWidget();
  }

  activeWindow.present();
});

application.run(null);
