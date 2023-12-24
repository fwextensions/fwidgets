#!/usr/bin/env node

const { execSync } = require("child_process");

	// pass the stdio from the parent process.  otherwise, there'll be no shell to
	// use for interacting with tmplr.
execSync("npx tmplr", { stdio: "inherit" });
