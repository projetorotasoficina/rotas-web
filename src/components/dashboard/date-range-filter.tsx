import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type DateRangeFilterProps = {
  dateRange?: DateRange
  onDateRangeChange: (range: DateRange | undefined) => void
  className?: string
}

export function DateRangeFilter({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangeFilterProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'w-full justify-start text-left font-normal lg:w-[230px]',
              !dateRange && 'text-muted-foreground'
            )}
            id="date"
            variant="outline"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} -{' '}
                  {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
                </>
              ) : (
                format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
              )
            ) : (
              <span>Selecionar período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            autoFocus
            defaultMonth={dateRange?.from}
            locale={ptBR}
            mode="range"
            numberOfMonths={2}
            onSelect={onDateRangeChange}
            selected={dateRange}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
