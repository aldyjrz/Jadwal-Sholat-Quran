'use client';

import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className="site-footer">
            <p>
                Dibuat dengan ❤️ oleh <span className="footer-brand">AldyToi</span>
            </p>
            <p className={styles.sub}>
                Jadwal Sholat & Al-Qur&apos;an · {new Date().getFullYear()}
            </p>
        </footer>
    );
}
