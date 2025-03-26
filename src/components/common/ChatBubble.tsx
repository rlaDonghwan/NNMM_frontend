import React from 'react'
import Image from 'next/image'
import styles from '@/styles/ChatBubble.module.css'

interface Props {
  direction: 'left' | 'right'
  text: string
  avatar: string
}

const ChatBubble = ({direction, text, avatar}: Props) => {
  const isLeft = direction === 'left'

  return (
    <div className={`${styles.container} ${isLeft ? styles.left : styles.right}`}>
      <Image src={avatar} alt="avatar" width={60} height={60} className={styles.avatar} />
      <div className={styles.bubbleWrapper}>
        <div
          className={`${styles.bubble} ${
            isLeft ? styles.bubbleLeft : styles.bubbleRight
          }`}>
          {text}
          <span
            className={`${styles.tail} ${isLeft ? styles.tailLeft : styles.tailRight}`}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatBubble
