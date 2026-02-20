'use client';

import { useState, useEffect } from 'react';

export function usePrayerTimes() {
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [hijriDate, setHijriDate] = useState(null);

    useEffect(() => {
        async function fetchPrayerTimes(lat, lng) {
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
                    setLocationName(data.data.meta.timezone || 'Unknown');
                } else {
                    setError('Gagal memuat jadwal sholat');
                }
            } catch (err) {
                setError('Gagal terhubung ke server');
            } finally {
                setLoading(false);
            }
        }

        // Try geolocation, default to Jakarta if denied
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
                },
                () => {
                    // Default to Jakarta
                    fetchPrayerTimes(-6.2088, 106.8456);
                    setLocationName('Jakarta (default)');
                },
                { timeout: 5000 }
            );
        } else {
            fetchPrayerTimes(-6.2088, 106.8456);
            setLocationName('Jakarta (default)');
        }
    }, []);

    return { prayerTimes, loading, error, locationName, hijriDate };
}

export function getNextPrayer(prayerTimes) {
    if (!prayerTimes) return null;

    const prayers = [
        { name: 'Subuh', key: 'Fajr' },
        { name: 'Syuruq', key: 'Sunrise' },
        { name: 'Dzuhur', key: 'Dhuhr' },
        { name: 'Ashar', key: 'Asr' },
        { name: 'Maghrib', key: 'Maghrib' },
        { name: 'Isya', key: 'Isha' },
    ];

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayers) {
        const time = prayerTimes[prayer.key];
        if (time) {
            const [h, m] = time.split(':').map(Number);
            const prayerMinutes = h * 60 + m;
            if (prayerMinutes > currentMinutes) {
                return { ...prayer, time, minutesLeft: prayerMinutes - currentMinutes };
            }
        }
    }

    // If all prayers have passed, next prayer is Fajr tomorrow
    const fajrTime = prayerTimes['Fajr'];
    if (fajrTime) {
        const [h, m] = fajrTime.split(':').map(Number);
        const minutesLeft = (24 * 60 - currentMinutes) + (h * 60 + m);
        return { name: 'Subuh', key: 'Fajr', time: fajrTime, minutesLeft };
    }

    return null;
}
