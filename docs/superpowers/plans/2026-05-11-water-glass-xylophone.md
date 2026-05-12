# Water Glass Xylophone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 3~4학년 과학/음악 융합 수업에서 물의 양과 소리 높낮이의 관계를 실험하고, 물컵을 튜닝해 간단한 음계와 멜로디를 연주하는 웹앱을 만듭니다.

**Architecture:** 빈 디렉터리에서 Vite + React + TypeScript 앱을 만들고, `waterLevel -> frequency` 계산은 순수 함수로 분리해 먼저 테스트합니다. Web Audio API는 훅으로 감싸고, 컵 조작 UI는 포인터/키보드/스크린리더가 모두 같은 상태를 바꾸도록 설계합니다.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, Playwright, Web Audio API, CSS

---

## Current Context

- Working directory: `/Users/kimhongnyeon/Dev/codex/water-glass-xylophone`
- Current state: empty directory, not a Git repository yet
- User-facing language: Korean 존댓말, classroom-specific copy
- Subagent note: if the user later chooses subagent-driven execution, AGENTS.md asks worker subagents to use `GPT-5.3-Codex-Spark` when tokens are available; orchestrator/review stays on the main model.

## File Structure

- Create `package.json`: scripts for dev/test/build/preview/e2e
- Create `index.html`: Vite entry
- Create `src/main.tsx`: React mount
- Create `src/App.tsx`: app-level state, layout, mission flow, status messages
- Create `src/App.css`: responsive classroom UI, glass/water visuals, no landing page
- Create `src/lib/waterTone.ts`: pure sound physics helpers and note/tuning data
- Create `src/lib/waterTone.test.ts`: unit tests for water/frequency mapping
- Create `src/hooks/useWaterGlassAudio.ts`: Web Audio tone playback hook
- Create `src/components/GlassCup.tsx`: one interactive cup with pointer, keyboard, and strike behavior
- Create `src/components/GlassCup.test.tsx`: interaction and accessibility tests
- Create `src/components/TuningMission.tsx`: 도레미파솔라시도 tuning checklist and feedback
- Create `src/components/MelodyPractice.tsx`: note-sequence practice panel
- Create `src/data/songs.ts`: short note-only classroom melody patterns
- Create `src/test/setup.ts`: test environment setup
- Create `tests/water-glass-xylophone.spec.ts`: browser smoke and responsive checks
- Create `playwright.config.ts`: local preview E2E configuration
- Create `README.md`: teacher-facing usage, science principle, local commands

---

### Task 1: Project Scaffold and Baseline Test

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.css`
- Create: `src/test/setup.ts`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Initialize Git**

Run:

```bash
git init
```

Expected: a new `.git` directory is created.

- [ ] **Step 2: Create the Vite React TypeScript scaffold**

Run:

```bash
npm create vite@latest . -- --template react-ts
```

Expected: Vite writes React + TypeScript starter files into the current empty directory.

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: `node_modules/` and `package-lock.json` are created.

- [ ] **Step 4: Install test and browser verification dependencies**

Run:

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @playwright/test
```

Expected: test dependencies are added to `devDependencies`.

- [ ] **Step 5: Update `package.json` scripts**

Set the scripts to:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest",
    "test:run": "vitest run",
    "e2e": "playwright test"
  }
}
```

- [ ] **Step 6: Configure Vitest in `vite.config.ts`**

Use:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

- [ ] **Step 7: Add test setup in `src/test/setup.ts`**

Use:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 8: Replace starter app with a classroom app shell**

Use this temporary `src/App.tsx`:

```tsx
import './App.css';

export default function App() {
  return (
    <main className="app-shell">
      <section className="lab-stage" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">3~4학년 과학 / 음악</p>
          <h1 id="app-title">찰랑찰랑 디지털 물컵 실로폰</h1>
          <p className="intro">
            물의 양을 바꾸며 소리의 높낮이를 비교하고, 직접 컵을 조율해 음계를 연주해 보세요.
          </p>
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          실험 준비가 되었습니다.
        </p>
      </section>
    </main>
  );
}
```

- [ ] **Step 9: Add baseline styles in `src/App.css`**

Use:

```css
:root {
  color: #172026;
  background: #f7fbff;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
}

