import Link from 'next/link'
import styles from './navbar.module.scss'

export default function Navbar() {
    return (
        <div className={styles.container}> <Link href="/">tochi {"\n"} bedford</Link></div>
    )
}