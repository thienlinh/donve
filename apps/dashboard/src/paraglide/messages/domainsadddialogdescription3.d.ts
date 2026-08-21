export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainsadddialogdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Pick a published landing page and enter the domain you own. You'll get a CNAME record to add once it's registered." |
 *
 * @param {Domainsadddialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainsadddialogdescription3: ((
  inputs?: Domainsadddialogdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainsadddialogdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainsadddialogdescription3 as "domainsAddDialogDescription" };
