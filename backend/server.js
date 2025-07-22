const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cron = require('node-cron');
const { sendSMS } = require('./sms');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['https://www.softnix.xyz', 'http://www.softnix.xyz'],
  credentials: true
}));
app.use(bodyParser.json());

// Veritabanı bağlantısı
const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err.message);
  } else {
    console.log('SQLite veritabanına bağlanıldı.');
  }
});

// Tablo oluşturma (ilk çalıştırmada)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    device_id TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_unique_id TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date TEXT,
    time_slot TEXT,
    device_id TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id)
  )`);
});

// Her gece 00:00'da yoklama kayıtlarını sil
cron.schedule('0 0 * * *', () => {
  db.run('DELETE FROM attendance', [], (err) => {
    if (err) {
      console.error('Yoklama kayıtları silinemedi:', err.message);
    } else {
      console.log('Tüm yoklama kayıtları (attendance) başarıyla silindi.');
    }
  });
});

// Son güncelleme saatini frontend'e göstermek için değişken
let lastUpdate = {
  sabah: null,
  oglen: null,
  aksam: null
};

// Katılım sağlamayanlara SMS gönderme fonksiyonu
function sendAbsenteeSMS(timeSlot) {
  const date = new Date().toISOString().slice(0, 10);
  db.all(
    `SELECT * FROM students WHERE id NOT IN (SELECT student_id FROM attendance WHERE date = ? AND time_slot = ?)`,
    [date, timeSlot],
    (err, rows) => {
      if (err) {
        console.error('SMS için yoklama listesi alınamadı:', err.message);
        return;
      }
      rows.forEach(student => {
        sendSMS(student.parent_phone, `[${timeSlot.toUpperCase()}] Yoklama alınmadı. Lütfen öğrencinizin derse katılımını kontrol edin.`);
      });
      lastUpdate[timeSlot] = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      console.log(`${timeSlot} için SMS gönderildi ve son güncelleme kaydedildi.`);
    }
  );
}

// Sabah SMS: 10:30
cron.schedule('30 10 * * *', () => sendAbsenteeSMS('sabah'));
// Öğlen SMS: 13:30
cron.schedule('30 13 * * *', () => sendAbsenteeSMS('oglen'));
// Akşam SMS: 18:00
cron.schedule('0 18 * * *', () => sendAbsenteeSMS('aksam'));

// Routes
const attendanceRoutes = require('./routes/attendance');
app.use('/api/attendance', attendanceRoutes);
const studentRoutes = require('./routes/student');
app.use('/api/student', studentRoutes);

// Yönetici girişi (tek kullanıcı, sabit şifre)
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'alf1234') {
    res.json({ success: true, message: 'Giriş başarılı.' });
  } else {
    res.status(401).json({ success: false, message: 'Şifre yanlış.' });
  }
});

// Basit test endpointi
app.get('/', (req, res) => {
  res.send('ALF Kurs Merkezi Backend Çalışıyor!');
});

// Son güncelleme saatini dönen endpoint
app.get('/api/last-update', (req, res) => {
  res.json(lastUpdate);
});

app.listen(PORT, () => {
  console.log(`Backend sunucu http://localhost:${PORT} adresinde çalışıyor.`);
}); 