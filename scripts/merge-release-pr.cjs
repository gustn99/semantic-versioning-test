function parseReleasePullRequest(value) {
  let pullRequests;
  try {
    pullRequests = JSON.parse(value);
  } catch (error) {
    throw new Error(`Invalid release-please pull request output: ${error.message}`);
  }

  if (!Array.isArray(pullRequests) || pullRequests.length !== 1) {
    throw new Error(`Expected exactly one release pull request, received ${pullRequests?.length ?? 0}`);
  }

  const [{number, title}] = pullRequests;
  if (!Number.isInteger(number) || typeof title !== 'string' || !title.trim()) {
    throw new Error('Release pull request must include a number and title');
  }

  return {number, title: title.trim()};
}

async function requestGitHub(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  const apiUrl = process.env.GITHUB_API_URL ?? 'https://api.github.com';
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    },
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function mergeReleasePullRequest() {
  const repository = process.env.REPOSITORY;
  const pullRequests = process.env.RELEASE_PRS;
  if (!process.env.GITHUB_TOKEN || !repository || !pullRequests) {
    throw new Error('GITHUB_TOKEN, REPOSITORY and RELEASE_PRS are required');
  }

  const {number, title} = parseReleasePullRequest(pullRequests);
  const result = await requestGitHub(`/repos/${repository}/pulls/${number}/merge`, {
    method: 'PUT',
    body: JSON.stringify({
      merge_method: 'squash',
      commit_title: `${title} (#${number})`,
    }),
    headers: {'Content-Type': 'application/json'},
  });

  if (!result.merged) {
    throw new Error(`Release pull request #${number} was not merged: ${result.message}`);
  }
  console.log(`Squash merged release pull request #${number} as ${result.sha}`);
}

if (require.main === module) {
  mergeReleasePullRequest().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  mergeReleasePullRequest,
  parseReleasePullRequest,
};
