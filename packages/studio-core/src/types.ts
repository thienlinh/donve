export type PatchOp =
  | { type: "replaceText"; srcmapId: string; text: string }
  | { type: "setStyle"; srcmapId: string; prop: string; value: string | null }
  | { type: "setAttr"; srcmapId: string; attr: string; value: string | null }
  | { type: "replaceOuterHTML"; srcmapId: string; html: string }
  | { type: "insertBefore"; srcmapId: string; html: string }
  | { type: "insertAfter"; srcmapId: string; html: string }
  | { type: "remove"; srcmapId: string }
  | { type: "toggleVisibility"; srcmapId: string; hidden: boolean }
  | { type: "renameLayer"; srcmapId: string; name: string }
  | { type: "moveBefore"; srcmapId: string; beforeSrcmapId: string | null };

export type PatchOpType = PatchOp["type"];
