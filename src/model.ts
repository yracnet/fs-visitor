import { WriteFileOptions } from "fs";

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

export type ReadFileSync = (options?: ReadFileOptions) => string | Buffer;

export type WriteFileSync = (data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions) => void;

export type AppendFileSync = (data: string | Uint8Array, options?: WriteFileOptions) => void;

export type EntryBase = {
  key: string;
  type: "directory" | "file" | string;
  name: string;
  level: number;
  absolute: string;
  relative: string;
  children: EntryBase[];
};

export type EntryFS = EntryBase & {
  readFileSync: ReadFileSync;
  writeFileSync: WriteFileSync;
  appendFileSync: AppendFileSync;
};

export type SorterEntry = (a: EntryBase, b: EntryBase) => number;

export type FilterEntry = (entry: EntryBase) => boolean;

export type CallbackEntry = (current: EntryFS, parent: EntryFS) => void;

export type Config = {
  cwd: string;
  deep: number;
  filterEntry: FilterEntry[];
  withDirectory: boolean;
  sorter: SorterEntry;
  relativePrefix: string;
  keyPrefix: string;
  useSlash: boolean;
  asTree: boolean;
};

export type Options = {
  cwd?: string;
  deep?: number;
  filterEntry?: FilterEntry | FilterEntry[];
  withDirectory?: boolean;
  sorter?: SorterEntry;
  relativePrefix?: string;
  keyPrefix?: string;
  useSlash?: boolean;
  asTree?: boolean;
};

export const assertConfig = ({
  cwd = process.cwd(),
  deep = Infinity,
  relativePrefix = "",
  keyPrefix = "R",
  useSlash = true,
  withDirectory = false,
  asTree = false,
  filterEntry = [],
  sorter = (a, b) => {
    return a.level > b.level ? -1 : a.level < b.level ? 1 : 0;
  },
}: Options = {}): Config => {
  const filterEntryArray = Array.isArray(filterEntry) ? filterEntry : [filterEntry];
  return {
    cwd,
    deep,
    relativePrefix,
    keyPrefix,
    useSlash,
    asTree,
    withDirectory,
    filterEntry: filterEntryArray,
    sorter,
  };
};
