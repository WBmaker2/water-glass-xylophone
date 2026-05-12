export type PracticeSong = {
  id: string
  title: string
  description: string
  notes: string[]
}

export const PRACTICE_SONGS: PracticeSong[] = [
  {
    id: 'star-pattern',
    title: '별빛 음계 연습',
    description: '같은 음을 두 번씩 치며 음의 높낮이 차이를 들어봅니다.',
    notes: ['도', '도', '솔', '솔', '라', '라', '솔'],
  },
  {
    id: 'scale-up',
    title: '도레미 올라가기',
    description: '물이 점점 적은 컵으로 이동하며 높은 소리를 확인합니다.',
    notes: ['도', '레', '미', '파', '솔', '라', '시', '높은 도'],
  },
]
