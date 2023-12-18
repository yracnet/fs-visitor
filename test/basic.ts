import { processVisitor, Entry } from "../src/main.ts";
import { createFileEntry } from "../src/filter.ts";
const test1 = () => {
  const result = processVisitor("test-dir", {
    filterEntry: (entry) => entry.type === "directory",
  })
    .map((it) => it.relative)
    .sort();
  console.log("Test 1", result);
};

const test2 = () => {
  const result = processVisitor("test-dir", {
    filterEntry: [
      (entry) => entry.type === "file",
      (entry) => /\.(css|scss)$/.test(entry.name),
    ],
  })
    .map((it) => it.relative)
    .sort();
  console.log("Test 2", result);
};

const test3 = () => {
  const result = processVisitor("test-dir", {
    filterEntry: [
      (entry) => entry.type === "directory",
      (entry) => /\.(ts|js)$/.test(entry.name),
    ],
  })
    .map((it) => it.relative)
    .sort();
  console.log("Test 3", result);
};

const test4 = () => {
  const result = processVisitor("test-dir", {
    filterEntry: [(entry) => entry.name.startsWith("prefix")],
    relativePrefix: "virtual:/",
  })
    .map((it) => it.relative)
    .sort();
  console.log("Test 4", result);
};

const test5 = () => {
  const result = processVisitor("test-dir", {
    relativePrefix: "virtual:/",
    filterEntry: createFileEntry({
      include: "**/*File.css",
      exclude: ["**/*2*/*", "**/*a/*"],
    }),
  })
    .map((it) => it.relative)
    .sort();
  console.log("Test 5", result);
};

const test6 = () => {
  const result = processVisitor("test-dir", {
    relativePrefix: "virtual:/",
    filterEntry: createFileEntry({
      include: "**/dir1/**/*.css",
    }),
  })
    .map((it) => {
      return {
        relative: it.relative,
        content: it.readFileSync("utf-8"),
      };
    })
    .sort();
  console.log("Test 6", result);
};

test1();
test2();
test3();
test4();
test5();
test6();
