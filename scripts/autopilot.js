import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables for Gemini API key
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// List of target directories/files to consider for improvement
const TARGET_PATHS = [
  path.join(SRC_DIR, 'components'),
  path.join(SRC_DIR, 'utils'),
  path.join(SRC_DIR, 'App.tsx'),
  path.join(ROOT_DIR, 'api', 'server.js')
];

/**
 * Main Autopilot function that analyzes a random file, suggests improvements, and tests them.
 */
async function runAutopilot() {
  console.log('🤖 [Autopilot] Waking up. Starting self-improvement cycle...');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ [Autopilot] GEMINI_API_KEY is not configured. Aborting.');
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Using gemini-2.5-flash as it is fast and excellent at coding tasks
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // 1. Gather all viable files
  const filesToAnalyze = [];
  const walkSync = (dir, filelist = []) => {
    if (!fs.existsSync(dir)) return filelist;
    const stat = fs.statSync(dir);
    if (stat.isFile()) {
      if (dir.endsWith('.js') || dir.endsWith('.jsx') || dir.endsWith('.ts') || dir.endsWith('.tsx')) {
         filelist.push(dir);
      }
    } else if (stat.isDirectory()) {
       fs.readdirSync(dir).forEach(file => {
          walkSync(path.join(dir, file), filelist);
       });
    }
    return filelist;
  };

  TARGET_PATHS.forEach(target => {
    walkSync(target, filesToAnalyze);
  });

  if (filesToAnalyze.length === 0) {
    console.log('🤖 [Autopilot] No suitable files found for improvement.');
    return;
  }

  // 2. Pick a random file to try and improve
  const targetFile = filesToAnalyze[Math.floor(Math.random() * filesToAnalyze.length)];
  console.log(`🤖 [Autopilot] Selected file for review: ${path.relative(ROOT_DIR, targetFile)}`);

  const originalContent = fs.readFileSync(targetFile, 'utf8');

  // 3. Ask AI for improvements
  const prompt = `You are an expert, autonomous senior software engineer.
You are running as a background "autopilot" agent that constantly improves a React/Node.js codebase.

Your task is to analyze the following code file and provide an improved, fully complete version of it.
Look for:
- Performance improvements (caching, memoization, lazy loading)
- Code cleanup (removing dead code, better variable names, modern JS/TS syntax)
- Better error handling
- SEO or accessibility improvements (if it's a UI component)
- Logic bugs

CRITICAL RULES:
1. Do not break existing functionality.
2. Return ONLY the improved raw code. No markdown code blocks, no explanations, no \`\`\`tsx tags. JUST THE CODE.
3. If the code is already perfect and you have no improvements, output the exact string: "NO_IMPROVEMENT_NEEDED".
4. Make sure imports remain correct.

File Path: ${path.relative(ROOT_DIR, targetFile)}
Original Code:
${originalContent}
`;

  console.log('🤖 [Autopilot] Analyzing code with Gemini...');
  let improvedCode = '';
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    improvedCode = response.text().trim();
  } catch (err) {
    console.error('❌ [Autopilot] Failed to generate improvements from Gemini:', err.message);
    return;
  }

  // Handle case where AI removed markdown wrapping despite instructions
  improvedCode = improvedCode.replace(/^```[a-z]*\n/gi, '').replace(/```$/g, '').trim();

  if (improvedCode === 'NO_IMPROVEMENT_NEEDED' || improvedCode === originalContent) {
    console.log('🤖 [Autopilot] Code is already optimal. No changes made today.');
    return;
  }

  if (improvedCode.length < 50) {
     console.warn('🤖 [Autopilot] AI returned suspiciously short code. Aborting to be safe.');
     return;
  }

  console.log('🤖 [Autopilot] Improvements generated. Applying and verifying...');

  // 4. Backup the original file
  const backupPath = `${targetFile}.backup-${Date.now()}`;
  fs.writeFileSync(backupPath, originalContent, 'utf8');

  // 5. Apply changes
  fs.writeFileSync(targetFile, improvedCode, 'utf8');

  // 6. Verify the application isn't broken
  let verificationPassed = false;
  try {
    // Run TS type checking (if applicable) and Vite build to ensure no syntax/compilation errors
    console.log('🤖 [Autopilot] Running build verification (tsc & vite build)...');
    execSync('npm run lint && npm run build', { cwd: ROOT_DIR, stdio: 'ignore' });
    verificationPassed = true;
    console.log('✅ [Autopilot] Verification PASSED. Improvements successfully applied!');
  } catch (err) {
    console.error('❌ [Autopilot] Verification FAILED (Build or Lint error). Rolling back changes.');
  }

  // 7. Cleanup or Rollback
  if (verificationPassed) {
    // Delete backup if successful
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
    // Optionally log to an audit file
    const logMsg = `[${new Date().toISOString()}] Successfully improved ${path.relative(ROOT_DIR, targetFile)}\n`;
    fs.appendFileSync(path.join(ROOT_DIR, 'autopilot-audit.log'), logMsg);
  } else {
    // Restore backup
    if (fs.existsSync(backupPath)) {
       fs.writeFileSync(targetFile, originalContent, 'utf8');
       fs.unlinkSync(backupPath);
    }
  }

  console.log('🤖 [Autopilot] Cycle complete. Going back to sleep.');
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAutopilot();
}

export { runAutopilot };
