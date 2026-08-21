/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplateconnectionplatform3Inputs */

const vi_prompttemplateconnectionplatform3 =
  /** @type {(inputs: Prompttemplateconnectionplatform3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Nền tảng (tính vào credit của tổ chức)`;
  };

const en_prompttemplateconnectionplatform3 =
  /** @type {(inputs: Prompttemplateconnectionplatform3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Platform (billed to org credits)`;
  };

/**
 * | output |
 * | --- |
 * | "Platform (billed to org credits)" |
 *
 * @param {Prompttemplateconnectionplatform3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplateconnectionplatform3 =
  /** @type {((inputs?: Prompttemplateconnectionplatform3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplateconnectionplatform3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplateconnectionplatform3(inputs);
      return vi_prompttemplateconnectionplatform3(inputs);
    }
  );
export { prompttemplateconnectionplatform3 as "promptTemplateConnectionPlatform" };
