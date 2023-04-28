import styles from '../styles/Loading.module.css'

/**
 * Loading is a simple text placeholder for data that is being loaded in.
 * @returns The placeholder element.
 */
const Loading = () => {
  return (
    <div className={styles['loading-container']}>
      <p className={styles['loading']}></p>
    </div>
  )
}

export default Loading
