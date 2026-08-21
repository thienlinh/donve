/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domainsadddialogdescription3Inputs */

const vi_domainsadddialogdescription3 =
  /** @type {(inputs: Domainsadddialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Chọn một trang landing đã publish và nhập tên miền bạn sở hữu. Sau khi đăng ký bạn sẽ nhận được bản ghi CNAME cần thêm.`;
  };

const en_domainsadddialogdescription3 =
  /** @type {(inputs: Domainsadddialogdescription3Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Pick a published landing page and enter the domain you own. You'll get a CNAME record to add once it's registered.`;
  };

/**
 * | output |
 * | --- |
 * | "Pick a published landing page and enter the domain you own. You'll get a CNAME record to add once it's registered." |
 *
 * @param {Domainsadddialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const domainsadddialogdescription3 =
  /** @type {((inputs?: Domainsadddialogdescription3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domainsadddialogdescription3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_domainsadddialogdescription3(inputs);
      return vi_domainsadddialogdescription3(inputs);
    }
  );
export { domainsadddialogdescription3 as "domainsAddDialogDescription" };
