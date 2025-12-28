import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { ICategory } from "@/types/category"

interface CategoryComboboxProps {
    categories: ICategory[];
    open: boolean;
    setOpen: (open: boolean) => void;
    setParentCategory: React.Dispatch<React.SetStateAction<ICategory | null>>;
}

export function CategoryCombobox({ categories, open, setOpen, setParentCategory} : CategoryComboboxProps) {
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-70 justify-between text-sm md:text-base"
        >
          {value
            ? categories.find((c) => c._id === value)?.name
            : "không có"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandList>
            <CommandGroup>
                <CommandItem
                    value="none"
                    onSelect={() => {
                        setValue("")
                        setParentCategory(null)
                        setOpen(false)
                    }}
                    className="text-sm md:text-base text-gray-500 italic"
                    >
                        Không có
                    <Check className={cn("ml-auto", value === "" ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              {categories.map((c) => (
                <CommandItem
                  key={c._id}
                  value={c._id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setParentCategory(c)
                  }}
                  className="text-md"
                >
                  {c.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === c._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
