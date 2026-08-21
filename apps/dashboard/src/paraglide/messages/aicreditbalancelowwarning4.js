/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Aicreditbalancelowwarning4Inputs */

const vi_aicreditbalancelowwarning4 =
  /** @type {(inputs: Aicreditbalancelowwarning4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Số dư credit sắp hết — nạp thêm để không bị gián đoạn khi tạo trang.`;
  };

const en_aicreditbalancelowwarning4 =
  /** @type {(inputs: Aicreditbalancelowwarning4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Credit balance is running low — top up to avoid interrupted generations.`;
  };

/**
 * | output |
 * | --- |
 * | "Credit balance is running low — top up to avoid interrupted generations." |
 *
 * @param {Aicreditbalancelowwarning4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const aicreditbalancelowwarning4 =
  /** @type {((inputs?: Aicreditbalancelowwarning4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Aicreditbalancelowwarning4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_aicreditbalancelowwarning4(inputs);
      return vi_aicreditbalancelowwarning4(inputs);
    }
  );
export { aicreditbalancelowwarning4 as "aiCreditBalanceLowWarning" };
