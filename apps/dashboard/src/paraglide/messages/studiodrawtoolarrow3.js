/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodrawtoolarrow3Inputs */

const vi_studiodrawtoolarrow3 =
  /** @type {(inputs: Studiodrawtoolarrow3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Mũi tên`;
  };

const en_studiodrawtoolarrow3 =
  /** @type {(inputs: Studiodrawtoolarrow3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Arrow`;
  };

/**
 * | output |
 * | --- |
 * | "Arrow" |
 *
 * @param {Studiodrawtoolarrow3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodrawtoolarrow3 =
  /** @type {((inputs?: Studiodrawtoolarrow3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodrawtoolarrow3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodrawtoolarrow3(inputs);
      return vi_studiodrawtoolarrow3(inputs);
    }
  );
export { studiodrawtoolarrow3 as "studioDrawToolArrow" };
