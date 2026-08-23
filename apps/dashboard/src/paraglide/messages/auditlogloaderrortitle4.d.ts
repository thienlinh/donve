export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auditlogloaderrortitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Failed to load audit log" |
 *
 * @param {Auditlogloaderrortitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const auditlogloaderrortitle4: ((
  inputs?: Auditlogloaderrortitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Auditlogloaderrortitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { auditlogloaderrortitle4 as "auditLogLoadErrorTitle" };
