# fs-visitor

`fs-visitor` is a Node.js library that provides a simple API to recursively list files and directories with various filtering and sorting options.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [`Entry`](#entry)
  - [`FilterEntry`](#filterentry)
  - [`Options`](#options)
  - [`processVisitor`](#processvisitor)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install fs-visitor
```

## Usage

```javascript
const { processVisitor } = require("fs-visitor");
// Example: List all files and directories in the current directory
const entries = processVisitor("./");
console.log(entries);
// Example: List only TypeScript files with a depth of 2
const tsFilter = (entry) => entry.type === "file" && entry.name.endsWith(".ts");
const options = { deep: 2, filterEntry: tsFilter };
const tsEntries = processVisitor("./src", options);
console.log(tsEntries);
```

## API

### `Entry`

```typescript
type Entry = {
  type: "directory" | "file" | string;
  name: string;
  absolute: string;
  relative: string;
};
```

Represents an entry (file or directory) returned by `processVisitor`.

### `FilterEntry`

```typescript
type FilterEntry = (entry: Entry) => boolean;
```

A function used for filtering entries based on custom criteria.

### `Options`

```typescript
type Options = {
  deep?: number;
  filterEntry?: FilterEntry | FilterEntry[];
  withDirectory?: boolean;
  sorter?: (a: Entry, b: Entry) => number;
  relativePrefix?: string;
  useSlash?: boolean;
};
```

Options to customize the behavior of `processVisitor`.

- `deep`: Maximum depth to scan.
- `filterEntry`: A single or an array of `FilterEntry` functions.
- `withDirectory`: Include directories in the result.
- `sorter`: Custom function to sort entries.
- `relativePrefix`: Prefix to add to relative paths.
- `useSlash`: Use forward slash `/` as a directory separator.

### `processVisitor`

```typescript
export const processVisitor = (
     directory: string,
  options: Options = {}
) => Entry[];
```

The main method that lists files and directories based on the provided options.

## Examples

### Example 1: List All Files and Directories

```javascript
import { processVisitor } from "fs-visitor";
const entries = processVisitor("./");
console.log(entries);
```

### Example 2: List TypeScript Files Only (Depth 2)

```javascript
import { processVisitor } from "fs-visitor";
const entries = processVisitor("./src", {
  deep: 2,
  filterEntry: (entry) => {
    return entry.type === "file" && entry.name.endsWith(".ts");
  },
});
console.log(entries);
```

### Example 3: Include and Exclude

This example use `minimatch` and expose a simple function `createFileEntry` in `filter` file

```javascript
import { processVisitor } from "fs-visitor";
import { createFileEntry } from "fs-visitor/filter";
const filterEntry = createFileEntry({
  include: "**/*.ts",
  exclude: ["**/Config*", "**/Defined*"],
});
const entries = processVisitor("./src/widget", { filterEntry });
console.log(entries);
```

Feel free to contribute to this project, report issues, or suggest improvements. Your feedback is highly appreciated.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
