/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aiconnectdialogdescription3Inputs */

const vi_aiconnectdialogdescription3 =
  /** @type {(inputs: Aiconnectdialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `OpenRouter dễ bắt đầu nhất — một key duy nhất, có model free để test.`;
  };

const en_aiconnectdialogdescription3 =
  /** @type {(inputs: Aiconnectdialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `OpenRouter is the easiest to start with — one key, a free model to test.`;
  };

/**
 * | output |
 * | --- |
 * | "OpenRouter is the easiest to start with — one key, a free model to test." |
 *
 * @param {Aiconnectdialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aiconnectdialogdescription3 =
  /** @type {((inputs?: Aiconnectdialogdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aiconnectdialogdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aiconnectdialogdescription3(inputs);
      return vi_aiconnectdialogdescription3(inputs);
    }
  );
export { aiconnectdialogdescription3 as "aiConnectDialogDescription" };