button,
input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(208, 236, 255, 0.72), rgba(247, 251, 255, 0.88) 48%),
    #f7fbff;
}

.lab-stage {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0;
}

.eyebrow {
  margin: 0 0 8px;
  color: #315f75;
  font-size: 0.9rem;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.05;
}

.intro {
  max-width: 680px;
  color: #3e5360;
  font-size: 1.05rem;
  line-height: 1.65;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 10: Add smoke test in `src/App.test.tsx`**

Use:

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('shows the classroom water glass xylophone shell', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '찰랑찰랑 디지털 물컵 실로폰' })).toBeInTheDocument();
    expect(screen.getByText('3~4학년 과학 / 음악')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('실험 준비가 되었습니다.');
  });
});
```

- [ ] **Step 11: Verify baseline**

Run:

```bash
npm run test:run
```

Expected: `src/App.test.tsx` passes.

- [ ] **Step 12: Commit**

Run:

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts src/main.tsx src/App.tsx src/App.css src/test/setup.ts src/App.test.tsx
git commit -m "chore: scaffold water glass xylophone app"
```

Expected: one initial scaffold commit.

---

### Task 2: Water Level and Pitch Model

**Files:**
- Create: `src/lib/waterTone.ts`
- Create: `src/lib/waterTone.test.ts`

- [ ] **Step 1: Write failing tests for the science model**

Create `src/lib/waterTone.test.ts`:

```ts
import {
  GLASS_NOTES,
  clampWaterLevel,
  frequencyForWaterLevel,
  getNearestGlassNote,
  getTuningDifference,
  waterLevelForFrequency,
} from './waterTone';

describe('waterTone', () => {
  it('maps less water to a higher sound and more water to a lower sound', () => {
    const nearlyEmpty = frequencyForWaterLevel(0.1);
    const halfFull = frequencyForWaterLevel(0.5);
    const veryFull = frequencyForWaterLevel(0.9);

    expect(nearlyEmpty).toBeGreaterThan(halfFull);
    expect(halfFull).toBeGreaterThan(veryFull);
  });

  it('keeps water levels inside the cup', () => {
    expect(clampWaterLevel(-0.2)).toBe(0);
    expect(clampWaterLevel(0.42)).toBe(0.42);
    expect(clampWaterLevel(1.3)).toBe(1);
  });

  it('calculates target water levels for a one-octave scale', () => {
    expect(GLASS_NOTES).toHaveLength(8);
    expect(GLASS_NOTES[0]).toMatchObject({ solfege: '도', frequency: 261.63 });
    expect(GLASS_NOTES[7]).toMatchObject({ solfege: '높은 도', frequency: 523.25 });
    expect(GLASS_NOTES[0].targetWaterLevel).toBeGreaterThan(GLASS_NOTES[7].targetWaterLevel);
  });

  it('round-trips frequency and water level with small tolerance', () => {
    const waterLevel = waterLevelForFrequency(392);
    const frequency = frequencyForWaterLevel(waterLevel);

    expect(frequency).toBeCloseTo(392, 0);
  });

  it('finds the nearest note and tuning difference', () => {
    const nearest = getNearestGlassNote(391.5);
    const diff = getTuningDifference(391.5, nearest.frequency);

    expect(nearest.solfege).toBe('솔');
    expect(Math.abs(diff.cents)).toBeLessThan(3);
    expect(diff.label).toBe('잘 맞았습니다');
  });
});
```

- [ ] **Step 2: Run the failing tests**

Run:

```bash
npm run test:run -- src/lib/waterTone.test.ts
```

Expected: FAIL because `src/lib/waterTone.ts` does not exist.

