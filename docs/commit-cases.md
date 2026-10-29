# 리로그 커밋 양상과 실험 입력

2026-10-29에 [리로그 `production` 최근 커밋](https://github.com/woowacourse-teams/2026-rilog/commits/production/)에서 확인한 제목의 일부다. 아래 예상은 release-please의 [Conventional Commit 규칙](https://github.com/googleapis/release-please#how-should-i-write-my-commits)을 적용한 사전 판단이며, 실험용 레포에서 실행한 결과가 아니다.

| 실제 제목 | 형태 | 기본 버전 결정 예상 |
| --- | --- | --- |
| `[Hotfix] #786 본문 Base64 미디어 저장 차단 (#787)` | PR merge 커밋, 내부에 `fix:` 두 개 | 바깥 제목은 Conventional Commit이 아니다. 내부 커밋 탐색 결과는 머지 방식에 따라 확인 필요 |
| `[Feature] #756 비회원 진입점 추가 (#757)` | squash된 PR 제목 | `feat:`가 아니므로 기능 추가로 인식되지 않을 가능성이 높다 |
| `feature: 더 리로그 이용 행동의 모니터링 연결` | `feature:` 접두어 | release-please의 기본 기능 추가 접두어 `feat:`와 다르다 |
| `fix: 개발 환경 조회 등록 기본 활성화 (#760)` | Conventional Commit | patch 후보 |
| `Merge pull request #765 from woowacourse-teams/develop` | 브랜치 통합 merge 커밋 | 제목만으로 릴리즈 종류를 결정할 수 없다 |

## 실험용 PR 입력

작은 텍스트 파일 변경을 각 PR에 담아 합친다. 실제 동작을 비교하려면 같은 커밋 범위를 두 노트 모드에 적용해야 한다. PR 제목과 최종 커밋 제목을 기록하고, `docs/experiment-log.md`에 Action 실행 URL을 남긴다.

1. `feat: 테스트 기능 추가 (#1)`처럼 표준 제목으로 squash merge한다. 기본 모드에서 minor 후보와 Features 항목이 나오는지 본다.
2. `fix: 테스트 오류 수정 (#2)`처럼 표준 제목으로 squash merge한다. 이미 열린 release PR이 갱신되는지 본다.
3. `[Feature] #3 비회원 진입점 추가 (#4)`처럼 리로그식 제목으로 squash merge한다. 노트 형식과 버전 결정에서 이 PR이 어떻게 취급되는지 본다.
4. `[Hotfix] #5 미디어 저장 차단 (#6)`처럼 리로그식 제목의 일반 merge commit을 만든다. 하위 `fix:` 커밋이 결과에 반영되는지 확인한다.

번호는 실험 레포의 실제 PR·이슈 번호로 바꾼다. 예시 제목을 그대로 실제 사례인 것처럼 기록하지 않는다. 리로그에서 어떤 머지 방식을 유지할지 결정하기 전에는 한 가지 방식의 결과를 다른 방식으로 일반화하지 않는다.
