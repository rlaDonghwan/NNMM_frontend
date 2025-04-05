function getUniqueIndicatorKeys(rows) {
  const uniqueKeys = new Set()
  rows.forEach(row => {
    uniqueKeys.add(`${row.indicatorKey}-${row.field1 || ''}-${row.field2 || ''}`)
  })
  return uniqueKeys
}
//----------------------------------------------------------------------------------------------------
function isTimeSeriesData(rows, years) {
  return rows.every(row => {
    const rowYears = Object.keys(row.values || {})
    return years.every(y => rowYears.includes(String(y)))
  })
}
//----------------------------------------------------------------------------------------------------
function recommendChartTypes(rows, years) {
  const indicatorKeys = getUniqueIndicatorKeys(rows)
  const indicatorsCount = indicatorKeys.size
  const yearsCount = years.length
  const isTimeSeries = isTimeSeriesData(rows, years)

  if (!rows.length || indicatorsCount === 0) {
    return ['Bar']
  }

  if (indicatorsCount === 1 && yearsCount > 1) {
    return ['Bar', 'Line']
  }

  if (indicatorsCount > 1 && yearsCount === 1) {
    return ['Bar', 'Pie', 'Doughnut', 'PolarArea', 'Radar']
  }

  if (indicatorsCount > 1 && yearsCount > 1) {
    return isTimeSeries ? ['Line', 'Bar'] : ['Bar']
  }

  return ['Bar']
}
//----------------------------------------------------------------------------------------------------
