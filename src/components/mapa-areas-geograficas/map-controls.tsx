import { Maximize2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type MapControlsProps = {
  onResetView: () => void
  onFitBounds: () => void
  hasRoutes: boolean
}

export function MapControls({
  onResetView,
  onFitBounds,
  hasRoutes,
}: MapControlsProps) {
  return (
    <TooltipProvider>
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-9 w-9 bg-white shadow-md hover:bg-gray-50"
              onClick={onResetView}
              size="icon"
              variant="outline"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Resetar visualização</p>
          </TooltipContent>
        </Tooltip>

        {hasRoutes && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-9 w-9 bg-white shadow-md hover:bg-gray-50"
                onClick={onFitBounds}
                size="icon"
                variant="outline"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Ajustar zoom às rotas</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
