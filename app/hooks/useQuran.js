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
    const [translationEn, setTranslationEn] = useState(null);
    const [translationId, setTranslationId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!surahNumber) return;

        async function fetchSurah() {
            setLoading(true);
            try {
                // Fetch Arabic+audio, English translation, and Indonesian translation in parallel
                const [arabicRes, enRes, idRes] = await Promise.all([
                    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`),
                    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
                    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/id.indonesian`),
                ]);

                const arabicData = await arabicRes.json();
                const enData = await enRes.json();
                const idData = await idRes.json();

                if (arabicData.code === 200) {
                    setSurah(arabicData.data);
                } else {
                    setError('Gagal memuat surah');
                }

                if (enData.code === 200) setTranslationEn(enData.data);
                if (idData.code === 200) setTranslationId(idData.data);
            } catch (err) {
                setError('Gagal terhubung ke server');
            } finally {
                setLoading(false);
            }
        }
        fetchSurah();
    }, [surahNumber]);

    return { surah, translationEn, translationId, loading, error };
}
