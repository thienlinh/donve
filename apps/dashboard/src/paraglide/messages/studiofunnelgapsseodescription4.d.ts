export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiofunnelgapsseodescription4Inputs = {};
/**
 * | output |
 * | --- |
 * | "This imported page is missing SEO meta (title/description). Let AI fill it in?" |
 *
 * @param {Studiofunnelgapsseodescription4Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiofunnelgapsseodescription4: ((
  inputs?: Studiofunnelgapsseodescription4Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiofunnelgapsseodescription4Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiofunnelgapsseodescription4 as "studioFunnelGapsSeoDescription" };
