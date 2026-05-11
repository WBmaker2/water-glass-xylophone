import './App.css'

export default function App() {
  return (
    <main className="app-shell">
      <section className="lab-stage" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">3~4학년 과학 / 음악</p>
          <h1 id="app-title">찰랑찰랑 디지털 물컵 실로폰</h1>
          <p className="intro">
            물의 양을 바꾸며 소리의 높낮이를 비교하고, 직접 컵을 조율해 음계를
            연주해 보세요.
          </p>
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          실험 준비가 되었습니다.
        </p>
      </section>
    </main>
  )
}
