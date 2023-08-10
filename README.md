# <img width="32px" src="./img/icon-128.webp" alt="project icon" /> Peek Top Bar On Fullscreen (Gnome Extension)

<a href="https://extensions.gnome.org/extension/6048/peek-top-bar-on-fullscreen/">
<img src="https://raw.githubusercontent.com/marcinjahn/gnome-peek-top-bar-on-fullscreen-extension/main/img/get-it-on-ego.svg" height="100" alt="Get it on GNOME Extensions"/>
</a>

This is a Gnome Shell Extension that enables Gnome top bar (panel) to show up
while you're playing full screen content (like a YouTube video). Just hover the
mouse cursor to the top of the screen, and the top bar will show up. This way,
you can quickly check the time, or swich some toggles.

This is similar to what macOS offers for full screen apps.

![Project preview](./img/preview.webp)

## Preview

[peek-topbar-on-fullscreen-preview.webm](https://github.com/marcinjahn/gnome-top-bar-on-fullscreen-extension/assets/10273406/91fb0638-8dcd-421f-8be0-a9457c02cbc7)

## Contributing

In case of problems, it's a good idea to open an
[Issue](https://github.com/marcinjahn/gnome-peek-top-bar-on-fullscreen-extension/issues).
If you know how to fix it, open a [Pull
Request](https://github.com/marcinjahn/gnome-peek-top-bar-on-fullscreen-extension/pulls)!

### Local Development

To run the extension locally "from sources":

```
git clone git@github.com:marcinjahn/gnome-peek-top-bar-on-fullscreen-extension.git
cd gnome-peek-top-bar-on-fullscreen-extension
npm i
npm run build
npm run linkdist
```

The last command will creae a soft link at
`~/.local/share/gnome-shell/extensions/peek-top-bar-on-fullscreen@marcinjahn.com`,
which allows you to enable the extension on your system (e.g., via [Extensions
Manager](https://flathub.org/apps/com.mattjakeman.ExtensionManager)).

Anytime you change anything, rebuild the extension with `npm run build`, and
restart the session:

- on Wayland, log out and log in (I know, it's painful),
- on X11, open "Run a Command" dialog (Alt + F2), type "r" and press Enter

## Remarks

- this extension is incompatible with [Blur My
  Shell](https://extensions.gnome.org/extension/3193/blur-my-shell/) extension.

## Mentions

- [OMG! Linux](https://www.omglinux.com/show-top-bar-in-fullscreen-on-gnome-shell/)
