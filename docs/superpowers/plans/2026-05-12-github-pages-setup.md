# GitHub Pages 배포 준비 메모 (water-glass-xylophone)

- 목표: `main` push 자동 배포로 정적 빌드 아티팩트(`dist`)를 GitHub Pages에 반영
- Vite 설정: `base: '/water-glass-xylophone/'` 추가 (프로젝트 경로 배포 대응)
- 워크플로: `.github/workflows/deploy-pages.yml` 새로 생성
  - 트리거: `push` on `main`, `workflow_dispatch`
  - 동작: `npm ci` → `npm run build` → `actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages`
  - 연속 push 시 Pages 배포 순서를 안정적으로 유지하기 위해 `concurrency` 설정 포함
- 저장소 설정: Settings → Pages → Source를 `GitHub Actions`로 설정해야 함
- README: 공개 배포 섹션 및 예상 URL 형식 추가
