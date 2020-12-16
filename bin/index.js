#!/usr/bin/env node

const lib = require("../lib/index.js")

const args = process.argv.splice(process.execArgv.length + 2)

if (!args.length) {
  console.error("No file specified")
  return
}

// Retrieve the first argument
const filename = args[0]

// Displays the text in the console
lib.generateTests(filename)
