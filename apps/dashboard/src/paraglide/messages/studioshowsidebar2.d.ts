export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studioshowsidebar2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Show sidebar" |
 *
 * @param {Studioshowsidebar2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studioshowsidebar2: ((
  inputs?: Studioshowsidebar2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studioshowsidebar2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studioshowsidebar2 as "studioShowSidebar" };
