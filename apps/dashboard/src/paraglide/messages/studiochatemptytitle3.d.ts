export type LocalizedString = import("../runtime.js").LocalizedString;
export type Studiochatemptytitle3Inputs = {};
/**
 * | output |
 * | --- |
 * | "No messages yet" |
 *
 * @param {Studiochatemptytitle3Inputs} inputs
 * @param {{ locale?: "vi" | "en" }} options
 * @returns {LocalizedString}
 */
declare const studiochatemptytitle3: ((
  inputs?: Studiochatemptytitle3Inputs,
  options?: {
    locale?: "vi" | "en";
  }
) => LocalizedString) &
  import("../runtime.js").MessageMetadata<
    Studiochatemptytitle3Inputs,
    {
      locale?: "vi" | "en";
    },
    {}
  >;
export { studiochatemptytitle3 as "studioChatEmptyTitle" };
