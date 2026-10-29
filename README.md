# 리로그 릴리즈 노트 실험

`gustn99/semantic-versioning-test`에서 release-please의 기본 체인지로그와 GitHub 생성 체인지로그를 같은 커밋 기록에 적용해 비교한다. 이후 리로그 `production`에 필요한 커스텀 범위를 판단하는 것이 목적이다.

## 구성

- `release-please.default.json`: release-please 기본 체인지로그. Conventional Commit을 종류별로 묶고 관련 PR·커밋 링크를 넣는다.
- `release-please.github.json`: 내장 `changelog-type: github`. GitHub의 릴리즈 노트 생성 API가 PR 제목·작성자·링크와 `Full Changelog` 비교 링크를 만든다.
- `.github/workflows/release-please.yml`: `main`에 push되면 기본 모드로 실행한다. Actions의 `Run workflow`에서 `github`을 선택하면 같은 릴리즈 PR을 GitHub 형식으로 갱신한다.
- `.release-please-manifest.json`: 첫 실행용 빈 버전 매니페스트. 첫 릴리즈 뒤에는 release-please가 버전을 기록한다.

두 모드는 **같은 릴리즈 PR을 갱신**한다. 따라서 비교할 때 기본 모드를 먼저 실행하고, PR 본문과 `CHANGELOG.md`를 기록한 다음 `github` 모드를 실행한다. 릴리즈 PR을 합치면 해당 시점의 내용으로 태그와 GitHub Release가 생성된다. 이미 생성된 릴리즈의 본문을 모드 변경만으로 소급 수정하지 않는다.

## 실험 순서

1. 이 폴더의 파일을 실험 레포 루트에 넣는다. GitHub 저장소의 **Settings → Actions → General**에서 Actions가 PR을 만들 수 있게 설정한다. 워크플로의 `GITHUB_TOKEN`에는 `contents`, `issues`, `pull-requests` 쓰기 권한을 지정했다.
2. `main`에 테스트 PR을 합친다. 우선 squash 커밋 제목을 `feat: ...` 또는 `fix: ...`로 만든다. push 실행 후 열린 release-please PR의 버전, 본문, `CHANGELOG.md`를 [실험 기록](docs/experiment-log.md)에 적는다.
3. Actions에서 **release-please experiment → Run workflow → github**을 실행한다. 갱신된 PR의 본문과 `CHANGELOG.md`를 같은 기록에 적고 두 형식을 비교한다.
4. 실제 릴리즈를 확인하려면 release-please PR을 합친다. 다음 `main` push 실행에서 태그와 GitHub Release가 생성되었는지 확인한다. `Full Changelog` 링크가 이전 태그부터 새 태그까지의 비교 범위를 가리키는지도 확인한다.
5. `[Feature] ... (#번호)`, `[Hotfix] ... (#번호)`, `Merge pull request ...` 같은 리로그식 커밋으로 별도 PR을 합치고, 릴리즈 PR에 포함되는지 확인한다. 기본적으로 release-please의 버전 결정은 Conventional Commit 메시지에 의존한다. GitHub 형식으로 노트만 바꿔도 이 결정 규칙은 바뀌지 않는다.

`GITHUB_TOKEN`으로 생성한 release-please PR이나 Release는 다른 GitHub Actions 워크플로를 자동으로 다시 실행하지 않는다. 이 실험 워크플로는 릴리즈 PR을 합칠 때 발생하는 일반 push에서 release-please를 다시 실행한다. 별도 배포 워크플로가 Release 이벤트에 의존한다면 GitHub App 토큰이나 PAT 구성 여부를 별도로 결정해야 한다.

## 현재 판단

shout-outz의 [v1.9.0 릴리즈](https://github.com/woowacourse-teams/2026-shout-outz/releases/tag/v1.9.0)는 `## What's Changed` 아래 PR 제목·작성자·PR URL을 나열하고, 마지막에 `Full Changelog` 비교 링크를 둔다. [release-please의 GitHub 체인지로그 구현](https://github.com/googleapis/release-please/blob/main/src/changelog-notes/github.ts)은 GitHub 생성 노트 API를 호출하므로 이 형식을 별도 포매터 없이 먼저 시험할 수 있다.

리로그 [production 커밋 기록](https://github.com/woowacourse-teams/2026-rilog/commits/production/)에는 PR 제목 기반 `[Feature]`, `[Hotfix]` 커밋과 `feature:`, `fix:`, merge 커밋이 함께 있다. `feature:`와 `[Feature]`는 `feat:`와 다르다. 따라서 노트 형식과 별개로 버전 계산·릴리즈 PR 생성 여부를 검증해야 한다. 가장 작은 변경은 squash 커밋 제목을 `feat:`·`fix:`로 맞추는 것이다. 기존 제목을 그대로 유지해야 한다면 커밋 메시지 변환이나 별도 버전 결정 로직이 필요하다. 실제 적용 선택은 실험 결과를 보고 한다.

실험에 사용할 구체적인 커밋 사례와 예상 차이는 [커밋 사례](docs/commit-cases.md)에 정리했다.

연결 대상 레포는 처음 확인했을 때 비공개 상태여서 404로 응답했다. 접근이 열린 뒤 확인한 `main` 저장소는 파일·커밋·릴리즈가 없는 빈 레포였다. 실제 워크플로 결과는 [실험 기록](docs/experiment-log.md)에 추가한다.

## 근거

- [release-please README](https://github.com/googleapis/release-please): Release PR, Conventional Commit, 릴리즈 절차
- [release-please-action README](https://github.com/googleapis/release-please-action): Action 설정, 출력값, `GITHUB_TOKEN` 이벤트 제한
- [release-please customizing](https://github.com/googleapis/release-please/blob/main/docs/customizing.md): `default`와 `github` 체인지로그 유형
- [shout-outz 릴리즈 워크플로](https://github.com/woowacourse-teams/2026-shout-outz/blob/main/.github/workflows/release-tag.yml): `gh release create --generate-notes` 사용
