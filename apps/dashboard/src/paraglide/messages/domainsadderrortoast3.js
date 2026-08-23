/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsadderrortoast3Inputs */

const vi_domainsadderrortoast3 =
  /** @type {(inputs: Domainsadderrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không thêm được tên miền này. Kiểm tra xem tên miền đã được dùng chưa rồi thử lại.`;
  };

const en_domainsadderrortoast3 =
  /** @type {(inputs: Domainsadderrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't add this domain. Check it isn't already in use and try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't add this domain. Check it isn't already in use and try again." |
 *
 * @param {Domainsadderrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsadderrortoast3 =
  /** @type {((inputs?: Domainsadderrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsadderrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsadderrortoast3(inputs);
      return vi_domainsadderrortoast3(inputs);
    }
  );
export { domainsadderrortoast3 as "domainsAddErrorToast" };
