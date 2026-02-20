'use client';

import { usePrayerTimes } from '../hooks/usePrayerTimes';
import styles from './page.module.css';

const PRAYER_LIST = [
    { name: 'Imsak', key: 'Imsak', icon: '🌙', desc: 'Waktu berhenti sahur' },
    { name: 'Subuh', key: 'Fajr', icon: '🌅', desc: 'Sholat wajib pertama', isWajib: true },
    { name: 'Syuruq', key: 'Sunrise', icon: '☀️', desc: 'Matahari terbit' },
    { name: 'Dzuhur', key: 'Dhuhr', icon: '🕐', desc: 'Sholat wajib kedua', isWajib: true },
    { name: 'Ashar', key: 'Asr', icon: '🌤️', desc: 'Sholat wajib ketiga', isWajib: true },
    { name: 'Maghrib', key: 'Maghrib', icon: '🌇', desc: 'Sholat wajib keempat', isWajib: true },
    { name: 'Isya', key: 'Isha', icon: '🌙', desc: 'Sholat wajib kelima', isWajib: true },
];

function isPrayerPassed(time) {
    if (!time) return false;
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    const prayerMin = h * 60 + m;
    const currentMin = now.getHours() * 60 + now.getMinutes();
    return currentMin > prayerMin;
}

function getNextPrayerKey(prayerTimes) {
    if (!prayerTimes) return null;
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    for (const p of PRAYER_LIST) {
        const time = prayerTimes[p.key];
        if (time) {
            const [h, m] = time.split(':').map(Number);
            if (h * 60 + m > currentMin) return p.key;
        }
    }
    return null;
}

export default function JadwalPage() {
    const { prayerTimes, loading, error, locationName, hijriDate } = usePrayerTimes();
    const nextKey = getNextPrayerKey(prayerTimes);

    if (loading) {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Jadwal Sholat</h1>
                    <p>Memuat jadwal...</p>
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <span className="loading-text">Mengambil lokasi & jadwal sholat...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Jadwal Sholat</h1>
                </div>
                <div className="error-container">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const today = new Date();
    const dateStr = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="container">
            <div className="page-header fade-in-up">
                <h1>Jadwal Sholat</h1>
                {locationName && (
                    <p className={styles.location}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: 'middle' }}>
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        {locationName}
                    </p>
                )}
            </div>

            {/* Date Card */}
            <div className={`${styles.dateCard} glass-card fade-in-up`}>
                <div className={styles.dateInfo}>
                    <p className={styles.dateGregorian}>{dateStr}</p>
                    {hijriDate && (
                        <p className={styles.dateHijri}>
                            {hijriDate.day} {hijriDate.month.en} {hijriDate.year} H
                        </p>
                    )}
                </div>
                <div className={styles.dateIcon}>📅</div>
            </div>

            {/* Prayer Times List */}
            <div className={`${styles.prayerList} stagger-children`}>
                {PRAYER_LIST.map((prayer) => {
                    const time = prayerTimes?.[prayer.key];
                    const passed = isPrayerPassed(time);
                    const isNext = prayer.key === nextKey;

                    return (
                        <div
                            key={prayer.key}
                            className={`${styles.prayerCard} glass-card ${isNext ? styles.nextPrayer : ''} ${passed ? styles.passedPrayer : ''}`}
                        >
                            <div className={styles.prayerLeft}>
                                <span className={styles.prayerIcon}>{prayer.icon}</span>
                                <div className={styles.prayerInfo}>
                                    <h3 className={styles.prayerName}>
                                        {prayer.name}
                                        {prayer.isWajib && <span className={styles.wajibBadge}>Wajib</span>}
                                    </h3>
                                    <p className={styles.prayerDesc}>{prayer.desc}</p>
                                </div>
                            </div>
                            <div className={styles.prayerRight}>
                                <span className={styles.prayerTime}>{time || '--:--'}</span>
                                {isNext && <span className={styles.nextBadge}>Berikutnya</span>}
                                {passed && !isNext && (
                                    <svg className={styles.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
