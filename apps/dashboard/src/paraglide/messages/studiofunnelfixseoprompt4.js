/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofunnelfixseoprompt4Inputs */

const vi_studiofunnelfixseoprompt4 =
  /** @type {(inputs: Studiofunnelfixseoprompt4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trang chưa có <title> và/hoặc <meta name="description"> đầy đủ. Hãy viết tiêu đề và mô tả SEO phù hợp với nội dung trang (tiếng Việt, hấp dẫn, mô tả dưới 160 ký tự) rồi chèn vào <head>.`;
  };

const en_studiofunnelfixseoprompt4 =
  /** @type {(inputs: Studiofunnelfixseoprompt4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `This page has no <title> and/or no <meta name="description">. Write a title and SEO description that fit the page's content (compelling, description under 160 characters) and insert them into <head>.`;
  };

/**
 * | output |
 * | --- |
 * | "This page has no <title> and/or no <meta name=\"description\">. Write a title and SEO description that fit the page's content (compelling, description under 16..." |
 *
 * @param {Studiofunnelfixseoprompt4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofunnelfixseoprompt4 =
  /** @type {((inputs?: Studiofunnelfixseoprompt4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofunnelfixseoprompt4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofunnelfixseoprompt4(inputs);
      return vi_studiofunnelfixseoprompt4(inputs);
    }
  );
export { studiofunnelfixseoprompt4 as "studioFunnelFixSeoPrompt" };
