const SECTION_RULES = [
  {
    title: '새로운 기능',
    pattern: /^(?:\[Feature\]|(?:feat|feature)(?:\([^)]*\))?:)/i,
  },
  {
    title: '버그 수정',
    pattern: /^(?:\[(?:Fix|Hotfix|Bugfix)\]|(?:fix|hotfix)(?:\([^)]*\))?:)/i,
  },
  {
    title: '리팩터링',
    pattern: /^(?:\[Refactor\]|refactor(?:\([^)]*\))?:)/i,
  },
  {
    title: '문서',
    pattern: /^(?:\[(?:Docs|Documentation)\]|docs(?:\([^)]*\))?:)/i,
  },
];

function formatKoreanTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid release time: ${value}`);
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
    .formatToParts(date)
    .filter(({type}) => type !== 'literal')
    .reduce((result, {type, value: part}) => {
      result[type] = part;
      return result;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} KST`;
}

function extractPullRequestTitle(entry) {
  return entry
    .replace(/^[-*]\s+/, '')
    .replace(/\s+by\s+@[^\s]+\s+in\s+https?:\/\/\S+\s*$/i, '')
    .trim();
}

function sectionFor(entry) {
  const title = extractPullRequestTitle(entry);
  return SECTION_RULES.find(({pattern}) => pattern.test(title))?.title ?? '기타 변경';
}

function extractGeneratedNotes(body) {
  const lines = body.split(/\r?\n/);
  const entries = [];
  const contributorEntries = [];
  let inChanges = false;
  let inContributors = false;

  for (const line of lines) {
    if (/^## What's Changed\s*$/.test(line)) {
      inChanges = true;
      inContributors = false;
      continue;
    }
    if (/^## New Contributors\s*$/.test(line)) {
      inChanges = false;
      inContributors = true;
      continue;
    }
    if (/^##\s+/.test(line)) {
      inChanges = false;
      inContributors = false;
    }
    if (inChanges && /^[-*]\s+/.test(line)) {
      entries.push(line);
    }
    if (inContributors && /^[-*]\s+/.test(line)) {
      contributorEntries.push(line);
    }
  }

  const fullChangelog = lines.find((line) => /^\*\*Full Changelog\*\*:\s+/.test(line));
  return {contributorEntries, entries, fullChangelog};
}

function formatReleaseNotes(body, publishedAt) {
  const {contributorEntries, entries, fullChangelog} = extractGeneratedNotes(body);
  const grouped = new Map(SECTION_RULES.map(({title}) => [title, []]));
  grouped.set('기타 변경', []);

  for (const entry of entries) {
    grouped.get(sectionFor(entry)).push(entry);
  }

  const blocks = [`릴리즈 시각: ${formatKoreanTime(publishedAt)}`];
  for (const [title, sectionEntries] of grouped) {
    if (sectionEntries.length > 0) {
      blocks.push(`## ${title}\n${sectionEntries.join('\n')}`);
    }
  }
  if (contributorEntries.length > 0) {
    blocks.push(`## New Contributors\n${contributorEntries.join('\n')}`);
  }
  if (fullChangelog) {
    blocks.push(fullChangelog);
  }

  return `${blocks.join('\n\n')}\n`;
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

async function updateReleaseNotes() {
  const repository = process.env.REPOSITORY;
  const tagName = process.env.TAG_NAME;
  if (!process.env.GITHUB_TOKEN || !repository || !tagName) {
    throw new Error('GITHUB_TOKEN, REPOSITORY and TAG_NAME are required');
  }

  const encodedTag = encodeURIComponent(tagName);
  const release = await requestGitHub(`/repos/${repository}/releases/tags/${encodedTag}`);
  const body = formatReleaseNotes(
    release.body ?? '',
    release.published_at ?? release.created_at ?? new Date().toISOString()
  );

  await requestGitHub(`/repos/${repository}/releases/${release.id}`, {
    method: 'PATCH',
    body: JSON.stringify({body}),
    headers: {'Content-Type': 'application/json'},
  });
  console.log(`Updated release notes for ${tagName}`);
}

if (require.main === module) {
  updateReleaseNotes().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  extractPullRequestTitle,
  formatKoreanTime,
  formatReleaseNotes,
  sectionFor,
};
