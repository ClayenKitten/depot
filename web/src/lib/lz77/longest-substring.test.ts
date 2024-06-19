import { expect, test } from "vitest";
import longestSubstring from "./longest-substring";

test("ascii", () => {
    const s1 = Buffer.from("hello world", "ascii");
    const s2 = Buffer.from("hell!!", "ascii");
    const { match, position } = longestSubstring(s1, s2);
    expect(match.toString("ascii")).toBe("hell");
    expect(position).toBe(0);
});

test("utf8", () => {
    const s1 = Buffer.from("Я вас приветствую", "utf8");
    const s2 = Buffer.from("привет!", "utf8");
    const { match, position } = longestSubstring(s1, s2);
    expect(match.toString("utf8")).toBe("привет");
});

test("binary", () => {
    const s1 = Buffer.from([0, 0, 1, 245, 245, 10, 10]);
    const s2 = Buffer.from([245, 10, 10, 245]);
    const { match, position } = longestSubstring(s1, s2);
    expect(match).toEqual(Buffer.from([245, 10, 10]));
    expect(position).toBe(4);
});
