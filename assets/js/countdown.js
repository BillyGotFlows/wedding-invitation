/**
 * Countdown Timer to the Wedding of Bakri & Rehab
 * Target Date: 28 September 2026 at 19:30 (7:30 PM) GMT+3
 */

(function () {
  // Wedding target date: September 28, 2026 at 19:30:00 GMT+03:00
  const targetDate = new Date('2026-09-28T19:30:00+03:00').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const countdownBanner = document.getElementById('countdown-message');

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      if (countdownBanner) {
        countdownBanner.innerText = 'بارك الله لهما وبارك عليهما وجمع بينهما في خير ✨ اليوم الموعود!';
      }
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, '0');

    if (daysEl) daysEl.innerText = pad(days);
    if (hoursEl) hoursEl.innerText = pad(hours);
    if (minutesEl) minutesEl.innerText = pad(minutes);
    if (secondsEl) secondsEl.innerText = pad(seconds);
  }

  // Initial call and periodic interval
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();
