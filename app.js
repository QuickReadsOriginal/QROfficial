import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8yyxnWRSr6BcTY2hCzLORw5lUxAB2Qoc",
  authDomain: "quick-reads-ratings01.firebaseapp.com",
  projectId: "quick-reads-ratings01",
  storageBucket: "quick-reads-ratings01.firebasestorage.app",
  messagingSenderId: "432321253003",
  appId: "1:432321253003:web:7c794933ef71f4e5e7ce8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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
