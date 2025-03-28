const fs = require("fs");
const path = require("path");

const walk = (dir, fileList = []) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  });
  return fileList;
};

const rootDir = "./client/src";
const files = walk(rootDir);
const fixedFiles = files.filter((f) => f.endsWith("-fixed.tsx"));

console.log("🔍 Scanning for replacements...");
fixedFiles.forEach((fixed) => {
  const original = fixed.replace("-fixed", "");
  if (fs.existsSync(original)) {
    console.log(
      `🟡 Would replace:\n  Original: ${original}\n  Fixed:    ${fixed}\n`
    );
  } else {
    console.log(`🟢 Safe to rename (no original found): ${fixed}`);
  }
});
