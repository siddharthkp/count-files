#!/usr/bin/env node
const { exec } = require('child_process');

exec('git ls-files', (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }

  const count = stdout.split('\n').length;
  console.log(count);
});
