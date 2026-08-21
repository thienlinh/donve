export const skillKeys = {
  list: () => ["skills"] as const,
  forLanding: (landingPageId: string) =>
    ["skills", "landing", landingPageId] as const
};
