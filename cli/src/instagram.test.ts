import { isInstagramUrl } from "./instagram";

describe("isInstagramUrl", () => {
  describe("valid Instagram URLs", () => {
    it("matches a reel URL", () => {
      expect(isInstagramUrl("https://www.instagram.com/reel/DYYLTCLNs6J/")).toBe(true);
    });

    it("matches a reels URL (plural)", () => {
      expect(isInstagramUrl("https://www.instagram.com/reels/DYYLTCLNs6J/")).toBe(true);
    });

    it("matches a post URL (/p/)", () => {
      expect(isInstagramUrl("https://www.instagram.com/p/DYYLTCLNs6J/")).toBe(true);
    });

    it("matches an IGTV URL (/tv/)", () => {
      expect(isInstagramUrl("https://www.instagram.com/tv/DYYLTCLNs6J/")).toBe(true);
    });

    it("matches a URL with UTM query params", () => {
      expect(
        isInstagramUrl(
          "https://www.instagram.com/reel/DYYLTCLNs6J/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ=="
        )
      ).toBe(true);
    });

    it("matches a URL without www", () => {
      expect(isInstagramUrl("https://instagram.com/reel/DYYLTCLNs6J/")).toBe(true);
    });

    it("matches a URL without protocol", () => {
      expect(isInstagramUrl("instagram.com/reel/DYYLTCLNs6J/")).toBe(true);
    });

    it("matches a URL with http", () => {
      expect(isInstagramUrl("http://www.instagram.com/reel/DYYLTCLNs6J/")).toBe(true);
    });
  });

  describe("invalid Instagram URLs", () => {
    it("rejects a profile URL", () => {
      expect(isInstagramUrl("https://www.instagram.com/someuser/")).toBe(false);
    });

    it("rejects a YouTube URL", () => {
      expect(isInstagramUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(false);
    });

    it("rejects an empty string", () => {
      expect(isInstagramUrl("")).toBe(false);
    });

    it("rejects a plain Instagram domain with no path", () => {
      expect(isInstagramUrl("https://www.instagram.com/")).toBe(false);
    });

    it("rejects a local file path", () => {
      expect(isInstagramUrl("/Users/me/video.mp4")).toBe(false);
    });
  });
});
