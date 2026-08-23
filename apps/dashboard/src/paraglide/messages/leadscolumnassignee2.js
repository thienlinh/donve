/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadscolumnassignee2Inputs */

const vi_leadscolumnassignee2 =
  /** @type {(inputs: Leadscolumnassignee2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Người phụ trách`;
  };

const en_leadscolumnassignee2 =
  /** @type {(inputs: Leadscolumnassignee2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Assignee`;
  };

/**
 * | output |
 * | --- |
 * | "Assignee" |
 *
 * @param {Leadscolumnassignee2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadscolumnassignee2 =
  /** @type {((inputs?: Leadscolumnassignee2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadscolumnassignee2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadscolumnassignee2(inputs);
      return vi_leadscolumnassignee2(inputs);
    }
  );
export { leadscolumnassignee2 as "leadsColumnAssignee" };
