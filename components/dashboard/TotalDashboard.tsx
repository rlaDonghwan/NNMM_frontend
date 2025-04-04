'use client'

import {useEffect, useState} from 'react'
import GridItem from './GridItem'
import {fetchUserCharts} from '@/services/chart-config'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

export default function TotalDashboard() {
  const [favoriteCharts, setFavoriteCharts] = useState([])

  useState(() => {
    const loadFavorites = async () => {
      try {
        const data = await fetchUserCharts('')
        const favorites = data
          .filter(chart => chart.isFavorite === true)
          .map(chart => ({
            ...chart,
            chartId: chart.chartId ?? chart._id,
            dashboardId: chart.dashboardId ?? chart._id,
            userId: chart.userId
          }))
        setFavoriteCharts(favorites)
      } catch (err) {
        console.error('즐겨찾기 차트 불러오기 실패:', err)
      }
    }
    loadFavorites()
  })
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col w-full h-screen">
        <div className="grid grid-cols-3 h-full gap-4">
          {favoriteCharts.map((item, index) => (
            <GridItem
              key={item.chartId ?? item._id ?? `fav-${index}`}
              item={item}
              index={index}
              isLast={false}
              moveItem={() => {}}
              handleClick={() => {}}
            />
          ))}
          <div className="bg-blue-100 p-6 rounded-xl shadow">첫 번째 칸</div>
          <div className="bg-green-100 p-6 rounded-xl shadow">두 번째 칸</div>
          <div className="bg-yellow-100 p-6 rounded-xl shadow">세 번째 칸</div>
          <div className="bg-red-100 p-6 rounded-xl shadow">네 번째 칸</div>
          <div className="bg-purple-100 p-6 rounded-xl shadow">다섯 번째 칸</div>
          <div className="bg-pink-100 p-6 rounded-xl shadow">여섯 번째 칸</div>
        </div>
        <div></div>
      </div>
    </DndProvider>
  )
}
