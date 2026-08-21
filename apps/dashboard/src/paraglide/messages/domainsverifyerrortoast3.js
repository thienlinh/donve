/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsverifyerrortoast3Inputs */

const vi_domainsverifyerrortoast3 =
  /** @type {(inputs: Domainsverifyerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không kiểm tra được trạng thái xác thực. Vui lòng thử lại.`;
  };

const en_domainsverifyerrortoast3 =
  /** @type {(inputs: Domainsverifyerrortoast3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't check verification status. Try again.`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't check verification status. Try again." |
 *
 * @param {Domainsverifyerrortoast3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsverifyerrortoast3 =
  /** @type {((inputs?: Domainsverifyerrortoast3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsverifyerrortoast3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsverifyerrortoast3(inputs);
      return vi_domainsverifyerrortoast3(inputs);
    }
  );
export { domainsverifyerrortoast3 as "domainsVerifyErrorToast" };
