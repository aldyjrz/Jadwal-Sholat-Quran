'use client'
import { useEffect, useState } from 'react'

const PRAYER_LIST = [
    { name: 'Subuh', key: 'Fajr' },
    { name: 'Dzuhur', key: 'Dhuhr' },
    { name: 'Ashar', key: 'Asr' },
    { name: 'Maghrib', key: 'Maghrib' },
    { name: 'Isya', key: 'Isha' },
]

const THEMES = {
    emerald: {
        bg: "from-emerald-900 via-emerald-800 to-black",
        marqueeBg: "bg-emerald-950/80 border-t border-emerald-900",
        accent: "text-yellow-400",
        activeBorder: "border-yellow-400 shadow-yellow-400/50"
    },
    blue: {
        bg: "from-slate-900 via-blue-900 to-black",
        marqueeBg: "bg-blue-950/80 border-t border-blue-900",
        accent: "text-cyan-400",
        activeBorder: "border-cyan-400 shadow-cyan-400/50"
    },
    purple: {
        bg: "from-indigo-900 via-purple-900 to-black",
        marqueeBg: "bg-purple-950/80 border-t border-purple-900",
        accent: "text-pink-400",
        activeBorder: "border-pink-400 shadow-pink-400/50"
    },
    desert: {
        bg: "from-yellow-900 via-amber-900 to-black",
        marqueeBg: "bg-amber-950/80 border-t border-amber-900",
        accent: "text-yellow-300",
        activeBorder: "border-yellow-300 shadow-yellow-300/50"
    }
}

export default function SlideJadwal({ settings, providedPrayerTimes, providedNextPrayer }) {
    const [hadist, setHadist] = useState("")
    const [currentTime, setCurrentTime] = useState(new Date())
    const [countdownStr, setCountdownStr] = useState("")

    useEffect(() => {
        // Fetch random hadith
        fetch('https://raw.githubusercontent.com/renomureza/hadis-api-id/refs/heads/main/src/data/bukhari.json')
            .then(res => res.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.length);
                setHadist(data[randomIndex]?.id || "Belajar memaafkan adalah sifat orang beriman")
            })
            .catch(() => setHadist("Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain."))
    }, [])

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
            setCountdownStr(` - ${mDiff} Menit ${sDiff} Detik Lagi`)
        } else {
            setCountdownStr("") // Waktu sholat sudah lewat atau sedang berlangsung
        }

    }, [currentTime, providedPrayerTimes, providedNextPrayer])

    const activeTheme = THEMES[settings?.theme] || THEMES.emerald;

    // Construct single running text from array
    let runningTextStr = "Silakan atur teks berjalan pada pengaturan masjid.";
    if (settings?.running_texts && settings.running_texts.length > 0) {
        runningTextStr = settings.running_texts.filter(t => t.trim() !== "").join(' ✦\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0');
    } else if (settings?.footer_text) {
        runningTextStr = settings.footer_text;
    }

    const nextPrayerName = PRAYER_LIST.find(p => p.key === providedNextPrayer)?.name || ""

    return (
        <div className={`w-screen h-screen flex flex-col justify-between bg-gradient-to-br ${activeTheme.bg} text-white relative overflow-hidden`}>
            {/* Top Bar - Live Clock */}
            <div className="absolute top-8 right-12 z-20 flex items-center gap-4 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-4xl font-semibold tracking-wider">
                    {currentTime.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    <span className="text-lg opacity-60 ml-1">{currentTime.getSeconds().toString().padStart(2, '0')}</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center pt-10 relative z-10 w-full">
                <h1 className={`text-6xl font-extrabold ${activeTheme.accent} drop-shadow-lg mb-2 text-center`}>{settings?.masjid_name}</h1>
                <p className="text-2xl text-gray-300 drop-shadow-md text-center flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {settings?.address}
                </p>

                {/* Countdown display */}
                {countdownStr && nextPrayerName && (
                    <div className="my-8 animate-pulse text-lg tracking-widest uppercase bg-white/10 px-8 py-2 rounded-full border border-white/20">
                        Menuju <span className="font-bold">{nextPrayerName}</span>{countdownStr}
                    </div>
                )}
                {!countdownStr && <div className="my-8 h-10"></div> /* Spacer */}

                <div className="grid grid-cols-5 gap-8 w-full max-w-6xl px-10">
                    {PRAYER_LIST.map(p => (
                        <div key={p.key}
                            className={`p-8 bg-black/40 backdrop-blur-md rounded-2xl text-center shadow-2xl transition-all duration-500
                ${p.key === providedNextPrayer ? `border-2 ${activeTheme.activeBorder} scale-110 bg-black/60` : 'border border-gray-700/50'}`}>
                            <div className="text-xl font-medium tracking-widest mb-2 uppercase text-gray-300">{p.name}</div>
                            <div className={`text-5xl font-bold ${p.key === providedNextPrayer ? activeTheme.accent : 'text-white'}`}>
                                {providedPrayerTimes?.[p.key] || '--:--'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 px-24 text-center max-w-5xl">
                    <p className="text-sm font-light italic text-gray-300 leading-relaxed drop-shadow-sm">{hadist}</p>
                </div>
            </div>

            {/* Pattern Overlay for Islamic feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className={`${activeTheme.marqueeBg} text-white text-4xl font-bold py-6 px-2 marquee-container z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center`}>
                <div className="marquee-text flex gap-32 whitespace-nowrap">
                    <span>{runningTextStr}</span>
                    <span className="text-gray-500 font-light mt-1">✦</span>
                    <span>{runningTextStr}</span>
                </div>
            </div>
        </div>
    )
}