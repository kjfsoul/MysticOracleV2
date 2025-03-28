import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayPicker, CaptionProps, useNavigation } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Custom caption component with dropdown selectors
function CustomCaption(props: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation()
  const { displayMonth } = props

  // Generate array of months
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]
  
  // Generate array of years (from 1900 to current year + 10)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 11 }, (_, i) => 1900 + i)
  
  return (
    <div className="flex justify-center items-center gap-1">
      <Select
        value={months[displayMonth.getMonth()]}
        onValueChange={(value) => {
          const newDate = new Date(displayMonth)
          newDate.setMonth(months.indexOf(value))
          goToMonth(newDate)
        }}
      >
        <SelectTrigger className="h-7 w-[110px] text-xs font-medium border-gold/50">
          <SelectValue>{format(displayMonth, "MMMM")}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80 z-[60] bg-background shadow-md border-gold/50 text-foreground" style={{ background: 'var(--background)' }}>
          {months.map((month) => (
            <SelectItem key={month} value={month} className="text-xs">
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={displayMonth.getFullYear().toString()}
        onValueChange={(value) => {
          const newDate = new Date(displayMonth)
          newDate.setFullYear(parseInt(value))
          goToMonth(newDate)
        }}
      >
        <SelectTrigger className="h-7 w-[70px] text-xs font-medium border-gold/50">
          <SelectValue>{format(displayMonth, "yyyy")}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80 z-[60] bg-background shadow-md border-gold/50 text-foreground" style={{ background: 'var(--background)' }}>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()} className="text-xs">
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 border border-gold/30 rounded-md shadow-md", className)}
      style={{ background: 'var(--background)' }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-gold/50 text-foreground"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gold rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gold/30 [&:has([aria-selected])]:bg-gold/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-foreground hover:text-gold hover:bg-gold/10"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gold text-background hover:bg-gold hover:text-background focus:bg-gold focus:text-background",
        day_today: "bg-gold/20 text-gold font-medium border border-gold/50",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-gold/30 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-gold/30 aria-selected:text-gold",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        Caption: CustomCaption
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
