/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillremoveconfirmtitle3Inputs */

const vi_skillremoveconfirmtitle3 =
  /** @type {(inputs: Skillremoveconfirmtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Xóa kỹ năng này?`;
  };

const en_skillremoveconfirmtitle3 =
  /** @type {(inputs: Skillremoveconfirmtitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Remove this skill?`;
  };

/**
 * | output |
 * | --- |
 * | "Remove this skill?" |
 *
 * @param {Skillremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillremoveconfirmtitle3 =
  /** @type {((inputs?: Skillremoveconfirmtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillremoveconfirmtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillremoveconfirmtitle3(inputs);
      return vi_skillremoveconfirmtitle3(inputs);
    }
  );
export { skillremoveconfirmtitle3 as "skillRemoveConfirmTitle" };
