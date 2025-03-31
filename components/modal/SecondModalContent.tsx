import {useState} from 'react'
import React from 'react'
import {Button} from '@/components/ui/button'
import ComboboxWithCreate from '@/components/ui/comboboxWithCreate'
import {Bar, Line, Pie, Doughnut, PolarArea, Radar} from 'react-chartjs-2'
//차트 관련 함수
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  RadialLinearScale
} from 'chart.js'

const chartComponentMap: Record<string, React.ElementType> = {
  Bar,
  Line,
  Pie,
  Doughnut,
  PolarArea,
  Radar
}

ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  RadialLinearScale
)
// const chartIcons = ['Bar', 'Line', 'Pie']
const chartIcons = [
  {type: 'Bar', image: '/images/bar-graph.png'},
  {type: 'Line', image: '/images/line-graph.png'},
  {type: 'Pie', image: '/images/pie-chart.png'},
  {type: 'Doughnut', image: '/images/doughnut-graph.png'},
  {type: 'PolarArea', image: '/images/polar-area.png'},
  {type: 'Radar', image: '/images/radar-chart.png'}
]
const dummyChartData = {
  labels: ['항목A', '항목B', '항목C', '항목D'],
  datasets: [
    {
      label: 'example data',
      data: [12, 4, 9, 10],
      backgroundColor: ['#60a5fa', '#f87171', '#34d399', '#facc15'],
      borderRadius: 6
    },
    {
      label: 'example data2',
      data: [4, 10, 7, 9],
      backgroundColor: ['#60a5fa', '#f87171', '#34d399', '#facc15'],
      borderRadius: 6
    }
  ]
}
const dummyChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
type SecondModalContentProps = {
  years: number[]
  setYears: React.Dispatch<React.SetStateAction<number[]>>
  rows: {
    indicatorKey: string
    values: Record<number, string>
    color: string
  }[]
  setRows: React.Dispatch<React.SetStateAction<any[]>>
  indicators: {key: string; label: string; unit: string}[]
  setIndicators: React.Dispatch<
    React.SetStateAction<{key: string; label: string; unit: string}[]>
  >
  onAddYear: () => void
  onRemoveYear: () => void
  onRemoveRow: (index: number) => void
  onValueChange: (rowIndex: number, year: number, value: string) => void
  onIndicatorChange: (rowIndex: number, indicatorKey: string) => void
  getUnit: (key: string) => string
  onAddRowWithIndicator: (indicatorKey: string) => void
  onSubmit: () => void
  onSubmitPage: () => void
  onBack: () => void
}

export default function SecondModalContent({
  years,
  rows,
  setRows,
  indicators,
  setIndicators,
  onAddYear,
  onRemoveYear,
  onRemoveRow,
  onValueChange,
  getUnit,
  onAddRowWithIndicator,
  onSubmit,
  onSubmitPage,
  onBack
}: SecondModalContentProps) {
  const [selectedIndicator, setSelectedIndicator] = useState(indicators[0]?.key || '')
  const [selectedChart, setSelectedChart] = useState(null)
  // const [selectedColor, setSelectedColor] = useState(null)
  const [selectedColor, setSelectedColor] = useState<string[]>(['#60A5FA', '#F472B6'])
  const [dataSelections, setDataSelections] = useState(Array(9).fill(''))

  // 색바꾸기용 함수
  const handleColorChange = (index: number, newColor: string) => {
    setSelectedColor(prev => {
      const updated = [...prev]
      updated[index] = newColor
      return updated
    })
  }

  const handleDataChange = (index, value) => {
    const updated = [...dataSelections]
    updated[index] = value
    setDataSelections(updated)
  }
  return (
    <div className="p-6 rounded-xl bg-white w-auto mx-auto">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h2 className="text-2xl font-semibold">그래프 선택</h2>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* 그래프 종류 선택 */}
        <div className="col-span-1 space-y-2">
          <h3 className="font-apple">그래프 종류 선택</h3>
          <div className="grid grid-cols-2 gap-2">
            {chartIcons.map(({type, image}) => (
              <button
                key={type}
                className={`w-20 h-20 rounded-lg border flex items-center justify-center shadow-sm ${
                  selectedChart === type ? 'border-black' : 'border-gray-300'
                }`}
                onClick={() => setSelectedChart(type)}>
                <img src={image} alt={type} className="w-10 h-10 object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* 데이터 선택 */}
        <div className="col-span-1 space-y-2">
          <h3 className="font-apple">데이터 선택</h3>
          {/* 색상 선택 */}
          <div className="flex flex-col gap-2">
            {[0, 1].map(index => (
              <div key={index} className="flex items-center gap-2">
                <select className="flex-1 border rounded px-2 py-1">
                  <option value="value1">value1</option>
                  <option value="value2">value2</option>
                </select>
                <input
                  type="color"
                  className="w-6 h-6 border rounded"
                  value={selectedColor[index]}
                  onChange={e => handleColorChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 그래프 미리보기 ,*/}
        <div className="col-span-2 space-y-2">
          <h3 className="font-apple">그래프 미리보기</h3>
          <div className="bg-white-100 w-full rounded-xl h-64 flex items-center justify-center">
            <div className="w-full h-full p-4">
              {selectedChart &&
                chartComponentMap[selectedChart] &&
                React.createElement(chartComponentMap[selectedChart], {
                  data: dummyChartData,
                  options: dummyChartOptions
                })}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="w-full bg-white rounded-xl shadow p-6">
        {/* 저장 버튼 */}
        <div className="flex justify-end mt-6 gap-3">
          <Button
            onClick={onBack}
            className="bg-gray-200 text-black text-lg px-8 py-2 rounded-full hover:bg-gray-300">
            &lt; 이전
          </Button>
          <Button
            onClick={onSubmitPage}
            className="bg-blue-300 text-black text-lg px-8 py-2 rounded-full hover:bg-blue-500">
            저장&#9745;
          </Button>
        </div>
      </div>
    </div>
  )
}
