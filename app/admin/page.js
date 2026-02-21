'use client'
import { useEffect, useState } from 'react'

export default function AdminPage() {
    const [settings, setSettings] = useState(null)
    const [media, setMedia] = useState([])
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetch('/api/settings').then(r => r.json()).then(data => {
            if (!data.running_texts && data.footer_text) {
                data.running_texts = [data.footer_text]
            } else if (!data.running_texts) {
                data.running_texts = ["Mohon matikan ponsel anda."]
            }
            if (!data.theme) data.theme = "emerald"
            setSettings(data)
        })
        fetch('/api/media').then(r => r.json()).then(setMedia)
    }, [])

    const saveSettings = async () => {
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        })
        alert("Settings disimpan")
    }

    const saveMedia = async () => {
        await fetch('/api/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(media)
        })
        alert("Media disimpan")
    }

    const handleFileUpload = async (e, index) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true)
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                const copy = [...media];
                copy[index] = data.url;
                setMedia(copy);
            } else {
                alert("Upload gagal: " + data.error);
            }
        } catch (error) {
            alert("Upload error");
        } finally {
            setUploading(false);
        }
    }

    if (!settings) return <div className="p-10 flex items-center justify-center min-h-screen text-emerald-700">Loading...</div>

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-10">
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-emerald-800 mb-2">Pengaturan Layar Masjid</h1>
                    <p className="text-gray-500">Sesuaikan tampilan layar, tema, jadwal, dan jadwal media lainnya.</p>
                </div>

                <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-emerald-100">
                    <h2 className="text-2xl font-bold text-emerald-700 border-b border-emerald-100 pb-2">Informasi & Tema Masjid</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Masjid</label>
                            <input className="border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={settings.masjid_name || ''}
                                onChange={e => setSettings({ ...settings, masjid_name: e.target.value })}
                                placeholder="Contoh: Masjid Nurul Huda"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat / Lokasi</label>
                            <input className="border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={settings.address || ''}
                                onChange={e => setSettings({ ...settings, address: e.target.value })}
                                placeholder="Contoh: Jakarta Selatan"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tema Warna Layar</label>
                            <select className="border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={settings.theme || 'emerald'}
                                onChange={e => setSettings({ ...settings, theme: e.target.value })}
                            >
                                <option value="emerald">Zamrud Hijau (Default)</option>
                                <option value="blue">Biru Laut Malam</option>
                                <option value="purple">Ungu Tengah Malam</option>
                                <option value="desert">Padang Pasir (Emas)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Kata-kata Tambahan (Running Text)</label>
                        <p className="text-xs text-gray-500 mb-4">Teks ini akan berjalan secara bergantian di bagian bawah layar.</p>

                        <div className="space-y-3">
                            {settings.running_texts.map((text, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input className="border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        value={text}
                                        onChange={e => {
                                            const copy = [...settings.running_texts]
                                            copy[idx] = e.target.value
                                            setSettings({ ...settings, running_texts: copy })
                                        }}
                                        placeholder="Contoh: Harap luruskan shaf..."
                                    />
                                    <button onClick={() => {
                                        const copy = [...settings.running_texts]
                                        copy.splice(idx, 1)
                                        setSettings({ ...settings, running_texts: copy })
                                    }} className="bg-red-50 text-red-600 px-4 rounded-lg hover:bg-red-100 font-semibold border border-red-200">
                                        Hapus
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => {
                                setSettings({ ...settings, running_texts: [...settings.running_texts, ""] })
                            }} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-100 border border-emerald-200">
                                + Tambah Teks Baris
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-emerald-100">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude (Untuk Jadwal)</label>
                            <input className="border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                type="number" step="any"
                                value={settings.latitude || ''}
                                onChange={e => setSettings({ ...settings, latitude: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude (Untuk Jadwal)</label>
                            <input className="border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                type="number" step="any"
                                value={settings.longitude || ''}
                                onChange={e => setSettings({ ...settings, longitude: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Durasi per Slide (ms)</label>
                            <input className="border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                type="number"
                                value={settings.slide_duration || 15000}
                                onChange={e => setSettings({ ...settings, slide_duration: parseInt(e.target.value) || 15000 })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button onClick={saveSettings}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl w-full md:w-auto shadow-md transition-transform hover:scale-105">
                            Simpan Pengaturan
                        </button>
                    </div>
                </div>

                <div className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-emerald-100">
                    <h2 className="text-2xl font-bold text-emerald-700 mb-2">Media Slides Tambahan</h2>
                    <p className="text-sm text-gray-500 mb-6">Urutan slide layaknya presentasi: 1. Jadwal, 2. Hadist, kemudian diikuti daftar media di bawah ini.</p>

                    {media.map((m, i) => (
                        <div key={i} className="flex flex-col gap-3 p-5 border border-gray-200 rounded-xl bg-gray-50/50">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-gray-500 uppercase tracking-widest">Slide {i + 1}</span>
                                <button onClick={() => {
                                    const copy = [...media];
                                    copy.splice(i, 1);
                                    setMedia(copy);
                                }} className="text-red-500 hover:text-red-700 text-sm font-semibold">Hapus Slide</button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    className="border border-gray-300 rounded-lg p-3 flex-grow text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={m}
                                    onChange={e => {
                                        const copy = [...media]
                                        copy[i] = e.target.value
                                        setMedia(copy)
                                    }}
                                    placeholder="Input URL Media ATAU Pilih File Lokal..."
                                />
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => handleFileUpload(e, i)}
                                    className="text-sm text-gray-600 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer"
                                    disabled={uploading}
                                />
                            </div>
                            {m && m.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                                <img src={m} alt={`Preview Slide ${i + 1}`} className="h-40 object-cover mt-2 self-start rounded-lg border border-gray-200 shadow-sm" />
                            )}
                            {m && m.match(/\.(mp4|webm|ogg)$/i) && (
                                <video src={m} className="h-40 mt-2 self-start rounded-lg border border-gray-200 shadow-sm" controls />
                            )}
                        </div>
                    ))}

                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => setMedia([...media, ""])}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-6 py-3 rounded-xl border border-emerald-200">
                            + Tambah Slide
                        </button>

                        <button
                            onClick={saveMedia}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-105">
                            Simpan Media
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}