# 실험 기록

확인되지 않은 실행 결과는 채우지 않는다. 아래 항목은 실제 GitHub Actions 실행 뒤 기록한다.

## 준비 상태

2026-10-29 첫 확인 때 `gustn99/semantic-versioning-test`는 GitHub API에서 404였다. 접근이 열린 뒤 확인한 결과 기본 브랜치 이름은 `main`이고, 파일·커밋·릴리즈가 없는 빈 저장소였다. 로컬의 `git ls-remote`는 실행 환경의 DNS 제한으로 실패해 GitHub 연결 도구로 확인했다.

GitHub 연결로 `README.md`를 만드는 첫 쓰기 요청은 `403 Resource not accessible by integration`으로 거부됐다. 연결된 GitHub 앱의 이 레포 쓰기 권한이 열리면 원격 구성을 진행한다.

## 비교 기준

| 항목 | 기본 모드 | GitHub 모드 |
| --- | --- | --- |
| release-please 설정 | `release-please.default.json` | `release-please.github.json`의 `changelog-type: github` |
| 예상 본문 형태 | Conventional Commit 종류별 섹션 | `What's Changed` PR 목록과 `Full Changelog` 링크 |
| 버전 결정 | Conventional Commit | Conventional Commit, 동일 |
| 실제 Action 실행 | 미실행 | 미실행 |
| 실제 Release URL | 미생성 | 미생성 |

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

### 리로그식 커밋

- 입력 커밋 제목 및 PR URL:
- release-please PR 생성 여부와 계산된 버전:
- 누락된 항목과 원인:
- 리로그 적용 시 필요한 규칙 변경:
