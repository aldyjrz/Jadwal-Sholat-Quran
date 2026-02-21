'use client'
import { useEffect, useState } from 'react'

const PRAYER_LIST = [
    { name: 'Subuh', key: 'Fajr' },
    { name: 'Dzuhur', key: 'Dhuhr' },
    { name: 'Ashar', key: 'Asr' },
    { name: 'Maghrib', key: 'Maghrib' },
    { name: 'Isya', key: 'Isha' },
]

export default function ScreenOverlay({ settings, providedPrayerTimes, providedNextPrayer }) {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [countdownStr, setCountdownStr] = useState("")

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (!providedPrayerTimes || !providedNextPrayer) {
            setCountdownStr("")
            return
        }
        const adzanStr = providedPrayerTimes[providedNextPrayer]
        if (!adzanStr) return
        const [h, m] = adzanStr.split(':').map(Number)
        const adzanTime = new Date()
        adzanTime.setHours(h)
        adzanTime.setMinutes(m)
        adzanTime.setSeconds(0)

        const diff = adzanTime.getTime() - currentTime.getTime()
        if (diff > 0) {
            const mDiff = Math.floor(diff / (1000 * 60))
            const sDiff = Math.floor((diff / 1000) % 60)
            setCountdownStr(` - ${mDiff} Menit ${sDiff} Detik`)
        } else {
            setCountdownStr("")
        }
    }, [currentTime, providedPrayerTimes, providedNextPrayer])

    let runningTextStr = "Silakan atur teks berjalan pada pengaturan masjid.";
    if (settings?.running_texts && settings.running_texts.length > 0) {
        runningTextStr = settings.running_texts.filter(t => t.trim() !== "").join(' ✦\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0');
    } else if (settings?.footer_text) {
        runningTextStr = settings.footer_text;
    }

    const nextPrayerName = PRAYER_LIST.find(p => p.key === providedNextPrayer)?.name || ""

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-40">
            {/* Top Header Overlay */}
            <div className="bg-gradient-to-b from-black/80 to-transparent pt-8 pb-16 px-10 flex justify-between items-start">
                <div className="text-white drop-shadow-md">
                    <h1 className="text-4xl font-extrabold text-white mb-2">{settings?.masjid_name}</h1>
                    <p className="text-xl text-gray-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {settings?.address}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-lg text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-3xl font-semibold tracking-wider">
                            {currentTime.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                            <span className="text-sm opacity-70 ml-1">{currentTime.getSeconds().toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                    {countdownStr && nextPrayerName && (
                        <div className="bg-red-600/90 text-white px-5 py-2 rounded-full border border-red-400 font-bold uppercase tracking-wider text-sm shadow-lg whitespace-nowrap animate-pulse">
                            Menuju {nextPrayerName} {countdownStr}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Marquee Overlay */}
            <div className="bg-black/60 backdrop-blur-md border-t border-white/10 text-white text-3xl font-bold py-5 px-2 marquee-container shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex items-center">
                <div className="marquee-text flex gap-32 whitespace-nowrap drop-shadow-md">
                    <span>{runningTextStr}</span>
                    <span className="text-gray-400 font-light mt-1">✦</span>
                    <span>{runningTextStr}</span>
                </div>
            </div>
        </div>
    )
}
