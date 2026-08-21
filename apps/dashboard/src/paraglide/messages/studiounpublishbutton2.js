/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiounpublishbutton2Inputs */

const vi_studiounpublishbutton2 =
  /** @type {(inputs: Studiounpublishbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Gỡ xuất bản`;
  };

const en_studiounpublishbutton2 =
  /** @type {(inputs: Studiounpublishbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Unpublish`;
  };

/**
 * | output |
 * | --- |
 * | "Unpublish" |
 *
 * @param {Studiounpublishbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiounpublishbutton2 =
  /** @type {((inputs?: Studiounpublishbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiounpublishbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiounpublishbutton2(inputs);
      return vi_studiounpublishbutton2(inputs);
    }
  );
export { studiounpublishbutton2 as "studioUnpublishButton" };
