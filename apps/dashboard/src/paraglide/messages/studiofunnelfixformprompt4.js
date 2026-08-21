/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiofunnelfixformprompt4Inputs */

const vi_studiofunnelfixformprompt4 =
  /** @type {(inputs: Studiofunnelfixformprompt4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Trang chưa có form đăng ký chuẩn của nền tảng. Hãy thêm một form với thuộc tính data-dv-form="lead", các trường input name="fullName", name="phone", name="email" (không bắt buộc), name="persona" (dropdown "Bạn đang là ai?"), một checkbox bắt buộc name="consent", một input ẩn name="_hp" (honeypot chống spam), và nút submit — đặt vào vị trí phù hợp trong bố cục hiện tại, giữ nguyên phong cách thiết kế của trang.`;
  };

const en_studiofunnelfixformprompt4 =
  /** @type {(inputs: Studiofunnelfixformprompt4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `This page has no standard platform lead form. Add a form with the attribute data-dv-form="lead", input fields name="fullName", name="phone", name="email" (optional), name="persona" (a "Who are you?" dropdown), a required checkbox name="consent", a hidden input name="_hp" (spam honeypot), and a submit button — place it wherever fits the current layout, matching the page's existing design.`;
  };

/**
 * | output |
 * | --- |
 * | "This page has no standard platform lead form. Add a form with the attribute data-dv-form=\"lead\", input fields name=\"fullName\", name=\"phone\", name=\"email\" (op..." |
 *
 * @param {Studiofunnelfixformprompt4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiofunnelfixformprompt4 =
  /** @type {((inputs?: Studiofunnelfixformprompt4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiofunnelfixformprompt4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiofunnelfixformprompt4(inputs);
      return vi_studiofunnelfixformprompt4(inputs);
    }
  );
export { studiofunnelfixformprompt4 as "studioFunnelFixFormPrompt" };
