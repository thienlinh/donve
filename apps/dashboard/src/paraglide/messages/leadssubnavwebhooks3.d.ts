export type LocalizedString = import("../runtime.js").LocalizedString;
export type Leadssubnavwebhooks3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Webhooks" |
 *
 * @param {Leadssubnavwebhooks3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const leadssubnavwebhooks3: ((
  inputs?: Leadssubnavwebhooks3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Leadssubnavwebhooks3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { leadssubnavwebhooks3 as "leadsSubNavWebhooks" };
