/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Orgswitchernoorg3Inputs */

const vi_orgswitchernoorg3 =
  /** @type {(inputs: Orgswitchernoorg3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chưa có tổ chức`;
  };

const en_orgswitchernoorg3 =
  /** @type {(inputs: Orgswitchernoorg3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `No organization yet`;
  };

/**
 * | output |
 * | --- |
 * | "No organization yet" |
 *
 * @param {Orgswitchernoorg3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const orgswitchernoorg3 =
  /** @type {((inputs?: Orgswitchernoorg3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Orgswitchernoorg3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_orgswitchernoorg3(inputs);
      return vi_orgswitchernoorg3(inputs);
    }
  );
export { orgswitchernoorg3 as "orgSwitcherNoOrg" };
