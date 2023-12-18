import { Entry } from "./main";
import { minimatch } from "minimatch";

type FileEntryOpts = {
  include: string | string[];
  exclude?: string | string[];
};
export const createFileEntry = (opts: FileEntryOpts) => {
  const includeList = Array.isArray(opts.include)
    ? opts.include
    : [opts.include];
  const excludeList = Array.isArray(opts.exclude)
    ? opts.exclude
    : opts.exclude
    ? [opts.exclude]
    : [];
  return (entry: Entry) => {
    const included = includeList.some((pattern) =>
      minimatch(entry.relative, pattern)
    );
    const excluded = excludeList.some((pattern) =>
      minimatch(entry.relative, pattern)
    );
    return included && !excluded;
  };
};
