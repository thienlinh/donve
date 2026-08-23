/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsaddbutton2Inputs */

const vi_domainsaddbutton2 =
  /** @type {(inputs: Domainsaddbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Thêm tên miền`;
  };

const en_domainsaddbutton2 =
  /** @type {(inputs: Domainsaddbutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Add domain`;
  };

/**
 * | output |
 * | --- |
 * | "Add domain" |
 *
 * @param {Domainsaddbutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsaddbutton2 =
  /** @type {((inputs?: Domainsaddbutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsaddbutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsaddbutton2(inputs);
      return vi_domainsaddbutton2(inputs);
    }
  );
export { domainsaddbutton2 as "domainsAddButton" };
