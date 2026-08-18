export type LocalizedString = import("../runtime.js").LocalizedString;
export type Landingspromptheading2Inputs = {};
/**
 * | output |
 * | --- |
 * | "What landing page do you want to create?" |
 *
 * @param {Landingspromptheading2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const landingspromptheading2: ((
  inputs?: Landingspromptheading2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Landingspromptheading2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { landingspromptheading2 as "landingsPromptHeading" };
