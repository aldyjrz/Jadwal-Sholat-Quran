'use client';

import { useState, useEffect } from 'react';
import styles from './MosqueSelector.module.css';

export default function MosqueSelector({ onMosqueSelected }) {
  const [settings, setSettings] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    masjid_name: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const handleSelectMosque = async (mosqueId) => {
    try {
      const updated = { ...settings, selected_mosque_id: mosqueId };
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setSettings(updated);
        onMosqueSelected?.(mosqueId);
      }
    } catch (error) {
      console.error('Error selecting mosque:', error);
    }
  };

  const handleAddMosque = async (e) => {
    e.preventDefault();
    if (!formData.masjid_name || !formData.address || !formData.latitude || !formData.longitude) {
      alert('Semua field harus diisi');
      return;
    }

    try {
      const newMosque = {
        id: Date.now().toString(),
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      const mosques = settings.mosques ? [...settings.mosques, newMosque] : [newMosque];
      const updated = {
        ...settings,
        mosques,
        selected_mosque_id: newMosque.id
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });

      if (res.ok) {
        setSettings(updated);
        setFormData({ masjid_name: '', address: '', latitude: '', longitude: '' });
        setShowForm(false);
        onMosqueSelected?.(newMosque.id);
      }
    } catch (error) {
      console.error('Error adding mosque:', error);
      alert('Gagal menambah masjid');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  const mosques = settings?.mosques || [];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>🕌 Pilih Masjid</h1>
          <p className={styles.subtitle}>Pilih masjid Anda untuk menampilkan layar</p>
        </div>

        {mosques.length > 0 && (
          <div className={styles.mosqueList}>
            <h2 className={styles.sectionTitle}>Daftar Masjid Terdaftar</h2>
            <div className={styles.list}>
              {mosques.map((mosque) => (
                <div key={mosque.id} className={styles.mosqueItem}>
                  <div className={styles.mosqueInfo}>
                    <h3 className={styles.mosqueName}>{mosque.masjid_name}</h3>
                    <p className={styles.mosqueAddress}>{mosque.address}</p>
                    <p className={styles.mosqueCoords}>
                      📍 {mosque.latitude.toFixed(4)}, {mosque.longitude.toFixed(4)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectMosque(mosque.id)}
                    className={`${styles.selectBtn} ${settings?.selected_mosque_id === mosque.id ? styles.selected : ''}`}
                  >
                    {settings?.selected_mosque_id === mosque.id ? '✓ Dipilih' : 'Pilih'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className={styles.addBtn}
          >
            + Tambah Masjid Baru
          </button>
        ) : (
          <form onSubmit={handleAddMosque} className={styles.form}>
            <h2 className={styles.sectionTitle}>Daftarkan Masjid Baru</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Nama Masjid *</label>
              <input
                type="text"
                placeholder="Contoh: Masjid Nurul Huda"
                value={formData.masjid_name}
                onChange={(e) => setFormData({ ...formData, masjid_name: e.target.value })}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Alamat *</label>
              <input
                type="text"
                placeholder="Contoh: Jl. Ahmad Yani No. 10"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Latitude *</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Contoh: -6.2088"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Longitude *</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="Contoh: 106.8456"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <p className={styles.hint}>
              💡 Dapatkan koordinat dari Google Maps dengan klik kanan → Koordinat
            </p>

            <div className={styles.formButtons}>
              <button
                type="submit"
                className={styles.submitBtn}
              >
                Daftarkan Masjid
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={styles.cancelBtn}
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
