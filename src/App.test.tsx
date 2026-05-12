import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('shows app title, 8 cups, and tuning mission heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: '찰랑찰랑 디지털 물컵 실로폰' }),
    ).toBeInTheDocument()
    const sliders = screen.getAllByRole('slider', { name: /물 높이/ })
    expect(sliders).toHaveLength(8)
    expect(
      screen.getByRole('heading', { name: '도레미 튜닝 미션' }),
    ).toBeInTheDocument()
  })

  it('plays 도 cup and updates status message', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '도 컵 치기' }))

    expect(screen.getByRole('status')).toHaveTextContent('도 컵을 쳤습니다')
    expect(screen.getByRole('status')).toHaveTextContent(
      '물이 많을수록 낮은 소리, 물이 적을수록 높은 소리',
    )
  })

  it('shows melody mission and target note sequence', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '연주 미션' })).toBeInTheDocument()
    expect(screen.getByText('도 도 솔 솔 라 라 솔')).toBeInTheDocument()
  })
})
