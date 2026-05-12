import React from 'react'
import {
  clampWaterLevel,
  formatFrequency,
  frequencyForWaterLevel,
  type GlassNote,
} from '../lib/waterTone'

interface GlassCupProps {
  note: GlassNote
  waterLevel: number
  isTargetMatched: boolean
  onWaterLevelChange: (nextLevel: number) => void
  onStrike: () => void
}

function roundToTwoDecimals(value: number): number {
  return Number(clampWaterLevel(value).toFixed(2))
}

export function GlassCup({
  note,
  waterLevel,
  isTargetMatched,
  onWaterLevelChange,
  onStrike,
}: GlassCupProps) {
  const capturedPointerIdRef = React.useRef<number | null>(null)

  const waterPercent = Math.round(clampWaterLevel(waterLevel) * 100)
  const frequency = frequencyForWaterLevel(waterLevel)
  const ariaValueText = `물 ${waterPercent}퍼센트, ${formatFrequency(frequency)}`

  const setLevelFromClientY = React.useCallback(
    (clientY: number, target: HTMLDivElement | null) => {
      if (!target) {
        return
      }
      const rect = target.getBoundingClientRect()
      if (rect.height === 0) {
        return
      }

      const nextLevel = (rect.bottom - clientY) / rect.height
      onWaterLevelChange(roundToTwoDecimals(nextLevel))
    },
    [onWaterLevelChange],
  )

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    capturedPointerIdRef.current = event.pointerId
    target.setPointerCapture(event.pointerId)
    setLevelFromClientY(event.clientY, target)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (capturedPointerIdRef.current !== event.pointerId) {
      return
    }
    setLevelFromClientY(event.clientY, event.currentTarget)
  }

  const handlePointerUpOrCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (capturedPointerIdRef.current !== event.pointerId) {
      return
    }
    capturedPointerIdRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const deltaByKey: Record<string, number> = {
      ArrowUp: 0.05,
      ArrowDown: -0.05,
      PageUp: 0.1,
      PageDown: -0.1,
    }

    if (event.key === 'Home') {
      event.preventDefault()
      onWaterLevelChange(0)
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      onWaterLevelChange(1)
      return
    }

    const delta = deltaByKey[event.key]
    if (delta === undefined) {
      return
    }

    event.preventDefault()
    onWaterLevelChange(roundToTwoDecimals(waterLevel + delta))
  }

  return (
    <article
      className={`glass-cup${isTargetMatched ? ' glass-cup--matched' : ''}`}
    >
      <button
        type="button"
        className="strike-pad"
        aria-label={`${note.solfege} 컵 치기`}
        onClick={onStrike}
      >
        <span aria-hidden="true">♪</span>
      </button>
      <div
        className="glass-body"
        role="slider"
        tabIndex={0}
        aria-label={`${note.solfege} 물 높이`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={waterPercent}
        aria-valuetext={ariaValueText}
        aria-orientation="vertical"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrCancel}
        onPointerCancel={handlePointerUpOrCancel}
        onKeyDown={handleKeyDown}
      >
        <div className="water-fill" style={{ height: `${waterPercent}%` }} />
        <div className="glass-shine" />
      </div>
      <div className="cup-label">
        <strong>{note.solfege}</strong>
        <span>{note.western}</span>
      </div>
    </article>
  )
}

export default GlassCup
