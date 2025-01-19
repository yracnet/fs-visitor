import fs from "fs";
import { AppendFileSync, EntryBase, ReadFileSync, WriteFileSync } from "./model.ts";

export const createErrorDirectory = (name: string) => () => {
  throw new Error(`Entry: ${name} is a directory`);
};
export const createReadFileSync = ({ type, name, absolute }: EntryBase): ReadFileSync => {
  return type === "file" ? (opts) => fs.readFileSync(absolute, opts) : createErrorDirectory(name);
};
export const createWriteFileSync = ({ type, name, absolute }: EntryBase): WriteFileSync => {
  return type === "file" ? (data, opts = {}) => fs.writeFileSync(absolute, data, opts) : createErrorDirectory(name);
};
export const createAppendFileSync = ({ type, name, absolute }: EntryBase): AppendFileSync => {
  return type === "file" ? (data, opts = {}) => fs.writeFileSync(absolute, data, opts) : createErrorDirectory(name);
};
