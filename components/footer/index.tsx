import { useCallback } from 'react'
import styles from './footer.module.scss'
import { useCurrentTime } from '../../utilities'

export default function Footer() {
    const time = useCurrentTime()
    return (
        <div className={styles.container}>
            {time}
        </div>
    )
}