// ComboboxWithCreate.tsx — 사용자 정의 항목 추가 가능한 Combobox

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
}

export default function ComboboxWithCreate({
  items,
  selected,
  onAdd,
  onSelect
}: ComboboxWithCreateProps) {
  // const [items, setItems] = useState(['Scope 1', 'Scope 2', '전기 사용량'])
  const [inputValue, setInputValue] = useState('')
  // const [selected, setSelected] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const handleAddNew = () => {
    if (!inputValue.trim()) return
    onAdd(inputValue)
    // setItems(prev => [...prev, inputValue])
    // setSelected(inputValue)
    setInputValue('')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          {selected || '선택하세요'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="지표를 검색하거나 추가"
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
          <CommandGroup>
            {items.map((item, idx) => (
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
