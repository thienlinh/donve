import { createFileRoute } from "@tanstack/react-router";

import { PromptLibraryGalleryPage } from "@/features/prompt-library/components/prompt-library-gallery-page";

export const Route = createFileRoute("/_authenticated/prompt-library/")({
  component: PromptLibraryGalleryPage
});
