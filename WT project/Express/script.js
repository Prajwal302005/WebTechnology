/* ============================================================
   Smart Medicine Reminder — script.js
   Main application logic
   ============================================================ */

// ── Helpers ──────────────────────────────────────────────────

/** Save / load from localStorage */
const store = {
  get: (k) => JSON.parse(localStorage.getItem(k) || 'null'),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

/** Show a toast notification */
function toast(msg, type = 'info') {
  const wrap = document.getElementById('toastContainer');
  const el = document.createElement('div');
  const icons = { info: '💊', success: '✅', warning: '⚠️', error: '❌' };
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

/** Generate a random 6-char uppercase ID */
function genId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/** Format time as "8:00 AM" */
function fmtTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/** Today's date string YYYY-MM-DD */
function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Dark Mode ─────────────────────────────────────────────────
(function initDarkMode() {
  if (store.get('darkMode')) document.body.classList.add('dark');
})();

function toggleDark() {
  document.body.classList.toggle('dark');
  store.set('darkMode', document.body.classList.contains('dark'));
  document.getElementById('darkBtn').textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
}

// ── Tab Navigation ────────────────────────────────────────────
function switchTab(id) {
  document.querySelectorAll('.nav-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === id));
  document.querySelectorAll('.page').forEach(p =>
    p.classList.toggle('active', p.id === id));
  if (id === 'dashboard') renderDashboard();
  if (id === 'medicines') renderMedicineList();
}

// ── Notification Permission ────────────────────────────────────
async function requestNotifPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    await Notification.requestPermission();
  }
}

// ── Medicine Data ─────────────────────────────────────────────
function getMeds() { return store.get('medicines') || []; }
function saveMeds(m) { store.set('medicines', m); }

function addMedicine(med) {
  const meds = getMeds();
  med.id = genId();
  med.created = today();
  meds.push(med);
  saveMeds(meds);
  toast('Medicine added successfully! 💊', 'success');
}

function deleteMedicine(id) {
  if (!confirm('Delete this medicine?')) return;
  saveMeds(getMeds().filter(m => m.id !== id));
  renderMedicineList();
  toast('Medicine removed.', 'warning');
}

function getMedById(id) { return getMeds().find(m => m.id === id); }

function updateMedicine(id, data) {
  const meds = getMeds().map(m => m.id === id ? { ...m, ...data } : m);
  saveMeds(meds);
}

// ── Today's Status ─────────────────────────────────────────────
function getTodayStatus() { return store.get('todayStatus') || {}; }
function saveTodayStatus(s) { store.set('todayStatus', s); }

function markStatus(medId, status) {
  const s = getTodayStatus();
  s[medId] = { status, time: new Date().toLocaleTimeString() };
  saveTodayStatus(s);
  renderDashboard();
  toast(status === 'taken' ? '✅ Marked as taken!' : '❌ Marked as missed.', status === 'taken' ? 'success' : 'error');
}

// ── Dashboard ─────────────────────────────────────────────────
function renderDashboard() {
  const meds = getMeds();
  const status = getTodayStatus();
  const todayMeds = meds.filter(m => {
    if (!m.startDate || !m.endDate) return true;
    return today() >= m.startDate && today() <= m.endDate;
  });

  // Stats
  const taken = todayMeds.filter(m => status[m.id]?.status === 'taken').length;
  const missed = todayMeds.filter(m => status[m.id]?.status === 'missed').length;
  const pending = todayMeds.length - taken - missed;
  const pct = todayMeds.length ? Math.round((taken / todayMeds.length) * 100) : 0;

  document.getElementById('statTotal').textContent = todayMeds.length;
  document.getElementById('statTaken').textContent = taken;
  document.getElementById('statMissed').textContent = missed;
  document.getElementById('statPct').textContent = `${pct}%`;
  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('progressLabel').textContent = `${pct}% of today's medicines taken`;

  // List
  const list = document.getElementById('dashboardList');
  if (!todayMeds.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">💊</div><p>No medicines scheduled for today.</p></div>`;
    return;
  }
  const sorted = [...todayMeds].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  list.innerHTML = sorted.map(m => {
    const s = status[m.id]?.status;
    const cls = s ? s : '';
    return `
      <div class="medicine-item ${cls}">
        <div class="med-icon">💊</div>
        <div class="med-info">
          <div class="med-name">${m.name}</div>
          <div class="med-details">
            ${m.dosage ? `<strong>${m.dosage}</strong> · ` : ''}
            ${m.time ? fmtTime(m.time) : 'No time set'}
            ${m.notes ? ` · ${m.notes}` : ''}
          </div>
        </div>
        <div class="med-actions">
          ${!s ? `
            <button class="btn btn-success btn-sm" onclick="markStatus('${m.id}','taken')">✅ Taken</button>
            <button class="btn btn-danger btn-sm" onclick="markStatus('${m.id}','missed')">❌ Missed</button>
          ` : `<span class="badge ${s === 'taken' ? 'badge-green' : 'badge-red'}">${s === 'taken' ? '✅ Taken' : '❌ Missed'}</span>`}
          <button class="btn btn-outline btn-sm" onclick="speakMed('${m.id}')">🔊</button>
        </div>
      </div>`;
  }).join('');
}

// ── Medicine List (All) ────────────────────────────────────────
function renderMedicineList() {
  const list = document.getElementById('allMedicineList');
  const meds = getMeds();
  if (!meds.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>No medicines added yet. Click "+ Add Medicine".</p></div>`;
    return;
  }
  list.innerHTML = meds.map(m => `
    <div class="medicine-item">
      <div class="med-icon">💊</div>
      <div class="med-info">
        <div class="med-name">${m.name}</div>
        <div class="med-details">
          ${m.dosage ? m.dosage + ' · ' : ''}
          ${m.time ? fmtTime(m.time) : ''}
          ${m.startDate ? ` · ${m.startDate} → ${m.endDate || '?'}` : ''}
          ${m.notes ? `<br><em>${m.notes}</em>` : ''}
        </div>
      </div>
      <div class="med-actions">
        <button class="btn-icon" title="Edit" onclick="openEditModal('${m.id}')">✏️</button>
        <button class="btn-icon" title="Delete" onclick="deleteMedicine('${m.id}')">🗑️</button>
      </div>
    </div>`).join('');
}

// ── Add Medicine Modal ─────────────────────────────────────────
function openAddModal() {
  document.getElementById('medModalTitle').textContent = 'Add Medicine';
  document.getElementById('medForm').reset();
  document.getElementById('medEditId').value = '';
  document.getElementById('medModal').classList.add('open');
}

function openEditModal(id) {
  const m = getMedById(id);
  if (!m) return;
  document.getElementById('medModalTitle').textContent = 'Edit Medicine';
  document.getElementById('medEditId').value = m.id;
  document.getElementById('fName').value = m.name || '';
  document.getElementById('fDosage').value = m.dosage || '';
  document.getElementById('fTime').value = m.time || '';
  document.getElementById('fStart').value = m.startDate || '';
  document.getElementById('fEnd').value = m.endDate || '';
  document.getElementById('fNotes').value = m.notes || '';
  document.getElementById('medModal').classList.add('open');
}

function closeMedModal() {
  document.getElementById('medModal').classList.remove('open');
}

function saveMedForm() {
  const name = document.getElementById('fName').value.trim();
  if (!name) { toast('Please enter medicine name.', 'error'); return; }
  const data = {
    name,
    dosage: document.getElementById('fDosage').value.trim(),
    time: document.getElementById('fTime').value,
    startDate: document.getElementById('fStart').value,
    endDate: document.getElementById('fEnd').value,
    notes: document.getElementById('fNotes').value.trim(),
  };
  const editId = document.getElementById('medEditId').value;
  if (editId) {
    updateMedicine(editId, data);
    toast('Medicine updated! ✏️', 'success');
  } else {
    addMedicine(data);
  }
  closeMedModal();
  renderMedicineList();
  renderDashboard();
}

// ── Medical Profile ────────────────────────────────────────────
function getProfile() { return store.get('profile') || {}; }
function saveProfile(p) { store.set('profile', p); }

function loadProfileForm() {
  const p = getProfile();
  document.getElementById('pName').value = p.name || '';
  document.getElementById('pAge').value = p.age || '';
  document.getElementById('pBlood').value = p.blood || '';
  document.getElementById('pAllergies').value = p.allergies || '';
  document.getElementById('pDiseases').value = p.diseases || '';
  document.getElementById('pEmergencyContact').value = p.emergencyContact || '';
  document.getElementById('pDoctorName').value = p.doctorName || '';
}

function saveProfileForm() {
  const p = {
    name: document.getElementById('pName').value.trim(),
    age: document.getElementById('pAge').value.trim(),
    blood: document.getElementById('pBlood').value.trim(),
    allergies: document.getElementById('pAllergies').value.trim(),
    diseases: document.getElementById('pDiseases').value.trim(),
    emergencyContact: document.getElementById('pEmergencyContact').value.trim(),
    doctorName: document.getElementById('pDoctorName').value.trim(),
  };
  saveProfile(p);
  toast('Profile saved! 👤', 'success');
  renderProfileDisplay();
}

function renderProfileDisplay() {
  const p = getProfile();
  const initials = (p.name || 'P').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileName').textContent = p.name || 'Your Name';
  document.getElementById('profileSub').textContent = p.age ? `Age ${p.age} · Blood: ${p.blood || 'N/A'}` : 'Complete your profile';
}

// ── Voice / Speech ─────────────────────────────────────────────
let speaking = false;
function speakText(text) {
  if (!('speechSynthesis' in window)) { toast('Voice not supported in this browser.', 'error'); return; }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.85; utt.pitch = 1; utt.lang = 'en-US';
  window.speechSynthesis.speak(utt);
}

function speakMed(id) {
  const m = getMedById(id);
  if (!m) return;
  speakText(`Time to take ${m.name}. Dosage: ${m.dosage || 'as prescribed'}. ${m.notes || ''}`);
}

function speakTodayReminders() {
  const btn = document.getElementById('voiceBtn');
  if (!('speechSynthesis' in window)) { toast('Voice not supported.', 'error'); return; }
  const meds = getMeds().filter(m => {
    if (!m.startDate || !m.endDate) return true;
    return today() >= m.startDate && today() <= m.endDate;
  });
  if (!meds.length) { speakText("No medicines scheduled for today."); return; }
  const status = getTodayStatus();
  const pending = meds.filter(m => !status[m.id]);
  if (!pending.length) { speakText("All medicines for today have been marked."); return; }
  const text = "Today's pending medicines: " + pending.map(m =>
    `${m.name}, ${m.dosage || ''} at ${fmtTime(m.time) || 'anytime'}`).join('. ');
  speakText(text);
  btn.classList.add('speaking');
  window.speechSynthesis.onend = () => btn.classList.remove('speaking');
}

// ── Alarm / Reminder Checker ───────────────────────────────────
let alarmPlaying = false;
let audioCtx = null;

function playAlarm() {
  if (alarmPlaying) return;
  alarmPlaying = true;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 659, 784];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(.4, audioCtx.currentTime + i * .25);
      gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + i * .25 + .2);
      osc.start(audioCtx.currentTime + i * .25);
      osc.stop(audioCtx.currentTime + i * .25 + .25);
    });
    setTimeout(() => { alarmPlaying = false; }, 2000);
  } catch (_) { alarmPlaying = false; }
}

function checkReminders() {
  const now = new Date();
  const hhmm = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  const meds = getMeds().filter(m => {
    if (!m.startDate || !m.endDate) return true;
    return today() >= m.startDate && today() <= m.endDate;
  });
  const status = getTodayStatus();
  meds.forEach(m => {
    if (m.time === hhmm && !status[m.id]) {
      playAlarm();
      const msg = `💊 Time to take ${m.name} (${m.dosage || 'as prescribed'})`;
      if (Notification.permission === 'granted') {
        new Notification('Medicine Reminder', { body: msg, icon: 'https://img.icons8.com/emoji/48/pill.png' });
      }
      toast(msg, 'warning');
    }
  });
}

// ── Print Report ───────────────────────────────────────────────
function printReport() {
  const p = getProfile();
  const meds = getMeds();
  const status = getTodayStatus();
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html><html><head><title>Medical Report</title>
    <style>
      body{font-family:Arial,sans-serif;padding:32px;color:#111;max-width:700px;margin:0 auto}
      h1{color:#1a56db;border-bottom:2px solid #1a56db;padding-bottom:8px}
      h2{color:#374151;margin-top:24px}
      table{width:100%;border-collapse:collapse;margin-top:12px}
      td,th{border:1px solid #ddd;padding:10px 14px;text-align:left;font-size:14px}
      th{background:#1a56db;color:#fff}
      .badge{display:inline-block;padding:2px 10px;border-radius:99px;font-size:12px}
      .red{background:#fee2e2;color:#b91c1c} .green{background:#dcfce7;color:#15803d}
      @media print{button{display:none}}
    </style></head><body>
    <h1>🏥 Smart Medicine Reminder — Medical Report</h1>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <h2>👤 Patient Profile</h2>
    <table>
      <tr><td><strong>Name</strong></td><td>${p.name || 'N/A'}</td><td><strong>Age</strong></td><td>${p.age || 'N/A'}</td></tr>
      <tr><td><strong>Blood Group</strong></td><td>${p.blood || 'N/A'}</td><td><strong>Doctor</strong></td><td>${p.doctorName || 'N/A'}</td></tr>
      <tr><td><strong>Allergies</strong></td><td colspan="3">${p.allergies || 'None'}</td></tr>
      <tr><td><strong>Conditions</strong></td><td colspan="3">${p.diseases || 'None'}</td></tr>
      <tr><td><strong>Emergency Contact</strong></td><td colspan="3">${p.emergencyContact || 'N/A'}</td></tr>
    </table>
    <h2>💊 All Medicines</h2>
    <table>
      <tr><th>Name</th><th>Dosage</th><th>Time</th><th>Start</th><th>End</th><th>Notes</th></tr>
      ${meds.map(m => `<tr><td>${m.name}</td><td>${m.dosage||''}</td><td>${fmtTime(m.time)}</td><td>${m.startDate||''}</td><td>${m.endDate||''}</td><td>${m.notes||''}</td></tr>`).join('')}
    </table>
    <h2>📅 Today's Status</h2>
    <table>
      <tr><th>Medicine</th><th>Status</th><th>Time Marked</th></tr>
      ${meds.map(m => {
        const s = status[m.id];
        return `<tr><td>${m.name}</td>
          <td><span class="badge ${s?.status === 'taken' ? 'green' : s?.status === 'missed' ? 'red' : ''}">${s?.status || 'Pending'}</span></td>
          <td>${s?.time || '-'}</td></tr>`;
      }).join('')}
    </table>
    <p style="margin-top:32px;color:#6b7280;font-size:12px">Generated by Smart Medicine Reminder · ${new Date().toLocaleString()}</p>
    <button onclick="window.print()" style="margin-top:16px;padding:10px 24px;background:#1a56db;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer">🖨️ Print</button>
    </body></html>`);
  win.document.close();
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  requestNotifPermission();
  loadProfileForm();
  renderProfileDisplay();
  renderDashboard();
  renderMedicineList();

  // Check reminders every minute
  setInterval(checkReminders, 60000);

  // Reset daily status at midnight
  const lastReset = store.get('lastReset');
  if (lastReset !== today()) { store.set('todayStatus', {}); store.set('lastReset', today()); }

  // Dark button label
  document.getElementById('darkBtn').textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
});
