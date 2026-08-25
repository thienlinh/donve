import { z } from "zod";

export const imagePropsSchema = z.object({
  src: z.string(),
  alt: z.string()
});
export type ImageProps = z.infer<typeof imagePropsSchema>;

/** An uploaded video asset + its client-extracted first frame (FR-B-29). Distinct from a
 * plain `videoUrl` string prop, which is a third-party embed URL the user pastes. */
export const videoPropsSchema = z.object({
  src: z.string(),
  poster: z.string().optional()
});
export type VideoProps = z.infer<typeof videoPropsSchema>;
