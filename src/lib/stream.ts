export interface SseEvent<T = unknown> {
    event: string;
    data: T;
}

interface StreamOptions {
    endpoint: string;
    body?: unknown;
    signal?: AbortSignal;
    onEvent: (event: SseEvent) => void;
}

export function createSseParser() {
    let buffer = "";

    const normalize = (input: string) => input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    const parseEvent = (raw: string): SseEvent | null => {
        const lines = raw.split("\n");
        let event = "message";
        const dataLines: string[] = [];

        for (const line of lines) {
            if (line.startsWith("event:")) {
                event = line.slice(6).trim() || event;
            } else if (line.startsWith("data:")) {
                dataLines.push(line.slice(5).trimStart());
            }
        }

        if (dataLines.length === 0) {
            return null;
        }

        const dataString = dataLines.join("\n");
        let data: unknown = dataString;
        try {
            data = JSON.parse(dataString);
        } catch {
            // Leave as string when JSON parsing fails.
        }

        return { event, data };
    };

    const push = (chunk: string): SseEvent[] => {
        buffer += normalize(chunk);
        const events: SseEvent[] = [];

        while (true) {
            const boundaryIndex = buffer.indexOf("\n\n");
            if (boundaryIndex === -1) {
                break;
            }

            const rawEvent = buffer.slice(0, boundaryIndex);
            buffer = buffer.slice(boundaryIndex + 2);

            const parsed = parseEvent(rawEvent);
            if (parsed) {
                events.push(parsed);
            }
        }

        return events;
    };

    return { push };
}

export async function streamSse({ endpoint, body, signal, onEvent }: StreamOptions) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
        signal,
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(errorText || `Stream error: ${response.status}`);
    }

    if (!response.body) {
        throw new Error("Streaming not supported by the browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const parser = createSseParser();

    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const events = parser.push(chunk);
            for (const event of events) {
                onEvent(event);
            }
        }
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            return;
        }
        throw error;
    } finally {
        reader.releaseLock();
    }
}
