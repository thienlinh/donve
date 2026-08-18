/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersdescription1Inputs */

const vi_membersdescription1 =
  /** @type {(inputs: Membersdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Những người có quyền truy cập vào tổ chức này.`;
  };

const en_membersdescription1 =
  /** @type {(inputs: Membersdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `People with access to this organization.`;
  };

/**
 * | output |
 * | --- |
 * | "People with access to this organization." |
 *
 * @param {Membersdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersdescription1 =
  /** @type {((inputs?: Membersdescription1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersdescription1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersdescription1(inputs);
      return vi_membersdescription1(inputs);
    }
  );
export { membersdescription1 as "membersDescription" };
