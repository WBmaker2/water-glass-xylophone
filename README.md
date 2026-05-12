# Water Glass Xylophone

3~4학년 과학과 음악을 연결한 교실용 웹앱입니다. 학생은 8개의 디지털 물컵에 담긴 물의 양을 조절하고, 컵을 쳐 보며 소리의 높낮이가 어떻게 달라지는지 관찰합니다.

## 수업 연결

- 과학 [4과07-01]: 소리가 나는 물체를 관찰하고 소리의 세기와 높낮이를 비교합니다.
- 음악 [4음01-02]: 악곡의 특징을 이해하며 간단한 음계를 연주합니다.

## 핵심 원리

이 앱에서는 물이 적을수록 높은 소리, 물이 많을수록 낮은 소리가 나도록 주파수를 연결했습니다. 실제 컵 실험 전에 태블릿이나 전자칠판으로 안전하게 예비 실험을 할 수 있습니다.

## 실행

```bash
npm install
npm run dev
```

## 검증

```bash
npm run test:run
npm run build
npm run e2e
```

## 공개 배포

### 공개 URL
- https://wbmaker2.github.io/water-glass-xylophone/
- GitHub 저장소: https://github.com/WBmaker2/water-glass-xylophone

## 수업 자료

- 교사용 지도안: [docs/classroom-guide.md](docs/classroom-guide.md)
- 학생 활동지: [docs/student-worksheet.md](docs/student-worksheet.md)
- 교사용 빠른 시작 안내: [docs/teacher-quick-start.md](docs/teacher-quick-start.md)
- 학생용 인쇄 활동지: [docs/student-worksheet-print.html](docs/student-worksheet-print.html)
- 학생용 활동지 PDF: [docs/student-worksheet-print.pdf](docs/student-worksheet-print.pdf)
- 공개 URL QR 코드: [docs/assets/water-glass-xylophone-qr.png](docs/assets/water-glass-xylophone-qr.png)

## HVC 등록 상태

- HVC admin DB 등록 완료 (ID: `422f88e0-ac58-42c6-afa4-9d557979eaf8`)
- public static gallery sync는 이번 요청에서 실행하지 않았고, 별도 단계로 진행합니다.

## 교실 사용 흐름

1. 학생이 각 컵의 물 높이를 바꿔 봅니다.
2. 컵을 쳐서 현재 소리의 높낮이를 들어봅니다.
3. 도레미 튜닝 미션에서 목표 음과 얼마나 가까운지 확인합니다.
4. 연주 미션의 계이름을 따라 간단한 멜로디를 연주합니다.
