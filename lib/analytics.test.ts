import { describe, it, expect, vi, beforeEach } from "vitest";
import { page_view, type PageViewEvent } from "./analytics";

describe("analytics", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockReturnValue(undefined);
  });

  it("deve aceitar page_view com segment válido", () => {
    const event: PageViewEvent = {
      segment: "pizzaria",
      url: "/landing/pizzaria",
    };

    page_view(event);

    expect(console.log).toHaveBeenCalledWith(
      "[Analytics] Page View:",
      JSON.stringify({
        segment: "pizzaria",
        url: "/landing/pizzaria",
        timestamp: expect.any(Number),
      })
    );
  });

  it("deve incluir timestamp automaticamente", () => {
    const before = Date.now();
    const event: PageViewEvent = {
      segment: "hamburgueria",
      url: "/landing/hamburgueria",
    };

    page_view(event);

    const after = Date.now();
    // Access mock calls via vi.mockResults
    const mockCalls = (console.log as unknown as { mock: { calls: Array<[string, string]> } }).mock?.calls;
    expect(mockCalls).toBeDefined();
    const calledArg = JSON.parse(mockCalls![0][1] as string);

    expect(calledArg.timestamp).toBeDefined();
    expect(calledArg.timestamp).toBeGreaterThanOrEqual(before);
    expect(calledArg.timestamp).toBeLessThanOrEqual(after);
  });

  it("deve usar timestamp fornecido quando existente", () => {
    const fixedTimestamp = 1713300000000;
    const event: PageViewEvent = {
      segment: "restaurante",
      url: "/landing/restaurante",
      timestamp: fixedTimestamp,
    };

    page_view(event);

    const mockCalls = (console.log as unknown as { mock: { calls: Array<[string, string]> } }).mock?.calls;
    expect(mockCalls).toBeDefined();
    const calledArg = JSON.parse(mockCalls![0][1] as string);

    expect(calledArg.timestamp).toBe(fixedTimestamp);
  });
});
