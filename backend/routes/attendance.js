const express = require('express');
const router = express.Router();
const attendanceModel = require('../models/attendance');
const studentModel = require('../models/student');

// Yoklama al
router.post('/take', (req, res) => {
  const { name, surname, device_id, time_slot, qr_content } = req.body;
  const date = new Date().toISOString().slice(0, 10);

  // Aynı cihazdan aynı zaman diliminde yoklama kontrolü
  attendanceModel.checkAttendanceByDevice(device_id, date, time_slot, (err, row) => {
    if (row) {
      return res.status(400).json({ success: false, message: 'Bir cihazdan bu zaman dilimi için yalnızca 1 yoklama alınabilir.' });
    }
    // Öğrenci ve cihaz eşleşmesi kontrolü
    studentModel.findStudent(name, surname, device_id, (err, student) => {
      if (err || !student) {
        return res.status(404).json({ success: false, message: 'Öğrenci bulunamadı veya cihaz eşleşmiyor.' });
      }
      attendanceModel.checkAttendance(student.id, date, time_slot, (err, row) => {
        if (row) {
          return res.status(400).json({ success: false, message: 'Bu zaman diliminde zaten yoklama alınmış.' });
        }
        attendanceModel.addAttendance(student.id, date, time_slot, device_id, qr_content, (err, id) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Yoklama kaydedilemedi.' });
          }
          res.json({ success: true, message: 'Yoklama alındı.' });
        });
      });
    });
  });
});

// Belirli bir zaman dilimi için yoklama listesi
router.get('/list', (req, res) => {
  const { date, time_slot } = req.query;
  attendanceModel.listAttendance(date, time_slot, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Liste alınamadı.' });
    res.json({ success: true, data: rows });
  });
});

// Katılım sağlamayanlar
router.get('/nonattendees', (req, res) => {
  const { date, time_slot } = req.query;
  attendanceModel.listNonAttendees(date, time_slot, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Liste alınamadı.' });
    res.json({ success: true, data: rows });
  });
});

module.exports = router; 