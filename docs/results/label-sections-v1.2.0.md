# 라벨 분류와 실제 v1.2.0 결과

## 입력

- PR #8 `feat: PR 라벨 기반 릴리즈 노트 분류 추가`: `release/core` 라벨
- PR #11 `fix: 릴리즈 분류 헤딩 레벨 보정`: `release/core` 라벨
- PR #10 `docs: 기타 변경 섹션 테스트 항목 추가`: 릴리즈 분류 라벨 없음
- release-please PR #9 `chore(main): release 1.2.0`

PR #8·#10·#11은 커밋이 하나인 PR이므로 커밋 제목을 PR 제목으로 쓰고 squash merge했다. release-please PR #9도 squash merge해 `chore(main): release 1.2.0 (#9)` 커밋을 만들었다.

## 실행 결과

[release-please 실행](https://github.com/gustn99/semantic-versioning-test/actions/runs/40817418402)은 성공했고 [v1.2.0 Release](https://github.com/gustn99/semantic-versioning-test/releases/tag/v1.2.0)를 만들었다.

최종 본문의 첫 줄은 `릴리즈 시각: 2026-10-29 13:22:55 KST`다. `핵심 변경`에는 PR #8·#11, `기타 변경`에는 PR #10이 들어갔다. 각 항목은 작성자와 PR 링크를 유지했고 마지막 비교 링크는 `v1.1.0...v1.2.0`이다.

GitHub 생성 노트는 `.github/release.yml`의 카테고리를 `## What's Changed` 아래 `###` 헤딩으로 만들었다. 후처리 스크립트는 바깥 헤딩을 제거하고 두 카테고리를 `##` 헤딩으로 올렸다. 제목 정규식 분류는 사용하지 않는다.
