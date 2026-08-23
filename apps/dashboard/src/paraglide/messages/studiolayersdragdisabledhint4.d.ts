export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiolayersdragdisabledhint4Inputs = {
  threshold: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Drag-to-reorder is off above {threshold} layers on this page — use the eye icon to hide instead." |
 *
 * @param {Studiolayersdragdisabledhint4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiolayersdragdisabledhint4: ((
  inputs: Studiolayersdragdisabledhint4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiolayersdragdisabledhint4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiolayersdragdisabledhint4 as "studioLayersDragDisabledHint" };
