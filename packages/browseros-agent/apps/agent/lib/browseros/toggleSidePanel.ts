/**
 * @public
 */
export async function openSidePanel(
  tabId: number,
): Promise<{ opened: boolean }> {
  if (
    typeof (chrome.sidePanel as Record<string, unknown>).browserosIsOpen ===
    'function'
  ) {
    // @ts-expect-error browserosIsOpen is a BrowserOS-specific API
    const isAlreadyOpen = await chrome.sidePanel.browserosIsOpen({ tabId })
    if (isAlreadyOpen) {
      return { opened: true }
    }
    // @ts-expect-error browserosToggle is a BrowserOS-specific API
    return await chrome.sidePanel.browserosToggle({ tabId })
  }
  await chrome.sidePanel.open({ tabId })
  return { opened: true }
}

/**
 * @public
 */
export async function toggleSidePanel(
  tabId: number,
): Promise<{ opened: boolean }> {
  if (
    typeof (chrome.sidePanel as Record<string, unknown>).browserosToggle ===
    'function'
  ) {
    // @ts-expect-error browserosToggle is a BrowserOS-specific API
    return await chrome.sidePanel.browserosToggle({ tabId })
  }
  await chrome.sidePanel.open({ tabId })
  return { opened: true }
}
