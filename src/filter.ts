import { EntryBase } from "./model.ts";
import { minimatch } from "minimatch";

type FilterOpts = {
  include: string | string[];
  exclude?: string | string[];
};
export const createFileEntry = ({ include = [], exclude = [] }: FilterOpts) => {
  const includeList = Array.isArray(include) ? include : [include];
  const excludeList = Array.isArray(exclude) ? exclude : [exclude];
  return (entry: EntryBase) => {
    const isIncluded = includeList.some((pattern) => minimatch(entry.relative, pattern));
    const isExcluded = excludeList.some((pattern) => minimatch(entry.relative, pattern));
    return isIncluded && !isExcluded;
  };
};
