'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Beranda' },
        { href: '/jadwal', label: 'Jadwal Sholat' },
        { href: '/quran', label: "Al-Qur'an" },
        { href: '/screen', label: "Layar" },
        { href: '/admin', label: "Pengaturan" },
    ];

    return (
        <header className={styles.navbar}>
            <div className={styles.navInner}>
                <Link href="/" className={styles.brand}>
                    <span className={styles.brandIcon}>☪</span>
                    <span className={styles.brandText}>TsabitApp</span>
                </Link>
                <nav className={styles.navLinks}>
                    {navItems.map((item) => {
                        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
