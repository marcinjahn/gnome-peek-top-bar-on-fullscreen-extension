const PanelBox = imports.ui.main.layoutManager.panelBox;

export function getPanelHeight(): number {
  return PanelBox.get_children()[0].height;
}

export function isAnyPanelMenuOpen(): boolean {
  const statusArea = PanelBox.get_children()[0].statusArea;

  const opennableIndicators = Object.keys(statusArea)
    .filter((indicator) => !!statusArea[indicator].menu)
    .map((indicator) => statusArea[indicator]);

  return (
    opennableIndicators.filter((indicator) => indicator.menu.isOpen).length > 0
  );
}

export function toggleAnyIndicator(): void {
  const statusArea = PanelBox.get_children()[0].statusArea;

  const opennableIndicators = Object.keys(statusArea)
    .filter((indicator) => !!statusArea[indicator].menu)
    .map((indicator) => statusArea[indicator]);

  const closedIndicators = opennableIndicators.filter(
    (indicator) => !indicator.menu.isOpen
  );

  if (closedIndicators.length < 1) {
    return;
  }

  closedIndicators[0].menu.toggle();
  closedIndicators[0].menu.toggle();
}
