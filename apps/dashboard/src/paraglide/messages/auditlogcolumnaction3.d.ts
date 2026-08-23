export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auditlogcolumnaction3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Action" |
 *
 * @param {Auditlogcolumnaction3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const auditlogcolumnaction3: ((
  inputs?: Auditlogcolumnaction3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Auditlogcolumnaction3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { auditlogcolumnaction3 as "auditLogColumnAction" };
