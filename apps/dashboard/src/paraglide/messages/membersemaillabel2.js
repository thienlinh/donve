/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersemaillabel2Inputs */

const vi_membersemaillabel2 =
  /** @type {(inputs: Membersemaillabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`;
  };

const en_membersemaillabel2 =
  /** @type {(inputs: Membersemaillabel2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Email`;
  };

/**
 * | output |
 * | --- |
 * | "Email" |
 *
 * @param {Membersemaillabel2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersemaillabel2 =
  /** @type {((inputs?: Membersemaillabel2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersemaillabel2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersemaillabel2(inputs);
      return vi_membersemaillabel2(inputs);
    }
  );
export { membersemaillabel2 as "membersEmailLabel" };
