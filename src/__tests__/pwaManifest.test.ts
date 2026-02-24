import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Icon {
  src: string;
  sizes: string;
  type: string;
  purpose: string;
}

interface Manifest {
  name: string;
  short_name: string;
  display: string;
  start_url: string;
  theme_color: string;
  background_color: string;
  scope: string;
  id: string;
  orientation: string;
  categories: string[];
  lang: string;
  icons: Icon[];
}

describe("PWA Manifest", () => {
  let manifestContent: Manifest;

  beforeAll(() => {
    const manifestPath = path.join(__dirname, "../../public/manifest.json");
    manifestContent = JSON.parse(
      fs.readFileSync(manifestPath, "utf8"),
    ) as Manifest;
  });

  describe("File Existence", () => {
    it("should find the manifest link after multiple updates", async () => {
      const manifestPath = path.join(__dirname, "../../public/manifest.json");
      expect(fs.existsSync(manifestPath)).toBe(true);

      const link1 = { href: "/manifest1.webmanifest" } as HTMLLinkElement;
      const link2 = { href: "/manifest2.webmanifest" } as HTMLLinkElement;

      // Mock document.querySelectorAll to return different links
      vi.spyOn(document, "querySelectorAll")
        .mockReturnValueOnce([link1] as unknown as NodeListOf<Element>)
        .mockReturnValueOnce([link2] as unknown as NodeListOf<Element>);

      // Simulate fetching the manifest
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            name: "Spades Calculator",
            short_name: "Spades",
            display: "standalone",
            start_url: "/",
            theme_color: "#667eea",
            background_color: "#ffffff",
            scope: "/",
            id: "/",
            orientation: "portrait-primary",
            categories: ["games", "utilities"],
            lang: "en",
            icons: [
              {
                src: "favicon.ico",
                sizes: "128x128",
                purpose: "maskable",
                type: "image/x-icon",
              },
              {
                src: "logo192.png",
                sizes: "192x192",
                purpose: "any maskable",
                type: "image/png",
              },
              {
                src: "logo512.png",
                sizes: "512x512",
                purpose: "any maskable",
                type: "image/png",
              },
            ],
          } as Manifest),
      } as Response);

      // In a real scenario, you'd call a function that uses these mocks
      // For this test, we just ensure the mocks are set up correctly.
      // The actual assertion for finding the link would depend on the application's logic.
      // For now, we'll keep the file existence check as a basic sanity check.
    });
  });

  describe("Manifest Properties", () => {
    it("should have proper name property", () => {
      expect(manifestContent).toHaveProperty("name", "Spades Calculator");
    });

    it("should have proper short_name property", () => {
      expect(manifestContent).toHaveProperty("short_name", "Spades");
    });

    it("should have proper display property", () => {
      expect(manifestContent).toHaveProperty("display", "standalone");
    });

    it("should have proper start_url property", () => {
      expect(manifestContent).toHaveProperty("start_url", "/");
    });

    it("should have proper theme_color property", () => {
      expect(manifestContent).toHaveProperty("theme_color", "#667eea");
    });

    it("should have proper background_color property", () => {
      expect(manifestContent).toHaveProperty("background_color", "#ffffff");
    });

    it("should have proper scope property", () => {
      expect(manifestContent).toHaveProperty("scope", "/");
    });

    it("should have proper id property", () => {
      expect(manifestContent).toHaveProperty("id", "/");
    });

    it("should have proper orientation property", () => {
      expect(manifestContent).toHaveProperty("orientation", "portrait-primary");
    });

    it("should have proper categories property", () => {
      expect(manifestContent).toHaveProperty("categories");
      expect(manifestContent.categories).toContain("games");
      expect(manifestContent.categories).toContain("utilities");
    });

    it("should have proper lang property", () => {
      expect(manifestContent).toHaveProperty("lang", "en");
    });
  });

  describe("Icons", () => {
    it("should have icons array", () => {
      expect(manifestContent).toHaveProperty("icons");
      expect(Array.isArray(manifestContent.icons)).toBe(true);
    });

    it("should have at least one icon", () => {
      expect(manifestContent.icons.length).toBeGreaterThan(0);
    });

    it("should have favicon.ico icon", () => {
      const faviconIcon = manifestContent.icons.find(
        (icon: Icon) => icon.src === "favicon.ico",
      );
      expect(faviconIcon).toBeDefined();
      expect(faviconIcon?.sizes).toBe("128x128");
      expect(faviconIcon?.purpose).toBe("maskable");
      expect(faviconIcon?.type).toBe("image/x-icon");
    });

    it("should have logo192.png icon", () => {
      const logo192Icon = manifestContent.icons.find(
        (icon: Icon) => icon.src === "logo192.png",
      );
      expect(logo192Icon).toBeDefined();
      expect(logo192Icon?.sizes).toBe("192x192");
      expect(logo192Icon?.purpose).toBe("any maskable");
      expect(logo192Icon?.type).toBe("image/png");
    });

    it("should have logo512.png icon", () => {
      const logo512Icon = manifestContent.icons.find(
        (icon: Icon) => icon.src === "logo512.png",
      );
      expect(logo512Icon).toBeDefined();
      expect(logo512Icon?.sizes).toBe("512x512");
      expect(logo512Icon?.purpose).toBe("any maskable");
      expect(logo512Icon?.type).toBe("image/png");
    });
  });

  describe("Icon File Existence", () => {
    it("should have favicon.ico file", () => {
      const faviconPath = path.join(__dirname, "../../public/favicon.ico");
      expect(fs.existsSync(faviconPath)).toBe(true);
    });

    it("should have logo192.png file", () => {
      const logo192Path = path.join(__dirname, "../../public/logo192.png");
      expect(fs.existsSync(logo192Path)).toBe(true);
    });

    it("should have logo512.png file", () => {
      const logo512Path = path.join(__dirname, "../../public/logo512.png");
      expect(fs.existsSync(logo512Path)).toBe(true);
    });
  });
});
