export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiochatemptydescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Ask the AI to generate or tweak this page." |
 *
 * @param {Studiochatemptydescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiochatemptydescription3: ((
  inputs?: Studiochatemptydescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiochatemptydescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiochatemptydescription3 as "studioChatEmptyDescription" };
