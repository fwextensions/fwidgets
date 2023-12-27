#!/usr/bin/env node

const { execSync } = require("child_process");
const { relative } = require("path");

const command = `npx tmplr use local:${relative(process.cwd(), __dirname)}`;

	// pass the stdio from the parent process.  otherwise, there'll be no shell to
	// use for interacting with tmplr.
execSync(command, { stdio: "inherit" });
