/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commonloading1Inputs */

const vi_commonloading1 =
  /** @type {(inputs: Commonloading1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang tải...`;
  };

const en_commonloading1 =
  /** @type {(inputs: Commonloading1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Loading...`;
  };

/**
 * | output |
 * | --- |
 * | "Loading..." |
 *
 * @param {Commonloading1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const commonloading1 =
  /** @type {((inputs?: Commonloading1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commonloading1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_commonloading1(inputs);
      return vi_commonloading1(inputs);
    }
  );
export { commonloading1 as "commonLoading" };
