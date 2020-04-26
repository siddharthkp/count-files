const fs = require('fs');
const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');

// application level constants
const appId = 62324;
const privateKey = fs.readFileSync('private.key', 'utf8');
const name = 'Check count';

const app = new Octokit({
  authStrategy: createAppAuth,
  auth: { id: appId, privateKey: privateKey },
});

const run = async ({
  repo: repositoryPath,
  sha,
  title = '',
  summary = '',
  text = '',
}) => {
  const owner = repositoryPath.split('/')[0];
  const repo = repositoryPath.split('/')[1];

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
