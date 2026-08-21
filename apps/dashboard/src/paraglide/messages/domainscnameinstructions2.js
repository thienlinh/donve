/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hostname: NonNullable<unknown>, target: NonNullable<unknown> }} Domainscnameinstructions2Inputs */

const vi_domainscnameinstructions2 =
  /** @type {(inputs: Domainscnameinstructions2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Thêm bản ghi CNAME: ${i?.hostname} → ${i?.target}`;
  };

const en_domainscnameinstructions2 =
  /** @type {(inputs: Domainscnameinstructions2Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `Add a CNAME record: ${i?.hostname} → ${i?.target}`;
  };

/**
 * | output |
 * | --- |
 * | "Add a CNAME record: {hostname} → {target}" |
 *
 * @param {Domainscnameinstructions2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainscnameinstructions2 =
  /** @type {((inputs: Domainscnameinstructions2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainscnameinstructions2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainscnameinstructions2(inputs);
      return vi_domainscnameinstructions2(inputs);
    }
  );
export { domainscnameinstructions2 as "domainsCnameInstructions" };
