export type LocalizedString = import("../runtime.js").LocalizedString;
export type Domainscnameinstructions2Inputs = {
  hostname: NonNullable<unknown>;
  target: NonNullable<unknown>;
};
/**
 * | output |
 * | --- |
 * | "Add a CNAME record: {hostname} → {target}" |
 *
 * @param {Domainscnameinstructions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const domainscnameinstructions2: ((
  inputs: Domainscnameinstructions2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Domainscnameinstructions2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { domainscnameinstructions2 as "domainsCnameInstructions" };
