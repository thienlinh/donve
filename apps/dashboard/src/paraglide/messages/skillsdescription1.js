/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skillsdescription1Inputs */

const vi_skillsdescription1 =
  /** @type {(inputs: Skillsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Các hướng dẫn tái sử dụng mà AI áp dụng khi tạo hoặc chỉnh sửa landing page.`;
  };

const en_skillsdescription1 =
  /** @type {(inputs: Skillsdescription1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Reusable instructions the AI applies when generating or patching landing pages.`;
  };

/**
 * | output |
 * | --- |
 * | "Reusable instructions the AI applies when generating or patching landing pages." |
 *
 * @param {Skillsdescription1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skillsdescription1 =
  /** @type {((inputs?: Skillsdescription1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skillsdescription1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skillsdescription1(inputs);
      return vi_skillsdescription1(inputs);
    }
  );
export { skillsdescription1 as "skillsDescription" };
