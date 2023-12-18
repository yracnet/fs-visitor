import { processVisitor } from "../src/main.ts";
import { Entry } from "../src/types.ts";

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

export const parseFilePatter = (filePatter: string) => {
  filePatter = filePatter
    .replace("**/", "__R0__")
    .replace("*.", "__R1__")
    .replace("*", "__R2__")
    .replace(".", "__R3__")
    .replace("__R0__", "(.*\\/)?")
    .replace("__R1__", "[^.]+\\.")
    .replace("__R2__", "[^\\/]+")
    .replace("__R3__", "\\.");
  const regExpString = `^${filePatter}$`;
  const regExpRule = new RegExp(regExpString);
  return (entry: Entry) => {
    return regExpRule.test(entry.relative);
  };
};

const test5 = () => {
  const result = processVisitor("test-dir", {
    relativePrefix: "virtual:/",
    filterEntry: parseFilePatter("**/*File.css"),
  })
    .map((it) => it.relative)
    .sort();
  console.log("Test 5", result);
};

test1();
test2();
test3();
test4();
test5();
