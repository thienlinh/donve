/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsactivitysystem2Inputs */

const vi_leadsactivitysystem2 =
  /** @type {(inputs: Leadsactivitysystem2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Cập nhật hệ thống`;
  };

const en_leadsactivitysystem2 =
  /** @type {(inputs: Leadsactivitysystem2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `System update`;
  };

/**
 * | output |
 * | --- |
 * | "System update" |
 *
 * @param {Leadsactivitysystem2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsactivitysystem2 =
  /** @type {((inputs?: Leadsactivitysystem2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsactivitysystem2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsactivitysystem2(inputs);
      return vi_leadsactivitysystem2(inputs);
    }
  );
export { leadsactivitysystem2 as "leadsActivitySystem" };