- [ ] **Step 3: Implement the model in `src/lib/waterTone.ts`**

Use:

```ts
export type GlassNote = {
  id: string;
  solfege: string;
  western: string;
  frequency: number;
  targetWaterLevel: number;
};

export type TuningDifference = {
  cents: number;
  label: '조금 높습니다' | '조금 낮습니다' | '잘 맞았습니다';
};

export const LOWEST_FREQUENCY = 261.63;
export const HIGHEST_FREQUENCY = 523.25;

const noteSeeds = [
  ['c4', '도', 'C4', 261.63],
  ['d4', '레', 'D4', 293.66],
  ['e4', '미', 'E4', 329.63],
  ['f4', '파', 'F4', 349.23],
  ['g4', '솔', 'G4', 392.0],
  ['a4', '라', 'A4', 440.0],
  ['b4', '시', 'B4', 493.88],
  ['c5', '높은 도', 'C5', 523.25],
] as const;

export function clampWaterLevel(level: number): number {
  if (Number.isNaN(level)) return 0;
  return Math.min(1, Math.max(0, level));
}

export function frequencyForWaterLevel(level: number): number {
  const waterLevel = clampWaterLevel(level);
  return HIGHEST_FREQUENCY * (LOWEST_FREQUENCY / HIGHEST_FREQUENCY) ** waterLevel;
}

export function waterLevelForFrequency(frequency: number): number {
  const safeFrequency = Math.min(HIGHEST_FREQUENCY, Math.max(LOWEST_FREQUENCY, frequency));
  return clampWaterLevel(Math.log(safeFrequency / HIGHEST_FREQUENCY) / Math.log(LOWEST_FREQUENCY / HIGHEST_FREQUENCY));
}

export const GLASS_NOTES: GlassNote[] = noteSeeds.map(([id, solfege, western, frequency]) => ({
  id,
  solfege,
  western,
  frequency,
  targetWaterLevel: waterLevelForFrequency(frequency),
}));

export function getNearestGlassNote(frequency: number): GlassNote {
  return GLASS_NOTES.reduce((nearest, note) => {
    const currentGap = Math.abs(note.frequency - frequency);
    const nearestGap = Math.abs(nearest.frequency - frequency);
    return currentGap < nearestGap ? note : nearest;
  }, GLASS_NOTES[0]);
}

export function getTuningDifference(frequency: number, targetFrequency: number): TuningDifference {
  const cents = 1200 * Math.log2(frequency / targetFrequency);

  if (Math.abs(cents) <= 12) {
    return { cents, label: '잘 맞았습니다' };
  }

  return {
    cents,
    label: cents > 0 ? '조금 높습니다' : '조금 낮습니다',
  };
}

export function formatFrequency(frequency: number): string {
  return `${Math.round(frequency)}Hz`;
}
```

- [ ] **Step 4: Verify the model**

Run:

```bash
npm run test:run -- src/lib/waterTone.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/lib/waterTone.ts src/lib/waterTone.test.ts
git commit -m "feat: model water level pitch relationship"
```

Expected: commit with tested science model.

---

### Task 3: Web Audio Playback Hook

**Files:**
- Create: `src/hooks/useWaterGlassAudio.ts`
- Modify: `src/test/setup.ts`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Extend the test setup with an AudioContext mock**

Add this to `src/test/setup.ts` after the jest-dom import:

```ts
class MockAudioParam {
  value = 0;

  setValueAtTime(value: number) {
    this.value = value;
  }

  exponentialRampToValueAtTime(value: number) {
    this.value = value;
  }
}

class MockOscillatorNode {
  frequency = new MockAudioParam();
  type = 'sine';
  connect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
}

class MockGainNode {
  gain = new MockAudioParam();
  connect = vi.fn();
}

class MockAudioContext {
  currentTime = 0;
  destination = {};
  createOscillator = vi.fn(() => new MockOscillatorNode());
  createGain = vi.fn(() => new MockGainNode());
  resume = vi.fn();
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: MockAudioContext,
});
```

