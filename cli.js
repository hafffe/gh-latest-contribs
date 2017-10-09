#!/usr/bin/env node
'use strict';
const meow = require('meow');
const ghLatestContribs = require('.');

const cli = meow(`
	Usage
	  $ gh-latest-contribs [input]

	Options
	  --foo  Lorem ipsum [Default: false]

	Examples
	  $ gh-latest-contribs
	  unicorns & rainbows
	  $ gh-latest-contribs ponies
	  ponies & rainbows
`);

console.log(ghLatestContribs(cli.input[0] || 'unicorns'));
