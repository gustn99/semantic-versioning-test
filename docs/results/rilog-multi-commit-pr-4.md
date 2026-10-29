# 리로그 형식의 여러 커밋 PR 결과: PR #4

- 이슈: https://github.com/gustn99/semantic-versioning-test/issues/3
- PR: https://github.com/gustn99/semantic-versioning-test/pull/4
- PR 제목: `[Hotfix] #3 여러 커밋 PR의 릴리즈 노트 생성 검증`
- 내부 커밋 수: 2
- 병합 방식: merge commit
- merge commit 제목: `[Hotfix] #3 여러 커밋 PR의 릴리즈 노트 생성 검증 (#4)`
- merge commit SHA: `188d598`
- Action: https://github.com/gustn99/semantic-versioning-test/actions/runs/40814133295
- 갱신된 release-please PR: https://github.com/gustn99/semantic-versioning-test/pull/2

기본 release-please는 merge commit의 바깥 제목을 `fix`나 `feat`로 해석하지 않았다. 대신 merge commit 본문에 들어간 두 Conventional Commit을 읽어 다음 항목을 `Bug Fixes`에 추가했다.

```md
### Bug Fixes

* 여러 커밋 릴리즈 노트 테스트 데이터 추가 ([b79e9ad](https://github.com/gustn99/semantic-versioning-test/commit/b79e9ad1fadec042c357bf0874a9719fc00ad914))
* 잘못된 리로그 PR 제목 사례 정정 ([05eca18](https://github.com/gustn99/semantic-versioning-test/commit/05eca18a2f6397925fba35045960366d192a766d))
```

두 항목에는 개별 커밋 링크가 붙었지만 PR #4 링크와 작성자는 붙지 않았다. 제안 버전은 기존 예비 실험의 `feat:` 때문에 계속 `1.0.0`이었다. 이 실행만으로 `[Hotfix]`가 patch를 선택했다고 판단할 수 없다.
