/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Leadsnotifysettingsdescription3Inputs */

const vi_leadsnotifysettingsdescription3 =
  /** @type {(inputs: Leadsnotifysettingsdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chọn kênh notify_manager (cảnh báo quá SLA) sẽ gửi tới. Email không cần cấu hình gì thêm; Zalo ZNS/SMS cần tự nhập thông tin nhà cung cấp bên dưới.`;
  };

const en_leadsnotifysettingsdescription3 =
  /** @type {(inputs: Leadsnotifysettingsdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Pick which channel notify_manager (SLA-breach alerts) pushes to. Email needs no setup; Zalo ZNS/SMS need your own provider credentials below.`;
  };

/**
 * | output |
 * | --- |
 * | "Pick which channel notify_manager (SLA-breach alerts) pushes to. Email needs no setup; Zalo ZNS/SMS need your own provider credentials below." |
 *
 * @param {Leadsnotifysettingsdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const leadsnotifysettingsdescription3 =
  /** @type {((inputs?: Leadsnotifysettingsdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Leadsnotifysettingsdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_leadsnotifysettingsdescription3(inputs);
      return vi_leadsnotifysettingsdescription3(inputs);
    }
  );
export { leadsnotifysettingsdescription3 as "leadsNotifySettingsDescription" };
