export const promptTemplateKeys = {
  list: () => ["prompt-templates"] as const,
  testRuns: (templateId: string) =>
    ["prompt-templates", templateId, "test-runs"] as const
};
