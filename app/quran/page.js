'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSurahList } from '../hooks/useQuran';
import styles from './page.module.css';

export default function QuranPage() {
    const { surahs, loading, error } = useSurahList();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSurahs = surahs.filter((s) =>
        s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.includes(searchQuery) ||
        String(s.number).includes(searchQuery)
    );

    if (loading) {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Al-Qur&apos;an</h1>
                    <p>Baca & Dengarkan Recitasi</p>
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <span className="loading-text">Memuat daftar surah...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Al-Qur&apos;an</h1>
                </div>
                <div className="error-container">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-header fade-in-up">
                <h1>Al-Qur&apos;an</h1>
                <p>114 Surah · Mushary Rashid Alafasy</p>
            </div>

            {/* Search */}
            <div className="search-container fade-in-up">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Cari surah..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Surah List */}
            <div className={`${styles.surahList} stagger-children`}>
                {filteredSurahs.map((surah) => (
                    <Link
                        key={surah.number}
                        href={`/quran/${surah.number}`}
                        className={`${styles.surahCard} glass-card`}
                    >
                        <div className={styles.surahNumber}>
                            <span>{surah.number}</span>
                        </div>
                        <div className={styles.surahInfo}>
                            <div className={styles.surahNameRow}>
                                <h3 className={styles.surahLatin}>{surah.englishName}</h3>
                                <span className={styles.surahArabic}>{surah.name}</span>
                            </div>
                            <div className={styles.surahMeta}>
                                <span className={`badge ${surah.revelationType === 'Meccan' ? 'badge-makkah' : 'badge-madinah'}`}>
                                    {surah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}
                                </span>
                                <span className={styles.ayahCount}>{surah.numberOfAyahs} Ayat</span>
                            </div>
                            <p className={styles.surahMeaning}>{surah.englishNameTranslation}</p>
                        </div>
                        <svg className={styles.surahArrow} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </Link>
                ))}

                {filteredSurahs.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>Tidak ada surah yang ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
}
