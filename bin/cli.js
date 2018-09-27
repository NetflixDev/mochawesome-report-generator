#!/usr/bin/env node
'use strict';

var yargs = require('yargs');

var _require = require('../lib/options'),
    yargsOptions = _require.yargsOptions;

var marge = require('./cli-main');

// Setup yargs
yargs.usage('Usage: $0 [options] <data_file> [data_file2..]').demand(1).options(yargsOptions).help('help').alias('h', 'help').version().epilog('Copyright 2016-2017 Adam Gruber').argv;

// Call the main cli program
marge(yargs.argv);