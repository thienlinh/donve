/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsformfieldtypecheckbox4Inputs */

const vi_campaignsformfieldtypecheckbox4 =
  /** @type {(inputs: Campaignsformfieldtypecheckbox4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Checkbox`;
  };

const en_campaignsformfieldtypecheckbox4 =
  /** @type {(inputs: Campaignsformfieldtypecheckbox4Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Checkbox`;
  };

/**
 * | output |
 * | --- |
 * | "Checkbox" |
 *
 * @param {Campaignsformfieldtypecheckbox4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsformfieldtypecheckbox4 =
  /** @type {((inputs?: Campaignsformfieldtypecheckbox4Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsformfieldtypecheckbox4Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsformfieldtypecheckbox4(inputs);
      return vi_campaignsformfieldtypecheckbox4(inputs);
    }
  );
export { campaignsformfieldtypecheckbox4 as "campaignsFormFieldTypeCheckbox" };
