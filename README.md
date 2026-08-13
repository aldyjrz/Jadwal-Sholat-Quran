# Jadwal Sholat & Al-Quran

Aplikasi web untuk menampilkan jadwal sholat, waktu adzan, dan Al-Quran. Cocok digunakan untuk layar masjid atau pribadi.

## Fitur

- **Jadwal Sholat** - Waktu sholat harian berdasarkan lokasi (GPS atau kota populer) dengan metode perhitungan MWL
- **Al-Qur'an** - Baca dan dengarkan recitasi surah lengkap
- **Doa Harian** - Kumpulan doa sehari-hari dalam bahasa Arab, transliterasi, dan terjemahan
- **Hadist** - Tampilan hadist acak dari API hadist
- **Layar Masjid** - Mode tampilan khusus untuk layar/TV masjid dengan slideshow otomatis
  - Slide jadwal sholat, hadist, dan media (gambar/video)
  - Adzan otomatis dengan beep sound
  - Iqomah countdown (8 menit setelah adzan)
  - Perangkat lunak untuk pengujian (dev tools)
- **Panel Admin** - Manajemen masjid, tema layar, teks berjalan, durasi slide, dan media slides
- **Responsif** - Tampilan optimal untuk perangkat mobile dan desktop

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Aladhan API](https://aladhan.com/islamic-prayer-times-api) - Data jadwal sholat
- Docker-ready untuk deployment

## Getting Started

### Prerequisites

- Node.js >= 18
- npm (atau yarn/pnpm/bun)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment dengan Docker

Proyek ini dilengkapi Dockerfile dan docker-compose untuk deployment yang mudah.

```bash
docker-compose up --build -d
```

Aplikasi akan berjalan di port **3131**.

## Struktur Proyek

```
app/
├── admin/page.js          # Panel pengaturan admin
├── jadwal/page.js         # Halaman jadwal sholat
├── quran/[surah]/page.js  # Halaman Al-Quran per surah
├── doa/page.js            # Halaman doa harian
├── screen/page.js         # Mode layar masjid
├── api/                   # API routes (settings, media, doa, upload)
├── components/            # Komponen UI reusable
└── hooks/                 # Custom hooks (prayer times, quran)
data/                      # Data JSON (settings, media, doa)
```

## API Routes

| Route | Deskripsi |
|-------|-----------|
| `/api/settings` | GET/POST pengaturan aplikasi dan masjid |
| `/api/media` | GET/POST daftar media slides |
| `/api/doa` | GET daftar doa |
| `/api/upload` | POST upload file media |

## Konfigurasi

Masukkan preferensi melalui panel admin (`/admin`):

1. Tambahkan data masjid (nama, alamat, koordinat)
2. Pilih tema warna layar
3. Atur durasi slide dan teks berjalan
4. Upload media slides (gambar/video)
