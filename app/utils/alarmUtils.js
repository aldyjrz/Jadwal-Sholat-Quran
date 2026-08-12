// Fungsi untuk membuat beep sound
export const playBeep = (frequency = 1000, duration = 300, volume = 0.3) => {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
        console.error('Beep gagal:', e);
        // Fallback: gunakan audio file
        const audio = new Audio('/alarm.mp3');
        audio.volume = volume;
        audio.play().catch(() => { });
    }
};

// Beep untuk adzan (panjang)
export const playAdzanBeep = () => {
    playBeep(1000, 200, 0.4); // 200ms
    setTimeout(() => playBeep(1200, 200, 0.4), 300);
    setTimeout(() => playBeep(1400, 200, 0.4), 600);
};

// Beep untuk iqomah (pendek)
export const playIqomahBeep = () => {
    playBeep(800, 150, 0.3);
    setTimeout(() => playBeep(800, 150, 0.3), 250);
};

// Beep untuk peringatan (medium)
export const playWarningBeep = () => {
    playBeep(900, 250, 0.35);
};

// Hitung waktu sampai target time
export const getTimeUntil = (targetHour, targetMinute) => {
    const now = new Date();
    const target = new Date();
    target.setHours(targetHour, targetMinute, 0);

    // Jika waktu sudah lewat hari ini, hitung untuk besok
    if (target < now) {
        target.setDate(target.getDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    return {
        total: diff,
        seconds: Math.floor(diff / 1000),
        minutes: Math.floor(diff / (1000 * 60)),
        milliseconds: diff
    };
};
