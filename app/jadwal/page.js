'use client';

import { useState, useEffect } from 'react';
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

const POPULAR_CITIES = [
    { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
    { name: 'Surabaya', lat: -7.2575, lng: 112.7521 },
    { name: 'Bandung', lat: -6.9175, lng: 107.6191 },
    { name: 'Medan', lat: 3.5952, lng: 98.6722 },
    { name: 'Semarang', lat: -6.9666, lng: 110.4196 },
    { name: 'Makassar', lat: -5.1477, lng: 119.4327 },
    { name: 'Yogyakarta', lat: -7.7956, lng: 110.3695 },
    { name: 'Palembang', lat: -2.9761, lng: 104.7754 },
    { name: 'Denpasar', lat: -8.6705, lng: 115.2126 },
    { name: 'Malang', lat: -7.9666, lng: 112.6326 },
    { name: 'Balikpapan', lat: -1.2379, lng: 116.8529 },
    { name: 'Pontianak', lat: -0.0263, lng: 109.3425 },
    { name: 'Banjarmasin', lat: -3.3194, lng: 114.5900 },
    { name: 'Manado', lat: 1.4748, lng: 124.8421 },
    { name: 'Padang', lat: -0.9471, lng: 100.4172 },
    { name: 'Pekanbaru', lat: 0.5071, lng: 101.4478 },
    { name: 'Mecca', lat: 21.4225, lng: 39.8262 },
    { name: 'Madinah', lat: 24.4539, lng: 39.6142 },
];

function isPrayerPassed(time) {
    if (!time) return false;
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes() > h * 60 + m;
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
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [hijriDate, setHijriDate] = useState(null);
    const [showCityPicker, setShowCityPicker] = useState(false);
    const [citySearch, setCitySearch] = useState('');

    const fetchPrayerTimes = async (lat, lng, cityName) => {
        setLoading(true);
        setError(null);
        try {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            const dateStr = `${dd}-${mm}-${yyyy}`;

            const res = await fetch(
                `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=20`
            );
            const data = await res.json();

            if (data.code === 200) {
                setPrayerTimes(data.data.timings);
                setHijriDate(data.data.date.hijri);
                setLocationName(cityName || data.data.meta.timezone || 'Unknown');
            } else {
                setError('Gagal memuat jadwal sholat');
            }
        } catch (err) {
            setError('Gagal terhubung ke server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchPrayerTimes(position.coords.latitude, position.coords.longitude, 'Lokasi Saat Ini');
                },
                () => {
                    fetchPrayerTimes(-6.2088, 106.8456, 'Jakarta (default)');
                },
                { timeout: 5000 }
            );
        } else {
            fetchPrayerTimes(-6.2088, 106.8456, 'Jakarta (default)');
        }
    }, []);

    const selectCity = (city) => {
        setShowCityPicker(false);
        setCitySearch('');
        fetchPrayerTimes(city.lat, city.lng, city.name);
    };

    const useCurrentLocation = () => {
        setShowCityPicker(false);
        setCitySearch('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude, 'Lokasi Saat Ini'),
                () => fetchPrayerTimes(-6.2088, 106.8456, 'Jakarta (default)'),
                { timeout: 5000 }
            );
        }
    };

    const filteredCities = POPULAR_CITIES.filter((c) =>
        c.name.toLowerCase().includes(citySearch.toLowerCase())
    );

    const nextKey = getNextPrayerKey(prayerTimes);

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
            </div>

            {/* Location Selector */}
            <div className={`${styles.locationSelector} fade-in-up`}>
                <button
                    className={styles.locationBtn}
                    onClick={() => setShowCityPicker(!showCityPicker)}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{locationName || 'Pilih Lokasi'}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={showCityPicker ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
                    </svg>
                </button>

                {showCityPicker && (
                    <div className={styles.cityPicker}>
                        <div className={styles.citySearchWrap}>
                            <input
                                type="text"
                                className={styles.citySearchInput}
                                placeholder="Cari kota..."
                                value={citySearch}
                                onChange={(e) => setCitySearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button className={styles.currentLocBtn} onClick={useCurrentLocation}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                            </svg>
                            Gunakan Lokasi Saat Ini
                        </button>
                        <div className={styles.cityList}>
                            {filteredCities.map((city) => (
                                <button
                                    key={city.name}
                                    className={`${styles.cityItem} ${locationName === city.name ? styles.cityActive : ''}`}
                                    onClick={() => selectCity(city)}
                                >
                                    {city.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <span className="loading-text">Mengambil jadwal sholat...</span>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p>{error}</p>
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
}
