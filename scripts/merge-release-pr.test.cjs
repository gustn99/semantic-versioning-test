const assert = require('node:assert/strict');
const test = require('node:test');

const {parseReleasePullRequest} = require('./merge-release-pr.cjs');

test('release-please 출력에서 단일 Release PR을 읽는다', () => {
  const result = parseReleasePullRequest(
    JSON.stringify([{number: 21, title: 'chore(main): release 3.1.0'}])
  );

  assert.deepEqual(result, {
    number: 21,
    title: 'chore(main): release 3.1.0',
  });
});

test('Release PR이 둘 이상이면 자동 머지를 중단한다', () => {
  assert.throws(
    () => parseReleasePullRequest(JSON.stringify([{number: 21}, {number: 22}])),
    /Expected exactly one release pull request/
  );
});

test('PR 번호와 제목이 없는 출력은 거부한다', () => {
  assert.throws(
    () => parseReleasePullRequest(JSON.stringify([{number: 21} ])),
    /must include a number and title/
  );
});

test('JSON이 아닌 출력은 거부한다', () => {
  assert.throws(() => parseReleasePullRequest('not-json'), /Invalid release-please pull request output/);
});
