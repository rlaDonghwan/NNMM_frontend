type ModalContentProps = {
  years: number[]
  rows: {
    indicatorKey: string
    values: Record<number, string>
    color: string
  }[]
  indicators: {key: string; label: string; unit: string}[]
  onAddYear: () => void
  onRemoveYear: () => void
  onAddRow: () => void
  onRemoveRow: (index: number) => void
  onValueChange: (rowIndex: number, year: number, value: string) => void
  onIndicatorChange: (rowIndex: number, key: string) => void
  onColorChange: (rowIndex: number, color: string) => void
  getUnit: (key: string) => string
  onSubmit: () => void
}

export default function ModalContent({
  years,
  rows,
  indicators,
  onAddYear,
  onRemoveYear,
  onAddRow,
  onRemoveRow,
  onValueChange,
  onIndicatorChange,
  onColorChange,
  getUnit,
  onSubmit
}: ModalContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="">
          <h2 className="text-xl font-bold">데이터 입력</h2>
          <td className="p-2 border">
          {rows.map((row, rowIndex) => (
            <select
              value={row.indicatorKey}
              onChange={e => onIndicatorChange(rowIndex, e.target.value)}
              className="border rounded px-2 py-1">
              {indicators.map(indicator => (
                <option key={indicator.key} value={indicator.key}>
                  {indicator.label}
                </option>
              ))}
            </select>
          ))}
          </td>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onAddYear}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded">
            + 연도
          </button>
          <button
            onClick={onRemoveYear}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded">
            - 연도
          </button>
        </div>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">지표</th>
            {years.map(year => (
              <th key={year} className="p-2 border">
                {year}
              </th>
            ))}
            <th className="p-2 border">단위</th>
            <th className="p-2 border">색상</th>
            <th className="p-2 border">삭제</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* Indicator Selector */}
              <td className="p-2 border">
                <select
                  value={row.indicatorKey}
                  onChange={e => onIndicatorChange(rowIndex, e.target.value)}
                  className="border rounded px-2 py-1">
                  {indicators.map(indicator => (
                    <option key={indicator.key} value={indicator.key}>
                      {indicator.label}
                    </option>
                  ))}
                </select>
              </td>

              {/* Yearly Value Inputs */}
              {years.map(year => (
                <td key={year} className="p-2 border">
                  <input
                    type="text"
                    value={row.values[year]}
                    onChange={e => onValueChange(rowIndex, year, e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
              ))}
              <td className="p-2 border text-center">
                <button
                  onClick={() => onRemoveRow(rowIndex)}
                  className="text-red-500 hover:underline text-xs">
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-6">
        <button
          onClick={onSubmit}
          className="bg-blue-100 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm">
          저장
        </button>
      </div>
      <button
        onClick={onAddRow}
        className="bg-green-600 text-white px-4 py-2 rounded text-sm">
        + 행 추가
      </button>
    </div>
  )
}
