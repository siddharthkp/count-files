const fs = require('fs');
const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');

// get repository from CI environment
const { ci, repo: repositoryPath, sha } = require('ci-env');

if (!ci) {
  console.log(`
  This is not running in a CI environment. 

  If you are running this on local, please fake the required environment variables

  Reference: https://github.com/siddharthkp/ci-env/blob/master/index.js#L121-L131
  `);
  process.exit(1);
}

const owner = repositoryPath.split('/')[0];
const repo = repositoryPath.split('/')[1];

// application level constants
const appId = 62324;
const privateKey = fs.readFileSync('private.key', 'utf8');
const name = 'Check count';

const app = new Octokit({
  authStrategy: createAppAuth,
  auth: { id: appId, privateKey: privateKey },
});

const run = async ({ title = '', summary = '', text = '' }) => {
  // get installation id for repo
  const { data } = await app.apps.getRepoInstallation({ owner, repo });
  const installationId = data.id;

  // get token
  const { token } = await app.auth({ type: 'installation', installationId });

  // authenticate
  const octokit = new Octokit({ auth: token });

  await octokit.checks.create({
    owner,
    repo,
    head_sha: sha,
    conclusion: 'success',
    name,
    output: {
      title,
      summary,
      text,
    },
  });
};

module.exports = run;