- [ ] **Step 2: Create `src/hooks/useWaterGlassAudio.ts`**

Use:

```ts
import { useCallback, useRef } from 'react';

export type PlayToneOptions = {
  frequency: number;
  duration?: number;
};

export function useWaterGlassAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    ({ frequency, duration = 0.72 }: PlayToneOptions) => {
      const context = getAudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;

      void context.resume();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.42, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.04);
    },
    [getAudioContext],
  );

  return { playTone };
}
```

- [ ] **Step 3: Add a status-level smoke test**

Keep `src/App.test.tsx` passing from Task 1. No direct Web Audio behavior is asserted yet; the hook is exercised after `GlassCup` integration in Task 4.

- [ ] **Step 4: Verify tests**

Run:

```bash
npm run test:run
```

Expected: all current tests pass with the AudioContext mock loaded.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/hooks/useWaterGlassAudio.ts src/test/setup.ts src/App.test.tsx
git commit -m "feat: add water glass audio playback hook"
```

Expected: commit with Web Audio hook and test setup.

---

### Task 4: Interactive Glass Cup Component

**Files:**
- Create: `src/components/GlassCup.tsx`
- Create: `src/components/GlassCup.test.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Write failing tests for cup interaction**

Create `src/components/GlassCup.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { GlassCup } from './GlassCup';
import { GLASS_NOTES } from '../lib/waterTone';

describe('GlassCup', () => {
  it('renders a cup as an accessible slider and strike button', () => {
    render(
      <GlassCup
        note={GLASS_NOTES[0]}
        waterLevel={0.8}
        isTargetMatched={false}
        onWaterLevelChange={vi.fn()}
        onStrike={vi.fn()}
      />,
    );

    expect(screen.getByRole('slider', { name: '도 물 높이' })).toHaveAttribute('aria-valuenow', '80');
    expect(screen.getByRole('button', { name: '도 컵 치기' })).toBeInTheDocument();
  });

  it('changes water level with keyboard arrows', async () => {
    const user = userEvent.setup();
    const onWaterLevelChange = vi.fn();

    render(
      <GlassCup
        note={GLASS_NOTES[2]}
        waterLevel={0.5}
        isTargetMatched={false}
        onWaterLevelChange={onWaterLevelChange}
        onStrike={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('slider', { name: '미 물 높이' }));
    await user.keyboard('{ArrowUp}');

    expect(onWaterLevelChange).toHaveBeenCalledWith(0.55);
  });

  it('strikes the cup when the button is pressed', async () => {
    const user = userEvent.setup();
    const onStrike = vi.fn();

    render(
      <GlassCup
        note={GLASS_NOTES[4]}
        waterLevel={0.3}
        isTargetMatched
        onWaterLevelChange={vi.fn()}
        onStrike={onStrike}
      />,
    );

    await user.click(screen.getByRole('button', { name: '솔 컵 치기' }));

    expect(onStrike).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run failing component tests**

Run:

```bash
npm run test:run -- src/components/GlassCup.test.tsx
```

Expected: FAIL because `GlassCup` does not exist.

- [ ] **Step 3: Implement `src/components/GlassCup.tsx`**

Use:

```tsx
import { clampWaterLevel, formatFrequency, frequencyForWaterLevel, type GlassNote } from '../lib/waterTone';

type GlassCupProps = {
  note: GlassNote;
  waterLevel: number;
  isTargetMatched: boolean;
  onWaterLevelChange: (nextLevel: number) => void;
  onStrike: () => void;
};

const KEYBOARD_STEP = 0.05;

