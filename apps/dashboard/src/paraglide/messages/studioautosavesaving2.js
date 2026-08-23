/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studioautosavesaving2Inputs */

const vi_studioautosavesaving2 =
  /** @type {(inputs: Studioautosavesaving2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đang lưu…`;
  };

const en_studioautosavesaving2 =
  /** @type {(inputs: Studioautosavesaving2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Saving…`;
  };

/**
 * | output |
 * | --- |
 * | "Saving…" |
 *
 * @param {Studioautosavesaving2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studioautosavesaving2 =
  /** @type {((inputs?: Studioautosavesaving2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studioautosavesaving2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studioautosavesaving2(inputs);
      return vi_studioautosavesaving2(inputs);
    }
  );
export { studioautosavesaving2 as "studioAutosaveSaving" };
