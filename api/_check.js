let privateKey = process.env.PRIVATE_KEY;

const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');

// application level constants
const appId = 62324;
const name = 'Check count';

const app = new Octokit({
  authStrategy: createAppAuth,
  auth: { id: appId, privateKey: privateKey.replace(/\\n/g, '\n') },
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
  console.log('repo', repositoryPath);

  // get installation id for repo
  const { data } = await app.apps.getRepoInstallation({ owner, repo });
  const installationId = data.id;
  console.log('installation', installationId);

  // get token
  const { token } = await app.auth({ type: 'installation', installationId });
  console.log('token', token);

  // authenticate
  const octokit = new Octokit({ auth: token });
  console.log('output', JSON.stringify({ title, summary, text }));

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

  console.log('end of request \n\n');
};

module.exports = run;
