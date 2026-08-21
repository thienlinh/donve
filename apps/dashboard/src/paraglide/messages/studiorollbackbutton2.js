/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiorollbackbutton2Inputs */

const vi_studiorollbackbutton2 =
  /** @type {(inputs: Studiorollbackbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Rollback`;
  };

const en_studiorollbackbutton2 =
  /** @type {(inputs: Studiorollbackbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Rollback`;
  };

/**
 * | output |
 * | --- |
 * | "Rollback" |
 *
 * @param {Studiorollbackbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiorollbackbutton2 =
  /** @type {((inputs?: Studiorollbackbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiorollbackbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiorollbackbutton2(inputs);
      return vi_studiorollbackbutton2(inputs);
    }
  );
export { studiorollbackbutton2 as "studioRollbackButton" };
