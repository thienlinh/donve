export const STUDIO_MODES = [
  "view",
  "select",
  "edit",
  "comment",
  "draw"
] as const;

export type StudioMode = (typeof STUDIO_MODES)[number];
