/**
 * RSVP & Guestbook Management Script
 * Handles form validation, localStorage persistence, WhatsApp message formatting,
 * and dynamic guest wishes display.
 */

(function () {
  const STORAGE_KEY = 'bakri_rehab_wedding_rsvp_v1';
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesListContainer = document.getElementById('wishes-list');
  const confirmationModal = document.getElementById('confirmation-modal');
  const closeModalBtn = document.getElementById('close-confirmation-modal');
  const whatsappShareBtn = document.getElementById('whatsapp-share-btn');
  const viewGuestlistBtn = document.getElementById('view-guestlist-btn');
  const guestlistModal = document.getElementById('guestlist-modal');
  const closeGuestlistBtn = document.getElementById('close-guestlist-modal');
  const guestlistItemsContainer = document.getElementById('guestlist-items');
  const guestlistSummary = document.getElementById('guestlist-summary');
  const clearGuestlistBtn = document.getElementById('clear-guestlist-btn');

  // Load existing RSVPs
  function getStoredRSVPs() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading localStorage', e);
      return [];
    }
  }

  // Save RSVPs
  function saveRSVP(entry) {
    const list = getStoredRSVPs();
    list.unshift(entry); // newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    renderWishes();
  }

  // Render Wishes on the page
  function renderWishes() {
    if (!wishesListContainer) return;
    const rsvps = getStoredRSVPs();
    const wishesWithText = rsvps.filter(item => item.wish && item.wish.trim().length > 0);

    // Initial default seed wishes if empty so it looks welcoming
    if (wishesWithText.length === 0) {
      wishesListContainer.innerHTML = `
        <div class="wish-bubble text-center py-6 text-ivory-muted">
          <p class="font-arabic-serif text-lg">✨ كن أول من يشارك العروسين أصدق التهاني والأمنيات بالبركة والسعادة ✨</p>
        </div>
      `;
      return;
    }

    wishesListContainer.innerHTML = wishesWithText.slice(0, 10).map(item => `
      <div class="wish-bubble">
        <div class="flex items-center justify-between mb-2">
          <span class="font-bold text-champagne text-lg">${escapeHtml(item.name)}</span>
          <span class="text-xs text-ivory-muted font-sans">${new Date(item.timestamp).toLocaleDateString('ar-SY', { month: 'short', day: 'numeric' })}</span>
        </div>
        <p class="text-ivory leading-relaxed font-arabic-serif">${escapeHtml(item.wish)}</p>
      </div>
    `).join('');
  }

  // Handle Form Submission
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('rsvp-name').value.trim();
      const status = document.getElementById('rsvp-status').value;
      const count = document.getElementById('rsvp-count').value;
      const wish = document.getElementById('rsvp-wish').value.trim();

      if (!name) {
        alert('يرجى كتابة الاسم الكريم للمتابعة.');
        return;
      }

      const entry = {
        id: Date.now().toString(),
        name,
        status, // 'attending' or 'declining'
        count: status === 'attending' ? parseInt(count, 10) : 0,
        wish,
        timestamp: new Date().toISOString()
      };

      saveRSVP(entry);

      // Create WhatsApp formatted message
      const isAttending = status === 'attending';
      const statusArabic = isAttending 
        ? `يسعدني ويشرفني تأكيد الحضور لحفل الزفاف 🌹 (عدد الحضور: ${count})`
        : `أعتذر بكل مودة عن عدم إمكانية الحضور لظروف خاصة، وأتمنى لكما حياة عامرة بالهناء والبركة 🤍`;

      let whatsappText = `السلام عليكم ورحمة الله وبركاته 💐\n\n`;
      whatsappText += `*الاسم:* ${name}\n`;
      whatsappText += `*رد الدعوة:* ${statusArabic}\n`;
      if (wish) {
        whatsappText += `*التهنئة:* "${wish}"\n\n`;
      }
      whatsappText += `حفل زفاف بكري واتار & رحاب دللو | 28 أيلول 2026`;

      // Set WhatsApp button URL
      if (whatsappShareBtn) {
        whatsappShareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
      }

      // Show confirmation modal
      if (confirmationModal) {
        confirmationModal.classList.add('active');
      }

      // Reset form
      rsvpForm.reset();
    });
  }

  // Close Confirmation Modal
  if (closeModalBtn && confirmationModal) {
    closeModalBtn.addEventListener('click', () => {
      confirmationModal.classList.remove('active');
    });
  }

  // Guestlist Admin Modal Handling
  if (viewGuestlistBtn && guestlistModal) {
    viewGuestlistBtn.addEventListener('click', () => {
      renderGuestlistModal();
      guestlistModal.classList.add('active');
    });
  }

  if (closeGuestlistBtn && guestlistModal) {
    closeGuestlistBtn.addEventListener('click', () => {
      guestlistModal.classList.remove('active');
    });
  }

  // Clear guestlist if needed
  if (clearGuestlistBtn) {
    clearGuestlistBtn.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من رغبتك في مسح سجل الحضور المحلي؟')) {
        localStorage.removeItem(STORAGE_KEY);
        renderGuestlistModal();
        renderWishes();
      }
    });
  }

  function renderGuestlistModal() {
    const list = getStoredRSVPs();
    const attendingList = list.filter(i => i.status === 'attending');
    const totalAttendingGuests = attendingList.reduce((sum, item) => sum + (item.count || 1), 0);
    const decliningCount = list.filter(i => i.status === 'declining').length;

    if (guestlistSummary) {
      guestlistSummary.innerHTML = `
        <div class="grid grid-cols-2 gap-3 text-center my-4">
          <div class="p-3 bg-opacity-40 bg-black rounded border border-gold-border">
            <span class="block text-2xl font-bold text-champagne">${totalAttendingGuests}</span>
            <span class="text-xs text-ivory-muted">إجمالي الحضور المتوقع</span>
          </div>
          <div class="p-3 bg-opacity-40 bg-black rounded border border-gold-border">
            <span class="block text-2xl font-bold text-ivory-muted">${decliningCount}</span>
            <span class="text-xs text-ivory-muted">المعتذرين</span>
          </div>
        </div>
      `;
    }

    if (guestlistItemsContainer) {
      if (list.length === 0) {
        guestlistItemsContainer.innerHTML = '<p class="text-center text-ivory-muted py-4">لا توجد ردود مسجلة بعد.</p>';
        return;
      }

      guestlistItemsContainer.innerHTML = list.map(item => `
        <div class="p-3 mb-2 rounded bg-black bg-opacity-30 border border-gray-700 flex justify-between items-center text-sm">
          <div>
            <span class="font-bold text-ivory">${escapeHtml(item.name)}</span>
            <span class="block text-xs text-ivory-muted">${item.status === 'attending' ? `حاضر (${item.count} شخص)` : 'معتذر'}</span>
          </div>
          <span class="text-xs text-champagne">${new Date(item.timestamp).toLocaleTimeString('ar-SY', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      `).join('');
    }
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initial render
  renderWishes();
})();
