import { describe, expect, it } from "vitest";
import { formatElapsed } from "./time";

describe("formatElapsed", () => {
    it("formats seconds under a minute", () => {
        expect(formatElapsed(0)).toBe("0:00");
        expect(formatElapsed(5000)).toBe("0:05");
        expect(formatElapsed(59000)).toBe("0:59");
    });

    it("formats minutes and seconds", () => {
        expect(formatElapsed(65000)).toBe("1:05");
        expect(formatElapsed(125000)).toBe("2:05");
    });
});
