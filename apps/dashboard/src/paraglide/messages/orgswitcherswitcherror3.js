/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Orgswitcherswitcherror3Inputs */

const vi_orgswitcherswitcherror3 =
  /** @type {(inputs: Orgswitcherswitcherror3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không chuyển được tổ chức. Vui lòng thử lại.`;
  };

const en_orgswitcherswitcherror3 =
  /** @type {(inputs: Orgswitcherswitcherror3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't switch organizations. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't switch organizations. Try again." |
 *
 * @param {Orgswitcherswitcherror3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const orgswitcherswitcherror3 =
  /** @type {((inputs?: Orgswitcherswitcherror3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Orgswitcherswitcherror3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_orgswitcherswitcherror3(inputs);
      return vi_orgswitcherswitcherror3(inputs);
    }
  );
export { orgswitcherswitcherror3 as "orgSwitcherSwitchError" };
