'use client'

import { useEffect, useState } from 'react';
import SlideJadwal from '../components/SlideJadwal';
import SlideHadist from '../components/SlideHadist';
import SlideMedia from '../components/SlideMedia';
import ScreenOverlay from '../components/ScreenOverlay';

const PRAYER_LIST = [
    { name: 'Subuh', key: 'Fajr' },
    { name: 'Dzuhur', key: 'Dhuhr' },
    { name: 'Ashar', key: 'Asr' },
    { name: 'Maghrib', key: 'Maghrib' },
    { name: 'Isya', key: 'Isha' },
]

function getNextPrayerKey(prayerTimes) {
    if (!prayerTimes) return null
    const now = new Date()
    const currentMin = now.getHours() * 60 + now.getMinutes()

    for (const p of PRAYER_LIST) {
        const time = prayerTimes[p.key]
        if (time) {
            const [h, m] = time.split(':').map(Number)
            if (h * 60 + m > currentMin) return p.key
        }
    }
    return null
}

export default function DisplayPage() {
    const [slides, setSlides] = useState([])
    const [settings, setSettings] = useState(null)
    const [index, setIndex] = useState(0)

    const [prayerTimes, setPrayerTimes] = useState(null)
    const [nextPrayer, setNextPrayer] = useState(null)
    const [countdown, setCountdown] = useState(null)

    // Load initial data
    useEffect(() => {
        fetch('/api/media')
            .then(r => r.json())
            .then(data => setSlides(["jadwal", "hadist", ...data]))

        fetch('/api/settings')
            .then(r => r.json())
            .then(setSettings)
    }, [])

    // Slide interval logic
    useEffect(() => {
        if (!settings || slides.length === 0) return

        // Pause slideshow if countdown is active
        if (countdown !== null) return

        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % slides.length)
        }, settings.slide_duration || 15000)

        return () => clearInterval(interval)
    }, [slides, settings, countdown])

    // Fetch Prayer Times
    useEffect(() => {
        const fetchPrayers = async () => {
            const today = new Date()
            const dd = String(today.getDate()).padStart(2, '0')
            const mm = String(today.getMonth() + 1).padStart(2, '0')
            const yyyy = today.getFullYear()

            try {
                const res = await fetch(
                    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${settings.latitude}&longitude=${settings.longitude}&method=20`
                )
                const data = await res.json()
                if (data.code === 200) {
                    setPrayerTimes(data.data.timings)
                }
            } catch (err) {
                console.error("Failed to fetch prayers", err);
            }
        }
        if (settings) fetchPrayers()
    }, [settings])

    // Calculate next prayer
    useEffect(() => {
        if (!prayerTimes) return
        setNextPrayer(getNextPrayerKey(prayerTimes))
    }, [prayerTimes])

    // Countdown and Adzan execution logic (Always runs)
    useEffect(() => {
        if (!prayerTimes || !nextPrayer) return

        const interval = setInterval(() => {
            const now = new Date()
            const [h, m] = prayerTimes[nextPrayer].split(':').map(Number)
            const adzan = new Date()
            adzan.setHours(h)
            adzan.setMinutes(m)
            adzan.setSeconds(0)

            const diff = adzan.getTime() - now.getTime()

            if (diff <= 10000 && diff > 0) {
                // Return to Jadwal slide forcefully!
                setIndex(0)
                setCountdown(Math.floor(diff / 1000))
            } else if (diff <= 0 && diff > -1000) {
                setIndex(0)
                new Audio('/alarm.mp3').play().catch(() => { })
                setCountdown(null)
            } else {
                setCountdown(null)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [prayerTimes, nextPrayer])

    const current = slides[index]

    if (!settings) return null

    return (
        <div className="relative bg-black w-screen h-screen overflow-hidden">
            {current === "jadwal" && <SlideJadwal settings={settings} providedPrayerTimes={prayerTimes} providedNextPrayer={nextPrayer} />}
            {current === "hadist" && <SlideHadist settings={settings} />}
            {current !== "jadwal" && current !== "hadist" && <SlideMedia src={current} />}

            {/* Display Header/Footer overlay on all slides except 'jadwal' */}
            {current !== "jadwal" && (
                <ScreenOverlay settings={settings} providedPrayerTimes={prayerTimes} providedNextPrayer={nextPrayer} />
            )}

            {countdown !== null && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-red-600 px-16 py-10 text-8xl rounded-3xl animate-pulse font-bold shadow-[0_0_50px_rgba(255,0,0,0.5)] text-white">
                        Adzan dalam {countdown} detik
                    </div>
                </div>
            )}
        </div>
    )
}