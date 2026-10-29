# 커스텀 릴리즈 노트

`custom` 모드는 release-please의 `github` 체인지로그를 입력으로 사용하고 실제 GitHub Release 본문만 후처리한다. Release PR 본문과 `CHANGELOG.md`는 release-please가 만든 상태로 남긴다.

## 바꾸는 내용

- `## 버전 (날짜)` 헤딩을 제거한다.
- 첫 줄에 `릴리즈 시각: YYYY-MM-DD HH:mm:ss KST`를 일반 본문으로 쓴다.
- `release/core` 라벨이 붙은 PR은 `핵심 변경`, 나머지는 `기타 변경`으로 분류한다.
- 각 PR의 작성자·링크, `New Contributors`, `Full Changelog`는 유지한다.

입력:

```md
## 1.1.0 (2026-10-29)

## 핵심 변경
* [Feature] #10 기능 추가 by @crew-a in https://example.com/10

## 기타 변경
* [Hotfix] #11 장애 수정 by @crew-b in https://example.com/11

## New Contributors
* @crew-a made their first contribution in https://example.com/10

**Full Changelog**: https://example.com/compare/v1.0.0...v1.1.0
```

출력:

```md
릴리즈 시각: 2026-10-29 12:50:35 KST

## 핵심 변경
* [Feature] #10 기능 추가 by @crew-a in https://example.com/10

## 기타 변경
* [Hotfix] #11 장애 수정 by @crew-b in https://example.com/11

## New Contributors
* @crew-a made their first contribution in https://example.com/10

**Full Changelog**: https://example.com/compare/v1.0.0...v1.1.0
```

## 적용 경계

GitHub의 `.github/release.yml`이 PR 라벨을 읽어 섹션을 만든다. 작성자나 리뷰어가 핵심 변경에만 `release/core`를 붙이고, 라벨이 없는 PR은 `*` 규칙으로 기타 변경에 들어간다. 두 라벨 중 하나를 매번 선택하게 만드는 대신 예외인 핵심 변경만 표시한다. `New Contributors`는 GitHub가 만든 내용을 그대로 둔다.

포매터가 실패하면 워크플로도 실패한다. release-please가 만든 태그와 Release 자체는 이미 존재할 수 있으므로, 실패한 실행을 재시도하거나 해당 Release 본문을 확인해야 한다.
