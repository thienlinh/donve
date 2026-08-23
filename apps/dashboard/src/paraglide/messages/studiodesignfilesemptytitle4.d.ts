export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodesignfilesemptytitle4Inputs = {};
/**
 * | output |
 * | --- |
 * | "Design Files" |
 *
 * @param {Studiodesignfilesemptytitle4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodesignfilesemptytitle4: ((
  inputs?: Studiodesignfilesemptytitle4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodesignfilesemptytitle4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodesignfilesemptytitle4 as "studioDesignFilesEmptyTitle" };
