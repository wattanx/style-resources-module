import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { setup, $fetch } from "@nuxt/test-utils";

describe("ssr", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("./fixtures/sass", import.meta.url)),
  });

  it("renders the index page", async () => {
    const html = await $fetch("/");
    expect(html).toContain(".test{color:#333;line-height:16");
    expect(html).toContain(".test{background-color:#fff");
  });
});
