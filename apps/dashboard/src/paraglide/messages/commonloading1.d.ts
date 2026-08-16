export type LocalizedString = import("../runtime.js").LocalizedString
export type Commonloading1Inputs = {}
/**
 * | output |
 * | --- |
 * | "Loading..." |
 *
 * @param {Commonloading1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const commonloading1: ((
  inputs?: Commonloading1Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Commonloading1Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { commonloading1 as "commonLoading" }
