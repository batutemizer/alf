const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../db.sqlite');
const db = new sqlite3.Database(dbPath);

module.exports = {
  addAttendance: (student_id, date, time_slot, device_id, qr_content, callback) => {
    db.run(
      `INSERT INTO attendance (student_id, date, time_slot, device_id, qr_content) VALUES (?, ?, ?, ?, ?)`,
      [student_id, date, time_slot, device_id, qr_content],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },

  checkAttendance: (student_id, date, time_slot, callback) => {
    db.get(
      `SELECT * FROM attendance WHERE student_id = ? AND date = ? AND time_slot = ?`,
      [student_id, date, time_slot],
      (err, row) => {
        callback(err, row);
      }
    );
  },

  checkAttendanceByDevice: (device_id, date, time_slot, callback) => {
    db.get(
      `SELECT * FROM attendance WHERE device_id = ? AND date = ? AND time_slot = ?`,
      [device_id, date, time_slot],
      (err, row) => {
        callback(err, row);
      }
    );
  },

  listAttendance: (date, time_slot, callback) => {
    db.all(
      `SELECT a.*, s.name, s.surname FROM attendance a JOIN students s ON a.student_id = s.id WHERE a.date = ? AND a.time_slot = ?`,
      [date, time_slot],
      (err, rows) => {
        callback(err, rows);
      }
    );
  },

  listNonAttendees: (date, time_slot, callback) => {
    db.all(
      `SELECT * FROM students WHERE id NOT IN (SELECT student_id FROM attendance WHERE date = ? AND time_slot = ?)` ,
      [date, time_slot],
      (err, rows) => {
        callback(err, rows);
      }
    );
  },
}; 