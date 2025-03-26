import type {NextPage} from 'next'
import Image from 'next/image'
import styles from './index.module.css'

const Navbar = () => {
  return (
    <div className={styles.div}>
      <div className={styles.div1}>
        <Image
          className={styles.icon}
          width={70}
          height={70}
          alt=""
          src="로고 이미지.png"
        />
        <div className={styles.div2}>NNMM</div>
      </div>
      <div className={styles.div3}>
        <div className={styles.div4}>
          <Image
            className={styles.settings1Icon}
            width={40}
            height={40}
            alt=""
            src="settings 1.svg"
          />
        </div>
        <div className={styles.div5}>
          <Image
            className={styles.settings1Icon}
            width={40}
            height={40}
            alt=""
            src="002-notification-1.svg"
          />
        </div>
        <Image
          className={styles.icon1}
          width={80}
          height={80}
          alt=""
          src="프로필 사진.png"
        />
      </div>
    </div>
  )
}

export default Navbar
