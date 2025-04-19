const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  componentsDir: path.join(__dirname, 'frontend', 'components'),
  backupDir: path.join(__dirname, 'backup'),
  dryRun: true, // Set to true to only show changes without applying them
};

// Create backup directory if it doesn't exist
if (!fs.existsSync(CONFIG.backupDir)) {
  fs.mkdirSync(CONFIG.backupDir, { recursive: true });
}

// Regular expressions for optimization patterns
const PATTERNS = {
  // Find inline styles
  inlineStyles: /style\s*=\s*\{\s*\{([^}]*)\}\s*\}/g,
  
  // Find Image imports to update to expo-image
  reactNativeImage: /import\s+{[^}]*Image[^}]*}\s+from\s+['"]react-native['"]/g,
  expoImageImport: /import\s+{\s*Image\s*}\s+from\s+['"]expo-image['"]/g,
  
  // Find components that don't use memo
  missingMemo: /export\s+default\s+(\w+);/g,
  
  // Find React imports to add memo
  reactImport: /import\s+React(?:,\s*{([^}]*)})?\s+from\s+['"]react['"]/g,
  
  // Find components without TypeScript interfaces
  functionComponent: /const\s+(\w+)\s*=\s*\(\s*\{([^}]*)\}\s*\)\s*=>/g,
  
  // Find components that should be React.FC
  missingReactFC: /const\s+(\w+)\s*=\s*\(\s*\{([^}]*)\}\s*\)\s*=>/g,
  
  // Find theme-based color styles
  themeColors: /style\s*=\s*\{\s*\{\s*(?:color|backgroundColor):\s*theme\.colors\.(\w+)\s*\}\s*\}/g,
  
  // Find Image component without proper props
  imageWithoutProps: /<Image[^>]*source=\{([^}]*)\}[^>]*>/g,
};

/**
 * Find all .tsx files in the specified directory and subdirectories
 */
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findTsxFiles(filePath, fileList);
    } else if (path.extname(file) === '.tsx') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Convert inline styles to Tailwind classes where possible
 */
function convertInlineStyles(content) {
  const commonMappings = {
    'backgroundColor': 'bg',
    'color': 'text',
    'marginBottom': 'mb',
    'marginTop': 'mt',
    'marginLeft': 'ml',
    'marginRight': 'mr',
    'paddingBottom': 'pb',
    'paddingTop': 'pt',
    'paddingLeft': 'pl',
    'paddingRight': 'pr',
    'fontSize': 'text',
    'fontWeight': 'font',
    'borderRadius': 'rounded',
    'width': 'w',
    'height': 'h',
  };
  
  // This is a simplified version - a complete implementation would require
  // parsing the style objects and generating appropriate Tailwind classes
  // Just identifies inline styles for now
  return content.replace(PATTERNS.inlineStyles, (match, styleContent) => {
    // For now, just log the styles we'd want to convert
    console.log('Inline style found:', styleContent.trim());
    return match; // Return unchanged for now
  });
}

/**
 * Convert theme-based colors to Tailwind
 */
function convertThemeColors(content) {
  // Map theme.colors properties to Tailwind classes
  const colorMappings = {
    'primary': 'text-primary',
    'secondary': 'text-secondary',
    'background': 'text-background',
    'textPrimary': 'text-textPrimary',
    'textSecondary': 'text-textSecondary',
    'textMuted': 'text-textMuted',
    'accent': 'text-accent',
  };
  
  const backgroundMappings = {
    'primary': 'bg-primary',
    'secondary': 'bg-secondary',
    'background': 'bg-background',
    'textPrimary': 'bg-textPrimary',
    'textSecondary': 'bg-textSecondary',
    'textMuted': 'bg-textMuted',
    'accent': 'bg-accent',
  };
  
  // Convert text colors
  content = content.replace(
    /style\s*=\s*\{\s*\{\s*color:\s*theme\.colors\.(\w+)\s*\}\s*\}/g,
    (match, colorName) => {
      if (colorMappings[colorName]) {
        return `className="${colorMappings[colorName]}"`;
      }
      return match;
    }
  );
  
  // Convert background colors
  content = content.replace(
    /style\s*=\s*\{\s*\{\s*backgroundColor:\s*theme\.colors\.(\w+)\s*\}\s*\}/g,
    (match, colorName) => {
      if (backgroundMappings[colorName]) {
        return `className="${backgroundMappings[colorName]}"`;
      }
      return match;
    }
  );
  
  // Look for className and style combined and merge them
  content = content.replace(
    /className\s*=\s*"([^"]*)"\s*style\s*=\s*\{\s*\{\s*(?:color|backgroundColor):\s*theme\.colors\.(\w+)\s*\}\s*\}/g,
    (match, existingClasses, colorName) => {
      const isBackgroundColor = match.includes('backgroundColor');
      const newClass = isBackgroundColor ? 
        backgroundMappings[colorName] : 
        colorMappings[colorName];
      
      if (newClass) {
        return `className="${existingClasses} ${newClass}"`;
      }
      return match;
    }
  );
  
  return content;
}

/**
 * Add Expo Image imports where appropriate
 */
function addExpoImageImports(content) {
  if (PATTERNS.reactNativeImage.test(content) && !PATTERNS.expoImageImport.test(content)) {
    // Add expo-image import
    content = content.replace(
      PATTERNS.reactNativeImage,
      (match) => {
        if (match.includes('Image')) {
          const newImport = match.replace('Image,', '').replace(', Image', '');
          return `${newImport}\nimport { Image } from 'expo-image'`;
        }
        return match;
      }
    );
  }
  return content;
}

