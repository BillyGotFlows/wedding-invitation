/**
 * Main Controller Script for Wedding Invitation
 * Handles Envelope Open animation, Audio Synthesizer/Player, Calendar Sync, and Scroll Effects.
 */

(function () {
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const openInvitationBtn = document.getElementById('open-invitation-btn');
  const waxSeal = document.getElementById('wax-seal');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const googleCalendarBtn = document.getElementById('google-calendar-btn');
  const appleCalendarBtn = document.getElementById('apple-calendar-btn');

  // ==========================================
  // 1. Envelope Opening Transition
  // ==========================================
  function openEnvelope() {
    if (!envelopeOverlay) return;
    envelopeOverlay.classList.add('opened');
    
    // Attempt gentle start of romantic melody
    if (!audioPlaying) {
      toggleAudio();
    }
  }

  if (openInvitationBtn) {
    openInvitationBtn.addEventListener('click', openEnvelope);
  }
  if (waxSeal) {
    waxSeal.addEventListener('click', openEnvelope);
  }

  // ==========================================
  // 2. Romantic Classical Ambient Melody (Web Audio API)
  // Zero external MP3 dependency needed; plays soft, warm classical harp/piano chords.
  // ==========================================
  let audioCtx = null;
  let audioPlaying = false;
  let melodyInterval = null;

  // Pentatonic romantic notes (E-flat major / C minor warm harmonics)
  const notes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25  // E5
  ];

  // Arpeggio pattern
  const melodyPattern = [0, 2, 4, 7, 5, 4, 2, 3, 1, 2, 4, 6, 4, 2, 0];
  let stepIndex = 0;

  function playWarmChime(freq, duration = 2.4, gainLevel = 0.08) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine'; // warm, gentle sine tone
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Smooth attack and long gentle release
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(gainLevel, audioCtx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  function startMelody() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    stepIndex = 0;
    melodyInterval = setInterval(() => {
      const noteFreq = notes[melodyPattern[stepIndex % melodyPattern.length]];
      playWarmChime(noteFreq, 2.2, 0.07);

      // Every 4 steps, play a gentle bass note
      if (stepIndex % 4 === 0) {
        playWarmChime(noteFreq / 2, 3.5, 0.06);
      }
      stepIndex++;
    }, 700);
  }

  function stopMelody() {
    if (melodyInterval) {
      clearInterval(melodyInterval);
      melodyInterval = null;
    }
  }

  function toggleAudio() {
    if (!audioPlaying) {
      startMelody();
      audioPlaying = true;
      if (audioToggleBtn) {
        audioToggleBtn.classList.add('playing');
        audioToggleBtn.innerHTML = `
          <svg class="w-5 h-5 text-champagne" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        `;
        audioToggleBtn.setAttribute('title', 'كتم الصوت الموسيقي');
      }
    } else {
      stopMelody();
      audioPlaying = false;
      if (audioToggleBtn) {
        audioToggleBtn.classList.remove('playing');
        audioToggleBtn.innerHTML = `
          <svg class="w-5 h-5 text-ivory-muted opacity-70" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.27 4.27c-.4.28-.85.49-1.34.61v2.04c1.19-.24 2.25-.8 3.12-1.58L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2V7z"/>
          </svg>
        `;
        audioToggleBtn.setAttribute('title', 'تشغيل الموسيقى الهادئة');
      }
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAudio);
  }

  // ==========================================
  // 3. Add to Calendar (Google Calendar & iCal)
  // Event: 28 September 2026 at 19:30 (Syria Time GMT+3 = 16:30 UTC)
  // End: ~23:30 (20:30 UTC)
  // ==========================================
  const eventDetails = {
    title: 'حفل زفاف بكري واتار & رحاب دللو',
    description: 'نتشرف بحضوركم لمشاركتنا فرحة العمر في حفل زفاف بكري واتار ورحاب دللو. دامت دياركم عامرة بالأفراح والمسرات.',
    location: 'الفرقان - نادي الضباط - صالة ايفانكا',
    startUTC: '20260928T163000Z',
    endUTC: '20260928T210000Z'
  };

  if (googleCalendarBtn) {
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.startUTC}/${eventDetails.endUTC}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
    googleCalendarBtn.href = googleUrl;
  }

  if (appleCalendarBtn) {
    appleCalendarBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Bakri and Rehab Wedding//Invitation//AR',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `SUMMARY:${eventDetails.title}`,
        `DESCRIPTION:${eventDetails.description}`,
        `LOCATION:${eventDetails.location}`,
        `DTSTART:${eventDetails.startUTC}`,
        `DTEND:${eventDetails.endUTC}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'wedding-bakri-rehab.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ==========================================
  // 4. Scroll Reveal Animations
  // ==========================================
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
    observer.observe(el);
  });
})();
