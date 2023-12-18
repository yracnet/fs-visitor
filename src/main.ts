import fs, { ObjectEncodingOptions, WriteFileOptions } from "fs";
import path from "path";

export type ReadFileOptions =
  | null
  | BufferEncoding
  | {
      encoding?: null | undefined;
      flag?: string | undefined;
    }
  | {
      encoding: BufferEncoding;
      flag?: string | undefined;
    };
export type Entry = {
  type: "directory" | "file" | string;
  name: string;
  absolute: string;
  relative: string;
  readFileSync: (options?: ReadFileOptions) => string | Buffer;
  writeFileSync: (
    data: string | NodeJS.ArrayBufferView,
    options?: WriteFileOptions
  ) => void;
  appendFileSync: (
    data: string | Uint8Array,
    options?: WriteFileOptions
  ) => void;
};

export type FilterEntry = (entry: Entry) => boolean;

export type Options = {
  deep?: number;
  filterEntry?: FilterEntry | FilterEntry[];
  withDirectory?: boolean;
  sorter?: (a: Entry, b: Entry) => number;
  relativePrefix?: string;
  useSlash?: boolean;
};

export const processVisitor = (
  directory: string,
  options: Options = {}
): Entry[] => {
  const {
    deep = Infinity,
    relativePrefix = "",
    useSlash = true,
    withDirectory = false,
    filterEntry = [],
    sorter,
  } = options;

  const filterEntryArray = Array.isArray(filterEntry)
    ? filterEntry
    : [filterEntry];

  const result: Entry[] = [];

  const entryErrorDirectory = (name: string) => () => {
    throw new Error(`Entry: ${name} is a directory`);
  };

  const processDirectory = (parent: Entry, currentDeep: number) => {
    if (deep <= currentDeep) {
      return;
    }

    fs.readdirSync(parent.absolute, { withFileTypes: true })
      .map<Entry>((entry) => {
        const type = entry.isDirectory()
          ? "directory"
          : entry.isFile()
          ? "file"
          : "";
        const absolute = path.join(parent.absolute, entry.name);
        const relative = path.join(parent.relative, entry.name);
        const errorDirectory = entryErrorDirectory(entry.name);
        return {
          type,
          name: entry.name,
          absolute,
          relative,
          readFileSync:
            type === "file"
              ? (opts) => fs.readFileSync(absolute, opts)
              : errorDirectory,
          writeFileSync:
            type === "file"
              ? (data, opts = {}) => fs.writeFileSync(absolute, data, opts)
              : errorDirectory,
          appendFileSync:
            type === "file"
              ? (data, opts = {}) => fs.writeFileSync(absolute, data, opts)
              : errorDirectory,
        };
      })
      .map((current) => {
        if (useSlash) {
          current.absolute = current.absolute.replace(/\\/g, "/");
          current.relative = current.relative.replace(/\\/g, "/");
        }
        return current;
      })
      .filter(
        (current) =>
          current.type === "directory" ||
          filterEntryArray.length === 0 ||
          filterEntryArray.some((callbak) => callbak(current))
      )
      .forEach((current) => {
        if (current.type === "directory") {
          if (withDirectory) {
            result.push(current);
          }
          processDirectory(current, currentDeep + 1);
        } else if (current.type === "file") {
          result.push(current);
        }
      });
  };

  const errorDirectory = entryErrorDirectory("root");

  const root: Entry = {
    name: "",
    type: "directory",
    absolute: path.resolve(directory),
    relative: relativePrefix,
    appendFileSync: errorDirectory,
    writeFileSync: errorDirectory,
    readFileSync: errorDirectory,
  };

  processDirectory(root, 0);

  if (sorter) {
    return result.sort(sorter);
  }
  return result;
};

export default processVisitor;