/**
 * Add alt, transition, and placeholder to Image components
 */
function enhanceImageProps(content) {
  return content.replace(
    PATTERNS.imageWithoutProps,
    (match, source) => {
      // Don't add these props if they already exist
      const hasAlt = match.includes('alt=');
      const hasTransition = match.includes('transition=');
      const hasPlaceholder = match.includes('placeholder=');
      
      // Start with the original match
      let result = match;
      
      // Extract the variable name or string literal from the source
      let altText = '';
      if (source.includes('require')) {
        // For require statements, try to extract the filename
        const requireMatch = source.match(/require\(['"]([^'"]*)['"]\)/);
        if (requireMatch) {
          const path = requireMatch[1];
          const fileName = path.split('/').pop().split('.')[0];
          altText = fileName.replace(/[-_]/g, ' ');
        }
      } else {
        // For variables, use the variable name
        altText = source.trim();
      }
      
      // Add the props that are missing
      if (!hasAlt && altText) {
        result = result.replace(/(?=\s*\/?>)/, ` alt="${altText}"`);
      }
      
      if (!hasTransition) {
        result = result.replace(/(?=\s*\/?>)/, ` transition={300}`);
      }
      
      if (!hasPlaceholder && content.includes('blurhash')) {
        result = result.replace(/(?=\s*\/?>)/, ` placeholder={{ blurhash }}`);
      }
      
      return result;
    }
  );
}

/**
 * Add React.memo for components that don't use it
 */
function addReactMemo(content) {
  // First ensure memo is imported
  if (PATTERNS.missingMemo.test(content)) {
    content = content.replace(
      PATTERNS.reactImport,
      (match, imports) => {
        if (!imports) {
          return match.replace('import React', 'import React, { memo }');
        } else if (!imports.includes('memo')) {
          return match.replace('{', '{ memo, ');
        }
        return match;
      }
    );
    
    // Then add memo to the default export
    content = content.replace(
      PATTERNS.missingMemo,
      (match, componentName) => {
        return `export default memo(${componentName});`;
      }
    );
  }
  return content;
}

/**
 * Add TypeScript React.FC typing to component functions
 */
function addTypeScriptFC(content) {
  return content.replace(
    PATTERNS.missingReactFC,
    (match, componentName, props) => {
      const interfaceName = `${componentName}Props`;
      const hasPropsInterface = content.includes(`interface ${interfaceName}`);
      
      if (!hasPropsInterface) {
        // Generate a basic interface based on props
        const propsArray = props.split(',').map(p => p.trim());
        const propsTyped = propsArray.map(p => {
          if (p.includes(':')) return p; // Already typed
          return `${p}: any`;
        });
        
        const interfaceStr = `\ninterface ${interfaceName} {\n  ${propsTyped.join(';\n  ')};\n}\n`;
        
        // Insert the interface before the component
        const componentDeclaration = `const ${componentName}: React.FC<${interfaceName}> = ({ ${props} }) =>`;
        
        // We need to insert the interface before the component
        const parts = content.split(match);
        return parts[0] + interfaceStr + componentDeclaration + parts[1];
      }
      
      // If interface exists, just add the FC typing
      return match.replace(
        `const ${componentName} = `,
        `const ${componentName}: React.FC<${interfaceName}> = `
      );
    }
  );
}

/**
 * Apply all optimizations to a file
 */
function optimizeFile(filePath) {
  console.log(`\nOptimizing: ${filePath}`);
  
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Create a backup
  const relativePath = path.relative(__dirname, filePath);
  const backupPath = path.join(CONFIG.backupDir, relativePath);
  const backupDir = path.dirname(backupPath);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  fs.writeFileSync(backupPath, content);
  
  // Apply optimizations
  content = convertInlineStyles(content);
  content = convertThemeColors(content);
  content = addExpoImageImports(content);
  content = enhanceImageProps(content);
  content = addReactMemo(content);
  content = addTypeScriptFC(content);
  
  // Write back if changed and not in dry run mode
  if (content !== originalContent && !CONFIG.dryRun) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Optimized: ${filePath}`);
  } else if (content !== originalContent) {
    console.log(`🔍 Would optimize: ${filePath} (dry run)`);
  } else {
    console.log(`✓ No changes needed: ${filePath}`);
  }
  
  return content !== originalContent;
}

/**
 * Main function to run the optimization process
 */
function main() {
  console.log('🚀 Starting component optimization process');
  console.log(`📁 Components directory: ${CONFIG.componentsDir}`);
  console.log(`💾 Backup directory: ${CONFIG.backupDir}`);
  console.log(`🔍 Dry run: ${CONFIG.dryRun ? 'Yes' : 'No'}`);
  
  // Find all .tsx files
  const files = findTsxFiles(CONFIG.componentsDir);
  console.log(`\nFound ${files.length} .tsx files to process`);
  
  // Apply optimizations
  let optimizedCount = 0;
  
  files.forEach(file => {
    const wasOptimized = optimizeFile(file);
    if (wasOptimized) optimizedCount++;
  });
  
  console.log(`\n✨ Optimization complete!`);
  console.log(`📊 Stats: ${optimizedCount} files optimized out of ${files.length} total`);
}

// Run the script
main(); 