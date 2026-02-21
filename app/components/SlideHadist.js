'use client'
import { useEffect, useState } from 'react'

export default function SlideHadist() {
    const [hadist, setHadist] = useState("")

    useEffect(() => {
        fetch('https://api.hadith.sutanlab.id/random')
            .then(res => res.json())
            .then(data => {
                setHadist(data?.data?.contents?.arab || "")
            })
    }, [])

    return (
        <div className="w-screen h-screen bg-black text-white flex items-center justify-center p-20 text-center">
            <p className="text-4xl leading-relaxed">{hadist}</p>
        </div>
    )
}