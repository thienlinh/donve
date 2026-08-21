export type LocalizedString = import("../runtime.js").LocalizedString;
export type Auditlogdescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Most recent 200 write actions across this organization (publish, order status changes, refunds...)." |
 *
 * @param {Auditlogdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const auditlogdescription2: ((
  inputs?: Auditlogdescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Auditlogdescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { auditlogdescription2 as "auditLogDescription" };
