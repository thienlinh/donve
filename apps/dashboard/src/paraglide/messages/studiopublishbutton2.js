/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiopublishbutton2Inputs */

const vi_studiopublishbutton2 =
  /** @type {(inputs: Studiopublishbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xuất bản`;
  };

const en_studiopublishbutton2 =
  /** @type {(inputs: Studiopublishbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Publish`;
  };

/**
 * | output |
 * | --- |
 * | "Publish" |
 *
 * @param {Studiopublishbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiopublishbutton2 =
  /** @type {((inputs?: Studiopublishbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiopublishbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiopublishbutton2(inputs);
      return vi_studiopublishbutton2(inputs);
    }
  );
export { studiopublishbutton2 as "studioPublishButton" };
