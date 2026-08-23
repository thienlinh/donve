export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiopublishdialogdescription3Inputs = {};
/**
 * | output |
 * | --- |
 * | "Rollback and unpublish take effect immediately — no separate cache purge needed." |
 *
 * @param {Studiopublishdialogdescription3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiopublishdialogdescription3: ((
  inputs?: Studiopublishdialogdescription3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiopublishdialogdescription3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiopublishdialogdescription3 as "studioPublishDialogDescription" };
