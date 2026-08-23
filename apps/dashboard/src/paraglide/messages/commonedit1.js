/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commonedit1Inputs */

const vi_commonedit1 =
  /** @type {(inputs: Commonedit1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Sửa`;
  };

const en_commonedit1 =
  /** @type {(inputs: Commonedit1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Edit`;
  };

/**
 * | output |
 * | --- |
 * | "Edit" |
 *
 * @param {Commonedit1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commonedit1 =
  /** @type {((inputs?: Commonedit1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commonedit1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commonedit1(inputs);
      return vi_commonedit1(inputs);
    }
  );
export { commonedit1 as "commonEdit" };
