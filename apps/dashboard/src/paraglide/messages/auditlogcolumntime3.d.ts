export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auditlogcolumntime3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Time" |
 *
 * @param {Auditlogcolumntime3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const auditlogcolumntime3: ((
  inputs?: Auditlogcolumntime3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Auditlogcolumntime3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { auditlogcolumntime3 as "auditLogColumnTime" };
