export const businessProfileKeys = {
  detail: (landingPageId: string) =>
    ["business-profile", landingPageId] as const
};

export const strategyBriefKeys = {
  detail: (landingPageId: string) => ["strategy-brief", landingPageId] as const
};
