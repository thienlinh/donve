export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auditlogcolumnactor3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Actor" |
 *
 * @param {Auditlogcolumnactor3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const auditlogcolumnactor3: ((
  inputs?: Auditlogcolumnactor3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Auditlogcolumnactor3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { auditlogcolumnactor3 as "auditLogColumnActor" };
