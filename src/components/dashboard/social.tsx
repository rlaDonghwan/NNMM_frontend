import React, {useState, useEffect} from 'react' // React와 훅(useState, useEffect) 가져오기
import {DndProvider, useDrag, useDrop} from 'react-dnd' // react-dnd의 DnD 관련 훅 가져오기
import {HTML5Backend} from 'react-dnd-html5-backend' // HTML5Backend 가져오기
import Modal from '../modal/Modal' // Modal 컴포넌트 가져오기
import ModalContent from '../modal/ModalContent' // ModalContent 컴포넌트 가져오기
import {
  fetchIndicators,
  createIndicators,
  submitESGReport,
  syncIndicators // ✅ 새로 추가된 함수
} from '@/services/esg' // ESG 관련 서비스 함수 가져오기

const ItemType = {
  BOX: 'box' // 드래그 앤 드롭 아이템 타입 정의
}

export default function Social() {
  // Social 컴포넌트 정의
  const [isModalOpen, setIsModalOpen] = useState(false) // 모달 열림 상태 저장
  const [gridItems, setGridItems] = useState([]) // 그리드 아이템 상태 저장
  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // 수정 모달 열림 상태 저장
  const [selectedItemId, setSelectedItemId] = useState(null) // 선택된 아이템 ID 저장
  const [years, setYears] = useState([2021, 2022, 2023]) // 연도 리스트 저장
  const [rows, setRows] = useState([]) // 행 데이터 저장
  const [indicators, setIndicators] = useState([]) // 지표 데이터 저장

  useEffect(() => {
    // 컴포넌트 마운트 시 실행
    const loadIndicators = async () => {
      // 지표 데이터를 불러오는 함수
      try {
        const data = await fetchIndicators('social') // 'social' 카테고리의 지표 데이터 가져오기
        setIndicators(data) // 지표 데이터 저장
      } catch (err) {
        console.error('지표 불러오기 실패:', err) // 에러 로그 출력
      }
    }
    loadIndicators() // 함수 호출
  }, [])

  const handleValueChange = (rowIndex, year, value) => {
    // 값 변경 핸들러
    const updated = [...rows] // 기존 행 데이터 복사
    updated[rowIndex].values[year] = value // 특정 연도의 값 업데이트
    setRows(updated) // 업데이트된 행 데이터 저장
  }

  const handleIndicatorChange = (rowIndex, key) => {
    // 지표 변경 핸들러
    const updated = [...rows] // 기존 행 데이터 복사
    updated[rowIndex].indicatorKey = key // 특정 행의 지표 키 업데이트
    setRows(updated) // 업데이트된 행 데이터 저장
  }

  const handleColorChange = (rowIndex, color) => {
    // 색상 변경 핸들러
    const updated = [...rows] // 기존 행 데이터 복사
    updated[rowIndex].color = color // 특정 행의 색상 업데이트
    setRows(updated) // 업데이트된 행 데이터 저장
  }

  const addRowWithIndicator = indicatorKey => {
    // 지표를 포함한 행 추가 함수
    const newRow = {
      // 새로운 행 데이터 생성
      id: crypto.randomUUID(), // 고유 ID 생성
      indicatorKey, // 지표 키 설정
      values: years.reduce((acc, y) => ({...acc, [y]: ''}), {}), // 연도별 초기 값 설정
      color: '#cccccc' // 기본 색상 설정
    }
    setRows(prev => [...prev, newRow]) // 기존 행 데이터에 추가
  }

  const removeRow = rowIndex => {
    // 행 삭제 함수
    const updated = [...rows] // 기존 행 데이터 복사
    updated.splice(rowIndex, 1) // 특정 인덱스의 행 삭제
    setRows(updated) // 업데이트된 행 데이터 저장
  }

  const getUnit = key => {
    // 지표 단위 가져오기 함수
    return indicators.find(i => i.key === key)?.unit || '' // 지표 키에 해당하는 단위 반환
  }

  const handleSubmit = async () => {
    // 제출 핸들러
    try {
      await syncIndicators(indicators) // 지표 동기화
      await submitESGReport({category: 'social', years, rows}) // ESG 보고서 제출
      setIsModalOpen(false) // 모달 닫기
    } catch (error) {
      console.error('ESG 저장 오류:', error) // 에러 로그 출력
    }
  }

  const handleClick = item => {
    // 아이템 클릭 핸들러
    if (item.id) {
      // 아이템 ID가 있는 경우
      setSelectedItemId(item.id) // 선택된 아이템 ID 저장
      setIsEditModalOpen(true) // 수정 모달 열기
    } else {
      setIsModalOpen(true) // 모달 열기
    }
  }

  const closeModal = () => setIsModalOpen(false) // 모달 닫기
  const closeEditModal = () => setIsEditModalOpen(false) // 수정 모달 닫기

  const handleDeleteItem = () => {
    // 아이템 삭제 핸들러
    setGridItems(prev => prev.filter(item => item.id !== selectedItemId)) // 선택된 아이템 삭제
    closeEditModal() // 수정 모달 닫기
  }

  const getRandomColor = () => {
    // 랜덤 색상 가져오기 함수
    const colors = [
      // 색상 리스트
      'bg-red-100',
      'bg-green-100',
      'bg-yellow-100',
      'bg-purple-100',
      'bg-pink-100'
    ]
    return colors[Math.floor(Math.random() * colors.length)] // 랜덤 색상 반환
  }

  const moveItem = (dragIndex, hoverIndex) => {
    // 아이템 이동 함수
    const updated = [...gridItems] // 기존 그리드 아이템 복사
    const [removed] = updated.splice(dragIndex, 1) // 드래그된 아이템 제거
    updated.splice(hoverIndex, 0, removed) // 드래그된 아이템을 새로운 위치에 삽입
    setGridItems(updated) // 업데이트된 그리드 아이템 저장
  }

  const GridItem = ({item, index, isLast}) => {
    // 그리드 아이템 컴포넌트
    const ref = React.useRef(null) // 참조 생성

    const [{isDragging}, dragRef] = useDrag({
      // 드래그 훅 설정
      type: ItemType.BOX, // 아이템 타입 설정
      item: {index, id: item?.id}, // 드래그 아이템 데이터 설정
      canDrag: !isLast, // 마지막 아이템은 드래그 불가
      collect: monitor => ({isDragging: monitor.isDragging()}) // 드래그 상태 수집
    })

    const [, dropRef] = useDrop({
      // 드롭 훅 설정
      accept: ItemType.BOX, // 허용되는 아이템 타입 설정
      hover: draggedItem => {
        // 드롭 영역에 들어왔을 때
        if (!isLast && draggedItem.index !== index) {
          // 마지막 아이템이 아니고 인덱스가 다를 경우
          moveItem(draggedItem.index, index) // 아이템 이동
          draggedItem.index = index // 드래그된 아이템의 인덱스 업데이트
        }
      }
    })

    dragRef(dropRef(ref)) // 드래그와 드롭 참조 연결

    return (
      <div
        ref={ref} // 참조 연결
        className={`p-6 rounded-xl shadow flex items-center justify-center cursor-pointer ${
          isLast ? 'bg-blue-100' : item.color // 마지막 아이템일 경우 배경색 설정
        }`}
        style={{opacity: isDragging ? 0.5 : 1}} // 드래그 중일 때 투명도 설정
        onClick={() => handleClick(isLast ? {} : item)}>
        {' '}
        // 클릭 핸들러 연결
        <span className={`text-9xl ${isLast ? 'text-gray-500' : 'text-black'}`}>
          {isLast ? '+' : '텍스트'} // 마지막 아이템일 경우 '+' 표시
        </span>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {' '}
      {/* DnDProvider로 감싸기 */}
      <div>
        <div
          className="grid gap-4"
          style={{gridTemplateColumns: 'repeat(3, 400px)', gridAutoRows: '300px'}}>
          {' '}
          {/* 그리드 스타일 설정 */}
          {gridItems.map(
            (
              item,
              index // 그리드 아이템 렌더링
            ) => (
              <GridItem key={item.id} item={item} index={index} isLast={false} />
            )
          )}
          <GridItem key="add-button" item={{}} index={gridItems.length} isLast={true} />{' '}
          {/* 추가 버튼 */}
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {' '}
          {/* 모달 컴포넌트 */}
          <ModalContent
            years={years} // 연도 데이터 전달
            rows={rows} // 행 데이터 전달
            setRows={setRows} // 행 데이터 업데이트 함수 전달
            indicators={indicators} // 지표 데이터 전달
            setIndicators={setIndicators} // 지표 데이터 업데이트 함수 전달
            onAddYear={() => setYears([...years, Math.max(...years) + 1])} // 연도 추가 함수 전달
            onRemoveYear={() => setYears(prev => prev.slice(0, -1))} // 연도 제거 함수 전달
            onRemoveRow={removeRow} // 행 제거 함수 전달
            onValueChange={handleValueChange} // 값 변경 함수 전달
            getUnit={getUnit} // 단위 가져오기 함수 전달
            onSubmit={handleSubmit} // 제출 함수 전달
            onAddRowWithIndicator={addRowWithIndicator} // 지표를 포함한 행 추가 함수 전달
            onIndicatorChange={handleIndicatorChange} // 지표 변경 함수 전달
            onColorChange={handleColorChange} // 색상 변경 함수 전달
          />
        </Modal>

        {isEditModalOpen && ( // 수정 모달이 열려 있을 경우
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
            {' '}
            {/* 모달 배경 */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              {' '}
              {/* 모달 내용 */}
              <h2 className="text-xl font-semibold mb-4">삭제 팝업</h2> {/* 제목 */}
              <p>이 칼럼을 삭제하시겠습니까?</p> {/* 메시지 */}
              <button
                onClick={closeEditModal} // 닫기 버튼 클릭 핸들러
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                닫기
              </button>
              <button
                onClick={handleDeleteItem} // 삭제 버튼 클릭 핸들러
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded ml-4">
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}
