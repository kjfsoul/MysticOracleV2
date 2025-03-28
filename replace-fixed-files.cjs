const fs = require("fs");
const path = require("path");

const filePairs = [
  {
    original: "client/src/components/layout/navbar.tsx",
    fixed: "client/src/components/layout/navbar-fixed.tsx",
  },
  {
    original: "client/src/components/ui/auth-form.tsx",
    fixed: "client/src/components/ui/auth-form-fixed.tsx",
  },
  {
    original: "client/src/hooks/use-auth.tsx",
    fixed: "client/src/hooks/use-auth-fixed.tsx",
  },
];

const backupDir = "backup-originals";

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log("🔁 Replacing original files with fixed versions...");
for (const { original, fixed } of filePairs) {
  if (fs.existsSync(fixed)) {
    // Backup original
    if (fs.existsSync(original)) {
      const backupPath = path.join(backupDir, path.basename(original));
      fs.renameSync(original, backupPath);
      console.log(`🗃️  Backed up: ${original} -> ${backupPath}`);
    }

    // Rename fixed to original
    fs.renameSync(fixed, original);
    console.log(`✅ Replaced: ${fixed} -> ${original}`);
  } else {
    console.warn(`⚠️ Fixed file not found: ${fixed}`);
  }
}

// Fix import statements
console.log("\n🔎 Updating imports...");
const walkAndReplaceImports = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndReplaceImports(fullPath);
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      let replaced = content.replace(/(-fixed)(['"])/g, "$2");
      if (content !== replaced) {
        fs.writeFileSync(fullPath, replaced);
        console.log(`📝 Updated imports in: ${fullPath}`);
      }
    }
  }
};

walkAndReplaceImports("client/src");

console.log("\n🎉 All replacements and updates complete!");