export function GlassCup({
  note,
  waterLevel,
  isTargetMatched,
  onWaterLevelChange,
  onStrike,
}: GlassCupProps) {
  const waterPercent = Math.round(waterLevel * 100);
  const frequency = frequencyForWaterLevel(waterLevel);

  function updateFromPointer(clientY: number, element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const nextLevel = clampWaterLevel((rect.bottom - clientY) / rect.height);
    onWaterLevelChange(Number(nextLevel.toFixed(2)));
  }

  return (
    <article className={`glass-cup ${isTargetMatched ? 'glass-cup--matched' : ''}`}>
      <button className="strike-pad" type="button" onClick={onStrike} aria-label={`${note.solfege} 컵 치기`}>
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
        aria-valuetext={`물 ${waterPercent}퍼센트, ${formatFrequency(frequency)}`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateFromPointer(event.clientY, event.currentTarget);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            updateFromPointer(event.clientY, event.currentTarget);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            onWaterLevelChange(Number(clampWaterLevel(waterLevel + KEYBOARD_STEP).toFixed(2)));
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            onWaterLevelChange(Number(clampWaterLevel(waterLevel - KEYBOARD_STEP).toFixed(2)));
          }
        }}
      >
        <div className="water-fill" style={{ height: `${waterPercent}%` }} />
        <div className="glass-shine" />
      </div>
      <div className="cup-label">
        <strong>{note.solfege}</strong>
        <span>{note.western}</span>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Add component styles to `src/App.css`**

Append:

```css
.glass-cup {
  display: grid;
  justify-items: center;
  gap: 8px;
  min-width: 88px;
}

.strike-pad {
  width: 42px;
  height: 42px;
  border: 1px solid #9cb4c1;
  border-radius: 999px;
  background: #fffdf5;
  color: #33414a;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(45, 77, 96, 0.12);
}

.strike-pad:focus-visible,
.glass-body:focus-visible {
  outline: 3px solid #f6b73c;
  outline-offset: 3px;
}

.glass-body {
  position: relative;
  width: clamp(64px, 8vw, 92px);
  height: clamp(180px, 26vw, 260px);
  overflow: hidden;
  border: 3px solid rgba(121, 155, 171, 0.72);
  border-top-color: rgba(156, 190, 206, 0.62);
  border-radius: 14px 14px 28px 28px;
  background: rgba(255, 255, 255, 0.56);
  cursor: ns-resize;
  touch-action: none;
  box-shadow: inset 0 0 18px rgba(255, 255, 255, 0.85), 0 14px 26px rgba(54, 86, 103, 0.14);
}

.water-fill {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(180deg, rgba(105, 196, 235, 0.92), rgba(36, 132, 202, 0.94));
  transition: height 120ms ease;
}

.glass-shine {
  position: absolute;
  top: 12px;
  left: 14px;
  width: 14px;
  height: 78%;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.42);
}

.cup-label {
  display: grid;
  gap: 2px;
  min-height: 48px;
  text-align: center;
}

.cup-label strong {
  font-size: 1rem;
}

.cup-label span {
  color: #526b78;
  font-size: 0.8rem;
}

.glass-cup--matched .glass-body {
  border-color: #2d9a63;
  box-shadow: inset 0 0 18px rgba(255, 255, 255, 0.85), 0 0 0 4px rgba(45, 154, 99, 0.16);
}
```

- [ ] **Step 5: Verify component tests**

Run:

```bash
npm run test:run -- src/components/GlassCup.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/components/GlassCup.tsx src/components/GlassCup.test.tsx src/App.css
git commit -m "feat: add interactive glass cup controls"
```

Expected: commit with accessible cup controls.

---

### Task 5: Tuning Mission and Melody Practice

**Files:**
- Create: `src/data/songs.ts`
- Create: `src/components/TuningMission.tsx`
- Create: `src/components/MelodyPractice.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/App.css`

- [ ] **Step 1: Add app-level tests for tuning and melody**

