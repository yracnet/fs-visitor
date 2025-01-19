import fs from "fs";
import path from "path";
import { assertConfig, Config, EntryFS, EntryBase, Options, EntryCallback } from "./model.ts";
import { createAppendFileSync, createErrorDirectory, createReadFileSync, createWriteFileSync } from "./utils.ts";

const processEntries = (parent: EntryFS, config: Config, entryCallback: EntryCallback) => {
  const nextLevel = parent.level + 1;
  if (nextLevel > config.deep) {
    return;
  }
  fs.readdirSync(parent.absolute, { withFileTypes: true })
    .map<EntryBase>((entry) => {
      const name = entry.name;
      const type = entry.isDirectory() ? "directory" : entry.isFile() ? "file" : "";
      const absolute = path.join(parent.absolute, name);
      const relative = path.join(parent.relative, name);
      return {
        level: nextLevel,
        type,
        name,
        absolute,
        relative,
        children: [],
      };
    })
    .map((current) => {
      if (config.useSlash) {
        current.absolute = current.absolute.replace(/\\/g, "/");
        current.relative = current.relative.replace(/\\/g, "/");
      }
      return current;
    })
    .filter((current) => {
      return (
        current.type === "directory" ||
        config.filterEntry.length === 0 ||
        config.filterEntry.some((filterCallback) => filterCallback(current))
      );
    })
    .map<EntryFS>((currentBase) => {
      return {
        ...currentBase,
        readFileSync: createReadFileSync(currentBase),
        writeFileSync: createWriteFileSync(currentBase),
        appendFileSync: createAppendFileSync(currentBase),
      };
    })
    .forEach((current) => {
      if (current.type === "directory") {
        if (config.withDirectory || config.asTree) {
          entryCallback(current, parent);
        }
        processEntries(current, config, entryCallback);
      } else if (current.type === "file") {
        entryCallback(current, parent);
      }
    });
};

export const processVisitor = (directory: string, opts: Options = {}): EntryFS[] => {
  const config = assertConfig(opts);
  const result: EntryFS[] = [];
  const errorRoot = createErrorDirectory("root");
  const root: EntryFS = {
    level: 0,
    name: "",
    type: "directory",
    absolute: path.join(config.cwd, directory),
    relative: config.relativePrefix,
    children: [],
    appendFileSync: errorRoot,
    writeFileSync: errorRoot,
    readFileSync: errorRoot,
  };
  processEntries(root, config, (current, parent) => {
    if (config.asTree) {
      parent.children.push(current);
    } else {
      result.push(current);
    }
  });
  return config.asTree ? [root] : result.sort(config.sorter);
};

export default processVisitor;
