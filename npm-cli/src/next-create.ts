#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .option('-a', 'Option A')

program.parse(process.argv);

const options = program.opts();

if (options.a) console.log('Option A is set');