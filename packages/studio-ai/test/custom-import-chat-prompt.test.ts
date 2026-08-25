import { describe, expect, it } from "vitest";

import { compileCustomImportChatPrompt } from "../src/custom-import-chat-prompt.js";

describe("compileCustomImportChatPrompt", () => {
  it("embeds the current HTML and the user's message", () => {
    const prompt = compileCustomImportChatPrompt({
      html: "<h1>Chào mừng</h1>",
      message: "sửa headline thành Xin chào"
    });

    expect(prompt).toContain("<h1>Chào mừng</h1>");
    expect(prompt).toContain("sửa headline thành Xin chào");
    expect(prompt).toContain('"search"');
    expect(prompt).toContain('"replace"');
  });
});
