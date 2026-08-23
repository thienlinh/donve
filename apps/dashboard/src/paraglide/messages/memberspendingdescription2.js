/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Memberspendingdescription2Inputs */

const vi_memberspendingdescription2 =
  /** @type {(inputs: Memberspendingdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Những lời mời chưa được chấp nhận.`;
  };

const en_memberspendingdescription2 =
  /** @type {(inputs: Memberspendingdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Invitations that haven't been accepted yet.`;
  };

/**
 * | output |
 * | --- |
 * | "Invitations that haven't been accepted yet." |
 *
 * @param {Memberspendingdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const memberspendingdescription2 =
  /** @type {((inputs?: Memberspendingdescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Memberspendingdescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_memberspendingdescription2(inputs);
      return vi_memberspendingdescription2(inputs);
    }
  );
export { memberspendingdescription2 as "membersPendingDescription" };
