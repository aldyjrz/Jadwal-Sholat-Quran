'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useSurahDetail } from '../../hooks/useQuran';
import styles from './page.module.css';

export default function SurahPage({ params }) {
    const { surah: surahNumber } = use(params);
    const { surah, translationEn, translationId, loading, error } = useSurahDetail(surahNumber);
    const [playingAyah, setPlayingAyah] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [continuousMode, setContinuousMode] = useState(false);
    const [showTranslationId, setShowTranslationId] = useState(true);
    const [showTranslationEn, setShowTranslationEn] = useState(false);
    const audioRef = useRef(null);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const playAyah = (ayah) => {
        if (!ayah.audio) return;
        if (audioRef.current) audioRef.current.pause();

        const audio = new Audio(ayah.audio);
        audioRef.current = audio;
        setPlayingAyah(ayah.numberInSurah);
        setIsPlaying(true);
        setAudioProgress(0);

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                setAudioProgress((audio.currentTime / audio.duration) * 100);
                setCurrentTime(formatTime(audio.currentTime));
            }
        });

        audio.addEventListener('ended', () => {
            if (continuousMode && surah) {
                const nextIdx = surah.ayahs.findIndex(a => a.numberInSurah === ayah.numberInSurah) + 1;
                if (nextIdx < surah.ayahs.length) {
                    playAyah(surah.ayahs[nextIdx]);
                    return;
                }
            }
            setIsPlaying(false);
            setPlayingAyah(null);
            setAudioProgress(0);
        });

        audio.play().catch(() => {
            setIsPlaying(false);
            setPlayingAyah(null);
        });
    };

    const togglePlayPause = (ayah) => {
        if (playingAyah === ayah.numberInSurah && isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else if (playingAyah === ayah.numberInSurah && !isPlaying) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            playAyah(ayah);
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlaying(false);
        setPlayingAyah(null);
        setAudioProgress(0);
    };

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Memuat Surah...</h1>
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <span className="loading-text">Mengambil data surah & terjemahan...</span>
                </div>
            </div>
        );
    }

    if (error || !surah) {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>Error</h1>
                </div>
                <div className="error-container">
                    <p>{error || 'Surah tidak ditemukan'}</p>
                    <Link href="/quran" className={styles.backLink}>← Kembali ke daftar surah</Link>
                </div>
            </div>
        );
    }

    // Build translation maps
    const enMap = {};
    const idMap = {};
    if (translationEn?.ayahs) translationEn.ayahs.forEach(a => { enMap[a.numberInSurah] = a.text; });
    if (translationId?.ayahs) translationId.ayahs.forEach(a => { idMap[a.numberInSurah] = a.text; });

    return (
        <div className="container">
            <Link href="/quran" className={styles.backButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
                Kembali
            </Link>

            {/* Surah Header */}
            <div className={`${styles.surahHeader} fade-in-up`}>
                <div className={styles.headerPattern}></div>
                <div className={styles.headerContent}>
                    <h1 className={styles.surahArabicName}>{surah.name}</h1>
                    <h2 className={styles.surahEnglishName}>{surah.englishName}</h2>
                    <p className={styles.surahTranslation}>{surah.englishNameTranslation}</p>
                    <div className={styles.surahStats}>
                        <span className={`badge ${surah.revelationType === 'Meccan' ? 'badge-makkah' : 'badge-madinah'}`}>
                            {surah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}
                        </span>
                        <span className={styles.statDot}>·</span>
                        <span className={styles.statText}>{surah.numberOfAyahs} Ayat</span>
                    </div>
                </div>
                {surah.number !== 9 && <div className={styles.bismillah}>﷽</div>}
            </div>

            {/* Playback & Translation Controls */}
            <div className={`${styles.playbackControls} glass-card fade-in-up`}>
                <button
                    className={`${styles.playAllBtn} ${isPlaying ? styles.playing : ''}`}
                    onClick={() => {
                        if (isPlaying) { stopAudio(); }
                        else if (surah.ayahs.length > 0) { setContinuousMode(true); playAyah(surah.ayahs[0]); }
                    }}
                >
                    {isPlaying ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    )}
                    <span>{isPlaying ? 'Pause' : 'Putar Semua'}</span>
                </button>
                <label className={styles.toggleOption}>
                    <input type="checkbox" checked={continuousMode} onChange={(e) => setContinuousMode(e.target.checked)} />
                    <span className={styles.toggleSlider}></span>
                    <span className={styles.toggleLabel}>Auto</span>
                </label>
            </div>

            {/* Translation toggles */}
            <div className={`${styles.translationControls} glass-card fade-in-up`}>
                <span className={styles.translationTitle}>Terjemahan:</span>
                <div className={styles.translationOptions}>
                    <label className={styles.translationToggle}>
                        <input type="checkbox" checked={showTranslationId} onChange={(e) => setShowTranslationId(e.target.checked)} />
                        <span className={styles.checkboxCustom}>
                            {showTranslationId && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                        </span>
                        <span className={styles.toggleLabel}>🇮🇩 Indonesia</span>
                    </label>
                    <label className={styles.translationToggle}>
                        <input type="checkbox" checked={showTranslationEn} onChange={(e) => setShowTranslationEn(e.target.checked)} />
                        <span className={styles.checkboxCustom}>
                            {showTranslationEn && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                        </span>
                        <span className={styles.toggleLabel}>🇬🇧 English</span>
                    </label>
                </div>
            </div>

            {/* Ayah List */}
            <div className={styles.ayahList}>
                {surah.ayahs.map((ayah) => {
                    const isCurrentlyPlaying = playingAyah === ayah.numberInSurah;
                    const idText = idMap[ayah.numberInSurah];
                    const enText = enMap[ayah.numberInSurah];

                    return (
                        <div key={ayah.numberInSurah} className={`${styles.ayahCard} ${isCurrentlyPlaying ? styles.ayahPlaying : ''}`}>
                            <div className={styles.ayahHeader}>
                                <span className={styles.ayahNumber}>{ayah.numberInSurah}</span>
                                <button
                                    className={`audio-btn ${isCurrentlyPlaying && isPlaying ? 'playing' : ''}`}
                                    onClick={() => { setContinuousMode(false); togglePlayPause(ayah); }}
                                >
                                    {isCurrentlyPlaying && isPlaying ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                    )}
                                </button>
                            </div>

                            <p className={`${styles.ayahText} arabic-text`}>{ayah.text}</p>

                            {showTranslationId && idText && (
                                <p className={styles.translationTextId}>{idText}</p>
                            )}

                            {showTranslationEn && enText && (
                                <p className={styles.translationTextEn}>{enText}</p>
                            )}

                            {isCurrentlyPlaying && (
                                <div className="audio-player">
                                    <div className="audio-progress">
                                        <div className="audio-progress-bar" style={{ width: `${audioProgress}%` }}></div>
                                    </div>
                                    <span className="audio-time">{currentTime}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
