// folder-structure.js
const fs = require("fs");
const path = require("path");

function getFolderStructure(dir, depth = 0) {
  const items = fs.readdirSync(dir);
  let result = "";

  for (const item of items) {
    if (item === "node_modules" || item.startsWith(".")) continue;

    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    result += `${" ".repeat(depth * 2)}- ${item}\n`;

    if (stats.isDirectory()) {
      result += getFolderStructure(fullPath, depth + 1);
    }
  }

  return result;
}

const projectRoot = process.cwd(); // current working directory
console.log(getFolderStructure(projectRoot));
