import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL
//----------------------------------------------------------------------------------------------------
type Row = {
  indicatorKey: string
  values: Record<number, string>
  color: string
  field1?: string
  field2?: string
  unit?: string
}
//----------------------------------------------------------------------------------------------------
export const saveChartConfig = async ({
  chartType,
  selectedRows,
  colorSet,
  rows,
  indicators,
  years,
  title,
  category
}: {
  chartType: string
  selectedRows: number[]
  colorSet: string[]
  rows: Row[]
  indicators: {key: string; label: string; unit?: string}[]
  years: number[]
  title?: string
  category: string
}) => {
  const targetDataKeys = selectedRows.map(i => {
    const row = rows[i]
    return [row.indicatorKey, row.field1, row.field2, row.unit].filter(Boolean).join('|')
  })

  const labels = selectedRows.map(i => {
    const row = rows[i]
    const ind = indicators.find(ind => ind.key === row.indicatorKey)
    const parts = [row.field1, row.field2].filter(Boolean).join(' / ')
    const unit = ind?.unit || row.unit || ''
    return `${ind?.label || row.indicatorKey}${parts ? ` (${parts}` : ''}${
      parts && unit ? ` / ${unit})` : unit ? ` (${unit})` : parts ? ')' : ''
    }`
  })

  const units = selectedRows.map(i => {
    const row = rows[i]
    return row.unit || indicators.find(ind => ind.key === row.indicatorKey)?.unit || ''
  })

  return axios.post(
    `${BASE_URL}/chart`,
    {
      chartType,
      targetDataKeys,
      labels,
      colorSet,
      years,
      units,
      title,
      category
    },
    {withCredentials: true}
  )
}
//----------------------------------------------------------------------------------------------------
//차트 호출

export const fetchUserCharts = async (category: string) => {
  const params = category ? {category} : {}

  const res = await axios.get(`${BASE_URL}/chart`, {
    withCredentials: true,
    params
  })

  console.log('[fetchUserChart] Response:', res.data)
  return res.data
}

//----------------------------------------------------------------------------------------------------

//차트 순서 불러오기

export const updateChartOrder = async (orderedIds: string[]) => {
  return axios.post(`${BASE_URL}/chart/order`, {orderedIds}, {withCredentials: true})
}
