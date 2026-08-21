export const landingKeys = {
  list: () => ["landings"] as const,
  detail: (id: string) => ["landings", id] as const,
  html: (id: string, htmlKey: string) =>
    ["landings", id, "html", htmlKey] as const
};

export const pageVersionKeys = {
  list: (landingPageId: string) => ["page-versions", landingPageId] as const,
  html: (landingPageId: string, versionId: string) =>
    ["page-versions", landingPageId, versionId, "html"] as const
};

export const pageAssetKeys = {
  list: (landingPageId: string) => ["page-assets", landingPageId] as const
};

export const pageSrcmapKeys = {
  current: (landingPageId: string) => ["page-srcmap", landingPageId] as const
};

export const studioCommentKeys = {
  list: (landingPageId: string) => ["studio-comments", landingPageId] as const
};

export const chatMessageKeys = {
  list: (landingPageId: string) => ["chat-messages", landingPageId] as const
};

export const deploymentKeys = {
  list: (landingPageId: string) => ["deployments", landingPageId] as const
};
