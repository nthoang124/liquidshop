import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { ICategory } from "@/types/category"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

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
          className="w-full max-w-70 justify-between text-md md:text-lg "
        >
          {value
            ? categories.find((c) => c._id === value)?.name
            : "không có"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {categories.map((c) => (
                <CommandItem
                  key={c._id}
                  value={c._id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setParentCategory(c)
                  }}
                  className="text-md md:text-lg"
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
