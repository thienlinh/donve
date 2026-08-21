/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Campaignsanalyticsdescription2Inputs */

const vi_campaignsanalyticsdescription2 =
  /** @type {(inputs: Campaignsanalyticsdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `30 ngày gần nhất — lượt xem, lượt đăng ký, đơn hàng và doanh thu đã đối soát.`;
  };

const en_campaignsanalyticsdescription2 =
  /** @type {(inputs: Campaignsanalyticsdescription2Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Last 30 days — views, submits, orders, and reconciled revenue.`;
  };

/**
 * | output |
 * | --- |
 * | "Last 30 days — views, submits, orders, and reconciled revenue." |
 *
 * @param {Campaignsanalyticsdescription2Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const campaignsanalyticsdescription2 =
  /** @type {((inputs?: Campaignsanalyticsdescription2Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Campaignsanalyticsdescription2Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_campaignsanalyticsdescription2(inputs);
      return vi_campaignsanalyticsdescription2(inputs);
    }
  );
export { campaignsanalyticsdescription2 as "campaignsAnalyticsDescription" };
