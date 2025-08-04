import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

// 🔑 Paste your Firebase config here from Step 2
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const ratingsRef = ref(db, 'ratings');

// Form submit
document.getElementById('ratingForm').addEventListener('submit', e => {
  e.preventDefault();
  const rating = {
    name: document.getElementById('name').value.trim() || 'Anonymous',
    stars: Number(document.getElementById('stars').value),
    comment: document.getElementById('comment').value.trim(),
    ts: Date.now()
  };
  if (rating.stars) {
    push(ratingsRef, rating)
      .then(() => e.target.reset())
      .catch(alert);
  }
});

// Real-time display
onValue(ratingsRef, snap => {
  const data = snap.val() || {};
  const list = Object.values(data).sort((a, b) => b.ts - a.ts);
  let sum = 0;

  const box = document.getElementById('ratingsDisplay');
  box.innerHTML = '';
  list.forEach(r => {
    sum += r.stars;
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${r.name}</strong> 
      <span class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span><br>
      ${r.comment || ''}</p><hr>`;
    box.appendChild(div);
  });

  const avg = list.length ? (sum / list.length).toFixed(1) : '—';
  document.getElementById('averageRating').textContent = `Average Rating: ${avg} ${avg === '—' ? '' : '★'}`;
});
