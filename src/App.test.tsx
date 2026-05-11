import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('shows the classroom water glass xylophone shell', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: '찰랑찰랑 디지털 물컵 실로폰' }),
    ).toBeInTheDocument()
    expect(screen.getByText('3~4학년 과학 / 음악')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('실험 준비가 되었습니다.')
  })
})
