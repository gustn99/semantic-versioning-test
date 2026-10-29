# 리로그 커밋 양상과 실험 입력

2026-10-29에 [리로그 `production` 최근 커밋](https://github.com/woowacourse-teams/2026-rilog/commits/production/)에서 확인한 제목의 일부다. 아래 예상은 release-please의 [Conventional Commit 규칙](https://github.com/googleapis/release-please#how-should-i-write-my-commits)을 적용한 사전 판단이며, 실험용 레포에서 실행한 결과가 아니다.

| 실제 제목 | 형태 | 기본 버전 결정 예상 |
| --- | --- | --- |
| `[Hotfix] #786 본문 Base64 미디어 저장 차단 (#787)` | 2개 커밋 PR의 merge commit. PR 제목은 `[Hotfix] #786 본문 Base64 미디어 저장 차단` | 바깥 제목은 Conventional Commit이 아니다. 본문의 `fix:` 커밋 두 개를 release-please가 읽는지 확인 필요 |
| `[Feature] #756 비회원 진입점 추가 (#757)` | 17개 커밋 PR의 squash 결과가 아니라 merge commit. PR 제목은 `[Feature] #756 비회원 진입점 추가` | 바깥 제목은 Conventional Commit이 아니다. merge commit 본문과 하위 커밋 처리 확인 필요 |
| `feature: 더 리로그 이용 행동의 모니터링 연결` | `feature:` 접두어 | Conventional Commit의 권장 `feat:`와 다르지만 현재 기본 버전 계산 구현은 `feature`도 minor로 처리한다. 실제 Action 입력으로는 별도 확인 필요 |
| `fix: 개발 환경 조회 등록 기본 활성화 (#760)` | Conventional Commit | patch 후보 |
| `Merge pull request #765 from woowacourse-teams/develop` | 브랜치 통합 merge 커밋 | 제목만으로 릴리즈 종류를 결정할 수 없다 |

## 실험용 PR 입력

작은 텍스트 파일 변경을 각 PR에 담아 합친다. 실제 동작을 비교하려면 같은 커밋 범위를 두 노트 모드에 적용해야 한다. PR 제목과 최종 커밋 제목을 기록하고, `docs/experiment-log.md`에 Action 실행 URL을 남긴다.

1. 이슈를 먼저 만든다. 커밋이 여러 개인 PR의 제목은 `[Header] #issue-number title`로 쓴다. 예를 들어 이슈가 `#3`이면 `[Hotfix] #3 미디어 저장 차단`이다.
2. 위 PR에 `fix: 임시 미디어 주소의 저장 방지`, `fix: 붙여넣기 우회 방지`처럼 두 커밋을 넣고 merge commit으로 합친다. 리로그 PR #787과 같은 구조다.
3. 커밋이 하나인 PR은 `fix: 개발 환경 조회 등록 기본 활성화`처럼 커밋 제목을 PR 제목으로 그대로 쓰고 squash merge한다. 리로그 PR #760과 같은 구조다.
4. 두 경우가 기본 release-please의 버전과 CHANGELOG에 어떻게 반영되는지 기록한다. 이후 같은 범위에 GitHub 노트 형식을 적용한다.

## 메이저 버전 입력

Conventional Commit에서 타입 또는 선택적 스코프 뒤에 `!`를 붙이면 breaking change다. 예시는 `feat!: 공개 API 변경`, `fix(api)!: 응답 형식 변경`이다. release-please는 이를 SemVer major 변경으로 처리한다.

`v1.2.0`에서 `feat!: 메이저 버전 릴리즈 테스트 추가` 커밋을 `main`에 squash merge한 결과 `v2.0.0` Release가 생성됐다. 같은 의미를 커밋 본문에 적어야 할 때는 빈 줄 뒤에 `BREAKING CHANGE: 변경 설명` footer를 사용할 수 있다.

다음 실험은 PR 제목에 `!`가 없고 내부 커밋에만 `feat!:`가 있는 여러 커밋 PR이다. PR을 squash하지 않고 merge commit으로 합쳐 내부 커밋 제목이 merge commit 본문에 남게 한다. 현재 버전 `2.0.0`에서 release-please가 내부 breaking change를 읽으면 예상 다음 버전은 `3.0.0`이다.

번호는 실험 레포의 실제 PR·이슈 번호를 쓴다. 첫 테스트 PR #1은 이슈 번호가 빠졌고 squash 커밋을 `feat:`로 바꿨으므로 리로그 재현 사례에서 제외한다. 리로그에서 어떤 머지 방식을 유지할지 결정하기 전에는 한 가지 방식의 결과를 다른 방식으로 일반화하지 않는다.
