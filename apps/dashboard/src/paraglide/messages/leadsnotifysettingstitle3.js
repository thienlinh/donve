/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifysettingstitle3Inputs */

const vi_leadsnotifysettingstitle3 =
  /** @type {(inputs: Leadsnotifysettingstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kênh cảnh báo quản lý`;
  };

const en_leadsnotifysettingstitle3 =
  /** @type {(inputs: Leadsnotifysettingstitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Manager alert channel`;
  };

/**
 * | output |
 * | --- |
 * | "Manager alert channel" |
 *
 * @param {Leadsnotifysettingstitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifysettingstitle3 =
  /** @type {((inputs?: Leadsnotifysettingstitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifysettingstitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifysettingstitle3(inputs);
      return vi_leadsnotifysettingstitle3(inputs);
    }
  );
export { leadsnotifysettingstitle3 as "leadsNotifySettingsTitle" };
