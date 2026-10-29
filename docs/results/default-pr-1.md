# 예비 실험: 기본 모드에서 PR #1 처리

- 실행: https://github.com/gustn99/semantic-versioning-test/actions/runs/40813736157
- 생성된 release-please PR: https://github.com/gustn99/semantic-versioning-test/pull/2
- 제안 버전: `1.0.0`
- 입력 PR: https://github.com/gustn99/semantic-versioning-test/pull/1
- 입력 PR 제목: `[Feature] 릴리즈 노트 테스트 기능 추가`
- squash 커밋 제목: `feat: add release note sample feature (#1)`

release-please PR 본문의 생성 노트:

```md
## 1.0.0 (2026-10-29)

### Features

* add release note sample feature ([#1](https://github.com/gustn99/semantic-versioning-test/issues/1)) ([663941b](https://github.com/gustn99/semantic-versioning-test/commit/663941bfbe50a349222eec57b9e525675e1efee4))
```

`CHANGELOG.md`에도 같은 섹션과 항목이 들어갔다. PR 작성자 이름과 `Full Changelog` 비교 링크는 이 기본 형식에 없었다.

이 PR 제목은 리로그 형식이 아니다. 커밋이 여러 개인 리로그 PR은 `[Header] #issue-number title`이고, 이 제목에는 이슈 번호가 없었다. 최종 커밋도 Conventional Commit으로 바꿨다. 따라서 이 결과는 release-please 기본 형식을 확인한 예비 실험일 뿐이며, 리로그 호환성 판단에는 쓰지 않는다.