Replace `src/App.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('shows the water glass xylophone lab with eight cups', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '찰랑찰랑 디지털 물컵 실로폰' })).toBeInTheDocument();
    expect(screen.getAllByRole('slider', { name: /물 높이/ })).toHaveLength(8);
    expect(screen.getByRole('heading', { name: '도레미 튜닝 미션' })).toBeInTheDocument();
  });

  it('plays a cup and announces the science observation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '도 컵 치기' }));

    expect(screen.getByRole('status')).toHaveTextContent('도 컵을 쳤습니다');
    expect(screen.getByRole('status')).toHaveTextContent('물이 많을수록 낮은 소리');
  });

  it('shows a melody practice sequence', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '연주 미션' })).toBeInTheDocument();
    expect(screen.getByText('도 도 솔 솔 라 라 솔')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run failing app tests**

Run:

```bash
npm run test:run -- src/App.test.tsx
```

Expected: FAIL because app-level cup and mission UI is not integrated yet.

- [ ] **Step 3: Create `src/data/songs.ts`**

Use:

```ts
export type PracticeSong = {
  id: string;
  title: string;
  description: string;
  notes: string[];
};

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
];
```

- [ ] **Step 4: Create `src/components/TuningMission.tsx`**

Use:

```tsx
import { GLASS_NOTES, getTuningDifference, frequencyForWaterLevel } from '../lib/waterTone';

type TuningMissionProps = {
  waterLevels: number[];
};

