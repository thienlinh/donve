export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadstimelinelabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Timeline" |
 *
 * @param {Leadstimelinelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadstimelinelabel2: ((
  inputs?: Leadstimelinelabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadstimelinelabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadstimelinelabel2 as "leadsTimelineLabel" };
