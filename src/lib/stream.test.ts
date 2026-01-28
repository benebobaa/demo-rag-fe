import { describe, expect, it } from "vitest";
import { createSseParser } from "./stream";

describe("createSseParser", () => {
    it("parses events across chunk boundaries", () => {
        const parser = createSseParser();
        const first = parser.push("event: status\ndata: {\"seq\":1");
        expect(first).toEqual([]);

        const second = parser.push("}\n\n");
        expect(second).toEqual([
            { event: "status", data: { seq: 1 } },
        ]);
    });

    it("handles multi-line data fields", () => {
        const parser = createSseParser();
        const events = parser.push(
            "event: trace\n" +
            "data: {\"step\":\"Action\"}\n" +
            "data: {\"tool\":\"SearchDocuments\"}\n\n"
        );

        expect(events).toEqual([
            {
                event: "trace",
                data: "{\"step\":\"Action\"}\n{\"tool\":\"SearchDocuments\"}",
            },
        ]);
    });

    it("tolerates CRLF line endings", () => {
        const parser = createSseParser();
        const events = parser.push(
            "event: ping\r\n" +
            "data: {\"seq\":2}\r\n\r\n"
        );

        expect(events).toEqual([
            { event: "ping", data: { seq: 2 } },
        ]);
    });
});
