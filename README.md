# 리로그 릴리즈 노트 실험

`gustn99/semantic-versioning-test`에서 release-please의 기본 체인지로그와 GitHub 생성 체인지로그를 같은 커밋 기록에 적용해 비교한다. 이후 리로그 `production`에 필요한 커스텀 범위를 판단하는 것이 목적이다.

## 구성

- `release-please.default.json`: release-please 기본 체인지로그. Conventional Commit을 종류별로 묶고 관련 PR·커밋 링크를 넣는다.
- `release-please.github.json`: 내장 `changelog-type: github`. GitHub의 릴리즈 노트 생성 API가 PR 제목·작성자·링크와 `Full Changelog` 비교 링크를 만든다.
- `.github/workflows/release-please.yml`: `main`에 push되면 `custom` 모드로 실행한다. Actions의 `Run workflow`에서 `default`, `github`, `custom`을 골라 비교할 수 있다.
- `.github/release.yml`: `release/core` 라벨이 붙은 PR은 `핵심 변경`, 나머지 PR은 `기타 변경`으로 분류한다.
- `scripts/sync-release-please-commit-override.cjs`: 리로그의 `Feature` PR 제목을 release-please가 읽는 Conventional Commit 타입으로 변환한다.
- `scripts/update-release-notes.cjs`: `custom` 모드에서 버전 헤딩을 제거하고 KST 릴리즈 시각을 추가한다.
- `.release-please-manifest.json`: 첫 실행용 빈 버전 매니페스트. 첫 릴리즈 뒤에는 release-please가 버전을 기록한다.

세 모드는 **같은 릴리즈 PR을 갱신**한다. `custom`은 release-please에 `github` 설정을 전달한 뒤, 실제 Release가 생성됐을 때만 본문을 다시 작성한다. release-please가 다음 릴리즈를 찾을 때 사용하는 Release PR 본문과 `CHANGELOG.md`는 수정하지 않는다. 이미 생성된 릴리즈의 본문을 모드 변경만으로 소급 수정하지 않는다.

## 실험 순서

1. 이 폴더의 파일을 실험 레포 루트에 넣는다. GitHub 저장소의 **Settings → Actions → General**에서 Actions가 PR을 만들 수 있게 설정한다. 워크플로의 `GITHUB_TOKEN`에는 `contents`, `issues`, `pull-requests` 쓰기 권한을 지정했다.
2. 리로그의 두 PR 형태를 각각 만든다. 여러 커밋 PR은 이슈를 먼저 만들고 `[Header] #issue-number title` 제목과 merge commit을 쓴다. 커밋 하나인 PR은 커밋 제목을 PR 제목으로 그대로 쓰고 squash merge한다. push 실행 후 열린 release-please PR의 버전, 본문, `CHANGELOG.md`를 [실험 기록](docs/experiment-log.md)에 적는다.
3. Actions에서 **release-please experiment → Run workflow**를 열고 `default`, `github`, `custom`을 각각 실행한다. 갱신된 PR의 본문과 `CHANGELOG.md`를 같은 기록에 적고 형식을 비교한다.
4. 실제 릴리즈를 확인하려면 release-please PR을 합친다. 다음 `main` push 실행에서 태그와 GitHub Release가 생성되었는지 확인한다. 첫 릴리즈는 `commits/v1.0.0`, 이후 릴리즈는 이전 태그와 새 태그의 비교 링크가 나오는지 확인한다.
5. `[Header] #issue-number title (#PR)` merge commit과 `fix: title (#PR)` squash commit이 각각 버전 결정과 노트에 어떻게 반영됐는지 비교한다. GitHub 형식으로 노트만 바꿔도 버전 결정 규칙은 바뀌지 않는다.

`GITHUB_TOKEN`으로 생성한 release-please PR이나 Release는 다른 GitHub Actions 워크플로를 자동으로 다시 실행하지 않는다. 이 실험 워크플로는 릴리즈 PR을 합칠 때 발생하는 일반 push에서 release-please를 다시 실행한다. 별도 배포 워크플로가 Release 이벤트에 의존한다면 GitHub App 토큰이나 PAT 구성 여부를 별도로 결정해야 한다.

## 현재 판단

