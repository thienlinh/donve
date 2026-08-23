/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadssubnavwebhooks3Inputs */

const vi_leadssubnavwebhooks3 =
  /** @type {(inputs: Leadssubnavwebhooks3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Webhooks`;
  };

const en_leadssubnavwebhooks3 =
  /** @type {(inputs: Leadssubnavwebhooks3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Webhooks`;
  };

/**
 * | output |
 * | --- |
 * | "Webhooks" |
 *
 * @param {Leadssubnavwebhooks3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadssubnavwebhooks3 =
  /** @type {((inputs?: Leadssubnavwebhooks3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadssubnavwebhooks3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadssubnavwebhooks3(inputs);
      return vi_leadssubnavwebhooks3(inputs);
    }
  );
export { leadssubnavwebhooks3 as "leadsSubNavWebhooks" };
