export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auditlogtitle2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Audit log" |
 *
 * @param {Auditlogtitle2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const auditlogtitle2: ((
  inputs?: Auditlogtitle2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Auditlogtitle2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { auditlogtitle2 as "auditLogTitle" };
