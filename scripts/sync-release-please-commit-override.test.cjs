const assert = require('node:assert/strict');
const test = require('node:test');

const {
  appendCommitOverride,
  normalizeFeatureTitle,
} = require('./sync-release-please-commit-override.cjs');

test('feature 타입은 대소문자와 관계없이 소문자로 정규화한다', () => {
  assert.equal(normalizeFeatureTitle('feature: 검색 기능 추가'), 'feature: 검색 기능 추가');
  assert.equal(normalizeFeatureTitle('Feature: 검색 기능 추가'), 'feature: 검색 기능 추가');
  assert.equal(normalizeFeatureTitle('FEATURE(api): 검색 기능 추가'), 'feature(api): 검색 기능 추가');
});

test('리로그 Feature 헤더를 minor 변경으로 정규화한다', () => {
  assert.equal(
    normalizeFeatureTitle('[Feature] #123 검색 기능 추가'),
    'feature: 검색 기능 추가'
  );
  assert.equal(normalizeFeatureTitle('[feature] 검색 기능 추가'), 'feature: 검색 기능 추가');
  assert.equal(normalizeFeatureTitle('[ALL/feat] 검색 기능 추가'), 'feat: 검색 기능 추가');
});

test('리로그 Feature! 헤더를 breaking change로 정규화한다', () => {
  assert.equal(
    normalizeFeatureTitle('[Feature!] #123 검색 API 교체'),
    'feature!: 검색 API 교체'
  );
  assert.equal(normalizeFeatureTitle('Feature!: 검색 API 교체'), 'feature!: 검색 API 교체');
  assert.equal(normalizeFeatureTitle('[BE/FEATURE!] 검색 API 교체'), 'feature!: 검색 API 교체');
});

test('Feature 계열이 아닌 제목은 변경하지 않는다', () => {
  assert.equal(normalizeFeatureTitle('[Fix] #123 검색 오류 수정'), null);
  assert.equal(normalizeFeatureTitle('docs: 검색 문서 수정'), null);
});

test('기존 PR 본문 뒤에 release-please commit override를 추가한다', () => {
  assert.equal(
    appendCommitOverride('본문', 'feature: 검색 기능 추가'),
    `본문

<!-- release-please:type-normalizer:start -->
BEGIN_COMMIT_OVERRIDE
feature: 검색 기능 추가
END_COMMIT_OVERRIDE
<!-- release-please:type-normalizer:end -->
`
  );
});

test('수동 commit override가 있으면 덮어쓰지 않는다', () => {
  assert.equal(
    appendCommitOverride(
      'BEGIN_COMMIT_OVERRIDE\nfeat!: 수동 설정\nEND_COMMIT_OVERRIDE',
      'feature: 검색 기능 추가'
    ),
    null
  );
});
