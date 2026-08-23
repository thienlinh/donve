/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commoncreate1Inputs */

const vi_commoncreate1 =
  /** @type {(inputs: Commoncreate1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo`;
  };

const en_commoncreate1 =
  /** @type {(inputs: Commoncreate1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Create`;
  };

/**
 * | output |
 * | --- |
 * | "Create" |
 *
 * @param {Commoncreate1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commoncreate1 =
  /** @type {((inputs?: Commoncreate1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commoncreate1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commoncreate1(inputs);
      return vi_commoncreate1(inputs);
    }
  );
export { commoncreate1 as "commonCreate" };
