'use client'

import { useEffect, useState } from 'react';
import SlideJadwal from '../components/SlideJadwal';
import SlideHadist from '../components/SlideHadist';
import SlideMedia from '../components/SlideMedia';
import ScreenOverlay from '../components/ScreenOverlay';
import MosqueSelector from '../components/MosqueSelector';
import { playAdzanBeep, playIqomahBeep, playWarningBeep } from '../utils/alarmUtils';

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
    const [selectedMosque, setSelectedMosque] = useState(null)
    const [index, setIndex] = useState(0)
    const [customCountdownTime, setCustomCountdownTime] = useState(20)

    const [prayerTimes, setPrayerTimes] = useState(null)
    const [nextPrayer, setNextPrayer] = useState(null)
    const [countdown, setCountdown] = useState(null)
    const [iqomahCountdown, setIqomahCountdown] = useState(null)
    const [lastAdzanTime, setLastAdzanTime] = useState(null)
    const [showDevTools, setShowDevTools] = useState(false)
    const [isTestMode, setIsTestMode] = useState(false)
    const [isTestIqomahMode, setIsTestIqomahMode] = useState(false)

    // Load initial data
    useEffect(() => {
        fetch('/api/media')
            .then(r => r.json())
            .then(data => setSlides(["jadwal", "hadist", ...data]))

        fetch('/api/settings')
            .then(r => r.json())
            .then(data => {
                setSettings(data)
                // Get selected mosque from settings
                if (data.selected_mosque_id && data.mosques) {
                    const mosque = data.mosques.find(m => m.id === data.selected_mosque_id)
                    if (mosque) {
                        setSelectedMosque(mosque)
                    }
                }
            })
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
                    `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${selectedMosque.latitude}&longitude=${selectedMosque.longitude}&method=20`
                )
                const data = await res.json()
                if (data.code === 200) {
                    setPrayerTimes(data.data.timings)
                }
            } catch (err) {
                console.error("Failed to fetch prayers", err);
            }
        }
        if (selectedMosque) fetchPrayers()
    }, [selectedMosque])

    // Calculate next prayer
    useEffect(() => {
        if (!prayerTimes) return
        setNextPrayer(getNextPrayerKey(prayerTimes))
    }, [prayerTimes])

    // Countdown timer untuk test (menghitung mundur)
    useEffect(() => {
        if (countdown === null) return

        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval)
                    // Trigger adzan beep saat countdown habis
                    playAdzanBeep()
                    playAdzanBeep()
                    console.log('🔔 Test ADZAN Selesai!')
                    setIsTestMode(false) // End test mode
                    return null
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(countdownInterval)
    }, [countdown, isTestMode])

    // Countdown timer untuk iqomah test (menghitung mundur)
    useEffect(() => {
        if (iqomahCountdown === null) return

        const countdownInterval = setInterval(() => {
            setIqomahCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval)
                    // Trigger iqomah beep saat countdown habis
                    playIqomahBeep()
                    playIqomahBeep()
                    console.log('🕐 Test IQOMAH Selesai!')
                    setIsTestIqomahMode(false) // End test mode
                    return null
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(countdownInterval)
    }, [iqomahCountdown, isTestIqomahMode])

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

            // Skip prayer time logic jika dalam test mode
            if (!isTestMode) {
                // ===== ADZAN COUNTDOWN (20 DETIK) =====
                if (diff <= 20000 && diff > 0) {
                    const countdownSec = Math.floor(diff / 1000)
                    setCountdown(countdownSec)
                    setIndex(0) // Force to jadwal slide
                    
                    // Beep every second dalam 20 detik terakhir
                    if (countdownSec > 0 && countdownSec <= 3) {
                        playWarningBeep()
                    }
                } 
                // ===== ADZAN TIME! =====
                else if (diff <= 0 && diff > -1000) {
                    setIndex(0)
                    playAdzanBeep() // Triple beep untuk adzan
                    playAdzanBeep() // Double call untuk suara lebih keras
                    setCountdown(null)
                    setLastAdzanTime(now) // Track waktu adzan
                    
                    // Log untuk debugging
                    console.log(`🔔 ADZAN ${nextPrayer} pada ${now.toLocaleTimeString()}`);
                }
                // ===== NORMAL MODE =====
                else {
                    setCountdown(null)
                }
            }

            // ===== IQOMAH (8 MENIT SETELAH ADZAN) =====
            if (lastAdzanTime && !isTestIqomahMode) {
                const iqomahTime = new Date(lastAdzanTime.getTime() + 8 * 60 * 1000)
                const iqomahDiff = iqomahTime.getTime() - now.getTime()

                // Beep untuk iqomah 30 detik sebelum
                if (iqomahDiff <= 30000 && iqomahDiff > 29000) {
                    setIqomahCountdown(Math.floor(iqomahDiff / 1000))
                }
                
                // IQOMAH TIME!
                if (iqomahDiff <= 0 && iqomahDiff > -1000) {
                    playIqomahBeep() // Double beep untuk iqomah
                    playIqomahBeep()
                    setIqomahCountdown(null)
                    setLastAdzanTime(null) // Reset
                    
                    console.log(`🕐 IQOMAH ${nextPrayer} pada ${now.toLocaleTimeString()}`);
                }
            }
        }, 100) // Update lebih sering untuk akurasi

        return () => clearInterval(interval)
    }, [prayerTimes, nextPrayer, lastAdzanTime, isTestMode, isTestIqomahMode])

    const current = slides[index]

    if (!settings) return null

    // Show mosque selector if no mosque is selected
    if (!selectedMosque) {
        return <MosqueSelector onMosqueSelected={() => {
            // Refresh settings to get the selected mosque
            fetch('/api/settings')
                .then(r => r.json())
                .then(data => {
                    setSettings(data)
                    if (data.selected_mosque_id && data.mosques) {
                        const mosque = data.mosques.find(m => m.id === data.selected_mosque_id)
                        if (mosque) {
                            setSelectedMosque(mosque)
                        }
                    }
                })
        }} />
    }

    return (
        <div className="relative bg-black w-screen h-screen overflow-hidden">
            {current === "jadwal" && <SlideJadwal settings={settings} selectedMosque={selectedMosque} providedPrayerTimes={prayerTimes} providedNextPrayer={nextPrayer} />}
            {current === "hadist" && <SlideHadist settings={settings} selectedMosque={selectedMosque} providedPrayerTimes={prayerTimes} providedNextPrayer={nextPrayer} />}
            {current !== "jadwal" && current !== "hadist" && <SlideMedia src={current} providedPrayerTimes={prayerTimes} providedNextPrayer={nextPrayer} />}

            {/* Display Header/Footer overlay on all slides except 'jadwal' */}
            {current !== "jadwal" && (
                <ScreenOverlay settings={settings} selectedMosque={selectedMosque} providedPrayerTimes={prayerTimes} providedNextPrayer={nextPrayer} />
            )}

            {/* ADZAN COUNTDOWN */}
            {countdown !== null && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="text-center">
                        <div className="bg-red-600 px-16 py-10 text-8xl rounded-3xl animate-pulse font-bold shadow-[0_0_50px_rgba(255,0,0,0.5)] text-white mb-4">
                            {countdown}
                        </div>
                        <p className="text-white text-2xl mt-4 animate-bounce">Adzan dalam {countdown} detik</p>
                    </div>
                </div>
            )}

            {/* IQOMAH COUNTDOWN */}
            {iqomahCountdown !== null && (
                <div className="absolute inset-0 bg-blue-900/80 flex items-center justify-center z-50">
                    <div className="text-center">
                        <div className="bg-blue-600 px-16 py-10 text-7xl rounded-3xl animate-pulse font-bold shadow-[0_0_50px_rgba(59,130,246,0.5)] text-white mb-4">
                            {iqomahCountdown}
                        </div>
                        <p className="text-white text-2xl mt-4 animate-bounce">Iqomah dimulai dalam {iqomahCountdown} detik</p>
                    </div>
                </div>
            )}

            {/* DEV TOOLS - Testing */}
            <div className="fixed bottom-4 right-4 z-40">
                <button
                    onClick={() => setShowDevTools(!showDevTools)}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-xs font-mono border border-gray-600"
                >
                    🔧 Dev
                </button>
                
                {showDevTools && (
                    <div className="absolute bottom-12 right-0 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-xs font-mono space-y-2 w-56">
                        <div className="border-b border-gray-700 pb-2">
                            <p>⏰ Adzan Test:</p>
                            <div className="flex gap-1 mt-1">
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={customCountdownTime}
                                    onChange={(e) => setCustomCountdownTime(parseInt(e.target.value) || 20)}
                                    className="bg-gray-800 border border-gray-600 rounded px-2 py-1 w-16 text-white text-xs"
                                    placeholder="detik"
                                />
                                <button
                                    onClick={() => {
                                        setCountdown(customCountdownTime);
                                        setIndex(0);
                                        setIsTestMode(true);
                                    }}
                                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded flex-1 text-xs"
                                >
                                    Test {customCountdownTime}s
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    playAdzanBeep();
                                    playAdzanBeep();
                                }}
                                className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded w-full mt-1 text-xs"
                            >
                                Test Adzan Beep
                            </button>
                        </div>
                        
                        <div className="border-b border-gray-700 pb-2">
                            <p>🕐 Iqomah Test:</p>
                            <button
                                onClick={() => {
                                    setIqomahCountdown(30);
                                    setIndex(0);
                                    setIsTestIqomahMode(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded w-full mt-1 text-xs"
                            >
                                Test Iqomah 30s
                            </button>
                            <button
                                onClick={() => {
                                    playIqomahBeep();
                                    playIqomahBeep();
                                }}
                                className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded w-full mt-1 text-xs"
                            >
                                Test Iqomah Beep
                            </button>
                        </div>

                        <div>
                            <p>ℹ️ Info:</p>
                            <p className="text-gray-400">
                                Next: {PRAYER_LIST.find(p => p.key === nextPrayer)?.name || 'N/A'}
                            </p>
                            <p className="text-gray-400">
                                Time: {prayerTimes?.[nextPrayer] || '--:--'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}