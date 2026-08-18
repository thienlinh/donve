export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiodesignfilesemptydescription4Inputs = {};
/**
 * | output |
 * | --- |
 * | "The file tree (folders, pages, data, images) lands in a follow-up pass." |
 *
 * @param {Studiodesignfilesemptydescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiodesignfilesemptydescription4: ((
  inputs?: Studiodesignfilesemptydescription4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiodesignfilesemptydescription4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiodesignfilesemptydescription4 as "studioDesignFilesEmptyDescription" };
