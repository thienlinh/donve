/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Prompttemplatesdescription2Inputs */

const vi_prompttemplatesdescription2 =
  /** @type {(inputs: Prompttemplatesdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Các prompt có cấu trúc mà AI biên dịch cùng biến thương hiệu/sản phẩm/giọng văn trước khi tạo nội dung.`;
  };

const en_prompttemplatesdescription2 =
  /** @type {(inputs: Prompttemplatesdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Structured prompts the AI compiles with your brand/product/tone variables before generating.`;
  };

/**
 * | output |
 * | --- |
 * | "Structured prompts the AI compiles with your brand/product/tone variables before generating." |
 *
 * @param {Prompttemplatesdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const prompttemplatesdescription2 =
  /** @type {((inputs?: Prompttemplatesdescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Prompttemplatesdescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_prompttemplatesdescription2(inputs);
      return vi_prompttemplatesdescription2(inputs);
    }
  );
export { prompttemplatesdescription2 as "promptTemplatesDescription" };
