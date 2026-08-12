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
        accent: "text-yellow-400",
        activeBorder: "border-yellow-400"
    },
    blue: {
        accent: "text-cyan-400",
        activeBorder: "border-cyan-400"
    },
    purple: {
        accent: "text-pink-400",
        activeBorder: "border-pink-400"
    },
    desert: {
        accent: "text-yellow-300",
        activeBorder: "border-yellow-300"
    }
}

export default function SlideMedia({ src, providedPrayerTimes, providedNextPrayer, settings }) {
    const activeTheme = THEMES[settings?.theme] || THEMES.emerald;
    
    if (!src) return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <h1 className="text-white text-4xl">Tidak ada media</h1>
        </div>
    )

    const isVideo = src.match(/\.(mp4|webm|ogg)$/i)

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center relative overflow-hidden">
            {isVideo ? (
                <video
                    src={src}
                    className="w-full h-full object-cover"
                    style={{ marginLeft: '128px' }}
                    autoPlay
                    loop
                    muted
                />
            ) : (
                <img
                    src={src}
                    className="w-full h-full object-cover"
                    style={{ marginLeft: '128px' }}
                    alt="media"
                />
            )}

            {/* Prayer Times - Left Sidebar */}
            {providedPrayerTimes && (
                <div className="fixed left-0 top-0 h-screen w-32 bg-black/50 backdrop-blur-md border-r border-white/20 flex flex-col items-center justify-center gap-2 py-8 z-20">
                    <div className="text-center mb-4">
                        <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Jadwal</p>
                        <p className="text-xs text-white/60">Sholat</p>
                    </div>
                    <div className="w-12 h-px bg-white/30 mb-2"></div>
                    {PRAYER_LIST.map((p) => {
                        const isNextPrayer = p.key === providedNextPrayer;
                        const baseClass = 'flex flex-col items-center py-2 px-2 rounded transition-all duration-300';
                        const activeClass = isNextPrayer 
                            ? `bg-white/25 scale-110 ${activeTheme.activeBorder} border-l-2`
                            : 'opacity-70 hover:opacity-90';
                        const accentClass = isNextPrayer ? activeTheme.accent : 'text-white';
                        
                        return (
                            <div key={p.key} className={`${baseClass} ${activeClass}`}>
                                <span className="text-lg">{p.icon}</span>
                                <p className="text-xs font-semibold text-white/90 uppercase tracking-widest mt-1">{p.name}</p>
                                <p className={`text-sm font-bold mt-1 ${accentClass}`}>
                                    {providedPrayerTimes[p.key] || '--:--'}
                                </p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )}