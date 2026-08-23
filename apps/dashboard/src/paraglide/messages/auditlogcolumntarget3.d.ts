export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auditlogcolumntarget3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Target" |
 *
 * @param {Auditlogcolumntarget3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const auditlogcolumntarget3: ((
  inputs?: Auditlogcolumntarget3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Auditlogcolumntarget3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { auditlogcolumntarget3 as "auditLogColumnTarget" };
