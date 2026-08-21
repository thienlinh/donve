export type LocalizedString = import("../runtime.js").LocalizedString;
export type Campaignsgoallabel2Inputs = {};
/**
 * | output |
 * | --- |
 * | "Goal" |
 *
 * @param {Campaignsgoallabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const campaignsgoallabel2: ((
  inputs?: Campaignsgoallabel2Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Campaignsgoallabel2Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { campaignsgoallabel2 as "campaignsGoalLabel" };
