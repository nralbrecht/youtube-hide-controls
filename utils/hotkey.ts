export interface HotKey {
  key?: string;
  code: string;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
}

export function doesEventMatchHotkey(a: HotKey, b: HotKey): boolean {
  return (
    a.code === b.code &&
    a.altKey === b.altKey &&
    a.ctrlKey === b.ctrlKey &&
    a.metaKey === b.metaKey &&
    a.shiftKey === b.shiftKey
  );
}

export function hotKeyToString(key: HotKey | undefined): string {
  if (!key || !key.key) {
    return "None";
  }

  let hotKeyDesignator = "";

  if (key.ctrlKey) hotKeyDesignator += "Ctrl+";
  if (key.shiftKey) hotKeyDesignator += "Shift+";
  if (key.altKey) hotKeyDesignator += "Alt+";
  if (key.metaKey) hotKeyDesignator += "Meta+";
  if (key.code.startsWith("Numpad")) hotKeyDesignator += "Numpad ";

  hotKeyDesignator += key.key.substring(0, 1).toUpperCase() + key.key.substring(1);

  return hotKeyDesignator;
}