shout-outz의 [v1.9.0 릴리즈](https://github.com/woowacourse-teams/2026-shout-outz/releases/tag/v1.9.0)는 `## What's Changed` 아래 PR 제목·작성자·PR URL을 나열하고, 마지막에 `Full Changelog` 비교 링크를 둔다. [release-please의 GitHub 체인지로그 구현](https://github.com/googleapis/release-please/blob/main/src/changelog-notes/github.ts)은 GitHub 생성 노트 API를 호출하므로 이 형식을 별도 포매터 없이 먼저 시험할 수 있다.

`changelog-type: github`만으로 [실제 v1.0.0 Release](https://github.com/gustn99/semantic-versioning-test/releases/tag/v1.0.0)에 PR 제목·작성자·링크와 `Full Changelog`가 생성됐다. 리로그의 `[Header] #issue-number title`도 수정 없이 표시됐다.

요청한 최종 형식에는 GitHub 라벨 분류와 작은 후처리가 필요하다. `release/core` 라벨이 붙은 PR은 `핵심 변경`에 들어가고 나머지는 `기타 변경`에 들어간다. `feat`, `fix`, `refactor` 같은 접두어는 변경 종류이고 핵심 여부는 제품 판단이므로 제목 정규식으로 분류하지 않는다.

`custom` 모드는 생성된 Release에서 버전 헤딩과 바깥 `What's Changed` 헤딩을 제거한다. `핵심 변경`과 `기타 변경`을 2단계 헤딩으로 올리고 맨 위에 `릴리즈 시각: YYYY-MM-DD HH:mm:ss KST`를 일반 텍스트로 쓴다.

각 항목의 작성자와 PR 링크, `New Contributors`, 마지막 `Full Changelog`는 유지한다. `New Contributors` 제거는 필요한 결과에 비해 복잡도만 늘리므로 적용하지 않았다. 자세한 입력·출력 예시는 [커스텀 릴리즈 노트](docs/custom-release-notes.md)에 적었다.

release-please 기본 버전 계산 구현은 소문자 `feat:`와 `feature:`를 minor 변경으로 처리한다. `Feature:`는 대소문자가 달라 minor로 판정되지 않고, `[Feature] #이슈 제목`은 Conventional Commit 문법이 아니므로 타입 자체를 찾지 못한다.

이 실험에서는 `main` push 직후 연결된 PR 제목을 읽어 `Feature:`와 `[Feature]`를 `feature:`로 정규화한 `BEGIN_COMMIT_OVERRIDE`를 PR 본문에 추가한다. `[Feature!]`와 `Feature!:`는 `feature!:`로 변환되어 major 변경이 된다. 정규식은 대소문자를 구분하지 않는다. GitHub 생성 릴리즈 노트는 원래 PR 제목을 사용하므로 `[Feature] #이슈 제목` 표시는 유지된다. 작성자가 수동으로 `BEGIN_COMMIT_OVERRIDE`를 넣었다면 자동 변환은 건너뛴다.

현재 구성은 release-please가 버전·태그·Release PR을 담당하고, GitHub가 PR 라벨로 섹션을 만들며, 작은 Node.js 스크립트가 최종 GitHub Release 본문의 날짜·시각만 조정한다. 팀이 내부 커밋을 release-please가 파싱할 수 있는 형식으로 맞추기 어렵다면 `[Feature]`·`[Hotfix]`를 SemVer로 변환하는 전처리나 별도 버전 결정 단계가 추가로 필요하다.

## `release-type: simple`의 의미

`release-type`은 릴리즈 노트 모양이 아니라 **버전을 기록할 파일과 릴리즈 전략**을 고른다. `simple`은 언어·패키지 관리자 전용 파일을 전제로 하지 않고 기본적으로 `CHANGELOG.md`만 갱신한다. `version-file`을 지정하면 별도 버전 파일도 갱신한다. 이 실험 레포처럼 `package.json`, `pyproject.toml`, `pom.xml` 등이 없는 저장소에 맞는다.

프로젝트에 버전 파일이 있다면 해당 생태계 전략을 선택해야 한다. 예를 들어 `node`는 `package.json`, `python`은 Python 패키지 버전 파일, `maven`은 `pom.xml`과 SNAPSHOT 흐름, `rust`는 `Cargo.toml`, `helm`은 `Chart.yaml`을 함께 갱신한다. 그 밖에 `bazel`, `dart`, `elixir`, `expo`, `go`, `java`, `krm-blueprint`, `ocaml`, `php`, `R`, `ruby`, `sfdx`, `terraform-module` 전략이 있다. 지원 목록은 [release-please README의 Strategy types](https://github.com/googleapis/release-please#strategy-language-types-supported)를 기준으로 고른다.

`release-type`과 `changelog-type`은 독립적이다. 지금 설정은 `simple`로 갱신 파일을 정하고 `github`으로 PR 목록 기반 노트를 만든 뒤, `custom` 단계에서 표시 형식만 바꾼다.

실험에 사용할 구체적인 커밋 사례와 예상 차이는 [커밋 사례](docs/commit-cases.md)에 정리했다.

상세 입력과 결과는 [실험 기록](docs/experiment-log.md)과 `docs/results/`에 남겼다.

## 근거

- [release-please README](https://github.com/googleapis/release-please): Release PR, Conventional Commit, 릴리즈 절차
- [release-please-action README](https://github.com/googleapis/release-please-action): Action 설정, 출력값, `GITHUB_TOKEN` 이벤트 제한
- [release-please customizing](https://github.com/googleapis/release-please/blob/main/docs/customizing.md): `default`와 `github` 체인지로그 유형
- [release-please design](https://github.com/googleapis/release-please/blob/main/docs/design.md): `simple` 전략과 Release PR 본문 의존성
- [GitHub 자동 생성 릴리즈 노트](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes): 기여자 목록과 라벨 기반 카테고리 설정
- [shout-outz 릴리즈 워크플로](https://github.com/woowacourse-teams/2026-shout-outz/blob/main/.github/workflows/release-tag.yml): `gh release create --generate-notes` 사용
