# GitHub 생성 노트 모드와 v1.0.0 결과

- 설정: `release-please.github.json`의 `changelog-type: github`
- 수동 실행: https://github.com/gustn99/semantic-versioning-test/actions/runs/40814319449
- release-please PR: https://github.com/gustn99/semantic-versioning-test/pull/2
- 실제 Release: https://github.com/gustn99/semantic-versioning-test/releases/tag/v1.0.0
- 릴리즈 생성 실행: https://github.com/gustn99/semantic-versioning-test/actions/runs/40814390399

release-please PR과 실제 GitHub Release에 다음 본문이 생성됐다.

```md
## 1.0.0 (2026-10-29)

## What's Changed
* [Feature] 릴리즈 노트 테스트 기능 추가 by @gustn99 in https://github.com/gustn99/semantic-versioning-test/pull/1
* [Hotfix] #3 여러 커밋 PR의 릴리즈 노트 생성 검증 by @gustn99 in https://github.com/gustn99/semantic-versioning-test/pull/4
* fix: 단일 커밋 PR의 릴리즈 노트 생성 검증 by @gustn99 in https://github.com/gustn99/semantic-versioning-test/pull/5

## New Contributors
* @gustn99 made their first contribution in https://github.com/gustn99/semantic-versioning-test/pull/1

**Full Changelog**: https://github.com/gustn99/semantic-versioning-test/commits/v1.0.0
```

PR #4의 `[Hotfix] #3 title`과 PR #5의 단일 커밋 제목이 수정 없이 노출됐다. 두 항목 모두 작성자와 PR 링크를 포함했다. shout-outz에서 확인한 형태에 별도 포매터 없이 도달했다.

이번 릴리즈는 첫 태그여서 `Full Changelog`가 이전 태그와의 비교 URL 대신 `commits/v1.0.0`을 가리킨다. 두 번째 릴리즈부터 `compare/이전태그...새태그`가 생성되는지는 별도 확인 대상이다.

PR #1은 리로그 제목 규칙을 잘못 재현한 예비 실험이지만, GitHub 생성 노트는 릴리즈 범위의 모든 병합 PR을 나열하므로 본문에도 포함됐다. 불필요한 PR을 노트에서 빼려면 GitHub Release 설정의 카테고리·제외 라벨이나 별도 후처리가 필요하다.
