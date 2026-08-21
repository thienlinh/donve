/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillcreatebutton2Inputs */

const vi_skillcreatebutton2 =
  /** @type {(inputs: Skillcreatebutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo kỹ năng`;
  };

const en_skillcreatebutton2 =
  /** @type {(inputs: Skillcreatebutton2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `New skill`;
  };

/**
 * | output |
 * | --- |
 * | "New skill" |
 *
 * @param {Skillcreatebutton2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillcreatebutton2 =
  /** @type {((inputs?: Skillcreatebutton2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillcreatebutton2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillcreatebutton2(inputs);
      return vi_skillcreatebutton2(inputs);
    }
  );
export { skillcreatebutton2 as "skillCreateButton" };
