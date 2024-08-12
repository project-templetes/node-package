#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { askQuestion } from "./ask-question";
import { Command } from "commander";

interface Config {
  baseDir: string;
  statesDir: string;
  framework: any;
  typescript: any;
}

const Error = "\x1b[31m%s\x1b[0m"
const program = new Command();

program.parse(process.argv);

if (program.args.length === 0) {
    const cwd = process.cwd();
    askQuestion(cwd)
    .then(async (ans) => {
        console.log(ans)
        create(ans);
    })
    .catch(err => {
        if (err.name === 'ExitPromptError') {
            console.log(Error, 'Prompt was force closed by the user.');
        } else {
            console.error(err);
        }
    });
}
export function create(config: Config) {
  const baseDir = config.baseDir;
  const statesDir = config.statesDir;
  const isNext = "next" === `${config.framework}`.toLowerCase();
  const isTypescript = config.typescript;

  // Create directories
  fs.mkdirSync(statesDir, { recursive: true });

  // Create and write to auth.[ts|js]
  const authContent = `${isNext ? "'use client';" : ""}
import { createSlice } from "@reduxjs/toolkit";
import { useLocalStorage } from "../use-local-storage";

const {
    readLocalStorage, 
    updateLocalStorage
} = useLocalStorage('auth', {
    isAuth: false,
    token: "",
  });
  
const auth = createSlice({
    name: "auth",
    initialState: readLocalStorage(),
    reducers: {
        logout: () => updateLocalStorage(null),
        login: (state, action) =>  updateLocalStorage({
            isAuth: true,
            ...(action.payload)
        })

    }
})

export default auth;
`;
  fs.writeFileSync(path.join(statesDir, isTypescript ? 'auth.ts' : 'auth.js'), authContent);

  // Create and write to index.[tsx|jsx]
  const indexContent = `${isNext ? "'use client';" : ""}
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import auth from "./states/auth";
import React, { useEffect } from "react";
const store = configureStore({
  reducer: {
    auth: auth.reducer,
  },
});
export const authActions = auth.actions;
export default function ReduxProvider({ children }${isTypescript ? ": { children: React.ReactNode }" : ""}) {
  useEffect(() => {}, []);
  return <Provider store={store}>{children}</Provider>;
};
`;
  fs.writeFileSync(path.join(baseDir, isTypescript ? 'index.tsx' : 'index.jsx'), indexContent);

  // Create and write to use-local-storage.[ts|js]
  const useLocalStorageContent = `export const useLocalStorage = (key${isTypescript ? ": string" : ""}, defaultState${isTypescript ? ": any" : ""}) => {
  return {
      updateLocalStorage: (data${isTypescript ? ": any" : ""} = null) => {
          if (!data) return localStorage.removeItem(key);
          localStorage.setItem(key, JSON.stringify(data));
      },
      readLocalStorage: () => {
          if (typeof window !== 'undefined') {
            const data = localStorage.getItem(key);
            return !!data && data !== "undefined"
              ? JSON.parse(data) 
              : defaultState;
          } 
          return defaultState;
        },
        
  }
}
`;
  fs.writeFileSync(
    path.join(baseDir, isTypescript ? 'use-local-storage.ts' : 'use-local-storage.js'),
    useLocalStorageContent
  );

  console.log("Redux provider structure created successfully.");
}
