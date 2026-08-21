export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofunnelfixformprompt4Inputs = {};
/**
 * | output |
 * | --- |
 * | "This page has no standard platform lead form. Add a form with the attribute data-dv-form=\"lead\", input fields name=\"fullName\", name=\"phone\", name=\"email\" (op..." |
 *
 * @param {Studiofunnelfixformprompt4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofunnelfixformprompt4: ((
  inputs?: Studiofunnelfixformprompt4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofunnelfixformprompt4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofunnelfixformprompt4 as "studioFunnelFixFormPrompt" };
