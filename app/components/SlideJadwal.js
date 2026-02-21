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

    const activeTheme = THEMES[settings?.theme] || THEMES.emerald;

    // Construct single running text from array
    let runningTextStr = "Silakan atur teks berjalan pada pengaturan masjid.";
    if (settings?.running_texts && settings.running_texts.length > 0) {
        runningTextStr = settings.running_texts.filter(t => t.trim() !== "").join(' ✦ ');
    } else if (settings?.footer_text) {
        runningTextStr = settings.footer_text;
    }

    return (
        <div className={`w-screen h-screen flex flex-col justify-between bg-gradient-to-br ${activeTheme.bg} text-white relative overflow-hidden`}>
            <div className="flex-1 flex flex-col items-center justify-center pt-10 relative z-10">
                <h1 className={`text-6xl font-extrabold ${activeTheme.accent} drop-shadow-lg mb-2 text-center`}>{settings?.masjid_name}</h1>
                <p className="text-2xl text-gray-300 mb-12 drop-shadow-md text-center">{settings?.address}</p>

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

                <div className="mt-20 px-24 text-center max-w-5xl">
                    <p className="text-2xl font-light italic text-gray-200 leading-relaxed drop-shadow-sm">"{hadist}"</p>
                </div>
            </div>

            {/* Pattern Overlay for Islamic feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className={`${activeTheme.marqueeBg} text-white text-3xl font-bold py-5 px-2 marquee-container z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center`}>
                <div className="marquee-text flex gap-8 whitespace-nowrap">
                    <span>{runningTextStr}</span>
                    <span className="text-gray-500 font-light">✦</span>
                    <span>{runningTextStr}</span>
                </div>
            </div>
        </div>
    )
}