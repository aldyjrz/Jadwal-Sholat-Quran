'use client'
import { useEffect, useState } from 'react'

export default function SlideMedia({ src }) {
    if (!src) return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            <h1 className="text-white text-4xl">Tidak ada media</h1>
        </div>
    )

    const isVideo = src.match(/\.(mp4|webm|ogg)$/i)

    return (
        <div className="w-full h-screen bg-black flex items-center justify-center">
            {isVideo ? (
                <video
                    src={src}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                />
            ) : (
                <img
                    src={src}
                    className="w-full h-full object-cover"
                    alt="media"
                />
            )}
        </div>
    )
}