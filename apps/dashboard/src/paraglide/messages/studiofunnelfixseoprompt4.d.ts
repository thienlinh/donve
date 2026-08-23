export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofunnelfixseoprompt4Inputs = {};
/**
 * | output |
 * | --- |
 * | "This page has no <title> and/or no <meta name=\"description\">. Write a title and SEO description that fit the page's content (compelling, description under 16..." |
 *
 * @param {Studiofunnelfixseoprompt4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofunnelfixseoprompt4: ((
  inputs?: Studiofunnelfixseoprompt4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofunnelfixseoprompt4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofunnelfixseoprompt4 as "studioFunnelFixSeoPrompt" };