export function TuningMission({ waterLevels }: TuningMissionProps) {
  const rows = GLASS_NOTES.map((note, index) => {
    const frequency = frequencyForWaterLevel(waterLevels[index]);
    const difference = getTuningDifference(frequency, note.frequency);

    return {
      note,
      difference,
      isMatched: Math.abs(difference.cents) <= 12,
    };
  });

  const matchedCount = rows.filter((row) => row.isMatched).length;

  return (
    <section className="mission-panel" aria-labelledby="tuning-title">
      <h2 id="tuning-title">도레미 튜닝 미션</h2>
      <p className="mission-summary">목표 음에 가까운 컵: {matchedCount}/8</p>
      <ol className="tuning-list">
        {rows.map(({ note, difference, isMatched }) => (
          <li key={note.id} className={isMatched ? 'is-matched' : ''}>
            <span>{note.solfege}</span>
            <strong>{difference.label}</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 5: Create `src/components/MelodyPractice.tsx`**

Use:

```tsx
import { PRACTICE_SONGS } from '../data/songs';

export function MelodyPractice() {
  const song = PRACTICE_SONGS[0];

  return (
    <section className="mission-panel melody-panel" aria-labelledby="melody-title">
      <h2 id="melody-title">연주 미션</h2>
      <p className="song-title">{song.title}</p>
      <p>{song.description}</p>
      <div className="note-sequence" aria-label={`${song.title} 계이름`}>
        {song.notes.join(' ')}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Integrate the full app in `src/App.tsx`**

Use:

```tsx
import { useMemo, useState } from 'react';
import './App.css';
import { GlassCup } from './components/GlassCup';
import { MelodyPractice } from './components/MelodyPractice';
import { TuningMission } from './components/TuningMission';
import { useWaterGlassAudio } from './hooks/useWaterGlassAudio';
import { GLASS_NOTES, formatFrequency, frequencyForWaterLevel, getTuningDifference } from './lib/waterTone';

export default function App() {
  const [waterLevels, setWaterLevels] = useState(() => GLASS_NOTES.map((note) => note.targetWaterLevel));
  const [status, setStatus] = useState('실험 준비가 되었습니다.');
  const { playTone } = useWaterGlassAudio();

  const matchedNotes = useMemo(
    () =>
      GLASS_NOTES.map((note, index) => {
        const frequency = frequencyForWaterLevel(waterLevels[index]);
        return Math.abs(getTuningDifference(frequency, note.frequency).cents) <= 12;
      }),
    [waterLevels],
  );

  function updateWaterLevel(index: number, nextLevel: number) {
    setWaterLevels((current) => current.map((level, itemIndex) => (itemIndex === index ? nextLevel : level)));
  }

  function strikeCup(index: number) {
    const note = GLASS_NOTES[index];
    const frequency = frequencyForWaterLevel(waterLevels[index]);
    playTone({ frequency });
    setStatus(
      `${note.solfege} 컵을 쳤습니다. 현재 소리는 ${formatFrequency(frequency)}입니다. 물이 많을수록 낮은 소리, 물이 적을수록 높은 소리가 납니다.`,
    );
  }

  return (
    <main className="app-shell">
      <section className="lab-stage" aria-labelledby="app-title">
        <div className="lab-header">
          <div>
            <p className="eyebrow">3~4학년 과학 / 음악</p>
            <h1 id="app-title">찰랑찰랑 디지털 물컵 실로폰</h1>
            <p className="intro">
              컵의 물 높이를 조절하고 컵을 쳐 보며, 물의 양에 따라 달라지는 소리의 높낮이를 비교해 보세요.
            </p>
          </div>
          <button
            className="reset-button"
            type="button"
            onClick={() => {
              setWaterLevels(GLASS_NOTES.map((note) => note.targetWaterLevel));
              setStatus('도레미파솔라시도 목표 물 높이로 다시 맞췄습니다.');
            }}
          >
            음계로 맞추기
          </button>
        </div>

        <div className="experiment-layout">
          <section className="cup-rack" aria-label="물컵 실로폰">
            {GLASS_NOTES.map((note, index) => (
              <GlassCup
                key={note.id}
                note={note}
                waterLevel={waterLevels[index]}
                isTargetMatched={matchedNotes[index]}
                onWaterLevelChange={(nextLevel) => updateWaterLevel(index, nextLevel)}
                onStrike={() => strikeCup(index)}
              />
            ))}
          </section>

          <aside className="side-panel" aria-label="수업 미션">
            <TuningMission waterLevels={waterLevels} />
            <MelodyPractice />
          </aside>
        </div>

        <p role="status" aria-live="polite" className="status-line">
          {status}
        </p>
      </section>
    </main>
  );
}
```

- [ ] **Step 7: Add layout and mission styles to `src/App.css`**

Append:

```css
.lab-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.reset-button {
  flex: 0 0 auto;
  border: 1px solid #27576f;
  border-radius: 8px;
  padding: 12px 16px;
  background: #27576f;
  color: #ffffff;
  cursor: pointer;
}

.experiment-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;
}

.cup-rack {
  display: grid;
  grid-template-columns: repeat(8, minmax(72px, 1fr));
  gap: 12px;
  align-items: end;
  min-width: 0;
  padding: 22px;
  border: 1px solid rgba(107, 142, 158, 0.32);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.62);
}

.side-panel {
  display: grid;
  gap: 16px;
}

.mission-panel {
  border: 1px solid rgba(107, 142, 158, 0.32);
  border-radius: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.72);
}

.mission-panel h2 {
  margin: 0 0 10px;
  font-size: 1.15rem;
}

.mission-summary,
.song-title {
  margin: 0 0 10px;
  font-weight: 700;
}

.tuning-list {
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 20px;
}

.tuning-list li {
  color: #50636e;
}

.tuning-list li.is-matched {
  color: #207549;
}

.tuning-list span {
  display: inline-block;
  min-width: 54px;
  font-weight: 700;
}

.note-sequence {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  color: #102c3a;
  font-size: 1.1rem;
  font-weight: 800;
}

.status-line {
  min-height: 48px;
  margin: 18px 0 0;
  padding: 14px 16px;
  border-left: 5px solid #27576f;
  border-radius: 8px;
  background: #ffffff;
  color: #233943;
  line-height: 1.5;
}

@media (max-width: 920px) {
  .lab-header,
  .experiment-layout {
    grid-template-columns: 1fr;
  }

  .lab-header {
    display: grid;
  }

  .cup-rack {
    overflow-x: auto;
    grid-template-columns: repeat(8, minmax(76px, 1fr));
  }
}

@media (max-width: 560px) {
  .lab-stage {
    width: min(100% - 20px, 1120px);
    padding: 20px 0;
  }

  .cup-rack {
    padding: 14px;
  }

  .glass-cup {
    min-width: 76px;
  }
}
```

- [ ] **Step 8: Verify app tests**

Run:

```bash
npm run test:run
```

Expected: all unit/component tests pass.

- [ ] **Step 9: Commit**

Run:

```bash
git add src/App.tsx src/App.test.tsx src/App.css src/data/songs.ts src/components/TuningMission.tsx src/components/MelodyPractice.tsx
git commit -m "feat: add tuning and melody practice missions"
```

Expected: commit with complete classroom flow.

---

### Task 6: Browser QA, Documentation, and Release Readiness

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/water-glass-xylophone.spec.ts`
- Create: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Install Playwright browsers**

Run:

```bash
npx playwright install chromium
```

Expected: Chromium browser is available for local E2E tests.

- [ ] **Step 2: Create `playwright.config.ts`**

Use:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
```

- [ ] **Step 3: Create browser smoke in `tests/water-glass-xylophone.spec.ts`**

Use:

```ts
import { expect, test } from '@playwright/test';

test('students can tune and strike the water glass xylophone', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: '찰랑찰랑 디지털 물컵 실로폰' })).toBeVisible();
  await expect(page.getByRole('slider', { name: '도 물 높이' })).toBeVisible();

  await page.getByRole('button', { name: '도 컵 치기' }).click();
  await expect(page.getByRole('status')).toContainText('도 컵을 쳤습니다');

  await page.getByRole('slider', { name: '미 물 높이' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('slider', { name: '미 물 높이' })).toHaveAttribute('aria-valuenow', /[0-9]+/);

  await expect(page.getByRole('heading', { name: '연주 미션' })).toBeVisible();
  await expect(page.getByText('도 도 솔 솔 라 라 솔')).toBeVisible();
});

