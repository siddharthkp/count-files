#!/usr/bin/env node
const countFiles = require('count-files');
const fetch = require('node-fetch');

// get repository from CI environment
const { ci, repo, sha } = require('ci-env');

if (!ci) {
  console.log(`
  This is not running in a CI environment. 

  If you are running this on local, please fake the required environment variables

  Reference: https://github.com/siddharthkp/ci-env/blob/master/index.js#L121-L131
  `);
  process.exit(1);
}

let API = 'https://check-files-check.now.sh';
if (ci === 'custom') API = 'http://localhost:3000';

countFiles('.', { ignore: (file) => file.includes('node_modules/') }, function (
  err,
  results
) {
  const body = {
    repo,
    sha,
    title: `${results.files}`, // needs to be a string
    summary: `There are ${results.files} files in this repository`,
  };

  fetch(API, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((error) => console.log(error));
});
