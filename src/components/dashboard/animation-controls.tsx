import { Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

const MAX_SPEED_RANGE = 320
const SPEED_SLOW_THRESHOLD = 50
const SPEED_NORMAL_THRESHOLD = 150
const SLIDER_MIN = 20
const SLIDER_MAX = 300
const SLIDER_STEP = 10

type AnimationControlsProps = {
  isPlaying: boolean
  progress: number
  currentIndex: number
  totalPoints: number
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  speed: number
  onSpeedChange: (speed: number) => void
}

export function AnimationControls({
  isPlaying,
  progress,
  currentIndex,
  totalPoints,
  onPlay,
  onPause,
  onReset,
  speed,
  onSpeedChange,
}: AnimationControlsProps) {
  const invertedSpeed = MAX_SPEED_RANGE - speed

  const getSpeedLabel = () => {
    if (invertedSpeed <= SPEED_SLOW_THRESHOLD) {
      return 'Lenta'
    }
    if (invertedSpeed <= SPEED_NORMAL_THRESHOLD) {
      return 'Normal'
    }
    return 'Rápida'
  }
  const speedLabel = getSpeedLabel()

  return (
    <div className="space-y-3 rounded-lg border bg-card p-3">
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {isPlaying ? (
            <Button onClick={onPause} size="icon" variant="outline">
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={onPlay} size="icon">
              <Play className="h-4 w-4" />
            </Button>
          )}

          <Button onClick={onReset} size="icon" variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 items-center gap-2">
          <span className="text-muted-foreground text-xs">Velocidade:</span>
          <Slider
            className="flex-1"
            disabled={isPlaying}
            max={SLIDER_MAX}
            min={SLIDER_MIN}
            onValueChange={([value]) => onSpeedChange(MAX_SPEED_RANGE - value)}
            step={SLIDER_STEP}
            value={[invertedSpeed]}
          />
          <span className="min-w-[3.5rem] text-xs">{speedLabel}</span>
        </div>

        <span className="text-muted-foreground text-xs">
          {currentIndex + 1} / {totalPoints}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
