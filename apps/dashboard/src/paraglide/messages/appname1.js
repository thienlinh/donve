/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js"

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Appname1Inputs */

const vi_appname1 =
  /** @type {(inputs: Appname1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Donve`
  }

const en_appname1 =
  /** @type {(inputs: Appname1Inputs) => LocalizedString} */ () => {
    return /** @type {LocalizedString} */ `Donve`
  }

/**
 * | output |
 * | --- |
 * | "Donve" |
 *
 * @param {Appname1Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const appname1 =
  /** @type {((inputs?: Appname1Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Appname1Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs = {}, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
      if (locale === "en") return en_appname1(inputs)
      return vi_appname1(inputs)
    }
  )
export { appname1 as "appName" }
