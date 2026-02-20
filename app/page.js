'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrayerTimes, getNextPrayer } from './hooks/usePrayerTimes';
import styles from './page.module.css';

function CountdownTimer({ minutesLeft }) {
  const [timeLeft, setTimeLeft] = useState(minutesLeft * 60);

  useEffect(() => {
    setTimeLeft(minutesLeft * 60);
  }, [minutesLeft]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div className={styles.countdown}>
      <div className={styles.countdownUnit}>
        <span className={styles.countdownNumber}>{String(hours).padStart(2, '0')}</span>
        <span className={styles.countdownLabel}>Jam</span>
      </div>
      <span className={styles.countdownSeparator}>:</span>
      <div className={styles.countdownUnit}>
        <span className={styles.countdownNumber}>{String(mins).padStart(2, '0')}</span>
        <span className={styles.countdownLabel}>Menit</span>
      </div>
      <span className={styles.countdownSeparator}>:</span>
      <div className={styles.countdownUnit}>
        <span className={styles.countdownNumber}>{String(secs).padStart(2, '0')}</span>
        <span className={styles.countdownLabel}>Detik</span>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 11) return { text: 'Selamat Pagi', arabic: 'صباح الخير' };
  if (hour >= 11 && hour < 15) return { text: 'Selamat Siang', arabic: 'مساء الخير' };
  if (hour >= 15 && hour < 18) return { text: 'Selamat Sore', arabic: 'مساء الخير' };
  return { text: 'Selamat Malam', arabic: 'مساء الخير' };
}

export default function HomePage() {
  const { prayerTimes, loading, hijriDate } = usePrayerTimes();
  const [nextPrayer, setNextPrayer] = useState(null);
  const greeting = getGreeting();

  useEffect(() => {
    if (prayerTimes) {
      setNextPrayer(getNextPrayer(prayerTimes));
    }
  }, [prayerTimes]);

  // Refresh next prayer every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (prayerTimes) {
        setNextPrayer(getNextPrayer(prayerTimes));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <div className="container">
      {/* Hero Section */}
      <section className={`${styles.hero} fade-in-up`}>
        <div className={styles.heroPattern}></div>
        <div className={styles.heroContent}>
          <p className={styles.arabicGreeting}>{greeting.arabic}</p>
          <h1 className={styles.greeting}>{greeting.text}</h1>
          {hijriDate && (
            <p className={styles.hijriDate}>
              {hijriDate.day} {hijriDate.month.en} {hijriDate.year} H
            </p>
          )}
        </div>

        {/* Bismillah */}
        <div className={styles.bismillah}>﷽</div>
      </section>

      {/* Next Prayer Card */}
      <section className={`${styles.nextPrayerCard} glass-card fade-in-up`}>
        <div className={styles.nextPrayerHeader}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
            <circle cx="12" cy="15" r="2" />
          </svg>
          <span>Sholat Berikutnya</span>
        </div>
        {loading ? (
          <div className={styles.nextPrayerLoading}>
            <div className="spinner"></div>
          </div>
        ) : nextPrayer ? (
          <>
            <div className={styles.nextPrayerInfo}>
              <h2 className={styles.nextPrayerName}>{nextPrayer.name}</h2>
              <span className={styles.nextPrayerTime}>{nextPrayer.time}</span>
            </div>
            <CountdownTimer minutesLeft={nextPrayer.minutesLeft} />
          </>
        ) : (
          <p className={styles.noData}>Memuat data...</p>
        )}
      </section>

      {/* Quick Access Cards */}
      <section className={`${styles.quickAccess} stagger-children`}>
        <Link href="/jadwal" className={`${styles.quickCard} glass-card`}>
          <div className={styles.quickIcon} style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className={styles.quickInfo}>
            <h3>Jadwal Sholat</h3>
            <p>Waktu adzan & sholat hari ini</p>
          </div>
          <svg className={styles.quickArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>

        <Link href="/quran" className={`${styles.quickCard} glass-card`}>
          <div className={styles.quickIcon} style={{ background: 'linear-gradient(135deg, #d4a843, #b8860b)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
              <path d="M12 6v7" />
              <path d="M8 9h8" />
            </svg>
          </div>
          <div className={styles.quickInfo}>
            <h3>Al-Qur&apos;an</h3>
            <p>Baca & dengarkan recitasi</p>
          </div>
          <svg className={styles.quickArrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </section>

      {/* Today's Prayer Overview */}
      {prayerTimes && (
        <section className={`${styles.todayPrayers} fade-in-up`}>
          <h2 className={styles.sectionTitle}>Waktu Sholat Hari Ini</h2>
          <div className={`${styles.prayerGrid} stagger-children`}>
            {[
              { name: 'Imsak', key: 'Imsak', icon: '🌙' },
              { name: 'Subuh', key: 'Fajr', icon: '🌅' },
              { name: 'Dzuhur', key: 'Dhuhr', icon: '☀️' },
              { name: 'Ashar', key: 'Asr', icon: '🌤️' },
              { name: 'Maghrib', key: 'Maghrib', icon: '🌇' },
              { name: 'Isya', key: 'Isha', icon: '🌙' },
            ].map((p) => (
              <div key={p.key} className={`${styles.prayerMiniCard} glass-card ${nextPrayer?.key === p.key ? styles.activePrayer : ''}`}>
                <span className={styles.prayerEmoji}>{p.icon}</span>
                <span className={styles.prayerMiniName}>{p.name}</span>
                <span className={styles.prayerMiniTime}>{prayerTimes[p.key]}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
