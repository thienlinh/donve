/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssavedviewnameplaceholder4Inputs */

const vi_leadssavedviewnameplaceholder4 =
  /** @type {(inputs: Leadssavedviewnameplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `VD: Lead mới chưa gán`;
  };

const en_leadssavedviewnameplaceholder4 =
  /** @type {(inputs: Leadssavedviewnameplaceholder4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `E.g. New unassigned leads`;
  };

/**
 * | output |
 * | --- |
 * | "E.g. New unassigned leads" |
 *
 * @param {Leadssavedviewnameplaceholder4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssavedviewnameplaceholder4 =
  /** @type {((inputs?: Leadssavedviewnameplaceholder4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssavedviewnameplaceholder4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssavedviewnameplaceholder4(inputs);
      return vi_leadssavedviewnameplaceholder4(inputs);
    }
  );
export { leadssavedviewnameplaceholder4 as "leadsSavedViewNamePlaceholder" };
