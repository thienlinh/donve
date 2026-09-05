type Listener = (open: boolean) => void;

let isOpen = false;
const listeners = new Set<Listener>();

/** Lets a visible trigger (both sidebars' search button) open the same palette the Cmd/Ctrl+K
 * shortcut does, without turning `CommandPalette` into a controlled component every caller has
 * to wire up. */
export function openCommandPalette(): void {
  setCommandPaletteOpen(true);
}

export function setCommandPaletteOpen(next: boolean): void {
  isOpen = next;
  for (const listener of listeners) listener(next);
}

export function getCommandPaletteOpen(): boolean {
  return isOpen;
}

export function subscribeCommandPalette(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
