const assert = require('node:assert/strict');
const test = require('node:test');

const {
  formatKoreanTime,
  formatReleaseNotes,
  sectionFor,
} = require('./update-release-notes.cjs');

test('KST 날짜와 시각을 일반 텍스트에 사용할 형식으로 변환한다', () => {
  assert.equal(formatKoreanTime('2026-10-29T03:50:35Z'), '2026-10-29 12:50:35 KST');
});

test('리로그 제목을 커스텀 섹션으로 분류한다', () => {
  assert.equal(sectionFor('* [Feature] #10 기능 추가 by @crew in https://example.com/10'), '새로운 기능');
  assert.equal(sectionFor('* [Hotfix] #11 장애 수정 by @crew in https://example.com/11'), '버그 수정');
  assert.equal(sectionFor('* fix: 단일 커밋 수정 by @crew in https://example.com/12'), '버그 수정');
  assert.equal(sectionFor('* [Refactor] #13 구조 변경 by @crew in https://example.com/13'), '리팩터링');
  assert.equal(sectionFor('* docs: 문서 수정 by @crew in https://example.com/14'), '문서');
  assert.equal(sectionFor('* chore: 설정 수정 by @crew in https://example.com/15'), '기타 변경');
});

test('버전 헤딩을 제거하고 기여자 섹션과 PR 작성자는 유지한다', () => {
  const input = `## 1.1.0 (2026-10-29)

## What's Changed
* [Feature] #10 기능 추가 by @crew-a in https://example.com/10
* [Hotfix] #11 장애 수정 by @crew-b in https://example.com/11
* docs: 릴리즈 문서 수정 by @crew-c in https://example.com/12

## New Contributors
* @crew-a made their first contribution in https://example.com/10

**Full Changelog**: https://example.com/compare/v1.0.0...v1.1.0`;

  assert.equal(
    formatReleaseNotes(input, '2026-10-29T03:50:35Z'),
    `릴리즈 시각: 2026-10-29 12:50:35 KST

## 새로운 기능
* [Feature] #10 기능 추가 by @crew-a in https://example.com/10

## 버그 수정
* [Hotfix] #11 장애 수정 by @crew-b in https://example.com/11

## 문서
* docs: 릴리즈 문서 수정 by @crew-c in https://example.com/12

## New Contributors
* @crew-a made their first contribution in https://example.com/10

**Full Changelog**: https://example.com/compare/v1.0.0...v1.1.0
`
  );
});
