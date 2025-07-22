const express = require('express');
const router = express.Router();
const studentModel = require('../models/student');

// Öğrenci ekle
router.post('/add', (req, res) => {
  const { name, surname, parent_phone, device_id } = req.body;
  studentModel.addStudent(name, surname, parent_phone, device_id, (err, id) => {
    if (err) return res.status(500).json({ success: false, message: 'Öğrenci eklenemedi.' });
    res.json({ success: true, message: 'Öğrenci eklendi.', id });
  });
});

// Tüm öğrencileri listele
router.get('/list', (req, res) => {
  studentModel.listStudents((err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Liste alınamadı.' });
    res.json({ success: true, data: rows });
  });
});

module.exports = router; 