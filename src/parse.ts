import { Entry } from "./main";

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
