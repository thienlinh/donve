/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersloaderrortitle3Inputs */

const vi_membersloaderrortitle3 =
  /** @type {(inputs: Membersloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Không tải được danh sách thành viên`;
  };

const en_membersloaderrortitle3 =
  /** @type {(inputs: Membersloaderrortitle3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Couldn't load members`;
  };

/**
 * | output |
 * | --- |
 * | "Couldn't load members" |
 *
 * @param {Membersloaderrortitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersloaderrortitle3 =
  /** @type {((inputs?: Membersloaderrortitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersloaderrortitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersloaderrortitle3(inputs);
      return vi_membersloaderrortitle3(inputs);
    }
  );
export { membersloaderrortitle3 as "membersLoadErrorTitle" };
