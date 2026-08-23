/* eslint-disable */
import { getLocale, experimentalStaticLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ org: NonNullable<unknown>, role: NonNullable<unknown> }} Membersinvitationbannertext3Inputs */

const vi_membersinvitationbannertext3 =
  /** @type {(inputs: Membersinvitationbannertext3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `${i?.org} đã mời bạn tham gia với vai trò ${i?.role}.`;
  };

const en_membersinvitationbannertext3 =
  /** @type {(inputs: Membersinvitationbannertext3Inputs) => LocalizedString} */ (
    i
  ) => {
    return /** @type {LocalizedString} */ `${i?.org} invited you to join as ${i?.role}.`;
  };

/**
 * | output |
 * | --- |
 * | "{org} invited you to join as {role}." |
 *
 * @param {Membersinvitationbannertext3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
const membersinvitationbannertext3 =
  /** @type {((inputs: Membersinvitationbannertext3Inputs, options?: { locale?: "vi" | "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Membersinvitationbannertext3Inputs, { locale?: "vi" | "en" }, {}>} */ (
    (inputs, options = {}) => {
      const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
      if (locale === "en") return en_membersinvitationbannertext3(inputs);
      return vi_membersinvitationbannertext3(inputs);
    }
  );
export { membersinvitationbannertext3 as "membersInvitationBannerText" };
