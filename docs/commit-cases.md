# 리로그 커밋 양상과 실험 입력

2026-10-29에 [리로그 `production` 최근 커밋](https://github.com/woowacourse-teams/2026-rilog/commits/production/)에서 확인한 제목의 일부다. 아래 예상은 release-please의 [Conventional Commit 규칙](https://github.com/googleapis/release-please#how-should-i-write-my-commits)을 적용한 사전 판단이며, 실험용 레포에서 실행한 결과가 아니다.

| 실제 제목 | 형태 | 기본 버전 결정 예상 |
| --- | --- | --- |
| `[Hotfix] #786 본문 Base64 미디어 저장 차단 (#787)` | 2개 커밋 PR의 merge commit. PR 제목은 `[Hotfix] #786 본문 Base64 미디어 저장 차단` | 바깥 제목은 Conventional Commit이 아니다. 본문의 `fix:` 커밋 두 개를 release-please가 읽는지 확인 필요 |
| `[Feature] #756 비회원 진입점 추가 (#757)` | 17개 커밋 PR의 squash 결과가 아니라 merge commit. PR 제목은 `[Feature] #756 비회원 진입점 추가` | 바깥 제목은 Conventional Commit이 아니다. merge commit 본문과 하위 커밋 처리 확인 필요 |
| `feature: 더 리로그 이용 행동의 모니터링 연결` | `feature:` 접두어 | release-please의 기본 기능 추가 접두어 `feat:`와 다르다 |
| `fix: 개발 환경 조회 등록 기본 활성화 (#760)` | Conventional Commit | patch 후보 |
| `Merge pull request #765 from woowacourse-teams/develop` | 브랜치 통합 merge 커밋 | 제목만으로 릴리즈 종류를 결정할 수 없다 |

## 실험용 PR 입력

작은 텍스트 파일 변경을 각 PR에 담아 합친다. 실제 동작을 비교하려면 같은 커밋 범위를 두 노트 모드에 적용해야 한다. PR 제목과 최종 커밋 제목을 기록하고, `docs/experiment-log.md`에 Action 실행 URL을 남긴다.

1. 이슈를 먼저 만든다. 커밋이 여러 개인 PR의 제목은 `[Header] #issue-number title`로 쓴다. 예를 들어 이슈가 `#3`이면 `[Hotfix] #3 미디어 저장 차단`이다.
2. 위 PR에 `fix: 임시 미디어 주소의 저장 방지`, `fix: 붙여넣기 우회 방지`처럼 두 커밋을 넣고 merge commit으로 합친다. 리로그 PR #787과 같은 구조다.
3. 커밋이 하나인 PR은 `fix: 개발 환경 조회 등록 기본 활성화`처럼 커밋 제목을 PR 제목으로 그대로 쓰고 squash merge한다. 리로그 PR #760과 같은 구조다.
4. 두 경우가 기본 release-please의 버전과 CHANGELOG에 어떻게 반영되는지 기록한다. 이후 같은 범위에 GitHub 노트 형식을 적용한다.

번호는 실험 레포의 실제 PR·이슈 번호를 쓴다. 첫 테스트 PR #1은 이슈 번호가 빠졌고 squash 커밋을 `feat:`로 바꿨으므로 리로그 재현 사례에서 제외한다. 리로그에서 어떤 머지 방식을 유지할지 결정하기 전에는 한 가지 방식의 결과를 다른 방식으로 일반화하지 않는다.
