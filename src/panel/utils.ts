const panelBox = imports.ui.main.layoutManager.panelBox;

export function getPanelHeight(): number {
  return panelBox.get_children()[0].height;
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
