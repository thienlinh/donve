/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Orgswitchercreateorg3Inputs */

const vi_orgswitchercreateorg3 =
  /** @type {(inputs: Orgswitchercreateorg3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Tạo tổ chức mới`;
  };

const en_orgswitchercreateorg3 =
  /** @type {(inputs: Orgswitchercreateorg3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Create new organization`;
  };

/**
 * | output |
 * | --- |
 * | "Create new organization" |
 *
 * @param {Orgswitchercreateorg3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const orgswitchercreateorg3 =
  /** @type {((inputs?: Orgswitchercreateorg3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Orgswitchercreateorg3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_orgswitchercreateorg3(inputs);
      return vi_orgswitchercreateorg3(inputs);
    }
  );
export { orgswitchercreateorg3 as "orgSwitcherCreateOrg" };
