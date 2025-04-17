const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to scan
const componentsDir = path.join(__dirname, 'frontend', 'components');

// Optimization patterns to look for
const optimizationNeeded = {
  inlineStyles: /style\s*=\s*\{\s*\{/g,
  reactNativeCommunity: /@react-native-community/g,
  missingMemo: /export default\s+\w+;(?!\s*\/\/\s*no-memo)/g,
  missingInterface: /const\s+(\w+)\s*:\s*React\.FC(?!\s*<\w+)/g,
  missingTypeScript: /const\s+(\w+)\s*=\s*\(\s*\{\s*([^}]*)\}\s*\)/g,
  useImage: /Image(?!\s+from\s+['"]expo-image)/g,
};

// Collect all .tsx files recursively
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

// Analyze a file for optimization opportunities
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for inline styles
  if (optimizationNeeded.inlineStyles.test(content)) {
    issues.push('Inline styles found - convert to Tailwind classes');
  }
  
  // Check for React Native Community packages
  if (optimizationNeeded.reactNativeCommunity.test(content)) {
    issues.push('React Native Community package imports - migrate to Expo equivalents');
  }
  
  // Check for components not using memo
  if (optimizationNeeded.missingMemo.test(content)) {
    issues.push('Component could benefit from React.memo()');
  }
  
  // Check for missing TypeScript interfaces
  if (optimizationNeeded.missingInterface.test(content)) {
    issues.push('Missing TypeScript interface for component props');
  }
  
  // Check for components missing proper TypeScript typing
  if (optimizationNeeded.missingTypeScript.test(content)) {
    issues.push('Missing TypeScript types for component');
  }

  // Check for non-Expo Image usage
  if (optimizationNeeded.useImage.test(content)) {
    issues.push('Consider upgrading to expo-image for better performance');
  }
  
  return {
    filePath: filePath.replace(__dirname, ''),
    issues
  };
}

// Main function to run analysis
function runAnalysis() {
  console.log('Starting component optimization analysis...');
  
  const files = findTsxFiles(componentsDir);
  console.log(`Found ${files.length} .tsx files to analyze`);
  
  const fileIssues = [];
  
  files.forEach(file => {
    const analysis = analyzeFile(file);
    if (analysis.issues.length > 0) {
      fileIssues.push(analysis);
    }
  });
  
  console.log('\nFiles needing optimization:');
  console.log('=========================');
  
  fileIssues.forEach(({ filePath, issues }) => {
    console.log(`\n${filePath}:`);
    issues.forEach(issue => console.log(`- ${issue}`));
  });
  
  console.log(`\n${fileIssues.length} files need optimization out of ${files.length} total .tsx files`);
}

// Run the analysis
runAnalysis(); 