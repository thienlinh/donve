export type LocalizedString = import("../runtime.js").LocalizedString;
export type Aiconnectdialogdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "OpenRouter is the easiest to start with — one key, a free model to test." |
 *
 * @param {Aiconnectdialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const aiconnectdialogdescription3: ((
  inputs?: Aiconnectdialogdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Aiconnectdialogdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { aiconnectdialogdescription3 as "aiConnectDialogDescription" };
