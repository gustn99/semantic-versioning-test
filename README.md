# 리로그 릴리즈 노트 실험

`main`에 PR이 병합되면 PR 제목으로 다음 SemVer를 계산하고 태그와 GitHub Release를 바로 만든다. 리로그 `production`에 적용할 때는 워크플로의 대상 브랜치만 바꾸면 된다.

release-please 실험 결과, PR마다 즉시 릴리즈하는 정책에서는 Release PR과 `CHANGELOG.md` 커밋이 같은 내용을 중복 관리했다. 현재 구성은 GitHub Releases를 릴리즈 기록으로 사용하며 별도의 버전 파일이나 릴리즈 커밋을 만들지 않는다. 이전 release-please 비교 결과는 [실험 기록](docs/experiment-log.md)에 남겨 두었다.

## 동작

1. `main` 대상 PR이 실제로 병합됐을 때만 워크플로가 실행된다.
2. PR 제목의 작업 종류와 `!`를 읽어 최신 `v*` 태그에서 다음 버전을 계산한다.
3. 병합 SHA에 태그와 GitHub Release를 만들고 GitHub 자동 생성 노트를 사용한다.
4. `.github/release.yml`이 PR을 `핵심 변경`과 `기타 변경`으로 분류한다.
5. 후처리 스크립트가 릴리즈 시각을 KST 일반 본문으로 넣고 불필요한 바깥 헤딩을 제거한다.

릴리즈 PR, `CHANGELOG.md`, manifest, 버전 갱신 커밋은 만들지 않는다. 릴리즈가 가리키는 커밋은 병합된 제품 PR의 squash merge SHA다.

## 버전 규칙

브래킷 형식과 커밋 제목 형식을 모두 읽는다. 타입은 대소문자를 구분하지 않는다.

| PR 제목 | 버전 변경 |
| --- | --- |
| `[Feature!] #123 공개 API 변경` | major |
| `Feature!: 공개 API 변경` | major |
| `[Feature] #123 기능 추가` | minor |
| `feat: 기능 추가` | minor |
| `[Fix]`, `[Hotfix]`, `fix:`, 그 밖의 타입 | patch |

저장소에 SemVer 태그가 하나도 없으면 작업 종류와 관계없이 `v0.1.0`을 만든다. 형식을 읽을 수 없는 PR 제목은 릴리즈하지 않고 워크플로를 실패시킨다.

## 릴리즈 노트

`.github/release.yml`의 `release/core` 라벨이 붙은 PR은 `핵심 변경`에 들어간다. 나머지 PR은 `*` 규칙으로 `기타 변경`에 들어가므로 별도의 misc 라벨은 필요하지 않다.

최종 본문은 다음 형식을 사용한다.

```md
릴리즈 시각: 2026-10-29 14:02:08 KST

## 핵심 변경
* [Feature] #123 기능 추가 by @author in #124

## 기타 변경
* [Fix] #125 오류 수정 by @author in #126

**Full Changelog**: v1.0.0...v1.1.0
```

GitHub가 PR 제목, 작성자, PR 링크, 기여자와 `Full Changelog`를 생성한다. `scripts/update-release-notes.cjs`는 날짜·시각과 헤딩만 조정한다.

## 운영상 주의점

동시에 여러 PR이 병합돼 같은 최신 태그를 읽는 문제를 막기 위해 `release-tag` concurrency group을 직렬로 실행한다.

기본 `GITHUB_TOKEN`으로 만든 태그와 Release는 다른 GitHub Actions 워크플로를 실행하지 않는다. 별도 배포 워크플로가 `release.created` 또는 태그 push 이벤트를 받아야 한다면 GitHub App 토큰이나 PAT를 사용해야 한다.

배포된 코드를 추적하려면 애플리케이션 로그나 상태 API에 태그와 Git SHA를 기록한다. GitHub Release는 변경 범위를 찾는 색인이고, 실제 원인 분석에는 해당 태그의 코드 diff가 필요하다.

## 파일

- `.github/workflows/release-tag.yml`: 버전 계산, 태그와 Release 생성
- `.github/release.yml`: 라벨 기반 릴리즈 노트 분류
- `scripts/update-release-notes.cjs`: KST 시각과 헤딩 후처리
- `scripts/update-release-notes.test.cjs`: 릴리즈 노트 후처리 테스트
- `docs/experiment-log.md`: release-please와 GitHub 생성 노트 비교 기록

## 근거

- [Shout-outz 릴리즈 워크플로](https://github.com/woowacourse-teams/2026-shout-outz/blob/develop/.github/workflows/release-tag.yml)
- [GitHub 자동 생성 릴리즈 노트](https://docs.github.com/repositories/releasing-projects-on-github/automatically-generated-release-notes)
- [GitHub Actions의 `GITHUB_TOKEN` 이벤트 제한](https://docs.github.com/actions/using-workflows/triggering-a-workflow#triggering-a-workflow-from-a-workflow)
