'use client'
import { useEffect, useState } from 'react'

const PRAYER_LIST = [
    { name: 'Subuh', key: 'Fajr', icon: '🌅' },
    { name: 'Dzuhur', key: 'Dhuhr', icon: '☀️' },
    { name: 'Ashar', key: 'Asr', icon: '🌤️' },
    { name: 'Maghrib', key: 'Maghrib', icon: '🌇' },
    { name: 'Isya', key: 'Isha', icon: '🌙' },
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

export default function SlideHadist({ settings, selectedMosque, providedPrayerTimes, providedNextPrayer }) {
    const [hadist, setHadist] = useState("")
    const activeTheme = THEMES[settings?.theme] || THEMES.emerald;

    useEffect(() => {

        async function fetchHadist() {
            try {
                const res = await fetch(
                    'https://raw.githubusercontent.com/renomureza/hadis-api-id/refs/heads/main/src/data/bukhari.json'
                );
                const data = await res.json();

                const randomIndex = Math.floor(Math.random() * data.length);
                // Extract only the string (id) from the object to prevent rendering errors
                setHadist(data[randomIndex]?.id || "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.");
            } catch (error) {
                console.error('Gagal mengambil hadist:', error);
                setHadist("Berbahagialah orang yang selalu merasa cukup dengan pemberian Tuhan.");
            }
        }

        fetchHadist();

    }, [])

    return (
        <div className={`w-screen h-screen flex flex-col justify-between bg-gradient-to-br ${activeTheme.bg} text-white relative overflow-hidden`}>
            {/* Hadist Content */}
            <div className="fixed inset-0 w-screen h-screen text-white flex items-center justify-center p-20 text-center" style={{ marginLeft: '128px', width: 'calc(100% - 128px)' }}>
                <p className="text-sm text-gray-300 leading-relaxed font-light italic">\"{ hadist }\"</p>
            </div>

            {/* Prayer Times - Left Sidebar */}
            {providedPrayerTimes && (
                <div className="fixed left-0 top-0 h-screen w-32 bg-black/40 backdrop-blur-md border-r border-white/10 flex flex-col items-center justify-center gap-2 py-8 z-20">
                    <div className="text-center mb-4">
                        <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Jadwal</p>
                        <p className="text-xs text-white/50">Sholat</p>
                    </div>
                    <div className="w-12 h-px bg-white/20 mb-2"></div>
                    {PRAYER_LIST.map((p) => {
                        const isNextPrayer = p.key === providedNextPrayer;
                        const baseClass = 'flex flex-col items-center py-2 px-2 rounded transition-all duration-300';
                        const activeClass = isNextPrayer 
                            ? `bg-white/20 scale-110 ${activeTheme.activeBorder.split(' ')[0]} border-l-2`
                            : 'opacity-60 hover:opacity-80';
                        const accentClass = isNextPrayer ? activeTheme.accent : 'text-white';
                        
                        return (
                            <div key={p.key} className={`${baseClass} ${activeClass}`}>
                                <span className="text-lg">{p.icon}</span>
                                <p className="text-xs font-semibold text-white uppercase tracking-widest mt-1">{p.name}</p>
                                <p className={`text-sm font-bold mt-1 ${accentClass}`}>
                                    {providedPrayerTimes[p.key] || '--:--'}
                                </p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}