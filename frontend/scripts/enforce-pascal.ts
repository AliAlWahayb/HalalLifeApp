import * as fs from "fs";
import * as path from "path";

// Define the directory where components are stored
const componentsDir = path.join(__dirname, "../src/components");

// Function to check PascalCase naming
const isPascalCase = (name: string): boolean => /^[A-Z][a-zA-Z]+$/.test(name);

// Read component directory
fs.readdir(componentsDir, (err, files) => {
  if (err) {
    console.error("Error reading components directory:", err);
    process.exit(1);
  }

  const errors: string[] = [];

  files.forEach((file) => {
    if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      const componentName = file.replace(/\.[^/.]+$/, "");
      if (!isPascalCase(componentName)) {
        errors.push(`❌ Component "${file}" is not in PascalCase.`);
      }
    }
  });

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  } else {
    console.log("✅ All component files are in PascalCase.");
  }
});
