export type LocalizedString = import("../runtime.js").LocalizedString
export type Shellsignedinas3Inputs = {
  email: NonNullable<unknown>
}
/**
 * | output |
 * | --- |
 * | "Signed in as {email}" |
 *
 * @param {Shellsignedinas3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const shellsignedinas3: ((
  inputs: Shellsignedinas3Inputs,
  options?: {
    locale?: "vi" | "en"
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Shellsignedinas3Inputs,
    {
      locale?: "vi" | "en"
    },
    {}
  >
export { shellsignedinas3 as "shellSignedInAs" }
