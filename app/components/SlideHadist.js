'use client'
import { useEffect, useState } from 'react'

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

export default function SlideHadist({ settings }) {
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

            <div className="fixed inset-0 w-screen h-screen  text-white flex items-center justify-center p-20 text-center">
                <p className="text-sm text-gray-300 leading-relaxed font-light italic">"{hadist}"</p>
            </div>
        </div>
    )
}