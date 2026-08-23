/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Membersremoveconfirmbody3Inputs */

const vi_membersremoveconfirmbody3 =
  /** @type {(inputs: Membersremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Người này sẽ mất quyền truy cập vào tổ chức ngay lập tức.`;
  };

const en_membersremoveconfirmbody3 =
  /** @type {(inputs: Membersremoveconfirmbody3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `They'll immediately lose access to this organization.`;
  };

/**
 * | output |
 * | --- |
 * | "They'll immediately lose access to this organization." |
 *
 * @param {Membersremoveconfirmbody3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersremoveconfirmbody3 =
  /** @type {((inputs?: Membersremoveconfirmbody3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersremoveconfirmbody3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersremoveconfirmbody3(inputs);
      return vi_membersremoveconfirmbody3(inputs);
    }
  );
export { membersremoveconfirmbody3 as "membersRemoveConfirmBody" };
