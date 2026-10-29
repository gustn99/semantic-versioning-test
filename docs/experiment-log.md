# 실험 기록

> 이 문서는 release-please 채택 여부를 판단하기 위해 수행한 과거 실험 기록이다. 현재 워크플로는 release-please, Release PR, `CHANGELOG.md`, manifest를 사용하지 않는다.

확인되지 않은 실행 결과는 채우지 않는다. 아래 항목은 실제 GitHub Actions 실행 뒤 기록한다.

## 준비 상태

2026-10-29 첫 확인 때 `gustn99/semantic-versioning-test`는 GitHub API에서 404였다. 접근이 열린 뒤 확인한 결과 기본 브랜치 이름은 `main`이고, 파일·커밋·릴리즈가 없는 빈 저장소였다. 로컬의 `git ls-remote`는 실행 환경의 DNS 제한으로 실패해 GitHub 연결 도구로 확인했다.

GitHub 연결로 `README.md`를 만드는 첫 쓰기 요청은 `403 Resource not accessible by integration`으로 거부됐다. 로컬 Git의 네트워크 권한으로 `project/`를 `main`에 push했고, [초기 Action 실행](https://github.com/gustn99/semantic-versioning-test/actions/runs/40813380744)은 성공했다.

[테스트 PR #1](https://github.com/gustn99/semantic-versioning-test/pull/1)은 잘못 설계한 예비 실험이다. 제목 `[Feature] 릴리즈 노트 테스트 기능 추가`에는 리로그 규칙의 이슈 번호가 없고, squash 커밋도 `feat: add release note sample feature (#1)`로 바꿨다. 이 결과는 리로그 재현 결과에서 제외한다. `main` 병합 SHA는 `663941bfbe50a349222eec57b9e525675e1efee4`다. [첫 기본 모드 Action 실행](https://github.com/gustn99/semantic-versioning-test/actions/runs/40813557005)은 저장소 설정 때문에 릴리즈 PR 생성에 실패했다. 설정 변경 후 [재실행](https://github.com/gustn99/semantic-versioning-test/actions/runs/40813736157)은 성공해 [release-please PR #2](https://github.com/gustn99/semantic-versioning-test/pull/2)를 만들었다.

## 비교 기준

| 항목 | 기본 모드 | GitHub 모드 | Custom 모드 |
| --- | --- | --- | --- |
| release-please 설정 | `release-please.default.json` | `release-please.github.json`의 `changelog-type: github` | GitHub 모드 뒤 Release 본문 후처리 |
| 예상 본문 형태 | Conventional Commit 종류별 섹션 | `What's Changed` PR 목록과 `Full Changelog` 링크 | KST 릴리즈 시각, 리로그 제목별 헤더, PR 목록과 `Full Changelog` |
| 버전 결정 | Conventional Commit | Conventional Commit, 동일 | Conventional Commit, 동일 |
| 실제 Action 실행 | PR #4·#5 뒤 성공 | 수동 실행 성공 | [v1.2.0 생성 실행](https://github.com/gustn99/semantic-versioning-test/actions/runs/40817418402) 성공 |
| 실제 Release URL | 비교 중에는 미생성 | [v1.0.0](https://github.com/gustn99/semantic-versioning-test/releases/tag/v1.0.0) | [v1.2.0](https://github.com/gustn99/semantic-versioning-test/releases/tag/v1.2.0) |

[예비 실험의 기본 모드 결과](results/default-pr-1.md): PR #1을 합친 뒤 release-please가 PR #2를 만들고 `1.0.0`을 제안했다. 기본 노트에는 `### Features`와 커밋·이슈 링크가 있었고, 작성자와 `Full Changelog`는 없었다. PR #1은 리로그 PR 규칙을 재현하지 못했으므로 release-please 자체의 대조 자료로만 남긴다.

[리로그 형식의 여러 커밋 PR 결과](results/rilog-multi-commit-pr-4.md): PR #4는 `[Hotfix] #3 title`, 내부 `fix:` 커밋 두 개, merge commit 구조로 만들었다. 기본 release-please는 내부 커밋 두 개를 `Bug Fixes`에 넣었다. PR 링크와 작성자는 표시하지 않았다.

[리로그 형식의 단일 커밋 PR 결과](results/rilog-single-commit-pr-5.md): PR #5는 커밋 제목을 PR 제목으로 그대로 쓰고 squash merge했다. 기본 release-please는 `fix:` 항목에 PR #5와 커밋 링크를 붙였다.

[GitHub 생성 노트와 실제 v1.0.0 결과](results/github-mode-v1.0.0.md): `changelog-type: github`는 PR #1·#4·#5의 제목, 작성자, PR 링크를 `What's Changed`에 나열했다. release-please PR을 합친 뒤 같은 본문으로 v1.0.0 Release가 생성됐다.

[라벨 분류와 실제 v1.2.0 결과](results/label-sections-v1.2.0.md): `release/core`가 붙은 PR #8·#11은 `핵심 변경`, 라벨이 없는 PR #10은 `기타 변경`에 들어갔다. 최종 Release에는 KST 릴리즈 시각, 작성자·PR 링크, `Full Changelog`가 표시됐다.

## 실제 실행 기록 양식

### 입력

- 대상 브랜치와 기준 SHA:
- 합친 테스트 PR URL과 squash/merge 커밋 제목:
- 기존 최신 태그:

### 기본 모드

- Actions 실행 URL:
- 생성·갱신된 release-please PR URL:
- 제안 버전과 근거:
- PR 본문 및 `CHANGELOG.md` 내용:

### GitHub 모드

- Actions 실행 URL:
- 갱신된 release-please PR URL:
- PR 제목·작성자·링크 포함 여부:
- `Full Changelog` 비교 범위:
- PR 본문 및 `CHANGELOG.md` 내용:

### Custom 모드

- Actions 실행 URL:
- 생성된 Release URL:
- 첫 줄의 KST 날짜·시각:
- PR 제목별 헤더 분류:
- `New Contributors`와 `Full Changelog` 유지 여부:

### 리로그식 커밋

- 입력 커밋 제목 및 PR URL:
- release-please PR 생성 여부와 계산된 버전:
- 누락된 항목과 원인:
- 리로그 적용 시 필요한 규칙 변경:
