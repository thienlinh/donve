/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodeploystatusunpublished3Inputs */

const vi_studiodeploystatusunpublished3 =
  /** @type {(inputs: Studiodeploystatusunpublished3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Đã gỡ xuất bản`;
  };

const en_studiodeploystatusunpublished3 =
  /** @type {(inputs: Studiodeploystatusunpublished3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Unpublished`;
  };

/**
 * | output |
 * | --- |
 * | "Unpublished" |
 *
 * @param {Studiodeploystatusunpublished3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodeploystatusunpublished3 =
  /** @type {((inputs?: Studiodeploystatusunpublished3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodeploystatusunpublished3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodeploystatusunpublished3(inputs);
      return vi_studiodeploystatusunpublished3(inputs);
    }
  );
export { studiodeploystatusunpublished3 as "studioDeployStatusUnpublished" };
