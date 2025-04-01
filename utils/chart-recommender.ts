function getUniqueIndicatorKeys(rows) {
  return Array.from(
    new Set(
      rows.map(
        row => `${row.indicatorKey}-${row.field1 || ''}-${row.field2 || ''}` // 대분류, 중분류까지 포함해서 유니크한 키 생성
      )
    )
  )
}
//----------------------------------------------------------------------------------------------------

export function recommendChartTypes(rows, years): string[] {
  const indicatorsCount = getUniqueIndicatorKeys(rows).length // 유니크한 indicator 키의 개수 계산
  const yearsCount = years.length // 연도의 개수 계산

  const isTimeSeries = rows.every(row => {
    const valueYears = Object.keys(row.values || {}) // 각 row의 값에서 연도 키 추출
    return years.every(y => valueYears.includes(y.toString())) // 모든 연도가 row의 값에 포함되어 있는지 확인
  })

  if (indicatorsCount === 1 && yearsCount > 1 && isTimeSeries) {
    // indicator가 하나이고, 연도가 여러 개이며, 시계열 데이터인 경우
    return ['bar', 'line'] // 막대 차트와 선형 차트를 추천
  }

  if (indicatorsCount > 1 && yearsCount === 1) {
    // indicator가 여러 개이고, 연도가 하나인 경우
    return ['pie', 'doughnut', 'polarArea', 'radar'] // 파이 차트, 도넛 차트, 폴라 에어리어 차트, 레이더 차트를 추천
  }

  if (indicatorsCount > 1 && yearsCount > 1) {
    // indicator가 여러 개이고, 연도가 여러 개인 경우
    return ['line'] // 선형 차트를 추천
  }

  return ['bar'] // 기본적으로 막대 차트를 추천
}
//----------------------------------------------------------------------------------------------------
