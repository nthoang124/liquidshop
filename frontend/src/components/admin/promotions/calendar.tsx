"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Calendar24Props {
  date?: Date,
  time: string | undefined,
  onChangeDate: (date: Date | undefined) => void,
  onChangeTime: (time: string) => void,
  isEdit: boolean,
  isStart: boolean,
}

export function Calendar24({date, time, onChangeDate, onChangeTime, isEdit, isStart} : Calendar24Props) {
  const [open, setOpen] = React.useState(false)
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="date-picker" className="px-1 text-sm md:text-base">
          {isStart ? "Ngày bắt đầu" : "Ngày kết thúc"}
          {isStart && (
            <span className="text-red-500">*</span>
          )}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              disabled={!isEdit}
              className="max-w-50 w-full text-sm justify-between font-normal"
            >
              {date
                ? date.toLocaleDateString("vi-VN")
                : "Select date"}  
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              startMonth={new Date(currentYear - 10, 0)}
              endMonth={new Date(currentYear + 20, 11)}
              onSelect={(d) => {
                onChangeDate(d)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="time-picker" className="px-1 text-sm md:text-base">
          {isStart ? "Giờ bắt đầu" : "Giờ kết thúc"}
          {isStart && (
            <span className="text-red-500">*</span>
          )}
        </Label>
        <Input
          type="time"
          id="time-picker"
          value={time}
          disabled={!isEdit}
          onChange={(e) => onChangeTime(e.target.value)}
          step="1"
          className="bg-background text-sm max-w-50 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
