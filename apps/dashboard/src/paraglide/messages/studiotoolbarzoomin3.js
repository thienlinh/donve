/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiotoolbarzoomin3Inputs */

const vi_studiotoolbarzoomin3 =
  /** @type {(inputs: Studiotoolbarzoomin3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Phóng to`;
  };

const en_studiotoolbarzoomin3 =
  /** @type {(inputs: Studiotoolbarzoomin3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Zoom in`;
  };

/**
 * | output |
 * | --- |
 * | "Zoom in" |
 *
 * @param {Studiotoolbarzoomin3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiotoolbarzoomin3 =
  /** @type {((inputs?: Studiotoolbarzoomin3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiotoolbarzoomin3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiotoolbarzoomin3(inputs);
      return vi_studiotoolbarzoomin3(inputs);
    }
  );
export { studiotoolbarzoomin3 as "studioToolbarZoomIn" };
