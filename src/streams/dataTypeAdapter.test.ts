import { assertEquals } from "https://deno.land/std@0.161.0/testing/asserts.ts";
import { DataTypeAdapter, stringToBytes } from "./dataTypeAdapter.ts";

Deno.test("Read Int16", async () => {
  const bytes = Uint8Array.from([0x1, 0x2]);
  const readable = new ReadableStream({
    start: (controller) => controller.enqueue(bytes),
  });
  const dataTypeAdapter = new DataTypeAdapter(readable);
  const value = await dataTypeAdapter.readInt16();
  assertEquals(256 + 2, value);
});

Deno.test("Read Int32", async () => {
  const bytes = Uint8Array.from([0x1, 0x2, 0xa, 0xb]);
  const readable = new ReadableStream({
    start: (controller) => controller.enqueue(bytes),
  });
  const dataTypeAdapter = new DataTypeAdapter(readable);
  const value = await dataTypeAdapter.readInt32();
  assertEquals(0x1 * 2 ** 24 + 0x2 * 2 ** 16 + 0xa * 2 ** 8 + 0xb, value);
});

Deno.test("Read String", async () => {
  const strValue = "foobar";
  const bytes = Uint8Array.from([...stringToBytes(strValue), 123]);
  const readable = new ReadableStream({
    start: (controller) => controller.enqueue(bytes),
  });
  const dataTypeAdapter = new DataTypeAdapter(readable);
  const value = await dataTypeAdapter.readString();
  assertEquals(value, strValue);
});
