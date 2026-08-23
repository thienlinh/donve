/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsbulkstageerrortoast4Inputs */

const vi_leadsbulkstageerrortoast4 =
  /** @type {(inputs: Leadsbulkstageerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không đổi stage được cho các lead đã chọn. Thử lại.`;
  };

const en_leadsbulkstageerrortoast4 =
  /** @type {(inputs: Leadsbulkstageerrortoast4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't change stage for the selected leads. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't change stage for the selected leads. Try again." |
 *
 * @param {Leadsbulkstageerrortoast4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsbulkstageerrortoast4 =
  /** @type {((inputs?: Leadsbulkstageerrortoast4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsbulkstageerrortoast4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsbulkstageerrortoast4(inputs);
      return vi_leadsbulkstageerrortoast4(inputs);
    }
  );
export { leadsbulkstageerrortoast4 as "leadsBulkStageErrorToast" };
