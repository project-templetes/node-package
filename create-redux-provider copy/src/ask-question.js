import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import { Blue, Error, Green, Reset } from "./colors";
export const askQuestion = async (cwd) => {
  const dir = await handleDirPrompt(cwd, cwd);
  const [baseDir, statesDir] = await handleDirNamePrompt(dir);
  const framework = await handleFrameworkPrompt();
  const typescript = await handleTypescriptPrompt();
  console.log('\x1b[32m->\x1b[0m \x1b[34m', baseDir, Reset);
  console.log('\x1b[32m->\x1b[0m \x1b[34m', framework, typescript ? 'TS' : 'JS', Reset);
  return {
    baseDir,
    statesDir,
    framework,
    typescript,
  }
};
async function handleDirPrompt(cwd, dir) {
  const ans = await inquirer.prompt([
    {
      type: "input",
      name: "baseDir",
      message: "Where do you want to create the redux-provider?",
      default: dir.split(path.sep).pop(),
    },
  ]);

  // if ans.dir is equal to detault value, then it means the user wants to create the redux-provider in the current directory. So we return the current directory

  if (ans.baseDir !== dir.split(path.sep).pop()) {
    if (path.isAbsolute(ans.baseDir)) { // Check if the provided path is absolute
      dir = ans.baseDir;
    } else {
      dir = path.join(dir, ans.baseDir);
    }
  } 

  const exists = fs.existsSync(dir);
  if (!exists) {
    console.log(Error, `Directory ${dir} does not exist`);
    dir = path.join(dir, "..");
    console.log(Green, dir);
    const dirs = fs.readdirSync(dir).filter((file) => (!file.startsWith(".") && fs.statSync(path.join(dir, file)).isDirectory()));
    console.log("Available folders in the directory: ");
    dirs.forEach((dir) => {
      console.log(Blue, dir);
    });
    return handleDirPrompt(cwd, dir);
  }

  const confirm = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Is this the correct directory? ${dir}`,
      default: true,
    },
  ]);

  if (!confirm.confirm) {
    console.log(Green, dir);
    const dirs = fs.readdirSync(dir).filter((file) => (!file.startsWith(".") && fs.statSync(path.join(dir, file)).isDirectory()));
    console.log("Available folders in the directory: ");
    dirs.forEach((dir) => {
      console.log(Blue, dir);
    });
    return handleDirPrompt(cwd, dir);
  }
  return dir;
}

async function handleDirNamePrompt(dir) {
  const ans = await inquirer.prompt([
    {
      type: "input",
      name: "dir",
      message: "Enter the name of the directory",
      default: "redux-provider",
    },
  ]);

  const exists = fs.existsSync(path.join(dir, ans.dir));
  if (exists) {
    console.log(Error, `Directory ${dir} already exists`);
    return handleDirNamePrompt(dir);
  }

  return [
    path.join(dir, ans.dir),
    path.join(dir, ans.dir, "states"),
  ]
}

async function handleFrameworkPrompt() {
  const ans = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "What type of project you are using?",
      choices: ["Next", "React"],
    },
  ]);

  return ans.framework;
}

async function handleTypescriptPrompt() {
  const ans = await inquirer.prompt([
    {
      type: "confirm",
      name: "typescript",
      message: "Are you using TypeScript?",
    },
  ]);

  return ans.typescript;
}