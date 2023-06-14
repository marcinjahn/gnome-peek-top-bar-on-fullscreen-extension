const panelBox = imports.ui.main.layoutManager.panelBox;

export function getPanelHeight(): number {
  return panelBox.get_children()[0].height;
}

export function showPanel() {
  panelBox.visible = true;
}

export function hidePanel() {
  panelBox.visible = false;
}
