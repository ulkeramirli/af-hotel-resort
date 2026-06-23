export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("af_favorites");
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return arr.filter(Boolean);
  } catch {
    return [];
  }
}

export function toggleFavorite(roomId: string): boolean {
  const favs = getFavorites();
  const exists = favs.includes(roomId);
  const next = exists ? favs.filter((id) => id !== roomId) : [...favs, roomId];
  localStorage.setItem("af_favorites", JSON.stringify(next));
  window.dispatchEvent(new Event("favoritesUpdated"));
  return !exists; // returns new state: true = added, false = removed
}

export function isFavorite(roomId: string): boolean {
  return getFavorites().includes(roomId);
}