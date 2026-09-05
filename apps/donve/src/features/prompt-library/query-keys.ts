export const promptLibraryKeys = {
  list: () => ["prompt-library", "entries"] as const,
  detail: (slug: string) => ["prompt-library", "entries", slug] as const
};
