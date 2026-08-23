/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishanywaybutton3Inputs */

const vi_studiopublishanywaybutton3 =
  /** @type {(inputs: Studiopublishanywaybutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xuất bản luôn`;
  };

const en_studiopublishanywaybutton3 =
  /** @type {(inputs: Studiopublishanywaybutton3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Publish anyway`;
  };

/**
 * | output |
 * | --- |
 * | "Publish anyway" |
 *
 * @param {Studiopublishanywaybutton3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishanywaybutton3 =
  /** @type {((inputs?: Studiopublishanywaybutton3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishanywaybutton3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublishanywaybutton3(inputs);
      return vi_studiopublishanywaybutton3(inputs);
    }
  );
export { studiopublishanywaybutton3 as "studioPublishAnywayButton" };
