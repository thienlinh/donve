export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auditlogemptytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No audit log entries yet" |
 *
 * @param {Auditlogemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const auditlogemptytitle3: ((
  inputs?: Auditlogemptytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Auditlogemptytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { auditlogemptytitle3 as "auditLogEmptyTitle" };
