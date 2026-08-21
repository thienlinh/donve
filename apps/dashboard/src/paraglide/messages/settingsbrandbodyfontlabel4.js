/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settingsbrandbodyfontlabel4Inputs */

const vi_settingsbrandbodyfontlabel4 =
  /** @type {(inputs: Settingsbrandbodyfontlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Font nội dung`;
  };

const en_settingsbrandbodyfontlabel4 =
  /** @type {(inputs: Settingsbrandbodyfontlabel4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Body font`;
  };

/**
 * | output |
 * | --- |
 * | "Body font" |
 *
 * @param {Settingsbrandbodyfontlabel4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const settingsbrandbodyfontlabel4 =
  /** @type {((inputs?: Settingsbrandbodyfontlabel4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settingsbrandbodyfontlabel4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_settingsbrandbodyfontlabel4(inputs);
      return vi_settingsbrandbodyfontlabel4(inputs);
    }
  );
export { settingsbrandbodyfontlabel4 as "settingsBrandBodyFontLabel" };
