import styles from './footer.module.scss'
import { useCurrentTime } from '../../utilities'

export default function Footer() {
    const time = useCurrentTime()
    const style: React.CSSProperties = {
        visibility: time?.includes("UTC") ? "hidden" : "visible",
        opacity: time?.includes("UTC") ? 0 : 1,
    };
    return (
        <div className={styles.container} style={style}>
            {time}
        </div>
    )
}