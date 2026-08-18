export type LocalizedString = import("../runtime.js").LocalizedString;
export type Memberspendingdescription2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Invitations that haven't been accepted yet." |
 *
 * @param {Memberspendingdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const memberspendingdescription2: ((
  inputs?: Memberspendingdescription2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Memberspendingdescription2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { memberspendingdescription2 as "membersPendingDescription" };
