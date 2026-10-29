# 커스텀 릴리즈 노트

`custom` 모드는 release-please의 `github` 체인지로그를 입력으로 사용하고 실제 GitHub Release 본문만 후처리한다. Release PR 본문과 `CHANGELOG.md`는 release-please가 만든 상태로 남긴다.

## 바꾸는 내용

- `## 버전 (날짜)` 헤딩을 제거한다.
- 첫 줄에 `릴리즈 시각: YYYY-MM-DD HH:mm:ss KST`를 일반 본문으로 쓴다.
- PR 제목의 리로그 헤더나 Conventional Commit 접두어에 따라 변경 항목을 분류한다.
- 각 PR의 작성자·링크, `New Contributors`, `Full Changelog`는 유지한다.

입력:

```md
## 1.1.0 (2026-10-29)

## What's Changed
* [Feature] #10 기능 추가 by @crew-a in https://example.com/10
* [Hotfix] #11 장애 수정 by @crew-b in https://example.com/11

## New Contributors
* @crew-a made their first contribution in https://example.com/10

**Full Changelog**: https://example.com/compare/v1.0.0...v1.1.0
```

출력:

```md
릴리즈 시각: 2026-10-29 12:50:35 KST

## 새로운 기능
* [Feature] #10 기능 추가 by @crew-a in https://example.com/10

## 버그 수정
* [Hotfix] #11 장애 수정 by @crew-b in https://example.com/11

## New Contributors
* @crew-a made their first contribution in https://example.com/10

**Full Changelog**: https://example.com/compare/v1.0.0...v1.1.0
```

## 적용 경계

GitHub의 `.github/release.yml`은 라벨로 PR을 분류한다. 리로그는 `[Feature]`, `[Hotfix]` 같은 PR 제목을 사용하므로, 라벨을 추가로 관리하지 않고 제목을 읽어 헤더를 정한다. `New Contributors`는 GitHub가 만든 내용을 그대로 둔다.

포매터가 실패하면 워크플로도 실패한다. release-please가 만든 태그와 Release 자체는 이미 존재할 수 있으므로, 실패한 실행을 재시도하거나 해당 Release 본문을 확인해야 한다.
