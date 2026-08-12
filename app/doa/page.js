'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './doa.module.css';

export default function DoaPage() {
  const [doa, setDoa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoa, setSelectedDoa] = useState(null);
  const [selectedGrup, setSelectedGrup] = useState('Semua');
  const detailRef = useRef(null);

  useEffect(() => {
    fetch('/api/doa')
      .then((res) => res.json())
      .then((data) => {
        const doaList = Array.isArray(data) ? data : data.data || [];
        setDoa(doaList);
        if (doaList.length > 0) {
          setSelectedDoa(doaList[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal memuat doa:', err);
        setLoading(false);
      });
  }, []);

  const handleSelectDoa = (item) => {
    setSelectedDoa(item);
    // Auto-scroll ke detail saat digunakan di layar mobile
    if (window.innerWidth <= 768 && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert('Teks Arab berhasil disalin!');
    }
  };

  const grupList = ['Semua', ...new Set(doa.map((d) => d.grup || d.kategori).filter(Boolean))];
  const filteredDoa =
    selectedGrup === 'Semua'
      ? doa
      : doa.filter((d) => (d.grup || d.kategori) === selectedGrup);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Kembali
        </Link>
        <h1 className={styles.title}>Doa Harian</h1>
        <p className={styles.subtitle}>Kumpulan doa-doa penting dalam kehidupan sehari-hari</p>
      </div>

      

      {/* Content */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <div className="spinner"></div>
            <p>Memuat doa-doa...</p>
          </div>
        ) : filteredDoa.length === 0 ? (
          <div className={styles.empty}>
            <p>Tidak ada doa ditemukan</p>
          </div>
        ) : (
          <div className={styles.doaGrid}>
            {/* Doa List */}
            <div className={styles.doaList}>
              {filteredDoa.map((doaItem) => {
                const title = doaItem.nama || doaItem.judul || 'Tanpa Judul';
                const previewText = doaItem.idn || doaItem.arti || doaItem.terjemahan || '';

                return (
                  <div
                    key={doaItem.id || doaItem.nama}
                    onClick={() => handleSelectDoa(doaItem)}
                    className={`${styles.doaCard} ${selectedDoa?.id === doaItem.id ? styles.selected : ''}`}
                  >
                    <div className={styles.doaCardHeader}>
                      <h3 className={styles.doaTitle}>{title}</h3>
                   
                    </div>
                     
                  </div>
                );
              })}
            </div>

            {/* Doa Detail */}
            {selectedDoa ? (
              <div ref={detailRef} className={styles.doaDetail}>
                <div className={styles.detailHeader}>
                  <h2 className={styles.detailTitle}>{selectedDoa.judul || selectedDoa.nama}</h2>
                  {(selectedDoa.kategori || selectedDoa.grup) && (
                    <span className={styles.detailKategori}>{selectedDoa.kategori || selectedDoa.grup}</span>
                  )}
                </div>

                <div className={styles.detailContent}>
                  {/* Arab */}
                  <div className={styles.section}>
                    <h3 className={styles.sectionLabel}>Teks Arab</h3>
                    <p className={styles.arab}>{selectedDoa.arab || selectedDoa.ar || 'Teks Arab tidak tersedia'}</p>
                  </div>

                  {/* Latin */}
                  <div className={styles.section}>
                    <h3 className={styles.sectionLabel}>Transliterasi</h3>
                    <p className={styles.latin}>{selectedDoa.latin || selectedDoa.tr || 'Transliterasi tidak tersedia'}</p>
                  </div>

                  {/* Arti */}
                  <div className={styles.section}>
                    <h3 className={styles.sectionLabel}>Arti</h3>
                    <p className={styles.arti}>{selectedDoa.arti || selectedDoa.idn || selectedDoa.terjemahan || 'Arti tidak tersedia'}</p>
                  </div>
                    {/* Arti */}
                  <div className={styles.section}>
                    <h3 className={styles.sectionLabel}>Keterangan Do'a</h3>
                    <p className={styles.arti}>{selectedDoa.tentang ||  'Keterangan tidak tersedia'}</p>
                  </div>
                </div>

                <button
                  className={styles.shareButton}
                  onClick={() => handleCopy(selectedDoa.arab || selectedDoa.ar)}
                >
                  📋 Salin Teks Arab
                </button>
              </div>
            ) : (
              <div className={styles.emptyDetail}>
                <p>👈 Pilih doa untuk melihat detail</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}