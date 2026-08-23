/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skilldialogdescription2Inputs */

const vi_skilldialogdescription2 =
  /** @type {(inputs: Skilldialogdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Viết hướng dẫn bằng Markdown — bản xem trước hiển thị đúng nội dung AI sẽ nhận được.`;
  };

const en_skilldialogdescription2 =
  /** @type {(inputs: Skilldialogdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Write the instructions in Markdown — the preview renders exactly what the AI sees.`;
  };

/**
 * | output |
 * | --- |
 * | "Write the instructions in Markdown — the preview renders exactly what the AI sees." |
 *
 * @param {Skilldialogdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const skilldialogdescription2 =
  /** @type {((inputs?: Skilldialogdescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skilldialogdescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_skilldialogdescription2(inputs);
      return vi_skilldialogdescription2(inputs);
    }
  );
export { skilldialogdescription2 as "skillDialogDescription" };
