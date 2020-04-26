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

let API = 'https://count-files-check.sid.now.sh/';
if (ci === 'custom') API = 'http://localhost:3000';

countFiles(
  '.',
  {
    ignore: (file) => {
      // ignore node_modules and .files/.directories
      return file.includes('node_modules/') || file.includes('/.');
    },
  },
  function (err, results) {
    const body = {
      repo,
      sha,
      title: `${results.files}`, // needs to be a string
      summary: `There are ${results.files} files in this repo`,
      text: JSON.stringify(results, null, 2),
    };

    console.log('#️⃣ ', body.summary);

    fetch(API, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (res.status === 200) console.log('✅ Check passed!');
        else
          res.json().then((json) => {
            console.log('⚠️ Could not add check');
            console.log(json.message);
            process.exit(1);
          });
      })
      .catch((error) => console.log(error));
  }
);
