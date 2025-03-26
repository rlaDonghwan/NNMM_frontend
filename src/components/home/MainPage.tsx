import type {NextPage} from 'next'
import Image from 'next/image'
import ChatBubble from '@/components/common/ChatBubble'
import styles from '@/styles/Home.module.css'

const Frame: NextPage = () => {
  return (
    <div className={styles.div}>
      {/* ====== 헤더 영역 ====== */}
      <div className={styles.div1}>
        <div className={styles.div2}>
          <Image
            className={styles.icon}
            width={70}
            height={70}
            alt="logo"
            src="/main/logo.png"
          />
          <div className={styles.div3}>NNMM</div>
        </div>
        <div className={styles.div4}>
          <div className={styles.div5}>
            <Image
              className={styles.settings1Icon}
              width={40}
              height={40}
              alt="settings"
              src="/main/settings.svg"
            />
          </div>
          <div className={styles.div6}>
            <Image
              className={styles.settings1Icon}
              width={40}
              height={40}
              alt="notification"
              src="/main/notification.svg"
            />
          </div>
          <Image
            className={styles.icon1}
            width={80}
            height={80}
            alt="profile"
            src="/main/profile.png"
          />
        </div>
      </div>

      {/* ====== 히어로 영역 ====== */}
      <div className={styles.div7}>
        <Image
          className={styles.child}
          width={1920}
          height={925}
          alt="banner"
          src="/main/banner.svg"
        />
        <div className={styles.div8}>
          <div className={styles.div9}>대시보드 생성하기</div>
        </div>
        <Image
          className={styles.image5Icon}
          width={825}
          height={644}
          alt="dashboard image"
          src="/main/dashboard.png"
        />
        <div className={styles.div10}>
          <div className={styles.div11}>
            <p className={styles.p}>환경, 사회, 거버넌스 지표를 자유롭게 구성하고</p>
            <p className={styles.p1}>맞춤형 대시보드를 만들어보세요.</p>
          </div>
          <div className={styles.div12}>
            <p className={styles.p}>사용자가 선택한 지표를 기반으로</p>
            <p className={styles.p1}>자동 생성되는 그래프와 차트</p>
          </div>
        </div>
      </div>

      {/* ====== 서비스 피드백 영역 ====== */}
      <div className={styles.div13}>
        <div className={styles.div18}>ESG 대시보드, 복잡하고 불편하지 않으셨나요?</div>
        <div className={styles.div15}>
          <ChatBubble
            direction="right"
            text="원하지 않는 지표들까지 한꺼번에 나와요."
            avatar="/main/avatarLeft.svg"
          />
          <ChatBubble
            direction="left"
            text="사용자가 직관적으로 이용하기 불편해요."
            avatar="/main/avatarR.svg"
          />
        </div>
        <div className={styles.div14}>
          <span className={styles.txt}>
            <p className={styles.p}>
              우리의 ESG 대시보드는 사용자가 보유한 데이터를 바탕으로
            </p>
            <p className={styles.p}>
              자신만의 대시보드를 손쉽게 만들 수 있는 혁신적인 도구입니다.
            </p>
          </span>
        </div>
      </div>

      {/* ====== 서비스 특징 영역 ====== */}
      <div className={styles.div19}>
        <div className={styles.frameParent}>
          <div className={styles.barChartParent}>
            <Image
              className={styles.barChartIcon}
              width={72}
              height={72}
              alt="bar chart"
              src="/main/barChart.png"
            />
            <div className={styles.div20}>맞춤형 대시보드 디자인</div>
          </div>
          <div className={styles.div21}>
            보유한 데이터를 기반으로 자신만의 ESG 지표를 자유롭게 설정하고, 우리 기업만의
            대시보드를 구축할 수 있습니다.
          </div>
        </div>
        <div className={styles.child1} />
      </div>

      <div className={styles.div22}>
        <div className={styles.frameParent}>
          <div className={styles.barChartParent}>
            <Image
              className={styles.barChartIcon}
              width={72}
              height={72}
              alt="upload icon"
              src="/main/uploadIcon.png"
            />
            <div className={styles.div20}>간편한 데이터 업로드</div>
          </div>
          <div className={styles.div21}>
            다양한 형식의 데이터를 쉽게 업로드하고 분석에 활용할 수 있습니다.
          </div>
        </div>
        <div className={styles.child1} />
      </div>

      <div className={styles.div19}>
        <div className={styles.frameParent}>
          <div className={styles.lightBulbParent}>
            <Image
              className={styles.barChartIcon}
              width={72}
              height={72}
              alt="light bulb"
              src="/main/lightBulb.png"
            />
            <div className={styles.div20}>직관적인 분석 도구</div>
            <div className={styles.barChart} />
          </div>
          <div className={styles.div21}>
            복잡한 데이터도 시각적으로 깔끔하게 정리하여 분석 결과를 쉽게 이해할 수
            있습니다.
          </div>
        </div>
        <div className={styles.child1} />
      </div>

      {/* ====== 마지막 CTA 영역 ====== */}
      <div className={styles.div28}>
        <div className={styles.child4} />
        <div className={styles.div29}>
          <div className={styles.div9}>대시보드 생성하기</div>
        </div>
        <div className={styles.div31}>
          <span className={styles.txt}>
            <p className={styles.p}>내 비즈니스에 딱 맞는, 이제껏 경험 못 했던</p>
            <p className={styles.p}>쉽고 편리한 ESG 대시보드로</p>
            <p className={styles.p}>지속 가능성을 실현하세요!</p>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Frame
