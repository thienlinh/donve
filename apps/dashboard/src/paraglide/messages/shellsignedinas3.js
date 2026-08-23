/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ email: NonNullable<unknown> }} Shellsignedinas3Inputs */

const vi_shellsignedinas3 =
  /** @type {(inputs: Shellsignedinas3Inputs) => LocalizedString} */ (i) => {
    return /** @type {LocalizedString} */ `Đăng nhập với ${i?.email}`;
  };

const en_shellsignedinas3 =
  /** @type {(inputs: Shellsignedinas3Inputs) => LocalizedString} */ (i) => {
    return /** @type {LocalizedString} */ `Signed in as ${i?.email}`;
  };

/**
 * | output |
 * | --- |
 * | "Signed in as {email}" |
 *
 * @param {Shellsignedinas3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const shellsignedinas3 =
  /** @type {((inputs: Shellsignedinas3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Shellsignedinas3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_shellsignedinas3(inputs);
      return vi_shellsignedinas3(inputs);
    }
  );
export { shellsignedinas3 as "shellSignedInAs" };
