/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hostname: NonNullable<unknown> }} Domainsremoveconfirmtitle3Inputs */

const vi_domainsremoveconfirmtitle3 =
  /** @type {(inputs: Domainsremoveconfirmtitle3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Xóa ${i?.hostname}?`;
  };

const en_domainsremoveconfirmtitle3 =
  /** @type {(inputs: Domainsremoveconfirmtitle3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Remove ${i?.hostname}?`;
  };

/**
 * | output |
 * | --- |
 * | "Remove {hostname}?" |
 *
 * @param {Domainsremoveconfirmtitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsremoveconfirmtitle3 =
  /** @type {((inputs: Domainsremoveconfirmtitle3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsremoveconfirmtitle3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsremoveconfirmtitle3(inputs);
      return vi_domainsremoveconfirmtitle3(inputs);
    }
  );
export { domainsremoveconfirmtitle3 as "domainsRemoveConfirmTitle" };
