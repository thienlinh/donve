/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateconnectionlabel3Inputs */

const vi_prompttemplateconnectionlabel3 =
  /** @type {(inputs: Prompttemplateconnectionlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Kết nối model`;
  };

const en_prompttemplateconnectionlabel3 =
  /** @type {(inputs: Prompttemplateconnectionlabel3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Model connection`;
  };

/**
 * | output |
 * | --- |
 * | "Model connection" |
 *
 * @param {Prompttemplateconnectionlabel3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateconnectionlabel3 =
  /** @type {((inputs?: Prompttemplateconnectionlabel3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateconnectionlabel3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateconnectionlabel3(inputs);
      return vi_prompttemplateconnectionlabel3(inputs);
    }
  );
export { prompttemplateconnectionlabel3 as "promptTemplateConnectionLabel" };
