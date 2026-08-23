/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateaddsection3Inputs */

const vi_prompttemplateaddsection3 =
  /** @type {(inputs: Prompttemplateaddsection3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm phần`;
  };

const en_prompttemplateaddsection3 =
  /** @type {(inputs: Prompttemplateaddsection3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add section`;
  };

/**
 * | output |
 * | --- |
 * | "Add section" |
 *
 * @param {Prompttemplateaddsection3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateaddsection3 =
  /** @type {((inputs?: Prompttemplateaddsection3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateaddsection3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateaddsection3(inputs);
      return vi_prompttemplateaddsection3(inputs);
    }
  );
export { prompttemplateaddsection3 as "promptTemplateAddSection" };
