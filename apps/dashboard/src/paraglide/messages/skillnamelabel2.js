/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillnamelabel2Inputs */

const vi_skillnamelabel2 =
  /** @type {(inputs: Skillnamelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tên`;
  };

const en_skillnamelabel2 =
  /** @type {(inputs: Skillnamelabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Name`;
  };

/**
 * | output |
 * | --- |
 * | "Name" |
 *
 * @param {Skillnamelabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillnamelabel2 =
  /** @type {((inputs?: Skillnamelabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillnamelabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillnamelabel2(inputs);
      return vi_skillnamelabel2(inputs);
    }
  );
export { skillnamelabel2 as "skillNameLabel" };
