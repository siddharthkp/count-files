#!/usr/bin/env node
const countFiles = require('count-files');
const fetch = require('node-fetch');

// const API = 'https://check-files-check.now.sh';
const API = 'http://localhost:3000';

countFiles('.', function (err, results) {
  const body = {
    title: `${results.files}`, // needs to be a string
    summary: `There are ${results.files} files in this repository`,
  };

  fetch(API, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
});
