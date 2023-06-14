const panelBox = imports.ui.main.layoutManager.panelBox;

export function getPanelHeight(): number {
  return panelBox.get_children()[0].height;
}

export function showPanel(): void {
  panelBox.visible = true;
  // panelBox.get_children()[0].fadeIn();
}

export function hidePanel(): void {
  panelBox.visible = false;
  // panelBox.get_children()[0].fadeOut();
}

export function isAnyPanelMenuOpen(): boolean {
  const statusArea = panelBox.get_children()[0].statusArea;

  const opennableIndicators = Object.keys(statusArea)
    .filter((indicator) => !!statusArea[indicator].menu)
    .map((indicator) => statusArea[indicator]);

  return (
    opennableIndicators.filter((indicator) => indicator.menu.isOpen).length > 0
  );
}
