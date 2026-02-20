'use client';

import { useState, useEffect } from 'react';

export function useSurahList() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSurahs() {
            try {
                const res = await fetch('https://api.alquran.cloud/v1/surah');
                const data = await res.json();
                if (data.code === 200) {
                    setSurahs(data.data);
                } else {
                    setError('Gagal memuat daftar surah');
                }
            } catch (err) {
                setError('Gagal terhubung ke server');
            } finally {
                setLoading(false);
            }
        }
        fetchSurahs();
    }, []);

    return { surahs, loading, error };
}

export function useSurahDetail(surahNumber) {
    const [surah, setSurah] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!surahNumber) return;

        async function fetchSurah() {
            setLoading(true);
            try {
                // Fetch Arabic text edition with audio (Mishary Rashid Alafasy)
                const res = await fetch(
                    `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`
                );
                const data = await res.json();
                if (data.code === 200) {
                    setSurah(data.data);
                } else {
                    setError('Gagal memuat surah');
                }
            } catch (err) {
                setError('Gagal terhubung ke server');
            } finally {
                setLoading(false);
            }
        }
        fetchSurah();
    }, [surahNumber]);

    return { surah, loading, error };
}
