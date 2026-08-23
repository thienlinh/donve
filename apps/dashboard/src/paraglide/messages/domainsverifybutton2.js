/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsverifybutton2Inputs */

const vi_domainsverifybutton2 =
  /** @type {(inputs: Domainsverifybutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kiểm tra trạng thái xác thực`;
  };

const en_domainsverifybutton2 =
  /** @type {(inputs: Domainsverifybutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Check verification status`;
  };

/**
 * | output |
 * | --- |
 * | "Check verification status" |
 *
 * @param {Domainsverifybutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsverifybutton2 =
  /** @type {((inputs?: Domainsverifybutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsverifybutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsverifybutton2(inputs);
      return vi_domainsverifybutton2(inputs);
    }
  );
export { domainsverifybutton2 as "domainsVerifyButton" };