test('layout has no page-level horizontal overflow', async ({ page }) => {
  await page.goto('/');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

  expect(overflow).toBeLessThanOrEqual(1);
});
```

- [ ] **Step 4: Add teacher-facing `README.md`**

Use:

```md
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

## 교실 사용 흐름

1. 학생이 각 컵의 물 높이를 바꿔 봅니다.
2. 컵을 쳐서 현재 소리의 높낮이를 들어봅니다.
3. 도레미 튜닝 미션에서 목표 음과 얼마나 가까운지 확인합니다.
4. 연주 미션의 계이름을 따라 간단한 멜로디를 연주합니다.
```

- [ ] **Step 5: Run full verification**

Run:

```bash
npm run test:run
```

Expected: all Vitest tests pass.

Run:

```bash
npm run build
```

Expected: TypeScript build and Vite production build pass.

Run:

```bash
npm run e2e
```

Expected: Playwright desktop and mobile projects pass.

- [ ] **Step 6: Commit**

Run:

```bash
git add playwright.config.ts tests/water-glass-xylophone.spec.ts README.md package.json package-lock.json
git commit -m "test: add browser QA and teacher documentation"
```

Expected: commit with verification and documentation.

---

## Self-Review

- Spec coverage: 8 transparent cups, water-height adjustment, lower pitch with more water, click-to-strike sound, 도레미 튜닝 mission, simple music practice, and classroom science/music framing are covered.
- Test coverage: pure physics model, app shell, cup keyboard/strike interactions, live status message, browser smoke, and responsive overflow checks are covered.
- Accessibility coverage: `role="slider"`, `aria-valuenow`, `aria-valuetext`, keyboard arrows, strike buttons, and `role="status"` live feedback are covered.
- Scope kept intentionally small: no accounts, saving, uploading, or complex lesson management in the first version.

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-05-11-water-glass-xylophone.md`.

1. **Subagent-Driven (recommended)** - dispatch a fresh worker per task, use `GPT-5.3-Codex-Spark` for worker subagents when available, review between tasks.
2. **Inline Execution** - execute tasks in this session with checkpoints after each task group.

