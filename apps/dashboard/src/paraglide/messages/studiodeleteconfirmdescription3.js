/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Studiodeleteconfirmdescription3Inputs */

const vi_studiodeleteconfirmdescription3 =
  /** @type {(inputs: Studiodeleteconfirmdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Section này có nhiều phần tử con hoặc chiếm phần lớn trang. Bạn có thể hoàn tác bằng Cmd+Z.`;
  };

const en_studiodeleteconfirmdescription3 =
  /** @type {(inputs: Studiodeleteconfirmdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `It has several child elements or covers a large part of the page. You can undo this with Cmd+Z.`;
  };

/**
 * | output |
 * | --- |
 * | "It has several child elements or covers a large part of the page. You can undo this with Cmd+Z." |
 *
 * @param {Studiodeleteconfirmdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const studiodeleteconfirmdescription3 =
  /** @type {((inputs?: Studiodeleteconfirmdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Studiodeleteconfirmdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_studiodeleteconfirmdescription3(inputs);
      return vi_studiodeleteconfirmdescription3(inputs);
    }
  );
export { studiodeleteconfirmdescription3 as "studioDeleteConfirmDescription" };
