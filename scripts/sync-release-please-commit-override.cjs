const OVERRIDE_START = '<!-- release-please:type-normalizer:start -->';
const OVERRIDE_END = '<!-- release-please:type-normalizer:end -->';

function normalizeFeatureTitle(title) {
  const bracketMatch = title.match(/^\[feature(!)?\]\s+(?:#\d+\s+)?(.+)$/i);
  if (bracketMatch) {
    const breaking = bracketMatch[1] === '!';
    return `feature${breaking ? '!' : ''}: ${bracketMatch[2].trim()}`;
  }

  const conventionalMatch = title.match(/^(feat|feature)(\([^)]*\))?(!)?\s*:\s*(.+)$/i);
  if (conventionalMatch) {
    const [, type, scope = '', breaking = '', summary] = conventionalMatch;
    return `${type.toLowerCase()}${scope}${breaking}: ${summary.trim()}`;
  }

  return null;
}

function appendCommitOverride(body, normalizedTitle) {
  if (/^BEGIN_COMMIT_OVERRIDE\s*$/m.test(body)) {
    return null;
  }

  const override = [
    OVERRIDE_START,
    'BEGIN_COMMIT_OVERRIDE',
    normalizedTitle,
    'END_COMMIT_OVERRIDE',
    OVERRIDE_END,
  ].join('\n');

  return body.trim() ? `${body.trim()}\n\n${override}\n` : `${override}\n`;
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

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

async function syncCommitOverride() {
  const repository = process.env.REPOSITORY;
  const commitSha = process.env.COMMIT_SHA;
  if (!process.env.GITHUB_TOKEN || !repository || !commitSha) {
    throw new Error('GITHUB_TOKEN, REPOSITORY and COMMIT_SHA are required');
  }

  const pullRequests = await requestGitHub(
    `/repos/${repository}/commits/${encodeURIComponent(commitSha)}/pulls`
  );
  const pullRequest = pullRequests.find(({merged_at: mergedAt}) => mergedAt);
  if (!pullRequest) {
    console.log(`No merged pull request found for ${commitSha}`);
    return;
  }

  const normalizedTitle = normalizeFeatureTitle(pullRequest.title);
  if (!normalizedTitle) {
    console.log(`No feature title to normalize for pull request #${pullRequest.number}`);
    return;
  }

  const body = appendCommitOverride(pullRequest.body ?? '', normalizedTitle);
  if (body === null) {
    console.log(`Pull request #${pullRequest.number} already has a commit override`);
    return;
  }

  await requestGitHub(`/repos/${repository}/pulls/${pullRequest.number}`, {
    method: 'PATCH',
    body: JSON.stringify({body}),
    headers: {'Content-Type': 'application/json'},
  });
  console.log(`Normalized pull request #${pullRequest.number} as ${normalizedTitle}`);
}

if (require.main === module) {
  syncCommitOverride().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  appendCommitOverride,
  normalizeFeatureTitle,
};
