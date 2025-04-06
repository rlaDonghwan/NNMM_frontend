import {useState} from 'react'
import {Popover, PopoverTrigger, PopoverContent} from '@/components/ui/popover'
import {Button} from '@/components/ui/button'
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command'

export type ComboboxWithCreateProps = {
  items: string[]
  selected?: string
  onAdd: (newLabel: string) => void
  onSelect: (label: string) => void
  placeholder?: string
}

export default function ComboboxWithCreate({
  items,
  selected,
  onAdd,
  onSelect,
  placeholder
}: ComboboxWithCreateProps) {
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)

  const handleAddNew = () => {
    if (!inputValue.trim()) return
    onAdd(inputValue)
    setInputValue('')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[170px] justify-center font-apple">
          {selected || placeholder || '선택하세요'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[170px] p-0 font-apple">
        <Command>
          <CommandInput
            placeholder="검색 또는 추가"
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>
            <button
              onClick={handleAddNew}
              className="w-full text-left px-3 py-2 hover:bg-muted/50 text-sm">
              ➕ "{inputValue}" 추가하기
            </button>
          </CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {items.slice(0, 200).map((item, idx) => (
              <CommandItem
                key={idx}
                value={item}
                onSelect={() => {
                  onSelect(item)
                  setInputValue('')
                  setOpen(false)
                }}>
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
