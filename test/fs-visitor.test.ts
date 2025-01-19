import { describe, it, expect, beforeEach } from "vitest";
import { processVisitor } from "../src/index.ts";
import { createFileEntry } from "../src/filter.ts";
import { EntryBase } from "../src/model.ts";

describe("processVisitor Tests", () => {
  const baseDir = "test-dir";

  it("Test 1: Filter directories", () => {
    const result = processVisitor(baseDir, {
      filterEntry: (entry) => entry.type === "directory",
      withDirectory: true,
    })
      .map((it) => it.relative)
      .sort();
    expect(result.length).toBe(4);
    expect(result).toEqual(["dir1", "dir1/subdir1a", "dir2", "dir2/subdir2a"]);
  });

  it("Test 2: Filter files with specific extensions", () => {
    const result = processVisitor(baseDir, {
      filterEntry: [({ type, name }) => type === "file" && /\.(css|scss)$/.test(name)],
    })
      .map((it) => it.relative)
      .sort();
    expect(result.length).toBe(4);
    expect(result).toEqual([
      "dir1/prefixFile.css",
      "dir1/subdir1a/prefixFile.scss",
      "dir2/prefixFile.css",
      "dir2/subdir2a/prefixFile.scss",
    ]);
  });

  it("Test 3: Filter directories with specific extensions", () => {
    const result = processVisitor(baseDir, {
      withDirectory: true,
      useSlash: true,
      filterEntry: [({ relative }) => /subdir1a\/file\.js$/.test(relative)],
    })
      .map((it) => it.relative)
      .sort();
    expect(result.length).toBe(5);
    expect(result).toEqual(["dir1", "dir1/subdir1a", "dir1/subdir1a/file.js", "dir2", "dir2/subdir2a"]);
  });

  it("Test 4: Filter by name prefix and relativePrefix", () => {
    const result = processVisitor(baseDir, {
      filterEntry: [({ name }) => name.startsWith("prefix") && name.endsWith(".css")],
      relativePrefix: "virtual:/",
    })
      .map((it) => it.relative)
      .sort();
    expect(result.length).toBe(2);
    expect(result).toEqual(["virtual:/dir1/prefixFile.css", "virtual:/dir2/prefixFile.css"]);
  });

  it("Test 5: Filter by name prefix and relativePrefix", () => {
    const result = processVisitor(baseDir, {
      filterEntry: createFileEntry({
        include: "**/*.css",
        exclude: "**/dir2/**",
      }),
      relativePrefix: "virtual:/",
    })
      .map((it) => it.relative)
      .sort();

    expect(result.length).toBe(1);
    expect(result).toEqual(["virtual:/dir1/prefixFile.css"]);
  });

  it("Test 6: Tree Files", () => {
    const doItem = ({ name, relative, children = [] }: EntryBase) => {
      return {
        name,
        virtual: relative,
        children: children.map(doItem),
      };
    };

    const result = processVisitor(baseDir, {
      filterEntry: [({ name }) => name.startsWith("prefix") && name.endsWith(".css")],
      relativePrefix: "virtual:/",
      asTree: true,
      deep: 2,
    }).map(doItem);
    const resultData = [
      {
        name: "",
        virtual: "virtual:/",
        children: [
          {
            name: "dir1",
            virtual: "virtual:/dir1",
            children: [
              {
                name: "prefixFile.css",
                virtual: "virtual:/dir1/prefixFile.css",
                children: [],
              },
              {
                name: "subdir1a",
                virtual: "virtual:/dir1/subdir1a",
                children: [],
              },
            ],
          },
          {
            name: "dir2",
            virtual: "virtual:/dir2",
            children: [
              {
                name: "prefixFile.css",
                virtual: "virtual:/dir2/prefixFile.css",
                children: [],
              },
              {
                name: "subdir2a",
                virtual: "virtual:/dir2/subdir2a",
                children: [],
              },
            ],
          },
        ],
      },
    ];
    expect(result).toEqual(resultData);
  });
});
