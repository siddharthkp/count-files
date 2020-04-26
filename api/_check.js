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

const getInstallation = async ({ owner, repo }) => {
  const { data } = await app.apps.getRepoInstallation({ owner, repo });
  const installationId = data.id;
  return installationId;
};

const getToken = async ({ installationId }) => {
  const { token } = await app.auth({ type: 'installation', installationId });
  return token;
};

const createCheck = async ({ token, name, owner, repo, sha, output }) => {
  const octokit = new Octokit({ auth: token });

  await octokit.checks.create({
    name,
    owner,
    repo,
    head_sha: sha,
    conclusion: 'success',
    output,
  });
};

const run = async ({
  repo: repositoryPath,
  sha,
  title = '',
  summary = '',
  text = '',
}) => {
  const owner = repositoryPath.split('/')[0];
  const repo = repositoryPath.split('/')[1];
  console.log('1/4 repo', repositoryPath);

  // check output
  const output = { title, summary, text };
  console.log('1/4 output', JSON.stringify(output));

  // get installation id for repo
  const installationId = await getInstallation({ owner, repo });
  console.log('2/4 installationId', installationId);

  // get auth token
  const token = await getToken({ installationId });
  console.log('3/4 token', token);

  // create check
  await createCheck({ token, name, owner, repo, sha, output });
  console.log('4/4 end of request \n\n');
};

module.exports = run;
