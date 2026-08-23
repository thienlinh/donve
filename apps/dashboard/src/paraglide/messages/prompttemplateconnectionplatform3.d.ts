export type LocalizedString = import("../runtime.js").LocalizedString;
export type Prompttemplateconnectionplatform3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Platform (billed to org credits)" |
 *
 * @param {Prompttemplateconnectionplatform3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const prompttemplateconnectionplatform3: ((
  inputs?: Prompttemplateconnectionplatform3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Prompttemplateconnectionplatform3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { prompttemplateconnectionplatform3 as "promptTemplateConnectionPlatform" };
