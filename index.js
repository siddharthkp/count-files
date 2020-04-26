#!/usr/bin/env node
const countFiles = require('count-files');
const check = require('./check');

countFiles('.', function (err, results) {
  check({
    title: results.files,
    summary: `There are ${results.files} files in this repository`,
  });
});
